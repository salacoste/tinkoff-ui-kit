import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { paginationStyles } from './pagination.css.js';

/** Payload of `page-change` (CONVENTIONS §3): the unwrapped new page number. */
export interface TkPaginationChangeDetail {
  value: number;
}

/** Typed shape of the tk-pagination `page-change` event (CONVENTIONS §7). */
export type TkPaginationChangeEvent = CustomEvent<TkPaginationChangeDetail>;

/** One slot of the windowed numbers row: a page number, or the ellipsis marker. */
export type TkPaginationToken = number | 'ellipsis';

/** The nav landmark's default accessible name («Пагинация» per the spec). */
export const TK_PAGINATION_DEFAULT_NAV_LABEL = 'Пагинация';

/** The load-more bar's default label («Показать еще» per the spec). */
export const TK_PAGINATION_DEFAULT_MORE_LABEL = 'Показать еще';

/** Below this page count the row never elides — every number renders (the spec's count≤7 row). */
export const TK_PAGINATION_FULL_ROW_MAX = 7;

/**
 * The windowed numbers row — the capture's own shape (active=1, count=196
 * renders `1 2 3 4 5 … 196`): ALWAYS render the first and the last page,
 * render FIVE consecutive pages — the ±2 window around `page`, SHIFTED to
 * stay inside [1, count] at the edges (page 1 keeps the capture's full
 * 1..5 lead; the last pages keep a full five-number tail), collapse every
 * gap ≥ 2 between consecutive kept pages into ONE ellipsis, and dedupe when
 * the windows overlap (the Set union). A naive unshifted ±2 set would lose
 * the capture's `4 5` at page 1 — the anchor shift is what the frozen
 * block's own example pins. Pure — unit-tested as a parametrized table.
 */
export function windowedPages(page: number, count: number): TkPaginationToken[] {
  if (count <= TK_PAGINATION_FULL_ROW_MAX) {
    return Array.from({ length: Math.max(count, 0) }, (_, i) => i + 1);
  }
  const windowStart = Math.min(Math.max(page - 2, 1), count - 4);
  const kept = new Set<number>([1, count]);
  for (let p = windowStart; p < windowStart + 5; p += 1) kept.add(p);
  const sorted = [...kept].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const tokens: TkPaginationToken[] = [];
  for (const p of sorted) {
    const previous = tokens[tokens.length - 1];
    if (typeof previous === 'number' && p - previous >= 2) tokens.push('ellipsis');
    tokens.push(p);
  }
  return tokens;
}

/**
 * tk-pagination — the data-view pager (Story 6.2): numbered pages nav with a
 * yellow active pill, windowed numbers with ellipsis, prev/next chevrons,
 * and a SEPARATE full-width «Показать еще» bar above the numbers.
 *
 * ANATOMY (vision-extracted from pattern-table-stocks.png, bottom third): a
 * `<nav>` landmark (aria-label «Пагинация» by default, overridable) with a
 * CENTERED row — prev chevron ‹ (text-muted + aria-disabled at the lower
 * boundary), page numbers as text buttons in the link blue with NO fill
 * (the kit consumes the `--tk-color-link` semantic — blue-100's dark-remapped
 * alias), the ACTIVE page a yellow-100 pill (radius-full, ~32px) with ink-300
 * text at weight 700, an ellipsis «…» (text-secondary, aria-hidden) wherever
 * a number gap ≥ 2 collapses, and the next chevron › (disabled at the upper
 * boundary). ABOVE the numbers, its own row: the «Показать еще» bar —
 * surface-muted fill, radius-md, ~44px, link-on-tint centered label (the AA
 * on-tint step: blue-100 measures under 4.5:1 on the muted fill) — emitting
 * the bare-verb `load-more` occurrence and NOT changing page (the consumer
 * appends; focus stays on the bar).
 *
 * THE ACTIVE PAGE'S FOCUSABILITY — the recorded pick: FOCUSABLE-BUT-CURRENT.
 * The active number is a real button carrying `aria-current="page"` whose
 * activation is a no-op (it is already the page in force) — not a rendered
 * non-interactive span. Rationale: the focus-discipline row below needs a
 * FOCUSABLE target for the newly-active number after every page change, and
 * a flat tab order over the row keeps Tab = reading order. WCAG sanctions
 * either shape; this one composes with the kit's focus guarantees.
 *
 * FOCUS DISCIPLINE (EXPERIENCE): after a `page-change` the numbers row
 * re-renders — focus lands on the NEWLY-ACTIVE page button (never drops to
 * body; the reference defect class the kit improves). Both direct number
 * presses and prev/next route through the same landing. Prev/next wrap is
 * FORBIDDEN (boundary = aria-disabled, no emit — the reference model).
 *
 * STATEFUL API — the §4 contract frozen at 2.1, number channel: `page`
 * strict-controlled (renders exactly `page`; a page press emits
 * `page-change` and applies nothing locally), `defaultPage` seeds
 * uncontrolled (later changes ignored), releasing `page` goes uncontrolled
 * seeded from the last controlled value. Out-of-range pages clamp into
 * [1, count] per §2 — the channel itself is corrected (invalid runtime
 * values degrade, never throw). `count` clamps to ≥ 1; at count = 1 the
 * numbers row is hidden entirely (a single page needs no pager — the nav
 * renders the load-more bar only when `showMore` is set, nothing at all
 * otherwise).
 *
 * Numbers are BUTTONS (native focus), not links — the kit component has no
 * URL model; consumers needing routes intercept `page-change` (documented in
 * the story notes).
 *
 * @tag tk-pagination
 * @attr {string} label - The nav landmark's accessible name (default «Пагинация»).
 * @attr {number} count - Total page count (≥ 1; invalid values clamp to 1).
 * @attr {number} default-page - Initial page for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} show-more - Renders the separate full-width «Показать еще» bar (default false).
 * @attr {string} more-label - The load-more bar's label (default «Показать еще»).
 * @fires page-change - `{ value: number }` with the unwrapped newly active page; composed, bubbles.
 * @fires load-more - Occurrence (no payload): the bar was pressed; the page does NOT change.
 */
