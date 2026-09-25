import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl, THEMES } from './stories';

/**
 * A11Y SWEEP MATRIX (specs 5.1–5.3; Group V added by story 8.1) — the
 * mechanized engine behind the `.playwright-cli/verify/a11y-sweep/`
 * ledgers. Runs the six-check method's MECHANIZABLE half against the
 * BUILT docs bundle for all 19 v1 components + the nine v2 surfaces:
 *
 * - CHECK 1 (keyboard, Tab/Shift-Tab legs): a REAL Tab walk over each
 *   component's story — every stop is recorded, and a Shift+Tab walk back
 *   must revisit exactly the same stops (traps cycle inside; stories cycle
 *   at the iframe document level). The per-component arrow/Space/Esc/Home/
 *   End cells are unit- and spec-pinned (see the ledgers for the pointers);
 *   the walk here proves the traversal legs live, in a real engine, with
 *   focus-visible actually matched.
 * - CHECK 2 (unified focus ring): at EVERY Tab stop, the ring must resolve
 *   2px / solid / offset 2px / the live theme token color — on the focused
 *   element itself, its `+` sibling (the invisible-input pattern:
 *   checkbox box, segment surface, tile face), or the closest `.field`
 *   (input/select focus-within). Logged §9 exceptions (tk-link underline,
 *   tk-article-card underline) verify their exception entry instead: the
 *   underline is PRESENT and opaque while keyboard-focused.
 * - CHECK 3 (names): every visible interactive element in every root
 *   (document + shadow trees) exposes a non-empty accessible name
 *   (aria-labelledby chain > aria-label > associated label > alt > title >
 *   content). Runs deep — not only on Tab stops.
 * - CHECK 5 (≥44×44 targets): every visible interactive element's box is
 *   at least 44×44, with the recorded text-target ruling exempting anchors
 *   flowing inline in prose (display: inline — footer column/legal links,
 *   in-sentence links; the 3.1 tk-link precedent, CONVENTIONS §9).
 *
 * Theme loop: the ring color is theme-dependent (light #1771E6 / dark
 * #66A3FF), so the walk runs in BOTH themes; names/geometry are
 * theme-independent (light only).
 *
 * Placement: same Playwright visual lane + pinned webServer as the rest of
 * tests/visual (build docs first — pnpm test:visual does). Functional
 * only: no baselines.
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

interface SweepTarget {
  component: string;
  group: 'I' | 'II' | 'III' | 'V';
  story: string;
  /** EXACT distinct KIT Tab stops (measured; order is not pinned) — a story
   * adding/removing an interactive surface must update this deliberately. */
  stops: number;
  /** KIT interactive surfaces the deep scan must find (badge/progress: 0). */
  minKitSurfaces: number;
  /** Interactive surfaces whose ring is the underline exception (§9 log). */
  underlineStops?: string[];
  /** Stories whose interactive set differs (open menus etc.). */
  scanStory?: string;
  /** A legitimate ANCESTOR ring carrier (group V: tk-data-table paints the
   * unified ring on the whole `.row` via `:has(.row__link:focus-visible)`,
   * not on the stop). Explicit + per-target — the carrier topology stays
   * closed otherwise (the 5.1 review's permissiveness fix). */
  ringAncestor?: string;
}

