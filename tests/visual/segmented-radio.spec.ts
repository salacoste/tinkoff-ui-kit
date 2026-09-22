import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-segmented-radio FORM PARTICIPATION coverage (Story 2.5) — the live half
 * of the env split documented in segmented-radio.test.ts § Matrix row 6:
 * happy-dom ships no ElementInternals, so the row «inside a form: FormData
 * carries name=value» can only be proven in a real engine. MECHANISM (the
 * 2.4 amendment): the shadow radios never submit (the form-owner walk stops
 * at the shadow root); the FormData entry comes from the host's
 * formAssociated + ElementInternals mirror (setFormValue in
 * segmented-radio.ts) — the selected option's value, nothing when
 * unselected. Asserted through the REAL user pipeline (label click → native
 * change → Lit pipeline → setFormValue), never through synthetic shortcuts.
 *
 * Also pins the ≥44×44 hit-area floor: each segment's invisible radio covers
 * the full half-track × 48px surface (the 56px track minus the 4px inset).
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

test('segmented radio submits natively inside a form: name=selected value, nothing when unselected', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-segmentedradio--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-segmented-radio').first();
  await expect(el).toBeAttached();

  const result = await el.evaluate(async (node) => {
    const group = node as HTMLElement & { updateComplete: Promise<unknown> };
    // Compose the form AROUND the host exactly as a consumer would.
    const form = document.createElement('form');
    node.parentElement?.insertBefore(form, node);
    form.append(node);
    group.setAttribute('name', 'citizenship');
    await group.updateComplete;

    const segments = Array.from(
      group.shadowRoot?.querySelectorAll('label.segment') ?? [],
    ) as HTMLElement[];
    const readForm = () => Object.fromEntries(new FormData(form).entries());
    const outcomes: Record<string, unknown> = {};

    // The playground ships default-value="yes" → the selected option submits.
    outcomes.afterDefault = readForm();

    // REAL native path: clicking a segment label checks the shadow radio and
    // fires the browser's own change event through the element pipeline.
    segments[1]?.click();
    await group.updateComplete;
    outcomes.afterClick = readForm();

    segments[0]?.click();
    await group.updateComplete;
    outcomes.afterClickBack = readForm();

    // A nameless group contributes nothing.
    group.removeAttribute('name');
    await group.updateComplete;
    outcomes.nameless = readForm();

    // Element API state sanity alongside the native channel.
    outcomes.checkedValues = Array.from(
      group.shadowRoot?.querySelectorAll('input[type="radio"]') ?? [],
    ).map((input) => (input as HTMLInputElement).checked);
    return outcomes;
  });

  expect(result.afterDefault).toEqual({ citizenship: 'yes' });
  expect(result.afterClick).toEqual({ citizenship: 'no' });
  expect(result.afterClickBack).toEqual({ citizenship: 'yes' });
  expect(result.nameless).toEqual({});
  // Exactly one checked radio throughout — the invariant, live.
  expect((result.checkedValues as boolean[]).filter(Boolean)).toHaveLength(1);
});

test('segment hit areas: every radio covers ≥44×44 (the invisible input spans the segment)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-segmentedradio--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-segmented-radio').first();
  await expect(el).toBeAttached();

  const geometry = await el.evaluate((node) => {
    const group = node as HTMLElement;
    return Array.from(
      group.shadowRoot?.querySelectorAll('input[type="radio"]') ?? [],
    ).map((input) => {
      const rect = (input as HTMLElement).getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
  });

  // The Да/Нет pair: two segments, both at or above the target floor.
  expect(geometry).toHaveLength(2);
  for (const segment of geometry) {
    expect(segment.width).toBeGreaterThanOrEqual(44);
    expect(segment.height).toBeGreaterThanOrEqual(44);
  }
});

test('disabled group: ArrowRight is OWNED (UA radio-arrow roving never runs) and focus stays put', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-segmentedradio--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-segmented-radio').first();
  await expect(el).toBeAttached();

  await el.evaluate(async (node) => {
    const group = node as HTMLElement & {
      disabled?: boolean;
      updateComplete: Promise<unknown>;
    };
    group.disabled = true; // aria-disabled keeps the radios focusable (pilot pattern)
    await group.updateComplete;
    group.shadowRoot?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  });

  // REAL keyboard path: the browser dispatches the keydown to the focused
  // radio. Before the review fix, the element's disabled early-return left
  // the key unprevented and Chromium's native radio-arrow move ROVED focus
  // inside the disabled group (verified live). Now the element owns the key.
  await page.keyboard.press('ArrowRight');

  const state = await el.evaluate((node) => {
    const group = node as HTMLElement;
    const radios = Array.from(
      group.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [],
    );
    const active = group.shadowRoot?.activeElement as HTMLInputElement | null;
    return {
      active: active?.value ?? null,
      checked: radios.find((radio) => radio.checked)?.value ?? null,
    };
  });
  expect(state.active).toBe('yes'); // focus stays put
  expect(state.checked).toBe('yes'); // selection untouched
});

test('group label is a SPAN: option names stay exactly «Да»/«Нет» (accessible-name safety)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-segmentedradio--playground', 'light'));
  await waitForStorySettled(page);
  // getByRole matches on the COMPUTED accessible name. The label[for] route
  // was tried and REJECTED at review: Chromium concatenates the group text
  // onto the tab-stop option's name («Гражданство РФ? Да» while «Нет» stays
  // bare — probed live). The span + aria-labelledby naming must keep every
  // option findable by its own text, exactly.
  await expect(page.getByRole('radio', { name: 'Да', exact: true })).toHaveCount(1);
  await expect(page.getByRole('radio', { name: 'Нет', exact: true })).toHaveCount(1);
  // The group itself stays named by the visible label.
  await expect(page.getByRole('radiogroup', { name: 'Гражданство РФ?' })).toHaveCount(1);
});
