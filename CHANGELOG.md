# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `tk-menu-popover` + `tk-menu-item` / `tk-menu-divider` — the anchored
  command menu (spec 19.1, admin follow-up): APG menu semantics (roving
  tabindex with REAL focus moves, Home/End, Esc with focus return, outside
  press close, Shift+Tab-from-first-row stays open) over the overlay
  controller; right-edge anchoring via the new `alignment: 'start' | 'end'`
  option in `computeFloatingPosition` (the matchAnchorWidth precedent — a
  new option, not a contract change); `open`/`open-change` +
  `select` (CONVENTIONS §9 — no imperative exceptions); `slot="header"`
  user block, leading icon slot, `variant="destructive"` red-text rows,
  44px rows over the captures' ≈40±2 (the A11y floor is law); panel chrome
  on neutral tokens with `--tk-menu-popover-*` styling hooks. The admin
  patterns (avatar-menu with header slot, table-kebab, header-overflow)
  ship as story compositions, not separate components.
- `pillkit-tj-fonts` — the ТЖ fonts carrier package (spec 18.3, queue
  v1.4.0-(d), maintainer rulings B/split/XCharter): bundled XCharter ×4
  faces (400 / 400 italic / 700 / 700 italic, woff2, no subsetting) — the
  free Charter idiom WITH Cyrillic under the Bitstream Charter license
  terms (verbatim grant + Panov/Sharpe attribution in LICENSE-FONTS.md;
  the rename to "XCharter" is the license's rename clause at work).
  Graphik is deliberately absent — the Commercial Type EULA grants usage,
  not redistribution — and travels as a commented `@font-face` recipe in
  `fonts.css`. The `--tj-font-reading` slot now leads with XCharter; the
  `pillkit-tj-*` trio stays zero-fonts by test (`tests/tj-fonts-policy.test.ts`
  re-scoped + a carrier describe pinning faces/manifest/licenses).

### Fixed

- tj-header pill metrics remeasured against the stable reference captures
  (spec 18.1, queue v1.4.0-(e)): nav chips 36→40px (7 chips × 2 captures,
  zero spread), the header CTA pill 36→30px with its inset-block 4→7px
  ((44−30)/2; the 16.5 probe-notes already recorded h30). Visual
  baselines intentionally NOT re-minted — the delta is sub-threshold
  (<1.5% pixel law); the computed truth is pinned in unit tests.

## [1.4.0] - 2026-09-30

### Added — v1.4.0 surface (epics-v5: the Т-Журнал / ТЖ editorial family)

- The ТЖ package family — `pillkit-tj-tokens`, `pillkit-tj-components`,
  `pillkit-tj-react` — a separately consumable editorial kit with ZERO runtime
  dependencies either direction against the bank family (FR-17, mechanized:
  import-boundary tests both directions + eslint lanes + ad4-matrix; OQ-10:
  rides the same git-tag train, own CHANGELOG section)
- `pillkit-tj-tokens`: own generator input with a dual-emit light/dark contract
  (`:host` + `:host(:not([data-tj-theme="light"]))`), AA-pinned pairs, register
  census in TOKENS.md (15.2); Inter/PT Serif font slots with licensed
  Graphik/Charter path documented, nothing bundled (15.3, OQ-8)
- Reading primitives (16.1, FREEZE grammar): `tj-prose`, `tj-link`, `tj-cta`
- Feed surfaces (16.2+16.3): `tj-rubric-header`, `tj-news-card`, `tj-tag-chip`
  + the /pro/ purple-hero pattern (purple as a scoped carrier, never a page bg)
- Community (16.4): `tj-composer` + `tj-post-card` — the family's first
  stateful pair
- Chrome (16.5): `tj-header` + `tj-rail` + the burger drawer (AD-12 helper,
  LIFO focus restore, `--tj-z-*` overlay ladder)
- Article composition pattern (16.6) + the Flow-C ad-slot recipe: ad modules
  ride the BANK `tk-promo-card` via `--tk-promo-card-*` hooks — the editorial
  tree carries zero ad-language hexes (FR-21, audit-verified)
- Docs: the ТЖ section — token reference (TOKENS.md single-source + drift
  test), theming guide (dark-pairing/overrides/registers), 4 pattern pages,
  CEM API tables ×10, getting-started (the ТЖ-ALONE install recipe), search
  +16 rows (17.3)
- Sweeps (17.1+17.2): a11y 140 legs + dark 45 legs (extraction-verification,
  native-dark parity ×45; pseudo-composite AA law); SR-RUNSHEET-v1.4.0
  (live VoiceOver runs = maintainer-side)

### Internal

- Docs navigation regroup (post-v1.3.0 interlude): the «Components v2» group — named after
  the build window, not the content — splits semantically into `Guides/*` (9 component
  overview pages) and `Patterns/*` (Console chrome, Data surfaces composition pages);
  story display names and suite ids untouched, baselines moved prefix-only (28 byte-identical
  git-mv + 2 re-taken: the cookie-banner page anchor text gained its exact suite casing);
  docs search ids follow; cross-link texts corrected to the exact sidebar names
- CI: gates `timeout-minutes` 30 → 60 — the suite grew to 2123 visual/axe legs and the
  17.3 push was timeout-killed three times at exactly ~30:20 (a timeout kill reports as
  `completed cancelled` under the triggering actor — forensics in ci.yml and the story log);
  standing practice added: after any post-rebuild source fix run the FULL suite, not
  scoped legs
- Bank link contrast law encoded in source: `--tk-color-link` is tuned to surface-base
  (4.62 AA); on surface-muted it is 4.24 in light — links never sit on muted boxes
  (theming-guide + the five 17.3 pattern pages, CI round d02a483)
- Verification: fidelity ledger 11 rows (`.playwright-cli/verify/fidelity-verification-v1-4-0/`)
  + ad-language audit 0 values + impeccable both trees 297 files exit 0 + baseline review
  package ЧАСТЬ v1.4.0 assembled (14 commits / 204 PNG-events; the batch-confirm gate
  itself is the maintainer's)

## [1.3.0] - 2026-09-28

### Added — v1.3.0 surface (epics-v4: the authorized-zone / admin family)

- tk-badge: `neutral` and `attention` console variants (AA pairs gray-100/gray-600 ≈5.17:1
  and red-300/white 6.179:1 — the raw reference red maps onto the red scale per the frozen
  AA-pairing ruling) + the `--tk-badge-fill`/`--tk-badge-text` hook pair (per-instance
  retint, inherits through the shadow boundary — a pair on an ANCESTOR re-tints nested
  tab counters with zero tabs code) (13.3)
- tk-progress-bar: `--tk-progress-bar-height` geometry hook (default 4px unchanged;
  console thin bars = one property on an ancestor) (13.3)
- tk-tabs: `indicator="underline"` console mode — 2px ink bar on aria-selected via the
  `--tk-tabs-indicator` hook, pill default untouched; announcements unchanged (13.2)
- Docs: two v2 console pattern pages — Console chrome (header + underline tabs + static
  4-column mega panel) and Data surfaces (toolbar, counted tabs, status table, labeled
  thin bars, favorites tile grid) — composition surfaces grounded on the 13.1 admin pack
  (13.2/13.3); docs search index 19 → 30 entries (v2 family + pattern pages, 14.1);
  per-vertical showcase groups Bank/Business/Invest (12.1); DESIGN.md authorized-zone
  console language section (13.2)
- Reference packs: captures-v3 per-vertical convention — bank vertical (12.2) + the
  PII-redacted admin console pack, 8 surfaces (13.1)

### Internal

- a11y-sweep engine Group VII: +9 legs for the console family (108 total; stops asserted
  exactly by the walk); SR-protocol rows in three Accessibility stories + protocol tables
  on both pattern pages; SR-RUNSHEET-v1.3.0 (14.1/14.2)
- Interlude: 33 component-package code rules join --tk-font-mono (mono-extension) +
  theming-guide demos card→hero; port-6007 tree-identity guard for the visual harness
  (serve.mjs /__tree__ + globalSetup gate + lockfile)
- Verification: fidelity ledger v1.3.0 (6 rows, composition classification for pattern
  pages), yellow-discipline audit with the console rule (yellow never fills buttons in
  the authorized zone — 0 violations), impeccable 209 files exit 0 (14.2)

## [1.2.0] - 2026-09-27

### Added — v1.2.0 surface (epics-v3)

- Token layer: `tint-brown` #8D6040 (theme-invariant, the charcoal mold; AA gates pinned in
  tests/contrast.test.ts) and the `--tk-font-mono` font slot (system-first chain) (9.1)
- tk-input + tk-segmented-radio: `srOnly` label mode — visually hidden label keeps the full
  accessible-name chain (1px-clip utility) (10.1)
- tk-checkbox: `error` channel — the tk-input error line verbatim (consumer copy, described-by
  wired, error-on-field pairing in both themes) (10.2)
- tk-stepper: `subtitle` slot; tk-qr-block: `page-copy` slot — presence-mold slots; showcase copy
  is reference-verbatim, render-verified (10.1/10.2)
- tk-promo-card: `artMode="bleed"` — CSS-only full-bleed bottom art zone + floating-pill actions
  overlay (pill offset probe-measured at --tk-space-32) (10.3)
- tk-button: `href`/`target`/`rel` anchor mode — `<a class="button">` when href is set; no-href
  render byte-identical; rel = noopener noreferrer iff target=_blank (10.4)

### Changed

- tk-stepper badge pairing switched to the reference reading: brown `tint-brown` fill + WHITE
  numeral (AA 5.413:1; hooks --tk-stepper-badge-fill/-number unchanged) — the v1.1.0 cream-raised
  mapping retired by the maintainer's ADOPT decision (9.1)

### Internal

- 9.2 generator truth (aa-annotations derive from DESIGN.md, AD-4 matrix single-sourced),
  11.1 a11y engine legs for the new modes (+12; group-VI ledger 42/42; SR-RUNSHEET-v1.2.0),
  11.2 docs code surfaces flipped to --tk-font-mono with the harness font pin (JetBrains Mono,
  test-only) — no consumer-facing surface beyond the lines above

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


