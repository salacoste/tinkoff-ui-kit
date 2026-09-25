import { css } from 'lit';

/**
 * tk-input styles — tokens only (FR-1): every color, radius and duration
 * consumes a `var(--tk-*)` custom property inherited from the document-level
 * token sheet. Zero theme branches: `[data-theme="dark"]` re-resolves the same
 * custom properties (AD-3). The field never floats anything and sets no
 * z-index (spec 2.1 Never) — overlays are story 2.2's controller, not this.
 *
 * Visual spec: DESIGN.md `components.input` (surface-field fill, radius-md,
 * border-default hairline, gray-500 placeholder, 52px height, focus-ring) +
 * the 2.0 capture pack's measured observations
 * (.playwright-cli/captures/input-application-form.png: ~52px field, radius
 * 10–12px, flat fill, badge pill flush right, ~16px text inset).
 *
 * Per-component custom properties follow the `--tk-<component>-<slot>` grammar
 * (CONVENTIONS §6; `--tk-input-fill` ≡ the future `--tk-select-fill`): each is
 * consumed WITH its token default as the fallback, so a consumer override on
 * the host or any ancestor wins by the cascade while the untouched field stays
 * token-faithful. The v1 override-hook set is DELIBERATELY closed to these
 * four — border, focus ring, error and label colors are NOT hooks (the
 * `--tk-color-*` token layer already restyles them across themes; opening
 * per-component slots for them would fork the theming surface):
 * - `--tk-input-fill`       field fill        (default surface-field)
 * - `--tk-input-radius`     field radius      (default radius-md)
 * - `--tk-input-text`       value text color  (default text-primary)
 * - `--tk-input-placeholder` placeholder color (default gray-500, the DESIGN spec)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule
 * — the token sheet carries no counterpart:
 * - field height 52px and the 1px hairline (DESIGN.md `components.input`
 *   literals; button's 56/48/44 and its hairline are the same class);
 * - the error icon's 16px box and 1.5px stroke (icon metrics, not a token);
 * - the badge's own padding (a slotted-content default, sized to the
 *   reference «+30%» chip).
 *
 * The slotted badge paints as the reference chip: green-100 pill with INK text
 * — not the capture's white-on-green. White on green-100 is 2.66:1 and fails
 * AA for 12px text; ink (#333) on green-100 is 4.74:1 and passes, mirroring
 * the yellow-keeps-ink rule (the kit's documented AA-override axis). The
 * pairing is theme-invariant, like yellow.
 */
export const inputStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Disabled (EXPERIENCE State Patterns): 40% opacity on the whole control,
     no pointer events at the host boundary. The inner input is aria-disabled
     + readonly (kept focusable — the aria-disabled pattern, same as the
     button pilot); typing emits nothing. */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* --- Label: static, always visible (EXPERIENCE: the placeholder never
     replaces the label — and Input has no animation by default, so no
     floating-label motion exists to reduce). --- */
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

  /* The required asterisk (reference: appended directly, same ink as the
     label). aria-hidden — required-ness is conveyed by aria-required on the
     input, so screen readers never hear a bare «*». */
  .label__star {
    margin-inline-start: var(--tk-space-4);
  }

  /* --- Field box: the fill/radius/hairline live on the wrapper (not the
     native input) so the badge rides inside the same surface and the unified
     focus ring (below) draws around the WHOLE field. --- */
  .field {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    width: 100%;
    /* DESIGN.md components.input literals — structural, no height/radius tokens exist. */
    height: 52px;
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-input-radius, var(--tk-radius-md));
    background: var(--tk-input-fill, var(--tk-color-surface-field));
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed. It draws
     on the FIELD box via :focus-within: text inputs match :focus-visible on
     every focus (mouse included), so the ring shows for both modalities and
     always wraps input + badge. The native input's own ring is suppressed
     ONLY as a dedup — the unified ring is present at that exact moment, so
     nothing is ever left ringless. */
  .field:focus-within {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  .field__control {
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    height: 100%;
    margin: 0;
    border: none;
    padding: 0;
    padding-inline-start: var(--tk-space-16);
    /* End padding applies with AND without a badge — overflowing text must
       never run flush against the field's right edge (with a badge the flex
       gap + badge margins add their own breathing room on top). */
    padding-inline-end: var(--tk-space-16);
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-input-text, var(--tk-color-text-primary));
    -webkit-appearance: none;
    appearance: none;
  }

  .field__control:focus-visible {
    /* Dedup only — see the :focus-within note above; the outline is never
       removed while no replacement is showing. */
    outline: none;
  }

  .field__control::placeholder {
    color: var(--tk-input-placeholder, var(--tk-color-gray-500));
    opacity: 1;
  }

  /* --- Badge slot: hidden until slotted content arrives (the slotchange
     flag toggles field--badge), then flush right inside the field. --- */
  .field__badge {
    display: none;
  }

  .field--badge .field__badge {
    display: inline-flex;
    align-items: center;
    margin-inline-end: var(--tk-space-8);
  }

  /* The slotted chip itself: the reference's green pill. Inline styles on the
     slotted element still win (consumer escape hatch). */
  .field--badge .field__badge ::slotted(*) {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    padding: var(--tk-space-4) var(--tk-space-8);
    border-radius: var(--tk-radius-full);
    background: var(--tk-color-green-100);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    line-height: var(--tk-text-body-xs-leading);
    letter-spacing: var(--tk-text-body-xs-tracking);
    /* INK-on-saturated-brand-fill, deliberately — NOT a generic "text on
       green" recipe. The token's NAME says "on primary" (its job: ink on
       yellow-100, the primary pairing); it is reused here ONLY because the
       reference's badge is the same class of saturated brand fill where ink
       passes AA (4.74:1) and white fails (2.66:1). Do not copy this pairing
       onto other fills blindly — check the contrast of the actual pair. */
    color: var(--tk-color-text-on-primary);
    white-space: nowrap;
  }

  /* --- Error message (EXPERIENCE State Patterns): red message + icon,
     described-by wired in the template. error-on-field carries the pair in
     BOTH themes (red-200 in light, #FF7B74 in dark). Calm copy, no
     exclamation. --- */
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

  /* Icon metrics are structural (16px box, 1.5px stroke) — no token counterpart. */
  .error__icon {
    flex: none;
    width: 16px;
    height: 16px;
    margin-block-start: 0.5px;
  }
`;
