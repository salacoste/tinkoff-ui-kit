import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { inputStyles } from './input.css.js';

/**
 * Payload of `value-change` (CONVENTIONS §3): always `{ value }` with the
 * unwrapped new string — never the raw CustomEvent, never the inner element.
 */
export interface TkInputChangeDetail {
  value: string;
}

/**
 * Typed shape of the tk-input `value-change` event — the first concrete
 * `Tk<PascalName>...Event` export (CONVENTIONS §7, named at the 1.7 pilot).
 */
export type TkInputChangeEvent = CustomEvent<TkInputChangeDetail>;

/**
 * Single-line text input types the field supports (typed whitelist, spec 2.1).
 * Anything outside the union clamps to `text` — the CONVENTIONS §2 strategy.
 */
export type TkInputType = 'text' | 'email' | 'tel' | 'password' | 'url' | 'search';

/**
 * Internal on-blur required message (voice table: calm, no exclamation).
 * Localization-ready: a single constant, no baked-in concatenation. Consumers
 * needing different copy drive the `error` prop themselves (the documented
 * division: internal check = required-only; everything else = consumer `error`).
 */
const REQUIRED_MESSAGE = 'Обязательное поле';

/**
 * tk-input — the kit's first stateful component (Story 2.1), and the PR where
 * the React-surface and controlled/uncontrolled APIs are FROZEN
 * (CONVENTIONS §4/§9, «frozen at 2.1 — Input PR»):
 *
 * - Uncontrolled initial value = `defaultValue` (attribute `default-value`);
 *   changes after the first update are ignored (initial-value semantics).
 * - Controlled = STRICT: the element renders exactly `value`; typing emits
 *   `value-change` and applies nothing locally (the shadow `<input>` keeps its
 *   live text for caret sanity and re-syncs on the next update — the Design
 *   Notes contract, mirroring how React wraps native inputs).
 * - Removing `value` releases to uncontrolled, seeded from the last
 *   controlled value.
 *
 * Behavior (EXPERIENCE.md Input row): label AND placeholder both supported
 * (placeholder never replaces the label — the label is a static element above
 * the field, Input has no animation by default); required marked with an
 * asterisk + `aria-required`; inline badge slot announced AFTER the label;
 * validation fires on blur; the message ties via `aria-describedby`; the error
 * never steals focus (it is heard on the next visit to the field).
 *
 * Accessible-name technique (implementer's pick, noted per the spec): the
 * inner native input carries `aria-labelledby="…-label …-badge"` — an explicit
 * id-ref chain whose ORDER fixes the screen-reader tree as label → badge →
 * input. The visible `<label for>` stays as the fallback association and the
 * click target; when no label prop is set the placeholder names the field
 * (native last-resort fallback).
 *
 * SSR-compat (AD-10): a native `<input>` in the shadow root, rendered via Lit
 * templates; no imperative DOM at construction time (the value sync lives in
 * `updated()`, the canonical Lit input pattern). Form association
 * (ElementInternals) is NOT in v1 — noted as a limitation in the story docs.
 *
 * @tag tk-input
 * @attr {string} label - Visible label above the field (always rendered when set).
 * @attr {string} placeholder - In-field hint; never replaces the label.
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} required - Asterisk on the label + aria-required + on-blur required check.
 * @attr {boolean} sr-only - Visually hides the label (sr-only utility) while it stays the field's accessible name; documented no-op without `label` (story 10.1).
 * @attr {string} error - Consumer error message; renders the error state immediately and overrides the internal one.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled.
 * @attr {string} name - Pass-through to the native input's name (form data, once form association ships).
 * @attr {text|email|tel|password|url|search} type - Native input type whitelist (default `text`).
 * @attr {string} autocomplete - Pass-through to the native input's autocomplete.
 * @slot badge - Inline badge inside the field, right-anchored (e.g. «+30%»); announced after the label.
 * @fires value-change - `{ value }` with the unwrapped new string; composed, bubbles.
 */
export class TkInput extends LitElement {
  /** Native input type whitelist (invalid runtime values clamp to `text`). */
  static readonly types = ['text', 'email', 'tel', 'password', 'url', 'search'] as const;

