// Receipts — the live Slack agent (Bolt + Socket Mode).
// Summon: @Receipts <question>  OR  the "Pull receipts" message shortcut.
// It searches the workspace AS the summoner (RTS, permission-aware) and posts the receipt card.
import "dotenv/config";
import { App } from "@slack/bolt";
import { buildReceipt } from "./receipts.ts";

const BOT = process.env.SLACK_BOT_TOKEN ?? "";
const APP_TOKEN = process.env.SLACK_APP_TOKEN ?? "";
const SIGNING = process.env.SLACK_SIGNING_SECRET ?? "";
// MVP: search as the installer's user token. (Production: per-user OAuth or the event's
// action_token so it searches as whoever actually summoned — same RTS call, different token.)
const USER = process.env.SLACK_USER_TOKEN ?? "";

for (const [k, v] of Object.entries({ SLACK_BOT_TOKEN: BOT, SLACK_APP_TOKEN: APP_TOKEN, SLACK_USER_TOKEN: USER })) {
  if (!v || /REPLACE_ME/.test(v)) { console.error(`Missing ${k} in .env.local`); process.exit(1); }
}

const app = new App({ token: BOT, appToken: APP_TOKEN, signingSecret: SIGNING || undefined, socketMode: true });

function stripMention(text: string): string {
  return (text || "").replace(/<@[A-Z0-9]+>/g, "").trim();
}

async function respond(question: string, say: any, thread_ts?: string) {
  if (!question) { await say({ text: "Ask me what was decided — e.g. `@Receipts did we decide to drop Node 18?`", thread_ts }); return; }
  const r = await buildReceipt(question, USER, BOT);
  await say({ text: r.text, blocks: r.blocks, thread_ts, unfurl_links: false });
}

// Hero beat: @Receipts <question>
app.event("app_mention", async ({ event, say }: any) => {
  const q = stripMention((event as any).text);
  const thread_ts = (event as any).thread_ts; // reply in-channel for top-level mentions
  await respond(q, say, thread_ts);
});

// Message shortcut "Pull receipts" (callback_id: pull_receipts) — summon on a specific message
app.shortcut("pull_receipts", async ({ shortcut, ack, client }: any) => {
  await ack();
  const s = shortcut as any;
  const question = stripMention(s.message?.text || "");
  const channel = s.channel?.id;
  const thread_ts = s.message?.thread_ts || s.message?.ts;
  const r = await buildReceipt(question, USER, BOT);
  if (channel) await client.chat.postMessage({ channel, text: r.text, blocks: r.blocks, thread_ts, unfurl_links: false });
});

(async () => {
  await app.start();
  console.log("🧾 Receipts is running (Socket Mode). Summon it: @Receipts <question>");
})();
