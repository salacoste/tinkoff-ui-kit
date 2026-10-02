import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { quoteChipStyles } from './quote-chip.css.js';

/**
 * tk-quote-chip — the market-data chip family (spec 22.1, invest identity
 * wave — GAP-MAP A3: the ONLY market-data answer in the kit to the whole
 * reference section).
 *
 * Four display forms, one STATELESS element (the tk-badge mold: nothing
 * dispatches — the event-map no-entry case):
 * - `pill` (default) — mini-quote: roundel + bold price + colored Δ%
 *   (the hub ticker band's chip);
 * - `inline` — the `$TOKEN` blue in-body link form (posts);
 * - `box` — the attached single-quote widget: a light rounded container
 *   with the same logo/price/delta body;
 * - `overflow` — the light-blue «Ещё N» count pill closing an in-body
 *   chip row (the count is the slot's own content).
 *
 * GROUNDING (the pixel pass over research.png's ticker band, y=129–200,
 * crop /tmp/qc-ticker-band.png; full table in quote-chip.css.ts): the
 * hub chip is BARE content on the band — interior probes equal the gap
 * probes (245,246,247), so the lens's «white stadium pills» claim is
 * REFUTED (pixels decide); the pill default therefore paints no fill of
 * its own. The delta pair the reference paints raw (#11A836 / #F43838)
 * is NOT taken: the kit consumes its AA-sanctioned delta tokens
 * (see quote-chip.css.ts).
 *
 * DIRECTION is derived, never a prop (the frozen ruling): the sign of
 * `delta`'s first non-space character carries it — `+` → positive,
 * `−` (U+2212) or `-` → negative, no sign → neutral (text-secondary).
 * The delta string itself IS the accessible carrier — color is never the
 * only channel (AC4).
 *
 * SEMANTICS: with `href` the chip is a real `<a>` (native focus, Enter,
 * middle-click); without it a plain span — display-only, no tabindex, no
 * role (AC4). `name` (full instrument name) surfaces as the link's
 * `title`; the visible price/delta text already names the chip for AT.
 *
 * The logo is the `logo` slot (a consumer roundel); an empty slot falls
 * back to a letter roundel built from the ticker's first character (the
 * carousel placeholder mold). The kit never parses `price`/`delta` —
 * formatting is consumer-side (AC1); the RU decimal comma convention is
 * a story-note, not code (AC3).
 *
 * @tag tk-quote-chip
 * @attr {pill|inline|box|overflow} variant - Display form (default `pill`).
 * @attr {string} ticker - Instrument ticker (required; the inline form's text, the letter roundel's seed, the price fallback).
 * @attr {string} name - Full instrument name → the link's title tooltip.
 * @attr {string} price - Pre-formatted price string (consumer formatting; falls back to `ticker` when absent).
 * @attr {string} delta - Signed delta string («+3,8%» / «−0,12%»); the sign picks the color.
 * @prop {string} [href] - Present → the chip is a real anchor to the instrument page.
 * @slot logo - Roundel image/logo; empty → letter roundel from `ticker`.
 * @slot - `variant="overflow"`: the «Ещё N» count label (required content, consumer-owned).
 */
export class TkQuoteChip extends LitElement {
  /** Form union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['pill', 'inline', 'box', 'overflow'] as const;

  /** Display form. */
  @property({ reflect: true })
  variant: 'pill' | 'inline' | 'box' | 'overflow' = 'pill';

  /** Instrument ticker — the one required string; empty degrades to «—». */
  @property({ type: String })
  ticker = '';

  /** Full instrument name (tooltip/title only — never rendered inline). */
  @property({ type: String })
  name?: string;

  /** Pre-formatted price (the kit never parses it; absent → renders `ticker`). */
  @property({ type: String })
  price?: string;

  /** Signed delta string; its first sign character picks the tone. */
  @property({ type: String })
  delta?: string;

