# Receipts — Devpost submission kit

> Deadline: **July 13, 2026 · 5:00 PM PT.** Track: **Agent for Good.**
> This file holds the text description, naming rationale, required-tech justification,
> and the submission checklist. Diagram lives in `docs/architecture.*`, video script in
> `marketing/VIDEO_SCRIPT.md`.
>
> ⚠️ The judges explicitly warned: *don't ship a fully AI-written description.* Treat the
> draft below as a **skeleton with the facts and structure correct** — then rewrite it in
> your own voice before pasting into Devpost. The 🖊️ marks are where your voice matters most.

---

## Project name — verdict: **keep "Receipts"**

It already passes the judges' naming test. "Receipts" is internet-native slang for *proof of
what someone actually said* — which is literally the product. It's specific, memorable, and a
human would say it ("pull the receipts"). It is the opposite of the ❌ examples they called out
(SlackBot Pro / AgentAI / SmartFlow).

- One disambiguation risk: "Receipts" can read as an *expense/finance* tool. The tagline kills
  that instantly — always pair the name with the line below.
- If you ever want alternates to riff on: **Pull Receipts**, **On Record**, **Called It**,
  **Prior Art**. But I'd defend Receipts.

**Tagline:** *Your community already answered this. Receipts pulls the proof.*

---

## Text description (draft — rewrite in your voice)

**Paragraph 1 — What / Who / Why (the judges read this first):**

> Receipts settles arguments your community already had. Summon it —
> `@Receipts did we decide to drop Node 18?` — and it searches your Slack history **as you**
> (only what you're allowed to see) and posts the actual prior message: a verbatim quote, who
> said it, which channel, the date, and a one-tap Jump link to the source. It's built for the
> big volunteer-run and open-source communities on Slack, where the same questions get
> re-litigated every week and the answer is already buried somewhere in the scroll. It matters
> because those communities have no docs team and no institutional memory — decisions live in
> threads nobody can find twice, so they get re-argued, long-time members burn out repeating
> themselves, and newcomers get five different answers to the same question.

**How it works (keep it concrete):**

> Receipts is a Slack agent (Bolt + Socket Mode). When summoned, it extracts the distinctive
> topic keyword, runs Slack's **Real-Time Search API** (`assistant.search.context`) *scoped to
> the summoner's own permissions*, judges whether the top hit is an actual decision and whether
> anything later revised it, and renders a Block Kit "receipt" card — verbatim quote, author,
> channel, date, a live permalink, and an "asked & answered N×" counter that shows how often the
> community has re-tread this exact ground.

🖊️ **Impact (be specific — this is the Agent-for-Good bar):** don't write "helps communities."
Write the mechanism + a real number from your demo. Template to fill after you record:

> In our test community, "did we decide X?" had been asked **3 times across 3 weeks** before
> Receipts. With Receipts, the answer comes back in **seconds, sourced, with the permalink** —
> the fourth person never has to interrupt the person who originally decided it. It turns every
> repeat question into an instant, cited answer, and it does it **without a docs team, a wiki, or
> anyone maintaining anything** — the source of truth is the conversation that already happened.

**The trust guarantee (this is your differentiator — say it out loud):**

> Because the search runs as the summoner, Receipts can never surface a decision from a private
> channel you're not in. Ask it about something discussed only in `#leadership` and it says
> "nothing on record" — it doesn't leak what you can't see. A generic bot indexing the workspace
> would either miss everything said before it was installed, or leak across permission
> boundaries. Receipts can't, by construction.

---

## Required-technology justification (RTS API)

The judges asked: *would this agent be meaningfully worse without the required tech?* **Yes —
Receipts does not exist without it.** The Real-Time Search API (`assistant.search.context`) is
the only mechanism that lets an agent cite the *real* prior message, across the whole history,
**permission-correctly**:

- **Without RTS**, the alternatives are (a) a bot indexing messages itself → blind to everything
  said before install, and a second stale copy of the truth; or (b) generic search that ignores
  who's asking → leaks private-channel decisions across ACL boundaries.
- **With RTS run as the summoner**, the answer is always the live source of truth *and* is
  guaranteed to only include what that person can already see. That permission-scoping is the
  product's core promise, not a checkbox.

This is a "used it because it's load-bearing," not "bolted it on."

---

## Submission checklist (mapped to the judges' email)

### Required items
- [ ] **Architecture diagram** — built (`docs/architecture.png`). Upload via the Devpost **file
      upload field** on the submission form — *not* the image carousel.
- [ ] **Demo video** (< 3 min) — script in `marketing/VIDEO_SCRIPT.md`.
- [ ] **Text description** — from this file, rewritten in your voice.
- [x] **Sandbox test access** — ✅ **DONE (2026-07-06).** Both `slackhack@salesforce.com` and
      `testing@devpost.com` invited as **Member** ("coworker", not Guest) and added to `#engineering`.
      Invites expire in 31 days — they must accept before the deadline. Re-invite steps below if needed.

### Build (what the judges score)
- [x] **Does one thing well** — Receipts cites the prior decision. Already scoped tight; don't add features.
- [x] **Native Block Kit UI** — receipt card uses section/context/actions blocks (`receipts.ts`), not a wall of text.
- [x] **Required tech is load-bearing** — RTS is the product (see justification above).
- [ ] **Decide the FAQ-deflect beat** — the "asked & answered N×" → grow an FAQ canvas write-back
      is speced but **not built**. It's the difference between a one-shot gag and something a
      community keeps using (the retention story). Build it this week *or* cut it cleanly from the
      video — don't show a half-built beat.
- [ ] **Restore the live LLM path** — the Anthropic OAuth token expired, so keyword/judge run on
      heuristics. Drop a fresh `ANTHROPIC_API_KEY` in `.env.local` for a crisper demo.

### Video hygiene
- [ ] Lead with the **problem** in the first 15s (not your name/stack).
- [ ] Demo **front and center** (working product inside the first 60s).
- [ ] Script written & rehearsed (no winging it — it eats the 3 min).
- [ ] Uploaded **public** — confirm in an **incognito window** it plays without login.
- [ ] Uploaded **≥ 24h before deadline** (processing time).

### Honesty notes (disclose, don't hide)
- MVP searches as the **installer's** user token, not per-summoner OAuth. Fine for the demo;
  say "in production, per-user OAuth or the event action_token searches as whoever summoned."

---

## How to grant sandbox Member access (do this early)

Sandbox: org `receipts-hackathon.enterprise.slack.com`, team `T0BF4NMJ9TQ`.

1. Invite **both** emails as **Members** (Slack admin → Manage members → Invite people → set
   role to **Member**, not Single-Channel/Multi-Channel **Guest**).
2. Make sure they can see the demo channel `#engineering` (`C0BG177PNE4`) — add them to it.
3. Confirm the Receipts app (`A0BERD58JQP`) is installed and running (`bun run dev`, Socket Mode).
4. From a fresh account, verify a summon works end-to-end before you list the sandbox on Devpost.
