import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../figure/figure.js';
import '../note/note.js';
import '../tabs/tabs.js';
import type { TkTab } from '../tabs/tabs.js';

/**
 * The research longread (spec 24.7, pattern wave 24a — the wave's closing
 * composition): the invest research page assembled from the wave's atoms
 * with tk-figure, the ONLY new atom of the wave (the B6 research-iframe +
 * A8 terminal-video fusion demonstrated TWICE: a chart view and a video
 * view). Zero other new components, zero token edits.
 *
 * GROUNDING (gap-8, honest two-layer): the live longread carries ALL its
 * data-viz as sandboxed iframe embeds; byline/TOC/footnote details are
 * census-UNVERIFIED — only the PROVEN parts enter: the byline ROW (a slot
 * composition — the publisher-header avatar disc is NOT reused without a
 * pin: a plain consumer line), the h1, the lead, the prose flow on the
 * BANK registers (NOT tj-prose — the gap-8 ruling: Charter-scale is the
 * wrong instrument), the figure stream, the section tabs, the closing
 * ИИР note (the 23.3 formula, not a copied legal text).
 *
 * HEADINGS (AC4): exactly one h1, sections h2, panels h3 — axe both themes.
 *
 * DATA (the PD gate): the research text, figures and video are FICTIONAL
 * demo content; the demo media are neutral stubs (inline currentColor SVG;
 * a bare <video controls> shell) — NO live embed URLs. RU content, EN
 * story meta.
 */

const SECTION_TABS: TkTab[] = [
  { value: 'scenario', label: 'Сценарий' },
  { value: 'method', label: 'Методология' },
  { value: 'risks', label: 'Риски' },
];

/** Neutral chart stub — currentColor polyline grid (the story paints it). */
const chartStub = html`
  <svg viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 290 L80 250 L160 270 L240 200 L320 230 L400 150 L480 180 L560 110 L640 130"
      fill="none"
      stroke="currentColor"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.85"
    ></path>
    <path
      d="M0 320 L80 308 L160 316 L240 288 L320 302 L400 258 L480 276 L560 224 L640 242"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      opacity="0.4"
    ></path>
  </svg>
`;

const canvasStyles = html`
  <style>
    .rs-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .rs-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .rs-article {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    /* BYLINE (consumer row — the avatar disc is NOT reused without a pin):
       a plain line, body-s on text-secondary, meta dots. */
    .rs-byline {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--tk-space-8);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .rs-byline__name {
      color: var(--tk-color-text-primary);
      font-weight: 500;
    }
    .rs-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .rs-lead {
      margin: 0;
      font-size: var(--tk-text-body-l-size);
      line-height: var(--tk-text-body-l-leading);
      color: var(--tk-color-text-secondary);
    }
    /* PROSE on the BANK registers (the gap-8 ruling — NOT tj-prose). */
    .rs-prose {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-16);
    }
    .rs-prose h2 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .rs-prose h3 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .rs-prose p {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
    }
    .rs-figures {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    /* The consumer paints their own chart stub — currentColor. */
    .rs-chart {
      color: var(--tk-color-text-primary);
    }
    .rs-chart svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
`;

const meta: Meta = {
  title: 'Invest/Research',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const ResearchLongread: Story = {
  name: 'Исследование',
  render: () => html`
    ${canvasStyles}
    <main class="rs-canvas">
      <p class="rs-note">
        Лонгрид исследования (спека 24.7, закрывающая композиция волны
        24a): byline-строка → h1 → лид → поток прозы в банковских регистрах
        (НЕ tj-prose — замер gap-8: журнальная шкала здесь ложный
        инструмент) → поток фигур tk-figure ×2 (чарт-вид инлайн-SVG и
        video-вид — двойная демонстрация слияния B6+A8) → табы секций →
        ИИР-приписка формулой 23.3. Byline — слот-композиция консьюмера
        (аватар-диск publisher-header не реюзится без пина); детали
        byline/TOC/сноски на живой странице не верифицированы census-замером — в
        сторю входят только доказанные части. Заголовки: один h1, секции
        h2, панели h3 — обе темы, axe. Все тексты, графики и видео —
        вымышленные демо-заглушки: живых URL эмбедов в ките нет и не будет
        (zero-media).
      </p>
      <article class="rs-article">
        <p class="rs-byline">
          <span class="rs-byline__name">Демо-аналитик</span>
          <span>·</span>
          <span>Вымышленная аналитическая группа</span>
          <span>·</span>
          <time datetime="2026-10">Октябрь 2026</time>
          <span>·</span>
          <span>Исследование</span>
        </p>
        <h1 class="rs-title">Демо-индекс широкого рынка: сценарий на год</h1>
        <p class="rs-lead">
          Вымышленный сценарный разбор демо-индекса: три траектории,
          методология и риски. Все числа и выводы — демонстрационные.
        </p>

        <div class="rs-prose">
          <h2>Ключевая идея</h2>
          <p>
            Демо-индекс собран из вымышленных бумаг для демонстрации
            композиции страницы. В демо-сценарии индекс держит условный
            диапазон, а волатильность описывается тремя траекториями —
            базовой, ускоренной и консервативной.
          </p>
        </div>

        <div class="rs-figures">
          <tk-figure class="rs-chart" caption="Траектории демо-индекса, заглушка (инлайн-SVG)">
            <div slot="media">${chartStub}</div>
          </tk-figure>
          <tk-figure
            caption="Видеоразбор сценария (демо-заглушка плеера без источника)"
            style="--tk-figure-ratio: 16 / 9"
          >
            <video slot="media" controls title="Демо-видеоразбор: заглушка плеера"></video>
          </tk-figure>
        </div>

        <tk-tabs .tabs=${SECTION_TABS} default-value="scenario">
          <div class="rs-prose" slot="tab-0">
            <h3>Базовая траектория</h3>
            <p>
              В базовом демо-сценарии индекс движется вдоль условной
              средней линии с умеренными отклонениями. Числа вымышленные,
              прогноз не является инвестиционной рекомендацией.
            </p>
            <h3>Ускоренная траектория</h3>
            <p>
              Ускоренный сценарий предполагает более крутую условную
              кривую — демонстрация того, как фигура в тексте меняет
              подпись и акцент, а не смысл.
            </p>
          </div>
          <div class="rs-prose" slot="tab-1">
            <h3>Методология</h3>
            <p>
              Демо-методология описывает вымышленный способ расчёта
              траекторий: три линии, условные окна наблюдения и
              нормировка на старте периода. Формула намеренно не
              приводится — это демонстрация вёрстки, а не расчёта.
            </p>
          </div>
          <div class="rs-prose" slot="tab-2">
            <h3>Риски</h3>
            <p>
              Демо-перечень рисков: рыночный, валютный и модельный. Любые
              совпадения с реальными индексами исключены по построению —
              данные синтетические.
            </p>
          </div>
        </tk-tabs>

        <tk-note tone="info" label="Информация">
          Демо-исследование подготовлено на вымышленных данных и не
          является индивидуальной инвестиционной рекомендацией. Все
          цифры, траектории и выводы приведены исключительно для
          демонстрации композиции страницы.
        </tk-note>
      </article>
    </main>
  `,
};
