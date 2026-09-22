import { css } from 'lit';

/**
 * tk-select styles — TWO sheets, because the menu panel carries its OWN
 * shadow root while living as a generated child of tk-select's shadow tree
 * (spec 2.3 Design Notes, amended — see select.ts's class doc: single-tree
 * aria id refs; the controller's popover path promotes in place, the
 * fallback path moves the panel across the tree boundary and back):
 *
 * - `selectStyles` — adopted into the tk-select host's shadow root: the field
 *   (label, trigger box, chevron, error) in Input's exact visual language.
 * - `selectMenuStyles` — adopted into the PANEL's own shadow root, so its
 *   styles never leak document-level (CONVENTIONS §6) AND travel with the
 *   panel when the controller's fallback path reparents it. `:host` rules
 *   are author-origin and therefore also reset the popover API's UA sheet
 *   (`[popover]` sets border/padding/background/margin/inset) on the popover
 *   mounting path; option rows are the panel's light children, styled via
 *   ::slotted.
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Visual spec: DESIGN.md
 * components.select + the 2.0 capture notes § Select (trigger = field
 * language 52px radius ~12 flat fill; menu #FFFFFF radius ~12 soft dropdown
 * shadow; rows ~48px, 16px inner padding, ~15px #333 text).
 *
 * Per-component custom properties (`--tk-select-*`, CONVENTIONS §6 — the
 * same-slot-same-role rule vs `--tk-input-*`), each consumed WITH its token
 * default:
 * - `--tk-select-fill`        trigger fill      (default surface-field)
 * - `--tk-select-radius`      trigger radius    (default radius-md)
 * - `--tk-select-text`        value text color  (default text-primary)
 * - `--tk-select-placeholder` placeholder color (default text-secondary — the AA override, see the rule below)
 * - `--tk-select-menu-radius` menu panel radius (default radius-md — the menu sheet below)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - field height 52px and the 1px hairline (the Input literals);
 * - the chevron's 24px box / 1.5px stroke (icon metrics, no token);
 * - option min-height 48px and the menu 4px inner inset (capture-measured);
 * - the 4px field→menu gap (MENU_OFFSET_PX in select.ts — the open capture's
 *   flush-to-4px placement, unreadable exactly at DPR 1);
 * - the menu max-height `calc(var(--tk-space-48) * 7 + var(--tk-space-12))`
 *   — spacing-DERIVED per the spec's long-list row (7 × 48px rows + the
 *   panel's own vertical padding + one headroom step, overflow-y auto).
 */

export const selectStyles = css`
  :host {
    display: block;
  }

  /* Disabled (EXPERIENCE State Patterns): 40% opacity, no pointer events at
     the host boundary; the trigger keeps aria-disabled (focusable pattern). */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  .label {
    display: block;
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    cursor: pointer;
  }

  .label__star {
    margin-inline-start: var(--tk-space-4);
  }

  /* --- Trigger box: Input's field language verbatim (fill/radius/hairline
     on the wrapper so the unified ring wraps the whole field). --- */
  .field {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    width: 100%;
    height: 52px;
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-select-radius, var(--tk-radius-md));
    background: var(--tk-select-fill, var(--tk-color-surface-field));
  }

  .field:focus-within {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  .field__trigger {
    /* The full 52px box is the interactive target (≥44px floor) — a real
       button so keyboard/touch get native semantics under the combobox role. */
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    height: 100%;
    display: inline-flex;
    align-items: center;
    margin: 0;
    border: none;
    padding: 0;
    padding-inline-start: var(--tk-space-16);
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-select-text, var(--tk-color-text-primary));
    text-align: start;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  /* Dedup only — the :focus-within ring above is showing at this exact
     moment (state changes are instant; the ring is never removed). */
  .field__trigger:focus-visible {
    outline: none;
  }

  /* Placeholder: the DESIGN token is gray-500, but on the surface-field
     fill it measures 3.46:1 (#79818C on #ECF1F7) — under AA for 17px text.
     tk-input escapes measurement only because a native input's placeholder
     paints through the ::placeholder pseudo (axe never sees it); this
     component's placeholder is a real span, so the kit's AA-override axis
     applies (the link-on-tint precedent): one step darker, text-secondary
     (4.95:1 on the light fill; the dark layer's #FFFFFFB3 passes on the
     translucent dark field). Deviation documented in verify/select/NOTES.md. */
  .field__value--placeholder {
    color: var(--tk-select-placeholder, var(--tk-color-text-secondary));
  }

  /* Long selected labels truncate visually (ellipsis) — the accessible name
     keeps the full string. */
  .field__value {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* --- Chevron: decorative inline SVG (aria-hidden in the template), color
     via the text-secondary token (reference reads ~#4A4A52 — nearest token
     step, flagged in the module header). Rotates 180° on open on the motion
     tokens; the token layer collapses durations to 0ms under
     prefers-reduced-motion, so no separate media query is needed. --- */
  .field__chevron {
    flex: none;
    display: inline-flex;
    margin-inline-end: var(--tk-space-16);
    color: var(--tk-color-text-secondary);
    transition: transform var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  :host([open]) .field__chevron {
    transform: rotate(180deg);
  }

  .error {
    display: flex;
    align-items: flex-start;
    gap: var(--tk-space-4);
    margin: var(--tk-space-8) 0 0;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-error-on-field);
  }

  .error__icon {
    flex: none;
    width: 16px;
    height: 16px;
    margin-block-start: 0.5px;
  }
`;

