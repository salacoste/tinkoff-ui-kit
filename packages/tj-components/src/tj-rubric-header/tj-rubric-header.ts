import { LitElement, html } from 'lit';

import { rubricHeaderStyles } from './tj-rubric-header.css.js';

/**
 * tj-rubric-header — the ТЖ rubric landing head (Story 16.2).
 *
 * A LAYOUT surface, slots only — no properties, no variants: the `cover`
 * slot (the slotted `<img>` gets panel-radius top-corner clipping +
 * object-fit cover; consumer alt is mandatory-by-contract, an empty alt is
 * acceptable for decorative covers), the `mark` slot (the 100×100 squircle
 * art — the component wraps it in an aria-hidden decorative box; overlap =
 * half the mark over the cover boundary, the spec's structural FLAG), and
 * the DEFAULT slot = the consumer's `<h1>` (styled `::slotted(h1)` rubric-h1
 * 38/700/45 ink-100) + subtitle flow (`::slotted(p)` card-title 17/400, the
 * flagged on-scale pick). Card surface, panel radius — the component NEVER
 * renders its own heading element (the no-heading-invention rule).
 *
 * Graceful-empty contract (spec 16.2 edge matrix): a missing cover renders
 * no overlap art (the mark drops into normal flow); a missing mark renders
 * no mark box at all; an empty default slot renders the padded card body.
 * Slot presence is tracked via slotchange (the bank article-card mold) —
 * display bookkeeping only, nothing dispatches.
 *
 * Unknown slotted tags are unstyled inert passthrough (BYO content
 * contract — the dev note lives in the story).
 *
 * STATELESS (the simple-component mold): no channel, no controlled pair,
 * nothing dispatches — the event-map no-entry ruling
 * (packages/tj-react/src/event-map.ts). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tj-rubric-header
 * @slot cover - Cover image (an `<img>`; alt mandatory-by-contract, empty alt for decorative covers).
 * @slot mark - The 100×100 squircle mark image (decorative; the wrapper is aria-hidden).
 * @slot - The consumer's h1 (rubric-h1) and subtitle p (card-title) flow.
 */
export class TjRubricHeader extends LitElement {
  /** Cover art present (drives the mark overlap class — display bookkeeping only). */
  #coverSlotted = false;

  /** Mark art present (drives whether the mark box renders at all). */
  #markSlotted = false;

  static override readonly styles = [rubricHeaderStyles];

  #handleCoverSlotchange(event: Event): void {
    this.#coverSlotted = this.#slotHasContent(event.target as HTMLSlotElement);
    this.requestUpdate();
  }

  #handleMarkSlotchange(event: Event): void {
    this.#markSlotted = this.#slotHasContent(event.target as HTMLSlotElement);
    this.requestUpdate();
  }

  // The bank article-card mold: an ELEMENT node counts as content — bare
  // whitespace text nodes do not (template formatting noise).
  #slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
  }

  // Initial-mount backstop: the slotchange EVENT is queued inconsistently
  // for the FIRST assignment (happy-dom never fires it there), so every
  // render re-syncs the tracked presence straight from the live slot
  // assignment. The change guard converges — at most one extra render.
  protected override updated(): void {
    const coverSlot = this.renderRoot.querySelector("slot[name='cover']") as HTMLSlotElement | null;
    const markSlot = this.renderRoot.querySelector("slot[name='mark']") as HTMLSlotElement | null;
    const coverHas = this.#slotHasContent(coverSlot);
    const markHas = this.#slotHasContent(markSlot);
    if (coverHas !== this.#coverSlotted || markHas !== this.#markSlotted) {
      this.#coverSlotted = coverHas;
      this.#markSlotted = markHas;
      this.requestUpdate();
    }
  }

  override render() {
    return html`
      <div class="cover">
        <slot name="cover" @slotchange=${this.#handleCoverSlotchange}></slot>
      </div>
      ${this.#markSlotted
        ? html`
            <div
              class="mark${this.#coverSlotted ? ' mark--overlap' : ''}"
              aria-hidden="true"
            >
              <slot name="mark" @slotchange=${this.#handleMarkSlotchange}></slot>
            </div>
          `
        : html`
            <slot name="mark" @slotchange=${this.#handleMarkSlotchange} hidden></slot>
          `}
      <div class="flow">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-rubric-header': TjRubricHeader;
  }
}

if (!customElements.get('tj-rubric-header')) {
  customElements.define('tj-rubric-header', TjRubricHeader);
}
