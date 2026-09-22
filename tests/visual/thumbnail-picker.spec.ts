import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-thumbnail-picker LIVE-engine coverage (Story 2.6) — the rows the unit
 * suite cannot prove:
 *
 * 1. FORM PARTICIPATION (the env split documented in
 *    thumbnail-picker.test.ts): happy-dom ships no ElementInternals, so the
 *    FormData row rides the host's formAssociated + setFormValue mirror,
 *    asserted through the REAL user pipeline (tile click → native change →
 *    Lit pipeline → setFormValue).
 * 2. ROW-MAJOR GRID NAVIGATION against the RENDERED grid (the spec's noted
 *    testing problem — «test the navigation math against the RENDERED
 *    grid»): the playground's 324px composition lays 6 tiles out at 4
 *    columns (4+2, the reference shape); the column count is derived here
 *    from REAL bounding rects (clustering by top offset — the same
 *    technique the component uses at keydown time), and the real keyboard
 *    drives the arrows: Right at a row end lands on the NEXT ROW'S FIRST
 *    tile, Down keeps the column, Down from the bottom row wraps to the top.
 * 3. ≥44×44 hit-area floor: each tile's invisible radio spans the full
 *    72×72 tile.
 * 4. Accessible names stay exact (the getByRole computed-name probe — the
 *    2.5 label[for] regression guard).
 * 5. The image-fail fallback fires live (the 404 tiles in the Состояния
 *    story swap to initials; no broken-image glyph).
 *
 * Functional only (no baseline): theme-independent behavior, so it runs on
 * the light theme. Same pinned webServer as the visual suite — build docs
 * first (pnpm test:visual does).
 */

/** Settle wait — same contract as visual.spec.ts (children or error display). */
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

test('thumbnail picker submits natively inside a form: name=selected value, nothing when unselected', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-thumbnailpicker--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-thumbnail-picker').first();
  await expect(el).toBeAttached();

  const result = await el.evaluate(async (node) => {
    const group = node as HTMLElement & { updateComplete: Promise<unknown> };
    // Compose the form AROUND the host exactly as a consumer would.
    const form = document.createElement('form');
    node.parentElement?.insertBefore(form, node);
    form.append(node);
    group.setAttribute('name', 'design');
    await group.updateComplete;

    const tiles = Array.from(
      group.shadowRoot?.querySelectorAll('label.tile') ?? [],
    ) as HTMLElement[];
    const readForm = () => Object.fromEntries(new FormData(form).entries());
    const outcomes: Record<string, unknown> = {};

    // The playground ships default-value="black" → the selected tile submits.
    outcomes.afterDefault = readForm();

    // REAL native path: clicking a tile label checks the shadow radio and
    // fires the browser's own change event through the element pipeline.
    tiles[3]?.click();
    await group.updateComplete;
    outcomes.afterClick = readForm();

    tiles[0]?.click();
    await group.updateComplete;
    outcomes.afterClickBack = readForm();

    // A nameless group contributes nothing.
    group.removeAttribute('name');
    await group.updateComplete;
    outcomes.nameless = readForm();

    outcomes.checkedValues = Array.from(
      group.shadowRoot?.querySelectorAll('input[type="radio"]') ?? [],
    ).map((input) => (input as HTMLInputElement).checked);
    return outcomes;
  });

  expect(result.afterDefault).toEqual({ design: 'black' });
  expect(result.afterClick).toEqual({ design: 'blue' });
  expect(result.afterClickBack).toEqual({ design: 'black' });
  expect(result.nameless).toEqual({});
  // Exactly one checked radio throughout — the invariant, live.
  expect((result.checkedValues as boolean[]).filter(Boolean)).toHaveLength(1);
});

