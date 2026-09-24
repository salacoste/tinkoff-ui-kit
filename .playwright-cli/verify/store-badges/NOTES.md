# Story 7.3 — tk-store-badges side-by-side evidence (2026-09-24/25)

Reference: T-Bank invest-mobile store-badges row, captured in
`.playwright-cli/captures-v2/invest-mobile/pattern-store-badges-loaded.png`
(three uniform pills on the white page). The kit render is the Playground
story (the three reference labels + placeholder icons) on its white band.

## Files

| File | What |
|---|---|
| `store-badges-side-by-side-light.png` | reference row (top) vs kit row (bottom), 2px `#E0E2E4` hairline — 1280×236 |
| `kit-store-badges-light.png` | kit render cropped from the Playground light baseline (1280×104) |
| `reference-row.png` | the reference row crop (1280×128) |
| `probe-output.txt` | the raw ImageMagick probe transcript |

## Capture recipe (reproduce)

```sh
# baselines: pnpm build && pnpm test:visual (Playground story, light + dark)
magick tests/visual/visual.spec.ts-snapshots/visual-components-storebadges--playground-light-1-chromium.png \
  -crop 1280x104+0+246 +repage kit-store-badges-light.png
magick .playwright-cli/captures-v2/invest-mobile/pattern-store-badges-loaded.png \
  -gravity center -background white -extent 1280x reference-row.png
magick reference-row.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-store-badges-light.png -background white -append store-badges-side-by-side-light.png
```

## Probe method

ImageMagick scanline runs + single-pixel samples; the corner radius was
fitted from the arc equation on three depths (inset(dy) = r −
√(r²−(r−dy)²)): measured insets ≈6 / 1.5 / 1px at dy 8 / 16 / 20 below
the pill top solve to r≈24.

## Ground truth — pixel probes: reference vs kit

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Pill count/shape | 3 uniform pills, 324×80 EXACT (y24–104 at the x=640 gap column; pills x88–412 / 476–800 / 864–1188) | min-width 324 / min-height 80, uniform ×3 | match exact |
| Pill fill | `#F6F7F8` | surface-muted `#F5F5F6` | deviation 1 (token, Δ≈1/channel) |
| Pill radius | r≈24 (three-depth arc fit) | radius-xl 24 | match (corrected this round — first pass had pinned radius-lg 16 from a loose read; the arc fit trues it) |
| Pill gap | 64 EXACT (x413–475 between pill edges) | `--tk-space-64` | match exact |
| Label | `#313132`, ~15px/600, LEFT ~12px in | text-primary `#333333`, body-m-bold 15/500, left | match (weight deviation 2) |
| Icon | squircle ~48px RIGHT ~16px from the pill edge (the reference's own INVERTED layout — official store badges carry the icon left) | 48×48 box, `margin-inline-start:auto` pins it right; placeholder art in stories | match (layout); art = placeholder (deviation 3) |
| Link | (capture static) | whole-pill anchor, `target=_blank rel=noopener noreferrer`, native focus ring (§8) | kit surface (spec contract) |
| Motion | static row | zero transition/animation — hover fill step INSTANT (never-list) | match (recorded) |

Kit row scan (Playground light baseline, y298 midline): run sequence
W24 · P281+W6+P37 = 324 pill · W64 gap · … ×3 · W156 — pill width and
gap are pixel-EXACT against the reference's own runs.

## Vision check (analyze_image, 2026-09-25)

Gross-structure pass on the light side-by-side: same three pills in the
same order, icons right in both, no truncation, no broken layout. The
only flagged difference is icon ARTWORK (brand glyphs vs the neutral
placeholder) — out of scope by the never-list («no third-party brand
ART in the repo»).

## Intentional deviations (documented, not defects)

1. **Pill fill `#F6F7F8` → surface-muted `#F5F5F6`** — Δ≈1/channel, the
   honest-near NEUTRAL map; the spec's surface-field guess is
   blue-tinted and measurably farther.
2. **Label weight 600 → body-m-bold 500** — the ramp has no 600 step.
3. **Icons are placeholder art in stories** — the kit ships ZERO
   third-party brand art (`iconSrc` is consumer-supplied; labels only,
   nominative). The placeholder is a neutral gray download glyph
   (named-color SVG data URI, no brand marks).
4. **Zero motion** — the spec never-list outranks the generic State-
   Pattern hover duration; hover is an instant fill step
   (unit-pinned: no transition/animation strings in the sheet).
5. **radius correction (this round)** — the first pass pinned
   radius-lg 16 off a loose read; the three-depth arc fit measures
   r≈24 → radius-xl. Sheet, header docs, and the unit pin all trued.
