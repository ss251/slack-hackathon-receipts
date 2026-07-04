// Receipts — THE 48h CAKE SPIKE (go/no-go gate). Run: `bun run spike`
//
// This is Phase 1 of AGENT_STATE.md. Do NOT build the app loop until this passes.
// It proves the three load-bearing facts on your seeded sandbox, using the summoner's
// USER token (the reliable permission-scoped path):
//
//   Check 1 — IDENTITY: assistant.search.context works AS the token owner at all.
//   Check 2 — RETRIEVAL: a keyword query returns the seeded prior decision + a permalink.
//   Check 3 — ACL BOUNDARY: a decision in a channel the summoner is NOT in is NOT returned.
//
// GO = all three green. If Check 1 fails on the user token, the concept is blocked — check
// scopes (search:read.public/private) and RTS/Enterprise-Grid enablement. If only Check 3
// is ambiguous, you can still ship public-channel-only (the graceful fallback), but you lose
// the ACL demo beat. The `action_token` (bot-token) ergonomics is a Phase-2 refinement, not a
// spike blocker — proving it with a user token de-risks the whole concept.

import "dotenv/config";
import { searchContext } from "../src/rts.ts";

const USER_TOKEN = process.env.SLACK_USER_TOKEN ?? "";
const SEED_QUERY = process.env.SEED_QUERY ?? "Node 18";
const SEED_EXPECT = (process.env.SEED_EXPECT_TEXT ?? "dropping Node 18").toLowerCase();
const PRIVATE_QUERY = process.env.SEED_PRIVATE_QUERY ?? "security audit";

const g = (s: string) => `\x1b[32m${s}\x1b[0m`;
const r = (s: string) => `\x1b[31m${s}\x1b[0m`;
const y = (s: string) => `\x1b[33m${s}\x1b[0m`;
const b = (s: string) => `\x1b[1m${s}\x1b[0m`;

function preview(hits: { author?: string; channelName?: string; text: string; permalink?: string }[]) {
  return hits.slice(0, 5).map((h, i) =>
    `   ${i + 1}. @${h.author ?? "?"} in #${h.channelName ?? "?"} — "${(h.text ?? "").slice(0, 90)}"` +
    (h.permalink ? `\n      ${h.permalink}` : "")
  ).join("\n");
}

async function main() {
  console.log(b("\n🧾 Receipts — cake spike (go/no-go)\n"));

  if (!USER_TOKEN.startsWith("xoxp-")) {
    console.log(r("✗ SLACK_USER_TOKEN missing/invalid. Do Phase 0 first (HUMAN_SETUP.md)."));
    console.log("  Need a user token (xoxp-) with scopes: search:read.public, search:read.private\n");
    process.exit(1);
  }

  let pass = 0;
  const checks: { n: string; ok: boolean }[] = [];

  // ---- Check 1 + 2: identity + retrieval ----
  console.log(b(`Check 1+2 — identity + retrieval`) + `  (query: "${SEED_QUERY}", keyword mode)`);
  const res = await searchContext({ token: USER_TOKEN, query: SEED_QUERY });
  if (!res.ok) {
    console.log(r(`✗ assistant.search.context failed: ${res.error}`));
    console.log(y("  → identity blocked. Check user-token scopes + RTS/Enterprise-Grid enablement."));
    console.log("  raw:", JSON.stringify(res.raw).slice(0, 400), "\n");
    checks.push({ n: "1 identity", ok: false }, { n: "2 retrieval", ok: false });
  } else {
    console.log(g(`✓ Check 1 — identity: assistant.search.context returned ok (${res.hits.length} hits)`));
    checks.push({ n: "1 identity", ok: true }); pass++;
    console.log(preview(res.hits));
    const found = res.hits.find((h) => (h.text ?? "").toLowerCase().includes(SEED_EXPECT));
    if (found && found.permalink) {
      console.log(g(`✓ Check 2 — retrieval: seeded prior decision found WITH a permalink`));
      console.log(`   ↪ "${found.text.slice(0, 120)}"\n   ↪ ${found.permalink}`);
      checks.push({ n: "2 retrieval", ok: true }); pass++;
    } else if (found) {
      console.log(y(`~ Check 2 — retrieval: seeded text found but NO permalink (inspect raw shape in rts.ts)`));
      checks.push({ n: "2 retrieval", ok: false });
    } else {
      console.log(r(`✗ Check 2 — retrieval: seeded phrase "${SEED_EXPECT}" not in results`));
      console.log(y("  → tune SEED_QUERY to the rarest distinctive token; confirm the seed message exists."));
      checks.push({ n: "2 retrieval", ok: false });
    }
  }

  // ---- Check 3: ACL boundary ----
  console.log(b(`\nCheck 3 — ACL boundary`) + `  (query: "${PRIVATE_QUERY}" — should be INVISIBLE to this summoner)`);
  const acl = await searchContext({ token: USER_TOKEN, query: PRIVATE_QUERY });
  if (!acl.ok) {
    console.log(y(`~ ACL probe call failed (${acl.error}) — rerun after Check 1 passes.`));
    checks.push({ n: "3 acl", ok: false });
  } else {
    const leaked = acl.hits.find((h) => (h.text ?? "").toLowerCase().includes(PRIVATE_QUERY.toLowerCase()));
    if (!leaked) {
      console.log(g(`✓ Check 3 — ACL boundary: the private-channel decision is correctly NOT surfaced`));
      console.log(g(`   (the unfakeable, only-possible-with-RTS artifact — this is your demo kicker)`));
      checks.push({ n: "3 acl", ok: true }); pass++;
    } else {
      console.log(r(`✗ Check 3 — ACL boundary: leaked content the summoner should NOT see`));
      console.log(r(`   → the summoner's token must NOT be a member of the private seed channel. Re-seed.`));
      checks.push({ n: "3 acl", ok: false });
    }
  }

  // ---- Verdict ----
  console.log(b("\n──────── VERDICT ────────"));
  for (const c of checks) console.log(`  ${c.ok ? g("PASS") : r("FAIL")}  ${c.n}`);
  if (pass === 3) {
    console.log(g(b("\n🟢 GO — all three green. Proceed to Phase 2 (build the loop).\n")));
  } else {
    console.log(y(b(`\n🟡 NOT YET — ${pass}/3. Fix above before building polish. See fallbacks in AGENT_STATE.md §7.\n`)));
  }
}

main().catch((e) => { console.error(r("spike crashed:"), e); process.exit(1); });
