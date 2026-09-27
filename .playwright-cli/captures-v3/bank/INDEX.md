# Live captures v3 — tbank.ru retail (bank vertical) round (2026-09-27)

First capture pack for the **tinkoff-bank** subproject (the kit's Bank docs
group: Homepage + Application form). Same discipline as the business round —
read-only, nothing entered/submitted, no cookie-wall interaction, browser =
playwright-cli only, pixels are ground truth.

Session: `playwright-cli -s=bank-capture`, 1280×800. Surfaces: the retail
homepage `https://www.tbank.ru/` (pageH 9221, 47 images / 11 lazy — all
decoded by the warm-up scroll before the full-page capture) and the debit-card
application form `https://www.tbank.ru/cards/debit-cards/tinkoff-black/#form`
(pageH 6991; form at y≈1880, H 844 — reached by anchor + scrollIntoView, no
field touched).

## Files

| File | Content |
|---|---|
| `bank-viewport-2026-09-27.png` | Homepage top viewport: header + white hero (products grid entry) |
| `bank-fullpage-2026-09-27.png` | Homepage full-page atlas (9221px) after the lazy warm-up scroll |
| `bank-form-section-2026-09-27.png` | Debit-card application form viewport («Оформите Black за минуту») |

## Probe findings (raw numbers in `probe-notes.md`)

- **Two-tone map (retail):** homepage hero and ALL probed sections = pure
  white `rgb(255,255,255)` — the retail sheet is single-tone white, vs the
  business vertical's beige-intro `#F1EEE8` + white body. Vertical identity
  lives in content, not backdrop, on retail.
- **Type:** h1/h2 = 44px/700, ink `rgba(0,0,0,0.8)` — identical scale to the
  business vertical (the kit's existing heading mapping holds cross-vertical).
- **Form submit «Продолжить»:** 56×127, fill `#FFDD2D` (the brand yellow),
  ink `rgb(51,51,51)`, **r12, height 56 = the kit's hero tier** — a live
  cross-vertical data point for the button-tier record: the RETAIL form submit
  is hero-tier 56 (the kit's Bank/Application form composes the same class).
- **Form card:** white on white-page (no tinted card); field chrome rides on
  remote CSS classes (computed wrappers transparent) — the VISUAL field truth
  is the capture PNG (pixel-probe on demand when a bank-form story speccing
  needs it).
- **No cookie banner surfaced** on the retail session (the business vertical
  showed one same-day) — per-surface consent state differs; recorded as-is,
  no state forcing.

## Subproject grounding

`tinkoff-bank` reference stock. Domain designated by the maintainer (carried
from the subprojects direction): tbank.ru retail homepage + product form
surfaces. The ТЖ vertical is reserved-later (see `../INDEX.md`).
