# Story 7.4 — business landing: verification evidence

Composition: `packages/components/src/showcase/business-landing.stories.ts`
(story `showcase-business-landing--business-landing`). Own spec:
`tests/visual/business-landing.spec.ts`. Capture date: 2026-09-25.

## Files

| File | What it is |
| --- | --- |
| `business-landing-capture.mjs` | committed capture recipe (serves `packages/docs/dist` on a private port; pinned chromium `--font-render-hinting=none --disable-lcd-text`, 1280×800 DSF1, `reducedMotion: reduce`, fonts.css pinned). Light: element shots `.tkb-hero/.tkb-bento/.tkb-steps/.tkb-form/.tkb-footer` → `kit-*.png`; both themes: fullPage `kit-page-{light,dark}.png`. |
| `ref-hero.png` | reference crops (1280 wide) of the pattern captures: hero `+0+70` (750 tall), bento `+0+900` (1350), steps+form `+0+2300` (700), footer = `pattern-footer-detail.png` copy. |
| `ref-bento.png` | 〃 |
| `ref-steps-form.png` | 〃 |
| `ref-footer.png` | 〃 |
| `kit-hero.png` … `kit-footer.png` | kit element renders (hero 730, bento 1090, steps 439, form 554, footer 592 tall). |
| `kit-page-light.png` / `kit-page-dark.png` | full-page kit renders, 1280×4335. |
| `side-{hero,bento,steps-form,footer}.png` | reference TOP, kit BOTTOM, 4px `#E0E2E4` separators on `#F1EEE8`, width 1280 (the 7.3 record convention). |
| `probe-kit.sh` | committed probe script (scanline runs + single pixels; the 6.2/7.3 method). |
| `probe-output.txt` | saved probe output — the ground-truth tables below. |
| `toast-diag.mjs`, `geometry-diag.mjs` | scratch diagnostics (toast rect/scroll math; authoritative geometry rects) — deleted after use; their outputs are recorded here. |

## Probe ground truth (light)

Method: ImageMagick scanline run lengths
`magick img -crop Wx1+X+Y txt:- | awk | uniq -c`, single pixels via
`%[pixel:p{x,y}]`, plus live `getBoundingClientRect`/`getComputedStyle`
(`geometry-diag.mjs`) as the authoritative source for rects.

- Page canvas `#F1EEE8` (`--tk-color-tint-cream`); all card seats `#E9E0D1`
  (`--tk-color-tint-cream-raised`). Zero hard-coded colors in canvas CSS.
