# Composites order — baseline-review-v180 (batch-confirm v1.8.0)

Source: `tests/visual/visual.spec.ts-snapshots/*-1-chromium.png` (read-only).
Recipe per tile: `convert FILE -resize 560x` (aspect preserved). Rows: `+append`, 4 tiles per row (last partial row = as many as remain). Rows stacked: `-append`.
NO text labels burned into tiles (font trap) — this sidecar is the authoritative tile order.

Layout facts (verified by pixel probe on G1-row1):
- tiles in a row are TOP-aligned; a shorter tile is padded to the row height with the ImageMagick default background (white) at the bottom;
- a last partial row of 2 tiles (1120 px) is padded with white on the right up to the full composite width (2240 px). G7 has a single 2-tile row → composite is 1120 px wide, no padding;
- white padding is layout chrome, NOT page content — vision-QA must ignore it, especially inside dark-theme composites.

Tile order inside each group: story order, `light` then `dark` per story (identical to `work/passports.tsv` row order).

---
## composite-G1.png  —  2240x1061 px, tiles 10

- row 1:
  1. visual-components-rangeslider--accessibility-light-1-chromium.png — tile 560x306
  2. visual-components-rangeslider--accessibility-dark-1-chromium.png — tile 560x306
  3. visual-components-rangeslider--api-light-1-chromium.png — tile 560x581
  4. visual-components-rangeslider--api-dark-1-chromium.png — tile 560x581
- row 2:
  5. visual-components-rangeslider--calculator-light-1-chromium.png — tile 560x259
  6. visual-components-rangeslider--calculator-dark-1-chromium.png — tile 560x259
  7. visual-components-rangeslider--playground-light-1-chromium.png — tile 560x210
  8. visual-components-rangeslider--playground-dark-1-chromium.png — tile 560x210
- row 3:
  9. visual-components-rangeslider--variants-light-1-chromium.png — tile 560x221
  10. visual-components-rangeslider--variants-dark-1-chromium.png — tile 560x221

## composite-G2.png  —  2240x1187 px, tiles 10

- row 1:
  1. visual-components-switch--accessibility-light-1-chromium.png — tile 560x294
  2. visual-components-switch--accessibility-dark-1-chromium.png — tile 560x294
  3. visual-components-switch--api-light-1-chromium.png — tile 560x567
  4. visual-components-switch--api-dark-1-chromium.png — tile 560x567
- row 2:
  5. visual-components-switch--playground-light-1-chromium.png — tile 560x186
  6. visual-components-switch--playground-dark-1-chromium.png — tile 560x186
  7. visual-components-switch--settings-light-1-chromium.png — tile 560x413
  8. visual-components-switch--settings-dark-1-chromium.png — tile 560x413
- row 3:
  9. visual-components-switch--variants-light-1-chromium.png — tile 560x207
  10. visual-components-switch--variants-dark-1-chromium.png — tile 560x207

## composite-G3.png  —  2240x893 px, tiles 12

- row 1:
  1. visual-components-avatar--accessibility-light-1-chromium.png — tile 560x285
  2. visual-components-avatar--accessibility-dark-1-chromium.png — tile 560x285
  3. visual-components-avatar--admin-feed-light-1-chromium.png — tile 560x288
  4. visual-components-avatar--admin-feed-dark-1-chromium.png — tile 560x288
- row 2:
  5. visual-components-avatar--api-light-1-chromium.png — tile 560x408
  6. visual-components-avatar--api-dark-1-chromium.png — tile 560x408
  7. visual-components-avatar--news-row-light-1-chromium.png — tile 560x349
  8. visual-components-avatar--news-row-dark-1-chromium.png — tile 560x349
- row 3:
  9. visual-components-avatar--playground-light-1-chromium.png — tile 560x177
  10. visual-components-avatar--playground-dark-1-chromium.png — tile 560x177
  11. visual-components-avatar--variants-light-1-chromium.png — tile 560x197
  12. visual-components-avatar--variants-dark-1-chromium.png — tile 560x197

## composite-G4.png  —  2240x1986 px, tiles 18

- row 1:
  1. visual-components-input--accessibility-light-1-chromium.png — tile 560x554
  2. visual-components-input--accessibility-dark-1-chromium.png — tile 560x554
  3. visual-components-input--api-light-1-chromium.png — tile 560x713
  4. visual-components-input--api-dark-1-chromium.png — tile 560x713
- row 2:
  5. visual-components-input--code-accessibility-light-1-chromium.png — tile 560x317
  6. visual-components-input--code-accessibility-dark-1-chromium.png — tile 560x317
  7. visual-components-input--code-mode-light-1-chromium.png — tile 560x297
  8. visual-components-input--code-mode-dark-1-chromium.png — tile 560x297
- row 3:
  9. visual-components-input--confirmation-light-1-chromium.png — tile 560x268
  10. visual-components-input--confirmation-dark-1-chromium.png — tile 560x268
  11. visual-components-input--playground-light-1-chromium.png — tile 560x154
  12. visual-components-input--playground-dark-1-chromium.png — tile 560x154
- row 4:
  13. visual-components-input--theming-light-1-chromium.png — tile 560x450
  14. visual-components-input--theming-dark-1-chromium.png — tile 560x450
  15. visual-components-input--value-modes-light-1-chromium.png — tile 560x321
  16. visual-components-input--value-modes-dark-1-chromium.png — tile 560x321
- row 5:
  17. visual-components-input--variants-light-1-chromium.png — tile 560x238
  18. visual-components-input--variants-dark-1-chromium.png — tile 560x238

## composite-G5.png  —  2240x327 px, tiles 6

- row 1:
  1. visual-components-textarea--accessibility-notes-light-1-chromium.png — tile 560x141
  2. visual-components-textarea--accessibility-notes-dark-1-chromium.png — tile 560x141
  3. visual-components-textarea--notes-light-1-chromium.png — tile 560x180
  4. visual-components-textarea--notes-dark-1-chromium.png — tile 560x180
- row 2:
  5. visual-components-textarea--states-light-1-chromium.png — tile 560x147
  6. visual-components-textarea--states-dark-1-chromium.png — tile 560x147

## composite-G6.png  —  2240x2073 px, tiles 6

- row 1:
  1. visual-components-button--api-light-1-chromium.png — tile 560x553
  2. visual-components-button--api-dark-1-chromium.png — tile 560x553
  3. visual-invest-terminal-ticket--terminal-ticket-light-1-chromium.png — tile 560x373
  4. visual-invest-terminal-ticket--terminal-ticket-dark-1-chromium.png — tile 560x373
- row 2:
  5. visual-token-reference--colors-light-1-chromium.png — tile 560x1520
  6. visual-token-reference--colors-dark-1-chromium.png — tile 560x1520

## composite-G7.png  —  1120x1894 px, tiles 2

- row 1:
  1. visual-getting-started--page-light-1-chromium.png — tile 560x1894
  2. visual-getting-started--page-dark-1-chromium.png — tile 560x1894

