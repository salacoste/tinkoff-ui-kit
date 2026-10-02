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
 * - FINANCIAL CELLS (22.3, the research-hub insider-deals pass — every
 *   value below is lens/pixel-measured on the 1280px research capture):
 *   roundel 48×48 (x=252–300, area ≈πr²), roundel→name gap ≈17px → the
 *   space-16 step, name REGULAR ~15px (cap 11px — the existing primary
 *   15/24 anatomy, no new type), ticker the existing secondary 13/20,
 *   row pitch 64–82px against the kit's 81px min-height (fits), deal-type
 *   link PLAIN sentence-case text ~12–13px with NO underline and NO pill
 *   (the 22.2 badge ruling's twin — the kit paints it on the primary-line
 *   anatomy at 15/24; the live 12–13px rides the hub's denser band, a
 *   recorded delta, not a code axis), «Доля» value+caption = the EXISTING
 *   two-line anatomy (no duplicate), numeric columns right-aligned = the
 *   existing `align: 'end'`.
 *
 * Per-component custom properties (`--tk-data-table-*`, CONVENTIONS §6),
 * each consumed WITH its literal/structural default:
 * - `--tk-data-table-row-min-height` body row height (default 81px — the
 *   capture literal; a themed table can re-rhythm without a new token)
 * - `--tk-data-table-roundel-size` instrument roundel box (default 48px —
 *   the insider-table measurement; 22.3)
 * - `--tk-data-table-roundel-gap` roundel→stack gap (default space-16 —
 *   the nearest token step to the measured ≈17px; 22.3)
 * - `--tk-data-table-roundel-fill` / `--tk-data-table-roundel-text` the
 *   monogram roundel's pair (default the badge neutral gray-100/gray-600
 *   — theme-INVARIANT: the raw gray scale carries no dark remaps, the
 *   four badge fills' ruling; 22.3)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 81px row height and 24px/20px line-heights (capture literals,
 * NOTES §E), the 640px table min-width (the narrow-viewport fence — below
 * it the host scrolls, columns never reflow; picked for the three-column
 * reference anatomy), the 4px inter-line gap (the token step nearest
 * the measured 6px line-box gap; sub-pixel against 81px rows), and the
 * 48px roundel default (22.3 capture literal riding its size hook).
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
     cell — the reference's ₽-line and %-line share it (§E). The 22.3
     colored link is a THIRD member of the same groups: a delta-toned cell
     paints its link with the direction color (the link token never
     competes with the semantic). */
  .cell--delta-positive .cell__primary,
  .cell--delta-positive .cell__secondary,
  .cell--delta-positive .cell__link {
    color: var(--tk-color-delta-positive);
  }

  .cell--delta-negative .cell__primary,
  .cell--delta-negative .cell__secondary,
  .cell--delta-negative .cell__link {
    color: var(--tk-color-delta-negative);
  }

  /* --- The 22.3 financial cells ----------------------------------------------
     Instrument anatomy (a): the cell flips to a row — roundel + the SAME
     two-line stack (primary/secondary untouched inside .cell__stack). */

  .cell--instrument {
    flex-direction: row;
    align-items: center;
    gap: var(--tk-data-table-roundel-gap, var(--tk-space-16));
  }

  .cell__stack {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--tk-space-4);
    min-width: 0; /* long names shrink inside the track, never blow it */
  }

  /* The roundel box (48px measured): a consumer logo sized into the
     circle, or the letter fallback painting the same box. The gray pair
     is theme-INVARIANT (no dark remaps on the raw scale — the badge
     fills' ruling); a consumer brand tint rides the fill/text hooks. */
  .cell__roundel {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tk-data-table-roundel-size, 48px);
    height: var(--tk-data-table-roundel-size, 48px);
    border-radius: var(--tk-radius-full);
    overflow: hidden;
    background: var(--tk-data-table-roundel-fill, var(--tk-color-gray-100));
    color: var(--tk-data-table-roundel-text, var(--tk-color-gray-600));
    font-size: var(--tk-text-body-l-size);
    font-weight: var(--tk-text-body-l-bold-weight);
    line-height: 1;
  }

  .cell__roundel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Colored link (d): the primary line as a REAL anchor, base-painted by
     the link token, tone-painted by the delta groups above. PLAIN at rest
     — the live deal-type column paints no underline (the 22.2 no-pill
     ruling's twin); hover underlines for the affordance the flat paint
     hides. position:relative is load-bearing: positioned elements paint
     in TREE order, and this anchor sits in a LATER cell than the row
     anchor's ::after stitch — so in a linked row the cell link stays
     clickable above the whole-row overlay (the stitch priority ruling:
     the row anchor keeps the first cell, the cell link wins where it
     renders). The roving layer never touches it (a[data-index] only). */
  .cell__link {
    align-self: flex-start; /* the focus ring hugs the text, not the track */
    position: relative;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: 24px;
    color: var(--tk-color-link);
    text-decoration: none;
  }

  .cell__link:hover {
    text-decoration: underline;
  }

  .cell__link:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
    border-radius: var(--tk-radius-xs);
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
