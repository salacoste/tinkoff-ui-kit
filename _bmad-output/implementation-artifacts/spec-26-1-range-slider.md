# Spec 26.1 — tk-range-slider: интерактивный ползунок

- **status:** EXECUTED 2026-10-05 (code head `3f92922`, CI GREEN run 37283157635)
- **baseline_commit:** 3e27649
- **epic note:** Epic 26, brief `brief-epic-26-form-control-wave-2026-10-05.md`
  (аудит-вердикт «в волну»: gap-6-forms.md ранг #1).

## Story

As a kit consumer, I want a range slider atom (track + thumb, keyboard
+ a11y contract) matching the Т-Банк calculator pattern,
So that amount/style pickers stop being custom one-offs.

## AC

1. **Контракт.** `min`/`max`/`step`/`value` (кламп к сетке step),
   `disabled`; событие `value-change` (detail.value, §9 — молчит на
   первом рендере, teardown тихий). Value-formatter — слот/property для
   отображения (например «до 52 000 ₽» — ВЫМЫШЛЕННЫЕ числа в стори).
2. **Клавиатура/a11y.** role=slider + aria-valuemin/max/now/valuetext
   (valuetext = форматированное), tabindex=0 (или -1 при disabled),
   ArrowLeft/Right/Up/Down ±step, Home/End к краям, PageUp/Down ±10
   step; focus-visible кольцо токеном. Гейт — атрибутные локаторы
   (урок v1.5.0: getByRole слеп к hidden).
3. **Визуал.** Трек с заполнением (визуальный молд — tk-progress-bar),
   ручка-круг; хуки CONVENTIONS §6: `--tk-range-slider-{track-height,
   thumb-size,track-color,fill-color,thumb-color}`; нативный
   `input[type=range]` ВНУТРИ как механизм (structured clone не
   нужен — Lit-обёртка) ИЛИ pointer-математика; выбор — по простоте
   и a11y-бесплатности нативного инпута.
4. **Заземление (правка по рулингу мейнтейнера 2026-10-05).**
   Геометрия — по китовым регистрам: трек = молд tk-progress-bar
   (высота/hook-семейство), ручка = китовый круг. Пиксельное
   заземление — HOLD → явная цель капчура в 24T-чеклисте
   (TERMINAL-CAPTURE-CHECKLIST.md, раздел волны Epic 26). Основание
   правки: предпосылка «капча iis.png содержит слайдер» опровергнута
   на исполнении — полный пиксельный скан (жёлтое/серое/тёмное,
   структурная карта 7398px) трека не нашёл; живые пробы 2026-10-05
   (iis / moneybox / tariffs) дают ноль slider-элементов в DOM;
   банк-хоум и архивы v1–v4 чистые. Значения сумм — вымышленные.
5. **Полный цикл FR-16.** Юниты (клавиатурная карта, клампы, step-сеть,
   aria-пины, event-молчание первого рендера); CEM → React Slider
   (47-й враппер); стори RU «калькулятор вклада» (вымышленные числа) +
   pattern-стори «hero-калькулятор» (gap-6 рецепт: слайдер →
   вычисляемый текст → жёлтый CTA); базлайны light/dark ×2;
   hidden-guard 52→53; ростер каталогов; event-map запись.

## Out of scope

Multi-thumb / диапазон двумя ручками; vertical; тик-марки; связка с
data-table фильтрами (паттерн — потом).

## Verification (план)

- юнит-пины: aria-атрибуты после каждого взаимодействия; step-кламп
  (value=7 при step=5 → 5 или 10 по документированному правилу);
- полный visual compare: только новые базлайны, дрейф нулей;
- storybook-проба: клавиатурный обход без мыши (ATU-молд).

## Change Log

- **2026-10-05 (pre-execution).** AC4 переписан по рулингу мейнтейнера
  («китовые регистры + HOLD→24T»): заземление iis.png снято как
  ошибочное (gap-6 запись невоспроизводима — трека нет ни в капче,
  ни в живом DOM трёх поверхностей), геометрия переносится на молды
  tk-progress-bar + китовый круг; пиксельное заземление — HOLD до
  капчура 24T. Остальные AC без изменений.

## Execution record

- **Атом** (`packages/components/src/range-slider/`): strict §4
  number-канал (property-only `value`, строгий реверт с живой нативной
  ручкой до ответа консьюмера — caret-sanity mirror, release сеет
  uncontrolled от последнего controlled, `defaultValue` сеет один раз),
  step-grid display-clamp (prop не мутируется, ties → +∞; value 7 на
  сетке 0–10/step-5 рендерится 5 — progress-bar precedent), degenerate
  collapse, PageUp/PageDown ±10 шагов — единственный нативный пробел
  (keydown-гард с preventDefault), `valueFormatter` → readout-ячейка +
  aria-valuetext.
- **A11y-финиш (axe-раунд):** первый минт поймал 8 axe-фейлов (label на
  всех инстансах + color-contrast на disabled-тёмной ноге). Один фикс
  закрыл оба: input получает имя через aria-labelledby-цепочку на
  видимый header (label → formatted value, молд tk-input; текст
  становится частью контрола → inactive-components exemption для
  контраста), bare-инстансы — форвард host `aria-label` (молд
  tk-checkbox, `string | null` под ARIA-reflection базу). После фикса:
  все rangeslider axe-ноги зелёные в обеих темах.
- **React/гварды:** Slider — 47-й враппер (CEM → генератор), event-map
  `onValueChange: 'value-change'`; hidden-guard 52→53 / dedup 41→42;
  entry-пин TkRangeSlider; component-search ростер («Ползунок»).
- **Базлайны:** 10 PNG (5 стори × 2 темы: Песочница/Варианты/
  Калькулятор-паттерн/Доступность/API). Побочные сдвиги: getting-started
  ×2 (строка ростера удлинила гайд 4231→4307px — легитимный реминт) и
  api ×2 в fix-раунде (см. ниже).
- **CI-фикс-раунд:** feat-коммит `e02825f` поймал RED (run 37277765683,
  visual gate): api-стори рендерит таблицу из CEM — первый минт бежал на
  манифесте ДО aria-фикса, послекоммитная регенерация (поле ariaLabel)
  выросила таблицу на строку атрибута (1232→1327px), локальный compare
  этой слепой зоны не видел (аменд манифеста после прогона). Урок волне:
  **после любого изменения манифеста — docs rebuild + переминт api-стори
  компонента + compare.** Fix `3f92922`: api ×2 переминчены, локальный
  полный compare 2602/2602 на пересобранном дереве.
- **Локальные гейты:** юниты 918 (components, +17 слайдер) + 70 (react) +
  221 (root; gen-drift зелёный на закоммиченном состоянии), lint и
  typecheck чисты, gen-гейты идемпотентны, полный visual compare
  2602/2602 (15.6m).
- **CI VERDICT на `3f92922`: GREEN — run 37283157635** (08:21:50Z →
  08:58:55Z, 37.1m, gates job success; промежуточный `gh run watch`
  EXIT 1 — сетевой сбой внутри watch, вердикт по полю conclusion,
  повторный poll подтверждён — известный паттерн 11.1).
- **Docs-head CI VERDICT на `a194695`: GREEN — run 37287220117**
  (non-self-referential close по молду 11.1: строка записана следующей
  историей — 26.2, этим штампом).
- Vision-бюджет истории: 2/2 израсходовано на заземление-аудит
  (pixel-сканы без vision + 2 vision-вызова на кропы iis.png); минт и
  axe-раунд — без vision (пиксельный compare + error-context DOM).
