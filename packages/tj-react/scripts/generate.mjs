#!/usr/bin/env node
// React wrapper generator — ТЖ input (story 16.1; AD-1 v5: the parameterized
// bank machinery, NOT a fork).
//
// The MECHANISM lives at the repo root (scripts/wrapper-gen/core.mjs, story
// 16.1: ONE mechanism, TWO inputs — the 15.2 token-generator split mirrored
// on the wrapper side; root placement is the FR-17 ruling, the ad4-matrix/
// token-gen precedent — zero import edges on packages/react/**). THIS file
// is the ТЖ family's config + thin CLI: manifest path, tj- tag prefix, and
// the pillkit-tj-components import surface the generated wrappers bind to.
//
// Reads the committed Custom Elements Manifest of pillkit-tj-components and
// writes one kit wrapper per custom-element definition into src/generated/:
// each file is a single createKitComponent call (src/kit-component.ts — the
// ТЖ instance of the unwrap bridge, a documented FR-17-driven duplication of
// the bank runtime contract) driven by the ТЖ-owned event registry
// (src/event-map.ts — EMPTY at 16.1: the reading primitives dispatch no kit
// events; link/cta ride the native composed `click`).
//
// Deterministic: same manifest in, same bytes out (sorted by tag name, no
// timestamps) — the root `check:gen` drift gate covers BOTH families.
//
// Run via `pnpm --filter pillkit-tj-react gen:wrappers` (root: `pnpm gen`).
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateWrappers } from '../../../scripts/wrapper-gen/core.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');

generateWrappers({
  manifestPath: join(REPO_ROOT, 'tj-components', 'custom-elements.json'),
  generatedDir: join(SCRIPT_DIR, '..', 'src', 'generated'),
  tagPrefix: 'tj-',
  elementsPackage: 'pillkit-tj-components',
  generatorLabel: 'packages/tj-react/scripts/generate.mjs',
  logLabel: 'generate-wrappers:tj',
  manifestCommand: 'pnpm --filter pillkit-tj-components gen:manifest',
});
