import { css } from 'lit';

/**
 * tk-tooltip styles — TWO sheets, the select two-sheet mold: the floating
 * SURFACE is a generated child of tk-tooltip's shadow tree carrying its OWN
 * shadow root, so its styles never leak document-level (CONVENTIONS §6) and
 * travel with it when the controller's fallback path reparents it into the
 * overlay container.
 *
 * - `tooltipStyles` — the host sheet: nothing visible (`display: contents` —
 *   the slotted trigger participates in the consumer's layout as if
 *   unwrapped).
 * - `tooltipSurfaceStyles` — the SURFACE's own sheet (the ink pill). `:host`
 *   rules are author-origin and reset the popover UA sheet on the popover
 *   mounting path (the select panel / navbar drawer precedent), and
 *   `[hidden]` is enforced explicitly — :host display:block beats the UA
 *   hidden rule without it.
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Visual spec: DESIGN.md
 * components.tooltip — «Ink-300 bg, white text-xs, rounded.sm, tooltip
 * shadow». THEME-INVARIANCE RULING (the spec asks it recorded): ink-300 has
 * NO dark remap in tokens.css, so the pill stays #333333 in BOTH themes by
 * design — white text measures 12.6:1 on it either way; consumed as-is,
 * zero component branches (NOTES.md/tooltip).
 *
 * Per-component custom properties (`--tk-tooltip-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-tooltip-fill`    pill fill      (default ink-300)
 * - `--tk-tooltip-text`    pill text      (default white)
 * - `--tk-tooltip-radius`  pill radius    (default radius-sm)
 *
 * Motion: the open fade rides the 150ms fast token on the
 * productive-standard curve (AD-9 hover mapping); opacity-only (the
 * reduced-motion rule) — the token layer collapses the duration to 0ms and
 * an opacity-only animation has no final-keyframe geometry to flash, so no
 * explicit media-query belt is needed.
 */

/** The host sheet — the host renders nothing of its own (the trigger is slotted). */
export const tooltipStyles = css`
  :host {
    display: contents;
  }
`;

/** The SURFACE sheet (the ink pill), adopted into the surface's shadow root. */
export const tooltipSurfaceStyles = css`
  :host {
    box-sizing: border-box;
    display: block;
    max-width: calc(var(--tk-space-48) * 6);
    margin: 0;
    inset: auto;
    border: none;
    padding: var(--tk-space-8) var(--tk-space-12);
    background: var(--tk-tooltip-fill, var(--tk-color-ink-300));
    color: var(--tk-tooltip-text, var(--tk-color-white));
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-xs-weight);
    line-height: var(--tk-text-body-xs-leading);
    border-radius: var(--tk-tooltip-radius, var(--tk-radius-sm));
    box-shadow: var(--tk-shadow-tooltip);
    /* The controller's positionFloating owns inline position/top/left; the
       fade rides on top without fighting it. */
    animation: tk-tooltip-in var(--tk-motion-duration-fast)
      var(--tk-motion-curve-productive-standard);
  }

  /* :host display:block beats the UA [hidden] rule — enforce closedness. */
  :host([hidden]) {
    display: none;
  }

  @keyframes tk-tooltip-in {
    from {
      opacity: 0;
    }
  }
`;
