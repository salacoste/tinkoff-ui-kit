---
title: 'Story 15.1 — ТЖ family scaffold: parallel packages + FR-17 boundary + CI'
type: 'feature'
created: '2026-09-28'
status: 'approved'
baseline_commit: '0b2cd8d'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-tinkoff-ui-kit-2026-09-21/ARCHITECTURE-SPINE.md (v5 Delta)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/{DESIGN,EXPERIENCE}.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="planning-sanctioned intent (maintainer «ok lets continue» 2026-09-28; epics-v5 story 15.1) — do not modify unless renegotiated">

## Intent

**Problem:** The v5 plan (epics-v5, spine v5 Delta) defines the ТЖ sub-kit as a parallel
package family, but the workspace holds only the bank family — no ТЖ package exists, so no
ТЖ token or component story can start.

**Approach:** Scaffold `packages/{tj-tokens,tj-components,tj-react}` as the second family on
the SAME substrate (TS strict dual-alias, Vite lib ESM, vitest placeholders), with the FR-17
boundary mechanized in BOTH lint layers (eslint no-restricted-imports + the root
import-boundaries test) and CI covering the new packages through the existing root scripts.
This is Story 15.1 of Epic 15 (epics-v5); everything later builds on it.

## Boundaries & Constraints

**Always:**
- Workspace names `pillkit-tj-tokens`, `pillkit-tj-components`, `pillkit-tj-react`
  (directory names `tj-*`; private forever, `private: true`; npm stays dead).
- Allowed imports (lint + test enforced): `tj-components→pillkit-tj-tokens`,
  `tj-react→pillkit-tj-components`, `docs→{tj-react, tj-components, tj-tokens}` (docs also
  keeps its existing bank-family allowances). The bank family's existing rules stay untouched.
- **The FR-17 edge is the headline rule:** ANY import from a `tj-*` package into
  `pillkit-{tokens,components,react}` (and any bank-family file importing `pillkit-tj-*`
  outside docs) fails lint AND the boundary test, with messages naming FR-17.
- Stack mirrors the bank family exactly: same TS dual-alias arrangement (do not "fix"),
  `experimentalDecorators` where Lit needs it (tj-components), ESM-only, `engines: node>=20`,
  Vite lib mode with workspace/lit/react externals NOT bundled, `.d.ts` via
  `emitDeclarationOnly` — copy the working configs from the bank siblings, adapt names.
- `tj-components` seeds `CONVENTIONS.md`: the bank package's frozen §4/§9 grammar copied with
  ТЖ naming (tj- elements, --tj-* tokens, data-tj-theme) and every ТЖ-specific undecided item
  marked `[OPEN — first stateful ТЖ component (16.1 freeze)]` (AD-5 v5 ruling).
- Docs: `packages/docs` gains a minimal ТЖ section shell (one placeholder story group
  `ТЖ/Getting started` stub) so the family is visible in the docs tree; completion is 17.3.
- Root scripts stay the single entry: `pnpm build/test/lint/typecheck` must cover the three
  new packages (they join `pnpm -r` via workspace globs — VERIFY, don't assume; if the glob
  is `packages/*` they join automatically).

**Never:**
- No ТЖ token content, generator changes, font files, or components (15.2/15.3/16.x own
  those). Placeholders only (`src/index.ts` empty exports, `src/tokens.css` with a
  `--tj-scaffold-placeholder` marker per the 1.1 mold).
- No modification of `_bmad/`, planning artifacts, `.claude/settings.json`, `.playwright-cli/`
  captures, or any bank-family package source (configs at ROOT shared layers may extend:
  eslint.config.js, tests/import-boundaries.test.ts, tsconfig.base.json references).
- No second dependency direction decision, no renaming from the spine v5 Delta
  (tj-/‑-tj-*/data-tj-theme are settled — OQ-9 closed there).
