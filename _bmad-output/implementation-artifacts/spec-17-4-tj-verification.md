---
title: 'Story 17.4 — ТЖ verification ledger + ad-language audit + impeccable + baseline package'
type: 'feature'
created: '2026-09-29'
status: 'executed'
baseline_commit: '58d979e'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 17.4: "Fidelity ledger ТЖ rows (side-by-side verdicts vs captures-v3/tj); the AD-LANGUAGE AUDIT: a mechanical check that zero #FFDD2D/#06101E-family values exist in ТЖ tokens/components (FR-21 — the yellow-audit ТЖ analog); impeccable across BOTH trees; baseline review package (ЧАСТЬ v1.4.0) assembled for the maintainer — GATE NOT EXECUTED by the run")'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-14-2-verification-ledger-release-v1-3-0-prep.md (THE MOLD — the v1.3.0 ledger/yellow-audit/impeccable/batch quartet; 17.4 is its ТЖ analog at v1.3.0..HEAD scope)'
  - '{project-root}/.playwright-cli/verify/fidelity-verification-v1-3-0/ledger.md + yellow-audit.md (the prior artifacts whose methodology is reused verbatim)'
  - '{project-root}/.playwright-cli/captures-v3/tj/ (THE reference pack — 11 PII-clean captures + INDEX.md + probe-notes.md; pixels ground truth, geometry vision-estimated ±)'
  - '{project-root}/.playwright-cli/verify/tj-dark-sweep/ledger.md (17.2 dark verdicts — cited, not re-proven)'
  - '{project-root}/_bmad-output/implementation-artifacts/baseline-review-package.md (the package this story extends with ЧАСТЬ v1.4.0)'
  - '{project-root}/tests/import-boundaries.test.ts (FR-17 mechanized both directions — cited by the ad-language audit) + tests/zero-hardcoded.test.ts (raw-hex tripwire already scoped over tj src)'
  - '{project-root}/packages/docs/src/tj/ad-slot-recipe.stories.ts (the architectural split evidence: ad modules ride bank tk-promo-card via documented hooks, never ТЖ-side hexes)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 sequencing 17.3 → 17.4) — do not modify unless renegotiated">

## Intent

**Problem:** epics-v5 ships the whole ТЖ family (15.1–17.3) but the vertical
is reference-re-grounded nowhere as a SYSTEM — per-story verify ledgers exist
(`.playwright-cli/verify/tj-*`), yet there is no single fidelity ledger against
the cycle's capture pack, no mechanical proof that the editorial family carries
zero bank ad-language values (FR-21's audit half — the boundary TEST covers
imports, not VALUES), no impeccable pass over the new ТЖ trees, and no
maintainer baseline batch for the 15.x–17.x additions.

**Approach:** the 14.2 quartet rerun as the ТЖ analog, everything diff-scoped
to `v1.3.0..HEAD` (measured at draft time: the ENTIRE ТЖ family is the moved
set — 10 component dirs + overlays + patterns, tj-tokens (source+generated),
tj-react (generated + src), docs/src/tj, 5 sweep/visual spec files, ~216
baseline PNGs; recount at execution head).

1. **Fidelity ledger** `.playwright-cli/verify/fidelity-verification-v1-4-0/ledger.md`:
   one row per COMPOSITION surface vs its pack captures, the HONEST
   classification mold (composition / pattern-consistency; pixels measured,
   geometry vision-estimated ± — never dressed as pixel fidelity where the
   probe could not see): home chrome (tj-header + tj-rail + hero scale),
   rubric feed (rubric-header + news-card), /pro/ hero (purple card + chip
   nav), community (composer + post-card grid), article (Charter body, H1 45,
   link accent gold), ad-slot recipe (floating promo = bank promo-card via
   hooks), dark layer (native prefers-color-scheme set vs 17.2 sweep
   verdicts), token layer (15.2 probe facts: page/card/ink/divider/gold/CTA
   values). Recorded deltas repeated, not re-litigated. Every row cites its
   pack PNG + per-story verify pointer + deviation count + open flags.
2. **AD-LANGUAGE AUDIT** `ad-language-audit.md` (same dir): mechanical sweep
   for `#FFDD2D`/`#06101E`-family (case-insensitive, both literals + the
   6-hex near-kin patterns the yellow-audit family methodology defines) over
   packages/tj-tokens (design-model source, generated tokens.css, TOKENS.md)
   + packages/tj-components (all src) + packages/tj-react — 0 hits expected;
   the ad-module evidence recorded as the ARCHITECTURAL split (ads = bank
   tk-promo-card via --tk-promo-card-* hooks in the recipe story, ТЖ carries
   no ad hexes); FR-17 import-boundary test cited as the structural half.
   Verdicts per package; 0 violations target (found → fix here + gates).
