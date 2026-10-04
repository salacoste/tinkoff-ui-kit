# Spec 25.1 — machine-harvest конвейер + dogfood + пилот Taiga (kit recon)

- **status:** CLOSED 2026-10-04 (executed + CI run 37214077995 GREEN)
- **baseline_commit:** ff0e423
- **epic note:** Epic 25, brief `brief-epic-25-kit-ecosystem-recon-2026-10-04.md`
  (Решения 1–4; история-фундамент эпика).
- **grounding:** рулинги Q&A 2026-10-04; метод «сначала класс источника»
  (таблица брифа).

## Story

As a kit maintainer, I want a deterministic local tool that harvests a
UI library's machine-readable artifacts (registry metadata + package
tarball manifests) into a normalized snapshot,
So that ecosystem analysis runs on structured JSON instead of scraping
rendered docs, and the schema is provably complete by dogfooding it on
our own published packages.

## AC (frozen)

1. **Инструмент.** `recon/` TS-модуль (root, dev-only); запуск
   `pnpm recon:harvest -- --kit <id>` из корня; ноль правок `packages/*`
   (импорт наших пакетов — только как tarball-цель dogfood).
2. **Registry-слой.** `registry.npmjs.org/<pkg>` JSON через fetch:
   версии/даты, лицензия, deps, dist-размеры. npm-CLI запрещён
   (standing law); при 429/5xx — честный отказ с ретраем ≤3.
3. **Tarball-слой.** Скачивание tarball (fetch → временный кэш
   `recon/.cache/`, gitignored), распаковка, извлечение: package.json
   (`exports`, peerDeps), `custom-elements.json` (CEM) при наличии,
   инвентарь `.d.ts`, токен-файлы (`*.tokens.json`, CSS custom props
   эвристикой — помечено как эвристика), README.
4. **Нормализация.** Единая схема `KitSnapshot {kit, npm, version,
   fetchedAt, components[{name, tag?, props[], events[], slots[]}],
   tokens[], themes[], meta{license, deps, sizes, artifactsFound}}`;
   выход — `recon/snapshots/<kit>.jsonl` (одна запись = один снапшот;
   инкремент — дописывание новой версии, повтор той же версии —
   идемпотентный нулевой дифф).
5. **Dogfood (гейт схемы).** Прогон на нашей тройке компонентов
   @1.7.0 (tarball из локального publish-дерева по молду Flow-B или
   registry): схема ОБЯЗАНА описать собственный кит — CEM у нас есть;
   любой провал (пропущенное поле/компонент) = дефект схемы, не данных.
6. **Пилот Taiga.** Полный harvest `@taiga-ui/core` (Angular, без CEM
   — ожидаемо): зафиксировать, что реально извлекается (d.ts-инвентарь,
   theming-файлы, docs-метаданные), честная запись артефактной базы.
7. **Capability-матрица.** Таблица «кит-кандидат → публикуемый
   артефакт → качество извлечения» по всем кандидату брифа; финальный
   ростер 25.2 выводится из неё (и фиксируется в roster.yml).
8. **Гейты.** Корневые lint/typecheck EXIT 0; юнит-тесты парсеров на
   мини-фикстурах (крошечный CEM + крошечный package.json) через
   vitest; CI-вердикт после пуша; снапшоты и roster.yml коммитятся.

## Out of scope

Сайт-слой и скриншоты (25.3); метрики downloads/GitHub (25.2); синтез
(25.4); CI-интеграция рекона; любые правки продукт-кода.

## Verification (план)

- `pnpm recon:harvest -- --kit self` → dogfood-снапшот тройки, сверка
  счётчика компонентов с CEM (46 React-врапперов / 41 каталог);
- `pnpm recon:harvest -- --kit taiga` → снапшот + запись базы;
- идемпотентность: повторный прогон — `git status` чист по снапшотам;
- полный обычный гейт-набор (visual не затронут — dev-only файлы).

## Execution record (2026-10-04)

**Инструмент (AC1).** `recon/` в корне (plain ESM `.mjs`, dev-only;
`packages/*` не тронуты). CLI `node recon/harvest.mjs --kit <id> [--force]
| --list | --capability`; скрипт `pnpm recon:harvest`. Слои:
`lib/http.mjs` (транспорт), `lib/registry.mjs` (packument-JSON + кэш
ETag-ключ), `lib/tarball.mjs` (download/extract), `lib/extract.mjs`
(чистые парсеры CEM/токенов + scanPackage), `lib/snapshot.mjs`
(KitSnapshot + идемпотентный JSONL), `lib/capability.mjs` (jsDelivr
flat-listing). Ноль новых зависимостей.