const SWEEP: readonly SweepTarget[] = [
  // --- Group I: primitives, indicators, overlays ---------------------------------
  { component: 'tk-button', group: 'I', story: 'components-button--playground', stops: 1, minKitSurfaces: 1 },
  { component: 'tk-link', group: 'I', story: 'components-link--variants', stops: 5, minKitSurfaces: 5, underlineStops: ['tk-link .link'] },
  { component: 'tk-badge', group: 'I', story: 'components-badge--variants', stops: 0, minKitSurfaces: 0 },
  { component: 'tk-progress-bar', group: 'I', story: 'components-progressbar--playground', stops: 0, minKitSurfaces: 0 },
  { component: 'tk-modal', group: 'I', story: 'components-modal--open', stops: 2, minKitSurfaces: 2 },
  { component: 'tk-tooltip', group: 'I', story: 'components-tooltip--open', stops: 1, minKitSurfaces: 1 },
  { component: 'tk-toast', group: 'I', story: 'components-toast--stack', stops: 1, minKitSurfaces: 1 },
  // --- Group II: forms -----------------------------------------------------------
  { component: 'tk-input', group: 'II', story: 'components-input--playground', stops: 1, minKitSurfaces: 1 },
  { component: 'tk-select', group: 'II', story: 'components-select--playground', stops: 1, minKitSurfaces: 2, scanStory: 'components-select--open' },
  { component: 'tk-checkbox', group: 'II', story: 'components-checkbox--playground', stops: 1, minKitSurfaces: 1 },
  { component: 'tk-segmented-radio', group: 'II', story: 'components-segmentedradio--playground', stops: 1, minKitSurfaces: 2 },
  { component: 'tk-thumbnail-picker', group: 'II', story: 'components-thumbnailpicker--playground', stops: 1, minKitSurfaces: 6 },
  // --- Group III: navigation + cards ----------------------------------------------
  { component: 'tk-tabs', group: 'III', story: 'components-tabs--playground', stops: 1, minKitSurfaces: 3 },
  { component: 'tk-navbar', group: 'III', story: 'components-navbar--playground', stops: 6, minKitSurfaces: 6 },
  { component: 'tk-footer', group: 'III', story: 'components-footer--playground', stops: 30, minKitSurfaces: 30 },
  { component: 'tk-promo-card', group: 'III', story: 'components-promocard--playground', stops: 3, minKitSurfaces: 3 },
  { component: 'tk-feature-card', group: 'III', story: 'components-featurecard--playground', stops: 2, minKitSurfaces: 2 },
  { component: 'tk-service-card', group: 'III', story: 'components-servicecard--playground', stops: 3, minKitSurfaces: 3 },
  { component: 'tk-article-card', group: 'III', story: 'components-articlecard--playground', stops: 3, minKitSurfaces: 3, underlineStops: ['tk-article-card .card__link'] },
  // --- Group V: the v2 cluster (story 8.1 — the 6.5 engine note's deferred
  //     matrix extension). Navbar's row here is the MEGA extension story; the
  //     v1 playground walk stays the Group III row above (both are the contract).
  { component: 'tk-filter-chips', group: 'V', story: 'components-filterchips--playground', stops: 8, minKitSurfaces: 8 },
  { component: 'tk-pagination', group: 'V', story: 'components-pagination--playground', stops: 9, minKitSurfaces: 9 },
  { component: 'tk-combobox-search', group: 'V', story: 'components-comboboxsearch--playground', stops: 1, minKitSurfaces: 1, scanStory: 'components-comboboxsearch--open' },
  { component: 'tk-navbar', group: 'V', story: 'components-navbar--mega-nav', stops: 14, minKitSurfaces: 14 },
  { component: 'tk-data-table', group: 'V', story: 'components-datatable--playground', stops: 1, minKitSurfaces: 10, ringAncestor: '.row' },
  // The playground renders the banner OPEN at first paint (top-layer): a
  // forward Tab walk from body never enters the top layer (probed — focus
  // stays on body while Shift+Tab reaches the accept), so the generic walk
  // runs on the variants story (closed banners + demo triggers) and the
  // OPEN card's keyboard contract rides the targeted leg below + the
  // cookie-banner.spec.ts live matrix.
  { component: 'tk-cookie-banner', group: 'V', story: 'components-cookie-banner--variants', stops: 4, minKitSurfaces: 3, scanStory: 'components-cookie-banner--playground' },
  { component: 'tk-stepper', group: 'V', story: 'components-stepper--playground', stops: 0, minKitSurfaces: 0 },
  { component: 'tk-store-badges', group: 'V', story: 'components-storebadges--playground', stops: 3, minKitSurfaces: 3 },
  { component: 'tk-qr-block', group: 'V', story: 'components-qrblock--playground', stops: 1, minKitSurfaces: 2 },
];

