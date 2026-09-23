import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/index.js';
import './progress-bar.js';

/**
 * tk-progress-bar stories (spec 2.7): playground, the reference
 * label/% composition (prop + slots + custom min/max), indeterminate,
 * announce (the optional narration live), empty/zero state, theming demo,
 * and the a11y notes with the progressbar-semantics + narration rundown.
 *
 * Display-only component: NO keyboard matrix exists to checklist — the a11y
 * notes say so explicitly (the one Epic 2 component without one).
 *
 * Motion: the indeterminate fill slides on --tk-motion-duration-slow and
 * collapses to a STATIC 33% fill under prefers-reduced-motion via the
 * component sheet's own media rule (plus the token layer's 0ms durations) —
 * no separate path to forget.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type ProgressBarArgs = {
  label: string;
  value: number;
  min: number;
  max: number;
  indeterminate: boolean;
  announce: boolean;
};

const progressBar = (args: Partial<ProgressBarArgs> = {}, slotContent = '') => {
  const { label, value, min, max, indeterminate, announce } = args;
  return html`
    <tk-progress-bar
      .label=${label ?? 'Уже заполнено'}
      .value=${value ?? 30}
      .min=${min ?? 0}
      .max=${max ?? 100}
      ?indeterminate=${indeterminate ?? false}
      ?announce=${announce ?? false}
    >
      ${slotContent}
    </tk-progress-bar>
  `;
};

const canvasStyles = html`
  <style>
    .tkp-canvas {
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
    .tkp-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkp-canvas .tkp-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkp-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkp-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkp-canvas .tkp-field {
      max-width: 568px;
    }
    .tkp-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkp-canvas td,
    .tkp-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkp-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkp-canvas .tkp-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-12);
    }
    .tkp-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkp-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkp-panel--bluegray {
      background: var(--tk-color-tint-bluegray);
    }
    .tkp-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta<ProgressBarArgs> = {
  title: 'Components/ProgressBar',
  component: 'tk-progress-bar',
  args: {
    label: 'Уже заполнено',
    value: 30,
    min: 0,
    max: 100,
    indeterminate: false,
    announce: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст подписи слева; используется, только если слот label пуст.',
    },
    value: {
      control: { type: 'number', step: 1 },
      description:
        'Текущее значение (число). Отображение клампится в [min, max]; проп никогда не мутируется, событий нет.',
    },
    min: { control: { type: 'number', step: 1 }, description: 'Нижняя граница (по умолчанию 0).' },
    max: { control: { type: 'number', step: 1 }, description: 'Верхняя граница (по умолчанию 100).' },
    indeterminate: {
      control: 'boolean',
      description:
        'Неизвестный прогресс: 33%-й fill скользит по треку (при reduced-motion — статичный), aria-busy, без aria-valuenow.',
    },
    announce: {
      control: 'boolean',
      description:
        'Опциональное вежливое озвучивание устоявшихся значений через скрытый aria-live span (по умолчанию выключено).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ProgressBarArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>ProgressBar</h1>
      <p class="tkp-note">
        Индикатор заполнения из формы-эталона («Уже заполнено N%»): трек 4px
        gray-200 с pill-радиусом, заливка blue-100, строка текста над треком —
        подпись слева, процент справа. Stateless-дисплей: value — вход, а не
        состояние; отображение клампится в [min, max], проп не мутируется,
        компонент ничего не эмитит.
      </p>
      <div class="tkp-field">${progressBar(args)}</div>
    </main>
  `,
};

export const WithLabelAndValue: Story = {
  name: 'Label и проценты',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Label и проценты</h1>
      <p class="tkp-note">
        Композиция эталона: подпись слева (body-s, text-secondary), процент
        справа (body-s bold, text-primary). Обе позиции — именованные слоты
        <code>label</code> и <code>value</code>; без слотов работают фолбэки:
        prop <code>label</code> и вычисленный «N%». Свой min/max тоже показан —
        ширина считается как доля диапазона.
      </p>
      <section>
        <figure>
          <div class="tkp-field">${progressBar({ value: 5 })}</div>
          <figcaption>prop label + вычисленный «5%» (как в эталоне)</figcaption>
        </figure>
        <figure>
          <div class="tkp-field">
            ${progressBar({ value: 60 }, '<span slot="label">Анкета застройщика</span>')}
          </div>
          <figcaption>подпись через слот label (слот важнее prop)</figcaption>
        </figure>
        <figure>
          <div class="tkp-field">
            ${progressBar({ value: 80 }, '<span slot="value">почти готово</span>')}
          </div>
          <figcaption>процент через слот value (проекция вместо вычисления)</figcaption>
        </figure>
        <figure>
          <div class="tkp-field">${progressBar({ value: 40, min: 20, max: 80 })}</div>
          <figcaption>min 20 / max 80 / value 40 → (40−20)/(80−20) = 33%</figcaption>
        </figure>
      </section>
    </main>
  `,
};

export const Indeterminate: Story = {
  name: 'Indeterminate',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Indeterminate</h1>
      <p class="tkp-note">
        Неизвестный прогресс: заливка 33% скользит по треку циклом на
        <code>--tk-motion-duration-slow</code>. Под
        <code>prefers-reduced-motion</code> анимация выключается — остаётся
        статичная 33%-я заливка (безопасный фолбэк). Семантика:
        <code>role="progressbar"</code> + <code>aria-busy="true"</code>, без
        aria-valuenow — значение неизвестно.
      </p>
      <section>
        <figure>
          <div class="tkp-field">${progressBar({ indeterminate: true, label: 'Проверяем данные' })}</div>
          <figcaption>indeterminate с подписью (aria-busy, без valuenow)</figcaption>
        </figure>
      </section>
    </main>
  `,
};

/** Live demo of the optional narration (announce) — EXPERIENCE's one sanctioned aria-live user. */
export const Announce: Story = {
  name: 'Announce (озвучивание)',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Announce</h1>
      <p class="tkp-note">
        Опциональное озвучивание: <code>announce</code> включает скрытый
        <code>aria-live="polite"</code>-регион, который объявляет
        «Заполнено N%» по УСТОЯВШЕМСЯ значению — окно в один rAF схлопывает
        всплеск обновлений в одно объявление последнего значения. Выключено по
        умолчанию: живой регион — решение потребителя, не компонента.
      </p>
      <section>
        <div class="tkp-actions">
          <tk-button
            size="compact"
            @click=${() => {
              const bar = document.querySelector<HTMLElement & { value?: number }>('#tkp-announce-bar');
              if (bar) bar.value = Math.max(0, (bar.value ?? 0) - 25);
            }}
            >−25%</tk-button
          >
          <tk-button
            size="compact"
            @click=${() => {
              const bar = document.querySelector<HTMLElement & { value?: number }>('#tkp-announce-bar');
              if (bar) bar.value = Math.min(100, (bar.value ?? 0) + 25);
            }}
            >+25%</tk-button
          >
        </div>
        <figure>
          <div class="tkp-field">
            <tk-progress-bar id="tkp-announce-bar" label="Уже заполнено" value="25" announce>
            </tk-progress-bar>
          </div>
          <figcaption>
            нажмите кнопки: скринридер объявит каждое устоявшееся значение вежливо (polite)
          </figcaption>
        </figure>
      </section>
    </main>
  `,
};

export const Empty: Story = {
  name: 'Пустое состояние',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Пустое состояние</h1>
      <p class="tkp-note">
        EXPERIENCE: «Zero-state copy slot; never blank». Точное правило: детерминированный режим,
        нулевой прогресс (value отсутствует или равен min) И нет ни подписи
        (prop/слот), ни контента в слоте value — тогда вместо пары label/%
        рендерится слот <code>empty</code> с дефолтной копией «Ещё ничего не
        заполнено». Трек 4px остаётся под ней на 0%.
      </p>
      <section>
        <figure>
          <div class="tkp-field">
            <tk-progress-bar></tk-progress-bar>
          </div>
          <figcaption>дефолтная копия нулевого состояния (имя бара — сама копия)</figcaption>
        </figure>
        <figure>
          <div class="tkp-field">
            ${progressBar({ value: 0, label: '' }, '<span slot="empty">Начните заполнять заявку</span>')}
          </div>
          <figcaption>
            спроецированная копия побеждает дефолтную (value 0 и пустой label — нулевое состояние)
          </figcaption>
        </figure>
        <figure>
          <div class="tkp-field">${progressBar({ value: 0, label: 'Уже заполнено' })}</div>
          <figcaption>подпись подавляет копию — обычный заголовок с «0%»</figcaption>
        </figure>
      </section>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Темизация',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Темизация</h1>
      <p class="tkp-note">
        Тема — только наследование токенов, ни одной ветки в коде: тексты
        переезжают через <code>--tk-color-text-secondary</code> /
        <code>--tk-color-text-primary</code> (в тёмной теме — белые
        полутона). Трек и заливка потребляют
        <code>gray-200</code>/<code>blue-100</code>, которых в тёмном слое
        токенов нет — полоса наследует светлые значения (наблюдение для
        тоновой доработки 5.4, новых токенов здесь нет по спецификации).
        Слоты перекрываются по грамматике
        <code>--tk-progress-bar-track</code>, <code>--tk-progress-bar-fill</code>,
        <code>--tk-progress-bar-radius</code>, <code>--tk-progress-bar-text</code>,
        <code>--tk-progress-bar-value-text</code>.
      </p>
      <section class="tkp-panel">
        ${progressBar({ value: 45 })}
      </section>
      <section class="tkp-panel tkp-panel--muted">
        ${progressBar({ value: 65, label: 'Анкета' })}
      </section>
      <section class="tkp-panel tkp-panel--bluegray">
        ${progressBar({ value: 85, label: 'Верификация' })}
      </section>
      <!-- Charcoal tint: the inline --tk-progress-bar-text/-value-text
           overrides ARE the documented per-tint escape hatch this story
           demonstrates — light-theme text-secondary/text-primary fail AA on
           charcoal, white passes (the checkbox charcoal precedent). -->
      <section class="tkp-panel tkp-panel--charcoal">
        <tk-progress-bar
          style="--tk-progress-bar-text: var(--tk-color-white); --tk-progress-bar-value-text: var(--tk-color-white)"
          label="Риск-профиль"
          value="25"
        ></tk-progress-bar>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkp-canvas">
      <h1>Доступность</h1>
      <p class="tkp-note">
        Семантика: теневой трек несёт <code>role="progressbar"</code> с
        <code>aria-valuenow/min/max</code> (детерминированный режим; кламп-значение,
        не сырой prop). Indeterminate — <code>aria-busy="true"</code> без
        valuenow. Имя — от спана подписи через <code>aria-labelledby</code>
        (SPAN-паттерн 2.4/2.5 — не кликабельный label), а в нулевом состоянии
        имя даёт копия слота empty. Вырожденный диапазон (min ≥ max) не
        выставляет valuenow/min/max вовсе — пара с перевёрнутыми границами
        никогда не доходит до AT. Озвучивание: только опциональный
        <code>announce</code> (см. story Announce) — EXPERIENCE называет
        ProgressBar единственным санкционированным пользователем aria-live.
      </p>
      <h2>Клавиатура</h2>
      <p class="tkp-note">
        Дисплейный компонент — клавиатурной матрицы нет: элемент не фокусируется
        и не перехватывает клавиши; всё управление значением — на потребителе.
      </p>
      <table>
        <thead>
          <tr><th>Состояние</th><th>Что слышит/видит пользователь</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Детерминированный</td>
            <td>progressbar «Уже заполнено», значение 30 из 0–100; ширина заливки 30%.</td>
          </tr>
          <tr>
            <td>Indeterminate</td>
            <td>progressbar «Проверяем данные», busy; значение не объявляется.</td>
          </tr>
          <tr>
            <td>Нулевой прогресс без подписи</td>
            <td>progressbar, имя — «Ещё ничего не заполнено»; трек пуст, не «молчит».</td>
          </tr>
          <tr>
            <td>Announce вкл.</td>
            <td>при изменении устоявшегося значения — вежливое «Заполнено N%».</td>
          </tr>
        </tbody>
      </table>
      <section>
        <figure>
          <div class="tkp-field">${progressBar({ value: 30 })}</div>
          <figcaption>детерминированный: valuenow/min/max + labelledby</figcaption>
        </figure>
      </section>
    
      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tkpb-note">
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
            <td>Tab-обход</td>
            <td>фокус проходит мимо — шкала не остановка (нет tabindex); состояние доходит только через атрибуты</td>
          </tr>
          <tr>
            <td>Чтение бара (VO: Ctrl+Opt+Cmd+J к следующему)</td>
            <td>«Индикатор выполнения, 50 процентов» — aria-valuenow/min/max</td>
          </tr>
          <tr>
            <td>announce-режим</td>
            <td>смена значения зачитывается ОДИН раз после успокоения: «Заполнено 50%» (aria-live polite)</td>
          </tr>
          <tr>
            <td>indeterminate</td>
            <td>«занятая» (aria-busy), значение не объявляется</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
