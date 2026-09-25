/**
 * Typed surface of generate.mjs for importers (tests). The implementation lives
 * in the .mjs sibling — this declaration keeps strict type-checking working for
 * modules that import the renderer.
 */

/** Render the three committed artifact bodies from DESIGN.md text (pure — no fs access). */
export declare function renderArtifacts(designText: string): {
  tokensCss: string;
  tokensTs: string;
  tokensMd: string;
};

/**
 * The literal (non-AA) design-intent annotations — exported for the story-9.2
 * migration self-checks in tests/tokens-drift.test.ts (no literal may be
 * AA-bearing or double-sourced with the `aa-annotations:` block).
 */
export declare const TOKEN_NOTE_LITERALS: ReadonlyMap<string, string>;