/** The live focus-ring token color, resolved from the themed document root. */
function focusTokenColor(page: Page): Promise<string> {
  return page.evaluate(() => {
    const hex = getComputedStyle(document.documentElement)
      .getPropertyValue('--tk-color-focus-ring')
      .trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  });
}

/**
 * ONE Tab stop probe: reads the DEEPEST active element (through every
 * shadow root), then resolves where the ring should paint. Passed as a real
 * function (Playwright 1.63 no longer CALLS string arrows in evaluate —
 * probed: `evaluate('() => 42')` returns undefined). The optional argument
 * names a legitimate ANCESTOR ring carrier (see SweepTarget.ringAncestor —
 * the group V row-ring pattern); without it the carrier topology stays
 * self / `+` sibling / `.field` only.
 */
function probeStop(ringAncestor?: string): StopProbe | null {
  const deepActive = (): Element | null => {
    let node = document.activeElement;
    while (node && node.shadowRoot && node.shadowRoot.activeElement) {
      node = node.shadowRoot.activeElement;
    }
    return node instanceof Element ? node : null;
  };
  const el = deepActive();
  if (!el || el === document.body) return null;
  // A ring carrier only satisfies the contract when it RENDERS: a hidden,
  // display:none, or fully transparent carrier paints nothing, so a broken
  // ring hidden on an invisible carrier must FAIL, not pass (review fix:
  // permissive carriers could mask real ring regressions).
  const readRing = (target: Element): {
    carrier: string;
    width: string;
    style: string;
    offset: string;
    color: string;
  } | null => {
    const style = getComputedStyle(target);
    const renders =
      target.getClientRects().length > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0';
    if (!renders) return null;
    return {
      carrier: target === el ? 'self' : (target.classList[0] ?? target.tagName.toLowerCase()),
      width: style.outlineWidth,
      style: style.outlineStyle,
      offset: style.outlineOffset,
      color: style.outlineColor,
    };
  };
  // KIT SURFACE: the stop lives inside a tk-* element — through a shadow
  // host (the component's own parts) or as slotted/projected light content
  // with a tk-* ancestor (toast action buttons, navbar utilities). Story
  // chrome (demo trigger buttons, notes) is consumer-side of the sweep.
  const insideKit = (node: Element): boolean => {
    let current: Element | null = node;
    while (current) {
      if (current.tagName.toLowerCase().startsWith('tk-')) return true;
      const root = current.getRootNode();
      current = root instanceof ShadowRoot ? root.host : current.parentElement;
    }
    return false;
  };
  const selfRing = readRing(el);
  // The invisible-input pattern paints the ring on the FOLLOWING sibling
  // (input + .box / .segment__surface / .tile__face) — the only sibling
  // shape the kit ships; the speculative previous-sibling carrier was
  // removed (review fix: no inverse pattern exists to license it).
  const siblingRing = el.nextElementSibling ? readRing(el.nextElementSibling) : null;
  const field = el.closest('.field');
  const fieldRing = field && field !== el ? readRing(field) : null;
  // Explicitly registered ANCESTOR carrier (tk-data-table's whole-row ring):
  // resolved only when the registry names the selector — an unconditioned
  // ancestor sweep would accept rings painted for other reasons (the 5.1
  // permissiveness class).
  const ancestorCarrier = ringAncestor ? el.closest(ringAncestor) : null;
  const ancestorRing = ancestorCarrier && ancestorCarrier !== el ? readRing(ancestorCarrier) : null;
  const anchorStyle = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const rootNode = el.getRootNode();
  const host = rootNode instanceof ShadowRoot ? rootNode.host : null;
  // Names cross the slot boundary: tk-button's inner button carries its
  // label as SLOTTED light content — textContent of the shadow element is
  // empty (probed: every tk-link stop walked nameless before this).
  const slotText = (node: Element): string => {
    let text = node.textContent?.trim() ?? '';
    if (!text) {
      for (const slot of Array.from(node.querySelectorAll('slot'))) {
        text += slot
          .assignedNodes({ flatten: true })
          .map((assigned) => assigned.textContent?.trim() ?? '')
          .join(' ');
      }
    }
    return text.trim();
  };
  // Stable per-ELEMENT ordinal (page-persistent Map): two same-shaped,
  // same-named stops get distinct ordinals — shape/name dedupe collapsed
  // them before (review fix). A revisited ordinal closes the walk cycle.
  const seen = (window as typeof window & { __sweepOrd?: Map<Element, number> });
  seen.__sweepOrd ??= new Map();
  if (!seen.__sweepOrd.has(el)) seen.__sweepOrd.set(el, seen.__sweepOrd.size);
  return {
    tag: el.tagName.toLowerCase(),
    classes: el.getAttribute('class') ?? '',
    host: host ? host.tagName.toLowerCase() : '',
    role: el.getAttribute('role') ?? '',
    href: el.tagName === 'A' ? el.getAttribute('href') : null,
    name:
      el.getAttribute('aria-label') ??
      slotText(el).slice(0, 60),
    display: anchorStyle.display,
    textDecorationLine: anchorStyle.textDecorationLine,
    textDecorationColor: anchorStyle.textDecorationColor,
    width: rect.width,
    height: rect.height,
    kitSurface: insideKit(el),
    ordinal: seen.__sweepOrd.get(el) ?? -1,
    rings: [selfRing, siblingRing, fieldRing, ancestorRing].filter(
      (ring): ring is NonNullable<typeof ring> => ring !== null,
    ),
  };
}

