import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import '../button/button.js';
import './range-slider.js';
import type { TkRangeSliderValueFormatter } from './range-slider.js';

/**
 * tk-range-slider stories (spec 26.1, form-control wave): playground, the
 * variant matrix (bare/labelled/formatted/slots/disabled/step grid), the
 * Т-Банк calculator pattern (slider → computed copy → yellow CTA), and the
 * a11y checklist (native range surface: arrows/Home/End, the PageUp/PageDown
 * ±10-steps guard, aria-valuetext through the formatter).
 *
 * Geometry register note (AC4, maintainer ruling 2026-10-05): the track
 * follows the tk-progress-bar mold (4px pill), the thumb the tk-checkbox
 * engaged circle (20px) — kit registers; pixel grounding is a HOLD → 24T.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root. Story numbers are
 * fictional (the PD gate).
 */

type SliderArgs = {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  disabled: boolean;
};

/** Fictional demo formatting: thousands with thin spaces, «до N ₽» units. */
const formatAmount = (value: number): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const slider = (args: Partial<SliderArgs> = {}) => {
  const { label, min, max, step, defaultValue, disabled } = args;
  return html`
    <tk-range-slider
      class="tkr-field"
      .label=${label ?? 'Сумма перевода'}
      .min=${min ?? 0}
      .max=${max ?? 100}
      .step=${step ?? 1}
      .defaultValue=${defaultValue ?? 20}
      ?disabled=${disabled ?? false}
    ></tk-range-slider>
  `;
};

const canvasStyles = html`
  <style>
    .tkr-canvas {
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
    .tkr-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkr-canvas .tkr-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkr-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkr-canvas .tkr-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--tk-space-24) var(--tk-space-32);
    }
    .tkr-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      flex: 1 1 280px;
      max-width: 420px;
    }
    .tkr-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkr-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkr-canvas td,
    .tkr-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkr-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    .tkr-canvas .tkr-calc {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      box-sizing: border-box;
      max-width: 480px;
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-lg);
    }
    .tkr-canvas .tkr-calc__readout {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--tk-space-16);
    }
    .tkr-canvas .tkr-calc__number {
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    .tkr-canvas .tkr-calc__hint {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
  </style>
`;

