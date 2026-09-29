/**
 * Sheet mounting — the ТЖ instance of the AD-12 "single owner of mounting
 * and z-order" ruling (CONVENTIONS §9, resolved at 16.5).
 *
 * A DELIBERATE, DOCUMENTED DUPLICATION of the bank overlay controller's
 * mounting contract (packages/components/src/overlays/controller.ts — frozen
 * shape), translated to this family's single overlay surface: importing
 * `pillkit-components` would be a forbidden tj→bank edge (FR-17). The
 * REVISIT trigger stays: a second ТЖ overlay surface → extract a shared
 * `pillkit-overlays` peer consumed by both families.
 *
 * The ТЖ roster's only overlay-class surface is a FULL-HEIGHT SIDE SHEET
 * (the rail's burger drawer) — the surface pair is the sheet + its scrim:
 *
 * | Mechanism | Where it runs | Notes |
 * |-----------|---------------|-------|
 * | Popover API (`popover="manual"` + `showPopover()`) | Chromium 114+, Firefox 125+, Safari 17+ | Primary. Promotes the sheet into the top layer IN PLACE — no DOM move, so the shadow stylesheet and slot assignment keep applying. `manual` so light-dismiss never races the component's own `open`/`open-change` semantics (the bank ladder verbatim). |
 * | `document.body` append + `position: fixed` | everywhere else | Fallback. The sheet is appended to `<body>` with the drawer z token — escaping any ancestor stacking/clipping context. ACCEPTED LIMITATION (the bank drawer's own): the shadow stylesheet no longer applies to a reparented sheet, so this path carries MECHANICS only (fixed + z); engines old enough to lack `showPopover` are outside the reference matrix. |
 *
 * The SCRIM is helper-owned on both paths: a plain fixed `<div>` appended to
 * `document.body` at the drawer z token, ink at the flagged 12% alpha
 * (color-mix over the ink token — the skeleton-alpha precedent; a themed
 * value, so it consumes the `--tj-*` cascade, which reaches body-level
 * elements through the token sheet's `:root` leg). In the popover path the
 * top layer paints the sheet above everything — the scrim needs no promotion.
 *
 * OMISSIONS (each deliberate, each naming the bank pointer for the REVISIT):
 * - NO layer vocabulary / `--tk-z-*`-style five-layer scale — the ТЖ scale is
 *   two tokens (`--tj-z-nav` 100, `--tj-z-drawer` 300; 200 spare), and this
 *   helper mounts exactly one surface kind. Bank pointer: controller.ts
 *   `LAYER_Z_TOKEN`.
 * - NO shared overlay container — one surface at a time means the body append
 *   IS the fallback container. Bank pointer: controller.ts `ensureContainer`.
 * - NO positioning engine (`positionFloating`/`computeFloatingPosition`) —
 *   the sheet is full-height at the viewport's left edge; there is no anchor
 *   math to own. Bank pointer: positioning.ts (anchored floats' clamp/flip).
 * - NO toast queue / enqueue — no transient notification surface in the ТЖ
 *   roster. Bank pointer: toast-queue.ts.
 *
 * Behavioral lessons carried verbatim from the bank controller:
 * - popover-UA inset/margin resets (the bank 3.10/4.x find): UA `[popover]`
 *   styles promote a box to `inset: 0; margin: auto; border: solid` — the
 *   sheet's OWN stylesheet resets `inset`/`margin`/`border` (author origin
 *   beats UA regardless of specificity); this module snapshots and restores
 *   the `popover` attribute itself.
 * - post-await revalidation (the bank 3.4 async-open race guard) lives at the
 *   COMPONENT open flow (tj-rail re-validates `open`/connect state after its
 *   `updateComplete` await, exactly like tk-navbar's `#openDrawer`) — the
 *   helper's loud remount contract below is the belt behind it.
 *
 * Loud failure (module style): remounting a sheet that is already mounted
 * returns the live handle (one mount, one release); SSR / pre-body edge
 * cases return an inert handle that touches nothing.
 */

/** Which mounting mechanism actually placed the sheet. */
export type TjSheetMountStrategy = 'popover' | 'fixed';

/** Opaque release handle — idempotent `release`. */
export interface TjSheetHandle {
  readonly sheet: HTMLElement;
  readonly scrim: HTMLElement;
  readonly strategy: TjSheetMountStrategy;
  /** Unmounts: unpromotes / detaches the sheet, removes the scrim, restores prior inline styles. Idempotent. */
  release(): void;
}

export interface TjSheetOptions {
  /**
   * Called when the scrim is clicked — the drawer's close-on-scrim contract.
   * The helper owns the scrim, so it owns this wiring too.
   */
  onScrimClick?: () => void;
}

/** Marker class on the helper-owned scrim (tests/diagnostics; never styled by consumers). */
export const TJ_SHEET_SCRIM_CLASS = 'tj-sheet-scrim';

