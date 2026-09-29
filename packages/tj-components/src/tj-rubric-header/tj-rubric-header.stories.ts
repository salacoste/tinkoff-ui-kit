import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './tj-rubric-header.js';

/**
 * tj-rubric-header stories (spec 16.2): the rubric landing head — playground,
 * the slot/overlap anatomy (incl. the graceful-empty cases), and the FR-22
 * accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Placeholder art: NEUTRAL named-color SVG data URLs (the bank store-badges
 * mold — a placeholder image is content, but stays clean of hex literals).
 */

const COVER_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1180 215'><rect width='1180' height='215' fill='gray'/><circle cx='920' cy='215' r='150' fill='silver'/><circle cx='260' cy='215' r='110' fill='darkgray'/></svg>`,
)}`;

const MARK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='30' fill='dimgray'/><circle cx='50' cy='50' r='22' fill='white'/></svg>`,
)}`;

const canvasStyles = html`
  <style>
    .tjrh-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjrh-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjrh-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjrh-canvas p,
    .tjrh-canvas .tjrh-note {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
      /* ink-300: the AA meta step — ink-200 is light-CTA-fill duty only
         (15.2 contract) and fails contrast on the dark canvas. */
      color: var(--tj-color-ink-300);
      /* Card surface, not ink: the reference's notes are cards over the gray
         page — ink-300 is AA on the card, 4.478 on the bare page. */
      background: var(--tj-color-card);
      padding: var(--tj-space-12) var(--tj-space-16);
      border-radius: var(--tj-radius-card);
    }
    .tjrh-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjrh-canvas td,
    .tjrh-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjrh-stage {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Rubric Header',
  component: 'tj-rubric-header',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjrh-canvas" lang="ru">
      <h1>tj-rubric-header</h1>
      <p class="tjrh-note">
        Шапка рубрики: карточка с радиусом <code>--tj-radius-panel</code>,
        обложка с клипом верхних углов, сквиркл-марка 100×100, наполовину
        заходящая за границу обложки, и заголовок рубрики-владельца
        (<code>::slotted(h1)</code> — компонент никогда не рендерит свой
        заголовок). Side-by-side цель для базлайн-сверки:
        <code>tj-rubric-news-viewport-2026-09-28.png</code>.
      </p>
      <div class="tjrh-stage">
        <tj-rubric-header>
          <img slot="cover" src=${COVER_PLACEHOLDER} alt="" />
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <h1>Новости</h1>
          <p>Рассказываем всё важное и объясняем, как оно влияет на жизнь</p>
        </tj-rubric-header>
      </div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия: слоты и оверлап',
  render: () => html`
    ${canvasStyles}
    <main class="tjrh-canvas" lang="ru">
      <h1>Анатомия: слоты и оверлап</h1>
      <p class="tjrh-note">
        Три слота: <code>cover</code> (img с object-fit cover и клипом верхних
        углов радиусом panel; alt обязателен по контракту — пустой alt допустим
        для декоративных обложек), <code>mark</code> (сквиркл-арт; обёртка
        компонента — <code>aria-hidden</code>, это декорация), и дефолтный
        слот — <code>h1</code> рубрики + абзац-подзаголовок. Наложение
        −50px = ровно половина марки 100×100 за границей обложки — структурный
        FLAG спеки (не измерено), подтверждается базлайн-сверкой.
      </p>
      <div class="tjrh-stage">
        <tj-rubric-header>
          <img slot="cover" src=${COVER_PLACEHOLDER} alt="" />
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <h1>Новости</h1>
          <p>Подзаголовок: card-title 17/400 — масштабный пик спеки, вид не измерен</p>
        </tj-rubric-header>
      </div>
      <h2>Пустые слоты — деградация без поломок</h2>
      <p class="tjrh-note">
        Контракт крайних случаев спеки: без обложки — марка НЕ заходит за
        границу (оверлап-класс не навешивается, отрицательный отступ не
        применяется); без марки — блока марки нет вообще; без дефолтного
        слота — пустое тело карточки. Ни один случай не ломает вёрстку.
      </p>
      <div class="tjrh-stage">
        <tj-rubric-header>
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <h1>Новости</h1>
        </tj-rubric-header>
      </div>
      <div class="tjrh-stage">
        <tj-rubric-header>
          <img slot="cover" src=${COVER_PLACEHOLDER} alt="" />
          <h1>Новости без марки</h1>
        </tj-rubric-header>
      </div>
      <h2>Свои теги в слотах (BYO-контракт)</h2>
      <p class="tjrh-note">
        Неизвестные теги проходят без стилей как инертный passthrough: компонент
        стилизует только <code>::slotted(h1)</code>/<code>::slotted(p)</code> в
        дефолтном слоте и <code>::slotted(img)</code> в обложке/марке. Любой
        другой контент — зона ответственности потребителя.
      </p>
      <div class="tjrh-stage">
        <tj-rubric-header>
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <h1>Город</h1>
          <div>Неизвестный блок без стилей — BYO-контракт</div>
        </tj-rubric-header>
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjrh-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjrh-note">
        <code>tj-rubric-header</code> — пассивная поверхность: ни одного
        интерактива, фокуса или события. Семантику несёт ТОЛЬКО слот-контент
        потребителя: настоящий <code>h1</code> (один на страницу — рубрика
        владеет заголовком), настоящий <code>p</code> подзаголовка. Марка
        скрыта скринридеру обёрткой <code>aria-hidden</code>; обложка обязана
        нести alt по контракту слота (пустой alt = декоративная обложка).
      </p>
      <h2>Чек-лист: только с клавиатуры</h2>
      <table>
        <thead>
          <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Фокус ПРОХОДИТ МИМО компонента целиком — внутри нет таб-стопов
              (нет якорей, нет кнопок); порядок обхода задаёт страница.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code></td>
            <td>
              Никаких активаций — это заголовок рубрики, не интерактив
              (клавиши остаются странице: Space прокручивает как обычно).
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjrh-note">
        Протокол исполняется вручную на стороне мейнтейнера: автоматический
        прогон не управляет скринридером. Каждое расхождение с ожидаемым
        объявлением — дефект, а не особенность.
      </p>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Чтение сверху вниз</td>
            <td>
              «Новости, заголовок уровня 1» — слот-контент, не теневой DOM;
              затем подзаголовок обычным текстом.
            </td>
          </tr>
          <tr>
            <td>Марка и обложка</td>
            <td>
              Марка не объявляется (aria-hidden); обложка объявляется по
              своему alt — пустой alt = молчание, зрячим остаётся картинка.
            </td>
          </tr>
          <tr>
            <td>Навигация по заголовкам (H / стрелки)</td>
            <td>Ровно один h1 на шапку — уровень рубрики, прыжок работает.</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tj-rubric-header'),
};
