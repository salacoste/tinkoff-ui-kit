/**
 * Typed surface of generate.mjs for importers (tests). The implementation lives
 * in the .mjs sibling (the root shared core + the ТЖ config) — this declaration
 * keeps strict type-checking working for modules that import the renderer.
 */

/** Render the three committed ТЖ artifact bodies from DESIGN.md text (pure — no fs access). */
export declare function renderArtifacts(designText: string): {
  tokensCss: string;
  tokensTs: string;
  tokensMd: string;
};
