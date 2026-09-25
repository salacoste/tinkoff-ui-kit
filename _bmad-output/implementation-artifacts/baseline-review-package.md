# Пакет пакетного подтверждения provisional-базлайнов (Story 5.6, 2026-09-23; РАСШИРЕН Story 8.4 для v1.1.0 — v2-часть ниже)

> ## ✅ РЕЗУЛЬТАТ ГЕЙТА v1 (закрыт мейнтейнером, 2026-09-23, тот же присест)
>
> - **F1 (dark progress-bar): ПЕРЕЗАПИСЬ.** Устаревшая рельса была видна во ВСЕХ 8 тёмных
>   ногах сюиты (не только в двух названных ниже — формулировка «playground, variants» была
>   приблизительной, истории variants не существует; нейминг-паттерн: `--<story>-dark-1-chromium.png`,
>   один дефис). Все 8 удалены + перегенерированы update-флоу.
> - **Все группы подтверждены мейнтейнером по side-by-side в живой сессии** (поштучно, в
>   порядке §1→карты→E2→E3→E4→доки): карты ×4 (promo/feature/article/service), форма ×7
>   (input/select/checkbox/segmented-radio/thumbnail-picker/progress-bar/showcase), навигация
>   (link+badge/tabs/navbar/footer), homepage + оверлеи ×3 (modal/tooltip/toast), tk-button
>   и дока-поверхности (token-reference/theming-guide/getting-started).
> - Базлайны переведены из PROVISIONAL в CONFIRMED; drift-охрана продолжается compare-режимом.


**Для мейнтейнера.** Все визуальные базлайны (`tests/visual/**/*-snapshots/`)
были записаны автономным прогоном без человека и с тех пор работают как
drift-эталон (сравнение при каждом прогоне, порог 1.5% пикселей + axe в обеих
темах). Правило provisional (tests/visual/README.md §Baseline workflow 3–4):
подтверждение или перезапись — только человеком, за один присест, по
side-by-side. Этот пакет готовит тот присест: всё сгруппировано, у каждой
строки — доказательство и действие. **Сам гейт этой историей НЕ исполнялся.**

Инвентарь на момент пакета: **274 PNG** (266 в `tests/visual/visual.spec.ts-snapshots/`
+ 8 в per-component spec-наборах modal/select/toast/tooltip), 921 тест ×
(скриншот + axe) в обеих темах.

---

## 1. Сначала — помеченные строки (посмотреть руками в первую очередь)

### F1 — dark progress-bar: базлайны УСТАРЕВШИЕ, НО ПРОХОДЯЩИЕ (5.4)

- **Что:** в 5.4 трек прогресс-бара в тёмной теме исправлен (gray-200 →
  white-alpha рельса, computed `rgba(255,255,255,0.14)`), но 4px-полоска
  (~0.16% канваса) ниже пиксельного порога — PNG тёмных историй progress-bar
  **не перезаписывались и всё ещё показывают старую почти-белую рельсу**.
- **Файлы:** `tests/visual/visual.spec.ts-snapshots/visual-components-progressbar--{playground,variants}--dark-1-chromium.png`
  (тёмные ноги со скриншотами полосы; световые не тронуты).
- **Доказательство реального состояния:** computed-style нога
  `tests/visual/dark-sweep.spec.ts` + живой проб (5.4 NOTES F1).
- **Действие:** ПОДТВЕРДИТЬ нельзя вслепую — либо подтвердить осознанно
  («знаю, полоса в PNG старая, computed верен»), либо ПЕРЕЗАПИСАТЬ (см. §3) —
  тогда PNG покажет тональную рельсу.

### 5.4 — волна из 23 перезаписей (тёмные ноги, F2/F4)

- **Что:** перезаписаны тёмные базлайны после фиксов скелетов карт и канвасов:
  button ×8, badge ×6, link ×6, article/feature/promo `variants` ×3.
  Коммит `ad498e2` (23 M). Световые не тронуты.
- **Действие:** подтвердить по side-by-side из 5.4 (`dark-sweep/ledger.md`,
  F-таблица) либо перезаписать отдельные.

### 5.5 — 52 новых + 2 перезаписи (доки)

