---
title: 'Story 5.5 — Docs completion: reference, theming guide, getting started, docs-site states'
type: 'feature'
created: '2026-09-23'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 1
baseline_commit: 'ad498e23a4cf7c93c66271dbb1f4b0e18f6a914f'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-8/UX-DR16 require complete docs — 19/19 component pages with API tables, a token reference with light/dark values side by side, a theming guide, a getting-started page, and docs-site states — so a consumer adopts the kit without reading source. The Storybook skeleton (1.5) + per-component stories exist, but the reference/guide/getting-started surfaces and the completion sweep (every page: default + variants + states + theming + a11y + API table + CONVENTIONS link) are missing.

**Approach:** Complete the docs package: a **getting-started index page** (install, theming, font slot incl. Daytona licensing + Inter recommendation, unofficial disclaimer), a **token reference page** (every token, light/dark side by side, generated from the tokens package artifacts — never hand-typed), a **theming guide page** (switching, per-token overrides, dark-mode pairing rules), and the **19/19 page completion sweep** (gap-fill: any component page missing variants/states/theming/a11y-notes/API-table/CONVENTIONS link gets it). Docs-site states land as an interactive index-page pattern (component search with the RU empty state + cold-load skeleton demo); Storybook-chrome customization is ruled out of scope (record the ruling).

## Boundaries & Constraints

- **Language:** content RU (OQ-4); story meta (title/name) EN for baseline stability. Voice per the table: calm bank-grade, verbs, no exclamation marks, «1 331 ₽» number formatting, localization-ready phrasing (no baked concatenations).
- **Disclaimer** (unofficial study/recreation project; not affiliated with or endorsed by T-Bank) present on EVERY docs surface — the global decorator covers stories; new top-level pages verify it renders there too.
- **Token reference:** GENERATED — consume the tokens package's generated artifacts (tokens.css/TOKENS.md/TS types) so the page cannot drift from the token layer; light/dark values side by side; the generation path is a build-time script or a docs story importing generated data (pick and record). Include the z-scale and motion tokens, not just colors.
- **Theming guide:** switching (`data-theme` attribute), per-token overrides (the `--tk-<component>-<slot>` grammar with real examples), dark-mode pairing rules (tonal elevation, invariant surfaces, the AA-override table pointer). Live demos in both themes.
- **Getting started:** install (pnpm add — package names `pillkit-*`, note `private: true` until publish), theming quickstart, **font slot** (DaytonaSans/DaytonaPragma bundled under LICENSE-FONTS.md — separately licensed, NOT MIT; Inter as the open default; stacks carry consumer brand fonts first), tokens.css import order.
- **19/19 completion sweep:** audit each component's existing stories against the full checklist (default + ALL variants + interactive states + theming demo + a11y notes incl. keyboard-only checklist + SR spot-check protocol from 5.1 + API table + CONVENTIONS.md link); gap-fill what's missing — do not duplicate what exists. API tables: from CEM (Autodocs/ArgsTable from custom-elements.json, or generated MDX — pick and record; consistency matters more than the mechanism).
- **Docs-site states:** the index page ships an interactive component search (filtering the 19 names) with the empty state «Ничего не найдено. Попробуйте название компонента.» + a cold-load skeleton demo (the kit's skeleton pattern applied to the page's own layout). SB sidebar/chrome search = out of scope (ruling recorded).
- New pages are stories/docs in `packages/docs` following the existing structure (the 1.5 skeleton, the getting-started precedent); every NEW story gets baselines (auto-discovered) both themes; RU content/EN meta; axe must pass on every new page; impeccable zero blockers (hooks fire on docs edits too).
- No new tokens; no component code changes EXCEPT where a docs gap reveals a genuine component doc-string defect (fix + regen manifest).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output | Error handling |
|----------|--------------|-----------------|----------------|
| Token reference | generated artifacts | every token, light/dark side by side, zero drift possible | gen source missing → fail loudly |
| Theming guide | both themes | switching/overrides/pairing demos live | — |
| Getting started | fresh consumer | install→render path documented incl. fonts/licensing | — |
| Page completion | 19 pages audited | checklist complete or gap-filled | — |
| Search empty state | no-match query | RU empty copy, never blank | — |
| Cold-load skeleton | index load | skeleton matching final layout, static under reduce | — |
| Disclaimer | every surface | visible both themes | — |
| New baselines | update flow | stable ×2, axe clean | — |

</frozen-after-approval>

## Code Map

- `packages/docs/` -- the Storybook package (`.storybook/` config, existing getting-started index story, per-component stories composed from packages/components)
- `packages/tokens/` -- generated artifacts (tokens.css, TOKENS.md, TS types) = the reference page's data source
- `packages/components/custom-elements.json` -- API-table source
- `packages/components/CONVENTIONS.md` -- the link target
- `.playwright-cli/verify/a11y-sweep/METHOD.md` -- evidence format mold → `.playwright-cli/verify/docs-completion/`

## Tasks & Acceptance

