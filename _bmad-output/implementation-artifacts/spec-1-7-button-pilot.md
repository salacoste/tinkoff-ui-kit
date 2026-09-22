---
title: 'Story 1.7 — Button: pilot component through the full pipeline'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'thorough'
review_source: 'auto'
lenses_ran: [blind-hunter, edge-case-hunter, verification-gap, intent-alignment]
review_loop_iteration: 0
baseline_commit: 'dcfc52ee48d18487c55c68da5de67f9e5f7f932a'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/packages/components/CONVENTIONS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The pipeline (tokens, conventions, docs, visual harness) has never carried a real component — Button is FR-4 #1 and every mechanism from CEM generation to baselines is unproven end-to-end.

**Approach:** Implement `tk-button` per DESIGN.md (button-primary/secondary/inverse) and EXPERIENCE.md (Button row) as the pilot: Lit element in shadow DOM styled only via `--tk-*` tokens, full variant/size/state coverage, CEM-analyzed and wrapped for React via a `pnpm gen` pipeline with drift check, storied in `packages/components` and composed by `docs`, gated by impeccable + axe (both themes) + a PROVISIONAL visual baseline with the reference side-by-side archived. The pilot also RESOLVES the CONVENTIONS.md `[OPEN]` items (decisions below) and updates that file, and removes the @internal tokens-demo (story, baselines, allowlist entry).

## Boundaries & Constraints

**Always:**
- Visual spec (DESIGN.md Components/Button + frontmatter button-primary/secondary/inverse): pill radius `--tk-radius-full`; primary `--tk-color-yellow-100` bg + `--tk-color-ink-300` text, hover `yellow-200`, active `yellow-300` (motion: hover 150ms, press 75ms, scale-free, tokens only); secondary white + `--tk-shadow-default`; inverse ink-300 + white text; typography `--tk-text-body-m-bold-*`; heights 56/48/32 via size union with compact padded to ≥44px effective target (min-height corrective padding — EXPERIENCE a11y floor); focus-visible 2px `--tk-color-focus-ring` offset 2px, never removed; disabled 40% opacity, no pointer events, aria-disabled; loading = in-place spinner, width frozen (no layout shift), label retained for SR (sr-only swap or aria-live per judgment — note it), button gets `aria-busy`.
- Behavior (EXPERIENCE Button row): single-primary is consumer discipline (docs note); icon slot optional LEFT (`slot="icon"`); Space/Enter native activation; no value-change events; no custom events at v1 (native click suffices — record in CONVENTIONS that occurrence events come with the first component needing one).
- **[OPEN] resolutions to implement and write back into CONVENTIONS.md (replacing the OPEN markers):** (1) variants/sizes are literal unions — `variant: 'primary'|'secondary'|'inverse'` (default `primary`), `size: 'hero'|'card'|'compact'` (default `card`); (2) ALL public boolean/enum props reflect to attributes (`@property({ reflect: true })`), value props never do; (3) kit custom events (future) are `composed: true, bubbles: true`; (4) default slot = primary content (label), named slots for anatomy (`icon`); (5) event payload type naming = `Tk<PascalName>ChangeEvent`-style (`TkInputChangeEvent`); each written with a "resolved at 1.7 pilot" note.
- Shadow-root theming by INHERITANCE only (document-level token sheet; NEVER adopt tokens.css into the shadow root — cascade trap, deferred-work entry). Component stylesheet consumes only `var(--tk-*)` (the zero-hardcoded guard scans components/src including `.css.ts`).
- Spinner: CSS keyframe using `--tk-motion-duration-moderate`; explicit `animation: none` under `prefers-reduced-motion: reduce` (belt to the token-layer 0ms collapse).
- React pipeline (AD-1): `cem.config.mjs` in components (analyzer 0.11.0, exports `custom-elements.json`); `packages/react/scripts/generate-wrappers.mjs` reads the manifest + an owned `event-map.ts` registry (empty for Button) and writes `src/generated/*.tsx?` wrappers via `@lit/react` `createComponent`; root `pnpm gen` = cem analyze + wrapper gen; drift check `pnpm gen && git diff --exit-code` (script `check:gen`); no behavior/styling/a11y in packages/react.
- Stories live in `packages/components/src/button/button.stories.ts` (default + each variant × size + states hover/focus/disabled/loading + icon slot + theming demo + a11y notes incl. the keyboard-only checklist); `packages/docs/.storybook/main.ts` composes them (add the components stories glob).
- Component gate: impeccable zero blockers (edit-time hooks fire on UI files — treat findings as blockers, fix not suppress); axe both themes via the visual harness; PROVISIONAL baseline created through `pnpm test:visual` update flow with the drift/stability checks; side-by-side evidence archived to `.playwright-cli/verify/button/` (kit render PNG + the reference hero-CTA crop from `.playwright-cli/tbank-home-full.png`) and vision-checked via zai tools, noting the provisional rule.
- Remove the tokens-demo per its @internal contract: story file, its 6 baselines, the `tokens--groups` error-allowlist entry, the `.tksw-chip` axe exclusion, GROUPS-existence test references, README quirk section (update the removal-rule note as done).

