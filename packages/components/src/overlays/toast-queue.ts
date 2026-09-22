/**
 * Cross-instance Toast stacking — AD-12's "no z-index wars between toasts".
 *
 * One module-level queue owns ORDER ONLY: bottom-right column, at most
 * `TK_TOAST_MAX_VISIBLE` (3) visible, the OLDEST collapses the moment a 4th
 * arrives, and dismissal events re-evaluate (entries whose instance already
 * removed itself are pruned). Each instance keeps its own auto-dismiss
 * timing — the queue never starts or stops timers; a collapsed toast's exit
 * animation is the instance's business (`onCollapse` is the notification; the
 * default collapses immediately by removing the element).
 *
 * Host lifecycle is driven by a MutationObserver on the host's children:
 * self-removal by instances (the advertised auto-dismiss pattern) prunes
 * their entries without any queue call, and the host is torn down only when
 * nothing connected remains — a still-animating collapsed toast keeps the
 * host mounted until its instance finishes the exit and removes the element.
 *
 * The queue has no visual surface: the host element carries arrangement
 * mechanics only (fixed bottom-right column, gap/padding from `--tk-space-*`
 * tokens, click-through so empty stack areas never intercept page input).
 * The host itself is mounted through `mountOverlay(host, 'toast')` —
 * top-layer promotion when the popover API is available (lazily, at the
 * FIRST toast, so it paints above modals mounted before it), the token-z
 * fallback container otherwise. Toast surfaces make themselves interactive
 * (`pointer-events`) — the host is deliberately pass-through and children
 * would otherwise inherit `none`.
 *
 * The host is fully torn down (unmounted, removed) when the queue empties.
 */

import { mountOverlay, type TkOverlayHandle } from './controller.js';

/** Maximum simultaneously visible toasts; the oldest collapses on overflow. */
export const TK_TOAST_MAX_VISIBLE = 3;

/** `id` of the stacking host — consumers may detect it (never required). */
export const TOAST_STACK_ID = 'tk-toast-stack';

/** Per-instance enqueue options. */
export interface TkToastOptions {
  /** The toast surface element (consumer-owned, e.g. a future tk-toast). */
  element: HTMLElement;
  /**
   * Called with the element when the queue collapses this toast (overflow).
   * The element is removed from the QUEUE immediately (the slot is freed);
   * with a callback the element's removal/exit animation is the instance's
   * business. Without one the element is removed from the host right away.
   */
  onCollapse?: (element: HTMLElement) => void;
}

/** Toast handle — `dismiss()` removes the toast from the stack. Idempotent. */
export interface TkToastHandle {
  readonly element: HTMLElement;
  dismiss(): void;
}

interface ToastEntry {
  element: HTMLElement;
  onCollapse?: (element: HTMLElement) => void;
  handle: TkToastHandle;
}

const stack: ToastEntry[] = [];
let host: HTMLDivElement | null = null;
let hostMount: TkOverlayHandle | null = null;
let observer: MutationObserver | null = null;

function detachFromHost(element: HTMLElement): void {
  if (host && element.parentElement === host) host.removeChild(element);
}

function teardownHost(): void {
  observer?.disconnect();
  observer = null;
  hostMount?.release();
  hostMount = null;
  host?.remove();
  host = null;
}

/**
 * The queue's re-evaluation, driven by dismissal events AND the host's
 * MutationObserver (which is what covers the advertised self-removal
 * pattern — instances auto-dismissing their own elements): prune entries
 * whose element left the DOM, then tear the host down ONLY when nothing
 * connected remains. A still-animating collapsed toast (an `onCollapse`
 * exit animation) keeps the host alive until its instance removes the
 * element — the observer fires again and finishes the teardown.
 */
function reevaluate(): void {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const entry = stack[index];
    if (entry && !entry.element.isConnected) stack.splice(index, 1);
  }
  if (host && stack.length === 0 && host.childElementCount === 0) teardownHost();
}

function dismissEntry(entry: ToastEntry): void {
  const index = stack.indexOf(entry);
  if (index === -1) return; // already dismissed or collapsed — idempotent no-op
  stack.splice(index, 1);
  detachFromHost(entry.element);
  reevaluate();
}

function collapseEntry(entry: ToastEntry): void {
  const index = stack.indexOf(entry);
  if (index !== -1) stack.splice(index, 1);
  if (entry.onCollapse) entry.onCollapse(entry.element);
  else detachFromHost(entry.element);
  // With onCollapse the element's exit (and its removal) is the instance's
  // business — the host observer picks up the final removal.
}

function ensureHost(): HTMLDivElement {
  if (host && host.isConnected) return host;
  // The host was externally disconnected: release the stale mount (its
  // handle, z token and container bookkeeping) and its stale observer
  // before recreating.
  observer?.disconnect();
  observer = null;
  if (hostMount) {
    hostMount.release();
    hostMount = null;
  }
  host = document.createElement('div');
  host.id = TOAST_STACK_ID;
  // Presentation role: the host is arrangement mechanics, not content — its
  // children (the toasts) stay fully exposed to the accessibility tree.
  host.setAttribute('role', 'presentation');
  host.style.position = 'fixed';
  host.style.bottom = '0';
  host.style.right = '0';
  host.style.display = 'flex';
  host.style.flexDirection = 'column';
  host.style.gap = 'var(--tk-space-8)';
  host.style.padding = 'var(--tk-space-16)';
  host.style.pointerEvents = 'none';
  document.body.appendChild(host);
  hostMount = mountOverlay(host, 'toast');
  // mountOverlay opts mounted elements into interactivity; the stacking host
  // is a pass-through COLUMN — the toast surfaces own their pointer events.
  host.style.pointerEvents = 'none';
  observer = new MutationObserver(() => reevaluate());
  observer.observe(host, { childList: true });
  return host;
}

/**
 * Adds a toast surface to the shared bottom-right stack. When the stack is
 * already at `TK_TOAST_MAX_VISIBLE`, the OLDEST toast collapses immediately
 * (its `onCollapse` fires, or it is removed from the host by default). The
 * returned handle dismisses this toast on demand; the instance's own
 * auto-dismiss timer calls the same handle. Remounting an element already in
 * the stack returns its live handle.
 */
export function enqueueToast(options: TkToastOptions): TkToastHandle {
  if (typeof document === 'undefined' || !document.body) {
    return { element: options.element, dismiss: () => undefined };
  }
  reevaluate();
  const existing = stack.find((entry) => entry.element === options.element);
  if (existing) return existing.handle;

  const entry: ToastEntry = {
    element: options.element,
    onCollapse: options.onCollapse,
    handle: {
      element: options.element,
      dismiss: () => dismissEntry(entry),
    },
  };
  stack.push(entry);
  ensureHost().appendChild(options.element);
  while (stack.length > TK_TOAST_MAX_VISIBLE) {
    const oldest = stack[0];
    if (!oldest) break;
    collapseEntry(oldest);
  }
  return entry.handle;
}
