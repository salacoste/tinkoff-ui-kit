# Spec 27.1 — tk-spinner: indeterminate-лоадер

- **status:** DRAFT → frozen при открытии эпика
- **epic note:** Epic 27, brief `brief-epic-27-quality-window-2026-10-06.md`
  (adopt-атом BENCHMARK #3; заземление = китовые регистры — терминал 24T
  дал 0 вхождений, рулинг-молд 26.1/26.2/26.4).

## Story

As a kit consumer, I want a circular indeterminate loader atom that rides
kit registers (currentColor, size scale, motion with a reduce guard),
So that loading states stop being ad-hoc CSS or a misused progress-bar.

## AC (frozen)

1. **Контракт.** Атом STATELESS (event-map no-entry — молд tk-rating/
   tk-skeleton). Пропсы: `size` (`'16' | '20' | '24' | '32'`, default
   `'20'`) → host inline `--tk-spinner-size` (ОДИН канал на короб и
   геометрию дуги — молд tk-avatar size); `label` (string, default
   `'Загрузка'`); `label=''` → декоративный режим (молд rating
   aria-hidden points). Determinate-режим REFUSED — детерминированную
   загрузку владеет tk-progress-bar (записать в докстринге).
2. **Визуал (китовые регистры).** SVG-дуга: три четверти окружности
   (25% зазор), stroke 2px, cap round (семейство full-radius прогресса);
   r = (size − 2·stroke)/2 из того же size-канала. Цвет =
   `var(--tk-spinner-color, currentColor)` — наследует контекст текста
   (паттерн поляриса/shoelace), НЕ новый токен. Хуки
   `--tk-spinner-{size,color,stroke,duration}` (инстанс-level custom
   properties, молд `--tk-progress-bar-height`; дефолт-фолбэки в css).
3. **Motion.** Ротация группы дуги `--tk-spinner-duration` (default
   0.9s) linear infinite; `prefers-reduced-motion` → БЕЗ ротации,
   статичная дуга + смысл несёт label (молд skeleton reduce-гард;
   пин-тест на отсутствие animation при эмуляции reduce).
4. **A11y.** Именованный инстанс (`label` непуст): role="status" на
   host + SR-текст = label (aria-live полиси от role; self-assert из
   connectedCallback — закон React 19, идемпотентно). Декоративный
   (`label=''`): aria-hidden="true" на host (strictly `string | null`,
   молд avatar); дуга aria-hidden в обоих режимах. Axe обеих тем.
5. **Полный цикл FR-16.** Юниты (size→inline var; роль/aria оба режима;
   reduce-гард; дефолты); hidden-guard 55→56 щитов/45 файлов
   (spinner.css.ts); CEM (jsdoc класса и пропсов) → React Spinner —
   **51-й враппер**; event-map no-entry; ростер банка 45→46; стори RU
   («Загрузка данных» + размерный ряд + паттерн-употребление «в кнопке
   при ожидании» — вымышленный RU-контент) + api + accessibility-notes;
   базлайны light/dark; сюита растёт, полный compare.

## Change Log

- **2026-10-06 (pre-execution).** Frozen на китовых регистрах; ни один
  эталон-кит не копируется пиксельно — регистры кита (currentColor,
  round caps, size-ряд 16/20/24/32 = типовые кегли текста кита).
