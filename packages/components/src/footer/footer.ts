import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { footerStyles } from './footer.css.js';

/** One link of a footer column or the quick-links strip. */
export interface TkFooterLink {
  /** Visible link text (also the link's accessible name). */
  label: string;
  /** Navigation target — native anchor navigation. */
  href: string;
}

/** One link column of the `columns` prop. */
export interface TkFooterColumn {
  /** Group header — rendered in caps-s UPPERCASE (transform at render). */
  title: string;
  /** The directory links — a LIST (ul/li). */
  links: TkFooterLink[];
}

/**
 * Entry-shape guard (the render's crash boundary): a usable link carries a
 * non-empty string label AND href — anything else (null/undefined entries,
 * primitives, objects missing either field) is malformed consumer data.
 */
const isUsableLink = (entry: unknown): entry is TkFooterLink =>
  typeof entry === 'object' &&
  entry !== null &&
  typeof (entry as TkFooterLink).label === 'string' &&
  (entry as TkFooterLink).label.length > 0 &&
  typeof (entry as TkFooterLink).href === 'string' &&
  (entry as TkFooterLink).href.length > 0;

/**
 * tk-footer — the reference's grouped link directory (Story 3.5): a
 * contentinfo landmark whose link columns ARE LISTS, caps-s uppercase group
 * headers (the transform applied at render — the token carries no case),
 * ink-300 pill quick-links (the DESIGN `footer-pill-link` spec: ink fill,
 * white text, radius-full), a bold phone block, and body-xs legal
 * fine-print through the default slot.
 *
 * LANDMARK TECHNIQUE (the spec's noted pick): the SHADOW tree renders a
 * native `<footer>` element — implicit contentinfo, no role juggling on the
 * host — so the landmark composes like any built-in and the host stays a
 * plain block wrapper.
 *
 * STATELESS-OR-NEAR-IT: no channel, no controlled pair, nothing dispatches
 * (the event-map no-entry case, tk-button/tk-link precedent). ALL content
 * arrives via props + the default slot:
 * - `columns` — the directory (6–7 columns in the reference); a column with
 *   no title or no links is OMITTED (the spec's matrix row);
 * - `quickLinks` — the pill strip;
 * - `phone` — the bold contact block;
 * - default slot — the legal fine-print (body-xs; inline links inside it are
 *   the consumer's tk-link `legal` instances, composed not reimplemented).
 *
 * SURFACE RULING (probe NOTES): the reference's two-zone mega-footer (white
 * directory + hard-edged black legal strip) paints its dark strip at PAGE
 * level; the kit ships the flat directory + a divider-separated bottom zone
 * and the pills carry their OWN ink fill (they read on any surface). The
 * 96–120 section rhythm around the footer is the CONSUMER's layout — the
 * footer exposes only its internal paddings as hooks.
 *
 * SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tk-footer
 * @prop {TkFooterColumn[]} [columns] - Link columns; empty/title-less/link-less columns are omitted.
 * @prop {TkFooterLink[]} [quickLinks] - Ink pill quick-links strip.
 * @prop {string} [phone] - Bold contact block (plain text — wrap in your own tel link if needed).
 * @slot - Legal fine-print (body-xs); inline links compose tk-link `legal`.
 */
export class TkFooter extends LitElement {
  static override readonly styles = [footerStyles];

  /** The directory columns — array of { title, links: [{ label, href }] }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  columns: TkFooterColumn[] = [];

  /** The pill quick-links strip — same link shape as the column entries. */
  @property({ type: Array, attribute: false })
  quickLinks: TkFooterLink[] = [];

  /** The bold phone block — plain text; a tel: link is the consumer's composition. */
  @property({ type: String, attribute: 'phone' })
  phone?: string;

  /** Columns with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveColumns(): TkFooterColumn[] {
    return (this.columns ?? []).filter(
      (column) =>
        column != null &&
        typeof column.title === 'string' &&
        column.title.length > 0 &&
        Array.isArray(column.links) &&
        column.links.length > 0,
    );
  }

  /** Quick links with null/undefined clamped to the empty list. */
  get #effectiveQuickLinks(): TkFooterLink[] {
    return this.quickLinks ?? [];
  }

  /**
   * Malformed-entry clamp (the tk-navbar/tk-tabs mirror): a null/undefined
   * or shapeless entry inside `quickLinks` or a column's `links` would crash
   * render (`link.href` on null) — entries failing the isUsableLink shape
   * drop with a dev warn, as do columns that end up title-less or link-less.
   * CONVENTIONS §2 degrade-to-default spirit; the reassignment is
   * length-guarded so the follow-up update this schedules converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('quickLinks')) {
      const source = Array.isArray(this.quickLinks) ? this.quickLinks : [];
      const clean = source.filter(isUsableLink);
      if (clean.length !== source.length) {
        console.warn(
          'tk-footer: malformed quickLinks entries dropped — each entry needs non-empty string label and href',
        );
        this.quickLinks = clean;
      }
    }
    if (changed.has('columns')) {
      const source = Array.isArray(this.columns) ? this.columns : [];
      const clean: TkFooterColumn[] = [];
      let dropped = 0;
      for (const raw of source) {
        const column = raw as TkFooterColumn | null | undefined;
        const title = column?.title;
        const links = Array.isArray(column?.links) ? column.links : [];
        const cleanLinks = links.filter(isUsableLink);
        dropped += links.length - cleanLinks.length;
        if (typeof title === 'string' && title.length > 0 && cleanLinks.length > 0) {
          clean.push({ title, links: cleanLinks });
        } else {
          dropped += 1; // the column itself is unusable
        }
      }
      if (dropped > 0 || clean.length !== source.length) {
        console.warn(
          'tk-footer: malformed column entries dropped — columns need a non-empty title and at least one usable link',
        );
        this.columns = clean;
      }
    }
  }

  override render() {
    const columns = this.#effectiveColumns;
    const quickLinks = this.#effectiveQuickLinks;
    const phone = typeof this.phone === 'string' && this.phone.length > 0 ? this.phone : null;

    return html`
      <footer class="footer">
        ${columns.length > 0
          ? html`
              <div class="directory">
                ${columns.map(
                  (column) => html`
                    <section class="column">
                      <h3 class="column__header">${column.title}</h3>
                      <ul class="column__list">
                        ${(column.links ?? []).map((link) =>
                          isUsableLink(link)
                            ? html`
                                <li><a class="column__link" href=${link.href}>${link.label}</a></li>
                              `
                            : nothing,
                        )}
                      </ul>
                    </section>
                  `,
                )}
              </div>
            `
          : nothing}
        <div class="bottom">
          ${quickLinks.length > 0
            ? html`
                <ul class="pills">
                  ${quickLinks.map((link) =>
                    isUsableLink(link)
                      ? html`
                          <li><a class="pill" href=${link.href}>${link.label}</a></li>
                        `
                      : nothing,
                  )}
                </ul>
              `
            : nothing}
          ${phone != null ? html`<p class="phone">${phone}</p>` : nothing}
          <div class="legal">
            <slot></slot>
          </div>
        </div>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-footer': TkFooter;
  }
}

if (!customElements.get('tk-footer')) {
  customElements.define('tk-footer', TkFooter);
}
