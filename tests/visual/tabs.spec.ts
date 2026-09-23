import { expect, test, type Browser, type Locator, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * tk-tabs LIVE-ENGINE coverage (Story 3.3) — the half of the I/O matrix
 * happy-dom cannot run:
 *
 * - «Tab moves into the active panel then out»: REAL Tab traversal from the
 *   active tab button lands in the active panel's projected content (inactive
 *   panels are display:none — out of the tab order), and an empty panel
 *   passes focus through.
 * - The keyboard matrix through the browser's own keydown: arrows cycle with
 *   AUTOMATIC activation (focus + aria-selected + value-change move
 *   together), wrap at the edges, skip the disabled tab, Home/End.
 * - The badge count joins the tab's ACCESSIBLE name (the name computation
 *   pierces the nested tk-badge's shadow root — raw textContent cannot).
 * - The NO-BAR-ANIMATION pin in COMPUTED styles: the track and the tab
 *   buttons resolve animation:none in every motion preference; the visible
 *   panel resolves the swap animation only when the user prefers motion
 *   (the visual suite's pinned reduce env proves the explicit reduced-motion
 *   rule live).
 *
 * Functional only (no baseline): theme-independent behavior. Same webServer
 * as the visual suite — build docs first (pnpm test:visual does).
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

interface TabState {
  active: string | null;
  selected: string | null;
  tabStops: Array<string | null>;
  panelVisibility: boolean[];
}

/** Values captured by the value-change listener attached in `attachListener`. */
type TabsProbeHost = HTMLElement & { __tabsValues?: string[] };

/** The freshly-mounted element the animation-restart spec probes (expando counter). */
type TabsMountProbeHost = HTMLElement & {
  tabs: Array<{ value: string; label: string }>;
  updateComplete: Promise<unknown>;
  __animations: string[];
};

const readState = (element: Locator) =>
  element.evaluate((node) => {
    const el = node as HTMLElement;
    const buttons = Array.from(el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const panels = Array.from(el.shadowRoot?.querySelectorAll<HTMLElement>('[role="tabpanel"]') ?? []);
    const label = (button: HTMLButtonElement | undefined) => button?.textContent?.trim() ?? null;
    return {
      active: label(
        buttons.find((button) => button === (el.shadowRoot?.activeElement as HTMLButtonElement | null)),
      ),
      selected: label(buttons.find((button) => button.getAttribute('aria-selected') === 'true')),
      tabStops: buttons.map((button) => button.getAttribute('tabindex')),
      panelVisibility: panels.map((panel) => !panel.hidden),
    } satisfies TabState;
  });

test('keyboard matrix live: arrows cycle + wrap with automatic activation, disabled skipped, Home/End', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-tabs').first();
  await expect(el).toBeAttached();

  await el.evaluate((node) => {
    const host = node as TabsProbeHost;
    host.__tabsValues = [];
    host.addEventListener('value-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      host.__tabsValues = [...(host.__tabsValues ?? []), custom.detail.value];
    });
  });

  // Focus the active tab through the real pipeline.
  await el.evaluate((node) => {
    node.shadowRoot?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus();
  });

  // ArrowRight: debit → credit (focus AND selection move — automatic).
  await page.keyboard.press('ArrowRight');
  expect(await readState(el)).toMatchObject({
    active: 'Кредитная карта',
    selected: 'Кредитная карта',
    tabStops: ['-1', '0', '-1'],
    panelVisibility: [false, true, false],
  });

  // ArrowDown behaves as next; ArrowLeft wraps backwards from the first.
  await page.keyboard.press('ArrowLeft');
  expect(await readState(el)).toMatchObject({ active: 'Дебетовая карта', selected: 'Дебетовая карта' });

  // End: last tab selected + focused; ArrowRight at the edge WRAPS to first.
  await page.keyboard.press('End');
  expect(await readState(el)).toMatchObject({
    active: 'Вклад',
    selected: 'Вклад',
    panelVisibility: [false, false, true],
  });
  await page.keyboard.press('ArrowRight');
  expect(await readState(el)).toMatchObject({ active: 'Дебетовая карта', selected: 'Дебетовая карта' });

  // Home returns to the first tab.
  await page.keyboard.press('Home');
  expect(await readState(el)).toMatchObject({ active: 'Дебетовая карта', selected: 'Дебетовая карта' });

  // Every move selected automatically — the emitted channel followed focus.
  // The final Home on the already-first tab is a no-op (nothing re-emits).
  const values = await el.evaluate((node) => (node as TabsProbeHost).__tabsValues ?? []);
  expect(values).toEqual(['credit', 'debit', 'deposit', 'debit']);
});

