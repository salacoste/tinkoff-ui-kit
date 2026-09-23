import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './link.js';

/**
 * tk-link stories (spec 3.1): default playground, every variant, states,
 * in-text composition, theming demo, and the a11y notes with the
 * keyboard-only checklist. Composed into the docs surface by
 * packages/docs/.storybook/main.ts.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. Demo links sit on
 * surface-base panels: blue-100 (#1771E6) is the AA pair for WHITE
 * (4.62:1) — on light tints/muted the AA-safe step is link-on-tint, which
 * this element deliberately never picks (see Theming).
 */

type LinkArgs = {
  variant: 'inline' | 'standalone' | 'legal';
  href: string;
  disabled: boolean;
};

const link = (label: string, args: Partial<LinkArgs> = {}) => {
  const { variant, href, disabled } = args;
  return html`
    <tk-link
      variant=${variant ?? 'inline'}
      href=${href ?? '#tklink-anchor'}
      ?disabled=${disabled ?? false}
      >${label}</tk-link
    >
  `;
};

const canvasStyles = html`
  <style>
    .tklink-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tklink-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tklink-canvas .tklink-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tklink-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tklink-canvas p {
      margin: 0;
      max-width: var(--tk-space-container);
    }
    .tklink-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tklink-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tklink-canvas td,
    .tklink-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tklink-canvas code {
      font-family: var(--tk-font-body);
    }
    .tklink-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
      background: var(--tk-color-surface-base);
    }
    /* The on-tint demo surface: opaque in BOTH themes (tint-bluegray), so
       the link-on-tint pair stays measurable and AA in each. */
    .tklink-panel--tint {
      background: var(--tk-color-tint-bluegray);
    }
    .tklink-legal {
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-xs-size);
      font-weight: var(--tk-text-body-xs-weight);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta<LinkArgs> = {
  title: 'Components/Link',
  component: 'tk-link',
  args: {
    variant: 'inline',
    href: '#tklink-anchor',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['inline', 'standalone', 'legal'],
      description:
        'Вариант употребления: inline — внутри текста (наследует типографику окружения), standalone — отдельной строкой (body-m), legal — юридический мелкий серый (body-xs).',
    },
    href: {
      control: 'text',
      description: 'URL — проходит на внутренний <a> без изменений.',
    },
    disabled: {
      control: 'boolean',
      description:
        'aria-disabled на якоре + перехват кликов на хосте; ссылка остаётся в порядке табуляции.',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<LinkArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>Link</h1>
      <p class="tklink-note">
        Текстовая ссылка в регистре Тинькоффа: синяя через семантический токен
        <code>--tk-color-link</code>, подчёркивание только при наведении и
        клавиатурном фокусе — в покое «Читать» референса это простое слово.
        Переключите контрол Theme в тулбаре — токен переразрешится сам.
      </p>
      <section class="tklink-panel">${link('Читать далее', args)}</section>
      <h2 id="tklink-anchor">Якорь демо-ссылок</h2>
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>Варианты</h1>
      <p class="tklink-note">
        Три варианта употребления. Inline наследует типографику окружения —
        ссылка живёт внутри предложения. Standalone получает body-m и отдельную
        строку (CTA карточек «Читать далее»). Legal — body-xs серым
        (text-secondary), юридический мелкий шрифт.
      </p>
      <section class="tklink-panel">
        <h2>inline — в предложении</h2>
        <p>
          Управляйте финансами с выгодой:
          ${link('откройте вклад', { variant: 'inline' })} или
          ${link('закажите дебетовую карту', { variant: 'inline' })} — решение за
          одну заявку.
        </p>
      </section>
      <section class="tklink-panel">
        <h2>standalone — отдельной строкой</h2>
        ${link('Читать далее', { variant: 'standalone' })}
      </section>
      <section class="tklink-panel">
        <h2>legal — юридический мелкий</h2>
        <p class="tklink-legal">
          ${link('Политика конфиденциальности', { variant: 'legal' })} и
          ${link('условия обслуживания', { variant: 'legal' })} применяются к
          использованию сайта.
        </p>
      </section>
    </main>
  `,
};

