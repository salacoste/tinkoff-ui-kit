import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from 'playwright';

/**
 * Font determinism for the visual harness (spec 1.6): pin both --tk-font-*
 * slots to locally-served Inter (inter.css) and wait until the exact faces are
 * loaded, so glyph raster is identical across runs and machines.
 */

const INTER_CSS_PATH = join(dirname(fileURLToPath(import.meta.url)), 'inter.css');

/** Every weight the token sheet's type scale uses (body 400/500, headings 500/700). */
const INTER_WEIGHTS = [400, 500, 700] as const;

export async function pinDeterministicFonts(page: Page): Promise<void> {
  await page.addStyleTag({ path: INTER_CSS_PATH });
  // fonts.load() explicitly fetches each face (they otherwise load lazily on
  // first use); fonts.ready then guarantees nothing is still pending.
  await page.evaluate(async (weights) => {
    await Promise.all(weights.map((weight) => document.fonts.load(`${weight} 16px Inter`)));
    await document.fonts.ready;
  }, [...INTER_WEIGHTS]);
}
