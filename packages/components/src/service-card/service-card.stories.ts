import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../link/link.js';
import './service-card.js';

/**
 * tk-service-card stories (spec 3.8): playground (the reference's 3-up
 * directory grid — the grid template is the CONSUMER layout), variant
 * states (tints, varying description lengths proving the pinned link,
 * prop-absent clamps), theming demo, and the a11y notes with the
 * keyboard-only checklist.
 *
 * The action is a COMPOSED tk-link standalone slotted into `actions` —
 * pinned bottom across description lengths; the icon slot is decorative
 * (container aria-hidden). Icon stand-ins are token-drawn tiles.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type CardArgs = {
  variant: 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';
  heading: string;
  description: string;
};

/** Token-drawn icon stand-in (the reference's 3D tiles are consumer art). */
const iconDemo = html`
  <span class="tksc-icon" slot="icon"></span>
`;

const cardCanvas = (args: Partial<CardArgs> = {}, { icon = true } = {}) => html`
  <tk-service-card
    variant=${args.variant ?? 'gray'}
    heading=${args.heading ?? 'Расчетный счет'}
    description=${args.description ?? 'Открытие за один день, обслуживание от 0 ₽'}
  >
    ${icon ? iconDemo : ''}
    <tk-link slot="actions" variant="standalone" href="#rko">Подробнее</tk-link>
  </tk-service-card>
`;

const canvasStyles = html`
  <style>
    .tksc-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tksc-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tksc-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksc-canvas .tksc-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tksc-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* The 3-up directory grid — consumer template; the cards are grid-agnostic. */
    .tksc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--tk-space-20);
      max-width: var(--tk-space-container);
    }
    .tksc-canvas figure {
      margin: 0;
    }
    .tksc-icon {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: var(--tk-color-tint-bluegray);
    }
    .tksc-canvas code {
      font-family: var(--tk-font-body);
    }
    .tksc-canvas td,
    .tksc-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
  </style>
`;

const meta: Meta<CardArgs> = {
  title: 'Components/ServiceCard',
  component: 'tk-service-card',
  args: {
    variant: 'gray',
    heading: 'Расчетный счет',
    description: 'Открытие за один день, обслуживание от 0 ₽',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['gray', 'bluegray', 'mint', 'beige', 'charcoal'],
      description: 'Тон поверхности; он же решает пару текста.',
    },
    heading: { control: 'text', description: 'Заголовок (heading-5); слот heading перекрывает.' },
    description: { control: 'text', description: 'Описание (body-m); слот description перекрывает.' },
  },
};

export default meta;

type Story = StoryObj<CardArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tksc-canvas">
      <h1>ServiceCard</h1>
      <p class="tksc-note">
        Компактная карточка каталога эталона: радиус xl 24, паддинг 24,
        декоративная иконка (контейнер aria-hidden), заголовок, описание и
        текстовая ссылка, ПРИБИТАЯ к низу при любой длине описания (flex
        column + margin-top auto). Ссылка — слотленный tk-link standalone;
        карточка пассивна.
      </p>
      <div class="tksc-grid">
        ${cardCanvas(args)}
        ${cardCanvas({ heading: 'Эквайринг', description: 'Прием платежей на сайте и в приложении' })}
        ${cardCanvas({ heading: 'Зарплатный проект', description: 'Выпуск карт и выплаты сотрудникам' })}
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tksc-canvas">
      <h1>Состояния</h1>
      <p class="tksc-note">
        Ссылка стоит внизу при любой длине описания. Неизвестный тон
        клампится к gray. Скелетона нет — EXPERIENCE называет его только у
        ArticleCard/PromoCard.
      </p>
      <section>
        <h2>Разная длина описания — ссылка прибита</h2>
        <div class="tksc-grid">
          ${cardCanvas({ heading: 'Коротко', description: 'Одна строка' })}
          ${cardCanvas({
            heading: 'Длинно',
            description:
              'Открытие за один день, обслуживание от 0 ₽, интеграция с бухгалтерией, зарплаты сотрудникам и налоги в одном окне',
          })}
          ${cardCanvas({ heading: 'Без иконки', description: 'Иконка необязательна' }, { icon: false })}
        </div>
      </section>
      <section>
        <h2>Тона</h2>
        <div class="tksc-grid">
          ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Страховка за 2 минуты' })}
          ${cardCanvas({ variant: 'beige', heading: 'Курсы', description: 'Обучение команд' })}
          ${cardCanvas({ variant: 'charcoal', heading: 'Премиум', description: 'Белая пара на charcoal' })}
        </div>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tksc-canvas">
      <h1>Темизация</h1>
      <p class="tksc-note">
        Тёмная тема — контрол Theme в тулбаре: веток темы в коде нет.
        Хуки <code>--tk-service-card-*</code>:
        <code>--tk-service-card-fill</code>,
        <code>--tk-service-card-text</code>,
        <code>--tk-service-card-text-muted</code>,
        <code>--tk-service-card-radius</code>,
        <code>--tk-service-card-padding</code>,
        <code>--tk-service-card-padding-mobile</code>,
        <code>--tk-service-card-icon-radius</code>,
        <code>--tk-service-card-link</code> (цвет ссылки-действия; по
        умолчанию AA-шаг тонированных поверхностей, на charcoal — белый).
      </p>
      <div class="tksc-grid">
        ${cardCanvas({ variant: 'bluegray', heading: 'Эквайринг', description: 'Прием платежей' })}
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tksc-canvas">
      <h1>Доступность</h1>
      <p class="tksc-note">
        Иконка декоративна: контейнер получает aria-hidden от компонента —
        скринридер её не объявляет. Действие — текстовая ссылка (слотленный
        tk-link standalone, цель ≥44px, подчёркивание на фокусе). Заголовок —
        настоящий h3. Карточка пассивна: без роли, tabindex и клика.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code></td>
            <td>Фокус проходит только по ссылке внизу карточки.</td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Нативная навигация якоря tk-link; клик по телу ничего не делает.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>Иконка молчит (aria-hidden), объявляет статью, h3 и ссылку по имени.</td>
          </tr>
        </tbody>
      </table>
      <div class="tksc-grid">
        ${cardCanvas({ heading: 'Расчетный счет', description: 'Открытие за один день' })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tksc-note">
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
            <td>иконка НЕ объявляется (aria-hidden); сразу «РКО для бизнеса, заголовок 3 уровня», описание</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>действие — ссылка: «Подробнее, ссылка»; карточка вне порядка табуляции</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-service-card'),
};
