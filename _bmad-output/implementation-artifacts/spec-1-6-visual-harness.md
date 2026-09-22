---
title: 'Story 1.6 — Visual regression harness with pinned capture environment'
type: 'feature'
created: '2026-09-22'
status: 'in-progress'
route: 'full'
route_source: 'auto'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
baseline_commit: 'b8f0505b649b443889e33852680b47a728916df0'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nothing detects visual drift — components will land from 1.7 with no automated kit-vs-kit comparison and no pinned capture environment, so thresholds would be incomparable across runs (FR-10, AD-8).

**Approach:** Stand up the Playwright visual harness: story auto-discovery from the built docs bundle (zero per-component wiring), screenshot tests with `maxDiffPixelRatio: 0.015`, axe checks on every story in BOTH themes, and the pinned capture environment (fixed viewport + device-scale-factor, forced `prefers-reduced-motion: reduce`, Inter as the deterministic test font overriding the font slots, single baselines root) — with the baseline workflow documented (kit-vs-kit, provisional rule, human gate).

## Boundaries & Constraints

**Always:**
- Playwright 1.63.0 + @axe-core/playwright 4.13.0 (root devDeps, exact). Browsers installed via `pnpm exec playwright install chromium` (chromium only for v1).
- Auto-discovery: read `packages/docs/dist/index.json` (Storybook 10 static build emits it) and generate one test per story id — new stories are picked up with zero harness edits; the empty/missing index is a loud failure with guidance (build docs first).
- Each story renders in BOTH themes: iframe URL `iframe.html?id=<id>&viewMode=story` plus `&globals=theme:dark` for dark (mechanism proven live in 1.5's static-build pass).
- Screenshot: `toHaveScreenshot({ maxDiffPixelRatio: 0.015 })` on the story canvas (iframe body element, not the full manager), `animations: 'disabled'` + forced reduced-motion, caret/animations stabilized.
- Pinned env in `playwright.config.ts`: fixed viewport (1280×800) + `deviceScaleFactor: 1`, `reducedMotion: 'reduce'`, `colorScheme: 'light'` (the kit themes itself via tokens, not the OS scheme); font determinism via a harness-injected stylesheet overriding `--tk-font-heading`/`--tk-font-body` to locally-served Inter (exact pin, e.g. @fontsource/inter — no network fetch); single baselines root (Playwright default per-spec dir under `tests/visual/`).
- Axe: `AxeBuilder` against each story iframe, both themes, WCAG-tags filter, zero violations = pass; violations reported with rule ids + node selectors. The @internal tokens-demo may carry a documented exclusion ONLY for color-contrast on `.tksw-chip` (mirror of its storybook a11y config).
- Baseline workflow doc: `tests/visual/README.md` — kit-vs-kit principle (site captures can't pixel-diff, OQ-2), provisional-approval rule for the autonomous run, human side-by-side gate at baseline creation, intentional change = baseline re-approval in the same PR (AD-8).
- Script: root `test:visual` = build docs → run the visual suite (webServer serves `packages/docs/dist` on a fixed port, built by the script). NOT wired into `pnpm test` (CI wiring is 1.8); document that.
- Fonts wait: assert `document.fonts.ready` before capture (deterministic glyph raster).

**Never:**
- No component stories added (1.7 owns Button — it validates the harness end-to-end).
- No pixel-diffing against `.playwright-cli/` site captures (kit-vs-kit only, per AD-8).
- No CI wiring (1.8) and no changes to the tokens/docs packages beyond the Inter injection living entirely in the harness.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fresh run, no baselines | first `test:visual` | Playwright writes baselines for every discovered story × theme; suite passes (baseline-creation mode) | missing index.json → loud guidance "build docs first" |
| New story lands | docs rebuilt, new story id in index.json | suite fails (no baseline) until the baseline is added in the same change — drift/absence is loud | failure names the story id |
| Visual drift > 1.5% | pixel change in a component | toHaveScreenshot fails with diff attachment | — |
| Theme parity | same story light vs dark | two separate baselines; axe runs on both | — |
| Font nondeterminism | system fallback would raster differently | Inter injected + document.fonts.ready awaited → deterministic | — |

</frozen-after-approval>

## Code Map

- `packages/docs/dist/index.json` -- Storybook 10 static story index (source of story ids)
- `.playwright-cli/verify/` -- evidence-screenshot policy dir (1.5) — visual harness baselines live under tests/visual/, NOT here
- `tests/docs-preview.test.ts` -- happy-dom pattern for any pure-logic unit tests the harness needs (e.g., theme-URL builder)
- `packages/docs/.storybook/preview.ts` -- the globalType name `theme` and `globals=theme:dark` param semantics the harness depends on (proven in 1.5)
- `vitest.config.ts` root include is `tests/**/*.test.ts` — keep harness unit tests matching that glob if any; the Playwright suite lives outside vitest

## Tasks & Acceptance

**Execution:**
- [x] `playwright.config.ts` (root) -- pinned env + webServer (static dist) + chromium project -- the harness config
- [x] `tests/visual/visual.spec.ts` -- index.json-driven story×theme tests: screenshot + axe both themes, fonts.ready await, canvas-element capture -- the suite
- [x] `tests/visual/inter.css|inject.ts` + Inter dependency (exact pin) -- deterministic font override of both slots -- font determinism
- [x] root `package.json` -- `test:visual` script (build docs → serve → run; document non-integration with `pnpm test`) -- entry point
- [x] `tests/visual/README.md` -- baseline workflow doc (kit-vs-kit, provisional rule, human gate, re-approval flow) -- AD-8 process
- [x] baselines -- generate + commit the first baselines (getting-started + tokens-demo × 2 themes) -- initial truth

**Acceptance Criteria:**
- Given a fresh checkout, when `pnpm test:visual` runs, then baselines are written for every story × theme and the suite exits 0.
- Given baselines committed, when `pnpm test:visual` re-runs, then all comparisons pass at 0.015 with the pinned environment (no flaky diffs across two consecutive runs on an unchanged tree).
- Given a story id in index.json with no baseline, when the suite runs, then it fails naming the story.
- Given a deliberate pixel change (temporary CSS tweak probe) > 1.5% of the canvas, when the suite runs, then it fails with a diff (probe reverted).
- Given any story, when axe runs in both themes, then zero violations (or the single documented tokens-demo chip exclusion); violations list rule ids + selectors.

## Implementation Notes

- Approved autonomously (standing delegation); determined by Story 1.6 ACs + AD-8 + OQ-6 (1.5%). Implementation choices: Inter delivery via @fontsource (self-hosted, no network) and canvas-element capture are harness mechanics — note them in the README.
- Playwright version pin 1.63.0 (spine); if 1.63 + Storybook 10 index.json format mismatch (ids/params), adapt the reader to the actual emitted shape and note the shape.

## Spec Change Log

## Review Triage Log

## Design Notes

Story discovery from index.json (not story globbing source files) keeps the harness decoupled from CSF internals and matches "auto-discovered by the suite" — whatever Storybook builds is what gets tested. Theme via URL param reuses the exact mechanism 1.5 proved in the static build. Per-story axe in both themes here (not only at 1.7) because stories already exist and the harness is the enforcement point.

## Verification

**Commands:**
- `pnpm test:visual` (twice) -- expected: first run writes baselines exit 0; second run all-pass exit 0 (stability)
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck` -- expected: all exit 0 (harness doesn't break existing gates)
- probe: temporary visual change → suite fails with diff → revert → green
