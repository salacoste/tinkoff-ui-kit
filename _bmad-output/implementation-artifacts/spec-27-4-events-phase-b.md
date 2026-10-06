# Spec 27.4 — events phase B: carousel page-change + toast lifecycle

- **status:** EXECUTED (2026-10-06) — локальные гейты полные ЗЕЛЁНЫЕ:
  gen/build/lint/typecheck, юниты (components+react), scoped-реминт
  api-стори ×2 темы с confirm-прогоном, полный visual compare сюиты
  **2755 passed (16.4m)**. CI-вердикт — в close-out story log (не
  вписывается до факта).
- **epic note:** Epic 27, brief `brief-epic-27-quality-window-2026-10-06.md`.
  Исполнен отдельным окном ПОСЛЕ закрытия 27.1–27.3a по санкции
  мейнтейнера «1 ok and then 2» (сначала 27.4, затем v1.9.0-prep).

## Story

As a kit consumer, I want tk-carousel to announce page changes and
tk-toast to announce its lifecycle,
So that feeds stop needing story-level workaround directives and toast
chains become awaitable.

## AC (frozen draft)

1. **tk-carousel `page-change`.** Емитится из ЕДИНОЙ точки —
   `#syncFromRail()` при смене snap-индекса: клики шевронов (page-step ±
   clientWidth → scroll-события), нативный drag/scrollbar/клавиатурный
   скролл, programmatic scrollLeft — всё сходится в один funnel.
   `detail: { page }` (1-based, int); composed + bubbles (§3);
   **§9-молчание первого рендера** (guard `#emittedPage === null` молд
   accordion-item/note). Дроссель присущ механике: page =
   round(scrollLeft/clientWidth), эмит ТОЛЬКО на смене значения (не на
   каждый scroll-tick). **Поправка драфта по факту кода:** точки
   НЕкликабельны (декоративный рулинг 21.6) — ветки «клик-точка» в
   драфте не существует; юниты: инициализация молчит, шеврон-степ
   эмитит соседнюю страницу, внутристраничный тик молчит, возврат
   эмитит.
2. **tk-toast lifecycle `hide`.** Эмитится при авто-dismiss (таймаут) и
   программном hide; `detail: { reason: 'auto' | 'manual' }` (строковый
   union). Показ — компонент уже наблюдаем через вызов контроллера,
   событие show НЕ добавляется (улики нет — P2-вердикт отчёта сужен до
   hide). §9-молчание: первый рендер не эмитит.
3. **Контрактная обвязка:** CEM-докстроки событий (jsdoc → манифест);
   React-пропсы onPageChange/onHide из CEM (без ручного кода); event-map
   += 2 строки; §9-пины молчания в юнитах обоих атомов.
4. **Реминты:** манифест дельтает → api-стори carousel/toast под
   угрозой дрейфа (урок 26.1): docs rebuild, compare, при дельте —
   ЯВНЫЙ rm + scoped реминт затронутых; полный compare сюиты.
5. **Гейты:** полные; BENCHMARK #10 watch-статус снимается в close-out
   окна (cross-ref строка в отчёте аудита — правится оркестратором).

## Change Log

- **2026-10-06 (draft).** P2-состав toast сужен до `hide` — событие show
  не имеет потребительской улики (правило §9 отчёта).
- **2026-10-06 (исполнение).** Поправка AC1 по факту кода: ветки
  «клик-точка» НЕ существует — точки декоративны и некликабельны (рулинг
  21.6); page-change эмитится из ЕДИНОЙ точки `#syncFromRail()` при
  смене snap-индекса (шевроны/нативный скролл/programmatic — один
  funnel). Guard молчания: `#emittedPage: number | null`.
- **2026-10-06 (исполнение).** Тест-урок: intra-page тик 700→800 НЕ
  подходит для пина молчания — 800/500 = 1.6, round даёт страницу 2
  (реальная смена). Использован 700→740 (1.4 → 1.48, обе round →
  страница 2): арифметика тика обязана считаться ДО фиксации теста.
- **2026-10-06 (исполнение).** Реминты по уроку 26.1: CEM-дельта @fires
  → api-стори carousel/toast — явный rm + scoped реминт ×2 темы ×2
  компонента (4 PNG), confirm-прогон 12/12 (c axe leg); полный compare
  2755 passed — дрейфа нет.
