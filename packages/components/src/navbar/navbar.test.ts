// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkNavbar } from './navbar.js';
import type { TkNavbarLink } from './navbar.js';
import { navbarStyles } from './navbar.css.js';

/**
 * tk-navbar unit tests (spec 3.4): the six I/O matrix rows — scroll-past-
 * threshold class flip, active-link underline wiring, burger <768
 * visibility (structural media-query pin), drawer open → controller
 * integration (mount + scroll-lock + focus trap, asserted via module
 * effects), Esc/close + focus restore to the burger, link clamp — plus the
 * NO-CHANNEL ruling, the zero-bespoke-z/scroll/trap structural pin, slot
 * projection, and null-tolerance.
 *
 * Controller integration is asserted through its OBSERVABLE EFFECTS (the
 * module owns the mechanics): the refcounted lock writing overflow on the
 * documentElement, mountOverlay promoting/reparenting the panel with the
 * popover attribute or the fallback container, and trapFocus cycling Tab
 * and restoring focus. happy-dom runs no layout — media-query BEHAVIOR is
 * pinned structurally against the sheet's cssText (the tabs precedent),
 * while the drawer logic itself is width-blind and runs fully here.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkNavbar): Promise<unknown> => el.updateComplete;

/** The drawer open path awaits updateComplete internally — settle a macrotask past it. */
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

