# Story 7.5 — invest-mobile landing composition evidence (2026-09-25)

Composition: `packages/components/src/showcase/invest-landing.stories.ts`
(story `showcase-invest-landing--invest-landing`). References:
`.playwright-cli/captures-v2/invest-mobile/` — `full.png` (1280×5098),
`pattern-hero-full.png` (hero band, page y 108–940),
`pattern-header-consumer.png`, `pattern-qr-loaded.png`,
`pattern-store-badges-loaded.png`.

## Method (capture recipe — reproduce)

- **Deterministic first, vision second.** Page structure was mapped by
  stdlib PNG scans over `full.png` (zlib decode, filters 0–4): per-row
  luminance classes, ≥200px gray (#F0–F7) runs, 150px-window black-density
  windows, blue-link rows, and per-column dark-pixel profiles per text band
  (word-group x-ranges → centering proofs). Scratch scripts: row scan,
  exact-row cropper, column profiler, region dark-fraction checker
  (all /tmp, not committed — the recipe below re-derives anything).
- **Vision only as a cross-check**, on tight crops upscaled 4–8x
  (glyph-level reads: headings, tab labels, captions), and never trusted
  for y/x placement unless it matched a deterministic anchor. Three vision
  positional claims were **discarded** after contradicting the pixel scans
  (a «QR block at y≈2770–2910» that is actually the stores heading +
  badges; a «title at y≈1845–1885» band with ZERO dark pixels; a «terminal
  card» placed at three different y by three calls). Every coordinate in
  this NOTES comes from the scans.
- **Blocked-protocol note:** the analysis used the frozen captures only —
  the live site was never driven (browser protocol stayed blocked), and no
  site-vs-kit pixel diff was attempted (AD-8 / OQ-2: baselines are
  kit-vs-kit; reference fidelity is this human-readable side-by-side).

## Measured page map (full.png, page y-coordinates)

| Zone | y | Evidence |
|---|---|---|
| Header | 0–~56 | pattern-header-consumer: one row, yellow Т shield left; links «Частным лицам / Бизнесу / Премиум / Ещё»; search icon + «Личный кабинет» right |
| Hero h1 | 188–235 | «Мобильное приложение Т-Инвестиций», 44px bold, 1 line, centered (pattern-hero-full 80–130 upscaled 3x, read verbatim) |
| Hero subcopy | 256–293 | «Простой и удобный доступ к мировым фондовым рынкам», ~16–17px, centered |
| Hero CTA row | 318–378 | yellow pill «Скачать для iOS» (~155×50) + dark text link «Скачать для Android» on the SAME row, centered (upscaled 4x, verbatim) |
| Phone art | ~438–750 | centered ~215×380: yellow frame, coin stacks, chart screen |
| QR title | 1735–1782 | «Вариант 2. Отсканируйте QR-код» bold centered (x 338–942, center 640; word-profile «Вариант» 101px + digit-group 19px; upscaled 4x read) |
| QR paragraph | 1780–1862 | TWO explanatory lines, x≈239–1041 (page copy — see delta 3) |
| QR tabs | 1900–1940 | «Android 9.0 и выше» (active, white + outline) / «Android ниже 9.0» (gray fill), centered (upscaled 6x, verbatim) |
| QR tile | 1975–2195 | 210×210 white rounded tile, centered (x 535–745); inner 45.9% pure-black modules — a REAL rendered QR |
| Steps heading | 2255–2275 | «Как установить приложение» bold centered (x 492–788, center 640; upscaled 6x, verbatim) |
| Step cards | 2325–2760 | three columns x≈88–424 / 473–807 / 857–1191: dialog screenshots + caption text (captions verbatim in the story's INSTALL_STEPS) |
| Stores heading | 2838–2880 | «Вариант 2. Скачивайте нас в доступных магазинах приложений» bold centered (x 247–1032, center 639.5; digit verified at 8x) |
| Badges | 2908–2985 | AppGallery / RuStore / Samsung Store pills, x≈88–424 / 518–744 / third right |
| Next section | 3080–3125 | «Веб-терминал Т-Инвестиций» + terminal card 3184–3506 — OUT of composition scope |
| Footer | 3722–5098 | sitemap + dark footer — OUT of scope |

## Assembly deltas (measured vs the frozen spec premises)

1. **Install-cluster ORDER.** Spec frozen assumption: qr → store-badges →
   stepper («reference order»). Measured on `full.png`: **qr → steps
   («Как установить приложение») → stores** — steps cards y 2325–2760 sit
   ~110px ABOVE the stores heading y 2838. Disposition: the composition
   follows the CAPTURE (the spec's own header ruling pattern — probe;
   follow), the story header + this note record the correction. The spec
   file in `_bmad-output/` is never edited from a story.
2. **Two «Вариант 2» headings.** Both the QR title and the stores heading
   measure digit **2** (8x glyph close-ups; QR title also 7.3-frozen from
   pattern-qr-loaded). Composed verbatim as measured — an upstream CMS
   quirk of the reference, not ours to renumber.
3. **Reference paragraph inside the QR zone.** The page carries a two-line
   explanatory paragraph (y 1780–1862) between the QR title and the tabs.
   `tk-qr-block`'s 7.3 anatomy is title → tabs (+per-tab note) → tile with
   NO page-copy slot, so the paragraph is not composed. Recorded as an
   observation for the maintainer (a `note`-level page-copy slot could be
   a future API discussion — NOT patched here; showcase stories never edit
   kit components).
4. **Install steps copy.** The reference's step cards carry dialog
   screenshots + captions, NO number badges and NO titles. tk-stepper is
   composed per its OWN anatomy (numbered cards, title + text): step
   TEXTS ride the captions verbatim, step TITLES are the story's derived
   one-liners over each caption's semantics (download warning →
   permission → install), documented in the story source.
5. **Hero CTA metrics.** Reference pill ≈155×50; composed tk-button
   primary/hero is the kit's 56px class. Assembly-level standard (the
   pair's structure — one primary pill + one secondary link on a row — is
   what the composition pins); the pill's own metrics are the button
   component's verified class, not re-trued per-pixel here.
