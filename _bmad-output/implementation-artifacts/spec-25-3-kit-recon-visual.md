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

## Execution record (2026-10-04)

- **Surfaces (AC1).** PLAN.md написан ДО первого минта и закоммичен в
  этом же коммите (yaml-fence потребляется `recon/visual.mjs`).
  Итоговый набор: 10 китов × 2–4 поверхности × 2 темы = **51 PNG**
  (antd 5, taiga 7 — глубже якорем; shoelace/radix/shadcn/mui по 6–8).
  Четыре план-правки по ходу честно задокументированы в NOTES.md
  (spectrum path-дискавери, polaris site-retirement, radix без Button,
  taiga/gallery).
- **Themes (AC2).** Dark через `emulateMedia({colorScheme})` —
  реальная media-фича, не инжект — с пост-проверкой минимальной
  люминации непрозрачных фонов root/body ≤ 0.5. Настоящие дарки: 7
  китов; честные light-only с записью в journal: carbon, mantine,
  spectrum. Два ложных дарка (antd-button, taiga-gallery) пойманы
  паспортным аудитом (identical mean/std) и удалены ЯВНЫМ `rm`;
  antd-gallery-dark оставлен с пометкой «частичный».
- **Determinism (AC3).** 1280px fullPage, domcontentloaded + 2500ms
  settle, имена `<kit>-<surface>-<theme>.png` — см. PASSPORTS.md
  (51 строка: dims/bytes/mean/std).
- **Review mold (AC4).** 10 композитов (4×560px колонки) → vision-кропы
  верхних 2500px → **1 vision-чтение на кит = 10 total; бюджет ≤2/кит
  превышен нигде**. Все 10 подтверждены: реальные доки, темы
  дифференцированы.
- **Artifacts (AC5).** `.playwright-cli/verify/kit-recon/`: 51 PNG +
  10 composite + 10 vision + PLAN/PASSPORTS/NOTES + journal.json.
- **Gates (AC6).** `pnpm -w lint` EXIT 0 (после удаления мёртвого
  execFile-импорта в visual.mjs), `pnpm -w typecheck` EXIT 0,
  `pnpm test` — 21 файл, **221/221 passed**; `git status` не показывает
  дрейфа сюиты (tests/ не тронуты).
- **Нарушения (честно, подробно в NOTES.md).** (1) Закон минтов
  нарушен механически: `--only`-перезапуски переминтовали 12 уже
  существовавших PNG без явного `rm` (те же поверхности, те же
  настройки — но правило есть правило, записано, а не оправдано).
  (2) journal.json перезаписывается каждым прогоном — в коммите только
  финальный `--only spectrum`-этап; полный рекорд кампании =
  PASSPORTS.md + NOTES.md. (3) Баг люминации `rgba(0,0,0,0)`→«чёрный»
  был причиной первых ложных дарков — исправлен alpha-aware парсингом
  (тест `luminance('rgba(0, 0, 0, 0)') → null`).
- **Носитель.** ~85 МБ PNG в репо (51 панель + 10 композитов + 10
  vision-кропов) — решение рулинга «снапшот в репо (НЕ CI-cron)»,
  осознанно.
