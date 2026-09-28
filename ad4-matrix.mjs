/**
 * AD-4 import-boundary matrix — the SINGLE SOURCE (story 9.2; closes the
 * spec-1.1 deferred debt: the matrix used to live in three hand-maintained
 * copies that already diverged once on file-type/docs coverage).
 *
 * Consumers — all DERIVE from this module, none hand-copy:
 *   - eslint.config.js builds its `no-restricted-imports` blocks from it
 *     (fast net: specifier shape; messages embed CANONICAL_DIRECTIONS)
 *   - tests/import-boundaries.test.ts scans the workspace sources against it
 *     (precise net: path resolution; covers docs `.storybook`)
 *   - README pins the canonical directions line (test-pinned verbatim)
 *
 * AD-4 record of record: ARCHITECTURE-SPINE.md (planning artifact — intent
 * record, deliberately NOT machine-edited; this module is its executable twin).
 * File types and scan roots are defined HERE once, so the 1.1 divergence class
 * (eslint missing docs/.storybook and file-type coverage) is structurally
 * impossible: every consumer shares one definition.
 *
 * Story 15.1 (AD-4 v5 — parallel lanes): the ТЖ family joins the matrix as
 * its own lane (tj-tokens → tj-components → tj-react) with docs composing
 * BOTH families. The FR-17 edge (families runtime-disjoint) is DERIVED here
 * too: a new workspace package enters every consumer's restriction
 * automatically, so tj→bank and bank→tj imports are forbidden by the same
 * single-source derivation — the restriction messages name FR-17 via
 * FR17_MESSAGE/fr17Groups below.
 */

/** Workspace package directories, dependency order (AD-4 layering). */
export const PACKAGE_DIRS = [
  'packages/tokens',
  'packages/components',
  'packages/react',
  'packages/tj-tokens',
  'packages/tj-components',
  'packages/tj-react',
  'packages/docs',
];

/**
 * Per-package allowed `pillkit-*` specifiers (AD-4 allowed directions).
 * tokens and tj-tokens are each their lane's root: nothing allowed.
 */
export const ALLOWED_SPECIFIERS = {
  'packages/tokens': [],
  'packages/components': ['pillkit-tokens'],
  'packages/react': ['pillkit-components'],
  'packages/tj-tokens': [],
  'packages/tj-components': ['pillkit-tj-tokens'],
  'packages/tj-react': ['pillkit-tj-components'],
  // docs may import every kit package of BOTH families (AD-4 v5).
  'packages/docs': [
    'pillkit-react',
    'pillkit-components',
    'pillkit-tokens',
    'pillkit-tj-react',
    'pillkit-tj-components',
    'pillkit-tj-tokens',
  ],
};

/**
 * Per-package scan roots — the boundary test's ONE net covers docs
 * `.storybook` (the Storybook config dir imports workspace packages and must
 * not sit outside the matrix walk).
 */
export const SCAN_ROOTS = {
  'packages/tokens': ['src'],
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/tj-tokens': ['src'],
  'packages/tj-components': ['src'],
  'packages/tj-react': ['src'],
  'packages/docs': ['src', '.storybook'],
};

/** Source file extensions both nets restrict (eslint globs + test walker). */
export const FILE_TYPES = ['ts', 'tsx'];

/** The canonical allowed-directions string — every consumer embeds it verbatim. */
export const CANONICAL_DIRECTIONS =
  'components→tokens, react→components, tj-components→tj-tokens, tj-react→tj-components, docs→{react, components, tokens, tj-react, tj-components, tj-tokens}';

const packageNameOf = (packageDir) => `pillkit-${packageDir.split('/')[1]}`;

const allowedOf = (packageDir) => ALLOWED_SPECIFIERS[packageDir] ?? [];

/**
 * Every workspace package forbidden to `packageDir` as bare-import groups:
 * all pillkit-* minus self minus allowed (derived — a new workspace package
 * enters every consumer's restriction automatically).
 */
export function forbiddenGroups(packageDir) {
  const self = packageNameOf(packageDir);
  const allowed = new Set(allowedOf(packageDir));
  const groups = [];
  for (const pkg of PACKAGE_DIRS.map(packageNameOf)) {
    if (pkg === self || allowed.has(pkg)) continue;
    groups.push(pkg, `${pkg}/**`);
  }
  return groups;
}

/**
 * Relative-escape restriction regex source for `packageDir` (eslint shape
 * net). `null` = nothing forbidden (no restriction block). When EVERY other
 * package is forbidden (tokens), any parent-relative escape leaves the
 * package — the shape itself is banned; otherwise the banned target dirs are
 * named. The precise path-resolution check lives in the boundary test.
 */
export function escapeRegexSource(packageDir) {
  const self = packageNameOf(packageDir);
  const allowed = new Set(allowedOf(packageDir));
  const forbiddenDirs = PACKAGE_DIRS.filter((dir) => {
    const pkg = packageNameOf(dir);
    return pkg !== self && !allowed.has(pkg);
  }).map((dir) => dir.split('/')[1]);
  if (forbiddenDirs.length === 0) return null;
  if (forbiddenDirs.length === PACKAGE_DIRS.length - 1) return String.raw`^\.\./`;
  return `^(\\.\\./)+(${forbiddenDirs.join('|')})(/|$)`;
}

/**
 * FR-17 (story 15.1 / PRD §4.9): the bank and ТЖ families are
 * runtime-disjoint — a shippable package of one family may not import a
 * shippable package of the other. docs is workspace-internal tooling and
 * composes both, so it belongs to neither family. The restriction blocks
 * embed FR17_MESSAGE whenever fr17Groups() is non-empty for the package.
 */
const FAMILY_DIRS = {
  bank: ['packages/tokens', 'packages/components', 'packages/react'],
  tj: ['packages/tj-tokens', 'packages/tj-components', 'packages/tj-react'],
};

export const FR17_MESSAGE =
  'FR-17: the ТЖ family has zero runtime dependency on the bank family — and vice versa (docs composes both)';

/**
 * Cross-family workspace package names forbidden to `packageDir`, as
 * bare-import groups (derived from PACKAGE_DIRS/ALLOWED_SPECIFIERS — a
 * future family edge lands here with zero consumer edits). Empty for docs
 * and for packages whose allowed set already covers the other family.
 */
export function fr17Groups(packageDir) {
  const ownFamily = Object.keys(FAMILY_DIRS).find((family) => FAMILY_DIRS[family].includes(packageDir));
  if (ownFamily === undefined) return [];
  const allowed = new Set(allowedOf(packageDir));
  const otherFamily = ownFamily === 'bank' ? 'tj' : 'bank';
  const groups = [];
  for (const dir of FAMILY_DIRS[otherFamily]) {
    const pkg = packageNameOf(dir);
    if (allowed.has(pkg)) continue;
    groups.push(pkg, `${pkg}/**`);
  }
  return groups;
}
