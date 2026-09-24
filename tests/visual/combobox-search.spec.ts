import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-combobox-search OPEN-MENU visual coverage (spec 6.3) — the
 * select/filter-chips spec mold: `locator('body')` element screenshots
 * EXCLUDE popover-promoted content, so the story baselines in visual.spec.ts
 * record the field but NOT the floating suggestion panel (the standalone
 * "Открытое меню" story covers the story-driven open; HERE the capture is
 * PAGE-LEVEL with a clip covering the field + panel region — the page
 * screenshot DOES include top-layer pixels — so the interaction-driven open
 * menu gets automated kit-vs-kit drift protection from day one (the HANDOFF
 * §5 «open-state baselines» lesson).
 *
 * The menu's open state is INTERNAL (no declarative `open` channel — the
 * spec's ruling), so this spec drives the element's public typing path:
 * focus + input event on the shadow control, exactly what a user's
 * keystroke produces. Layout assertions accompany the capture: the panel
 * must be visible, controller-positioned (inline fixed), anchored BELOW the
 * field box, and width-MATCHED to it (positionFloating's matchAnchorWidth:
 * true — the panel never runs narrower than the field). The closed-state
 * test is assertion-only (the computed display:none pin — the 6.2 lesson —
 * plus no inline positioning), so it adds no baseline.
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
  test(`open suggestion panel (top-layer, typing path): visible, field-anchored, width-matched [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-comboboxsearch--playground', theme));
    await waitForStorySettled(page);
    // Fonts settled BEFORE capture (same determinism rule as the suite).
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-combobox-search').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const host = node as HTMLElement & { updateComplete: Promise<unknown> };
      const root = host.shadowRoot;
      const control = root?.querySelector<HTMLInputElement>('.field__control');
      const fieldBox = root?.querySelector('.field')?.getBoundingClientRect();
      if (!control || !fieldBox) return null;
      // Exercise the INTERACTION mount path (typing), not a first-paint
      // attribute — the menu's open state is internal (spec 6.3).
      control.focus();
      control.value = 'н'; // Сбербанк, Норникель, Яндекс, Т-Технологии, Роснефть
      control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await host.updateComplete;
      const panel = root?.getElementById(control.getAttribute('aria-controls') ?? '');
      if (!panel) return null;
      const rect = panel.getBoundingClientRect();
      const clip = {
        x: Math.floor(Math.min(fieldBox.left, rect.left)),
        y: Math.floor(Math.min(fieldBox.top, rect.top)),
        width: Math.ceil(Math.max(fieldBox.right, rect.right) - Math.min(fieldBox.left, rect.left)),
        height: Math.ceil(Math.max(fieldBox.bottom, rect.bottom) - Math.min(fieldBox.top, rect.top)),
      };
      return {
        expanded: control.getAttribute('aria-expanded'),
        rows: panel.querySelectorAll('[role="option"]:not([aria-disabled="true"])').length,
        status: root?.querySelector('.status')?.textContent ?? '',
        inlinePosition: (panel as HTMLElement).style.position,
        inlineWidth: Number.parseFloat((panel as HTMLElement).style.width),
        fieldWidth: fieldBox.width,
        panelTop: rect.top,
        fieldBottom: fieldBox.bottom,
        panelHeight: rect.height,
        clip,
      };
    });
    expect(geo, 'the field + panel geometry resolves').not.toBeNull();
    expect(geo?.expanded, 'the menu is open').toBe('true');
    expect(geo?.rows, 'the filtered rows render').toBe(5);
    expect(geo?.status, 'the match count settled').toBe('Найдено 5 инструментов');
    expect(geo?.inlinePosition, 'controller-positioned (positionFloating inline fixed)').toBe('fixed');
    // Subpixel: positionFloating writes the anchor rect's exact width into
    // the inline style, but serialized style values round to 4 decimals —
    // allow that serialization round-down (the filter-chips precedent).
    expect(
      (geo?.inlineWidth ?? 0) + 0.01,
      'matchAnchorWidth true: panel width ≥ the field width (never narrower)',
    ).toBeGreaterThanOrEqual(geo?.fieldWidth ?? 0);
    expect(geo?.panelTop, 'panel sits below the field box (offset applied)').toBeGreaterThanOrEqual(
      geo?.fieldBottom ?? 0,
    );
    expect(geo?.panelHeight).toBeGreaterThan(0);

    // The region capture: page-level clip (top-layer content included) with
    // its OWN baseline set under combobox-search.spec.ts-snapshots/. Only the
    // clip is passed inline — thresholds/animations stay in playwright.config.ts.
    await expect(page).toHaveScreenshot({ clip: geo?.clip });
  });

  test(`closed state: panel hidden by BOTH the attribute and computed display [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-comboboxsearch--playground', theme));
    await waitForStorySettled(page);
    const el = page.locator('main tk-combobox-search').first();
    await expect(el).toBeAttached();

    const state = await el.evaluate((node) => {
      const host = node as HTMLElement;
      const root = host.shadowRoot;
      const control = root?.querySelector<HTMLInputElement>('.field__control');
      const panel = control ? (root?.getElementById(control.getAttribute('aria-controls') ?? '') ?? null) : null;
      if (!control || !panel) return null;
      return {
        expanded: control.getAttribute('aria-expanded'),
        hidden: panel.hasAttribute('hidden'),
        display: panel.ownerDocument.defaultView?.getComputedStyle(panel).display ?? '',
        inlinePosition: (panel as HTMLElement).style.position,
        status: root?.querySelector('.status')?.textContent ?? '',
      };
    });
    expect(state, 'the closed field resolves').not.toBeNull();
    expect(state?.expanded).toBe('false');
    expect(state?.hidden, 'the hidden attribute is set').toBe(true);
    // The 6.2 lesson pin: author 'display: block' beats UA [hidden] unless
    // the sheet carries its own ':host([hidden]) { display: none }' override
    // — a closed panel must COMPUTE to none, not render as a visible block.
    expect(state?.display).toBe('none');
    expect(state?.inlinePosition, 'no controller positioning while closed').toBe('');
    expect(state?.status).toBe('');
  });
}
