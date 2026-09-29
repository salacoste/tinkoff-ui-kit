import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * ТЖ article-pattern imports guard (spec 16.6): the composed article page is
 * the kit's flagship surface, and it must stay ТЖ-FAMILY-PURE — the pattern
 * story may import ONLY (a) relative ../tj-* modules of its own package,
 * (b) `lit`, (c) type-only imports (the Storybook CSF types). A bank import
 * (`pillkit-components`, `../../components`, any bank path) or a
 * cross-family `--tk-*` read anywhere in the file (cssText belt — the FR-17
 * runtime shadow) fails LOUDLY, naming the offending line (the trip-probe
 * style: the error is the diagnosis).
 *
 * This is the mechanized belt BEHIND the general nets: tests/import-boundaries
 * (AD-4/FR-17 workspace-wide) and the cross-family var() isolation guard in
 * tests/consumed-tokens.test.ts. Those catch the general classes; this test
 * pins the ONE file whose whole point is the family boundary — a reviewer
 * can move fast on pattern stories because the guard names the line.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const STORY_PATH = join(REPO_ROOT, 'packages/tj-components/src/patterns/article-page.stories.ts');

/** Import/export statement with a `from` clause (multi-line bodies included). */
const FROM_CLAUSE =
  /(?:^|\n)[ \t]*(import|export)\b([^;]*?)\bfrom\s*['"]([^'"]+)['"][ \t]*;?[ \t]*(?=\n|$)/g;
/** Bare side-effect import: `import '…';`. */
const SIDE_EFFECT_IMPORT = /(?:^|\n)[ \t]*import\s*['"]([^'"]+)['"][ \t]*;?[ \t]*(?=\n|$)/g;
/** Dynamic import: `import('…')`. */
const DYNAMIC_IMPORT = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
/**
 * Computed dynamic import: `import(\`…\`)` / `import(variable)` — NOT a
 * statically analyzable specifier, so no allowlist lane can ever clear it:
 * the pattern file forbids the FORM itself (the 16.6 lens lane).
 */
const COMPUTED_DYNAMIC_IMPORT = /import\s*\(\s*[`A-Za-z_$]/g;
/** Cross-family token read anywhere in the file (cssText belt). */
const CROSS_FAMILY_VAR = /--tk-/g;

function stripComments(text: string): string {
  // Preserve newlines so reported line numbers stay true (the repo mold).
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

interface ImportFinding {
  /** 1-based line of the statement (the from-clause line for multi-line imports). */
  line: number;
  clause: string;
  specifier: string;
  typeOnly: boolean;
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

function extractImports(source: string): ImportFinding[] {
  const text = stripComments(source);
  const findings: ImportFinding[] = [];
  // The newline-anchored patterns CONSUME the preceding line's terminator,
  // so the reported position must advance past it — otherwise every
  // attributed line number is off by one (empirically probed: a statement on
  // physical line 4 reported line 3).
  const statementIndex = (index: number): number => (text[index] === '\n' ? index + 1 : index);
  for (const match of text.matchAll(FROM_CLAUSE)) {
    const index = statementIndex(match.index ?? 0);
    findings.push({
      line: lineOf(text, index),
      clause: `${match[1]}${match[2]}from`.replace(/\s+/g, ' ').trim(),
      specifier: match[3]!,
      typeOnly: /^\s*import\s+type\b/.test(`${match[1]}${match[2]}`),
    });
  }
  for (const match of text.matchAll(SIDE_EFFECT_IMPORT)) {
    const index = statementIndex(match.index ?? 0);
    findings.push({
      line: lineOf(text, index),
      clause: 'import',
      specifier: match[1]!,
      typeOnly: false,
    });
  }
  for (const match of text.matchAll(DYNAMIC_IMPORT)) {
    findings.push({
      line: lineOf(text, match.index ?? 0),
      clause: 'import()',
      specifier: match[1]!,
      typeOnly: false,
    });
  }
  return findings;
}

/** The allowlist: relative ../tj-* siblings, lit, and the CSF type-only lane. */
function specifierViolation(finding: ImportFinding): string | null {
  const { specifier, typeOnly } = finding;
  if (specifier.startsWith('../tj-')) return null;
  if (specifier === 'lit' || specifier.startsWith('lit/')) return null;
  if (typeOnly && specifier === '@storybook/web-components-vite') return null;
  return `'${specifier}' — the article pattern may import only ../tj-* modules, lit, and type-only @storybook/web-components-vite (FR-17; spec 16.6)`;
}

/** Every reason the file fails, each naming its line (trip-probe style). */
function violationsIn(source: string, filePath: string): string[] {
  const violations: string[] = [];
  const lines = source.split('\n');
  for (const finding of extractImports(source)) {
    const violation = specifierViolation(finding);
    if (violation !== null) {
      violations.push(`${filePath}:${finding.line}: ${violation} — line: ${lines[finding.line - 1]!.trim()}`);
    }
  }
  const text = stripComments(source);
  for (const match of text.matchAll(COMPUTED_DYNAMIC_IMPORT)) {
    violations.push(
      `${filePath}:${lineOf(text, match.index ?? 0)}: computed dynamic import — \`import(…)\` with a non-literal specifier cannot be allowlisted, so the FORM is forbidden in the pattern file (spec 16.6) — line: ${lines[lineOf(text, match.index ?? 0) - 1]!.trim()}`,
    );
  }
  for (const match of text.matchAll(CROSS_FAMILY_VAR)) {
    violations.push(
      `${filePath}:${lineOf(text, match.index ?? 0)}: cross-family token read '--tk-' — FR-17 keeps the bank sheet unloaded in ТЖ surfaces, the var() silently computes to nothing — line: ${lines[lineOf(text, match.index ?? 0) - 1]!.trim()}`,
    );
  }
  return violations;
}

