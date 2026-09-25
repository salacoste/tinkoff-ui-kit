import { expect, test, type Page } from 'playwright/test';

import { analyzeAxe } from './axe-serialize';
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
 * Settle wait: the story mount has children (normal render) OR Storybook
 * surfaced its error display via body.sb-show-errordisplay. The error branch
 * exists so a misrendered story settles FAST into the assertNoErrorState gate
 * below instead of timing out — a CSS `:nth` wait cannot express this: the
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
 * The story canvas for screenshot capture: the iframe `<body>` (the preview
 * document IS the canvas — never the manager), full story height (taller-than
 * -viewport canvases are stitched).
 */
async function storyCanvas(page: Page) {
  return page.locator('body');
}

/**
 * Baseline gate: NO story may render Storybook's error display. Thrown in the
 * test body, it fails in compare AND --update-snapshots modes alike (update
 * mode only auto-accepts screenshot mismatches, not errors) — a broken story
 * must never quietly become a green error-page baseline the harness then
 * "protects". (The 1.6 tokens-demo allowlist exception was removed with the
 * demo at Story 1.7; there is no allowlist to re-enter.)
 */
async function assertNoErrorState(page: Page, id: string): Promise<void> {
  const isErrorState = await page.evaluate(() =>
    document.body.classList.contains('sb-show-errordisplay'),
  );
  if (isErrorState) {
    throw new Error(
      `Story ${id} renders Storybook's error display — refusing to baseline a broken story. Fix the story (see tests/visual/README.md).`,
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

/**
 * CI-only per-leg tolerance for PLATFORM RENDERING classes (2026-09-25, the
 * first ubuntu run of the v2 suite — 1366/1368): auto-width text pills shift
 * a few px by platform text-advance, and the shift only crosses the
 * comparator's intensity threshold against a light background (the dark leg
 * of the same story passes at the default 1.5%). Keyed `${id} [${theme}]`,
 * applied ONLY when process.env.CI is set — local compare stays strict.
 *
 * History of the tooltip placements entries (the class's one story so far):
 * retired at story 9.1 on the width-pinning theory (content long enough to
 * hit the pill max-width cap 288px), then RESTORED the same day: CI run
 * 36131832924 — the first proof attempt — came back 1366/1368 with BOTH
 * placements legs failing (light 0.10, dark 0.04). Forensics on the diff
 * PNGs: the cap pins the pill WIDTH, but the pill HEIGHT is the line count,
 * and ubuntu text-advance wraps the same RU copy one line further (68px →
 * 87px). No story content can pin a wrap line count — text-metric geometry
 * is structurally un-pinnable, so the CI-scoped tolerance IS the standing
 * fix. The cap-hitting content STAYS (it killed the auto-width edge-shift
 * subclass and exercises the wrap path); values sized to the measured
 * ratios with headroom: light 0.13 ≥ 1.3× of 0.10, dark 0.08 = 2× of 0.04.
 */
const CI_VISUAL_TOLERANCE: Record<string, number> = {
  'components-tooltip--placements [light]': 0.13,
  'components-tooltip--placements [dark]': 0.08,
};

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
      await assertNoErrorState(page, id);
      // Capture-side theme assertion: the dark URL param must actually have
      // flipped the preview root, or update mode would rewrite dark baselines
      // as light renders (the theme decorator is what sets the attribute).
      if (theme === 'dark') {
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      }
      await waitForDecodedCanvas(page);
      await pinDeterministicFonts(page);
      // Screenshot options (threshold 0.015 / animations / caret) live in
      // playwright.config.ts expect defaults — the single source of truth.
      // The ONE sanctioned call-site override: CI_VISUAL_TOLERANCE below
      // (platform rendering classes; CI runs only, local compare stays
      // strict at the config default).
      const ciTolerance = process.env.CI ? CI_VISUAL_TOLERANCE[`${id} [${theme}]`] : undefined;
      await expect(await storyCanvas(page)).toHaveScreenshot(
        ciTolerance === undefined ? {} : { maxDiffPixelRatio: ciTolerance },
      );
    });

    test(`axe: ${id} [${theme}]`, async ({ page }) => {
      await page.goto(buildStoryUrl(id, theme));
      await waitForStorySettled(page);
      // Fonts must be settled BEFORE axe runs: color-contrast measured mid
      // font-swap (fallback → brand metrics) produces one-off phantom
      // violations (observed once on getting-started [dark], 2026-09-22).
      await pinDeterministicFonts(page);
      // No story carries an axe exclusion (the 1.6 tokens-demo chip exclusion
      // died with the demo at Story 1.7) — every element of every story is
      // audited in both themes.
      const results = await analyzeAxe(page, AXE_WCAG_TAGS);
      const violations = results.violations.map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
      );
      expect(violations, `axe violations for story ${id} [${theme}] (rule ids + node selectors)`).toEqual([]);
    });
  }
}
