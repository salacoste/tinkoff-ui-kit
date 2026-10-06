import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { carouselStyles } from './carousel.css.js';

/** Payload of `page-change` (CONVENTIONS §3): the unwrapped 1-based page. */
export interface TkCarouselChangeDetail {
  page: number;
}

/** Typed shape of the tk-carousel `page-change` event (CONVENTIONS §7). */
export type TkCarouselChangeEvent = CustomEvent<TkCarouselChangeDetail>;

/**
 * The chevron glyphs (the select field's 24-grid stroke family — inline
 * SVG, no asset fetch; `stroke: currentColor` so the CSS hook layer owns
 * the color).
 */
const chevronLeftSvg = html`<svg
  aria-hidden="true"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M14.5 6l-6 6 6 6"></path>
</svg>`;

const chevronRightSvg = html`<svg
  aria-hidden="true"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9.5 6l6 6-6 6"></path>
</svg>`;

/**
 * tk-carousel — the kit's horizontal card carousel (spec 21.6, invest
 * foundation wave, GAP-MAP A2: the most repeated candidate of the whole
 * recon — tk-scroll-row ≡ tk-carousel ≡ horizontal card carousel is ONE
 * primitive, census 46+95+5 rails across three pages).
 *
 * Architecture: a NATIVE scroll-snap scroller — `overflow-x: auto` +
 * `scroll-snap-type: x mandatory` on the rail, light-DOM cards as the
 * default slot's flat-tree flex children. NO transform track, NO
 * virtualization, NO autoplay, NO loop (all out of scope by the spec's
 * own rulings). The keyboard stays NATIVE: card links tab through the
 * light DOM on their own and the browser's arrow-key scrolling needs no
 * duplicate — the atom adds no key handlers at all.
 *
 * Chrome (all measured, see the css sheet's header table):
 * - chevron prev/next — circular, white on the dropdown shadow token,
 *   revealed on rail hover/focus (statics on the live site paint none —
 *   the threshold-corrected scans are the proof); page-step scrolling
 *   (± the rail's clientWidth); `disabled` at the edges.
 * - `dots` — decorative pagination dots (aria-hidden, NON-clickable):
 *   8px, 16px pitch, active = the existing yellow (byte-identical to
 *   the live probe), 16px under the rail.
 *
 * Semantics: the HOST is `role="region"` with
 * `aria-roledescription="карусель"` and `aria-label` from the REQUIRED
 * `label` property — a carousel without a name is an axe violation, so
 * the prop is contract-mandatory. NO aria-live (the spec's ruling: no
 * live region for scroll position).
 *
 * STATE: ONE §9 channel — `page-change` (spec 27.4, the events audit's
 * P1: the 24.8 infinite-feed pattern had to build a
 * DriveFirstAppend workaround directive precisely because the page
 * change was unobservable). The rail's position is DERIVED geometry —
 * the atom emits only when the snap page INDEX actually changes (never
 * per scroll tick), from chevron page-steps, native/drag/keyboard
 * scrolling and programmatic scrolls alike — one funnel: #syncFromRail.
 * The FIRST render establishes the baseline silently (the §9 silence,
 * the accordion-item/note mold); `detail.page` is 1-based.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative
 * steps (host attribute writes, scroll sync) run after the element
 * exists.
 *
 * @tag tk-carousel
 * @attr {string} label - REQUIRED accessible name of the region (e.g. «Похожие акции»).
 * @attr {boolean} dots - Paint the decorative dot pagination under the rail.
 * @fires page-change - `{ page: number }` with the newly active 1-based snap page; composed, bubbles; silent on the first render and on intra-page scroll ticks.
 * @slot - The cards (light DOM; width/height and card chrome are consumer-side).
 */
export class TkCarousel extends LitElement {
  static override readonly styles = [carouselStyles];

  /** REQUIRED accessible name — the region is unnamed without it. */
  @property()
  label = '';

  /** Paint the decorative dot pagination (aria-hidden, non-clickable). */
  @property({ type: Boolean })
  dots = false;

  /** Derived scroll state — the page index is the ONE §9 channel. */
  #canPrev = false;
  #canNext = true;
  #pages = 1;
  #active = 0;

