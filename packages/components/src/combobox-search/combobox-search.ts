import { LitElement, html, nothing, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay, positionFloating } from '../overlays/index.js';
import type { TkOverlayHandle, TkPositioningHandle } from '../overlays/index.js';
import { comboboxSearchMenuStyles, comboboxSearchStyles } from './combobox-search.css.js';

/**
 * One item of the `options` prop — the 2.3 options mold (slotted
 * alternatives are NOT in v2; consumers compose around the element).
 */
export interface TkComboboxSearchOption {
  /** Stable option value (what `value` / `value-change` carry). */
  value: string;
  /** Visible row text (also the row's accessible name). */
  label: string;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkComboboxSearchChangeDetail {
  value: string;
}

/** Typed shape of the tk-combobox-search `value-change` event (CONVENTIONS §7). */
export type TkComboboxSearchChangeEvent = CustomEvent<TkComboboxSearchChangeDetail>;

/**
 * Last-resort accessible name when `label` is absent (the tk-select/tk-
 * filter-chips precedent): an unnamed combobox fails the axe name gate, so
 * «Поиск» stands in rather than shipping an unnamed field.
 */
const DEFAULT_ACCESSIBLE_NAME = 'Поиск';

/**
 * The reference's own placeholder — the search field in the TOP REGION of
 * pattern-catalog-filters.png (provenance: the spec 6.3 frontmatter +
 * .playwright-cli/verify/combobox-search/reference-measurements.md).
 */
const DEFAULT_PLACEHOLDER = 'Название или тикер';

/** The zero-matches row/live message when `noResultsMessage` is absent. */
const DEFAULT_NO_RESULTS = 'Ничего не найдено';

/** Vertical gap between the field and the suggestion panel (px — the select literal's sibling). */
const MENU_OFFSET_PX = 4;

/**
 * tk-combobox-search — borderless search field with a filtering suggestion
 * listbox (Story 6.3), the invest/stocks catalog's instrument search.
 *
 * ANATOMY (vision-extracted from the search field in the TOP REGION of
 * pattern-catalog-filters.png — provenance:
 * .playwright-cli/verify/combobox-search/reference-measurements.md): a 52px
 * borderless field (surface fill, radius-md, 20px leading magnifier in
 * text-muted, body-l control text, the placeholder «Название или тикер»)
 * that stays an input — the suggestion panel is a generated overlay, never
 * an inline growth of the field.
 *
 * SEMANTICS (APG combobox, selection follows focus on the ACTIVE row only):
 * the input is role=combobox (aria-expanded/controls/activedescendant,
 * aria-autocomplete="list"); the panel is role=listbox of role=option rows;
 * focus NEVER leaves the field — navigation moves `aria-activedescendant`
 * over the filtered rows and marks the active row `.tk-active` (the
 * trigger-scope focus pattern, the 6.2 lesson a). Printable keys are never
 * intercepted: they ride the native input event and RE-FILTER (a search
 * field, not a typeahead jump-buffer). IME pauses the pipeline: input
 * events with `isComposing` (and keyCode 229) are ignored until
 * composition settles — the native contract; compositionstart/end are
 * tracked so re-renders never clobber provisional text mid-composition,
 * while the commit/Escape restore still lands (see #forceFieldSync). While
 * the menu is open,
 * Home/End jump the active row (menu semantics); while CLOSED they pass
 * through as native caret moves — a single-line input owns them (documented
 * in the story a11y notes). Space is a query character, never a menu key
 * (the tk-select Space-inert rule does NOT cross over).
 *
 * OPEN MODEL: typing opens the panel filtered to the query; ArrowDown opens
 * at the first row, ArrowUp at the last (the APG combobox edges); Enter
 * commits the active row through `value-change`; Escape closes AND restores
 * the field to the committed value's label (the query is transient input
 * state, never a value state); an outside press closes with focus returned
 * to the field while KEEPING the transient query (only Escape restores the
 * committed label — the outside press is not a text decision); focus loss
 * closes along the natural tab order. The open
 * state is INTERNAL UI (the tk-filter-chips/tk-navbar precedent — spec 6.3
 * ruled it; recorded in the §9 exception log): no `open` channel, nothing
 * dispatches open-change.
 *
 * ANNOUNCEMENTS (spec 6.3): a visually-hidden polite status region carries
 * «Найдено N инструментов» / «Ничего не найдено» after each filter settles
 * — template-bound, so the text mutates in the SAME update pass as the rows
 * (never mid-flight); it clears when the menu closes. The count message is
 * prop-overridable: `resultsMessage` (a template where `{n}` substitutes
 * the count) and `noResultsMessage`. The RU default pluralizes correctly
 * (инструмент/инструмента/инструментов).
 *
 * FILTERING: case-insensitive substring over BOTH the label and the value
 * (ticker-first users type `GAZP`, label-first type «Газ»; a
 * whitespace-only query is NO filter — trimmed) — deterministic,
 * stable-order (the options array's own order; no relevance ranking in v2).
 *
 * STATEFUL API — the §4 contract frozen at 2.1, inherited verbatim with a
 * string channel (tk-select's exact mirror): `value` strict-controlled
 * (renders exactly `value` — the field shows the matching label, a foreign
 * value renders as itself, nothing clamps; committing emits `value-change`
 * and applies nothing locally), `defaultValue` seeds uncontrolled (later
 * changes ignored), releasing `value` goes uncontrolled seeded from the
 * last controlled value. The LIVE QUERY is not the value channel: while
 * typing, the field keeps its live text between updates (the frozen
 * caret-sanity carve-out) and the committed channel stays untouched until
 * a row is committed.
 *
 * MOUNTING: the panel is a generated child of this element's shadow root
 * carrying its OWN shadow root (the select 2.3 mold — single-tree aria
 * idrefs). Mounting is EXCLUSIVELY mountOverlay(panel, 'dropdown') +
 * positionFloating (anchor = the field box — the select lesson, not the
 * icon; matchAnchorWidth: true — the panel width-matches the field): zero
 * bespoke positioning/z code.
 *
 * @tag tk-combobox-search
 * @attr {string} label - Accessible name of the combobox (no visual label — the capture shows none).
 * @attr {string} placeholder - Field placeholder (default «Название или тикер»).
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @attr {string} results-message - Live-region template for the match count; `{n}` substitutes the count.
 * @attr {string} no-results-message - Live/row message when nothing matches (default «Ничего не найдено»).
 * @attr {boolean} disabled - Disables the field and closes any open panel.
 * @fires value-change - `{ value }` with the unwrapped committed option value; composed, bubbles.
 */
export class TkComboboxSearch extends LitElement {
  static override readonly styles = [comboboxSearchStyles];

