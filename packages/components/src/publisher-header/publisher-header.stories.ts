import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import { apiReferenceDoc } from '../api-reference.js';

import './publisher-header.js';

/**
 * tk-publisher-header stories (spec 23.2, invest remainder wave): the
 * «Профиль в Пульсе» publisher row of the instrument page. Names and
 * subscriber counts are FICTIONAL per the recon law — no live profile
 * is transcribed; the badge chips' COLORS are kit tokens measured on
 * the reference page (their glyphs here are invented shapes).
 *
 * The chip carriers are the story's CANONICAL consumer snippet (the
 * hero-action mold: the kit owns the rail, the consumer owns each
 * chip): a d18 token-painted disc pair riding the invest-badge tokens.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root.
 */

type PublisherHeaderArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tkph-canvas {
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
    .tkph-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkph-canvas .tkph-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkph-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkph-canvas section {
      max-width: var(--tk-space-container);
    }
    .tkph-canvas code {
      font-family: var(--tk-font-mono);
    }
    .tkph-stack {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .tkph-figure {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      padding: var(--tk-space-16);
      background: var(--tk-color-surface-muted);
      border-radius: var(--tk-radius-md);
    }
    .tkph-figure .tkph-figcaption {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--tk-space-12);
    }
    .tkph-figure .tkph-name {
      font-size: var(--tk-text-body-m-bold-size);
      font-weight: var(--tk-text-body-m-bold-weight);
      line-height: var(--tk-text-body-m-leading);
    }
    .tkph-figure .tkph-tag {
      color: var(--tk-color-text-secondary);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
    }
    .tkph-figure tk-publisher-header {
      padding: var(--tk-space-4) 0; /* the row breathes inside the figure */
    }
  </style>
`;

/**
 * The canonical chip pair (the AC3 consumer snippet): d18 token-painted
 * carriers — the green verified disc (measured d12 ink on the pale ring)
 * and the blue official check. Glyphs are invented shapes on MEASURED
 * colors (the kit has no icon system — zero-media).
 */
const verifiedChip = html`
  <svg slot="badge" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="var(--tk-color-invest-badge-verified-backdrop)"></circle>
    <circle cx="9" cy="9" r="6" fill="var(--tk-color-invest-badge-verified)"></circle>
  </svg>
`;

const officialChip = html`
  <svg slot="badge" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="var(--tk-color-invest-badge-official-backdrop)"></circle>
    <path d="M5 9.2 7.8 12 13 6.5" fill="none" stroke="var(--tk-color-invest-badge-official)"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

const meta: Meta<PublisherHeaderArgs> = {
  title: 'Components/PublisherHeader',
  component: 'tk-publisher-header',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<PublisherHeaderArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkph-canvas">
      <h1>Publisher header</h1>
      <p class="tkph-note">
        Заголовок издателя «Профиль в Пульсе» (spec 23.2): диск-аватар,
        жирное имя с плашками верификации, серая строка подписчиков и
        слот-кнопка подписки — раскладка китовая, состояние подписки всегда
        на стороне потребителя (event-map пуст). Аватар и глифы плашек —
        контент слотов: у кита нет медиатеки, пустой аватар остаётся
        спокойным бледным диском-плейсхолдером по замеру. Имя и счётчик
        вымышленные. Хук-слой <code>--tk-publisher-header-*</code> — четыре
        переменные: размер диска, его подложка, отступ до имени, шаг плашек.
      </p>
      <section>
        <div class="tkph-stack">
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Полный заголовок</span>
              <span class="tkph-tag">avatar placeholder · name · badge ×2 · meta · action</span>
            </div>
            <tk-publisher-header name="Демо-профиль" meta="12,3 тыс. подписчиков">
              ${verifiedChip} ${officialChip}
              <tk-button slot="action" variant="primary">Подписаться</tk-button>
            </tk-publisher-header>
          </div>
        </div>
      </section>
    </main>
  `,
};

/** Degrades — the same row without its optional layers. */
export const Variants: Story = {
  name: 'Варианты',
  render: () => html`
    ${canvasStyles}
    <main class="tkph-canvas">
      <h1>Варианты</h1>
      <p class="tkph-note">
        Тот же ряд без необязательных слоёв: без плашек, без кнопки (ряд
        без action сжимается до текстового блока), без мета-строки, с
        аватаром-контентом вместо плейсхолдера и с длинным именем —
        переносится внутри блока, не выталкивая кнопку. Слот имени
        принимает настоящий заголовок документа. Имена и счётчики
        вымышленные.
      </p>
      <section>
        <div class="tkph-stack">
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Без плашек</span>
              <span class="tkph-tag">badge: пусто</span>
            </div>
            <tk-publisher-header name="Демо-профиль" meta="12,3 тыс. подписчиков">
              <tk-button slot="action" variant="primary">Подписаться</tk-button>
            </tk-publisher-header>
          </div>
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Без кнопки</span>
              <span class="tkph-tag">action: пусто</span>
            </div>
            <tk-publisher-header name="Обзоры демо-индекса" meta="987 подписчиков">
              ${verifiedChip}
            </tk-publisher-header>
          </div>
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Без мета-строки</span>
              <span class="tkph-tag">meta: пусто — узла нет</span>
            </div>
            <tk-publisher-header name="Демо-профиль">
              ${verifiedChip} ${officialChip}
            </tk-publisher-header>
          </div>
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Аватар контентом</span>
              <span class="tkph-tag">слот avatar — фигура потребителя</span>
            </div>
            <tk-publisher-header name="Демо-деск" meta="4,5 тыс. подписчиков">
              <svg slot="avatar" viewBox="0 0 35 35" aria-hidden="true">
                <circle cx="17.5" cy="17.5" r="17.5" fill="var(--tk-color-invest-badge-verified-backdrop)"></circle>
                <circle cx="17.5" cy="13" r="5.5" fill="var(--tk-color-invest-badge-verified)"></circle>
                <path d="M7 30a10.5 10.5 0 0 1 21 0Z" fill="var(--tk-color-invest-badge-verified)"></path>
              </svg>
              ${officialChip}
              <tk-button slot="action" variant="primary">Подписаться</tk-button>
            </tk-publisher-header>
          </div>
          <div class="tkph-figure">
            <div class="tkph-figcaption">
              <span class="tkph-name">Длинное имя со слотом-заголовком</span>
              <span class="tkph-tag">h3 slot name · перенос внутри блока</span>
            </div>
            <tk-publisher-header meta="1,9 тыс. подписчиков">
              <h3 slot="name">Стратегия долгосрочных инвестиций в демо-индекс широкого рынка</h3>
              ${verifiedChip}
              <tk-button slot="action" variant="primary">Подписаться</tk-button>
            </tk-publisher-header>
          </div>
        </div>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-publisher-header')}`,
};
