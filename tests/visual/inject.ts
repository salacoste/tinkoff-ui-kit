import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from 'playwright';

/**
 * Font determinism for the visual harness (spec 1.6): pin both --tk-font-*
 * slots to locally-served DaytonaSans (fonts.css — the bundled licensed rename
 * of Neue Haas Unica W1G, with Inter as the loaded open fallback) and wait
 * until the exact faces are loaded, so glyph raster is identical across runs
 * and machines.
 */

const FONTS_CSS_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fonts.css');

/** DaytonaSans — the pin target: every weight the bundled set ships. */
const DAYTONA_WEIGHTS = [400, 500, 600] as const;

/** Inter — the loaded fallback: every weight the type scale uses (body 400/500, headings 500/700). */
const INTER_WEIGHTS = [400, 500, 700] as const;

export async function pinDeterministicFonts(page: Page): Promise<void> {
  await page.addStyleTag({ path: FONTS_CSS_PATH });
  // fonts.load() explicitly fetches each face (they otherwise load lazily on
  // first use); fonts.ready then guarantees nothing is still pending. The
  // check() assertions are load-bearing: fonts.load resolves with an EMPTY
  // face list when the font URL 404s, and the capture would silently raster a
  // system font — so verify each weight is actually available, loudly.
  await page.evaluate(
    async ({ daytonaWeights, interWeights }) => {
      const load = (family: string, weights: readonly number[]) =>
        weights.map((weight) => document.fonts.load(`${weight} 16px ${family}`));
      const missing = (family: string, weights: readonly number[]) =>
        weights.filter((weight) => !document.fonts.check(`${weight} 16px ${family}`));
      await Promise.all([...load('DaytonaSans', daytonaWeights), ...load('Inter', interWeights)]);
      await document.fonts.ready;
      const missingDaytona = missing('DaytonaSans', daytonaWeights);
      if (missingDaytona.length > 0) {
        throw new Error(
          `DaytonaSans weights ${missingDaytona.join(', ')} did not load — fonts.load resolves with zero faces on a 404. Is tests/visual/serve.mjs serving packages/tokens/fonts at /daytona? Refusing to capture: the baseline would silently raster a system font.`,
        );
      }
      const missingInter = missing('Inter', interWeights);
      if (missingInter.length > 0) {
        throw new Error(
          `Inter weights ${missingInter.join(', ')} (loaded fallback) did not load — fonts.load resolves with zero faces on a 404. Is tests/visual/serve.mjs serving @fontsource/inter at /inter? Refusing to capture: the fallback stack would silently raster a system font.`,
        );
      }
    },
    { daytonaWeights: [...DAYTONA_WEIGHTS], interWeights: [...INTER_WEIGHTS] },
  );
}
