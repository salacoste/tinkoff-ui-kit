# Story 7.3 — tk-stepper side-by-side evidence (2026-09-24/25)

Reference: T-Bank business «open account» steps block, captured in
`.playwright-cli/captures-v2/business/pattern-steps-open-account.png`
(the block with heading) and `pattern-steps-open-account-detail.png`
(the cards row, 1280 wide). The kit render is the Playground story
(reference steps, heading set) on the tint-cream story canvas.

## Files

| File | What |
|---|---|
| `stepper-side-by-side-light.png` | reference block (top) vs kit render (bottom), 2px `#E0E2E4` hairline — 1280×865 |
| `kit-stepper-light.png` | kit render cropped from the Playground light baseline (1280×341) |
| `reference-block.png` | the reference block crop (1040×520) |
| `probe-output.txt` | the raw ImageMagick probe transcript (scanlines + single pixels) |
| `probe-ref.sh` | the probe commands, re-runnable |

## Capture recipe (reproduce)

```sh
# baselines: pnpm build && pnpm test:visual (Playground story, light + dark)
magick tests/visual/visual.spec.ts-snapshots/visual-components-stepper--playground-light-1-chromium.png \
  -crop 1280x341+0+245 +repage kit-stepper-light.png
magick .playwright-cli/captures-v2/business/pattern-steps-open-account.png \
  -gravity center -background white -extent 1280x reference-block.png
magick reference-block.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-stepper-light.png -background white -append stepper-side-by-side-light.png
```

## Probe method

ImageMagick scanline runs (`magick img -crop Wx1+X+Y txt:-`, compressed
color runs) + single-pixel samples; geometry claims below are row/column
bounds of measured runs, never eyeballed.

## Ground truth — pixel probes: reference vs kit

Reference row facts (1280 capture, content 1280, cards 336 ×3, gaps 48):

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Section surface | cream `#F1EEE8` | story canvas tint-cream | match (token family) |
| Card fill / size | white, 336×136 ×3 (y52–188) | surface-base; 379px at 1232px story content | deviation 2 (responsive mold) |
| Card radius | ≈24 | radius-xl 24 | match |
| Card gap | 48 EXACT (runs 336/48/336/48/336) | `--tk-space-48` | match exact |
| Number badge | 56×56 `#8D6040` brown, center EXACTLY on card top edge (spans y24–80, card top y52) | 56×56, `translate(-50%,-50%)` at `top:0;left:50%` — ≈8381 fill px ≈ 3×(56×56) minus numerals | geometry match exact; fill deviation 1 (brown flag) |
| Badge radius | probe-fit ≈18 | radius-lg 16 | deviation 3 (Δ2, token step) |
| Numeral | white bold ≈20px | heading-6 slot, text-primary on cream-raised | deviation 1 (inverse pairing) + Δweight 500 vs 700 |
| Title line | y117–125, ink strokes #454545-family (AA band at one column; core consistent with #333) | body-l bold, text-primary #333333 | match |
| Text line | y145–150, core #333333 (p at y148) | body-l 400, text-primary | match |
| Badge→copy gap | badge bottom y80 → title top y117 = 37 | `--tk-space-40` rhythm (68px card top padding composite) | match (token step) |
| Heading | ~44px/700 centered | heading-2 44/700 | match exact |
| Heading→cards | — (block capture) | ≈96px = space-64 + space-32 composite | kit rhythm (recorded) |

## Vision check (analyze_image, 2026-09-25)

Gross-structure pass on the light side-by-side: card count 3, badge
placement overlapping card tops, centered copy — structurally correct.
Two flags raised, both accounted:

- «Missing subtitle»: the reference block carries a page subheading
  under the h2. The FROZEN API (`TkStepperStep[]`, `heading?`, unnamed
  CTA slot) has no subtitle field — page context, out of contract.
  Recorded, not a defect.
- «Missing CTA buttons»: the reference page shows a «Открыть счет /
  Открыть бизнес» toggle under the cards. The spec matrix's CTA row is
  the OPTIONAL unnamed slot (empty = reference-plain); the Variants
  story demonstrates the filled slot. Default Playground = plain, per
  the frozen matrix.

## Intentional deviations (documented, not defects)

1. **Badge brown `#8D6040` → tint-cream-raised `#E9E0D1` + text-primary
   numeral.** FLAGGED (flag-don't-invent): no brown exists anywhere in
   the token layer; the warm family tops out ~3× lighter than the
   probed brown. The badge ships on the nearest warm-family surface
   token with the layer's AA-sanctioned pairing (9.655:1; white numerals
   on cream-raised would be ~1.4:1). A brown token decision belongs to
   the token layer — `--tk-stepper-badge-fill`/`--tk-stepper-badge-number`
   accept it the day it exists.
2. **Card width 336 fixed → `repeat(auto-fit, minmax(240px, 1fr))`.**
   The v1 card-grid mold: equal-height stretch cards, 3→2→1 collapse.
   At the story's 1232px content this measures 379px per card.
3. **Badge radius probe ≈18 → radius-lg 16** (Δ2, nearest token step).
4. **Numeral weight 700 → heading-6 500** (the ramp has no 700 at 20px);
   title 600-family → body-l-bold 500 likewise (no 600 step exists).
5. **Zero motion** (spec never-list) — the reference block is static;
   the sheet pins zero transition/animation (unit-pinned).
