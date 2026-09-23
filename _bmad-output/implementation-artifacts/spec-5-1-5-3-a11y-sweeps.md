---
title: 'Stories 5.1–5.3 — A11y sweeps: method definition + all three component groups'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '9401871bf4b1a9cbb390719b7df37ec8e7ffbc38'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** SM-2 (WCAG 2.1 AA 19/19, keyboard-complete, unified focus, contrast both themes, ≥44px targets, reduced-motion) is asserted per-component as built but never swept as a kit-wide, method-defined, ledger-evidenced whole — and FR-6 requires the sweep evidence, not the assertion.

**Approach:** One batch, three stories: define the sweep METHOD (5.1), then apply it to all 19 components in their three groups — I: primitives/indicators/overlays (Button, TextLink, Badge, ProgressBar, Modal, Tooltip, Toast), II: forms (Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker) + 2.8 walkthrough re-verify, III: navigation/cards (Tabs, Navbar, Footer, Promo/Feature/Service/ArticleCard) + burger at <768 + 3.10 composition re-verify. The method is MECHANIZED wherever the harness allows; what cannot be mechanized here (VoiceOver/NVDA spot-checks) is protocol-recorded and maintainer-deferred — the provisional-baseline precedent, surfaced loudly.

## Boundaries & Constraints

- **Method (5.1) — six checks per component, both themes:**
  1. Keyboard matrix per EXPERIENCE Interaction Primitives (the per-component cell set: Tab/Shift-Tab everywhere; arrows where named; Space where named; Esc where named; Home/End where named) — LEDGER-mapped to the asserting test; a gap is FIXED (new test), never waived.
  2. Visible unified focus ring: 2px `--tk-color-focus-ring`/dark equivalent, offset 2px — asserted (computed styles on :focus-visible) for every interactive surface; the logged §9/§8 exceptions (tk-link, tk-article-card underline; modal panel no-ring) verify their exception-log entries instead.
  3. Roles/names/states correct by construction — axe both themes (already in the visual suite) PLUS a name-check: every interactive element exposes an accessible name (axe label rules cover; sweep records per component).
  4. Contrast per the AA-override table — extend the mechanized pair table to any RENDERED pair the sweep finds uncovered (incl. overlay surfaces: tooltip ink/white, toast pairs, scrim-vs-panel is decorative).
  5. Targets ≥44×44px effective — geometry assertions (button-compact precedent); exceptions only where EXPERIENCE carves them (bare checkbox box has the 44 floor already — 2.4).
  6. Reduced-motion: ZERO animations under `prefers-reduced-motion: reduce` — a NEW discover-every-story Playwright spec (media emulation, `document.getAnimations()` empty after settle, both themes) — a permanent CI guard; any component that still animates under reduce is a FINDING to fix.
