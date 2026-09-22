import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Consumed-token existence guard (spec 1.7 review): nothing validated that
 * `var(--tk-*)` references in kit sources exist in the token sheet — a typo'd
 * name (e.g. a `--tk-text-body-m-bold-leading` that was never emitted) silently
 * falls back to `inherit`/`unset` and passed every gate.
 *
 * Amended at Story 2.1 (review pass) for the per-component custom-property
 * grammar (CONVENTIONS §6: `--tk-<component>-<slot>`, e.g. `--tk-input-fill`):
 * those hooks are DELIBERATELY absent from tokens.css — consumers set them, and
 * components consume them WITH a token default as the fallback
 * (`var(--tk-input-fill, var(--tk-color-surface-field))`). A blanket
 * "fallback ⇒ pass" would re-open the original bug class for CORE tokens
 * (`var(--tk-z-modaal, 500)` would escape), so the exemption is SCOPED — a
 * fallback-consumed name passes ONLY if:
 * (a) it is declared in packages/tokens/src/tokens.css, OR
 * (b) it is a `--tk-<component>-…` hook whose `<component>` prefix matches a
 *     REAL component directory under packages/components/src/ (the set is
 *     derived, never hand-listed: `--tk-input-*` passes while `--tk-z-modaal`
 *     and `--tk-inputtypo-x` fail).
 * BARE consumption `var(--tk-x)` (no fallback) must ALWAYS be declared.
 *
 * ACCEPTED RESIDUAL GAP: a typo WITHIN a real component's hook namespace
 * (`--tk-input-fil`) passes — the name is inside that component's own override
 * surface, degrades to the documented token default, and is caught in use-site
 * review rather than by this scan.
 *
 * Scan roots mirror the zero-hardcoded guard (packages/{components,react}/src,
 * packages/docs/{src,.storybook}); token declarations are read comment-stripped
 * (comments mention token names that are not declarations).
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

const SCAN_ROOTS: Readonly<Record<string, readonly string[]>> = {
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/docs': ['src', '.storybook'],
};

const SCANNED_EXTENSION = /\.(ts|tsx|css)$/;

