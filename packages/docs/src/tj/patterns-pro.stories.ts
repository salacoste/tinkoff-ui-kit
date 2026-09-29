import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * TJ/Patterns/Pro (spec 17.3) — the adoption-pattern overview for the /pro/
 * LANDING: the purple hero field with tag chips and the twin-pinned purple
 * pair, gold accents and their theme invariants. Prose-only page (no live
 * components): the live hero composition stays baseline-pinned in the
 * component suite (tj-tag-chip--pro-hero-pattern); this page is the
 * adoption map.
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
  title: 'TJ/Patterns/Pro',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${pageStyles}
    <div class="tjpat-page" lang="ru">
      <h1>Паттерн: /pro/ лендинг</h1>
      <p>
        Сервисная витрина ТЖ — hero-поле фиолетового семейства с
        тег-чипами, CTA на закреплённой паре и золотыми акцентами. Живая
        композиция hero собрана в наборе компонента —
        <a href="?path=/story/tj-tag-chip--pro-hero-pattern" target="_top"
          >TJ/Tag Chip → «Паттерн: /pro/ hero»</a
        >; здесь — карта adoption-решений и инварианты семейства.
      </p>

      <h2>Что это</h2>
      <ul>
        <li>
          Hero-поле <code>--tj-color-badge-purple</code> радиуса
          <code>--tj-radius-panel</code>: заголовок
          <code>pro-h1</code> чернилами <code>chip-ink</code> — белое на
          фиолетовом, машинно-закреплённая пара 4.536:1 (16.2/16.3).
        </li>
        <li>
          Теги-чипы <code>tj-tag-chip</code> на заливке
          <code>--tj-color-chip-fill</code>: та же закреплённая пара
          <code>chip-ink</code>/<code>chip-fill</code>, высота чипа 40.
        </li>
        <li>
          CTA героя — плашка на <code>badge-purple</code> с чернилами
          <code>chip-ink</code> (пара из того же закрепления), радиус
          <code>--tj-radius-cta-promo</code> (10).
        </li>
        <li>
          Золотые акценты <code>--tj-color-gold</code> /
          <code>--tj-color-gold-ink</code> — служебные выделения /pro/
          (бейджи, «про»-статусы); чернила <code>gold-ink</code> — AA-пара
          на светлых поверхностях.
        </li>
      </ul>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Сервисные страницы издания: подписки, витрины сервисов, промо
          внутренних продуктов — там, где нужен голос ГРОМЧЕ
          редакционного.
        </li>
        <li>
          Плотные CTA-зоны: чипы-теги ведут на тематические потоки, главный
          CTA — на целевое действие.
        </li>
      </ul>

      <h2>Не для чего</h2>
      <ul>
        <li>
          Контентное чтение — паттерны
          <a href="?path=/story/tj-patterns-article--page" target="_top"
            >Article</a
          >/
          <a href="?path=/story/tj-patterns-rubric--page" target="_top"
            >Rubric</a
          >: фиолетовое поле — акцент, не основа; страница им не заливается.
        </li>
        <li>
          Обсуждения —
          <a href="?path=/story/tj-patterns-community--page" target="_top"
            >Community</a
          >.
        </li>
        <li>
          Банковские промо в ТЖ-потоке: это РЕЦЕПТ границы (FR-21) —
          банковская <code>tk-promo-card</code> остаётся сама собой внутри
          слота
          <a href="?path=/story/tj-ad-slot-recipe--recipe" target="_top"
            >TJ/Ad Slot Recipe</a
          >; перекрашивать её под /pro/ нельзя ни в одну сторону.
        </li>
      </ul>

      <h2>Инварианты темы — главное правило паттерна</h2>
      <ul>
        <li>
          Фиолетовые и золотые семейства НЕ переопределяются тёмным слоем:
          hero и чипы остаются на своих полях в обеих темах, пары закреплены
          (17.2 свип: инвариантность — легальное исключение для leftover).
        </li>
        <li>
          Переопределять СЕМЬЮ полей на уровне листа нельзя — сломаются
          закрепления чипов и hero; легальна только локальная пара на
          scoped-носителе с ТОЙ ЖЕ закреплённой парой чернил.
        </li>
      </ul>

      <p class="tjpat-note">
        Значения пар и формулировки правил — в
        <a href="?path=/story/tj-token-reference--registers" target="_top"
          >«Регистрах ТЖ»</a
        >; живые чипы —
        <a href="?path=/story/tj-tag-chip--playground" target="_top"
          >tj-tag-chip</a
        >; правила переопределений —
        <a href="?path=/story/tj-theming-guide--overrides" target="_top"
          >Theming Guide → «Переопределение токенов»</a
        >.
      </p>
    </div>
  `,
};
