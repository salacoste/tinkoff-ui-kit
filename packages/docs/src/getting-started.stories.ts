import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './component-search.js';

/**
 * Docs index / getting-started (spec 1.5, completed at 5.5): install,
 * theming quickstart, the font slot with precise Daytona licensing, the
 * interactive component search with the EXPERIENCE empty state, and the
 * cold-load skeleton demo (the docs-site states live HERE — see
 * component-search.ts for the SB-chrome scope ruling). All styling consumes
 * var(--tk-*) tokens (FR-1); the unofficial disclaimer renders inline — the
 * persistent banner is suppressed on this story by id (.storybook/preview.ts).
 */

const REPO_URL = 'https://github.com/salacoste/tinkoff-ui-kit';
const CONVENTIONS_URL = `${REPO_URL}/blob/main/packages/components/CONVENTIONS.md`;
const FONTS_LICENSE_URL = `${REPO_URL}/blob/main/packages/tokens/fonts/LICENSE-FONTS.md`;

const pageStyles = html`
  <style>
    .tkgs {
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
    .tkgs h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkgs h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkgs p {
      margin: 0 0 var(--tk-space-12);
    }
    .tkgs a {
      color: var(--tk-color-link);
    }
    .tkgs .tkgs-disclaimer {
      margin: 0 0 var(--tk-space-24);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-tint-bluegray);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs .tkgs-disclaimer strong {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-s-bold-weight);
    }
    .tkgs pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs code {
      font-family: var(--tk-font-body);
    }
    .tkgs ol {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tkgs li {
      margin: 0 0 var(--tk-space-8);
    }
    .tkgs .tkgs-status {
      margin: var(--tk-space-32) 0 0;
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      /* UX-DR17 (Story 5.6 yellow audit): a callout rule is decoration —
         yellow is reserved for primary actions and active indicators. */
      border-left: var(--tk-space-4) solid var(--tk-color-border-strong);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    /* Cold-load skeleton (EXPERIENCE State Patterns «Skeleton»): gray blocks
       matching THIS page's layout; STATIC by design — the kit's skeleton
       pattern carries no shimmer, so it is reduced-motion-safe as-is. */
    .tkgs .tkgs-skeleton {
      box-sizing: border-box;
      padding: var(--tk-space-24);
      background: var(--tk-color-surface-base);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    /* border-default, not gray-200: the token flips in dark — gray-200
       paints near-white skeleton blocks there (the article-card precedent). */
    .tkgs .tkgs-skeleton__block {
      background: var(--tk-color-border-default);
      border-radius: var(--tk-radius-xs);
    }
    .tkgs .tkgs-skeleton__title {
      width: 40%;
      height: var(--tk-text-heading-5-size);
      margin-bottom: var(--tk-space-16);
    }
    .tkgs .tkgs-skeleton__line {
      height: var(--tk-text-body-s-size);
      margin-bottom: var(--tk-space-8);
    }
    .tkgs .tkgs-skeleton__line--90 {
      width: 90%;
    }
    .tkgs .tkgs-skeleton__line--60 {
      width: 60%;
    }
    .tkgs .tkgs-skeleton__field {
      box-sizing: border-box;
      width: 100%;
      height: var(--tk-space-48);
      margin: var(--tk-space-8) 0 var(--tk-space-16);
      border-radius: var(--tk-radius-sm);
    }
    .tkgs .tkgs-skeleton__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--tk-space-grid-gap);
    }
    .tkgs .tkgs-skeleton__card {
      height: var(--tk-space-96);
      border-radius: var(--tk-radius-sm);
    }
    @media (max-width: 767px) {
      .tkgs .tkgs-skeleton__grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
`;

