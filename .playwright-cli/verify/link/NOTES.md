# Story 3.1 — tk-link provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru article tile):
`.playwright-cli/captures/text-link-read-more.png` (48×25, «Читать»).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference strip (top) vs kit render (bottom), 40px white gutter |
| `kit-link-light.png` / `kit-link-dark.png` | kit renders (Playground story, inline variant, label «Читать» — the like-for-like composition) |
| `kit-link-hover-light.png` | the hover affordance for the kit's own record (reference capture is rest-state) |
| `kit-link-legal-light.png` / `kit-link-legal-dark.png` | legal variant renders (footer fine print; no reference capture exists) |
| `link-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/link/link-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ../captures/text-link-read-more.png \
#   \( -size 48x40 xc:white \) \( kit-link-<theme>.png \) \
#   -background white -append side-by-side-<theme>.png
```

## Ground truth — pixel probes vs reference (ImageMagick)

The 2.4 lesson applied: every load-bearing color below is a measured pixel
value; vision reads were cross-checked against pixels (three misreads caught —
see the vision section).

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Link color | `#126DF7` (18,109,247) — dominant glyph pixel | `#1771E6` (23,113,230) — blue-100 via `--tk-color-link`, token exact | **DEVIATION 1** (DESIGN token wins) |
| Rest underline | **NONE** — rows below the glyph band (y 17–24) contain 0 blue pixels | **NONE** — bottom rows of `kit-link-light.png`: 0 blue pixels | **probe resolved: no underline at rest** (matches DESIGN «underline on hover») |
| Hover underline | — (capture is rest-state) | 28 solid-blue px in the bottom rows of `kit-link-hover-light.png` | affordance present (kit's own record) |
| Glyph height | 8 strong rows (y 9–16) | 8 strong rows (y 6–13, +1 descender row) | **pixel-equal** — the vision pass claimed the kit text «1.3–1.5× larger»; rows prove equal |
| Background | `#F6F7F8` (card tile) | `#FFFFFF` (surface-base story panel) | composition, not component |
| Dark link | — (site is light-only) | `#66A3FF` on `#1A1A1A` | token-layer dark pair, 6.836:1 (contrast.test pin) |

## Vision check passes (zai analyze_image, 2026-09-23)

- **light side-by-side**: composition, word, no rest underline in either
  strip — confirmed; «kit blue darker/more saturated» = deviation 1
  (pixel-proven); «kit text larger/bolder» — **REFUTED by row probe**
  (equal 8-row glyph bands; DaytonaSans' 400 cut reads heavier than the
  site's face at equal size).
- **dark side-by-side**: claimed the dark render «reuses the light blue —
  token missing» — **REFUTED by pixels**: `kit-link-dark.png` measures
  `#66A3FF` on `#1A1A1A`, the token layer's dark link pair (6.836:1 AA).
- Standing lesson (2.4/2.7): verify the artifact's pixels before trusting a
  vision read — three directional misreads this story, all corrected above.

## Intentional deviations (documented, not defects)

1. **Link blue-100 `#1771E6`, not the reference's measured `#126DF7`.**
   DESIGN.md freezes `components.text-link.color: {colors.blue-100}` and
   DESIGN wins over captures — the same ruling as progress-bar's fill
   (reference `#428BF9` → blue-100). The consumer-level escape hatch is the
   semantic token itself (`--tk-color-link` override).
2. **Hover = underline only; DESIGN.md's `hover-color: blue-200` is not
   consumed.** The spec's color ruling: the link ALWAYS consumes
   `--tk-color-link` (blue-100 light / #66A3FF dark). A hover color step has
   no dark counterpart (blue-200 carries no dark remap; NO new tokens this
   story), so the underline is the single hover/focus affordance in both
   themes — visible in light AND dark, unlike a light-only color step.
   **RATIFIED at the 3.1/3.2 review** — CONVENTIONS §9 exception log row 1;
   the underline now FADES on the 150ms motion token
   (`text-decoration-color` transparent → currentColor, duration-fast), so
   EXPERIENCE State Patterns' motion letter holds while the color letter
   stays un-consumed.
3. **Standalone 44×44 target floor (structural).** The reference's standalone
   links are plain text lines; the kit pads the interactive target to the
   EXPERIENCE a11y floor with a transparent box (the button-compact move) —
   min-height 44px on the block axis AND space-12 inline padding (added at
   review: a short label «Далее» fell under 44px WIDE), nothing paints, only
   the hit target grows. Inline links inside sentences keep their line-box
   targets (reference behavior; documented deviation).
4. **Focus indicator = the underline, not the 2px ring.** EXPERIENCE.md's
   TextLink row names «keyboard focus visible underline»; the unified ring
   (CONVENTIONS §8) governs controls — buttons, fields — where the reference
   shows a box. The underline is always visible while keyboard-focused
   (`:focus-visible`), never removed. **RATIFIED at the 3.1/3.2 review** —
   CONVENTIONS §9 exception log row 2 (the component row outranks the
   generic ring rule for inline text).

## The on-tint color ruling (the spec's probe NOTES record)

The link consumes `--tk-color-link` ALWAYS — consumers do NOT pick a
link-on-tint step manually; the semantic token themes itself (light/dark).
Consequence recorded for consumers: blue-100 is the AA pair for surface-base
(4.624:1); on LIGHT tinted/field surfaces (blue-100 = 4.072:1 on field) the
AA-safe step is `--tk-color-link-on-tint` — a DOCUMENT-level override of
`--tk-color-link` for the tinted section, never a per-component prop (the
component carries no on-tint variant by design). Dark needs no such step
(`--tk-color-link` = #66A3FF everywhere).

**Demonstrated since the review:** the Theming story carries an on-tint
panel (tint-bluegray — opaque in both themes) running exactly that recipe —
`style="--tk-color-link: var(--tk-color-link-on-tint)"` on the container —
so the DESIGN-declared token is documented-and-demonstrated rather than
dead: light shows blue-200 (4.965:1 on the tint), dark resolves to #66A3FF
(≈6.1:1 on the dark tint). Links on surface-base panels remain the default
demo surface so both themes' axe passes reflect the base pairs.

## Reduction-motion note

The underline's 150ms fade consumes `--tk-motion-duration-fast`, which the
token layer collapses to 0ms under `prefers-reduced-motion` — the affordance
degrades to an instant appearance, never a trapped mid-fade. Touch parity:
hover's underline has keyboard (:focus-visible) and tap (press) equivalents
— the affordance is never hover-only.
