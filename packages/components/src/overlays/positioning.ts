/**
 * Anchor-based floating positioning with viewport flip — AD-12's "no
 * duplicated positioning logic" clause, hand-rolled on purpose: the kit pins
 * no external positioning dependency, and the needed geometry (flip on all
 * four edges + clamp inside the viewport + reposition on scroll/resize) is
 * the ~100 lines below, unit-tested against synthetic geometry at every edge
 * and corner.
 *
 * Geometry is NOT theming — no tokens here. The requested side is preferred
 * and kept whenever the floating box fits between the anchor edge and the
 * viewport (minus `viewportPadding`); when it clips, the placement flips to
 * the opposite side if THAT fits. Both axes are then clamped fully inside
 * the viewport, so a surface is never clipped off-viewport. Degenerate case
 * (floating box larger than viewport − 2·padding): the clamp pins to the
 * leading edge — documented best-effort, matching the spec's error-handling
 * column.
 *
 * `positionFloating` (the DOM half) repositions on window `scroll` (capture
 * phase, so scrolls of nested containers reposition too) and `resize`, both
 * passive; both listeners are removed on release. Surfaces must be connected
 * and visible when positioned — a `display: none` surface measures as zero.
 * Coordinate mode is `position: fixed` (viewport space, what the rects are
 * in); prior inline `position`/`top`/`left` are snapshotted and restored on
 * release. Surfaces should be margin-free or carry their margins themselves —
 * margins shift the box off the computed coordinates.
 */

/** The four anchored sides. */
export type TkPlacement = 'top' | 'right' | 'bottom' | 'left';

/** Synthetic anchor rect — enough of DOMRect for the pure geometry. */
export interface TkRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Viewport size (window.innerWidth/innerHeight shape). */
export interface TkViewport {
  width: number;
  height: number;
}

/** Geometry options shared by the pure computation and the DOM wrapper. */
export interface TkComputeOptions {
  /** Requested side; flipped to the opposite only when clipped. Default `bottom`. */
  placement?: TkPlacement;
  /** Gap between anchor edge and floating box, px. Default 0. */
  offset?: number;
  /** Minimum distance from every viewport edge, px. Default 8. */
  viewportPadding?: number;
}

/** A computed floating position in viewport coordinates. */
export interface TkFloatingPosition {
  top: number;
  left: number;
  /** The placement in force AFTER the flip decision. */
  placement: TkPlacement;
}

const OPPOSITE: Readonly<Record<TkPlacement, TkPlacement>> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/** Degenerate-friendly clamp: when max < min the leading edge (min) wins. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Pure geometry (the unit-tested core): where to put a `floating` box against
 * an `anchor` rect inside a `viewport` — flip when clipped on the requested
 * side, clamp both axes fully inside the viewport.
 */
export function computeFloatingPosition(
  anchor: TkRect,
  floating: { width: number; height: number },
  viewport: TkViewport,
  options: TkComputeOptions = {},
): TkFloatingPosition {
  const placement = options.placement ?? 'bottom';
  const offset = options.offset ?? 0;
  const padding = options.viewportPadding ?? 8;

  // Loud failure (module style): an unknown placement would fall through the
  // switches as `undefined` and silently produce an unpositioned surface.
  if (!Object.prototype.hasOwnProperty.call(OPPOSITE, placement)) {
    throw new Error(
      `positionFloating: unknown placement '${String(placement)}' — expected top/right/bottom/left`,
    );
  }

  const anchorRight = anchor.left + anchor.width;
  const anchorBottom = anchor.top + anchor.height;

  const fits = (side: TkPlacement): boolean => {
    switch (side) {
      case 'bottom':
        return anchorBottom + offset + floating.height <= viewport.height - padding;
      case 'top':
        return anchor.top - offset - floating.height >= padding;
      case 'right':
        return anchorRight + offset + floating.width <= viewport.width - padding;
      case 'left':
        return anchor.left - offset - floating.width >= padding;
    }
  };

  // Prefer the requested side; flip only when it clips AND the opposite fits.
  // Neither fits (degenerate geometry) → keep the requested side, clamped.
  let chosen = placement;
  if (!fits(placement) && fits(OPPOSITE[placement])) chosen = OPPOSITE[placement];

  let top: number;
  let left: number;
  switch (chosen) {
    case 'bottom':
      top = anchorBottom + offset;
      left = anchor.left;
      break;
    case 'top':
      top = anchor.top - offset - floating.height;
      left = anchor.left;
      break;
    case 'right':
      left = anchorRight + offset;
      top = anchor.top;
      break;
    case 'left':
      left = anchor.left - offset - floating.width;
      top = anchor.top;
      break;
  }

  // Clamp both axes — never clipped off-viewport, horizontally shifted inside
  // even without a flip (the anchor itself may hang past an edge).
  left = clamp(left, padding, viewport.width - floating.width - padding);
  top = clamp(top, padding, viewport.height - floating.height - padding);
  return { top, left, placement: chosen };
}

