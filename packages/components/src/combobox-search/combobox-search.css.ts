import { css } from 'lit';

/**
 * tk-combobox-search styles — TWO sheets, the select 2.3 / filter-chips 6.2
 * mold: the suggestion panel carries its OWN shadow root while living as a
 * generated child of the element's shadow tree (single-tree aria id refs;
 * the controller's popover path promotes the panel in place, the fallback
 * path reparents it across the tree boundary and back — the panel sheet
 * travels with it).
 *
 * Visual spec (spec 6.3): the invest/stocks catalog search field — the
 * TOP REGION of pattern-catalog-filters.png (provenance: the spec 6.3
 * frontmatter +
 * .playwright-cli/verify/combobox-search/reference-measurements.md). A
 * BORDERLESS 52px pill-register field
 * (surface fill, radius-md, no hairline — the search register, distinct
 * from tk-input's boxed register), a 20px leading magnifier glyph in
 * text-muted, body-l control text, the reference placeholder «Название или
 * тикер». The menu is the select menu language verbatim: surface-base,
 * radius-md, dropdown shadow, 48px rows.
 *
 * Tokens only (FR-1), zero theme branches (AD-3).
 *
 * Per-component custom properties (`--tk-combobox-search-*`, CONVENTIONS §6
 * — the same-slot-same-role rule), each consumed WITH its token default:
 * - `--tk-combobox-search-fill`            field fill         (default surface-base)
 * - `--tk-combobox-search-radius`          field radius       (default radius-md)
 * - `--tk-combobox-search-text`            control text       (default text-primary)
 * - `--tk-combobox-search-placeholder`     placeholder text   (default text-muted)
 * - `--tk-combobox-search-icon`            magnifier glyph    (default text-muted)
 * - `--tk-combobox-search-menu-radius`     menu panel radius  (default radius-md — the menu sheet)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule:
 * - the 52px field height (capture-measured; the ≥44px floor of §8 with the
 *   reference's own comfortable box);
 * - the icon's 20px box / 1.5px stroke (icon metrics, no token — the
 *   filter-chips chevron literal);
 * - the field's 16px inline paddings (icon gutter + control tail — the
 *   boxed-register padding step, spacing-scaled);
 * - option-row min-height 48px and the menu 4px inner inset (the select
 *   menu literals);
 * - the 4px field→menu gap (MENU_OFFSET_PX in combobox-search.ts);
 * - the menu max-height `calc(var(--tk-space-48) * 7 + var(--tk-space-12))`
 *   — spacing-derived, the select long-list row (7 × 48px rows + padding);
 * - the sr-only announcement metrics (1px clip box — the standard
 *   visually-hidden utility shape).
 */

export const comboboxSearchStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* The borderless search register: surface fill, no hairline (the capture
     — distinct from tk-input's boxed register). The ring paints on the
     WHOLE field box via :focus-within — the input itself carries no ring. */
  .field {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 52px;
    border: none;
    border-radius: var(--tk-combobox-search-radius, var(--tk-radius-md));
    background: var(--tk-combobox-search-fill, var(--tk-color-surface-base));
  }

  .field:focus-within {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Decorative magnifier (aria-hidden in the template) — the leading glyph
     of the capture, 20px box in the muted role. The trailing gap trues the
     reference arithmetic (reference-measurements.md: placeholder x52 =
     16 padding + 20 icon box + 16 gap). */
  .field__icon {
    flex: none;
    display: inline-flex;
    margin-inline-start: var(--tk-space-16);
    margin-inline-end: var(--tk-space-16);
    color: var(--tk-combobox-search-icon, var(--tk-color-text-muted));
  }

  .field__control {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    height: 100%;
    margin: 0;
    border: none;
    padding: 0;
    padding-inline-end: var(--tk-space-16);
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-combobox-search-text, var(--tk-color-text-primary));
    -webkit-appearance: none;
    appearance: none;
  }

  /* The input never paints its own ring — the field box carries it
     (:focus-within above); dedup only. */
  .field__control:focus-visible {
    outline: none;
  }

  .field__control::placeholder {
    color: var(--tk-combobox-search-placeholder, var(--tk-color-text-muted));
    opacity: 1;
  }

  /* --- Results-count announcement region: visually hidden, never
     display:none — aria-live content must stay in the accessibility tree.
     The 1px clip box is the standard sr-only utility shape (structural,
     flagged in the header). --- */
  .status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

/**
 * The PANEL sheet — adopted into the suggestion listbox's own shadow root
 * (the select menu mold). `:host` resets the popover UA sheet on the popover
 * mounting path: UA `[popover]` sets border/padding/background/margin/inset
 * — author-origin rules win over UA regardless of specificity, and the
 * controller's inline top/left/position always win over both.
 *
 * The panel is hidden when closed via the `hidden` attribute (set by
 * combobox-search.ts) — never via shadow styles, so the attribute survives
 * the controller's reparenting.
 */
export const comboboxSearchMenuStyles = css`
  :host {
    box-sizing: border-box;
    display: block;
    margin: 0;
    inset: auto;
    border: none;
    padding: var(--tk-space-4);
    background: var(--tk-color-surface-base);
    color: var(--tk-color-text-primary);
    font-family: var(--tk-font-body);
    border-radius: var(--tk-combobox-search-menu-radius, var(--tk-radius-md));
    box-shadow: var(--tk-shadow-dropdown);
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Spacing-derived long-list max — the select literal: 7 × 48px rows +
       the panel's own 2 × 4px vertical padding + a 4px headroom step. */
    max-height: calc(var(--tk-space-48) * 7 + var(--tk-space-12));
  }

  /* 'hidden' must actually hide: the 'display: block' above is author-origin
     and BEATS the UA '[hidden] { display: none }' rule — without this
     override a closed panel renders as a visible block under the field
     (the 6.2 visual-gate finding; the filter-chips ':host([hidden])' mold). */
  :host([hidden]) {
    display: none;
  }

  /* Menu rows are the panel's LIGHT children (generated by
     combobox-search.ts into the panel element itself); one slot projects
     them. The select menu row language: 48px rows, radius-sm, 12px inline
     padding. NOT real buttons — focus never leaves the field; the rows are
     pointer targets with aria-selected marking (combobox semantics). */
  ::slotted([role='option']) {
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    padding: var(--tk-space-4) var(--tk-space-12);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    text-align: start;
    border-radius: var(--tk-radius-sm);
    cursor: pointer;
    user-select: none;
  }

  /* Hover: the reference's flat-fill language — surface-muted (the select
     menu's hover step, semantics not scale). */
  ::slotted([role='option']:hover) {
    background: var(--tk-color-surface-muted);
  }

  /* The ACTIVE row (aria-activedescendant's target — keyboard navigation
     marks it with .tk-active): the same surface-field step the select menu
     gives its active row. */
  ::slotted([role='option'].tk-active) {
    background: var(--tk-color-surface-field);
  }

  /* Committed row: medium weight + the ink check glyph (built by
     combobox-search.ts with size attributes and an inline
     margin-inline-start, the generated-element class; its color is
     currentColor inherited) — the select/filter-chips selected-row marking,
     kept kit-coherent. */
  ::slotted([role='option'][aria-selected='true']) {
    font-weight: var(--tk-text-body-m-bold-weight);
  }

  /* The zero-matches row (aria-disabled): muted text, no pointer language. */
  ::slotted([role='option'][aria-disabled='true']) {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  ::slotted([role='option'][aria-disabled='true']:hover) {
    background: transparent;
  }
`;
