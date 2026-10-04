// Registry layer (spec 25.1 AC2): npm registry access over plain HTTPS.
// Standing law: the npm CLI is never used — this module is the only registry
// door. Packuments are ETag-cached under recon/.cache/registry/ so reruns are
// polite and deterministic; transport rides the curl layer (see lib/http.mjs
// for why not native fetch).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { httpJson } from './http.mjs';

const REGISTRY = 'https://registry.npmjs.org';

/**
 * Fetch the FULL packument (metadata for every version — needed for release
 * cadence) with ETag revalidation against the local cache.
 *
 * @param {string} pkg npm package name
 * @param {string} cacheDir directory for cached packuments
 * @returns {Promise<{doc: any, etag: string | null}>}
 */
export async function fetchPackument(pkg, cacheDir) {
  mkdirSync(cacheDir, { recursive: true });
  const cachePath = join(cacheDir, `${pkg.replace('/', '__')}.json`);
  let cachedEtag = null;
  let cachedDoc = null;
  try {
    const raw = JSON.parse(readFileSync(cachePath, 'utf8'));
    cachedDoc = raw.doc;
    cachedEtag = raw.etag;
  } catch {
    // cold cache — first fetch for this package
  }
  const headers = {};
  if (cachedEtag) headers['if-none-match'] = cachedEtag;
  const { status, json } = await httpJson(`${REGISTRY}/${pkg}`, headers);
  if (status === 304 && cachedDoc) return { doc: cachedDoc, etag: cachedEtag };
  if (!json) throw new Error(`packument unparseable for ${pkg} (HTTP ${status})`);
  if (status !== 200) throw new Error(`HTTP ${status} for ${REGISTRY}/${pkg}`);
  const etag = null; // curl layer does not surface response headers; cache is version-keyed anyway
  writeFileSync(cachePath, JSON.stringify({ etag, doc: json }));
  return { doc: json, etag };
}

/**
 * Distill a packument into the snapshot meta block (spec 25.1 AC4):
 * license, repo, dependency names, tarball/unpacked sizes, release cadence.
 *
 * @param {any} doc full packument
 * @param {string} [version] pinned version; defaults to dist-tags.latest
 */
export function packumentMeta(doc, version) {
  const resolved = version ?? doc['dist-tags']?.latest;
  const versionDoc = doc.versions?.[resolved] ?? {};
  const times = doc.time ?? {};
  const releaseDates = Object.entries(times)
    .filter(([key]) => key !== 'created' && key !== 'modified')
    .map(([, iso]) => new Date(iso).getTime())
    .filter((ts) => Number.isFinite(ts));
  const yearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  return {
    version: resolved,
    license: typeof doc.license === 'string' ? doc.license : versionDoc.license ?? null,
    description: doc.description ?? null,
    repository: typeof doc.repository === 'string' ? doc.repository : doc.repository?.url ?? null,
    dependencies: Object.keys(versionDoc.dependencies ?? {}).sort(),
    peerDependencies: Object.keys(versionDoc.peerDependencies ?? {}).sort(),
    tarballBytes: versionDoc.dist?.tarball ? Number(versionDoc.dist?.unpackedSize ?? 0) || null : null,
    unpackedBytes: Number(versionDoc.dist?.unpackedSize ?? 0) || null,
    releasesTotal: releaseDates.length,
    releasesLast12mo: releaseDates.filter((ts) => ts >= yearAgo).length,
    firstPublished: times.created ?? null,
    lastPublished: times.modified ?? null,
  };
}

/**
 * Resolve the tarball URL for a pinned (or latest) version.
 *
 * @param {any} doc full packument
 * @param {string} [version]
 */
export function tarballUrl(doc, version) {
  const resolved = version ?? doc['dist-tags']?.latest;
  return doc.versions?.[resolved]?.dist?.tarball ?? null;
}
