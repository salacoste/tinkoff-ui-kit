# Live captures v3 — tbank.ru/business deep round (2026-09-27)

Maintainer-sanctioned deep-capture round («забери с этой страницы больше рефов»):
backgrounds, UI/UX elements not yet in the v2 pack. Same discipline as v2 —
read-only, nothing entered/submitted, cookie banner NOT accepted, browser =
playwright-cli only, pixels are ground truth.

Session: `playwright-cli -s=tinkoff-ui`, 1280×800, page
<https://www.tbank.ru/business/>, pageH 6020 (stable through the round; 27
images, 6 `loading=lazy` — all decoded by the warm-up scroll before the
full-page capture).

## Files

| File | Content |
|---|---|
| `biz-viewport-2026-09-27.png` | Top viewport: sticky header (logo, burger, yellow CTA «Стать клиентом» r8) over the beige hero |
| `biz-cookie-banner-2026-09-27.png` | **LIVE cookie banner** — the 7.2(c) re-measure material (see below) |
| `biz-form-section-2026-09-27.png` | Application-form section viewport (scroll y≈2960): form card + submit «Открыть счет» |
| `biz-fullpage-2026-09-27.png` | Full-page atlas (6020px) after the lazy-warm scroll — section order + palette at a glance |

## Probe findings (raw numbers in `probe-notes.md`)

- **Section background map:** hero = `#F1EEE8` (beige); ALL seven content
  sections = pure white `rgb(255,255,255)` (ancestor-climb sampling — the
  section nodes themselves paint nothing). The page is a two-tone sheet:
  beige intro, white everything-else.
- **LIVE cookie banner (desktop):** bottom-**RIGHT**, inset 16px right /
  16px bottom — **the kit's 7.2 banner is bottom-LEFT; genuine divergence**
  (the open deferred-work flag 7.2(c) called the bottom-left a judgment).
  Compact card 212×126, white, r≈16, shadow `rgba(0,0,0,0.16) 0 8px 28px`,
  padding 12. Text 3 lines + link «куки»: bright blue (core ~#2A6DF5 by
  antialias neighbors), rendered UPPERCASE, no underline. Button «Хорошо»
  68×32, fill `#F2F4F7` (pixel-scanline-verified; an earlier computed-style
  probe's `#244A7F` was a wrong-node artifact), ink `#323233`-class, r8.
- **CTA radius split (yellow #FFDD2D, ink rgb(51,51,51)):** header
  «Стать клиентом» r8 · hero «Подобрать варианты» r12 · form «Открыть счет»
  r12 — three radii on one page, context-tiered.
- **Secondary controls:** hero service toggle («Открыть счет»/«Открыть
  бизнес») transparent fill, r6, thin border.
- **Type:** h1/h2 = 44px/700, ink `rgba(0,0,0,0.8)`.
- `abys6c56J` (the fixed 1280-wide strip identified last round) = the burger
  drawer (fixed, z100; transparent/closed in default state) — not a page
  surface.

## Subproject grounding

This is the first capture round under the maintainer's subprojects direction
(tinkoff-bank / tinkoff-business / ТЖ later / tinkoff-invest inside the kit) —
`tinkoff-business` reference stock. Domains designated by the maintainer
(carried from v2): tbank.ru/business, tbank.ru/invest/mobile-application,
tbank.ru/invest/stocks.
