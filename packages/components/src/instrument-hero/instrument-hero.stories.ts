import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './instrument-hero.js';

/**
 * tk-instrument-hero stories (spec 22.5): the instrument page's identity
 * card — the four measured gradient families (stock/bond/dark/light), the
 * metric block that may be empty (the etf/currency anatomy), the logo disc
 * and the consumer's favorite-star action slot, plus the CEM API table.
 *
 * Grounding (five-hero pass, captures-v4/invest + pixel arbitration):
 * radius 24px = radius-xl; padding 27–28px → space-24 (+3 recorded); name
 * ≈26–27px bold 700 → heading-4 28px + the live 700 (register deviation
 * recorded); ticker ~12–13px 50% white → body-s at FULL white (the AA-max
 * raise, recorded); metric label 13px 85% → body-s full color (the same
 * raise); value 15–16px semibold → body-m bold; logo disc 94–98px → 96px
 * capture literal, right inset ≈46px → space-48; gradients = the 22.5
 * invest identity stop tokens (AA ratios pinned in TOKENS.md — body-s on
 * the green a-stops is RECORDED-FAILING, the identity fill is immutable).
 * Fictional instruments throughout (the PD gate).
 *
 * The star is a SLOT BUTTON — consumer state (the kit never knows the
 * portfolio). The name is a DIV; the demo slots a real h2 to show the
 * heading-semantics channel.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

const canvasStyles = html`
  <style>
    .tih-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tih-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tih-canvas .tih-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tih-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tih-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tih-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tih-canvas .tih-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(430px, 1fr));
      gap: var(--tk-space-24);
      align-items: start;
    }
    /* Consumer-side monogram disc (the quote-chip letter rule): a neutral
       stand-in for brand assets — the kit stays brand-neutral (PD). */
    .tih-canvas .tih-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-gray-100);
      color: var(--tk-color-gray-600);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
    }
    /* The favorite star — the consumer's own slot button (state included). */
    .tih-canvas .tih-star {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      border-radius: var(--tk-radius-full);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .tih-canvas .tih-star:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
  </style>
`;

/** The outline-star slot button (a consumer widget — state lives here).
 *  Rides slot="action" — a bare default-slot child renders nothing (the
 *  template carries no default slot); the review-lens round caught the
 *  first draft dropping the attribute, leaving all four cards starless. */
const starButton = html`
  <button class="tih-star" slot="action" type="button" aria-label="Добавить в избранное" aria-pressed="false">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8L12 3.6z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
  </button>
`;

const meta: Meta = {
  title: 'Components/InstrumentHero',
  component: 'tk-instrument-hero',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tih-canvas">
      <h1>InstrumentHero</h1>
      <p class="tih-note">
        Карточка-герой инструментальной страницы: имя и тикер на градиенте
        класса актива, опциональный блок метрики слева внизу, круглый
        лого-диск у правого края, звезда избранного — слот-кнопка
        консьюмера (кит не владеет состоянием портфеля). Четыре замеренных
        семейства градиентов (<code>stock | bond | dark | light</code>) едут
        на токенах invest-идентичности 22.5; имя — DIV, не заголовок: уровень
        заголовка — структура документа консьюмера (слот
        <code>name</code> принимает настоящую h-ноду). Метрика рендерится
        только когда слот <code>metric</code> несёт контент — у ETF и валют
        метрики нет. Атом статичен — событий нет.
      </p>
      <figure>
        <div class="tih-grid">
          <tk-instrument-hero name="ТехноПром" ticker="TPRG" tone="stock" metric-label="Доходность за полгода">
            ${starButton}
            <span class="tih-logo" slot="logo">Т</span>
            <span slot="metric">−12,86%</span>
          </tk-instrument-hero>
          <tk-instrument-hero name="Венчурные инвестиции 1" ticker="TVEN" tone="dark">
            ${starButton}
            <span class="tih-logo" slot="logo">В</span>
          </tk-instrument-hero>
          <tk-instrument-hero name="Доллар Кондора" ticker="KDCN" tone="light">
            ${starButton}
            <span class="tih-logo" slot="logo">$</span>
          </tk-instrument-hero>
          <tk-instrument-hero
            name="Фьючерс на вымышленный индекс"
            ticker="IDXZ6"
            tone="dark"
            metric-label="Тип контракта"
          >
            ${starButton}
            <span class="tih-logo" slot="logo">И</span>
            <span slot="metric">Расчетный</span>
          </tk-instrument-hero>
        </div>
        <figcaption>
          четыре семейства: stock с метрикой и тикером / dark без метрики
          (анатомия ETF) / light без метрики (валюта, текст инвертируется в
          ink) / dark с метрикой; звезда — слот-кнопка, лого — нейтральный
          монограммный диск (бренд-ассеты — собственность консьюмера)
        </figcaption>
      </figure>
    </main>
  `,
};

export const Bond: Story = {
  name: 'Облигация',
  render: () => html`
    ${canvasStyles}
    <main class="tih-canvas">
      <h1>Облигация</h1>
      <p class="tih-note">
        Заземление — герой страницы облигации (invest-хаб): изумрудный
        диагональный градиент (135°, стопы живого замера — в ките токены
        invest-bond-a/b), имя ≈26–27px полужирное, ISIN мелким
        рядом, «Доходность к погашению» лейблом над значением, эмблема-диск
        справа по центру, звезда-контур в правом верхнем углу. Имя здесь
        продемонстрировано слотом с настоящей h2 — канал семантики заголовка;
        ISIN и цифры вымышленные (ПД-гейт).
      </p>
      <figure>
        <tk-instrument-hero tone="bond" ticker="RU000A0DM027" metric-label="Доходность к погашению">
          <h2 slot="name">ТехноБонд-2027</h2>
          ${starButton}
          <span class="tih-logo" slot="logo">Т</span>
          <span slot="metric">15,76% на 8 месяцев</span>
        </tk-instrument-hero>
        <figcaption>
          «Облигация» (22.5): слот name с настоящей h2 (семантика заголовка —
          консьюмер), тикер-ISIN вымышленный, метрика «Доходность к
          погашению», монограммный диск-заглушка вместо эмблемы
        </figcaption>
      </figure>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-instrument-hero'),
};
