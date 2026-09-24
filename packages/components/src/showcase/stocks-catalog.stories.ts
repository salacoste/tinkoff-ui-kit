import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render } from 'lit';

import '../navbar/navbar.js';
import type { TkNavbarLink } from '../navbar/navbar.js';
import '../combobox-search/combobox-search.js';
import type { TkComboboxSearchOption } from '../combobox-search/combobox-search.js';
import '../filter-chips/filter-chips.js';
import type { TkFilterChipsItem } from '../filter-chips/filter-chips.js';
import '../data-table/data-table.js';
import type { TkDataTableColumn, TkDataTableRow } from '../data-table/data-table.js';
import '../pagination/pagination.js';

/**
 * The composed stocks catalog (spec 6.5) — FR-12's composition consequence:
 * the five v2 catalog surfaces (two-deep tk-navbar, tk-combobox-search,
 * tk-filter-chips, tk-data-table, tk-pagination) assembled as ONE page over a
 * real-ticker RU dataset, with LIVE wiring end to end. This is a SHOWCASE
 * story in the `src/showcase/` mold (compositions must not read as kit
 * components; the directory keeps that boundary visible in the tree) — the
 * application-form mold VERBATIM: one render function keyed to a closure
 * state object, re-invoked via Lit `render(template, host)` from each
 * `-change` handler, so uncontrolled element instances (and focus) survive
 * every re-render and only the derived bindings move.
 *
 * STANDARD (the spec's ruling): this record is about ASSEMBLY — reading
 * order, cluster, wiring — not per-pixel matching. Per-component fidelity
 * deltas live in each component's verify NOTES
 * (.playwright-cli/verify/{mega-nav,combobox-search,filter-chips,data-table,
 * pagination}/NOTES.md); the assembly-level side-by-side against
 * captures-v2/invest-stocks/full.png (top region) lives in
 * .playwright-cli/verify/stocks-catalog/. The composition adds NO canvas
 * chrome the reference does not show (title, subtitle, the two control rows,
 * the table, the pager) — «Как собрано» below is story documentation, not a
 * reference section.
 *
 * WIRING MAP (the spec demands the mapping be documented here):
 * - SEARCH — `value-change` carries a COMMITTED option's ticker; the story
 *   resolves it to the instrument's NAME and keeps that string as the filter
 *   needle: rows match when name OR ticker contains the needle
 *   (case-insensitive — the combobox's own filter idiom, mirrored on the
 *   table). A commit therefore isolates the instrument AND its name-siblings
 *   («СБ» → Enter commits «Сбербанк» → Сбербанк + Сбербанк-ап both stay —
 *   the plural-match substring semantics the matrix's row 2 names). Typing
 *   never filters the table (the 6.3 freeze: typing emits nothing); the
 *   panel's own live list is the component's, not the page's. The needle can
 *   only change by committing a DIFFERENT instrument — the v2 combobox has
 *   no clear channel (observed, not a gap: the reference's own field holds
 *   its commit the same way, and chips/pagination stay operable under any
 *   needle — never a dead end).
 * - CHIPS — the tablist is SINGLE-SELECT by construction (one value always
 *   active, re-selecting is a no-op; the 6.2 contract rules, not an invented
 *   multi-select): `value-change` carries the new section, the table filters
 *   rows by the `section` facet field (the dataset mapping). The spec's
 *   «OR within chips» collapses to the single active facet by the element's
 *   own model; «AND across control kinds» is section ∧ search-needle. The
 *   reference's 10 sections ride verbatim (7 visible + 3 in the «Ещё»
 *   menu); «Что купить», «Стратегии», «Опционы» and «Избранное» carry no
 *   rows in the demo dataset — selecting one honestly shows the table's
 *   zero-state with every control still operable (the matrix's row 6).
 * - PAGINATION — `page-change` moves the page; the window slices the
 *   FILTERED set (never the raw dataset); count = ceil(filtered / window).
 *   The page binding is CONTROLLED (the §4 discipline for externally
 *   invalidated state: a filter that shrinks the set clamps the channel in
 *   the same update, and the element's focus discipline lands on the
 *   newly-active number after every change).
 * - LOAD MORE — the «Показать еще» bar (the reference shows it) grows the
 *   window by one page size: page does NOT change, count shrinks as the
 *   window swallows pages, and at a single page the numbered row hides
 *   itself (the component's own count=1 rule). Focus stays on the bar.
 * - AND composition — every predicate above composes: search ∧ section.
 *   Combined zero → the table's zero-state («Нет данных»), controls live.
 *
 * RECORDED WALKTHROUGH: the deliverable's Tab/arrow journey (focused element
 * + announcement expectation per step) lives in
 * .playwright-cli/verify/stocks-catalog/walkthrough.md, recorded live via
 * playwright-cli on THIS story page (the live reference is never driven).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. RU content, EN meta.
 */

