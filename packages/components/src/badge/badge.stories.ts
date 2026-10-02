import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './badge.js';
import '../tabs/tabs.js';
import type { TkTab } from '../tabs/tabs.js';

/**
 * tk-badge stories (spec 3.2): default playground, variants, count capping,
 * slot-vs-prop, theming demo, and the a11y notes. The 13.3 console story
 * adds the neutral/attention variants and the gray tab-count digit via the
 * freshly minted --tk-badge-* hooks (zero tabs code — custom properties
 * inherit through the shadow boundary onto the existing TkTab.badge chip).
 * The 22.2 financial tones (positive/negative, invest identity wave) join
 * the Variants/Theming/Accessibility canvases — measured grounding: the
 * live insider-deals table paints the deal type as plain text, no pill.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type BadgeArgs = {
  variant: 'incentive' | 'stat' | 'neutral' | 'attention' | 'positive' | 'negative';
  count: number | undefined;
  label: string;
};

const badge = (args: Partial<BadgeArgs> = {}, slotted?: string) => {
  const { variant, count, label } = args;
  return html`
    <tk-badge variant=${variant ?? 'incentive'} .count=${count} label=${label ?? ''}
      >${slotted ?? ''}</tk-badge
    >
  `;
};

const canvasStyles = html`
  <style>
    .tkbadge-canvas {
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
    .tkbadge-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkbadge-canvas .tkbadge-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkbadge-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkbadge-canvas .tkbadge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-16);
    }
    .tkbadge-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tkbadge-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkbadge-canvas td,
    .tkbadge-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkbadge-canvas code {
      font-family: var(--tk-font-mono);
    }
  </style>
`;

const meta: Meta<BadgeArgs> = {
  title: 'Components/Badge',
  component: 'tk-badge',
  args: {
    variant: 'incentive',
    count: undefined,
    label: '+20%',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['incentive', 'stat', 'neutral', 'attention', 'positive', 'negative'],
      description:
        'Пара заливка/текст: incentive — зелёная с чернильным текстом (AA-пара 2.1), stat — чернильная с белым, neutral — серая gray-100/gray-600 (консоль), attention — red-300 с белым (AA-маппинг пака). Четыре заливки не зависят от темы; positive/negative (22.2) — финансовые текстовые тоны без заливки, красятся дельта-токенами и темятся в dark.',
    },
    count: {
      control: 'number',
      description:
        'Режим счётчика: пока задано конечное число — рендерится число с потолком «99+» (0 виден: ноль — это информация); побеждает слот и label.',
    },
    label: {
      control: 'text',
      description: 'Подпись — запасной вариант, когда слот по умолчанию пуст.',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<BadgeArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Badge</h1>
      <p class="tkbadge-note">
        Pill-чип референса «+20%»: body-xs в пилюле radius-full, ~22px высотой
        (зонд кадра badge-chip-incentive.png). Никогда не интерактивен сам по
        себе — обычный <code>&lt;span&gt;</code> без табстопа и роли; действие
        несёт окружающий контекст.
      </p>
      ${badge(args)}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Варианты</h1>
      <p class="tkbadge-note">
        <code>incentive</code> — зелёная заливка green-100 с чернильным
        текстом text-on-primary: белый на green-100 даёт 2.66:1 (провал AA),
        чернильный — 4.74:1; пара заморожена в Story 2.1 и не зависит от
        темы. <code>stat</code> — чернильная ink-300 с белым текстом (12.6:1),
        пара button-inverse. <code>neutral</code> и <code>attention</code> —
        консольные тона 13.3 (см. «Консольные тона»).
      </p>
      <div class="tkbadge-row">
        <figure>${badge({ variant: 'incentive' }, '+20%')}<figcaption>incentive</figcaption></figure>
        <figure>${badge({ variant: 'stat' }, 'Топ-1')}<figcaption>stat</figcaption></figure>
        <figure>
          ${badge({ variant: 'neutral' }, 'Ожидает подписи')}<figcaption>neutral</figcaption>
        </figure>
        <figure>${badge({ variant: 'attention', count: 3 })}<figcaption>attention</figcaption></figure>
      </div>
      <h2>Финансовые тоны</h2>
      <p class="tkbadge-note">
        <code>positive</code>/<code>negative</code> (22.2) — текстовые тоны без
        заливки: живая таблица инсайдерских сделок красит ТОЛЬКО значение
        («Покупка» зелёным ×4, «Продажа» красным ×1 — обычный строчный текст
        ~12–13px на белом фоне, БЕЗ пилюли; замер research-хаба). Токены те же
        дельта-пары, что у чипов котировок; знак несёт контент, цвет — не
        единственный носитель. Заливка прозрачная: подложка остаётся за
        консьюмером, санкция дельт — surface-base (на тонированной поверхности
        контраст проверяет консьюмер).
      </p>
      <div class="tkbadge-row">
        <figure>${badge({ variant: 'positive' }, '+3,8%')}<figcaption>positive</figcaption></figure>
        <figure>${badge({ variant: 'negative' }, '−2,95%')}<figcaption>negative</figcaption></figure>
        <figure>${badge({ variant: 'positive' }, 'Покупка')}<figcaption>тип сделки</figcaption></figure>
        <figure>${badge({ variant: 'negative' }, 'Продажа')}<figcaption>тип сделки</figcaption></figure>
      </div>
    </main>
  `,
};

/**
 * Console tones (spec 13.3, admin pack): neutral = the h28 light status pill
 * + the gray tab-count digit; attention = the AA-mapped red (raw #E5372B of
 * the pack fails AA at body-xs → red-300). The tab counts ride the EXISTING
 * TkTab.badge slot — re-tinted through the --tk-badge-* hooks set on the
 * tk-tabs ancestor (custom properties inherit into the nested chip's shadow
 * tree; zero tabs code changed).
 */
