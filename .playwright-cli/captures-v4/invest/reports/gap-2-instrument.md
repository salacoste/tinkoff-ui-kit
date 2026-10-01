# Gap report 2 — invest instrument pages (8 pages, chunk 1)

Source: inv-gap-instrument agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census + slices (stock-sber ×3 tabs, bond ru000a0jxts9, etf tven, future aez6, currency usd000utstom, ideas). Tall screenshots sliced + vision-analyzed, cross-checked with census. Read-only.

Census invariants across all 8 pages: `canvas: 7, chartLike: 10` on every instrument page; `selects: 0, menus: 0, chips(class): 0, skeleton: 0` — everything interactive is custom-built, nothing native.

## stock-sber (/invest/stocks/sber/, scrollH 5517; buttons 14, canvas 7, tabs 7, carousel 5)
- Site header + mega-nav + invest sub-nav — COVERED — tk-navbar / tk-tabs underline.
- **Instrument hero**: green gradient card, «Сбербанк» + SBER, «Доходность за полгода» −12,86%, white outline star favorite, circular logo roundel — NEW-COMPONENT — recurs on all pages in 4 gradient variants.
- **Interactive chart + toolbar**: timeframe pill chips М5…Мес (Д active, yellow border), pencil + chart-type icon buttons, gradient fill, dotted reference line, black tooltip badge «277,65» — NEW-COMPONENT — census canvas 7 / chartLike 10.
- «О компании» + blue «Читать далее» expander — VARIANT — text-collapse mode.
- Fact row: flag roundel + MOEX roundel inline — VARIANT.
- Sidebar trade ticket: «Цена акции», 275,79 ₽, yellow «Открыть счет» pill, blue «войдите в личный кабинет» — VARIANT — tk-promo-card price-ticket mode.
- **«Профиль в Пульсе» publisher header**: avatar, «Sber_Official», TWO verified badges (green shield + blue circle), «133,1K подписчиков», yellow «Подписаться» — NEW-PATTERN.
- «Сводный прогноз» card: Прогнозная цена + green delta, Диапазон, Рекомендация «Покупать» — VARIANT — feature-card-like stat card.
- «Показатели акции»: segmented «Торговые данные / Параметры бумаги» + 6-row KV list with green/red deltas — VARIANT + NEW-COMPONENT (KV stat list absent).
- «Дивиденды» 3-col table + blue «Все дивиденды» header link — VARIANT — tk-data-table + section-header-link convention.
- «Частые вопросы» FAQ accordion: bordered card, bold question, thin grey chevron, 1px dividers — NEW-COMPONENT.
- «Похожие акции» horizontal carousel: white rounded cards (name, price, green delta, logo roundel), circular chevron, 2 dots (active yellow) — NEW-COMPONENT — census carousel 5.
- News cards with engagement footer (thumb count, comment count) + compact text rows — VARIANT — tk-article-card engagement row.

## stock-sber-news (scrollH 21694; links 216, img 152)
- Single-column infinite card feed: no sidebar widgets, no date group headers, no banners, no «Показать ещё»/pagination/footer — page ends mid-card — NEW-PATTERN.
- Social news card: author row (avatar, channel name, green verified check, sometimes second blue badge), grey timestamp, bold headline, optional wide cover image, body line — NEW-PATTERN — uniform anatomy across all sampled slices.
- **Ticker-chip pill row**: small light pill = circular logo + bold price + colored % delta; 2–3 pills + light-blue overflow pill «Ещё 6» — NEW-COMPONENT — inline in-body variant with light-beige tint.
- Reaction counter: overlapping emoji/avatar icons + count, or single blue thumbs-up badge — VARIANT.
- Action bar over thin divider: «Нравится» + «Комментировать» or numeric count + right-aligned share arrow — NEW-PATTERN.

## stock-sber-pulse (scrollH 16515; buttons 65)
- Forum header + right-aligned filter pills «Все посты»/«Интересные» (active = yellow border) — VARIANT of tk-filter-chips.
- **Post composer**: yellow avatar circle + rounded ghost input, placeholder «Что вы думаете про Сбербанк?», microcopy «Не является индивидуальной инвестиционной рекомендацией» — NEW-COMPONENT (S).
- Post cards share news-card anatomy + blue «Читать дальше» truncation + attached single-quote widget (light-gray rounded box: logo, price, green delta) — VARIANT of ticker chip.
- Inline $SBER blue links + #hashtags in body — NEW-PATTERN (rich-text autolink).
- «Авторы стратегий» in-feed widget: 3 rows (avatar, name, «9,3K подписчиков», green yield % right) — NEW-PATTERN (S).
- buttons 65 = per-post action bar × ~15 posts + chips. Infinite feed — ends mid-card, no load-more/footer. Media posts plain images — COVERED.

## bond ru000a0jxts9 (scrollH 3366)
- Green gradient hero «Russia 2027» + ISIN, «Доходность к погашению» 15,76% на 8 месяцев, eagle emblem — hero family.
- Chart suite + toolbar — Y-axis renders raw floats «19999999,00000» (live-site polish issue).
- Sidebar price ticket — VARIANT.
- **«Информация о выпуске» KV list**: grey label left, black right-aligned value, 1px dividers, gray circular ⓘ tooltips (Субординированность, Амортизация…) — NEW-COMPONENT (S).
- «Интересное в Пульсе» compact rows: avatar, bold name + grey timestamp, 2-line body with blue $ticker chips, no counters — NEW-PATTERN.
- News 2-col cards w/ engagement — VARIANT.
- ABSENT: payment calendar/timeline — payments KV-only.
- «Похожие облигации» carousel. «Другие бумаги компании» on grey band: carousel cards w/ 2-stat layout («Доходность» big %, «Погашение» date, emblem top-right) — NEW-PATTERN (S).

