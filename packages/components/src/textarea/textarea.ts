import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { textareaStyles } from './textarea.css.js';

/**
 * Payload of `value-change` (CONVENTIONS §3): always `{ value }` with the
 * unwrapped new string — never the raw CustomEvent, never the inner element.
 */
export interface TkTextareaChangeDetail {
  value: string;
}

/**
 * Typed shape of the tk-textarea `value-change` event (CONVENTIONS §7).
 */
export type TkTextareaChangeEvent = CustomEvent<TkTextareaChangeDetail>;

/**
 * Internal on-blur required message (the input-family constant, verbatim).
 */
const REQUIRED_MESSAGE = 'Обязательное поле';

/**
 * tk-textarea — the multiline sibling of tk-input (spec 24T.1, grounded in
 * the 24T terminal notes widget: `.playwright-cli/captures-v5/terminal/`).
 *
 * GROUNDING (measured, not register picks): the live terminal notes field
 * is a 1-row textarea (`rows=1`, placeholder «Добавьте заметку», soft
 * `maxlength=1000`) whose height is driven inline by content — 32px at one
 * line, 48px at two — on fs 13 / lh 16 (body-s). The kit's field box keeps
 * the input family's registers (surface-field fill, radius-md,
 * border-default hairline, the unified focus ring), but the VERTICAL axis
 * is this atom's own: an auto-growing content box, NOT the family's 52px
 * fixed height. Height formula: `16·n + 16` (the FULL border-box: 16px
 * line steps over 7+7 block padding + the 2px hairlines), enforced as CSS
 * `min-height`/`max-height` hooks so consumers
 * resize the growth envelope without touching the growth mechanism.
 *
 * AUTOSIZE (the live widget's own mechanics): `resize: none`, and on every
 * input/update the control's height is re-measured from `scrollHeight`
 * (`height:auto` → measure → set), clamped by the CSS envelope — beyond the
 * envelope the native vertical scrollbar takes over (`overflow-y: auto`).
 * The max-rows prop from the draft spec was CUT in favor of this single
 * CSS channel (one source of truth for the envelope; see the spec Change
 * Log) — `--tk-textarea-max-height` is the only growth limit.
 *
 * FAMILY CONTRACT (frozen at 2.1, inherited verbatim): uncontrolled initial
 * value = `defaultValue` (ignored after the first update); controlled =
 * STRICT — the element renders exactly `value`, typing emits `value-change`
 * and applies nothing locally; removing `value` releases to uncontrolled
 * seeded from the last controlled value. Validation fires on blur
 * (required-only, against the control's LIVE text); the message ties via
 * `aria-describedby`; the error never steals focus. The badge slot is NOT
 * carried over: no grounded multiline surface shows one (the spec's
 * family-minimalism ruling).
 *
 * Accessible-name technique: the native `<label for>` association (the
 * textarea is a single control — no aria-labelledby chain is needed, unlike
 * the input's badge-carrying field). IME guard: composition input events
 * are skipped entirely; the event after compositionend commits normally.
 *
 * SSR-compat (AD-10): a native `<textarea>` in the shadow root via Lit
 * templates; imperative DOM lives in `updated()`, never at construction.
 *
 * @tag tk-textarea
 * @attr {string} label - Visible label above the field (always rendered when set).
 * @attr {string} placeholder - In-field hint; never replaces the label.
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} required - Asterisk on the label + aria-required + on-blur required check.
 * @attr {boolean} sr-only - Visually hides the label while it stays the field's accessible name.
 * @attr {string} error - Consumer error message; renders the error state immediately and overrides the internal one.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled.
 * @attr {string} name - Pass-through to the native textarea's name.
 * @attr {number} maxlength - Pass-through to the native textarea's soft character limit (no default — the live notes widget ships 1000, a consumer concern).
 * @fires value-change - `{ value }` with the unwrapped new string; composed, bubbles; silent on first render (§9).
 */
export class TkTextarea extends LitElement {
  /** Visible label above the field (empty/absent = placeholder names the field). */
  @property({ type: String })
  label?: string;

