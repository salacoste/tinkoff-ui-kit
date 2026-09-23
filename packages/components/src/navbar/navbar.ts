import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { lockBodyScroll, mountOverlay, positionFloating, trapFocus } from '../overlays/index.js';
import type {
  TkOverlayHandle,
  TkPositioningHandle,
  TkScrollLockHandle,
  TkFocusTrapHandle,
} from '../overlays/index.js';
import { navbarStyles } from './navbar.css.js';

/**
 * One nav link of the `links` prop — navigation data, not a form channel.
 */
export interface TkNavbarLink {
  /** Stable section value (what `activeValue` addresses). */
  value: string;
  /** Visible link text (also the link's accessible name). */
  label: string;
  /** Navigation target — native anchor navigation, the kit never intercepts it. */
  href: string;
}

/**
 * Scroll threshold (px) at which the bar's shadow + hairline fade in — the
 * spec's noted pick (~8px probed range → 10px), a JS timing constant like
 * tk-select's typeahead window (the token layer cannot feed JS comparisons).
 */
export const TK_NAVBAR_SCROLL_THRESHOLD_PX = 10;

/**
 * Last-resort accessible name for the nav landmarks — the tk-select
 * DEFAULT_ACCESSIBLE_NAME precedent (localization-ready constant): an unnamed
 * <nav> works, but several navs on one page need distinguishing names.
 */
const DEFAULT_NAV_LABEL = 'Навигация';

/**
 * tk-navbar — the reference's sticky site header (Story 3.4): 72px white bar
 * (DESIGN `components.navbar.height`; the 64px capture probe is recorded in
 * .playwright-cli/verify/navbar/NOTES.md — DESIGN wins over captures), logo
 * slot left, links with the yellow active underline + 700-weight ink text
 * (the AA redundancy rule: yellow never carries state alone), utilities slot
 * right, scroll-shrinking shadow (transparent at top → shadow-default +
 * hairline after the 10px threshold, 150ms token fade), and below 768px a
 * burger opening a FOCUS-TRAPPED drawer.
 *
 * NAVIGATION, NOT A FORM CONTROL (the spec's ruling): `activeValue` is a
 * prop ONLY — clicking a link is native anchor navigation and the kit does
 * not intercept routing, so there is NO §4 value/defaultValue pair and NO
 * change event ("no channel events" is unit-pinned). An `activeValue`
 * matching nothing marks NO link (the spec's matrix pick — unlike tabs,
 * there is no "always one active" clamp).
 *
 * THE DRAWER (the overlay controller's second real consumer, after
 * tk-select): the panel is a shadow-tree child (the 2.3 ratified pattern —
 * the burger's aria-controls id resolves within one tree) mounted through
 * `mountOverlay(panel, 'dropdown')` (drawer = overlay layer semantics), so
 * ALL mechanics are the controller's — zero bespoke z/scroll/trap code in
 * this file (structurally pinned by the unit suite):
 * - stacking/z: `mountOverlay` + the `--tk-z-*` scale (the bar itself is
 *   sticky, not floating — its `--tk-z-nav` is the one sanctioned non-overlay
 *   z consumption in the kit);
 * - scroll-lock: `lockBodyScroll()` (refcounted, shared with any modal);
 * - focus trap + restore: `trapFocus(panel)` — Tab/Shift-Tab cycle inside
 *   the drawer, focus returns on release, and close explicitly re-focuses
 *   the burger (the spec's restore demand);
 * - positioning: `positionFloating` anchors the sheet to the bar's bottom
 *   edge at full width and tracks scroll/resize.
 * The drawer is INTERNAL UI STATE (the spec's ruling: "internal state, not
 * consumer channel") — no `open` property, no `open-change`, no React
 * event-map entry. Esc closes; clicking a link closes (navigation itself is
 * the anchor's own); the burger toggles.
 *
 * BREAKPOINT: `@media (max-width: 767px)` — a media query, per the spec's
 * noted pick (container queries deferred); the drawer's lock/trap mechanics
 * live only while open, at any width.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; no imperative DOM at
 * construction; the scroll listener attaches on connect and is passive.
 *
 * @tag tk-navbar
 * @attr {boolean} sticky - Bar sticks to the viewport top (default true; the shadow + hairline still track scroll).
 * @attr {string} burger-label - Accessible name of the burger button (also names the drawer dialog). Default «Меню».
 * @attr {string} active-value - The active section's `value` — renders the matching link with the yellow underline + 700 weight; unmatched marks nothing.
 * @prop {TkNavbarLink[]} [links] - Nav links; duplicate/value-less entries clamp out with a dev warn.
 * @slot logo - Brand mark, left of the links.
 * @slot utilities - Utility cluster, right-aligned (search, account).
 * @slot burger - Drawer content override; default = the links list, vertical.
 */
