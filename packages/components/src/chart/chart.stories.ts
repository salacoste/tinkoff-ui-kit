import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './chart.js';
import type { TkChartPoint } from './chart.js';

/**
 * tk-chart stories (spec 23.1, invest remainder wave): the static SVG
 * price chart of the instrument page. Financial data is FICTIONAL per
 * the recon law — invented series, invented timestamps; the axis
 * formatter's conventions (NBSP grouping, RU comma, тыс./млн) are the
 * kit's pinned rule, not a transcription of any live reading.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root.
 */

type ChartArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkch-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark — story chrome invisible (the 5.4 dark-sweep
         finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkch-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkch-canvas .tkch-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkch-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkch-canvas section {
      max-width: var(--tk-space-container);
    }
    .tkch-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkch-stack {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .tkch-figure {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      padding: var(--tk-space-16);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-md);
    }
    .tkch-figure .tkch-figcaption {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--tk-space-12);
    }
    .tkch-figure .tkch-name {
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
    }
    .tkch-figure .tkch-tag {
      color: var(--tk-color-text-secondary);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
    }
  </style>
`;

/** Intraday hours for the x labels — invented timestamps (the recon law). */
const HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const toPoints = (values: number[], labels: string[]): TkChartPoint[] =>
  values.map((value, i) => ({ value, label: labels[i % labels.length] }));

/** A rising series — fictional numbers. */
const GROWING: TkChartPoint[] = toPoints(
  [101.2, 102.1, 101.8, 103.4, 104.0, 103.6, 105.2],
  HOURS,
);

/** A falling series — fictional numbers. */
const FALLING: TkChartPoint[] = toPoints(
  [98.4, 97.9, 98.2, 96.8, 97.1, 95.6, 94.8],
  HOURS,
);

/** A flat series with a hair of noise — fictional numbers. */
const FLAT: TkChartPoint[] = toPoints(
  [100.0, 100.1, 99.9, 100.0, 100.1, 99.9, 100.0],
  HOURS,
);

/** A millions-scale series — Y-axis abbreviation territory (fictional). */
const MILLIONS: TkChartPoint[] = toPoints(
  [19_430_000, 19_580_000, 19_760_000, 19_690_000, 19_910_000, 20_080_000, 20_120_000],
  HOURS,
);

const meta: Meta<ChartArgs> = {
  title: 'Components/Chart',
  component: 'tk-chart',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ChartArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkch-canvas">
      <h1>Chart</h1>
      <p class="tkch-note">
        Статичный SVG-чарт инструментальной страницы (spec 23.1): массив
        точек на входе — графика на выходе, без состояния и событий (молд
        tk-rating). Заливка — градиент invest-семейства инструмента:
        замеры капчи совпали со стопами волны 22.5 байт-в-байт, новых
        токенов не минчено. Сетка, опорная пунктирная линия и бейдж
        последнего значения — опциональные слои. Ось Y — «человеческие»
        тики: шаги 1/2/2.5/5, NBSP-группировка разрядов, запятая-десятичная
        и сокращения «тыс.»/«млн». Доступность:
        <code>role="img"</code> на самом элементе и производный
        <code>aria-label</code> с последним значением. Хук-слой
        <code>--tk-chart-*</code> — девять переменных: стопы, линия,
        сетка, ось, опорная, бейдж, высота.
      </p>
      <section>
        <div class="tkch-stack">
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Демо-индекс, день</span>
              <span class="tkch-tag">tone: stock · reference · badge</span>
            </div>
            <tk-chart .points=${GROWING} reference="102" badge></tk-chart>
          </div>
        </div>
      </section>
    </main>
  `,
};

/**
 * The three directions — rising, falling, flat. One quiet-grid ladder
 * each; the fill gradient follows the identity tone (stock family here).
 */
