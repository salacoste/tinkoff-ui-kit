---
title: 'Story 1.5 — Storybook docs skeleton with theming and disclaimer'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
baseline_commit: '5652aa9d0e9562ff6a24600fb93440a2e2cc0b56'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The kit has tokens and conventions but no docs surface — consumers cannot browse components, and the live light/dark flip (UJ-2's runtime proof) is unverifiable.

**Approach:** Stand up the `@tk-kit/docs` package on Storybook 10.6 (`@storybook/web-components-vite` + `addon-a11y`) with a custom theme toolbar toggle that flips `data-theme` on the preview `<html>`, a getting-started stub carrying the unofficial disclaimer (also in persistent chrome), and the tokens CSS loaded so every story renders themed — verified live via playwright-cli.

## Boundaries & Constraints

**Always:**
- Stack pin: storybook 10.6.0, @storybook/web-components-vite 10.6.0, @storybook/addon-a11y 10.6.0. Deps: `@tk-kit/{components,react,tokens}` workspace links (AD-4: docs may import all three).
- Token loading: `@tk-kit/tokens/tokens.css` imported in the preview (document-level — the shadow token-loading decision deferred entry warns against shadow adoption; components will INHERIT custom properties). Document this choice in the getting-started stub.
- Theme toggle: Storybook toolbar control (globalType) switching `document.documentElement.dataset.theme` between light/dark — no extra addon dependency; default light; persists per session via Storybook's globals persistence if free.
- Disclaimer (unofficial study project; not affiliated with or endorsed by T-Bank; no trademark use) renders on the docs index/getting-started page AND in persistent chrome (manager-head injection or a preview decorator banner) — visible in BOTH themes.
- a11y addon active (violations highlighted in stories).
- All authored docs styling consumes `var(--tk-*)` tokens — the zero-hardcoded guard scans `packages/docs/src` (Storybook's own chrome CSS is Storybook's, not ours).
- Scripts: `dev` (storybook dev -p 6006), `build` (storybook build → dist), `test` placeholder stays green (extend to `test-storybook`-style smoke ONLY if free — not required).
- Live verification: playwright-cli with `PLAYWRIGHT_CLI_SESSION=tinkoff-ui` — open the dev server, assert the toggle flips the html attribute and a token-driven color changes (screenshot light vs dark), per the deferred-work entry this story owns.

**Never:**
- No component stories yet (Button lands at 1.7) — only the getting-started stub + a temporary token-swatch demo story proving theming (swatches render `var(--tk-color-*)` tiles; demo file marked `@internal, removed at 1.7`).
- No React wrapper usage in stories yet (web-components renderer only).
- No modification of tokens/components packages beyond what the workspace links need.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dev server | `pnpm --filter @tk-kit/docs dev` | Storybook serves on 6006 with toolbar theme toggle | — |
| Theme toggle | click dark in toolbar | preview `<html>` gains data-theme=dark; token swatch colors change live | — |
| Disclaimer visibility | both themes | disclaimer readable on index + chrome | — |
| Zero-hardcoded | docs src scan | no hex/rgb/z-index literals in authored files | guard fails naming file |
| Build | `pnpm --filter @tk-kit/docs build` | static build succeeds | — |

</frozen-after-approval>

## Code Map

- `packages/docs/` -- placeholder from 1.1 (package.json + index.html only)
- `packages/tokens/` -- exports `./tokens.css` → dist/index.css (import in preview)
- `tests/zero-hardcoded.test.ts` -- scans packages/docs/src once it exists; docs placeholder allowlist entry must be REMOVED when src appears
- `packages/components/CONVENTIONS.md` -- getting-started stub links it
- Storybook 10 config layout: `.storybook/main.ts` (framework web-components-vite, addon-a11y), `.storybook/preview.ts` (globals, token import, decorator), manager chrome via `.storybook/manager-head.html` or preview-render banner — implementer's choice, note it

## Tasks & Acceptance

**Execution:**
- [x] `packages/docs/package.json` -- storybook deps/scripts + workspace links -- entry point
- [x] `packages/docs/.storybook/{main.ts,preview.ts,manager-head.html|banner.ts}` -- config, theme globalType, token import, disclaimer chrome -- the skeleton
- [x] `packages/docs/src/getting-started.mdx|stories.ts` -- stub page: install (pending publish — show workspace usage), theming recipe (attribute + font slot + token sheet), CONVENTIONS.md link, disclaimer -- the index
- [x] `packages/docs/src/tokens-demo.stories.ts` -- @internal token-swatch demo proving theming in both modes -- temporary
- [x] `tests/zero-hardcoded.test.ts` -- remove the docs placeholder allowlist entry (src now exists) -- guard alignment
- [x] live verification via playwright-cli (screenshots light/dark to .playwright-cli/docs-skeleton-{light,dark}.png) -- UJ-2 runtime proof

**Acceptance Criteria:**
- Given the dev server running, when the toolbar toggle switches to dark, then the preview `<html>` carries `data-theme="dark"` and token-driven swatches visibly change (playwright screenshots prove it).
- Given the docs index in either theme, when reading, then the unofficial disclaimer is visible and the getting-started stub links CONVENTIONS.md.
- Given `pnpm test`, then the zero-hardcoded guard scans packages/docs/src (allowlist entry gone) and passes.
- Given `pnpm build` (all packages), then docs static build succeeds alongside the lib packages.

## Implementation Notes

- Approved autonomously (standing delegation); fully determined by Story 1.5 ACs + AD-4 + the two deferred-work entries this story owns (runtime cascade proof, document-level token loading documented).
- If Storybook 10.6 manager chrome injection for the disclaimer proves non-trivial, a preview-decorator banner is the accepted fallback (note which was chosen).

## Spec Change Log

## Review Triage Log

Pass 1 (2026-09-22, lenses: blind-hunter, edge-case-hunter, verification-gap, intent-alignment; 14 patch items dispatched + 1 orchestrator fix; all applied):

- medium — `.storybook` outside every enforcement net (mutation-proven: banner hex literal ships green) → patch: per-package SCAN_ROOTS in zero-hardcoded (docs: src + .storybook) + boundary-test coverage; net chosen: vitest boundary test.
- medium — runtime decorators unverified (deleting withTheme/withDisclaimer keeps all gates green; verification-gap mutation-proven) → patch: tests/docs-preview.test.ts (happy-dom) — decorators registered, withTheme sets data-theme, withDisclaimer renders banner text.
- medium — install section used nonexistent `--workspace-link` flag on unpublished private packages → patch: workable workspace path + publish note (5.7).
- medium — fresh-clone `dev` fails (tokens dist gitignored, absent pre-build) (edge 1) → patch: predev/prebuild build tokens.
- low-med — GROUPS token names unvalidated (typo = silently empty chip) (blind 6, edge 2) → patch: existence assertion vs dist/index.css.
- low — color-contrast disabled story-wide instead of chips-only → patch: a11y.context.exclude ['.tksw-chip'].
- low — hardcoded lengths (56px, minmax, 3px border) → patch: border tokenized; structural demo px kept in @internal file; length blind-spot documented in guard docblock (FR-1 letter excludes lengths).
- low — vacuous non-empty scan satisfiable by globals.d.ts alone → patch: require a non-.d.ts source.
- low — double disclaimer on the index (banner + inline box) → patch: banner suppressed by story id (static-build verified bannerCount 0 / inlineBoxes 1).
- low — CONVENTIONS blob/main link fragile → patch: repo-root link + plain path.
- low — docs package lost its entry doc → patch: README.
- low — PNG whitelist accumulation → patch: `.playwright-cli/verify/` single directory policy.
- low — verification covered dev only, not the static bundle (blind 7, intent R5b) → patch: playwright pass against served dist — flip identical (surface 255→26, banner 245→34), screenshots in verify/.
- note — root typecheck broke after the patch round (root program gained preview.ts without the CSS ambient declaration) → fixed by orchestrator: tests/globals.d.ts.
- defer — mono font slot absent (code samples render in body face) → deferred-work entry (add --tk-font-mono when a code surface needs it).

## Design Notes

## Verification

**Commands:**
- `pnpm --filter @tk-kit/docs build` -- expected: exit 0
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck` -- expected: all exit 0
- `PLAYWRIGHT_CLI_SESSION=tinkoff-ui playwright-cli open http://localhost:6006` + toggle + screenshots -- expected: light/dark PNGs differ in theme colors, html attribute flips