export class TkPagination extends LitElement {
  static override readonly styles = [paginationStyles];

  /** The nav landmark's accessible name. */
  @property({ type: String })
  label?: string;

  /** Total page count — clamps to ≥ 1 (§2 degrade-to-default, never throws). */
  @property({ type: Number })
  count = 1;

  /**
   * Controlled page channel — STRICT semantics (frozen at 2.1, number
   * mirror of tk-select's string channel): the element renders exactly this
   * page; a press emits `page-change` and applies nothing locally.
   * Property-only (`attribute: false`); non-numbers set via JS clamp to
   * their numeric form, out-of-range values clamp into [1, count] (§2 — the
   * channel is corrected); null/undefined after control RELEASES to
   * uncontrolled seeded from the last controlled page.
   */
  @property({ type: Number, attribute: false })
  page?: number;

  /** Initial page for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: Number, attribute: 'default-page' })
  defaultPage?: number;

  /** Renders the separate full-width «Показать еще» bar (reflected — the §2 boolean hook). */
  @property({ type: Boolean, reflect: true, attribute: 'show-more' })
  showMore = false;

  /** The load-more bar's label. */
  @property({ type: String, attribute: 'more-label' })
  moreLabel?: string;

  /** Live uncontrolled state (the truth whenever `page` is not provided). */
  #uncontrolledPage = 1;

  /** Last number ever provided through the controlled channel — the seed on release. */
  #lastControlledPage: number | undefined;

  /** Whether the controlled channel has ever supplied a page. */
  #isControlled = false;

  /**
   * The page whose button takes focus once the row re-renders it — set by
   * every user-initiated page change, consumed (and cleared) in `updated()`
   * when the effective page matches. Strict mode keeps it pending through
   * the consumer's silence and lands it the moment the consumer answers.
   */
  #focusPage: number | null = null;

