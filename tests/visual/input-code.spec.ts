import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-input CODE MODE real-engine coverage (spec 26.4): the focus mechanics —
 * auto-advance, the backspace walk, arrow walking — are BROWSER focus
 * behavior, invisible to happy-dom (its focus routing is not real; the unit
 * file asserts focus() spies instead). Everything here reads
 * shadowRoot.activeElement (the v1.5.0 lesson: document.activeElement
 * retargets to the host when focus sits in the shadow tree) through the REAL
 * user pipeline — page.keyboard on the focused cell, never synthetic DOM
 * shortcuts. Events are captured on the host with a window log so assertions
 * can read them outside evaluate.
 *
 * Functional only (no baseline): theme-independent behavior, light theme,
 * same pinned webServer as the visual suite (build docs first —
 * pnpm test:visual does).
 */

/** Settle wait — same contract as switch.spec.ts. */
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

/** Index of the cell holding REAL focus inside the shadow root (-1 = none). */
const focusedCellIndex = (el: ReturnType<Page['locator']>) =>
  el.evaluate((node) => {
    const shadow = (node as HTMLElement).shadowRoot;
    const active = shadow?.activeElement ?? null;
    if (!active) return -1;
    const cells = Array.from(shadow?.querySelectorAll('.code__cell') ?? []);
    return cells.indexOf(active);
  });

/** Arm the event log on the host (value-change / complete, arrival order). */
const armEventLog = (el: ReturnType<Page['locator']>) =>
  el.evaluate((node) => {
    const w = window as unknown as { __codeEvents?: string[] };
    w.__codeEvents = [];
    node.addEventListener('value-change', (event: Event) => {
      w.__codeEvents?.push(`v:${(event as CustomEvent<{ value: string }>).detail.value}`);
    });
    node.addEventListener('complete', (event: Event) => {
      w.__codeEvents?.push(`c:${(event as CustomEvent<{ value: string }>).detail.value}`);
    });
  });

const readEventLog = (page: Page) =>
  page.evaluate(() => (window as unknown as { __codeEvents?: string[] }).__codeEvents ?? []);

test('typing walks the cells with REAL focus and fires complete at the end', async ({ page }) => {
  await page.goto(buildStoryUrl('components-input--code-mode', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-input').first();
  await expect(el).toBeAttached();

  await el.locator('.code__cell').first().focus();
  await armEventLog(el);

  await page.keyboard.type('1234');

  // Auto-advance landed the real focus on the LAST cell.
  await expect.poll(() => focusedCellIndex(el)).toBe(3);
  // The state channel spoke per digit; complete closed the sequence.
  expect(await readEventLog(page)).toEqual(['v:1', 'v:12', 'v:123', 'v:1234', 'c:1234']);

  // Every cell shows its digit (data-filled states driven by the pipeline).
  const values = await el.evaluate((node) =>
    Array.from((node as HTMLElement).shadowRoot?.querySelectorAll('.code__cell') ?? []).map(
      (cell) => (cell as HTMLInputElement).value,
    ),
  );
  expect(values).toEqual(['1', '2', '3', '4']);
});

test('backspace on an empty cell walks back and clears the previous digit', async ({ page }) => {
  await page.goto(buildStoryUrl('components-input--code-mode', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-input').first();
  await expect(el).toBeAttached();

  await el.locator('.code__cell').first().focus();
  await armEventLog(el);

  await page.keyboard.type('12');
  await expect.poll(() => focusedCellIndex(el)).toBe(2);

  // Cell 2 is empty: backspace clears cell 1 and moves focus there…
  await page.keyboard.press('Backspace');
  await expect.poll(() => focusedCellIndex(el)).toBe(1);
  // …and the second backspace repeats the walk onto cell 0.
  await page.keyboard.press('Backspace');
  await expect.poll(() => focusedCellIndex(el)).toBe(0);

  expect(await readEventLog(page)).toEqual(['v:1', 'v:12', 'v:1', 'v:']);
  const values = await el.evaluate((node) =>
    Array.from((node as HTMLElement).shadowRoot?.querySelectorAll('.code__cell') ?? []).map(
      (cell) => (cell as HTMLInputElement).value,
    ),
  );
  expect(values).toEqual(['', '', '', '']);
});

test('arrow keys walk the row without producing values', async ({ page }) => {
  await page.goto(buildStoryUrl('components-input--code-mode', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-input').first();
  await expect(el).toBeAttached();

  await el.locator('.code__cell').first().focus();
  await armEventLog(el);

  await page.keyboard.press('ArrowRight');
  await expect.poll(() => focusedCellIndex(el)).toBe(1);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => focusedCellIndex(el)).toBe(2);
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => focusedCellIndex(el)).toBe(1);

  // Pure navigation: no value channel traffic at all.
  expect(await readEventLog(page)).toEqual([]);
});

test('a non-digit never commits — the cell snaps back, no events, focus stays', async ({ page }) => {
  await page.goto(buildStoryUrl('components-input--code-mode', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-input').first();
  await expect(el).toBeAttached();

  await el.locator('.code__cell').first().focus();
  await armEventLog(el);

  await page.keyboard.type('1a');
  // The letter was ignored: focus still advanced only past the digit.
  await expect.poll(() => focusedCellIndex(el)).toBe(1);
  const values = await el.evaluate((node) =>
    Array.from((node as HTMLElement).shadowRoot?.querySelectorAll('.code__cell') ?? []).map(
      (cell) => (cell as HTMLInputElement).value,
    ),
  );
  expect(values).toEqual(['1', '', '', '']);
  expect(await readEventLog(page)).toEqual(['v:1']);
});

test('kit-register geometry: 52px squares, 8px gap, family radius — computed, not eyed', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-input--code-mode', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-input').first();
  await expect(el).toBeAttached();

  const geometry = await el.evaluate(() => {
    const host = document.querySelector('main tk-input');
    const cells = Array.from(
      host?.shadowRoot?.querySelectorAll('.code__cell') ?? [],
    ) as HTMLInputElement[];
    const [a, b] = cells;
    const box = a.getBoundingClientRect();
    const next = b.getBoundingClientRect();
    const style = getComputedStyle(a);
    return {
      width: box.width,
      height: box.height,
      // Square + the kit gap register between neighbors.
      gap: next.left - box.right,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      // The size hook is the single channel for BOTH box dimensions.
      hookedSize: getComputedStyle(host as Element).getPropertyValue('--tk-input-code-size'),
    };
  });

  expect(geometry.width).toBe(52);
  expect(geometry.height).toBe(52);
  expect(geometry.gap).toBe(8);
  // radius-md resolves to 12px (the token sheet's value for the family).
  expect(geometry.borderRadius).toBe('12px');
  expect(geometry.borderWidth).toBe('1px');
  // No override set on the host — the default register renders.
  expect(geometry.hookedSize.trim()).toBe('');
});
