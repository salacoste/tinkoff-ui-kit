import { css } from 'lit';

/**
 * tk-data-table styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: the invest/stocks catalog table as MEASURED in captures-v2
 * NOTES §C/§E (the project's ground truth — every load-bearing value below
 * cites it) + DESIGN.md Colors (Table delta semantics):
 *
 * - ROW: 81px (NOTES §E «row height 81px (two-line cells)» — capture
 *   literal, FLAGGED, no token: `min-height` not `height` so a 3-line cell
 *   GROWS instead of clipping consumer content — §2 degrade, visually
 *   identical for one/two-line cells).
 * - DIVIDER: 1px `--tk-color-border-table` on the row's border-bottom
 *   (§C «1px solid rgba(0,16,36,0.12) painted on TD border-bottom» — the
 *   kit paints it on the ROW, same visual); no zebra.
 * - HOVER: `--tk-color-surface-row-hover` on the whole row (§C real-hover
 *   probe rgba(36,74,127,0.06)); name stays ink, NO underline (the
 *   reference's net visual — the anchor's raw blue base is overridden, the
 *   kit renders ink directly).
 * - TYPOGRAPHY (§E): primary 15/24 text-primary (product-UI ink
 *   rgba(0,0,0,0.8) = the kit's text-primary mapping), secondary 13/20
 *   text-secondary; header 15px/500 text-secondary, letter-spacing normal,
 *   aligned with the body tracks. Sizes ride the text tokens; the 24px/20px
 *   line-heights are capture literals (FLAGGED — the token layer's leading
 *   is 1.5, the table's is measured).
 * - DELTAS: `--tk-color-delta-{positive,negative}` on BOTH lines of the
 *   cell (§E: the ₽-line and %-line share the direction color) — the 6.1
 *   AA-override semantics; the site's #00A328/#F52222 are DESIGN.md
 *   anchors, NOT consumed.
 * - STITCH (the 3.9 article-card pick): the first cell's primary text is a
 *   real `<a>` whose ::after stretches `inset: 0` over the positioned row —
 *   the WHOLE row is the link's hit area, one anchor per row.
 * - FOCUS: the §8 unified ring around the WHOLE ROW — keyed on
 *   `:has(.row__link:focus-visible)` so a MOUSE click (focus without
 *   focus-visible) does not paint the keyboard ring; the bare
 *   `:focus-within` letter of the spec would ring on every click-focus.
 *   :has() is evergreen-supported (chromium ≥105) and declarative — the
 *   recorded kit pick of the CSS state over a JS-mirrored attribute.
 *
 * Per-component custom properties (`--tk-data-table-*`, CONVENTIONS §6),
 * each consumed WITH its literal/structural default:
 * - `--tk-data-table-row-min-height` body row height (default 81px — the
 *   capture literal; a themed table can re-rhythm without a new token)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 81px row height and 24px/20px line-heights (capture literals,
 * NOTES §E), the 640px table min-width (the narrow-viewport fence — below
 * it the host scrolls, columns never reflow; picked for the three-column
 * reference anatomy), and the 4px inter-line gap (the token step nearest
 * the measured 6px line-box gap; sub-pixel against 81px rows).
 */

export const dataTableStyles = css`
  :host {
    display: block;
    /* The narrow-viewport fence: the inner table keeps its min-width and
       the HOST scrolls horizontally — columns never reflow (spec). */
    overflow-x: auto;
  }

  /* 'hidden' must actually hide: the 'display: block' above is author-origin
     and BEATS the UA '[hidden] { display: none }' rule — without this guard
     a hidden table keeps painting (the 6.2/6.3 visual-gate lesson). */
  :host([hidden]) {
    display: none;
  }

  .table {
    min-width: 640px;
    font-family: var(--tk-font-body);
  }

  /* --- Header row cells: 15px/500 text-secondary, STATIC (no sort v2) ------ */

  .cell--header {
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: 24px;
    color: var(--tk-color-text-secondary);
    letter-spacing: normal;
  }

  /* --- Body rows: 81px, grid tracks, 1px divider on the row ---------------- */

  .row {
    position: relative; /* the stitching context the link's ::after resolves against */
    box-sizing: border-box;
    display: grid;
    align-items: center;
    column-gap: var(--tk-space-24);
    min-height: var(--tk-data-table-row-min-height, 81px);
    padding: var(--tk-space-8) var(--tk-space-16);
    border-bottom: 1px solid var(--tk-color-border-table);
    transition: background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* The header row override — AFTER the .row rule on purpose: the element
     carries BOTH classes, and the 81px rhythm belongs to the BODY rows only
     (NOTES §E). The reference header band measures 61px; natural
     padding+line (16+24+16=56px) is the token-nearest pick, so the
     inherited row min-height is zeroed here (source order decides equal
     specificity). */
  .row--header {
    min-height: 0;
    padding: var(--tk-space-16) var(--tk-space-16);
  }

  /* Hover rides the whole row — and only rows that GO somewhere (the §C
     real-hover fill; inert rows do not borrow the affordance). */
  .row--link:hover {
    background: var(--tk-color-surface-row-hover);
  }

  .row--link {
    cursor: pointer;
  }

  .cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--tk-space-4);
    min-width: 0; /* grid item discipline: long names shrink, never blow the track */
  }

  .cell--align-end {
    text-align: end;
  }

  /* Two-line anatomy (§E): primary 15/24 ink, secondary 13/20 muted.
     The primary GROUP keys on .row__link (lens B1): the first cell of a
     link row renders its primary line as the row anchor, and the anchor —
     the table's most prominent glyph — must receive the spec's 15/24
     DIRECTLY, not inherit the page's ambient leading (pre-fix the group's
     second member was a dead .cell__link selector the template never
     rendered, so the anchor rode the canvas's 1.5 leading = 22.5px). */
  .cell__primary,
  .row__link {
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: 24px;
    color: var(--tk-color-text-primary);
  }

  .cell__secondary {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: 20px;
    color: var(--tk-color-text-secondary);
  }

  /* Deltas (6.1 semantics): the direction color paints BOTH lines of the
     cell — the reference's ₽-line and %-line share it (§E). */
  .cell--delta-positive .cell__primary,
  .cell--delta-positive .cell__secondary {
    color: var(--tk-color-delta-positive);
  }

  .cell--delta-negative .cell__primary,
  .cell--delta-negative .cell__secondary {
    color: var(--tk-color-delta-negative);
  }

  /* --- The row-as-link stitch (the 3.9 article-card pick) ------------------
     The anchor carries ONLY the first cell's primary text; its ::after
     covers the positioned row, so clicks anywhere on the row navigate
     natively — one anchor, one tab stop per row. Ink text, no underline
     (the reference's net visual; the anchor's blue base is not used).
     This rule carries ONLY the anchor-specific declaration — the primary
     typography group above owns size/weight/leading/color for BOTH members
     (lens B1: no duplicated typography). */
  .row__link {
    text-decoration: none;
  }

  .row__link::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  /* --- Focus: the §8 unified ring around the WHOLE row ---------------------
     Keyboard focus (focus-visible) on any row's anchor rings the row box —
     the boxed register; the anchor itself carries no ring. :has() keys the
     ring to KEYBOARD focus only (see the module header). */
  .row__link:focus-visible {
    outline: none;
  }

  .row:has(.row__link:focus-visible) {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* --- Zero state: never blank, outside the table role ---------------------
     (role=table demands row children — aria-required-children — so the
     message renders as the table's sibling, not inside it.) */
  .empty {
    margin: 0;
    padding: var(--tk-space-16);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-secondary);
  }
`;
