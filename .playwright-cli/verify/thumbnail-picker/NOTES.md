# Story 2.6 — tk-thumbnail-picker provisional baseline evidence (2026-09-22)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru debit-card
form): `.playwright-cli/captures/thumbnail-picker-card-design.png` (536×170 —
the 6-tile «Выберите дизайн карты» grid, first tile checked).

## Files

| File | What |
|---|---|
| `side-by-side-black-light.png` / `-dark.png` | reference grid (top) vs kit render (bottom, «Чёрная» selected), 40px gutter |
| `side-by-side-blue-light.png` / `-dark.png` | same with «Синяя» selected (ring on an inner column) |
| `kit-thumbnail-picker-black-light.png` / `-dark.png` | kit renders (Playground story, host pinned to 324px = 4×72px tiles + 3×12px gaps, «Выберите дизайн карты» + 6 card-design options with `default-value="black"` — the reference's own composition) |
| `kit-thumbnail-picker-blue-light.png` / `-dark.png` | the mirrored render, driven through the CONTROLLED `value="blue"` channel (§4: default-value after connect is ignored — the checkbox/segmented capture precedent) |
| `thumbnail-picker-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter, artwork decode awaited).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6011 &
node .playwright-cli/verify/thumbnail-picker/thumbnail-picker-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ( <reference> -bordercolor '#CCCCCC' -border 1 ) \
#   ( -size 40x1 xc:white ) ( <kit> -bordercolor '#CCCCCC' -border 1 ) \
#   -background white -append
```

## PIXEL PROBE — the ring-treatment ambiguity RESOLVED (spec acceptance criterion)

The spec's flagged judgment call («outer ring vs inset, offset») was resolved
by pixel-probing the capture (ImageMagick `txt:` enumeration + run-length
scanlines — the 2.4/2.5 method; vision color readings on small regions are
unreliable, pixels overrule):

| Aspect | Measured (capture) | Method |
|---|---|---|
| Grid | **4+2**: 4 columns in row 1 (tile spans 0–127 / 137–261 / 274–398 / 411–535), 2 left-aligned in row 2 | white-gap census at y=40 and y=130 |
| Tile size | **~125×79 px** card-aspect artwork (column x=60: artwork y=0..78; row 1: tile pitch 137 → 125px face + 12px gap) | scanline transitions |
| Gaps | **12px both axes** (right gaps 128–136, 262–273, 399–410; row pitch 91 = 79 artwork + 3 ring + 9→ ~12 box gap) | white-gap census |
| Selected ring | **solid #FFDD2D annulus, ~3px (clean bottom rows y=79–81), OUTSIDE the artwork edge, hugging the rounded outline, NO gap/offset, no shadow** | column x=60: artwork ends y=78 → yellow 79–81 → page bg 82; row y=38: artwork ends x≈119 → yellow ≈121–126 → bg |
| Unselected tiles | flat artwork, no border, no ring | row scans |
| Visible labels | none — artwork only (the question text sits above the crop) | whole-capture scan |

**Reading recorded:** the reference's selection marker is an OUTER yellow
annulus (~3px) that hugs the rounded tile outline directly — not an inset
border, not an offset/ghost ring, no elevation.

**Mapping into the frozen architecture:** DESIGN.md freezes «Square tiles
{rounded.md}, selected gets 2px ink border ring» and DESIGN wins over
captures (its own Reference-anchors clause — the segmented-radio
deviation-1 precedent) — so the kit renders the probe's GEOMETRY with
DESIGN's color and width: `box-shadow: 0 0 0 2px var(--tk-color-ink-300)` —
an OUTER ring hugging the radius-md outline, zero offset, no layout shift.
The reference's yellow exists only as its ring; the kit's yellow stays in
the checkbox/segmented indicators. The probe also pins the **12px grid gap**
(the one pixel-exact metric the kit inherits directly: `--tk-space-12`).

## Ground truth — kit renders vs probe targets

Kit measurements (pixel-probed on `kit-thumbnail-picker-black-light.png`,
324×187 = 31px label block (15px text + 8px margin + leading) + 72px tile +
12px gap + 72px tile):

| Aspect | Reference (probe) | Kit (measured) | Verdict |
|---|---|---|---|
| Tile size | ~125×79 card-aspect | **72×72 square** | DEVIATION 1 (DESIGN literal wins) |
| Grid gaps | 12px both axes | 12px both axes (face edge x=71 → ring 72–73 → next face x=84) | exact |
| Wrap shape | 4+2, row 2 left-aligned | 4+2 at the 324px composition, left-aligned | exact |
| Ring geometry | outer annulus hugging the rounded outline, no offset | outer `0 0 0 2px` box-shadow: face y=31..102, ring rows y=29–30/103–104 (2px outside the face edge) | exact geometry |
| Ring color/width | #FFDD2D, ~3px | **ink-300 #333333, 2px** | DEVIATION 2 (DESIGN wins) |
| Tile radius | ~12px (2.0 vision) | radius-md 12px | exact token |
| Per-tile labels | none visible | sr-only (accessible name kept) | exact reading + a11y kept |
| Group label | question above the crop | «Выберите дизайн карты» span above the grid (the segmented field pattern) | composition |

## Vision check notes (zai analyze_image on side-by-side-black-light, 2026-09-22) — triaged against pixels

- **«No visible selection ring in the bottom pane»** — DISPROVEN by pixels:
  the 2px ink-300 annulus is present and measured (ring rows/columns above);
  a 2px dark-on-white ring is below vision's reliable resolution at this
  scale — the same low-salience miss as 2.5's 1px hairline.
- **«A circle on every tile — semantically broken as a selection dot;
  missing on green»** — FALSE POSITIVE: the circles are the generated card
  ARTWORK mark (decorative, part of the data-URI SVG every tile carries);
  selection is the ring + the native radio state, never the artwork.
- **«Vertical gap ~25–35px, larger than horizontal»** — DISPROVEN: both gaps
  are exactly 12px (324 = 4×72 + 3×12; 187 = 31 + 72 + 12 + 72).
- **«No label text in the bottom pane»** — DISPROVEN: the label renders at
  y≈8..16 (#333, body-m) in the 187px-tall render; vision read the top
  pane's label position incorrectly too («below the grid»).
- **«Square tiles misrepresent the card»** — TRUE, deliberate: DEVIATION 1.
- **«Generic swatch artwork»** — TRUE, deliberate: the stories ship token-
  generated placeholder artwork; consumers provide real `thumbnail` URLs.
- Useful confirmations: 4+2 wrap shape matches, row 2 left-aligned, no
  raster artifacts or clipping («clean vector rendering»), gaps read
  uniform horizontally.

## Intentional deviations (documented, not defects)

1. **72px SQUARE tiles, not the reference's ~125×79 card-aspect.**
   DESIGN.md `components.thumbnailPicker` freezes «Square tiles
   {rounded.md}» and EXPERIENCE freezes «tiles 72px, wrap to grid» — DESIGN
   wins over captures (Reference-anchors clause). The side-by-side shows
   the square-vs-card shape difference openly. Override hook:
   `--tk-thumbnail-picker-tile` (default the 72px literal).
2. **2px INK-300 ring, not the reference's ~3px #FFDD2D.** Same clause:
   DESIGN's «2px ink border ring» governs color and width; the probe's
   GEOMETRY (outer, hugging, no offset) is what the kit inherits. Override
   hook: `--tk-thumbnail-picker-ring`.
3. **Grid = `repeat(auto-fill, 72px)` + 12px gaps** — the auto-fill wrap is
   DESIGN's own «wrap to grid»; the 12px gap is probe-exact. The story
   composition pins 324px so the wrap reads 4+2 like the reference; at
   other widths the grid re-wraps by container width (the noted
   explicit-free judgment call — no `columns` prop).
4. **Tile faces carry generated placeholder artwork** (token-colored
   data-URI SVGs — no literal ever appears in source); the reference's
   licensed card renders cannot ship in an open-source kit. Consumers pass
   real `thumbnail` URLs; failures fall back to initials.
5. **Per-tile labels are visually hidden** (probe: the reference tiles show
   artwork only) — the option label stays the radio's accessible name via
   the wrapping label.
6. **Home/End deliberately absent** (EXPERIENCE's letter: arrows only —
   the same noted pick as 2.5). **Vertical moves are position-based** (row/
   column from rendered geometry, clamping to the target row's last tile on
   uneven rows — the WAI nearest-cell convention), because ±columns index
   arithmetic wraps onto the wrong column on the 4+2 (found live by the
   visual spec, unit-pinned).
7. **Enter selects** (spec test-letter «Space/Enter select») with
   form-submit suppressed; Space stays native (selects; no-op when already
   selected).

## Navigation ground truth (live, chromium)

`tests/visual/thumbnail-picker.spec.ts` drives the REAL keyboard on the
Playground's 4+2 render: Down black→green (same column, row 2), Down
green→black (wrap, SAME column — the arithmetic bug this story caught),
Right across row 1 to blue, Right at the row end → green (next row's FIRST
tile), Left mirrors, Up from the top row's col 4 clamps to the bottom row's
last tile (red), Up red→yellow (same column). Plus: FormData form mirror
(`design=black` → click `design=blue` → back; nameless → nothing), ≥44×44
hit areas (72×72 inputs), exact accessible names («Чёрная»/«Синяя» radios,
radiogroup «Выберите дизайн карты»), and the live 404→initials fallback.

## Form participation (live proof)

Same spec file (chromium, real tile-click pipeline): unselected → no entry;
«Чёрная» via defaultValue → `design=black`; click «Синяя» → `design=blue`;
nameless → nothing; exactly one checked radio throughout. The mirror rides
the host's formAssociated + ElementInternals `setFormValue` (the 2.4
amendment). Unit wiring pinned in thumbnail-picker.test.ts.
