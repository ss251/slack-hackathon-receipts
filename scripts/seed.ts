// Receipts — seed a BELIEVABLE demo workspace: real personas talking in #engineering, a decision
// made and later re-litigated, a thrice-asked question, plus a private #leadership decision the
// summoner can't see (the ACL kicker). Personas post via chat:write.customize with hosted avatars
// (icon_url) so they render as distinct people; the receipt resolves names via conversations.history.
//
// Idempotent RESET+RESEED: discovers #engineering by RTS (Grid hides it from conversations.list,
// but by-ID ops work), wipes its bot messages, and reposts clean. #leadership is invisible to the
// summoner by design, so its avatars don't matter — created once if missing, otherwise left alone.
//
//   bun run seed
// Needs .env.local: SLACK_BOT_TOKEN (chat:write.customize, groups:write), SLACK_USER_TOKEN.

import "dotenv/config";
import { searchContext } from "../src/rts.ts";

const BOT = process.env.SLACK_BOT_TOKEN ?? "";
const USER = process.env.SLACK_USER_TOKEN ?? "";
const g = (s: string) => `\x1b[32m${s}\x1b[0m`;
const r = (s: string) => `\x1b[31m${s}\x1b[0m`;

async function api(method: string, body: Record<string, unknown>, token = BOT) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return res.json() as any;
}
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

const av = (seed: string, bg: string) =>
  `https://api.dicebear.com/9.x/notionists/png?seed=${seed}&size=192&backgroundColor=${bg}&radius=50`;
const DANA = { username: "Dana Okafor", icon_url: av("DanaOkafor7", "b6e3f4") };
const SAM  = { username: "Sam Rivera",  icon_url: av("SamRivera3",  "c0aede") };
const PRIYA= { username: "Priya Nair",  icon_url: av("PriyaNair9",  "ffdfbf") };
const LEO  = { username: "Leo Park",    icon_url: av("LeoPark2",    "d1d4f9") };
const MAYA = { username: "Maya Chen",   icon_url: av("MayaChen5",   "ffd5dc") };

async function say(channel: string, who: any, text: string) {
  const res = await api("chat.postMessage", { channel, text, ...who });
  if (!res.ok) console.log(r(`   ✗ post (${who.username}): ${res.error}`));
  await wait(750);
  return res;
}

async function wipeBotMessages(channelId: string) {
  const hist = await api("conversations.history", { channel: channelId, limit: 200 });
  let n = 0;
  for (const m of hist.messages || []) {
    if (m.bot_id || m.subtype === "bot_message") { const d = await api("chat.delete", { channel: channelId, ts: m.ts }); if (d.ok) n++; await wait(120); }
  }
  return n;
}

/** Find a channel id by searching, as the summoner, for a distinctive marker in it. */
async function findChannelByContent(marker: string): Promise<string | undefined> {
  const res = await searchContext({ token: USER, query: marker });
  return res.hits[0]?.channelId;
}

async function seedEngineering(channelId: string) {
  console.log(`   wiping + reseeding #engineering (${channelId})…`);
  const wiped = await wipeBotMessages(channelId);
  console.log(`   cleaned ${wiped} old messages`);
  // the decision (made "earlier")
  await say(channelId, SAM,   "heads up — Node 18 hit end-of-life upstream last week, and we're still shipping it in the v3 build.");
  await say(channelId, PRIYA, "that's a real problem, no more security patches. are we dropping it?");
  await say(channelId, DANA,  "📌 Decision: we're dropping Node 18 support in v3. It's EOL'd upstream — anyone still on it should pin v2. Confirmed with the platform team, this is final.");
  await say(channelId, SAM,   "👍 on it — I'll update the CI matrix and the release docs.");
  // the migration question (asked 3× = the FAQ-deflect beat)
  await say(channelId, LEO,   "how do I run the DB migrations locally?");
  await say(channelId, DANA,  "`bun run migrate:local` after you pull — just make sure DATABASE_URL is set in your .env");
  await say(channelId, MAYA,  "newbie q — how do I run the migrations on my machine?");
  await say(channelId, SAM,   "^ it's `bun run migrate:local`. we should really FAQ this one.");
  // the re-litigation (where the demo summons Receipts)
  await say(channelId, LEO,   "quick q — are we keeping Node 18 for the v3 release or not? saw a PR still targeting it");
  await say(channelId, PRIYA, "wait didn't we already settle this? I can never find where these decisions land 😩");
  await say(channelId, LEO,   "and… how do you run the migrations locally again? can't find where that was said");
  console.log(g("   ✓ #engineering reseeded with real personas + avatars"));
}

async function ensureLeadership(summonerId: string) {
  // invisible to the summoner by design → avatars irrelevant, only create if the decision isn't there.
  const exists = await findChannelByContent("Mixpanel"); // will be undefined for the summoner (not a member) — so probe the bot's own list
  // bot can't list it either (Grid), so just (re)create if create succeeds; name_taken = already there = fine.
  const c = await api("conversations.create", { name: "leadership", is_private: true });
  if (c.ok) {
    await say(c.channel.id, DANA, "📌 Decision: we're moving analytics off Amplitude to Mixpanel — finance approved the budget. Rolling out next quarter. Keep this in here for now.");
    console.log(g("   ✓ #leadership created + seeded (summoner NOT a member — ACL control)"));
  } else if (c.error === "name_taken") {
    console.log("   = #leadership already exists (ACL control intact, avatars irrelevant — invisible to summoner)");
  } else {
    console.log(r(`   ✗ #leadership: ${c.error}`));
  }
}

async function main() {
  if (!BOT.startsWith("xoxb-") || !USER.startsWith("xoxp-")) { console.log(r("Need SLACK_BOT_TOKEN + SLACK_USER_TOKEN in .env.local.")); process.exit(1); }
  const me = await api("auth.test", {}, USER);
  console.log(`\n🌱 Reset + reseed demo workspace (summoner = @${me.user})\n`);

  // #general: clean any stray bot messages / avatar tests
  const pub = await api("conversations.list", { types: "public_channel", limit: 200 });
  const general = pub.channels?.find((c: any) => c.name === "general");
  if (general) { await api("conversations.join", { channel: general.id }); const n = await wipeBotMessages(general.id); if (n) console.log(`   cleaned ${n} stray messages from #general`); }

  // #engineering: discover by content (Grid hides it from list), wipe + reseed clean
  const engId = await findChannelByContent("Node 18");
  if (engId) {
    await seedEngineering(engId);
  } else {
    const c = await api("conversations.create", { name: "engineering", is_private: true });
    if (c.ok) { await api("conversations.invite", { channel: c.channel.id, users: me.user_id }).catch(() => {}); await seedEngineering(c.channel.id); }
    else console.log(r(`   ✗ couldn't find or create #engineering: ${c.error}`));
  }

  await ensureLeadership(me.user_id);

  console.log(`\nDemo summons (@Receipts …):`);
  console.log(`  • "did we decide to drop Node 18?"      → hero receipt (Dana's decision + jump)`);
  console.log(`  • "how do I run migrations locally?"     → FAQ-deflect (asked 3×)`);
  console.log(`  • "what did we decide about analytics?"  → finds NOTHING (Mixpanel is in #leadership you can't see)`);
  console.log(`\nRTS indexes new messages in ~15s — give it a moment before demoing.\n`);
}
main().catch(e => { console.error(r("seed crashed:"), e); process.exit(1); });
