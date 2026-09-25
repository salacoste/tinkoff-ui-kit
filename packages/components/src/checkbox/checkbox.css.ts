import { css } from 'lit';

/**
 * tk-checkbox styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.checkbox` (20px box, radius-xs, ink-300
 * check on yellow-100 fill when checked) + the 2.0 capture notes § Checkbox
 * (.playwright-cli/captures/checkbox-consent.png: white fill, 1px
 * ~#D9D9D9–#E0E0E0 border, radius ~4–6px, ~13px #333 label wrapping 2 lines,
 * inline link same ink + continuous underline, ~10px box→text gap).
 *
 * UNCHECKED FILL (the spec's flagged judgment call, resolved per its own
 * «follow the capture» rule): white, NOT surface-field — the capture's box is
 * white with a hairline. `--tk-color-surface-base` carries white in the light
 * layer and #1A1A1A in dark, so the «white box» reading stays true in light
 * while dark stays visible via the border-default hairline with zero theme
 * branches. Checked/indeterminate: yellow-100 + ink-300 — the theme-invariant
 * yellow-keeps-ink pairing (9.405:1, the pinned contrast table value).
 *
 * Per-component custom properties (`--tk-<component>-<slot>`, CONVENTIONS §6;
 * same-slot-same-role vs `--tk-input-*`/`--tk-select-*`), each consumed WITH
 * its token default as the fallback:
 * - `--tk-checkbox-box-fill`  unchecked fill (default surface-base)
 * - `--tk-checkbox-fill`      checked/mixed fill (default yellow-100)
 * - `--tk-checkbox-check`     glyph color    (default ink-300)
 * - `--tk-checkbox-radius`    box radius     (default radius-xs)
 * - `--tk-checkbox-text`      label color    (default text-secondary — see the rule below)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule
 * — the token sheet carries no counterpart:
 * - the 20px box (DESIGN.md `components.checkbox` literal; the capture's
 *   tight-crop reading said 16px, the full-form reading ~20px — the DESIGN
 *   value wins per the spec);
 * - the 1px hairline (the button/input/select hairline class);
 * - the 12px all-around padding on the label root — the hit-area math that
 *   lifts the 20px visual box to the ≥44px interactive target floor in BOTH
 *   dimensions (the whole label toggles natively, so the padding IS the
 *   effective target — including the label-less bare-box configuration);
 * - the check/dash SVG metrics (20 viewBox, 2px stroke — icon metrics).
 */
export const checkboxStyles = css`
  :host {
    display: inline-flex;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Disabled (EXPERIENCE State Patterns): 40% opacity, no pointer events at
     the host boundary. The inner input keeps aria-disabled (focusable — the
     button-pilot pattern); the change guard in checkbox.ts reverts any
     keyboard flip, so nothing ever emits or commits while disabled. */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* The native label IS the interactive surface: box + input + text inside
     one label gives click-to-toggle and accessible naming for free. The
     space-12 padding (ALL around) lifts the 20px box to the 44px target
     floor in BOTH dimensions — block for the row height, inline so a
     LABEL-LESS (bare-box) checkbox keeps a ≥44px-wide hit area instead of
     the bare 20px .control; flex-start keeps the box on the label's FIRST
     line when text wraps (the capture's two-line consent layout). */
  .root {
    box-sizing: border-box;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--tk-space-8);
    min-height: 44px;
    padding: var(--tk-space-12);
    cursor: pointer;
  }

  /* --- The visual box REPLACES the native one (spec Design Notes): the
     native input sits as an invisible 20×20 interaction layer OVER the
     token-styled .box sibling (later in DOM order ⇒ paints above; opacity 0
     keeps hit-testing). Focus/hover/checked/mixed all key on the NATIVE
     pseudo-classes of that layer, so the visual can never drift from the
     semantic state. --- */
  .control {
    position: relative;
    flex: none;
    width: 20px;
    height: 20px;
  }

  .control__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    padding: 0;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .box {
    box-sizing: border-box;
    display: block;
    width: 20px;
    height: 20px;
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-checkbox-radius, var(--tk-radius-xs));
    background: var(--tk-checkbox-box-fill, var(--tk-color-surface-base));
    color: var(--tk-checkbox-check, var(--tk-color-ink-300));
    transition:
      background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard),
      border-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed: drawn on
     the VISIBLE box (the invisible input owns :focus-visible; the sibling
     selector bridges). Suppression nowhere: the input paints nothing itself. */
  .control__input:focus-visible + .box {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Hover: ONE token step (border-default → border-strong) at 150ms — the
     EXPERIENCE State Patterns row; the token layer collapses the duration to
     0ms under prefers-reduced-motion. */
  .control__input:hover + .box {
    border-color: var(--tk-color-border-strong);
  }

  /* Checked and mixed (the spec's reference convention): yellow-100 fill with
     the border collapsing into the same fill; the ink glyph (currentColor of
     .box) appears — check when :checked, minus when :indeterminate. :checked
     paints ABOVE :indeterminate when both pseudos somehow hold (the JS sync
     clears indeterminate under checked anyway). */
  .control__input:checked + .box,
  .control__input:indeterminate + .box {
    border-color: var(--tk-checkbox-fill, var(--tk-color-yellow-100));
    background: var(--tk-checkbox-fill, var(--tk-color-yellow-100));
  }

  .box__check,
  .box__dash {
    display: none;
    width: 20px;
    height: 20px;
  }

  .control__input:checked + .box .box__check {
    display: block;
  }

  .control__input:indeterminate + .box .box__dash {
    display: block;
  }

  /* --- Label text: the capture's ~13px de-emphasized consent copy (body-s,
     the nearest type step), wrapping freely. COLOR (pixel-probed at the 2.4
     gap close): the reference's consent text reads neutral ~#757575 — NOT
     the #333 the 2.0 vision pass recorded. The token sheet has no neutral
     gray step there; the nearest AA-passing role is text-secondary (#616871,
     5.635:1 on white — the pinned contrast table value; text-muted #959BA4
     measures 2.9:1 and fails AA for 13px), the same AA-override move
     tk-select documented for its
     placeholder. Slotted links inherit and underline — the reference's
     «same ink + continuous underline» link, styled at the composition site
     (see the consent story); nothing here targets slotted content (§5). --- */
  .text {
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-checkbox-text, var(--tk-color-text-secondary));
  }

  /* --- Error message (story 10.2): the tk-input error line VERBATIM —
     consumer copy only (no internal validation exists here), rendered as a
     SIBLING after the wrapping .root label (error text inside the label
     would join the accessible name). error-on-field carries the pair in
     BOTH themes; described-by wiring lives in the template. Icon metrics
     are structural (16px box, 1.5px stroke) — same flags as tk-input. --- */
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
