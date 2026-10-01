import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { accordionItemStyles } from './accordion.css.js';

/**
 * tk-accordion-item — the kit's Accordion row (spec 21.1, invest foundation
 * wave GAP-MAP A1).
 *
 * One disclosure row of a `<tk-accordion>`: a header line (bold question +
 * thin chevron, ≈56–64px on the live site) and a content panel underneath.
 * The live invest surface renders these as JS toggles on `details:0` pages;
 * the kit follows the APG disclosure pattern instead — a real `<button>`
 * header with `aria-expanded`, Enter/Space/click all toggle (the button's
 * native keyboard contract — no keydown handler to duplicate it).
 *
 * SEMANTICS: NO `aria-controls` — the panel is a shadow child whose id is
 * not addressable from light DOM (the tk-select / tk-menu-popover precedent,
 * spec 19.1). The panel carries `role="region"` + an `aria-label` mirrored
 * from the summary slot's text (the APG accordion guidance), and hides via
 * `hidden` while closed — out of the accessibility tree entirely.
 *
 * STATE (CONVENTIONS §9): `open` reflects and flips through the header
 * interaction; `open-change` ({ value }) fires on every actual FLIP —
 * composed, bubbles, silent on the first render pass whatever set `open`
 * (attribute at upgrade, early property assignment) and silent on teardown
 * (the select lifecycle guards, the #hasRenderedOnce idiom of 19.1-5).
 *
 * Rows are INDEPENDENT (the live catalogs' FAQ behavior — each opens on its
 * own); a `single` rotation mode is deliberately out of scope (no live
 * grounding in the captures).
 *
 * @tag tk-accordion-item
 * @attr {boolean} open - Row open state; reflects, flips via the header interaction too.
 * @slot summary - The header line (the question). Falls back to an em-dash when empty.
 * @slot - The panel body (the answer).
 * @fires open-change - `{ value: boolean }` — the §9 declarative channel; composed, bubbles, silent at initial mount.
 */
export class TkAccordionItem extends LitElement {
  static override readonly styles = [accordionItemStyles];

  /** Row open state — the §9 declarative channel (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * True once updated() has run once: the open-change channel stays silent
   * on the FIRST pass whatever set `open` — §9 «nothing at initial mount»
   * (the menu-popover #hasRenderedOnce idiom).
   */
  #hasRenderedOnce = false;

  /** The summary slot's real text — mirrors into the region's aria-label. */
  #summaryText = '';

  override updated(changed: PropertyValues<this>): void {
    const firstPass = !this.#hasRenderedOnce;
    this.#hasRenderedOnce = true;
    if (changed.has('open')) {
      // open-change on an actual FLIP only — never on the first pass, never
      // while detached (quiet teardown, the select lifecycle guards).
      const wasOpen = changed.get('open');
      if (!firstPass && this.isConnected && wasOpen !== undefined && wasOpen !== this.open) {
        this.dispatchEvent(
          new CustomEvent<TkAccordionItemOpenChangeDetail>('open-change', {
            detail: { value: this.open },
            composed: true,
            bubbles: true,
          }),
        );
      }
    }
  }

  override disconnectedCallback(): void {
    // Quiet teardown: an element leaving the tree has no event consumer.
    if (this.open) {
      this.open = false;
    }
    super.disconnectedCallback();
  }

  #handleHeaderClick(): void {
    this.open = !this.open;
  }

  /**
   * Slot presence (the badge rule): REAL content (an element or non-empty
   * text) counts. The trimmed text feeds the region's aria-label; an empty
   * summary degrades to the placeholder label rather than an unnamed
   * region. Checked at firstUpdated AND on every slotchange — the initial
   * assignment does not reliably fire slotchange (the badge lesson).
   */
  #syncSummaryText(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="summary"]');
    const text = (slot?.assignedNodes({ flatten: true }) ?? [])
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();
    if (text !== this.#summaryText) {
      this.#summaryText = text;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncSummaryText();
  }

  #handleSummarySlotChange(): void {
    this.#syncSummaryText();
  }

  override render() {
    return html`
      <div class="item">
        <button class="item__header" type="button" aria-expanded=${this.open ? 'true' : 'false'}
          @click=${this.#handleHeaderClick}
        >
          <span class="item__summary">
            <slot name="summary" @slotchange=${this.#handleSummarySlotChange}></slot>
          </span>
          <span class="item__chevron" aria-hidden="true"
            ><svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9.5l6 6 6-6"></path>
            </svg>
          </span>
        </button>
        <div
          class="item__panel"
          role="region"
          aria-label=${this.#summaryText.length > 0 ? this.#summaryText : 'Раскрываемая секция'}
          ?hidden=${!this.open}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

/** `open-change` detail — the §9 declarative channel payload. */
export interface TkAccordionItemOpenChangeDetail {
  value: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-accordion-item': TkAccordionItem;
  }
}

if (!customElements.get('tk-accordion-item')) {
  customElements.define('tk-accordion-item', TkAccordionItem);
}
