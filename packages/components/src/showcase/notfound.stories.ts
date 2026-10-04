import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../link/link.js';

/**
 * The 404 page (spec 24.10, pattern wave 24b): «Такой страницы нет» —
 * gap-8's nearly CHROMELESS notfound (978 px live frame): an
 * illustration, one h1, a support line and a block of links. The live
 * «404 with search» hypothesis was REFUTED by the census — no search, no
 * buttons, no inputs; links are the ONLY interactivity, and even the
 * logo is not an inline svg. The kit does exactly what the live page
 * does.
 *
 * THE NEGATIVE PINS (the story's subject — what is NOT here): 0 inputs,
 * 0 buttons, 0 forms. The DOM sweep below (and the probe pinned in the
 * prose) fixes the absences.
 *
 * THE ILLUSTRATION (the PD gate): the live art is not transcribed — this
 * is a neutral inline-SVG stub painted by story-level tokens (the live
 * page carries raster imgs; the kit never ships a copy). Decorative,
 * aria-hidden — the meaning lives in the h1.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type NotFoundArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .nf-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .nf-note {
      margin: 0;
      padding: var(--tk-space-24) var(--tk-space-24) 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE COMPOSITION (consumer layout): a centered column with plenty of
       air — the live frame's vertically-calm register (978 px). */
    .nf-stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--tk-space-24);
      padding: var(--tk-space-64) var(--tk-space-24);
      text-align: center;
    }
    .nf-art {
      color: var(--tk-color-text-secondary);
    }
    .nf-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-2-size);
      font-weight: var(--tk-text-heading-2-weight);
      line-height: var(--tk-text-heading-2-leading);
    }
    .nf-sub {
      margin: 0;
      max-width: 480px;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .nf-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--tk-space-8);
      margin-top: var(--tk-space-24);
    }
    .nf-links__row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--tk-space-24);
    }
  </style>
`;

/**
 * The illustration stub — a token-tinted «lost sheet» motif (a rounded
 * page slipping between rounded bars), painted by currentColor only.
 * Decorative by design: aria-hidden in the template, no text, no meaning
 * on its own — the h1 carries the semantics.
 */
const ART_STUB = html`
  <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
    <rect x="18" y="34" width="88" height="76" rx="10" opacity="0.25" fill="currentColor"></rect>
    <rect x="34" y="20" width="88" height="76" rx="10" opacity="0.5" fill="currentColor"></rect>
    <rect
      x="50"
      y="8"
      width="88"
      height="76"
      rx="10"
      stroke="currentColor"
      stroke-width="3"
      fill="var(--tk-color-surface-base)"
    ></rect>
    <path d="M68 32h44M68 46h44M68 60h26" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6"></path>
  </svg>
`;

const meta: Meta<NotFoundArgs> = {
  title: 'Invest/Not found',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<NotFoundArgs>;

export const PageMissing: Story = {
  name: 'Такой страницы нет',
  render: () => html`
    ${canvasStyles}
    <main class="nf-canvas">
      <p class="nf-note">
        404 (спека 24.10): страница почти без хрома — иллюстрация, h1,
        поддерживающая строка и ссылки. НЕГАТИВНЫЕ ПИНЫ (предмет истории):
        0 полей ввода, 0 кнопок, 0 форм — гипотеза «404 с поиском»
        опровергнута ценсусом; ссылки — единственная интерактивность, таб
        идёт по порядку ссылок. Иллюстрация — нейтральный SVG-стаб на
        токенах (живая — растровые картинки; ПД-гейт запрещает
        транскрипцию живого арта), aria-hidden: смысл несёт h1. Вертикально
        спокойный регистр — много воздуха (живой кадр 978 px). Обе темы —
        без правок состава: стаб перекрашивается токенами сам. Подписи
        ссылок вымышленные, по духу жанра.
      </p>
      <div class="nf-stage">
        <div class="nf-art" aria-hidden="true">${ART_STUB}</div>
        <h1 class="nf-title">Такой страницы нет</h1>
        <p class="nf-sub">
          Возможно, она переехала или никогда не существовала. Загляните на
          демо-хабы ниже — там все вымышленные разделы на месте.
        </p>
        <div class="nf-links">
          <div class="nf-links__row">
            <tk-link href="#" variant="standalone">Инвестиции</tk-link>
            <tk-link href="#" variant="standalone">Пульс</tk-link>
            <tk-link href="#" variant="standalone">Аналитика</tk-link>
          </div>
          <div class="nf-links__row">
            <tk-link href="#" variant="standalone">Витрина</tk-link>
            <tk-link href="#" variant="standalone">Профиль</tk-link>
            <tk-link href="#" variant="standalone">Поддержка</tk-link>
          </div>
        </div>
      </div>
    </main>
  `,
};
