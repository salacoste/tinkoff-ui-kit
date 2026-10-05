import { css } from 'lit';

/**
 * tk-range-slider styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * GEOMETRY REGISTER (spec 26.1 AC4, maintainer ruling 2026-10-05): the
 * iis.png grounding premise was disproven at execution (no slider in the
 * capture or the live DOM — spec Change Log), so the geometry follows KIT
 * REGISTERS: the track is the tk-progress-bar mold (4px full-width pill,
 * border-default rail, radius-full) and the thumb is the tk-checkbox
 * engaged circle language (20px — the DESIGN 20px-wins box reading —
 * yellow-100 fill with an ink ring). Pixel grounding of these numbers is
 * an explicit HOLD → 24T capture target (TERMINAL-CAPTURE-CHECKLIST).
 *
 * Per-component custom properties (`--tk-range-slider-*`, CONVENTIONS §6),
 * each consumed WITH its token default as the fallback:
 * - `--tk-range-slider-track-height` track bar height (default 4px — the
 *   progress-bar DESIGN default, same structural flag)
 * - `--tk-range-slider-thumb-size`   thumb diameter (default 20px — the
 *   checkbox box DESIGN win; structural, same flag family)
 * - `--tk-range-slider-track-color`  rail fill (default border-default —
 *   the progress-bar track semantic: light value = gray-200's hex, dark
 *   remaps to the white-alpha tonal step)
 * - `--tk-range-slider-fill-color`   filled portion (default yellow-100 —
 *   the kit's engaged-control language, tk-checkbox's checked fill)
 * - `--tk-range-slider-thumb-color`  thumb fill (default yellow-100)
 * - `--tk-range-slider-thumb-ring`   thumb contrast ring (default ink-300 —
 *   the checkbox glyph pairing; keeps the yellow thumb visible over the
 *   yellow fill AND the gray rail in both themes)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart: the 4px track height and
 * 20px thumb defaults (above), the 2px ring width (the unified ring metric,
 * §8) and the 44px interaction row height (the §8 target floor).
 * Fill width and thumb left% arrive as inline styles — computed GEOMETRY,
 * not theming (the tk-progress-bar `width: N%` precedent).
 */
export const rangeSliderStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* --- Disabled (the checkbox mold): 40% opacity, no pointer events; the
     control stays focusable — aria-disabled carries the state and the input
     handler guards commits. --- */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* --- Header row (the tk-progress-bar header mold): label left, formatted
     value right, body-s pair, one 8px gap above the track. Rendered only
     when it carries content (label prop/slot or a value slot) — a bare
     slider is track-only. --- */
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--tk-space-16);
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
  }

  .header[hidden],
  .header > [hidden] {
    display: none;
  }

  .header__label {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-range-slider-text, var(--tk-color-text-secondary));
  }

  .header__value {
    font-size: var(--tk-text-body-s-bold-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    /* Bold steps carry no leading token — the base-step leading governs. */
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-range-slider-value-text, var(--tk-color-text-primary));
  }

  /* --- Interaction row: the invisible NATIVE input[type=range] is THE
     interaction surface (keyboard, drag, touch, announcements — free), laid
     over the token-painted visual. The 44px height is the §8 target floor —
     the 4px track alone could never carry touch. Both children are
     positioned, DOM order paints the input above (checkbox mold, no
     z-index). --- */
  .row {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
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
    /* The native engine paints its own track/thumb on some platforms even
       under appearance:none (Safari knobs) — clip to nothing: the visual
       below is the only painted surface. */
    background: transparent;
    border: none;
  }

  /* The painted track: the progress-bar mold. Inset by half the thumb on
     both sides so the VISUAL thumb travel matches the native engine's thumb
     geometry (native centers its thumb over [half-thumb … width−half-thumb]
     — an uninset track would drift from the pointer at the extremes). */
  .visual {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: var(--tk-range-slider-track-height, 4px);
    margin: 0 calc(var(--tk-range-slider-thumb-size, 20px) / 2);
    border-radius: var(--tk-radius-full);
    background: var(--tk-range-slider-track-color, var(--tk-color-border-default));
    /* The thumb is taller than the track — the visual layer must not clip it. */
    overflow: visible;
  }

  .fill {
    position: absolute;
    inset: 0 auto 0 0;
    width: 50%;
    border-radius: var(--tk-radius-full);
    background: var(--tk-range-slider-fill-color, var(--tk-color-yellow-100));
  }

  .thumb {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    width: var(--tk-range-slider-thumb-size, 20px);
    height: var(--tk-range-slider-thumb-size, 20px);
    border-radius: var(--tk-radius-full);
    background: var(--tk-range-slider-thumb-color, var(--tk-color-yellow-100));
    box-shadow: 0 0 0 2px var(--tk-range-slider-thumb-ring, var(--tk-color-ink-300));
    transform: translate(-50%, -50%);
    /* Direct manipulation, not state animation: NO transition on position —
       the thumb tracks the pointer/native value frame-for-frame (a curve
       here would lag every drag). Colors do not animate either — the thumb
       has no color states (hover affordance lives on the native cursor). */
  }

  /* Unified focus ring — 2px token ring, offset 2px, drawn on the VISIBLE
     thumb (:has() bridges the sibling order — the evergreen technique the
     data-table row link documented; the invisible input owns
     :focus-visible). Suppression nowhere: the input paints nothing. */
  .row:has(.control__input:focus-visible) .thumb {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* The native input's own hit layer never paints anything (the Safari
     guard above) — belt and braces for engine quirks. */
  .control__input:focus {
    outline: none;
  }
`;