  /**
   * The §9 silence guard: null until the first sync establishes the
   * baseline (no emit), then the last emitted 0-based page — a change
   * of `#active` alone is what emits.
   */
  #emittedPage: number | null = null;

  #resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 construction safety + the
    // React-19 law): constructor-time attributes never reach React's
    // committed node — the identity re-asserts on every connect (the
    // tk-menu-item idiom).
    this.setAttribute('role', 'region');
    this.setAttribute('aria-roledescription', 'карусель');
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    }
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // The name is derived from the prop — keep the attribute fresh.
    if (changed.has('label')) {
      if (this.label) {
        this.setAttribute('aria-label', this.label);
      } else {
        this.removeAttribute('aria-label');
      }
    }
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    super.disconnectedCallback();
  }

  #rail(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.carousel__rail') ?? null;
  }

  /** Recompute the derived state from the live rail geometry. */
  #syncFromRail(): void {
    const rail = this.#rail();
    if (!rail) {
      return;
    }
    const width = Math.max(1, rail.clientWidth);
    const max = rail.scrollWidth - rail.clientWidth;
    const left = rail.scrollLeft;
    const canPrev = left > 0;
    const canNext = left < max - 1;
    const pages = Math.max(1, Math.ceil(rail.scrollWidth / width));
    const active = Math.min(pages - 1, Math.max(0, Math.round(left / width)));
    if (
      canPrev !== this.#canPrev ||
      canNext !== this.#canNext ||
      pages !== this.#pages ||
      active !== this.#active
    ) {
      this.#canPrev = canPrev;
      this.#canNext = canNext;
      this.#pages = pages;
      this.#active = active;
      this.requestUpdate();
    }
    // The §9 funnel: the baseline lands silently, every real page CHANGE
    // emits — chevron steps, native scrolls and programmatic scrolls all
    // converge here (the 27.4 audit's P1).
    if (this.#emittedPage !== null && active !== this.#emittedPage) {
      this.dispatchEvent(
        new CustomEvent<TkCarouselChangeDetail>('page-change', {
          detail: { page: active + 1 },
          composed: true,
          bubbles: true,
        }),
      );
    }
    this.#emittedPage = active;
  }

  override firstUpdated(): void {
    this.#syncFromRail();
    if (typeof ResizeObserver !== 'undefined') {
      this.#resizeObserver = new ResizeObserver(() => this.#syncFromRail());
      const rail = this.#rail();
      if (rail) {
        this.#resizeObserver.observe(rail);
      }
    }
  }

  #handleSlotChange(): void {
    this.#syncFromRail();
  }

  #handleScroll(): void {
    this.#syncFromRail();
  }

  /** Page-step scroll: one rail viewport per click (the spec's AC). */
  #scroll(direction: 1 | -1): void {
    const rail = this.#rail();
    if (!rail) {
      return;
    }
    const reduced =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof rail.scrollBy === 'function') {
      rail.scrollBy({
        left: direction * rail.clientWidth,
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  }

  override render() {
    return html`
      <div class="carousel">
        <div class="carousel__frame">
          <div class="carousel__rail" @scroll=${this.#handleScroll}>
            <slot @slotchange=${this.#handleSlotChange}></slot>
          </div>
          <button
            class="carousel__chev carousel__chev--prev"
            type="button"
            aria-label="Назад"
            ?disabled=${!this.#canPrev}
            @click=${() => this.#scroll(-1)}
          >
            ${chevronLeftSvg}
          </button>
          <button
            class="carousel__chev carousel__chev--next"
            type="button"
            aria-label="Вперёд"
            ?disabled=${!this.#canNext}
            @click=${() => this.#scroll(1)}
          >
            ${chevronRightSvg}
          </button>
        </div>
        ${this.dots
          ? html`<div class="carousel__dots" aria-hidden="true">
              ${Array.from(
                { length: this.#pages },
                (_, index) =>
                  html`<span
                    class="carousel__dot ${index === this.#active ? 'carousel__dot--active' : ''}"
                  ></span>`,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-carousel': TkCarousel;
  }
}

if (!customElements.get('tk-carousel')) {
  customElements.define('tk-carousel', TkCarousel);
}
