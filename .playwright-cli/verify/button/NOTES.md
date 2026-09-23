# Button side-by-side evidence (Story 1.7 — PROVISIONAL)

Autonomous-run captures (maintainer confirms on return; formalized in Story 5.5).
Reference source throughout: **tbank.ru** (tinkoff.ru redirects there), full-page
capture `.playwright-cli/tbank-home-full.png` (1280×9221).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | hero reference crop (top) vs kit variants render (bottom), 40px white gutter — **BACKFILLED at Story 5.6** (1.7 predates the 2.1 side-by-side convention; composed from the archived crops below, no live-site capture) |
| `side-by-side-dark.png` | kit dark theming render (top) vs kit light variants (bottom) on #1A1A1A — same backfill |

## Kit renders

- `kit-render-variants.png` — story `components-button--variants-and-sizes` (light,
  static docs build, 2026-09-22). DOM-measured: hero 56 / card 48 / compact 44px
  CLICKABLE box with a 32px visual pill (the native button fills the whole 44px box;
  the pill is painted on its ::before, inset 6px block-axis — shadow hit-tests at
  +3px and +41px land on the button itself, so the effective target is the full 44px).
- `dark-inverse-hover.png` — story `components-button--theming`, dark theme, pointer
  resting on the base-panel Inverse button.

## Reference crops (from tbank-home-full.png)

- `reference-hero-crop.png` — hero primary CTA «Оформить карту» (crop 1280×420 @ y=150).
  Vision-measured: ~156×54px pill, fill ~#FFDD2D, dark text.
- `reference-secondary-crop.png` — «Оформить карту» white secondary CTA on the
  Платинум product card (crop 380×180 @ y=2860). Vision-verified PASS: white fill,
  dark ~#1C1C1C text, soft diffuse shadow, full pill, ~40px height.
- `reference-inverse-crop.png` — footer quick-link chips (crop 740×116 @ y=8530).
  Vision-verified PASS: 12 chips in two rows, fill ~#333333, white text, full pill,
  ~34px height, on a near-black footer band (~#1A1A1A).

## Vision comparison record (zai-mcp-server)

- **Primary:** kit yellow reads ~#FFDD2D with ~#333 text, full pill — matches the
  reference hero CTA (yellow/ink pair, pill register, ~54–56px hero height band).
- **Secondary:** kit white + soft shadow (+1px hairline, an a11y-for-dark addition
  beyond the reference's shadow-only pill) — matches the reference card CTA pattern
  (white pill, dark text, soft elevation shadow).
- **Inverse:** kit ~#333 fill + white text — matches the reference footer pills
  (~#333333 fill, white text, pill, similar height band).
- **Dark-theme inverse hover (observed):** resting inverse in dark = white
  (~#FFFFFF) pill with dark text (surface/ink inversion); hovered = mid-gray
  ~#6B6B6B — the ink-200 (#666666) step on the light-pill base, label stays dark
  and legible. Hover differs clearly from resting.
- **Dark secondary (observed in the same capture):** dark surface pill + thin
  light hairline + white text — the intended dark adaptation (surface-base lift,
  border-default hairline, shadow collapsed to none).
- No visual defects flagged in any kit capture (no clipping, consistent radii,
  centered labels).

Provisional rule: the archived baselines (tests/visual/visual.spec.ts-snapshots)
remain PROVISIONAL until maintainer side-by-side confirmation.
