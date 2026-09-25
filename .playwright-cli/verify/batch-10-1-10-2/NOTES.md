# Batch 10.1 + 10.2 — sr-only labels, checkbox error channel, stepper/qr slots

Spec: `_bmad-output/implementation-artifacts/spec-10-1-10-2-sr-only-labels-error-channel-slots.md`
Baseline: main = f3e90a5. All probes from archived captures only (no live site).

## Probe (a) — business-landing subheading (steps section)

Capture: `.playwright-cli/captures-v2/business-landing/full.png`

- Copy (glyph-decoded + render-confirmed): «Откройте расчетный счет онлайн за 10 минут и получите бесплатно»
- Font size: measured glyph height ≈ 15.3 px → token `body-m` (15px, Δ≈0.3)
- Weight: 400 (stem widths match Daytona 400 templates)
- Color: #30302E sampled → `text-primary` #333333 (Δ3/255 ≈ 1.2%, same ink as section
  heading — refutes spec's expected `text-secondary`)
- Align: centered (left/right margins symmetric ±1px)
- Spacing: heading→subtitle 34px → `space-32` (Δ2); subtitle→card-top 81px →
  margin `space-48` + padding `space-32` = 80 (Δ1)

## Probe (b) — invest-landing QR paragraph

Capture: `.playwright-cli/captures-v2/invest-mobile/full.png`, band y≈1780–1862.

### Copy (glyph-by-glyph decode, then render-and-compare)

Line 1 (y1810–1823, x238–1041, w=804):
«Переходите по ссылкам только с этой страницы и не сканивайте файлы с непроверенных сайтов. Версию Android»

Line 2 (y1834–1847, x358–922, w=564):
«можно посмотреть в настройках смартфона — достаточно узнать первую цифру»

Render verification (DaytonaSans-400 @15px, #333 on white, pinned chromium flags
`--font-render-hinting=none --disable-lcd-text`, DSF 1 — helpers in this dir,
`render-candidates.mjs`, `render-charset.mjs`):

| line | render w | capture w | Δ | col-profile mean diff |
|------|----------|-----------|---|-----------------------|
| 1 | 805 | 804 | 1px (0.12%) | 1.53 |
| 2 | 565 | 564 | 1px (0.18%) | 0.96 |

Cumulative-profile drift per decile: +12px at 10% decaying to 0px by 70–90% —
subpixel positioning artifact, not structural (a wrong letter would leave a
permanent 5–8px offset; total width would miss by the letter width).

Decode evidence trail: `/tmp/line1-glyphs.txt`, `/tmp/line2-glyphs.txt`
(per-glyph bitmaps), `/tmp/render-mystery/decode.py` (classifier),
`/tmp/render-mystery/seq.py` (DP attempt, superseded by hand decode).
Key glyph disambiguations learned this batch:
- lowercase `р` vs `д`: both show bottom bar + left descender leg; `д` shows BOTH
  legs (left+right), `р` a single left stem — settled g1-R=р («Пер**е**ходите»),
  g50-L2=р («Ве**р**сию»), g2-L4=д («переход**и**те»… «Перехо**д**»).
- `ы` = ь + separate short stroke with a 2–3px gap — the stroke splits into its
  own cluster («файл**ы**» g33+g34, «страниц**ы**» g20, «непроверенн**ы**х» g44).
- `л` at Daytona 15px renders as top curve + two stems (п-like), no bottom bar.
- `э` mid-bar does not touch the left side; `е` mid-bar spans full width.
- Latin run detected by ascender/descender + shapes: «Android» (capital А with
  crossbar, Latin n/d/r/o/i — i shows separated dot at 1810).

### Metrics

- Cap height 11px → 15px font → `body-m` (Δ0.3 vs render templates)
- Weight 400 regular
- Line rhythm 24px (L1 top 1810 → L2 top 1834) → line-height 24px = 1.6 × 15;
  token `body-m-leading` is 1.5 (22.5px) — Δ1.5px per line, nearest ramp step
  (body-l would overshoot the size by 2px)
- Ink #333333 exact on #FFFFFF canvas → `text-primary` on WHITE
- Both lines centered: L1 center 639.5, L2 center 640.0 (page center 640)

### Vertical rhythm (row-band scan, full.png y1700–1965, thr 150)

Ink bands: title 1729–1784 (two mobile lines), paragraph L1 1810–1823,
L2 1834–1847, tabs text 1916+ (pill top ≈1900 per the shipped 7.3 probe in
verify/qr-block/NOTES.md).

- title→copy: ink 1784→1810 = 26px; box-corrected (heading-4 1.25 leading
  half-gap ≈4.5 below title ink, 24px-rhythm half-gap ≈5 above L1 ink) →
  margin ≈16.5 → `space-16` (Δ0.5)
- copy→tabs: paragraph box bottom ≈1852 (ink 1847 + 5) → pill top ≈1900 →
  margin ≈48 → `space-48` (Δ0; the shipped title→tabs `space-40` gap belongs
  to the title-only composition and is superseded when copy is present)

### Spec-expectation refutations (pixel-measured)

