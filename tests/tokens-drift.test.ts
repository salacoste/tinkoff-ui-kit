import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { renderArtifacts } from '../packages/tokens/scripts/generate.mjs';

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
});
