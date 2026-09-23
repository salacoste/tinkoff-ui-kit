import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { enqueueToast } from '../overlays/index.js';
import { toastStyles } from './toast.css.js';

/** The variant union. */
export type TkToastVariant = 'default' | 'destructive';

/**
 * Upper bound on the awaited exit animation before the element removes
 * itself — a JS timing constant (the select typeahead's precedent: the token
 * layer cannot feed JS waits): 150ms exit + frame slack. Animation end OR
 * this bound, whichever first; skipped entirely under
 * prefers-reduced-motion (where the sheet's animation is already none).
 */
export const TK_TOAST_EXIT_MAX_MS = 350;

/** The default auto-dismiss window — EXPERIENCE.md: «Auto-dismiss 5s default». */
export const TK_TOAST_DEFAULT_DURATION_MS = 5000;

/**
 * Connected toasts — the module-level registry Esc reads: the NEWEST
 * connected toast is dismissed (never steals focus). Also owns the single
 * document-level keydown listener (attached while any toast is connected).
 */
const connectedToasts: TkToast[] = [];

const onDocumentKeydown = (event: KeyboardEvent): void => {
  if (event.key !== 'Escape') return;
  // A toast mid-exit is already leaving — Esc must reach the newest LIVE
  // one, or the press would die with the animating element (fix-round
  // finding: the dead-press window was the exit bound, ≤350ms).
  const newestLive = [...connectedToasts]
    .reverse()
    .find((toast) => !toast.hasAttribute('data-exiting'));
  newestLive?.dismiss();
};

