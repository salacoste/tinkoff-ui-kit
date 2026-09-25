import { expect, test, type Page } from 'playwright/test';

import { analyzeAxe } from './axe-serialize';
import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * Showcase «Мобильное приложение Т-Инвестиций» (spec 7.5) — the composed
 * invest-mobile landing's OWN coverage, the homepage/stocks-catalog mold:
 * the generated suite (visual.spec.ts) pins the story's pixels + axe at the
 * FIXED desktop viewport in both themes; this spec adds the legs a composed
 * page needs beyond that:
 *
 * - VIEWPORT-SCOPED AXE: 1280 + 360 × 2 themes, zero WCAG violations — the
 *   narrow leg audits the stacked hero and the reflowed cluster (the spec's
 *   a11y row; homepage precedent for the missing breakpoint legs).
 * - QR TABS INTERACT: the 7.3 contract VERBATIM — the platform switcher is
 *   tk-tabs' own uncontrolled channel (automatic activation): ArrowRight
 *   moves selection, the visible panel's QR swaps to the second tab's
 *   encoding (seed 2 placeholder), and the note line follows the tab data
 *   (tab 2 carries none). Asserted live at the composed page.
 * - BADGES ARE EXTERNAL LINKS: three pills in the capture's order, each
 *   target=_blank + rel=noopener noreferrer (the 7.3 external-link
 *   contract), hrefs out of the page origin.
 * - NARROW VIEWPORT: the hero stacks (the CTA pair becomes a column and the
 *   pill stretches to the actions row), the art scales down (≤64% of the
 *   viewport), the stepper cards collapse to one column and the badge pills
 *   wrap one per row (the blocks' own auto-fit/wrap rules, probed live).
 * - THEME DARK: the dark URL param flips the preview root (capture-side
 *   assertion inside openInvest — a dark leg must never silently audit a
 *   light render).
 * - INTERACTIVE-STATE BASELINE: a page-level clip of the qr-block region
 *   with the SECOND platform tab active (the stocks-catalog open-state
 *   precedent: element screenshots can't see state the story doesn't rest
 *   in, so the swapped panel gets its own drift-protected baseline set
 *   under invest-landing.spec.ts-snapshots/).
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does).
 */

const STORY_ID = 'showcase-invest-landing--invest-landing';

/** WCAG rule tags — identical filter to the generated suite. */
const AXE_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/** The spec's breakpoints: the composed desktop + the narrow-viewport leg. */
const BREAKPOINTS = [
  { name: '1280', width: 1280 },
  { name: '360', width: 360 },
] as const;

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

/** Baseline gate (visual.spec.ts's assertNoErrorState, same semantics). */
async function assertNoErrorState(page: Page): Promise<void> {
  const isErrorState = await page.evaluate(() =>
    document.body.classList.contains('sb-show-errordisplay'),
  );
  if (isErrorState) {
    throw new Error(
      `Story ${STORY_ID} renders Storybook's error display — refusing to audit a broken story. Fix the story (see tests/visual/README.md).`,
    );
  }
}

/** Open the composed story at a viewport, settled + theme-asserted + fonts pinned. */
async function openInvest(
  page: Page,
  width: number,
  theme: 'light' | 'dark',
): Promise<void> {
  await page.setViewportSize({ width, height: 800 });
  await page.goto(buildStoryUrl(STORY_ID, theme));
  await waitForStorySettled(page);
  await assertNoErrorState(page);
  // Capture-side theme assertion (visual.spec.ts's dark-URL lesson).
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  }
  // Fonts settled BEFORE any contrast-sensitive assertion.
  await pinDeterministicFonts(page);
}

