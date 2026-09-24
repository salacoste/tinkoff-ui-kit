---
title: "PRD: tinkoff-ui-kit v1"
status: final
created: 2026-09-21
updated: 2026-09-21
---

# PRD: tinkoff-ui-kit v1

## 0. Document Purpose

This PRD defines v1 requirements for tinkoff-ui-kit — an open-source web component library
recreating the T-Bank (formerly Tinkoff) design language. It is written for the maintainer and the
downstream BMad workflows (UX, architecture, epics & stories) that consume it. It builds on the
final product brief (`_bmad-output/planning-artifacts/briefs/brief-tinkoff-ui-kit-2026-09-21/`
with its research addendum), PRODUCT.md, and the toolchain contracts in CLAUDE.md — reconciled
against all three during review (`reconcile-*.md` in this folder). Vocabulary is anchored in §3
Glossary; features are grouped with globally numbered FRs; assumptions are tagged inline and
indexed in §9.

**Reference note:** tinkoff.ru now 301-redirects to **tbank.ru** (rebrand complete). "Reference
Site" below means the tbank.ru rendering of the design language. Component scope was grounded in a
live inventory of the Reference Site consumer homepage (full-page hi-res capture + DOM snapshot,
2026-09-21, `.playwright-cli/tbank-home-full.png`), cross-referenced with inspo MCP design data.
v1's inventory covers the consumer homepage; deeper Reference Site pages may add components in v2
(delta decision recorded in FR-4 Out of Scope).

## 1. Vision

The most recognizable fintech design language in the Russian-speaking market — yellow-black,
pill-shaped, pastel-carded, 3D-illustrated — exists only inside a closed product. tinkoff-ui-kit
opens it: a token-first component library that any developer installs and uses, faithful to the
original in Phase 1 and better than it in Phase 2 (accessibility, dark mode, motion). Every
component ships through an automated design-quality gate. The ambition is to become the default
starting point for Russian-speaking fintech web projects that want this aesthetic — and a public
reference for building design systems from live products.

## 2. Target User

### 2.1 Jobs To Be Done

- As a frontend developer on a fintech project, I want recognizable, trustworthy T-Bank-style
  components off the shelf, so my product looks mass-market-professional without a designer.
- As a developer, I want tokens and theming instead of hard-coded styles, so I can switch light/
  dark and rebrand without touching component code.
- As an accessibility-conscious developer, I want components that are WCAG 2.1 AA out of the box,
  so my product passes audits because of the kit, not despite it.
- As an OSS consumer, I want clear public API, docs with live examples, semver and changelogs,
  so upgrading is boring and safe.
- As the maintainer, I want a public showcase of systematic design-engineering craft (secondary
  audience, per brief).

### 2.2 Non-Users (v1)

- Teams needing a design-language *redesign* (new brand) — the kit preserves the reference look.
- Native mobile (iOS/Android) developers — web only.
- Developers needing charts/dashboards or packaged business flows (e.g., a complete loan
  application form) — per the brief's non-goals.

### 2.3 Key User Journeys

*(Library product — journeys scaled light per template dial.)*

- **UJ-1.** Anya, solo frontend dev on a fintech landing, installs the kit, drops in Button,
  Input and PromoCard, and ships a page visually indistinguishable from the Reference Site the
  same evening.
- **UJ-2.** Marat, maintainer of a customer portal, flips the theme to dark via one token-layer
  override; every kit component restyles itself without code changes on his side.
- **UJ-3.** Lena, a keyboard-only screen-reader user, completes a form assembled from kit
  components — focus order, labels and announcements come correct from the box.

## 3. Glossary

- **Reference Site** — tbank.ru (tinkoff.ru redirects there), the visual source of truth.
- **Design Token** — named, themeable style primitive (color, type, spacing, radius, shadow,
  motion) consumed by components; never hard-coded in component code.
- **Token System** — the complete v1 token set extracted from the Reference Site.
- **Kit Component** — one of the 19 v1 components listed in FR-4.
- **Reference-grounded component** — a Kit Component with a direct Reference Site capture as its
  fidelity baseline (16 of 19).
- **Derived component** — a Kit Component whose pattern the Reference Site uses but does not show
  on the inventoried homepage (Modal, Tooltip, Toast); its baseline is a pattern-consistency
  check, not a capture.
