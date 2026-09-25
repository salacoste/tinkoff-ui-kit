# Fidelity ledger v2 — 16 carried + 9 new = 25 rows (Story 8.4, 2026-09-25)

**Standard (FR-16 / epics-v2.md 8.4):** every v2 component maps to (1) its
reference source capture in `.playwright-cli/captures-v2/`, (2) its verify dir
(side-by-side composite + probe NOTES with the deviation registry), (3) its
committed baseline set, (4) its deviation count, (5) its open flags. The 16 v1
reference-grounded rows are CARRIED (their full evidence lives in the 5.6
ledger, `../fidelity-verification/ledger.md`); the v2-era deltas that touched
them are recorded per row. DERIVED surfaces (the combobox-search menu, the
qr-block tab strip) carry PATTERN-CONSISTENCY classifications documented AS
SUCH — never dressed as pixel fidelity.

Legend — **baseline**: story ids under `tests/visual/` snapshot dirs (both
themes, compare-gated at `maxDiffPixelRatio 0.015` + axe per story per theme);
**verify**: this row's dir under `.playwright-cli/verify/`; **deviations**:
the intentional-deviation registry in each verify NOTES (documented, not
defects — CONVENTIONS §9); **flags**: items still open for the maintainer or
a future story.

## 16 v1 reference-grounded components (carried from 5.6; v2-era deltas noted)

