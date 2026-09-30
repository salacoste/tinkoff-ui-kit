import { LitElement, html, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay, positionFloating } from '../overlays/index.js';
import type { TkOverlayHandle, TkPositioningHandle } from '../overlays/index.js';
import { menuPanelStyles, menuPopoverStyles } from './menu-popover.css.js';
import { TkMenuItem } from './menu-item.js';

/** Payload of `select` (CONVENTIONS §3 — the bare occurrence verb): the activated row element. */
export interface TkMenuPopoverSelectDetail {
  value: TkMenuItem;
}

/** Typed shape of the tk-menu-popover `select` event (CONVENTIONS §7). */
export type TkMenuPopoverSelectEvent = CustomEvent<TkMenuPopoverSelectDetail>;

/** Payload of `open-change` (CONVENTIONS §9 frozen overlay contract). */
export interface TkMenuPopoverOpenChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-menu-popover `open-change` event (CONVENTIONS §7). */
export type TkMenuPopoverOpenChangeEvent = CustomEvent<TkMenuPopoverOpenChangeDetail>;

/**
 * Last-resort accessible name when `label` is absent — a localization-ready
 * constant (the tk-select «Выбор» precedent): an unnamed role=menu fails the
 * axe name gate, so «Меню» stands in rather than shipping an unnamed panel.
 */
const DEFAULT_MENU_NAME = 'Меню';

/** Vertical gap between the anchor and the panel (px) — captures ≈4–6, the select-menu literal's 4. */
const MENU_OFFSET_PX = 4;

/**
 * tk-menu-popover — the anchored command menu (spec 19.1), grounded by the
 * captures-v3/admin follow-up pack (f) 2026-09-30: one popover chrome matrix
 * behind the console's avatar-menu, table/list kebabs and page-header
 * overflow (white panel, hairline, r12, dropdown shadow, ≈44px rows, 1px
 * group dividers, red-text destructive rows, right-edge anchoring, zero
 * yellow — the console's mono discipline).
 *
 * THE TRIGGER IS SLOTTED (`slot="anchor"`): the atom never draws a trigger —
 * the consumer's own button/avatar/kebab icon-button keeps its look; the
 * atom attaches aria-haspopup="menu" + aria-expanded to it and toggles on
 * its click. NO aria-controls is wired: the panel is a generated child of
 * this element's shadow tree (the select.ts single-tree idref lesson — an
 * outer-tree anchor cannot resolve a shadow id, aria-valid-attr-value
 * fails exactly there), so the pair stops at haspopup + expanded.
 *
 * PANEL MOUNTING (the frozen §9 overlay mold, tk-select verbatim): the
 * panel is a GENERATED child of this element's shadow root carrying its own
 * shadow root (`<style>` + header slot + default slot) so its styles never
 * leak document-level (§6) and travel with it on the controller's fallback
 * reparenting. Items/dividers/header are the CONSUMER's light children of
 * tk-menu-popover, ROUTED into the panel on connect and on every childList
 * mutation (a MutationObserver started in firstUpdated — §10 forbids
 * construction-time DOM access): they become the panel's light children,
 * projected by its slots in authored order, in the same tree as each other.
 *
 * SEMANTICS — APG menu (spec 19.1 OQ-2 ruling: the captured rows are
 * COMMANDS): role=menu panel, role=menuitem rows with roving tabindex (the
 * atom promotes the current row to 0), real focus moves ArrowDown/ArrowUp
 * (wrapping, disabled rows skipped) + Home/End; Escape closes and restores
 * focus to the anchor; Tab from a row closes with natural tab order;
 * outside press closes and returns focus to the anchor; activating a row
 * (click / Enter / Space) dispatches `select` ({ value: TkMenuItem }) and
 * closes. Focus does NOT trap — a menu is not a modal (trapFocus stays a
 * Modal/drawer capability, AD-12).
 *
 * STATE: `open` is the §9 frozen overlay-surface property (reflects,
 * `open-change` fires on every actual flip — the select lifecycle guards:
 * nothing at initial mount, nothing on quiet disconnect teardown).
 *
 * @tag tk-menu-popover
 * @attr {boolean} open - Panel open state (the frozen §9 overlay contract); reflects, flips via interaction too.
 * @attr {string} label - Accessible name for the menu panel (defaults to «Меню»).
 * @slot anchor - The trigger: the consumer's own focusable control (button, avatar tile, kebab icon-button).
 * @slot default - The rows: tk-menu-item (commands) and tk-menu-divider (group rules), authored in order.
 * @slot header - Optional static block above the rows (the avatar-menu user block).
 * @fires select - `{ value: TkMenuItem }` — a row was activated; composed, bubbles.
 * @fires open-change - `{ value: boolean }` — the frozen §9 overlay-surface state event; composed, bubbles.
 */
