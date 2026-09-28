# Live captures v3 — ТЖ (Тиньков Журнал) round (2026-09-28)

First capture pack for the **ТЖ vertical** — opened on the maintainer's
directive (2026-09-28): «Тиньков Журнал (ТЖ) делаем отдельным под ui kit,
чтобы он выделялся и мог быть экспортирован как отдельная сущность, а не
целый большой проект с другими поддоменами». This pack is the recon ground
for the epics-v5 planning chain (BMAD — starts on the maintainer's word).

Discipline (the standing iron rules): READ-ONLY on the live reference —
nothing typed, nothing submitted, no login; browser = playwright-cli only
(session `tinkoff-ui`, persistent, 1280×720); pixels + computed styles are
ground truth (cross-origin CSS wall — see probe-notes).

## Files

| File | Content |
|---|---|
| `tj-home-viewport-2026-09-28.png` | Home /: promo strip + header + hero cards (light) |
| `tj-home-fullpage-2026-09-28.png` | Home full-page atlas |
| `tj-home-dark-viewport-2026-09-28.png` | Home / in DARK (native prefers-color-scheme) |
| `tj-article-viewport-2026-09-28.png` | Article: hero card + floating yellow promo |
| `tj-article-fullpage-2026-09-28.png` | Article full-page (Charter body, H1 45) |
| `tj-rubric-news-viewport-2026-09-28.png` | /flows/news/ rubric header + first feed card |
| `tj-rubric-news-fullpage-2026-09-28.png` | News rubric full-page |
| `tj-pro-viewport-2026-09-28.png` | /pro/: purple hero card + tag-chip nav |
| `tj-pro-fullpage-2026-09-28.png` | Учебник full-page (featured 55/700) |
| `tj-community-viewport-2026-09-28.png` | /community/: composer + Выбор редакции grid |
| `tj-community-fullpage-2026-09-28.png` | Сообщество full-page |

## Probe findings (raw transcripts in `probe-notes.md`)

- **Own token system, disjoint from the bank kit:** page `#F0F0F0` (light) /
  `#12151C` (dark); cards `#FFFFFF` / `#20232A`; headline ink PURE BLACK;
  meta ink `#A6A6A6`; dividers `#E5E5E5` / `#3E4146`; **gold `#C79637` =
  editorial link accent (384 uses)**; primary CTA «Написать» = `#333` r5 h30
  (near-black, NOT the bank's yellow r12 h56 hero tier — completely different
  button language).
- **Dark mode is native prefers-color-scheme** (no forced class): page/cards/
  dividers/meta remap as a coherent set; CTA inverts to near-white pill
  `#F5F5F9`/black ink; yellow survives only inside promo-card art.
- **Typography is a TWO-FAMILY system, distinct from the bank stack:**
  UI = **Graphik** (grotesque); article BODY = **Charter (serif)** — lead
  27/400/35, body 21/400/30, H1 45/700/50 w764, in-body H2 38/700/45,
  pull-quote 35/400/50. Corrects the earlier home-vision claim of a
  single-sans site. Heads stay grotesque; serif is the reading register.
- **h1 scale per surface:** home hero 21 (card scale) · article 45 ·
  rubric/community 38 · /pro/ 32 · featured course display 55.
- **Accents are tightly scoped:** purple `#8054FF` exists ONLY as the 30×30
  circular «Учебник» badge; yellow `#FFDD2D` + navy `#06101E` appear ONLY in
  native-ad promo modules (760×350/220, r25, bank-style yellow CTA 210×50
  r10 17px) — **the editorial/ad language split** (below).
- Vision structure notes: rubric header = cover image + 100×100 squircle
  app-icon overlapping the boundary; /pro/ hero = purple card with
  translucent-white chip nav; /community/ = composer card + 3×2 flat grid
  with carousel arrow; RU hyphenation ON (visible in clamped titles).

## The editorial-vs-ad language split (architectural)

Two disjoint design languages share the page:

1. **Editorial chrome (the ТЖ identity):** Graphik, black ink on white cards
   over `#F0F0F0`, `#333` CTA, gold links, gray meta, hairline dividers,
   serif reading register, dark = coherent cool-dark set.
2. **Native-ad modules (bank language):** yellow/navy, r25 cards, yellow
   r10 CTAs, 3D illustration art — visually IDENTICAL to the tbank.ru
   promo-card family the main kit already ships.

Implication for epics-v5: the ТЖ sub-kit owns language 1 (its own tokens,
fonts, component roster); language 2 can REUSE the existing main-kit promo
components — the two kits meet only at ad modules.

## Separate-exportable-kit grounding

- **Own domain:** `t-j.ru` — a different origin from `tbank.ru`, own CSS
  delivery (CDN), own font contracts (Graphik + Charter vs the bank's
  Haas/Pragmatica = DaytonaSans/DaytonaPragma in the kit). Zero shared
  token pipeline observed.
- **Own component roster candidates (from this recon):** article body + H1 +
  pull-quote + byline/engagement bar; rubric header (cover + squircle) +
  news card; /pro/ purple hero + tag-chip nav + course card; /community/
  composer + post card; header (МЕДИА Т-БАНКА sticker, nav chips, «Написать»
  CTA) + sidebar rubric rail; dark mode as a first-class native theme.
- **Package decision is an ARCHITECTURE-phase question** (epics-v5 BMAD
  chain): a `pillkit-tj` workspace package reusing the build/CEM/React
  machinery vs a separate repo — not pre-decided here; this pack supplies
  the evidence, the maintainer directive supplies the constraint
  (exportable as a separate entity, no forced pull of the main kit).
