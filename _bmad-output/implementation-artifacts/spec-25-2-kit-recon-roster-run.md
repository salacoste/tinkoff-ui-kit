# Spec 25.2 — ростер-прогон машинным слоем + метрики активности (kit recon)

- **status:** DRAFT 2026-10-04 (AC frozen по форме; ростер-состав
  уточняется по capability-матрице 25.1)
- **baseline_commit:** ff0e423
- **epic note:** Epic 25, brief `brief-epic-25-kit-ecosystem-recon-2026-10-04.md`
  (Решение 1 — ростер; Решение 2 — класс «метрики активности»).

## Story

As a kit maintainer, I want the frozen roster harvested end-to-end with
activity metrics attached,
So that the ecosystem picture rests on a complete, committed dataset
rather than spot checks.

## AC

1. **Ростер заморожен.** `recon/roster.yml` финален (из матрицы 25.1):
   каждый кит — `{id, npm | repo, family, anchor?}`; Taiga — якорь.
2. **Полный прогон.** `pnpm recon:harvest -- --all` по ростеру;
   снапшоты каждого кита в `recon/snapshots/`; провалы/пропуски
   артефактов — честные записи в meta, не тихие нули.
3. **Метрики downloads.** `api.npmjs.org/downloads/point|range` (HTTPS
   fetch): последние 30 дней на пакет + диапазон для якоря; в снапшот.
4. **GitHub-слой.** `gh api` (уже аутентифицирован в среде): releases
   (последние 10, каденс), contributors-счётчик, open-issues, last
   commit SHA/дата; в снапшот meta.
5. **Отчёт на кит.** `_bmad-output/planning-artifacts/kit-recon-2026-10/`
   — по одному отчёту на кит (состав, API-масштаб, токены, метрики,
   артефактная база) + сводка `SUMMARY.md` (таблица китов).
6. **Гейты.** lint/typecheck EXIT 0; CI-вердикт после пуша; снапшоты
   и отчёты коммитятся pathspec'ом.

## Out of scope

Скриншоты (25.3); качественные выводы/бенчмарк (25.4); правки кода кита.

## Verification (план)

- каждый кит ростера имеет непустой снапшот либо честную запись
  «артефакт недоступен» с причиной;
- dogfood-запись тройки остаётся идемпотентной (повтор 25.1 — нулевой
  дифф);
- SUMMARY-таблица сходится со счётчиком снапшотов.
