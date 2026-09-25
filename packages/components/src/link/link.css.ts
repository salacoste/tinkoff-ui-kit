import { css } from 'lit';

/**
 * tk-link styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.text-link` (blue, underline on hover)
 * + EXPERIENCE.md Component Patterns (TextLink row: inline or standalone —
 * standalone gets body-m; keyboard focus shows a visible underline) + the
 * 2.0 capture notes § TextLink (text-link-read-more.png, 48×25: plain word
 * at rest, NO underline, no arrow — the rest-underline probe recorded in
 * .playwright-cli/verify/link/NOTES.md).
 *
 * COLOR RULING (the spec's probe NOTES record, supersedes DESIGN.md's
 * `hover-color: blue-200`): the link consumes `--tk-color-link` ALWAYS —
 * blue-100 light / #66A3FF dark, the AA pair the token layer carries.
 * A hover color step has no dark counterpart (blue-200 carries no dark
 * remap; NO new tokens this story), so the AFFORDANCE is the underline in
 * both themes: it appears on hover (pointer) and on :focus-visible
 * (keyboard — always visible while focused, the reference behavior). The
 * legal variant is text-secondary gray in both themes.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the standalone 44px min-height (the interactive-target floor padded
 *   exactly like button compact: a transparent box — only the hit target
 *   grows, nothing paints; the reference's standalone links are plain text
 *   lines and inline links inside sentences keep their line-box targets).
 */
export const linkStyles = css`
  /* Inline by default so the element flows inside sentences; the variant
     rules below reshape the anchor for the standalone box. */
  :host {
    display: inline;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Interactive-target floor while disabled: clicks die at the element
     boundary (the aria-disabled pattern keeps the link focusable). */
  :host([disabled]) {
    pointer-events: none;
  }

  .link {
    font-family: var(--tk-font-body);
    color: var(--tk-color-link);
    /* Rest = NO visible underline (the capture's plain word): the line is
       painted with a TRANSPARENT decoration color rather than omitted, so
       its hover/focus appearance FADES on the motion token (EXPERIENCE
       State Patterns' 150ms letter — the token layer collapses it to 0ms
       under prefers-reduced-motion) instead of popping in. focus-visible
       means the underline is ALWAYS the keyboard's focus indicator —
       pointer clicks never flash it. */
    text-decoration: underline;
    text-decoration-color: transparent;
    transition:
      text-decoration-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .link:hover,
  .link:focus-visible {
    text-decoration-color: currentColor;
  }

  /* --- Variants. -- */

  /* Standalone: body-m on its own line — the card «Читать далее» register.
     The interactive target is padded to the 44×44 floor without painting
     anything: min-height carries the block axis and the inline padding
     (space-12 each side) carries short labels («Далее») under 44px wide —
     the button-compact pairing precedent. align-items centers the text in
     the taller box, the underline stays at the text. */
  :host([variant='standalone']) .link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding-inline: var(--tk-space-12);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
  }

  /* Legal: body-xs gray fine print (footer legal copy) — the ONLY variant
     that changes color; no underline at rest, same hover/focus affordance. */
  :host([variant='legal']) .link {
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-xs-weight);
    line-height: var(--tk-text-body-xs-leading);
    letter-spacing: var(--tk-text-body-xs-tracking);
    color: var(--tk-color-text-secondary);
  }

  /* --- Disabled: 40% opacity, no pointer events (host-level above); the
     anchor carries aria-disabled (template). The element stays focusable —
     the underline may still show on keyboard focus, mirroring how the
     button's ring behaves while disabled. --- */
  :host([disabled]) .link {
    opacity: 0.4;
    cursor: default;
  }
`;
