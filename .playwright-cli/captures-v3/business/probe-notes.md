# Probe transcript — business deep round (2026-09-27)

playwright-cli session `tinkoff-ui`, https://www.tbank.ru/business/,
1280×800, pageH 6020. Read-only; cookie banner NOT accepted.

## Cookie banner — pixel scanlines (ImageMagick, ground truth)

PNG `biz-cookie-banner-2026-09-27.png` 212×126.

- y=100 (button row): `13×#FFFFFF` (card) → **68px run of `#F2F4F7`** with
  dark glyph pixels `#323233…#737476` (antialiased «Хорошо») → `131×#FFFFFF`.
  Button box = x≈13..81 (=68px wide, matches computed 68×32), fill
  `#F2F4F7`, light text `#323233`-class. The earlier computed-style reading
  `#244A7F` was a wrong-node artifact — REFUTED by pixels.
- y=30 (first text line): white runs + blue antialias neighbors
  `#A9CAFC` / `#DCE9FE` around link glyphs → blue core ≈ `#2A6DF5` family,
  uppercase, no underline.
- Vision (analyze_image) and scanlines AGREE: white card, ghost-gray button,
  blue link. No dark-blue surface anywhere on the banner.

## Section background map (scroll-aware, ancestor climb)

Sampling: `scrollIntoView` each h1/h2 → `elementFromPoint(640, mid)` → climb
≤12 ancestors to first opaque `background-color`/`background-image`
(elementFromPoint takes VIEWPORT coords — the first round's page-coords bug
returned TRANS everywhere; fixed by scroll-then-sample).

| y (scroll) | Heading (cut) | Paint |
|---|---|---|
| 0 (hero) | h1 «Банк для бизнеса…» | `#F1EEE8` |
| 236 | Узнайте, какие сервисы… | `rgb(255,255,255)` (2 hops) |
| 1284 | Популярные банковские продукты… | white (2 hops) |
| 2520 | Откройте счет для бизнеса… | white (4 hops) |
| 3024 | Оставьте заявку на расчетный… | white (4 hops) |
| 3413 | Пользуйтесь сервисами банка… | white (2 hops) |
| 3825 | Приложение «Т-Бизнес» | white (4 hops) |
| 4157 | Узнать больше о продуктах… | white (2 hops) |

## Misc identities

- `.abys6c56J` (fixed, 1280×168 viewport rect, z100) = burger drawer;
  content: «Расчетный счет / Регистрация бизнеса / Кредиты / Прием платежей
  / Бухгалтерия / Отраслевые реш…»; transparent in closed state. NOT a page
  section — the earlier #F1EEE8 attribution to it was incidental.
- Lazy warm-up: 40×500px scroll steps @260ms → pageH stable 6020, then
  full-page capture (no click-through anywhere).
