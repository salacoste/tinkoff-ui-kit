---
title: 'Story 8.2 — v2 dark sweep + the warm-cream [ASSUMPTION] close'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 8.2)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-4-dark-sweep.md (THE mold — L-rule, engine, ledger)'
  - '{project-root}/.playwright-cli/verify/dark-sweep/ledger.md (the v1 ledger to extend)'
  - '{project-root}/packages/tokens/TOKENS.md (the 6.1 dark first-pass [ASSUMPTION] flags)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The nine v2 components render dark via the 6.1 first-pass token values but
were never dark-SWEPT (the 5.4 verification), and the warm-cream dark values carry
[ASSUMPTION] flags 6.1 opened deliberately.

**Approach:** The 5.4 mold VERBATIM on 19+9: dark-audit engine legs extend to the v2
suites; the warm-cream (+#table/divider) dark values CLOSE by the L-rule computation
(correct the values or hold with computed evidence — the 3.6/5.4 arbitration); the ledger
extends to 28 components; both-theme visual legs already pin every story (the standing
suite).

## Boundaries & Constraints

**Always:**
- The L-rule computation on every 6.1-flagged dark [ASSUMPTION] (cream page/card, table
  border, row-hover, delta pair — the TOKENS.md flag list is the worklist): compute,
  correct or hold, RECORD the arithmetic in the ledger + clear the flags in
  DESIGN.md/TOKENS.md via the tokens generator (DESIGN.md frontmatter edits → `gen:tokens`
  + `gen` + `pnpm test` — the standing order).
- Engine: the dark-audit spec legs extend to the 9 v2 components' stories (both-theme
  renders already in the suite — this sweep adds the VERDICT legs: computed contrast on
  the actual story DOM, the 5.4 technique).
- The 6.1 constraint row's exception (delta-on-hover 4.039 §9 row) gets its dark-side
  computation recorded (delta pair vs #FFFFFF1A composite — the ledger documents, the
  §9 row text unchanged).
- Deliverable: ledger rows ×9 + the [ASSUMPTION] dispositions; token changes (if any) via
  the generator only; baselines re-taken IF a dark value changes (the 1.5% rule honored —
  explicit deletes for moved dark baselines).

**Never:**
- No hand-edits to generated token dist; no new tokens (value CORRECTIONS within the
  flagged set only); no theme branches in components; no §9/§4 text changes; the
  delta-semantic decision (6.1) stays closed.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| L-rule | each flagged dark value | correct-or-hold with arithmetic in ledger | — |
| Engine | 9 v2 stories dark | verdict legs green (computed contrast) | fail → value fix via generator |
| Ledger | 28 components | rows complete | — |
| Baselines | dark value changed | re-take via update flow (explicit deletes below 1.5%) | — |

## Tasks & Acceptance

- [ ] L-rule dispositions for every 6.1 [ASSUMPTION]; flags cleared in DESIGN.md/TOKENS.md
- [ ] Dark-audit legs extended to the 9; ledger extended
- [ ] Full gates green (VISUAL SERIALIZED; tokens via generator); spec closed; commit + push

**Acceptance Criteria:**
- Given TOKENS.md, when read after the story, then zero open v2 dark [ASSUMPTION] flags.
- Given the dark-audit legs, then all v2 stories pass computed-contrast verdicts.
- Given `pnpm gen:tokens && pnpm gen && pnpm test`, then green, zero drift.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

- **ERRATUM (2026-09-25, inherited from the 6.4 lens W1 — frozen block NOT modified):**
  line 45 cites «delta-on-hover 4.039 §9 row». The §9 row was corrected on 2026-09-25:
  the dark-side hover composite pin is delta-NEGATIVE **3.382:1** on #313131
  (`tests/contrast.test.ts:282` — the FAILING dark leg this sweep's verdict legs must
  confirm); dark positive PASSES at 4.883 (:284); 4.039 was the surface-FIELD pin, not
  the hover surface. The sweep's deliverable is unchanged — read «the §9 row's dark-side
  computation» as 3.382 (negative leg).

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
