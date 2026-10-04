// Visual reference captures (spec 25.3): screenshot the roster kits'
// docs into .playwright-cli/verify/kit-recon/. The capture plan lives in
// PLAN.md (fenced yaml) — this script is the executor, not the planner.
//
// Determinism: viewport 1280, fullPage, DOMContentLoaded + settle. Foreign
// docs are captured AS-IS: no font pin, no injected styles. Dark theme is
// attempted via prefers-color-scheme emulation (a real media feature) and
// VERIFIED via computed root/body luminance; a kit that ignores it and
// exposes no docs toggle is recorded light-only. We never repaint a
// foreign kit.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { chromium } from 'playwright';

const RECON_DIR = fileURLToPath(new URL('.', import.meta.url));
const PLAN_PATH = join(RECON_DIR, '..', '.playwright-cli', 'verify', 'kit-recon', 'PLAN.md');
const OUT_DIR = join(RECON_DIR, '..', '.playwright-cli', 'verify', 'kit-recon');

/** Pull the fenced yaml block out of PLAN.md. Pure. */
export function planData(markdown) {
  const match = markdown.match(/```yaml\n([\s\S]*?)```/);
  if (!match) throw new Error('PLAN.md has no ```yaml fence');
  return parseYaml(match[1]);
}

/**
 * Relative luminance of an `rgb()/rgba()` string (0..1). Pure.
 * Fully transparent colors carry no signal — they fall through to the
 * element behind, so they return null (a `rgba(0,0,0,0)` root must not
 * read as "black"; that false-positive minted bogus dark legs once).
 *
 * @param {string} color
 */
export function luminance(color) {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  if (m[4] !== undefined && Number(m[4]) === 0) return null;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function pageLuminance(page) {
  return page.evaluate(() => {
    const styles = [getComputedStyle(document.documentElement).backgroundColor, getComputedStyle(document.body).backgroundColor];
    return styles.join('|');
  });
}

/**
 * Capture one surface in one theme. Returns {path} on success or an
 * honest {skipped, reason} (never a silently light "dark" png).
 */
async function captureSurface(context, surface, theme, kitId) {
  const page = await context.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.emulateMedia({ colorScheme: theme });
    const response = await page.goto(surface.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (response && response.status() >= 400) return { skipped: `HTTP ${response.status()}` };
    await page.waitForTimeout(2500); // docs hydrate lazily; fonts/iframe settle
    if (theme === 'dark') {
      const styles = await pageLuminance(page);
      const lum = Math.min(...styles.split('|').map(luminance).filter((v) => v !== null));
      if (lum > 0.5) return { skipped: `dark not engaged (min luminance ${lum.toFixed(3)}; prefers-color-scheme ignored and no toggle probed)` };
    }
    const path = join(OUT_DIR, `${kitId}-${surface.name}-${theme}.png`);
    await page.screenshot({ path, fullPage: true });
    return { path };
  } finally {
    await page.close();
  }
}

async function main() {
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1]?.split(',') : null;
  const plan = planData(readFileSync(PLAN_PATH, 'utf8'));
  mkdirSync(OUT_DIR, { recursive: true });
  const journal = [];
  const browser = await chromium.launch();
  for (const kit of only ? plan.kits.filter((k) => only.includes(k.id)) : plan.kits) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    for (const surface of kit.surfaces) {
      for (const theme of ['light', 'dark']) {
        process.stdout.write(`${kit.id}/${surface.name}-${theme}… `);
        try {
          const result = await captureSurface(context, surface, theme, kit.id);
          if (result.path) {
            journal.push({ kit: kit.id, surface: surface.name, theme, path: result.path });
            console.log('ok');
          } else {
            journal.push({ kit: kit.id, surface: surface.name, theme, skipped: result.skipped });
            console.log(`SKIP (${result.skipped})`);
          }
        } catch (error) {
          journal.push({ kit: kit.id, surface: surface.name, theme, error: String(error?.message ?? error) });
          console.log(`ERROR ${String(error?.message ?? error).slice(0, 80)}`);
        }
      }
    }
    await context.close();
  }
  await browser.close();
  writeFileSync(join(OUT_DIR, 'journal.json'), JSON.stringify(journal, null, 2));
  const ok = journal.filter((j) => j.path).length;
  console.log(`\ncaptured ${ok}/${journal.length} legs; journal.json written`);
}

// Run only when executed directly (tests import the pure helpers).
if (process.argv[1] && process.argv[1].endsWith('visual.mjs')) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