describe('ТЖ article-pattern imports (spec 16.6, FR-17 family purity)', () => {
  it('the pattern story file exists and is non-empty (vacuous-guard)', () => {
    const source = readFileSync(STORY_PATH, 'utf8');
    expect(source.length).toBeGreaterThan(1000);
  });

  it('every import resolves to a ТЖ module or lit; zero --tk-* reads (loud attribution)', () => {
    const source = readFileSync(STORY_PATH, 'utf8');
    const violations = violationsIn(source, STORY_PATH);
    expect(
      violations,
      'the article pattern is the FR-17 flagship — a bank path or --tk-* read here is a family-boundary break:\n' +
        violations.join('\n'),
    ).toEqual([]);
  });

  it('imports at least one ../tj-* module and lit (the composition is real, not prose)', () => {
    const findings = extractImports(readFileSync(STORY_PATH, 'utf8'));
    expect(
      findings.some(({ specifier }) => specifier.startsWith('../tj-')),
      'the pattern story must compose real ТЖ elements via relative imports',
    ).toBe(true);
    expect(
      findings.some(({ specifier }) => specifier === 'lit'),
      'the pattern story renders via lit html templates',
    ).toBe(true);
  });

  it('the classifier flags synthesized bank imports and --tk-* reads, naming lines (negative self-check)', () => {
    const badSource = [
      "import type { Meta } from '@storybook/web-components-vite';",
      "import { html } from 'lit';",
      "import '../tj-prose/tj-prose.js';",
      "import 'pillkit-components';",
      "import { TkPromoCard } from '../../components/src/promo-card/promo-card.js';",
      'const fill = `var(--tk-color-yellow-100)`;',
      'const mod = await import(`./bank-${name}.js`);',
    ].join('\n');
    const found = violationsIn(badSource, 'synthetic');
    expect(found).toHaveLength(4);
    expect(found.every((line) => line.startsWith('synthetic:'))).toBe(true);
    // Loud attribution, EXACT: each violation names its own line number and
    // that line's text (pinned after an off-by-one shipped green once — a
    // violation may never borrow a neighboring line's text). Emission order:
    // from-clause findings, then side-effect, then computed-dynamic, then
    // the --tk- belt.
    expect(found[0]).toMatch(/^synthetic:5: '\.\.\/\.\.\/components/);
    expect(found[0]).toContain('— line: import { TkPromoCard } from');
    expect(found[1]).toMatch(/^synthetic:4: 'pillkit-components'/);
    expect(found[1]).toContain("— line: import 'pillkit-components';");
    expect(found[2]).toMatch(/^synthetic:7: computed dynamic import/);
    expect(found[2]).toContain('import(`./bank-');
    expect(found[3]).toMatch(/^synthetic:6: cross-family token read/);
    expect(found[3]).toContain('--tk-color-yellow-100');
  });

  it('the classifier passes the sanctioned lanes (negative self-check)', () => {
    const goodSource = [
      "import type { Meta, StoryObj } from '@storybook/web-components-vite';",
      "import { html } from 'lit';",
      "import { nothing } from 'lit/decorators.js';",
      "import '../tj-header/tj-header.js';",
      "import '../tj-rail/tj-rail.js';",
      '// mention pillkit-components in a comment only — not an import',
      'const css = `color: var(--tj-color-card);`;',
    ].join('\n');
    expect(violationsIn(goodSource, 'synthetic')).toEqual([]);
  });

  it('a VALUE import of the CSF types module is NOT the type lane (negative self-check)', () => {
    const found = violationsIn("import { Meta } from '@storybook/web-components-vite';", 'synthetic');
    expect(found).toHaveLength(1);
    expect(found[0]).toContain('@storybook/web-components-vite');
  });
});
