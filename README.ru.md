# tinkoff-ui-kit / pillkit

**Веб-компоненты банковского класса для любого стека.**

[![CI](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Lit](https://img.shields.io/badge/Lit-3.3.3-blue)](https://lit.dev)
[![Storybook](https://img.shields.io/badge/Storybook-10.6-blueviolet)](https://salacoste.github.io/tinkoff-ui-kit/storybook/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://salacoste.github.io/tinkoff-ui-kit/ru/)

Читать на английском: [`README.md`](README.md)

**pillkit** — UI kit на основе воссозданной дизайн-системы: 46 банковских
компонентов `tk-*` (Lit custom elements + генерируемые React-обёртки),
двухслойная система дизайн-токенов (светлая база + тёмные семантические
переопределения), общий overlay-контроллер, плюс редакционное семейство
Т-Журнала — 10 компонентов `tj-*` со своими токенами `--tj-*` и нулевыми
перекрёстными зависимостями с банком. Всего 56 компонентов и 51 генерируемая
React-обёртка; строгий TypeScript; два шрифтовых носителя отдельно-лицензированных
начертаний (Daytona для банка, XCharter для ТЖ). Документация на Storybook и
верификационный контур на 2755 прогонов: визуальная регрессия, axe в обеих
темах, контраст, клавиатура, reduced-motion.

**[Открыть живую витрину](https://salacoste.github.io/tinkoff-ui-kit/ru/)**
· **[Документация компонентов](https://salacoste.github.io/tinkoff-ui-kit/storybook/)**
· **[Быстрый старт](#быстрый-старт)**

## Почему pillkit

- **Стандартные веб-компоненты — любой стек.** Каждый компонент — Lit 3.3.3
  custom element: одни и те же теги `tk-*` и `tj-*` работают в React, Vue,
  Svelte, Angular, чистом HTML и на статической странице без сборки; ни
  привязки к фреймворку, ни портирования.
- **Двухслойная темизация с настоящей тёмной темой.** Светлая база custom
  properties `--tk-*` + семантические переопределения на
  `[data-theme="dark"]`: тёмная тема — один атрибут на `<html>`, без правок
  разметки и точечных стилевых заплат.
- **Доступность сначала.** AA-контраст ведётся реестром и проверяется
  тестами, axe гоняется по каждому компоненту в обеих темах, семантика для
  скринридеров, клавиатура и reduced-motion учтены по умолчанию — а не
  добавлены потом.
- **Генерируемые React-обёртки.** 51 типизированная обёртка генерируется из
  Custom Elements Manifest (`@lit/react`) — React API (пропсы, события,
  слоты) не может разъехаться с элементами под ними.
- **Единый overlay-контроллер.** Диалоги, тосты и поповеры делят один
  overlay-контроллер: один порядок слоёв и одна история фокуса вместо войны
  z-index по компонентам.
- **2755 прогонов регрессии на каждое изменение.** Автоматическая визуальная
  регрессия против закоммиченных кроссплатформенных baseline плюс axe в обеих
  темах; CI гоняет lint → typecheck → build → test → визуальную сюиту на
  каждый push и PR.
- **Редакционный под-кит с нулевыми зависимостями.** Семейство Т-Журнала
  несёт собственные токены и шрифтовую модель и не импортирует ничего из
  банковских пакетов — его можно ставить отдельно.

## Один кит — четыре продуктовых языка

| Семейство | Что это | Живая витрина |
|---|---|---|
| **Банк** | Ядро: 46 компонентов `tk-*` — кнопки, поля, карточки, карусель, тост, спиннер — на двухслойной токенной системе | [ru/bank.html](https://salacoste.github.io/tinkoff-ui-kit/ru/bank.html) |
| **Инвест** | Инвест-поверхности, собранные из компонентов и токенов банковского семейства | [ru/invest.html](https://salacoste.github.io/tinkoff-ui-kit/ru/invest.html) |
| **Админ** | Админ-консоли и внутренние инструменты: плотные дата-поверхности, включая паттерны авторизованных зон | [ru/admin.html](https://salacoste.github.io/tinkoff-ui-kit/ru/admin.html) |
| **Т-Журнал** | Редакционный под-кит: 10 компонентов `tj-*`, собственные токены `--tj-*`, серифный читальный шрифт, нулевые импорты из банковских пакетов | [ru/tj.html](https://salacoste.github.io/tinkoff-ui-kit/ru/tj.html) |

Английские версии витрин живут рядом без префикса — например,
[`.../bank.html`](https://salacoste.github.io/tinkoff-ui-kit/bank.html);
английский лендинг — [`.../`](https://salacoste.github.io/tinkoff-ui-kit/).

## Работает с вашим стеком

- **React 18 / 19** — первый класс: генерируемые типизированные обёртки
  `pillkit-react` и `pillkit-tj-react`, пропсы, события и слоты отображены
  по-реактовски (быстрый старт ниже рендерит кнопку обоими способами на
  одной странице).
- **Vue, Svelte, Angular** — custom elements нативно поддерживаются всеми
  тремя: зарегистрируйте модули один раз и используйте теги в шаблонах.
- **Ванильный JS и статика без сборки** — импортируйте модуль элемента и
  пишите тег; опубликованные витрины — обычные ESM-страницы без
  фреймворкового кода.
- **Любой CSS-сетап** — темизация это обычные CSS custom properties;
  токеновые слои комбинируются с утилитарными фреймворками, CSS-модулями и
  любой другой стилизацией.
- **SSR-оговорка** — веб-компоненты гидратируются на клиенте: серверного
  рендера shadow-деревьев кит не даёт, планируйте апгрейд тегов модулями в
  браузере.

## Где применять

Хорошо ложится:

- **Продуктовые финтех-поверхности** — клиентские порталы, платежи,
  онбординг-фаннели, дашборды.
- **Админ-консоли и внутренние инструменты** — плотные таблицы, формы и
  консольные паттерны, включая авторизованные зоны.
- **Редакция и медиа** — типографика лонгридов и обвязка статей из семейства
  Т-Журнала.
- **Маркетинговые лендинги** — токенная темизация и компоненты, работающие
  на статических страницах.

Подумайте дважды, если:

- нужны **нативно-мобильные виджеты** — кит вебовый; оборачивайте в WebView
  сами или берите платформенные киты;
- нужна **официальная дизайн-система Т-Банка с её брендовыми активами** —
  pillkit это неофициальное воссоздание, товарные знаки Т-Банка в публикуемый
  результат не входят (см. дисклеймер ниже).

## Быстрый старт

> Рецепт проверен дословно на свежем проекте вне репозитория (SM-6, Story 5.7 —
> транскрипт и скриншот в `.playwright-cli/verify/sm6-self-test/`; повторён
> релизным гейтом v1.1.0 с уточнением dedupe —
> `.playwright-cli/verify/v110-fresh-clone/`).

Требования: Node >= 20, pnpm (приходит через `packageManager` + corepack).

Кит распространяется **только через этот репозиторий GitHub**: это независимый
учебный проект, и отдельно-лицензированные шрифты в `pillkit-tokens` делают
дистрибуцию через реестр npm неудобной — публикации не будет, `private: true`
во всех пакетах остаётся постоянно (модель релиза — в `RELEASE.md`).
Каноническая установка — pnpm-линк воркспейса из checkout'а репозитория;
для воспроизводимости пинуйте релизный тег: `git clone --branch v1.9.0 …` или
`git checkout v1.9.0` в существующем checkout'е (тег = версия пакета, см.
«Семверинг и changelog»):

```bash
git clone https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app  # медленный реестр? добавьте --prefer-offline к pnpm install
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
```

Ловушка `pnpm init` (pnpm v12): он пишет блок `devEngines.packageManager`
с caret-спекой, которую следующий же `pnpm add` отвергает — до установки
пакетов кита удалите блок `devEngines` из `package.json` приложения (по
ключу, не текстовой правкой всего файла). Встречено релизными гейтами
v1.2.0–v1.5.0 (протокол — `.playwright-cli/verify/v140-fresh-clone/NOTES.md`).

Для vite — три строки dedupe (обязательно): воркспейс-линк даёт бандлеру
два физических экземпляра `react` (ваш и локальную копию из чекаута кита),
и без дедупликации React-обёртки падают с «Invalid hook call» (найдено
релизным гейтом v1.1.0 на актуальном патче vite 8.3; трасса и разбор —
`.playwright-cli/verify/v110-fresh-clone/NOTES.md`):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
```

`index.html` — кнопка и как custom element, и через React-обёртку:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
  </head>
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
разметки и inline-стилей. Обновление кита — `git fetch --tags && git checkout
vX.Y.Z` в checkout'е кита и пересборка (`pnpm install && pnpm build`).

## Пакеты

| Пакет | Роль |
|---|---|
| `pillkit-tokens` | Дизайн-токены — слои custom properties `--tk-*`: светлая база + тёмные переопределения на `[data-theme="dark"]` |
| `pillkit-components` | Ядро на Lit custom elements: 46 компонентов `tk-*`, общий overlay-контроллер |
| `pillkit-react` | React-обёртки, генерируемые из Custom Elements Manifest (`@lit/react`) |
| `pillkit-tj-tokens` | Токены под-кита ТЖ — `--tj-*` + нативная тёмная тема `[data-tj-theme="dark"]` |
| `pillkit-tj-components` | Ядро ТЖ на Lit custom elements: редакционные компоненты `tj-*` |
| `pillkit-tj-react` | React-обёртки ТЖ из CEM-манифеста `pillkit-tj-components` |
| `pillkit-tj-fonts` | Шрифтовой носитель ТЖ: XCharter ×4 woff2 под условиями Bitstream Charter + закомментированный рецепт Graphik; единственная точка дистрибуции шрифтовых байтов ТЖ — тройка `pillkit-tj-*` остаётся zero-fonts по тесту |
| `pillkit-docs` | Документация — Storybook 10 (RU); служебный пакет воркспейса, потреблять снаружи не нужно |
| `tests/` | Закоммиченные гарантии import-boundary + build-isolation для матрицы AD-4 (запускаются в `pnpm test`) |
| `transitions/` | Вендорные рецепты transitions.dev (сырые `t-*.css` + `_root.css`) — источник моушна; остаются в репозитории, лицензируются отдельно (см. «Лицензия») |

## Документация

Полная документация Storybook 10.6 опубликована на
[salacoste.github.io/tinkoff-ui-kit/storybook/](https://salacoste.github.io/tinkoff-ui-kit/storybook/)
— или запустите локально:

```bash
pnpm install && pnpm --filter pillkit-docs dev   # Storybook (RU) на :6006
```

Внутри: «Начало работы» (установка, темизация, шрифты), Token Reference
(светлая/тёмная тема бок о бок), Theming Guide, API-таблицы всех компонентов —
46 банковских `tk-*` и 10 редакционных `tj-*` (56 всего), заметки по
доступности и паттерны composition. Контракт API компонентов — пропсы, события,
controlled/uncontrolled-режимы, слоты и грамматика темизации — описан в
[`packages/components/CONVENTIONS.md`](packages/components/CONVENTIONS.md).

Больше нравится листать живую страницу? Откройте витрины семейств из таблицы
«Один кит — четыре продуктовых языка» выше или начните с
[лендинга](https://salacoste.github.io/tinkoff-ui-kit/ru/).

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

У редакционного семейства ТЖ — собственная шрифтовая модель («сплит»):
читальный сериф **дистрибутируется сам** — пакет `pillkit-tj-fonts` несёт
**XCharter** ×4 начертания (woff2, свободные условия лицензии Bitstream
Charter: use/copy/modify/sublicense/sell/redistribute с сохранением
уведомления; XCharter — Charter-идиома с кириллицей, оригинальный Bitstream
Charter латинский). Слот `--tj-font-reading` ведёт XCharter, поэтому достаточно
одного импорта `import 'pillkit-tj-fonts/fonts.css'` рядом с
`pillkit-tj-tokens/tokens.css`. Гротеск **Graphik** в пакетах кита отсутствует
и не появится: стандартная EULA Commercial Type прав на перераспределение
файлов не даёт — держатели лицензии используют закомментированный
`@font-face`-рецепт в [`packages/tj-fonts/fonts.css`](packages/tj-fonts/fonts.css);
без него слот разрешается в Inter. Условия — в
[`packages/tj-fonts/LICENSE-FONTS.md`](packages/tj-fonts/LICENSE-FONTS.md);
кодовая тройка `pillkit-tj-*` остаётся zero-fonts по тесту.

## Семверинг и changelog

Версии — это **git-теги `v<X.Y.Z>` на `main`**; реестр не используется, тег и
есть релизный маркер (текущий — `v1.9.0`). Семантика обычная: ломающие
изменения — только в мажорах; миноры добавляют компоненты/токены/фичи, патчи —
фиксы. Депрекации объявляются в миноре через [`CHANGELOG.md`](CHANGELOG.md) и
`@deprecated`-маркеры, удаление — не раньше следующего мажора. История
релизов — в [`CHANGELOG.md`](CHANGELOG.md).

## Лицензия

Код и документация репозитория — [MIT](LICENSE) (© 2026 salacoste), кроме трёх
категорий файлов, лицензируемых отдельно и явно исключённых из MIT:
банковые бандлимые шрифты (`packages/tokens/fonts/` — условия в
[`LICENSE-FONTS.md`](packages/tokens/fonts/LICENSE-FONTS.md); пакет
`pillkit-tokens` — смешанная лицензия, `SEE LICENSE IN LICENSE`), ТЖ-шрифты
(`packages/tj-fonts/fonts/` — XCharter под условиями Bitstream Charter,
вербатим-грант и атрибуция в
[`LICENSE-FONTS.md`](packages/tj-fonts/LICENSE-FONTS.md); пакет
`pillkit-tj-fonts` — смешанная лицензия) и вендорные
рецепты transitions.dev (`transitions/` — условия upstream, распространяются
только в составе репозитория). Полная область действия — в [LICENSE](LICENSE).

## Разработка

```bash
pnpm install && pnpm build && pnpm test   # зелёный baseline
pnpm lint                                 # typescript-eslint + AD-4 import boundaries
pnpm typecheck                            # TS 7 по корневым поверхностям (tests/, конфиги)
# Матрица AD-4 задана в ad4-matrix.mjs (единый источник для eslint, теста
# границ импорта и этой строки): allowed directions:
# components→tokens, react→components, tj-components→tj-tokens, tj-react→tj-components, docs→{react, components, tokens, tj-react, tj-components, tj-tokens, tj-fonts}
pnpm test:visual                          # визуальная регрессия + axe в обеих темах
```

CI проверяет каждый push/PR полной цепочкой: `lint` → `typecheck` → `build` →
`test` (unit + gen/tokens drift + zero-hardcoded + import boundaries + preview +
contrast) → `test:visual` (режим сравнения с закоммиченными кроссплатформенными
baseline, axe в обеих темах) → impeccable design-детектор по изменённым UI-файлам;
визуальные диффы при падении выгружаются как артефакты.

pnpm 12.5.1 приходит через поле `packageManager` + corepack — машине с локальным
pnpm 11.x ручной апгрейд не нужен. `pnpm-lock.yaml` намеренно является
двухдокументным YAML-потоком, записанным pnpm 12; не «чищайте» его до одного
документа.

### Инструменты

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

Workflows и команды — в `CLAUDE.md`.

---

**Готовы посмотреть ближе?**
[Открыть живую витрину](https://salacoste.github.io/tinkoff-ui-kit/ru/) ·
[Документация компонентов](https://salacoste.github.io/tinkoff-ui-kit/storybook/) ·
[Быстрый старт](#быстрый-старт) ·
[Репозиторий на GitHub](https://github.com/salacoste/tinkoff-ui-kit)

> **Неофициальный учебный проект.** pillkit (tinkoff-ui-kit) — независимое воссоздание
> дизайн-языка Тинькофф (Т-Банка) исключительно в учебных целях. Проект не аффилирован
> с Т-Банком / ТКС Холдинг, не одобрен ими и никак с ними не связан; товарные знаки
> Т-Банка в публикуемом результате не используются, а сайт-референс служит только
> источником дизайн-эталона.
