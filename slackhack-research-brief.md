# Slack Agent Builder Challenge — Deep Research Brief

> Reusable "Deep Research Brief" skeleton, ported from the UXmaxx/Rally win
> (`~/uxmaxx/uxmaxx-research-prompt.md`) and refilled with verified Slack-hackathon
> facts. Feed this to a research agent (Claude Research / Opus) to produce a
> **Winning Strategy Dossier**, then run it through the war-room machine.
>
> Generated 2026-07-05. Deadline **2026-07-13, 5:00pm PT** (8 days out).

---

## ROLE & MISSION

You are a hackathon-winning strategist and technical scout. Produce a **decision-ready
Winning Strategy Dossier** for the **Slack Agent Builder Challenge** (slackhack.devpost.com).
Rank 6–8 concrete agent concepts by **Expected Value to a solo builder in an 8-day window**,
de-risk the architecture of the top 3, and map each to the published judging rubric.

**HARD CONSTRAINT:** Builder/technical focus only. The deliverable is one buildable Slack
**agent** that solves a real, specific workflow *inside* Slack — explicitly **NOT** "a generic
chatbot wrapped in a Slack UI" (the rules name that as the losing pattern).

---

## PART 1 — VERIFIED CONTEXT (spend budget on open questions, not these)

**The event**
- **Slack Agent Builder Challenge**, hosted by Slack/Salesforce on Devpost.
- **Submission window:** 2026-05-20 10:00 PT → **2026-07-13 17:00 PT** (hard).
- **Judging:** 2026-07-14 → 2026-08-06. **Winners:** ~2026-08-11.
- **Prizes:** up to **$74,400** total, **9 submission winners**; winners also get an
  invite to an exclusive Slack community gathering + social interview at **Dreamforce 2026**,
  and features on the Slack Developer program site / newsletter / social.

**What must be built**
- A **Slack agent** that solves a real, specific workflow problem *inside* Slack.
- Must use **at least one of three required technologies** in a way that "wouldn't be
  possible without it":
  1. **Slack Agent Builder / Agentforce** — no/low-code agent + custom Slack actions.
     Builder path = Salesforce Agent Builder + **Apex `@InvocableMethod`** custom actions,
     Named Credentials, requires a Salesforce org. Scopes: `chat:write`, `canvases:write`,
     `channels:read`, `channels:join`, etc.
  2. **MCP server integration** — exposes Slack capabilities as structured MCP tools an LLM
     invokes; OAuth handled automatically. The *hacker* path (Bolt app + Slack MCP server).
  3. **Real-Time Search (RTS) API** — permission-aware live search of Slack conversations,
     files, and threads "as they exist in the workspace, at the moment needed." Requires a
     **user token** via OAuth; minimum scope `search:read.public` (public channels the user
     is a member of); more scopes for private/DM context. RTS + MCP = "search → reason → act
     inside Slack's native permission model."

**Two tracks (mutually chosen at submission — verify stacking rules)**
- **Slack Agent for Good** — judged on **measurable social benefit**.
- **Slack Agent for Organizations** — judged on **real adoption potential**.

**Judging bar (3 load-bearing criteria)**
1. Solves a **real, specific Slack workflow** (not a generic chatbot in a Slack skin).
2. Uses a required technology **in a way that wouldn't be possible without it**.
3. **Clear impact** — Good = measurable social benefit; Orgs = real adoption potential.
- Judges spend ~5–7 min/project. Demo video is hard-capped: **< 3 minutes**.

**Submission artifacts**
- Demo video < 3 min (YouTube/Vimeo/Facebook/Youku), showing the project actually working.
- **Architecture diagram.**
- URL to a **Slack developer sandbox** + **test access** granted to
  `slackhack@salesforce.com` **and** `testing@devpost.com`.
- No third-party trademarks/copyrighted material without permission.

**Access / cost — CORRECTED 2026-07-05 (earlier "DE-RISKED / $0 / no blocker" was overconfident)**
- The **Slack Developer Program sandbox is a full Enterprise Grid org** (up to 2 sandboxes;
  3 workspaces + 8 users each; 6-month life) and the org itself is **$0 — you are not charged**.
  It unlocks the paid-plan-gated AI features — **RTS API, MCP, Agent Builder, Agents/assistants**.
- ⚠️ **BUT provisioning it is gated by a human-verification wall** discovered live in the
  browser flow: the Sandboxes dashboard says *"Paid plan workspace required — you are not yet
  eligible... join a paid plan workspace or provide a payment method... (you will not be
  charged)."* So provisioning requires ONE of: (a) membership in a paid-plan workspace, (b) a
  **payment method on file** (card, not charged — human check), or (c) a **"Provision Sandbox
  With Event Code"** path for hackathon/event attendees. The event code is NOT public on the
  Devpost pages (FAQ/Updates/Resources) — likely emailed on registration or participant-gated.
  This is the real Phase-0 blocker, NOT "$0, no friction." Get the event code or accept the
  card-on-file before assuming the sandbox is free-and-instant.
