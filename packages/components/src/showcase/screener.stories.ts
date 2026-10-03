import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../data-table/data-table.js';
import '../input/input.js';
import '../segmented-radio/segmented-radio.js';
import '../select/select.js';
import type { TkDataTableRow, TkDataTableColumn } from '../data-table/data-table.js';
import type { TkInput } from '../input/input.js';
import type { TkSegmentedRadio, TkSegmentedRadioOption } from '../segmented-radio/segmented-radio.js';
import type { TkSelect } from '../select/select.js';
import type { TkSelectOption } from '../select/select.js';
import type { TkDataTable } from '../data-table/data-table.js';

/**
 * The options screener (spec 24.2, pattern wave 24a): the parametric filter
 * panel + option-chain result table — a COMPOSITION of existing atoms (the
 * gap-5 grounding: 12 inputs on the live catalog page, and NOT ONE inside a
 * `<form>` — the kit does it right). Zero new components, zero token edits.
 *
 * REAL FORM (AC2): the panel is a native `<form>` — label+input pairs
 * (tk-input/tk-select always render their labels), the call/put toggle is a
 * radiogroup (tk-segmented-radio `label` is the group's accessible name),
 * and the submit/reset pair rides the form contract: Enter in any field
 * submits (the form's own submit event → the demo's apply), «Применить»
 * calls requestSubmit() through the same path, «Сбросить» clears fields and
 * refilters. The web-component caveat is pinned in the prose: a custom
 * element's shadow `<button>` is NOT form-associated, so the story wires
 * submission through the form element itself, not native button type=submit.
 *
 * STATE (the 23.3 mold): the filter state is the DEMO CONSUMER's closure —
 * the kit holds no filter state; «Применить» reads the fields and rewrites
 * the table's `rows` prop through the DOM id channel (Storybook renders
 * web-component stories once; ids are the update channel).
 *
 * RESULT (AC1): tk-data-table with INERT rows (no href — chain data is not
 * navigation; the atom renders inert rows without hover/focus by contract).
 * The count output is aria-live — the result of a filter run is announced.
 *
 * HEADINGS (AC3): one h1, two h2 sections (Фильтры / Результаты); the
 * keyboard checklist is pinned in the visible prose (the 23.3 AC mold);
 * axe in both themes.
 *
 * DATA (the PD gate): every contract, price, volume and yield is FICTIONAL
 * demo data; RU content, EN story meta.
 */

const NBSP = '\u00A0';

/** One fictional option contract (demo data — the PD gate). */
interface DemoOption {
  contract: string;
  expiry: string;
  kind: 'call' | 'put';
  strike: number;
  bid: string;
  ask: string;
  volume: number;
  yld: string;
}

const EXPIRIES: TkSelectOption[] = [
  { value: 'any', label: 'Любая экспирация' },
  { value: 'dec', label: 'Декабрь 2026' },
  { value: 'mar', label: 'Март 2027' },
  { value: 'jun', label: 'Июнь 2027' },
];

/** Select value → the expiry label prefix it filters by. */
const EXPIRY_PREFIX: Record<string, string> = {
  dec: 'Декабрь',
  mar: 'Март',
  jun: 'Июнь',
};

const KIND_OPTIONS: TkSegmentedRadioOption[] = [
  { value: 'all', label: 'Все' },
  { value: 'call', label: 'Call' },
  { value: 'put', label: 'Put' },
];

