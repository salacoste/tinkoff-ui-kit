import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../badge/badge.js';
import '../button/button.js';
import '../feature-card/feature-card.js';
import '../tabs/tabs.js';
import type { TkTab } from '../tabs/tabs.js';
import { showToast } from '../toast/show.js';

/**
 * The IPO placements page (spec 24.12, pattern wave 24b): gap-7's richest
 * capture — «Календарь размещений» (month-grouped placement cards: ticker
 * roundel, window dates, the «12–16 ₽» price range, CTA) and «Результаты
 * прошлых размещений» (cards: monogram, «Цена размещения», a pos/neg chip).
 * The FAQ accordion and the financial badge tones already ride the kit
 * (21.1 / 22.2); stat-tiles closed at 24.4 — what remained were the two
 * CARD shapes, both consumer compositions.
 *
 * HEADING LAW (AC2): months are H3 — the calendar is navigated by
  headings, not dividers — under the two H2 section titles (h1 → h2 → h3,
 * no skipped levels). NUMBERS follow the kit convention: RU comma, NBSP
 * digit groups; the delta's SIGN rides the badge CONTENT, color is never
 * the only carrier.
 *
 * THE TABS (live sectioning): the results section switches result vintages
 * with tk-tabs — both PRIMARY surfaces stay in the resting canvas (the
 * calendar above, the default tab's cards below), so the baseline records
 * the whole page shape, not half of it.
 *
 * DATA (the PD gate): tickers, names, windows, prices and percentages are
 * FICTIONAL; the result logos are monogram roundels (the data-table mold),
 * never live logos. Story-canvas styling consumes var(--tk-*) tokens only
 * (FR-1).
 */

type IpoCalendarArgs = Record<string, never>;

const NBSP = '\u00A0';

interface Placement {
  ticker: string;
  name: string;
  window: string;
  range: string;
}

interface IpoResult {
  ticker: string;
  name: string;
  price: string;
  delta: string;
  tone: 'positive' | 'negative';
  variant: 'gray' | 'bluegray' | 'mint' | 'beige';
}

const YEAR_TABS: TkTab[] = [
  { value: 'october', label: 'Октябрь 2026' },
  { value: 'september', label: 'Сентябрь 2026' },
];

const NOVEMBER: Placement[] = [
  { ticker: 'DMPA', name: 'Демо-Петролеум', window: '3–7 ноября 2026', range: `12–16${NBSP}₽` },
  { ticker: 'DMSB', name: 'Демо-СофтБридж', window: '10–14 ноября 2026', range: `78–92${NBSP}₽` },
  { ticker: 'DMGR', name: 'Демо-ГринРейл', window: '17–21 ноября 2026', range: `6,4–7,8${NBSP}₽` },
];

const DECEMBER: Placement[] = [
  { ticker: 'DMMD', name: 'Демо-МедДанные', window: '1–5 декабря 2026', range: `140–170${NBSP}₽` },
  { ticker: 'DMLG', name: 'Демо-ЛогистикПлюс', window: '8–12 декабря 2026', range: `23–27${NBSP}₽` },
];

/* RESULT CARDS keep the tint family — the price+badge readout rides a
   BASE-SURFACE chip (see .ip-result__body): a recorded kit finding — the
   badge's financial text tones are calibrated for neutral surfaces and
   fail axe color-contrast AA directly on feature-card tints. */
const OCTOBER_RESULTS: IpoResult[] = [
  { ticker: 'DMFD', name: 'Демо-ФудДрайв', price: `46,20${NBSP}₽`, delta: `+39,9${NBSP}%`, tone: 'positive', variant: 'mint' },
  { ticker: 'DMTT', name: 'Демо-ТелеТех', price: `112,00${NBSP}₽`, delta: `−6,9${NBSP}%`, tone: 'negative', variant: 'gray' },
  { ticker: 'DMPR', name: 'Демо-ПромРесурс', price: `8,75${NBSP}₽`, delta: `+12,4${NBSP}%`, tone: 'positive', variant: 'bluegray' },
];

const SEPTEMBER_RESULTS: IpoResult[] = [
  { ticker: 'DMEC', name: 'Демо-Экотек', price: `64,00${NBSP}₽`, delta: `+8,1${NBSP}%`, tone: 'positive', variant: 'beige' },
  { ticker: 'DMAT', name: 'Демо-АэроТранс', price: `95,50${NBSP}₽`, delta: `−3,2${NBSP}%`, tone: 'negative', variant: 'gray' },
];

/** The monogram roundel (the data-table 22.3 mold) — never a live logo. */
const roundel = (ticker: string) => html`
  <span
    slot="art"
    style="display:inline-flex;width:40px;height:40px;align-items:center;justify-content:center;border-radius:var(--tk-radius-full);background:var(--tk-color-surface-muted);color:var(--tk-color-text-secondary);font-weight:700"
    aria-hidden="true"
    >${ticker.charAt(2)}</span
  >
`;

