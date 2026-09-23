import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import './feature-card.js';

/**
 * tk-feature-card stories (spec 3.7): playground (the 2-up banner scale —
 * min-height 320, grid template is the CONSUMER layout), variant states
 * (pastels + the charcoal EDITORIAL variant with right-bleed art, skeleton,
 * prop-absent clamps), theming demo, and the a11y notes with the
 * keyboard-only checklist.
 *
 * The CTA is a COMPOSED tk-button secondary slotted into `actions` — the
 * card is passive. Editorial art stand-ins are token-drawn blocks filling
 * the bleed column (deterministic for the visual harness).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type CardArgs = {
  variant: 'gray' | 'bluegray' | 'mint' | 'beige' | 'editorial';
  heading: string;
  description: string;
  skeleton: boolean;
};

/** Token-drawn bleed-art stand-in (fills the editorial right column). */
const bleedArt = html`
  <div class="tkfc-bleed" slot="art">
    <span class="tkfc-bleed__disc"></span>
  </div>
`;

const cardCanvas = (args: Partial<CardArgs> = {}, { art = false } = {}) => html`
  <tk-feature-card
    variant=${args.variant ?? 'gray'}
    heading=${args.heading ?? 'Т-Ж'}
    description=${args.description ?? 'Журнал про деньги и жизнь — истории каждый день'}
    ?skeleton=${args.skeleton ?? false}
  >
    ${art ? bleedArt : ''}
    <tk-button slot="actions" variant="secondary" size="card">Читать журнал</tk-button>
  </tk-feature-card>
`;

const canvasStyles = html`
  <style>
    .tkfc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkfc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkfc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkfc-canvas .tkfc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkfc-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* The 2-up scale — consumer grid template; the cards are grid-agnostic blocks. */
    .tkfc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: var(--tk-space-20);
      max-width: var(--tk-space-container);
    }
    .tkfc-canvas figure {
      margin: 0;
    }
    .tkfc-bleed {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      background: var(--tk-color-surface-muted);
    }
    .tkfc-bleed__disc {
      width: var(--tk-space-96);
      height: var(--tk-space-96);
      margin: var(--tk-space-24);
      border-radius: var(--tk-radius-full);
      background: var(--tk-color-yellow-100);
    }
    .tkfc-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkfc-canvas td,
    .tkfc-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
  </style>
`;

const meta: Meta<CardArgs> = {
  title: 'Components/FeatureCard',
  component: 'tk-feature-card',
  args: {
    variant: 'gray',
    heading: 'Т-Ж',
    description: 'Журнал про деньги и жизнь — истории каждый день',
    skeleton: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['gray', 'bluegray', 'mint', 'beige', 'editorial'],
      description:
        'Тон поверхности; editorial = charcoal-баннер с белой парой и арт-под-обрез справа.',
    },
    heading: { control: 'text', description: 'Заголовок (heading-4); слот heading перекрывает.' },
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
    <main class="tkfc-canvas">
      <h1>FeatureCard</h1>
      <p class="tkfc-note">
        Большая 2-up карточка эталона: радиус xxl 32, минимальная высота 320,
        заголовок heading-4. Editorial-вариант — charcoal-баннер: белый
        заголовок, белая пилюля CTA, арт под-обрез СПРАВА (двухколоночный
        грид, скругление режет вылет). CTA — слотленный tk-button secondary;
        карточка пассивна.
      </p>
      <div class="tkfc-grid">
        ${cardCanvas(args)}
        ${cardCanvas(
          {
            variant: 'editorial',
            heading: 'Платинум',
            description: 'Премиальное обслуживание и кэшбэк до 10%',
          },
          { art: true },
        )}
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkfc-canvas">
      <h1>Состояния</h1>
      <p class="tkfc-note">
        Пастели с тёмной парой + editorial (charcoal, белая пара, вылет арта
        справа). Неизвестный тон клампится к gray. Скелетон — статичные
        gray-200 блоки макета.
      </p>
      <section>
        <h2>Тона</h2>
        <div class="tkfc-grid">
          ${cardCanvas({ variant: 'bluegray', heading: 'Т-Инвестиции', description: 'Портфель под цель' })}
          ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Страховка за 2 минуты' })}
        </div>
      </section>
      <section>
        <h2>Editorial с вылетом арта</h2>
        <div class="tkfc-grid">
          ${cardCanvas(
            { variant: 'editorial', heading: 'Платинум', description: 'Премиальное обслуживание' },
            { art: true },
          )}
          ${cardCanvas({ variant: 'editorial', heading: 'Т-Ж', description: 'Текстовый баннер без арта' })}
        </div>
      </section>
      <section>
        <h2>Скелетон</h2>
        <div class="tkfc-grid">
          ${cardCanvas({ skeleton: true })}
          ${cardCanvas({ variant: 'editorial', skeleton: true })}
        </div>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkfc-canvas">
      <h1>Темизация</h1>
      <p class="tkfc-note">
        Тёмная тема — контрол Theme в тулбаре: веток темы в коде нет,
        тон-токены перекрашиваются слоем <code>[data-theme="dark"]</code>;
        editorial остаётся charcoal (тон-инвариант) с белой парой; его
        CTA-пилюля держит белый с чернильным текстом в ОБЕИХ темах через
        ПАРУ хуков <code>--tk-feature-card-cta-fill</code> (белый) /
        <code>--tk-feature-card-cta-text</code> (ink-300) — перекрывайте
        вместе. Хуки <code>--tk-feature-card-*</code>:
        <code>--tk-feature-card-fill</code>,
        <code>--tk-feature-card-text</code>,
        <code>--tk-feature-card-text-muted</code>,
        <code>--tk-feature-card-radius</code>,
        <code>--tk-feature-card-padding</code>,
        <code>--tk-feature-card-padding-mobile</code>,
        <code>--tk-feature-card-min-height</code>,
        <code>--tk-feature-card-cta-fill</code>,
        <code>--tk-feature-card-cta-text</code>.
      </p>
      <div class="tkfc-grid">
        ${cardCanvas({ variant: 'beige', heading: 'Т-Образование', description: 'Курсы и вебинары' })}
        ${cardCanvas(
          { variant: 'editorial', heading: 'Платинум', description: 'Белая пара на charcoal' },
          { art: true },
        )}
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkfc-canvas">
      <h1>Доступность</h1>
      <p class="tkfc-note">
        Карточка пассивна: без роли, без tabindex, без клика — действие несёт
        CTA (слотленный tk-button, нативный фокус, кольцо 2px, цель ≥44px).
        Заголовок — настоящий h3. Editorial-арт декоративен; вылет не влияет
        на порядок фокуса.
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
            <td>Нативная активация tk-button; клик по телу ничего не делает.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>Объявляет статью, h3-заголовок и кнопку по имени.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkfc-grid">
        ${cardCanvas(
          { variant: 'editorial', heading: 'Платинум', description: 'Премиальное обслуживание' },
          { art: true },
        )}
      </div>
    </main>
  `,
};
