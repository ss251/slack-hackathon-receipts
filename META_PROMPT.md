# META PROMPT — Slack Agent Builder Challenge · Autonomous Research Kickoff

> Drop-in prompt that runs the research → ideation → convergence pipeline hands-off.
> The PART-1 context is already written up in `slackhack-research-brief.md` (this folder).
> A live war room may already have been run — check for `slackhack-decision-memo.md` first;
> this meta prompt is for a fresh run or handoff.

---

## ▶ HOW TO USE (you — 10 seconds)

Open a fresh Claude Code session in `~/Developer/slack-hackathon/` and send:

> **"Execute META_PROMPT.md. Run the full pipeline end-to-end, don't stop to ask me questions,
> and surface only a Lavish kickoff decision board with one recommended build. Subagents pinned
> to `model: 'opus'`."**

---

## ROLE & MISSION (agent)

Orchestrate a hackathon-**win** research effort for the **Slack Agent Builder Challenge**
(`slackhack.devpost.com`, deadline **2026-07-13 17:00 PT**). Stay cheap on the main loop; fan out
to Opus subagents (a `Workflow` or parallel `Agent` calls, `model: 'opus'`). Run autonomously
through every phase; converge on **ONE agent to build**.

**Read `slackhack-research-brief.md` in this folder for the full verified context and objective
function.** Key constraints: build a Slack **agent** solving a real workflow *inside* Slack (NOT
a generic chatbot in a Slack UI); use ≥1 required tech — **Agent Builder/Agentforce, MCP server,
or RTS API** — "in a way that wouldn't be possible without it"; two tracks (**Agent for Good** =
measurable social benefit / **Agent for Organizations** = adoption potential); the free Dev
Program sandbox (a full Enterprise Grid org) unlocks RTS/MCP/Agent Builder at $0.

---

## THE PIPELINE — run all phases, no stops (fan out to Opus)

0. **Verify & deep research** — re-check rules/prizes/dates; map existing Slack agents
   (Marketplace, Agentforce templates, prior entries); confirm RTS scopes + MCP + Agent Builder
   capabilities on the free sandbox.
1. **Diverge** — 5 persona ideators across the **verbs of team work** (FIND / DECIDE /
   COORDINATE / REMEMBER / TRIAGE / COMPLY): Workflow Whisperer, Enterprise Flow Architect,
   Impact Maximizer (for Good), RTS Maximalist, Reinvention Assassin. MECE, concrete concepts.
2. **Shortlist** — Chair dedupes/kills to ~7 (kill generic-wrapper / weak-tech-hook / saturated /
   not-buildable). Kill log.
3. **Recon** — per-idea prior-art + feasibility + a load-bearing verdict on the required tech.
4. **Score** — rubric / diff / build / impact → OVR; tag BUILD/SHARPEN/FOLD/KILL; pick top 3.
5. **Converge** — 5 adversarial judges (Judge Whisperer, Narrative Scout, SDK Skeptic, Contrarian
   Operator, The Clock) vote → distill binary cruxes → parallel fact-check duels
   [CONFIRMED/PARTIALLY_TRUE/REFUTED] vs primary sources → resolve.
6. **Decide + kickoff board** — Chair memo picks ONE winner, kills runners-up on verified facts,
   defines the **48h "cake" spike** (agent pulls a real thread's context via **RTS** and acts via
   **MCP** in the sandbox; what must be TRUE; the fallback), the MVP scope, descope order, the
   wow demo beat (criteria 1 & 2 on one <3-min screen), and the measurable-impact statement.
   Render a Lavish kickoff board (`.lavish/slackhack-kickoff.html`) with recommended defaults +
   a "🚀 Start the build" go-button.

## The wow (load-bearing tech)

The Rally-analog "cake": the agent acts on **live, permission-scoped workspace context via RTS** —
something a generic chatbot literally cannot do. Criteria 1 (real workflow) + 2 (only-possible-
with-required-tech) must land on the *same* demo screen.

## DELIVERABLES

- `slackhack-research-brief.md` (already staged — the PART-1 context) ·
  `slackhack-decision-memo.md` (write) · `.lavish/slackhack-kickoff.html` (write, then
  `lavish-axi` it).

## GUARDRAILS

Verify before committing (tag verdicts + links); reject generic-chatbot wrappers; polish/scope
discipline (primitive survives, shell disposable); design for the <3-min demo + 5-7 min judge
look; all subagents `model: 'opus'` per `~/Developer/rally/AGENT_STATE.md` §6b; don't babysit —
surface only the final board.
