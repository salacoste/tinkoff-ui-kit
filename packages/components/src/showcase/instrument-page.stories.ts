import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';

import '../accordion/accordion.js';
import '../accordion/accordion-item.js';
import '../article-card/article-card.js';
import '../button/button.js';
import '../chart/chart.js';
import '../feature-card/feature-card.js';
import '../instrument-hero/instrument-hero.js';
import '../kv-list/kv-list.js';
import '../kv-list/kv-list-item.js';
import '../promo-card/promo-card.js';
import '../publisher-header/publisher-header.js';
import '../segmented-radio/segmented-radio.js';
import '../tabs/tabs.js';
import type { TkSegmentedRadioOption } from '../segmented-radio/segmented-radio.js';
import type { TkTab } from '../tabs/tabs.js';

/**
 * The instrument page assembly (spec 23.4) — the invest remainder wave's
 * CLOSING composition: the whole two-column instrument page out of the
 * wave's atoms (22.4–23.2), zero new components, zero token edits, zero
 * registry pins.
 *
 * LAYOUT RECIPE (AC1 — a CONSUMER CSS recipe, pinned in the visible prose
 * below): a 2-column grid (fluid main + the 247px sidebar — the live
 * ticket width, spec 22.6), collapsing under 1024px to sidebar-below-main.
 * The sidebar rides `position: sticky; top: var(--tk-space-24); align-self:
 * start` — the two documented stickiness traps (sticky dies inside an
 * overflow-clipping ancestor; `align-self: stretch` is the grid default and
 * makes a short sidebar as tall as main, defeating the stick) are written
 * out in the story prose, not hidden in rules. The NARROW-RAIL adaptation
 * (the publisher row's action wraps onto its own line via flex-wrap on the
 * host — the atom's wide-canvas row would crush the name in a 247px rail)
 * is pinned the same way.
 *
 * ASSEMBLY (AC2): main = tk-instrument-hero (the h1 rides the name SLOT —
 * document semantics, the anti-empty-h1 ruling) → the timeframe toolbar
 * (tk-segmented-radio, sr-only label) + tk-chart → «Показатели бумаги»
 * (tk-tabs + tk-kv-list rows with delta spans on the 22.1/22.2 delta
 * tokens) → «Частые вопросы» (tk-accordion) → «Новости» (tk-article-card);
 * sidebar = the price ticket (tk-promo-card ticket, 22.6) +
 * tk-publisher-header (23.2) + the summary forecast (tk-feature-card).
 *
 * DARK THEME (AC3): the page ships in BOTH themes with zero composition
 * edits — the pure semantics-layer test of the whole invest line; the
 * visual harness baselines both automatically.
 *
 * HEADINGS (AC4, against the live empty-h1 negatives): exactly one h1 (the
 * hero name slot), every section an h2 — pinned by axe in both themes.
 *
 * DATA (the PD gate): instrument, prices, forecasts and every number are
 * FICTIONAL demo data; RU content, EN story meta.
 */

/** Fictional series (48 deterministic points — demo data, not a measurement). */
const mkPoints = (): { value: number }[] =>
  Array.from({ length: 48 }, (_, i) => ({ value: Math.round(1180 + i * 2.6 + Math.sin(i / 3) * 38) }));

/** Timeframe toolbar options (fictional ranges). */
const TIMEFRAMES: TkSegmentedRadioOption[] = [
  { value: '1d', label: '1Д' },
  { value: '1m', label: '1М' },
  { value: '6m', label: '6М' },
  { value: '1y', label: '1Г' },
  { value: '5y', label: '5Л' },
];

/** Indicator sub-tabs («Показатели бумаги»). */
const METRIC_TABS: TkTab[] = [
  { value: 'day', label: 'За день' },
  { value: 'year', label: 'За год' },
];

const NBSP = ' ';

