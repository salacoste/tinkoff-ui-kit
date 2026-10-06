# Spec 27.2 — docs-freshness: свип фактических устареваний

- **status:** DRAFT → frozen при открытии эпика
- **epic note:** Epic 27, brief `brief-epic-27-quality-window-2026-10-06.md`
  (наблюдение R3 batch-confirm v1.8.0).

## Story

As a kit reader, I want the docs' visible counters and roster claims to
match the actual 55-component kit,
So that the getting-started page stops advertising the v1-era roster.

## AC (frozen)

1. **Точечные правки-источники (подтверждены firsthand):**
   `packages/docs/src/getting-started.stories.ts:313` «Девятнадцать
   компонентов кита — от кнопки до модального окна.» → фактическая
   формула банка 45 (от кнопки до терминального тикета);
   `:342` «все 27 компонентов (19 v1 + 8 v2)» → «все 55 компонентов
   (45 банк + 10 ТЖ)». RU-проза, базлайно-чувствительно (обе строки
   рендерятся на странице).
2. **Свип пользовательских доков:** README.md (корень), CONTRIBUTING.md,
   packages/*/README.md, док-стори прозы — grep счётчиков и заявлений
   состава/размеров (паттерны «\d+ компонент», «\d+ Lit», «врапперов»,
   счёта сюит/тестов). Править ТОЛЬКО фактически неверные значения на
   сверенные каталогами/CEM (молд v1.7.0-prep счётчикового свипа);
   исторические записи (CHANGELOG, RELEASE.md, HANDOFF.md, спеки,
   NOTES-пруфы) НЕ ретро-правятся.
3. **Базлайны:** getting-started--page ×2 — ЯВНЫЙ rm → scoped remint
   (молд 19.2: прямой `pnpm exec playwright test -g`, git status пруф
   ровно 2 PNG); полный compare сюиты; axe.
4. **Гейты:** полные (gen → build → test → lint → typecheck → visual);
   commit EN conventional; CI-вердикт после факта.

## Change Log

- **2026-10-06 (pre-execution).** Р3 firsthand-подтверждён grep'ом
  (строки 313/342); остальных кандидатов свипа — по факту исполнения,
  каждое исправление с источником истины в триаже.