test('disabled tab: arrows skip it in both directions on the variants story', async ({ page }) => {
  await page.goto(buildStoryUrl('components-tabs--variants', 'light'));
  await waitForStorySettled(page);
  // The third figure's switcher: debit | credit (disabled) | deposit.
  const el = page.locator('main tk-tabs').nth(2);
  await expect(el).toBeAttached();
  await el.evaluate((node) => {
    node.shadowRoot?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus();
  });

  await page.keyboard.press('ArrowRight'); // middle is disabled → lands on last
  expect(await readState(el)).toMatchObject({ active: 'Вклад', selected: 'Вклад' });
  await page.keyboard.press('ArrowLeft'); // back: skips the disabled middle again
  expect(await readState(el)).toMatchObject({ active: 'Дебетовая', selected: 'Дебетовая' });
});

test('Tab from the active tab enters the ACTIVE panel content, then leaves; an empty panel passes through', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-tabs').first();
  await expect(el).toBeAttached();

  // Compose focusable content into the panels exactly as a consumer would.
  await el.evaluate((node) => {
    for (const slotName of ['tab-0', 'tab-1', 'tab-2']) {
      const action = document.createElement('a');
      action.href = '#';
      action.textContent = `${slotName} action`;
      node.querySelector(`[slot="${slotName}"]`)?.appendChild(action);
    }
    node.shadowRoot?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus();
  });

  // Tab: from the active tab INTO the active panel's projected action.
  await page.keyboard.press('Tab');
  let focused = await page.evaluate(() => {
    const host = document.querySelector('main tk-tabs');
    const inner = host?.shadowRoot?.activeElement ?? null;
    // Slotted content lives in the LIGHT dom — its focused element reports
    // through the document when the slot projects it.
    return document.activeElement === host
      ? (inner as HTMLElement | null)?.textContent
      : document.activeElement?.textContent;
  });
  expect(focused).toContain('tab-0 action');

  // Arrow to the second tab, Tab again: the SECOND panel's action — the
  // inactive panels' content is unreachable (display:none).
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  focused = await page.evaluate(() => {
    const host = document.querySelector('main tk-tabs');
    const inner = host?.shadowRoot?.activeElement ?? null;
    return document.activeElement === host
      ? (inner as HTMLElement | null)?.textContent
      : document.activeElement?.textContent;
  });
  expect(focused).toContain('tab-1 action');

  // Empty-panel pass-through: strip the actions, Tab from the active tab
  // skips the empty panel entirely and leaves the component.
  await el.evaluate((node) => {
    node.querySelectorAll('a').forEach((action) => action.remove());
    node.shadowRoot?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus();
  });
  await page.keyboard.press('Tab');
  const escaped = await page.evaluate(() => {
    const host = document.querySelector('main tk-tabs');
    return document.activeElement !== host && host?.shadowRoot?.activeElement === null;
  });
  expect(escaped, 'focus left the component — the empty panel held no stop').toBe(true);
});

test('the badge count joins the tab accessible name (name computation pierces the nested badge shadow)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-tabs--variants', 'light'));
  await waitForStorySettled(page);
  // The badge figure: Дебетовая (5) / Кредитная (120 → 99+) / Вклад. The
  // unprefixed «Вклад» also names the эталон and disabled figures' tabs.
  await expect(page.getByRole('tab', { name: 'Дебетовая 5', exact: true })).toHaveCount(1);
  await expect(page.getByRole('tab', { name: 'Кредитная 99+', exact: true })).toHaveCount(1);
  await expect(page.getByRole('tab', { name: 'Вклад', exact: true })).toHaveCount(3);
  await expect(page.getByRole('tablist')).toHaveCount(5); // every figure renders one
});