const meta: Meta<SliderArgs> = {
  title: 'Components/RangeSlider',
  component: 'tk-range-slider',
  args: {
    label: 'Сумма перевода',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 20,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text', description: 'Видимая подпись слева от значения (слот перекрывает).' },
    min: { control: 'number', description: 'Нижняя граница; нечисло читается как 0.' },
    max: { control: 'number', description: 'Верхняя граница; нечисло читается как 100; min ≥ max — вырожденный диапазон.' },
    step: { control: 'number', description: 'Шаг сетки; нечисло или ≤ 0 читается как 1.' },
    defaultValue: {
      control: 'number',
      description: 'Стартовое значение неконтролируемого режима; после первого апдейта игнорируется.',
    },
    disabled: {
      control: 'boolean',
      description: 'Прозрачность 40%, без pointer-событий, aria-disabled (остаётся в фокусе).',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SliderArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>RangeSlider</h1>
      <p class="tkr-note">
        Одноручковый выбор суммы (спека 26.1, form-control wave). Взаимодействие —
        нативный <code>&lt;input type="range"&gt;</code> под невидимым слоем:
        клавиатура, драг, тач и объявления скринридера достаются бесплатно.
        Геометрия — по китовым регистрам (рулинг мейнтейнера 2026-10-05): трек —
        молд tk-progress-bar (4px-пилюля), ручка — китовый круг 20px; пиксельное
        заземление — HOLD → 24T. Хуки <code>--tk-range-slider-*</code>
        перекрывают геометрию и цвета; переключите контрол Theme — тема
        перестраивается наследованием токенов, без единой ветки в коде.
      </p>
      ${slider(args)}
      ${slider({ ...args, label: 'Доля портфеля, %', min: 0, max: 100, step: 5, defaultValue: 35 })}
    </main>
  `,
};

export const Variants: Story = {
  name: 'Варианты',
  render: () => {
    const rubles: TkRangeSliderValueFormatter = (v) => `${formatAmount(v)} ₽`;
    return html`
      ${canvasStyles}
      <main class="tkr-canvas">
        <h1>Варианты</h1>
        <p class="tkr-note">
          Матрица: без подписи (заголовок скрыт — только трек), с подписью,
          форматированный readout (<code>valueFormatter</code> → и в ячейку, и в
          aria-valuetext), слоты вместо пропов, шаг-сетка с прилипанием, disabled.
          Числа демо вымышленные.
        </p>
        <div class="tkr-row">
          <figure>
            <tk-range-slider class="tkr-field" aria-label="Громкость уведомлений"></tk-range-slider>
            <figcaption>
              голый слайдер — трек без заголовка; имя только через aria-label
            </figcaption>
          </figure>
          <figure>
            ${slider({})}
            <figcaption>label-проп + plain readout</figcaption>
          </figure>
          <figure>
            <tk-range-slider
              class="tkr-field"
              label="Лимит карты"
              min="30000"
              max="900000"
              step="30000"
              default-value="210000"
              .valueFormatter=${rubles}
            ></tk-range-slider>
            <figcaption>formatter: readout и aria-valuetext «N ₽», шаг 30 000</figcaption>
          </figure>
          <figure>
            <tk-range-slider
              class="tkr-field"
              min="0"
              max="100"
              step="10"
              default-value="40"
            >
              <span>Срок аренды, мес.</span>
              <span slot="value">свой текст</span>
            </tk-range-slider>
            <figcaption>слот label + слот value перекрывают пропы</figcaption>
          </figure>
          <figure>
            ${slider({ label: 'Процент кэшбэка', min: 1, max: 10, step: 1, defaultValue: 3, disabled: true })}
            <figcaption>disabled: 40% прозрачности, aria-disabled</figcaption>
          </figure>
        </div>
      </main>
    `;
  },
};

/**
 * The Т-Банк calculator pattern (the component's reason to exist): slider →
 * computed copy → yellow CTA. The handler recomputes from the EMITTED
 * snapped value — the story never mutates args, the whole loop lives in the
 * canvas (the ValueModes mold). Fictional numbers throughout (the PD gate):
 * the 0.7% monthly yield and the round sums are demo-only.
 */
export const Calculator: Story = {
  name: 'Калькулятор (паттерн)',
  render: () => {
    const MONTHLY_RATE = 0.007;
    const recompute = (value: number): void => {
      const yieldEl = document.getElementById('tkr-calc-yield');
      if (yieldEl) {
        yieldEl.textContent = `${formatAmount(Math.round(value * MONTHLY_RATE))} ₽`;
      }
      const sumEl = document.getElementById('tkr-calc-sum');
      if (sumEl) {
        sumEl.textContent = `${formatAmount(value)} ₽`;
      }
    };
    return html`
      ${canvasStyles}
      <main class="tkr-canvas">
        <h1>Калькулятор</h1>
        <p class="tkr-note">
          Паттерн, под который собран атом: выбрать сумму → увидеть расчёт →
          подтвердить. Слайдер эмитит <code>value-change</code> с прилипшим к
          сетке числом, стори пересчитывает копию из эмитированного значения
          (0,7% в месяц — демо-ставка, вымышленная), жёлтая кнопка закрывает
          воронку.
        </p>
        <section class="tkr-calc">
          <h2>Накопительный счёт «Про запас»</h2>
          <div class="tkr-calc__readout">
            <span class="tkr-calc__number" id="tkr-calc-sum">150 000 ₽</span>
            <span class="tkr-calc__number" id="tkr-calc-yield">1 050 ₽</span>
          </div>
          <tk-range-slider
            label="Сумма счёта / доход в месяц"
            min="10000"
            max="500000"
            step="10000"
            default-value="150000"
            .valueFormatter=${(v: number) => `${formatAmount(v)} ₽`}
            @value-change=${(event: Event) => {
              const { value } = (event as CustomEvent<{ value: number }>).detail;
              recompute(value);
            }}
          ></tk-range-slider>
          <p class="tkr-calc__hint">
            Расчёт условный: демо-ставка 0,7% в месяц, числа вымышленные.
          </p>
          <tk-button>Открыть счёт</tk-button>
        </section>
      </main>
    `;
  },
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tkr-canvas">
      <h1>Доступность</h1>
      <p class="tkr-note">
        Семантика — нативная: <code>&lt;input type="range"&gt;</code> несёт
        role slider, aria-valuemin/max/now и полный клавиатурный контракт без
        единой строки JS со стороны кита. Раскрашенный слой —
        aria-hidden-декорация над семантической поверхностью. Единственный
        нативный пробел закрыт вручную: PageUp/PageDown прыгают на ±10 шагов
        (keydown-гард с preventDefault — AC2). С фокусом ручку обводит
        единое кольцо 2px (<code>--tk-color-focus-ring</code>, offset 2px) —
        на видимой ручке через <code>:focus-visible</code> невидимого инпута.
        При <code>valueFormatter</code> скринридер объявляет форматированный
        текст (aria-valuetext), а не голое число.
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>Фокус входит на ручку / покидает её; видимое кольцо 2px на ручке, без сдвигов макета.</td>
          </tr>
          <tr>
            <td><code>←</code> / <code>→</code> (и ↑/↓)</td>
            <td>Шаг ±step по сетке; каждый шаг эмитит <code>value-change</code> (composed, bubbles, <code>detail: { value }</code>).</td>
          </tr>
          <tr>
            <td><code>Home</code> / <code>End</code></td>
            <td>Прыжок на min / max — нативно, без JS.</td>
          </tr>
          <tr>
            <td><code>PageUp</code> / <code>PageDown</code></td>
            <td>Прыжок на ±10 шагов — китовый гвард (нативный пробел); клампится в границы диапазона.</td>
          </tr>
          <tr>
            <td>Скринридер</td>
            <td>«подпись, ползунок, N» — а с formatter: «подпись, ползунок, N ₽» (aria-valuetext); disabled объявляется через aria-disabled, ручка остаётся в таб-порядке.</td>
          </tr>
        </tbody>
      </table>
      <div class="tkr-row">
        <figure>
          <tk-range-slider
            class="tkr-field"
            label="Сумма перевода"
            min="1000"
            max="20000"
            step="500"
            default-value="4500"
            .valueFormatter=${(v: number) => `${formatAmount(v)} ₽`}
          ></tk-range-slider>
          <figcaption>попробуйте весь чек-лист на этом экземпляре</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-range-slider'),
};
