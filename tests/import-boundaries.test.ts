import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  ALLOWED_SPECIFIERS,
  CANONICAL_DIRECTIONS,
  FR17_MESSAGE,
  PACKAGE_DIRS,
  SCAN_ROOTS,
  escapeRegexSource,
  forbiddenGroups,
  fr17Groups,
} from '../ad4-matrix.mjs';
import * as ad4Module from '../ad4-matrix.mjs';
import eslintConfig from '../eslint.config.js';

/**
 * Committed guards for the two spec-1.1 matrix rows that were originally verified
 * ad hoc (add-then-revert lint probe, dist grep):
 *
 * - Row 2 (import-boundary violation -> lint fails): static scan of workspace
 *   sources against the AD-4 import matrix. Belt to eslint's `no-restricted-imports`
 *   braces — it runs in `pnpm test`, so the test gate alone cannot pass a tree
 *   that violates the allowed directions. Relative imports that resolve out of their
 *   package are mapped to the target package and checked against the same matrix.
 * - Row 3 (build isolation): reads the built `packages/react` artifact and asserts
 *   `pillkit-components` stayed external and no Lit source got bundled; also guards
 *   the `pillkit-tokens` `./tokens.css` export target (`dist/index.css`).
 *
 * Story 9.2: the matrix (package dirs, allowed specifiers, scan roots) is
 * SINGLE-SOURCED in ../ad4-matrix.mjs — this suite, eslint.config.js and the
 * README pin all derive from it; the matrix lives in exactly one place.
 *
 * Story 15.1: the ТЖ family joins the matrix as a parallel lane (AD-4 v5).
 * The FR-17 edge — families runtime-disjoint in BOTH directions, docs
 * exempt — is mechanized here and in eslint via the module's fr17Groups;
 * violation lines crossing the family edge NAME FR-17. The tj-react build
 * isolation lane mirrors the bank's (scaffold grade: the entry is empty by
 * design, so isolation asserts as "nothing bundled" plus the externals pin).
 *
 * Build-artifact assumption: `pnpm build` precedes `pnpm test` — the AC command
 * chain is `pnpm install && pnpm build && pnpm test`. This suite reads `dist/` as
 * built; it does not build.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

/** AD-4 allowed import directions: package dir -> allowed pillkit-* specifiers. */
const AD4_MATRIX: Record<string, readonly string[]> = ALLOWED_SPECIFIERS;

