import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * TJ/Patterns/Community (spec 17.3) — the adoption-pattern overview for the
 * COMMUNITY page: the fake-input composer + post-sheet composition and links
 * to the live compositions. Prose-only page (no live components): the live
 * community composition stays baseline-pinned in the component suite
 * (tj-post-card--community-pattern); this page is the adoption map.
 *
 * Page chrome consumes the BANK --tk-* tokens (docs-site chrome is shared —
 * the ad-slot-recipe mold) with CHILD-SCOPED selectors (`.tjpat-page > h1`):
 * never a descendant selector that could reach into a slotted component flow
 * (the 16.6 triage catch). Content RU, story meta EN.
 */

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
  </style>
`;

const meta: Meta = {
  title: 'TJ/Patterns/Community',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${pageStyles}
    <div class="tjpat-page" lang="ru">
      <h1>Паттерн: страница сообщества</h1>
      <p>
        Сообщество — диалоговая страница ТЖ: карточка-композер
        (<code>tj-composer</code>) над листом постов
        (<code>tj-post-card</code>). Живая композиция собрана в наборе
        компонента —
        <a
          href="?path=/story/tj-post-card--community-pattern"
          target="_top"
          >TJ/Post Card → «Паттерн: страница сообщества»</a
        >; здесь — карта adoption-решений.
      </p>

      <h2>Что это</h2>
      <ul>
        <li>
          Композер — «фейковый инпут»: это КНОПКА, а не поле ввода. Канал
          <code>label</code> задаёт доступное имя, слот
          <code>avatar</code> — аватар автора, а весь контракт кита — событие
          <code>open-compose</code>: редактор остаётся на стороне
          потребителя.
        </li>
        <li>
          Пост-карточка — модель «вся карта — одна ссылка» (как
          <code>tj-news-card</code>): слоты аватар/автор/дата/заголовок/счётчик
          ответов, теневой якорь, один таб-стоп.
        </li>
        <li>
          Композиция: композер стоит на СЕРОЙ странице над белым листом
          (внутри белого листа он исчезает тон-в-тон — вердикт сверки), лист —
          карточка радиуса <code>--tj-radius-panel</code> с сеткой постов.
        </li>
        <li>
          Язык остаётся редакционным: плоские карточки, гротеск, никаких
          банковских акцентов — сообщество живёт внутри издания.
        </li>
      </ul>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Обсуждения материалов и темы рубрики: посты короче статей, лента
          плотнее, вход в диалог — с первого экрана.
        </li>
        <li>
          Сценарии, где редактор поста у потребителя свой: кит даёт входную
          точку и событие, не редактор.
        </li>
      </ul>

      <h2>Не для чего</h2>
      <ul>
        <li>
          Редакционные материалы — паттерн
          <a href="?path=/story/tj-patterns-article--page" target="_top"
            >Article</a
          >; ленты рубрик —
          <a href="?path=/story/tj-patterns-rubric--page" target="_top"
            >Rubric</a
          >.
        </li>
        <li>
          Банковские комментарии/отзывы: ростер ТЖ не рендерит банковскую
          айдентику (FR-17).
        </li>
      </ul>

      <p class="tjpat-note">
        Живые поверхности паттерна:
        <a href="?path=/story/tj-composer--playground" target="_top"
          >tj-composer</a
        >
        и
        <a href="?path=/story/tj-post-card--playground" target="_top"
          >tj-post-card</a
        >
        (песочницы, анатомия и контракты доступности — в их наборах).
      </p>
    </div>
  `,
};