- **Что:** новые страницы доков: API-таблицы 19×2=38, токен-референс 8,
  гайд по темам 6, getting-started 2 (переписана — 2 M). Коммит `6962326`.
- **Действие:** подтвердить (страницы доков, не компоненты; axe уже ловил и
  чинил контраст в-change) либо перезаписать отдельные.

### 5.6 — 70 перезаписей СЕГОДНЯ (в рабочем дереве, не закоммичено)

- **Что:** две правки этой истории меняют пиксели осознанно:
  1) **коррекция радиуса карт** — `--tk-radius-xxl` 32→24 (пиксель-проба
     архива: референс красит ОДИН радиус карты 22–24; у нас было 32) и
     article-card 16→24 (проба опровергла вижн-чтение 3.9);
  2) **UX-DR17** — жёлтые декоративные бордюры колаутов в api-reference и
     getting-started заменены на `border-strong`.
  Перезаписаны: все истории promocard/featurecard/articlecard (30),
  API-истории остальных 16suite'ов (32), getting-started ×2, homepage ×2.
  Ревью-патч того же дня: +4 доковых базлайна перезаписаны осознанно
  ПОД порогом (surfaces/overrides показывали ДО-коррекционный свотч 32 —
  compare их не ловит, перезапись через delete+update), и 6 перерисованы
  на месте (promocard api/playground и featurecard playground — реген
  манифеста + чистка канвас-текста «32»). Итого 70; две сравнительные
  прогона после — зелёные (921/921, `verify/fidelity-verification/logs/`).
- **Доказательство:** `.playwright-cli/verify/fidelity-verification/ledger.md`
  (таблица проб до/после: 31.5 → 23.5, ступенька пиксель-в-пиксель как у
  референса) и `yellow-audit.md` (F1/F2).
- **Действие:** подтвердить в первую очередь side-by-side карт
  (`verify/{promo-card,feature-card,article-card,service-card}/side-by-side-*.png`
  пересобраны на новом коде). Уточнение по service-card: сам компонент
  в 5.6 НЕ менялся — его радиус и до коррекции был xl 24 (проба «до» в
  ledger-таблице: service 23.5 = 24); side-by-side пересобран как
  evidence-refresh для того же присеста, чтобы все четыре карточных пары
  были сняты одной волной на одном коде. Из его 10 базлайнов перезаписана
  только API-пара (входит в UX-DR17-волну 32), карточные истории не
  тронуты.

### Волны композиции/свитчей (исторические, уже в main)

- 3.10/3.11 (`49799a9`): homepage-композиция ×2 + перезапись MobileBurger
  (история глога: дровер в кадре после фикса позиционирования — раньше кадр
  был пуст).
- 5.1–5.3 (`6189211`): 50 перезаписей после a11y-фиксов (navbar/tooltip и
  др.) — метод в `verify/a11y-sweep/METHOD.md`.

---

## 2. Полный инвентарь по историям

Формат: **история (коммит provisional-since)** — набор историй сюиты ×2 темы;
side-by-side путь; действие по умолчанию: **подтвердить**.

### Epic 1

| Группа | Базлайны | Side-by-side / доказательство | С committing |
|---|---|---|---|
| tk-button (1.7) | `components-button--` 9 историй = 18 PNG | `verify/button/side-by-side-{light,dark}.png` (backfill 5.6) + NOTES | `1f41349` (+фиксы `80d8277`, `6985637`; API-таблица — `6962326`; 5.6 — без изменений кнопки) |
| harness (1.6) | сами механизмы, без историй | `tests/visual/README.md` | `dcfc52e` |

### Epic 2 — форма (эталон: заявка на дебетовую карту, tbank.ru)

