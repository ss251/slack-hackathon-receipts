// Receipts — automated sandbox seeding. Run: `bun run seed`
//
// Creates the exact go/no-go scenario the spike + demo expect, so you don't hand-post anything:
//   • #receipts-demo (public)      — the seeded prior DECISION ("dropping Node 18") + follow-ups
//   • a repeat question asked 3×   — for the FAQ-deflect beat
//   • #security-audit (PRIVATE)    — the ACL negative control the summoner is NOT in
//
// The private channel is created by the BOT (needs groups:write) and the summoner user is NOT
// invited — so RTS-as-summoner correctly cannot see it (Check 3 of the spike). Idempotent-ish:
// re-running creates fresh dated messages; channels are reused if they already exist.
//
// Needs (in .env.local): SLACK_BOT_TOKEN. Optional: SEED_PUBLIC_CHANNEL, SEED_PRIVATE_CHANNEL.

import "dotenv/config";

const BOT = process.env.SLACK_BOT_TOKEN ?? "";
const PUBLIC_CH = process.env.SEED_PUBLIC_CHANNEL ?? "receipts-demo";
const PRIVATE_CH = process.env.SEED_PRIVATE_CHANNEL ?? "security-audit";

const g = (s: string) => `\x1b[32m${s}\x1b[0m`;
const r = (s: string) => `\x1b[31m${s}\x1b[0m`;

async function api(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${BOT}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function ensureChannel(name: string, isPrivate: boolean): Promise<string | null> {
  const created = await api("conversations.create", { name, is_private: isPrivate });
  if (created.ok) { console.log(g(`  + created #${name}`)); return created.channel.id; }
  if (created.error === "name_taken") {
    // find it
    const types = isPrivate ? "private_channel" : "public_channel";
    const list = await api("conversations.list", { types, limit: 1000, exclude_archived: true });
    const ch = list.channels?.find((c: any) => c.name === name);
    if (ch) { console.log(`  = reusing #${name}`); return ch.id; }
  }
  console.log(r(`  ✗ #${name}: ${created.error}`));
  return null;
}

async function post(channel: string, text: string) {
  const res = await api("chat.postMessage", { channel, text });
  if (!res.ok) console.log(r(`  ✗ post failed (${res.error})`));
  return res;
}

async function main() {
  if (!BOT.startsWith("xoxb-")) {
    console.log(r("SLACK_BOT_TOKEN missing. Do Phase 0 first (HUMAN_SETUP.md).")); process.exit(1);
  }
  console.log("\n🌱 Seeding the Receipts go/no-go scenario\n");

  // 1) Public channel + the seeded DECISION (Check 2 target) + realistic re-litigation follow-ups
  const pub = await ensureChannel(PUBLIC_CH, false);
  if (pub) {
    await api("conversations.join", { channel: pub });
    await post(pub, "📌 Decision: we're *dropping Node 18* support in v3 — it's EOL'd upstream. If you still need it, pin v2. — settled in the maintainers sync.");
    await post(pub, "quick q, are we actually killing Node 18 or was that just floated last week?");
    await post(pub, "wait didn't we already decide this? i can never find where these things land 😩");
    // 2) The repeat question (FAQ-deflect beat) — asked 3×
    for (const t of [
      "how do I get RTS / assistant.search.context working in the sandbox?",
      "hey how do you get real-time search set up? can't get it to return anything",
      "newbie q — how do I enable the RTS API on my sandbox app?",
    ]) await post(pub, t);
    console.log(g(`  ✓ seeded decision + repeats in #${PUBLIC_CH}`));
  }

  // 3) PRIVATE channel the summoner is NOT in — the ACL negative control (Check 3)
  const priv = await ensureChannel(PRIVATE_CH, true);
  if (priv) {
    await post(priv, "🔒 Decision from the *security audit*: we're rotating all sandbox tokens weekly. (This message must stay invisible to anyone not in this channel — it's the ACL control.)");
    console.log(g(`  ✓ seeded private ACL control in #${PRIVATE_CH} (do NOT invite your summoner user here)`));
  }

  console.log("\nNext: set SEED_QUERY=\"Node 18\", SEED_EXPECT_TEXT=\"dropping Node 18\", " +
    "SEED_PRIVATE_QUERY=\"security audit\" in .env.local, then `bun run spike`.\n");
}

main().catch((e) => { console.error(r("seed crashed:"), e); process.exit(1); });
