# Story 7.3 — tk-qr-block side-by-side evidence (2026-09-24/25)

Reference: T-Bank invest-mobile app-install QR block, captured in
`.playwright-cli/captures-v2/invest-mobile/pattern-qr-loaded.png`
(1280×344: centered bold title, two-tab platform switcher, white QR
tile, caption note UNDER the tile). The kit render is the Playground
story (title + the reference tab pair + seeded placeholder QR art).

## Files

| File | What |
|---|---|
| `qr-block-side-by-side-light.png` | reference block (top) vs kit render (bottom), 2px `#E0E2E4` hairline — 1280×732 |
| `kit-qr-block-light.png` | kit render cropped from the Playground light baseline (1280×384) |
| `reference-block.png` | the reference block (the capture itself, 1280×344) |
| `reference-note-strip.png` | the under-tile note strip cropped + 3× upscaled (the position proof) |
| `probe-output.txt` | the raw ImageMagick probe transcript |

## Capture recipe (reproduce)

```sh
# baselines: pnpm build && pnpm test:visual (Playground story, light + dark)
magick tests/visual/visual.spec.ts-snapshots/visual-components-qrblock--playground-light-1-chromium.png \
  -crop 1280x384+0+256 +repage kit-qr-block-light.png
magick reference-block.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-qr-block-light.png -background white -append qr-block-side-by-side-light.png
```

## Probe method

ImageMagick scanline runs + single-pixel samples over the capture and
the kit baseline; vertical runs at x=640 locate every band boundary
(tabs → gap → tile → note). The note's position claim is triple-sourced:
the x=640 vertical run (tile starts y≈101 right under the tab strip —
no text between), the y280–343 row scan (a full text line at y303–323
UNDER the tile), and the 3× upscaled strip read.

## Ground truth — pixel probes: reference vs kit

Reference bands (x=640 vertical runs): tabs y≈16–58 · gap ≈43 · tile
y≈101–291 (QR image ≈121–276, ≈158px tall, padding 16 top/bottom) ·
note text y≈303–323 (12px under the tile card = space-12 EXACT).

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Anatomy order | title → tabs → tile → note UNDER the tile | identical DOM order (unit-pinned `compareDocumentPosition`) | match — CORRECTED this round |
| Title | ~26–28px/700 centered | heading-4 28/500 centered | match size; weight deviation 1 |
| Tab strip | 2 pills, active white + outline, inactive `#F2F4F7` fill | composed v1 tk-tabs VERBATIM (zero `--tk-tabs-*` overrides) | deviation 2 (inactive fill, recorded) |
| Tile | white `#FCFBFC`, padding 16 EXACT, soft shadow, radius ≈13–16 | surface-base, `--tk-space-16`, shadow-default, radius-lg 16 | match |
| Tile→note gap | 12px EXACT (card bottom ≈291 → ink top 303) | `--tk-space-12` (adjacent-sibling gated) | match exact |
| Note ink | core ≈`#C5C5C5` (~2.1:1 — AA-hostile caption tier) | text-secondary `#616871` (4.99:1) | deviation 3 (AA over capture — see below) |
| Note size | ink span 21px ⇒ ≈19–20px font | body-l 17 | deviation 4 (nearest ramp step, Δ2–3) |
| QR art | real encoding, ≈158px | consumer `qrSrc`; stories ship a seeded placeholder (168px, named-color SVG — no real encoding claimed) | kit surface by contract |

## The position correction (this round's finding)

The first implementation rendered the note ABOVE the tile (the spec
phrase order «security copy + the QR image»). Pixels refute that
reading: the capture has NO text between the tab strip and the tile
(tile background starts y≈101, 7px under the tabs) and the copy line
sits at y303–323 UNDER the tile card. Component, sheet, tests, and
stories were trued to tile-then-note; a DOM-order unit pin
(`tile.compareDocumentPosition(note) === DOCUMENT_POSITION_FOLLOWING`)
locks it.

## Vision check (analyze_image, 2026-09-25)

Gross-structure pass on the corrected light side-by-side: title, both
tabs, active state, and the centered QR image present in both. The
pre-correction pass had flagged the note as an EXTRA line between tabs
and tile — that flag triggered the pixel re-probe which proved the
reference carries the note UNDER the tile (the reference crop's own
note was initially misattributed). The corrected render matches.

## Intentional deviations (documented, not defects)

1. **Title weight 700 → heading-4 500** — the ramp's bold step is 500
   at 28px (no 700 slot); the same 700→500 call as v1 marketing
   surfaces.
2. **Inactive-tab fill `#F2F4F7` unexpressed.** The v1 DESIGN ruling
   freezes the tk-tabs track invisible; the capture's gray inactive
   fill rides the track and cannot be expressed without overriding the
   composed element's internals (the forbidden reimplementation). Zero
   `--tk-tabs-*` overrides shipped (unit-pinned); identical to v1
   tabs' own recorded delta.
3. **Note ink `#C5C5C5` → text-secondary.** The capture's caption tier
   is AA-hostile (~2.1:1); text-muted (the nearer channel match) FAILS
   axe live at 2.8:1 — the visual round's axe gate flagged it on four
   stories. The kit pins the AA secondary tier (4.99:1), the same
   AA-over-capture ruling as the stepper's brown badge.
4. **Note size ≈19–20px → body-l 17** — nearest ramp step.
5. **QR art is a placeholder in stories** — the kit NEVER generates QR
   encodings (`qrSrc` consumer-hosted; alt auto-composed «QR-код для
   {label}»); the placeholder is a deterministic seeded SVG grid in
   named black/white, labeled as art, not an encoding.
