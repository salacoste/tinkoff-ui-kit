import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './figure.js';

/**
 * tk-figure stories (spec 24.7, pattern wave 24a): the captioned media
 * block — the B6 (research iframes) + A8 (terminal videos) fusion, the
 * wave's ONLY new atom. Passive frame: the aspect box, the radius, the
 * muted backdrop, the caption line; the media rides the slot.
 *
 * DEMO MEDIA are neutral placeholders (the PD gate): an inline SVG chart
 * stub painted by the STORY's currentColor (theme-adaptive — the consumer
 * paints their own art), and an iframe whose srcdoc stub uses the system
 * Canvas/CanvasText colors (no hex, theme-adaptive inside its own
 * document). NO live embed URLs anywhere.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1).
 */

type FigureArgs = Record<string, never>;

/** Neutral chart stub — a currentColor polyline grid (the story paints it). */
const chartStub = html`
  <svg viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 300 L80 260 L160 280 L240 210 L320 240 L400 160 L480 190 L560 120 L640 140"
      fill="none"
      stroke="currentColor"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.85"
    ></path>
    <path
      d="M0 320 L80 305 L160 315 L240 285 L320 300 L400 255 L480 275 L560 220 L640 240"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      opacity="0.4"
    ></path>
  </svg>
`;

/** Iframe stub — srcdoc SVG on system colors (theme-adaptive, no hex). */
const IFRAME_STUB = `<style>html{background:Canvas;color:CanvasText;margin:0}svg{display:block;width:100%;height:100%}</style><svg viewBox="0 0 640 360" preserveAspectRatio="none"><path d="M0 300 L80 260 L160 280 L240 210 L320 240 L400 160 L480 190 L560 120 L640 140" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const canvasStyles = html`
  <style>
    /* Full-bleed story idiom: the visual harness paints no body background
       in dark, so the page behind the centered canvas must wear the token. */
    body {
      background: var(--tk-color-surface-base);
    }
    .tkfg-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32);
      max-width: 820px;
      margin: 0 auto;
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .tkfg-canvas h1 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkfg-note {
      margin: 0;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .tkfg-canvas section {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .tkfg-canvas h2 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    /* The consumer paints their own art — the stub rides currentColor. */
    .tkfg-chart {
      color: var(--tk-color-text-primary);
    }
    .tkfg-chart svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
`;

const meta: Meta<FigureArgs> = {
  title: 'Components/Figure',
  component: 'tk-figure',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<FigureArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tkfg-canvas">
      <h1>Figure</h1>
      <p class="tkfg-note">
        Подписанный медиаблок (spec 24.7): слияние исследовательских
        iframe-эмбедов и терминальных видео — один шейп на оба. Пассивная
        рамка: аспектный бокс (хук <code>--tk-figure-ratio</code>, дефолт
        16/9), радиус, приглушённый фон под грузящимся медиа и строка
        подписи (prop <code>caption</code> или слот; пока содержимого нет —
        узла figcaption нет вовсе). Медиа приезжает слотом
        <code>media</code>: iframe получает loading=lazy, img — lazy +
        decoding=async на любой глубине вложения. Stateless: ни событий,
        ни состояния. Демо-медиа здесь — нейтральные заглушки: инлайн-SVG
        красится консьюмером (currentColor), iframe-стаб — на системных
        цветах Canvas/CanvasText; живых URL эмбедов в ките нет.
      </p>
      <section>
        <h2>Чарт-вид — инлайн-SVG, подпись пропом</h2>
        <tk-figure class="tkfg-chart" caption="Динамика демо-индекса за год (заглушка)">
          <div slot="media">${chartStub}</div>
        </tk-figure>
      </section>
      <section>
        <h2>Embed-вид — iframe-заглушка, аспект 4/3</h2>
        <tk-figure
          caption="Внешний интерактивный график (демо-заглушка srcdoc)"
          style="--tk-figure-ratio: 4 / 3"
        >
          <iframe
            slot="media"
            title="Демо-график: нейтральная заглушка"
            srcdoc=${IFRAME_STUB}
          ></iframe>
        </tk-figure>
      </section>
      <section>
        <h2>Без подписи — узла figcaption нет</h2>
        <tk-figure class="tkfg-chart">
          <div slot="media">${chartStub}</div>
        </tk-figure>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-figure')}`,
};
