---
title: 'Story 8.1 — v2 a11y sweep (the 5.1 method on the nine)'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '8a2e5a9 + cd00449 (worktree, base 6104850) → merge 037699d + baseline re-take 256e5cf'
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

**Executor round (worktree → 8a2e5a9 + fix cd00449; merge 037699d):**

- **The sweep: 54/54 cells (9 × 6) — every cell PASS.** Recorded rulings (not violations):
  cookie-banner Esc-no-dismiss (7.2 ruling, re-pinned by a live targeted leg); navbar
  sublink-shrink stress-case (7.1 N4) as a ledger NOTE (kit-inherited v1 `.link` mold;
  all shipped stories ≥44px); stepper keyboard/ring N/A-by-construction (0 interactive
  surfaces, proven by test + a 0-stop walk); filter-chips contrast-via-non-color state
  (vision non-defect, NOTES.md:93). Ledger: `.playwright-cli/verify/a11y-sweep/group-V.md`
  (RU; the 4 group-IV rows re-equipped with engine evidence) + METHOD.md extension note.
- **Engine legs: 28 new, all green** — Group V registry in `tests/visual/a11y-sweep.spec.ts`
  (9 walks ×2 themes + 9 scans + 1 targeted cookie-accept leg); `ringAncestor` topology
  extension (data-table paints its ring on the whole `.row` — registry-declared,
  per-target); the cookie walk rides the variants story (top-layer playground is not
  forward-Tab-able at first-paint open — documented engine workaround, fundamentally a
  top-layer property).
- **F1 (7.1 N1 — the mechanical fix TAKEN):** `sub-label=""`/`burger-label=""` (incl.
  whitespace-only) fall back to «Разделы»/«Меню» across ALL THREE name sites (subnav nav,
  burger button, drawer dialog) + unit test + jsdoc (which grows navbar--api's CEM table —
  see the baseline note) + the 7.1 N3 argTypes polish.
- **F2 (deferred-work 6.3 N6 — EXECUTED kit-wide):** `:host([hidden]) { display: none }`
  on 23 sheets that lacked it; the NEW pattern test `tests/hidden-guard.test.ts` then
  found 5 MORE multi-sheet main-sheet gaps — **tk-modal rendered while `hidden`** (real
  latent defect on main); final state 33/33 sheets / 27 components, the test is a
  tripwire (a future guard-less component FAILS it).
- Units: **876** (main base 873 + 3). Worktree visual: 1297 legs (1269 + 28); run-2 =
  1283 pass / 14 mismatch → the 14 forensically proven (below), the 2 probeStop-broken
  legs fixed in cd00449 and re-run green on port 6051. ZERO PNGs touched in the worktree
  (the STOP was obeyed).
- **STOP-AND-REPORT resolved by the orchestrator — the 14 changed legs are LEGITIMATE,
  baselines re-taken on merged main (explicit flow, exactly-14 verification):**
  - **12 select-family legs** (6 stories ×2 themes: select --accessibility/--playground/
    --theming/--value-modes/--variants + showcase-application-form): the MAIN baseline
    had a RENDERING DEFECT baked into pixels — a stray band under every closed select
    (the menu panel's author `:host{display:block}` beat UA `[hidden]`; the very 6.2
    closed-panel finding). F2's guard REMOVES the defect; the pixel shift IS the fix.
  - **2 navbar--api legs** (+41px): the generated API table grew — the F1 jsdoc now
    documents the empty-fallback (custom-elements.json default cells). Intentional
    documentation growth.
  - Process: the re-take is the sanctioned defect-fix flow (NOT a sub-threshold
    auto-update); all 14 enter the 8.4 maintainer batch-confirm package like every
    other v2 baseline.
- Kit gaps REPORT-only (deferred-work candidates): top-layer forward-walk completeness
  (engine workaround documented; fundamental top-layer property); SR spot-checks stay
  protocol-only (maintainer-side, the 5.1 ruling). Three earlier gaps were FIXED in this
  story (closed-select layout occupancy; multi-sheet hidden gaps; ancestor-ring engine
  blindness) and are recorded as such.
- Executor's own process deviation, self-caught: `page.evaluate(() => probeStop())`
  wrapper bug (ReferenceError in 2 legs, runs 1-2) — fixed in cd00449, both legs green.

## Spec Change Log

(none — frozen block as approved)

## Review Triage Log

**Lens qr-lens-8-1 (2026-09-25, read-only pass on worktree @ cd00449): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / 4 notes (dispositions below).**

