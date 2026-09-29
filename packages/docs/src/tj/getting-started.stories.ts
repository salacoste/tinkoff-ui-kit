import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

// The docs package composes BOTH families (AD-4 v5): this side-effect import
// is the allowed docs→tj-tokens lane, exercised from the scaffold so the
// workspace edge is proven by the build, not by prose. Since 15.2 the sheet
// is the generated table: 107 light --tj-* tokens plus the 13-override dark
// layer (dual emission — attribute + prefers-color-scheme auto leg).
import 'pillkit-tj-tokens/tokens.css';

/**
 * ТЖ getting started (spec 17.3) — the bank 5.5 mold duplicated-and-adapted:
 * install (ТЖ-ALONE — the FR-17 disjointness IS the point), theming
 * quickstart with the auto leg, the fonts contract (Inter/PT Serif harness
 * pins, Graphik/Charter licensed path, OQ-8), the ad-module recipe summary
 * with a one-directional cross-link to TJ/Ad Slot Recipe, and the
 * search/CONVENTIONS/API pointers.
 *
 * The unofficial disclaimer renders INLINE here — the persistent banner is
 * suppressed on this story by id (packages/docs/.storybook/preview.ts, the
 * inline-disclaimer list; FR-11). The live component-search demo is
 * deliberately NOT embedded (the 17.3 ruling): this page stays
 * non-interactive by design, keeping its a11y-sweep row honest at zero
 * stops — the search lives on the bank «Getting Started» page and in the
 * sidebar, this page only points to it.
 *
 * Chrome styling consumes the BANK --tk-* tokens by design: docs-site chrome
 * is shared, the ТЖ tokens own ТЖ component surfaces. Story id
 * tj-getting-started--page is KEPT (baselines + sweep registries ride it);
 * the export name stays `Page`, only the display name grew up.
 */