/**
 * The drawer layer's z token — every z value in this module flows through
 * this string, a `var(--tj-z-*)` consumption validated by the
 * consumed-tokens guard (declared in packages/tj-tokens/src/tokens.css).
 */
const SHEET_Z_TOKEN = 'var(--tj-z-drawer)';

/** Sheets currently mounted — remounting returns the live handle. */
const activeSheets = new Map<HTMLElement, TjSheetHandle>();

/** The scrim's fixed mechanics + the themed 12% ink veil, all inline (the element lives at body level, outside every shadow root). */
function styleScrim(scrim: HTMLDivElement): void {
  scrim.className = TJ_SHEET_SCRIM_CLASS;
  scrim.setAttribute('aria-hidden', 'true');
  scrim.style.position = 'fixed';
  scrim.style.inset = '0';
  scrim.style.margin = '0';
  scrim.style.border = 'none';
  scrim.style.zIndex = SHEET_Z_TOKEN;
  // FLAG (spec 16.5): scrim = ink at 12% alpha — the skeleton-alpha
  // precedent; no scrim token exists, so the veil composes at use over the
  // ink token (dark re-resolves through the token layer, zero branches).
  scrim.style.background = 'color-mix(in srgb, var(--tj-color-ink-100) 12%, transparent)';
}

/**
 * Mounts `sheet` as the drawer overlay surface together with a helper-owned
 * scrim.
 *
 * The sheet must be connected when popover mounting is expected (an
 * unconnected element makes `showPopover` throw — the call falls back to the
 * body-append path). Prior inline `z-index`/`position` (fixed path) and the
 * `popover` attribute (popover path) are snapshotted and restored on
 * release. The scrim is removed from `<body>` on release.
 */
export function mountSheet(sheet: HTMLElement, options: TjSheetOptions = {}): TjSheetHandle {
  if (typeof document === 'undefined' || !document.body) {
    // True SSR (no document at all): nothing exists to CREATE a scrim with —
    // a plain object stands in for the handle shape (never queried; release
    // touches nothing). The member access below must not run: an undeclared
    // `document` throws ReferenceError on EVALUATION (the ?. guards the CALL,
    // not the base access — found rewriting the vacuous SSR test, lens 16.5).
    const detachedScrim: HTMLElement =
      typeof document === 'undefined' ? ({} as HTMLElement) : document.createElement('div');
    return { sheet, scrim: detachedScrim, strategy: 'fixed', release: () => undefined };
  }

  const existing = activeSheets.get(sheet);
  if (existing) return existing;

  // The scrim lands on <body> FIRST: on the fixed path the sheet is appended
  // after it (equal z token, later DOM order paints above), and on the
  // popover path the top layer paints the sheet above everything regardless.
  const scrim = document.createElement('div');
  styleScrim(scrim);
  const onScrimClick = options.onScrimClick;
  if (onScrimClick) {
    scrim.addEventListener('click', () => onScrimClick());
  }
  document.body.appendChild(scrim);

  const priorZIndex = sheet.style.zIndex;
  const priorPosition = sheet.style.position;
  const priorPopoverAttribute = sheet.getAttribute('popover');

  let strategy: TjSheetMountStrategy = 'fixed';

  if (typeof sheet.showPopover === 'function') {
    sheet.setAttribute('popover', 'manual');
    try {
      sheet.showPopover();
      strategy = 'popover';
    } catch {
      // Unconnected or otherwise unshowable (consumer race): undo and fall
      // through to the body-append path below (the bank ladder verbatim).
      if (priorPopoverAttribute === null) sheet.removeAttribute('popover');
      else sheet.setAttribute('popover', priorPopoverAttribute);
    }
  }

  // The z token is applied on BOTH paths (snapshot-restored on release);
  // inside the top layer z-index is inert — paint order there is promotion
  // order — but the token keeps the fallback path and any consumer CSS on
  // one vocabulary (the bank controller's note verbatim).
  sheet.style.zIndex = SHEET_Z_TOKEN;
  let reparented = false;
  if (strategy === 'fixed') {
    sheet.style.position = 'fixed';
    reparented = true;
    document.body.appendChild(sheet);
  }

  let released = false;
  const handle: TjSheetHandle = {
    sheet,
    scrim,
    strategy,
    release: (): void => {
      if (released) return;
      released = true;
      activeSheets.delete(sheet);
      if (strategy === 'popover') {
        try {
          if (sheet.matches(':popover-open')) sheet.hidePopover();
        } catch {
          // The consumer already hid/removed the surface — nothing to demote.
        }
        if (priorPopoverAttribute === null) sheet.removeAttribute('popover');
        else sheet.setAttribute('popover', priorPopoverAttribute);
      }
      if (reparented && sheet.parentElement === document.body) document.body.removeChild(sheet);
      sheet.style.zIndex = priorZIndex;
      if (reparented) sheet.style.position = priorPosition;
      scrim.remove();
    },
  };

  activeSheets.set(sheet, handle);
  return handle;
}
