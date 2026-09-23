# tinkoff-ui-kit / pillkit

[![CI](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml)

CI проверяет каждый push/PR полной цепочкой: `lint` → `typecheck` → `build` →
`test` (unit + gen/tokens drift + zero-hardcoded + import boundaries + preview +
contrast) → `test:visual` (режим сравнения с закоммиченными кроссплатформенными
baseline, axe в обеих темах) → impeccable design-детектор по изменённым UI-файлам;
визуальные диффы при падении выгружаются как артефакты.

**pillkit** — UI kit на основе воссозданной дизайн-системы: 19 компонентов
(Lit custom elements + React-обёртки), двухслойная система дизайн-токенов
(светлая база + тёмные семантические переопределения), общий overlay-контроллер,
документация на Storybook и верификационный контур (визуальная регрессия,
axe в обеих темах, контраст, клавиатура, reduced-motion).

> **Неофициальный учебный проект.** pillkit (tinkoff-ui-kit) — независимое воссоздание
> дизайн-языка Тинькофф (Т-Банка) исключительно в учебных целях. Проект не аффилирован
> с Т-Банком / ТКС Холдинг, не одобрен ими и никак с ними не связан; товарные знаки
> Т-Банка в публикуемом результате не используются, а сайт-референс служит только
> источником дизайн-эталона.

## Пакеты

| Пакет | Роль |
|---|---|
| `pillkit-tokens` | Дизайн-токены — слои custom properties `--tk-*`: светлая база + тёмные переопределения на `[data-theme="dark"]` |
| `pillkit-components` | Ядро на Lit custom elements: 19 компонентов `tk-*`, общий overlay-контроллер |
| `pillkit-react` | React-обёртки, генерируемые из Custom Elements Manifest (`@lit/react`) |
| `pillkit-docs` | Документация — Storybook 10 (RU); приватный пакет, не публикуется |
| `tests/` | Закоммиченные гарантии import-boundary + build-isolation для матрицы AD-4 (запускаются в `pnpm test`) |
| `transitions/` | Вендорные рецепты transitions.dev (сырые `t-*.css` + `_root.css`) — источник моушна; не публикуются, лицензируются отдельно (см. «Лицензия») |

## Быстрый старт

> Рецепт проверен дословно на свежем проекте вне репозитория (SM-6, Story 5.7 —
> транскрипт и скриншот в `.playwright-cli/verify/sm6-self-test/`).

Требования: Node >= 20, pnpm (приходит через `packageManager` + corepack).

Пакеты ещё не опубликованы в npm (`private: true` до первого релиза — план
релиза для мейнтейнера в `RELEASE.md`). Рабочий путь сегодня — pnpm-линк
воркспейса из checkout'а репозитория:

```bash
git clone https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
```

`index.html` — кнопка и как custom element, и через React-обёртку:

```html
<!doctype html>
<html lang="ru">
  <body>
    <tk-button variant="primary">Как элемент</tk-button>
    <div id="root"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

`main.ts`:

```ts
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'pillkit-react';

createRoot(document.getElementById('root')!).render(
  createElement(Button, { variant: 'secondary' }, 'Через React-обёртку'),
);
```

Запуск: `pnpm exec vite` → http://localhost:5173 — обе кнопки рендерятся
и стилизуются токенами кита. Токеновый лист подключается один раз на уровне
документа; тёмная тема — атрибутом `<html data-theme="dark">`, без правок
разметки и inline-стилей. После публикации в npm весь блок линка воркспейса
заменяется на `pnpm add pillkit-components pillkit-react pillkit-tokens`.

## Документация

```bash
pnpm install && pnpm --filter pillkit-docs dev   # Storybook (RU) на :6006
```

Внутри: «Начало работы» (установка, темизация, шрифты), Token Reference
(светлая/тёмная тема бок о бок), Theming Guide, API-таблицы всех 19 компонентов
и заметки по доступности. Контракт API компонентов — пропсы, события,
controlled/uncontrolled-режимы, слоты и грамматика темизации — описан в
[`packages/components/CONVENTIONS.md`](packages/components/CONVENTIONS.md).

## Шрифты

Кит бандлит лицензированные переименованные шрифты как **отдельно-лицензированные
активы**: **DaytonaSans** (переименованная Neue Haas Unica W1G, © Monotype
Imaging Inc.) и **DaytonaPragma** (переименованная Pragmatica, © ParaType, веса
400/500/700). Шрифты распространяются в пакете по договорам на использование
и переименование, заключённым мейнтейнером с Monotype и ParaType: эти договоры
лицензируют **мейнтейнера** и **не передаются вместе с пакетом** — права
потребителя на файлы шрифтов определяет только
[`LICENSE-FONTS.md`](packages/tokens/fonts/LICENSE-FONTS.md); шрифты **не
покрываются MIT-лицензией** (файлы — в `packages/tokens/fonts/`, подключаются
одним импортом `import 'pillkit-tokens/daytona.css'` рядом с `tokens.css`;
оригинальные уведомления об авторских правах сохранены внутри файлов шрифтов).
Если требуемое использование в LICENSE-FONTS.md не описано — не распространяйте
файлы дальше и свяжитесь с мейнтейнером. Если Daytona не подключена, шрифтовые
слоты разрешаются в открытый **Inter** (рекомендуемая альтернатива по
умолчанию); свой бренд-шрифт ставится первым в стеке слота.

## Семверинг и changelog

Семантическое версионирование: ломающие изменения — только в мажорах; миноры
добавляют компоненты/токены/фичи, патчи — фиксы. Депрекации объявляются в
миноре через [`CHANGELOG.md`](CHANGELOG.md) и `@deprecated`-маркеры, удаление —
не раньше следующего мажора. История релизов — в [`CHANGELOG.md`](CHANGELOG.md).

## Лицензия

Код и документация репозитория — [MIT](LICENSE) (© 2026 salacoste), кроме двух
категорий файлов, лицензируемых отдельно и явно исключённых из MIT:
бандлимые шрифты (`packages/tokens/fonts/` — условия в
[`LICENSE-FONTS.md`](packages/tokens/fonts/LICENSE-FONTS.md); пакет
`pillkit-tokens` — смешанная лицензия, `SEE LICENSE IN LICENSE`) и вендорные
рецепты transitions.dev (`transitions/` — условия upstream,
не публикуются в npm). Полная область действия — в [LICENSE](LICENSE).

## Разработка

```bash
pnpm install && pnpm build && pnpm test   # зелёный baseline
pnpm lint                                 # typescript-eslint + AD-4 import boundaries
pnpm typecheck                            # TS 7 по корневым поверхностям (tests/, конфиги)
pnpm test:visual                          # визуальная регрессия + axe в обеих темах
```

pnpm 12.5.1 arrives via the `packageManager` field + corepack — a machine with a local
pnpm 11.x needs no manual upgrade. `pnpm-lock.yaml` is intentionally a two-document
YAML stream written by pnpm 12; do not "clean" it into a single document.

### Инструменты

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

Workflows и команды — в `CLAUDE.md`.
