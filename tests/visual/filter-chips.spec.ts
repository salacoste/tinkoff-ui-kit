import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-filter-chips OPEN-MENU visual coverage (spec 6.2) — the select.spec.ts
 * mold: `locator('body')` element screenshots EXCLUDE popover-promoted
 * content, so the story baselines in visual.spec.ts record the chip row but
 * NOT the floating «Ещё» menu. Here the capture is PAGE-LEVEL with a clip
 * covering the «Ещё» chip + panel region — the page screenshot DOES include
 * top-layer pixels — so the open menu gets automated kit-vs-kit drift
 * protection from day one (the HANDOFF §5 «open-state baselines» lesson).
 *
 * The menu's open state is INTERNAL (no declarative `open` channel — the
 * spec's ruling), so this spec drives the element API: a real keyboard press
 * on the «Ещё» chip mounts the menu through the interaction path consumers
 * use. Layout assertions accompany the capture: the panel must be visible,
 * controller-positioned (inline fixed), anchored BELOW the «Ещё» chip, and
 * min-width-matched to it (positionFloating's matchAnchorWidth: 'min').
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
  test(`open «Ещё» menu region (top-layer panel): visible, anchored, width-matched [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-filterchips--playground', theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-filter-chips').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const host = node as HTMLElement & { updateComplete: Promise<unknown> };
      const root = host.shadowRoot;
      const more = root?.querySelector<HTMLButtonElement>('.chip--more');
      if (!more) return null;
      // Exercise the INTERACTION mount path (keyboard open), not a
      // first-paint attribute — the menu's open state is internal (spec 6.2).
      more.focus();
      more.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
      await host.updateComplete;
      const chipRect = more.getBoundingClientRect();
      const panel = root?.getElementById(more.getAttribute('aria-controls') ?? '');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const clip = {
        x: Math.floor(Math.min(chipRect.left, rect.left)),
        y: Math.floor(Math.min(chipRect.top, rect.top)),
        width: Math.ceil(Math.max(chipRect.right, rect.right) - Math.min(chipRect.left, rect.left)),
        height: Math.ceil(Math.max(chipRect.bottom, rect.bottom) - Math.min(chipRect.top, rect.top)),
      };
      return {
        expanded: more.getAttribute('aria-expanded'),
        rows: panel.querySelectorAll('[role="menuitemradio"]').length,
        inlinePosition: (panel as HTMLElement).style.position,
        inlineMinWidth: Number.parseFloat((panel as HTMLElement).style.minWidth),
        chipWidth: chipRect.width,
        panelTop: rect.top,
        chipBottom: chipRect.bottom,
        panelHeight: rect.height,
        clip,
      };
    });
    expect(geo, 'the «Ещё» chip + panel geometry resolves').not.toBeNull();
    expect(geo?.expanded, 'the menu is open').toBe('true');
    expect(geo?.rows, 'the overflow residents render as menuitemradio rows').toBe(3);
    expect(geo?.inlinePosition, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    // Subpixel: positionFloating writes the anchor rect's exact width
    // (88.140625px) into the inline style, but serialized style values round
    // to 4 decimals (88.1406px) — allow that serialization round-down, which
    // sits far below any visible drift.
    expect(
      (geo?.inlineMinWidth ?? 0) + 0.01,
      'matchAnchorWidth min: panel min-width ≥ the «Ещё» chip width',
    ).toBeGreaterThanOrEqual(geo?.chipWidth ?? 0);
    expect(geo?.panelTop, 'panel sits below the «Ещё» chip (offset applied)').toBeGreaterThanOrEqual(
      geo?.chipBottom ?? 0,
    );
    expect(geo?.panelHeight).toBeGreaterThan(0);

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under filter-chips.spec.ts-snapshots/. Only the
    // clip is passed inline — thresholds/animations stay in playwright.config.ts.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });
}
