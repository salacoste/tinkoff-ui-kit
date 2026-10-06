# Spec 27.4 — events phase B: carousel page-change + toast lifecycle

- **status:** DRAFT (фаза B по отчёту `kit-events-audit-2026-10/REPORT.md`;
  санкция направления — выбор мейнтейнера «CEM-events углубление»)
- **epic note:** Epic 27, brief `brief-epic-27-quality-window-2026-10-06.md`.
  Исполняется хвостом окна ПОСЛЕ 27.1 (один build-heavy поток единовременно).

## Story

As a kit consumer, I want tk-carousel to announce page changes and
tk-toast to announce its lifecycle,
So that feeds stop needing story-level workaround directives and toast
chains become awaitable.

## AC (frozen draft)

1. **tk-carousel `page-change`.** Емитится: клик-шеврон (page-step ±
   clientWidth), клик-точка, programmatic scroll snap-установка.
   `detail: { page }` (1-based, int); composed + bubbles (§3);
   **§9-молчание первого рендера** (guard `wasPage !== undefined` молд
   accordion-item/note). НОВЫЙ юнит-функционалка: инициализация НЕ
   эмитит; шеврон вперёд/назад эмитит соседнюю страницу; точка — свою.
   Дроссель скролл-событий: page вычисляется по snap-позиции
   (scrollLeft/clientWidth round), эмит только на смене страницы (не на
   каждый scroll-tick).
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