const REPO_URL = 'https://github.com/salacoste/tinkoff-ui-kit';
const CONVENTIONS_URL = `${REPO_URL}/blob/main/packages/tj-components/CONVENTIONS.md`;

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
    .tjgs a {
      color: var(--tk-color-link);
    }
    .tjgs .tjgs-disclaimer {
      margin: 0 0 var(--tk-space-24);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-tint-bluegray);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tjgs .tjgs-disclaimer strong {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-s-bold-weight);
    }
    .tjgs ul,
    .tjgs ol {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tjgs li {
      margin: 0 0 var(--tk-space-8);
    }
    .tjgs code {
      /* Code surfaces render the mono chain (story 11.2); block and inline
         alike. */
      font-family: var(--tk-font-mono);
    }
    .tjgs pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    /* Scrollable code blocks join the tab order (the page-scaffold mold). */
    .tjgs pre:focus-visible {
      outline: 2px solid var(--tk-color-focus-ring);
      outline-offset: 2px;
    }
    .tjgs .tjgs-note {
      margin-top: var(--tk-space-24);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-left: var(--tk-space-4) solid var(--tk-color-border-strong);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
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
  name: 'Начало работы',
  render: () => html`
    ${pageStyles}
    <div class="tjgs" lang="ru">
      <h1>pillkit-ТЖ — редакционное семейство</h1>
      <p class="tjgs-disclaimer" role="note">
        <strong>Неофициальный учебный проект.</strong> pillkit-ТЖ —
        независимое воссоздание редакционного языка Т—Журнала в учебных
        целях. Не аффилирован с Т-Банком и не одобрен им; товарные знаки
        не используются. Такой же дисклеймер закреплён над каждой историей.
      </p>
      <p>
        Редакционный язык ТЖ (журнал, рубрики, статьи, сообщество) живёт в
        собственном семействе пакетов
        <code>pillkit-tj-{tokens,components,react}</code> на том же
        substrate, что и банковский кит: TS strict, Vite lib ESM, Lit-ядро,
        React-обёртки из CEM-манифеста. Десять компонентов ростера
        (<code>tj-*</code>) закрывают чтение, ленты, сообщество и хром
        сайта; таблица токенов <code>--tj-*</code> сгенерирована вторым
        входом генератора (AD-3 v5) и НЕ делит значений с банком.
      </p>

      <h2>Установка — только семейство ТЖ</h2>
      <p>
        Семейство ставится ОТДЕЛЬНО от банка — в этом и есть контракт FR-17:
        ни один пакет ТЖ не импортирует банковские
        <code>pillkit-{tokens,components,react}</code> — и наоборот.
        Потребителю редакционного языка банковские пакеты не нужны. Как и
        банк, семейство распространяется только через этот репозиторий
        GitHub (<code>private: true</code> постоянно) — рабочий путь
        pnpm-линк воркспейса из checkout'а; сначала соберите пакеты кита:
        exports указывают на <code>./dist</code>.
      </p>
      <pre tabindex="0"><code>git clone ${REPO_URL}
cd my-app && pnpm init
# добавьте checkout кита в свой pnpm-workspace.yaml:
#   packages:
#     - .
#     - ../tinkoff-ui-kit/packages/*
# соберите пакеты кита — exports указывают на ./dist:
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
# my-app — корень воркспейса, поэтому каждый add требует -w:
pnpm add -w pillkit-tj-tokens pillkit-tj-components pillkit-tj-react --workspace</code></pre>
      <p>
        Если собираете приложение на vite — обязательны три строки
        дедупликации: воркспейс-линк даёт бандлеру два физических экземпляра
        <code>react</code> — ваш и локальную копию из чекаута кита, — и без
        дедупликации React-обёртки падают с «Invalid hook call» (найдено
        релизным гейтом v1.1.0).
      </p>
      <pre tabindex="0"><code>// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });</code></pre>
      <p>
        Полный рецепт быстрого старта (workspace-файл, index.html, main.ts) —
        <code>README.md → «Быстрый старт»</code>.
      </p>

      <h2>Быстрый старт: темизация</h2>
      <ol>
        <li>
          Подключите токеновый лист один раз на уровне
          <strong>документа</strong> — он каскадом спускается с
          <code>&lt;html&gt;</code>, а компоненты наследуют разрешённые
          custom properties в свои shadow root:
          <pre tabindex="0"><code>import 'pillkit-tj-tokens/tokens.css';</code></pre>
          Не внедряйте этот лист внутрь shadow root: светлый слой объявляет
          значения на <code>:host</code> — они перебьют унаследованные тёмные
          значения, когда документ переключён в тёмную тему (ловушка
          shadow-каскада).
        </li>
        <li>
          Тема — атрибут <code>data-tj-theme</code> на корне документа. У ТЖ
          есть нога AUTO, которой нет в банке: без атрибута тёмная включается
          сама под <code>prefers-color-scheme: dark</code>; явный
          <code>"light"</code> разоружает авто-ногу:
          <pre tabindex="0"><code>&lt;html data-tj-theme="dark"&gt;   <!-- явно -->
&lt;html&gt;                    <!-- auto: следует системе --&gt;</code></pre>
          Попробуйте контрол Theme в тулбаре Storybook. Полный контракт
          переключения и переопределений — в
          <a href="?path=/story/tj-theming-guide--switching" target="_top"
            >ТЖ Theming Guide</a
          >.
        </li>
      </ol>

      <h2>Шрифты</h2>
      <p>
        Байтов шрифтов кит не дистрибутирует (OQ-8). Слоты
        <code>--tj-font-ui</code> / <code>--tj-font-reading</code> несут
        лицензируемые семейства референса первыми — Graphik (гротеск:
        интерфейс и заголовки) и Charter (сериф: колонка чтения, самый
        сильный идентификатор ТЖ) — с открытыми cyrillic-способными fallback
        (Inter / PT Serif): без лицензий рендерится fallback-цепочка. Этот
        документационный харнесс пинит оба слота на локально раздаваемые
        Inter / PT Serif (детерминированные рендеры на любой машине);
        лицензионные woff2 кладите в
        <code>packages/docs/src/local-fonts/</code> (папка gitignored) по
        шаблону <code>local-fonts.example.css</code>. Своё семейство
        ставьте ПЕРВЫМ в стеке и повторите fallback в конце — значение слота
        заменяется целиком.
      </p>

      <h2>Рекламный модуль в ТЖ-потоке (Flow C)</h2>
      <p>
        Редакционная лента с рекламой — рецепт, а не компонент: слот —
        ЧИСТАЯ геометрия сетки (ячейки 760 в потоке / 290 в колонке рельса,
        без рамки и фоновой заливки — пустой слот схлопывается в нуль), а
        содержимое потребитель собирает сам из своих компонентов. Граница
        FR-21: вокруг слота ТЖ-поверхность читает только
        <code>--tj-*</code>, банковская промо-карта — только свои
        <code>--tk-*</code>; ни один var() не пересекает границу. Полный
        рецепт с живой композицией —
        <a href="?path=/story/tj-ad-slot-recipe--recipe" target="_top"
          >TJ/Ad Slot Recipe</a
        >.
      </p>

      <h2>Справочники и поиск</h2>
      <p>
        Полная таблица токенов ТЖ (светлая/тёмная бок о бок, живые образцы) —
        <a href="?path=/story/tj-token-reference--colors" target="_top"
          >TJ/Token Reference</a
        >; реестры, тёмный слой и AA-правила — история «Регистры ТЖ» там же.
        Таблицы API каждого компонента — на его странице (история «API»);
        контракт API-грамматики семейства —
        <a href="${CONVENTIONS_URL}" target="_blank" rel="noreferrer noopener"
          >CONVENTIONS.md</a
        >. Поиск по компонентам — на странице банка «Getting Started» и в
        боковой панели: все 10 компонентов <code>tj-*</code> и паттерны
        ТЖ находятся поиском по «tj».
      </p>

      <h2>Паттерны adoption</h2>
      <p>
        Композиции страниц — статья, рубрика, сообщество, /pro/ — собраны в
        группу TJ/Patterns: что/когда/не-для-чего и указатели на живые
        композиции (включая демо рубрики — rubric-header + лента news-card).
      </p>

      <p class="tjgs-note">
        Статус: десять компонентов (16.1–16.5, фриз API-грамматики),
        паттерн страницы статьи и рецепт рекламного слота (16.6), свипы
        доступности и тёмной темы (17.1/17.2 — 185 зелёных ног), документация
        семейства (17.3 — эта страница). Распространение — только этот
        репозиторий; теги релизов общие с банком.
      </p>
    </div>
  `,
};
