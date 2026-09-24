import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { dataTableStyles } from './data-table.css.js';

/**
 * One column of the `columns` prop — the table's track definition.
 */
export interface TkDataTableColumn {
  /** Cell key this column addresses (matched against `rows[].cells`). */
  key: string;
  /** Visible header text (also the columnheader's content). */
  header: string;
  /** Text alignment of the column's cells (default `start`). */
  align?: 'start' | 'end';
  /** CSS grid track value consumed AS-IS (`1fr`, `200px`, `minmax(…)`) — structural, not validated; default `auto`. */
  width?: string;
}

/**
 * One cell of a row — the two-line anatomy: primary 15/24, optional
 * secondary 13/20. `delta` applies the delta semantic color to BOTH lines
 * of this cell (the sign lives in the data string — «color carries
 * direction»); no delta → text-primary/text-secondary.
 */
export interface TkDataTableCell {
  /** Primary line (15/24) — the row's first cell renders it as the link text. */
  primary: string;
  /** Secondary line (13/20); absent renders the single-line cell. */
  secondary?: string;
  /** Direction semantic painted on BOTH lines of the cell. */
  delta?: 'positive' | 'negative';
}

/**
 * One row of the `rows` prop. `href` missing/empty renders the row INERT
 * (no anchor, no hover affordance, skipped by roving focus) — degrade,
 * never throw (§2); the type is honest about the runtime tolerance.
 */
export interface TkDataTableRow {
  /** Navigation target — the WHOLE row is this anchor's hit area. */
  href?: string;
  /** Cells keyed by column `key`; unknown keys render empty cells. */
  cells: Record<string, TkDataTableCell>;
}

/**
 * The zero-state copy (rows=[]): never blank, rendered as the table's
 * sibling (role=table demands row children — see the css module header).
 */
export const TK_DATA_TABLE_DEFAULT_EMPTY_TEXT = 'Нет данных';

/**
 * tk-data-table — the typographic row-as-link catalog table (Story 6.4,
 * THE v2 flagship): two-line cells, deltas whose COLOR carries direction,
 * 81px rows with 1px hairline dividers, whole-row hover, and every row a
 * native anchor whose ::after stitch makes the WHOLE ROW the hit area —
 * the invest/stocks catalog anatomy (NOTES §C/§E measured) carrying the
 * SANCTIONED APG keyboard layer the reference lacks (FR-12's improvement
 * axis): roving tabindex, ArrowUp/Down clamped, Home/End, Enter native,
 * Space preventDefaulted + click().
 *
 * NAVIGATION, NOT A FORM CHANNEL (the navbar/§9 ruling — the spec's own
 * API decision): `columns`/`rows`/`caption` are prop-ONLY inputs, there is
 * NO §4 value/defaultValue pair and NO events — a row click is native
 * anchor navigation the kit never intercepts, and row focus is internal UI
 * state (nothing dispatches). The event-map carries no entry (unit-pinned).
 *
 * SEMANTICS (the APG table pattern): container `role="table"` named by
 * `caption` (aria-label — the reference has no visible caption), header
 * `role="row"` of `role="columnheader"` cells, body a `role="rowgroup"`
 * of `role="row"`s containing `role="cell"`s. Zero rows render NO
 * rowgroup — the zero-state copy does (aria-required-children).
 *
 * KEYBOARD (the roving contract): ONE Tab stop into the table (the focused
 * row's anchor carries tabindex 0, all others −1; initial = first row);
 * ArrowUp/Down move row-to-row CLAMPED at the ends (no wrap — grid
 * convention), skipping INERT rows (no anchor to focus); Home/End jump
 * first/last focusable row; Enter navigates natively (never intercepted);
 * Space is preventDefaulted + click() (anchors ignore Space natively);
 * Tab exits naturally from the focused row. Focus following MOUSE clicks
 * moves the tab stop too (focusin tracking) so Tab-out behaves. The §8
 * unified ring paints around the WHOLE row (`:has(a:focus-visible)` — the
 * css module header).
 *
 * SCOPE FENCES (v2): no selection channel, no sorting (headers static), no
 * virtualization (long lists scroll naturally), no brand-logo column type;
 * narrow viewports scroll the host (`overflow-x: auto`) against the
 * table's min-width — columns never reflow.
 *
 * STATELESS against the consumer (no channel, nothing dispatches) but
 * SSR-compat (AD-10): rendered via Lit templates only; focus moves happen
 * strictly inside `updated()`-driven renders and event handlers.
 *
 * @tag tk-data-table
 * @attr {string} caption - Accessible table name (aria-label on the role=table container); sr-only — no visible caption renders.
 * @prop {TkDataTableColumn[]} [columns] - Column definitions; drive the header row and the shared grid tracks (width consumed as-is).
 * @prop {TkDataTableRow[]} [rows] - Row data; `href` makes the whole row a native anchor, missing `href` renders an inert row.
 */
