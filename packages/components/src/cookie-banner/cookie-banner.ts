import { LitElement, html, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay } from '../overlays/index.js';
import type { TkOverlayHandle } from '../overlays/index.js';
import { cookieBannerStyles, cookieBannerSurfaceStyles } from './cookie-banner.css.js';

/** Payload of `open-change` (CONVENTIONS §9 frozen overlay contract). */
export interface TkCookieBannerOpenChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-cookie-banner `open-change` event (CONVENTIONS §7). */
export type TkCookieBannerOpenChangeEvent = CustomEvent<TkCookieBannerOpenChangeDetail>;

/** The dialog's default accessible name (the live DOM snapshot's own string). */
export const TK_COOKIE_BANNER_DEFAULT_LABEL = 'Баннер согласия использования cookies';

/** The accept button's default label («Хорошо» per the live DOM snapshot). */
export const TK_COOKIE_BANNER_DEFAULT_ACCEPT_LABEL = 'Хорошо';

/**
 * tk-cookie-banner — the compact NON-MODAL consent dialog (Story 7.2): a
 * scrimless, scroll-lock-free, trap-free consent card on the 2.2 overlay
 * controller's MODAL layer (top-layer promotion + the modal z class), fixed
 * to the viewport's bottom-left. Consent is a POSITIVE ACT: the only close
 * path is the consumer's `open` prop after `consent-choice` — the kit NEVER
 * closes itself (no internal close path, no X button), Esc and outside
 * presses change nothing, and the page behind stays fully interactive.
 *
 * OPEN CHANNEL — the tk-modal/tk-select mold verbatim (the frozen §9
 * overlay-surface state): `open` attribute/property (reflects) +
 * `open-change` `detail: { value: boolean }` composed/bubbles, POST-mount on
 * open and POST-release on close, flip-only (the §9 change-guard: Lit lists
 * every reactive property in the FIRST update's change map, so
 * `wasOpen !== undefined` spares a mount-time false). Because the banner has
 * no internal close path, every flip the channel reports is CONSUMER-driven
 * — the echo tells the consumer the mount/release actually happened, the
 * same post-mount/post-release timing the modal guarantees.
 *
 * SURFACE (the 2.3 ratified panel-in-shadow pattern, the select mold): the
 * card is a generated div child of tk-cookie-banner's shadow tree carrying
 * its OWN shadow root (styles + the accept button + the message slot),
 * hidden while closed, mounted by `mountOverlay(card, 'modal')` — the
 * popover path promotes it in place; the fallback container reparents it
 * across the tree boundary (slotted consumer content stops projecting on
 * that legacy path — the documented modal/select limitation, engines without
 * the popover API; happy-dom unit tests assert structure only, the molds'
 * rule). The card's light child is one FORWARDING `<slot>` (it lives in
 * tk-cookie-banner's shadow tree, so it gathers the host's light DOM) picked
 * up by the message slot inside the card's shadow root.
 *
 * MECHANICS (all controller, minus the modal's modalities — this surface's
 * Never list): NO scroll-lock, NO focus trap, NO scrim. What remains is the
 * controller's mount + the modal LAYER token; the fixed bottom-left geometry
 * is this sheet's own (the exact split tk-modal makes for its centered
 * frame — the controller owns mounting/z, a viewport-anchored surface owns
 * its frame).
 *
 * FOCUS: on open, focus moves to the accept button (the natural next act —
 * `preventScroll`: the card is fixed, always in view). Tab NEVER wraps —
 * non-modal: focus flows card → page natively. On close, focus returns to
 * the previously-focused element ONLY when it is still connected AND focus
 * currently sits inside the banner (a non-modal page is interactive — a
 * consumer closing the banner from a click elsewhere must not be yanked).
 * This trapless restore mirrors the controller trap's restore semantics
 * (snapshot at open, connected-check at close); the controller has no
 * restore-without-trap primitive and this surface deliberately traps
 * nothing — recorded in NOTES.md/cookie-banner.
 *
 * ESC: while open, a document-capture keydown answers Escape with
 * preventDefault AND NOTHING ELSE — no dismiss, no open-change (the frozen
 * ruling: consent is a positive act; the prevention marks the keypress
 * consumed by the banner's contract, documented in the a11y story). Outside
 * pointerdown: NO listener exists — nothing dismisses.
 *
 * STORAGE: the CONSUMER's, exclusively — the kit never reads or writes
 * localStorage/cookies (the structural unit pin).
 *
 * SSR-compat (AD-10): no imperative DOM at construction; the card is
 * generated on first open/label write, client-side.
 *
 * @tag tk-cookie-banner
 * @attr {boolean} open - Open state (frozen §9 overlay contract); reflects. The kit flips it NEVER — the consumer closes by setting it false after consent-choice.
 * @attr {string} label - Accessible dialog name via aria-label (default «Баннер согласия использования cookies»).
 * @attr {string} accept-label - The accept pill's label (default «Хорошо»).
 * @slot - The consent message (rich content: inline links are consumer composition; the kit styles ::slotted(a) — text-secondary via the §6 hook, underline on hover).
 * @fires open-change - `{ value: boolean }` — the frozen §9 overlay-surface state event; composed, bubbles; post-mount on open, post-release on close. Consumer-driven flips only (no internal close path).
 * @fires consent-choice - Occurrence (§3 bare verb, NO payload): the accept button was pressed. The kit changes NOTHING else — no close, no focus move; the consumer records consent and flips `open`.
 */
