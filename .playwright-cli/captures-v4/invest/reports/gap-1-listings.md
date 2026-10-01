# Gap report 1 — invest listing pages (8 pages, chunk 1)

Source: inv-gap-listings agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census (hub, stocks-list, bonds-list, etfs-list, futures-list→values, currencies-list, indexes, catalog-country-germany). Read-only, no live browsing.

Global note: every capture carries the cookie-consent card («Мы используем куки…» + «Хорошо», bottom-right floating) — COVERED (tk-cookie-banner; census `dialogs:1` on nearly every page = this widget). Invest section chrome — global navbar with active underline, secondary underline tablist (Обзор / Каталог / Пульс / Аналитика / Академия / Терминал; census `tablists:1` on all catalog pages), gray pill search «Название или тикер» (tk-combobox-search), chip row with «Ещё ⌄» overflow, mega sitemap footer (tk-footer) — matches the v2 stocks mapping, treated as mapped.

Changes vs the v2 stocks mapping:
- Skeleton loaders now present: stocks 1, bonds 3, currencies 1, germany 1 (census `skeleton`) — absent from v2.
- Row anatomy evolved: ~96px rows (v2: ~80px), 48–56px circular logos, two-line cells everywhere (value + gray caption: «1 лот = 1 акция», maturity «на 11 лет», delta absolute + percent).
- On indexes the «Ещё» overflow chip itself is selected with a remove affordance («Ещё ×»); «Индексы» lives inside that overflow menu — new state detail for the chip-tablist pattern.

## hub — /invest/ (scrollH 7840, links 399, h2 9, h3 21, img 33, tabs 2, tablists 1, videos 1, iframes 1, dialogs 2)

Capture legibility low (1280×7840 downscaled); structure-level findings only.
- Championship hero: H1 «…призовым фондом 100 000 000 ₽» + yellow pill CTA + large 3D-render visual — VARIANT (tk-promo-card has art modes + floating-pill CTA but not this eyebrow-less big-stat hero composition).
- Dark inverted promo cards with floating number badges («0%», «5₽», «PREMIUM») — VARIANT (tk-promo-card: no dark/inverted theme or number-badge overlay).
- Tablist switching сайт/приложение/терминал panels — COVERED (tk-tabs underline).
- Stepper: 3 circular numbered badges (заявка → код → пополнение) — COVERED (tk-stepper).
- Embedded lead form: tel input + yellow «Продолжить» + consent checkbox — COVERED (census iframes 1, inputs 2; tk-input/tk-checkbox inside iframe; composition exists in invest landing patterns).
- Big-number stat card grid («29+ млн», «0%», license cards; one dark inverted card) — NEW-PATTERN («Нам доверяют…», 3+2 card rows: icon + heading + oversized value; kit has no stat/number-emphasis card).
- Video/media block — NEW-COMPONENT (census videos 1; kit has no media embed primitive).
- 2/3-col feature card rows, cross-sell tiles, sitemap footer — COVERED.
- Second `dialog` beyond cookie — UNVERIFIED (census dialogs 2; not legible at 327px render — flag only).

## stocks-list — /invest/stocks/ (buttons 16, tables 1, svg 31, tablists 1, skeleton 1)

- Typographic table (Название / Цена акции / За день / За год, red/green deltas, «Показать еще», pagination) — COVERED (v2-mapped: tk-data-table link-rows + tk-pagination).
- Sortable column headers (⇅ / ≡ icons on every header) — VARIANT (tk-data-table has no sort interaction/aria-sort).
- Skeleton loading block — NEW-COMPONENT (census skeleton 1; no tk-skeleton in kit).
- Load-more row «Показать еще» (full-width gray button, blue text) — VARIANT (tk-button block/soft; trivial).

## bonds-list — /invest/bonds/ (buttons 14, links 144, tables 1, svg 136, tabs 3, tablists 2, skeleton 3, img 31, scrollH 3549, ~30 rows)

