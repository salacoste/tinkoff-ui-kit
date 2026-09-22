import { LitElement, html, nothing, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay, positionFloating } from '../overlays/index.js';
import type { TkOverlayHandle, TkPositioningHandle } from '../overlays/index.js';
import { selectMenuStyles, selectStyles } from './select.css.js';

/**
 * One option of the `options` prop — the kit's v1 data shape (decided per the
 * spec: slotted alternatives are NOT in v1; consumers needing groups/icons
 * compose around the element).
 */
export interface TkSelectOption {
  /** Stable option value (what `value` / `value-change` carry). */
  value: string;
  /** Visible row text (also the option's accessible name). */
  label: string;
  /** Row present but unselectable and skipped by navigation/typeahead. */
  disabled?: boolean;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkSelectChangeDetail {
  value: string;
}

/** Typed shape of the tk-select `value-change` event (CONVENTIONS §7). */
export type TkSelectChangeEvent = CustomEvent<TkSelectChangeDetail>;

/** Payload of `open-change` (CONVENTIONS §9 frozen overlay contract). */
export interface TkSelectOpenChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-select `open-change` event (CONVENTIONS §7). */
export type TkSelectOpenChangeEvent = CustomEvent<TkSelectOpenChangeDetail>;

/**
 * Typeahead buffer reset window — a JS timing constant (the token layer
 * cannot feed JS timers); 500ms matches the `--tk-motion-duration-slow` step
 * the scale already carries. Noted per the spec's «note the timing constant».
 */
export const TK_SELECT_TYPEAHEAD_RESET_MS = 500;

/** Vertical gap between the trigger's field box and the menu panel (px). */
const MENU_OFFSET_PX = 4;

/**
 * Last-resort accessible name when BOTH label and placeholder are absent —
 * a single localization-ready constant (the REQUIRED_MESSAGE precedent in
 * tk-input): an unnamed combobox fails the axe name gate, so "Выбор" stands
 * in rather than shipping an unnamed field.
 */
const DEFAULT_ACCESSIBLE_NAME = 'Выбор';

/**
 * tk-select — native-equivalent keyboard dropdown (Story 2.3), the overlay
 * controller's (2.2) first real consumer.
 *
 * STATEFUL API — the §4 contract frozen at 2.1 (Input PR), inherited
 * verbatim: `value` strict-controlled (renders exactly `value`, selection
 * only emits `value-change`), `defaultValue` seeds uncontrolled (later
 * changes ignored), releasing `value` goes uncontrolled seeded from the last
 * controlled value. `open` is the §9 frozen overlay-surface state: the
 * `open` attribute/property plus `open-change` (`detail: { value: boolean }`).
 *
 * MENU MOUNTING (spec 2.3 Design Notes, AMENDED — see NOTES.md/select): the
 * panel is a GENERATED child of this element's SHADOW ROOT, carrying its own
 * shadow root (`<style>` + `<slot>`) so its styles never leak document-level
 * (§6) and its `:host` rules reset the popover UA sheet. Option rows are the
 * panel's light children INSIDE tk-select's shadow tree: the trigger's
 * `aria-activedescendant` / `aria-controls` id refs stay WITHIN ONE TREE.
 * The Design Notes' light-DOM variant (panel as a host light child plus a
 * mounting <slot>) crosses a shadow boundary on every idref and FAILED the
 * axe gate (aria-valid-attr-value cannot resolve shadow→light refs;
 * strictly-scoped screen readers follow the same rule) — amended here
 * because the decided pattern could not pass the spec's own acceptance
 * criteria. Mounting stays EXCLUSIVELY `mountOverlay(panel, 'dropdown')` +
 * `positionFloating(panel, { anchor: field, matchAnchorWidth: 'min' })`: the
 * popover path promotes the element IN PLACE (the controller's documented
 * shadow-safe mechanism); the fallback path legally moves the panel out of
 * the shadow root into the overlay container (DOM moves cross tree
 * boundaries fine — the panel's own shadow root travels with it) and back on
 * release, a fallback-only window where idrefs cross trees, in engines
 * without popover support (no axe/AT gate runs there; happy-dom unit tests
 * assert structure only). Zero bespoke positioning/z code here; dropdowns do
 * NOT scroll-lock.
 *
 * KEYBOARD (EXPERIENCE Select row — native parity): Enter/Space/arrows/
 * Home/End/typeahead open when closed; arrows navigate with VISUAL focus via
 * aria-activedescendant (wrapping — noted pick); Enter selects; Escape closes
 * without selecting; Home/End jump first/last ENABLED option; typeahead
 * composes a multi-char buffer (TK_SELECT_TYPEAHEAD_RESET_MS reset), matching
 * label prefixes case-insensitively; DISABLED options are skipped by
 * navigation/typeahead and never select (the «skips» pick — noted per the
 * spec); Tab is never intercepted — focus loss closes the menu (focus
 * follows natural tab order), and an outside click closes it and returns
 * focus to the trigger.
 *
 * DECISIONS flagged per the spec's Implementation Notes:
 * - No INTERNAL required validation (unlike Input): a select has no typing,
 *   so blur-timing is ambiguous — `required` is semantics-only (asterisk +
 *   aria-required); the consumer drives `error`.
 * - Selected-row marking = ink check glyph + medium weight (the capture shows
 *   no yellow anywhere; its own selected affordance is a checkbox on a
 *   multiselect — out of scope for v1's single select).
 * - The open-state story renders `<tk-select open>` — the frozen §9
 *   declarative form IS the «menu open through element API» technique.
 *
 * @tag tk-select
 * @attr {string} label - Visible label above the field (always rendered when set).
 * @attr {string} placeholder - In-field hint shown while no option is selected; never replaces the label.
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {boolean} required - Asterisk on the label + aria-required (semantics only — the consumer drives `error`).
 * @attr {string} error - Consumer error message; renders the error state immediately.
 * @attr {boolean} disabled - 40% opacity, no pointer events, aria-disabled; closes an open menu.
 * @attr {boolean} open - Menu open state (frozen §9 overlay contract); reflects, flips via interaction too.
 * @fires value-change - `{ value }` with the unwrapped selected option value; composed, bubbles.
 * @fires open-change - `{ value: boolean }` — the frozen §9 overlay-surface state event; composed, bubbles.
 */
export class TkSelect extends LitElement {
  static override readonly styles = [selectStyles];

