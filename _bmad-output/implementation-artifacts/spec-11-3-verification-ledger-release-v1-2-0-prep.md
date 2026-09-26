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

Executor round (worktree: c367fb8 + fix 602262e; lens-audited — all five
mandated adjudications VERIFIED with independent evidence):
1. **Measured sets (never assumed):** moved set from `git diff
   v1.1.0..HEAD` = 30 files in packages/components/src (button, checkbox,
   input, promo-card, qr-block, segmented-radio, stepper, tooltip
   stories-only, 2 showcases) + docs 7 (11.2 mono flip) + tokens 6 + CEM 1
   + **packages/react ZERO** (verified at wrapper source: createKitComponent
   types off the element class, @lit/react routes new props as attributes —
   no wrapper-code change). Navbar/mega-nav verified NOT moved (no rows).
   Re-take register = **11 commits / 163 PNG-events** (authoritative
   recount via git log --stat; c13ba12 20, 325631c 32, 15a5ac6 1, afb6089
   6, 9813a65 8, de304e7 6, d1a210a 14, 7ee97e1 2, 6119d37 36, a0fb95c 2,
   b185cc4 36) — suite snapshot count FLAT 392→392, the 11.1 «+12 legs»
   are non-snapshot engine legs (visual total 1368→1380 via --list).
2. **Ledger (13 rows):** the two epics-named re-checks closed against
   their 9.1 probes — stepper brown ADOPTED (AA 5.413 white-on-brown,
   4.674 brown-on-cream REQUIRED, 4.136 raised recorded-failing) and bento
   radius REFUTED-estimate (arc-staircase r=23.8px, IQR 23.5–24.7 → the 24
   band is pixel-exact). Tooltip = pointer row (9.1 placements content,
   stories-only). The superseded business-landing deviation 14 recorded at
   LEDGER level (L3) with a deferred-work pointer — frozen NOTES evidence
   untouched. Byte-identical re-takes marked AS such (stepper--api ×2 at
   9.1, invest hero pair at 10.4) — lens blob-hash-proved both pairs.
3. **Yellow audit:** methodology verbatim; full-tree 66 hits / 29 files;
   diff-scoped = exactly 1 source yellow line (promo-card 10.3 bleed
   demo-art fill — C-class, text-free, SVG read by the lens: 3 rects,
   aria-hidden, 0 text nodes); 0 raw hexes added; 0 violations, 0 fixes.
4. **Impeccable:** detector exit 0 over 207 files; can-fail probe
   reproduced (bounce-easing → exit 2, named); deep sweep 7 classes clean;
   0 blockers.
5. **Batch package ЧАСТЬ v1.2.0:** 414 PNG FLAT vs v1.1.0 (392 suite + 22
   per-component in 11 per-component dirs); unit 943 = 17+708+70+148
   (re-run by the lens); visual 1380 in 21 files (static --list); the
   full register with forensic one-liners + per-epic inventory + ~1h
   review order. REVIEW PACKAGE only.
6. **RELEASE §9.1–9.7 (RU):** §9.4 recipe renders PromoCard
   artMode="bleed" via pillkit-react — export chain re-verified
   end-to-end against the generated barrel + element source (artMode
   union + willUpdate clamp, art/actions slots); self-sufficiency note
   (dedupe lines at README.md:76 + getting-started.stories.ts:217).
   §9.5: stepper badge pairing = the visible Changed line; 9.2/11.1/11.2
   collapsed under Internal (orchestrator guidance applied). §9.6 carries
   the JetBrains Mono TEST-ONLY paragraph. §9.7 proofs EXECUTED
   (tag -l = v1.0.0/v1.1.0; three package.json 1.1.0; CHANGELOG 0 matches
   for 1.2.0) — re-executed independently by the lens.
7. **HANDOFF:** epics-v3 row 8/8 (943/1380/414) + maintainer queue (a)
   batch-confirm → (b) release §9.1–9.5 (tag v1.2.0) → (c) SR-RUNSHEET-
   v1.2.0 execution (pointed, not rewritten) → (d) opportunistic (iOS
   momentum, cookie 16px).
8. **Process notes:** the executor self-corrected the register 161→163
   mid-flight (authoritative recount) but missed the fourth site
   (RELEASE §9.1) — lens-caught, fixed at 602262e; the ledger's ×2-verdict
   sentence was rephrased pre-emptively to defer to the gate round (no
   pre-fact claims). Visual ×2 on private port 6063 (machine-global 6007
   untouched, lsof-checked before AND after; temp config deleted
   pre-commit).

## Spec Change Log

Frozen block untouched. Recorded changes beyond the frozen text:
1. **Fix round (602262e, lens FIX-THEN-SHIP):** register 163 at the
   fourth site; moved-set header 36→30 files; per-component dir phrasing
   exact (11 + the suite dir); SM-C2 wave list names all 11 commits.
