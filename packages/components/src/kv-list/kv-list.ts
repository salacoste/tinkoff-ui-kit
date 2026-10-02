import { LitElement, html } from 'lit';

import { kvListStyles } from './kv-list.css.js';

/**
 * tk-kv-list — the kit's key-value spec list (spec 22.4, invest identity
 * wave, GAP-MAP B4): gray label left, near-black value flush right, 1px
 * hairlines between rows — the bond page's «Информация о выпуске», the
 * future page's «Параметры фьючерса», the stock page's «Показатели»
 * (three independent groundings in the captures-v4 recon).
 *
 * The container owns ONLY the between-rows hairline rhythm (the accordion
 * mold: «between, not around» — every slotted item but the last carries
 * the divider); a row is `<tk-kv-list-item>` authored as a light-DOM
 * child (label prop/slot + value slot + the optional hint tooltip live
 * there).
 *
 * SEMANTICS RULING (AC4, measured at execution): the live block is bare
 * div rows with NO list semantics (the bond capture's KV rows carry no
 * role); a native dl/dt/dd CANNOT cross the slot boundary (dt/dd without
 * a dl ancestor is an invalid tree), so the kit asserts the honest
 * equivalent — `role="list"` here + `role="listitem"` on each item host:
 * the row count reaches assistive tech and every row reads
 * «label value» in one breath. The heading above the live block is the
 * consumer's pattern wrapper, NOT an atom prop (the 19.1 no-modes
 * lesson).
 *
 * STATELESS (the rating ruling): the list is plain flow content — no
 * channels, no events (event-map no-entry); the only interactive surface
 * in the family is the item's hint button, and its behavior belongs to
 * the composed tk-tooltip.
 *
 * @tag tk-kv-list
 * @slot - The rows: tk-kv-list-item elements, authored in order.
 */
export class TkKvList extends LitElement {
  static override readonly styles = [kvListStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 construction safety + the
    // React-19 law): constructor-time host attributes never reach React's
    // committed node — the identity re-asserts on every connect (the
    // tk-rating idiom).
    this.setAttribute('role', 'list');
  }

  override render() {
    return html`
      <div class="list">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-kv-list': TkKvList;
  }
}

if (!customElements.get('tk-kv-list')) {
  customElements.define('tk-kv-list', TkKvList);
}
