import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import { publisherHeaderStyles } from './publisher-header.css.js';

/**
 * tk-publisher-header — the «Профиль в Пульсе» publisher row of the
 * instrument pages (spec 23.2, invest remainder wave, GAP-MAP B14):
 * avatar disc + name line (with verification chips) + subscriber meta +
 * the consumer's follow action. STATELESS (the tk-footer precedent —
 * event-map no-entry): the subscription is consumer state, the kit
 * places a slot button and owns nothing else.
 *
 * PIXEL GROUNDING (sber capture .playwright-cli/captures-v4/invest/
 * stock-sber.png, row y1227–1270 — the full probe table lives in the
 * sheet header): d35 avatar disc, heading-6 bold name, two d18
 * verification chips on the name line (green/blue glyph+ring pairs —
 * minted invest-badge tokens), body-s gray meta, the 124×44 primary
 * pill flush right.
 *
 * SLOT POLICY (AC3 letter vs execution, recorded): the spec's «kit
 * draws the chip carriers» rides the hero-action mold instead — a
 * REPEATABLE bare `badge` slot (the kit owns the rail and its measured
 * 2px gap; every chip — ring + glyph — is consumer content on the
 * kit's invest-badge token pairs). One slot cannot distribute into
 * multiple shadow wrappers in Lit, and wrapping the pair into one chip
 * would erase the measured two-disc anatomy; the story ships canonical
 * token-painted chips as the first consumer.
 *
 * A11y: a plain layout region — no role self-assert (the name slot is
 * the consumer's heading channel); nothing interactive of the kit's own
 * (the action button brings its own semantics); static by definition,
 * zero motion.
 *
 * @tag tk-publisher-header
 * @attr {string} name - Publisher name (the name slot overrides it — slot a heading for document semantics).
 * @attr {string} meta - Subscriber line («133,1K подписчиков» shape — consumer-formatted, the kit never formats counters); the meta slot overrides it.
 * @slot avatar - The avatar image/svg (the kit paints the measured pale disc as the placeholder).
 * @slot name - Overrides the name prop.
 * @slot badge - Verification chips (repeatable — slot as many as the page shows; ring+glyph ride the invest-badge tokens).
 * @slot meta - Overrides the meta prop.
 * @slot action - The follow button (tk-button primary) — consumer state, kit-owned layout only.
 */
export class TkPublisherHeader extends LitElement {
  static override readonly styles = [publisherHeaderStyles];

  /** Publisher name — the name slot's fallback (slotted content wins). */
  @property({ type: String })
  name = '';

  /** Subscriber meta — consumer-formatted string; the meta slot wins. */
  @property({ type: String })
  meta = '';

  /** Whether the meta slot carries real content (the presence mold). */
  #metaSlotted = false;

  #handleMetaSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this.#metaSlotted = (slot?.assignedNodes({ flatten: true }) ?? []).some(
      (n) => n.nodeType === 1 || (n.textContent ?? '').trim().length > 0,
    );
    this.requestUpdate();
  }

  override render() {
    const meta = this.#metaSlotted || this.meta ? this.meta : null;
    return html`
      <div class="publisher-header__avatar"><slot name="avatar"></slot></div>
      <div class="publisher-header__body">
        <div class="publisher-header__name-line">
          <div class="publisher-header__name"><slot name="name">${this.name}</slot></div>
          <div class="publisher-header__badges"><slot name="badge"></slot></div>
        </div>
        ${meta !== null || this.#metaSlotted
          ? html`<div class="publisher-header__meta">
              <slot name="meta" @slotchange=${this.#handleMetaSlotChange}>${this.meta}</slot>
            </div>`
          : html`<slot name="meta" @slotchange=${this.#handleMetaSlotChange} hidden></slot>`}
      </div>
      <div class="publisher-header__action"><slot name="action"></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-publisher-header': TkPublisherHeader;
  }
}

if (!customElements.get('tk-publisher-header')) {
  customElements.define('tk-publisher-header', TkPublisherHeader);
}