  /** Visible label above the field (empty/absent = placeholder names the field). */
  @property({ type: String })
  label?: string;

  /** In-field hint; never replaces the label (EXPERIENCE.md Input row). */
  @property({ type: String })
  placeholder?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1): the element
   * renders exactly this; typing emits `value-change` and applies nothing
   * locally. Property-only (`attribute: false`): a static attribute could
   * never update, so controlled-from-markup would be a trap. Non-string
   * values set via JS clamp to their string form; removing the value
   * releases the field to uncontrolled, seeded from the last controlled
   * value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /**
   * Initial value for the UNCONTROLLED mode (frozen at 2.1): seeds the
   * internal state at the first update; later changes are ignored
   * (initial-value semantics — mutating it after connect does nothing).
   */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** Required: label asterisk + aria-required + the internal on-blur check. */
  @property({ type: Boolean, reflect: true })
  required = false;

  /**
   * Visually-hidden label mode (story 10.1, default-off): the SAME `<label
   * for>` element keeps its id, its `for` association, its click-target role
   * and its first place in the aria-labelledby chain — only its paint is
   * clipped to the sr-only 1px box, and the field renders exactly as the
   * label-less variant (the utility neutralizes the label's bottom margin).
   * Without a `label` set this is a documented no-op: the placeholder still
   * names the field (the existing fallback). The badge slot is an independent
   * surface and stays visible.
   */
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

  /** Pass-through: the native input's name (typed whitelist group, spec 2.1). */
  @property({ type: String })
  name?: string;

  /** Pass-through: native input type from the whitelist; invalid clamps to `text`. */
  @property({ reflect: true })
  type: TkInputType = 'text';

  /** Pass-through: the native input's autocomplete. */
  @property({ type: String })
  autocomplete?: string;

  static override readonly styles = [inputStyles];

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** Internal on-blur required error (null = none). */
  #internalError: string | null = null;

  /** Whether the badge slot carries content (drives the labelledby chain + layout). */
  #badgeSlotted = false;

  /** Per-instance id root for the aria id-ref chain (label → badge → described-by). */
  #uniqueId?: string;

  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-input-${++TkInput.#nextId}`;
    return this.#uniqueId;
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /**
   * The shadow input's LIVE text ('' before the first render). Blur
   * validation reads THIS, never `#effectiveValue`: a lagging controlled
   * consumer (typing emitted, `value` not yet re-applied) must not trip a
   * false required error on a stale channel value.
   */
  get #controlValue(): string {
    return this.renderRoot.querySelector<HTMLInputElement>('.field__control')?.value ?? '';
  }

  /**
   * The message in force: the consumer `error` prop overrides the internal
   * one. Null-tolerant — React conditional props (`error={cond || null}`)
   * reach the element as null, which means "absent" here, never a crash.
   */
  get #message(): string | null {
    if (this.error != null && this.error.length > 0) return this.error;
    return this.#internalError;
  }

  /**
   * Enum clamp + the frozen state transitions (CONVENTIONS §4, spec 2.1):
   * - `defaultValue` seeds ONLY before the first completed update — after
   *   `hasUpdated` flips, mutations of the prop are ignored.
   * - `value` becoming a string enters controlled mode (and remembers the
   *   last controlled value); a NON-STRING (number/object set via JS — React
   * conditional props, loose consumers) clamps to its string form first, so
   * raw non-strings never live in the channel; null/undefined after control
   * RELEASES to uncontrolled seeded from that last value.
   * - `required` turning off clears a shown internal error — the message
   *   cannot outlive its cause waiting for a blur that never validates it.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('type') && !(TkInput.types as readonly string[]).includes(this.type)) {
      this.type = 'text';
    }
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
   * Value sync (the Design Notes contract): the shadow `<input>` keeps its own
   * live text for caret sanity between updates — typing in controlled mode
   * stays visible until the consumer answers (native-feeling), and this hook
   * re-syncs it to the value in force on every update the element DOES run.
   * Imperative DOM lives here, never at construction (AD-10).
   */
  override updated(): void {
    const control = this.renderRoot.querySelector<HTMLInputElement>('.field__control');
    if (control && control.value !== this.#effectiveValue) {
      control.value = this.#effectiveValue;
    }
  }

  /** `detail: { value }` with the unwrapped string; composed + bubbles (CONVENTIONS §3). */
  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkInputChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Typing: uncontrolled updates the internal state; both modes emit.
   * Controlled applies nothing locally. IME: input events with
   * `isComposing` carry provisional composition text — skipped entirely (no
   * state commit, no emission); the input event that follows compositionend
   * delivers the committed text and emits normally.
   */
  #handleInput(event: Event): void {
    if (this.disabled) return;
    if ((event as InputEvent).isComposing) return;
    const control = event.target as HTMLInputElement;
    if (!this.#isControlled) {
      this.#uncontrolledValue = control.value;
    }
    this.#emitValueChange(control.value);
  }

  /**
   * Blur validation (EXPERIENCE.md: validation fires on blur): the required
   * check sets/clears the INTERNAL error against the LIVE text (not the
   * controlled channel — see `#controlValue`), and whitespace-only counts as
   * empty. It never steals focus — the message is heard on the next visit
   * via `aria-describedby`.
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
   * Badge slot content detection (mirrors the button pilot's slot guard):
   * checked at firstUpdated — statically slotted badges are in the labelledby
   * chain from the FIRST paint, not on the event's timing — and again on
   * slotchange for content arriving later.
   */
  #syncBadgeSlotted(slot?: HTMLSlotElement): void {
    const badgeSlot = slot ?? this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="badge"]');
    const has = (badgeSlot?.assignedNodes({ flatten: true }) ?? []).some(
      (node: Node) =>
        node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
    );
    if (has !== this.#badgeSlotted) {
      this.#badgeSlotted = has;
      this.requestUpdate();
    }
  }

  override firstUpdated(): void {
    this.#syncBadgeSlotted();
  }

  #handleBadgeSlotChange(event: Event): void {
    this.#syncBadgeSlotted(event.target as HTMLSlotElement);
  }

  override render() {
    const message = this.#message;
    // Null-tolerant (React conditional props): label={null} means "no label".
    const hasLabel = this.label != null && this.label.length > 0;
    // Labelledby chain: label → badge (spec: the badge is announced AFTER the
    // label). Omitted entirely when neither exists — the placeholder then
    // names the field (native fallback).
    const labelledBy =
      [hasLabel ? `${this.#id}-label` : null, this.#badgeSlotted ? `${this.#id}-badge` : null]
        .filter((part): part is string => part !== null)
        .join(' ') || null;

    return html`
      ${hasLabel
        ? html`<label
              class="label${this.srOnly ? ' label--sr-only' : ''}"
              id="${this.#id}-label"
              for="${this.#id}"
            >
            ${this.label}
            ${this.required
              ? html`<span class="label__star" aria-hidden="true">*</span>`
              : nothing}
          </label>`
        : nothing}
      <div class="field ${this.#badgeSlotted ? 'field--badge' : ''}">
        <input
          id="${this.#id}"
          class="field__control"
          type="${this.type}"
          placeholder=${this.placeholder ?? nothing}
          name=${this.name ?? nothing}
          autocomplete=${this.autocomplete ?? nothing}
          aria-labelledby=${labelledBy ?? nothing}
          aria-required=${this.required ? 'true' : nothing}
          aria-invalid=${message ? 'true' : nothing}
          aria-describedby=${message ? `${this.#id}-error` : nothing}
          aria-disabled=${this.disabled ? 'true' : nothing}
          ?readonly=${this.disabled}
          @input=${this.#handleInput}
          @blur=${this.#handleBlur}
        />
        <span class="field__badge" id="${this.#id}-badge">
          <slot name="badge" @slotchange=${this.#handleBadgeSlotChange}></slot>
        </span>
      </div>
      ${message
        ? html`<p class="error" id="${this.#id}-error">
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
          </p>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-input': TkInput;
  }
}

if (!customElements.get('tk-input')) {
  customElements.define('tk-input', TkInput);
}
