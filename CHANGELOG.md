# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.0] - 2026-10-04

### Added — gift certificate + promo-code entry (spec 24.15, pattern wave 24b closes)

- **Invest/Gift certificate «Вам подарили долю»** — gap-7's gift page:
  the CERTIFICATE CARD (the lead-form 24.3 mold — surface-base,
  hairline all four sides): heading-register title, the fictional
  share, the nominal, the OPTIONAL sender (presence mold: no value →
  no node) and the serial-number stub — READABLE by screen readers
  (never aria-hidden), its letter tracking the consumer-CSS
  demonstration of code tracking (the mono slot stays docs-only by
  the 11.2 ruling; tk-input's field lives in the shadow root, out of
  consumer CSS reach — no atom edits).
- The PROMO CONTRACT (the 24.2/24.3 caveats): a REAL native form —
  Enter submits, the CTA goes through requestSubmit() (a shadow button
  is not form-associated), a short code surfaces through tk-input's
  error channel (probe-verified both directions: «ABC» → the error
  line, «DEMO-2026-OK» → the sanctioned toast), nothing leaves the
  page. The uncontrolled tk-input keeps its value in the shadow field —
  the demo consumer tracks the latest string through value-change
  events (the 24.2 screener closure mold), never host.value.
- HONEST GROUNDING recorded in the visible prose: gift-certificate /
  promo-code is CENSUS-INFERRED, not image-verified — every geometry
  is a kit REGISTER pick, not a measurement (GAP-MAP Deferred). NO
  countdown is claimed anywhere (no live evidence). All names and
  numbers are FICTIONAL (the PD gate).

### Added — the «Другие бумаги компании» securities rail (spec 24.14)

- **Invest/Securities rail «Другие бумаги компании»** — gap-2's bond
  page side section: tk-carousel (21.6, contract untouched — snap,
  chevrons, dots) carrying SAME-ISSUER securities cards on the
  instrument page frame (fluid main + the 247px rail, the 22.6 ticket
  mold; collapses under 1024px to an ordinary section). The card
  anatomy: name + ticker, TWO stat blocks (price + Δ% on the 22.1/22.2
  delta tokens — sign in the content, color never the sole carrier; NO
  monospace alignments, the kit number convention) and the navigation.
- **The card is ONE anchor (AC4)**: the whole card is a native `<a>`
  whose accessible name computes from its VISIBLE semantics — name,
  ticker, both stat labels and values read into the link name (probe-
  verified: «Демо-Облигация Бридж 01 DMBR01 Цена 998,40 ₽ Изм. дня
  +0,12 %»). A tk-link inside the card would nest interactive elements
  (the legal-doc 24.9 lesson) — the card-level anchor replaces the
  link row. Cards are bordered surface-base boxes, no fills — the
  24.12 readout finding respected by construction. All securities,
  prices and deltas are FICTIONAL (the PD gate).

### Added — the feed's social pair: quote-repost + strategy authors (spec 24.13)

- **Invest/Feed social «Репост-цитата и авторы стратегий»** — two
  sections, one canvas, bank atoms only (FR-17: the Т-Журнал variant of
  the authors row is a VARIANT→ТЖ note for Epic 25, families never
  mix). (а) The QUOTE-REPOST (gap-4): an outer feed card in the 24.8
  anatomy carrying a nested INSET — border + surface-muted backdrop +
  the smaller body-s register — with the quoted post's author line and
  body. Nesting is ONE level (the live pulse never goes deeper);
  the inset is a single PASSIVE blockquote: no links, no buttons of its
  own, and the quoted header stays semantically inside the article
  card — a plain line, never a heading level of its own (h1 → h2 → h3
  card headlines, no skips).
