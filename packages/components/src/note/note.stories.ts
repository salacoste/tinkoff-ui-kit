import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './note.js';

/**
 * tk-note stories (spec 21.4, invest foundation wave): the quiet
 * fine-print note of the invest catalogs — the neutral card (bonds
 * grounding: white card on a muted page, «Показать» reveal) and the
 * bare info line (currency grounding: blue label + fine print, no
 * card). Financial copy is FICTIONAL per the recon law (no verbatim
 * legal formulas, no figures).
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root. The muted
 * page around the neutral card is the GROUNDING's own surface (the
 * live catalog page is gray), not a story decoration.
 */

type NoteArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tknt-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while the note remaps — story chrome invisible
         (the 5.4 dark-sweep finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tknt-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tknt-canvas .tknt-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tknt-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tknt-canvas section {
      max-width: var(--tk-space-container);
    }
    .tknt-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The bonds grounding surface: the catalog PAGE is muted and the
       note's white card floats on it (the live page bg ≈ surface-muted —
       the pixel table in note.css.ts). */
    .tknt-page {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-md);
    }
    /* The right-rail width of the live bonds note (~267px measured) —
       the atom sets no width of its own. */
    .tknt-rail {
      max-width: 267px;
    }
  </style>
`;

const meta: Meta<NoteArgs> = {
  title: 'Components/Note',
  component: 'tk-note',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<NoteArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tknt-canvas">
      <h1>Note</h1>
      <p class="tknt-note">
        Тихая заметка-дисклеймер инвест-каталогов (spec 21.4): постоянный блок,
        который не тост и не модал. Тон <code>neutral</code> — белая карточка на
        приглушённой странице (заземление bonds); тон <code>info</code> — синяя
        строка-метка и мелкий текст без карточки (заземление currency).
        Иконки по умолчанию НЕТ — ни одно живое заземление её не рисует; слот
        <code>icon</code> пуст, пока потребитель не положит глиф.
        <code>collapsible</code> добавляет хвост «Показать/Скрыть»: закрытое
        состояние — кламп на три строки, раскрытое — полный текст. Хук-слой
        <code>--tk-note-*</code>: заливка, радиус, тон текста, ритм.
      </p>
      <section>
        <h2>Neutral — карточка дисклеймера</h2>
        <div class="tknt-page">
          <div class="tknt-rail">
            <tk-note collapsible>
              Каталог носит информационный характер: бумаги показаны по
              рыночной доступности, состав списка может меняться по мере
              обновления данных торгов. Доходность прошлых периодов не
              определяет доходность в будущем — оценивайте риски каждого
              выпуска и читайте документы эмитента перед сделкой.
            </tk-note>
          </div>
        </div>
      </section>
      <section>
        <h2>Info — строка без карточки</h2>
        <tk-note tone="info" label="Информация">
          Курс указан для справки и не является офертой. Перед обменом
          проверьте итоговую котировку в приложении.
        </tk-note>
      </section>
    </main>
  `,
};

/**
 * The bonds grounding: the muted catalog page, the white note card in
 * the right rail, the 3-line clamp and the «Показать» tail — the
 * capture's anatomy one-to-one (fine print + reveal link), RU copy
 * fictional.
 */
export const CatalogDisclaimer: Story = {
  name: 'Дисклеймер каталога',
  render: () => html`
    ${canvasStyles}
    <main class="tknt-canvas">
      <h1>Дисклеймер каталога</h1>
      <p class="tknt-note">
        Заземление bonds-каталога: приглушённая страница, в правой колонке —
        белая карточка дисклеймера с клампом и хвостом «Показать» (синяя
        текстовая строка без подчёркивания — живой замер). Пиксельная таблица
        замера — в шапке note.css.ts. Текст вымышленный, без чисел и дословных
        юридических формул.
      </p>
      <section>
        <div class="tknt-page">
          <div class="tknt-rail">
            <tk-note collapsible>
              Страница носит информационный характер и не является
              индивидуальной инвестиционной рекомендацией. Инструменты
              показаны по рыночной доступности; котировки могут
              задерживаться. Убедитесь, что понимаете условия каждого
              выпуска, и обратитесь к документам эмитента перед покупкой —
              стоимость активов может как расти, так и снижаться.
            </tk-note>
          </div>
        </div>
      </section>
    </main>
  `,
};

/**
 * The same collapsible note fully open — the second state of the AC4
 * pair. The tail reads «Скрыть», the clamp is gone, the whole fine
 * print reads through.
 */
export const DisclaimerOpen: Story = {
  name: 'Раскрытый дисклеймер',
  render: () => html`
    ${canvasStyles}
    <main class="tknt-canvas">
      <h1>Раскрытый дисклеймер</h1>
      <p class="tknt-note">
        Второе состояние пары collapsible: <code>open</code> отражается в
        атрибут, хвост читается «Скрыть», кламп снят. Хвост — кнопка с
        <code>aria-expanded</code> (контракт tk-accordion-item, без
        aria-controls); событие <code>open-change</code> молчит на первом
        рендере и стреляет на каждом реальном переключении.
      </p>
      <section>
        <div class="tknt-page">
          <div class="tknt-rail">
            <tk-note collapsible open>
              Страница носит информационный характер и не является
              индивидуальной инвестиционной рекомендацией. Инструменты
              показаны по рыночной доступности; котировки могут
              задерживаться. Убедитесь, что понимаете условия каждого
              выпуска, и обратитесь к документам эмитента перед покупкой —
              стоимость активов может как расти, так и снижаться.
            </tk-note>
          </div>
        </div>
      </section>
    </main>
  `,
};

/**
 * The currency grounding: NO card — the blue «Информация» label above
 * bare fine print on the page surface (the atom's info tone), RU copy
 * fictional.
 */
export const CurrencyInfo: Story = {
  name: 'Инфо-строка валюты',
  render: () => html`
    ${canvasStyles}
    <main class="tknt-canvas">
      <h1>Инфо-строка валюты</h1>
      <p class="tknt-note">
        Заземление currency-страницы: без карточки — синяя метка
        «Информация» обычного веса, под ней мелкий серый текст. Метка —
        свойство <code>label</code>; цвет метки — существующий link-токен,
        новый не минтуется. Появление метки — только когда свойство не
        пустое.
      </p>
      <section>
        <tk-note tone="info" label="Информация">
          Курсы и котировки приводятся для справки и не являются офертой
          или индивидуальной инвестиционной рекомендацией. Итоговый курс
          операции фиксируется банком в момент её проведения и может
          отличаться от показанного здесь.
        </tk-note>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-note')}`,
};
