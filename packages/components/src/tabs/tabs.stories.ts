import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './tabs.js';
import type { TkTab } from './tabs.js';

/**
 * tk-tabs stories (spec 3.3): playground (the reference debit/credit/deposit
 * switcher with projected panels), every state (default / with badges /
 * disabled tab / all-disabled / single tab), the frozen controlled/
 * uncontrolled contract live, theming demo, and the a11y notes with the
 * keyboard-only checklist.
 *
 * Motion: the panel swap runs content-only at duration-moderate on the
 * expressive-standard curve (AD-9 «tab swaps») and collapses via BOTH the
 * token layer (0ms) and the sheet's explicit reduced-motion rule. The tab
 * bar never animates a swap — the pill snaps; the hover text step is the
 * State Pattern's 150ms.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

/** The reference switcher (tbank.ru capture tabs-switcher.png, 374×44). */
const CARDS: TkTab[] = [
  { value: 'debit', label: 'Дебетовая карта' },
  { value: 'credit', label: 'Кредитная карта' },
  { value: 'deposit', label: 'Вклад' },
];

type TabsArgs = {
  value?: string;
  defaultValue: string;
};

const tabsCanvas = (args: Partial<TabsArgs> = {}, tabList: TkTab[] = CARDS) => {
  const { value, defaultValue } = args;
  // `value === undefined ? undefined : value` keeps the demo UNCONTROLLED by
  // default: a bound value would strict-control the element and leave demo
  // arrows visually stuck until a re-render (the frozen §4 contract).
  return html`
    <tk-tabs
      .tabs=${tabList}
      .value=${value}
      .defaultValue=${defaultValue ?? ''}
      >
        <div slot="tab-0">
          <p class="tkt-panel-text">
            Дебетовая карта с бесплатным обслуживанием и кэшбэком до 25% на
            категории выбора.
          </p>
        </div>
        <div slot="tab-1">
          <p class="tkt-panel-text">
            Кредитная карта со льготным периодом до 55 дней без процентов.
          </p>
        </div>
        <div slot="tab-2">
          <p class="tkt-panel-text">Вклад со ставкой до 16% и снятием в любой момент без потери процентов.</p>
        </div>
      </tk-tabs>
  `;
};

const canvasStyles = html`
  <style>
    .tkt-canvas {
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
    .tkt-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkt-canvas .tkt-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkt-canvas .tkt-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-24);
    }
    .tkt-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkt-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas td,
    .tkt-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkt-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkt-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkt-canvas .tkt-field {
      max-width: 560px;
    }
    .tkt-canvas .tkt-log {
      box-sizing: border-box;
      margin: 0;
      min-height: 3em;
      max-width: var(--tk-space-container);
      padding: var(--tk-space-8) var(--tk-space-12);
      overflow: auto;
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-sm);
      white-space: pre-wrap;
    }
    .tkt-canvas .tkt-panel-text {
      margin: 0 0 var(--tk-space-12);
      max-width: 560px;
      color: var(--tk-color-text-secondary);
    }
    .tkt-canvas .tkt-panel-link {
      display: inline-block;
      margin-top: var(--tk-space-4);
    }
    .tkt-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkt-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkt-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkt-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    /* On-tint recipe (the TextLink precedent): the invisible track puts
       inactive tab text DIRECTLY on the host surface — on charcoal the
       text-secondary default fails AA (2.85:1), so the surface overrides
       the component's text hooks — BOTH of them: the hover hook too, or the
       hovered inactive tab falls back to text-primary (#333 on #333, 1:1
       invisible — the 3.3 review finding). The active tab needs nothing:
       its text sits on the white pill. */
    .tkt-panel--charcoal tk-tabs {
      --tk-tabs-text: var(--tk-color-white);
      --tk-tabs-text-hover: var(--tk-color-white);
    }
    .tkt-panel--charcoal .tkt-panel-text {
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<TabsArgs> = {
  title: 'Components/Tabs',
  component: 'tk-tabs',
  args: {
    defaultValue: 'debit',
  },
  argTypes: {
    value: {
      control: 'text',
      description:
        'Контролируемое значение (строгий режим §4): рендерится ровно оно; выбор только эмитит value-change.',
    },
    defaultValue: {
      control: 'text',
      description: 'Начальное значение неконтролируемого режима; после подключения игнорируется.',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<TabsArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Tabs</h1>
      <p class="tkt-note">
        Секционный переключатель эталона (дебетовая / кредитная / вклад):
        текстовые табы в невидимой дорожке, активный — белая пилюля
        radius-full с тенью default и текстом 500 веса; неактивные —
        text-secondary. Полная семантика tablist/tab/tabpanel, стрелки ходят
        по циклу с автоАктивацией (фокус = выбор, поведение эталона), Home/End
        — на первый/последний доступный таб. Смена панели анимирует ТОЛЬКО
        контент (expressive-standard, 300мс), дорожка статична. Контент
        панелей проецируется слотами <code>tab-0…tab-N</code>.
      </p>
      ${tabsCanvas(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Состояния',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Состояния</h1>
      <p class="tkt-note">
        Активный таб — пилюля + тень + 500 вес (правило избыточности: пилюля и
        вес несут состояние вдвоём, никогда одно). Неактивный — text-secondary,
        hover — шаг до text-primary за 150мс. Бейдж-счётчик — вложенный
        tk-badge с кэпом «99+». Отключённый таб пропускается стрелками и не
        получает фокус; все отключены — ни одного выбранного, стрелки инертны.
        Тёмная тема — контрол Theme в тулбаре.
      </p>
      <div class="tkt-row">
        <figure>
          ${tabsCanvas({})}
          <figcaption>эталонная тройка: активен первый (clamp без defaultValue)</figcaption>
        </figure>
        <figure>
          ${tabsCanvas({}, [
            { value: 'debit', label: 'Дебетовая', badge: 5 },
            { value: 'credit', label: 'Кредитная', badge: 120 },
            { value: 'deposit', label: 'Вклад' },
          ])}
          <figcaption>бейджи: 5 и 120 → «99+» (кэп tk-badge)</figcaption>
        </figure>
        <figure>
          ${tabsCanvas({ defaultValue: 'debit' }, [
            { value: 'debit', label: 'Дебетовая' },
            { value: 'credit', label: 'Кредитная', disabled: true },
            { value: 'deposit', label: 'Вклад' },
          ])}
          <figcaption>средний таб disabled: стрелки пропускают, клик невозможен</figcaption>
        </figure>
        <figure>
          ${tabsCanvas({ defaultValue: 'debit' }, [
            { value: 'debit', label: 'Дебетовая', disabled: true },
            { value: 'credit', label: 'Кредитная', disabled: true },
          ])}
          <figcaption>все отключены: ни одного выбранного, стрелки инертны</figcaption>
        </figure>
        <figure>
          ${tabsCanvas({ defaultValue: 'solo' }, [{ value: 'solo', label: 'Единственный' }])}
          <figcaption>одиночный таб: стрелки инертны (циклиться некуда)</figcaption>
        </figure>
      </div>
    </main>
  `,
};