export class TkCookieBanner extends LitElement {
  static override readonly styles = [cookieBannerStyles];

  /** Open state — the frozen §9 overlay-surface property (reflects; the kit never flips it itself). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** The dialog's accessible name (aria-label on the card). */
  @property({ type: String })
  label?: string;

  /** The accept pill's label. */
  @property({ type: String, attribute: 'accept-label' })
  acceptLabel?: string;

  /** The generated card (role=dialog), a shadow-tree child, hidden while closed. */
  #card: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;

  /** The pre-open focus target — restored on close when still relevant (see the class doc). */
  #previouslyFocused: HTMLElement | null = null;

  /**
   * Document-capture Esc: preventDefault and NOTHING else (the frozen
   * ruling — see the class doc). Attached only while open; torn down on
   * close and on disconnect.
   */
  readonly #onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.open) return;
    event.preventDefault();
  };

  /**
   * Open/close rides the `open` property (attribute-driven opens included —
   * a declarative `<tk-cookie-banner open>` IS the initial-open form). Both
   * paths are SYNCHRONOUS (no exit animation under the frozen no-motion
   * ruling — there is no await to re-validate, so no transition generation:
   * the navbar mold's race window cannot open here). The dispatch is
   * flip-only (the §9 change-guard, asserted with the listener attached
   * BEFORE connect).
   */
  override updated(changed: PropertyValues<this>): void {
    if ((changed.has('label') || changed.has('acceptLabel')) && this.#card) {
      this.#syncCardName();
      this.#renderCard();
    }
    if (!changed.has('open')) return;
    const wasOpen = changed.get('open');
    const flipped = wasOpen !== undefined && wasOpen !== this.open;
    if (this.open) {
      this.#openCard(flipped);
    } else {
      this.#closeCard(flipped);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown (the navbar/select mold): reset the state flag, then
    // release synchronously — no focus churn, no dispatch (an event from a
    // leaving element has no meaningful consumer; the follow-up update finds
    // nothing mounted).
    this.open = false;
    this.#releaseCard();
  }

  // --- card (generated shadow-tree child, controller-mounted) ---------------

  /** The effective accessible name: the label, else the default constant. */
  #effectiveLabel(): string {
    return this.label != null && this.label.length > 0
      ? this.label
      : TK_COOKIE_BANNER_DEFAULT_LABEL;
  }

  /** The effective accept label: the prop, else the default constant. */
  #effectiveAcceptLabel(): string {
    return this.acceptLabel != null && this.acceptLabel.length > 0
      ? this.acceptLabel
      : TK_COOKIE_BANNER_DEFAULT_ACCEPT_LABEL;
  }

  /**
   * The generated card: role=dialog (aria-modal deliberately ABSENT — the
   * non-modal contract), own shadow root (styles + accept button + message
   * slot), hidden until open. Eagerly creatable so name sync has a target;
   * appended OUTSIDE Lit's template markers (the select mold) so the
   * controller's fallback reparenting never fights the template.
   */
  #getCard(): HTMLDivElement {
    if (this.#card) return this.#card;
    const card = document.createElement('div');
    card.setAttribute('role', 'dialog');
    card.hidden = true;
    this.#syncCardNameOn(card);
    card.attachShadow({ mode: 'open' });
    // The card's LIGHT child: the forwarding slot. It lives in THIS
    // element's shadow tree, so it gathers the host's light DOM (the
    // consumer's message); the message slot inside the card's shadow root
    // picks the forwarder up (the modal's forwarding-chain mold).
    render(html`<slot></slot>`, card);
    this.renderRoot.appendChild(card);
    this.#card = card;
    this.#renderCard();
    return card;
  }

  #syncCardName(): void {
    if (this.#card) this.#syncCardNameOn(this.#card);
  }

  #syncCardNameOn(card: HTMLDivElement): void {
    card.setAttribute('aria-label', this.#effectiveLabel());
  }

  /** (Re)renders the card's shadow content — label props are live while open. */
  #renderCard(): void {
    const card = this.#getCard();
    const shadow = card.shadowRoot;
    if (!shadow) return;
    render(
      html`
        <style>${cookieBannerSurfaceStyles.cssText}</style>
        <div class="banner__message"><slot></slot></div>
        <button type="button" class="banner__accept" @click=${this.#handleAccept}>
          <span class="banner__accept-pill">${this.#effectiveAcceptLabel()}</span>
        </button>
      `,
      shadow,
    );
  }

  #acceptButton(): HTMLButtonElement | null {
    return (
      this.#card?.shadowRoot?.querySelector<HTMLButtonElement>('.banner__accept') ?? null
    );
  }

  /**
   * The ONLY interactive path: `consent-choice` (§3 bare verb, no payload —
   * the load-more mold) and NOTHING else — no close, no focus move, no
   * state. The consumer records consent (storage is THEIRS) and flips
   * `open`; focus stays on the button either way (a native click keeps it).
   */
  readonly #handleAccept = (): void => {
    this.dispatchEvent(
      new CustomEvent('consent-choice', {
        composed: true,
        bubbles: true,
      }),
    );
  };

  /**
   * OPEN (synchronous — the card is generated, so no render await and no
   * race window): mount on the controller's MODAL layer (top-layer with
   * fallback; scrimless — nothing else is acquired), snapshot the opener,
   * focus the accept button, then dispatch `open-change(true)` post-mount.
   */
  #openCard(flipped: boolean): void {
    const card = this.#getCard();
    this.#renderCard(); // label props may have changed while closed
    if (this.#overlayHandle) {
      // Already mounted (a re-entrant update) — nothing to acquire.
      if (flipped && this.isConnected) this.#emitOpenChange(true);
      return;
    }
    card.hidden = false;
    this.#overlayHandle = mountOverlay(card, 'modal');
    document.addEventListener('keydown', this.#onDocumentKeydown, { capture: true });
    // Snapshot BEFORE moving focus (the trap module's capture order). Host
    // level, like the trap's: a shadow-nested opener degrades to its host.
    this.#previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.#acceptButton()?.focus({ preventScroll: true });
    if (flipped && this.isConnected) this.#emitOpenChange(true);
  }

  /**
   * CLOSE: release the mount synchronously (no exit animation — the frozen
   * no-motion ruling), re-home the card into the shadow tree (the container
   * fallback detaches it), restore focus when it is still relevant, then
   * dispatch `open-change(false)` post-release. Idempotent — a close with
   * nothing mounted (the disconnect path already released) only echoes.
   */
  #closeCard(flipped: boolean): void {
    if (!this.#overlayHandle) {
      if (flipped && this.isConnected) this.#emitOpenChange(false);
      return;
    }
    this.#releaseCard();
    if (flipped && this.isConnected) this.#emitOpenChange(false);
  }

  /**
   * Releases everything the open path acquired (idempotent): the document
   * Esc listener, the controller mount; the card re-homes into the shadow
   * tree and hides. Focus returns to the opener only when it is still
   * connected AND focus currently sits inside the banner's composed subtree
   * (non-modal pages are interactive — a consumer closing from elsewhere
   * must not be yanked; the deliberate refinement over the trap's
   * unconditional restore, recorded in NOTES.md).
   */
  #releaseCard(): void {
    // Whether focus sits inside the banner must be sampled BEFORE the mount
    // releases and the card hides — blurring the focused descendant on
    // hidden=true would erase the signal this restore keys on.
    const focusInside = this.#focusInsideBanner();
    document.removeEventListener('keydown', this.#onDocumentKeydown, { capture: true });
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const card = this.#card;
    if (card) {
      if (!card.isConnected) this.renderRoot.appendChild(card);
      card.hidden = true;
    }
    const prior = this.#previouslyFocused;
    this.#previouslyFocused = null;
    if (prior && prior.isConnected && focusInside) {
      prior.focus();
    }
  }

  /** Document-level activeElement is the card host while focus is inside its shadow root. */
  #focusInsideBanner(): boolean {
    const active = document.activeElement;
    if (!(active instanceof Node)) return false;
    return active === this.#card || this.contains(active);
  }

  #emitOpenChange(value: boolean): void {
    this.dispatchEvent(
      new CustomEvent<TkCookieBannerOpenChangeDetail>('open-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  // --- render -------------------------------------------------------------------

  override render() {
    // The host renders nothing of its own — the card is generated (see
    // #getCard); the forwarding slot lives inside it.
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-cookie-banner': TkCookieBanner;
  }
}

if (!customElements.get('tk-cookie-banner')) {
  customElements.define('tk-cookie-banner', TkCookieBanner);
}
