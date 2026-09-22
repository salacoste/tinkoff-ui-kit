import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { segmentedRadioStyles } from './segmented-radio.css.js';

/**
 * One option of the `options` prop — the 2.3 data shape, inherited verbatim
 * (slotted alternatives are NOT in v1; consumers compose around the element).
 */
export interface TkSegmentedRadioOption {
  /** Stable option value (what `value` / `value-change` carry). */
  value: string;
  /** Visible segment text (also the radio's accessible name). */
  label: string;
  /** Segment present but unselectable and skipped by arrow navigation. */
  disabled?: boolean;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkSegmentedRadioChangeDetail {
  value: string;
}

/** Typed shape of the tk-segmented-radio `value-change` event (CONVENTIONS §7). */
export type TkSegmentedRadioChangeEvent = CustomEvent<TkSegmentedRadioChangeDetail>;

/**
 * Last-resort accessible name when `label` is absent — a single
 * localization-ready constant (the tk-select precedent): an unnamed
 * radiogroup fails the axe name gate, so «Выбор» stands in rather than
 * shipping an unnamed group.
 */
const DEFAULT_ACCESSIBLE_NAME = 'Выбор';

/**
 * tk-segmented-radio — Да/Нет pill group (Story 2.5), the form's binary gate.
 *
 * STATEFUL API — the §4 contract frozen at 2.1 (Input PR), inherited verbatim
 * with a string channel (tk-select's exact mirror): `value` strict-controlled
 * (renders exactly `value`; selecting emits `value-change` and applies
 * nothing locally — the native radios keep their live flip until the
 * element's next update, the same caret-sanity mirror as tk-input/checkbox),
 * `defaultValue` seeds uncontrolled (later changes ignored), releasing
 * `value` goes uncontrolled seeded from the last controlled value.
 * «Exactly one selected ever» holds by construction: the native radio group
 * is exclusive, `updated()` re-syncs every input to the single value in
 * force, and zero selected is the valid pre-selection state (native radio
 * semantics — the matrix's «nothing selected → Tab enters at the first
 * non-disabled option» row).
 *
 * ARIA TECHNIQUE (the 2.4 pattern, per the spec's Design Notes): the native
 * shadow `<input type="radio">` group stays THE interaction/announcement
 * surface — Space, label-click, form association and checked/unchecked
 * announcements all come native; the track carries `role="radiogroup"` with
 * its accessible name from the visible `label` (aria-labelledby). The label
 * element is deliberately a SPAN, not a clickable `<label for>`: the Input
 * mold's label[for] association does not transfer to radio groups — pointing
 * `for` at the tab-stop radio makes Chromium CONCATENATE the group text onto
 * that one option's accessible name («Гражданство РФ? Да» while «Нет» stays
 * bare — probed live, 2026-09-22), an asymmetric rename that follows the
 * roving tab stop; the group is named by aria-labelledby and each option by
 * its wrapping segment label, so the span carries no pointer affordance it
 * does not own. A disabled
 * group marks the RADIOGROUP itself `aria-disabled` (alongside every input):
 * AT announces the whole group as unavailable, and the 40%-opacity label —
 * WCAG-exempt as inactive-component text — rides the same disabled-label
 * exemption axe gives native fields (probed: a bare dimmed label with no
 * disabled association fails the color-contrast gate; the aria-disabled
 * group + labelledby pair passes). Arrow keys
 * are wired EXPLICITLY (preventDefault + own move): native radio arrow
 * behavior in shadow roots is UA-consistent, but the strict-controlled
 * contract needs the element to own the move-select pipeline in every
 * engine. Arrows move WITHIN the group (Left/Up = previous, Right/Down =
 * next, WRAPPING — the spec's noted pick) and SELECTION FOLLOWS FOCUS
 * (radio semantics). Home/End are deliberately absent (EXPERIENCE's letter:
 * arrows only — the spec's noted pick). Space is never intercepted (native:
 * selects, no-op when already selected); Enter selects explicitly (the
 * spec's test-letter «Space/Enter select») with form-submit suppressed.
 * Tab is never intercepted — the roving tabindex (selected option 0, others
 * −1; first non-disabled when nothing selected) makes Tab enter the group
 * at the selected option and leave naturally.
 *
 * FORM PARTICIPATION (2.4's ratified amendment — the kit's form pattern):
 * the host declares `formAssociated` and mirrors the entry through
 * ElementInternals (`setFormValue`): the selected option's value under the
 * host's reflected `name`, nothing when unselected. The shadow radios never
 * submit (Chromium's form-owner walk stops at the shadow root — probed
 * 2026-09-22, see checkbox); their `name` (host `name` when set, else a
 * per-instance unique group id) exists for radio grouping and direct-DOM
 * consumers only.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative native
 * re-sync lives in `updated()`, never at construction.
 *
 * @tag tk-segmented-radio
 * @attr {string} label - Visible group label above the track (the group's accessible name).
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} disabled - Whole group: 40% opacity, no pointer events, aria-disabled (kept focusable).
 * @attr {string} name - The control's form name (reflects; keys the ElementInternals submission entry).
 * @fires value-change - `{ value: string }` with the unwrapped newly selected option value; composed, bubbles.
 */
export class TkSegmentedRadio extends LitElement {
  static override readonly styles = [segmentedRadioStyles];

