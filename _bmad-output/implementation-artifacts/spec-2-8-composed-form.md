---
title: 'Story 2.8 — Composed application form, UJ-3 walkthrough recorded'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: 'c86ff28a343586f98ff912263ada1b6c2f4d1821'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Epic 2's stated deliverable is «the reference application form assembles from the kit» — the components exist but the assembly is unproven, and Lena's UJ-3 (keyboard + SR through a kit form) has never been walked end-to-end.

**Approach:** Compose the reference application form as a docs example story from the Epic 2 components (Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar, Button), record the UJ-3 keyboard + SR walkthrough (label → badge → input order; Select open/arrows/Enter; SegmentedRadio arrows with focus-follows-selection; submit → described-by validation error without focus theft; ProgressBar reflecting completion), explicitly deferring the Toast leg to 4.3 — and prove the composed page passes axe both themes + impeccable.

## Boundaries & Constraints

**Always:**
- Composition: a new story in packages/components (e.g. `src/showcase/application-form.stories.ts` — a showcase directory, not a component dir; note the choice) — «Заявка на дебетовую карту» mirroring the reference: ФИО (Input, required, badge «+20%» per the reference capture), Телефон (Input), citizenship (SegmentedRadio Да/Нет), cashback category (Select), card design (ThumbnailPicker, 4+2 with token-SVG art like 2.6's stories), consent (Checkbox + inline anchor), ProgressBar reflecting completion % (live-computed from field validity/completion — note the formula: completed fields / total, rounded), primary Button «Продолжить» (single primary per cluster).
- Interactivity: uncontrolled components wired via events in the story's script (a tiny state object; no framework) — ProgressBar updates as fields complete; submit with an empty required field shows the Input error (aria-describedby, no focus theft — drive it: set the error prop from the story's validation on click); on all-valid submit the button goes loading briefly (spinner, width frozen) then resets + ProgressBar hits 100% (NO Toast — deferred note in the story copy).
- Walkthrough record: `.playwright-cli/verify/form/NOTES.md` — a LIVE playwright walk of the composed story (keyboard: Tab order, arrow flows, submit/error/retry; SR observations via the axe tree + role/name/state dumps at each step — full SR (VO/NVDA) is a 5.x human task, note that); plus the UJ-3 steps cross-referenced to the EXPERIENCE flow. Axe both themes on the composed story; impeccable on the showcase file.
- Side-by-side: composed form vs `.playwright-cli/captures/application-form-full.png` (region-composed side-by-side; the kit renders with the kit's components — fidelity deltas per-component are already recorded in each component's verify NOTES; this record is about ASSEMBLY, not per-pixel matching — note the standard).
- Baselines: the composed story gets baselines (both themes) like any story.
- No new components, no new tokens, no changes to existing components (gaps found → report them, patch only if trivial and mold-precedented).

**Never:**
- No form-submission wiring beyond the demo reset (no network); no personal data beyond dummy values; no Toast (4.3); no component edits unless a blocking integration bug surfaces (report + minimal fix + test then).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Tab through the form | from first field | reading order: ФИО → телефон → citizenship → cashback → design → consent → button; label→badge→input per field | — |
| Progressive completion | fill fields | ProgressBar % rises live (formula noted) | — |
| Empty required submit | click «Продолжить» with empty ФИО | Input error shows via described-by; focus NOT stolen; ProgressBar unchanged | — |
| Valid submit | all fields valid | button loading → reset; ProgressBar 100% | — |
| Axe both themes | the composed story | zero violations | — |
| Keyboard-only complete session | the full walkthrough | every step operable, error heard on revisit | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/{input,select,checkbox,segmented-radio,thumbnail-picker,progress-bar,button}/` -- the parts
- `.playwright-cli/captures/application-form-full.png` -- the reference assembly
- `.playwright-cli/verify/{input,select,checkbox,segmented-radio,thumbnail-picker,progress-bar}/NOTES.md` -- per-component ground truth (fidelity deltas live there)
- `packages/docs/.storybook/main.ts` stories glob picks up src/**/*.stories.ts automatically

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/showcase/application-form.stories.ts` -- the composition (story + tiny event-wiring script)
- [x] `.playwright-cli/verify/form/NOTES.md` -- live UJ-3 walkthrough record (keyboard + axe-tree observations per step; Toast deferral noted)
- [x] side-by-side (region composition) + vision check
- [x] baselines both themes + stability ×2 + axe both themes + impeccable

**Acceptance Criteria:**
- Given the walkthrough record, when a reviewer reads it, then every UJ-3 step has an observation (label/badge order, arrows, submit error no-theft, ProgressBar narration path) and the Toast leg is explicitly marked deferred to 4.3.
- Given the composed story, when axe runs both themes, then zero violations; impeccable zero blockers.
- Given the visual suite, the composed baselines pass ×2 (stability).
- Given any integration gap found, when non-trivial, then it is REPORTED (not silently patched) with a recommendation.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: completion formula, showcase directory placement, error-driving technique, side-by-side standard (assembly-level, not pixel).

## Spec Change Log

## Review Triage Log

- 2026-09-23 · quick (auto) · **Patched.** Walkthrough step 9's axe loop labeled two runs [light]/[dark] but never navigated between them — both analyzed the dark page (the last navigation was step 8's dark render), making the [light] check a vacuous mislabeled duplicate. Fixed: `openStory(page, dark)` per iteration before analyzing; re-run is a fresh 26/26 with genuine light AND dark zero-violation passes, and the correction is recorded in verify/form/NOTES.md (not hidden).
- 2026-09-23 · quick (auto) · **Patched.** NOTES.md lacked the recorded impeccable evidence the AC demands: the CI step's exact detector invocation was run on the showcase file and its zero-findings/exit-0 output is now recorded verbatim in a dedicated section.
- 2026-09-23 · quick (auto) · **Patched.** Side-by-side scale description was wrong arithmetic: 1104→568 is NOT the capture's DPR2→CSS restoration (that would be 552) — corrected to what it is: the reference resized to the kit panel/form-line width (568px, ~103%).
- 2026-09-23 · quick (auto) · **Patched.** Spec bookkeeping closed: status/review/lenses/checkboxes + this triage log appended after the three patches.

## Design Notes

The wiring script: a module-level state object updated by each component's -change event; ProgressBar + button error props derive from it via a re-render helper (Lit html re-render of the story container — stories rerender on args changes; for event-driven updates use a simple render() re-invocation pattern or requestUpdate on a host controller — simplest: keep the composition in one render function keyed to the state object and re-call it from each handler; note the technique).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged if the showcase file changes the manifest — it shouldn't: no new element)
- `pnpm test:visual` (update flow, then ×2) -- stable
