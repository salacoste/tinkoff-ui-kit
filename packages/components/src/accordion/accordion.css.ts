import { css } from 'lit';

/**
 * tk-accordion + tk-accordion-item styles — tokens only (FR-1), zero theme
 * branches (AD-3).
 *
 * Visual spec: spec 21.1 against the captures-v4 invest pack (the 4-report
 * consensus — bonds/etfs catalog rows, the SBER «Частые вопросы» block, the
 * account/IIS and IPO FAQ pages). Capture → token table:
 *
 * | capture (captures-v4/invest) | measurement | kit decision |
 * |---|---|---|
 * | bonds FAQ rows | 1px hairline BETWEEN rows, none around | container paints `::slotted(tk-accordion-item:not(:last-child))` border-bottom, 1px structural hairline (token sheet has no hairline step; the data-table precedent) |
 * | SBER FAQ block | white bordered CARD around the whole list | NOT an atom mode — the card is the consumer's pattern wrapper (the 19.1 «no modes without a second grounding in one pattern» lesson); the demo story draws it with tokens. No `--tk-accordion-radius` hook is minted for it (an unused hook is dead code); recorded as the AC3 deviation note |
 * | FAQ header rows | bold question left, thin gray chevron right, ≈56–64px tall | body-m bold; chevron = the select chevron icon recolored via the hook; padding-block 16px + the 24px body-m line box ≈56px — ABOVE the a11y floor, which is pinned as the min-height |
 * | FAQ answers | regular text under the row | body-m regular, text-primary, bottom rhythm 16px |
 *
 * `--tk-accordion-*` HOOKS (CONVENTIONS §6): `--tk-accordion-divider-color`
 * (container), `--tk-accordion-chevron-color` / `--tk-accordion-row-hover`
 * (item) — each with the neutral default inline. No yellow anywhere: the
 * surface is deliberately neutral (spec AC3).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 1px hairline dividers (hairline borders are structural across the
 *   kit: data-table, menu-popover group rules);
 * - the 44px header min-height — the WCAG 2.5.5 floor, not a visual spec
 *   value (the live rows run ≈56–64px and the sheet reaches them via
 *   padding + line box, so the floor only ever guards degenerate content);
 * - the 2px/2px focus ring geometry (the button.css.ts unified ring).
 */

export const accordionStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .accordion {
    /* Vertical rhythm comes from the rows themselves (padding + line box);
       the container only owns the BETWEEN-rows hairlines. */
    display: block;
  }

  /* Divider «between, not around» (bonds frames): every slotted item but
     the last carries a hairline bottom border. 1px is structural (header
     notes); the color rides the hook with the border-default neutral. */
  .accordion ::slotted(tk-accordion-item:not(:last-child)) {
    border-bottom: 1px solid var(--tk-accordion-divider-color, var(--tk-color-border-default));
  }
`;

export const accordionItemStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .item__header {
    /* Full-bleed row button: the width and the horizontal inset belong to
       the consumer's surface (page gutter or card padding), not the atom. */
    box-sizing: border-box;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--tk-space-16);
    min-height: 44px; /* WCAG 2.5.5 floor — see the header notes */
    padding: var(--tk-space-16) 0;
    border: 0;
    background: none;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
    text-align: left;
    cursor: pointer;
  }

  /* The unified focus ring — 2px token ring, offset 2px, never removed
     (button.css.ts). The offset ring on a full-width row is the kit's
     focus affordance; hover never replaces it. */
  .item__header:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Quiet row hover (the live catalogs' faint row highlight): the semantic
     row-hover surface, hook-overridable. */
  .item__header:hover {
    background: var(--tk-accordion-row-hover, var(--tk-color-surface-row-hover));
  }

  .item__summary {
    min-width: 0;
  }

  /* Thin gray chevron (SBER frames) — the select field chevron icon,
     recolored through the hook. Rotation on :host([open]) mirrors the
     select's open-state flip; FLAT ruling: no transition (spec 21.1 out
     of scope — animation joins only with a live-measured round). */
  .item__chevron {
    flex: none;
    display: inline-flex;
    color: var(--tk-accordion-chevron-color, var(--tk-color-gray-400));
  }

  :host([open]) .item__chevron {
    transform: rotate(180deg);
  }

  .item__panel {
    padding-bottom: var(--tk-space-16);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
  }

  /* display:block on the panel outranks the UA's [hidden] — restate it.
     The panel node STAYS in the DOM (hidden, never absent) so the default
     slot keeps receiving slotchange in every state (the progress-bar
     header lesson). */
  .item__panel[hidden] {
    display: none;
  }
`;
