# Gap report 5 — invest tariffs/terminal/trader pages (8 pages, chunk 2)

Source: inv-gap2-terminal agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census (tariffs, web-terminal, trader, trader-neoassets, margin-equities, securities, options, products-bonds). values-futures excluded (byte-identical to chunk-1 futures-list). Image-read budget (2) spent on tariffs.png + trader.png; rest census + repo evidence.

Kit roster verified: `packages/components/src/` (31 dirs incl. data-table, tabs, segmented-radio, select, combobox-search, filter-chips, feature/promo/service-card, modal, tooltip, menu-popover, pagination, stepper) + `packages/tj-components/src/` (10 tj-*) + docs stories `packages/docs/src/v2/` (mega-nav, console-chrome, data-surfaces) + `packages/components/src/showcase/stocks-catalog.stories.ts`.

## tariffs — /invest/tariffs/ (img-read + census: buttons 21, h2 9, h3 15, tablists 1/tabs 2, tables 0, scrollH 6260)
- Hero «Тарифы Т-Инвестиций» + CTA — COVERED (promo-card/feature-card atoms).
- «Тарифные планы»: 3 plan cards («Инвестор» / «Трейдер» / «Премьер») — name, fee headline (0,05 % / 0,01 % / подписка), feature bullets, «Выбрать» CTA — NEW-PATTERN (pricing/plan card; feature-card has no price-line + checklist + CTA composition).
- Тарифная матрица: feature rows × 3 plan columns, values/галочки, tab-switched — NEW-PATTERN (comparison matrix). Evidence: tables=0 — matrix is CSS-grid divs, not `<table>`; tk-data-table (packages/components/src/data-table/data-table.ts) is a row-anchor navigational list, different shape.
- Info/FAQ sections — COVERED (prose; census details=0, no accordion needed).

## web-terminal — /invest/web-terminal/ (census: videos 5, img 19, h2 11, scrollH 9234)
- Marketing hero/feature sections — COVERED.
- 5 встроенных видео-демо — NEW-PATTERN (video embed/demo block) — kit has zero video/media component (grep across packages/*/src: none).
- Terminal chrome (chart toolbar, watchlist, order ticket) — NEW-COMPONENT family — imagery-only (inside screenshots/video, not DOM); defer until real terminal app DOM captured.

## trader — /invest/trader/ (img-read + census: tablists 3/tabs 10, buttons 30, tables 0, scrollH 9886)
- Hero + benefit cards — COVERED.
- 3 tab groups (instruments / platform / тарифы) — COVERED (tk-tabs indicator pill|underline + tk-segmented-radio).
- Dark terminal screenshot block — imagery; deferred terminal-chrome family.
- «Тариф Трейдер» pricing blocks + commission comparison — NEW-PATTERN — same pricing-card + matrix pair as tariffs (shared deliverable).

## trader-neoassets — /invest/trader/neoassets/ (census: svg 25, h2 8, scrollH 7114)
- Marketing benefits/icons/FAQ — COVERED — nothing structurally new.

## margin-equities — /invest/margin/equities/ (census-only: tables 5, links 5326, inputs 1, scrollH 75,962)
- «Перечень ликвидного имущества со ставками риска»: 5 sectioned mega-tables (~1000+ linked rows each), 1 search — VARIANT of tk-data-table — data model fits (href rows, align:end, delta tone), but no sticky header anywhere except navbar (grep `sticky` → only navbar.css.ts) and no section grouping; needed at 76k px.
- Search above table — COVERED (combobox-search/input).

## securities — /invest/securities/ (census-only: tables 11, scrollH 482,069, viewport-only PNG)
- «Перечень ценных бумаг» catalog: 11 category tables — COVERED as pattern — stocks-catalog showcase already composes combobox-search + filter-chips + data-table + pagination; same sticky-header scale VARIANT as margin-equities.
- Caveat: census title = bank homepage title («Кредитные и дебетовые карты…»), h1 empty — capture landed on an interstitial/wrapper; table/scroll counts look genuine for the catalog DOM.

## options — /invest/options/ (census: inputs 12, tables 3, tablists 2/tabs 4, dialogs 2, scrollH 3035)
- «Каталог опционных контрактов»: parametric filter form (12 inputs, no `<form>`) + option-chain result tables — NEW-PATTERN (screener/filter panel). Atoms exist (input, select, segmented-radio call/put toggles, tabs, data-table) — a composition/pattern story in packages/docs/src/, not new atoms.

## products-bonds — /invest/products/bonds/ (census: videos 1, h2 9, h3 7, scrollH 8495)
- Marketing product page (hero «Надежный регулярный доход», benefit cards, 1 video, FAQ, CTA) — COVERED; video block same as web-terminal note.

## Ranked shortlist (NEW-element candidates)
1. Тарифная матрица (feature rows × N plan columns, tab-sectioned) — NEW-PATTERN — M — tariffs + trader; tables=0 on both, CSS-grid divs; tk-data-table is a row-anchor list, different shape.
2. Pricing/plan card («Инвестор»/«Трейдер»/«Премьер»: fee headline + bullet checklist + CTA) — NEW-PATTERN (tk-plan-card near feature-card) — S/M.
3. tk-data-table scale pack — sticky header + section grouping (+ tall-page perf) — VARIANT — M (sticky header alone S; unlocks margin-equities 76k px / securities 482k px; grep confirms sticky today only in navbar.css.ts).
4. Опционный screener — parametric filter panel + chain tables — NEW-PATTERN — M.
5. Video embed/demo block (web-terminal videos=5, products-bonds videos=1) — NEW-PATTERN — S — kit has zero media/video component.
6. Invest terminal chrome (chart toolbar, watchlist, order ticket) — NEW-COMPONENT family — L — imagery-only evidence; capture live terminal DOM before speccing.

Explicitly COVERED: marketing heroes/benefit grids, tabs/toggle groups, mega-nav + console chrome (docs v2 stories), instrument catalog lists (stocks-catalog.stories.ts), search/chips/pagination, FAQ prose, cookie dialog (dialogs=1 every page → cookie-banner shipped).

Caveats: securities census interstitial title; margin-equities census-only; image budget 2/2 used.
