import { LitElement, html, nothing, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { lockBodyScroll, mountOverlay, trapFocus } from '../overlays/index.js';
import type {
  TkFocusTrapHandle,
  TkOverlayHandle,
  TkScrollLockHandle,
} from '../overlays/index.js';
import { modalStyles, modalSurfaceStyles } from './modal.css.js';

/** Payload of `open-change` (CONVENTIONS §9 frozen overlay contract). */
export interface TkModalOpenChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-modal `open-change` event (CONVENTIONS §7). */
export type TkModalOpenChangeEvent = CustomEvent<TkModalOpenChangeDetail>;

/**
 * Upper bound on the awaited exit animation before the mount releases — a JS
 * timing constant (the token layer cannot feed JS waits; the select
 * typeahead's TK_SELECT_TYPEAHEAD_RESET_MS precedent): 150ms exit + frame
 * slack. Animation end OR this bound, whichever first; skipped entirely under
 * prefers-reduced-motion (where the sheet's animations are already none).
 */
export const TK_MODAL_EXIT_MAX_MS = 350;

/**
 * Last-resort accessible name when `heading` is absent — the tk-select
 * DEFAULT_ACCESSIBLE_NAME precedent (a localization-ready constant): an
 * unnamed dialog fails the axe name gate, so «Диалог» stands in. The matrix
 * row's «content fallback» pick — recorded in NOTES.md/modal.
 */
const DEFAULT_MODAL_NAME = 'Диалог';

/**
 * Focusable PRESENCE check — mirrors the trap's collection shape (light DOM
 * plus descendant open shadow roots) so custom-element controls (tk-button's
 * inner button) count: found live at the 4.3 vision pass, where a light-only
 * approximation missed them and dumped initial focus on the panel (and its
 * UA ring). A check, never a cycle — the trap module stays the mechanism.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const hasFocusableIn = (root: ParentNode): boolean => {
  for (const element of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (element.matches(FOCUSABLE_SELECTOR)) return true;
    if (element.shadowRoot && hasFocusableIn(element.shadowRoot)) return true;
  }
  return false;
};

/** Open-modals stack — only the NEWEST answers Esc (one nesting level). */
const openModals: TkModal[] = [];

/** The token layer collapses durations under this query; the JS waits with it. */
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * tk-modal — the derived overlay dialog (Story 4.1), every mechanic consumed
 * from the 2.2 controller (zero bespoke mount/lock/trap code here — pinned
 * structurally by the unit suite).
 *
 * OPEN CHANNEL — the tk-select mold verbatim (the frozen §9 overlay-surface
 * state): `open` attribute/property (reflects), `open-change`
 * `detail: { value: boolean }` composed/bubbles, POST-mount on open and
 * POST-release on close, flip-only (Lit's first-update change-map never
 * produces a spurious open-change — the 2.3 guard). No default-open pair:
 * the mold's open channel has none, and a declarative `<tk-modal open>` IS
 * the initial-open form (the select ruling).
 *
 * SURFACE (the 2.3 ratified panel-in-shadow pattern): the scrim + panel are
 * ONE generated element (`div.modal`) in tk-modal's shadow tree carrying its
 * OWN shadow root — mounted by `mountOverlay(surface, 'modal')` (popover path
 * promotes in place; the fallback container reparents it across the tree
 * boundary, a no-axe-gate window per the select ruling). The surface's light
 * children are two FORWARDING slots (default + actions) projecting tk-modal's
 * light DOM through the surface's own slots: on the popover path the chain
 * stays in one document; the fallback path moves surface + forwarding slots
 * together, which detaches them from tk-modal's shadow tree — slotted
 * consumer content stops projecting on that legacy path (documented
 * limitation, engines without the popover API; happy-dom unit tests assert
 * structure only, the molds' rule).
 *
 * MECHANICS (all controller): scroll-lock refcounted (`lockBodyScroll()`),
 * focus `trapFocus(host)` — the HOST is the trap container so SLOTTED
 * consumer focusables (actions buttons) join the cycle, which the trap's
 * selector-level collection could never see from inside the surface's tree;
 * LIFO nesting gives the one supported level (inner modal traps within its
 * own panel; inner close restores INTO the outer). Initial focus = first
 * focusable (light DOM order = body before actions), else the panel itself
 * (tabindex=-1). No inert-style background treatment at v1 (the trap module
 * leaves that to the consumer; the trap + scrim + scroll-lock carry the
 * dialog) — recorded in NOTES.md/modal.
 *
 * DISMISS: Esc (document-capture keydown answered ONLY by the newest open
 * modal — and skipped entirely while any LIVE tk-toast is connected: toasts
 * paint above modals and eat the Esc first, the z-scale's own ordering
 * logic; a toast mid-exit no longer counts, or the press would die with it)
 * and a
 * click/press on the SCRIM itself (panel clicks never match). A dismiss never
 * fires consumer actions — destructive confirm is a STORY pattern (explicit
 * button in the actions slot; no `destructive` prop).
 *
 * MOTION: entrance scrim fade + panel opacity/translateY on the 300ms
 * moderate productive-entrance token; exit 150ms fast productive-exit, then
 * the mount releases — the close path awaits animation end with the
 * TK_MODAL_EXIT_MAX_MS bound and RE-VALIDATES its generation + connectivity
 * after the await (the 3.4 navbar lesson: rapid double-toggle and
 * disconnect-during-open must leak no mount/lock). Reduced motion: the token
 * layer collapses durations and the sheet's belt kills the keyframes; the JS
 * wait is skipped under the same media query.
 *
 * iOS momentum scroll: the panel's `overscroll-behavior: contain` is the
 * shipped mitigation; the real-device check is maintainer-side (the
 * deferred-work.md entry this story lands).
 *
 * SSR-compat (AD-10): no imperative DOM at construction; the surface is
 * generated on first open/heading write, client-side.
 *
 * @tag tk-modal
 * @attr {string} heading - Heading text; renders the panel heading element and names the dialog (aria-labelledby, id resolved inside the surface's own shadow tree).
 * @attr {boolean} open - Open state (frozen §9 overlay contract); reflects, flips via interaction too.
 * @slot - Body content of the dialog.
 * @slot actions - Buttons row (right-aligned); destructive confirm is an explicit button here — a dismiss never fires it.
 * @fires open-change - `{ value: boolean }` — the frozen §9 overlay-surface state event; composed, bubbles; post-mount on open, post-release on close.
 */
export class TkModal extends LitElement {
  static override readonly styles = [modalStyles];

  /** Heading text — renders the panel's heading element and names the dialog. */
  @property({ type: String })
  heading?: string;

  /** Open state — the frozen §9 overlay-surface property (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** The generated surface (scrim + panel), hidden while closed. */
  #surface: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #lockHandle: TkScrollLockHandle | null = null;
  #trapHandle: TkFocusTrapHandle | null = null;

  /** Transition generation — bumped on every real flip; stale coroutines abort on it. */
  #transition = 0;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-modal-${++TkModal.#nextId}`;
    return this.#uniqueId;
  }

  /**
   * Document-capture Esc — the modal's dismiss listener while open. Only the
   * NEWEST open modal answers (openModals is LIFO by open order); while any
   * LIVE tk-toast is connected the toast eats the Esc (toast layer 600 >
   * modal 500; the toast's own document listener dismisses it). A toast
   * mid-exit (data-exiting) is already leaving and its handler ignores it —
   * deferring to it would make this press dead (the fix-round dead-press
   * finding, mirrored from the toast handler's own filter).
   */
  readonly #onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if (openModals[openModals.length - 1] !== this) return;
    if (document.querySelector('tk-toast:not([data-exiting])')) return;
    event.preventDefault();
    this.open = false; // teardown + open-change(false) ride updated()
  };

  /** A press on the scrim itself dismisses; panel clicks never match (retargeted). */
  readonly #handleScrimClick = (event: Event): void => {
    if (event.target !== event.currentTarget) return;
    this.open = false;
  };

  /**
   * Open/close lifecycle rides the `open` property (attribute-driven opens
   * included — the open-state story renders `<tk-modal open>`): mount on
   * true, awaited exit-then-release on false. The dispatch is flip-only (the
   * select guard: Lit lists every reactive property in the FIRST update's
   * change map, so `wasOpen !== undefined` spares a mount-time false).
   */
  override updated(changed: PropertyValues<this>): void {
    if (changed.has('heading') && this.#surface) {
      this.#renderSurface();
    }
    if (!changed.has('open')) return;
    const wasOpen = changed.get('open');
    const flipped = wasOpen !== undefined && wasOpen !== this.open;
    if (flipped) this.#transition += 1;
    if (this.open) {
      this.#openSurface(flipped);
    } else {
      void this.#closeSurface(this.#transition, flipped).catch((error: unknown) => {
        // Belt behind the generation guard (the navbar mold): surface it,
        // then force a clean released state so nothing leaks behind "closed".
        console.warn('tk-modal: close failed — releasing cleanly', error);
        this.#releaseSurface(this.#transition);
      });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown (the navbar/select mold): reset the state flag, then
    // invalidate in-flight transitions and release synchronously — no exit
    // animation, no focus churn, no dispatch (an event from a leaving element
    // has no meaningful consumer; the follow-up update finds nothing mounted).
    this.open = false;
    this.#transition += 1;
    this.#releaseSurface(this.#transition);
  }

  // --- surface (generated shadow-tree child, controller-mounted) ------------

  /** The generated surface: scrim + panel in its own shadow root; forwarding slots as its light children. */
  #getSurface(): HTMLDivElement {
    if (this.#surface) return this.#surface;
    const surface = document.createElement('div');
    surface.className = 'modal'; // query hook, both trees (the popover path keeps it in place)
    surface.hidden = true;
    surface.attachShadow({ mode: 'open' }); // content rendered by #renderSurface
    // The surface's LIGHT children (inside tk-modal's shadow tree): the two
    // forwarding slots the surface's own <slot>/<slot name="actions"> project
    // — one document, one chain, on the popover path (see the class doc for
    // the fallback-path limitation). The actions forwarder carries BOTH
    // name="actions" (it RECEIVES light slot=actions content) and
    // slot="actions" (it is ASSIGNED into the surface shadow's named slot) —
    // a nameless-pair bug found live at the 4.3 vision pass silently routed
    // the buttons into the body slot.
    render(html`<slot></slot><slot name="actions" slot="actions"></slot>`, surface);
    this.renderRoot.appendChild(surface);
    this.#surface = surface;
    this.#renderSurface();
    return surface;
  }

  /** (Re)renders the surface's shadow content — the heading prop is live while open. */
  #renderSurface(): void {
    const surface = this.#getSurface();
    const shadow = surface.shadowRoot;
    if (!shadow) return;
    const hasHeading = this.heading != null && this.heading.length > 0;
    render(
      html`
        <style>${modalSurfaceStyles.cssText}</style>
        <div class="scrim" @click=${this.#handleScrimClick}></div>
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          aria-labelledby=${hasHeading ? `${this.#id}-heading` : nothing}
          aria-label=${hasHeading ? nothing : DEFAULT_MODAL_NAME}
        >
          ${hasHeading
            ? html`<h2 class="panel__heading" id="${this.#id}-heading">${this.heading}</h2>`
            : nothing}
          <div class="panel__body"><slot></slot></div>
          <div class="panel__actions"><slot name="actions"></slot></div>
        </div>
      `,
      shadow,
    );
  }

  #panel(): HTMLElement | null {
    return this.#surface?.shadowRoot?.querySelector<HTMLElement>('.panel') ?? null;
  }

  /**
   * OPEN (synchronous — the surface is generated, so no render await is
   * needed and no race window exists; the 3.4 lesson's await-guard applies
   * to the close path, which does await).
   */
  #openSurface(flipped: boolean): void {
    const surface = this.#getSurface();
    if (this.#overlayHandle) {
      // Re-open while the exit animation still held the mount: restore the
      // entrance state; the close coroutine re-validates its generation after
      // its await and aborts BEFORE releasing — mount/lock/trap never left.
      surface.removeAttribute('data-closing');
      if (flipped && this.isConnected) this.#emitOpenChange(true);
      return;
    }
    this.#renderSurface(); // heading may have changed while closed
    surface.hidden = false;
    this.#overlayHandle = mountOverlay(surface, 'modal');
    this.#lockHandle = lockBodyScroll();
    document.addEventListener('keydown', this.#onDocumentKeydown, { capture: true });
    openModals.push(this);
    if (flipped && this.isConnected) {
      this.#emitOpenChange(true);
    }
    // The trap arms ONE MICROTASK LATER: a declarative open at first paint
    // races sibling custom elements' first render (tk-modal's update runs
    // before tk-button's, whose shadow focusables therefore do not exist
    // yet — found live at the 4.3 vision pass: initial focus fell on the
    // panel and its UA ring). The deferral lands AFTER the siblings' update
    // microtasks in the same batch; the mount/lock/listeners above stay
    // synchronous, and the placement re-validates its generation and
    // connectivity post-defer (the 3.4 lesson).
    const gen = this.#transition;
    queueMicrotask(() => {
      if (gen !== this.#transition || !this.isConnected || this.#trapHandle) return;
      // Trap the HOST (see the class doc): slotted consumer focusables join
      // the cycle; initial focus = first focusable ('first' — the trap's
      // shadow-aware collection lands on tk-button's inner button), else the
      // panel itself (the zero-focusables fallback).
      const anyFocusable =
        hasFocusableIn(this) || (this.shadowRoot ? hasFocusableIn(this.shadowRoot) : false);
      this.#trapHandle = trapFocus(
        this,
        anyFocusable ? {} : { initialFocus: this.#panel() ?? surface },
      );
    });
  }

  /**
   * CLOSE: play the exit, await its end (bounded), re-validate, release.
   * A re-open mid-exit bumps the generation — this coroutine aborts without
   * releasing (the mount stayed live and #openSurface cleared the closing
   * look). A disconnect mid-exit also aborts — disconnectedCallback released
   * synchronously already.
   */
  async #closeSurface(gen: number, flipped: boolean): Promise<void> {
    const surface = this.#surface;
    if (!surface || !this.#overlayHandle) {
      if (flipped && this.isConnected) this.#emitOpenChange(false);
      return;
    }
    surface.setAttribute('data-closing', '');
    if (!prefersReducedMotion()) {
      await this.#awaitExitAnimation(surface);
      // RE-VALIDATE post-await (the 3.4 lesson): a re-open or a disconnect
      // during the animation invalidates this coroutine's generation.
      if (gen !== this.#transition || !this.isConnected) return;
    }
    this.#releaseSurface(gen);
    if (flipped && this.isConnected && gen === this.#transition) {
      this.#emitOpenChange(false);
    }
  }

  /** animationend on the panel's exit keyframes, raced with the bound. */
  #awaitExitAnimation(surface: HTMLElement): Promise<void> {
    return new Promise<void>((resolve) => {
      const panel = surface.shadowRoot?.querySelector('.panel') ?? null;
      let settled = false;
      const finish = (): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        panel?.removeEventListener('animationend', onEnd);
        resolve();
      };
      const onEnd = (event: Event): void => {
        if ((event as AnimationEvent).animationName === 'tk-modal-panel-out') finish();
      };
      const timer = window.setTimeout(finish, TK_MODAL_EXIT_MAX_MS);
      if (panel) panel.addEventListener('animationend', onEnd);
      else finish();
    });
  }

  /**
   * Releases everything the open path acquired (idempotent; the caller owns
   * the generation check — a stale close coroutine must not tear down a
   * re-opened mount). The trap releases FIRST (it restores the pre-trap
   * focus — the consumer's opener), then lock, then the controller mount;
   * the surface re-homes into the shadow tree (the container fallback
   * detaches it) so the next open stays valid.
   */
  #releaseSurface(gen: number): void {
    if (gen !== this.#transition) return;
    const index = openModals.indexOf(this);
    if (index !== -1) openModals.splice(index, 1);
    document.removeEventListener('keydown', this.#onDocumentKeydown, { capture: true });
    this.#trapHandle?.release();
    this.#trapHandle = null;
    this.#lockHandle?.release();
    this.#lockHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const surface = this.#surface;
    if (surface) {
      surface.removeAttribute('data-closing');
      if (!surface.isConnected) this.renderRoot.appendChild(surface);
      surface.hidden = true;
    }
  }

  #emitOpenChange(value: boolean): void {
    this.dispatchEvent(
      new CustomEvent<TkModalOpenChangeDetail>('open-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  // --- render -----------------------------------------------------------------

  override render() {
    // The host renders nothing of its own — the surface is generated (see
    // #getSurface); the forwarding slots live inside it.
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-modal': TkModal;
  }
}

if (!customElements.get('tk-modal')) {
  customElements.define('tk-modal', TkModal);
}
