# tk-combobox-search — reference pixel ground truth (2026-09-24)

Source: `.playwright-cli/captures-v2/invest-stocks/pattern-catalog-filters.png`
(824×1731) top region — the «Название или тикер» field. Measured with
ImageMagick scanline runs (runs.awk, committed alongside). This table feeds
NOTES.md once the kit render exists (story 6.3).

| Aspect | Measured value |
|---|---|
| Field extent | full-width x0→824; bottom edge y≈55 (pure white core y23–55 at x=400; the capture CROPS the top — visible ≥52px, spec's 52 consistent) |
| Field fill | #FFFFFF pure (page around it #F6F7F8 muted) |
| Border | NONE — white-on-muted with pure AA steps, zero hairline (the search register, distinct from Input/Select) |
| Corner radius (bottom-left) | fill starts x7 at dy=1 above the bottom edge → r≈11–12 (radius-md 12 confirmed) |
| Magnifier icon | strokes x≈19–31 (≈13px span), core #999999 (~1.5–2px stroke), AA #B2/#CC — gray/text-muted family |
| Icon → placeholder gap | ≈20px (icon ends x31, first placeholder glyph x52) |
| Placeholder | gray cores #999999–#A5A5A5 (muted family), glyph band centered y≈30, starts x52 |
| Chips row below (context) | y80–124, bg #F6F7F8 (the 6.2 reference-row crop came from +76) |

Kit-side expectations to verify when the render exists: 52px height
(spec), flat surface-base on muted canvas, radius-md, icon text-muted
token (#959BA4 vs ref #999 — token semantics, expected small deviation),
placeholder text-muted, §8 focus ring. Vision check subject to the CDN
session-slot fault (see pagination/NOTES.md 2026-09-24) — if blocked,
document honestly; pixels remain ground truth.
