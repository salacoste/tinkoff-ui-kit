import { LitElement, html, nothing, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay, positionFloating } from '../overlays/index.js';
import type { TkOverlayHandle, TkPositioningHandle } from '../overlays/index.js';
import { filterChipsMenuStyles, filterChipsStyles } from './filter-chips.css.js';

/**
 * One item of the `items` prop — the 2.3 options mold (slotted alternatives
 * are NOT in v2; consumers compose around the element).
 */
export interface TkFilterChipsItem {
  /** Stable item value (what `value` / `value-change` carry). */
  value: string;
  /** Visible chip text (also the chip's accessible name). */
  label: string;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkFilterChipsChangeDetail {
  value: string;
}

/** Typed shape of the tk-filter-chips `value-change` event (CONVENTIONS §7). */
export type TkFilterChipsChangeEvent = CustomEvent<TkFilterChipsChangeDetail>;

/**
 * The visible window before the «Ещё» overflow chip appears — the reference's
 * own split (7 visible chips on the stocks catalog, NOTES.md §D).
 */
export const TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT = 7;

/**
 * Last-resort accessible name when `label` is absent (the tk-select/tk-
 * segmented-radio precedent): an unnamed tablist fails the axe name gate, so
 * «Фильтры» stands in rather than shipping an unnamed group.
 */
const DEFAULT_ACCESSIBLE_NAME = 'Фильтры';

/** The overflow chip's fixed RU label (spec 6.2: «Ещё» — not a prop in v2). */
const MORE_LABEL = 'Ещё';

/** The overflow menu's accessible name (a menu must be named for axe). */
const MORE_MENU_NAME = 'Ещё';

/** Vertical gap between the «Ещё» chip and its menu panel (px — the select literal's sibling). */
const MENU_OFFSET_PX = 4;

/**
 * tk-filter-chips — single-select pill filter row + «Ещё» overflow dropdown
 * (Story 6.2), the invest/stocks catalog's chip row.
 *
 * ANATOMY (vision-extracted from pattern-catalog-filters.png): pills
 * radius-full, body-m text, surface-base fill, one NON-wrapping row (the row
 * scrolls horizontally); UNSELECTED = 1px border-default hairline +
 * text-primary; SELECTED = 2px yellow-100 border with the fill and text
 * UNCHANGED — selection is the border alone (the frozen spec's ruling; the
 * capture's own yellow-on-white text would fail AA at 1.16:1, so text stays
 * text-primary — the vision pass's own contrast note).
 *
 * SEMANTICS: container role=tablist (the reference's own role — the contract
 * it implies), chips role=tab + aria-selected, SINGLE-select by construction
 * (selecting one deactivates the prior — observed). Each chip is a TAB STOP:
 * the reference exposes 7 observed stops, a deliberate, documented deviation
 * from APG roving-tabindex recorded in the story a11y notes. ArrowLeft/Right
 * cycle FOCUS within the tablist WITHOUT selecting (manual activation — the
 * reference's Space-toggles model); Space/Enter select; and FOCUS IS
 * PRESERVED on the toggled chip after the value change — the reference's
 * focus-drops-to-body defect is the sanctioned improvement. Re-selecting the
 * active chip KEEPS it active (ruling: no deselect-to-none; the value is
 * always one of the items — the reference checkbox toggle-off is not
 * single-select-coherent).
 *
 * «Ещё» OVERFLOW: a chip-styled BUTTON after the visible window (1px
 * hairline, chevron-down, aria-haspopup/aria-expanded) opening a menu of the
 * remaining items as menuitemradio options. The panel is a generated child
 * of this element's shadow root carrying its OWN shadow root (the select
 * 2.3 mold — single-tree aria idrefs; the controller's popover path promotes
 * it in place, the fallback path legally reparents it across the tree
 * boundary and back). Mounting is EXCLUSIVELY mountOverlay(panel,
 * 'dropdown') + positionFloating (anchor = the «Ещё» chip, anchor-min-width
 * — the Select mold): zero bespoke positioning/z code. While an
 * overflow-resident item is active, the «Ещё» chip itself carries the
 * selected border (the border-only selected language — visible-indicator
 * ruling). Selecting a menu item changes value through the SAME channel as a
 * chip press and closes the menu with focus returned to «Ещё». The menu's
 * open state is INTERNAL UI STATE (the tk-navbar drawer precedent): the
 * value channel is the consumer surface, nothing dispatches open-change.
 *
 * STATEFUL API — the §4 contract frozen at 2.1, inherited verbatim with a
 * string channel (tk-select's exact mirror): `value` strict-controlled
 * (renders exactly `value`; selecting emits `value-change` and applies
 * nothing locally), `defaultValue` seeds uncontrolled (later changes
 * ignored), releasing `value` goes uncontrolled seeded from the last
 * controlled value. An unmatched value (not in items) clamps to the FIRST
 * item per §2 — the channel itself is corrected, never a crash (CONVENTIONS
 * §2 degrade-to-default).
 *
 * @tag tk-filter-chips
 * @attr {string} label - Accessible name of the chip group (no visual label — the capture shows none).
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {number} visible-count - How many chips render before the «Ещё» overflow chip (default 7).
 * @fires value-change - `{ value }` with the unwrapped newly selected item value; composed, bubbles.
 */
export class TkFilterChips extends LitElement {
  static override readonly styles = [filterChipsStyles];

