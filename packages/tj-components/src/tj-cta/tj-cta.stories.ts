import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './tj-cta.js';

/**
 * tj-cta stories (spec 16.1): the anchor CTA — playground, the
 * compact-inset anatomy (44×44 box / 30px pill), the recorded-reference
 * hover note, and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 */

const canvasStyles = html`
  <style>
    .tjcta-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjcta-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjcta-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjcta-canvas p,
    .tjcta-canvas .tjcta-note {
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
    .tjcta-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjcta-canvas td,
    .tjcta-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjcta-panel {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tj-space-16);
      padding: var(--tj-space-24);
      border-radius: var(--tj-radius-cta);
      background: var(--tj-color-card);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/CTA',
  component: 'tj-cta',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjcta-canvas" lang="ru">
      <h1>tj-cta</h1>
      <p class="tjcta-note">
        Тихая навигационная плашка референса: подпись 15/400/20 гротеском,
        радиус <code>--tj-radius-cta</code> (5px), видимая высота 30px на
        токен-паре заливка/чернила. Только якорь — кнопочной ветки нет и без
        новой истории не появится.
      </p>
      <section class="tjcta-panel">
        <tj-cta href="#tjcta-anchor">Написать в редакцию</tj-cta>
      </section>
      <h2 id="tjcta-anchor">Якорь демо-CTA</h2>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия: бокс 44 и плашка 30',
  render: () => html`
    ${canvasStyles}
    <main class="tjcta-canvas" lang="ru">
      <h1>Анатомия: бокс 44 и плашка 30</h1>
      <p class="tjcta-note">
        Плита компактного инсета (прецедент банковской кнопки): видимая
        плашка — это ::before невидимого якоря 44×44. Каждый пиксель бокса
        кликабелен, подпись (20px) стоит по центру плашки 30px, кольцо
        фокуса обводит БОКС — интерактивную поверхность, а не плашку.
        Инсет 7px = (44 − 30) / 2 — выведен, не придуман.
      </p>
      <section class="tjcta-panel">
        <tj-cta href="#tjcta-anchor">Tab — кольцо обводит бокс 44</tj-cta>
        <tj-cta href="#tjcta-anchor">Длинная подпись тоже сидит в боксе</tj-cta>
      </section>
      <h2>Наведение: записанное поведение референса</h2>
      <p class="tjcta-note">
        Hover CTA референса НЕ измерен (зонд probe10 касался покоя и фокуса).
        Кит поставляет только курсор-аффорданс; заливка при наведении не
        изобретается. Если базлайн-сверка измерит hover-приём — он придёт
        новым зондом и токенами, не веткой здесь. В тёмной теме плашка
        инвертируется сама: пара заливка/чернила переразрешается токен-слоем.
      </p>
    </main>
  `,
};

export const AnchorContract: Story = {
  name: 'Контракт якоря',
  render: () => html`
    ${canvasStyles}
    <main class="tjcta-canvas" lang="ru">
      <h1>Контракт якоря</h1>
      <p class="tjcta-note">
        href — единственное свойство фриза: пустой href рендерит якорь БЕЗ
        атрибута (инертный текст, вне табуляции). target/rel на CTA не
        предлагаются — куда ведёт плашка, решает страница; полный сквозной
        якорный контракт несёт <code>tj-link</code>.
      </p>
      <section class="tjcta-panel">
        <tj-cta href="#tjcta-anchor">Живой CTA</tj-cta>
        <tj-cta href="">Инертный (без href)</tj-cta>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjcta-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjcta-note">
        <code>tj-cta</code> рендерит нативный <code>&lt;a&gt;</code> — роль,
        имя и Enter по конструкции. Интерактивная цель 44×44 — требование
        минимальной площади касания выполнено самим боксом, кольцо фокуса
        2px обводит его целиком и не отключается.
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
              Фокус входит на CTA / покидает его; кольцо 2px обводит весь бокс
              44×44 с отступом 2px.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Переход по href — нативная активация якоря.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Прокрутка страницы — нативная дельта якоря, НЕ активация
            («Space scrolls — native anchor delta», спека 16.1, I/O-матрица).</td>
          </tr>
          <tr>
            <td>Инертный вариант</td>
            <td>
              href="" — вне табуляции целиком (нативное поведение якоря без
              href); визуально плашка остаётся.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjcta-note">
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
            <td>Tab на CTA</td>
            <td>«Написать в редакцию, ссылка» — якорь, не кнопка.</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>Переход по href; размеры бокса 44px не меняют объявлений.</td>
          </tr>
          <tr>
            <td>Инертный вариант</td>
            <td>Объявляется как текст — «ссылка» не произносится.</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
