import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { renderArtifacts } from '../packages/tj-tokens/scripts/generate.mjs';

/**
 * ТЖ token-pipeline drift guard (story 15.2 — the bank 1.2 review mold, second
 * instance): the ТЖ DESIGN.md is the sole source of truth for the `--tj-*`
 * layer, and nothing may hand-edit the artifacts. This suite renders the real
 * DESIGN.md through the imported ТЖ CLI renderer (the root shared core with the
 * ТЖ config) and asserts each artifact body equals the committed file; it also
 * pins the dark-contract selector SHAPES (dual emission — attribute override +
 * native auto leg with the no-flash :not([data-tj-theme="light"]) suppression)
 * so a renderer edit that reshapes the contract fails loudly. `pnpm
 * check:tokens-drift:tj` covers the same invariant for CLI/ci use.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DESIGN_MD = join(
  REPO_ROOT,
  '_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md',
);
const ARTIFACTS = {
  tokensCss: join(REPO_ROOT, 'packages/tj-tokens/src/tokens.css'),
  tokensTs: join(REPO_ROOT, 'packages/tj-tokens/src/tokens.ts'),
  tokensMd: join(REPO_ROOT, 'packages/tj-tokens/src/TOKENS.md'),
} as const;

describe('ТЖ token-pipeline drift (story 15.2)', () => {
  it('committed artifacts equal a fresh render of the ТЖ DESIGN.md', () => {
    const artifacts = renderArtifacts(readFileSync(DESIGN_MD, 'utf8'));
    for (const [key, path] of Object.entries(ARTIFACTS)) {
      expect(artifacts[key as keyof typeof ARTIFACTS], `${path} drifted from DESIGN.md`).toBe(
        readFileSync(path, 'utf8'),
      );
    }
  });

  it('renders deterministically (same input, byte-identical output)', () => {
    const design = readFileSync(DESIGN_MD, 'utf8');
    expect(renderArtifacts(design)).toEqual(renderArtifacts(design));
  });

  it('replaced the scaffold marker wholesale — no placeholder survives', () => {
    const css = readFileSync(ARTIFACTS.tokensCss, 'utf8');
    expect(css).not.toContain('--tj-scaffold-placeholder');
  });

  it('dual-emits the dark layer: attribute override AND native auto leg, identical declarations', () => {
    const css = readFileSync(ARTIFACTS.tokensCss, 'utf8');
    // Attribute leg (the manual-flip channel).
    expect(css).toContain(':host([data-tj-theme="dark"]),\n:root[data-tj-theme="dark"] {');
    // Native auto leg (EXPERIENCE.md): OS dark applies unless light is forced.
    expect(css).toContain('@media (prefers-color-scheme: dark) {\n:host(:not([data-tj-theme="light"])),\n:root:not([data-tj-theme="light"]) {');
    // The auto leg rides AFTER the attribute leg (source order fixed by the
    // renderer; the contract comment reads top-down).
    const attributeLeg = css.indexOf(':root[data-tj-theme="dark"] {');
    const autoLeg = css.indexOf('@media (prefers-color-scheme: dark) {');
    expect(autoLeg).toBeGreaterThan(attributeLeg);
    // The no-flash contract: `light` appears ONLY inside :not() suppressors —
    // never as a standalone [data-tj-theme="light"] rule.
    const bareLight = css.replaceAll(':not([data-tj-theme="light"])', '').match(/\[data-tj-theme="light"\]/);
    expect(bareLight).toBeNull();
    // Identical override declarations in both legs: extract each rule body and
    // compare the `--tj-color-*` declaration lines token-for-token.
    const declarationLines = (from: number): string[] => {
      const opened = css.indexOf('{', from);
      const closed = css.indexOf('}', opened);
      return css
        .slice(opened + 1, closed)
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('--tj-'));
    };
    expect(declarationLines(autoLeg)).toEqual(declarationLines(attributeLeg));
  });

  it('keeps the reduced-motion collapse theme-independent (0ms re-declarations)', () => {
    const css = readFileSync(ARTIFACTS.tokensCss, 'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce) {');
    expect(css).toMatch(/--tj-motion-duration-slow: 0ms;/);
  });

  it('renderer fails loudly on a dark palette key with no disposition (negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "  dark-page: '#12151C'",
      "  dark-page: '#12151C'\n  dark-foo: '#123456'",
    );
    expect(mutated, 'mutation did not apply — the dark-page anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/dark-foo/);
  });

  it('renderer fails loudly on a malformed color value (negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace("  dark-page: '#12151C'", "  dark-page: 'not-a-color'");
    expect(mutated, 'mutation did not apply — the dark-page anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow();
  });

  it('renderer fails loudly when a dark override loses its light target (negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    // cta-fill is a dark-override target; removing its light declaration must
    // abort (the dark layer re-declares names, it never introduces them).
    const mutated = original.replace("  cta-fill: '#333333'\n", '');
    expect(mutated, 'mutation did not apply — the cta-fill anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/--tj-color-cta-fill/);
  });
});
