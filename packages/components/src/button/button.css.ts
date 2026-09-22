import { css } from 'lit';

/**
 * tk-button styles — tokens only (FR-1): every color, radius, shadow and
 * duration consumes a `var(--tk-*)` custom property inherited from the
 * document-level token sheet (never adopted into the shadow root — the
 * cascade trap). Zero theme branches: `[data-theme="dark"]` re-resolves the
 * same custom properties (AD-3).
 *
 * Visual spec: DESIGN.md `components.button-*` (pill radius, yellow
 * primary/white secondary/ink inverse, heights 56/48/32) + EXPERIENCE.md
 * State Patterns (hover 150ms, press 75ms scale-free, disabled 40% opacity,
 * loading width frozen) + Interaction Primitives (focus ring 2px offset 2px,
 * never removed) + A11y Floor (effective target ≥44px — the whole clickable
 * box, not just the painted pill).
 *
 * Structure: the native `<button>` is the full-height interactive box; the
 * VISUAL pill is painted on `.button::before` (fill, radius, shadow, hairline
 * all live there). For hero/card the pseudo covers the whole button; for
 * compact it insets 6px so a 32px pill rides centered in the 44px box — every
 * pixel of the 44px box is clickable and the `:focus-visible` ring draws
 * around it (the padded box of the spec's I/O row).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - spinner border width 2px and secondary hairline 1px (hairline weights);
 * - the compact 6px pill inset (44px interactive box − 32px visual pill).
 * Bold text consumes the base-step leading token: bold steps carry no
 * leading of their own (DESIGN.md gives leading on base steps only).
 */
