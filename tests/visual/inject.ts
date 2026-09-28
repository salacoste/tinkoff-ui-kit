import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from 'playwright';

/**
 * Font determinism for the visual harness (spec 1.6): pin every --tk-font-*
 * slot to locally-served webfonts (fonts.css) and wait until the exact faces
 * are loaded, so glyph raster is identical across runs, machines, and
 * PLATFORMS. Body/heading pin to the bundled licensed DaytonaSans rename of
 * Neue Haas Unica W1G (Inter as the loaded open fallback); the mono slot —
 * system-first in the token layer since 9.1, pinned here from story 11.2's
 * first consumer onward — pins to @fontsource/jetbrains-mono (OFL-1.1,
 * test-only dep): the system mono chain resolves to a different face per OS
 * (macOS Menlo vs ubuntu DejaVu/Liberation), and different advance widths
 * reflow every wrapped paragraph containing an inline <code>, shifting
 * full-page canvas HEIGHTS — a size mismatch Playwright's comparator fails
 * unconditionally, before any tolerance option applies (verified against the
 * 1.63 comparator source; see CI_VISUAL_TOLERANCE history in visual.spec.ts).
 *
 * Story 15.3 extends the pin to the ТЖ family: both --tj-font-* slots
 * (Graphik-first ui / Charter-first reading, frozen at 15.2) are overridden in
 * fonts.css to the served open faces — Inter for ui (already loaded) and PT
 * Serif for reading (@fontsource/pt-serif, OFL-1.1, test-only dep) — so ТЖ
 * renders stay deterministic even on machines with licensed Graphik/Charter
 * installed (the OQ-8 ruling: no licenses delivered, nothing bundled).
 */

const FONTS_CSS_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fonts.css');

/** DaytonaSans — the pin target: every weight the bundled set ships. */
const DAYTONA_WEIGHTS = [400, 500, 600] as const;

/** Inter — the loaded fallback: every weight the type scale uses (body 400/500, headings 500/700). */
const INTER_WEIGHTS = [400, 500, 700] as const;

/** JetBrains Mono — the mono-slot pin: weights the code surfaces render at. */
const JETBRAINS_MONO_WEIGHTS = [400, 500] as const;

/** PT Serif — the ТЖ reading-slot pin (story 15.3): the family's full normal set. */
const PT_SERIF_WEIGHTS = [400, 700] as const;

export async function pinDeterministicFonts(page: Page): Promise<void> {
  await page.addStyleTag({ path: FONTS_CSS_PATH });
  // fonts.load() explicitly fetches each face (they otherwise load lazily on
  // first use); fonts.ready then guarantees nothing is still pending. The
  // check() assertions are load-bearing: fonts.load resolves with an EMPTY
  // face list when the font URL 404s, and the capture would silently raster a
  // system font — so verify each weight is actually available, loudly.
  await page.evaluate(
    async ({ daytonaWeights, interWeights, monoWeights, ptSerifWeights }) => {
      const load = (family: string, weights: readonly number[]) =>
        weights.map((weight) => document.fonts.load(`${weight} 16px ${family}`));
      const missing = (family: string, weights: readonly number[]) =>
        weights.filter((weight) => !document.fonts.check(`${weight} 16px ${family}`));
      await Promise.all([
        ...load('DaytonaSans', daytonaWeights),
        ...load('Inter', interWeights),
        ...load('JetBrains Mono', monoWeights),
        ...load('PT Serif', ptSerifWeights),
      ]);
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
      const missingMono = missing('JetBrains Mono', monoWeights);
      if (missingMono.length > 0) {
        throw new Error(
          `JetBrains Mono weights ${missingMono.join(', ')} (mono-slot pin) did not load — fonts.load resolves with zero faces on a 404. Is tests/visual/serve.mjs serving @fontsource/jetbrains-mono at /jetbrains-mono? Refusing to capture: doc code surfaces would silently raster a per-OS system mono and reflow cross-platform.`,
        );
      }
      const missingPtSerif = missing('PT Serif', ptSerifWeights);
      if (missingPtSerif.length > 0) {
        throw new Error(
          `PT Serif weights ${missingPtSerif.join(', ')} (ТЖ reading-slot pin) did not load — fonts.load resolves with zero faces on a 404. Is tests/visual/serve.mjs serving @fontsource/pt-serif at /pt-serif? Refusing to capture: a --tj-font-reading consumer would silently raster a per-machine serif (licensed Charter included) and drift captures.`,
        );
      }
    },
    {
      daytonaWeights: [...DAYTONA_WEIGHTS],
      interWeights: [...INTER_WEIGHTS],
      monoWeights: [...JETBRAINS_MONO_WEIGHTS],
      ptSerifWeights: [...PT_SERIF_WEIGHTS],
    },
  );
}