export const Directions: Story = {
  name: 'Направления',
  render: () => html`
    ${canvasStyles}
    <main class="tkch-canvas">
      <h1>Направления</h1>
      <p class="tkch-note">
        Рост, падение и плоская серия на одинаковой сетке. Тон заливки —
        семейство инструмента (тут акции), сама геометрия от направления
        не зависит: чарт не знает «зелёное — вверх», направление несёт
        потребитель выбором тона. Ряды вымышленные.
      </p>
      <section>
        <div class="tkch-stack">
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Рост</span>
              <span class="tkch-tag">7 точек</span>
            </div>
            <tk-chart .points=${GROWING}></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Падение</span>
              <span class="tkch-tag">7 точек</span>
            </div>
            <tk-chart .points=${FALLING}></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Плоская</span>
              <span class="tkch-tag">вырожденный диапазон расширяется на ±1</span>
            </div>
            <tk-chart .points=${FLAT}></tk-chart>
          </div>
        </div>
      </section>
    </main>
  `,
};

/** The optional layers — reference line, badge pill, the four tones. */
export const Layers: Story = {
  name: 'Опоры и бейдж',
  render: () => html`
    ${canvasStyles}
    <main class="tkch-canvas">
      <h1>Опоры и бейдж</h1>
      <p class="tkch-note">
        Опорная пунктирная — <code>reference</code>: горизонталь по
        значению; вне видимого диапазона не рисуется. Бейдж —
        <code>badge</code>: статичная пилюля последнего значения (у живого
        эталона это ховер-тултип, в статике он не отрисовывается ни на
        одной капче — геометрия из китовых конвенций, честный минт).
        Тон <code>bond</code> — семейство облигаций (замер капчи),
        <code>dark</code>/<code>light</code> — нейтральные. Значения
        вымышленные.
      </p>
      <section>
        <div class="tkch-stack">
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Опорная внутри диапазона</span>
              <span class="tkch-tag">reference = 97,5</span>
            </div>
            <tk-chart .points=${FALLING} reference="97.5"></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Опорная вне диапазона</span>
              <span class="tkch-tag">reference = 150 — не рисуется</span>
            </div>
            <tk-chart .points=${FALLING} reference="150"></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Бейдж последнего значения</span>
              <span class="tkch-tag">tone: bond · badge</span>
            </div>
            <tk-chart .points=${GROWING} tone="bond" badge></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Нейтральные тона</span>
              <span class="tkch-tag">tone: dark и tone: light</span>
            </div>
            <tk-chart .points=${FALLING} tone="dark" badge></tk-chart>
            <tk-chart .points=${GROWING} tone="light"></tk-chart>
          </div>
        </div>
      </section>
    </main>
  `,
};

/** The Y-axis formatter at million scale — «20 млн» territory. */
export const AxisOverflow: Story = {
  name: 'Переполнение оси Y',
  render: () => html`
    ${canvasStyles}
    <main class="tkch-canvas">
      <h1>Переполнение оси Y</h1>
      <p class="tkch-note">
        Шкала десятков миллионов: тики оси сокращаются до «млн» с
        запятой-десятичной и обрезкой хвостовых нулей, бейдж остаётся
        полным значением. Живой эталон на этой высоте печатает сырые
        float-строки — записанный негатив реконструкции; кит держит
        одну конвенцию форматирования. Ряд вымышленный.
      </p>
      <section>
        <div class="tkch-figure">
          <div class="tkch-figcaption">
            <span class="tkch-name">Демо-индекс, капитализация</span>
            <span class="tkch-tag">диапазон ~20 млн</span>
          </div>
          <tk-chart .points=${MILLIONS} badge></tk-chart>
        </div>
      </section>
    </main>
  `,
};

/** The clamps — empty series and a single point. */
export const Clamps: Story = {
  name: 'Клампы',
  render: () => html`
    ${canvasStyles}
    <main class="tkch-canvas">
      <h1>Клампы</h1>
      <p class="tkch-note">
        Пустая серия рендерит пустой холст с меткой «График, нет данных»
        (aria), одна точка — только точку по центру плота, без линии и
        заливки. Нечисловые значения фильтруются из ряда до масштаба.
      </p>
      <section>
        <div class="tkch-stack">
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Пустая серия</span>
              <span class="tkch-tag">points: []</span>
            </div>
            <tk-chart .points=${[]}></tk-chart>
          </div>
          <div class="tkch-figure">
            <div class="tkch-figcaption">
              <span class="tkch-name">Одна точка</span>
              <span class="tkch-tag">точка без линии</span>
            </div>
            <tk-chart .points=${[{ value: 98.6, label: '10:00' }]}></tk-chart>
          </div>
        </div>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-chart')}`,
};
