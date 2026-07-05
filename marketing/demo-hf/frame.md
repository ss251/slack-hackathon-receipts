# Receipts — demo reel design spec

**Concept angle:** an *evidence reel*. The chat happens live; the agent produces the exhibit
that closes the case. Motif: receipts/evidence — mono "EXHIBIT" metadata, timestamps, a green
paper-trail accent. Not a "culture" film; a courtroom-fast product demo.

## Palette
- Canvas: radial aubergine `radial-gradient(120% 120% at 50% 0%, #4A154B 0%, #160a18 70%)`
  (radial only — full-screen linear bands under H.264). Local green glow accents.
- Slack surface (product fidelity): `#1A1D21` main, `#19171D` sidebar, `#222528` cards,
  `#2C2D30` borders, `#D1D2D3` body text, `#ABABAD` dim, mention blue `#1D9BD1`, active `#1164A3`.
- Accent: green `#2EB67D` (focal only — rings, kicker text, card spine), light `#42D492`.
- Neutrals tinted plum, never dead gray. No cyan/purple gradients, no gradient text.

## Type — three registers (voices, not hierarchy)
- **Narrator** (caption headlines): `Archivo Black` 400 (embedded; heavy display) 56–64px,
  tracking -0.5px. One expressive font; it performs.
- **Product** (Slack UI recreation): `Lato` 400/700/900 (embedded) — deliberate fidelity choice
  to real Slack; UI text 22–26px (video scale, ~1.5× real client).
- **Evidence** (kickers, metadata, timecodes, chips): `Space Mono` 400/700, 18–22px, uppercase
  kickers letter-spacing 0.12em, green or 40% white.
Tension: casual conversation (sans) vs hard evidence (mono).

## Layout (1920×1080)
- Stage: Slack window 1540×784 (44px chrome + 740 body) at x190, y44 → bottom 828.
- Caption band: y858→1058, left-aligned x150, max-width 1620. NEVER overlaps the window.
- Foreground metadata: mono labels top-left ("RECEIPTS · DEMO REEL") and top-right
  ("EXHIBIT A — #ENGINEERING"), hairline rules, y16–36 — edge-anchored.
- Background: radial glow (breathing), grain overlay 10–14%, ghost 🧾 texture ≤14%, 1px accent
  rules. 8–10 elements/scene.

## Motion
- Entrances `power2.out`/`power3.out`; pops `back.out(1.4–2)`; camera `power2.inOut` 0.8–1.0s;
  ambient `sine.inOut`. ≥3 eases per scene. Message pop: y+24→0, scale .98→1, origin left bottom,
  0.4s. Thread slides up (translateY) as messages land. Typing: per-char steps. Count-ups snap.
- Exits banned except final scene (outro fades to black).

## Don'ts
- No screenshots — every UI element native HTML. No linear full-frame gradients. No `#000`/`#fff`
  pure (tint). No two-sans pairing outside the UI register. No spinner/loader clichés.
