import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { rangeSliderStyles } from './range-slider.css.js';

/**
 * Payload of `value-change` (CONVENTIONS §3): always `{ value }` with the
 * unwrapped snapped number — never the raw CustomEvent, never the inner
 * element.
 */
export interface TkRangeSliderChangeDetail {
  value: number;
}

/** Typed shape of the tk-range-slider `value-change` event (CONVENTIONS §7). */
export type TkRangeSliderChangeEvent = CustomEvent<TkRangeSliderChangeDetail>;

/**
 * Formatter for the visible value readout and aria-valuetext (spec 26.1
 * AC1): receives the SNAPPED effective value, returns display copy
 * («до 150 000 ₽» — story numbers are fictional, the PD gate).
 */
export type TkRangeSliderValueFormatter = (value: number) => string;

/**
 * tk-range-slider — single-thumb amount picker (spec 26.1, form-control
 * wave), the Т-Банк calculator pattern rebuilt on kit registers.
 *
 * GEOMETRY REGISTER (AC4, maintainer ruling 2026-10-05): the iis.png
 * grounding premise was disproven at execution (no slider in the capture
 * or the live DOM — see the spec Change Log); the track follows the
 * tk-progress-bar mold (4px pill) and the thumb the tk-checkbox engaged
 * circle (20px, yellow + ink ring). Pixel grounding is a HOLD → 24T.
 *
 * STATEFUL API — the §4 contract frozen at 2.1, number mirror of
 * tk-checkbox: `value` strict-controlled (renders exactly the SNAPPED
 * `value`; interaction emits `value-change` and applies nothing locally —
 * the native thumb keeps its live position until the element's next
 * update, the caret-sanity mirror), `defaultValue` seeds uncontrolled
 * (later changes ignored), releasing `value` goes uncontrolled seeded from
 * the last controlled value.
 *
 * MECHANISM (AC3): the native shadow `<input type="range">` is THE
 * interaction surface — keyboard (arrows/Home/End ±step), pointer drag,
 * touch and the implicit slider role with aria-valuemin/max/now all come
 * native; the kit paints its own track/fill/thumb underneath (opacity-0
 * overlay, the tk-checkbox technique). The ONE native gap is PageUp/
 * PageDown (spec AC2: ±10 steps) — handled in a keydown guard that
 * computes, commits and prevents default; every other key stays native.
 *
 * STEP-GRID CLAMP (AC1): the DISPLAY snaps every value — controlled prop
 * and uncontrolled state alike — to the nearest step multiple
 * (documented rule: `round((v − min) / step) · step + min`, ties toward
 * +∞, then clamped into [min, max]). The `value` PROP is never mutated
 * (the tk-progress-bar display-clamp ruling: the prop keeps 7, everything
 * rendered and emitted reads 5 on a 0–10/step-5 grid). A non-finite or
 * ≤0 `step` reads as 1 (the native default); a degenerate range
 * (min ≥ max) collapses to the min endpoint with nothing to traverse.
 *
 * ARIA (AC2): role=slider + aria-valuemin/max/now come native from the
 * input's min/max/value; the input's accessible NAME is the visible header
 * (label → formatted value) through an `aria-labelledby` id-ref chain (the
 * tk-input mold) — a bare slider (header hidden) takes the forwarded
 * host `aria-label` instead (the tk-checkbox mold); aria-valuetext carries
 * the FORMATTED value when a `valueFormatter` is set (the APG valuetext
 * guidance for unit-formatted sliders), aria-disabled carries `disabled`
 * (kept focusable — the button-pilot pattern). The visual layer is
 * aria-hidden decoration over the semantic input.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative
 * native sync (the input's live value between updates) lives in
 * `updated()`, never at construction.
 *
 * @tag tk-range-slider
 * @attr {number} min - Range floor (default 0; non-numeric reads as 0).
 * @attr {number} max - Range ceiling (default 100; non-numeric reads as 100; min ≥ max collapses to the endpoint).
 * @attr {number} step - Grid step (default 1; non-numeric or ≤ 0 reads as 1).
 * @attr {number} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled (kept focusable).
 * @attr {string} label - Visible label text left of the formatted value (used only when the default slot is empty).
 * @attr {string} aria-label - Accessible name for a BARE slider (no label prop/slot) — forwarded to the native input; a visible header names the input itself (labelledby wins).
 * @property {number} [value] - Controlled value channel (property-only, never reflects); renders snapped, never mutated.
 * @property {TkRangeSliderValueFormatter} [valueFormatter] - Formats the snapped value for the readout and aria-valuetext (property-only — functions never ride attributes).
 * @slot - Label content; wins over the `label` prop when present.
 * @slot value - Readout cell (right); wins over the formatter/String default when present.
 * @fires value-change - `{ value: number }` with the unwrapped snapped value; composed, bubbles; silent on the first render.
 */