export class TkMenuPopover extends LitElement {
  static override readonly styles = [menuPopoverStyles];

  /** Menu open state — the frozen §9 overlay-surface property (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Accessible name for the role=menu panel (axe name gate; defaults to «Меню»). */
  @property({ type: String })
  label?: string;

  /** The generated panel — a child of the shadow renderRoot (see the class doc), hidden when closed. */
  #panel: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;

  /** Routes late-authored light children into the panel (started in firstUpdated). */
  #observer: MutationObserver | null = null;

  /** Edge the opening interaction wants focused once the panel mounts ('first' | 'last'; interaction opens only). */
  #pendingFocusEdge: 'first' | 'last' | null = null;

  /**
   * True once updated() has run once: the open-change channel stays silent
   * on the FIRST pass whatever set `open` (attribute at upgrade, early
   * property assignment) — §9 «nothing at initial mount». Select guards
   * this with the Lit old-value shape alone; here the flag makes the
   * silence independent of attribute-upgrade old-value semantics.
   */
  #hasRenderedOnce = false;

  /** Document-level outside-press listener (bound once, added/removed with the panel). */
  #onDocumentPointerDown = (event: Event): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.contains(target) || this.#panel?.contains(target)) return;
    this.#close({ returnFocus: true });
  };

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-menu-popover-${++TkMenuPopover.#nextId}`;
    return this.#uniqueId;
  }

  /** The menu's accessible name (the `label` prop, else the localized constant). */
  get #menuName(): string {
    if (this.label != null && this.label.length > 0) return this.label;
    return DEFAULT_MENU_NAME;
  }

  override updated(changed: PropertyValues<this>): void {
    const firstPass = !this.#hasRenderedOnce;
    this.#hasRenderedOnce = true;
    if (changed.has('label')) {
      // The panel keeps its accessible name in sync even while closed (the
      // axe name gate covers the closed DOM too).
      this.#panel?.setAttribute('aria-label', this.#menuName);
    }
    if (changed.has('open')) {
      if (this.open) this.#mountMenu();
      else this.#unmountMenu();
      // open-change AFTER the mount/position work, on an actual FLIP, never
      // on the first pass (see #hasRenderedOnce), never while detached
      // (quiet teardown).
      const wasOpen = changed.get('open');
      if (!firstPass && this.isConnected && wasOpen !== undefined && wasOpen !== this.open) {
        this.dispatchEvent(
          new CustomEvent<TkMenuPopoverOpenChangeDetail>('open-change', {
            detail: { value: this.open },
            composed: true,
            bubbles: true,
          }),
        );
      }
    }
  }

  override firstUpdated(): void {
    // Eager panel creation + routing: the element exists in the DOM from
    // the first paint; late-authored rows join via the observer below.
    this.#getPanel();
    this.#routeChildren();
    this.#syncAnchorAria();
    this.addEventListener('click', this.#handleHostClick);
    this.addEventListener('keydown', this.#handleHostKeydown);
    this.#observer = new MutationObserver(() => {
      this.#routeChildren();
      this.#syncAnchorAria(); // a swapped-in anchor wires itself here too
    });
    this.#observer.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown: release controller resources without dispatching (the
    // element is leaving the tree; an event here has no meaningful consumer).
    if (this.open) {
      this.open = false;
    }
    this.#unmountMenu();
    this.removeEventListener('click', this.#handleHostClick);
    this.removeEventListener('keydown', this.#handleHostKeydown);
    this.#observer?.disconnect();
    this.#observer = null;
  }

  // --- panel (shadow-tree child, controller-mounted) -------------------------

  /** The generated panel: role=menu, own shadow root (styles + slots), hidden until open. */
  #getPanel(): HTMLDivElement {
    if (this.#panel) return this.#panel;
    const panel = document.createElement('div');
    panel.setAttribute('role', 'menu');
    panel.id = `${this.#id}-menu`;
    panel.setAttribute('aria-label', this.#menuName);
    panel.hidden = true;
    panel.addEventListener('pointerdown', (event) => {
      // Menu presses must not move focus to the body mid-click (the select
      // Safari lesson); preventDefault on pointerdown stops the focus move,
      // not the click — row activation still rides the click.
      event.preventDefault();
    });
    panel.addEventListener('keydown', this.#handlePanelKeydown);
    panel.addEventListener('focusout', this.#handleFocusout);
    panel.addEventListener('focusin', this.#handlePanelFocusin);
    panel.addEventListener('click', this.#handlePanelClick);
    const shadow = panel.attachShadow({ mode: 'open' });
    render(
      html`<style>${menuPanelStyles.cssText}</style>
        <div class="panel__header" part="header"><slot name="header"></slot></div>
        <slot></slot>`,
      shadow,
    );
    // Appended at the end of the renderRoot, outside Lit's template markers
    // (the select mold: generated children live past the template result).
    this.renderRoot.appendChild(panel);
    this.#panel = panel;
    return panel;
  }

  /**
   * Routes light children into the panel: everything except the anchor
   * (slot="anchor") becomes the panel's light child — items/dividers into
   * its default slot, slot="header" blocks into its header slot, in authored
   * order. Idempotent (already-routed nodes are panel children, not ours).
   */
  #routeChildren(): void {
    const panel = this.#getPanel();
    for (const node of Array.from(this.childNodes)) {
      if (!(node instanceof HTMLElement)) continue; // whitespace/text stays put
      if (node.getAttribute('slot') === 'anchor') continue; // projected by the host's anchor slot
      if (node.parentElement === panel) continue;
      panel.appendChild(node);
    }
  }

  // --- anchor wiring -------------------------------------------------------------

  /**
   * The slotted trigger, resolved PULL-style (the tk-tooltip mold): the
   * initial slot assignment races slotchange in some engines, and consumers
   * may swap the anchor at any moment — so interactions resolve the anchor
   * at USE time instead of caching a binding. All anchor wiring lives on
   * the HOST (the anchor is a light child: its composed events cross into
   * the host's tree, wherever the panel currently lives).
   */
  get #anchorElement(): HTMLElement | null {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="anchor"]');
    const [first] = slot?.assignedElements({ flatten: true }) ?? [];
    return first instanceof HTMLElement ? first : null;
  }

  /** (Re)syncs haspopup/expanded on the current anchor (idempotent, cheap). */
  #syncAnchorAria(): void {
    const element = this.#anchorElement;
    if (!element) return;
    element.setAttribute('aria-haspopup', 'menu');
    element.setAttribute('aria-expanded', this.open ? 'true' : 'false');
  }

  /** Composed path crosses the anchor (inner targets included). */
  #pathHitsAnchor(event: Event): boolean {
    const anchor = this.#anchorElement;
    return anchor !== null && event.composedPath().includes(anchor);
  }

  #handleHostClick = (event: Event): void => {
    // Only anchor-origin clicks toggle (items are handled by the panel's own
    // listener; unrouted children never carry the anchor slot).
    if (!this.#pathHitsAnchor(event)) return;
    this.#pendingFocusEdge = null;
    this.#setOpen(!this.open);
  };

  #handleHostKeydown = (event: KeyboardEvent): void => {
    if (!this.#pathHitsAnchor(event)) return;
    // IME: mid-composition keydowns are inert (the tk-input/select guard).
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const edge = event.key === 'ArrowDown' ? 'first' : 'last';
      if (this.open) {
        this.#focusEdge(edge);
      } else {
        this.#pendingFocusEdge = edge;
        this.#setOpen(true);
      }
      return;
    }
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.#close({ returnFocus: true }); // focus is already on the anchor
    }
    // Enter/Space ride the native click of a real trigger (the slot contract
    // expects a focusable control); Escape closed is native.
  };

  // --- items / roving --------------------------------------------------------------

  /** All row elements routed into the panel (authored order). */
  #items(): TkMenuItem[] {
    if (!this.#panel) return [];
    return Array.from(this.#panel.querySelectorAll<TkMenuItem>('tk-menu-item'));
  }

  #enabledItems(): TkMenuItem[] {
    return this.#items().filter((item) => !item.disabled);
  }

  /** Roving truth: exactly `current` is tabbable (APG roving tabindex). */
  #setCurrent(item: TkMenuItem): void {
    for (const row of this.#items()) {
      row.tabIndex = row === item ? 0 : -1;
    }
  }

  /** The focused row, whichever tree the panel lives in (shadow retargeting covered both ways). */
  #focusedItem(): TkMenuItem | null {
    const active =
      (this.#panel?.isConnected && this.#panel.getRootNode() instanceof ShadowRoot
        ? (this.#panel.getRootNode() as ShadowRoot).activeElement
        : null) ?? document.activeElement;
    return active instanceof TkMenuItem ? active : null;
  }

  #focusEdge(edge: 'first' | 'last'): void {
    const items = this.#enabledItems();
    const item = edge === 'first' ? items[0] : items[items.length - 1];
    if (!item) return;
    this.#setCurrent(item);
    item.focus();
  }

  #stepFocus(direction: 1 | -1): void {
    const items = this.#enabledItems();
    if (items.length === 0) return;
    const from = this.#focusedItem();
    const index = from ? items.indexOf(from) : -1;
    // Wrapping (the select pick — native parity); disabled rows are already filtered.
    const next = items[(index + direction + items.length) % items.length] ?? items[0];
    this.#setCurrent(next);
    next.focus();
  }

  // --- lifecycle -------------------------------------------------------------------

  #mountMenu(): void {
    const panel = this.#getPanel();
    this.#routeChildren();
    panel.setAttribute('aria-label', this.#menuName);
    panel.hidden = false;
    const anchor = this.#anchorElement;
    this.#syncAnchorAria();
    // Controller-only mechanics (AD-12): dropdown layer, bottom placement,
    // RIGHT-EDGE alignment (the captures' anchor mode — alignment:'end' is
    // the 19.1 controller extension, the matchAnchorWidth precedent).
    this.#overlayHandle = mountOverlay(panel, 'dropdown');
    this.#positionHandle = positionFloating(panel, {
      anchor: anchor ?? this,
      placement: 'bottom',
      offset: MENU_OFFSET_PX,
      alignment: 'end',
    });
    document.addEventListener('pointerdown', this.#onDocumentPointerDown);
    if (this.#pendingFocusEdge) {
      const edge = this.#pendingFocusEdge;
      this.#pendingFocusEdge = null;
      this.#focusEdge(edge);
    }
  }

  #unmountMenu(): void {
    this.#pendingFocusEdge = null;
    document.removeEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const panel = this.#panel;
    if (panel) {
      // The container fallback path DETACHES the panel on release (the
      // controller owns its DOM while mounted) — re-home it INTO THE SHADOW
      // ROOT together with its routed light children; popover-path releases
      // leave it in place (promoted in place, never moved).
      if (!panel.isConnected) this.renderRoot.appendChild(panel);
      panel.hidden = true;
    }
    // Closed menu: nothing tabbable inside (the anchor is the tab stop).
    for (const row of this.#items()) row.tabIndex = -1;
    this.#syncAnchorAria();
  }

  #setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next; // mount/unmount + the open-change dispatch ride updated()
  }

  #close(options: { returnFocus: boolean }): void {
    // Resolve the focus target BEFORE the close tears anything down — the
    // consumer may remove the anchor in the same tick.
    const target = this.#anchorElement;
    this.#setOpen(false);
    if (options.returnFocus && target) {
      // Focus the anchor once the update (and its panel unmount) has run.
      void this.updateComplete.then(() => target.focus());
    }
  }

  /** Activates a row: `select` dispatch, then close with focus restored to the anchor. */
  #activate(item: TkMenuItem): void {
    if (item.disabled) return;
    this.dispatchEvent(
      new CustomEvent<TkMenuPopoverSelectDetail>('select', {
        detail: { value: item },
        composed: true,
        bubbles: true,
      }),
    );
    this.#close({ returnFocus: true });
  }

  // --- panel events ----------------------------------------------------------------

  #handlePanelFocusin = (event: FocusEvent): void => {
    const target = event.target;
    if (target instanceof TkMenuItem && !target.disabled) this.#setCurrent(target);
  };

  #handlePanelKeydown = (event: KeyboardEvent): void => {
    // IME guard (the kit's composition rule — inert mid-composition keys).
    if (event.isComposing || event.keyCode === 229) return;
    const key = event.key;
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        this.#stepFocus(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.#stepFocus(-1);
        return;
      case 'Home':
        event.preventDefault();
        this.#focusEdge('first');
        return;
      case 'End':
        event.preventDefault();
        this.#focusEdge('last');
        return;
      case 'Escape':
        event.preventDefault();
        this.#close({ returnFocus: true });
        return;
      case 'Enter':
      case ' ': {
        const item = this.#focusedItem();
        if (item) {
          event.preventDefault(); // Space must not scroll; Enter's native click is nothing here
          this.#activate(item);
        }
        return;
      }
      case 'Tab': {
        // Forward Tab leaves the menu (natural order — no forced return);
        // Shift+Tab from the first row lands on the anchor and KEEPS the
        // menu open (the select precedent: focus on the trigger is a legal
        // open state) — default behavior, no interception.
        const item = this.#focusedItem();
        const items = this.#enabledItems();
        const leavingBack = event.shiftKey && item === items[0];
        if (!leavingBack) this.#setOpen(false);
        return;
      }
      default:
        return; // Text selection keys etc. stay native; menus carry no typeahead in v1.
    }
  };

  #handlePanelClick = (event: Event): void => {
    // composedPath crosses row shadow roots (icon/label slotted content).
    for (const node of event.composedPath()) {
      if (node instanceof TkMenuItem) {
        this.#activate(node);
        return;
      }
      if (node === this.#panel) return; // panel chrome click — nothing to activate
    }
  };

  /**
   * Focus loss closes (the select contract): any focusout whose next target
   * is outside the whole component (anchor included — it is a light child)
   * and outside the panel closes the menu; focus then follows the NATURAL
   * tab order (no forced return — that belongs to the outside-press row).
   * `next === this` is the shadow-retargeted form of "into this component's
   * outer tree" (the anchor): safe, stays open.
   */
  #handleFocusout = (event: FocusEvent): void => {
    if (!this.open) return;
    const next = event.relatedTarget as Node | null;
    if (next === this) return;
    if (next && (this.contains(next) || this.#panel?.contains(next))) return;
    this.#setOpen(false);
  };

  // --- render ------------------------------------------------------------------------

  override render() {
    // slotchange here only refreshes the anchor's aria (the pull-based
    // getter is the source of truth for interactions).
    return html`<slot name="anchor" @slotchange=${this.#syncAnchorAria}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-menu-popover': TkMenuPopover;
  }
}

if (!customElements.get('tk-menu-popover')) {
  customElements.define('tk-menu-popover', TkMenuPopover);
}