- **SR spot-checks (VoiceOver + NVDA):** protocol recorded per group in the story docs (scripted traversal steps, expected announcements at each stop, what to listen for: name/role/state, error reads, live-region behavior); execution DEFERRED to the maintainer with a deferred-work.md entry (harness must not hijack the user's screen reader; NVDA is Windows-only). The deviation from the AC letter is recorded in the spec triage + surfaced to the maintainer.
- **Ledger:** `.playwright-cli/verify/a11y-sweep/` — METHOD.md + per-group ledger files (component × six checks → evidence pointer: test id/file:line, script, or story-doc section). Every cell filled with REAL evidence; «verified by existing X» only where X genuinely asserts it.
- **Re-verifications:** 2.8 form walkthrough re-runs clean (31/31); 3.10 homepage axe re-verifies at the three viewports × two themes; navbar burger drawer re-proven at <768.
- Fixes found by the sweep land IN THIS CHANGE (component code + tests + baselines if visual); findings that are genuinely defensible rulings get exception-log/NOTES entries instead — no silent waivers.
- No new tokens; no theme branches; story content RU, story meta EN; no `@WORD` in css.ts jsdoc; baselines below-threshold rewrites forced by deleting PNGs (known harness quirk).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Method defined | METHOD.md | six checks, evidence format, group rosters | — |
| Group I sweep | 7 components | ledger complete; findings fixed or ruled | — |
| Group II sweep | 5 components + walkthrough | ledger + 31/31 re-verify | — |
| Group III sweep | 7 components + burger + composition | ledger + axe 3×2 re-verify | — |
| Reduced-motion guard | every story × 2 themes | getAnimations() empty | animator under reduce → FIX in-change |
| Contrast gap | rendered pair uncovered | pair added to mechanized table | failing pair → FIX |
| Keyboard gap | matrix cell unasserted | test added | — |
| SR spot-checks | protocol per group | steps+expected announcements in story docs | execution = deferred-work entry |

</frozen-after-approval>

## Code Map

- `tests/contrast.test.ts` -- the mechanized AA pair table to extend
- `tests/visual/` -- story discovery + per-component specs (keyboard/geometry/assertion molds: button.spec, select.spec, homepage.spec)
- `.playwright-cli/verify/form/walkthrough.mjs` -- re-verify driver; `.playwright-cli/verify/homepage/` -- 3.10 evidence mold
- `packages/components/src/<name>/<name>.stories.ts` -- per-group a11y-note + spot-check-protocol sections
- `packages/tokens/src/tokens.css` -- AA-override semantic values the contrast table asserts

## Tasks & Acceptance

- [x] `.playwright-cli/verify/a11y-sweep/{METHOD.md,group-I.md,group-II.md,group-III.md}` -- method + three complete ledgers (114/114 cells)
- [x] `tests/visual/reduced-motion.spec.ts` -- the zero-animation CI guard over every discovered story (107 stories × 2 themes; runs inside `pnpm test:visual`, zero workflow edits)
- [x] Contrast table extended to every rendered pair (26 → 60 rows, generated-maps + recorded pins); geometry/name checks gap-filled; keyboard ledger complete
- [x] Re-verifications: walkthrough 31/31; homepage spec 14/14 (axe 3 viewports × 2 themes); burger drawer live at 360 + utility chips geometry
- [x] Findings fixed in-change (code+tests+baselines) or ruled with recorded entries; SR protocols in all 19 story docs + deferred-work entry
- [x] Full gates + baselines stable ×2 (746/746 each pass)

**Acceptance Criteria:**
- Given any of the 19 components, when reading its group ledger, then all six check cells carry real evidence pointers (no «ok» cells).
- Given the reduced-motion spec in CI, when any story animates under reduce, then CI fails.
- Given `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; walkthrough 31/31.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls recorded in METHOD.md/ledgers: guard placement (Playwright visual lane — already a CI gate); evidence format (file:line pointers, every cited body opened this run); pair-table mechanics (dark values resolved from generated maps, `toBeCloseTo` 3dp pins → token drift fails loudly).
- **SR spot-check EXECUTION deferred to the maintainer** (protocol-only in the 19 story docs) — the recorded deviation from the AC letter: the harness must not drive the user's screen reader; NVDA is Windows-only. Same class as provisional baselines; deferred-work.md carries the execution entry. SURFACED to the maintainer in the batch status report.
- Sweep findings fixed in-change: **F1** `::slotted(button):focus-visible` → `::slotted(button:focus-visible)` (the old form is silently DROPPED at parse per CSS Scoping — the toast action's ring had been falling back to UA; kit-wide grep clean, select's pseudo usages are correctly inside the parens); **F2** navbar utilities 20×44 → min-width 44 + centering (story-recipe scope — slot content is consumer's); **F3** tooltip Open-story trigger now a composed tk-button. Ruled with entries: inline-prose anchor 44px exemption (§9 row, display-computed boundary, mechanized in the sweep engine); progress-fill/scrim redundancy per DESIGN's redundancy rule; tk-link/article-card underline exceptions now verified live instead of trusted.
- One API socket drop mid-run — agent resumed with state intact (4th occurrence; recovery remains reliable).

## Spec Change Log

(none — frozen block untouched)

## Review Triage Log

Quick review (2026-09-23): 0 blockers / 2 MAJOR / 2 MINOR / 4 NOTE → FIX-THEN-SHIP; all patched in-change:

1. **[MAJOR] RM computed sweep reach** — walk was scoped to `#storybook-root`; `#tk-toast-stack`, `#tk-overlay-root`, and same-origin iframe previews were invisible to the computed-style half (a hover-only 200ms transition on a body-level surface passed green). PATCHED: seeds = `querySelectorAll('#storybook-root, #tk-toast-stack, #tk-overlay-root')` + contentDocument recursion; missing seed throws; **inject-verified live** (toast-stack button transition under reduce now fails the guard).
2. **[MAJOR] Focus-ring carrier permissiveness** — hidden/zero-rect carriers passed broken rings; speculative prev-sibling carrier; color-mix prefix accepted without resolution. PATCHED: carriers must render (client rects, visibility/display/opacity gates); next-sibling only; exact resolved-token comparison (zero color-mix outline usages exist; escalation path documented in-code).
3. **[MINOR] Stop topology loose** — bounds looser than ledger counts; shape+name dedupe collapsed same-shaped stops (promo/service/article had silently collapsed to 1 each). PATCHED: exact counts pinned from measured ordinals (link 5, navbar 6, footer 30, cards 3/3/3…); per-ELEMENT page-persistent ordinal in stopKey; cycle closes only on true revisit.
4. **[MINOR] 360 utilities unasserted** — chips ARE visible at 360; geometry assertions added to the burger leg (≥2 chips ≥44×44); fact in group-III.md.
5. **[NOTE] RM settle-window residual** — documented in the guard header (late-mount animators; CI runs once).
6. **[NOTE] §9 boundary semantics sentence** — appended (display-computed boundary; variant carries semantics).
7. **[NOTE] CI duration** — ~274 legs at workers:1 recorded in METHOD.md + revisit condition (batch stories per page, not more workers).
8. Left as recorded: whitespace-only story hunks; tooltip Accessibility-story plain-button trigger (consumer-content scope).

Post-patch verification: 638 unit (root 66→100 via contrast rows) + 746 visual/axe ×2 + orchestrator compare run; build/lint/typecheck/gen-drift green. Ledger authenticity: 18 evidence pointers adversarially opened by review — zero vacuous; baseline churn surgical (50 = 38 SR tables + 8 navbar F2 + 4 tooltip F3; ~420 untouched).

## Design Notes

The sweep is a VERIFICATION story: its product is evidence (ledgers + a permanent CI guard) and in-change fixes — not new features. Treat «the test already exists» claims skeptically: open the cited test and confirm it asserts the cell (the vacuous-test class has shipped three times).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable; the new reduced-motion spec runs in the same suite or its own `pnpm test` lane — pick and record
