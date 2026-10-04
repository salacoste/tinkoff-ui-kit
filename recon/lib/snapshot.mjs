// Snapshot layer (spec 25.1 AC4): normalize everything into KitSnapshot and
// append to recon/snapshots/<kit>.jsonl. Appends are idempotent per version —
// rerunning the same kit@version must leave the file byte-identical.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Assemble the KitSnapshot from harvest inputs.
 *
 * @param {object} input
 * @param {string} input.kit roster id
 * @param {string | null} input.npm npm name (null for repo-only/local targets)
 * @param {string} input.version resolved version
 * @param {any} input.meta registry/workspace metadata (packumentMeta shape or local pack info)
 * @param {import('./extract.mjs').ScanResult} input.scan
 * @param {{components: any[], notes: string[]}} input.cemResult
 * @param {{tokens: any[], notes: string[]}} input.tokenResult
 */
export function buildSnapshot({ kit, npm, version, meta, scan, cemResult, tokenResult }) {
  const packageJson = scan.packageJson ?? {};
  const exportsMap = packageJson.exports ? Object.keys(packageJson.exports).sort() : [];
  return {
    kit,
    npm,
    version,
    fetchedAt: new Date().toISOString(),
    meta: {
      ...meta,
      name: packageJson.name ?? null,
      license: meta.license ?? packageJson.license ?? null,
      type: packageJson.type ?? null,
      exports: exportsMap,
    },
    artifactsFound: {
      cem: Boolean(scan.cem),
      cemPath: scan.cemPath,
      dtsCount: scan.dtsPaths.length,
      dtsComponents: (scan.dtsComponentPaths ?? []).length,
      tokenJsonCount: scan.tokenJsonPaths.length,
      themeFiles: scan.themePaths.slice(0, 60),
      stylesheets: scan.stylesheetPaths.length,
      readme: scan.readme !== null,
    },
    components: cemResult.components,
    tokens: tokenResult.tokens,
    notes: [
      ...cemResult.notes,
      ...tokenResult.notes,
      ...(cemResult.components.length === 0 && (scan.dtsComponentPaths ?? []).length > 0
        ? [`no CEM; d.ts inventory carries ${scan.dtsComponentPaths.length} component/directive declarations (path-derived, not typed API)`]
        : []),
    ],
  };
}

/**
 * Idempotent JSONL append: a snapshot for the same {kit, npm, version} is
 * skipped unless the stored one was fetched with a different tool state
 * (force). Pure over (lines, snapshot) so tests exercise it hermetically.
 *
 * @param {string[]} lines existing JSONL lines
 * @param {any} snapshot
 * @param {{force?: boolean}} [options]
 * @returns {{lines: string[], action: 'appended'|'skipped'}}
 */
export function appendSnapshot(lines, snapshot, options = {}) {
  const already = lines.some((line) => {
    try {
      const prior = JSON.parse(line);
      return prior.kit === snapshot.kit && prior.npm === snapshot.npm && prior.version === snapshot.version;
    } catch {
      return false;
    }
  });
  if (already && !options.force) return { lines, action: 'skipped' };
  return { lines: [...lines, JSON.stringify(snapshot)], action: 'appended' };
}

/**
 * Load-modify-store for a snapshot file.
 *
 * @param {string} snapshotsDir
 * @param {any} snapshot
 * @param {{force?: boolean}} [options]
 */
export function persistSnapshot(snapshotsDir, snapshot, options = {}) {
  mkdirSync(snapshotsDir, { recursive: true });
  const path = join(snapshotsDir, `${snapshot.kit}.jsonl`);
  const lines = existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean) : [];
  const result = appendSnapshot(lines, snapshot, options);
  if (result.action === 'appended') writeFileSync(path, result.lines.join('\n') + '\n');
  return { path, ...result };
}
