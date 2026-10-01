# Spec 20.1 — ТЖ live-fidelity round: CTA r5, composer geometry, bar 70, article rhythm, news avatar 45

- **status:** EXECUTED 2026-10-01 (executor-субагент; линза-ревью CLEAN+2 NIT→
  patched; финальный полный compare 2182/2182 GREEN — Verification ниже)
- **baseline_commit:** `a52fdcc` (release-pages housekeeping; CI 36834950951 GREEN)
- **epic note:** нумерация 20.x — post-v1.5.0 фиксы. Grounding: двухвалидаторный
  live-fidelity аудит 2026-10-01 (`.playwright-cli/verify/tj-live-fidelity-audit-2026-10-01/`
  — NOTES.md с триажем §1–§6 И аддендумом §7 арбитража оркестратора).
- **executor:** субагент (frozen-спека; оркестратор триажит и штампует)

## Контекст (почему сейчас)

Подозрение мейнтейнера «размер кнопок, стилизация и отступы расходятся» →
аудит двумя валидаторами (A — живой t-j.ru computed+rects, 6 поверхностей;
B — авторская истина кита) + арбитраж оркестратора собственными probe'ами.
Итог арбитража (NOTES §7): **два из четырёх кандидатов §1 СНЯТЫ** (D2 чипы,
D4 подчёркивание — wrapper-artact-семейство ошибок измерения), остальные
воспроизведены построчно. К фиксу идут ТОЛЬКО пере-верифицированные
собственными замерами оркестратора пункты; решения по дрейфу §3 —
записаны ниже (adopt/hold).

**Пере-верифицированные числа (оркестратор, playwright-cli, read-only):**

