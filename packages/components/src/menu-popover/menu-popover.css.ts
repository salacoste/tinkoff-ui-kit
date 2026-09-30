import { css } from 'lit';

/**
 * tk-menu-popover styles — FOUR sheets, one per shadow root in the family
 * (spec 19.1; the select.css.ts two-sheet mold, extended by the family's
 * auxiliary elements):
 *
 * - `menuPopoverStyles` — the tk-menu-popover HOST: anchor-slot sizing only
 *   (the host renders nothing else; the panel is a generated shadow child).
 * - `menuPanelStyles` — the PANEL's own shadow root (the select menu mold:
 *   the panel is a generated child of the host's shadow tree carrying its
 *   own root, so its styles never leak document-level (§6) and travel with
 *   the panel when the controller's fallback path reparents it; `:host`
 *   rules are author-origin and reset the popover UA sheet).
 * - `menuItemStyles` — tk-menu-item's own root (each row owns its box:
 *   roving focus, hover, destructive and disabled states live with the
 *   element that carries them).
 * - `menuDividerStyles` — tk-menu-divider's own root (a 1px rule).
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Visual spec: the
 * captures-v3/admin follow-up pack (f) 2026-09-30 — white panel, hairline
 * border, radius ≈12, soft dropdown shadow, rows ≈40 (see the 44px ruling
 * below), 1px full-width group dividers, destructive rows as RED TEXT with
 * no fill, «Выйти» as a plain neutral row, panel widths 240–300, anchored
 * right-edge to the trigger with a ≈4–6px gap; yellow appears nowhere in
 * any open state (the console's mono discipline, probe-notes 13.1).
 *
 * Per-component custom properties (`--tk-menu-popover-*`, CONVENTIONS §6 —
 * the grammar derives the prefix from the component directory, the
 * `--tk-data-table-*` precedent), each consumed WITH its token default:
 * - `--tk-menu-popover-fill`    panel background (default surface-base)
 * - `--tk-menu-popover-border`  panel hairline   (default border-default)
 * - `--tk-menu-popover-radius`  panel radius     (default radius-md = 12)
 * - `--tk-menu-popover-width`   panel width      (default 280px — the
 *   capture-measured 240–300 band's midpoint, a flagged structural literal)
 * - `--tk-menu-popover-divider` divider rule     (default border-default)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the panel's 280px default width (capture-measured band 240–300; the
 *   kebab/overflow patterns narrow it per story via the hook);
 * - the row min-height 44px — the captures measure ≈40±2, but the kit's
 *   ≥44×44 interactive-target floor (EXPERIENCE A11y Floor, mechanized by
 *   the a11y sweep) outranks a ±2px probe reading: 44 taken deliberately,
 *   no exception-log entry needed (the floor is law, not a deviation);
 * - the row's 12px inline padding (capture ≈12–16; the select row literal);
 * - the panel's 4px inner inset (the select menu literal);
 * - the panel's spacing-derived max-height (the select long-list row:
 *   7 × 48px-equivalent steps + panel padding + one headroom step).
 */

export const menuPopoverStyles = css`
  /* The host sizes to its anchor projection — the panel is NOT inside this
     root's layout flow (controller-mounted, position: fixed). */
  :host {
    display: inline-block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }
`;

/**
 * The PANEL sheet — adopted into the generated panel's own shadow root
 * (see the file header). `:host` resets the popover UA sheet on the popover
 * mounting path exactly as select's menu does. The panel is hidden when
 * closed via the `hidden` attribute (set by menu-popover.ts) — never via
 * shadow styles, so the attribute survives the controller's reparenting.
 */
export const menuPanelStyles = css`
  :host {
    box-sizing: border-box;
    display: block;
    margin: 0;
    inset: auto;
    border: 1px solid var(--tk-menu-popover-border, var(--tk-color-border-default));
    padding: var(--tk-space-4);
    background: var(--tk-menu-popover-fill, var(--tk-color-surface-base));
    color: var(--tk-color-text-primary);
    font-family: var(--tk-font-body);
    border-radius: var(--tk-menu-popover-radius, var(--tk-radius-md));
    box-shadow: var(--tk-shadow-dropdown);
    width: var(--tk-menu-popover-width, 280px);
    max-width: calc(100vw - var(--tk-space-16));
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Long-list row, spacing-derived (the select menu literal's shape):
       ~7 visible rows + the panel's own 2 × 4px vertical padding + one
       headroom step, so a fractional overflow never sprouts a scrollbar
       gutter (the 2.3 vision-pass lesson). */
    max-height: calc(var(--tk-space-48) * 7 + var(--tk-space-12));
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* The optional static header block (avatar-menu's user block): projected
     light content via the named slot, inset to the row text grid. */
  .panel__header {
    padding: var(--tk-space-8) var(--tk-space-12);
  }

  /* Rows and dividers are the panel's LIGHT children (routed there from the
     host by menu-popover.ts — same shadow tree as the panel's id refs); one
     default slot projects them in authored order. */
`;

/**
 * tk-menu-item — the row's own sheet (the element owns its box: roving
 * focus, hover, destructive and disabled states live where they are
 * carried). Hover = the flat surface-muted fill (the select row language —
 * the mono console step; captures cannot show hover, the console family's
 * own language decides); real keyboard focus = the unified ring, INSET so
 * it wraps the row inside the panel's radius rather than the panel's padding.
 */
export const menuItemStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    min-height: 44px;
    padding: var(--tk-space-4) var(--tk-space-12);
    border-radius: var(--tk-radius-sm);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    cursor: pointer;
    user-select: none;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  :host(:hover) {
    background: var(--tk-color-surface-muted);
  }

  /* Keyboard focus (roving arrows): the unified ring, inset into the row. */
  :host(:focus-visible) {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: -2px;
  }

  /* Destructive (the kebab captures): RED TEXT, never a fill — the
     error-on-field step stays AA on every surface the row can paint
     (base, muted hover, field — the TOKENS.md verified trio). */
  :host([variant='destructive']) {
    color: var(--tk-color-error-on-field);
  }

  :host([aria-disabled='true']) {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  :host([aria-disabled='true']:hover) {
    background: transparent;
  }

  ::slotted([slot='icon']) {
    flex: none;
    display: inline-flex;
    color: var(--tk-color-text-secondary);
  }

  /* Long labels truncate visually (the kebab capture's non-wrapping long
     command); the accessible name keeps the full string. */
  .item__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/** tk-menu-divider — the 1px full-width group rule (capture-measured). */
export const menuDividerStyles = css`
  :host {
    display: block;
    height: 1px;
    margin: var(--tk-space-4) 0;
    background: var(--tk-menu-popover-divider, var(--tk-color-border-default));
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }
`;
