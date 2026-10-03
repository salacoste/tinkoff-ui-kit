import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import type { AttributePart } from 'lit';

import '../badge/badge.js';
import '../data-table/data-table.js';
import '../filter-chips/filter-chips.js';
import '../link/link.js';
import { showToast } from '../toast/show.js';
import type {
  TkDataTable,
  TkDataTableColumn,
  TkDataTableRow,
} from '../data-table/data-table.js';
import type {
  TkFilterChips,
  TkFilterChipsItem,
} from '../filter-chips/filter-chips.js';

/**
 * The active-filter strip (spec 24.6, pattern wave 24a): the «Активные
 * фильтры [n]» row with Сбросить / Все фильтры links — the shape BETWEEN
 * the filter panel and the results on the live bonds/etfs pages (gap-1).
 * Zero atom edits: the strip is a CONSUMER row out of tk-badge + tk-link;
 * tk-filter-chips has no summary/count/reset composition of its own.
 *
 * THE CHIP MODEL (pinned in the prose): tk-filter-chips is SINGLE-select
 * per group — the live multi-filter page maps to N chip GROUPS (one axis =
 * one element), each with an «Все» default. An ACTIVE filter = a group off
 * its default; the count = the number of such groups; 0 → the strip hides
 * (the presence mold — hidden, not empty).
 *
 * STATE (the 23.3 mold): the filter state is the demo consumer's closure;
 * the strip is aria-live so count changes announce; «Сбросить» returns
 * every group to its default; «Все фильтры» is a no-op demo (the toast).
 * The mini-table refilters live — the recipe's point: the strip is a VIEW
 * over the same state, never a second source of truth. The canvas MOUNTS
 * with one axis active (the SelectDollarOnMount driver below) so the
 * resting baseline PAINTS the strip — a presence mold mounted all-default
 * would baseline a canvas where the subject never renders.
 *
 * DATA (the PD gate): instruments, prices and yields are FICTIONAL; RU
 * content, EN story meta.
 */

const NBSP = '\u00A0';

/** One filter axis (a chip group) with its «Все» default. */
interface FilterAxis {
  id: string;
  label: string;
  items: TkFilterChipsItem[];
  /** The axis's default (inactive) value. */
  all: string;
  /** Maps a demo row to this axis's value. */
  pick: (row: DemoRow) => string;
}

interface DemoRow {
  name: string;
  ticker: string;
  kind: 'Акции' | 'Фонды' | 'Облигации';
  currency: '₽' | '$';
  risk: 'Низкий' | 'Средний' | 'Высокий';
  price: string;
  yld: string;
}

const DEMO_ROWS: DemoRow[] = [
  { name: 'Демо-акция Альфа', ticker: 'DMAA', kind: 'Акции', currency: '₽', risk: 'Средний', price: `312,40${NBSP}₽`, yld: '9,8 %' },
  { name: 'Демо-фонд Бета', ticker: 'DMFB', kind: 'Фонды', currency: '₽', risk: 'Низкий', price: `104,15${NBSP}₽`, yld: '7,2 %' },
  { name: 'Демо-облигация Гамма', ticker: 'DMOG', kind: 'Облигации', currency: '₽', risk: 'Низкий', price: `998,00${NBSP}₽`, yld: '11,4 %' },
  { name: 'Демо-акция Дельта', ticker: 'DMD', kind: 'Акции', currency: '$', risk: 'Высокий', price: `54,30${NBSP}$`, yld: '15,1 %' },
  { name: 'Демо-фонд Эпсилон', ticker: 'DMFE', kind: 'Фонды', currency: '$', risk: 'Средний', price: `87,60${NBSP}$`, yld: '10,3 %' },
  { name: 'Демо-облигация Дзета', ticker: 'DMZ', kind: 'Облигации', currency: '$', risk: 'Средний', price: `1${NBSP}012,50${NBSP}$`, yld: '12,6 %' },
];

