import { css } from 'lit';

/**
 * tj-cta styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/radius/typography value consumes an inherited
 * `var(--tj-*)` custom property (never adopted into the shadow root — the
 * cascade trap). The dark theme INVERTS the pill through tokens alone
 * (--tj-color-cta-fill / --tj-color-cta-ink flip in the token layer's dark
 * sheet) — this sheet carries no theme branch.
 *
 * Visual spec: DESIGN.md `components.cta-write` + probe10 evidence: the
 * reference CTA is a QUIET pill — label 15/400/20 in the grotesque, radius
 * 5px, height 30px, padding 5px 15px; ink-on-fill, no border, no shadow,
 * NO hover state (the reference's CTA hover is UNPROBED — recorded-
 * reference-behavior, restated in the story; nothing is invented here).
 *
 * Structure — the compact-inset mold (the bank tk-button precedent,
 * CONVENTIONS §2 «Compact inset»): the visible pill is a ::before of an
 * INVISIBLE 44×44 anchor. Every pixel of the 44px floor box is clickable;
 * the pill paints inset-block so the label box (20px) rides centered inside
 * the 30px pill inside the 44px hit target. The focus ring wraps the BOX
 * (the interactive surface), not the pill.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 44px interactive-target floor and the derived 7px inset-block
 *   (44 − 30 = 14, split 7/7; the bank button's 6px analog is (44−32)/2 —
 *   the mold, at this family's measured 30px pill height);
 * - the 15px inline padding (probe10 measured 15px on the pill's x-axis;
 *   the horizontal counterpart of the same measurement as the 30px height).
 */
export const ctaStyles = css`
  :host {
    display: inline-flex;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* The 44×44 invisible interactive box; the pill paints inside it. */
  .cta {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    min-width: 44px;
    padding-inline: 15px;
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

  /* The visible pill: 30px tall, full inline width of the box (label +
     2×15px), radius from the CTA token. Ink-stable hover — NOTHING changes
     on hover by design (cursor affordance only); see the header ruling. */
  .cta::before {
    content: '';
    position: absolute;
    inset-block: 7px;
    inset-inline: 0;
    border-radius: var(--tj-radius-cta);
    background: var(--tj-color-cta-fill);
  }

  /* Positioned above the ::before pill (the bank button__label mold) and
     carrying the ink token — the pill fill and ink pair themes via tokens. */
  .cta__label {
    position: relative;
    color: var(--tj-color-cta-ink);
  }

  /* Focus ring around the BOX (the interactive surface), the improvement
     layer on the reference's UA outline. 2px token ring, offset 2px. */
  .cta:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }
`;
