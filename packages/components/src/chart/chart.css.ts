import { css } from 'lit';

/**
 * tk-chart stylesheet — spec 23.1 (invest remainder, GAP-MAP B1).
 *
 * HOOKS (exactly 9, pinned in chart.test.ts — consumer retints without
 * touching kit source):
 * - `--tk-chart-fill-a` / `--tk-chart-fill-b` — the area gradient stops
 *   (light/dark end). Defaults = the tone's `--tk-color-invest-{tone}-{a,b}`
 *   identity stops (22.5) — NOTHING minted: the bond capture measured the
 *   fill stops byte-identical to the existing invest tokens.
 * - `--tk-chart-series` — the polyline stroke. Default = the tone's DARK
 *   stop (engine-robust: a gradient stroke would need a per-instance url()
 *   paint server); live is pixel-indistinguishable from the fill's top
 *   edge — deviation recorded in chart.ts.
 * - `--tk-chart-grid` — the inner horizontal gridlines. Default = the
 *   kit's border divider tone (live's in-plot grid is not pixel-isolable
 *   over the solid fill — deviation recorded).
 * - `--tk-chart-axis` — the Y/X label ink (text-secondary).
 * - `--tk-chart-reference` — the dashed reference line (gray-400).
 * - `--tk-chart-badge-fill` / `--tk-chart-badge-text` — the static
 *   last-value pill (ink-300/white — the kit pill convention; the live
 *   badge is a hover tooltip that never paints in static captures, so
 *   this geometry is a documented mint, not a measurement).
 * - `--tk-chart-height` — the plot height (183px — the bond capture's
 *   literal canvas height).
 *
 * PIXEL GROUNDING (bond capture, .playwright-cli/captures-v4/invest/
 * bond-ru000a0jxts9.png): canvas 536×183; gradient light-left → dark-right
 * ≈ «to top right», kit = 0,1 → 1,0 (horizontal diagonal); left stop
 * EXACTLY `--tk-color-invest-bond-a` (0,158,77), right stop EXACTLY
 * `--tk-color-invest-bond-b` (0,129,62).
 *
 * THEME: zero theme branches (AD-3) — every default routes through a
 * semantic token that already carries its dark remap (border-default,
 * text-secondary); the pill pair is theme-invariant by convention (live
 * black badge on both themes). Tones are IDENTITY, not theme.
 *
 * Static by definition: no transitions, no animations, no reduced-motion
 * clause needed (stateless value-in → graphics-out, the tk-rating mold).
 */
export const chartStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .chart {
    display: flex;
    flex-direction: column;
  }

  .chart__main {
    display: flex;
    align-items: stretch;
    gap: 8px;
  }

  .chart__plot {
    position: relative;
    flex: 1;
    min-width: 0;
    height: var(--tk-chart-height, 183px);
  }

  .chart__svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Inner gridlines only — the domain edges stay open (quiet grid). */
  .chart__grid {
    stroke: var(--tk-chart-grid, var(--tk-color-border-default));
    stroke-width: 1;
  }

  .chart__reference {
    stroke: var(--tk-chart-reference, var(--tk-color-gray-400));
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }

  .chart__line {
    fill: none;
    stroke: var(--tk-chart-series, var(--tk-color-invest-stock-b));
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .chart__dot {
    fill: var(--tk-chart-series, var(--tk-color-invest-stock-b));
  }

  .chart__stop-a {
    stop-color: var(--tk-chart-fill-a, var(--tk-color-invest-stock-a));
  }

  .chart__stop-b {
    stop-color: var(--tk-chart-fill-b, var(--tk-color-invest-stock-b));
  }

  /* The identity tones — same gradient families as tk-instrument-hero (22.5). */
  :host([tone='bond']) .chart__stop-a {
    stop-color: var(--tk-chart-fill-a, var(--tk-color-invest-bond-a));
  }

  :host([tone='bond']) .chart__stop-b {
    stop-color: var(--tk-chart-fill-b, var(--tk-color-invest-bond-b));
  }

  :host([tone='bond']) .chart__line {
    stroke: var(--tk-chart-series, var(--tk-color-invest-bond-b));
  }

  :host([tone='bond']) .chart__dot {
    fill: var(--tk-chart-series, var(--tk-color-invest-bond-b));
  }

  :host([tone='dark']) .chart__stop-a {
    stop-color: var(--tk-chart-fill-a, var(--tk-color-invest-dark-a));
  }

  :host([tone='dark']) .chart__stop-b {
    stop-color: var(--tk-chart-fill-b, var(--tk-color-invest-dark-b));
  }

  :host([tone='dark']) .chart__line {
    stroke: var(--tk-chart-series, var(--tk-color-invest-dark-b));
  }

  :host([tone='dark']) .chart__dot {
    fill: var(--tk-chart-series, var(--tk-color-invest-dark-b));
  }

  :host([tone='light']) .chart__stop-a {
    stop-color: var(--tk-chart-fill-a, var(--tk-color-invest-light-a));
  }

  :host([tone='light']) .chart__stop-b {
    stop-color: var(--tk-chart-fill-b, var(--tk-color-invest-light-b));
  }

  :host([tone='light']) .chart__line {
    stroke: var(--tk-chart-series, var(--tk-color-invest-light-b));
  }

  :host([tone='light']) .chart__dot {
    fill: var(--tk-chart-series, var(--tk-color-invest-light-b));
  }

  /* Y labels — the flex space-between IS the tick ladder (even steps). */
  .chart__y {
    flex: none;
    width: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    height: var(--tk-chart-height, 183px);
  }

  .chart__y-item,
  .chart__x-item {
    color: var(--tk-chart-axis, var(--tk-color-text-secondary));
    font-size: var(--tk-text-body-xs-size, 12px);
    line-height: var(--tk-text-body-xs-leading, 1.45);
    font-weight: var(--tk-text-body-xs-weight, 400);
    white-space: nowrap;
  }

  .chart__y-item {
    line-height: 1;
  }

  /* X labels — under the PLOT column (the y gutter is excluded). */
  .chart__x {
    position: relative;
    margin-top: 6px;
    margin-right: 56px;
    min-height: 16px;
  }

  .chart__x-item {
    position: absolute;
    top: 0;
  }

  .chart__x-item[data-anchor='middle'] {
    transform: translateX(-50%);
  }

  /* The static last-value pill (opt-in; geometry = kit pill conventions). */
  .chart__badge {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    background: var(--tk-chart-badge-fill, var(--tk-color-ink-300));
    color: var(--tk-chart-badge-text, var(--tk-color-white));
    font-size: var(--tk-text-body-s-size, 13px);
    line-height: 1;
    font-weight: var(--tk-text-body-s-bold-weight, 500);
    padding: 5px 10px;
    border-radius: 14px;
    white-space: nowrap;
  }
`;