  /** Visible label above the field (empty/absent = the placeholder names the field). */
  @property({ type: String })
  label?: string;

  /** In-field hint while nothing is selected; never replaces the label. */
  @property({ type: String })
  placeholder?: string;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, CONVENTIONS
   * §4): the element renders exactly this (the matching option's label);
   * selection emits `value-change` and applies nothing locally. Property-only
   * (`attribute: false`); non-strings set via JS clamp to their string form;
   * null/undefined after control RELEASES to uncontrolled seeded from the
   * last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v1 data shape — array of { value, label, disabled? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  options: TkSelectOption[] = [];

  /** Required: label asterisk + aria-required (semantics only — see the class doc). */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Consumer-driven error message: renders the error state immediately; empty string = no error. */
  @property({ type: String })
  error?: string;

  /** Disabled: 40% opacity, no pointer events, aria-disabled; wins over everything. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Menu open state — the frozen §9 overlay-surface property (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /** Index of the option with VISUAL focus while the menu is open (null = none). */
  #activeIndex: number | null = null;

  /** Multi-char typeahead buffer + its reset timer (fake-timer tested). */
  #typeaheadBuffer = '';
  #typeaheadTimer: number | null = null;

  /** The generated menu panel — a child of the shadow renderRoot (see the class doc), hidden when closed. */
  #panel: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;

  /** Document-level outside-press listener (bound once, added/removed with the menu). */
  #onDocumentPointerDown = (event: Event): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.contains(target) || this.#panel?.contains(target)) return;
    this.#close({ returnFocus: true });
  };

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-select-${++TkSelect.#nextId}`;
    return this.#uniqueId;
  }

  /** Options with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveOptions(): TkSelectOption[] {
    return this.options ?? [];
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /** The option matching the value in force (null when unmatched/empty). */
  get #selectedOption(): TkSelectOption | null {
    const value = this.#effectiveValue;
    if (value === '') return null;
    return this.#effectiveOptions.find((option) => option.value === value) ?? null;
  }