const SPECIFIER_PATTERNS: readonly RegExp[] = [
  /import\s[^;]*?from\s*['"]([^'"]+)['"]/g,
  /import\s*['"]([^'"]+)['"]/g,
  /export\s[^;]*?from\s*['"]([^'"]+)['"]/g,
  /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

/**
 * Mask ordinary string literals BEFORE comment-stripping and scanning so
 * import-shaped text inside strings cannot false-positive. Specifier strings
 * (whose opening quote directly follows from/import context) survive; masking is
 * single-line only, so a stray apostrophe in a comment can never swallow code.
 * Template literals are out of scope — good enough for our sources.
 */
function maskOrdinaryStrings(text: string): string {
  return text.replace(
    /(['"])(?:\\.|(?!\1)[^\n\\])*\1/g,
    (literal: string, quote: string, offset: number, whole: string): string => {
      const before = whole.slice(Math.max(0, offset - 64), offset);
      return /(?:\bfrom|\bimport\s*\(?)\s*$/.test(before) ? literal : `${quote}${quote}`;
    },
  );
}

function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
}

function extractModuleSpecifiers(source: string): string[] {
  const scannable = stripComments(maskOrdinaryStrings(source));
  const specifiers: string[] = [];
  for (const pattern of SPECIFIER_PATTERNS) {
    for (const match of scannable.matchAll(pattern)) {
      specifiers.push(match[1]!);
    }
  }
  return specifiers;
}

/** Base package name for an unscoped pillkit specifier ('pillkit-x/y' -> 'pillkit-x'). */
function workspacePackageOf(specifier: string): string | null {
  if (!specifier.startsWith('pillkit-')) return null;
  return specifier.split('/')[0]!;
}

/**
 * Relative imports escaping their own package: resolve the ../ chain from the
 * file's directory, map the target onto the workspace package it lands in, and
 * apply the same AD-4 matrix. Escapes that leave the workspace entirely fail too.
 */
function relativeEscapeViolation(
  specifier: string,
  filePath: string,
  packageDir: string,
  allowed: readonly string[],
): string | null {
  if (!specifier.startsWith('.')) return null;
  const packageRoot = join(REPO_ROOT, packageDir);
  const target = resolve(dirname(filePath), specifier);
  const targetRel = relative(packageRoot, target);
  if (!targetRel.startsWith('..') && !isAbsolute(targetRel)) return null; // stays inside its own package
  const allowedList = allowed.length === 0 ? 'none' : allowed.join(', ');
  const targetDir = Object.keys(AD4_MATRIX).find((dir) => {
    const rel = relative(join(REPO_ROOT, dir), target);
    return !rel.startsWith('..') && !isAbsolute(rel);
  });
  if (targetDir === undefined) {
    return `${filePath}: relative import '${specifier}' leaves ${packageDir} and points outside the workspace`;
  }
  const targetPackage = `pillkit-${targetDir.split('/')[1]}`;
  if (allowed.includes(targetPackage)) return null;
  const fr17Note = fr17Groups(packageDir).includes(targetPackage) ? ` [${FR17_MESSAGE}]` : '';
  return `${filePath}: relative import '${specifier}' resolves to ${targetPackage} (allowed: ${allowedList})${fr17Note}`;
}

function violationsIn(
  source: string,
  filePath: string,
  packageDir: string,
  allowed: readonly string[],
): string[] {
  const violations: string[] = [];
  const fr17 = new Set(fr17Groups(packageDir));
  for (const specifier of extractModuleSpecifiers(source)) {
    const pkg = workspacePackageOf(specifier);
    if (pkg !== null && !allowed.includes(pkg)) {
      const fr17Note = fr17.has(pkg) ? ` [${FR17_MESSAGE}]` : '';
      violations.push(
        `${filePath}: imports ${pkg} (allowed: ${allowed.length === 0 ? 'none' : allowed.join(', ')})${fr17Note}`,
      );
      continue;
    }
    const escape = relativeEscapeViolation(specifier, filePath, packageDir, allowed);
    if (escape !== null) violations.push(escape);
  }
  return violations;
}

function* walkSources(dir: string): Generator<string> {
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
      yield* walkSources(full);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      yield full;
    }
  }
}

function readBuiltArtifact(relativePath: string): string {
  const artifactPath = join(REPO_ROOT, relativePath);
  try {
    return readFileSync(artifactPath, 'utf8');
  } catch {
    throw new Error(
      `${artifactPath} not found — run \`pnpm build\` before \`pnpm test\` (AC chain: install -> build -> test)`,
    );
  }
}

describe('AD-4 import boundaries (spec 1.1, matrix row 2)', () => {
  it('committed sources contain no forbidden cross-package imports', () => {
    const violations: string[] = [];
    for (const [packageDir, allowed] of Object.entries(AD4_MATRIX)) {
      for (const root of SCAN_ROOTS[packageDir]!) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          violations.push(...violationsIn(readFileSync(filePath, 'utf8'), filePath, packageDir, allowed));
        }
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `AD-4 import-boundary violations (allowed directions: ${CANONICAL_DIRECTIONS}):\n${violations
          .map((violation) => `  - ${violation}`)
          .join('\n')}`,
      );
    }
    expect(violations).toHaveLength(0);
  });

  it('matcher flags synthesized forbidden specifiers (negative self-check)', () => {
    // Path is only used for specifier resolution — no file is created.
    const syntheticPath = join(REPO_ROOT, 'packages/tokens/src/__synthetic__.ts');
    const badSource = [
      "import { x } from 'pillkit-components';",
      "export * from 'pillkit-react/sub';",
      "import 'pillkit-docs';",
      "const dynamic = () => import('pillkit-tokens');",
      "import { r } from '../../react/src/index.js';",
      "import { fine } from 'lit';",
      "import './sibling.js';",
      'const decoy = "import { fake } from \'pillkit-react\';";',
    ].join('\n');
    const found = violationsIn(badSource, syntheticPath, 'packages/tokens', AD4_MATRIX['packages/tokens']!);
    expect(found).toHaveLength(5);
    expect(found.every((line) => line.startsWith(syntheticPath))).toBe(true);
  });

  it('matcher flags FR-17 cross-family edges in BOTH directions and exempts docs (spec 15.1)', () => {
    // Paths are only used for specifier resolution — no files are created.
    // Direction 1: tj-* → bank family.
    const tjPath = join(REPO_ROOT, 'packages/tj-components/src/__synthetic__.ts');
    const tjFound = violationsIn(
      "import { x } from 'pillkit-components';",
      tjPath,
      'packages/tj-components',
      AD4_MATRIX['packages/tj-components']!,
    );
    expect(tjFound).toHaveLength(1);
    expect(tjFound[0]).toContain(FR17_MESSAGE);

    // Direction 2: bank family → tj-*.
    const bankPath = join(REPO_ROOT, 'packages/components/src/__synthetic__.ts');
    const bankFound = violationsIn(
      "import { x } from 'pillkit-tj-tokens';",
      bankPath,
      'packages/components',
      AD4_MATRIX['packages/components']!,
    );
    expect(bankFound).toHaveLength(1);
    expect(bankFound[0]).toContain(FR17_MESSAGE);

    // The docs exemption: docs composes BOTH families (AD-4 v5).
    const docsPath = join(REPO_ROOT, 'packages/docs/src/__synthetic__.ts');
    const docsFound = violationsIn(
      "import { x } from 'pillkit-tj-tokens';\nimport { y } from 'pillkit-tokens';",
      docsPath,
      'packages/docs',
      AD4_MATRIX['packages/docs']!,
    );
    expect(docsFound).toEqual([]);

    // A relative-path FR-17 escape names FR-17 too.
    const tjEscape = relativeEscapeViolation(
      '../../components/src/index.js',
      tjPath,
      'packages/tj-components',
      AD4_MATRIX['packages/tj-components']!,
    );
    expect(tjEscape).toContain('pillkit-components');
    expect(tjEscape).toContain(FR17_MESSAGE);
  });
});

