import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { switchStyles } from './switch.css.js';

/**
 * Payload of `checked-change` (CONVENTIONS §3): always `{ value }` with the
 * unwrapped new boolean — never the raw CustomEvent, never the inner element.
 */
export interface TkSwitchChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-switch `checked-change` event (CONVENTIONS §7). */
export type TkSwitchChangeEvent = CustomEvent<TkSwitchChangeDetail>;

/**
 * tk-switch — boolean toggle with the APG switch contract (spec 26.2,
 * form-control wave).
 *
 * GEOMETRY REGISTER (spec 26.2 AC2/AC4, maintainer ruling 2026-10-05): the
 * admin «Запомнить» pixel probe resolved to a chip-button, not a switch (the
 * spec Change Log records the probe), so the capsule follows KIT registers —
 * the tk-progress-bar / tk-range-slider track family (full-radius pill,
 * 36×20 default, surface-base 16px knob, ON yellow-100 / OFF border-default).
 * Pixel grounding is a HOLD → 24T.
 *
 * STATEFUL API — the §4 contract frozen at 2.1, boolean mirror of
 * tk-checkbox: `checked` strict-controlled (renders exactly `checked`;
 * toggling emits `checked-change` and applies nothing locally — the native
 * box keeps its live flip until the element's next update, the caret-sanity
 * mirror), `defaultChecked` seeds uncontrolled (later changes ignored),
 * releasing `checked` goes uncontrolled seeded from the last controlled
 * value.
 *
 * ARIA TECHNIQUE (AC3, the APG Switch Pattern): the native shadow
 * `<input type="checkbox" role="switch">` stays THE interaction and
 * announcement surface — Space, label-click and form association come
 * native, and role=switch over the checkbox base switches the announced
 * semantics («switch, on/off» instead of «checkbox, checked») while the
 * state keeps riding the native checkedness (aria-checked is implied —
 * never hand-set, so it can never drift). The ONE native gap is Enter: a
 * checkbox does not activate on Enter, so a keydown guard clicks the input
 * on Enter (preventDefault first — the guard owns the key outright); every
 * other key stays native.
 *
 * FORM PARTICIPATION (AC1, the tk-checkbox mechanism verbatim): `name`/
 * `value` reach the form through the host's ElementInternals mirror
 * (Chromium's form-owner walk stops at the shadow root — probed 2026-09-22),
 * so the host inside a `<form>` submits name=value when checked and nothing
 * when unchecked; `form.reset()` restores `defaultChecked`. The shadow
 * input keeps the attributes for direct-DOM consumers but does not itself
 * associate.
 *
 * LABEL: the native `<label>` WRAPS track + input + text, so label-click
 * toggles and the accessible name comes from the label content for free.
 * Slot-vs-prop precedence (the tk-checkbox mold): default-slot CONTENT when
 * present, else the `label` prop — "present" follows the badge-slot
 * presence rule (an element or non-empty text). With neither, a bare
 * switch renders (nameless — consumers give it a label or an aria-label on
 * the host).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative native
 * sync (checked is a JS-only channel) lives in `updated()`, never at
 * construction.
 *
 * @tag tk-switch
 * @attr {string} label - Visible label text (used only when the default slot is empty).
 * @attr {boolean} default-checked - Initial checked state for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled (kept focusable — the button-pilot pattern).
 * @attr {string} name - The control's form name (reflects; also lands on the native input).
 * @attr {string} value - Pass-through to the native input's value (submitted when checked; native default "on" when unset).
 * @attr {string} aria-label - Accessible name for a bare switch (no label/slot) — forwarded to the native input.
 * @slot - Label content; wins over the `label` prop when present.
 * @fires checked-change - `{ value: boolean }` with the unwrapped new checked state; composed, bubbles; silent on the first render.
 */
export class TkSwitch extends LitElement {
  static override readonly styles = [switchStyles];

