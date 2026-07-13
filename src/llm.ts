// Receipts — LLM seam. Uses an Anthropic credential when available, else deterministic
// heuristics so the agent is always testable. Two credentials supported, both env-gated —
// the default path is env-only so an expired/stale credential is never silently used:
//   ANTHROPIC_API_KEY        → x-api-key (pay-as-you-go), read unconditionally from env.
//   ANTHROPIC_OAUTH_TOKEN    → Bearer + oauth beta + "You are Claude Code" system (Max/OAuth),
//                               read from env, OR (only when RECEIPTS_USE_KEYCHAIN=1) read live
//                               from the macOS keychain — opt-in, since Claude Code rotates that
//                               token and a stale demo shouldn't grab it by default.
// If neither works (missing/expired), callClaude returns null and callers fall back to
// heuristics. Call llmStatus() after startup to log which path is actually live.

import { execSync } from "node:child_process";

const API_KEY = process.env.ANTHROPIC_API_KEY?.startsWith("sk-ant-api") ? process.env.ANTHROPIC_API_KEY : "";

// Resolve a Claude Code OAuth token: explicit env first, else — only when explicitly opted in
// via RECEIPTS_USE_KEYCHAIN=1 — read the LIVE token from the macOS keychain (Claude Code rotates
// it, so reading at startup keeps it fresh for local testing). Never reads the keychain by
// default: an expired/rotated token would otherwise be picked up silently.
function resolveOAuth(): string {
  const env = process.env.ANTHROPIC_OAUTH_TOKEN;
  if (env?.startsWith("sk-ant-oat")) return env;
  if (process.env.RECEIPTS_USE_KEYCHAIN !== "1") return "";
  try {
    const raw = execSync('security find-generic-password -s "Claude Code-credentials" -w',
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const tok = JSON.parse(raw)?.claudeAiOauth?.accessToken;
    if (typeof tok === "string" && tok.startsWith("sk-ant-oat")) return tok;
  } catch { /* not on macOS / no keychain entry */ }
  return "";
}
const OAUTH = resolveOAuth();
const MODEL = process.env.RECEIPTS_MODEL || "claude-haiku-4-5-20251001";

let llmDisabled = false; // trip after a 401 so we stop hammering an expired token

export function llmAvailable(): boolean {
  return !llmDisabled && (!!API_KEY || !!OAUTH);
}

/** Which credential path is actually live, for a clear startup log — never logs the value. */
export function llmStatus(): "api-key" | "oauth" | "heuristics" {
  if (llmDisabled) return "heuristics";
  if (API_KEY) return "api-key";
  if (OAUTH) return "oauth";
  return "heuristics";
}

/** Single-shot Claude call. Returns the text, or null if unavailable/failed (caller falls back). */
export async function callClaude(system: string, user: string, maxTokens = 400): Promise<string | null> {
  if (llmDisabled || (!API_KEY && !OAUTH)) return null;
  const headers: Record<string, string> = {
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  };
  // OAuth (Claude Code) path REQUIRES the beta header + the Claude Code system preamble.
  const sys = OAUTH && !API_KEY
    ? [{ type: "text", text: "You are Claude Code, Anthropic's official CLI for Claude." }, { type: "text", text: system }]
    : system;
  if (API_KEY) headers["x-api-key"] = API_KEY;
  else { headers["authorization"] = `Bearer ${OAUTH}`; headers["anthropic-beta"] = "oauth-2025-04-20"; }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system: sys, messages: [{ role: "user", content: user }] }),
    });
    if (res.status === 401) { llmDisabled = true; console.warn("[llm] 401 — credential expired/invalid; using heuristics."); return null; }
    if (!res.ok) { console.warn(`[llm] ${res.status}; using heuristics.`); return null; }
    const body: any = await res.json();
    return (body?.content ?? []).map((b: any) => b?.text ?? "").join("").trim() || null;
  } catch (e) {
    console.warn("[llm] error; using heuristics:", (e as Error).message);
    return null;
  }
}

const STOP = new Set(("a an the is are was were do does did we you i they it he she to of for on in at " +
  "and or but so did didnt do dont what when where who why how which that this these those our your their " +
  "decide decided deciding decision agree agreed settle settled going go use using should would could " +
  "wait actually really just about with can cant will wont").split(/\s+/));

/** Best-effort JSON extraction from an LLM reply. */
function parseJson<T>(s: string | null): T | null {
  if (!s) return null;
  const m = s.match(/\{[\s\S]*\}/);
  try { return m ? JSON.parse(m[0]) : null; } catch { return null; }
}

/** Turn a summon question into a rare, distinctive KEYWORD query for RTS (keyword mode). */
export async function extractKeyword(question: string): Promise<string> {
  const heuristic = () =>
    question.replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/).filter(w => w && !STOP.has(w.toLowerCase()))
      .slice(0, 4).join(" ").trim() || question.trim();
  const out = await callClaude(
    "Extract the SINGLE most distinctive noun-phrase (max 3 words) to keyword-search for the decision the user asks about. " +
    "Prefer a rare proper noun/term over generic words. Reply with ONLY those words — no punctuation, no quotes, no extra words.",
    `Question: ${question}`, 16);
  const cleaned = (out || "").replace(/[\n"'.]/g, " ").replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ").filter(Boolean);
  return cleaned && words.length <= 4 && cleaned.length <= 40 ? cleaned : heuristic();
}

export interface Judged {
  index: number;            // which hit is the answer (-1 = none)
  isDecision: boolean;      // does it read as a settled decision/answer?
  unchanged: boolean;       // nothing later contradicts it
  gist?: string;            // one-line paraphrase (optional)
}

/** Pick the hit that best answers the question + judge it. LLM if available, else heuristic. */
export async function judge(question: string, hits: { text: string; author?: string }[]): Promise<Judged> {
  if (!hits.length) return { index: -1, isDecision: false, unchanged: true };
  const heuristic = (): Judged => {
    const DEC = /\b(decid|decision|we'?re|we will|going with|go with|standardi|dropping|ship it|final|agreed|let'?s use|use )\b/i;
    let best = -1, bestScore = -1;
    hits.forEach((h, i) => {
      const t = (h.text || "").toLowerCase();
      let s = DEC.test(t) ? 3 : 0;
      if (/\?$/.test(h.text || "")) s -= 2;        // questions aren't decisions
      s += Math.min(2, (t.match(/\b(v\d|node|postgres|mongo|deadline|launch|price)\b/g) || []).length);
      if (s > bestScore) { bestScore = s; best = i; }
    });
    return { index: best, isDecision: bestScore >= 3, unchanged: true };
  };
  const out = await callClaude(
    "You judge Slack search results. Given a question and candidate messages, pick the ONE that states the settled decision/answer. " +
    "Reply ONLY as JSON: {\"index\": <0-based int or -1>, \"isDecision\": <bool>, \"unchanged\": <bool>, \"gist\": \"<short>\"}. " +
    "isDecision=true only if it's a real settled decision (not a question or musing). unchanged=false if a later message overturns it.",
    `Question: ${question}\n\nCandidates:\n${hits.map((h, i) => `[${i}] @${h.author || "?"}: ${(h.text || "").slice(0, 200)}`).join("\n")}`,
    120);
  const parsed = parseJson<Judged>(out);
  if (parsed && typeof parsed.index === "number") return parsed;
  return heuristic();
}
