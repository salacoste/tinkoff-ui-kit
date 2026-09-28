import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Story 15.2 generated-layer anchors (the bank 1.1 mold, second instance):
 * the scaffold marker is GONE (replaced wholesale by the generated table), the
 * stylesheet declares the real `--tj-*` light layer on `:host, :root` with the
 * dual-emission dark contract underneath, and the programmatic entry re-exports
 * the generated typed maps. Structural pins live here; byte-identity against a
 * fresh render lives in tests/tj-tokens-drift.test.ts, contrast truth in
 * tests/tj-contrast.test.ts.
 */
describe('pillkit-tj-tokens generated layer (story 15.2)', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

  it('replaced the scaffold marker wholesale — no placeholder survives', () => {
    expect(css).not.toContain('--tj-scaffold-placeholder');
  });

  it('declares the light layer on :host, :root (shadow-root channel included)', () => {
    expect(css).toContain(':host,\n:root {');
    expect(css).toContain('--tj-color-ink-100: #000000;');
    expect(css).toContain('--tj-font-ui:');
    expect(css).toContain('--tj-font-reading:');
  });

  it('dual-emits the dark layer: attribute override AND the native auto leg', () => {
    expect(css).toContain(':host([data-tj-theme="dark"]),\n:root[data-tj-theme="dark"] {');
    expect(css).toContain('@media (prefers-color-scheme: dark) {');
    expect(css).toContain(':root:not([data-tj-theme="light"]) {');
    // The auto leg must be suppressible — `light` appears ONLY in :not() forms.
    const bareLight = css.replaceAll(':not([data-tj-theme="light"])', '').match(/\[data-tj-theme="light"\]/);
    expect(bareLight).toBeNull();
  });

  it('exports the generated typed maps (programmatic access, the bank mold)', async () => {
    const mod = await import('./index.js');
    expect(Object.keys(mod).length).toBeGreaterThan(0);
    expect(mod.colorTokens['--tj-color-card']).toBe('#FFFFFF');
    expect(mod.darkColorTokens['--tj-color-card']).toBe('#20232A');
  });
});