/** Console is spied file-wide: the links clamp dev-warns, Lit dev-mode may warn. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

/** The reference nav (tbank.ru capture navbar-desktop.png): 4 sections. */
const LINKS: TkNavbarLink[] = [
  { value: 'retail', label: 'Частным лицам', href: '/retail' },
  { value: 'business', label: 'Бизнесу', href: '/business' },
  { value: 'premium', label: 'Премиум', href: '/premium' },
  { value: 'more', label: 'Ещё', href: '/more' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkNavbar>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkNavbar> => {
  const el = new TkNavbar();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const barLinks = (el: TkNavbar): HTMLAnchorElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.links .link') ?? []),
];

/** Drawer links — from the PANEL (wherever the controller currently holds it). */
const drawerLinks = (el: TkNavbar): HTMLAnchorElement[] => [
  ...(drawerPanel(el)?.querySelectorAll<HTMLAnchorElement>('.drawer__link') ?? []),
];

const burger = (el: TkNavbar): HTMLButtonElement | null =>
  el.shadowRoot?.querySelector<HTMLButtonElement>('.burger') ?? null;

/** The panel lives in the shadow tree, or in the controller's container while open (fallback path). */
const drawerPanel = (el: TkNavbar): HTMLElement | null =>
  el.shadowRoot?.querySelector<HTMLElement>('.drawer') ??
  (document.querySelector('.drawer:not([hidden])') as HTMLElement | null);

/** Stub window.scrollY and fire a scroll event (the listener is passive + window-level). */
const scrollTo = (y: number): void => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
};

/** Kit channel events the NO-CHANNEL ruling forbids this element from dispatching. */
const collectChannelEvents = (el: TkNavbar): string[] => {
  const heard: string[] = [];
  for (const name of ['value-change', 'active-value-change', 'open-change', 'select', 'close']) {
    el.addEventListener(name, (event) => heard.push(event.type));
  }
  return heard;
};

describe('tk-navbar', () => {
  it('registers as tk-navbar exposing TkNavbar', async () => {
    await customElements.whenDefined('tk-navbar');
    expect(customElements.get('tk-navbar')).toBe(TkNavbar);
  });

  // --- Matrix row 1: scroll past threshold -------------------------------------

  it('scroll listener flips data-scrolled at the 10px threshold (hysteresis-free both ways)', async () => {
    const el = await mount({ props: { links: LINKS } });
    expect(el.hasAttribute('data-scrolled'), 'mounted at scrollY 0: no shadow').toBe(false);

    scrollTo(9);
    expect(el.hasAttribute('data-scrolled'), 'below the threshold: still nothing').toBe(false);

    scrollTo(10);
    expect(el.hasAttribute('data-scrolled'), 'at the threshold: shadow + hairline in').toBe(true);

    scrollTo(250);
    expect(el.hasAttribute('data-scrolled')).toBe(true);

    scrollTo(0);
    expect(el.hasAttribute('data-scrolled'), 'back at top: transparent again').toBe(false);
  });

  it('a navbar connected mid-scroll reflects the current position at connect', async () => {
    scrollTo(120);
    const el = await mount({ props: { links: LINKS } });
    expect(el.hasAttribute('data-scrolled')).toBe(true);
    scrollTo(0);
  });

  it('the scrolled shadow fade consumes the 150ms motion token (instant under reduced motion via the token layer)', () => {
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const barRule = cssText.match(/\.bar\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(barRule).toMatch(
      /transition:[\s\S]*box-shadow var\(--tk-motion-duration-fast\)[\s\S]*border-color var\(--tk-motion-duration-fast\)/,
    );
    expect(cssText).toMatch(/:host\(\[data-scrolled\]\)\s*\.bar\s*\{[^}]*box-shadow:\s*var\(--tk-shadow-default\)/);
    expect(cssText).toMatch(/:host\(\[data-scrolled\]\)\s*\.bar[^}]*border-bottom-color:\s*var\(--tk-color-border-default\)/);
    // At rest the hairline is transparent (not absent — it fades in).
    expect(barRule).toMatch(/border-bottom:\s*1px solid transparent/);
  });

  // --- Matrix row 2: active link ------------------------------------------------

  it('activeValue marks exactly the matching link: aria-current + 700-weight + underline selectors', async () => {
    const el = await mount({ props: { links: LINKS, activeValue: 'business' } });
    const marked = barLinks(el).filter((link) => link.getAttribute('aria-current') === 'page');
    expect(marked).toHaveLength(1);
    expect(marked[0]?.textContent?.trim()).toBe('Бизнесу');
    expect(marked[0]?.getAttribute('href')).toBe('/business');

    el.activeValue = 'premium';
    await elementUpdated(el);
    expect(barLinks(el).map((link) => link.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'page',
      null,
    ]);
  });

  it('an activeValue not in links marks NOTHING (no first-link clamp — navigation, not a switcher)', async () => {
    const el = await mount({ props: { links: LINKS, activeValue: 'zzz' } });
    expect(barLinks(el).every((link) => link.getAttribute('aria-current') === null)).toBe(true);
    expect(drawerLinks(el).every((link) => link.getAttribute('aria-current') === null)).toBe(true);
  });

  it('active-value attribute is accepted, never reflected (value data, CONVENTIONS §2)', async () => {
    const el = await mount({ props: { links: LINKS }, attributes: { 'active-value': 'retail' } });
    expect(barLinks(el)[0]?.getAttribute('aria-current')).toBe('page');
    el.activeValue = 'more';
    await elementUpdated(el);
    expect(el.getAttribute('active-value'), 'the channel never reflects').toBe('retail');
  });

  it('the yellow underline is CSS-redundant with the 700 weight (the AA redundancy rule)', () => {
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const active = cssText.match(/\.link\[aria-current='page'\]\s*\{([^}]*)\}/)?.[1] ?? '';
    const underline = cssText.match(
      /\.link\[aria-current='page'\]::after\s*\{([^}]*)\}/,
    )?.[1] ?? '';
    expect(active).toMatch(/font-weight:\s*var\(--tk-text-heading-2-weight\)/);
    expect(underline).toMatch(/background:\s*var\(--tk-navbar-underline, var\(--tk-color-yellow-100\)\)/);
    expect(underline).toMatch(/height:\s*4px/);
    expect(underline).toMatch(/bottom:\s*0/, 'pinned to the bar bottom — the border edge');
  });

  // --- Matrix row 3: burger <768 visibility (structural media-query pin) ---------

  it('MEDIA-QUERY PIN: <768 hides the links and shows the burger; ≥768 the inverse', () => {
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const media = cssText.match(/@media \(max-width: 767px\)\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';
    expect(media, 'the breakpoint rule exists').not.toBe('');
    expect(media).toMatch(/\.links\s*\{[^}]*display:\s*none/);
    expect(media).toMatch(/\.burger\s*\{[^}]*display:\s*inline-flex/);
    // The sheet's height cap subtracts the MOBILE bar token inside the
    // breakpoint (the desktop 72px default would over-shrink the sheet).
    expect(media).toMatch(
      /\.drawer\s*\{[^}]*max-height:\s*calc\(100dvh - var\(--tk-navbar-height-mobile, 56px\)\)/,
    );
    // And the base rules are the inverse: burger hidden by default…
    expect(cssText.match(/\.burger\s*\{([^}]*)\}/)?.[1] ?? '').toMatch(/display:\s*none/);
    // …links laid out by default.
    expect(cssText.match(/\.links\s*\{([^}]*)\}/)?.[1] ?? '').toMatch(/display:\s*flex/);
  });

  it('LABEL-ELLIPSIS PIN: the label span is the shrinking flex child (an inline-flex anchor\'s own text-overflow never engages)', async () => {
    const el = await mount({ props: { links: LINKS } });
    const label = barLinks(el)[0]?.querySelector('.link__label');
    expect(label, 'each bar link wraps its label in span.link__label').not.toBeNull();
    expect(label?.textContent?.trim()).toBe('Частным лицам');
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const spanRule = cssText.match(/\.link__label\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(spanRule, 'the .link__label rule exists').not.toBe('');
    expect(spanRule).toMatch(/min-width:\s*0/);
    expect(spanRule).toMatch(/overflow:\s*hidden/);
    expect(spanRule).toMatch(/text-overflow:\s*ellipsis/);
    // The anchor keeps the shrink route but no longer carries the dead
    // ellipsis declarations itself.
    const anchorRule = cssText.match(/\.link\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(anchorRule).not.toMatch(/text-overflow/);
  });

  it('the bar carries banner + nav landmarks; slots project; sticky reflects', async () => {
    const el = await mount({ props: { links: LINKS } });
    const header = el.shadowRoot?.querySelector('header.bar');
    expect(header, 'the bar is a <header> (banner)').not.toBeNull();
    const nav = el.shadowRoot?.querySelector('nav.links');
    expect(nav?.getAttribute('aria-label')).toBe('Навигация');
    expect(barLinks(el)).toHaveLength(4);

    const logo = document.createElement('span');
    logo.setAttribute('slot', 'logo');
    logo.textContent = 'ЛОГО';
    const util = document.createElement('span');
    util.setAttribute('slot', 'utilities');
    util.textContent = 'УТИЛИТЫ';
    el.append(logo, util);
    await elementUpdated(el);
    const logoSlot = el.shadowRoot?.querySelector('slot[name="logo"]');
    const utilSlot = el.shadowRoot?.querySelector('slot[name="utilities"]');
    expect(
      logoSlot?.assignedNodes({ flatten: true }).some((node) => node.textContent === 'ЛОГО'),
    ).toBe(true);
    expect(
      utilSlot?.assignedNodes({ flatten: true }).some((node) => node.textContent === 'УТИЛИТЫ'),
    ).toBe(true);

    expect(el.hasAttribute('sticky'), 'sticky defaults true and reflects').toBe(true);
    el.sticky = false;
    await elementUpdated(el);
    expect(el.hasAttribute('sticky')).toBe(false);
  });

  // --- Matrix row 4: drawer open → controller integration --------------------------

  it('burger click opens the drawer: controller-mounted (popover or fallback container), scroll LOCKED, focus TRAPPED inside', async () => {
    const el = await mount({ props: { links: LINKS, activeValue: 'retail' } });
    burger(el)?.click();
    await settle();

    const panel = drawerPanel(el);
    expect(panel, 'the panel is a shadow-tree child').not.toBeNull();
    expect(panel?.hidden).toBe(false);
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    expect(burger(el)?.getAttribute('aria-expanded')).toBe('true');
    expect(burger(el)?.getAttribute('aria-controls')).toBe(panel?.id);

    // mountOverlay effect: popover promotion OR the fallback container reparent.
    const mounted =
      panel?.getAttribute('popover') === 'manual' ||
      panel?.parentElement?.id === 'tk-overlay-root';
    expect(mounted, 'the controller owns the stacking (popover attr or #tk-overlay-root)').toBe(
      true,
    );
    // positionFloating effect: fixed coordinates applied by the controller.
    expect(panel?.style.position).toBe('fixed');

    // lockBodyScroll effect: the refcounted lock holds the documentElement.
    expect(document.documentElement.style.overflow).toBe('hidden');

    // trapFocus effect: initial focus lands INSIDE the drawer.
    const first = drawerLinks(el)[0];
    expect(document.activeElement).toBe(first);

    // …and the trap cycles: Tab on the LAST link wraps to the first.
    const linksInDrawer = drawerLinks(el);
    const last = linksInDrawer[linksInDrawer.length - 1];
    last?.focus();
    const tabAtLast = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    last?.dispatchEvent(tabAtLast);
    expect(tabAtLast.defaultPrevented, 'the trap owns the wrap').toBe(true);
    expect(document.activeElement).toBe(linksInDrawer[0]);

    // Close before leaving (the refcounted lock is module-global — an open
    // drawer here would poison every later test's unlock assertion).
    drawerPanel(el)!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('the drawer projects the burger slot when provided; the fallback list leaves the DOM (honest trap set)', async () => {
    const override = document.createElement('nav');
    override.setAttribute('slot', 'burger');
    override.innerHTML = '<a href="/x">Своё меню</a>';
    const el = await mount({ props: { links: LINKS } });
    el.appendChild(override);
    await elementUpdated(el);
    await settle(); // slotchange → re-render
    expect(drawerLinks(el)).toHaveLength(0); // the fallback list is NOT rendered
    const slot = el.shadowRoot?.querySelector('slot[name="burger"]');
    expect(
      slot?.assignedNodes({ flatten: true }).some((node) => node.textContent === 'Своё меню'),
    ).toBe(true);

    // The override drawer still opens with the controller mechanics; the trap
    // runs EMPTY (the module's designed degradation — slot-projected content
    // is outside its selector scope, and no phantom fallback focusables linger).
    burger(el)?.click();
    await settle();
    expect(drawerPanel(el)?.hidden).toBe(false);
    expect(document.documentElement.style.overflow).toBe('hidden');

    // Close before leaving (refcounted lock hygiene, see the open test).
    burger(el)?.click();
    await settle();
    expect(document.documentElement.style.overflow).toBe('');
  });

  // --- Matrix row 5: Esc/close + focus restore --------------------------------------

  it('Esc closes: lock released, panel hidden + re-homed, focus RESTORED to the burger', async () => {
    const el = await mount({ props: { links: LINKS } });
    burger(el)?.click();
    await settle();
    expect(document.documentElement.style.overflow).toBe('hidden');

    drawerPanel(el)!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await settle();

    expect(document.documentElement.style.overflow, 'the refcounted lock released').toBe('');
    const panel = drawerPanel(el);
    expect(panel?.hidden).toBe(true);
    expect(panel?.parentNode, 'the panel is re-homed into the shadow root').toBe(el.shadowRoot);
    expect(burger(el)?.getAttribute('aria-expanded')).toBe('false');
    // The burger lives in the shadow tree: document.activeElement retargets
    // to the host — the shadow root carries the real stop (the tabs precedent).
    expect(el.shadowRoot?.activeElement, 'focus restored to the burger (the spec demand)').toBe(
      burger(el),
    );
  });

  it('the burger TOGGLES; a clicked drawer link closes the drawer (navigation is the anchor\'s own)', async () => {
    const el = await mount({ props: { links: LINKS } });
    burger(el)?.click();
    await settle();
    expect(drawerPanel(el)?.hidden).toBe(false);

    burger(el)?.click();
    await settle();
    expect(drawerPanel(el)?.hidden).toBe(true);

    burger(el)?.click();
    await settle();
    drawerLinks(el)[1]?.click();
    await settle();
    expect(drawerPanel(el)?.hidden, 'link click closes').toBe(true);
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('disconnect quietly tears the drawer down (no crash, no stray lock)', async () => {
    const el = await mount({ props: { links: LINKS } });
    burger(el)?.click();
    await settle();
    expect(document.documentElement.style.overflow).toBe('hidden');
    el.remove();
    await settle();
    expect(document.documentElement.style.overflow, 'the lock died with the element').toBe('');
  });

  // --- Async open/close race regressions (the review findings) -------------------------

  it('rapid double-toggle during the open window: the second click WINS — no mount, no leak, drawer closed', async () => {
    const el = await mount({ props: { links: LINKS } });
    // Both clicks land BEFORE the open path's await updateComplete resolves:
    // click 1 starts the open (state flips synchronously), click 2 sees the
    // open state and closes it — the pending continuation must then bail on
    // its re-validation instead of mounting a "closed" drawer.
    burger(el)?.click();
    burger(el)?.click();
    await settle();
    await settle();

    expect(drawerPanel(el)?.hidden, 'the drawer never mounted').toBe(true);
    expect(document.documentElement.style.overflow, 'no scroll-lock leaked').toBe('');
    expect(burger(el)?.getAttribute('aria-expanded')).toBe('false');
    // The element stays fully usable afterwards: a normal open/close cycle.
    burger(el)?.click();
    await settle();
    expect(drawerPanel(el)?.hidden).toBe(false);
    expect(document.documentElement.style.overflow).toBe('hidden');
    burger(el)?.click();
    await settle();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('disconnect DURING the open window: state stays clean, no lock/trap leaks past the element', async () => {
    const el = await mount({ props: { links: LINKS } });
    // Remove BEFORE the await resolves — disconnectedCallback's quiet close
    // runs while the open is still pending; the continuation must bail.
    burger(el)?.click();
    el.remove();
    await settle();
    await settle();

    expect(document.documentElement.style.overflow, 'no scroll-lock leaked').toBe('');
    // Re-mounting the same element must not resurrect a half-open drawer.
    document.body.appendChild(el);
    await settle();
    expect(el.shadowRoot?.querySelector('.drawer')?.hidden).toBe(true);
    expect(burger(el)?.getAttribute('aria-expanded')).toBe('false');
  });

  // --- The NO-CHANNEL ruling ----------------------------------------------------------

  it('NO channel events: link clicks and burger toggles dispatch nothing (navigation, not a form control)', async () => {
    const el = await mount({ props: { links: LINKS } });
    const heard = collectChannelEvents(el);
    barLinks(el)[1]?.click();
    burger(el)?.click();
    await settle();
    burger(el)?.click();
    await settle();
    expect(heard).toEqual([]);
  });

  // --- Matrix row 6: link clamp ----------------------------------------------------------

  it('duplicate link VALUES clamp: later duplicates and value-less entries drop with a dev warn', async () => {
    const el = await mount({
      props: {
        links: [
          { value: 'retail', label: 'Частным лицам', href: '/r' },
          { value: 'retail', label: 'Частным лицам (дубль)', href: '/r2' },
          { value: 'premium', label: 'Премиум', href: '/p' },
          { value: '', label: 'Пусто', href: '/x' },
        ] as unknown as TkNavbarLink[],
      },
    });
    await elementUpdated(el);
    expect(barLinks(el)).toHaveLength(2);
    expect(barLinks(el).map((link) => link.textContent?.trim())).toEqual([
      'Частным лицам',
      'Премиум',
    ]);
    expect(drawerLinks(el)).toHaveLength(2);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('null/empty links render the bar with no links — no crash; links arriving later render', async () => {
    const el = await mount({ props: { links: null as unknown as TkNavbarLink[] } });
    expect(el.shadowRoot?.querySelector('header.bar')).not.toBeNull();
    expect(barLinks(el)).toHaveLength(0);
    expect(drawerLinks(el)).toHaveLength(0);

    el.links = LINKS;
    await elementUpdated(el);
    expect(barLinks(el)).toHaveLength(4);
  });

  // --- The acceptance's structural pin -----------------------------------------------------

  it('ZERO-BESPOKE PIN: navbar.ts has no z/scroll-lock/trap code of its own and consumes all four controller capabilities', () => {
    // happy-dom rewrites import.meta.url to a non-file scheme — resolve from
    // the package cwd (vitest runs with cwd = packages/components).
    const source = readFileSync(resolve(process.cwd(), 'src/navbar/navbar.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');

    // The controller capabilities ARE consumed…
    for (const capability of ['mountOverlay', 'positionFloating', 'lockBodyScroll', 'trapFocus']) {
      expect(source, `${capability} imported`).toMatch(new RegExp(`\\b${capability}\\b`));
    }
    // …and none of the mechanics is reimplemented: no z writes, no scroll-lock
    // style writes, no Tab-cycle trap logic (the one scroll listener — the
    // data-scrolled threshold — is sanctioned by the spec's own matrix row).
    expect(source).not.toMatch(/zIndex/);
    expect(source).not.toMatch(/z-index/);
    expect(source).not.toMatch(/style\.overflow/);
    expect(source).not.toMatch(/documentElement\.style/);
    expect(source).not.toMatch(/body\.style/);
    expect(source).not.toMatch(/===\s*'Tab'/);
    expect(source).not.toMatch(/keydown.*Tab/s);
  });

  // ===========================================================================
  // Story 7.1 — MEGA-NAV: the sub-nav row (spec 7.1 matrix, 8 rows).
  // The v1 suite above is the REGRESSION half (untouched, still green);
  // everything below is additive.
  // ===========================================================================

  /** The reference mega-nav (invest domain): 6 + 6 sections. */
  const MEGA_LINKS: TkNavbarLink[] = [
    { value: 'bank', label: 'Банк', href: '/bank' },
    { value: 'business', label: 'Бизнесу', href: '/business' },
    { value: 'invest', label: 'Инвестиции', href: '/invest' },
    { value: 'mobile', label: 'Мобильная связь', href: '/mobile' },
    { value: 'insurance', label: 'Страхование', href: '/insurance' },
    { value: 'travel', label: 'Путешествия', href: '/travel' },
  ];

  const SUB_LINKS: TkNavbarLink[] = [
    { value: 'overview', label: 'Обзор', href: '/overview' },
    { value: 'catalog', label: 'Каталог', href: '/catalog' },
    { value: 'pulse', label: 'Пульс', href: '/pulse' },
    { value: 'analytics', label: 'Аналитика', href: '/analytics' },
    { value: 'academy', label: 'Академия', href: '/academy' },
    { value: 'terminal', label: 'Терминал', href: '/terminal' },
  ];

  const subLinks = (el: TkNavbar): HTMLAnchorElement[] => [
    ...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.subnav .sublink') ?? []),
  ];

  // --- Matrix row 1: v1 regression (byte-identity without subLinks) -------------

  it('MEGA v1 regression: without subLinks the DOM is byte-identical to v1 — class="bar" verbatim, one .bar__inner child, no subnav node', async () => {
    const el = await mount({ props: { links: MEGA_LINKS, activeValue: 'invest' } });
    const header = el.shadowRoot?.querySelector('header.bar');
    expect(header, 'the v1 header element').not.toBeNull();
    // The class attribute is EXACTLY "bar" — no conditional remnant.
    expect(header?.getAttribute('class')).toBe('bar');
    // The header's ONLY child is the row-1 inner (no subnav wrapper, no text).
    expect(header?.children).toHaveLength(1);
    expect(header?.children[0]?.classList.contains('bar__inner')).toBe(true);
    expect(el.shadowRoot?.querySelector('.subnav')).toBeNull();
    expect(el.shadowRoot?.querySelector('.sublink')).toBeNull();
    // The trued row-2 chrome (divider pseudo, underline pseudo) lives ONLY
    // on sub-nav nodes — without subLinks neither renders: the divider is
    // .subnav__inner::before and the underline .sublink::after, so a v1
    // render carries no node they could ever attach to.
    expect(el.shadowRoot?.querySelector('.subnav__inner')).toBeNull();
    // The nav landmark set is v1's: links + the drawer fallback (no third nav).
    expect(el.shadowRoot?.querySelectorAll('nav')).toHaveLength(2);
  });

  it('MEGA v1 css identity: the sheet has NO rule matching a plain .bar/.link outside the v1 selectors (row-2 rules all scope under .subnav/.sublink/.bar--subnav)', () => {
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    // The three structural hooks of row 2 are class-scoped additions; the
    // v1 selectors themselves are untouched (their declarations are pinned
    // by the v1 tests above — this pin guards against accidental v1-rule
    // edits by asserting the row-2 selectors only ever appear as their own
    // rules, never merged into a v1 rule).
    expect(cssText).toMatch(/\.bar--subnav\s*\{[^}]*height:\s*auto/);
    expect(cssText).toMatch(/\.bar--subnav \.bar__inner\s*\{[^}]*height:\s*var\(--tk-navbar-height, 72px\)/);
    expect(cssText).not.toMatch(/\.bar,\.bar--subnav/);
  });

  // --- Matrix row 2: two-deep ----------------------------------------------------

  it('MEGA two-deep: subLinks render a second row INSIDE the same header; active sub-link = 700 text-primary + 2px underline (trued)', async () => {
    const el = await mount({
      props: {
        links: MEGA_LINKS,
        activeValue: 'invest',
        subLinks: SUB_LINKS,
        subActiveValue: 'catalog',
      },
    });
    const header = el.shadowRoot?.querySelector('header.bar');
    expect(header?.classList.contains('bar--subnav'), 'the two-row hook class').toBe(true);
    // Row 2 is the header's SECOND child — one sticky unit with row 1.
    expect(header?.children[1]?.classList.contains('subnav')).toBe(true);
    const rows = subLinks(el);
    expect(rows).toHaveLength(6);
    expect(rows.map((link) => link.textContent?.trim())).toEqual([
      'Обзор',
      'Каталог',
      'Пульс',
      'Аналитика',
      'Академия',
      'Терминал',
    ]);
    const marked = rows.filter((link) => link.getAttribute('aria-current') === 'page');
    expect(marked).toHaveLength(1);
    expect(marked[0]?.textContent?.trim()).toBe('Каталог');
    expect(marked[0]?.getAttribute('href')).toBe('/catalog');

    // Row-1 wiring is untouched by the sub-nav props: «Инвестиции» still
    // the single row-1 active.
    expect(
      barLinks(el).filter((link) => link.getAttribute('aria-current') === 'page'),
    ).toHaveLength(1);
    expect(
      barLinks(el).find((link) => link.getAttribute('aria-current') === 'page')?.textContent?.trim(),
    ).toBe('Инвестиции');

    // Structural anatomy pins (the capture literals, TRUED in the story 7.1
    // triage): 64px row height via the flagged hook; ACTIVE carries weight
    // + color AND a 2px underline at the row's bottom edge — the reference
    // paints one (2px #666666 y127–128 under «Каталог»); the mechanism
    // mirrors row 1's ::after at half the stroke, gray token semantics.
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(cssText).toMatch(
      /\.subnav\s*\{[^}]*height:\s*var\(--tk-navbar-subnav-height, 64px\)/,
    );
    const active = cssText.match(/\.sublink\[aria-current='page'\]\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(active).toMatch(/font-weight:\s*var\(--tk-text-heading-2-weight\)/);
    expect(active).toMatch(/color:\s*var\(--tk-navbar-sublink-active, var\(--tk-color-text-primary\)\)/);
    // The underline pseudo (trued): row 1's mechanism verbatim — absolute,
    // inset-inline = the link's own padding token (the label box),
    // bottom 0 — at 2px in text-secondary (the capture's gray stripe).
    const subUnderline = cssText.match(
      /\.sublink\[aria-current='page'\]::after\s*\{([^}]*)\}/,
    )?.[1];
    expect(subUnderline, 'the trued row-2 active underline pseudo').toBeDefined();
    expect(subUnderline).toMatch(/position:\s*absolute/);
    expect(subUnderline).toMatch(/inset-inline:\s*var\(--tk-space-12\)/);
    expect(subUnderline).toMatch(/bottom:\s*0/);
    expect(subUnderline).toMatch(/height:\s*2px/);
    expect(subUnderline).toMatch(/background:\s*var\(--tk-color-text-secondary\)/);
    // Its positioning anchor rides the .sublink rule (the .link precedent).
    const sublinkRule = cssText.match(/\.sublink\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(sublinkRule).toMatch(/position:\s*relative/);
    // The DIVIDER (trued): a 1px ::before ON the row-2 container — the
    // capture's hairline spans the container register only (y64,
    // x88–1191), NOT the full bar width, so .subnav itself still paints no
    // border.
    const divider = cssText.match(/\.subnav__inner::before\s*\{([^}]*)\}/)?.[1];
    expect(divider, 'the trued inter-row divider pseudo').toBeDefined();
    expect(divider).toMatch(/height:\s*1px/);
    expect(divider).toMatch(/background:\s*var\(--tk-color-border-default\)/);
    const subnavRule = cssText.match(/\.subnav\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(subnavRule, 'the divider is the container ::before, not a full-width border').not.toMatch(/border/);
    // The register: .subnav__inner mirrors .bar__inner's container math.
    const inner = cssText.match(/\.subnav__inner\s*\{([^}]*)\}/)?.[1] ?? '';
    const barInner = cssText.match(/\.bar__inner\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const decl of [
      /max-width:\s*var\(--tk-space-container\)/,
      /margin-inline:\s*auto/,
      /padding-inline:\s*var\(--tk-space-24\)/,
    ]) {
      expect(inner).toMatch(decl);
      expect(barInner).toMatch(decl);
    }
  });

  it('MEGA subLinks run the SAME duplicate/value-less clamp as links (dev warn, first occurrence wins)', async () => {
    const el = await mount({
      props: {
        links: MEGA_LINKS,
        subLinks: [
          { value: 'overview', label: 'Обзор', href: '/o' },
          { value: 'overview', label: 'Обзор (дубль)', href: '/o2' },
          { value: 'catalog', label: 'Каталог', href: '/c' },
          { value: '', label: 'Пусто', href: '/x' },
        ] as unknown as TkNavbarLink[],
      },
    });
    await elementUpdated(el);
    expect(subLinks(el)).toHaveLength(2);
    expect(subLinks(el).map((link) => link.textContent?.trim())).toEqual(['Обзор', 'Каталог']);
    expect(warnSpy).toHaveBeenCalled();
  });

  // --- Matrix row 3: unmatched subActiveValue --------------------------------------

  it('MEGA unmatched subActiveValue marks NOTHING (the v1 matrix pick, row 2)', async () => {
    const el = await mount({
      props: { links: MEGA_LINKS, subLinks: SUB_LINKS, subActiveValue: 'nope' },
    });
    expect(subLinks(el).every((link) => link.getAttribute('aria-current') === null)).toBe(true);
    el.subActiveValue = 'pulse';
    await elementUpdated(el);
    expect(
      subLinks(el).filter((link) => link.getAttribute('aria-current') === 'page'),
    ).toHaveLength(1);
  });

  // --- Matrix row 4: sticky shadow under the LAST row --------------------------------

  it('MEGA sticky scroll: the data-scrolled shadow/hairline stay on the bar WRAPPER — with subLinks they paint under row 2 (one sticky unit)', async () => {
    const el = await mount({
      props: { links: MEGA_LINKS, subLinks: SUB_LINKS, subActiveValue: 'catalog' },
    });
    scrollTo(9);
    expect(el.hasAttribute('data-scrolled'), 'below the threshold: no shadow').toBe(false);
    scrollTo(10);
    expect(el.hasAttribute('data-scrolled'), 'at the threshold: shadow in').toBe(true);
    scrollTo(0);
    expect(el.hasAttribute('data-scrolled')).toBe(false);

    // Structural: the scrolled rule targets .bar — the element that WRAPS
    // .subnav — so the shadow sits under the LAST row without new CSS.
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(cssText).toMatch(
      /:host\(\[data-scrolled\]\)\s*\.bar\s*\{[^}]*box-shadow:\s*var\(--tk-shadow-default\)/,
    );
    // …and the sticky positioning is on the same wrapper (v1 selector,
    // byte-identical — the whole two-row bar is one sticky unit).
    expect(cssText).toMatch(/:host\(\[sticky\]\)\s*\.bar\s*\{[^}]*position:\s*sticky/);
  });

  // --- Matrix row 5: burger <768px hides the sub-nav ----------------------------------

  it('MEGA MEDIA-QUERY PIN: <768 hides the sub-nav row and restores the mobile bar height; ≥768 the row shows', () => {
    const cssText = navbarStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const media = cssText.match(/@media \(max-width: 767px\)\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';
    expect(media, 'the breakpoint rule exists').not.toBe('');
    expect(media).toMatch(/\.subnav\s*\{[^}]*display:\s*none/);
    // The explicit .bar--subnav .bar__inner height must restate the MOBILE
    // token inside the breakpoint (the desktop 72px rule would otherwise
    // over-rule the mobile .bar flip).
    expect(media).toMatch(
      /\.bar--subnav \.bar__inner\s*\{[^}]*height:\s*var\(--tk-navbar-height-mobile, 56px\)/,
    );
    // Base (desktop) rules: the sub-nav row lays out by default.
    expect(cssText.match(/\.subnav\s*\{([^}]*)\}/)?.[1] ?? '').not.toMatch(/display:\s*none/);
  });

  it('MEGA <768 model: the drawer stays v1 — row-1 links only, no sub-nav in the drawer', async () => {
    const el = await mount({
      props: {
        links: MEGA_LINKS,
        activeValue: 'invest',
        subLinks: SUB_LINKS,
        subActiveValue: 'catalog',
      },
    });
    // The drawer's fallback list renders the row-1 links ONLY (v1 template,
    // untouched by the sub-nav props) — the sub-nav is desktop chrome and
    // never enters the drawer.
    expect(drawerLinks(el)).toHaveLength(6);
    expect(drawerLinks(el).map((link) => link.textContent?.trim())).toEqual([
      'Банк',
      'Бизнесу',
      'Инвестиции',
      'Мобильная связь',
      'Страхование',
      'Путешествия',
    ]);
    expect(drawerLinks(el)[2]?.getAttribute('aria-current')).toBe('page');
    expect(drawerPanel(el)?.querySelector('.sublink')).toBeNull();
  });

  // --- Matrix row 6: keyboard order ----------------------------------------------------

  it('MEGA keyboard order: row-1 links → utilities slot → row-2 links — every stop a real anchor (§D observed order)', async () => {
    const login = document.createElement('a');
    login.setAttribute('slot', 'utilities');
    login.setAttribute('href', '/login');
    login.textContent = 'Войти';
    const el = await mount({
      props: { links: MEGA_LINKS, subLinks: SUB_LINKS, subActiveValue: 'catalog' },
    });
    el.appendChild(login);
    await elementUpdated(el);

    // The composed tab order follows the FLAT tree: the utilities SLOT's
    // position stands in for the slotted anchor (slot → slot position).
    // Document order: 6 row-1 links, the utilities slot, then 6 sub-links.
    const ordered = [
      ...(el.shadowRoot?.querySelectorAll<HTMLElement>(
        '.links .link, .utilities, .subnav .sublink',
      ) ?? []),
    ];
    expect(ordered).toHaveLength(13);
    const classes = ordered.map((node) => (node instanceof HTMLSlotElement ? 'utilities' : node.className));
    expect(classes.slice(0, 6).every((cls) => cls === 'link')).toBe(true);
    expect(classes[6]).toBe('utilities');
    expect(classes.slice(7).every((cls) => cls === 'sublink')).toBe(true);

    // Every stop is a real anchor with a resolved href (native navigation,
    // the v1 ruling) — rows 1, 2 and the slotted utility alike.
    for (const anchor of [...barLinks(el), ...subLinks(el)]) {
      expect(anchor).toBeInstanceOf(HTMLAnchorElement);
      expect(anchor.getAttribute('href')).toBeTruthy();
    }
    const utilSlot = el.shadowRoot?.querySelector('slot[name="utilities"]');
    expect(
      utilSlot
        ?.assignedNodes({ flatten: true })
        .some((node) => node instanceof HTMLAnchorElement && node.getAttribute('href') === '/login'),
    ).toBe(true);

    // The burger sits between utilities and row 2 in the shadow tree but is
    // display:none at desktop (v1's own media pin) — not a desktop stop.
    const headerChildren = [
      ...(el.shadowRoot?.querySelector('header.bar')?.children ?? []),
    ].map((child) => child.className);
    expect(headerChildren).toEqual(['bar__inner', 'subnav']);
  });

  // --- Matrix row 7: empty subLinks -------------------------------------------------------

  it('MEGA empty subLinks: no second row, no second nav landmark — the v1 path', async () => {
    const el = await mount({ props: { links: MEGA_LINKS, subLinks: [] } });
    expect(el.shadowRoot?.querySelector('.subnav')).toBeNull();
    expect(subLinks(el)).toHaveLength(0);
    expect(el.shadowRoot?.querySelector('header.bar')?.getAttribute('class')).toBe('bar');
    // v1's two navs only (links + drawer fallback) — no third landmark.
    expect(el.shadowRoot?.querySelectorAll('nav')).toHaveLength(2);
    // null subLinks is equally empty (null-tolerant props).
    el.subLinks = null as unknown as TkNavbarLink[];
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.subnav')).toBeNull();
    // Links arriving later render the row (the null-links precedent).
    el.subLinks = SUB_LINKS;
    await elementUpdated(el);
    expect(subLinks(el)).toHaveLength(6);
  });

  // --- Matrix row 8: two named navs + aria-current ------------------------------------------

  it('MEGA two named navs: «Навигация» + subLabel (default «Разделы», sub-label overrides); aria-current on BOTH actives', async () => {
    const el = await mount({
      props: {
        links: MEGA_LINKS,
        activeValue: 'invest',
        subLinks: SUB_LINKS,
        subActiveValue: 'catalog',
      },
    });
    expect(el.shadowRoot?.querySelector('nav.links')?.getAttribute('aria-label')).toBe(
      'Навигация',
    );
    expect(el.shadowRoot?.querySelector('nav.subnav')?.getAttribute('aria-label')).toBe(
      'Разделы',
    );
    // Both rows carry their own current page.
    expect(barLinks(el)[2]?.getAttribute('aria-current')).toBe('page');
    expect(subLinks(el)[1]?.getAttribute('aria-current')).toBe('page');

    // sub-label attribute accepted; the property drives the landmark name.
    const custom = await mount({
      props: { links: MEGA_LINKS, subLinks: SUB_LINKS },
      attributes: { 'sub-label': 'Разделы каталога' },
    });
    expect(custom.shadowRoot?.querySelector('nav.subnav')?.getAttribute('aria-label')).toBe(
      'Разделы каталога',
    );
    // Value-data props never reflect (CONVENTIONS §2 — the active-value mirror).
    custom.subLabel = 'Другое';
    await elementUpdated(custom);
    expect(custom.getAttribute('sub-label')).toBe('Разделы каталога');
    custom.subActiveValue = 'terminal';
    await elementUpdated(custom);
    expect(custom.hasAttribute('sub-active-value')).toBe(false);
    expect(
      subLinks(custom).filter((link) => link.getAttribute('aria-current') === 'page'),
    ).toHaveLength(1);
  });

  it('MEGA no-channel ruling carries into row 2: sub-link clicks dispatch nothing', async () => {
    const el = await mount({
      props: { links: MEGA_LINKS, subLinks: SUB_LINKS, subActiveValue: 'catalog' },
    });
    const heard = collectChannelEvents(el);
    for (const name of [
      'value-change',
      'sub-value-change',
      'sub-active-value-change',
      'select',
      'close',
    ]) {
      el.addEventListener(name, (event) => heard.push(event.type));
    }
    subLinks(el)[0]?.click();
    await settle();
    expect(heard).toEqual([]);
  });
});
