import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import {
  lockScroll,
  mountSheet,
  trapFocus,
  type TjFocusTrapHandle,
  type TjScrollLockHandle,
  type TjSheetHandle,
} from '../overlays/index.js';
import { railStyles } from './tj-rail.css.js';

/**
 * The `open-change` occurrence (§9 grammar, the TjOpenComposeEvent class
 * mold): the drawer's open state flipped — burger, Esc, scrim, a drawer link,
 * or a programmatic `open` write; the element itself never narrates WHY.
 * `detail: { value: boolean }` is the CONVENTIONS §9 overlay row verbatim —
 * the React unwrap contract hands handlers the bare boolean.
 */
export class TjOpenChangeEvent extends CustomEvent<{ value: boolean }> {
  static readonly eventName = 'open-change' as const;

  constructor(value: boolean) {
    super(TjOpenChangeEvent.eventName, {
      detail: { value },
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * One rail row of the `items` prop — navigation data, not a form channel
 * (the bank TkNavbarLink mold; `value` is OPTIONAL here: rows may be plain
 * links, and only value-bearing rows are addressable by `current-value` and
 * carry an `icon-{value}` slot).
 */
export interface TjRailItem {
  /** Visible row text (also the anchor's accessible name). */
  label: string;
  /** Navigation target — native anchor navigation, the kit never intercepts it. */
  href: string;
  /** Optional stable section key: what `current-value` addresses and what the `icon-{value}` slot names. */
  value?: string;
}

/** Default accessible name — the burger button AND the sheet dialog (the bank burger-label mold). */
const DEFAULT_BURGER_LABEL = 'Разделы';

/** The rail nav landmark's accessible name (distinguishes it from the header's «Навигация»). */
const DEFAULT_RAIL_LABEL = 'Разделы';

/**
 * tj-rail — the ТЖ left section rail (Story 16.5): a w290 sidebar of
 * section rows (`nav > ul > li > a`), each optionally fronted by a decorative
 * 40×40 icon tile carrying the per-item `icon-{value}` slot, plus a burger
 * (below 1200px) opening a focus-trapped full-height sheet.
 *
 * NAVIGATION, NOT A FORM CONTROL (the header ruling verbatim):
 * `current-value` is a PROP ONLY — a plain input the consumer sets from its
 * router; no §4 pair, no event (unit-pinned). A value matching nothing (or a
 * value-less row) marks NOTHING. Current marking is SEMANTIC-ONLY:
 * `aria-current="page"` with ZERO visual delta — the reference census
 * (probe9 navItem ×11/11) renders every row in the SAME nav-label species
 * (17/700), and the 2026-09-28 reference capture shows NO visual distinction
 * on any row — no weight delta, no pill, no color shift. Unprobed marking is
 * not invented (the 16.5 patch-round ruling, vision-evidenced).
 *
 * THE ICON TILES: a tile renders ONLY while its `icon-{value}` slot carries
 * an ELEMENT node (an empty tile would leave a 40px hole — label-only rows
 * are the designed default). The tile wrapper is `aria-hidden` — the icon is
 * decorative; the row's accessible name is the label alone.
 *
 * THE BURGER + SHEET (AD-12 — the overlay helper owns every mechanic; this
 * file holds ZERO bespoke z/scroll/trap code, structurally pinned):
 * - `open` is a REFLECTED boolean property + `open-change`
 *   (`detail: { value: boolean }`) — the CONVENTIONS §9 overlay row; every
 *   source (burger, Esc, scrim, drawer link, programmatic write) emits from
 *   the single `updated()` dispatch site.
 * - PROGRAMMATIC OPEN WORKS AT ANY VIEWPORT: the sheet mechanics are not
 *   gated on the burger's media query — the burger is merely INVISIBLE at
 *   ≥1200px (the spec's explicit ruling).
 * - the sheet is a shadow-tree child (the bank 2.3 ratified pattern — the
 *   burger's aria-controls id resolves within one tree) mounted through
 *   `mountSheet` (scrim + popover/fixed ladder at `--tj-z-drawer`),
 *   scroll-locked via `lockScroll`, Tab-cycled + restored via `trapFocus`.
 * - Esc closes; a scrim click closes; a drawer link click closes (native
 *   navigation is the anchor's own); close re-focuses the burger (the trap's
 *   LIFO restore is the belt, the explicit focus the spec's demand) and
 *   re-homes the sheet node (the fixed fallback path detaches it on release).
 * - the drawer re-renders the SAME items as label-only rows (the icon tiles
 *   are the desktop rail's signature; the sheet is the reference's plain
 *   list — FLAGGED for the side-by-side).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; nothing imperative at
 * construction; teardown on disconnect is quiet (no focus churn).
 *
 * @tag tj-rail
 * @prop {TjRailItem[]} [items] - Rail rows ({ label, href, value? }); rows with duplicate NON-EMPTY values clamp out with a dev warn.
 * @attr {string} [current-value] - The current row's `value` (exact match) — semantic-only marking (aria-current, zero visual delta — the reference marks nothing visually); prop-only, never reflected, no event.
 * @attr {boolean} [open] - The drawer's open state — reflected; a STAMPED open attribute mounts the sheet from first paint (no dispatch — initialization is not a transition); programmatic open works at ANY viewport (the burger is merely hidden ≥1200px).
 * @attr {string} [burger-label] - Accessible name of the burger button (also names the sheet dialog). Default «Разделы»; empty or a null write (attribute removal) falls back to the default.
 * @slot icon-{value} - Per-item decorative icon, slotted into the row's 40×40 aria-hidden tile (value-less rows have no tile).
 * @fires open-change - The drawer opened/closed; `detail.value` = the boolean state.
 */
export class TjRail extends LitElement {
  static override readonly styles = [railStyles];

  /** Rail rows — property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  items: TjRailItem[] = [];

  /**
   * The current row's value — NOT a channel (the header active-value ruling
   * verbatim): a plain input prop; the element dispatches nothing. Accepted
   * from the `current-value` attribute, never reflected (value data, §2).
   * Lit maps attribute REMOVAL to a null property write — reads are
   * null-guarded.
   */
  @property({ type: String, attribute: 'current-value' })
  currentValue?: string | null;

  /**
   * The drawer's open state — a PUBLIC channel (the CONVENTIONS §9 overlay
   * row): reflected (boolean, §2), source of truth for the mount/unmount
   * choreography, announced via `open-change` from `updated()`.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Accessible name of the burger button (also the sheet dialog's label). An
   * EMPTY/whitespace value falls back to the default — an empty string would
   * strip the control's accessible name entirely (the bank 8.1 a11y ruling).
   * Lit maps attribute REMOVAL to a null property write (String type, no
   * default in the config) — reads null-guard (the ctaLabel pitfall, pinned).
   */
  @property({ type: String, attribute: 'burger-label' })
  burgerLabel: string | null = DEFAULT_BURGER_LABEL;

  /** Values whose icon-{value} slot carries an ELEMENT node (drives the tile). */
  #iconSlotted = new Set<string>();

  #sheetHandle: TjSheetHandle | null = null;
  #lockHandle: TjScrollLockHandle | null = null;
  #trapHandle: TjFocusTrapHandle | null = null;

  /** The sheet node reference — survives the helper's reparent/detach cycles. */
  #sheetEl: HTMLElement | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tj-rail-${++TjRail.#nextId}`;
    return this.#uniqueId;
  }

  /**
   * Duplicate NON-EMPTY value clamp (the tk-navbar clamp, adapted to the
   * optional-value shape): a value `current-value` could address twice is
   * ambiguous — duplicates drop with a dev warn (first occurrence wins).
   * Value-less rows are LEGAL (plain links, never current, no tile) and an
   * EMPTY-STRING value normalizes to value-less. Length-guarded so the
   * follow-up update converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has('items')) return;
    const raw = this.items ?? [];
    const seen = new Set<string>();
    let changedList = false;
    const kept = raw.map((item) => {
      const value = item?.value;
      if (value === '') {
        changedList = true;
        return { ...item, value: undefined }; // '' normalizes to value-less (no consumer-object mutation)
      }
      return item;
    });
    const deduped = kept.filter((item) => {
      const value = item?.value;
      if (value == null) return true;
      if (seen.has(value)) {
        changedList = true;
        return false;
      }
      seen.add(value);
      return true;
    });
    if (this.items != null && changedList) {
      console.warn(
        'tj-rail: duplicate item values dropped (first occurrence wins) and empty-string values normalized away — current-value addresses rows by a unique non-empty value',
      );
      this.items = deduped;
    }
  }

  /**
   * THE single choreography site: every open source (burger, Esc, scrim,
   * drawer link, programmatic write, a STAMPED open attribute) lands on the
   * `open` property, so `updated()` mounts/unmounts for all of them.
   *
   * First-update guard — DISPATCH ONLY (the bank select.ts mold verbatim):
   * Lit marks EVERY property as changed on the initial update with old value
   * `undefined` (reactive-element `_$changeProperty`: `if (!hasUpdated) oldValue
   * = undefined` — stamped attributes included); that is initialization, not a
   * transition, so `open-change` never fires for it. The MOUNT is NOT guarded:
   * a consumer stamping <tj-rail open> owes the sheet from the first paint —
   * guarding both left a reflected open + aria-expanded with no scrim, lock,
   * trap, or z (lens 16.5, Lit-source-pinned). The unmount IS guarded
   * (initialization to closed must not focus-steal the burger).
   */
  /**
   * The dispatch hop (a private FIELD, the #handleThemeActivate shape): the
   * CEM analyzer infers events from dispatchEvent calls inside class METHODS
   * and cannot name a CustomEvent subclass there — the inferred entry rides
   * the manifest NAMELESS next to the @fires row. A field initializer is not
   * walked; the @fires jsdoc stays the manifest's only source (lens 16.5).
   */
  readonly #emitOpenChange = (wasOpen: boolean | undefined): void => {
    if (wasOpen !== undefined && wasOpen !== this.open) {
      this.dispatchEvent(new TjOpenChangeEvent(this.open));
    }
  };

  protected override updated(changed: PropertyValues<this>): void {
    this.#syncIconSlots();
    if (!changed.has('open')) return;
    const wasOpen = changed.get('open'); // undefined = first-update initialization
    this.#emitOpenChange(wasOpen);
    if (this.open) {
      void this.#mountSheet().catch((error: unknown) => {
        // Belt behind the pre-mount guard: the helper fails LOUD by design —
        // surface it, then force a clean closed state so nothing leaks.
        console.warn('tj-rail: sheet open failed — closing cleanly', error);
        this.open = false;
      });
    } else if (wasOpen !== undefined) {
      this.#unmountSheet();
    }
  }

