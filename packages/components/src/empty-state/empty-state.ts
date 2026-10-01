import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import { emptyStateStyles } from './empty-state.css.js';

/**
 * tk-empty-state — the «nothing here yet» block (spec 21.3, invest
 * foundation wave): a decorative disc, a heading, a supporting line and
 * an action, centered as a vertical stack. The atom paints NO card —
 * the favorites grounding draws the card at the consumer level, and the
 * admin-table compact lives in docs patterns, not in the element.
 *
 * The action is a SLOT, not a prop: the live grounding carries a TEXT
 * LINK as the CTA (favorites «Добавить бумаги»), and a button fits the
 * same mechanism — the element never assumes which one the consumer
 * needs (the composition discipline every passive card shares).
 *
 * STATELESS (the display-component mold): no channel, nothing
 * dispatches — the event-map no-entry case (tk-service-card precedent).
 * No keyboard contract: nothing focusable lives here; the slotted
 * action carries its own native focus. SSR-compat (AD-10): rendered
 * via Lit templates only.
 *
 * @tag tk-empty-state
 * @prop {string} [heading] - Block heading (heading-6); the `heading` slot overrides.
 * @slot icon - Decorative glyph inside the disc (the container is aria-hidden — nothing announced).
 * @slot heading - Overrides the `heading` prop.
 * @slot description - The supporting line (body-m, secondary); renders only
 *   while carrying content — an empty flex item would fake the rhythm.
 * @slot action - The CTA — a tk-link per the live grounding; a button fits the same slot.
 */
export class TkEmptyState extends LitElement {
  static override readonly styles = [emptyStateStyles];

  /** Block heading — string DATA (never reflects); the `heading` slot overrides it. */
  @property({ type: String })
  heading?: string;

  /** Slot-assignment tracking: a named slot's content overrides its prop (tk-service-card pattern). */
  #headingSlotted = false;
  #descriptionSlotted = false;

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
    return html`
      <div class="es">
        <div class="es__disc" aria-hidden="true">
          <slot name="icon"></slot>
        </div>
        <div class="es__text">
          ${hasHeading
            ? html`<h3 class="es__heading">
                <slot name="heading" @slotchange=${this.#handleHeadingSlotChange}>${this.heading}</slot>
              </h3>`
            : html`<slot name="heading" @slotchange=${this.#handleHeadingSlotChange} hidden></slot>`}
          ${this.#descriptionSlotted
            ? html`<div class="es__description">
                <slot name="description" @slotchange=${this.#handleDescriptionSlotChange}></slot>
              </div>`
            : html`<slot name="description" @slotchange=${this.#handleDescriptionSlotChange} hidden></slot>`}
        </div>
        <div class="es__action">
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-empty-state': TkEmptyState;
  }
}

if (!customElements.get('tk-empty-state')) {
  customElements.define('tk-empty-state', TkEmptyState);
}
