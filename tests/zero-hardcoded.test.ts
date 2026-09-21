import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * FR-1 zero-hard-coded guard (spec 1.2): only @tk-kit/tokens emits raw values.
 * Sources under the per-package scan roots (packages/{components,react}/src,
 * packages/docs/{src,.storybook}) must not contain color literals (hex,
 * rgb()/rgba(), hsl()/hsla()) or z-index declarations with non-token values —
 * everything flows through var(--tk-*) custom properties so theming crosses
 * shadow boundaries (AD-2) and the token pipeline stays the single source of
 * values (AD-3). The tokens package itself is excluded by design: its
 * generated artifacts are where raw values live.
 *
 * Detector precision rules:
 * - Comment mentions are not values — comments are stripped first, preserving
 *   newlines so multi-line blocks cannot shift reported line numbers.
 * - `#` tokens that cannot be colors are masked before hex matching: url(#ref)
 *   fragments, href="#anchor" attributes, and non-hex-shaped CSS id selectors
 *   (#main, #nav — a valid hex color never contains g-z/G-Z/_).
 * - `z-index: var(--tk-z-*)` and values containing var() (incl. calc(var(…)))
 *   are token consumption, not literals, and pass.
 *
 * Walk tripwires keep the scan non-vacuous: a known package with zero scanned
 * non-declaration files fails, an unknown directory under packages/ fails, and
 * a style-bearing file with an unscanned extension
 * (.scss/.less/.html/.vue/.svelte/.jsx/.mdx) inside a scanned root fails — it
 * would otherwise escape this guard entirely.
 *
 * Known blind spot (documented, deliberate): FR-1's letter covers color,
 * radius, shadow, font, and z-index literals — NOT lengths. Hard-coded px
 * paddings/sizes/widths are not flagged; authored surfaces should still prefer
 * the --tk-space-* and --tk-text-* tokens where a value is semantically
 * spacing or type scale. Extending the detector to lengths is a future
 * hardening decision, not part of FR-1 as frozen.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * Per-package scan roots (tokens is excluded — it IS the raw-value layer).
 * Docs scans its Storybook config dir alongside src: the preview decorator CSS
 * lives in .storybook/ and must not sit outside the enforcement net (review
 * finding: a hex in disclaimerStyles shipped green).
 */
const SCAN_ROOTS: Readonly<Record<string, readonly string[]>> = {
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/docs': ['src', '.storybook'],
};
const SCANNED_EXTENSION = /\.(ts|tsx|css)$/;
/** Style-bearing extensions the scanner does NOT read — finding one in a scanned src/ is a tripwire. */
const UNSCANNED_STYLE_EXTENSION = /\.(scss|less|html|vue|svelte|jsx|mdx)$/;
/** The four workspace packages (AD-4); anything else under packages/ is unexpected. */
const KNOWN_PACKAGE_DIRS = new Set(['tokens', 'components', 'react', 'docs']);

/** Hex color literal: 3, 4, 6 or 8 hex digits not followed by another hex digit. */
const HEX_COLOR = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/g;
/** Color-function literal: any rgb()/rgba()/hsl()/hsla() occurrence. */
const COLOR_FUNCTION = /\b(?:rgba?|hsla?)\(/gi;
/** z-index declaration (kebab or camel); the value capture runs to ; / newline so quoted values are included. */
const Z_INDEX = /(?:z-index|zIndex)\s*:\s*([^;\n]+)/g;

function stripComments(text: string): string {
  // Keep the newlines a block comment spans so violation line numbers stay true.
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

/** Same-length masking of '#' tokens that are references, not colors. */
function maskNonColorHashes(text: string): string {
  return text
    .replace(/url\(\s*#[^)\s]*/g, (token) => token.replace('#', '~'))
    .replace(/href\s*=\s*(["'])[^"']*\1/g, (attribute) => attribute.replace(/#/g, '~'))
    .replace(/#[A-Za-z_][-\w]*/g, (token) => (/[g-zG-Z_]/.test(token) ? token.replace('#', '~') : token));
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

/** Detect hard-coded values in one source file. Shape mirrors the import-boundary scanner. */
function violationsIn(source: string, filePath: string): string[] {
  const text = maskNonColorHashes(stripComments(source));
  const violations: string[] = [];
  for (const match of text.matchAll(HEX_COLOR)) {
    violations.push(
      `${filePath}:${lineOf(text, match.index ?? 0)}: hard-coded color literal '${match[0]}' — use a var(--tk-*) token (FR-1)`,
    );
  }
  for (const match of text.matchAll(COLOR_FUNCTION)) {
    violations.push(
      `${filePath}:${lineOf(text, match.index ?? 0)}: hard-coded color function '${match[0].slice(0, -1)}()' — use a var(--tk-*) token (FR-1)`,
    );
  }
  for (const match of text.matchAll(Z_INDEX)) {
    // Strip quotes and any trailing object/closure punctuation so quoted and
    // inline-object values normalize like bare ones; exempt every var()-bearing
    // value (covers calc(var(--tk-z-*) + n) too).
    const value = match[1].replace(/['"]/g, '').replace(/[}\s]+$/, '').trim();
    if (value.includes('var(')) continue;
    violations.push(
      `${filePath}:${lineOf(text, match.index ?? 0)}: z-index literal '${value}' — use a --tk-z-* token (FR-1)`,
    );
  }
  return violations;
}

function* walkSources(dir: string, extension: RegExp = SCANNED_EXTENSION): Generator<string> {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return; // package has no src/ yet — nothing to scan
  }
  for (const entry of entries.sort()) {
    const full = join(dir, entry);
    let stats;
    try {
      stats = statSync(full);
    } catch {
      continue; // broken symlink or vanished entry — skip, do not crash the suite
    }
    if (stats.isDirectory()) {
      yield* walkSources(full, extension);
    } else if (extension.test(entry)) {
      yield full;
    }
  }
}

describe('FR-1 zero-hard-coded values (spec 1.2)', () => {
  it('components/react/docs sources contain no color or z-index literals', () => {
    const violations: string[] = [];
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          violations.push(...violationsIn(readFileSync(filePath, 'utf8'), filePath));
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('scans a non-empty non-declaration file set per package (vacuous-walk guard)', () => {
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      const files = roots.flatMap((root) => [...walkSources(join(REPO_ROOT, packageDir, root))]);
      const realSources = files.filter((filePath) => !filePath.endsWith('.d.ts'));
      expect(
        realSources.length,
        `vacuous scan: no non-declaration files found under ${packageDir}/${roots.join('|')} — a lone .d.ts satisfies nothing`,
      ).toBeGreaterThan(0);
    }
  });

  it('packages/ holds only the four known workspace packages', () => {
    const unknown: string[] = [];
    for (const entry of readdirSync(join(REPO_ROOT, 'packages'))) {
      let isDirectory = false;
      try {
        isDirectory = statSync(join(REPO_ROOT, 'packages', entry)).isDirectory();
      } catch {
        continue; // broken symlink — not this tripwire's concern
      }
      if (isDirectory && !KNOWN_PACKAGE_DIRS.has(entry)) {
        unknown.push(`packages/${entry}`);
      }
    }
    expect(unknown, 'unknown package directories must join SCAN_ROOTS or be removed (AD-4)').toEqual([]);
  });

  it('scanned sources contain no style-bearing files with unscanned extensions', () => {
    const offenders: string[] = [];
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root), UNSCANNED_STYLE_EXTENSION)) {
          offenders.push(`${filePath}: style-bearing file outside the scanned extensions — extend the guard or remove the file`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('detector flags synthesized hard-coded values (negative self-check)', () => {
    const offenders = [
      'a { color: #333333; }',
      'b { border-color: #fff; }',
      'c { outline-color: #FFDD2DAA; }',
      '.d { background: rgb(0, 0, 0); }',
      '.e { box-shadow: 0 4px 24px rgba(0,0,0,.12); }',
      '.f { color: hsl(210, 16%, 47%); }',
      'host { z-index: 42; }',
      'styles = { zIndex: 10 };',
      "styles = { zIndex: '10' };",
    ];
    for (const source of offenders) {
      const found = violationsIn(source, 'synthetic');
      expect(found.length, `expected a violation in: ${source}`).toBeGreaterThan(0);
      expect(found.every((line) => line.startsWith('synthetic:'))).toBe(true);
    }
  });

  it('detector passes token-only usage, references, and comment mentions (negative self-check)', () => {
    const clean = [
      ':host { color: var(--tk-color-text-primary); }',
      ':host { z-index: var(--tk-z-modal); }',
      ':host { z-index: var(--tk-z-toast, 600); }',
      ':host { z-index: calc(var(--tk-z-modal) + 1); }',
      "styles = { zIndex: 'var(--tk-z-modal)' };",
      'const zIndex = el.style.zIndex;', // property access, no declaration
      'mask: url(#checkmark-icon);',
      '<a href="#section-title">skip</a>',
      '#main-nav { display: none; }',
      '// mention #FFDD2D in a comment only',
      '/* rgba(0,0,0,.12) in a comment only */',
    ];
    for (const source of clean) {
      expect(violationsIn(source, 'synthetic'), `expected no violation in: ${source}`).toEqual([]);
    }
  });

  it('reports true line numbers across multi-line comments', () => {
    const source = 'a {\n/* line2\nline3 */\ncolor: #fff;\n}';
    const found = violationsIn(source, 'synthetic');
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(/^synthetic:4:/);
  });
});
