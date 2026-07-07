# Receipts — demo video script (target 2:45, hard cap 3:00)

Judges may stop at 3:00 and may score from the video alone. So: **problem in the first 15
seconds, working demo inside the first 60.** No "hi my name is / my stack is." Rehearse it —
a scripted read buys you ~40% more show-time than winging it.

Legend: **[SCREEN]** = what's on screen · **(VO)** = voiceover.

---

### 0:00–0:15 — HOOK: the pain, cold
**[SCREEN]** A real Slack channel. Same question typed three times, weeks apart, by three people:
"wait, did we decide to drop Node 18?" · "are we on Node 18 or 20?" · "what did we land on for Node?"
**(VO)** "Every active community has this problem. The decision was made. Nobody can find it. So
you have it again."

### 0:15–0:55 — HERO: the summon + the receipt
**[SCREEN]** Someone types `@Receipts did we decide to drop Node 18?` → the receipt card appears:
verbatim quote by **Dana**, in **#engineering**, dated, **↪ Jump** button, and *"asked & answered 3×."*
**(VO)** "Summon Receipts. It finds the actual message someone already wrote — the exact quote,
who said it, when, and a link straight to it. Not a summary. The receipt." *(Click Jump → it lands
on the original message.)* "Asked and answered three times. Now it's answered for good."

### 0:55–1:30 — THE DIFFERENTIATOR: it searches *as you*
**[SCREEN]** Same summon, but for a decision that only lives in a private **#leadership** channel
the summoner isn't in → card reads *"I searched what you can see — nothing on record."*
**(VO)** "Here's what makes it safe. Receipts searches **as you** — only what you're allowed to
see. This decision lives in a private channel I'm not in, so Receipts won't surface it. A bot
indexing the whole workspace would leak it. Receipts can't — by construction." *(This is the beat
that can't be faked. Land it slowly.)*

### 1:30–2:00 — STICKY: repeat questions get deflected  *(only if built)*
**[SCREEN]** The "asked & answered N×" counter ticks up; a maintainer approves → an FAQ canvas
gains a new entry linking the source permalink.
**(VO)** "When the same question keeps coming back, Receipts offers to pin it — one tap grows a
living FAQ, sourced to the real thread. The community's memory maintains itself."
*(If FAQ-deflect isn't built by film day: cut this section, show the message shortcut "Pull
receipts" on any message instead, and keep the video tighter. Never show a half-built beat.)*

### 2:00–2:25 — HOW (fast, don't dwell)
**[SCREEN]** The one-screen architecture diagram (`docs/architecture.png`).
**(VO)** "Under the hood: a Slack agent built on Block Kit, powered by Slack's Real-Time Search
API — run with the summoner's own permissions. One piece of tech, because it's the whole point."

### 2:25–2:45 — WHO IT'S FOR + WHY IT MATTERS (Agent for Good)
**[SCREEN]** A large volunteer/OSS-style community sidebar.
**(VO)** "Receipts is for the communities that run on volunteers — no docs team, no wiki, no one
paid to remember. It turns every buried decision into an instant, sourced answer, so people stop
re-arguing and newcomers stop getting five different answers."

### 2:45–3:00 — CLOSE
**[SCREEN]** The receipt card, then the name.
**(VO)** "Receipts. Your community already answered this."

---

**Capture notes:** run `bun run dev`, then `bun run stage` and wait ~15s for RTS to reindex before
filming (per `DEMO_RUNBOOK.md`). Record the three summons live — the hero receipt, the private-channel
"nothing on record," and (if built) the FAQ pin. The HyperFrames film in `marketing/demo-hf/` is your
intro/outro/B-roll; the live captures are the proof.
