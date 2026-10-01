# Gap report 3 — invest app-surfaces (7 pages, chunk 1)

Source: inv-gap-app agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census + slices (strategies, ideas, recommendations, favorites, portfolio-intro [→/invest/ hub], education, education-courses; favorites-02 tail skipped as trivial). Read-only.

Honesty note: the full data-bearing instrument card (price + change-% + sparkline + buy button) never rendered in logged-out captures — not counted as covered where unrendered.

## 1. strategies — /invest/strategies/ (7281px; census 32 btn, 46 lnk, 14 tabs/2 tablists, 12 inputs, 1 skeleton)
- Global header + sub-nav tabs (Обзор/Каталог/Пульс/Аналитика/Академия/Терминал, black underline) — COVERED — tk-navbar + tk-tabs underline.
- Search «Название или тикер» — COVERED — tk-combobox-search.
- Filter chip row — 8 chips incl. «Ещё ⌄» overflow; selected chip = yellow 2px outline + black text + inline × remover — VARIANT — tk-filter-chips has no selected/×/overflow states → tk-menu-popover handoff.
- Segmented filter with trailing «Еще ▾» overflow item — VARIANT — tk-segmented-radio lacks overflow-menu affordance.
- **Strategy card** (2-col grid ~340px): hero image w/ risk pill «⚡×1-3 Риск», circular ₽ badge, circular «Р» info button, top-right overlapping logo/flag tokens, forecast block («Прогноз», «NN% в год», green pill «+NN,NN% за год»), title+desc, author strip (avatar, name, «Инвестирует с YYYY г., квалифицированный инвестор») — **NEW-COMPONENT** — nothing composes risk pill + forecast metrics + author credentials; closest tk-article-card (text-only).
- Author strip alone — NEW-COMPONENT (extractable) — recurs on ideas + education.
- «Показать еще» full-width load-more — **NEW-PATTERN** — kit's only list-continuation primitive is tk-pagination.
- Cookie banner — COVERED.

## 2. ideas — /invest/ideas/ (10090px; census 2 btn, 116 lnk, 1 input)
- H1 + right-aligned dropdown pill «ВСЕ АНАЛИТИКИ ⌄» — VARIANT — tk-select needs pill/uppercase-value mode.
- Blue uppercase sortable headers («ИДЕЯ / МОЖНО ЗАРАБОТАТЬ / ТЕКУЩАЯ ДОХОДНОСТЬ / ДАТА ПУБЛИКАЦИИ ↓») — VARIANT — tk-data-table no sortable-header mode.
- ~90 idea rows: mixed circle/rounded-square 40-48px logos, 2-line bold title, gray uppercase author line, stacked «до NN%», signed change % NOT color-coded, 2-line date, hairline dividers — VARIANT (row anatomy) — stacked-metric cell, subtitle line, mixed logo shapes = new cell slots; deliberate monochrome signed-value convention absent in kit.
- «Показать ещё» — NEW-PATTERN (as strategies).
- Mega-footer — COVERED.

## 3. recommendations — /invest/recommendations/ (6427px; census 17 btn, 67 lnk, 4 tables, carousel 46, chips 35)
- Search + chip row (yellow-outline selected, «Ещё ⌄») — VARIANT (same chip gap).
- **Horizontal carousels/rails** — 6+ per page («Недавно просмотренные», IPO, sector, media rails), right-edge circular white chevron, ~22-25px card gaps; census carousel 46 — **NEW-PATTERN (top gap)** — kit has NO rail/carousel primitive (no scroll-snap container, no edge chevron, no a11y chrome).
- «Недавно просмотренные» mini-card — NEW-COMPONENT — ~150×110 white card, centered 48-56px circular logo/flag, single-line truncated name.
- «Чаще покупают» rail — VARIANT of same mini-card — logo-only mode.
- «Взлеты дня» movers card — NEW-COMPONENT — 2×2 mini-lists: overline title + 3 rows (logo + name + green/red change) + «Смотреть все N» link.
- IPO promo cards — VARIANT — tk-promo-card corner-logo + dark scrim + date pill + «Нововое» badge.
- Instrument data cards — NOT CLAIMED — tables 4 in DOM but sparkline/price content did not render logged-out (honesty flag).

## 4. favorites — /invest/favorites/ (2743px; census 3 btn, 170 lnk, 12 inputs, 1 skeleton)
- **Empty-state card** — NEW-COMPONENT — centered ~706×328: gray circular disc w/ clock icon, heading «Здесь пока пусто», supporting line, blue TEXT-LINK CTA «Добавить бумаги» (link, not button).
- Filter chips — VARIANT (yellow-outline selected + ×).
- Search/filter inputs — COVERED (12; combobox anatomy).
- Skeleton census 1 — noted (lazy content; matches other invest sightings).
- Footer/legal tail — COVERED (trivial; lnk 170 mostly sitemap footer — page is chrome + empty state + footer, btn 3).