export const ConsoleTones: Story = {
  name: 'Консольные тона',
  render: () => html`
    ${canvasStyles}
    <style>
      .tkbadge-console-tabs {
        --tk-badge-fill: var(--tk-color-gray-100);
        --tk-badge-text: var(--tk-color-gray-600);
      }
    </style>
    <main class="tkbadge-canvas">
      <h1>Консольные тона</h1>
      <p class="tkbadge-note">
        Админ-пак 13.1: статус-пилюля таблиц — светлая заливка с серым
        текстом (<code>neutral</code>: gray-100/gray-600 ≈5.17:1), красный
        счётчик на идущем платеже (<code>attention</code>: красный пака не
        проходит AA на body-xs — белый на нём 4.3:1, поэтому маппинг на
        red-300, 6.18:1, как у дельт таблиц). Серая цифра счётчика в табах —
        существующий слот <code>TkTab.badge</code>: хуки
        <code>--tk-badge-fill/--tk-badge-text</code> наследуются в теневой
        чип сквозь границу табов, ни строчки кода табов не тронуто.
      </p>
      <div class="tkbadge-row">
        <figure>
          ${badge({ variant: 'neutral' }, 'Ожидает подписи')}
          <figcaption>статус строки таблицы (admin-table-toolbar)</figcaption>
        </figure>
        <figure>
          ${badge({ variant: 'attention', count: 3 })}
          <figcaption>счётчик идущего платежа (admin-payments-hub)</figcaption>
        </figure>
      </div>
      <figure>
        <tk-tabs
          class="tkbadge-console-tabs"
          .tabs=${[
            { value: 'all', label: 'Все', badge: 48 },
            { value: 'sign', label: 'На подпись', badge: 5 },
            { value: 'done', label: 'Исполнены' },
          ] as TkTab[]}
          .defaultValue=${'all'}
        >
          <div slot="tab-0"><p>Все документы периода.</p></div>
          <div slot="tab-1"><p>Ждут подписи.</p></div>
          <div slot="tab-2"><p>Исполненные.</p></div>
        </tk-tabs>
        <figcaption>
          серые цифры счётчиков: хуки --tk-badge-* на предке tk-tabs
        </figcaption>
      </figure>
    </main>
  `,
};

