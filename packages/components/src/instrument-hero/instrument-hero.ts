import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { instrumentHeroStyles } from './instrument-hero.css.js';

/** The four measured identity families (22.5 grounding: stock/bond/dark/light). */
export type TkInstrumentHeroTone = 'stock' | 'bond' | 'dark' | 'light';

export const TK_INSTRUMENT_HERO_TONES: readonly TkInstrumentHeroTone[] = [
  'stock',
  'bond',
  'dark',
  'light',
] as const;

/**
 * tk-instrument-hero — the instrument page's identity card (spec 22.5,
 * invest identity wave, GAP-MAP B2): the name/ticker headline over the
 * asset-class gradient, an optional metric block bottom-left, the logo
 * disc on the right edge, and the consumer's favorite-star action in the
 * top-right corner. Five groundings in the captures-v4 recon: sber stock,
 * Russia bond, TVEN etf, AEZ6 future, USD currency.
 *
 * HEADING SEMANTICS (AC3): the name renders in a DIV, never a heading —
 * the h-level is the consumer's document structure. A consumer that
 * needs a real heading slots it: `<h2 slot="name">…</h2>` overrides the
 * `name` prop verbatim (slotted content wins — the service-card
 * slotchange mold; the live pages' empty-h1 bug is the recorded
 * negative the kit deliberately does not copy).
 *
 * The four gradient fills ride the 22.5 invest identity stop tokens
 * (theme-invariant, minted in the token layer — FR-1 bans gradient
 * literals in component sheets); `--tk-instrument-hero-bg` replaces a
 * tone fill wholesale (a consumer overriding it owns their own AA).
 * Text polarity is theme-invariant by design: white on stock/bond/dark,
 * ink-300 on light — the light card stays ink-read in dark theme.
 *
 * The favorite star is a SLOT BUTTON, never kit state: the atom places
 * the action in the corner; owning/toggling the portfolio favorite is
 * the consumer's (the kit does not know the instrument is favorited).
 *
 * STATELESS (the rating ruling): plain flow content — no channels, no
 * events (event-map no-entry). The only interactive surface in a live
 * hero is the consumer's slotted action button.
 *
 * @tag tk-instrument-hero
 * @attr {string} name - Instrument name (the big line); the name slot overrides it.
 * @attr {string} ticker - Ticker/ISIN (the small superscript line beside the name).
 * @attr {'stock'|'bond'|'dark'|'light'} tone - Identity gradient family (default stock).
 * @attr {string} metric-label - Metric caption (the small line above the value); the metric block renders only while the metric slot carries content.
 * @slot name - Overrides the name prop (slot a heading here for document semantics).
 * @slot metric - The metric value (bottom-left); empty slot = no metric block (the etf/currency anatomy).
 * @slot logo - The logo disc content (a brand asset, an emblem, a flag — consumer property).
 * @slot action - The corner action (the favorite-star button — consumer state).
 */
export class TkInstrumentHero extends LitElement {
  static override readonly styles = [instrumentHeroStyles];

  /** Instrument name — the name slot's fallback (slotted content wins). */
  @property({ type: String })
  name = '';

  /** Ticker/ISIN — the small superscript line. */
  @property({ type: String })
  ticker = '';

  /** Identity gradient family — drives the fill + text polarity. */
  @property({ type: String, reflect: true })
  tone: TkInstrumentHeroTone = 'stock';

  /** Metric caption — rendered only while the metric slot carries content. */
  @property({ type: String, attribute: 'metric-label' })
  metricLabel = '';

  /** Whether the metric slot carries real content (the badge slot-presence rule). */
  #metricHasContent = false;

  /**
   * Slot presence (the badge rule): REAL content counts. Checked at
   * firstUpdated AND on every slotchange — the initial assignment does
   * not reliably fire slotchange (the badge lesson).
   */
  #syncMetricPresence(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="metric"]');
    const has = (slot?.assignedNodes({ flatten: true }) ?? []).some(
      (node) => (node.textContent ?? '').trim() !== '' || node.nodeType === Node.ELEMENT_NODE,
    );
    if (has !== this.#metricHasContent) {
      this.#metricHasContent = has;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncMetricPresence();
  }

  readonly #handleMetricSlotChange = (): void => {
    this.#syncMetricPresence();
  };

  override render() {
    return html`
      <div class="hero">
        <div class="hero__head">
          <div class="hero__title">
            <div class="hero__name"><slot name="name">${this.name}</slot></div>
            ${this.ticker ? html`<div class="hero__ticker">${this.ticker}</div>` : nothing}
          </div>
          <div class="hero__action"><slot name="action"></slot></div>
        </div>
        ${this.#metricHasContent
          ? html`
              <div class="hero__metric">
                ${this.metricLabel
                  ? html`<div class="hero__metric-label">${this.metricLabel}</div>`
                  : nothing}
                <div class="hero__metric-value"><slot name="metric" @slotchange=${this.#handleMetricSlotChange}></slot></div>
              </div>
            `
          : html`<slot name="metric" @slotchange=${this.#handleMetricSlotChange} hidden></slot>`}
      </div>
      <div class="hero__logo"><slot name="logo"></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-instrument-hero': TkInstrumentHero;
  }
}

if (!customElements.get('tk-instrument-hero')) {
  customElements.define('tk-instrument-hero', TkInstrumentHero);
}
