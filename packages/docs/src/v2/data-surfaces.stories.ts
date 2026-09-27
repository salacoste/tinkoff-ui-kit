import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/badge/badge.js';
import '../../../components/src/tabs/tabs.js';
import '../../../components/src/button/button.js';
import '../../../components/src/checkbox/checkbox.js';
import '../../../components/src/filter-chips/filter-chips.js';
import '../../../components/src/combobox-search/combobox-search.js';
import '../../../components/src/progress-bar/progress-bar.js';
import '../../../components/src/link/link.js';
import type { TkTab } from '../../../components/src/tabs/tabs.js';
import type { TkFilterChipsItem } from '../../../components/src/filter-chips/filter-chips.js';
import type { TkComboboxSearchOption } from '../../../components/src/combobox-search/combobox-search.js';

/**
 * v2 docs page — CONSOLE DATA SURFACES (spec 13.3): the authorized-zone
 * workhorse recipes from the admin pack (captures-v3/admin, 2026-09-27) —
 * toolbar, status table, page header, progress cards, favorites grid.
 * Composition-first: the cycle's only code hooks are badge neutral/attention
 * + --tk-badge-* and the progress-bar height hook (see Components/Badge
 * «Консольные тона» and Components/ProgressBar «Тонкие бары»); everything
 * here composes shipped atoms. Pack geometry is vision-estimated ±; the PNGs
 * are the truth. Content RU, meta EN; tokens only (FR-1).
 */

const PAYMENT_TABS: TkTab[] = [
  { value: 'all', label: 'Все', badge: 48 },
  { value: 'sign', label: 'На подпись', badge: 5 },
  { value: 'hold', label: 'Требуют внимания', badge: 2 },
  { value: 'done', label: 'Исполнены' },
];

const CHIP_ITEMS: TkFilterChipsItem[] = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
];

const CONTRAGENTS: TkComboboxSearchOption[] = [
  { value: 'alpha', label: 'ООО «Альфа-Сбыт»' },
  { value: 'beta', label: 'ООО «Бета-Логистик»' },
  { value: 'gamma', label: 'ИП Гамма' },
];

interface PaymentRow {
  payer: string;
  inn: string;
  date: string;
  amount: string;
  status: string;
}

const PAYMENT_ROWS: PaymentRow[] = [
  { payer: 'ООО «Альфа-Сбыт»', inn: 'Платёж № 1284 · сегодня, 09:12', date: '09:12', amount: '84 000 ₽', status: 'Ожидает подписи' },
  { payer: 'ООО «Бета-Логистик»', inn: 'Платёж № 1283 · сегодня, 08:40', date: '08:40', amount: '36 500 ₽', status: 'Ожидает подписи' },
  { payer: 'ИП Гамма', inn: 'Платёж № 1279 · вчера', date: 'вчера', amount: '12 000 ₽', status: 'Исполнен' },
  { payer: 'ООО «Дельта-Строй»', inn: 'Платёж № 1275 · вчера', date: 'вчера', amount: '245 000 ₽', status: 'Исполнен' },
];

const FAVORITES = [
  'Контрагентам',
  'Себе в Т-Банк',
  'Бюджетная организация',
  'Госорганам',
  'Между счетами',
  'По QR-коду',
  'По реквизитам',
  'Валютный платёж',
  'Заём другой компании',
  'Возврат долга',
];