  /**
   * FORM ASSOCIATION (the tk-checkbox amendment verbatim): the host
   * declares `formAssociated` and mirrors the entry through
   * ElementInternals (`setFormValue`) — exactly what the native control
   * would submit. Feature-guarded: environments without ElementInternals
   * (happy-dom) skip the mirror — wiring is unit-pinned, the live FormData
   * row is proven in tests/visual/switch.spec.ts (chromium).
   */
  static readonly formAssociated = true;

  /** Visible label text — the default slot's fallback (slot content wins). */
  @property({ type: String })
  label?: string;

  /**
   * Controlled checked channel — STRICT semantics (frozen at 2.1, boolean
   * mirror of tk-checkbox): the element renders exactly this; toggling
   * emits `checked-change` and applies nothing locally. Property-only
   * (`attribute: false`) — a static attribute could never update, so
   * controlled-from-markup would be a trap. Non-boolean values set via JS
   * clamp to their boolean form; null/undefined after control RELEASES to
   * uncontrolled seeded from the last controlled value.
   */
  @property({ type: Boolean, attribute: false })
  checked?: boolean;

  /** Initial checked state for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: Boolean, attribute: 'default-checked' })
  defaultChecked?: boolean;

  /** Disabled: 40% opacity, no pointer events, aria-disabled (kept focusable). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Pass-through: the control's name. REFLECTS — the ElementInternals form
   * mirror reads the HOST's name content attribute for the entry's name
   * (and the inner input carries the same value for direct-DOM consumers).
   */
  @property({ type: String, reflect: true })
  name?: string;

  /** Pass-through: the native input's value (submitted when checked). */
  @property({ type: String })
  value?: string;

  /**
   * Accessible name forwarded to the native input (the wrapper-component
   * pattern): the host carries no role, so a host-level aria-label reaches
   * no AT by itself — this property is the documented way to name a bare
   * switch (no label prop, no slotted content). Typed `string | null` to
   * match the HTMLElement ARIA-reflection base declaration.
   */
  @property({ attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** Live uncontrolled state (the truth whenever `checked` is not provided). */
  #uncontrolledChecked = false;

  /**
   * Whether the default slot carries REAL label content (an element or
   * non-empty text). Empty text nodes do NOT count — Lit template children
   * like `${cond ? html`…` : ''}` assign an empty text node that would
   * otherwise suppress the label prop (the badge-slot presence rule).
   */
  #labelSlotted = false;

  /** Last boolean ever provided through the controlled channel — the seed on release. */
  #lastControlledChecked: boolean | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** ElementInternals form mirror — null where unsupported (happy-dom). */
  readonly #internals: ElementInternals | null = null;

  constructor() {
    super();
    // Feature-detected: environments without ElementInternals keep every
    // other behavior; only the form mirror is skipped.
    this.#internals = 'attachInternals' in this ? this.attachInternals() : null;
  }

  /**
   * Mirrors the submission entry through ElementInternals — exactly what
   * the native control would submit: `value` (or the native "on" default)
   * when checked, NO entry when unchecked. The host's reflected `name`
   * attribute supplies the entry's name.
   */
  #syncFormValue(): void {
    this.#internals?.setFormValue(this.#effectiveChecked ? this.value ?? 'on' : null);
  }

  /**
   * Native reset parity: form.reset() restores the default checkedness
   * (defaultValue semantics — the initial-value contract, again).
   */
  formResetCallback(): void {
    this.#uncontrolledChecked = this.defaultChecked ?? false;
    this.requestUpdate();
  }

  /** The checked state in force: exactly `checked` when controlled, the internal state otherwise. */
  get #effectiveChecked(): boolean {
    return this.#isControlled ? (this.checked ?? false) : this.#uncontrolledChecked;
  }

