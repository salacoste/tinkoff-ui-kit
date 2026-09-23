import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import './promo-card.js';

/**
 * tk-promo-card stories (spec 3.6): playground (the reference's tinted
 * promo grid — cards are grid-agnostic blocks; the grid template is the
 * CONSUMER layout), variant states (all five tints incl. the charcoal
 * white pairing, skeleton, prop-absent clamps), theming demo, and the
 * a11y notes with the keyboard-only checklist.
 *
 * The CTA is a COMPOSED tk-button secondary (white pill) slotted into
 * `actions` — the card is passive, the CTA carries the action. Art demo
 * blocks are token-drawn (no <img> — the visual harness stays
 * deterministic; real art lazy-loads via the slotchange enforcement).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type CardArgs = {
  variant: 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';
  heading: string;
  description: string;
  skeleton: boolean;
};

/** Token-drawn art stand-in (deterministic for the visual harness). */
const artDemo = html`
  <div class="tkpc-art" slot="art">
    <span class="tkpc-art__disc"></span>
  </div>
`;

const cardCanvas = (args: Partial<CardArgs> = {}, { art = true } = {}) => html`
  <tk-promo-card
    variant=${args.variant ?? 'gray'}
    heading=${args.heading ?? 'Т-Мобайл'}
    description=${args.description ?? 'Связь, интернет и подписки в одном тарифе'}
    ?skeleton=${args.skeleton ?? false}
  >
    ${art ? artDemo : ''}
    <tk-button slot="actions" variant="secondary" size="card">Подробнее</tk-button>
  </tk-promo-card>
`;

const canvasStyles = html`
  <style>
    .tkpc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkpc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkpc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkpc-canvas .tkpc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkpc-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* 2-up/3-up grids are the CONSUMER layout — the cards are grid-agnostic
       blocks (the spec's Design Notes); the story demonstrates the template. */
    .tkpc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--tk-space-20);
      max-width: var(--tk-space-container);
    }
    .tkpc-canvas figure {
      margin: 0;
    }
    .tkpc-art {
      aspect-ratio: 4 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-base);
    }
    .tkpc-art__disc {
      width: var(--tk-space-96);
      height: var(--tk-space-96);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-yellow-100);
    }
    .tkpc-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkpc-canvas td,
    .tkpc-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
  </style>
`;

const meta: Meta<CardArgs> = {
  title: 'Components/PromoCard',
  component: 'tk-promo-card',
  args: {
    variant: 'gray',
    heading: 'Т-Мобайл',
    description: 'Связь, интернет и подписки в одном тарифе',
    skeleton: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['gray', 'bluegray', 'mint', 'beige', 'charcoal'],
      description: 'Тон поверхности; он же решает пару текста (пастель — тёмный, charcoal — белый).',
    },
    heading: { control: 'text', description: 'Заголовок (heading-5); слот heading перекрывает.' },
    description: { control: 'text', description: 'Описание (body-m); слот description перекрывает.' },
    skeleton: { control: 'boolean', description: 'Скелетон: серые gray-200 блоки вместо контента.' },
  },
};

export default meta;

