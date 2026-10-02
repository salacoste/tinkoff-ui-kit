import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './quote-chip.js';

/**
 * tk-quote-chip stories (spec 22.1): playground (all four forms × delta
 * tones), the hub ticker band (the grounding demo — bare chips on a
 * muted band), in-body post chips (inline $TOKEN + pills + the «Ещё 6»
 * overflow), and the API page. The RU decimal comma is pinned in prose —
 * the reference's own «17.25%» vs «16,75%» drift is a consumer-formatting
 * finding, not kit code.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type QuoteChipArgs = {
  variant: 'pill' | 'inline' | 'box' | 'overflow';
  ticker: string;
  name: string;
  price: string;
  delta: string;
  href: string;
};

/**
 * Fictional RU market data (PD-gate: invented values, comma decimals). The
 * demo roundels ride TOKEN fills only (FR-1): consumer logos are real
 * brand marks; the story cannot ship literals.
 */
const INSTRUMENTS = [
  { ticker: 'SBER', name: 'Сбербанк', price: '275,79 ₽', delta: '+3,8%', roundel: 'var(--tk-color-yellow-100)' },
  { ticker: 'LKOH', name: 'Лукойл', price: '6 214,50 ₽', delta: '−1,2%', roundel: 'var(--tk-color-blue-100)' },
  { ticker: 'GAZP', name: 'Газпром', price: '128,04 ₽', delta: '+0,45%', roundel: 'var(--tk-color-red-100)' },
  { ticker: 'YNDX', name: 'Яндекс', price: '4 130 ₽', delta: '−0,12%', roundel: 'var(--tk-color-green-100)' },
  { ticker: 'GMKN', name: 'Норникель', price: '118,9 ₽', delta: '12,7%', roundel: 'var(--tk-color-lightblue-200)' },
  { ticker: 'TCSG', name: 'Т-Технологии', price: '3 012 ₽', delta: '−2,95%', roundel: 'var(--tk-color-yellow-200)' },
  { ticker: 'ROSN', name: 'Роснефть', price: '546,2 ₽', delta: '+0,03%', roundel: 'var(--tk-color-lightblue-300)' },
  { ticker: 'MTSS', name: 'МТС', price: '214,65 ₽', delta: '−5,4%', roundel: 'var(--tk-color-green-200)' },
  { ticker: 'CHMF', name: 'Северсталь', price: '1 245 ₽', delta: '+1,1%', roundel: 'var(--tk-color-gray-200)' },
  { ticker: 'ALRS', name: 'АЛРОСА', price: '58,3 ₽', delta: '−0,75%', roundel: 'var(--tk-color-red-200)' },
] as const;

/**
 * A chip carrying a synthetic TOKEN-fill roundel in its logo slot. The
 * roundel is deliberately TEXT-LESS (aria-hidden): consumer logos are brand
 * marks, and demo letters over saturated fills only manufacture contrast
 * violations the real slot never has — the letter fallback is demonstrated
 * by the slot-less chips below.
 */
const roundelChip = (
  instrument: (typeof INSTRUMENTS)[number],
  variant: 'pill' | 'box' = 'pill',
  href?: string,
) => html`
  <tk-quote-chip
    variant=${variant}
    ticker=${instrument.ticker}
    name=${instrument.name}
    price=${instrument.price}
    delta=${instrument.delta}
    .href=${href}
  >
    <span
      slot="logo"
      aria-hidden="true"
      style="display:block;width:100%;height:100%;border-radius:var(--tk-radius-full);background:${instrument.roundel}"
    ></span>
  </tk-quote-chip>
`;

const canvasStyles = html`
  <style>
    .tkqc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while text remaps to white (5.4 dark-sweep
         finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkqc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkqc-canvas .tkqc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkqc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkqc-canvas figure {
      margin: 0 0 var(--tk-space-16);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tkqc-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkqc-canvas .tkqc-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-16);
    }
    /* The ticker band demo: bare chips on a horizontally scrollable strip.
       The LIVE hub band rides a muted gray strip — but the delta pair is
       AA-sanctioned on surface-base ONLY (the tokens' own ruling: green-300
       fails surface-muted at 4.210:1), so the demo holds the sanction and
       the prose records the deviation. */
    .tkqc-canvas .tkqc-band {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--tk-space-48);
      max-width: 100%;
      padding: var(--tk-space-16) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      overflow-x: auto;
    }
    .tkqc-canvas .tkqc-post {
      max-width: var(--tk-space-container);
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkqc-canvas .tkqc-post p {
      margin: 0;
    }
    .tkqc-canvas .tkqc-post .tkqc-inline-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-8);
    }
    .tkqc-canvas td,
    .tkqc-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkqc-canvas code {
      font-family: var(--tk-font-mono);
    }
  </style>
`;

