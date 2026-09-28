import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { ctaStyles } from './tj-cta.css.js';

/**
 * tj-cta — the ТЖ call-to-action anchor (Story 16.1).
 *
 * ANCHOR-ONLY (spec 16.1): the reference CTA is a navigational pill; there
 * is no button branch and none may be minted without a new story (a JS
 * action CTA would be the exception-log entry that re-opens this). Renders
 * a native `<a>` in its shadow root with the default slot as the label —
 * native semantics (role, name, Enter activation) by construction.
 *
 * The compact-inset mold (bank tk-button precedent): the visible 30px pill
 * (radius token, fill/ink token pair) paints as a ::before of an invisible
 * 44×44 box — every pixel of the floor is clickable and the focus ring
 * wraps the box. The dark theme inverts the pill through tokens alone.
 *
 * QUIET species — no invented states: NO hover fill/press/disabled. The
 * reference CTA's hover is UNPROBED (recorded-reference-behavior, probe10);
 * the kit ships the cursor affordance only. If the baseline review measures
 * a hover treatment, it lands as a new probe + tokens, not a branch here.
 *
 * API is href-only at the freeze: target/rel are NOT offered (the spec's
 * surface; no speculative properties at a freeze — tj-link carries the
 * full anchor pass-through where the reading surface needs it).
 *
 * STATELESS: no channel, nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tj-cta
 * @prop {string} [href] - URL; empty/absent renders an inert anchor (no href attribute).
 * @slot - Label (primary content).
 */
export class TjCta extends LitElement {
  /**
   * Pass-through URL (string DATA — never reflects, CONVENTIONS §2; the
   * reflected surface is the inner anchor, asserted by the unit suite).
   * Empty string renders NO href attribute — the 16.1 inert-content rule.
   */
  @property({ type: String })
  href?: string;

  static override readonly styles = [ctaStyles];

  /** The 16.1 href rule: EMPTY string is NOT a live href — render no attribute. */
  #anchorHref(): string | typeof nothing {
    return this.href != null && this.href.length > 0 ? this.href : nothing;
  }

  override render() {
    return html`
      <a class="cta" href=${this.#anchorHref()}>
        <span class="cta__label"><slot></slot></span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-cta': TjCta;
  }
}

if (!customElements.get('tj-cta')) {
  customElements.define('tj-cta', TjCta);
}
