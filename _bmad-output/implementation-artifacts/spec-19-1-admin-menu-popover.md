# Spec 19.1 — tk-menu-popover атом (admin follow-up: открытые состояния меню)

- **status:** EXECUTED 2026-09-30 (local gates green: 200/200 unit, lint, typecheck; filtered visual 36/36 + region 2/2 + sweep VII 3/3; FULL compare 2182/2182 GREEN)
- **baseline_commit:** `9bddd0b` (CI 36725989337 = success — база зелёная)
- **материал:** follow-up pack (f) `captures-v3/admin/` 2026-09-30 — 5 PNG,
  ПД-заливки проверены до укладки (probe-notes § 2026-09-30, redaction log);
  драфт `draft-admin-followup-menu-popover.md` закрыт этим решением.
- **решение ростера** (по материалу; вето мейнтейнера — до старта исполнения):
  НОВЫЙ атом `tk-menu-popover` в `packages/components`; avatar-menu /
  table-kebab / list-kebab / header-overflow — композиции-паттерны
  админ-доки, НЕ отдельные компоненты кита.

## Закрытые вопросы драфта (OQ → материал)

| OQ | Решение |
|---|---|
| 1. Ширина/позиционирование | панель у триггера, правым краем, зазор ≈4–6px; ширины 240–300px по консьюмеру; механика = overlay-контроллер AD-12 по select-молде — переиспользуем существующий `packages/components/src/overlays/` (controller/focus-trap/positioning подтверждены листингом), Popover API primary, idrefs в одном shadow-руте |
| 2. Семантика | пункты = КОМАНДЫ (kebab/overflow кадры) → APG menu: role=menu/menuitem, roving ArrowUp/Down, Home/End, Esc с возвратом фокуса на триггер |
| 3. Empty state | заземлён ТОЛЬКО компактный вариант (926×258); full-page не наблюдался → в стори НЕ входит, `tk-empty-state` остаётся ungrounded |
| 4. T-ID auth | backlog, не этот раунд (подтверждено 13.1) |
| 5. `--tk-menu-*` хуки | да: слой моно-дисциплины (панель/рамка/ховер-заливка/деструктив-текст) поверх существующих нейтралей; новые токены только там, где замер не ложится |

## AC (frozen)

1. **Атом.** `tk-menu-popover` (`packages/components/src/menu-popover/`):
   триггер через `slot="anchor"` (атом триггер НЕ рисует); декларативный
   канал `open` + событие `open-change` (CONVENTIONS §9, без
   imperative-исключений); пункты/группы — default slot +
   вспомогательные `tk-menu-item` / `tk-menu-divider`; опциональный
   `slot="header"` (статичный блок над списком — user-блок avatar-menu);
   деструктив-ряд — `variant="destructive"` (красный текст, без заливки).
2. **Поведение.** Вне-клик и Esc закрывают, фокус возвращается на триггер;
   roving tabindex; aria-expanded на триггере ставит атом.
3. **Токены.** При исполнении — таблица «capture → токен» в Implementation
   Notes: радиус r12–16, рамка 1px нейтраль, мягкая большая тень, строка
   h≈40 / px 12–16, лейбл 14–15, ховер нейтральной заливкой во всю ширину;
   слой `--tk-menu-*` в `pillkit-tokens`; жёлтый НЕ используется.
4. **Стори.** Админ-секция дока: паттерны avatar-menu (с header-слотом),
   table-kebab, header-overflow; состояния закрыто/открыто; контент RU;
   имена/суммы — ВЫМЫШЛЕННЫЕ (закон ПД: значения из капч не
   транскрибируются).
5. **Тесты.** Unit: open/close/Esc/вне-клик/клавиатура/aria; axe на открытом
   состоянии; import-boundaries + zero-hardcoded учёты (новых пакетов нет);
   visual-базлайны НОВЫЕ (первичный минт — закон 1.5% не конфликтует),
   полный compare зелёный (2123+N).
6. **Цикл.** Гейты EXIT 0 → pathspec-коммит → zero-in-flight → push →
   CI-вердикт по run id ПОСЛЕ факта → память + CLAUDE.md одним close-out
   штампом (практика 17.5).

## Risks / notes

- Overlay-механика: переиспользовать `overlays/` (select-молд), НЕ тянуть
  floating-ui — фактчек контроллера при старте исполнения.
- Мега-меню (13.2) остаётся отдельной поверхностью: full-width
  4-колоночный дропдаун ≠ якорный поповер — атом его НЕ заменяет.
- kebab-accounts (bonus) — та же матрица на flat-списке: в стори как вариант
  паттерна table-kebab, отдельного паттерна НЕ заводим.
- 19.1 открывает Epic 19 «admin follow-up».

## Implementation Notes (2026-09-30)

### AC-3: capture → токен