test('NO-BAR-ANIMATION pin in computed styles: bar static in every preference; the panel swap runs only with motion', async ({
  browser,
}) => {
  // Motion-preferring context: the panel swap resolves (name + duration);
  // the bar stays animation-free.
  const motion = await (browser as Browser).newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  const page = await motion.newPage();
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);
  const withMotion = await page.locator('main tk-tabs').first().evaluate((node) => {
    const el = node as HTMLElement;
    const track = el.shadowRoot?.querySelector<HTMLElement>('.track');
    const tab = el.shadowRoot?.querySelector<HTMLElement>('[role="tab"]');
    const panel = el.shadowRoot?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
    const style = (element: HTMLElement | null | undefined) =>
      element ? getComputedStyle(element) : null;
    return {
      track: style(track)?.animationName,
      tab: style(tab)?.animationName,
      panel: style(panel)?.animationName,
      panelDuration: style(panel)?.animationDuration,
      panelCurve: style(panel)?.animationTimingFunction,
    };
  });
  expect(withMotion.track).toBe('none');
  expect(withMotion.tab).toBe('none');
  expect(withMotion.panel).toBe('tk-tabs-panel-swap');
  expect(withMotion.panelDuration).toBe('0.3s'); // computed styles serialize seconds
  expect(withMotion.panelCurve).toContain('cubic-bezier(0.4, 0.1, 0.2, 1)');
  await motion.close();

  // The suite's pinned reduce preference: the explicit reduced-motion rule
  // kills the swap live (animation:none everywhere).
  const reduced = await (browser as Browser).newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(reducedPage);
  const withoutMotion = await reducedPage.locator('main tk-tabs').first().evaluate((node) => {
    const el = node as HTMLElement;
    return {
      track: getComputedStyle(el.shadowRoot?.querySelector('.track') as HTMLElement).animationName,
      tab: getComputedStyle(el.shadowRoot?.querySelector('[role="tab"]') as HTMLElement).animationName,
      panel: getComputedStyle(
        el.shadowRoot?.querySelector('[role="tabpanel"]:not([hidden])') as HTMLElement,
      ).animationName,
    };
  });
  expect(withoutMotion).toEqual({ track: 'none', tab: 'none', panel: 'none' });
  await reduced.close();
});

test('hit-area floor: every tab button box is ≥44px tall (the full track height)', async ({ page }) => {
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);
  const geometry = await page.locator('main tk-tabs').first().evaluate((node) => {
    return Array.from(
      (node as HTMLElement).shadowRoot?.querySelectorAll('[role="tab"]') ?? [],
    ).map((button) => {
      const rect = (button as HTMLElement).getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
  });
  expect(geometry).toHaveLength(3);
  for (const box of geometry) {
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  }
});

test('charcoal on-tint recipe: the hovered inactive tab resolves WHITE, never the panel ink (3.3 review fix)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-tabs--theming', 'light'));
  await waitForStorySettled(page);
  // The charcoal panel is the last theming section; its instance overrides
  // BOTH text hooks. Hover an INACTIVE tab and read the computed color: the
  // dedicated --tk-tabs-text-hover hook must keep the hover readable —
  // before the fix it fell back to text-primary (#333 on the #333 tint,
  // 1:1 invisible).
  const charcoal = page.locator('main .tkt-panel--charcoal tk-tabs').first();
  await expect(charcoal).toBeAttached();
  const inactiveTab = charcoal.locator('[role="tab"][aria-selected="false"]').first();
  await inactiveTab.hover();
  const hoverColor = await charcoal.evaluate((node) => {
    const el = node as HTMLElement;
    const tab = el.shadowRoot?.querySelector<HTMLElement>('[role="tab"][aria-selected="false"]');
    return tab ? getComputedStyle(tab).color : null;
  });
  const panelBg = await page.evaluate(() => {
    const panel = document.querySelector('main .tkt-panel--charcoal') as HTMLElement | null;
    return panel ? getComputedStyle(panel).backgroundColor : null;
  });
  expect(hoverColor).toBe('rgb(255, 255, 255)');
  expect(panelBg).toBe('rgb(51, 51, 51)'); // charcoal #333333 — the hover must differ
  expect(hoverColor).not.toBe(panelBg);
});

