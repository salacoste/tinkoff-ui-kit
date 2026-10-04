// Harvest CLI (spec 25.1 AC1): `node recon/harvest.mjs --kit <id>` builds a
// KitSnapshot from registry metadata + the published tarball and appends it
// (idempotently) to recon/snapshots/<kit>.jsonl.
//
// Targets:
//   --kit self     dogfood: `pnpm pack` the local components package
//   --kit <roster> registry packument + tarball download
//   --list         roster summary
//   --capability   regenerate recon/capability.md from jsDelivr listings
//
// Standing law: no npm CLI anywhere — registry reads are plain HTTPS fetches
// and the local pack goes through pnpm.

import { execFile as execFileCallback } from 'node:child_process';
import fs from 'node:fs';
import { mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse as parseYaml } from 'yaml';

import { flatListing, classifyListing, renderCapabilityDoc } from './lib/capability.mjs';
import { parseCem, extractTokens, scanPackage } from './lib/extract.mjs';
import { fetchPackument, packumentMeta, tarballUrl } from './lib/registry.mjs';
import { buildSnapshot, persistSnapshot } from './lib/snapshot.mjs';
import { extract, materialize } from './lib/tarball.mjs';

const execFile = promisify(execFileCallback);
const RECON_DIR = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(RECON_DIR, '..');
const CACHE = join(RECON_DIR, '.cache');
const SNAPSHOTS = join(RECON_DIR, 'snapshots');
const ROSTER_PATH = join(RECON_DIR, 'roster.yml');

async function loadRoster() {
  const raw = await readFile(ROSTER_PATH, 'utf8');
  return parseYaml(raw);
}

/** argv parsing: `--kit x [--force] [--file tgz]` / `--list` / `--capability`. */
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--kit') args.kit = argv[++i];
    else if (token === '--force') args.force = true;
    else if (token === '--file') args.file = argv[++i];
    else if (token === '--list') args.list = true;
    else if (token === '--capability') args.capability = true;
    else args._.push(token);
  }
  return args;
}

/** Dogfood path: pack the workspace components package and harvest it. */
async function harvestSelf(rosterEntry, force) {
  const packDir = join(CACHE, 'pack');
  mkdirSync(packDir, { recursive: true });
  const { stdout } = await execFile('pnpm', ['--filter', rosterEntry.local, 'pack', '--pack-destination', packDir], { cwd: REPO_ROOT });
  const lastLine = stdout.trim().split('\n').pop();
  // pnpm prints the tarball path — absolute since pnpm 10; older layouts print a bare filename.
  const tgzPath = isAbsolute(lastLine) ? lastLine : join(packDir, lastLine);
  const extractDir = join(CACHE, rosterEntry.id);
  const packageDir = await extract(tgzPath, extractDir);
  const scan = await scanPackage(packageDir, fs);
  const cemResult = scan.cem
    ? parseCem(scan.cem)
    : { components: [], notes: ['no CEM in tarball'] };
  const tokenResult = await extractTokens(scan, fs);
  const meta = {
    version: scan.packageJson.version,
    license: scan.packageJson.license ?? null,
    description: 'dogfood target — our own trio, packed locally (git-tag distribution)',
    repository: 'https://github.com/salacoste/tinkoff-ui-kit',
    source: 'pnpm pack (local workspace)',
  };
  const snapshot = buildSnapshot({ kit: rosterEntry.id, npm: null, version: scan.packageJson.version, meta, scan, cemResult, tokenResult });
  return persistSnapshot(SNAPSHOTS, snapshot, { force });
}

/** Registry path: packument + tarball for an npm target. */
async function harvestRegistry(rosterEntry, force) {
  const { doc } = await fetchPackument(rosterEntry.npm, join(CACHE, 'registry'));
  const meta = packumentMeta(doc);
  const url = tarballUrl(doc);
  if (!url) throw new Error(`no tarball resolvable for ${rosterEntry.npm}`);
  const tgzPath = join(CACHE, `${rosterEntry.id}-${meta.version}.tgz`);
  await materialize({ kind: 'url', url }, tgzPath);
  const extractDir = join(CACHE, rosterEntry.id);
  const packageDir = await extract(tgzPath, extractDir);
  const scan = await scanPackage(packageDir, fs);
  const cemResult = scan.cem ? parseCem(scan.cem) : { components: [], notes: [`no CEM in tarball (family: ${rosterEntry.family})`] };
  const tokenResult = await extractTokens(scan, fs);
  const snapshot = buildSnapshot({ kit: rosterEntry.id, npm: rosterEntry.npm, version: meta.version, meta, scan, cemResult, tokenResult });
  return persistSnapshot(SNAPSHOTS, snapshot, { force });
}

async function runCapability(roster) {
  const rows = [];
  for (const entry of roster.kits) {
    if (entry.family === 'self') {
      rows.push({ id: entry.id, reachable: true, error: 'local dogfood — no registry listing', cem: true, dts: 0, tokensJson: 0, themes: 0, stylesheets: 0 });
      continue;
    }
    if (!entry.npm) {
      rows.push({ id: entry.id, reachable: false, error: `repo-only (${entry.repo}) — no npm tarball`, cem: false, dts: 0, tokensJson: 0, themes: 0, stylesheets: 0 });
      continue;
    }
    process.stdout.write(`probing ${entry.id} (${entry.npm})… `);
    const listing = await flatListing(entry.npm);
    rows.push(classifyListing(entry.id, listing));
    console.log(listing.ok ? 'ok' : `FAIL ${listing.error}`);
  }
  const doc = renderCapabilityDoc(rows, new Date().toISOString());
  await writeFile(join(RECON_DIR, 'capability.md'), doc);
  console.log(`\ncapability.md written (${rows.length} rows)`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const roster = await loadRoster();

  if (args.list) {
    for (const entry of roster.kits) {
      console.log(`${entry.id.padEnd(10)} ${entry.npm ?? entry.repo ?? entry.local} [${entry.family}]${entry.anchor ? ' ANCHOR' : ''}`);
    }
    return;
  }
  if (args.capability) {
    await runCapability(roster);
    return;
  }
  if (!args.kit) {
    console.error('usage: node recon/harvest.mjs --kit <id> [--force] | --list | --capability');
    process.exitCode = 1;
    return;
  }

  const entry = roster.kits.find((k) => k.id === args.kit);
  if (!entry) {
    console.error(`unknown kit "${args.kit}" (see recon/roster.yml or --list)`);
    process.exitCode = 1;
    return;
  }

  const result = entry.family === 'self' ? await harvestSelf(entry, args.force) : entry.npm ? await harvestRegistry(entry, args.force) : null;
  if (!result) {
    console.error(`kit "${entry.id}" has no npm target (repo-only) — capability row only`);
    process.exitCode = 1;
    return;
  }
  const snapshot = JSON.parse(result.lines.at(-1));
  console.log(
    `${result.action}: ${snapshot.kit}@${snapshot.version} — components=${snapshot.components.length}, tokens=${snapshot.tokens.length}, cem=${snapshot.artifactsFound.cem}, dts=${snapshot.artifactsFound.dtsCount}\n  -> ${result.path}`,
  );
  console.log(snapshot.notes.map((n) => `  note: ${n}`).join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