const canvasStyles = html`
  <style>
    .ip-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .ip-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 247px;
      gap: var(--tk-space-32);
      align-items: start;
    }
    /* THE STICKY RECIPE (consumer CSS): align-self start (the grid default
       stretch would make the sidebar main-tall and kill the stick) + a top
       offset. The ancestor chain must not clip overflow — see the prose. */
    .ip-sidebar {
      position: sticky;
      top: var(--tk-space-24);
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .ip-main {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-40);
      min-width: 0;
    }
    .ip-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .ip-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .ip-chart-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--tk-space-16);
      flex-wrap: wrap;
    }
    .ip-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* NARROW-RAIL ADAPTATION (consumer recipe, DOM-probed): the publisher
       row is measured on a WIDE canvas (the 23.2 grounding) — its body
       wraps the name INSIDE (min-width: 0) rather than pushing the action
       out, so in this 247px rail the 143px follow button crushes the name
       into a letter-per-line 29px column. The consumer wraps the action
       onto its own line instead — the atom's contract stays untouched. */
    .ip-sidebar tk-publisher-header {
      flex-wrap: wrap;
      row-gap: var(--tk-space-12);
    }
    /* Delta spans ride the 22.1/22.2 delta tokens (sanctioned on
       surface-base rows — the 6.1 scope ruling). */
    .ip-delta--up {
      color: var(--tk-color-delta-positive);
    }
    .ip-delta--down {
      color: var(--tk-color-delta-negative);
    }
    .ip-hero-star {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--tk-color-white);
      cursor: pointer;
    }
    .ip-hero-star:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
      border-radius: var(--tk-radius-full);
    }
    .ip-news {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--tk-space-16);
    }
    /* Collapse below 1024: the sidebar drops under the main column. */
    @media (max-width: 1023px) {
      .ip-layout {
        grid-template-columns: 1fr;
      }
      .ip-sidebar {
        position: static;
      }
    }
  </style>
`;

/** The hero favorite star (the 22.5 slot-button mold — white on gradients). */
const heroStar = html`
  <button class="ip-hero-star" slot="action" type="button" aria-label="Добавить в избранное" aria-pressed="false">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8L12 3.6z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      ></path>
    </svg>
  </button>
`;

/** The verification chips (the 23.2 slot-content mold — consumer svgs on kit tokens). */
const verifiedChip = html`
  <svg slot="badge" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="var(--tk-color-invest-badge-verified-backdrop)"></circle>
    <circle cx="9" cy="9" r="6" fill="var(--tk-color-invest-badge-verified)"></circle>
  </svg>
`;

const officialChip = html`
  <svg slot="badge" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="var(--tk-color-invest-badge-official-backdrop)"></circle>
    <path
      d="M5 9.2 7.8 12 13 6.5"
      fill="none"
      stroke="var(--tk-color-invest-badge-official)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
`;

/** A KV row with a delta tail (fictional numbers — the PD gate). */
const kvRow = (label: string, value: string, delta?: { text: string; up: boolean }) => html`
  <tk-kv-list-item label=${label}>
    <span slot="value"
      >${value}${delta
        ? html` <span class=${delta.up ? 'ip-delta--up' : 'ip-delta--down'}>${delta.text}</span>`
        : nothing}</span
    >
  </tk-kv-list-item>
`;

