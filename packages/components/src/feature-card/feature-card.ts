import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { featureCardStyles } from './feature-card.css.js';

/** Card tint union — `editorial` is the charcoal editorial variant (the reference's slate banners). */
export type TkFeatureCardVariant = 'gray' | 'bluegray' | 'mint' | 'beige' | 'editorial';

/**
 * tk-feature-card — the 2-up large marketing card (Story 3.7): radius-xxl,
 * min-height 320, heading-4 scale, and the CHARCOAL EDITORIAL variant
 * (white heading, white pill CTA, art BLEEDING RIGHT) — the reference's
 * «Платинум»/«Т-Ж» banner register. Inherits tk-promo-card's patterns
 * (epic dependency order): tint auto-pairing via per-tint token
 * consumption, passive card + consumer-slotted CTA, the shared skeleton
 * pattern, and the slotchange lazy-enforcement technique on the art slot.
 *
 * EDITORIAL BLEED (the spec's grid pick, noted over absolute positioning):
 * the editorial variant swaps the flex column for a two-column GRID — the
 * body (padded) in column 1, the art in column 2 stretching to the card's
 * RIGHT EDGE (card padding collapses to 0 on that variant, the art zone
 * self-aligns end and the card's border-radius + overflow clip crop the
 * bleed). `editorial` consumes `--tk-color-tint-charcoal` and paints the
 * WHITE pairing — the same pairing machinery as promo-card's charcoal.
 *
 * STATELESS (the display-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry case (tk-promo-card
 * precedent). SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-feature-card
 * @attr {gray|bluegray|mint|beige|editorial} variant - Tint variant; `editorial` = charcoal with right-bleed art (default `gray`).
 * @attr {boolean} skeleton - Border-default placeholder blocks matching the final layout (light value = gray-200's hex).
 * @prop {string} [heading] - Card heading (heading-4); the `heading` slot overrides.
 * @prop {string} [description] - Card description (body-m); the `description` slot overrides.
 * @slot art - Card art; TOP on tint variants, RIGHT-BLEED column on editorial (imgs lazy-enforced).
 * @slot heading - Overrides the `heading` prop.
 * @slot description - Overrides the `description` prop.
 * @slot actions - The CTA (compose a tk-button secondary — white pill); pinned bottom-start, start-aligned on editorial.
 */
export class TkFeatureCard extends LitElement {
  /** Tint variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['gray', 'bluegray', 'mint', 'beige', 'editorial'] as const;

  /** Tint variant — `editorial` is the charcoal register with right-bleed art. */
  @property({ reflect: true })
  variant: TkFeatureCardVariant = 'gray';

  /** Card heading — string DATA (never reflects); the `heading` slot overrides it. */
  @property({ type: String })
  heading?: string;

  /** Card description — string DATA (never reflects); the `description` slot overrides it. */
  @property({ type: String })
  description?: string;

  /** Skeleton state: border-default placeholder blocks matching the final layout (light value = gray-200's hex). */
  @property({ type: Boolean, reflect: true })
  skeleton = false;

  static override readonly styles = [featureCardStyles];

  /** Slot-assignment tracking: a named slot's content overrides its prop (tk-promo-card pattern). */
  #headingSlotted = false;
  #descriptionSlotted = false;

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default `gray` (never throws), reflected
   * attribute corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkFeatureCard.variants as readonly string[]).includes(this.variant)) {
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

  /**
   * Lazy enforcement on the art slot (the spec's noted slotchange technique
   * — see tk-promo-card): every img projected into the slot — directly
   * slotted or at ANY nesting depth inside a wrapper (querySelectorAll
   * walks the whole assigned subtree) — gets `loading="lazy"
   * decoding="async"` SET.
   */
  #enforceLazyArt(slot: HTMLSlotElement): void {
    for (const node of slot.assignedElements({ flatten: true })) {
      const images =
        node instanceof HTMLImageElement ? [node] : [...node.querySelectorAll<HTMLImageElement>('img')];
      for (const image of images) {
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
      }
    }
  }

  /**
   * Art slotchange does double duty: lazy-enforces slotted imgs AND toggles
   * the `data-has-art` host attribute — the styling hook that expands the
   * art zone and opens the editorial bleed column (no slotted art → zone
   * stays display:none, editorial stays single-column; the attribute pick
   * over :has() is recorded in the css header).
   */
  #handleArtSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this.toggleAttribute('data-has-art', slot.assignedElements({ flatten: true }).length > 0);
    this.#enforceLazyArt(slot);
  }

  override render() {
    if (this.skeleton) {
      return html`
        <article class="card" aria-busy="true">
          <div class="sk sk--heading" aria-hidden="true"></div>
          <div class="sk sk--line" aria-hidden="true"></div>
          <div class="sk sk--line" aria-hidden="true"></div>
          <div class="sk sk--cta" aria-hidden="true"></div>
        </article>
      `;
    }
    const hasHeading = this.#headingSlotted || (this.heading ?? '').length > 0;
    const hasDescription = this.#descriptionSlotted || (this.description ?? '').length > 0;
    return html`
      <article class="card">
        <div class="card__art">
          <slot name="art" @slotchange=${this.#handleArtSlotChange}></slot>
        </div>
        <div class="card__body">
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
            : html`<slot
                name="description"
                @slotchange=${this.#handleDescriptionSlotChange}
                hidden
              ></slot>`}
          <div class="card__actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-feature-card': TkFeatureCard;
  }
}

if (!customElements.get('tk-feature-card')) {
  customElements.define('tk-feature-card', TkFeatureCard);
}
