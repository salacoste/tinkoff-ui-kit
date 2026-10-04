// Report generator (spec 25.2 AC5): distill the latest snapshot of every
// roster kit into a per-kit markdown report + a SUMMARY table under
// _bmad-output/planning-artifacts/kit-recon-2026-10/. Renderers are pure
// (unit-tested); main() only reads snapshots and writes files.

import { existsSync, readFileSync } from 'node:fs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const RECON_DIR = fileURLToPath(new URL('.', import.meta.url));
const SNAPSHOTS = join(RECON_DIR, 'snapshots');
const ROSTER_PATH = join(RECON_DIR, 'roster.yml');
export const REPORT_DIR = join(RECON_DIR, '..', '_bmad-output', 'planning-artifacts', 'kit-recon-2026-10');

/** Latest snapshot line per kit file (the JSONL tail is current state). */
export function latestSnapshot(lines) {
  return lines.length ? JSON.parse(lines[lines.length - 1]) : null;
}

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

/**
 * Per-kit markdown report.
 *
 * @param {any} snap latest KitSnapshot
 * @param {{id: string, family: string, anchor?: boolean}} entry roster entry
 */
export function renderKitReport(snap, entry) {
  const a = snap.meta.activity ?? {};
  const gh = a.github ?? {};
  const dl = a.downloads ?? {};
  const a11 = snap.artifactsFound;
  const lines = [
    `# ${entry.id}${entry.anchor ? ' (anchor)' : ''}`,
    '',
    `- npm: ${snap.npm ?? '—'} @ ${snap.version ?? 'n/a'} (${entry.family})`,
    `- license: ${snap.meta.license ?? '—'} · repo: ${gh.repo ?? snap.meta.repository ?? '—'}`,
    `- fetched: ${snap.fetchedAt} · source: ${snap.meta.source ?? 'registry tarball'}`,
    '',
    '## Artifact base',
    '',
    `CEM ${a11.cem ? '**yes**' : 'no'} · d.ts ${fmt(a11.dtsCount)} (component-shaped: ${fmt(a11.dtsComponents)}) · tokens-json ${fmt(a11.tokenJsonCount)} · theme files ${fmt(a11.themeFiles?.length ?? a11.themeFiles)} · stylesheets ${fmt(a11.stylesheets)} · README ${a11.readme ? 'yes' : 'no'}`,
    '',
    '## API scale',
    '',
    `- typed components (CEM): ${fmt(snap.components.length)}`,
    `- tokens extracted: ${fmt(snap.tokens.length)} (${[...new Set(snap.tokens.map((t) => t.source))].join(', ') || 'none'})`,
    '',
    '## Activity',
    '',
    `- downloads last 30d: ${dl.lastMonth !== undefined ? fmt(dl.lastMonth) : dl.error ?? dl.skipped ?? '—'}`,
    ...(a.downloadsRange?.total !== undefined ? [`- anchor 180d series total: ${fmt(a.downloadsRange.total)} (${a.downloadsRange.from}..${a.downloadsRange.to})`] : []),
    `- github: ⭐ ${fmt(gh.stars)} · forks ${fmt(gh.forks)} · open issues ${fmt(gh.openIssues)} · contributors ${fmt(gh.contributors)}${gh.contributorsCapped ? '+' : ''} · pushed ${gh.pushedAt ?? '—'}`,
    `- releases (npm): ${fmt(snap.meta.releasesTotal)} total, ${fmt(snap.meta.releasesLast12mo)} last 12mo`,
    ...(Array.isArray(gh.releases) && gh.releases.length ? ['', 'last GitHub releases: ' + gh.releases.slice(0, 5).map((r) => `${r.tag} (${(r.publishedAt ?? '').slice(0, 10)})`).join(', ')] : []),
    ...(gh.error ? [`- github layer error: ${gh.error}`] : []),
    '',
    '## Recon notes (verbatim)',
    '',
    ...(snap.notes.length ? snap.notes.map((n) => `- ${n}`) : ['- none']),
    '',
  ];
  return lines.join('\n');
}

/**
 * SUMMARY.md table across kits (spec 25.2 AC5; converges with the
 * snapshot count — verified in tests).
 *
 * @param {Array<{entry: any, snap: any}>} rows
 * @param {string} generatedAt
 */
export function renderSummary(rows, generatedAt) {
  const header = [
    '# Kit-recon 25.2 — roster run summary',
    '',
    `Generated ${generatedAt} by \`node recon/report.mjs\` from recon/snapshots/*.jsonl (latest line per kit).`,
    '',
    '| kit | family | version | CEM | comp | d.ts | dts-comp | tokens | dl 30d | stars | rel 12mo |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
  ];
  const lines = rows.map(({ entry, snap }) => {
    const dl = snap.meta.activity?.downloads?.lastMonth;
    return `| ${entry.id}${entry.anchor ? ' ⚓' : ''} | ${entry.family} | ${snap.version ?? 'n/a'} | ${snap.artifactsFound.cem ? '✅' : '·'} | ${snap.components.length} | ${snap.artifactsFound.dtsCount} | ${snap.artifactsFound.dtsComponents} | ${snap.tokens.length} | ${dl !== undefined ? fmt(dl) : '—'} | ${fmt(snap.meta.activity?.github?.stars)} | ${fmt(snap.meta.releasesLast12mo)} |`;
  });
  return [...header, ...lines, '', `Kits: ${rows.length}.`, ''].join('\n');
}

function main() {
  const roster = parseYaml(readFileSync(ROSTER_PATH, 'utf8'));
  mkdirSync(REPORT_DIR, { recursive: true });
  const rows = [];
  for (const entry of roster.kits) {
    const path = join(SNAPSHOTS, `${entry.id}.jsonl`);
    if (!existsSync(path)) {
      console.error(`no snapshot for ${entry.id} — run harvest first`);
      process.exitCode = 1;
      continue;
    }
    const snap = latestSnapshot(readFileSync(path, 'utf8').split('\n').filter(Boolean));
    writeFileSync(join(REPORT_DIR, `${entry.id}.md`), renderKitReport(snap, entry));
    rows.push({ entry, snap });
  }
  writeFileSync(join(REPORT_DIR, 'SUMMARY.md'), renderSummary(rows, new Date().toISOString()));
  console.log(`${rows.length} kit reports + SUMMARY.md -> ${REPORT_DIR}`);
}

main();
