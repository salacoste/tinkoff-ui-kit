import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * Docs index / getting-started stub (spec 1.5). Skeleton content only —
 * component docs land from Story 1.7 (Button) onward. All styling consumes
 * var(--tk-*) tokens (FR-1); the unofficial disclaimer renders here — the
 * persistent banner is suppressed on this story by id (see .storybook/preview.ts).
 */

const REPO_URL = 'https://github.com/salacoste/tinkoff-ui-kit';
const CONVENTIONS_PATH = 'packages/components/CONVENTIONS.md';

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
    .tkgs .tkgs-status {
      margin: var(--tk-space-32) 0 0;
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-left: var(--tk-space-4) solid var(--tk-color-yellow-100);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs ol {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tkgs li {
      margin: 0 0 var(--tk-space-8);
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
        Пакеты ещё не опубликованы — <code>npm install pillkit-…</code>
        появится вместе с первым релизом (Story 5.7). До этого рабочий путь —
        pnpm-линк воркспейса из checkout'а этого репозитория:
      </p>
      <pre><code>git clone ${REPO_URL}
cd my-app && pnpm init
# добавьте checkout кита в свой pnpm-workspace.yaml:
#   packages:
#     - .
#     - ../tinkoff-ui-kit/packages/*
pnpm add pillkit-components pillkit-react pillkit-tokens --workspace</code></pre>
      <p>
        Линк закрепляет <code>workspace:*</code> — кит собирается и обновляется
        вместе с приложением. Компоненты — Lit custom elements
        (<code>tk-*</code>); React-обёртки генерируются из манифеста
        компонентов (см. <code>Button</code> из <code>pillkit-react</code>).
      </p>

      <h2>Темизация</h2>
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
          Попробуйте контрол Theme в тулбаре Storybook.
        </li>
        <li>
          Шрифты: кит бандлит лицензированные переименованные шрифты как
          отдельно-лицензированный актив (решение мейнтейнера, 2026-09-22) —
          <strong>DaytonaSans</strong> (переименованная Neue Haas Unica W1G,
          Monotype; уже в <code>packages/tokens/fonts/</code>) и
          DaytonaPragma (Pragmatica, ParaType; веса 400/500/700).
          Они не покрываются MIT-лицензией пакета — см.
          <code>packages/tokens/fonts/LICENSE-FONTS.md</code>. Подключите
          <code>pillkit-tokens/daytona.css</code> рядом с
          <code>tokens.css</code> — слоты уже ведут Daytona-семействами.
          Проприетарный TinkoffSans (заголовочный шрифт сайта) недоступен —
          DaytonaSans занимает его роль как ближайший лицензированный
          гротеск; открытый fallback — <strong>Inter</strong>. Переопределение
          слота заменяет значение целиком — повторно включите fallback-стек:
          <pre><code>:root {
  --tk-font-heading: Inter, sans-serif;
  --tk-font-body: Inter, sans-serif;
}</code></pre>
        </li>
      </ol>

      <p>
        <strong>Точные шрифты локально.</strong> Если у вас есть лицензионные
        woff2 — положите их в
        <code>packages/docs/src/local-fonts/</code> (папка gitignored: в
        публичный пакет ничего не попадает) по шаблону
        <code>local-fonts.example.css</code> — доки будут рендериться
        пиксельно близко к референсу на вашей машине. Шаблон поддерживает и
        канонические family-имена (авто-подхват), и приватные псевдонимы.
        Бандлимые DaytonaSans/DaytonaPragma этот шаг не требуют — они уже
        в ките. Подробности — в README той папки.
      </p>

      <h2>API компонентов</h2>
      <p>
        Каждый компонент следует контракту кита — пропсы, события,
        controlled/uncontrolled-режимы, слоты и грамматика темизации. См.
        <code>${CONVENTIONS_PATH}</code> в
        <a href="${REPO_URL}" target="_blank" rel="noreferrer noopener"
          >репозитории кита</a
        >.
      </p>

      <p class="tkgs-status">
        Статус пайплайна (Story 1.7): первый компонент — Button — уже доступен
        в разделе Components и прошёл весь конвейер: Lit-ядро, CEM-манифест,
        сгенерированная React-обёртка, истории с axe-проверками в обеих темах и
        (предварительный) визуальный baseline. Временное демо токенов-цветов из
        скелетной фазы удалено.
      </p>
    </main>
  `,
};
