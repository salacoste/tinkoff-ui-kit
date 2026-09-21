---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-tinkoff-ui-kit-2026-09-21/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-tinkoff-ui-kit-2026-09-21/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md
runMode: autonomous (user AFK 2026-09-21, explicit delegation — menu confirmations logged, not interactive)
---

# tinkoff-ui-kit - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for tinkoff-ui-kit, decomposing the requirements from the PRD, UX Design contract (DESIGN.md + EXPERIENCE.md), and Architecture spine into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Extract Reference Site tokens — complete Token System from tbank.ru via sanctioned capture methodology (playwright-cli hi-res + computed styles, cross-referenced with inspo MCP): brand palette (yellow #FFDD2D range + near-black), card tints (white/gray/bluegray/mint/beige/charcoal), type scale H1…legal fine print, spacing scale, radius scale (pill; 24–32px cards; 12–16px inputs), elevation levels, motion curve set. Every token has a stable name in one canonical listing; kit-composed pages contain zero hard-coded color/radius/shadow values; values trace to recorded extraction notes.

FR-2: Theme switching (light + dark) via a single theme layer; all Kit Components restyle with zero markup changes; every component renders correctly in dark mode (no illegible pairs, no light-only assumptions).

FR-3: Component API consistency — one documented convention (props naming, event naming, controlled/uncontrolled behavior, slot/content patterns), applied uniformly, enforced by review checklist on every component PR; story docs link to it; deviations require a logged exception.

FR-4: Ship the 19-component v1 list — Primitives: Button (primary-yellow/secondary-white/inverse pill), TextLink, Badge/Chip; Forms: Input (inline badge slot, required), Select (chevron dropdown), Checkbox (consent), SegmentedRadio (Да/Нет pill), ThumbnailPicker (tiles + ring); Indicators: ProgressBar (label + % + thin bar); Navigation: Tabs (pill active + shadow), Navbar (logo, links, yellow active underline, utilities), Footer (grouped directory + pill bar + contact); Cards: PromoCard, FeatureCard (2-up + dark editorial), ServiceCard, ArticleCard; Overlays: Modal, Tooltip, Toast (derived). Reference-grounded #1–16 pass Fidelity checks; derived #17–19 pass Pattern-consistency checks; components compose — the homepage above the fold reassembles from Kit Components plus content.

FR-5: Overlay behaviors — Modal focus trap + restore, Esc/overlay-click/close-affordance dismiss patterns, Toast auto-dismiss duration + stacking rules, aria-live announcements (Toast/Tooltip) and dialog semantics (Modal); keyboard-only and SR sessions pass each overlay; open/close motion respects reduced-motion.

FR-6: WCAG 2.1 AA per component — keyboard operability, visible focus, correct roles/names/states, contrast including yellow primary button and pastel tints in both themes; story docs include keyboard-only checklists; automated a11y checks pass in story docs; SR spot-checks recorded per group.

FR-7: Vetted motion set with reduced-motion respect — hover/press/focus/open-close/theme-switch motion from vetted transitions.dev recipes (`t-*`, added at scaffold), every animation disabled or simplified under `prefers-reduced-motion: reduce`; durations/curves come from motion tokens, not per-component values.

FR-8: Story docs for every component — live default, all variants, interactive states (hover/focus/disabled), theming demo (light/dark), accessibility notes; 19/19 coverage, no component documented without variants.

FR-9: impeccable design audit as merge gate — edit-time hooks on every UI change; blocker findings block merge; CI wiring added at build phase; detector ignore-rule changes are reviewed and justified.

