# Fidelity ledger — 16/16 reference-grounded + 3/3 derived (Story 5.6, 2026-09-23)

**Standard (FR-10 / epics.md 5.6):** every reference-grounded component maps
to (1) its committed visual-suite baseline set, (2) an ARCHIVED tbank.ru
side-by-side under `.playwright-cli/verify/<name>/`, and (3) its probe/vision
evidence record. Derived components (AD-8) map to pattern-consistency records
instead. A missing side-by-side is a FINDING — one was found (Button) and
backfilled from ARCHIVED crops (no live-site capture this story).

Legend — **baseline**: story ids under
`tests/visual/visual.spec.ts-snapshots/` (`visual-<suite>--<story>-<theme>`,
both themes, committed, compare-gated at `maxDiffPixelRatio 0.015` + axe per
story per theme); **side-by-side**: file in this row's verify dir;
**evidence**: the NOTES.md ground-truth tables (pixel/computed-style probes
where marked) + zai vision passes on the side-by-sides.

## 16 reference-grounded components

| # | Component | Baseline set (stories × 2 themes) | Archived side-by-side | Probe / vision evidence |
|---|---|---|---|---|
| 1 | **tk-button** (1.7) | `components-button--`: playground, variants-and-sizes, theming, loading, interaction, a11y, long-label/icon, api = 18 PNGs | `../button/side-by-side-light.png` (hero crop vs variants), `side-by-side-dark.png` — **BACKFILLED this story** (see Finding B1) | `../button/NOTES.md` — DOM-measured 56/48/44 targets + 32px compact pill; vision PASS ×3 variants (yellow/ink pair, white+shadow, ink+white); pixel-true fill pairs |
| 2 | **tk-input** (2.1) | `components-input--`: playground, variants, states (error/disabled/required/badge), theming, a11y, api = 12 PNGs | `../input/side-by-side-{light,dark}.png` | `../input/NOTES.md` — computed-style table: fill #ECF1F7 exact, 52px exact, radius 12 in range, hairline exact; vision triaged vs computed (near-white ambiguity cleared) |
| 3 | **tk-select** (2.3) | `components-select--`: playground, variants, open-menu, value modes, theming, a11y, api = 14 PNGs + the page-level open-region set in `tests/visual/select.spec.ts-snapshots` | `../select/side-by-side-{closed,open}-{light,dark}.png` | `../select/NOTES.md` — computed trigger/menu table + FOUR vision-caught defects fixed (slot assignment, cross-tree idrefs, scrollbar/anchor, activedescendant); final vision pass clean |
| 4 | **tk-checkbox** (2.4) | `components-checkbox--`: playground, checked modes, indeterminate, consent pattern, a11y, api = 14 PNGs | `../checkbox/side-by-side-{unchecked,checked}-{light,dark}.png` | `../checkbox/NOTES.md` — PIXEL-EXACT probes: fill #FFDD2D, glyph #333333 (2.0 gap-close capture `checkbox-consent-checked.png`); wrap point identical; 2 disproven vision flags |
| 5 | **tk-segmented-radio** (2.5) | `components-segmented-radio--`: playground, yes/no value modes, theming, a11y, api = 12 PNGs | `../segmented-radio/side-by-side-{yes,no}-{light,dark}.png` | `../segmented-radio/NOTES.md` — PIXEL PROBE resolved the spec's flagged ambiguity: white pills + 1px #E1E3E4 + yellow Ø24/ink Ø12 dot, 56px height; kit table vs probe; 3 vision misreads disproven by pixels |
| 6 | **tk-thumbnail-picker** (2.6) | `components-thumbnail-picker--`: playground, black/blue value modes, theming, a11y, api = 12 PNGs | `../thumbnail-picker/side-by-side-{black,blue}-{light,dark}.png` | `../thumbnail-picker/NOTES.md` — PIXEL PROBE resolved the ring ambiguity: outer ~3px #FFDD2D annulus hugging the outline; 12px gap pixel-exact; kit geometry table; vision flags triaged |
| 7 | **tk-progress-bar** (2.7) | `components-progress-bar--`: playground, modes, indeterminate, announce, empty, a11y, api = 16 PNGs | `../progress-bar/side-by-side-{light,dark}.png` | `../progress-bar/NOTES.md` — pixel probes: fill width 28px = 5% exact, pill ends exact, label/value/gap exact; deviations 1–4 ruled (DESIGN token wins); vision artifact rebuilt before pass |
| 8 | **tk-link** (3.1) | `components-link--`: playground, variants, hover affordance, legal, theming, a11y, api = 14 PNGs | `../link/side-by-side-{light,dark}.png` | `../link/NOTES.md` — pixel probes: glyph bands EQUAL (vision «1.3–1.5× larger» refuted), rest-underline absent in both, dark pair #66A3FF measured; on-tint recipe demonstrated |
| 9 | **tk-badge** (3.2) | `components-badge--`: playground, variants (incentive/stat/count), slot-vs-props, theming, a11y, api = 14 PNGs | `../badge/side-by-side-{light,dark}.png` | `../badge/NOTES.md` — pixel probes: pill 22px exact, 8px padding match, ink glyphs measured (white-text vision flag refuted); light/dark renders byte-identical (cmp) — theme-invariance PROVEN |
| 10 | **tk-tabs** (3.3) | `components-tabs--`: playground, value modes, badges+disabled, theming, a11y, api = 12 PNGs | `../tabs/side-by-side-{light,dark}.png` | `../tabs/NOTES.md` — pixel/raw-byte probes: 44/40px track/pill, active ink #333 exact, inactive vision note refuted by stems; the label-paint bug caught by vision+probe pipeline, baselines re-taken in-change |
| 11 | **tk-navbar** (3.4) | `components-navbar--`: playground, active states, mobile+drawer (2-frame iframe), theming, api = 12 PNGs | `../navbar/side-by-side-{light,dark}.png` + `side-by-side-mobile-{light,dark}.png` | `../navbar/NOTES.md` — pixel probes: fill exact, yellow underline #FFDD2D exact, hairline exact; mobile rounds 1→3 caught 2 real story bugs (wrap, chip clip) and fixed |
| 12 | **tk-footer** (3.5) | `components-footer--`: playground, fine-print/slots, theming, api = 10 PNGs | `../footer/side-by-side-{light,dark}.png` | `../footer/NOTES.md` — pixel probes: divider 1px #E7E8EA exact, pill ink-300 exact fill, pitch/token rhythm table; reference capture artifacts noted |
| 13 | **tk-promo-card** (3.6) | `components-promo-card--`: playground, variants (5 tints + skeleton), theming, api = 10 PNGs | `../promo-card/side-by-side-{light,dark}.png` + `tint-probe-{mint,beige}.png` | `../promo-card/NOTES.md` — THE TINT CLOSURE: mint/beige pixel-exact (#D0F4F2/#F1EBD6 both sides IDENTICAL); radius row superseded by this story's probe (below); vision pass 2 post-fix |
| 14 | **tk-feature-card** (3.7) | `components-featurecard--`: playground, variants (5 tints + editorial + skeleton), theming, api = 10 PNGs | `../feature-card/side-by-side-{light,dark}.png` | `../feature-card/NOTES.md` — probes: slate→charcoal ruling, CTA/bleed/heading table, live dark-CTA assertion; vision pass on shipped code |
| 15 | **tk-service-card** (3.8) | `components-servicecard--`: playground, variants (5 tints), theming, api = 10 PNGs | `../service-card/side-by-side-{light,dark}.png` | `../service-card/NOTES.md` — probes: tile ~334×316 #F5F6F8 radius ~24, icon/heading/link/padding table; vision pass clean |
| 16 | **tk-article-card** (3.9) | `components-articlecard--`: playground, variants (tints + skeleton), theming, api = 10 PNGs | `../article-card/side-by-side-{light,dark}.png` | `../article-card/NOTES.md` — probes: heading/clamp/link/stitch table; **radius CORRECTED this story** (see Finding R2) |

Composition records (reference-grounded, kit-assembled):
`../homepage/` — UX-DR14 matrix + side-by-sides + region crops (3.10/3.11);
`../form/` — composed application form + 31/31 walkthrough (2.8).

## 3 derived components — pattern-consistency records (AD-8)

| # | Component | First-approved render | Anatomy vs DESIGN Components table | Audit/a11y-clean pointers |
|---|---|---|---|---|
| 17 | **tk-modal** (4.1) | `../modal/kit-modal-open-{light,dark}.png` + `light-dark-pair.png` (page-level clip; element-API open) | `../modal/NOTES.md` pattern-consistency table: fill=surface-base, radius=lg, shadow=modal, 480/padding-32/scrim-ink-alpha, motion 300/150 productive — ALL exact | a11y: `../a11y-sweep/group-I.md` §tk-modal (keyboard matrix, ring, contrast, 44px, RM); axe legs in-suite; 3 vision-caught defects fixed in-change; `tests/visual/modal.spec.ts` geometry+page-level baseline |
| 18 | **tk-tooltip** (4.2) | `../tooltip/kit-tooltip-open-{light,dark}.png` + `light-dark-pair.png` | `../tooltip/NOTES.md` table: ink-300 fill, white text-xs, radius-sm, tooltip shadow, padding 8/12, fade 150ms — ALL exact; theme-invariance ruling recorded | a11y: `../a11y-sweep/group-I.md` §tk-tooltip (incl. the RM no-belt ruling); axe legs; describedby wiring + never-focusable pins in `tests/visual/tooltip.spec.ts` |
| 19 | **tk-toast** (4.3) | `../toast/kit-toast-stack-{light,dark}.png` + `light-dark-pair.png` | `../toast/NOTES.md` table: surface-base card, radius-lg, default shadow, padding 16/20, 150ms productive entrance/exit — ALL exact; anatomy icon+message+action | a11y: `../a11y-sweep/group-I.md` §tk-toast; axe legs; stacking-host corner hug + live registry pins in `tests/visual/toast.spec.ts`; the UA-popover centering bug caught + fixed |

## This story's ledger findings (found → dispositioned)

| # | Finding | Disposition |
|---|---|---|
| B1 | **Button had NO composed side-by-side** (1.7 predates the 2.1 convention; its evidence was crop + render files + a vision record, not the sibling-format composite) | BACKFILLED from ARCHIVED files only: `side-by-side-light.png` (reference-hero-crop + kit-render-variants) and `side-by-side-dark.png` (dark-inverse-hover + variants), magick composite, 40px gutter — button/NOTES.md updated. No live-site capture made. |
| R1 | **`--tk-radius-xxl` 32 NOT confirmed by captures** — reference promo/feature banners measure r≈22 (three captures; two sub-signatures in the band — banners 21.9–22.2 vs tiles 23.5–23.9) vs the kit's 31.5 rendering of 32 | CORRECTED 32 → 24 via the 3.6 mold (DESIGN.md frontmatter + Shapes body + generator notes → `pnpm gen:tokens` → committed artifacts → probe proof). **UX-DR4's xxl-32/xl-24 card distinction is superseded by the 5.6 probe — one measured card radius (24)** (epics.md is frozen planning: recorded here as a pointer, not edited). See the radii section below. |
| R2 | **tk-article-card radius was 16 (`radius-lg`) but the reference tiles measure 24** — the 3.9 vision reading «~16–20» is overruled by pixels (the arc staircase is pixel-identical to a 24px render; the standing 2.4 lesson: pixels overrule vision) | FIXED in-change: `article-card.css.ts` consumes `--tk-radius-xl`; jsdoc + unit pin updated; card baselines re-taken (the 66-file set). |
| Y1/Y2 | **Yellow decoration on docs callouts** (api-reference `.tkap-foot`, getting-started `.tkgs-status`) — UX-DR17 illegal class | FIXED in-change (border-strong); full audit in `yellow-audit.md`. |

## The radii closure (spec 5.6 — xxl/xl [ASSUMPTION] resolution)

Instrument: `radii-probe.mjs` (this directory, committed) — corner-arc
closed-form radius fits on ARCHIVED PNGs (DPR 1 = CSS px; no live site).

| Capture (archived) | Measured r | Notes |
|---|---|---|
| REF `captures/service-card-grid.png` | **23.5** (IQR 23.5–23.9) | the 24px signature |
| REF `captures/article-card-grid.png` | **23.5** | same signature — Finding R2 |
| REF `captures/promo-card-grid.png` | **22.2** (IQR 21.9–22.2) | the banner signature |
| REF `captures/feature-card-platinum.png` | **22.2** | same |
| REF `captures/feature-card-tj-banner.png` | **22.2** | same |
| KIT renders BEFORE correction | promo/feature **31.5** (=32), service **23.5** (=24), article 15.7 (=16) | probe discriminates cleanly (±0.5 of computed) |
| KIT renders AFTER correction (probe proof) | promo/feature/article/service ALL **23.5** — pixel-identical staircase to the reference service/article tiles, inside the reference banner band [22.2–24] | the 3.6-mold proof |

Verdict: **`--tk-radius-xl` 24 CONFIRMED** (pixel-identical); **`--tk-radius-xxl`
32 CORRECTED → 24** — the reference paints one card-radius BAND (22–24 across
five captures; two sub-signatures — banners 21.9–22.2, tiles 23.5–23.9 —
collapsed to one token), not two registers; the 32px vision estimate was
wrong. `xxl` now equals `xl` (documented in DESIGN.md Shapes + the token
listing). Residual: the banner captures' arcs read 22.2 vs our 24 — a ±2px
sub-threshold residual inside the capture pack's own flagged reading range
(16–28) and below the suite's 1.5% pixel budget; recorded, not chased to a
non-monotone 22 step.

**Spacing flag (the third [ASSUMPTION]):** re-annotated as
Verified-systematized — nothing to extract verbatim (the site has no root
scale), load-bearing steps probe-verified at composition (3.10: container
1200, grid-gap 20, 96 rhythm). DESIGN.md + token listing updated; no value
changed.

**All [ASSUMPTION] flags in DESIGN.md / the token listing are now resolved**
(mint/beige 3.6, dark tints 5.4, xxl/xl + spacing 5.6) — verified by grep:
no `[ASSUMPTION]` remains in DESIGN.md, tokens.css, or TOKENS.md outside the
historical review-rubric records (which are planning history, not the design
source).

## SM-C2 statement

The visual suite is stable at the pinned env. Post-fix runs on the final
tree: compare **921/921 green**; after the 66-file re-take, **two green
compare runs** (921/921 each) plus one run with a single NON-PIXEL failure —
`visual: components-tooltip--open [dark]` died in `pinDeterministicFonts`
(`page.evaluate: NetworkError`, inject.ts:28 — BEFORE any screenshot)
because a concurrently-run `pnpm build` swapped `packages/docs/dist` under
the static server mid-suite; root-caused to harness contention (operator
scheduling error, this story), re-run cleanly → 921/921. Logs archived
next to this ledger: `logs/visual-stab{1,2,3}.log` (each tail ends
`921 passed`; the runs are dated 2026-09-22/23 in the file mtimes preserved
from the original `/tmp` copies). Every re-approval wave in suite history is
explained: the per-story re-takes recorded in each NOTES (2.3/3.3/3.6/3.7/
4.3 in-change fixes), 5.4's 23 dark re-takes + the F1 stale-but-passing
flag, 5.5's 27 new docs stories (52 A + 2 M), and this story's deliberate
re-takes (radii correction + UX-DR17 fixes). Review-patch round (same
story): +4 docs baselines re-taken though BELOW threshold — surfaces/
overrides pages still rendered the pre-correction 32px swatch (delete +
update, not drift) — and 6 re-rendered in place (promocard api/playground,
featurecard playground: manifest regen + canvas-prose «32» fixes); two
post-patch compare runs green 921/921 (`logs/visual-postpatch-{1,2}.log`).
**Total deliberate re-takes this story: 70.** The full list rides
the maintainer package
(`_bmad-output/implementation-artifacts/baseline-review-package.md`).
