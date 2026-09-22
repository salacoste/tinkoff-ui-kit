---
title: 'Story 2.7 — ProgressBar: determinate default, safe indeterminate'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: '1cb3c11287ce9268a4a6192065fb4078fd5c3aad'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's «Уже заполнено N%» progress feedback has no kit counterpart — the last form component missing.

**Approach:** Implement `tk-progress-bar` per EXPERIENCE.md/DESIGN.md: 4px gray-200 track with blue-100 fill, pill radius; determinate by default with value/min/max; label and % as optional slots; indeterminate variant with a reduced-motion-safe pulse; optional aria-live narration; empty-state copy slot. Stateless display component (no value-change channel — value is input, not state).

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE ProgressBar row): determinate default; `value`/`min`/`max` exposed (numbers; clamp value into [min,max] on render — display clamps, does NOT mutate the prop or emit anything); label and percentage render as optional slots (named `label` and `value`? — follow the reference composition: label text left, % right; implement as named slots with optional props fallback — note the pick); indeterminate = reduced-motion-safe pulse (static under reduce); OPTIONAL aria-live narration — off by default, `announce` prop enables polite narration of value changes (throttled — note the approach: announce on settled value, not every transient; EXPERIENCE names ProgressBar as the one sanctioned aria-live user).
- Semantics: `role="progressbar"` with `aria-valuenow/min/max` when determinate; indeterminate = `aria-busy`-style indeterminate presentation (no aria-valuenow); accessible name from the label slot/prop (aria-labelledby SPAN pattern).
- Visual (DESIGN.md progress spec): 4px track `--tk-color-gray-200`, fill `--tk-color-blue-100`, pill radius `--tk-radius-full`; track full-width block; % / label text per body-s tokens (follow the capture probe for text placement/size); dark theme via tokens only (gray-200/blue-100 have no dark remaps — check: if the dark layer lacks mappings the bar inherits the same values — acceptable? tonal steps would be better but NO new tokens — probe the capture, follow tokens, note the dark appearance in the verify NOTES as a token-layer observation for 5.4).
- Indeterminate pulse: CSS keyframe consuming motion tokens (duration-moderate curve-productive-standard per AD-9 mapping? — pulse is a loop; use a token duration; reduced-motion → animation: none + a static half-fill or shimmer-off state — pick the reference's own treatment if the capture shows one, else static 33% fill; note the choice).
- Unit tests: determinate render math (value→width %, clamping both ends), min>max degenerate (render nothing/0% — pick + test), aria wiring (valuenow/min/max, labelledby), indeterminate class + no valuenow, announce prop (polite narration on settle — fake timers), empty-state slot (zero/absent value + no slots → the copy slot renders per State Patterns — define the trigger: EXPERIENCE says «Empty | ProgressBar | Zero-state copy slot; never blank»: when value===min (0 progress) AND no label/% slots → default copy «Ещё ничего не заполнено» or the projected slot; note the exact rule), number clamps (NaN/string→default 0/min, note), form participation N/A (display only — no name/mirror).
- React: NO event-map entry (no events — the completeness guard only demands entries for dispatching components; confirm no CustomEvent dispatch); wrapper still generated (props only) + smoke (render + prop reflection).
- Component gate: impeccable/axe both themes; story: default + with label/% + indeterminate + announce + empty + theming + a11y notes (progressbar semantics, narration note); PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/progress-bar-fill.png` + vision check (the 4px bar is tiny — pixel-probe the colors like 2.4 did).

**Never:**
- No new tokens (flag the dark-layer observation in NOTES for 5.4); no theme branches; no value-change events (stateless); no z/overlay logic.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Determinate render | value 30, min 0, max 100 | fill width 30%, aria-valuenow 30 | — |
| Clamp | value 150 / value -10 | renders 100% / 0% (prop untouched) | — |
| Degenerate | min > max | renders 0% + no valuenow (or swap-clamps — pick, test) | — |
| NaN/string value | value="abc" | treated as min (0) — note | — |
| Indeterminate | indeterminate prop | pulse (reduced-motion: static), no valuenow | — |
| Announce | announce + value change | polite aria-live fires once per settled change | — |
| Empty | value=min, no label/% slots | zero-state copy slot renders (never blank) | — |
| Custom min/max | min 20 max 80 value 40 | width (40-20)/(80-20)=33% ; aria-min/max 20/80 | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/button/` -- the stateless mold (props, no channel; reflection rules)
- `.playwright-cli/captures/progress-bar-fill.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` § ProgressBar -- reference + observations (FULL path per the 2.5/2.6 lesson)
- `packages/tokens/src/tokens.css` -- gray-200, blue-100, radius-full, motion tokens

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/progress-bar/{index.ts,progress-bar.ts,progress-bar.css.ts,progress-bar.test.ts,progress-bar.stories.ts}` -- the suite
- [x] `packages/react` -- wrapper via gen (no event entry) + prop smoke
- [x] `.playwright-cli/verify/progress-bar/` side-by-side + PIXEL-PROBE colors + vision check
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts (all eight).
- Given `pnpm gen && git diff --exit-code` (staged), exit 0; the completeness guard stays green with NO progress-bar event entry (no dispatches).
- Given reduced motion, when indeterminate renders, then no animation runs (static fallback).
- Given the visual suite, stable ×2; axe both themes zero violations; the pixel-probe records the track/fill colors.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: slot-vs-prop fallback for label/%, indeterminate static fallback shape, empty-rule trigger, min>max handling.

## Spec Change Log

## Review Triage Log

- 2026-09-23 · quick (auto) · **Patched.** Empty story's second figure didn't demonstrate projection: `progressBar({})` filled the label/value defaults, so `#isEmptyState` was false and the projected `empty` slot stayed hidden — the committed baseline showed «Уже заполнено 30%» under a caption claiming projection. Fixed the figure to pass `value: 0, label: ''` (empty state actually triggers); the `--empty-{light,dark}` baselines re-approved via the update flow.
- 2026-09-23 · quick (auto) · **Patched.** A remounted announcement region stayed permanently blank: `#lastAnnouncedPercent` survived the unmount (toggle indeterminate or announce off/on with an unchanged value → the rAF early-return skipped writing forever). Fixed: the tracker resets to null whenever the region is unmounted, and the rAF callback commits the tracker only on a real write. Round-trip regression tests added (both toggle paths).
- 2026-09-23 · quick (auto) · **Patched.** The zero-state trigger used rounded `#percent === 0` instead of the frozen rule's `value === min`: value 0.4/min 0/max 100 (real progress) wrongly swapped in the copy. Fixed: `#isEmptyState` compares the CLAMPED value against min exactly; class doc's rule description aligned; regression test added (0.4 → bare bar, 0 → copy).
- 2026-09-23 · quick (auto) · **Patched.** The css.ts header cited the superseded vision reading (~#8E9094) while the pixel probe measured #757575 (NOTES deviation 4): comment updated to the measured value citing NOTES.
- 2026-09-23 · quick (auto) · **Patched.** Spec bookkeeping closed: status/review/lenses/checkboxes + this triage log appended after the five patches.

## Design Notes:

Width via inline style `width: XX%` on the fill (computed % — not a token; geometry not theming). The 4px track with pill radius at 4px height = fully rounded ends. Indeterminate: a 33% fill sliding loop (translateX) at duration-slow looping; reduce → static 33% fill. Narration: a visually-hidden aria-live=polite span updated on settled value (debounced via firstUpdated timing or a simple private last-announced tracker — no timers beyond one rAF settle).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
