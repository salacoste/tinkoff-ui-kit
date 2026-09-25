---
title: 'Story 8.2 — v2 dark sweep + the warm-cream [ASSUMPTION] close'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: '70d02a8 (worktree, base 7e525c2; 8c0fdde + 9231315 + 70d02a8) → FAST-FORWARD merge into main + baseline re-take (this window)'
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

**Executor round (worktree → 70d02a8: 8c0fdde tokens, 9231315 engine+F5, 70d02a8 ledger;
8 files +374/−43; merged FAST-FORWARD into main — linear history):**

- **L-rule: ALL SIX 6.1 flags HELD — zero value changes.** Full arithmetic in the ledger
  (three disposition tables :160–218 + the verdict arithmetic :193–210): tint-cream
  `#232220` Lab L\* 13.26 held TWICE-over (the only in-window candidate sits ≤0.3 L\* from
  the raised neighbor — the page→card step collapses to sub-JND — AND mirrors the light
  pair's page≈muted relation; the warm hue is the differentiator, OKLCH H 84.6° = light
  side's 84.6°, Δ0.0°); tint-cream-raised `#2B2823` L\* 16.27 in-window; delta-positive
  `#39B54A` passes AA on all three surfaces (6.533/5.972/4.883); delta-negative `#F63434`
  HELD within the CLOSED 6.1 scope ruling (base 4.525 pass; the hover composite 3.382 is
  the PINNED sanctioned failure — the ERRATUM's number, confirmed live; a hover-clearing
  `#FF7B74` = 5.165 exists numerically but sits +12.7 L\* into the pastel ERROR family;
  the reference itself ships `#F52222` = 4.255 on base, WORSE); border-table `#FFFFFF1F`
  composite #363636 = the documented one-step-under divider grammar (1.4.11 N/A per 6.1);
  surface-row-hover `#FFFFFF1A` composite #313131 = the dark-field family's own 10%-white
  step, text pairs on it pass (white 13.009 / secondary-composited 7.303).
- **Flags closed via the generator only:** generate.mjs DARK_TOKEN_NOTES + header anchors;
  DESIGN.md + tokens.css diffs are comments/prose EXCLUSIVELY (lens-verified: the four
  hex values byte-identical both sides of every diff); TOKENS.md regenerates flag-free —
  the single `ASSUMPTION` hit is the historical header stating all six Verified
  (TOKENS.md:9, rows :262–267).
- **Engine: registry 19→28 (:56–89, `variant: 'mega-nav'` plumbing :47–53/:609) + the NEW
  delta verdict legs (:621–751)** — hover REAL `.row--link` delta rows, read computed
  fill/color, composite over the story canvas at RASTER precision (:695–708, Math.round
  channels — Chromium serializes computed alpha rounded, 0.1 vs 0.101961; the pinned
  rationale in-file). Live confirmations: dark neg **3.382** (equality — the pinned FAIL)
  / pos **4.883** (:744–748) ≡ contrast.test.ts:282/:284; light neg 5.608 / pos 4.163
  (:730–736) ≡ :277/:274. 30/30 legs green.
- **F5 (real defect found by the sweep):** the tk-store-badges anchor carried NO color
  channel — the UA `-webkit-link` rgb(0,0,238) survived theme flips; fixed
  `store-badges.css.ts:88–93` (`color: var(--tk-store-badges-label, var(--tk-color-text-primary))`
  — a token hookup, FR-1 clean); ZERO pixel change (its legs green ×2 — the anchor was
  already themed in practice via inheritance); CEM cssText regen in the SAME commit.
- **Ledger 28/28** — 9 new v2 rows with engine ratios; Story 8.2 section: dispositions,
  verdict arithmetic, F5, «Baselines this sweep: NONE», gate evidence, the stop protocol.
- Units **881/881** (components 667 / tokens 15 / react 70 / root 129) — zero new tests;
  the base count itself is 881 (the standing «876» in CLAUDE.md had missed 8.3's +5 —
  trued at this close).
- **Visual ×2 (worktree, port 6051): `--list` 1368 = run 1368 — the main 4-leg gap NOT
  observed in this tree; both passes identical: 1366 green + 2 deterministic failures.**
  STOP-AND-REPORT obeyed: zero PNG edits; the 2 legs are PRE-EXISTING on the base
  (`visual-components-v2-mega-nav--page-{light,dark}`) — 8.3 committed their baselines at
  e63639c (1280×3372, IHDR-decoded by the lens), AFTER which 8.1's merge grew the navbar
  CEM attribute descriptions (burger-label 70→209, sub-label 207→379 chars) → the docs
  page's apiReferenceDoc('tk-navbar') table renders +41px (1280×3413); 256e5cf re-took
  the same growth on the navbar--api STORY but missed this v2 docs PAGE. The executor's
  own CEM change (store-badges cssText) is never rendered by docs pages — excluded as
  the cause.
- Executor self-caught deviations: two TS breaks during development (map-cast → explicit
  tuple; `instanceof Element` narrowing), scratch-math fixes (8-digit hexToRgb, duplicate
  test title → variant suffix, waitForFunction non-hovered-row binding, string-fraction
  hex assertions, over-claimed light-positive-hover, `data-theme` vs `globals=theme`
  probe) — all resolved in-window; temp probe/config/server artifacts deleted pre-commit.

## Spec Change Log

- **ERRATUM (2026-09-25, inherited from the 6.4 lens W1 — frozen block NOT modified):**
  line 45 cites «delta-on-hover 4.039 §9 row». The §9 row was corrected on 2026-09-25:
  the dark-side hover composite pin is delta-NEGATIVE **3.382:1** on #313131
  (`tests/contrast.test.ts:282` — the FAILING dark leg this sweep's verdict legs must
  confirm); dark positive PASSES at 4.883 (:284); 4.039 was the surface-FIELD pin, not
  the hover surface. The sweep's deliverable is unchanged — read «the §9 row's dark-side
  computation» as 3.382 (negative leg).

## Review Triage Log

**Lens qr-lens-8-2 (2026-09-25, read-only pass on worktree @ 70d02a8): VERDICT SHIP — 0 BLOCKERS / 0 WARNS / 5 notes (dispositions below).**

Method note: the lens sandbox blocked `git`/`cd` into the foreign worktree, so git
objects ran from the shared object store, worktree files were verified BITWISE via
`git hash-object` against HEAD blobs, and files read directly. No edits.

All claim-groups CONFIRMED:
- Lineage exact: 7e525c2 → 8c0fdde → 9231315 → 70d02a8; diffstat matches lane files
  (8 files, all M); tree clean — changed files + sentinels (package.json, CLAUDE.md,
  playwright.config.ts) bitwise-identical to HEAD; no tag on HEAD; not pushed; no
  6051-temp-config remnants anywhere in tests/.
- L-rule: the FULL DESIGN.md + tokens diff read untruncated — every changed line is a
  comment/note/prose; the four hex values byte-identical both sides. The lens
  INDEPENDENTLY RECOMPUTED (Node, WCAG): #F63434 L = 0.2126·0.921582 + 0.7152·0.034340
  + 0.0722·0.034340 = **0.222967**; composite 49/255 → linear **0.030713**; ratio
  **0.272967/0.080713 = 3.382** ✓; #39B54A → **4.883** ✓; surround spot-checks all exact
  (4.525/6.533/4.136/5.972/5.608/4.163/5.165; light composite #F2F4F7 ✓).
- Flags: TOKENS.md has exactly ONE `ASSUMPTION` hit — the historical header (:9); six
  Verified rows :262–267.
- Engine: registry 28 (:56–89 incl. `variant: 'mega-nav'` :83), suffix template :609;
  delta legs :621–751 with raster-precision rationale :697–708; pins :744–748 (dark
  3.382 equality + <4.5 scope assertion) and :730–736 (light) — all ≡ contrast.test.ts
  (:281/:282/:284/:273/:274/:277). Lens re-ran gates: vitest 881/0, tsc clean, eslint
  clean.
- F5: `store-badges.css.ts:88–93` = a real token hookup (custom property documented
  :42), FR-1 clean (hex only in the probe docblock); CEM cssText byte-faithful to the
  template, regenerated in the SAME commit; cssText is never rendered by docs pages
  (api-reference renders attributes/events/slots only) — the CEM change is pixel-inert.
- **Units verdict: the true base count at 7e525c2 is 881** (components 667 / tokens 15 /
  react 70 / root 129; live run + triangulation 873 + 8.1's 3 + 8.3's 5) — the
  standing «876» in CLAUDE.md had missed 8.3's +5. Executor right; state docs trued
  at this close.
- STOP forensics INDEPENDENTLY REPRODUCED from git alone: the 2 baselines committed at
  e63639c, never re-taken (blobs identical); IHDR decoded — both 1280×3372; the CEM
  growth measured via JSON parse on both ends (burger-label 70→209, sub-label 207→379);
  8.1 merged AFTER 8.3's baselines (037699d topology); mega-nav.stories.ts:217 renders
  apiReferenceDoc('tk-navbar') and api-reference.ts:228 renders descriptions verbatim
  → +41px; 256e5cf's file list re-checked — the 14 PNGs did NOT include this page;
  8.2's own diff excludes any navbar/docs change and its store-badges CEM delta is
  never rendered. **Attribution sound; the failure pre-exists on the base; the
  re-take legitimacy is the same class as 256e5cf.**
- Ledger: 28/28 header, 9 rows tagged *(8.2)*, disposition tables, RU quotes/EN prose;
  spot-opened pointers resolve (two off-by-two — N1).

Notes + dispositions:
- **N1 (two pointer off-by-twos: ledger :222 cited dark-sweep.spec.ts:685 → actual :687;
  ledger :206 + the spec-file comment :625 cited contrast.test.ts:279 for the 5.608 pin
  → actual :277, :279 is the surface-field 5.441)** → FIXED in-window (all three trued).
- **N2 (ledger step shows L(#39B54A) = 0.344155; exact recompute 0.344120, Δ3.5e-5 —
  channel rounding; ratio 4.883 holds either way)** → FIXED in-window (step trued to
  0.344120; pins untouched).
- **N3 (executor's «no _bmad-output edits» was imprecise: the token SOURCE
  `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md`
  was edited — the spec's own Always-clause MANDATES it; only the story-spec file is
  the violation trigger, and it is untouched)** → accepted; the no-spec-edit rule held;
  Implementation Notes record the DESIGN.md edit openly.
- **N4 (engine/visual numbers are ledger-recorded evidence the lens could not re-run)** →
  covered by the orchestrator's main-side full gates + visual ×2 (this window).
- **N5 (clean-tree verified bitwise for changed files + sentinels; full `git status`
  blocked by the lens sandbox)** → covered by the orchestrator's merge-time status
  check (clean).

**Orchestrator disposition: NO WARN/BLOCKER fix round — note-level fixes in-window
(3 pointers + 1 arithmetic step); merged as-is (FAST-FORWARD 70d02a8).**

## Verification

| Check | Result |
|---|---|
| Worktree gates (executor + lens re-run) | units 881/881 (components 667 / tokens 15 / react 70 / root 129), tsc clean, eslint clean, gen/gen:tokens clean, post-commit drift clean |
| Worktree visual (executor) | ×2 on private port 6051: `--list` 1368 = run 1368 (the main-side 4-leg gap NOT observed); both passes identical — 1366 green + 2 deterministic STOP legs, ZERO PNG edits (temp config deleted pre-commit) |
| Merge | 70d02a8 FAST-FORWARD into main (linear; no conflicts) |
| Main gates (8.2-merged) | build/test/lint/typecheck/gen/gen:tokens GREEN (root 129/129 in the chain); post-commit drift CLEAN |
| Baseline re-take (orchestrator-adjudicated) | scoped `--update` on merged main → EXACTLY the 2 forensically-named PNGs (`visual-components-v2-mega-nav--page-{light,dark}`; IHDR-verified 1280×3372→**3413** = the predicted +41px CEM-table growth, the 256e5cf legitimacy class — the docs page was the miss); committed by explicit pathspec; enters the 8.4 maintainer batch-confirm package (with 256e5cf's 14 = 16 adjudicated re-takes total) |
| Main visual (combined, post re-take) | **1368/1368 ×2 (8.2m each) on private port 6041 — exit 0 both passes, deterministic, zero failures/skips** |
| Spec closed | 2026-09-25 — see commits: 70d02a8 (ff-merge), re-take + note-fix commit, close commit |