const DEMO_OPTIONS: DemoOption[] = [
  { contract: 'RDX 90 C', expiry: 'Декабрь 2026', kind: 'call', strike: 90, bid: '14,80', ask: '15,05', volume: 1240, yld: '11,2 %' },
  { contract: 'RDX 90 P', expiry: 'Декабрь 2026', kind: 'put', strike: 90, bid: '2,10', ask: '2,24', volume: 860, yld: '8,4 %' },
  { contract: 'RDX 95 C', expiry: 'Декабрь 2026', kind: 'call', strike: 95, bid: '10,90', ask: '11,15', volume: 1580, yld: '10,9 %' },
  { contract: 'RDX 95 P', expiry: 'Март 2027', kind: 'put', strike: 95, bid: '3,40', ask: '3,55', volume: 640, yld: '7,9 %' },
  { contract: 'RDX 100 C', expiry: 'Декабрь 2026', kind: 'call', strike: 100, bid: '7,60', ask: '7,78', volume: 2310, yld: '12,4 %' },
  { contract: 'RDX 100 P', expiry: 'Март 2027', kind: 'put', strike: 100, bid: '5,05', ask: '5,20', volume: 1120, yld: '9,1 %' },
  { contract: 'RDX 105 C', expiry: 'Март 2027', kind: 'call', strike: 105, bid: '4,85', ask: '4,99', volume: 1970, yld: '13,1 %' },
  { contract: 'RDX 105 P', expiry: 'Июнь 2027', kind: 'put', strike: 105, bid: '7,20', ask: '7,41', volume: 530, yld: '8,8 %' },
  { contract: 'RDX 110 C', expiry: 'Март 2027', kind: 'call', strike: 110, bid: '2,95', ask: '3,08', volume: 1480, yld: '14,0 %' },
  { contract: 'RDX 110 P', expiry: 'Июнь 2027', kind: 'put', strike: 110, bid: '9,60', ask: '9,84', volume: 470, yld: '8,1 %' },
  { contract: 'RDX 115 C', expiry: 'Июнь 2027', kind: 'call', strike: 115, bid: '1,72', ask: '1,84', volume: 990, yld: '15,2 %' },
  { contract: 'RDX 115 P', expiry: 'Июнь 2027', kind: 'put', strike: 115, bid: '12,30', ask: '12,58', volume: 380, yld: '7,6 %' },
  { contract: 'RDX 120 C', expiry: 'Июнь 2027', kind: 'call', strike: 120, bid: '0,95', ask: '1,04', volume: 720, yld: '16,0 %' },
  { contract: 'RDX 120 P', expiry: 'Июнь 2027', kind: 'put', strike: 120, bid: '15,40', ask: '15,72', volume: 290, yld: '7,2 %' },
];

const COLUMNS: TkDataTableColumn[] = [
  { key: 'contract', header: 'Контракт', width: '1.5fr' },
  { key: 'strike', header: 'Страйк', align: 'end' },
  { key: 'bid', header: 'Bid', align: 'end' },
  { key: 'ask', header: 'Ask', align: 'end' },
  { key: 'volume', header: 'Объём', align: 'end' },
  { key: 'yield', header: 'Доходность', align: 'end' },
];

/** Demo rows for the chain table (inert — chain data is not navigation). */
const toRows = (options: DemoOption[]): TkDataTableRow[] =>
  options.map((o) => ({
    cells: {
      contract: { primary: o.contract, secondary: o.expiry },
      strike: { primary: String(o.strike).replace(',', '.') },
      bid: { primary: `${o.bid}${NBSP}₽` },
      ask: { primary: `${o.ask}${NBSP}₽` },
      volume: { primary: String(o.volume) },
      yield: { primary: o.yld },
    },
  }));

