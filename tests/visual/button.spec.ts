import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-button LAYOUT verification (spec 1.7 review) — the real-pixel half of the
 * width-freeze split. The happy-dom unit suite (packages/components/src/button/
 * button.test.ts) pins the freeze structurally (label node never removed from
 * flow); happy-dom has no layout engine, so `offsetWidth` there proves nothing.
 * Here layout exists: measure, flip `loading`, measure again.
 *
 * Runs under the same pinned webServer/capture config as the visual suite
 * (playwright.config.ts) against the BUILT docs bundle — build first
 * (pnpm test:visual does; direct playwright calls need pnpm --filter
 * @tk-kit/docs build, same stale-dist rule as tests/visual/README.md).
 */

/** Settle wait — same contract as visual.spec.ts (children or error display). */
async function waitForStorySettled(page: Page) {
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root');
      return (
        (root?.childElementCount ?? 0) > 0 ||
        document.body.classList.contains('sb-show-errordisplay')
      );
    },
    undefined,
    { timeout: 15_000 },
  );
}

test('loading freezes the rendered button width (real layout)', async ({ page }) => {
  await page.goto(buildStoryUrl('components-button--playground', 'light'));
  await waitForStorySettled(page);
  const button = page.locator('tk-button').first();
  await expect(button).toBeAttached();

  const widths = await button.evaluate(async (node) => {
    const el = node as HTMLElement & { loading: boolean; updateComplete: Promise<unknown> };
    const widthBefore = el.offsetWidth;
    el.loading = true;
    await el.updateComplete;
    return { widthBefore, widthAfter: el.offsetWidth };
  });
  expect(widths.widthAfter).toBe(widths.widthBefore);
  expect(widths.widthBefore).toBeGreaterThan(0);
});

test('compact: 44px element box with a 32px visual pill (target floor)', async ({ page }) => {
  await page.goto(buildStoryUrl('components-button--variants-and-sizes', 'light'));
  await waitForStorySettled(page);
  const box = await page.evaluate(() => {
    const measure = (selector: string): number =>
      (document.querySelector(selector) as HTMLElement | null)?.offsetHeight ?? -1;
    const el = document.querySelector("tk-button[size='compact']") as HTMLElement | null;
    const pill = el?.shadowRoot?.querySelector('.button') as HTMLElement | null;
    if (!el || !pill) return null;
    return {
      elementHeight: el.offsetHeight,
      pillHeight: pill.offsetHeight,
      heroHeight: measure("tk-button[size='hero']"),
      cardHeight: measure("tk-button[size='card']"),
    };
  });
  expect(box).not.toBeNull();
  expect(box?.heroHeight).toBe(56);
  expect(box?.cardHeight).toBe(48);
  // The 44px floor lives on the ELEMENT (6px structural block padding + pill),
  // the faithful 32px pill stays the visual.
  expect(box?.elementHeight).toBe(44);
  expect(box?.pillHeight).toBe(32);
});
