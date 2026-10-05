import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-switch FORM PARTICIPATION + interaction coverage (spec 26.2) — the
 * live half of the env split documented in switch.test.ts: happy-dom ships
 * no ElementInternals and its FormData(form) does not enumerate
 * shadow-root controls (the tk-checkbox matrix mold, probed 2026-09-22),
 * so the «inside a form: FormData carries name=value when checked» row is
 * proven here in a real engine. The entry comes from the host's
 * formAssociated + ElementInternals mirror (setFormValue in switch.ts) —
 * Chromium's form-owner walk stops at the shadow root, the native input
 * never submits by itself. Asserted through the real user pipeline
 * (label click → native change → Lit pipeline → setFormValue), never
 * through synthetic shortcuts.
 *
 * Also pins the Enter keydown guard (AC3): the REAL keyboard path —
 * pressing Enter on the focused input must toggle through the same change
 * pipeline as Space — and the ≥44×44 hit-area floor in BOTH dimensions
 * (a LABEL-LESS switch must still present a ≥44px-wide interactive
 * surface; the .root padding carries the width, the capsule alone is
 * 36px).
 *
 * Functional only (no baseline): theme-independent behavior, so it runs once
 * on the light theme. Same pinned webServer as the visual suite — build docs
 * first (pnpm test:visual does).
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

test('switch submits natively inside a form: name=value when checked, nothing when unchecked, "on" default', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-switch--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-switch').first();
  await expect(el).toBeAttached();

  const result = await el.evaluate(async (node) => {
    const sw = node as HTMLElement & { updateComplete: Promise<unknown> };
    // Compose the form AROUND the host exactly as a consumer would.
    const form = document.createElement('form');
    node.parentElement?.insertBefore(form, node);
    form.append(node);
    sw.setAttribute('name', 'channel');
    sw.setAttribute('value', 'push');
    await sw.updateComplete;

    const label = sw.shadowRoot?.querySelector('label');
    const readForm = () => Object.fromEntries(new FormData(form).entries());
    const outcomes: Record<string, unknown> = {};

    // Checked from the story default (default-checked=true) → submitted.
    outcomes.checked = readForm();

    // REAL native path: clicking the wrapping label toggles the shadow input
    // and fires the browser's own change event through the element pipeline.
    label?.click();
    await sw.updateComplete;
    outcomes.afterFirstClick = readForm();

    label?.click();
    await sw.updateComplete;
    outcomes.afterSecondClick = readForm();

    // State is checked again. Value unset → the native default "on" is
    // submitted; a nameless switch contributes nothing. No toggling needed —
    // both rows read the CURRENT checked state.
    sw.removeAttribute('value');
    await sw.updateComplete;
    outcomes.defaultValue = readForm();

    sw.removeAttribute('name');
    await sw.updateComplete;
    outcomes.nameless = readForm();

    // Element API state sanity alongside the native channel.
    outcomes.controlChecked = sw.shadowRoot?.querySelector('input')?.checked;
    return outcomes;
  });

  expect(result.checked).toEqual({ channel: 'push' });
  expect(result.afterFirstClick).toEqual({});
  expect(result.afterSecondClick).toEqual({ channel: 'push' });
  expect(result.defaultValue).toEqual({ channel: 'on' });
  expect(result.nameless).toEqual({});
  // The toggles and the submission state agree throughout.
  expect(result.controlChecked).toBe(true);
});

test('Enter on the focused switch toggles through the real change pipeline (the native gap, AC3)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-switch--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-switch').first();
  await expect(el).toBeAttached();

  await el.locator('input.control__input').focus();
  // The story default seeds default-checked — read the LIVE starting state
  // instead of assuming it, then prove Enter flips it twice (there and back).
  const start = await el.evaluate((n) => n.shadowRoot?.querySelector('input')?.checked ?? null);
  expect(start).not.toBeNull();
  await page.keyboard.press('Enter');
  await expect
    .poll(() => el.evaluate((n) => n.shadowRoot?.querySelector('input')?.checked ?? null))
    .toBe(!start);
  await page.keyboard.press('Enter');
  await expect
    .poll(() => el.evaluate((n) => n.shadowRoot?.querySelector('input')?.checked ?? null))
    .toBe(start);
});

test('bare-switch hit area: label-less switch interactive surface ≥44×44', async ({ page }) => {
  await page.goto(buildStoryUrl('components-switch--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-switch').first();
  await expect(el).toBeAttached();

  const geometry = await el.evaluate(async (node) => {
    const sw = node as HTMLElement & {
      label?: string;
      updateComplete: Promise<unknown>;
    };
    // The bare-switch configuration: no label prop, no slotted content — the
    // interactive surface is the label root alone (the visual capsule is
    // 36×20).
    sw.label = '';
    sw.replaceChildren();
    await sw.updateComplete;
    const label = sw.shadowRoot?.querySelector('label');
    const host = sw.getBoundingClientRect();
    const root = label?.getBoundingClientRect();
    return {
      hostWidth: host.width,
      hostHeight: host.height,
      labelWidth: root?.width ?? 0,
      labelHeight: root?.height ?? 0,
    };
  });

  // The interactive label surface carries BOTH floor dimensions; the visual
  // capsule stays 36×20 inside it.
  expect(geometry.labelWidth).toBeGreaterThanOrEqual(44);
  expect(geometry.labelHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.hostWidth).toBeGreaterThanOrEqual(44);
  expect(geometry.hostHeight).toBeGreaterThanOrEqual(44);
});