| Группа | Базлайны | Side-by-side | С committing |
|---|---|---|---|
| tk-input (2.1) | 6 историй = 12 | `verify/input/side-by-side-{light,dark}.png` | `e8e4a44` |
| tk-select (2.3) | 7 = 14 + страничный open-набор `select.spec.ts-snapshots` (2) | `verify/select/side-by-side-{closed,open}-{light,dark}.png` | `6f3863c` |
| tk-checkbox (2.4) | 7 = 14 | `verify/checkbox/side-by-side-{unchecked,checked}-{light,dark}.png` | `c3a3274` |
| tk-segmented-radio (2.5) | 6 = 12 | `verify/segmented-radio/side-by-side-{yes,no}-{light,dark}.png` | `e5bd994` |
| tk-thumbnail-picker (2.6) | 6 = 12 | `verify/thumbnail-picker/side-by-side-{black,blue}-{light,dark}.png` | `1cb3c11` |
| tk-progress-bar (2.7) | 8 = 16 | `verify/progress-bar/side-by-side-{light,dark}.png` | `c86ff28`; **тёмные ноги — см. F1** |
| showcase форма (2.8) | 2 | `verify/form/side-by-side-{light,dark}.png` + walkthrough 31/31 | `57598eb` |

### Epic 3 — навигация, карты, композиция

| Группа | Базлайны | Side-by-side | С committing |
|---|---|---|---|
| tk-link + tk-badge (3.1/3.2) | 7 = 14; 7 = 14 | `verify/link/…`, `verify/badge/…` | `1aa7bd7` |
| tk-tabs (3.3) | 6 = 12 | `verify/tabs/…` | `6b07feb` |
| tk-navbar (3.4) | 6 = 12 | `verify/navbar/side-by-side{,-mobile}-{light,dark}.png` | `65b6125`; 5.1–5.3 — 50-волна |
| tk-footer (3.5) | 5 = 10 | `verify/footer/…` | `65b6125` |
| tk-promo-card (3.6) | 5 = 10 | `verify/promo-card/…` + tint-пробы | `feec5df`; **5.6 радиус — перезаписаны** |
| tk-feature-card (3.7) | 5 = 10 | `verify/feature-card/…` | `feec5df`; **5.6 — перезаписаны** |
| tk-service-card (3.8) | 5 = 10 | `verify/service-card/…` | `feec5df`; **5.6 — код не менялся** (радиус уже xl 24; side-by-side — evidence-refresh, API-пара — UX-DR17-волна) |
| tk-article-card (3.9) | 5 = 10 | `verify/article-card/…` | `feec5df`; **5.6 радиус — перезаписаны** |
| homepage (3.10/3.11) | 2 | `verify/homepage/side-by-side-{light,dark}.png` + регионы | `49799a9`; **5.6 — перезаписаны (карты в композиции)** |

### Epic 4 — оверлеи (derived, паттерн-консистентность)

| Группа | Базлайны | Доказательство | С committing |
|---|---|---|---|
| tk-modal (4.1) | 8 = 16 + `modal.spec.ts-snapshots` (2) | `verify/modal/` (anatomy-таблица + рендеры) | `fb8980c` |
| tk-tooltip (4.2) | 7 = 14 + spec-набор (2) | `verify/tooltip/` | `fb8980c`; spec-набор — `6189211` |
| tk-toast (4.3) | 8 = 16 + spec-набор (2) | `verify/toast/` | `fb8980c` |

### Epic 5 — свипы и доки

| Группа | Базлайны | Доказательство | С committing |
|---|---|---|---|
| a11y-волна (5.1–5.3) | 50 перезаписей поверх | `verify/a11y-sweep/{METHOD,group-I..III}.md` | `6189211` |
| dark-свип (5.4) | 23 перезаписи + **F1 флаг** | `verify/dark-sweep/{ledger,NOTES}.md` | `ad498e2` |
| доки (5.5) | 52 A + 2 M | `verify/docs-completion/ledger.md` | `6962326` |
| 5.6 (эта) | 70 перезаписей | `verify/fidelity-verification/{ledger,yellow-audit,impeccable-run}.md` (+ `logs/`) | рабочее дерево (коммит после гейта) |

---

## 3. Как подтверждать или перезаписывать (одна страница)

**Подготовка:** `pnpm install && pnpm exec playwright install chromium`;
дальше всё локально, сайт не нужен.

**ПОДТВЕРДИТЬ** = посмотреть пару «baseline PNG ↔ живой рендер» и
side-by-side, решить «да, это правильные пиксели». Живой рендер:

```sh
pnpm --filter pillkit-docs build && node tests/visual/serve.mjs 6009 &
# открыть http://localhost:6009/iframe.html?id=<story-id>&viewMode=story
# тёмная тема: &globals=theme:dark
```