| Capture (замер по кадрам captures-v3/admin) | Токен / решение |
|---|---|
| Радиус панели r12–16 | `--tk-radius-md` через хук `--tk-menu-popover-radius` |
| Рамка: волосяная 1px нейтраль | `--tk-color-border-default` через хук `--tk-menu-popover-border` |
| Мягкая большая тень дропдауна | `--tk-shadow-dropdown` (слоем, без хука — AD-12) |
| Заливка панели: белая поверхность | `--tk-color-surface-base` через хук `--tk-menu-popover-fill` |
| Строка h≈40±2, px 12–16 | min-height 44px (см. рулирование 3), padding `--tk-space-4` `--tk-space-12` |
| Лейбл строки 14–15 | тело body-m (story-canvas на `--tk-text-body-m-*`) |
| Ховер: нейтральная заливка во всю ширину строки | `--tk-color-surface-muted` |
| Деструктив: красный текст без заливки | `--tk-color-error-on-field` (текст, fill нет) |
| Иконки/метаданные: вторичный текст | `--tk-color-text-secondary` |
| Зазор панель↔триггер ≈4–6px | `MENU_OFFSET_PX = 4` (позиционер, px — задокументированная слепая зона zero-hardcoded) |
| Ширины 240–300 по консьюмеру | хук `--tk-menu-popover-width`, дефолт 280px; кебаб-паттерн 240px |
| Скролл длинного списка (~7 строк) | `max-height: calc(var(--tk-space-48) * 7 + var(--tk-space-12))` |
| Разделитель групп во всю ширину | 1px, хук `--tk-menu-popover-divider` (дефолт border-default) |
| Жёлтый НЕ используется | панель — ноль жёлтого (см. рулирование 7 про плитку-триггер) |

### Руления исполнения

1. **Хуки `--tk-menu-popover-*`, не `--tk-menu-*`** (OQ-5 писал по префиксу
   семантики) — consumed-tokens выводит префикс из имени каталога
   (`src/menu-popover/`); грамматика хуков следовала механизму гаранта.
2. **`positioning.ts` расширен `alignment: 'start' | 'end'`** — правый край
   панели к правому краю якоря (режим кадров консоли). По прецеденту
   matchAnchorWidth: новая опция, не смена контракта; валидация значения
   броском; 6 новых тестов в overlays.test.ts покрывают геометрию/кламп/флип.
3. **Строка 44px поверх замера ≈40±2** — A11y floor механирован sweep-сканом
   и есть закон; замер учтён padding-токенами, высоту диктует пол.
4. **Без `aria-controls`** — панель сгенерированный ребёнок shadow-дерева:
   id-ссылка из светлого DOM не разрешится (прецедент tk-select/axe).
   Триггер несёт `aria-haspopup="menu"` + `aria-expanded`.
5. **Молчание `open-change` при первом рендере** — флаг `#hasRenderedOnce`
   в `updated()` БЕЗУСЛОВНО (семантика old-value у Lit при апгрейде
   атрибутов может дать null → ложное срабатывание); событие после
   mount/position, composed+bubbles.
6. **Anchor-wiring: host-делегирование + pull-resolve** (молд tk-tooltip):
   happy-dom НЕ стреляет slotchange при ПЕРВИЧНОЙ раскладке слота — биндинг
   якоря никогда не кэшируется; клики/клавиши слушаются на host
   (composed-события якоря пересекают границу), `#pathHitsAnchor` по
   composedPath. Попутный факт: второй `slot="anchor"` НЕ замещает первый
   (проектируются оба, [0] выигрывает) — реальная замена = remove+append.
7. **Плитка-аватар = identity-пара кнопки primary** (yellow-100 fill +
   text-on-primary): плитка — ХРОМ ТРИГГЕРА, рулирование «ноль жёлтого»
   покрывает только панель.
8. **Drift-защита открытой панели — регион-спека** (select-молд): body-capture
   визуального сьюта исключает top-layer пиксели, поэтому открытая панель
   закреплена page-level клипом в `tests/visual/menu-popover.spec.ts` c
   геометрией-ассертами (fixed, z-токен dropdown, ниже якоря, flush правые
   края ≤1px, ширина ≥270). Фигура Open-стори стоит у ПРАВОГО края канвы —
   у левого края 280px панель корректно клампится к viewport и прячет
   контракт flush-выравнивания (кламп-поведение подтверждено, ассерту нужно
   место — зафиксировано в JSDoc стори).
9. **axe `button-name` на кебаб-триггере** — иконочная кнопка без имени:
   обе `.tkmp-iconbtn` несут `aria-label="Действия с платежом"` (= `label`
   меню); атрибут не меняет пиксели, базлайны валидны.
10. **Sweep-строка VII** (measured 2026-09-30): playground-walk = 1 kit-стоп
    (якорь; закрытое меню), deep-scan по Open-стори = ≥5 поверхностей
    (якорь + 4 строки; разделитель интеракции не несёт).

### Артефакты

- Атом + вспомогательные: `packages/components/src/menu-popover/`
  (`menu-popover.ts` ~530 строк, `menu-item.ts`, `menu-divider.ts`,
  `menu-popover.css.ts` — 4 листа, barrel `index.ts`).
- Стори: 9 (песочница с логом событий, открытое меню, варианты, 3 паттерна,
  темизация, доступность, API); component-search добавлен.
- Unit: 29 тестов атома + 2 describe вспомогательных (200/200 по пакету).
- Генерат: CEM 35 упоминаний семейства; 3 React-обёртки + event-map
  (`open-change`/`select`).
- Гаранты: hidden-guard 33→37 (28 файлов; menu-popover даёт 4 листа —
  список дедуплирован через Set), index.test re-export пин.
- Базлайны: 18 body (9 стори × 2 темы) + 2 регион; Open-стори переминчена
  после переноса вправо (старые PNG удалены явно).
- Проверки: `pnpm test` 200/200 · lint · typecheck · docs build ·
  отфильтрованный visual 36/36 + region 2/2 (mint + compare) ·
  sweep VII 3/3 · FULL compare **2182/2182 GREEN** (двухпроходный: после
  переноса Open-стори и переминта getting-started). Попутный легитимный
  дрейф: getting-started--page вырос на ряд индекса («Меню-поповер /
  tk-menu-popover», 3916→3937px) — базлайны переминчены явно (rm → update).