3. **Impeccable pass BOTH trees**: the Stop-hook detector class, full repo
   scope INCLUDING packages/tj-* and docs/src/tj; findings = blockers, fixed
   in this story; clean re-run recorded.
4. **Baseline batch PREP**: `baseline-review-package.md` gains ЧАСТЬ v1.4.0 —
   inventory MEASURED at this head (suite PNG totals by `ls`, per-component
   extras, unit + visual totals by suite runs), the re-take/addition register
   since v1.3.0 with forensic one-liners per commit (16.x additions, 17.1/17.2
   retakes if any, 17.3's 50 movers), per-epic inventory (15.x/16.x/17.x), a
   ~1h review order. REVIEW PACKAGE only — the maintainer ratifies.

**The run STOPS at the prep: no tag, no version bumps, no CHANGELOG edits —
maintainer-only (IRON RULE; 17.5 owns the release recipe).**

## Boundaries & Constraints

**Always:** diff-scope MEASURED from `git diff --numstat v1.3.0..HEAD` at the
execution head (the draft-time counts above are provisional); every count in
the batch package MEASURED; ledger rows cite pack files and kit-side facts
only — PII never transcribed, and raw reference hexes appear ONLY as the
already-recorded probe-notes anchors (DESIGN.md discipline); final full gates
+ CI green at the prep head; spec closed; conventional commit EN by explicit
pathspec.

**Never:** NO `git tag`; no version edits; no CHANGELOG.md edits; no baseline
deletions (nothing below the 1.5% rule); no reopening settled stories; no
npm; the executor NEVER edits `_bmad-output/` or `.playwright-cli/` (the
ledger/audit/package files are ORCHESTRATOR-authored — this story is
orchestrator-executed end-to-end, matching 14.2's precedent).

## Tasks & Acceptance

1. **Fidelity ledger** (docs). AC: rows cover the measured composition set;
   every row cites pack PNG + verify pointer + deviation count + open flags;
   the honest classification on every geometry claim; 17.2 dark verdicts
   cited, not re-proven; scope note records what is NOT a row; the 16.5
   overlay surfaces (burger drawer + AD-12 helper) are explicitly either
   rowed under home chrome or scope-noted — never silently dropped.
2. **Ad-language audit** (docs). AC: the family regex stated; per-package
   verdicts; 0 open violations; the architectural split recorded with the
   recipe evidence; FR-17 test citation. The docs-side leg
   (packages/docs/src/tj, where the recipe lives) rides
   `tests/zero-hardcoded.test.ts` (already scoped over docs/src) — cited,
   not re-swept, unless the audit finds a gap.
3. **Impeccable** (code if findings). AC: full-scope run incl. both trees;
   blockers fixed; clean re-run recorded in the audit trail.
4. **Batch PREP** (docs). AC: ЧАСТЬ v1.4.0 appended — inventory + register +
   per-epic inventory + review order; nothing confirmed.
5. **Ledger** (spec). AC: Change Log + Verification honest; final gates
   green; CI verdict recorded by run id only after it exists.

## Implementation Notes (close-out, orchestrator-executed)

This story ran ORCHESTRATOR-EXECUTED end-to-end (the 14.2 precedent — the
deliverables are `_bmad-output/` + `.playwright-cli/verify/` artifacts,
both orchestrator-owned zones; no executor subagent needed). Lens-174
(quick, pre-execution): **APPROVED** + 1 MINOR + 1 PATCH-NICE, both folded
(16.5 overlay surfaces explicitly rowed-or-scope-noted → row 6 carries the
drawer + AD-12; the audit's docs-side leg now cites
`tests/zero-hardcoded.test.ts` instead of re-sweeping).

**Task 1 — fidelity ledger:** `verify/fidelity-verification-v1-4-0/ledger.md`,
11 rows over the ТЖ moved set (token layer, reading primitives, feed
surfaces, /pro/ hero, community, chrome incl. drawer+AD-12, article,
ad-slot recipe, dark layer, fonts, a11y sweep) + scope note (17.3 docs
pages and bank chrome touches are NOT rows — the 14.2 ruling) + findings
L1–L4 (gates bite ×3; spec-origin misses; honest-absence ledger;
react/tokens generated-only). Every row cites its pack PNG + verify
pointer + deviations + open flags; honest classifications throughout.

**Task 2 — ad-language audit:** `ad-language-audit.md`. Mechanical sweep
`grep -rniE "FFDD2D|FCC521|FAB619|06101E"` per package: tj-tokens **0**,
tj-components **0**, tj-react **0**, docs/src/tj **0** (the docs leg rides
zero-hardcoded in CI). The 3 planning-side mentions in ux-tj-kit DESIGN.md
are the census records + the deliberate-absence declaration (evidence, not
values). Structural half cited (import-boundaries FR-17 both directions,
zero-hardcoded tripwire, tokens-drift gate). **0 violations, 0 fixes.**

**Task 3 — impeccable BOTH trees:** `impeccable-run.md`. Detector over
**297 files** (14.2's 209 + 88 ТЖ sources): **exit 0, zero findings**;
can-fail probe exit 2 reproduced; control exit 0. Deep sweep classes all
clean: TODO 0; console.log 3 (the same sanctioned v2 demo handlers, 0 in
ТЖ, 0 additions); orphans 0; commented-code 4 hits all prose continuations
(2 bank + 2 ТЖ); stale numbers 0 (10 components / 68-row registries / 16
search rows all exact); evidence pointers 54/54 resolve (7 regex-artifacts
with underlying paths verified); css.ts headers 10/10 (9 standard +
composer's anatomy-note variant).

**Task 4 — batch PREP:** `baseline-review-package.md` ЧАСТЬ v1.4.0 —
inventory MEASURED at head 58d979e: suite **544 PNG** (408 → 544, +136 all
ТЖ, 0 deleted), per-component 25 (+3 tj-article walkthrough PNGs),
**1267 unit** (tokens 17 + tj-tokens 4 + tj-components 247 + tj-react 19 +
components 713 + react 70 + root 197), **2118 visual/axe legs / 23 files**
(mint-run count; CI compare owns the final). Register: 13 commits / 194
PNG-events with forensic one-liners; per-epic inventory (15.x 6 / 16.x 110
/ 17.x 50 / bank inter-window 28+22+2+2); ~1h review order. Nothing
confirmed — the gate is the maintainer's.

## Verification

Local gates at the 17.4 head (docs/verification-only diff — zero
packages/ or tests/ changes; served tree bit-identical to 58d979e, the
14.2 precedent): `pnpm build && pnpm test && pnpm lint && pnpm typecheck
&& pnpm gen` — **EXIT 0** (1267 unit).

**CI chain (recorded honestly, verdict by run id only):**

1. Run 36593380779 (58d979e) — attempts 1–3 ALL `completed cancelled` at
   exactly ~30:20 job time, zero failed steps. Root cause (forensics by
   step timings): `timeout-minutes: 30` in ci.yml — the suite grew to
   2123 legs and the visual step (28m52s when killed) no longer fit; a
   timeout kill reports as cancelled under the triggering actor. NOT a
   manual cancel, NOT a superseding push. Prior green ddd060e ran ~27 min.
2. 202beb1 — ceiling raised 30→60 with the forensic comment (CI-infra
   unblock, the 90c8e6a/e1916a6 precedent class).
3. Run 36617540273 (202beb1) — **RED, real gate**: 5 axe color-contrast
   failures [light] on the 17.3 pattern pages (`.tjpat-note > a` — bank
   link on surface-muted = 4.24:1, the same law the theming-guide axe
   fix encoded; the 17.3 close's scoped-only re-verification after the
   dist rebuild never re-ran these legs — the exact hole CI owns).
4. d02a483 — the fix round: links moved off muted notes on all five
   pattern pages (law comments in source; rubric--demo keeps its box for
   the PII disclaimer only); exactly 10 PNGs deleted + re-minted scoped
   (STOP check: 10 movers, no strays); scoped axe 10/10; **FULL local
   suite 2123/2123 (12.3m, exit 0) — full-suite re-run after any
   post-rebuild source change is now standing practice**; unit gates +
   gen-drift clean. Impeccable detector over the 4 edited files: exit 0
   (recorded in impeccable-run.md). Baseline-package register updated
   (14 commits / 204 PNG-events; legs 2118→2123 corrected by the
   `--list` measurement + CI-compare tail).
5. Run 36623061743 (d02a483): **GREEN** — `gh run view` conclusion
   `success`, 2026-09-29 (~28 min; the first verdict under the 60-min
   ceiling; covers the 17.3 code content of 58d979e — the two
   interposed commits are the CI-workflow ceiling and the axe fix
   itself).
