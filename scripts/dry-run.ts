// Receipts — dry-run the pipeline without Slack Socket Mode. Run:
//   bun run scripts/dry-run.ts "did we decide to drop Node 18?"
// Uses SLACK_USER_TOKEN (the summoner) for RTS. Prints keyword + the receipt card it would post.
import "dotenv/config";
import { buildReceipt } from "../src/receipts.ts";
import { llmAvailable } from "../src/llm.ts";

const U = process.env.SLACK_USER_TOKEN ?? "";
const question = process.argv.slice(2).join(" ") || "did we decide to drop Node 18?";

const b = (s: string) => `\x1b[1m${s}\x1b[0m`;
const g = (s: string) => `\x1b[32m${s}\x1b[0m`;

async function main() {
  if (!U.startsWith("xoxp-")) { console.log("SLACK_USER_TOKEN missing."); process.exit(1); }
  console.log(b("\n🧾 Receipts dry-run"));
  console.log(`  LLM: ${llmAvailable() ? g("available") : "heuristic fallback"}`);
  console.log(`  Summon: "${question}"\n`);

  const r = await buildReceipt(question, U);
  console.log(`  keyword → ${g(r.keyword)}`);
  console.log(`  found: ${r.found} · isDecision: ${r.isDecision} · mentions: ${r.count}\n`);
  console.log(b("  ── the card it would post ──"));
  for (const blk of r.blocks) {
    if (blk.type === "section") console.log("   " + blk.text.text.replace(/\n/g, "\n   "));
    else if (blk.type === "context") console.log("   " + blk.elements.map((e: any) => e.text).join(" "));
    else if (blk.type === "actions") console.log("   [ " + blk.elements.map((e: any) => `${e.text.text} → ${e.url}`).join(" ] [ ") + " ]");
  }
  console.log();
}
main().catch(e => { console.error(e); process.exit(1); });