const meta: Meta = {
  title: 'Components v2/Data surfaces',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

/** The data-surface styles — tokens only; pack-estimated geometry. */
const dataSurfaceStyles = html`
  <style>
    .tkd-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-12);
      padding: var(--tk-space-16) 0;
    }
    .tkd-toolbar .tkd-grow {
      flex: 1 1 240px;
      max-width: 360px;
    }
    .tkd-tabs {
      max-width: 720px;
      /* The pack's tab count digits are GRAY — the 13.3 badge hooks inherited
         onto the existing TkTab.badge chip (zero tabs code). */
      --tk-badge-fill: var(--tk-color-gray-100);
      --tk-badge-text: var(--tk-color-gray-600);
    }
    /* The status table is PRIMITIVE composition: tk-data-table is the invest
       register (string-only cells, row-as-link) and cannot host badge cells;
       the admin pattern composes a semantic table with tokens. */
    .tkd-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-primary);
    }
    .tkd-table th {
      text-align: start;
      font-weight: var(--tk-text-body-s-bold-weight);
      color: var(--tk-color-text-secondary);
      padding: var(--tk-space-12) var(--tk-space-12) var(--tk-space-12) 0;
      border-bottom: 1px solid var(--tk-color-border-table);
    }
    .tkd-table td {
      padding: var(--tk-space-12) var(--tk-space-12) var(--tk-space-12) 0;
      border-bottom: 1px solid var(--tk-color-border-table);
      vertical-align: middle;
    }
    .tkd-table tr:hover td {
      background: var(--tk-color-surface-row-hover);
    }
    .tkd-table .tkd-num {
      text-align: end;
      font-weight: var(--tk-text-body-s-bold-weight);
      white-space: nowrap;
    }
    .tkd-payer {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    /* Avatar circles are PLAIN slots (pack: circular photos) — no avatar
       component exists (open-state ungrounded, 13.1 verdict). */
    .tkd-avatar {
      flex: none;
      width: var(--tk-space-32);
      height: var(--tk-space-32);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-xs-size);
    }
    .tkd-sub {
      display: block;
      color: var(--tk-color-text-secondary);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
    }
    .tkd-summary {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      padding: var(--tk-space-12) 0;
      color: var(--tk-color-text-secondary);
    }
    /* Page header (admin-limits): H1 left, secondary tabs right, 1px divider. */
    .tkd-page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--tk-space-16);
      padding-block-end: var(--tk-space-16);
      border-block-end: 1px solid var(--tk-color-border-default);
    }
    .tkd-page-header h2 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkd-page-header tk-tabs {
      min-width: 0;
    }
    /* Cards: white r24 on the muted page canvas (pack); sub-cards muted. */
    .tkd-canvas {
      background: var(--tk-color-surface-muted);
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-xl);
    }
    .tkd-card {
      box-sizing: border-box;
      background: var(--tk-color-surface-base);
      border-radius: var(--tk-radius-xl);
      padding: var(--tk-space-24);
      margin-block-end: var(--tk-space-16);
    }
    .tkd-card h3 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
    }
    /* Favorites grid (admin-payments-hub): 5×2 tiles, muted fill, r16;
       the ghost tile carries the blue action, no border. */
    .tkd-favorites {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--tk-space-12);
    }
    .tkd-tile {
      box-sizing: border-box;
      min-height: 72px;
      padding: var(--tk-space-12);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-lg);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-primary);
      display: flex;
      align-items: flex-end;
    }
    .tkd-tile--ghost {
      background: transparent;
      color: var(--tk-color-link);
    }
  </style>
`;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Data surfaces — рабочие экраны консоли</h1>
      <p class="tkv2-note">
        Паттерны 13.3 по админ-паку <code>captures-v3/admin/</code>: тулбар,
        статус-таблица, шапка страницы, прогресс-карточки, сетка избранного.
        Composition-first: единственный код этой истории — варианты
        <code>badge neutral/attention</code> с хуками
        <code>--tk-badge-*</code> и хук высоты
        <code>--tk-progress-bar-height</code>; всё остальное — композиция
        существующих атомов. Геометрия — vision-оценка ±, PNG пака — истина.
      </p>

      <h2>Тулбар над таблицей</h2>
      <p>
        Пак <code>admin-main-fullpage</code> («Действия»): 6 серых кнопок
        r10 h36–40 с иконкой+подписью (одна белая с тенью — акцент), поиск,
        фильтр-чипы, тумблер «Запомнить». Рецепт кита:
        <code>tk-button secondary</code> (белый + волосяная линия + тень —
        ровно акцентная кнопка пака) — <strong>дельта:</strong> серой
        заливки в ките нет; <code>tk-combobox-search</code> как поиск;
        <code>tk-filter-chips</code> (контур выбора 2px и пол 44px уже
        совпадают с паком) — <strong>дельта:</strong> API только label,
        цифры счётчика в чипе нет; <code>tk-checkbox</code> как «Запомнить»
        — <strong>дельта:</strong> атома-тумблера в ките нет.
      </p>

      <h2>Статус-таблица</h2>
      <p>
        Пак <code>admin-table-toolbar</code>: табы с серыми счётчиками
        (слот <code>TkTab.badge</code> + хуки <code>--tk-badge-*</code> на
        предке), сегментный фильтр, строка сводки (чекбокс + счётчик +
        сумма), строки: круглый аватар + две строки текста + сумма справа +
        статус-пилюля <code>tk-badge neutral</code>.
        <strong>Дельта:</strong> <code>tk-data-table</code> — регистр
        invest (строковые ячейки, row-as-link) и не принимает бейдж в
        ячейку; админ-паттерн компонует семантическую таблицу из
        примитивов. Цветные статусы не заземлены паком — только neutral.
        Аватары — плоские слоты, компонента нет.
      </p>

      <h2>Шапка страницы</h2>
      <p>
        Пак <code>admin-limits-*</code>: H1 слева, вторичные табы справа,
        волосяной разделитель снизу — потребляет
        <code>tk-tabs indicator="underline"</code> из 13.2. Переполнение
        «…» остаётся отложенным (открытого состояния в паке нет).
      </p>

      <h2>Прогресс в карточках</h2>
      <p>
        Пак <code>admin-limits-*</code>: тонкие h6–10 полностью скруглённые
        бары; жёлтая заливка — единственная жёлтая ЗАЛИВКА консоли кроме
        логотипа; нейтрально-тёмная и синяя — через существующий хук
        <code>--tk-progress-bar-fill</code>. Высоты — хук 13.3
        (<code>--tk-progress-bar-height</code>). Суб-карточки пака —
        приглушённые: ближайший токен gray-100 (дельта оттенка записана в
        DESIGN.md).
      </p>

      <h2>Избранное и плитка-призрак</h2>
      <p>
        Пак <code>admin-payments-hub</code>: сетка 5×2 плиток r16 с
        «…» на каждой (поповер отложен — нет открытого состояния) и
        плитка-призрак: синяя иконка+ссылка без границы.
      </p>

      ${codeBlock(`<tk-badge variant="neutral">Ожидает подписи</tk-badge>
<tk-tabs class="console-tabs"
  --tk-badge-fill: var(--tk-color-gray-100)  /* на предке: серые счётчики */
  .tabs=\${[{ value: 'sign', label: 'На подпись', badge: 5 }, …]}>
<tk-progress-bar value="72"
  style="--tk-progress-bar-height: 6px; --tk-progress-bar-fill: var(--tk-color-yellow-100);">`)}
    </div>
  `,
};

/** The payments-list workhorse screen (spec showcase): header + toolbar + tabs + status table. */
export const PaymentsDemo: Story = {
  name: 'Платежи',
  render: () => html`
    ${v2PageStyles}
    ${dataSurfaceStyles}
    <div class="tkv2">
      <h1>Демо — список платежей</h1>
      <p class="tkv2-note">
        Экран-витрина спецификации: шапка + тулбар + табы с серыми
        счётчиками + статус-таблица. Все значения — демонстрационные.
      </p>

      <div class="tkd-page-header">
        <h2>Платежи</h2>
        <tk-tabs
          class="tkd-tabs"
          indicator="underline"
          .tabs=${[
            { value: 'mine', label: 'Мои' },
            { value: 'company', label: 'Компании' },
          ] as TkTab[]}
          .defaultValue=${'company'}
        >
          <div slot="tab-0"><p>Черновики пользователя.</p></div>
          <div slot="tab-1">
            <div class="tkd-toolbar">
              <tk-button variant="secondary" size="compact">Создать платёж</tk-button>
              <tk-button variant="secondary" size="compact">Подписать</tk-button>
              <tk-button variant="secondary" size="compact">Загрузить</tk-button>
              <div class="tkd-grow">
                <tk-combobox-search
                  label="Контрагент"
                  placeholder="Контрагент или номер"
                  .options=${CONTRAGENTS}
                ></tk-combobox-search>
              </div>
              <tk-filter-chips label="Период" .items=${CHIP_ITEMS} default-value="month"></tk-filter-chips>
              <tk-checkbox label="Запомнить"></tk-checkbox>
            </div>

            <tk-tabs
              class="tkd-tabs"
              .tabs=${PAYMENT_TABS}
              .defaultValue=${'all'}
            >
              <div slot="tab-0">
                <div class="tkd-summary">
                  <tk-checkbox aria-label="Выбрать все"></tk-checkbox>
                  <span>Выбрано 2 · 120 500 ₽</span>
                </div>
                <table class="tkd-table">
                  <thead>
                    <tr>
                      <th scope="col">Получатель</th>
                      <th scope="col">Статус</th>
                      <th scope="col" class="tkd-num">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${PAYMENT_ROWS.map(
                      (row) => html`
                        <tr>
                          <td>
                            <span class="tkd-payer">
                              <span class="tkd-avatar" aria-hidden="true">А</span>
                              <span>
                                ${row.payer}
                                <span class="tkd-sub">${row.inn}</span>
                              </span>
                            </span>
                          </td>
                          <td>
                            <tk-badge
                              variant=${row.status === 'Исполнен' ? 'stat' : 'neutral'}
                              label=${row.status}
                            ></tk-badge>
                          </td>
                          <td class="tkd-num">${row.amount}</td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              </div>
              <div slot="tab-1"><p>Ждут подписи.</p></div>
              <div slot="tab-2"><p>Требуют внимания.</p></div>
              <div slot="tab-3"><p>Исполненные.</p></div>
            </tk-tabs>
          </div>
        </tk-tabs>
      </div>
    </div>
  `,
};

/** Progress cards + the favorites grid with its ghost tile (admin-limits + admin-payments-hub). */
export const ProgressFavoritesDemo: Story = {
  name: 'Прогресс и избранное',
  render: () => html`
    ${v2PageStyles}
    ${dataSurfaceStyles}
    <div class="tkv2">
      <h1>Демо — лимиты и избранное</h1>
      <p class="tkv2-note">
        Карточки лимитов с тонкими барами (хук высоты + хук заливки) и сетка
        избранного хаба платежей с плиткой-призраком.
      </p>

      <div class="tkd-canvas">
        <div class="tkd-card">
          <h3>Лимиты</h3>
          <p class="tkv2-note" style="margin-block-end: var(--tk-space-12);">
            Бары именованы через <code>label</code> (axe: безымянный progressbar
            — нарушение; в паке бары бэар — дельта продиктована доступностью).
          </p>
          <tk-progress-bar
            label="Лимит Spending-карты"
            value="72"
            style="--tk-progress-bar-height: 6px; --tk-progress-bar-fill: var(--tk-color-yellow-100);"
          ></tk-progress-bar>
          <tk-progress-bar
            label="Кредитная линия"
            value="45"
            style="margin-block-start: var(--tk-space-16); --tk-progress-bar-height: 8px; --tk-progress-bar-fill: var(--tk-color-ink-300);"
          ></tk-progress-bar>
        </div>

        <div class="tkd-card">
          <h3>Избранные платежи</h3>
          <div class="tkd-favorites">
            ${FAVORITES.map((name) => html`<div class="tkd-tile">${name}</div>`)}
            <div class="tkd-tile tkd-tile--ghost"><tk-link href="#">Ещё платёж</tk-link></div>
          </div>
        </div>
      </div>
    </div>
  `,
};
