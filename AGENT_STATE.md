# AGENT_STATE.md — Receipts (Slack Agent Builder Challenge)

> Loop-engineering spine (Rally pattern). Every turn: (1) read this whole file, (2) find the
> first unchecked item in §7, (3) do it or launch the agent for it, (4) append to §9 + check the
> box. Designed so context compaction cannot hurt the build. **RESUME POINT is at the tail.**

---

## §1 — Goal
Ship **Receipts**, a Slack agent for the **Slack Agent Builder Challenge** (deadline **2026-07-13
17:00 PT**; target submitted by Jul-12 night). One agent, two summon moments on one engine:
- **Receipt (hero demo beat):** someone re-litigates a settled thing → a human summons Receipts →
  it returns the prior decision/answer as a card: **verbatim quote + @author + date + live
  permalink**, searched **as the summoner** (permission-aware). "The bot ended the argument with
  a link from March."
- **Deflect (sticky proof beat):** the same engine on a **repeat question** → "asked & answered
  3× — best answer by @maintainer [jump]" → after the 3rd, drafts an **FAQ canvas** entry.

## §2 — Why this (settled — do not relitigate)
Arrived at after four passes. Rubric-first gave a hollow governance bot ("no value"); sentiment-
grounded fun-lane gave a culture bot ("cringe"). Fable's roast produced the law that decides
everything: **cool tools transfer status to their user; cringe tools perform personality for their
owner.** Receipts is a *summoned weapon* — the human aims it, the human gets the win. The founder
picked it and cleared the gut-check: the killed **Contradiction Catcher** shared the same engine
(RTS search → cite w/ permalink) but was a **push-nanny** firing on a hypothetical; "no value" was
the nanny, not the engine. Receipts fixes CC's two real risks by design: **frequency** (broaden
the summon + the always-firing repeat-question deflect) and **native-search shadow** (aim at
**community** Slacks and answer from *conversations that never became docs*).

## §3 — Spec (the loop)
1. **Summon** — `@Receipts <question/claim>` (app_mention) OR message shortcut **"Pull receipts"**
   on a specific message. (🔁 reaction = nice-to-have, pending §7 spike on action_token.)
2. **Read intent** — Claude (temp 0) extracts the question + the rare distinctive keyword.
3. **Search-as-summoner** — RTS `assistant.search.context`, **keyword mode**, `channel_types`
   incl. `private_channel`, run as the summoner → prior messages w/ author, ts, **permalink**.
4. **Rank + detect** — Claude picks the best prior decision/answer; counts prior instances
   (repeat detection comes FROM the search — N hits = asked N×); flags "what's changed: nothing"
   when no later contradicting message exists.
5. **Post the receipt** — a card in-thread: verbatim quote + @author + date + **[jump] permalink**
   + "asked & answered N×". Whisper-first (ephemeral) option for the asker to save face.
6. **Deflect loop** — on a repeat, offer "add to FAQ"; maintainer approves → append to the **FAQ
   canvas** (the persistent artifact that accretes as a side effect of questions).

**"Wouldn't be possible without the required tech":** permission-aware **live** search of
conversation history + write-back, **as the summoner**. The unfakeable artifact: a prior decision
in a channel the summoner can't see stays hidden — the ACL boundary is real, not staged.

## §4 — Constraints
- Must be a Slack **agent** using ≥1 required tech load-bearingly. **RTS is the engine** (not
  decoration). MCP/Web API for the writes. Agentforce not needed.
- Free **Slack Developer Program sandbox = full Enterprise Grid org** ($0) unlocks RTS/MCP/canvas.
- **Track: Agent for Good** (sustaining OSS / volunteer / community Slacks — measurable:
  deflection rate, median time-to-answer, maintainer response-load). Orgs fallback: internal
  #help channels have identical mechanics.
- **RTS "no-store" rule:** never persist retrieved message content in our own datastore — surface
  via **permalink + short verbatim quote** (Slack calls sharing sources a best practice). The FAQ
  canvas stores the maintainer-approved answer, linking source, not a scraped copy.

## §5 — Decisions (made)
- Hero beat = **Receipt** (spicy, screenshot-worthy); sticky beat = **FAQ-deflect** (frequent,
  "still using it next week"). One agent, both beats.
- Primary trigger = **app_mention** (most reliable `action_token` carrier for RTS bot-token). Msg
  shortcut secondary. 🔁 reaction only if the spike proves it carries the token.
- **Community venue**, not corporate — dodges native-search shadow + HR-cringe.
- Answer = **verbatim quote + permalink, never a bare summary** (receipts, not vibes).

## §6 — Guardrails / build workflow
- **Model tiering:** main loop orchestrates; all build/verify agents pinned `model: 'opus'`
  (forks inherit the session model — pin explicitly). Fable only for taste/strategy panels.
- **Skill gates:** `Skill(frontend-design)` for any Block Kit / canvas UI PR; context7 for
  Bolt/Slack SDK API questions; screenshot-loop verify for the receipt card + canvas.