**Never:**
- No hard-coded color/radius/shadow/font/z-index/duration values in component code (guard-enforced); no document-level style injection; no theming branches in markup.
- No imperative DOM at construction (AD-10); no `requestAnimationFrame`-based reveal logic.
- No new tokens (the token set is frozen from DESIGN.md — if a needed value is missing, flag it in the report, don't invent).
- No React API surface beyond the generated wrapper (freeze decisions stay at 2.1).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Click while loading | `loading` true | no click activation (preventDefault on click or pointer-events none), SR hears aria-busy | — |
| Disabled + loading both | disabled wins visually/semantically | aria-disabled, no spinner contradiction (spinner may still show; note the chosen precedence) | — |
| Compact target | size=compact (32px) | effective target ≥44px via min-height padding; focus ring visible on the padded box | — |
| Reduced motion | OS reduce | spinner animation none; hover/press color steps still apply (color, not motion) | — |
| Wrapper drift | manifest edited, gen not run | `check:gen` fails with diff | — |
| Theme flip | data-theme=dark | button restyles via tokens only (yellow keeps ink text; secondary/inverse adapt via surface/ink semantics) | — |

</frozen-after-approval>

## Code Map

- `packages/components/src/index.ts` -- placeholder to replace with button re-export
- `packages/components/CONVENTIONS.md` -- [OPEN] markers to resolve (see Always)
- `packages/react/src/index.ts` -- placeholder re-export → generated wrapper re-export
- `packages/docs/.storybook/main.ts` -- stories glob to extend
- `packages/docs/src/tokens-demo.stories.ts` -- to DELETE (+ baselines/allowlist cleanup per 1.6 README removal rule)
- `tests/visual/` -- harness: update flow for Button baselines, removal for demo baselines; ERROR_STATE_ALLOWLIST + A11Y_CONTEXT_EXCLUDE entries to drop
- `.playwright-cli/tbank-home-full.png` -- reference for the side-by-side (hero CTA region)
- `packages/tokens/src/tokens.css|tokens.ts` -- token names available (do not modify)

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/src/button/{index.ts,button.ts,button.css.ts,button.test.ts,button.stories.ts}` -- the component suite (unit tests: variant/size classes, loading width-freeze measurement, disabled semantics, reflect attributes, icon slot projection)
- [x] `packages/components/cem.config.mjs` + `custom-elements.json` (committed) -- manifest
- [x] `packages/react/{scripts/generate-wrappers.mjs,src/event-map.ts,src/generated/button.tsx|ts}` + package script -- the gen pipeline; root `gen` + `check:gen` scripts
- [x] `packages/components/CONVENTIONS.md` -- [OPEN] resolutions written back (5 items, "resolved at 1.7 pilot")
- [x] `packages/docs/.storybook/main.ts` -- compose components stories
- [x] tokens-demo removal -- story + 6 baselines + allowlist + exclusion + GROUPS test + README quirk (removal-rule note marked done)
- [x] `pnpm test:visual` update for button baselines + stability rerun -- PROVISIONAL truth
- [x] side-by-side evidence `.playwright-cli/verify/button/` + zai vision check -- reference comparison record

**Acceptance Criteria:**
- Given a docs page, when `<tk-button>` renders in any variant/size, then styling comes exclusively from `var(--tk-*)` tokens (guard green) and matches DESIGN.md (vision-checked side-by-side archived, provisional).
- Given `loading`, then width freezes (measured in unit test), the label remains available to SR, and clicks do not activate; given `disabled`, then aria-disabled + no pointer events.
- Given `pnpm gen && git diff --exit-code`, then exit 0; given a manifest hand-edit without gen, then `check:gen` fails.
- Given the visual suite, then Button baselines pass in both themes on two consecutive runs; the demo baselines and allowlist entry are gone; axe zero violations both themes.
- Given CONVENTIONS.md, then no `[OPEN — decided at 1.7 pilot]` markers remain (all five resolved with notes).
- Given impeccable hooks, then zero blocker findings on the button files.

## Implementation Notes

- Approved autonomously (standing delegation); visual/behavioral spec is DESIGN.md + EXPERIENCE.md verbatim (epics Story 1.7); the five [OPEN] resolutions are the pilot's mandate from CONVENTIONS §1/§2/§3/§5/§7 and AD-5.
- Precedence decision to record: `disabled` overrides interaction entirely; `loading` + `disabled` together render disabled visual precedence with spinner still permitted (document choice).

## Spec Change Log

- 2026-09-22 (implementation): **Decorator mode deviation from Design Notes.** The note
  prescribed "Lit standard decorators (no experimental)"; the pinned vite 8 / vitest 5
  (rolldown-oxc) transform silently DROPS TC39 standard decorators (compiled to plain class
  fields — Lit reactive accessors never install; verified on built dist). Resolution:
  `experimentalDecorators: true` added to tsconfig.base (alongside the existing
  `useDefineForClassFields: false`) — the only decorator path esbuild/oxc compile correctly;
  Lit 3 decorators are dual-mode. Component code is unchanged by this flag.
- 2026-09-22 (implementation): tokens-demo removal carried **4 baseline PNGs** (2 stories ×
  2 themes), not 6 — the spec counted the demo's baselines as 6; only 4 existed on disk.
- 2026-09-22 (implementation): `makeConfig` does not exist in @custom-elements-manifest/analyzer
  0.11.0 (public API: `create`); `cem.config.mjs` exports the plain CLI-config object
  (`globs`/`outdir`/`litelement`/`dev`) the CLI documents.
- 2026-09-22 (implementation): `@types/react@19.3.0` added as a devDep of `@tk-kit/react` —
  the generated wrappers import React for `createComponent`; types were unresolvable without it.

## Design Notes

Lit standard decorators (no experimental), `useDefineForClassFields: false` already in tsconfig.base — class fields work with `@property`. Spinner width-freeze: measure `offsetWidth` before/after `loading=true` in a happy-dom test. CEM analyzer parses JSDoc on the class — annotate props (`@attr` semantics come from reflect; document in cem config or jsdoc so the manifest carries types for wrapper generation).

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck` -- expected: all exit 0
- `pnpm gen && git diff --exit-code` -- expected: exit 0
- `pnpm test:visual` (twice) -- expected: all-pass stable, demo baselines gone, button present both themes
- impeccable hooks -- expected: zero blocker findings on UI file writes
\n
### Spec Change Log (review passes)

- Decorator mode: vite 8 / vitest 5 (rolldown-oxc) silently DROP TC39 standard decorators — legacy `experimentalDecorators: true` is the only working path on the pinned stack (verified in dist; recorded 2026-09-22).
- 4 demo baselines existed on disk, not 6 (spec miscount; all 4 removed).
- Flagged structural non-token values (flag-don't-invent rule): spinner 2px stroke, secondary 1px hairline (a11y-for-dark addition beyond the reference), compact 6px pill inset.
- Long-label stance decided: single-line, never wraps, visual-only ellipsis under consumer-constrained width, accessible name keeps full text (Long label story).
- @lit/react node builds drop element properties (SSR props bag only) — react tests resolve the browser build.
- Post-review: compact restructured — the native button IS the 44px box, pill painted on ::before inset 6px (live hit-test proven at +3/+22/+41px).

### Review Triage Log

Pass 1 (4 lenses): high — nonexistent token consumed (--tk-text-body-m-bold-leading → line-height normal; fixed to base leading + tests/consumed-tokens guard), host-dispatched clicks bypassed loading/disabled interception (host-bound listener), check:gen + React wrapper unverified (tests/gen-drift + react-dom render smoke). Medium — compact never rendered 32px (restructured, then floor violation fixed again: full 44px clickable), invalid enums unstyled (willUpdate clamp, recorded in CONVENTIONS §2), loading kept hover/cursor affordances, aria always-false noise, stories lost typecheck (root tsconfig glob), width-freeze vacuous (real Playwright measurement in button.spec), secondary/inverse reference crops missing (added + vision-verified; dark inverse hover observed ≈#6B6B6B = ink-200 step). Low — EVENT_MAP toEqual({}) time bomb (membership + freeze), generator locale-sort + duplicate-tag throw, trivia cleanups. False — transitions-dev already vendored at 1.1. Pass 2 (orchestrator follow-up): compact padding band not clickable → floor violated → restructured to clickable-box (proven). Noted: impeccable edit-time hooks auto-suppressed after 6 edits/file, no blockers fired; full audit lands with 1.8 CI detector step — flagged to maintainer.
