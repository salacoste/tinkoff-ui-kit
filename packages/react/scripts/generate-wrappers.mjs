// React wrapper generator — BANK input (spec 1.7 / AD-1).
//
// The MECHANISM lives at the repo root (scripts/wrapper-gen/core.mjs, story
// 16.1: ONE mechanism, TWO inputs — the 15.2 token-generator split mirrored
// on the wrapper side). THIS file is the bank family's config + thin CLI:
// manifest path, tk- tag prefix, and the pillkit-components import surface
// the generated wrappers bind to. Refactor proven byte-identical at 16.1 —
// `pnpm gen && git diff --exit-code` on this package's committed artifacts
// stayed clean BEFORE the ТЖ family was wired (the 15.2 precedent).
//
// Reads the committed Custom Elements Manifest of pillkit-components and
// writes one kit wrapper per custom-element definition into src/generated/:
// each file is a single createKitComponent call (src/kit-component.ts), which
// applies `@lit/react`'s createComponent with the owned event registry
// (src/event-map.ts) and unwraps `detail: { value }` payloads so React
// handlers receive the unwrapped value — never the raw CustomEvent (AD-1,
// frozen at Story 2.1; CONVENTIONS §9). Deterministic: same manifest in,
// same bytes out (sorted by tag name, no timestamps) — that is what makes
// the root `check:gen` drift gate (`pnpm gen && git diff --exit-code`) sound.
//
// No component behavior, styling, or a11y logic EVER lives here or in the
// generated files (AD-1) — wrappers import elements from the package root
// `pillkit-components` — the same public entry consumers use.
//
// Run via `pnpm --filter pillkit-react gen:wrappers` (root: `pnpm gen`).
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateWrappers } from '../../../scripts/wrapper-gen/core.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');

generateWrappers({
  manifestPath: join(REPO_ROOT, 'components', 'custom-elements.json'),
  generatedDir: join(SCRIPT_DIR, '..', 'src', 'generated'),
  tagPrefix: 'tk-',
  elementsPackage: 'pillkit-components',
  generatorLabel: 'packages/react/scripts/generate-wrappers.mjs',
  logLabel: 'generate-wrappers',
  manifestCommand: 'pnpm --filter pillkit-components gen:manifest',
});
