# Kit events audit — фаза A (механика + семантические вердикты)

**Дата:** 2026-10-06 · **Спека:** `spec-27-3-cem-events.md` (Epic 27) ·
**Контекст:** BENCHMARK Epic 25 finding #10 (watch): events-поверхность
CEM 0.4/компонент против shoelace 1.9.

## 1. Механический аудит: код эмитит ↔ CEM декларирует

Метод: `new CustomEvent(?:<[^>]*>)?\(\s*['"]([a-z0-9-]+)['"]` по всем
не-тест/не-stories `.ts` в `packages/components/src` (generic-форма
обязательна — без неё 16 из 18 эмиттеров невидимы); атрибуция файла к
тегу по ИМЕНИ ФАЙЛА прежде каталога; сверка с `events[]` манифеста.

**Итог: 18/18 эмиттеров декларированы в CEM полностью — механических
пробелов НЕТ.** Разрыв против shoelace — не забытые декларации, а
меньшее ЧИСЛО событий (18 компонентов с событиями из 49; 31 — ноль).

| Компонент | code | CEM |
|---|---|---|
| tk-accordion-item | open-change | ok |
| tk-checkbox | checked-change | ok |
| tk-combobox-search | value-change | ok |
| tk-cookie-banner | consent-choice, open-change | ok |
| tk-filter-chips | value-change | ok |
| tk-input | complete, value-change | ok |
| tk-menu-popover | open-change, select | ok |
| tk-modal | open-change | ok |
| tk-note | open-change | ok |
| tk-pagination | load-more, page-change | ok |
| tk-range-slider | value-change | ok |
| tk-segmented-radio | value-change | ok |
| tk-select | open-change, value-change | ok |
| tk-switch | checked-change | ok |
| tk-tabs | value-change | ok |
| tk-textarea | value-change | ok |
| tk-thumbnail-picker | value-change | ok |
| tk-tooltip | open-change | ok |

**Честная запись об уроках самого аудита:** (1) первый регэксп без
generic-группы показывал ложно «почти пусто»; (2) первая атрибуция
мапила файл суб-элемента на родительский каталог (accordion-item.ts →
tk-accordion) и давала ложный «пробел» — исправлено preferred-file-name
маппингом; (3) стори-файлы исключены (fs-paint-first / pf-drive-first —
стори-механика директив, не API компонентов).

## 2. Семантическая матрица: интерактивные zero-event атомы

Правило вердиктов (CONVENTIONS §9 + BENCHMARK #10): **событие
добавляется только там, где потребитель кита уже упёрся**; shoelace-
парity сам по себе основанием НЕ является (их 1.9/компонент — во многом
lifecycle-события show/hide/hide-after на каждом оверлее; наш закон
строже намеренно).

| Атом | Интерактивность | Улика потребителя | Вердикт |
|---|---|---|---|
| tk-carousel | да (шевроны page-step ±clientWidth, точки-клик) | **ДА — паттерн 24.8 (бесконечная лента) городил DriveFirstAppend-директиву из-за отсутствия page-change** | **ADD `page-change` (P1, фаза B)** — detail: индекс/прогресс страницы, §9-молчание первого рендера |
| tk-toast | да (авто-dismiss контроллера `show.ts`, AD-12) | Слабее: in-kit стори fire-and-forget не упёрлись; но потребитель не может узнать об авто-скрытии — контроллерная слепота | **ADD-кандидат lifecycle `hide` (P2)** — финальный состав (hide / show+hide) решается в фазе B по тестам контроллера |
| tk-data-table | roving-фокус; строки = якоря (нативная навигация) | нет | REFUSE |
| tk-stepper | дисплей-only (0 click/keydown в коде) | нет | REFUSE |
| tk-navbar | статичный хром + якоря | нет | REFUSE |
| tk-button / tk-link | нативные click/focus | нет | REFUSE |
| tk-chart / tk-avatar / tk-breadcrumb / tk-progress-bar / tk-figure / tk-skeleton / tk-rating / tk-kv-list(-item) / tk-badge / tk-quote-chip / tk-publisher-header / tk-instrument-hero / tk-promo-card / tk-service-card / tk-feature-card / tk-footer / tk-article-card / tk-store-badges / tk-qr-block / tk-empty-state | stateless/дисплей | нет | REFUSE (корректно без событий) |
| tk-accordion (контейнер), tk-menu-item, tk-menu-divider | события живут на правильных элементах (item / контейнер menu-popover) | нет | REFUSE (пере-атрибуция не нужна) |

## 3. Итог фазы A

- Механика CEM чиста — углубление = ОДИН P1 (carousel `page-change`) +
  один P2 (toast lifecycle). Разрыв с shoelace закрывается точечно, не
  валом: закон «§9 только где требовалось» подтверждён аудитом как
  работающий (17/18 существующих событий посажены ровно на паттерны).
- Объём фазы B мал (два атома): события + §9-гарды + CEM-докстроки +
  React-пропсы + event-map + юниты; api-стори carousel/toast НЕ
  затронуты (события не растят CEM-таблицы атрибутов — но манифест
  дельтает, реминт api-стори по уроку 26.1 на всякий случай
  предусмотреть).
- Кросс-реф BENCHMARK #10: watch-статус снять после фазы B.
