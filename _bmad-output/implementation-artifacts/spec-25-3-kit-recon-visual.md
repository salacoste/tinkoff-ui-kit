# Spec 25.3 — визуальный референс: скриншот-галереи доков (kit recon)

- **status:** DRAFT 2026-10-04 (AC frozen по форме; список страниц —
  по итогу 25.2)
- **baseline_commit:** ff0e423
- **epic note:** Epic 25, brief `brief-epic-25-kit-ecosystem-recon-2026-10-04.md`
  (Решение 2 — класс «визуальный референс»; Playwright-слой).

## Story

As a kit maintainer, I want a screenshot reference of each roster kit's
docs (component gallery + representative component pages, both themes
where the kit exposes them),
So that visual language comparisons rest on captured evidence instead
of memory.

## AC

1. **Поверхности.** На кит: (а) страница-галерея/индекс компонентов;
   (б) 2–3 представительные страницы компонентов (якорь Taiga —
   глубже: тикет/форма/таблица-класс). Список фиксируется в
   `.playwright-cli/verify/kit-recon/PLAN.md` до первого минта.
2. **Темы.** Обе темы, где кит их даёт (параметр/тумблер доков);
   light-only — честная запись «dark недоступен», НЕ инжектить свой
   фильтр (чужой кит не перекрашиваем).
3. **Детерминизм.** Viewport 1280px, full-page; шрифтовой пин НЕ
   применяется (чужие доки — фиксируем как есть); имена
   `<kit>-<surface>-<theme>.png`.
4. **Ревью-молд.** IM-паспорт (dims/mean/std) на каждый PNG; композит
   на кит (4×560px колонки, урок 24b); ≤2 vision-чтений на кит;
   все честные превышения записываются.
5. **Артефакты.** `.playwright-cli/verify/kit-recon/` (PNG + паспорта
   + NOTES.md с решениями по страницам); коммит pathspec'ом.
6. **Гейты.** lint/typecheck EXIT 0 (скрипт скриншотов —
   `recon/visual.mjs`, dev-only); CI-вердикт; сюита кита не тронута
   (никаких базлайнов tests/visual не меняется).

## Out of scope

Пиксельные сравнения между китами (численные диффы — 25.4); DOM-дампы
чужих доков (не заявлены брифом).

## Verification (план)

- PLAN.md предшествует минту; каждый PNG имеет паспорт;
  light/dark-полнота сходится с записями о доступности тем;
- `git status` после прогона не показывает дрейфа сюиты.
