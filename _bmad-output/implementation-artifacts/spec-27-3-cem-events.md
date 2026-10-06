# Spec 27.3 — CEM events depth: аудит (фаза A) + add-вердикты

- **status:** EXECUTED (фаза A) 2026-10-06 — отчёт
  `planning-artifacts/kit-events-audit-2026-10/REPORT.md`; фаза B
  вынесена в spec-27-4 (DRAFT — решение мейнтейнера)
- **epic note:** Epic 27, brief `brief-epic-27-quality-window-2026-10-06.md`
  (BENCHMARK finding #10 watch: 0.4 events/компонент против shoelace 1.9).

## Story

As a kit maintainer, I want an evidence-based verdict per interactive
atom on whether its CEM event surface is complete,
So that the events-depth gap closes where consumers actually hit it —
not by cargo-culting shoelace's 1.9 average.

## AC (frozen)

1. **Механический аудит (машинный, фаза A).** Сверка «код эмитит ↔ CEM
   декларирует» по всем 49 кастомным элементам: `new CustomEvent<Т>(…)`
   (generic-форма!) vs `events[]` манифеста. **Предварительный итог уже
   снят оркестратором: 18/18 эмиттеров декларированы — механика чиста**;
   в отчёт честно записать и атрибуционный баг самого аудита (файл
   суб-элемента мапился на родительский каталог — accordion-item →
   tk-accordion; исправлен preferred-file-name маппингом).
2. **Семантическая матрица (фаза A).** Каждый интерактивный zero-event
   атом (carousel, toast, data-table, stepper, navbar, button, link,
   chart, progress-bar, avatar, breadcrumb, …) — строка: какие события
   ждёт паттерн потребителя / APG / shoelace-парity, есть ли
   ПОТРЕБИТЕЛЬСКАЯ УЛИКА в ките (workaround-директивы, контроллерная
   слепота), вердикт add/refuse. Правило: **§9-события добавляются
   только там, где потребитель кита уже упёрся** (CONVENTIONS §9:
   «только где паттерн требовал»), shoelace-парity сам по себе НЕ
   основание.
3. **Кандидаты с уликами (вход фазы B, не этой спекой):**
   - tk-carousel `page-change` — улика: паттерн 24.8 (бесконечная
     лента) городил DriveFirstAppend-директиву именно из-за отсутствия
     события;
   - tk-toast жизненный цикл (hide/show по авто--dismiss) — улика:
     потребитель не может узнать, что тост ушёл (контроллер AD-12).
   Оба — add-кандидаты; data-table/stepper/button/link/navbar —
   ожидаемый refuse (нативная навигация/статичность, улик нет).
4. **Выход фазы A:** `_bmad-output/planning-artifacts/
   kit-events-audit-2026-10/REPORT.md` (механика + матрица + вердикты +
   cross-ref BENCHMARK #10); коммит доков-артефактом, CI. Фаза B
   (реализация add-вердиктов: события + §9-молчание-первого-рендера +
   CEM + React-пропсы + event-map + api-стори реминты по уроку 26.1) —
   отдельным решением по отчёту, следующими окнами.

## Change Log

- **2026-10-06 (pre-execution).** Аудит-скрипт оркестратора: regex
  `new CustomEvent(?:<[^>]*>)?\(` (generic-форма обязательна — без неё
  16 из 18 эмиттеров невидимы); stories-файлы исключены (fs-paint-first/
  pf-drive-first — стори-механика, не API компонентов).