- **Phase 1 / Phase 2** — Phase 1: faithful recreation of Reference Site look. Phase 2:
  improvements (a11y hardening, dark theme, motion) layered without breaking fidelity. Both
  phases ship inside v1 (see §6.1).
- **impeccable design audit** — the automated anti-pattern detector that runs on UI edits and
  blocks merges on findings.
- **Fidelity check** — side-by-side comparison of a rendered kit component against its Reference
  Site capture (reference-grounded components).
- **Pattern-consistency check** — verification that a derived component matches the reference
  language (floating-card/info-pill anatomy, shadow/radius tokens, audit-clean, a11y-clean).
- **Story docs** — per-component documentation page with live interactive examples.

## 4. Features

### 4.1 Design Token System

**Description:** The kit's foundation: every color, font size, spacing step, radius, shadow and
motion curve of the Reference Site, captured as named tokens with a light theme (Phase 1) and a
dark theme (Phase 2). Components consume only tokens. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-1: Extract Reference Site tokens

The kit ships a complete Token System extracted from the Reference Site using the project's
sanctioned capture methodology — playwright-cli captures (hi-res screenshots + computed styles)
cross-referenced with inspo MCP real-site design data: brand palette (including a signature
yellow in the `#FFDD2D` range and a near-black), card background tints (white, light gray, blue gray, mint,
beige, charcoal), type scale (H1…legal fine print), spacing scale, radius scale (pill controls;
24–32px cards; 12–16px inputs), two elevation levels (flat, soft shadow), and motion curve set.

**Consequences (testable):**
- Every token has a stable name and is documented in one canonical token listing.
- A page composed of kit components contains zero hard-coded color/radius/shadow values outside
  the Token System.
- Token values trace to recorded extraction notes (capture path or computed-style source).

#### FR-2: Theme switching (light + dark)

Consumers can switch light/dark themes (and override individual tokens) via a single theme layer;
all Kit Components restyle accordingly. Dark theme is a Phase 2 improvement — its palette does
not exist on the Reference Site and will be designed within brand constraints (see OQ-1).

**Consequences (testable):**
- Switching themes changes no component markup — only the token layer.
- Every component renders correctly in dark mode (no illegible pairs, no leftover light-only
  assumptions).

### 4.2 Core Component Set

**Description:** 19 Kit Components in six groups, recreating Reference Site patterns. Variants
cover the site's usage per the FR-4 inventory: Button ships primary-yellow / secondary-white /
inverse-black pill variants; Card components ship the site's background-tint variants with
automatic text-pairing. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Component API consistency

Every Kit Component follows one API convention (props naming, event naming, controlled/
uncontrolled behavior, slot/content patterns) defined and documented at architecture time,
applied uniformly, and enforced by a review checklist on every component PR.

**Consequences (testable):**
- The API convention document exists and each component's story docs link to it.
- Component PR review includes the API-consistency checklist; deviations require a logged
  exception.

#### FR-4: Ship the v1 component list

| # | Group | Component | Reference grounding |
|---|---|---|---|
| 1 | Primitives | Button (primary/secondary/inverse pill) | hero CTA, card CTAs, footer pills |
| 2 | Primitives | TextLink | "Читать"/"Смотреть"/"Подробнее", inline legal links |
| 3 | Primitives | Badge/Chip | "+30%" incentive badge, stat chips |
| 4 | Forms | Input (incl. inline badge slot, required state) | application form fields |
| 5 | Forms | Select (chevron dropdown) | "повышенный кэшбэк" field |
| 6 | Forms | Checkbox (consent style) | consent line |
| 7 | Forms | SegmentedRadio (Да/Нет pill) | citizenship control |
| 8 | Forms | ThumbnailPicker (selectable tiles + ring) | card-design selector |
| 9 | Indicators | ProgressBar (label + % + thin bar) | "Уже заполнено 5%" |
| 10 | Navigation | Tabs (pill active + shadow) | debit/credit/deposit switcher |
| 11 | Navigation | Navbar (logo slot, links, active yellow underline, utilities) | site header |
| 12 | Navigation | Footer (grouped link directory + pill bar + contact) | site footer |
| 13 | Cards | PromoCard (tinted bg, art slot, title, desc, CTA) | 3-up product grid |
| 14 | Cards | FeatureCard (large 2-up variant, incl. dark editorial variant) | Платинум / Т-Ж banner |
| 15 | Cards | ServiceCard (icon + title + desc + link) | services grid |
| 16 | Cards | ArticleCard (title + desc + link) | "Актуально сейчас" |
| 17 | Overlays | Modal | derived: floating-card pattern (cookie-banner anatomy) `[ASSUMPTION — confirmed]` |
| 18 | Overlays | Tooltip | derived: form info-pill pattern `[ASSUMPTION — confirmed]` |
| 19 | Overlays | Toast | derived: floating-card pattern `[ASSUMPTION — confirmed]` |

