import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../carousel/carousel.js';

/**
 * The «Другие бумаги компании» rail (spec 24.14, pattern wave 24b):
 * gap-2's bond page side section — a tk-carousel of SAME-ISSUER
 * securities cards on the instrument page. tk-carousel has ridden the
 * kit since 21.6; what remained was the card anatomy: name + ticker,
 * TWO stat blocks (price + Δ%), and the navigation.
 *
 * THE CARD IS ONE ANCHOR (AC4): the whole card is a native <a> whose
 * accessible name computes from its VISIBLE semantics — name, ticker,
 * both stat labels and values all read into the link name, satisfying
 * «имя + тикер + статы» without an aria-label duplication. A tk-link
 * INSIDE the card would nest interactive elements (the legal-doc 24.9
 * lesson) — the card-level anchor replaces the link row entirely.
 *
 * THE STATS (AC2): price (RU format, NBSP groups) and Δ% on the
 * 22.1/22.2 delta tokens — the sign rides the CONTENT, color is never
 * the sole carrier; the tokens stay sanctioned on surface-base (the
 * cards are bordered surface-base boxes, no fills — the 24.12 readout
 * finding respected by construction). NO monospace alignments — the
 * kit's number convention is body digits.
 *
 * RAIL GEOMETRY (AC3): the card width is the live ticket rail's 247px
 * (the 22.6 mold); scroll-snap, chevrons and dots are tk-carousel's
 * own contract, untouched. Under 1024px the page grid collapses to a
 * single column — the rail becomes an ordinary section.
 *
 * DATA (the PD gate): every security, price and delta below is
 * FICTIONAL. Story-canvas styling consumes var(--tk-*) tokens only
 * (FR-1).
 */

type SecuritiesRailArgs = Record<string, never>;

const NBSP = '\u00A0';

interface RailSecurity {
  name: string;
  ticker: string;
  price: string;
  delta: string;
  tone: 'positive' | 'negative';
}

const SECURITIES: RailSecurity[] = [
  { name: 'Демо-Облигация Бридж 01', ticker: 'DMBR01', price: `998,40${NBSP}₽`, delta: `+0,12${NBSP}%`, tone: 'positive' },
  { name: 'Демо-Облигация Бридж 03', ticker: 'DMBR03', price: `1${NBSP}004,10${NBSP}₽`, delta: `+0,05${NBSP}%`, tone: 'positive' },
  { name: 'Демо-Акция Бридж', ticker: 'DMBG', price: `228,70${NBSP}₽`, delta: `+1,7${NBSP}%`, tone: 'positive' },
  { name: 'Демо-Облигация Бридж 04', ticker: 'DMBR04', price: `1${NBSP}012,50${NBSP}₽`, delta: `−0,08${NBSP}%`, tone: 'negative' },
  { name: 'Демо-Вексель Бридж', ticker: 'DMBX', price: `940,00${NBSP}₽`, delta: `−0,3${NBSP}%`, tone: 'negative' },
];

/** The card affordance chevron — currentColor, decorative. */
const CHEVRON = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

const canvasStyles = html`
  <style>
    .sr-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .sr-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE PAGE GRID (the 23.4 instrument mold): fluid main + the 247px
       rail — the live ticket width (22.6); collapses under 1024px to a
       single column, the rail becoming an ordinary section (AC3). */
    .sr-layout {
      max-width: 960px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 247px;
      gap: var(--tk-space-32);
      align-items: start;
    }
    @media (max-width: 1023px) {
      .sr-layout {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    .sr-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .sr-sub {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .sr-section__title {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .sr-rail {
      display: flex;
      flex-direction: column;
    }
    /* THE CARD (consumer chrome): bordered surface-base box at the rail
       width, ONE anchor for the whole card. */
    .sr-card {
      box-sizing: border-box;
      width: 247px;
      flex: none;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-base);
      color: var(--tk-color-text-primary);
      text-decoration: none;
    }
    .sr-card:hover {
      border-color: var(--tk-color-border-strong);
    }
    .sr-card:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    .sr-card__head {
      display: flex;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .sr-card__id {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .sr-card__name {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .sr-card__ticker {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .sr-card__chevron {
      margin-left: auto;
      flex: none;
      margin-top: var(--tk-space-4);
      color: var(--tk-color-text-secondary);
    }
    .sr-card:hover .sr-card__chevron {
      color: var(--tk-color-text-primary);
    }
    /* THE TWO STATS (AC2): price + Δ% side by side, label over value;
       the delta rides its token with the SIGN in the content. */
    .sr-card__stats {
      display: flex;
      gap: var(--tk-space-24);
    }
    .sr-card__stat {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
    }
    .sr-card__label {
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .sr-card__value {
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
    .sr-card__value--positive {
      color: var(--tk-color-delta-positive);
    }
    .sr-card__value--negative {
      color: var(--tk-color-delta-negative);
    }
  </style>
`;

