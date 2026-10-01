import { LitElement, html } from 'lit';

import { accordionStyles } from './accordion.css.js';

/**
 * tk-accordion — the kit's Accordion container (spec 21.1, invest foundation
 * wave GAP-MAP A1).
 *
 * A vertical list of `<tk-accordion-item>` disclosure rows — the invest
 * surface's most repeated block (bonds/etfs catalog FAQs, the SBER
 * «Частые вопросы» card, account/IIS and IPO FAQ pages — 4 independent
 * reports in the captures-v4 recon). The container owns ONLY the
 * between-rows hairline rhythm («between, not around»: every slotted item
 * but the last carries the divider); everything interactive lives on the
 * item (the real `<button>` header, `aria-expanded`, the `open` /
 * `open-change` §9 channel).
 *
 * NO container role by design: the list is plain flow content and each row
 * is its own disclosure — the APG accordion needs no list semantics here,
 * and a bare grouping keeps the items linearly readable (the live pages'
 * screen-reader reality).
 *
 * The white bordered card some live FAQ blocks sit in (SBER) is the
 * consumer's pattern wrapper, NOT an atom mode — the atom paints bare rows
 * on the surrounding surface (bonds grounding); see the css header's
 * capture→token table for the recorded AC3 deviation note.
 *
 * @tag tk-accordion
 * @slot - The rows: tk-accordion-item elements, authored in order.
 */
export class TkAccordion extends LitElement {
  static override readonly styles = [accordionStyles];

  override render() {
    return html`
      <div class="accordion">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-accordion': TkAccordion;
  }
}

if (!customElements.get('tk-accordion')) {
  customElements.define('tk-accordion', TkAccordion);
}