  /**
   * The frozen §4 state transitions (boolean mirror of tk-checkbox):
   * `defaultChecked` seeds ONLY before the first completed update; `checked`
   * becoming a boolean enters controlled mode (non-booleans set via JS clamp
   * to their boolean form first, so raw non-booleans never live in the
   * channel); null/undefined after control RELEASES to uncontrolled seeded
   * from the last controlled value.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultChecked') && !this.hasUpdated) {
      this.#uncontrolledChecked = this.defaultChecked ?? false;
    }
    if (changed.has('checked')) {
      if (this.checked != null && typeof this.checked !== 'boolean') {
        this.checked = Boolean(this.checked);
        this.#isControlled = true;
        this.#lastControlledChecked = this.checked;
      } else if (typeof this.checked === 'boolean') {
        this.#isControlled = true;
        this.#lastControlledChecked = this.checked;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledChecked = this.#lastControlledChecked ?? false;
      }
    }
  }

  /**
   * Native sync (the tk-checkbox `updated()` contract): the shadow input
   * keeps its own live checkedness between updates (native-feeling toggles
   * in controlled mode until the consumer answers), and every update the
   * element DOES run re-syncs it — checked is a JS-only channel no
   * attribute binding could carry — to the state in force.
   */
  override updated(): void {
    const input = this.renderRoot.querySelector<HTMLInputElement>('.control__input');
    if (input && input.checked !== this.#effectiveChecked) {
      input.checked = this.#effectiveChecked;
    }
    this.#syncFormValue();
  }

  /**
   * Label slot presence (the badge-slot rule mirrored): REAL content (an
   * element or non-empty text) makes the slot win; empty text nodes — the
   * `${cond ? html`…` : ''}` template shape — do NOT suppress the label
   * prop. Checked at firstUpdated (static children are assigned from the
   * first paint) and on every slotchange (content arriving or leaving
   * later).
   */
  #syncLabelSlotted(slot?: HTMLSlotElement): void {
    const labelSlot = slot ?? this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const has = (labelSlot?.assignedNodes({ flatten: true }) ?? []).some(
      (node: Node) =>
        node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
    if (has !== this.#labelSlotted) {
      this.#labelSlotted = has;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncLabelSlotted();
  }

  #handleLabelSlotChange(event: Event): void {
    this.#syncLabelSlotted(event.target as HTMLSlotElement);
  }

  /** `detail: { value }` with the unwrapped boolean; composed + bubbles (CONVENTIONS §3). */
  #emitCheckedChange(value: boolean): void {
    this.dispatchEvent(
      new CustomEvent<TkSwitchChangeDetail>('checked-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Toggle pipeline (Space, Enter and label-click all arrive here through
   * the native input's change event): uncontrolled commits the internal
   * state; both modes emit. Controlled applies nothing locally — the
   * native box stays flipped until the element's next update reverts it to
   * exactly `checked` (the frozen strict contract; the lagging-consumer
   * window mirrors tk-input's caret sanity). Disabled: aria-disabled keeps
   * the control focusable, so a keyboard Space/Enter still flips the
   * native box — the guard reverts checkedness and nothing emits.
   */
  #handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.disabled) {
      input.checked = this.#effectiveChecked;
      return;
    }
    const next = input.checked;
    if (!this.#isControlled) {
      this.#uncontrolledChecked = next;
      this.requestUpdate();
    }
    this.#emitCheckedChange(next);
  }

  /**
   * The one native gap (AC3): a checkbox does not activate on Enter — the
   * guard clicks the input itself (preventDefault first, so the guard owns
   * the key outright; the programmatic click runs the SAME change pipeline
   * Space and label-clicks ride). Every other key (Space above all) stays
   * native: this handler passes them through untouched.
   */
  #handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    (event.target as HTMLInputElement).click();
  }

  override render() {
    return html`
      <label class="root">
        <span class="control">
          <input
            class="control__input"
            type="checkbox"
            role="switch"
            name=${this.name ?? nothing}
            value=${this.value ?? nothing}
            aria-label=${this.ariaLabel ?? nothing}
            aria-disabled=${this.disabled ? 'true' : nothing}
            @change=${this.#handleChange}
            @keydown=${this.#handleKeydown}
          />
          <span class="track" aria-hidden="true">
            <span class="knob"></span>
          </span>
        </span>
        <span class="text">
          ${this.#labelSlotted
            ? nothing
            : this.label ?? nothing}<slot @slotchange=${this.#handleLabelSlotChange}></slot
        ></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-switch': TkSwitch;
  }
}

if (!customElements.get('tk-switch')) {
  customElements.define('tk-switch', TkSwitch);
}