story-id = имя PNG без `visual-`/`-[light|dark]-1-chromium` (например
`components-promo-card--playground`). Side-by-side лежат в
`.playwright-cli/verify/<компонент>/`. Подтверждённые группы можно просто
отметить в этом файле (галочка) — кодового действия не требуется: базлайны
уже вcompare-режиме и дальше охраняют drift.

**ПЕРЕЗАПИСАТЬ** (пиксели не те) — правило «delete + update» (update-режим
Playwright перезаписывает только выше порога, поэтому удаляем явно):

```sh
rm tests/visual/visual.spec.ts-snapshots/visual-<suite>--<story>-<both themes>.png
pnpm --filter pillkit-docs build && pnpm exec playwright test \
  tests/visual/visual.spec.ts --update-snapshots \
  -g "visual: <suite>--<story>"
git diff tests/visual/  # убедиться: изменились только целевые PNG
```

После любой перезаписи — две сравнительные прогона на стабильность:
`pnpm test:visual && pnpm test:visual` (обе зелёные). Переписанный PNG
коммитится ВМЕСТЕ с причиной (или заметкой в этом файле), не отдельно.

**Правило human side-by-side gate:** базлайн считается подтверждённым только
после того, как вы видели рендер рядом с эталоном (tbank.ru crop в
`.playwright-cli/captures/` + `verify/*/side-by-side-*.png`) — не по
зелёному CI. CI зелёный у всех 274 PNG прямо сейчас; это доказывает
отсутствие drift, а не правильность первых пикселей.

**Порядок присеста (совет):** §1 (флаги) → карты (5.6-перезаписи) → Epic 2
форма → Epic 3 → Epic 4 → доки. Полный проход ≈ 1–2 часа при
side-by-side-просмотре; флаги F1/5.6 — первые 15 минут.

**Напоминания из deferred-work.md (исполнение только мейнтейнером):**
VoiceOver/NVDA спот-чеки по протоколам в «Доступность»-историях (19);
iOS momentum-scroll модалки на реальном устройстве.

---
---

# ЧАСТЬ v2 — пакет для гейта v1.1.0 (Story 8.4, 2026-09-25)

**Для мейнтейнера.** v2 добавил **140 новых provisional PNG** (9 компонентов
+ 3 композиции + 9 док-страниц + registers) и **16 adjudicated-перезаписей**
поверх подтверждённых v1-базлайнов; инвентарь сюиты теперь **414 PNG /
1368 тестов** (скриншот + axe × обе темы). v1-часть выше — закрытая история
(весь 274-PNG пакет подтверждён 2026-09-23); этот присест подтверждает
ТОЛЬКО v2-ножи. Правила те же (§3 v1): подтверждение/перезапись — только
человеком, по side-by-side за один присест; **гейт этой историей НЕ
исполнялся.**

> ## ✅ РЕЗУЛЬТАТ ГЕЙТА v2 (закрыт мейнтейнером salacoste, 2026-09-25)
>
> - **Весь батч подтверждён за один присест**: 156 PNG — 138 новых + 18
>   перезаписей (R-14 ×14, R-2 ×2, R-2′ ×2), по contact-sheet
>   `.playwright-cli/verify/baseline-review-v2.html` (группы и порядок = §3
>   ниже; light|dark пары, RE-TAKE-группы с forensic-однострочниками).
>   Покрытие листа сверено программно до присеста: 156/156, 0 пропущенных;
>   санкционированно исключены только v1-подтверждённые select `--api`/`--open`
>   и v1 per-component пары (modal/toast/tooltip/select).
> - Исключений и перезаписей по итогам присеста не заявлено.
> - Базлайны переведены из PROVISIONAL в CONFIRMED; drift-охрана продолжается
>   compare-режимом сюиты.
> - Этим закрыт пункт §8.1.3 RELEASE.md. Открытые пункты релизной очереди:
>   §8.1.4 (SR-спот-чеки v2 — человек), §8.1.5 (коричневый токен — решение),
>   §8.3 (тег v1.1.0 — только мейнтейнер).

Фиделити-контекст присеста: `.playwright-cli/verify/fidelity-verification-v2/`
(ledger 25 строк — у каждого v2-компонента капча-путь, реестр отклонений,
открытые флаги; жёлтый аудит; impeccable-прогон).

