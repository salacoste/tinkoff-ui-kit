import { css } from 'lit';

/**
 * tk-modal styles — TWO sheets, the select two-sheet mold (select.css.ts):
 * the mounted SURFACE is a generated child of tk-modal's shadow tree with
 * its OWN shadow root, so its styles never leak document-level (CONVENTIONS
 * §6) and travel with it when the controller's fallback path reparents it
 * into the overlay container.
 *
 * - `modalStyles` — adopted into the tk-modal host's shadow root: nothing
 *   visible (the host is a state holder; the surface carries everything) —
 *   `display: contents` keeps the element layout-neutral wherever consumers
 *   drop it.
 * - `modalSurfaceStyles` — adopted into the SURFACE's own shadow root
 *   (scrim + panel). `:host` rules are author-origin and reset the popover
 *   UA sheet on the popover mounting path (the select panel / navbar drawer
 *   precedent), and `[hidden]` is enforced explicitly — the UA hidden rule
 *   loses to :host's display:flex without it.
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Visual spec: DESIGN.md
 * components.modal — «White panel rounded.lg, modal shadow; dark theme tonal
 * step 3» + the Epic-4 spec rows (max-width 480, padding 32, scrim = ink
 * alpha). See NOTES.md/modal for the token-choice rulings:
 * - panel fill `--tk-color-surface-base` (light #FFFFFF = the «white panel»
 *   exactly; dark #1A1A1A — the reserved tonal-step-3 semantic does not exist
 *   in the token layer and this story adds no tokens; the scrim supplies the
 *   dark separation);
 * - scrim = ink-400 at 52% through color-mix — no ink-alpha token exists and
 *   no-new-tokens forbids inventing one; 52% echoes the modal shadow's own
 *   alpha (rgba(51,51,51,.52) in the token layer).
 *
 * Per-component custom properties (`--tk-modal-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-modal-fill`    panel fill     (default surface-base)
 * - `--tk-modal-radius`  panel radius   (default radius-lg)
 * - `--tk-modal-width`   panel max-width (default 480 — spacing-derived 10×48)
 * - `--tk-modal-scrim`   scrim fill     (default ink-400 52% via color-mix)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: none beyond the spacing-derived width arithmetic — every length is a
 * --tk-space-* step and every duration/curve a --tk-motion-* token (the
 * reduced-motion belt mirrors the navbar drawer: animation none kills any
 * final-keyframe flash after the token layer already collapsed durations).
 */

/** The host sheet — the host renders nothing of its own. */
export const modalStyles = css`
  :host {
    display: contents;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden
     (the HOST sheet's own guard; the surface sheet carries its own for the
     panel — the 8.1 kit-wide sweep). */
  :host([hidden]) {
    display: none;
  }
`;

/** The SURFACE sheet (scrim + panel), adopted into the surface's shadow root. */
export const modalSurfaceStyles = css`
  :host {
    box-sizing: border-box;
    /* Viewport-filling centring frame. The controller owns stacking (z via
       its layer token); position fixed keeps the frame viewport-anchored on
       the popover path, and is also what the fallback container expects.
       width/height auto are part of the POPOVER UA RESET (found live at the
       4.3 visual pass): UA [popover] sizes the box fit-content + auto
       margins, which would shrink the scrim to the panel — author rules win
       regardless of specificity. */
    position: fixed;
    inset: 0;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 0;
    background: transparent;
    font-family: var(--tk-font-body);
  }

  /* :host display:flex beats the UA [hidden] rule — enforce closedness. */
  :host([hidden]) {
    display: none;
  }

  /* The scrim: ink alpha (see the file header). A press on the SCRIM itself
     dismisses (select.ts wires the handler); the panel sits above it. */
  .scrim {
    position: absolute;
    inset: 0;
    background: var(--tk-modal-scrim, color-mix(in srgb, var(--tk-color-ink-400) 52%, transparent));
    animation: tk-modal-scrim-in var(--tk-motion-duration-moderate)
      var(--tk-motion-curve-productive-entrance);
  }

  /* The panel (role=dialog lives here). max-width 480 = 10 × the 48 spacing
     step; width clamps to the viewport minus a 16px step each side; the
     height cap + overflow make long bodies scroll INSIDE the panel, and
     overscroll-behavior contain is the shipped iOS momentum-scroll
     mitigation (the deferred-work entry names the real-device check). */
  .panel {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--tk-space-16);
    width: calc(100% - var(--tk-space-32));
    max-width: var(--tk-modal-width, calc(var(--tk-space-48) * 10));
    max-height: calc(100dvh - var(--tk-space-32));
    margin: 0;
    /* border-default hairline: theme-correct separation in BOTH themes —
       light gets a whisper-thin edge on white, dark gets the layer's own
       #FFFFFF24 edge, where the reserved tonal-step-3 semantic does not
       exist and the scrim alone cannot separate #1A1A1A from #1A1A1A
       (found live at the 4.3 vision pass). */
    border: 1px solid var(--tk-color-border-default);
    padding: var(--tk-space-32);
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--tk-modal-fill, var(--tk-color-surface-base));
    color: var(--tk-color-text-primary);
    border-radius: var(--tk-modal-radius, var(--tk-radius-lg));
    box-shadow: var(--tk-shadow-modal);
    animation: tk-modal-panel-in var(--tk-motion-duration-moderate)
      var(--tk-motion-curve-productive-entrance);
  }

  /* The panel is a programmatic-focus CONTAINER (tabindex=-1, the
     zero-focusables fallback): the unified ring belongs to the child
     controls — script focus on the container paints no ring of its own
     (native dialog behavior; the select trigger's dedup precedent, recorded
     in NOTES.md/modal). */
  .panel:focus-visible {
    outline: none;
  }

  .panel__heading {
    margin: 0;
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-6-size);
    font-weight: var(--tk-text-heading-6-weight);
    line-height: var(--tk-text-heading-6-leading);
    color: var(--tk-color-text-primary);
  }

  .panel__body {
    min-width: 0;
  }

  .panel__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--tk-space-12);
    margin-inline-start: auto;
  }

  /* Exit (data-closing is set by modal.ts before the awaited teardown):
     scrim fades out, panel fades + rises — 150ms productive-exit, then the
     mount releases. */
  :host([data-closing]) .scrim {
    animation: tk-modal-scrim-out var(--tk-motion-duration-fast)
      var(--tk-motion-curve-productive-exit);
  }

  :host([data-closing]) .panel {
    animation: tk-modal-panel-out var(--tk-motion-duration-fast)
      var(--tk-motion-curve-productive-exit);
  }

  @keyframes tk-modal-scrim-in {
    from {
      opacity: 0;
    }
  }

  @keyframes tk-modal-panel-in {
    from {
      opacity: 0;
      transform: translateY(var(--tk-space-16));
    }
  }

  @keyframes tk-modal-scrim-out {
    to {
      opacity: 0;
    }
  }

  @keyframes tk-modal-panel-out {
    to {
      opacity: 0;
      transform: translateY(calc(-1 * var(--tk-space-8)));
    }
  }

  /* Reduced motion: the token layer already collapsed the durations; the
     belt (navbar drawer precedent) kills any final-keyframe flash. The
     component's JS close path skips the animation wait under the same media
     query, so no dead timeout is ever awaited. */
  @media (prefers-reduced-motion: reduce) {
    .scrim,
    .panel {
      animation: none;
    }
  }
`;
