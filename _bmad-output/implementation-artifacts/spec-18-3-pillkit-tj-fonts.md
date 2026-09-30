# Spec 18.3 — pillkit-tj-fonts: XCharter bundled, Graphik recipe (queue v1.4.0-(d), rulings B/split/XCharter)

- **status:** EXECUTED 2026-09-30 (orchestrator; new package + token slot + docs; re-mint
  отменён по факту — дельты суб-пороговы, см. Verification)
- **baseline_commit:** `827f0c6` (18.2 голова; CI run 36709057024 вердикт — ПО ФАКТУ,
  коммит 18.3 только поверх зелёной базы)
- **rulings (мейнтейнер, 2026-09-30, живые ответы):** (1) модель = **B**
  (Daytona-молд: отдельный НЕ-MIT шрифтовой пакет); (2) **сплит** —
  Charter-семейство бандлим, Graphik остаётся слотом+рецептом (стандартная
  EULA Commercial Type прав на редистрибуцию НЕ даёт); (3) бинарники =
  **XCharter** (кириллица 1144 глифа; у оригинального Bitstream Charter
  кириллицы НЕТ — 228 глифов, cmap-проверено; XCharter = те же свободные
  условия Bitstream, имя сменено по клаузуле лицензии).

## Контекст (факты разведки)

- **Лицензия Bitstream Charter (дословно, CTAN readme.charter):** «You are
  hereby granted permission under all Bitstream propriety rights to use,
  copy, modify, sublicense, sell, and redistribute the 4 Bitstream Charter
  (r) Type 1 outline fonts for any purpose and without restriction;
  provided, that this notice is left intact on all copies…». XCharter
  (Michael Sharpe, CTAN fonts/xcharter 1.26, 2024-06-18): шрифты = Free
  под теми же условиях; модификации © 2009–2012 Andrey Panov,
  © 2013–2024 Michael Sharpe; имя XCharter — соблюдение rename-клаузулы.
- **Graphik (Commercial Type):** ~$60/стиль desktop + web по трафику;
  standalone-редистрибуция файлов стандартной EULA ЗАПРЕЩЕНА → в пакете
  только @font-face-рецепт (файлы приносит потребитель по своей лицензии).
- Действующая zero-fonts-модель ТЖ-тройки (инвариант + тест) СОХРАНЯЕТСЯ:
  тройка не бандлит бинарников; sanctioned-носитель = новый пакет вне тройки.

## AC (frozen)

1. **Пакет `packages/tj-fonts/`** (молд `packages/tokens`): package.json
   `pillkit-tj-fonts` v1.4.0 (OQ-10 join-train), `private: true`,
   `license: "SEE LICENSE IN LICENSE"`, exports `./fonts.css` + `./fonts/*`,
   files: fonts/, fonts.css, LICENSE, LICENSE-FONTS.md, README.md.
2. **Бинарники:** ровно 4 XCharter-лица OTF→woff2 (fonttools 4.66.1, без
   сабсеттинга — полные лица), имена
   `xcharter-{400,400italic,700,700italic}.woff2`; источник — CTAN
   xcharter 1.26 opentype/{Roman,Italic,Bold,BoldItalic}.otf; конвейер
   сессионный (/tmp), в репо — только готовые woff2.
3. **`fonts.css`:** @font-face ×4 — family "XCharter" (400/400 italic/
   700/700 italic, format('woff2')); ниже — ЗАКОММЕНТИРОВАННЫЙ рецепт
   Graphik (пути-плейсхолдеры, указание принести лицензированные файлы).
4. **`LICENSE-FONTS.md`:** дословный текст лицензии Bitstream Charter +
   attribution-блок XCharter (© Panov/Sharpe, CTAN-источник) + явное
   «Graphik НЕ поставляется (Commercial Type; лицензия потребителя)».
5. **Токен-слот:** `--tj-font-reading` получает `"XCharter"` ПЕРВЫМ
   (was: Charter, Bitstream Charter, PT Serif, Georgia); правка только в
   токен-источнике ТЖ → `pnpm gen:tokens` → TOKENS.md/dist реген;
   `--tj-font-ui` НЕ трогается (Graphik-слот уже корректен).
6. **Инвариант zero-fonts:** закон «тройка без бинарников» сохранён — тест
   ре-скоупится на ИМЕНОВАННУЮ тройку, если сейчас гложет packages/tj-*;
   НОВЫЙ тест пакета: 4 woff2 существуют, LICENSE-FONTS.md в files,
   fonts.css декларирует ровно family "XCharter" ×4 + комментарий-рецепт
   Graphik присутствует.
7. **Доки:** ТЖ getting-started — секция «Шрифты одной строкой»
   (import 'pillkit-tj-fonts/fonts.css' → XCharter подхватывается слотом;
   Graphik — рецепт); упавшее множество базлайнов = только истории с
   изменённым текстом (enumerate по факту прогона); PNG удаляются ЯВНО →
   re-mint → ПОЛНЫЙ compare 2123/2123 GREEN.
8. **Гейты:** build/test/lint/typecheck EXIT 0; gen + gen:tokens zero-drift.
9. **Коммит:** pathspec (пакет целиком, tj-tokens источник+dist+TOKENS.md,
   тесты, доки-стория, PNG, спек); conventional EN; CHANGELOG `[Unreleased]`
   Added; CI-вердикт — по run id ПОСЛЕ факта, в память окна.