/**
 * Catalog sections — the chips facet. Values mirror the reference chip row
 * verbatim (the 6.2 story's own CATALOG set); each dataset row carries one.
 */
type CatalogSection =
  | 'what-to-buy'
  | 'stocks'
  | 'currency'
  | 'funds'
  | 'bonds'
  | 'futures'
  | 'options'
  | 'strategies'
  | 'indexes'
  | 'favorites';

/** One dataset row — real RU instruments at the reference's own anatomy. */
interface CatalogInstrument {
  /** MOEX ticker — the search option value and the name cell's second line. */
  ticker: string;
  /** Display name — the search option label and the filter needle source. */
  name: string;
  /** THE chips facet (documented in the wiring map above). */
  section: CatalogSection;
  /** Price primary line (pre-formatted RU strings — display data, not math). */
  price: string;
  /** Price secondary line (lot / share-class / coupon metadata). */
  lot: string;
  /** Day-change primary/secondary lines; sign lives in the data strings. */
  deltaRub: string;
  deltaPct: string;
  /** Direction semantic painted on both change lines (6.4 anatomy). */
  delta?: 'positive' | 'negative';
}

/**
 * The demo dataset — 24 real-ticker RU instruments across six sections
 * (13 акции, 3 фонда, 3 валюты, 2 облигации, 2 фьючерса, 1 индекс), the
 * 6.4 story's own rows plus the non-equity sections the reference's chip
 * row promises. At the default window (10) the «Акции» section windows
 * into 2 pages — the pagination matrix rows have real slices to show.
 */
