# Пакет пакетного подтверждения provisional-базлайнов (Story 5.6, 2026-09-23)

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
