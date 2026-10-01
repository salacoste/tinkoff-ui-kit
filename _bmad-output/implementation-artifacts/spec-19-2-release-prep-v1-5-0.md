# Spec 19.2 — Release prep v1.5.0 (post-v1.4.0 window: 18.1–18.4 + 19.1; TAG = maintainer)

- **status:** EXECUTED 2026-10-01 (локальные гейты EXIT 0: build / test
  200/200 / lint / typecheck; gen zero-drift; полный compare **2182/2182
  GREEN** после переминта пина; CI-вердикт головы — в Verification ниже)
- **baseline_commit:** `5821874` (CI 36754900566 = success — база зелёная)
- **молд:** spec-17-5-tj-release-prep.md (деление «story исполняет prep,
  тег — ТОЛЬКО мейнтейнер» переиспользуется дословно); RELEASE.md §11 —
  структурный образец для §12.

## AC (frozen)

1. **Версии + CHANGELOG (in-story, отражается в §12.2):** семь
   shippable-манифестов `1.4.0 → 1.5.0` (банк ×3 + ТЖ ×3 + tj-fonts —
   ОQ-10 поезд; tj-fonts встал на 1.4.0 в 18.3, первый тег с ним = v1.5.0);
   корневой `0.1.0` и docs `0.0.0` вне контракта. CHANGELOG: `[Unreleased]`
   → `[1.5.0] - <дата исполнения>` + свежий пустой `[Unreleased]`;
   секция EN с ИЗМЕРЕННЫМИ числами: Added (tk-menu-popover 19.1;
   pillkit-tj-fonts 18.3) + Fixed (tj-header метрики 18.1) + Internal
   (batch-confirm ЧАСТЬ v1.4.0 закрыт; README-freshness 18.2; docs
   actualization 18.4; уроки lockfile/pipefail). `pnpm gen` после бампа —
   zero drift; grep-пруф чистоты (нет читателей полей версий).
2. **RELEASE.md §12 «Релиз v1.5.0»** — 7 подсекций, зеркало §11 с
   фактами окна: §12.1 pre-flight (цепочка CI ran-id окна 18.1→19.1:
   36705793707, 36709057024, 36715355750 (после 26-сек RED-фикса
   lockfile), 36718261116, 36721958634, 36725989337, 36749011384,
   36754900566 — все GREEN; полный compare 2182/2182 на голове 19.1);
   §12.2 исполненные бампи (7 манифестов, before→after); §12.3 тег —
   мейнтейнер-only ДОСЛОВНО; §12.4 Flow-A v1.5.0 = банк-потребитель
   рендерит НОВЫЙ атом tk-menu-popover (§10.4 молд) + ТЖ-ALONE census
   (§11.4 референсен) + НОВИНКА поезда: pillkit-tj-fonts в install-строке
   ТЖ-флоу (первый тег с бандленными шрифтами); recipe-only до тега;
   §12.5 = дословно легшая секция CHANGELOG; §12.6 шрифты/право — НОВОЕ:
   XCharter ×4 woff2 едет В ДЕРЕВЕ по Bitstream-условиям (первый
   шрифтонесущий тег), Graphik по-прежнему только рецепт; Daytona/JBM
   неизменны; §12.7 пруф неисполнения, суженный НА ТЕГ ТОЛЬКО.
3. **Пины:** README (clone/checkout `v1.5.0`; семверинг «текущий —
   v1.5.0»; строка Flow-A-протокола) + банковский getting-started стори
   (тег в тексте рендерится → 2 базлайна переминчены ЯВНО, rm → update);
   tj-getting-started пинов тега не несёт (проверено grep).
4. **HANDOFF:** строка §2 (окно 18.1–19.1: 8 GREEN-ran-id, Epic 19 открыт)
   + §4 очередь = живые хвосты (тег v1.5.0 санкция; живой VoiceOver;
   iOS momentum-scroll) — ничего не выдумано, ничего не потеряно.
