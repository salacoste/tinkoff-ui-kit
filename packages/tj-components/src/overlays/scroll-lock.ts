/**
 * Refcounted body scroll-lock — the ТЖ instance of the AD-12 "no
 * double-locking scroll" clause, translated verbatim from the bank
 * primitive (packages/components/src/overlays/scroll-lock.ts; FR-17 — a
 * deliberate, documented duplication, never an import).
 *
 * Two overlapping lock holders keep ONE lock; body scroll restores only when
 * the LAST holder releases. Each handle owns a unique token in a Set, so
 * interleaved acquire/release and double release are both safe by
 * construction.
 *
 * Compensation choice (the bank 2.2 ruling, carried as-is): `overflow:
 * hidden` on BOTH `documentElement` and `body` plus PADDING compensation on
 * `documentElement` — not `scrollbar-gutter: stable` (must already be in
 * force before the scrollbar disappears; Safari gained it only at 18.2).
 * The scrollbar width is measured BEFORE hiding (innerWidth − clientWidth)
 * and the documentElement's computed padding-right is added on top, so the
 * inline override never eats stylesheet padding. Snapshotted at the 0→1
 * transition, restored exactly at 1→0.
 *
 * SSR-safe: with no `document`/`window` (or no `<body>`) the lock is a
 * no-op handle — acquiring never touches the DOM, releasing never throws.
 */

/** Scroll-lock release handle — idempotent. */
export interface TjScrollLockHandle {
  /** Releases THIS holder's claim; the unlock happens only at the last release. */
  release(): void;
}

/** Unique acquire token per handle — the refcount is the Set's size. */
const holders = new Set<object>();

/** Inline styles displaced while locked; null when unlocked. */
interface SavedScrollStyles {
  htmlOverflow: string;
  htmlPaddingRight: string;
  bodyOverflow: string;
}

let saved: SavedScrollStyles | null = null;

function applyLock(): void {
  const html = document.documentElement;
  const body = document.body;
  if (!body) return;
  // Without a layout engine clientWidth is 0 — there is no scrollbar to
  // compensate (tests stub clientWidth when exercising the compensation).
  const clientWidth = html.clientWidth;
  const scrollbarWidth = clientWidth > 0 ? Math.max(0, window.innerWidth - clientWidth) : 0;
  saved = {
    htmlOverflow: html.style.overflow,
    htmlPaddingRight: html.style.paddingRight,
    bodyOverflow: body.style.overflow,
  };
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    const computed = parseFloat(getComputedStyle(html).paddingRight);
    html.style.paddingRight = `${scrollbarWidth + (Number.isNaN(computed) ? 0 : computed)}px`;
  }
}

function removeLock(): void {
  if (!saved) return;
  const html = document.documentElement;
  const body = document.body;
  html.style.overflow = saved.htmlOverflow;
  html.style.paddingRight = saved.htmlPaddingRight;
  if (body) {
    body.style.overflow = saved.bodyOverflow;
  }
  saved = null;
}

/**
 * Acquires a body scroll-lock claim. First claim applies the lock; every
 * handle must be released for the page to scroll again.
 */
export function lockScroll(): TjScrollLockHandle {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !document.body) {
    return { release: () => undefined };
  }
  const token: object = {};
  holders.add(token);
  if (holders.size === 1) applyLock();
  let released = false;
  return {
    release: (): void => {
      if (released) return;
      released = true;
      if (!holders.delete(token)) return;
      if (holders.size === 0) removeLock();
    },
  };
}
