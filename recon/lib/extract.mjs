// Extraction layer (spec 25.1 AC3/AC4): read the unpacked tarball and distill
// the machine-readable surface — package.json (exports/peers), Custom Elements
// Manifest, .d.ts inventory, token files, README. Everything here is PURE
// (strings/objects in, objects out) so the unit tests cover it without
// touching the network or the filesystem.

/** CEM declaration kinds that represent web components. */
const COMPONENT_KIND = new Set(['class', 'element', 'mixin']);

/**
 * Normalize a Custom Elements Manifest into the snapshot component list.
 * Tolerant by design: CEM field shapes drift between analyzers, so every
 * read is optional and losses are reported (not silently dropped).
 *
 * @param {any} cem parsed custom-elements.json
 * @returns {{components: Array<{name: string, tag: string | null, props: string[], events: string[], slots: string[]}>, notes: string[]}}
 */
export function parseCem(cem) {
  const notes = [];
  const components = [];
  if (!cem || !Array.isArray(cem.modules)) {
    return { components, notes: ['CEM present but unreadable: no modules[] array'] };
  }
  for (const module of cem.modules) {
    for (const declaration of module.declarations ?? []) {
      if (!COMPONENT_KIND.has(String(declaration.kind))) continue;
      const name = declaration.tagName ?? declaration.name;
      if (!name) continue;
      components.push({
        name: declaration.name ?? null,
        tag: declaration.tagName ?? null,
        props: (declaration.attributes ?? []).map((a) => a.name ?? String(a)),
        events: (declaration.events ?? []).map((e) => e.name ?? String(e)),
        slots: (declaration.slots ?? []).map((s) => s.name ?? String(s)),
      });
    }
  }
  if (components.length === 0) notes.push('CEM parsed but yielded 0 component declarations');
  return { components, notes };
}

/** CSS custom property heuristic: unique `--*` declarations in a stylesheet. */
const CSS_VAR = /--[A-Za-z][\w-]*\s*:/g;

/**
 * Extract custom-property names from stylesheet text (heuristic — recorded
 * as such in the snapshot; not a typed token source).
 *
 * @param {string} cssText
 * @returns {string[]}
 */
export function cssVars(cssText) {
  const found = new Set();
  for (const match of cssText.matchAll(CSS_VAR)) {
    found.add(match[0].slice(0, -1).trim());
  }
  return [...found].sort();
}

/** Token-ish file matchers by name (no content read yet). */
const TOKEN_JSON = /(^|\/)[\w.@-]*tokens?[\w.@-]*\.json$/i;
const THEME_FILE = /(^|\/)[\w.@-]*(theme|theming)[\w.@-]*\.(json|css|less|scss|js|ts)$/i;
/** Theme-named path SEGMENT: `themes/dark.css`, `theming/base.less`. */
const THEME_SEGMENT = /(^|\/)(themes?|theming)\//i;
/** Angular-family component signal: `button.component.d.ts`, `button.directive.d.ts`. */
const DTS_COMPONENT = /(^|\/)([\w.-]+)\.(component|directive)\.d\.ts$/;
/** Stylesheet extensions we scan for the custom-property heuristic. */
const STYLESHEET = /\.(css|less|scss)$/i;

/**
 * Walk an extracted package directory and classify its manifest surface.
 * File effects live here; everything downstream stays pure.
 *
 * @param {string} packageDir extracted package/ root
 * @param {import('node:fs')} fs injected node:fs (tests pass a stub)
 * @returns {Promise<{rootDir: string, packageJson: any, cem: any | null, cemPath: string | null, dtsPaths: string[], dtsComponentPaths: string[], tokenJsonPaths: string[], themePaths: string[], stylesheetPaths: string[], readme: string | null}>}
 */
