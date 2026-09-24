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
