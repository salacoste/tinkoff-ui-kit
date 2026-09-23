# Stories 3.10+3.11 — homepage composition: assembly side-by-side + UX-DR14 matrix (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch.

**Standard (the spec's side-by-side ruling, the 2.8 precedent):** this record
is about ASSEMBLY — reading order, cluster structure, wiring — NOT per-pixel
matching. Per-component fidelity deltas live in each component's own verify
NOTES (`.playwright-cli/verify/<component>/NOTES.md`).

## Files

| File | What |
|---|---|
| `homepage-capture.mjs` | the COMMITTED capture recipe (pinned env identical to the visual suite; removes the preview disclaimer banner — page chrome, the form captures' precedent) |
| `side-by-side-light.png` / `side-by-side-dark.png` | reference fold (top, `../../tbank-home-full.png` crop 1280×660 — navbar + centered hero + category-strip start, DPR1 so CSS px = image px, NO resampling) vs kit composition (bottom, `homepage-1280-<theme>.png` crop 0..1526 — navbar + hero + grid + strip), 40px white gutter |
| `homepage-1280/900/360-{light,dark}.png` | the composed story full-page at the three UX-DR14 breakpoints × both themes |
| `homepage-360-drawer-{light,dark}.png` | the burger drawer OPEN at 360 (post-fix: flush bottom sheet) |
| `kit-region-{navbar,hero,grid,strip,footer}.png` | element-level regions at 1280 light (the per-cluster kit column) |

## Reproduce

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6014 &
node .playwright-cli/verify/homepage/homepage-capture.mjs
# side-by-sides (from this directory):
#   for T in light dark; do magick ../../tbank-home-full.png -crop 1280x660+0+0 +repage \
#     \( -size 1280x40 xc:white \) homepage-1280-$T.png -crop 1280x1526+0+0 +repage \
#     -background white -append side-by-side-$T.png; done
```

## The composition (what ships)

`packages/components/src/showcase/homepage.stories.ts` — story
`showcase-homepage--homepage` («Главная выше фолда (composed)»). A SHOWCASE
directory story (the 2.8 mold), NOT a component. Parts, all existing:

- tk-navbar — sticky, active link («Частным лицам»: yellow underline + 700),
  logo + utilities slots (the navbar story's own slot recipes)
- hero — h1 on heading-1 tokens + body-l + ONE primary CTA («Оформить карту»,
  hero size); token-drawn art (2.6 pattern: fills READ from the live token
  layer — the reference's yellow blob + ink-card-with-crown + coin, abstract)
- PromoCard 3-up — «Рекомендуемые продукты»: Платинум (charcoal), Т-Инвестиции
  (bluegray), ОСАГО (mint — the measured #D0F4F2 correction); SECONDARY pill
  CTAs only (cards are passive)
- signup strip — phone+email tk-input pair (interactive, uncontrolled) + the
  strip's primary «Продолжить»; STATIC by the spec's judgment call (no
  validation/loading wiring — the 2.8 closure-state pattern has nothing to
  derive here; the full route is the form showcase's own story)
- tk-footer — the reference directory (6 columns, pills, phone, legal with
  composed tk-link legal instances)

Single-primary-per-cluster is TAGGED in the DOM: `data-cluster="hero"` /
`data-cluster="signup"`; the spec pins exactly one primary per cluster, zero
primaries among the cards' secondaries, none outside the two clusters.

## UX-DR14 matrix — per-breakpoint evidence

| Row | ≥1024 (1280) | 768–1023 (900) | <768 (360) |
|---|---|---|---|
| Layout | container 1200 (probed: content 64..1216), hero centered, sections on the 96 rhythm | content 24..876, same structure | single column, container padding steps 24→16 |
| Grids | 3-up, 20px grid-gap, equal columns (probed 3 tracks) | ONE-STEP COLLAPSE: 2-up, third card wraps left-aligned (probed 2 tracks; vision-confirmed wrap) | 1 track (probed; vision-confirmed stack) |
| Navbar | full links nav, burger hidden (probed) | full nav until 768 (probed: burger hidden at 900) | burger visible, links hidden (probed); drawer opens/traps/closes (spec-pinned live) |
| Hero CTA | natural pill, centered | unchanged | FULL-WIDTH via the column-flex recipe (spec-pinned: pill width == copy content width 328 == host width) |
| Spacing step-down | hero 96/64, sections 96, strip panel 32 | unchanged | hero/sections/strip 64, strip panel 24; card padding steps via the component's own `--tk-promo-card-padding-mobile` (space-24) |
| Heading mapping | heading-1 (50/700) | unchanged | heading-4 metrics (28px) with 700 kept — heading-3 left a ragged 4-line wrap at 360 (probed; vision-verified 3 balanced lines after) |
| Footer | directory aligned to the container content edge (probed 64..1216 == grid edge) | 24..876 == grid edge (probed) | 16..344 == grid edge (probed); pills wrap 4+3 rows (vision) |

CI pinning: `tests/visual/homepage.spec.ts` asserts the tracks/burger/CTA
legs at all three widths, axe 3×2, and the burger walkthrough at 360.

## Burger drawer at 360 — live walkthrough (spec-pinned)

Opens via a real click (burger `aria-expanded` true, panel role=dialog
visible); the controller's trap places focus on the FIRST drawer link;
6× Tab keeps focus on `a.drawer__link` (the wrap cycles); Esc hides the
panel, `aria-expanded` false, focus back on `button.burger`. Scroll lock
observed (body overflow hidden while open, restored after).

## THE INTEGRATION BUG THE COMPOSITION CAUGHT (fixed in this change)

Symptom: at 360 the open drawer rendered ~260px BELOW the bar (panel top
321.5 vs bar bottom 57, measured live) with a stray dark outline.

Root cause: the overlay controller mounts the sheet via the popover path;
UA `[popover]` styles it `inset: 0; margin: auto; border: solid`. The
positioner writes inline top/left/width — which beat the UA edges but NOT
the UA `margin: auto`: between the inline `top` and the UA `bottom: 0` the
auto margins split the free viewport space and push the sheet down by
(800 − top − height − 0)/2 ≈ 264px; the UA `border: solid` painted the
outline. tk-select never showed this because its panel sheet RESETS the UA
popover styles at author level (`margin: 0; inset: auto; border: none` in
selectMenuStyles — the documented 2.3 precedent); the navbar drawer was
missing that reset.

Why 3.4's gates missed it: the drawer's own evidence was an ELEMENT
screenshot (crops the box wherever it renders) + unit tests on mechanics —
nothing ever checked PAGE-RELATIVE placement. A composed viewport screenshot
was exactly the missing probe (Epic 3's finale thesis proven by its own bug).

Fix (both in the navbar, zero controller/primitive changes):
- `navbar.css.ts` `.drawer`: the author-origin popover UA reset (`border:
  none; margin: 0; inset: auto`) mirroring the select panel precedent;
- `navbar.ts` `positionFloating(..., viewportPadding: 0)`: the sheet is
  full-bleed by design (width == viewport), and the positioner's default 8px
  viewport padding clamps the degenerate equal-width case 8px in from the
  left and 8px past the right edge (probed 8..368 pre-option, 0..360 after).

Post-fix probe: panel top == bar bottom == 57, 0..360 flush, border 0,
margin 0 — and the navbar's OWN story benefits identically (the differential
probe reproduced the bug there). Select untouched (its reset predates this).

Baseline impact at first pass: NONE — and the reason was itself a finding
(probed live): the MobileBurger story's second iframe NEVER actually opened
its drawer under the pinned env (`openDrawerInside`'s one-shot click ran
before the nested preview mounted and silently no-oped — both frames probed
`aria-expanded=false`), so that story's baselines carried a closed burger
bar with zero drawer pixels. That is also why the mispositioned drawer
survived 3.4's gates: the story-level baseline never contained it. FIXED in
review (bounded settle-poll replacing the one-shot click; verified in the
built bundle: frame 2 `aria-expanded=true`, drawer flush under the bar) and
the MobileBurger baselines re-approved with the change — see the spec's
Review Triage Log. The drawer itself is additionally proven live at
composition level by homepage.spec.ts.

## Assembly side-by-side — vision check (zai analyze_image, 2026-09-23)

Light + dark composed and checked. Assembly verdict: navbar structure
mirrored (logo / 4 links / search + account); hero cluster mirrored
(centered 2-line heading → one-line subheading → single centered yellow CTA);
exactly ONE yellow primary per hero in both columns; the kit's product-grid
and signup-strip clusters read as intentional composition differences (the
reference fold has category tiles and no signup strip — both out of the
spec's composition list); no misordered or broken cluster in the kit column.

## Reassembly-gap report (the spec's AC)

**No blocking gaps: no new component or token was needed.** Recorded
observations:

1. **Full-width CTA ergonomics** — achievable today only via the consumer
   recipe (host flipped to column flex; the shadow pill stretches as a
   cross-axis flex item — probed 312==312). Recommend a first-class
   presentation affordance on tk-button in a future epic (a `stretch`
   attribute or a `--tk-button-*` layout hook).
2. **Footer gutters are consumer layout** (the component's frozen contract) —
   centered-PADDING, not `max-width`+auto margins: the page is a column flex
   and auto cross-axis margins shrink a stretched item to fit-content (a
   972px footer, measured). Recipe documented in the story source.
3. **Category tiles + the full application form** are reference fold content
   outside the spec's composition list (the form is the 2.8 showcase); noted,
   not gaps.
4. **Abstract hero art hidden at <768** (copy-first mobile row); the
   reference keeps its 3D illustration — an assembly-level deviation, noted.
5. The popover-UA positioning bug above was found and FIXED (not reported
   open) — the one code change outside the showcase file this spec produced.

## Axe + baselines + gates

- Viewport-scoped axe (homepage.spec.ts): 3 breakpoints × 2 themes, ZERO
  violations (14/14 tests green).
- The visual suite's own desktop-viewport legs carry the story's per-theme
  axe + baselines (both themes, update flow), then stability ×2 — counts in
  the story report, not duplicated here.
- `pnpm gen` clean (no new element; the showcase directory adds no manifest
  entry).
