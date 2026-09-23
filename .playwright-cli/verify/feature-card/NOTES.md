# Story 3.7 — tk-feature-card provisional baseline evidence (2026-09-23)

Provisional rule (autonomous run): kit-vs-kit baselines enforce drift from
here on; the maintainer confirms or re-takes this batch. Side-by-side
sources (Story 2.0, tbank.ru): `.playwright-cli/captures/feature-card-platinum.png`
(552×432, incl. 12px margin) and `feature-card-tj-banner.png` (432×401).
Parent evidence index: `../promo-card/NOTES.md`.

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | Платинум reference (top) → kit Playground strip (center, resized 552w) → Т-Ж reference (bottom) |
| `side-by-side-dark.png` | kit dark render (top) vs kit light (bottom) on #1A1A1A |
| `kit-feature-card-{light,dark}.png` | kit Playground 2-up grid (gray card + charcoal editorial with right-bleed art) |
| `feature-card-capture.mjs` + `suites.json` | the committed capture recipe — incl. the LIVE dark-CTA assertion (review finding 1): the editorial card's pill must compute `rgb(255,255,255)` with an ink `rgb(51,51,51)` label in dark, or the recipe exits 1. Last run: `dark CTA pill: rgb(255, 255, 255), label rgb(51, 51, 51) — OK`. |

Same pinned capture env as the visual suite (see `../promo-card/NOTES.md`).

## Ground truth — probes vs reference

| Aspect | Reference (measured) | Kit (measured) | Verdict |
|---|---|---|---|
| Scale | 552×432 banner / 432×401 | min-height 320 hook, 2-up grid stretch | match (2-up register) |
| Fill | slate #747B8F (computed) | editorial consumes tint-charcoal #333333 | **DEVIATION 1** (charcoal ruling) |
| Heading | #FFFFFF ~28px (centered, platinum) / ~30px left (Т-Ж) | heading-4 28px/500, LEFT | match on step (alignment systematized) |
| Secondary | #FFFFFF 16px / label #C6C8D2 | body-m white on editorial | match (token step) |
| CTA | white pill ~40–42px, dark text | slotted tk-button secondary, START-aligned, pinned bottom | match (composed CTA) |
| Bleed | 3D render lower ~60%, clipped by radius | art column stretched to the right edge, overflow+radius clip | match (grid technique) |
| Flatness | no shadow on slate | no box-shadow in sheet | match |

## Vision check pass (zai analyze_image, 2026-09-23)

- Editorial wiring confirmed: charcoal fill, white heading, two-line white
  description, white pill CTA, yellow-disc art cleanly CUT by the card's
  right boundary (intentional bleed), radii consistent, flat.
- No clipping/overlap/artifacts in the kit strip.

## Intentional deviations (documented, not defects)

1. **Charcoal #333333 instead of the reference slate #747B8F** — the spec
   names the variant "charcoal EDITORIAL"; charcoal is the theme-invariant
   tint token in the scale. The reference's slate is not a kit tint; the
   white-pairing contract is identical.
2. **Left-aligned heading (systematized)** — the reference evidence is
   mixed (Платинум centers, Т-Ж is left); the banner register keeps left,
   promo-card owns centered (its reference is uniformly centered).
3. **Demo bleed art** is a token-drawn panel+disc — real 3D art is consumer
   content (lazy-enforced).
4. **Heading weight 500** vs the reference's ~700 — kit weight discipline.

## Review fixes baked into the re-recorded renders (2026-09-23, quick pass)

- **Dark editorial CTA (finding 1)**: `--tk-feature-card-cta-fill` (white) /
  `--tk-feature-card-cta-text` (ink-300) re-scope pair inside the actions
  zone — the composed tk-button secondary's pill computes white-with-ink in
  BOTH themes (live assertion above; dark baselines re-recorded).
- **Empty art zone (finding 2)**: no slotted art → the zone collapses and
  the editorial grid stays SINGLE-column (no empty 0.95fr track) via the
  `data-has-art` host attribute toggled on slotchange.