const canvasStyles = html`
  <style>
    .scr-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .scr-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-32);
    }
    .scr-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .scr-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .scr-lead {
      margin: 0;
      font-size: var(--tk-text-body-l-size);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }
    .scr-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .scr-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .scr-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--tk-space-16);
      align-items: end;
      padding: var(--tk-space-24);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .scr-form__kind {
      grid-column: 1 / -1;
    }
    .scr-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: var(--tk-space-12);
      flex-wrap: wrap;
    }
    .scr-count {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Screener',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const OptionsScreener: Story = {
  name: 'Скринер опционов',
  render: () => {
    // One-shot demo consumer (the 23.3 mold): the closure is the state
    // holder, DOM ids are the update channel. The kit holds no filter state.
    const parseNum = (raw: string): number | null => {
      const parsed = Number.parseFloat(raw.trim().replace(',', '.'));
      return Number.isFinite(parsed) ? parsed : null;
    };

    const apply = () => {
      const ticker = (document.querySelector<TkInput>('#scr-ticker')?.value ?? '').trim().toUpperCase();
      const kind =
        document.querySelector<TkSegmentedRadio>('#scr-kind')?.value ?? 'all';
      const minStrike = parseNum(document.querySelector<TkInput>('#scr-strike-min')?.value ?? '');
      const maxStrike = parseNum(document.querySelector<TkInput>('#scr-strike-max')?.value ?? '');
      const expiry = document.querySelector<TkSelect>('#scr-expiry')?.value ?? 'any';
      const minVolume = parseNum(document.querySelector<TkInput>('#scr-volume')?.value ?? '');
      const minYield = parseNum(
        (document.querySelector<TkInput>('#scr-yield')?.value ?? '').replace('%', ''),
      );
      const filtered = DEMO_OPTIONS.filter((o) => {
        if (ticker && !o.contract.includes(ticker)) return false;
        if (kind !== 'all' && o.kind !== kind) return false;
        if (minStrike !== null && o.strike < minStrike) return false;
        if (maxStrike !== null && o.strike > maxStrike) return false;
        if (expiry !== 'any' && !o.expiry.startsWith(EXPIRY_PREFIX[expiry])) return false;
        if (minVolume !== null && o.volume < minVolume) return false;
        if (minYield !== null && Number.parseFloat(o.yld.replace('%', '').trim().replace(',', '.')) < minYield)
          return false;
        return true;
      });
      const table = document.querySelector<TkDataTable>('#scr-table');
      if (table) table.rows = toRows(filtered);
      const count = document.querySelector<HTMLOutputElement>('#scr-count-value');
      if (count) count.textContent = String(filtered.length);
    };

    const resetFields = () => {
      for (const id of ['scr-ticker', 'scr-strike-min', 'scr-strike-max', 'scr-volume', 'scr-yield']) {
        const field = document.querySelector<TkInput>(`#${id}`);
        if (field) field.value = '';
      }
      const kind = document.querySelector<TkSegmentedRadio>('#scr-kind');
      if (kind) kind.value = 'all';
      const expiry = document.querySelector<TkSelect>('#scr-expiry');
      if (expiry) expiry.value = 'any';
    };

    return html`
      ${canvasStyles}
      <main class="scr-canvas">
        <p class="scr-note">
          Скринер опционов (спека 24.2): параметрическая панель фильтров и
          цепочка контрактов — все атомы существующие, новых нет. РЕАЛЬНАЯ
          форма: панель — нативный form (на живой странице формы нет — кит
          делает правильно); Enter в любом поле отправляет форму и применяет
          фильтр, «Применить» идёт через requestSubmit() тем же путём,
          «Сбросить» очищает поля и возвращает полный список. Нюанс
          веб-компонентов: теневая кнопка кастомного элемента не ассоциирована
          с формой, поэтому сабмит заведён через сам form. Состояние фильтра —
          замыкание демо-консьюмера (кит не хранит состояние фильтров);
          таблица инертна: строки цепочки — данные, а не навигация.
          Клавиатура: Tab проходит поля в порядке формы; call/put — стрелки
          внутри radiogroup; сабмит — Enter в текстовом поле или кнопка
          «Применить»; счётчик результатов объявляется экранному читалку
          (aria-live). Обе темы — без правок состава. Все контракты, цены,
          объёмы и доходности вымышленные.
        </p>
        <div class="scr-layout">
          <h1 class="scr-title">Скринер опционов</h1>
          <p class="scr-lead">
            Демо-скринер вымышленной цепочки опционов на демо-индекс RDX:
            задайте параметры и примените фильтр.
          </p>

          <section class="scr-section" aria-labelledby="scr-filters-title">
            <h2 class="scr-section__title" id="scr-filters-title">Фильтры</h2>
            <form
              class="scr-form"
              id="scr-form"
              @submit=${(event: SubmitEvent) => {
                event.preventDefault();
                apply();
              }}
            >
              <tk-input
                id="scr-ticker"
                label="Тикер контракта"
                placeholder="Например, RDX 100"
                name="ticker"
              ></tk-input>
              <tk-segmented-radio
                id="scr-kind"
                class="scr-form__kind"
                name="kind"
                label="Тип контракта"
                .options=${KIND_OPTIONS}
                default-value="all"
              ></tk-segmented-radio>
              <tk-input
                id="scr-strike-min"
                label="Страйк от"
                placeholder="90"
                name="strike-min"
              ></tk-input>
              <tk-input
                id="scr-strike-max"
                label="Страйк до"
                placeholder="120"
                name="strike-max"
              ></tk-input>
              <tk-select
                id="scr-expiry"
                label="Экспирация"
                name="expiry"
                .options=${EXPIRIES}
                default-value="any"
              ></tk-select>
              <tk-input
                id="scr-volume"
                label="Объём от"
                placeholder="500"
                name="volume"
              ></tk-input>
              <tk-input
                id="scr-yield"
                label="Доходность от, %"
                placeholder="10"
                name="yield"
              ></tk-input>
              <div class="scr-actions">
                <tk-button
                  @click=${() =>
                    document.querySelector<HTMLFormElement>('#scr-form')?.requestSubmit()}
                >
                  Применить
                </tk-button>
                <tk-button
                  variant="secondary"
                  @click=${() => {
                    resetFields();
                    apply();
                  }}
                >
                  Сбросить
                </tk-button>
              </div>
            </form>
          </section>

          <section class="scr-section" aria-labelledby="scr-results-title">
            <h2 class="scr-section__title" id="scr-results-title">Результаты</h2>
            <p class="scr-count">
              Найдено контрактов:
              <output id="scr-count-value" aria-live="polite">${DEMO_OPTIONS.length}</output>
            </p>
            <tk-data-table
              id="scr-table"
              caption="Цепочка опционов демо-индекса RDX"
              .columns=${COLUMNS}
              .rows=${toRows(DEMO_OPTIONS)}
            ></tk-data-table>
          </section>
        </div>
      </main>
    `;
  },
};
