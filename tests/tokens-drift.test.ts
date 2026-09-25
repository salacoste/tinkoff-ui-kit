import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { TOKEN_NOTE_LITERALS, renderArtifacts } from '../packages/tokens/scripts/generate.mjs';

/**
 * Token-pipeline drift guard (spec 1.2 review): DESIGN.md is the sole source of
 * truth, and editing its values used to land with every gate green because no
 * test regenerated and compared. This suite renders the real DESIGN.md through
 * the imported generator and asserts each artifact body equals the committed
 * file — build-independent, same style as the other root guards. `pnpm
 * check:tokens-drift` covers the same invariant for CLI/ci use; this test makes
 * `pnpm test` fail on drift without the write step.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DESIGN_MD = join(
  REPO_ROOT,
  '_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/DESIGN.md',
);
const ARTIFACTS = {
  tokensCss: join(REPO_ROOT, 'packages/tokens/src/tokens.css'),
  tokensTs: join(REPO_ROOT, 'packages/tokens/src/tokens.ts'),
  tokensMd: join(REPO_ROOT, 'packages/tokens/src/TOKENS.md'),
} as const;

describe('token-pipeline drift (spec 1.2 review)', () => {
  it('committed artifacts equal a fresh render of DESIGN.md', () => {
    const artifacts = renderArtifacts(readFileSync(DESIGN_MD, 'utf8'));
    for (const [key, path] of Object.entries(ARTIFACTS)) {
      expect(artifacts[key as keyof typeof ARTIFACTS], `${path} drifted from DESIGN.md`).toBe(
        readFileSync(path, 'utf8'),
      );
    }
  });

  it('renderer fails loudly on mutated DESIGN.md values (negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace("text-secondary: '#616871'", "text-secondary: 'not-a-color'");
    expect(mutated, 'mutation did not apply — update the fixture to a current DESIGN.md value').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow();
  });

  it('renderer fails loudly on duplicate frontmatter keys (negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      'rounded:\n',
      "rounded:\n  sm: 8px\n  sm: 9px\n",
    );
    expect(mutated, 'mutation did not apply — the rounded: anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow();
  });

  it('renderer fails loudly on a dark palette key with no mapping entry (spec 1.3, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "  dark-tint-charcoal: '#333333'",
      "  dark-tint-charcoal: '#333333'\n  dark-foo: '#123456'",
    );
    expect(mutated, 'mutation did not apply — the dark-tint-charcoal anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/dark-foo/);
  });

  it('renderer fails loudly when a dark override targets a missing light semantic (spec 1.3, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace("  text-muted: '#959BA4'\n", '');
    expect(mutated, 'mutation did not apply — the text-muted anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/--tk-color-text-muted/);
  });

  it('renderer fails loudly on a reference to a missing target, naming the key (spec 6.1, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "delta-positive: '{colors.green-300}'",
      "delta-positive: '{colors.green-999}'",
    );
    expect(mutated, 'mutation did not apply — the delta-positive anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/delta-positive.*green-999/s);
  });

  it('renderer fails loudly on a reference cycle, naming the chain (spec 6.1, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "  white: '#FFFFFF'\n",
      "  white: '#FFFFFF'\n  ref-a: '{colors.ref-b}'\n  ref-b: '{colors.ref-a}'\n",
    );
    expect(mutated, 'mutation did not apply — the white anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/cycle.*colors\.ref-a.*colors\.ref-b.*colors\.ref-a/s);
  });

  it('renderer fails loudly on a reference targeting a dark-* palette key, naming key and target (spec 6.1 hardening, negative self-check)', () => {
    // A light key must never resolve to a dark-* value — emitting it into the
    // light layer is the one-way-flow footgun the guard exists for.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "delta-positive: '{colors.green-300}'",
      "delta-positive: '{colors.dark-base}'",
    );
    expect(mutated, 'mutation did not apply — the delta-positive anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(
      /delta-positive.*colors\.dark-base.*is a dark-\* palette key.*point the reference at a light key/s,
    );
  });

  it('renderer fails loudly on a malformed rgba literal, naming the key (spec 6.1, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "border-table: 'rgba(0,16,36,0.12)'",
      "border-table: 'rgba(0,16,999,0.12)'",
    );
    expect(mutated, 'mutation did not apply — the border-table anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/border-table/);
  });

  it('renderer fails loudly on a grammar-invalid rgba literal, naming the key (spec 6.1, negative self-check)', () => {
    // The probe above exercises the range branch (channels match the grammar,
    // 999 is out of range); this one exercises grammar REJECTION — a missing
    // alpha matches neither rgba() nor hex nor a reference.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      "border-table: 'rgba(0,16,36,0.12)'",
      "border-table: 'rgba(0,16,36)'",
    );
    expect(mutated, 'mutation did not apply — the border-table anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/border-table/);
  });

  it('renderer fails loudly on an unwired fonts key (spec 9.1, negative self-check)', () => {
    // The fonts block's allowed-key set is explicit — a new family slot must
    // wire into fontsModel deliberately, never render by guess.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mono = `  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'`;
    const mutated = original.replace(mono, `${mono}\n  serif: 'Georgia, serif'`);
    expect(mutated, 'mutation did not apply — the fonts mono anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(
      /unexpected fonts key 'serif' — wire new family slots into fontsModel deliberately/,
    );
  });

  it('renderer fails loudly when the fonts block is removed (spec 9.1, negative self-check)', () => {
    // TOKEN_BLOCKS membership is mandatory — like every token block, fonts
    // cannot silently disappear from the frontmatter.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      `fonts:\n  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'\n`,
      '',
    );
    expect(mutated, 'mutation did not apply — the fonts block anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/missing the 'fonts' token block/);
  });

  it('renderer fails loudly on a fonts value breaking the emission grammar (spec 9.1, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      `  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'`,
      `  mono: 'Menlo; monospace'`,
    );
    expect(mutated, 'mutation did not apply — the fonts mono anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/fonts\.mono/);
  });

  it('renderer fails loudly when the brown theme-invariant breaks (spec 9.1, negative self-check)', () => {
    // dark-tint-brown = tint-brown is asserted at generation (the charcoal
    // mold) — a drifted dark value must abort, not silently re-map the badge.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace("  dark-tint-brown: '#8D6040'", "  dark-tint-brown: '#7A5236'");
    expect(mutated, 'mutation did not apply — the dark-tint-brown anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/dark-tint-brown.*no longer equals tint-brown/);
  });

  it('renderer fails loudly on an unknown aa-annotations entry field (spec 9.2, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      '  text-secondary:\n    kind: override',
      '  text-secondary:\n    mood: dark\n    kind: override',
    );
    expect(mutated, 'mutation did not apply — the text-secondary entry anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(
      /unexpected field 'mood' in aa-annotations\.text-secondary/,
    );
  });

  it('renderer fails loudly on an out-of-grammar aa-annotations kind (spec 9.2, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace('  text-secondary:\n    kind: override', '  text-secondary:\n    kind: whim');
    expect(mutated, 'mutation did not apply — the text-secondary entry anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(
      /aa-annotations\.text-secondary\.kind: expected one of override \| addition \| restricted \| pairing \| measured/,
    );
  });

  it('renderer fails loudly on an aa-annotations name that is not a declared color semantic (spec 9.2, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace('  error-on-field:\n', '  brand-vibe:\n');
    expect(mutated, 'mutation did not apply — the error-on-field entry anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(
      /aa-annotations\.brand-vibe: not a declared color semantic/,
    );
  });

  it('renderer fails loudly when a verified entry loses its story pointer (spec 9.2, negative self-check)', () => {
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace("  tint-brown:\n    kind: measured\n    status: verified\n    story: '9.1'\n", '  tint-brown:\n    kind: measured\n    status: verified\n');
    expect(mutated, 'mutation did not apply — the tint-brown entry anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/tint-brown.*requires.*story/);
  });

  it('renderer fails loudly when a Colors-body edit removes the anchored fact (spec 9.2, negative self-check)', () => {
    // focus-ring anchors ONLY on the AA-table row (its sole fact is the
    // border-default 1.23:1 ratio; its frontmatter declaration carries
    // #1771E6 which the note text never cites) — editing the ratio away must
    // abort instead of shipping a stale annotation.
    const original = readFileSync(DESIGN_MD, 'utf8');
    // Body-unique wording (the block's own text phrases the same fact
    // differently, and the frontmatter precedes the body — a bare fact
    // replace would hit the block first).
    const mutated = original.replace(
      "site's ink-on-ink = invisible; border-default = 1.23:1",
      "site's ink-on-ink = invisible; border-default is too weak",
    );
    expect(mutated, 'mutation did not apply — the focus-ring body anchor moved').not.toBe(original);
    expect(() => renderArtifacts(mutated)).toThrow(/aa-annotations\.focus-ring: note no longer anchors/);
  });

  it('[ASSUMPTION] machinery: an assumed entry emits the flag and counts in the derived status line (spec 9.2)', () => {
    // Zero open flags ship today BY DESIGN — the machinery proves itself via
    // this probe: flip one status to assumed and the note carries the flag,
    // the derived TOKENS.md line counts it and names it.
    const original = readFileSync(DESIGN_MD, 'utf8');
    const mutated = original.replace(
      '  text-muted:\n    kind: restricted\n    status: verified',
      '  text-muted:\n    kind: restricted\n    status: assumed',
    );
    expect(mutated, 'mutation did not apply — the text-muted entry anchor moved').not.toBe(original);
    const { tokensMd } = renderArtifacts(mutated);
    expect(tokensMd).toContain('[ASSUMPTION] Restricted: placeholder/disabled/non-essential text only');
    expect(tokensMd).toContain('1 open `[ASSUMPTION]` flags — OPEN: text-muted');
  });

  it('the AA-note migration is complete: every remaining literal is non-AA-class and absent from the block (spec 9.2)', () => {
    // Day-one truth of both migration aborts: no literal carries a contrast
    // ratio or an AA ruling (those must live in the DESIGN.md block), and no
    // literal name is also a block entry (double source). The block side is
    // read from the committed TOKENS.md derived status line.
    const aaBearing = (text: string) => /\d+\.\d+:1/.test(text) || /\bAA\b/.test(text);
    const statusLine =
      readFileSync(ARTIFACTS.tokensMd, 'utf8')
        .split('\n')
        .find((line) => line.includes('open `[ASSUMPTION]` flags')) ?? '';
    const blockNames = new Set(
      [...statusLine.matchAll(/`?([a-z0-9-]+)`? \(Story \d+\.\d+\)/g)].map((match) => `--tk-color-${match[1]}`),
    );
    expect(blockNames.size, 'the derived status line names no block entries — anchor moved').toBe(10);
    for (const [name, literal] of TOKEN_NOTE_LITERALS) {
      expect(aaBearing(literal), `${name} literal is AA-bearing — must derive from the aa-annotations block`).toBe(
        false,
      );
      expect(blockNames.has(name), `${name} exists as BOTH a literal and a block entry — double source`).toBe(false);
    }
  });
});
