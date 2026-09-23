# Stories 3.6–3.9 — card family provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side sources (Story 2.0, tbank.ru):
`.playwright-cli/captures/{promo-card-grid,feature-card-platinum,feature-card-tj-banner,service-card-grid,article-card-grid}.png`.

This NOTES covers **tk-promo-card (3.6)** including the mint/beige tint
closure proof. Sibling NOTES: `../feature-card/`, `../service-card/`,
`../article-card/`.

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | reference promo grid (top) vs kit Playground grid (bottom), 40px white gutter |
| `side-by-side-dark.png` | kit dark render (top) vs kit light (bottom) on #1A1A1A |
| `kit-promo-card-{light,dark}.png` | kit Playground grid (3 cards: gray/mint/beige) |
| `tint-probe-mint.png` / `tint-probe-beige.png` | **the corrected-tint proof** — reference native-zoom crop (top) vs kit card crop (bottom) |
| `tint-{mint,beige}-kit.png` | the kit card crops the probes sample |
| `promo-card-capture.mjs` + `suites.json`, `tint-probe.mjs` | the committed capture recipes — incl. the LIVE dark-CTA assertion (review finding 1): the Variants story's charcoal card pill must compute `rgb(255,255,255)` with an ink `rgb(51,51,51)` label in dark, or the recipe exits 1. Last run: `dark CTA pill: rgb(255, 255, 255), label rgb(51, 51, 51) — OK`. |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs on
port 6012, pinned capture env identical to the visual suite: 1280×800,
DSF 1, `--font-render-hinting=none --disable-lcd-text`, reducedMotion
reduce, colorScheme light, locally-served DaytonaSans/Inter).

## Capture recipe (reproduce)

```sh
pnpm --filter pillkit-docs build
node tests/visual/serve.mjs 6012 &
node .playwright-cli/verify/promo-card/promo-card-capture.mjs
node .playwright-cli/verify/promo-card/tint-probe.mjs   # prints computed bgs
# side-by-sides: magick \( ../../captures/promo-card-grid.png \) \
#   \( -size 1280x40 xc:white \) \( kit-promo-card-light.png \) \
#   -background white -append side-by-side-light.png
```

## THE TINT CLOSURE (spec 3.6) — measured, regenerated, proven

| Surface | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Mint — ОСАГО card fill | `rgb(208,244,242)` = #D0F4F2 (native-zoom crop pixel probe) | `rgb(208,244,242)` computed + pixel probe — IDENTICAL | **pixel-exact match** |
| Beige — Т-Образование card fill | `rgb(241,235,214)` = #F1EBD6 (native-zoom crop pixel probe) | `rgb(241,235,214)` computed + pixel probe — IDENTICAL | **pixel-exact match** |

DESIGN.md `tint-mint`/`tint-beige` replaced the vision-inventory estimates
(#E2F1EC/#F5EFE6) with the measured values → `pnpm gen:tokens` regenerated
tokens.css/tokens.ts/TOKENS.md; the `[ASSUMPTION]` flags are cleared from
the canonical listing (now "Verified — Story 3.6 closure" annotations). Dark
tints stay first-pass (Story 5.4). Vision passes on both probe images
confirm same-family flat fills; the reference cards' perceived depth is 3D
illustration on the surface, never CSS gradient.

## Ground truth — pixel/metric probes vs reference

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Radius | ~24px grid reading (range 16–28, flagged) | radius-xxl 32 (DESIGN frozen register) | match on register (xxl ruling) |
| Tints (computed) | mint #D0F4F2, slate #747B8F, #E2E8F0, #EDE8F6, #D0F4F2 | tint tokens; slate family maps bluegray/mint per story | match (closed tints exact) |
| Heading | ~24px 600–700, centered | heading-5 24px/500, CENTERED | match (weight = kit 500 discipline, deviation 3) |
| Body | ~16px / rgba(255,255,255,.7) on slate | body-m 15px text-secondary; white on charcoal | match (token step) |
| CTA | white pill ~42px, centered | slotted tk-button secondary (card 48), bottom-CENTER | match (composed CTA; 48 ≥ 44 target) |
| Flatness | no shadow on tints | no box-shadow in sheet | match |

## Vision check passes (zai analyze_image, 2026-09-23)

- Pass 1: same visual language; flagged the kit's then-left-aligned text vs
  the reference's centered promo register → **fixed** (text-align center on
  heading/description, pinned by unit test).
- Pass 2 (post-fix): confirms centered headings/descriptions, bottom-center
  white pill CTAs, mint on-family, NO clipping/overlap in the kit strip.
- Tint probes (mint + beige): both verdicts "same tint — confirmed", flat
  fills on both sides, exact-RGB corroboration.

## Intentional deviations (documented, not defects)

1. **Centered text after pass 1** — the reference centers promo card
   heading/description; landed as the component's register (feature-card
   stays left — its reference evidence is mixed, see its NOTES).
2. **Demo art is token-drawn** (white panel + yellow disc) — the kit ships
   no illustration set; real art is consumer content, lazy-enforced via the
   slotchange technique.
3. **Heading weight 500, not the reference's ~600–700** — kit weight
   discipline caps card headings at 500 (DESIGN Typography do's/don'ts).
4. **Slate #747B8F (Платинум) is not a kit tint** — the tint scale is
   gray/bluegray/mint/beige/charcoal; the story maps it to charcoal
   (theme-invariant), recorded here.
5. **Container margins** — the kit grid strip is an element shot (content
   bounds); the reference grid's ~88px page gutters are consumer layout.

## Review fixes baked into the re-recorded renders (2026-09-23, quick pass)

- **Dark charcoal CTA (finding 1)**: the charcoal variant re-scopes
  `--tk-color-surface-base`/`--tk-color-text-primary` to the hook PAIR
  `--tk-promo-card-cta-fill` (white) / `--tk-promo-card-cta-text` (ink-300)
  inside the actions zone — the composed tk-button secondary's pill computes
  white-with-ink in BOTH themes (live assertion above; dark baselines
  re-recorded).
- **Empty art zone (finding 2)**: no slotted art → the zone collapses
  (display:none, no 24px margin) via the `data-has-art` host attribute
  toggled on slotchange.