## Story Flow

1. Конвертация 4 лиц → woff2 + контроль (cmap-спот, размеры).
2. Скаффолд пакета + лицензионные тексты + fonts.css.
3. Токен-слот + gen:tokens + drift.
4. Тесты (ре-скоуп инварианта + новый пакетный тест).
5. Доки-секция → полный прогон → упавшие = ожидаемое множество →
   явное удаление → re-mint → полный прогон GREEN.
6. Гейты → коммит (после зелёного вердикта базы 827f0c6) → push → CI.

## Implementation Notes

- **Конвейер:** CTAN xcharter.zip 1.26 → opentype/{Roman,Italic,Bold,
  BoldItalic}.otf → woff2 (fonttools 4.66.1 в /tmp/fonttools-venv, PEP 668
  обходит; flavor-конверсия, сабсеттинга нет). Размеры:
  400=77016 / 400italic=65928 / 700=68812 / 700italic=59296 байт.
  Оригинальный charter.zip (Type1, 228 глифов, латиница) — разведан, НЕ
  бандлится: кириллицы нет (cmap-проверено) — сам факт стал основанием
  рулинга XCharter.
- **Пакет:** см. manifest (files: fonts/, fonts.css, LICENSE,
  LICENSE-FONTS.md, README.md; exports ./fonts.css + ./fonts/* + оба
  LICENSE-файла). `pnpm install` пересчитал workspace = 9 проектов,
  lockfile НЕ изменён (у пакета нет зависимостей).
- **Токен-слот:** источник = DESIGN.md (typography.font-reading) с
  контекст-комментарием 18.3; реген `pnpm gen:tokens:tj` (корневой
  `gen:tokens` — банковский; правило «корневой gen НЕ покрывает gen:tokens
  — оба» соблюдено); diff артефактов = 1 строка слота в каждом из
  tokens.css / tokens.ts / TOKENS.md.
- **Тесты:** инвариант тройки НЕ скоупился шире (скан и был
  packages/tj-tokens — заново проверено чтением); правки: шапка-комментарий
  (18.3 amendment), FROZEN_FONT_READING перезаморожен XCharter-первым,
  новый describe «ТЖ fonts carrier» (3 теста: бинарники+манифест,
  fonts.css-контракт, LICENSE-FONTS-пины). Fix по ходу: подсчёт активных
  @font-face НАДО делать после стрипа комментариев — наивный регэксп
  ловил закомментированный Graphik-рецепт (5 вместо 4, red→green).
- **Доки:** секция «Шрифты» ТЖ getting-started переписана под модель 18.3
  (бандл XCharter / рецепт Graphik / zero-fonts тройки / пин харнесса
  Inter+PT Serif сохранён); доки пересобраны ДО прогона (ловушка: ран
  без `pnpm --filter pillkit-docs build` сравнивает против стейл dist —
  первый запуск остановлен и перезапущен).
- **База:** CI 36709057024 (18.2, head 827f0c6) = **success** — коммит
  18.3 разрешён (AC-9).

## Verification

- `pnpm vitest run tests/tj-fonts-policy.test.ts` → **7/7 passed**
  (4 инварианта тройки + 3 carrier-теста; фикс регэкспа см. Notes).
- Полный compare-прогон (после пересборки доков): **2123 passed (12.7m),
  exit 0 — упавшее множество ПУСТО.** Гипотеза «4 PNG» опровергнута
  фактом: оба дельта-набора (tj-getting-started секция-абзац;
  tj-token-reference--typography +1 слово в ячейке) суб-пороговы против
  `maxDiffPixelRatio: 0.015` — тот же исход, что у 18.1. По закону
  «базлайны ниже 1.5% не перезаписываются» re-mint ОТМЕНЁН; обе пары ног
  зелёные против действующих базлайнов.
- Гейты: build / test / lint / typecheck EXIT 0 (root vitest 20 файлов /
  **200 passed** — было 198+2 red до регистрации пакета; пакеты:
  tokens 17 / tj-tokens 4 / tj-components 247 / tj-react 19 /
  components 713 / react 70). check:gen zero-drift (CEM+wrappers
  регенерированы байт-в-байт); check:tokens-drift (банк) zero-drift;
  check:tokens-drift:tj — exit 1 ровно на делиберейт-диффе слота vs HEAD
  (дизайн чека до коммита; реген байт-стабилен, после коммита чек зелёный).
- **Регистрация пакета (гейты поймали, AC-6):** ad4-matrix.mjs (PACKAGE_DIRS
  + ALLOWED_SPECIFIERS: tj-fonts [] , docs += pillkit-tj-fonts;
  SCAN_ROOTS tj-fonts ['.']; CANONICAL_DIRECTIONS += tj-fonts) → README-пин
  синхронно; zero-hardcoded: KNOWN_PACKAGE_DIRS + SCAN_ROOTS (fonts.css
  в FR-1-сети, чист по содержимому), «seven»→«eight». Структурный бонус:
  тройка ТЖ теперь НЕ МОЖЕТ импортировать носитель (forbiddenGroups
  выводится из PACKAGE_DIRS) — граничный близнец zero-fonts-теста.
