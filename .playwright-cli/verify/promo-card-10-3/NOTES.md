# Story 10.3 — probe evidence (promo-card full-bleed art)

All measurements by pixel probes (numpy + PIL, `/tmp/pixvenv/bin/python`), no scipy.
Sources: archived captures only (`.playwright-cli/captures-v2/business/`) — no live browsing.
Ground truth = pixels; vision claims used only to break a detector deadlock and were then
confirmed by measurement.

## Scripts

| script | purpose |
|---|---|
| `probe_a4_hires_final.py` | Probe A — single beige card anatomy (hi-res 528x408) |
| `probe_a2_hires_context.py` | Probe A helper — full band listing w/ context |
| `probe_b3_grid_project.py` | Probe B — bento grid card geometry + zones + pills |
| `probe_c2_ref_art_span.py` | Probe C — reference art ink spans per card (pill excluded) |
| `render_probe.html` | render-verify fixture: 5 real bentoArt SVGs in bleed anatomy |
| `probe_c4_render_bands.py` | render-verify: all-band analysis + svg box back-computation |
| `probe_c0_baseline_check.py`, `probe_c0b_baseline_art.py` | ground-truth checks vs current baseline |

Superseded/buggy (kept for the record): `probe_a3_hires_edges.py` (bad card-rect detection),
`probe_b2_grid_segment.py` (needed scipy), `probe_c1_ref_art_span.py` (bad guard slice).
`probe_b_grid_cards.py` — first grid pass; `probe_b3` is final.

## Probe A — card anatomy (source: `probe-beige-card-hires.png`, 528x408 @1x)

