# Expected-surfaces манифест — окно v1.9.0 (batch-confirm)

ЧТО должно быть на каждом базлайн-кадре окна v1.9.0 (16 PNG, диапазон
56af588..8791dd3). Источники: спеки 27.1/27.2/27.4
(`_bmad-output/implementation-artifacts/`), исходники сторий
(`packages/components/src/spinner|carousel|toast/*.stories.ts`,
`packages/docs/src/getting-started.stories.ts`, `component-search.ts`),
генератор API-страниц `packages/components/src/api-reference.ts`, CEM
`packages/components/custom-elements.json`, CHANGELOG `[1.9.0]`, токен-лист
`packages/tokens/src/tokens.css`, конфиг харнесса `playwright.config.ts` +
`tests/visual/visual.spec.ts` + `packages/docs/.storybook/preview.ts`.
Ожидания выписаны из спек/кода, а не из картинок — vision-QA сверяет кадры
против этого списка.

Именование PNG: `tests/visual/visual.spec.ts-snapshots/visual-<id>-<light|dark>-1-chromium.png`.
Состав окна подтверждён git-диффом (16 файлов, 0 insertions):
G1 = 10 новых spinner (коммит 11e33f2), G2 = 2 реминта getting-started
(52d2393), G3 = 4 реминта carousel/toast api (90157b1).

---

## Инварианты кадра харнесса (все 3 группы)

1. **Кадр = preview-canvas стори, БЕЗ Storybook-менеджера.** Харнесс грузит
   `iframe.html?id=…` и снимает `page.locator('body')` — левой
   навигации/тулбара Storybook в кадре НЕТ (tests/visual/visual.spec.ts:15-17,
   49-51). Не считать их отсутствие дефектом.
2. **Габариты**: viewport 1280×800, DSF 1 (playwright.config.ts:56-57), кадр
   full-height (высокие канвы сшиваются; visual.spec.ts:46-47).
3. **Дисклеймер-баннер сверху кадра — на G1 и G3**: sticky-полоса
   `.tk-docs-disclaimer` «Неофициальный учебный проект. pillkit — независимое
   воссоздание дизайна Т-Банка (экс-Тинькофф)…», тематированная токенами
   (preview.ts:126-139). **ИСКЛЮЧЕНИЕ — G2**: на `getting-started--page`
   баннер подавлен по story-id (preview.ts:119-124), дисклеймер отрисован
   ИНЛАЙН-боксом внутри страницы (getting-started.stories.ts:179-184).
4. **Тема отличима фоном канвы**: стори красят канву в
   `--tk-color-surface-base` — light **#FFFFFF** (tokens.css:43), dark
   **#1A1A1A** (tokens.css:259). Текст primary #333333 / #FFFFFF, secondary
   #616871 / #FFFFFFB3 (tokens.css:48,50,265-266). Пара light/dark одного id
   обязана отличаться именно фоном. Харнесс ассертит data-theme=dark перед
   снимком (visual.spec.ts:171-173).
5. **Моушен выключен на capture**: `reducedMotion: 'reduce'`
   (playwright.config.ts:58) + `animations: 'disabled'` (:71) — НИКАКОЙ
   анимации в кадрах; для G1 это контракт: дуга спиннера СТАТИЧНА во всех
   10 PNG (см. css-комментарий spinner.css.ts:76-80 — «the arc is a
   deterministic frame, never a caught mid-turn angle»).
6. **Шрифты запинены** (tests/visual/inject.ts): body/heading — DaytonaSans
   (локальный), mono — JetBrains Mono; все `<code>`/`<pre>` моноширинны и
   кросс-платформенно одинаковы.
7. **Контент — русский**; исключение — API-стори: описания в таблицах
   вербатим-английские (jsdoc → CEM, единый источник; api-reference.ts:18-21),
   страница-хром русский.
8. **Порог compare 0.015**; ни для одной из 16 ног окна нет CI-толерантности
   (список CI_VISUAL_TOLERANCE, visual.spec.ts:141-149, этих id не содержит) —
   локальный compare строгий. Попутно на каждую ногу идёт axe-лег
   (visual.spec.ts:187-203), сюита 2755 (spec-27-4 status).

Справочные цвета (light → dark): border-default #E7E8EA → #FFFFFF24;
surface-muted #F5F5F6 → #222222; blue-100 **#1771E6 — theme-invariant**
(объявлен один раз в light :root, тёмный слой его НЕ переопределяет;
tokens.css:33); yellow-100 #FFDD2D — theme-invariant.

---

