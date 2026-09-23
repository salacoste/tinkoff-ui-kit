import { TkToast, type TkToastVariant } from './toast.js';

/**
 * The imperative toast helper (Story 4.3) — the ONLY sanctioned imperative
 * overlay pattern (CONVENTIONS §9 «Frozen overlay usage API»): fire-and-forget
 * notifications have nothing in the consumer's tree, so Toast may ship a
 * programmatic `show` — BUILT ON THE SAME ELEMENT AND SLOTS, never a parallel
 * API. This function constructs a real `tk-toast`, sets its props, slots the
 * message/action as light-DOM nodes (exactly what a declarative consumer
 * writes), and appends it to the document — the element's connectedCallback
 * self-enqueues it into the shared bottom-right stack. No other surface in
 * the kit has an imperative helper.
 */

/** The action sugar: a plain light-DOM button slotted into `action`. */
export interface TkShowToastAction {
  /** The action's visible label (also its accessible name). */
  label: string;
  /** The action's native click handler — the toast stays until duration/dismiss. */
  onClick?: (event: Event) => void;
}

/** showToast options — the declarative surface, mirrored 1:1. */
export interface TkShowToastOptions {
  /** The message (the toast's default slot). */
  message: string;
  /** Icon + announcement register (the element's `variant` prop). */
  variant?: TkToastVariant;
  /** Auto-dismiss window in ms; 0 = sticky. Default 5000. */
  duration?: number;
  /** ONE interactive element — pre-built (slot=action is set) or { label, onClick } sugar. */
  action?: HTMLElement | TkShowToastAction;
}

/** The imperative handle — dismiss() runs the element's own exit funnel. */
export interface TkShowToastHandle {
  dismiss(): void;
}

/**
 * Shows a toast: builds a `tk-toast` element and lets its connectedCallback
 * enqueue it into the shared stack. SSR-safe degenerate handle without a
 * document/body — MIRRORING enqueueToast's own no-body guard (a bodyless
 * pre-hydration document would append to nothing and the toast would never
 * reach the stack).
 */
export function showToast(options: TkShowToastOptions): TkShowToastHandle {
  if (typeof document === 'undefined' || !document.body) {
    return { dismiss: () => undefined };
  }
  const toast = new TkToast();
  if (options.variant !== undefined) toast.variant = options.variant;
  if (options.duration !== undefined) toast.duration = options.duration;
  // The message is SLOT content — a text node, exactly the declarative form.
  toast.append(options.message);
  const action = options.action;
  if (action instanceof HTMLElement) {
    action.setAttribute('slot', 'action');
    toast.append(action);
  } else if (action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    if (action.onClick) button.addEventListener('click', action.onClick);
    button.setAttribute('slot', 'action');
    toast.append(button);
  }
  document.body.appendChild(toast); // self-enqueues on connect
  return { dismiss: () => toast.dismiss() };
}