- Enabling **Agents** on an app auto-adds `assistant:write`.

---

## PART 2 — OBJECTIVE FUNCTION (rank every concept by builder EV)

Rank by **Expected Value to the builder** = weighted product of:
1. **Prize EV** — probability-weighted across 9 winner slots × two tracks; plus the Dreamforce
   feature/visibility upside. Bias toward the track with the thinner credible field.
2. **Rubric fit** — how hard the concept maxes the 3 judging criteria, especially criterion 2
   ("wouldn't be possible without the required tech") on the SAME screen as criterion 1.
3. **Buildability solo in ~6 build-days** on the free sandbox with genuinely mature SDKs.
4. **Differentiation** — avoids the saturated "generic LLM in a Slack channel" lane; occupies
   a verified-thin gap in the Slack agent field.
5. **Post-hackathon upside** — real adoption / marketplace listing / Dreamforce visibility;
   an agent a real team/nonprofit would keep using after judging ends.

---

## PARTS 3–8 — WORKSTREAMS

**WS3.1 Technical de-risking (top 3 concepts).** For each: is the value from live,
permission-aware Slack context that ONLY RTS+MCP (or Agent Builder actions) can provide? What
is the single scariest dependency? Prove the "cake" (the one only-possible-in-Slack moment) is
buildable in <48h. Name the fallback. Confirm scopes, the OAuth user-token flow for RTS, and
whether the MCP server or Agent Builder path is faster to a demo.

**WS3.2 Competitive field map.** What Slack agents already exist (Slack Marketplace, Agentforce
templates, ChatGPT/Claude/Glean-in-Slack, prior hackathon entries)? Which "verbs of team work"
are saturated vs thin? Grep for prior art before committing. Avoid every colonized lane.

**WS3.3 Winning concepts (generate 6–8, hard-rank top 3).** Cover the space MECE across the
**verbs of team work**: **FIND** (surface buried knowledge), **DECIDE** (drive threads to a
close), **COORDINATE** (align people/schedules), **REMEMBER** (institutional memory),
**TRIAGE** (route/prioritize inbound), **COMPLY/GUARD** (policy, safety, boundaries). Split
candidates across *Good* and *Orgs*. Per-concept eval template below.

**WS3.4 Judge psychology & rubric optimization.** Judges = Slack/Salesforce DevRel + Devpost.
They reward Slack-native workflows where the required tech is load-bearing, and a polished < 3-min
demo. Design the demo so criterion 1 (real workflow) and criterion 2 (only-possible-with-required-
tech) land on the *same screen*. State impact quantitatively for the chosen track.

**WS3.5 Execution + demo + submission plan (8 days).** Day-by-day to a submitted entry by
2026-07-12 night (Jul-13 5pm PT = contingency, not target). Include: sandbox setup, the spike
gate, the parallel build lanes, a seeded real-workflow demo scenario + one gracefully-handled
edge/failure case (the "deliberately-broken" receipt), architecture diagram, scripted demo
beats, test-access grant.

**WS3.6 Risk register.** SDK maturity, RTS token/scope friction, sandbox limits, demo fragility
(seed real state; have a recorded fallback), the "generic chatbot" trap, scope creep.

---

### Per-concept evaluation template
- **One-line pitch** + the specific user and the painful, recurring workflow problem.
- **Why it maxes the rubric** — which criterion, and why the required tech is **load-bearing,
  not decoration** (would the agent be impossible/pointless without RTS/MCP/Agent Builder?).
- **Track fit** — Good (name the measurable social benefit) or Orgs (name the adoption path).
- **The single "wow" demo moment** (the only-possible-in-Slack beat, on one screen).
- **Buildability** — what's in-Slack vs external; riskiest dependency; 48h spike to prove it.
- **Differentiation** vs named prior art.
- **Recommendation + runner-up.**

---

## OUTPUT FORMAT
- Lead with a **5-bullet executive recommendation** (the one concept to build + why).
- **Tables** for: competitor/field map · concept ranking (score each on rubric / diff / build /
  impact → OVR, tag BUILD/SHARPEN/FOLD/KILL) · rubric→build mapping.
- Cite every non-obvious claim with a **live link**, date-stamp anything stale, flag confidence.
- End with a single **"start here tomorrow"** action and the 48h spike definition + fallback.
