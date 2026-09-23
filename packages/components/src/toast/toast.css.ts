import { css } from 'lit';

/**
 * tk-toast styles — ONE sheet: the toast HOST is the visual card (it renders
 * its own icon + message slot + action slot in its shadow root), and the
 * queue relocates the whole host into the shared stacking host
 * (#tk-toast-stack) — styles travel with the element by construction, no
 * second sheet needed (unlike modal/tooltip whose surfaces are generated).
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Visual spec: DESIGN.md
 * components.toast — «White card rounded.lg, default shadow, icon + message
 * + optional action» + the Epic-4 spec rows (padding 16/20, entrance
 * slide-up+fade 150ms fast productive-entrance, exit 150ms).
 *
 * POINTER EVENTS: the stacking host is deliberately click-through and
 * children would inherit `none` (toast-queue.ts) — the toast re-enables
 * interaction on itself (hover-pause and the action button depend on it).
 *
 * Per-component custom properties (`--tk-toast-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-toast-fill`    card fill     (default surface-base)
 * - `--tk-toast-radius`  card radius   (default radius-lg)
 * - `--tk-toast-icon`    icon color    (default: per-variant — green-200 for
 *   the default check, the error semantic for destructive; see the class
 *   doc for the AA non-text ruling)
 *
 * Motion: entrance translateY(16px→0) + fade on the 150ms fast
 * productive-entrance token; exit the reverse on productive-exit (the
 * JS side awaits animationend with a bound). The reduced-motion belt kills
 * both keyframes after the token layer already collapsed the durations.
 */

export const toastStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    gap: var(--tk-space-12);
    max-width: calc(var(--tk-space-48) * 10);
    margin: 0;
    padding: var(--tk-space-16) var(--tk-space-20);
    background: var(--tk-toast-fill, var(--tk-color-surface-base));
    color: var(--tk-color-text-primary);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    border-radius: var(--tk-toast-radius, var(--tk-radius-lg));
    box-shadow: var(--tk-shadow-default);
    /* The stacking host is pass-through (toast-queue.ts); a toast opts back
       into interaction for itself — hover-pause and the action button. */
    pointer-events: auto;
    animation: tk-toast-in var(--tk-motion-duration-fast)
      var(--tk-motion-curve-productive-entrance);
  }

  :host([data-exiting]) {
    animation: tk-toast-out var(--tk-motion-duration-fast)
      var(--tk-motion-curve-productive-exit);
  }

  /* The internal per-variant glyph: aria-hidden in the template; color via
     the per-variant token class (currentColor stroke). The 0.5px block
     offset is OPTICAL ALIGNMENT — the 20px circle glyph rides a hair high
     against the 15px/1.5 text line beside it; half a pixel centers the
     stroke-weight difference with no measurable layout shift. */
  .toast__icon {
    flex: none;
    display: inline-flex;
    margin-block-start: 0.5px;
  }

  .toast__icon--default {
    color: var(--tk-toast-icon, var(--tk-color-green-200));
  }

  .toast__icon--destructive {
    color: var(--tk-toast-icon, var(--tk-color-error));
  }

  .toast__message {
    flex: 1;
    min-width: 0;
  }

  .toast__action {
    flex: none;
    display: inline-flex;
    align-items: center;
  }

  /* The action slot's interactive element: a bare light-DOM button gets the
     link-register affordance; kit buttons (tk-button) bring their own. The
     ≥44px interactive-target floor (EXPERIENCE A11y Floor) applies to the
     EFFECTIVE box — min-height plus inline padding make the whole row-high
     box clickable, the navbar drawer-link pattern — never just the glyphs. */
  ::slotted(button) {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 44px;
    margin: 0;
    border: none;
    padding: 0;
    padding-inline: var(--tk-space-8);
    background: none;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-link);
    cursor: pointer;
  }

  /* The pseudo-class must live INSIDE ::slotted() — the form with it
     appended AFTER the closing paren is silently DROPPED at parse (CSS
     Scoping: nothing may compound after ::slotted(); probed via CSSOM) —
     the 5.1 sweep finding: the action button fell back to the UA ring. */
  ::slotted(button:focus-visible) {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  @keyframes tk-toast-in {
    from {
      opacity: 0;
      transform: translateY(var(--tk-space-16));
    }
  }

  @keyframes tk-toast-out {
    to {
      opacity: 0;
      transform: translateY(var(--tk-space-16));
    }
  }

  /* Reduced motion: the token layer already collapsed the durations; the
     belt kills any final-keyframe flash (the navbar drawer precedent — the
     JS exit path skips the animation wait under the same media query). */
  @media (prefers-reduced-motion: reduce) {
    :host,
    :host([data-exiting]) {
      animation: none;
    }
  }
`;
