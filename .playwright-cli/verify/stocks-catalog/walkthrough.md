# Stocks catalog — recorded keyboard walkthrough (Story 6.5)

The deliverable walkthrough: a LIVE keyboard-only journey over the composed
story page (Tab from page start through mega-nav → search → chips → «Ещё»
overflow → table → pagination → «Показать еще»), every step probed for the
REAL focused element and its announcement-relevant semantics.

- **Tool:** playwright-cli (session `tinkoff-ui`), 1280×800, light theme
  unless a step says otherwise. The LIVE reference site was never driven —
  this record drives THE KIT's story page only:
  `iframe.html?id=showcase-stocks-catalog--stocks-catalog&viewMode=story`.
- **Probe:** `document.activeElement` walked through open shadow roots
  (host-level `activeElement` does not pierce them), reporting
  role/aria-*/data-* attributes, trimmed text, and `:focus-visible` (the
  ring) at every stop. Raw record: R0–R50 in the session log; the table
  below is the curated canonical sequence (every row was observed live —
  steps where a probe initially miscounted Tab stops were re-driven from a
  clean state; the behavior columns hold only verified observations).
- **Screenshots** (this directory): `wt-01…wt-08` linked below.

## Leg 0 — page start

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S1 | (start) | `body` | Fresh story state: «Акции» facet active, 10 of 13 rows in the window, page 1 of 2, numbers row visible. |

## Leg 1 — mega-nav (7.1 two-deep)

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S2 | Tab | row-1 link «Банк» | «Банк, ссылка» + ring. |
| S3–S6 | Tab ×3 | «Бизнесу», «Инвестиции», «Мобильная связь» | «Инвестиции, ссылка, текущая страница» (aria-current="page" — the only row-1 current). |
| S7 | Tab | «Страхование», then «Путешествия» | Plain links, ring at each. |
| S8 | Tab | utilities: search icon anchor (aria-label «Поиск»), «Войти» | «Поиск, ссылка» (named by label — the icon is decorative), «Войти, ссылка»; ≥44×44 targets, ring. |
| S9 | Tab ×6 | row-2: «Обзор», «Каталог», «Пульс», «Аналитика», «Академия», «Терминал» | «Каталог, ссылка, текущая страница» (subActiveValue) — row 2 reads as the invest section nav (labeled «Разделы инвестиций»). |

Tab order = reading order: row 1 → utilities → row 2 → content. 14 nav stops
before the first control (matches the mega-nav §D keyboard order, 7.1).

## Leg 2 — search (tk-combobox-search)

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S10 | Tab | search field `input[role=combobox]` | «Поиск инструментов, редактируемое комбо-поле» (aria-expanded=false). |
| S11 | type «СБ» | stays in field | Panel OPENS: aria-expanded=true, aria-activedescendant=«Сбербанк», live status «Найдено 5 инструментов» (dataset-wide substring: Сбербанк, Сбербанк-ап, Т-Инвестиции ТМосбиржа, Сбер MOEX Total Return, Индекс МосБиржи). **[wt-01-search-panel-open.png]** |
| S12 | ArrowDown | active option → «Сбербанк-ап» | «Сбербанк-ап» announced via activedescendant; field keeps focus. |
| S13 | ArrowUp | active option → «Сбербанк» | Back to the first match. |
| S14 | Enter | STAYS in field (ring) | COMMIT: field value «Сбербанк», panel closed (aria-expanded=false). The table re-filters LIVE to 2 rows (Сбербанк + Сбербанк-ап — the name-substring siblings) and the numbers row hides (count=1). Focus never leaves the field. **[wt-02-search-commit.png]** |

