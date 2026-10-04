# Spec 25.4 — синтез: бенчмарк-матрица + gap-отчёт (kit recon, closes Epic 25)

- **status:** DRAFT 2026-10-04 (AC frozen по форме; содержание — по
  данным 25.2/25.3)
- **baseline_commit:** ff0e423
- **epic note:** Epic 25, brief `brief-epic-25-kit-ecosystem-recon-2026-10-04.md`
  (замыкает эпик; корм для СЛЕДУЮЩЕГО брифа — без него историй не
  открывать).

## Story

As a kit maintainer, I want a synthesis report comparing our kit
against the roster on nomenclature, API surface, tokens and theming,
So that the next epic brief is grounded in measured gaps instead of
intuition.

## AC

1. **Бенчмарк-матрица.** Категории × киты × мы: (а) номенклатура
   компонентов (мэппинг «их X ≈ наш Y / GAP»); (б) API-конвенции
   (props/events/slots/CSS-hooks coverage); (в) токен-архитектура
   (слои, темизация, нейминг); (г) метрики активности (из 25.2);
   (д) визуальные регистры (из 25.3, качественно).
2. **Gap-отчёт.** `_bmad-output/planning-artifacts/kit-recon-2026-10/`
   `BENCHMARK.md`: топ-N находок с доказательной ссылкой на снапшот
   или PNG; каждая находка помечена {adopt / watch / skip-by-laws}
   (skip с причиной — закон/лицензия/масштаб).
3. **Честность.** Никаких выводов вне данных снапшотов; качественные
   утверждения — со ссылкой на артефакт; числовые — воспроизводимы
   из JSONL.
4. **Перенос.** НИКАКИХ правок продукт-кода из находок в этой истории;
   всё — в отчёт, потребление — следующим брифом мейнтейнера.
5. **Гейты.** lint/typecheck EXIT 0; CI-вердикт; close-out штампы
   (CLAUDE.md story-log, HANDOFF-очередь).

## Out of scope

Реакция на находки (следующий эпик); CI-cron; периодика.

## Verification (план)

- каждая строка матрицы трассируется до `recon/snapshots/*.jsonl`
  или PNG-артефакта;
- финальный снапшот-набор идемпотентен (повторный harvest — нулевой
  дифф); сюита кита зелёная без изменений.
