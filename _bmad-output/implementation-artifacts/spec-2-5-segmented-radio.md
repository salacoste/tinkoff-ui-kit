---
title: 'Story 2.5 — SegmentedRadio: Да/Нет pill group'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: 'c3a3274945c59a1c4cb8feb80870a7c7198bcfed'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The reference's Да/Нет citizenship control (the form's binary gate) has no kit counterpart.

**Approach:** Implement `tk-segmented-radio` per EXPERIENCE.md/DESIGN.md: pill track (radius-full), selected segment solid fill + dot indicator; radiogroup semantics with arrow keys moving within the group and selection following focus; exactly one selected option ever; frozen §4 value channel; same component-gate discipline as 2.3/2.4.

## Boundaries & Constraints

**Always:**
- Behavior (EXPERIENCE SegmentedRadio row): arrows move within the group (Left/Up = prev, Right/Down = next, wrapping — note the pick), selection FOLLOWS focus (radio semantics — moving selects); exactly one selected ever; roles radiogroup/radio with aria-checked; Tab enters the group at the selected option (tabindex roving); Space selects the focused option (no-op when already selected — follow native); Home/End jump first/last (EXPERIENCE Interaction Primitives names arrows for SegmentedRadio; Home/End is the Tabs row's requirement — apply here too for consistency? NO: follow the letter — arrows only; note the decision).
- Stateful API per frozen §4: `value`/`defaultValue`/`value-change` (string channel like Select); `options` (array of { value, label, disabled? } — the 2.3 data shape); `label` (group's accessible name — visible legend-style label above the track, mirroring Input's always-visible label pattern); `disabled` (whole group); disabled individual options skipped by arrows and unselectable; `name` pass-through — radiogroup participates in forms via the same formAssociated/ElementInternals pattern Checkbox proved (2.4's ratified amendment — the kit's form pattern; mirror value).
- Visual (DESIGN.md segmented-radio spec): pill track radius-full; selected segment = solid fill + dot indicator (follow the capture: selected fill per the reference — likely surface-base/white + shadow inside a tinted track, or solid accent; the 2.0 observations note «gray fill vs white+border» ambiguity — RESOLVE by pixel-probing the capture like 2.4 did, record the reading; DESIGN.md's «selected segment solid fill + dot» wins on ambiguity); unselected segments = transparent text; group height ~52px field-language or the reference's own (~44-48px — follow the capture); unified focus ring on the focused segment; disabled 40%.
- Unit tests (happy-dom): arrows move+select (incl. wrap, skip-disabled), exactly-one invariant under controlled/uncontrolled, roving tabindex, Space/Enter select, form mirror (wiring-level like 2.4), clamps/null guards, duplicate-value clamp (2.3 precedent).
- React: `'tk-segmented-radio': { onValueChange: 'value-change' }` + gen + wrapper smoke (string payload).
- Component gate: impeccable/axe both themes; story: default + options variants + disabled option + theming + a11y/keyboard checklist; PROVISIONAL baseline + side-by-side vs `.playwright-cli/captures/segmented-radio-citizenship.png` archived + vision + PIXEL-PROBE the ambiguous selected-fill reading into the verify NOTES.

**Never:**
- No new tokens; no theme branches; no per-segment imperative DOM; no Tab trapping (Tab leaves the group naturally).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|----------------|----------------|
| Arrow moves | → on Да/Нет group | focus+selection move together (wrapping) | — |
| Skip disabled | disabled middle option | arrows skip it both directions | all-disabled → arrows inert |
| Exactly one | any interaction | one aria-checked radio ever (incl. controlled) | zero options → renders empty track, inert |
| Tab behavior | Tab into/out | enters at selected; Tab/Shift-Tab leaves | nothing selected → first non-disabled |
| Controlled | value prop set | strict; release seeds (string channel) | — |
| Form | inside form + name | FormData carries name=value | — |
| Null options | options=null/[] | inert empty state, no crash | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/select/` + `src/checkbox/` -- the molds (§4 string/boolean channels, options clamp, formAssociated mirror, capture discipline)
- `.playwright-cli/captures/segmented-radio-citizenship.png` + `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` § SegmentedRadio -- reference + the flagged fill ambiguity (resolve by pixel probe)
- `tests/event-map-completeness.test.ts` -- demands the registry entry on value-change

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/segmented-radio/{index.ts,segmented-radio.ts,segmented-radio.css.ts,segmented-radio.test.ts,segmented-radio.stories.ts}` -- the suite
- [x] `packages/react/src/event-map.ts` + gen + wrapper smoke
- [x] `.playwright-cli/verify/segmented-radio/` side-by-side + PIXEL-PROBE of the selected-fill ambiguity + vision check
- [x] baselines via update flow + stability ×2

**Acceptance Criteria:**
- Given the matrix rows, when the unit suite runs, then each row asserts (all seven).
- Given the capture, when pixel-probed, then the selected-fill reading is recorded in the verify NOTES (resolving the 2.0 ambiguity for this component; DESIGN.md correction stays deferred to 3.6/5.6).
- Given `pnpm gen && git diff --exit-code` (staged), then exit 0; visual stable ×2; axe both themes zero violations.

## Implementation Notes

- Approved autonomously (standing delegation). Judgment calls: arrow wrap (picked: yes), Home/End (picked: no — EXPERIENCE letter), track height (capture), selected-fill (pixel probe decides).

## Spec Change Log

## Review Triage Log

Pass 1 (quick lens, live-probed; verdicts: medium 3 / low 2; 5 patch items, all applied):

- medium — dark-theme hover painted white on the light-only --tk-color-lightblue-200 (~1.2:1, verified live) → patch: hover consumes --tk-color-surface-muted (one surface-axis step in BOTH theme layers, AA 12.6/15.7:1; existing-token route, no theme branch; NOTES deviation 7).
- medium — native radio arrows ROVED focus inside a disabled group in chromium (the disabled early-return skipped preventDefault) → patch: every handled key preventDefaulted BEFORE the disabled exit; unit + live chromium assertions.
- medium — the field-surface hook forked the slot name (--tk-segmented-radio-track-fill) violating same-slot-same-role → patch: renamed to --tk-segmented-radio-fill (parity with input/select); segment-fill kept (different role).
- low — orphan clickable-styled group label: association route (label[for] tab-stop) implemented then REJECTED by live probe (Chromium concatenates associated labels onto the tab-stop option's name — asymmetric rename following the roving stop); shipped the pre-authorized fallback: span + aria-labelledby naming; unit + getByRole name-safety live test.
- low — spec Code Map cited a wrong .working path → fixed.
- notes — the cem sortModulesPlugin determinism fix (manifest module order was process-nondeterministic — gen-drift flaky) landed as a harness prerequisite, mold-precedented; the one-pill-track vs reference-two-pills divergence documented (DESIGN wins).

## Design Notes

Native radios inside the track give semantics for free (name-grouping in shadow root works for arrow key radio-group navigation natively!) — but native radio arrow behavior in shadow roots is UA-consistent; still wire explicit keydown for controlled-mode semantics + the dot indicator is a styled ::before on the label. Keep native inputs as the a11y surface (2.4 pattern), custom visuals, explicit arrow handling for strict-controlled correctness.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow, then ×2) -- stable
