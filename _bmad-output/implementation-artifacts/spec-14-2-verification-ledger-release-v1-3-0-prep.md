---
title: 'Story 14.2 — verification ledger + release v1.3.0 PREP'
type: 'feature'
created: '2026-09-27'
status: 'approved'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 2
baseline_commit: '4044a3b'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v4.md (Story 14.2 — the epic-close deliverable; "RELEASE.md §9 flow re-used verbatim: gates → tag v1.3.0 (maintainer-only) → fresh-clone consumer check"; tag stays maintainer-gated)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-11-3-verification-ledger-release-v1-2-0-prep.md (the DIRECT mold — 14.2 is its v1.3.0 rerun at v1.2.0..HEAD scope)'
  - '{project-root}/.playwright-cli/verify/fidelity-verification-v2/ledger.md + fidelity-verification-v1-2-0/ (the prior ledgers — unchanged components point at their rows, never re-rowed)'
  - '{project-root}/.playwright-cli/captures-v3/admin/ (THE reference pack of this cycle — 8 PII-redacted surfaces, INDEX.md + probe-notes.md; pixels ground truth, geometry vision-estimated ±)'
  - '{project-root}/.playwright-cli/verify/a11y-sweep/SR-RUNSHEET-v1.2.0.md (the run-sheet mold 14.2 re-targets at the v1.3.0 surface set)'
  - '{project-root}/_bmad-output/implementation-artifacts/baseline-review-package.md (the package this story extends with ЧАСТЬ v1.3.0)'
  - '{project-root}/RELEASE.md (§9 = the v1.2.0 mold whose FLOW epics-v4 reuses verbatim; §8.4 fresh-clone recipe self-sufficient)'
  - '{project-root}/HANDOFF.md (the epics-v4 close row this story writes)'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md (open flags carried into the maintainer queue)'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** epics-v4 ends without the v1.3.0 verification ledger (the
12.1–14.1 surfaces are reference-re-grounded nowhere — this cycle's
reference is the admin pack), without the maintainer's baseline batch for
the v1.3.0-era additions and re-takes, without the v1.3.0 SR run-sheet,
and without the v1.3.0 release flow — the epic's closing deliverable (the
TAG itself stays maintainer-gated, the standing governance).

**Approach:** the 11.3 mold rerun at v1.3.0 scope, EVERYTHING diff-scoped
to `v1.2.0..HEAD` (the release base; MEASURED moved set: **badge** —
variants union + the hooks family; **tabs** — `indicator="underline"`;
**progress-bar** — the height hook; the two v2 pattern pages **Console
chrome** + **Data surfaces**; the five showcase story-id RENAMES (12.1 —
zero pixel moves); docs index/theming updates (14.1). The 2-line
cross-link comments elsewhere are NOT surface moves.)

1. **Fidelity ledger** `fidelity-verification-v1-3-0/`: rows
   reference-grounded on `captures-v3/admin/` — badge neutral/attention vs
   the table-toolbar status pill + payments-hub red count + the gray tab
   digits; tabs underline vs the console secondary tab rows; progress-bar
   heights vs the admin-limits thin bars; the pattern pages vs
   admin-main-fullpage/mega/table-toolbar/limits/payments-hub with the
   HONEST classification (composition / pattern-consistency,
   vision-estimated geometry — never dressed as pixel fidelity; the
   recorded deltas repeated: gray-fill button, filter-chips count, «…»
   popovers, bare-bar naming); rename rows point at the v2/v1.2.0 rows
   (nothing re-measured). UNCHANGED components: pointer to prior ledgers.
2. **Yellow-discipline audit extension** (the v1/v2 methodology verbatim,
   scoped to the v1.2.0..HEAD surfaces): the special interest is the
   console pages — the pack's own discipline (yellow ONLY as the 2px
   selection outline, the progress fill, the logo tile — never a button
   fill; mega panel monochrome) vs what the kit renders; verdicts per
   surface, 0 violations target.
3. **Kit-wide impeccable pass** at current scope (the Stop-hook detector
   class, full repo scope; findings = blockers, fixed in this story).
4. **Baseline batch PREP**: `baseline-review-package.md` gains ЧАСТЬ
   v1.3.0 — inventory MEASURED at this head (suite PNGs, per-component
   extras, unit + visual totals), the re-take/addition register since
   v1.2.0 with forensic one-liners (12.1: 10 git-mv renames, bytes
   unchanged; 13.2: tabs-console + console-chrome additions; 13.3: 12
   additions/regenerations; 14.1: 14 regenerations), per-epic inventory,
   a ~1h review order. REVIEW PACKAGE only — the maintainer ratifies.
5. **SR-RUNSHEET-v1.3.0.md** (the v1.2.0 mold): URL blocks for the
   v1.3.0 surface set (tabs console story, badge console-tones,
   progress-bar thin-bars, console-chrome Демо, data-surfaces Платежи +
   Прогресс), expected announcements pulled from the protocol tables
   14.1 wrote, Результат rows EMPTY — execution stays maintainer-side.
