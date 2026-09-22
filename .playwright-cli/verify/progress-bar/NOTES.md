# Story 2.7 — tk-progress-bar provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru debit-card
form): `.playwright-cli/captures/progress-bar-fill.png` (568×40,
«Уже заполнено 5%»).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference strip (top) vs kit render (bottom), 40px white gutter |
| `kit-progress-bar-light.png` / `-dark.png` | kit renders (Playground story, host pinned to 568px = the reference line width, label «Уже заполнено», value 5 — the like-for-like composition) |
| `kit-progress-bar-indeterminate-light.png` / `-dark.png` | indeterminate renders for the kit's own record (no reference capture exists — the site form is determinate); static 33% fill under the pinned reduced-motion env |
| `progress-bar-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/progress-bar/progress-bar-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick \( ../../captures/progress-bar-fill.png \) \
#   \( -size 568x40 xc:white \) \( kit-progress-bar-<theme>.png \) \
#   -background white -append side-by-side-<theme>.png
```

## Ground truth — pixel probes vs reference (ImageMagick)

The 2.4 lesson applied: the 4px bar is far too small a region for vision
color readings — every load-bearing color below is a measured pixel value.

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Fill | `#428BF9` (66,139,249) | `#1771E6` (23,113,230) — blue-100 token exact | **DEVIATION 1** (DESIGN token wins) |
| Track | `#F0F1F2` (240,241,242) | `#E7E8EA` (231,232,234) — gray-200 token exact | **DEVIATION 2** (DESIGN token wins) |
| Track height | ≥12px (capture row 28 to the 39 crop edge — cut off; the 2.0 vision note's «~4px» was wrong) | 4px (rows 28–31) | **DEVIATION 3** (DESIGN 4px literal wins) |
| Fill width | x 16→43 ≈ 28px = 5% of 568 | x 1→27 = 28px = 5% | **pixel-exact** |
| Fill shape | rounded pill ends | rounded pill ends (radius-full at 4px) | exact |
| Label «Уже заполнено» | `#757575` (117,117,117), ~13px | text-secondary `#616871`, body-s 13px | **DEVIATION 4** (AA token step) |
| Value «5%» | `#333333`, semibold | text-primary `#333333`, body-s-bold | **pixel-exact** |
| Text→bar gap | ~8px | space-8 (8px) | exact (2.0 note's 8–10px range) |
| Track horizontal span | x≈8→552 (inset inside the crop) | 0→568 flush | crop padding, not a component delta |

Dark theme (authored layer — the site is light-only): surface #1A1A1A,
track/fill **unchanged** (#E7E8EA / #1771E6 — gray-200/blue-100 carry no
dark remaps in the token sheet; per the spec NO new tokens this story), text
pair re-themes (#FFFFFFB3 label / #FFFFFF value). **Token-layer observation
for Story 5.4:** the light-valued track on #1A1A1A is a high-contrast
light-gray bar — visible and AA-irrelevant (decorative geometry), but a
tonal remap (e.g. a dark-track step) would sit better on dark canvases.

## Vision check passes (zai analyze_image, 2026-09-23)

- First pass ran against a BROKEN composition (an ImageMagick quoting bug
  flooded the side-by-side with the border color) and confidently described
  garbage — rebuilt and re-verified by pixels before the pass below. Same
  lesson as 2.4: verify the artifact's pixels before trusting a vision read.
- Corrected side-by-side (light): content, fill fraction (~5%), pill shape,
  colors «essentially matched»; fill flagged «slightly darker/more
  saturated» = deviation 1 (pixel-proven); «bar inset ~15–20px» = the
  reference crop's surrounding whitespace (composition, not component);
  «gap tighter» = 8px kit inside the reference's 8–10px range; «top track
  marginally thicker» = deviation 3 (DESIGN 4px wins).

## Intentional deviations (documented, not defects)

1. **Fill blue-100 `#1771E6`, not the reference's measured `#428BF9`.**
   DESIGN.md freezes «fill blue-100» and DESIGN wins over captures; the
   reference's lighter blue has no scale step (blue-100 is the closest).
   The `--tk-progress-bar-fill` hook lets consumers restore any exact value.
2. **Track gray-200 `#E7E8EA`, not the reference's `#F0F1F2`.** Same ruling;
   Δ is 8 RGB points — vision called the pair «indistinguishable».
3. **Track 4px, not the reference's ≥12px.** DESIGN.md's literal «4px track»
   (the capture is element-cropped mid-bar, so the reference's true height
   is unknown-but-taller; the 2.0 pack's «~4px» vision reading does not
   survive pixels). The one clearly visible size difference in the
   side-by-sides. Hook: none (height is structural per DESIGN).
4. **Label color text-secondary (`#616871`), not the reference's `#757575`.**
   The tk-checkbox/tk-select AA-override precedent: the reference neutral
   gray has no token; text-muted `#959BA4` fails AA at 13px (2.9:1),
   text-secondary passes (5.635:1). The `--tk-progress-bar-text` hook
   restores any exact value.
5. **Percent text is computed, not projected** — the unslotted `value` cell
   falls back to the rounded integer percent («5%»), mirroring the
   reference's always-composed header; consumers replace it via the
   `value` slot.

## Reduction-motion note

The capture env pins reducedMotion: 'reduce', so every indeterminate render
above shows the SPEC'd static fallback (33% fill, animation: none) — the
same state the visual suite's pinned env baselines. The animated sweep
(duration-slow, linear, translateX −100%→300%) is exercised by un-pinning
reduce in a live storybook; its reduced-motion path is unit-pinned
(structural: the sheet ships the media rule; the indeterminate width comes
from CSS, never inline).
