import { css } from 'lit';

/**
 * tk-switch styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * GEOMETRY REGISTER (spec 26.2 AC4, maintainer ruling 2026-10-05): the
 * admin «Запомнить» pixel probe resolved to a chip-button, not a switch
 * (see the spec Change Log), so the capsule follows KIT registers — the
 * tk-progress-bar / tk-range-slider track family: a full-radius pill
 * track (36×20 default), a surface-base knob (16px) with the hairline,
 * ON = yellow-100 (the engaged register), OFF = border-default (the same
 * gray the slider track carries). Pixel grounding is a HOLD → 24T.
 *
 * Per-component custom properties (`--tk-<component>-<slot>`, CONVENTIONS
 * §6), each consumed WITH its token default as the fallback:
 * - `--tk-switch-width`    track width     (default 36px)
 * - `--tk-switch-height`   track height    (default 20px)
 * - `--tk-switch-knob`     knob diameter   (default 16px)
 * - `--tk-switch-track-on` checked fill    (default yellow-100)
 * - `--tk-switch-track-off`unchecked fill  (default border-default)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 36×20×16 capsule geometry (kit registers, the ruling above);
 * - the 1px knob hairline (the button/input/select hairline class);
 * - the 12px all-around padding on the label root — the hit-area math
 *   that lifts the 20px-tall capsule to the ≥44px interactive floor in
 *   BOTH dimensions (the whole label toggles natively, so the padding IS
 *   the effective target — including the label-less bare configuration).
 */
export const switchStyles = css`
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
     button-pilot pattern); the change guard in switch.ts reverts any
     keyboard flip, so nothing ever emits or commits while disabled. */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* The native label IS the interactive surface: track + input + text inside
     one label gives click-to-toggle and accessible naming for free. The
     space-12 padding (ALL around) lifts the 20px capsule to the 44px target
     floor in BOTH dimensions — block for the row height, inline so a
     LABEL-LESS (bare) switch keeps a ≥44px-wide hit area instead of the bare
     36px .control; flex-start keeps the track on the label's FIRST line when
     text wraps (the tk-checkbox mold verbatim). */
  .root {
    box-sizing: border-box;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--tk-space-8);
    min-height: 44px;
    padding: var(--tk-space-12);
    cursor: pointer;
  }

  /* --- The visual capsule REPLACES the native box (the tk-checkbox
     technique): the native input sits as an invisible 36×20 interaction
     layer OVER the token-styled .track sibling (later in DOM order ⇒
     paints above; opacity 0 keeps hit-testing). Focus/hover/checked all
     key on the NATIVE pseudo-classes of that layer, so the visual can
     never drift from the semantic state. --- */
  .control {
    position: relative;
    flex: none;
    width: var(--tk-switch-width, 36px);
    height: var(--tk-switch-height, 20px);
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

  .track {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--tk-radius-full);
    background: var(--tk-switch-track-off, var(--tk-color-border-default));
    transition:
      background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* The knob rides INSIDE the track: centered vertically, inset
     ((height − knob) / 2) from the left when off; checked travel is
     width − height (the inset pairs cancel: w − k − 2·(h−k)/2 = w − h),
     so a consumer overriding any hook keeps the geometry consistent. */
  .knob {
    position: absolute;
    top: 50%;
    left: calc((var(--tk-switch-height, 20px) - var(--tk-switch-knob, 16px)) / 2);
    box-sizing: border-box;
    width: var(--tk-switch-knob, 16px);
    height: var(--tk-switch-knob, 16px);
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-radius-full);
    background: var(--tk-color-surface-base);
    transform: translateY(-50%);
    transition: transform var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed: drawn on
     the VISIBLE track (the invisible input owns :focus-visible; the sibling
     selector bridges — the tk-checkbox mold). */
  .control__input:focus-visible + .track {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Hover: ONE token step (border-default → border-strong) at the fast
     duration, the unchecked track ONLY — the checked yellow is the engaged
     state and does not shift under the pointer (the EXPERIENCE State
     Patterns row; checked rule below wins the cascade anyway). */
  .control__input:hover:not(:checked) + .track {
    background: var(--tk-color-border-strong);
  }

  /* Checked: the yellow-100 engaged register — theme-invariant, the same
     pairing the tk-checkbox box and the range-slider fill/thumb carry. */
  .control__input:checked + .track {
    background: var(--tk-switch-track-on, var(--tk-color-yellow-100));
  }

  .control__input:checked + .track .knob {
    transform:
      translateX(calc(var(--tk-switch-width, 36px) - var(--tk-switch-height, 20px)))
      translateY(-50%);
  }

  /* --- Label text: the tk-checkbox .text mold verbatim — body-s, the
     de-emphasized consent/secondary register, wrapping freely; slotted
     content inherits (§5 — nothing here targets slotted nodes). --- */
  .text {
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-text-secondary);
  }

  /* Motion guard (spec AC4, the tk-skeleton mold): the knob slide and the
     track fill are pure embellishment — under prefers-reduced-motion both
     snap between states with no transition. */
  @media (prefers-reduced-motion: reduce) {
    .track,
    .knob {
      transition: none;
    }
  }
`;