6. **Phone art is placeholder art** (the spec's ruling): abstract phone —
   yellow frame, chart bars, coin discs — with fills READ from the token
   layer via getComputedStyle (2.6 technique). No brand art, no text
   glyphs (raster determinism).
7. **Badge icons are neutral placeholders** (7.3 iron rule: zero
   third-party marks in the repo); the reference shows real Huawei /
   RuStore / Samsung marks. `iconSrc` stays consumer data.
8. **QR art is a deterministic placeholder** (finder squares + seeded
   modules); the reference renders a real QR (45.9% black inner). The kit
   never generates QR encodings (7.3).
9. **Header.** Capture shows the v1 consumer navbar shape (one row, no
   subLinks) — composed as the spec's default with the capture's verbatim
   link set («Ещё» with ё) and utilities (search icon + «Личный кабинет»).
10. **h1 register.** Reference 44px bold = heading-2 metrics EXACTLY
    (`--tk-text-heading-2-*` 44/700/1.15) — the 6.1 register mapping,
    zero new type tokens (verified against packages/tokens/src/tokens.css:91-93).

## Ground-truth probes: hero geometry (pattern-hero-full)

| Aspect | Reference (measured) | Composition |
|---|---|---|
| h1 | 44px/700, 1 line, centered | heading-2 tokens (44/700/1.15), centered, max-width 700px |
| Subcopy | ~17px secondary, centered, ~28px below h1 | body-l tokens, text-secondary, space-24 |
| CTA row | pill + link on one row, centered | flex row, center, gap space-16/24, wraps <768 |
| Phone | ~215×380 centered, ~60px below the row | 216px art block, space-64 above |
| Hero band | 108–940 on the page, white surface | surface-base, space-96/64 rhythm |

## Side-by-side files

| File | Pair |
|---|---|
| `side-by-side-hero.png` | reference hero (pattern-hero-full) over the kit hero region |
| `side-by-side-cluster.png` | reference install cluster (full.png y 1700–3010) over the kit cluster region |
| `reference-hero.png`, `reference-cluster.png`, `kit-hero.png`, `kit-cluster.png` | the individual crops |

Produced from the committed light baseline (the story's own visual.spec.ts
baseline; AD-8: the pairs are human-reference evidence, never a pixel-diff
gate). Actual commands used:

```sh
# kit regions: crop the story's light baseline (visual.spec.ts-snapshots)
magick tests/visual/visual.spec.ts-snapshots/visual-showcase-invest-landing--invest-landing-light-1-chromium.png -crop 1280x908+0+52 +repage kit-hero.png
magick tests/visual/visual.spec.ts-snapshots/visual-showcase-invest-landing--invest-landing-light-1-chromium.png -crop 1280x1312+0+958 +repage kit-cluster.png
# reference regions
magick .playwright-cli/captures-v2/invest-mobile/pattern-hero-full.png -gravity center -background white -extent 1280x reference-hero.png
magick .playwright-cli/captures-v2/invest-mobile/full.png -crop 1280x1310+0+1700 +repage reference-cluster.png
# pairs: reference on top, kit below, 2px #E0E2E4 hairline
magick reference-hero.png -bordercolor '#E0E2E4' -border 0x2 kit-hero.png -background white -append side-by-side-hero.png
magick reference-cluster.png -bordercolor '#E0E2E4' -border 0x2 kit-cluster.png -background white -append side-by-side-cluster.png
```

Kit crop offsets (from a row-luminance scan of the baseline): navbar ends
~y52; hero band 52–960 (yellow phone art ~411–467); cluster 958–2270
(QR modules ~1124–1292, stepper heading ~1458, badge pills ~2017–2192);
docs block from ~2274.

## Kit-component gaps FOUND (reported, not patched)

- `tk-qr-block` has no slot for page-level copy between the title and the
  tablist (delta 3) — the reference page pattern (heading → paragraph →
  switcher) cannot be composed losslessly; maintainer call whether an API
  discussion is warranted.
- tk-button ships no `href` mode: the hero CTA is a `<button>` (action),
  while the reference's «Скачать для iOS» is a link to a store. The story
  composes the button (homepage precedent); a link-mode button would be a
  component-API question, out of 7.5 scope.
- No other gaps: navbar (one-row consumer shape), stepper (numbered
  install steps), store-badges (external pills) each expressed their
  reference sections without edits.
