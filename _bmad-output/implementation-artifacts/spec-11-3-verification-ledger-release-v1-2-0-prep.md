---
title: 'Story 11.3 — verification ledger + release v1.2.0 PREP'
type: 'feature'
created: '2026-09-26'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'b7c3c17'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v3.md (Story 11.3 — the epic-close deliverable; tag stays maintainer-gated)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-8-4-ledger-release-prep.md (the DIRECT mold: ledger + yellow audit + impeccable + batch PREP + RELEASE §8 + HANDOFF close — 11.3 is its v1.2.0 rerun)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-6-verification.md (the ledger/batch origin mold)'
  - '{project-root}/_bmad-output/implementation-artifacts/baseline-review-package.md (the package this story extends with ЧАСТЬ v1.2.0)'
  - '{project-root}/.playwright-cli/verify/fidelity-verification-v2/ledger.md (the 25-row v1.1.0 ledger — v1.2.0 rows carry ITS deltas forward)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md (created at 11.1; the maintainer queue POINTS at it — this story does not execute SR)'
  - '{project-root}/RELEASE.md (§8 = the v1.1.0 mold §9 reuses verbatim; §8.4 fresh-clone recipe now self-sufficient — README + getting-started both carry the vite-dedupe lines)'
  - '{project-root}/HANDOFF.md (the v2 close row this story's epics-v3 row extends)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (open flags to carry into the maintainer queue: iOS momentum-scroll, cookie 16px-inset re-measure)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** epics-v3 ends without the v1.2.0 verification ledger (the 9.1–11.2
surface changes are reference-re-grounded nowhere), without the maintainer's
baseline batch for the v1.2.0-era re-takes and additions, and without the
v1.2.0 release flow — the epic's closing deliverable (the TAG itself stays
maintainer-gated, the standing governance).

**Approach:** the 5.6/8.4 molds rerun at v1.2.0 scope, EVERYTHING
diff-scoped to `v1.1.0..HEAD` (the release base): the fidelity ledger rows
WHERE REFERENCE-GROUNDED (the epics text's own two: the stepper brown badge
vs the 9.1 probes; the business bento radius vs the 9.1 arc-staircase
REFUTATION — plus every other v1.2.0-touched component whose row the diff
moves: promo-card art-mode, qr-block page-copy, input/segmented-radio
sr-only, checkbox error, stepper subtitle, button href), the
yellow-discipline audit extension (surfaces touched since v1.1.0), the
kit-wide impeccable pass, the baseline batch PREP package extended for the
maintainer's confirmation gate, and RELEASE.md §9 written on the §8 mold.
**The run STOPS at the prep: no tag, no publish — maintainer-only (IRON
RULE).**

## Boundaries & Constraints

**Always:**
- Ledger: a `fidelity-verification-v1-2-0/` verify dir whose rows cover
  EVERY component whose pixels/API moved in `v1.1.0..HEAD` (executor
  MEASURES the set from the diff + the re-take forensics; each row:
  component, reference source capture, verify dir pointer, deviation count,
  open flags); derived/pattern-consistency surfaces keep their honest
  classifications carried from the v2 ledger — never dressed as pixel
  fidelity; UN-CHANGED components are NOT re-rowed (pointer to the v2 row).
- Yellow-discipline audit extension: the v1/v2 methodology verbatim
  (tokens → mechanical grep over the `v1.1.0..HEAD` diff surfaces →
  classification → verdicts → ink-on-yellow spot proofs).
- Kit-wide impeccable deep pass at current scope (the Stop-hook detector
  class at full repo scope; findings = blockers, fixed in this story).
- Baseline batch PREP: `baseline-review-package.md` gains ЧАСТЬ v1.2.0 —
  inventory (PNG + test counts MEASURED at this head: suite PNGs, per-
  component extras, unit + visual totals), the re-take register since
  v1.1.0 with forensic one-liners (git-log over the snapshot dir; 9.1
  baseline round, 10.x additions + re-takes, 11.1 +12 legs, 11.2 36+2
  mono re-takes + the 36 mono-pin re-takes), per-epic inventory, a ~1h
  review order. REVIEW PACKAGE only — the maintainer's gate ratifies.