export const buttonStyles = css`
  :host {
    display: inline-flex;
  }

  /* Interactive-target floor (EXPERIENCE a11y): the host never intercepts
     pointer events while disabled — clicks die at the element boundary. */
  :host([disabled]) {
    pointer-events: none;
  }

  .button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--tk-space-8);
    margin: 0;
    border: none;
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-bold-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    /* Bold steps carry no leading token — the base-step leading (1.5) governs. */
    line-height: var(--tk-text-body-m-leading);
    text-decoration: none;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  /* The visual pill — a pseudo so the clickable/focusable box can exceed the
     painted pill (compact). Painted BELOW the label/spinner: ::before is the
     first child in tree order, and label (positioned below) + spinner
     (absolute) paint after it. Hover/press are color steps only (scale-free
     press) on motion tokens: hover 150ms (duration-fast), press 75ms
     (duration-fastest); both collapse to 0ms under prefers-reduced-motion
     via the token layer. */
  .button::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline: 0;
    box-sizing: border-box;
    border-radius: var(--tk-radius-full);
    transition:
      background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard),
      box-shadow var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .button:active::before {
    transition-duration: var(--tk-motion-duration-fastest);
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed (never
     set outline: none anywhere in this sheet). It draws around the button
     box: 56/48 hero/card (the pill), 44 for compact (the padded box — the
     interactive target — per the spec I/O row). */
  .button:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* --- Sizes. The button box IS the hit target: 56 / 48 / 44 (floor) —
     compact keeps the faithful 32px VISUAL pill via the pseudo's 6px block
     inset below; the inset (44 − 32) is structural, not a token. --- */

  :host([size='hero']) .button {
    height: 56px;
    padding-inline: var(--tk-space-40);
  }

  :host([size='card']) .button {
    height: 48px;
    padding-inline: var(--tk-space-32);
  }

  :host([size='compact']) .button {
    height: 44px;
    padding-inline: var(--tk-space-24);
  }

  :host([size='compact']) .button::before {
    inset-block: 6px;
  }

  /* --- Variants: fills/shadows paint on the pill pseudo; text colors on the
     button (currentColor feeds the spinner too). --- */

  /* Primary: yellow fill, ink text (theme-invariant pairing — yellow always
     keeps ink text in dark mode; text-on-primary carries that semantic). */
  :host([variant='primary']) .button {
    color: var(--tk-color-text-on-primary);
  }

  :host([variant='primary']) .button::before {
    background: var(--tk-color-yellow-100);
  }

  /* Affordance freeze: a loading button is inert (clicks intercepted at the
     host), so it also shows no hover/press affordance — the hover/active
     steps apply only when not loading. */
  :host([variant='primary']:not([loading])) .button:hover::before {
    background: var(--tk-color-yellow-200);
  }

  :host([variant='primary']:not([loading])) .button:active::before {
    background: var(--tk-color-yellow-300);
  }

  /* Secondary: surface fill + default shadow (light). Expressed with surface/
     text semantics so the dark layer restyles it (surface-base lifts, shadow
     collapses to none, hairline keeps the pill edge visible on a dark canvas).
     The 1px hairline is a structural hairline weight (flagged in the header). */
  :host([variant='secondary']) .button {
    color: var(--tk-color-text-primary);
  }

  :host([variant='secondary']) .button::before {
    background: var(--tk-color-surface-base);
    box-shadow: var(--tk-shadow-default);
    border: 1px solid var(--tk-color-border-default);
  }

  :host([variant='secondary']:not([loading])) .button:hover::before {
    box-shadow: var(--tk-shadow-hover);
  }

  /* Inverse: ink-300 fill, white text in light (DESIGN.md). Expressed as
     text-primary on surface-base so the pair inverts with the theme (the
     edge-case matrix: secondary/inverse adapt via surface/ink semantics). */
  :host([variant='inverse']) .button {
    color: var(--tk-color-surface-base);
  }

  :host([variant='inverse']) .button::before {
    background: var(--tk-color-text-primary);
  }

  :host([variant='inverse']:not([loading])) .button:hover::before {
    background: var(--tk-color-ink-200);
  }

  :host([variant='inverse']:not([loading])) .button:active::before {
    background: var(--tk-color-ink-100);
  }

  /* --- Disabled: 40% opacity, no pointer events (host-level above);
     aria-disabled is set on the inner button. Disabled wins visually over
     loading (the recorded precedence — the spinner may still render). The
     opacity sits on the button box, so pill + label + spinner all fade. --- */
  :host([disabled]) .button {
    opacity: 0.4;
    cursor: default;
  }

  /* --- Loading: in-place spinner, width frozen. The label stays in flow at
     opacity 0 — it still occupies its space (no layout shift) AND remains in
     the accessibility tree (screen readers keep the name); opacity never
     removes content from the tree (unlike visibility/display). The spinner
     overlays the center. Inert affordance: default cursor (the hover/press
     steps are excluded above). */
  :host([loading]) .button {
    cursor: default;
  }

  .button__label {
    display: inline-flex;
    align-items: center;
    gap: var(--tk-space-8);
    /* Paints above the pill pseudo (tree order among positioned boxes).
       Long-label stance (reference buttons are single-line): never wrap;
       under a consumer-constrained width the label truncates with an
       ellipsis VISUALLY — the slotted light-DOM text (the accessible name)
       keeps the full string. min-width lets the flex item actually shrink. */
    position: relative;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([loading]) .button__label {
    opacity: 0;
  }

  .button__spinner {
    position: absolute;
    box-sizing: border-box;
    width: var(--tk-text-body-m-bold-size);
    height: var(--tk-text-body-m-bold-size);
    /* 2px spinner stroke — structural hairline weight, no token counterpart. */
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-right-color: currentColor;
    border-radius: var(--tk-radius-full);
    animation: tk-button-spin var(--tk-motion-duration-moderate) linear infinite;
    display: none;
  }

  :host([loading]) .button__spinner {
    display: block;
  }

  /* Spinner reduced-motion belt: the token layer already collapses
     --tk-motion-duration-moderate to 0ms; this explicit none keeps a paused
     (static two-tone ring) affordance instead of an instant loop. */
  @media (prefers-reduced-motion: reduce) {
    .button__spinner {
      animation: none;
    }
  }

  @keyframes tk-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