const meta: Meta<QuoteChipArgs> = {
  title: 'Components/QuoteChip',
  component: 'tk-quote-chip',
  args: {
    variant: 'pill',
    ticker: 'SBER',
    name: 'Сбербанк',
    price: '275,79 ₽',
    delta: '+3,8%',
    href: '/invest/stocks/SBER',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['pill', 'inline', 'box', 'overflow'],
      description:
        'Форма чипа: pill — мини-котировка (раундэл + жирная цена + цветная Δ%, лента хаба); inline — синий $TOKEN в тексте поста; box — вложение-виджет в светлом скруглённом контейнере; overflow — светло-голубая пилюля «Ещё N» (счётчик — контент слота).',
    },
    ticker: { control: 'text', description: 'Тикер инструмента — обязателен; текст inline-формы, источник буквенного раундэла, запасная строка цены.' },
    name: { control: 'text', description: 'Полное название инструмента — всплывающая подсказка ссылки, не рендерится в чипе.' },
    price: { control: 'text', description: 'Готовая строка цены: кит не форматирует (RU-запятая — конвенция консьюмера).' },
    delta: { control: 'text', description: 'Строка дельты со знаком: «+3,8%» / «−0,12%»; знак первого символа задаёт цвет (+ зелёный, − красный, без знака нейтральный).' },
    href: { control: 'text', description: 'Ссылка на страницу инструмента: задана — чип настоящий <a>, нет — показывающий span.' },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<QuoteChipArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkqc-canvas">
      <h1>QuoteChip</h1>
      <p class="tkqc-note">
        Семейство рыночных чипов (GAP-MAP A3 — единственный ответ кита на
        весь раздел живого). Дельта-цвет выводится из знака строки — цвет не
        единственный носитель semantics. Токены
        <code>--tk-color-delta-positive/negative</code> несут AA-пары
        (живые сырые зелёный/красный отклонены — записаны в шапке стилей).
        Десятичная запятая — конвенция консьюмера: живой дрейфает между
        «17.25%» и «16,75%».
      </p>
      <figure>
        <figcaption>Текущие аргументы</figcaption>
        <tk-quote-chip
          variant=${args.variant}
          ticker=${args.ticker}
          name=${args.name}
          price=${args.price}
          delta=${args.delta}
          .href=${args.href || undefined}
          ><span slot="logo" aria-hidden="true"
            >СБ</span
          ></tk-quote-chip
        >
      </figure>
      <h2>Формы × тоны дельты</h2>
      ${(['pill', 'box'] as const).map(
        (variant) => html`
          <figure>
            <figcaption>variant="${variant}" — раундэл-слот, буквенный fallback, три тона</figcaption>
            <div class="tkqc-row">
              ${roundelChip({ ...INSTRUMENTS[0], delta: '+3,8%' }, variant)}
              ${roundelChip({ ...INSTRUMENTS[1], delta: '−1,2%' }, variant)}
              ${roundelChip({ ...INSTRUMENTS[4], delta: '12,7%' }, variant)}
              <tk-quote-chip
                variant=${variant}
                ticker="MOEX"
                name="Мосбиржа"
                price="188,4 ₽"
                delta="+0,9%"
              ></tk-quote-chip>
            </div>
          </figure>
        `,
      )}
      <figure>
        <figcaption>variant="inline" — $TOKEN в строке</figcaption>
        <p>
          Референс вставляет тикеры прямо в прозу поста:
          <tk-quote-chip variant="inline" ticker="sber" .href=${'/invest/stocks/SBER'}></tk-quote-chip>
          и
          <tk-quote-chip variant="inline" ticker="lkoh" .href=${'/invest/stocks/LKOH'}></tk-quote-chip>
          — синие, капсом, без подложки.
        </p>
      </figure>
      <figure>
        <figcaption>variant="overflow" — «Ещё N» замыкает ряд чипов</figcaption>
        <div class="tkqc-row">
          ${roundelChip(INSTRUMENTS[0])}
          ${roundelChip(INSTRUMENTS[1])}
          <tk-quote-chip variant="overflow" .href=${'/invest'}>Ещё 6</tk-quote-chip>
        </div>
      </figure>
      <h2>Тёмная тема</h2>
      <figure>
        <figcaption>Штатные пары — дельта-токены несут тёмные ремапы сами</figcaption>
        <div
          class="tkqc-row"
          style="background:var(--tk-color-surface-base);padding:var(--tk-space-24);border-radius:var(--tk-radius-md)"
        >
          ${roundelChip(INSTRUMENTS[0])}
          ${roundelChip(INSTRUMENTS[3])}
          <tk-quote-chip variant="overflow" .href=${'/invest'}>Ещё 6</tk-quote-chip>
        </div>
      </figure>
    </main>
  `,
};

export const TickerBand: Story = {
  name: 'Тикерная лента',
  render: () => html`
    ${canvasStyles}
    <main class="tkqc-canvas">
      <h1>Тикерная лента</h1>
      <p class="tkqc-note">
        Заземление research-хаба: полоса ~10 голых чипов (раундэл 24px, гэп
        6px, цена ~13px semibold, дельта ~11px) под суб-навигацией. Ряд — НЕ
        элемент кита: контейнер потребителя с горизонтальным скроллом (спека
        22.1: rail не минтуется). Две девиации держит демо: живая полоса
        серая (surface-muted) с сырыми дельтами, проваливающими AA — кит
        держит санкцию дельт на surface-base, полоса демо на базовой
        поверхности;
        питч 136px живого задают декоративные стебли-глифы между чипами —
        хром страницы, вне скоупа атома, демо ставит токенный гэп.
      </p>
      <div class="tkqc-band" role="group" aria-label="Котировки инструментов">
        ${INSTRUMENTS.map((instrument) => roundelChip(instrument, 'pill', '/invest'))}
      </div>
      <h2>Буквенный fallback</h2>
      <figure>
        <figcaption>Пустой слот лого — раундэл из первой буквы тикера (молд карусели)</figcaption>
        <div class="tkqc-row">
          ${INSTRUMENTS.slice(0, 5).map(
            (instrument) => html`
              <tk-quote-chip
                ticker=${instrument.ticker}
                name=${instrument.name}
                price=${instrument.price}
                delta=${instrument.delta}
                .href=${'/invest'}
              ></tk-quote-chip>
            `,
          )}
        </div>
      </figure>
    </main>
  `,
};

export const InBodyChips: Story = {
  name: 'Чипы в теле поста',
  render: () => html`
    ${canvasStyles}
    <main class="tkqc-canvas">
      <h1>Чипы в теле поста</h1>
      <p class="tkqc-note">
        Заземление stock-sber-pulse: инлайн-полосы из 2–3 мини-котировок
        внутри текста, замыкаемые светло-голубой пилюлей «Ещё 6». Обёртка
        ряда — потребитель; кит даёт формы. Цены вымышленные (ПД-гейт).
      </p>
      <article class="tkqc-post">
        <p>
          Отчёт за квартал: дивидендный гэп
          <tk-quote-chip variant="inline" ticker="sber" .href=${'/invest/stocks/SBER'}></tk-quote-chip>
          закрыли за две сессии, а
          <tk-quote-chip variant="inline" ticker="gazp" .href=${'/invest/stocks/GAZP'}></tk-quote-chip>
          держит коридор. Портфельные веса пересобраны:
        </p>
        <div class="tkqc-inline-row">
          ${roundelChip(INSTRUMENTS[0])}
          ${roundelChip(INSTRUMENTS[2])}
          <tk-quote-chip variant="overflow" .href=${'/invest'}>Ещё 6</tk-quote-chip>
        </div>
        <p>
          Вложение-виджет одиночной котировки — форма box: тот же корпус
          цена+дельта в светлом скруглённом контейнере.
        </p>
        ${roundelChip(INSTRUMENTS[1], 'box', '/invest/stocks/LKOH')}
      </article>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`
    ${canvasStyles}
    <main class="tkqc-canvas">
      <h1>QuoteChip API</h1>
      ${apiReferenceDoc('tk-quote-chip')}
    </main>
  `,
};