## v2-§1. Сначала — перезаписи поверх ПОДТВЕРЖДЁННЫХ v1-базлайнов (16 + 2)

### R-14 (256e5cf, story 8.1) — 14 PNG: select-семейство ×10 + application-form ×2 + navbar--api ×2

- **Что:** kit-wide `:host([hidden])`-гард (8.1 F2) убрал ВЫПЕЧЕННЫЙ дефект
  закрытого меню tk-select — author-origin `display:block` бил UA `[hidden]`,
  и в закрытом состоянии меню рисовало паразитную полосу. 10 PNG (5 историй
  select ×2 темы: playground, variants, value-modes, theming, accessibility)
  легитимно изменили пиксели; application-form ×2 (композиция с селектом) и
  navbar--api ×2 (CEM-таблица выросла — F1 fallback-доки) — тот же коммит.
- **Forensic one-liner:** «guard removed a baked-in select stray-band defect
  (author-origin display beat UA [hidden]); navbar--api CEM table grew from
  the F1 fallback docs».
- **Действие:** подтвердить по side-by-side из `verify/select/` (старые PNG
  показывали полосу — новые чистые) либо перезаписать отдельные.

### R-2 (d7c36d6, story 8.2) — 2 PNG: `visual-components-v2-mega-nav--page {light,dark}`

- **Что:** та же легитимность-класс, что 256e5cf: CEM 8.1 вырос — описания
  атрибутов navbar (burger-label 70→209, sub-label 207→379 символов); док-
  страница v2 рендерит `apiReferenceDoc('tk-navbar')` дословно → +41px
  (1280×3372→3413, IHDR-проверено). 256e5cf перезаписал navbar--api, но
  ПРОПУСТИЛ эту док-страницу (8.2-исполнитель корректно STOPнул на
  предсуществующем падении; оркестратор адаптировал легитимность).
- **Forensic one-liner:** «8.1's merged CEM grew the navbar attribute
  descriptions; the v2 docs page renders apiReferenceDoc('tk-navbar')
  verbatim → +41px».
- **Действие:** подтвердить (страница стала длиннее ровно на выросшую
  таблицу) либо перезаписать.

### R-2' (c999e12, story 6.1) — 2 PNG: `visual-token-reference--colors {light,dark}`

- **Что:** 6.1 добавил v2-семантики (warm-cream, delta, table) — страница
  цветов выросла на новые строки токенов. До-теговое подтверждение v1 этих
  строк не покрывало.
- **Действие:** подтвердить (та же страница, больше строк) либо перезаписать.

## v2-§2. Полный инвентарь v2 по историям

Формат v1-части: группа — набор исторей ×2 темы; side-by-side путь; действие
по умолчанию: **подтвердить**. Провижн-коммиты — появление в main.

### Epic 6 — каталог (эталон: tbank.ru/invest/stocks)

| Группа | Базлайны | Side-by-side / доказательство | С committing |
|---|---|---|---|
| tk-filter-chips (6.2) | `components-filterchips--` 6 историй = 12 + top-layer спек-пара «Ещё»-меню (2) | `verify/filter-chips/filterchips-side-by-side-{light,dark}.png` + probe-таблицы | `932c9b3` |
| tk-pagination (6.2) | `components-pagination--` 6 историй = 12 | `verify/pagination/pagination-side-by-side-{light,dark}.png` | `932c9b3` |
| tk-combobox-search (6.3) | `components-comboboxsearch--` 7 историй = 14 (вкл. --open) + top-layer спек-пара (2) | `verify/combobox-search/combobox-search-side-by-side-{light,dark}.png` (поле; меню = kit surface, см. ledger) | `409417a` |
| tk-data-table (6.4) | `components-datatable--` 7 историй = 14 + keyboard-contract спек-пара (2) | `verify/data-table/data-table-side-by-side-{light,dark}.png` | `e06e844` (линз-фикс `eb9fdd7` — клавиатурная история md5-идентична) |
| stocks-catalog (6.5) | `showcase-stocks-catalog--` 1 история = 2 + спек-пара открытой панели (2) | `verify/stocks-catalog/stockscatalog-side-by-side-{light,dark}.png` + `walkthrough.md` (39 шагов) | `b1a1b9f` |