  /**
   * Accessible name of the combobox. Purely an aria-label — the capture
   * shows NO inline visual label above the field.
   */
  @property({ type: String })
  label?: string;

  /** The field placeholder (the reference's own default). */
  @property({ type: String })
  placeholder = DEFAULT_PLACEHOLDER;

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, string
   * mirror of tk-select): the element renders exactly this (the field shows
   * the matching label; a foreign value renders as itself — search fields
   * hold free text, so nothing clamps the channel); committing emits
   * `value-change` and applies nothing locally. Property-only
   * (`attribute: false`); non-strings set via JS coerce to their string
   * form; null/undefined after control RELEASES to uncontrolled seeded from
   * the last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v2 data shape — array of { value, label }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  options: TkComboboxSearchOption[] = [];

  /**
   * Live-region template for the match count — `{n}` substitutes the count
   * (e.g. `'{n} matches'`). Absent/empty → the RU pluralizing default.
   */
  @property({ type: String, attribute: 'results-message' })
  resultsMessage?: string;

  /** The zero-matches message (the live region AND the empty row). */
  @property({ type: String, attribute: 'no-results-message' })
  noResultsMessage?: string;

  /** Disables the field (readonly + inert styling) and closes any open panel. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  /**
   * The transient search text — INPUT state, never the value channel.
   * `null` = the field shows the committed value's label.
   */
  #query: string | null = null;

