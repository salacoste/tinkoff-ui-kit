import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * TJ/Patterns/Article (spec 17.3) — the adoption-pattern overview for the
 * ARTICLE page: what it is, when, not-for-what, the composition roster and
 * one-directional links to the live compositions. Prose-only page (no live
 * components): the live article composition lives in the component suites
 * (tj-article-page--page-composition) and stays baseline-pinned there; this
 * page is the map, not the territory.
 *
 * Page chrome consumes the BANK --tk-* tokens (docs-site chrome is shared —
 * the ad-slot-recipe mold) with CHILD-SCOPED selectors (`.tjpat-page > h1`):
 * never a descendant selector that could reach into a slotted component flow
 * (the 16.6 triage catch — outer chrome must not repaint ::slotted rules).
 * Content RU, story meta EN.
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
  title: 'TJ/Patterns/Article',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${pageStyles}
    <div class="tjpat-page" lang="ru">
      <h1>Паттерн: страница статьи</h1>
      <p>
        Статья — центральный паттерн ТЖ и его самый сильный идентификатор:
        серифная колонка чтения в Charter на карточке, гротеск в подзаголовках,
        ссылки вида зонда и тихие CTA-плашки. Живая композиция собрана в
        наборе компонента —
        <a href="?path=/story/tj-article-page--page-composition" target="_top"
          >TJ/Article Page → «Композиция»</a
        >; эта страница — карта adoption-решений, а не ещё одна копия композиции.
      </p>

      <h2>Что это</h2>
      <ul>
        <li>
          Колонка чтения <code>--tj-space-column-reading</code> (764) с телом
          <code>760</code> — типографика
          <code>article-lead</code>/<code>article-body</code>/<code>body-link</code>
          серифного регистра, заголовки — гротеск.
        </li>
        <li>
          Каркас страницы: <code>tj-header</code> + <code>tj-rail</code> и
          главный поток из <code>tj-prose</code>; реклама — по рецепту слота
          (геометрия сетки, банковская промо-карта внутри).
        </li>
        <li>
          Тема — атрибутом документа; FLAT: единственная тень —
          <code>--tj-shadow-overlay</code>, иерархию строят тональные ступени
          поверхностей.
        </li>
      </ul>

      <h2>Когда использовать</h2>
      <ul>
        <li>Редакционные материалы: лонгриды, разборы, инструкции, истории.</li>
        <li>
          Страницы, где чтение — главный сценарий: колонка 764 мерная единица
          самого паттерна, ритм вертикален, отвлекающей элевации нет.
        </li>
      </ul>

      <h2>Не для чего</h2>
      <ul>
        <li>
          Ленты и рубричные страницы — паттерн
          <a href="?path=/story/tj-patterns-rubric--page" target="_top">Rubric</a>.
        </li>
        <li>
          Страницы обсуждений — паттерн
          <a href="?path=/story/tj-patterns-community--page" target="_top"
            >Community</a
          >; сервисные лендинги —
          <a href="?path=/story/tj-patterns-pro--page" target="_top">Pro</a>.
        </li>
        <li>
          Банковские продуктовые страницы: это язык другого семейства
          (FR-17) — компоненты ТЖ не рендерят банковскую айдентику.
        </li>
      </ul>

      <h2>Состав</h2>
      <ul>
        <li>
          <code>tj-prose</code> — колонка чтения (слоты lead/тела, серифный
          регистр, паузы между блоками).
        </li>
        <li>
          <code>tj-link</code> — ссылка вида зонда в теле (правило двух
          поверхностей: чернила парны основе под ними).
        </li>
        <li>
          <code>tj-cta</code> — тихая навигационная плашка: видимые 30px в
          невидимом боксе 44×44 (интерактивная поверхность — бокс).
        </li>
        <li>
          Рекламный слот — рецепт, не компонент:
          <a href="?path=/story/tj-ad-slot-recipe--recipe" target="_top"
            >TJ/Ad Slot Recipe</a
          >.
        </li>
      </ul>

      <!-- Ссылки — на грунте страницы, НЕ внутри muted-бокса: банковская
           пара --tk-color-link даёт AA на surface-base (4.62), на
           surface-muted в светлой теме — 4.24, провал (закон 17.3;
           находка CI-рана 36617540273 по пяти паттерн-страницам). -->
      <p>
        Токены паттерна — шрифтовые слоты и шкала статьи — на странице
        <a href="?path=/story/tj-token-reference--typography" target="_top"
          >«Типографика» TJ/Token Reference</a
        >; контракты тем — в
        <a href="?path=/story/tj-theming-guide--dark-pairing" target="_top"
          >«Правилах тёмной темы»</a
        >.
      </p>
    </div>
  `,
};