## G1 — Spinner, 10 PNG (commit 11e33f2, spec 27.1)

Сторисы живут КОЛОЦИРОВАННО с компонентом:
`packages/components/src/spinner/spinner.stories.ts` (коррекция R1).

**Атом (геометрия из кода, spinner.ts:128-148 / spinner.css.ts:43-92):**
SVG-дуга в три четверти окружности (зазор 25%, `pathLength 100`,
dash `75 25`), stroke **2px** cap round; r = (size − 4)/2 → для ряда
16/20/24/32 радиусы **6/8/10/14**, viewBox = size×size; короб inline-flex
`var(--tk-spinner-size, 20px)`. Цвет =
`var(--tk-spinner-color, currentColor)` — на канвах сторий наследует
text-primary (#333333 / #FFFFFF). Дуга СТАТИЧНА (инвариант 5). Кламп
невалидного size → '20' (spinner.ts:66-71, 92-97); role=status /
aria-hidden на пикселях НЕ видны (семантика — юниты/axe).

Общий хром всех 5 сторий: `layout: fullscreen`, канва `.tksp-canvas`
(surface-base, паддинги 32/24, max-width container), h1 + серый
intro-ноут, RU-проза. Баннер сверху (инвариант 3).

- **playground «Загрузка данных»** (id `components-spinner--playground`,
  :177-204): h1 «Spinner», интро-ноут (дуга ¾, штрих 2px, оборот 0.9s,
  currentColor, «определённая загрузка — контракт tk-progress-bar»,
  role=status / label=''), h2 «Обновление котировки», карточка с рамкой
  border-default radius-lg: спиннер 20 (label «Обновляем курс») + жирное
  **«SBER — 318,40 ₽»** + серое «Обновляем данные последней сделки…».
  Демо-контент вымышленный (PD-гейт, заголовок файла :15-19).
- **sizes «Размерный ряд»** (:206-252): **ШЕСТЬ figure** (не четыре —
  коррекция R2): 16 / 20 / 24 / 32 с figcaption «16 — строка метаданных»,
  «20 — дефолт, кнопки и строки», «24 — карточки», «32 — пустые
  состояния»; 5-я — «24 в цветном контексте»: текст и дуга
  **blue-100 #1771E6 в ОБЕИХ темах** (spinner.stories.ts:153-155);
  6-я — демо хуков: `--tk-spinner-duration: 1.8s; --tk-spinner-stroke: 3px`
  — штрих ЗРИМО толще (3px), замедление на статичной дуге не видно.
- **in-button «В кнопке при ожидании»** (:261-296): h2 «Перевод по
  реквизитам» — две пилюли-кнопки потребителя (radius-full, surface-muted):
  занятая (aria-busy): спиннер 16 декоративный (label='') + серый текст
  «Проводим платёж…»; рядом обычная «Отправить ещё раз». H2 «Регистр
  tk-button» — `<tk-button loading>Подписать платёж</tk-button>`:
  ЖЁЛТАЯ primary-кнопка, подпись невидима (opacity 0, ширина заморожена),
  в центре СТАТИЧНОЕ двухтоновое кольцо (бордер-спиннер tk-button —
  ДРУГАЯ конструкция, не SVG-дуга; button.css.ts:237-292) + secondary
  «Отмена» (контурная). Футер-ноут «Суммы и названия — демо-контент,
  вымышленный.»
- **accessibility «Доступность»** (:298-354): интро (role=status,
  connectedCallback/закон React 19, дуга aria-hidden, reduce-motion),
  h2 «Чек-лист», таблица 2 колонки × 5 строк: Именованный инстанс /
  Декоративный (label='') / Уменьшенная анимация / Определённый прогресс /
  Клавиатура; ниже 2 figure — именованный 24 и декоративный 24:
  **дуги пиксельно ОДИНАКОВЫ** (разница только в aria — молд v180-заметки
  про повторы avatar).
- **api «API»** (:356-359): шаблон apiReferenceDoc('tk-spinner') —
  h1 «API — tk-spinner», таблица «Атрибуты и свойства» **2 строки**:
  `size` тип `'16' | '20' | '24' | '32'`, default `'20'`;
  `label` тип `string`, default `Загрузка`. Секция «События» —
  плейсхолдер **«Кастомных событий нет — см. описание компонента.»**
  (CEM events пуст — stateless); «Слоты» — плейсхолдер «Слотов нет —
  контент задаётся атрибутами и свойствами.»; «Каналы темизации» — проза
  про `--tk-spinner-<slot>`; футер-каллаут CONVENTIONS.md.

Light/dark: дуга инвертируется с тёмной на белую (currentColor); жёлтая
tk-button и blue-100-фигура неизменны; канва/текст по инварианту 4.

## G2 — Getting started, 2 реминта PNG (commit 52d2393, spec 27.2)

`getting-started--page` «Начало работы» — канва `.tkgs` (surface-base),
**баннера НЕТ — инлайн-бокс дисклеймера** (инвариант 3, коррекция R3):
bluegray-плашка со strong «Неофициальный учебный проект.»
(getting-started.stories.ts:179-184).

Ожидаемые изменения против v1.8.0-кадра (всё — строки рендера):

1. **Пин тега v1.9.0** — в прозе раздела «Установка», ДО первого pre-блока:
   «…пинуйте релизный тег (`git clone --branch v1.9.0 …` или
   `git checkout v1.9.0`…)» — inline-code чипы
   (getting-started.stories.ts:194-196). В самом pre-блоке тега НЕТ
   (там plain `git clone …repo`; :198-207) — коррекция R4 к формулировке
   молда v180.
2. **Счётчик секции поиска** (:311-315): «**Сорок шесть** компонентов
   банка — от кнопки до терминального тикета.» (было «Девятнадцать
   компонентов кита — от кнопки до модального окна.»).
3. **Ростер поиска** (:316): сетка карточек `docs-component-search`;
   добавлена строка **Spinner** — карточка «Спиннер» + моно-чип
   `tk-spinner`, между «Скелетон» и «Переключатель»
   (component-search.ts:107-113). ВАЖНО для vision-QA: в сетке **65
   карточек** (37 Components/ + 12 v2-страниц + 16 ТЖ), а НЕ 56 — счётчик
   «56» считает элементы (46 банк + 10 ТЖ), не страницы (коррекция R5).
4. **Финальный статус-каллаут** (:341-348): «Статус: все **56 компонентов
   (46 банк + 10 ТЖ)** прошли конвейер кита — …» (было «все 27
   компонентов (19 v1 + 8 v2)»).

Непересчитанные старые числа («Девятнадцать», «27 (19 v1 + 8 v2)») на
кадре отсутствуют. Остальное без дельты: pre-блоки установки/vite-dedupe,
темизация, «Шрифты», скелетон-демо (статичные серые блоки), второй поиск
с пустым состоянием «Ничего не найдено. Попробуйте название компонента.»
(:339). Дельта высоты +76px в ОБЕИХ темах (4329→4405px; spec-27-2
execution log) — равные габариты тем = детерминированный рефлоу, не дефект.

## G3 — API-стори carousel/toast, 4 реминта PNG (commit 90157b1, spec 27.4)

Оба кадра — стандартный шаблон api-reference (h1 «API — <tag>», баннер
сверху). КЛЮЧЕВАЯ дельта окна: ДО окна у обоих тегов CEM `events: []`
(проверено по 56af588) — секция «События» была плейсхолдером «Кастомных
событий нет…». После — **настоящая таблица из ОДНОЙ строки**:

- **carousel--api**: атрибуты `label` (string, default `''`, «REQUIRED
  accessible name…») и `dots` (boolean, default `false`, про декоративные
  некликабельные точки). «События» — строка: `page-change` | `CustomEvent`
  | англ. вербатим «\`{ page: number }\` with the newly active 1-based
  snap page; composed, bubbles; silent on the first render and on
  intra-page scroll ticks.». «Слоты» — 1 строка «(по умолчанию)».
- **toast--api**: атрибуты `variant` (тип-идентификатор `TkToastVariant`,
  default `default`) и `duration` (number) — default в моно-чипе выглядит
  как ИДЕНТИФИКАТОР **`TK_TOAST_DEFAULT_DURATION_MS`** (CEM цитирует
  поле дословно) — это норма рендера, НЕ дефект (коррекция R6). «События» —
  строка: `hide` | `CustomEvent` | «\`{ reason: 'auto' | 'manual' }\` at
  the top of the single exit funnel (auto = the duration timer, manual =
  Esc/handle/collapse/consumer dismiss); composed, bubbles; emitted
  exactly once per toast.». «Слоты» — 2 строки: «(по умолчанию)» и
  `action`.

Событие `show` у toast отсутствует — P2-вердикт (spec 27.4 draft log):
его отсутствие в таблице корректно. Размеры PNG выросли (~+7 КБ каждый) —
в пользу прироста таблицей, высота страницы увеличилась.

---

## Таблица «CHANGELOG [1.9.0] → где видно»

| Строка [1.9.0] | Где видно (из 16 PNG) |
|---|---|
| tk-spinner: size-union 16/20/24/32 → `--tk-spinner-size` | `spinner--sizes` ×2 (ряд 16/20/24/32), `spinner--api` ×2 (union в таблице) |
| currentColor stroke, pathLength 100, dash 75/25, 0.9s | все 10 G1 (дуга цветом текста канвы); «0.9s» числом НЕ видно — дуга статична (reduce-motion capture) |
| hooks `--tk-spinner-{size,color,stroke,duration}` | `spinner--sizes` ×2 фигура 6 (штрих 3px зримо толще; duration на статичной дуге не виден); полный список хуков — только в api-прозе «Каналы темизации» |
| role=status из connectedCallback; `label=''` → aria-hidden | **не видно на базлайнах** (семантика; косвенно — чек-лист `spinner--accessibility`, включая строки «Именованный инстанс» / «Декоративный») |
| prefers-reduced-motion stop | видно как СТАТИЧНОСТЬ дуги на всех 10 (отсутствие смаза — отсутствие анимации и есть след) |
| carousel `page-change` `{page}` (1-based, единая точка, guard молчания) | `carousel--api` ×2 — новая таблица «События», 1 строка |
| toast `hide` `{reason}` (`#autoFired`, show REFUSED) | `toast--api` ×2 — новая таблица «События», 1 строка |
| funnel/guard/декоративность точек (механика) | **не видно на базлайнах** (поведение; юниты) |
| @fires → CEM, event-map, React onPageChange/onHide, pin-тесты | **не видно на базлайнах** (контрактный слой; CEM-след = те же api-таблицы выше) |
| docs freshness: счётчики 46/56, строка Spinner в ростере | `getting-started--page` ×2 (:313, :342, карточка «Спиннер») |
| Fixed: React-unwrap `CustomEvent` → `{page}`/`{reason}` | **не видно на базлайнах** (поведение обёрток; пруф — fresh-clone гейт `.playwright-cli/verify/v190-fresh-clone/`, не пиксели) |
| Internal: перенос тега 9d179c6 → 8791dd3 | **не видно на базлайнах** |

---

## Коррекции брифу

- **R1.** Сторисы spinner/carousel/toast лежат НЕ в `packages/docs/src/`, а
  колоцированы с компонентами: `packages/components/src/<comp>/<comp>.stories.ts`
  (в docs/src — только getting-started/theming/token-reference).
- **R2.** Стори sizes — ШЕСТЬ figure, а не 4: кроме ряда 16/20/24/32 там
  цветная currentColor-фигура (blue-100, theme-invariant #1771E6) и демо
  хуков (stroke 3px / duration 1.8s) (spinner.stories.ts:219-249).
- **R3.** «Баннер сверху ожидаем на docs-страницах» верен только для G1/G3;
  на getting-started баннер подавлен по story-id, дисклеймер — инлайн-бокс
  (preview.ts:119-124; getting-started.stories.ts:179-184).
- **R4.** Пин тега v1.9.0 рендерится в прозе раздела «Установка»
  (inline-code чипы, :194-196), а НЕ в первом pre-блоке (в pre — plain
  `git clone` без --branch). Формулировка молда v180 («в первом pre-блоке
  видны строки с тегом») к v190 НЕ применима.
- **R5.** «Ростер 55→56» смешивает счётчики: счётчик ЭЛЕМЕНТОВ в статусе
  55→56 (46 банк + 10 ТЖ), но видимая сетка ростера выросла 64→65 КАРТОЧЕК
  (37 Components/ + 12 v2 + 16 ТЖ страниц); ожидать в кадре 56 карточек —
  ошибка.
- **R6.** Дельта G3 точнее брифа: у carousel И toast до окна событий не
  было вовсе → секция «События» перевернулась из плейсхолдера-абзаца в
  таблицу с 1 строкой (не «добавилась строка к существующим»). Тип в
  колонке — `CustomEvent`; default `duration` у toast рендерится
  идентификатором `TK_TOAST_DEFAULT_DURATION_MS` — норма CEM-цитаты.
- **R7.** «Reduce-motion stop» брифа имеет видимую форму: все 10 PNG G1 —
  статичная дуга (reducedMotion:'reduce' + animations:'disabled'), и
  спиннер РЕГИСТРА tk-button в in-button — тоже статичное двухтоновое
  кольцо (border-конструкция, не SVG-дуга) — не путать две конструкции
  на одном кадре.
