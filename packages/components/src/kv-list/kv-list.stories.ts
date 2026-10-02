import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './kv-list.js';
import './kv-list-item.js';

/**
 * tk-kv-list stories (spec 22.4): the invest spec-list atom — the bond
 * «Информация о выпуске» shape (gray label left, near-black value flush
 * right, 1px hairlines, «?» hint tooltips), the sandbox covering the
 * family's whole surface (hints, slot overrides, delta-toned values,
 * degenerate rows), and the CEM API table.
 *
 * Grounding measurements (the 2x anatomy lens on the bond capture): row
 * pitch 33–34px (kit: 4px padding + 24px line box + 1px divider), label
 * ~16px regular gray → body-m 400 text-secondary (the nearest scale step,
 * 1px down — recorded), value ~16px 500 near-black flush right → body-m
 * bold, ⓘ 14–16px solid gray (~#b0b0b0) with white «?» → 16px gray-400
 * roundel, gap ≈8px → space-8. Fictional values throughout (the PD gate).
 *
 * The hint button is the family's ONLY interactive surface — a real tab
 * stop whose tooltip behavior (300ms hover/focus delay, click/tap toggle,
 * Esc) is the composed tk-tooltip's own contract. The block heading above
 * the live rows is consumer-side markup, not an atom prop.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

const canvasStyles = html`
  <style>
    .tkv-canvas {
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
    .tkv-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkv-canvas .tkv-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkv-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
    }
    .tkv-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkv-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkv-canvas .tkv-frame {
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      padding: var(--tk-space-8) var(--tk-space-16);
    }
    /* Consumer-side value tones (the sber «Показатели» shape): the delta
       pair rides the VALUE SLOT's content — the atom never guesses a tone. */
    .tkv-canvas .tkv-delta--up {
      color: var(--tk-color-delta-positive);
    }
    .tkv-canvas .tkv-delta--down {
      color: var(--tk-color-delta-negative);
    }
  </style>
`;

const meta: Meta = {
  title: 'Components/KvList',
  component: 'tk-kv-list',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkv-canvas">
      <h1>KvList</h1>
      <p class="tkv-note">
        Список «параметр — значение»: серый лейбл слева, почти чёрное значение
        прижато к правому краю, между строками 1px-разделители (высота строки
        ≈33px — замер живого блока). Лейбл — проп или слот <code>label</code>
        (слот сильнее), значение — только слот <code>value</code>. Проп
        <code>hint</code> рисует серый круглый «?» рядом с лейблом — это
        настоящая кнопка (таб-стоп, зона 44px) со встроенным tk-tooltip:
        подсказка появляется по ховеру/фокусу через 300 мс, по клику — сразу,
        Esc закрывает. Это подсказка, а не раскрытие: у кнопки нет
        aria-expanded. Список статичен — событий нет.
      </p>
      <figure>
        <div class="tkv-frame">
          <tk-kv-list>
            <tk-kv-list-item label="Номинал">
              <span slot="value">1 000 ₽</span>
            </tk-kv-list-item>
            <tk-kv-list-item
              label="Доходность к погашению"
              hint="Вымышленная справка: доходность рассчитана к дате погашения с учётом цены покупки."
            >
              <span slot="value">14,70 %</span>
            </tk-kv-list-item>
            <tk-kv-list-item hint="Ещё одна вымышленная справка — лейбл задан слотом.">
              <span slot="label">Накопленный купонный доход</span>
              <span slot="value">195 327,05088 ₽</span>
            </tk-kv-list-item>
            <tk-kv-list-item label="Купон">
              <span slot="value">Фиксированный</span>
            </tk-kv-list-item>
            <tk-kv-list-item label="Изменение цены за день">
              <span slot="value" class="tkv-delta--up">+2,4 %</span>
            </tk-kv-list-item>
            <tk-kv-list-item label="Изменение цены за месяц">
              <span slot="value" class="tkv-delta--down">−1,1 %</span>
            </tk-kv-list-item>
            <tk-kv-list-item label="Кастодиальный счёт"></tk-kv-list-item>
          </tk-kv-list>
        </div>
        <figcaption>
          строки без тултипа / с тултипом (проп и слот-лейбл), длинное значение
          в одну строку, дельта-тона значения (токены 22.2, красит контент
          слота), пустой слот значения — деградация без падения
        </figcaption>
      </figure>
    </main>
  `,
};

export const Issue: Story = {
  name: 'Информация о выпуске',
  render: () => html`
    ${canvasStyles}
    <main class="tkv-canvas">
      <h1>Информация о выпуске</h1>
      <p class="tkv-note">
        Заземление — карточка облигации (invest-хаб): блок
        «Информация о выпуске» под описанием бумаги. Замеры линзы (кроп 2x):
        строки 33–34px, лейбл ~16px обычный серый, значение ~16px полужирное
        почти чёрное прижато вправо, разделители 1px светло-серые на всю
        ширину (ближайший токен — border-table), «?» — серый круг ~15px с
        белым глифом через ~8px после лейбла. В ките
        лейбл/значение — ближайшие шаги шкалы (15px body-m), «?» — gray-400,
        разделитель — border-table; заголовок блока — разметка консьюмера,
        не проп атома. Все значения вымышленные (ПД-гейт).
      </p>
      <figure>
        <tk-kv-list>
          <tk-kv-list-item
            label="Доходность к погашению"
            hint="Вымышленная справка: доходность к дате погашения с учётом текущей цены."
          >
            <span slot="value">14,70 %</span>
          </tk-kv-list-item>
          <tk-kv-list-item label="Дата погашения облигации">
            <span slot="value">19.06.2027</span>
          </tk-kv-list-item>
          <tk-kv-list-item label="Дата выплаты купона">
            <span slot="value">23.06.2027</span>
          </tk-kv-list-item>
          <tk-kv-list-item label="Купон" hint="Вымышленная справка: тип купона по решению о выпуске.">
            <span slot="value">Фиксированный</span>
          </tk-kv-list-item>
          <tk-kv-list-item label="Накопленный купонный доход">
            <span slot="value">195 327,05088 ₽</span>
          </tk-kv-list-item>
          <tk-kv-list-item label="Величина купона">
            <span slot="value">74,68 ₽</span>
          </tk-kv-list-item>
        </tk-kv-list>
        <figcaption>
          «Информация о выпуске» (22.4): 6 строк заземления, тултипы у
          «Доходность к погашению» и «Купон», длинный НКД в одну строку
        </figcaption>
      </figure>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tk-kv-list'),
};
