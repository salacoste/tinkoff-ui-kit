import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../tj-header/tj-header.js';
import '../tj-news-card/tj-news-card.js';
import '../tj-rubric-header/tj-rubric-header.js';
import './tj-rail.js';
import type { TjRail } from './tj-rail.js';

/**
 * tj-rail stories (spec 16.5): the section rail — playground (icon tiles,
 * current marking), the CHROME COMPOSITION pattern (header + rail +
 * rubric-header + news-card at 1280), the drawer via the element API
 * (programmatic open at any viewport), and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC navigation/feed content, zero PII (spec constraint).
 * Placeholder art: NEUTRAL named-color SVG data URLs (the bank store-badges
 * mold).
 */

const MARK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='gray'/><circle cx='32' cy='32' r='16' fill='white'/></svg>`,
)}`;

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const ICON_SVG = (fill: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><rect width='30' height='30' rx='7' fill='${fill}'/><circle cx='15' cy='15' r='8' fill='white'/></svg>`,
  )}`;

const RAIL_ITEMS = [
  { label: 'Главное', href: '#main', value: 'main' },
  { label: 'Без иконки', href: '#plain' },
  { label: 'Разборы', href: '#razbory', value: 'razbory' },
  { label: 'Истории', href: '#istorii', value: 'istorii' },
  { label: 'Шапки', href: '#shapki', value: 'shapki' },
];

const canvasStyles = html`
  <style>
    .tjrl-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-32) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    /* 44px hit-area floor (17.1 sweep): the slotted anchor is a FLEX ITEM —
     * blockified, so the §9 inline-prose exemption cannot apply; the text
     * stays 20px tall inside an invisible 44px box (the .tjhh-action
     * precedent). FLAG: authored a11y floor, not extraction. */
    .tjrl-wordmark {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      min-width: 44px;
    }
    /* The 17.1 sweep ruling: slotted consumer anchors GET the kit's 2px
     * focus ring (probe10 improvement layer — rings everywhere). */
    .tjrl-wordmark:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
    .tjrl-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjrl-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjrl-canvas p,
    .tjrl-canvas .tjrl-note {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-12);
      font-size: var(--tj-text-article-body-size);
      font-weight: var(--tj-text-article-body-weight);
      line-height: var(--tj-text-article-body-leading);
      color: var(--tj-color-ink-300);
      background: var(--tj-color-card);
      padding: var(--tj-space-12) var(--tj-space-16);
      border-radius: var(--tj-radius-card);
    }
    .tjrl-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjrl-canvas td,
    .tjrl-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjrl-canvas table {
      margin: 0 0 var(--tj-space-16);
      color: var(--tj-color-ink-100);
    }
    .tjrl-frame {
      max-width: var(--tj-space-container);
      margin: 0 auto;
    }
    .tjrl-demo-button {
      height: var(--tj-space-40);
      padding-inline: var(--tj-space-16);
      border: none;
      border-radius: var(--tj-radius-control-sm);
      background: var(--tj-color-cta-fill);
      color: var(--tj-color-cta-ink);
      font-family: var(--tj-font-ui);
      font-size: var(--tj-text-cta-label-size);
      cursor: pointer;
    }
    .tjrl-demo-button:focus-visible {
      outline: 2px solid var(--tj-color-focus-ring);
      outline-offset: 2px;
    }
    /* The composition pattern grid: rail column + main column. */
    .tjrl-layout {
      display: grid;
      grid-template-columns: var(--tj-space-rail-sidebar) minmax(0, 1fr);
      gap: var(--tj-space-40);
      align-items: start;
      margin-block-start: var(--tj-space-24);
    }
    .tjrl-feed {
      display: flex;
      flex-direction: column;
      gap: var(--tj-space-16);
      max-width: var(--tj-space-column-main);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Rail',
  component: 'tj-rail',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjrl-canvas" lang="ru">
      <div class="tjrl-frame">
        <h1>tj-rail</h1>
        <p class="tjrl-note">
          Левый рельс разделов: <code>nav &gt; ul &gt; li &gt; a</code>, ширина
          <code>--tj-space-rail-sidebar</code> (290). Строка с
          <code>value</code> получает слот <code>icon-{value}</code> — иконка
          живёт в декоративной плитке 40×40 (<code>aria-hidden</code>,
          <code>--tj-radius-icon-tile</code>; визуал — зонтированные 30px).
          Ничего не заслано → строки только с текстом, БЕЗ дырок.
          <code>current-value</code> — ПРОП-ТОЛЬКО канал (точное совпадение по
          value; маркировка — ТОЛЬКО <code>aria-current="page"</code>, БЕЗ
          визуальной дельты: референс не маркирует текущий раздел, вес у всех
          строк один — вид nav-label 17/700). Бургер появляется ниже 1200px
          (медиазапрос): сузьте канву — рельс схлопнется в кнопку «Разделы».
        </p>
        <tj-rail .items=${RAIL_ITEMS} current-value="razbory" burger-label="Разделы">
          <img slot="icon-main" src=${ICON_SVG('dimgray')} alt="" />
          <img slot="icon-istorii" src=${ICON_SVG('gray')} alt="" />
          <img slot="icon-shapki" src=${ICON_SVG('darkgray')} alt="" />
        </tj-rail>
      </div>
    </main>
  `,
};

