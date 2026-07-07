# RESUME CONTEXT — "Receipts" (Slack Agent Builder Challenge)

> Reconstructed 2026-07-06 from surviving artifacts after the original chat transcript
> (session `e05926a8-b6ea-40b1-98e0-5bc5e6116d08`) was deleted in the Jul 6 disk cleanup.
> Grounded in the on-disk repo (git HEAD `dcb1944`, clean tree), the three war-room workflow
> scripts + journals, and `.lavish`/ideation docs. The chat log is gone; the work is intact.

## 1. What the project is
- **Event:** Slack × Salesforce **Agent Builder Challenge** (Devpost). Deadline **2026-07-13 17:00 PT**; internal target **submit Jul-12 night**. Up to $74.4K, 9 winners, Dreamforce 2026 feature. Requires one Slack **agent** solving a real in-Slack workflow using ≥1 required tech (Agent Builder/Agentforce · MCP · **RTS API**), plus a <3-min demo video, architecture diagram, and a sandbox with test access for `slackhack@salesforce.com` + `testing@devpost.com`.
- **What got built = "Receipts."** A Slack agent that **ends re-litigated arguments by returning the actual prior decision**: someone summons it, it runs Slack's **Real-Time Search (RTS) `assistant.search.context`** *as the summoner* (permission-aware) and posts a Block Kit "receipt" card — **verbatim quote + @author + #channel + date + live [Jump] permalink + "asked & answered N×"**. Track: **Agent for Good** (community/OSS Slacks).
- **The load-bearing "cake":** because RTS searches *as you*, a prior decision in a channel you can't see stays hidden — an ACL boundary a generic bot over a stale index would leak. That's the unfakeable demo beat.

## 2. Key decisions made (ideation lineage — four passes)
1. **War-room** (`wf_84c9ff9c`, *slackhack-ideation-war-room*, 27-agent pipeline, 24→7→3→1). Winner: **Contradiction Catcher** (4/5 judges). **Founder rejected it as "no value"** (a reactive governance/push-nanny bot).
2. **Value-first pass** (`wf_327028ec`) — redirected away from rubric/governance/tech-first toward real pain; found productivity lane already colonized (Slack shipping ~30 native AI features).
3. **Fun/culture lane** (`wf_a22020ac`) — delight portfolio. **Founder rejected the culture bot as "cringe"** (`anti-cringe-ideas.md`).
4. **Convergence:** Fable's roast — *"cool tools transfer status to their user; cringe tools perform personality for their owner."* Founder landed on **Receipts** — Contradiction Catcher's RTS engine reframed from an auto-firing nanny into a **summoned weapon** (human aims it, human gets the win). **Settled — do not relitigate** (AGENT_STATE §2).

**Design locked (AGENT_STATE §5):** hero beat = **Receipt**; sticky beat = **FAQ-deflect** (repeat question → grow an FAQ canvas); trigger = **app_mention** + "Pull receipts" shortcut; **community venue**; answer = **verbatim quote + permalink, never a bare summary**; RTS **keyword mode** only; **never persist** retrieved content.

## 3. Current state (works, proven live)
Git HEAD `dcb1944`, tree clean. Phases 0–2 mostly done and smoke-tested on real Slack.

**Agent code (`src/`):** `rts.ts` (RTS wrapper, keyword mode, scoped as token owner — note RTS returns `content` not `text`), `llm.ts` (keyword extraction + temp-0 judge via `ANTHROPIC_API_KEY`/keychain OAuth, **falls back to heuristics** — currently on heuristic path, OAuth expired), `receipts.ts` (summon → `progressiveSearch` → judge → Block Kit card w/ Jump; `enrichAuthor` for persona names), `app.ts` (live Bolt Socket-Mode app: `app_mention` + `pull_receipts` shortcut).

**Scripts:** `spike.ts` (go/no-go gate — **passed 3/3**: identity, retrieval+permalink, ACL boundary holds), `seed.ts`/`stage.ts` (reseed 5-persona demo convo), `dry-run.ts`, `post-summon.ts` (posts an `@Receipts` mention *as the user*, polls for reply — how the live test was run).

**Sandbox live:** app **Receipts** `A0BERD58JQP`, org `receipts-hackathon.enterprise.slack.com`, team `T0BF4NMJ9TQ`, `#engineering` `C0BG177PNE4`, bot `U0BERDD87FH`. Tokens in `.env.local`. Seeded: `#engineering` has Dana's "dropping Node 18" decision + thrice-asked migrations question; private `#leadership` holds a decision the summoner is NOT in (ACL control).

**Demo assets:** `marketing/demo/out/receipts-demo.mp4` (Remotion, real footage ~60s) + `marketing/demo-hf/out/receipts-demo.mp4` (HyperFrames native Slack-UI recreation, 62.5s). `DEMO_RUNBOOK.md`: all three summons verified live.

**⚠️ `AGENT_STATE.md` is stale** (last 10:28) — its §7 shows the live smoke test unchecked and RESUME POINT points back to the already-passed spike. **Trust git + `DEMO_RUNBOOK.md` (18:49) over AGENT_STATE.**

## 4. In flight / open threads
- **FAQ-deflect canvas beat NOT built** — card shows "asked & answered N×" but the maintainer-approve → `canvases.write` write-back (the sticky second beat) is unbuilt. Biggest missing product piece.
- **Whisper-first (ephemeral) option** specced, not implemented.
- **No deploy** — local Socket Mode only. **Test access NOT yet granted** to `slackhack@salesforce.com` / `testing@devpost.com` (hard requirement).
- **Architecture diagram** not created.
- **LLM path degraded** — OAuth token expired; running on heuristics. A fresh `ANTHROPIC_API_KEY` in `.env.local` sharpens the demo.
- **Identity is single-token MVP** — searches as installer's `SLACK_USER_TOKEN`, not the actual summoner. Fine for demo; flag honestly in writeup.
- **Submission itself** (video cut, writeup, Devpost submit) not done. Founder plans to **record the live demo himself**; HyperFrames film = intro/outro/B-roll.

## 5. Next steps
1. **Re-sync `AGENT_STATE.md`** to reality (check off live test + films; fix stale RESUME POINT).
2. **Build the FAQ-deflect canvas beat** — maintainer-approve → `canvases.write` appending an FAQ entry linking the source permalink.
3. **Restore live LLM path** — fresh `ANTHROPIC_API_KEY` in `.env.local`; re-run `bun run scripts/dry-run.ts "did we decide to drop Node 18?"`.
4. **Clear submission blockers** — deploy (Railway HTTP or keep Socket Mode), **grant sandbox test access**, draw the Mermaid architecture diagram.
5. **Cut & submit** — `bun run dev` + `bun run stage` (~15s RTS reindex), capture 3 beats per `DEMO_RUNBOOK.md`, assemble <3-min video (HF film as bookends), writeup emphasizing frequency + native-search differentiation + quantified impact, submit **Jul-12 night**.

**Key paths:** `AGENT_STATE.md` (stale — see §3) · `DEMO_RUNBOOK.md` · `HUMAN_SETUP.md` · `manifest.yaml` · decision trail `slackhack-decision-memo.md` + `anti-cringe-ideas.md` + `sentiment-grounded-ideas.md` · `.lavish/*.html` · `src/{rts,llm,receipts,app}.ts` · `scripts/{spike,seed,stage,dry-run,post-summon}.ts` · films `marketing/demo{,-hf}/out/`.
