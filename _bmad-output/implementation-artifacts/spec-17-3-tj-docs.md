---
title: 'Story 17.3 — ТЖ docs completion (the 5.5/8.3 mold)'
type: 'feature'
created: '2026-09-29'
status: 'executed'
baseline_commit: '46938cb'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 17.3: "Token reference (generated, drift-proof), theming guide (the auto/light/dark contract), getting-started (install-alone recipe + the ad-module integration recipe), API tables from the ТЖ CEM, patterns pages (article, rubric, community, /pro/); search/anchors follow the docs-regroup conventions")'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-5-5-docs.md (THE MOLD — getting-started install/theming/fonts/disclaimer; token reference from generated maps light/dark side by side; theming guide 3 stories; search + RU empty state; page-completion ledger)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-8-3-v2-docs.md (page anatomy: what/when/not-for, API table from CEM, examples RU, theming, a11y notes, composition pointers; SINGLE-SOURCE registers surface + drift guard; RU display names + EN ids sanctioned)'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-11-2-docs-completion-mono-first-consumer.md (docs conventions: mono on ALL code surfaces block+inline; content-TRUE corrections; one-directional textual cross-links; consumed-tokens pin names each flipped file; sanctioned-baseline-set discipline; codeBlock pre tabindex=0)'
  - '{project-root}/packages/docs/src/token-reference.stories.ts + theming-guide.stories.ts + getting-started.stories.ts (bank references to duplicate-and-adapt)'
  - '{project-root}/packages/components/src/api-reference.ts (the CEM→doc renderer to mirror for tj; Autodocs/ArgsTable stays REJECTED — spec-5-5)'
  - '{project-root}/packages/tj-components/custom-elements.json + cem.config.mjs (the ТЖ CEM exists and is gen-gated already; NO api-reference mirror exists yet)'
  - '{project-root}/packages/docs/src/tj/getting-started.stories.ts (explicit stub: «контент и оформление придут со story 17.3»)'
  - '{project-root}/packages/docs/src/component-search.ts (hand-maintained COMPONENTS array; zero tj-* rows today)'
  - '{project-root}/tests/visual/tj-a11y-sweep.spec.ts + tj-dark-sweep.spec.ts (TSWEEP/TJSWEEP = ALL built ТЖ story ids — the deliberate-update contract; every new ТЖ story id requires measured rows)'
---

<frozen-after-approval reason="planning-sanctioned intent (overnight autonomous delegation; epics-v5 sequencing 17.1+17.2 → 17.3) — do not modify unless renegotiated">

## Intent

**Problem:** the ТЖ family ships 10 components + 3 pattern compositions verified by two dedicated sweeps (17.1/17.2, 185 legs green), but its DOCS surface is a stub: `TJ/Getting started` says «контент придут со story 17.3», there is no ТЖ token reference, no ТЖ theming guide (the auto/light/dark contract is undocumented anywhere), no API tables (the ТЖ CEM exists but nothing renders it), no patterns adoption pages, and the component search returns nothing for «tj».

**Approach — the 5.5/8.3 mold duplicated-and-adapted onto ТЖ (bank docs files stay UNTOUCHED; every ТЖ page is a new file or the sanctioned stub expansion):**

