# 22.6 price-ticket — grounding notes (2026-10-02)

Sources: `.playwright-cli/captures-v4/invest/{stock-sber, future-aez6,
currency-usd000utstom}.png` (live reference, 1280-wide pages). Sidebar crops
`crop-{stock,future,currency}.png` = 460x1000+820+0; contact sheet
`contact-ticket.png`. Discovery lens (MCP, contact sheet): structure only.
All numbers below are PIXEL-PROBED (rowprobe.pl / colprobe.pl + point
samples), the 22.5 arbitration mold — two lens claims refuted (below).

## The crop trap (lesson)

The +820 crop slices INTO the ticket card: the card's real page-x extent is
804..1051 (left border found by probing the SOURCE page; at mid-card the crop
shows no left border at all — only the right hairline at crop x=231 with its
corner arc). Card center page 927.5 = crop 107.5 — exactly the measured
center of every text band, which is how the centering was proven.

## Measured anatomy (identical byte-for-byte across all three pages:
card y=187..440, yellow px count 11056, blue 848 — one parametric component)

| measurement (crop coords) | value | kit decision |
|---|---|---|
| card box | page x 804..1051 (w 247), y 187..440 (h 254) | consumer-width sidebar card; host block |
| card fill | #FFFFFF | `surface-base` — byte |
| card border | 1px #E7E8EA hairline, all four sides | `gray-200` — BYTE-EXACT (new `--tk-promo-card-border` hook) |
| card radius | right-arc fit r≈23.5–24.8 (3 anchor points); left arc converges same | `--tk-radius-xl` 24 — byte-fit (the 22.5 rim) |
| label «Цена акции 1 октября 2026» | band 217..226 (10 rows ≈13.5–14px), core #757575, centered | body-s 13 (+1 recorded), `text-secondary` #616871 (live neutral gray deviates — Δ recorded; AA 5.64), centered |
| value «275,79 ₽» | band 250..267 (18 rows → ≈25.4px digits), core #333333, bold, centered | heading-5 24 (−1.4 recorded) + weight 700 LITERAL (register says 500 — the 22.5 name precedent), `text-primary` — byte |
| value suffix «₽» | same run, same size/weight | part of the value slot content (consumer string) |
| CTA «Открыть счет» | yellow 296..351 (h 56), x 825..1030 (inset 21/21 symmetric), r≈13.5, fill #FFDD2D, text #333333 | CONSUMER-SLOTTED tk-button primary — the pair IS the kit's existing button (yellow-100 + text-primary, byte). Live h56 vs kit 44 (A11y floor is law) — height not ours, recorded |
| note line 1 «Если у вас уже есть счет,» | band 381..391 (≈15px), #333333, centered | body-m, `text-primary`, centered |
| note line 2 (link) «войдите в личный кабинет» | band 405..412, core #126DF7, centered | body-m; the note slot carries consumer link content (tk-link in stories); `--tk-color-link` #1771E6 is the kit's AA-tuned pair (live #126DF7 deviates — Δ recorded, color is consumer-side in the slot) |
| note line pitch | 381→405 = 24px | body-m + line-height 24px capture literal (the data-table leading family) |
| side inset (button = content box) | 21px from card edges | content column ≈ 205: `--tk-space-20` (+1 recorded) |
| padding top | 187→label glyph 217 = 30 → box ≈25.5 | `--tk-space-24` (+1.5 recorded) |
| padding bottom | note glyph 412→440 = 28 → box ≈20.5 | `--tk-space-20` (+0.5) |
| gap label→value | glyph 226→250 = 24 → margin ≈12 | `--tk-space-12` (label+value head block) |
| gap value→CTA | glyph 267→296 = 29 → margin ≈22 | `--tk-space-24` (+2, nearest step) |
| gap CTA→note | 351→381 = 30 → margin ≈23.5 | `--tk-space-24` (+0.5) |

Derivation: ink-gaps converted to box margins by subtracting half-leading of
the adjacent line boxes (label 13/19, value 24/30, note 15/24).

## Lens claims refuted by probes (contact-sheet lens)

1. «Label and value left-aligned» — FALSE: every band's center = 107.5 crop-x
   (= card center 927.5 page-x); the whole stack is CENTERED.
2. «CTA full-width of card content area» — HALF-FALSE: the button spans a
   205px column inset 21/21 (its own content box, wider than the text
   measure); the texts are centered within that same 205px column.

## Kit mapping summary

Vertical ticket = `variant="ticket"` on tk-promo-card: prop `label`, slots
`value` / `note`, CTA through the EXISTING `actions` slot. White surface-base
card + gray-200 hairline (the ONLY new hook: `--tk-promo-card-border`),
radius-xl, centered stack. No gradients, no media, no minted tokens.