  /** In-field hint; never replaces the label. */
  @property({ type: String })
  placeholder?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, the family
   * contract): property-only (`attribute: false`), the element renders
   * exactly this; typing emits `value-change` and applies nothing locally.
   * Removing the value releases the field to uncontrolled, seeded from the
   * last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** Required: label asterisk + aria-required + the internal on-blur check. */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Visually-hidden label mode (the input-family sr-only utility, verbatim). */
  @property({ type: Boolean, reflect: true, attribute: 'sr-only' })
  srOnly = false;

  /**
   * Consumer-driven error message: renders the error state immediately
   * (overriding any internal error) and clears when the prop clears.
   * Empty string = no error.
   */
  @property({ type: String })
  error?: string;

  /** Disabled: 40% opacity, no pointer events, aria-disabled (wins over everything). */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Pass-through: the native textarea's name. */
  @property({ type: String })
  name?: string;

  /** Pass-through: the native soft character limit (absent = unlimited). */
  @property({ type: Number })
  maxlength?: number;

  static override readonly styles = [textareaStyles];

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** Internal on-blur required error (null = none). */
  #internalError: string | null = null;

  /** Per-instance id root (the label's `for` target). */
  #uniqueId?: string;

  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-textarea-${++TkTextarea.#nextId}`;
    return this.#uniqueId;
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /**
   * The shadow control's LIVE text ('' before the first render). Blur
   * validation reads THIS, never `#effectiveValue` (the family contract: a
   * lagging controlled consumer must not trip a false required error).
   */
  get #controlValue(): string {
    return this.renderRoot.querySelector<HTMLTextAreaElement>('.field__control')?.value ?? '';
  }

  /**
   * Enum clamp + the frozen state transitions (the 2.1 family contract,
   * verbatim): `defaultValue` seeds only before the first completed update;
   * `value` becoming a string enters controlled mode (non-strings clamp to
   * their string form); null/undefined after control releases to
   * uncontrolled seeded from the last controlled value; `required` turning
   * off clears a shown internal error.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('required') && !this.required && this.#internalError !== null) {
      this.#internalError = null;
    }
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
  }

  /**
   * Value + height sync (the Design Notes contract plus the atom's own
   * autosize): the shadow control keeps its live text for caret sanity
   * between updates; every update the element DOES run re-syncs the text
   * AND re-measures the growth envelope. Imperative DOM lives here, never
   * at construction (AD-10).
   */
  override updated(): void {
    const control = this.renderRoot.querySelector<HTMLTextAreaElement>('.field__control');
    if (control && control.value !== this.#effectiveValue) {
      control.value = this.#effectiveValue;
    }
    this.#syncHeight();
  }

  /**
   * Autosize (the live widget's mechanics, spec 24T.1 AC2): collapse to
   * `auto`, measure `scrollHeight` (content + padding — the 16·n+16
   * envelope's inner half), then set the FULL box height: the control is
   * border-box, so the hairlines ride on top of the measurement. The CSS
   * `min-height`/`max-height` hooks clamp the box without any JS numbers,
   * and `overflow-y: auto` hands overflow to the native scrollbar once
   * content passes the envelope — happy-dom reports scrollHeight 0, which
   * simply collapses to the `auto` height (the 1-row min-height floor
   * holds the visual).
   */
  #syncHeight(): void {
    const control = this.renderRoot.querySelector<HTMLTextAreaElement>('.field__control');
    if (!control) return;
    control.style.height = 'auto';
    const measured = control.scrollHeight;
    if (measured > 0) {
      const box = getComputedStyle(control);
      const borders =
        Number.parseFloat(box.borderTopWidth) + Number.parseFloat(box.borderBottomWidth) || 0;
      control.style.height = `${measured + borders}px`;
    }
  }

  /** `detail: { value }` with the unwrapped string; composed + bubbles (CONVENTIONS §3). */
  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkTextareaChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Typing: uncontrolled updates the internal state; both modes emit and
   * re-measure. The re-measure runs DIRECTLY on the input event — the live
   * widget's own mechanics — because typing may not schedule any Lit update
   * (uncontrolled mode changes no reactive property), and the controlled
   * mode must NOT schedule one over the live text (the §4 caret sanity:
   * `updated()` would re-sync the control back to the controlled value
   * mid-typing). An inline style write needs no update cycle either way.
   * Controlled applies nothing else locally. IME: composition input events
   * are skipped (no commit, no emission, no measure); the event following
   * compositionend delivers the committed text.
   */
  #handleInput(event: Event): void {
    if (this.disabled) return;
    if ((event as InputEvent).isComposing) return;
    const control = event.target as HTMLTextAreaElement;
    if (!this.#isControlled) {
      this.#uncontrolledValue = control.value;
    }
    this.#emitValueChange(control.value);
    this.#syncHeight();
  }

  /**
   * Blur validation (the family contract: validation fires on blur): the
   * required check sets/clears the INTERNAL error against the LIVE text;
   * whitespace-only counts as empty. It never steals focus.
   */
  #handleBlur(): void {
    if (this.disabled) return;
    const next = this.required && this.#controlValue.trim() === '' ? REQUIRED_MESSAGE : null;
    if (next !== this.#internalError) {
      this.#internalError = next;
      this.requestUpdate();
    }
  }

  /**
   * The message in force: the consumer `error` prop overrides the internal
   * one. Null-tolerant for React conditional props.
   */
  get #message(): string | null {
    if (this.error != null && this.error.length > 0) return this.error;
    return this.#internalError;
  }

  /** The error block — the family markup verbatim (calm icon + copy, id-referenced). */
  #renderError(message: string) {
    return html`<p class="error" id="${this.#id}-error">
      <svg
        class="error__icon"
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <circle cx="8" cy="8" r="6.25"></circle>
        <path d="M8 4.75v4"></path>
        <circle class="error__icon-dot" cx="8" cy="11" r="0.25" fill="currentColor"></circle>
      </svg>
      <span class="error__text">${message}</span>
    </p>`;
  }

  override render() {
    const message = this.#message;
    // Null-tolerant (React conditional props): label={null} means "no label".
    const hasLabel = this.label != null && this.label.length > 0;

    return html`
      ${hasLabel
        ? html`<label
              class="label${this.srOnly ? ' label--sr-only' : ''}"
              id="${this.#id}-label"
              for="${this.#id}"
            >
            ${this.label}
            ${this.required ? html`<span class="label__star" aria-hidden="true">*</span>` : nothing}
          </label>`
        : nothing}
      <textarea
        id="${this.#id}"
        class="field__control${message ? ' field__control--error' : ''}"
        rows="1"
        placeholder=${this.placeholder ?? nothing}
        name=${this.name ?? nothing}
        maxlength=${this.maxlength != null && Number.isFinite(this.maxlength) ? this.maxlength : nothing}
        aria-required=${this.required ? 'true' : nothing}
        aria-invalid=${message ? 'true' : nothing}
        aria-describedby=${message ? `${this.#id}-error` : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        ?readonly=${this.disabled}
        @input=${this.#handleInput}
        @blur=${this.#handleBlur}
      ></textarea>
      ${message ? this.#renderError(message) : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-textarea': TkTextarea;
  }
}

if (!customElements.get('tk-textarea')) {
  customElements.define('tk-textarea', TkTextarea);
}
