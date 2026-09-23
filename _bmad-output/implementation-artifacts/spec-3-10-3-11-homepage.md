---
title: 'Stories 3.10+3.11 — Homepage composability + verification matrix (Epic 3 finale)'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 0
baseline_commit: 'feec5df7da4c2dd5769206334e4e84ed3d1ab203'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Epic 3's deliverable — «the homepage above the fold reassembles from Kit Components plus content» — is unproven, and the responsive/a11y verification matrix (UX-DR14) has never run on a composed page.

**Approach:** Assemble the above-the-fold homepage composition in docs from kit components (Navbar, heading, PromoCard grid, Input pair, Button, Footer — the FR-4 consequence), verify it across the three breakpoints with axe both themes + impeccable, record the side-by-side vs tbank-home-full.png and the per-breakpoint behavior. Two stories, one batch — Epic 3 closes here.

## Boundaries & Constraints

- Composition: `packages/components/src/showcase/homepage.stories.ts` (beside the application-form showcase) — Navbar (sticky, active link), hero heading (heading-1 + body via the docs canvas consuming tokens), PromoCard 3-up grid (the corrected tints), Input pair (phone+email) + primary Button (the signup strip), Footer (columns from the reference). Content = reference-like copy, token-drawn art where needed (the 2.6 pattern). Single-primary-per-cluster rule holds (ONE primary button visible; the hero CTA is the primary; strip buttons secondary if any).
- 3.10 ACs: reassembly from kit components + content ONLY (any gap = report, no new components); recorded side-by-side vs `.playwright-cli/tbank-home-full.png` (region-composed, the 2.8 assembly-level standard); the composition passes axe both themes + impeccable.
- 3.11 verification matrix: the three breakpoints (≥1024 full container-1200 grid / 768–1023 one-step collapse / <768 single column + burger + full-width CTA + spacing step-down + mobile heading mapping) recorded per breakpoint (screenshots + notes in `.playwright-cli/verify/homepage/`); burger drawer functional at <768 in the composition; the composed page axe-clean both themes AT each breakpoint (viewport-scoped axe runs — the harness's per-theme runs are desktop-viewport; add viewport-scoped runs in a homepage spec).
- Baselines: the composed story gets baselines (both themes, desktop viewport) like any story; the breakpoint evidence lives in the verify dir (screenshots, not baselines — the harness pins desktop).
- No new components/tokens; gaps REPORTED with recommendations; showcase wiring follows 2.8's closure-state + render() re-invocation pattern where interactivity is needed (the signup strip can reuse the form's validation demo lightly or stay static — pick static display + one interactive Input pair; note).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|----------------|----------------|
| Reassembly | the composition story | above-the-fold from kit components + content only | gap found → reported |
| ≥1024 | viewport 1280 | container 1200, 3-up grid, full navbar | — |
| 768–1023 | viewport 900 | grids collapse one step; navbar full | — |
| <768 | viewport 360 | single column, burger (functional drawer), full-width CTA, spacing step | — |
| Axe per breakpoint | 3 viewports × 2 themes | zero violations each | — |
| Single primary | the composition | exactly one primary button per view cluster | — |
| Side-by-side | vs the reference capture | recorded (assembly-level standard) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/showcase/application-form.stories.ts` -- the composition mold (closure state, render re-invocation)
- `.playwright-cli/tbank-home-full.png` (repo .playwright-cli root, not captures/) + `captures/navbar-{desktop,mobile}.png`, `captures/promo-card-grid.png`, `captures/footer.png` -- the reference regions
- `tests/visual/` harness -- per-theme desktop runs; the breakpoint axe runs extend via a homepage spec (button.spec/select.spec pattern)

## Tasks & Acceptance

- [x] `packages/components/src/showcase/homepage.stories.ts` -- the composition
- [x] `tests/visual/homepage.spec.ts` -- viewport-scoped axe (3×2) + burger-at-360 functional + single-primary assertion
- [x] `.playwright-cli/verify/homepage/` -- side-by-side + per-breakpoint screenshots + notes (UX-DR14 matrix recorded)
- [x] baselines (desktop both themes) + stability ×2 + impeccable

**Acceptance Criteria:**
- Given the composition, when a reviewer reads the verify notes, then each UX-DR14 row has per-breakpoint evidence and the reassembly-gap report (or «none blocking»).
- Given the homepage spec, when it runs, then 3 viewports × 2 themes axe-clean; the burger drawer opens/traps/closes at 360; one primary per cluster.
- Given the visual suite, the composed baselines stable ×2; `pnpm gen && git diff --exit-code` (staged) exit 0.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: static-vs-interactive strip (pick minimal), hero art (token-drawn), heading mapping demo at <768 (the site's L/M/S — record as observation).

## Spec Change Log

- 2026-09-23 (implementation): the composition's 360px evidence caught the navbar
  drawer rendering ~260px below the bar (popover-UA `margin:auto`/`border` not reset —
  the tk-select panel precedent was missing from the drawer) plus an 8px clamp offset on
  the full-bleed sheet. Fixed in `navbar.css.ts`/`navbar.ts` (author-origin UA reset +
  `viewportPadding: 0`), zero controller changes; no existing baseline changed (the
  MobileBurger story's drawer frame never actually opens — probed, recorded in NOTES).
  Full record: `.playwright-cli/verify/homepage/NOTES.md`.

## Review Triage Log

Quick review, 5 findings — all patched (2026-09-23):

1. **Code Map path wrong** — cited `.playwright-cli/captures/tbank-home-full.png`; the file
   lives at `.playwright-cli/tbank-home-full.png` (captures/ holds only the per-region
   PNGs). Entry corrected.
2. **No error-display assertion in the spec's legs** — the copied waitForStorySettled
   carries visual.spec.ts's sb-show-errordisplay branch but nothing consumed it, so a
   misrendered composition could pass all six axe legs (and the layout legs) green
   against the error page. `assertNoErrorState` added and wired into `openHomepage`
   (gates axe + layout + mobile legs); a capture-side dark `data-theme` assertion added
   on the same open path.
3. **Capture recipe weaker than the harness** — homepage-capture.mjs claimed to mirror
   the env but dropped the fonts.check REFUSAL (a serve/font 404 would silently raster a
   system font into the evidence) and the pre-capture dark `html[data-theme="dark"]`
   check (dark evidence could silently become light renders); also used raw
   `new URL('.', import.meta.url).pathname` (breaks on percent-encoded/non-ASCII
   checkouts). All three patched — check-refusal + theme assertion throw loudly;
   `fileURLToPath` for OUT.
4. **Navbar MobileBurger open-drawer demo never rendered** — the deferred click ran at
   fonts.ready+setTimeout(0) after iframe load, before the nested preview mounted;
   optional chaining swallowed the miss (probed aria-expanded=false; byte-stable
   baselines proved the drawer rendered zero pixels — also why the 3.10 positioning
   bug survived 3.4's gates). Fixed with a bounded settle-poll in
   navbar.stories.ts; verified in the built bundle (frame 2: aria-expanded=true,
   drawer flush under the bar); MobileBurger baselines re-approved with the change.
5. **Spec record hygiene** — review/review_source/lenses_ran were unset; this log and
   the fields (review quick/auto, lenses_ran [quick]) now recorded.

## Design Notes

The composition is a SHOWCASE (docs proof), not a component — content slotted, kit blocks composed, consumer-layout grids in the story canvas. The burger functionality comes free from tk-navbar; assert it live at 360 in the spec (the navbar's own spec proved it at the component level — here at the composition level).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0
- `pnpm test:visual` (update flow, then ×2) -- stable