/** Live demo of the frozen §4 semantics on the string channel (mirrors the Input/Select/SegmentedRadio stories). */
export const ValueModes: Story = {
  name: 'Режимы value (замороженный контракт)',
  render: () => {
    const log = (id: string, line: string): void => {
      const pre = document.getElementById(id);
      if (pre) {
        pre.textContent = [line, ...(pre.textContent ?? '').split('\n')].slice(0, 8).join('\n');
      }
    };

    return html`
      ${canvasStyles}
      <main class="tkt-canvas">
        <h1>Режимы value</h1>
        <p class="tkt-note">
          Строчное зеркало контракта §4: (1) начальное значение
          неконтролируемого режима — <code>defaultValue</code>, изменения после
          подключения игнорируются; (2) контролируемый режим строгий — элемент
          рендерит ровно <code>value</code>, выбор только эмитит
          <code>value-change</code>; (3) снятие <code>value</code>
          переключает в неконтролируемый режим, сея состояние последним
          контролируемым значением. Неизвестное значение клампится к первому
          доступному табу — переключатель эталона всегда показывает активный
          таб. Индекс — производное чтение <code>activeIndex</code>, не канал.
        </p>
        <section>
          <h2>Неконтролируемый: defaultValue + value-change</h2>
          <tk-tabs
            class="tkt-field"
            .tabs=${CARDS}
            default-value="debit"
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkt-log-uncontrolled', `value-change → ${value} (activeIndex по запросу)`);
            }}
          >
            <div slot="tab-0"><p class="tkt-panel-text">Панель 1 — работает без единой строчки JS.</p></div>
            <div slot="tab-1"><p class="tkt-panel-text">Панель 2.</p></div>
            <div slot="tab-2"><p class="tkt-panel-text">Панель 3.</p></div>
          </tk-tabs>
          <pre class="tkt-log" id="tkt-log-uncontrolled">—</pre>
        </section>
        <section>
          <h2>Контролируемый (строгий): выбор отвечает только после value</h2>
          <tk-tabs
            class="tkt-field"
            .tabs=${CARDS}
            .value=${'debit'}
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: string }>).detail;
              log('tkt-log-controlled', `value-change → ${value} (рендер держит debit, пока consumer не ответит)`);
            }}
          >
            <div slot="tab-0"><p class="tkt-panel-text">Строгий режим: клики эмитят, ничего не применяют.</p></div>
            <div slot="tab-1"><p class="tkt-panel-text">Эта панель откроется, только когда value придёт извне.</p></div>
            <div slot="tab-2"><p class="tkt-panel-text">Панель 3.</p></div>
          </tk-tabs>
          <pre class="tkt-log" id="tkt-log-controlled">—</pre>
        </section>
      </main>
    `;
  },
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Темизация</h1>
      <p class="tkt-note">
        Табы темизуются только наследованием — переключите контрол Theme в
        тулбаре: в тёмной теме тень пилюли схлопывается (tonal elevation), и
        волосяная линия border-default держит край пилюли на тёмном холсте
        (паттерн вторичной кнопки), а 500-вес текста остаётся избыточным
        носителем состояния. Ни одной ветки темы в коде. Слоты перекрываются
        по грамматике <code>--tk-&lt;component&gt;-&lt;slot&gt;</code>:
        <code>--tk-tabs-pill-fill</code>,
        <code>--tk-tabs-text</code>,
        <code>--tk-tabs-text-active</code>,
        <code>--tk-tabs-radius</code>.
        Рецепт для тонированных поверхностей (прецедент TextLink on-tint):
        невидимая дорожка кладёт текст неактивных табов прямо на холст
        потребителя — на charcoal шаг text-secondary не проходит AA (2.85:1),
        поэтому поверхность перекрывает <code>--tk-tabs-text</code> на белый,
        а вместе с ним и <code>--tk-tabs-text-hover</code> — иначе ховер
        неактивного таба падает в text-primary и становится невидимым на
        чернильном фоне (1:1 с панелью).
        Активному табу ничего не нужно: его текст лежит на белой пилюле.
      </p>
      <section class="tkt-panel">
        ${tabsCanvas({ defaultValue: 'debit' })}
      </section>
      <section class="tkt-panel tkt-panel--muted">
        ${tabsCanvas({ defaultValue: 'credit' })}
      </section>
      <section class="tkt-panel tkt-panel--bluegray">
        ${tabsCanvas({ defaultValue: 'deposit' })}
      </section>
      <section class="tkt-panel tkt-panel--charcoal">
        ${tabsCanvas({ defaultValue: 'debit' })}
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkt-canvas">
      <h1>Доступность</h1>
      <p class="tkt-note">
        Полная семантика табов: <code>role="tablist"</code> на дорожке,
        <code>role="tab"</code> на кнопках с <code>aria-selected</code> и
        <code>aria-controls</code>, <code>role="tabpanel"</code> на панелях с
        <code>aria-labelledby</code> (id-связки внутри одного дерева). Roving
        tabindex: активный таб 0, остальные −1. АвтоАктивация: перемещение
        фокуса стрелками выбирает таб (поведение эталона). Отключённые табы —
        нативный <code>disabled</code>: не фокусируются, пропускаются
        стрелками. Tab уходит с активного таба в контент АКТИВНОЙ панели
        (неактивные панели скрыты — вне порядка таба и дерева доступности),
        пустая панель пропускает фокус дальше. Кольцо фокуса — единое: 2px
        <code>--tk-color-focus-ring</code>, сдвиг 2px, не убирается. Цель
        нажатия ≥44px: кнопка таба занимает всю высоту дорожки. Смена панели
        анимирует только контент; при reduced-motion — отключена явно.
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
              Фокус входит на АКТИВНЫЙ таб и уходит в контент активной панели
              (затем наружу); кольцо фокуса 2px обводит кнопку таба.
            </td>
          </tr>
          <tr>
            <td><code>→</code> / <code>↓</code></td>
            <td>
              Следующий доступный таб с переходом по циклу: фокус и выбор
              двигаются вместе (автоАктивация); эмитится
              <code>value-change</code> (composed, bubbles,
              <code>detail: { value: string }</code>).
            </td>
          </tr>
          <tr>
            <td><code>←</code> / <code>↑</code></td>
            <td>Предыдущий доступный таб с переходом по циклу — то же самое.</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Первый / последний ДОСТУПНЫЙ таб: фокус и выбор вместе.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>
              Объявляет «список вкладок»: имя таба (метка + счётчик бейджа) и
              состояние «выбрана»; панель — именована своим табом; отключённый
              таб объявляется недоступным.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkt-row">
        ${tabsCanvas({ defaultValue: 'debit' }, [
          { value: 'debit', label: 'Дебетовая', badge: 2 },
          { value: 'credit', label: 'Кредитная', disabled: true },
          { value: 'deposit', label: 'Вклад' },
        ])}
      </div>
    </main>
  `,
};
