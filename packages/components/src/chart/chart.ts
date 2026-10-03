import { LitElement, html, nothing, svg } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { chartStyles } from './chart.css.js';

/** One series point — a value plus its optional timestamp label. */
export interface TkChartPoint {
  value: number;
  label?: string;
}

/** The four identity families the chart shares with tk-instrument-hero (22.5). */
export type TkChartTone = 'stock' | 'bond' | 'dark' | 'light';

export const TK_CHART_TONES: readonly TkChartTone[] = [
  'stock',
  'bond',
  'dark',
  'light',
] as const;

/** The internal plot space — the bond-capture canvas measured 536×183. */
const VIEW_W = 536;
const VIEW_H = 183;

/** Instance counter — SVG paint-server ids must stay unique per document. */
let gradientSeq = 0;

const NBSP = ' ';
const MINUS = '−';

const groupInteger = (digits: string): string =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

/**
 * Fixed-decimal RU formatting: grouping NBSP thousands, comma decimals,
 * trailing zeros trimmed («1241,5», «23 035», «82»).
 */
const formatDecimal = (abs: number, decimals: number): string => {
  const [int, frac = ''] = abs.toFixed(decimals).split('.');
  const fracTrimmed = frac.replace(/0+$/, '');
  return groupInteger(int) + (fracTrimmed ? `,${fracTrimmed}` : '');
};

/** Axis value — full until the label overflows, then RU abbreviations. */
const formatAxisValue = (value: number, decimals: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? MINUS : '';
  if (abs >= 1_000_000) return `${sign}${formatDecimal(abs / 1_000_000, 2)} млн`;
  if (abs >= 100_000) return `${sign}${formatDecimal(abs / 1_000, 1)} тыс.`;
  return sign + formatDecimal(abs, decimals);
};

/** Badge value — always full precision, RU convention (never abbreviated). */
const formatFullValue = (value: number): string =>
  (value < 0 ? MINUS : '') + formatDecimal(Math.abs(value), 2);

/** RU plural for «точка/точки/точек» — the aria label reads naturally at any N. */
const pluralPoints = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'точка';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'точки';
  return 'точек';
};

const decimalPlaces = (step: number): number => (String(step).split('.')[1] ?? '').length;

const floorTo = (value: number, step: number): number =>
  Math.floor(value / step + 1e-9) * step;

const ceilTo = (value: number, step: number): number =>
  Math.ceil(value / step - 1e-9) * step;

/** The 1/2/2.5/5 ladder — «человеческие» tick steps at any magnitude. */
const niceStep = (raw: number): number => {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const mantissa = raw / pow;
  const snap = mantissa <= 1 ? 1 : mantissa <= 2 ? 2 : mantissa <= 2.5 ? 2.5 : mantissa <= 5 ? 5 : 10;
  return snap * pow;
};

interface ChartScale {
  lo: number;
  hi: number;
  decimals: number;
  ticks: number[];
}