**Транспорт = curl, не node-fetch (AC2, отклонение с обоснованием).**
Node-undici fetch в этой песочнице стабильно падает ConnectTimeoutError
на все адреса registry.npmjs.org при работающем curl к тем же хостам;
undici не в зависимостях, добавлять ради этого не стали. Весь HTTP-слой
— curl-субпроцесс (`lib/http.mjs`, ретраи ≤3 на 429/5xx, USER_AGENT
`pillkit-recon/25.1`). npm-CLI не используется нигде (standing law).

**Dogfood (AC5) — ПРОЙДЕН.** `--kit self` = `pnpm pack` локального
workspace `pillkit-components` (кит не публикуется в npm — standing law);
в снапшоте `meta.source: "pnpm pack (local workspace)"`. Сверка: source
CEM несёт 45 tagName-деклараций → snapshot `components` = 45/45,
`cem: true`. Дельта к «46 врапперов / 41 каталог» спеки — это счётчики
ДРУГИХ множеств (React-обёртки/каталог), а не source CEM; гейт «схема
обязана описать собственный кит» пройден без потерь. `stylesheets: 0` —
честный факт css-in-JS кита (токены живут в отдельном `pillkit-tokens`).

**Пилот Taiga (AC6).** `@taiga-ui/core@5.26.0` harvested: cem=false
(честная запись), dts=245, components=0, tokens=0. Рекон-факты пилота:
(a) в пакете НЕТ ни одного .css/.less — стили family Angular живут в
сиблинг-пакетах; (b) каталог `tokens/` — это Angular DI-токены, не
дизайн-токены (не считаются токенами и не должны); (c) компонентная
номенклатура извлекаема из формы путей d.ts — добавлена честная
эвристика `dtsComponents` (`*.component.d.ts`/`*.directive.d.ts`,
path-derived, not typed API): Taiga → **93**. Юнит-тесты на ветку —
`recon/parse.test.mjs` (buildSnapshot: note при отсутствии CEM, молчит
при живом CEM).

**Capability-матрица + ростер (AC7).** `recon/capability.md` сгенерирован
(11 строк): единственные CEM-публикаторы в ростере — **shoelace и self**;
antd несёт 4 tokens-json + 164 theme-файла; mantine 206 стилей; carbon
289 стилей/0 d.ts; radix 37 d.ts/0 стилей (headless — честно); shadcn
repo-only. Поправки ростера по факту достижимости: `@polaris/tokens` 404
→ живой `@shopify/polaris-tokens`; spectrum `base` — шелл (14 d.ts),
компоненты family размазаны по ~60 per-component пакетам (рекон-факт,
записан комментарием в roster.yml). `roster.yml`: status draft →
**frozen**.

**Гейты (AC8).** `pnpm -w lint` EXIT 0 (после добавления `recon/.cache/**`
в ignores eslint — распакованный tarball Taiga это чужой код, не цель
линта); `pnpm -w typecheck` EXIT 0; `pnpm test` — 21 файл / **213 тестов**
(включая 13 recon-ног) — GREEN. Идемпотентность (AC4): повторные
`--kit self` / `--kit taiga` без force → оба `skipped`, снапшоты не
изменены. Visual не затронут (dev-only).

**CI-вердикт (после факта):** коммит `10639cc` (17 файлов, +1111) —
**run 37214077995 = success** (снят `gh run view` по завершении; пуш
следующего коммита — только после этого вердикта, zero-in-flight).

**Status: CLOSED 2026-10-04.** Все AC исполнены; отклонения (curl vs
node-fetch) обоснованы и записаны; ростер frozen — вход для 25.2.

**Коммит-состав.** `recon/**` (кроме gitignored `.cache/`),
`recon/snapshots/{self,taiga}.jsonl`, `recon/capability.md`,
`recon/roster.yml`, `vitest.config.ts` (+include), `package.json`
(+script), `.gitignore` (+cache), `eslint.config.js` (+ignore),
`spec-25-1` (этот record).