export const States: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>Состояния</h1>
      <p class="tklink-note">
        В покое — без подчёркивания (зонд кадра text-link-read-more.png:
        «простое слово»). Наведение и клавиатурный фокус рисуют подчёркивание —
        это единственный аффорданс, цвет не шагает. Disabled — прозрачность 40%
        без навигации, <code>aria-disabled</code>, клики перехватываются на
        хосте, но ссылка остаётся фокусируемой.
      </p>
      <section class="tklink-panel">
        <figure>${link('Покой', {})}<figcaption>rest — без подчёркивания</figcaption></figure>
        <figure>
          ${link('Наведите на меня', {})}<figcaption>hover — подчёркивание</figcaption>
        </figure>
        <figure>
          ${link('Перейдите по Tab', {})}
          <figcaption>focus-visible — подчёркивание всегда видно</figcaption>
        </figure>
        <figure>
          ${link('Недоступна', { disabled: true })}
          <figcaption>disabled — 40%, без навигации</figcaption>
        </figure>
      </section>
    </main>
  `,
};

export const InText: Story = {
  name: 'В тексте и мелкая печать',
  render: () => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>В тексте и мелкая печать</h1>
      <p class="tklink-note">
        Рабочий состав ссылок: inline внутри абзацев, legal — строка юридической
        мелкой печати внизу (состав футера из Story 3.5). Подчёркивание
        появляется только при наведении/фокусе, поэтому плотный текст не
        превращается в решето.
      </p>
      <section class="tklink-panel">
        <p>
          ${'Тинькофф Банк (Т-Банк) — российский поставщик банковских услуг. '}
          ${link('Дебетовые карты', {})}
          ${' с кэшбеком до 30%, '}
          ${link('вклады', {})}
          ${' со ставкой до 16% и '}
          ${link('кредиты наличными', {})}
          ${' — всё в одном приложении. Обслуживание базовой карты бесплатное при выполнении условий.'}
        </p>
        <p>
          ${'Подробнее о '}
          ${link('тарифах', {})}
          ${' и '}
          ${link('бонусах партнёров', {})}
          ${' — на соответствующих страницах.'}
        </p>
        <p class="tklink-legal">
          ${'© 2026. Неофициальный учебный проект. '}
          ${link('Политика обработки данных', { variant: 'legal' })}
          ${' · '}
          ${link('Правовая информация', { variant: 'legal' })}
        </p>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>Темизация</h1>
      <p class="tklink-note">
        Ссылка всегда потребляет <code>--tk-color-link</code> — потребитель
        никогда не выбирает on-tint шаг вручную: семантический токен темизируется
        сам (blue-100 в светлой теме, тёмный link в тёмной — AA-пара токенового
        слоя). Верхняя панель на surface-base — базовая AA-пара (4.62:1).
        Нижняя панель — ДОКУМЕНТНЫЙ рецепт для тинтов: контейнер
        переопределяет <code>--tk-color-link: var(--tk-color-link-on-tint)</code>
        (blue-200, 4.97:1 на field; в тёмной теме токен сам равен тёмному link) —
        пропа компонента по-прежнему нет, выбор поверхности остаётся за
        документом (запись в verify/link/NOTES.md).
      </p>
      <section class="tklink-panel">
        <p>
          ${link('Открыть вклад', {})} · ${link('Заказать карту', {})} ·
          ${link('Читать далее', { variant: 'standalone' })}
        </p>
      </section>
      <section
        class="tklink-panel tklink-panel--tint"
        style="--tk-color-link: var(--tk-color-link-on-tint)"
      >
        <p>
          ${link('Ссылка на тинте', {})} · ${link('Кэшбэк на карте', {})} —
          контейнер задал on-tint шаг документным переопределением токена.
        </p>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tklink-canvas">
      <h1>Доступность</h1>
      <p class="tklink-note">
        <code>tk-link</code> рендерит нативный <code>&lt;a&gt;</code> — роль,
        имя и активация по Enter получаются самой конструкцией. Disabled
        объявляется через <code>aria-disabled</code> (ссылка остаётся в порядке
        табуляции — паттерн кнопки), навигация блокируется перехватом кликов на
        хосте. Клавиатурный индикатор фокуса — подчёркивание (видно всегда,
        пока ссылка в фокусе). Standalone добивает интерактивную цель до
        44×44 прозрачным боксом (высота + inline-добивка); inline-ссылки в
        предложениях живут в строчных боксовых целях — как в референсе.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Фокус переходит на ссылку / покидает её; появляется подчёркивание
              (индикатор клавиатурного фокуса — всегда виден в фокусе).
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>
              Переходит по <code>href</code> (нативная активация якоря); в
              состоянии disabled навигации нет.
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «ссылка» и текст подписи; в disabled — состояние
              disabled (<code>aria-disabled</code>).
            </td>
          </tr>
        </tbody>
      </table>
      <section class="tklink-panel">
        ${link('Цель для клавиатуры', { variant: 'standalone' })}
        ${link('Недоступна с клавиатуры', { variant: 'standalone', disabled: true })}
      </section>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tklink-note">
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
            <td>Tab на ссылку</td>
            <td>«Текст ссылки, ссылка» — роль ссылки у всех вариантов (inline / standalone / legal)</td>
          </tr>
          <tr>
            <td>Disabled-ссылка</td>
            <td>«Текст ссылки, ссылка, недоступна» (aria-disabled) — навигация по Enter блокируется</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>переход по href; standalone-цель 44px не меняет объявлений</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
