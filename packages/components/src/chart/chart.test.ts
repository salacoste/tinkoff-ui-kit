// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkChart } from './chart.js';
import type { TkChartPoint } from './chart.js';

/**
 * tk-chart unit tests (spec 23.1): the scale math (nice 1/2/2.5/5 steps,
 * 3–5 ticks, degenerate-range expansion, non-finite clamping), the RU
 * axis formatter (NBSP grouping, comma decimals, тыс./млн abbreviations,
 * trailing-zero trim), the reference-line gating, the optional badge
 * pill, the host-carried img semantics (derived aria-label with correct
 * RU plurals), the stateless ruling (nothing interactive, nothing
 * dispatchable) and the structural CSS pins (the 9-hook layer with
 * token defaults, tone families, hidden guard, no motion).
 */

const NBSP = ' ';

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkChart): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkChart> => {
  const el = new TkChart();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const yItems = (el: TkChart): string[] =>
  [...el.shadowRoot!.querySelectorAll('.chart__y-item')].map((n) => n.textContent ?? '');

const xItems = (el: TkChart): string[] =>
  [...el.shadowRoot!.querySelectorAll('.chart__x-item')].map((n) => n.textContent ?? '');

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkChart.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

const GROWING: TkChartPoint[] = [
  { value: 101.2, label: '10:00' },
  { value: 102.1, label: '11:00' },
  { value: 101.8, label: '12:00' },
  { value: 103.4, label: '13:00' },
  { value: 104.0, label: '14:00' },
  { value: 103.6, label: '15:00' },
  { value: 105.2, label: '16:00' },
];

const FRACTIONAL: TkChartPoint[] = [
  { value: 82.1 },
  { value: 82.5 },
  { value: 82.9 },
];

const THOUSANDS: TkChartPoint[] = [
  { value: 23_031 },
  { value: 23_035 },
  { value: 23_039 },
];

const MILLIONS: TkChartPoint[] = [
  { value: 19_430_000 },
  { value: 19_760_000 },
  { value: 20_120_000 },
];

describe('tk-chart', () => {
  it('registers as tk-chart exposing TkChart', async () => {
    await customElements.whenDefined('tk-chart');
    expect(customElements.get('tk-chart')).toBe(TkChart);
  });

  it('renders an empty canvas for an empty series, aria announcing no data', async () => {
    const el = await mount({ points: [] });
    expect(el.shadowRoot?.querySelector('.chart__area')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chart__line')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.chart__y-item')).toHaveLength(0);
    expect(el.getAttribute('aria-label')).toBe('График, нет данных');
  });

  it('renders ONE dot (no line, no area) for a single-point series', async () => {
    const el = await mount({ points: [{ value: 98.6, label: '10:00' }] });
    expect(el.shadowRoot?.querySelector('.chart__dot')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.chart__line')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chart__area')).toBeNull();
    expect(el.getAttribute('aria-label')).toBe('График, 1 точка, последнее значение 98,6');
  });

  it('filters non-finite points out before scaling (the clamp never mutates the prop)', async () => {
    const el = await mount({ points: [{ value: 1 }, { value: Number.NaN }, { value: 3 }] });
    expect(el.getAttribute('aria-label')).toContain('2 точки');
    expect(el.points).toHaveLength(3); // the prop keeps the raw array
  });

  it('draws line + gradient area for a healthy series; the area paint rides the url() paint server', async () => {
    const el = await mount({ points: GROWING });
    const line = el.shadowRoot?.querySelector<SVGPathElement>('.chart__line');
    const area = el.shadowRoot?.querySelector<SVGPathElement>('.chart__area');
    expect(line).not.toBeNull();
    expect(area).not.toBeNull();
    expect(area?.getAttribute('style')).toContain('fill: url(#');
    expect(line?.getAttribute('d')).toMatch(/^M\d/);
    // 7 points → 7 M/L segments in the polyline path.
    expect(line?.getAttribute('d')?.split(' ').filter((s) => /^[ML]/.test(s))).toHaveLength(7);
    // NAMESPACE PIN (the first mint's lesson): nested html`` templates
    // committed inside <svg> render as HTML-namespace unknowns — the DOM
    // stays queryable, every attribute lands, unit tests stay green, and
    // NOTHING PAINTS (the whole plot interior was blank in the baseline).
    // Nested shape templates must ride the svg`` tag; this pin fails the
    // day someone converts one back to html``.
    expect(line?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(area?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    const grid = el.shadowRoot?.querySelector('.chart__grid');
    expect(grid?.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('scales to nice integer steps: 4 ticks 100/102/104/106, inner-only gridlines', async () => {
    const el = await mount({ points: GROWING });
    // Reversed column: the TOP label is the highest tick.
    expect(yItems(el)).toEqual(['106', '104', '102', '100']);
    // Gridlines = ticks minus the two domain edges.
    expect(el.shadowRoot?.querySelectorAll('.chart__grid')).toHaveLength(2);
  });

  it('formats fractional ticks with the RU comma and trailing-zero trim', async () => {
    const el = await mount({ points: FRACTIONAL });
    // Range 0.8: the float mantissa (0.20000000000000284) crosses the 2
    // boundary, so the ladder snaps to 2.5×10⁻² = 0.25 — five quarter
    // ticks, every formatter branch exercised (two decimals, one, none).
    expect(yItems(el)).toEqual(['83', '82,75', '82,5', '82,25', '82']);
  });

  it('groups integer thousands with NBSP separators', async () => {
    const el = await mount({ points: THOUSANDS });
    // Range 8: ladder 2→nice(4)=5 → three ticks at 5-unit steps.
    expect(yItems(el)).toEqual([`23${NBSP}040`, `23${NBSP}035`, `23${NBSP}030`]);
  });

  it('abbreviates the million scale to «млн» with comma decimals and trim', async () => {
    const el = await mount({ points: MILLIONS });
    // Range 690k: step 200k covers lo 19.4M → hi 20.2M in exactly five
    // ticks — the climb loop never fires.
    expect(yItems(el)).toEqual(['20,2 млн', '20 млн', '19,8 млн', '19,6 млн', '19,4 млн']);
  });

  it('gates the reference line: inside the domain it draws, outside it does not', async () => {
    const inside = await mount({ points: GROWING, reference: 102 });
    expect(inside.shadowRoot?.querySelector('.chart__reference')).not.toBeNull();

    const outside = await mount({ points: GROWING, reference: 150 });
    expect(outside.shadowRoot?.querySelector('.chart__reference')).toBeNull();

    const garbage = await mount({ points: GROWING, reference: Number.NaN });
    expect(garbage.shadowRoot?.querySelector('.chart__reference')).toBeNull();
  });

  it('renders the badge pill with the FULL value (never abbreviated), aria-hidden as duplicating the label', async () => {
    const el = await mount({ points: MILLIONS, badge: true });
    const badge = el.shadowRoot?.querySelector<HTMLElement>('.chart__badge');
    expect(badge).not.toBeNull();
    expect(badge?.getAttribute('aria-hidden')).toBe('true');
    expect(badge?.textContent).toBe(`20${NBSP}120${NBSP}000`);

    const plain = await mount({ points: MILLIONS });
    expect(plain.shadowRoot?.querySelector('.chart__badge')).toBeNull();
  });

  it('carries role="img" with the derived RU aria-label (correct plurals) that recomputes on data change', async () => {
    const el = await mount({ points: GROWING });
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('График, 7 точек, последнее значение 105,2');

    el.points = FRACTIONAL;
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('График, 3 точки, последнее значение 82,9');
  });

  it('honors the label prop as a wholesale aria-label override', async () => {
    const el = await mount({ points: GROWING, label: 'Котировки демо-индекса, 7 сессий' });
    expect(el.getAttribute('aria-label')).toBe('Котировки демо-индекса, 7 сессий');
  });

  it('labels x points every Nth (auto ≤5 labels, last always included) with anchored edges', async () => {
    const el = await mount({ points: GROWING });
    expect(xItems(el)).toEqual(['10:00', '12:00', '14:00', '16:00']); // every=2 auto, last included
    const anchors = [...el.shadowRoot!.querySelectorAll('.chart__x-item')].map((n) =>
      (n as HTMLElement).dataset.anchor,
    );
    expect(anchors).toEqual(['start', 'middle', 'middle', 'end']);

    const dense = await mount({
      points: Array.from({ length: 12 }, (_, i) => ({ value: 100 + i, label: `t${i}` })),
      xEvery: 3,
    });
    expect(xItems(dense)).toEqual(['t0', 't3', 't6', 't9', 't11']); // last always
  });

  it('is NOT interactive: no tabindex, no buttons, no dispatchable channel (the stateless ruling)', async () => {
    const el = await mount({ points: GROWING });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1);
    expect(el.shadowRoot?.querySelector('button')).toBeNull();
    expect(el.shadowRoot?.querySelector('[role]')).toBeNull(); // children are presentational
  });

  it('reflects the tone attribute with stock as the default family', async () => {
    const el = await mount({ points: GROWING });
    expect(el.getAttribute('tone')).toBe('stock');

    el.tone = 'bond';
    await elementUpdated(el);
    expect(el.getAttribute('tone')).toBe('bond');
  });

  it('ships the measured surface: EXACTLY nine --tk-chart-* hooks, token defaults, four tone families, hidden guard, no motion (structural)', () => {
    const css = sheetCss();
    // The hook census (spec AC6): exactly nine, all consumed with token
    // defaults — the gradient stops REUSE the 22.5 identity tokens (no
    // mint: the bond capture measured them byte-identical).
    const hooks = new Set(css.match(/--tk-chart-[a-z0-9-]+/g));
    expect(hooks.size).toBe(9);
    for (const hook of hooks) expect(css).toContain(`var(${hook},`); // no orphan declarations
    expect(css).toContain('stop-color: var(--tk-chart-fill-a, var(--tk-color-invest-stock-a))');
    expect(css).toContain('stop-color: var(--tk-chart-fill-b, var(--tk-color-invest-bond-b))');
    expect(css).toContain('stroke: var(--tk-chart-series, var(--tk-color-invest-stock-b))');
    expect(css).toContain('stroke: var(--tk-chart-grid, var(--tk-color-border-default))');
    expect(css).toContain('stroke: var(--tk-chart-reference, var(--tk-color-gray-400))');
    expect(css).toContain('color: var(--tk-chart-axis, var(--tk-color-text-secondary))');
    expect(css).toContain('background: var(--tk-chart-badge-fill, var(--tk-color-ink-300))');
    expect(css).toContain('color: var(--tk-chart-badge-text, var(--tk-color-white))');
    expect(css).toContain('height: var(--tk-chart-height, 183px)');
    // The four identity families (the tk-instrument-hero mold).
    for (const tone of ['bond', 'dark', 'light']) {
      expect(css).toContain(`:host([tone='${tone}'])`);
    }
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no motion of its own (static by definition).
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });
});