FR-10: Visual regression checks — captured baselines per reference-grounded component (#1–16); automated screenshot comparison flags drift beyond tolerance; derived (#17–19) get pattern-consistency checks; a change that visibly drifts fails CI or requires explicit baseline re-approval.

FR-11: npm package, MIT, semver, unofficial labeling — consumer installs via `pnpm add <package>` and renders Button from the README example; breaking changes only in majors; deprecations documented; README/repo/docs carry the unofficial disclaimer; no T-Bank trademark use.

### NonFunctional Requirements

NFR-1 (Legal): Unofficial recreation only — no T-Bank trademarks in published naming; no scraped proprietary assets, code, or artwork; the proprietary brand font is NOT bundled (font tokens point to a consumer-supplied stack with a recommended open alternative — OQ-2).

NFR-2 (Toolchain contracts): pnpm only; Node >= 20; playwright-cli is the only browser automation tool; impeccable + transitions.dev + inspo MCP are the sanctioned design-quality toolchain (CLAUDE.md).

NFR-3 (Module/build quality): TypeScript strict; ESM-only output; no CommonJS artifacts; `.d.ts` generated from source; dependency graph stays one-way (no cycles).

### Additional Requirements

AR-1 (AD-1): Core-and-adapters — every component authored once as a Lit custom element in `packages/components`; React package generated from the Custom Elements Manifest via `@lit/react` `createComponent` with an owned event-map registry (`value-change` → `onValueChange`); React handlers receive the unwrapped value; CI runs `pnpm gen && git diff --exit-code`; no behavior/styling/a11y logic in `packages/react`.

AR-2 (AD-2): Shadow DOM rendering; cross-boundary theming exclusively via CSS custom properties; components never read global CSS classes, never inject document-level styles, never hard-code color/radius/shadow/font/z-index; z-order only from the z-scale tokens.

AR-3 (AD-3): Single token pipeline — DESIGN.md (frontmatter AND body rules) is normative; tokens package emits `--tk-*` custom properties on `:root` (light) and `[data-theme="dark"]` (dark) + z-scale (`--tk-z-nav/dropdown/popover/tooltip/modal/toast`) + motion tokens + TS types; theme switch = attribute change on `<html>`.

AR-4 (AD-4): pnpm multi-package workspace — `tokens`, `components`, `react`, `docs`; allowed imports `components→tokens`, `react→components`, `docs→{react, components, tokens}`; anything else fails lint.

AR-5 (AD-5): API convention — camelCase Lit reactive props; events `<prop>-change` (value updates) and `<verb>` bare (occurrences), payload `detail: { value }`; controlled + uncontrolled modes with identical semantics; documented in `packages/components/CONVENTIONS.md`; React-surface API frozen at the first stateful PR (Input), overlay API decided in that same PR.

AR-6 (AD-6): TypeScript 7 strict everywhere; ESM-only; Vite 8 lib mode per package with deps externalized; Node >= 20 engines across all packages.

AR-7 (AD-7): Quality gates — impeccable detector zero blockers; `@axe-core/playwright` a11y checks on every story in both themes; Storybook story with default + variants + theming demo + a11y notes; a component without stories does not merge.

AR-8 (AD-8): Visual fidelity regression — Playwright `toHaveScreenshot` with `maxDiffPixelRatio: 0.015` against first-approved kit renders (kit-vs-kit); reference fidelity is a human gate at baseline creation (side-by-side vs tbank.ru capture for the 16 reference-grounded components); capture env pinned (fixed viewport + DSF, reduced-motion on, pinned test font, single baselines root).

AR-9 (AD-9): Motion from tokens only; transitions.dev recipes adapted for shadow roots (their `:root`/`html[data-theme]` selectors never match inside shadow stylesheets — motion values fold into the tokens package, recipes consume `--tk-*`); overlay open/close → productive entrance/exit; tab swaps → expressive standard; hover 150ms; press 75ms; every animation has a reduced-motion path.

AR-10 (AD-10): SSR deferred but not blocked — no imperative DOM access at construction time; render via Lit templates only.

AR-11 (AD-11): EXPERIENCE.md is normative in full — Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Responsive & Platform; implementation disagreeing with it is wrong until either changes by PR.

AR-12 (AD-12): Overlay controller in `packages/components` owns top-layer mounting (with fallback), refcounted body scroll-lock, viewport-flip positioning, cross-instance Toast stacking (bottom-right, max 3); no floating surface implements its own z-index or scroll-lock.

AR-13 (Stack pins): TypeScript 7.0.2, Lit 3.3.3, @lit/react 1.0.8, React 19.3.0 (peer), Vite 8.3.0, Storybook 10.6.0 (`@storybook/web-components-vite` + addon-a11y), pnpm 12.5.1, Vitest 5.0.1, Playwright 1.63.0 + @axe-core/playwright 4.13.0, @custom-elements-manifest/analyzer 0.11.0.

AR-14 (Conventions): `tk-` element prefix (revisited with OQ-3); one component per directory `packages/components/src/<name>/`; per-component custom properties grammar `--tk-<component>-<slot>`; MIT, semver, changelog per release, unofficial disclaimer in every published artifact.

AR-15 (Scaffold obligations): `npx transitions-dev add --free` at scaffold; CI wiring (mechanics at scaffold — lint, tests, gen check, impeccable step); z-scale + motion tokens land with the token package.

### UX Design Requirements

UX-DR1: Light theme token layer per DESIGN.md frontmatter — brand yellow scale (#FFDD2D/#FCC521/#FAB619), ink scale, gray/lightblue surfaces, functional blue/green/red scales, semantic aliases including AA overrides (text-secondary #616871, focus-ring #1771E6, link-on-tint #1464CC).

UX-DR2: Dark theme token layer per authored palette — dark-base #1A1A1A, tonal surface steps (#222/#292929/#2F2F2F/#373737), white-alpha text trio (100%/72%/50%), dark-field, dark-link #66A3FF, dark-error #FF7B74, dark-focus-ring; dark tints derived (L≈16–20%, hue kept; charcoal invariant); tonal elevation replaces shadows.

UX-DR3: Typography tokens — h1–h6 50/44/36/28/24/20px (700 h1–h2, 500 h3–h6), body l/m/s/xs 17/15/13/12px (400; bold = 500, never 600+), caps-s (+1px tracking, uppercase applied at render); `--tk-font-*` slots with system fallbacks; first family is a consumer-supplied brand-font slot (Inter recommended default — OQ-2 open).

UX-DR4: Radius system, two registers — pill (`full`) for all controls/badges/active tabs; xxl 32px promo/feature cards, xl 24px service cards, md 12px fields, xs/sm 4/8px dense UI; registers never mix within one component.

UX-DR5: Spacing — 4-based scale 4…120px, container 1200px, grid-gap 20px; 96–120px vertical section rhythm; 2-up/3-up equal-column grids.

UX-DR6: Shadow system — semantic layers default/default-hover/popover/dropdown/modal/tooltip as extracted; tinted cards stay flat (no shadows); dark theme disables shadows for tonal steps.

UX-DR7: Motion tokens — expressive/productive curve pairs + durations 75/150/300/500/700ms per DESIGN.md motion block.

UX-DR8: Card tint automatic text-pairing — dark text on gray/bluegray/mint/beige, white text on charcoal; tint variant sets pairing automatically.

UX-DR9: The 19 behavioral contracts per EXPERIENCE.md Component Patterns — including: Button single-primary per view cluster + loading keeps width + disabled no pointer events; Input label+placeholder both supported, badge slot announced after label, validation on blur via aria-describedby, error never steals focus; Select native-equivalent keyboard (arrows/Enter/Esc/typeahead) + aria-selected + close on outside click/focus loss; Checkbox Space toggle, clickable label, indeterminate; SegmentedRadio arrows + selection-follows-focus; ThumbnailPicker radio-group semantics, 72px tiles, ring on selected, row-major arrows; ProgressBar determinate default + indeterminate reduced-motion-safe pulse; Tabs tablist/tab/tabpanel, arrow cycle, Home/End, automatic activation, panel-only swap animation; Navbar sticky, shadow shrink-in on scroll, yellow active underline, burger <768px with focus-trapped drawer; Footer landmark + link columns as lists; PromoCard CTA carries the action (card not clickable), lazy art slot, tint auto-pairing; FeatureCard 2-up + charcoal editorial variant with bleed art; ServiceCard text link is the action, icon aria-hidden; ArticleCard "Читать" link covers card via ::after (single tab stop); Modal focus trap + restore, Esc + overlay dismiss (destructive needs explicit button), scroll lock, productive entrance/exit, one level deep; Tooltip hover+focus show with 300ms delay, Esc/hide-on-blur dismiss, no focusable content, viewport flip, icon trigger gets accessible name; Toast auto-dismiss 5s (configurable), pause on hover/focus, aria-live polite (destructive role=alert), bottom-right stack max 3.

UX-DR10: State patterns per EXPERIENCE.md — hover token step 150ms; focus-visible 2px token ring offset 2px never removed; active/press next token step 75ms scale-free; disabled 40% opacity no pointer events aria-disabled; loading in-place spinner width frozen label kept for SR; error red message + icon + aria-invalid + described-by; empty zero-state copy slot; skeleton gray-200 blocks matching final layout, reduced-motion static; theme switch token layer only 0ms default.

UX-DR11: Unified focus ring — 2px `{colors.focus-ring}` (light) / `{colors.dark-focus-ring}` (dark), offset 2px, never ink.

UX-DR12: Interaction primitives — full keyboard matrix (Tab/Shift-Tab, arrows, Space, Esc, Home/End); focus management rules (Modal traps+restores, drawer traps, Toast never focuses, Select returns focus to trigger); tab order = reading order; touch parity — every hover affordance has tap + keyboard equivalents.

UX-DR13: Accessibility floor — WCAG 2.1 AA all 19; roles/names/states correct by construction; interactive targets ≥44×44px effective (compact 32px Button ships corrective min-height padding — improvement, fidelity checks cover visuals not hit targets); announcements via aria-live only for Toast/ProgressBar optional narration; SR spot-checks recorded per component group; both themes pass contrast per the AA-override table.

UX-DR14: Responsive — ≥1024px full layout (container 1200, 2-up/3-up grids, full Navbar); 768–1023px one column-step collapse, full Navbar until 768; <768px single column, burger drawer, full-width hero CTA, card padding one step down, mobile heading mapping (site L/M/S).

UX-DR15: Voice and microcopy — calm bank-grade second person, verbs no exclamation marks, numbers with spaces ("1 331 ₽"), localization-ready string slots (no baked-in concatenation); single language v1 (OQ-4).

UX-DR16: Docs surfaces — getting-started index (install, theming, font slot, token table), 19 component pages (live default, variants, interactive states, theming demo, a11y notes, API table), token reference with light/dark values side by side, theming guide; unofficial disclaimer on every docs surface.

UX-DR17: Yellow usage discipline — yellow exclusively for primary action and active indicators; ink text on yellow (never white); yellow never for links/icons-at-rest/decoration; active indicators always redundant with text weight or shadow (WCAG 1.4.11).

### FR Coverage Map

FR-1: Epic 1 — tokens package extracted per DESIGN.md, canonical listing, zero hard-coded values
FR-2: Epic 1 — light + dark theme layers, attribute-based switch, markup-identical restyle
FR-3: Epic 1 — CONVENTIONS.md authored + checklist; Epic 2 — React API frozen at Input, enforced after
FR-4: Epic 1 — Button (#1) as pipeline pilot; Epic 2 — forms/indicators #4–9; Epic 3 — primitives/navigation/cards #2–3, #10–16; Epic 4 — overlays #17–19
FR-5: Epic 4 — overlay controller + Modal/Tooltip/Toast behavior contract
FR-6: Epic 2/3/4 — AA per component as built; Epic 5 — 19/19 sweep verification
FR-7: Epic 1 — motion tokens + shadow-root-adapted t-* recipes; Epic 2/3/4 — per-component motion
FR-8: Epic 1 — docs skeleton + Button story; Epic 2/3/4 — per-component stories; Epic 5 — 19/19 completion
FR-9: Epic 1 — impeccable hooks enforced at edit time; Story 1.8 — CI step wired and verified failing-on-break; Story 5.6 — kit-wide sweep, SM-1 evidenced
FR-10: Epic 1 — visual test harness + pinned env + Button baseline; Epic 2 (Story 2.0 capture pack; per-component baselines) / Epic 3 / Epic 4; Epic 5 — 16/16 fidelity + 3/3 pattern-consistency verified + assumption flags resolved
FR-11: Epic 5 — npm publish, MIT, semver, changelog, unofficial labeling (build config seeded in Epic 1)

NFR/AR/UX-DR coverage: workspace/stack/pipeline ARs land in Epic 1; UX-DR1–8 (token layers) in Epic 1; UX-DR9–17 distribute across Epics 2–4 per component and Epic 5 (docs surfaces UX-DR16, discipline checks UX-DR17 at Story 5.6; UX-DR10 state rows closed at 2.6/2.7/3.6/5.5).

## Epic List

### Epic 1: Installable themed kit foundation (tokens + pipeline + pilot component)
A developer can set up the workspace, build the token layers (light + dark), and render a themed Button through the full pipeline (Lit core → CEM → React wrapper → Storybook story with a11y checks and a visual baseline). Delivers the substrate every later component inherits: pinned stack, workspace lint, CI gates (impeccable step, gen check, tests), CONVENTIONS.md, motion tokens with shadow-root-adapted transitions.dev recipes, and the pinned visual-regression harness.
**FRs covered:** FR-1, FR-2, FR-3 (conventions), FR-4 (#1 Button), FR-7 (harness), FR-8 (skeleton), FR-9, FR-10 (harness), FR-11 (build config seed)

### Epic 2: Forms and progress (the reference application form assembles from the kit)
A developer can assemble the reference application form — Input with inline badge and validation, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar — all keyboard- and screen-reader-complete (Lena's journey UJ-3). Contains the API-freeze story: the React surface convention and overlay API are decided at Input and frozen from there.
**FRs covered:** FR-4 (#4–9), FR-3 (freeze + enforcement), FR-6, FR-7, FR-8, FR-10 (per component)

### Epic 3: Navigation, content cards, and homepage composition
A developer can rebuild the reference homepage above the fold from kit components — TextLink, Badge/Chip, Tabs, Navbar (with burger drawer), Footer, PromoCard, FeatureCard (incl. charcoal editorial), ServiceCard, ArticleCard — with tint auto-pairing and the composability check passing (Anya's journey UJ-1).
**FRs covered:** FR-4 (#2–3, #10–16), FR-3, FR-6, FR-7, FR-8, FR-10 (per component; 16/16 reference-grounded complete at epic end)

### Epic 4: Overlays (dialogs, tooltips, toasts)
A developer can open Modal, Tooltip, and Toast that behave per the overlay contract — focus trap/restore, dismiss patterns, aria announcements, stacking — all owned by the single overlay controller (AD-12). Derived components pass pattern-consistency checks (floating-card / info-pill anatomy).
**FRs covered:** FR-4 (#17–19), FR-5, FR-6, FR-7, FR-8, FR-10 (pattern-consistency)

### Epic 5: Release readiness (verified quality + published package)
A consumer can install from npm and render Button from the README example (UJ-1/SM-6). Full-kit verification sweeps (AA 19/19, dark 19/19, stories 19/19, fidelity 16/16 + 3/3, impeccable zero blockers), docs completion (token reference, theming guide, getting started with disclaimer), MIT + semver + changelog + unofficial labeling.
**FRs covered:** FR-6 (sweep), FR-8 (completion), FR-10 (verification), FR-11

*Component-story gate (applies to every component story below, spelled out once here):* the story is done when the component passes impeccable with zero blockers, `@axe-core/playwright` checks pass on its story in BOTH themes, its Storybook story covers default + all variants + theming demo + a11y notes **including the keyboard-only interaction checklist (FR-6)**, stateful components ship controlled + uncontrolled modes per CONVENTIONS.md **with a generated React wrapper from CEM (AD-1/AD-5)**, its visual baseline is approved (reference-grounded: side-by-side vs tbank.ru capture attached to the baseline PR; derived: first approved render), and all motion paths have a `prefers-reduced-motion` variant. A component without stories does not merge (AD-7).

*Run-mode note (autonomous run, 2026-09-21):* while the maintainer is away, baselines are recorded as **PROVISIONAL** — the side-by-side capture is archived alongside the baseline, automated kit-vs-kit comparison enforces drift from provisional approval onward, and the maintainer confirms or re-takes baselines as a batched human gate on return (formalized in Story 5.5).

---

## Epic 1: Installable themed kit foundation (tokens + pipeline + pilot component)

A developer can set up the workspace, build the token layers (light + dark), and render a themed Button through the full pipeline (Lit core → CEM → React wrapper → Storybook story with a11y checks and a visual baseline).

### Story 1.1: Scaffold the multi-package workspace on the pinned stack

As a kit maintainer,
I want a pnpm workspace with `tokens`/`components`/`react`/`docs` packages on the pinned stack and a green build/test/lint baseline,
So that every later component inherits a consistent build, lint, and quality pipeline instead of retrofitting one.

**Acceptance Criteria:**

**Given** a clean clone of the repository with Node >= 20 and pnpm 12.5.1 installed,
**When** the maintainer runs `pnpm install && pnpm build && pnpm test`,
**Then** all four packages install, build (Vite 8 lib mode, ESM-only, TS 7 strict, `.d.ts` from source), and pass an empty test suite (Vitest 5.0.1) with zero errors.
**And** workspace lint enforces the one-way import rule — `components→tokens`, `react→components`, `docs→{react, components, tokens}` — and any other cross-package import fails lint (AD-4).
**And** `npx transitions-dev add --free` has been run at scaffold and the raw `t-*` CSS is vendored into the repo (AD-15) — the AD-9 shadow-root adaptation (folding motion values into `--tk-*` tokens) happens in Story 1.2 where the motion tokens are emitted.
**And** every package declares `engines: { node: ">=20" }` and no CommonJS artifacts are emitted (AR-6/NFR-3).

*(CI pipeline wiring — lint + test + gen check + impeccable step — is Story 1.8, after the components exist for those gates to bite on.)*

### Story 1.2: Light token layer — the full extracted token system as `--tk-*` custom properties

As a consuming developer,
I want the complete light-theme token system (colors incl. AA overrides, typography, radius, spacing, shadows, motion, z-scale) emitted as `--tk-*` CSS custom properties with TS types and one canonical listing,
So that my pages compose from named tokens only and never hard-code a color, radius, shadow, or duration (FR-1).

**Acceptance Criteria:**

**Given** the DESIGN.md frontmatter and body rules (normative per AD-3),
**When** the tokens package is built,
**Then** every color, typography, rounded, spacing, shadow, and motion entry from DESIGN.md is emitted on `:root` under a stable `--tk-*` name, including the z-scale (`--tk-z-nav/dropdown/popover/tooltip/modal/toast`) and motion tokens (curves + 75/150/300/500/700ms durations).
**And** the AA overrides land as semantic tokens exactly per DESIGN.md Colors (text-secondary #616871, focus-ring #1771E6, link-on-tint #1464CC), and `--tk-font-*` slots ship the system-fallback stack with the first family as the consumer brand-font slot (Inter documented as recommended default — OQ-2 open).
**And** a canonical token listing (generated or source-of-truth doc in the tokens package) names every token; TS types expose them programmatically.
**And** a page styled from the tokens contains zero hard-coded color/radius/shadow/font values outside the token layer — verified by a repo-wide lint/grep check added to CI (FR-1 consequence).
**And** every token value traces to the recorded extraction notes (DESIGN.md reference anchors: `.working/tokens-extract-tbank-ru.md`, tbank-home-full.png) — values carrying a DESIGN.md `[ASSUMPTION]` flag (mint/beige tints, xxl/xl radii, dark-tint first pass) are emitted with the flag annotated in the canonical listing and are verified/resolved in Stories 3.6 and 5.6.
**And** the motion tokens fold the vendored transitions.dev values per AD-9: recipes consume `--tk-*` custom properties (their `:root`/`html[data-theme]` selectors never match inside shadow stylesheets), and dark overrides re-express as inherited custom properties.

### Story 1.3: Dark token layer — attribute-switched dark theme with tonal elevation

As a consuming developer (Marat, UJ-2),
I want a `[data-theme="dark"]` token layer implementing the authored dark palette,
So that flipping one attribute on `<html>` restyles every kit surface with zero markup changes (FR-2).

**Acceptance Criteria:**

**Given** a page composed of kit components styled via `--tk-*` tokens,
**When** `data-theme="dark"` is toggled on `<html>`,
**Then** the dark palette loads per DESIGN.md — dark-base #1A1A1A, tonal surface steps replacing shadows, white-alpha text trio, dark-field, dark-link #66A3FF, dark-error #FF7B74, dark-focus-ring, derived dark tints (charcoal invariant) — and no component markup, class, or inline style changes.
**And** yellow keeps ink text in dark mode; borders use dark-border white-alpha; shadows are disabled/reduced per the tonal-elevation rule (UX-DR2).
**And** the contrast pairs in the DESIGN.md AA-override table pass in dark mode (dark-link/dark-error/dark-focus-ring values verified ≥ 4.5:1 where text, ≥ 3:1 where non-text).
**And** the theme switch itself runs at 0ms by default with an optional 150ms cross-fade, both reduced-motion-safe (UX-DR10).

### Story 1.4: Component API convention documented and enforced

As a component author,
I want `packages/components/CONVENTIONS.md` defining the uniform API convention with a review checklist,
So that all 19 components expose one predictable surface and PR review enforces it (FR-3, AD-5).

**Acceptance Criteria:**

**Given** the architecture spine's AD-5 and the Consistency Conventions table,
**When** CONVENTIONS.md is authored,
**Then** it specifies: camelCase Lit reactive props; events as `<prop>-change` (value updates, `detail: { value }`) and `<verb>` bare (occurrences); controlled + uncontrolled modes with identical semantics for every stateful component; slot/content patterns; the `tk-` element prefix; and the `--tk-<component>-<slot>` custom-property grammar (same slot name for the same role across components).
**And** it includes the API-consistency review checklist to run on every component PR — including "no imperative DOM access at construction time (AD-10/SSR-compat)" and "detector ignore-rule changes are themselves reviewed and justified (FR-9)" — and states the freeze protocol: the React-surface API (hook vs prop style, controlled-mode semantics) and overlay API are decided and frozen at the first stateful PR (Input) — later components conform.
**And** the docs package links to it from a stable URL that component story pages will reference.

### Story 1.5: Storybook docs skeleton with theming and disclaimer

As a kit consumer evaluating the library,
I want a running Storybook docs site with a light/dark theme toggle and an unmistakable unofficial-project disclaimer,
So that I can browse the kit's components and know immediately what this project is and is not (FR-8 substrate, FR-11 labeling, UX-DR16).

**Acceptance Criteria:**

**Given** the docs package scaffolded on Storybook 10.6 (`@storybook/web-components-vite` + addon-a11y),
**When** the maintainer runs `pnpm dev` in `docs`,
**Then** Storybook serves with an index/getting-started stub and a theme toggle that flips `data-theme` on the preview `<html>`, restyling all stories live.
**And** the unofficial disclaimer (study/recreation project; not affiliated with or endorsed by T-Bank) renders on the docs index and in the Storybook layout chrome — visible in both themes.
**And** the a11y addon is active so stories render with violation highlighting available.

### Story 1.6: Visual regression harness with pinned capture environment

As a kit maintainer,
I want a Playwright visual-regression harness with a pinned capture environment and kit-vs-kit baselines,
So that any visual drift beyond the 1.5% perceptual tolerance fails CI instead of shipping silently (FR-10, AD-8).

**Acceptance Criteria:**

**Given** Playwright 1.63.0 installed at the workspace root with `@axe-core/playwright` 4.13.0,
**When** the visual test suite is configured,
**Then** story URLs are auto-discovered by the suite (glob over the docs package's story index) so every story that exists when a component lands is picked up by a `toHaveScreenshot` test (`maxDiffPixelRatio: 0.015`) with zero per-component wiring; the empty-story suite runs green.
**And** the capture environment is pinned: fixed viewport + device-scale-factor, `prefers-reduced-motion: reduce` forced, pinned test font (**Inter**, matching the OQ-2 default recommendation; brand font unbundled), and a single baselines root directory; the pinning is documented in the harness config comments.
**And** baselines are kit-vs-kit (first-approved kit renders); the baseline workflow document states the human side-by-side gate (reference capture attached for reference-grounded components), the provisional-approval rule for the autonomous run, and that intentional changes require explicit baseline re-approval in the same PR.
**And** axe checks are wired into the same suite against every discovered story URL in both themes — the harness is proven end-to-end (screenshot + axe both themes + baseline creation) by the first component story (1.7 Button).

### Story 1.7: Button — pilot component through the full pipeline

As a consuming developer (Anya, UJ-1),
I want the Button component (primary-yellow / secondary-white / inverse pill variants) available as `tk-button` and as a generated React component,
So that I can drop the reference's signature CTA into my page and trust the whole kit pipeline it proves (FR-4 #1).

**Acceptance Criteria:**

**Given** the tokens package (1.2/1.3) and CONVENTIONS.md (1.4),
**When** Button is implemented as a Lit element in `packages/components/src/button/`,
**Then** it renders in a shadow root styled exclusively via `--tk-*` tokens: primary yellow-100 bg + ink-300 text, secondary white + default shadow, inverse ink-300 + white text; heights 56/48 and compact 32 with corrective padding to a 44px effective target; pill radius; hover yellow-200 / active yellow-300 at 150ms/75ms from motion tokens.
**And** the behavioral contract holds: loading state keeps width and label for SR (in-place spinner); disabled = no pointer events, announced as disabled; optional left icon slot (EXPERIENCE.md Button row).
**And** the React wrapper is generated from CEM via `@lit/react` with the event-map registry, handlers receive unwrapped values, and `pnpm gen` leaves a clean diff (AD-1).
**And** the story covers default + all variants + interactive states + theming demo + a11y notes, and passes the component gate (impeccable zero blockers; axe both themes; reduced-motion path verified).
**And** the visual baseline is approved with a side-by-side against the tbank.ru hero-CTA capture attached to the baseline PR (FR-10) — and this first baseline proves the visual harness (1.6) end-to-end: screenshot comparison, axe in both themes, and baseline creation all run through it.

### Story 1.8: CI pipeline with all quality gates live

As the kit maintainer,
I want CI (GitHub Actions) running lint + test + the CEM generation check + the impeccable detector step + the visual/axe suite on every push,
So that the merge gates are enforced mechanically from the first component onward (FR-9, AD-1, AD-7).

**Acceptance Criteria:**

**Given** the scaffolded workspace with Button shipped through the full pipeline (1.1–1.7),
**When** CI is wired,
**Then** a workflow runs on push/PR: workspace lint (one-way imports), Vitest, `pnpm gen && git diff --exit-code` (CEM analyzer 0.11.0), the impeccable detector step (zero blockers on changed UI files), and the Playwright visual + axe suite — green on the wiring commit.
**And** a deliberately broken check (e.g., an un-regenerated wrapper or an import-rule violation) fails CI in a verification run, then is reverted.
**And** detector ignore-rule changes require a PR modifying a reviewed config file (governance per FR-9).

---

## Epic 2: Forms and progress (the reference application form assembles from the kit)

A developer can assemble the reference application form — Input with inline badge and validation, Select, Checkbox, SegmentedRadio, ThumbnailPicker, ProgressBar — all keyboard- and screen-reader-complete (UJ-3). Contains the API-freeze story and the overlay controller foundation.

### Story 2.0: Reference capture pack for all remaining components

As the kit maintainer,
I want hi-res tbank.ru captures for every reference-grounded component not yet captured (forms, progress, navigation, content cards),
So that each component's fidelity side-by-side (the component gate) has its reference input ready before implementation starts.

**Acceptance Criteria:**

**Given** playwright-cli with the project session (`PLAYWRIGHT_CLI_SESSION=tinkoff-ui`) and tbank.ru reachable,
**When** the capture pack is taken,
**Then** hi-res captures exist for: application-form fields (Input), the "повышенный кэшбэк" field (Select), consent line (Checkbox), citizenship control (SegmentedRadio), card-design selector (ThumbnailPicker), progress strip (ProgressBar), debit/credit/deposit switcher (Tabs), site header desktop + mobile (Navbar), site footer (Footer), 3-up product grid (PromoCard), Платинум/Т-Ж banners (FeatureCard), services grid (ServiceCard), "Актуально сейчас" items (ArticleCard), article links (TextLink), incentive badges (Badge/Chip).
**And** captures land under `.playwright-cli/` with an index note mapping each file to its component; the mint/beige tint surfaces are captured at native zoom for the 3.6 assumption check.
**And** vision analysis of the captures (zai-mcp-server on the saved files — the harness is text-only for images) records measured hex/radius observations into a `.working/captures-2026-09-21.md` note for baseline side-by-sides.

### Story 2.1: Input with validation — and the frozen React/overlay API

As a consuming developer,
I want the Input component (label, placeholder, inline badge slot, required state, blur validation with described-by error) with the React-surface API frozen from this component onward,
So that forms are accessible from the box and every later component's wrapper API is predictable (FR-4 #4, FR-3, AD-5).

**Acceptance Criteria:**

**Given** CONVENTIONS.md and the tokens layers,
**When** Input is implemented per EXPERIENCE.md (label + placeholder both supported — placeholder never replaces label; required marked with asterisk + aria-required; inline badge slot announced after the label; validation on blur; message tied via aria-describedby; error never steals focus),
**Then** a keyboard-only + screen-reader session passes the field: label announced, badge read after it, error heard on next visit without focus theft (Lena's UJ-3 step 1–3).
**And** it ships controlled (`value` + `value-change`) and uncontrolled modes with identical semantics; the React wrapper exposes unwrapped-value handlers.
**And** the error state renders per State Patterns: red message + icon, `aria-invalid`, tied via aria-describedby (already covered above) — message text follows the voice table (calm, no exclamation).
**And** the React-surface API and the overlay usage API (imperative + declarative patterns for later Modal/Toast) are decided in this story and recorded in CONVENTIONS.md as FROZEN — later components conform, deviations require a logged exception.
**And** field visuals come from tokens (surface-field fill, radius-md, 52px height, gray-500 placeholder, 2px focus-ring offset 2px; dark: dark-field fill) and the component gate passes, including an approved visual baseline with side-by-side vs the application-form capture.

### Story 2.2: Overlay controller — single owner of mounting, scroll-lock, positioning, stacking

As a component author,
I want the shared overlay controller in `packages/components` owning top-layer mounting (with fallback), refcounted body scroll-lock, viewport-flip positioning, and cross-instance stacking,
So that Modal, Tooltip, Toast, Select menus, and the Navbar drawer never wage z-index wars or double-lock scroll (AD-12).

**Acceptance Criteria:**

**Given** the z-scale tokens from 1.2 and the frozen overlay API decision from 2.1,
**When** the controller is implemented as a framework-agnostic module (no visual surface of its own),
**Then** mounting uses the top layer with a fallback path, and every floating surface rendered through it inherits its z-order strictly from `--tk-z-*` tokens — the controller and its consumers contain zero hard-coded z-index values.
**And** the scroll-lock is refcounted: two overlapping lock consumers (e.g., Navbar drawer opening over a locked page) hold both locks; body scroll restores only when the last one releases.
**And** positioning flips near viewport edges (verified at each edge and corner) and stacking orders Toast instances bottom-right with max 3 visible (oldest collapses).
**And** the controller (or a shared utility it exports) provides the focus-trap/restore primitive consumed later by Modal (4.1) and the Navbar drawer (3.4) — neither implements its own trap.
**And** the controller is unit-tested standalone (Vitest) covering mount/unmount, refcount under simultaneous consumers, flip at edges, stack overflow, and trap/restore cycling.

### Story 2.3: Select — native-equivalent keyboard dropdown

As a form developer,
I want the Select component (field language + chevron, menu with the site's dropdown shadow) with native-equivalent keyboard behavior,
So that the reference's "повышенный кэшбэк"-style field is fully operable without a mouse (FR-4 #5, EXPERIENCE.md Select row).

**Acceptance Criteria:**

**Given** the overlay controller (2.2) and field tokens,
**When** Select is implemented,
**Then** keyboard parity holds: Enter/Space opens, arrows navigate, Enter selects, Esc closes, typeahead jumps, Home/End work; the selected option conveys `aria-selected`; the trigger has combobox semantics with an accessible name.
**And** the menu closes on outside click AND on focus loss, returning focus to the trigger; menu positioning and z-order come from the overlay controller (viewport flip included).
**And** value semantics follow CONVENTIONS.md (`value`/`value-change`, controlled + uncontrolled) with the React wrapper generated from CEM; the error state renders per State Patterns (red message + icon, `aria-invalid`, described-by).
**And** the component gate passes (impeccable, axe both themes, story complete, reduced-motion) with an approved visual baseline side-by-side vs the reference field capture.

### Story 2.4: Checkbox — consent-style with indeterminate

As a form developer,
I want the Checkbox (20px box, radius-xs, ink check on yellow fill when checked, clickable label, indeterminate prop),
So that consent lines and parent toggles work with Space-key and screen-reader correctness (FR-4 #6).

**Acceptance Criteria:**

**Given** tokens and CONVENTIONS.md,
**When** Checkbox is implemented,
**Then** Space toggles it, the label is clickable and tied to the input, `checked`/`indeterminate` render per the visual spec (20px, radius-xs 4px, ink-300 check on yellow-100 fill), and checked/indeterminate/mixed states announce correctly.
**And** the consent pattern (label link + checkbox) ships as a composed story example, not a separate component.
**And** the component gate passes with an approved visual baseline side-by-side vs the consent-line capture.

### Story 2.5: SegmentedRadio — Да/Нет pill group

As a form developer,
I want the SegmentedRadio (pill track, selected segment solid fill + dot indicator) with radio-group semantics,
So that binary choices behave exactly like the reference citizenship control under keyboard and SR (FR-4 #7).

**Acceptance Criteria:**

**Given** tokens and CONVENTIONS.md,
**When** SegmentedRadio is implemented,
**Then** arrow keys move within the group and selection follows focus; exactly one option is selected at any time; roles/names/states are radio/radiogroup-correct by construction.
**And** `value`/`value-change` semantics + generated React wrapper follow the frozen API.
**And** the component gate passes with an approved visual baseline side-by-side vs the citizenship control capture.

### Story 2.6: ThumbnailPicker — selectable tiles with ring

As a form developer,
I want the ThumbnailPicker (72px tiles wrapping to a grid, 2px ink ring on selection) with radio-group semantics and row-major arrow navigation,
So that card-design selectors work like the reference's (FR-4 #8).

**Acceptance Criteria:**

**Given** tokens and CONVENTIONS.md,
**When** ThumbnailPicker is implemented,
**Then** tiles are radio semantics over visual tiles (arrow keys navigate row-major, selection announced via the ring + state), 72px tiles wrap to a grid, selected state = 2px ink border ring per DESIGN.md; an empty state renders the zero-state copy slot (never blank) per State Patterns.
**And** the component gate passes with an approved visual baseline side-by-side vs the card-design selector capture.

### Story 2.7: ProgressBar — determinate default, safe indeterminate

As a form developer,
I want the ProgressBar (4px gray-200 track, blue-100 fill, pill radius; label and % optional slots; indeterminate variant) with optional SR narration,
So that "Уже заполнено 5%"-style progress feedback is honest and motion-safe (FR-4 #9).

**Acceptance Criteria:**

**Given** tokens and CONVENTIONS.md,
**When** ProgressBar is implemented,
**Then** determinate is the default with value/min/max exposed; label and percentage render as optional slots; indeterminate uses a reduced-motion-safe pulse (static under `prefers-reduced-motion`); an empty/zero state renders the zero-state copy slot (never blank) per State Patterns.
**And** optional aria-live narration is available but not forced (a11y floor: announcements via aria-live only here).
**And** the component gate passes with an approved visual baseline side-by-side vs the progress capture.

### Story 2.8: Composed application form — UJ-3 walkthrough recorded

As the kit maintainer,
I want the reference application form assembled from the Epic 2 components with a recorded keyboard + screen-reader walkthrough (Lena's UJ-3),
So that the epic's stated deliverable — the form assembles and works end-to-end — is evidenced, not just its parts.

**Acceptance Criteria:**

**Given** Input, Select, SegmentedRadio, Checkbox, ProgressBar, Button from Epics 1–2,
**When** the composition example is assembled in the docs package,
**Then** Lena's flow walks clean: Tab announces label + required with the badge read after; Select opens on Enter, arrows, Enter picks; SegmentedRadio arrows Да/Нет with focus-follows-selection; submit shows a validation error via aria-describedby without focus theft; ProgressBar reflects form completion.
**And** the walkthrough (steps + SR observations) is recorded in the example's story notes; the Toast leg of UJ-3 is explicitly deferred and re-walked in Story 4.3.
**And** the composed form passes axe in both themes and the impeccable audit with zero blockers.

---

## Epic 3: Navigation, content cards, and homepage composition

A developer can rebuild the reference homepage above the fold from kit components — TextLink, Badge/Chip, Tabs, Navbar (with burger drawer), Footer, PromoCard, FeatureCard (incl. charcoal editorial), ServiceCard, ArticleCard — with tint auto-pairing and the composability check passing (UJ-1).

### Story 3.1: TextLink

As a page author,
I want TextLink (blue-100, underline on hover, keyboard-visible underline on focus; inline-legal variant in body-xs gray),
So that "Читать"/"Смотреть"/"Подробнее" and legal links match the reference and stay AA on tints (FR-4 #2).

**Acceptance Criteria:**

**Given** tokens incl. link-on-tint,
**When** TextLink is implemented (inline within text or standalone; standalone gets body-m),
**Then** hover darkens to blue-200 at 150ms, focus shows a visible underline, and on tinted surfaces it uses the link-on-tint token (AA-override table).
**And** the component gate passes with an approved visual baseline side-by-side vs the article-link capture.

### Story 3.2: Badge/Chip

As a page author,
I want the Badge/Chip (pill chip; incentive variant green-100 bg + ink text; stat variant ink-300 bg + white text; dynamic count capping at "99+"),
So that "+30%" incentives and stat chips render identically to the reference and never appear interactive (FR-4 #3).

**Acceptance Criteria:**

**Given** tokens and the badge typography (body-xs),
**When** Badge/Chip is implemented,
**Then** counts > 99 render "99+"; the chip is never interactive alone (no focus stop); variants style per spec.
**And** the component gate passes with an approved visual baseline side-by-side vs the incentive-badge capture.

### Story 3.3: Tabs — pill active state with automatic activation

As a page author,
I want Tabs (text tabs; active = white pill + default shadow inside an invisible track; full tab semantics, automatic activation),
So that the debit/credit/deposit switcher behaves identically to the reference for keyboard and SR users (FR-4 #10).

**Acceptance Criteria:**

**Given** tokens and motion mapping (tab swaps → expressive standard),
**When** Tabs is implemented,
**Then** tablist/tab/tabpanel semantics are correct; arrow keys cycle; Home/End jump; activation is automatic (reference behavior); the yellow-redundancy rule holds (active pill = ink text + shadow, never yellow alone).
**And** panel swap animates content only, not the tab bar, with a reduced-motion path (opacity-only/0ms).
**And** the component gate passes with an approved visual baseline side-by-side vs the switcher capture.

### Story 3.4: Navbar — sticky header with burger drawer

As a page author,
I want the Navbar (72px, white, logo slot left, links with yellow active underline, utilities right; sticky with shadow shrink-in; burger drawer < 768px),
So that site headers match the reference and stay operable at mobile widths (FR-4 #11, UX-DR14).

**Acceptance Criteria:**

**Given** tokens and the overlay controller (scroll-lock + focus trap for the drawer),
**When** Navbar is implemented,
**Then** it is sticky, shadow shrinks in on scroll, the active section shows the yellow underline paired with 700-weight ink text (yellow-redundancy rule), and search/account utility slots exist.
**And** below 768px it collapses to a burger opening a focus-trapped drawer with refcounted scroll-lock from the controller; drawer dismiss restores focus to the burger.
**And** the component gate passes in BOTH desktop and mobile viewports with an approved visual baseline side-by-side vs the site header capture.

### Story 3.5: Footer — grouped directory with pill quick-links

As a page author,
I want the Footer (landmark with nav; uppercase caps-s group headers; 6–7 link columns as lists; ink-300 pill quick-links; bold phone block; body-xs legal fine-print),
So that page footers reproduce the reference's directory pattern accessibly (FR-4 #12).

**Acceptance Criteria:**

**Given** tokens incl. caps-s (uppercase applied at render),
**When** Footer is implemented,
**Then** it is a landmark (contentinfo) whose link columns are lists; pill quick-links and phone block render as optional slots; legal fine-print is body-xs with inline links.
**And** the component gate passes with an approved visual baseline side-by-side vs the site footer capture.

### Story 3.6: PromoCard — tinted card with automatic text pairing

As a page author,
I want the PromoCard (tinted bg, radius-xxl, lazy art slot, title/desc, white pill CTA bottom-center; tint variant sets text pairing automatically),
So that 3-up product grids look exactly like the reference's — flat tinted cards, no card-level click (FR-4 #13, UX-DR8).

**Acceptance Criteria:**

**Given** the tint tokens (gray/bluegray/mint/beige/charcoal) and card padding/radius tokens,
**When** PromoCard is implemented,
**Then** the whole card is NOT clickable — the CTA button carries the action; the art slot lazy-loads; setting the tint automatically pairs text (dark text on pastel tints, white on charcoal); tinted surfaces stay flat (no shadow); a content skeleton state is available (gray-200 blocks matching final layout, static under reduced-motion) per State Patterns.
**And** the mint/beige tint hex values — flagged `[ASSUMPTION]` in DESIGN.md — are verified against the native-zoom captures from Story 2.0 and the flags resolved (values corrected or confirmed) in DESIGN.md and the token listing.
**And** the component gate passes with an approved visual baseline side-by-side vs the 3-up product grid capture.

### Story 3.7: FeatureCard — 2-up large with charcoal editorial variant

As a page author,
I want the FeatureCard (2-up scale, min-height 320px; charcoal editorial variant with white heading, white pill CTA, bleed art right),
So that Платинум / Т-Ж-style banners reproduce the reference's hero-card language (FR-4 #14).

**Acceptance Criteria:**

**Given** tokens and the PromoCard patterns,
**When** FeatureCard is implemented,
**Then** the default variant renders at 2-up scale and the editorial variant backgrounds charcoal with art bleeding right (white text pairing automatic).
**And** CTA-carries-the-action and lazy-art rules inherit; the component gate passes with an approved visual baseline side-by-side vs the banner captures (both variants).

### Story 3.8: ServiceCard

As a page author,
I want the ServiceCard (radius-xl, 24px padding, small 3D icon slot aria-hidden, title, desc, text link pinned bottom),
So that services grids match the reference with a single action per card (FR-4 #15).

**Acceptance Criteria:**

**Given** tokens,
**When** ServiceCard is implemented,
**Then** the text link is the action (icon decorative, aria-hidden; card not clickable), link pinned to the card bottom across varying description lengths.
**And** the component gate passes with an approved visual baseline side-by-side vs the services grid capture.

### Story 3.9: ArticleCard

As a page author,
I want the ArticleCard (text-only: 2-line title, desc, "Читать" link covering the whole card via a ::after stitch),
So that "Актуально сейчас" items are a single tab stop like the reference (FR-4 #16).

**Acceptance Criteria:**

**Given** tokens,
**When** ArticleCard is implemented,
**Then** the link's ::after covers the card making it one tab stop and one click target; hover states follow the state patterns; skeleton state (gray-200 blocks matching final layout, static under reduced-motion) is available for loading.
**And** the component gate passes with an approved visual baseline side-by-side vs the news-item capture.

### Story 3.10: Homepage composability check

As the kit maintainer,
I want an above-the-fold reference homepage reassembled entirely from Kit Components plus content, verified side-by-side and across breakpoints,
So that FR-4's composability consequence is proven, not asserted.

**Acceptance Criteria:**

**Given** all Epic 2 + Epic 3 components,
**When** the composition page is assembled in the docs package,
**Then** the homepage above the fold reassembles from kit components + content only (Navbar, heading, PromoCard grid, Input pair, Button, Footer), with a recorded side-by-side vs `.playwright-cli/tbank-home-full.png`.
**And** button discipline holds in the composition: exactly one primary Button per view cluster (EXPERIENCE.md Button row); secondary/inverse elsewhere.

### Story 3.11: Composition verification — breakpoints, a11y, discipline

As the kit maintainer,
I want the composed homepage verified across the responsive matrix and the full quality gates,
So that FR-4's composability consequence is closed with evidence rather than a desktop-only glance.

**Acceptance Criteria:**

**Given** the composition page (3.10),
**When** verification runs,
**Then** responsive behavior matches UX-DR14 at the three breakpoints (≥1024 full / 768–1023 one-step collapse / <768 single column + burger + full-width CTA + spacing step-down + mobile heading mapping), recorded per breakpoint.
**And** the composed page passes axe in both themes and the impeccable audit with zero blockers.

---

## Epic 4: Overlays (dialogs, tooltips, toasts)

A developer can open Modal, Tooltip, and Toast that behave per the overlay contract — focus trap/restore, dismiss patterns, aria announcements, stacking — all owned by the single overlay controller. Derived components pass pattern-consistency checks.

### Story 4.1: Modal

As an app developer,
I want the Modal (white panel radius-lg, modal shadow; dark: tonal step 3) with focus trap + restore, Esc + overlay-click dismiss, refcounted scroll lock, productive entrance/exit motion,
So that dialogs are correct for keyboard and SR users the moment they open (FR-4 #17, FR-5).

**Acceptance Criteria:**

**Given** the overlay controller (2.2) and the frozen overlay API (2.1),
**When** Modal is implemented,
**Then** it uses the controller for mounting (top-layer + fallback), z-order (`--tk-z-modal`), and scroll-lock; focus is trapped inside while open and restored to the trigger on close.
**And** Esc and overlay-click dismiss; destructive confirmations require an explicit button (overlay-click still dismisses per EXPERIENCE, but the action itself never fires from a dismiss); one nesting level supported.
**And** dialog semantics are correct (role=dialog, accessible name, aria-modal), and open/close motion uses productive entrance/exit curves with a reduced-motion path (0ms/opacity-only).
**And** the pattern-consistency check passes (floating-card anatomy, shadow/radius tokens, audit-clean, a11y-clean) against its first approved render — baseline per AD-8 derived rule.

### Story 4.2: Tooltip

As an app developer,
I want the Tooltip (ink-300 bg, white text-xs, radius-sm, tooltip shadow) showing on hover + focus after 300ms, flipping near viewport edges, never containing focusable content,
So that information icons and term hints work for pointer, keyboard, and touch (FR-4 #18, FR-5).

**Acceptance Criteria:**

**Given** the overlay controller,
**When** Tooltip is implemented,
**Then** it shows on hover AND focus after a 300ms delay, dismisses on Esc/blur/hide, flips positioning near viewport edges (controller), and its content never contains focusable elements.
**And** icon-only triggers get an accessible name; the tooltip announces politely (aria-live/described-by per APG pattern chosen at implementation and recorded in story docs).
**And** touch parity: tap on trigger shows/hides (hover is never the only path).
**And** the pattern-consistency check passes with a first-approved-render baseline.

### Story 4.3: Toast

As an app developer,
I want the Toast (white card radius-lg, default shadow, icon + message + optional action) with 5s auto-dismiss, pause on hover/focus, polite/alert variants, bottom-right stacking max 3,
So that confirmations and errors surface without stealing focus (FR-4 #19, FR-5).

**Acceptance Criteria:**

**Given** the overlay controller (cross-instance stacking) and the frozen overlay API,
**When** Toast is implemented,
**Then** auto-dismiss defaults to 5s (configurable), pauses on hover/focus, and never takes focus; aria-live="polite" by default, role="alert" for destructive.
**And** instances stack bottom-right via the controller with max 3 visible (oldest collapses); both the frozen imperative and declarative usage patterns work as documented in CONVENTIONS.md.
**And** Esc dismisses (per Interaction Primitives) and motion respects reduced-motion.
**And** the deferred UJ-3 leg closes: a form-submit Toast in the composed-form example (2.8) announces politely without stealing focus — the walkthrough note is completed.
**And** the pattern-consistency check passes with a first-approved-render baseline.

---

## Epic 5: Release readiness (verified quality + published package)

A consumer can install from npm and render Button from the README example. Full-kit verification sweeps, docs completion, MIT + semver + changelog + unofficial labeling.

### Story 5.1: A11y sweep I — method + primitives, indicators, overlays

As the kit maintainer,
I want the sweep method defined (keyboard matrix, focus-ring check, contrast per the AA-override table both themes, target sizes, reduced-motion) and applied to the primitives, indicators, and overlays groups,
So that SM-2 is evidenced group by group instead of one oversized pass (FR-6, UX-DR12/13).

**Acceptance Criteria:**

**Given** all components implemented,
**When** the sweep method is defined and applied to Button, TextLink, Badge/Chip, ProgressBar, Modal, Tooltip, Toast,
**Then** each passes keyboard operability per the Interaction Primitives matrix, visible unified focus rings, correct roles/names/states, and contrast per the AA-override table in both themes; interactive targets are ≥44×44px effective.
**And** SR spot-checks for these groups are recorded in each group's story docs, run with **VoiceOver and NVDA** (named screen readers), observations noted in the a11y section.
**And** zero animations run for these components under `prefers-reduced-motion: reduce` (playwright-cli media emulation verified).

### Story 5.2: A11y sweep II — forms

As the kit maintainer,
I want the sweep method (5.1) applied to the forms group,
So that SM-2 is evidenced where keyboard/SR correctness matters most (FR-6).

**Acceptance Criteria:**

**Given** the 5.1 method,
**When** it is applied to Input, Select, Checkbox, SegmentedRadio, ThumbnailPicker,
**Then** each passes the matrix, focus rings, roles/names/states, contrast, and target sizes in both themes; the 2.8 composed-form walkthrough re-verifies clean.
**And** SR spot-checks (VoiceOver + NVDA) for the forms group are recorded in story docs; reduced-motion verified via media emulation.

### Story 5.3: A11y sweep III — navigation and cards

As the kit maintainer,
I want the sweep method (5.1) applied to the navigation and cards groups,
So that SM-2 is evidenced for 19/19 (FR-6).

**Acceptance Criteria:**

**Given** the 5.1 method,
**When** it is applied to Tabs, Navbar, Footer, PromoCard, FeatureCard, ServiceCard, ArticleCard,
**Then** each passes the matrix, focus rings, roles/names/states, contrast, and target sizes in both themes, including the Navbar burger drawer at <768px.
**And** SR spot-checks (VoiceOver + NVDA) for these groups are recorded in story docs; reduced-motion verified via media emulation; the 3.10 composition re-verifies axe-clean.

### Story 5.4: Dark mode sweep — token-only restyling verified

As the kit maintainer,
I want dark mode verified for 19/19 components with zero component-specific hacks,
So that SM-5 is evidenced (FR-2).

**Acceptance Criteria:**

**Given** all components,
**When** the sweep flips `data-theme="dark"` across every story,
**Then** 19/19 render correctly (no illegible pairs, no leftover light-only assumptions), and a repo check confirms zero component-level theme branches — all theming flows through `--tk-*` tokens.
**And** dark tints are refined if fidelity checks against the derivation rule (L≈16–20%, hue kept) flag first-pass values (Deferred item from the spine).

### Story 5.5: Docs completion — reference, theming guide, getting started

As a kit consumer,
I want complete docs: getting started (install, theming, font slot, token table), 19 component pages complete, token reference with light/dark values side by side, and a theming guide,
So that I can adopt the kit without reading its source (FR-8, UX-DR15/16).

**Acceptance Criteria:**

**Given** the docs skeleton (1.5) and all stories,
**When** docs are completed,
**Then** 19/19 component pages ship live default + all variants + interactive states + theming demo + a11y notes + API tables, each linking CONVENTIONS.md.
**And** the token reference lists every token with light/dark values side by side; the theming guide covers switching, per-token overrides, and dark-mode pairing rules; getting-started covers install + font slot with the Inter recommendation.
**And** docs-site states per EXPERIENCE.md are present: cold-load skeleton matching layout and an empty-search state ("No matches. Try a component name." or the OQ-4-language equivalent).
**And** component microcopy follows the voice table (calm, verbs, "1 331 ₽" formatting) with localization-ready string slots; the unofficial disclaimer is present on every docs surface; docs language follows the OQ-4 decision (default EN recorded as assumption if the maintainer has not chosen).

### Story 5.6: Fidelity and discipline verification — 16/16 + 3/3, kit-wide audits, assumption closure

As the kit maintainer,
I want the fidelity ledger closed and the kit-wide discipline audits run,
So that SM-1 and SM-3 are evidenced and drift is provably absent (FR-9, FR-10, UX-DR17).

**Acceptance Criteria:**

**Given** all baselines created during Epics 1–4,
**When** the verification runs,
**Then** 16/16 reference-grounded components have baselines with tbank.ru capture side-by-sides archived in the repo, and the visual suite passes at `maxDiffPixelRatio: 0.015` with the pinned environment; 3/3 derived components pass pattern-consistency checks (anatomy, tokens, audit-clean, a11y-clean).
**And** **the maintainer's batched baseline gate runs here**: provisional baselines from the autonomous run are confirmed or re-taken side-by-side (per the run-mode note above).
**And** the impeccable detector runs kit-wide across all component sources with zero blockers (SM-1 evidenced).
**And** the yellow-usage discipline audit passes (UX-DR17): yellow appears only on primary actions and active indicators, always redundant with text weight or shadow, never on links/icons-at-rest/decoration.
**And** all DESIGN.md `[ASSUMPTION]` flags are resolved: mint/beige tints (3.6), xxl/xl radii, and the dark-tint first pass (5.4) verified against captures and the flags cleared or re-annotated in DESIGN.md and the token listing.
**And** SM-C2 holds: no component's static identity drifted from the reference (any intentional change carries baseline re-approval in its PR).

### Story 5.7: Publish the package — npm, MIT, semver, unofficial labeling

As an OSS consumer,
I want to install the kit from npm under a trademark-safe name, read the README example, and render a Button,
So that adoption is `pnpm add <package>` away (FR-11, SM-6).

**Acceptance Criteria:**

**Given** the release-ready kit,
**When** publishing is prepared,
**Then** packages ship MIT with semver and a changelog per release; breaking changes only in majors with deprecations documented.
**And** the README example renders Button in a fresh consumer project within one sitting (SM-6 self-test recorded).
**And** the unofficial disclaimer appears in README, repo description, docs, and package metadata; published naming contains no T-Bank trademarks — **maintainer gate: the OQ-3 name decision (and final `tk-` prefix call) is reserved for the maintainer; publishing does not proceed without it**.
**And** `pnpm gen && git diff --exit-code` is clean and CI is green at the release tag.