/**
 * tk-chart — the kit's static SVG price chart (spec 23.1, invest
 * remainder wave, GAP-MAP B1): points in, graphics out — STATELESS (the
 * tk-rating mold). No events, no channels: crosshair, hover tooltips,
 * zoom and live updates are consumer-side by the epic ruling.
 *
 * PIXEL GROUNDING (bond capture .playwright-cli/captures-v4/invest/
 * bond-ru000a0jxts9.png — the one instrument page whose canvas painted
 * into the static shot; the sber/future charts lazy-rendered empty,
 * recorded honestly):
 * - canvas 536×183 (x 228–763) — the viewBox and the default height hook;
 * - area fill = HORIZONTAL→DIAGONAL gradient light-left → dark-right;
 *   the left stop measures EXACTLY `--tk-color-invest-bond-a` (0,158,77)
 *   and the right stop EXACTLY `--tk-color-invest-bond-b` (0,128,62) —
 *   the 22.5 identity stops REUSED, nothing minted (the AC's divergence
 *   clause did not fire);
 * - the series line is pixel-indistinguishable from the fill's top edge
 *   (same family) — the kit strokes it with the tone's DARK stop for
 *   engine-robust reasons (a gradient STROKE needs an url() paint
 *   server per instance); deviation recorded;
 * - in-plot gridlines are not pixel-isolable over the solid fill — the
 *   quiet grid defaults to the kit's border divider tone (deviation
 *   recorded);
 * - the live black value badge is a HOVER tooltip: it never painted in
 *   any static capture (every dark band on the pages is text). The kit's
 *   `badge` is the STATIC last-value pill — geometry pinned to kit pill
 *   conventions, honestly a mint, not a measurement;
 * - the live bond Y-axis renders raw floats («19999999,00000» — the
 *   recorded negative): the kit pins nice 1/2/2.5/5 tick steps, NBSP
 *   grouping, RU comma and тыс./млн abbreviations, ONE convention.
 *
 * The axis labels sit OUTSIDE the plot (right column / bottom row), not
 * in-plot over the fill as live does — AA-safe on both themes (the
 * in-plot seat is the same negative's sibling; deviation recorded).
 *
 * A11y (AC4): the HOST carries role="img" (self-asserted at connect —
 * the React-19 law) with an aria-label derived from the data («График,
 * N точек, последнее значение X», RU comma) or the `label` prop
 * override. The svg itself stays aria-hidden: in-plot title/desc would
 * only duplicate the host label (deviation from the spec letter,
 * recorded). Static by definition — no motion, reduced-motion trivial.
 *
 * @tag tk-chart
 * @attr {Array<{value: number, label?: string}>} points - Series data (property-only — object data never reflects, the data-table mold).
 * @attr {'stock'|'bond'|'dark'|'light'} tone - Identity gradient family (default stock; drives the fill/series defaults).
 * @attr {number} reference - Reference value — the dashed horizontal line; drawn only inside the visible domain.
 * @attr {boolean} badge - Static last-value pill (default off; geometry pinned, honestly a mint — see notes).
 * @attr {number} x-every - Label every Nth x point (default auto: ≤5 labels).
 * @attr {string} label - aria-label override (the derived label covers most cases).
 */
export class TkChart extends LitElement {
  static override readonly styles = [chartStyles];

  /** Series data — property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  points: TkChartPoint[] = [];

  /** Identity gradient family — the fill/series token defaults. */
  @property({ type: String, reflect: true })
  tone: TkChartTone = 'stock';

  /** Reference value — the dashed line; non-finite/outside → not drawn. */
  @property({ type: Number })
  reference?: number;

  /** The static last-value pill (opt-in). */
  @property({ type: Boolean })
  badge = false;

  /** Label every Nth x point; 0/absent → auto (≤5 labels). */
  @property({ type: Number, attribute: 'x-every' })
  xEvery = 0;

  /** aria-label override — replaces the derived label wholesale. */
  @property({ type: String })
  label?: string;

