# Story 3.2 — tk-badge provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source (Story 2.0, tbank.ru debit-card
form): `.playwright-cli/captures/badge-chip-incentive.png` (46×45; the badge
~44×22 inside, «+20%»).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference strip (top) vs trimmed kit pill (bottom), 40px white gutter |
| `kit-badge-light.png` / `kit-badge-dark.png` | kit renders (Playground story, incentive variant, slotted «+20%» — the like-for-like composition) |
| `kit-badge-stat-light.png` / `kit-badge-stat-dark.png` | stat variant renders for the kit's own record (no reference capture exists) |
| `kit-badge-count-light.png` / `kit-badge-count-dark.png` | capped-count renders («99+», count=120) for the kit's own record |
| `badge-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800, DSF 1,
`--font-render-hinting=none --disable-lcd-text`, reducedMotion reduce,
colorScheme light, locally-served DaytonaSans/Inter). The light and dark kit
renders are **byte-identical** (`cmp`) — the theme-invariance claim proven,
not asserted.

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/badge/badge-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick ../captures/badge-chip-incentive.png \
#   \( -size 46x40 xc:white \) \( kit-badge-<theme>.png -trim +repage \) \
#   -background white -append side-by-side-<theme>.png
```

## Ground truth — pixel probes vs reference (ImageMagick)

The 2.4 lesson applied: every load-bearing color below is a measured pixel
value (the badge interior is far too small a region for vision color reads).

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Fill | `#00B52C` cluster (0,178–184,43–45) — avg of the pill's greens | `#39B54A` (57,181,74) — green-100 token exact | **DEVIATION 1** (DESIGN token wins) |
| Text | `#F1F3F6`-family pixels inside the pill (white text, AA-blended against green; the 2.0 vision note's «#FFFFFF») | `#333333` (51,51,51) + ink→green blends — text-on-primary | **DEVIATION 2** (the 2.1 AA override) |
| Pill height | 20–22px (green bbox 46×20 at fuzz 25; the 2.0 note's «~22») | **22px exact** (trimmed pill 49×22) | match |
| Pill width | 44–46px | 49px («+20%», 12px/500 + 8px padding-inline ×2) | ~3px wider total — inside the capture's own AA bleed |
| Text padding | ~8–9px horizontal | `--tk-space-8` = 8px | match |
| Shape | stadium pill (radius = h/2) | radius-full | exact |
| Dark theme | — (site is light-only) | light/dark renders **byte-identical** | theme-invariant pair proven |

## Vision check passes (zai analyze_image, 2026-09-23)

- light side-by-side: structure confirmed (fully-rounded pill, flat fill,
  same white-free background, similar type); «reference green brighter/more
  saturated, kit darker» = deviation 1 (pixel-proven, correct direction);
  «kit text appears white» — **REFUTED by pixels**: the trimmed pill
  histogram shows `#333333` ink glyphs (30 solid px + ink→green AA), the
  AA pair; «kit padding 1.5–2× the reference» — **exaggerated**: real
  delta is ~2px per side (49 vs 44–46 total).
- badge dark not re-run: the dark render is byte-identical to light (cmp),
  so the light pass covers it.
- Standing lesson (2.4/2.7): verify the artifact's pixels before trusting
  a vision read — two misreads this story, both corrected above.

## Intentional deviations (documented, not defects)

1. **Fill green-100 `#39B54A`, not the reference's measured `#00B52C`.**
   DESIGN.md's token scale carries the badge green (the tk-input slotted
   chip consumed the same token); DESIGN wins over captures, the identical
   ruling as every scale color so far.
2. **Text INK `#333333` (text-on-primary), not the reference's white.**
   The AA pairing frozen at Story 2.1 (tk-input's slotted «+30%» chip):
   white on green-100 is 2.66:1 — fails AA at 12px; ink is 4.74:1 —
   passes. The token consumed is `--tk-color-text-on-primary` (the
   yellow-keeps-ink invariant, reused for the same class of saturated
   brand fill); the pairing is theme-invariant, like yellow.
3. **Pill width ~49px vs 44–46.** body-xs at weight 500 in DaytonaSans
   runs slightly wider than the site's face for «+20%»; the padding (8px)
   matches the reference. No hook needed — slotted content sizes the pill.

## Semantics note (recorded for the review pass)

The badge renders a plain `<span>` — no tabindex, no role, no cursor, no
hover state anywhere in the sheet (unit-pinned structurally). A count badge
announces ONLY the count (the label cell is `display:none`/hidden while
count mode is active — hidden subtrees stay out of the accessibility tree);
a label badge announces its slot/label text. Clicking does nothing: there
is no interactive surface to begin with (the I/O matrix's «nothing» row).
