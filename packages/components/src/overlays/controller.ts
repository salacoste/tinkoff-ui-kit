/**
 * Overlay mounting — the AD-12 "single owner of mounting and z-order".
 *
 * Every floating surface (Select menu, Modal, Tooltip, Toast host, Navbar
 * drawer) is promoted into the top layer by THIS module, never by the
 * component; z-order is applied exclusively as a `--tk-z-*` token, never a
 * literal (FR-1 zero-hardcoded guard scans this file; the token map below is
 * the module's entire z vocabulary).
 *
 * Mechanism ladder (the spec 2.2 "pick the supported mechanism and note it"):
 *
 * | Mechanism | Where it runs | Notes |
 * |-----------|---------------|-------|
 * | Popover API (`popover="manual"` + `showPopover()`) | Chromium 114+, Firefox 125+, Safari 17+ | Primary. Promotes the element into the top layer IN PLACE — shadow-DOM- and slot-safe, no DOM move. `manual` so light-dismiss never races the component's own `open`/`open-change` semantics (CONVENTIONS §9: open state is the component's). |
 * | Document container (`#tk-overlay-root`) | everywhere else | Fallback. A fixed, viewport-spanning, click-through container appended to `<body>`; the element is reparented into it with z from its layer token and `pointer-events` restored. Removed from the document when the last overlay releases. |
 *
 * `element.appendToTopLayer?.()` is deliberately NOT a rung: it is a
 * Chromium-only non-standard precursor to the popover API, it has no demote
 * operation (release could not cleanly un-promote an element), and every
 * engine that ships it also ships `showPopover` — the gap it could cover is a
 * ten-month Chromium window irrelevant to this kit.
 *
 * Top-layer stacking note: inside the top layer, paint order is promotion
 * order (z-index is inert there) — mount order is the tiebreak, and the
 * `--tk-z-*` scale governs the fallback path exactly. Consumers needing a
 * strict cross-layer order (Toast over Modal) mount later; the toast host
 * (toast-queue.ts) is promoted lazily at the first toast for that reason.
 */

/** The overlay layers of the `--tk-z-*` scale (tokens.css, Epic 1). */
export type TkOverlayLayer = 'dropdown' | 'popover' | 'tooltip' | 'modal' | 'toast';

/** Which mounting mechanism actually placed the element. */
export type TkOverlayMountStrategy = 'popover' | 'container';

/** Opaque release handle — every capability hands one back (idempotent `release`). */
export interface TkOverlayHandle {
  readonly element: HTMLElement;
  readonly layer: TkOverlayLayer;
  readonly strategy: TkOverlayMountStrategy;
  /** Unmounts: unpromotes / detaches, restores prior inline styles. Idempotent. */
  release(): void;
}

/** `id` of the fallback container — consumers may detect it (never required). */
export const OVERLAY_CONTAINER_ID = 'tk-overlay-root';

/**
 * The layer → z-token map. Every z value in this module flows through here —
 * the strings are bare `var(--tk-z-*)` consumptions validated by the
 * consumed-tokens guard (all five are declared in tokens.css).
 */
const LAYER_Z_TOKEN: Readonly<Record<TkOverlayLayer, string>> = {
  dropdown: 'var(--tk-z-dropdown)',
  popover: 'var(--tk-z-popover)',
  tooltip: 'var(--tk-z-tooltip)',
  modal: 'var(--tk-z-modal)',
  toast: 'var(--tk-z-toast)',
};

/** The shared fallback container (created lazily, removed when unused). */
let container: HTMLDivElement | null = null;

/** Elements currently mounted — remounting an element returns its live handle. */
const activeOverlays = new Map<HTMLElement, TkOverlayHandle>();

function ensureContainer(): HTMLDivElement {
  if (container && container.isConnected) return container;
  // External removal of the container (consumer teardown scripts, framework
  // re-parenting) must not strand mounted surfaces in the detached instance:
  // re-parent every active child into the fresh container.
  const stranded = container ? Array.from(container.children) : [];
  container = document.createElement('div');
  container.id = OVERLAY_CONTAINER_ID;
  // Viewport-spanning click-through host (pure mechanics — no theming values;
  // children carry the z tokens and re-enable pointer events). `inset` keeps
  // it a positioned containing block for absolutely-positioned children.
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);
  for (const child of stranded) container.appendChild(child);
  return container;
}