## Leg 3 — chips (tk-filter-chips, tablist)

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S15 | Tab | chip «Что купить» (role=tab, aria-selected=false) | «Что купить, вкладка, 1 из 8» (7 chips + «Ещё»). |
| S16 | ArrowRight | chip «Акции» (aria-selected=true) | Focus moves WITHOUT selecting (roving): «Акции, вкладка, выбрана». |
| S17 | ArrowRight | chip «Валюта» (aria-selected=false) | «Валюта, вкладка» — still nothing selected by the arrow itself. |
| S18 | Enter | chip «Валюта» (aria-selected=true) | SELECT: section=currency AND search-needle «Сбербанк» → 0 rows → the TABLE's zero-state «Нет данных» (never blank). Chip announces selected; every control stays operable. **[wt-03-zero-state.png]** |
| S19 | ArrowLeft | chip «Акции» (aria-selected=false) | Focus moves back — «Валюта» keeps selection until commit. |
| S20 | Enter | chip «Акции» (aria-selected=true) | Re-select «Акции»: the AND predicate releases → 2 rows return, zero-state gone. |
| S21 | Tab ×5 | «Валюта», «Фонды», «Облигации», «Фьючерсы», «Опционы» | Each chip is its OWN Tab stop (the tablist's manual-activation contract — arrows are the fast path, Tab is the long path), ring at each. |
| S22 | Tab | «Ещё» trigger (aria-haspopup=menu, aria-expanded=false) | «Ещё, кнопка меню». |
| S23 | ArrowDown | menu item «Стратегии» (role=menuitemradio, aria-checked=false, tabindex=-1) | Overflow menu OPENS (items past visibleCount=7: Стратегии, Индексы, Избранное); focus inside the menu, ring. **[wt-04-more-menu.png]** |
| S24 | Escape | «Ещё» trigger again (aria-expanded=false) | Menu closes, focus RETURNS to the trigger — never dropped to body. |

## Leg 4 — table (tk-data-table, roving; current filter = Сбербанк needle × Акции)

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S25 | Tab | row 1 anchor «Сбербанк» (a[data-index=0], tabindex=0) | The table's SINGLE Tab stop: «Каталог инструментов, таблица», then «Сбербанк, ссылка» — the next row is reachable only by arrow. |
| S26 | ArrowDown | row 2 «Сбербанк-ап» (data-index=1) | One announcement per row. |
| S27 | ArrowDown | STAYS on «Сбербанк-ап» | CLAMPED at the last row (no wrap — the grid convention). |
| S28 | Home | row 1 «Сбербанк» | First row. **[wt-05-table-roving.png]** |
| S29 | Enter | (navigates) | NATIVE anchor navigation — URL becomes `/invest/stocks/SBER/` (the story's own href; the kit never intercepts Enter). |

## Leg 5 — pagination (fresh state after reload: 13 rows, window 10, page 1/2)

| # | Input | Focus lands on | Expectation (announcement) |
|---|---|---|---|
| S30 | Tab ×24 | table row 1 «Сбербанк» | From page start the whole journey repeats to the table (verified count: 14 nav + 1 field + 8 chips + 1 table). |
| S31 | End | row 10 «ВТБ» (data-index=9, the window's last) | Last row of the WINDOW (page 1 = indices 0–9); scrolled into view. |
| S32 | Tab | «Показать еще» bar | «Показать еще, кнопка». |
| S33 | Tab | prev chevron (aria-label «Предыдущая страница», aria-disabled=true) | «Предыдущая страница, кнопка, недоступна» — disabled AT PAGE 1, still a stop (state perceivable). |
| S34 | Tab | page «1» (aria-current="page") | «Страница 1, текущая страница». |
| S35 | Tab | page «2» | «Страница 2». |
| S36 | Enter | page «2» NOW aria-current + FOCUSED | Page-change → the window slices to the 3 rows of page 2 (Аэрофлот, Татнефть, АЛРОСА) and focus lands ON THE NEWLY-ACTIVE number (the pager's discipline — never dropped). **[wt-06-page2.png]** |
| S37 | Tab | next chevron (aria-disabled=true) | Disabled at the LAST page. |
| S38 | Enter on an enabled chevron (verified from page 2: prev) | newly-active page «1» | Chevron activation mirrors S36: page moves, focus lands on the newly-active number. |
| S39 | Shift+Tab ×2 → «Показать еще», Enter | STAYS on the bar (ring) | Window 10 → 20 over 13 filtered rows: ALL 13 rows render, count collapses to 1 and the NUMBERS ROW HIDES ITSELF (count=1 rule), focus stays on the bar. **[wt-07-loadmore.png]** |

## Theme

- **wt-08-dark.png** — the same page under `globals=theme:dark`: zero story
  code branches, the token layer remap carries the whole page (navbar,
  chips, table deltas, pager).

## Verdict

Every step landed where the contract says: reading-order Tab sequence, ring
at every stop, single table stop with clamped roving, arrows-move-focus vs
Space/Enter-select in the tablist, menu Esc-return, pager focus discipline
after page/chevron/load-more changes, zero-state with live controls, and
native Enter on a row. No dead ends, no dropped focus, no order surprises.