test('narrow host (360px): tabs shrink inside the track — no spill, ellipsis engages (3.3 review fix)', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-tabs').first();
  await expect(el).toBeAttached();
  const metrics = await el.evaluate((node) => {
    const host = node as HTMLElement;
    host.style.width = '360px'; // constrain exactly as a narrow consumer would
    return new Promise<Record<string, unknown>>((resolve) => {
      requestAnimationFrame(() => {
        const track = host.shadowRoot?.querySelector<HTMLElement>('.track');
        const tabs = Array.from(host.shadowRoot?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
        const trackRect = track?.getBoundingClientRect();
        const lastRect = tabs[tabs.length - 1]?.getBoundingClientRect();
        const labels = Array.from(
          host.shadowRoot?.querySelectorAll<HTMLElement>('.tab__label') ?? [],
        );
        resolve({
          scrollWidth: track?.scrollWidth ?? null,
          clientWidth: track?.clientWidth ?? null,
          lastTabRight: lastRect?.right ?? null,
          trackRight: trackRect?.right ?? null,
          ellipsized: labels.map((label) => label.scrollWidth > label.clientWidth),
        });
      });
    });
  });
  // The strip fits its host: nothing spills past the track (the review's
  // 62px overflow is gone)…
  expect(metrics.scrollWidth as number).toBeLessThanOrEqual(metrics.clientWidth as number);
  expect(metrics.lastTabRight as number).toBeLessThanOrEqual((metrics.trackRight as number) + 0.5);
  // …and the constrained labels actually ellipsize (the documented
  // truncation finally engages on the shrink route).
  expect((metrics.ellipsized as boolean[]).some(Boolean)).toBe(true);
});

test('panel swap RESTARTS on activation: animationstart fires once per newly-visible panel; the mount animation is pinned (3.3 review fix)', async ({
  browser,
}) => {
  // Runs in a motion-preferring context: the suite's pinned reduce
  // preference silences the swap (animation:none), so no animationstart
  // would ever fire there.
  const context = await (browser as Browser).newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  await page.goto(buildStoryUrl('components-tabs--playground', 'light'));
  await waitForStorySettled(page);

  // Fresh in-page mount with the counter attached BEFORE the element
  // renders, so the MOUNT animation is counted too. DECISION POINT (pinned):
  // the initially-active panel animates exactly ONCE at mount — if the kit
  // ever adopts «no animation on first mount», this pin is the loud failure
  // that forces the deliberate change.
  const counts = await page.evaluate(async () => {
    const host = document.createElement('tk-tabs') as unknown as TabsMountProbeHost;
    host.__animations = [];
    host.tabs = [
      { value: 'a', label: 'Первая' },
      { value: 'b', label: 'Вторая' },
    ];
    for (const slotName of ['tab-0', 'tab-1']) {
      const panel = document.createElement('div');
      panel.setAttribute('slot', slotName);
      panel.textContent = slotName;
      host.appendChild(panel);
    }
    // Connect FIRST: Lit creates the shadow render root at connection (it
    // is null on a freshly-created element), so the listener attaches only
    // after appendChild — still synchronously, before the browser can paint
    // and fire the mount animation. It attaches INSIDE the shadow root:
    // composed animation events RETARGET at the shadow boundary, so a
    // host-level listener would see target = host and the panel filter
    // could never match.
    document.querySelector('main')?.appendChild(host);
    const root = host.shadowRoot;
    root?.addEventListener('animationstart', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.getAttribute('role') === 'tabpanel') {
        host.__animations.push((event as AnimationEvent).animationName);
      }
    });
    await host.updateComplete;
    // animationstart fires asynchronously after the first animated frame is
    // committed — under suite load two rAFs can miss it (observed flaky), so
    // poll with a deadline, then leave a settle window proving NO extra
    // event trails in (the "exactly" assertions below stay honest).
    const waitForCount = async (count: number): Promise<void> => {
      const deadline = performance.now() + 1500;
      while (host.__animations.length < count && performance.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    };
    await waitForCount(1);
    await new Promise((resolve) => setTimeout(resolve, 120));

    const afterMount = [...host.__animations];
    const second = host.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1];
    second?.click();
    await host.updateComplete;
    await waitForCount(afterMount.length + 1);
    await new Promise((resolve) => setTimeout(resolve, 120));
    return { afterMount, total: [...host.__animations] };
  });

  expect(counts.afterMount, 'the initial mount animates the active panel exactly once').toEqual([
    'tk-tabs-panel-swap',
  ]);
  expect(counts.total, 'activation restarts the swap on the newly-visible panel — exactly one more').toEqual([
    'tk-tabs-panel-swap',
    'tk-tabs-panel-swap',
  ]);
  await context.close();
});