export class TkNavbar extends LitElement {
  static override readonly styles = [navbarStyles];

  /** Nav links — array of { value, label, href }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  links: TkNavbarLink[] = [];

  /**
   * The active section's value — NOT a channel (the spec's ruling): a plain
   * input prop the consumer sets from its router; the element dispatches
   * nothing when links are clicked. Accepted from the `active-value`
   * attribute, never reflected (value data, CONVENTIONS §2).
   */
  @property({ type: String, attribute: 'active-value' })
  activeValue?: string;

  /** Bar sticks to the viewport top (the reference behavior); reflects (boolean, CONVENTIONS §2). */
  @property({ type: Boolean, reflect: true })
  sticky = true;

  /** Accessible name of the burger button (also the drawer dialog's label). */
  @property({ type: String, attribute: 'burger-label' })
  burgerLabel = 'Меню';

  /** The drawer's open state — PRIVATE internal UI state (the spec's ruling: not a consumer channel). */
  #drawerOpen = false;

  /** The data-scrolled flag driven by the passive scroll listener. */
  #scrolled = false;

  /**
   * Whether the `burger` slot carries assigned content — the fallback links
   * list renders ONLY while it does not. This keeps the trap's focusable set
   * honest: the trap's shadow-aware traversal cannot see slot-PROJECTED
   * content (the module's documented selector-level scope), so a lingering
   * unrendered fallback list would put display:none links into the cycle.
   * With the fallback absent, an overridden drawer traps EMPTY — the
   * module's designed degradation (Tab passes through, never sticks).
   */
  #burgerSlotFilled = false;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;
  #lockHandle: TkScrollLockHandle | null = null;
  #trapHandle: TkFocusTrapHandle | null = null;

