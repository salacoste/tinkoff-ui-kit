/**
 * Custom Elements Manifest config — ТЖ input (story 16.1; the AD-1 v5
 * second instance of the bank's packages/components/cem.config.mjs mold).
 *
 * `pnpm gen:manifest` (root `pnpm gen`) regenerates `custom-elements.json`
 * at the package root — the committed manifest the ТЖ wrapper generator
 * (packages/tj-react/scripts/generate.mjs → scripts/wrapper-gen/core.mjs)
 * consumes. Drift is gated by the root `check:gen` script: an API edit
 * without regeneration fails CI (the same gate as the bank family).
 *
 * Keys follow the analyzer CLI config (v0.11.0 — plain object, no makeConfig),
 * identical in meaning to the bank config:
 * - `litelement: true` enables the analyzer's Lit plugin, so `@property()`
 *   decorators produce attribute entries with TypeScript types (what wrapper
 *   generation and the future docs argTables consume).
 * - Globs cover `src/` only — dist artifacts, stories and tests stay out:
 *   the manifest is the component API, not the package's file list. No
 *   `overlays`-style mechanics-module exclusion yet — the ТЖ roster has no
 *   non-element module to exclude (the AD-12 overlay helper, when it lands,
 *   re-opens this list deliberately).
 * - `dev: true` keeps the dev-mode plugin set on (linking the definition
 *   entries to their declarations).
 * - `plugins: [sortModulesPlugin]` — the determinism fix carried from the
 *   bank mold (its story 2.5 finding): the analyzer's module list follows
 *   fast-glob's async enumeration order, which is NOT stable across
 *   processes. The plugin sorts `modules` by path in packageLinkPhase (the
 *   pre-serialization hook), so EVERY invocation emits byte-identical
 *   output — the same determinism contract the wrapper generator's own
 *   tag-name sort enforces (code-unit comparison, locale/ICU-independent).
 */

/** Locale-independent comparator (code-unit), matching wrapper-gen/core.mjs. */
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
  ],
  outdir: '.',
  litelement: true,
  dev: true,
  plugins: [sortModulesPlugin],
};
