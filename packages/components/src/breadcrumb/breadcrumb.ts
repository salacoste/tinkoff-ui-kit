import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { breadcrumbStyles } from './breadcrumb.css.js';

/**
 * One crumb-trail stop: consumer-supplied DATA — the label and, for every
 * stop except the last, the href it points at.
 */
export interface TkBreadcrumbItem {
  /** The visible stop label. */
  label: string;
  /** Where the stop points; absent on a non-last stop degrades it to
   *  plain text (never a dead anchor). */
  href?: string;
}

/**
 * tk-breadcrumb — the crumb trail (spec 24.9, pattern wave 24b): the
 * «Инвестиции / Раскрытие информации» opener of the invest inner pages —
 * gap-8 counted ZERO implementations repo-wide, so the trail joins the kit
 * as the wave's one companion atom (Решение 5).
 *
 * WHAT THE ATOM OWNS: the nav landmark with its accessible name (the
 * pagination mold — a `label` attr, «Хлебные крошки» by default), the
 * ol/li structure, the aria-current="page" terminal (the LAST stop is
 * plain text — never a link to itself), and the decorative chevrons
 * between stops. WHAT IT DOES NOT: routing semantics (the hrefs are
 * consumer DATA rendered as native anchors — the atom never intercepts
 * them), any state (STATELESS — zero events, the display-component mold;
 * no event-map entry by design).
 *
 * DEGRADE (§2, never throws): a non-array `items` renders nothing at all
 * (an empty nav landmark would be noise); a non-last stop without an href
 * degrades to plain text rather than a dead anchor; the last stop ignores
 * any href it carries — current is current.
 *
 * SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-breadcrumb
 * @attr {string} [label] - The nav landmark's accessible name (default «Хлебные крошки»).
 * @prop {TkBreadcrumbItem[]} [items] - The trail, outermost first; the last entry renders as the current page.
 */
export class TkBreadcrumb extends LitElement {
  static override readonly styles = [breadcrumbStyles];

  /** The nav landmark's accessible name. */
  @property({ type: String })
  label?: string;

  /** The trail's DATA — rendered outermost-first; the last stop is current. */
  @property({ type: Array, attribute: false })
  items?: TkBreadcrumbItem[];

  override render() {
    const items = Array.isArray(this.items) ? this.items : [];
    if (items.length === 0) return nothing;
    const label = this.label ?? 'Хлебные крошки';
    return html`
      <nav class="breadcrumb" aria-label=${label}>
        <ol class="breadcrumb__list">
          ${items.map((item, index) => {
            const isLast = index === items.length - 1;
            const text = item?.label ?? '';
            const href = typeof item?.href === 'string' ? item.href : undefined;
            return html`
              <li class="breadcrumb__item">
                ${isLast
                  ? nothing
                  : html`<span class="breadcrumb__separator" aria-hidden="true"
                      ><svg viewBox="0 0 8 14" width="8" height="14">
                        <path
                          d="M1 1l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg></span
                    >`}
                ${isLast || href === undefined
                  ? html`<span class="breadcrumb__current" aria-current=${isLast ? 'page' : nothing}>${text}</span>`
                  : html`<a class="breadcrumb__link" href=${href}>${text}</a>`}
              </li>
            `;
          })}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-breadcrumb': TkBreadcrumb;
  }
}

if (!customElements.get('tk-breadcrumb')) {
  customElements.define('tk-breadcrumb', TkBreadcrumb);
}
