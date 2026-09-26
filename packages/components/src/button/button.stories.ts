import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './button.js';

/**
 * tk-button stories (spec 1.7): default playground, every variant × size,
 * states, icon slot, theming demo, and the a11y notes with the keyboard-only
 * checklist. Composed into the docs surface by packages/docs/.storybook/main.ts.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'inverse';
  size: 'hero' | 'card' | 'compact';
  loading: boolean;
  disabled: boolean;
};

const button = (label: string, args: Partial<ButtonArgs> = {}) => {
  const { variant, size, loading, disabled } = args;
  return html`
    <tk-button
      variant=${variant ?? 'primary'}
      size=${size ?? 'card'}
      ?loading=${loading ?? false}
      ?disabled=${disabled ?? false}
      >${label}</tk-button
    >
  `;
};

const canvasStyles = html`
  <style>
    .tkbtn-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input story's 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while text remaps to white — story chrome invisible
         (5.4 dark-sweep finding, the axe transparent-background blind
         spot). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkbtn-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkbtn-canvas .tkbtn-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkbtn-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkbtn-canvas .tkbtn-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-16);
    }
    .tkbtn-canvas .tkbtn-row--column {
      flex-direction: column;
      align-items: flex-start;
    }
    .tkbtn-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tkbtn-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkbtn-canvas td,
    .tkbtn-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkbtn-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkbtn-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkbtn-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    .tkbtn-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkbtn-panel--base {
      background: var(--tk-color-surface-base);
    }
  </style>
`;

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  component: 'tk-button',
  args: {
    variant: 'primary',
    size: 'card',
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'inverse'],
      description: 'Визуальный вариант — строковое union-значение (CONVENTIONS §2).',
    },
    size: {
      control: 'radio',
      options: ['hero', 'card', 'compact'],
      description:
        'Шкала высот: hero 56 / card 48 / compact 32 с добивкой до порога кликабельности 44px.',
    },
    loading: {
      control: 'boolean',
      description:
        'Спиннер на месте; ширина зафиксирована; клики не активируют кнопку; aria-busy.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Прозрачность 40%, без pointer-событий, aria-disabled; побеждает loading.',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Button</h1>
      <p class="tkbtn-note">
        Pill-контроль в регистре Тинькоффа. Переключите контрол Theme в тулбаре —
        все поверхности ниже перестраиваются через унаследованные
        <code>var(--tk-*)</code> токены без единой правки разметки.
      </p>
      ${button('Продолжить', args)}
    </main>
  `,
};

export const VariantsAndSizes: Story = {
  name: 'Варианты и размеры',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Варианты и размеры</h1>
      <p class="tkbtn-note">
        Один primary на визуальный кластер — дисциплина потребителя (строка Button
        в EXPERIENCE.md): кит поставляет варианты, а жёлтый расходуют страницы.
      </p>
      ${(['hero', 'card', 'compact'] as const).map(
        (size) => html`
          <section>
            <h2>size: ${size}</h2>
            <div class="tkbtn-row">
              ${button('Стать клиентом', { variant: 'primary', size })}
              ${button('Подробнее', { variant: 'secondary', size })}
              ${button('Открыть счёт', { variant: 'inverse', size })}
            </div>
          </section>
        `,
      )}
      <section>
        <h2>href: CTA-ссылка</h2>
        <p class="tkbtn-note">
          Непустой <code>href</code> рендерит ту же пилюлю нативной ссылкой
          (<code>&lt;a class="button"&gt;</code> вместо
          <code>&lt;button&gt;</code>) — тот же класс, то же внутреннее дерево,
          та же стилизация. Без <code>href</code> рендер байт-в-байт совпадает с
          кнопкой. Для <code>target="_blank"</code> атрибут
          <code>rel="noopener noreferrer"</code> проставляется автоматически;
          собственный <code>rel</code> всегда выигрывает дословно.
        </p>
        <div class="tkbtn-row">
          <figure>
            <tk-button variant="primary" size="hero" href="https://example.com">
              Открыть страницу
            </tk-button>
            <figcaption>href — переход в той же вкладке</figcaption>
          </figure>
          <figure>
            <tk-button
              variant="secondary"
              size="hero"
              href="https://example.com"
              target="_blank"
            >
              Открыть в новой вкладке
            </tk-button>
            <figcaption>target="_blank" — rel="noopener noreferrer" ставится сам</figcaption>
          </figure>
        </div>
      </section>
    </main>
  `,
};

export const States: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Состояния</h1>
      <p class="tkbtn-note">
        Loading фиксирует ширину кнопки (подпись остаётся для скринридеров за
        спиннером, состояние объявляется через <code>aria-busy</code>), клики не
        активируют кнопку. Disabled — прозрачность 40%, без pointer-событий, с
        <code>aria-disabled</code>. Приоритет: <code>disabled</code> +
        <code>loading</code> вместе дают семантику disabled; спиннер может
        отображаться и дальше.
      </p>
      <div class="tkbtn-row">
        <figure>${button('Обычная', {})}<figcaption>покой</figcaption></figure>
        <figure>${button('Загрузка', { loading: true })}<figcaption>loading</figcaption></figure>
        <figure>${button('Недоступна', { disabled: true })}<figcaption>disabled</figcaption></figure>
        <figure>
          ${button('Обе', { loading: true, disabled: true })}
          <figcaption>loading + disabled (побеждает disabled)</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Interaction: Story = {
  name: 'Взаимодействие (hover / press / focus)',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Взаимодействие</h1>
      <p class="tkbtn-note">
        Hover сдвигает заливку primary на один токен (yellow-100 → yellow-200) за
        150ms; нажатие — ещё на шаг (yellow-300) за 75ms: шаг цвета, но никогда
        масштаб. Focus-кольцо — единый контур 2px <code>--tk-color-focus-ring</code>
        со сдвигом 2px, оно никогда не убирается. Все длительности приходят из
        токенов <code>--tk-motion-*</code> и схлопываются до 0ms при
        <code>prefers-reduced-motion</code>. Эти состояния переходящие — наведите,
        нажмите и протабьтесь по кнопкам ниже.
      </p>
      <div class="tkbtn-row">
        ${button('Наведите на меня', { variant: 'primary', size: 'hero' })}
        ${button('Нажмите на меня', { variant: 'primary', size: 'hero' })}
        ${button('Перейдите по Tab', { variant: 'secondary', size: 'hero' })}
        ${button('И на меня тоже', { variant: 'inverse', size: 'hero' })}
      </div>
    </main>
  `,
};

export const LongLabel: Story = {
  name: 'Длинная подпись',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Длинная подпись</h1>
      <p class="tkbtn-note">
        Кнопки референса однострочные: подпись никогда не переносится. Без
        ограничений кнопка растёт вместе с текстом. При ограниченной потребителем
        ширине подпись усекается с многоточием только ВИЗУАЛЬНО — слоттированный
        light-DOM текст остаётся полным, поэтому доступное имя сохраняет всю строку
        (проверьте дерево доступности под канвасом). Ограничивайте кнопку, а не
        подпись, когда нужно такое поведение.
      </p>
      <div class="tkbtn-row tkbtn-row--column">
        <tk-button variant="primary" size="hero">
          Открыть вклад «СмартВклад» с ежемесячной капитализацией процентов
        </tk-button>
        <div style="width: 320px">
          <tk-button variant="primary" size="card" style="width: 100%">
            Открыть вклад «СмартВклад» с ежемесячной капитализацией процентов
          </tk-button>
        </div>
      </div>
    </main>
  `,
};

export const WithIcon: Story = {
  name: 'Слот для иконки',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Слот для иконки</h1>
      <p class="tkbtn-note">
        Необязательный <code>slot="icon"</code> рендерится СЛЕВА от подписи;
        слот по умолчанию — подпись (CONVENTIONS §5). Декоративные иконки
        должны нести <code>aria-hidden</code> — кнопку называет только подпись.
      </p>
      <div class="tkbtn-row">
        <tk-button variant="primary" size="hero">
          <svg
            slot="icon"
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          Стать клиентом
        </tk-button>
        <tk-button variant="secondary" size="card">
          <svg
            slot="icon"
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          Подробнее
        </tk-button>
        <tk-button variant="inverse" size="compact">
          <svg
            slot="icon"
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
          Скачать
        </tk-button>
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Темизация</h1>
      <p class="tkbtn-note">
        Кнопки темизуются только наследованием — переключите контрол Theme в
        тулбаре (<code>data-theme="dark"</code> на корне превью). Primary сохраняет
        чернильный текст на жёлтом в обеих темах; secondary и inverse
        переразрешаются через семантические токены surface/ink (secondary
        поднимается на тёмную поверхность со своей волосяной линией, inverse
        инвертируется в светлую пилюлю); тени в тёмной теме схлопываются в
        <code>none</code> по токеновому слою.
      </p>
      <section class="tkbtn-panel tkbtn-panel--base">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Secondary', { variant: 'secondary', size: 'card' })}
          ${button('Inverse', { variant: 'inverse', size: 'card' })}
        </div>
      </section>
      <section class="tkbtn-panel tkbtn-panel--muted">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Secondary', { variant: 'secondary', size: 'card' })}
        </div>
      </section>
      <section class="tkbtn-panel tkbtn-panel--charcoal">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Inverse', { variant: 'inverse', size: 'card' })}
        </div>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Доступность</h1>
      <p class="tkbtn-note">
        <code>tk-button</code> рендерит нативный <code>&lt;button&gt;</code> — роль,
        имя и активация по Space/Enter получаются самой конструкцией. Состояния
        объявляются (<code>aria-disabled</code>, <code>aria-busy</code>); подпись в
        состоянии loading сохраняется для скринридеров за спиннером. Компактная
        кнопка 32px добивает эффективную цель до порога 44px (EXPERIENCE.md A11y
        Floor) — hover никогда не единственный путь; у каждого действия есть
        паритет касания и клавиатуры. С непустым <code>href</code> рендерится
        нативная ссылка — строка режима href в чек-листе ниже фиксирует её
        клавиатурную дельту.
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
              Переносит фокус на кнопку / убирает с неё; кольцо фокуса 2px
              (<code>--tk-color-focus-ring</code>, offset 2px) видно всегда, когда
              кнопка в фокусе с клавиатуры, и никогда не убирается.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Активирует кнопку (нативная активация); в состояниях loading и disabled активации нет.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Активирует кнопку (нативная активация); в состояниях loading и disabled активации нет.</td>
          </tr>
          <tr>
            <td>Режим <code>href</code>: <code>Enter</code> / <code>Space</code></td>
            <td>
              Кнопка-ссылка фокусируется тем же Tab-кольцом; <code>Enter</code>
              переходит по <code>href</code> (в loading/disabled — навигации нет);
              <code>Space</code> прокручивает страницу — нативная семантика
              ссылки, задокументированная дельта режима href, а не дефект
              (ссылки референса ведут себя так же).
            </td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет подпись и состояния <code>disabled</code> / <code>busy</code>,
              когда они заданы, — доступное имя никогда не исчезает во время loading.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkbtn-row">
        ${button('Цель для клавиатуры', { variant: 'primary', size: 'hero' })}
        ${button('Compact: порог 44px', { variant: 'secondary', size: 'compact' })}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkbtn-note">
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
            <td>Tab на кнопку</td>
            <td>«Подпись, кнопка» — имя и роль; размер/вариант НЕ объявляются</td>
          </tr>
          <tr>
            <td>Кнопка в состоянии loading</td>
            <td>имя сохраняется: «Подпись, кнопка, занятая» (aria-busy) — подпись не исчезает за спиннером</td>
          </tr>
          <tr>
            <td>Disabled-кнопка</td>
            <td>«Подпись, кнопка, недоступна» (aria-disabled) — остановка остаётся в порядке Tab</td>
          </tr>
          <tr>
            <td>Enter / Space</td>
            <td>активация: срабатывает действие; в loading/disabled — тишина</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-button'),
};
