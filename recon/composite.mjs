// Per-kit composites (spec 25.3 AC4, mold 24b): panels resized to 560px
// wide (aspect-preserving), packed 4 per row, rows stacked vertically.
// Node + execFile arg arrays — no shell word-splitting traps.
import { execFile as execFileCallback } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const DIR = join(fileURLToPath(new URL('.', import.meta.url)), '..', '.playwright-cli', 'verify', 'kit-recon');
const im = async (args) => execFile('magick', args, { cwd: DIR });

const pngs = readdirSync(DIR).filter((f) => f.endsWith('.png') && !f.startsWith('composite-') && !f.startsWith('tmp-'));
// stale tmp-* from an interrupted run must not resurrect as a phantom kit
for (const stale of readdirSync(DIR).filter((f) => f.startsWith('tmp-'))) rmSync(join(DIR, stale));
const kits = [...new Set(pngs.map((f) => f.split('-')[0]))].sort();
for (const kit of kits) {
  const panels = pngs.filter((f) => f.startsWith(`${kit}-`)).sort();
  const tmp = [];
  for (const f of panels) {
    const small = `tmp-${f}`;
    await im([f, '-resize', '560x', small]);
    tmp.push(small);
  }
  const rows = [];
  for (let i = 0; i < tmp.length; i += 4) {
    const row = `tmp-row-${kit}-${i}.png`;
    await im([...tmp.slice(i, i + 4), '+append', row]);
    rows.push(row);
  }
  const out = `composite-${kit}.png`;
  await im([...rows, '-append', out]);
  for (const f of [...tmp, ...rows]) rmSync(join(DIR, f));
  console.log(`${out}: ${panels.length} panels`);
}