export const Counts: Story = {
  name: 'Счётчик с потолком 99+',
  render: () => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Счётчик с потолком</h1>
      <p class="tkbadge-note">
        Проп <code>count</code> переводит чип в режим счётчика: значения больше
        99 рендерятся как «99+»; 0 остаётся видимым — ноль это информация.
        Пока count задан, он побеждает слот и label.
      </p>
      <div class="tkbadge-row">
        <figure>${badge({ count: 0 })}<figcaption>count=0 → «0»</figcaption></figure>
        <figure>${badge({ count: 5 })}<figcaption>count=5</figcaption></figure>
        <figure>${badge({ count: 99 })}<figcaption>count=99 — граница</figcaption></figure>
        <figure>${badge({ count: 100 })}<figcaption>count=100 → «99+»</figcaption></figure>
        <figure>${badge({ count: 1000 })}<figcaption>count=1000 → «99+»</figcaption></figure>
        <figure>${badge({ count: 100, variant: 'stat' })}<figcaption>stat-счётчик</figcaption></figure>
      </div>
    </main>
  `,
};

export const ContentSources: Story = {
  name: 'Слот против props',
  render: () => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Слот против props</h1>
      <p class="tkbadge-note">
        Приоритет содержимого: <code>count</code> (пока задан) → слот по
        умолчанию → <code>label</code>. Реальное содержимое слота — элемент
        или непустой текст — подавляет prop; пустая текстовая нота — нет.
      </p>
      <div class="tkbadge-row">
        <figure>${badge({ label: 'Запасной label' })}<figcaption>только label</figcaption></figure>
        <figure>
          ${badge({ label: 'Запасной label' }, 'Слот побеждает')}
          <figcaption>слот + label → слот</figcaption>
        </figure>
        <figure>
          ${badge({ count: 120 }, 'Слот проигрывает')}
          <figcaption>count=120 + слот → «99+»</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Темизация</h1>
      <p class="tkbadge-note">
        Четыре заливки Theme-инвариантны: green-100, ink-300, white и
        text-on-primary не имеют тёмных замен в токеновом слое, поэтому чип
        рисуется одинаково на светлом и тёмном холсте (то же решение, что у
        полосы progress-bar). Исключение 22.2 — финансовые тоны: дельта-токены
        несут тёмные ремапы, и без заливки держать инвариант нечего — текст
        следует теме. Переключите контрол Theme — окружение перестроится,
        заливки останутся собой, тоны перейдут в тёмные пары.
      </p>
      <div class="tkbadge-row">
        ${badge({ variant: 'incentive' }, '+20%')}
        ${badge({ variant: 'stat' }, '5%')}
        ${badge({ count: 99 })}
        ${badge({ variant: 'positive' }, '+3,8%')}
        ${badge({ variant: 'negative' }, '−2,95%')}
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkbadge-canvas">
      <h1>Доступность</h1>
      <p class="tkbadge-note">
        <code>tk-badge</code> — обычный <code>&lt;span&gt;</code>: нет
        табстопа, роли button и обработчиков; клик/тап по чипу ничего не
        делает. Скринридер читает его как статический текст — в составе поля
        он объявляется после label (паттерн Input из EXPERIENCE.md).
        Контраст всех четырёх заливочных пар проходит AA в обеих темах
        (экстракционные значения пар — в DESIGN.md, блок Colors); финансовые
        тоны 22.2 несут пары дельта-токенов — санкция на surface-base, как у
        дельт чипов котировок, и знак живёт в контенте: цвет не единственный
        носитель. Это
        неинтерактивный элемент — чек-лист клавиатуры не применяется: чип
        никогда не появляется в порядке табуляции.
      </p>
      <div class="tkbadge-row">
        ${badge({ variant: 'incentive' }, '+20%')}
        ${badge({ variant: 'stat' }, 'Топ-1')}
        ${badge({ variant: 'neutral' }, 'Ожидает подписи')}
        ${badge({ variant: 'attention' }, '3')}
        ${badge({ variant: 'positive' }, 'Покупка')}
        ${badge({ variant: 'negative' }, 'Продажа')}
      </div>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkb-note">
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
            <td>Линейное чтение (VO: Ctrl+Opt+стрелки)</td>
            <td>бейдж читается как текст строки: «99+», «Новое» — отдельной интерактивной остановки НЕТ (span без роли)</td>
          </tr>
          <tr>
            <td>Tab-обход</td>
            <td>фокус проходит мимо бейджа — он не в порядке табуляции никогда</td>
          </tr>
          <tr>
            <td>Консольные тона (neutral/attention, 13.3)</td>
            <td>тон НЕ объявляется и не должен: читается только текст («Ожидает подписи», «3») — цвет сопутствующий, состояние несёт контент (правило «не цветом одним»)</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-badge'),
};