2. **Register count corrected in-flight** (161→163) — executor
   self-caught via authoritative recount; the lens per-commit recount
   confirmed 163 EXACT.

## Review Triage Log

Quick review (qr-lens-11-3, 2026-09-26): **FIX-THEN-SHIP — 0 BLOCKER /
2 WARN / 2 NOTE; fix round executed (602262e); post-fix state SHIP.** All
five mandated adjudications VERIFIED with the lens's OWN evidence:
1. [ADJ-1] ledger truth — moved set re-derived (30/7/6/1/0); 13 rows
   cover it exactly; re-check facts traced to tokens-9-1 NOTES:39-41 +
   probe-output.txt:118 + deferred-work 7.3/7.4(f); register recounted
   per-commit = 163 EXACT; blob-hashes: stepper--api pair and invest pair
   IDENTICAL at their commits (zero-pixel API additions proven).
2. [ADJ-2] yellow — grep re-run: 66/29 exact; diff-scope = 1 source line,
   C-class holds (SVG re-read); 0 raw hexes added.
3. [ADJ-3] impeccable — detector re-run exit 0/207; /tmp can-fail probe
   exit 2 (bounce-easing named); config = one ignoreValues, empty
   ignoreRules/ignoreFiles.
4. [ADJ-4] counts — 414 = 392+22 flat at both refs (window 0 added/0
   deleted, 86 M = 84 suite + 2 invest); unit re-run 943/943 split exact;
   static --list = 1380 in 21 files.
5. [ADJ-5] scope + claims — six files +642/−2 docs-only; §9.4 vs real
   API verified (artMode clamp at promo-card.ts:118-119); §9.5 grouping
   correct; §9.7 proofs re-executed; RELEASE/HANDOFF RU; unpushed worktree
   + tag list intact.
- [WARN-1] RELEASE.md:471 stale «161» (the executor's self-correction
  missed the fourth site) → fixed 602262e.
- [WARN-2] ledger.md:7 «36 files» vs measured 30 → fixed 602262e.
- [N1] «22 per-component (12 dirs)» phrasing — 22 in 11 per-component
  dirs (12th = the suite dir) → made exact at the single site it
  appeared.
- [N2] SM-C2 wave list named 10 of 11 register commits → 15a5ac6 named
  inline.
Lens non-visual gates re-run: lint 0, typecheck 0, test 943/943. Lens
killed after verdict delivery (standing rule).

## Verification

- Executor round (worktree c367fb8 + 602262e): all six deliverables +
  fixes; local chain GREEN (build → test 943 → lint → typecheck → gen →
  gen:tokens); post-commit gen-drift exit 0; visual compare ×2 on private
  port 6063 = **1380/1380 both passes** (8.7m/8.5m); port 6007 clean
  before/after; tree clean at both commits.
- Lens round (qr-lens-11-3): verdict FIX-THEN-SHIP; all ADJs verified
  independently (see Triage); fix round executed; lens killed post-verdict.
- Merge round (orchestrator, main tree): fix verified in place; ff-merge
  e693d40..602262e (6 files +642/−2, docs-only); fast gates GREEN
  (build → test 943 → lint → typecheck → gen → gen:tokens + gen-drift
  clean); visual INHERITED by material proof — `git diff --exit-code
  e693d40..602262e -- packages/ tests/` clean (served tree bit-identical
  to the CI-green e693d40; the executor's worktree ×2 stands for this
  tree) — the 8.4 docs-only mold.
- **CI VERDICT on 602262e: GREEN — run 36271532249 (21:01:58Z → 21:23:17Z,
  21.3m).** The docs-only diff (6 files +642/−2 under .playwright-cli/verify/,
  _bmad-output/, RELEASE.md, HANDOFF.md) rides the same chain; the visual
  step is green on the inherited proof (bit-identical served tree). Story
  11.3's green code head = 602262e; NO tag exists.
- Docs round: spec post-sections + CLAUDE.md cycle bullet; docs-head CI
  verdict recorded below.
- **CI VERDICT on the docs head (a23ecf6): GREEN — run 36272937423
  (21:26:27Z → 21:47:22Z, 20.9m).** The terminal head's own run is verified
  via `gh` after landing (the non-self-referential close mold, story 11.1).
  **Story 11.3 CLOSED — epics-v3 complete (8/8). The v1.2.0 TAG itself
  remains the maintainer's explicit act (IRON RULE): batch-confirm ЧАСТЬ
  v1.2.0 → RELEASE §9.1–9.5 → SR-RUNSHEET-v1.2.0 → opportunistic
  spot-checks, per HANDOFF.**
