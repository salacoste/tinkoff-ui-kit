import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { linkStyles } from './tj-link.css.js';

/**
 * tj-link — the ТЖ text link (Story 16.1).
 *
 * The probe10 species as a standalone chrome primitive: the ink consumes
 * `--tj-color-link` in both themes (the interactive pair token, never a
 * scale step), the underline EXISTS but paints TRANSPARENT at rest and
 * reveals on hover at 70% alpha of the ink (color-mix, compose-at-use).
 * Ink-stable hover — no color shift, the reference's restraint grammar.
 * Typography INHERITS from the surrounding context (links live inside
 * sentences; the bank `inline` variant mold) — this element owns color,
 * underline geometry and motion only.
 *
 * Anchors: renders a native `<a>` in its shadow root with the default slot
 * as the label (native semantics — role, name and Enter activation by
 * construction). `href` EMPTY/absent renders the anchor WITHOUT the href
 * attribute (inert content, not focusable — no dangling href=""); non-empty
 * passes through verbatim. `target` passes through. `rel` follows the bank
 * 10.4 mold: a consumer rel wins verbatim; otherwise `noopener noreferrer`
 * is applied exactly when target="_blank".
 *
 * v1 BASE species only (spec 16.1): no variants, no disabled, no
 * underline-always mode — additions are a new story, not a property.
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tj-link
 * @prop {string} [href] - URL; empty/absent renders an inert anchor (no href attribute).
 * @prop {string} [target] - Pass-through browsing context for the inner anchor.
 * @prop {string} [rel] - Pass-through relationship; consumer rel wins verbatim.
 * @slot - Label (primary content).
 */
export class TjLink extends LitElement {
  /**
   * Pass-through URL (string DATA — never reflects, CONVENTIONS §2; the
   * reflected surface is the inner anchor, asserted by the unit suite).
   * Empty string renders NO href attribute — the spec's inert-content rule.
   */
  @property({ type: String })
  href?: string;

  /** Pass-through browsing context (`_blank`, …). */
  @property({ type: String })
  target?: string;

  /** Pass-through link relationship (`noopener`, …); see the 10.4 mold above. */
  @property({ type: String })
  rel?: string;

  static override readonly styles = [linkStyles];

  /**
   * The 10.4 rel rule, verbatim from the bank dual-tag mold: an explicit
   * consumer rel wins verbatim; otherwise `noopener noreferrer` is applied
   * exactly when target="_blank" (and omitted otherwise — nothing).
   */
  #anchorRel(): string | typeof nothing {
    if (this.rel != null && this.rel.length > 0) return this.rel;
    return this.target === '_blank' ? 'noopener noreferrer' : nothing;
  }

  /** The 16.1 href rule: EMPTY string is NOT a live href — render no attribute. */
  #anchorHref(): string | typeof nothing {
    return this.href != null && this.href.length > 0 ? this.href : nothing;
  }

  override render() {
    return html`
      <a
        class="link"
        href=${this.#anchorHref()}
        target=${this.target != null && this.target.length > 0 ? this.target : nothing}
        rel=${this.#anchorRel()}
      >
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-link': TjLink;
  }
}

if (!customElements.get('tj-link')) {
  customElements.define('tj-link', TjLink);
}
