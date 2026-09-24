# Story 6.5 — stocks catalog COMPOSITION evidence (2026-09-25)

Reference: T-Bank invest/stocks catalog,
`.playwright-cli/captures-v2/invest-stocks/full.png` (1280×2028; top 800px
cropped as `reference-top.png`). The kit render is the composed showcase
story AS SHIPPED — no attribute fiddling, no interaction.

## Files

| File | What |
|---|---|
| `stockscatalog-side-by-side-light.png` / `-dark.png` | reference top (top) vs kit page viewport (bottom), 2px gray hairline between |
| `kit-page-light.png` / `kit-page-dark.png` | the composed story at rest, 1280×800 viewport — the pinned capture env |
| `reference-top.png` | the reference crop itself (1280×800) |
| `stocks-catalog-capture.mjs` | the committed capture recipe |
| `walkthrough.md` | the recorded keyboard walkthrough (THE deliverable) — step table + screenshots |
| `wt-01…wt-08*.png` | walkthrough stills: search panel open, commit, zero-state, «Ещё» menu, table roving, page-2 slice, load-more collapse, dark page |

Reference crop: `magick .playwright-cli/captures-v2/invest-stocks/full.png -crop 1280x800+0+0 +repage reference-top.png`

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6016 &
node .playwright-cli/verify/stocks-catalog/stocks-catalog-capture.mjs   # COMMITTED alongside this NOTES
magick reference-top.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-page-light.png -background white -append stockscatalog-side-by-side-light.png
magick reference-top.png -bordercolor '#E0E2E4' -border 0x2 \
  kit-page-dark.png -background white -append stockscatalog-side-by-side-dark.png
```

Pinned capture env identical to the visual suite (tests/visual/README):
1280×800, DSF 1, `--font-render-hinting=none --disable-lcd-text`,
reducedMotion reduce, colorScheme light, locally-served DaytonaSans/Inter.

## Assembly check (vision-assisted read of the side-by-side, 2026-09-25)

The STANDARD here is ASSEMBLY (spec ruling): reading order, cluster,
wiring — per-pixel truing belongs to each component's own NOTES.

| Aspect | Reference | Kit | Verdict |
|---|---|---|---|
| Reading order | nav row 1 → sub-nav row 2 → title → search → chip row → table | identical sequence | match |
| Two-deep nav | 6 items + Войти; «Инвестиции» active (underline); row 2 «Каталог» active | identical set + «Поиск» icon utility; same actives | match |
| Controls cluster | borderless search («Название или тикер») above the chip row | identical (same placeholder, same cluster order) | match |
| Chip row | Что купить / **Акции**(selected) / Валюта / Фонды / Облигации / Фьючерсы / Опционы / Ещё | identical set, same selected chip | match |
| Table anatomy | name+ticker left; price over lot right-aligned; day change right-aligned, colored | identical two-line cells, same alignment | match |
| Table columns | 4 columns incl. «За год» + sort arrows | 3 columns (Название/Цена/Изменение за день, %), no sort | **scope fence (6.4)**: no sorting, no year column in v2 |
| Secondary filter dropdowns | a «Валюта/Отрасль/Страна/Биржа» dropdown row under the title | absent — the composed controls are the spec's named five surfaces | scope fence (spec composition list) |
| Cookie dialog | live in the capture (see captures-v2/invest-stocks/cookie-dialog-*) | absent — tk-cookie-banner is its own story (7.2), not part of this composition | scope fence |
| Page heading | «Каталог акций» | «Каталог» + subtitle | copy delta (assembly-level parity; RU copy per spec) |
| Dataset order | Газпром/ЛУКОЙЛ/Озон first | Сбербанк first (alphabetical-ish demo set of 24) | dataset choice (real tickers, in-file data per spec) |
| Pagination | below the fold in this crop | «Показать еще» + numbers under the table | present (wt-06/wt-07) |

## Wiring verification (live, playwright-cli)

Every control is REAL on this page (details + probe evidence in
`walkthrough.md`): search commit re-filters by name/ticker substring
(«СБ» → Enter «Сбербанк» → 2 rows), chips swap the section facet AND the
search needle («Валюта» × «Сбербанк» → «Нет данных» with controls
operable, «Акции» back → 2 rows), pagination slices the FILTERED set
(page 2 = 3 of 13 rows, focus lands on the newly-active number), «Показать
еще» grows the window 10 → 20 (13 rows, numbers row hides at count=1,
focus stays on the bar). The full keyboard journey — 14 nav stops, the
search panel, the tablist, the «Ещё» menu, the roving table, the pager —
is the recorded walkthrough (walkthrough.md, S1–S39).

## Verdict

The composition reads as the reference's catalog page: same skeleton, same
cluster, same alignment rhythm, live wiring end to end. The deltas above
are the v2 scope fences (table columns/sorting, secondary dropdown row,
cookie overlay) and demo-dataset choices — none is an assembly defect.
