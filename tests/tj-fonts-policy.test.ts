import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * ТЖ fonts policy (story 15.3 — the OQ-8 closure, mechanized). The ТЖ token
 * layer carries its two-family font contract as STACKS with the licensed
 * names first (Graphik / Charter); the maintainer has delivered no licenses,
 * so the ruling is: stacks ship, font bytes NEVER do. This suite pins the
 * policy from both sides:
 *
 *   1. zero-fonts — no @font-face and no font file exists anywhere under
 *      packages/tj-tokens (sources + build artifacts): a Daytona-style
 *      bundling flip (license files + LICENSE-FONTS.md entry + THIS test) is
 *      one deliberate reviewable act, never an accident.
 *   2. frozen stacks — the generated slots carry the exact 15.2 strings
 *      (Graphik-first ui / Charter-first reading, Inter + PT Serif as the
 *      named open fallbacks). A generator edit that reshapes them lands here
 *      first, red, naming the slot.
 *   3. harness pins — tests/visual/fonts.css overrides BOTH --tj-font-*
 *      slots to the locally-served open faces (Inter / PT Serif), so ТЖ
 *      captures raster the pinned face on any machine, licensed fonts
 *      installed or not.
 *   4. load assertions — inject.ts actually loads + checks the PT Serif
 *      faces (the live gate; here only its mechanical presence is pinned).
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const TJ_TOKENS_DIR = join(REPO_ROOT, 'packages', 'tj-tokens');
const FONTS_CSS = join(REPO_ROOT, 'tests', 'visual', 'fonts.css');
const INJECT_TS = join(REPO_ROOT, 'tests', 'visual', 'inject.ts');
const SERVE_MJS = join(REPO_ROOT, 'tests', 'visual', 'serve.mjs');

/** The 15.2-frozen stack declarations — byte-exact, generated into tokens.css. */
const FROZEN_FONT_UI = '  --tj-font-ui: Graphik, Inter, -apple-system, system-ui, "Segoe UI", "Helvetica Neue", sans-serif;';
const FROZEN_FONT_READING = '  --tj-font-reading: Charter, "Bitstream Charter", "PT Serif", Georgia, serif;';

/** File extensions that ARE font bytes, and the text formats scanned for @font-face. */
const FONT_FILE_EXTENSIONS = new Set(['.woff', '.woff2', '.ttf', '.otf', '.eot']);
const TEXT_EXTENSIONS = new Set([
  '.css', '.ts', '.mts', '.cts', '.d.mts', '.d.ts', '.js', '.mjs', '.cjs', '.json', '.md', '.html', '.map',
]);

const listFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    // node_modules holds workspace symlinks (vitest runtime), not package bytes.
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = join(dir, entry.name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
};

describe('ТЖ fonts policy (story 15.3 — OQ-8 closure)', () => {
  it('zero-fonts: no @font-face and no font byte anywhere under packages/tj-tokens (sources + artifacts)', () => {
    const files = listFiles(TJ_TOKENS_DIR);
    // Sanity guard: the scan must actually see the generated layer — a
    // silently-empty walk (wrong root, renamed package) would pass vacuously.
    const relative = (path: string) => path.slice(TJ_TOKENS_DIR.length + 1);
    const names = new Set(files.map(relative));
    expect(files, 'the walk found nothing — did the tj-tokens package move?').not.toHaveLength(0);
    expect(names.has(join('src', 'tokens.css')), 'src/tokens.css missing from the scan').toBe(true);
    expect(names.has(join('src', 'tokens.ts')), 'src/tokens.ts missing from the scan').toBe(true);

    const fontFiles = files.filter((file) => FONT_FILE_EXTENSIONS.has(file.slice(file.lastIndexOf('.'))));
    expect(fontFiles.map(relative), 'font bytes must not ship in tj-tokens (OQ-8: no licenses delivered)').toEqual([]);

    const offenders: string[] = [];
    for (const file of files) {
      if (!TEXT_EXTENSIONS.has(file.slice(file.lastIndexOf('.')))) continue;
      if (readFileSync(file, 'utf8').includes('@font-face')) offenders.push(relative(file));
    }
    expect(offenders, '@font-face must not appear in tj-tokens — bundling is a deliberate licensed act, see tests/tj-fonts-policy.test.ts').toEqual([]);
  });

  it('frozen stacks: the generated font slots carry the exact 15.2 strings', () => {
    const css = readFileSync(join(TJ_TOKENS_DIR, 'src', 'tokens.css'), 'utf8');
    // Byte-exact pins — any generator edit to a stack value fails HERE first.
    expect(css).toContain(FROZEN_FONT_UI);
    expect(css).toContain(FROZEN_FONT_READING);
    // The properties the exact pins enforce, spelled out for the failure
    // reader: licensed family FIRST in each stack, open fallbacks named.
    expect(css).toContain('--tj-font-ui: Graphik,');
    expect(css).toContain('--tj-font-reading: Charter,');
    expect(FROZEN_FONT_UI).toContain('Inter');
    expect(FROZEN_FONT_READING).toContain('"PT Serif"');
  });

  it('harness pins: fonts.css overrides BOTH --tj-font-* slots to the served open faces', () => {
    const css = readFileSync(FONTS_CSS, 'utf8');
    expect(css).toContain('--tj-font-ui: Inter, sans-serif;');
    expect(css).toContain("--tj-font-reading: 'PT Serif', serif;");
    // The pin is served-local by construction: the faces resolve from the
    // serve.mjs mounts (/inter already bank-pinned, /pt-serif the 15.3 mount).
    expect(readFileSync(SERVE_MJS, 'utf8')).toContain(
      "join(REPO_ROOT, 'node_modules', '@fontsource', 'pt-serif')",
    );
  });

  it('inject.ts asserts the PT Serif faces (grep-level pin — the live check runs in the harness)', () => {
    const inject = readFileSync(INJECT_TS, 'utf8');
    expect(inject).toContain('PT_SERIF_WEIGHTS');
    expect(inject).toContain("load('PT Serif'");
    expect(inject).toContain("missing('PT Serif'");
  });
});
