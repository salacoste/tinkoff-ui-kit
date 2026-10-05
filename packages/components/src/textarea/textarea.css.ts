import { css } from 'lit';

/**
 * tk-textarea styles — tokens only (FR-1), the input family's field box
 * with this atom's own VERTICAL axis. Every color, radius and duration
 * consumes a `var(--tk-*)` custom property; zero theme branches (AD-3).
 *
 * Visual spec: the family registers (surface-field fill, radius-md,
 * border-default hairline, gray-500 placeholder, the unified focus ring)
 * + the 24T measured grounding
 * (.playwright-cli/captures-v5/terminal/terminal-notes-textarea-*.png,
 * DOM terminal-notes-editor-dom.txt): fs 13 / lh 16 (body-s), the 16·n+16
 * FULL-box growth envelope — 32px at one line, 48 at two — driven INLINE by
 * the autosize mechanism. The family's 52px fixed height
 * is deliberately NOT here: the grounded notes widget is a compact
 * growing form (its own vertical register, recorded in spec 24T.1).
 *
 * Per-component hooks (CONVENTIONS §6 grammar, exactly two — the growth
 * envelope; border/focus/error/label are NOT hooks for the same reason as
 * the input's closed set):
 * - `--tk-textarea-min-height`  growth floor   (default 32px — one line)
 * - `--tk-textarea-max-height`  growth ceiling (default 112px — six lines;
 *   beyond it the native scrollbar takes over via overflow-y: auto)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 8px block padding and 16px inline padding (the field inset
 * literals, same class as the input's), the 16px error-icon box and 1.5px
 * stroke (icon metrics).
 */
export const textareaStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Disabled (EXPERIENCE State Patterns): 40% opacity on the whole control,
     no pointer events at the host boundary. The inner textarea is
     aria-disabled + readonly (kept focusable — the aria-disabled pattern). */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* --- Label: static, always visible (the input-family register verbatim). --- */
  .label {
    display: block;
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    cursor: pointer;
  }

  .label__star {
    margin-inline-start: var(--tk-space-4);
  }

  /* Visually-hidden label mode (sr-only prop) — the family utility verbatim. */
  .label--sr-only {
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

  /* --- Field box ON the native control (no wrapper: no badge slot, and the
     growth height must sit on the box that scrolls). The autosize mechanism
     writes inline height between the hooks' floor and ceiling; overflow
     past the ceiling hands off to the native scrollbar. --- */
  .field__control {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-height: var(--tk-textarea-min-height, 32px);
    max-height: var(--tk-textarea-max-height, 112px);
    margin: 0;
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-radius-md);
    background: var(--tk-color-surface-field);
    /* Grounded box metrics (24T): the FULL box (border included) grows
       16·n+16 — 32/48/64… — so the block padding is (16−2)/2 = 7px over
       the 1px hairlines. Structural literals, no token counterparts (the
       same flag class as the input's 52px height). */
    padding: 7px var(--tk-space-16);
    overflow-y: auto;
    resize: none;
    font-family: var(--tk-font-body);
    /* The grounded notes typography: fs 13 rides the body-s SIZE token, but
       the line step is a 16px literal — the token's 1.5 multiplier gives
       19.5px and the live notes field is measurably denser (24T). */
    font-size: var(--tk-text-body-s-size);
    line-height: 16px;
    color: var(--tk-color-text-primary);
    -webkit-appearance: none;
    appearance: none;
  }

  /* The family's unified focus ring — 2px token ring, offset 2px, drawn on
     the field box itself (the control IS the box here). */
  .field__control:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  .field__control::placeholder {
    color: var(--tk-color-gray-500);
    opacity: 1;
  }

  /* Consumer/internal error: the border pair of the family (the message
     block below carries the copy). */
  .field__control--error {
    border-color: var(--tk-color-error-on-field);
  }

  /* --- Error message (the family markup verbatim). --- */
  .error {
    display: flex;
    align-items: flex-start;
    gap: var(--tk-space-4);
    margin: var(--tk-space-8) 0 0;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-error-on-field);
  }

  .error__icon {
    flex: none;
    width: 16px;
    height: 16px;
    margin-block-start: 0.5px;
  }
`;
