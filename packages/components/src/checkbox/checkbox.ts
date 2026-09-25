import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { checkboxStyles } from './checkbox.css.js';

/**
 * Payload of `checked-change` (CONVENTIONS §3): always `{ value }` with the
 * unwrapped new boolean — never the raw CustomEvent, never the inner element.
 */
export interface TkCheckboxChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-checkbox `checked-change` event (CONVENTIONS §7). */
export type TkCheckboxChangeEvent = CustomEvent<TkCheckboxChangeDetail>;

/**
 * tk-checkbox — consent-style checkbox with indeterminate (Story 2.4).
 *
 * STATEFUL API — the §4 contract frozen at 2.1 (Input PR), inherited verbatim
 * with a boolean channel: `checked` strict-controlled (renders exactly
 * `checked`; toggling emits `checked-change` and applies nothing locally —
 * the native box keeps its live flip until the element's next update, the
 * same caret-sanity mirror as tk-input), `defaultChecked` seeds uncontrolled
 * (later changes ignored), releasing `checked` goes uncontrolled seeded from
 * the last controlled value.
 *
 * `indeterminate` is VISUAL-ONLY — parent-state display, deliberately OUTSIDE
 * the value channel: it never appears in `checked-change` payloads and the
 * component never clears the prop on toggle (the parent recomputes it —
 * tri-state-tree semantics are the consumer's). Per APG, a toggle from the
 * mixed state lands on checked=true (the native false→true flip underneath);
 * while unchecked+indeterminate, the box shows the yellow+dash mixed visual.
 *
 * ARIA TECHNIQUE (implementer's pick, per the spec): the native shadow
 * `<input type="checkbox">` stays THE interaction/announcement surface —
 * Space, label-click, form association and checked/unchecked announcements
 * all come native. The one gap is indeterminate: the native
 * `input.indeterminate` property is VISUAL ONLY (never announced), so the
 * element sets `aria-checked="mixed"` ON THE NATIVE INPUT while
 * unchecked+indeterminate (explicit aria-checked is legal on input
 * type=checkbox and overrides the native state announcement — exactly the
 * mixed semantics wanted; trade-off: while set, the native unchecked state
 * reads as "mixed" instead, which is the intent). No role=checkbox on the
 * host — that would double the checkbox semantics next to the native input.
 *
 * FORM PARTICIPATION (spec 2.4, unlike tk-input NOT deferred — technique
 * AMENDED, see `formAssociated` below): `name`/`value` reach the form through
 * the host's ElementInternals mirror (the shadow input keeps the attributes
 * for direct-DOM consumers but does not itself associate — Chromium's
 * form-owner walk stops at the shadow root, probed 2026-09-22), so the host
 * inside a `<form>` submits name=value when checked and nothing when
 * unchecked; `form.reset()` restores `defaultChecked`.
 *
 * LABEL: the native `<label>` WRAPS box + input, so label-click toggles and
 * the accessible name comes from the label content for free. Slot-vs-prop
 * precedence (spec's noted pick): default-slot CONTENT when present, else the
 * `label` prop — "present" follows the badge-slot presence rule (an element
 * or non-empty text; Lit's `${cond ? html`…` : ''}` template children assign
 * an EMPTY text node that must not suppress the prop). With neither, a bare
 * box renders (nameless — consumers give it a label or an aria-label on the
 * host).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative native
 * sync (checked/indeterminate are JS-only channels) lives in `updated()`,
 * never at construction.
 *
 * @tag tk-checkbox
 * @attr {string} label - Visible label text (used only when the default slot is empty).
 * @attr {boolean} default-checked - Initial checked state for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} indeterminate - Visual mixed state (yellow fill + ink dash) + aria-checked="mixed"; never enters the value channel.
 * @attr {string} error - Consumer error message: renders the error line immediately (aria-invalid + aria-describedby wired to it), cleared with the prop; ''/null/undefined = no error (story 10.2, the tk-input mold).
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled (kept focusable — the button-pilot pattern).
 * @attr {string} name - The control's form name (reflects; also lands on the native input).
 * @attr {string} value - Pass-through to the native input's value (submitted when checked; native default "on" when unset).
 * @attr {string} aria-label - Accessible name for a bare box (no label/slot) — forwarded to the native input.
 * @slot - Label content; wins over the `label` prop when present.
 * @fires checked-change - `{ value: boolean }` with the unwrapped new checked state; composed, bubbles.
 */
export class TkCheckbox extends LitElement {
  static override readonly styles = [checkboxStyles];