  /**
   * Anchor URL (string DATA — never reflects, CONVENTIONS §2; the reflected
   * surface is the inner anchor, the tk-link precedent). Present → the chip
   * renders a real `<a>`; absent → a display-only span.
   */
  @property({ type: String })
  href?: string;

  static override readonly styles = [quoteChipStyles];

  /** Whether the `logo` slot carries REAL content (the badge slot-presence mold). */
  #logoSlotted = false;

  /**
   * The delta tone, DERIVED from the string's first non-space character
   * (the frozen no-direction-prop ruling): `+` up, `−`/`-` down, anything
   * else — including an absent delta — neutral. U+2212 MINUS SIGN and the
   * ASCII hyphen both count: RU typography uses the former, sloppy data
   * the latter.
   */
  get #deltaTone(): 'up' | 'down' | 'flat' {
    const first = (this.delta ?? '').trim().charAt(0);
    if (first === '+') return 'up';
    if (first === '−' || first === '-') return 'down';
    return 'flat';
  }

  /** The letter roundel's glyph — the ticker's first grapheme, uppercased. */
  get #letter(): string {
    const first = [...(this.ticker || '')][0] ?? '';
    return (first || '—').toUpperCase();
  }

  /** The price line in force: `price` when set, `ticker` otherwise (a chip never renders an empty body). */
  get #priceLine(): string {
    return this.price ?? this.ticker ?? '';
  }

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default (never throws), reflected attribute
   * corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkQuoteChip.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'pill';
    }
  }

  /** Slot presence (the badge mold, verbatim): REAL content = element or non-empty text. */
  #syncLogoPresence(): void {
    const logoSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="logo"]');
    const has = (logoSlot?.assignedNodes({ flatten: true }) ?? []).some(
      (node: Node) =>
        node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
    if (has !== this.#logoSlotted) {
      this.#logoSlotted = has;
      this.requestUpdate();
    }
  }

  #handleSlotChange(): void {
    this.#syncLogoPresence();
  }

  /**
   * The chip's root: a real `<a>` with `href`, a plain `<span>` without —
   * native semantics by construction (the tk-link mold). Two explicit
   * templates, NOT a spread: the spread directive cannot carry `class`
   * (a known lit-html limitation — the anchor test caught it as a
   * class-less root).
   */
  #renderChip(body: ReturnType<typeof html>): ReturnType<typeof html> {
    const title = this.name ?? nothing;
    return this.href
      ? html`<a class="chip" href=${this.href} title=${title}>${body}</a>`
      : html`<span class="chip" title=${title}>${body}</span>`;
  }

  override render() {
    if (this.variant === 'overflow') {
      // The overflow pill's whole content is consumer-owned («Ещё N») —
      // the count rides the default slot verbatim.
      return this.#renderChip(html`<slot></slot>`);
    }

    if (this.variant === 'inline') {
      // The in-body `$TOKEN` form: link-blue, no fill, the ticker is the
      // whole text (CSS uppercases it to the reference's caps).
      return this.#renderChip(html`<span class="chip__token">$${this.ticker}</span>`);
    }

    // pill / box share one body: roundel (slotted logo or the letter
    // fallback) + the price/delta stack (the hub band's anatomy).
    return this.#renderChip(html`
      <span class="chip__logo">
        <slot name="logo" @slotchange=${this.#handleSlotChange}></slot>
        <span class="chip__letter" ?hidden=${this.#logoSlotted} aria-hidden="true"
          >${this.#letter}</span
        >
      </span>
      <span class="chip__body">
        <span class="chip__price">${this.#priceLine}</span>
        ${this.delta
          ? html`<span class="chip__delta chip__delta--${this.#deltaTone}">${this.delta}</span>`
          : nothing}
      </span>
    `);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-quote-chip': TkQuoteChip;
  }
}

if (!customElements.get('tk-quote-chip')) {
  customElements.define('tk-quote-chip', TkQuoteChip);
}