| Пункт | Живое (замер оркестратора 2026-10-01) | Кит сейчас |
|---|---|---|
| D1 CTA radius | br**5** ×3 поверхности (98×30) | `--tj-radius-full` 9999 (tj-header.css.ts:200) |
| D3 композер | 760×**98**, br**25**, pad 24/**29**, аватар **50×50**, ghost 17/400 #808080 | r20-литерал, pad-inline 32, аватар 40 (h88) |
| Бар покоя | rect **70** (1280×70) | токен `--tj-space-header-h: 72px` |
| H1 статьи | computed `margin-bottom: 10px` (45/700 ✓) | `var(--tj-space-16)` (:234) |
| Зазор под H2 | rect **25px** до следующего блока | `var(--tj-space-24)` (:276) |
| News avatar (§3-adopt) | 45×45 (замер A; drift впереди пака 20) | `var(--tj-space-32)` |

## RETRACTIONS / HOLDS (frozen, НЕ трогать код)

- **D2 СНЯТ:** painted span чипа = Graphik **17/700** = кит; anchor-level
  16/400 — wrapper-artifact (закон TOKENS.md:87, второй случай). Кит прав.
- **D4 СНЯТ:** живой анкор `text-decoration-color: rgba(0,0,0,0)` в покое +
  пиксельный арбитр — штрих НЕ видим. Механика кита (transparent → 70%
  hover) = живое. probe10 реабилитирован.
- **HOLD home-карточки 25/30** (§2): не пере-пробировано, story-уровень,
  смежные пробы пали — отложить до следующего rubric-прохода.
- **HOLD /pro/ пилюли 40↔45/r20↔15** (§3): санкционированное AA-отклонение.
- **HOLD community грид 3-col↔1-col** (§3): пак 2026-09-28 заморожен.
- **HOLD H3 ink** (§3): в ките не рендерится — no-op.

## AC (frozen)

1. **D1 — tj-header CTA radius.** `packages/tj-components/src/tj-header/tj-header.css.ts:200`
   `border-radius: var(--tj-radius-full)` → `var(--tj-radius-cta)`;
   комментарий :170–175 («FULLY-ROUNDED 30px pill») переписать под тихий
   r5-контроль (живое br5 ×3 поверхностей, аудит 2026-10-01; формулировка
   леджера v1.4.0 «fully-rounded CTA pill» считается исправленной аудитом).
   `tj-header.test.ts:398` пин `--tj-radius-full` → `--tj-radius-cta`
   (computed-css пин остаётся). Прозу (tj-header.ts / stories.ts) sweep-grep
   по «пилюля/pill» применительно к CTA → выровнять под r5-язык; чипы
   остаются пилюлями (radius-chip 20 = 40/2 — не трогать).
2. **D3 — tj-composer геометрия.** `tj-composer.css.ts`:
   :35 `border-radius: 20px` (FLAG) → `var(--tj-radius-card)` (живое 25 =
   card-семейство, FLAG закрывается аудитом); :32 padding-inline
   `var(--tj-space-32)` → `29px` + FLAG (замер 2026-10-01, вне шкалы —
   литерал по закону prose-literal); :58–59 аватар `var(--tj-space-40)` →
   `50px` + FLAG (живое 50×50); комментарий вывода высоты: 24×2 + 50 = 98.
   `tj-composer.test.ts`: пин :214 radius → `var(--tj-radius-card)`;
   :215 padding → `var(--tj-space-24) 29px`; :217 avatar width → `50px`;
   :226 cardRule-пин (если зеркалит) → согласованно; любые пины высоты 88 → 98.
   Прозу stories sweep-grep «88/r20» → выровнять.
3. **Бар 70 — токен.** `_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md:215`
   `header-h: 72px` → `70px`; камент :210 «header h~72» → h70; проза :365
   «header ~72px» → 70. `packages/tj-tokens/scripts/generate.mjs:335`
   камент-строка «header h72» → «header h70». Регенерация `pnpm gen:tokens:tj`
   → tokens.css/tokens.ts/TOKENS.md перевыпускаются (руками НЕ править).
   Остаточный grep «h72\|72px» в ТЖ-деревях — пусто (контекст header).
   Потребитель один (tj-header.css.ts:59 grid-rows + пин теста :355 —
   оба остаются токен-ссылками, НЕ меняются).
4. **Article rhythm.** `packages/tj-components/src/patterns/article-page.stories.ts`:
   :234 `.tjart-title margin: 0 0 var(--tj-space-16)` → `0 0 10px` + FLAG
   (computed живое 2026-10-01); скелетон :389 `.tjart-sk--title
   margin-bottom: var(--tj-space-16)` → `10px` тем же FLAG (контракт
   zero-layout-shift живое↔скелетон); камент :391–393 «title's 16px gap» →
   10px. :276 `.tjart-article tj-prose h2 margin-block:
   var(--tj-space-40) var(--tj-space-24)` → `var(--tj-space-40) 25px` +
   FLAG (rect живое 25; встраивается в семейство prose-literal 25);
   камент :273–274 «(40/24 H2…)» → 40/25.
5. **News avatar 45 (ADOPT drift).** `tj-news-card.css.ts:87–93`
   `.byline__avatar` width/height `var(--tj-space-32)` → `45px` + FLAG
   (живое 45×45, drift впереди пака 20; кит следует живому — структурная
   метрика); каменты файла/компонента «avatar 32» → 45. Тест: пина
   геометрии аватара нет (aria-only :121) — добавить computed-пин 45px
   рядом с aria-пинами byline (та же строка теста).
6. **Генерация/гейты:** `pnpm gen` (CEM) ПОСЛЕ правок css.ts; корневая
   цепочка build/test/lint/typecheck EXIT 0; `pnpm test` ПОСЛЕ gen.
   Новых токенов НЕТ (29/45/50/10/25 — FLAG-литералы, минт запрещён
   prose-literal-законом).
7. **Реминт базлайнов (IRON RULE).** Полный compare-прогон сюиты на голове
   фикса → упавшее множество = РОВНО истории, рендерящие задетые элементы:
   ожидаемые семейства — header ×~10, rail ×~12 (хедер-хром + news-tiles),
   composer ×N, news-card ×N, article-page ×~6 (H1/H2 + news avatar),
   docs token-reference (72→70 строка). Нога ВНЕ прогноза → СТОП и репорт
   оркестратору. Каждый упавший PNG удаляется ЯВНО (`rm`) перед scoped
   `-g` update; ниже 1.5% не перезаписывается (тогда — юнит-пин истины);
   после реминта полный прогон GREEN.
8. **Коммит (оркестратор):** pathspec: 6 исходников + 3 теста + DESIGN.md +
   generate.mjs + сгенерированные токен-файлы + переминченные PNG +
   CHANGELOG `[Unreleased]` Fixed (5 строк: CTA r5 / composer geometry /
   bar 70 / article rhythm / news avatar) + Internal-строка аудита с двумя
   retraction-ями + протокол аудита (NOTES/DIGEST/TRUTH/JSON — БЕЗ PNG,
   vision-бюджет). Conventional EN; CI-вердикт по run id ПОСЛЕ пуша;
   zero-in-flight перед пушем.

## Story Flow

1. Executor читает NOTES.md (весь) + эту спеку; правки AC 1–5.
2. `pnpm gen` + `pnpm gen:tokens:tj` → drift-чек (дифф = ровно ожидаемые
   сгенерированные файлы).
3. Корневые гейты: build/test/lint/typecheck EXIT 0.
4. Полный visual compare → триаж упавших по прогнозу AC-7 → явное rm →
   scoped update → полный прогон GREEN.
5. Репорт оркестратору (что упало/переписано/отклонено) → линза-ревью →
   триаж-патчи (если) → ОРКЕСТРАТОР: CHANGELOG + коммит + пуш + CI-вердикт
   + штампы (CLAUDE.md story-log, HANDOFF, память).

## Out of scope (не открывать)

- Композер как `<a>`-карточка на живом (структурная перестройка кита) —
  зафиксировано в NOTES, компонент остаётся интерактивным инпутом.
- Ghost-текст композера (17/400 #808080) — сверить с китом на линзе;
  правка только если кит расходится (замер есть, кит-источник — исполнитель
  сверяет `::placeholder`-блок и фиксирует в репорте).
- Любой новый токен; любая правка `radius-chip`; D2/D4-поверхности.

## Implementation Notes (executed 2026-10-01)

- Исполнено executor-субагентом по AC 1–5; отчёт принят, выборочная сверка
  оркестратора по git diff — дословное соответствие замороженным числам.
- **Отклонения исполнителя (законные, триаж одобрил):** (a) DESIGN.md под
  `_bmad-output/` правился по букве AC3+AC8 — конкретное overpower общего
  «read-only» (аудит-протокол не тронут); (b) две правки за пределом списка
  строк AC4 — скелетон `sk--h2` 40/25 (:426–429) и Anatomy-проза (:744) —
  требуются контрактом zero-layout-shift, который AC4 сам цитирует;
  (c) фактические упавшие семейства меньше прогноза: rail 2/~12,
  article-page 2/~6 (anatomy/accessibility-ноги не рендерят геометрию
  задетых элементов — прошли), token-reference 0 — 2-глифовая текстовая
  дельта суб-1.5%, оставлена по закону (прецедент 5.4-F1; истина — в
  регенерированном токен-мапе + юнит-пины).
- **Линза-ревью: CLEAN + 2 NIT.** Оба — устаревшая стрелочная форма
  «72→56», которую регэксп спеки (`h72|72px`) структурно не мог поймать:
  tj-header.css.ts:12 (jsdoc-шапка) и tj-components/README.md:25 —
  запатчены оркестратором (70→56), повторный `pnpm gen` — дрейфа нет.
  Линза также подтвердила: генератор-закон соблюдён (70 идёт из
  DESIGN.md:215 через readFileSync, диффы tokens.* — value-only + зеркальный
  spacingIntro), CEM-дифф — ре-сериализация описаний (6 default + 10
  description keys), ноль новых `--tj-*`, skeleton↔live паритет точен,
  пины grid-rows/radius-chip не тронуты, pill-язык остался только у чипов.
- **Ghost-текст (Out-of-scope 2) — ратифицировано оркестратором: HOLD кита.**
  Размер/вес совпадают с живым (17/400 через card-title-токены); цвет —
  осознанное AA-расхождение: ghost = accessible name кнопки (essential
  text), живое #808080 на карточке = 3.949:1 = restricted reference-time
  ink; кит держит ink-300 #6E6E6E (5.099:1). Рулинг записан на месте
  декларации (.composer__label). Структурно: у кита нет ::placeholder —
  композер есть кнопка, ghost = content-узел.

## Verification

- Гейты: `pnpm gen` + `pnpm gen:tokens:tj` (дрейф = ровно ожидаемые
  сгенерированные файлы), build/test/lint/typecheck — все EXIT 0.
  Юниты: tj-components 247, components 751, tokens 17, tj-tokens 4,
  tj-react 19, react 70, корневой 200.
- Визуально, прогон 1 (compare, собранное дерево с фиксом): 2156 passed /
  26 failed — **все 26 внутри прогноз-объединения AC-7** (header ×8,
  composer ×4, post-card--community-pattern ×2, news-card ×6,
  patterns-rubric--demo ×2, article-page ×2, rail ×2), диффы 2–7%
  (ни одного суб-порогового среди упавших). Каждая из 26 PNG удалена
  ЯВНО → scoped `-g` re-mint по семействам (5 прогонов).
- Финальный полный compare: **2182/2182 passed, EXIT 0 (12.7 мин)**.
- Остаточные grep'ы: `h72|72px|72→` в ТЖ-деревях — пусто (стрелочная форма
  добавлена линзой после двух NIT).
- CI-вердикт коммита — по run id ПОСЛЕ пуша (записывается в штампы окна;
  рекурсивных штамп-коммитов своего же прогона не заводим — практика 19.2).
