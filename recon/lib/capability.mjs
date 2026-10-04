// Capability matrix (spec 25.1 AC7): what machine-readable artifact does each
// roster candidate actually publish? Probes the jsDelivr file-listing API —
// a flat manifest of the published tarball — so the matrix costs one small
// request per candidate instead of a full tarball download. Transport rides
// the curl layer (lib/http.mjs).

import { httpJson } from './http.mjs';

const JSDELIVR = 'https://data.jsdelivr.com/v1/package/npm';

/**
 * @typedef {{ok: true, files: Array<{name: string, size: number}>}} FlatListing
 * @typedef {{ok: false, error: string}} FlatError
 */

/**
 * Fetch the flat file listing for a package (latest version by default).
 *
 * @param {string} pkg npm name
 * @param {string} [version]
 * @returns {Promise<FlatListing | FlatError>}
 */
export async function flatListing(pkg, version) {
  try {
    const { status: tagStatus, json: tags } = await httpJson(`${JSDELIVR}/${pkg}`);
    if (tagStatus !== 200 || !tags) return { ok: false, error: `HTTP ${tagStatus}` };
    const resolved = version ?? tags.tags?.latest ?? tags.versions?.at(-1);
    if (!resolved) return { ok: false, error: 'no resolvable version' };
    const { status: flatStatus, json: flat } = await httpJson(`${JSDELIVR}/${pkg}@${resolved}/flat`);
    if (flatStatus !== 200 || !flat) return { ok: false, error: `HTTP ${flatStatus} (flat)` };
    return { ok: true, files: flat.files ?? [] };
  } catch (error) {
    return { ok: false, error: String(error?.message ?? error) };
  }
}

/** Theme signal: theme-named filename OR theme-named path segment. */
const THEME_SIGNAL = /(^|\/)[\w.@-]*(theme|theming)[\w.@-]*\.(json|css|less|scss|js|ts)$|(^|\/)(themes?|theming)\//i;

/**
 * Classify one listing into the matrix row.
 *
 * @param {string} id
 * @param {FlatListing | FlatError} listing
 */
export function classifyListing(id, listing) {
  if (!listing.ok) return { id, reachable: false, error: listing.error, cem: false, dts: 0, tokensJson: 0, themes: 0, stylesheets: 0 };
  const files = listing.files.map((f) => f.name);
  const has = (re) => files.some((name) => re.test(name));
  return {
    id,
    reachable: true,
    error: null,
    cem: has(/(^|\/)custom-elements\.json$/),
    dts: files.filter((name) => /\.d\.ts$/.test(name)).length,
    tokensJson: files.filter((name) => /(^|\/)[\w.@-]*tokens?[\w.@-]*\.json$/i.test(name)).length,
    themes: files.filter((name) => THEME_SIGNAL.test(name) && !/\.map$/.test(name)).length,
    stylesheets: files.filter((name) => /\.(css|less|scss)$/.test(name)).length,
  };
}

/**
 * Render the matrix as the committed `recon/capability.md` document.
 *
 * @param {Array<ReturnType<typeof classifyListing>>} rows
 * @param {string} generatedAt
 */
export function renderCapabilityDoc(rows, generatedAt) {
  const header = [
    '# Kit-recon capability matrix (spec 25.1 AC7)',
    '',
    `Generated ${generatedAt} from jsDelivr flat listings (no tarballs downloaded).`,
    'Legend: CEM = custom-elements.json in the published package; d.ts = type',
    'declaration inventory; tokens-json = typed token files; themes = theme-',
    'named files; stylesheets = .css/.less/.scss count. Reachable=no means the',
    'candidate is not consumable via npm metadata at all (repo-only).',
    '',
    '| kit | reachable | CEM | d.ts | tokens-json | themes | stylesheets | note |',
    '|---|---|---|---|---|---|---|---|',
  ];
  const lines = rows.map((row) =>
    `| ${row.id} | ${row.reachable ? 'yes' : '**no**'} | ${row.cem ? 'yes' : 'no'} | ${row.dts} | ${row.tokensJson} | ${row.themes} | ${row.stylesheets} | ${row.error ?? ''} |`,
  );
  return [...header, ...lines, ''].join('\n');
}
