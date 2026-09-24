import { css } from 'lit';

/**
 * tk-filter-chips styles — TWO sheets, the select 2.3 mold: the menu panel
 * carries its OWN shadow root while living as a generated child of the
 * element's shadow tree (single-tree aria id refs; the controller's popover
 * path promotes the panel in place, the fallback path reparents it across
 * the tree boundary and back — the panel sheet travels with it).
 *
 * Visual spec: DESIGN.md `components.filterChips` (radius full, body-m,
 * single-select) + the vision extraction of pattern-catalog-filters.png
 * (2026-09-24, pixel-probed in .playwright-cli/verify/filter-chips/NOTES.md):
 * pills 44px tall, white fill, ~4–6px gaps (the kit pins the 8px token step
 * — NOTES deviations), UNSELECTED 1px light hairline +
 * dark text; SELECTED 2px yellow border with fill and text UNCHANGED — the
 * frozen spec pins the SELECTED text to text-primary (the capture's yellow
 * chip text is 1.16:1 on white — the vision pass's own contrast note; the
 * border alone carries selection). The «Ещё» chip is pill-identical with a
 * small chevron-down to the right of its label.
 *
 * Tokens only (FR-1), zero theme branches (AD-3).
 *
 * Per-component custom properties (`--tk-filter-chips-*`, CONVENTIONS §6 —
 * the same-slot-same-role rule vs `--tk-select-*`), each consumed WITH its
 * token default:
 * - `--tk-filter-chips-fill`            chip fill          (default surface-base)
 * - `--tk-filter-chips-radius`          chip radius        (default radius-full)
 * - `--tk-filter-chips-text`            chip text          (default text-primary)
 * - `--tk-filter-chips-selected-border` selected border    (default yellow-100)
 * - `--tk-filter-chips-menu-radius`     menu panel radius  (default radius-md — the menu sheet)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule:
 * - the 44px chip min box (capture-measured height 44–46; §8 target floor —
 *   short labels pad to the 44×44 box, long ones grow past it);
 * - the selected border's 2px vs the idle 1px (capture-measured;
 *   border-box sizing absorbs the difference so selection never shifts
 *   layout);
 * - the chevron's 20px box / 1.5px stroke (icon metrics, no token);
 * - option-row min-height 48px and the menu 4px inner inset (the select
 *   menu literals);
 * - the 4px chip→menu gap (MENU_OFFSET_PX in filter-chips.ts);
 * - the menu max-height `calc(var(--tk-space-48) * 7 + var(--tk-space-12))`
 *   — spacing-derived, the select long-list row (7 × 48px rows + padding).
 */

export const filterChipsStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* One NON-wrapping row: the overflow scrolls horizontally (the spec's
     anatomy — the reference row never wraps). */
  .row {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    max-width: 100%;
    overflow-x: auto;
  }

  /* The tablist strip: chips only — the «Ещё» button is its SIBLING, never
     a tablist child (AXM: tablist children are tabs; «Ещё» is a menu
     button). Same gap so the row reads as one strip. */
  .tabs {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--tk-space-8);
  }

  .chip {
    /* The full chip box is the interactive target (≥44×44 floor, §8 boxed
       register — the capture's own 44–46px pills; min-width pads the box out
       for 1–2-char labels whose text runs narrower). */
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    min-width: 44px;
    margin: 0;
    padding: 0 var(--tk-space-16);
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-filter-chips-radius, var(--tk-radius-full));
    background: var(--tk-filter-chips-fill, var(--tk-color-surface-base));
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-filter-chips-text, var(--tk-color-text-primary));
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    transition: border-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* SELECTED: 2px yellow border, fill and text UNCHANGED — selection is the
     border alone (the frozen ruling). Border-box sizing keeps the outer box
     fixed, so the 1px→2px step never shifts the row. */
  .chip--selected {
    border: 2px solid var(--tk-filter-chips-selected-border, var(--tk-color-yellow-100));
  }

  /* Unified focus ring (§8): 2px token ring, offset 2px, never removed. */
  .chip:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* --- The «Ещё» chip: pill-identical with a chevron to the right. --- */
  .chip--more {
    flex: 0 0 auto;
    gap: var(--tk-space-4);
  }

  .chip__more-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Decorative chevron (aria-hidden in the template), rotating 180° on open
     on the motion tokens; the token layer collapses durations to 0ms under
     prefers-reduced-motion, so no separate media query is needed. */
  .chip__chevron {
    flex: none;
    display: inline-flex;
    color: var(--tk-color-text-secondary);
    transition: transform var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .chip--more[aria-expanded='true'] .chip__chevron {
    transform: rotate(180deg);
  }
`;

/**
 * The PANEL sheet — adopted into the «Ещё» menu's own shadow root (the
 * select menu mold). `:host` resets the popover UA sheet on the popover
 * mounting path: UA `[popover]` sets border/padding/background/margin/inset
 * — author-origin rules win over UA regardless of specificity, and the
 * controller's inline top/left/position always win over both.
 *
 * The panel is hidden when closed via the `hidden` attribute (set by
 * filter-chips.ts) — never via shadow styles, so the attribute survives the
 * controller's reparenting.
 */
export const filterChipsMenuStyles = css`
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
    border-radius: var(--tk-filter-chips-menu-radius, var(--tk-radius-md));
    box-shadow: var(--tk-shadow-dropdown);
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Spacing-derived long-list max — the select literal: 7 × 48px rows +
       the panel's own 2 × 4px vertical padding + a 4px headroom step. */
    max-height: calc(var(--tk-space-48) * 7 + var(--tk-space-12));
  }

  /* 'hidden' must actually hide: the 'display: block' above is author-origin
     and BEATS the UA '[hidden] { display: none }' rule — without this
     override a closed panel renders as a visible block after the chip row
     (the 6.2 visual-gate finding; the tooltip/modal ':host([hidden])' mold). */
  :host([hidden]) {
    display: none;
  }

  /* Menu rows are the panel's LIGHT children (generated by filter-chips.ts
     into the panel element itself); one slot projects them. The select menu
     row language verbatim: 48px rows, radius-sm, 12px inline padding. Real
     buttons — focus moves physically among them while the menu is open. */
  ::slotted([role='menuitemradio']) {
    display: flex;
    align-items: center;
    gap: var(--tk-space-8);
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    padding: var(--tk-space-4) var(--tk-space-12);
    border: none;
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    text-align: start;
    border-radius: var(--tk-radius-sm);
    cursor: pointer;
    user-select: none;
    -webkit-appearance: none;
    appearance: none;
  }

  /* Hover: the reference's flat-fill language — surface-muted (the select
     menu's hover step, semantics not scale — 5.4). */
  ::slotted([role='menuitemradio']:hover) {
    background: var(--tk-color-surface-muted);
  }

  /* Real focus lives on the rows while the menu is open — the unified ring
     paints on the row itself. NOTE: the pseudo sits INSIDE the parens
     (::slotted(x:focus-visible)) — the 5.1 lesson: outside them the parser
     silently drops the whole rule. */
  ::slotted([role='menuitemradio']:focus-visible) {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Checked row: medium weight + the ink check glyph (built by
     filter-chips.ts with size attributes and an inline margin-inline-start,
     the generated-element class; its color is currentColor inherited). The
     select menu's selected-row marking, kept kit-coherent. */
  ::slotted([role='menuitemradio'][aria-checked='true']) {
    font-weight: var(--tk-text-body-m-bold-weight);
  }

  /* NOTE: the check glyph is NOT styled here — ::slotted reaches only the
     slotted element itself; see the comment above. */
`;