### Epic 7 — хром + маркетинг (эталоны: /invest/stocks хедер; /business; /invest/mobile-application)

| Группа | Базлайны | Side-by-side | С committing |
|---|---|---|---|
| tk-navbar mega-nav (7.1) | `components-navbar--mega-nav{,-variants,-theming,-accessibility}` 4 истории = 8 (navbar--api ×2 — см. R-14) | `verify/mega-nav/mega-nav-side-by-side-{light,dark}.png` + DOM-геометрия | `0ec0790` (ворктри `736191e` + truing `b068bb8`) |
| tk-cookie-banner (7.2) | `components-cookie-banner--` 5 исторей = 10 + top-layer спек-пара (2) | `verify/cookie-banner/cookie-banner-side-by-side-{light,dark}.png` | `0f1592d` (ворктри `773f53d`; gate-fix `9086551`) |
| tk-stepper (7.3) | `components-stepper--` 5 исторей = 10 | `verify/stepper/stepper-side-by-side-light.png` (dark-референса нет — токен-ремап, 8.2-движок) | `d6a9f2c` (ворктри `d199a79`; линза `6cb2234`) |
| tk-store-badges (7.3) | `components-storebadges--` 5 исторей = 10 | `verify/store-badges/store-badges-side-by-side-light.png` | `d6a9f2c` (линза `6cb2234`: zero-state-пара перезаписана в-round) |
| tk-qr-block (7.3) | `components-qrblock--` 5 исторей = 10 | `verify/qr-block/qr-block-side-by-side-light.png` (позиция заметки тройно доказана) | `d6a9f2c` |
| business-landing (7.4) | `showcase-business-landing--` 1 история = 2 + toast спек-пара (2) | `verify/business-landing/side-{hero,bento,steps-form,footer}.png` ×4 | `5a6f5e5` (ворктри `bbbceef`) |
| invest-landing (7.5) | `showcase-invest-landing--` 1 история = 2 + cluster спек-пара (2) | `verify/invest-landing/side-by-side-{hero,cluster}.png` | `508bd7b` (ворктри `7df3097`; CEM `0df4593`) |

### Epic 8 — верификация + доки

| Группа | Базлайны | Доказательство | С committing |
|---|---|---|---|
| доки v2 (8.3) | `components-v2-<comp>--page` ×9 = 18 + `token-reference--registers` 2 | живые CEM-таблицы; registers-источник single-source (TOKENS.md ?raw) — drift-тест `tests/docs-registers-source.test.ts`; страницы доков, не компоненты (прецедент 5.5) | `e63639c` |
| 8.1 (a11y-свип) | **14 перезаписей — см. R-14** | `verify/a11y-sweep/group-V.md` (54/54 ячеек) + 28 engine-ног | `256e5cf` |
| 8.2 (dark-свип) | **2 перезаписи — см. R-2**; F5 store-badges фикс без пиксельного изменения | `verify/dark-sweep/ledger.md` (28/28; шесть dark-[ASSUMPTION] удержаны, ноль изменений значений) | `9231315` + `d7c36d6` |
| 8.4 (эта) | перезаписей НЕТ — линейные прогоны 1368/1368 ×2 (порт 6061) | `verify/fidelity-verification-v2/{ledger,yellow-audit,impeccable-run}.md` | рабочее дерево (коммит после гейта) |

## v2-§3. Порядок присеста v2 (совет)

R-14 → R-2 → R-2' (перезаписи, ~10 минут) → 7.3-трио (самые визуально
плотные side-by-side) → Epic 6 каталог (chips/pagination/combobox/table) →
композиции ×3 (assembly-стандарт: порядок/кластер/связь, не попиксельно) →
доки ×20 (CEM-таблицы, быстрый eyeball) → mega-nav/cookie-banner. Эталоны —
`.playwright-cli/captures-v2/` (INDEX.md там же). Присест v2 ≈ 1 час.

После подтверждения: гейт релиза v1.1.0 — RELEASE.md, раздел «Релиз v1.1.0»
(тег ставит ТОЛЬКО мейнтейнер; эта история ничего не исполняла).
