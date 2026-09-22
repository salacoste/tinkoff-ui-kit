import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { badgeStyles } from './badge.css.js';

/**
 * tk-badge — the kit's Badge/Chip (Story 3.2).
 *
 * Pill chip in the Tinkoff (T-Bank) register: the reference's «+20%»
 * incentive badge (capture badge-chip-incentive.png, ~44×22) and the stat
 * chip. NEVER interactive alone — a plain `<span>`, no tabindex, no role, no
 * focus stop; the action belongs to the surrounding surface (EXPERIENCE.md
 * Badge/Chip row: «never interactive alone»).
 *
 * CONTENT MODES (the spec's precedence):
 * - `count` present (a finite number) → the count renders, capped: values
 *   above 99 render «99+» (dynamic counters); 0 renders «0» — a visible
 *   zero is information. The count WINS over slot/label while set.
 * - otherwise the DEFAULT slot carries the label; real slotted content
 *   beats the `label` prop (the checkbox/progress-bar slot-presence rule).
 *
 * VARIANTS: `incentive` (green-100 fill + ink text — the AA pairing frozen
 * at 2.1: white on green-100 is 2.66:1 and fails, ink is 4.74:1) and `stat`
 * (ink-300 fill + white text, 12.6:1). Both pairs are THEME-INVARIANT —
 * the raw scale tokens carry no dark remaps, mirroring the yellow-keeps-ink
 * rule (see badge.css.ts).
 *
 * STATELESS (the simple-component mold): nothing dispatches — the event-map
 * no-entry case (tk-button precedent). SSR-compat (AD-10): rendered via
 * Lit templates only.
 *
 * @tag tk-badge
 * @attr {incentive|stat} variant - Fill/text pairing (default `incentive`).
 * @attr {number} count - Dynamic count mode: renders the count capped at «99+»; wins over slot/label while set.
 * @attr {string} label - Label fallback when the default slot carries no real content.
 * @slot - Label (primary content); wins over the `label` prop, loses to `count`.
 */
export class TkBadge extends LitElement {
  /** Variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['incentive', 'stat'] as const;

  /** Count cap — everything above renders «99+» (the reference's dynamic counters). */
  static readonly COUNT_CAP = 99;

  /** Fill/text pairing. */
  @property({ reflect: true })
  variant: 'incentive' | 'stat' = 'incentive';

  /**
   * Dynamic count (number DATA — never reflects, CONVENTIONS §2). While a
   * finite number is set, the badge renders the capped count and the
   * slot/label cells hide. A non-finite value (attribute `count="abc"` →
   * NaN) reads as absent — the label path takes over.
   */
  @property({ type: Number })
  count?: number;

  /** Label text — the default slot's fallback (slot content wins). */
  @property({ type: String })
  label?: string;

  static override readonly styles = [badgeStyles];

  /** Whether the default slot carries REAL content (element or non-empty text). */
  #labelSlotted = false;

  /**
   * The count text in force: the capped string when `count` is a finite
   * number, null otherwise (absent/NaN → the label path). Non-integer
   * values render as-is — the cap is the only transformation the spec names.
   */
  get #countText(): string | null {
    if (typeof this.count !== 'number' || !Number.isFinite(this.count)) return null;
    return this.count > TkBadge.COUNT_CAP ? '99+' : String(this.count);
  }

  /**
   * Slot presence (the badge-slot rule, checkbox's label mirror): REAL
   * content (an element or non-empty text) counts; empty text nodes — the
   * `${cond ? html`…` : ''}` template shape — do NOT. Checked at
   * firstUpdated and on every slotchange. The label cell (with its slot)
   * stays in the DOM — hidden, never absent — precisely so slotchange fires
   * in every state (the progress-bar header lesson).
   */
  #syncSlotPresence(): void {
    const defaultSlot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const has = (defaultSlot?.assignedNodes({ flatten: true }) ?? []).some(
      (node: Node) =>
        node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
    if (has !== this.#labelSlotted) {
      this.#labelSlotted = has;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncSlotPresence();
  }

  #handleSlotChange(): void {
    this.#syncSlotPresence();
  }

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default (never throws), reflected attribute
   * corrected so the DOM shows the value in force.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('variant') && !(TkBadge.variants as readonly string[]).includes(this.variant)) {
      this.variant = 'incentive';
    }
  }

  override render() {
    const countText = this.#countText;
    return html`
      <span class="badge">
        <span class="badge__count" ?hidden=${countText === null}>${countText ?? nothing}</span>
        <span class="badge__label" ?hidden=${countText !== null}
          >${this.#labelSlotted ? nothing : this.label ?? nothing}<slot
            @slotchange=${this.#handleSlotChange}
          ></slot
        ></span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-badge': TkBadge;
  }
}

if (!customElements.get('tk-badge')) {
  customElements.define('tk-badge', TkBadge);
}
