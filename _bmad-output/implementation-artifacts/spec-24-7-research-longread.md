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
