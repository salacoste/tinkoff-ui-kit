# v2 Recon observations (2026-09-24) — three domains vs the v1 kit

## Token probes (live computed styles)

| Probe | business | invest/mobile | invest/stocks | v1 consumer (baseline) |
|---|---|---|---|---|
| body font | haas, pragmatica | haas, pragmatica | dsText | dsText |
| h1 size | 44px | 44px | 36px | 50px |
| link color | #126DF7 | — | — | blue-100 #126DF7 ✓ |

**Two registers confirmed:** MARKETING pages (business, invest landing) use **haas+pragmatica**
— the exact families the kit already bundles as Daytona — with h1 44px; PRODUCT-UI pages
(stocks catalog) use dsText with h1 36px and denser data typography. Consumer homepage (v1 base)
sits in between at h1 50/dsHeading+dsText. Link blue is the same scale token across domains.

## Per-domain inventories

### tbank.ru/business — same design language, marketing register
- **v1-covered:** header (slim navbar mold — no CTA, no visible active marker on /business itself),
  inline application form (input/select/button mold), footer directory, link grids, app-promo
  blocks, steps block (v1 has no explicit stepper — NEW-ish), service selector.
- **NEW patterns:** asymmetric **2+3 bento** product grid — FLAT beige-tint cards (~#EDE3D2 on
  cream ~#F1EBE1 page — a WARMER tint family than consumer gray/mint/beige… близко к beige v1
  #F1EBD6, но страница-фон тоже кремовая), ~24px radius, NO shadow, big 3D art, **floating
  white-pill CTA overlapping the art**, centered grid-footer pill («Все сервисы», light fill +
  blue text). Yellow appears ONLY inside illustrations — never as UI chrome.
- **No tables/tariffs found on the landing** (business widgets live deeper in flows — out of the
  designated page).

### tbank.ru/invest/stocks — PRODUCT-UI register, the data-table domain
- **Site chrome:** bank-wide MEGA-NAV (Банк/Бизнес/Инвестиции/Мобильная связь/Страхование/
  Путешествия/Долями + Войти) + domain SUB-NAV (Обзор/Каталог/Пульс/Аналитика/Академия/Терминал)
  — two-deep navigation v1's navbar does not model. Cookie-consent DIALOG on load.
- **NEW primitives:** combobox SEARCH («Название или тикер»); **checkbox-chip tablist** filters
  (Что купить/Акции/Валюта/Фонды/Облигации/Фьючерсы/Опционы + «Ещё» overflow → dropdown);
  filter BUTTON row with INLINE tooltips (Шорт/Лонг); **typographic DATA TABLE** — and the
  critical finding: **NO sparklines/charts anywhere** — pure typography (name+ticker+logo;
  price + «1 лот = N акций»; day/year deltas colored red/green, sign often omitted — color
  carries direction), 1px light dividers, no zebra, ~80px two-line rows, circular brand logos,
  rows clickable; **PAGINATION** with numbered pages + yellow pill on active + «Показать еще»
  blue text button.
- **Scope consequence:** data-viz (v1 non-goal) is NOT what this page shows — the copyable
  pattern is a typographic table + semantic red/green numbers + chips + pagination.

### tbank.ru/invest/mobile-application — marketing register, app-landing blocks
- Consumer-style header. h1 44px bold on white.
- **NEW patterns:** QR-code install TABLIST (Вариант 1: camera+QR with security copy; tabs per
  platform); store-badges section (Вариант 2 — badges lazy-loaded below fold, anatomy TBD);
  «Открыть чат в личном кабинете» support link; install-steps headings (numbered how-to).
- Otherwise marketing blocks already in v1's language (headings, cards, links).

## Cross-domain verdict

**Same design system, three registers:** the kit's token base (yellow, ink, blue link, radii,
flat tints, pill CTAs) holds everywhere; divergence = typography scale (50/44/36 h1) + font
family per register + the product-UI density on stocks. The v1 tokens already carry
haas/pragmatica (Daytona) first in stacks — marketing domains align with the kit AS SHIPPED.

## v2 candidate component list (for the brief — maintainer scopes)