The image IS the card (page bg shows only through radius AA corners). Fill = [233,224,209]
(#E9E0D1 tint-cream-raised). Scale confirmed 1x by 20px heading ink height.

| measured | value | mapped token | delta |
|---|---|---|---|
| pill rows 332–375, h=44; cols 208–319, w=112; center 263.5 vs card 263.5 | perfectly centered | — | 0 |
| pill bottom offset (407−375) | **32px** | `var(--tk-space-32)` | **0.0** |
| art zone rows 172–407 | h=236 = 57.8% of card, top at 42.2%, flush bottom, reach x[0,527] full width | natural height, no pin | — |
| text bands rows 44–63 / 86–99 / 110–123 | heading + 2 desc lines | — | — |
| colorful px above art zone | **0** | text never overlaps art → **no scrim needed** | — |

**Pill bottom offset is EXACTLY `--tk-space-32` (Δ=0), not the spec's expected
space-12–space-16 neighborhood. Probe wins** (recorded in css header + judgment calls).

## Probe B — bento grid geometry (source: `pattern-products-grid.png`, 1040x1280)

| card | size | art zone h | % of card | flush bottom | full reach | pill bottom offset |
|---|---|---|---|---|---|---|
| 0 wide | 496x408 | 236 | 57.8% | yes | yes | 32px |
| 1 wide | 496x408 | 239 | 58.6% | yes | yes | 32px |
| 2 trio | 304x432 | 208 | 48.1% | yes | yes | 32px |
| 3 trio-mid | 336x432 | 222 | 51.4% | yes | yes | 32px |
| 4 trio | 304x432 | 225 | 52.1% | yes | yes | 32px |

- Zone heights are NATURAL (vary per card 208–239) → size art by intrinsic aspect, never pin a fixed height.
- Pill bottom offset = 32px in ALL five cards → consistent with Probe A; pill width 112 (131 on card 3).
- Card bottoms rounded (radius follows card radius chain); art clipped flush at bottom corners.

## Probe C — reference art span vs our SVGs (source: `pattern-products-grid.png`)

Reference art ink bbox (pill rows excluded):

| card | ink w (% card w) | note |
|---|---|---|
| 0 | 492 (99.2%) | full-width illustration ink, centered |
| 1 | 496 (100%) | |
| 2 | 304 (100%) | |
| 3 | 336 (100%) | |
| 4 | 304 (100%) | |

Our bentoArt SVG ink extents (viewBox 200x120, from showcase source): account 153x81u,
registration 85x89u, credit 129x81u, payments 141x61u, accounting 131x63u → at full element
width our ink can reach only ~43–71% of card width. **Reference ink width is unreachable
without redrawing the SVGs — forbidden (existing art verbatim). Sizing therefore anchors on
ZONE HEIGHT.**

Candidate mapping (probe-gated): `.card__art ::slotted(svg)`-side sizing
`width:100%; max-width:400px` (zone h = 0.6 × svg width):

| card | svg w | our zone h | ref zone h | delta |
|---|---|---|---|---|
| 0,1 wide | 400 (capped) | 240 | 236 / 239 | +0.4% / +0.4% |
| 2 trio | 304 (100%) | 182 | 208 | −12.5% |
| 3 trio-mid | 336 (100%) | 202 | 222 | −9.0% |
| 4 trio | 304 (100%) | 182 | 225 | −19.1% |

Trio undershoot is the closest possible at ≤100% width (wider svg would need >100% width and
overshoot ref height). Accepted, documented.

## Render verification (STANDING LESSON 10.1+10.2 — extraction vs render)

Fixture `render_probe.html` (real bentoArt shapes, bleed anatomy: artwrap
`margin: 32px -32px -32px; margin-top:auto; overflow:hidden; border-radius:0 0 24px 24px`,
art `width:100%; max-width:400px; margin-inline:auto`, svg `display:block; width:100%; height:auto`).
Served via `python -m http.server 8931` (file: blocked), screenshot via playwright-cli
session `tinkoff-ui-103`, `--full-page`, cache-bust `?v=2`.
Measured by `probe_c4_render_bands.py` (all-band analysis; svg box back-computed from known
viewBox ink extents).

| card | shape | rendered svg box (back-computed) | expected | aspect ratio check | ink bottom gap (measured = intrinsic) |
|---|---|---|---|---|---|
| 0 | account | 397x237 | 400x240 | 0.994 | 32px = 240*16/120 exact |
| 1 | registration | 395x237 | 400x240 | 1.001 | 28px = 240*14/120 exact |
| 2 | credit | 301x181 | 304x182 | 1.002 | 21px = 182*14/120 exact |
| 3 | payments | 335x199 | 336x202 | 0.989 | 51px = 202*30/120 exact |
| 4 | accounting | 302x181 | 304x182 | 0.998 | 30px = 182*20/120 exact |

Verified:
- **No collapse**: aspect check 0.989–1.002 on all five; svg renders at width 100% capped 400.
- **Flush bottom (margin-top:auto works)**: each ink-bottom gap equals the shape's intrinsic
  empty bottom strip exactly → the svg BOX touches the card bottom.
- **Centering**: ink center offset 0px on 3 cards; 12/11px on account/accounting matches those
  shapes' intrinsic off-center ink (106/200 and 107/200), not a layout error.
- **Bleed margins work**: zone reach x spans the full card width in the fixture bands.

### Detector lesson (for the record)

The first three measurement passes reported "art zone h=10/11" (collapsed) — that was
DETECTOR BLINDNESS, not a render failure: a trailing-band walk from the card bottom hits the
corner-AA band (radius exposes page bg, ~2–7% row ink) and stops at each svg's intrinsic
empty bottom strip, never reaching the art above. Fixed by listing ALL ink bands per card
(`probe_c4`). Confirms the standing lesson in reverse: not only must extractions be
render-verified — detectors themselves must be cross-checked (intrinsic-gap arithmetic +
vision spot-check broke the deadlock, then pixels confirmed).

## Judgment calls

1. **Pill bottom offset `--tk-space-32`** (probe A/B, Δ=0 in 6/6 cards) instead of the spec's
   expected space-12–16. Probe wins; documented in CSS header.
2. **No scrim/overlay above art**: 0 colorful/text px over art in any reference card. Text
   never overlaps art (art top at 42–52% of card, below all text bands).
3. **Sizing anchored on zone height, ink width accepted short** of reference (redraw forbidden).
   `max-width:400px` cap tuned so wide cards match ref zone h within +0.4%; trio cards at 100%
   width undershoot −9…−19% (closest possible).
4. **Zone height natural** (varies per card 208–239 in reference) — never pin height; svg
   `height:auto`.
5. Charcoal + bleed coexist: charcoal re-scope pair values identical to bleed pair → single
   pair of custom-property overrides applies in both; keep both selectors.
6. **`attribute: 'art-mode'` pin added to the @property options** (with `reflect: true`).
   Lit's default reflected name is the property PLAIN-LOWERCASED (`artmode`), NOT kebab —
   without the pin the CSS gate `[art-mode='bleed']` would never match. Kit precedent:
   pagination `show-more` (reflect + attribute pin). The spec mandated the reflect mold and
   uses `art-mode='bleed'` throughout; the pin is the only faithful reading.
7. **Host attribute minting**: `reflect: true` + field default writes `art-mode="top"` on the
   host from first update — the exact `variant="gray"` precedent (minted on every card since
   3.6; that IS the baseline state). Zero CSS matches `'top'`, so the rendered output is
   byte-identical; the shadow render is proven identical by unit test (CSS-ONLY test).
8. **400px is a showcase-side literal** (probe-measured art width): FR-1's zero-hardcoded
   guard covers colors/z-index only — lengths are its documented blind spot; the literal is
   flagged with provenance in the showcase CSS comment (flag-don't-invent mold).
9. **Showcase art wrapper**: `bentoArt()` returns raw svg strings (unsafeSVG), so a wrapper
   `<span class="tkb-bento__art" slot="art">` carries the slot + aria-hidden; the component's
   `::slotted(svg)` does not reach nested svgs, so the wrapper + svg sizing lives in showcase
   CSS (the retired stage's own mold). Component stays generic (spec's `::slotted(img)` rule
   verbatim, plus the documented svg companion for direct slots).

## Baseline round manifest (re-take 2026-09-26)

Sanctioned set ONLY, explicit `rm` + `pnpm test:visual:update` (port 6007 verified clean via
`lsof -ti:6007` before the run):

- visual-components-promocard--{variants,accessibility,api}-{light,dark}-1-chromium.png (6)
- visual-showcase-business-landing--business-landing-{light,dark}-1-chromium.png (2)

`git status tests/visual/` after the run: EXACTLY the 8 above modified, zero other movement
(playground/theming canaries byte-stable — the no-attr byte-stability proof held).

Two failures in that update run, both triaged:
1. `business-landing.spec.ts:84 bento composition geometry` — the spec asserted the DEAD
   `.tkb-stage` DOM (rects 0 → `0 < 0`). Updated to the adopted anatomy: shadow bleed zone
   measured via the open shadowRoot (full card width, flush bottom — toBeCloseTo ±0.5), pill
   bottom offset pinned `toBeCloseTo(32)` (probe), overlap + ≥44 hit kept. Not a PNG.
2. `visual: token-reference--motion [light]` — 2.7m duration vs ~850ms siblings, PNG
   unchanged on disk (git clean) → pre-capture timeout flake under the 10.9m loaded run;
   its dark twin and the reduced-motion variant passed in the same run. Watched in ×2.

## Probe D — adoption verified on the re-taken baseline

`probe_d_new_baseline.py` over the new business-landing-light PNG (all five cards): art ink
bands end at card-bottom − corner-AA (flush, e.g. 164–331 of 356), pills rows 277–323 sit
INSIDE the art bands (overlay), pill bottom offset 33 PNG px ≈ 32 CSS (the probe pin),
text bands 37–112 with a clean gap above every art band (no text-over-art — the no-scrim
decision holds in the composed page). Heights: wide 328→356, trio 359→357.

## Decisions feeding implementation

- `art-mode="bleed"` CSS only; art slot wrapper `.card__art` gets order/bleed/clip; no template change.
- Bleed margins track `--tk-promo-card-padding` / `-mobile` chains (fixture margins 32/−32
  mirror `var(--tk-space-32)` defaults; mobile chain re-checked at implementation).
- Actions overlay: `position:absolute; inset-inline:0; bottom: var(--tk-space-32)`;
  justify-content:center; padding-top:0.
- Bottom corner radius of art zone from `--tk-promo-card-radius` chain (`0 0 24px 24px` at default).
- `::slotted(img)`/svg: `display:block; width:100%; height:auto`; cap via max-width 400px on
  the sizing hook (implementation uses the same numbers the fixture verified).