## etf tven (scrollH 2138)
- Dark near-black hero «Венчурные Инвестиции» + TVEN, yellow lightbulb logo, NO metric inside hero — hero variant.
- Chart suite (dashed line, black badge 1241.5).
- «Управляющая компания»: 64px grey circle avatar, grey label, «Т-Капитал» semibold link + blue external arrow — NEW-PATTERN (S).
- Fact rows (Страна эмитента flag, Биржа roundel) — VARIANT.
- ABSENT: spec table, donut, holdings, segmented toggle, carousel, FAQ.

## future aez6 (scrollH 2234; census h1 EMPTY — live-site a11y bug worth noting)
- Dark gradient hero «AED-12.26 Курс дирхам ОАЭ — Российский рубль» + AEZ6, «Тип контракта» grey label / «Расчетный» white value, UAE flag roundel, star — hero variant.
- Chart suite (badge 23,035) + sidebar «Цена фьючерса» 23 035 пт.
- «Параметры фьючерса»: intro «Торгуется до 17.12.2026 (еще 77 дней)» + KV rows ALL with gray «?» tooltip icons — confirms KV-with-tooltips need.
- Pulse rows + news cards w/ engagement — as others. Multi-line legal disclaimer — COVERED.

## currency usd000utstom (scrollH 2940; h1 EMPTY)
- Light-gray gradient hero «Доллар США» + USD000UTSTOM, large US-flag roundel ~130px, grey outline star, NO yield metric — hero variant.
- Chart (black pill 82,66, dashed line). NO stats/KV section at all — «Интересное в Пульсе» directly after chart; starkest page.
- Sidebar «Цена валюты» 83,5 ₽ — VARIANT.
- News: 2 large image cards + compact text rows — VARIANT.
- «Другие валюты» carousel: name top-left, circular logo top-right, price, green delta; includes commodity cards Платина Pt / Серебро — NEW-COMPONENT carousel instance.
- Blue «Информация» + 4-line disclaimer, page ends.

## ideas (/invest/stocks/sber/ideas/, scrollH 2357)
- Hero + sidebar + local tabs (Идеи active).
- «Инвестиционные идеи» 4-col table: «Название» (bold 2-3-line linked title + grey «date · source») / «Горизонт» / «Можно заработать» (green %, right-aligned) / «Текущая доходность» (plain black %); ~20 rows, no avatars — VARIANT of tk-data-table link-rows; selective delta-coloring is the new convention.
- ABSENT: load-more, pagination, banners, promo, disclaimer — page just ends.

## Ranked shortlist
1. **Interactive price chart + chart toolbar — NEW-COMPONENT, L** — canvas line chart w/ gradient fill, hover tooltip badge (black pill), dotted reference line, Y-axis; toolbar = timeframe pill chips М5…Мес (yellow active) + indicator/chart-type buttons. ALL 7 instrument-bearing pages (canvas 7 / chartLike 10 everywhere). Kit has zero charting — biggest single gap.
2. **Horizontal card carousel — NEW-COMPONENT, M** — snap-scroll white rounded cards + circular chevron (blue ›) + dot pagination (active yellow). «Похожие акции/облигации», «Другие валюты»; census carousel 3-6. Reusable far beyond invest.
3. **Ticker-chip mini-instrument pill + «Ещё N» overflow — NEW-COMPONENT, S-M** — circular logo + bold price + colored % delta; modes: standalone row, in-body tinted, single attached-quote box. Ubiquitous on news + pulse.
4. Social feed card w/ engagement bar — NEW-PATTERN, M — author row → headline → optional image → ticker chips → reaction counter → divider + «Нравится»/«Комментировать»/share. tk-article-card social mode; ~40% of captured pixels.
5. Instrument hero identity card — NEW-COMPONENT, M — gradient by asset class (green stock/bond, dark ETF/futures, light currency), name+ticker, headline metric (or none), outline star, circular emblem. 4 variants.
6. FAQ accordion — NEW-COMPONENT, S — sber, universally reusable.
7. KV spec list w/ tooltip labels — NEW-COMPONENT, S — sber/bond/future; tk-tooltip exists, the list shell doesn't.
8. Sidebar trade/price ticket — VARIANT, S — tk-promo-card mode; identical on all pages, high leverage.
9. Post composer — NEW-COMPONENT, S — pulse.
10. Publisher header w/ dual verified badges + follow — NEW-PATTERN, S.
11. Infinite-scroll feed recipe — NEW-PATTERN, S — news 21694px / pulse 16515px / ideas: no pagination, footer, load-more.
12. «Авторы стратегий» widget — NEW-PATTERN, S — pulse.
13. Ideas table conventions — VARIANT, S — link-rows + right-aligned numerics + selective green deltas.
14. «Другие бумаги компании» 2-stat carousel card — NEW-PATTERN, S — bond.

Cross-cutting negatives worth recording: bond payments KV-only (no calendar graphic); fund has no holdings/spec table; currency page has no stats section; future + currency captures ship EMPTY h1 (live-site a11y bug — good ammo for the kit doing it right); bond chart Y-axis renders raw unformatted floats.
