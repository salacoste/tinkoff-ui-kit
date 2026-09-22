# Button side-by-side evidence (Story 1.7 — PROVISIONAL)

Autonomous-run capture (maintainer confirms on return; formalized in Story 5.5).

- `kit-render-variants.png` — kit render, story `components-button--variants-and-sizes`
  (light theme, static docs build, 2026-09-22). DOM-measured heights: hero 56 / card 48 /
  compact 44 (32px visual padded to the 44px a11y floor via min-height).
- `reference-hero-crop.png` — tbank.ru hero CTA crop from `.playwright-cli/tbank-home-full.png`
  (1280x420 crop at y=150). Vision-measured CTA: ~156x54px pill, fill ~#FFDD2D, dark text.

## Vision comparison (zai-mcp-server)

- Kit primary yellow reads ~#FFDD2D with ~#333 text, full pill — matches the reference CTA
  (yellow/ink pair, pill register, ~54-56px hero height band).
- Secondary: white + soft shadow (+hairline, an a11y-for-dark addition); inverse: ~#333 fill,
  white text. No defects flagged (no clipping, consistent radii, centered labels).

Provisional rule: the archived baselines (tests/visual/visual.spec.ts-snapshots) remain
PROVISIONAL until maintainer side-by-side confirmation.
