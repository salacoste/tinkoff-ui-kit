# Spec 25.2 — ростер-прогон машинным слоем + метрики активности (kit recon)

- **status:** CLOSED 2026-10-04 (executed + CI run 37219706642 GREEN)
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

## Execution record (2026-10-04)

**AC1 (ростер).** Уже frozen в 25.1 (поправки `@shopify/polaris-tokens` +
spectrum-шелл записаны там же); вход этого прогона — 11 записей без
правок.

**AC2 (полный прогон).** `node recon/harvest.mjs --all` — 11/11 без
провалов: taiga/shoelace/spectrum/mui/antd/mantine/carbon/polaris/radix
(registry+tarball), self (pnpm pack), shadcn (repo-only стаб с честной
записью «no published tarball to harvest» + активность из GitHub).
Честные нули сохранены: react-семейства дают components=0/dtsComponents=0
(их d.ts не компонентной формы — не тихий нуль, а структурный факт);
carbon/styles d.ts=0 (это чистый токен-носитель).

**AC3 (downloads).** `lib/downloads.mjs` поверх curl-транспорта:
`point/last-month` для всех npm-китов; якорь taiga дополнительно
`range/180d` с дневным рядом в снапшоте (корм корреляции каденса 25.4).
Крупные: radix 60.9M/30d, mui 43.1M, antd 15.7M, mantine 10.5M;
shoelace 534K при 0 релизов за 12+ мес (живой рекон-факт: высокие
загрузки при остановленных публикациях — last publish 2025-03-11).

**AC4 (GitHub).** `lib/github.mjs` через аутентифицированный `gh api`:
stars/forks/open-issues/pushed_at + последние 10 релизов +
contributors-счётчик с честным капом (100+ у 5 китов, флаг
`contributorsCapped`). Репо-резолв: roster.repo > normalizeRepoUrl
(packument repository). shadcn 125,084 звезды — максимум ростера.

**AC5 (отчёты).** `recon/report.mjs` → `_bmad-output/planning-artifacts/
kit-recon-2026-10/`: 11 кит-отчётов + SUMMARY.md (таблица сходится: 11
строк = 11 снапшотов; проверено юнит-тестом рендера).

**Эволюция семантики JSONL (запись отклонения).** Force теперь
ЗАМЕНЯЕТ строку kit@version на месте (раньше — дублировал); при
обнаружении легаси-дублей той же версии (артефакт 25.1-эры в taiga.jsonl)
— коллапсирует их в одну. Единый инвариант: одна строка на kit@version,
последнее состояние инструмента побеждает. Покрыто юнитами
(append/replace/collapse).

**AC6 (гейты).** lint/typecheck EXIT 0; `pnpm test` корневой 219/219
(+6: sumRange, normalizeRepoUrl ×6 утверждений, force-replace/collapse,
report-рендеры ×3); пакеты без изменений (900/248/70/…). Идемпотентность
dogfood (Verification): повтор `--kit self`/`--kit taiga` без force —
`skipped`, нулевой дифф (проверено в 25.1-цикле и сохранено). Visual не
затронут. CI-вердикт: pending (пуш этого коммита; обновляется ниже).

**Коммит-состав.** `recon/harvest.mjs`, `recon/report.mjs`,
`recon/lib/{downloads,github,snapshot}.mjs`, `recon/parse.test.mjs`,
`recon/snapshots/*.jsonl` (11), `_bmad-output/planning-artifacts/
kit-recon-2026-10/` (12 файлов), эта спека.

**CI-вердикт (после факта):** коммит `29994ae` (30 файлов, +785/−21) —
**run 37219706642 = success** (zero-in-flight соблюдён: пуш только после
GREEN предыдущего `fb3875a`/37216602275).

**Status: CLOSED 2026-10-04.** Вход для 25.3 (визуальные галереи) —
полный снапшот-датасет 11 китов + отчёты.