- [x] Getting-started page complete (install incl. workspace recipe + build prerequisite / theming / fonts + Daytona licensing / disclaimer)
- [x] Token reference page (generated maps, light/dark side by side, z+motion included — 4 stories)
- [x] Theming guide page (switching/overrides/pairing, live demos — 3 stories)
- [x] Docs-site states: component search + RU empty state + cold-load skeleton on the index; SB-chrome ruling recorded
- [x] 19/19 page-completion audit ledger (`.playwright-cli/verify/docs-completion/ledger.md`) + 38 gap-fills applied (19 API tables + 19 CONVENTIONS links)
- [x] Voice/microcopy pass per the table; disclaimer verified on every surface; full gates + baselines stable ×2 (921)

**Acceptance Criteria:**
- Given any of the 19 component pages, when audited against the checklist, then every item is present (ledger evidence).
- Given the token reference, when the token layer changes, then the page cannot show stale values (generation enforced, drift impossible by construction or a gate).
- Given `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` (staged), exit 0; visual stable ×2; axe clean on new pages both themes.

## Implementation Notes

- Approved autonomously (standing delegation). Recorded choices (ledger table): (1) API tables = generated story tables from the COMMITTED CEM manifest via `packages/components/src/api-reference.ts` (Autodocs/ArgsTable rejected — forks the API surface, not baselined); drift gated by check:gen; placement in components forced by the AD-4 import matrix. (2) Token reference = imports the GENERATED typed token maps from pillkit-tokens (the same objects components consume); drift gated by check:tokens-drift; hand-typed values: ZERO (review grep-verified — only structure literals). (3) Docs-site states = interactive index-page pattern (docs-component-search element, 19 names + RU empty state char-for-char per EXPERIENCE + cold-load skeleton); SB sidebar/chrome search OUT OF SCOPE (ruling). (4) tk-button has no fill hooks → theming guide demos real channels (--tk-input-fill, promo-card CTA pair) with the honest adjustment recorded. (5) dist/api-reference.d.ts ships in the tarball but unreachable via exports map — ACCEPTED, revisit at 5.7 packaging.
- 38 gap-fills = 19 API stories + 19 CONVENTIONS links (three suites had prose §refs only); defaults/variants/states/theming/a11y+keyboard/SR-protocols pre-existed from 1.7–5.3, verified per suite not rebuilt. Variant-less/keyboard-N/A rulings grounded in EXPERIENCE (badge «never interactive», progress-bar display-component note).
- Axe enforcement caught 13 color-contrast failures mid-flight — all fixed at the TOKEN level on docs-surface selectors (page roots surface-base, link-on-tint, charcoal white pair, text-secondary, skeleton border-default), zero kit css.ts touched, zero rule disabling.
- resolveJsonModule added to tsconfig.base (the CEM import); manifest regen = the intended api-reference module entry (wrappers untouched — generator consumes only custom-element-definition exports).

## Spec Change Log

(none — frozen block untouched)

## Review Triage Log

Quick review (2026-09-23): **SHIP** — 0 blockers / 0 MAJOR / 4 MINOR / 5 NOTE. Drift-impossibility verified BY CONSTRUCTION (import paths resolve to generated artifacts; traced gates fail on stale); hand-typed-value hunt: zero; deep links empirically real; the 2 updated baselines = getting-started pages justified by the rewrite; legal wording matches LICENSE-FONTS.md precisely. Patched (orchestrator applied 2 one-liners pre-delegation-hook, agent the remainder):

1. **[MINOR] Bar-normalization constants hand-typed** (space 120 / duration 700 / z 600) — future scale growth would overflow cells. PATCHED: all three DERIVED via Math.max over the maps (render-identical today; orchestrator applied the Motion half, agent the Surfaces half).
2. **[MINOR] Workspace recipe missed the build prerequisite** (exports resolve ./dist — fresh checkout = unresolvable imports). PATCHED: `# соберите пакеты кита — exports указывают на ./dist:` + the install/build line; vision-verified verbatim in the re-taken baseline (2 PNGs deleted + update flow — the below-threshold skip would have carried stale instructions).
3. **[MINOR] api-reference.d.ts tarball leak** — ACCEPTED in the ledger's recorded choices (5.7 packaging owns: files-exclusion vs tsconfig-exclude trade-off noted).
4. **[MINOR] Search results swap silent for SR** — PATCHED: results region wrapped `aria-live="polite"` (orchestrator).
5. **[NOTE] dead ledger pointer** — PATCHED to concrete gate evidence. [NOTE] specimen var latent case, fonts-wording 5.7 fold, N5/N9 — recorded/verified, no action.

Post-patch verification: 644 unit + 921 visual ×2 + orchestrator compare run; build/lint/typecheck/gen-drift green. One transient axe flake (progressbar indeterminate [light], outside the change surface) — isolated re-run + both stability runs + orchestrator run green.

## Design Notes

Docs are a PRODUCT surface here (FR-8): the bar is «adopt without reading source». RU voice matters — bank-grade calm, no exclamation marks. The token reference's generated-not-typed constraint is the story's architectural point.

## Verification

**Commands:**
- `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen && git diff --exit-code` -- all exit 0 (gen staged)
- `pnpm test:visual` (update flow for new stories, then ×2) -- stable
