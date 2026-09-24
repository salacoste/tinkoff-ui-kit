import { expect, test, type Page } from 'playwright/test';

import { analyzeAxe } from './axe-serialize';
import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * Homepage composition verification matrix (spec 3.11) — closes the gap the
 * generated suite cannot: visual.spec.ts runs its per-theme axe at the FIXED
 * desktop viewport (playwright.config.ts `use.viewport`), so a composed page
 * has never been audited AT the UX-DR14 breakpoints. This spec pins, against
 * the BUILT story `showcase-homepage--homepage`:
 *
 * - VIEWPORT-SCOPED AXE: 3 breakpoints (1280 / 900 / 360) × 2 themes, zero
 *   WCAG violations each — the harness's own per-theme runs stay
 *   desktop-viewport (their baselines pin that env; this spec adds the
 *   missing viewport legs without touching it).
 * - BREAKPOINT BEHAVIOR: grid track count per breakpoint (3/2/1), the
 *   burger flip at <768 (links nav hidden, burger visible), and the
 *   full-width CTA recipe at 360 (the shadow pill stretches to the copy
 *   container's width — the column-flex consumer recipe, probed live).
 * - BURGER FUNCTIONAL AT 360: opens (dialog visible, aria-expanded, focus
 *   placed on the first drawer link), Tab CYCLES inside the drawer (the
 *   controller's trap), Esc closes and restores focus to the burger. The
 *   navbar's own unit suite proves the mechanics at the COMPONENT level —
 *   this is the composition-level proof the spec demands.
 * - SINGLE PRIMARY PER CLUSTER: exactly one `variant="primary"` tk-button in
 *   each `data-cluster` (hero / signup), zero primaries among the promo
 *   cards' secondary CTAs, and no primary outside a tagged cluster — at all
 *   three breakpoints.
 *
 * Same webServer/stale-dist rule as the rest of tests/visual (build docs
 * first — pnpm test:visual does).
 */

/** The composed homepage story (packages/components/src/showcase/homepage.stories.ts). */
const STORY_ID = 'showcase-homepage--homepage';

/** WCAG rule tags — identical filter to the generated suite. */
const AXE_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/** The UX-DR14 breakpoints: ≥1024 full / 768–1023 one-step collapse / <768 single column. */
const BREAKPOINTS = [
  { name: '1280', width: 1280, gridTracks: 3, burger: false },
  { name: '900', width: 900, gridTracks: 2, burger: false },
  { name: '360', width: 360, gridTracks: 1, burger: true },
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

/**
 * Baseline gate (visual.spec.ts's assertNoErrorState, same semantics): the
 * settle wait's error-display branch must FAIL the leg, never satisfy it —
 * without this a misrendered composition audits green against the error page.
 * Runs in openHomepage so the axe legs, the layout legs, AND the mobile-only
 * legs are all gated.
 */
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

/** Open the composed story at a viewport, settled + fonts pinned (axe/capture determinism). */
async function openHomepage(page: Page, width: number, theme: 'light' | 'dark'): Promise<void> {
  await page.setViewportSize({ width, height: 800 });
  await page.goto(buildStoryUrl(STORY_ID, theme));
  await waitForStorySettled(page);
  await assertNoErrorState(page);
  // Capture-side theme assertion (visual.spec.ts's dark-URL lesson): the
  // globals param must actually have flipped the preview root, or a dark leg
  // would silently audit a light render.
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  }
  // Fonts settled BEFORE any contrast-sensitive assertion (the visual suite's
  // phantom-violation lesson: color-contrast measured mid font-swap lies).
  await pinDeterministicFonts(page);
}

/**
 * The page's DEEPEST active element (through open shadow roots) as a plain
 * tag.class string — focus assertions that must see inside tk-navbar's
 * shadow tree (the burger, the drawer links).
 */
function deepActiveElement(page: Page): Promise<string> {
  return page.evaluate(() => {
    let node: Element | null = document.activeElement;
    while (node && node.shadowRoot && node.shadowRoot.activeElement) {
      node = node.shadowRoot.activeElement;
    }
    if (!node) return '';
    const cls = node.getAttribute('class') ?? '';
    return `${node.tagName.toLowerCase()}${cls ? `.${cls.split(/\s+/).join('.')}` : ''}`;
  });
}

for (const bp of BREAKPOINTS) {
  test.describe(`homepage [${bp.name}]`, () => {
    test.use({ viewport: { width: bp.width, height: 800 } });

    // --- Viewport-scoped axe: the UX-DR14 legs the desktop-pinned suite lacks.
    for (const theme of THEMES) {
      test(`axe: composed homepage [${bp.name}] [${theme}]`, async ({ page }) => {
        await openHomepage(page, bp.width, theme);
        const results = await analyzeAxe(page, AXE_WCAG_TAGS);
        const violations = results.violations.map(
          (violation) =>
            `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
        );
        expect(
          violations,
          `axe violations for the composed homepage at ${bp.width}px [${theme}] (rule ids + node selectors)`,
        ).toEqual([]);
      });
    }

    // --- Breakpoint behavior: tracks, burger flip, full-width CTA.
    test(`breakpoint layout: ${bp.gridTracks} grid track(s), burger ${bp.burger ? 'on' : 'off'}`, async ({
      page,
    }) => {
      await openHomepage(page, bp.width, 'light');

      const tracks = await page
        .locator('.tkh-grid')
        .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length);
      expect(tracks, `the PromoCard grid collapses to ${bp.gridTracks} track(s) at ${bp.width}px`).toBe(
        bp.gridTracks,
      );

      const burger = page.locator('tk-navbar .burger');
      const linksNav = page.locator('tk-navbar .links');
      if (bp.burger) {
        await expect(burger, 'the burger replaces the links nav below 768px').toBeVisible();
        await expect(linksNav).toBeHidden();
      } else {
        await expect(linksNav, 'the full links nav stays until 768px').toBeVisible();
        await expect(burger).toBeHidden();
      }
    });

    // --- Single primary per view cluster (the composition discipline row).
    test('button discipline: one primary per cluster, secondaries on cards', async ({ page }) => {
      await openHomepage(page, bp.width, 'light');

      await expect(
        page.locator('[data-cluster="hero"] tk-button[variant="primary"]'),
        'the hero cluster carries exactly one primary (the hero CTA)',
      ).toHaveCount(1);
      await expect(
        page.locator('[data-cluster="signup"] tk-button[variant="primary"]'),
        'the signup cluster carries exactly one primary (the strip submit)',
      ).toHaveCount(1);
      await expect(
        page.locator('.tkh-grid tk-button[variant="primary"]'),
        'promo cards never carry a primary — their CTAs are secondary pills',
      ).toHaveCount(0);
      await expect(
        page.locator('.tkh-grid tk-button[variant="secondary"]'),
        'the 3-up grid carries three secondary card CTAs',
      ).toHaveCount(3);
      expect(
        await page.locator('tk-button[variant="primary"]').count(),
        'no primary button lives outside the two tagged clusters',
      ).toBe(2);
    });
  });
}

// --- <768 only: the full-width CTA recipe + the functional burger drawer -------

test.describe('homepage [360] mobile-only', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('full-width CTA: the shadow pill stretches to the copy container', async ({ page }) => {
    await openHomepage(page, 360, 'light');
    const geo = await page.evaluate(() => {
      const host = document.querySelector<HTMLElement>('.tkh-hero__cta');
      const pill = host?.shadowRoot?.querySelector<HTMLElement>('.button');
      const copy = document.querySelector<HTMLElement>('.tkh-hero__copy');
      if (!host || !pill || !copy) return null;
      // The copy container's CONTENT box: width:100% on the CTA resolves
      // against it (the bounding rect would include the 24px inline padding).
      const style = getComputedStyle(copy);
      const copyContentW =
        copy.getBoundingClientRect().width -
        Number.parseFloat(style.paddingLeft) -
        Number.parseFloat(style.paddingRight);
      return {
        hostW: host.getBoundingClientRect().width,
        pillW: pill.getBoundingClientRect().width,
        copyW: copyContentW,
      };
    });
    expect(geo, 'hero CTA geometry resolves').not.toBeNull();
    // Column-flex recipe proof: the PILL (not just the host box) fills the
    // copy container — width:100% alone leaves the pill content-sized.
    expect(geo?.hostW).toBeCloseTo(geo?.copyW ?? 0, 0);
    expect(geo?.pillW).toBeCloseTo(geo?.copyW ?? 0, 0);

    const stripGeo = await page.evaluate(() => {
      const host = document.querySelector<HTMLElement>('.tkh-strip__submit');
      const pill = host?.shadowRoot?.querySelector<HTMLElement>('.button');
      const row = document.querySelector<HTMLElement>('.tkh-strip__row');
      if (!host || !pill || !row) return null;
      return {
        pillW: pill.getBoundingClientRect().width,
        rowW: row.getBoundingClientRect().width,
      };
    });
    expect(stripGeo, 'strip submit geometry resolves').not.toBeNull();
    expect(stripGeo?.pillW).toBeCloseTo(stripGeo?.rowW ?? 0, 0);
  });

  test('burger drawer: opens, traps (Tab cycles), Esc closes and restores focus', async ({ page }) => {
    await openHomepage(page, 360, 'light');

    const burger = page.locator('tk-navbar .burger');
    await expect(burger).toBeVisible();
    const drawer = page.locator('tk-navbar .drawer');

    // Open: the toggle mounts the panel through the overlay controller
    // (popover path keeps it in place, so the shadow locator stays valid).
    await burger.click();
    await expect(drawer).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toHaveAttribute('role', 'dialog');

    // Initial focus placement: the trap lands on the first drawer link.
    // Polled — the panel flips visible on the template binding, while the
    // trap's focus placement rides the async post-update mount sequence.
    await expect.poll(() => deepActiveElement(page)).toBe('a.drawer__link');

    // The trap's cycle: Tab walks the drawer links and WRAPS — focus never
    // leaves the drawer's composed subtree (4 links → 6 presses wraps twice).
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      expect(
        await deepActiveElement(page),
        `focus stays inside the drawer after Tab press ${i + 1}`,
      ).toBe('a.drawer__link');
    }

    // Esc closes; the explicit burger re-focus wins over the trap's restore.
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    expect(await deepActiveElement(page)).toBe('button.burger');
  });
});