  /** The message in force: the consumer `error` prop (null-tolerant — React conditionals pass null). */
  get #message(): string | null {
    if (this.error != null && this.error.length > 0) return this.error;
    return null;
  }

  /**
   * The frozen §4 state transitions, inherited verbatim from tk-input:
   * `defaultValue` seeds ONLY before the first completed update; `value`
   * becoming a string enters controlled mode (non-strings clamp to their
   * string form first); null/undefined after control releases to
   * uncontrolled seeded from the last controlled value. `disabled` closing an
   * open menu is the select's own addition (an inert field must not keep a
   * floating menu alive).
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
    if (changed.has('disabled') && this.disabled && this.open) {
      this.#setOpen(false, { focus: false });
    }
    // Duplicate option VALUES clamp: `find(value)` marks the FIRST row the
    // selected one, so a later duplicate would render an ambiguous second
    // "same value" row that never selects as such — later duplicates (and
    // nullish-value entries) drop here with a dev warn. CONVENTIONS §2
    // degrade-to-default spirit; the reassignment is length-guarded so the
    // follow-up update this schedules converges (no loop).
    if (changed.has('options')) {
      const seen = new Set<string>();
      const deduped = (this.options ?? []).filter((option) => {
        const value = option?.value;
        if (value == null || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.options != null && deduped.length !== this.options.length) {
        console.warn(
          'tk-select: duplicate or value-less option entries dropped — option values must be unique strings (first occurrence wins)',
        );
        this.options = deduped;
      }
    }
  }

  /**
   * Menu lifecycle rides the `open` property (attribute-driven opens included
   * — the open-state story renders `<tk-select open>`): mount on true,
   * unmount on false. Open-menu content re-renders on options/value changes
   * with the active index clamped back into range.
   */
  override updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      if (this.open) this.#mountMenu();
      else this.#unmountMenu();
      // open-change AFTER the mount/position work (a consumer inspecting at
      // event time sees the visible, positioned panel — not mid-flight), and
      // only on an actual FLIP: Lit lists every reactive property — including
      // never-set ones with old value undefined — in the FIRST update's
      // change map, so a bare old!==new test would fire a spurious
      // open-change(false) at mount (caught by the React wrapper smoke);
      // quiet teardown (disconnect) dispatches nothing (isConnected); a
      // suppressed open (disabled) whose old and new values coincide never
      // flips.
      const wasOpen = changed.get('open');
      if (this.isConnected && wasOpen !== undefined && wasOpen !== this.open) {
        this.dispatchEvent(
          new CustomEvent<TkSelectOpenChangeDetail>('open-change', {
            detail: { value: this.open },
            composed: true,
            bubbles: true,
          }),
        );
      }
    }
    if (
      this.open &&
      (changed.has('options') ||
        changed.has('value') ||
        changed.has('defaultValue') ||
        changed.has('label') ||
        changed.has('placeholder'))
    ) {
      this.#syncActiveOnDataChange();
      // The sync mutates the PRIVATE active index after this pass's render
      // already read it — request the next pass so the trigger's
      // aria-activedescendant re-renders against the clamped index (the
      // panel rows re-render directly below).
      this.requestUpdate();
      this.#renderMenu();
    }
  }

  override firstUpdated(): void {
    // Eager panel creation: the element exists in the DOM from the first
    // paint, so the trigger's aria-controls always references a real node
    // (axe validates the id even while the panel is hidden).
    this.#getPanel();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown: release controller resources without dispatching (the
    // element is leaving the tree; an event here has no meaningful consumer).
    if (this.open) {
      this.open = false;
    }
    this.#unmountMenu();
  }

  // --- menu panel (shadow-tree child, controller-mounted) -------------------

  /** The generated panel: role=listbox, own shadow root (styles + slot), hidden until open. */
  #getPanel(): HTMLDivElement {
    if (this.#panel) return this.#panel;
    const panel = document.createElement('div');
    panel.setAttribute('role', 'listbox');
    panel.id = `${this.#id}-listbox`;
    panel.hidden = true;
    this.#syncPanelName(panel);
    panel.addEventListener('pointerdown', (event) => {
      // Focus must not leave the trigger for menu presses (Safari moves it to
      // the body otherwise, tripping the focus-loss close mid-click).
      // preventDefault on pointerdown stops the focus move, not the click.
      event.preventDefault();
    });
    const shadow = panel.attachShadow({ mode: 'open' });
    render(html`<style>${selectMenuStyles.cssText}</style><slot></slot>`, shadow);
    // Shadow-root child (see the class doc): renders in tree order — no
    // mounting <slot> (slot assignment is a LIGHT-child concept). Appended
    // at the end of the renderRoot, outside Lit's template markers.
    this.renderRoot.appendChild(panel);
    this.#panel = panel;
    return panel;
  }

  /**
   * The panel's accessible name (axe `aria-input-field-name`: role=listbox
   * must be named): the field label, else the placeholder — the same
   * name-fallback chain the trigger's aria-label uses.
   */
  #panelName(): string {
    if (this.label != null && this.label.length > 0) return this.label;
    if (this.placeholder != null && this.placeholder.length > 0) return this.placeholder;
    return DEFAULT_ACCESSIBLE_NAME;
  }

  #syncPanelName(panel: HTMLDivElement): void {
    panel.setAttribute('aria-label', this.#panelName());
  }

  /** Renders the option rows into the panel's light children — same shadow tree as the trigger (see the class doc). */
  #renderMenu(): void {
    const panel = this.#getPanel();
    this.#syncPanelName(panel);
    const selected = this.#selectedOption;
    render(
      html`${this.#effectiveOptions.map((option, index) => {
        const isSelected = option === selected;
        const isActive = this.#activeIndex === index;
        return html`<div
          role="option"
          id="${this.#id}-option-${index}"
          class=${isActive ? 'tk-active' : nothing}
          aria-selected=${isSelected ? 'true' : 'false'}
          aria-disabled=${option.disabled ? 'true' : nothing}
          @click=${() => this.#selectIndex(index)}
        >
          <span class="tk-select-option__label">${option.label}</span>
          ${isSelected
            ? html`<svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="margin-inline-start:auto;flex:none"
              >
                <path d="M3 8.5l3.2 3.2L13 5"></path>
              </svg>`
            : nothing}
        </div>`;
      })}`,
      panel,
    );
  }

  #trigger(): HTMLButtonElement | null {
    return this.renderRoot.querySelector<HTMLButtonElement>('.field__trigger');
  }

  /**
   * The POSITIONING anchor: the field BOX, not the trigger button inside it —
   * the button excludes the chevron strip and the menu would hang ~50px short
   * of the field's right edge (invisible on light surfaces, obvious on dark;
   * caught in the 2.3 vision pass).
   */
  #anchorField(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.field');
  }

  #mountMenu(): void {
    if (this.disabled) {
      this.#setOpen(false, { focus: false });
      return;
    }
    const panel = this.#getPanel();
    const trigger = this.#trigger();
    panel.hidden = false;
    // Every open establishes visual focus — interaction opens chose their
    // edge in #openAt; attribute/programmatic opens default to the first
    // enabled row (selected wins when set), never "nowhere". #setActive (not
    // a bare field write) so the trigger's aria-activedescendant re-renders —
    // a declarative open has no later update that would pick the field up.
    if (this.#activeIndex === null) this.#setActive(this.#initialActiveIndex('first'));
    this.#syncActiveOnDataChange();
    this.#renderMenu();
    const anchor = this.#anchorField() ?? trigger;
    if (trigger && anchor) {
      // Controller-only mechanics (AD-12): dropdown layer, bottom placement,
      // anchor-min-width (long labels may grow past the trigger).
      this.#overlayHandle = mountOverlay(panel, 'dropdown');
      this.#positionHandle = positionFloating(panel, {
        anchor,
        placement: 'bottom',
        offset: MENU_OFFSET_PX,
        matchAnchorWidth: 'min',
      });
    }
    document.addEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#scrollActiveIntoView();
  }

  #unmountMenu(): void {
    document.removeEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const panel = this.#panel;
    if (panel) {
      // The container fallback path DETACHES the panel on release (the
      // controller owns its DOM while mounted) — re-home it INTO THE SHADOW
      // ROOT (its rendering home, the same tree as the trigger's aria refs)
      // so the next open stays valid. Popover-path releases leave it in
      // place (promoted in place, never moved).
      if (!panel.isConnected) this.renderRoot.appendChild(panel);
      panel.hidden = true;
    }
    this.#activeIndex = null;
  }

  /**
   * Where visual focus starts on open: the selected option when it is
   * selectable, else an edge (interaction-driven opens pick the edge by the
   * opening key; every other open — including the declarative `open`
   * attribute — starts at the first enabled row, never nowhere).
   */
  #initialActiveIndex(edge: 'first' | 'last'): number | null {
    const options = this.#effectiveOptions;
    if (options.length === 0) return null;
    const selectedIndex = this.#selectedOption ? options.indexOf(this.#selectedOption) : -1;
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) return selectedIndex;
    return edge === 'first' ? this.#firstEnabled() : this.#lastEnabled();
  }

  /** Opens (or keeps open) with visual focus on the selected option, else an edge. */
  #openAt(edge: 'first' | 'last'): void {
    this.#activeIndex = this.#initialActiveIndex(edge);
    this.#setOpen(true, {});
  }

  #firstEnabled(): number | null {
    const options = this.#effectiveOptions;
    for (let i = 0; i < options.length; i += 1) {
      if (!options[i]?.disabled) return i;
    }
    return null;
  }

  #lastEnabled(): number | null {
    const options = this.#effectiveOptions;
    for (let i = options.length - 1; i >= 0; i -= 1) {
      if (!options[i]?.disabled) return i;
    }
    return null;
  }

  /** Next/previous ENABLED option from `from`, WRAPPING (the noted pick — native parity). */
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

  #setActive(index: number | null): void {
    if (this.#activeIndex === index) return;
    this.#activeIndex = index;
    this.#renderMenu();
    this.requestUpdate();
    this.#scrollActiveIntoView();
  }

  #scrollActiveIntoView(): void {
    if (!this.open || this.#activeIndex === null || !this.#panel) return;
    const row = this.#panel.children[this.#activeIndex] as Element | undefined;
    // Guarded: the row exists right after #renderMenu (Lit render is sync).
    if (row && typeof row.scrollIntoView === 'function') {
      row.scrollIntoView({ block: 'nearest' });
    }
  }

  /** Active index follows the data: keep in range, drop onto the selected option, never onto a disabled row. */
  #syncActiveOnDataChange(): void {
    const options = this.#effectiveOptions;
    if (this.#activeIndex === null) return;
    if (options.length === 0) {
      this.#activeIndex = null;
      return;
    }
    const selectedIndex = this.#selectedOption ? options.indexOf(this.#selectedOption) : -1;
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      this.#activeIndex = selectedIndex;
      return;
    }
    const clamped = Math.min(this.#activeIndex, options.length - 1);
    this.#activeIndex = options[clamped]?.disabled ? this.#stepEnabled(clamped, 1) : clamped;
  }

  // --- state transitions -----------------------------------------------------

  #setOpen(next: boolean, options: { focus?: boolean }): void {
    if (this.disabled && next) return;
    if (this.open === next) {
      if (options.focus) this.#trigger()?.focus();
      return;
    }
    this.open = next; // mount/unmount + the open-change dispatch ride updated()
    if (options.focus) {
      // Focus the trigger once the update (and its menu mount) has run.
      void this.updateComplete.then(() => this.#trigger()?.focus());
    }
  }

  #close(options: { returnFocus: boolean }): void {
    this.#clearTypeahead();
    this.#setOpen(false, { focus: options.returnFocus });
  }

  /** Selects option `index`: disabled rows never select; controlled applies nothing locally. */
  #selectIndex(index: number): void {
    const option = this.#effectiveOptions[index];
    if (!option || option.disabled) return;
    if (!this.#isControlled) {
      this.#uncontrolledValue = option.value;
    }
    this.#emitValueChange(option.value);
    this.#close({ returnFocus: true });
  }

  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkSelectChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  // --- typeahead ---------------------------------------------------------------

  #clearTypeahead(): void {
    this.#typeaheadBuffer = '';
    if (this.#typeaheadTimer !== null) {
      window.clearTimeout(this.#typeaheadTimer);
      this.#typeaheadTimer = null;
    }
  }

  /** Composes the buffer and jumps to the first ENABLED label-prefix match (no match → stays). */
  #runTypeahead(key: string): void {
    this.#typeaheadBuffer += key.toLowerCase();
    if (this.#typeaheadTimer !== null) window.clearTimeout(this.#typeaheadTimer);
    this.#typeaheadTimer = window.setTimeout(() => {
      this.#typeaheadBuffer = '';
      this.#typeaheadTimer = null;
    }, TK_SELECT_TYPEAHEAD_RESET_MS);
    const buffer = this.#typeaheadBuffer;
    const options = this.#effectiveOptions;
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      // Nullish labels (loose consumer data) clamp to '' — never a crash.
      if (option && !option.disabled && String(option.label ?? '').toLowerCase().startsWith(buffer)) {
        if (!this.open) {
          this.#activeIndex = i;
          this.#setOpen(true, {});
        } else {
          this.#setActive(i);
        }
        return;
      }
    }
    // No match: the buffer still consumed the keypress (native behavior —
    // the buffer composes even when nothing matches it yet).
  }

  // --- interaction handlers ------------------------------------------------------

  #handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    // IME: mid-composition keydowns carry provisional input (isComposing,
    // or the legacy keyCode 229 placeholder) — fully inert here, mirroring
    // tk-input's composition guard. The event after compositionend delivers
    // the committed text and runs the normal typeahead path.
    if (event.isComposing || event.keyCode === 229) return;
    const key = event.key;
    const printable = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

    if (!this.open) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault(); // Enter/Space: suppress the native click toggle too
        // Zero options: an expanded EMPTY listbox announces nothing useful —
        // interaction opens stay inert until options exist.
        if (this.#effectiveOptions.length === 0) return;
        this.#openAt(key === 'ArrowUp' ? 'last' : 'first');
        return;
      }
      if (key === 'Home' || key === 'End') {
        event.preventDefault();
        if (this.#effectiveOptions.length === 0) return;
        this.#openAt(key === 'Home' ? 'first' : 'last');
        return;
      }
      if (printable) {
        event.preventDefault();
        this.#clearTypeahead();
        this.#runTypeahead(key);
        return;
      }
      return; // Escape/Tab closed: native behavior (Tab moves focus on)
    }

    // --- menu open ---
    switch (key) {
      case 'Escape':
        event.preventDefault();
        this.#close({ returnFocus: true }); // closes WITHOUT changing value
        return;
      case 'Enter':
        event.preventDefault(); // suppress the native click toggle
        if (this.#activeIndex !== null) this.#selectIndex(this.#activeIndex);
        return;
      case 'ArrowDown': {
        event.preventDefault();
        if (this.#activeIndex === null) {
          const first = this.#firstEnabled();
          if (first !== null) this.#setActive(first);
        } else {
          const next = this.#stepEnabled(this.#activeIndex, 1);
          if (next !== null) this.#setActive(next);
        }
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (this.#activeIndex === null) {
          const last = this.#lastEnabled();
          if (last !== null) this.#setActive(last);
        } else {
          const next = this.#stepEnabled(this.#activeIndex, -1);
          if (next !== null) this.#setActive(next);
        }
        return;
      }
      case 'Home': {
        event.preventDefault();
        const first = this.#firstEnabled();
        if (first !== null) this.#setActive(first);
        return;
      }
      case 'End': {
        event.preventDefault();
        const last = this.#lastEnabled();
        if (last !== null) this.#setActive(last);
        return;
      }
      default:
        if (printable && key !== ' ') {
          event.preventDefault(); // no page scroll from menu typing
          this.#runTypeahead(key);
        }
        return; // Space open-menu: inert by design (Enter is the select key) — and never a buffer char
    }
  }

  #handleTriggerClick(): void {
    if (this.disabled) return;
    this.#clearTypeahead();
    // Zero options: a click-open shows an empty expanded listbox — inert.
    if (!this.open && this.#effectiveOptions.length === 0) return;
    this.#setOpen(!this.open, { focus: false });
  }

  /**
   * Focus loss (EXPERIENCE: the menu closes on outside click AND on focus
   * loss): any focusout whose relatedTarget is outside the whole component
   * closes the menu — focus then follows the NATURAL tab order (no forced
   * return; that behavior belongs to the outside-click row only).
   */
  #handleFocusout(event: FocusEvent): void {
    if (!this.open) return;
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.#panel?.contains(next))) return;
    this.#close({ returnFocus: false });
  }

  // --- render -----------------------------------------------------------------

  override render() {
    const message = this.#message;
    const hasLabel = this.label != null && this.label.length > 0;
    const selected = this.#selectedOption;
    const labelledBy = hasLabel ? `${this.#id}-label` : null;
    const activeId =
      this.open && this.#activeIndex !== null ? `${this.#id}-option-${this.#activeIndex}` : null;

    return html`
      ${hasLabel
        ? html`<label class="label" id="${this.#id}-label" for="${this.#id}">
            ${this.label}
            ${this.required
              ? html`<span class="label__star" aria-hidden="true">*</span>`
              : nothing}
          </label>`
        : nothing}
      <div class="field">
        <button
          type="button"
          class="field__trigger"
          id="${this.#id}"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="${this.#id}-listbox"
          aria-activedescendant=${activeId ?? nothing}
          aria-labelledby=${labelledBy ?? nothing}
          aria-label=${!hasLabel ? this.placeholder ?? DEFAULT_ACCESSIBLE_NAME : nothing}
          aria-required=${this.required ? 'true' : nothing}
          aria-invalid=${message ? 'true' : nothing}
          aria-describedby=${message ? `${this.#id}-error` : nothing}
          aria-disabled=${this.disabled ? 'true' : nothing}
          @keydown=${this.#handleTriggerKeydown}
          @click=${this.#handleTriggerClick}
          @focusout=${this.#handleFocusout}
        >
          <span
            class="field__value ${selected ? '' : 'field__value--placeholder'}"
          >${selected ? selected.label : this.placeholder ?? ''}</span>
        </button>
        <span class="field__chevron" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 9.5l6 6 6-6"></path>
          </svg>
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
    'tk-select': TkSelect;
  }
}

if (!customElements.get('tk-select')) {
  customElements.define('tk-select', TkSelect);
}