const placementCard = (p: Placement) => html`
  <article class="ip-card">
    <div class="ip-card__head">
      <span class="ip-card__disc" aria-hidden="true">${p.ticker.charAt(2)}</span>
      <span class="ip-card__id">
        <span class="ip-card__name">${p.name}</span>
        <span class="ip-card__ticker">${p.ticker}</span>
      </span>
    </div>
    <dl class="ip-card__specs">
      <div class="ip-card__spec">
        <dt>Окно заявок</dt>
        <dd>${p.window}</dd>
      </div>
      <div class="ip-card__spec">
        <dt>Диапазон цены</dt>
        <dd>${p.range}</dd>
      </div>
    </dl>
    <tk-button
      variant="secondary"
      size="compact"
      @click=${() => showToast({ message: 'Заявка — демо-действие без эффекта' })}
      >Подать заявку</tk-button
    >
  </article>
`;

const resultCard = (r: IpoResult) => html`
  <tk-feature-card class="ip-result" variant=${r.variant} heading=${r.name}>
    <span slot="description" class="ip-result__body">
      <span class="ip-result__price">Цена размещения: ${r.price}</span>
      <tk-badge variant=${r.tone}>${r.delta}</tk-badge>
    </span>
    ${roundel(r.ticker)}
  </tk-feature-card>
`;

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
    .ip-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .ip-layout {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-32);
    }
    .ip-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .ip-sub {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .ip-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .ip-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    /* THE MONTH HEADING (AC2): h3 — the calendar is navigated by
       headings; under the section's h2 the order is h1 → h2 → h3. */
    .ip-month {
      margin: var(--tk-space-16) 0 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    /* THE PLACEMENT GRID: an even auto-fit row per month. */
    .ip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--tk-space-16);
    }
    .ip-card {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-24);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .ip-card__head {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    .ip-card__disc {
      width: 40px;
      height: 40px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
      font-weight: 700;
    }
    .ip-card__id {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .ip-card__name {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .ip-card__ticker {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .ip-card__specs {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .ip-card__spec {
      display: flex;
      flex-direction: column;
    }
    .ip-card__spec dt {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .ip-card__spec dd {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    /* THE RESULT CARDS: tk-feature-card tint family; the description
       slot carries the placement price + the financial badge. */
    .ip-results {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--tk-space-16);
    }
    .ip-result__body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-8);
      align-self: flex-start;
      /* The readout chip — the KIT FINDING: the badge's financial text
         tones are calibrated for NEUTRAL surfaces; on feature-card tints
         they fail axe color-contrast AA. The consumer puts the price +
         badge readout back onto a base-surface chip inside the card. */
      padding: var(--tk-space-4) var(--tk-space-8);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-base);
    }
    .ip-result__price {
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
    }
  </style>
`;

const meta: Meta<IpoCalendarArgs> = {
  title: 'Invest/IPO calendar',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<IpoCalendarArgs>;

export const PlacementsPage: Story = {
  name: 'Календарь размещений',
  render: () => html`
    ${canvasStyles}
    <main class="ip-canvas">
      <p class="ip-note">
        Размещения (спека 24.12): «Календарь» — месяц-группированные
        бордер-карточки (монограм-раундэл, имя + тикер, окно заявок,
        диапазон цены «12–16 ₽», CTA secondary compact) и «Результаты» —
        карточки на tk-feature-card (тинт-семейство): лого-слот монограмом
        (молд data-table, без живых лого — ПД), «Цена размещения», чип
        итога tk-badge positive/negative — ЗНАК в контенте, цвет не
        единственный носитель. НАХОДКА КИТА: финансовые текстовые тона
        tk-badge калиброваны под нейтральные поверхности — прямо на
        тинтах feature-card они проваливают axe color-contrast AA,
        поэтому строка «цена + бейдж» едет на нейтральном чипе
        (surface-base) внутри карточки, тинты остаются. ЗАГОЛОВКИ: месяцы — h3 (навигация календаря
        идёт по заголовкам, не по разделителям), секции — h2: порядок
        h1 → h2 → h3 без пропусков. СЕКЦИОННОСТЬ: результаты переключают
        винтаж tk-tabs'ом (живая секционность), обе главные поверхности
        остаются в покоящейся канве — базлайн пишет всю страницу, а не
        половину. Числа — конвенция кита: RU-запятая, NBSP-разряды.
        Клавиатура: Tab — заявки, табы результатов. Обе темы — без правок
        состава. Тикеры, имена, окна, цены и проценты вымышленные.
      </p>
      <div class="ip-layout">
        <h1 class="ip-title">Размещения (демо)</h1>
        <p class="ip-sub">
          Демо-календарь вымышленных размещений: предстоящие окна заявок и
          итоги прошедших. Ничего здесь не является инвестиционной
          рекомендацией.
        </p>
        <section class="ip-section">
          <h2 class="ip-section__title">Календарь размещений</h2>
          <h3 class="ip-month">Ноябрь 2026</h3>
          <div class="ip-grid">${NOVEMBER.map(placementCard)}</div>
          <h3 class="ip-month">Декабрь 2026</h3>
          <div class="ip-grid">${DECEMBER.map(placementCard)}</div>
        </section>
        <section class="ip-section">
          <h2 class="ip-section__title">Результаты прошлых размещений</h2>
          <tk-tabs .tabs=${YEAR_TABS} default-value="october">
            <div class="ip-results" slot="tab-0">${OCTOBER_RESULTS.map(resultCard)}</div>
            <div class="ip-results" slot="tab-1">${SEPTEMBER_RESULTS.map(resultCard)}</div>
          </tk-tabs>
        </section>
      </div>
    </main>
  `,
};