All eight claim-groups verified with cites; the lens re-ran units (876/876 green =
15+667/29+70+124), tsc, eslint — all clean; the worktree filesystem verified
byte-identical to its commits (only untracked dist/.claude/.omc). Lineage exact:
6104850 → 8a2e5a9 → cd00449, zero PNGs in the diff (the STOP confirmed at commit level).

Key confirmations:
- Ledger group-V.md: 9 sections × 6 checks, every cell evidenced; rulings R1/R2 + stepper
  N/A + filter-chips vision non-defect recorded (:97, :134-135, :34).
- Engine: Group V registry a11y-sweep.spec.ts:104-118 (9 rows); walk loop :352-406 ×
  THEMES + scans :408 = 27 + the targeted cookie leg :709-744 = 28 legs; `ringAncestor`
  registry-declared (:75, :108, :201-206); the cookie walk's variants-story mount +
  top-layer rationale verified (:109-115).
- F1: fallback consts navbar.ts:437-438 applied at ALL THREE name sites (:465, :488,
  :511); the test covers empty-attr + whitespace-flip + explicit-override-wins
  (navbar.test.ts:861); the CEM diff carries the fallback jsdoc — the navbar--api +41px
  mechanism confirmed.
- F2: hidden-guard.test.ts enumerates EVERY src dir (readdirSync :66-75), guard-same-
  sheet :81-96, tripwires :47 (pin 33) and :113-128 (33 sheets / 27 components /
  6-doubled list); independent cross-grep: 27 css files guarded, 6 doubled as pinned.
- **The select stray-band mechanism fully reproduced from code (7a):** select.ts:348-363
  creates the panel with its OWN shadow root (`panel.hidden = true` :354 → false :448 →
  true :487); the base select.css.ts `selectMenuStyles` carried `:host { display: block }`
  (base :196-199) with NO guard → author origin beat UA `[hidden]` → the closed panel
  painted a stray band. Now guarded in BOTH sheets (tip :51, :220); select pinned as
  doubled in the roster (:121-128). The 12-story set correct — 5 live select stories ×2
  + application-form ×2; `--open-menu` (panel open) and `--api` (docs only) correctly
  absent. Arithmetic 1269+28=1297=1283+14 holds.

Notes + dispositions:
- **N1 (stale inner doc number: hidden-guard.test.ts:28 said «pinned sheet count (28)»
  while the actual pin is 33)** → FIXED in-window (comment trued to 33).
- **N2 (two ledger pointer offsets: group-V.md:75 cited data-table.test.ts:203/431,
  actual 211/439 — +8 both)** → FIXED in-window (pointers trued; bodies verified
  matching by the lens).
- **N3 («18 unguarded sheets» vs the commit's «23 patched» read as a discrepancy)** →
  FIXED in-window (arithmetic made explicit in F2: 18 first-pass + 5 found-by-test =
  23 patched; 33/33 total incl. 10 pre-guarded).
- **N4 (ledger prose EN with RU rows vs the spec's «RU notes»)** → accepted: matches the
  group I–IV ledger format (EN prose, RU quoted strings); format conformance over letter.

**Orchestrator disposition: NO WARN/BLOCKER fix round — note-level fixes in-window
(comment, 2 ledger pointers, F2 arithmetic); merged as-is (037699d).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor + lens re-run) | units 876/876 (15+667/29+70+124), tsc clean, eslint clean, gen/gen:tokens clean, post-commit drift clean |
| Worktree visual (executor) | 1297 legs: 1283 pass / 14 legitimate mismatches (STOP obeyed — zero PNG edits); the 2 probeStop legs fixed (cd00449) and re-run green, port 6051 |
| Merge | 037699d clean (components lane — no overlap with 8.3's docs lane) |
| Main gates (combined 8.1+8.3) | build/test/lint/typecheck/gen/gen:tokens GREEN; post-commit gen-drift CLEAN |
| Baseline re-take | 256e5cf: scoped --update on merged main → EXACTLY the 14 forensically-named PNGs modified (12 select-family + 2 navbar--api), zero others; committed by explicit pathspec |
| Main visual (combined) | **1355/1355 ×2 (8.2m each) on private port 6041 — exit 0, deterministic, zero failures/skips.** Suite --list enumerates 1359 (a 4-leg list-vs-run enumeration nuance of the runner — all four runs' summaries print pure passed counts; families account: sweep 88 = 60 v1 + 28 new; v2-docs +60; recorded for 8.2's cross-check) |
| Spec closed | 2026-09-25 — see commits: 037699d (merge), 256e5cf (re-take), close commit |
