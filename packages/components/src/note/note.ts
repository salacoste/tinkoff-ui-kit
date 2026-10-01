import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { noteStyles } from './note.css.js';

/**
 * tk-note — the kit's quiet fine-print note (spec 21.4, invest foundation
 * wave GAP-MAP A6).
 *
 * The permanent disclaimer block the invest catalogs carry at the bottom of
 * every page (bonds/stocks/etfs/germany) plus the currency page's bare info
 * line. Two tones, both measured:
 *
 * - `neutral` (the bonds grounding): a quiet white card on the consumer's
 *   muted page — fine-print text, optional «Показать» reveal. The atom owns
 *   the CARD here (unlike tk-empty-state, whose card is consumer-side) —
 *   the fill/radius hooks exist precisely for it.
 * - `info` (the currency grounding): NO card — a blue «Информация» label
 *   (the `label` property) above bare fine print on the page surface.
 *
 * MEASUREMENT OVERRIDES (spec AC1 «или без иконки — замер»): NO default
 * icon — none of the three groundings paints one. The icon slot renders
 * only while it carries content (the empty-state description mold).
 *
 * Disclosure contract = tk-accordion-item (spec AC2): a real button with
 * `aria-expanded`, NO `aria-controls` (the panel is a shadow child whose
 * id is not addressable from light DOM — the tk-select / 19.1 precedent).
 * The §9 channel ships whole: `open` reflects and flips through the
 * toggle; `open-change` ({ value }) fires on every actual FLIP — composed,
 * bubbles, silent on the first render pass and on teardown. The collapsed
 * text is CLAMPED, not hidden — clipping is visual only, so screen readers
 * read the whole disclaimer while sighted users see the 3-line digest.
 *
 * @tag tk-note
 * @attr {string} tone - "neutral" (white fine-print card) or "info" (bare blue label + text).
 * @attr {string} label - The info tone's lead-in line (e.g. «Информация»); renders when non-empty.
 * @attr {boolean} collapsible - Adds the «Показать/Скрыть» tail (3-line clamp while closed).
 * @attr {boolean} open - Reveal state; reflects, flips via the tail interaction too.
 * @slot - The note text (fine print).
 * @slot icon - Optional leading glyph; NOTHING renders while empty (no default icon — the measurement).
 * @fires open-change - `{ value: boolean }` — the §9 declarative channel; composed, bubbles, silent at initial mount.
 */
export class TkNote extends LitElement {
  static override readonly styles = [noteStyles];

  /** Visual tone: the neutral fine-print card or the bare info line. */
  @property({ reflect: true })
  tone: 'neutral' | 'info' = 'neutral';

  /** The info tone's lead-in («Информация» on the live currency page). */
  @property()
  label = '';

  /** Adds the «Показать/Скрыть» disclosure tail (3-line clamp while closed). */
  @property({ type: Boolean })
  collapsible = false;

  /** Reveal state — the §9 declarative channel (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * True once updated() has run once: the open-change channel stays silent
   * on the FIRST pass whatever set `open` — §9 «nothing at initial mount»
   * (the accordion-item / menu-popover #hasRenderedOnce idiom).
   */
  #hasRenderedOnce = false;

  /** Icon-slot presence — the wrapper renders only while REAL content rides the slot. */
  #iconHasContent = false;

  override updated(changed: PropertyValues<this>): void {
    const firstPass = !this.#hasRenderedOnce;
    this.#hasRenderedOnce = true;
    if (changed.has('open')) {
      // open-change on an actual FLIP only — never on the first pass, never
      // while detached (quiet teardown, the accordion-item lifecycle guards).
      const wasOpen = changed.get('open');
      if (!firstPass && this.isConnected && wasOpen !== undefined && wasOpen !== this.open) {
        this.dispatchEvent(
          new CustomEvent<TkNoteOpenChangeDetail>('open-change', {
            detail: { value: this.open },
            composed: true,
            bubbles: true,
          }),
        );
      }
    }
  }

  override disconnectedCallback(): void {
    // Quiet teardown: an element leaving the tree has no event consumer.
    if (this.open) {
      this.open = false;
    }
    super.disconnectedCallback();
  }

  #handleToggleClick(): void {
    this.open = !this.open;
  }

  /**
   * Icon-slot presence (the badge rule): REAL content (an element or
   * non-empty text) counts. Checked at firstUpdated AND on every
   * slotchange — the initial assignment does not reliably fire slotchange
   * (the badge / empty-state lesson).
   */
  #syncIconPresence(): void {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
    const hasContent =
      (slot?.assignedNodes({ flatten: true }) ?? []).some(
        (node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
      ) ?? false;
    if (hasContent !== this.#iconHasContent) {
      this.#iconHasContent = hasContent;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncIconPresence();
  }

  #handleIconSlotChange(): void {
    this.#syncIconPresence();
  }

  override render() {
    return html`
      <div class="note note--${this.tone}">
        ${this.#iconHasContent
          ? html`<span class="note__icon" aria-hidden="true"
              ><slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot
            ></span>`
          : html`<slot name="icon" @slotchange=${this.#handleIconSlotChange} hidden></slot>`}
        ${this.label ? html`<p class="note__label">${this.label}</p>` : ''}
        <p class="note__text ${this.collapsible && !this.open ? 'note__text--clamped' : ''}">
          <slot></slot>
        </p>
        ${this.collapsible
          ? html`
              <button class="note__toggle" type="button" aria-expanded=${this.open ? 'true' : 'false'} @click=${this.#handleToggleClick}>
                ${this.open ? 'Скрыть' : 'Показать'}
              </button>
            `
          : ''}
      </div>
    `;
  }
}

/** `open-change` detail — the §9 declarative channel payload. */
export interface TkNoteOpenChangeDetail {
  value: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-note': TkNote;
  }
}

if (!customElements.get('tk-note')) {
  customElements.define('tk-note', TkNote);
}
