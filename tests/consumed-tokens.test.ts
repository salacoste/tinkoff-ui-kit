import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Consumed-token existence guard (spec 1.7 review): nothing validated that
 * `var(--tk-*)` references in kit sources exist in the token sheet — a typo'd
 * name (e.g. a `--tk-text-body-m-bold-leading` that was never emitted) silently
 * falls back to `inherit`/`unset` and passed every gate. Every var(--tk-*)
 * consumed under the same scan roots as the zero-hardcoded guard
 * (packages/{components,react}/src, packages/docs/{src,.storybook}) must be
 * declared in packages/tokens/src/tokens.css (comment-stripped — comments
 * mention token names that are not declarations).
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

const SCAN_ROOTS: Readonly<Record<string, readonly string[]>> = {
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/docs': ['src', '.storybook'],
};

const SCANNED_EXTENSION = /\.(ts|tsx|css)$/;

/** var(--tk-…) consumption — tolerant of a fallback value: var(--tk-x, …). */
const CONSUMED_TOKEN = /var\((--tk-[a-z0-9-]+)\s*[,)]/g;

/** A declaration in the token sheet: `--tk-name:` at a property position. */
const DECLARED_TOKEN = /^[ \t]*(--tk-[a-z0-9-]+)\s*:/gm;

function stripComments(text: string): string {
  // Preserve newlines so reported line numbers stay true.
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

function* walkSources(dir: string): Generator<string> {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries.sort()) {
    const full = join(dir, entry);
    let stats;
    try {
      stats = statSync(full);
    } catch {
      continue;
    }
    if (stats.isDirectory()) {
      yield* walkSources(full);
    } else if (SCANNED_EXTENSION.test(entry)) {
      yield full;
    }
  }
}

const declaredTokens = new Set<string>();
for (const match of stripComments(
  readFileSync(join(REPO_ROOT, 'packages/tokens/src/tokens.css'), 'utf8'),
).matchAll(DECLARED_TOKEN)) {
  declaredTokens.add(match[1]);
}

describe('consumed --tk-* tokens exist in the token sheet (spec 1.7 review)', () => {
  it('the token sheet is non-empty (vacuous-scan guard)', () => {
    expect(declaredTokens.size).toBeGreaterThan(50);
  });

  it('every var(--tk-*) consumed in components/react/docs is declared', () => {
    expect(declaredTokens, 'fixture sanity: yellow-100 must be declared').toContain(
      '--tk-color-yellow-100',
    );
    const undeclared: string[] = [];
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          const text = stripComments(readFileSync(filePath, 'utf8'));
          for (const match of text.matchAll(CONSUMED_TOKEN)) {
            if (!declaredTokens.has(match[1])) {
              undeclared.push(`${filePath}: consumes undeclared '${match[1]}'`);
            }
          }
        }
      }
    }
    expect(
      undeclared,
      'var(--tk-*) references must exist in packages/tokens/src/tokens.css — a typo here silently computes to nothing (this bug class passed every gate once).',
    ).toEqual([]);
  });

  it('detector flags a synthesized undeclared token (negative self-check)', () => {
    const bad = 'a { line-height: var(--tk-text-body-m-bold-leading); }';
    const consumed = [...stripComments(bad).matchAll(CONSUMED_TOKEN)].map((m) => m[1]);
    expect(consumed).toEqual(['--tk-text-body-m-bold-leading']);
    expect(declaredTokens.has(consumed[0])).toBe(false);
  });

  it('detector passes declared tokens, fallback forms, and comment mentions (negative self-check)', () => {
    const consumedIn = (source: string) =>
      [...stripComments(source).matchAll(CONSUMED_TOKEN)].map((m) => m[1]);
    expect(consumedIn('a { color: var(--tk-color-yellow-100); }')).toEqual([
      '--tk-color-yellow-100',
    ]);
    expect(consumedIn('b { z-index: var(--tk-z-modal, 500); }')).toEqual(['--tk-z-modal']);
    // A bogus name in a comment only is stripped before matching — comment
    // mentions are not consumption.
    expect(consumedIn('// mention var(--tk-not-real) in a comment only')).toEqual([]);
  });
});
