# Receipts — Devpost description crib sheet (FACTS ONLY)

> Write the description yourself, in your own voice, from these bullets. Do NOT paste
> AI-written prose into Devpost — judges explicitly penalize it (see SUBMISSION.md).
> Every fact below is pulled from the repo as of 2026-07-08; no invented numbers.

## 1. What it does (one clause)
- A Slack agent that answers "did we decide X?" with the actual prior message — verbatim
  quote, author, channel, date, and a one-tap permalink — instead of a summary or a guess.

## 2. Hard facts
- Built on Bolt for JS + Socket Mode (`@slack/bolt`, `src/app.ts`).
- Two summon entry points: `@Receipts <question>` (app_mention event) and the "Pull receipts"
  message shortcut (callback_id `pull_receipts`) on any existing message.
- The load-bearing required API is Slack's Real-Time Search — `assistant.search.context`
  (`src/rts.ts`) — called in keyword mode (not natural-language/semantic mode).
- Search runs as the summoner's own user token (`xoxp-`), not the bot's — so results are
  permission-scoped to whatever that person can already see. A private-channel decision the
  summoner isn't in returns "no prior decision on record," not a leak.
- The receipt card is native Block Kit: a header block, a section with the verbatim quote, a
  context block carrying the RTS provenance line + the repeat-count + change-status, and an
  actions block with a "Jump to message" button. No plain-text walls.
- Error and empty-result states are also structured Block Kit cards (header + section +
  context), not bare strings — added so a live judge summon never returns silence.
- LLM path (`src/llm.ts`): keyword extraction + decision-judging via Anthropic Claude when a
  credential is present (`ANTHROPIC_API_KEY`, or `ANTHROPIC_OAUTH_TOKEN` opt-in via
  `RECEIPTS_USE_KEYCHAIN=1`); falls back to deterministic heuristics (regex-based
  decision-language scoring) when no credential is available or the call 401s. No key is ever
  hardcoded.
- Progressive keyword-widening search (`src/receipts.ts`): if the LLM/heuristic keyword misses,
  it retries with the keyword's individual tokens, then the question's distinctive tokens,
  deduping hits by permalink — because RTS keyword mode requires literal term overlap.

## 3. Numbers
- `src/` (app.ts + receipts.ts + llm.ts + rts.ts) totals 449 lines as of this crib sheet.
- `bunx tsc --noEmit` is clean (zero errors).
- Spike/validation gate: 3/3 (per audited code state).
- Two verified summon paths: `@mention` and the `pull_receipts` message shortcut.

## 4. The demo beats (verified against DEMO_RUNBOOK.md)
- Hero receipt: `@Receipts did we decide to drop Node 18?` → prior decision by author, channel,
  date, verbatim quote, Jump-to-message button.
- ACL kicker: a question whose answer lives only in a private channel the summoner isn't in →
  "no prior decision on record" — nothing leaks across the permission boundary.
- Repeat-answer counter: a re-asked question surfaces the same prior answer plus an
  "asked & answered N×" count.

## 5. File pointers
- `src/app.ts` — Bolt app, event/shortcut handlers, error-state wiring.
- `src/receipts.ts` — pipeline (search → judge → render) + pure Block Kit builders
  (`renderReceiptBlocks`, `renderNoResultBlocks`, `renderErrorBlocks`).
- `src/rts.ts` — the Real-Time Search call (`assistant.search.context`).
- `src/llm.ts` — Anthropic credential gating + heuristic fallback + `llmStatus()`.
- `docs/architecture.png` / `docs/architecture.mmd` — architecture diagram.
- `manifest.yaml` — Slack app manifest (scopes, event subscriptions, socket mode).

## 6. Honesty note (disclose, don't hide)
- MVP searches as the installer's user token, not true per-summoner OAuth. In production this
  would be per-user OAuth or the event's `action_token`, so the search runs as whoever actually
  summoned — same RTS call, different token source.
