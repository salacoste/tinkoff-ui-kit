import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { serviceCardStyles } from './service-card.css.js';

/** Card tint union — the five reference marketing surfaces (EXPERIENCE ServiceCard). */
export type TkServiceCardVariant = 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';

/**
 * tk-service-card — the compact directory card (Story 3.8): radius-xl,
 * padding space-24, a small DECORATIVE icon slot (the component sets
 * aria-hidden on the icon CONTAINER — the projected 3D tile is decoration,
 * the text carries the meaning), heading/description, and the TEXT LINK
 * pinned to the card bottom across description lengths (flex column +
 * margin-top:auto on the actions zone — the consumer's slotted tk-link is
 * the ACTION; the card itself is passive, the composition discipline every
 * card shares).
 *
 * Tint auto-pairing and the flat tinted surface follow the tk-promo-card
 * machinery (per-tint token consumption, charcoal → white, no shadows).
 * NO skeleton state: EXPERIENCE names skeletons for ArticleCard and
 * PromoCard content only — the service card is a static directory entry.
 *
 * STATELESS (the display-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry case (tk-promo-card
 * precedent). SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-service-card
 * @attr {gray|bluegray|mint|beige|charcoal} variant - Tint variant; also decides text pairing (default `gray`).
 * @prop {string} [heading] - Card heading (heading-5); the `heading` slot overrides.
 * @prop {string} [description] - Card description (body-m); the `description` slot overrides.
 * @slot icon - Decorative icon tile (the container is aria-hidden — nothing announced).
 * @slot heading - Overrides the `heading` prop.
 * @slot description - Overrides the `description` prop.
 * @slot actions - The text link (compose a tk-link standalone); pinned bottom across description lengths.
 */
export class TkServiceCard extends LitElement {
  /** Tint variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['gray', 'bluegray', 'mint', 'beige', 'charcoal'] as const;

  /** Tint variant — also decides the text pairing (dark text on pastels, white on charcoal). */
  @property({ reflect: true })
  variant: TkServiceCardVariant = 'gray';

  /** Card heading — string DATA (never reflects); the `heading` slot overrides it. */
  @property({ type: String })
  heading?: string;

  /** Card description — string DATA (never reflects); the `description` slot overrides it. */
  @property({ type: String })
  description?: string;

  static override readonly styles = [serviceCardStyles];

  /** Slot-assignment tracking: a named slot's content overrides its prop (tk-promo-card pattern). */
  #headingSlotted = false;
  #descriptionSlotted = false;

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default `gray` (never throws), reflected
   * attribute corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkServiceCard.variants as readonly string[]).includes(this.variant)) {
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
    const hasHeading = this.#headingSlotted || (this.heading ?? '').length > 0;
    const hasDescription = this.#descriptionSlotted || (this.description ?? '').length > 0;
    return html`
      <article class="card">
        <div class="card__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </div>
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
        <div class="card__actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-service-card': TkServiceCard;
  }
}

if (!customElements.get('tk-service-card')) {
  customElements.define('tk-service-card', TkServiceCard);
}
