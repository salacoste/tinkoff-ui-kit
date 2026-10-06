import { css } from 'lit';

/**
 * tk-spinner styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 27.1, quality window): adopt-atom BENCHMARK #3 with the
 * kit's OWN registers as the grounding — the terminal 24T census gave 0
 * live occurrences, so no reference kit is copied pixel-wise. The registers
 * in force: currentColor (the arc inherits the context text — the
 * polaris/shoelace pattern, NOT a new token), the full-radius progress
 * family (round caps, the tk-progress-bar ruling), and the size row
 * 16/20/24/32 (the kit's typical text sizes).
 *
 * The geometry hangs off ONE hook — `--tk-spinner-size` — written by the
 * `size` property as a host inline custom property (the tk-avatar mold);
 * the CSS box and the SVG canvas are the same channel, so an override can
 * never desynchronize the arc from the box. The arc GEOMETRY (viewBox, r,
 * the 75/25 dash) is computed in the template from the same clamped size —
 * computed geometry, not theming (the tk-rating clip-path precedent).
 *
 * Per-component custom properties (`--tk-spinner-*`, CONVENTIONS §6):
 * - `--tk-spinner-size`     box + canvas size (default 20px — the size
 *   prop's union default writes the host inline channel)
 * - `--tk-spinner-color`    arc stroke (default currentColor — inherits the
 *   context text color; deliberately NOT a token, the AC2 ruling)
 * - `--tk-spinner-stroke`   arc stroke width (default 2px)
 * - `--tk-spinner-duration` rotation period (default 0.9s)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 20px size DEFAULT (the frozen-AC union default; the row itself is
 *   the kit's text sizes, not a scale step);
 * - the 2px stroke (the button-spinner hairline weight — a structural
 *   literal, the same ruling as the border weights);
 * - the 0.9s rotation period (not on the motion scale; the AC's literal —
 *   a steady loop, calmer than duration-slow's 500ms and quicker than the
 *   skeleton's 1.4s breathing);
 * - the 75/25 dash split lives in the TEMPLATE (three quarters of the
 *   circle, a 25% gap — the frozen-AC shape).
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const spinnerStyles = css`
  :host {
    display: inline-flex;
    flex: none;
    width: var(--tk-spinner-size, 20px);
    height: var(--tk-spinner-size, 20px);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* The arc canvas: fills the host box (the size channel), rotation runs on
     the svg element itself — transform-origin 50% 50% of its box, a linear
     infinite loop (the button-spinner curve ruling: a token curve would
     pulse per iteration; the loading language is a steady turn). */
  .spinner {
    display: block;
    width: 100%;
    height: 100%;
    animation: tk-spinner-rotate var(--tk-spinner-duration, 0.9s) linear infinite;
  }

  /* The arc: no fill, currentColor stroke with the round cap of the
     full-radius progress family; width rides the stroke hook. */
  .spinner__arc {
    fill: none;
    stroke: var(--tk-spinner-color, currentColor);
    stroke-width: var(--tk-spinner-stroke, 2px);
    stroke-linecap: round;
  }

  /* a11y law of the kit (the tk-skeleton mold): reduced motion collapses
     the rotation to a STATIC arc — the meaning is carried by the label
     (role=status text), never by the motion itself. The harness runs
     visual baselines under this emulation, so the arc is a deterministic
     frame, never a caught mid-turn angle. */
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
  }

  @keyframes tk-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }
`;
