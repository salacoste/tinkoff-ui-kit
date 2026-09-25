---
title: 'Story 8.4 — v2 verification ledger + release v1.1.0 PREP'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'b05613d (worktree, base aa9780f; 83f2b7e + b05613d) → FAST-FORWARD merge into main'
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

**Executor round (worktree → b05613d: 83f2b7e verify-trio + batch package, b05613d
RELEASE + HANDOFF; 6 .md files +571/−25, ZERO source changes — merged FAST-FORWARD):**

- **Fidelity ledger 25 rows** — `.playwright-cli/verify/fidelity-verification-v2/ledger.md`:
  16 v1 rows CARRIED with v2-era deltas (select: 10 re-takes at 256e5cf; navbar: 7.1
  extension + the api pair re-taken twice) + 9 v2 rows (capture paths, verify dirs,
  deviation counts, open flags). **58 documented intentional deviations**
  (4+7+5+9+7+11+5+5+5 — lens re-added and row-by-row verified against every NOTES
  registry). Honesty classifications recorded AS SUCH: combobox-search = HYBRID (field
  reference-grounded / menu pattern-consistency — the capture has the menu CLOSED, no
  menu reference exists); qr-block tab-strip = pattern-consistency (tk-tabs verbatim).
  Open flags carried: stepper brown token, cookie 16px-inset house judgment, qr-block
  page-copy slot.
- **Yellow-discipline audit** — `yellow-audit.md`, the v1 methodology verbatim (tokens →
  mechanical grep → classification → 13 verdicts → ink-on-yellow): 65 hits / 29 files,
  exactly ONE raw-hex outside the token list (a comment, thumbnail-picker.css.ts:13);
  partners verified at pagination.css.ts:145-148 (700 weight + ink-300 + aria-current,
  probe 9.3:1), filter-chips.css.ts:111 (border 1→2px), cookie-banner.stories.ts:325-326
  (A5 demo ink pair). **0 violations → 0 fixes. All 13 surfaces PASS.**
