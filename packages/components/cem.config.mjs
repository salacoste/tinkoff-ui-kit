/**
 * Custom Elements Manifest config (spec 1.7 / AD-1).
 *
 * `pnpm gen:manifest` (root `pnpm gen`) regenerates `custom-elements.json`
 * at the package root — the committed manifest the React wrapper generator
 * (packages/react/scripts/generate-wrappers.mjs) consumes. Drift is gated by
 * the root `check:gen` script: an API edit without regeneration fails CI.
 *
 * Keys follow the analyzer CLI config (v0.11.0 — plain object, no makeConfig):
 * - `litelement: true` enables the analyzer's Lit plugin, so `@property()`
 *   decorators produce attribute entries with TypeScript types (what wrapper
 *   generation and the docs argTables consume).
 * - Globs cover `src/` only — dist artifacts, stories and tests stay out:
 *   the manifest is the component API, not the package's file list.
 * - `src/overlays/**` is excluded too (spec 2.2): it is a mechanics module,
 *   not an element — the exclusion suppresses its per-module entries from
 *   the manifest. Effect (measured): the module's named re-exports in
 *   `src/index.ts` still surface as js-kind export metadata in the
 *   `src/index.ts` module entry; the wrapper generator ignores everything
 *   but `custom-element-definition` exports, so no wrapper changes. Any
 *   export change still goes through `pnpm gen` + commit.
 * - `dev: true` keeps the dev-mode plugin set on (linking the definition
 *   entries to their declarations).
 * - `plugins: [sortModulesPlugin]` — determinism fix (found at Story 2.5):
 *   the analyzer's module list follows fast-glob's async enumeration order,
 *   which is NOT stable across processes (observed: consecutive `cem analyze`
 *   runs disagreed on module order — select↔segmented-radio/checkbox flipped —
 *   so `check:gen` and tests/gen-drift.test.ts failed on byte drift with
 *   identical sources). The plugin sorts `modules` by path in
 *   packageLinkPhase (the pre-serialization hook), so EVERY invocation —
 *   the package script, the root `pnpm gen`, and the drift test's direct
 *   `cem analyze` exec — emits byte-identical output. This mirrors the
 *   wrapper generator's own tag-name sort (same determinism contract, same
 *   code-unit comparison — locale/ICU-independent).
 */

/** Locale-independent comparator (code-unit), matching generate-wrappers.mjs. */
const byPath = (a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);

const sortModulesPlugin = {
  name: 'sort-manifest-modules',
  // v0.11 hook payload: { customElementsManifest, context } (create.js).
  packageLinkPhase({ customElementsManifest: manifest }) {
    manifest?.modules?.sort(byPath);
  },
};

export default {
  globs: [
    'src/**/*.ts',
    '!src/**/*.stories.ts',
    '!src/**/*.test.ts',
    '!src/overlays/**',
  ],
  outdir: '.',
  litelement: true,
  dev: true,
  plugins: [sortModulesPlugin],
};
