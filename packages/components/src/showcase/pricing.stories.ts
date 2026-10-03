import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import '../feature-card/feature-card.js';
import '../tabs/tabs.js';
import type { TkFeatureCardVariant } from '../feature-card/feature-card.js';
import type { TkTab } from '../tabs/tabs.js';

/**
 * The pricing surfaces (spec 24.1, pattern wave 24a): the tariff page's two
 * NEW-PATTERN compositions out of existing atoms — the plan-card row and the
 * comparison matrix — zero new components, zero token edits.
 *
 * GROUNDING (gap-5 tariffs + trader, tables=0 on BOTH live pages): the live
 * comparison matrix is CSS-grid DIVS, not a `<table>` element — tk-data-table
 * is a row-anchor navigational list, a different shape. So the matrix here is
 * a consumer grid with the APG table-on-div ROLE GRID laid on top:
 * role=table on the grid, role=row per row, role=columnheader on the plan
 * heads, role=rowheader on the feature column (the first-column scope
 * equivalent), role=cell elsewhere. Every check glyph carries an sr-only
 * «Включено» — the icon is decorative, the meaning is text.
 *
 * PLAN CARDS (AC1): tk-feature-card tint bodies with the fee headline +
 * feature checklist + CTA arriving as SLOT CONTENT — the atom gets no
 * price-line of its own (feature-card has no fee contract; the fee register
 * is a consumer recipe, pinned in the prose).
 *
 * MATRIX (AC2): tk-tabs switches SECTIONS (Комиссии / Сервис / Аналитика —
 * the live tab-sectioned shape); each panel is one role=table grid. Columns
 * stay aligned across rows because every row re-declares the SAME grid
 * template and cells min-width:0 — written out in the prose below.
 *
 * NARROW CANVASES: the matrix scrolls horizontally inside .pm-scroll (a
 * role=table wrapper with overflow-x:auto); the plan row collapses via
 * auto-fit minmax.
 *
 * HEADINGS (AC3): one h1 per canvas, section h2s inside; axe in both themes.
 *
 * DATA (the PD gate): plan names, fees and every cell value are FICTIONAL
 * demo data; RU content, EN story meta.
 */

const NBSP = ' ';

/** Plan card data (fictional names/fees — the PD gate). */
interface Plan {
  name: string;
  tint: TkFeatureCardVariant;
  fee: string;
  feeUnit: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: 'Базовый',
    tint: 'gray',
    fee: `0,05${NBSP}%`,
    feeUnit: 'за сделку',
    features: [
      'Биржевые заявки',
      'Демо-счёт для тренировки',
      'Базовые отчёты',
      'Поддержка в чате',
    ],
  },
  {
    name: 'Активный',
    tint: 'bluegray',
    fee: `0,01${NBSP}%`,
    feeUnit: 'за сделку',
    features: [
      'Биржевые заявки',
      'Приоритетная поддержка',
      'Расширенные отчёты',
      'Демо-счёт для тренировки',
    ],
  },
  {
    name: 'Премиум',
    tint: 'beige',
    fee: `199${NBSP}₽`,
    feeUnit: 'в месяц',
    features: [
      'Всё из плана «Активный»',
      'Персональный менеджер',
      'Аналитические обзоры',
      'Закрытые демо-продукты',
    ],
  },
];

/** One matrix cell: a text value, a check glyph, or a muted «Нет». */
interface MatrixCell {
  text: string;
  check?: boolean;
  muted?: boolean;
}

interface MatrixRow {
  feature: string;
  cells: MatrixCell[];
}

/** Matrix section (the live tab-sectioned shape; values fictional). */
interface MatrixSection {
  value: string;
  label: string;
  rows: MatrixRow[];
}