const INSTRUMENTS: CatalogInstrument[] = [
  { ticker: 'SBER', name: 'Сбербанк', section: 'stocks', price: '318,44 ₽', lot: '1 лот = 10 акций', deltaRub: '+12,55 ₽', deltaPct: '+1,46 %', delta: 'positive' },
  { ticker: 'SBERP', name: 'Сбербанк-ап', section: 'stocks', price: '321,30 ₽', lot: '1 лот = 10 акций · привилегированные', deltaRub: '+8,10 ₽', deltaPct: '+0,73 %', delta: 'positive' },
  { ticker: 'TCSG', name: 'Т-Технологии', section: 'stocks', price: '3 285,00 ₽', lot: '1 лот = 1 акция', deltaRub: '−48,50 ₽', deltaPct: '−0,9 %', delta: 'negative' },
  { ticker: 'GAZP', name: 'Газпром', section: 'stocks', price: '128,36 ₽', lot: '1 лот = 10 акций', deltaRub: '+0,66 ₽', deltaPct: '+0,51 %', delta: 'positive' },
  { ticker: 'LKOH', name: 'Лукойл', section: 'stocks', price: '684,50 ₽', lot: '1 лот = 1 акция', deltaRub: '−1,2 ₽', deltaPct: '−0,18 %' },
  { ticker: 'GMKN', name: 'Норникель', section: 'stocks', price: '121,80 ₽', lot: '1 лот = 10 акций', deltaRub: '−0,9 ₽', deltaPct: '−0,63 %', delta: 'negative' },
  { ticker: 'MTSS', name: 'МТС', section: 'stocks', price: '214,60 ₽', lot: '1 лот = 10 акций', deltaRub: '+2,1 ₽', deltaPct: '+0,8 %', delta: 'positive' },
  { ticker: 'MGNT', name: 'Магнит', section: 'stocks', price: '4 120,00 ₽', lot: '1 лот = 1 акция', deltaRub: '−25,0 ₽', deltaPct: '−1,1 %', delta: 'negative' },
  { ticker: 'PLZL', name: 'Полюс', section: 'stocks', price: '1 812,00 ₽', lot: '1 лот = 1 акция', deltaRub: '+14,4 ₽', deltaPct: '+0,42 %', delta: 'positive' },
  { ticker: 'VTBR', name: 'ВТБ', section: 'stocks', price: '0,0581 ₽', lot: '1 лот = 10 000 акций', deltaRub: '+0,0002 ₽', deltaPct: '+0,35 %', delta: 'positive' },
  { ticker: 'AFLT', name: 'Аэрофлот', section: 'stocks', price: '60,85 ₽', lot: '1 лот = 100 акций', deltaRub: '+0,35 ₽', deltaPct: '+0,58 %', delta: 'positive' },
  { ticker: 'TATN', name: 'Татнефть', section: 'stocks', price: '678,40 ₽', lot: '1 лот = 1 акция', deltaRub: '0,00 ₽', deltaPct: '0,00 %' },
  { ticker: 'ALRS', name: 'АЛРОСА', section: 'stocks', price: '55,10 ₽', lot: '1 лот = 10 акций', deltaRub: '−0,15 ₽', deltaPct: '−0,27 %', delta: 'negative' },
  { ticker: 'TMON', name: 'Т-Инвестиции ТМосбиржа', section: 'funds', price: '7,15 ₽', lot: 'БПИФ · комиссия 0,79 %', deltaRub: '+0,04 ₽', deltaPct: '+0,56 %', delta: 'positive' },
  { ticker: 'FXGD', name: 'FinEx Золото', section: 'funds', price: '9,40 ₽', lot: 'БПИФ · комиссия 0,84 %', deltaRub: '+0,11 ₽', deltaPct: '+1,18 %', delta: 'positive' },
  { ticker: 'SBMX', name: 'Сбер MOEX Total Return', section: 'funds', price: '20,65 ₽', lot: 'БПИФ · комиссия 0,95 %', deltaRub: '−0,03 ₽', deltaPct: '−0,15 %' },
  { ticker: 'USDRUB', name: 'Доллар США', section: 'currency', price: '79,85 ₽', lot: '1 лот = 1000 $', deltaRub: '+0,42 ₽', deltaPct: '+0,53 %', delta: 'positive' },
  { ticker: 'EURRUB', name: 'Евро', section: 'currency', price: '86,40 ₽', lot: '1 лот = 1000 €', deltaRub: '−0,15 ₽', deltaPct: '−0,17 %', delta: 'negative' },
  { ticker: 'CNYRUB', name: 'Юань', section: 'currency', price: '11,04 ₽', lot: '1 лот = 1000 ¥', deltaRub: '+0,02 ₽', deltaPct: '+0,18 %', delta: 'positive' },
  { ticker: 'SU26238RMFS4', name: 'ОФЗ 26238', section: 'bonds', price: '542,10 ₽', lot: 'купон 7,10 %', deltaRub: '+3,50 ₽', deltaPct: '+0,65 %', delta: 'positive' },
  { ticker: 'TBANK001P04', name: 'Т-Банк-001Р-04', section: 'bonds', price: '1 003,40 ₽', lot: 'купон 12,00 %', deltaRub: '+1,10 ₽', deltaPct: '+0,11 %', delta: 'positive' },
  { ticker: 'SiZ6', name: 'Фьючерс Si-12.26', section: 'futures', price: '81 200 ₽', lot: '1 контракт = 1000 $', deltaRub: '+260 ₽', deltaPct: '+0,32 %', delta: 'positive' },
  { ticker: 'GLDRUBZ6', name: 'Фьючерс GLDRUB-12.26', section: 'futures', price: '7 415 ₽', lot: '1 контракт = 1 г', deltaRub: '+25 ₽', deltaPct: '+0,34 %', delta: 'positive' },
  { ticker: 'IMOEX', name: 'Индекс МосБиржи', section: 'indexes', price: '3 145,22', lot: 'пункты', deltaRub: '+18,44', deltaPct: '+0,59 %', delta: 'positive' },
];

/** The search panel's option list — every instrument, ticker-valued. */
const SEARCH_OPTIONS: TkComboboxSearchOption[] = INSTRUMENTS.map(
  ({ ticker, name }) => ({ value: ticker, label: name }),
);

/** The reference's own chip set (invest/stocks catalog — 10 incl. overflow). */
const CATALOG_CHIPS: TkFilterChipsItem[] = [
  { value: 'what-to-buy', label: 'Что купить' },
  { value: 'stocks', label: 'Акции' },
  { value: 'currency', label: 'Валюта' },
  { value: 'funds', label: 'Фонды' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'futures', label: 'Фьючерсы' },
  { value: 'options', label: 'Опционы' },
  { value: 'strategies', label: 'Стратегии' },
  { value: 'indexes', label: 'Индексы' },
  { value: 'favorites', label: 'Избранное' },
];

