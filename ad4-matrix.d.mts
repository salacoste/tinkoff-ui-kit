/**
 * Type twin for ad4-matrix.mjs (story 9.2) — types only, no runtime. The
 * runtime shape-assert in tests/import-boundaries.test.ts pins this twin to
 * the module: every runtime export is declared here and vice versa, so a
 * matrix edit with a stale twin fails a gate, not a review.
 */

/** Workspace package directories, dependency order (AD-4 layering). */
export declare const PACKAGE_DIRS: readonly `packages/${string}`[];

/** Per-package allowed `pillkit-*` specifiers (AD-4 allowed directions). */
export declare const ALLOWED_SPECIFIERS: Readonly<Record<string, readonly string[]>>;

/** Per-package scan roots for the boundary test's source walk. */
export declare const SCAN_ROOTS: Readonly<Record<string, readonly string[]>>;

/** Source file extensions both nets restrict. */
export declare const FILE_TYPES: readonly string[];

/** The canonical allowed-directions string every consumer embeds verbatim. */
export declare const CANONICAL_DIRECTIONS: string;

/** Every workspace package forbidden to `packageDir` as bare-import groups. */
export declare function forbiddenGroups(packageDir: string): string[];

/** Relative-escape restriction regex source; `null` = nothing forbidden. */
export declare function escapeRegexSource(packageDir: string): string | null;
