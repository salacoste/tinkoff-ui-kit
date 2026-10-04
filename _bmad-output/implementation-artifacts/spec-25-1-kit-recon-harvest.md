# Spec 25.1 — machine-harvest конвейер + dogfood + пилот Taiga (kit recon)

- **status:** DRAFT 2026-10-04 (AC frozen; исполнения нет)
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
