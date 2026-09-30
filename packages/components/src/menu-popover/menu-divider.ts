import { LitElement } from 'lit';

import { menuDividerStyles } from './menu-popover.css.js';

/**
 * tk-menu-divider — the 1px full-width group rule inside `tk-menu-popover`
 * (spec 19.1): the open captures show item groups separated by a hairline
 * across the whole panel width (probe-notes § 2026-09-30), the same
 * language the console's page headers use. role=separator by construction.
 *
 * @tag tk-menu-divider
 */
export class TkMenuDivider extends LitElement {
  static override readonly styles = [menuDividerStyles];

  constructor() {
    super();
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
