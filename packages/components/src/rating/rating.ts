import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { ratingStyles } from './rating.css.js';

/**
 * The single star glyph (the chevron mold — inline SVG, no asset fetch;
 * 24-grid classic five-pointer, `fill: currentColor` so the CSS hook
 * layer owns the color).
 */
const starSvg = html`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path
    d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  ></path>
</svg>`;

/** Russian decimal comma: 4.5 → «4,5»; integers stay bare (AC2's wording). */
const formatValue = (value: number): string => String(value).replace('.', ',');

/**
 * tk-rating — the kit's read-only star rating (spec 21.5, invest
 * foundation wave, GAP-MAP A7).
 *
 * The bond-catalog row's star cluster (bonds-list grounding): filled
 * yellow stars under the instrument's name/ISIN. STATELESS DISPLAY (the
 * tk-progress-bar ruling): `value` is an INPUT, not state — nothing
 * dispatches (the completeness guard's no-entry case), and display-side
 * math CLAMPS into [0, 5] without mutating the prop: `value` 7 renders
 * five stars while the property keeps 7.
 *
 * MEASUREMENT OVERRIDES (both documented in the spec's execution record):
 * - NO empty neutral slots: the live row paints only the filled integer
 *   stars — the spec draft's «пустая нейтраль» guess dies to the pixels
 *   (clean page white right of every cluster).
 * - NO `count`: its grounding premise (the reviews page's platform cards)
 *   did not survive the lens pass — the page is a leave-a-review promo
 *   (census: «Оставьте отзыв…»), no counts, no store cards anywhere.
 *   The AC tied count's existence to that grounding, so the prop dies
 *   with it — a count surface is minted when a real реке row shows one.
 *
 * A11y (AC2): the HOST carries `role="img"` (self-asserted at connect —
 * the React-19 law, the tk-menu-item idiom) with
 * `aria-label="Рейтинг N из 5"`, comma-decimal per RU convention. NOT
 * interactive: no tabindex, no focus, no pointer affordances — an
 * interactive rating input is explicitly out of scope (the spec's own
 * roster ruling: ungrounded).
 *
 * Partial stars (the 0.5 schema grid; the wild values are integers):
 * floor(value) full stars plus ONE star clipped by an inline
 * `clip-path: inset(0 N% 0 0)` — the width-percentage clip AC3 demands,
 * no second SVG. value 0 renders zero stars; the named img remains.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the only
 * imperative steps are the two host attribute writes in
 * connectedCallback/willUpdate, after the element exists.
 *
 * @tag tk-rating
 * @attr {number} value - Rating 0–5 (0.5-step schema, live = integers); display-clamped, never mutated, never reflected (CONVENTIONS §2).
 */
export class TkRating extends LitElement {
  static override readonly styles = [ratingStyles];

  /**
   * Rating value — an INPUT, not state. Number data never reflects
   * (CONVENTIONS §2); a non-numeric attribute reads NaN and displays as
   * 0 (the progress-bar non-finite guard).
   */
  @property({ type: Number })
  value = 0;

  /**
   * The value in force: clamped into [0, 5]; non-finite reads as 0. The
   * PROP is never touched (the stateless-display ruling).
   */
  get #effectiveValue(): number {
    const raw = typeof this.value === 'number' ? this.value : Number(this.value);
    const numeric = Number.isFinite(raw) ? raw : 0;
    return Math.min(5, Math.max(0, numeric));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 construction safety + the
    // React-19 law): constructor-time attributes never reach React's
    // committed node — the identity re-asserts on every connect (the
    // tk-menu-item idiom).
    this.setAttribute('role', 'img');
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // The accessible name is derived state (AC2): recompute on every
    // value change; harmless on the first pass after connect asserted it.
    if (changed.has('value')) {
      this.setAttribute('aria-label', `Рейтинг ${formatValue(this.#effectiveValue)} из 5`);
    }
  }

  override render() {
    const value = this.#effectiveValue;
    const full = Math.floor(value);
    const fraction = value - full;
    return html`
      ${Array.from({ length: full }, () => html`<span class="rating__star">${starSvg}</span>`)}
      ${fraction > 0
        ? html`<span
            class="rating__star rating__star--partial"
            style="clip-path: inset(0 ${((1 - fraction) * 100).toFixed(2)}% 0 0)"
            >${starSvg}</span
          >`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-rating': TkRating;
  }
}

if (!customElements.get('tk-rating')) {
  customElements.define('tk-rating', TkRating);
}