- Currency segmented control «Все / ₽ / $ €», pill-in-gray-container — COVERED (tk-segmented-radio; census tabs 3 + tablists 2 = secondary nav + this control; site exposes it as role=tablist).
- Dropdown filter buttons «Отрасль ▾», «Оценка облигаций ▾» — COVERED (tk-select).
- Active-filter strip «Активные фильтры [1]» count badge + «Свросить» + «Все фильтры» links, between filters and table — NEW-PATTERN (tk-filter-chips lacks summary/count/reset composition).
- Star rating under instrument name (3–5 yellow stars, ~30 rows, under name+ISIN) — NEW-COMPONENT (no rating display primitive).
- Skeleton shimmer blocks ×3 near FAQ zone — NEW-COMPONENT (tk-skeleton; census skeleton 3).
- FAQ accordion: 2 chevron rows with hairline dividers («Что такое облигация?», «Как посчитать доходность облигации?»), left column below table — NEW-COMPONENT (no expand/collapse primitive at all).
- Two-line table cells: maturity + gray caption «на 11 лет»; yield %; price — VARIANT (tk-data-table value+caption cell slot).
- Info banner with «Показать» disclosure, right column next to FAQ — NEW-COMPONENT (quiet gray callout; kit's messaging is only transient tk-toast or blocking tk-modal).

## etfs-list — /invest/etfs/ (buttons 13, tables 1, svg 29, tabs 3, tablists 2)

- Segmented «Все / ₽ / $ €» + dropdowns «Биржа», «Страна» + active-filter strip — strip NEW-PATTERN; rest COVERED.
- Padlock badges on fund logos (3 locked rows: TIND, TKVC, TSEC) — VARIANT (status badge overlaying logo; tk-badge has no on-avatar overlay mode).
- FAQ accordion («Что такое фонды?» ×2) + info banner — NEW-COMPONENT (same pair as bonds).
- «Показать еще» + pagination 1…23 — COVERED (tk-button soft + tk-pagination, yellow active page + ellipsis).

## futures-list — /invest/values/futures/ (buttons 1, links 172, tables 0, h2 3, tablists 0, scrollH 2859)

Structural outlier: marketing landing, no table/filters/search; the 172 links are almost entirely the sitemap footer.
- Back-crumb link «‹ Фьючерсы» top-left — VARIANT (tk-link chevron-back variant).
- Two-column hero: eyebrow «ФЬЮЧЕРСЫ» + H1 + yellow pill CTA + 3D render, beside gray side-card «Что такое фьючерсы?» + ghost «Узнать» — VARIANT (tk-promo-card needs eyebrow-label + side-info-card composition).
- Icon-card trio (dark circular icon + text, no links) — COVERED (tk-feature-card).

## currencies-list — /invest/currencies/ (buttons 3, links 88, tables 1, chips 6, skeleton 1, 19 rows)

- Table with flag/metal disc logos, two-line delta cells, neutral «0 ₽ / 0 %» states — COVERED / minor VARIANT (mapped table anatomy).
- Padlock badges on ~6–7 rows (EURRUB, GBPRUB, CNYRUB, JPYRUB, HKDRUB, TRYRUB, CHFRUB) — VARIANT; census chips 6 ≈ lock count → census `chips` on these pages = badge overlays, NOT filter chips.
- No «Показать еще»/pagination (full list rendered) — structural note only.
- Info banner + skeleton — NEW-COMPONENT (census skeleton 1).

## indexes — /invest/indexes/ (buttons 3, links 173, tables 1)

- Single-row table (TPSI, Значение 138,9 + two-line red/green deltas, bar-chart avatar) — COVERED (mapped table anatomy).
- «Ещё ×» overflow chip in selected state with remove affordance; «Индексы» itself lives inside the Ещё menu — VARIANT (tk-filter-chips needs selected+removable state on the overflow trigger).
- Full 12-group sitemap footer — COVERED (tk-footer).

## catalog-country-germany — /invest/catalog/stocks/country/germany/ (buttons 5, links 70, tables 1, chips 12, skeleton 1, h2 0)

- Country-scoped stocks table: currency-symbol prices («143,45 €», mixed €/$), ticker suffix @DE, «1 лот = 1 акция» captions — COVERED (locale/currency variation only).
- Padlock badges on all 12 rows — VARIANT (census chips 12 = row count 12).
- Info banner + «Показать» — NEW-COMPONENT (bottom disclaimer card).

## Top NEW-element candidates (agent's ranking; interactive primitives first)

1. Sortable headers for tk-data-table — VARIANT, M. ⇅/≡ affordances on every table page (6 of 8); click-to-sort states + aria-sort. Highest single leverage.
2. tk-skeleton — NEW-COMPONENT, S. stocks 1, bonds 3, currencies 1, germany 1. System-wide loading primitive entirely absent; new vs v2 mapping.
3. tk-accordion (FAQ / collapsible section) — NEW-COMPONENT, M. Chevron rows + hairline dividers on bonds + etfs. No expand/collapse primitive in kit; reusable far beyond invest (ТЖ).
4. Active-filter summary strip — NEW-PATTERN, S. «Активные фильтры [n]» + count badge + «Сбросить» / «Все фильтры» on bonds + etfs. Natural tk-filter-chips companion.
5. Status-badge-on-avatar (padlock overlay) — VARIANT of tk-badge, S. Gray lock chip overlapping logo bottom-right: germany 12/12 rows, currencies ~6, etfs 3.
6. tk-note (info callout card) — NEW-COMPONENT, S. Gray rounded disclaimer card + optional «Показать» disclosure at bottom of every list page (stocks, bonds, etfs, currencies, germany).
7. Star-rating display — NEW-COMPONENT, S. Read-only 3–5 yellow stars under bond names (~30 rows).
8. Dark/inverted promo card + number-badge overlay — VARIANT of tk-promo-card, M. Near-black cards, ghost buttons, floating «0%»/«5₽»/«PREMIUM» badges (hub).
9. Big-number stat card grid — NEW-PATTERN, S. Icon + heading + oversized value, one dark inverted card (hub «29+ млн»).
10. Back-crumb link («‹ Фьючерсы») — VARIANT of tk-link, S. One page, trivial but cheap.
11. Video/media embed block — NEW-COMPONENT, M. hub census videos 1. Lowest priority (marketing decoration).

Explicitly COVERED beyond the v2 set: currency segmented (tk-segmented-radio), filter dropdowns (tk-select), secondary tabs (tk-tabs), landing stepper (tk-stepper), iframe lead form (tk-input/tk-checkbox recipe), mega footer (tk-footer), pagination (tk-pagination), cookie consent (tk-cookie-banner).

Caveats: hub conclusions structure-level only (327px-wide render; census cross-check applied — census chips 0 on hub, so no chip bar claimed there despite a low-res hint; census dialogs 2, second dialog beyond cookie unidentified). Vision-tool pass on germany/bonds/indexes/hub used CDN URLs of the persisted PNGs; labels cross-checked against census counts where possible. No files written; live site not browsed.
