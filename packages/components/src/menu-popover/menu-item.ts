import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { menuItemStyles } from './menu-popover.css.js';

/**
 * tk-menu-item — one command row of `tk-menu-popover` (spec 19.1), the
 * follow-up pack's grounded anatomy: ≈44px row (captures ≈40±2 — the A11y
 * Floor's ≥44 target wins, see menu-popover.css.ts), 12px inline padding,
 * optional leading 20px-class icon in the `icon` slot (the avatar-menu
 * pattern), and the destructive variant as RED TEXT with no fill (the
 * kebab captures' «Удалить» rows — probe-notes § 2026-09-30).
 *
 * The element is APG-menu shaped BY CONTRACT: role=menuitem and roving
 * tabindex (-1 — tk-menu-popover promotes the current row to 0 and moves
 * real focus among rows) are asserted at CONNECT time (constructor-time
 * attributes do not survive React 19's element creation), aria-disabled for
 * the unselectable state.
 * Activation (click / Enter / Space) is MEDIATED by tk-menu-popover, which
 * owns the `select` event and the open/close choreography — a bare item
 * outside a menu-popover renders and is focusable but dispatches nothing.
 *
 * @tag tk-menu-item
 * @attr {boolean} disabled - Row present but inert: skipped by roving focus, no select; reflects as aria-disabled.
 * @attr {'default'|'destructive'} variant - `destructive` paints the label in the error red (text only, never a fill).
 * @slot icon - Leading icon slot (the avatar-menu pattern; colored text-secondary).
 * @slot default - The command label.
 */
export class TkMenuItem extends LitElement {
  static override readonly styles = [menuItemStyles];

  /** Disabled: row present but inert — skipped by navigation, never selects. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Visual variant: `default` | `destructive` (red text, no fill). */
  @property({ type: String, reflect: true })
  variant: 'default' | 'destructive' = 'default';

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 construction safety + the React-19
    // law, caught by the v1.5.0 Flow-B gate): React creates custom elements so
    // that constructor-time attributes never reach the committed node — the
    // APG identity and the roving default must be (re)asserted on every
    // connect. tk-menu-popover promotes the current row to 0.
    this.setAttribute('role', 'menuitem');
    this.tabIndex = -1;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // Enum clamp (CONVENTIONS §2): garbage degrades to the union default,
    // never throws; the reflected attribute shows the value in force.
    if (changed.has('variant') && this.variant !== 'default' && this.variant !== 'destructive') {
      this.variant = 'default';
    }
    if (changed.has('disabled')) {
      if (this.disabled) this.setAttribute('aria-disabled', 'true');
      else this.removeAttribute('aria-disabled');
    }
  }

  override render() {
    return html`<slot name="icon"></slot><span class="item__label"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-menu-item': TkMenuItem;
  }
}

if (!customElements.get('tk-menu-item')) {
  customElements.define('tk-menu-item', TkMenuItem);
}