const SECTIONS: MatrixSection[] = [
  {
    value: 'fees',
    label: 'Комиссии',
    rows: [
      {
        feature: 'Комиссия за сделку',
        cells: [
          { text: `0,05${NBSP}%` },
          { text: `0,01${NBSP}%` },
          { text: `0${NBSP}%` },
        ],
      },
      {
        feature: 'Комиссия за вывод средств',
        cells: [
          { text: `0,1${NBSP}%` },
          { text: `0${NBSP}%` },
          { text: `0${NBSP}%` },
        ],
      },
      {
        feature: 'Кастодиальная комиссия',
        cells: [
          { text: `0,02${NBSP}%` },
          { text: `0,02${NBSP}%` },
          { text: `0,01${NBSP}%` },
        ],
      },
      {
        feature: 'Комиссия за простую заявку',
        cells: [
          { text: 'Нет', muted: true },
          { text: `0,5${NBSP}%` },
          { text: `0,3${NBSP}%` },
        ],
      },
    ],
  },
  {
    value: 'service',
    label: 'Сервис',
    rows: [
      {
        feature: 'Демо-счёт для тренировки',
        cells: [
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
        ],
      },
      {
        feature: 'Приоритетная поддержка',
        cells: [
          { text: 'Нет', muted: true },
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
        ],
      },
      {
        feature: 'Персональный менеджер',
        cells: [
          { text: 'Нет', muted: true },
          { text: 'Нет', muted: true },
          { text: 'Включено', check: true },
        ],
      },
      {
        feature: 'Выписки и отчёты',
        cells: [{ text: 'Базовые' }, { text: 'Расширенные' }, { text: 'Расширенные' }],
      },
    ],
  },
  {
    value: 'analytics',
    label: 'Аналитика',
    rows: [
      {
        feature: 'Аналитические обзоры',
        cells: [{ text: 'Нет', muted: true }, { text: 'Базовые' }, { text: 'Полные' }],
      },
      {
        feature: 'Скринер инструментов',
        cells: [
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
        ],
      },
      {
        feature: 'Опциональные стратегии',
        cells: [
          { text: 'Нет', muted: true },
          { text: 'Включено', check: true },
          { text: 'Включено', check: true },
        ],
      },
      {
        feature: 'Экспорт данных',
        cells: [
          { text: 'Нет', muted: true },
          { text: 'Нет', muted: true },
          { text: 'Включено', check: true },
        ],
      },
    ],
  },
];

const SECTION_TABS: TkTab[] = SECTIONS.map(({ value, label }) => ({ value, label }));

/** The check glyph — decorative svg + sr-only text (the meaning is text, AC3). */
const checkCell = (cell: MatrixCell) => html`
  <span class="pm-check">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 9.4 7.4 12.8 14 6.2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
    <span class="pm-sr">${cell.text}</span>
  </span>
`;

/** One section's role=table grid (the APG table-on-div recipe, AC2). */
const matrix = (section: MatrixSection) => html`
  <div class="pm-scroll">
    <div class="pm-matrix" role="table" aria-label=${`Сравнение планов: ${section.label}`}>
      <div class="pm-row pm-row--head" role="row">
        <div class="pm-cell pm-cell--feature" role="columnheader">Возможность</div>
        ${PLANS.map(
          (plan) =>
            html`<div class="pm-cell pm-cell--plan" role="columnheader">${plan.name}</div>`,
        )}
      </div>
      ${section.rows.map(
        (row) => html`
          <div class="pm-row" role="row">
            <div class="pm-cell pm-cell--feature" role="rowheader">${row.feature}</div>
            ${row.cells.map(
              (cell) => html`
                <div
                  class="pm-cell pm-cell--plan${cell.muted ? ' pm-cell--muted' : ''}"
                  role="cell"
                >
                  ${cell.check ? checkCell(cell) : cell.text}
                </div>
              `,
            )}
          </div>
        `,
      )}
    </div>
  </div>
`;

