# Spec 25.4 — синтез: бенчмарк-матрица + gap-отчёт (kit recon, closes Epic 25)

- **status:** CLOSED 2026-10-05 — code-head CI run **37232913092**
  GREEN (коммит c93b5ea; verdict после факта)
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

## Execution record (2026-10-04)

- **Бенчмарк-матрица (AC1).** `BENCHMARK.md` в
  `kit-recon-2026-10/`: §0 ростер-глазах (machine), §1a номенклатура
  — 48 категорий «их X ≈ наш Y / GAP / ◐ / skip», §1b API-конвенции
  (CEM-глубина machine-посчитана: shoelace 6.2/1.9/1.8 vs self
  3.3/0.4/1.8→1.6 props/events/slots avg), §1c токен-архитектуры,
  §1d активность (дословно 25.2), §1e визуальные регистры (реф
  composite-*.png на каждую строку).
- **Инвентари (честность метода).** React-семейства без CEM —
  инвентари из ТЕХ ЖЕ кэш-тарболов, что минтили снапшоты (antd `es/`
  75, mui ~85, mantine `styles/*.css` 99, carbon `scss/components/`
  87, taiga 93 d.ts-decl, radix ~29 primitives); shadcn + polaris —
  docs-индексы, 2 vision-чтения (budget ≤2/kit: по 1). Все команды
  воспроизводимы; версии запины JSONL.
- **Gap-отчёт (AC2).** 15 находок с тегами: adopt ×5 (slider, switch,
  spinner, textarea, avatar), watch ×7 (date-picker ПД-гейт, drawer,
  OTP, CEM-events thinness, antd token-meta, polaris high-contrast,
  …), skip-by-laws ×2 (icons — рулинг 23.2; shadcn registry model —
  npm-never/private-forever), adopt-keep ×1 (chart in-kit). Каждая со
  ссылкой на снапшот/PNG/репо-путь.
- **Перенос (AC3/AC4).** Ноль правок продукт-кода; вывод «form-control
  completeness wave» сформулирован как корм следующего брифа (§3).
- **Идемпотентность (Verification).** `node recon/harvest.mjs --kit
  shoelace` без force → `skipped: shoelace@2.20.1`, git diff
  снапшотов ПУСТ.
- **Гейты (AC5).** lint/typecheck EXIT 0, `pnpm test` 221/221; сюита
  не тронута (дерево: только BENCHMARK.md + спека).
