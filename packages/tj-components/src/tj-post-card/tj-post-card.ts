import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { postCardStyles } from './tj-post-card.css.js';

/**
 * tj-post-card — the ТЖ community post cell (Story 16.4).
 *
 * The grid cell of the community page's «Выбор редакции»: a TRANSPARENT
 * text-only card (no own background/radius/border/padding — the reference's
 * cells ride a shared white sheet owned by the consumer composition; boxing
 * them would break the composition — see the pattern story). The carrier is
 * the tj-news-card anchor mold TRANSLATED verbatim (never imported — FR-17):
 * ONE shadow `<a href>` wraps the whole cell, so byline → date → title →
 * count ride a single tab stop with one accessible name built from the
 * anchor's flattened subtree in DOM order (the 16.3 honest-prose mold — NO
 * host-level labelledby claims).
 *
 * Slots: `avatar` (meta-row mini avatar, 20px structural FLAG, aria-hidden
 * wrapper — identification rides the author name; graceful empty: no
 * phantom circle), `byline` (author name — byline 15/700/20 ink-100),
 * `date` (timestamp — time-meta 15/400 ink-300), `title` (the consumer's
 * h2/h3 — news-title 24/700/30 ink-100: the DESIGN row already names
 * community posts; the machine probe beats the vision's pixel-guess on
 * downscaled cells), `count` (the comment number — time-meta 15/400
 * ink-300, static text, NEVER a live region; the component renders a
 * decorative speech-bubble SVG aria-hidden before it, the chip-chevron
 * mold; graceful empty: no orphan bubble). The «·» joins are consumer-side
 * inside the byline/date slots, so an empty slot never leaves an orphan
 * separator.
 *
 * 2-line clamp (the EXPERIENCE contract verbatim): the slotted h2/h3 gets
 * the FLAGGED clamp quartet (-webkit-box / vertical / line-clamp 2 /
 * overflow hidden). Clamp recovery — the `title` attribute mirror: on
 * title-slot slotchange (and every update) the component sets the ANCHOR's
 * `title` to the trimmed textContent of the first assigned title element
 * (the full text rides the anchor as the tooltip). A consumer-set `title`
 * attribute/property on the HOST forwards verbatim and WINS — consumer
 * intent is never overwritten (the consumer-wins rule; the host `title` is
 * tracked as a reactive property so attribute add/change/remove re-syncs).
 *
 * Count placement fidelity note: the reference tucks the bubble at the
 * title's truncation line; the kit's count rides its own flow line after
 * the clamped title (a clamp box is a block — an inline sibling after it
 * cannot share its last line; no float hacks invented). Recorded for the
 * maintainer's side-by-side pass.
 *
 * Anchor contract — the 16.1 tj-link mold verbatim: `href` empty/absent
 * renders the anchor WITHOUT the href attribute (inert content, not
 * focusable); `target` passes through; `rel` follows the bank 10.4 rule
 * (consumer rel wins verbatim, otherwise `noopener noreferrer` exactly
 * when target="_blank").
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). No like/bookmark/engagement UI
 * (the capture knows none), no skeleton (unprobed). SSR-compat (AD-10):
 * rendered via Lit templates only.
 *
 * @tag tj-post-card
 * @prop {string} [href] - URL; empty/absent renders an inert anchor (no href attribute).
 * @prop {string} [target] - Pass-through browsing context for the inner anchor.
 * @prop {string} [rel] - Pass-through relationship; consumer rel wins verbatim.
 * @prop {string} [title] - Consumer tooltip override — forwards to the inner anchor verbatim and WINS over the slotted-title mirror.
 * @slot avatar - Mini author avatar (decorative — the wrapper is aria-hidden; graceful empty).
 * @slot byline - Author name (byline tokens, ink-100).
 * @slot date - Timestamp (time-meta tokens, ink-300); «·» joins live consumer-side.
 * @slot title - The post heading (h2 or h3 — news-title species, ink-100; 2-line clamp, full text mirrored to the anchor title).
 * @slot count - The comment number (time-meta tokens, ink-300; static text — never a live region).
 */
export class TjPostCard extends LitElement {
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

  /**
   * The CONSUMER-WINS tooltip channel: tracked as a reactive property so
   * BOTH consumption paths re-render — the ATTRIBUTE (Lit observes it via
   * attributeChangedCallback for declared properties) and the PROPERTY (the
   * React wrapper sets known props as element PROPERTIES, which never touch
   * the attribute — the accessor is Lit's, shadowing the native reflecting
   * one; NO reflect, or the mirror would read a phantom title="" on every
   * mount). Precedence in #syncAnchorTitle: a present ATTRIBUTE forwards
   * verbatim and wins (even empty — deliberate suppression); otherwise a
   * non-empty PROPERTY forwards verbatim; otherwise the slotted-title
   * mirror. Consumer intent wins on every path — the mirror is the fallback,
   * never the override.
   */
  @property({ type: String })
  override title = '';

