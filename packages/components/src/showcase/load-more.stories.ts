import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../data-table/data-table.js';
import '../pagination/pagination.js';
import type { TkDataTable, TkDataTableColumn, TkDataTableRow } from '../data-table/data-table.js';

/**
 * The load-more hybrid (spec 24.5, pattern wave 24a): «Показать ещё» and
 * the pager SHARING one feed — the live etfs shape (the full-width soft bar
 * right under the list, the pager the source of truth for POSITION). The
 * whole composition rides ONE existing atom: tk-pagination's built-in
 * `show-more` bar (its `load-more` event fires WITHOUT changing the page —
 * exactly the hybrid contract). Zero atom edits.
 *
 * THE RULES (AC2, pinned in the visible prose): the «Показать ещё» bar
 * appends the NEXT portion to the end of the visible feed (the pager's
 * page does NOT move); a pager jump REPLACES the feed with that page's
 * block (the accumulated tail resets). State is the demo consumer's
 * closure (the 23.3 mold — the kit holds no feed state).
 *
 * FEED: tk-data-table with inert rows (fictional demo instruments — the PD
 * gate). The append is announced via aria-live («добавлено N строк»).
 *
 * HEADINGS (AC3): one h1, one h2; nav rides tk-pagination's own nav
 * contract; axe in both themes; RU content, EN story meta.
 */

const PAGE_SIZE = 6;
const PAGE_COUNT = 5;

const NBSP = ' ';

/** Fictional demo instruments (PD gate — invented names and numbers). */
const mkInstruments = (): { name: string; ticker: string; price: string; delta: string; up: boolean }[] =>
  Array.from({ length: PAGE_SIZE * PAGE_COUNT }, (_, i) => ({
    name: `Демо-актив ${i + 1}`,
    ticker: `DMO${String(i + 1).padStart(2, '0')}`,
    price: `${(100 + i * 7.3).toFixed(2).replace('.', ',')}${NBSP}₽`,
    delta: `${(i % 2 === 0 ? '+' : '−') + (0.2 + (i % 5) * 0.4).toFixed(1).replace('.', ',')}%`,
    up: i % 2 === 0,
  }));

const INSTRUMENTS = mkInstruments();

const COLUMNS: TkDataTableColumn[] = [
  { key: 'name', header: 'Инструмент', width: '1.6fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'delta', header: 'Изменение', align: 'end' },
];

const toRows = (list: typeof INSTRUMENTS): TkDataTableRow[] =>
  list.map((item) => ({
    cells: {
      name: { primary: item.name, secondary: item.ticker },
      price: { primary: item.price },
      delta: { primary: item.delta, delta: item.up ? 'positive' : 'negative' },
    },
  }));

const canvasStyles = html`
  <style>
    .lm-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .lm-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .lm-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .lm-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .lm-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .lm-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .lm-count {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Load more',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const LoadMoreHybrid: Story = {
  name: 'Показать ещё и пейджер',
  render: () => {
    // One-shot demo consumer (the 23.3 mold): { page, extra } closure.
    const state = { page: 1, extra: 0 };

    const visibleCount = (): number =>
      Math.min(PAGE_SIZE * PAGE_COUNT, (state.page + state.extra) * PAGE_SIZE);

    const sync = (announce?: string) => {
      const table = document.querySelector<TkDataTable>('#lm-table');
      if (table) table.rows = toRows(INSTRUMENTS.slice(0, visibleCount()));
      const count = document.querySelector<HTMLOutputElement>('#lm-count-value');
      if (count) count.textContent = String(visibleCount());
      const live = document.querySelector<HTMLElement>('#lm-live');
      if (live && announce) live.textContent = announce;
    };

    return html`
      ${canvasStyles}
      <main class="lm-canvas">
        <p class="lm-note">
          Гибрид «Показать ещё» + пейджер (спека 24.5): оба управления на
          одной ленте — весь гибрид живёт в ОДНОМ существующем атоме
          tk-pagination с включённым show-more баром (его load-more событие
          НЕ меняет страницу — ровно контракт гибрида). Правила совместного
          состояния: бар «Показать ещё» доклеивает СЛЕДУЮЩУЮ порцию в конец
          видимой ленты (страница пейджера не двигается); переход по
          пейджеру ЗАМЕНЯЕТ ленту блоком выбранной страницы (накопленный
          хвост сбрасывается — пейджер остаётся источником истины позиции).
          Состояние — замыкание демо-консьюмера (кит не хранит состояние
          ленты); прирост объявляется aria-live («добавлено N строк»).
          Навигация — nav-контракт tk-pagination (стрелки, Home/End, Enter
          на страницу). Обе темы — без правок состава. Все инструменты,
          цены и изменения вымышленные.
        </p>
        <div class="lm-layout">
          <h1 class="lm-title">Каталог демо-активов</h1>
          <section class="lm-section" aria-labelledby="lm-feed-title">
            <h2 class="lm-section__title" id="lm-feed-title">Лента</h2>
            <p class="lm-count">
              Показано инструментов:
              <output id="lm-count-value">${PAGE_SIZE}</output> из
              ${PAGE_SIZE * PAGE_COUNT}
            </p>
            <p id="lm-live" class="lm-count" aria-live="polite"></p>
            <tk-data-table
              id="lm-table"
              caption="Демо-активы каталога"
              .columns=${COLUMNS}
              .rows=${toRows(INSTRUMENTS.slice(0, PAGE_SIZE))}
            ></tk-data-table>
            <tk-pagination
              id="lm-pager"
              count=${PAGE_COUNT}
              show-more
              more-label="Показать ещё"
              @page-change=${(event: CustomEvent<{ value: number }>) => {
                state.page = event.detail.value;
                state.extra = 0;
                sync(`Показана страница ${state.page}`);
              }}
              @load-more=${() => {
                const before = visibleCount();
                if (before >= PAGE_SIZE * PAGE_COUNT) return;
                state.extra += 1;
                const added = visibleCount() - before;
                sync(`добавлено ${added} строк(и) — всего ${visibleCount()}`);
              }}
            ></tk-pagination>
          </section>
        </div>
      </main>
    `;
  },
};