/** The token layer collapses durations under this query; the JS waits with it. */
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * tk-toast — the derived notification card (Story 4.3). NO kit events, no
 * `open` channel: a toast is fire-and-forget — it appears already visible,
 * never takes focus (no tabindex, no focus() — structural pins), and removes
 * itself when done. That is the documented §9/event-map ruling (native click
 * on the slotted action serves the action — the button/cards precedent).
 *
 * SELF-ENQUEUE (the §9 «built on the SAME elements» rule made literal): the
 * element enqueues ITSELF on connectedCallback —
 * `enqueueToast({ element: this, onCollapse: exit-then-remove })` — so BOTH
 * usage patterns are the same element: declarative (create/append a tk-toast
 * anywhere; it relocates into the shared bottom-right host) and imperative
 * (`showToast(options)` sugar in ./show.ts that builds THIS element, sets
 * props, slots the optional action, returns a dismiss handle). Stacking
 * (bottom-right, max 3 visible, oldest collapses) is the queue's; the
 * auto-dismiss TIMER is the element's own (the queue never starts or stops
 * timers).
 *
 * REMOVAL IS SELF-REMOVAL (the queue's advertised pattern): dismiss() plays
 * the exit animation and removes the element; the stacking host's
 * MutationObserver prunes the queue entry and tears the host down when the
 * last toast leaves (2.2 contract) — the queue's handle.dismiss is never
 * used from here, precisely so the exit animation paints before the element
 * leaves the host.
 *
 * ANNOUNCEMENTS: default → aria-live="polite" on the host; destructive →
 * role="alert" (implies assertive) — never both. The message is the default
 * slot; the action is the named `action` slot (ONE interactive element; its
 * native click is the consumer's — the toast STAYS until duration/dismiss,
 * the recorded pick). The per-variant icon is an internal token-drawn SVG,
 * aria-hidden.
 *
 * TIMING: `duration` ms (default 5000; 0 = sticky until Esc/dismiss;
 * negative clamps to 0, non-finite degrades to the default). Auto-dismiss
 * PAUSES on pointerenter/focusin and RESUMES on pointerleave/focusout.
 *
 * SSR-compat (AD-10): no imperative DOM at construction; the queue's
 * enqueueToast itself no-ops without a document.
 *
 * REACT CAVEAT (wrapper consumers): the self-enqueue RELOCATES the element
 * out of whatever container it was mounted in (into the shared bottom-right
 * host). Unmounting a relocated toast through a container-owning renderer
 * (React's root.unmount) throws removeChild on a node it no longer parents —
 * re-home it first or, better, use the imperative showToast helper for
 * fire-and-forget notifications (the §9 pattern). The generated wrapper
 * works while mounted; this is the documented cost of the shared stack.
 *
 * @tag tk-toast
 * @attr {'default'|'destructive'} variant - Icon + announcement register: default renders the success check with aria-live polite; destructive renders the error glyph with role=alert. Invalid values clamp to 'default'.
 * @attr {number} duration - Auto-dismiss window in ms; 0 = sticky (until Esc/dismiss). Default 5000.
 * @slot - The message.
 * @slot action - ONE interactive element; its native click is the consumer's (the toast stays until duration/dismiss).
 */
export class TkToast extends LitElement {
  static override readonly styles = [toastStyles];

  /** Icon + announcement register — invalid values clamp to 'default' (CONVENTIONS §2). */
  @property({ type: String, reflect: true })
  variant: TkToastVariant = 'default';

  /**
   * Auto-dismiss window in ms — 0 = sticky; negative clamps to 0. Number
   * data, never reflected (CONVENTIONS §2).
   */
  @property({ type: Number })
  duration = TK_TOAST_DEFAULT_DURATION_MS;

  /** The effective auto-dismiss window after clamps. */
  get #effectiveDuration(): number {
    if (!Number.isFinite(this.duration)) return TK_TOAST_DEFAULT_DURATION_MS;
    return this.duration < 0 ? 0 : this.duration;
  }

  #timer: number | null = null;
  #deadline = 0;
  #remaining = 0;
  #exiting = false;

  override connectedCallback(): void {
    super.connectedCallback();
    // Hover/focus pause — host-level listeners (pointerenter/leave do not
    // bubble; the host itself is the boundary).
    this.addEventListener('pointerenter', this.#handlePointerEnter);
    this.addEventListener('pointerleave', this.#handlePointerLeave);
    this.addEventListener('focusin', this.#handleFocusIn);
    this.addEventListener('focusout', this.#handleFocusOut);
    if (!connectedToasts.includes(this)) connectedToasts.push(this);
    if (connectedToasts.length === 1) {
      document.addEventListener('keydown', onDocumentKeydown);
    }
    this.#startTimer();
    // SELF-ENQUEUE — LAST ON PURPOSE (see the class doc): the shared host
    // relocates this element into the bottom-right stack, and the RELOCATION
    // fires a nested disconnect+connect pair inside this very call. With the
    // enqueue last, the nested teardown undoes everything above and the
    // nested connect re-establishes it once — the timer, the listeners and
    // the registry end up EXACTLY once, and enqueueToast itself is
    // idempotent for an element already in the stack. Overflow collapse
    // rides the onCollapse callback (the same exit-then-remove funnel as
    // dismiss).
    enqueueToast({ element: this, onCollapse: () => this.dismiss() });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearTimer();
    this.removeEventListener('pointerenter', this.#handlePointerEnter);
    this.removeEventListener('pointerleave', this.#handlePointerLeave);
    this.removeEventListener('focusin', this.#handleFocusIn);
    this.removeEventListener('focusout', this.#handleFocusOut);
    const index = connectedToasts.indexOf(this);
    if (index !== -1) connectedToasts.splice(index, 1);
    if (connectedToasts.length === 0) {
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  }

  /**
   * Variant clamp (CONVENTIONS §2) + the announcement attributes: polite
   * live region by default; role=alert (assertive by implication) for the
   * destructive variant — never both.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    // A duration set AFTER connect (the property path — wrappers assign
    // properties post-construction) re-arms the window from the new value;
    // the connect-time start covered the attribute path. A change mid-exit
    // is ignored (the toast is leaving).
    if (changed.has('duration')) {
      this.#clearTimer();
      this.#remaining = 0;
      if (!this.#exiting) this.#startTimer();
    }
    if (changed.has('variant')) {
      if (this.variant !== 'default' && this.variant !== 'destructive') {
        this.variant = 'default';
      }
      if (this.variant === 'destructive') {
        this.setAttribute('role', 'alert');
        this.removeAttribute('aria-live');
      } else {
        this.setAttribute('aria-live', 'polite');
        this.removeAttribute('role');
      }
    }
  }

  // --- auto-dismiss timer (the element's own; the queue never touches it) ----

  #startTimer(): void {
    const ms = this.#effectiveDuration;
    if (ms <= 0) return; // sticky
    this.#remaining = ms;
    this.#arm();
  }

  #arm(): void {
    this.#deadline = Date.now() + this.#remaining;
    this.#timer = window.setTimeout(() => {
      this.#timer = null;
      this.#remaining = 0;
      this.dismiss();
    }, this.#remaining);
  }

  #clearTimer(): void {
    if (this.#timer === null) return;
    window.clearTimeout(this.#timer);
    this.#timer = null;
    this.#remaining = Math.max(0, this.#deadline - Date.now());
  }

  // --- pause / resume (hover + focus) ------------------------------------------

  readonly #handlePointerEnter = (): void => {
    this.#clearTimer();
  };

  readonly #handlePointerLeave = (): void => {
    this.#resume();
  };

  readonly #handleFocusIn = (): void => {
    this.#clearTimer();
  };

  readonly #handleFocusOut = (): void => {
    this.#resume();
  };

  #resume(): void {
    if (this.#exiting || this.#timer !== null) return;
    if (this.#remaining <= 0) return; // sticky or already elapsed
    this.#arm();
  }

  // --- dismiss / collapse ---------------------------------------------------------

  /**
   * Dismisses the toast: the exit animation, then SELF-REMOVAL (the queue's
   * MutationObserver prunes the stack entry — see the class doc). Idempotent;
   * never moves focus.
   */
  dismiss(): void {
    if (this.#exiting || !this.isConnected) return;
    this.#exiting = true;
    this.#clearTimer();
    this.setAttribute('data-exiting', '');
    if (prefersReducedMotion()) {
      this.remove();
      return;
    }
    const finish = (): void => {
      this.removeEventListener('animationend', onEnd);
      this.remove();
    };
    const onEnd = (event: Event): void => {
      if ((event as AnimationEvent).animationName === 'tk-toast-out') finish();
    };
    this.addEventListener('animationend', onEnd);
    window.setTimeout(finish, TK_TOAST_EXIT_MAX_MS);
  }

  // --- render -----------------------------------------------------------------

  override render() {
    const destructive = this.variant === 'destructive';
    return html`
      <span
        class="toast__icon ${destructive
          ? 'toast__icon--destructive'
          : 'toast__icon--default'}"
        aria-hidden="true"
      >
        ${destructive ? errorIcon() : checkIcon()}
      </span>
      <div class="toast__message"><slot></slot></div>
      <div class="toast__action"><slot name="action"></slot></div>
    `;
  }
}

/** Success glyph — token-drawn (currentColor; the icon class carries the token). */
const checkIcon = () => html`
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="10" cy="10" r="8.25"></circle>
    <path d="M6.4 10.2l2.4 2.4 4.8-5"></path>
  </svg>
`;

/** Error glyph — token-drawn (currentColor; the icon class carries the token). */
const errorIcon = () => html`
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="10" cy="10" r="8.25"></circle>
    <path d="M10 5.75v4.5"></path>
    <circle cx="10" cy="13.4" r="0.25" fill="currentColor"></circle>
  </svg>
`;

declare global {
  interface HTMLElementTagNameMap {
    'tk-toast': TkToast;
  }
}

if (!customElements.get('tk-toast')) {
  customElements.define('tk-toast', TkToast);
}
