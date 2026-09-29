import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../../tj-components/src/tj-news-card/tj-news-card.js';
import '../../../tj-components/src/tj-rubric-header/tj-rubric-header.js';

/**
 * TJ/Patterns/Rubric (spec 17.3) — the adoption-pattern overview for the
 * RUBRIC landing page PLUS the family's one live pattern demo: the reference
 * composition (tj-rubric-header + a tj-news-card feed) rendered in a
 * --tj-*-only stage, exactly the way a consumer assembles a rubric page.
 *
 * Page chrome consumes the BANK --tk-* tokens (docs-site chrome is shared —
 * the ad-slot-recipe mold) with CHILD-SCOPED selectors (`.tjpat-page > h1`):
 * the 16.6 triage catch — an outer descendant selector (0,1,1) beats the
 * component's ::slotted rules in Chromium and would repaint the slotted
 * rubric H1 in bank chrome. Chrome never descends into the slotted flow.
 *
 * The stage consumes --tj-* ONLY (the FR-21 boundary). Demo data SYNTHETIC,
 * zero PII; placeholder art = NEUTRAL named-color SVG data URLs (the
 * store-badges mold — content, but clean of hex literals). Counts and
 * timestamps ride ink-300 on the card (the authored AA meta step); the
 * RESTRICTED inks (engage / ink-reference-time) are never story-rendered.
 * Content RU, story meta EN.
 */

const COVER_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1180 215'><rect width='1180' height='215' fill='gray'/><circle cx='920' cy='215' r='150' fill='silver'/><circle cx='260' cy='215' r='110' fill='darkgray'/></svg>`,
)}`;

const MARK_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='30' fill='dimgray'/><circle cx='50' cy='50' r='22' fill='white'/></svg>`,
)}`;

const AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='darkgray'/><circle cx='32' cy='26' r='12' fill='white'/><path d='M10 60c4-12 12-18 22-18s18 6 22 18' fill='white'/></svg>`,
)}`;

const pageStyles = html`
  <style>
    .tjpat-page {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-base);
    }
    /* CHILD-SCOPED (the ad-slot-recipe mold): page chrome never descends
       into slotted component flow. */
    .tjpat-page > h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tjpat-page > h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tjpat-page > p {
      margin: 0 0 var(--tk-space-12);
    }
    .tjpat-page > ul {
      margin: 0 0 var(--tk-space-12);
      padding-left: var(--tk-space-20);
    }
    .tjpat-page > ul > li {
      margin-bottom: var(--tk-space-4);
    }
    .tjpat-page a {
      color: var(--tk-color-link);
    }
    .tjpat-page code {
      /* Code surfaces render the mono chain (story 11.2); block and inline
         alike. */
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
    }
    .tjpat-page .tjpat-note {
      margin-top: var(--tk-space-24);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
    }
    /* --- The ТЖ stage: --tj-* ONLY from here down (the FR-21 boundary) --- */
    .tjpat-stage {
      box-sizing: border-box;
      margin-block: var(--tj-space-32);
      padding: var(--tj-space-32) var(--tj-space-24);
      background: var(--tj-color-page);
      border-radius: var(--tj-radius-panel);
      font-family: var(--tj-font-ui);
      color: var(--tj-color-ink-100);
    }
    .tjpat-feed {
      display: flex;
      flex-direction: column;
      gap: var(--tj-space-24);
      max-width: var(--tj-space-column-reading-body);
      margin: var(--tj-space-32) auto 0;
    }
    .tjpat-caption {
      max-width: var(--tj-space-column-reading-body);
      margin: var(--tj-space-16) auto 0;
      font-size: var(--tj-text-time-meta-size);
      font-weight: var(--tj-text-time-meta-weight);
      line-height: var(--tj-text-byline-leading);
      /* Page-ground text rides ink-100 exactly like the tj-rail row labels
         (ink-300 is a CARD-ground step only — the 16.5 mold, both themes). */
      color: var(--tj-color-ink-100);
    }
  </style>
`;

const meta: Meta = {
  title: 'TJ/Patterns/Rubric',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${pageStyles}
    <div class="tjpat-page" lang="ru">
      <h1>Паттерн: страница рубрики</h1>
      <p>
        Лендинг рубрики — шапка-владелец (<code>tj-rubric-header</code>) и
        лента карточек (<code>tj-news-card</code>): одна модель «вся карта —
        одна ссылка», плоские карточки без теней, ритм задан вертикальным
        шагом ленты. Живая композиция — история «Демо» в этом же наборе;
        покомпонентные песочницы — в наборах самих компонентов.
      </p>

      <h2>Что это</h2>
      <ul>
        <li>
          Шапка: карточка <code>--tj-radius-panel</code> (30) с обложкой
          (клип верхних углов), сквиркл-маркой 100×100 внахлёст и
          <strong>слоттированным</strong> заголовком — компонент никогда не
          рендерит свой <code>h1</code>.
        </li>
        <li>
          Лента: карточки радиуса <code>--tj-radius-card</code> (25) шириной
          760, теневой якорь на всю карту — один таб-стоп, доступное имя
          строится из поддерева.
        </li>
        <li>
          Хром страницы: <code>tj-header</code> + <code>tj-rail</code>
          (текущая рубрика подсвечена значением <code>current-value</code>).
        </li>
      </ul>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Разделы издания: «Новости», «Разборы», «Истории» — стабильный
          список лент с одинаковой картой чтения.
        </li>
        <li>
          Потоки с рекламным подмешиванием: между карточками встаёт слот рецепта
          <a href="?path=/story/tj-ad-slot-recipe--recipe" target="_top"
            >TJ/Ad Slot Recipe</a
          >.
        </li>
      </ul>

      <h2>Не для чего</h2>
      <ul>
        <li>
          Материал чтения — паттерн
          <a href="?path=/story/tj-patterns-article--page" target="_top"
            >Article</a
          >: рубрика не серифная колонка, а лента.
        </li>
        <li>
          Обсуждения и посты сообщества — паттерн
          <a href="?path=/story/tj-patterns-community--page" target="_top"
            >Community</a
          >; /pro/-лендинги —
          <a href="?path=/story/tj-patterns-pro--page" target="_top">Pro</a>.
        </li>
      </ul>

      <p class="tjpat-note">
        Живые поверхности паттерна:
        <a
          href="?path=/story/tj-rubric-header--playground"
          target="_top"
          >tj-rubric-header</a
        >
        и
        <a href="?path=/story/tj-news-card--playground" target="_top"
          >tj-news-card</a
        >
        (песочницы и контракты доступности — там же); правила тёмной темы
        ленты — в
        <a href="?path=/story/tj-theming-guide--dark-pairing" target="_top"
          >Theming Guide</a
        >.
      </p>
    </div>
  `,
};