/**
 * Mounts `element` as a floating surface of the given `layer`.
 *
 * The element must be a connected, visible surface when popover mounting is
 * expected (an unconnected element makes `showPopover` throw — the call falls
 * back to the container path, which reparents the element into the document).
 * Prior inline `z-index` (both paths) and `pointer-events` (container path
 * only — the popover path never touches consumer interaction styles) and the
 * `popover` attribute (popover path only) are snapshotted and restored on
 * release.
 *
 * Loud failure (module style — runtime garbage never silently produces an
 * unstyled surface): throws on an unknown `layer` (no `--tk-z-*` token for
 * it) and on remounting an element that is already mounted under a DIFFERENT
 * layer (a silent layer switch would be a z-order bug in the consumer);
 * remounting under the same layer returns the live handle (one mount, one
 * release). Without a `document`/`<body>` (SSR, pre-body edge cases) returns
 * an inert handle that touches nothing.
 */
export function mountOverlay(element: HTMLElement, layer: TkOverlayLayer): TkOverlayHandle {
  if (typeof document === 'undefined' || !document.body) {
    return { element, layer, strategy: 'container', release: () => undefined };
  }
  if (!Object.prototype.hasOwnProperty.call(LAYER_Z_TOKEN, layer)) {
    throw new Error(`mountOverlay: unknown overlay layer '${String(layer)}' — no --tk-z-* token for it`);
  }
  const existing = activeOverlays.get(element);
  if (existing) {
    if (existing.layer !== layer) {
      throw new Error(
        `mountOverlay: element is already mounted as layer '${existing.layer}' — refusing the silent switch to '${layer}' (release first)`,
      );
    }
    return existing;
  }

  const priorZIndex = element.style.zIndex;
  const priorPointerEvents = element.style.pointerEvents;
  const priorPopoverAttribute = element.getAttribute('popover');

  let strategy: TkOverlayMountStrategy = 'container';

  if (typeof element.showPopover === 'function') {
    element.setAttribute('popover', 'manual');
    try {
      element.showPopover();
      strategy = 'popover';
    } catch {
      // Unconnected or otherwise unshowable (consumer race): undo and fall
      // through to the container path below.
      if (priorPopoverAttribute === null) element.removeAttribute('popover');
      else element.setAttribute('popover', priorPopoverAttribute);
    }
  }

  // The layer z token is applied on BOTH paths (the property is snapshot-
  // restored on release); inside the top layer z-index is inert — paint order
  // there is promotion order — but the token keeps the fallback path and any
  // consumer CSS on one vocabulary.
  element.style.zIndex = LAYER_Z_TOKEN[layer];
  // Interaction opt-in is needed ONLY by fallback children (the click-through
  // host would otherwise swallow their pointer events). The popover path
  // leaves consumer pointer-events styles untouched.
  let pointerEventsTouched = false;
  if (strategy === 'container') {
    element.style.pointerEvents = 'auto';
    pointerEventsTouched = true;
    ensureContainer().appendChild(element);
  }

  let released = false;
  const handle: TkOverlayHandle = {
    element,
    layer,
    strategy,
    release: (): void => {
      if (released) return;
      released = true;
      activeOverlays.delete(element);
      if (strategy === 'popover') {
        try {
          if (element.matches(':popover-open')) element.hidePopover();
        } catch {
          // The consumer already hid/removed the surface — nothing to demote.
        }
        if (priorPopoverAttribute === null) element.removeAttribute('popover');
        else element.setAttribute('popover', priorPopoverAttribute);
      }
      if (container && element.parentElement === container) container.removeChild(element);
      element.style.zIndex = priorZIndex;
      if (pointerEventsTouched) element.style.pointerEvents = priorPointerEvents;
      if (container && container.childElementCount === 0) {
        container.remove();
        container = null;
      }
    },
  };

  activeOverlays.set(element, handle);
  return handle;
}
