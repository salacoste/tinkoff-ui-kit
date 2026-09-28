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

  it('the six v2 token-layer declarations exist in the sheet (spec 6.1 fixture pin)', () => {
    // The 6.1 light declarations the v2 components (6.2+) will consume. Pinned
    // here so a generator regression that drops one fails with the NAME, not
    // as an undeclared-consumption violation in a later story.
    const v2Names = [
      '--tk-color-delta-positive',
      '--tk-color-delta-negative',
      '--tk-color-border-table',
      '--tk-color-surface-row-hover',
      '--tk-color-tint-cream',
      '--tk-color-tint-cream-raised',
    ] as const;
    for (const name of v2Names) {
      expect(declaredTokens, `spec 6.1 declaration '${name}' must exist in tokens.css`).toContain(name);
    }
  });

  it('the two 9.1 declarations exist in the sheet (spec 9.1 fixture pin)', () => {
    // tint-brown is consumed at story 9.1 (stepper.css.ts badge fallback);
    // --tk-font-mono had NO consumer in 9.1 by design — the first consumer is
    // the docs code blocks (story 11.2). The former no-consumer exemption was
    // recorded in DESIGN.md's fonts comment and TOKENS.md — both now record
    // the consumer fact. Pinned so a generator regression that drops either
    // fails with the NAME, never as later-story noise.
    const names = ['--tk-color-tint-brown', '--tk-font-mono'] as const;
    for (const name of names) {
      expect(declaredTokens, `spec 9.1 declaration '${name}' must exist in tokens.css`).toContain(name);
    }
  });

  it('the docs code surfaces consume --tk-font-mono bare — the 11.2 flip pinned by file (spec 11.2)', () => {
    // The mono slot's first consumer is the docs code blocks (story 11.2).
    // This closes the 9.1 no-consumer era in CODE, not comments: a flip
    // regression (a pre/code rule back to --tk-font-body) fails here,
    // naming the files that lost the consumption.
    const bareMonoConsumers: string[] = [];
    for (const root of SCAN_ROOTS['packages/docs'] ?? []) {
      for (const filePath of walkSources(join(REPO_ROOT, 'packages/docs', root))) {
        const text = stripComments(readFileSync(filePath, 'utf8'));
        if ([...text.matchAll(CONSUMED_BARE_TOKEN)].some((m) => m[1] === '--tk-font-mono')) {
          bareMonoConsumers.push(filePath);
        }
      }
    }
    expect(
      bareMonoConsumers.length,
      `docs files consuming --tk-font-mono bare: [${bareMonoConsumers.join(', ')}] — the 11.2 flip regressed`,
    ).toBeGreaterThan(0);
    // The five flipped surfaces, each named — a partial regression (one file
    // reverted) fails on exactly the file that vanished. component-search.ts
    // (the tag chips) joined in the story 11.2 fix round — the review lens
    // caught the story round's sweep missing its hyphenated selector stem.
    const flipped = [
      'getting-started.stories.ts',
      'theming-guide.stories.ts',
      'page-scaffold.ts',
      'token-reference.stories.ts',
      'component-search.ts',
    ] as const;
    for (const file of flipped) {
      expect(
        bareMonoConsumers.some((p) => p.endsWith(`/${file}`)),
        `${file} no longer consumes --tk-font-mono — the 11.2 flip regressed`,
      ).toBe(true);
    }
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
    // Unknown component prefix → flagged.
    expect(fallbackViolation('--tk-inputtypo-x')).not.toBeNull();
    // A REAL component since Story 4.1 (src/modal/ exists) — the exemption
    // covers it now; the pre-4.1 assertion flipped with the story, exactly
    // as its own message anticipated.
    expect(fallbackViolation('--tk-modal-fill')).toBeNull();
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

// ---------------------------------------------------------------------------
// ТЖ scoping (story 15.2) — the same guard for the --tj-* namespace, derived
// from packages/tj-tokens/src/tokens.css. Scan roots are the ТЖ family
// (tj-components, tj-react) plus docs (the ТЖ docs section). The component-hook
// exemption keys off packages/tj-components/src directories — LIVE since 16.1
// landed the reading primitives (tj-cta/tj-link/tj-prose), derived, never
// hand-listed (the bank mold); the exemption grows with real components.
// ---------------------------------------------------------------------------

const TJ_SCAN_ROOTS: Readonly<Record<string, readonly string[]>> = {
  'packages/tj-components': ['src'],
  'packages/tj-react': ['src'],
  'packages/docs': ['src', '.storybook'],
};

const CONSUMED_BARE_TOKEN_TJ = /var\((--tj-[a-z0-9-]+)\s*\)/g;
const CONSUMED_FALLBACK_TOKEN_TJ = /var\((--tj-[a-z0-9-]+)\s*,/g;
const DECLARED_TOKEN_TJ = /^[ \t]*(--tj-[a-z0-9-]+)\s*:/gm;

const declaredTjTokens = new Set<string>();
for (const match of stripComments(
  readFileSync(join(REPO_ROOT, 'packages/tj-tokens/src/tokens.css'), 'utf8'),
).matchAll(DECLARED_TOKEN_TJ)) {
  declaredTjTokens.add(match[1]);
}

/** Real ТЖ component directory names — empty until 15.3 lands the first component; derived, never hand-listed. */
const tjComponentDirs = new Set(
  readdirSync(join(REPO_ROOT, 'packages/tj-components/src')).filter((entry) => {
    try {
      return statSync(join(REPO_ROOT, 'packages/tj-components/src', entry)).isDirectory();
    } catch {
      return false;
    }
  }),
);

function isTjComponentHook(name: string): boolean {
  const rest = name.replace(/^--tj-/, '');
  for (const dir of tjComponentDirs) {
    // ТЖ component dirs carry the tag prefix (tj-prose — the OQ-9 naming;
    // bank dirs don't carry tk-), so a hook of the natural grammar
    // (--tj-prose-*) matches the dir SANS its 'tj-' prefix as well.
    const dirNames = dir.startsWith('tj-') ? [dir, dir.slice(3)] : [dir];
    for (const dirName of dirNames) {
      if (rest === dirName || rest.startsWith(`${dirName}-`)) return true;
    }
  }
  return false;
}

function tjFallbackViolation(name: string): string | null {
  if (declaredTjTokens.has(name)) return null;
  if (isTjComponentHook(name)) return null;
  return `'${name}' — fallback consumption of a name that is neither a tj tokens.css token nor a <component>-slot hook of a real ТЖ component — likely a typo in a core token name or an unknown component prefix`;
}

describe('consumed --tj-* tokens exist in the ТЖ token sheet (story 15.2)', () => {
  it('the ТЖ token sheet is non-empty (vacuous-scan guard)', () => {
    expect(declaredTjTokens.size).toBeGreaterThan(50);
  });

  it('the generated layer anchors exist in the sheet (story 15.2 fixture pin)', () => {
    // The 15.2 declarations the first ТЖ consumers (15.3+) will reach for:
    // the two family slots, the link asymmetry alias, the circular badge
    // radius, and the dark-overridable surfaces. Pinned so a generator
    // regression that drops one fails with the NAME, never as later-story
    // undeclared-consumption noise.
    const names = [
      '--tj-color-link',
      '--tj-color-engage',
      '--tj-color-card',
      '--tj-color-page',
      '--tj-font-ui',
      '--tj-font-reading',
      '--tj-radius-badge',
    ] as const;
    for (const name of names) {
      expect(declaredTjTokens, `story 15.2 declaration '${name}' must exist in tj tokens.css`).toContain(name);
    }
  });

  it('the ТЖ component-hook exemption is LIVE on the 16.1 roster (flipped from the 15.2 inert pin)', () => {
    // 16.1 lands the reading primitives: the exemption now keys off real
    // component directories, derived — never hand-listed. A <component>-slot
    // hook fallback of a real component passes; an unknown component prefix
    // or a typo'd core name stays flagged (flipped the way the bank 2.3/4.1
    // assertions flipped, per this test's own 15.2 comment).
    expect([...tjComponentDirs].sort()).toEqual(['tj-cta', 'tj-link', 'tj-prose']);
    expect(
      tjFallbackViolation('--tj-prose-lead'),
      'a real component hook-shaped fallback passes',
    ).toBeNull();
    expect(
      tjFallbackViolation('--tj-card-fil'),
      'an unknown component prefix stays flagged',
    ).not.toBeNull();
    expect(tjFallbackViolation('--tj-color-card')).toBeNull();
  });

  it('every var(--tj-*) consumed in tj-components/tj-react/docs is declared (green-empty until 15.3)', () => {
    const violations: string[] = [];
    for (const [packageDir, roots] of Object.entries(TJ_SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          const text = stripComments(readFileSync(filePath, 'utf8'));
          for (const match of text.matchAll(CONSUMED_BARE_TOKEN_TJ)) {
            if (!declaredTjTokens.has(match[1])) {
              violations.push(
                `${filePath}: consumes undeclared '${match[1]}' (bare) — must exist in packages/tj-tokens/src/tokens.css`,
              );
            }
          }
          for (const match of text.matchAll(CONSUMED_FALLBACK_TOKEN_TJ)) {
            const violation = tjFallbackViolation(match[1]);
            if (violation) {
              violations.push(`${filePath}: ${violation}`);
            }
          }
        }
      }
    }
    expect(
      violations,
      'a typo here silently computes to nothing (or to an undocumented default) — the bank kit shipped this bug class once.',
    ).toEqual([]);
  });

  it('the ТЖ detector is live (negative self-check)', () => {
    const consumedIn = (source: string) =>
      [...stripComments(source).matchAll(CONSUMED_BARE_TOKEN_TJ)].map((m) => m[1]);
    expect(consumedIn('a { color: var(--tj-color-link); }')).toEqual(['--tj-color-link']);
    expect(declaredTjTokens.has('--tj-color-link')).toBe(true);
    // Cross-family isolation: --tk-* names never validate against the ТЖ sheet
    // and vice versa (the prefixes are disjoint namespaces).
    expect(declaredTokens.has('--tj-color-link')).toBe(false);
    expect(declaredTjTokens.has('--tk-color-link')).toBe(false);
    expect(consumedIn('// mention var(--tj-not-real) in a comment only')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Cross-family consumption (FR-17 runtime shadow — 15.2 review finding): the
// per-family sweeps above validate a `var(--tk-*)`/`var(--tj-*)` reference only
// against ITS OWN sheet, so a bank source reaching for `var(--tj-*)` (or a ТЖ
// component copy-pasted from the bank retaining `--tk-*` vars) passed every
// gate — and silently computes to nothing, because FR-17 guarantees the other
// family's sheet is never loaded. ANY cross-family var() reference in family
// sources is therefore a defect here, declared or not. Docs is exempt (AD-4:
// it composes BOTH families by design).
// ---------------------------------------------------------------------------

const CROSS_FAMILY_TJ_REFERENCE = /var\(\s*--tj-[a-z0-9-]+/g;
const CROSS_FAMILY_TK_REFERENCE = /var\(\s*--tk-[a-z0-9-]+/g;

function crossFamilyViolations(
  scanRoots: Readonly<Record<string, readonly string[]>>,
  pattern: RegExp,
  foreignPrefix: '--tj-' | '--tk-',
): string[] {
  const violations: string[] = [];
  for (const [packageDir, roots] of Object.entries(scanRoots)) {
    if (packageDir === 'packages/docs') continue; // composes both families (AD-4)
    for (const root of roots) {
      for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
        const text = stripComments(readFileSync(filePath, 'utf8'));
        for (const match of text.matchAll(pattern)) {
          violations.push(
            `${filePath}: cross-family ${foreignPrefix}* reference '${match[0].replace(/^var\(\s*/, '')}' — FR-17 keeps the other family's sheet unloaded, so this var() silently computes to nothing`,
          );
        }
      }
    }
  }
  return violations;
}

describe('cross-family token isolation — no var() across the FR-17 line (story 15.2)', () => {
  it('bank sources reference only --tk-* (zero --tj-* vars)', () => {
    expect(
      crossFamilyViolations(SCAN_ROOTS, CROSS_FAMILY_TJ_REFERENCE, '--tj-'),
      'FR-17: a bank component consuming --tj-* renders with an unset custom property.',
    ).toEqual([]);
  });

  it('ТЖ sources reference only --tj-* (zero --tk-* vars — guards the 16.x bank→ТЖ component port)', () => {
    expect(
      crossFamilyViolations(TJ_SCAN_ROOTS, CROSS_FAMILY_TK_REFERENCE, '--tk-'),
      'FR-17: a ТЖ component consuming --tk-* renders with an unset custom property (the expected failure mode of a copy-pasted bank component).',
    ).toEqual([]);
  });

  it('the cross-family detector is live (negative self-check)', () => {
    const sample = 'a { color: var( --tj-color-card , var(--tk-color-card)); }';
    expect([...stripComments(sample).matchAll(CROSS_FAMILY_TJ_REFERENCE)].length).toBe(1);
    expect([...stripComments(sample).matchAll(CROSS_FAMILY_TK_REFERENCE)].length).toBe(1);
    expect([...stripComments('var(--tk-color-card) + var(--tj-color-card)').matchAll(CROSS_FAMILY_TJ_REFERENCE)].length).toBe(1);
  });
});