- (б) STRATEGY AUTHORS (gap-2 #12 / gap-4 «Медиа»): widget rows —
  avatar monogram roundel (never a live photo, the PD gate) + name +
  gray fictional metrics + the subscribe control. The roster named the
  tk-button secondary compact REGISTER; the SEMANTICS demand native
  (the 24.8 «Нравится» precedent): aria-pressed sits on the very
  element the reader activates. Pressed flips to the kit's PRIMARY
  pairing (yellow + ink, theme-invariant) with the label swap
  «Подписаться» ↔ «Вы подписаны», a currentColor check glyph and a
  role=status announcement.
- RENDER GUARD (pre-mint probe catch): re-rendering a container that
  Storybook itself populated leaves its nodes behind — two role=status
  lines after the first toggle. The interactive host now mounts EMPTY
  and a story-only DriveFirstPaint directive (the 24.8
  DriveFirstAppend mold) drives the first paint on commit; litRender is
  the only writer of the subtree.

### Added — IPO placements calendar (spec 24.12)

- **Invest/IPO calendar «Календарь размещений»** — gap-7's richest
  capture: the month-grouped PLACEMENT cards (ticker monogram roundel —
  the data-table mold, never a live logo; name + ticker; a «Окно заявок»
  dl of window dates and the «12–16 ₽» price range; the secondary
  compact CTA) and the RESULTS half on tk-tabs (Октябрь/Сентябрь 2026 —
  live sectioning, both primary surfaces stay in the resting canvas)
  riding tk-feature-card tint bodies with the monogram in the art slot.
- **KIT FINDING (three axe rounds, pinned in the prose)**: the financial
  TEXT tones of tk-badge (positive/negative on the delta tokens) are
  calibrated for NEUTRAL surfaces — on EVERY feature-card tint
  (mint/bluegray/beige/gray) they fail axe color-contrast AA; the
  all-gray control run still failed, ruling out a two-tone fix. Consumer
  recipe recorded: the «price + badge» readout rides a BASE-SURFACE chip
  (surface-base fill + radius + tight padding, the `.ip-result__body`
  mold) INSIDE the tinted card — the tints stay, the AA survives. The
  22.1 «delta sanctions are surface-base-only» ruling now has its
  pattern-level corollary.
- HEADINGS (AC2): months are h3 — the calendar is navigated by headings,
  not dividers — under the two h2 sections (h1 → h2 → h3, no skips).
  Numbers ride the kit convention (RU comma, NBSP groups); the delta's
  SIGN lives in the badge content. Windows, tickers, prices and
  percentages are FICTIONAL (the PD gate).

### Added — referral reward tiers + share/copy-link widget (spec 24.11)

- **Invest/Reward tiers «Приводите друзей»** — the mgm page's tiered
  reward tiles (image-verified gap-7) and the share-link widget the QR
  block never covered. Tiers: bordered tiles on the stat-tiles mold —
  «За N друзей» label + the sum in the heading register (NO dark tile
  here). COPY CONTRACT: the press is a real navigator.clipboard write
  (demo — nothing leaves the page) with a fallback toast when the
  buffer is unavailable; the link rides the readonly field as its VALUE
  (screen-reader-readable), the icon is decorative and the accessible
  name sits on the very button pressed. WHY NATIVE CONTROLS IN
  CONSUMER CLOTHES (the 24.8 «Нравится» precedent): the copy button
  and the round share buttons are icon-only — aria-label must live on
  the activated element, and tk-button's shadow button does not carry
  the host attribute over; tk-input's readonly exists only through
  disabled (grayed paint + aria-disabled — the wrong register for a
  copy field). The atomic icon-only VARIANT and the readonly prop are
  Epic 25 notes. The CTA is a real tk-button; sums, link and targets
  are fictional.

### Added — 404 «Такой страницы нет» (spec 24.10)

- **Invest/Not found** — the nearly chromeless notfound (gap-8's 978 px
  live frame): a centered, vertically-calm composition — a decorative
  illustration stub (a token-tinted «lost sheet» inline-SVG, aria-hidden;
  the live raster art is never transcribed — the PD gate), the single
  h1, a support line and two rows of hub links (tk-link standalone).
  THE NEGATIVE PINS are the story's subject: 0 inputs, 0 buttons, 0
  forms — the live «404 with search» hypothesis was refuted by the
  census, and the DOM sweep (scoped to the story root; Storybook's own
  scaffold buttons live outside it) fixes the absences. Links are the
  only interactivity; the tab order is the reading order.

### Added — legal/doc page + tk-breadcrumb, the wave's one new atom (spec 24.9)

- **tk-breadcrumb** — the crumb trail: gap-8 counted ZERO implementations
  repo-wide, so the «Инвестиции / Раскрытие информации» opener of the
  invest inner pages joins the kit (Решение 5 companion atom). A
  nav[aria-label] landmark (the pagination label mold, «Хлебные крошки»
  default) over ol/li stops: DATA-DRIVEN via the `items` prop (label +
  href per stop), the LAST stop renders as aria-current="page" plain
  text — never a link to itself — and the chevrons between stops are
  decorative (aria-hidden). Anchors ride the link token with tk-link's
  own affordance recipe (no rest underline, the line faded in on
  hover/focus-visible over the motion tokens). Degrades (§2): non-array
  items render nothing (no empty landmark); an href-less middle stop
  becomes plain text, never a dead anchor. STATELESS. Hooks:
  --tk-breadcrumb-{gap,separator,color}. Full catalog cycle: unit tests
  (landmark semantics, ol/li structure, aria-current terminal, href
  passthrough, §2 degrades, decorative chevrons, structural pins,
  stateless pin), CEM → React wrapper (`Breadcrumb`) → docs search row,
  package-root roster, hidden-guard tripwire 51→52.
- **Invest/Legal doc «Раскрытие информации»** — the dense fine-print
  column (~16 px body-m) with numbered/lettered enumerations and inline
  tk-links. REGISTER RULING pinned in the prose: tj-prose is the WRONG
  tool (editorial Charter 21/30) — legal prose is consumer CSS on the
  kit registers. h2/h3 = 0 on the live page — paragraphs open with BOLD
  LEADS, not headings. Full-width yellow «Скачать PDF» (tk-button,
  demo toast), and the for-deponents half: two doc-row blocks — svg
  icon + bold link title + gray meta, ROWS not cards. The rows are
  plain hover surfaces (div), never anchors wrapping tk-link (no
  nested interactive).
- **Docs search row for tk-figure (24a latent fix)** — the 24.7
  execution record claimed a component-search entry that never landed
  (the file's history jumps from 23.2 straight past the wave). Row
  added alongside the wave.

### Added — infinite-scroll feed (spec 24.8, pattern wave 24b opens)

- **Invest/Pulse feed «Бесконечная лента»** — the single-column card
  stream with NO pagination, «Показать ещё» or footer: the page keeps
  appending as the reader nears the edge (the live news/pulse runs
  21 694 / 16 515 px, both ending mid-card — gap-2). NO new atom — the
  recon classified the feed as consumer layout; the recipe is pinned in
  the prose: a sentinel at the stream's edge + IntersectionObserver
  append + a role=status status line. The kit rides along via
  tk-quote-chip (pill + the overflow «Ещё N» form). Feed-card anatomy
  (the gap-2 uniform pin): author row (monogram disc, channel, gray
  time) → bold headline → optional cover → body line → ticker-chip row
  → action bar over a hairline divider. The like control is a NATIVE
  button in consumer clothes — aria-pressed belongs on the element the
  reader activates, and tk-button's shadow `<button>` leaves the host
  attribute unread. Determinism guard (the 24.6 lesson, generalized):
  a story-only directive drives the FIRST append on mount and the
  observer arms only after a real scroll — the resting baseline never
  races observer timing, regardless of viewport height.

### Added — research longread + tk-figure, the wave's only new atom (spec 24.7, pattern wave 24a closes)

- **tk-figure** — the captioned media block, the B6 (gap-8 research
  iframes) + A8 (gap-5 terminal videos) FUSION and the ONLY new atom of
  the wave: a passive figure frame around slot-borne media (iframe /
  img / video) with an optional caption. The atom owns the aspect box
  (the `--tk-figure-ratio` hook, 16/9 default — the live embed shape),
  the radius, the muted load backdrop and the caption line
  (presence-molded: no content → no figcaption node). Lazy enforcement
  (the promo-card art mold, extended): slotted iframes get
  loading=lazy; imgs at ANY nesting depth get loading=lazy +
  decoding=async. STATELESS — zero events, no event-map entry by
  design. Full catalog cycle: hooks, unit tests (aspect contract, lazy
  attributes, caption presence, structural pins, stateless pin), CEM →
  React wrapper (`Figure`) → docs search row, package-root roster.
- **Invest/Research «Исследование»** — the wave's closing composition:
  byline row (a plain consumer line — the publisher-header avatar disc
  is NOT reused without a pin), h1, lead, prose on the BANK registers
  (NOT tj-prose — the gap-8 ruling), a figure stream demonstrating the
  fusion TWICE (a currentColor inline-SVG chart view + a video view),
  section tabs, the closing ИИР note (the 23.3 formula). Demo media are
  neutral stubs — NO live embed URLs (the PD gate; zero-media).

### Added — active-filter strip (spec 24.6)

- **Invest/Filter strip «Активные фильтры»** — the «Активные фильтры
  [n]» row with «Сбросить» / «Все фильтры» links between the filter
  panel and the results (the gap-1 bonds/etfs shape). The strip is a
  CONSUMER row out of tk-badge + tk-link — tk-filter-chips has no
  summary/count/reset composition of its own. The chip model pinned in
  the prose: tk-filter-chips is SINGLE-select per group, so the live
  multi-filter page maps to N chip groups (one axis = one element) with
  an «Все» default; active = a group off its default; count = the
  number of such groups; 0 → the strip hides (the presence mold). The
  strip is a VIEW over the same state, never a second source of truth;
  aria-live announcements; the mini-table refilters live. The canvas
  mounts with ONE axis active via a story-only SelectDollarOnMount driver
  (the TypeOnMount precedent) — a native chip click after mount — because
  a presence mold mounted all-default would baseline a canvas where the
  strip never paints; the lens round of 24.6 caught exactly that, and
  «Сбросить» still walks the 0 → hidden direction interactively.

### Added — load-more hybrid (spec 24.5)

- **Invest/Load more «Показать ещё и пейджер»** — «Показать ещё» and the
  pager SHARING one feed, the whole hybrid riding ONE existing atom:
  tk-pagination's built-in `show-more` bar (its `load-more` event fires
  WITHOUT changing the page — exactly the hybrid contract). Rules
  pinned in the prose: the bar appends the NEXT portion to the end of
  the visible feed; a pager jump REPLACES the feed with that page's
  block (the accumulated tail resets — the pager stays the source of
  truth for position). The append is announced via aria-live; the feed
  rides tk-data-table with inert rows.

### Added — stat-tile row (spec 24.4)

- **Invest/Stat tiles «Показатели»** — the big-number marketing register
  (gap-7's bordered «12 лет»-style row + gap-1 hub's ONE dark inverted
  card): an auto-fit minmax grid of bordered tiles — consumer glyph
  row, heading-register VALUE, visible body-s label — with ONE tile on
  the theme-invariant charcoal + white pairs (the hero mold: stays dark
  in BOTH themes — a theme-invariant block, not a dark-theme mode).
  Semantics: role=list/listitem (the kv-list mold); every figure
  FICTIONAL (the live numbers are a SHAPE reference only, never
  transcribed).

### Added — lead form, standalone + embed (spec 24.3)

- **Invest/Lead form «Лид-форма»** — phone + consent + CTA, the most
  repeated form shape on the invest surfaces, in BOTH variants on one
  canvas: (а) the standalone hero cluster (wide surface-BASE card with
  hairline, full-width CTA — the business-landing form-card mold; NOT
  muted: the tk-link «Назад» rides --tk-color-link tuned to
  surface-base (4.62 AA), 4.24 on muted — the v1.4.0 law "links never
  sit on muted boxes", caught by the first-mint axe leg) and (б) the
  320px embed «iframe view» (no hero chrome, name field added) — the
  variant difference is consumer CSS
  only. REAL `<form>`s (the live page has none — the kit does it
  right): Enter submits, the CTA goes through requestSubmit() (the
  web-component caveat pinned in the prose: a shadow button is not
  form-associated), the CTA is disabled until consent, the phone mask
  is STORY-level demo logic (NOT a kit feature — Epic 25 VARIANT),
  incomplete numbers surface through tk-input's error channel, and the
  submit fires the sanctioned imperative toast — nothing leaves the
  page.

### Added — options screener (spec 24.2)

- **Invest/Screener «Скринер опционов»** — the parametric filter panel +
  option-chain result table (gap-5: 12 inputs on the live catalog, not
  one inside a `<form>`). The panel is a REAL native form — label+input
  pairs, the call/put toggle as a radiogroup, Enter-in-field submits,
  «Применить» through requestSubmit(), «Сбросить» clears and refilters.
  Filter state is the demo consumer's closure (the 23.3 mold); the
  chain table rides tk-data-table with INERT rows (chain data is not
  navigation); the count output is aria-live; the keyboard checklist is
  pinned in the visible prose. Every contract, price, volume and yield
  is fictional (the PD gate).

### Added — pricing surfaces: plan cards + comparison matrix (spec 24.1, pattern wave 24a opens)

- Invest/Pricing «Тарифные планы»: the plan-card ROW — tk-feature-card
  tint bodies with the fee headline (heading-4 register) + feature
  checklist + CTA arriving as SLOT CONTENT (the atom gets no
  price-line of its own — the fee register is a pinned consumer
  recipe, not a new atom); consumer check glyphs on the brand yellow;
  the row is `grid auto-fit minmax(264px, 1fr)`.
- Invest/Pricing «Сравнение планов»: the comparison MATRIX — the live
  page has tables=0, so the matrix is CSS-grid DIVS with the APG
  table-on-div role grid laid on top: role=table on the grid,
  role=row per row, role=columnheader on plan heads, role=rowheader
  on the feature column (the first-column scope equivalent),
  role=cell on values; every check glyph carries an sr-only
  «Включено» — the icon is decorative, the meaning is text. Sections
  (Комиссии/Сервис/Аналитика) switch via tk-tabs — the live
  tab-sectioned shape. Column alignment recipe (every row re-declares
  the SAME grid template + min-width: 0 cells) and the narrow-canvas
  horizontal scroll are pinned in the visible prose.
- Both stories ship in BOTH themes with zero composition edits; one
  visible h1 per canvas; axe green in both themes on the first mint
  (the 23.4 registration sweep ran pre-mint: 0 unregistered tags).
  All plan names, fees and cell values are fictional (the PD gate);
  RU content, EN story meta. Pattern wave 24a opens with this story.

### Added — instrument page assembly pattern (spec 23.4, invest remainder wave — the wave closes)

- Invest/Instrument page «Инструментальная страница»: the wave's CLOSING
  composition — the whole two-column instrument page out of the wave's
  atoms (zero new components, zero token edits, zero registry pins).
  Main: tk-instrument-hero (the h1 rides the name SLOT — document
  semantics, the anti-empty-h1 ruling), the timeframe toolbar
  (tk-segmented-radio, sr-only label) + tk-chart, «Показатели бумаги»
  (tk-tabs + tk-kv-list rows with delta spans on the 22.1/22.2 delta
  tokens), «Частые вопросы» (tk-accordion), «Новости»
  (tk-article-card); sidebar: the price ticket (tk-promo-card ticket,
  22.6) + tk-publisher-header (23.2) + the summary forecast
  (tk-feature-card).
- The layout recipe is pinned as VISIBLE PROSE in the story (consumer
  CSS, not kit surface): a 2-column grid (fluid main + the 247px
  sidebar — the live ticket width, spec 22.6) collapsing under 1024px
  to sidebar-below-main; the sidebar rides `position: sticky; top:
  var(--tk-space-24); align-self: start`, with the two documented
  stickiness traps written out (sticky dies inside an overflow-clipping
  ancestor; the grid default `align-self: stretch` makes a short
  sidebar main-tall and defeats the stick).
- Ships in BOTH themes with zero composition edits — the pure
  semantics-layer test of the whole invest line (full-bleed canvas on
  the active theme's surface-base, the 23.3 mold). Headings: exactly
  one h1 (the hero name slot), every section an h2 — pinned by axe in
  both themes. All data fictional (the PD gate); RU content, EN story
  meta. Epic 23 «invest remainder» closes with this story.

### Added — trade form composition pattern (spec 23.3, invest remainder wave)

- Invest/Trade form «Торговый бланк»: the buy/sell ticket as a PATTERN
  story over existing atoms only — zero new components, zero token
  edits, zero registry pins. Side (tk-segmented-radio Купить/Продажа,
  story-level state), amount (tk-input + the ₽ suffix riding the
  EXISTING badge slot — the AC4 ruling: no input variant minted), the
  lots mini-pattern «− значение +» (tk-button secondary compact, the
  44px target register; sr-only accessible names — a bare «−» names
  nothing), side-driven CTA (tk-button primary), the portfolio star
  (the 22.5 slot-button mold, aria-pressed consumer state), and the
  ИИР note (tk-note info tone — the legal formula, not PD content).
- Grounding honest (no DOM capture exists — the live ticket sits
  behind terminal auth, GAP-MAP Deferred): every geometry is a kit
  register pick, not a measurement; a future terminal capture re-opens
  the pattern as its own story.
- A11y contract pinned by the visible keyboard checklist: one tab stop
  on the side group (arrows flip side, selection follows focus), real
  buttons with aria-labels, the live lots value on <output
  aria-live="polite">, a label+input amount pair; the visual suite
  runs axe on the story in both themes.

### Added — tk-publisher-header, the instrument page publisher row (spec 23.2, invest remainder wave)

- tk-publisher-header: the invest instrument page's publisher block
  (GAP-MAP B2) as a passive layout atom — avatar slot (35px disc,
  radius-full, tint-gray backdrop, overflow-clipped), name line
  (heading-6 + 700, slot with prop fallback, UA-chrome reset for
  slotted h1–h6 so a consumer's real heading carries no browser
  margin), the badges row and the meta line (body-s, text-secondary,
  presence via @slotchange — the hero metric mold), action slot pinned
  right by margin-left auto. Stateless: no roles, no tabindex, no
  buttons.
- SLOT POLICY deviation (recorded in the jsdoc): the verified/official
  chips are SLOT CONTENT on kit tokens, not kit wrappers — Lit never
  distributes one slot into several wrappers, and the chips are exactly
  that (svg discs riding the badges row). The kit ships the canonical
  chip svgs in the stories; consumers own their placement.
- Tokens: four measured `--tk-color-invest-badge-*` semantics
  (verified/official ink + backdrop, pixel-probed on the sber
  instrument page publisher row) — theme-invariant inks (decorative
  non-text glyphs, WCAG 1.4.11), the backdrops re-declared dark
  (first-pass, the tint-* mold). Registered in the aa-annotations
  ledger (16 entries, measured/verified, story 23.2).
- Hook layer: exactly four `--tk-publisher-header-*` variables
  (avatar size/gap, badge gap) with token defaults.

### Added — tk-chart, the static SVG price chart (spec 23.1, invest remainder wave)

- tk-chart: the instrument page's price chart (GAP-MAP B1) as a STATELESS
  atom — points in, graphics out (the tk-rating mold; crosshair, hover
  tooltips, zoom and live updates stay consumer-side by the epic ruling).
  Series area = linear gradient over the EXISTING `--tk-color-invest-*-{a,b}`
  identity stops (nothing minted: the bond capture measured the fill stops
  byte-identical to the 22.5 tokens); four tone families (stock/bond/dark/
  light, the tk-instrument-hero mold); quiet inner-only gridlines; dashed
  reference line gated to the visible domain; optional static last-value
  badge pill (the live badge is a hover tooltip that never paints in static
  captures — geometry pinned to kit conventions, a documented mint).
- The axis formatter is kit-owned (the one spec-sanctioned exception to
  «numbers stay with the consumer»): nice 1/2/2.5/5×10^k steps, 3–5 ticks,
  NBSP thousands grouping, RU comma decimals with trailing-zero trim, and
  тыс./млн abbreviations at overflow — one convention against the live
  bond page's raw floats («19999999,00000», the recorded negative).
- A11y: role="img" self-asserted at connect (the React-19 law) with a
  derived RU aria-label («График, N точек, последнее значение X», correct
  plurals) or the `label` override; static by definition — zero motion.
- Hook layer: exactly nine `--tk-chart-*` variables (stops, series, grid,
  axis, reference, badge fill/text, height) with token defaults; clamps for
  empty / single-point / non-finite / degenerate-range series.

## [1.6.0] - 2026-10-02

### Added — tk-promo-card ticket mode (spec 22.6, invest identity wave — the wave closes)

- tk-promo-card `variant="ticket"`: the invest sidebar PRICE TICKET
  (GAP-MAP gap-2 #8) on the same passive card shell — gray label line
  (new `label` prop + slot override), the big centered VALUE slot
  (heading-5 + weight 700 literal, the 22.5 hero-name precedent), the
  CTA through the EXISTING actions slot (the consumer's tk-button
  primary — the measured pair IS the kit pair byte-exact), and a
  presence-mold fine-print NOTE slot (body-m, 24px line-pitch capture
  literal). White surface-base, 1px hairline all four sides, no media,
  no gradients, no shadow; the tint anatomy (art/heading/description)
  never renders in ticket mode; the register survives the 767 matrix
  by specificity.
- ONE new hook `--tk-promo-card-border` (default border-default — the
  light value byte-exact to the probe, dark remapped to the
  white-alpha step; the bare gray-200 scale step has no dark layer).
  Pixel-probed anatomy, byte-identical across the stock/future/
  currency pages; two contact-sheet lens claims refuted by probes (the
  stack is CENTERED, not left-aligned; the CTA spans its own
  21px-inset column, not the text measure).
- Stories: the 3-instrument ticket group (fictional prices — the PD
  gate) in Variants + the dark-theme ticket in Theming; baselines
  re-minted explicitly (6 PNG; the API tables grew with the CEM
  declarations). Unit 24/24 (+5); the a11y-sweep registry row 10→16
  with the measured derivation (3 buttons + 3 links). Full suite
  2386/2386 green (feat 51ba679, CI run 37025154083). Epic 22 «invest
  identity wave» closes with this story (22.1–22.6, all CI green).

### Added — tk-instrument-hero atom + invest identity gradient tokens (spec 22.5, invest identity wave)

- tk-instrument-hero: the instrument page's identity card — name +
  superscript ticker, an OPTIONAL metric block (label over value;
  absent on the ETF/currency anatomy), the 96px logo disc at the
  right rail, and the consumer's favorite-star ACTION slot (the kit
  never owns portfolio state — display-only, stateless, zero events).
- 8 NEW theme-invariant stop tokens
  `--tk-color-invest-{stock,bond,dark,light}-{a,b}` — the four
  measured gradient families (stock 90°, bond the 135° diagonal, dark
  the etf approximation, light with an ink-300 text flip) ride the
  token layer, not inline literals (FR-1; the spec's «inline» letter
  corrected at execution). AA honesty pinned in TOKENS.md: body-s
  white on the green a-stops is RECORDED-FAILING (the live identity
  fill is immutable; the 28px/700 name clears AA-large); the live
  85%/50% text alphas raised to full white before pinning.
- Hook family exactly seven
  (`--tk-instrument-hero-{bg,radius,padding,min-height,logo-size,
  logo-inset,gap}`); text polarity THEME-INVARIANT (scale tokens, no
  dark remap — the light card stays ink-read in dark theme). Heading
  semantics: the name renders a DIV, the h-level is the consumer's
  (the name slot accepts a real heading) — plus the kit's FIRST
  `::slotted(h1..h6)` UA-chrome reset: a slotted heading keeps its
  document semantics but drops the ~42px sizing and ~35px margins
  that would break the measured 28px band.
- Review-lens round (2/2 budget): the dropped star slot attribute
  (all four cards starless — a bare default-slot child rendered
  nothing) and the missing title/logo-disc corridor (long names ran
  under the disc) both caught, fixed, and pinned; four further lens
  readings overruled with evidence (the disc inset IS the measured
  46px, superscript ticker by design, neutral-monogram contrast
  acceptable, grid anatomy). Unit 10/10; hidden-guard 47→48 sheets /
  37 files; 18 new legs; token-reference--colors ×2 re-minted (8 new
  swatches, the 9.1/11.2 mint precedent) + getting-started ×2. Full
  suite 2386/2386 green (feat 79d8359, CI run 37010000366).

### Added — tk-kv-list atom (spec 22.4, invest identity wave)

- tk-kv-list / tk-kv-list-item: the invest spec-list row (GAP-MAP B4
  — the bond «Информация о выпуске» shape). A STATELESS container +
  light-DOM rows mold (the accordion discipline): gray label left
  (prop or slot — slotted wins, the fallback IS the prop), near-black
  value slot flush right, 1px border-table hairlines BETWEEN rows
  only (`::slotted :not(:last-child)`).
- The hint prop renders the gray «?» roundel — a real tab-stop
  `<button type="button">` (44px hit via `::after inset:-14px`)
  composed inside the kit tk-tooltip, which wires aria-describedby
  itself (300ms hover/focus, click-toggle, Esc — its contract
  verbatim). A hint is a DESCRIPTION, not a disclosure:
  aria-expanded never appears. No hint → no icon, no button, no tab
  stop.
- Semantics ruling: dl/dt/dd cannot cross the slot boundary — the
  container self-asserts role=list, items role=listitem (the
  tk-rating law). The block heading stays consumer-side (no-modes).
- Grounded on the 2x bond anatomy (row pitch 33px = 4px padding +
  24px capture-literal line box + 1px divider); measured→token
  deviations (15px body-m vs the captured ~16px) recorded in the
  sheet headers. Hook family exactly five
  (`--tk-kv-list-{divider,label,value,gap,icon}`), no mints.
  Delta-toned values stay consumer slot content (tokens 22.1/22.2).
- Unit 10/10 (semantics, hint wiring, stateless no-channel,
  structural pins incl. the pixel-arbitrated divider); hidden-guard
  roster 45→47 sheets / 36 files; 18 new legs + getting-started
  re-mint (the search tile). Full suite 2368/2368 green
  (feat b2413af, CI run 37001997942).

### Added — tk-data-table financial cells (spec 22.3, invest identity wave)

- Two per-cell conventions on the existing tk-data-table cell — no
  new elements (the slot-oriented ruling): `logo` lays a cell out as
  roundel + the existing two-line stack ('letter' = the neutral
  monogram roundel seeded from the ticker's first grapheme, the
  quote-chip rule; brand fills stay consumer assets per PD; a URL
  renders an <img> roundel), and `cell.href` renders the primary
  line as a real anchor painted by the delta tone (Покупка/Продажа —
  the live plain-text no-pill ruling) or the link token.
- Measured on the research-hub insider table: 48px roundel (capture
  literal → hook), ~17px gap → space-16, name regular 15px, rows in
  the 81px rhythm. value+caption and signed-value stay the EXISTING
  two-line + delta anatomy (verified, not duplicated); end-alignment
  is the existing column convention.
- Hooks `--tk-data-table-roundel-{size,gap,fill,text}` (badge-neutral
  gray pair, theme-invariant), no mints. position:relative keeps the
  link clickable above the row stitch; the first cell of a linked
  row stays the row anchor's (stitch priority), the roving layer
  only ever manages a[data-index]. The B1/gray-100 unit pins
  narrowed to what they meant — the rendered link and the roundel
  pair are now the sanctioned uses.
- Stories: the Variants canvas gains «Финансовые ячейки» — insider
  deals (monogram roundels, colored deal links, share value+caption,
  end-aligned numerics) + ideas (linked rows, green right column);
  fictional companies/people/numbers (PD). Variants baselines
  re-minted ×2 themes; api untouched. Unit +5. Full suite 2350/2350
  green at its head (feat c3423f3). First CI round tripped the
  impeccable [broken-image] regex on a literal tag written in a TEST
  TITLE — prose rephrase in the fix-round cf58f05; CI run 37001997942
  GREEN.

### Added — tk-badge financial tones (spec 22.2, invest identity wave)

- tk-badge: `positive` / `negative` financial TEXT tones on NO fill —
  the live insider-deals table paints the deal type as plain
  sentence-case text («Покупка» ×4 green, «Продажа» ×1 red, NO pill —
  lens-verified), so the tones ride the DELTA tokens verbatim (no
  mint) and the fill stays a consumer hook (transparent default).
- First THEME-AWARE badge variants: the delta tokens carry dark
  remaps, and with no fill there is no pair to hold invariant — text
  follows the theme. The four fill variants stay theme-invariant
  (unchanged ruling, unchanged rules).
- The delta AA sanction stays surface-base-only (the 22.1 ruling:
  green-300 fails surface-muted at 4.210:1) — a tone badge on a
  tinted surface is the consumer's leg; the sign lives in the
  content, color is never the sole carrier.
- Stories: Variants gains the «Финансовые тоны» group (+3,8% / −2,95%
  / Покупка / Продажа with the measured note), Theming carries the
  theme-aware exception row, Accessibility extends the tone-pairs
  note. No new story; four re-minted canvases (×2 themes) + api
  (follows the CEM @attr) = eight badge baselines re-minted.
- Unit: union/reflect/clamp over the six-value union + a structural
  css test — transparent fill, exactly ONE delta token per rule (no
  scale mint). CEM regenerated. Full suite 2350/2350 green
  (feat 473c35f, CI run 36991193869).

### Added — tk-quote-chip atom (spec 22.1, invest identity wave)

- tk-quote-chip: the market-data chip family (invest GAP-MAP A3 — the
  kit's only answer to the whole live market-data section). Four forms,
  one element: `pill` (default — the hub band's bare mini-quote:
  roundel + bold price + toned Δ%), `inline` (the blue $TOKEN in-body
  link form), `box` (the attached single-quote widget — surface-base
  fill + hairline), `overflow` (the «Ещё N» count pill, slot content).
- Grounding: the hub ticker band pixel pass (roundel 24px, gap 6px,
  price ~13–14px semibold, delta ~11px, content ≈72px, pitch 136px
  with decorative stem glyphs ruled page-chrome). Three lens claims
  refuted by probes («white stadium pills» — interior probes equal the
  band background: the hub chip is BARE content; «white logo ring»;
  «gap 10–12px» — actually ≈64). Pill default paints NOTHING (fill
  hook for consumer tints — the beige/blue CC hunts over the news
  capture found zero pill-sized tints, so none was minted or guessed);
  overflow = lightblue-100 (nearest scale step); box = flagged kit
  derivation keeping the delta pair AA-sanctioned on surface-base.
- Delta tone DERIVED from the string's own sign (+ → up, −/− → down,
  unsigned → flat/text-secondary) — no `direction` prop, color never
  the sole carrier; raw live delta greens/reds REJECTED for the
  AA-carrying tokens; U+2212 and ASCII hyphen both parse as minus.
- href → a real `<a>` (tk-link underline behavior, focus ring), no
  href → a neutral span; name → title; empty logo slot → letter
  roundel from the ticker's first grapheme (badge neutral pair).
  Hooks `--tk-quote-chip-{fill,radius,gap,text,delta-size}`.
  STATELESS — event-map no-entry.
- React wrapper (CEM), docs search row (QuoteChip/Чип котировки),
  hidden-guard roster 45/35. Visual: eight new baselines (4 stories ×
  2 themes), no existing baseline touched — full suite 2349/2349
  green (feat 7924576 + fix 16775b4, CI run 36978617447; the first
  push caught a prose hex via the zero-hardcoded scanner and CEM
  cssText drift — run 36977874617 RED, fixed and re-verified).

### Added — tk-carousel atom (spec 21.6, invest foundation wave)

- tk-carousel: the horizontal card rail (invest GAP-MAP Tier A #2,
  the recon's most repeated surface — census 46 + 95 + 5 rails).
  Native scroll-snap container (NOT transform — the rail is a real
  scroll region); default slot = the cards (the slot{display:flex}
  row, the filter-chips trick); scrollbar hidden on every rail.
- Chevrons «Назад/Вперёд»: round white 44px (the kit's A11y floor)
  with shadow-dropdown, revealed on rail hover/focus-within
  (opacity 0 + pointer-events none at rest, still in tab order) —
  the live statics paint NO chrome, PROVEN by the threshold-corrected
  pixel scan (thr 253 finally discriminates white circles from the
  246–248 page gray the old 90%/96% scans structurally could not);
  the first vision lens's "white circles" retracted — pixels won.
  Page-step scroll (±clientWidth, smooth with reduced-motion guard),
  edge disable, native keyboard scrolling (zero keydown handlers).
- Dots: decorative (aria-hidden, non-clickable), measured geometry —
  8px dots, 16px pitch, 16px under the rail; active = yellow-100
  byte-identical to the live probe (existing token, no mint),
  passive = gray-200 with the live #E0E2E4 off by 3 channel units
  (deviation recorded in the sheet header, no token minted). No
  autoplay, no aria-live. Card width stays consumer-side (measured
  references 248/230/150 pinned in story prose). Hook layer
  `--tk-carousel-{gap,dot,dot-active,dot-size,dot-gap,dot-offset,
  chevron-radius,chevron-fill,chevron-color,chevron-shadow,
  chevron-inset}`. STATELESS — no events (event-map no-entry).
- host role="region" + aria-roledescription="карусель" + REQUIRED
  label prop (self-attributes in connectedCallback, the React-19
  law). React wrapper (CEM), docs search row (Carousel/Карусель),
  hidden-guard roster 44/34. Visual: ten new baselines + two
  getting-started re-mints (the new search tile, the 21.2
  precedent) — full suite 2326/2326 green (commit 9c76c33, CI run
  36945953950). Story review arbitrated by pixels: the lens's
  "page scrollbar" claim retracted (zero wide gray rows), rail
  clipping confirmed (roundel letters at exact 191px pitch), dot
  counts follow geometry (2 for the 5-card rail — the live sber
  showed exactly 2).

### Added — tk-rating atom (spec 21.5, invest foundation wave)

- tk-rating: the read-only star rating (invest GAP-MAP Tier A #7) —
  the bond-catalog star cluster. STATELESS display: `value` 0–5
  clamped display-side (prop untouched, the progress-bar mold); the
  schema's 0.5 grid renders floor(value) full stars + ONE partial
  star via inline clip-path inset — no second SVG.
- Measurement overrides, honestly recorded: fill is EXACTLY
  `--tk-color-yellow-100` (byte-equal probe — existing kit token, NO
  new mint); star 16px, pitch 20 (gap 4 = space-4); only FILLED
  stars render — the live row paints no empty neutral slots; the
  spec's optional `count` died at the lens (the reviews page is a
  promo with ZERO star widgets — census-inferred grounding
  retracted), so no count text beside and no size presets.
- A11y: `role="img"` self-asserted in connectedCallback (the
  React-19 law), `aria-label` «Рейтинг N из 5» with RU comma-decimal,
  recomputed in willUpdate on value change; NOT interactive — no
  tabindex, no focus, no buttons in shadow (the read-only ruling).
- React wrapper (CEM) with event-map no-entry (stateless), docs
  search row (Rating/Рейтинг), hidden-guard roster 43/33. Visual:
  six new baselines + two getting-started re-mints (the new search
  tile, the 21.2 precedent) — full suite 2296/2296 green (commit
  7a0a73c, CI run 36942600976).

### Added — tk-note atom (spec 21.4, invest foundation wave)

- tk-note: the quiet fine-print note (invest GAP-MAP Tier A #6) — the
  permanent disclaimer block the invest catalogs carry. Two measured
  tones: `neutral` = the white fine-print card on the consumer's muted
  page with the optional «Показать/Скрыть» reveal (bonds grounding;
  the atom owns the card here — unlike tk-empty-state), `info` = the
  bare blue «Информация» label + fine print with NO card (currency
  grounding). The atom ships no other tones — nothing else is
  grounded.
- Measurement overrides, honestly recorded: the spec's «серая заливка»
  guess corrected to surface-base WHITE card on a muted page (the
  first downscaled vision read inverted figure/ground — native-scale
  re-read + direct pixel probes settled it); NO default icon (none of
  the three groundings paints one); the live fine-print gray is
  AA-fail (3.36:1) so the kit's text-secondary token wins — deviation
  recorded; clamp frozen at 3 lines, clipping visual only (screen
  readers read the whole disclaimer while closed).
- Disclosure contract = tk-accordion-item verbatim: real button with
  `aria-expanded`, no aria-controls (shadow panel), `open` reflects,
  `open-change` ({ value }) on every actual flip — composed, bubbles,
  silent at initial mount, quiet teardown.
- Hook layer `--tk-note-{fill,radius,text,gap}` with token defaults
  (fill surface-base, radius-lg); the measured table lives in the
  sheet header. React wrapper (CEM) with EVENT_MAP onOpenChange, docs
  search row (Note/Заметка), hidden-guard roster 42/32, ten baselines
  + two getting-started re-mints (the new search tile, the 21.2
  precedent) — full suite 2278/2278 green (commit 51cf0e7, CI run
  36935953754).

### Added — tk-empty-state atom (spec 21.3, invest foundation wave)

- tk-empty-state: the «nothing here yet» block (invest GAP-MAP Tier A
  #5). Centered stack disc → heading → supporting line → action; the
  atom paints NO card — the favorites grounding draws the card at the
  consumer level, and the admin-table compact is a story-level hook
  derivation (its probe label failed the pixel check: the frame was an
  account row, so the spec's double grounding collapsed to one live
  capture).
- STATELESS display mold: the action is a SLOT (the live grounding
  carries a text link — a button fits the same slot), nothing
  dispatches (event-map no-entry), the disc is decorative
  aria-hidden. `heading` prop with slot override via the
  service-card slotchange machinery; the description wrapper renders
  only while its slot carries content — a vision-review catch from the
  first round (the line was passed as an attribute the atom never
  read, so nothing rendered; an empty flex item would fake the
  rhythm).
- Hook layer `--tk-empty-state-{gap,text-gap,disc-size,disc-fill,
  icon-color}` with token defaults; the measured favorites table
  lives in the sheet header. React wrapper (CEM), docs search row,
  hidden-guard roster 41/31, eight baselines — full suite 2248/2248
  after the fix round (getting-started stayed under the 1.5% gate, no
  re-mint per 5.4-F1).

### Added — tk-skeleton atom (spec 21.2, invest foundation wave)

- tk-skeleton: the loading-placeholder bone (invest GAP-MAP Tier A #4).
  Three variants — `line` (100% × 12px) / `circle` (40 × 40) /
  `rect` (100% × 80px), bogus values clamp to line (the badge mold);
  `width`/`height` CSS-string attributes map to host inline style and
  clear back to the shape default. Decorative by law: `aria-hidden` on
  connect; the container contract (`aria-busy` on the consumer) is
  demonstrated in the catalog-loading story with mirrored geometry
  (zero-layout-shift).
- Motion: opacity pulse 1↔0.5, 1.4s ease-in-out, killed by
  prefers-reduced-motion. Shimmer stayed unproven (live probe missed the
  pre-hydration frame three times — hydration outruns transport; the
  spec's fallback: tj-news-card mold + census) → the fill is FLAT.
- Hook: `--tk-skeleton-fill` (default surface-muted); px geometry is the
  documented zero-hardcoded blind spot (the MENU_OFFSET_PX precedent).
  React wrapper (CEM), docs search row, hidden-guard roster 40/30, six
  new baselines + two re-minted getting-started legs (new search tile).

### Added — tk-accordion family (spec 21.1, invest foundation wave)

- tk-accordion + tk-accordion-item: the disclosure atom of the invest
  GAP-MAP (Tier A #1, four independent groundings). Native `<button>`
  trigger with `aria-expanded`; the open panel is a `role="region"`
  labelled from the summary slot; each row is independent (no rotation
  mode — no live grounding for it). §9 declarative channel: `open`
  attribute + `open-change` event (silent on first render, quiet
  teardown). FLAT motion: the chevron rotates with no transition.
- Styling hooks: `--tk-accordion-divider-color` (container),
  `--tk-accordion-chevron-color`, `--tk-accordion-row-hover` (item);
  token-only defaults. The SBER «Частые вопросы» border card stays a
  consumer-side pattern — the atom paints bare rows with hairline
  dividers BETWEEN rows only (`::slotted(:not(:last-child))`).
- React wrappers (CEM-generated) expose `onOpenChange` on both tags;
  docs search row + 24 visual/axe baselines (4 stories × 2 themes).

### Added — tj-news-card geometry hook (spec 20.2, audit §2 re-probe)

- tj-news-card: `--tj-news-card-padding` instance-level custom property
  (the `--tk-progress-bar-height` mold — a hook, NOT a design token);
  default keeps the article-adjacent uniform 24, home/rubric FEED surfaces
  override to the live 25px 30px (layered `25px 0` / `0 30px` on the
  760-wide feed cards, re-probed 2026-10-01). The skeleton card consumes
  the same hook — the zero-layout-shift swap contract holds under override.
  First consumer: the rubric pattern demo (`TJ/Patterns/Rubric → Демо`).

### Fixed — ТЖ live-fidelity round (spec 20.1, the 2026-10-01 two-validator audit)

- tj-header: the header CTA radius corrected to the quiet r5
  (`--tj-radius-cta`) — it was mis-pill'd at `--tj-radius-full`; live br5
  confirmed on three surfaces (98×30, zero spread). Corrects the v1.4.0
  ledger line «fully-rounded CTA pill».
- tj-composer: card geometry to live — radius 20→25 (the `--tj-radius-card`
  family; the open r20 FLAG closed by measurement), padding-inline 32→29,
  avatar 40→50 — the derived height moves 88→98 (live rect 760×98).
- tj-tokens: `--tj-space-header-h` 72→70px (live bar remeasured at rest,
  1280×70; source-of-truth edit in DESIGN.md + regeneration, no hand edits).
- Article pattern: H1 bottom margin 16→10 (computed on the live article) and
  the H2 band bottom 24→25 (live rect 25px — the prose-rhythm literal family);
  skeleton bones mirrored to keep the zero-layout-shift swap contract.
- tj-news-card: byline avatar 32→45px (live drift adopted ahead of the frozen
  2026-09-28 pack — the kit follows live on structural metrics).

### Internal

- Live-fidelity audit protocol: two validators (live computed/rects + kit
  authoring truth) + orchestrator arbitration re-probing every §1 candidate;
  2 of 4 «confirmed» deltas RETRACTED as measurement artifacts (chip
  typography reads the inner painted span — Graphik 17/700 matches the kit;
  the body link underline is transparent at rest on live, matching the kit's
  mechanic — pixel-arbitrated). Protocol:
  `.playwright-cli/verify/tj-live-fidelity-audit-2026-10-01/` (NOTES §7).

## [1.5.0] - 2026-10-01

### Added — v1.5.0 surface (the post-v1.4.0 window: admin follow-up + fonts carrier)

- `tk-menu-popover` + `tk-menu-item` / `tk-menu-divider` — the anchored
  command menu (spec 19.1, Epic 19 «admin follow-up», grounded on the
  captures-v3/admin pack): APG menu semantics over the overlay controller
  — roving tabindex with REAL focus moves (arrows wrap skipping disabled
  rows, Home/End), Esc and outside press close with focus return to the
  trigger, forward Tab closes naturally while Shift+Tab from the first
  row keeps the menu open; right-edge anchoring via the new
  `alignment: 'start' | 'end'` cross-axis option in
  `computeFloatingPosition` (the matchAnchorWidth precedent — a new
  option, not a contract change); `open` / `open-change` + `select`
  event channels (CONVENTIONS §9 — no imperative exceptions);
  `slot="header"` static user block, leading icon slot, red-text
  `variant="destructive"` rows, 44px rows over the captures' ≈40±2 (the
  A11y floor is law); panel chrome fully on neutral tokens with
  `--tk-menu-popover-*` styling hooks. The admin patterns (avatar-menu
  with header slot, table-kebab, header-overflow) ship as story
  compositions, not separate components.
- `pillkit-tj-fonts` — the ТЖ fonts carrier package (spec 18.3, queue
  v1.4.0-(d), maintainer rulings B/split/XCharter): bundled XCharter ×4
  faces (400 / 400 italic / 700 / 700 italic, woff2, no subsetting) — the
  free Charter idiom WITH Cyrillic under the Bitstream Charter license
  terms (verbatim grant + Panov/Sharpe attribution in LICENSE-FONTS.md;
  the rename to "XCharter" is the license's rename clause at work).
  Graphik is deliberately absent — the Commercial Type EULA grants usage,
  not redistribution — and travels as a commented face-recipe in
  `fonts.css`. The `--tj-font-reading` slot now leads with XCharter; the
  `pillkit-tj-*` trio stays zero-fonts by test (`tests/tj-fonts-policy.test.ts`
  re-scoped + a carrier describe pinning faces/manifest/licenses).
  v1.5.0 is the FIRST TAG shipping bundled fonts in-tree.

### Fixed

- tk-menu-item / tk-menu-divider: APG roles are asserted at connect time —
  constructor-time host attributes do not survive React 19's element creation,
  so React compositions received role-less rows (menuitem/separator) while the
  Lit-template stories stayed correct. Caught by the v1.5.0 Flow-B
  fresh-consumer gate; shipped in `c7fe548`, which the tag was moved to.
- tj-header pill metrics remeasured against the stable reference captures
  (spec 18.1, queue v1.4.0-(e)): nav chips 36→40px (7 chips × 2 captures,
  zero spread), the header CTA pill 36→30px with its inset-block 4→7px
  ((44−30)/2; the 16.5 probe-notes already recorded h30). Visual
  baselines intentionally NOT re-minted — the delta is sub-threshold
  (<1.5% pixel law); the computed truth is pinned in unit tests.

### Internal

- Batch-confirm ЧАСТЬ v1.4.0 CLOSED (delegated retro sitting, the v1.3.0
  precedent): 136 suite-ТЖ + 3 per-component legs — all ✅, 0 flags, 0
  overwrites; two registry corrections ratified.
- README freshness (spec 18.2): tag pins moved to the current release,
  the devEngines caret-spec trap and the `--prefer-offline` tip recorded.
- Docs actualization (spec 18.4): 10 post-18.3 staleness sites
  synchronized across README/LICENSE/package READMEs.
- pnpm 12.5.1 lesson encoded in CLAUDE.md: a new workspace package needs
  its lockfile `importers` entry verified BEFORE push (a local "Already
  up to date" install lies; CI's `--frozen-lockfile` is stricter).
- Release note: the v1.5.0 tag was placed on `9e3c32b` («tag ok») and MOVED
  to `c7fe548` the same day (RELEASE.md §7 — maintainer decision, zero
  consumers at that age) so the release ships the React-surface fix; the
  two-round Flow-B gate record — `.playwright-cli/verify/v150-fresh-clone/`.

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