export const ChromeComposition: Story = {
  name: 'Паттерн: хром страницы (1280)',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjrl-canvas" lang="ru">
      <div class="tjrl-frame">
        <h1>Паттерн: хром страницы (1280)</h1>
        <p class="tjrl-note">
          Композиция 16.5 на реестре 1200: sticky <code>tj-header</code>
          (z <code>--tj-z-nav</code>) + рельс слева + рубричная шапка и лента
          карточек в основной колонке. Рельс и шапка НЕ знают друг о друге —
          паттерн собирает потребитель. Ниже 1200 рельс схлопывается в бургер,
          шапка остаётся. Слоты хрома (wordmark/actions/иконки) — интерьер
          потребителя: кит даёт расстояния, не арт.
        </p>
        <tj-header
          .items=${[
            { label: 'Главное', href: '#main' },
            { label: 'Разборы', href: '#razbory' },
            { label: 'Истории', href: '#istorii' },
          ]}
          active-value="#razbory"
          cta-href="#write"
        >
          <a slot="wordmark" href="#top" class="tjrl-wordmark" style="font-weight: 700; text-decoration: none; color: var(--tj-color-ink-100); font-size: var(--tj-text-nav-label-size);"
            >ЖУРНАЛ</a
          >
        </tj-header>
        <div class="tjrl-layout">
          <tj-rail .items=${RAIL_ITEMS} current-value="razbory">
            <img slot="icon-main" src=${ICON_SVG('dimgray')} alt="" />
            <img slot="icon-istorii" src=${ICON_SVG('gray')} alt="" />
          </tj-rail>
          <div class="tjrl-feed">
            <tj-rubric-header>
              <p slot="cover" style="margin: 0;">
                <img
                  src=${MARK_PLACEHOLDER}
                  alt=""
                  style="display: block; width: 100%; height: 160px; object-fit: cover;"
                />
              </p>
              <h1 style="margin: 0;">Разборы</h1>
            </tj-rubric-header>
            <tj-news-card href="#news-1" aria-labelledby="tjrl-title-1">
              <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
              <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Марии Ветровой" />
              <span slot="byline">Мария Ветрова</span>
              <h2 slot="title" id="tjrl-title-1">
                Как устроены фонды денежного рынка: разбор на пальцах
              </h2>
              <p slot="excerpt">
                Короткий лид карточки в регистре чтения — Charter, живой
                контент синтетический, нулевой PII.
              </p>
              <span slot="meta">12 минут назад · 4 мин чтения</span>
            </tj-news-card>
            <tj-news-card href="#news-2" aria-labelledby="tjrl-title-2">
              <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
              <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ольги Даниной" />
              <span slot="byline">Ольга Данина</span>
              <h2 slot="title" id="tjrl-title-2">
                Что изменилось в налоговом вычете за обучение в 2026 году
              </h2>
              <span slot="meta">час назад · 7 мин чтения</span>
            </tj-news-card>
          </div>
        </div>
      </div>
    </main>
  `,
};

export const Drawer: Story = {
  name: 'Ящик: программное открытие',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjrl-canvas" lang="ru">
      <div class="tjrl-frame">
        <h1>Ящик: программное открытие</h1>
        <p class="tjrl-note">
          <code>open</code> — ОТРАЖАЁМЫЙ boolean-канал + событие
          <code>open-change</code> (<code>detail: {'{ value: boolean }'}</code>,
          composed, bubbles — React-обёртка получает голый boolean). Кнопка
          ниже пишет <code>rail.open = true</code> из кода — прямо по спеке
          это работает НА ЛЮБОЙ ширине канвы: бургер — лишь видимый
          переключатель ниже 1200px, механика ящика медиазапросом не гейтится.
          Ящик — полноэкранный лист слева (290 / мин(290, 86vw)), фон
          <code>--tj-color-card</code>, радиус <code>--tj-radius-panel</code>
          ТОЛЬКО на внутренней вертикальной кромке, тень
          <code>--tj-shadow-overlay</code>; scrim 12% чернил. Esc / клик в
          scrim / клик по ссылке закрывают; Tab циклится внутри, фокус
          возвращается на бургер. Все механики — в оверлей-хелпере
          (<code>src/overlays/</code>): z только
          <code>var(--tj-z-drawer)</code> (AD-12).
        </p>
        <button
          type="button"
          class="tjrl-demo-button"
          @click=${() => {
            const rail = document.querySelector<TjRail>('#tjrl-drawer-demo');
            if (rail) rail.open = true;
          }}
        >
          Открыть ящик из кода (rail.open = true)
        </button>
        <tj-rail id="tjrl-drawer-demo" .items=${RAIL_ITEMS} current-value="istorii" style="margin-block-start: var(--tj-space-24);">
        </tj-rail>
      </div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия',
  render: () => html`
    ${canvasStyles}
    <main class="tjrl-canvas" lang="ru">
      <div class="tjrl-frame">
        <h1>Анатомия</h1>
        <p class="tjrl-note">
          Рельс — один кастомный элемент: список разделов, бургер и ящик живут
          в ОДНОМ shadow-дереве (шаблон 2.3 — <code>aria-controls</code>
          бургера резолвится внутри одного дерева; кит никогда не телепортирует
          shadow-DOM). Механику ящика держит оверлей-хелпер — в элементе нуля
          собственного z/скролл/фокус кода.
        </p>
        <table>
          <thead>
            <tr><th>Узел</th><th>Роль / содержание</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>:host</code></td>
              <td>
                Колонка рельса шириной <code>--tj-space-rail-sidebar</code>
                (290); ниже 1200px сворачивается в <code>width: auto</code>.
              </td>
            </tr>
            <tr>
              <td><code>nav.rail</code></td>
              <td>Ориентир «Разделы» (RU-имя по умолчанию).</td>
            </tr>
            <tr>
              <td><code>ul.rail__list &gt; li &gt; a.row</code></td>
              <td>
                Строки-якоря из <code>items</code>: пол 44px, вид nav-label
                17/700; <code>current-value</code> → только
                <code>aria-current</code> (без визуальной дельты).
              </td>
            </tr>
            <tr>
              <td><code>span.tile</code></td>
              <td>
                Декоративная плитка 40×40 с радиусом
                <code>--tj-radius-icon-tile</code> и слотом
                <code>icon-{value}</code> (визуал 30px); пустой слот →
                плитка схлопывается, дырок нет; <code>aria-hidden</code>.
              </td>
            </tr>
            <tr>
              <td><code>button.burger</code></td>
              <td>
                Пол 44×44, видимая чипка 40×40 (::before, inset 2px, радиус
                control-sm, фон card — авторский подбор); видна только ниже
                1200px; <code>aria-expanded</code> +
                <code>aria-controls</code> на id листа.
              </td>
            </tr>
            <tr>
              <td><code>div.sheet</code></td>
              <td>
                Ящик: <code>role="dialog" aria-modal</code>, полноэкранная
                высота слева, ширина 290 / мин(290, 86vw), фон
                <code>--tj-color-card</code>, тень
                <code>--tj-shadow-overlay</code>, радиус
                <code>--tj-radius-panel</code> только на внутренней кромке;
                строки-якоря БЕЗ плиток (референс — простой список). z —
                инлайном от хелпера (<code>--tj-z-drawer</code>).
              </td>
            </tr>
          </tbody>
        </table>
        <tj-rail .items=${RAIL_ITEMS} current-value="razbory" style="margin-block-start: var(--tj-space-24);">
          <img slot="icon-main" src=${ICON_SVG('dimgray')} alt="" />
        </tj-rail>
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  parameters: { layout: 'fullscreen' },
  render: () => html`
    ${canvasStyles}
    <main class="tjrl-canvas" lang="ru">
      <div class="tjrl-frame">
        <h1>Доступность</h1>
        <p class="tjrl-note">
          Рельс — ориентир «Разделы» из нативных якорей: роль/имя/навигация по
          построению. Текущая строка несёт <code>aria-current="page"</code> —
          СЕМАНТИКА БЕЗ визуальной дельты (референс не маркирует текущий
          раздел; вес у всех строк один — вид nav-label 17/700). Иконки
          декоративны: плитка <code>aria-hidden</code>, имя строки — только
          текст. Бургер —
          <code>&lt;button type="button"&gt;</code> 44×44 с
          <code>aria-expanded</code> + <code>aria-controls</code> на тот же
          id, что у листа; лист — <code>role="dialog"</code>
          <code>aria-modal="true"</code> с именем бургера.
        </p>
        <h2>Чек-лист: только с клавиатуры</h2>
        <table>
          <thead>
            <tr><th>Клавиша</th><th>Ожидаемое поведение</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Tab</code> по рельсу</td>
              <td>
                Строки по порядку, кольцо 2px на каждой; плитки не создают
                таб-стопов (декоративны).
              </td>
            </tr>
            <tr>
              <td><code>Enter</code> на строке</td>
              <td>Навигация якоря — кит не перехватывает маршрутизацию.</td>
            </tr>
            <tr>
              <td>Бургер (виден ниже 1200px)</td>
              <td>
                <code>aria-expanded="true"</code>, ящик открывается, фокус
                переносится на первую ссылку листа.
              </td>
            </tr>
            <tr>
              <td><code>Tab</code> / <code>Shift+Tab</code> в ящике</td>
              <td>
                Цикл внутри листа (shadow-aware trap); наружу фокус не уходит.
              </td>
            </tr>
            <tr>
              <td><code>Esc</code></td>
              <td>
                Ящик закрывается, фокус возвращается на бургер, скролл
                страницы разблокируется.
              </td>
            </tr>
            <tr>
              <td>Клик в scrim / по ссылке</td>
              <td>
                Ящик закрывается; переход по ссылке — нативный якорный.
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
        <p class="tjrl-note">
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
              <td>Чтение рельса</td>
              <td>
                «Разделы, ориентир навигации»; строки — «ссылка», текущая —
                «Разборы, ссылка, текущая страница»; иконки молчат.
              </td>
            </tr>
            <tr>
              <td>Бургер до/после</td>
              <td>
                «Разделы, кнопка» / «Разделы, кнопка, развёрнуто» —
                aria-expanded озвучивается.
              </td>
            </tr>
            <tr>
              <td>Открытый ящик</td>
              <td>
                «Разделы, диалог, модальный»; Tab читает только ссылки листа,
                содержимое за scrim недоступно (modal-семантика).
              </td>
            </tr>
            <tr>
              <td>Закрытие</td>
              <td>Фокус на бургере: «Разделы, кнопка, свёрнуто».</td>
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
                Движения нет вовсе: открытие/закрытие ящика мгновенное (кит
                не анимировал их и в обычном режиме — непроверенное не
                изобретается).
              </td>
            </tr>
            <tr>
              <td>Скролл-лок</td>
              <td>
                Компенсация полосы прокрутки (padding) сохраняет верстку —
                сдвига страницы нет ни в одном режиме.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  `,
};