describe('AD-4 single-source module (spec 9.2)', () => {
  it('type twin declares exactly the module runtime exports (shape-assert)', () => {
    const twin = readFileSync(join(REPO_ROOT, 'ad4-matrix.d.mts'), 'utf8');
    const declared = [...twin.matchAll(/export\s+(?:declare\s+)?(?:const|function)\s+([A-Za-z0-9_]+)/g)].map(
      (match) => match[1]!,
    );
    const module = ad4Module;
    const runtime = Object.keys(module).sort();
    expect(declared.sort()).toEqual(runtime);
    expect(runtime.length, 'twin <-> module export sets diverged').toBe(declared.length);
  });

  it('eslint config restriction blocks equal the derived module exports (structure equality)', () => {
    const blocks = (eslintConfig as Array<Record<string, unknown>>).filter(
      (block) =>
        typeof block === 'object' &&
        block !== null &&
        'rules' in block &&
        (block['rules'] as Record<string, unknown>)['no-restricted-imports'] !== undefined,
    ) as Array<{ files: string[]; rules: Record<string, unknown> }>;
    const restricted = PACKAGE_DIRS.filter(
      (packageDir) => forbiddenGroups(packageDir).length > 0 || escapeRegexSource(packageDir) !== null,
    );
    expect(blocks).toHaveLength(restricted.length);
    for (const packageDir of restricted) {
      const block = blocks.find(({ files }) =>
        files.some((glob) => glob.startsWith(`${packageDir}/`)),
      );
      expect(block, `no eslint restriction block derived for ${packageDir}`).toBeDefined();
      const patterns = (
        (block!.rules['no-restricted-imports'] as [string, { patterns: Array<Record<string, string>> }])[1]
      ).patterns;
      const groupPattern = patterns.find((pattern) => 'group' in pattern);
      const regexPattern = patterns.find((pattern) => 'regex' in pattern);
      if (forbiddenGroups(packageDir).length > 0) {
        expect(groupPattern?.group).toEqual(forbiddenGroups(packageDir));
      } else {
        expect(groupPattern).toBeUndefined();
      }
      expect(regexPattern?.regex ?? null).toEqual(escapeRegexSource(packageDir));
      for (const pattern of patterns) {
        expect(pattern.message, `${packageDir} message must embed CANONICAL_DIRECTIONS`).toContain(
          CANONICAL_DIRECTIONS,
        );
      }
      // FR-17 message pin (spec 15.1 review): when this package's
      // restrictions span the family edge, EVERY message names FR-17; when
      // they don't (docs composes both families), none may — the exemption
      // is pinned as tightly as the restriction.
      const fr17Expected = fr17Groups(packageDir).length > 0;
      for (const pattern of patterns) {
        expect(
          pattern.message?.includes(FR17_MESSAGE),
          `${packageDir} message ${fr17Expected ? 'must' : 'must NOT'} embed FR-17`,
        ).toBe(fr17Expected);
      }
    }
  });

  it('README pins the canonical directions line verbatim', () => {
    const readme = readFileSync(join(REPO_ROOT, 'README.md'), 'utf8');
    expect(readme, 'README must carry ad4-matrix CANONICAL_DIRECTIONS verbatim').toContain(
      CANONICAL_DIRECTIONS,
    );
  });
});