export async function scanPackage(packageDir, fs) {
  const fsp = fs.promises;
  const files = [];

  async function walk(dir, depth) {
    if (depth > 4) return; // manifests live shallow; deeper is content, not API
    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === 'node_modules') continue;
      const full = joinPath(dir, entry.name);
      if (entry.isDirectory()) await walk(full, depth + 1);
      else if (entry.isFile()) files.push(full);
    }
  }

  await walk(packageDir, 0);

  const rel = (p) => p.slice(packageDir.length + 1);
  const readJson = async (p) => JSON.parse(await fsp.readFile(p, 'utf8'));

  const packageJson = await readJson(joinPath(packageDir, 'package.json'));
  const cemPath = files.find((p) => /(^|\/)custom-elements\.json$/i.test(p));
  const cem = cemPath ? await readJson(cemPath).catch(() => null) : null;

  const dtsPaths = files.filter((p) => /\.d\.ts$/.test(p)).map(rel);
  const dtsComponentPaths = dtsPaths.filter((p) => DTS_COMPONENT.test(p));
  const tokenJsonPaths = files.filter((p) => TOKEN_JSON.test(p)).map(rel);
  const themePaths = files.filter((p) => (THEME_FILE.test(p) || THEME_SEGMENT.test(p)) && !/\.map$/.test(p)).map(rel);
  const stylesheetPaths = files.filter((p) => STYLESHEET.test(p) && !/\.map$/.test(p)).map(rel);
  const readmePath = files.find((p) => /(^|\/)readme\.md$/i.test(p));

  return {
    rootDir: packageDir,
    packageJson,
    cem,
    cemPath: cemPath ? rel(cemPath) : null,
    dtsPaths,
    dtsComponentPaths,
    tokenJsonPaths,
    themePaths,
    stylesheetPaths,
    readme: readmePath ? await fsp.readFile(readmePath, 'utf8').catch(() => null) : null,
  };
}

/** Minimal join to keep this module free of node:path coupling in tests. */
function joinPath(dir, name) {
  return `${dir}/${name}`;
}

/** Hard cap for heuristic token extraction (snapshot bloat guard). */
export const MAX_HEURISTIC_TOKENS = 800;

/**
 * Token extraction from the scanned surface (spec 25.1 AC3): typed
 * `*tokens*.json` files first, custom-property heuristic second.
 *
 * @param {import('./extract.mjs').ScanResult} scan
 * @param {import('node:fs')} fs
 * @returns {Promise<{tokens: Array<{name: string, value: string | null, source: 'tokens-json'|'css-var'}>, notes: string[]}>}
 */
export async function extractTokens(scan, fs) {
  const notes = [];
  const tokens = [];
  for (const relPath of scan.tokenJsonPaths.slice(0, 5)) {
    let parsed;
    try {
      parsed = JSON.parse(await fs.promises.readFile(`${scan.rootDir}/${relPath}`, 'utf8'));
    } catch {
      notes.push(`token json unreadable: ${relPath}`);
      continue;
    }
    // W3C design-tokens shape { token-name: { $value } } or flat { name: value }.
    const flat = flattenTokenJson(parsed, '', 0);
    for (const [name, value] of flat) {
      tokens.push({ name, value, source: 'tokens-json' });
    }
    notes.push(`tokens-json source: ${relPath} (${flat.length} entries)`);
  }
  if (tokens.length === 0 && scan.stylesheetPaths.length > 0) {
    const cssNames = new Set();
    for (const relPath of scan.stylesheetPaths.slice(0, 200)) {
      let text;
      try {
        text = await fs.promises.readFile(`${scan.rootDir}/${relPath}`, 'utf8');
      } catch {
        continue;
      }
      if (text.length > 2_000_000) continue;
      for (const name of cssVars(text)) cssNames.add(name);
    }
    const names = [...cssNames].sort();
    for (const name of names.slice(0, MAX_HEURISTIC_TOKENS)) {
      tokens.push({ name, value: null, source: 'css-var' });
    }
    notes.push(
      names.length > MAX_HEURISTIC_TOKENS
        ? `css-var heuristic: ${MAX_HEURISTIC_TOKENS}/${names.length} kept (capped)`
        : `css-var heuristic: ${names.length} unique names (value-less)`,
    );
  }
  return { tokens, notes };
}

/**
 * Flatten a tokens JSON document into [name, value] pairs (W3C `$value`
 * nesting OR flat maps), depth-capped against pathological inputs.
 *
 * @param {any} node
 * @param {string} prefix
 * @param {number} depth
 * @returns {Array<[string, string | null]>}
 */
export function flattenTokenJson(node, prefix, depth) {
  const out = [];
  if (depth > 4 || node === null || typeof node !== 'object') return out;
  for (const [key, child] of Object.entries(node)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === 'object') {
      if ('$value' in child) {
        out.push([name, typeof child.$value === 'object' ? JSON.stringify(child.$value) : String(child.$value)]);
      } else {
        out.push(...flattenTokenJson(child, name, depth + 1));
      }
    } else if (prefix) {
      // only leaf primitives of a nested doc — a flat top-level map is
      // package metadata, not tokens
      out.push([name, child === null ? null : String(child)]);
    }
  }
  return out;
}