export const Demo: Story = {
  name: 'Демо',
  render: () => html`
    ${pageStyles}
    <div class="tjpat-page" lang="ru">
      <h1>Демо: страница рубрики</h1>
      <p>
        Референсная композиция «шапка + лента» в живых компонентах: шапка
        рубрики с обложкой, маркой и слоттированным <code>h1</code>, под ней
        лента из четырёх карточек (у каждой — теневой якорь на всю карту).
        Каркас страницы собирается потребителем: <code>tj-header</code> и
        <code>tj-rail</code> сюда не подмешаны — их композиция живёт в
        <a href="?path=/story/tj-rail--chrome-composition" target="_top"
          >tj-rail → «Композиция хрома»</a
        >.
      </p>

      <div class="tjpat-stage" lang="ru">
        <tj-rubric-header>
          <img slot="cover" src=${COVER_PLACEHOLDER} alt="" />
          <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
          <h1>Новости</h1>
          <p>Рассказываем всё важное и объясняем, как оно влияет на жизнь</p>
        </tj-rubric-header>
        <div class="tjpat-feed">
          <tj-news-card href="#tjpat-news-1" aria-labelledby="tjpat-title-1">
            <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
            <img
              slot="avatar"
              src=${AVATAR_PLACEHOLDER}
              alt="Аватар Марии Ветровой"
            />
            <span slot="byline">Мария Ветрова</span>
            <h2 slot="title" id="tjpat-title-1">
              Минздрав зарегистрировал первую четырёхвалентную вакцину от
              менингококка
            </h2>
            <p slot="excerpt">
              Четырёхвалентная схема закрывает сразу четыре серогруппы —
              прежде в обороте были только двухвалентные. Разбираемся, что
              меняется в национальном календаре прививок.
            </p>
            <span slot="meta">
              <time datetime="2026-09-29T09:40">29 сентября, 09:40</time>
              <span aria-hidden="true"> · </span>
              <span>12 комментариев</span>
            </span>
          </tj-news-card>
          <tj-news-card href="#tjpat-news-2" aria-labelledby="tjpat-title-2">
            <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
            <img
              slot="avatar"
              src=${AVATAR_PLACEHOLDER}
              alt="Аватар Артема Сомова"
            />
            <span slot="byline">Артём Сомов</span>
            <h3 slot="title" id="tjpat-title-2">
              Как читать счета за ЖКУ: три строки, на которые стоит смотреть
              первыми
            </h3>
            <span slot="meta">
              <time datetime="2026-09-28T18:05">28 сентября, 18:05</time>
              <span aria-hidden="true"> · </span>
              <span>7 комментариев</span>
            </span>
          </tj-news-card>
          <tj-news-card href="#tjpat-news-3" aria-labelledby="tjpat-title-3">
            <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
            <h3 slot="title" id="tjpat-title-3">
              Разбор: почему карта с кешбэком «на всё» не бывает бесплатной
            </h3>
            <p slot="excerpt">
              Синтетический материал для демонстрации карточки без аватара
              автора: лента допускает разнородный состав строк.
            </p>
            <span slot="meta">
              <time datetime="2026-09-27T12:00">27 сентября, 12:00</time>
              <span aria-hidden="true"> · </span>
              <span>31 комментарий</span>
              <span aria-hidden="true"> · </span>
              <span>412 прочитавших</span>
            </span>
          </tj-news-card>
          <tj-news-card href="#tjpat-news-4" aria-labelledby="tjpat-title-4">
            <img slot="mark" src=${MARK_PLACEHOLDER} alt="" />
            <img
              slot="avatar"
              src=${AVATAR_PLACEHOLDER}
              alt="Аватар Дарьи Ким"
            />
            <span slot="byline">Дарья Ким</span>
            <h3 slot="title" id="tjpat-title-4">
              Что изменилось в правилах перевозки животных в 2026 году
            </h3>
            <span slot="meta">
              <time datetime="2026-09-26T08:30">26 сентября, 08:30</time>
              <span aria-hidden="true"> · </span>
              <span>3 комментария</span>
            </span>
          </tj-news-card>
        </div>
        <p class="tjpat-caption">
          Четыре карточки — четыре таб-стопа: теневой якорь каждой карты
          един; шапка рубрики интерактивов не несёт.
        </p>
      </div>

      <p class="tjpat-note">
        Демо синтетично (нулевая PII): имена, счётчики и время —
        демонстрационный материал. Песочницы компонентов, слот-анатомия и
        скелетон ленты — в наборах
        <a href="?path=/story/tj-rubric-header--playground" target="_top"
          >tj-rubric-header</a
        >
        и
        <a href="?path=/story/tj-news-card--playground" target="_top"
          >tj-news-card</a
        >.
      </p>
    </div>
  `,
};