  /**
   * FORM ASSOCIATION (2.4's ratified amendment): the host mirrors the
   * submission entry through ElementInternals — exactly what a native radio
   * group would submit: the selected option's value under the host's
   * reflected `name`, no entry when unselected. The shadow radios stay the
   * interaction/announcement surface; only submission rides the internals.
   * Feature-guarded: environments without ElementInternals (happy-dom) skip
   * the mirror — wiring is unit-pinned, the live FormData row is proven in
   * tests/visual/segmented-radio.spec.ts (chromium).
   */
  static readonly formAssociated = true;

  /** Visible group label above the track — the group's accessible name. */
  @property({ type: String })
  label?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, string
   * mirror of tk-select): the element renders exactly this (the matching
   * option is the selected segment); selecting emits `value-change` and
   * applies nothing locally. Property-only (`attribute: false`); non-strings
   * set via JS clamp to their string form; null/undefined after control
   * RELEASES to uncontrolled seeded from the last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v1 data shape — array of { value, label, disabled? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  options: TkSegmentedRadioOption[] = [];

  /** Disabled group: 40% opacity, no pointer events, aria-disabled (kept focusable). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Pass-through: the control's form name. REFLECTS — the ElementInternals
   * form mirror reads the HOST's name content attribute for the entry's name
   * (and the shadow radios carry the same value for direct-DOM consumers).
   */
  @property({ type: String, reflect: true })
  name?: string;

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** ElementInternals form mirror — null where unsupported (happy-dom). */
  readonly #internals: ElementInternals | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-segmented-radio-${++TkSegmentedRadio.#nextId}`;
    return this.#uniqueId;
  }

  constructor() {
    super();
    // Feature-detected: environments without ElementInternals keep every
    // other behavior; only the form mirror is skipped.
    this.#internals = 'attachInternals' in this ? this.attachInternals() : null;
  }

