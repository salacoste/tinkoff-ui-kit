import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './article-card.js';

/**
 * tk-article-card stories (spec 3.9): playground (the reference's 3-up
 * media grid — the grid template is the CONSUMER layout), variant states
 * (long titles proving the 2-line clamp, tints, skeleton, prop-absent
 * clamps), theming demo, and the a11y notes with the keyboard-only
 * checklist (the whole-card stitch — ONE tab stop).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type CardArgs = {
  variant: 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';
  heading: string;
  description: string;
  href: string;
  linkLabel: string;
  skeleton: boolean;
};

const cardCanvas = (args: Partial<CardArgs> = {}) => html`
  <tk-article-card
    variant=${args.variant ?? 'gray'}
    heading=${args.heading ?? 'Как устроен кэшбэк'}
    description=${args.description ?? 'Разбираем механику начислений и категории'}
    href=${args.href ?? '#cashback'}
    linkLabel=${args.linkLabel ?? 'Читать'}
    ?skeleton=${args.skeleton ?? false}
  ></tk-article-card>
`;

const canvasStyles = html`
  <style>
    .tkac-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkac-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkac-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkac-canvas .tkac-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkac-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* The 3-up media grid — consumer template; the cards are grid-agnostic. */
    .tkac-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--tk-space-20);
      max-width: var(--tk-space-container);
    }
    .tkac-canvas figure {
      margin: 0;
    }
    .tkac-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkac-canvas td,
    .tkac-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
  </style>
`;

const meta: Meta<CardArgs> = {
  title: 'Components/ArticleCard',
  component: 'tk-article-card',
  args: {
    variant: 'gray',
    heading: 'Как устроен кэшбэк',
    description: 'Разбираем механику начислений и категории',
    href: '#cashback',
    linkLabel: 'Читать',
    skeleton: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['gray', 'bluegray', 'mint', 'beige', 'charcoal'],
      description: 'Тон поверхности; он же решает пару текста.',
    },
    heading: { control: 'text', description: 'Заголовок (heading-6, максимум 2 строки).' },
    description: { control: 'text', description: 'Описание (body-m); слот description перекрывает.' },
    href: { control: 'text', description: 'Цель ссылки «Читать» — клик всей карточки.' },
    linkLabel: { control: 'text', description: 'Текст ссылки (по умолчанию «Читать»).' },
    skeleton: { control: 'boolean', description: 'Скелетон: серые gray-200 блоки вместо контента.' },
  },
};

export default meta;

type Story = StoryObj<CardArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkac-canvas">
      <h1>ArticleCard</h1>
      <p class="tkac-note">
        Текстовая карточка СМИ эталона: только текст — заголовок в 2 строки
        (line-clamp), описание и ссылка «Читать», ЗАКРЫВАЮЩАЯ всю карточку
        через ::after-стежок: один таб-стоп, клик в любом месте ведёт по
        ссылке. Нативный якорь в shadow-дереве (прецедент tk-footer).
      </p>
      <div class="tkac-grid">
        ${cardCanvas(args)}
        ${cardCanvas({
          heading: 'Инвестиции для начинающих',
          description: 'С чего начать и как не потерять',
        })}
        ${cardCanvas({
          heading: 'Как сэкономить на продуктах',
          description: 'Пять привычек, которые заметно снижают чек',
        })}
      </div>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkac-canvas">
      <h1>Состояния</h1>
      <p class="tkac-note">
        Длинные заголовки обрезаются на второй строке; неизвестный тон
        клампится к gray; скелетон — статичные gray-200 блоки макета.
      </p>
      <section>
        <h2>Длинный заголовок (кламп 2 строки)</h2>
        <div class="tkac-grid">
          ${cardCanvas({
            heading:
              'Центробанк сохранил ключевую ставку и обновил прогноз по инфляции на конец года',
            description: 'Что это значит для вкладов и кредитов',
          })}
          ${cardCanvas({ heading: 'Коротко', description: 'Одна строка' })}
        </div>
      </section>
      <section>
        <h2>Тона и метка ссылки</h2>
        <div class="tkac-grid">
          ${cardCanvas({ variant: 'mint', heading: 'ОСАГО', description: 'Что покрыто', linkLabel: 'Подробнее' })}
          ${cardCanvas({ variant: 'charcoal', heading: 'Премиум', description: 'Белая пара на charcoal' })}
        </div>
      </section>
      <section>
        <h2>Скелетон</h2>
        <div class="tkac-grid">
          ${cardCanvas({ skeleton: true })}
          ${cardCanvas({ variant: 'beige', skeleton: true })}
        </div>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkac-canvas">
      <h1>Темизация</h1>
      <p class="tkac-note">
        Тёмная тема — контрол Theme в тулбаре: веток темы в коде нет, ссылка
        потребляет AA-шаг тонированных поверхностей
        <code>--tk-color-link-on-tint</code> (через хук
        <code>--tk-article-card-link</code>; на charcoal — белый), и он же
        перекрашивается в тёмном слое. Хуки <code>--tk-article-card-*</code>:
        <code>--tk-article-card-fill</code>,
        <code>--tk-article-card-text</code>,
        <code>--tk-article-card-text-muted</code>,
        <code>--tk-article-card-link</code>,
        <code>--tk-article-card-radius</code>,
        <code>--tk-article-card-padding</code>,
        <code>--tk-article-card-padding-mobile</code>.
      </p>
      <div class="tkac-grid">
        ${cardCanvas({ variant: 'bluegray', heading: 'Т-Ж', description: 'Истории каждый день' })}
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkac-canvas">
      <h1>Доступность</h1>
      <p class="tkac-note">
        Ссылка «Читать» закрывает карточку стежком ::after — ровно ОДИН
        таб-стоп на карточку, клик в любом месте = клик по якорю (нативная
        навигация). Подчёркивание — индикатор клавиатурного фокуса
        (прецедент-исключение tk-link: у текстовых ссылок линия вместо
        кольца). Заголовок — настоящий h3. Скелетон помечает контейнер
        aria-busy, блоки aria-hidden.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code></td>
            <td>Один стоп на карточку — ссылка; видно подчёркивание фокуса.</td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Нативная навигация; клик мышью в любом месте карточки делает то же.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>Объявляет статью, h3-заголовок и ссылку «Читать» по имени.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkac-grid">
        ${cardCanvas({ heading: 'Как устроен кэшбэк', description: 'Разбираем механику' })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkac-note">
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
            <td>Tab на карточку</td>
            <td>ОДНА остановка: «Читать, ссылка» — стич покрывает всю карточку, но объявляется только ссылка</td>
          </tr>
          <tr>
            <td>Линейное чтение</td>
            <td>«<Заголовок>, заголовок 3 уровня», дата, описание — до/вне ссылки</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>переход по ссылке</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-article-card'),
};
