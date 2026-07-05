# Receipts — manual demo runbook

For recording the submission video (or a live judge demo) against the REAL sandbox.
Everything here is one command + typing three summons.

## Pre-flight (2 minutes)

```bash
cd ~/Developer/slack-hackathon
bun run dev          # the agent (Socket Mode) — leave running in a terminal
bun run stage        # wipes #engineering + reseeds the pristine team conversation
                     # wait ~15s after it finishes (RTS reindex) before summoning
```

Then open the sandbox in the browser: `https://app.slack.com/client/T0BF4NMJ9TQ/C0BG177PNE4`
(#engineering). Hard-refresh (Cmd+R) so the client shows the fresh state. If any old
`@Receipts` exchange lingers on screen, it's client cache — refresh again; the API state is clean.

## The demo (3 beats, ~90 seconds of screen time)

**Setup line (say while showing the channel):** the team decided to drop Node 18 three weeks
ago — and Leo just re-asked, and Priya can't find where it landed. Every team, weekly.

1. **The receipt (hero).** Type: `@Receipts did we decide to drop Node 18?`
   → Reply in-channel (~5-8s): *"🧾 Receipts — here's the prior decision by **@Dana Okafor**
   in 🔒 engineering on Jul 5, 2026"* + verbatim quote + *"asked & answered N× · searched as
   you (permission-aware) · ✅ what's changed since: nothing"* + **Jump to message** button.
   **Click Jump** — it lands on Dana's actual message. That's the argument-ender.

2. **The FAQ-deflect.** Type: `@Receipts how do I run the migrations locally?`
   → Prior answer (`bun run migrate:local`) + the asked-count. Point at the count:
   "it knows this is the Nth time — the FAQ writes itself."

3. **The ACL kicker.** Type: `@Receipts what did we decide about our analytics vendor?`
   → *"🔍 I searched what you can see for **analytics vendor** — no prior decision on record."*
   **The punchline:** that decision EXISTS — in `#leadership-exec`, a private channel you're not
   in. Receipts searches AS YOU via Slack's Real-Time Search API, so it structurally cannot leak
   it. A bot with its own index would have.

## Showing the hidden channel (optional reveal)

You can't see #leadership-exec (that's the point). To prove it exists on camera:
- **Option A (recommended):** second browser/incognito as the workspace owner
  (`receipts-hackathon.enterprise.slack.com`, owner login in memory/1Password), open
  #leadership-exec, show Dana's Mixpanel decision sitting there.
- **Option B:** re-run the reveal helper to temporarily add+remove you (leaves "was added"
  system lines — only if you'll crop/blur):
  the invite/kick pattern is in git history (`scripts/tmp-invite.ts`, commit e18fae2).
- Note: the channel auto-archives when the bot is its only member. If needed:
  `conversations.unarchive` via bot token first (see project memory).

## Gotchas (from the build sessions)

- **RTS indexes new messages in ~15s** — don't summon immediately after `stage`.
- Keyword retrieval is robust now (progressive widening), but phrase questions naturally —
  the three summons above are all verified live.
- The app replies **in-channel** to top-level mentions (demo-friendly). In-thread mentions
  reply in-thread.
- Tokens rotate if you reinstall the app — `.env.local` + restart `bun run dev`.
- Slack client cache lies after API deletions — Cmd+R.

## Re-record / reset

`bun run stage` again → wait 15s → clean slate. Repeatable forever.

## Assets if you want cutaways

- Produced film (v3, HyperFrames, 62.5s): `marketing/demo-hf/out/receipts-demo.mp4` —
  usable as intro/outro bookends or B-roll around your live capture.
- Real-footage stills: `marketing/demo/assets/*.png`.
