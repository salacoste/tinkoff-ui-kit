import { css } from 'lit';

/**
 * tj-link styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 *
 * Visual spec: DESIGN.md `components.editorial-link` (the link species
 * values) + the probe10 evidence (.playwright-cli/verify/tj-tokens/NOTES.md):
 * the ТЖ link is the reference's QUIET species — the underline EXISTS but
 * paints TRANSPARENT at rest, and reveals on hover at 70% alpha of the ink.
 * The ink color does NOT shift on hover (ink-stable hover — the reference's
 * restraint grammar, opposite of the bank tk-link's blue-pair theming).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 1px underline thickness and the 0.1em underline offset (probe10
 *   measured geometry: thickness 1px, offset .1em, position under);
 * - the 70% hover alpha inside color-mix() (compose-at-use, the reference's
 *   own `--opacity-link-border-hover: .7` architecture; no alpha tokens).
 *
 * This shadow anchor and tj-prose's ::slotted(a) species are the SAME
 * species contract from ONE token source (--tj-color-link-body + the
 * measured geometry) — the documented two-surface duplication, not drift.
 */
export const linkStyles = css`
  /* Chrome primitive: inline, no box — typography inherits from the
     surrounding context (the bank "inline" variant mold; no backticks in
     css comments — they would terminate the css template literal). */
  :host {
    display: inline;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .link {
    color: var(--tj-color-link);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.1em;
    text-underline-position: under;
    transition: text-decoration-color var(--tj-motion-duration-micro) var(--tj-motion-curve-standard);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  /* Hover reveal: 70% of the link ink. The INK stays put — no color shift,
     no weight shift, nothing else moves (restraint grammar). */
  .link:hover {
    text-decoration-color: color-mix(in srgb, var(--tj-color-link-body) 70%, transparent);
  }

  /* Focus ring — the improvement layer (probe10: the reference leaves links
     on the UA outline). 2px token ring, offset 2px, never removed. */
  .link:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }
`;
