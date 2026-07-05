# Receipts — demo video

Autonomously produced <3-min demo. Real Slack footage (captured from the live sandbox by driving
the client) composed with Remotion on a branded background — the Rally pipeline (screenshots →
Remotion → ffmpeg), adapted for a Slack UI.

**Master:** `out/receipts-demo.mp4` — 1920×1080, H.264, ~60s, faststart. Upload to YouTube/Vimeo.

## Storyboard (≈60s, 30fps)
| # | Beat | Source | Caption |
|---|------|--------|---------|
| 1 | Intro | wordmark | *Ends the argument with the actual prior decision.* |
| 2 | The problem | `01_channel` | Decisions get made in Slack — then **re-litigated.** ("can never find where these land 😩") |
| 3 | Hero receipt | `02_receipt` | `@Receipts did we decide to drop Node 18?` → the real decision, **verbatim, attributed, one jump-link away** |
| 4 | FAQ deflect | `03_deflect` | The answer + **how many times it's been asked** |
| 5 | Permission-aware | `04_acl` | Ask about a channel you're not in → **it finds nothing** (searches *as you*) |
| 6 | The kicker | `05_leadership` | The decision was **right there** — in #leadership. A bot indexing all of Slack would've leaked it. **Receipts can't.** |
| 7 | Close | wordmark | *Permission-aware. No index. Just receipts.* |

## Regenerate
```bash
bun install
# capture: assets/*.png are real screenshots of the live sandbox (see repo scripts:
#   stage.ts seeds the conversation; summons posted via the user token; screenshots via browser-harness)
bunx remotion render ReceiptsDemo out/receipts-demo.mp4 --concurrency=4
ffmpeg -i out/receipts-demo.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart out/web.mp4
```
`bunx remotion studio` to scrub/tweak the composition live.

## Notes
- Every screenshot is REAL — the agent running in the sandbox, responding to real summons. No mockups.
- Silent + captioned (captions carry the narrative). A licensed-music pass is the one optional enhancement.
- Assets: `assets/` (source screenshots) mirrored to `public/` for Remotion `staticFile()`.
