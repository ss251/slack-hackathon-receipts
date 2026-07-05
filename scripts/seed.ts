// Receipts — seed a BELIEVABLE demo workspace: real personas talking in channels, a decision
// made and later re-litigated, a thrice-asked question, and a private-channel decision the
// summoner can't see (the ACL kicker). Personas are posted via chat:write.customize so they
// render as distinct people; the receipt resolves their names via conversations.history.
//
//   bun run seed          # clean old junk + seed the scenario
// Needs .env.local: SLACK_BOT_TOKEN (chat:write.customize, groups:write), SLACK_USER_TOKEN.

import "dotenv/config";
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

// personas (username + emoji avatar)
const DANA = { username: "Dana Okafor", icon_emoji: ":woman-technologist:" };
const SAM  = { username: "Sam Rivera",  icon_emoji: ":man-technologist:" };
const PRIYA= { username: "Priya Nair",  icon_emoji: ":technologist:" };
const LEO  = { username: "Leo Park",    icon_emoji: ":man-student:" };
const MAYA = { username: "Maya Chen",   icon_emoji: ":artist:" };

async function say(channel: string, who: any, text: string) {
  const res = await api("chat.postMessage", { channel, text, ...who });
  if (!res.ok) console.log(r(`   ✗ post (${who.username}): ${res.error}`));
  await wait(700); // keep ordering stable + let RTS index
  return res;
}

async function ensurePrivate(name: string, inviteUserId?: string): Promise<string | null> {
  const list = await api("conversations.list", { types: "private_channel", limit: 1000, exclude_archived: true });
  let ch = list.channels?.find((c: any) => c.name === name);
  let id = ch?.id;
  if (!id) {
    const c = await api("conversations.create", { name, is_private: true });
    if (!c.ok) { console.log(r(`   ✗ create #${name}: ${c.error}`)); return null; }
    id = c.channel.id; console.log(g(`   + created private #${name}`));
  } else console.log(`   = reusing #${name}`);
  if (inviteUserId) { const inv = await api("conversations.invite", { channel: id, users: inviteUserId }); if (!inv.ok && inv.error !== "already_in_channel") console.log(`   (invite ${name}: ${inv.error})`); }
  return id;
}

async function cleanChannel(channelId: string) {
  // delete the bot's own prior seed messages (flat dump) so the demo starts clean
  const hist = await api("conversations.history", { channel: channelId, limit: 100 });
  let n = 0;
  for (const m of hist.messages || []) {
    if (m.bot_id || m.subtype === "bot_message") { const d = await api("chat.delete", { channel: channelId, ts: m.ts }); if (d.ok) n++; await wait(150); }
  }
  if (n) console.log(`   cleaned ${n} old bot messages`);
}

async function main() {
  if (!BOT.startsWith("xoxb-") || !USER.startsWith("xoxp-")) { console.log(r("Need SLACK_BOT_TOKEN + SLACK_USER_TOKEN in .env.local.")); process.exit(1); }
  const me = await api("auth.test", {}, USER);
  const summoner = me.user_id;
  console.log(`\n🌱 Seeding demo workspace (summoner = @${me.user} ${summoner})\n`);

  // tidy #general (old flat dump lived here)
  const pub = await api("conversations.list", { types: "public_channel", limit: 200 });
  const general = pub.channels?.find((c: any) => c.name === "general");
  if (general) { await api("conversations.join", { channel: general.id }); await cleanChannel(general.id); }

  // ── #engineering (private, summoner invited): the whole visible scene ──
  const eng = await ensurePrivate("engineering", summoner);
  if (eng) {
    await cleanChannel(eng);
    console.log("   seeding #engineering…");
    // the decision (made "earlier")
    await say(eng, SAM,   "heads up — Node 18 hit end-of-life upstream last week, and we're still shipping it in the v3 build.");
    await say(eng, PRIYA, "that's a real problem, no more security patches. are we dropping it?");
    await say(eng, DANA,  "📌 Decision: we're dropping Node 18 support in v3. It's EOL'd upstream — anyone still on it should pin v2. Confirmed with the platform team, this is final.");
    await say(eng, SAM,   "👍 on it — I'll update the CI matrix and the release docs.");
    // the migration question (asked 3× over time = the FAQ-deflect beat)
    await say(eng, LEO,   "how do I run the DB migrations locally?");
    await say(eng, DANA,  "`bun run migrate:local` after you pull — just make sure DATABASE_URL is set in your .env");
    await say(eng, MAYA,  "newbie q — how do I run the migrations on my machine?");
    await say(eng, SAM,   "^ it's `bun run migrate:local`. we should really FAQ this one.");
    // the re-litigation (this is where the demo summons Receipts)
    await say(eng, LEO,   "quick q — are we keeping Node 18 for the v3 release or not? saw a PR still targeting it");
    await say(eng, PRIYA, "wait didn't we already settle this? I can never find where these decisions land 😩");
    await say(eng, LEO,   "and… how do you run the migrations locally again? can't find where that was said");
    console.log(g("   ✓ #engineering seeded"));
  }

  // ── #leadership (private, summoner NOT invited): the ACL control ──
  const lead = await ensurePrivate("leadership"); // no invite
  if (lead) {
    await cleanChannel(lead);
    await say(lead, DANA, "📌 Decision: we're moving analytics off Amplitude to Mixpanel — finance approved the budget. Rolling out next quarter. Keep this in here for now.");
    console.log(g("   ✓ #leadership seeded (summoner is NOT a member — ACL control)"));
  }

  console.log(`\nDemo summons to try (@Receipts …):`);
  console.log(`  • "did we decide to drop Node 18?"     → hero receipt (Dana's decision + jump)`);
  console.log(`  • "how do I run migrations locally?"    → FAQ-deflect (asked 3×)`);
  console.log(`  • "what did we decide about analytics?" → correctly finds NOTHING (Mixpanel is in #leadership you can't see)`);
  console.log(`\nNote: RTS indexes new messages in ~15s — seed is done, give it a moment before demoing.\n`);
}
main().catch(e => { console.error(r("seed crashed:"), e); process.exit(1); });