**Consequences (testable):**
- Each reference-grounded component (#1–16) passes a Fidelity check against its Reference Site
  capture; each derived component (#17–19) passes a Pattern-consistency check.
- Components compose: the Reference Site homepage above the fold can be reassembled from Kit
  Components plus content.

**Out of Scope:**
- Composite application-form widget (its atoms ship; the assembled flow is a business widget —
  brief non-goal).
- Table and Switch — named as examples in the brief, dropped after the inventory found no
  reference grounding on the consumer homepage; revisit if deeper Reference Site pages are
  inventoried for v2. `[ASSUMPTION — confirmed]`
- Chat widget, carousels/category strip, store badges — revisit for v2. 3D illustration assets
  are content slots, not kit assets. `[ASSUMPTION — confirmed]`
- Deeper Reference Site pages (product, business, invest domains) — the maintainer designates
  additional domains after v1 (brief decision).

#### FR-5: Overlay behaviors

Modal, Tooltip and Toast implement the overlay behavior contract: focus trap and restore
(Modal), dismiss patterns (Esc / overlay click / close affordance as appropriate), auto-dismiss
duration and stacking rules (Toast), show/hide announcements to assistive tech (aria-live for
Toast/Tooltip; dialog semantics for Modal).

**Consequences (testable):**
- Keyboard-only and screen-reader sessions pass through each overlay correctly (checked via
  playwright-cli interaction and a11y tooling).
- Overlay open/close motion respects reduced-motion (see FR-7).

### 4.3 Accessibility (Phase 2 hardening, Phase 1 correct semantics)

**Description:** Semantics are correct from Phase 1; full WCAG 2.1 AA verification is the Phase 2
bar for every component. Realizes UJ-3.

**Functional Requirements:**

#### FR-6: WCAG 2.1 AA per component

Every Kit Component meets WCAG 2.1 AA: keyboard operability, visible focus, correct roles/names/
states, contrast (including the yellow primary button and pastel card tints in both themes).
Verification runs via playwright-cli (keyboard interaction, media emulation) plus automated a11y
checks in story docs.

**Consequences (testable):**
- Each component's story docs include a keyboard-only interaction checklist.
- Automated a11y checks pass in story docs; manual screen-reader spot-checks recorded per group.
- The yellow-on-black and tinted-background pairs pass contrast in light AND dark themes.

### 4.4 Motion & Interaction

**Functional Requirements:**

#### FR-7: Vetted motion set with reduced-motion respect

Interaction states (hover, press, focus, open/close of Tabs/overlays/Toast, theme switch) use
motion from vetted recipes (transitions.dev, namespaced `t-*`, added to the project at scaffold
time); every animation is disabled or simplified under `prefers-reduced-motion: reduce`. Phase 2
"visual modernization" (brief axis) is expressed through this motion and interaction polish —
static visual identity stays faithful to the reference (see SM-C2).

**Consequences (testable):**
- Zero animations run for reduced-motion users (verified via playwright-cli media emulation).
- Motion durations/curves come from Token System motion tokens, not per-component values.

### 4.5 Documentation & Stories

**Functional Requirements:**

#### FR-8: Story docs for every component

Each Kit Component ships a Story docs page: live default state, all variants, interactive states
(hover/focus/disabled), theming demo (light/dark), and accessibility notes.

**Consequences (testable):**
- Coverage: 19/19 components documented; no component documented without its variants.

### 4.6 Quality Pipeline

**Description:** The project's sanctioned toolchain (CLAUDE.md): impeccable detector hooks on
every UI edit; DESIGN.md recorded via `/impeccable document` once real UI exists and governs
visual work; transitions.dev for motion; inspo MCP consulted before new UI patterns; playwright-cli
as the only browser automation tool.

**Functional Requirements:**

#### FR-9: impeccable design audit as merge gate

The impeccable design audit runs on every UI change via the project's edit-time hooks; blocker
findings block the change. CI wiring for the same gate is added at the build phase (intent
recorded here; mechanics land with the stack).

**Consequences (testable):**
- A UI change with blocker-level detector findings does not merge.
- Detector configuration (ignore rules) changes are themselves reviewed and justified.

#### FR-10: Visual regression checks

Each reference-grounded component (#1–16) has a captured Reference Site baseline; automated
screenshot comparison flags visual drift beyond tolerance when components change. Derived
components (#17–19) get pattern-consistency checks against the documented anatomy. The intent is
pixel-faithful recreation; the tolerance question (OQ-6) concerns the automated threshold, not
the fidelity goal.

**Consequences (testable):**
- A change that visibly drifts a component from its baseline fails CI (or requires explicit
  baseline re-approval).

### 4.7 Distribution

**Functional Requirements:**

#### FR-11: Release distribution, MIT, semver, unofficial labeling *(amended at release 2026-09-23)*

> **Amendment (maintainer decision, 2026-09-23):** the kit does NOT publish to npm. Distribution
> is **GitHub git-tags only**: consumers clone/checkout a tag and use the workspace-link recipe
> (README quickstart — verified live from tag v1.0.0). `private: true` is permanent. Semver =
> git tags `vX.Y.Z`; CHANGELOG per release; the release gate = a fresh consumer clones the tag
> and renders Button from the README recipe. MIT (code) + separately-licensed fonts and the
> unofficial labeling requirements are unchanged and shipped.

The kit ships under a trademark-safe name (OQ-3), MIT license, semantic versioning, and a
changelog per release. Everything published (READMEs, repo description, docs site) carries
unofficial labeling: a study/recreation project, not affiliated with or endorsed by T-Bank; no
trademark use and no implication of official status anywhere.

**Consequences (testable):**
- A consumer can follow the README quickstart against a pinned tag and render Button. *(verified
  from tag v1.0.0, 2026-09-24)*
- Breaking changes only in major versions; deprecations documented.
- README/repo/docs contain the unofficial disclaimer; naming contains no T-Bank trademarks.

### 4.8 v2 — Multi-Domain Expansion *(designated 2026-09-24; recon: `.playwright-cli/captures-v2/`)*

Reference domains: **tbank.ru/business**, **tbank.ru/invest/mobile-application**,
**tbank.ru/invest/stocks**. Same capture-and-improve pipeline as v1; the stack, conventions, and
quality gates (FR-6/7/8/9/10) apply verbatim to every v2 component.

**Functional Requirements:**

#### FR-12: Data-table family (the stocks-catalog pattern)

Typographic data table (row-as-link, two-line cells, 1px dividers, no zebra; semantic red/green
delta text where color carries direction), filter-chip group (checkbox-tablist, overflow «Ещё»),
pagination (numbered pages + yellow active pill + «Показать еще»), and a combobox search field.
Keyboard-complete per the a11y floor: the table is operable arrow/Home/End + Tab, chips follow
the tablist contract, pagination is a nav landmark. **No charts** — the recon confirmed the
reference itself uses pure typography; data-viz stays a non-goal.

#### FR-13: Site chrome — mega-nav and cookie consent

Two-deep navigation as an extension of tk-navbar: the bank-wide mega-nav (Банк/Бизнес/
Инвестиции/…, with «Войти») plus the domain sub-nav row. Cookie-consent banner/dialog per the
reference (dialog semantics, consent action, dismiss persistence left to the consumer's storage
choice — the component renders and emits, it does not store).

#### FR-14: Marketing blocks — stepper, app-distribution cluster, bento recipes

Numbered stepper (business + install how-tos); store-badge row + QR-install block (app
distribution cluster); bento grid recipes (asymmetric 2+3, floating white-pill CTA over 3D art,
full-bleed) documented on the existing card family — plus warm-cream surface tokens IF probes
confirm a distinct tint family (native-zoom probe at UX phase decides; DESIGN.md wins).

#### FR-15: Typography registers (token-layer extension)

Marketing register (h1 44px, haas/pragmatica — already the kit's Daytona stacks) and product-UI
register (h1 36px, dense table typography) as named token extensions; existing v1 scale
unchanged. Both themes; dark-mode pairing per the same rules.

#### FR-16: v2 fidelity gate

Every v2 component ships through the v1 component gate verbatim (impeccable zero blockers, axe
both themes, stories complete, generated React wrapper, provisional baselines + side-by-side vs
the v2 captures archived in the repo).

## 5. Non-Goals (Explicit)

- Redesigning the visual language — copy first, improve second; never invent new brand identity.
- Native mobile patterns — web only.
- Data visualization (charts, dashboards). *(re-confirmed by v2 recon 2026-09-24: the designated
  invest pages carry typographic tables, not charts — FR-12 copies what exists)*
- Complex business widgets (packaged flows like full application/payment forms, tariff
  calculators).
- ~~Other T-Bank domains~~ — **designated 2026-09-24 (v2): business, invest/mobile-application,
  invest/stocks — see §4.8**; further domains remain maintainer-designated.
- Stack choice — decided in bmad-architecture, not here. FRs above are stack-agnostic.
- Scraping or bundling proprietary assets — an original re-implementation only (see §5.1).

### 5.1 Constraints and Guardrails

- **Legal:** unofficial recreation; no T-Bank trademarks in published naming; no scraped
  proprietary assets, code, or artwork. The two licensed commercial fonts ARE bundled as
  renamed separately-licensed assets per maintainer agreements (2026-09-22): DaytonaSans
  (renamed Neue Haas Unica W1G, Monotype license held by the maintainer) and DaytonaPragma
  (renamed Pragmatica, ParaType; files to follow) — NOT covered by the package's MIT license
  (see `packages/tokens/fonts/LICENSE-FONTS.md`; original copyright notices preserved inside
  the files). The proprietary TinkoffSans (the reference's `dsHeading` brand font) remains
  NOT bundled — its slot leads with DaytonaSans, the closest licensed grotesk (strategy:
  OQ-2, as amended).
- **Tooling (project contracts, CLAUDE.md):** pnpm only; Node >= 20; playwright-cli is the only
  browser automation tool; impeccable + transitions.dev + inspo MCP are the sanctioned
  design-quality toolchain.

## 6. MVP Scope

### 6.1 In Scope

v1 includes **both** phases (improvements land before the v1 release, per brief order — copy
first, then improvements, both gates before shipping):

- Phase 1 — Token System (light) extracted per FR-1; 19 Kit Components faithful to reference
  (FR-4, FR-5) with consistent API (FR-3)
- Phase 2 improvements — WCAG 2.1 AA (FR-6), dark theme (FR-2), motion set (FR-7)
- Story docs (FR-8); quality pipeline: audit gate (FR-9) + visual regression (FR-10)
- Distribution: npm, MIT, semver, unofficial labeling (FR-11)

### 6.2 Out of Scope for MVP

Beyond FR-4 Out of Scope and §5 Non-Goals:

- Figma/design-tool exports of tokens — possible v2.
- Documentation localization — single language first (OQ-4).

`[NOTE FOR PM]` — the composite application form is the Reference Site's flagship assembly;
revisit after v1 adoption.

## 7. Success Metrics

*(Internal quality bar per brief; external metrics deliberately secondary.)*

**Primary**
- **SM-1**: 19/19 components pass the impeccable design audit with zero blockers. Validates FR-9.
- **SM-2**: 19/19 components pass WCAG 2.1 AA checks. Validates FR-6.
- **SM-3**: Fidelity holds — 16/16 reference-grounded components pass Fidelity checks; 3/3
  derived components pass Pattern-consistency checks. Validates FR-10.
- **SM-4**: 19/19 components have complete Story docs. Validates FR-8.
- **SM-5**: Dark mode renders correctly for 19/19 components via the token layer, zero
  component-specific hacks. Validates FR-2. *(Brief success criterion #3 — primary, not
  secondary.)*

**Secondary**
- **SM-6**: A new consumer can render the README example within one sitting (self-tested during
  release prep; no formal protocol). Validates FR-11.

**Counter-metrics (do not optimize)**
- **SM-C1**: Component count — adding components faster than the quality gates pass degrades the
  kit; the 19-component v1 ceiling is a feature. Counterbalances SM-1–4.
- **SM-C2**: Visual novelty — drift from the Reference Site is failure, not freshness.
  Counterbalances SM-3.

## 8. Open Questions

0. **RESOLVED 2026-09-22 (maintainer decisions, addendum).** OQ-2 fonts: token stacks carry the reference's exact family names from live extraction (dsHeading≡TinkoffSans, haas/dsText≡Neue Haas Unica W1G, pragmatica in the body fallback) with Inter (latin+cyrillic) as the open default; the fonts are proprietary/commercial (T-Bank asset / Monotype / ParaType) and are NOT bundled — bundling even renamed was rejected as copyright infringement; consumers with licensed files self-host them (auto-pickup via the exact family names, or private aliases via the gitignored docs local-fonts mechanism). OQ-3 names: pillkit-{tokens,components,react,docs} (verified free on npm); tk- element prefix and --tk-* tokens stay permanently. OQ-4: docs language Russian (code/API English). *Amended 2026-09-22 (later the same day, maintainer agreements executed): the maintainer now holds usage+renaming licenses from Monotype (Neue Haas Unica W1G) and ParaType (Pragmatica) — the two licensed fonts ARE bundled as renamed separately-licensed assets, DaytonaSans and DaytonaPragma (files pending), NOT covered by MIT (packages/tokens/fonts/LICENSE-FONTS.md), and the token stacks are Daytona-first; only the proprietary TinkoffSans (dsHeading) remains unbundled, its slot led by DaytonaSans. §5.1 amended accordingly.*
1. **OQ-1 — Dark theme palette.** The Reference Site is light-only; the dark palette must be
   designed (UX phase) within brand constraints. Phase-blocker for FR-2 UX work.
2. **OQ-2 — Brand font strategy.** The reference uses a proprietary brand typeface the kit cannot
   bundle. Decide: font-token target stack + recommended open (ideally metric-compatible)
   alternative. Phase-relevant for FR-1 and fidelity perception.
   *Resolved 2026-09-22: faithful stacks from the live @font-face extraction (their family names
   first — auto-pickup for licensed hosts); proprietary fonts NOT bundled (§5.1); default fallback
   Inter.*
3. **OQ-3 — Package name.** Trademark-safe candidates to pick before npm publish; unofficial
   attribution lives in README, not the name.
   *Resolved 2026-09-22: npm names `pillkit-{tokens,components,react,docs}` (verified free on npm);
   `tk-` element prefix and `--tk-*` properties kept — closed.*
4. **OQ-4 — Docs language.** RU, EN, or both for v1 (audience is RU-speaking market; OSS
   convention is EN).
   *Resolved 2026-09-22: docs language RU for v1 (code/API/package names stay English).*
5. **OQ-5 — Framework target.** React, Vue, or web components; decided in bmad-architecture.
   This PRD stays stack-agnostic. Phase-blocker for FR-3 concretization.
6. **OQ-6 — Fidelity tolerance.** Pixel-exact vs. perceptual threshold for the automated
   comparison in FR-10 (threshold only — the fidelity goal itself is fixed); set with tooling at
   architecture.
7. **OQ-7 — SSR/tree-shaking requirements.** Consumer-project constraints to settle at
   architecture.

## 9. Assumptions Index

*(All confirmed by the maintainer, 2026-09-21.)*

- §4.2 FR-4 — Modal, Tooltip and Toast derived (not homepage-visible): styling from
  floating-card / info-pill patterns. Confirmed.
- §4.2 FR-4 — Table and Switch dropped (no reference grounding on the homepage); composite form
  widget excluded (brief non-goal). Confirmed.
- §4.2 FR-4 — 3D illustrations treated as content slots (art slot in cards), not kit assets.
  Confirmed.
- §4.4 FR-7 — Phase 2 "visual modernization" is expressed through motion/interaction polish
  only; static visual identity stays faithful (consistent with brief's copy-first principle).
