import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { stepperStyles } from './stepper.css.js';

/**
 * One step of the `steps` prop — the frozen spec shape: a plain title/text
 * pair. The NUMBER never appears in data (numbering is the block's own chrome,
 * rendered automatically 1..n).
 */
export interface TkStepperStep {
  /** Step title — the emphasized line (body-l bold ink). */
  title: string;
  /** Step text — the regular line (body-l regular ink). */
  text: string;
}

/**
 * Zero-state copy (EXPERIENCE State Patterns: «zero-state copy slot; never
 * blank» — the tk-thumbnail-picker mold): the default text inside the `empty`
 * slot; consumers project their own copy through `<* slot="empty">`.
 */
export const TK_STEPPER_DEFAULT_EMPTY_COPY = 'Нет доступных шагов';

/**
 * tk-stepper — the numbered marketing steps block (Story 7.3): white rounded
 * cards on the page surface, each with a rounded-square number badge
 * EXACTLY half-overlapping the card's top edge (centered on the card's
 * centerline), centered title/text under it — the business domain's
 * «Откройте счет для бизнеса» anatomy (probe: 336×136 cards, radius 24, gap
 * 48, 56×56 badge, body-l copy — see .playwright-cli/verify/stepper/).
 *
 * NUMBERING IS AUTOMATIC: the painted numeral is `aria-hidden` decoration on
 * top of an ordered list — «item N» comes from list semantics, and a number
 * in the data has nowhere to go (the shape has no field for it).
 *
 * STATELESS (the display-component mold — tk-promo-card precedent): no §4
 * channel, no events, nothing dispatches (the event-map no-entry case).
 * Degrades, never throws (§2): null/undefined `steps` clamps to the empty
 * list; `steps=[]` renders the documented zero-state copy slot.
 *
 * The optional UNNAMED slot is a CTA row under the cards — empty by default
 * (the reference block has NO CTA; the default story matches the reference).
 * The CTA container renders ONLY when the slot carries content, so an unset
 * slot adds no rhythm.
 *
 * MOTION: none (the spec's never-list — no transitions, no animations, no
 * hover elevation on the cards).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the slotchange
 * listener is event-driven post-mount access, never construction-time.
 *
 * @tag tk-stepper
 * @attr {string} heading - Optional block heading (heading-2, centered; nothing rendered when unset).
 * @prop {TkStepperStep[]} steps - The steps; numbering is rendered 1..n automatically.
 * @slot - Optional CTA row under the cards (renders only when slotted).
 * @slot subtitle - Optional page subheading between the heading and the cards (body-m, centered; wrapper renders only when slotted — story 10.2).
 * @slot empty - Zero-state copy for steps=[] (default «Нет доступных шагов»).
 */
export class TkStepper extends LitElement {
  static override readonly styles = [stepperStyles];

  /** Optional block heading — string DATA (never reflects); unset renders no heading. */
  @property({ type: String })
  heading?: string;

  /** The step data — array of { title, text }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  steps: TkStepperStep[] = [];

  /** Whether the subtitle slot carries projectable content (drives the wrapper + data-has-subtitle). */
  #subtitleSlotted = false;

  /** Steps with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveSteps(): TkStepperStep[] {
    return this.steps ?? [];
  }

  /** A slot carries projectable content when an element or non-empty text is assigned (tk-promo-card mold). */
  #slotHasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some(
      (node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
  }

  /** CTA rhythm gate: data-has-cta toggles with slot assignment (pure attribute — no re-render needed). */
  #handleCtaSlotChange(event: Event): void {
    this.toggleAttribute('data-has-cta', this.#slotHasContent(event.target as HTMLSlotElement));
  }

  /**
   * Subtitle presence (story 10.2 — the CTA row's #slotHasContent +
   * data-has-cta mirror, extended with the promo-card conditional-wrapper
   * technique the CTA never needed: its container always renders, while the
   * subtitle wrapper must be ABSENT when the slot is empty). The slot itself
   * stays in the DOM (hidden, unwrapped) so slotchange still fires when
   * content arrives later — rendered at the END of the container, OUTSIDE
   * every adjacent-sibling rhythm pair: a listening slot parked between the
   * heading and the cards would break `.stepper__heading + .stepper__steps`
   * and silently drop its 64+32 rhythm (pixel-caught in the 10.2 visual
   * round — the empty-slot composition must stay visually identical to
   * pre-10.2). Seeded at firstUpdated for first-paint truth — statically
   * slotted subtitles never flash through the hidden state.
   *
   * CONVERGENCE RULE: the sync ALWAYS re-queries the LIVE tree instead of
   * trusting the event's target slot. The two render parts (wrapped slot in
   * the middle, bare listening slot at the end) mean one flip commit retires
   * one slot and mounts the other; a slotchange dispatched from the RETIRED
   * slot reads an empty assignment list, and honoring it would flip the flag
   * back — an endless render oscillation that starves the event loop (the
   * 10.2 visual round caught every slotted story freezing at a blank canvas
   * in Chromium; happy-dom never fired the competing event, so unit tests
   * stayed green). The live query reads the committed tree, whose one
   * remaining slot always tells the truth, so every path converges.
   */
  #syncSubtitleSlotted(): void {
    const subtitleSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="subtitle"]');
    const has = subtitleSlot != null && this.#slotHasContent(subtitleSlot);
    this.toggleAttribute('data-has-subtitle', has);
    if (has !== this.#subtitleSlotted) {
      this.#subtitleSlotted = has;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncSubtitleSlotted();
  }

  #handleSubtitleSlotChange(): void {
    this.#syncSubtitleSlotted();
  }

  override render() {
    const steps = this.#effectiveSteps;
    const heading = (this.heading ?? '').length > 0 ? this.heading : undefined;

    return html`
      <div class="stepper">
        ${heading != null ? html`<h2 class="stepper__heading">${heading}</h2>` : nothing}
        ${this.#subtitleSlotted
          ? html`<p class="stepper__subtitle">
              <slot name="subtitle" @slotchange=${this.#handleSubtitleSlotChange}></slot>
            </p>`
          : nothing}
        ${steps.length > 0
          ? html`
              <ol class="stepper__steps">
                ${steps.map((step, index) => html`
                  <li class="step">
                    <div class="step__badge" aria-hidden="true">
                      <span class="step__number">${index + 1}</span>
                    </div>
                    <h3 class="step__title">${step.title}</h3>
                    <p class="step__text">${step.text}</p>
                  </li>
                `)}
              </ol>
              <div class="stepper__cta"><slot @slotchange=${this.#handleCtaSlotChange}></slot></div>
            `
          : html`<div class="stepper__empty"><slot name="empty">${TK_STEPPER_DEFAULT_EMPTY_COPY}</slot></div>`}
        ${this.#subtitleSlotted
          ? nothing
          : html`<slot name="subtitle" @slotchange=${this.#handleSubtitleSlotChange} hidden></slot>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-stepper': TkStepper;
  }
}

if (!customElements.get('tk-stepper')) {
  customElements.define('tk-stepper', TkStepper);
}
