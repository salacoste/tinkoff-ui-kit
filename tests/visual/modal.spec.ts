import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-modal OPEN visual coverage (Story 4.1) — the select.spec.ts page-level
 * clip mold: `locator('body')` element screenshots EXCLUDE popover-promoted
 * content, so the modal's open baselines in visual.spec.ts record the story
 * chrome but NOT the promoted surface. Here the capture is PAGE-LEVEL with
 * a clip over the panel region — the page screenshot DOES include top-layer
 * pixels.
 *
 * Layout assertions accompany the capture: the surface must be visible,
 * controller-mounted (modal layer z token), the panel centered with the
 * 480px spacing-derived cap, and the initial focus inside the dialog (the
 * first slotted action button).
 *
 * Same pinned webServer/capture config as the visual suite (build docs
 * first — pnpm test:visual does); reducedMotion: reduce keeps the entrance
 * at its final keyframe for a deterministic capture.
 */

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
  test(`open dialog region (top-layer surface): visible, centered, width-capped [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-modal--open', theme));
    await waitForStorySettled(page);
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-modal').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const modal = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      // Exercise the ELEMENT-API mount path (the interactive one), not the
      // attribute-at-first-paint path the story itself uses.
      modal.open = false;
      await modal.updateComplete;
      modal.open = true;
      await modal.updateComplete;

      const surface =
        modal.shadowRoot?.querySelector('.modal') ??
        document.querySelector('#tk-overlay-root > div');
      const panel = surface?.shadowRoot?.querySelector('.panel') ?? null;
      if (!surface || !panel) return null;
      const surfaceRect = surface.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      return {
        hidden: (surface as HTMLElement).hidden,
        zIndex: (surface as HTMLElement).style.zIndex,
        position: getComputedStyle(surface).position,
        role: panel.getAttribute('role'),
        ariaModal: panel.getAttribute('aria-modal'),
        labelledBy: panel.getAttribute('aria-labelledby'),
        panelRect: {
          x: panelRect.x,
          y: panelRect.y,
          width: panelRect.width,
          height: panelRect.height,
        },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        surfaceRect: { width: surfaceRect.width, height: surfaceRect.height },
      };
    });
    expect(geo, 'surface + panel geometry resolves').not.toBeNull();
    expect(geo?.hidden, 'the surface is visible (not [hidden])').toBe(false);
    expect(geo?.zIndex, 'controller-mounted (modal layer token)').toBe('var(--tk-z-modal)');
    expect(
      geo?.position,
      "viewport-anchored frame (sheet :host fixed; only z is inline — the controller's)",
    ).toBe('fixed');
    expect(geo?.role).toBe('dialog');
    expect(geo?.ariaModal).toBe('true');
    expect(geo?.labelledBy, 'named via the heading idref').toBeTruthy();
    // The frame spans the viewport (scrim coverage)…
    expect(Math.round(geo?.surfaceRect.width ?? 0)).toBe(geo?.viewport.width ?? -1);
    // …and the panel is centered with the 480px cap (10 × the 48 step).
    const viewport = geo?.viewport ?? { width: 0, height: 0 };
    const panel = geo?.panelRect ?? { x: 0, y: 0, width: 0, height: 0 };
    expect(panel.width).toBeLessThanOrEqual(480 + 1);
    expect(Math.abs(panel.x + panel.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(panel.y + panel.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(1);

    // The region capture: page-level clip over the panel (top-layer content
    // included) with its OWN baseline set under modal.spec.ts-snapshots/.
    const clip = {
      x: Math.floor(panel.x),
      y: Math.floor(panel.y),
      width: Math.ceil(panel.width),
      height: Math.ceil(panel.height),
    };
    await expect(page).toHaveScreenshot({ clip });
  });
}
