import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './skeleton.js';

/**
 * tk-skeleton stories (spec 21.2, invest foundation wave): the three
 * shapes with their defaults, and the «загрузка каталога» demo — a
 * skeleton card standing in for a bonds-catalog card next to the loaded
 * one, the zero-layout-shift contract by the tj-news-card mold
 * (the bones mirror the content geometry; the swap moves nothing).
 * Financial copy is FICTIONAL per the recon law.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this
 * file sits inside the zero-hardcoded guard's scan root; the bone-size
 * overrides in the demo are prose literals of the STORY (the atom's
 * blind-spot contract: placeholder geometry is consumer data).
 */

type SkeletonArgs = Record<string, never>;

const canvasStyles = html`
  <style>
    .tksk-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      /* Canvas follows the theme's base surface (the tk-input 2.1
         precedent): without an explicit paint the browser canvas stays
         WHITE in dark while bones remap — story chrome invisible (the
         5.4 dark-sweep finding). Same token, zero branches. */
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tksk-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tksk-canvas .tksk-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tksk-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksk-canvas section {
      max-width: var(--tk-space-container);
    }
    .tksk-canvas code {
      font-family: var(--tk-font-mono);
    }
    /* The playground stack: bones with room to breathe. */
    .tksk-stack {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
    }
    /* The catalog demo cards — a STORY decoration (prose literal, tokens
       only): the consumer's card wrapper, the same mold the accordion's
       SBER demo carries. Two equal columns: the standing-in skeleton and
       the loaded content it must mirror. */
    .tksk-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--tk-space-16);
    }
    .tksk-card {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-12);
      padding: var(--tk-space-16);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .tksk-card .tksk-head {
      display: flex;
      align-items: center;
      gap: var(--tk-space-12);
    }
    /* The loaded card's fictional issuer mark — a STORY decoration
       (tokens only) mirroring the circle bone's 40×40 so the swap keeps
       its geometry. */
    .tksk-card .tksk-logo {
      flex: none;
      display: grid;
      place-items: center;
      width: var(--tk-space-40);
      height: var(--tk-space-40);
      border-radius: 50%;
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
      font-weight: var(--tk-text-body-m-bold-weight);
    }
    .tksk-card h3 {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tksk-card p {
      margin: 0;
      color: var(--tk-color-text-secondary);
    }
    .tksk-card .tksk-meta {
      display: flex;
      gap: var(--tk-space-16);
      color: var(--tk-color-text-secondary);
    }
    .tksk-card .tksk-meta strong {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-m-bold-weight);
    }
  </style>
`;

const meta: Meta<SkeletonArgs> = {
  title: 'Components/Skeleton',
  component: 'tk-skeleton',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<SkeletonArgs>;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tksk-canvas">
      <h1>Skeleton</h1>
      <p class="tksk-note">
        Нейтральная кость-плейсхолдер загрузки инвест-поверхностей (spec
        21.2): три формы — <code>line</code> (строка текста, дефолт),
        <code>circle</code> (место лого/аватара), <code>rect</code> (блок
        медиа). Геометрия по умолчанию: line — вся ширина × 12px, circle —
        40×40, rect — вся ширина × 80px; атрибуты <code>width</code> /
        <code>height</code> переопределяют точечными значениями. Кость
        декоративна — <code>aria-hidden</code> из коробки, состояния
        загрузки держит контейнер потребителя (<code>aria-busy</code>).
        Пульс — мягкое дыхание прозрачности 1↔0.5 за ~1.4s; при
        <code>prefers-reduced-motion: reduce</code> кость замирает (базлайны
        этого гейса снимаются именно в reduce — кадры детерминированы).
        Мерцающего градиента нет: свип на живом сайте не доказан — не
        выдумываем.
      </p>
      <section>
        <h2>Дефолты форм</h2>
        <div class="tksk-stack">
          <tk-skeleton variant="line"></tk-skeleton>
          <tk-skeleton variant="circle"></tk-skeleton>
          <tk-skeleton variant="rect"></tk-skeleton>
        </div>
      </section>
      <section>
        <h2>Произвольные размеры</h2>
        <div class="tksk-stack">
          <tk-skeleton width="320px" height="20px"></tk-skeleton>
          <tk-skeleton width="180px" height="8px"></tk-skeleton>
          <tk-skeleton variant="rect" width="280px" height="120px"></tk-skeleton>
          <tk-skeleton variant="circle" width="56px" height="56px"></tk-skeleton>
        </div>
      </section>
    </main>
  `,
};

/**
 * The bonds-catalog grounding: the skeleton card stands in for the loaded
 * card — same wrapper, same head/media/meta anatomy, the bones mirroring
 * the content geometry (the tj-news-card zero-layout-shift contract).
 * The standing-in section carries aria-busy="true" — the CONSUMER
 * attribute that tells assistive tech «content is loading»; the bones
 * themselves stay aria-hidden.
 */
export const CatalogLoading: Story = {
  name: 'Загрузка каталога',
  render: () => html`
    ${canvasStyles}
    <main class="tksk-canvas">
      <h1>Загрузка каталога</h1>
      <p class="tksk-note">
        Заземление каталога облигаций: слева карточка-скелетон (место
        лого-<code>circle</code>, две строки эмитента, медиа-<code>rect</code>,
        строка метаданных), справа — она же с загрузившимся содержимым.
        Кости повторяют геометрию контента точечными
        <code>width</code>/<code>height</code> — смена состояния не двигает
        макет (контракт zero-layout-shift, молд tj-news-card). Секция
        плейсхолдера несёт <code>aria-busy="true"</code> — атрибут
        потребителя, атом остаётся <code>aria-hidden</code>. Тексты
        вымышленные.
      </p>
      <section class="tksk-grid">
        <div class="tksk-card" aria-busy="true">
          <div class="tksk-head">
            <tk-skeleton variant="circle"></tk-skeleton>
            <div class="tksk-stack" style="flex: 1">
              <tk-skeleton width="220px" height="20px"></tk-skeleton>
              <tk-skeleton width="140px" height="12px"></tk-skeleton>
            </div>
          </div>
          <tk-skeleton variant="rect" height="96px"></tk-skeleton>
          <tk-skeleton width="260px" height="12px"></tk-skeleton>
        </div>
        <div class="tksk-card">
          <div class="tksk-head">
            <span class="tksk-logo" aria-hidden="true">О</span>
            <div>
              <h3>ОФК-Гарант</h3>
              <p>Корпоративная облигация</p>
            </div>
          </div>
          <p>
            Долговая бумага с фиксированным купоном; размещение и вторичные
            торги — на биржевом режиме.
          </p>
          <div class="tksk-meta">
            <span>Погашение: <strong>через 3 года</strong></span>
            <span>Купон: <strong>раз в полгода</strong></span>
          </div>
        </div>
      </section>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => html`${apiReferenceDoc('tk-skeleton')}`,
};
