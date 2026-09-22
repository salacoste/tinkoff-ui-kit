# Story 2.4 — tk-checkbox provisional baseline evidence (2026-09-22)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side sources (Story 2.0 + the 2.4 gap close,
tbank.ru debit-card form): `.playwright-cli/captures/checkbox-consent.png`
(536×39, unchecked) and `checkbox-consent-checked.png` (536×38, checked —
captured this story per INDEX.md; the profile's stale service worker had to
be cleared with `delete-data` first, then a trusted `check` on the native
input).

## Files

| File | What |
|---|---|
| `side-by-side-unchecked-light.png` / `side-by-side-checked-light.png` | reference consent line (top) vs kit render (bottom), 40px gutter |
| `kit-checkbox-unchecked/checked/mixed-light.png` / `-dark.png` | kit renders (Playground story, host pinned to 536px = the reference line width, slotted consent copy + inline underlined link — the like-for-like composition) |
| `checkbox-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6011 &
node .playwright-cli/verify/checkbox/checkbox-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ( <reference> -bordercolor '#CCCCCC' -border 1 ) \
#   ( -size 40x1 xc:white ) ( <kit> -bordercolor '#CCCCCC' -border 1 ) \
#   -background white -append
```

The script pins the Playground `main tk-checkbox` to 536px, slots the exact
reference consent copy with the inline underlined anchor («выгодные
предложения» — generated-evidence inline styles on the anchor, the same
inline-styling class the overlay controller uses), awaits `updateComplete` +
`document.fonts.ready`, and screenshots the element per state. The CHECKED
render drives the CONTROLLED channel (`checked = true`) — `defaultChecked`
after connect is ignored per the frozen §4 initial-value semantics.

## Ground truth — pixel probes vs reference (ImageMagick)

Vision passes flagged candidates; every load-bearing color below is a
measured pixel value, not an estimate (the select precedent: vision color
readings on small regions are unreliable — it misread the reference's ink
check as "white" and the kit fill as "lighter"; pixels overrule).

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Checked fill | `#FFDD2D` (255,221,45) | `#FFDD2D` (255,221,45) | **pixel-exact token match** (yellow-100) |
| Check glyph | `#333333` (51,51,51) | `#333333` (51,51,51) | **pixel-exact token match** (ink-300) |
| Unchecked fill | white + 1px ~#D9D9D9–#E0E0E0 border | surface-base (#FFFFFF) + border-default (#E7E8EA) hairline | exact token family |
| Box | 16×16px (both tight readings agree) | 20×20px | DEVIATION 2 (DESIGN 20px wins) |
| Radius | ~4px | radius-xs 4px | exact |
| Label text | neutral ~#757575, ~13px, 2 lines | text-secondary `#616871`, body-s 13px | DEVIATION 1 (AA token step) |
| Inline link | same ink + continuous underline | inherit + underline (story composition) | exact |
| Box→text gap | ~10px | space-8 (8px) | nearest step (8/12 tie at 10, chose 8) |
| Line wrap point | after «…выгодные» | identical wrap at 536px | exact (same font metrics family) |

Dark theme (authored layer — the site is light-only): surface-base #1A1A1A
unchecked box + #FFFFFF24 hairline; checked/mixed stay yellow-100 + ink-300
(theme-invariant); text #FFFFFFB3. Mixed = yellow fill + ink minus (reference
convention per the spec; no site capture exists — the form has no parent
checkbox).

## Vision check passes (zai analyze_image, 2026-09-22)

- Unchecked side-by-side: structure/wrap/gap/underline MATCHED; the one flag
  (kit text "darker") is deviation 1 below; an alleged "faint checkmark in
  the unchecked box" was disproven by pixel probe (0 dark pixels in the box
  interior — border AA misread).
- Checked side-by-side: high fidelity; the flagged "lighter fill" and
  "fainter border" disproven by pixel probe (both fills/glyphs
  pixel-identical; the border intentionally collapses into the fill on
  checked/mixed).
- Dark mixed render: yellow+dash present, text readable; "uneven text
  brightness" = the underlined anchor reading heavier (same inherited color);
  indistinct border on yellow = by design.

## Intentional deviations (documented, not defects)

1. **Label color text-secondary (#616871), not the reference's ~#757575.**
   Pixel probe at the gap close CORRECTED the 2.0 vision note (#333 was
   wrong): the reference consent text is a neutral ~#757575 the token sheet
   has no counterpart for. Nearest role steps: text-muted #959BA4 measures
   2.9:1 — fails AA for 13px text; text-secondary #616871 passes (5.635:1,
   the pinned contrast-table value) and
   is the documented AA-override move (tk-select placeholder precedent). The
   `--tk-checkbox-text` hook lets consumers restore any exact value.
2. **Box 20px, not the reference's measured 16px.** DESIGN.md freezes 20px
   («20px box, radius-xs, ink-300 check on yellow-100»); the 2.0 pack flagged
   16–20 as a range and the checked-state capture landed on 16. The DESIGN
   value wins per the spec's Always clause; the 20px box also enlarges the
   touch target toward the 44px floor. The 16 vs 20 delta is the one visible
   size difference in the side-by-sides. (The ink-300-on-yellow-100 pairing
   itself measures 9.405:1 — the pinned table value.)
3. **Interactive surface 44px minimum in BOTH dimensions (reference row
   ≈39px tall, flush-left box).** The EXPERIENCE a11y floor demands ≥44px
   effective targets; the whole label is the interactive surface, so 12px
   all-around padding lifts the 20px box to 44px in BOTH axes — inline
   included, so a LABEL-LESS (bare-box) checkbox keeps a ≥44px-wide hit area
   instead of the bare 20px .control (geometry pinned in
   tests/visual/checkbox.spec.ts). Costs ~5px of vertical density and a 12px
   inline inset on the box vs the reference's flush-left consent line.
4. **Disabled = aria-disabled + focusable (not native disabled).** The
   button-pilot pattern (native disabled would drop the control from the tab
   order); the change guard reverts any keyboard flip, so nothing emits or
   commits while disabled.
5. **Mixed glyph = ink minus on yellow** (reference convention per the spec —
   no direct capture exists; the same yellow-keeps-ink pairing as checked).

## Env-split note (form participation — spec technique AMENDED)

Two spec assumptions failed live probing (2026-09-22):
1. happy-dom neither enumerates shadow-root controls in FormData nor ships
   ElementInternals (the «happy-dom supports it» note does not hold).
2. CHROMIUM does not submit the shadow input either: the form-owner walk
   stops at the shadow root (`form.elements` stays empty with the input
   checked — probed on the built story). The spec's «the browser submits the
   shadow input naturally» premise is the exact gap `formAssociated` exists
   to fill.

The component therefore declares `formAssociated` and mirrors the entry via
`ElementInternals.setFormValue` (value or the native `on` default when
checked, no entry when unchecked; the reflected host `name` attribute
supplies the entry name; `formResetCallback` restores `defaultChecked`).
Feature-guarded for environments without internals. The live proof stays in
`tests/visual/checkbox.spec.ts` (chromium, real label-click pipeline:
unchecked → nothing; checked → `consent=granted`; valueless → native `on`;
nameless → nothing); the wiring is unit-pinned in `checkbox.test.ts`.