interface StopProbe {
  tag: string;
  classes: string;
  host: string;
  role: string;
  href: string | null;
  name: string;
  display: string;
  textDecorationLine: string;
  textDecorationColor: string;
  width: number;
  height: number;
  kitSurface: boolean;
  ordinal: number;
  rings: Array<{ carrier: string; width: string; style: string; offset: string; color: string }>;
}

/** Distinct-stop identity: the per-element ordinal (shape+name can collide). */
const stopKey = (stop: StopProbe): string => `#${stop.ordinal}`;

/** The unified-ring contract, checked against one stop's probe. */
type RingSubject = Pick<
  StopProbe,
  'rings' | 'tag' | 'classes' | 'host' | 'textDecorationLine' | 'textDecorationColor'
>;

/** Typed fallback for the (already-failing) null-stop legs. */
const NO_STOP: RingSubject = {
  rings: [],
  tag: '(no tab stop)',
  classes: '',
  host: '',
  textDecorationLine: 'none',
  textDecorationColor: 'rgba(0, 0, 0, 0)',
};

function ringFailures(
  stop: RingSubject,
  tokenColor: string,
  underlineSelectors: string[],
): string[] {
  const failures: string[] = [];
  // Exact comparison against the resolved token color ONLY (review fix: a
  // color-mix string-prefix acceptance could never prove the resolved
  // paint; if a component ever legitimately computes its ring through
  // color-mix, resolve it explicitly here at that time — the failure this
  // guard then raises is the prompt to do so).
  const qualifies = stop.rings.some(
    (ring) =>
      ring.width === '2px' &&
      ring.style === 'solid' &&
      ring.offset === '2px' &&
      ring.color === tokenColor,
  );
  if (qualifies) return failures;
  // The §9 underline exceptions: the underline IS the indicator — present
  // and OPAQUE (currentColor) while keyboard-focused, never removed.
  const isUnderlineCarrier = underlineSelectors.some((selector) => {
    const [hostTag, ...rest] = selector.split(' ');
    const inner = rest.join(' ');
    return stop.host === hostTag && (inner === '' || stop.classes.split(/\s+/).some((c) => `.${c}` === inner));
  });
  if (
    isUnderlineCarrier &&
    stop.textDecorationLine.includes('underline') &&
    stop.textDecorationColor !== 'rgba(0, 0, 0, 0)'
  ) {
    return failures;
  }
  failures.push(
    `no unified ring (2px solid offset 2px ${tokenColor}) on <${stop.tag} class="${stop.classes}"> in ${stop.host || 'document'} — rings seen: ${JSON.stringify(stop.rings)}; underline: ${stop.textDecorationLine}/${stop.textDecorationColor}`,
  );
  return failures;
}

