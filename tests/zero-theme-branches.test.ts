import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * ZERO THEME BRANCHES (spec 5.4 — SM-5's mechanical half): theming flows
 * ONLY through `--tk-*` token consumption. No component source may branch
 * on the theme — not a `[data-theme` / `:host([data-theme` selector, not a
 * `data-theme` attribute read/write in TS, not `dataset.theme`, not a
 * `prefers-color-scheme` media query (the kit themes via the data-theme
 * token layer; the OS-scheme media query is consumer-side). AD-3.
 *
 * Scope = COMPONENT RUNTIME sources: everything under
 * packages/{components,react}/src plus packages/docs non-story sources,
 * MINUS the documented exemptions:
 * - `packages/tokens` — the token layer itself; `[data-theme="dark"]` is
 *   its one legitimate selector surface (tokens.css + generator + tests).
 * - `*.stories.ts` — docs/demo chrome, not component runtime: stories may
 *   PRINT the theming snippet in RU content (`<html data-theme="dark">`
 *   code samples) and read Storybook's own toolbar global to compose demo
 *   URLs (navbar.stories.ts builds an iframe src with `globals=theme:dark`).
 * - `*.test.ts` — tests may QUOTE the forbidden patterns while asserting
 *   their absence (link.test.ts pins `css).not.toContain('data-theme')`).
 * - `packages/docs/.storybook/preview.ts` — THE theme toggle decorator
 *   (writes `document.documentElement.dataset.theme`); the one runtime
 *   writer of the attribute in the repo, by design (spec 1.5).
 *
 * The detector is a deliberately blunt substring scan over comment-stripped
 * source: in component runtime there is NO legitimate occurrence of these
 * strings, so any hit (selector, attribute read, string literal) fails.
 * Walk tripwires mirror the zero-hardcoded guard: a vacuous scan (no files)
 * fails loudly.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');

const SCAN_ROOTS: Readonly<Record<string, readonly string[]>> = {
  'packages/components': ['src'],
  'packages/react': ['src'],
  'packages/docs': ['src', '.storybook'],
};
const SCANNED_EXTENSION = /\.(ts|tsx|css)$/;
/** Runtime sources only — stories/tests are the documented exemptions above. */
const EXCLUDED_FILE = /\.(stories|test)\.tsx?$/;
/** The docs theme-toggle decorator — the single exempt runtime file. */
const EXEMPT_FILES = new Set(['packages/docs/.storybook/preview.ts']);

/** Theme-branch patterns: any occurrence in component runtime is a violation. */
const THEME_BRANCH_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
  { pattern: /data-theme/g, label: "theme attribute/selector ('data-theme') — theming must flow through var(--tk-*) tokens, not a data-theme branch (AD-3)" },
  { pattern: /dataset\.theme/g, label: "dataset.theme read/write — the JS API face of the data-theme branch (AD-3)" },
  { pattern: /prefers-color-scheme/g, label: "prefers-color-scheme media query — the kit themes via the data-theme token layer; the OS scheme is consumer-side (AD-3)" },
  { pattern: /light-dark\(/g, label: "light-dark() color function — a per-scheme value fork; values must come from --tk-* tokens the dark layer remaps (AD-3)" },
  { pattern: /color-scheme/g, label: "color-scheme property — opts a surface into the UA dark palette instead of the kit's token layer (AD-3; the camelCase colorScheme capture pin in playwright.config.ts is outside scan scope)" },
];

function stripComments(text: string): string {
  // Keep the newlines a block comment spans so violation line numbers stay true.
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
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
    } else if (SCANNED_EXTENSION.test(entry) && !EXCLUDED_FILE.test(entry)) {
      yield full;
    }
  }
}

function violationsIn(source: string, filePath: string): string[] {
  const text = stripComments(source);
  const violations: string[] = [];
  for (const { pattern, label } of THEME_BRANCH_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      violations.push(`${filePath}:${lineOf(text, match.index ?? 0)}: ${label}`);
    }
  }
  return violations;
}

describe('zero component-level theme branches (spec 5.4, SM-5)', () => {
  it('component runtime sources contain no data-theme / dataset.theme / prefers-color-scheme / light-dark() / color-scheme branches', () => {
    const violations: string[] = [];
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      for (const root of roots) {
        for (const filePath of walkSources(join(REPO_ROOT, packageDir, root))) {
          const relative = filePath.slice(REPO_ROOT.length + 1);
          if (EXEMPT_FILES.has(relative)) continue;
          violations.push(...violationsIn(readFileSync(filePath, 'utf8'), relative));
        }
      }
    }
    expect(
      violations,
      'theming crosses shadow boundaries ONLY via --tk-* custom properties (AD-3/FR-1); a theme branch here is the SM-5 violation this guard exists to catch',
    ).toEqual([]);
  });

  it('scans a non-empty runtime file set (vacuous-walk guard)', () => {
    for (const [packageDir, roots] of Object.entries(SCAN_ROOTS)) {
      const files = roots
        .flatMap((root) => [...walkSources(join(REPO_ROOT, packageDir, root))])
        .filter((filePath) => !EXEMPT_FILES.has(filePath.slice(REPO_ROOT.length + 1)));
      expect(
        files.length,
        `vacuous scan: no runtime files found under ${packageDir}/${roots.join('|')} — the guard would prove nothing`,
      ).toBeGreaterThan(0);
    }
  });

  it('the exemption list is not stale (every named exempt file exists)', () => {
    for (const exempt of EXEMPT_FILES) {
      expect(
        () => statSync(join(REPO_ROOT, exempt)),
        `exempt file ${exempt} no longer exists — prune the exemption`,
      ).not.toThrow();
    }
  });

  it('detector flags synthesized theme branches (negative self-check)', () => {
    const offenders = [
      ':host([data-theme="dark"]) .button { color: #fff; }',
      '[data-theme=dark] .card { background: black; }',
      "if (host.getAttribute('data-theme') === 'dark') this.tint = true;",
      "root.setAttribute('data-theme', 'dark');",
      'const theme = document.documentElement.dataset.theme;',
      '@media (prefers-color-scheme: dark) { .panel { color: white; } }',
      '.button { color: light-dark(#333333, #ffffff); }',
      ':host { color-scheme: dark; }',
    ];
    for (const source of offenders) {
      const found = violationsIn(source, 'synthetic');
      expect(found.length, `expected a violation in: ${source}`).toBeGreaterThan(0);
    }
  });

  it('detector passes token-only styling and comment mentions (negative self-check)', () => {
    const clean = [
      ':host { color: var(--tk-color-text-primary); }',
      '[data-other="x"] .a { color: var(--tk-color-link); }',
      'const theme = context.globals.theme;', // Storybook toolbar global — stories only
      '// mention data-theme in a comment only',
      '/* prefers-color-scheme in a comment only */',
    ];
    for (const source of clean) {
      expect(violationsIn(source, 'synthetic'), `expected no violation in: ${source}`).toEqual([]);
    }
  });
});
