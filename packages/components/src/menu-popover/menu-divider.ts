import { LitElement } from 'lit';

import { menuDividerStyles } from './menu-popover.css.js';

/**
 * tk-menu-divider — the 1px full-width group rule inside `tk-menu-popover`
 * (spec 19.1): the open captures show item groups separated by a hairline
 * across the whole panel width (probe-notes § 2026-09-30), the same
 * language the console's page headers use. role=separator asserted at connect
 * time (constructor-time attributes do not survive React 19's element creation).
 *
 * @tag tk-menu-divider
 */
export class TkMenuDivider extends LitElement {
  static override readonly styles = [menuDividerStyles];

  override connectedCallback(): void {
    super.connectedCallback();
    // role at CONNECT time — the React-19 law (constructor-time attributes do
    // not survive React's element creation; the v1.5.0 Flow-B gate catch).
    this.setAttribute('role', 'separator');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-menu-divider': TkMenuDivider;
  }
}

if (!customElements.get('tk-menu-divider')) {
  customElements.define('tk-menu-divider', TkMenuDivider);
}