  /**
   * Accessible name of the tablist group. Purely an aria-label — the capture
   * shows NO inline visual label above the chip row.
   */
  @property({ type: String })
  label?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, string
   * mirror of tk-select): the element renders exactly this (the matching
   * chip carries the selected border); selecting emits `value-change` and
   * applies nothing locally. Property-only (`attribute: false`); non-strings
   * set via JS clamp to their string form; a value not among the item values
   * clamps to the first item (§2 — the channel is corrected); null/undefined
   * after control RELEASES to uncontrolled seeded from the last controlled
   * value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v2 data shape — array of { value, label }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  items: TkFilterChipsItem[] = [];

  /**
   * How many chips render before the «Ещё» overflow chip. Invalid runtime
   * values (non-finite, < 1) clamp to the 7 default (§2 — never throws).
   */
  @property({ type: Number, attribute: 'visible-count' })
  visibleCount = TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT;

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** The «Ещё» menu open state — INTERNAL UI (the navbar-drawer precedent; no open-change). */
  #menuOpen = false;

  /** The generated menu panel — a child of the shadow renderRoot (see the class doc), hidden when closed. */
  #panel: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;

  /** Document-level outside-press listener (bound once, added/removed with the menu). */
  #onDocumentPointerDown = (event: Event): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.contains(target) || this.#panel?.contains(target)) return;
    this.#closeMenu({ returnFocus: true });
  };

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-filter-chips-${++TkFilterChips.#nextId}`;
    return this.#uniqueId;
  }

  /** Items with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveItems(): TkFilterChipsItem[] {
    return this.items ?? [];
  }

  /** Visible-count in force: invalid runtime values degrade to the default (§2). */
  get #effectiveVisibleCount(): number {
    return Number.isFinite(this.visibleCount) && this.visibleCount >= 1
      ? Math.floor(this.visibleCount)
      : TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT;
  }

  /** The items shown as chips (the window before «Ещё»). */
  get #visibleItems(): TkFilterChipsItem[] {
    return this.#effectiveItems.slice(0, this.#effectiveVisibleCount);
  }

  /** The items reachable only through the «Ещё» menu. */
  get #overflowItems(): TkFilterChipsItem[] {
    return this.#effectiveItems.slice(this.#effectiveVisibleCount);
  }

  /**
   * The value in force, CLAMPED to a real item: exactly `value` when
   * controlled, the internal state otherwise — and whenever the raw value is
   * empty/unmatched, the FIRST item (the always-one-selected ruling: value
   * is always one of the items). Empty items → '' (nothing selectable).
   */
  get #effectiveValue(): string {
    const items = this.#effectiveItems;
    const raw = this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
    return items.some((item) => item.value === raw) ? raw : (items[0]?.value ?? '');
  }

  /**
   * The frozen §4 state transitions (tk-select's verbatim string mirror) +
   * the §2 clamps: an unmatched controlled value corrects to the first item
   * (the channel itself — visible in the DOM through the rendered
   * selection), `visibleCount` degrades to its default, and duplicate item
   * VALUES drop with a dev warn (the 2.3 options clamp; the reassignment is
   * length-guarded so the follow-up update converges).
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && !this.hasUpdated) {
      this.#uncontrolledValue = this.defaultValue ?? '';
    }
    if (changed.has('value')) {
      if (this.value != null && typeof this.value !== 'string') {
        this.value = String(this.value);
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (typeof this.value === 'string') {
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledValue = this.#lastControlledValue ?? '';
      }
    }
    if (changed.has('visibleCount')) {
      const count = this.visibleCount;
      if (!Number.isFinite(count) || count < 1) {
        this.visibleCount = TK_FILTER_CHIPS_DEFAULT_VISIBLE_COUNT;
      }
    }
    if (changed.has('items')) {
      const seen = new Set<string>();
      const deduped = (this.items ?? []).filter((item) => {
        const value = item?.value;
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.items != null && deduped.length !== this.items.length) {
        console.warn(
          'tk-filter-chips: duplicate or value-less item entries dropped — item values must be unique non-empty strings (first occurrence wins)',
        );
        this.items = deduped;
      }
    }
    // The unmatched-value clamp runs on BOTH channels that can invalidate it
    // (a value arriving unmatched, or the item set changing under a matched
    // value). Uncontrolled state needs no correction here — #effectiveValue
    // derives the clamped selection at read time.
    if ((changed.has('value') || changed.has('items')) && this.#isControlled && this.items != null) {
      const raw = this.value ?? '';
      if (this.items.length > 0 && !this.items.some((item) => item.value === raw)) {
        this.value = this.items[0]!.value;
        this.#lastControlledValue = this.value;
      }
    }
  }

  override firstUpdated(): void {
    // Eager panel creation: the «Ещё» chip's aria-controls always references
    // a real node (axe validates the id even while the panel is hidden).
    if (this.#overflowItems.length > 0) this.#getPanel();
  }

  override updated(changed: PropertyValues<this>): void {
    const dataChanged =
      changed.has('items') ||
      changed.has('visibleCount') ||
      changed.has('value') ||
      changed.has('defaultValue');
    if (!dataChanged) return;
    // The overflow window can close under data changes: no residents left →
    // the open menu (if any) goes away; nothing to keep warm.
    if (this.#overflowItems.length === 0) {
      if (this.#menuOpen) this.#closeMenu({ returnFocus: false });
      return;
    }
    // The panel must exist whenever «Ещё» can (items grew past the window)
    // and its rows must track data changes (the select mold's re-render pass:
    // the row set follows items, the checked marks follow the value).
    this.#renderMenu();
    if (this.#menuOpen) {
      // Focus revalidation (the post-await revalidation lesson, applied to
      // mid-open data changes): a re-render can drop the row that held focus.
      // When focus is neither inside the panel nor on the host, re-land it on
      // the checked-or-first row — the open menu is never focus-stranded.
      const active = document.activeElement;
      if (!active || (!this.#panel?.contains(active) && !this.contains(active))) {
        this.#focusMenuRows('first');
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown (the select mold): release controller resources without
    // dispatching — the element is leaving the tree.
    this.#closeMenu({ returnFocus: false, quiet: true });
  }

  // --- selection pipeline ------------------------------------------------------

  /**
   * Selects `item` — the single channel every path shares (chip press,
   * menuitemradio press). Re-selecting the active item is a NO-OP (the
   * no-deselect ruling: value is always one of the items). Controlled mode
   * applies nothing locally (strict) — the chips keep their live state until
   * the element's next update reverts to exactly `value`. Focus is PRESERVED
   * on the toggled chip: the chip buttons are stable DOM nodes and selection
   * only flips classes/aria, so nothing here moves focus (the reference's
   * focus-drops-to-body defect simply cannot occur by construction). A chip
   * press while the menu is open closes the menu WITHOUT stealing focus from
   * the chip; a MENU press closes with focus returned to «Ещё» (the matrix's
   * focus-return row — handled by #selectMenuItem below).
   */
  #selectItem(item: TkFilterChipsItem): void {
    if (this.#menuOpen) this.#closeMenu({ returnFocus: false });
    if (item.value === this.#effectiveValue) return;
    if (!this.#isControlled) {
      this.#uncontrolledValue = item.value;
      this.requestUpdate();
    }
    this.#emitValueChange(item.value);
  }

  /**
   * A menuitemradio press: the SAME value channel as a chip press, plus the
   * menu's own closing discipline — focus returns to «Ещё» whether or not
   * the pressed row changed the value (Enter on the checked row is a
   * close-with-no-change, native menu behavior).
   */
  #selectMenuItem(item: TkFilterChipsItem): void {
    const changed = item.value !== this.#effectiveValue;
    if (changed) {
      if (!this.#isControlled) {
        this.#uncontrolledValue = item.value;
        this.requestUpdate();
      }
    }
    this.#closeMenu({ returnFocus: true });
    if (changed) this.#emitValueChange(item.value);
  }

  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkFilterChipsChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  // --- chip row keyboard (arrows cycle focus, manual activation) ------------------

  /** ArrowLeft/ArrowRight move FOCUS chip-to-chip within the tablist, WRAPPING, without selecting. */
  #handleRowKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    const target = event.target as HTMLElement;
    if (!target.matches('[role="tab"]')) return;
    event.preventDefault();
    const chips = [...(this.renderRoot.querySelectorAll('[role="tab"]') ?? [])] as HTMLElement[];
    const from = chips.indexOf(target);
    if (from < 0 || chips.length === 0) return;
    const direction: 1 | -1 = key === 'ArrowRight' ? 1 : -1;
    const next = (from + direction + chips.length) % chips.length;
    chips[next]?.focus();
  }

  // --- «Ещё» menu (the select overlay-consumer mold) -------------------------------

  #moreButton(): HTMLButtonElement | null {
    return this.renderRoot.querySelector<HTMLButtonElement>('.chip--more');
  }

  /** The generated panel: role=menu, own shadow root (styles + slot), hidden until open. */
  #getPanel(): HTMLDivElement {
    if (this.#panel) return this.#panel;
    const panel = document.createElement('div');
    panel.setAttribute('role', 'menu');
    panel.id = `${this.#id}-menu`;
    panel.setAttribute('aria-label', MORE_MENU_NAME);
    panel.hidden = true;
    panel.addEventListener('pointerdown', (event) => {
      // Focus must not wander for menu presses mid-click (the Safari lesson —
      // the select mold). preventDefault on pointerdown stops the focus move,
      // not the click; focus returns to «Ещё» on selection anyway.
      event.preventDefault();
    });
    panel.addEventListener('keydown', (event) => this.#handleMenuKeydown(event as KeyboardEvent));
    // Panel-origin focus exits hear the close rule HERE: the panel is the
    // .row's SIBLING in the shadow tree, so a focusout from a menu row never
    // crosses .row's binding — without this listener a Tab out of the open
    // menu strands it open (aria-expanded, document listener and all) while
    // focus is already elsewhere (the 6.2 quick-review BLOCKER).
    panel.addEventListener('focusout', (event) => this.#handleFocusout(event as FocusEvent));
    const shadow = panel.attachShadow({ mode: 'open' });
    render(html`<style>${filterChipsMenuStyles.cssText}</style><slot></slot>`, shadow);
    // Shadow-root child (the select mold): renders in tree order at the end
    // of the renderRoot, outside Lit's template markers.
    this.renderRoot.appendChild(panel);
    this.#panel = panel;
    return panel;
  }

  /** Renders the menuitemradio rows into the panel's light children — same shadow tree as «Ещё». */
  #renderMenu(): void {
    const panel = this.#getPanel();
    const selected = this.#effectiveValue;
    render(
      html`${this.#overflowItems.map((item) => {
        const isSelected = item.value === selected;
        return html`<button
          type="button"
          role="menuitemradio"
          aria-checked=${isSelected ? 'true' : 'false'}
          tabindex="-1"
          @click=${() => this.#selectMenuItem(item)}
        >
          <span class="tk-filter-chips-menu__label">${item.label}</span>
          ${isSelected
            ? html`<svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="margin-inline-start:auto;flex:none"
              >
                <path d="M3 8.5l3.2 3.2L13 5"></path>
              </svg>`
            : nothing}
        </button>`;
      })}`,
      panel,
    );
  }

  #menuItems(): HTMLButtonElement[] {
    if (!this.#panel) return [];
    return [...(this.#panel.querySelectorAll('[role="menuitemradio"]') ?? [])] as HTMLButtonElement[];
  }

  /**
   * Opens (or keeps open) the «Ещё» menu: rows render fresh, the panel
   * mounts through the overlay controller ('dropdown' layer) and positions
   * against the «Ещё» chip (anchor-min-width — the Select mold), and FOCUS
   * moves to the checked row when one is checked, else the first row (every
   * open establishes focus — menu semantics; never "nowhere").
   */
  #openMenu(edge: 'first' | 'last' = 'first'): void {
    if (this.#menuOpen) return;
    const panel = this.#getPanel();
    const overflow = this.#overflowItems;
    if (overflow.length === 0) return;
    this.#renderMenu();
    panel.hidden = false;
    this.#menuOpen = true;
    this.requestUpdate(); // aria-expanded on «Ещё» re-renders
    const anchor = this.#moreButton();
    if (anchor) {
      // Controller-only mechanics (AD-12): dropdown layer, bottom placement,
      // anchor-min-width (long labels may grow past the chip).
      this.#overlayHandle = mountOverlay(panel, 'dropdown');
      this.#positionHandle = positionFloating(panel, {
        anchor,
        placement: 'bottom',
        offset: MENU_OFFSET_PX,
        matchAnchorWidth: 'min',
      });
    }
    document.addEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#focusMenuRows(edge);
  }

  /**
   * Focuses the menu's landing row — the CHECKED row when one is checked,
   * else the edge row — and reveals it: a focused row must never sit below
   * the panel's scroll fold (§8 focus-always-visible; the select mold's
   * #scrollActiveIntoView pass).
   */
  #focusMenuRows(edge: 'first' | 'last'): void {
    const items = this.#menuItems();
    if (items.length === 0) return;
    const checked = items.findIndex((item) => item.getAttribute('aria-checked') === 'true');
    const target =
      checked >= 0
        ? items[checked]
        : edge === 'first'
          ? items[0]
          : items[items.length - 1];
    target?.focus();
    this.#revealRow(target);
  }

  /** Minimal scroll reveal of a menu row (the select literal; guarded for non-visual hosts). */
  #revealRow(row: HTMLButtonElement | undefined): void {
    if (row && typeof row.scrollIntoView === 'function') {
      row.scrollIntoView({ block: 'nearest' });
    }
  }

  #closeMenu(options: { returnFocus: boolean; quiet?: boolean }): void {
    if (!this.#menuOpen) return;
    this.#menuOpen = false;
    document.removeEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const panel = this.#panel;
    if (panel) {
      // Re-home into the SHADOW root on the controller's fallback path (the
      // select mold): the next open stays valid; popover-path releases leave
      // it in place.
      if (!panel.isConnected) this.renderRoot.appendChild(panel);
      panel.hidden = true;
    }
    if (!options.quiet) this.requestUpdate(); // aria-expanded re-renders
    if (options.returnFocus) this.#moreButton()?.focus();
  }

  /**
   * Menu keyboard (menu semantics): ArrowDown/ArrowUp cycle focus (wrapping
   * — the kit's noted pick), Home/End jump to the edges, Escape closes
   * WITHOUT changing value and returns focus to «Ещё». Enter/Space ride the
   * native button click; Tab is never intercepted — focus follows natural
   * tab order and the focusout below closes.
   */
  #handleMenuKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End' && key !== 'Escape') {
      return;
    }
    event.preventDefault();
    const items = this.#menuItems();
    if (items.length === 0) return;
    if (key === 'Escape') {
      this.#closeMenu({ returnFocus: true }); // closes WITHOUT changing value
      return;
    }
    const from = items.indexOf(document.activeElement as HTMLButtonElement);
    let target: HTMLButtonElement | undefined;
    if (key === 'Home') target = items[0];
    else if (key === 'End') target = items[items.length - 1];
    else {
      const direction: 1 | -1 = key === 'ArrowDown' ? 1 : -1;
      const base = from >= 0 ? from : 0;
      target = items[(base + direction + items.length) % items.length];
    }
    target?.focus();
    this.#revealRow(target); // arrows/Home/End land visible, not below the fold
  }

  #handleMoreClick(): void {
    if (this.#menuOpen) this.#closeMenu({ returnFocus: false });
    else this.#openMenu('first');
  }

  /**
   * The «Ещё» chip's keyboard surface: ArrowDown opens at the first row,
   * ArrowUp at the last (the APG menu-button edges); Enter/Space ride the
   * native button click. ArrowLeft/Right are NOT handled here — arrow
   * cycling belongs to the tablist, the «Ещё» chip is not a tab.
   */
  #handleMoreKeydown(event: KeyboardEvent): void {
    if (this.#menuOpen) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.#openMenu(event.key === 'ArrowUp' ? 'last' : 'first');
    }
  }

  /**
   * Focus leaving the open menu closes it with NO forced focus return —
   * focus follows the natural tab order (the select mold's focus-loss row).
   * Heard at BOTH origins: the .row binding covers chip-row exits, the
   * panel's own binding (see #getPanel) covers menu-row exits — the panel is
   * .row's shadow-tree SIBLING, so panel-origin focusout never crosses .row.
   */
  #handleFocusout(event: FocusEvent): void {
    if (!this.#menuOpen) return;
    const next = event.relatedTarget as Node | null;
    if (next && this.#panel?.contains(next)) return;
    this.#closeMenu({ returnFocus: false });
  }

  // --- render -----------------------------------------------------------------

  override render() {
    const effective = this.#effectiveValue;
    const overflow = this.#overflowItems;
    const hasOverflow = overflow.length > 0;
    // The «Ещё» chip carries the selected border while the active item lives
    // in the overflow (the border-only selected language — visible-indicator
    // ruling): the row always shows exactly one selected surface.
    const overflowSelected = hasOverflow && overflow.some((item) => item.value === effective);
    const name = this.label != null && this.label.length > 0 ? this.label : DEFAULT_ACCESSIBLE_NAME;

    return html`
      <div class="row" @focusout=${this.#handleFocusout}>
        <div class="tabs" role="tablist" aria-label=${name} @keydown=${this.#handleRowKeydown}>
          ${this.#visibleItems.map((item) => {
            const selected = item.value === effective;
            return html`<button
              type="button"
              class=${selected ? 'chip chip--selected' : 'chip'}
              role="tab"
              aria-selected=${selected ? 'true' : 'false'}
              @click=${() => this.#selectItem(item)}
            >
              ${item.label}
            </button>`;
          })}
        </div>
        ${hasOverflow
          ? html`<button
              type="button"
              class=${overflowSelected ? 'chip chip--more chip--selected' : 'chip chip--more'}
              aria-haspopup="menu"
              aria-expanded=${this.#menuOpen ? 'true' : 'false'}
              aria-controls="${this.#id}-menu"
              @click=${this.#handleMoreClick}
              @keydown=${this.#handleMoreKeydown}
            >
              <span class="chip__more-label">${MORE_LABEL}</span>
              <span class="chip__chevron" aria-hidden="true">
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
                  <path d="M5 7.5l5 5 5-5"></path>
                </svg>
              </span>
            </button>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-filter-chips': TkFilterChips;
  }
}

if (!customElements.get('tk-filter-chips')) {
  customElements.define('tk-filter-chips', TkFilterChips);
}
