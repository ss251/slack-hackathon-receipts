// Receipts — full clean re-stage of the demo. With comprehensive scopes we can delete EVERYTHING
// deletable (bot messages via bot token, the summoner's own messages via user token), then reseed
// a pristine team conversation. Leaves #leadership alone (invisible ACL control).
//   bun run stage
import "dotenv/config";
import { searchContext } from "../src/rts.ts";

const BOT = process.env.SLACK_BOT_TOKEN ?? "";
const USER = process.env.SLACK_USER_TOKEN ?? "";
const g = (s: string) => `\x1b[32m${s}\x1b[0m`;

async function api(m: string, token: string, b: Record<string, unknown>) {
  const r = await fetch(`https://slack.com/api/${m}`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(b) });
  return r.json() as any;
}
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

const av = (seed: string, bg: string) => `https://api.dicebear.com/9.x/notionists/png?seed=${seed}&size=192&backgroundColor=${bg}&radius=50`;
const DANA = { username: "Dana Okafor", icon_url: av("DanaOkafor7", "b6e3f4") };
const SAM = { username: "Sam Rivera", icon_url: av("SamRivera3", "c0aede") };
const PRIYA = { username: "Priya Nair", icon_url: av("PriyaNair9", "ffdfbf") };
const LEO = { username: "Leo Park", icon_url: av("LeoPark2", "d1d4f9") };
const MAYA = { username: "Maya Chen", icon_url: av("MayaChen5", "ffd5dc") };

async function say(cid: string, who: any, text: string) { const r = await api("chat.postMessage", BOT, { channel: cid, text, ...who }); await wait(750); return r; }

async function fullWipe(cid: string, meId: string) {
  let n = 0;
  for (let pass = 0; pass < 3; pass++) {
    const h = await api("conversations.history", BOT, { channel: cid, limit: 200 });
    const msgs = h.messages || [];
    if (!msgs.length) break;
    let deleted = 0;
    for (const m of msgs) {
      // bot/persona messages → bot token; the summoner's own messages → user token
      const isBot = m.bot_id || m.subtype === "bot_message";
      const isMe = m.user === meId;
      if (!isBot && !isMe) continue;                       // system joins etc. — can't delete
      const d = await api("chat.delete", isBot ? BOT : USER, { channel: cid, ts: m.ts });
      if (d.ok) { n++; deleted++; }
      await wait(110);
    }
    if (!deleted) break;
  }
  return n;
}

async function main() {
  const me = await api("auth.test", USER, {});
  const cid = (await searchContext({ token: USER, query: "Node 18" })).hits[0]?.channelId
    ?? (await searchContext({ token: USER, query: "migrations" })).hits[0]?.channelId;
  if (!cid) { console.log("couldn't locate #engineering — is it seeded at all?"); process.exit(1); }
  console.log(`\n🎬 Staging #engineering (${cid}) as @${me.user}\n`);

  const wiped = await fullWipe(cid, me.user_id);
  console.log(`   wiped ${wiped} messages — channel is clean`);

  // pristine team conversation (the story: decision made, migration Q asked 3x, re-litigation)
  await say(cid, SAM, "heads up — Node 18 hit end-of-life upstream last week, and we're still shipping it in the v3 build.");
  await say(cid, PRIYA, "that's a real problem, no more security patches. are we dropping it?");
  await say(cid, DANA, "📌 Decision: we're dropping Node 18 support in v3. It's EOL'd upstream — anyone still on it should pin v2. Confirmed with the platform team, this is final.");
  await say(cid, SAM, "👍 on it — I'll update the CI matrix and the release docs.");
  await say(cid, LEO, "how do I run the DB migrations locally?");
  await say(cid, DANA, "`bun run migrate:local` after you pull — just make sure DATABASE_URL is set in your .env");
  await say(cid, MAYA, "newbie q — how do I run the migrations on my machine?");
  await say(cid, SAM, "^ it's `bun run migrate:local`. we should really FAQ this one.");
  await say(cid, LEO, "quick q — are we keeping Node 18 for the v3 release or not? saw a PR still targeting it");
  await say(cid, PRIYA, "wait didn't we already settle this? I can never find where these decisions land 😩");
  console.log(g("   ✓ reseeded pristine team conversation"));
  console.log(`\n   channel id: ${cid}`);
  console.log(`   RTS reindexes in ~15s. Then post summons + capture.\n`);
}
main().catch(e => { console.error(e); process.exit(1); });