const railCard = (s: RailSecurity) => html`
  <a class="sr-card" href="#">
    <span class="sr-card__head">
      <span class="sr-card__id">
        <span class="sr-card__name">${s.name}</span>
        <span class="sr-card__ticker">${s.ticker}</span>
      </span>
      <span class="sr-card__chevron">${CHEVRON}</span>
    </span>
    <span class="sr-card__stats">
      <span class="sr-card__stat">
        <span class="sr-card__label">Цена</span>
        <span class="sr-card__value">${s.price}</span>
      </span>
      <span class="sr-card__stat">
        <span class="sr-card__label">Изм. дня</span>
        <span class="sr-card__value sr-card__value--${s.tone}">${s.delta}</span>
      </span>
    </span>
  </a>
`;

const meta: Meta<SecuritiesRailArgs> = {
  title: 'Invest/Securities rail',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SecuritiesRailArgs>;

export const OtherSecurities: Story = {
  name: 'Другие бумаги компании',
  render: () => html`
    ${canvasStyles}
    <main class="sr-canvas">
      <p class="sr-note">
        Рейл «Другие бумаги компании» (спека 24.14): сайд-секция страницы
        инструмента — tk-carousel (атом 21.6, контракт нетронут: снап,
        шевроны, точки) с карточками бумаг того же эмитента. КАРТОЧКА —
        ОДИН ЯКОРЬ: вся карточка — нативная ссылка, доступное имя
        собирается из видимой семантики (имя + тикер + оба стата
        читаются в имя ссылки); tk-link внутри карточки вкладывал бы
        интерактив в интерактив (урок legal-doc 24.9) — карточечный
        якорь заменяет строку-ссылку. ДВА СТАТА: цена (RU-формат, NBSP
        разряды) и Δ% на дельта-токенах 22.1/22.2 — ЗНАК в контенте,
        цвет не единственный носитель; токены санкционированы на
        surface-base — карточки бордерные, без заливок (находка 24.12
        учтена конструкцией). Моноширинных выравниваний НЕТ — числовая
        конвенция кита. ГЕОМЕТРИЯ: ширина карточки — 247px рейла
        (молд 22.6), высота ряда стабильна; ниже 1024px страница
        складывается в одну колонку, рейл — обычная секция. Клавиатура:
        Tab — якоря карточек; прокрутка рейла — стрелки внутри региона,
        шевроны — контракт атома. Обе темы — без правок состава. Все
        бумаги, цены и дельты вымышленные.
      </p>
      <div class="sr-layout">
        <div>
          <h1 class="sr-title">Демо-Облигация Бридж 02 (демо)</h1>
          <p class="sr-sub">
            Вымышленная страница инструмента: слева — контент бумаги,
            справа — рейл других бумаг того же демо-эмитента. Всё на
            этой странице — иллюстрация жанра, не оффер.
          </p>
        </div>
        <aside class="sr-rail">
          <h2 class="sr-section__title">Другие бумаги компании</h2>
          <tk-carousel label="Другие бумаги компании">
            ${SECURITIES.map(railCard)}
          </tk-carousel>
        </aside>
      </div>
    </main>
  `,
};