  /**
   * FORM ASSOCIATION (spec 2.4, AMENDED — see NOTES.md/checkbox): the spec's
   * technique («the browser submits the shadow input naturally») does not
   * hold — Chromium's form-owner computation does NOT cross the shadow
   * boundary for native controls (probed 2026-09-22: `form.elements` stays
   * empty with the input checked), which is precisely why form-associated
   * custom elements exist. The host therefore declares `formAssociated` and
   * mirrors the entry through ElementInternals (`setFormValue`), exactly
   * what the native control would have submitted: value (or the native "on"
   * default) when checked, nothing when unchecked. The shadow input stays
   * the interaction/announcement surface; only submission rides the
   * internals. Feature-guarded: environments without ElementInternals
   * (happy-dom) skip the mirror — wiring is unit-pinned, the live FormData
   * row is proven in tests/visual/checkbox.spec.ts (chromium).
   */
  static readonly formAssociated = true;

  /** Visible label text — the default slot's fallback (slot content wins). */
  @property({ type: String })
  label?: string;

  /**
   * Controlled checked channel — STRICT semantics (frozen at 2.1, boolean
   * mirror): the element renders exactly this; toggling emits `checked-change`
   * and applies nothing locally. Property-only (`attribute: false`) — a static
   * attribute could never update, so controlled-from-markup would be a trap.
   * Non-boolean values set via JS clamp to their boolean form; null/undefined
   * after control RELEASES to uncontrolled seeded from the last controlled
   * value.
   */
  @property({ type: Boolean, attribute: false })
  checked?: boolean;

  /** Initial checked state for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: Boolean, attribute: 'default-checked' })
  defaultChecked?: boolean;

  /**
   * VISUAL-ONLY mixed state (parent-state display): yellow fill + ink dash
   * plus `aria-checked="mixed"` while unchecked. Never participates in the
   * value channel and is never cleared by toggling.
   */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /**
   * Consumer-driven error message (story 10.2, the tk-input `error` mold
   * verbatim — NO internal validation exists here and none is added: the
   * documented division keeps internal checks tk-input's required-only):
   * renders the error line immediately, cleared when the prop clears. Empty
   * string and null/undefined (React conditional props) all mean "no error".
   * The message renders as a SIBLING after the wrapping label — error text
   * inside the label would join the accessible name — with the native input
   * carrying aria-invalid + aria-describedby ONLY while a message shows, so
   * the no-error DOM stays byte-identical to the pre-10.2 shape.
   */
  @property({ type: String })
  error?: string;

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
   * box (no label prop, no slotted content). Typed `string | null` to match
   * the HTMLElement ARIA-reflection base declaration.
   */
  @property({ attribute: 'aria-label' })
  ariaLabel: string | null = null;

  /** Live uncontrolled state (the truth whenever `checked` is not provided). */
  #uncontrolledChecked = false;

  /**
   * Whether the default slot carries REAL label content (an element or
   * non-empty text). Empty text nodes do NOT count — Lit template children
   * like `${cond ? html`…` : ''}` assign an empty text node that would
   * otherwise suppress the label prop (the badge-slot presence rule,
   * mirrored for the same reason).
   */
  #labelSlotted = false;

  /** Last boolean ever provided through the controlled channel — the seed on release. */
  #lastControlledChecked: boolean | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** ElementInternals form mirror — null where unsupported (happy-dom). */
  readonly #internals: ElementInternals | null = null;

  /**
   * Per-instance id root for the error channel's aria id-ref (the tk-input
   * mold). Lazily minted on FIRST USE — accessing it only inside the
   * error branch keeps the no-error DOM (and CEM-driven wrappers) free of
   * any minted id.
   */
  #uniqueId?: string;

  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-checkbox-${++TkCheckbox.#nextId}`;
    return this.#uniqueId;
  }

