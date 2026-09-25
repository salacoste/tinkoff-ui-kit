import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './tooltip.js';

/**
 * tk-tooltip stories (spec 4.2): playground, the OPEN state (the
 * baseline/axe story — rendered statically via `<tk-tooltip open>` so the
 * page-level capture and axe see the pill), all four placements, the
 * icon-only-trigger RECIPE (the accessible-name guard's correct form),
 * theming, and the a11y notes with the keyboard checklist.
 *
 * Behavior: hover OR focus shows after 300ms; leave/blur/Esc close
 * immediately; click/tap toggles (touch parity). The pill is ink-300 with
 * white text-xs — theme-invariant by design (both themes, zero branches).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type TooltipArgs = {
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
};

const canvasStyles = html`
  <style>
    .tku-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tku-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tku-canvas .tku-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tku-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tku-canvas .tku-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-24);
    }
    .tku-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      align-items: flex-start;
    }
    .tku-canvas figcaption {
      max-width: 420px;
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tku-canvas td,
    .tku-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tku-canvas code {
      font-family: var(--tk-font-body);
    }
    .tku-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tku-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tku-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tku-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    .tku-canvas .tku-recipe-wrong {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding: var(--tk-space-4) var(--tk-space-12);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-sm);
    }
  </style>
`;

/** The info glyph — the icon-trigger recipe's decorative SVG (aria-hidden). */
const infoGlyph = () => html`
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="10" cy="10" r="8.25"></circle>
    <path d="M10 9v4.5"></path>
    <circle cx="10" cy="6.4" r="0.25" fill="currentColor"></circle>
  </svg>
`;

