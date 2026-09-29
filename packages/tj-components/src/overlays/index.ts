/**
 * ТЖ overlay helper — the AD-12 v5 minimal surface (CONVENTIONS §9, the
 * `[OPEN — 16.5 burger drawer]` ruling RESOLVED here): mount + focus trap +
 * scroll lock for the family's one overlay-class surface, the rail's burger
 * drawer.
 *
 * A framework-agnostic MODULE, not a custom element: no `tj-` tag, no
 * shadow root, no component exports. It is a DELIBERATE, DOCUMENTED
 * DUPLICATION of the bank overlay controller's contract
 * (packages/components/src/overlays/ — FR-17: importing `pillkit-components`
 * would be a forbidden tj→bank edge; the REVISIT trigger — a second ТЖ
 * overlay surface → extract a shared `pillkit-overlays` peer — stays).
 *
 * THE FROZEN SURFACE (spec 16.5; deviations are §9 exception-log entries):
 *
 * | Capability | File | Bank pointer |
 * |---|---|---|
 * | `mountSheet` — sheet+scrim mounting, Popover API top layer with a body-append `position: fixed` fallback at `var(--tj-z-drawer)` | mount-sheet.ts | controller.ts (mountOverlay) |
 * | `lockScroll` — refcounted body scroll-lock with scrollbar padding compensation | scroll-lock.ts | scroll-lock.ts (lockBodyScroll) |
 * | `trapFocus` — shadow-aware composed Tab cycle + LIFO restore | focus-trap.ts | focus-trap.ts |
 *
 * DELIBERATE OMISSIONS (fidelity, not laziness — each names the bank pointer
 * for the future REVISIT; the bank capability exists for surfaces the ТЖ
 * roster does not have):
 * - NO floating positioning engine (anchored floats' flip/clamp/track —
 *   bank positioning.ts): the ТЖ sheet is full-height at the viewport edge,
 *   no anchor math exists to own.
 * - NO toast queue / enqueue (cross-instance stacking, max-visible collapse
 *   — bank toast-queue.ts): no transient notification surface in the roster.
 * - NO layer vocabulary beyond the drawer token (bank controller.ts's
 *   five-layer `LAYER_Z_TOKEN` map): the ТЖ z scale is two tokens
 *   (`--tj-z-nav` 100 / `--tj-z-drawer` 300, 200 spare).
 *
 * Guard interactions (the bank module's notes, ТЖ-scoped):
 * - The consumed-tokens guard derives `--tj-<component>-*` hook prefixes
 *   from `src/*` directories — `overlays` joining that set is harmless (no
 *   `--tj-overlays-*` hooks are declared; the module's only token
 *   consumption is the z scale and the scrim veil's ink token).
 * - cem globs exclude `src/overlays/**` — the manifest is the ELEMENT api
 *   (wrapper input); the named re-exports in `../index.ts` do appear in its
 *   `src/index.ts` export list — any export change goes through `pnpm gen` +
 *   commit.
 */

export {
  mountSheet,
  TJ_SHEET_SCRIM_CLASS,
  type TjSheetHandle,
  type TjSheetMountStrategy,
  type TjSheetOptions,
} from './mount-sheet.js';
export { lockScroll, type TjScrollLockHandle } from './scroll-lock.js';
export {
  trapFocus,
  type TjFocusTrapHandle,
  type TjFocusTrapOptions,
  type TjInitialFocusTarget,
} from './focus-trap.js';
