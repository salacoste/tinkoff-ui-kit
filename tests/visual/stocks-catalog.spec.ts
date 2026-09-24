import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * Showcase «Каталог инструментов» (spec 6.5) — the composed stocks catalog's
 * OWN visual/wiring coverage, the filter-chips/combobox-search spec mold:
 * `locator('body')` element screenshots EXCLUDE popover-promoted content, so
 * the story baselines in visual.spec.ts record the page with the suggestion
 * panel CLOSED. Here the open-panel capture is PAGE-LEVEL with a clip
 * covering the field + panel region — the page screenshot DOES include
 * top-layer pixels — so the composed page's top-layer surface gets
 * kit-vs-kit drift protection from day one (the HANDOFF §5 «open-state
 * baselines» lesson; the spec 6.5 page-clip ruling).
 *
 * The WIRING asserts (spec 6.5: «unit-test what the harness can» — the
 * matrix rows a browser CAN drive live): the five controls' composition is
 * exercised through real events — search commit filters, chips facet-filter
 * (AND across kinds, zero-state with controls operable), pagination windows
 * the FILTERED set with focus landing on the newly-active number, and
 * «Показать еще» grows the window until the numbered row collapses. The
 * full keyboard journey is the recorded playwright-cli walkthrough
 * (.playwright-cli/verify/stocks-catalog/walkthrough.md).
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does).
 */

const STORY_ID = 'showcase-stocks-catalog--stocks-catalog';

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