- **Impeccable kit-wide** — `impeccable-run.md`: detector exit 0 over 207 files (5 roots,
  wider than the CI diff-scan); the lens INDEPENDENTLY re-ran the detector (exit 0) and
  reproduced the can-fail probe (bounce-easing injection → exit 2; `color:#333` → exit 0);
  the single sanctioned ignore unchanged (ratified 2026-09-23, RELEASE.md §0). Deep sweep
  7 classes: TODO/FIXME = 0; console = 3 `console.log` demo handlers (the 15 runtime
  `console.warn` = the kit's sanctioned error channel, out of scope by design); dead code,
  commented-out code, stale numbers, evidence-path validity, jsdoc 27/27 — **zero
  blockers, zero fixes needed.**
- **Baseline batch PREP package** — `baseline-review-package.md` ЧАСТЬ v2: inventory
  **414 PNG / 1368 tests** (392 visual-suite + 22 per-component; 274 v1 + 140 v2 — lens
  recounted both splits); re-takes with forensic one-liners: **R-14** (256e5cf),
  **R-2** (d7c36d6 mega-nav--page +41px), **R-2′** (c999e12 token-reference--colors ×2 —
  an EXTRA adjudicated re-take the executor found beyond the brief's «14+2», marked
  separately) = 16 + 2; per-epic inventory; a ~1h review order. REVIEW PACKAGE only —
  the story gate NOT executed.
- **RELEASE.md «Релиз v1.1.0» §8.1–8.7 (RU)** — pre-flight gates; version + CHANGELOG per
  the §2 precedent; §8.3 tag commands (MAINTAINER the sole executor); §8.4 fresh-clone
  recipe rendering tk-data-table via the React wrapper (import pattern verified 1:1
  against README by the lens; props vs the real API); §8.5 changelog draft — **14 EN
  lines, all 14 v2 stories**; §8.6 fonts/legal; §8.7 proof-of-nothing-executed.
  **PROOF: `git tag -l` = only v1.0.0; all three package.json at 1.0.0; CHANGELOG has
  no [1.1.0].**
- **HANDOFF v2 close** — v2 row ✅ 14/14 (2026-09-25) with totals 881 + 1368 ×2, 414 PNG,
  16 re-takes; maintainer queue (a) batch-confirm ЧАСТЬ v2 → (b) release §8.1–8.5 →
  (c) SR spot-checks v2 + iOS momentum-scroll → (d) brown token decision; file map
  extended (fidelity-verification-v2, RELEASE §8); test:visual counter 921→1368.
- Executor self-caught: an empty `logs/` subdir removed (untracked; runs recorded inline);
  the 2761-char HANDOFF v2 row replaced via exact-prefix python edit (worktree-safe);
  R-2′ discovered and included (above).

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

**Lens qr-lens-8-4 (2026-09-25, read-only pass on worktree @ b05613d): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / 5 notes (dispositions below).**

All claim-groups CONFIRMED (worktree-relative cites):
- Lineage: exactly 2 commits (83f2b7e +373/−2, b05613d +198/−23), merge-base aa9780f;
  the total diff = ONLY 6 .md files (the verify trio, HANDOFF, RELEASE, the batch
  package) — ZERO changes under packages/*/src and tests/*.ts (docs-only held hard);
  tree clean bitwise (changed files + package.json ×4 + playwright.config.ts + CHANGELOG
  vs HEAD blobs); not pushed (origin/main = aa9780f); tags = only v1.0.0.
- Ledger: 25 = 16+9 structure; ALL 9 v2 verify-dirs exist; deviation counters verified
  ROW-BY-ROW against every NOTES registry (the two «one less than the registry» rows are
  honest — the registries explicitly mark their last items «NOT a deviation» /
  «kit surface, not a deviation»); 58 re-added = exact; the HYBRID and
  pattern-consistency classifications verbatim (rows :19, :72–79) — no pixel-fidelity
  claim anywhere it isn't earned.
- Yellow audit: the v1 grep command re-run by the lens — 65 hits; raw-hex sweep = exactly
  1 (the thumbnail-picker comment); the cited partner sites opened and hold
  (pagination.css.ts:145-148, filter-chips.css.ts:111, cookie-banner.stories.ts:325-326).
- Impeccable: the lens RE-RAN the detector itself — exit 0, empty output, 207-file scope
  reproduced (find|wc); the can-fail probe independently reproduced in /tmp (bounce-easing
  → exit 2 with the named blocker; color:#333 → exit 0); config = exactly one
  ignoreValues, ignoreRules/ignoreFiles empty; ratification 2026-09-23 confirmed in
  RELEASE.md §0.
- Batch package: 414 recounted both ways (392+22; 274+140); `git show --stat` re-takes =
  256e5cf ×14, d7c36d6 ×2, c999e12 = token-reference--colors ×2 (Bin a→b) — the R-2′
  claim exact.
- RELEASE §8: RU; tag commands maintainer-framed; §8.4 import pattern 1:1 with README
  (tokens.css → pillkit-components → named pillkit-react import; DataTable export chain
  verified; recipe props match the real API); §8.5 = 14 lines / all 14 stories; PROOF
  verified (tag list, three package.json 1.0.0 — root 0.1.0 outside the release
  contract, CHANGELOG clean).
- HANDOFF close: ✅ 14/14 row, queue (a)–(d), 921→1368 counter, coherent with the v1
  row's deltas (645→881, 921→1368).
- Gates re-run by the lens in the worktree: vitest **881** (15+667+70+129), tsc clean,
  eslint clean; plus a STATIC `playwright --list` = «1368 tests in 21 files».

Notes + dispositions:
- **N1 (yellow-audit Step 2 said «28 files»; the lens's identical-tree rerun counts 29 —
  hit count exact, file count off by one)** → FIXED in-window (29).
- **N2 (ledger cited the business-landing registry as NOTES:87–117; actual 87–105 —
  count 15 correct, endpoint drifted)** → FIXED in-window (87–105).
- **N3 (B4 cited pagination.css.ts:146 / «146–148»; the selector sits on :145 — content
  fully correct)** → FIXED in-window (:145, 145–148).
- **N4 (impeccable's «console = 3 hits» counts only console.log; 15 runtime console.warn
  are the kit's sanctioned error channel — wording could mislead)** → FIXED in-window
  (wording explicit: warn channel out of scope by design).
- **N5 (A5 short-filename citation resolves to packages/components/src/...stories.ts —
  the audit correct; the briefing's packages/docs/ variant is a different 179-line
  file)** → accepted (audit already correct; no edit).

**Orchestrator disposition: NO WARN/BLOCKER fix round — four note-level citation/wording
fixes applied in-window; merged as-is (FAST-FORWARD b05613d).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor + lens re-run) | build/test/lint/typecheck/gen/gen:tokens GREEN; units **881/881** (15+667+70+129); tsc + eslint clean (re-run by the lens); post-commit drift clean |
| Worktree visual (executor) | **1368/1368 ×2 (8.2m each) on private port 6061** — zero pixel diffs; temp config deleted pre-commit; the lens statically confirmed `--list` = 1368 in 21 files |
| Merge | b05613d FAST-FORWARD into main (linear; no conflicts) |
| Main gates (8.4-merged) | build/test/lint/typecheck/gen/gen:tokens GREEN (root 129/129); post-commit drift clean |
| Main visual | **INHERITED, materially proven:** `git diff --exit-code -- packages/ tests/` vs aa9780f = CLEAN (bit-identical served tree) — the 8.2-close main ×2 (**1368/1368 ×2, port 6041**) stands for this HEAD; the story's diff is 6 .md files outside the served surface |
| Docs-only discipline | The full range aa9780f..b05613d touches ZERO files under packages/ or tests/ (both executor diffstat and orchestrator merge diffstat) |
| Release safety | `git tag -l` = only v1.0.0; three package.json at 1.0.0; CHANGELOG without [1.1.0] — the maintainer gate INTACT |
| Spec closed | 2026-09-25 — see commits: b05613d (ff-merge), close commit |
