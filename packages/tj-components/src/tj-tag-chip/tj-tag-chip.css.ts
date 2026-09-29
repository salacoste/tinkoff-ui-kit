import { css } from 'lit';

/**
 * tj-tag-chip styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 *
 * Visual spec: DESIGN.md `components.tag-chip` (radius chip 20, chip-fill /
 * chip-ink — the authored AA pair, THEME-INVARIANT: chips ride the purple
 * fields in BOTH themes; nav-label 17/700; height 40) + the census
 * (NOTES.md: 121–127×40 pills r20 on home/flows//pro/).
 *
 * THEME-INVARIANCE: the pair chip-fill/chip-ink has NO dark override in the
 * token sheet (the 15.2 invariants list) — a data-tj-theme="dark" ancestor
 * changes nothing. The sheet below branches on nothing; the unit suite pins
 * both facts.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 40px pill height (census-measured; no size token exists);
 * - the inline end padding 20px (the census pills' 121–127px widths imply
 *   ~20px ends — on-scale pick, unmeasured);
 * - the -2px hover/focus LIFT (EXPERIENCE names the lift, not its size);
 * - the chevron geometry: the 24-unit viewBox, the 2px stroke, the path
 *   coordinates and the 1em sizing (decorative glyph, currentColor);
 * - the 8px label→chevron gap (margin-inline-start from the space scale —
 *   the spec's named FLAGGED geometry).
 *
 * Reduced motion: the tokens' own prefers-reduced-motion block collapses
 * --tj-motion-duration-fast to 0ms, so the lift becomes instant — the
 * component adds NO media query of its own (verified, not reinvented).
 * No backticks in css comments — they would terminate the css literal.
 */
export const tagChipStyles = css`
  :host {
    display: inline-flex;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 40px; /* FLAG: the measured 40px pill (census 121–127×40, r20) */
    padding-inline: var(--tj-space-20); /* FLAG: on-scale end pick (unmeasured) */
    border-radius: var(--tj-radius-chip);
    background: var(--tj-color-chip-fill);
    color: var(--tj-color-chip-ink);
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-nav-label-size);
    font-weight: var(--tj-text-nav-label-weight);
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform var(--tj-motion-duration-fast) var(--tj-motion-curve-standard);
  }

  /* Hover/focus LIFT (EXPERIENCE names it; −2px is the flagged magnitude).
     Reduced motion: the token layer collapses duration-fast to 0ms — the
     transform still applies, instantly. No component media query. */
  .chip:hover,
  .chip:focus-visible {
    transform: translateY(-2px); /* FLAG: lift magnitude (unmeasured) */
  }

  /* Focus ring = chip-ink (white), NOT --tj-color-focus-ring: the generic
     ring #8A8AE5 fails the non-text 3:1 bar against the purple field —
     the DESIGN row ruling (AA-surface law: the ring rides its surface's
     ink). Pinned here and by the unit suite. */
  .chip:focus-visible {
    outline: 2px solid var(--tj-color-chip-ink);
    outline-offset: 2px;
  }

  .chip__label {
    display: inline-flex;
    align-items: center;
  }

  /* Decorative chevron — inline SVG in the template with aria-hidden and
     stroke=currentColor; inherits the chip ink through color. */
  .chip__chevron {
    flex: none;
    margin-inline-start: var(--tj-space-8); /* FLAG: label→chevron gap (spec-named) */
  }
`;