  /** Finite-value view of the series (non-finite points clamp OUT). */
  get #finite(): TkChartPoint[] {
    return (this.points ?? []).filter((p) => Number.isFinite(p?.value));
  }

  /** The display scale: nice steps, 3–5 ticks covering the data. */
  get #scale(): ChartScale | null {
    const pts = this.#finite;
    if (pts.length === 0) return null;
    let min = Math.min(...pts.map((p) => p.value));
    let max = Math.max(...pts.map((p) => p.value));
    if (min === max) {
      min -= 1;
      max += 1;
    }
    let step = niceStep((max - min) / 4);
    let lo = floorTo(min, step);
    let hi = ceilTo(max, step);
    // Too many ticks → climb the SAME nice ladder (never off-ladder):
    // 2→nice(4)=5→nice(10)=10…, so a million-scale range lands on 500k
    // steps («19 / 19,5 / 20 / 20,5 млн»), not 800k ones.
    while ((hi - lo) / step + 1 > 5) {
      step = niceStep(step * 2);
      lo = floorTo(min, step);
      hi = ceilTo(max, step);
    }
    const decimals = decimalPlaces(step);
    const r = 10 ** decimals;
    const round = (v: number): number => Math.round(v * r) / r;
    lo = round(lo);
    hi = round(hi);
    const ticks: number[] = [];
    for (let v = lo; v <= hi + step / 2; v += step) ticks.push(round(v));
    return { lo, hi, decimals, ticks };
  }

  /** x fraction of point i (0..1 across the plot width). */
  #xFraction(index: number, count: number): number {
    return count === 1 ? 0.5 : index / (count - 1);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Self-attributes at CONNECT time (§10 + the React-19 law — the
    // tk-rating idiom).
    this.setAttribute('role', 'img');
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    // The derived label recomputes on data change; harmless on the first
    // pass after connect asserted role.
    if (changed.has('points') || changed.has('label')) {
      if (this.label) {
        this.setAttribute('aria-label', this.label);
        return;
      }
      const pts = this.#finite;
      this.setAttribute(
        'aria-label',
        pts.length === 0
          ? 'График, нет данных'
          : `График, ${pts.length} ${pluralPoints(pts.length)}, последнее значение ${formatFullValue(pts[pts.length - 1].value)}`,
      );
    }
  }

  override render() {
    const pts = this.#finite;
    const scale = this.#scale;
    const gradientId = `tk-chart-fill-${++gradientSeq}`;

    if (pts.length === 0 || scale === null) {
      return html`
        <div class="chart">
          <div class="chart__plot">
            <svg class="chart__svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="none"
              aria-hidden="true"></svg>
          </div>
        </div>
      `;
    }

    const { lo, hi, decimals, ticks } = scale;
    const yFrac = (value: number): number => (value - lo) / (hi - lo);
    const px = (i: number): number => this.#xFraction(i, pts.length) * VIEW_W;
    const py = (value: number): number => VIEW_H - yFrac(value) * VIEW_H;

    // Series geometry.
    const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(2)} ${py(p.value).toFixed(2)}`).join(' ');
    const areaD = `${lineD} L${px(pts.length - 1).toFixed(2)} ${VIEW_H} L${px(0).toFixed(2)} ${VIEW_H} Z`;

    // Inner gridlines only — the top/bottom domain edges stay open (the
    // quiet grid, spec AC2).
    const gridYs = ticks.slice(1, -1);

    // The reference line: finite and strictly inside the visible domain.
    const refY =
      Number.isFinite(this.reference) && this.reference! > lo && this.reference! < hi
        ? py(this.reference!)
        : null;

    // X labels: every Nth point (auto ≤5), always including the last.
    const every = this.xEvery > 0 ? this.xEvery : Math.max(1, Math.ceil(pts.length / 5));
    const labeled = pts
      .map((p, i) => ({ p, i }))
      .filter(({ i }) => i % every === 0 || i === pts.length - 1);

    const last = pts[pts.length - 1];

    return html`
      <div class="chart">
        <div class="chart__main">
          <div class="chart__plot">
            <svg class="chart__svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="${gradientId}" x1="0" y1="1" x2="1" y2="0">
                  <stop class="chart__stop-a" offset="0"></stop>
                  <stop class="chart__stop-b" offset="1"></stop>
                </linearGradient>
              </defs>
              ${gridYs.map(
                (tick) => svg`
                  <line
                    class="chart__grid"
                    x1="0"
                    y1="${py(tick).toFixed(2)}"
                    x2="${VIEW_W}"
                    y2="${py(tick).toFixed(2)}"
                    vector-effect="non-scaling-stroke"
                  ></line>
                `,
              )}
              ${refY !== null
                ? svg`
                    <line
                      class="chart__reference"
                      x1="0"
                      y1="${refY.toFixed(2)}"
                      x2="${VIEW_W}"
                      y2="${refY.toFixed(2)}"
                      vector-effect="non-scaling-stroke"
                    ></line>
                  `
                : nothing}
              ${pts.length === 1
                ? svg`<circle class="chart__dot" cx="${VIEW_W / 2}" cy="${py(last.value).toFixed(2)}" r="3"></circle>`
                : svg`
                    <path class="chart__area" d="${areaD}" style="fill: url(#${gradientId})"></path>
                    <path class="chart__line" d="${lineD}" vector-effect="non-scaling-stroke"></path>
                  `}
            </svg>
            ${this.badge
              ? html`
                  <span
                    class="chart__badge"
                    style="top: ${((1 - yFrac(last.value)) * 100).toFixed(2)}%"
                    aria-hidden="true"
                  >${formatFullValue(last.value)}</span>
                `
              : nothing}
          </div>
          <div class="chart__y" aria-hidden="true">
            ${[...ticks].reverse().map(
              (tick) => html`<span class="chart__y-item">${formatAxisValue(tick, decimals)}</span>`,
            )}
          </div>
        </div>
        <div class="chart__x" aria-hidden="true">
          ${labeled.map(({ p, i }) => {
            const frac = this.#xFraction(i, pts.length) * 100;
            const anchor = i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle';
            return html`
              <span
                class="chart__x-item"
                data-anchor="${anchor}"
                style="${anchor === 'start' ? 'left: 0' : anchor === 'end' ? 'right: 0' : `left: ${frac.toFixed(2)}%`}"
              >${p.label ?? ''}</span>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-chart': TkChart;
  }
}

if (!customElements.get('tk-chart')) {
  customElements.define('tk-chart', TkChart);
}
