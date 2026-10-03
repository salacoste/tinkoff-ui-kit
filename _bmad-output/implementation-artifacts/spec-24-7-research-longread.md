# Spec 24.7 — research-лонгрид + tk-figure (P8 + B6/A8; pattern wave 24a, ЕДИНСТВЕННЫЙ новый атом)

- **status:** DRAFT 2026-10-03 (AC frozen pending «go»; исполнения нет)
- **baseline_commit:** 331a246
- **epic note:** Epic 24, brief `brief-epic-24-pattern-wave-2026-10-03.md`
  (Решение 1 + Решение 5: A8 video-embed СЛИТ с B6 — один атом, две
  демонстрации).
- **grounding (ЧЕСТНО — два слоя):**
  - **B6/A8 атом tk-figure:** gap-8 research ×2 — review 55 + strategy
    24 iframe, canvas 0, tables 0: ВСЯ дата-визу живого лонгрида едет
    sandboxed iframe-эмбедами; кит имеет ноль figure/embed-видов.
    A8 (gap-5 web-terminal videos=5 + products-bonds 1; gap-1/3/7 по
    одному) — то же «captioned embed»-ядро. Слияние обосновано:
    один шейп (слот-носитель + подпись + lazy + aspect).
  - **P8 паттерн:** census-level, DOM-каптуры НЕТ (56k px страницы
    сняты full-page PNG + census). Byline/TOC/footnote детали
    UNVERIFIED (gap-8 flag) — в сторю входят только доказанные части:
    analyst-byline СЛОТ-строка (аналог ТЖ-рецепта), поток фигур,
    табы, закрывающая ИИР-приписка (молд 23.3 — формула, не ПД).
    Sticky-TOC/footnotes — ВНЕ скоупа до slice-пробы.
- **решение ростера:** АТОМ tk-figure (passive wrapper: media-слот
  (iframe/img/video), необязательная подпись (prop+slot, presence-молд),
  aspect-ratio хук, lazy для iframe (loading=lazy) и img (дефолт
  lazy+decoding=async — promo-card art-молд); STATELESS, zero events) +
  ПАТТЕРН-СТОРЯ «Исследование» (byline-строка → заголовок → lead →
  поток прозы (bank-регистры, НЕ tj-prose — gap-8: Charter-масштаб
  ложный инструмент) → tk-figure ×2 (чарт-вид + video-вид — двойная
  демонстрация слияния B6/A8) → табы секций → ИИР-note).

## AC (frozen)

1. **Атом tk-figure.** Catalog-атом полного цикла (молд 23.2): хуки
   `--tk-figure-{ratio,gap,caption}` с токен-дефолтами; юнит-тесты
   (aspect-контракт, lazy-атрибуты, presence-подписи, stateless
   event-map no-entry); CEM → React-враппер → docs search row;
   hidden-guard ростер.
2. **Паттерн.** Лонгрид на существующих атомах + tk-figure; byline —
   слот-композиция (аватар-диск publisher-header-молда НЕ реюзится
   без пина — простая строка консьюмера); заголовок h1; табы tk-tabs;
   ИИР tk-note.
3. **FR-1/PD.** Внутри стори — ВЫМЫШЛЕННЫЙ график/видео-плейсхолдер:
   НЕ живые URL эмбедов; tk-figure в демо несёт data-URI/SVG-заглушку
   или публичный neutral-ассет; текст исследования вымышленный.
4. **A11y.** figure/figcaption — родная семантика; axe обеих тем;
   h1/h2-порядок (AC4-молд 23.4); iframe title (если iframe-демо).
5. **Стори/базлайны:** атомные стори (playground/variants/api — молд
   каталога) + паттерн-сторя; полный compare зелёный; урок 23.4.
6. **Цикл.** gen (CEM + враппер + search) → гейты → pathspec →
   zero-in-flight → push → CI-вердикт → close-out штамп.

## Out of scope

- Sticky-TOC, footnote-блоки, детали byline (UNVERIFIED — census-flag,
  нужны slice-пробы живого), интерактивные чарты (23.1 out),
  видео-плеер как атом (B5 — не в волне), медиа-хостинг в ките
  (zero-media), тёмная инверсия research-страницы (нет заземления).

## Execution record (2026-10-03)

- tk-figure: пассивный figure-каркас слот-медиа (iframe/img/video) с
  опциональной подписью; аспект-бокс (--tk-figure-ratio, 16/9),
  радиус, muted-подложка, подпись presence-молдом (нет контента → нет
  figcaption-узла); lazy-энфорсмент (iframe → loading=lazy; img на
  любой глубине → lazy + decoding=async); STATELESS — event-map
  no-entry. Полный цикл: хуки, юниты, CEM → React Figure → docs
  search row, ростер пакета.
- Research longread: byline (обычная потребительская строка —
  avatar-диск publisher-header НЕ переиспользуется без пина), h1, лид,
  проза на BANK-регистрах (НЕ tj-prose — закон gap-8), стрим из ДВУХ
  figure (currentColor inline-SVG + video), секционные tk-tabs,
  закрывающая ИИР-нота (формула 23.3); медиа — нейтральные стабы, БЕЗ
  live-URL (ПД, zero-media).
- Линзы: research 1/2 + figure--playground 1/2, обе чистые; ниты —
  артефакты iframe-стаба носителя стори (Canvas прячет
  muted-подложку), не дефекты атома; паддинг атома един.
- ВОЛНА ЗАКРЫЛАСЬ ТРИПВАЙРОМ: CI 37142771921 RED — hidden-guard ростер
  50 → 51 (figure.css.ts вступил в семейство host-display щитов; сам
  :host([hidden]) guard на месте) — осознанный бамп пина 50→51 щитов /
  39→40 файлов, фикс ad8e93e → CI GREEN 37143064533. Второй латентный
  урок: pnpm-рекурсия падает на первом же пакете — react-нога (stale
  dist) вскрылась только ПОЛНЫМ локальным гейтом; правило: после
  нового компонента — rebuild dist + полный pnpm test до пуша.
- Минт: figure playground+api 4 базлайна + research 2, обе темы, axe
  GREEN.
- Эфир: fde2bc5 + ad8e93e, CI GREEN 37143064533, суита 2512/2512
  (счётчик: +6 ног на сторю-юнит × 10 юнитов волны = +60 к 2452).
  #94 completed. Волна 24a закрыта.