for (const bp of BREAKPOINTS) {
  test.describe(`invest landing [${bp.name}]`, () => {
    test.use({ viewport: { width: bp.width, height: 800 } });

    for (const theme of THEMES) {
      test(`axe: composed invest landing [${bp.name}] [${theme}]`, async ({ page }) => {
        await openInvest(page, bp.width, theme);
        const results = await analyzeAxe(page, AXE_WCAG_TAGS);
        const violations = results.violations.map(
          (violation) =>
            `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
        );
        expect(
          violations,
          `axe violations for the composed invest landing at ${bp.width}px [${theme}] (rule ids + node selectors)`,
        ).toEqual([]);
      });
    }
  });
}

// --- The install cluster's interactive + structural legs (light, desktop) ------

test.describe('invest landing [1280] cluster', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('qr tabs: ArrowRight swaps the panel — QR + note follow the tab data (7.3 contract)', async ({
    page,
  }) => {
    await openInvest(page, 1280, 'light');

    const block = page.locator('main tk-qr-block');
    const firstTab = block.locator('tk-tabs [role="tab"]').first();
    const secondTab = block.locator('tk-tabs [role="tab"]').nth(1);
    // Both tabs' panels live in the DOM (tk-tabs toggles the wrapper's
    // `hidden`), so every panel-content assert is scoped to the VISIBLE one
    // (the hidden panel's content is display:none — :visible filters it
    // without crossing the qr-block/tk-tabs shadow-slot boundary).
    const visibleQr = block.locator('.panel__qr:visible');
    const visibleNote = block.locator('.panel__note:visible');

    // Seed 1 QR visible with the camera note (tab data carries it).
    await expect(visibleQr).toHaveCount(1);
    const beforeSrc = await visibleQr.getAttribute('src');
    await expect(visibleNote).toHaveText(
      'Наведите камеру телефона на QR-код, чтобы скачать приложение',
    );

    // The tablist contract: automatic activation — arrows move selection.
    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(secondTab).toBeFocused();

    // The panel follows: the QR swaps to tab 2's encoding, the note is gone.
    const afterSrc = await visibleQr.getAttribute('src');
    expect(afterSrc, 'the visible QR swaps with the platform tab').not.toEqual(beforeSrc);
    await expect(visibleQr).toHaveAttribute('alt', 'QR-код для Android ниже 9.0');
    await expect(visibleNote).toHaveCount(0);
  });

  test('badges: three external pills in the capture order, noopener noreferrer', async ({
    page,
  }) => {
    await openInvest(page, 1280, 'light');

    const pills = page.locator('main tk-store-badges a');
    await expect(pills).toHaveCount(3);
    await expect(pills.nth(0)).toHaveText(/AppGallery/);
    await expect(pills.nth(1)).toHaveText(/RuStore/);
    await expect(pills.nth(2)).toHaveText(/Samsung Store/);
    for (let index = 0; index < 3; index += 1) {
      await expect(pills.nth(index)).toHaveAttribute('target', '_blank');
      const rel = await pills.nth(index).getAttribute('rel');
      expect(rel, `pill ${index} opens externally isolated`).toContain('noopener');
      expect(rel, `pill ${index} carries noreferrer`).toContain('noreferrer');
      const href = await pills.nth(index).getAttribute('href');
      expect(href, `pill ${index} leaves the page origin`).toMatch(/^https:\/\//);
    }
  });

  test('interactive baseline: the qr-block region with the second platform tab active [both themes]', async ({
    page,
  }) => {
    for (const theme of THEMES) {
      await openInvest(page, 1280, theme);
      const block = page.locator('main tk-qr-block');
      await block.locator('tk-tabs [role="tab"]').nth(1).click();

      const clip = await block.evaluate((node: Element) => {
        const rect = node.getBoundingClientRect();
        return {
          x: Math.floor(rect.left),
          y: Math.floor(rect.top),
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
        };
      });
      // Page-level clip (the region rides the page, not a top layer here —
      // the clip keeps the baseline scoped to the block's swapped state).
      await expect(page).toHaveScreenshot({ clip });
    }
  });
});

// --- The narrow-viewport leg: the hero stacks, the art scales, the cluster
//     reflows (the spec's matrix row, probed live at 360) ----------------------

test.describe('invest landing [360] narrow', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('hero stacks: the CTA pair becomes a full-width column, the art scales down', async ({
    page,
  }) => {
    await openInvest(page, 360, 'light');

    const geo = await page.evaluate(() => {
      const actions = document.querySelector<HTMLElement>('.tki-hero__actions');
      const buttonHost = document.querySelector<HTMLElement>('.tki-hero__actions tk-button');
      const pill = buttonHost?.shadowRoot?.querySelector<HTMLElement>('.button');
      const art = document.querySelector<HTMLElement>('.tki-hero__art svg');
      if (!actions || !buttonHost || !pill || !art) return null;
      const actionsRect = actions.getBoundingClientRect();
      return {
        flexDirection: getComputedStyle(actions).flexDirection,
        hostW: buttonHost.getBoundingClientRect().width,
        pillW: pill.getBoundingClientRect().width,
        actionsW: actionsRect.width,
        artW: art.getBoundingClientRect().width,
        viewportW: window.innerWidth,
      };
    });
    expect(geo, 'hero geometry resolves at 360').not.toBeNull();
    expect(geo?.flexDirection, 'the CTA pair stacks below 768').toBe('column');
    // The probed consumer recipe: the PILL (not just the host) fills the row.
    expect(geo?.pillW).toBeCloseTo(geo?.actionsW ?? 0, 0);
    expect(geo?.hostW).toBeCloseTo(geo?.actionsW ?? 0, 0);
    // The art scales with the viewport — never wider than 64% of it.
    expect(geo ? geo.artW <= 0.64 * geo.viewportW + 1 : false, 'the phone art scales down').toBe(
      true,
    );
  });

  test('cluster reflows: stepper collapses to one column, badge pills wrap one per row', async ({
    page,
  }) => {
    await openInvest(page, 360, 'light');

    // Piercing locators (the grids/pills live in the blocks' shadow roots).
    const steps = page.locator('main tk-stepper .stepper__steps');
    await expect(steps).toBeAttached();
    const trackCount = await steps.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length,
    );
    expect(trackCount, 'the stepper cards collapse to one column').toBe(1);

    const pillTops = await page
      .locator('main tk-store-badges a')
      .evaluateAll((pills) =>
        pills.map((pill) => Math.round(pill.getBoundingClientRect().top)),
      );
    expect(pillTops.length, 'the badge trio renders').toBe(3);
    expect(
      new Set(pillTops).size,
      'the badge pills wrap one per row',
    ).toBe(pillTops.length);
  });
});