async function openStory(page: Page, story: string, theme: 'light' | 'dark'): Promise<void> {
  await page.goto(buildStoryUrl(story, theme));
  await waitForStorySettled(page);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  }
  // Normalize the walk start: release any mount-placed focus (the modal trap
  // lands on the first button at open) so the walk starts from body.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  });
}

for (const target of SWEEP) {
  // The §9 underline exceptions are keyed on the ELEMENT, not the story:
  // a tk-link stop inside ANY composition (footer legal links, service-card
  // actions) verifies its exception entry wherever the walk meets it.
  const underlineSelectors = [
    ...(target.underlineStops ?? []),
    'tk-link .link',
    'tk-article-card .card__link',
  ];

  for (const theme of THEMES) {
    test(`sweep ${target.group}/walk: ${target.component} — Tab stops ringed${underlineSelectors.length ? ' (or underline-ruled)' : ''} [${theme}]`, async ({
      page,
    }) => {
      await openStory(page, target.story, theme);
      const tokenColor = await focusTokenColor(page);

      // --- Forward Tab walk: collect stops until the cycle closes on a
      // REVISITED ELEMENT (the per-element ordinal makes same-shaped,
      // same-named stops distinct — review fix). KIT stops (inside a tk-*
      // element) are asserted; story-chrome stops (demo triggers outside
      // the kit) ride along for the traversal record but the ring/geometry
      // contract belongs to kit surfaces.
      const forward: StopProbe[] = [];
      const kitStops: StopProbe[] = [];
      for (let press = 0; press < 80; press += 1) {
        await page.keyboard.press('Tab');
        const stop = await page.evaluate(probeStop, target.ringAncestor);
        if (stop === null) break;
        const key = stopKey(stop);
        if (forward.some((seen) => stopKey(seen) === key)) break; // cycle closed
        forward.push(stop);
        if (stop.kitSurface) kitStops.push(stop);
      }
      expect(
        kitStops.length,
        `${target.component}: EXACT KIT Tab stop count (story ${target.story}) — the story's interactive surface set changed; re-measure and update the registry deliberately`,
      ).toBe(target.stops);

      const failures = kitStops.flatMap((stop) => ringFailures(stop, tokenColor, underlineSelectors));
      expect(failures, failures.join('\n')).toEqual([]);

      // --- Shift+Tab walk: the reverse traversal revisits the SAME stops
      // (cycle at the document level; inside a trap, containment proves it).
      // Ordinals persist across both walks, so the reverse cycle closes on
      // its own revisits — compare the element-ordinal SETS.
      const reverseKeys = new Set(forward.map(stopKey));
      const revisited = new Set<string>();
      for (let press = 0; press < forward.length + 2; press += 1) {
        await page.keyboard.press('Shift+Tab');
        const stop = await page.evaluate(probeStop, target.ringAncestor);
        if (stop === null) break;
        const key = stopKey(stop);
        if (revisited.has(key)) break;
        revisited.add(key);
        expect(
          reverseKeys.has(key),
          `Shift+Tab reached ordinal ${key} (<${stop.tag} class="${stop.classes}">) which the forward walk never visited`,
        ).toBe(true);
      }
      for (const key of reverseKeys) {
        expect(revisited.has(key), `Shift+Tab never revisited ${key}`).toBe(true);
      }
    });
  }

  test(`sweep ${target.group}/scan: ${target.component} — every visible interactive element named, ≥44×44 (or text-target-ruled)`, async ({
    page,
  }) => {
    await openStory(page, target.scanStory ?? target.story, 'light');
    const interactive = await page.evaluate(() => {
      const SELECTOR =
        'a[href], button, input, select, textarea, [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"], [role="option"], [role="menuitem"]';
      interface ScanEntry {
        host: string;
        tag: string;
        classes: string;
        name: string;
        width: number;
        height: number;
        display: string;
        kitSurface: boolean;
      }
      const resolveName = (el: Element): string => {
        const root = el.getRootNode();
        const byId = (el.getAttribute('aria-labelledby') ?? '')
          .split(/\s+/)
          .filter(Boolean)
          .map((id) =>
            root instanceof ShadowRoot || root instanceof Document
              ? root.getElementById?.(id)
              : null,
          )
          .map((ref) => (ref instanceof Element ? ref.textContent?.trim() ?? '' : ''))
          .join(' ')
          .trim();
        if (byId) return byId;
        const attr = (name: string): string | null => el.getAttribute(name)?.trim() || null;
        const ariaLabel = attr('aria-label');
        if (ariaLabel) return ariaLabel;
        const alt = attr('alt');
        if (alt) return alt;
        const title = attr('title');
        if (title) return title;
        if (el.id) {
          const label =
            root instanceof ShadowRoot || root instanceof Document
              ? root.querySelector?.(`label[for="${CSS.escape(el.id)}"]`)
              : null;
          if (label?.textContent?.trim()) return label.textContent.trim();
        }
        const wrapper = el.closest('label');
        if (wrapper?.textContent?.trim()) return wrapper.textContent.trim();
        // Slotted labels: the shadow element's own text is empty — the label
        // rides the assigned light content (tk-button's inner button).
        const slots = el.querySelectorAll('slot');
        for (const slot of slots) {
          const assigned = slot
            .assignedNodes({ flatten: true })
            .map((node) => node.textContent?.trim() ?? '')
            .join(' ')
            .trim();
          if (assigned) return assigned;
        }
        return el.textContent?.trim() ?? '';
      };
      const results: ScanEntry[] = [];
      const insideKit = (node: Element): boolean => {
        let current: Element | null = node;
        while (current) {
          if (current.tagName.toLowerCase().startsWith('tk-')) return true;
          const root = current.getRootNode();
          current = root instanceof ShadowRoot ? root.host : current.parentElement;
        }
        return false;
      };
      const walk = (rootNode: ParentNode): void => {
        for (const el of rootNode.querySelectorAll('*')) {
          if (el.closest('[aria-hidden="true"]')) continue;
          if (!el.matches(SELECTOR)) {
            if (el.shadowRoot) walk(el.shadowRoot);
            continue;
          }
          if (el instanceof HTMLInputElement && el.type === 'hidden') continue;
          const style = getComputedStyle(el);
          const visible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            el.getClientRects().length > 0;
          if (visible) {
            // The EFFECTIVE box: an input inside a wrapping <label> is
            // clickable across the whole label (native semantics); a link
            // with a whole-area ::after stitch (tk-article-card) is
            // clickable across the stitched ancestor. Measure the real
            // target, not the label's glyph box.
            const label = el.closest('label');
            let measure = label ?? el;
            const pseudo = getComputedStyle(el, '::after');
            const stitched =
              pseudo.content !== 'none' &&
              pseudo.position === 'absolute' &&
              [pseudo.top, pseudo.right, pseudo.bottom, pseudo.left].every(
                (inset) => inset === '0px',
              );
            if (stitched) {
              for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
                if (getComputedStyle(ancestor).position !== 'static') {
                  measure = ancestor;
                  break;
                }
              }
            }
            const rect = measure.getBoundingClientRect();
            const rootNode = el.getRootNode();
            const host =
              rootNode instanceof ShadowRoot
                ? rootNode.host.tagName.toLowerCase()
                : '';
            results.push({
              host,
              tag: el.tagName.toLowerCase(),
              classes: el.getAttribute('class') ?? '',
              name: resolveName(el),
              width: rect.width,
              height: rect.height,
              display: style.display,
              kitSurface: insideKit(el),
            });
          }
          if (el.shadowRoot) walk(el.shadowRoot);
        }
      };
      // Document-wide: self-enqueueing surfaces (the toast stack) RELOCATE
      // to #tk-toast-stack on <body> — outside #storybook-root.
      walk(document);
      return results;
    });

    const kitSurfaces = interactive.filter((el: { kitSurface: boolean }) => el.kitSurface);
    expect(
      kitSurfaces.length,
      `${target.component}: KIT interactive surfaces found in ${target.scanStory ?? target.story}`,
    ).toBeGreaterThanOrEqual(target.minKitSurfaces);

    const failures: string[] = [];
    for (const el of interactive) {
      // Names: EVERY visible interactive element (story chrome included — a
      // nameless demo trigger is an axe failure in the visual suite too).
      if (!el.name) {
        failures.push(`nameless interactive <${el.tag} class="${el.classes}"> in ${el.host || 'document'}`);
      }
      // Geometry: the ≥44×44 floor is the KIT's contract; the recorded
      // text-target ruling exempts anchors flowing inline in prose.
      const textTarget = el.tag === 'a' && el.display === 'inline';
      if (el.kitSurface && !textTarget && (el.width < 44 || el.height < 44)) {
        failures.push(
          `<${el.tag} class="${el.classes}"> in ${el.host || 'document'} is ${el.width}×${el.height}px (floor 44×44; inline-prose anchors are the only ruled exception)`,
        );
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
}

// --- Targeted legs the generic engine cannot reach -------------------------------

test('tk-button: REAL Space and Enter keydowns activate the native button', async ({ page }) => {
  await openStory(page, 'components-button--playground', 'light');
  const armed = await page.evaluate(() => {
    const host = document.querySelector('main tk-button');
    const button = host?.shadowRoot?.querySelector('button');
    if (!button) return false;
    const counter = window as typeof window & { __sweepClicks?: number };
    counter.__sweepClicks = 0;
    button.addEventListener('click', () => {
      counter.__sweepClicks = (counter.__sweepClicks ?? 0) + 1;
    });
    button.focus();
    return true;
  });
  expect(armed, 'the playground renders a tk-button').toBe(true);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  const clicks = await page.evaluate(
    () => (window as typeof window & { __sweepClicks?: number }).__sweepClicks ?? 0,
  );
  expect(clicks, 'one click per real Enter and Space keydown').toBe(2);
});

test('tk-article-card: the whole-card stitch — ::after covers the card, the hit target is the full card (≥44×44)', async ({
  page,
}) => {
  await openStory(page, 'components-articlecard--playground', 'light');
  const geo = await page.evaluate(() => {
    const host = document.querySelector('main tk-article-card');
    const link = host?.shadowRoot?.querySelector('.card__link');
    const card = host?.shadowRoot?.querySelector('.card');
    if (!link || !card) return null;
    const pseudo = getComputedStyle(link, '::after');
    const cardRect = card.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    return {
      cardW: cardRect.width,
      cardH: cardRect.height,
      linkW: linkRect.width,
      linkH: linkRect.height,
      pseudoContent: pseudo.content,
      pseudoPosition: pseudo.position,
      inset: [pseudo.top, pseudo.right, pseudo.bottom, pseudo.left],
    };
  });
  expect(geo, 'card + link geometry resolves').not.toBeNull();
  // The stitch: an absolutely-positioned ::after inset 0 over the positioned
  // card — every pixel of the card is the anchor's hit target.
  expect(geo?.pseudoContent).not.toBe('none');
  expect(geo?.pseudoPosition).toBe('absolute');
  expect(geo?.inset).toEqual(['0px', '0px', '0px', '0px']);
  expect(geo?.cardW).toBeGreaterThanOrEqual(44);
  expect(geo?.cardH).toBeGreaterThanOrEqual(44);
});

test.describe('tk-navbar [360] — the burger drawer', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('burger is 44×44; the drawer links are ≥44 tall and ringed under keyboard focus; Esc closes', async ({
    page,
  }) => {
    await openStory(page, 'components-navbar--playground', 'light');
    const tokenColor = await focusTokenColor(page);

    // The burger replaces the links nav below 768px — and meets the floor.
    const burger = page.locator('tk-navbar .burger');
    await expect(burger).toBeVisible();
    const burgerBox = await burger.boundingBox();
    expect(burgerBox?.width).toBeGreaterThanOrEqual(44);
    expect(burgerBox?.height).toBeGreaterThanOrEqual(44);

    // The utilities cluster STAYS visible at 360 (the story's media query
    // chips it: round search + login pill) — the chips must meet the floor
    // too, not just the burger (review item: 360 utility geometry).
    const utilities = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.tkn-utility'))
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });
    });
    expect(
      utilities.length,
      'the utility chips are visible beside the burger at 360',
    ).toBeGreaterThanOrEqual(2);
    for (const chip of utilities) {
      expect(chip.width).toBeGreaterThanOrEqual(44);
      expect(chip.height).toBeGreaterThanOrEqual(44);
    }

    // Keyboard-open (Enter): the trap's programmatic placement follows a real
    // keyboard interaction, so the drawer links match :focus-visible.
    await burger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('tk-navbar .drawer')).toBeVisible();

    const drawerLinks = await page.evaluate(() => {
      const host = document.querySelector('tk-navbar');
      const links = Array.from(host?.shadowRoot?.querySelectorAll('.drawer__link') ?? []);
      return links.map((link) => {
        const rect = (link as HTMLElement).getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    expect(drawerLinks.length).toBeGreaterThan(0);
    for (const box of drawerLinks) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }

    // A real Tab inside the trap lands keyboard focus on a drawer link — the
    // unified ring must paint there (deep probe, same as the walk).
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => probeStop());
    expect(stop, 'Tab inside the drawer keeps focus on a drawer link').not.toBeNull();
    expect(stop?.host).toBe('tk-navbar');
    expect(
      ringFailures(stop ?? NO_STOP, tokenColor, []),
      'the drawer link ring',
    ).toEqual([]);

    // Esc closes and restores focus to the burger (unit-pinned mechanics,
    // proven live at the story level).
    await page.keyboard.press('Escape');
    await expect(page.locator('tk-navbar .drawer')).toBeHidden();
    const active = await page.evaluate(() => {
      let node = document.activeElement as Element | null;
      const chain: string[] = [];
      while (node) {
        chain.push(node.tagName.toLowerCase());
        node = node.shadowRoot?.activeElement ?? null;
      }
      return chain.join('>');
    });
    expect(active).toContain('tk-navbar');
  });
});