type Story = StoryObj<CardArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkpc-canvas">
      <h1>PromoCard</h1>
      <p class="tkpc-note">
        Пастельная маркетинговая карточка эталона: радиус xxl 32, паддинг 32,
        тонированная плоская поверхность (без теней), арт-слот сверху с
        принудительным lazy, белая пилюля CTA снизу по центру — CTA это
        слотленный tk-button secondary, карточка пассивна. Пара текста
        выбирается тоном автоматически.
      </p>
      <div class="tkpc-grid">
        ${cardCanvas(args)}
        ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Страховка за 2 минуты' })}
        ${cardCanvas({ variant: 'beige', heading: 'Т-Образование', description: 'Курсы и вебинары' })}
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkpc-canvas">
      <h1>Состояния</h1>
      <p class="tkpc-note">
        Пять тонов: серый / сине-серый / мята / беж / charcoal. На пастелях —
        тёмный текст (text-primary/text-secondary), на charcoal — белый.
        Неизвестный тон клампится к gray. Скелетон — статичные gray-200
        блоки, повторяющие финальный макет.
      </p>
      <section>
        <h2>Все тона</h2>
        <div class="tkpc-grid">
          ${cardCanvas({ variant: 'gray', heading: 'Вклады', description: 'До 16% годовых' })}
          ${cardCanvas({ variant: 'bluegray', heading: 'Т-Инвестиции', description: 'Портфель под цель' })}
          ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Страховка за 2 минуты' })}
          ${cardCanvas({ variant: 'beige', heading: 'Т-Образование', description: 'Курсы и вебинары' })}
          ${cardCanvas({ variant: 'charcoal', heading: 'Платинум', description: 'Премиальное обслуживание' })}
        </div>
      </section>
      <section>
        <h2>Скелетон</h2>
        <div class="tkpc-grid">
          ${cardCanvas({ skeleton: true })}
          ${cardCanvas({ variant: 'beige', skeleton: true })}
        </div>
      </section>
      <section>
        <h2>Без арта и без описания (макет держится)</h2>
        <div class="tkpc-grid">
          ${cardCanvas({ heading: 'Без арта', description: 'Арт-слот пуст' }, { art: false })}
          ${cardCanvas({ heading: 'Только заголовок' }, { art: false })}
        </div>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkpc-canvas">
      <h1>Темизация</h1>
      <p class="tkpc-note">
        Тёмная тема — контрол Theme в тулбаре: ни одной ветки темы в коде,
        тон-токены перекрашиваются слоем <code>[data-theme="dark"]</code>.
        Charcoal тон-инвариантен, белая пара остаётся; его CTA-пилюля
        держит белый с чернильным текстом в ОБЕИХ темах через ПАРУ хуков
        <code>--tk-promo-card-cta-fill</code> (белый) /
        <code>--tk-promo-card-cta-text</code> (ink-300) — перекрывайте
        вместе. Хуки по грамматике <code>--tk-promo-card-*</code>:
        <code>--tk-promo-card-fill</code>,
        <code>--tk-promo-card-text</code>,
        <code>--tk-promo-card-text-muted</code>,
        <code>--tk-promo-card-radius</code>,
        <code>--tk-promo-card-padding</code>,
        <code>--tk-promo-card-padding-mobile</code>,
        <code>--tk-promo-card-cta-fill</code>,
        <code>--tk-promo-card-cta-text</code>.
      </p>
      <div class="tkpc-grid">
        ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Мята — измеренное значение эталона' })}
        ${cardCanvas({ variant: 'charcoal', heading: 'Платинум', description: 'Charcoal — белая пара' })}
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkpc-canvas">
      <h1>Доступность</h1>
      <p class="tkpc-note">
        Карточка — пассивная поверхность: без роли, без tabindex, без
        обработчика клика; действие несёт CTA (слотленный tk-button —
        нативный фокус, кольцо 2px, цель ≥44px). Заголовок — настоящий h3.
        Арт-слот декоративен: ответственность за alt на потребителе. Скелетон
        помечает контейнер aria-busy, блоки aria-hidden.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code></td>
            <td>Фокус проходит только по CTA — карточка не останавливает таб.</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code></td>
            <td>Нативная активация tk-button; клик по телу карточки ничего не делает.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>Объявляет статью, h3-заголовок и кнопку по имени; состояний у карточки нет.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkpc-grid">
        ${cardCanvas({ variant: 'bluegray', heading: 'Т-Инвестиции', description: 'Портфель под цель' })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkpc-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером (запись в deferred-work.md). Каждое
        расхождение с ожидаемым объявлением — дефект, а не особенность.
      </p>

      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Линейное чтение</td>
            <td>карта НЕ интерактивна: заголовок «Платинум, заголовок 3 уровня», затем описание</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>единственная остановка — CTA-кнопка: «Оформить, кнопка»; сама карта в порядке табуляции отсутствует</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
