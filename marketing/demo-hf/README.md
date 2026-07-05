# Receipts — demo film (HyperFrames)

**The submission master.** `out/receipts-demo.mp4` — 1920×1080 H.264 + AAC, 62.5s.
Authored autonomously as a **native Slack-UI recreation** (zero screenshots): the conversation
plays out live — messages spring in, the summon is typed char-by-char, the receipt card
*assembles* (quote → author → count-up → jump chip), the ACL beat finds nothing, and the kicker
cuts inside the private channel where the decision was correctly hidden.

Built with [HyperFrames](https://hyperframes.heygen.com) (HTML+GSAP → deterministic render),
per the five-stream research verdict (X/GitHub/web: "pros rebuild the UI natively and animate
every element; Linear is the bar; no VO — music, SFX and captions carry it").

## Structure
- `frame.md` — design spec (evidence-reel concept; aubergine/green; Archivo Black / Lato / Space Mono registers)
- `index.html` — thin orchestrator: 4 scene slots + BGM/SFX tracks on event frames
- `compositions/intro.html` — wordmark cold open
- `compositions/eng.html` — the centerpiece: live #engineering conversation, declarative
  message timeline (fixed slot heights → deterministic bottom-anchored scroll), typed summon,
  thinking dots, card assembly, camera push-ins keyed to events, caption band (never over UI)
- `compositions/lead.html` — the kicker: #leadership-exec reveal, evidence ring + chip
- `compositions/outro.html` — end card (only scene allowed to fade out)
- `assets/bgm.mp3` — CC0 ambient bed (archive.org, fades baked); `assets/sfx/` — bundled library

## Workflow
```bash
npm run check     # lint + validate + inspect
npx hyperframes snapshot --at 3,9,16,21.5,31,38.5,50.5,59   # visual gate (Gemini-described)
npm run render    # → out/*.mp4  (~64s for the full film)
npm run dev       # live preview (Studio)
```
Old Remotion pipeline (screenshot-pan approach, superseded): `../demo/`.
