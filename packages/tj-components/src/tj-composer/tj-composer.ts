import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { composerStyles } from './tj-composer.css.js';

/**
 * The `open-compose` occurrence event (§9 grammar, the consent-choice/load-more
 * bare-verb mold): NO payload — `detail` stays null, so the React unwrap
 * contract passes the event itself to payload-less handlers.
 *
 * The `TjX…Event` naming opens the ТЖ event-class grammar (CONVENTIONS §4,
 * re-opened on the ТЖ instance by this story): the class IS the dispatch
 * surface — the element dispatches `new TjOpenComposeEvent()`, and consumers
 * may type listeners against the class.
 */
export class TjOpenComposeEvent extends CustomEvent<null> {
  static readonly eventName = 'open-compose' as const;

  constructor() {
    super(TjOpenComposeEvent.eventName, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * tj-composer — the ТЖ community fake-input card (Story 16.4).
 *
 * A BUTTON, not an input: the reference surface is a white card that LOOKS
 * like a text field but OPENS the editor — a real `<textarea>` would promise
 * editing this kit never delivers (the editor is consumer-side by FR/design;
 * the event is the kit's whole contract). A shadow `<button type="button">`
 * carries the ghost text as its accessible name, so Enter/Space activate
 * natively and SR users hear exactly what happens: something opens.
 *
 * Anatomy: (a) an `avatar` slot inside an aria-hidden wrapper — the user's
 * avatar is decorative HERE (identification rides the ghost text; slotted
 * alt text must not pollute the button's name — the 16.3 mark ruling
 * generalized), and (b) the ghost text. Height is DERIVED on-scale:
 * padding-block 24 × 2 + avatar 40 = 88 (the vision band 88–96 brackets it;
 * no height declaration at all). Radius is the one structural FLAG
 * (probe-measured r20; a `--tj-radius-composer` token is a maintainer
 * ratification candidate, NOT minted here).
 *
 * `label` is a STRING CHANNEL (never reflects — the 16.1 bank freeze carried
 * over): the default is the reference copy «Написать пост или вопрос…»; a
 * non-empty label swaps the ghost text (and the button name) verbatim.
 * Empty-string label is the story-documented contract edge: the consumer who
 * empties it names the button themselves — a host `aria-label` forwards to
 * the shadow button verbatim and wins (the consumer-wins rule).
 *
 * Hover = NOTHING (unprobed — no invention). The focus ring is the shipped
 * 16.1/16.3 tj ring mold verbatim (2px focus-ring token, offset 2px, on the
 * card surface). Cursor pointer (native button affordance).
 *
 * STATELESS beyond the dispatch (the simple-component mold): no editor, no
 * open state, no controlled pair — activation changes NOTHING on the element;
 * `open-compose` is the whole contract (the event-map's FIRST ТЖ entry,
 * packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via Lit
 * templates only.
 *
 * @tag tj-composer
 * @prop {string} [label] - Ghost text = the button's accessible name (default «Написать пост или вопрос…»). String channel — never reflects.
 * @slot avatar - The user's avatar image (decorative here — the wrapper is aria-hidden; graceful empty: no phantom circle).
 * @fires open-compose - Occurrence (§3 bare verb, NO payload): the card was pressed (click/Enter/Space) — the consumer opens THEIR editor; composed, bubbles; nothing else mutates.
 */
export class TjComposer extends LitElement {
  /**
   * The ghost text — STRING DATA, never reflects (CONVENTIONS §2); the
   * default is the reference copy. Rendered as the button's content, so it
   * IS the accessible name.
   */
  @property({ type: String })
  label = 'Написать пост или вопрос…';

  /**
   * Host `aria-label` forwarding (the story-documented empty-label contract
   * row): tracked so attribute add/change/remove re-renders; non-empty
   * forwards to the shadow button verbatim and WINS over the content name
   * (native ARIA precedence — consumer intent is never overwritten). The
   * type follows the native ARIIMixin declaration (string | null).
   */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  /** Avatar slot has content (drives the decorative wrapper — graceful empty). */
  #avatarSlotted = false;

  static override readonly styles = [composerStyles];

  #handleAvatarSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const next = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (next !== this.#avatarSlotted) {
      this.#avatarSlotted = next;
      this.requestUpdate();
    }
  }

  // Initial-mount backstop (the tj-rubric-header note, the news-card excerpt
  // mold): the slotchange EVENT is queued inconsistently for the FIRST
  // assignment, so every render re-syncs the tracked presence from the live
  // slot assignment — the hidden catch-slot still receives assignments, so
  // both template branches read the same truth. Change-guarded.
  #syncAvatarPresence(): void {
    const slot = this.renderRoot.querySelector("slot[name='avatar']") as HTMLSlotElement | null;
    const next = this.#slotHasContent(slot);
    if (next !== this.#avatarSlotted) {
      this.#avatarSlotted = next;
      this.requestUpdate();
    }
  }

  // The bank article-card mold: an ELEMENT node counts as content — bare
  // whitespace text nodes do not (template formatting noise).
  #slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
  }

  protected override updated(): void {
    this.#syncAvatarPresence();
  }

  /**
   * The ONLY interactive path (the consent-choice mold): dispatch and change
   * NOTHING — no editor, no state, no focus move. Enter/Space reach here
   * through the native button activation.
   */
  readonly #handleActivate = (): void => {
    this.dispatchEvent(new TjOpenComposeEvent());
  };

  override render() {
    return html`
      <button
        class="composer"
        type="button"
        aria-label=${this.ariaLabel != null && this.ariaLabel.length > 0
          ? this.ariaLabel
          : nothing}
        @click=${this.#handleActivate}
      >
        ${this.#avatarSlotted
          ? html`
              <span class="composer__avatar" aria-hidden="true">
                <slot name="avatar" @slotchange=${this.#handleAvatarSlotchange}></slot>
              </span>
            `
          : html`<slot name="avatar" @slotchange=${this.#handleAvatarSlotchange} hidden></slot>`}
        <span class="composer__label">${this.label}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-composer': TjComposer;
  }
}

if (!customElements.get('tj-composer')) {
  customElements.define('tj-composer', TjComposer);
}
