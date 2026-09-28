import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './tj-link.js';

/**
 * tj-link stories (spec 16.1): the chrome text link — playground, the quiet
 * species anatomy (transparent underline at rest / 70% reveal on hover), the
 * anchor contract (href/target/rel rules), and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 */

const canvasStyles = html`
  <style>
    .tjlink-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjlink-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjlink-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjlink-canvas p,
    .tjlink-canvas .tjlink-note {
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
    .tjlink-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjlink-canvas td,
    .tjlink-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjlink-panel {
      padding: var(--tj-space-24);
      border-radius: var(--tj-radius-cta);
      background: var(--tj-color-card);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Link',
  component: 'tj-link',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjlink-canvas" lang="ru">
      <h1>tj-link</h1>
      <p class="tjlink-note">
        Текстовая ссылка хрома в редакционном регистре: чернила — парный токен
        <code>--tj-color-link</code>, подчёркивание ЕСТЬ всегда, но в поконе
        красится прозрачным; при наведении проявляется 70% чернил через
        <code>color-mix</code>. Цвет не шагает ни при наведении, ни в тёмной
        теме — грамматика сдержанности референса. Типографика наследуется от
        окружения: ссылка живёт внутри предложения.
      </p>
      <section class="tjlink-panel">
        <p>
          Материалы по теме:
          <tj-link href="#tjlink-anchor">как читать цифровой след</tj-link> и
          <tj-link href="#tjlink-anchor">зачем нужны рубрики</tj-link>.
        </p>
      </section>
      <h2 id="tjlink-anchor">Якорь демо-ссылок</h2>
    </main>
  `,
};

export const Species: Story = {
  name: 'Анатомия вида',
  render: () => html`
    ${canvasStyles}
    <main class="tjlink-canvas" lang="ru">
      <h1>Анатомия вида</h1>
      <p class="tjlink-note">
        Вид из зонда probe10: толщина подчёркивания 1px, отступ 0.1em,
        позиция под базовой линией, переход 100ms по стандартной кривой.
        Клавиатурный фокус — кольцо 2px <code>--tj-color-focus-ring</code>
        (слой улучшения: референс оставляет ссылкам контур браузера).
      </p>
      <section class="tjlink-panel">
        <p><tj-link href="#tjlink-anchor">Покой — подчёркивание прозрачное</tj-link></p>
        <p><tj-link href="#tjlink-anchor">Наведите — подчёркивание 70%</tj-link></p>
        <p><tj-link href="#tjlink-anchor">Tab — кольцо фокуса</tj-link></p>
      </section>
      <h2>Тёмная тема</h2>
      <p class="tjlink-note">
        Переключите тему в тулбаре: чернила переразрешаются парным токеном
        (светлее на тёмном фоне), геометрия и переход не меняются — веток
        темы в компоненте нет, тема живёт в токен-слое.
      </p>
    </main>
  `,
};

export const AnchorContract: Story = {
  name: 'Контракт якоря',
  render: () => html`
    ${canvasStyles}
    <main class="tjlink-canvas" lang="ru">
      <h1>Контракт якоря</h1>
      <p class="tjlink-note">
        Ровно банковская плита 10.4: href="" — НЕ живая ссылка (атрибут не
        рендерится вовсе, инертный текст); rel по умолчанию
        <code>noopener noreferrer</code> только при target="_blank"; явный rel
        потребителя проходит дословно.
      </p>
      <section class="tjlink-panel">
        <p>
          Живая ссылка:
          <tj-link href="#tjlink-anchor" target="_blank">в новом окне — с noopener</tj-link>
        </p>
        <p>
          Явный rel потребителя:
          <tj-link href="#tjlink-anchor" target="_blank" rel="next">rel="next" дословно</tj-link>
        </p>
        <p>
          Инертная (href=""):
          <tj-link href="">без атрибута href — не фокусируется</tj-link>
        </p>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjlink-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjlink-note">
        <code>tj-link</code> рендерит нативный <code>&lt;a&gt;</code> в shadow
        DOM — роль, имя и активация по Enter получаются самой конструкцией.
        Инертный вариант (href="") — просто текст: без href якорь выпадает из
        порядка табуляции, как нативный. Индикатор клавиатурного фокуса —
        кольцо 2px, оно не отключается и не заменяется подчёркиванием.
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
              Фокус входит на ссылку / покидает её; кольцо 2px с отступом 2px
              видно всё время фокуса.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Переход по href (нативная активация); при target="_blank" — новое окно с noopener.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Прокрутка страницы — нативная дельта якоря, НЕ активация:
            активация только Enter (спека 16.1, I/O-матрица).</td>
          </tr>
          <tr>
            <td>Инертный вариант</td>
            <td>
              href="" выпадает из табуляции целиком — фокус на него не попадает
              (нативное поведение якоря без href).
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjlink-note">
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
            <td>Tab на ссылку</td>
            <td>«Текст ссылки, ссылка» — нативная роль, никаких лишних обёрток shadow DOM.</td>
          </tr>
          <tr>
            <td>Инертный вариант</td>
            <td>Объявляется как обычный текст — «ссылка» не произносится (href нет).</td>
          </tr>
          <tr>
            <td>Enter</td>
            <td>Переход; target="_blank" не меняет объявлений.</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
