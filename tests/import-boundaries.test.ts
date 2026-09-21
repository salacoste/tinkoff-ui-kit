import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Committed guards for the two spec-1.1 matrix rows that were originally verified
 * ad hoc (add-then-revert lint probe, dist grep):
 *
 * - Row 2 (import-boundary violation -> lint fails): static scan of workspace
 *   sources against the AD-4 import matrix. Belt to eslint's `no-restricted-imports`
 *   braces — it runs in `pnpm test`, so the test gate alone cannot pass a tree
 *   that violates the allowed directions (components→tokens, react→components,
 *   docs→{react, components, tokens}). Relative imports that resolve out of their
 *   package are mapped to the target package and checked against the same matrix.
 * - Row 3 (build isolation): reads the built `packages/react` artifact and asserts
 *   `@tk-kit/components` stayed external and no Lit source got bundled; also guards
 *   the `@tk-kit/tokens` `./tokens.css` export target (`dist/index.css`).
 *
 * Build-artifact assumption: `pnpm build` precedes `pnpm test` — the AC command
 * chain is `pnpm install && pnpm build && pnpm test`. This suite reads `dist/` as
 * built; it does not build.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

/** AD-4 allowed import directions: package dir -> allowed @tk-kit/* specifiers. */
const AD4_MATRIX: Record<string, readonly string[]> = {
  'packages/tokens': [],
  'packages/components': ['@tk-kit/tokens'],
  'packages/react': ['@tk-kit/components'],
  // docs may import every kit package (AD-4).
  'packages/docs': ['@tk-kit/react', '@tk-kit/components', '@tk-kit/tokens'],
};

/**
 * Per-package scan roots — this vitest suite is the ONE net covering docs
 * .storybook (chosen over an eslint glob so the boundary rules live in a
 * single place; eslint keeps no docs-specific restriction). The Storybook
 * config dir imports workspace packages (preview.ts pulls the tokens sheet)
 * and must not sit outside the matrix walk.
 */
const SCAN_ROOTS: Record<string, readonly string[]> = {
  'packages/tokens': ['src'],
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/docs': ['src', '.storybook'],
};

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

/** Base package name for a scoped @tk-kit specifier ('@tk-kit/x/y' -> '@tk-kit/x'). */
function workspacePackageOf(specifier: string): string | null {
  if (!specifier.startsWith('@tk-kit/')) return null;
  const segments = specifier.split('/');
  return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : null;
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
  const targetPackage = `@tk-kit/${targetDir.split('/')[1]}`;
  return allowed.includes(targetPackage)
    ? null
    : `${filePath}: relative import '${specifier}' resolves to ${targetPackage} (allowed: ${allowedList})`;
}

function violationsIn(
  source: string,
  filePath: string,
  packageDir: string,
  allowed: readonly string[],
): string[] {
  const violations: string[] = [];
  for (const specifier of extractModuleSpecifiers(source)) {
    const pkg = workspacePackageOf(specifier);
    if (pkg !== null && !allowed.includes(pkg)) {
      violations.push(
        `${filePath}: imports ${pkg} (allowed: ${allowed.length === 0 ? 'none' : allowed.join(', ')})`,
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
        `AD-4 import-boundary violations (allowed directions: components→tokens, react→components, docs→{react, components, tokens}):\n${violations
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
      "import { x } from '@tk-kit/components';",
      "export * from '@tk-kit/react/sub';",
      "import '@tk-kit/docs';",
      "const dynamic = () => import('@tk-kit/tokens');",
      "import { r } from '../../react/src/index.js';",
      "import { fine } from 'lit';",
      "import './sibling.js';",
      'const decoy = "import { fake } from \'@tk-kit/react\';";',
    ].join('\n');
    const found = violationsIn(badSource, syntheticPath, 'packages/tokens', AD4_MATRIX['packages/tokens']!);
    expect(found).toHaveLength(5);
    expect(found.every((line) => line.startsWith(syntheticPath))).toBe(true);
  });
});

describe('react build isolation (spec 1.1, matrix row 3)', () => {
  it('keeps @tk-kit/components as an external import/export specifier', () => {
    const artifact = readBuiltArtifact('packages/react/dist/index.js');
    expect(/from\s*['"]@tk-kit\/components['"]/.test(artifact)).toBe(true);
  });

  it('does not bundle Lit source', () => {
    const artifact = readBuiltArtifact('packages/react/dist/index.js');
    // An *import* of Lit identifiers would be fine (external); a definition means bundled source.
    expect(/\b(?:class|const|let|var|function)\s+LitElement\b/.test(artifact)).toBe(false);
    expect(/\b(?:class|const|let|var|function)\s+ReactiveElement\b/.test(artifact)).toBe(false);
    expect(/['"]@lit\/reactive-element['"]/.test(artifact)).toBe(false);
  });
});

describe('tokens stylesheet artifact (spec 1.1 review: ./tokens.css export target)', () => {
  it('dist/index.css exists and carries --tk- custom properties', () => {
    const css = readBuiltArtifact('packages/tokens/dist/index.css');
    expect(/--tk-/.test(css)).toBe(true);
  });
});
