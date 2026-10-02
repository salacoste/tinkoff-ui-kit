import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import '../tooltip/tooltip.js';

import { kvListItemStyles } from './kv-list.css.js';

/**
 * tk-kv-list-item — one row of a `<tk-kv-list>` (spec 22.4, invest identity
 * wave, GAP-MAP B4): gray label left, near-black value flush right, divided
 * from its neighbors by the container's 1px hairline.
 *
 * The label is the `label` prop OR the `label` slot (slotted content wins —
 * the slot's fallback IS the prop, the service-card slotchange mold). The
 * value is slot-only: a value is markup (a toned span, a code fragment) far
 * more often than plain text, and the atom stays dumb.
 *
 * HINT (AC2): a `hint` string renders the gray circled «?» after the label
 * — a real `<button type="button">` (tab stop, the standard focus ring)
 * wrapped in the kit's own `<tk-tooltip content=hint>`, which wires
 * aria-describedby from the button to its pill (hover/focus show with the
 * 300ms delay, click/tap toggle, Esc close — the tooltip's contract
 * verbatim, NO duplicate behavior here). aria-expanded is deliberately
 * absent: the button requests a DESCRIPTION, it discloses nothing (the
 * disclosure contract belongs to tk-accordion-item). Without `hint` the
 * icon, the button and the tab stop do not exist.
 *
 * STATELESS: the row dispatches nothing (event-map no-entry); the only
 * events crossing it are the composed tooltip's own.
 *
 * @tag tk-kv-list-item
 * @attr {string} label - Row label (left); the label slot overrides it.
 * @attr {string} hint - Hint text — renders the ⓘ roundel + tooltip; empty renders no icon.
 * @slot label - The label content (overrides the label prop).
 * @slot value - The value content (right-aligned).
 */
export class TkKvListItem extends LitElement {
  static override readonly styles = [kvListItemStyles];

  /** Row label — the slot's fallback (slotted content wins). */
  @property({ type: String })
  label = '';

  /** Hint text — presence renders the ⓘ button + tooltip. */
  @property({ type: String })
  hint = '';

  /** The label slot's real text — feeds the hint button's accessible name. */
  #labelText = '';

  /**
   * The label in force for the hint's accessible name: the slot's text when
   * slotted, the prop otherwise (the slot's fallback renders only while the
   * slot carries no real content — the badge slot-presence rule).
   */
  get #effectiveLabel(): string {
    return this.#labelText || this.label;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 + the React-19 law, the
    // tk-kv-list idiom).
    this.setAttribute('role', 'listitem');
  }

  /**
   * Slot presence (the badge rule): REAL content counts. Checked at
   * firstUpdated AND on every slotchange — the initial assignment does not
   * reliably fire slotchange (the badge lesson).
   */
  #syncLabelText(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');
    const text = (slot?.assignedNodes({ flatten: true }) ?? [])
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();
    if (text !== this.#labelText) {
      this.#labelText = text;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncLabelText();
  }

  readonly #handleLabelSlotChange = (): void => {
    this.#syncLabelText();
  };

  override render() {
    return html`
      <div class="item">
        <div class="item__label">
          <slot name="label" @slotchange=${this.#handleLabelSlotChange}>${this.label}</slot>
          ${this.hint
            ? html`
                <tk-tooltip .content=${this.hint}>
                  <button class="item__hint" type="button" aria-label=${this.#effectiveLabel ? `Подсказка: ${this.#effectiveLabel}` : 'Подсказка'}>
                    ?
                  </button>
                </tk-tooltip>
              `
            : nothing}
        </div>
        <div class="item__value">
          <slot name="value"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-kv-list-item': TkKvListItem;
  }
}

if (!customElements.get('tk-kv-list-item')) {
  customElements.define('tk-kv-list-item', TkKvListItem);
}
