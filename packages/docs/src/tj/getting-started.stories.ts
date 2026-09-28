import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

// The docs package composes BOTH families (AD-4 v5): this side-effect import
// is the allowed docs→tj-tokens lane, exercised from the scaffold so the
// workspace edge is proven by the build, not by prose. At 15.1 the sheet
// carries only the --tj-scaffold-placeholder marker; the generated table
// lands at 15.2.
import 'pillkit-tj-tokens/tokens.css';

/**
 * ТЖ section shell (story 15.1): a placeholder story group so the ТЖ family
 * is visible in the docs tree before any token or component exists. The real
 * section — getting started, token reference, component pages — is story
 * 17.3; this page only states the family contract (FR-17 runtime
 * disjointness from the bank kit, the --tj- element- and data-tj-theme
 * naming, the epic roadmap). Chrome styling consumes the BANK --tk-* tokens
 * by design: docs-site chrome is shared, the ТЖ tokens own ТЖ component
 * surfaces.
 */

const pageStyles = html`
  <style>
    .tjgs {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      /* Canvas follows the theme's base surface (the 5.4 dark-sweep rule):
         without an explicit paint the browser canvas stays WHITE in dark. */
      background: var(--tk-color-surface-base);
    }
    .tjgs h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tjgs h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tjgs p {
      margin: 0 0 var(--tk-space-12);
    }
    .tjgs ul {
      margin: 0 0 var(--tk-space-12);
      padding-left: var(--tk-space-20);
    }
    .tjgs li {
      margin-bottom: var(--tk-space-4);
    }
    .tjgs .tjgs-note {
      margin-top: var(--tk-space-24);
      padding: var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-muted);
      color: var(--tk-color-text-secondary);
    }
    .tjgs code {
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
    }
  </style>
`;

// Group title stays LATIN (like every other group — Components, Guides,
// Patterns): story ids slugify from the title, the visual harness's id
// grammar is test-pinned ASCII (/^[a-z0-9-]+--…$/), and SB10's typed CSF
// surface offers no story-level id override. The ТЖ identity reads through
// the Cyrillic STORY display name (the tree's convention: display names
// Russian, group slugs Latin) — «TJ» is the ASCII rendering of «ТЖ».
const meta: Meta = {
  title: 'TJ/Getting started',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Скаффолд',
  render: () => html`
    ${pageStyles}
    <div class="tjgs">
      <h1>ТЖ — отдельный под-кит семейства pillkit</h1>
      <p>
        Редакционный язык ТЖ (журнал, рубрики, статьи) живёт в собственном
        семействе пакетов <code>pillkit-tj-{tokens,components,react}</code> на
        том же substrate, что и банковский кит: TS strict, Vite lib ESM,
        Lit-ядро, React-обёртки из CEM-манифеста. Потребитель может взять
        семейство ТЖ отдельно — без банковских пакетов.
      </p>

      <h2>Контракт семейства</h2>
      <ul>
        <li>
          Независимость от банка (FR-17): ни один пакет ТЖ не импортирует
          банковские <code>pillkit-{tokens,components,react}</code> — и
          наоборот. Docs-пакет собирает оба семейства и только он.
        </li>
        <li>
          Именование (OQ-9): элементы <code>tj-*</code>, токены
          <code>--tj-*</code>, тема — атрибут <code>data-tj-theme</code> со
          значениями light/dark/auto.
        </li>
        <li>
          Токены и компоненты ТЖ НЕ делят таблицу значений с банком: один
          генератор — два входа (ТЖ DESIGN.md как второй вход, AD-3 v5).
        </li>
      </ul>

      <h2>Статус (история 15.1 — скаффолд)</h2>
      <ul>
        <li>Пакеты заскаффолжены, границы импортов и CI работают — эта страница и есть доказательство видимости семейства в docs.</li>
        <li>15.2 — таблица токенов <code>--tj-*</code> (генератор, пробы радиусов/теней, AA-пины).</li>
        <li>15.3 — шрифтовый контракт (Graphik + Charter, честные фолбэки).</li>
        <li>Эпик 16 — компоненты <code>tj-*</code> (16.1 фризирует API-грамматику по CONVENTIONS.md пакета).</li>
        <li>17.3 — настоящая документация ТЖ на месте этого стаба.</li>
      </ul>

      <p class="tjgs-note">
        Это заглушка секции: контент и оформление придут со story 17.3.
        Рабочая таблица токенов пока не существует — импорт
        <code>pillkit-tj-tokens/tokens.css</code> выше несёт только маркер
        <code>--tj-scaffold-placeholder</code>.
      </p>
    </div>
  `,
};