5. **Цикл:** гейты EXIT 0 (build/test/lint/typecheck) → docs rebuild →
   filtered re-mint изменённых стори → ПОЛНЫЙ compare (железный закон:
   собранное дерево изменилось) → два pathspec-коммита (bump первым,
   recipe цитирует свою голову) → zero-in-flight → push → CI-вердикт по
   run id ПОСЛЕ факта. **ТЕГ НЕ СТАВИТСЯ — санкция мейнтейнера ONLY.**
6. Штампы память+CLAUDE.md — ПОСЛЕ вердикта, одним close-out штампом.

## Risks / notes

- Пин тега в стори меняет пиксели → только явный rm+re-mint (закон).
- Никаких npm-команд; `private: true` навсегда; версионные поля не
  рендерятся (grep-пруф в §12.2).
- Базлайн-числа: suite 562 PNG (544+18), регион-наборы 12×2, legs 2182 —
  ИЗМЕРЕНО на голове prep-окна.

## Implementation Notes (close-out, 2026-10-01)

- **AC1** — коммит `d760e44`: ровно 7 строк версий (diff проверен) +
  CHANGELOG `[1.5.0] - 2026-10-01` (Added 19.1+18.3 / Fixed 18.1 /
  Internal: batch-confirm закрытие, README-freshness, docs actualization,
  pnpm-lockfile урок) + свежий пустой `[Unreleased]`; `pnpm gen` после
  бампа — zero drift; grep `.version`-читателей по packages/*/src + tests
  — пусто; рендерящихся литералов версий в сторях — только намеренный
  пин getting-started (AC3).
- **AC2** — RELEASE.md §12, 7 подсекций, зеркало §11: §12.1 цепочка окна
  ran-id-ами (все 8 GREEN, включая 26-с RED→фикс 18.3), §12.2 исполненные
  бампи + пруфы чистоты, §12.3 тег мейнтейнер-only + recipe-блок, §12.4
  Flow-B (банк рендерит tk-menu-popover, §10.4-молд) + ТЖ-референсы +
  четырёхпакетная install-строка с tj-fonts, §12.5 дословный changelog,
  §12.6 XCharter-в-дереве как ПЕРВЫЙ шрифтонесущий тег + Graphik-рецепт,
  §12.7 пруф неисполнения, суженный на ТЕГ (git tag -l без v1.5.0;
  npm-команды не запускались). Попутный фикс разметки в §12.1.3
  (вложенный бэктик) — до коммита.
- **AC3** — README: clone/checkout пин → v1.5.0, семверинг «текущий —
  v1.5.0», строка релизных гейтов «v1.2.0–v1.5.0»; getting-started стори:
  пин в рендерящемся тексте → v1.5.0, 2 базлайна переминчены ЯВНО
  (rm → docs rebuild → scoped update); tj-getting-started пинов не несёт
  (grep-проверено).
- **AC4** — HANDOFF: шапка 2026-10-01, строка §2 «post-v1.4.0 окно →
  v1.5.0» (полная CI-цепочка, итоги 40 компонентов / 562 PNG / 2182 legs),
  §4 очередь v1.5.0 = (a) тег-санкция [единственный блокер] + (b) живой
  VO + (c) iOS + (d) опциональный batch-confirm прироста + (e) Graphik-не-блокирует.
- **AC5** — гейты на голове prep: `pnpm build` ✓ · `pnpm test` 200/200
  (корневой; пакеты рекурсивно — react 70 shown) · lint ✓ · typecheck ✓ ·
  полный compare **2182/2182, exit 0 (pipefail), 12.6 мин**. Коммиты:
  `d760e44` (chore bump первым) → docs(release) этим же окном (recipe
  цитирует голову бампа). Push zero-in-flight; вердикт — ниже по факту.

## Verification

Локально: см. AC5. CI: run на голове 19.2 (коммит docs(release)) —
вердикт будет записан сюда ПОСЛЕ существования, по `gh run view <id>
--json conclusion` (правило CLAUDE.md: никогда не писать вердикт до
факта). Тег v1.5.0 НЕ поставлен — мейнтейнер-only (§12.3).
