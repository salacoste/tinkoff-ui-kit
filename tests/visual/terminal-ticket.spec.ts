import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * Terminal ticket real-engine coverage (spec 24T.2): the MEASURED geometry
 * of the pattern story against the capture pack — computed rectangles, not
 * the eye (the 26.4 ruling). Pins: the CTA pair's 32px visual pill (the
 * compact register's ::before inset), the 8px column gap, the 27px limits
 * strip, the 155px CTA width (the homepage UX-DR14 column-flex recipe),
 * and the measured DOM mechanics of the steppers (tabindex −1, the
 * boundary disable).
 *
 * Functional only (no baseline): theme-independent geometry, light theme,
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

test('the CTA pair rides the measured terminal registers (32px pill, 8px gap, 155px width)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('invest-terminal-ticket--terminal-ticket', 'light'));
  await waitForStorySettled(page);

  const buy = page.locator('tk-button.tt-cta').first();
  await expect(buy).toBeAttached();

  // The 44px interactive box (the compact hit target) with the 32px VISUAL
  // pill painted by the ::before inset — both computed, not eyed.
  const geometry = await buy.evaluate((node) => {
    const host = node as HTMLElement;
    const inner = host.shadowRoot?.querySelector('.button') as HTMLElement | null;
    const before = inner ? getComputedStyle(inner, '::before') : null;
    return {
      hostWidth: host.getBoundingClientRect().width,
      boxHeight: inner ? inner.getBoundingClientRect().height : -1,
      pillHeight: before ? Number.parseFloat(before.height) : -1,
      pillWidth: before ? Number.parseFloat(before.width) : -1,
    };
  });
  expect(geometry.hostWidth, 'CTA host = the measured 155px column slot').toBe(155);
  expect(geometry.boxHeight, 'compact hit box = 44px (the a11y floor)').toBe(44);
  expect(geometry.pillHeight, 'visual pill = the measured 32px').toBe(32);
  expect(geometry.pillWidth, 'the pill stretches to the full host (UX-DR14 recipe)').toBe(155);

  // The measured 8px gap between the buy and sell columns.
  const gap = await page.evaluate(() => {
    const columns = [...document.querySelectorAll('.tt-column')] as HTMLElement[];
    const left = columns[0]?.getBoundingClientRect();
    const right = columns[1]?.getBoundingClientRect();
    return left && right ? right.left - left.right : -1;
  });
  expect(gap, 'the buy/sell column gap = 8px').toBe(8);
});

test('the limits strips are the measured 27px inset bars', async ({ page }) => {
  await page.goto(buildStoryUrl('invest-terminal-ticket--terminal-ticket', 'light'));
  await waitForStorySettled(page);

  const strips = page.locator('.tt-limit');
  await expect(strips).toHaveCount(2);
  const heights = await strips.evaluateAll((nodes) =>
    (nodes as HTMLElement[]).map((node) => node.getBoundingClientRect().height),
  );
  expect(heights).toEqual([27, 27]);
});

test('the steppers sit outside the tab order and disable at the boundary (measured DOM mechanics)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('invest-terminal-ticket--terminal-ticket', 'light'));
  await waitForStorySettled(page);

  // Every stepper: tabindex=-1 (keyboard types digits — the live DOM) and
  // the measured aria-labels.
  const steppers = page.locator('.tt-step');
  const count = await steppers.count();
  expect(count).toBeGreaterThanOrEqual(4); // at least the market panel's pair + limit's
  for (let i = 0; i < count; i += 1) {
    await expect(steppers.nth(i)).toHaveAttribute('tabindex', '-1');
    const label = await steppers.nth(i).getAttribute('aria-label');
    expect(['Плюс', 'Минус']).toContain(label ?? '');
  }

  // The boundary: at 1 lot every MINUS is disabled + aria-disabled (the
  // live DOM pair state); one PLUS click lifts it.
  const minus = steppers.filter({ hasText: '−' }).first();
  const plus = steppers.filter({ hasText: '+' }).first();
  await expect(minus).toBeDisabled();
  await expect(minus).toHaveAttribute('aria-disabled', 'true');
  await plus.click();
  await expect(minus).toBeEnabled();
  await expect(minus).not.toHaveAttribute('aria-disabled', 'true');
  // The typed lots state is shared across every mode panel's field.
  const lotsValues = await page.evaluate(() =>
    [...document.querySelectorAll('tk-input.tt-lots')].map(
      (node) => (node.shadowRoot?.querySelector('input') as HTMLInputElement | null)?.value,
    ),
  );
  expect(lotsValues.length).toBeGreaterThanOrEqual(3);
  for (const value of lotsValues) expect(value).toBe('2');
});
