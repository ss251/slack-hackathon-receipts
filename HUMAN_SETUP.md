# HUMAN_SETUP.md — the ~30 min only you can do (Phase 0)

Receipts can't run until there's a Slack sandbox + tokens, and that's a browser signup + OAuth
flow I can't click through. Do these steps, drop the tokens in `.env.local`, then run the cake
spike. Everything else (the app loop) I build after the spike goes green.

## 1 · Free sandbox (a full Enterprise Grid org, $0)
1. Join the **Slack Developer Program**: https://api.slack.com/developer-program → provision a
   **sandbox** (it's an Enterprise Grid org — this is what unlocks RTS/MCP/Agents for free).
2. Sign in to the sandbox workspace in your browser.

## 2 · Create the app + scopes
1. https://api.slack.com/apps → **Create New App** → **From scratch** → install into the sandbox.
2. **Socket Mode** → enable → create an **App-Level Token** with `connections:write` → this is
   `SLACK_APP_TOKEN` (`xapp-...`).
3. **OAuth & Permissions** →
   - **Bot Token Scopes:** `app_mentions:read`, `chat:write`, `channels:history`,
     `channels:read`, `groups:read`, `canvases:write`, `commands`.
   - **User Token Scopes:** `search:read.public`, `search:read.private`  ← the RTS engine.
4. **Agents** (left sidebar) → enable (auto-adds `assistant:write`).
5. **Event Subscriptions** → subscribe to bot event `app_mention`.
6. **Install to workspace** → copy the **Bot User OAuth Token** (`xoxb-`) and the **User OAuth
   Token** (`xoxp-`). Grab the **Signing Secret** from **Basic Information**.
7. Note the **App ID** (Basic Information) — needed for the Marketplace/Orgs step if we go Orgs.

> ⚠️ **RTS enablement check:** if `assistant.search.context` returns `not_allowed`/`not_enabled`
> in the spike, RTS may need turning on for the sandbox — check the Agents/AI settings, or ping
> Slack dev support. This is exactly what the spike is for: find out on day 1, not day 6.

## 3 · Seed the go/no-go scenario
In the sandbox, as **you** (the summoner):
1. A **public** channel `#maintainers` (or `#general`): post a clear decision, e.g.
   *"Decision: we're **dropping Node 18** support in v3 — EOL'd upstream, pin v2 if you need it."*
   Post it, then post 1–2 later "wait did we decide X?" messages so it reads as asked-before.
2. A **private** channel you are **NOT** a member of (have a second sandbox user create it) with a
   decision containing the word **"security audit"** — this is the ACL negative control.
3. (Optional, for the full demo) a repeat question asked 3× so the "asked & answered N×" repeat-answer counter shows on the receipt card.

## 4 · Fill env + run the spike
```bash
cd ~/Developer/slack-hackathon
cp .env.example .env.local
#  → paste SLACK_BOT_TOKEN, SLACK_APP_TOKEN, SLACK_SIGNING_SECRET, SLACK_USER_TOKEN, ANTHROPIC_API_KEY
#  → set SEED_QUERY / SEED_EXPECT_TEXT / SEED_PRIVATE_QUERY to match what you seeded
bun install
bun run spike
```
Green on all three (identity · retrieval · ACL boundary) = **GO**, and I build the loop. Yellow =
we read the output together and either fix the seed/scopes or take the public-channel fallback.

## What I've already scaffolded (no tokens needed)
`package.json` · `src/rts.ts` (the RTS engine wrapper) · `scripts/spike.ts` (this gate) ·
`AGENT_STATE.md` (the build spine). The app loop (`src/app.ts`) comes after GO — building it
before the spike would be building polish before the gate.