  /** Avatar slot has content (drives the fixed-size wrapper — graceful empty). */
  #avatarSlotted = false;

  /** Count slot has content (drives the bubble line — no orphan icon). */
  #countSlotted = false;

  static override readonly styles = [postCardStyles];

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

  #handleAvatarSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const next = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (next !== this.#avatarSlotted) {
      this.#avatarSlotted = next;
      this.requestUpdate();
    }
  }

  #handleCountSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const next = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (next !== this.#countSlotted) {
      this.#countSlotted = next;
      this.requestUpdate();
    }
  }

  #handleTitleSlotchange(): void {
    this.#syncAnchorTitle();
  }

  // The bank article-card mold: an ELEMENT node counts as content — bare
  // whitespace text nodes do not (template formatting noise).
  #slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
  }

  // Initial-mount backstop (the tj-rubric-header note, the news-card excerpt
  // mold): the slotchange EVENT is queued inconsistently for the FIRST
  // assignment, so every render re-syncs the tracked presence from the live
  // slot assignment — the hidden catch-slots still receive assignments, so
  // both template branches read the same truth. Change-guarded.
  #syncOptionalSlots(): void {
    const avatarSlot = this.renderRoot.querySelector("slot[name='avatar']") as HTMLSlotElement | null;
    const avatarNext = this.#slotHasContent(avatarSlot);
    if (avatarNext !== this.#avatarSlotted) {
      this.#avatarSlotted = avatarNext;
      this.requestUpdate();
    }
    const countSlot = this.renderRoot.querySelector("slot[name='count']") as HTMLSlotElement | null;
    const countNext = this.#slotHasContent(countSlot);
    if (countNext !== this.#countSlotted) {
      this.#countSlotted = countNext;
      this.requestUpdate();
    }
  }

  /**
   * The clamp recovery + consumer-wins rule: the anchor's `title` mirrors
   * the slotted title's full trimmed text — UNLESS the consumer set a
   * `title` on the host, which forwards verbatim and wins (never overwrite
   * consumer intent; an empty ATTRIBUTE is a deliberate suppression).
   * Precedence: ATTRIBUTE presence (Lit observes it) → non-empty PROPERTY
   * (the React path — property writes never touch the attribute, the Lit
   * accessor shadows the native reflecting one) → the slot mirror.
   */
  #syncAnchorTitle(): void {
    const anchor = this.renderRoot.querySelector('a.card') as HTMLAnchorElement | null;
    const titleSlot = this.renderRoot.querySelector("slot[name='title']") as HTMLSlotElement | null;
    if (!anchor || !titleSlot) return;
    // null-safe: Lit maps an attribute REMOVAL to a null property write, so
    // this.title may be null here (the removal test pins this exact path).
    const hostTitle =
      this.getAttribute('title') ?? (this.title != null && this.title.length > 0 ? this.title : null);
    if (hostTitle !== null) {
      anchor.setAttribute('title', hostTitle); // consumer wins — verbatim
      return;
    }
    // The repo slot mold: assignedNodes + ELEMENT_NODE filter (happy-dom
    // quirk — the news-card/rubric-header idiom, no flatten needed for a
    // direct child assignment).
    const first = titleSlot
      .assignedNodes()
      .find((node) => node.nodeType === Node.ELEMENT_NODE) as HTMLElement | undefined;
    const text = first?.textContent?.trim() ?? '';
    if (text.length > 0) {
      anchor.setAttribute('title', text);
    } else {
      anchor.removeAttribute('title');
    }
  }

  protected override updated(): void {
    this.#syncOptionalSlots();
    this.#syncAnchorTitle();
  }

  override render() {
    return html`
      <a
        class="card"
        href=${this.#anchorHref()}
        target=${this.target != null && this.target.length > 0 ? this.target : nothing}
        rel=${this.#anchorRel()}
      >
        <span class="meta">
          ${this.#avatarSlotted
            ? html`
                <span class="meta__avatar" aria-hidden="true">
                  <slot name="avatar" @slotchange=${this.#handleAvatarSlotchange}></slot>
                </span>
              `
            : html`<slot name="avatar" @slotchange=${this.#handleAvatarSlotchange} hidden></slot>`}
          <span class="meta__author"><slot name="byline"></slot></span>
          <span class="meta__date"><slot name="date"></slot></span>
        </span>
        <span class="title">
          <slot name="title" @slotchange=${this.#handleTitleSlotchange}></slot>
        </span>
        ${this.#countSlotted
          ? html`
              <span class="count">
                <svg
                  class="count__icon"
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <slot name="count" @slotchange=${this.#handleCountSlotchange}></slot>
              </span>
            `
          : html`<slot name="count" @slotchange=${this.#handleCountSlotchange} hidden></slot>`}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-post-card': TjPostCard;
  }
}

if (!customElements.get('tj-post-card')) {
  customElements.define('tj-post-card', TjPostCard);
}