6. **RELEASE.md §10 «Релиз v1.3.0»** (RU, the §9 mold verbatim in
   structure): pre-flight gates; version + CHANGELOG draft (the v1.3.0
   story list measured from the closed specs 12.1–14.2; three
   package.json 1.2.0 → 1.3.0 as MAINTAINER steps); §10.3 tag commands
   (MAINTAINER the sole executor); §10.4 fresh-clone recipe rendering one
   v1.3.0-surface component via the React wrapper (tk-badge
   variant=attention); fonts/legal; §10.7 proof-of-nothing-executed.
7. **HANDOFF.md** closes epics-v4 (state row + maintainer queue:
   (a) batch-confirm ЧАСТЬ v1.3.0 → (b) release §10.1–10.5 → (c)
   SR-RUNSHEET-v1.3.0 execution → (d) opportunistic spot-checks: iOS
   momentum-scroll, avatar-menu/kebab open-state capture).

**The run STOPS at the prep: no tag, no publish, no version bumps —
maintainer-only (IRON RULE).**

## Boundaries & Constraints

**Always:** diff-scope MEASURED from `git diff v1.2.0..HEAD` (the
numstat filter already run at draft time: badge/tabs/progress-bar +
pages + renames; re-verify at execution head); every count in the batch
package MEASURED (PNG totals by `ls`, test totals by suite runs); final
full gates + CI green at the prep head; spec closed; conventional commit
EN by explicit pathspec.

**Never:** NO `git tag` (v1.3.0 = the maintainer's explicit act; npm
never; tags = salacoste only); no publish; no private:false; no
package.json version edits; no CHANGELOG.md edits (the draft lives in
RELEASE §10.5); no baseline deletions outside the 1.5% rule; no
reopening settled stories; PII never transcribed (the admin pack stays
redacted; ledger rows cite pack files, not values from the session).

## Tasks & Acceptance

1. **Fidelity ledger** (docs). AC: `fidelity-verification-v1-3-0/` rows
   cover the measured moved set; every row cites its pack PNG + verify
   pointer + deviation count + open flags; pattern pages carry the
   composition classification; renames are pointer rows; the docs-side
   moves (index/theming/search/getting-started texts) are NOT ledger rows
   — they are not reference-grounded component surfaces (recorded in the
   ledger's scope note instead).
2. **Yellow-discipline audit** (docs+code if violations). AC: verdicts
   for every v1.2.0..HEAD surface; the console-pages leg recorded; 0
   open violations (found → fixed here + baseline per rule).
3. **Impeccable pass** (code). AC: full-scope audit run; blockers fixed;
   clean re-run.
4. **Batch PREP** (docs). AC: ЧАСТЬ v1.3.0 appended — inventory +
   register + per-epic inventory + review order; nothing confirmed.
5. **SR-RUNSHEET-v1.3.0.md** (docs). AC: the v1.2.0 file structure; the
   v1.3.0 URL set; Результат rows empty.
6. **RELEASE.md §10** (docs). AC: §10.1–10.7 on the §9 mold; tag steps
   marked MAINTAINER; §10.7 lists everything NOT executed.
7. **HANDOFF close** (docs). AC: epics-v4 row + the (a)–(d) queue; open
   flags from deferred-work.md carried.
8. **Ledger** (spec). AC: Change Log + Verification honest; final gates
   green; CI verdict recorded by run id only after it exists.

## Implementation Notes

- Sequencing: AFTER 14.1's CI verdict (run 36347702653) — the prep head
  must be the CI-green head.
- The ledger's badge row carries the AA numbers (5.17:1 / 6.179:1) as
  KIT-side facts; the pack's raw values appear only as the recorded
  extraction-note anchors (DESIGN.md discipline, hex-free in docs pages —
  the guard's scope).
- RELEASE §10.4 fresh-clone: the §8.4/9.4 recipe verbatim; the rendered
  surface swaps to a v1.3.0 one (badge attention via @tinkoff-ui/react).
- CHANGELOG draft story list (measured from specs): 12.1 per-vertical
  docs restructure; 12.2 capture packs v3 + INDEX convention; 13.1 admin
  gap map + pack; 13.2 tabs underline + console-chrome page; 13.3 badge
  neutral/attention + hooks + progress height + data-surfaces page;
  14.1 Group VII sweep + docs completion; 14.2 this ledger/prep.

## Spec Change Log

1. 2026-09-27 — initial draft (autonomous round; epics-v4 Story 14.2;
   the 11.3 mold at v1.3.0 scope; moved set pre-measured via numstat).
2. 2026-09-27 — quick-review lens round 1: **NEEDS-FIX** (one finding),
   folded: Task 1 AC ambiguity — "rows cover the measured moved set"
   could read as rowing the DOCS moves; made explicit that
   index/theming/search/getting-started texts are NOT ledger rows (scope
   note instead). Verified en passant: the three versioned package.json
   are components/react/tokens at 1.2.0 (root 0.1.0 and docs 0.0.0 stay
   out of the bump). Re-verdict: **APPROVED**. Status → approved,
   lenses_ran ['quick'], iteration 2.

## Verification

(filled at execution)
