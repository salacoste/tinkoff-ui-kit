import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-cookie-banner OPEN-CARD visual coverage (spec 7.2) — the modal.spec.ts
 * page-level clip mold: `locator('body')` element screenshots EXCLUDE
 * top-layer-promoted content, so the story baselines in visual.spec.ts record
 * the story canvas but NOT the open card (which is also why every variant
 * demo keeps its banner closed — several cards would stack in the ONE fixed
 * bottom-left slot). Here the capture is PAGE-LEVEL with a clip over the card
 * region — the page screenshot DOES include top-layer pixels — so the
 * interaction-driven open card gets automated kit-vs-kit drift protection
 * from day one (the HANDOFF §5 «open-state baselines» lesson).
 *
 * Layout assertions accompany the capture, real-browser complements of the
 * happy-dom unit pins: the card is controller-mounted on the MODAL layer (z
 * token, no lock/trap — the scrimless ruling), viewport-fixed at the 16px
 * bottom-left inset, width-capped within [180px, 212px] (the measured
 * reference width), non-modal (role
 * dialog, aria-modal ABSENT), focused on the accept pill whose hit box is
 * the §8 44px floor with the 32px visible pill inside, and the slotted link
 * computes to the §6 hook's token fallback with the hover-only underline.
 *
 * The closed-state test is assertion-only (the computed display:none pin —
 * the 6.2 lesson — over the lazy card), so it adds no baseline. The
 * long-message/empty-slot caps run on the variants story, assertion-only
 * (matrix rows 7–8 measured in real layout, not just as sheet strings).
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does). No motion exists to
 * reduce — the frozen no-motion ruling.
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
  test(`open card region (top-layer, element-API path): visible, fixed bottom-left, non-modal, 44px accept hit [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-cookie-banner--playground', theme));
    await waitForStorySettled(page);
    await pinDeterministicFonts(page);
    const el = page.locator('main tk-cookie-banner').first();
    await expect(el).toBeAttached();

    const geo = await el.evaluate(async (node) => {
      const host = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      // Exercise the ELEMENT-API mount path (the interactive one), not the
      // attribute-at-first-paint path the story itself uses (the modal mold).
      host.open = false;
      await host.updateComplete;
      host.open = true;
      await host.updateComplete;

      // Popover path keeps the card in the element's shadow tree; the
      // container fallback reparents it — resolve both (the unit-test mold).
      const card =
        host.shadowRoot?.querySelector('div') ??
        document.querySelector('#tk-overlay-root > div');
      if (!card) return null;
      const cardEl = card as HTMLElement & { shadowRoot: ShadowRoot | null };
      const accept = cardEl.shadowRoot?.querySelector<HTMLButtonElement>('button.banner__accept');
      const pill = cardEl.shadowRoot?.querySelector('.banner__accept-pill');
      const link = host.querySelector('a');
      if (!accept || !pill || !link) return null;
      const rect = cardEl.getBoundingClientRect();
      const win = cardEl.ownerDocument.defaultView!;
      // Resolve the §6 fallback chain against a probe: the link must compute
      // to --tk-color-text-secondary (the hook unset → token fallback).
      const probe = cardEl.ownerDocument.createElement('span');
      probe.style.color = 'var(--tk-color-text-secondary)';
      cardEl.ownerDocument.body.appendChild(probe);
      const expectedLinkColor = win.getComputedStyle(probe).color;
      probe.remove();
      return {
        hidden: cardEl.hidden,
        zIndex: cardEl.style.zIndex,
        position: win.getComputedStyle(cardEl).position,
        role: cardEl.getAttribute('role'),
        ariaModal: cardEl.getAttribute('aria-modal'),
        ariaLabel: cardEl.getAttribute('aria-label'),
        // Deep focus: document.activeElement is the card while focus sits in
        // its shadow root — the accept pill must be it (open moves focus).
        deepFocusIsAccept:
          cardEl.shadowRoot?.activeElement === accept || document.activeElement === accept,
        acceptText: accept.textContent?.trim() ?? '',
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        acceptRect: accept.getBoundingClientRect().toJSON(),
        pillHeight: pill.getBoundingClientRect().height,
        linkColor: win.getComputedStyle(link).color,
        expectedLinkColor,
        linkDecoration: win.getComputedStyle(link).textDecorationLine,
        linkCenter: (() => {
          // PAGE coordinates (mouse.move is page-space; rect is viewport-space).
          const r = link.getBoundingClientRect();
          return { x: r.x + r.width / 2 + win.scrollX, y: r.y + r.height / 2 + win.scrollY };
        })(),
        viewport: { width: win.innerWidth, height: win.innerHeight },
      };
    });
    expect(geo, 'card + accept + link geometry resolves').not.toBeNull();
    expect(geo?.hidden).toBe(false);
    expect(geo?.zIndex, 'controller-mounted (modal layer token)').toBe('var(--tk-z-modal)');
    expect(geo?.position, 'viewport-anchored frame (sheet :host fixed)').toBe('fixed');
    // The non-modal dialog contract in a real browser.
    expect(geo?.role).toBe('dialog');
    expect(geo?.ariaModal, 'NO aria-modal — the scrimless non-modal ruling').toBeNull();
    expect(geo?.ariaLabel).toBe('Баннер согласия использования cookies');
    expect(geo?.deepFocusIsAccept, 'open moves focus to the accept pill').toBe(true);
    expect(geo?.acceptText).toBe('Хорошо');
    // The frozen 16px bottom-left inset (space-16 on both axes).
    expect(Math.abs((geo?.rect.x ?? -99) - 16)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(
        (geo?.viewport.height ?? -99) - ((geo?.rect.y ?? 0) + (geo?.rect.height ?? 0)) - 16,
      ),
    ).toBeLessThanOrEqual(1);
    // fit-content within the [180, 212] band (sheet min-width / max-width —
    // the 212 cap is the MEASURED reference card width).
    expect(geo?.rect.width ?? 0).toBeGreaterThanOrEqual(180);
    expect(geo?.rect.width ?? 0).toBeLessThanOrEqual(212);
    expect(geo?.rect.height ?? 0).toBeGreaterThan(0);
    // §8: the 44px hit floor with the 32px visible pill inside.
    expect(geo?.acceptRect.height).toBeGreaterThanOrEqual(44);
    expect(geo?.acceptRect.width).toBeGreaterThanOrEqual(44);
    expect(Math.round(geo?.pillHeight ?? 0)).toBe(32);
    // The slotted link: token-fallback color at rest, NO underline…
    expect(geo?.linkColor).toBe(geo?.expectedLinkColor);
    expect(geo?.linkDecoration, 'underline is hover-only').toBe('none');

    // …underline ON hover (the sheet's ::slotted(a:hover) contract).
    await page.mouse.move(geo?.linkCenter.x ?? 0, geo?.linkCenter.y ?? 0);
    const hovered = await el.evaluate((node) => {
      const link = node.querySelector('a');
      return link ? getComputedStyle(link).textDecorationLine : '';
    });
    expect(hovered, '::slotted(a:hover) underlines the link').toBe('underline');

    // The region capture: page-level clip over the card (top-layer content
    // included), padded 8px so the corner radius + soft shadow edge settle —
    // its OWN baseline set under cookie-banner.spec.ts-snapshots/.
    const clip = {
      x: Math.max(0, Math.floor((geo?.rect.x ?? 0) - 8)),
      y: Math.max(0, Math.floor((geo?.rect.y ?? 0) - 8)),
      width: Math.ceil((geo?.rect.width ?? 0) + 16),
      height: Math.ceil((geo?.rect.height ?? 0) + 16),
    };
    await expect(page).toHaveScreenshot({ clip });
  });

  test(`closed state: card hidden by BOTH the attribute and computed display [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-cookie-banner--playground', theme));
    await waitForStorySettled(page);
    const el = page.locator('main tk-cookie-banner').first();
    await expect(el).toBeAttached();

    const state = await el.evaluate(async (node) => {
      const host = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
      host.open = false; // release the story's first-paint mount…
      await host.updateComplete;
      host.open = true; // …then close through the element API: card exists.
      await host.updateComplete;
      host.open = false;
      await host.updateComplete;
      const card = host.shadowRoot?.querySelector('div') ?? null;
      if (!card) return null;
      return {
        openAttr: host.hasAttribute('open'),
        hidden: card.hasAttribute('hidden'),
        display: getComputedStyle(card as HTMLElement).display,
      };
    });
    expect(state, 'the released card resolves').not.toBeNull();
    expect(state?.openAttr).toBe(false);
    expect(state?.hidden, 'the hidden attribute is set').toBe(true);
    // The 6.2 lesson pin: author display beats UA [hidden] unless the sheet
    // carries ':host([hidden]) { display: none }' — a closed card must
    // COMPUTE to none, not linger as a visible fixed box.
    expect(state?.display).toBe('none');
  });

  test(`long message caps at 212px; empty message floors at 180px (variants, assertion-only) [${theme}]`, async ({
    page,
  }) => {
    await page.goto(buildStoryUrl('components-cookie-banner--variants', theme));
    await waitForStorySettled(page);
    const banners = page.locator('main tk-cookie-banner');
    await expect(banners).toHaveCount(5);

    // Figure 3 = the long message; open ALONE (all cards share the one fixed
    // slot — the demo mechanic), measure, release, then figure 4 = empty slot.
    const widths = await banners.evaluateAll(async (nodes) => {
      const measure = async (node: Element): Promise<number> => {
        const host = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
        host.open = true;
        await host.updateComplete;
        const card =
          host.shadowRoot?.querySelector('div') ??
          document.querySelector('#tk-overlay-root > div');
        const width = card ? card.getBoundingClientRect().width : -1;
        host.open = false;
        await host.updateComplete;
        return width;
      };
      return {
        long: await measure(nodes[2] as Element),
        empty: await measure(nodes[3] as Element),
      };
    });
    expect(widths.long, 'long message: capped at the 212px ceiling').toBeLessThanOrEqual(212 + 1);
    expect(widths.long, 'long message: still grows past the floor').toBeGreaterThanOrEqual(180);
    expect(
      Math.round(widths.empty),
      'empty message: the 180px min-width floor holds the card open',
    ).toBe(180);
  });
}

