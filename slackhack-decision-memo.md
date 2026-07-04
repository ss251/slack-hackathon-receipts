# Slack Agent Builder Challenge — Convergence Decision Memo

> Output of the Rally-style ideation war room (27 Opus agents · 24 raw concepts → 7 shortlist →
> 3 finalists → 1 build · 1.28M tokens · 0 errors). Generated 2026-07-05.
> Track + pillar were left to the room. **Winner: Contradiction Catcher.**

## Provenance & finalist scoreboard

| Finalist | OVR | rubric | diff | build | impact | Verdict |
|---|---|---|---|---|---|---|
| **Contradiction Catcher** | **7.95** | 8 | 8.5 | 8 | 7 | **BUILD** ✅ |
| Provenance Guard | 7.85 | 8.5 | 8 | 6.5 | 8 | BUILD (runner-up) |
| Leaving Brain | 7.5 | 7 | 8 | 7 | 8 | SHARPEN (fallback) |
| Asked & Answered | 6.6 | 9 | 3 | 7 | 8 | FOLD |
| Lifeline | 6.6 | 6 | 6 | 7 | 8 | KILL |
| Quorum | 6.0 | 6 | 6 | 6 | 6 | FOLD |
| Fulfil | 5.9 | 6 | 5 | 6 | 7 | FOLD |

Judge votes: **4 of 5 ranked Contradiction Catcher #1** (Judge Whisperer, Narrative Scout, SDK
Skeptic, The Clock). Only the Contrarian Operator preferred Leaving Brain on retained-adoption.

> ⚠️ **Rubric correction** (fact-checked this run): the official Devpost rubric is **four equally-
> weighted 25% criteria — Technological Implementation · Design · Potential Impact · Quality of
> the Idea** (tie-break in that order). "Demo-density" / "wouldn't be possible without it" are NOT
> named scored axes. Quality of the Idea is the swing axis; Potential Impact must be *quantified*
> in the writeup (stickiness scores nothing on a 5–7-min pass). This supersedes the "3 criteria"
> framing in the prep playbook.

---

## What we're building

**Contradiction Catcher** — Track: **Organizations** · Pillar: **RTS (load-bearing) + MCP (act)**.

On a decision-marker (a reaction emoji like `:lock:` or a message shortcut that "locks" a decision
in a thread), the agent fires ONE permission-scoped RTS search of the workspace for a prior
**conflicting** decision the locker is cleared to see. On a true reversal it drops an inline
`⚠️ conflicts with @Dana's decision in #product [jump]` (the jump-link resolves to Dana's real
message) and opens an MCP **reconciliation canvas** with both decisions side-by-side, both DRIs
@-ed.

**The wow beat:** Lock "We're standardizing on Postgres" → within ~2s, inline ⚠️ "conflicts with
@Dana's decision in #product-private on May 3: 'we standardize on Mongo' [jump]" → canvas blooms →
**and a third conflicting decision in a channel the locker is NOT in stays correctly hidden** —
proving the catch enforces live Slack ACLs at query time. Something no generic chatbot over a
stale index can safely reproduce (Glean itself routes through RTS for exactly this reason).
Trigger, surprise, and action are one continuous, unfakeable, permission-aware moment.

---

## The 48h "cake" spike — the go/no-go gate (do this FIRST)

Wire the full loop on the free Enterprise Grid sandbox: trigger → one RTS `assistant.search.context`
in **KEYWORD mode** anchored on the rare distinctive token, `channel_types` including
`private_channel`, fired as the locker → temp-0 classifier → inline ⚠️ with live permalink + MCP
canvas. Seed two conflicting decisions (one in a private channel the locker can see) **plus a
negative control** outside the locker's ACL.

**Must be TRUE to proceed:**
1. The keyword query reliably returns the seeded prior conflict from the private channel, with a
   resolvable permalink.
2. The **negative control** — a conflict in a channel the locker is NOT in — is correctly **NOT
   surfaced** (the unfakeable ACL artifact — **never descope it**).
