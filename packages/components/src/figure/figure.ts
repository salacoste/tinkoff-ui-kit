import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import { figureStyles } from './figure.css.js';

/**
 * tk-figure — the captioned media block (spec 24.7, pattern wave 24a):
 * the B6 (gap-8 research iframes) + A8 (gap-5 terminal videos) FUSION —
 * ONE shape, a passive figure frame around slot-borne media (iframe /
 * img / video) with an optional caption. The ONLY new atom of the wave:
 * everything else the longread needs already exists.
 *
 * WHAT THE ATOM OWNS: the aspect box (the --tk-figure-ratio hook, 16/9
 * default — the live embed shape), the radius, the muted backdrop while
 * the media loads, and the caption line. WHAT IT DOES NOT: the media
 * itself (slot), its accessible name (the CONSUMER titles iframes — the
 * title never rides the frame), any state (STATELESS — zero events, the
 * display-component mold; no event-map entry by design).
 *
 * LAZY ENFORCEMENT (the promo-card art mold, extended to iframes): every
 * iframe slotted into media gets loading=lazy SET; every img — directly
 * or at ANY nesting depth inside a wrapper — gets loading=lazy AND
 * decoding=async. Third-party embeds must never block the first paint of
 * a page that merely mentions them.
 *
 * CAPTION PRESENCE (the feature-card mold): the figcaption renders only
 * while the caption carries content — the prop, or slotted caption
 * content that overrides it; neither → no caption node at all (an empty
 * figcaption would fake the rhythm and double-announce).
 *
 * SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-figure
 * @prop {string} [caption] - Caption line; the `caption` slot overrides.
 * @slot media - The media itself (iframe / img / video) — lazy-enforced.
 * @slot caption - Overrides the `caption` prop (presence-molded).
 */
export class TkFigure extends LitElement {
  static override readonly styles = [figureStyles];

  /** Caption text — string DATA (never reflects); the `caption` slot overrides it. */
  @property({ type: String })
  caption?: string;

  /** Slot-assignment tracking: slotted caption content overrides the prop (feature-card mold). */
  #captionSlotted = false;

  /** A slot carries projectable content when an element or non-empty text is assigned. */
  #slotHasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some(
      (node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
  }

  #handleCaptionSlotChange(event: Event): void {
    this.#captionSlotted = this.#slotHasContent(event.target as HTMLSlotElement);
    this.requestUpdate();
  }

  /**
   * Lazy enforcement over the media slot (the promo-card art technique,
   * extended): iframes get loading=lazy; imgs at ANY nesting depth get
   * loading=lazy + decoding=async. SET attribute (not the property) so it
   * works on elements the consumer created however they like.
   */
  #enforceLazyMedia(slot: HTMLSlotElement): void {
    for (const node of slot.assignedElements({ flatten: true })) {
      if (node instanceof HTMLIFrameElement) {
        node.setAttribute('loading', 'lazy');
        continue;
      }
      for (const frame of node.querySelectorAll('iframe')) {
        frame.setAttribute('loading', 'lazy');
      }
      if (node instanceof HTMLImageElement) {
        node.setAttribute('loading', 'lazy');
        node.setAttribute('decoding', 'async');
      }
      for (const image of node.querySelectorAll('img')) {
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
      }
    }
  }

  #handleMediaSlotChange(event: Event): void {
    this.#enforceLazyMedia(event.target as HTMLSlotElement);
  }

  override firstUpdated(): void {
    // The initial assignment does not reliably fire slotchange (the
    // badge / empty-state lesson) — sweep once from the inside.
    const media = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="media"]');
    if (media) this.#enforceLazyMedia(media);
  }

  override render() {
    const hasCaption = this.#captionSlotted || (this.caption ?? '').length > 0;
    return html`
      <figure class="figure">
        <div class="figure__media">
          <slot name="media" @slotchange=${this.#handleMediaSlotChange}></slot>
        </div>
        ${hasCaption
          ? html`<figcaption class="figure__caption">
              <slot name="caption" @slotchange=${this.#handleCaptionSlotChange}>${this.caption}</slot>
            </figcaption>`
          : html`<slot name="caption" @slotchange=${this.#handleCaptionSlotChange} hidden></slot>`}
      </figure>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-figure': TkFigure;
  }
}

if (!customElements.get('tk-figure')) {
  customElements.define('tk-figure', TkFigure);
}
