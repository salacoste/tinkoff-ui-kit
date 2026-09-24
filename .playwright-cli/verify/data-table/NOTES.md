# Story 6.4 — tk-data-table side-by-side evidence (2026-09-24)

Reference: T-Bank invest/stocks catalog table — captured in
`.playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png`
(776px content column, 776×1164). The kit render reproduces the capture's
own anatomy (Название/Цена/Изменение, two-line cells, real RU tickers) at
the Playground story's canvas width (1232px): 10 rows, deltas positive/
negative/mixed, whole-row hover via the anchor `::after` stitch.

## Files

| File | What |
| --- | --- |
| `data-table-side-by-side-light.png` / `-dark.png` | reference crop (top) vs kit render (bottom), 2px gray hairline between, white background |
| `kit-data-table-light.png` / `-dark.png` | kit renders, full component (Playground story) — 1232×867 = 57 header + 10×81 rows |
| `kit-data-table-3rows-light.png` / `-dark.png` | kit header + first 3 rows (1232×301) — the side-by-side extent |
| `ref-table-3rows.png` | the reference crop itself (776×307: header band + 3 rows, dividers at y 64/145/226) |
| `data-table-capture.mjs` | the committed capture recipe |
| `runs.awk` | scanline run-collapse probe (copied from verify/cookie-banner) |

Reference crop:
`magick .playwright-cli/captures-v2/invest-stocks/pattern-table-stocks.png -crop 776x307+0+73 +repage ref-table-3rows.png`

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6014 &
node .playwright-cli/verify/data-table/data-table-capture.mjs
# crop (values printed by the recipe; measured at scroll 0):
magick kit-page-light.png -crop 1232x867+24+258 +repage kit-data-table-light.png
magick kit-page-light.png -crop 1232x301+24+258 +repage kit-data-table-3rows-light.png
# (same for dark)
# side-by-sides:
magick ref-table-3rows.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-data-table-3rows-light.png -background white -append data-table-side-by-side-light.png
magick ref-table-3rows.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-data-table-3rows-dark.png -background white -append data-table-side-by-side-dark.png
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter.

CAPTURE MECHANICS LESSON (recorded for the next tall-component recipe):
`elementHandle.screenshot()` on content TALLER than the viewport (this
table: 867px > 800) goes through Playwright's beyond-viewport path, which
leaves the page fractionally scrolled and repaints Storybook's wrapper —
the capture grows a phantom muted band above the table. Verified against
live computed styles in the same session: no element paints it
(header bg transparent over white main, no fixed overlay — elementFromPoint
resolves the header row). The suite's own baselines use `locator('body')`
screenshots; this recipe does the same and crops offline with ImageMagick
(rects measured at scroll 0, where page coords = image coords).

## Probe method

ImageMagick scanline runs: `magick img -crop Wx1+X+Y txt:- | awk -f
runs.awk minlen=N` — vertical scanlines for divider pitch, horizontal
ones for glyph-band extents; text colors via per-region histogram of the
crop (`txt:-` piped through `sort | uniq -c`, most-frequent non-surface
hex = glyph core). The standing rule applies: every load-bearing value
below is MEASURED from pixels; vision reads are cross-checks only (see
Vision check).

## Ground truth — pixel probes: reference vs kit

| Property | Reference (measured) | Kit (measured) | Verdict |
| --- | --- | --- | --- |
| Row pitch | 81px (dividers y 64/145/226/307 in crop) | 81px (dividers y 56/137/218/299) | exact |
| Divider | 1px `#E0E2E4`, full width, on row bottom | 1px `#E0E2E4` — rgba(0,16,36,0.12) over white composites to the same hex | exact |
| Header band | 61px (y 76–137), text ≈15px/500, rgba(0,0,0,0.54) | 57px (16+24+16+1), text 15px/500 `#616871` | close (deviation 1) |
| Name primary | 15/24, rgba(0,0,0,0.8) → `#333333` | `#333333` (text-primary over white) | exact |
| Secondary line | 13/20, rgba(0,0,0,0.54) | 13/20 `#616871` (text-secondary rgba(0,16,36,0.62)) | close (deviation 2) |
| Delta positive | green (site anchor #00A328 not consumed) | `#168821` glyph cores — the 6.1 AA token, exact | by-design (6.1 ruling) |
| Delta negative | red (site anchor #F52222 not consumed) | `#C40B08` — the 6.1 AA token, exact | by-design (6.1 ruling) |
| Delta on BOTH lines | ₽-line and %-line share the color (§E) | same (`#168821` in primary AND secondary bands) | exact |
| Dark deltas | — (capture is light-only) | `#39B54A` / `#F63434` on `#1A1A1A`, ink `#FFFFFF` | first-pass 6.1, verify 8.2 |
| Content column padding | 48px (x 48 → 728) | 16px (row) at 1232px canvas | deviation 3 |

## Intentional deviations (numbered)

1. **Header band 57px vs reference 61px.** Natural padding+line with the
   token scale (`--tk-space-16`×2 + 24px line + 1px border); the reference's
   ≈18.5px vertical padding has no token step. The 81px rhythm is BODY
   rows only — the header override must sit AFTER the `.row` rule in the
   sheet (equal specificity, source order decides).
2. **Secondary/header ink `#616871` vs reference rgba(0,0,0,0.54).** The
   kit paints its own `--tk-color-text-secondary` (rgba(0,16,36,0.62)) —
   the no-new-tokens rule; hue skews navy like the rest of the kit's
   secondary text.
3. **Column padding 16px vs reference 48px.** The reference's 776px
   content column carries page-level gutters; the kit table's own padding
   is the token step space-16 at its 1232px story canvas. Same relative
   anatomy (first column start-aligned, price/change end-aligned at the
   right padding edge).
4. **Delta greens/reds are the 6.1 AA overrides, not the site anchors**
   (`#168821`/`#C40B08`, not #00A328/#F52222) — the closed 6.1 decision;
   sanctioned on surface-base only (deltas are NOT put on tinted panels —
   see the Theming story note).
5. **The keyboard layer is an addition, not a match.** The reference's
   arrows are inert and every row is its own Tab stop (NOTES §D); the kit
   carries the spec's sanctioned APG layer (roving tabindex, clamped
   arrows, Home/End, Space-activates, whole-row §8 ring on
   `:has(:focus-visible)` only). Automated in
   `tests/visual/data-table.spec.ts` (real key presses, both themes).
6. **Dark theme has no reference capture** — the dark renders derive from
   the token-layer remap (6.1 first pass; story 8.2 verifies).

## Vision check

Blocked — model vision is NOT used as evidence in this project (the
standing verify protocol). Every value above comes from ImageMagick pixel
probes; zero vision claims.
