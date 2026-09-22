import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-select OPEN-MENU visual coverage (Story 2.3 review) — closes the
 * top-layer gap in visual.spec.ts: `locator('body')` element screenshots
 * EXCLUDE popover-promoted content, so the open-story baselines there record
 * the trigger/story chrome but NOT the floating menu (verified by vision on
 * the baseline PNG during 2.3). Here the capture is PAGE-LEVEL with a clip
 * covering the field + panel region — the page screenshot DOES include
 * top-layer pixels (proven by the 2.3 side-by-side captures) — so the open
 * menu gets automated kit-vs-kit drift protection NOW instead of Epic 4.
 *
 * Layout assertions accompany the capture: the panel must be visible,
 * controller-positioned (inline fixed), anchored BELOW the field, and
 * min-width-matched to it (positionFloating's matchAnchorWidth: 'min' —
 * the DOM effect, pinned here in a real layout engine).
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does).
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

for (const theme of THEMES) {
  test(`open menu region (top-layer panel): visible, anchored, width-matched [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-select--open', theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-select').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const select = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      // Exercise the ELEMENT-API mount path (the interactive one), not the
      // attribute-at-first-paint path the story itself uses.
      select.open = false;
      await select.updateComplete;
      select.open = true;
      await select.updateComplete;

      const root = select.shadowRoot;
      const field = root?.querySelector('.field')?.getBoundingClientRect();
      const panelId = root?.querySelector('.field__trigger')?.getAttribute('aria-controls');
      const panel = panelId ? root?.getElementById(panelId) : null;
      if (!field || !panel) return null;
      const rect = panel.getBoundingClientRect();
      const clip = {
        x: Math.floor(Math.min(field.left, rect.left)),
        y: Math.floor(Math.min(field.top, rect.top)),
        width: Math.ceil(Math.max(field.right, rect.right) - Math.min(field.left, rect.left)),
        height: Math.ceil(Math.max(field.bottom, rect.bottom) - Math.min(field.top, rect.top)),
      };
      return {
        hidden: panel.hidden,
        inlinePosition: (panel as HTMLElement).style.position,
        inlineMinWidth: Number.parseFloat((panel as HTMLElement).style.minWidth),
        fieldWidth: field.width,
        panelTop: rect.top,
        fieldBottom: field.bottom,
        panelHeight: rect.height,
        clip,
      };
    });
    expect(geo, 'field + panel geometry resolves').not.toBeNull();
    expect(geo?.hidden, 'the menu is visible (not [hidden])').toBe(false);
    expect(geo?.inlinePosition, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    expect(geo?.inlineMinWidth, 'matchAnchorWidth min: panel min-width ≥ field width').toBeGreaterThanOrEqual(
      geo?.fieldWidth ?? 0,
    );
    expect(geo?.panelTop, 'panel sits below the field (offset applied)').toBeGreaterThanOrEqual(
      geo?.fieldBottom ?? 0,
    );
    expect(geo?.panelHeight).toBeGreaterThan(0);

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under select.spec.ts-snapshots/. Only the clip is
    // passed inline — thresholds/animations stay in playwright.config.ts.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });
}
