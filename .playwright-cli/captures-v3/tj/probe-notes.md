# probe-notes — ТЖ vertical round 2026-09-28

Raw eval transcripts (playwright-cli `-s=tinkoff-ui`, session `tinkoff-ui`,
persistent, 1280×720, read-only — nothing typed/submitted, theme flips via
`set-color-scheme` only). **Method note:** all stylesheets except one
(`index7.css`) + inline are CROSS-ORIGIN (CDN domain) → `cssRules` access
blocked, `:root` custom-prop sweep returns 0 — same wall as the bank
reference. Computed styles + capture pixels are ground truth here.

Site: `https://t-j.ru/` — own domain, separate from tbank.ru (the
separate-exportable-kit fact, see INDEX).

## Site map (header + sidebar, home)

```
header nav:  Для вас /my/ · Учебник /pro/ · Сообщество /community/
header buttons:  Поиск · Уведомления · Переключить тему оформления · Авторизоваться
header link:  «Написать» → /blank-form/
sidebar «Разделы» (w290):
  Калькуляторы /flows/features/ · Игры и тесты /games/ · Подкасты и видео /flows/shows/
  Шопинг /flows/shopping/ · Аптечка /aptechka/ · Новости /flows/news/ · Дневники трат /flows/diary/
  Инвестиции /flows/invest/ · Права и обязанности /flows/pravo/ · Недвижимость /flows/realty/
  Медицина и здоровье /flows/health/ · Путешествия /flows/travel/ · Мозг /flows/mozg/
  Образование /flows/study-all/ · Поп-культура /flows/culture/ · Еда /flows/food/
```

## Home (light) — https://t-j.ru/

```
body background: rgb(240, 240, 240)   ← page #F0F0F0; content on white CARDS
hero title (_title_1l4p8_165): 21px / 700 / lh25 / rgb(0,0,0)   ← pure black ink
section H2: 21px / 700 · card H3: 17px / 400 (meta-colored)
CTA «Написать»: fill #333333 · ink #FFF · r5 · h30 · 15px/400/lh20   ← NOT yellow, NOT pill
dividers: 1px #E5E5E5 ×41 · #A6A6A6
fill census:  #FFFFFF ×144 · #FFDD2D ×11 · #8054FF ×3 · #06101E ×9
color census: #000000 ×4989 · #A6A6A6 ×4781 · #C79637 ×384
  ↑ #A6A6A6 = the meta-ink workhorse; #C79637 = GOLD, editorial links (384 uses)
UI font: Graphik (by name on probed elements); <body> itself unstyled (Times
  fallback) — every block sets its own family; article body = Charter (below)
```

## Accent locator (who owns yellow/purple/navy on light home)

```
#8054FF (purple): ONLY as a 30×30 circular badge (r50%) — «Учебник» nav chip
  icon tile. Not a text/link accent anywhere else.
#FFDD2D + #06101E (yellow/navy): ONLY native-ad promo cards — 760×350 and
  760×220, r25, bank-style visual language, CTA inside = yellow 210×50 r10 17px.
  Editorial chrome itself: black/white/gray/gold only.
```

## Home (dark) — native prefers-color-scheme, `set-color-scheme dark`

```
body: rgb(18, 21, 28)   ← page #12151C
cards: rgb(32, 35, 42) ×119   ← #20232A
dividers: #3E4146 ×27 · #D0D0D2 ×10
meta ink: #D0D0D2 · like/engagement ink: #717277 (h40 row)
CTA «Написать» INVERTS: fill #F5F5F9 · ink #000 · w98 h30   ← near-white pill in dark
hero 21/700/25 · H2 21/700 · H3 17/400 #D0D0D2 — scale unchanged, inks remap
yellow #FFDD2D ×11 — STAYS, but only inside promo-card IMAGES/art
sidebar nav: w290 h899 (16 rubrics)
```

## Article — t-j.ru article page (Бизнес rubric piece)

```
H1: 45px / 700 / lh50 · column w764
body = SERIF Charter:  lead 27px/400/lh35 · body 21px/400/lh30 (w760)
in-body H2: 38px / 700 / lh45   (Graphik — heads stay grotesque)
pull-quote (blockquote): Graphik 35px / 400 / lh50
time meta: 15px / 400 / #808080 · body links: 15px black
  ↑ CORRECTION of the prior home-page vision claim «single geometric sans»:
    article BODY is Charter serif; grotesque (Graphik) carries UI + heads.
```

## Rubric /flows/news/

```
h1 «Новости»: 38px / 700 / lh45 · subtitle 16/400 gray
news card titles: 24px / 700 / lh30 · byline avatar 20px + author 14px
no date-nav / filter chips — card-feed list, hairline-free (cards on #F0F0F0)
```

## Учебник /pro/

```
h1: 32px / 700 (inside purple hero card)
featured course card titles: 55px / 700   ← display register, largest type on site
hero card: purple #8054FF-family, r≈32; nav chips = translucent-white pills
  (rgba(255,255,255,.18)) with chevrons — vision-measured
```

## Сообщество /community/

```
h1 «Сообщество»: 38px / 700
post titles (Выбор редакции grid): 24px / 700 / lh30
fill census: #FFFFFF ×68 · #F0F0F0 ×22 · #FFDD2D ×9 · #06101E ×7 (ad banner + promo)
composer card: white r20, avatar-placeholder + ghost text
```

## Cross-surface h1/type scale (computed)

| Surface | h1 | body/feature register |
|---|---|---|
| home hero | 21/700 (card scale) | cards 17/400 meta-colored |
| article | **45/700/50** | **Charter 27 lead / 21 body** |
| /flows/news/ | 38/700/45 | cards 24/700/30 |
| /pro/ | 32/700 | featured 55/700 display |
| /community/ | 38/700 | cards 24/700/30 |
