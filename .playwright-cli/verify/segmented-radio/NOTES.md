# Story 2.5 — tk-segmented-radio provisional baseline evidence (2026-09-22)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru debit-card
form): `.playwright-cli/captures/segmented-radio-citizenship.png` (536×113 —
question label + the Да/Нет pair, «Да» checked).

## Files

| File | What |
|---|---|
| `side-by-side-yes-light.png` / `-dark.png` | reference group (top) vs kit render (bottom, «Да» selected), 40px gutter |
| `side-by-side-no-light.png` / `-dark.png` | same with «Нет» selected (the mirrored state) |
| `kit-segmented-radio-yes-light.png` / `-dark.png` | kit renders (Playground story, host pinned to 536px = the reference crop width, «Гражданство РФ?» + Да/Нет with `default-value="yes"` — the reference's own composition) |
| `kit-segmented-radio-no-light.png` / `-dark.png` | the mirrored render, driven through the CONTROLLED `value="no"` channel (§4: default-value after connect is ignored — the checkbox capture precedent) |
| `segmented-radio-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6011 &
node .playwright-cli/verify/segmented-radio/segmented-radio-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ( <reference> -bordercolor '#CCCCCC' -border 1 ) \
#   ( -size 40x1 xc:white ) ( <kit> -bordercolor '#CCCCCC' -border 1 ) \
#   -background white -append
```

## PIXEL PROBE — the selected-fill ambiguity RESOLVED (spec acceptance criterion)

The spec's flagged judgment call («gray fill vs white+border», «surface-base/
white + shadow inside a tinted track, or solid accent») was resolved by
pixel-probing the capture (ImageMagick `txt:` enumeration, the 2.4 method —
vision color readings on small regions are unreliable; pixels overrule):

| Aspect | Measured (capture) | Method |
|---|---|---|
| Structure | TWO SEPARATE stadium pills, 258px each (crop-limited; equal halves of 536), 20px apart | non-white column gaps |
| Pill fill | **WHITE #FFFFFF** — rows inside the border ring are pure white (e.g. y=60, y=109 across 150 sampled columns) | exact-pixel census |
| Pill border | **1px #E1E3E4, IDENTICAL on both pills** (1096 px ≈ the two pills' full perimeter rings; every edge row/column reads exactly #E1E3E4) | per-edge census |
| Selected «Да» indicator | **yellow #FFDD2D dot Ø24** (bbox 218–241 × 72–95, 300 exact px) with an **ink #333 center dot Ø12** (bbox 224–235 × 78–89; #5A5432/#A28F30/#E3C62E blends = AA between the two) | bbox + blend analysis |
| Unselected «Нет» indicator | **flat #EEF1F5 circle Ø24** (bbox 496–519 × 72–95, 424 px), no border, no center dot | bbox + census |
| Insets | dot 16px from the pill's right edge; text ~16px left inset; both vertically centered ((56−24)/2 = 16) | bbox math |
| Pill height | **56px outer** (border rows y=56..111) — the 2.0 vision reading «44–48 ±6» corrected by pixels | border row scan |
| Text | ink #333, cap-height 11px ⇒ ~15px font | bbox |
| Question label | ink #333, ~15px, 24px above the pills (the page's own spacing rhythm) | bbox |

**Reading recorded:** the reference's selected surface is WHITE + a 1px
#E1E3E4 hairline — not a gray fill, not an accent, no shadow anywhere. Yellow
exists ONLY in the selected dot (300 px). The 2.0 vision note's «gray fill
~#F0F2F5» was the track-adjacent misread; the probe pins white.

