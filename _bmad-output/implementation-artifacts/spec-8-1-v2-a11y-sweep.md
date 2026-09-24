---
title: 'Story 8.1 — v2 a11y sweep (the 5.1 method on the nine)'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — after 7.5; the six v2 components + extensions)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 8.1)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-1-5-3-a11y-sweeps.md (THE method mold — six checks, ledger, engine legs)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/ (the ledger this story extends; METHOD.md)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The nine v2 surfaces shipped without the 5.1–5.3 a11y-sweep pass v1 has —
no ledger rows, no name/state verification table, no story SR-protocol completion check
beyond each story's own gate.

**Approach:** The 5.1 method VERBATIM on the nine: tk-filter-chips, tk-pagination,
tk-combobox-search, tk-navbar (mega-nav extension), tk-data-table, tk-cookie-banner,
tk-stepper, tk-store-badges, tk-qr-block. Ledger rows extend the existing file; the six
checks run per component; SR-protocol sections verified present+complete in each story
(execution stays maintainer-side, as v1 ruled).

## Boundaries & Constraints

**Always:**
- The six 5.1 checks per component (the METHOD.md list): roles/names/states vs spec,
  keyboard walkthrough vs the story's checklist, focus order/visibility, axe-tree name
  checks, announcement behavior (combobox-search counts, cookie-banner's deliberate
  no-dismiss), hit-target audit (§8 44px — incl. the known sublink-shrink NOTE from 7.1
  triage: verify the shipped stories pass, record the stress-case as a ledger note).
- Engine legs: the sweep's spec legs (a11y-sweep.spec.ts) extend to the v2 stories —
  the automated half (roles/names/states) mechanized; narration/live-region quality stays
  the recorded-protocol + maintainer-execution mold.
- The 7.1 triage NOTEs land here: `sub-label=""` empty-name gap (navbar+burgerLabel
  string-prop parity — FIX if the sweep's fix is mechanical (fallback to the default when
  empty), else record); argTypes controls polish for subActiveValue/subLabel.
- The deferred-work `:host([hidden])` kit-wide sweep (6.3 N6, 8.1 candidate) EXECUTES
  HERE: every component sheet that sets `:host{display}` gains the `:host([hidden])`
  guard (or the shared-css ruling — the sweep decides, baselines prove nothing moved:
  hidden never applies in stories).
- Deliverable: the extended ledger (per-component rows, the six check columns, RU notes),
  any mechanical fixes + their tests, full gates; SR protocols recorded in stories.

**Never:**
- No new components; no API changes beyond the mechanical empty-name fallback (if taken);
  no token/theme changes; no SR execution by the harness (maintainer-side, the v1 ruling);
  no reopening settled contracts (Esc-no-dismiss is a RECORDED RULING, not a violation).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Ledger | 9 components × 6 checks | rows complete, verdicts honest | — |
| Empty sub-label | sub-label="" | default fallback (if mechanical fix taken) or recorded gap | — |
| Hidden guard | hidden attr on any host | element actually hides (the kit-wide sweep) | — |
| Keyboard | per-component checklist | matches the story's contract | deviations → ledger + fix |
| Announcements | combobox counts / banner ruling | per-spec behavior | — |

## Tasks & Acceptance

- [ ] The 9-component sweep executed, ledger extended (`.playwright-cli/verify/a11y-sweep/`)
- [ ] Mechanical fixes (empty-name fallback if taken; `:host([hidden])` sweep) + tests
- [ ] Full gates green (VISUAL SERIALIZED); spec closed; commit + push

**Acceptance Criteria:**
- Given the ledger, when read, then all 9 × 6 cells carry an honest verdict.
- Given `hidden` on every kit host, when applied, then every host hides.
- Given the full gates, then green; visual stable (guards change no rendered story).

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