1. **`packages/docs/src/tj/token-reference.stories.ts` — NEW (title `TJ/Token Reference`).** Generated typed maps imported from `pillkit-tj-tokens` (`colorTokens`, `darkColorTokens`, `typographyTokens`, `radiusTokens`, `shadowTokens`, `spaceTokens`, `motionTokens`, `zTokens` as they exist in `packages/tj-tokens/src/tokens.ts`) — ZERO hand-typed values; the only literals are structure. Stories: `Colors` («Цвета» — light/dark side by side; absent from `darkColorTokens` → «инвариантно», never duplicated), `Typography` («Типографика»), `Surfaces` («Форма и поверхность» — ТЖ is FLAT: the overlay shadow and the radius/space scales ride here), `Motion & z` («Моушен и z-шкала»), `Registers` («Регистры ТЖ») rendering the COMMITTED GENERATED `TOKENS.md` verbatim via `pillkit-tj-tokens/TOKENS.md?raw` + the `packages/docs/src/v2/registers.ts` parser (single source; a missing section THROWS — if the ТЖ TOKENS.md section grammar diverges, a minimal TJ-side parser mirror in docs is the recorded fallback, never a hand-copy of values). **Prerequisite:** add `"./TOKENS.md": "./src/TOKENS.md"` to `packages/tj-tokens/package.json` exports (the bank mold's exact assertion target).
2. **`packages/docs/src/tj/theming-guide.stories.ts` — NEW (title `TJ/Theming Guide`).** 3 stories, bank mold adapted to the ТЖ contract which DIFFERS where it matters:
   - `Switching` («Переключение темы») — `import 'pillkit-tj-tokens/tokens.css'` once at document level; `<html data-tj-theme="dark">`; **the AUTO leg the bank guide does not have**: attribute ABSENT → the `prefers-color-scheme` auto leg engages (the 15.2 dual-emit); explicit `light` DISARMS it (`:not([data-tj-theme="light"])`); the docs-boot caveat (the boot runtime writes `light` on render — harness consumers strip post-settle; cite the 16.6 lesson). Shadow-root cascade trap warning. Live demo flipped by the TOOLBAR Theme control (no in-page toggle, no OS emulation — the harness captures both themes).
   - `Overrides` («Переопределение токенов») — semantic-level `--tj-*` overrides; per-component channels THAT ACTUALLY EXIST (derive from the `css.ts` files — do not invent); the invariant warning: overriding the purple field family breaks the 16.2/16.3 twin-pinned chip pair; the restricted-ink contract (never render engage/reference-time inks).
   - `Dark pairing` («Правила тёмной темы») — ТЖ dark rules from 17.2's standing rulings: FLAT (the overlay shadow is the only elevation, kept as-is), purple field + gold + chip-ink-on-purple invariants, ink-200 RIDES the cta-fill flip, the link pair flips, `ink-reference-time` stays UNBOUND (never renders; re-opens with a dark-article capture), AA pairs per `tests/tj-contrast.test.ts` + pointer to the ТЖ token reference.
3. **`packages/docs/src/tj/getting-started.stories.ts` — EXPAND the stub (story id `tj-getting-started--page` KEPT).** Bank mold sections adapted: **ТЖ-ALONE install** (build prerequisite «exports указывают на ./dist»; `pnpm add -w pillkit-tj-tokens pillkit-tj-components pillkit-tj-react --workspace`; the vite `dedupe: ['react','react-dom']` 3-liner README-verbatim; NO bank packages — the FR-17 disjointness IS the point; 17.5's fresh-clone acceptance installs ТЖ alone); theming quickstart (`data-tj-theme` + auto); fonts (Inter/PT Serif harness pins; Graphik/Charter licensed path, OQ-8); **the ad-module integration recipe** = summary + one-directional cross-link to `TJ/Ad Slot Recipe` (the FR-21 boundary: bank page chrome, `--tj-*` only inside the stage); component-search pointer; `packages/tj-components/CONVENTIONS.md` link; API-table pointer. Content RU, story-meta EN. **Inline disclaimer:** extend the preview.ts inline-disclaimer mechanism to the ТЖ page (the `INLINE_DISCLAIMER_STORY_ID` single id becomes a list including `tj-getting-started--page`) + the `tests/docs-preview.test.ts` row — every docs surface carries the disclaimer (FR-11).
4. **`packages/tj-components/src/api-reference.ts` — NEW (mirror of the bank renderer).** `import cem from '../custom-elements.json'`; same table grammar (attributes + property-only members + events + slots + theming-channel section); footer link → `packages/tj-components/CONVENTIONS.md`. **10 `Api` stories** appended to the component suites (prose, link, cta, rubric-header, news-card, tag-chip, composer, post-card, header, rail — ids `tj-<x>--api`, RU name «API»). NOT on article-page (recipe, not shipped API — the page-scaffold mold) nor on docs pages. Autodocs/ArgsTable stays REJECTED.
5. **Patterns adoption pages — 4 NEW docs pages in `packages/docs/src/tj/`, nested group `TJ/Patterns/*` (distinct from the frozen `TJ/Article Page` suite title):**
   - `TJ/Patterns/Article` — `Page` «Обзор»: what/when/not-for + composition pointers to `TJ/Article Page` stories (one-directional textual links).
   - `TJ/Patterns/Rubric` — `Page` «Обзор» + `Demo` «Демо»: THE missing composition (the epics critic ruling: games/shows/shopping/aptechka rubrics are news-card/rubric-header instances «kept as composition demos inside 17.3 patterns») — rubric-header + news-card rows inside a `--tj-*`-only stage, ad-slot-recipe's child-scoped-selector mold (`.tjpat-page > h1` — the ::slotted specificity trap; NEVER descend into slotted flow).
   - `TJ/Patterns/Community` — `Page` «Обзор» → pointers to `tj-post-card--community-pattern` + composer.
   - `TJ/Patterns/Pro` — `Page` «Обзор» → pointers to `tj-tag-chip--pro-hero-pattern` (purple = scoped carrier, not a component).
   Page chrome consumes bank `--tk-*` (the standing ruling: docs-site chrome is shared); stages stay `--tj-*` only; code blocks mono (`var(--tk-font-mono)`, block AND inline, `tabindex="0"` on scrollable pre).
6. **Search** — `packages/docs/src/component-search.ts` `COMPONENTS` grows ТЖ rows: 10 components (ids → their `--playground`) + 6 pattern/recipe rows (`tj-article-page--page-composition`, `tj-ad-slot-recipe--recipe`, `tj-patterns-rubric--demo`, `tj-patterns-article--page`, `tj-patterns-community--page`, `tj-patterns-pro--page`). RU display text, EN ids (docs-regroup conventions; ids ASCII by the pinned grammar).
7. **Drift + sweep wiring (the deliberate-update contract):**
   - `tests/tj-docs-registers-source.test.ts` — NEW: asserts `pkg.exports['./TOKENS.md'] === './src/TOKENS.md'` for `pillkit-tj-tokens` AND feeds the real TOKENS.md through the real parser (the bank `docs-registers-source.test.ts` mold).
   - `tests/consumed-tokens.test.ts` — the docs-mono pin list grows with every NEW file that renders code surfaces (token-reference, theming-guide, patterns pages; getting-started already listed? NO — bank list is bank files; extend truthfully file-by-file).
   - **TSWEEP + TJSWEEP grow 45 → 68 rows**: +5 token-reference, +3 theming-guide, +10 api, +4 patterns Page, +1 rubric Demo (ids derived from titles at execution; the getting-started row's `stops` RE-DERIVED — the expanded page stays non-interactive by design, live search demo deliberately NOT embedded to keep the row honest). Each row: measured `stops`/`minKitSurfaces` derivation comment naming the story-source interactive set (the 5.1 measured-not-assumed law).

## Boundaries & Constraints

**Always:**
- Bank docs files (`packages/docs/src/*.stories.ts` at root, `v2/*`, bank api-reference) stay UNTOUCHED except: `component-search.ts` (ТЖ rows appended), `preview.ts` (inline-disclaimer constant → list), and their pinned tests.
- Generated-only values in the token reference; registers story renders the committed TOKENS.md via ONE source + drift test; `check:tokens-drift:tj` / `check:gen` already own the upstream drift.
- Content RU, story-meta/ids EN ASCII; every new surface carries the disclaimer (decorator or inline); mono on every code surface; `tabindex="0"` on scrollable pre; one-directional textual cross-links (no external URLs).
- Docs page chrome = bank `--tk-*` tokens (standing ruling); `--tj-*` inside stages only; stages never print hardcoded theme literals beyond sanctioned demo snippets.
- Gates `pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm gen` — `&&`-chained, `set -o pipefail` when piped.
- The executor NEVER runs `test:visual` / update-mode / mint; NEVER edits `_bmad-output/` or `.playwright-cli/`; MAY edit `packages/tj-components/CONVENTIONS.md`.

**Never:**
- NO new package deps; NO npm/publish/tag; NO roster changes (api stories document EXISTING API — if a CEM gap surfaces, record it in the report, do not change component src).
- NO Autodocs/ArgsTable; no second hand-copy of token values anywhere.
- NO OS-preference emulation in stories (theme flips ride the toolbar global — preview determinism law).
- NO retitling/removal of EXISTING story ids (baselines + sweep registries + search pins ride them); new titles only.

## Execution rounds (build loop)

1. **Executor** (one subagent, code+tests only): all files above; scoped verification = `pnpm build` + fast gates; delivers the measured stop derivations + story-id inventory + any CEM gaps in the report.
2. **Orchestrator triage + lens review** (patch rounds as needed — orchestrator-owned).
3. **Orchestrator:** docs dist rebuild; scoped 6007 sweeps `pnpm exec playwright test -g "tj-(a11y|dark)-sweep"` (expect 68×2 walks + 68 scans + 5 pins green); **baseline mint** (sanctioned set = exactly the 23 NEW story ids × both themes + the 2 getting-started retakes — explicit delete before re-mint; ANY mover outside the set → STOP); full gates; ledgers.
4. **Close:** spec → executed + Implementation Notes; pathspec commit; push zero-in-flight; CI verdict (`gh run view --json conclusion`); CLAUDE.md stamp; memory update.

## Acceptance checklist

- [x] TJ token reference 5 stories, zero hand-typed values, «инвариантно» dark logic, registers = TOKENS.md single source
- [x] `pillkit-tj-tokens` TOKENS.md export + `tests/tj-docs-registers-source.test.ts` green
- [x] TJ theming guide 3 stories incl. the AUTO leg + docs-boot caveat + 17.2 standing rulings
- [x] getting-started expanded (ТЖ-alone install + ad-module recipe cross-link), id kept, inline disclaimer wired
- [x] `tj-components/src/api-reference.ts` + 10 Api stories from the committed CEM
- [x] 4 `TJ/Patterns/*` pages (4 Page + rubric Demo composition)
- [x] component-search ТЖ rows (16)
- [x] TSWEEP/TJSWEEP 68 rows, measured derivations, scoped sweeps green
- [x] mono pin truthful; consumed-tokens/zero-hardcoded/zero-theme-branches/tj-contrast/tj-fonts-policy clean
- [x] gates EXIT 0; baselines minted for the sanctioned set only; CI GREEN on the push

## Implementation Notes (close-out, orchestrator)

**Executor round (exec-173).** All D1–D7 delivered; gates EXIT 0 at hand-off (197 unit tests, gen idempotent, 68 ТЖ story ids exact vs dist). 28-file diff triaged personally: registries clean (engine logic untouched, rows + header comments only), search rows verified, no roster changes.

**Ratified deviations (5, recorded in the story headers):**
1. Token-reference paints LIVE `var(--tj-…)` swatches instead of literals — a literal never flips, which is a dark-sweep leftover by definition (17.2 contract); value columns stay literal text.
2. `--tj-color-ink-200` / `--tj-color-ink-reference-time` paint NO specimen («нет поверхностей») — invariant inks that never ride surfaces.
3. Purple-field pair override in the theming guide ships CODE-ONLY — a live white label on a pseudo-purple pill is exactly the 17.2 leftover class.
4. `tj-components/src/api-reference.ts` uses bare `monospace` (FR-17: `--tk-font-mono` must not cross the family boundary) and card-surface tables (15.2 ink-300-on-card law — 4.478:1 on the bare page).
5. Patterns Page rows ride the chrome-composition precedent (kit-only counts, no assertAllStops) — rubric Demo carries real measured stops (4/4 via tj-news-card anchors).

**Lens-173 verdict: NO MAJOR + 1 MINOR + 2 PATCH-NICE — all three fixed orchestrator-owned.** (a) MINOR: TOKENS.md notes carry `**bold**` markers that rendered literally on «Регистры ТЖ» → `mdInline` extended with a strong-mapping pass (code spans win over bold). (b) PATCH-NICE: the illustrative dual-emit block now shows the real `:host`/`:root` symmetry of tokens.css. (c) PATCH-NICE: `mdSection('### Font family slots')` hoisted — was computed twice.

**Axe finding from the baseline mint (real, fixed).** `axe: tj-theming-guide--overrides [light]` → `color-contrast: a[target="_top"]`: the «Регистры ТЖ» link sat INSIDE the muted warn box — bank `--tk-color-link` #1771E6 on `--tk-color-surface-muted` #F5F5F6 = 4.24:1 (light AA fail; on `surface-base` it is 4.62 — the pair the bank mold assumes, which is why the bank guide never hit it: it never puts a link on a muted box). Fix: the link moved to a `p.tjtg-note` on the page ground, warn box keeps the contract text; source comment records the ratio. Post-fix scoped run 30/30, both sweeps 277/277, full chain EXIT 0.

**Baseline mint.** Sanctioned set verified via `git status`: exactly 50 PNG movers — 23 new ids × both themes (46) + the 2 getting-started retakes × both themes (4). The overrides pair re-minted once after the axe fix (explicit delete first); final mover set unchanged in composition.

**Ledgers.** Sweep registries 45→68 rows (deliberate-update contract honored — engine logic untouched); consumed-tokens pin list grew by 7 path-qualified `tj/…` suffixes; docs-preview covers both inline-disclaimer ids.

