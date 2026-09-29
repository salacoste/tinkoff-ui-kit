import { css } from 'lit';

/**
 * tj-header styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 * The bar re-themes light/dark through the token layer alone.
 *
 * Visual spec: spec 16.5 + EXPERIENCE.md Header + the 2026-09-28 reference
 * capture — sticky site chrome on `--tj-color-page` blending into the page
 * (NO divider), white card pill chips, container-bound inner row, height
 * compressing 72→56 on any scroll over the fast duration. Capture-exact
 * anatomy; the few remaining unmeasured picks stay flagged (flag-don't-
 * invent; nothing pretends to be measured).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 56px compressed height (h72 IS a token, h56 is not; the
 *   compression target is unprobed),
 * - the chip pill's 36px height / 12px x-inset (capture-estimated chrome
 *   geometry — the pill treatment itself is reference-licensed, the exact
 *   metrics are maintainer-confirms),
 * - the 44×44 theme-button hit floor + the CTA's 44×44 floor and its
 *   derived 4px inset-block (36px pill) / 15px inline padding,
 * - the 24px glyph box of the decorative fallback (icon metric).
 *
 * On-scale spacing picks (unmeasured — maintainer confirms at the
 * side-by-side): inner gap 24, container inset 24.
 * No backticks in css comments — they would terminate the css literal.
 */
export const headerStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* The sticky bar: page-token ground + the one sanctioned non-overlay z
     consumption (the nav token, AD-12). NO divider hairline — the
     2026-09-28 reference capture shows the bar's page-gray ground meeting
     the identical page background with NO separating line (the authored
     1px hairline was removed at the 16.5 patch round, vision-evidenced).
     The compress animation runs on the GRID ROW, not a layout box:
     animating a box metric is forbidden by the design-detector law
     (layout thrash — the CI gate's own rule), and grid-template-rows is
     its sanctioned channel for exactly this (px↔px interpolates on every
     evergreen engine). The bar is a one-row grid; the row IS the bar's
     height, the item stretches with it. */
  .bar {
    position: sticky;
    top: 0;
    z-index: var(--tj-z-nav);
    display: grid;
    grid-template-rows: var(--tj-space-header-h); /* h72 — the token IS the ТЖ anchor */
    background: var(--tj-color-page);
    transition: grid-template-rows var(--tj-motion-duration-fast) var(--tj-motion-curve-standard);
  }

  /* The compress: internal data-scrolled (NOT public API) flips at any
     scroll > 0 (TJ_HEADER_SCROLL_THRESHOLD_PX). */
  :host([data-scrolled]) .bar {
    grid-template-rows: 56px; /* FLAG: compressed h56 — unprobed target, h72's quiet sibling */
  }

  /* Reduced-motion belt: the token layer already collapses the duration to
     0ms; the explicit none keeps the jump honest even if a consumer
     overrides the token back on. */
  @media (prefers-reduced-motion: reduce) {
    .bar {
      transition: none;
    }
  }

  /* Container-bound inner row (1200 token + page insets). The grid row
     stretches the item to the compressing bar so the flex centering tracks
     it (belt: min-height 100% holds the same if a consumer re-flows .bar). */
  .bar__inner {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--tj-space-24);
    min-height: 100%;
    max-width: var(--tj-space-container);
    margin-inline: auto;
    padding-inline: var(--tj-space-24);
  }

  /* Neutral slot wrappers — the kit ships spacing only, no art. */
  .bar__wordmark,
  .bar__actions {
    display: inline-flex;
    align-items: center;
  }

  /* Nav chips: WHITE PILL chips (the reference treatment — card ground on
     the page-gray bar, 2026-09-28 capture) in the FULL nav-label species
     (17/700 — the probe9 census; Graphik 700 reads medium-weight). The
     reference's per-chip colored icons are CONSUMER content, not kit chrome
     (the actions-slot norm): the kit ships the pill, the pill's interior is
     the consumer's. Current marking is SEMANTIC-ONLY — aria-current, zero
     visual delta (the capture shows all pills equivalent; unprobed marking
     is not invented). */
  .chips {
    display: flex;
    align-items: center;
    gap: var(--tj-space-24);
    min-width: 0;
  }

  .chip {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    min-height: 36px; /* FLAG: authored pill height (capture estimate 36–40) */
    padding-inline: 12px; /* FLAG: authored pill x-inset (4-grid pick) */
    border-radius: var(--tj-radius-chip);
    background: var(--tj-color-card);
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-nav-label-size);
    font-weight: var(--tj-text-nav-label-weight);
    color: var(--tj-color-ink-100);
    text-decoration: none;
    white-space: nowrap;
  }

  .chip:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* The theme control: a bare 44×44 icon button (the a11y hit floor — the
     same structural number as every interactive box in the family). No
     hover state — unprobed on the reference, nothing invented. */
  .theme {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px; /* FLAG: the family's 44px interactive floor */
    height: 44px; /* FLAG: same floor, one pair */
    padding: 0;
    border: none;
    background: transparent;
    color: var(--tj-color-ink-100);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .theme:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* Decorative fallback glyph: a half/half contrast circle in ink tokens —
     reads as a theme toggle in BOTH themes without per-mode art. The slot
     override replaces it wholesale (the template hides the empty slot). */
  .theme__glyph {
    display: block;
    width: 24px; /* FLAG: icon box metric, decorative only */
    height: 24px; /* FLAG: same box */
  }

  /* The header's OWN CTA — the compact-inset mold re-implemented here (the
     no-cross-compose norm): a 44×44 invisible anchor, the visible pill
     painted by ::before. The 2026-09-28 capture shows the header CTA as a
     FULLY-ROUNDED pill ~36–40px tall (radius = half height) — NOT the
     article CTA's 5px radius-cta: the pill runs the full radius token at a
     36px height (inset-block 4px = (44−36)/2, 4-grid). Dark flips fill/ink
     through the token layer alone. NO hover state (the CTA ruling —
     unprobed). */
  .bar__cta {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px; /* FLAG: the 44×44 floor (compact-inset mold) */
    min-width: 44px; /* FLAG: same floor */
    padding-inline: 15px; /* FLAG: measured pill x-padding (probe10) */
    position: relative;
    background: transparent;
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-cta-label-size);
    font-weight: var(--tj-text-cta-label-weight);
    line-height: var(--tj-text-cta-label-leading);
  }

  .bar__cta::before {
    content: '';
    position: absolute;
    inset-block: 4px; /* FLAG: (44−36)/2 — the capture's 36–40px pill at the 4-grid */
    inset-inline: 0;
    border-radius: var(--tj-radius-full); /* fully rounded — the capture's pill ends */
    background: var(--tj-color-cta-fill);
  }

  .bar__cta-label {
    position: relative;
    color: var(--tj-color-cta-ink);
  }

  .bar__cta:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* The polite theme announcement region — the standard clip recipe
     (structurally inert; the progress-bar mold's own numbers). */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
`;