describe('react build isolation (spec 1.1, matrix row 3)', () => {
  it('keeps pillkit-components as an external import/export specifier', () => {
    const artifact = readBuiltArtifact('packages/react/dist/index.js');
    expect(/from\s*['"]pillkit-components['"]/.test(artifact)).toBe(true);
  });

  it('does not bundle Lit source', () => {
    const artifact = readBuiltArtifact('packages/react/dist/index.js');
    // An *import* of Lit identifiers would be fine (external); a definition means bundled source.
    expect(/\b(?:class|const|let|var|function)\s+LitElement\b/.test(artifact)).toBe(false);
    expect(/\b(?:class|const|let|var|function)\s+ReactiveElement\b/.test(artifact)).toBe(false);
    expect(/['"]@lit\/reactive-element['"]/.test(artifact)).toBe(false);
  });
});

describe('tj-react build isolation (spec 15.1, the bank mold second instance)', () => {
  it('vite externals pin the workspace family external (both families, one regex)', () => {
    const config = readFileSync(join(REPO_ROOT, 'packages/tj-react/vite.config.ts'), 'utf8');
    expect(config).toContain('/^pillkit-/');
    expect(config).toContain('/^@lit\\//');
    expect(config).toContain('/^react$/');
  });

  it('the scaffold artifact inlines no workspace or Lit source', () => {
    // Scaffold grade: the entry is empty by design (spec 15.1 — no wrapper
    // precedes its element), so there is no pillkit-tj-components import to
    // keep external YET; isolation asserts as "nothing bundled". The strict
    // bank-grade check (external import present in the artifact) becomes
    // assertable when the first wrapper lands (epic 16).
    const artifact = readBuiltArtifact('packages/tj-react/dist/index.js');
    expect(/from\s*['"]pillkit-/.test(artifact)).toBe(false);
    expect(/\b(?:class|const|let|var|function)\s+LitElement\b/.test(artifact)).toBe(false);
    expect(/\b(?:class|const|let|var|function)\s+ReactiveElement\b/.test(artifact)).toBe(false);
  });
});

describe('tokens stylesheet artifact (spec 1.1 review: ./tokens.css export target)', () => {
  it('dist/index.css exists and carries --tk- custom properties', () => {
    const css = readBuiltArtifact('packages/tokens/dist/index.css');
    expect(/--tk-/.test(css)).toBe(true);
  });
});