  /** The suggestion panel open state — INTERNAL UI (the filter-chips precedent; no open-change). */
  #menuOpen = false;

  /** IME composition in flight (compositionstart..compositionend on the control). */
  #composing = false;

  /**
   * Forces the live-text re-sync on the NEXT update even mid-composition —
   * set by the commit/Escape-restore paths, whose field rewrite is
   * load-bearing (an orphaned provisional text would otherwise survive
   * them; consumed and cleared in updated()).
   */
  #forceFieldSync = false;

  /** Active row over the FILTERED list (aria-activedescendant's target); null when none. */
  #activeIndex: number | null = null;

  /** The generated suggestion panel — a child of the shadow renderRoot (see the class doc), hidden when closed. */
  #panel: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;

  /** Document-level outside-press listener (bound once, added/removed with the menu). */
  #onDocumentPointerDown = (event: Event): void => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.contains(target) || this.#panel?.contains(target)) return;
    this.#closeMenu({ returnFocus: true });
  };

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-combobox-search-${++TkComboboxSearch.#nextId}`;
    return this.#uniqueId;
  }

  /** Options with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveOptions(): TkComboboxSearchOption[] {
    return this.options ?? [];
  }

  /** The value channel in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /** The committed option — matched by value; null when the value is empty/foreign. */
  get #committedOption(): TkComboboxSearchOption | null {
    const value = this.#effectiveValue;
    if (value === '') return null;
    return this.#effectiveOptions.find((option) => option.value === value) ?? null;
  }

  /** What the field shows when no query is live: the committed label, a foreign value as itself, else ''. */
  get #committedDisplay(): string {
    const committed = this.#committedOption;
    if (committed) return String(committed.label ?? '');
    return this.#effectiveValue;
  }

  /**
   * The filtered list — case-insensitive substring over label AND value,
   * stable order. An empty/null query means no filtering (the whole list).
   * Nullish labels degrade to '' (§2 — never throws; the option stays
   * reachable through its value).
   */
  get #filteredOptions(): TkComboboxSearchOption[] {
    const query = this.#query?.trim().toLowerCase() ?? '';
    if (query === '') return this.#effectiveOptions;
    return this.#effectiveOptions.filter(
      (option) =>
        String(option.label ?? '')
          .toLowerCase()
          .includes(query) || option.value.toLowerCase().includes(query),
    );
  }

  /**
   * The frozen §4 state transitions (tk-select's verbatim string mirror —
   * with NO unmatched-value clamp: a search field legitimately holds free
   * text, so a foreign value renders as itself) + the duplicate option
   * VALUES clamp (the 2.3 options mold; the reassignment is length-guarded
   * so the follow-up update converges). Value-LESS entries (null/undefined
   * AND '') drop too — beyond tk-select's nullish-only dedup, and
   * load-bearing: '' is the empty-value sentinel in #committedOption, so a
   * ''-valued option could never be committed.
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
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.options != null && deduped.length !== this.options.length) {
        console.warn(
          'tk-combobox-search: duplicate or value-less option entries dropped — option values must be unique non-empty strings (first occurrence wins)',
        );
        this.options = deduped;
      }
    }
    if (changed.has('disabled') && this.disabled && this.#menuOpen) {
      this.#closeMenu({ returnFocus: false });
    }
  }

  override firstUpdated(): void {
    // Eager panel creation: the input's aria-controls always references a
    // real node (axe validates the id even while the panel is hidden).
    this.#getPanel();
  }

  override updated(changed: PropertyValues<this>): void {
    // Live-text re-sync (the §4 caret carve-out's other half): the `.value`
    // template binding is dirty-checked, so an update whose binding value is
    // UNCHANGED (commit/Escape restoring the same display the field showed
    // before the query) never re-writes the native control — the diverged
    // live text would survive. Sync imperatively after every update; the
    // identical-string check keeps typing caret-safe. An IME composition in
    // flight is EXCLUDED (its input events are paused, so a diverged value
    // is provisional text, not drift) — unless the commit/Escape-restore
    // paths forced the sync (#forceFieldSync): their rewrite is
    // load-bearing (the orphaned provisional text would otherwise survive).
    const node = this.#control();
    if (node) {
      if (!this.#composing || this.#forceFieldSync) {
        const fieldText = this.#query ?? this.#committedDisplay;
        if (node.value !== fieldText) node.value = fieldText;
      }
      this.#forceFieldSync = false;
    }
    const dataChanged =
      changed.has('options') || changed.has('value') || changed.has('defaultValue');
    const nameChanged = changed.has('label') || changed.has('placeholder');
    if (!dataChanged && !nameChanged) return;
    if (nameChanged) this.#panel?.setAttribute('aria-label', this.#panelName());
    if (!dataChanged) return;
    // Open-menu data changes follow the select mold: the rows re-render and
    // the active row re-clamps into the new filtered range (never a stale
    // activedescendant into a removed row).
    if (this.#menuOpen) {
      this.#activeIndex = this.#clampActiveIndex(this.#activeIndex);
      this.#renderMenu();
      this.requestUpdate(); // activedescendant + status text re-render
      this.#scrollActiveIntoView();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Quiet teardown (the select mold): release controller resources without
    // dispatching — the element is leaving the tree.
    this.#closeMenu({ returnFocus: false, quiet: true });
  }

  // --- filter + commit pipeline ---------------------------------------------------

  /** compositionstart — an IME session begins: provisional text is coming. */
  #handleCompositionStart(): void {
    this.#composing = true;
  }

  /**
   * compositionend — the session settled. The platform ALWAYS follows with a
   * trailing input event (isComposing=false), which refilters through
   * #handleInput; this handler only clears the flag (and the re-sync guard).
   */
  #handleCompositionEnd(): void {
    this.#composing = false;
  }

  /**
   * The input event — the filter engine. IME composition is a PAUSE:
   * isComposing input events are dropped until composition settles, so the
   * list never flickers mid-composition (the native contract, the tk-input
   * lesson; the 229 keyCode guard lives on keydown below). Typing OPENS the menu when closed;
   * every keystroke re-filters, re-homes the active row (the committed
   * option when it still matches, else the edge row) and updates the
   * results-count announcement.
   */
  #handleInput(event: Event): void {
    if (this.disabled) return;
    if ((event as InputEvent).isComposing) return;
    const control = event.target as HTMLInputElement;
    this.#query = control.value;
    // An ended composition leaves the field holding the composed text with a
    // stale query — the platform's trailing input event (isComposing=false)
    // arrives next and refilters, so nothing else is needed here.
    this.#composing = false;
    if (!this.#menuOpen) {
      this.#openMenu('first');
      return;
    }
    this.#activeIndex = this.#initialActiveIndex('first');
    this.requestUpdate(); // activedescendant + status text re-render
    this.#renderMenu();
    this.#scrollActiveIntoView();
  }

  /**
   * Commits `option` — the single channel every path shares (Enter on the
   * active row, pointer press on a row). The transient query clears (the
   * field re-renders to the committed label), the menu closes with focus
   * still in the field, and the value flows through `value-change` —
   * controlled mode applies nothing locally (strict).
   */
  #commitOption(option: TkComboboxSearchOption): void {
    this.#query = null;
    this.#forceFieldSync = true; // the restore must land even mid-composition
    if (option.value !== this.#effectiveValue) {
      if (!this.#isControlled) {
        this.#uncontrolledValue = option.value;
      }
      this.#emitValueChange(option.value);
    }
    this.#closeMenu({ returnFocus: true });
    this.requestUpdate(); // the field text binding re-renders to the label
  }

  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkComboboxSearchChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /** The live-region text: the count template, the no-matches message, or '' when closed. */
  #resultsStatus(count: number): string {
    if (count === 0) return this.#noResultsText();
    const custom = this.resultsMessage;
    if (custom != null && custom.length > 0) return custom.replaceAll('{n}', String(count));
    const ones = count % 10;
    const teens = count % 100;
    const singular = ones === 1 && teens !== 11;
    const few = ones >= 2 && ones <= 4 && !(teens >= 12 && teens <= 14);
    return `${singular ? 'Найден' : 'Найдено'} ${count} ${singular ? 'инструмент' : few ? 'инструмента' : 'инструментов'}`;
  }

  #noResultsText(): string {
    return this.noResultsMessage != null && this.noResultsMessage.length > 0
      ? this.noResultsMessage
      : DEFAULT_NO_RESULTS;
  }

  // --- keyboard --------------------------------------------------------------------

  /**
   * The combobox keyboard surface. OPEN: Enter commits the active row,
   * Escape closes AND restores the field to the committed label (the query
   * is transient), arrows step the active row (wrapping), Home/End jump it.
   * CLOSED: ArrowDown opens at the first row, ArrowUp at the last (the APG
   * combobox edges); Enter/Escape are inert; Home/End pass through as
   * native caret moves — a single-line input owns them. Printable keys are
   * NEVER intercepted in either state: they ride the native input event and
   * re-filter (a search field, not a typeahead jump-buffer). IME pauses:
   * isComposing/229 events drop until composition settles.
   */
  #handleKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.isComposing || event.keyCode === 229) return;
    const key = event.key;

    if (!this.#menuOpen) {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        this.#openMenu(key === 'ArrowUp' ? 'last' : 'first');
      }
      return; // everything else rides native (caret moves, input-event typing)
    }

    switch (key) {
      case 'Escape':
        event.preventDefault();
        this.#closeMenu({ returnFocus: true, restoreQuery: true });
        return;
      case 'Enter': {
        event.preventDefault();
        if (this.#activeIndex !== null) {
          const option = this.#filteredOptions[this.#activeIndex];
          if (option) this.#commitOption(option);
        }
        return;
      }
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const options = this.#filteredOptions;
        if (options.length === 0) return;
        const direction: 1 | -1 = key === 'ArrowDown' ? 1 : -1;
        const base = this.#activeIndex ?? -direction;
        this.#setActiveIndex((base + direction + options.length) % options.length);
        return;
      }
      case 'Home':
        event.preventDefault();
        if (this.#filteredOptions.length > 0) this.#setActiveIndex(0);
        return;
      case 'End':
        event.preventDefault();
        if (this.#filteredOptions.length > 0) this.#setActiveIndex(this.#filteredOptions.length - 1);
        return;
      default:
        return; // printable keys ride the native input event (re-filter)
    }
  }

  /** The landing row on open/refilter: the COMMITTED option when it survives the filter, else the edge. */
  #initialActiveIndex(edge: 'first' | 'last'): number | null {
    const options = this.#filteredOptions;
    if (options.length === 0) return null;
    const committed = this.#effectiveValue;
    if (committed !== '') {
      const at = options.findIndex((option) => option.value === committed);
      if (at >= 0) return at;
    }
    return edge === 'first' ? 0 : options.length - 1;
  }

  /** Re-clamps a stale active index into the current filtered range (data shrank under it). */
  #clampActiveIndex(index: number | null): number | null {
    const length = this.#filteredOptions.length;
    if (index == null) return null;
    if (length === 0) return null;
    return Math.min(index, length - 1);
  }

  #setActiveIndex(index: number): void {
    this.#activeIndex = index;
    this.requestUpdate(); // activedescendant re-renders
    this.#renderMenu(); // the .tk-active mark follows
    this.#scrollActiveIntoView();
  }

  // --- suggestion panel (the select overlay-consumer mold) --------------------------

  #control(): HTMLInputElement | null {
    return this.renderRoot.querySelector<HTMLInputElement>('.field__control');
  }

  #panelName(): string {
    if (this.label != null && this.label.length > 0) return this.label;
    if (this.placeholder.length > 0) return this.placeholder;
    return DEFAULT_ACCESSIBLE_NAME;
  }

  /** The generated panel: role=listbox, own shadow root (styles + slot), hidden until open. */
  #getPanel(): HTMLDivElement {
    if (this.#panel) return this.#panel;
    const panel = document.createElement('div');
    panel.setAttribute('role', 'listbox');
    panel.id = `${this.#id}-listbox`;
    panel.setAttribute('aria-label', this.#panelName());
    panel.hidden = true;
    panel.addEventListener('pointerdown', (event) => {
      // Focus must not wander for menu presses mid-click (the Safari lesson —
      // the select mold). preventDefault on pointerdown stops the focus move,
      // not the click; focus stays in the field either way (combobox model).
      event.preventDefault();
    });
    const shadow = panel.attachShadow({ mode: 'open' });
    render(html`<style>${comboboxSearchMenuStyles.cssText}</style><slot></slot>`, shadow);
    // Shadow-root child (the select mold): renders in tree order at the end
    // of the renderRoot, outside Lit's template markers.
    this.renderRoot.appendChild(panel);
    this.#panel = panel;
    return panel;
  }

  /** Renders the option rows into the panel's light children — same shadow tree as the field. */
  #renderMenu(): void {
    const panel = this.#getPanel();
    const committed = this.#effectiveValue;
    const active = this.#activeIndex;
    const options = this.#filteredOptions;
    render(
      html`${options.map((option, index) => {
        const isSelected = option.value === committed && committed !== '';
        return html`<div
          role="option"
          id="${this.#id}-option-${index}"
          class=${index === active ? 'tk-active' : nothing}
          aria-selected=${isSelected ? 'true' : 'false'}
          @click=${() => this.#commitOption(option)}
        >
          <span class="tk-combobox-search-menu__label">${String(option.label ?? '')}</span>
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
      })}
      ${options.length === 0
        ? html`<div role="option" aria-disabled="true" aria-selected="false">
            ${this.#noResultsText()}
          </div>`
        : nothing}`,
      panel,
    );
  }

  /** The active row's id for aria-activedescendant — nothing when the menu is closed/rowless. */
  get #activeDescendantId(): string | typeof nothing {
    if (!this.#menuOpen || this.#activeIndex === null) return nothing;
    if (this.#filteredOptions.length === 0) return nothing;
    return `${this.#id}-option-${this.#activeIndex}`;
  }

  /**
   * Opens the suggestion panel: rows render filtered, the panel mounts
   * through the overlay controller ('dropdown' layer) and positions against
   * the FIELD BOX (the select lesson — never the icon; matchAnchorWidth:
   * true — the panel width-matches the field), and the active row lands on
   * the committed option (when it survives the filter) or the edge row.
   */
  #openMenu(edge: 'first' | 'last'): void {
    if (this.#menuOpen || this.disabled) return;
    const panel = this.#getPanel();
    this.#menuOpen = true;
    this.#activeIndex = this.#initialActiveIndex(edge);
    this.requestUpdate(); // aria-expanded + status region re-render
    this.#renderMenu();
    panel.hidden = false;
    const anchor = this.renderRoot.querySelector('.field') as HTMLElement | null;
    if (anchor) {
      // Controller-only mechanics (AD-12): dropdown layer, bottom placement,
      // exact width match (the panel never runs narrower than the field).
      this.#overlayHandle = mountOverlay(panel, 'dropdown');
      this.#positionHandle = positionFloating(panel, {
        anchor,
        placement: 'bottom',
        offset: MENU_OFFSET_PX,
        matchAnchorWidth: true,
      });
    }
    document.addEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#scrollActiveIntoView();
  }

  /**
   * Closes the panel. `restoreQuery` (Escape) drops the transient query —
   * the field re-renders to the committed label; `returnFocus` re-lands
   * focus on the field (outside-press/commit/Escape); `quiet` tears down
   * without a re-render (detach). The status region clears with the same
   * update (empty text mutates silently — nothing announced).
   */
  #closeMenu(options: { returnFocus?: boolean; quiet?: boolean; restoreQuery?: boolean }): void {
    if (!this.#menuOpen) return;
    this.#menuOpen = false;
    this.#activeIndex = null;
    if (options.restoreQuery) {
      this.#query = null;
      this.#forceFieldSync = true; // the restore must land even mid-composition
    }
    document.removeEventListener('pointerdown', this.#onDocumentPointerDown);
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const panel = this.#panel;
    if (panel) {
      // Re-home into the SHADOW root on the controller's fallback path (the
      // select mold): the next open stays valid; popover-path releases leave
      // it in place.
      if (!panel.isConnected) this.renderRoot.appendChild(panel);
      panel.hidden = true;
    }
    if (!options.quiet) this.requestUpdate(); // aria-expanded + status + field text re-render
    if (options.returnFocus) {
      void this.updateComplete.then(() => this.#control()?.focus());
    }
  }

  /** Minimal scroll reveal of the active row (the select literal; guarded for non-visual hosts). */
  #scrollActiveIntoView(): void {
    if (this.#activeIndex === null || !this.#panel) return;
    const row = this.#panel.children[this.#activeIndex];
    if (row && typeof row.scrollIntoView === 'function') {
      row.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Focus leaving the FIELD closes the menu along the natural tab order —
   * no forced focus return (the select mold's focus-loss row). Focus never
   * enters the panel (rows are divs; the combobox model keeps focus in the
   * field), so this field-scope binding hears every real exit — the
   * trigger-scope pattern the 6.2 lessons sanctioned for comboboxes.
   */
  #handleFocusout(event: FocusEvent): void {
    if (!this.#menuOpen) return;
    const next = event.relatedTarget as Node | null;
    if (next && (this.contains(next) || this.#panel?.contains(next))) return;
    this.#closeMenu({ returnFocus: false });
  }

  // --- render ----------------------------------------------------------------------

  override render() {
    const statusText = this.#menuOpen ? this.#resultsStatus(this.#filteredOptions.length) : '';
    return html`
      <div class="field" @focusout=${this.#handleFocusout}>
        <span class="field__icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="9" r="6"></circle>
            <path d="M13.5 13.5L18 18"></path>
          </svg>
        </span>
        <input
          id="${this.#id}"
          class="field__control"
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.#menuOpen ? 'true' : 'false'}
          aria-controls="${this.#id}-listbox"
          aria-activedescendant=${this.#activeDescendantId}
          aria-autocomplete="list"
          autocomplete="off"
          aria-label=${this.label != null && this.label.length > 0 ? this.label : DEFAULT_ACCESSIBLE_NAME}
          aria-disabled=${this.disabled ? 'true' : nothing}
          placeholder=${this.placeholder || nothing}
          .value=${this.#query ?? this.#committedDisplay}
          ?readonly=${this.disabled}
          @compositionstart=${this.#handleCompositionStart}
          @compositionend=${this.#handleCompositionEnd}
          @input=${this.#handleInput}
          @keydown=${this.#handleKeydown}
        />
      </div>
      <span class="status" aria-live="polite">${statusText}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-combobox-search': TkComboboxSearch;
  }
}

if (!customElements.get('tk-combobox-search')) {
  customElements.define('tk-combobox-search', TkComboboxSearch);
}
