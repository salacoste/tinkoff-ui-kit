import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-tooltip OPEN visual coverage (Story 4.2) — the select.spec.ts
 * page-level clip mold: the promoted pill is invisible to body-locator
 * element screenshots, so the open capture is PAGE-LEVEL over the
 * trigger ∪ pill region.
 *
 * Layout assertions accompany the capture: the pill must be visible,
 * controller-mounted (tooltip layer z token) and positioned ABOVE the
 * trigger (placement top + the 8px offset), with the trigger's
 * aria-describedby wired to the pill's id.
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
  test(`open pill region (top-layer surface): visible, anchored above, describedby wired [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-tooltip--open', theme));
    await waitForStorySettled(page);
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-tooltip').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const tooltip = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      // Exercise the ELEMENT-API mount path (the interactive one).
      tooltip.open = false;
      await tooltip.updateComplete;
      tooltip.open = true;
      await tooltip.updateComplete;

      const surface =
        tooltip.shadowRoot?.querySelector('[role="tooltip"]') ??
        document.querySelector('#tk-overlay-root > [role="tooltip"]');
      const trigger = tooltip.querySelector('button');
      if (!surface || !trigger) return null;
      const surfaceRect = surface.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      return {
        hidden: (surface as HTMLElement).hidden,
        zIndex: (surface as HTMLElement).style.zIndex,
        position: (surface as HTMLElement).style.position,
        role: surface.getAttribute('role'),
        tabindex: surface.hasAttribute('tabindex'),
        describedBy: trigger.getAttribute('aria-describedby'),
        surfaceId: surface.id,
        text: (surface.shadowRoot?.textContent ?? '').trim(),
        surfaceBottom: surfaceRect.bottom,
        triggerTop: triggerRect.top,
        clip: {
          x: Math.floor(Math.min(triggerRect.left, surfaceRect.left)),
          y: Math.floor(Math.min(triggerRect.top, surfaceRect.top)),
          width: Math.ceil(
            Math.max(triggerRect.right, surfaceRect.right) -
              Math.min(triggerRect.left, surfaceRect.left),
          ),
          height: Math.ceil(
            Math.max(triggerRect.bottom, surfaceRect.bottom) -
              Math.min(triggerRect.top, surfaceRect.top),
          ),
        },
      };
    });
    expect(geo, 'trigger + pill geometry resolves').not.toBeNull();
    expect(geo?.hidden, 'the pill is visible (not [hidden])').toBe(false);
    expect(geo?.zIndex, 'controller-mounted (tooltip layer token)').toBe('var(--tk-z-tooltip)');
    expect(geo?.position, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    expect(geo?.role).toBe('tooltip');
    expect(geo?.tabindex, 'never focusable').toBe(false);
    expect(geo?.describedBy, 'the trigger points at the pill').toBe(geo?.surfaceId);
    expect(geo?.text).toContain('Ставка действует');
    expect(geo?.surfaceBottom, 'placement top: the pill sits above the trigger').toBeLessThanOrEqual(
      geo?.triggerTop ?? 0,
    );

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under tooltip.spec.ts-snapshots/.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });
}