/** BARE var(--tk-…) consumption (no fallback) — must be declared in tokens.css. Whitespace-tolerant (`var(--tk-x )`). */
const CONSUMED_BARE_TOKEN = /var\((--tk-[a-z0-9-]+)\s*\)/g;
/** Consumption WITH a fallback — passes only via the scoped exemption below. */
const CONSUMED_FALLBACK_TOKEN = /var\((--tk-[a-z0-9-]+)\s*,/g;

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

/** Real component directory names — the only legitimate `--tk-<component>-*` prefixes. Derived, never hand-listed. */
const componentDirs = new Set(
  readdirSync(join(REPO_ROOT, 'packages/components/src')).filter((entry) => {
    try {
      return statSync(join(REPO_ROOT, 'packages/components/src', entry)).isDirectory();
    } catch {
      return false;
    }
  }),
);

/** Is `name` a per-component override hook of a REAL component (`--tk-<dir>-slot`)? */
function isComponentHook(name: string): boolean {
  const rest = name.replace(/^--tk-/, '');
  for (const dir of componentDirs) {
    if (rest === dir || rest.startsWith(`${dir}-`)) return true;
  }
  return false;
}

/**
 * Scoped fallback exemption: a fallback-consumed name passes only when
 * declared in tokens.css OR a real component's hook; anything else returns the
 * violation message (the guard's original bug class, back in scope).
 */
function fallbackViolation(name: string): string | null {
  if (declaredTokens.has(name)) return null;
  if (isComponentHook(name)) return null;
  return `'${name}' — fallback consumption of a name that is neither a tokens.css token nor a <component>-slot hook of a real component (components: ${[...componentDirs].sort().join(', ')}) — likely a typo in a core token name or an unknown component prefix`;
}

describe('consumed --tk-* tokens exist in the token sheet (spec 1.7 review)', () => {
  it('the token sheet is non-empty (vacuous-scan guard)', () => {
    expect(declaredTokens.size).toBeGreaterThan(50);
  });

  it('derives a real component set (vacuous-exemption guard)', () => {
    expect(componentDirs.size).toBeGreaterThan(0);
    expect(componentDirs, 'the exemption must key off real components').toContain('input');
    expect(componentDirs).toContain('button');
  });

  it('every var(--tk-*) consumed in components/react/docs is declared or a real component hook', () => {
    expect(declaredTokens, 'fixture sanity: yellow-100 must be declared').toContain(
      '--tk-color-yellow-100',
    );
    const violations: string[] = [];
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          const text = stripComments(readFileSync(filePath, 'utf8'));
          for (const match of text.matchAll(CONSUMED_BARE_TOKEN)) {
            if (!declaredTokens.has(match[1])) {
              violations.push(
                `${filePath}: consumes undeclared '${match[1]}' (bare) — must exist in packages/tokens/src/tokens.css`,
              );
            }
          }
          for (const match of text.matchAll(CONSUMED_FALLBACK_TOKEN)) {
            const violation = fallbackViolation(match[1]);
            if (violation) {
              violations.push(`${filePath}: ${violation}`);
            }
          }
        }
      }
    }
    expect(
      violations,
      'a typo here silently computes to nothing (or to an undocumented default) — this bug class passed every gate once.',
    ).toEqual([]);
  });

  it('detector flags a synthesized undeclared token (negative self-check)', () => {
    const bad = 'a { line-height: var(--tk-text-body-m-bold-leading); }';
    const consumed = [...stripComments(bad).matchAll(CONSUMED_BARE_TOKEN)].map((m) => m[1]);
    expect(consumed).toEqual(['--tk-text-body-m-bold-leading']);
    expect(declaredTokens.has(consumed[0])).toBe(false);
  });

  it('the fallback exemption is scoped (negative self-checks)', () => {
    // Declared core token with a fallback → passes.
    expect(fallbackViolation('--tk-z-modal')).toBeNull();
    // Real component hook → passes.
    expect(fallbackViolation('--tk-input-fill')).toBeNull();
    expect(fallbackViolation('--tk-input-placeholder')).toBeNull();
    // A REAL component since Story 2.3 (src/select/ exists) — the exemption
    // covers it now; the pre-2.3 assertion flipped with the story, as its
    // message anticipated.
    expect(fallbackViolation('--tk-select-fill')).toBeNull();
    // Undeclared CORE token in fallback position → flagged (the original bug
    // class — mutation-proven in review to escape under the blanket rule).
    expect(fallbackViolation('--tk-z-modaal')).not.toBeNull();
    expect(fallbackViolation('--tk-space-8px')).not.toBeNull();
    // Unknown component prefix → flagged (modal is not a component dir yet).
    expect(fallbackViolation('--tk-inputtypo-x')).not.toBeNull();
    expect(fallbackViolation('--tk-modal-fill'), 'not a real component YET (Epic 4)').not.toBeNull();
  });

  it('detector passes declared tokens, whitespace-tolerant forms, and comment mentions (negative self-check)', () => {
    const consumedIn = (source: string) =>
      [...stripComments(source).matchAll(CONSUMED_BARE_TOKEN)].map((m) => m[1]);
    expect(consumedIn('a { color: var(--tk-color-yellow-100); }')).toEqual([
      '--tk-color-yellow-100',
    ]);
    // Whitespace before the closing paren still captures the name.
    expect(consumedIn('b { color: var(--tk-color-yellow-100 ); }')).toEqual([
      '--tk-color-yellow-100',
    ]);
    // Fallback forms are classified by the fallback regex, not the bare one…
    expect(consumedIn('c { z-index: var(--tk-z-modal, 500); }')).toEqual([]);
    // …while the fallback's OWN inner reference stays bare and validated.
    const inner = consumedIn('d { fill: var(--tk-input-fill, var(--tk-color-surface-field)); }');
    expect(inner).toEqual(['--tk-color-surface-field']);
    expect(declaredTokens.has(inner[0])).toBe(true);
    // A bogus name in a comment only is stripped before matching — comment
    // mentions are not consumption.
    expect(consumedIn('// mention var(--tk-not-real) in a comment only')).toEqual([]);
  });
});