- **Push after every commit** (Railway uploads working dir, not git — never leave a fix unpushed).
- **Smoke-test the built server** before every deploy (boot + a real summon in the sandbox).
- **Prove it in the sandbox, then write the README from receipts.** Submission materials LAST.

## §6a — UX bar (the receipt card must feel like a mic-drop)
Every summon → a clean Block Kit card: the quote in a quote block, `@author · #channel · date`,
a prominent **Jump to message** button, and the "asked & answered N× · what's changed: nothing"
line. Loop the card design until it reads as *evidence*, not chat. Screenshot on iPhone + desktop.

## §7 — Phase plan (do first-unchecked)
**Phase 0 — Human unblock (DONE 2026-07-05, via browser-harness)**
- [x] Joined Slack Developer Program → provisioned Enterprise Grid sandbox **Receipts**
      (`receipts-hackathon.enterprise.slack.com`, event code, no card)
- [x] Created app **Receipts** (App ID `A0BERD58JQP`) from `manifest.yaml`; installed; bot +
      user tokens (search:read.public/private) in `.env.local`. (Agents toggle + app-level
      token + signing secret still TODO — only needed for Phase 2 runtime, not the spike.)

**Phase 1 — THE 48h CAKE SPIKE — 🟢 GO (all 3 PASS, 2026-07-05)**
- [x] **Spike-1 (identity, #1 risk):** RTS `assistant.search.context` works **with the user
      token directly — no action_token needed.** Risk retired.
- [x] **Spike-2 (retrieval):** keyword search returns the seeded "dropping Node 18" decision
      from #general **with a resolvable permalink**. (Bug found+fixed: RTS returns `content`, not
      `text`; mapper corrected in `src/rts.ts`.)
- [x] **Spike-3 (ACL boundary):** the private #security-audit decision is correctly **NOT**
      surfaced to the summoner. The unfakeable demo kicker is real. **GO.**

**Phase 2 — Build the loop** *(after GO)*
- [x] Repo scaffold: `package.json`, `tsconfig`, `.gitignore`, `.env.example`, `src/rts.ts`
      (RTS engine wrapper), `scripts/spike.ts` (the gate). `bun install` ✓, typecheck ✓, spike
      fails cleanly w/o token ✓. (2026-07-05)
- [ ] Bolt app scaffold (TypeScript, Socket Mode dev) + summon handlers (app_mention + shortcut)
- [ ] RTS search-as-summoner module (keyword mode, permalink extraction)
- [ ] Claude rank/repeat-detect/format module (temp 0)
- [ ] Receipt card (Block Kit) + Jump button + whisper-first option
- [ ] FAQ-deflect loop + canvas write (maintainer-approve)

**Phase 3 — Seed + demo**
- [ ] Seed sandbox "community" workspace: a real prior decision + repeats + one **private-channel**
      decision for the ACL kicker + a believable ~few-week backstory
- [ ] Architecture diagram; scripted 3-min demo (see §demo); recorded fallback take
- [ ] Deploy to Railway (HTTP), smoke-test, grant test access to `slackhack@salesforce.com` +
      `testing@devpost.com`

**Phase 4 — Submit**
- [ ] <3-min video; writeup (address frequency + native-search differentiation honestly + the
      conversations-not-docs gap); submit by **Jul-12 night**

## §8 — Key paths
- Repo: `~/Developer/slack-hackathon/` · Brief: `slackhack-research-brief.md` · Sentiment:
  `sentiment-grounded-ideas.md` / `anti-cringe-ideas.md` · Boards: `.lavish/`

## §9 — Progress log (append-only)
- 2026-07-05 — Concept locked: **Receipts** (hero) + FAQ-deflect (sticky), one engine. Gut-check
  cleared (engine ≠ nanny). Track: Agent for Good, community venue. This file created.
- 2026-07-05 — Repo scaffolded (bun): RTS wrapper + cake-spike script + HUMAN_SETUP.md. Deps
  installed, typecheck clean, spike fails cleanly without a token.
- 2026-07-05 — **Phase 0 DONE + Phase 1 🟢 GO.** Sandbox provisioned (event code, no card), app
  Receipts (A0BERD58JQP) created from manifest + installed, tokens in `.env.local`. Seeded #general
  (Node-18 decision + repeats) + private #security-audit. **Spike: 3/3 PASS** — RTS works w/ user
  token, retrieval w/ permalink, ACL boundary holds. Concept proven end-to-end on real Slack.
  **NEXT = Phase 2: build the Bolt app loop** (`src/app.ts`: summon → search → receipt card → FAQ).

---

## RESUME POINT (read first if resuming)
Concept is locked and this spine is written. **Next action: Phase-0 human unblock, then run the
Phase-1 cake spike (identity → retrieval → ACL) as the GO/NO-GO gate before building anything
else.** Do not build the loop until Spike-3 passes; if identity (Spike-1) is hard, degrade to
public-channel bot-scope search and keep going. Never cut the verbatim-quote + live-permalink.
