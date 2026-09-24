---
title: 'Story 8.4 — v2 verification ledger + release v1.1.0 PREP'
type: 'feature'
created: '2026-09-24'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: []
review_loop_iteration: 0
baseline_commit: '(set at close — the final v2 story)'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 8.4)'
  - '{project-root}/_bmad-output/implementation-artifacts/{spec-5-6-*,spec-5-7-*}.md (baseline-package + release-prep molds)'
  - '{project-root}/RELEASE.md (the RU release checklist — extended here, executed by the maintainer)'
  - '{project-root}/_bmad-output/implementation-artifacts/baseline-review-package.md (the v1 package this extends)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** v2 ends without the verification ledger, the maintainer's baseline batch for
the 25 new baseline sets, and the v1.1.0 release flow — the epics' closing deliverable
(the TAG itself stays maintainer-gated, the standing governance).

**Approach:** The 5.6/5.7 molds: the 16+9 fidelity ledger rows (v2 rows reference-grounded
per component; derived surfaces — combobox-from-Select — carry pattern-consistency rows),
the yellow-discipline audit extension, kit-wide impeccable pass, the baseline batch PREP
package extended for the maintainer's 8.4 confirmation gate, and RELEASE.md v1.1.0 flow
written. **The run STOPS at the prep: no tag, no publish — maintainer-only (IRON RULE).**

## Boundaries & Constraints

**Always:**
- Ledger: 16+9 fidelity rows complete (each row: component, reference source capture,
  verify dir pointer, deviation count, open flags) — pattern-consistency rows for derived
  surfaces documented AS SUCH (never dressed as pixel fidelity).
- Yellow-discipline audit extension (yellow = chrome accents only — the v1 audit's v2
  legs: the nine + the three compositions).
- Kit-wide impeccable deep pass (the Stop-hook detector class at full scope; findings =
  blockers, fixed in this story).
- Baseline batch PREP: the 5.6 package format extended with the v2 baseline sets (side-
  by-side composites + NOTES pointers per component) — a REVIEW PACKAGE for the
  maintainer, not a confirmation (their explicit gate ratifies; the batch lands only
  after).
- RELEASE.md v1.1.0 section: the tag flow (git tag v1.1.0 + push, the fresh-clone
  consumer recipe to a v2 component rendering), the changelog draft (v2 story list from
  the closed specs), the fonts/legal reminder block — ALL as a CHECKLIST for the
  maintainer; nothing auto-executed.
- Final full gates + CI green at the prep commit; HANDOFF.md closes v2 (state table +
  maintainer queue: the batch, the tag, NVDA/iOS spot-checks).

**Never:**
- **NO `git tag` — the release tag is the maintainer's explicit act (IRON RULE: npm never;
  tags = salacoste only).** No publish of any kind; no private:false; no baseline
  deletions outside the 1.5% rule; no reopening settled stories — this story RECORDS,
  it does not re-litigate.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Ledger | 25 rows | complete, pointers valid | — |
| Yellow audit | v2 legs | verdicts per surface | — |
| impeccable | kit-wide | zero blockers | finding → fixed here |
| Batch prep | package extended | maintainer-reviewable | — |
| RELEASE.md | v1.1.0 section | checklist ready, nothing executed | — |
| Gates | final | green + CI | — |

## Tasks & Acceptance

- [ ] Ledger + yellow audit + impeccable pass (fixes if any)
- [ ] Baseline batch PREP package extended; RELEASE.md v1.1.0 flow; HANDOFF v2 close
- [ ] Final full gates + CI green; spec closed; commit + push (NO TAG)

**Acceptance Criteria:**
- Given the ledger, when audited, then every v2 component has a row with valid evidence
  pointers and honest fidelity/derived classification.
- Given the batch package, when the maintainer opens it, then every v2 baseline set is
  reviewable in the 5.6 format.
- Given the repo state at close, then gates + CI green and NO tag exists (the maintainer's
  gate is the only path to v1.1.0).

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
