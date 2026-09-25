import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Kit-wide `:host([hidden])` guard (story 8.1, executing deferred-work 6.3 N6
 * + the 6.2 visual-gate finding): every component style sheet that sets a
 * plain `:host { display: … }` MUST also carry the explicit
 * `:host([hidden]) { display: none }` rule in the SAME sheet.
 *
 * Why: the UA stylesheet's `[hidden] { display: none }` is UA-origin — ANY
 * author `:host` display declaration (block, flex, inline-flex…) out-ranks
 * it regardless of specificity, so without the explicit guard a consumer's
 * `hidden` attribute on the host element silently RENDERS. The kit learned
 * this twice (the 6.2 closed-panel finding; the combobox-search quick-review
 * N6) before this sweep made the guard universal.
 *
 * Mechanization shape (the store-badges.test.ts HIDDEN-pin mold, lifted to a
 * pattern over every sheet): happy-dom ignores adoptedStyleSheets for Lit, so
 * the pin runs on the sheet TEXT — comments stripped (the guard's own
 * explanatory comment mentions `:host`, and a comment must never satisfy or
 * trip the matcher), one css`` template at a time so multi-sheet files
 * (select.css.ts: the trigger sheet AND the menu sheet) cannot borrow each
 * other's guard.
 *
 * Tripwires keep the scan non-vacuous:
 * - the pinned sheet count (33) fails loudly when a sheet joins or leaves
 *   the host-display family — joining forces the guard decision deliberately;
 * - a component directory whose `<name>.css.ts` exists but contributes zero
 *   css`` templates is a parse surprise, not a pass.
 *
 * Scope note: the guard is INERT in every rendered story (no story sets
 * `hidden` on a host), so it changes no baseline — the visual suite proves
 * the nothing-moved half by staying green.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const COMPONENTS_SRC = join(REPO_ROOT, 'packages', 'components', 'src');

/**
 * The pinned number of sheets that set a plain `:host { … display }` (8.1):
 * 27 component files, of which six carry TWO host-display sheets each
 * (select: trigger + menu; combobox-search/filter-chips: host + menu panel;
 * modal/tooltip/cookie-banner: host + surface) — 21 + 12 = 33.
 */
const PINNED_HOST_DISPLAY_SHEETS = 33;

interface SheetFinding {
  component: string;
  file: string;
  sheetIndex: number;
  hostDisplay: string;
  guard: boolean;
}

function stripComments(text: string): string {
  // Keep the newlines a block comment spans so sheet indices stay true.
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

function auditSheets(): SheetFinding[] {
  const findings: SheetFinding[] = [];
  for (const entry of readdirSync(COMPONENTS_SRC).sort()) {
    const dir = join(COMPONENTS_SRC, entry);
    if (!statSync(dir).isDirectory()) continue;
    const cssFile = join(dir, `${entry}.css.ts`);
    let text: string;
    try {
      text = readFileSync(cssFile, 'utf8');
    } catch {
      continue; // no sheet for this dir (shared infra dirs have none)
    }
    const sheets = [...text.matchAll(/css`([\s\S]*?)`/g)].map((m) => stripComments(m[1]));
    expect(
      sheets.length,
      `${entry}.css.ts exists but contributes zero css\`\` templates — a parse surprise, not a pass`,
    ).toBeGreaterThan(0);
    sheets.forEach((sheet, index) => {
      // Plain `:host {` at line start ONLY — `:host([disabled])`-style
      // compound selectors and selector lists (`:host, :host([data-x])`)
      // never match (the combined reduced-motion belt sets animation, not
      // display; a future list rule that DID set display would match neither
      // arm and the pinned sheet count would drift — the tripwire).
      const hostBody = sheet.match(/^ {2}:host \{([^}]*)\}/m)?.[1] ?? '';
      if (!/\bdisplay\s*:/.test(hostBody)) return;
      findings.push({
        component: entry,
        file: `${entry}/${entry}.css.ts`,
        sheetIndex: index,
        hostDisplay: hostBody.match(/display\s*:\s*([^;}]+)/)?.[1]?.trim() ?? '(unparsable)',
        guard: /:host\(\[hidden\]\) \{[^}]*display\s*:\s*none/.test(sheet),
      });
    });
  }
  return findings;
}

describe('kit-wide :host([hidden]) guard (story 8.1, deferred-work 6.3 N6)', () => {
  it('every sheet that sets :host display carries the :host([hidden]) display:none guard in the SAME sheet', () => {
    const findings = auditSheets();
    const missing = findings.filter((f) => !f.guard);
    expect(
      missing,
      missing
        .map((f) => `${f.file} sheet #${f.sheetIndex} sets :host{display:${f.hostDisplay}} with no [hidden] guard`)
        .join('\n'),
    ).toEqual([]);
  });

  it('tripwire: the host-display sheet roster is the pinned 33 — a new sheet joining the family forces a deliberate guard decision', () => {
    const findings = auditSheets();
    expect(findings).toHaveLength(PINNED_HOST_DISPLAY_SHEETS);
    // 27 component files; six of them contribute a second host-display sheet.
    expect(new Set(findings.map((f) => f.component)).size).toBe(27);
    const doubled = findings.filter(
      (f, i, all) => all.slice(0, i).some((prev) => prev.component === f.component),
    );
    expect(doubled.map((f) => f.component)).toEqual([
      'combobox-search',
      'cookie-banner',
      'filter-chips',
      'modal',
      'select',
      'tooltip',
    ]);
  });
});
