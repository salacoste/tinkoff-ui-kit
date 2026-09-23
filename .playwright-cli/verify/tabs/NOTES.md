# Story 3.3 — tk-tabs provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru homepage
section switcher): `.playwright-cli/captures/tabs-switcher.png` (374×44,
«Дебетовая карта» active / «Кредитная карта» / «Вклад»).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference strip (top) vs trimmed kit track (bottom), 40px white gutter |
| `kit-tabs-light.png` / `kit-tabs-dark.png` | kit renders (Playground story, the like-for-like 3-tab composition, first tab active) |
| `kit-tabs-badges-light.png` / `kit-tabs-badges-dark.png` | badge + disabled-tab composition for the kit's own record (the reference carries neither) |
| `tabs-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/tabs/tabs-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ../../captures... — see the exact commands in git history:
#   magick kit-tabs-<theme>.png -trim +repage trimmed.png
#   magick ../../../.playwright-cli/captures/tabs-switcher.png \
#     \( -size 374x40 xc:white \) \( trimmed.png \) -background white -append side-by-side-<theme>.png
```

## Ground truth — pixel probes vs reference (ImageMagick + raw-byte scans)

The standing lesson applied: every load-bearing value below is a measured
pixel value; two 2.0 vision reads were refuted by pixels (see deviations).

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Track height | 44px full control (y=0..43) | 44px (track row; 45px shot = 44 + 1px shadow bleed) | match |
| Pill height / inset | 40px visual pill (y=2..41), ~2px block inset | 40px (hairline rows y=3..42 incl. the 1px border) | match |
| Pill horizontal padding | ~14–15px (text bbox 17..132 in pill 3..147) | 16px (`--tk-space-16`; label band 16..134) | match (token step) |
| Pill shape | rounded rect r≈6–8px (corner staircase 143..147) | `radius-full` capsule | **DEVIATION 1** (DESIGN token wins) |
| Pill fill | white #FFFFFF | `#FFFFFF` — surface-base exact | match |
| Pill edge | soft shadow gradient (no crisp hairline) | 1px `#E7E8EA` hairline exact + `--tk-shadow-default` | **DEVIATION 2** (dark-canvas belt) |
| Track fill | gray `#F2F4F7` (x≈2..372) | NONE — invisible track | **DEVIATION 3** (DESIGN wins) |
| Active text | `#333333` stems (51,51,51), weight ~500–600 | `#333333` exact (51,51,51), body-m-bold 500, y-band 17..30 vs reference 16..29 | match |
| Inactive text | `≈#303131` stems (48,49,49) — the SAME ink as active; the 2.0 vision note «#8C8F94» REFUTED by pixels | `#616871` exact (97,104,113) — text-secondary | **DEVIATION 4** (frozen spec row) |
| Inter-tab rhythm | pill edge → next label ~20px; label→label gap ~35px | 16px padding + `--tk-space-8` gap → ~24px pill-to-label | close (token rhythm) |
| Badge | none in the capture | nested tk-badge, cap «99+» (badge's own domain) | kit addition (spec pick) |
| Dark theme | — (site is light-only) | pill `#1A1A1A` + hairline blend 58 (= `#FFFFFF24` over base), inactive text ≈186 (= `#FFFFFFB3` blend), active `#FFFFFF` | tonal mapping correct |

## Vision check passes (zai analyze_image, 2026-09-23)

- light side-by-side: labels/order/active tab identical in both rows;
  active hierarchy (dark bold on white chip) matches; no missing text or
  clipping in the kit row. The noted «missing gray track», «capsule vs
  rounded rect», «inactive slightly lighter» = deviations 1/3/4 below —
  pixel-proven intentional, correct direction. «Faint divider between
  inactive tabs» in the reference: no divider exists in the pixels (the
  dark stems are glyph strokes) — misread, disregarded.
- THE BUG THE VISION+PROBE PIPELINE CAUGHT (first capture round): the
  active tab's label did not paint — the positioned `::before` pill covered
  the unpositioned inline label (paint order: positioned boxes paint after
  inline content). Zero dark pixels inside the pill band was the tell;
  fixed by positioning `.tab__label` and the nested badge (the tk-button
  label mold verbatim), baselines re-taken in the same change. The initial
  baseline run had silently baselined the bug — the side-by-side gate is
  what surfaced it.

## Intentional deviations (documented, not defects)

1. **Capsule `radius-full`, not the reference's r≈6–8px rounded rect.**
   DESIGN.md freezes `tabs.active-radius: {rounded.full}` and the Shapes
   section makes the pill the system's signature for active tabs; DESIGN
   wins over captures (the same ruling as segmented-radio's frozen track).
2. **1px border-default hairline on the pill.** The reference edge is a
   soft shadow only; the kit adds the hairline so the pill survives dark
   canvases (surface-base on surface-base + `shadow-default: none` in dark
   would leave nothing) — the tk-button secondary treatment verbatim. The
   500-weight text stays the redundant state carrier (yellow-redundancy
   rule applied to the pill).
3. **Invisible track.** The reference paints a `#F2F4F7` track band;
   DESIGN.md freezes «active = white pill + default shadow inside
   INVISIBLE track». The probe's METRICS survive (44px track, 40px pill,
   2px inset, ~16px padding). On tinted surfaces consumers override BOTH text
   hooks — `--tk-tabs-text` AND `--tk-tabs-text-hover` (charcoal recipe in
   the Theming story — axe-driven; see deviation 6).
4. **Inactive text `#616871` (text-secondary), not the reference's measured
   `≈#303131`.** The spec's frozen row says inactive = text-secondary, and
   the hierarchy reads against the 500-weight active ink; the reference's
   actual inactive ink being near-identical to active is recorded here.
   AA: #616871 on white 5.64:1 passes.
5. **Hover = text-primary at 150ms on inactive tabs** (spec pick;
   EXPERIENCE State Patterns token step — a cross-theme-safe TEXT step, no
   background token involved).
6. **Dedicated hover hook `--tk-tabs-text-hover`** (3.3 review fix): the
   hover step originally consumed the ACTIVE-text hook — on tint consumers
   overriding the text hooks to white, the text-primary fallback made the
   hovered inactive tab 1:1 invisible against the tint (proven live on
   charcoal, #333 on #333). The hook defaults to text-primary (dark remap
   exists) and tint surfaces override BOTH text hooks together. Live-pinned
   in tests/visual/tabs.spec.ts (computed hover color ≠ panel bg).

## Review-triage additions (2026-09-23, quick review)

- **Shrink route for narrow hosts:** `flex:none` tabs spilled a 3-tab strip
  62px past a 360px host with the label ellipsis structurally unable to
  engage. Tabs now shrink (`flex: 0 1 auto; min-width: 0` on the button, the
  label's ellipsis finally engages, the badge stays `flex:none`); NO grow —
  text tabs remain content-sized like the reference, never equal segments.
  The track itself never scrolls (a scrollable strip is a consumer-surface
  decision). Live-pinned in tests/visual/tabs.spec.ts (360px host: no spill,
  ellipsis active).
- **Swap-animation restart now test-pinned:** an animationstart-based spec
  counts the panel animation across a real activation (mount animation pinned
  at exactly one — a documented decision point), so the display:none → block
  restart technique can no longer regress silently.

## Semantics note (recorded for the review pass)

Full tab semantics live in tabs.ts: tablist/tab/tabpanel roles,
aria-selected, aria-controls/aria-labelledby id wiring inside one shadow
tree; arrows cycle WRAPPING with AUTOMATIC activation; Home/End jump to
first/last enabled; roving tabindex (active 0, others −1; all-disabled →
no stop); disabled tabs are native `button disabled` — skipped, not
focusable. §4 string channel strict/defaultValue/release verbatim
(select/segmented-radio mirror); unknown values clamp to the first ENABLED
tab (the reference always shows an active switcher); `activeIndex` is a
derived read-only parity getter — the event detail stays `{ value }`.
Panels project through per-index slots `tab-0…tab-N`; activation toggles
`hidden`, which both removes inactive panels from the tab order AND
restarts the visible panel's CSS swap animation (display:none → block) —
content-only motion, bar static (unit-pinned + computed-style-pinned live).
