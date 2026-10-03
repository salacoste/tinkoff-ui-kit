import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * The stat-tile row (spec 24.4, pattern wave 24a): the big-number marketing
 * register (gap-7 IPO «12 лет»-style bordered row + gap-1 hub's ONE dark
 * inverted card in the row). All existing tokens/registers — zero atom
 * edits, zero new tokens; the dark tile is a CONSUMER class on the
 * theme-invariant charcoal (the hero/promo-card charcoal mold: white pairs,
 * stays dark in BOTH themes — a theme-invariant block, not a dark-theme
 * mode).
 *
 * SEMANTICS (AC2): the row is role=list / role=listitem (the kv-list mold —
 * dl-semantic doesn't cross slots), every label VISIBLE (the number's
 * meaning never rides an icon).
 *
 * ICONS are consumer svgs (zero-media): simple line glyphs on text tokens.
 *
 * DATA (the PD gate): every figure is FICTIONAL — the live numbers are a
 * SHAPE reference only, never transcribed; RU content, EN story meta.
 */

const NBSP = '\u00A0';

interface StatTile {
  value: string;
  label: string;
  dark?: boolean;
  glyph: 'calendar' | 'chart' | 'clock' | 'users';
}

const TILES: StatTile[] = [
  { value: `10${NBSP}лет`, label: 'демо-платформе на рынке', glyph: 'calendar' },
  { value: `120+`, label: 'вымышленных инструментов в каталоге', glyph: 'chart' },
  { value: '24/7', label: 'поддержка в демо-режиме', dark: true, glyph: 'clock' },
  { value: `3,8${NBSP}млн`, label: 'демо-пользователей', glyph: 'users' },
];

/** Consumer line glyphs (zero-media — svgs on text tokens, decorative). */
const glyph = (name: StatTile['glyph']) => {
  const paths: Record<StatTile['glyph'], string> = {
    calendar: 'M4 6.5h16v13H4zM8 3.5v4M16 3.5v4M4 11h16',
    chart: 'M5 19V9M10 19V5M15 19v-7M20 19v-4',
    clock: 'M14.5 19a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM14.5 11.5V8M14.5 11.5l3 3',
    users: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0',
  };
  return html`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d=${paths[name]}
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  `;
};

const canvasStyles = html`
  <style>
    .st-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .st-layout {
      max-width: var(--tk-space-container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .st-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .st-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .st-section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .st-section__title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .st-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: var(--tk-space-16);
      list-style: none;
      margin: 0;
      padding: 0;
    }
    /* TILE RECIPE (consumer CSS): bordered cell, icon row, heading-register
       VALUE (heading-3 scale), visible body-s label. */
    .st-tile {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
      padding: var(--tk-space-24);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
      min-width: 0;
    }
    .st-tile__glyph {
      color: var(--tk-color-text-secondary);
    }
    .st-tile__value {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
      letter-spacing: -0.01em;
      overflow-wrap: anywhere;
    }
    .st-tile__label {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE DARK TILE (the gap-1 hub shape): one inverted card in the row —
       theme-invariant charcoal + white pairs (the hero charcoal mold: it
       stays dark in BOTH themes; not a dark-theme mode). */
    .st-tile--dark {
      background: var(--tk-color-tint-charcoal);
      border-color: var(--tk-color-tint-charcoal);
    }
    .st-tile--dark .st-tile__glyph,
    .st-tile--dark .st-tile__label {
      color: var(--tk-color-white);
      opacity: 0.72;
    }
    .st-tile--dark .st-tile__value {
      color: var(--tk-color-white);
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Stat tiles',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const StatTiles: Story = {
  name: 'Показатели',
  render: () => html`
    ${canvasStyles}
    <main class="st-canvas">
      <p class="st-note">
        Ряд показателей (спека 24.4): маркетинговый регистр «большое число +
        подпись» — тайлы на существующих токенах, ноль правок атомов.
        Рецепт: сетка auto-fit minmax(210px, 1fr); тайл — рамка
        border-default, радиус lg, глиф-строка (консьюмерский svg, декор),
        значение в heading-3 регистре и ВИДИМАЯ подпись body-s. ОДНА тёмная
        карточка в ряду — тема-инвариантный charcoal с белой парой (молд
        hero-карт: остаётся тёмной в обеих темах, это не тёмная тема, а
        инверсный блок). Семантика: role=list/listitem (молд kv-list),
        подписи видны — смысл числа никогда не передаётся иконкой. Обе темы — без
        правок состава. Все числа вымышленные: живые цифры — только форма
        паттерна, значения не транскрибируются.
      </p>
      <div class="st-layout">
        <h1 class="st-title">Платформа в цифрах</h1>
        <section class="st-section" aria-labelledby="st-row-title">
          <h2 class="st-section__title" id="st-row-title">Ключевые показатели</h2>
          <div class="st-row" role="list">
            ${TILES.map(
              (tile) => html`
                <div
                  class="st-tile${tile.dark ? ' st-tile--dark' : ''}"
                  role="listitem"
                >
                  <span class="st-tile__glyph">${glyph(tile.glyph)}</span>
                  <p class="st-tile__value">${tile.value}</p>
                  <p class="st-tile__label">${tile.label}</p>
                </div>
              `,
            )}
          </div>
        </section>
      </div>
    </main>
  `,
};