  /**
   * Direct reference to the drawer panel node. The controller's release
   * DETACHES the panel (container fallback: removed from the overlay
   * container, which is then itself removed) — a detached node answers no
   * tree query, so close() must re-home through this field, not a lookup.
   */
  #drawerEl: HTMLElement | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-navbar-${++TkNavbar.#nextId}`;
    return this.#uniqueId;
  }

  /** Links with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveLinks(): TkNavbarLink[] {
    return this.links ?? [];
  }

  /**
   * The scroll listener — the ONE scroll code in the file (sanctioned by the
   * spec's "scroll listener threshold" row; scroll-LOCK is the controller's).
   * Flips the host's `data-scrolled` attribute at the threshold; the CSS
   * fades shadow + hairline over the 150ms motion token (instant under
   * reduced motion — the token layer collapses the duration).
   */
  readonly #onScroll = (): void => {
    if (typeof window === 'undefined') return;
    const next = (window.scrollY ?? 0) >= TK_NAVBAR_SCROLL_THRESHOLD_PX;
    if (next === this.#scrolled) return;
    this.#scrolled = next;
    if (next) this.setAttribute('data-scrolled', '');
    else this.removeAttribute('data-scrolled');
  };

  /**
   * Duplicate link VALUES clamp (the tabs/select mirror): a value the
   * `activeValue` could address twice is ambiguous, and value-less entries
   * could never be addressed — both drop with a dev warn. CONVENTIONS §2
   * degrade-to-default spirit; length-guarded so the follow-up update
   * converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('links')) {
      const seen = new Set<string>();
      const deduped = (this.links ?? []).filter((link) => {
        const value = link?.value;
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.links != null && deduped.length !== this.links.length) {
        console.warn(
          'tk-navbar: duplicate or value-less link entries dropped — link values must be unique non-empty strings (first occurrence wins)',
        );
        this.links = deduped;
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.#onScroll, { passive: true });
    }
    // Reflect the CURRENT scroll position at connect (a navbar mounted
    // mid-scroll must not wait for the next scroll event to show its shadow).
    this.#onScroll();
  }

  override disconnectedCallback(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.#onScroll);
    }
    // Quiet teardown: release controller resources without focus churn (the
    // element is leaving the tree; focus ops on detached nodes are no-ops).
    if (this.#drawerOpen) this.#closeDrawer();
    super.disconnectedCallback();
  }

  // --- drawer (controller-owned mechanics, AD-12) ---------------------------

  /**
   * The drawer panel — by shadow-tree class, else the captured node
   * reference: the controller's fallback path legitimately REPARENTS the
   * panel into the overlay container while open (popover-less engines) and
   * DETACHES it on release, so tree lookups alone lose it exactly when it
   * needs closing or re-homing.
   */
  #panel(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.drawer') ?? this.#drawerEl;
  }

  #burger(): HTMLButtonElement | null {
    return this.renderRoot.querySelector<HTMLButtonElement>('.burger');
  }

  async #openDrawer(): Promise<void> {
    if (this.#drawerOpen) return;
    this.#drawerOpen = true;
    this.requestUpdate();
    await this.updateComplete;
    // The await is an open window: a second click may have CLOSED the drawer
    // (the toggle), the element may have disconnected, or a previous open's
    // controller state may still hold the panel — mounting now would race the
    // close (leaking lock/trap behind a "closed" state) or double-mount. The
    // close/disconnect paths reset their flags SYNCHRONOUSLY, so re-validating
    // them here is the guard; mountOverlay's own loud throw stays the belt.
    if (!this.#drawerOpen || !this.isConnected || this.#overlayHandle) return;
    const panel = this.#panel();
    const bar = this.renderRoot.querySelector<HTMLElement>('.bar');
    if (!panel || !bar) {
      this.#drawerOpen = false;
      this.requestUpdate();
      return;
    }
    this.#drawerEl = panel; // survives the controller's reparent/detach
    panel.hidden = false; // belt: the template binding already flipped it
    // Controller-only mechanics (the acceptance's structural pin): mounting
    // (dropdown layer — drawer = overlay layer semantics), anchor positioning
    // (full-width sheet on the bar's bottom edge, scroll/resize-tracked),
    // refcounted scroll-lock, and the Tab cycle + restore trap.
    this.#overlayHandle = mountOverlay(panel, 'dropdown');
    this.#positionHandle = positionFloating(panel, {
      anchor: bar,
      placement: 'bottom',
      matchAnchorWidth: true,
      // The sheet is FULL-BLEED by design (width == the bar == the viewport):
      // the positioner's default 8px viewport padding would clamp the
      // degenerate equal-width case 8px in from the left and 8px PAST the
      // right edge (probed at 360px live) — zero padding keeps the flush
      // edge-to-edge sheet the reference draws.
      viewportPadding: 0,
    });
    this.#lockHandle = lockBodyScroll();
    this.#trapHandle = trapFocus(panel);
  }

  #closeDrawer(): void {
    if (!this.#drawerOpen) return;
    this.#drawerOpen = false;
    // The trap releases first (it restores the PRE-trap focus); the burger is
    // then focused explicitly — the spec's "focus restored to the burger"
    // demand holds even when the drawer was opened from a non-focused click.
    this.#trapHandle?.release();
    this.#trapHandle = null;
    this.#lockHandle?.release();
    this.#lockHandle = null;
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const panel = this.#panel();
    if (panel) {
      // The container fallback path DETACHES the panel on release (the
      // controller owns its DOM while mounted) — re-home it into the shadow
      // root so the next open and the burger's aria-controls stay valid.
      if (!panel.isConnected) this.renderRoot.appendChild(panel);
      panel.hidden = true;
    }
    this.requestUpdate();
    this.#burger()?.focus();
  }

  #toggleDrawer(): void {
    if (this.#drawerOpen) this.#closeDrawer();
    else
      void this.#openDrawer().catch((error: unknown) => {
        // Belt behind the pre-mount guard: the controller fails LOUD by
        // design — surface it, then force a clean closed state so no
        // half-mounted drawer leaks lock/trap behind "open".
        console.warn('tk-navbar: drawer open failed — closing cleanly', error);
        this.#closeDrawer();
      });
  }

  /**
   * Esc closes (the spec's matrix row). The Tab cycle lives in the
   * controller's trap — this handler never touches Tab.
   */
  #handleDrawerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.#closeDrawer();
  }

  /** A clicked link closes the drawer; navigation itself is the anchor's own. */
  #handleDrawerClick(event: Event): void {
    if (!this.#drawerOpen) return;
    const target = event.target as Element | null;
    if (target && typeof target.closest === 'function' && target.closest('a')) {
      this.#closeDrawer();
    }
  }

  /** The burger slot's assignment drives the fallback list's presence (see the field note). */
  #handleBurgerSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const filled = slot.assignedElements({ flatten: true }).length > 0;
    if (filled !== this.#burgerSlotFilled) {
      this.#burgerSlotFilled = filled;
      this.requestUpdate();
    }
  }

  // --- render -----------------------------------------------------------------

  override render() {
    const links = this.#effectiveLinks;
    const activeValue = this.activeValue;

    return html`
      <header class="bar">
        <div class="bar__inner">
          <div class="bar__logo">
            <slot name="logo"></slot>
          </div>
          <nav class="links" aria-label="${DEFAULT_NAV_LABEL}">
            ${links.map((link) => {
              const isActive = link.value === activeValue;
              return html`
                <a
                  class="link"
                  href=${link.href}
                  aria-current=${isActive ? 'page' : nothing}
                ><span class="link__label">${link.label}</span></a
                >
              `;
            })}
          </nav>
          <div class="utilities">
            <slot name="utilities"></slot>
          </div>
          <button
            type="button"
            class="burger"
            aria-label=${this.burgerLabel}
            aria-expanded=${this.#drawerOpen ? 'true' : 'false'}
            aria-controls="${this.#id}-drawer"
            @click=${this.#toggleDrawer}
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
        </div>
      </header>
      <div
        class="drawer"
        id="${this.#id}-drawer"
        role="dialog"
        aria-modal="true"
        aria-label=${this.burgerLabel}
        ?hidden=${!this.#drawerOpen}
        @keydown=${this.#handleDrawerKeydown}
        @click=${this.#handleDrawerClick}
      >
        <div class="drawer__content">
          <slot name="burger" @slotchange=${this.#handleBurgerSlotChange}>
            ${this.#burgerSlotFilled
              ? nothing
              : html`
                  <nav class="drawer__nav" aria-label="${DEFAULT_NAV_LABEL}">
                    ${links.map((link) => {
                      const isActive = link.value === activeValue;
                      return html`
                        <a
                          class="drawer__link"
                          href=${link.href}
                          aria-current=${isActive ? 'page' : nothing}
                          >${link.label}</a
                        >
                      `;
                    })}
                  </nav>
                `}
          </slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-navbar': TkNavbar;
  }
}

if (!customElements.get('tk-navbar')) {
  customElements.define('tk-navbar', TkNavbar);
}