/** The mega-nav row 1 (invest domain — the 7.1 story's own set, verbatim). */
const MEGA_LINKS: TkNavbarLink[] = [
  { value: 'bank', label: 'Банк', href: '#bank' },
  { value: 'business', label: 'Бизнесу', href: '#business' },
  { value: 'invest', label: 'Инвестиции', href: '#invest' },
  { value: 'mobile', label: 'Мобильная связь', href: '#mobile' },
  { value: 'insurance', label: 'Страхование', href: '#insurance' },
  { value: 'travel', label: 'Путешествия', href: '#travel' },
];

/** The mega-nav row 2 (the invest sub-nav; «Каталог» active per capture). */
const SUB_LINKS: TkNavbarLink[] = [
  { value: 'overview', label: 'Обзор', href: '#overview' },
  { value: 'catalog', label: 'Каталог', href: '#catalog' },
  { value: 'pulse', label: 'Пульс', href: '#pulse' },
  { value: 'analytics', label: 'Аналитика', href: '#analytics' },
  { value: 'academy', label: 'Академия', href: '#academy' },
  { value: 'terminal', label: 'Терминал', href: '#terminal' },
];

/** The capture's own catalog anatomy (Название/Цена/Изменение за день, %). */
const STOCK_COLUMNS: TkDataTableColumn[] = [
  { key: 'name', header: 'Название', width: '1fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'change', header: 'Изменение за день, %', align: 'end' },
];

/**
 * Rows per window — the pagination page size. A JS data constant (the token
 * layer cannot feed JS arithmetic); 10 keeps the 24-row dataset on 2–3
 * windows per section.
 */
const PAGE_SIZE = 10;

/** The demo's whole state (the mold: a tiny state object, no framework). */
interface CatalogState {
  /** The committed search needle ('' = no search predicate). */
  search: string;
  /** The active catalog section (the chips' single-select value). */
  section: string;
  /** Rows per window — grows by PAGE_SIZE on each «Показать еще». */
  window: number;
  /** The requested page; the CONTROLLED binding always receives the clamp. */
  page: number;
}

/**
 * Initial state mirrors the capture: «Акции» active (the 6.2 side-by-side's
 * own pinned chip), no search, first window, first page.
 */
const INITIAL_STATE: CatalogState = {
  search: '',
  section: 'stocks',
  window: PAGE_SIZE,
  page: 1,
};

/** The search predicate: name OR ticker contains the needle (trimmed). */
const matchesSearch = (instrument: CatalogInstrument, needle: string): boolean => {
  const query = needle.trim().toLowerCase();
  if (query === '') return true;
  return (
    instrument.name.toLowerCase().includes(query) ||
    instrument.ticker.toLowerCase().includes(query)
  );
};

/** The composed predicate — section ∧ search (AND across control kinds). */
const filteredInstruments = (state: CatalogState): CatalogInstrument[] =>
  INSTRUMENTS.filter(
    (instrument) => instrument.section === state.section && matchesSearch(instrument, state.search),
  );

/** Page count of the FILTERED set (never fewer than 1 — the element's rule). */
const pageCount = (state: CatalogState): number =>
  Math.max(1, Math.ceil(filteredInstruments(state).length / state.window));

/** Filter shrink clamps the page (the matrix's row 5 error handling). */
const clampedPage = (state: CatalogState): number => Math.min(state.page, pageCount(state));

/** The windowed slice, mapped to the table's row shape. */
const pageRows = (state: CatalogState): TkDataTableRow[] => {
  const page = clampedPage(state);
  return filteredInstruments(state)
    .slice((page - 1) * state.window, page * state.window)
    .map(({ ticker, name, price, lot, deltaRub, deltaPct, delta }) => ({
      href: `/invest/stocks/${ticker}/`,
      cells: {
        name: { primary: name, secondary: ticker },
        price: { primary: price, secondary: lot },
        change: { primary: deltaRub, secondary: deltaPct, delta },
      },
    }));
};

const meta: Meta = {
  title: 'Showcase/Stocks catalog',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const StocksCatalog: Story = {
  name: 'Каталог инструментов (composed)',
  render: () => {
    const state: CatalogState = { ...INITIAL_STATE };
    // The re-render host: `draw` re-invokes Lit render() into THIS node, so
    // every update diffs in place — the five element instances (and focus)
    // survive every filter/page change; only derived bindings move.
    const host = document.createElement('div');

    const update = (patch: Partial<CatalogState>): void => {
      Object.assign(state, patch);
      draw();
    };

    /**
     * Search commit (see the wiring map): resolve the committed ticker to
     * its NAME and hold that string as the needle; any filter change resets
     * to page 1 (a real catalog never strands you on a vanished page).
     */
    const handleSearchChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: string }>).detail;
      const label = SEARCH_OPTIONS.find((option) => option.value === value)?.label;
      update({ search: label ?? value, page: 1 });
    };

    /** Chip selection — the section facet (single-select by construction). */
    const handleSectionChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: string }>).detail;
      update({ section: value, page: 1 });
    };

    /** Page move — the consumer answer to the controlled page channel. */
    const handlePageChange = (event: Event): void => {
      const { value } = (event as CustomEvent<{ value: number }>).detail;
      update({ page: value });
    };

    /** «Показать еще» — grow the window by one page; the page never moves. */
    const handleLoadMore = (): void => {
      update({ window: state.window + PAGE_SIZE });
    };

    const view = () => html`
      <div class="tks-page">
        <tk-navbar
          class="tks-navbar"
          ?sticky=${true}
          burger-label="Меню"
          .links=${MEGA_LINKS}
          .activeValue=${'invest'}
          .subLinks=${SUB_LINKS}
          .subActiveValue=${'catalog'}
          sub-label="Разделы инвестиций"
        >
          <span slot="logo" class="tks-logo" aria-hidden="true">
            <span class="tks-logo__shield">Т</span>
          </span>
          <a slot="utilities" class="tks-utility" href="#search" aria-label="Поиск">
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            >
              <circle cx="10.5" cy="10.5" r="6.5"></circle>
              <path d="M15.5 15.5L21 21"></path>
            </svg>
          </a>
          <a slot="utilities" class="tks-utility tks-utility--login" href="#login">Войти</a>
        </tk-navbar>
        <main class="tks-canvas">
          <header class="tks-heading">
            <h1>Каталог</h1>
            <p class="tks-subtitle">Все инструменты брокера Т-Банка в одном месте</p>
          </header>
          <div class="tks-controls">
            <tk-combobox-search
              class="tks-search"
              label="Поиск инструментов"
              placeholder="Название или тикер"
              .options=${SEARCH_OPTIONS}
              @value-change=${handleSearchChange}
            ></tk-combobox-search>
            <tk-filter-chips
              class="tks-chips"
              label="Раздел каталога"
              .items=${CATALOG_CHIPS}
              .visibleCount=${7}
              default-value="stocks"
              @value-change=${handleSectionChange}
            ></tk-filter-chips>
          </div>
          <tk-data-table
            class="tks-table"
            caption="Каталог инструментов"
            .columns=${STOCK_COLUMNS}
            .rows=${pageRows(state)}
          ></tk-data-table>
          <tk-pagination
            class="tks-pagination"
            label="Страницы каталога"
            .count=${pageCount(state)}
            .page=${clampedPage(state)}
            show-more
            @page-change=${handlePageChange}
            @load-more=${handleLoadMore}
          ></tk-pagination>
          <section class="tks-notes">
            <h2>Как собрано</h2>
            <p>
              Пять поверхностей v2 в порядке чтения эталона: двухрядная
              навигация (tk-navbar c <code>subLinks</code> — разделы
              инвестиций), кластер управления (tk-combobox-search +
              tk-filter-chips), таблица-каталог (tk-data-table), пагинация с
              «Показать еще» (tk-pagination). Связь — живая, без единого
              нового компонента: каждый <code>-change</code> обновляет
              маленький объект состояния, и одна функция рендера перевызывается
              через Lit <code>render(шаблон, хост)</code> — Lit диффает на
              месте, поэтому экземпляры элементов и фокус переживают каждый
              ререндер; двигаются только производные привязки (строки таблицы,
              count/page пагинации).
            </p>
            <table>
              <thead>
                <tr><th>Управление</th><th>Семантика фильтра</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Поиск (коммит)</td>
                  <td>
                    Коммит несёт тикер → история берёт его НАЗВАНИЕ как иглу:
                    строка проходит, если название или тикер содержат иглу
                    (подстрока, без учёта регистра). «СБ» → Enter → «Сбербанк»:
                    останутся Сбербанк и Сбербанк-ап.
                  </td>
                </tr>
                <tr>
                  <td>Чипы раздела</td>
                  <td>
                    Одновыбор по построению (tablist): активный раздел =
                    гранка <code>section</code> в данных. «Что купить»,
                    «Стратегии», «Опционы» и «Избранное» пусты в демо-датасете
                    — честное нулевое состояние, контролы остаются рабочими.
                  </td>
                </tr>
                <tr>
                  <td>Пагинация</td>
                  <td>
                    Окно нарезает ОТФИЛЬТРОВАННЫЙ набор; count =
                    ⌈отфильтровано / окно⌉; сжатие фильтра клампит страницу.
                    Страница — контролируемый канал (§4).
                  </td>
                </tr>
                <tr>
                  <td>«Показать еще»</td>
                  <td>
                    Расширяет окно на 10 строк, страница не меняется, фокус
                    остаётся на плашке; когда остаётся одна страница — ряд
                    номеров скрывается сам (правило count=1).
                  </td>
                </tr>
                <tr>
                  <td>Композиция</td>
                  <td>
                    Поиск ∧ раздел (И между типами управлений). Ноль строк —
                    нулевое состояние таблицы «Нет данных», чипы и пагинация
                    живы.
                  </td>
                </tr>
              </tbody>
            </table>
            <h2>Чек-лист: только с клавиатуры (кластер)</h2>
            <p>
              Полный записанный маршрут (каждый стоп: фокус + ожидаемое
              объявление) — <code>.playwright-cli/verify/stocks-catalog/walkthrough.md</code>.
              Кратко: Tab идёт по порядку чтения — ссылки ряда 1 → утилиты →
              ссылки ряда 2 → поле поиска (панель подсказок: стрелки двигают
              активную строку через aria-activedescendant, Enter — коммит,
              фокус остаётся в поле) → чипы (каждый чип — таб-стоп; ←/→
              двигают фокус, Space/Enter выбирают, фокус не падает) →
              «Ещё» (ArrowDown открывает меню, Esc закрывает, фокус возвращается)
              → таблица (один таб-стоп, ↑/↓ по строкам без обхода, Home/End —
              края, Enter — нативный переход) → пагинация («Показать еще»,
              стрелки, номера; после смены страницы фокус встаёт на новый
              активный номер).
            </p>
          </section>
        </main>
      </div>
    `;

    const draw = (): void => {
      render(view(), host);
    };
    draw();

    return html`${canvasStyles}${host}`;
  },
};

