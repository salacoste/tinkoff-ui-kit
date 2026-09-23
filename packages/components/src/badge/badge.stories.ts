import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './badge.js';

/**
 * tk-badge stories (spec 3.2): default playground, variants, count capping,
 * slot-vs-prop, theming demo, and the a11y notes. Composed into the docs
 * surface by packages/docs/.storybook/main.ts.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type BadgeArgs = {
  variant: 'incentive' | 'stat';
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
      font-family: var(--tk-font-body);
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
      options: ['incentive', 'stat'],
      description:
        'Пара заливка/текст: incentive — зелёная с чернильным текстом (AA-пара 2.1), stat — чернильная с белым. Обе не зависят от темы.',
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
        пара button-inverse.
      </p>
      <div class="tkbadge-row">
        <figure>${badge({ variant: 'incentive' }, '+20%')}<figcaption>incentive</figcaption></figure>
        <figure>${badge({ variant: 'stat' }, 'Топ-1')}<figcaption>stat</figcaption></figure>
      </div>
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
        Обе пары Theme-инвариантны: green-100, ink-300, white и
        text-on-primary не имеют тёмных замен в токеновом слое, поэтому чип
        рисуется одинаково на светлом и тёмном холсте (то же решение, что у
        полосы progress-bar). Переключите контрол Theme — окружение
        перестроится, чип останется собой.
      </p>
      <div class="tkbadge-row">
        ${badge({ variant: 'incentive' }, '+20%')}
        ${badge({ variant: 'stat' }, '5%')}
        ${badge({ count: 99 })}
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
        Контраст обеих пар проходит AA в обеих темах (4.74:1 и 12.6:1). Это
        неинтерактивный элемент — чек-лист клавиатуры не применяется: чип
        никогда не появляется в порядке табуляции.
      </p>
      <div class="tkbadge-row">
        ${badge({ variant: 'incentive' }, '+20%')}
        ${badge({ variant: 'stat' }, 'Топ-1')}
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
        </tbody>
      </table>
    </main>
  `,
};