test('row-major arrows against the RENDERED grid: row-end Right → next row first; Down keeps the column; bottom wraps', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-thumbnailpicker--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-thumbnail-picker').first();
  await expect(el).toBeAttached();

  // The composition geometry, measured from REAL rects: tiles are 72×72 and
  // cluster into a 4-column layout (4+2 — the reference shape) inside the
  // story's 324px field. The column count uses the component's own
  // technique — the FIRST row's tile run — because 4+2 rows are uneven
  // (tiles/rows would read 3).
  const columns = await el.evaluate((node) => {
    const tiles = Array.from(
      (node as HTMLElement).shadowRoot?.querySelectorAll('.tile') ?? [],
    ) as HTMLElement[];
    const topOf = (tile: HTMLElement) => Math.round(tile.getBoundingClientRect().top);
    const firstTop = tiles.length > 0 ? topOf(tiles[0] as HTMLElement) : -1;
    const rows = new Set(tiles.map(topOf)).size;
    const widths = new Set(tiles.map((tile) => Math.round(tile.getBoundingClientRect().width)));
    return { columns: tiles.filter((tile) => topOf(tile) === firstTop).length, rows, tileWidth: [...widths][0] };
  });
  expect(columns.tileWidth).toBe(72);
  expect(columns.rows).toBe(2);
  expect(columns.columns).toBe(4);

  const readState = () =>
    el.evaluate((node) => {
      const group = node as HTMLElement;
      const radios = Array.from(
        group.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [],
      );
      const active = group.shadowRoot?.activeElement as HTMLInputElement | null;
      return {
        active: active?.value ?? null,
        checked: radios.find((radio) => radio.checked)?.value ?? null,
      };
    });

  await el.evaluate((node) => {
    (node as HTMLElement).shadowRoot?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  });
  expect((await readState()).active).toBe('black');

  // REAL keyboard: Down keeps the column — black (row 1, col 1) → green
  // (row 2, col 1). Selection follows focus.
  await page.keyboard.press('ArrowDown');
  expect(await readState()).toEqual({ active: 'green', checked: 'green' });

  // Down from the BOTTOM row wraps to the TOP row, same column.
  await page.keyboard.press('ArrowDown');
  expect(await readState()).toEqual({ active: 'black', checked: 'black' });

  // Right across row 1 to its end (black → yellow → platinum → blue).
  await page.keyboard.press('ArrowRight');
  expect((await readState()).active).toBe('yellow');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect((await readState()).active).toBe('blue');

  // Right AT THE ROW END lands on the NEXT ROW'S FIRST tile (green, index 4),
  // not a wrap to the very first.
  await page.keyboard.press('ArrowRight');
  expect(await readState()).toEqual({ active: 'green', checked: 'green' });

  // Left mirrors: from the next row's first tile back to the previous row's last.
  await page.keyboard.press('ArrowLeft');
  expect((await readState()).active).toBe('blue');

  // Up from the TOP row's col 4 (which the short bottom row lacks) clamps
  // to the bottom row's LAST tile (the WAI nearest-cell convention).
  await page.keyboard.press('ArrowUp');
  expect((await readState()).active).toBe('red');

  // Up from the bottom row keeps the column (red → yellow).
  await page.keyboard.press('ArrowUp');
  expect((await readState()).active).toBe('yellow');
});

test('tile hit areas: every radio covers ≥44×44 (the invisible input spans the tile)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-thumbnailpicker--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-thumbnail-picker').first();
  await expect(el).toBeAttached();

  const geometry = await el.evaluate((node) => {
    return Array.from(
      (node as HTMLElement).shadowRoot?.querySelectorAll('input[type="radio"]') ?? [],
    ).map((input) => {
      const rect = (input as HTMLElement).getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
  });

  expect(geometry).toHaveLength(6);
  for (const tile of geometry) {
    expect(tile.width).toBeGreaterThanOrEqual(44);
    expect(tile.height).toBeGreaterThanOrEqual(44);
  }
});

test('group label is a SPAN: tile names stay exactly «Чёрная»/«Синяя» (accessible-name safety)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-thumbnailpicker--playground', 'light'));
  await waitForStorySettled(page);
  await expect(page.getByRole('radio', { name: 'Чёрная', exact: true })).toHaveCount(1);
  await expect(page.getByRole('radio', { name: 'Синяя', exact: true })).toHaveCount(1);
  await expect(page.getByRole('radiogroup', { name: 'Выберите дизайн карты' })).toHaveCount(1);
});

test('image-fail fallback fires live: the 404 tiles swap to initials, no broken-image glyph', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-thumbnailpicker--variants', 'light'));
  await waitForStorySettled(page);
  // Network settles after the 404s complete; the error handlers run.
  await page.waitForLoadState('networkidle');

  // The broken-URL instance is the fourth picker in the Состояния story.
  const broken = page.locator('main tk-thumbnail-picker').nth(3);
  await expect(broken).toBeAttached();
  const state = await broken.evaluate((node) => ({
    images: (node as HTMLElement).shadowRoot?.querySelectorAll('.tile__image').length ?? 0,
    initials: (node as HTMLElement).shadowRoot?.querySelectorAll('.tile__initials').length ?? 0,
    firstInitial: (node as HTMLElement).shadowRoot?.querySelector('.tile__initials')?.textContent ?? '',
  }));
  expect(state.images, 'no image element survives the 404').toBe(0);
  expect(state.initials).toBe(4);
  expect(state.firstInitial).toBe('Ч');

  // The empty-state instances render the copy slot (default + projected).
  const emptyDefault = page.locator('main tk-thumbnail-picker').nth(6);
  const emptyCopy = await emptyDefault.evaluate(
    (node) => (node as HTMLElement).shadowRoot?.querySelector('.empty')?.textContent ?? '',
  );
  expect(emptyCopy).toContain('Нет доступных вариантов');
});