export class TkRangeSlider extends LitElement {
  static override readonly styles = [rangeSliderStyles];

  /** Range floor; non-finite reads as the 0 default. */
  @property({ type: Number })
  min = 0;

  /** Range ceiling; non-finite reads as the 100 default. */
  @property({ type: Number })
  max = 100;

  /** Grid step; non-finite or ≤ 0 reads as the native 1 default. */
  @property({ type: Number })
  step = 1;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: Number, attribute: 'default-value' })
  defaultValue?: number;

  /** Visible label text — the default slot's fallback (slot content wins). */
  @property({ type: String })
  label?: string;

  /**
   * Accessible name for a BARE slider (no label prop/slot, header hidden) —
   * forwarded to the native input (the tk-checkbox mold): the host carries
   * no role, so a host-level aria-label only matters on the input; when the
   * header is visible the labelledby chain wins instead. Typed
   * `string | null` to match the HTMLElement ARIA-reflection base.
   */
  @property({ attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** Disabled: 40% opacity, no pointer events, aria-disabled (kept focusable). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, number
   * mirror): the element renders exactly this (SNAPPED for display — the
   * prop itself is never corrected); interaction emits `value-change` and
   * applies nothing locally. Property-only (`attribute: false`) — number
   * data never reflects (CONVENTIONS §2), and a static attribute could
   * never update. Non-number values set via JS clamp to their number form;
   * null/undefined after control RELEASES to uncontrolled seeded from the
   * last controlled value.
   */
  @property({ type: Number, attribute: false })
  value?: number;

  /** Formats the snapped value for the readout cell and aria-valuetext. */
  @property({ attribute: false })
  valueFormatter?: TkRangeSliderValueFormatter;

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = 0;

  /** Last number ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: number | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** Whether the default slot carries REAL label content (an element or non-empty text). */
  #labelSlotted = false;

  /** Whether the `value` slot carries REAL readout content. */
  #valueSlotted = false;

  /** Per-instance id root for the aria id-ref chain (label → value). */
  #uniqueId?: string;

  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-range-slider-${++TkRangeSlider.#nextId}`;
    return this.#uniqueId;
  }

  /** Display-side effective min: non-finite reads as 0. */
  get #effectiveMin(): number {
    return Number.isFinite(this.min) ? this.min : 0;
  }

  /** Display-side effective max: non-finite reads as 100; degenerate collapses to min. */
  get #effectiveMax(): number {
    const raw = Number.isFinite(this.max) ? this.max : 100;
    return raw > this.#effectiveMin ? raw : this.#effectiveMin;
  }

  /** Degenerate range (effective min ≥ effective max): one legal point, nothing to traverse. */
  get #isDegenerate(): boolean {
    return this.#effectiveMax <= this.#effectiveMin;
  }

  /** The grid step in force: non-finite or ≤ 0 reads as the native 1 default. */
  get #effectiveStep(): number {
    return Number.isFinite(this.step) && this.step > 0 ? this.step : 1;
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): number {
    const raw = this.#isControlled ? (this.value ?? 0) : this.#uncontrolledValue;
    return Number.isFinite(raw) ? raw : this.#effectiveMin;
  }

  /**
   * The SNAPPED display value (AC1's documented rule): nearest step
   * multiple, ties toward +∞ (Math.round), then clamped into [min, max].
   * Degenerate ranges have one legal point — min. The PROP is never touched.
   */
  get #displayValue(): number {
    const min = this.#effectiveMin;
    const max = this.#effectiveMax;
    if (this.#isDegenerate) return min;
    const grid = Math.round((this.#effectiveValue - min) / this.#effectiveStep);
    return Math.min(max, Math.max(min, min + grid * this.#effectiveStep));
  }

  /** Ratio (0–1) of the display value over the range — the fill/thumb geometry source. */
  get #ratio(): number {
    if (this.#isDegenerate) return 0;
    return (this.#displayValue - this.#effectiveMin) / (this.#effectiveMax - this.#effectiveMin);
  }

  /**
   * The frozen §4 state transitions (number mirror of tk-checkbox):
   * `defaultValue` seeds ONLY before the first completed update; `value`
   * becoming a number enters controlled mode (non-numbers set via JS clamp
   * to their number form first, so raw non-numbers never live in the
   * channel); null/undefined after control RELEASES to uncontrolled seeded
   * from the last controlled value.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && !this.hasUpdated && Number.isFinite(this.defaultValue)) {
      this.#uncontrolledValue = this.defaultValue as number;
    }
    if (changed.has('value')) {
      if (this.value != null && typeof this.value !== 'number') {
        const coerced = Number(this.value);
        this.value = Number.isFinite(coerced) ? coerced : this.#effectiveMin;
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (typeof this.value === 'number') {
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledValue = this.#lastControlledValue ?? 0;
      }
    }
  }

  /**
   * Native sync (the tk-input `updated()` contract): the shadow input keeps
   * its own live value between updates (native-feeling drags in controlled
   * mode until the consumer answers), and every update the element DOES run
   * re-syncs it to the SNAPPED value in force — the strict-revert arm for
   * a consumer who ignores `value-change`.
   */
  override updated(): void {
    const input = this.renderRoot.querySelector<HTMLInputElement>('.control__input');
    if (input && input.value !== String(this.#displayValue)) {
      input.value = String(this.#displayValue);
    }
  }

  /**
   * Label slot presence (the badge-slot rule mirrored from tk-checkbox):
   * REAL content (an element or non-empty text) makes the slot win; empty
   * text nodes — the `${cond ? html`…` : ''}` template shape — do NOT
   * suppress the label prop. Checked at firstUpdated and on every
   * slotchange (the header cells stay in the DOM — hidden, never absent —
   * so their slots exist for slotchange in every state).
   */
  #syncSlotPresence(event?: Event): void {
    const slot = event?.target as HTMLSlotElement | undefined;
    const targets =
      slot === undefined
        ? (this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot') ?? [])
        : [slot];
    let changed = false;
    for (const target of targets) {
      const has = (target.assignedNodes({ flatten: true }) ?? []).some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
      );
      if (!target.name && has !== this.#labelSlotted) {
        this.#labelSlotted = has;
        changed = true;
      } else if (target.name === 'value' && has !== this.#valueSlotted) {
        this.#valueSlotted = has;
        changed = true;
      }
    }
    if (changed) this.requestUpdate();
  }

  override firstUpdated(): void {
    this.#syncSlotPresence();
  }

  #handleSlotChange(event: Event): void {
    this.#syncSlotPresence(event);
  }

  /** `detail: { value }` with the unwrapped snapped number; composed + bubbles (CONVENTIONS §3). */
  #emitValueChange(value: number): void {
    this.dispatchEvent(
      new CustomEvent<TkRangeSliderChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Commit pipeline (native `input` events and the PageUp/PageDown guard
   * both arrive here): the value is ALREADY on the grid — native snaps
   * user input to the step, the key guard pre-snaps — so the pipeline
   * trusts the incoming number. Uncontrolled commits the internal state;
   * both modes emit. Controlled applies nothing locally — the native
   * thumb stays where the pointer left it until the element's next update
   * reverts it to exactly `value` (the frozen strict contract). Disabled:
   * aria-disabled keeps the control focusable, so a keyboard interaction
   * still fires native input — the guard reverts the native value and
   * nothing emits.
   */
  #commit(next: number): void {
    if (this.disabled) {
      const input = this.renderRoot.querySelector<HTMLInputElement>('.control__input');
      if (input) input.value = String(this.#displayValue);
      return;
    }
    if (!this.#isControlled) {
      this.#uncontrolledValue = next;
      this.requestUpdate();
    }
    this.#emitValueChange(next);
  }

  #handleInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    this.#commit(Number.isFinite(raw) ? raw : this.#displayValue);
  }

  /**
   * The one native gap (AC2): PageUp/PageDown jump ±10 steps. preventDefault
   * (nothing native maps to Page keys on range inputs in Chromium — the
   * guard owns them outright), snap the target onto the grid, write it to
   * the native input (a programmatic write fires no native `input` — the
   * commit runs directly). Every other key (arrows, Home, End, typing)
   * stays native: this handler passes them through untouched.
   */
  #handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') return;
    event.preventDefault();
    const min = this.#effectiveMin;
    const max = this.#effectiveMax;
    const step = this.#effectiveStep;
    const jumps = 10 * step * (event.key === 'PageUp' ? 1 : -1);
    const grid = Math.round((this.#displayValue + jumps - min) / step);
    const next = Math.min(max, Math.max(min, min + grid * step));
    const input = this.renderRoot.querySelector<HTMLInputElement>('.control__input');
    if (input) input.value = String(next);
    this.#commit(next);
  }

  /** The formatted readout: the consumer formatter, else the plain number. */
  get #readout(): string {
    return this.valueFormatter ? this.valueFormatter(this.#displayValue) : String(this.#displayValue);
  }

  override render() {
    const percent = Math.round(this.#ratio * 100);
    const hasLabelContent = this.#labelSlotted || (this.label ?? '').trim().length > 0;
    const valuetext = this.valueFormatter ? this.#readout : nothing;
    // Accessible name: the visible header (label + formatted value) names the
    // input via an id-ref chain (the tk-input mold — the chain also makes the
    // header text part of the control, which carries the disabled contrast
    // exemption); a bare slider takes the forwarded host aria-label instead.
    const namedByHeader = hasLabelContent || this.#valueSlotted;
    const labelledBy = namedByHeader ? `${this.#id}-label ${this.#id}-value` : nothing;

    return html`
      <div class="header" ?hidden=${!namedByHeader}>
        <span class="header__label" id="${this.#id}-label" ?hidden=${!hasLabelContent}
          >${this.#labelSlotted ? nothing : this.label ?? nothing}<slot
            @slotchange=${this.#handleSlotChange}
          ></slot
        ></span>
        <span class="header__value" id="${this.#id}-value">
          ${this.#valueSlotted ? nothing : this.#readout}<slot
            name="value"
            @slotchange=${this.#handleSlotChange}
          ></slot>
        </span>
      </div>
      <div class="row">
        <div class="visual" aria-hidden="true">
          <div class="fill" style=${`width: ${percent}%`}></div>
          <div class="thumb" style=${`left: ${percent}%`}></div>
        </div>
        <input
          class="control__input"
          type="range"
          min=${String(this.#effectiveMin)}
          max=${String(this.#effectiveMax)}
          step=${String(this.#effectiveStep)}
          .value=${String(this.#displayValue)}
          aria-labelledby=${labelledBy}
          aria-label=${namedByHeader ? nothing : (this.ariaLabel ?? nothing)}
          aria-valuetext=${valuetext}
          aria-disabled=${this.disabled ? 'true' : nothing}
          @input=${this.#handleInput}
          @keydown=${this.#handleKeydown}
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-range-slider': TkRangeSlider;
  }
}

if (!customElements.get('tk-range-slider')) {
  customElements.define('tk-range-slider', TkRangeSlider);
}