// --- 7.2(b): the deferred-work Tab-walk revisit, closed by story 11.1 ---------
//
// A FORWARD Tab walk cannot enter a first-paint top-layer surface (the 8.1
// engine finding — fundamental, probed live), but the REVERSE walk reaches
// the card. The one-press reading is REFUTED by measurement (2026-09-26,
// built bundle): from body the reverse order is the card's slotted LINK →
// the story's demo trigger (chrome) → body (transient) → the ACCEPT pill.
// So the leg rides the 8.1 BOUNDED-walk mold: the FIRST reverse stop is
// already INSIDE the card (the slotted link — the banner's own content,
// named via its aria-label; its focus affordance is the recorded 7.2
// UNDERLINE judgment, ::slotted(a:focus-visible) — the link register, not
// the unified ring), the walk then reaches the accept pill — ringed (the
// unified 2px token ring, :focus-visible engaged by the real keypress) and
// named — and Enter ACCEPTS: `consent-choice` fires (the §3 bare verb) and
// the CONSUMER close path hides the card. The kit never closes itself (the
// 7.2 contract): the consumer flip on consent-choice is the only close
// path, wired here exactly as documented (the same reading the v2 SR
// protocol records: «объявлений закрытия НЕТ (баннер сам не закрывается)»).
test('7.2(b) reverse entry: a bounded Shift+Tab walk from body enters the open card (slotted link named + underlined), reaches the ringed accept pill; Enter accepts (consent-choice) and the consumer close hides the card', async ({
  page,
}) => {
  await page.goto(buildStoryUrl('components-cookie-banner--playground', 'light'));
  await waitForStorySettled(page);
  const el = page.locator('main tk-cookie-banner').first();
  await expect(el).toBeAttached();

  // Element-API open path (the interactive mold), then the documented
  // consumer close wiring — the accept handler dispatches ONLY the event.
  await el.evaluate(async (node) => {
    const host = node as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
    host.open = false;
    await host.updateComplete;
    host.open = true;
    await host.updateComplete;
    host.addEventListener('consent-choice', () => {
      (window as typeof window & { __consentFired?: boolean }).__consentFired = true;
      host.open = false; // THE consumer close (the only close path)
    });
    return true;
  });

  // Normalize to body: blur the DEEPEST active element (open placed focus on
  // the accept, inside nested shadow roots — a shallow blur would miss it).
  await page.evaluate(() => {
    let node = document.activeElement as Element | null;
    while (node && node.shadowRoot && node.shadowRoot.activeElement) {
      node = node.shadowRoot.activeElement;
    }
    (node as HTMLElement | null)?.blur?.();
  });

  const tokenColor = await page.evaluate(() => {
    const hex = getComputedStyle(document.documentElement)
      .getPropertyValue('--tk-color-focus-ring')
      .trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  });

  const probeStop = (): Promise<{
    tag: string;
    classes: string;
    name: string;
    ariaLabel: string | null;
    inBanner: boolean;
    underline: string;
    width: number;
    height: number;
    ringWidth: string;
    ringStyle: string;
    ringOffset: string;
    ringColor: string;
  } | null> =>
    page.evaluate(() => {
      let node = document.activeElement as Element | null;
      while (node && node.shadowRoot && node.shadowRoot.activeElement) {
        node = node.shadowRoot.activeElement;
      }
      if (!node || node === document.body) return null;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        tag: node.tagName.toLowerCase(),
        classes: node.getAttribute('class') ?? '',
        name: node.textContent?.trim() ?? '',
        ariaLabel: node.getAttribute('aria-label'),
        inBanner: node.closest('tk-cookie-banner') !== null,
        underline: style.textDecorationLine,
        width: rect.width,
        height: rect.height,
        ringWidth: style.outlineWidth,
        ringStyle: style.outlineStyle,
        ringOffset: style.outlineOffset,
        ringColor: style.outlineColor,
      };
    });

  // FIRST reverse stop: already INSIDE the card — the slotted link, named via
  // its aria-label, its recorded affordance (underline) engaged by the real
  // Shift+Tab keypress.
  await page.keyboard.press('Shift+Tab');
  const entry = await probeStop();
  expect(entry, 'Shift+Tab from body reaches INTO the open top-layer card').not.toBeNull();
  expect(entry?.inBanner, 'the first reverse stop is the banner\'s own slotted content').toBe(true);
  expect(entry?.tag).toBe('a');
  expect(
    entry?.ariaLabel,
    'the slotted link is named (the demo anchor\'s aria-label)',
  ).toBe('Согласие на обработку данных');
  expect(
    entry?.underline,
    '::slotted(a:focus-visible) underlines the focused link (the recorded 7.2 link-register judgment)',
  ).toContain('underline');

  // Bounded continuation to the accept pill (measured: link → demo trigger →
  // body → accept; every intermediate REAL stop rides along for the record).
  let accept: Awaited<ReturnType<typeof probeStop>> = null;
  for (let press = 0; press < 5; press += 1) {
    await page.keyboard.press('Shift+Tab');
    const stop = await probeStop();
    if (stop?.classes.includes('banner__accept')) {
      accept = stop;
      break;
    }
  }
  expect(accept, 'the bounded reverse walk reaches the accept pill').not.toBeNull();
  expect(accept?.tag).toBe('button');
  expect(accept?.name, 'the pill is named (its visible label)').toBe('Хорошо');
  expect(accept?.ringWidth).toBe('2px');
  expect(accept?.ringStyle).toBe('solid');
  expect(accept?.ringOffset).toBe('2px');
  expect(accept?.ringColor).toBe(tokenColor);
  expect(accept?.width).toBeGreaterThanOrEqual(44);
  expect(accept?.height).toBeGreaterThanOrEqual(44);

  // Enter ACCEPTS: the native button activation runs the click path →
  // `consent-choice` (the accept act) → the consumer flip closes the card.
  await page.keyboard.press('Enter');
  const after = await el.evaluate((node) => {
    const host = node as HTMLElement & { open: boolean };
    const card = host.shadowRoot?.querySelector('div') ?? null;
    return {
      consentFired:
        (window as typeof window & { __consentFired?: boolean }).__consentFired ?? false,
      open: host.open,
      hiddenAttr: card?.hasAttribute('hidden') ?? null,
      display: card ? getComputedStyle(card as HTMLElement).display : '',
    };
  });
  expect(after.consentFired, 'Enter dispatched consent-choice (the accept act)').toBe(true);
  expect(after.open, 'the consumer flip closed the banner').toBe(false);
  expect(after.hiddenAttr, 'the released card carries the hidden attribute').toBe(true);
  expect(after.display, 'the released card computes to display:none').toBe('none');
});
