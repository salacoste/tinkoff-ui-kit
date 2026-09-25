// Flat ESLint config — typescript-eslint recommended + the AD-4 import-boundary matrix.
//
// TypeScript arrangement (per the TS 7.0 side-by-side guidance): `tsc` is the pinned
// TypeScript 7.0.2 native compiler (via the `typescript/native` devDep alias), while the
// `typescript` name resolves to `@typescript/typescript6` — the TS 6 API that
// typescript-eslint requires. Do not "fix" this by removing either alias.
//
// AD-4 (story 9.2): the import matrix is SINGLE-SOURCED in ./ad4-matrix.mjs —
// every restriction block below is BUILT from it (no hand-written directions
// strings; messages embed the module's CANONICAL_DIRECTIONS verbatim). The lint
// regex for relative escapes approximates by specifier shape; the precise
// path-resolution check lives in tests/import-boundaries.test.ts (runs in
// `pnpm test`), which reads the same module.
import tseslint from 'typescript-eslint';

import {
  ALLOWED_SPECIFIERS,
  CANONICAL_DIRECTIONS,
  FILE_TYPES,
  PACKAGE_DIRS,
  SCAN_ROOTS,
  escapeRegexSource,
  forbiddenGroups,
} from './ad4-matrix.mjs';

/** 'packages/components' -> 'components' */
const shortName = (packageDir) => packageDir.split('/')[1];

/** The non-self workspace dirs a package may not reach via `../` escapes. */
const forbiddenDirNames = (packageDir) => [
  ...new Set(forbiddenGroups(packageDir).map((group) => group.replace(/^pillkit-|\/\*\*$/g, ''))),
];

/**
 * Build one package's no-restricted-imports config from the matrix. A package
 * with nothing forbidden (docs: everything allowed) gets no block at all.
 */
const ad4Block = (packageDir) => {
  const groups = forbiddenGroups(packageDir);
  const escape = escapeRegexSource(packageDir);
  if (groups.length === 0 && escape === null) return null;
  const short = shortName(packageDir);
  const allowed = ALLOWED_SPECIFIERS[packageDir];
  const directions = `allowed directions: ${CANONICAL_DIRECTIONS}`;
  const patterns = [];
  if (groups.length > 0) {
    patterns.push({
      group: groups,
      message:
        allowed.length === 0
          ? `AD-4 import boundary: ${short} is the root of the dependency graph and may not import any workspace package (${directions}).`
          : `AD-4 import boundary: ${short} may only import ${allowed.join(', ')} (${directions}).`,
    });
  }
  if (escape !== null) {
    patterns.push({
      regex: escape,
      message:
        escape === '^\\.\\./'
          ? `AD-4 import boundary: ${short} may not reach outside its own package via parent-relative imports (${directions}).`
          : `AD-4 import boundary: ${short} may not reach ${forbiddenDirNames(packageDir).join(' or ')} via relative imports (${directions}).`,
    });
  }
  const extensionGlob = `{${FILE_TYPES.join(',')}}`;
  return {
    files: SCAN_ROOTS[packageDir].map((root) => `${packageDir}/${root}/**/*.${extensionGlob}`),
    rules: {
      'no-restricted-imports': ['error', { patterns }],
    },
  };
};

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '_bmad/**',
      '_bmad-output/**',
      '.claude/**',
      '.impeccable/**',
      '.omc/**',
      '.playwright-cli/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...PACKAGE_DIRS.map(ad4Block).filter((block) => block !== null),
);
