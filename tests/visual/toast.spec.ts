import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-toast STACK visual coverage (Story 4.3) — the select.spec.ts
 * page-level clip mold: the stacking host is promoted into the top layer by
 * the queue's mountOverlay, so body-locator element screenshots never see
 * it. Here the capture is PAGE-LEVEL over the bottom-right stack region.
 *
 * Layout assertions accompany the capture: the shared host exists with the
 * toast layer z token, carries exactly the story's three STICKY toasts
 * (bottom-right), and each toast opts back into interaction (the host is
 * pass-through).
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
  test(`stack region (top-layer host): three toasts, bottom-right, interactive [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-toast--stack', theme));
    await waitForStorySettled(page);
    await pinDeterministicFonts(page);

    const geo = await page.evaluate(() => {
      const host = document.getElementById('tk-toast-stack');
      if (!host) return null;
      const toasts = Array.from(host.querySelectorAll('tk-toast'));
      const hostRect = host.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      return {
        zIndex: host.style.zIndex,
        toastCount: toasts.length,
        live: toasts.map((toast) => toast.getAttribute('aria-live') ?? toast.getAttribute('role')),
        pointerEvents: toasts.map((toast) => getComputedStyle(toast).pointerEvents),
        hostRect: {
          x: hostRect.x,
          y: hostRect.y,
          width: hostRect.width,
          height: hostRect.height,
          right: hostRect.right,
          bottom: hostRect.bottom,
        },
        viewport,
      };
    });
    expect(geo, 'the stacking host exists').not.toBeNull();
    expect(geo?.zIndex, 'controller-mounted (toast layer token)').toBe('var(--tk-z-toast)');
    expect(geo?.toastCount, 'three sticky toasts (default, action, destructive)').toBe(3);
    expect(geo?.live).toEqual(['polite', 'polite', 'alert']);
    for (const events of geo?.pointerEvents ?? []) {
      expect(events, 'toasts opt back into interaction (the host is pass-through)').toBe('auto');
    }
    // Bottom-right corner of the viewport (the host hugs the corner with
    // its token padding; zero-size boxes would fail the count above).
    expect(Math.round(geo?.hostRect.right ?? 0)).toBe(geo?.viewport.width ?? -1);
    expect(Math.round(geo?.hostRect.bottom ?? 0)).toBe(geo?.viewport.height ?? -1);

    // The region capture: page-level clip over the stack (top-layer content
    // included) with its OWN baseline set under toast.spec.ts-snapshots/.
    const clip = {
      x: Math.floor(geo?.hostRect.x ?? 0),
      y: Math.floor(geo?.hostRect.y ?? 0),
      width: Math.ceil(geo?.hostRect.width ?? 0),
      height: Math.ceil(geo?.hostRect.height ?? 0),
    };
    await expect(page).toHaveScreenshot({ clip });
  });
}
