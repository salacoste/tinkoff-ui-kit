import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { thumbnailPickerStyles } from './thumbnail-picker.css.js';

/**
 * One option of the `options` prop — the 2.3 data shape plus the picker's
 * own `thumbnail` face source (slotted alternatives are NOT in v1).
 */
export interface TkThumbnailPickerOption {
  /** Stable option value (what `value` / `value-change` carry). */
  value: string;
  /** Option name (the radio's accessible name; feeds the initials fallback). */
  label: string;
  /** Option present but unselectable and skipped by arrow navigation. */
  disabled?: boolean;
  /**
   * Image URL for the tile face. Rendered with `alt=""` (decorative — the
   * label names the radio); a load failure falls back to the initials face.
   */
  thumbnail?: string;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkThumbnailPickerChangeDetail {
  value: string;
}

/** Typed shape of the tk-thumbnail-picker `value-change` event (CONVENTIONS §7). */
export type TkThumbnailPickerChangeEvent = CustomEvent<TkThumbnailPickerChangeDetail>;

/**
 * Last-resort accessible name when `label` is absent — a single
 * localization-ready constant (the tk-select/segmented-radio precedent): an
 * unnamed radiogroup fails the axe name gate, so «Выбор» stands in.
 */
const DEFAULT_ACCESSIBLE_NAME = 'Выбор';

/**
 * Zero-state copy (EXPERIENCE State Patterns: «ProgressBar, ThumbnailPicker →
 * zero-state copy slot; never blank»). The default text inside the `empty`
 * slot; consumers project their own copy through `<* slot="empty">`.
 */
const DEFAULT_EMPTY_COPY = 'Нет доступных вариантов';

/**
 * tk-thumbnail-picker — selectable tiles with ring (Story 2.6), the form's
 * visual-choice control («Выберите дизайн карты»).
 *
 * STATEFUL API — the §4 contract frozen at 2.1 (Input PR), inherited verbatim
 * with a string channel (tk-segmented-radio's exact mirror): `value`
 * strict-controlled (renders exactly `value`; selecting emits `value-change`
 * and applies nothing locally — the native radios keep their live flip until
 * the element's next update), `defaultValue` seeds uncontrolled (later
 * changes ignored), releasing `value` goes uncontrolled seeded from the last
 * controlled value. «Exactly one selected ever» holds by construction: the
 * native radio group is exclusive, `updated()` re-syncs every input to the
 * single value in force, and zero selected is the valid pre-selection state.
 *
 * ARIA TECHNIQUE (the 2.4/2.5 pattern, per the spec's Design Notes): the
 * native shadow `<input type="radio">` group stays THE interaction and
 * announcement surface — Space, label-click, form association and
 * checked/unchecked announcements all come native; the grid carries
 * `role="radiogroup"` named by the visible `label` via aria-labelledby. The
 * label element is a SPAN, not a clickable `<label for>` (the 2.5 ratified
 * lesson): pointing `for` at the tab-stop radio makes Chromium CONCATENATE
 * the group text onto that one option's accessible name — an asymmetric
 * rename that follows the roving tab stop. Each tile is named by its own
 * wrapping label (the option label text, visually hidden inside the face:
 * the reference tiles carry artwork only — no visible captions).
 *
 * ROW-MAJOR GRID NAVIGATION (the one behavior that differs from 2.5): the
 * tiles flow in a `repeat(auto-fill, <tile>)` CSS grid, so the arrows follow
 * GRID semantics — Right/Left step ±1 in DOM order (row-major: Right at a
 * row's end lands on the next row's first tile, WRAPPING through the grid),
 * Down/Up move to the SAME COLUMN in the next/previous row, WRAPPING through
 * the grid bottom/top and CLAMPING to the target row's last tile when the
 * row is too short (an uneven last row — the reference's 4+2; the WAI grid
 * nearest-cell convention). The grid SHAPE is derived from the RENDERED DOM
 * at keydown time: consecutive `.tile` elements are clustered into rows by
 * `offsetTop` (tiles in one grid row share their top offset) — no `columns`
 * prop, no assumption about the container width (the spec's noted judgment
 * call: explicit-free), and position-based moves (not ±columns index
 * arithmetic, which wraps onto the wrong column on uneven rows — found live
 * by the 2.6 visual spec). A degenerate single row makes Down/Up no-ops and
 * leaves the linear Left/Right pair — the matrix's «single row/column
 * degenerates to linear» row. Disabled tiles are skipped by continuing in
 * the SAME direction (column alignment is preserved); when no enabled tile
 * exists in that direction's cycle, the arrow is inert. Selection follows
 * focus (radio semantics). Home/End are deliberately absent (EXPERIENCE's
 * letter: arrows only — the same noted pick as 2.5). Space is never
 * intercepted (native: selects, no-op when already selected); Enter selects
 * explicitly (the spec's test-letter «Space/Enter select») with form-submit
 * suppressed. Tab is never intercepted — the roving tabindex (selected tile
 * 0, others −1; first enabled when nothing selected) makes Tab enter the
 * grid at the selected tile and leave naturally. Every HANDLED key
 * (arrows, Enter) is preventDefaulted BEFORE any disabled exit, so the UA's
 * own radio-arrow roving never runs in any state (the 2.5 review fix).
 *
 * EMPTY STATE (EXPERIENCE State Patterns row): zero options (including
 * `options=null`) renders the zero-state COPY SLOT instead of the grid — a
 * documented default copy in a named `empty` slot, projectable by consumers;
 * inert (no radios, no tab stops, no radiogroup role — an empty radiogroup
 * would fail axe's aria-required-children).
 *
 * TILE FACES: `thumbnail` renders an `<img>` (object-fit cover, alt=""
 * decorative); a LOAD FAILURE (onerror — e.g. a 404) swaps that tile to the
 * initials face permanently (tracked per value+URL; a changed URL retries).
 * No `thumbnail` renders the INITIALS face — the first grapheme of each of
 * the label's first two words, uppercased («Чёрная» → «Ч», «Все покупки» →
 * «ВП») on the field fill (the spec's noted initials-fallback decision).
 *
 * FORM PARTICIPATION (2.4's ratified amendment): the host declares
 * `formAssociated` and mirrors the entry through ElementInternals
 * (`setFormValue`) — the selected option's value under the host's reflected
 * `name`, nothing when unselected. The shadow radios never submit.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the imperative
 * native re-sync lives in `updated()`, never at construction.
 *
 * @tag tk-thumbnail-picker
 * @attr {string} label - Visible group label above the grid (the group's accessible name).
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} disabled - Whole group: 40% opacity, no pointer events, aria-disabled (kept focusable).
 * @attr {string} name - The control's form name (reflects; keys the ElementInternals submission entry).
 * @fires value-change - `{ value: string }` with the unwrapped newly selected option value; composed, bubbles.
 */
export class TkThumbnailPicker extends LitElement {
  static override readonly styles = [thumbnailPickerStyles];

