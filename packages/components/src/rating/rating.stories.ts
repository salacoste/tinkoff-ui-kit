import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './rating.js';

/**
 * tk-rating stories (spec 21.5, invest foundation wave): the read-only
 * star rating of the bond-catalog rows. Financial copy is FICTIONAL per
 * the recon law — the issuer names and ISINs below are invented, no
 * verbatim legal formulas, no figures.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root.
 */

type RatingArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkrt-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while the rating stays yellow — story chrome
         invisible (the 5.4 dark-sweep finding). Same token, zero
         branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkrt-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkrt-canvas .tkrt-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkrt-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkrt-canvas section {
      max-width: var(--tk-space-container);
    }
    .tkrt-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The playground grid of value rows: label left, stars right. */
    .tkrt-grid {
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: center;
      column-gap: var(--tk-space-24);
      row-gap: var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tkrt-grid .tkrt-label {
      color: var(--tk-color-text-secondary);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
    }
    /* The bonds grounding rows: instrument name, ISIN line, stars BELOW
       (the capture's anatomy — the cluster hangs under the identity). */
    .tkrt-rows {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      max-width: var(--tk-space-container);
    }
    .tkrt-row {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-4);
      padding: var(--tk-space-16);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-md);
    }
    .tkrt-row .tkrt-name {
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
    }
    .tkrt-row .tkrt-isin {
      color: var(--tk-color-text-secondary);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
    }
  </style>
`;

const meta: Meta<RatingArgs> = {
  title: 'Components/Rating',
  component: 'tk-rating',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<RatingArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkrt-canvas">
      <h1>Rating</h1>
      <p class="tkrt-note">
        Рейтинг-строка облигационного каталога (spec 21.5): только чтение —
        интерактивного ввода рейтинга в реке нет. Жёлтый — существующий токен
        кита, совпавший с живым замером байт-в-байт; пустых нейтральных
        звёзд живая строка не рисует — рисуются только заполненные. Дробная
        часть схемной сетки 0.5 — одна звезда с клип-путём по проценту
        ширины. Доступность: <code>role="img"</code> на самом элементе и
        <code>aria-label="Рейтинг N из 5"</code> с запятой-десятичной. Хук-слой
        <code>--tk-rating-*</code>: заливка и размер звезды.
      </p>
      <section>
        <h2>Сетка значений</h2>
        <div class="tkrt-grid">
          <span class="tkrt-label">value = 0</span><tk-rating value="0"></tk-rating>
          <span class="tkrt-label">value = 0.5</span><tk-rating value="0.5"></tk-rating>
          <span class="tkrt-label">value = 3</span><tk-rating value="3"></tk-rating>
          <span class="tkrt-label">value = 4.5</span><tk-rating value="4.5"></tk-rating>
          <span class="tkrt-label">value = 5</span><tk-rating value="5"></tk-rating>
        </div>
      </section>
    </main>
  `,
};

/**
 * The bonds grounding: three catalog rows — instrument name, ISIN line,
 * the star cluster BELOW the identity (the capture's anatomy one-to-one;
 * the wild values are the integers 3–5). Names and ISINs are FICTIONAL
 * (the recon law — invented issuers, toy ISINs).
 */
export const BondRating: Story = {
  name: 'Рейтинг облигации',
  render: () => html`
    ${canvasStyles}
    <main class="tkrt-canvas">
      <h1>Рейтинг облигации</h1>
      <p class="tkrt-note">
        Заземление bonds-каталога: звёздный кластер висит под именем
        инструмента и строкой ISIN, заливка — существующий жёлтый токен
        кита, совпавший с живым замером байт-в-байт, шаг 20 при лобах 16
        (гэп 4). Пиксельная таблица замера — в шапке rating.css.ts.
        Названия и ISIN вымышленные.
      </p>
      <section>
        <div class="tkrt-rows">
          <div class="tkrt-row">
            <span class="tkrt-name">Бета-Финанс БП1</span>
            <span class="tkrt-isin">RU000A0TKIT1</span>
            <tk-rating value="3"></tk-rating>
          </div>
          <div class="tkrt-row">
            <span class="tkrt-name">Гамма-Лизинг 001</span>
            <span class="tkrt-isin">RU000A0TKIT2</span>
            <tk-rating value="4"></tk-rating>
          </div>
          <div class="tkrt-row">
            <span class="tkrt-name">Дельта-Рента 02</span>
            <span class="tkrt-isin">RU000A0TKIT3</span>
            <tk-rating value="5"></tk-rating>
          </div>
        </div>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-rating')}`,
};
