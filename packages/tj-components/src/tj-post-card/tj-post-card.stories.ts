import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../tj-composer/tj-composer.js';
import './tj-post-card.js';

/**
 * tj-post-card stories (spec 16.4): the community cell — playground, slot
 * anatomy with the clamp/title-mirror contract, the community composition
 * PATTERN (a story, NOT shipped API), and the FR-22 accessibility page.
 *
 * Canvas styling consumes var(--tj-*) tokens ONLY (zero-hardcoded scan root +
 * FR-17 family boundary: zero --tk-* reads). The token sheet is loaded by the
 * docs composition root (packages/docs/.storybook/preview.ts).
 *
 * Data: SYNTHETIC community-shaped content, zero PII (spec constraint).
 * Counts render ink-300 (the authored AA meta step) — the RESTRICTED
 * reference inks stay token-table-documented and are NEVER story-rendered
 * (FR-22, the 16.1 round-3 precedent).
 *
 * Placeholder art: NEUTRAL named-color SVG data URLs (the bank store-badges
 * mold — a placeholder image is content, but stays clean of hex literals).
 */

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const canvasStyles = html`
  <style>
    .tjpc-canvas {
      box-sizing: border-box;
      min-height: 100vh;
      padding: var(--tj-space-40) var(--tj-space-24) var(--tj-space-64);
      background: var(--tj-color-page);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjpc-canvas h1 {
      margin: 0 0 var(--tj-space-8);
      font-size: var(--tj-text-article-h2-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-article-h2-leading);
    }
    .tjpc-canvas h2 {
      margin: var(--tj-space-32) 0 var(--tj-space-12);
      font-size: var(--tj-text-cta-label-size);
      font-weight: var(--tj-text-article-h2-weight);
      line-height: var(--tj-text-cta-label-leading);
    }
    .tjpc-canvas p,
    .tjpc-canvas .tjpc-note {
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
    .tjpc-canvas code {
      font-family: monospace;
      font-size: var(--tj-text-cta-label-size);
    }
    .tjpc-canvas td,
    .tjpc-canvas th {
      padding: var(--tj-space-4) var(--tj-space-12) var(--tj-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tj-color-divider);
    }
    /* The cell's natural home: the TRANSPARENT card rides a white sheet. */
    .tjpc-sheet {
      max-width: var(--tj-space-column-reading-body);
      margin: 0 0 var(--tj-space-16);
      padding: var(--tj-space-24);
      background: var(--tj-color-card);
      border-radius: var(--tj-radius-card);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Post Card',
  component: 'tj-post-card',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  name: 'Песочница',
  render: () => html`
    ${canvasStyles}
    <main class="tjpc-canvas" lang="ru">
      <h1>tj-post-card</h1>
      <p class="tjpc-note">
        Ячейка поста сообщества: ПРОЗРАЧНАЯ — без своих фона, радиуса, рамки
        и паддингов. Референсные карточки — текстовые ячейки на общем белом
        листе; рамка вокруг ячейки ломала бы композицию, поэтому листом
        владеет потребитель (см. «Паттерн»). Носитель — модель row-as-link
        из tj-news-card дословно: один теневой <code>&lt;a href&gt;</code>
        оборачивает всё, один таб-стоп. Заголовок — news-title 24/700/30
        ink-100 (строка DESIGN уже называет посты сообщества; зонд бьёт
        пиксель-гадания видения на уменьшенных ячейках). Обрезка — 2 строки
        (квартет клампа, FLAG), полный текст зеркалится в
        <code>title</code> якоря. Side-by-side цель:
        <code>tj-community-viewport-2026-09-28.png</code>.
      </p>
      <div class="tjpc-sheet">
        <tj-post-card href="#post-1">
          <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ирины Сомовой" />
          <span slot="byline">Ирина Сомова</span>
          <time slot="date" datetime="2026-09-29T11:20">29 сентября, 11:20</time>
          <h2 slot="title">
            Как мы выстроили процесс ревью в распределённой команде из двадцати
            человек и не потеряли скорость релизов
          </h2>
          <span slot="count">42</span>
        </tj-post-card>
      </div>
    </main>
  `,
};

export const Anatomy: Story = {
  name: 'Анатомия: слоты, кламп и зеркало title',
  render: () => html`
    ${canvasStyles}
    <main class="tjpc-canvas" lang="ru">
      <h1>Анатомия: слоты, кламп и зеркало title</h1>
      <p class="tjpc-note">
        Пять слотов: <code>avatar</code> (мини-круг 20px — структурный FLAG,
        обёртка aria-hidden: идентификацию несёт имя автора),
        <code>byline</code> (15/700/20 ink-100), <code>date</code>
        (time-meta 15/400 ink-300), <code>title</code> (news-title 24/700/30;
        уровень h2/h3 выбирает потребитель), <code>count</code> (число
        текстом; перед ним декоративный «пузырь» — SVG aria-hidden,
        currentColor, модель шеврона чипа). Разделители «·» — НА СТОРОНЕ
        потребителя внутри слотов byline/date: пустой слот не оставляет
        сиротской точки. Пустые avatar/count не оставляют фантомных
        артефактов — обёртки не рендерятся.
      </p>
      <div class="tjpc-sheet">
        <tj-post-card href="#anatomy">
          <span slot="byline">Павел Резник · <time datetime="2026-09-28">28 сентября</time></span>
          <h3 slot="title">Пост без аватара и без счётчика — ячейка остаётся ровной</h3>
        </tj-post-card>
      </div>
      <h2>Кламп: две строки с многоточием</h2>
      <p class="tjpc-note">
        Квартет клампа (FLAG, структурный): <code>-webkit-box</code> +
        <code>vertical</code> + <code>-webkit-line-clamp: 2</code> +
        <code>overflow: hidden</code> — контракт EXPERIENCE дословно.
        Восстановление — зеркало <code>title</code>: при slotchange
        заголовка компонент ставит <code>title</code> ЯКОРЯ в
        <code>textContent.trim()</code> первого назначенного элемента —
        полный текст едет тултипом. Потребительский <code>title</code> на
        хосте форвардится дословно и ПОБЕЖДАЕТ (включая пустую строку —
        намеренное подавление тултипа).
      </p>
      <div class="tjpc-sheet">
        <tj-post-card href="#clamp">
          <span slot="byline">Мария Ветрова</span>
          <time slot="date" datetime="2026-09-27">27 сентября</time>
          <h2 slot="title">
            Длинный заголовок, который обязан оборваться на второй строке с
            многоточием, потому что контракт сообщества требует ровно две
            строки ячейки сетки
          </h2>
          <span slot="count">7</span>
        </tj-post-card>
      </div>
      <h2>Фиделити-примечание счётчика</h2>
      <p class="tjpc-note">
        Референс подтыкает пузырь под строку обрезки; в ките счётчик едет
        СВОЕЙ строкой потока после клампнутого заголовка: кламп-бокс —
        блок, inline-сосед после него не может разделить его последнюю
        строку. Флоат-хаков не изобретаем — дельта зафиксирована для
        side-by-side мейнтейнера.
      </p>
      <h2>Контракт якоря</h2>
      <p class="tjpc-note">
        Пустой <code>href</code> — якорь без атрибута (инертный, вне
        табуляции); <code>target="_blank"</code> без rel получает
        <code>noopener noreferrer</code>; явный rel потребителя побеждает
        дословно — модель 16.1 verbatim.
      </p>
      <div class="tjpc-sheet">
        <tj-post-card href="">
          <span slot="byline">Артём Сомов</span>
          <h2 slot="title">Инертная ячейка: href пуст — таб-стопа нет</h2>
        </tj-post-card>
      </div>
    </main>
  `,
};

export const CommunityPattern: Story = {
  name: 'Паттерн: страница сообщества',
  render: () => html`
    ${canvasStyles}
    <style>
      /* Pattern-level canvas styles — the composition is a STORY, not
         shipped API (the epics ruling, the /pro/ hero mold). Structural
         FLAGS of the pattern:
         - composer on the PAGE (max-width + margin-bottom 32): the reference
           puts the white card on the GRAY PAGE above the sheet — inside the
           white sheet it vanishes tone-on-tone (the round-1 side-by-side
           vision verdict; fixed story-side, the component is unchanged);
         - sheet padding 32/40: the big-surface inset (scale reads);
         - grid 3 columns: the reference's «Выбор редакции» grid (capture). */
      .tjcp-composer {
        display: block;
        max-width: var(--tj-space-column-main); /* the sheet's column — one rhythm */
        margin: 0 0 var(--tj-space-32); /* FLAG: pattern-level composer→sheet rhythm */
      }
      .tjcp-sheet {
        max-width: var(--tj-space-column-main);
        margin: 0 0 var(--tj-space-16);
        padding: var(--tj-space-32) var(--tj-space-40); /* FLAG: pattern-level sheet inset */
        background: var(--tj-color-card); /* the big-surface pair with panel radius — the token system's sheet idiom; the vision's ~20px estimate is the known vision-radius artifact, probes rule */
        border-radius: var(--tj-radius-panel);
      }
      .tjcp-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* FLAG: the reference 3-col «Выбор редакции» grid */
        column-gap: var(--tj-space-24);
        row-gap: var(--tj-space-40);
      }
    </style>
    <main class="tjpc-canvas" lang="ru">
      <h1>Паттерн: страница сообщества</h1>
      <p class="tjpc-note">
        <strong>Это ПАТТЕРН композиции, а не API кита.</strong> Страница
        сообщества собирается потребителем: карточка-композер стоит ПРЯМО НА
        странице (<code>--tj-color-page</code>) отдельным элементом НАД
        листом — референс несёт её на сером фоне, и тон-в-тон на белом листе
        она бы исчезла (вердикт vision-раунда side-by-side). «Выбор
        редакции» — отдельный белый лист
        (<code>--tj-color-card</code> + <code>--tj-radius-panel</code> —
        пара больших поверхностей токен-системы) с сеткой 3 колонки из
        прозрачных <code>tj-post-card</code>; гуттеры — из шкалы
        расстояний, раскладка на стороне потребителя. Рекламные модули
        (жёлтые/синие заливки референса) — FR-21: за пределами этой
        истории, они переиспользуют промо-компоненты основного кита.
        Редактор тоже вне кита: клик по композеру диспетчит
        <code>open-compose</code> — открытие на потребителе. Всё — только
        <code>--tj-*</code> токены; обе темы перерешаются без веток в
        компонентах. Side-by-side цель:
        <code>tj-community-{viewport,fullpage}-2026-09-28.png</code>.
      </p>
      <tj-composer class="tjcp-composer">
        <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ирины Сомовой" />
      </tj-composer>
      <section class="tjcp-sheet">
        <div class="tjcp-grid">
          <tj-post-card href="#editorial-1">
            <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Ольги Даниной" />
            <span slot="byline">Ольга Данина</span>
            <time slot="date" datetime="2026-09-29T09:15">29 сентября, 09:15</time>
            <h2 slot="title">
              Разбор: как устроен резервный фонд семьи на шести месячных
              подушках
            </h2>
            <span slot="count">128</span>
          </tj-post-card>
          <tj-post-card href="#editorial-2">
            <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватар Павла Резника" />
            <span slot="byline">Павел Резник</span>
            <time slot="date" datetime="2026-09-28T18:40">28 сентября, 18:40</time>
            <h2 slot="title">Тест: какой у вас профиль инвестора — консерватор или охотник</h2>
            <span slot="count">64</span>
          </tj-post-card>
          <tj-post-card href="#editorial-3">
            <img slot="avatar" src=${AVATAR_PLACEHOLDER} alt="Аватара Марии Ветровой" />
            <span slot="byline">Мария Ветрова</span>
            <time slot="date" datetime="2026-09-28T12:00">28 сентября, 12:00</time>
            <h2 slot="title">Лонгрид: что изменилось в налогообложении самозанятых за год</h2>
            <span slot="count">31</span>
          </tj-post-card>
        </div>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Доступность',
  render: () => html`
    ${canvasStyles}
    <main class="tjpc-canvas" lang="ru">
      <h1>Доступность</h1>
      <p class="tjpc-note">
        Вся ячейка — один нативный <code>&lt;a&gt;</code>: роль, Enter и один
        таб-стоп по конструкции. Доступное имя якоря строится из его
        ПОДДЕРЕВА (автор → дата → заголовок → счётчик, порядок DOM — модель
        честной прозы 16.3, БЕЗ host-уровневых labelledby-заявлений).
        Аватар скрыт (<code>aria-hidden</code>), идентификацию несёт имя
        автора; «пузырь» счётчика — декорация (aria-hidden,
        focusable=false). Счётчик — статичный текст ink-300, НЕ live-регион:
        компонент ничего не диспетчит. Кольцо фокуса 2px — токен focus-ring
        на поверхности листа (AA-закон поверхностей: 3.067:1 non-text на
        карточке). Зеркало <code>title</code> якоря — тултип для мыши и
        восстановление полного текста после клампа (у скринридера текст
        заголовка и так весь в поддереве — кламп только визуальный).
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
              Фокус входит на ячейку ЦЕЛИКОМ / покидает её; кольцо 2px
              обводит всю ячейку с отступом 2px. Внутри ячейки таб-стопов
              нет — одна ссылка на всю ячейку.
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
              («Space scrolls», модель 16.3, I/O-матрица).
            </td>
          </tr>
          <tr>
            <td>Инертная ячейка</td>
            <td>href="" — вне табуляции целиком; визуально ячейка остаётся.</td>
          </tr>
        </tbody>
      </table>

      <h2>Протокол скринридер-проверки (VoiceOver / NVDA)</h2>
      <p class="tjpc-note">
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
            <td>Tab на ячейку</td>
            <td>
              Полное имя из поддерева якоря (автор, дата, заголовок,
              счётчик — порядок DOM) + «ссылка» — один элемент, не
              «ссылка ×4».
            </td>
          </tr>
          <tr>
            <td>Чтение ячейки</td>
            <td>
              Заголовок целиком (кламп только визуальный — в поддереве текст
              полный), затем автор и дата; аватар и «пузырь» молчат
              (aria-hidden).
            </td>
          </tr>
          <tr>
            <td>Соседние ячейки</td>
            <td>
              Три отдельные ссылки по одной — семантики списка/сетки кит не
              добавляет (роль даёт потребительская разметка паттерна).
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
};
