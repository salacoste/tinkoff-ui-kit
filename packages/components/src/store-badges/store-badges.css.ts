import { css } from 'lit';

/**
 * tk-store-badges styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: the PIXEL PROBE of
 * `.playwright-cli/captures-v2/invest-mobile/pattern-store-badges-loaded.png`
 * (2026-09-24, runs.awk + threshold-trim method, recorded in
 * .playwright-cli/verify/store-badges/): THREE uniform light pills, probe
 * fill #F6F7F8 → **surface-muted** #F5F5F6 (ΔE≈1 — the honest-near NEUTRAL
 * map; the spec's surface-field guess is blue-tinted and farther), EXACTLY
 * 324×80 each, gap 64 — EXACTLY --tk-space-64, radius ≈24 — EXACTLY
 * --tk-radius-xl (three-depth arc fit on the pill's top-left corner: chord
 * insets ≈6/1.5/1px at dy 8/16/20 → r≈24); label #313132 →
 * text-primary, ~15px/600 (label bboxes 74/52/101px fit 10/7/13-char bare
 * store names — «Скачать в …» vision reads are REFUTED by the bbox
 * arithmetic); label LEFT-aligned ~12px in; icon squircle ~48px on the RIGHT
 * ~16px from the edge (the reference's own inverted layout — official badges
 * carry the icon left).
 *
 * Token mappings RECORDED (measured → token): pill fill #F6F7F8 →
 * surface-muted; label #313132 → text-primary; label 600 → the ramp's bold
 * step 500 (body-m-bold — no 600 exists); gap 64 → --tk-space-64 (probe
 * EXACT); pill radius ≈24 → --tk-radius-xl (arc-fit, probe); height 80 /
 * width 324 / icon 48 → structural flags below.
 *
 * HOVER: the standard surface hover family — the muted fill steps to
 * surface-field (the tk-pagination load-more's own perceptible hover
 * neighbor). MOTION: NONE — the spec's never-list («no motion on
 * stepper/badges») outranks the generic 150ms State-Pattern duration; the
 * fill step applies INSTANTLY (a state, not an animation — recorded in
 * NOTES.md).
 *
 * HIT TARGET: the whole pill IS the anchor — 80px tall ≥ the §8 floor; no
 * padding-up needed (unlike the navbar drawer-link mold).
 *
 * Per-component custom properties (`--tk-store-badges-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-store-badges-fill` pill fill        (default surface-muted)
 * - `--tk-store-badges-fill-hover` hover fill (default surface-field)
 * - `--tk-store-badges-radius` pill radius    (default radius-xl = 24, probe)
 * - `--tk-store-badges-label` label color     (default text-primary)
 * - `--tk-store-badges-icon-radius` icon radius (default radius-lg)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the 80px pill height (probe-measured y24–103; the §8 target rides it);
 * - the 324px pill basis (probe-measured EXACT uniform width ×3 — the size
 *   class the spec freezes; pills may grow past it for long labels but never
 *   shrink, keeping the row uniform);
 * - the 48px icon box (probe-measured squircle).
 */
export const storeBadgesStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--tk-space-64);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* One pill — the WHOLE surface is the external link (native focus, the §8
     target, unified ring below). Inline-flex keeps label and icon on one
     baseline-ish row; min-width holds the uniform size class while long
     labels may grow it. */
  .badge {
    box-sizing: border-box;
    display: inline-flex;
    flex: 0 1 auto;
    align-items: center;
    justify-content: flex-start;
    gap: var(--tk-space-12);
    min-width: 324px;
    min-height: 80px;
    padding: var(--tk-space-16) var(--tk-space-16) var(--tk-space-16) var(--tk-space-12);
    border-radius: var(--tk-store-badges-radius, var(--tk-radius-xl));
    background: var(--tk-store-badges-fill, var(--tk-color-surface-muted));
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  /* Hover: the surface family's perceptible fill step — INSTANT (the
     never-list's no-motion ruling; no transition property exists here). */
  .badge:hover {
    background: var(--tk-store-badges-fill-hover, var(--tk-color-surface-field));
  }

  /* Label: body-m bold-step ink, left-aligned (probe); ellipsizes only past
     the pill's grown width — the uniform class keeps labels whole. */
  .badge__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-store-badges-label, var(--tk-color-text-primary));
  }

  /* The consumer-supplied brand mark (the kit ships ZERO brand art): a
     48×48 rounded square pinned RIGHT of the label — margin-inline-start:auto
     pushes it to the far edge on short labels, exactly the reference's
     big-gap layout. Label-only degrade: no iconSrc → no img, the pill keeps
     its size class (the min-width above). */
  .badge__icon {
    flex: none;
    width: 48px;
    height: 48px;
    margin-inline-start: auto;
    border-radius: var(--tk-store-badges-icon-radius, var(--tk-radius-lg));
    object-fit: contain;
  }

  /* Unified focus ring (§8): 2px token ring, offset 2px, never removed. */
  .badge:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Zero state (badges=[]): the documented empty copy slot — never blank. */
  .badges--empty {
    margin: 0;
    padding: var(--tk-space-24);
    border-radius: var(--tk-store-badges-radius, var(--tk-radius-xl));
    background: var(--tk-store-badges-fill, var(--tk-color-surface-muted));
    text-align: center;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-secondary);
  }
`;