3. The temp-0 classifier fires ⚠️ across ~10 runs with **zero false no-ops and zero false alarms**.

**Fallback:** record a clean take AND ship **warning-only** (drop the canvas) — still lands the
workflow + RTS on one screen. If the boundary demo can't be staged or the cake fails outright,
**PIVOT to Leaving Brain** (honest shared-footprint, search→render — no binary-judgment gamble).

---

## MVP scope (8)

1. **Sandbox + Orgs-track gate:** stand up the free Slack Developer Program Enterprise Grid org;
   build an **INTERNAL** app; register the Slack App ID and **submit/resubmit to the Slack
   Marketplace during the hackathon** (mandatory for the Organizations track).
2. **Trigger:** a decision-marker on a thread — reaction emoji (`:lock:`) or message shortcut.
   Bounds RTS to high-signal moments.
3. **Retrieval:** ONE RTS `assistant.search.context` call in **KEYWORD mode**, anchored on the
   rare distinctive topic token, `channel_types` incl. `private_channel`, fired as the locker's
   single identity (no participant-union / N-way OAuth claim).
4. **Judgment:** temp-0, prompt-locked LLM classifier: true reversal vs benign refinement/echo,
   with few-shot exemplars.
5. **Act 1 — inline ⚠️ warning** in the same thread: prior decision's real author + channel + a
   LIVE permalink.
6. **Act 2 — MCP write:** a reconciliation canvas, both decisions side-by-side, both DRIs @-ed.
7. **Seed data:** two conflicting decisions (one in a private channel the locker can see) + a
   negative-control decision outside the locker's ACL.
8. **Submission artifacts:** <3-min demo video; architecture diagram; sandbox URL with test access
   to `slackhack@salesforce.com` + `testing@devpost.com`; writeup that **quantifies Potential
   Impact** and narrates the **ACL/permission-aware-retrieval** story (not freshness).

## Descope order if time slips
1. Drop one-click reassign + auto-DM to DRIs (nice-to-have).
2. Canvas → **warning-only** (inline ⚠️ + live permalink). (Canvas is swappable with Bolt Web API
   `canvases.create` if MCP is flaky.)
3. Any multi-participant/union-scope framing → single locker identity only (no such API exists).
4. Any RTS semantic-mode ambition → stay strictly KEYWORD mode.
5. **NEVER cut:** the negative-control (ACL boundary demo) and the live resolvable permalink —
   the only artifacts that make the concept unfakeable and beat the "generic assistant with
   search" read.

## Build discipline (non-negotiable)
- Narrate the **ACL / permission-aware-retrieval** story, NOT freshness.
- Force **keyword mode**; never phrase the RTS query as a natural-language question.
- Classifier at **temperature 0** with stark few-shot exemplars; keep the demo contrast stark.
- Scope to the **single locker identity** — do not claim participant-union search.
- **Record a fallback take.** The compounded ~4% residual is real.

## Why the runners-up lost (on verified cruxes)
- **Provenance Guard — REFUTED (`pg-workflow-nativeness-reframe`).** True pre-send interception is
  architecturally unavailable to a third-party Slack app (no pre-send hook; Discovery API is
  Grid-admin/DLP-vendor only). The composer-shortcut reframe can't even read the draft (global-
  shortcut payload carries no channel/message/text) → non-native re-type-into-modal flow, fully
  skippable. Its only native surface is post-send = the commoditized DLP lane. Nobody's winner.
- **Leaving Brain — capped (`lb-value-survives-requester-scope`).** RTS searches AS the caller, so
  "the 4 things only Sarah knew" (her DMs/private channels) is exactly what the requester's token
  can't reach. Honest shared-footprint reframe survives but leans on summarization (the "thin
  wrapper" trap) and reads as a known saved-search tool. **Kept as the graceful-degradation
  fallback.**

**Start here tomorrow:** stand up the sandbox, register the App ID, and run the cake spike as the
go/no-go gate.