  /**
   * FORM ASSOCIATION (2.4's ratified amendment): the host mirrors the
   * submission entry through ElementInternals — the selected option's value
   * under the host's reflected `name`, no entry when unselected. Feature-
   * guarded: environments without ElementInternals (happy-dom) skip the
   * mirror — wiring is unit-pinned, the live FormData row is proven in
   * tests/visual/thumbnail-picker.spec.ts (chromium).
   */
  static readonly formAssociated = true;

  /** Visible group label above the grid — the group's accessible name. */
  @property({ type: String })
  label?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, string
   * mirror of tk-segmented-radio): the element renders exactly this (the
   * matching option is the selected tile); selecting emits `value-change`
   * and applies nothing locally. Property-only (`attribute: false`);
   * non-strings set via JS clamp to their string form; null/undefined after
   * control RELEASES to uncontrolled seeded from the last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v1 data shape — array of { value, label, disabled?, thumbnail? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  options: TkThumbnailPickerOption[] = [];

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

  /**
   * Failed thumbnail loads — option value → the URL that failed. A retry
   * with a different URL clears itself naturally (the map only matches on
   * the exact pair); the failure stickiness prevents a permanently
   * re-attempting broken image (no broken-image glyph ever shows).
   */
  readonly #thumbnailFailures = new Map<string, string>();

  /** ElementInternals form mirror — null where unsupported (happy-dom). */
  readonly #internals: ElementInternals | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-thumbnail-picker-${++TkThumbnailPicker.#nextId}`;
    return this.#uniqueId;
  }