Spec anticipated «body-l regular `text-secondary` on cream» for the QR paragraph.
Pixels refute on three axes: size (15 ≠ 17), color (#333 = text-primary ≠
text-secondary), surface (pure #FFF ≠ cream). Implemented as measured.

## Showcase adoption copy (reference-verbatim, both probes)

- business-landing stepper subtitle slot:
  «Откройте расчетный счет онлайн за 10 минут и получите бесплатно»
- invest-landing qr-block page-copy slot:
  «Переходите по ссылкам только с этой страницы и не сканивайте файлы с
  непроверенных сайтов. Версию Android можно посмотреть в настройках смартфона —
  достаточно узнать первую цифру»

## Baseline re-take manifest

### STOP events during the round (evidence trail)

**STOP 1 — run 1 (39 failed):** 30 sanctioned PNGs + the invest cluster (touched
region — allowed) + FOUR NON-SANCTIONED diffs: components-qrblock--accessibility
/ --playground / --theming and components-stepper--playground. pngdiff showed
pure size SHRINK with no content change (stepper playground 604→508 = lost
`.stepper__heading + .stepper__steps` space-64+space-32; qr-block theming
2077→1917 = 4×space-40; accessibility/playground −40 each = lost
`.qr-block__title + tk-tabs` space-40). Root cause: the bare hidden listening
slot rendered BETWEEN heading/title and the next block broke the adjacent-
sibling rhythm selectors. Fix: listening slot moved to the END of the container
in both components; adjacency regression pins added to both test files.

**STOP 2 — run 2 (67 failed):** every test on the six TOUCHED stories
(components-qrblock--variants, components-stepper--variants,
components-v2-qr-block--page, components-v2-stepper--page,
showcase-business-landing--business-landing, showcase-invest-landing--
invest-landing) died in `waitForStorySettled` — the story canvas NEVER
rendered (no root children, no error display), including axe, reduced-motion
and the per-spec business/invest suites. Control probe: untouched stories
settled in 29 ms; the six hung past 15 s with the tab's main thread frozen.
Root cause: the two-part conditional render (wrapped slot mid-container, bare
listening slot at the end) made each flip commit retire one slot and mount the
other; Chromium dispatched a competing `slotchange` from the RETIRED slot,
whose `assignedNodes()` reads empty — honoring it flipped the flag back and the
render oscillated forever, starving the event loop (a frozen tab, not a slow
one). happy-dom delivers slotchange as a macrotask and never fired the
competing event, which is why the unit suite stayed green. Fix (both
components): the presence sync ALWAYS re-queries the live tree
(`shadowRoot.querySelector('slot[name=…]')`) instead of trusting
`event.target` — the committed tree's one remaining slot always tells the
truth, so every path converges. Post-fix probe: all six stories settle in
18–36 ms, zero console errors. Documented as the CONVERGENCE RULE in both
components' private-sync jsdoc.

(manifest of re-taken PNGs appended after the update pass)

### Re-take round

Definitive compare run (run 3, post-fix): 1337 passed / 31 failed — the 30
sanctioned story PNGs (15 stories × 2 themes, all real pixel diffs at
1.2–3.4 s, zero timeouts) plus the single invest cluster test carrying the two
touched-region PNGs. Everything else passed: all axe, all reduced-motion, the
business-landing per-spec suite (toast/bento/wiring snapshots did NOT move)
and the invest per-spec suite. Failure list matched the sanctioned set exactly
— no non-sanctioned baseline moved.

Method (per the batch contract): the 30 sanctioned PNGs + the 2 cluster PNGs
were DELETED explicitly, then a compare-mode pass re-wrote exactly the missing
baselines (32 «snapshot doesn't exist … writing actual» writes; Playwright
reports each such test failed-on-write — the planned write-fail shape). git
status under tests/visual/ listed exactly those 32 PNGs and nothing else.

### Re-taken baselines (32 PNGs)

tests/visual/visual.spec.ts-snapshots/ (30):
- visual-components-input--accessibility-{light,dark}-1-chromium.png
- visual-components-input--api-{light,dark}-1-chromium.png
- visual-components-segmentedradio--accessibility-{light,dark}-1-chromium.png
- visual-components-segmentedradio--api-{light,dark}-1-chromium.png
- visual-components-checkbox--variants-{light,dark}-1-chromium.png
- visual-components-checkbox--accessibility-{light,dark}-1-chromium.png
- visual-components-checkbox--api-{light,dark}-1-chromium.png
- visual-components-stepper--variants-{light,dark}-1-chromium.png
- visual-components-stepper--api-{light,dark}-1-chromium.png
- visual-components-v2-stepper--page-{light,dark}-1-chromium.png
- visual-components-qrblock--variants-{light,dark}-1-chromium.png
- visual-components-qrblock--api-{light,dark}-1-chromium.png
- visual-components-v2-qr-block--page-{light,dark}-1-chromium.png
- visual-showcase-business-landing--business-landing-{light,dark}-1-chromium.png
- visual-showcase-invest-landing--invest-landing-{light,dark}-1-chromium.png

tests/visual/invest-landing.spec.ts-snapshots/ (2 — touched QR region):
- invest-landing-1280-cluster-interactive-base-7b166--the-second-platform-tab-active-both-themes-1-chromium.png
- invest-landing-1280-cluster-interactive-base-578a9--the-second-platform-tab-active-both-themes-2-chromium.png

Verification: `pnpm test:visual` ×2 — 1368 passed / 1368 both runs
(8.4 m each).