const meta: Meta = {
  title: 'Getting Started',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Начало работы',
  render: () => html`
    ${pageStyles}
    <main class="tkgs">
      <h1>pillkit</h1>
      <p class="tkgs-disclaimer" role="note">
        <strong>Неофициальный учебный проект.</strong> pillkit — независимое
        воссоздание дизайна Т-Банка (экс-Тинькофф) в учебных целях. Не
        аффилирован с Т-Банком и не одобрен им; товарные знаки Т-Банка не
        используются. Такой же дисклеймер закреплён над каждой историей.
      </p>

      <h2>Установка</h2>
      <p>
        Пакеты называются <code>pillkit-tokens</code>,
        <code>pillkit-components</code> и <code>pillkit-react</code>. Кит
        распространяется только через этот репозиторий GitHub — в npm он не
        публикуется (<code>private: true</code> стоит постоянно): проект
        закрытый учебный, и отдельно-лицензированные шрифты делают реестр
        неудобным каналом. Рабочий путь — pnpm-линк воркспейса из checkout'а
        репозитория; для воспроизводимости пинуйте релизный тег
        (<code>git clone --branch v1.0.0 …</code> или
        <code>git checkout v1.0.0</code> в существующем checkout'е):
      </p>
      <pre><code>git clone ${REPO_URL}
cd my-app && pnpm init
# добавьте checkout кита в свой pnpm-workspace.yaml:
#   packages:
#     - .
#     - ../tinkoff-ui-kit/packages/*
# соберите пакеты кита — exports указывают на ./dist:
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
# my-app — корень воркспейса, поэтому каждый add требует -w:
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace</code></pre>
      <p>
        Компоненты — Lit custom elements (<code>tk-*</code>); для React
        используйте сгенерированные обёртки из <code>pillkit-react</code>.
        Контракт API — пропсы, события, controlled/uncontrolled-режимы, слоты и
        грамматика темизации — описан в
        <a href="${CONVENTIONS_URL}" target="_blank" rel="noreferrer noopener"
          >CONVENTIONS.md</a
        >; таблицы API каждого компонента — на его странице (история «API»).
      </p>

      <h2>Быстрый старт: темизация</h2>
      <ol>
        <li>
          Подключите токеновый лист один раз на уровне
          <strong>документа</strong> — он каскадом спускается с
          <code>&lt;html&gt;</code>, а компоненты наследуют разрешённые custom
          properties в свои shadow root:
          <pre><code>import 'pillkit-tokens/tokens.css';</code></pre>
          Не внедряйте этот лист внутрь shadow root: светлый слой объявляет
          значения на <code>:host</code> — они перебьют унаследованные тёмные
          значения, когда документ переключён в тёмную тему (ловушка
          shadow-адопции).
        </li>
        <li>
          Темы переключаются атрибутом на корне документа — без правок разметки,
          классов и inline-стилей внутри приложения:
          <pre><code>&lt;html data-theme="dark"&gt;</code></pre>
          Попробуйте контрол Theme в тулбаре Storybook. Как настраивать палитру
          точечно — в разделе
          <a href="?path=/story/theming-guide--switching" target="_top"
            >Theming Guide</a
          >.
        </li>
      </ol>

      <h2>Шрифты</h2>
      <p>
        Кит бандлит лицензированные переименованные шрифты как
        <strong>отдельно-лицензированные активы</strong>:
        <strong>DaytonaSans</strong> — переименованная Neue Haas Unica W1G
        (© Monotype Imaging Inc.), <strong>DaytonaPragma</strong> —
        переименованная Pragmatica (© ParaType, веса 400/500/700). Шрифты
        распространяются в пакете по договорам на использование и
        переименование, заключённым мейнтейнером с Monotype и ParaType:
        эти договоры лицензируют МЕЙНТЕЙНЕРА и НЕ передаются вместе с
        пакетом — права потребителя на файлы шрифтов определяет только
        <a href="${FONTS_LICENSE_URL}" target="_blank" rel="noreferrer noopener"
          >LICENSE-FONTS.md</a
        >. Шрифты <strong>не покрываются MIT-лицензией пакета</strong>; если
        требуемое использование в LICENSE-FONTS.md не описано — не
        распространяйте файлы дальше и свяжитесь с мейнтейнером.
        Подключаются одной строкой рядом с токенами:
      </p>
      <pre><code>import 'pillkit-tokens/tokens.css';
import 'pillkit-tokens/daytona.css';</code></pre>
      <p>
        Проприетарный TinkoffSans (заголовочный шрифт сайта) недоступен —
        DaytonaSans занимает его роль как ближайший лицензированный гротеск.
        Открытая альтернатива по умолчанию — <strong>Inter</strong>: если
        Daytona не подключена, слоты разрешаются в Inter. Свой бренд-шрифт
        ставьте ПЕРВЫМ в стеке — значение слота заменяется целиком, поэтому
        fallback повторяют в конце:
      </p>
      <pre><code>:root {
  --tk-font-heading: MyBrandGrotesk, Inter, sans-serif;
  --tk-font-body: MyBrandGrotesk, Inter, sans-serif;
}</code></pre>
      <p>
        Точные шрифты локально: если у вас есть лицензионные woff2, положите их
        в <code>packages/docs/src/local-fonts/</code> (папка gitignored — в
        публичный пакет ничего не попадает) по шаблону
        <code>local-fonts.example.css</code>. Бандлимые Daytona этот шаг не
        требуют.
      </p>

      <h2>Токены и темизация — справочники</h2>
      <p>
        Полная таблица токенов со значениями светлой и тёмной тем бок о бок — на
        странице
        <a href="?path=/story/token-reference--colors" target="_top"
          >Token Reference</a
        >
        (она сгенерирована из того же артефакта, что потребляют компоненты).
        Правила переопределения и парности в тёмной теме —
        <a href="?path=/story/theming-guide--overrides" target="_top"
          >Theming Guide</a
        >.
      </p>

      <h2>Поиск по компонентам</h2>
      <p>
        Девятнадцать компонентов кита — от кнопки до модального окна. Начните с
        поиска или откройте раздел Components в боковой панели.
      </p>
      <docs-component-search></docs-component-search>

      <h2>Состояния дока-сайта</h2>
      <p>
        Скелетон холодной загрузки повторяет макет этой страницы: заголовок,
        строки ввода, поле поиска и сетка карточек. Блоки статичны по образцу
        кита — скелетоны кита не анимируются, поэтому поведение безопасно при
        <code>prefers-reduced-motion</code> без отдельных правил.
      </p>
      <div class="tkgs-skeleton" role="img" aria-label="Скелетон страницы начала работы">
        <div class="tkgs-skeleton__block tkgs-skeleton__title"></div>
        <div class="tkgs-skeleton__block tkgs-skeleton__line tkgs-skeleton__line--90"></div>
        <div class="tkgs-skeleton__block tkgs-skeleton__line tkgs-skeleton__line--60"></div>
        <div class="tkgs-skeleton__block tkgs-skeleton__field"></div>
        <div class="tkgs-skeleton__grid">
          <div class="tkgs-skeleton__block tkgs-skeleton__card"></div>
          <div class="tkgs-skeleton__block tkgs-skeleton__card"></div>
          <div class="tkgs-skeleton__block tkgs-skeleton__card"></div>
        </div>
      </div>
      <p>
        Пустой результат поиска никогда не остаётся пустым местом:
      </p>
      <docs-component-search query="несуществующий"></docs-component-search>

      <p class="tkgs-status">
        Статус: все 19 компонентов прошли конвейер кита — Lit-ядро с
        CEM-манифестом, сгенерированные React-обёртки, истории с axe-проверками
        в обеих темах, визуальные baselines и свипы доступности (клавиатура,
        контраст, скринридер-протоколы). Распространение — только этот
        репозиторий; релизы отмечаются git-тегами, первый — v1.0.0.
      </p>
    </main>
  `,
};