- Hero selector scan (y=660): five equal cream seats separated by 32px of
  page cream, 72px side margins (the 198px fill run is the scan crossing
  the seat below its 48×48 icon tile). Geometry diag (authoritative):
  five equal cards ≈217.6 wide, computed `gap: 16px` card-to-card (the
  extra 16 in the scan is the seat's outer AA edge).
- Bento row 1 (y=330): `64 | 552 | 48 | 552 | 64` EXACT — two equal 552
  seats, 48 gutter, 64 side margins; computed tracks `552 | 552`, gap 48.
- Bento row 2 (y=880): fill runs `79 | 121 | … | 121 | 79` around the art
  zones with 24px gutters EXACT; computed tracks `339.7 / 424.6 / 339.7`,
  gap 24 — a 4:5:4 center-wider ratio (reference probe read ~303/385/294).
- White CTA pill INSIDE the art zone: runs 30/37/56 white with `#333333`
  text pixels («Подробнее» renders in-art, in-pill). Vertical centerline
  scan (x=340, y=380..560): cream → dark art zone (66×`#333`) → yellow art
  accent (7×`#FFDD2D`) → 48px white pill with ink text → cream.
- Floating CTA (geometry, authoritative): pill y=1331 h=48 (`card` size),
  art bottom y=1363 → **32px overlap**; pill bottom 1379 vs card bottom
  1395 → the pill is 16px INSIDE the card; horizontally centered ±0.5px.
- «Все сервисы» pill 173×52 (`--tk-color-surface-muted` on cream, text
  `--tk-color-link-on-tint` — the axe fix, below).
- Steps scan (y=300): white cards on cream, 48 gutters; stepper block
  1280×438.
- Form card scans (y=250 / y=390): `360 | 560 | 360` — the 560px white
  card centered; divider hairlines `#E7E8EA`; submit = yellow `#FFDD2D`
  runs 40+124 with `#333` text (primary = yellow + ink, theme-invariant).
  Geometry: form card 560×394 @ x=360; submit 176×56 (`hero` size).
- Corner radius: column re-profiles at x=65/76/88 find fill starting at
  T+15 / T+3 / T+0 (card top T≈214) — fits the r=24 (`radius-xxl`) curve
  family within AA. (The `dy=` section inside `probe-output.txt` used a
  wrong y baseline — the follow-up columns are authoritative.)

## Vision check (mandated method note)

4.5v MCP vision (`analyze_image`) WAS available and used — on the
CDN-minted `kit-page-light.png` (1280×4335), plus inline renders of the
section side-by-sides during composition. Gross-structure verdict: all six
clusters confirmed — single-row navbar with «Бизнесу» active (yellow
underline), hero two-line heading + subline + yellow pill + five cream
selector cards (labels: Расчетный счет, Кредиты, Торговый эквайринг,
Селлер, Топливо), bento 2 wide + 3 with the center visibly wider +
«Все сервисы» pill, steps with number badges overlapping card tops, form
card (toggle → phone → divider → checkbox + yellow submit), footer quick
links + columns + dark pill row + phone + legal. Two vision flags, both
dispositioned:

1. «Grey banner overlapping the form» — that is `withDisclaimer`, the
   persistent preview-decorator chrome (`packages/docs/.storybook/preview.ts:61-84,90-102`):
   `position: sticky; top: 0` over a `--tk-color-surface-muted` fill, so a
   fullPage stitch re-paints it in whichever viewport segment the stitch
   lands on (here, over the form). It wraps EVERY story and is present in
   every existing baseline — canvas chrome, not composition content.
2. «Подробнее pills straddle the card boundary» — corrected by the
   authoritative geometry above: pill bottom 1379 vs card bottom 1395; the
   pill is fully inside the card and overlaps only the ART's bottom edge,
   exactly as §2 specifies.

## Intentional deviations ledger (spec vs shipped)

| # | Deviation | Where / why |
| --- | --- | --- |
| 1 | Token names: spec says `--tk-color-surface-cream/-card-cream`; actual tokens are `--tk-color-tint-cream/-raised` (`packages/tokens/src/tokens.ts:59-60`). Shipped uses the actual names. | story canvas CSS; naming divergence recorded, not patched. |
| 2 | **CLOSED (10.3, 2026-09-26):** reference bento cards run the illustration as a full-bleed card zone under the text. 7.4 shipped the `.tkb-stage` actions-slot workaround; story 10.3 added `art-mode="bleed"` to tk-promo-card (CSS-only mode) and the bento now composes from it directly — art in the `art` slot (bleed bottom, clipped corners), CTA in the `actions` slot (the floating-pill overlay at the probe-measured 32px). `.tkb-stage` is fully retired. Geometry re-verified on the re-taken baseline (art flush bottom, pill inside art band at 32px offset — verify/promo-card-10-3/NOTES.md probe D). | `business-landing.stories.ts` `bentoCard`. |
| 3 | `--tk-promo-card-text-muted: var(--tk-color-text-primary)` on bento cards — reference's secondary-on-cream fails AA; the kit's own pairing rule. | `.tkb-bento__card`. |
| 4 | White CTA pills: re-scope `--tk-color-surface-base: var(--tk-color-white)` + `--tk-color-text-primary: var(--tk-color-ink-300)` — **(10.3)** previously applied at the dead `.tkb-stage`; now delivered by the promo-card's OWN bleed overlay (the charcoal-CTA technique inside the component, `promo-card.css.ts`) — theme-invariant white pills on cream, zero showcase CSS. | `promo-card` bleed overlay. |
| 5 | «Все сервисы» pill label — the capture reads «Все продукты»; the frozen spec wins, drift recorded. | `.tkb-all`. |
| 6 | Stepper `steps` requires `{title, text}` both: step 1 splits at the reference's own dash; steps 2–3 carry the full verbatim sentence as `title` with `text: ''` (empty `p` renders only its 4px margin — verified harmless). Zero copy invented. | `STEPS` data. |
| 7 | Navbar: single main row (reference vision pass found no second row → no `subLinks`), `activeValue="business"`, `burger-label`; volatile utility strip omitted (volatile content rule). | navbar block. |
| 8 | Footer phone fictionalized `8 800 333-33-33` (reference `8 800 500-55-05`) — fictionalization rule. | `tk-footer` props. |
| 9 | Toast capture: page-level `clip` is viewport-based while clip coords are page coordinates — breaks whenever trigger scroll ≠ 0 (measured: submit scrolls y≈2268 in a 4316px doc; page-coord clip lands outside the 800px capture). Ruled: ELEMENT screenshot of `tk-toast`. | `business-landing.spec.ts` (comment records the numbers). |
| 10 | Bento card heights — assembly standard (padding/typography/radius assembly drives height); no heights hard-coded. **(10.3 update)** the bleed adoption grew the cards toward the reference: wide 328→356, trio ~flat 359→357 (taller art offset by the reclaimed bottom padding); remaining gap to ~430/438 is the intrinsic art-height shortfall (probe C: our svg zones 240/182–202 vs reference 236/218–225 — wide match +0.4%, trio −9…−19% closest-possible without redrawing). | n/a — measured on the 10.3 re-taken baseline. |
| 11 | Hero selector: reference's fanned card stack flattened to the 5-equal-card row (no fanned-stack primitive in the kit; §2 freezes the 5-service selector). | `.tkb-selector`. |
| 12 | Phone field carries a visible «Телефон» label — `tk-input`'s accessible name comes only from the visible label (see gaps). | `.tkb-form__field`. |
| 13 | Consent checkbox included as an interactive cluster member (frozen §5) though the reference shows a text-only line; ungated (application-form mold: consent is captured, not submit-gating). | `.tkb-form__consent`. |
| 14 | Form card radius 24 (`radius-xxl`) vs reference ≈32 (vision estimate) — kit radius cap. | `.tkb-form__card`. |
| 15 | Axe fix during visual run: `.tkb-all` text `--tk-color-link` (#1771E6 ≈4.18:1 on `#F5F5F6`) → `--tk-color-link-on-tint` (#1464CC) — the service-card actions' documented pairing rule. | `.tkb-all`. |

## Kit gaps found (reported, not patched)

- `tk-input`: no sr-only / placeholder-only label mode — host `aria-label`
  is not forwarded; accessible name only via the visible label.
- `tk-checkbox`: no error/invalid channel.
- `tk-segmented-radio`: no sr-only label mode — label-less groups fall
  back to the aria-label «Выбор».
- `tk-stepper`: no subtitle prop (heading only).
- `tk-promo-card`: no illustration-as-card-background zone.
- No ≈32px radius token (form card capped at `radius-xxl` 24).
- Brown badge token absent (story 7.3 record; mapped to cream-raised there).