/**
 * The PANEL sheet — adopted into the menu panel's own shadow root (see the
 * file header for why the panel is not a shadow child of tk-select). `:host`
 * resets the popover UA sheet on the popover mounting path: UA `[popover]`
 * sets `border: solid; padding: 0.25em; background-color: Canvas;
 * color: CanvasText; inset: 0; margin: auto; overflow: auto` — author-origin
 * rules win over UA regardless of specificity, and the controller's inline
 * top/left/position always win over both.
 *
 * The panel is hidden when closed via the `hidden` attribute (set by
 * select.ts) — never via shadow styles, so the attribute survives the
 * controller's reparenting.
 */
export const selectMenuStyles = css`
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
    border-radius: var(--tk-select-menu-radius, var(--tk-radius-md));
    box-shadow: var(--tk-shadow-dropdown);
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Long-list row: spacing-derived max (token-less by the spec's own
       instruction) — 7 × 48px rows + the panel's own 2 × 4px vertical
       padding + a 4px headroom step: at exactly content height an
       overflowing-by-a-fraction list sprouts a one-notch scrollbar gutter
       (a light strip in the dark theme — caught in the 2.3 vision pass). */
    max-height: calc(var(--tk-space-48) * 7 + var(--tk-space-12));
  }

  /* Option rows are the panel's LIGHT children (generated by select.ts into
     the panel element itself); one slot projects them. radius-sm per the
     capture notes; the 48px row + 12px inline padding give the ~16px text
     inset measured on the reference (4px panel inset + 12px). */
  ::slotted([role='option']) {
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    box-sizing: border-box;
    min-height: 48px;
    padding: var(--tk-space-4) var(--tk-space-12);
    border-radius: var(--tk-radius-sm);
    font-size: var(--tk-text-body-m-size);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    cursor: pointer;
    user-select: none;
  }

  /* Visual focus (the active option) and hover: the reference's flat-fill
     language — no borders, no yellow (the capture shows none). The ACTIVE
     step is surface-field (the field fill family — more perceptible than
     gray-100, which measured invisible against surface-base in the 2.3
     vision pass); hover stays a whisper lighter. Real focus (the ring)
     stays on the trigger the whole time the menu is open. */
  ::slotted([role='option']:hover) {
    background: var(--tk-color-gray-100);
  }

  ::slotted([role='option'].tk-active) {
    background: var(--tk-color-surface-field);
  }

  /* Selected: ink check glyph (right-aligned) — the capture's own marking is
     a checkbox affordance on a multiselect; this kit's single-select marks
     with ink, never yellow (noted per the spec's "follow the capture" rule). */
  ::slotted([role='option'][aria-selected='true']) {
    font-weight: var(--tk-text-body-m-bold-weight);
  }

  ::slotted([role='option'][aria-disabled='true']) {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  ::slotted([role='option'][aria-disabled='true']:hover) {
    background: transparent;
  }

  /* NOTE: the selected-option check glyph is NOT styled here — it is a
     descendant of the slotted option, and ::slotted reaches only the slotted
     element itself. select.ts builds it with size attributes and an inline
     margin-inline-start:auto (generated-element inline styles, the same
     class the overlay controller applies); its color is currentColor
     inherited from the row. */
`;