const meta: Meta = {
  title: 'Invest/Instrument page',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const InstrumentPage: Story = {
  name: 'Инструментальная страница',
  render: () => html`
    ${canvasStyles}
    <main class="ip-canvas">
      <p class="ip-note">
        Сборка инструментальной страницы из атомов волны: hero, график с
        тулбаром диапазонов, показатели, вопросы, новости; сайдбар — билет,
        профиль издателя, сводный прогноз. Рецепт лейаута (CSS консьюмера):
        сетка «main + сайдбар 247px», ниже 1024px сайдбар уходит под main.
        Sticky-сайдбар: position: sticky; top: 24px; align-self: start —
        ловушки: sticky гаснет в предке с overflow: auto|hidden (скролл-контейнер
        отбирает позиционирование) и в гриде с дефолтным align-self: stretch
        (короткий сайдбар растягивается до высоты main и залипать некуда).
        Узкая рейка и строка издателя: атом замерен на широкой канве, его
        имя заворачивается внутри строки, а не выталкивает кнопку — в рейке
        247px кнопка «Подписаться» сплющивает имя в столбец буква-на-строку;
        рецепт консьюмера — flex-wrap на хосте, кнопка уходит на свою
        строку (проверено DOM-пробой: имя снова одной строкой).
        Тёмная тема — без единой правки состава: чистый прогон семантик-слоя
        invest-линейки. Заголовки: один h1 (имя бумаги в hero-слоте), секции —
        h2. Все данные вымышленные.
      </p>
      <div class="ip-layout">
        <div class="ip-main">
          <tk-instrument-hero
            tone="stock"
            ticker="RDX · демо-индекс"
            metric-label="Стоимость пая"
          >
            <h1 slot="name">Демо-индекс широкого рынка</h1>
            <span slot="metric">1${NBSP}234,56${NBSP}₽</span>
            ${heroStar}
          </tk-instrument-hero>

          <section class="ip-section" aria-labelledby="ip-chart-title">
            <h2 class="ip-section__title" id="ip-chart-title">График</h2>
            <div class="ip-chart-bar">
              <tk-segmented-radio
                name="ip-range"
                sr-only
                label="Диапазон графика"
                .options=${TIMEFRAMES}
                default-value="1y"
              ></tk-segmented-radio>
            </div>
            <tk-chart tone="stock" badge .points=${mkPoints()} reference=${1215}></tk-chart>
          </section>

          <section class="ip-section" aria-labelledby="ip-metrics-title">
            <h2 class="ip-section__title" id="ip-metrics-title">Показатели бумаги</h2>
            <tk-tabs .tabs=${METRIC_TABS} default-value="day">
              <tk-kv-list slot="tab-0">
                ${kvRow('Цена открытия', `1${NBSP}228,10${NBSP}₽`, { text: '+0,51%', up: true })}
                ${kvRow('Максимум дня', `1${NBSP}241,02${NBSP}₽`)}
                ${kvRow('Минимум дня', `1${NBSP}219,44${NBSP}₽`)}
                ${kvRow('Объём торгов', `4,8${NBSP}млн ₽`, { text: '−1,20%', up: false })}
              </tk-kv-list>
              <tk-kv-list slot="tab-1">
                ${kvRow('Доходность за год', '18,4%', { text: '+2,1 п.п.', up: true })}
                ${kvRow('Капитализация', `82${NBSP}млрд ₽`)}
                ${kvRow('Комиссия управления', '0,95%')}
              </tk-kv-list>
            </tk-tabs>
          </section>

          <section class="ip-section" aria-labelledby="ip-faq-title">
            <h2 class="ip-section__title" id="ip-faq-title">Частые вопросы</h2>
            <tk-accordion>
              <tk-accordion-item>
                <span slot="summary">Что такое демо-индекс?</span>
                <p>Вымышленный индекс для демонстрации композиции страницы. Это демо-данные, а не инвестиционный продукт.</p>
              </tk-accordion-item>
              <tk-accordion-item>
                <span slot="summary">Как считается стоимость пая?</span>
                <p>В демо-режиме значение вымышленное и обновляется только в составе демонстрационных данных.</p>
              </tk-accordion-item>
              <tk-accordion-item>
                <span slot="summary">Есть ли комиссии?</span>
                <p>В демо-данных указана условная комиссия управления 0,95% — число вымышленное.</p>
              </tk-accordion-item>
            </tk-accordion>
          </section>

          <section class="ip-section" aria-labelledby="ip-news-title">
            <h2 class="ip-section__title" id="ip-news-title">Новости</h2>
            <div class="ip-news">
              <tk-article-card heading="Демо-индекс обновил состав" description="Вымышленный обзор пересмотра состава индекса в демонстрационных целях.">
              </tk-article-card>
              <tk-article-card variant="bluegray" heading="Прогноз по демо-индексу" description="Условный аналитический обзор: вымышленный сценарий на демонстрационный горизонт.">
              </tk-article-card>
            </div>
          </section>
        </div>

        <aside class="ip-sidebar" aria-label="Блоки сделки и профиля">
          <tk-promo-card variant="ticket" label="Демо-индекс RDX">
            <span slot="value">1${NBSP}234,56${NBSP}₽</span>
            <tk-button slot="actions">Купить</tk-button>
            <span slot="note">Демо-цена, вымышленные данные</span>
          </tk-promo-card>

          <tk-publisher-header name="Демо-профиль" meta="12,3${NBSP}тыс. подписчиков">
            ${verifiedChip}${officialChip}
            <tk-button slot="action" size="compact">Подписаться</tk-button>
          </tk-publisher-header>

          <tk-feature-card
            heading="Сводный прогноз"
            description="Вымышленная сводка аналитических сценариев по демо-индексу — демонстрационная карточка."
          >
            <tk-button slot="actions" variant="secondary" size="compact">Все прогнозы</tk-button>
          </tk-feature-card>
        </aside>
      </div>
    </main>
  `,
};