- RELEASE.md «Релиз v1.2.0» §9.1–9.7 (RU, the §8 mold verbatim in
  structure): pre-flight gates; version + CHANGELOG (three package.json
  1.1.0 → 1.2.0 as maintainer steps; changelog draft = the v1.2.0 story
  list measured from the closed specs 9.1–11.2); §9.3 tag commands
  (MAINTAINER the sole executor); §9.4 fresh-clone recipe — NOW
  SELF-SUFFICIENT (README + getting-started both carry the vite-dedupe
  lines; no caveat) rendering one v1.2.0-surface component via the React
  wrapper; §9.6 fonts/legal + the JetBrains Mono TEST-ONLY note (a harness
  devDependency, not a shipped font asset — the 9.1 token ruling
  untouched); §9.7 proof-of-nothing-executed.
- HANDOFF.md closes epics-v3 (state table row + maintainer queue:
  (a) batch-confirm ЧАСТЬ v1.2.0 → (b) release §9.1–9.5 → (c) SR-RUNSHEET-
  v1.2.0 execution (the file 11.1 wrote — point, do not rewrite) →
  (d) opportunistic spot-checks: iOS momentum-scroll, cookie 16px-inset
  re-measure).
- Final full gates + CI green at the prep head; spec closed; conventional
  commit EN.

**Never:**
- **NO `git tag` — v1.2.0 is the maintainer's explicit act (IRON RULE: npm
  never; tags = salacoste only).** No publish; no private:false; no
  package.json version edits (the bump is a maintainer release step); no
  CHANGELOG.md edits (the draft lives in RELEASE §9.5); no baseline
  deletions outside the 1.5% rule; no reopening settled stories — this
  story RECORDS, it does not re-litigate.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Ledger rows | components moved in v1.1.0..HEAD (MEASURED) | row each, valid pointers, honest classification | set measured, never assumed |
| Brown-badge row | 9.1 probes (stepper + tokens-9-1) | ADOPTED disposition + AA numbers carried | — |
| Bento-radius row | 9.1 arc-staircase refutation (r=23.8) | row records REFUTED-estimate fact | — |
| Yellow audit | diff-scoped surfaces | verdicts per surface, 0 violations target | violation → fixed here |
| impeccable | kit-wide, current scope | zero blockers | finding → fixed here |
| Batch PREP | PNG/test inventory + re-take register | maintainer-reviewable package | counts MEASURED |
| RELEASE §9 | the §8 mold | checklist ready, nothing executed | — |
| HANDOFF | epics-v3 close | queue (a)–(d) coherent | — |
| Release safety | repo at close | tags = v1.0.0, v1.1.0; packages at 1.1.0; CHANGELOG without [1.2.0] | any drift → STOP |
| Gates | final | green + CI by `gh run` | — |

## Tasks & Acceptance

- [ ] Ledger + yellow audit + impeccable pass (fixes if any) — all sets
      diff-measured, never assumed
- [ ] Baseline batch PREP ЧАСТЬ v1.2.0 + RELEASE.md §9.1–9.7 + HANDOFF
      epics-v3 close
- [ ] Final full gates + CI green at the prep head; spec closed; commit +
      push (NO TAG)

**Acceptance Criteria:**
- Given the ledger, when audited, then every v1.2.0-moved component has a
  row with valid evidence pointers and honest fidelity/derived
  classification, and the two epics-named re-checks (brown badge, bento
  radius) are resolved against their 9.1 probes.
- Given the batch package, when the maintainer opens it, then every
  v1.2.0-era re-take/addition is reviewable in the 5.6 format with a ~1h
  order.
- Given RELEASE.md §9, when followed, then the maintainer can execute
  v1.2.0 gates → tag → fresh-clone verification without consulting any
  other doc, and §9.4 needs no dedupe caveat.
- Given the repo state at close, then gates + CI green, tags = v1.0.0 +
  v1.1.0 only, package versions unchanged at 1.1.0, and CHANGELOG carries
  no [1.2.0] (the maintainer's gate is the only path to v1.2.0).

</frozen-after-approval>

## Code Map

- `.playwright-cli/verify/fidelity-verification-v1-2-0/` — ledger.md
  (+ yellow-audit.md, impeccable-run.md siblings — the 8.4 verify-trio
  shape)
- `_bmad-output/implementation-artifacts/baseline-review-package.md` —
  ЧАСТЬ v1.2.0 appended
- `RELEASE.md` — «Релиз v1.2.0» §9.1–9.7 appended (RU)
- `HANDOFF.md` — epics-v3 close row + maintainer queue
- (docs-only story — ZERO edits under packages/*/src, tests/, tokens)

## Implementation Notes

(post-execution)

## Spec Change Log

(post-execution)

## Review Triage Log

(post-review)

## Verification

(post-gates)