  constructor() {
    super();
    // Feature-detected: environments without ElementInternals keep every
    // other behavior; only the form mirror is skipped.
    this.#internals = 'attachInternals' in this ? this.attachInternals() : null;
  }

  /** Options with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveOptions(): TkThumbnailPickerOption[] {
    return this.options ?? [];
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /**
   * The radio group name the shadow inputs share: the host `name` when the
   * consumer set one (direct-DOM parity), else a per-instance unique id.
   * Radio grouping is computed per tree — each instance's shadow root is its
   * own tree — so instances never cross-group.
   */
  get #groupName(): string {
    return this.name ?? `${this.#id}-group`;
  }

  /**
   * Where Tab enters the grid (roving tabindex): the option matching the
   * value in force; when nothing is selected, the FIRST non-disabled option;
   * null for an empty (or all-disabled) grid — the empty state renders no
   * radios at all.
   */
  #tabStopIndex(): number | null {
    const options = this.#effectiveOptions;
    if (options.length === 0) return null;
    const selected = options.findIndex((option) => option.value === this.#effectiveValue);
    // A selected-but-disabled option (degenerate consumer data) still shows
    // its checked state but cedes the tab stop.
    if (selected >= 0 && !options[selected]?.disabled) return selected;
    const firstEnabled = options.findIndex((option) => !option.disabled);
    return firstEnabled >= 0 ? firstEnabled : null;
  }

  /**
   * The frozen §4 state transitions (tk-segmented-radio's verbatim string
   * mirror) + the 2.3 options clamp: duplicate option VALUES drop with a
   * dev warn (first occurrence wins), nullish-value entries drop with them.
   * CONVENTIONS §2 degrade-to-default spirit; the reassignment is
   * length-guarded so the follow-up update converges.
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
        // '' drops alongside nullish values: the empty string IS the
        // channel's no-selection sentinel, so an option carrying it could
        // never be addressed by `value`/`defaultValue` in the first place.
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.options != null && deduped.length !== this.options.length) {
        console.warn(
          'tk-thumbnail-picker: duplicate or value-less option entries dropped — option values must be unique non-empty strings (first occurrence wins)',
        );
        this.options = deduped;
      }
    }
  }

  /**
   * Native re-sync (the tk-input/checkbox/segmented-radio `updated()`
   * contract): every update re-derives each shadow radio's checkedness from
   * the single value in force — the exactly-one invariant, enforced against
   * stray native state. Between updates the inputs keep their live flip
   * (native-feeling selection in controlled mode until the consumer
   * answers).
   */
  override updated(): void {
    this.#syncNativeChecked(this.#effectiveValue);
    this.#syncFormValue();
  }

  /** Sets every shadow radio's checkedness to `checked = (value === target)` — idempotent, fires nothing. */
  #syncNativeChecked(target: string): void {
    for (const input of this.#radioInputs()) {
      const shouldBe = input.value === target;
      if (input.checked !== shouldBe) input.checked = shouldBe;
    }
  }

  #radioInputs(): HTMLInputElement[] {
    return [
      ...(this.renderRoot.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
    ];
  }

  #tileElements(): HTMLElement[] {
    return [...(this.renderRoot.querySelectorAll<HTMLElement>('.tile') ?? [])];
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
      new CustomEvent<TkThumbnailPickerChangeDetail>('value-change', {
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
   * NATIVE checkedness live in every mode.
   */
  #commit(value: string): void {
    if (!this.#isControlled) {
      this.#uncontrolledValue = value;
      this.requestUpdate();
    }
    this.#syncNativeChecked(value);
    this.#emitValueChange(value);
  }

  /** Selects option `index`: disabled tiles never select (guarded by every path that lands here too). */
  #selectIndex(index: number): void {
    const option = this.#effectiveOptions[index];
    if (!option || option.disabled || this.disabled) return;
    if (option.value === this.#effectiveValue) return; // no-op when already selected (native semantics)
    this.#commit(option.value);
  }

  /**
   * The RENDERED grid's rows, derived at keydown time (the Design Notes
   * technique — documented): consecutive `.tile` elements are clustered into
   * rows by `offsetTop` (grid row-major flow puts one row's tiles at a
   * shared top offset; a new row starts wherever the offset changes). Each
   * row is the list of OPTION indices it holds — tile order IS option order.
   * Real engines get exact geometry; zero-layout environments (happy-dom,
   * display:none) collapse every tile onto offsetTop 0 → one row → the
   * single-row degeneration (Down/Up no-ops), which is also the honest
   * reading of an unlayouted grid. Row/col POSITIONS (not ±columns index
   * arithmetic) drive the vertical moves: on an UNEVEN last row (the
   * reference's 4+2), index arithmetic would wrap Down from the bottom row
   * onto the wrong column — found live by the 2.6 visual spec.
   */
  #renderedRows(): number[][] {
    const tiles = this.#tileElements();
    const rows: number[][] = [];
    let top: number | null = null;
    tiles.forEach((tile, index) => {
      if (top === null || tile.offsetTop !== top) {
        rows.push([index]);
        top = tile.offsetTop;
      } else {
        rows[rows.length - 1]?.push(index);
      }
    });
    return rows;
  }

  /**
   * Next ENABLED option from `from` stepping ±1 (horizontal), WRAPPING
   * linearly over the options — grid-correct by DOM order, because the next
   * tile in row-major flow IS the next grid cell (Right at a row's end lands
   * on the next row's first tile). Null when no enabled option other than
   * `from` exists in the direction's cycle.
   */
  #stepEnabledLinear(from: number, direction: 1 | -1): number | null {
    const options = this.#effectiveOptions;
    const count = options.length;
    if (count === 0) return null;
    let index = from;
    for (let hop = 0; hop < count; hop += 1) {
      index = (index + direction + count) % count;
      if (index === from) return null; // the cycle closed on the origin
      if (!options[index]?.disabled) return index;
    }
    return null;
  }

  /**
   * Vertical move target: the SAME COLUMN in the next/previous row, WRAPPING
   * through the grid's rows; when the target row is TOO SHORT for the
   * column (an uneven last row — the reference's 4+2), the target clamps to
   * that row's LAST tile (the WAI grid nearest-cell convention). A disabled
   * target continues to the next row in the same direction, same column.
   * Null for a single-row grid (the degeneration: vertical is inert) or when
   * no enabled target exists before the walk returns to `from`.
   */
  #verticalTarget(from: number, direction: 1 | -1): number | null {
    const options = this.#effectiveOptions;
    const rows = this.#renderedRows();
    const rowCount = rows.length;
    if (rowCount === 0) return null;
    const rowIndex = rows.findIndex((row) => row.includes(from));
    if (rowIndex < 0) return null;
    const colIndex = rows[rowIndex]?.indexOf(from) ?? 0;
    for (let hop = 1; hop <= rowCount; hop += 1) {
      const targetRow = rows[(((rowIndex + direction * hop) % rowCount) + rowCount) % rowCount];
      const candidate = targetRow?.[Math.min(colIndex, (targetRow?.length ?? 1) - 1)];
      if (candidate === undefined || candidate === from) return null; // cycled onto the origin
      if (!options[candidate]?.disabled) return candidate;
    }
    return null;
  }

  /**
   * Arrow navigation (EXPERIENCE ThumbnailPicker row): grid semantics over
   * the tile grid — Left/Up = previous, Right/Down = next, ROW-MAJOR
   * (Right at a row's end wraps onto the next row's first tile; Down keeps
   * the column), WRAPPING through the grid edges, disabled tiles SKIPPED
   * (stepping in the same direction), selection FOLLOWS focus. Every
   * HANDLED key (arrows, Enter) is preventDefaulted BEFORE any disabled
   * exit — the UA's own radio-arrow move must never run; the element owns
   * these keys in every state and every engine. Enter selects the focused
   * tile (suppressing form submit from disabled groups too); Space is left
   * native (selects, no-op when already selected); Tab/Home/End pass
   * through untouched.
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
      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        const next = this.#stepEnabledLinear(from, key === 'ArrowRight' ? 1 : -1);
        if (next === null) return; // no enabled target that way: inert
        inputs[next]?.focus();
        this.#selectIndex(next);
        return;
      }
      const next = this.#verticalTarget(from, key === 'ArrowDown' ? 1 : -1);
      if (next === null) return; // single row / no enabled target: inert
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

  /**
   * Thumbnail load failure (the matrix's Image-fail row): the tile swaps to
   * the initials face — no broken-image glyph. Tracked per value+URL so a
   * fixed URL (options updated with a new `thumbnail`) retries naturally.
   */
  #handleThumbnailError(value: string, url: string): void {
    if (this.#thumbnailFailures.get(value) === url) return;
    this.#thumbnailFailures.set(value, url);
    this.requestUpdate();
  }

  /**
   * Initials for the fallback face: the first grapheme of each of the
   * label's first two words, uppercased («Чёрная» → «Ч», «Все покупки» →
   * «ВП»); Array.from keeps surrogate pairs (and Cyrillic) intact. An empty
   * label renders an empty face — the shape requires a label, so this is a
   * null-guard, not a designed state.
   */
  #initialsOf(label: string): string {
    const words = (label ?? '').trim().split(/\s+/).filter((word) => word.length > 0);
    return words
      .slice(0, 2)
      .map((word) => Array.from(word)[0] ?? '')
      .join('')
      .toUpperCase();
  }

  override render() {
    const options = this.#effectiveOptions;
    const hasLabel = this.label != null && this.label.length > 0;
    const labelSpan = hasLabel
      ? html`<span class="label" id="${this.#id}-label">${this.label}</span>`
      : nothing;

    // Zero options (incl. null): the zero-state COPY SLOT renders instead of
    // the grid — inert by construction (no radios, no tab stops) and role-
    // free (an empty radiogroup would fail axe's aria-required-children).
    if (options.length === 0) {
      return html`
        ${labelSpan}
        <div class="empty">
          <slot name="empty">${DEFAULT_EMPTY_COPY}</slot>
        </div>
      `;
    }

    const effective = this.#effectiveValue;
    const tabStop = this.#tabStopIndex();

    return html`
      ${labelSpan}
      <div
        class="grid"
        role="radiogroup"
        aria-labelledby=${hasLabel ? `${this.#id}-label` : nothing}
        aria-label=${!hasLabel ? DEFAULT_ACCESSIBLE_NAME : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        ${options.map((option, index) => {
          const selected = option.value === effective;
          const optionDisabled = option.disabled === true;
          const showImage =
            option.thumbnail != null &&
            option.thumbnail !== '' &&
            this.#thumbnailFailures.get(option.value) !== option.thumbnail;
          return html`
            <label class="tile">
              <input
                class="tile__input"
                type="radio"
                name=${this.#groupName}
                value=${option.value}
                .checked=${selected}
                tabindex=${tabStop === index ? '0' : '-1'}
                aria-disabled=${this.disabled || optionDisabled ? 'true' : nothing}
                @change=${this.#handleChange}
                @keydown=${this.#handleKeydown}
              />
              <span class="tile__face">
                ${showImage
                  ? html`<img
                      class="tile__image"
                      src=${option.thumbnail}
                      alt=""
                      aria-hidden="true"
                      draggable="false"
                      @error=${() => this.#handleThumbnailError(option.value, option.thumbnail ?? '')}
                    />`
                  : html`<span class="tile__initials" aria-hidden="true"
                      >${this.#initialsOf(option.label)}</span
                    >`}
                <span class="tile__text">${option.label}</span>
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
    'tk-thumbnail-picker': TkThumbnailPicker;
  }
}

if (!customElements.get('tk-thumbnail-picker')) {
  customElements.define('tk-thumbnail-picker', TkThumbnailPicker);
}