const canvasStyles = html`
  <style>
    .tks-page {
      box-sizing: border-box;
      min-height: 100vh;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tks-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      width: 824px;
      max-width: 100%;
      margin-inline: auto;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-48);
    }
    .tks-canvas h1 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
    }
    .tks-heading .tks-subtitle {
      margin: var(--tk-space-8) 0 0;
      color: var(--tk-color-text-secondary);
    }
    .tks-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    /* The catalog controls cluster (the reference's top region): the
       borderless search register on its own line, the chip row below. */
    .tks-controls {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tks-controls .tks-search {
      flex: 1 1 auto;
    }
    .tks-notes {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      padding-top: var(--tk-space-24);
      border-top: 1px solid var(--tk-color-border-default);
    }
    .tks-notes p {
      margin: 0;
      color: var(--tk-color-text-secondary);
    }
    .tks-notes td,
    .tks-notes th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tks-notes code {
      font-family: var(--tk-font-body);
    }
    /* The story-composed brand mark (logo slot content — the navbar story's
       own composition, tks-prefixed for this canvas). */
    .tks-logo {
      display: inline-flex;
    }
    .tks-logo__shield {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--tk-radius-sm);
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-ink-400);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-1-weight);
      line-height: 1;
    }
    /* The story-composed utility cluster (utilities slot): ≥44×44 targets
       with the unified focus ring (the navbar story's 5.1 sweep fix). */
    .tks-utility {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--tk-space-8);
      min-height: 44px;
      min-width: 44px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .tks-utility:hover {
      color: var(--tk-color-text-secondary);
    }
    .tks-utility:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
  </style>
`;
