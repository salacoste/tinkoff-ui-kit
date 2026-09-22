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
 * Stories that intentionally render Storybook's error display and are still
 * baselined (documented in README's tokens--groups quirk). Anything NOT here
 * that shows the error display fails the suite in BOTH compare and update
 * modes — a broken story must never quietly become a green error-page baseline
 * that the harness then "protects". Entry dies with its story (README:
 * baseline-removal rule).
 */
const ERROR_STATE_ALLOWLIST: readonly string[] = ['tokens--groups'];

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

/**
 * Baseline gate: an error-display render is only acceptable for explicitly
 * allowlisted story ids. Thrown in the test body, it fails in compare AND
 * --update-snapshots modes alike (update mode only auto-accepts screenshot
 * mismatches, not errors).
 */
async function assertNoUnexpectedErrorState(page: Page, id: string): Promise<void> {
  const isErrorState = await page.evaluate(() =>
    document.body.classList.contains('sb-show-errordisplay'),
  );
  if (isErrorState && !ERROR_STATE_ALLOWLIST.includes(id)) {
    throw new Error(
      `Story ${id} renders Storybook's error display — refusing to baseline a broken story. Fix the story; ERROR_STATE_ALLOWLIST in visual.spec.ts is for documented legacy cases only (see tests/visual/README.md).`,
    );
  }
}

/**
 * Image settle for stories with <img> content (first real cases land at 1.7):
 * network quiet, then every image decoded. decode() rejects on broken sources —
 * swallowed, because a deterministically broken image is itself the state the
 * baseline should record.
 */
async function waitForDecodedCanvas(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => image.decode().catch(() => undefined)),
    );
  });
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
      await assertNoUnexpectedErrorState(page, id);
      // Capture-side theme assertion: the dark URL param must actually have
      // flipped the preview root, or update mode would rewrite dark baselines
      // as light renders (the theme decorator is what sets the attribute).
      if (theme === 'dark') {
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      }
      await waitForDecodedCanvas(page);
      await pinDeterministicFonts(page);
      // Screenshot options (threshold 0.015 / animations / caret) live ONLY in
      // playwright.config.ts expect defaults — one source of truth.
      await expect(await storyCanvas(page)).toHaveScreenshot();
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
