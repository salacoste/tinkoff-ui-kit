# Spec 26.3 — tk-avatar: круглый носитель личности

- **status:** EXECUTED 2026-10-05 (code head `8452765`, CI GREEN run 37310061402)
- **baseline_commit:** 3e27649
- **epic note:** Epic 26, brief `brief-epic-26-form-control-wave-2026-10-05.md`
  (аудит-вердикт «в волну»: заземлён трижды — tj byline 20px,
  tj news 45px (замер 20.1), admin-фид круглые).

## Story

As a kit consumer, I want a round avatar atom (image/initials/
placeholder) covering byline/news/admin-feed registers,
So that author rows stop hand-rolling circles.

## AC

1. **Контракт.** `src` (изображение), `name` (источник инициалов +
   aria-label при отсутствии слота), `size` (px-строка, молд skeleton:
   host inline style; дефолт 45 — news-замер 20.1). Слот — контентная
   обёртка поверх (молд service-card) для статус-точек потребителя.
2. **Три состояния.** image (object-fit cover, loading=lazy — молд
   tk-figure lazy-энфорсмент; decode-fail → initials), initials
   (первые инициалы `name`, верхний регистр, обрезка до 2), placeholder
   (плоский токен-фон без содержимого — tj-composer-плейсхолдер).
3. **A11y.** role=img self-assert + aria-label = `name` (закон React
   19: атрибуты из connectedCallback, не ctor); decorative-режим
   (`aria-hidden` свойством) для повторов в рядах (админ-фид:
   первый озвучивает, остальные скрыты — паттерн потребителя).
4. **Визуал.** Круг радиусом 50%; фоны — токен-семейство surface/
   gray; инициалы — text-secondary; хуки `--tk-avatar-{size,bg,fg}`
   (size продублирован property — хук для консюмер-темы); БЕЗ
   статус-кольца (потребительский оверлей — слотом).
5. **Полный цикл FR-16.** Юниты (инициалы из name, lazy-атрибут,
   aria-пины, decode-fail фолбэк); CEM → React Avatar; стори RU:
   byline 20 (news-ряд) + 45 (новостная карточка) + админ-фид
   (транзакции, вымышленные имена); базлайны light/dark;
   hidden-guard 54→55; ростер; event-map — STATELESS (no-entry, молд
   tk-rating).

## Out of scope

Avatar-группы/стеки; статус-точки; загрузка blob; кропперы.

## Verification (план)

- юнит-пины: aria-label из name; initials «Мария Оганова»→«МО»;
  img loading=lazy присутствует;
- полный visual compare: только новые базлайны.

## Execution record

- **Атом** (`packages/components/src/avatar/`): три ПРОИЗВОДНЫХ состояния
  (stateless-рулинг tk-rating — состояние не хранится): image (внутренний
  img, object-fit cover, `loading=lazy` + `decoding=async` — энфорсмент
  tk-figure), initials (первые буквы первых двух пробельных слов,
  верхний регистр: «Мария Оганова»→«МО», одно слово → первая буква),
  placeholder (плоский диск без содержимого). Decode-fail → тихий фолбэк
  на инициалы (private-лэтч + явный requestUpdate — домолд кита: @state
  нигде в дереве нет, поле не попадает в CEM); новый src сбрасывает лэтч.
- **A11y (AC3):** именованный диск самостийно ставит `role="img"` +
  `aria-label=name` из connectedCallback (закон React 19; идемпотентный
  ре-ассерт, молд tk-rating) и пересчитывает имя в willUpdate. БЕЗЫМЯННЫЙ
  диск атом не трогает: контракт потребителя (хостовый aria-label или
  отражаемое свойство `aria-hidden` — паттерн повторов админ-фида).
  Слепой role=img без имени = axe-нарушение — роль едет на имени, не на
  теге; снятие имени отзывает ровно своё (consumer-атрибуты не трогаются,
  флаг #identityOwned). Слот-оверлей декоративен (aria-hidden на обёртке,
  молд service-card) — статус-точки остаются контентом потребителя (AC4,
  кольца в атоме НЕТ).
- **Геометрия:** `size` пишет host inline custom property
  `--tk-avatar-size` (вариант skeleton-молда: один канал ведёт И короб,
  И кегль инициалов — переопределение не может их рассинхронить; снятие =
  removeProperty, дефолт 45 — замер 20.1 возвращается). Хуки
  `--tk-avatar-{size,bg,fg}` ровно три из AC4; фон surface-muted,
  инициалы text-secondary, глифы 0.4× размера (45→18). Private-поле
  `#imageFailed` вместо @state (TS1206 на private-декораторах + домолд).
- **Тесты:** юниты 12 (регистрация; три состояния; initials-математика
  включая обрезку до 2 и ±пробелы; identity-штамп + переименование;
  отзыв своего; decode-fail фолбэк + сброс лэтча; геометрия-канал;
  aria-hidden reflect; слот-оверлей; stateless-пины; CSS-структурники).
  Функциональный visual-spec не заводился — атом stateless, у Chromium
  нечего доказывать (у 26.2 FormData/Enter требовали живой движок).
- **React/гварды:** Avatar — 49-й враппер (CEM → генератор, typefix
  `ariaHidden: string | null` под базу LitElement); event-map STATELESS
  no-entry комментарий (молд tk-rating); hidden-guard 54→55 щитов /
  43→44 файла; component-search «Аватар»; entry-пин TkAvatar.
- **Стори:** 6 RU (Песочница/Варианты/Новостной ряд — byline 20 +
  карточка 45/Админ-фид с aria-hidden-повторами/Доступность/API).
  Изображения — data-URL SVG на ИМЕНОВАННЫХ цветах (молд tj-rail/
  store-badges: ни сети, ни hex-литералов); decode-fail демо указывает
  на несуществующий путь — реальный 404 гоняет живой error-pipeline.
  Имена, заголовки, суммы — вымышленные (ПД-гейт).
- **Гейты (локально):** gen zero-drift (перегенерация ПОСЛЕ правок
  докстрингов — урок 26.1 исполнен preemptively), build EXIT 0, юниты
  944 (components, +12) + 70 (react) + 221 (root) + 248/19/17/4 (tj),
  lint/typecheck EXIT 0.
- **Базлайны:** 12 PNG (6 стори × 2 темы), скоупед-минт из корня.
  Пиксель-санити без vision (бюджет 0/2 сохранён): жёлтый хук-диск +
  статус-точка = 1241px yellow-100; вертикальный профиль #616871 —
  кластеры глифов в дисковых зонах обоих рядов Вариантов (decode-fail
  упал в «СИ» — гонки с минтом нет: харнесс ждёт networkidle + decode()
  на каждом img).
- **Полный compare: 2669/2671, оба фейла — getting-started light/dark**:
  строка «Аватар» вырастила страницу 4307→4329 (+22px) — класс роста
  ростера (прецеденты 21.2/26.1/24b). Явный rm → скоупед-переминт ×2 →
  скоупед compare GREEN. Suite 2635→**2671** (+36 = 6 стори × 2 темы ×
  [visual+axe+reduced-motion]; функциональных нет — stateless).
- **CI VERDICT на `8452765`: GREEN — run 37310061402** (первый пуш,
  вердикт по API после факта, zero-in-flight соблюдён).
