---
title: 'Story 15.1 — ТЖ family scaffold: parallel packages + FR-17 boundary + CI'
type: 'feature'
created: '2026-09-28'
status: 'open'
baseline_commit: ''
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
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
- Workspace names `@tk-kit/tj-tokens`, `@tk-kit/tj-components`, `@tk-kit/tj-react`
  (directory names `tj-*`; private forever, `private: true`; npm stays dead).
- Allowed imports (lint + test enforced): `tj-components→@tk-kit/tj-tokens`,
  `tj-react→@tk-kit/tj-components`, `docs→{tj-react, tj-components, tj-tokens}` (docs also
  keeps its existing bank-family allowances). The bank family's existing rules stay untouched.
- **The FR-17 edge is the headline rule:** ANY import from a `tj-*` package into
  `@tk-kit/{tokens,components,react}` (and any bank-family file importing `@tk-kit/tj-*`
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
| FR-17 violation (tj→bank) | `packages/tj-components/src/x.ts` imports `@tk-kit/components` | `pnpm lint` AND `pnpm test` (boundary test) fail naming FR-17 | Messages cite the allowed direction |
| Reverse leak (bank→tj) | `packages/components/src/x.ts` imports `@tk-kit/tj-tokens` | Same dual failure (docs exempt) | Same |
| Build isolation | Building `packages/tj-react` alone | `@tk-kit/tj-components` stays an external import, not bundled | Missing dep surfaces as import |
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
- [ ] `packages/tj-tokens/` — package.json (@tk-kit/tj-tokens), tsconfig, vite lib config,
      `src/index.ts` + `src/tokens.css` placeholder (`--tj-scaffold-placeholder`), vitest pass
- [ ] `packages/tj-components/` — same mold; deps: lit 3.3.3; tsconfig with
      experimentalDecorators + useDefineForClassFields:false (bank mold); `src/index.ts`
      placeholder; CONVENTIONS.md seeded per Always-list
- [ ] `packages/tj-react/` — same mold; deps: @lit/react 1.0.8, @tk-kit/tj-components;
      peer react 19.3.0; externals regexes adapted
- [ ] `eslint.config.js` — tj-family restriction blocks (tj-tokens: no cross-imports;
      tj-components: only @tk-kit/tj-tokens; tj-react: only @tk-kit/tj-components; FR-17
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
- Given `packages/tj-react` build output, when inspected, then `@tk-kit/tj-components` remains
  external.
- Given tj-components' CONVENTIONS.md, when read, then it carries the bank §4/§9 grammar with
  ТЖ naming and [OPEN—16.1] marks (no silently invented ТЖ-specific rules).

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

The FR-17 edge is the one novel lint surface: express it as explicit
`no-restricted-imports` patterns per tj package (group `@tk-kit/tokens`, `@tk-kit/components`,
`@tk-kit/react` → message "FR-17: the ТЖ family has zero runtime dependency on the bank
family"), plus the mirrored rows in the boundary-test matrix. The bank packages gain a
reciprocal restriction (group `@tk-kit/tj-*`) EXCEPT docs.

## Verification

**Commands:**
- `pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck` — exit 0 ×7 packages
- Trip-probe both FR-17 directions (lint + boundary test fail) — reverted before commit
- `git diff --stat main -- packages/tokens packages/components packages/react` — empty;
  `packages/docs` — only the ТЖ shell
- Push → existing CI workflow gates the new packages (watch to conclusion)
