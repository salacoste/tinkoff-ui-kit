# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

<!-- Maintainer (RELEASE.md §2): at release, replace [Unreleased] with
     [1.0.0-rc.1] - YYYY-MM-DD (or [1.0.0] - YYYY-MM-DD per the version
     decision) and start a fresh empty [Unreleased] section above it. -->