const canvasStyles = html`
  <style>
    .pm-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .pm-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .pm-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .pm-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .pm-lead {
      margin: 0;
      font-size: var(--tk-text-body-l-size);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }
    .pm-plans {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(264px, 1fr));
      gap: var(--tk-space-16);
      align-items: stretch;
    }
    /* PLAN CARD RECIPE (consumer slot content — the atom has no fee
       contract): the description slot carries the fee headline (heading-5
       register) + the checklist; the CTA rides the actions slot. */
    .pm-plans tk-feature-card {
      min-width: 0;
    }
    .pm-plan {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .pm-fee {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .pm-fee__unit {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      font-weight: 400;
      color: var(--tk-color-text-secondary);
    }
    .pm-features {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .pm-features li {
      display: flex;
      align-items: flex-start;
      gap: var(--tk-space-8);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .pm-features svg {
      flex: none;
      margin-top: 2px;
      color: var(--tk-color-yellow-300);
    }
    /* MATRIX RECIPE (tables=0 on the live page — CSS-grid divs): every row
       re-declares the SAME template so the columns stay aligned; cells
       min-width:0 keeps long feature names from inflating track sizes
       differently per row. */
    .pm-scroll {
      overflow-x: auto;
    }
    .pm-matrix {
      min-width: 560px;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      overflow: hidden;
    }
    .pm-row {
      display: grid;
      grid-template-columns: minmax(168px, 1.3fr) repeat(3, minmax(96px, 1fr));
    }
    .pm-row + .pm-row {
      border-top: 1px solid var(--tk-color-border-default);
    }
    .pm-row--head {
      background: var(--tk-color-surface-muted);
    }
    .pm-cell {
      min-width: 0;
      padding: var(--tk-space-12) var(--tk-space-16);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      overflow-wrap: anywhere;
    }
    .pm-cell--feature {
      text-align: start;
      color: var(--tk-color-text-primary);
    }
    .pm-cell--plan {
      text-align: center;
    }
    .pm-row--head .pm-cell {
      font-weight: 500;
    }
    .pm-cell--muted {
      color: var(--tk-color-text-secondary);
    }
    .pm-check {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--tk-color-yellow-300);
    }
    /* Screen-reader-only text: the check glyph is decorative, the cell's
       meaning travels as text. */
    .pm-sr {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Pricing',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const PlanCards: Story = {
  name: 'Тарифные планы',
  render: () => html`
    ${canvasStyles}
    <main class="pm-canvas">
      <p class="pm-note">
        Ряд тарифных карточек (спека 24.1): план-карта — это tk-feature-card,
        где fee-заголовок и чек-лист приходят слот-контентом (у атома нет
        комиссионного контракта — это рецепт консьюмера, а не новый атом).
        Рецепт: слот description несёт fee-строку (heading-4 регистр) и
        ul-чек-лист с консьюмерскими галочками; CTA — слот actions. Ряд —
        grid auto-fit minmax(264px, 1fr). Обе темы — без правок состава.
        Все названия планов и комиссии вымышленные.
      </p>
      <div class="pm-layout">
        <h1 class="pm-title">Тарифные планы</h1>
        <p class="pm-lead">
          Демо-линейка из трёх вымышленных планов: чем выше план, тем ниже
          комиссия за сделку и шире сервис.
        </p>
        <div class="pm-plans">
          ${PLANS.map(
            (plan) => html`
              <tk-feature-card variant=${plan.tint}>
                <span slot="heading">${plan.name}</span>
                <div class="pm-plan" slot="description">
                  <p class="pm-fee">
                    ${plan.fee}
                    <span class="pm-fee__unit">${plan.feeUnit}</span>
                  </p>
                  <ul class="pm-features">
                    ${plan.features.map(
                      (feature) => html`
                        <li>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 18 18"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 9.4 7.4 12.8 14 6.2"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                          ${feature}
                        </li>
                      `,
                    )}
                  </ul>
                </div>
                <tk-button slot="actions" size="compact">Выбрать</tk-button>
              </tk-feature-card>
            `,
          )}
        </div>
      </div>
    </main>
  `,
};

export const PlanMatrix: Story = {
  name: 'Сравнение планов',
  render: () => html`
    ${canvasStyles}
    <main class="pm-canvas">
      <p class="pm-note">
        Матрица сравнения (спека 24.1): на живой странице таблиц НЕТ
        (tables=0) — матрица собрана CSS-grid div'ами, поверх которых лежит
        ролевая сетка APG table-on-div: role=table на гриде, role=row на
        строках, role=columnheader на шапках планов, role=rowheader на
        колонке возможностей (эквивалент scope для первой колонки),
        role=cell на значениях. Галочка — декоративный svg, смысл передаётся
        sr-only текстом «Включено». Рецепт выравнивания: каждая строка
        повторяет ОДИН И ТОТ ЖЕ grid-template-columns + min-width: 0 на
        ячейках — колонки не расползаются. Секции переключаются tk-tabs
        (живой паттерн таб-секций); на узких канвах матрица скроллится
        горизонтально внутри обёртки overflow-x: auto. Обе темы — без
        правок состава. Все значения вымышленные.
      </p>
      <div class="pm-layout">
        <h1 class="pm-title">Сравнение тарифных планов</h1>
        <p class="pm-lead">
          Три демо-плана по секциям: комиссии, сервис и аналитика — вымышленные
          условия для демонстрации паттерна.
        </p>
        <tk-tabs .tabs=${SECTION_TABS} default-value="fees">
          ${SECTIONS.map((section, index) => html`<div slot="tab-${index}">${matrix(section)}</div>`)}
        </tk-tabs>
      </div>
    </main>
  `,
};
