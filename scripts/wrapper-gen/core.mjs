/**
 * React wrapper-generation core — the kit-agnostic mechanism (story 16.1,
 * AD-1 v5: ONE mechanism, TWO inputs; the 15.2 token-generator split
 * `scripts/token-gen/core.mjs` mirrored on the wrapper side).
 *
 * Extracted from packages/react/scripts/generate-wrappers.mjs (stories
 * 1.7–2.1): everything a wrapper pipeline does lives HERE as one function
 * parameterized by a per-family config — manifest reading, element
 * collection, the deterministic rebuild, and the wrapper/barrel renderers.
 * No component behavior, styling, or a11y logic EVER lives here or in the
 * generated files (AD-1) — wrappers import elements from their family's
 * package root, the same public entry consumers use.
 *
 * Consumers (thin config'd CLIs, never forks — the token-gen mold):
 *   - packages/react/scripts/generate-wrappers.mjs      (bank: tk- prefix,
 *     pillkit-components manifest)
 *   - packages/tj-react/scripts/generate.mjs            (ТЖ: tj- prefix,
 *     pillkit-tj-components manifest)
 *
 * Root placement is the FR-17 ruling (the ad4-matrix.mjs/token-gen
 * precedent): root is shared tooling, not a package — the ТЖ CLI imports it
 * with zero edges on packages/react/**, so both families stay installable
 * alone and the bank output stays BYTE-IDENTICAL through the refactor
 * (proven by `pnpm gen && git diff --exit-code` on the bank artifacts at
 * the 16.1 refactor step, before any ТЖ side exists).
 *
 * Determinism contract (what makes the root `check:gen` drift gate sound):
 * same manifest in, same bytes out — sorted by tag name via plain code-unit
 * comparison (locale/ICU-independent), no timestamps.
 */
import { readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The per-family config. Every key is required — a misconfigured shim must
 * fail loudly at startup, never fall back to a default that quietly emits
 * the wrong family's artifacts.
 *
 * @param {string} config.manifestPath - committed custom-elements.json to read.
 * @param {string} config.generatedDir - output directory (cleaned then rebuilt).
 * @param {string} config.tagPrefix - element prefix stripped for file/class
 *   names ('tk-' | 'tj-').
 * @param {string} config.elementsPackage - the family package root the
 *   generated wrappers import their element classes from
 *   ('pillkit-components' | 'pillkit-tj-components').
 * @param {string} config.generatorLabel - the config'd CLI's repo path, baked
 *   into every generated file header (the AUTO-GENERATED provenance line).
 * @param {string} config.logLabel - console/log prefix for this family's run.
 * @param {string} config.manifestCommand - the regen hint embedded in error
 *   messages (e.g. 'pnpm --filter pillkit-components gen:manifest').
 */
export function generateWrappers(config) {
  const required = [
    'manifestPath',
    'generatedDir',
    'tagPrefix',
    'elementsPackage',
    'generatorLabel',
    'logLabel',
    'manifestCommand',
  ];
  const missing = required.filter((key) => typeof config[key] !== 'string' || config[key].length === 0);
  if (missing.length > 0) {
    throw new Error(
      `wrapper-gen: config is missing ${missing.map((key) => `'${key}'`).join(', ')} — a family CLI must pass the whole surface, never rely on defaults`,
    );
  }
  const { manifestPath, generatedDir, tagPrefix, elementsPackage, generatorLabel, logLabel } = config;

  /** `<prefix>segmented-radio` → `SegmentedRadio` (wrapper component name). */
  const wrapperName = (tag) => {
    const body = tag.replace(new RegExp(`^${tagPrefix}`), '');
    return body
      .split('-')
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('');
  };

  /** `<prefix>segmented-radio` → `segmented-radio` (generated file stem). */
  const fileStem = (tag) => tag.replace(new RegExp(`^${tagPrefix}`), '');

  /** Collect { tag, className } pairs from every custom-element-definition export. */
  function readElements(manifest) {
    const elements = [];
    const seen = new Map();
    for (const module of manifest.modules ?? []) {
      for (const exportEntry of module.exports ?? []) {
        if (exportEntry.kind !== 'custom-element-definition') continue;
        const className = exportEntry.declaration?.name;
        if (!className || typeof exportEntry.name !== 'string') {
          throw new Error(
            `${logLabel}: custom-element-definition without a resolvable class name in ${module.path} — re-run ${config.manifestCommand}`,
          );
        }
        const firstSeen = seen.get(exportEntry.name);
        if (firstSeen !== undefined) {
          throw new Error(
            `${logLabel}: duplicate tag '${exportEntry.name}' in the manifest (defined in both ${firstSeen} and ${module.path}) — one element, one definition; fix the manifest source`,
          );
        }
        seen.set(exportEntry.name, module.path);
        elements.push({ tag: exportEntry.name, className });
      }
    }
    if (elements.length === 0) {
      throw new Error(
        `${logLabel}: no custom-element definitions found in ${manifestPath} — the manifest must list at least one element (run ${config.manifestCommand})`,
      );
    }
    // Locale-independent sort: plain code-unit comparison, so generated output
    // is byte-identical on every machine regardless of ICU/locale collation.
    return elements.sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0));
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `${logLabel}: cannot read the Custom Elements Manifest at ${manifestPath}: ${error.message}. Generate it first: ${config.manifestCommand} (or pnpm gen at the root).`,
    );
  }

  const elements = readElements(manifest);

  // Clean rebuild: a removed element's wrapper must not linger as a stale
  // hand-edit — orphaned generated files are deleted with the rest.
  mkdirSync(generatedDir, { recursive: true });
  for (const entry of readdirSync(generatedDir)) {
    if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      rmSync(join(generatedDir, entry));
    }
  }

  for (const { tag, className } of elements) {
    const name = wrapperName(tag);
    const content = `// AUTO-GENERATED by ${generatorLabel} — DO NOT EDIT.
// Source: ${elementsPackage} custom-elements.json (${tag}). Regenerate: pnpm gen.
import * as React from 'react';

import { ${className} } from '${elementsPackage}';
import { createKitComponent } from '../kit-component.js';

export const ${name} = createKitComponent({
  displayName: '${name}',
  tagName: '${tag}',
  elementClass: ${className},
  react: React,
});
`;
    writeFileSync(join(generatedDir, `${fileStem(tag)}.ts`), content);
    console.log(`${logLabel}: src/generated/${fileStem(tag)}.ts (${tag} → ${name})`);
  }

  // Barrels keep a stable 1:1 order with the generated files.
  const indexContent = `// AUTO-GENERATED by ${generatorLabel} — DO NOT EDIT.
${elements.map(({ tag }) => `export * from './${fileStem(tag)}.js';`).join('\n')}
`;
  writeFileSync(join(generatedDir, 'index.ts'), indexContent);
  console.log(
    `${logLabel}: src/generated/index.ts (${elements.length} wrapper${elements.length === 1 ? '' : 's'})`,
  );
}
