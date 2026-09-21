# Epic 1 Context: Installable themed kit foundation (tokens + pipeline + pilot component)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Stand up the workspace and deliver the substrate every later component inherits: the full token system (light + dark layers emitted as `--tk-*` custom properties), the CONVENTIONS.md API contract, the Storybook docs skeleton, the pinned visual-regression/a11y harness, and CI quality gates — all proven end-to-end by shipping the Button component through the complete pipeline (Lit core → CEM → generated React wrapper → Storybook story with axe checks in both themes and an approved visual baseline). This epic de-risks the whole kit: if Button renders themed, accessible, and baseline-locked through the pipeline, every subsequent component is repetition.

## Stories

- Story 1.1: Scaffold the multi-package workspace on the pinned stack
- Story 1.2: Light token layer — full extracted token system as `--tk-*` custom properties
- Story 1.3: Dark token layer — attribute-switched dark theme with tonal elevation
- Story 1.4: Component API convention documented and enforced
- Story 1.5: Storybook docs skeleton with theming and disclaimer
- Story 1.6: Visual regression harness with pinned capture environment
- Story 1.7: Button — pilot component through the full pipeline
- Story 1.8: CI pipeline with all quality gates live

## Requirements & Constraints

- Token completeness: every color, typography, radius, spacing, shadow, and motion entry from the design token source (DESIGN.md frontmatter AND body rules — both normative) emitted under stable `--tk-*` names, plus the z-scale (`--tk-z-nav/dropdown/popover/tooltip/modal/toast`) and motion tokens (expressive/productive curve pairs; 75/150/300/500/700ms durations). One canonical listing names every token; TS types expose them.
- Zero hard-coded values: kit-composed pages contain no color/radius/shadow/font values outside the token layer — enforced by a repo-wide check in CI. Token values must trace to recorded extraction notes; values flagged `[ASSUMPTION]` (mint/beige tints, xxl/xl radii, dark-tint first pass) ship with the flag annotated and are resolved in later epics (3.6, 5.6).
- Theme switching: `data-theme="dark"` on `<html>` restyles every kit surface with zero markup/class/inline-style changes. Dark contrast pairs pass AA (≥4.5:1 text, ≥3:1 non-text). Yellow always keeps ink text in dark mode; tonal surface steps replace shadows.
- Every component change passes the quality gate: impeccable detector zero blockers, axe checks on every story in both themes, story covers default + all variants + theming demo + a11y notes with keyboard-only checklist, reduced-motion path verified. A component without stories does not merge.
- Visual regression is kit-vs-kit (first-approved kit renders, not site pixel-diffs — brand font is unbundled): `toHaveScreenshot` with `maxDiffPixelRatio: 0.015`, capture env pinned (fixed viewport + DSF, reduced-motion forced on, pinned test font Inter, single baselines root). Reference fidelity for the Button baseline is a human side-by-side vs the tbank.ru hero-CTA capture attached to the baseline PR. During the autonomous run, baselines are PROVISIONAL (capture archived, automated drift check active, maintainer confirms on return — formalized in Story 5.5).
- Legal: unofficial study/recreation — no T-Bank trademarks in naming, no scraped proprietary assets, brand font NOT bundled (font tokens point to a consumer-supplied stack, Inter recommended default). Unofficial disclaimer visible on docs surfaces in both themes.
- Toolchain: pnpm only, Node >= 20, playwright-cli is the only browser automation tool; `npx transitions-dev add --free` run at scaffold with raw `t-*` CSS vendored.

## Technical Decisions

