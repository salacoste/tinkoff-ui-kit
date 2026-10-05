import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-textarea real-engine coverage (spec 24T.1): the autosize mechanism —
 * collapse to auto, re-measure scrollHeight, set the inline height — is a
 * BROWSER layout behavior invisible to happy-dom (scrollHeight reports 0),
 * exactly like the 26.4 focus mechanics. Everything here drives the REAL
 * user pipeline (page.keyboard on the focused control) and reads computed
 * geometry (the 26.4 ruling: computed rectangles, not the eye).
 *
 * Functional only (no baseline): theme-independent behavior, light theme,
 * same pinned webServer as the visual suite.
 */

/** Settle wait — the input-code.spec.ts contract. */
async function waitForStorySettled(page: Page): Promise<void> {
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

/** The inner native control's rendered height (px). */
const controlHeight = (el: ReturnType<Page['locator']>) =>
  el.evaluate((node) => {
    const field = (node as HTMLElement).shadowRoot?.querySelector('textarea');
    return field ? field.getBoundingClientRect().height : -1;
  });

test('typing a newline grows the box by one line-height step (32 → 48)', async ({ page }) => {
  await page.goto(buildStoryUrl('components-textarea--notes', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('tk-textarea').first();
  await expect(el).toBeAttached();

  // The passport's first field: empty, one row — the 32px floor.
  await expect.poll(() => controlHeight(el)).toBe(32);

  // Type one line of text + a newline: two content rows → 48.
  await el.locator('textarea').first().focus();
  await page.keyboard.type('первая строка');
  await page.keyboard.press('Enter');
  await expect.poll(() => controlHeight(el)).toBe(48);

  // One more newline: three rows → 64 (the 16·n+16 formula).
  await page.keyboard.press('Enter');
  await expect.poll(() => controlHeight(el)).toBe(64);
});

test('a multiline initial value grows the box on the first paint', async ({ page }) => {
  await page.goto(buildStoryUrl('components-textarea--notes', 'light'));
  await waitForStorySettled(page);
  // The passport's second field carries a two-line defaultValue.
  const el = page.locator('tk-textarea').nth(1);
  await expect(el).toBeAttached();
  await expect.poll(() => controlHeight(el)).toBe(48);
});

test('growth clamps at the max-height envelope and hands off to the scrollbar', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-textarea--notes', 'light'));
  await waitForStorySettled(page);
  // The passport's third field: four lines — within the 112px envelope.
  const grown = page.locator('tk-textarea').nth(2);
  await expect(grown).toBeAttached();
  await expect.poll(() => controlHeight(grown)).toBe(80);

  // Push past the envelope right in the browser: the box stops at 112 and
  // the content becomes scrollable.
  await grown.locator('textarea').first().focus();
  for (let i = 0; i < 6; i += 1) await page.keyboard.press('Enter');
  await expect.poll(() => controlHeight(grown)).toBe(112);
  const scrollable = await grown.evaluate((node) => {
    const field = (node as HTMLElement).shadowRoot?.querySelector('textarea');
    return field ? field.scrollHeight > field.clientHeight : false;
  });
  expect(scrollable, 'content exceeds the clipped box').toBe(true);
});

test('the envelope hooks resize the growth limits from the host', async ({ page }) => {
  await page.goto(buildStoryUrl('components-textarea--notes', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('tk-textarea').nth(2);
  await expect(el).toBeAttached();

  // A consumer ceiling override: four lines would want 80px; the host hook
  // caps the box at 64px (the single override channel, CONVENTIONS §6) —
  // the CSS envelope clamps the render with no re-measure needed.
  await el.evaluate((node) => {
    (node as HTMLElement).style.setProperty('--tk-textarea-max-height', '64px');
  });
  await expect.poll(() => controlHeight(el)).toBe(64);
});