  /** Count in force: invalid runtime values degrade to 1 (§2). */
  get #effectiveCount(): number {
    return Number.isFinite(this.count) && this.count >= 1 ? Math.floor(this.count) : 1;
  }

  /** The page in force: the controlled channel exactly, the internal state otherwise — clamped into [1, count]. */
  get #effectivePage(): number {
    const raw = this.#isControlled ? this.page : this.#uncontrolledPage;
    const numeric = typeof raw === 'number' && Number.isFinite(raw) ? raw : 1;
    return Math.min(Math.max(numeric, 1), this.#effectiveCount);
  }

  /**
   * The frozen §4 state transitions (tk-select's numeric mirror) + the §2
   * clamps: non-number pages coerce to their numeric form, out-of-range
   * channels clamp into [1, count] (both when a page arrives and when the
   * count shifts under it), and `count` itself degrades to 1.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultPage') && !this.hasUpdated) {
      this.#uncontrolledPage = this.#coercePage(this.defaultPage, this.#uncontrolledPage);
    }
    if (changed.has('count') && (!Number.isFinite(this.count) || this.count < 1)) {
      this.count = 1;
    }
    if (changed.has('page')) {
      if (this.page != null && typeof this.page !== 'number') {
        this.page = this.#coercePage(this.page, undefined);
        this.#isControlled = true;
        this.#lastControlledPage = this.page;
      } else if (typeof this.page === 'number') {
        this.#isControlled = true;
        this.#lastControlledPage = this.page;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledPage = this.#lastControlledPage ?? 1;
      }
    }
    // The out-of-range clamp runs on both channels that can invalidate it (a
    // page arriving outside the range, or the count shrinking under a valid
    // page). Uncontrolled state needs no correction here — #effectivePage
    // clamps at read time.
    if ((changed.has('page') || changed.has('count')) && this.#isControlled && typeof this.page === 'number') {
      const clamped = Math.min(Math.max(this.page, 1), this.#effectiveCount);
      if (clamped !== this.page) {
        this.page = clamped;
        this.#lastControlledPage = clamped;
      }
    }
  }

  /** Numeric coercion for the page channel: Number() first, invalid → fallback (§2). */
  #coercePage(raw: unknown, fallback: number | undefined): number {
    const numeric = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(numeric) ? numeric : (fallback ?? 1);
  }

  /**
   * Focus discipline: land focus on the NEWLY-ACTIVE page button once the
   * row renders it. The pending target clears on the first update that
   * processes it — when the effective page matches (uncontrolled commit, or
   * the consumer answered) focus lands; on a strict revert the pending dies
   * quietly (focus simply stays on the pressed button, which never dropped).
   */
  override updated(): void {
    if (this.#focusPage === null) return;
    const target = this.#focusPage;
    this.#focusPage = null;
    if (target !== this.#effectivePage) return;
    this.renderRoot
      .querySelector<HTMLButtonElement>(`[data-page="${target}"]`)
      ?.focus();
  }

  // --- state transitions --------------------------------------------------------

  /**
   * The single page-change pipeline (number presses and prev/next both land
   * here): boundary-guarded, a no-op on the current page (clicking the
   * active number emits nothing — it IS the page in force). Uncontrolled
   * commits locally; controlled applies nothing (strict) — the pending
   * focus target survives the consumer's silence and lands when they answer.
   */
  #commitPage(page: number): void {
    const count = this.#effectiveCount;
    if (page < 1 || page > count) return;
    if (page === this.#effectivePage) return;
    this.#focusPage = page;
    if (!this.#isControlled) {
      this.#uncontrolledPage = page;
      this.requestUpdate();
    }
    this.dispatchEvent(
      new CustomEvent<TkPaginationChangeDetail>('page-change', {
        detail: { value: page },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /** The load-more occurrence: no payload, page UNCHANGED, focus stays on the bar. */
  #handleLoadMore(): void {
    this.dispatchEvent(
      new CustomEvent('load-more', {
        composed: true,
        bubbles: true,
      }),
    );
  }

  #prevDisabled(): boolean {
    return this.#effectivePage <= 1;
  }

  #nextDisabled(): boolean {
    return this.#effectivePage >= this.#effectiveCount;
  }

  // --- render ---------------------------------------------------------------------

  override render() {
    const count = this.#effectiveCount;
    const current = this.#effectivePage;
    const showNumbers = count > 1;
    if (!showNumbers && !this.showMore) return nothing;
    const name = this.label != null && this.label.length > 0 ? this.label : TK_PAGINATION_DEFAULT_NAV_LABEL;
    const moreLabel = this.moreLabel != null && this.moreLabel.length > 0 ? this.moreLabel : TK_PAGINATION_DEFAULT_MORE_LABEL;

    return html`
      <nav class="pagination" aria-label=${name}>
        ${this.showMore
          ? html`<button type="button" class="load-more" @click=${this.#handleLoadMore}>
              ${moreLabel}
            </button>`
          : nothing}
        ${showNumbers
          ? html`<ol class="pages">
              <li>
                <button
                  type="button"
                  class="step step--prev"
                  aria-label="Предыдущая страница"
                  aria-disabled=${this.#prevDisabled() ? 'true' : nothing}
                  @click=${() => this.#commitPage(current - 1)}
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M10 3.5L5.5 8l4.5 4.5"></path>
                  </svg>
                </button>
              </li>
              ${windowedPages(current, count).map((token) =>
                token === 'ellipsis'
                  ? html`<li class="ellipsis" aria-hidden="true">…</li>`
                  : html`<li>
                      <button
                        type="button"
                        class=${token === current ? 'page page--active' : 'page'}
                        data-page=${token}
                        aria-current=${token === current ? 'page' : nothing}
                        @click=${() => this.#commitPage(token)}
                      >
                        <span class="page__pill">${token}</span>
                      </button>
                    </li>`,
              )}
              <li>
                <button
                  type="button"
                  class="step step--next"
                  aria-label="Следующая страница"
                  aria-disabled=${this.#nextDisabled() ? 'true' : nothing}
                  @click=${() => this.#commitPage(current + 1)}
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 3.5L10.5 8 6 12.5"></path>
                  </svg>
                </button>
              </li>
            </ol>`
          : nothing}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-pagination': TkPagination;
  }
}

if (!customElements.get('tk-pagination')) {
  customElements.define('tk-pagination', TkPagination);
}
