# Spec 18.2 — consumer-surface freshness: README tag/traps + getting-started pin (post-v5 docs round)

- **status:** EXECUTED 2026-09-30 (orchestrator; docs + one rendered story + 2 baselines)
- **baseline_commit:** `0c88291` (18.1-фикс голова; **CI run 36705793707 =
  success** — вердикт по API ПОСЛЕ факта, коммит 18.2 поверх зелёной базы)
- **executor:** orchestrator (docs-правки + точечный реминт; субагенты не нужны)

## Контекст (почему сейчас)

v1.4.0 ВЫПУЩЕН (тег + Flow-A). Три находки окна требуют переноса на
потребительские поверхности:

1. **README пинит `v1.3.0`** (строка ~51 «пинуйте релизный тег») — устарел
   на тег; свежий потребитель должен клонировать v1.4.0.
2. **Ловушка devEngines** встречена ДВУМЯ релизными гейтами: `pnpm init`
   (v12) пишет `devEngines.packageManager` с caret-спекой, которую
   `pnpm add` затем отвергает (v1.2.0 гейт — RELEASE §9.4-запись;
   v1.4.0 Flow-A — §11.4, `verify/v140-fresh-clone/NOTES.md`; фикс —
   удалить блок по ключу, JSON-безопасно). Штамп v1.4.0 прямо помечает
   её «README quick-start note candidate». В README её НЕТ — каждый
   новый потребитель будет падать на шаге 3 рецепта.
3. **`--prefer-offline`**: деградированный/медленный реестр зависает на
   resolve установке кита; `--prefer-offline` (общий стор) решает
   (v1.4.0 Flow-A NOTES, 340 мс против зависания). Ситуативный тип.

Плюс свип показал: банковский getting-started (РЕНДЕРИТСЯ, базлайн)
пинит `v1.0.0` (`getting-started.stories.ts:195–196`) — устарел на ПЯТЬ
тегов. Исторические ссылки в том же файле (гейт v1.1.0; «первый —
v1.0.0») — факты, НЕ трогаются. ТЖ-getting-started пинов тегов не несёт
(проверено grep-ом).

## AC (frozen)

1. **README.md:** пин тега `v1.3.0` → `v1.4.0` (строка ~51, оба
   вхождения в скобках команды clone/checkout); после bash-блока
   быстрого старта — примечание-ловушка devEngines (2–4 строки RU:
   pnpm v12 `pnpm init` пишет caret-спеку `devEngines.packageManager`,
   которую `pnpm add` отвергает; удалить блок `devEngines` из
   package.json по ключу ДО `pnpm add`; найдено релизными гейтами
   v1.2.0 и v1.4.0, пруф — `verify/v140-fresh-clone/NOTES.md`).
2. **README.md, тип-строка:** на строке установки кита
   (`pnpm install` в checkout'е) — скобка-подсказка `--prefer-offline`
   при медленном реестре (одна строка, ситуативная).
3. **`packages/docs/src/getting-started.stories.ts`:** `v1.0.0` →
   `v1.4.0` ровно в 2 местах (clone --branch / checkout, строки
   ~195–196); исторические ссылки НЕ тронуты; контент RU, мета EN.
4. **Базлайны:** РОВНО пара банковского getting-started
   (`visual-getting-started--page-{light,dark}-1-chromium.png`)
   переминтована (PNG удалены ЯВНО → update scoped); ТЖ-пара НЕ
   тронута; после реминта — ПОЛНЫЙ локальный compare-прогон 2123/2123
   GREEN (практика 17.3: после любого изменения собранного дерева —
   полный ран, не scoped).
5. **Генерация:** css.ts/jsdoc НЕ меняются → `pnpm gen` ожидаем
   zero-diff (проверить).
6. **Гейты:** build/test/lint/typecheck EXIT 0.
7. **Коммит:** pathspec (README.md, getting-started.stories.ts, 2 PNG,
   этот спек); conventional EN; CI-вердикт — по run id ПОСЛЕ факта;
   в память окна (практика 17.5 — рекурсивных штамп-коммитов не заводим).

## Story Flow

1. README ×3 правки (пин, devEngines-примечание, prefer-offline-тип).
2. getting-started.stories.ts правка пина.
3. `pnpm --filter pillkit-docs build` → явное удаление 2 PNG → scoped
   update → полный compare-прогон.
4. Гейты + gen-дрифт.
5. Вердикт базы (36705793707) → коммит 18.2 → push zero-in-flight →
   CI-вердикт по run id.

## Implementation Notes

- README ×3 правки: пин v1.4.0 (оба вхождения), примечание-ловушка
  devEngines после bash-блока (тело — pnpm v12 caret-спека → `pnpm add`
  отвергает → удалить блок по ключу; гейты v1.2.0 + v1.4.0, пруф-путь),
  тип `--prefer-offline` хвостом-комментарием на строке установки кита.
- getting-started.stories.ts: ровно 2 вхождения `v1.0.0` → `v1.4.0`
  (строки 195–196); исторические ссылки (:213 гейт v1.1.0, :347
  «первый — v1.0.0») не тронуты. ТЖ-getting-started пинов не несёт
  (grep-пусто) — не тронут, его базлайны стабильны.
- Ребилд доков → 2 PNG удалены ЯВНО → scoped update: 2 passed, обе
  написаны; `git diff --stat` по tests/visual/ = ровно 2 целевых PNG
  (498965→499136 / 528209→528410 байт).
- `pnpm gen` — ZERO drift (единственный packages/-дифф = сама стори;
  AC-5 ✅). Gen запускался ПАРАЛЛЕЛЬНО визуальному прогону — безопасно:
  gen не пишет в serviced docs/dist (урок 6.3/7.1 о конкурентном
  касании дерева не нарушен; root `pnpm build` до конца визуального
  прогона ОТЛОЖЕН).
- Порядок ожидания: полный compare 2123 + CI-вердикт базы 36705793707.

## Verification

- Полный compare-прогон с переминтованной парой: **2123/2123 passed
  (12.2 мин), exit 0** — ТЖ-пара и все прочие эталоны стабильны; дифф
  tests/visual/ = ровно 2 целевых PNG.
- Гейты: `pnpm build` OK (docs build Done); корневой `pnpm test` 197/197;
  `pnpm -r test` — пакеты GREEN (tj-react 19, components 713, react 70 +
  остальные по списку); lint EXIT 0; typecheck EXIT 0.
- Gen: zero drift (см. Notes).
- Коммит pathspec: README.md, getting-started.stories.ts, 2 PNG, спек —
  после зелёного вердикта базы (ран 36705793707); CI-вердикт 18.2-головы —
  по run id ПОСЛЕ факта, в память окна.
