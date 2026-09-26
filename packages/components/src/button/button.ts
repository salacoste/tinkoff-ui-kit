import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

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
 * Anchor mode (Story 10.4): set `href` to a non-empty string and the pill
 * renders a native `<a class="button">` INSTEAD of the button — same class,
 * same inner tree (spinner + label slots), same styling: button.css.ts gates
 * everything on the `.button` class and `:host([...])` attributes, never on
 * the tag. With `href` unset/empty the render is literally today's button
 * DOM, byte-for-byte. Nothing is reflected and nothing is minted on the host:
 * the union of absent attributes IS the byte-stability guarantee (the 10.3
 * lesson). `disabled`/`loading` keep the link inert via the host-level click
 * interception (constructor listener covers both tags); an href link stays
 * focusable while disabled (the aria-disabled pattern — it must not lose its
 * address). External-link safety rides the store-badges contract, made
 * deterministic: `rel` defaults to `noopener noreferrer` IFF `target` is
 * `_blank` (noopener only matters when a NEW browsing context opens — target
 * is that signal; no URL parsing in the render path); a consumer `rel` always
 * wins verbatim. Keyboard: Enter navigates; Space scrolls the page (native
 * anchor semantics — the documented delta, see the Accessibility story).
 *
 * @tag tk-button
 * @attr {primary|secondary|inverse} variant - Visual variant (default `primary`).
 * @attr {hero|card|compact} size - Control height scale (default `card`).
 * @attr {boolean} loading - In-place spinner; width frozen; clicks do not activate.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled.
 * @attr {string} href - URL: with a non-empty value the pill renders a native anchor instead of the button; unset/empty renders the button byte-identically.
 * @attr {string} target - Anchor browsing-context hint (href mode only); `target="_blank"` is the signal that mints the default `rel`.
 * @attr {string} rel - Anchor rel override (href mode only); a consumer value wins verbatim over the `_blank` default.
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

  /**
   * Anchor mode: a non-empty URL flips the interactive tag to a native
   * `<a class="button" href>` (Story 10.4). NO reflect, NO default — nothing
   * is minted on the host; `''`/null/undefined all mean the button branch
   * (null-tolerance, the checkbox `error` mold).
   */
  @property()
  href?: string;

  /**
   * Browsing-context hint for the anchor (`href` mode only). Also the signal
   * for the default `rel`: `target="_blank"` opens a new browsing context,
   * which is the only case where noopener/noreferrer matter. NO reflect, NO
   * default.
   */
  @property()
  target?: string;

  /**
   * Consumer `rel` override (`href` mode only): always wins verbatim over the
   * `_blank`-conditioned default. NO reflect, NO default.
   */
  @property()
  rel?: string;

  static override readonly styles = [buttonStyles];

  /**
   * Click interception, bound at the HOST (constructor listener — always the
   * first listener on the element). `disabled` already kills pointer events
   * at the host (CSS), but a focused button still fires synthetic clicks from
   * Enter/Space — and a `loading` button must not activate at all (I/O
   * matrix). Binding here covers BOTH dispatch paths: native clicks bubbling
   * out of the shadow `<button>` (composed) AND clicks dispatched on
   * `<tk-button>` itself (`el.click()`, delegated listeners on ancestors).
   * preventDefault + stopImmediatePropagation keeps both inert while the
   * button stays focusable (aria-disabled pattern; native `disabled` would
   * drop it from the tab order and hide it from some screen readers).
   */
  private readonly handleClick = (event: Event): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
  }

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`/
   * `size` value falls back to the union default instead of rendering an
   * unstyled interactive control (never throws — bad input degrades, it does
   * not crash). The reflected attribute is corrected too, so the DOM shows
   * the value actually in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkButton.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'primary';
    }
    if (changed.has('size') && !(TkButton.sizes as readonly string[]).includes(this.size)) {
      this.size = 'card';
    }
  }

  /**
   * Accessible-name guard: a button with no default-slot content has no
   * accessible name. Warns ONCE per element (flag), checked at first render
   * and on slotchange — slotted content can arrive after connect. Fires in
   * every environment with a clear prefix: `import.meta.env.DEV` is a Vite
   * build-time injection that does not exist for non-Vite consumers of the
   * lib build, so gating on it would silence the warning exactly where a
   * consumer first integrates the kit.
   */
  #nameWarned = false;

  #warnIfUnnamed(): void {
    if (this.#nameWarned) return;
    const defaultSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const hasContent = (defaultSlot?.assignedNodes({ flatten: true }) ?? []).some(
      (node: Node) =>
        node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
    if (!hasContent) {
      this.#nameWarned = true;
      console.warn(
        'tk-button: no content in the default slot — the button has no accessible name. Give it a slotted label.',
      );
    }
  }

  override firstUpdated(): void {
    this.#warnIfUnnamed();
  }

  private handleSlotChange(): void {
    this.#warnIfUnnamed();
  }

  /**
   * rel contract (deterministic, no URL parsing): a consumer `rel` wins
   * verbatim; otherwise `target="_blank"` — the only case that opens a new
   * browsing context, where noopener/noreferrer matter — mints the
   * store-badges contract `noopener noreferrer`; any other target (or none)
   * renders NO rel attribute (same-tab navigation needs none).
   */
  #anchorRel(): string | typeof nothing {
    if (this.rel != null && this.rel.length > 0) return this.rel;
    return this.target === '_blank' ? 'noopener noreferrer' : nothing;
  }

  override render() {
    // href mode: a non-empty string flips the interactive tag to a native
    // anchor — same `.button` class, same inner tree, no `type` (button-only),
    // no role (native anchor semantics are correct), no part (none exists).
    // The two branches duplicate the inner tree ON PURPOSE: sharing it through
    // a child expression would inject Lit part markers (<!---->) into the
    // button branch's DOM — the no-href render must stay byte-identical (the
    // byte-stability invariant, pinned by the DOM-identity unit test).
    if (this.href != null && this.href.length > 0) {
      return html`
        <a
          class="button"
          href=${this.href}
          target=${this.target != null && this.target.length > 0 ? this.target : nothing}
          rel=${this.#anchorRel()}
          aria-disabled=${this.disabled ? 'true' : nothing}
          aria-busy=${this.loading ? 'true' : nothing}
        >
          <span class="button__spinner" aria-hidden="true"></span>
          <span class="button__label">
            <slot name="icon"></slot>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </span>
        </a>
      `;
    }
    return html`
      <button
        class="button"
        type="button"
        aria-disabled=${this.disabled ? 'true' : nothing}
        aria-busy=${this.loading ? 'true' : nothing}
      >
        <span class="button__spinner" aria-hidden="true"></span>
        <span class="button__label">
          <slot name="icon"></slot>
          <slot @slotchange=${this.handleSlotChange}></slot>
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
