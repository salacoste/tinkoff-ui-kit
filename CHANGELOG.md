# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- tk-button: href/target/rel anchor mode — the pill renders an anchor when href is set;
  no-href renders byte-identical (additive minor, story 10.4)

## [1.1.0] - 2026-09-25

### Added — v2 (tbank.ru/invest + /business reference domains)

- v2 token layer: `{colors.*}` reference syntax + rgba literals in DESIGN.md; table/delta/warm-cream
  semantics; typography registers as mappings — zero new type tokens (6.1)
- tk-filter-chips + tk-pagination: catalog filter pills (border-only selection, overflow «Ещё» menu)
  and the pager (nav landmark, windowing, load-more bar) (6.2)
- tk-combobox-search: borderless 52px typeahead field, activedescendant listbox, IME-safe value sync (6.3)
- tk-data-table: typographic row-as-link catalog table, direction-carrying delta colors, APG roving
  keyboard layer (6.4)
- stocks-catalog showcase composition: five surfaces wired live + recorded 39-step keyboard walkthrough (6.5)
- tk-navbar mega-nav extension: optional two-deep header (subLinks row), v1 renders byte-stable (7.1)
- tk-cookie-banner: non-modal consent dialog; `consent-choice` event; storage stays with the consumer (7.2)
- tk-stepper + tk-store-badges + tk-qr-block: the marketing display trio (7.3)
- business-landing showcase: bento 2+3 on warm-cream, floating white CTA, form cluster with toast (7.4)
- invest-landing showcase: marketing register (h1 = heading-2), install cluster qr→steps→badges (7.5)
- v2 a11y sweep: 54/54 ledger cells, kit-wide `:host([hidden])` guards (33 sheets), empty-name fallbacks (8.1)
- v2 dark sweep: all six 6.1 dark assumptions held (zero value changes); engine registry 19→28;
  store-badges anchor color-channel fix (8.2)
- v2 docs: nine component pages (live CEM tables) + registers surface, single-source TOKENS.md (8.3)
- v2 verification ledger (16+9 rows) + yellow-discipline audit extension + v1.1.0 release prep (8.4)

### Fixed

- CI workflow: the typecheck step ran before build, so the root typecheck could not resolve workspace
  `dist/*.d.ts` types on a fresh checkout — Actions had been red since 5.5 (deterministic TS2307),
  masked locally by stale dist. Steps reordered build → typecheck.
- Visual suite on CI (first-ever ubuntu run of the v2 content, 1366/1368): the combobox-search
  open-story driver now settles to a deterministic post-typing state (the focus race painted the
  focus ring on ubuntu but not on the captured baselines), and the one platform text-advance
  pill-shift leg (tooltip placements, light) carries a CI-scoped tolerance instead of a local one.

## [1.0.0] - 2026-09-23

### Added

- Initial public release of **pillkit** — a UI kit of 19 Lit custom elements
  with React 19 wrappers, a two-layer design-token system, a shared overlay
  controller, and a documentation + verification suite. (Unofficial study
  recreation — see the disclaimer in the README.)
- **`pillkit-tokens`** — the `--tk-*` custom-property system generated from a
  single token source: a light base layer on `:root`/`:host` plus a dark layer
  of semantic overrides on `[data-theme="dark"]`; AA-verified contrast pairs;
  optional bundled Daytona font faces (separately licensed — see
  `packages/tokens/fonts/LICENSE-FONTS.md`; the package is a mixed-license
  payload, `SEE LICENSE IN LICENSE`).
- **`pillkit-components`** — 19 `tk-*` Lit components themed entirely via
  tokens (zero component-level theme branches): button, input, select,
  checkbox, segmented radio, thumbnail picker, progress bar, link, badge,
  tabs, navbar, footer, promo / feature / service / article cards, modal,
  tooltip, toast. Forms participate in native form semantics; every component
  ships keyboard/a11y behavior and per-component API tables generated from the
  Custom Elements Manifest.
- **Overlay controller** (`pillkit-components`) — shared mounting, scroll-lock,
  positioning, stacking and focus-trap layer consumed by modal / select /
  tooltip / toast: top-layer Popover API with a document-positioned fallback
  path, token-driven `--tk-z-*` stacking.
- **`pillkit-react`** — React 19 wrappers generated from the Custom Elements
  Manifest (`@lit/react`), with unwrapped event `detail` payloads delivered to
  React handlers.
- **Verification suite** — Playwright visual regression harness with committed
  cross-platform baselines (screenshot + axe in both themes per story);
  mechanized AA contrast table; keyboard, reduced-motion and geometry guards;
  import-boundary and generation-drift checks (tokens, CEM, wrappers).
- **Docs** (`pillkit-docs`, private) — Storybook (RU): getting-started, token
  reference (light/dark side by side), theming guide, docs-site states and
  per-component API tables; the unofficial-study disclaimer on every story.

### Semver policy

Breaking changes land only in major versions. Minor versions add components,
tokens and features; patch versions fix defects. Deprecations are announced
in a minor release via this changelog (and `@deprecated` JSDoc markers) and
are removed no earlier than the next major.


