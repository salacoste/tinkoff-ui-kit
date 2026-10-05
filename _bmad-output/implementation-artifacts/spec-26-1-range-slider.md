# Spec 26.1 — tk-range-slider: интерактивный ползунок

- **status:** DRAFT 2026-10-05
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
4. **Заземление.** Геометрия трека/ручки — по капче iis.png
   (captures-v4/invest/iis.*; значения сумм НЕ транскрибируются —
   вымышленные). Отклонения — честной записью.
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
