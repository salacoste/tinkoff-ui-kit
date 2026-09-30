import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-menu-popover OPEN-PANEL visual coverage (spec 19.1) — the select.spec.ts
 * top-layer mold: `locator('body')` element screenshots EXCLUDE
 * popover-promoted content, so the auto suite's baseline for the Open story
 * records the story chrome but NOT the floating panel. Here the capture is
 * PAGE-LEVEL with a clip over the anchor + panel region — page screenshots
 * include top-layer pixels — so the open menu gets kit-vs-kit drift
 * protection from day one.
 *
 * Geometry assertions accompany the capture, pinning the 19.1 positioning
 * contract in a real layout engine: the panel is visible,
 * controller-positioned (inline fixed, dropdown z token), anchored BELOW the
 * trigger, and RIGHT-EDGE ALIGNED (positionFloating's alignment:'end' — the
 * captures' console anchor mode, the geometry the story 19.1 extension
 * exists for).
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
  test(`open panel region (top-layer menu): visible, anchored below, right-edge aligned [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-menupopover--open', theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-menu-popover').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const menu = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      // Exercise the ELEMENT-API mount path (the interactive one), not the
      // attribute-at-first-paint path the story itself uses.
      menu.open = false;
      await menu.updateComplete;
      menu.open = true;
      await menu.updateComplete;

      // The anchor is light DOM (slot="anchor"); the panel lives in the
      // host's shadow tree (popover-promoted while open — never reparented
      // on the popover API path Chromium runs here).
      const trigger = menu.querySelector<HTMLElement>('[slot="anchor"]');
      const panel = menu.shadowRoot?.querySelector<HTMLElement>('[role="menu"]');
      if (!trigger || !panel) return null;
      const anchorRect = trigger.getBoundingClientRect();
      const rect = panel.getBoundingClientRect();
      const clip = {
        x: Math.floor(Math.min(anchorRect.left, rect.left)),
        y: Math.floor(Math.min(anchorRect.top, rect.top)),
        width: Math.ceil(Math.max(anchorRect.right, rect.right) - Math.min(anchorRect.left, rect.left)),
        height: Math.ceil(Math.max(anchorRect.bottom, rect.bottom) - Math.min(anchorRect.top, rect.top)),
      };
      return {
        hidden: panel.hidden,
        inlinePosition: panel.style.position,
        zIndex: panel.style.zIndex,
        anchorRight: anchorRect.right,
        panelRight: rect.right,
        panelTop: rect.top,
        anchorBottom: anchorRect.bottom,
        panelWidth: rect.width,
        panelHeight: rect.height,
        clip,
      };
    });
    expect(geo, 'anchor + panel geometry resolves').not.toBeNull();
    expect(geo?.hidden, 'the panel is visible (not [hidden])').toBe(false);
    expect(geo?.inlinePosition, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    expect(geo?.zIndex, 'dropdown layer token only (AD-12)').toBe('var(--tk-z-dropdown)');
    expect(geo?.panelTop, 'panel sits below the anchor (offset applied)').toBeGreaterThanOrEqual(
      geo?.anchorBottom ?? 0,
    );
    expect(
      Math.abs((geo?.panelRight ?? 0) - (geo?.anchorRight ?? 0)),
      "alignment 'end': trailing edges flush (the console right-edge anchor mode)",
    ).toBeLessThanOrEqual(1);
    expect(geo?.panelWidth, 'default width hook 280px').toBeGreaterThanOrEqual(270);
    expect(geo?.panelHeight).toBeGreaterThan(0);

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under menu-popover.spec.ts-snapshots/.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });
}