| # | Component | 5.6 evidence (side-by-side + probes) | v2-era delta (since v1.0.0 tag) |
|---|---|---|---|
| 1 | **tk-button** (1.7) | `../button/` — 18 PNGs, targets probed | unchanged (composed in 7.4/7.5 showcases; no pixel change) |
| 2 | **tk-input** (2.1) | `../input/` — 12 PNGs | unchanged (7.4 reports the sr-only-label API gap — deferred-work, no pixel change) |
| 3 | **tk-select** (2.3) | `../select/` — 14 PNGs + open-region set | **10 PNGs re-taken 256e5cf (8.1)**: the kit-wide `:host([hidden])` guard removed a baked-in stray-band defect from the closed menu — sanctioned re-take, enters the 8.4 batch |
| 4 | **tk-checkbox** (2.4) | `../checkbox/` — 14 PNGs | unchanged (7.4 reports the error-channel API gap — deferred-work) |
| 5 | **tk-segmented-radio** (2.5) | `../segmented-radio/` — 12 PNGs | unchanged (7.4 reports the sr-only-label gap — deferred-work) |
| 6 | **tk-thumbnail-picker** (2.6) | `../thumbnail-picker/` — 12 PNGs | unchanged |
| 7 | **tk-progress-bar** (2.7) | `../progress-bar/` — 16 PNGs | unchanged |
| 8 | **tk-link** (3.1) | `../link/` — 14 PNGs | unchanged |
| 9 | **tk-badge** (3.2) | `../badge/` — 14 PNGs | unchanged |
| 10 | **tk-tabs** (3.3) | `../tabs/` — 12 PNGs | unchanged (composed VERBATIM inside tk-qr-block — 7.3 deviation 2 records the shared inactive-fill delta) |
| 11 | **tk-navbar** (3.4) | `../navbar/` — 12 PNGs | **EXTENDED in place by 7.1** (the mega-nav row below); navbar--api ×2 re-taken twice (7.1 CEM growth; 8.1's 256e5cf CEM regrowth) |
| 12 | **tk-footer** (3.5) | `../footer/` — 10 PNGs | unchanged (composed in 7.4) |
| 13 | **tk-promo-card** (3.6) | `../promo-card/` — 10 PNGs | unchanged (7.4 reports the full-bleed-art API gap — deferred-work) |
| 14 | **tk-feature-card** (3.7) | `../feature-card/` — 10 PNGs | unchanged |
| 15 | **tk-service-card** (3.8) | `../service-card/` — 10 PNGs | unchanged |
| 16 | **tk-article-card** (3.9) | `../article-card/` — 10 PNGs | unchanged |

v1 composition records (carried): `../homepage/` (3.10/3.11), `../form/`
(2.8; the application-form pair re-taken 256e5cf with the select family).
v1 derived records (carried): `../modal/`, `../tooltip/`, `../toast/`
(pattern-consistency, 5.6 rows 17–19).

## 9 v2 components — fidelity rows

| # | Component | Reference capture | Verify dir / side-by-side | Deviations | Open flags |
|---|---|---|---|---|---|
| 17 | **tk-filter-chips** (6.2) | `captures-v2/invest-stocks/pattern-catalog-filters.png` (row crop 824×64+0+76) | `../filter-chips/` — `filterchips-side-by-side-{light,dark}.png` + probe tables; baselines: 6 stories = 12 PNGs + top-layer spec pair | **4** (capsule radius-full FROZEN vs ref r≈10–12; gap space-8 vs ~4–5; border token #E7E8EA vs #E2E4E6; chevron text-secondary vs #999) | none — все отклонения заморожены/задокументированы (отбор НЕ цветом-одним: 2px рамка + aria-selected) |
| 18 | **tk-pagination** (6.2) | `captures-v2/invest-stocks/pattern-table-stocks.png` (bar crop 776×112+0+1042) | `../pagination/` — `pagination-side-by-side-{light,dark}.png`; baselines: 6 stories = 12 PNGs | **7** (bar 44 по измеренной нижней границе; стадион 40×32 vs круг ⌀32; radius-md 12 vs r≈8; surface-muted vs #F2F4F7; link-семантики vs #126DF7; gap 16 vs 19; питч 48 vs ~36 по §8-полу) | none design-open; vision-кроссчек заблокирован инструментарием (записано честно; пиксель-пробы несут) |
| 19 | **tk-combobox-search** (6.3) — ГИБРИД: поле = reference-grounded, меню = PATTERN-CONSISTENCY (select-menu язык, ЗАФИКСИРОВАНО КАК ПРОИЗВОДНАЯ ПОВЕРХНОСТЬ, не пиксельная фидельность) | `captures-v2/invest-stocks/pattern-catalog-filters.png` (field crop 824×72+0+0; в капче меню ЗАКРЫТО — референса меню не существует) | `../combobox-search/` — `combobox-search-side-by-side-{light,dark}.png` (поле) + открытая панель отдельными рендерами; baselines: 7 stories = 14 PNGs + top-layer spec pair | **5** поле (икона-зазор trued в-round; иконка text-muted; плейсхолдер text-muted; канва surface-muted; radius-md 12 vs r≈11) + меню = kit surface по спеку (0 фиделити-отклонений: нечему соответствовать) | none (deviation 1 trued с перебазлайном 16 PNG; меню — селект-язык 2.3, см. классификацию ниже) |
| 20 | **tk-navbar mega-nav** (7.1 — расширение компонента 3.4) | `captures-v2/invest-stocks/pattern-header-meganav.png` (1280×129, two-row header; dark-референса нет) | `../mega-nav/` — `mega-nav-side-by-side-{light,dark}.png` + DOM-geometry log; baselines: 4 stories = 8 PNGs (+ navbar--api ×2) | **9** (подчёркивание саблинка TRUED 2px #616871 vs #666666; разделитель TRUED border-default vs #DDDFE0; row-1 подчёркивание жёлтое 4px vs серое 2px (v1-verbatim); регистры; row-1 72 vs 64; инсет контейнера; +12 линк-паддинг; «Банк» = валютный знак, не ссылка; утилиты = слот) | none — все 9 диспозицированы; volatile A/B-панели мега-меню OUT of scope по спеку |
| 21 | **tk-data-table** (6.4) | `captures-v2/invest-stocks/pattern-table-stocks.png` (table crop 776×307+0+73) | `../data-table/` — `data-table-side-by-side-{light,dark}.png` + probe tables; baselines: 7 stories = 14 PNGs + keyboard-contract spec pair | **7** (хедер 57 vs 61; вторичные чернила #616871 vs rgba(0,0,0,.54); паддинг колонок 16 vs 48; дельты = 6.1 AA-токены, не якоря сайта; клавиатурный слой = санкционированное APG-добавление; dark без референса; лендинг 22.5→24 trued линзой B1) | dark-ветка без референсной капчи — проверена 8.2-движком (токен-ремап, не фидельность); «За год»-колонка и сортировка = scope fence 6.4 |
| 22 | **tk-cookie-banner** (7.2) | `captures-v2/invest-stocks/cookie-dialog-element.png` (202×118 интерьер) + `cookie-dialog-viewport.png` (позиция) | `../cookie-banner/` — `cookie-banner-side-by-side-{light,dark}.png` + DOM-геометрия; baselines: 5 stories = 10 PNGs + top-layer spec pair | **11** (44px-хит вокруг 32px-пилла; паддинг 16 равномерный vs рваный; max-width 212 = измеренная; инсет 16 = помеченное суждение; высота 127 vs 118 / 2 строки vs 3; чернила text-secondary vs #333/#B8B8B8; surface-field vs #F2F4F7; weight 600 литерал; focus-visible подчёркивание; условный focus-restore; ноль моушна) | 16px-инсет — house judgment, не суб-пиксельно измерен (deferred-work 7.2(c): перемерить при стабильной капче); live re-capture был закрыт сессией сайта |
| 23 | **tk-stepper** (7.3) | `captures-v2/business/pattern-steps-open-account.png` + `-detail.png` | `../stepper/` — `stepper-side-by-side-light.png` + probe transcript; baselines: 5 stories = 10 PNGs | **5** (бейдж #8D6040→tint-cream-raised+text-primary — НЕТ коричневого токена; карточки auto-fit vs 336 fixed; радиус бейджа 16 vs ≈18; вес 500 vs 700 ×2; ноль моушна) | **КОРИЧНЕВЫЙ ТОКЕН — открытое решение мейнтейнера** (deferred-work 7.3: `--tk-stepper-badge-fill/-number` примут его в день появления) |
| 24 | **tk-store-badges** (7.3) | `captures-v2/invest-mobile/pattern-store-badges-loaded.png` | `../store-badges/` — `store-badges-side-by-side-light.png`; baselines: 5 stories = 10 PNGs | **5** (surface-muted vs #F6F7F8 Δ1/канал; вес 500 vs 600; иконки = нейтральный плейсхолдер (never-list: ноль бренд-арта); ноль моушна; радиус trued 16→24 arc-fit в-round) | none — бренд-иконки = данные потребителя (iconSrc), не кит; F5 dark-дефект (якорь без цветового канала) ИСПРАВЛЕН 8.2 |
| 25 | **tk-qr-block** (7.3) | `captures-v2/invest-mobile/pattern-qr-loaded.png` (1280×344) | `../qr-block/` — `qr-block-side-by-side-light.png` + позиционное доказательство (тройное); baselines: 5 stories = 10 PNGs | **5** (вес 500 vs 700; НЕАКТИВНАЯ ЗАЛИВКА ТАБОВ #F2F4F7 НЕ ВЫРАЖЕНА — tk-tabs composed verbatim, PATTERN-CONSISTENCY-ветка; чернила заметки text-secondary 4.99:1 vs #C5C5C5 2.1:1 — AA-over-capture; размер 17 vs ≈19–20; QR-арт = плейсхолдер, кодировок кит не генерирует) | page-copy слот между заголовком и табами ОТСУТСТВУЕТ (7.5 gap-репорт → deferred-work: решение мейнтейнера о микро-спеке); позиция заметки исправлена по пикселям (tile→note, DOM-pin) |

v2 composition records (reference-grounded, kit-assembled; the yellow audit
covers them below):
`../stocks-catalog/` (6.5 — assembly VERDICT: каркас/кластер/связь совпадают,
39-шаговый клавиатурный walkthrough; scope fences: без «За год»-колонки,
вторичных дропдаунов и cookie-оверлея),
`../business-landing/` (7.4 — 15 отклонений в ledger NOTES:87–105, 6 кит-гэпов
зарепортировано в deferred-work),
`../invest-landing/` (7.5 — 10 assembly-дельт: порядок кластера qr→steps→badges
опровергнут капчей и поправлен; 2 кит-гэпа в deferred-work).

## Derived-surface classification (documented AS SUCH)

- **tk-combobox-search menu panel** — PATTERN-CONSISTENCY: select-menu язык
  (48px rows, radius-sm, surface-field active, dropdown shadow) по выбору
  спека; в референсной капче меню закрыто — пиксельной фидельности НЕ
  утверждается (NOTES: «kit surface, not a deviation»).
- **tk-qr-block tab strip** — PATTERN-CONSISTENCY: v1 tk-tabs composed
  VERBATIM (zero `--tk-tabs-*` overrides, unit-pinned); неактивная заливка
  референса невыразима без переписывания чужих internals — та же дельта,
  что записана у самих v1 tabs.
- **tk-modal / tk-tooltip / tk-toast** (v1) — unchanged 5.6 records.

## Findings this story (found → dispositioned)

| # | Finding | Disposition |
|---|---|---|
| L1 | 25/25 строк сходятся: у каждой v2 компонентной строки капча-путь существует, verify-директория существует, базлайны в дереве (140 v2-добавлений + 16 перезаписей с v1.0.0) | подтверждено механически (grep путей + git diff --name-status v1.0.0..HEAD) |
| L2 | два предсуществующих падения mega-nav--page (8.2 STOP) | оркестратор адаптировал легитимность (CEM-рост 8.1, тот же класс что 256e5cf) → перезапись exactly-2 (d7c36d6); входят в 16 перезаписей батча 8.4 |
| L3 | отклонения v2-компонентов суммарно: 4+7+5+9+7+11+5+5+5 = **58 задокументированных intentional-отклонений**, каждое с измеренным референсным значением | все в NOTES-реестрах; ни одно не «провал» — стандарт v1 (замороженные решения + токен-семантики + §8-полы) |
| L4 | фидельность dark-веток v2 не имеет капч-референсов (референс-сайт light-only) | by design: dark = токен-ремап, проверен 8.2-движком (28/28), НЕ фидельность-заявление — записано, чтобы ledger не обещал больше, чем доказано |

## SM-C2 statement (v2 legs)

Visual suite на aa9780f: **1368/1368 ×2** (порт 6061, приватный VISUAL_PORT,
оркестраторские прогоны 6041 на объединённом main — HANDOFF §2). Все волны
пере-съёмок v2 объяснены: 6.3 icon-gap truing (16), 7.1 truing (8+2),
combobox TypeOnMount story-fix (2), store-badges lens W1 (2), 8.1 hidden-guard
(14 = 256e5cf), 8.2 mega-nav--page (2 = d7c36d6), 6.1 token-table growth
(token-reference--colors ×2, c999e12). Полный список — в maintainer-пакете
(`_bmad-output/implementation-artifacts/baseline-review-package.md`, раздел v2).
