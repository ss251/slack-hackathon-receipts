// Receipts — the core pipeline: a summon question → RTS search-as-summoner → judge → receipt card.
import { searchContext, type RtsHit } from "./rts.ts";
import { extractKeyword, judge } from "./llm.ts";

export interface Receipt {
  found: boolean;
  question: string;
  keyword: string;
  best?: RtsHit;
  isDecision: boolean;
  unchanged: boolean;
  count: number;          // how many prior mentions of this topic surfaced
  blocks: any[];          // Block Kit for chat.postMessage
  text: string;           // fallback/notification text
}

function fmtDate(ts?: string): string {
  if (!ts) return "";
  const secs = Number(String(ts).split(".")[0]);
  if (!secs) return "";
  return new Date(secs * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// RTS returns an empty author for username-override (persona) posts, so resolve the real
// display name from the source message (bot token): username override, else the user's real_name.
async function enrichAuthor(botToken: string, channelId?: string, ts?: string): Promise<string> {
  if (!botToken || !channelId || !ts) return "";
  const call = async (m: string, b: Record<string, unknown>) =>
    (await fetch(`https://slack.com/api/${m}`, { method: "POST",
      headers: { Authorization: `Bearer ${botToken}`, "Content-Type": "application/json" }, body: JSON.stringify(b) })).json();
  try {
    const h = await call("conversations.history", { channel: channelId, latest: ts, oldest: ts, inclusive: true, limit: 1 });
    const msg = h?.messages?.[0];
    if (msg?.username) return msg.username;                 // persona (username override)
    if (msg?.user) {
      const u = await call("users.info", { user: msg.user });
      return u?.user?.profile?.real_name || u?.user?.real_name || u?.user?.name || "";
    }
  } catch { /* fall through */ }
  return "";
}

/** Run the whole thing. `userToken` = the summoner's token (RTS searches as them).
 *  `botToken` (optional) enriches the author display name from the source message. */
export async function buildReceipt(question: string, userToken: string, botToken = ""): Promise<Receipt> {
  const keyword = await extractKeyword(question);
  const res = await searchContext({ token: userToken, query: keyword });
  const hits = res.hits.filter(h => (h.text || "").trim());
  const j = await judge(question, hits);
  const best = j.index >= 0 ? hits[j.index] : undefined;
  if (best && !best.author) best.author = await enrichAuthor(botToken, best.channelId, best.ts);

  if (!best) {
    return {
      found: false, question, keyword, isDecision: false, unchanged: true, count: hits.length,
      text: `No prior decision found for “${keyword}”.`,
      blocks: [{ type: "section", text: { type: "mrkdwn",
        text: `:mag: I searched what you can see for *${keyword}* — no prior decision on record. This might be a fresh one.` } }],
    };
  }

  const who = best.author ? `@${best.author}` : "someone";
  const where = best.channelName ? `#${best.channelName}` : "a channel";
  const date = fmtDate(best.ts);
  const quote = (best.text || "").replace(/\s+/g, " ").trim();
  const countLine = hits.length > 1 ? `_asked & answered ${hits.length}× · searched as you (permission-aware)_` : `_searched as you (permission-aware)_`;

  const blocks: any[] = [
    { type: "section", text: { type: "mrkdwn",
      text: `:receipt: *Receipts* — ${j.isDecision ? "here's the prior decision" : "closest prior answer"} by *${who}* in *${where}*${date ? ` on ${date}` : ""}:` } },
    { type: "section", text: { type: "mrkdwn", text: `> ${quote.slice(0, 400)}` } },
    { type: "context", elements: [{ type: "mrkdwn", text: `${countLine}${j.unchanged ? " · :white_check_mark: what's changed since: nothing" : " · :warning: a later message may revise this"}` }] },
  ];
  if (best.permalink) {
    blocks.push({ type: "actions", elements: [
      { type: "button", text: { type: "plain_text", text: "↪ Jump to message", emoji: true }, url: best.permalink, action_id: "jump" },
    ]});
  }

  return {
    found: true, question, keyword, best, isDecision: j.isDecision, unchanged: j.unchanged, count: hits.length, blocks,
    text: `${j.isDecision ? "Prior decision" : "Prior answer"} by ${who} in ${where}: ${quote.slice(0, 140)}${best.permalink ? " " + best.permalink : ""}`,
  };
}
