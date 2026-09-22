/**
 * Overlays — the single owner of floating-surface mechanics (AD-12, Story 2.2).
 *
 * A framework-agnostic module, NOT a custom element: no `tk-` tag, no shadow
 * root, no styles of its own beyond what the fallback container and the toast
 * stacking host need for arrangement (token-driven). Nothing here renders
 * standalone — Select (2.3) is the first consumer; Modal, Tooltip and Toast
 * (Epic 4) and the Navbar drawer (Epic 3) follow. CONVENTIONS §9 (frozen at
 * 2.1) binds them to consume this module for mechanics while the declarative
 * `open` / `open-change` contract stays with the components.
 *
 * Capability → AD-12 clause map (each capability's file carries its details):
 *
 * | Capability | File | AD-12 clause |
 * |---|---|---|
 * | `mountOverlay` — top-layer mounting with token-driven fallback, z-order only via `--tk-z-*` | controller.ts | one owner of mounting and stacking; components never z-index themselves |
 * | `lockBodyScroll` — refcounted body scroll-lock with scrollbar-gutter compensation | scroll-lock.ts | no double-locking scroll between simultaneous overlays |
 * | `positionFloating` / `computeFloatingPosition` — anchor positioning, all-four-edge flip, viewport clamp, scroll/resize tracking | positioning.ts | no duplicated positioning logic across floating components |
 * | `enqueueToast` — cross-instance stacking, bottom-right, max 3 visible, oldest collapses | toast-queue.ts | no z-index wars; stacking order owned once |
 * | `trapFocus` — Tab/Shift-Tab cycle + focus restore | focus-trap.ts | the 1.2 review finding: Modal/drawer consume the primitive, none reimplements it |
 *
 * Accepted limitations (documented deliberately, not accidents):
 * - Scroll-lock on iOS Safari: `overflow: hidden` does not stop momentum
 *   (touch) scrolling — a touch/overscroll strategy is deferred to Modal
 *   (4.1), where real-device checks land; the current lock is correct on
 *   desktop engines and non-momentum touch.
 * - Focusable visibility is selector-level only — no layout probing: an
 *   element matching the focusable selector inside the container's composed
 *   subtree (open shadow roots included, see focus-trap.ts) counts as
 *   focusable even when visually hidden, unless the consumer hides or removes
 *   it. Closed shadow roots are invisible to the traversal and are never
 *   yanked out of.
 *
 * Guard interactions (spec 2.2 Code Map):
 * - This directory is a module, not a component: the consumed-tokens guard
 *   derives `--tk-<component>-*` hook prefixes from `src/*` directories —
 *   `overlays` joining that set is harmless (this module declares no
 *   `--tk-overlays-*` hooks; its only token consumption is the z-scale and
 *   `--tk-space-*` on the toast host).
 * - cem globs exclude `src/overlays/**` — the manifest is the ELEMENT api
 *   (wrapper input); function exports would only add noise. The named
 *   re-exports in `../index.ts` do appear in the manifest's `src/index.ts`
 *   export list — any export change goes through `pnpm gen` + commit.
 */

export {
  mountOverlay,
  OVERLAY_CONTAINER_ID,
  type TkOverlayHandle,
  type TkOverlayLayer,
  type TkOverlayMountStrategy,
} from './controller.js';
export { lockBodyScroll, type TkScrollLockHandle } from './scroll-lock.js';
export {
  computeFloatingPosition,
  positionFloating,
  type TkComputeOptions,
  type TkFloatingPosition,
  type TkPlacement,
  type TkPositionFloatingOptions,
  type TkPositioningHandle,
  type TkRect,
  type TkViewport,
} from './positioning.js';
export {
  enqueueToast,
  TK_TOAST_MAX_VISIBLE,
  TOAST_STACK_ID,
  type TkToastHandle,
  type TkToastOptions,
} from './toast-queue.js';
export {
  trapFocus,
  type TkFocusTrapHandle,
  type TkFocusTrapOptions,
  type TkInitialFocusTarget,
} from './focus-trap.js';
