// Tarball layer (spec 25.1 AC3): download (or accept a local pack file) and
// extract into recon/.cache/<kit>/ so manifest parsing reads plain files.
// Transport rides the curl layer; extraction shells out to the platform
// `tar` — zero new dependencies.

import { execFile as execFileCallback } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { rename, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { httpToFile } from './http.mjs';

const execFile = promisify(execFileCallback);

/** Download `url` to `destPath`; throws on non-2xx after retries. */
export async function download(url, destPath) {
  const status = await httpToFile(url, destPath);
  if (status !== 200) throw new Error(`HTTP ${status} for ${url}`);
  return destPath;
}

/**
 * Materialize a tarball for the harvest: either copy a local `.tgz`
 * (`source.kind === 'file'`) or download it (`source.kind === 'url'`).
 *
 * @param {{kind: 'file'|'url', path?: string, url?: string}} source
 * @param {string} destPath destination .tgz path
 */
export async function materialize(source, destPath) {
  if (source.kind === 'file') {
    await rename(source.path, destPath);
    return destPath;
  }
  return download(/** @type {string} */ (source.url), destPath);
}

/**
 * Extract a .tgz into `extractDir/package/` (npm layout) and return that path.
 * A stale extraction is removed first — reruns must be deterministic.
 *
 * @param {string} tgzPath
 * @param {string} extractDir
 */
export async function extract(tgzPath, extractDir) {
  await rmSync(extractDir, { recursive: true, force: true });
  mkdirSync(extractDir, { recursive: true });
  await execFile('tar', ['-xzf', tgzPath, '-C', extractDir]);
  const packageDir = join(extractDir, 'package');
  const info = await stat(packageDir);
  if (!info.isDirectory()) throw new Error(`no package/ root inside ${tgzPath}`);
  return packageDir;
}
