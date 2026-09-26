import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * Showcase «Лендинг для бизнеса» (spec 7.4) — the composed business landing's
 * OWN coverage, the stocks-catalog spec mold. The auto-generated story
 * baselines in visual.spec.ts record the RESTING page (plus axe, both
 * themes); here the matrix rows a browser can drive live are exercised:
 *
 * - FORM WIRING — invalid submit drives tk-input's consumer `error` prop
 *   («invalid → inline errors»), any edit clears it (the mold's rule), the
 *   mode toggle relabels the derived submit («Открыть счет»/«Открыть
 *   бизнес»), and a valid submit runs the loading window then fires the
 *   §9-sanctioned imperative toast (message derived from the mode).
 * - BENTO GEOMETRY — the 2+3 asymmetric grid tracks (two equal wide seats;
 *   three seats with the CENTER WIDER — the probe's ~303/385/294 reading),
 *   the floating CTA OVERLAPPING the art's bottom edge, and the ≥44px hit
 *   floor (the `card` size's 48px box).
 * - TOP-LAYER TOAST — the confirmation toast is body-promoted (outside the
 *   story host), so the story baselines cannot record it; this capture uses
 *   the TOAST'S OWN ELEMENT screenshot (a page-level clip breaks at this
 *   scroll depth — the numbers in the rationale below) — the same top-layer
 *   ruling as stocks-catalog's open-panel capture.
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does).
 */
const STORY_ID = 'showcase-business-landing--business-landing';

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

test('composed wiring: invalid submit → inline error → edit clears → mode relabels submit → valid submit → toast [light]', async ({
  page,
}) => {
  await page.goto(buildStoryUrl(STORY_ID, 'light'));
  await waitForStorySettled(page);

  const control = page.locator('.tkb-form__field .field__control');
  const error = page.locator('.tkb-form__field .error');
  const submit = page.locator('.tkb-form__submit');

  // Resting state: default mode, no error.
  await expect(submit).toContainText('Открыть счет');
  await expect(error).toHaveCount(0);

  // INVALID SUBMIT: the empty phone drives the consumer error prop — the
  // component's own aria-describedby wiring, focus untouched.
  await submit.click();
  await expect(error).toHaveText('Введите номер телефона');

  // Any edit clears the error (the mold's own rule).
  await control.click();
  await control.pressSequentially('89990001122');
  await expect(error).toHaveCount(0);

  // MODE TOGGLE: the segmented pair relabels the derived submit + toast copy.
  await page.locator('tk-segmented-radio .segment', { hasText: 'Открыть бизнес' }).click();
  await expect(submit).toContainText('Открыть бизнес');

  // VALID SUBMIT: loading window → reset + the imperative toast (body stack).
  await submit.click();
  const toast = page.locator('tk-toast');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Заявка отправлена: Открыть бизнес');
  // The reset path: the error channel stays clear after the round-trip.
  await expect(error).toHaveCount(0);
});

test('bento composition geometry: 2+3 asymmetric tracks, bleed art zone full-width + flush bottom, pill overlays art at the probe 32px, ≥44px hit [light]', async ({
  page,
}) => {
  await page.goto(buildStoryUrl(STORY_ID, 'light'));
  await waitForStorySettled(page);

  // 10.3 adoption: the bento composes from tk-promo-card's own bleed mode —
  // the art lives in the ART slot (the .tkb-stage workaround is dead). The
  // geometry is measured on the CARD host, its shadow bleed zone, and the
  // slotted CTA (light DOM) — the open shadow root reaches the zone.
  const geo = await page.evaluate(() => {
    const wide = getComputedStyle(document.querySelector('.tkb-bento__row--wide')!);
    const trio = getComputedStyle(document.querySelector('.tkb-bento__row--trio')!);
    const tracks = (value: string): number[] => value.split(' ').map((t) => Number.parseFloat(t));
    const card = document.querySelector<HTMLElement>('.tkb-bento__card')!;
    const cardRect = card.getBoundingClientRect();
    const zone = card.shadowRoot?.querySelector<HTMLElement>('.card__art')?.getBoundingClientRect();
    const cta = card.querySelector<HTMLElement>('tk-button[slot="actions"]')?.getBoundingClientRect();
    return {
      wide: tracks(wide.gridTemplateColumns),
      trio: tracks(trio.gridTemplateColumns),
      cardBottom: cardRect.bottom,
      cardWidth: cardRect.width,
      zoneBottom: zone?.bottom ?? 0,
      zoneWidth: zone?.width ?? 0,
      ctaTop: cta?.top ?? 0,
      ctaBottom: cta?.bottom ?? 0,
      ctaHeight: cta?.height ?? 0,
    };
  });

  // Row 1: TWO equal wide seats.
  expect(geo.wide, 'row 1 = two tracks').toHaveLength(2);
  expect(geo.wide[0]).toBeCloseTo(geo.wide[1], 0);

  // Row 2: THREE seats, the CENTER WIDER than both wings (the probe reading).
  expect(geo.trio, 'row 2 = three tracks').toHaveLength(3);
  expect(geo.trio[1]).toBeGreaterThan(geo.trio[0]);
  expect(geo.trio[1]).toBeGreaterThan(geo.trio[2]);

  // The bleed zone: escapes the padding — full card width, flush to the
  // card's bottom edge (the reference's full-bleed bottom art).
  expect(geo.zoneWidth, 'art zone spans the card width').toBeCloseTo(geo.cardWidth, 0);
  expect(geo.zoneBottom, 'art zone flush to the card bottom').toBeCloseTo(geo.cardBottom, 0);

  // The floating pill: overlays the art (top above the zone's bottom edge),
  // pinned at the PIXEL-PROBE offset (pill bottom = card bottom − 32 =
  // space-32, Δ=0 — verify/promo-card-10-3/NOTES.md probe A/B), and the
  // card-size 48px box clears the 44px hit floor.
  expect(geo.ctaTop, 'CTA overlaps the bleed art zone').toBeLessThan(geo.zoneBottom);
  expect(geo.cardBottom - geo.ctaBottom, 'pill bottom offset = space-32 (probe)').toBeCloseTo(32, 0);
  expect(geo.ctaHeight, 'CTA ≥44px hit target').toBeGreaterThanOrEqual(44);
});

for (const theme of THEMES) {
  test(`valid-submit confirmation toast (top-layer clip): visible, mode-derived copy [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl(STORY_ID, theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);

    // Drive a valid submit (default mode «Открыть счет» — deterministic copy).
    await page.locator('.tkb-form__field .field__control').click();
    await page.locator('.tkb-form__field .field__control').pressSequentially('89990001122');
    await page.locator('.tkb-form__submit').click();
    const toast = page.locator('tk-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Заявка отправлена: Открыть счет');

    // The toast is body-promoted (fixed stack, outside the story host) — an
    // ELEMENT screenshot records its pixels without clip math: the page-clip
    // route (stocks-catalog's ruling) is viewport-based while clips are page
    // coordinates, so it breaks whenever the trigger scroll ≠ 0 (measured
    // live: submit scrolls y≈2268 into a 4316px doc; the page-coord clip
    // lands outside the 800px capture). The fixed toast is in-viewport by
    // construction — the element shot is deterministic either way.
    await expect(toast).toHaveScreenshot();
  });
}