- No npm commands, no publish config, no version bumps.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fresh bootstrap | Clean clone, Node>=20, pnpm 12.5.1 | `pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck` all exit 0 across SEVEN packages | n/a |
| FR-17 violation (tj→bank) | `packages/tj-components/src/x.ts` imports `pillkit-components` | `pnpm lint` AND `pnpm test` (boundary test) fail naming FR-17 | Messages cite the allowed direction |
| Reverse leak (bank→tj) | `packages/components/src/x.ts` imports `pillkit-tj-tokens` | Same dual failure (docs exempt) | Same |
| Build isolation | Building `packages/tj-react` alone | `pillkit-tj-components` stays an external import, not bundled | Missing dep surfaces as import |
| Bank family untouched | `git diff` on `packages/{tokens,components,react,docs}/src` after the story | Zero byte changes | n/a |
| CI coverage | Push to main | The existing workflow gates the new packages (build/test/lint/typecheck legs) | Failure blocks as usual |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/epics-v5.md` — Story 15.1 ACs
- `ARCHITECTURE-SPINE.md` v5 Delta — the parallel-family rules this spec mechanizes
- `packages/tokens/`, `packages/components/`, `packages/react/` — the molds to copy
  (package.json/tsconfig/vite.config/vitest wiring)
- `eslint.config.js`, `tests/import-boundaries.test.ts` — the two boundary layers to extend
- `.github/workflows/ci.yml` — verify the new packages ride the existing legs (no new
  workflow; edit only if a hard-coded package list exists)
- `packages/components/CONVENTIONS.md` — the seed source for tj CONVENTIONS

## Tasks & Acceptance

**Execution:**
- [ ] `packages/tj-tokens/` — package.json (pillkit-tj-tokens), tsconfig, vite lib config,
      `src/index.ts` + `src/tokens.css` placeholder (`--tj-scaffold-placeholder`), vitest pass
- [ ] `packages/tj-components/` — same mold; deps: lit 3.3.3; tsconfig with
      experimentalDecorators + useDefineForClassFields:false (bank mold); `src/index.ts`
      placeholder; CONVENTIONS.md seeded per Always-list
- [ ] `packages/tj-react/` — same mold; deps: @lit/react 1.0.8, pillkit-tj-components;
      peer react 19.3.0; externals regexes adapted
- [ ] `eslint.config.js` — tj-family restriction blocks (tj-tokens: no cross-imports;
      tj-components: only pillkit-tj-tokens; tj-react: only pillkit-tj-components; FR-17
      message text); docs allowance extended; bank blocks untouched
- [ ] `tests/import-boundaries.test.ts` — the AD-4 matrix table extended with the ТЖ lanes +
      both FR-17 directions; trip-probe locally (add forbidden import → test fails → revert)
- [ ] `packages/docs` — ТЖ section shell (placeholder story group; Storybook config only if
      the tree requires registration)
- [ ] Root: verify `pnpm -r` globs pick up the new packages; add them to any explicit lists
      (typecheck tsconfig references etc.) — only where the existing setup enumerates

**Acceptance Criteria:**
- Given the scaffold commit, when the full gate chain runs
  (`pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck`), then all seven
  packages pass with exit 0.
- Given a `tj-*→bank` import inserted anywhere, when lint or the boundary test runs, then it
  fails citing FR-17 (both layers proven by a local trip-probe, reverted before commit).
- Given a bank-family `→tj-*` import (outside docs), the same dual failure fires.
- Given `git diff main` for the story, when inspecting `packages/{tokens,components,react}/src`
  and `packages/docs/src` (except the ТЖ shell), then zero bytes changed.
- Given `packages/tj-react` build output, when inspected, then `pillkit-tj-components` remains
  external.
- Given tj-components' CONVENTIONS.md, when read, then it carries the bank §4/§9 grammar with
  ТЖ naming and [OPEN—16.1] marks (no silently invented ТЖ-specific rules).

## Implementation Notes

*(orchestrator record, 2026-09-28)*

**Execution.** Delegated to executor `tj-scaffold-exec` (sonnet) with the frozen spec + iron
rules (pnpm only; no commit/push; no `_bmad-output` edits; no bank-family src changes);
orchestrator triaged the report and owns this record.

**Delivered.** Three packages (`pillkit-tj-{tokens,components,react}`, private 0.0.0):
package.json mirrors the bank molds; tsconfigs extend `tsconfig.base.json` — the TS
dual-alias arrangement, `experimentalDecorators` + `useDefineForClassFields:false` are
INHERITED from base (workspace-wide flags, exactly how the bank packages get them); vite
lib ESM with `/^pillkit-/` externals spanning both families without ever resolving an edge;
vitest placeholders (3+1+2 tests: marker on light selectors, empty entries, @lit/react
resolves). `tj-components/CONVENTIONS.md` seeded: bank §4/§9 grammar with ТЖ naming,
`[OPEN — first stateful ТЖ component (16.1 freeze)]` marks, the AD-12 drawer ruling carried
verbatim (incl. the REVISIT trigger), empty exception log. Docs shell
`packages/docs/src/tj/getting-started.stories.ts` (fullscreen; chrome consumes bank
`--tk-*` by design — docs chrome is shared; side-effect `pillkit-tj-tokens/tokens.css`
import proves the docs→tj lane at build level) + 2 visual baselines (light+dark, axe both
themes, filtered compare 6/6 — full suite is CI's verdict per the port-6007 rule).

**FR-17 mechanization.** Not hand-listed: `ad4-matrix.mjs` derives
`FR17_MESSAGE`/`fr17Groups()` from `FAMILY_DIRS` × `ALLOWED_SPECIFIERS` — a future family
edge lands with zero consumer edits. Both lint layers embed the message (eslint
no-restricted-imports group + escape messages; the boundary-test matcher incl. the
relative-escape leg); docs is the sole exemption (`fr17Groups('packages/docs')` → `[]`).
Trip-probes ran BOTH directions × BOTH layers (verbatim transcripts in the executor
report), reverted, post-revert gates re-verified.

**Shared layers extended** (beyond the three the Never-list named — see Change Log 2):
`ad4-matrix.mjs`/`.d.mts` (lanes + FR-17 derivation; the spec's "AD-4 matrix table" has
lived there since 9.2), `tests/zero-hardcoded.test.ts` (roots + KNOWN_PACKAGE_DIRS 4→7 —
AC-forced: the unknown-dir tripwire fails otherwise), `.github/workflows/ci.yml` (UI_ROOTS
fallback +3 — the spec's own "edit only if a hard-coded package list exists" clause),
`README.md` (canonical pin line + package table; the pin is test-pinned), 
`packages/docs/package.json` (tj-tokens dep), `pnpm-lock.yaml` (additive only, 33+/0−).

**Gates.** Executor: install/build/test/lint/typecheck exit 0. Orchestrator re-ran all
(build 0; test 154 root + 714 package-side; lint 0; typecheck 0), verified bank src
byte-untouched (`git diff` on `packages/{tokens,components,react}` empty) and docs changes
limited to package.json + the tj shell. Patch-round re-run green.

**Deviations (executor-reported + lens-corrected).**
1. `pillkit-tj-*` names vs the frozen block's `@tk-kit/tj-*` — spine OQ-9 supersedes the
   stale spec text; ratified in Change Log 1.
2. Latin group title `TJ/Getting started` with Cyrillic story name — story ids slugify
   from the title and the visual-harness id grammar is test-pinned ASCII (matches tree
   convention: Latin group slugs, Russian display names).
3. `tj-react` build isolation at scaffold grade (entry empty by design — the AC's
   "external import present" is unsatisfiable before wrappers exist); the committed test
   pins externals + nothing-bundled with the epic-16 upgrade path noted in-code.
4. Executor claimed "bank siblings have no per-package READMEs" — FALSE (all four bank
   packages carry one); fixed in the orchestrator patch round (README ×3 added with the
   install-ТЖ-alone recipe — the spine's headline belongs exactly there).

**Patch round (orchestrator, post-lens):** LICENSE scope notes renamed per package (all
three had the bank components wording) + `license` fields `SEE LICENSE IN LICENSE`→`MIT`
×3 (pure MIT payload; flips back if 15.3 bundles fonts); README ×3; the eslint-layer
FR-17 message pinned in the structure test (positive leg for family packages, negative
leg for docs — the exemption is now as pinned as the restriction). Gates re-run green.

## Spec Change Log

1. **2026-09-28 (orchestrator, under delegation):** frozen-block package names corrected —
   `@tk-kit/tj-{tokens,components,react}` and the bank `@tk-kit/{tokens,components,react}`
   references were stale copies of the superseded spec-1-1 naming; ARCHITECTURE-SPINE v5
   Delta (OQ-9 RESOLVED) fixes `pillkit-tj-*` (and OQ-3 fixed `pillkit-*` for the bank
   family long ago). The AD-4 machinery derives `packageNameOf` from directories —
   `@tk-kit/*` targets would make the FR-17 restriction groups dead text against
   nonexistent packages. All occurrences replaced in place.
2. **2026-09-28 (orchestrator, under delegation):** the Never-list's extendable-root-layers
   enumeration ("eslint.config.js, tests/import-boundaries.test.ts, tsconfig.base.json
   references") under-enumerated what the ACs force: the change set also extends
   `ad4-matrix.mjs`/`.d.mts`, `tests/zero-hardcoded.test.ts`, `.github/workflows/ci.yml`,
   `README.md`, `packages/docs/package.json`, `pnpm-lock.yaml` — each AC-forced (exit-0
   tripwires, test-pinned README line, the spec's own CI clause) or the single-source home
   of a surface the spec names. Recorded, not silently done.

## Review Triage Log

- **Quick-review lens `qr-lens-15-1` (2026-09-28): VERDICT SHIP — 0 MAJOR / 4 MINOR / 3 NOTE.**
  - M1 LICENSE scope note named `pillkit-components` in all three ТЖ packages → **FIXED**
    (per-package notes; license fields → MIT).
  - M2 deviation-5 rationale factually false (bank READMEs exist) → **FIXED** (README ×3
    added; deviation record corrected).
  - M3 the eslint layer's FR-17 message had no committed pin (a regression deleting the
    suffix would keep every gate green) → **FIXED** (structure-test pin, both legs).
  - M4 shared-layer edits under-reported in the deviation record → **FIXED BY RECORD**
    (Change Log 2 + Implementation Notes enumeration).
  - N5 tj-react "externals" AC self-contradictory at scaffold → accepted; the
    scaffold-grade substitute is the only coherent reading.
  - N6 CONVENTIONS z-scale marked `[OPEN — 15.2]` (more precise ownership than the blanket
    16.1 mark) and §4 "interaction emits" generalization → accepted, kept.
  - N7 lens read-only; gates orchestrator-owned → verified green (see Implementation
    Notes).

## Design Notes

The FR-17 edge is the one novel lint surface: express it as explicit
`no-restricted-imports` patterns per tj package (group `pillkit-tokens`, `pillkit-components`,
`pillkit-react` → message "FR-17: the ТЖ family has zero runtime dependency on the bank
family"), plus the mirrored rows in the boundary-test matrix. The bank packages gain a
reciprocal restriction (group `pillkit-tj-*`) EXCEPT docs.

## Verification

**Commands:**
- `pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck` — exit 0 ×7 packages
- Trip-probe both FR-17 directions (lint + boundary test fail) — reverted before commit
- `git diff --stat main -- packages/tokens packages/components packages/react` — empty;
  `packages/docs` — only the ТЖ shell
- Push → existing CI workflow gates the new packages (watch to conclusion)
