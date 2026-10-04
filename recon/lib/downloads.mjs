// Downloads layer (spec 25.2 AC3): npm downloads API over the curl
// transport. Every npm kit gets the `point/last-month` number; the anchor
// kit additionally gets a daily range series (release-cadence correlation
// fodder for 25.4). Pure helper `sumRange` is unit-tested hermetically.

import { httpJson } from './http.mjs';

const DOWNLOADS = 'https://api.npmjs.org/downloads';

/**
 * @typedef {{ok: true, downloads: number, start: string, end: string}} PointResult
 * @typedef {{ok: false, error: string}} PointError
 */

/**
 * Last-30-day downloads for a package.
 *
 * @param {string} pkg npm name
 * @returns {Promise<PointResult | PointError>}
 */
export async function downloadsLastMonth(pkg) {
  try {
    const { status, json } = await httpJson(`${DOWNLOADS}/point/last-month/${pkg}`);
    if (status !== 200 || !json) return { ok: false, error: `HTTP ${status}` };
    return { ok: true, downloads: json.downloads ?? 0, start: json.start ?? null, end: json.end ?? null };
  } catch (error) {
    return { ok: false, error: String(error?.message ?? error) };
  }
}

/**
 * Daily downloads series for [from, to] (ISO dates, inclusive).
 *
 * @param {string} pkg
 * @param {string} from YYYY-MM-DD
 * @param {string} to YYYY-MM-DD
 * @returns {Promise<{ok: true, start: string, end: string, series: Array<{day: string, downloads: number}>, total: number} | {ok: false, error: string}>}
 */
export async function downloadsRange(pkg, from, to) {
  try {
    const { status, json } = await httpJson(`${DOWNLOADS}/range/${from}:${to}/${pkg}`);
    if (status !== 200 || !json) return { ok: false, error: `HTTP ${status}` };
    const series = json.downloads ?? [];
    return { ok: true, start: json.start ?? from, end: json.end ?? to, series, total: sumRange(series) };
  } catch (error) {
    return { ok: false, error: String(error?.message ?? error) };
  }
}

/**
 * Total a daily series (records may have gaps; missing days are absent,
 * not zero — the total is what the API returned rows for).
 *
 * @param {Array<{downloads: number}>} rows
 * @returns {number}
 */
export function sumRange(rows) {
  return rows.reduce((acc, row) => acc + (Number(row.downloads) || 0), 0);
}
