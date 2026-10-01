# v1.5.0 Flow-B fresh-consumer gate — NOTES (RELEASE.md §12.4)

Дата: 2026-10-01. Гейт релиза v1.5.0: свежий клон по тегу → банковская
тройка → `tk-menu-popover` (raw + React-обёртка `MenuPopover`).

## 1. Окружение и отклонение от буквы (честно)

- Сетевой bulk-транспорт деградировал (~2 МБ/мин; замер по du за 60 с) —
  remote-клон по тегу не сошёлся за 10 минут бюджет. Откат на ЛОКАЛЬНЫЙ
  клон по тегу (прецедент §11.4): идентичность дерева гарантирует
  tag-объект — remote сверен ДО клона:
  `git ls-remote --tags` → `refs/tags/v1.5.0` = `b828a98c…`, deref `^{}` =
  `9e3c32b…`. Локальный клон: `git clone --branch v1.5.0 <repo>` → HEAD
  `9e3c32b`, `git describe --tags --exact-match` = `v1.5.0`, версии
  `pillkit-{components,react,tokens}` = 1.5.0, CHANGELOG `[1.5.0]`.
- pnpm-ловушки окна воспроизведены и обойдены: `pnpm init` пишет
  devEngines caret-спеку → блок удалён по ключу; регистные fetch
  (react/vite) висели на деградации → `--prefer-offline` из локального
  store (343–418 мс). pnpm потребителя = 11.20.0 (кит-клон ставился
  своим 12.5.1 —оба работают).

## 2. Раунд 1 — ГЕЙТ НАШЁЛ ДЕФЕКТ (продуктовый, на теговых битах)

Симптом: в React-композициях ряды меню приходили БЕЗ `role` —
`tk-menu-item.getAttribute('role')` = null (3/3 ряда, обеих меню),
`tk-menu-divider` без `role=separator`. Lit-сторибук кита (шаблоны
`html``) — роли на месте; дефект жил ТОЛЬКО на React-поверхности,
которую сюита кита браузерно не покрывала.

Изоляция (голый кастомный элемент + React 19.3, `/iso.html`): элемент,
чей конструктор отработал (ctorCount=1), — НЕ тот узел, что React
коммитит в DOM (renderedIsFirst=false). ЗАКОН: **React 19 при создании
кастомных элементов не доносит атрибуты, выставленные в конструкторе,
до закоммиченного узла.** Подтверждён и на dev-сервере, и в prod-билде.
Ровинг не пострадал (menu-popover сам синкает tabIndex), APG-семантика —
пострадала полностью.

Фикс (коммит `c7fe548`, Epic 19 follow-up): роли + roving-дефолт
переезжают из конструктора в `connectedCallback` (идемпотентно;
перемещение рядов в панель — это detach→reattach, закон покрыт
юнит-пинами «re-asserts on every (re)connect»). Полный compare после
фикса: **2182/2182, exit 0** — атрибутный фикс пиксельно нейтрален.

## 3. Раунд 2 — ГЕЙТ ПРОЙДЕН (23/23 ног, на `c7fe548`)

Клон переведён на fix-коммит (`git fetch <repo> main` + checkout,
`c7fe548`), пересборка, тот же потребитель. `probe.mjs` — 23/23 PASS:

- Рендер: якоря 44×44 оба; старт закрыт; панель role=menu +
  aria-label «Действия с платежом».
- **React-19-регрессия закрыта: 3× role=menuitem + role=separator**
  (raw и React-меню оба).
- Геометрия: правое ребро панели ВПРИТЫК к триггеру (alignment end,
  Δright = 0.00px), зазор 4.00px (MENU_OFFSET_PX), ширина 280px.
- Клавиатура: ArrowDown → реальный фокус в первом ряду (внутри
  shadow-панели — document.activeElement ретаргетится на host, фокус
  читается через shadowRoot.activeElement), второй ряд, End → последний;
  Enter → select «Отменить платёж», фокус на триггер; Esc → закрыто,
  фокус на триггере.
- События: raw — `select`/`open-change` с `detail.value` (DOM-listener);
  React — обёртка доставляет РАЗВЁРНУТЫЙ `detail.value` (замороженный
  контракт CONVENTIONS §3): `onSelect` получил элемент ряда,
  `onOpenChange` — boolean true→false.
- Темы: `<html data-theme="dark">` → панель rgb(26, 26, 26).
- Консоль: 0 ошибок (предупреждение `class`→`className` — ошибка
  НАШЕГО consumer-кода в раунде 1, исправлена в main.tsx потребителя).

Скриншоты: `v150-flowb-light-open.png`, `v150-flowb-dark-open.png`.

## 4. Ценсус и прод-сверка

- `node_modules` потребителя: РОВНО `pillkit-{tokens,components,react}`
  @1.5.0 (ТЖ-пакеты не ставятся — банковский флоу их не требует).
- Prod-билд: 36 модулей, CSS 5.64 kB (токеновый лист), роли в проде
  подтверждены (`itemRole=menuitem`, `dividerRole=separator`).

## 5. Статус релиза — РЕШЕНИЕ ИСПОЛНЕНО

Тег стоял на `9e3c32b` (ДО фикса); раунд-1 (§2) работал против него.
Решение мейнтейнера (AskUserQuestion, окно 19.2-close): **«Перенести на
c7fe548»** — тег v1.5.0 ПЕРЕМЕЩЁН на fix-голову `c7fe548` механизмом §7
(`git tag -f -a` + `git push -f origin v1.5.0`; потребителей у часового
тега нет). Итог: tag-объект `df4c3c8`, deref `c7fe548`, remote сверен
force-update'ом (`b828a98...df4c3c8`); CI на `c7fe548` = run 36820396725
success; раунд-2 (§3) прогнан именно против этих битов. Штампы —
RELEASE.md §12.3/§12.4/§12.7; CHANGELOG [1.5.0] Fixed/Internal несут
запись о переносе.
