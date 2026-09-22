// Visual-suite preflight + runner (spec 1.6, review fix): portable baseline
// detection + correct spawn. Replaces a shell `ls`-glob heuristic that was
// Windows-broken and silently coupled to Playwright's snapshot dir naming.
//
//   any committed .png in tests/visual/visual.spec.ts-snapshots/  -> compare mode
//   none (fresh checkout / wiped dir)                             -> --update-snapshots
//
// The branch MUST live here, not in package.json shell glue: exit-code chaining
// (`preflight && playwright test || playwright test --update-snapshots`) would
// route a genuine drift FAILURE into update mode and silently rewrite
// baselines. Exit code = playwright's own.
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SNAPSHOTS_DIR = join(REPO_ROOT, 'tests', 'visual', 'visual.spec.ts-snapshots');

let hasBaselines = false;
try {
  // .png specifically — a stray non-baseline file (e.g. .DS_Store) must not
  // flip a fresh checkout into compare mode.
  hasBaselines = readdirSync(SNAPSHOTS_DIR).some((name) => name.endsWith('.png'));
} catch {
  hasBaselines = false; // no snapshots dir at all — creation mode
}

const args = hasBaselines ? [] : ['--update-snapshots'];
if (!hasBaselines) {
  console.log('visual harness: no baselines yet — first run writes them (see tests/visual/README.md)');
}

const playwrightBin = join(
  REPO_ROOT,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright',
);
const result = spawnSync(playwrightBin, ['test', ...args], {
  stdio: 'inherit',
  // Windows: .cmd shims can only be spawned through a shell (Node >= 20 security).
  shell: process.platform === 'win32',
});
if (result.error) {
  console.error(`visual harness: failed to run playwright (${playwrightBin}): ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