export class TkDataTable extends LitElement {
  static override readonly styles = [dataTableStyles];

  /** Column definitions — property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  columns: TkDataTableColumn[] = [];

  /** Row data — property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  rows: TkDataTableRow[] = [];

  /** Accessible table name — the role=table container's aria-label. */
  @property({ type: String })
  caption?: string;

  /** Sanitized live column list (null/undefined props clamp to empty). */
  get #effectiveColumns(): TkDataTableColumn[] {
    return this.columns ?? [];
  }

  /** Sanitized live row list (null/undefined props clamp to empty). */
  get #effectiveRows(): TkDataTableRow[] {
    return this.rows ?? [];
  }

  /**
   * The row whose anchor carries the roving tabindex (0; all others −1).
   * Follows keyboard moves AND mouse focus (focusin), initial = first row.
   */
  #activeIndex = 0;

  /**
   * Roving discipline on data change: clamp the tab stop back into range,
   * and never leave it on an INERT row (scan forward then backward for a
   * focusable one — the select #syncActiveOnDataChange mirror). §2 spirit:
   * a shrunk/replaced list never strands the tab stop nowhere.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('rows')) {
      const rows = this.#effectiveRows;
      if (rows.length === 0) {
        this.#activeIndex = 0;
        return;
      }
      this.#activeIndex = Math.min(this.#activeIndex, rows.length - 1);
      if (rows[this.#activeIndex] && !this.#isFocusable(this.#activeIndex)) {
        this.#activeIndex =
          this.#stepFocusable(this.#activeIndex, 1) ?? this.#stepFocusable(this.#activeIndex, -1) ?? 0;
      }
    }
  }

  /** A row is focusable when it carries a usable href (inert rows are skipped by roving). */
  #isFocusable(index: number): boolean {
    const href = this.#effectiveRows[index]?.href;
    return typeof href === 'string' && href.length > 0;
  }

  /** Next focusable index from `from` toward `direction`, CLAMPED (no wrap — the grid convention). Null at the edge. */
  #stepFocusable(from: number, direction: 1 | -1): number | null {
    const rows = this.#effectiveRows;
    let index = from + direction;
    while (index >= 0 && index < rows.length) {
      if (this.#isFocusable(index)) return index;
      index += direction;
    }
    return null;
  }

  /** First/last focusable row index (null when every row is inert). */
  #edgeFocusable(edge: 'first' | 'last'): number | null {
    const rows = this.#effectiveRows;
    if (edge === 'first') {
      for (let i = 0; i < rows.length; i += 1) if (this.#isFocusable(i)) return i;
    } else {
      for (let i = rows.length - 1; i >= 0; i -= 1) if (this.#isFocusable(i)) return i;
    }
    return null;
  }

  /** The anchor of row `index` as rendered (null before first paint / on inert rows). */
  #anchorAt(index: number): HTMLAnchorElement | null {
    return this.renderRoot.querySelector<HTMLAnchorElement>(`a[data-index="${index}"]`);
  }

  /**
   * Moves the roving tab stop to `index` and (by default) focuses its
   * anchor. Focus moves BEFORE Lit re-renders — the anchors are stable
   * in-place nodes, and focus does not depend on tabindex — then the
   * reactive tabindex flip re-renders around the new stop. Long lists
   * scroll the newly focused row into view (`block: 'nearest'`).
   */
  #setActive(index: number, options: { focus?: boolean } = {}): void {
    const focus = options.focus ?? true;
    if (this.#activeIndex === index) {
      if (focus) this.#focusAnchor(index);
      return;
    }
    this.#activeIndex = index;
    this.requestUpdate();
    if (focus) this.#focusAnchor(index);
  }

  #focusAnchor(index: number): void {
    const anchor = this.#anchorAt(index);
    if (!anchor) return;
    anchor.focus();
    // Guarded: happy-dom has no scrollIntoView; layout-less environments
    // simply skip the scroll (the select mold).
    if (typeof anchor.scrollIntoView === 'function') {
      anchor.scrollIntoView({ block: 'nearest' });
    }
  }

  // --- interaction handlers ----------------------------------------------------

  /**
   * Focus tracking (the roving stop follows REAL focus): a mouse click on
   * any row focuses its anchor — the tab stop moves there so the next Tab
   * exits from the row the user is on (keyboard moves land here too, via
   * the focus the handler itself set; no-op then).
   */
  #handleFocusin(event: FocusEvent): void {
    const target = event.target as Element | null;
    const anchor = target?.closest?.('a[data-index]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const index = Number(anchor.getAttribute('data-index'));
    if (Number.isInteger(index) && index !== this.#activeIndex) {
      this.#setActive(index, { focus: false });
    }
  }

  /**
   * The roving contract, delegated on the rowgroup: ArrowUp/Down step
   * row-to-row CLAMPED at the ends (no wrap), Home/End jump first/last
   * focusable row, Space is preventDefaulted + click() (anchors ignore
   * Space natively), Enter is left native (the anchor navigates itself).
   */
  #handleKeydown(event: KeyboardEvent): void {
    const anchor = (event.target as Element | null)?.closest?.('a[data-index]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = this.#stepFocusable(this.#activeIndex, 1);
        if (next !== null) this.#setActive(next);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const previous = this.#stepFocusable(this.#activeIndex, -1);
        if (previous !== null) this.#setActive(previous);
        break;
      }
      case 'Home': {
        event.preventDefault();
        const first = this.#edgeFocusable('first');
        if (first !== null) this.#setActive(first);
        break;
      }
      case 'End': {
        event.preventDefault();
        const last = this.#edgeFocusable('last');
        if (last !== null) this.#setActive(last);
        break;
      }
      case ' ':
        event.preventDefault(); // anchors ignore Space natively — activate explicitly
        anchor.click();
        break;
      default:
        break; // Enter/Tab and everything else: native
    }
  }

  // --- render --------------------------------------------------------------------

  /** The shared grid template — identical string on header and body rows keeps the tracks aligned. */
  #gridTemplate(): string {
    return this.#effectiveColumns.map((column) => column?.width ?? 'auto').join(' ');
  }

  /** Cell-level delta semantic (invalid runtime values degrade to no delta). */
  #deltaOf(cell: TkDataTableCell | undefined): 'positive' | 'negative' | undefined {
    return cell?.delta === 'positive' || cell?.delta === 'negative' ? cell.delta : undefined;
  }

  #renderHeaderRow(): TemplateResult {
    return html`
      <div class="row row--header" role="row" style="grid-template-columns: ${this.#gridTemplate()}">
        ${this.#effectiveColumns.map((column) => {
          if (!column) return nothing;
          const alignClass = column.align === 'end' ? ' cell--align-end' : '';
          return html`<div class="cell cell--header${alignClass}" role="columnheader">
            ${column.header ?? ''}
          </div>`;
        })}
      </div>
    `;
  }

  #renderRow(row: TkDataTableRow, index: number): TemplateResult {
    const href = typeof row?.href === 'string' && row.href.length > 0 ? row.href : null;
    const rowClass = href ? 'row row--link' : 'row';
    return html`
      <div class=${rowClass} role="row" style="grid-template-columns: ${this.#gridTemplate()}">
        ${this.#effectiveColumns.map((column, columnIndex) => {
          if (!column) return nothing;
          const cell = row?.cells?.[column.key];
          const delta = this.#deltaOf(cell);
          const deltaClass = delta ? ` cell--delta-${delta}` : '';
          const alignClass = column.align === 'end' ? ' cell--align-end' : '';
          const primary = cell?.primary != null ? String(cell.primary) : '';
          const secondary = cell?.secondary != null ? String(cell.secondary) : '';
          return html`<div class="cell${deltaClass}${alignClass}" role="cell">
            ${columnIndex === 0 && href
              ? html`<a
                  class="row__link"
                  data-index=${index}
                  href=${href}
                  tabindex=${index === this.#activeIndex ? '0' : '-1'}
                  >${primary}</a
                >`
              : html`<span class="cell__primary">${primary}</span>`}
            ${secondary ? html`<span class="cell__secondary">${secondary}</span>` : nothing}
          </div>`;
        })}
      </div>
    `;
  }

  override render() {
    const rows = this.#effectiveRows;
    const columns = this.#effectiveColumns;
    return html`
      <div class="table" role="table" aria-label=${this.caption ?? nothing}>
        ${columns.length > 0 ? this.#renderHeaderRow() : nothing}
        ${rows.length > 0
          ? html`<div class="body" role="rowgroup" @focusin=${this.#handleFocusin} @keydown=${this.#handleKeydown}>
              ${rows.map((row, index) => this.#renderRow(row, index))}
            </div>`
          : nothing}
      </div>
      ${rows.length === 0 ? html`<p class="empty">${TK_DATA_TABLE_DEFAULT_EMPTY_TEXT}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-data-table': TkDataTable;
  }
}

if (!customElements.get('tk-data-table')) {
  customElements.define('tk-data-table', TkDataTable);
}
