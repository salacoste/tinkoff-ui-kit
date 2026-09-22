import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { linkStyles } from './link.css.js';

/**
 * tk-link — the kit's TextLink (Story 3.1).
 *
 * Inline text link in the Tinkoff (T-Bank) register: blue at rest via the
 * SEMANTIC link token (never a scale step), underline only on hover and
 * keyboard focus — the reference's «Читать» is a plain word at rest (capture
 * text-link-read-more.png; the probe in .playwright-cli/verify/link/NOTES.md).
 * Variants: `inline` (inherits surrounding typography — links live inside
 * sentences), `standalone` (body-m, own line — card «Читать далее» CTAs) and
 * `legal` (body-xs gray fine print — footer legal copy).
 *
 * Anchors: renders a native `<a>` in its shadow root with the default slot as
 * the label (native semantics — role, name and Enter activation by
 * construction); `href`/`target`/`rel` pass through. `disabled` follows the
 * Button mold: aria-disabled + inert click interception at the host, the
 * element stays focusable.
 *
 * Color ruling (the spec's probe NOTES record): the link ALWAYS consumes
 * `--tk-color-link` — consumers never pick a link-on-tint step manually; the
 * semantic token themes itself (blue-100 light / #66A3FF dark, the AA pair
 * the token layer already carries). The legal variant is text-secondary gray.
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry case (tk-button precedent).
 * SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-link
 * @attr {inline|standalone|legal} variant - Usage variant (default `inline`).
 * @attr {boolean} disabled - aria-disabled + inert clicks; stays focusable.
 * @prop {string} [href] - Pass-through URL for the inner anchor.
 * @prop {string} [target] - Pass-through browsing context for the inner anchor.
 * @prop {string} [rel] - Pass-through relationship for the inner anchor.
 * @slot - Label (primary content).
 */
export class TkLink extends LitElement {
  /** Usage variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['inline', 'standalone', 'legal'] as const;

  /** Usage variant: inline (inherit), standalone (body-m), legal (body-xs gray). */
  @property({ reflect: true })
  variant: 'inline' | 'standalone' | 'legal' = 'inline';

  /** Disabled: no navigation, announced as disabled; stays focusable (aria-disabled pattern). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Pass-through URL (string DATA — never reflects, CONVENTIONS §2; the
   * reflected surface is the inner anchor, asserted by the unit suite).
   */
  @property({ type: String })
  href?: string;

  /** Pass-through browsing context (`_blank`, …). */
  @property({ type: String })
  target?: string;

  /** Pass-through link relationship (`noopener`, …). */
  @property({ type: String })
  rel?: string;

  static override readonly styles = [linkStyles];

  /**
   * Click interception, bound at the HOST — the Button mold verbatim: a
   * disabled link never navigates, from EITHER dispatch path (native clicks
   * bubbling out of the shadow `<a>` AND clicks dispatched on `<tk-link>`
   * itself — `el.click()`, delegation). preventDefault kills the navigation;
   * stopImmediatePropagation keeps consumer listeners inert. The element
   * stays focusable (aria-disabled pattern — native removal from the tab
   * order hides it from some screen readers).
   */
  private readonly handleClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  constructor() {
    super();
    this.addEventListener('click', this.handleClick);
  }

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default (never throws), reflected attribute
   * corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkLink.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'inline';
    }
  }

  override render() {
    return html`
      <a
        class="link"
        href=${this.href ?? nothing}
        target=${this.target ?? nothing}
        rel=${this.rel ?? nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-link': TkLink;
  }
}

if (!customElements.get('tk-link')) {
  customElements.define('tk-link', TkLink);
}
