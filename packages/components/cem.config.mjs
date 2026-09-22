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
 */
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
};