test('tk-cookie-banner: the open card is a REAL keyboard stop with the unified ring; Esc does not dismiss (the recorded ruling)', async ({
  page,
}) => {
  // The playground story renders the banner OPEN at first paint (top-layer).
  // A forward Tab walk from body never enters the top layer (probed — the
  // generic walk rides the variants story instead), but the accept pill IS
  // keyboard-reachable in REVERSE: a bounded Shift+Tab walk from body finds
  // it (first press may land on the slotted link depending on the entry
  // point — both directions are keyboard focus, so focus-visible engages).
  await openStory(page, 'components-cookie-banner--playground', 'light');
  const tokenColor = await focusTokenColor(page);
  let stop: StopProbe | null = null;
  for (let press = 0; press < 5; press += 1) {
    await page.keyboard.press('Shift+Tab');
    stop = await page.evaluate(() => probeStop());
    if (stop?.classes.includes('banner__accept')) break;
  }
  expect(stop, 'a bounded Shift+Tab walk reaches the open card’s accept pill').not.toBeNull();
  expect(stop?.tag).toBe('button');
  expect(stop?.classes).toContain('banner__accept');
  expect(stop?.kitSurface, 'the pill lives inside the tk-cookie-banner tree').toBe(true);
  expect(ringFailures(stop ?? NO_STOP, tokenColor, []), 'the accept ring').toEqual([]);

  // The RECORDED RULING (7.2): consent is a POSITIVE act — Esc is prevented,
  // never dismisses. Live pin at the story level (unit pins the mechanics).
  await page.keyboard.press('Escape');
  const stillOpen = await page.evaluate(() => {
    const host = document.querySelector('main tk-cookie-banner') as (HTMLElement & { open: boolean }) | null;
    const card =
      host?.shadowRoot?.querySelector('div') ??
      document.querySelector('#tk-overlay-root > div');
    return { open: host?.open ?? false, cardVisible: card ? getComputedStyle(card).display !== 'none' : false };
  });
  expect(stillOpen.open, 'Esc does not dismiss (the deliberate no-dismiss ruling)').toBe(true);
  expect(stillOpen.cardVisible).toBe(true);
});
