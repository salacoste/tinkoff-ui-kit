import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { storeBadgesStyles } from './store-badges.css.js';

/**
 * One store entry of the `badges` prop — the frozen spec shape: a bare store
 * name + external URL (+ optional mark). The kit ships ZERO third-party brand
 * art: `iconSrc` is the CONSUMER-supplied mark (their own licensed asset),
 * and the block degrades to a label-only pill when it is unset.
 */
export interface TkStoreBadge {
  /** The link target — an EXTERNAL app-store URL; always opened in a new tab. */
  href: string;
  /** The bare store name («RuStore», «AppGallery») — the probe refutes any «Скачать в …» prefix. */
  label: string;
  /** Optional consumer-hosted brand mark; unset renders the label-only pill. */
  iconSrc?: string;
  /** Alt text for the mark; defaults to the store name (decorative-friendly). */
  iconAlt?: string;
}

/**
 * Zero-state copy (EXPERIENCE State Patterns — «never blank»): the default
 * text inside the `empty` slot; consumers project their own copy through
 * `<* slot="empty">`.
 */
export const TK_STORE_BADGES_DEFAULT_EMPTY_COPY = 'Нет доступных магазинов';

/**
 * tk-store-badges — the app-store badge row (Story 7.3): uniform light pills
 * — bare store name left, consumer-supplied mark right — each pill a whole-
 * surface external link, per the invest-mobile capture (probe: 324×80 pills,
 * radius 16, gap 60→space-64 — see .playwright-cli/verify/store-badges/).
 *
 * NO BRAND ART IN THE REPO (the spec's iron rule): the mark is `iconSrc`
 * data the consumer owns; the kit's own stories carry neutral placeholder
 * marks, never real store logos.
 *
 * EXTERNAL-LINK CONTRACT: every pill renders `target="_blank"` +
 * `rel="noopener noreferrer"` unconditionally (a badge row is by definition
 * third-party destinations).
 *
 * STATELESS (the display-component mold): no §4 channel, no events, nothing
 * dispatches (the event-map no-entry case). Degrades, never throws (§2):
 * null/undefined `badges` clamps to the empty list; `badges=[]` renders the
 * documented zero-state copy slot; a badge without `iconSrc` renders
 * label-only at the same size class.
 *
 * MOTION: none (the spec's never-list) — the hover fill step is instant.
 *
 * SSR-compat (AD-10): Lit templates only; no construction-time DOM access.
 *
 * @tag tk-store-badges
 * @prop {TkStoreBadge[]} badges - The store entries (label + external href + optional mark).
 * @slot empty - Zero-state copy for badges=[] (default «Нет доступных магазинов»).
 */
export class TkStoreBadges extends LitElement {
  static override readonly styles = [storeBadgesStyles];

  /** The store entries — array of { href, label, iconSrc?, iconAlt? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  badges: TkStoreBadge[] = [];

  /** Badges with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveBadges(): TkStoreBadge[] {
    return this.badges ?? [];
  }

  override render() {
    const badges = this.#effectiveBadges;

    if (badges.length === 0) {
      return html`
        <div class="badges badges--empty">
          <slot name="empty">${TK_STORE_BADGES_DEFAULT_EMPTY_COPY}</slot>
        </div>
      `;
    }

    return html`
      <ul class="badges">
        ${badges.map(
          (badge) => html`
            <li>
              <a
                class="badge"
                href=${badge.href ?? nothing}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="badge__label">${badge.label}</span>
                ${badge.iconSrc != null && badge.iconSrc.length > 0
                  ? html`
                      <img
                        class="badge__icon"
                        src=${badge.iconSrc}
                        alt=${badge.iconAlt ?? ''}
                        loading="lazy"
                        decoding="async"
                      />
                    `
                  : nothing}
              </a>
            </li>
          `,
        )}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-store-badges': TkStoreBadges;
  }
}

if (!customElements.get('tk-store-badges')) {
  customElements.define('tk-store-badges', TkStoreBadges);
}