  override disconnectedCallback(): void {
    // Quiet teardown: release helper resources without focus churn (the
    // element is leaving the tree; focus ops on detached nodes are no-ops).
    if (this.open) this.#unmountSheet();
    super.disconnectedCallback();
  }

  // --- icon slot presence -----------------------------------------------------

  #handleIconSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this.#trackSlot(slot);
  }

  /** Adds/removes the slot's value from #iconSlotted (change-guarded). */
  #trackSlot(slot: HTMLSlotElement): void {
    const value = slot.name.slice('icon-'.length);
    const has = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (has === this.#iconSlotted.has(value)) return;
    if (has) this.#iconSlotted.add(value);
    else this.#iconSlotted.delete(value);
    this.requestUpdate();
  }

  // Initial-mount backstop (the tj-composer/tj-header mold): the slotchange
  // EVENT is queued inconsistently for the FIRST assignment — every render
  // re-syncs the tracked presence from the live slot assignments.
  #syncIconSlots(): void {
    for (const slot of Array.from(
      this.renderRoot.querySelectorAll<HTMLSlotElement>("slot[name^='icon-']"),
    )) {
      this.#trackSlot(slot);
    }
  }

  // --- sheet (helper-owned mechanics, AD-12) -----------------------------------

  /**
   * The sheet panel — by shadow-tree class, else the captured node
   * reference: the helper's fixed fallback REPARENTS the panel to <body>
   * while open and DETACHES it on release, so tree lookups alone lose it
   * exactly when it needs closing or re-homing.
   */
  #sheet(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.sheet') ?? this.#sheetEl;
  }

  #burger(): HTMLButtonElement | null {
    return this.renderRoot.querySelector<HTMLButtonElement>('.burger');
  }

  async #mountSheet(): Promise<void> {
    await this.updateComplete;
    // The await is an open window: a second toggle may have CLOSED the sheet,
    // the element may have disconnected, or a previous open's handles may
    // still hold the panel — mounting now would race the close (leaking
    // lock/trap behind a "closed" state) or double-mount. The close/disconnect
    // paths reset their flags SYNCHRONOUSLY, so re-validating here is the
    // guard; mountSheet's own one-mount-one-release rule stays the belt.
    if (!this.open || !this.isConnected || this.#sheetHandle) return;
    const sheet = this.#sheet();
    if (!sheet) {
      this.open = false;
      return;
    }
    this.#sheetEl = sheet; // survives the helper's reparent/detach
    sheet.hidden = false; // belt: the template binding already flipped it
    // Helper-only mechanics (structurally pinned by the unit suite): mounting
    // (scrim + popover/fixed ladder, the drawer z token), refcounted
    // scroll-lock, and the Tab cycle + restore trap.
    this.#sheetHandle = mountSheet(sheet, {
      onScrimClick: () => {
        this.open = false;
      },
    });
    this.#lockHandle = lockScroll();
    this.#trapHandle = trapFocus(sheet);
  }

  #unmountSheet(): void {
    // The trap releases first (it restores the PRE-trap focus); the burger is
    // then focused explicitly — the restore demand holds even when the sheet
    // was opened from a non-focused click or programmatically.
    this.#trapHandle?.release();
    this.#trapHandle = null;
    this.#lockHandle?.release();
    this.#lockHandle = null;
    this.#sheetHandle?.release();
    this.#sheetHandle = null;
    const sheet = this.#sheet();
    if (sheet) {
      // The fixed fallback DETACHES the sheet on release (the helper owns its
      // DOM while mounted) — re-home it into the shadow root so the next open
      // and the burger's aria-controls stay valid.
      if (!sheet.isConnected) this.renderRoot.appendChild(sheet);
      sheet.hidden = true;
    }
    this.#burger()?.focus();
  }

  /**
   * Esc closes (the spec's matrix row). The Tab cycle lives in the helper's
   * trap — this handler never touches Tab.
   */
  #handleSheetKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.open = false;
  }

  /** A clicked drawer link closes the sheet; navigation itself is the anchor's own. */
  #handleSheetClick(event: Event): void {
    if (!this.open) return;
    const target = event.target as Element | null;
    if (target && typeof target.closest === 'function' && target.closest('a')) {
      this.open = false;
    }
  }

  // --- render -------------------------------------------------------------------

  /** One row link — shared by the rail list and the sheet list (same data, same current marking). */
  #renderRow(item: TjRailItem, currentValue: string | null | undefined, withTile: boolean) {
    const isCurrent = item.value != null && item.value === currentValue;
    const tile =
      withTile && item.value != null
        ? html`<span class="tile${this.#iconSlotted.has(item.value) ? '' : ' tile--empty'}" aria-hidden="true"
            ><slot name="icon-${item.value}" @slotchange=${this.#handleIconSlotchange}></slot
          ></span>`
        : nothing;
    return html`
      <a class="row" href=${item.href} aria-current=${isCurrent ? 'page' : nothing}
        >${tile}<span class="row__label">${item.label}</span></a
      >
    `;
  }

  override render() {
    const items = this.items ?? [];
    const currentValue = this.currentValue;
    const burgerLabel = (this.burgerLabel ?? '').trim() || DEFAULT_BURGER_LABEL;
    return html`
      <nav class="rail" aria-label="${DEFAULT_RAIL_LABEL}">
        <ul class="rail__list">
          ${items.map(
            (item) => html`<li class="rail__item">${this.#renderRow(item, currentValue, true)}</li>`,
          )}
        </ul>
        <button
          type="button"
          class="burger"
          aria-label=${burgerLabel}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="${this.#id}-sheet"
          @click=${() => {
            this.open = !this.open;
          }}
        >
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M4 7h16"></path>
            <path d="M4 12h16"></path>
            <path d="M4 17h16"></path>
          </svg>
        </button>
      </nav>
      <div
        class="sheet"
        id="${this.#id}-sheet"
        role="dialog"
        aria-modal="true"
        aria-label=${burgerLabel}
        ?hidden=${!this.open}
        @keydown=${this.#handleSheetKeydown}
        @click=${this.#handleSheetClick}
      >
        <ul class="sheet__list">
          ${items.map(
            (item) =>
              html`<li class="sheet__item">${this.#renderRow(item, currentValue, false)}</li>`,
          )}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-rail': TjRail;
  }
}

if (!customElements.get('tj-rail')) {
  customElements.define('tj-rail', TjRail);
}