  /** Options with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveOptions(): TkSegmentedRadioOption[] {
    return this.options ?? [];
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /**
   * The radio group name the shadow inputs share: the host `name` when the
   * consumer set one (direct-DOM parity, the checkbox pattern), else a
   * per-instance unique id. Radio grouping is computed per tree — each
   * instance's shadow root is its own tree — so instances never cross-group.
   */
  get #groupName(): string {
    return this.name ?? `${this.#id}-group`;
  }

  /**
   * Where Tab enters the group (roving tabindex): the option matching the
   * value in force; when nothing is selected, the FIRST non-disabled option;
   * null for an empty (or all-disabled) group — an inert track no Tab can
   * stop on.
   */
  #tabStopIndex(): number | null {
    const options = this.#effectiveOptions;
    if (options.length === 0) return null;
    const selected = options.findIndex((option) => option.value === this.#effectiveValue);
    // A selected-but-disabled option (degenerate consumer data) still shows
    // its checked state but cedes the tab stop — the select's
    // #initialActiveIndex precedent.
    if (selected >= 0 && !options[selected]?.disabled) return selected;
    const firstEnabled = options.findIndex((option) => !option.disabled);
    return firstEnabled >= 0 ? firstEnabled : null;
  }

  /**
   * The frozen §4 state transitions (tk-select's verbatim string mirror) +
   * the 2.3 options clamp: duplicate option VALUES drop with a dev warn
   * (first occurrence wins; `findIndex(value)` marking would otherwise
   * render an ambiguous second "same value" segment), nullish-value entries
   * drop with them. CONVENTIONS §2 degrade-to-default spirit; the
   * reassignment is length-guarded so the follow-up update converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && !this.hasUpdated) {
      this.#uncontrolledValue = this.defaultValue ?? '';
    }
    if (changed.has('value')) {
      if (this.value != null && typeof this.value !== 'string') {
        this.value = String(this.value);
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (typeof this.value === 'string') {
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledValue = this.#lastControlledValue ?? '';
      }
    }
    if (changed.has('options')) {
      const seen = new Set<string>();
      const deduped = (this.options ?? []).filter((option) => {
        const value = option?.value;
        // '' drops alongside nullish values: the empty string IS the channel's
        // no-selection sentinel, so an option carrying it could never be
        // addressed by `value`/`defaultValue` in the first place.
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.options != null && deduped.length !== this.options.length) {
        console.warn(
          'tk-segmented-radio: duplicate or value-less option entries dropped — option values must be unique non-empty strings (first occurrence wins)',
        );
        this.options = deduped;
      }
    }
  }

  /**
   * Native re-sync (the tk-input/checkbox `updated()` contract): every
   * update re-derives each shadow radio's checkedness from the single value
   * in force — the exactly-one invariant, enforced against stray native
   * state (UA activation, consumer DOM poking). Between updates the inputs
   * keep their live flip (native-feeling selection in controlled mode until
   * the consumer answers).
   */
  override updated(): void {
    this.#syncNativeChecked(this.#effectiveValue);
    this.#syncFormValue();
  }

  /** Sets every shadow radio's checkedness to `checked = (value === target)` — idempotent, fires nothing. */
  #syncNativeChecked(target: string): void {
    const inputs = this.#radioInputs();
    for (const input of inputs) {
      const shouldBe = input.value === target;
      if (input.checked !== shouldBe) input.checked = shouldBe;
    }
  }

  #radioInputs(): HTMLInputElement[] {
    return [
      ...(this.renderRoot.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
    ];
  }

  /** Mirrors the submission entry through ElementInternals — the selected value, no entry when unselected. */
  #syncFormValue(): void {
    this.#internals?.setFormValue(this.#effectiveValue !== '' ? this.#effectiveValue : null);
  }

  /**
   * Native reset parity: form.reset() restores the default selection
   * (defaultValue semantics — the initial-value contract, again). The
   * controlled channel is consumer-owned and untouched.
   */
  formResetCallback(): void {
    this.#uncontrolledValue = this.defaultValue ?? '';
    this.requestUpdate();
  }

  /** `detail: { value }` with the unwrapped string; composed + bubbles (CONVENTIONS §3). */
  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkSegmentedRadioChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * The selection pipeline (arrows, Enter, Space and label-click all arrive
   * here): uncontrolled commits the internal state; both modes emit.
   * Controlled applies nothing locally — the native group keeps its live
   * flip until the element's next update reverts it to exactly `value` (the
   * frozen strict contract). `#syncNativeChecked` keeps the moved option's
   * NATIVE checkedness live in every mode (the arrow path preventDefaults
   * the UA's own move, so the element paints the flip itself).
   */
  #commit(value: string): void {
    if (!this.#isControlled) {
      this.#uncontrolledValue = value;
      this.requestUpdate();
    }
    this.#syncNativeChecked(value);
    this.#emitValueChange(value);
  }

  /** Selects option `index`: disabled segments never select (guarded by every path that lands here too). */
  #selectIndex(index: number): void {
    const option = this.#effectiveOptions[index];
    if (!option || option.disabled || this.disabled) return;
    if (option.value === this.#effectiveValue) return; // no-op when already selected (native semantics)
    this.#commit(option.value);
  }

  /** Next/previous ENABLED option from `from`, WRAPPING (the spec's noted pick). Null when none exists. */
  #stepEnabled(from: number, direction: 1 | -1): number | null {
    const options = this.#effectiveOptions;
    if (options.length === 0) return null;
    let index = from;
    for (let step = 0; step < options.length; step += 1) {
      index = (index + direction + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return null;
  }

  /**
   * Arrow navigation (EXPERIENCE SegmentedRadio row): Left/Up = previous,
   * Right/Down = next, WRAPPING, disabled options SKIPPED, selection FOLLOWS
   * focus (moving selects). Every HANDLED key (arrows, Enter) is
   * preventDefaulted BEFORE any disabled exit — the UA's own radio-arrow move
   * (which roves focus even inside a disabled group, verified live in
   * chromium) must never run; the element owns these keys in every state and
   * every engine. Enter selects the focused option (suppressing form submit
   * from disabled groups too); Space is left native (selects, no-op when
   * already selected); Tab/Home/End pass through untouched.
   */
  #handleKeydown(event: KeyboardEvent): void {
    const inputs = this.#radioInputs();
    const from = inputs.indexOf(event.target as HTMLInputElement);
    if (from < 0) return;
    const key = event.key;
    const isArrow =
      key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowDown';
    if (!isArrow && key !== 'Enter') return;

    // The element owns handled keys even while inert — otherwise the native
    // radio-arrow move would rove focus inside a disabled group.
    event.preventDefault();
    if (this.disabled) return;

    if (isArrow) {
      const direction: 1 | -1 = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
      const next = this.#stepEnabled(from, direction);
      if (next === null || next === from) return; // all-disabled group: arrows inert
      inputs[next]?.focus();
      this.#selectIndex(next);
      return;
    }

    this.#selectIndex(from); // Enter
  }

  /**
   * The change pipeline (native label-click and Space both arrive here — no
   * custom key handling exists for either, the platform owns them): disabled
   * group or disabled option reverts the native flip and emits nothing;
   * otherwise the full #commit pipeline runs. An already-selected radio
   * fires no native change at all — the no-op comes native.
   */
  #handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.disabled || this.#effectiveOptions.find((option) => option.value === input.value)?.disabled) {
      this.#syncNativeChecked(this.#effectiveValue);
      return;
    }
    this.#commit(input.value);
  }

  override render() {
    const options = this.#effectiveOptions;
    const effective = this.#effectiveValue;
    const hasLabel = this.label != null && this.label.length > 0;
    const tabStop = this.#tabStopIndex();

    return html`
      ${hasLabel
        ? html`<span class="label" id="${this.#id}-label">${this.label}</span>`
        : nothing}
      <div
        class="track"
        role="radiogroup"
        aria-labelledby=${hasLabel ? `${this.#id}-label` : nothing}
        aria-label=${!hasLabel ? DEFAULT_ACCESSIBLE_NAME : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        ${options.map((option, index) => {
          const selected = option.value === effective;
          const optionDisabled = option.disabled === true;
          return html`
            <label class="segment">
              <input
                class="segment__input"
                type="radio"
                name=${this.#groupName}
                value=${option.value}
                .checked=${selected}
                tabindex=${tabStop === index ? '0' : '-1'}
                aria-disabled=${this.disabled || optionDisabled ? 'true' : nothing}
                @change=${this.#handleChange}
                @keydown=${this.#handleKeydown}
              />
              <span class="segment__surface">
                <span class="segment__text">${option.label}</span>
                <span class="segment__dot" aria-hidden="true"></span>
              </span>
            </label>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-segmented-radio': TkSegmentedRadio;
  }
}

if (!customElements.get('tk-segmented-radio')) {
  customElements.define('tk-segmented-radio', TkSegmentedRadio);
}
