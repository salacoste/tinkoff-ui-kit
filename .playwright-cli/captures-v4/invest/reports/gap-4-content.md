# Gap report 4 — invest content surfaces (5 pages, chunk 1)

Source: inv-gap-content agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census + slices (research, research/all, pulse/broadcast, pulse [×2 снимка], social-publish→pulse). 17 vision-analyzed segments, cross-checked with census. Read-only.

## 1. /invest/research/ — хаб «Аналитика» (census: buttons 93, links 618, tables 1, img 339, scrollH 5559)
- Мега-nav хедер + суб-nav «Обзор·Каталог·Пульс·Аналитика·Академия·Терминал» — COVERED — tk-navbar + tk-tabs underline.
- **Тикерная лента**: ~10 чипов (лого-монета · цена · Δ% зелёным/красным), горизонтальный скролл, обрезка краёв — **NEW-COMPONENT (tk-ticker-rail)** — серая полоса под суб-nav; в kit нет ни одного market-data примитива.
- Hero-карточка + 2-up ряд: иллюстрация, стопка pill-бейджей на медиа («Дайджест» тёмный + «Обзор» белый), дата-оверлей, заголовок поверх медиа — VARIANT → tk-article-card (media-overlay + badge-stack режим).
- «Последние новости»: 8 строк дата+жирный заголовок, разделители, без миниатюр — VARIANT → tk-data-table (typographic link-rows).
- «Стратегии»: карусель 3 карточки + круглый chevron «›» — VARIANT → tk-article-card; **хром карусели — NEW-PATTERN**; chevron-кнопки на 4+ секциях.
- Telegram-баннер: синий градиент, жёлтая pill «Подробнее», свечной арт — VARIANT → tk-promo-card.
- **Подкаст-карусель**: транспорт-бар поверх миниатюры (shuffle ⏮ ⏸ ⏭ repeat) — **NEW-COMPONENT (audio-player)**.
- **Таблица «Инсайдерские сделки»**: 5 колонок — Компания (аватар+имя+тикер), инсайдер (имя+роль), Тип сделки (**цветная ссылка** Покупка зелёная/Продажа красная), Дата, Объём (+субстрока «% портфеля») — VARIANT → tk-data-table (census tables:1 ✓).
- Видео-карусель: 16:9 + круглый play-оверлей + дата + заголовок — VARIANT → tk-article-card (video mode).
- «Инвестиционные идеи»: 2-up 50/50 насыщенные карточки (синяя/тёмно-красная): тикерный заголовок, **плавающий белый лого-бейдж**, «До 26,43% за 27 дней», мета-футер — VARIANT → tk-promo-card (idea/metric режим).
- Промо «Веб-терминал» — VARIANT → tk-feature-card.
- Футер — COVERED — tk-footer.

## 2. /invest/research/all/ — все публикации (census: tabs 8/tablists 1, links 201, buttons 27, scrollH 6891)
- Ссылка «‹ Назад» — COVERED — tk-link.
- **Pill-таббар**: «Все статьи» (активная: белая pill + жёлтая рамка-подсветка) / Обзоры / Словарь инвестора / Стратегии / Обучение / **«Еще ⌄»** (overflow-таб) — VARIANT → tk-tabs (pill-режим) + tk-menu-popover; census tabs:8 при ~6 видимых — 8-я сидит в «Еще» ✓.
- Сетка 3×N: ~37 карточек — миниатюра, 1–3 стекающихся бейджа (жёлтый primary + белый secondary), дата, заголовок 2–4 строки, обрезанный тизер; **без автора/времени чтения**; у подкаст-карточки инлайн audio-бар — VARIANT → tk-article-card (сегменты 9+12+9+7).
- CTA-баннер внутри сетки — COVERED — ad-slot recipe.
- **Гибрид пагинации**: большая pill «Показать ещё» + нумерация 1…25 + «Следующая →», активная — жёлтая pill — VARIANT → tk-pagination.
- Единственный input:1 census не виден (скрытый) — не гап.

## 3. /invest/pulse/broadcast/ — «Эфиры Пульса» (census: buttons 3, links 171, img 11, scrollH 2675)
- Каталог 3×N, 13 карточек: 16:9 плейсхолдер-арт (студия/микрофон), pill категории (Эфир/Вебинар/Разбор), дата, заголовок 2 строки — VARIANT → tk-article-card (broadcast режим, S). Logged-out нет LIVE-бейджа/ведущего/счётчиков/RSVP; нет пагинации — сетка кончается на 13-й.
- Футер — COVERED.
- Существенное: страница = переиспользование research-карточки под эфиры, собственной хром-анатомии нет.

