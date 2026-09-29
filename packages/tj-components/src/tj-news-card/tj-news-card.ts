import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { newsCardStyles } from './tj-news-card.css.js';

/**
 * tj-news-card — the ТЖ single-link feed card (Story 16.3).
 *
 * The row-as-link mold TRANSLATED from the bank card family (never imported
 * — FR-17): ONE shadow `<a href>` wraps the whole card, so title + byline +
 * counts ride a single tab stop with a single accessible name (the name
 * computation rides the slotted title; an aria-labelledby pattern with a
 * consumer-owned heading id is demonstrated in the story — the component
 * adds no aria of its own beyond the skeleton/busy handling).
 *
 * Slots: `mark` (mini squircle, decorative — aria-hidden wrapper), `avatar`
 * (consumer image, keeps its own alt), `byline` (author name — byline tokens
 * 15/700/20 ink-100), `title` (news-title 24/700/30 ink-100; the slotted
 * heading keeps consumer heading-level freedom — h2 or h3, the component
 * never renders its own heading), `excerpt` (OPTIONAL both ways — the
 * article-body register at card scale 17/400, the flagged on-scale pick),
 * `meta` (timestamp + counts — time-meta 15/400 ink-300; counts are static
 * text, NEVER live regions). The card is FLAT: no shadow, no hover lift
 * (the 95-card census measured box-shadow none across the feed).
 *
 * `skeleton` boolean attribute: bones replace the slot content at the
 * flagged meta-ink alpha, the host carries `aria-busy="true"`, the bones
 * container is aria-hidden, and NO shimmer exists (reference skeleton
 * behavior unprobed — nothing invented). The anchor does not render while
 * skeleton (no empty focus stop); removing the attribute restores the live
 * slots. Empty optional slots never render bones.
 *
 * Anchor contract — the 16.1 tj-link mold verbatim: `href` empty/absent
 * renders the anchor WITHOUT the href attribute (inert content, not
 * focusable); `target` passes through; `rel` follows the bank 10.4 rule
 * (consumer rel wins verbatim, otherwise `noopener noreferrer` exactly
 * when target="_blank").
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tj-news-card
 * @prop {string} [href] - URL; empty/absent renders an inert anchor (no href attribute).
 * @prop {string} [target] - Pass-through browsing context for the inner anchor.
 * @prop {string} [rel] - Pass-through relationship; consumer rel wins verbatim.
 * @attr {boolean} [skeleton] - Render bone placeholders instead of slot content (aria-busy on host).
 * @slot mark - Mini squircle mark image (decorative; the wrapper is aria-hidden).
 * @slot avatar - Author avatar image (consumer-owned alt).
 * @slot byline - Author name (byline tokens, ink-100).
 * @slot title - The card heading (h2 or h3 — news-title species, ink-100).
 * @slot excerpt - Optional lead paragraph (article-body register at card scale).
 * @slot meta - Timestamp + counts row (time-meta species, ink-300; static text).
 */
export class TjNewsCard extends LitElement {
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
   * Bone mode — REFLECTS as the `skeleton` attribute (the bank article-card
   * mold): the host carries aria-busy while on, and the shadow root swaps
   * the anchor for an aria-hidden bones container.
   */
  @property({ type: Boolean, reflect: true })
  skeleton = false;

  /** Excerpt slot has content (drives the optional wrapper — graceful both ways). */
  #excerptSlotted = false;

  static override readonly styles = [newsCardStyles];

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

  #handleExcerptSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const next = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (next !== this.#excerptSlotted) {
      this.#excerptSlotted = next;
      this.requestUpdate();
    }
  }

  // Initial-mount backstop (the tj-rubric-header note): the slotchange
  // EVENT is queued inconsistently for the FIRST assignment, so every
  // render re-syncs the tracked presence from the live slot assignment —
  // the hidden catch-slot still receives assignments, so both template
  // branches read the same truth. Change-guarded: converges in one render.
  #syncExcerptPresence(): void {
    const slot = this.renderRoot.querySelector("slot[name='excerpt']") as HTMLSlotElement | null;
    const next = this.#slotHasContent(slot);
    if (next !== this.#excerptSlotted) {
      this.#excerptSlotted = next;
      this.requestUpdate();
    }
  }

  // The bank article-card mold: an ELEMENT node counts as content — bare
  // whitespace text nodes do not (template formatting noise).
  #slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
  }

  // aria-busy rides the HOST per the spec; toggled outside the render tree
  // (an attribute on the host cannot be set from within its own template).
  protected override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('skeleton')) {
      if (this.skeleton) {
        this.setAttribute('aria-busy', 'true');
      } else {
        this.removeAttribute('aria-busy');
      }
    }
    if (!this.skeleton) {
      this.#syncExcerptPresence();
    }
  }

  /** Bones mirror the card anatomy; NO excerpt bone (the optional slot never bones). */
  #renderSkeleton() {
    return html`
      <div class="card card--skeleton" aria-hidden="true">
        <div class="sk-row">
          <div class="sk sk--mark"></div>
          <div class="sk sk--word"></div>
        </div>
        <div class="sk sk--title"></div>
        <div class="sk sk--title sk--title-short"></div>
        <div class="sk sk--meta"></div>
      </div>
    `;
  }

  override render() {
    if (this.skeleton) return this.#renderSkeleton();
    return html`
      <a
        class="card"
        href=${this.#anchorHref()}
        target=${this.target != null && this.target.length > 0 ? this.target : nothing}
        rel=${this.#anchorRel()}
      >
        <span class="byline">
          <span class="byline__mark" aria-hidden="true"><slot name="mark"></slot></span>
          <span class="byline__avatar"><slot name="avatar"></slot></span>
          <span class="byline__author"><slot name="byline"></slot></span>
        </span>
        <span class="title"><slot name="title"></slot></span>
        ${this.#excerptSlotted
          ? html`
              <span class="excerpt">
                <slot name="excerpt" @slotchange=${this.#handleExcerptSlotchange}></slot>
              </span>
            `
          : html`<slot name="excerpt" @slotchange=${this.#handleExcerptSlotchange} hidden></slot>`}
        <span class="meta"><slot name="meta"></slot></span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-news-card': TjNewsCard;
  }
}

if (!customElements.get('tj-news-card')) {
  customElements.define('tj-news-card', TjNewsCard);
}
