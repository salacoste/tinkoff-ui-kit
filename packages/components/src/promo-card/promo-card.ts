import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { promoCardStyles } from './promo-card.css.js';

/** Card tint union — the five reference marketing surfaces (EXPERIENCE PromoCard). */
export type TkPromoCardVariant = 'gray' | 'bluegray' | 'mint' | 'beige' | 'charcoal';

/** Art placement union — art TOP inside the padding (top) or the full-bleed BOTTOM zone (bleed, Story 10.3). */
export type TkPromoArtMode = 'top' | 'bleed';

/**
 * tk-promo-card — the tinted marketing card (Story 3.6): pastel surface,
 * radius-xxl, art slot TOP, heading/description (props or same-named slots),
 * and a WHITE PILL CTA bottom-center — the CTA is the CONSUMER's slotted
 * tk-button secondary; the CARD itself is PASSIVE (composition discipline:
 * cards are not clickable — the CTA carries the action).
 *
 * TINT AUTO-PAIRING (the spec's core mechanism): the `variant` decides the
 * pairing through PER-TINT TOKEN CONSUMPTION — pastels (gray/bluegray/mint/
 * beige) paint text-primary/text-secondary, charcoal paints white — zero
 * theme branches beyond the token layer (AD-3): the same rules restyle when
 * the dark layer overrides the tint tokens.
 *
 * ART SLOT LAZY ENFORCEMENT (EXPERIENCE: «art slot lazy-loads» — the noted
 * slotchange technique): slotted content belongs to the consumer, so the
 * card cannot put attributes on it from a template. On every `slotchange`
 * of the art slot the element walks the assigned elements and SETS
 * `loading="lazy" decoding="async"` on every projected `<img>` (directly
 * slotted or at any nesting depth) — enforcement, not a default: the
 * reference's below-fold promo art never blocks the first paint. The same
 * handler toggles the `data-has-art` host attribute so the art zone
 * collapses when nothing is slotted (see the css header).
 *
 * ART MODE (Story 10.3, CSS-ONLY): `art-mode="bleed"` re-styles the SAME
 * anatomy — the art zone flex-orders BELOW the body, escapes the card
 * padding on negative margins that track the padding hooks, and clips to
 * the card's bottom corners; the actions zone becomes the reference's
 * floating pill (absolute overlay pinned bottom-center OVER the art, white
 * in both themes via the charcoal re-scope pair). The template/DOM does
 * not change; `top` (the default, attribute absent) renders byte-identical
 * to the pre-10.3 card. Probe-gated numbers live in the css header (pill
 * bottom offset space-32 Δ=0; NO scrim — zero text-over-art in the
 * reference captures).
 *
 * SKELETON (the shared card pattern, EXPERIENCE State Patterns): the
 * `skeleton` boolean replaces the content with border-default placeholder
 * blocks matching the final layout (art block, heading line, description
 * lines, CTA pill; light value = gray-200's hex, dark = the white-alpha
 * tonal step — Story 5.4). The blocks are STATIC — no shimmer animation
 * exists, so the
 * reduced-motion path is trivially the same render (noted; motion tokens
 * stay unconsumed).
 *
 * STATELESS (the display-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry case (tk-footer precedent).
 * SSR-compat (AD-10): rendered via Lit templates only; the slotchange
 * listener is event-driven post-mount access, never construction-time.
 *
 * @tag tk-promo-card
 * @attr {gray|bluegray|mint|beige|charcoal} variant - Tint variant; also decides text pairing (default `gray`).
 * @attr {top|bleed} art-mode - Art placement: `top` (default) inside the padding above the body, or `bleed` — the full-bleed bottom zone with the floating-pill actions overlay (CSS-only mode; invalid clamps to `top`).
 * @attr {boolean} skeleton - Border-default placeholder blocks matching the final layout (light value = gray-200's hex).
 * @prop {string} [heading] - Card heading (heading-5); the `heading` slot overrides.
 * @prop {string} [description] - Card description (body-m); the `description` slot overrides.
 * @slot art - Card art, TOP (projected imgs get loading=lazy decoding=async enforced).
 * @slot heading - Overrides the `heading` prop.
 * @slot description - Overrides the `description` prop.
 * @slot actions - The CTA (compose a tk-button secondary — white pill); pinned bottom-center.
 */
export class TkPromoCard extends LitElement {
  /** Tint variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['gray', 'bluegray', 'mint', 'beige', 'charcoal'] as const;

  /** Art placement union (Story 10.3) — the same CONVENTIONS §2 literal-union mold. */
  static readonly artModes = ['top', 'bleed'] as const;

  /** Tint variant — also decides the text pairing (dark text on pastels, white on charcoal). */
  @property({ reflect: true })
  variant: TkPromoCardVariant = 'gray';

  /** Art placement: `top` (default) or the CSS-only `bleed` mode (full-bleed bottom zone, floating-pill actions overlay).
   * The attribute pin is REQUIRED for the kebab name — Lit's default reflect lowercases
   * without kebabbing (`artmode`), and the CSS gate is `[art-mode='bleed']`
   * (the pagination `show-more` reflect precedent). */
  @property({ reflect: true, attribute: 'art-mode' })
  artMode: TkPromoArtMode = 'top';

  /** Card heading — string DATA (never reflects); the `heading` slot overrides it. */
  @property({ type: String })
  heading?: string;

  /** Card description — string DATA (never reflects); the `description` slot overrides it. */
  @property({ type: String })
  description?: string;

  /** Skeleton state: border-default placeholder blocks matching the final layout (light value = gray-200's hex). */
  @property({ type: Boolean, reflect: true })
  skeleton = false;

  static override readonly styles = [promoCardStyles];

  /** Slot-assignment tracking: a named slot's content overrides its prop (Lit fallback cannot see it). */
  #headingSlotted = false;
  #descriptionSlotted = false;

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy (tk-button/tk-link mold):
   * an invalid `variant` degrades to the union default `gray`, never throws;
   * the reflected attribute is corrected so the DOM shows the value in force.
   * The same mold clamps `artMode` to `top` (Story 10.3).
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkPromoCard.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'gray';
    }
    if (changed.has('artMode') && !(TkPromoCard.artModes as readonly string[]).includes(this.artMode)) {
      this.artMode = 'top';
    }
  }

  /** A slot carries projectable content when an element or non-empty text is assigned (tk-button name-guard check). */
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
   * Lazy enforcement on the art slot (the spec's noted technique): every img
   * projected into the slot — directly slotted or at ANY nesting depth inside
   * a wrapper (querySelectorAll walks the whole assigned subtree) — gets
   * `loading="lazy" decoding="async"` SET. Slot content is the consumer's;
   * slotchange is the only hook that sees it.
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
   * art zone (no slotted art → the zone stays display:none with no stray
   * margin; the attribute pick over :has() is recorded in the css header).
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
          <div class="sk sk--art" aria-hidden="true"></div>
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
    'tk-promo-card': TkPromoCard;
  }
}

if (!customElements.get('tk-promo-card')) {
  customElements.define('tk-promo-card', TkPromoCard);
}