const AXES: FilterAxis[] = [
  {
    id: 'fs-kind',
    label: 'Тип инструмента',
    all: 'all',
    items: [
      { value: 'all', label: 'Все' },
      { value: 'Акции', label: 'Акции' },
      { value: 'Фонды', label: 'Фонды' },
      { value: 'Облигации', label: 'Облигации' },
    ],
    pick: (row) => row.kind,
  },
  {
    id: 'fs-currency',
    label: 'Валюта',
    all: 'all',
    items: [
      { value: 'all', label: 'Все' },
      { value: '₽', label: 'Рубль' },
      { value: '$', label: 'Доллар' },
    ],
    pick: (row) => row.currency,
  },
  {
    id: 'fs-risk',
    label: 'Риск',
    all: 'any',
    items: [
      { value: 'any', label: 'Любой' },
      { value: 'Низкий', label: 'Низкий' },
      { value: 'Средний', label: 'Средний' },
      { value: 'Высокий', label: 'Высокий' },
    ],
    pick: (row) => row.risk,
  },
];

const COLUMNS: TkDataTableColumn[] = [
  { key: 'name', header: 'Инструмент', width: '1.6fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'yield', header: 'Доходность', align: 'end' },
];

/**
 * Story-only ACTIVE-STATE driver (the TypeOnMount precedent, combobox-search
 * spec 6.3): the strip is PRESENCE-MOLDED — 0 active filters → hidden — so a
 * canvas mounted at every axis's default would baseline a page where the
 * pattern's subject NEVER PAINTS in either theme (the lens round of 24.6
 * caught exactly that). The directive drives the PUBLIC selection path once
 * on mount — a native click on the «Доллар» chip of the currency axis,
 * exactly what a user's press produces — so the RESTING canvas holds the
 * strip VISIBLE: count=1, the aria-live text, the table refiltered to the
 * $ rows. «Сбросить» still demonstrates the 0 → hidden direction
 * interactively.
 */
class SelectDollarOnMount extends Directive {
  #driven = new WeakSet<object>();

  override update(part: AttributePart): string {
    const element = part.element as TkFilterChips;
    if (element && !this.#driven.has(element)) {
      this.#driven.add(element);
      void element.updateComplete.then(() => {
        const chip = [
          ...(element.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []),
        ].find((button) => button.textContent?.trim() === 'Доллар');
        chip?.click();
      });
    }
    return this.render();
  }

  override render(): string {
    return '';
  }
}

const selectDollarOnMount = directive(SelectDollarOnMount);

const toRows = (rows: DemoRow[]): TkDataTableRow[] =>
  rows.map((row) => ({
    cells: {
      name: { primary: row.name, secondary: row.ticker },
      price: { primary: row.price },
      yield: { primary: row.yld },
    },
  }));

const canvasStyles = html`
  <style>
    .fs-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .fs-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .fs-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .fs-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .fs-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .fs-axes {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* THE STRIP (consumer row): between the filters and the result; the
       count badge + the two links; hidden at 0 active filters (the
       presence mold — hidden, not empty). */
    .fs-strip {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
      flex-wrap: wrap;
      padding: var(--tk-space-12) var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .fs-strip[hidden] {
      display: none;
    }
    .fs-strip__label {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .fs-strip__spacer {
      flex: 1;
    }
    /* sr-only mirror for the live announcements (the strip itself is a
       visual row; the count/summary travels through this node). */
    .fs-sr {
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
  title: 'Invest/Filter strip',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const FilterStrip: Story = {
  name: 'Активные фильтры',
  render: () => {
    // One-shot demo consumer (the 23.3 mold): axis values in a closure.
    const state: Record<string, string> = Object.fromEntries(
      AXES.map((axis) => [axis.id, axis.all]),
    );

    const activeAxes = (): FilterAxis[] =>
      AXES.filter((axis) => state[axis.id] !== axis.all);

    const sync = () => {
      const active = activeAxes();
      const strip = document.querySelector<HTMLElement>('#fs-strip');
      if (strip) strip.hidden = active.length === 0;
      const badge = document.querySelector<HTMLElement>('#fs-count');
      if (badge) badge.setAttribute('count', String(active.length));
      const live = document.querySelector<HTMLElement>('#fs-live');
      if (live) {
        live.textContent =
          active.length === 0
            ? 'Фильтры сброшены'
            : `Активных фильтров: ${active.length} — ${active
                .map((axis) => axis.items.find((item) => item.value === state[axis.id])?.label)
                .join(', ')}`;
      }
      const rows = DEMO_ROWS.filter((row) =>
        AXES.every((axis) => state[axis.id] === axis.all || axis.pick(row) === state[axis.id]),
      );
      const table = document.querySelector<TkDataTable>('#fs-table');
      if (table) table.rows = toRows(rows);
    };

    return html`
      ${canvasStyles}
      <main class="fs-canvas">
        <p class="fs-note">
          Строка активных фильтров (спека 24.6): «Активные фильтры [n]» +
          «Сбросить» / «Все фильтры» — паттерн между панелью фильтров и
          результатами живых страниц облигаций и фондов. У tk-filter-chips
          нет summary/count/reset композиции — строка собирается консьюмером
          из tk-badge и tk-link. МОДЕЛЬ ЧИПОВ: tk-filter-chips
          одновыборный — мультифильтр живой страницы раскладывается в N
          групп чипов (одна ось = один элемент), каждая со значением «Все»
          по умолчанию; АКТИВНЫЙ фильтр = группа вне дефолта; счётчик =
          число таких групп; 0 → строка скрыта (presence-молд: hidden, а
          не пустая). Состояние — замыкание демо-консьюмера (кик не хранит
          состояние фильтров); строка aria-live — счётчик и состав
          объявляются; «Сбросить» возвращает все группы в дефолт; «Все
          фильтры» — no-op демо (тост). Суть рецепта: строка — ПРЕДСТАВЛЕНИЕ
          над тем же состоянием, а не второй источник истины. Канва
          монтируется с ОДНОЙ активной осью (Валюта = Доллар — стори-драйвер
          кликает настоящий чип по маунту, молд TypeOnMount у
          combobox-search): в покое видна сама строка — счётчик 1, ссылки,
          таблица отфильтрована до $-строк; «Сбросить» показывает обратное
          направление 0 → скрыта. Обе темы —
          без правок состава. Все инструменты, цены и доходности
          вымышленные.
        </p>
        <div class="fs-layout">
          <h1 class="fs-title">Демо-каталог инструментов</h1>

          <section class="fs-section" aria-labelledby="fs-filters-title">
            <h2 class="fs-section__title" id="fs-filters-title">Фильтры</h2>
            <div class="fs-axes">
              ${AXES.map(
                (axis) => html`
                  <tk-filter-chips
                    id=${axis.id}
                    data-driver=${axis.id === 'fs-currency' ? selectDollarOnMount() : ''}
                    label=${axis.label}
                    .items=${axis.items}
                    default-value=${axis.all}
                    @value-change=${(event: CustomEvent<{ value: string }>) => {
                      state[axis.id] = event.detail.value;
                      sync();
                    }}
                  ></tk-filter-chips>
                `,
              )}
            </div>
          </section>

          <div id="fs-strip" class="fs-strip" hidden>
            <span class="fs-strip__label">Активные фильтры</span>
            <tk-badge id="fs-count" variant="neutral" count="0"></tk-badge>
            <span class="fs-strip__spacer"></span>
            <tk-link
              href="#"
              @click=${(event: Event) => {
                event.preventDefault();
                for (const axis of AXES) {
                  const chips = document.querySelector<TkFilterChips>(`#${axis.id}`);
                  if (chips) chips.value = axis.all;
                  state[axis.id] = axis.all;
                }
                sync();
              }}
              >Сбросить</tk-link
            >
            <tk-link
              href="#"
              @click=${(event: Event) => {
                event.preventDefault();
                showToast({ message: 'Все фильтры — демо-действие без эффекта' });
              }}
              >Все фильтры</tk-link
            >
          </div>

          <section class="fs-section" aria-labelledby="fs-results-title">
            <h2 class="fs-section__title" id="fs-results-title">Результаты</h2>
            <p id="fs-live" class="fs-sr" aria-live="polite"></p>
            <tk-data-table
              id="fs-table"
              caption="Демо-каталог инструментов"
              .columns=${COLUMNS}
              .rows=${toRows(DEMO_ROWS)}
            ></tk-data-table>
          </section>
        </div>
      </main>
    `;
  },
};
