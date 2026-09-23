import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { articleCardStyles } from './article-card.css.js';

/** Card tint union — the five reference marketing surfaces (EXPERIENCE ArticleCard). */
export type TkArticleCardVariant = 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';

/**
 * tk-article-card — the text-only media card (Story 3.9): 2-line clamped
 * title, description, and the «Читать» link covering the WHOLE CARD via a
 * ::after stitch — ONE tab stop, ONE click target, the card never carries
 * the action itself (composition discipline's other face: here the link
 * legitimately owns the entire surface).
 *
 * THE STITCH (the spec's Design Notes pick): `.card__link::after {
 * position: absolute; inset: 0 }` over the position:relative card. The
 * pseudo-element belongs to the ANCHOR, so clicks anywhere on the card hit
 * the anchor and navigate natively — the reason the link is a NATIVE
 * `<a>` in this element's shadow root (the tk-footer anchor precedent),
 * not a nested tk-link: a custom element's pseudo would land clicks on
 * the HOST, and the host is not the navigating anchor. The link carries
 * the kit's link affordance (semantic token, underline on hover and
 * keyboard focus — the tk-link language).
 *
 * Tint auto-pairing and the flat tinted surface follow the tk-promo-card
 * machinery (per-tint token consumption, charcoal → white, no shadows).
 * SKELETON state: EXPERIENCE names ArticleCard skeletons — the shared
 * gray-200 block pattern, static under reduced motion (no animation
 * exists; noted).
 *
 * STATELESS (the display-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry case. SSR-compat (AD-10):
 * rendered via Lit templates only.
 *
 * @tag tk-article-card
 * @attr {gray|bluegray|mint|beige|charcoal} variant - Tint variant; also decides text pairing (default `gray`).
 * @attr {boolean} skeleton - Gray-200 placeholder blocks matching the final layout.
 * @prop {string} [heading] - Card title (heading-6, line-clamp 2); the `heading` slot overrides.
 * @prop {string} [description] - Card description (body-m); the `description` slot overrides.
 * @prop {string} [href] - Navigation target for the whole-card «Читать» link.
 * @prop {string} [linkLabel] - Link label (default «Читать»).
 * @slot heading - Overrides the `heading` prop.
 * @slot description - Overrides the `description` prop.
 */
export class TkArticleCard extends LitElement {
  /** Tint variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['gray', 'bluegray', 'mint', 'beige', 'charcoal'] as const;

  /** Tint variant — also decides the text pairing (dark text on pastels, white on charcoal). */
  @property({ reflect: true })
  variant: TkArticleCardVariant = 'gray';

  /** Card title — string DATA (never reflects); the `heading` slot overrides it. */
  @property({ type: String })
  heading?: string;

  /** Card description — string DATA (never reflects); the `description` slot overrides it. */
  @property({ type: String })
  description?: string;

  /** Navigation target for the whole-card link (string DATA — never reflects). */
  @property({ type: String })
  href?: string;

  /** Link label — the reference's «Читать»; overridable for other registers. */
  @property({ type: String, attribute: 'link-label' })
  linkLabel = 'Читать';

  /** Skeleton state: gray-200 placeholder blocks matching the final layout. */
  @property({ type: Boolean, reflect: true })
  skeleton = false;

  static override readonly styles = [articleCardStyles];

  /** Slot-assignment tracking: a named slot's content overrides its prop (tk-promo-card pattern). */
  #headingSlotted = false;
  #descriptionSlotted = false;

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default `gray` (never throws), reflected
   * attribute corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkArticleCard.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'gray';
    }
  }

  /** A slot carries projectable content when an element or non-empty text is assigned. */
  #slotHasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some(
      (node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
  }

  #handleHeadingSlotChange(event: Event): void {
    this.#headingSlotted = this.#slotHasContent(event.target as HTMLSlotElement);
    this.requestUpdate();
  }

  #handleDescriptionSlotChange(event: Event): void {
    this.#descriptionSlotted = this.#slotHasContent(event.target as HTMLSlotElement);
    this.requestUpdate();
  }

  override render() {
    if (this.skeleton) {
      return html`
        <article class="card" aria-busy="true">
          <div class="sk sk--title" aria-hidden="true"></div>
          <div class="sk sk--title" aria-hidden="true"></div>
          <div class="sk sk--line" aria-hidden="true"></div>
          <div class="sk sk--line" aria-hidden="true"></div>
          <div class="sk sk--link" aria-hidden="true"></div>
        </article>
      `;
    }
    const hasHeading = this.#headingSlotted || (this.heading ?? '').length > 0;
    const hasDescription = this.#descriptionSlotted || (this.description ?? '').length > 0;
    return html`
      <article class="card">
        ${hasHeading
          ? html`<h3 class="card__heading">
              <slot name="heading" @slotchange=${this.#handleHeadingSlotChange}>${this.heading}</slot>
            </h3>`
          : html`<slot name="heading" @slotchange=${this.#handleHeadingSlotChange} hidden></slot>`}
        ${hasDescription
          ? html`<p class="card__description">
              <slot name="description" @slotchange=${this.#handleDescriptionSlotChange}>
                ${this.description}
              </slot>
            </p>`
          : html`<slot name="description" @slotchange=${this.#handleDescriptionSlotChange} hidden></slot>`}
        <a class="card__link" href=${this.href ?? nothing}>${this.linkLabel}</a>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-article-card': TkArticleCard;
  }
}

if (!customElements.get('tk-article-card')) {
  customElements.define('tk-article-card', TkArticleCard);
}
