import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../api-reference.js';

import './tj-header.js';

// Story-local teardown (lens 16.5): the theme contract lives on the DOCUMENT
// root, so the theme story mutates SHARED canvas state by design — this inert
// element restores the attribute when Storybook swaps the story DOM away (no
// dark leak into sibling stories). Story-only chrome, not kit API.
if (!customElements.get('tjhh-theme-reset')) {
  class TjhhThemeReset extends HTMLElement {
    disconnectedCallback(): void {
      document.documentElement.removeAttribute('data-tj-theme');
    }
  }
  customElements.define('tjhh-theme-reset', TjhhThemeReset);
}

/**
 * tj-header stories (spec 16.5): the sticky chrome — playground (scroll to
 * see the 72→56 compress), the theme contract (the stateless cycle flips the
 * WHOLE canvas — the attribute lives on the document root), and the FR-22
 * accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC navigation, zero PII (spec constraint).
 */

const WORDMARK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 36'><rect width='120' height='36' rx='8' fill='dimgray'/><text x='60' y='24' font-family='sans-serif' font-size='17' font-weight='700' fill='white' text-anchor='middle'>ЖУРНАЛ</text></svg>`,
)}`;

const canvasStyles = html`
  <style>
    .tjhh-canvas {
      box-sizing: border-box;
      min-height: 160vh;
      padding: 0 0 var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjhh-canvas h1 {
      margin: var(--tj-space-32) var(--tj-space-24) var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjhh-canvas h2 {
      margin: var(--tj-space-32) var(--tj-space-24) var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjhh-canvas p,
    .tjhh-canvas .tjhh-note {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 var(--tj-space-24) var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
      color: var(--tj-color-ink-300);
      background: var(--tj-color-card);
      padding: var(--tj-space-12) var(--tj-space-16);
      border-radius: var(--tj-radius-card);
    }
    .tjhh-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjhh-canvas td,
    .tjhh-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjhh-canvas table {
      margin: 0 var(--tj-space-24) var(--tj-space-16);
      color: var(--tj-color-ink-100);
    }
    /* Scroll filler: the compress only exists with scrollable content. */
    .tjhh-filler {
      margin: 0 var(--tj-space-24) var(--tj-space-16);
      height: 120vh;
      background: var(--tj-color-card);
      border-radius: var(--tj-radius-card);
      display: flex;
      align-items: top;
      justify-content: center;
      padding-top: var(--tj-space-24);
      color: var(--tj-color-ink-300);
      font-size: var(--tj-text-cta-label-size);
    }
    /* Story-only slot interiors (consumer art, not kit chrome). */
    /* 44px hit-area floor (17.1 sweep): the slotted anchor is a FLEX ITEM —
     * blockified, so the §9 inline-prose exemption cannot apply; the logo
     * stays 32px tall inside an invisible 44px box (the .tjhh-action
     * precedent). FLAG: authored a11y floor, not extraction. */
    .tjhh-wordmark {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      min-width: 44px;
    }
    .tjhh-wordmark img {
      display: block;
      height: var(--tj-space-32);
      width: auto;
    }
    /* The 17.1 sweep ruling: slotted consumer anchors GET the kit's 2px
     * focus ring (probe10 — the reference under-applies --outline-focus; the
     * ring is the kit's improvement layer, rings everywhere). */
    .tjhh-wordmark:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
    .tjhh-action {
      /* 44px literal — the 5.1 clickable floor (no --tj-space-44 on the
       * 4-step scale; the button paints no fill, so the box growth is
       * hit-area only). FLAG: authored a11y floor, not extraction. */
      height: 44px;
      min-width: 44px;
      border: none;
      border-radius: var(--tj-radius-control-sm);
      background: transparent;
      color: var(--tj-color-ink-100);
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-cta-label-size);
      cursor: pointer;
    }
    .tjhh-action:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
  </style>
`;

const NAV = [
  { label: 'Главное', href: '#main' },
  { label: 'Разборы', href: '#razbory' },
  { label: 'Истории', href: '#istorii' },
  { label: 'Шапки', href: '#shapki' },
  { label: 'Индексы', href: '#indeksy' },
];

const headerBlock = html`
  <tj-header .items=${NAV} active-value="#razbory" cta-href="#write">
    <a slot="wordmark" class="tjhh-wordmark" href="#top" aria-label="Журнал — на главную">
      <img src=${WORDMARK_PLACEHOLDER} alt="" />
    </a>
    <button slot="actions" type="button" class="tjhh-action">Поиск</button>
  </tj-header>
`;

const meta: Meta = {
  title: 'TJ/Header',
  component: 'tj-header',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjhh-canvas" lang="ru">
      ${headerBlock}
      <h1>tj-header</h1>
      <p class="tjhh-note">
        Липкий хром сайта: слот <code>wordmark</code>, чипы-пилюли навигации из
        <code>items</code> ({ label, href } — свойство, НЕ атрибут; белая
        карточная пилюля <code>--tj-color-card</code> на сером фоне полосы,
        вид nav-label 17/700 — как на референсе), <code>active-value</code> —
        ПРОП-ТОЛЬКО канал (точное совпадение по href; маркировка — ТОЛЬКО
        <code>aria-current="page"</code>, БЕЗ визуальной дельты: референс не
        маркирует текущий раздел — непроверенное не изобретается), слот
        <code>actions</code> (интерьер потребителя — кит даёт только
        расстояние), встроенная кнопка темы и CTA «Написать»
        (<code>cta-href</code> / <code>cta-label</code>; полностью скруглённая
        пилюля 30px; пустой href → инертный якорь без атрибута). Полоса
        сливается со страницей — разделителя НЕТ (референс). Прокрутите
        страницу: любая прокрутка (>0) сжимает полосу 72 → 56 за токен
        быстрой длительности; возврат наверх восстанавливает. z — только
        <code>var(--tj-z-nav)</code>.
      </p>
      <div class="tjhh-filler">Страница длиннее экрана — прокрутите, чтобы увидеть сжатие 72 → 56</div>
    </main>
  `,
};

export const ThemeContract: Story = {
  name: 'Контракт темы',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjhh-canvas" lang="ru">
      ${headerBlock}
      <tjhh-theme-reset hidden></tjhh-theme-reset>
      <h1>Контракт темы</h1>
      <p class="tjhh-note">
        Кнопка темы — STATELESS-цикл auto → light → dark → auto: на КАЖДЫЙ
        клик читает <code>data-tj-theme</code> с корня документа и пишет
        следующий режим; auto = СНЯТИЕ атрибута (дальше рулит
        <code>prefers-color-scheme</code> — авто-нога токен-слоя). Нажмите
        кнопку в шапке: канва этой истории переключается ЦЕЛИКОМ — состояние
        живёт на корне документа, не на элементе. matchMedia-слушателя НЕТ:
        авто — чистый CSS, флэша нет по построению (селектор — блокирующий
        CSS). Внешние записи уважаются: клик всегда продолжает цикл из
        реальности (попробуйте выставить атрибут в DevTools и кликнуть).
      </p>
      <h2>Событие и объявления</h2>
      <p class="tjhh-note">
        Активация диспетчит <code>theme-change</code> (класс
        <code>TjThemeChangeEvent</code>, <code>composed: true</code>,
        <code>bubbles: true</code>) с detail = результирующий режим
        СТРОКОЙ (<code>'auto' | 'light' | 'dark'</code>) — состояние на корне
        документа, это не канал &lt;prop&gt;-change; React-обработчик получает
        само событие. Каждая активация объявляется вежливым live-регионом:
        «Тема оформления: системная / светлая / тёмная». Глиф-заглушка
        декоративен (<code>aria-hidden</code>) и один на все режимы; слот
        <code>theme-icon</code> заменяет его целиком.
      </p>
      <div class="tjhh-filler">Фон канвы следует теме — атрибут на корне документа</div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjhh-canvas" lang="ru">
      ${headerBlock}
      <h1>Анатомия</h1>
      <p class="tjhh-note">
        Хром — один кастомный элемент без вложенных компонентов (норма
        «без кросс-композиции»): внутри — семантическая полоса и слоты для
        интерьеров потребителя. Иконки внутри чипов на референсе — контент
        потребителя, не арт кита (норма слота <code>actions</code>): кит
        даёт пилюлю, её интерьер — потребитель.
      </p>
      <table>
        <thead>
          <tr><th>Узел</th><th>Роль / содержание</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>header.bar</code></td>
            <td>
              Липкая полоса: <code>sticky; top: 0; z: var(--tj-z-nav)</code>,
              высота 72 → 56 по <code>data-scrolled</code> (внутренний флаг,
              НЕ API), фон <code>--tj-color-page</code>, разделителя нет.
            </td>
          </tr>
          <tr>
            <td><code>div.bar__inner</code></td>
            <td>
              Ряд внутри контейнера 1200 (<code>--tj-space-container</code>),
              inset 24, флекс с шагом 24 — «умножитель» хрома.
            </td>
          </tr>
          <tr>
            <td><code>slot wordmark</code></td>
            <td>
              Бренд-блок: ОДНО доступное имя едет на тексте самого слота, кит
              оборачивает нейтрально.
            </td>
          </tr>
          <tr>
            <td><code>nav.chips</code></td>
            <td>
              Ориентир «Навигация»; якоря-пилюли из <code>items</code>
              (карточный фон, радиус <code>--tj-radius-chip</code>, вид
              nav-label 17/700). <code>active-value</code> → только
              <code>aria-current</code>.
            </td>
          </tr>
          <tr>
            <td><code>slot actions</code></td>
            <td>Кластер иконок-кнопок потребителя — кит даёт только расстояние.</td>
          </tr>
          <tr>
            <td><code>button.theme</code></td>
            <td>
              STATELESS-переключатель темы (44×44): цикл auto → light → dark
              по атрибуту <code>data-tj-theme</code> на корне документа; глиф
              декоративен, слот <code>theme-icon</code> заменяет.
            </td>
          </tr>
          <tr>
            <td><code>a.bar__cta</code></td>
            <td>
              «Написать»: пол 44×44, видимая пилюля 30px полностью скруглённая
              (<code>--tj-radius-full</code>), токены cta-fill/cta-ink;
              пустой href → инертный якорь.
            </td>
          </tr>
          <tr>
            <td><code>span.visually-hidden</code></td>
            <td>
              Вежливый live-регион RU-анонсов темы («Тема оформления: …») —
              clipped, вне фокуса.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tjhh-filler">Прокрутите — анатомия полосы не меняется, сжимается только высота</div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjhh-canvas" lang="ru">
      ${headerBlock}
      <h1>Доступность</h1>
      <p class="tjhh-note">
        Шапка — это якоря и одна кнопка: роль/имя/активация нативные. Nav —
        ориентир с RU-именем «Навигация»; текущий чип несёт
        <code>aria-current="page"</code> — СЕМАНТИКА БЕЗ визуальной дельты
        (референс не маркирует текущий раздел; вес у всех чипов один — вид
        nav-label 17/700). Кнопка темы —
        <code>&lt;button type="button"&gt;</code> 44×44 с именем
        «Переключить тему оформления»; глиф скрыт. CTA — якорь с полом 44×44
        (видимая полностью скруглённая пилюля 30px внутри невидимого бокса).
        Пустой <code>cta-href</code> — инертный якорь: НЕ таб-стоп. Кольца
        фокуса 2px (токен) на каждом интерактиве.
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
              Порядок: wordmark (якорь слота) → чипы по порядку → содержимое
              слота actions → кнопка темы → CTA «Написать». Кольцо 2px с
              отступом 2px на каждом.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code> на чипе / CTA</td>
            <td>Навигация якоря (нативная); элемент ничего не перехватывает.</td>
          </tr>
          <tr>
            <td><code>Enter</code> / <code>Space</code> на кнопке темы</td>
            <td>
              Цикл на один шаг, диспетчится <code>theme-change</code>,
              live-регион объявляет результирующий режим.
            </td>
          </tr>
          <tr>
            <td>Прокрутка</td>
            <td>
              Сжатие 72 → 56 не меняет таб-порядок и не крадёт фокус; слушатель
              пассивный (<code>passive: true</code>).
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjhh-note">
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
            <td>Tab на чипы</td>
            <td>
              «Разборы, ссылка, текущая страница» — aria-current озвучивается
              на текущем чипе; остальные — просто «ссылка».
            </td>
          </tr>
          <tr>
            <td>Tab на кнопку темы</td>
            <td>«Переключить тему оформления, кнопка» — глиф молчит.</td>
          </tr>
          <tr>
            <td>Активация темы</td>
            <td>
              «Тема оформления: светлая» → «…тёмная» → «…системная» —
              вежливое объявление после каждого шага цикла.
            </td>
          </tr>
          <tr>
            <td>Чтение шапки</td>
            <td>
              Ориентир «Навигация» объявляется при входе; шапка НЕ ловит
              курсор — все элементы нативные.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Уменьшенное движение</h2>
      <table>
        <thead>
          <tr><th>Состояние</th><th>Поведение</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>prefers-reduced-motion: reduce</code></td>
            <td>
              Сжатие 72 → 56 мгновенное: токен длительности схлопывается в
              0ms токен-слоем + прямой <code>transition: none</code> в листе.
            </td>
          </tr>
          <tr>
            <td>Обычное движение</td>
            <td>Сжатие за 150ms (токен fast) по стандартной кривой.</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};

export const Api: Story = {
  name: 'API',
  render: () => apiReferenceDoc('tj-header'),
};
