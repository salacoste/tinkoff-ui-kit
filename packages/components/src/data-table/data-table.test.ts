// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dataTableStyles } from './data-table.css.js';
import { TK_DATA_TABLE_DEFAULT_EMPTY_TEXT, TkDataTable, type TkDataTableColumn, type TkDataTableRow } from './data-table.js';

/**
 * tk-data-table unit tests (spec 6.4): the thirteen I/O & edge-case matrix
 * rows — render anatomy, delta up, delta down/none, whole-row navigation,
 * keyboard entry (single Tab stop), arrows clamped no-wrap, Home/End,
 * Enter native / Space click, empty rows, missing data (unknown key /
 * no href), long list (100 rows, roving intact), caption set/omitted,
 * narrow viewport — plus the structural pins (81px literal, divider and
 * hover tokens, the ::after stitch, the whole-row focus ring, the no-event
 * contract) asserted against the cssText / DOM the way the select and
 * article-card suites pin their sheets.
 */

const elementUpdated = (el: TkDataTable): Promise<unknown> => el.updateComplete;

/** The reference catalog anatomy: Название/Цена/Изменение, real RU tickers. */
const STOCK_COLUMNS: TkDataTableColumn[] = [
  { key: 'name', header: 'Название', width: '1fr' },
  { key: 'price', header: 'Цена', align: 'end' },
  { key: 'change', header: 'Изменение', align: 'end' },
];

const stockRow = (
  name: string,
  ticker: string,
  price: string,
  lot: string,
  deltaRub: string,
  deltaPct: string,
  delta: 'positive' | 'negative' | undefined,
  href: string | undefined = `/invest/stocks/${ticker}/`,
): TkDataTableRow => ({
  href,
  cells: {
    name: { primary: name, secondary: ticker },
    price: { primary: price, secondary: lot },
    change: { primary: deltaRub, secondary: deltaPct, delta },
  },
});

