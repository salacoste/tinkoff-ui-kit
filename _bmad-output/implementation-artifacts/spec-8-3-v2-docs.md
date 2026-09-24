---
title: 'Story 8.3 — v2 docs completion (9 pages + registers surface)'
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
  - '{project-root}/_bmad-output/planning-artifacts/epics-v2.md (Story 8.3)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-5-*.md (THE docs mold — page structure, CEM tables)'
  - '{project-root}/packages/docs/src/ (getting-started, theming-guide, token-reference — the existing surfaces)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The nine v2 components have no docs pages, and the 6.1 register mappings
(marketing h1→heading-2 etc.) + v2 tokens are documented only in TOKENS.md — the consumer
surface lags the kit.

**Approach:** The 5.5 mold VERBATIM: nine component pages in `packages/docs` (API tables
from CEM auto-import, usage examples, theming notes, a11y incl. the SR-protocol sections),
the REGISTERS documentation surface (the mapping table rendered on the token-reference
page), and the token reference auto-gains the v2 tokens (generator-driven, zero hand
rows).

## Boundaries & Constraints

**Always:**
- Pages: filter-chips, pagination, combobox-search, mega-nav (the navbar page EXTENDS —
  the two-deep section), data-table, cookie-banner, stepper, store-badges, qr-block —
  the 5.5 page anatomy (what/when/not-for, API table from CEM, examples RU, theming, a11y
  notes + SR protocol, composition pointers to the showcase stories for the 6.5/7.4/7.5
  clusters).
- Registers surface: the token-reference page gains the REGISTERS table (the 6.1 mapping
  rows — marketing h1→heading-2 / product h1→heading-3, the search/table/cream surface
  semantics, the delta AA-override note with its §9-hover exception pointer) — rendered
  from a single source (the TOKENS.md/register doc via the docs build, not a second
  hand-copy; if the docs build has no import path, a checked-in generated artifact with a
  drift guard — the AD-4 single-source lesson).
- Token reference: v2 tokens appear via the existing generator surface (verify; no hand
  rows).
- The deferred preview.ts canvas-bg consideration EXECUTES HERE (its revisit condition is
  "the next docs-story work that touches canvas painting"): weigh one preview-level
  theme-aware rule vs the per-story copies; DECIDE and record (either is sanctioned —
  the ledger note is the deliverable).
- Consumer gotchas carried: cookie-banner storage-is-consumer's pattern; data-table
  keyboard contract; combobox-search query-never-emits; store-badge art-is-consumer's.

**Never:**
- No component source changes (docs only; a component gap found = REPORT); no new tokens;
  no hand-maintained token tables (generator or guarded artifact); no RU/EN mixups
  (docs pages RU like v1, code/meta EN).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error Handling |
|----------|--------------|-----------------|----------------|
| Pages | 9 v2 components | 5.5-anatomy pages, CEM tables live | — |
| Navbar page | mega-nav section | the extension documented (subLinks contract) | — |
| Registers | token-reference | the mapping table renders, single-source | — |
| Token ref | v2 tokens | present via generator | — |
| Canvas bg | preview.ts decision | made + recorded (the debt's revisit condition) | — |

## Tasks & Acceptance

- [ ] 9 docs pages (+ navbar extension section); registers table; token ref verified
- [ ] preview.ts canvas-bg decision recorded
- [ ] Full gates green (VISUAL SERIALIZED — docs stories baseline too); spec closed; commit + push

**Acceptance Criteria:**
- Given the docs build, when opened, then all 9 v2 pages render with live CEM tables.
- Given the registers table, when the token layer changes, then it cannot drift silently.
- Given the gates, then green.

## Implementation Notes

(to be filled by the executor / triage)

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

(to be filled at quick-review)

## Verification

(to be filled at gate run)