- Core-and-adapters: components authored once as Lit custom elements in `packages/components`; React package generated from the Custom Elements Manifest via `@lit/react` `createComponent` with an owned event-map registry (`value-change` → `onValueChange`); React handlers receive the unwrapped value; no behavior/styling/a11y logic in `packages/react`. CI runs `pnpm gen && git diff --exit-code`.
- Shadow DOM rendering; cross-boundary theming exclusively via CSS custom properties; components never read global CSS classes, never inject document-level styles, never hard-code color/radius/shadow/font/z-index.
- Token pipeline: light layer on `:root`, dark layer on `[data-theme="dark"]`; site-native token names mirrored after the `--tk-` prefix.
- pnpm workspace, four packages: `tokens`, `components`, `react`, `docs`. Allowed imports: `components→tokens`, `react→components`, `docs→{react, components, tokens}` — anything else fails lint.
- API convention (CONVENTIONS.md): camelCase Lit reactive props; events `<prop>-change` (value updates, `detail: { value }`) and `<verb>` bare (occurrences); controlled + uncontrolled modes with identical semantics. The React-surface API and overlay API are frozen at the first stateful PR (Input, Epic 2) — not here.
- Pinned stack: TypeScript 7.0.2 strict, Lit 3.3.3, @lit/react 1.0.8, React 19.3.0 (peer), Vite 8.3.0 lib mode (deps externalized), Storybook 10.6.0 (`@storybook/web-components-vite` + addon-a11y), pnpm 12.5.1, Vitest 5.0.1, Playwright 1.63.0 + @axe-core/playwright 4.13.0, @custom-elements-manifest/analyzer 0.11.0. ESM-only, no CommonJS artifacts, `.d.ts` from source, `engines: { node: ">=20" }` everywhere.
- Conventions: `tk-` element prefix (final call deferred with the name decision); one component per directory `packages/components/src/<name>/`; per-component custom properties follow `--tk-<component>-<slot>` (same slot name for the same role across components).
- Motion from tokens only: transitions.dev recipes never work as-is inside shadow stylesheets (their `:root`/`html[data-theme]` selectors don't match) — motion values fold into the tokens package and recipes consume `--tk-*`; dark overrides re-express as inherited custom properties.
- SSR deferred but not blocked: no imperative DOM access at construction time; render via Lit templates only.
- CI (GitHub Actions, wiring mechanics decided at scaffold): workspace lint + Vitest + gen check + impeccable detector step + Playwright visual/axe suite on push/PR; a deliberately broken check must be shown to fail CI, then reverted.

## UX & Interaction Patterns

- Button contract: primary (yellow-100 bg, ink-300 text), secondary (white, default shadow), inverse (ink-300 bg, white text); pill radius; heights 56/48, compact 32 with corrective padding to a 44px effective target; hover yellow-200 / active yellow-300 at 150ms/75ms from motion tokens.
- Button behavior: loading state keeps width and label for screen readers (in-place spinner); disabled = no pointer events, announced as disabled; optional left icon slot.
- Unified focus ring: 2px token ring (focus-ring light / dark-focus-ring dark), offset 2px, never removed, never ink.
- State pattern timings: hover 150ms, press 75ms, disabled 40% opacity + `aria-disabled`.
- Theme switch runs at 0ms by default (optional 150ms cross-fade), reduced-motion-safe.
- AA override values to honor in tokens: text-secondary #616871, focus-ring #1771E6, link-on-tint #1464CC (light); dark-link #66A3FF, dark-error #FF7B74, dark-focus-ring (dark).
- Storybook docs skeleton needs a theme toggle flipping `data-theme` on the preview `<html>` and the unofficial disclaimer in the layout chrome, visible in both themes.

## Cross-Story Dependencies

- 1.7 (Button) depends on 1.2/1.3 (token layers), 1.4 (CONVENTIONS.md), 1.5 (docs surface), and 1.6 (harness) — and proves the visual/axe harness end-to-end (screenshot comparison, axe both themes, baseline creation).
- 1.8 (CI) wires all gates only after 1.1–1.7 exist for the gates to bite on.
- 1.1 vendors raw transitions.dev CSS; the shadow-root adaptation completes in 1.2 where motion tokens are emitted.
- Assumption flags emitted in 1.2 (mint/beige tints, xxl/xl radii, dark tints) are resolved in Stories 3.6 and 5.6, not here.
- Downstream: the React/overlay API freeze (Story 2.1, Input) builds on CONVENTIONS.md from 1.4; the overlay controller (Story 2.2) needs the z-scale tokens from 1.2; all Epic 2–4 components inherit the pipeline and quality gates established here.