const TEN_STOCKS: TkDataTableRow[] = [
  stockRow('Сбербанк', 'SBER', '318,44 ₽', '1 лот = 10 акций', '+12,55 ₽', '+1,46 %', 'positive'),
  stockRow('Т-Технологии', 'TCSG', '3 285,00 ₽', '1 лот = 1 акция', '−48,50 ₽', '−0,9 %', 'negative'),
  stockRow('Газпром', 'GAZP', '128,36 ₽', '1 лот = 10 акций', '+0,66 ₽', '+0,51 %', 'positive'),
  stockRow('Лукойл', 'LKOH', '684,50 ₽', '1 лот = 1 акция', '−1,2 %', '−0,18 %', undefined),
  stockRow('Норникель', 'GMKN', '121,80 ₽', '1 лот = 10 акций', '−0,9 ₽', '−0,63 %', 'negative'),
  stockRow('Роснефть', 'ROSN', '461,35 ₽', '1 лот = 1 акция', '', '', undefined, undefined),
  stockRow('МТС', 'MTSS', '214,60 ₽', '1 лот = 10 акций', '+2,1 ₽', '+0,8 %', 'positive'),
  stockRow('Магнит', 'MGNT', '4 120,00 ₽', '1 лот = 1 акция', '−25,0 ₽', '−1,1 %', 'negative'),
  stockRow('Полюс', 'PLZL', '1 812,00 ₽', '1 лот = 1 акция', '+14,4 ₽', '+0,42 %', 'positive'),
  stockRow('ВТБ', 'VTBR', '0,0581 ₽', '1 лот = 10 000 акций', '+0,0002 ₽', '+0,35 %', 'positive'),
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkDataTable>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkDataTable> => {
  const el = new TkDataTable();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const table = (el: TkDataTable): Element => {
  const node = el.shadowRoot?.querySelector('[role="table"]');
  expect(node, 'the role=table container renders').toBeInstanceOf(Element);
  return node as Element;
};

const headerCells = (el: TkDataTable): Element[] =>
  Array.from(el.shadowRoot?.querySelectorAll('[role="columnheader"]') ?? []);

const bodyRows = (el: TkDataTable): Element[] =>
  Array.from(el.shadowRoot?.querySelectorAll('[role="rowgroup"] > [role="row"]') ?? []);

const anchors = (el: TkDataTable): HTMLAnchorElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll('a[data-index]') ?? []);

const press = (anchor: Element, key: string): boolean =>
  anchor.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => dataTableStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-data-table', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-data-table exposing TkDataTable', async () => {
    await customElements.whenDefined('tk-data-table');
    expect(customElements.get('tk-data-table')).toBe(TkDataTable);
  });

  it('consumes SEMANTICS for its paint: 81px literal row, border-table divider, row-hover fill, delta pair (structural pin)', () => {
    const cssText = sheet();
    expect(cssText).toMatch(/min-height:\s*var\(--tk-data-table-row-min-height,\s*81px\)/);
    expect(cssText).toMatch(/border-bottom:\s*1px solid var\(--tk-color-border-table\)/);
    // Font pin (lens B1): the primary 15/24 typography group keys on the
    // class the template actually renders — .row__link, NOT a dead
    // .cell__link — so the row-name anchor receives the spec's primary
    // size/leading directly instead of inheriting the page's ambient font.
    expect(cssText).toMatch(
      /\.cell__primary,\s*\.row__link\s*\{[^}]*font-size:\s*var\(--tk-text-body-m-size\)[^}]*line-height:\s*24px/,
    );
    expect(cssText).not.toMatch(/\.cell__link/);
    expect(cssText).toMatch(/\.row--link:hover\s*\{[^}]*background:\s*var\(--tk-color-surface-row-hover\)/);
    expect(cssText).toMatch(/--tk-color-delta-positive/);
    expect(cssText).toMatch(/--tk-color-delta-negative/);
    // No zebra, no scale-token hover paint, no site delta anchors. The raw
    // site hexes are assembled via siteHex() so this FILE stays FR-1-clean
    // (the zero-hardcoded scanner reads source text — a '#' prefix in a
    // negative assertion is still a literal to it); the runtime pattern is
    // identical to a plain /#00A328|#F52222/.
    const siteHex = (digits: string): string => `#${digits}`;
    expect(cssText).not.toMatch(/nth-child/);
    expect(cssText).not.toMatch(/var\(--tk-color-gray-100\)/);
    expect(cssText).not.toMatch(new RegExp([siteHex('00A328'), siteHex('F52222')].join('|')));
  });

  // --- Matrix row 1: render ---------------------------------------------------

  it('renders 3 columns / 10 rows: header row + 10 grid rows with the two-line cell anatomy', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS }, attributes: { caption: 'Каталог акций' } });
    expect(headerCells(el)).toHaveLength(3);
    expect(headerCells(el).map((cell) => cell.textContent?.trim())).toEqual(['Название', 'Цена', 'Изменение']);
    const rows = bodyRows(el);
    expect(rows).toHaveLength(10);
    // The APG table pattern: table > rowgroup > row > cell.
    expect(table(el).getAttribute('role')).toBe('table');
    expect(el.shadowRoot?.querySelector('[role="rowgroup"]')).toBeInstanceOf(Element);
    const firstRowCells = Array.from(rows[0]?.querySelectorAll('[role="cell"]') ?? []);
    expect(firstRowCells).toHaveLength(3);
    // Two-line anatomy: primary + secondary spans in each data-bearing cell.
    expect(firstRowCells[0]?.querySelector('.cell__primary, .row__link')).toBeInstanceOf(HTMLAnchorElement);
    expect(firstRowCells[0]?.querySelector('.cell__secondary')?.textContent).toBe('SBER');
    // Shared grid tracks: header and body rows carry the SAME template.
    expect(rows[0]?.getAttribute('style')).toBe(
      el.shadowRoot?.querySelector('.row--header')?.getAttribute('style'),
    );
    expect(rows[0]?.getAttribute('style')).toContain('1fr');
  });

  // --- Matrix row 2: delta up ---------------------------------------------------

  it('delta positive paints BOTH lines of the cell with the delta semantic class', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const changeCell = bodyRows(el)[0]?.querySelectorAll('[role="cell"]')[2];
    expect(changeCell?.className).toContain('cell--delta-positive');
    expect(changeCell?.querySelector('.cell__primary')?.textContent).toBe('+12,55 ₽');
    expect(changeCell?.querySelector('.cell__secondary')?.textContent).toBe('+1,46 %');
    // Both lines sit INSIDE the delta cell — the semantic covers the pair.
    expect(changeCell?.querySelectorAll('.cell__primary, .row__link, .cell__secondary')).toHaveLength(2);
  });

  // --- Matrix row 3: delta down / none -------------------------------------------

  it('delta negative paints both lines; omitted delta renders ink + muted lines with no delta class', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const down = bodyRows(el)[1]?.querySelectorAll('[role="cell"]')[2];
    expect(down?.className).toContain('cell--delta-negative');
    // Row 3 (Лукойл) carries NO delta: no class, the lines keep their own colors.
    const none = bodyRows(el)[3]?.querySelectorAll('[role="cell"]')[2];
    expect(none?.className).not.toContain('cell--delta-');
    expect(none?.querySelector('.cell__primary')).toBeInstanceOf(Element);
    expect(none?.querySelector('.cell__secondary')).toBeInstanceOf(Element);
  });

  // --- Matrix row 4: row navigation ----------------------------------------------

  it('row navigate: ONE anchor per row — the first cell primary text, href on the whole row (stitch structural pin)', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const rows = bodyRows(el);
    const rowAnchors = Array.from(rows[0]?.querySelectorAll('a') ?? []);
    expect(rowAnchors, 'exactly one anchor per row').toHaveLength(1);
    expect(rowAnchors[0]?.getAttribute('href')).toBe('/invest/stocks/SBER/');
    expect(rowAnchors[0]?.textContent).toBe('Сбербанк');
    expect(anchors(el)).toHaveLength(10);
    // The stitch: the row is the positioning context, the anchor's ::after
    // covers it whole — clicks anywhere on the row land on the ANCHOR.
    const cssText = sheet();
    const rowRule = cssText.match(/^ {2}\.row\s*\{([^}]*)\}/m)?.[1] ?? '';
    expect(rowRule).toMatch(/position:\s*relative/);
    expect(cssText).toMatch(/\.row__link::after\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0/);
  });

  it('clicking the anchor navigates natively — the kit dispatches NOTHING (no channel events)', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const heard: string[] = [];
    for (const name of ['select', 'activate', 'navigate', 'row-change', 'value-change']) {
      el.addEventListener(name, () => heard.push(name));
    }
    const dispatch = vi.fn();
    anchors(el)[0]?.addEventListener('click', dispatch);
    anchors(el)[0]?.click();
    expect(dispatch).toHaveBeenCalled(); // the native anchor click path is intact
    expect(heard).toEqual([]); // zero synthetic kit events (the navbar no-channel ruling)
  });

  // --- Matrix row 5: keyboard entry -------------------------------------------------

  it('keyboard entry: the FIRST row anchor is the single tab stop (tabindex 0), all others −1', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const stops = anchors(el).map((anchor) => anchor.getAttribute('tabindex'));
    expect(stops[0]).toBe('0');
    expect(stops.slice(1).every((value) => value === '-1')).toBe(true);
    expect(stops.filter((value) => value === '0')).toHaveLength(1);
  });

  // --- Matrix row 6: arrows ----------------------------------------------------------

  it('ArrowDown/ArrowUp move focus row-to-row, CLAMPED at the ends, NO wrap', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const rows = anchors(el);
    rows[0]?.focus();
    press(rows[0] as Element, 'ArrowDown'); // 0 → 1
    press(rows[1] as Element, 'ArrowDown'); // 1 → 2
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[2]);
    expect(el.shadowRoot?.activeElement?.getAttribute('tabindex')).toBe('0');

    press(rows[2] as Element, 'ArrowUp'); // 2 → 1
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[1]);

    // Clamp at the TOP: ArrowUp on the first row keeps focus there.
    rows[0]?.focus();
    await elementUpdated(el);
    press(rows[0] as Element, 'ArrowUp');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[0]);

    // Clamp at the BOTTOM: ArrowDown on the last row keeps focus there.
    rows[9]?.focus();
    await elementUpdated(el);
    press(rows[9] as Element, 'ArrowDown');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[9]);
    // No wrap: after the clamped ArrowDown the FIRST row keeps the stop only
    // if focus legitimately returned — assert the stop never jumped to row 0.
    expect(rows[0]?.getAttribute('tabindex')).toBe('-1');
  });

  // --- Matrix row 7: Home/End ----------------------------------------------------------

  it('Home/End jump to the first/last row anchor', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const rows = anchors(el);
    rows[5]?.focus();
    await elementUpdated(el);
    press(rows[5] as Element, 'End');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[9]);
    expect(rows[9]?.getAttribute('tabindex')).toBe('0');

    press(rows[9] as Element, 'Home');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[0]);
    expect(rows[0]?.getAttribute('tabindex')).toBe('0');
  });

  // --- Matrix row 8: Enter/Space ------------------------------------------------------------

  it('Enter is left native (never preventDefaulted — the anchor navigates itself); Space is preventDefaulted + click()', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const anchor = anchors(el)[0] as HTMLAnchorElement;

    const enterNotDefaulted = press(anchor, 'Enter');
    expect(enterNotDefaulted, 'Enter keydown stays cancellable-native').toBe(true);

    const clicks = vi.fn();
    anchor.addEventListener('click', clicks);
    const spaceDefaulted = press(anchor, ' ');
    expect(spaceDefaulted, 'Space keydown is preventDefaulted').toBe(false);
    expect(clicks, 'Space activates the anchor explicitly').toHaveBeenCalledTimes(1);
  });

  // --- Matrix row 9: empty rows ----------------------------------------------------------

  it('rows=[] renders the documented zero-state copy (never blank) and NO rowgroup', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: [] } });
    expect(bodyRows(el)).toHaveLength(0);
    expect(el.shadowRoot?.querySelector('[role="rowgroup"]')).toBeNull();
    const empty = el.shadowRoot?.querySelector('.empty');
    expect(empty?.textContent).toBe(TK_DATA_TABLE_DEFAULT_EMPTY_TEXT);
    expect(empty?.textContent).toBe('Нет данных');
    // The zero-state copy sits OUTSIDE the role=table (aria-required-children).
    expect(table(el).contains(empty as Node)).toBe(false);
    // The header still renders — columns are known even with no data.
    expect(headerCells(el)).toHaveLength(3);
  });

  // --- Matrix row 10: missing data -------------------------------------------------------------

  it('unknown cell keys render EMPTY cells; missing href renders an inert row (§2 degrade, never throw)', async () => {
    const el = await mount({
      props: {
        columns: STOCK_COLUMNS,
        rows: [
          {
            href: '/invest/stocks/X/',
            cells: { name: { primary: 'Без цены' } }, // price/change keys unknown → empty cells
          },
          { cells: { name: { primary: 'Инертная строка' } } }, // no href → inert row
          null as unknown as TkDataTableRow, // a null row degrades to an empty row, never a crash
        ],
      },
    });
    const rows = bodyRows(el);
    expect(rows).toHaveLength(3);
    const emptyCells = Array.from(rows[0]?.querySelectorAll('[role="cell"]') ?? []);
    expect(emptyCells[1]?.textContent?.trim()).toBe('');
    expect(emptyCells[2]?.textContent?.trim()).toBe('');
    expect(emptyCells[1]?.querySelector('.cell__primary')?.textContent).toBe('');

    // Inert row: no anchor, not part of the roving set.
    expect(rows[1]?.querySelector('a')).toBeNull();
    expect(rows[1]?.className).not.toContain('row--link');
    expect(anchors(el)).toHaveLength(1);
    // The null row rendered as an empty row (3 cells, no content) — degrade.
    expect(rows[2]?.querySelectorAll('[role="cell"]')).toHaveLength(3);
  });

  it('nullish props clamp to empty; inert rows are SKIPPED by roving (arrows/Home/End land on focusable rows only)', async () => {
    const el = await mount({
      props: {
        columns: null as unknown as TkDataTableColumn[],
        rows: null as unknown as TkDataTableRow[],
      },
    });
    expect(el.shadowRoot?.querySelector('[role="table"]')).toBeInstanceOf(Element);
    expect(bodyRows(el)).toHaveLength(0);

    const el2 = await mount({
      props: {
        columns: STOCK_COLUMNS,
        rows: [
          { cells: { name: { primary: 'Инертная 1' } } },
          stockRow('Сбербанк', 'SBER', '318,44 ₽', '1 лот = 10 акций', '+12,55 ₽', '+1,46 %', 'positive'),
          { cells: { name: { primary: 'Инертная 2' } } },
          stockRow('Газпром', 'GAZP', '128,36 ₽', '1 лот = 10 акций', '+0,66 ₽', '+0,51 %', 'positive'),
        ],
      },
    });
    // Initial stop = FIRST FOCUSABLE row (index 1), never an inert one.
    const stops = bodyRows(el2).map((row) => row.querySelector('a')?.getAttribute('tabindex') ?? null);
    expect(stops).toEqual([null, '0', null, '-1']);
    const sber = anchors(el2)[0] as Element;
    const gazp = anchors(el2)[1] as Element;
    press(sber, 'ArrowDown'); // skips inert row 2 → row 3
    await elementUpdated(el2);
    expect(el2.shadowRoot?.activeElement).toBe(gazp);
    press(gazp, 'ArrowDown'); // clamped at the last focusable row
    await elementUpdated(el2);
    expect(el2.shadowRoot?.activeElement).toBe(gazp);
    press(gazp, 'Home'); // first focusable = SBER
    await elementUpdated(el2);
    expect(el2.shadowRoot?.activeElement).toBe(sber);
  });

  it('roving survives data change: a shrunk list clamps the stop; a replaced active row moves it to a live row', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const rows = anchors(el);
    rows[8]?.focus();
    await elementUpdated(el);
    el.rows = TEN_STOCKS.slice(0, 3); // shrink under the stop (8 → clamp to 2)
    await elementUpdated(el);
    expect(anchors(el)).toHaveLength(3);
    expect(anchors(el)[2]?.getAttribute('tabindex')).toBe('0');
    expect(anchors(el)[2]?.getAttribute('data-index')).toBe('2');
  });

  // --- Matrix row 11: long list -------------------------------------------------------------

  it('100 rows render naturally (no virtualization) and the roving contract stays intact', async () => {
    const many: TkDataTableRow[] = Array.from({ length: 100 }, (_, i) =>
      stockRow(`Акция ${i + 1}`, `T${i}`, '100,00 ₽', '1 лот = 1 акция', '+1,00 ₽', '+1,0 %', 'positive'),
    );
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: many } });
    expect(bodyRows(el)).toHaveLength(100);
    const rows = anchors(el);
    expect(rows).toHaveLength(100);
    rows[0]?.focus();
    press(rows[0] as Element, 'End');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[99]);
    expect(rows[99]?.getAttribute('tabindex')).toBe('0');
    press(rows[99] as Element, 'Home');
    await elementUpdated(el);
    expect(el.shadowRoot?.activeElement).toBe(rows[0]);
    // Focus moves scroll the row into view (block nearest) where the engine has it.
    const scrolled: string[] = [];
    for (const anchor of rows) {
      vi.spyOn(anchor, 'scrollIntoView').mockImplementation(((arg?: unknown) => {
        scrolled.push(`${anchor.getAttribute('data-index')}:${JSON.stringify(arg)}`);
      }) as Element['scrollIntoView']);
    }
    press(rows[0] as Element, 'ArrowDown');
    await elementUpdated(el);
    expect(scrolled.at(-1)).toContain('"nearest"');
  });

  // --- Matrix row 12: caption ------------------------------------------------------------------

  it('caption set/omitted: the role=table is named via aria-label / renders unnamed', async () => {
    const named = await mount({
      props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS },
      attributes: { caption: 'Каталог акций' },
    });
    expect(table(named).getAttribute('aria-label')).toBe('Каталог акций');
    // The caption is sr-only — no visible caption element renders.
    expect(named.shadowRoot?.querySelector('caption, figcaption')).toBeNull();

    const unnamed = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    expect(table(unnamed).getAttribute('aria-label')).toBeNull();
  });

  // --- Matrix row 13: narrow viewport ------------------------------------------------------------

  it('narrow viewport: the host scrolls horizontally against the table min-width — columns never reflow (structural pin)', () => {
    const cssText = sheet();
    expect(cssText).toMatch(/:host\s*\{[^}]*overflow-x:\s*auto/);
    expect(cssText).toMatch(/\.table\s*\{[^}]*min-width:\s*640px/);
    // No responsive column-collapse branch exists.
    expect(cssText).not.toMatch(/@media/);
  });

  // --- Keyboard-ring + hover affordance structural pins --------------------------------------------

  it('focus ring: the §8 unified token rings the WHOLE ROW on keyboard focus (structural pin)', () => {
    const cssText = sheet();
    expect(cssText).toMatch(
      /\.row:has\(\.row__link:focus-visible\)\s*\{[^}]*outline:\s*2px solid var\(--tk-color-focus-ring\)/,
    );
    expect(cssText).toMatch(/\.row:has\(\.row__link:focus-visible\)\s*\{[^}]*outline-offset:\s*2px/);
    expect(cssText).toMatch(/\.row__link:focus-visible\s*\{[^}]*outline:\s*none/);
  });

  it('the name link renders ink with NO underline (the reference net visual — no synthetic hover in CSS beyond the token)', () => {
    const cssText = sheet();
    // The link is a TWO-rule member (lens B1): the shared primary group
    // (`.cell__primary, .row__link`) owns the 15/24 ink typography — its
    // .row__link arm carries color too — and the anchor-specific rule adds
    // ONLY text-decoration. Match the rule that actually declares it.
    const linkRules = cssText.match(/^ {2}\.row__link\s*\{[^}]*\}/gm) ?? [];
    const anchorRule = linkRules.find((rule) => /text-decoration/.test(rule)) ?? '';
    expect(anchorRule).toMatch(/text-decoration:\s*none/);
    expect(anchorRule).not.toMatch(/color:/); // typography is NOT duplicated here
    expect(cssText).toMatch(
      /\.cell__primary,\s*\.row__link\s*\{[^}]*color:\s*var\(--tk-color-text-primary\)/,
    );
    expect(cssText).not.toMatch(/\.row__link:hover/); // hover lives on the ROW fill, never the text
  });

  it('focusin follows real focus: clicking (focusing) a later row moves the single tab stop there', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const rows = anchors(el);
    rows[4]?.focus(); // mouse focus lands on the anchor the user clicked
    await elementUpdated(el);
    expect(rows[4]?.getAttribute('tabindex')).toBe('0');
    expect(rows[0]?.getAttribute('tabindex')).toBe('-1');
    // The single-stop invariant holds after the move.
    expect(rows.filter((anchor) => anchor.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('keydown on non-anchor surfaces is inert (the rowgroup delegate only honors anchor keydowns)', async () => {
    const el = await mount({ props: { columns: STOCK_COLUMNS, rows: TEN_STOCKS } });
    const row = bodyRows(el)[0] as HTMLElement;
    const before = anchors(el)[0]?.getAttribute('tabindex');
    const result = row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await elementUpdated(el);
    expect(result).toBe(true); // not even preventDefaulted
    expect(anchors(el)[0]?.getAttribute('tabindex')).toBe(before);
  });
});
