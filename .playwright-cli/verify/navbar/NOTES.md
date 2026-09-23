# Story 3.4 — tk-navbar provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side sources (Story 2.0, tbank.ru):
`.playwright-cli/captures/navbar-desktop.png` (1280×64) and
`navbar-mobile.png` (1080×168 = 360×56 CSS @DPR3).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` / `side-by-side-dark.png` | reference desktop bar (top) vs kit bar (bottom), 40px white gutter |
| `side-by-side-mobile-light.png` / `side-by-side-mobile-dark.png` | reference mobile bar resized to 1x CSS px (top) vs kit 360px-context bar (bottom) |
| `kit-navbar-{light,dark}.png` | kit bar at rest (Playground story, first link active) |
| `kit-navbar-scrolled-{light,dark}.png` | kit bar past the 10px threshold — shadow + hairline in |
| `kit-navbar-mobile-{light,dark}.png` | kit bar in a real 360×667 context (burger visible) |
| `kit-navbar-drawer-{light,dark}.png` | the OPEN drawer through the element's own pipeline (burger click) |
| `navbar-capture.mjs` | the committed capture recipe (below) |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on a
local port, pinned capture env identical to the visual suite: 1280×800 /
360×667, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/navbar/navbar-capture.mjs   # COMMITTED alongside this NOTES
# side-by-sides: magick — the exact commands in git history:
#   magick \( ../../captures/navbar-desktop.png \) \( -size 1280x40 xc:white \) \
#     \( kit-navbar-light.png \) -background white -append side-by-side-light.png
#   magick ../../captures/navbar-mobile.png -resize 360x56 /tmp/ref.png   # DPR3 → 1x
#   magick \( /tmp/ref.png \) \( -size 360x40 xc:white \) \
#     \( kit-navbar-mobile-light.png \) -background white -append side-by-side-mobile-light.png
```

## Ground truth — pixel probes vs reference (ImageMagick)

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Bar height | 64px desktop / 56px mobile | 72px desktop (74px shot = 72 + 1px hairline + 1px shadow bleed) / 56px mobile (58px shot) | **DEVIATION 1** (DESIGN 72px wins); mobile = probe value |
| Fill | #FFFFFF | #FFFFFF exact (5,5); dark = rgb(26,26,26) = surface-base-dark exact | match |
| Active underline | none visible in the capture | #FFDD2D EXACT, rows y69–72 = 4px band, ending on the bar's bottom edge (the border edge — the spec's noted offset) | kit addition (spec'd active state) |
| Active text | — | stems ≈#3D3D3B (ink text-primary + 700 heading-weight token) | kit addition (AA redundancy pair) |
| Inactive text | ≈#303–#333 (same ink as active) | text-secondary #616871 (the frozen spec row) | **DEVIATION 2** (spec row, the tabs precedent) |
| Scrolled edge | — (capture at rest) | at-rest bottom rows: white + yellow only; scrolled adds #E7E8EA hairline EXACT (border-default) + shadow-default | match to spec |
| Burger chip (mobile) | 40px round #F2F3F5 fill | 44px round #F5F5F6 fill EXACT (surface-muted) at x294..338 | match (44px = a11y floor) |
| Drawer | — | surface-base fill, 360×215 (4 links × 44px + padding), radius-lg top corners, shadow-popover | spec's bottom-sheet pick |
| Dark theme | — (site light-only) | fill #1A1A1A, underline yellow kept, hairline #FFFFFF24 blend | tonal mapping correct |

## Vision check passes (zai analyze_image, 2026-09-23, three rounds)

- Desktop: structure/order identical (logo → 4 links → search → account),
  nothing missing or clipped; noted deltas = deviations 1/2 + the
  story-composed logo mark and (round-1) an outlined person glyph — the
  glyph is now FILLED to match the reference.
- Mobile round 1 CAUGHT two real story bugs: «Личный кабинет» wrapped to
  two lines (missing nowrap) and, after the chip styling, the burger chip
  clipped at the right edge (the icon-widened pill overflowed 360px).
  Fixed in the story composition: `white-space: nowrap`, text-only pill on
  mobile (person icon drops <768), cluster order pill → search → burger
  (the reference's mobile order, via the story's own media query).
- Mobile round 3: 4/4 pass — burger fully visible, order correct, pill
  single-line, no clipping. The reference strip's own bottom-crop in the
  composite is a side-by-side crop artifact, not a kit defect.

## Intentional deviations (documented, not defects)

1. **72px bar height, not the probed 64px.** DESIGN.md freezes
   `components.navbar.height: 72px` and «DESIGN and EXPERIENCE win on
   conflict with any capture» — the same ruling as tabs' pill shape. The
   mobile 56px has no DESIGN counterpart and ships as probed.
2. **Inactive links text-secondary (#616871), not the reference's ≈ink.**
   The spec's frozen boundary row; hierarchy reads against the 700-weight
   active ink. AA: 5.64:1 passes.
3. **The story's logo mark is a simplified squircle, not the shield.**
   Story-level composition in the `logo` slot — the kit ships NO logo; the
   reference's shield shape is deliberately not redrawn glyph-exact
   (unofficial-study trademark posture).
4. **700 weight comes from a heading token** (`--tk-text-heading-2-weight`)
   — the scale's 700s live only in heading slots («bold = 500, headings
   700/500 only»), and DESIGN's AA table itself pairs the Navbar underline
   with 700-weight ink text.
5. **The burger chip is 44px, not the reference's 40px** — the ≥44px
   interactive-target floor (the tabs-button precedent).
6. **On-tint recipe** (Theming story): charcoal surfaces override
   `--tk-navbar-link` AND `--tk-navbar-link-hover` together — the tk-tabs
   dedicated-hover-hook lesson (a lone text hook would fall back to
   text-primary, 1:1 invisible on ink).

## Rulings recorded (spec Implementation Notes)

- **Navbar channel**: `activeValue` is a prop-only input — no
  value/defaultValue pair, no change event (navigation ≠ form control;
  unit-pinned "no channel events"). Unknown value marks NOTHING (no
  first-link clamp — unlike tabs).
- **Drawer form**: bottom sheet (full-width, radius-lg top corners,
  shadow-popover), anchored by `positionFloating` on the bar's bottom edge
  — the capture shows only the closed bar, so the spec's bottom-sheet
  language decided.
- **Drawer is internal UI state**: no `open` property, no `open-change`,
  no React event-map entry (the spec's explicit §9 deviation ruling).
- **Breakpoint**: `@media (max-width: 767px)` — container queries deferred
  (spec note). The viewport-forced MobileBurger story embeds a 375px
  same-origin preview iframe (media queries answer the IFRAME viewport);
  the second frame opens the drawer through the element's own pipeline.

## Semantics note (recorded for the review pass)

Full wiring lives in navbar.ts: `<header>` bar (banner) + `<nav
aria-label>` links with `aria-current="page"` on the active section;
burger named by `burger-label` with `aria-expanded`/`aria-controls`; drawer
= `role="dialog"` + `aria-modal="true"` mounted via `mountOverlay(panel,
'dropdown')` with `lockBodyScroll()` + `trapFocus(panel)` — zero bespoke
z/scroll/trap code (source-pinned by the unit suite; the one scroll
listener is the spec's own threshold row). Esc closes and re-focuses the
burger; a clicked link closes; disconnect tears down quietly. The `burger`
slot override renders INSTEAD of the fallback list (slotchange-driven) so
the trap's focusable set stays honest — an overridden drawer traps empty
(the module's designed degradation; keep a focusable inside the override).
