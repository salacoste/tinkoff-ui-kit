import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, readStoryIds, THEMES } from './stories';

/**
 * Visual regression + axe suite (spec 1.6).
 *
 * Tests are GENERATED from the built story index (packages/docs/dist/index.json,
 * see stories.ts) — one visual test and one axe test per story id × theme
 * (light + dark). A story id in the index with no baseline fails the suite
 * naming the story; discovery never requires harness edits.
 *
 * Each story loads as the Storybook preview canvas itself (iframe.html?id=…),
 * NOT inside the manager — so `page.locator('body')` IS the story canvas
 * (canvas-element capture per the spec's implementation note).
 */

/** WCAG rule tags enforced on every story in BOTH themes. */
const AXE_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/**
 * The ONE documented axe exclusion (spec 1.6): mirrors the storybook a11y
 * config in packages/docs/src/tokens-demo.stories.ts (parameters.a11y.context.
 * exclude) — the color-only .tksw-chip swatches carry no text; excluding them
 * keeps every text-bearing element in scope in both themes. No other story may
 * carry an exclusion.
 */
const A11Y_CONTEXT_EXCLUDE: Readonly<Record<string, readonly string[]>> = {
  'tokens--swatches': ['.tksw-chip'],
};

/**
 * Settle wait: the story mount has children (normal render) OR Storybook
 * surfaced its error display via body.sb-show-errordisplay (a misrendered
 * story — itself a stable, lockable render state the baseline then records;
 * see README on tokens--groups). A CSS `:nth` wait cannot express this: the
 * hidden errordisplay div precedes #storybook-root in the DOM, so a comma
 * selector with .first() would pin the wrong element.
 */
async function waitForStorySettled(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root');
      return (
        (root?.childElementCount ?? 0) > 0 || document.body.classList.contains('sb-show-errordisplay')
      );
    },
    undefined,
    { timeout: 15_000 },
  );
}

/**
 * The story canvas for screenshot capture. Normally the iframe `<body>` (the
 * preview document IS the canvas — never the manager). For a story that
 * misrenders, Storybook shows its error display instead: every block in it is
 * position:fixed, so <body> collapses to zero height and is not screenshotable
 * — the error display (full-viewport, fixed) is that state's canvas.
 */
async function storyCanvas(page: Page) {
  const isErrorState = await page.evaluate(() =>
    document.body.classList.contains('sb-show-errordisplay'),
  );
  return isErrorState ? page.locator('.sb-errordisplay') : page.locator('body');
}

/** Discovery — a missing/empty index is a loud failure with build guidance. */
let storyIds: string[];
try {
  storyIds = readStoryIds();
} catch (error) {
  test('story index is built before the visual suite runs', () => {
    throw error;
  });
  storyIds = [];
}

for (const id of storyIds) {
  for (const theme of THEMES) {
    test(`visual: ${id} [${theme}]`, async ({ page }) => {
      await page.goto(buildStoryUrl(id, theme));
      await waitForStorySettled(page);
      await pinDeterministicFonts(page);
      // Threshold 0.015 (OQ-6): forgiving of sub-pixel antialias noise, tight
      // enough that any real component change trips it. animations/caret are
      // also pinned in playwright.config.ts expect defaults.
      await expect(await storyCanvas(page)).toHaveScreenshot({
        maxDiffPixelRatio: 0.015,
        animations: 'disabled',
        caret: 'hide',
      });
    });

    test(`axe: ${id} [${theme}]`, async ({ page }) => {
      await page.goto(buildStoryUrl(id, theme));
      await waitForStorySettled(page);
      let builder = new AxeBuilder({ page }).withTags([...AXE_WCAG_TAGS]);
      for (const selector of A11Y_CONTEXT_EXCLUDE[id] ?? []) {
        builder = builder.exclude(selector);
      }
      const results = await builder.analyze();
      const violations = results.violations.map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
      );
      expect(violations, `axe violations for story ${id} [${theme}] (rule ids + node selectors)`).toEqual([]);
    });
  }
}
