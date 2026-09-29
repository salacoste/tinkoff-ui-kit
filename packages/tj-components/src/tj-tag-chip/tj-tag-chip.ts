import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { tagChipStyles } from './tj-tag-chip.css.js';

/**
 * tj-tag-chip — the ТЖ purple-field nav chip (Story 16.3).
 *
 * A shadow `<a href>` pill: h40, radius chip 20, fill
 * `var(--tj-color-chip-fill)` / ink `var(--tj-color-chip-ink)` — the
 * AUTHORED AA pair (5.813:1), THEME-INVARIANT by design: chips ride the
 * purple fields in both themes, the token pair carries no dark override,
 * and a `data-tj-theme="dark"` ancestor changes nothing (pinned by test).
 * Label = the default slot in nav-label 17/700 + a COMPONENT-RENDERED
 * decorative chevron (inline aria-hidden SVG, currentColor — the chip's own
 * ink, not a color of its own).
 *
 * Motion: hover/focus LIFT translateY(−2px) on duration-fast + curve-standard
 * (EXPERIENCE names the lift; −2px is the flagged magnitude). Focus ring =
 * chip-ink 2px/offset-2px — NOT the generic focus-ring token, which fails
 * the non-text 3:1 bar on the purple field (the DESIGN row ruling). Reduced
 * motion: the tokens' own prefers-reduced-motion block collapses
 * duration-fast to 0ms — the lift turns instant; no component media query.
 *
 * Anchor contract — the 16.1 tj-link mold verbatim: `href` empty/absent
 * renders the anchor WITHOUT the href attribute (inert content, not
 * focusable); `target` passes through; `rel` follows the bank 10.4 rule
 * (consumer rel wins verbatim, otherwise `noopener noreferrer` exactly
 * when target="_blank").
 *
 * Chips are LINKS in natural tab order — no tablist/aria-selected semantics
 * (EXPERIENCE). Wrapping rows are CONSUMER layout: chips flex-wrap, never
 * scroll (documented + demoed in the /pro/ hero pattern story).
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tj-tag-chip
 * @prop {string} [href] - URL; empty/absent renders an inert anchor (no href attribute).
 * @prop {string} [target] - Pass-through browsing context for the inner anchor.
 * @prop {string} [rel] - Pass-through relationship; consumer rel wins verbatim.
 * @slot - Label (nav-label species, chip-ink on chip-fill).
 */
export class TjTagChip extends LitElement {
  /**
   * Pass-through URL (string DATA — never reflects, CONVENTIONS §2; the
   * reflected surface is the inner anchor, asserted by the unit suite).
   * Empty string renders NO href attribute — the 16.1 inert-content rule.
   */
  @property({ type: String })
  href?: string;

  /** Pass-through browsing context (`_blank`, …). */
  @property({ type: String })
  target?: string;

  /** Pass-through link relationship (`noopener`, …); see the 10.4 mold above. */
  @property({ type: String })
  rel?: string;

  static override readonly styles = [tagChipStyles];

  /**
   * The 10.4 rel rule, verbatim from the 16.1 tj-link mold: an explicit
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
        class="chip"
        href=${this.#anchorHref()}
        target=${this.target != null && this.target.length > 0 ? this.target : nothing}
        rel=${this.#anchorRel()}
      >
        <span class="chip__label"><slot></slot></span>
        <svg
          class="chip__chevron"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-tag-chip': TjTagChip;
  }
}

if (!customElements.get('tj-tag-chip')) {
  customElements.define('tj-tag-chip', TjTagChip);
}