1. **Data table** (typographic: rows, red/green delta text, two-line cells, row-as-link)
2. **Filter chip group** (checkbox-tablist, single-select visually, + overflow «Ещё»)
3. **Pagination** (numbered + yellow active pill + «Показать еще»)
4. **Combobox search** (typeahead field in the catalog header)
5. **Stepper** (numbered steps, business + install how-tos)
6. **Mega-nav header** (two-deep: bank-wide + domain sub-nav) — extension of tk-navbar
7. **Cookie-consent banner/dialog**
8. **Store-badge row + QR block** (app-distribution cluster)
9. **Bento grid utilities** (asymmetric 2+3, floating CTA over art) — likely STORY/layout
   recipes on existing cards, not new components; warm-cream surface tokens TBD
10. Inline-tooltip trigger buttons (existing tk-tooltip composed — recipe, not component)

## Gaps/notes for UX phase
- Re-capture with scroll+lazy settle: store badges, full hero anatomy (invest-mobile), any
  business page sections below fold.
- Probe the cream/beige business surfaces at native zoom (tint-candidate for the token layer —
  v1 beige #F1EBD2/#F1EBD6 family vs business #EDE3D2/#F1EBE1 — same family? measure).
- Stocks page console had 5 errors (page's own) — noted, not ours.

## UX-phase addendum (2026-09-24)

Method: scroll-settled re-captures, live computed-style probes, real keyboard driving (playwright-cli
`press`), real `hover` for row hover. No data entered anywhere; stocks page left with default «Акции»
chip restored. Cookie dialog: node removed (stocks only, for keyboard tests) — never clicked.

### A. Scroll-settled re-captures — new files

| File | Content |
|---|---|
| `invest-mobile/pattern-hero-full.png` | hero 108–940px: h1 44px bold + subcopy + yellow «Скачать для iOS» CTA + secondary «Скачать для Android» link + phone 3D visual (yellow frame, coins, chart screen) |
| `invest-mobile/pattern-qr-loaded.png` | QR tablist + LOADED QR: 2 tabs «Android 9.0 и выше» (active, white fill + outline) / «Android ниже 9.0» (light-gray); QR in white rounded tile, monochrome |
| `invest-mobile/pattern-store-badges-loaded.png` | badges row: **AppGallery / RuStore / Samsung Store** — custom light-gray (#f5f5f5-ish) pill buttons, brand squircle icon on the RIGHT (inverted vs official badges), uniform size. NO Google Play / App Store (page split: iOS → chat instruction + web-app widget; Android → QR + these stores) |
| `business/full-scrolled.png` | full page after full scroll (lazy art loaded; all 28 imgs complete) |
| `business/pattern-steps-open-account-detail.png` | steps anatomy: 3 WHITE rounded cards on cream; number = **brown rounded-square badge overlapping card top edge, white bold numeral**; centered copy; NO CTA in block |
| `business/pattern-application-form-detail.png` | form anatomy: segmented toggle «Открыть счет»(active,white)/«Открыть бизнес»(beige) → single phone input (rounded, gray placeholder) → 1px divider → consent text left + yellow pill submit right; white card on cream |
| `business/pattern-footer-detail.png` | full link-directory footer (1543px tall) |
| `business/probe-beige-card-hires.png` | hires beige card for tint verification |

Section maps (y-ranges, business 5972px / invest-mobile 5098px tall, both fully loaded after stepwise
scroll; invest-mobile root = flat 26-child div, sections are direct siblings).

Live-page drift note: business header NOW renders «Поиск» icon, mega-menu panels and a «Стать
клиентом» button — richer than the recon note «no CTA»; treat header state as volatile (A/B).

### B. Tint probes — business warm-cream verdict (computed, not eyeballed)

| Surface | rgb | hex | OKLCH (L/C/h) |
|---|---|---|---|
| page/section cream (hero bg, footer strip, «Все сервисы» pill) | 241,238,232 | **#F1EEE8** | 0.950 / 0.009 / 84.6° |
| product card fill (BOTH bento rows; 528×408, radius 24px, shadow none) | 233,224,209 | **#E9E0D1** | 0.910 / 0.022 / 80.7° |
| floating CTA pill on card | 255,255,255 | #FFFFFF | — |
| recon eyeball refs | — | #EDE3D2 / #F1EBE1 | 0.919/0.025/81° · 0.942/0.015/81° |
| v1 beige A | — | #F1EBD6 | 0.939 / 0.029 / **93.8°** |
| v1 beige B | — | #F1EBD2 | 0.938 / 0.034 / **95.9°** |

**Verdict: DISTINCT family (warm-cream), not the v1 beige family.** ΔE_ok(card↔v1A)=0.031 is small,
but the card hue sits at ~81° (orange-leaning) vs v1 beige 94–96° (yellow-leaning) — a systematic
−13° rotation plus lower chroma (0.022 vs 0.029), and the page cream it sits on is nearly neutral
(C 0.009) while v1 beige sits on white. Same "warm neutral tint" genus, different species: propose a
separate warm-cream/sand token pair (surface #F1EEE8 + surface-raised #E9E0D1), not a reuse of beige.

### C. Stocks table — exact colors (computed)

| Probe | Value |
|---|---|
| green delta (e.g. «+56 ₽») | rgb(0,163,40) = **#00A328** — explicit plus sign present |
| red delta (e.g. «−0,9 ₽») | rgb(245,34,34) = **#F52222** |
| row divider | **1px solid rgba(0,16,36,0.12)**, painted on TD border-bottom (row itself borderless) |
| header cell | 15px / 500 / rgba(0,0,0,0.54) / dsText / letter-spacing normal / no case transform |
| row hover (REAL hover, not synthetic) | row bg **rgba(36,74,127,0.06)** (≈#F2F4F7 blended on white); name text stays ink rgba(0,0,0,0.8), NO underline; anchor base color blue-100 #126DF7 (kept for affordance, overridden by inner spans) |

### D. Reference keyboard behavior (stocks catalog) — OBSERVED, fidelity baseline

Tab order (each = one Tab stop): logo → mega-nav (Банк, Бизнес, Инвестиции, Мобильная связь,
Страхование, Путешествия, Долями) → Войти → sub-nav (Обзор, Каталог, Пульс, Аналитика, Академия,
Терминал) → search `role=combobox` → 7 visible chips → «Ещё» → filter buttons (Валюта, Отрасль,
Страна, Биржа, Шорт, Лонг) → **table row anchors (every row is a Tab stop)**.

- **Table:** rows are plain `<a>`; ArrowDown/ArrowUp do NOTHING (no roving tabindex, no
  aria-activedescendant, no grid semantics). **Enter on a focused row NAVIGATES** same-tab to
  `/invest/stocks/{TICKER}/` (verified on GAZP; went back, state restored).
- **Chip tablist:** container IS `role=tablist`, chips are `input[type=checkbox]`
  name=InvestCatalogTabs (10 incl. overflow: Что купить/Акции/Валюта/Фонды/Облигации/Фьючерсы/
  Опционы/Стратегии/Индексы/Избранное). **Arrow keys are INERT** — APG tablist pattern NOT
  implemented; role is cosmetic. Space toggles; semantics are **single-select** despite checkboxes
  (checking «Валюта» auto-unchecks «Акции»); no URL change; **after the re-render focus drops to
  BODY** (reference focus-loss defect — kit should improve on this).
- Kit contract implication: reference baseline = "plain anchors + checkboxes"; our APG-conformance
  layer (roving arrows, aria-activedescendant, focus retention) is an IMPROVEMENT over reference,
  not a fidelity break.

### E. Stocks table typography (product-UI register, all dsText, weight 400)

| Element | size / line-height | color |
|---|---|---|
| company name | 15px / 24px | rgba(0,0,0,0.8) |
| ticker subtext | 13px / 20px | rgba(0,0,0,0.54) |
| price value | 15px | rgba(0,0,0,0.8) |
| «1 лот = N акций» subtext | 13px / 20px | rgba(0,0,0,0.54) |
| delta ₽ value | 15px | #00A328 / #F52222 |
| delta % value | 13px | #00A328 / #F52222 |
| row height | **81px** (two-line cells) | — |

Ink system in product UI = alpha-based on near-black: 0.8 primary, 0.54 secondary, 0.12 hairline —
matches v1 ink tokens; the two brand new semantic values are the deltas (#00A328/#F52222).