## 5. portfolio-intro = /invest/ hub (7840px; census 14 btn, 399 lnk, h2 9/h3 21, iframes 2, videos 1, tabs 2/tablists 1)
- Championship hero — VARIANT — eyebrow-less big-stat hero: H1 + yellow pill CTA + 3D render.
- **Icon-tile quick-nav dock** — NEW-COMPONENT — white radius-24 card overlapping hero bottom edge; 8 icon+label tiles ~100px pitch + hairline separator + «Войти» tile.
- Dark inverted promo cards — VARIANT — near-black, ghost buttons, floating «0%»/«5₽»/«PREMIUM» badges.
- Phone lead-capture card — NEW-PATTERN — H2 «Введите номер телефона» + phone input + inline yellow «Дальше» + legal caption w/ inline links (iframes 2 = embedded forms).
- Horizontal stepper — VARIANT — step-CARDS with overlapping circular numeral badges (заявка → код → пополнение); tk-stepper has no horizontal card mode.
- сайт/приложение/терминал tabs — COVERED — tk-tabs underline.
- Video block — NEW-COMPONENT (census videos 1; low priority).
- Mega-footer + dark legal bar — VARIANT — 6-col sitemap COVERED; dark legal bar w/ 6 pill links + dual phone block + license/rating text = dark-legal mode.

## 6. education — /invest/education/ (1792px; census 4 btn, 34 lnk, carousel 95)
- Page anatomy — shortest of the 7, rail-dominated; carousel 95 = highest rail density in scope; only 4 buttons — interaction is link-cards.
- Course cards in rails — VARIANT — tk-article-card course mode: badge overlaid ON cover, title, «N уроков» meta.
- Featured hero course «Курс №1» — VARIANT — tk-promo-card featured-hero mode.
- Author/expert strip — NEW-COMPONENT (same as strategies).

## 7. education-courses — /invest/education/courses/ (5095px; census 192 lnk, h2 23/h3 23)
- Course grid — VARIANT — same course mode; hygiene: title clamping inconsistent + badges conditional across siblings.
- Back link — VARIANT — «‹ Академия» top-left; tk-link chevron-back micro-gap.
- Census reconciliation — h2 23 = footer column headers, NOT content headers; lnk 192 mostly footer + cards.

## Top new-element candidates (ranked)
1. **tk-carousel — horizontal rail primitive — M** — recommendations (6+ rails, carousel 46) + education (95). Scroll-snap rail + edge chevrons + a11y chrome. Most-repeated surface in the whole capture set; kit has nothing like it.
2. tk-empty-state — S — favorites card. Every data surface needs one.
3. Load-more «Показать еще» — S — strategies + ideas; kit only has tk-pagination.
4. Asset mini-card + logo-token row — S/M — two modes (labeled ~150×110 / logo-only).
5. Movers/mini-list card — S/M — «Взлеты дня» 2×2.
6. Strategy card — M — risk pill + forecast + author strip composition.
7. Author/expert strip — S — recurs ×3 pages.
8. Icon-tile quick-nav dock — M — hub.
9. Phone lead-capture card — S/M — hub (same family as forms report's lead-form recipe).

## VARIANT backlog (all S unless noted)
- tk-filter-chips: yellow-outline selected + removable «×» + «Ещё ⌄» overflow → tk-menu-popover.
- tk-segmented-radio: overflow «Ещё» item.
- tk-select: pill with uppercase value.
- tk-data-table: sortable uppercase headers, stacked metric cell, subtitle cell, monochrome signed-value convention.
- tk-article-card: badge-on-cover + «N уроков» = course mode.
- tk-promo-card: corner-logo + scrim content + date pill; overlap-art mode; featured hero mode.
- tk-stepper: horizontal step-cards w/ overlapping numeral badges.
- tk-footer: dark legal bar mode w/ pill-link row + dual phone block.
- tk-link: back/chevron variant.

## Cross-cutting hygiene
- Decimal separator drift on sibling cards («17.25%» vs «16,75%») — live site inconsistent; kit should pin one convention.
- Course grids: conditional badges + uneven clamping across siblings.
- Site carousels ship without a11y chrome — differentiator opportunity.
- Cookie-consent everywhere — COVERED (tk-cookie-banner).
