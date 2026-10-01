# GAP-MAP — invest section vs tinkoff-ui kit (recon round 2026-10-01)

Method: 9 sub-sitemaps → ~16.6k URLs → 56 representative templates captured read-only (1280×900 full-page PNG + DOM census each; see INDEX.md). 8 analyst agents fanned over the captures (reports/gap-{1..8}-*.md); every claim anchored to census counts + kit sources. Triage below merges, dedupes, and corroborates the 8 shortlists. Classification: NEW-COMPONENT / NEW-PATTERN / VARIANT / COVERED. Sizes S/M/L are build-complexity estimates from the analysts, arbitrated where they disagreed.

Dedupe rulings applied in triage:
- The «social feed card w/ engagement bar» (gap-2 #4, NEW-PATTERN via tk-article-card) is re-classified as the **tj-post-card invest extension pack** — the kit already has a post-card family with reactions (gap-4's kit-truth reading wins over surface novelty).
- tk-scroll-row (gap-4) ≡ tk-carousel (gap-3) ≡ horizontal card carousel (gap-2) — one primitive.
- tk-ticker-rail (gap-4) ≡ ticker-chip pill family (gap-2) — one market-data primitive family (rail is the multi-instance form).
- portfolio-intro and social-publish captures were redirect duplicates of the hub/pulse — not counted as separate surfaces.

## Tier A — NEW-COMPONENT, cross-corroborated (recommended foundation wave)

| # | Candidate | Size | Corroboration (reports) | Evidence highlights |
|---|---|---|---|---|
| A1 | **tk-accordion** (FAQ / expansion panel) | S | gap-1 (bonds, etfs), gap-6 (account, iis), gap-7 (IPO image-verified), gap-2 (sber) | details:0 everywhere = JS accordion; no accordion in either kit (grep); highest reuse/effort ratio; reusable in ТЖ immediately |
| A2 | **tk-carousel** (horizontal rail primitive) | M | gap-3 (46+95 rails, image-verified), gap-4 (research 4+ sections, pulse), gap-2 (similar stocks/bonds/currencies), gap-1 (carousel chrome) | snap-scroll + circular chevron + dot pagination (active yellow) + a11y chrome — most-repeated surface in the whole capture set; live site ships them a11y-less (differentiator) |
| A3 | **tk-quote-chip family** (market-data pill: logo + price + Δ%; modes: inline $TOKEN, mini-quote, attached-quote box, «Ещё N» overflow, hub ticker rail) | S-M | gap-4 (#1), gap-2 (#3) | the ONLY market-data answer in the kit to the whole section; ubiquitous on news/pulse/research/instrument pages |
| A4 | **tk-skeleton** | S | gap-1 (stocks 1, bonds 3, currencies 1, germany 1), gap-3 (favorites 1) | census `skeleton` counters; system-wide loading primitive absent; new vs v2 mapping |
| A5 | **tk-empty-state** | S | gap-3 (favorites 706×328 image-verified) | gray disc icon + heading + text-link CTA; every data surface needs one |
| A6 | **tk-note** (quiet info callout w/ optional «Показать» disclosure) | S | gap-1 (bottom of every list page: stocks, bonds, etfs, currencies, germany) | kit messaging is only transient tk-toast or blocking tk-modal |
| A7 | **tk-rating** (read-only star display) | S | gap-1 (bonds ~30 rows), gap-7 (reviews) | no rating primitive anywhere |
| A8 | **video/media embed block** | S | gap-1 (hub videos 1), gap-5 (web-terminal 5, products-bonds 1), gap-7 (halal 1), gap-3 (hub 1) | zero media component in kit (grep) |
| A9 | **tk-breadcrumb** | S | gap-8 (disclaimers page; grep: zero implementations repo-wide) | invest inner pages generally |
| A10 | **tk-link-preview** (og-card attachment) | S | gap-4 (pulse) | favicon + domain + title + desc; useful for ТЖ too |

## Tier B — NEW-COMPONENT, single-source but strong

| # | Candidate | Size | Report | Notes |
|---|---|---|---|---|
| B1 | **Interactive price chart + toolbar** | L | gap-2 | canvas 7 / chartLike 10 census-invariant on ALL instrument pages; timeframe chips М5…Мес, tooltip badge, reference line. The single biggest gap; the only L-class item — needs a scoping decision (geometry/hooks-first spec vs defer) |
| B2 | **Instrument hero identity card** (4 gradient variants by asset class, star favorite, emblem roundel) | M | gap-2 | core of every instrument page |
| B3 | **tk-range-slider** | M | gap-6 | iis calculator hero; a11y (aria-valuenow, keyboard), min/max/step, formatter |
| B4 | **KV spec list w/ tooltip labels** | S | gap-2 | sber/bond/future; tk-tooltip exists, list shell doesn't |
| B5 | **tk-audio-player** | M | gap-4 | podcast transport bar + inline player |
| B6 | **tk-chart-figure** (iframe/embed figure wrapper: caption + lazy + aspect) | M | gap-8 | research articles: 55+24 iframes, 0 canvas, 0 tables — data-viz arrives as sandboxed embeds; the gap is the wrapper, not the chart engine |
| B7 | **tk-code-block + endpoint/method card** | M | gap-7 | open-api (census-inferred — lens before spec); --tk-font-mono exists docs-site-only |
| B8 | **tk-timeline** (vertical connected nodes; or tk-stepper orientation=vertical) | M | gap-7 | IPO «Как проходит размещение» |
| B9 | **Author/expert strip** | S | gap-3 | strategies + ideas + education |
| B10 | **Asset mini-card + logo-token row** (labeled ~150×110 / logo-only modes) | S-M | gap-3 | «Недавно просмотренные», «Чаще покупают» |
| B11 | **Movers mini-list card** («Взлеты дня» 2×2) | S-M | gap-3 | |
| B12 | **Strategy card** (risk pill + forecast block + author strip) | M | gap-3 | |
| B13 | **Icon-tile quick-nav dock** | M | gap-3 | hub (8 tiles + «Войти») |
| B14 | **Publisher header** (dual verified badges + subscriber count + follow pill) | S | gap-2 | «Профиль в Пульсе» |
| B15 | **Post composer, invest flavor** (ghost input + ИИР microcopy) | S | gap-2 | pulse forum; ТЖ composer is the mold |

## NEW-PATTERN (recipes / compositions; docs stories, few or no new atoms)

| # | Pattern | Size | Reports |
|---|---|---|---|
| P1 | Pricing/plan card + тарифная матрица (feature rows × N plan columns; CSS-grid, not table) | S + M | gap-5 (tariffs, trader) |
| P2 | Screener/filter panel (parametric filters + chain tables; options 12 inputs) | M | gap-5 |
| P3 | Lead-form recipe (phone + consent + CTA; standalone + iframe embed) | M | gap-6 (3 pages), gap-3 (hub) |
| P4 | Stat tiles / big-number grid («12 лет», «29+ млн»; one dark card) | S | gap-7 (IPO), gap-1 (hub) |
| P5 | Load-more «Показать ещё» + pagination hybrid (yellow active pill) | S | gap-3, gap-4, gap-1 |
| P6 | Active-filter strip («Активные фильтры [n]» + Сбросить + Все фильтры) | S | gap-1 (bonds, etfs) |
| P7 | Infinite-scroll feed recipe (no pagination/footer; news 21.7k px, pulse 16.5k px) | S | gap-2 |
| P8 | Research-article pattern (analyst byline + figure flow + tabs + ИИР closing note; composes B6) | M/L | gap-8 |
| P9 | Legal/document prose page (~16px fine print; tj-prose Charter scale is the wrong instrument) | S/M | gap-8 |
| P10 | Document/link list rows (icon + bold title + gray meta) | S | gap-8 (for-deponents) |
| P11 | 404 pattern (illustration + h1 + links; explicitly NO search — census 0 inputs/0 buttons) | S | gap-8 |
| P12 | Reward-tiers block + share/copy-link widget (readonly pill + copy icon) | S/M | gap-7 (mgm image-verified) |
| P13 | Placement/IPO calendar card (month group + ticker + price range) + result cards | M | gap-7 |
| P14 | Quote-repost nested wrapper | S | gap-4 |
| P15 | «Авторы стратегий» / channel-recommendation widget rows | S | gap-2, gap-4 |
| P16 | «Другие бумаги компании» 2-stat carousel card | S | gap-2 |
| P17 | Gift-certificate card + promo-code entry | M | gap-7 (census-inferred) |

## VARIANT backlog (extensions to existing components; mostly S)

- **tk-data-table** — the heaviest backlog: sortable headers w/ aria-sort (gap-1, gap-3); sticky header + section grouping at 76k/482k px scale (gap-5); financial row anatomy: avatar+name+ticker cell, colored link column (Покупка/Продажа), subrow «% портфеля», stacked metric cell, two-line value+caption, right-aligned numerics, monochrome signed-value + selective delta-coloring conventions (gap-1, gap-2, gap-4).
- **tj-post-card invest extension pack** (M) — verified badge, «Подписаться» pill, text-icon action bar, reactions, «Читать дальше», quote-repost nesting, editorial «АНАЛИТИЧЕСКИЙ ОБЗОР» mode, inline $ticker/@/# chips (gap-4; re-classed from gap-2's NEW-PATTERN).
- **tk-filter-chips** — yellow-outline selected state + removable «×» + «Ещё ⌄» overflow → tk-menu-popover (gap-1, gap-3).
- **tk-tabs** — pill mode w/ yellow ring + overflow tab «Еще ⌄» + notification dot (gap-4, gap-3).
- **tk-promo-card** — dark/inverted + number-badge overlay; corner-logo + scrim + date pill; featured-hero; idea/metric mode; sidebar price-ticket mode (gap-1, gap-3, gap-4, gap-2).
- **tk-article-card** — media-overlay + badge-stack; course mode (badge-on-cover + «N уроков»); broadcast mode; engagement footer row (gap-4, gap-3, gap-2).
- **tk-badge** — positive/negative financial tones (badge.ts:45 union extension); on-avatar padlock overlay mode (gap-7, gap-1).
- **tk-stepper** — horizontal step-cards w/ overlapping numerals; vertical timeline mode (= B8) (gap-3, gap-7).
- **tk-input** — OTP `code` variant (4-cell, auto-advance, paste-split); resend countdown; phone mask +7 (gap-6).
- **tk-select** — pill w/ uppercase value («ВСЕ АНАЛИТИКИ ⌄») (gap-3).
- **tk-segmented-radio** — trailing overflow «Ещё» item (gap-3).
- **tk-link** — back/chevron variant («‹ Академия», «‹ Фьючерсы») (gap-3, gap-1).
- **tk-footer** — dark legal bar mode (6 pill links + dual phone block) (gap-3).
- **tk-button** — icon-only circular (social share row) (gap-7).
- **tk-pagination** — hybrid load-more + numbers (also P5) (gap-4).

## Explicitly COVERED (no action; census-verified)

Cookie consent (dialogs:1 ≈ every page → tk-cookie-banner), mega-nav + invest sub-nav tabs, combobox search «Название или тикер», currency segmented «Все/₽/$€», filter dropdowns (tk-select), mega footer (12-group sitemap), pagination, horizontal numbered stepper (mgm/open-account exact match), feature/service/promo marketing grids, ad-slot mid-grid CTA, ТЖ composer stub ~1:1, post «⋯» menu (tk-menu-popover), modals/chat iframes (tk-modal; 3rd-party chat out of scope), catalog composition (stocks-catalog showcase), IPO promo cards (tk-promo-card modes), tabs underline/pill primitive, lead atoms (tk-input type=tel, tk-checkbox, tk-button).

## Negative findings & live-site bugs (kit should do it right)

- Future + currency instrument pages ship EMPTY h1 (live a11y bug).
- Bond chart Y-axis renders raw unformatted floats («19999999,00000»).
- Decimal-separator drift across sibling cards («17.25%» vs «16,75%») — kit must pin one convention.
- Site carousels ship without a11y chrome.
- securities: unbounded 482k-px list, no virtualization evident; margin-equities 76k px — sticky-header evidence for the scale pack.
- Bond payment calendar: KV-only, no graphic timeline (do NOT mint one).

## Deferred / unverifiable (do not spec yet)

- Invest terminal chrome (chart toolbar, watchlist, order ticket) — imagery-only (inside screenshots/video, no DOM); needs a live terminal DOM capture. L.
- Authenticated surfaces: extended composer, LIVE broadcast states, portfolio, dfa-account (auth-gate → login page captured).
- Research sticky-TOC / footnote blocks / byline details — census-unprovable; slice probe needed.
- Census-inferred, pending maintainer lens pass: open-api code-blocks, reviews star ratings, gift certificate/promo-code.
- Hub second dialog (dialogs:2) — unidentified at capture legibility.
- Chart engine decision (B1) — maintainer scoping ruling needed (lib vs spec-out vs geometry-hooks-first).

## Recommended sequencing (orchestrator's view)

1. **Foundation wave** (cross-kit reuse, all S except carousel): A1 accordion, A4 skeleton, A5 empty-state, A6 note, A7 rating, A2 carousel. Nothing invest-specific; every one multi-report.
2. **Invest identity wave**: A3 quote-chip family + badge pos/neg tones + data-table financial-cell pack (one coherent market-data story), B2 instrument hero, B4 KV list, price-ticket promo mode.
3. **Pattern wave** (docs stories, cheap): P1 pricing+matrix, P3 lead-form, P4 stat tiles, P5/P6 list-completion set, P10/P11 rows+404.
4. **Heavy tail** (needs decisions): B1 chart (scoping ruling), P8 research pattern + B6 figure wrapper, A3-rail scale-up.
5. VARIANT packs batched per component (chips/tabs/article-card first — they unblock the pattern wave).

Open method notes: all captures logged-out; instrument data cards (price+sparkline+buy) never rendered — NOT claimed as covered. Census `chips` on catalog pages = padlock badge overlays, not filter chips.
