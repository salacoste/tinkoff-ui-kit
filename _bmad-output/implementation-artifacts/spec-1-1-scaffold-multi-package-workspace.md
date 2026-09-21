---
title: 'Story 1.1 — Scaffold the multi-package workspace on the pinned stack'
type: 'feature'
created: '2026-09-21'
status: 'done'
baseline_commit: '08ccd9e286af5fbd97d351d7431db09665b2a008'
review: 'thorough'
review_source: 'auto'
route: 'full'
route_source: 'auto'
review: ''
review_source: ''
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository holds finalized planning artifacts (brief, PRD, UX spines, architecture spine, epics) but zero code — the kit has no build substrate, so no component story can start.

**Approach:** Scaffold the pnpm multi-package workspace exactly as the architecture spine specifies — `packages/{tokens,components,react,docs}` on the pinned stack with a green `pnpm install && pnpm build && pnpm test` baseline and lint-enforced one-way imports. This is Story 1.1 of Epic 1; everything later builds on it.

## Boundaries & Constraints

**Always:**
- pnpm workspaces; `packageManager: "pnpm@12.5.1"` in the root `package.json` (resolve the local 11.20.0 → 12.5.1 mismatch via corepack if available, else a global pnpm upgrade — record which in Implementation Notes).
- Allowed import directions, lint-enforced: `components→tokens`, `react→components`, `docs→{react, components, tokens}`. Any other cross-package import fails lint (AD-4).
- Stack pins (architecture spine): TypeScript 7.0.2 strict; Vite 8.3.0 lib mode; Vitest 5.0.1; Lit 3.3.3 + @lit/react 1.0.8 (deps of `components`/`react`, resolvable now, consumed from 1.7); React 19.3.0 as peer of `react`; `@custom-elements-manifest/analyzer` 0.11.0 as root devDep (consumed from 1.7); Storybook NOT installed yet (that is Story 1.5 — `docs` gets a placeholder package only).
- ESM-only everywhere (`"type": "module"`, ESM configs, no CJS artifacts); `.d.ts` generated from source (`vite-plugin-dts` or `tsc --emitDeclarationOnly` — implementer's choice, note it); `engines: { node: ">=20" }` in every package.json.
- Run `npx transitions-dev add --free` once `src/` exists and vendor the raw `t-*` CSS into the repo (AD-15). No AD-9 adaptation here — that lands with the motion tokens in Story 1.2.
- Each of `tokens`, `components`, `react` builds with Vite lib mode with dependencies externalized.

**Never:**
- No component implementation, tokens content, CONVENTIONS.md, Storybook, CI, or publish config in this story (Stories 1.2–1.8 / 5.7 own those).
- No CommonJS output; no bundling of workspace deps into lib builds.
- No modification of `_bmad/`, `_bmad-output/`, `.claude/settings.json`, `PRODUCT.md`, or the capture files under `.playwright-cli/`.
- No renaming or re-deciding stack choices from the spine; no second-guessing package directory names (`tokens`, `components`, `react`, `docs` — publish names remain OQ-3).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fresh bootstrap | Clean clone, Node >= 20, pnpm 12.5.1 | `pnpm install && pnpm build && pnpm test` all exit 0 | n/a |
| Import boundary violation | e.g. `packages/tokens/src` imports `@tinkoff-ui-kit/components` | `pnpm lint` fails naming the file and forbidden direction | Lint error message names the allowed direction rule |
| Build isolation | Building `packages/react` alone | Workspace deps externalized in output, not bundled | Missing dep surfaces as import, not silent inline |

</frozen-after-approval>

## Code Map

- `CLAUDE.md` -- project playbook: pnpm-only, Node >= 20, conventions; do not edit here
- `_bmad-output/planning-artifacts/epics.md` -- Story 1.1 ACs (source of the tasks below)
- `_bmad-output/implementation-artifacts/epic-1-context.md` -- compiled Epic 1 constraints (stack table, ADs)
- `PRODUCT.md`, `.impeccable/config.json` -- impeccable contracts; untouched
- `.playwright-cli/tbank-home-full.png` -- reference capture; untouched
- Repo root has NO src/, NO package.json yet — fully greenfield scaffold

Internal workspace package names (private, never published — publish names are Story 5.7 / OQ-3): `@tk-kit/tokens`, `@tk-kit/components`, `@tk-kit/react`, `@tk-kit/docs`. Chosen to avoid any T-Bank trademark even privately (FR-11 discipline).

## Tasks & Acceptance

**Execution:**
- [ ] `pnpm-workspace.yaml` -- declare `packages/*` -- workspace root
- [ ] `package.json` (root) -- private, `packageManager: pnpm@12.5.1`, engines node>=20, scripts `build`/`test`/`lint` as `pnpm -r` runs, devDeps: typescript 7.0.2, vite 8.3.0, vitest 5.0.1, eslint + typescript-eslint, @custom-elements-manifest/analyzer 0.11.0 -- single toolchain version set
- [ ] `eslint.config.js` (root) -- flat config: typescript-eslint recommended + per-package `no-restricted-imports` enforcing AD-4 directions -- zero extra plugins
- [ ] `tsconfig.base.json` (root) -- strict: true, ESM, moduleResolution bundler, declaration setup -- shared baseline
- [ ] `packages/tokens/` -- package.json (@tk-kit/tokens, type module, engines), tsconfig, vite.config.ts (lib mode, empty-ish `src/index.ts` + `src/tokens.css` placeholder), vitest pass -- first package proves the mold
- [ ] `packages/components/` -- same mold + deps: lit 3.3.3; `src/index.ts` placeholder, README stub -- core package
- [ ] `packages/react/` -- same mold + deps: @lit/react 1.0.8, peer react 19.3.0, dep @tk-kit/components -- adapter package
- [ ] `packages/docs/` -- minimal package.json + `index.html` placeholder only (no Storybook yet) -- reserved for 1.5
- [ ] repo root -- run `npx transitions-dev add --free`, commit resulting `t-*` CSS as vendored -- AD-15
- [ ] `.gitignore` -- add node_modules/dist/coverage as needed, preserving existing entries -- hygiene
- [ ] `README.md` (root) -- one-paragraph unofficial disclaimer + status line ("in development; stack per architecture spine") -- FR-11 labeling starts at first code commit

**Acceptance Criteria:**
- Given the scaffold commit, when `pnpm install && pnpm build && pnpm test` runs, then all four packages install, build (ESM lib output + d.ts), and report passing (empty) test suites with exit 0.
- Given any file in `packages/tokens` importing `@tk-kit/components` (or any other forbidden direction), when `pnpm lint` runs, then lint fails citing the import-boundary rule.
- Given `pnpm -r build` output for `packages/react`, when inspecting the artifact, then `@tk-kit/components` remains an external import (not bundled).
- Given the repo after the story, when searching for `t-*.css` transitions files, then the vendored transitions.dev CSS exists and is committed.
- Given every package.json, when checking engines, then `node >= 20` is declared; root additionally pins `packageManager: pnpm@12.5.1`.

## Implementation Notes

- Approved autonomously (checkpoint 1 self-serve): user AFK 2026-09-21 with explicit delegation ("manage subagents and follow our plan... one step after another"). The frozen block contains only decisions traceable to approved planning artifacts (spine stack pins, AD-4, Story 1.1 ACs) plus scaffold mechanics the spine defers (linter choice; private @tk-kit/* workspace names — never published, OQ-3 unaffected).
- pnpm 11.20.0 → 12.5.1 resolved via corepack shim + `packageManager` field; no global upgrade. pnpm 12 auto-added `allowBuilds` (rs-module-lexer) and `minimumReleaseAgeExclude` entries to pnpm-workspace.yaml (supply-chain policy) — kept.
- **TypeScript 7 side-by-side arrangement** (official MS guidance for TS 7.0 + typescript-eslint): `typescript` → `npm:@typescript/typescript6@6.0.2` (JS API for typescript-eslint 8.70.1), `@typescript/native` → `npm:typescript@7.0.2` (owns `tsc`, used by every build). Spine pin honored — all type-checking/emit is TS 7.0.2 native strict. Do not "fix" by removing either alias.
- d.ts strategy: `tsc -p tsconfig.json` with `emitDeclarationOnly` per package (no plugin dep).
- Vite lib mode does NOT auto-externalize workspace-linked deps → explicit `rollupOptions.external` regexes in components (`lit`, `@tk-kit/`) and react (`@tk-kit/`, `@lit/`, `react`) configs.
- transitions.dev CLI vendored markdown references only (`transitions/*.md`); implementer mechanically extracted the raw CSS verbatim to `transitions/t-*.css` + `transitions/_root.css` so the AD-15 vendoring is real CSS on disk.
- eslint 10.11.0 / typescript-eslint 8.70.1 (unpinned by spec — latest stable).
- `tokens.css` scaffold marker `--tk-scaffold-placeholder` keeps the Vite CSS artifact non-empty; replaced in Story 1.2. `:host, :root` selector keeps future tokens usable in shadow roots.
- Matrix audit follow-up: committed `tests/import-boundaries.test.ts` + root vitest wiring added so I/O rows 2–3 are covered by registered tests (static AD-4 scan + dist externalization check), not just ad-hoc runs.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-09-22, lenses: blind-hunter, edge-case-hunter, verification-gap, intent-alignment; verdicts high 1 / medium 7 / low 4 / false 2):

- high — tokens `./tokens.css` export points at `dist/index.css` nothing verifies; mutation-proven (CSS import removed → build+test stay green, artifact gone) → patch: dist CSS assertion in the root suite (verification-gap, pre-verified).
- medium — eslint AD-4 globs cover only `src/**/*.ts`; `.tsx` (anticipated by 1.7) and other file types escape the lint gate while the vitest scan covers tsx — verified in eslint.config.js blocks → patch: `**/*.{ts,tsx}` globs (blind-hunter, edge-case claim 2).
- medium — relative cross-package imports (`../../react/src/index.js`) bypass both eslint patterns and the scanner's `workspacePackageOf` — verified: neither handles relative specifiers → patch: relative-path resolution in scanner + eslint patterns (edge-case 3).
- medium — components vite external misses `lit-html`/`@lit/*` direct imports (`/^lit\//` ≠ `lit-html`); tokens vite config claims "everything externalized" but declares no externals — verified in both configs → patch: broaden/add externals (edge-case 7, 8).
- medium — decorator regime undecided in tsconfig.base.json (`useDefineForClassFields` unset) — Lit 3 class-field semantics decide at 1.7 if not now → patch: set `useDefineForClassFields: false` + comment (blind-hunter 11).
- medium — docs `scripts: {}` makes `pnpm -r build/test` silently skip it while AC says "all four packages … report passing" — verified: no test script → patch: trivially-passing placeholder test script (blind-hunter 2, edge-case 11-claim, verification-gap other).
- medium — root/config TS surfaces (tests/, vitest/eslint/vite configs) type-checked by nothing — verified: no tsconfig includes them → patch: root tsconfig + `typecheck` script (blind-hunter 4, edge-case 9).
- medium — scanner false-positives on string literals containing import-shaped text; statSync crashes on broken symlinks; bundled-Lit check fails open under minification — verified by reading the matcher → patch: string-strip before scan, try/catch walk, extra bundling markers (edge-case 4, 5, 10; folded into the scanner patch as direct corrections).
- low — react externalization regex hard-codes vite output formatting (fails loud, fail-safe) → patch: loosen regex (verification-gap other; same file as scanner patch).
- low — README omits root surfaces (tests/, transitions/), pnpm 12.5.1/corepack note, two-document lockfile quirk → patch: README additions (blind-hunter 8, 12).
- defer — transitions `_root.css` hard-coded color tunables + per-file literals (t-error-state-shake duration/easing, t-card-tilt radius/glare) collide with the zero-hard-coded gate unless folded — vendored third-party content, folding owned by Story 1.2's AD-9 adaptation → deferred-work.md (blind-hunter 5, 6).
- defer — LICENSE file missing + vendored transitions files lack provenance headers — publish-time concern, owner Story 5.7 (verify transitions.dev free-pack license terms) → deferred-work.md (blind-hunter 7).
- defer — AD-4 matrix encoded in 3 places (eslint, test, prose) can drift — structural single-source fix owned by 1.8 CI hardening → deferred-work.md (blind-hunter 9, intent D4).
- defer — react peer exact-pin `19.3.0` rejects other React 19.x at resolution — spine pin honored now, widen pre-publish, owner 5.7 → deferred-work.md (blind-hunter 10).
- false — "fresh clone `pnpm test` without build fails" — by documented design: the AC chain is install→build→test and the suite throws an instructive error naming the chain; loud correct behavior, not a defect (blind-hunter 3, edge-case 6).
- false — "docs AC contradiction requires spec change" — the AC is satisfiable with a no-op test script; no spec edit needed (intent D2, resolved via patch).
- intent-audit D5/D6/D7 — descriptive only (R3/R4 reading is the implemented one; TS dual-alias documented in eslint.config.js + Implementation Notes; CONVENTIONS.md deferral is the spec's own Never-list) — no action.

## Design Notes

Import boundaries via `no-restricted-imports` (not eslint-plugin-import): the AD-4 rule is a small fixed matrix; restricted-patterns per package express it with zero new dependencies and unmistakable failure messages. Example for `packages/tokens`:

```js
{ rules: { 'no-restricted-imports': ['error', { patterns: [{ group: ['@tk-kit/*'], message: 'tokens is the workspace root of the dependency graph — it may not import other packages (AD-4).' }] }] } }
```

## Verification

**Commands:**
- `pnpm install && pnpm build && pnpm test` -- expected: exit 0 across all packages
- `pnpm lint` -- expected: exit 0 on the clean scaffold
- `pnpm lint` with a deliberate forbidden import added temporarily -- expected: failure naming the boundary rule (then reverted)
- `git status --short` -- expected: only intended new files; `_bmad/`, `.playwright-cli/` untouched