/** DOM-facing options: the geometry options plus the anchor element. */
export interface TkPositionFloatingOptions extends TkComputeOptions {
  /** The element the floating surface anchors to (trigger, input, button…). */
  anchor: HTMLElement;
}

/** Positioning handle — `placement` reflects the last applied flip decision. */
export interface TkPositioningHandle {
  readonly placement: TkPlacement;
  /** Recomputes and re-applies the position (also called by scroll/resize). */
  reposition(): void;
  /** Removes the listeners and restores prior inline position styles. Idempotent. */
  release(): void;
}

/**
 * Positions `floating` against `options.anchor` and keeps it positioned on
 * scroll (capture phase — nested containers included) and resize until
 * released.
 *
 * - The INITIAL placement is synchronous; scroll/resize-triggered repositions
 *   are coalesced to one `requestAnimationFrame` per overlay (a capture-phase
 *   scroll burst otherwise runs rect reads + style writes per event — layout
 *   thrash with several overlays open). The pending frame is cancelled on
 *   release; where rAF is unavailable the reposition runs synchronously.
 * - A handle whose anchor leaves the DOM AUTO-RELEASES on the next
 *   reposition: a detached anchor measures zero and would clamp the surface
 *   into the viewport corner.
 * - SSR-safe: without a `window` the handle is inert.
 */
export function positionFloating(
  floating: HTMLElement,
  options: TkPositionFloatingOptions,
): TkPositioningHandle {
  const requested = options.placement ?? 'bottom';
  if (typeof window === 'undefined') {
    return {
      get placement() {
        return requested;
      },
      reposition: () => undefined,
      release: () => undefined,
    };
  }

  const priorStyles = {
    position: floating.style.position,
    top: floating.style.top,
    left: floating.style.left,
  };
  let current = requested;
  let released = false;
  let frame: number | null = null;
  // A pending flag separate from the frame id: a host with a SYNCHRONOUS
  // requestAnimationFrame would run the callback before the id assignment
  // lands — the id alone cannot gate re-scheduling.
  let framePending = false;

  const releaseHandle = (): void => {
    if (released) return;
    released = true;
    if (frame !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frame);
    }
    frame = null;
    framePending = false;
    // capture must match the add for removal; passive is add-only.
    window.removeEventListener('scroll', onViewportChange, { capture: true });
    window.removeEventListener('resize', onViewportChange);
    floating.style.position = priorStyles.position;
    floating.style.top = priorStyles.top;
    floating.style.left = priorStyles.left;
  };

  const reposition = (): void => {
    if (released) return;
    // Detached anchor (trigger removed while open): zero rects would clamp
    // the surface into the viewport corner — auto-release instead.
    if (!options.anchor.isConnected) {
      releaseHandle();
      return;
    }
    const anchorRect = options.anchor.getBoundingClientRect();
    const floatingRect = floating.getBoundingClientRect();
    const position = computeFloatingPosition(
      {
        top: anchorRect.top,
        left: anchorRect.left,
        width: anchorRect.width,
        height: anchorRect.height,
      },
      { width: floatingRect.width, height: floatingRect.height },
      { width: window.innerWidth, height: window.innerHeight },
      options,
    );
    floating.style.position = 'fixed';
    floating.style.top = `${position.top}px`;
    floating.style.left = `${position.left}px`;
    current = position.placement;
  };

  const onViewportChange = (): void => {
    if (released || framePending) return;
    if (typeof requestAnimationFrame !== 'function') {
      reposition(); // no rAF (exotic hosts) — degrade to synchronous
      return;
    }
    framePending = true;
    frame = requestAnimationFrame(() => {
      framePending = false;
      frame = null;
      reposition();
    });
  };

  reposition();
  window.addEventListener('scroll', onViewportChange, { capture: true, passive: true });
  window.addEventListener('resize', onViewportChange, { passive: true });

  return {
    get placement() {
      return current;
    },
    reposition,
    release: releaseHandle,
  };
}
