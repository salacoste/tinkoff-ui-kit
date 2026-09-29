import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './tj-news-card.js';

/**
 * tj-news-card stories (spec 16.3): the single-link feed card — playground,
 * slot anatomy, the skeleton state, and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC feed-shaped content, zero PII (spec constraint). Counts
 * and timestamps render ink-300 (the authored AA meta step) — the RESTRICTED
 * reference inks (--tj-color-engage / --tj-color-ink-reference-time) stay
 * token-table-documented and are NEVER story-rendered (FR-22; the fidelity
 * delta vs the reference grays is the 16.1 round-3 precedent, FR-22 wins).
 *
 * Placeholder art: NEUTRAL named-color SVG data URLs (the bank store-badges
 * mold — a placeholder image is content, but stays clean of hex literals).
 */

const MARK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='30' fill='dimgray'/><circle cx='50' cy='50' r='22' fill='white'/></svg>`,
)}`;

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const canvasStyles = html`
  <style>
    .tjnc-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjnc-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjnc-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjnc-canvas p,
    .tjnc-canvas .tjnc-note {
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
    .tjnc-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjnc-canvas td,
    .tjnc-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    .tjnc-feed {
      display: flex;
      flex-direction: column;
      gap: var(--tj-space-24);
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/News Card',
  component: 'tj-news-card',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjnc-canvas" lang="ru">
      <h1>tj-news-card</h1>
      <p class="tjnc-note">
        Карточка ленты «вся карта — одна ссылка» (модель row-as-link): один
        теневой <code>&lt;a&gt;</code> оборачивает всё, один таб-стоп, одно
        доступное имя — оно строится из поддерева якоря (заголовок — его
        главный текст; см. «Доступность»). Плоская: ни тени, ни
        hover-подъёма (цензус 95 карточек — box-shadow none). Радиус
        <code>--tj-radius-card</code> (25), фон — карточка, ширина семейства
        760. Side-by-side цель: <code>tj-rubric-news-viewport-2026-09-28.png</code>.
      </p>
      <div class="tjnc-feed">
        <tj-news-card
          href="#news-1"
          aria-labelledby="tjnc-title-1"
        >
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Марии Ветровой" />
          <span slot="byline">Мария Ветрова</span>
          <h2 slot="title" id="tjnc-title-1">
            Минздрав зарегистрировал первую четырёхвалентную вакцину от менингококка
          </h2>
          <p slot="excerpt">
            Четырёхвалентная схема закрывает сразу четыре серогруппы — прежде в
            обороте были только двухвалентные. Разбираемся, что меняется в
            национальном календаре прививок.
          </p>
          <span slot="meta">
            <time datetime="2026-09-29T09:40">29 сентября, 09:40</time>
            <span aria-hidden="true"> · </span>
            <span>12 комментариев</span>
            <span aria-hidden="true"> · </span>
            <span>148 прочитавших</span>
          </span>
        </tj-news-card>
        <tj-news-card href="#news-2" aria-labelledby="tjnc-title-2">
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Артема Сомова" />
          <span slot="byline">Артём Сомов</span>
          <h3 slot="title" id="tjnc-title-2">
            Почему h2 и h3 равноправны: уровень заголовка выбирает потребитель
          </h3>
          <span slot="meta">
            <time datetime="2026-09-28T18:05">28 сентября, 18:05</time>
            <span aria-hidden="true"> · </span>
            <span>7 комментариев</span>
          </span>
        </tj-news-card>
      </div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия: слоты и меты',
  render: () => html`
    ${canvasStyles}
    <main class="tjnc-canvas" lang="ru">
      <h1>Анатомия: слоты и меты</h1>
      <p class="tjnc-note">
        Шесть слотов: <code>mark</code> (мини-сквиркл, декоративный — обёртка
        aria-hidden), <code>avatar</code> (картинка потребителя со своим alt),
        <code>byline</code> (имя автора — 15/700/20 ink-100),
        <code>title</code> (news-title 24/700/30 ink-100; заголовок слот-контент
        — свобода уровня h2/h3, компонент свой заголовок не рендерит),
        <code>excerpt</code> (опционален в обе стороны: обёртка не рендерится,
        пока слот пуст), <code>meta</code> (время + счётчики — 15/400 ink-300).
        Лид — регистр чтения в масштабе карточки: Charter 17/400, масштабный
        пик спеки (вид не измерен, FLAG).
      </p>
      <div class="tjnc-feed">
        <tj-news-card href="#anatomy">
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ольги Даниной" />
          <span slot="byline">Ольга Данина</span>
          <h2 slot="title">Полная карточка: все шесть слотов заняты</h2>
          <p slot="excerpt">
            Лида в регистре чтения — Charter 17/400, структурный пик спеки:
            «article-body register 17/400», ведущая 24 выбрана по шкале.
          </p>
          <span slot="meta">
            <time datetime="2026-09-27T12:00">27 сентября, 12:00</time>
            <span aria-hidden="true"> · </span>
            <span>9 комментариев</span>
          </span>
        </tj-news-card>
      </div>
      <h2>Счётчики: статичный текст ink-300, не live-регионы</h2>
      <p class="tjnc-note">
        Счётчики — статичный текст в слоте <code>meta</code> на ink-300
        (авторский AA-шаг 5.099:1). Референсные серые
        (<code>--tj-color-ink-reference-time</code> 3.949:1,
        <code>--tj-color-engage</code>) — RESTRICTED: живут в токен-таблице
        для справки, в историях кита НЕ рендерятся (FR-22, прецедент 16.1
        раунд-3 — дельта честности зафиксирована). Компонент не создаёт
        live-регионов и ничего не диспетчит: обновление счётчиков —
        перерисовка потребителя, не событие кита.
      </p>
      <h2>Контракт якоря</h2>
      <p class="tjnc-note">
        Пустой <code>href</code> — якорь без атрибута (инертный, вне
        табуляции); <code>target="_blank"</code> без rel получает
        <code>noopener noreferrer</code>; явный rel потребителя побеждает
        дословно — модель 16.1 verbatim.
      </p>
      <div class="tjnc-feed">
        <tj-news-card href="">
          <span slot="byline">Мария Ветрова</span>
          <h2 slot="title">Инертная карточка: href пуст — таб-стопа нет</h2>
        </tj-news-card>
      </div>
    </main>
  `,
};

export const Skeleton: Story = {
  name: 'Скелет',
  render: () => html`
    ${canvasStyles}
    <main class="tjnc-canvas" lang="ru">
      <h1>Скелет</h1>
      <p class="tjnc-note">
        Булев атрибут <code>skeleton</code>: кости заменяют слот-контент,
        хост несёт <code>aria-busy="true"</code>, блок костей —
        <code>aria-hidden</code>. Цвет — meta-чернила 12% альфы
        (<code>color-mix</code> поверх ink-300 — FLAG спеки; НЕ банковский
        серый-плейсхолдер). Анимации/шиммера НЕТ: поведение скелета референса
        не зондировано — ничего не изобретаем. Якорь не рендерится (пустого
        таб-стопа нет); снятие атрибута возвращает живые слоты. Кости
        зеркалят анатомию: марка + строка-слово + две строки заголовка +
        строка меты; лида в костях нет — опциональный слот в кости не превращается.
      </p>
      <div class="tjnc-feed">
        <tj-news-card skeleton>
          <span slot="byline">загрузка</span>
        </tj-news-card>
        <tj-news-card href="#live-again">
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Павла Резника" />
          <span slot="byline">Павел Резник</span>
          <h2 slot="title">Живая карточка рядом со скелетом — сравнение ритма</h2>
          <span slot="meta">
            <time datetime="2026-09-29T07:15">29 сентября, 07:15</time>
            <span aria-hidden="true"> · </span>
            <span>3 комментария</span>
          </span>
        </tj-news-card>
      </div>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjnc-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjnc-note">
        Вся карточка — один нативный <code>&lt;a&gt;</code>: роль, Enter и
        один таб-стоп по конструкции. Доступное имя якоря строится из его
        ПОДДЕРЕВА (автор → заголовок → лида → меты, порядок DOM).
        Host-уровневый <code>aria-labelledby</code> из «Песочницы» теневой
        якорь НЕ укорачивает: host — контейнер без роли, вычисление имени
        его не видит. Это демонстрация потребительского паттерна и
        заморозка для мейнтейнера (перенос id на теневой якорь потребовал бы
        компонентного решения — вне этого батча); компонент не добавляет
        собственных aria-атрибутов кроме skeleton/aria-busy. Марка скрыта
        (<code>aria-hidden</code>),
        аватар сохраняет alt потребителя, имя автора несёт идентификацию.
        Кольцо фокуса 2px — токен focus-ring НА поверхности карточки
        (AA-закон поверхностей: 3.067:1 non-text на карточке).
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
              Фокус входит на карточку ЦЕЛИКОМ / покидает её; кольцо 2px
              обводит всю карточку с отступом 2px. Внутри карточки таб-стопов
              нет — одна ссылка на всю карту.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Переход по href — нативная активация якоря.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>
              Прокрутка страницы — нативная дельта якоря, НЕ активация
              («Space scrolls», спека 16.3, I/O-матрица).
            </td>
          </tr>
          <tr>
            <td>Скелет</td>
            <td>
              Пока <code>skeleton</code> — таб-стопа нет вообще (якорь не
              рендерится); хост объявляет занятость через aria-busy.
            </td>
          </tr>
          <tr>
            <td>Инертная карточка</td>
            <td>href="" — вне табуляции целиком; визуально карточка остаётся.</td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjnc-note">
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
            <td>Tab на карточку</td>
            <td>
              Полное имя из поддерева якоря (автор, заголовок, лида, меты —
              порядок DOM) + «ссылка» — один элемент, не «ссылка ×4»:
              байлайн и меты внутри якоря, а не рядом с ним.
            </td>
          </tr>
          <tr>
            <td>Чтение карточки</td>
            <td>
              Заголовок, затем имя автора, затем время и счётчики — порядок
              DOM; марка молчит (aria-hidden), аватар — по своему alt.
            </td>
          </tr>
          <tr>
            <td>Скелет</td>
            <td>Хост объявляет «занято» (aria-busy); кости молчат — ссылка и
            имя не озвучиваются.</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