**Mapping into the frozen architecture:** DESIGN.md freezes «Pill track,
{rounded.full}; selected segment solid fill + dot indicator» and DESIGN wins
over captures (its own Reference-anchors clause) — so the kit renders ONE
continuous track, and the probe's reading feeds the surfaces: tinted track
(surface-field #ECF1F7 — the field language; the reference has no track, its
tint exists only as the ghost-circle color) + selected segment = surface-base
WHITE solid fill with an inset border-default (#E7E8EA) hairline (the nearest
token to #E1E3E4) + the probe-exact yellow Ø24 / ink Ø12 dot. «Selected
segment solid fill + dot» (DESIGN) is thereby satisfied with the reference's
own colors. DESIGN.md correction stays deferred to 3.6/5.6 per the spec.

## Ground truth — kit renders vs probe targets

Kit measurements (pixel-probed on `kit-segmented-radio-yes-light.png`,
536×88 = 24px label block + 8px margin + 56px track):

| Aspect | Reference (probe) | Kit (measured) | Verdict |
|---|---|---|---|
| Track/pill height | 56px | 56px (rows 31–86) | exact |
| Selected segment | white fill + hairline | surface-base #FFFFFF + inset #E7E8EA hairline (bbox 5–264 × 35–82 ⇒ 260×48 inside the 4px track inset) | exact token family (#E1E3E4→#E7E8EA nearest step) |
| Yellow dot | Ø24, #FFDD2D | 24×24 CSS, exact-#FFDD2D core Ø22 (AA edges), center y=58.5 = segment center | exact |
| Center dot | ink Ø12 | inset 6px of Ø24 ⇒ Ø12, #333333 | exact |
| Dot inset | 16px right, centered | 16px right (hairline edge 264 − dot edge 248), centered | exact |
| Ghost circle | #EEF1F5 Ø24 on white | surface-base Ø24 on surface-field track | DEVIATION 3 (re-based, see below) |
| Text | ink #333 ~15px | text-primary #333, body-m 15px | exact token |
| Track fill | (none — two pills) | surface-field #ECF1F7 | DEVIATION 1 (frozen track decision) |
| Gap between options | 20px between pills | 4px tinted gutter + 4px gap class between equal halves | DEVIATION 1 corollary |

## Vision check notes (zai analyze_image, 2026-09-22) — triaged against pixels

- **«White thumb, no border»** — DISPROVEN by pixels: the inset hairline is
  present (444 exact #E7E8EA px, bbox measured above); a 1px #E7E8EA line on
  white is below vision's reliable resolution — the select's known near-white
  ambiguity, same disposition.
- **«Unequal segment widths» (~250 vs ~270)** — DISPROVEN: `flex: 1 1 0`
  renders equal halves; the right segment's SURFACE is transparent, so vision
  read its bounds from the ghost circle instead of the segment box.
- **«Control height taller than the reference's ~36–38px»** — DISPROVEN: the
  probe pins the reference pills at 56px; kit track = 56px. (Vision's height
  estimate on the top pane was off by the same margin as its 2.0 reading.)
- **«Stray hairline at the very bottom of the screenshot»** — the magick
  `-border 1` composition border, not the component (the raw kit render is
  exactly 536×88 with nothing below the track).
- **«Unselected dot white vs reference gray»** — TRUE, deliberate: DEVIATION 3.
- **«Label larger/heavier»** — TRUE, deliberate: the Input label pattern
  (body-m/500) per the spec's «mirroring Input's always-visible label
  pattern»; the reference's ~15px medium label is the page's question-text
  style, not the kit's field style.
- **«Track vs two separate buttons»** — TRUE, deliberate: DEVIATION 1 (the
  frozen DESIGN decision above).

Final pass on the shipped code: `side-by-side-yes-light.png` — question label
+ 536px tinted stadium track, white selected segment on the left half with
the yellow-Ø24/ink-Ø12 dot right-aligned, ghost circle on the right half,
text insets 16px, no clipping, no stray artifacts.

## Intentional deviations (documented, not defects)

1. **ONE pill track, not two separate pills.** The reference control is two
   independent white pills 20px apart; DESIGN.md freezes «Pill track,
   {rounded.full}» and DESIGN wins over captures. The probe's white+hairline
   reading is preserved on the selected SEGMENT surface; the unselected
   segment is transparent text on the tinted track (the spec's own «unselected
   segments = transparent text» clause). The 20px inter-pill gap collapses to
   the segmented-control gutter (4px tint + 4px gap).
2. **Track tint surface-field (#ECF1F7).** The reference has no track; the
   spec's candidate reading «surface-base/white + shadow inside a tinted
   track» is the one implemented (the probe ruled out the «solid accent»
   alternative — yellow exists only in the dot). The tint is the kit's field
   language, keeping the white selected segment readable as the solid fill.
   Override hook: `--tk-segmented-radio-fill` (renamed from
   `--tk-segmented-radio-track-fill` at review — CONVENTIONS §6
   same-slot-same-role: the field-surface role is `fill` everywhere,
   mirroring `--tk-input-fill`/`--tk-select-fill`).
3. **Ghost circle surface-base, not the reference's #EEF1F5.** #EEF1F5 is the
   surface-field family — on a surface-field TRACK it would be invisible
   (Δ2). The surface-base ghost keeps the reference's «empty radio well»
   anatomy, doubles as the theme-adaptive well in dark (#1A1A1A on the
   translucent dark track), and stays in the selected-segment fill family.
   Override hook: `--tk-segmented-radio-dot-idle`.
4. **Segment text body-m (15px).** The probe's cap-height reading (~15px) is
   within the step; body-l (17px, the Input/Select field text) would overshoot
   the measured range. The label above uses the Input label pattern (see the
   vision triage).
5. **Home/End deliberately absent** (EXPERIENCE's Interaction Primitives name
   arrows for SegmentedRadio; Home/End is the Tabs row) — the spec's noted
   pick. Arrow wrap: YES (the other noted pick).
6. **Enter selects** (spec test-letter «Space/Enter select») with form-submit
   suppressed; Space stays native (selects; no-op when already selected —
   the native radio fires no change then).
7. **Unselected hover = surface-muted, not a scale step (review fix).** The
   first pass used `--tk-color-lightblue-200` — a LIGHT-layer-only token
   (dark keeps #E4EBF3), painting white text on a light chip ≈1.2:1 in the
   dark theme (fails AA; found live at review). AD-3 forbids a component
   theme branch and a DESIGN.md token edit is out of scope here, so the hover
   slot consumes `--tk-color-surface-muted` — the surface axis's one-step
   neighbor of surface-field in BOTH layers (light #F5F5F6 over the #ECF1F7
   track; dark #222222 over the ≈#2E2E2E-effective translucent field), AA in
   both themes (#333 on #F5F5F6 = 12.6:1; #FFF on #222222 = 15.7:1).
   Resting-state pixels are unchanged (hover-only slot).

## Review fixes recorded (2.5 review pass, 2026-09-22)

- **Hover token** — deviation 7 above.
- **`--tk-segmented-radio-fill` rename** — deviation 2 above.
- **Disabled-group arrow ownership** — `#handleKeydown` now preventDefaults
  every handled key (arrows, Enter) BEFORE the disabled exit: previously the
  early return left the key unprevented and Chromium's native radio-arrow
  navigation ROVED focus inside a disabled group (verified live at review).
  Live-asserted in tests/visual/segmented-radio.spec.ts (ArrowRight → focus
  stays put) and unit-pinned (preventDefault + inert).
- **Group label = SPAN, not a clickable `<label for>`** — the review flagged
  the orphan clickable-styled label; the association route (Input mold's
  label[for] on the tab-stop radio) was implemented first and then REJECTED
  by a live probe: Chromium CONCATENATES the associated labels onto the
  tab-stop option's accessible name — «Гражданство РФ? Да» while «Нет»
  stays bare, an asymmetric rename that follows the roving tab stop (the
  same probe that powers getByRole). The span route shipped instead: the
  group is named via aria-labelledby, each option by its wrapping segment
  label, and the pointer affordance is removed (nothing to activate).
  Live-asserted in tests/visual/segmented-radio.spec.ts: radios stay
  findable by exactly «Да»/«Нет», the radiogroup by «Гражданство РФ?»;
  unit-pinned as a SPAN with no `for`.

## Form participation (live proof)

`tests/visual/segmented-radio.spec.ts` (chromium, real label-click pipeline):
unselected → no entry; «Да» via defaultValue → `citizenship=yes`; click «Нет»
→ `citizenship=no`; nameless → nothing; exactly one checked radio throughout.
The mirror rides the host's formAssociated + ElementInternals `setFormValue`
(the 2.4 amendment — the shadow radios never submit; the form-owner walk
stops at the shadow root). Unit wiring pinned in segmented-radio.test.ts.