for (const theme of THEMES) {
  test(`open search panel on the composed page (top-layer, typing path): visible, field-anchored, width-matched [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl(STORY_ID, theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-combobox-search').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const host = node as HTMLElement & { updateComplete: Promise<unknown> };
      const root = host.shadowRoot;
      const control = root?.querySelector<HTMLInputElement>('.field__control');
      const fieldBox = root?.querySelector('.field')?.getBoundingClientRect();
      if (!control || !fieldBox) return null;
      // Exercise the INTERACTION mount path (typing), not a first-paint
      // attribute — the menu's open state is internal (spec 6.3).
      control.focus();
      // 5 «сб» instruments: Сбербанк, Сбербанк-ап, Т-Инвестиции ТМосбиржа
      // (Мосбиржа), Сбер MOEX Total Return, Индекс МосБиржи (МосБиржи) —
      // the panel filters label AND value by substring, dataset-wide.
      control.value = 'сб';
      control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await host.updateComplete;
      const panel = root?.getElementById(control.getAttribute('aria-controls') ?? '');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const clip = {
        x: Math.floor(Math.min(fieldBox.left, rect.left)),
        y: Math.floor(Math.min(fieldBox.top, rect.top)),
        width: Math.ceil(Math.max(fieldBox.right, rect.right) - Math.min(fieldBox.left, rect.left)),
        height: Math.ceil(Math.max(fieldBox.bottom, rect.bottom) - Math.min(fieldBox.top, rect.top)),
      };
      return {
        expanded: control.getAttribute('aria-expanded'),
        rows: panel.querySelectorAll('[role="option"]:not([aria-disabled="true"])').length,
        inlinePosition: (panel as HTMLElement).style.position,
        inlineWidth: Number.parseFloat((panel as HTMLElement).style.width),
        fieldWidth: fieldBox.width,
        panelTop: rect.top,
        fieldBottom: fieldBox.bottom,
        clip,
      };
    });
    expect(geo, 'the field + panel geometry resolves').not.toBeNull();
    expect(geo?.expanded, 'the menu is open').toBe('true');
    expect(geo?.rows, 'the dataset-wide option list filters (5 «сб» instruments)').toBe(5);
    expect(geo?.inlinePosition, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    // Subpixel serialization round-down allowance — the filter-chips precedent.
    expect(
      (geo?.inlineWidth ?? 0) + 0.01,
      'matchAnchorWidth true: panel width ≥ the field width',
    ).toBeGreaterThanOrEqual(geo?.fieldWidth ?? 0);
    expect(geo?.panelTop, 'panel sits below the field box (offset applied)').toBeGreaterThanOrEqual(
      geo?.fieldBottom ?? 0,
    );

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under stocks-catalog.spec.ts-snapshots/. Only the
    // clip is passed inline — thresholds/animations stay in playwright.config.ts.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });
}

test('composed wiring: search commit → chips facet (AND + zero-state + recovery) → page-2 slice → load-more collapse [light]', async ({
  page,
}) => {
  await page.goto(buildStoryUrl(STORY_ID, 'light'));
  await waitForStorySettled(page);

  const tableRows = page.locator('tk-data-table [role="rowgroup"] [role="row"]');
  const empty = page.locator('tk-data-table .empty');

  // Default: «Акции» (13 instruments) windowed at 10 → page 1 of 2.
  await expect(tableRows).toHaveCount(10);
  await expect(page.locator('tk-pagination [data-page="1"]')).toHaveAttribute(
    'aria-current',
    'page',
  );

  // SEARCH COMMIT: type «сб», arrows, Enter — the panel's active row commits.
  const control = page.locator('tk-combobox-search .field__control');
  await control.click();
  await control.pressSequentially('сб');
  await expect(page.locator('tk-combobox-search .status')).toHaveText('Найдено 5 инструментов');
  // Typing leaves the FIRST match active («Сбербанк» — no arrow needed; the
  // walkthrough's S12/S13 arrow detour lands back on it the same way).
  await control.press('Enter'); // commit → value-change → the story re-filters
  await expect(control).toHaveValue('Сбербанк'); // the field shows the committed label
  await expect(tableRows).toHaveCount(2); // Сбербанк + Сбербанк-ап (substring)
  await expect(empty).toHaveCount(0);
  await expect(control).toBeFocused(); // focus never leaves the field on commit

  // CHIPS + AND: «Валюта» under the «Сбербанк» needle → composed zero rows.
  await page.locator('tk-filter-chips [role="tab"]', { hasText: 'Валюта' }).click();
  await expect(tableRows).toHaveCount(0);
  await expect(empty).toHaveText('Нет данных'); // the table's zero-state, never blank
  // Controls stay operable (never a dead end): the chips row still selects.
  await expect(page.locator('tk-filter-chips [role="tab"]', { hasText: 'Валюта' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  // RECOVERY: back to «Акции» — the AND predicate releases, rows return.
  await page.locator('tk-filter-chips [role="tab"]', { hasText: 'Акции' }).click();
  await expect(tableRows).toHaveCount(2);
  await expect(empty).toHaveCount(0);

  // PAGINATION SLICE + FOCUS (fresh state — reload resets the story closure).
  await page.reload();
  await waitForStorySettled(page);
  await expect(tableRows).toHaveCount(10);
  await page.locator('tk-pagination [data-page="2"]').click();
  await expect(tableRows).toHaveCount(3); // stocks 11–13: Аэрофлот, Татнефть, АЛРОСА
  await expect(page.locator('tk-data-table [role="rowgroup"] [role="row"] a').first()).toHaveText(
    'Аэрофлот',
  );
  // The pager's focus discipline: the newly-active page number takes focus.
  await expect(page.locator('tk-pagination [data-page="2"]')).toBeFocused();
  await expect(page.locator('tk-pagination [data-page="2"]')).toHaveAttribute(
    'aria-current',
    'page',
  );

  // LOAD MORE: the bar grows the window (10 → 20) over 13 filtered rows —
  // count collapses to 1 and the numbered row hides itself (count=1 rule).
  await page.locator('tk-pagination .load-more').click();
  await expect(tableRows).toHaveCount(13);
  await expect(page.locator('tk-pagination .pages')).toHaveCount(0);
  await expect(page.locator('tk-pagination .load-more')).toBeFocused(); // focus stays on the bar
});
