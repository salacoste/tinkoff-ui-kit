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
  // first use); fonts.ready then guarantees nothing is still pending. The
  // check() assertions are load-bearing: fonts.load resolves with an EMPTY
  // face list when the font URL 404s, and the capture would silently raster a
  // system font — so verify each weight is actually available, loudly.
  await page.evaluate(async (weights) => {
    await Promise.all(weights.map((weight) => document.fonts.load(`${weight} 16px Inter`)));
    await document.fonts.ready;
    const missing = weights.filter((weight) => !document.fonts.check(`${weight} 16px Inter`));
    if (missing.length > 0) {
      throw new Error(
        `Inter weights ${missing.join(', ')} did not load — fonts.load resolves with zero faces on a 404. Is tests/visual/serve.mjs serving @fontsource/inter at /inter? Refusing to capture: the baseline would silently raster a system font.`,
      );
    }
  }, [...INTER_WEIGHTS]);
}