## 4–5. /invest/pulse/ — лента + publish-снятие (census: buttons 55/54, links 209/209, inputs 2, img 80/78, scrollH 16898/16579)
- Лента: колонка ~600px по центру, без сайдбаров — VARIANT → ТЖ post-feed.
- Табы «Популярное/Новое/Мои» + красная точка на «Мои» — VARIANT → tk-tabs (уведомление-точка — мини-расширение).
- Композер-заглушка: pill-фейк-инпут «Что нового?» + карандаш + тулбар (фото/эмодзи/опрос) — VARIANT → ТЖ composer (card-button → open-compose), паритет почти 1:1; расширенное состояние logged-out НЕ открывается (проверено до 3684px + census-совпадение).
- Пост-карточка: аватар · ник · verified · pill «Подписаться» · относит. время · «⋯»-меню · тело с $TICKER/@/# синими тап-чипами · экшн-бар «Нравится»+счёт / «Комментировать» / share · ряды реакций — VARIANT → ТЖ post-card + пакет расширений («⋯» = tk-menu-popover COVERED).
- Вложения: одиночное фото; коллаж 2–3; медиа-карусель с бейджем «Еще 3»; **link-preview og-карточка (favicon+домен+title+desc) — NEW-COMPONENT**; коллаж/карусель — расширения post-card.
- Чипы инструментов, 3 формы: инлайн $TOKEN; мини-котировка (иконка + цена + Δ%); полоса 3–4 чипов («260,9 ₽ −0,12%») — NEW-COMPONENT (= кандидат №1 с research-хаба).
- Quote-repost: вложенная карточка-в-карточке — NEW-PATTERN (nested quote wrapper).
- Режим «АНАЛИТИЧЕСКИЙ ОБЗОР»: uppercase-eyebrow + заголовок + обложка + чипы котировок — VARIANT → ТЖ post-card (editorial режим).
- «Читать дальше» (clamp + синяя ссылка) — VARIANT → ТЖ article-паттерн.
- Виджет «Медиа» («Издания, которым можно верить»): 3 строки канал + «17,5K подписчиков» — VARIANT → ТЖ community-row.
- Sticky-подхедер: поиск «Пользователь, канал или пост» + чип-карусель каналов + chevron — VARIANT → tk-combobox-search + чип-рейл (sticky-артефакт full-page съёмки; census inputs:2 ✓).
- Конец ленты: нет end-of-feed/футера/back-to-top — чистый infinite scroll — поведенческая заметка.
- Convergence-срез pulse_7 (11268–13146px): 4 полных поста стандартной анатомии, ни одного нового варианта; каталог вариантов ленты сошёлся.

## Финальный ранжированный шортлист
1. **tk-quote-chip / tk-ticker-rail — NEW-COMPONENT, M** — market-data примитив: инлайн $TOKEN, мини-котировка (лого+цена+Δ%), полоса чипов, хаб-тикерная лента. Research + pulse. В kit/ТЖ нет ни одного market-data элемента — главный инвест-дифференциатор.
2. tk-scroll-row — NEW-COMPONENT/PATTERN, S-M — горизонтальный ряд: круглый chevron «›», обрезка края, бейдж «Еще N». Research (4+ секций), pulse. Нет carousel-примитива.
3. tk-audio-player — NEW-COMPONENT, M — транспорт-бар поверх подкаст-миниатюр + инлайн-плеер в карточках. Research, research/all.
4. tk-link-preview — NEW-COMPONENT, S — og-карточка вложения (pulse). Полезен и ТЖ.
5. Пакет расширений ТЖ post-card — VARIANT, M — verified-бейдж, pill «Подписаться», текст-иконочный экшн-бар, реакции, «Читать дальше», quote-repost-вложение, editorial-режим.
6. tk-data-table финансовая строка — VARIANT, S-M — аватар+имя+тикер, цветная ссылка-колонка (Покупка/Продажа), субстрока «% портфеля».
7. tk-promo-card idea/metric режим — VARIANT, S — насыщенный фон, плавающий лого-бейдж, «До X% за Y».
8. tk-tabs расширения — VARIANT, S — pill-режим с жёлтой рамкой, overflow-таб «Еще ⌄», точка-уведомления.
9. tk-pagination гибрид — VARIANT, S — «Показать ещё» + нумерация + «Следующая», жёлтая активная pill.
10. Модуль рекомендаций каналов — VARIANT ТЖ community, S (pulse).

Не-гапы: broadcast-каталог = tk-article-card режим; composer-заглушка = ТЖ composer ~1:1; mid-grid CTA = ad-slot; меню поста = tk-menu-popover. Ограничение: расширенный композер и LIVE-состояния недостижимы logged-out — нужен authenticated-захват.
