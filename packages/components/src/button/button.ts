import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import { buttonStyles } from './button.css.js';

/**
 * tk-button — the kit's pilot component (Story 1.7).
 *
 * Pill button in the Tinkoff (T-Bank) register: primary yellow (ink text),
 * secondary surface (default shadow), inverse ink (white text); heights
 * 56 (hero) / 48 (card) / 32 (compact, padded to the 44px target floor).
 * Visual spec: DESIGN.md `components.button-*`; behavior: EXPERIENCE.md
 * Component Patterns (Button row).
 *
 * Theming crosses the shadow boundary exclusively through inherited
 * `var(--tk-*)` custom properties (AD-2/AD-3) — this element never adopts
 * the token sheet and never injects document-level styles.
 *
 * Events: none custom at v1 — the native `click` (composed, bubbles) serves
 * activation; kit occurrence events arrive with the first component that
 * needs one (CONVENTIONS.md §3, resolved at the 1.7 pilot).
 *
 * @tag tk-button
 * @attr {primary|secondary|inverse} variant - Visual variant (default `primary`).
 * @attr {hero|card|compact} size - Control height scale (default `card`).
 * @attr {boolean} loading - In-place spinner; width frozen; clicks do not activate.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled.
 * @slot - Label (primary content).
 * @slot icon - Optional icon, rendered left of the label.
 */
export class TkButton extends LitElement {
  /** Visual variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['primary', 'secondary', 'inverse'] as const;

  /** Size union: hero 56 / card 48 / compact 32 (padded to the 44px floor). */
  static readonly sizes = ['hero', 'card', 'compact'] as const;

  /** Visual variant. */
  @property({ reflect: true })
  variant: 'primary' | 'secondary' | 'inverse' = 'primary';

  /** Control height scale. */
  @property({ reflect: true })
  size: 'hero' | 'card' | 'compact' = 'card';

  /** Loading: in-place spinner, button width frozen, label kept for SR (aria-busy). */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /** Disabled: no pointer events, announced as disabled (aria-disabled); wins over loading. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  static override readonly styles = [buttonStyles];

  /**
   * Click interception. `disabled` already kills pointer events at the host
   * (CSS), but a focused button still fires synthetic clicks from Enter/Space
   * — and a `loading` button must not activate at all (I/O matrix). Preventing
   * default and stopping propagation before the event escapes the shadow root
   * keeps both states inert for mouse AND keyboard, while the button stays
   * focusable (aria-disabled pattern; native `disabled` would drop it from
   * the tab order and hide it from some screen readers).
   */
  private handleClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  override render() {
    return html`
      <button
        class="button"
        type="button"
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        @click=${this.handleClick}
      >
        <span class="button__spinner" aria-hidden="true"></span>
        <span class="button__label">
          <slot name="icon"></slot>
          <slot></slot>
        </span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-button': TkButton;
  }
}

if (!customElements.get('tk-button')) {
  customElements.define('tk-button', TkButton);
}