const meta: Meta<TooltipArgs> = {
  title: 'Components/Tooltip',
  component: 'tk-tooltip',
  args: { content: 'Подсказка появляется через 300 мс', placement: 'top' },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<TooltipArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Tooltip</h1>
      <p class="tku-note">
        Инфо-пилюля через оверлей-контроллер: слой tooltip (z 400), якорная
        позиция со сдвигом на 8 и флипом у краёв вьюпорта (все четыре
        стороны). Текст — только проп content: пилюля нефокусируема по
        построению. Наведение или фокус показывают через 300 мс; уход, blur
        и Esc закрывают сразу; клик переключает (touch parity). Триггер —
        слот; aria-describedby вяжется автоматически.
      </p>
      <div class="tku-row">
        <figure>
          <tk-tooltip .content=${args.content} .placement=${args.placement}>
            <button type="button">Наведите или сфокусируйтесь</button>
          </tk-tooltip>
          <figcaption>наведение/фокус 300 мс → пилюля; Esc/уход — закрыть</figcaption>
        </figure>
        <figure>
          <tk-tooltip content="Клик переключает — как на тач-экране" placement="bottom">
            <button type="button">Клик переключает</button>
          </tk-tooltip>
          <figcaption>touch parity: клик/тап — тоже путь</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/**
 * The OPEN-state story: static `<tk-tooltip open>` — the frozen §9
 * declarative surface (the select Open-story mold). The trigger sits with
 * generous viewport margin so the pill's top placement never flips (the
 * page-level capture in tests/visual/tooltip.spec.ts is deterministic).
 */
export const Open: Story = {
  name: 'Открытая пилюля (базлайн/axe)',
  render: () => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Tooltip — открытая пилюля</h1>
      <p class="tku-note" style="min-height: 6em">
        Пилюля над триггером (placement top, отступ 8): ink-300, белый
        text-xs, radius-sm, тень --tk-shadow-tooltip, паддинг 8/12.
        aria-describedby уже связан с триггером.
      </p>
      <div class="tku-row" style="margin-top: var(--tk-space-24)">
        <figure>
          <tk-tooltip open content="Ставка действует первые 4 месяца" placement="top">
            <tk-button variant="secondary" size="compact">Ставка по вкладу</tk-button>
          </tk-tooltip>
          <figcaption>role=tooltip над триггером; нефокусируема</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Placements: Story = {
  name: 'Все стороны',
  render: () => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Все стороны</h1>
      <p class="tku-note">
        Запрошенная сторона держится, пока помещается; у края вьюпорта
        контроллер переключает на противоположную (все четыре грани). Отступ
        от триггера — 8. Тексты намеренно длинные: пилюля упирается в лимит
        ширины 288 (--tk-space-48 × 6) и переносится — зонд 9.1 фиксирует
        ширину всех четырёх ровно на лимите.
      </p>
      <div class="tku-row">
        <figure>
          <tk-tooltip
            content="Сверху: подсказка с длинным текстом упирается в максимум ширины пилюли и переносится на несколько строк"
            placement="top"
            open
          >
            <button type="button">top</button>
          </tk-tooltip>
          <figcaption>placement="top"</figcaption>
        </figure>
        <figure>
          <tk-tooltip
            content="Снизу: подсказка с длинным текстом упирается в максимум ширины пилюли и переносится на несколько строк"
            placement="bottom"
            open
          >
            <button type="button">bottom</button>
          </tk-tooltip>
          <figcaption>placement="bottom"</figcaption>
        </figure>
        <figure>
          <tk-tooltip
            content="Слева: подсказка с длинным текстом упирается в максимум ширины пилюли и переносится на несколько строк"
            placement="left"
            open
          >
            <button type="button">left</button>
          </tk-tooltip>
          <figcaption>placement="left"</figcaption>
        </figure>
        <figure>
          <tk-tooltip
            content="Справа: подсказка с длинным текстом упирается в максимум ширины пилюли и переносится на несколько строк"
            placement="right"
            open
          >
            <button type="button">right</button>
          </tk-tooltip>
          <figcaption>placement="right"</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const IconTrigger: Story = {
  name: 'Иконочный триггер (рецепт)',
  render: () => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Иконочный триггер — рецепт</h1>
      <p class="tku-note">
        Триггер без текста обязан иметь доступное имя —
        <code>aria-label</code> на самой кнопке (глиф — aria-hidden). Кит
        предупреждает в консоли, если иконочный триггер без имени открыл
        подсказку: предупреждение, не блокировка.
      </p>
      <div class="tku-row">
        <figure>
          <tk-tooltip content="Кэшбэк зачисляется 5-го числа" placement="bottom">
            <button type="button" aria-label="О кэшбэке">${infoGlyph()}</button>
          </tk-tooltip>
          <figcaption>
            ПРАВИЛЬНО: aria-label на кнопке, глиф aria-hidden — так проходит
            axe button-name
          </figcaption>
        </figure>
        <figure>
          <div class="tku-recipe-wrong">
            <code>&lt;button&gt;&lt;svg aria-hidden…&gt;&lt;/button&gt;</code>
          </div>
          <figcaption>
            НЕПРАВИЛЬНО (не рендерим вживую — безымянная кнопка валит axe
            button-name): иконочный триггер без aria-label/labelledby/title
            получит dev-warn в консоли при открытии подсказки —
            предупреждение, не блокировка
          </figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Темизация</h1>
      <p class="tku-note">
        Пилюля темо-инвариантна: ink-300 не переотображается в тёмной теме —
        белый текст на ink-300 даёт 12.6:1 в обеих темах, компонентных веток
        ноль (см. NOTES). Слоты: <code>--tk-tooltip-fill</code>,
        <code>--tk-tooltip-text</code>, <code>--tk-tooltip-radius</code>.
        Триггер ниже открывает пилюлю — переключите контрол Theme.
      </p>
      <section class="tku-panel">
        <tk-tooltip content="Подсказка на базовой поверхности" open>
          <button type="button">Триггер</button>
        </tk-tooltip>
      </section>
      <section class="tku-panel tku-panel--muted">
        <tk-tooltip content="Подсказка на приглушённой" open>
          <button type="button">Триггер</button>
        </tk-tooltip>
      </section>
      <section class="tku-panel tku-panel--charcoal">
        <tk-tooltip content="Подсказка над тёмной панелью" open>
          <button type="button">Триггер</button>
        </tk-tooltip>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tku-canvas">
      <h1>Доступность</h1>
      <p class="tku-note">
        Паттерн APG: <code>aria-describedby</code> с триггера на
        <code>role="tooltip"</code> — описание объявляется при фокусе,
        вежливо по своей природе. Пилюля нефокусируема и вне таб-порядка:
        содержимое — только проп, интерактивное в ней невозможно по
        построению. Иконочный триггер — с <code>aria-label</code> (глиф
        aria-hidden); без имени кит предупреждает. Появление — fade 150ms на
        motion-токенах, 0ms при prefers-reduced-motion (opacity-only).
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Действие</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> на триггер</td>
            <td>Через 300 мс пилюля появляется; описание объявляется при фокусе.</td>
          </tr>
          <tr>
            <td><code>Tab</code> дальше</td>
            <td>Пилюля закрывается немедленно (blur); фокус идёт дальше сам.</td>
          </tr>
          <tr>
            <td><code>Esc</code></td>
            <td>
              Закрывает немедленно и отменяет незавершённый таймер — пока фокус
              в пределах компонента (APG-паттерн: слушатель живёт на
              триггере/хосте). Тост, открытый наведением при фокусе вне
              компонента, закрывается уходом курсора или blur.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code></td>
            <td>Обычное действие кнопки-триггера; клик переключает пилюлю.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«Имя кнопки, описание» — подсказка читается при фокусе, не перебивая.</td>
          </tr>
        </tbody>
      </table>
      <div class="tku-row">
        <tk-tooltip content="Это описание прочитается при фокусе">
          <button type="button">Триггер с подсказкой</button>
        </tk-tooltip>
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tku-note">
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
            <td>Фокус на триггере (Tab)</td>
            <td>после имени кнопки зачитывается текст подсказки (aria-describedby): «…Ставка действует первые 4 месяца»</td>
          </tr>
          <tr>
            <td>Esc</td>
            <td>подсказка скрывается; повторное объявление прекращается</td>
          </tr>
          <tr>
            <td>Tab дальше</td>
            <td>сама пилюля НЕ является остановкой — фокус проходит мимо (role=tooltip, нет tabindex)</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-tooltip'),
};
