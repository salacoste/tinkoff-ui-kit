import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-checkbox FORM PARTICIPATION coverage (Story 2.4) — the live half of the
 * env split documented in checkbox.test.ts § Matrix row 6: happy-dom's
 * FormData(form)/form.elements do not enumerate shadow-root controls (probed
 * 2026-09-22: form.elements === 0) and happy-dom ships no ElementInternals,
 * so the I/O matrix row «inside a form: FormData carries name=value when
 * checked» can only be proven in a real engine. MECHANISM (probed live on
 * the built story): Chromium does NOT give the shadow input an outer form
 * owner — the form-owner walk stops at the shadow root and the native input
 * never submits. The FormData entry comes from the host's formAssociated +
 * ElementInternals mirror (setFormValue in checkbox.ts). Asserted through
 * the real user pipeline (label click → native change → Lit pipeline →
 * setFormValue), never through synthetic shortcuts.
 *
 * Also pins the ≥44×44 hit-area floor in BOTH dimensions (review fix): a
 * LABEL-LESS checkbox must still present a ≥44px-wide interactive surface —
 * the .root padding carries the width, the .control box alone is 20px.
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

test('checkbox submits natively inside a form: name=value when checked, nothing when unchecked, "on" default', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-checkbox--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-checkbox').first();
  await expect(el).toBeAttached();

  const result = await el.evaluate(async (node) => {
    const checkbox = node as HTMLElement & { updateComplete: Promise<unknown> };
    // Compose the form AROUND the host exactly as a consumer would.
    const form = document.createElement('form');
    node.parentElement?.insertBefore(form, node);
    form.append(node);
    checkbox.setAttribute('name', 'consent');
    checkbox.setAttribute('value', 'granted');
    await checkbox.updateComplete;

    const label = checkbox.shadowRoot?.querySelector('label');
    const readForm = () => Object.fromEntries(new FormData(form).entries());
    const outcomes: Record<string, unknown> = {};

    // Unchecked → nothing submitted.
    outcomes.unchecked = readForm();

    // REAL native path: clicking the wrapping label toggles the shadow input
    // and fires the browser's own change event through the element pipeline.
    label?.click();
    await checkbox.updateComplete;
    outcomes.afterFirstClick = readForm();

    label?.click();
    await checkbox.updateComplete;
    outcomes.afterSecondClick = readForm();

    // Value unset → the native default "on" is submitted; a nameless checkbox
    // contributes nothing.
    checkbox.removeAttribute('value');
    await checkbox.updateComplete;
    label?.click();
    await checkbox.updateComplete;
    outcomes.defaultValue = readForm();

    checkbox.removeAttribute('name');
    await checkbox.updateComplete;
    label?.click();
    await checkbox.updateComplete;
    label?.click();
    await checkbox.updateComplete;
    outcomes.nameless = readForm();

    // Element API state sanity alongside the native channel.
    outcomes.controlChecked = checkbox.shadowRoot?.querySelector('input')?.checked;
    return outcomes;
  });

  expect(result.unchecked).toEqual({});
  expect(result.afterFirstClick).toEqual({ consent: 'granted' });
  expect(result.afterSecondClick).toEqual({});
  expect(result.defaultValue).toEqual({ consent: 'on' });
  expect(result.nameless).toEqual({});
  // Five toggles from false land on checked — the native control and the
  // submission state agree throughout.
  expect(result.controlChecked).toBe(true);
});

test('bare-box hit area: label-less checkbox interactive surface ≥44×44', async ({ page }) => {
  await page.goto(buildStoryUrl('components-checkbox--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-checkbox').first();
  await expect(el).toBeAttached();

  const geometry = await el.evaluate(async (node) => {
    const checkbox = node as HTMLElement & {
      label?: string;
      updateComplete: Promise<unknown>;
    };
    // The bare-box configuration: no label prop, no slotted content — the
    // interactive surface is the label root alone (the visual box is 20px).
    checkbox.label = '';
    checkbox.replaceChildren();
    await checkbox.updateComplete;
    const label = checkbox.shadowRoot?.querySelector('label');
    const root = checkbox.getBoundingClientRect();
    const box = label?.getBoundingClientRect();
    return {
      hostWidth: root.width,
      hostHeight: root.height,
      labelWidth: box?.width ?? 0,
      labelHeight: box?.height ?? 0,
    };
  });

  // The interactive label surface carries BOTH floor dimensions; the visual
  // box stays 20px inside it.
  expect(geometry.labelWidth).toBeGreaterThanOrEqual(44);
  expect(geometry.labelHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.hostWidth).toBeGreaterThanOrEqual(44);
  expect(geometry.hostHeight).toBeGreaterThanOrEqual(44);
});