  /**
   * The message in force (the tk-input `#message` null-tolerance): the
   * consumer `error` prop, non-empty only. Checkbox has NO internal
   * validation channel, so there is nothing to override — absent error prop
   * simply means no error, never a crash.
   */
  get #message(): string | null {
    return this.error != null && this.error.length > 0 ? this.error : null;
  }

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
   * The frozen §4 state transitions (boolean mirror of tk-input):
   * `defaultChecked` seeds ONLY before the first completed update; `checked`
   * becoming a boolean enters controlled mode (non-booleans set via JS clamp
   * to their boolean form first, so raw non-booleans never live in the
   * channel); null/undefined after control RELEASES to uncontrolled seeded
   * from the last controlled value. `indeterminate` gets the same null-guard
   * clamp (it reflects, so a raw non-boolean must never reach the attribute).
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
    if (
      changed.has('indeterminate') &&
      this.indeterminate != null &&
      typeof this.indeterminate !== 'boolean'
    ) {
      this.indeterminate = Boolean(this.indeterminate);
    }
  }

  /**
   * Native sync (the tk-input `updated()` contract): the shadow input keeps
   * its own live checkedness between updates (native-feeling toggles in
   * controlled mode until the consumer answers), and every update the element
   * DOES run re-syncs it — and `indeterminate`, a JS-only channel that no
   * attribute binding could carry — to the state in force. The browser also
   * clears the native `indeterminate` on user activation; this hook is what
   * restores it on the next update while the PROP stays consumer-owned.
   */
  override updated(): void {
    const input = this.renderRoot.querySelector<HTMLInputElement>('.control__input');
    if (input) {
      if (input.checked !== this.#effectiveChecked) input.checked = this.#effectiveChecked;
      if (input.indeterminate !== (this.indeterminate && !this.#effectiveChecked)) {
        input.indeterminate = this.indeterminate && !this.#effectiveChecked;
      }
    }
    this.#syncFormValue();
  }

  /**
   * Label slot presence (the badge-slot rule mirrored): REAL content (an
   * element or non-empty text) makes the slot win; empty text nodes — the
   * `${cond ? html`…` : ''}` template shape — do NOT suppress the label prop.
   * Checked at firstUpdated (static children are assigned from the first
   * paint) and on every slotchange (content arriving or leaving later).
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
      new CustomEvent<TkCheckboxChangeDetail>('checked-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * Toggle pipeline (Space and label-click both arrive here through the
   * native input's change event — no custom key handling exists to drift
   * from native behavior): uncontrolled commits the internal state; both
   * modes emit. Controlled applies nothing locally — the native box stays
   * flipped until the element's next update reverts it to exactly `checked`
   * (the frozen strict contract; the lagging-consumer window mirrors
   * tk-input's caret sanity). Uncontrolled requests the update itself: the
   * rendered `aria-checked="mixed"` keys on the effective state, and without
   * a re-render a mixed→checked toggle would leave the explicit override
   * announcing "mixed" over a checked box indefinitely. Controlled re-syncs
   * the explicit `aria-checked` imperatively against the LIVE native flip:
   * a Space in the mixed window clears the visuals to checked while the
   * channel values are unchanged (no render runs), and the stale "mixed"
   * override would keep announcing mixed over a checked box exactly in the
   * state the spec calls out — the attribute follows the native state until
   * the consumer's answer re-renders it from the effective state. Disabled:
   * aria-disabled keeps the control focusable, so a keyboard Space still
   * flips the native box — the guard reverts checkedness AND the mixed
   * channel (UA activation clears `input.indeterminate`; without the
   * restore the dash visual would drop while "mixed" persists) and nothing
   * emits.
   */
  #handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.disabled) {
      input.checked = this.#effectiveChecked;
      input.indeterminate = this.indeterminate && !input.checked;
      return;
    }
    const next = input.checked;
    if (!this.#isControlled) {
      this.#uncontrolledChecked = next;
      this.requestUpdate();
    } else {
      // Controlled mixed window: re-derive the explicit aria-checked from
      // the LIVE native state (no render runs — the channels did not move).
      if (this.indeterminate && !next) input.setAttribute('aria-checked', 'mixed');
      else input.removeAttribute('aria-checked');
    }
    this.#emitCheckedChange(next);
  }

  override render() {
    // Explicit aria-checked ONLY in the mixed window (unchecked+indeterminate):
    // the native announcement serves checked/unchecked; overriding it with
    // "mixed" is precisely the APG fix for unannounced native indeterminate.
    const ariaChecked =
      this.indeterminate && !this.#effectiveChecked ? ('mixed' as const) : nothing;
    const message = this.#message;

    return html`
      <label class="root">
        <span class="control">
          <input
            class="control__input"
            type="checkbox"
            name=${this.name ?? nothing}
            value=${this.value ?? nothing}
            aria-label=${this.ariaLabel ?? nothing}
            aria-checked=${ariaChecked}
            aria-invalid=${message ? 'true' : nothing}
            aria-describedby=${message ? `${this.#id}-error` : nothing}
            aria-disabled=${this.disabled ? 'true' : nothing}
            @change=${this.#handleChange}
          />
          <span class="box" aria-hidden="true">
            <svg
              class="box__check"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4.5 10.5l3.7 3.7L15.5 6"></path>
            </svg>
            <svg
              class="box__dash"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M5 10h10"></path>
            </svg>
          </span>
        </span>
        <span class="text">
          ${this.#labelSlotted
            ? nothing
            : this.label ?? nothing}<slot @slotchange=${this.#handleLabelSlotChange}></slot
        ></span>
      </label>
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
    'tk-checkbox': TkCheckbox;
  }
}

if (!customElements.get('tk-checkbox')) {
  customElements.define('tk-checkbox', TkCheckbox);
}
