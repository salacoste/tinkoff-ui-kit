// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { headerStyles } from './tj-header.css.js';
import {
  TJ_HEADER_SCROLL_THRESHOLD_PX,
  TJ_THEME_ATTRIBUTE,
  TjHeader,
  TjThemeChangeEvent,
  type TjHeaderItem,
} from './tj-header.js';

/**
 * tj-header unit tests (spec 16.5 + the patch-round reference fidelity): the
 * sticky chrome bar — nav pill chips with the href-addressed active-value
 * (semantic-only current: aria-current, zero visual delta — the reference
 * capture marks nothing), the STATELESS theme cycle (read-on-click off the
 * document root, auto = attribute REMOVAL, no matchMedia), the aria-live RU
 * announcements, the inert-CTA href rule, the scroll observer flipping the
 * internal data-scrolled flag, and the css.ts pins (sticky z token, h72→h56
 * compress over motion tokens, NO divider, card pill chips, fully-rounded
 * 36px CTA pill, NO hover, zero theme branches).
 *
 * happy-dom provides NO layout: scroll positions are stubbed globals and the
 * compress geometry is pinned at the css.ts level (real measurement lives in
 * the Playwright harness).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TjHeader): Promise<unknown> => el.updateComplete;

const ITEMS: TjHeaderItem[] = [
  { label: 'Главное', href: '/' },
  { label: 'Разборы', href: '/razbory' },
  { label: 'Истории', href: '/istorii' },
];

const mount = async (setup?: (el: TjHeader) => void): Promise<TjHeader> => {
  const el = new TjHeader();
  if (setup) setup(el);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const chips = (el: TjHeader): HTMLAnchorElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll('a.chip') ?? []);

const themeButton = (el: TjHeader): HTMLButtonElement =>
  el.shadowRoot?.querySelector('button.theme') as HTMLButtonElement;

const announcement = (el: TjHeader): string =>
  el.shadowRoot?.querySelector('.visually-hidden')?.textContent ?? '';

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute(TJ_THEME_ATTRIBUTE);
  vi.unstubAllGlobals();
});

describe('tj-header — registration + nav', () => {
  it('registers as tj-header exposing TjHeader', async () => {
    await customElements.whenDefined('tj-header');
    expect(customElements.get('tj-header')).toBe(TjHeader);
  });

  it('renders a nav landmark with the RU label and one anchor per item', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    const nav = el.shadowRoot?.querySelector('nav.chips');
    expect(nav?.getAttribute('aria-label')).toBe('Навигация');
    const rendered = chips(el);
    expect(rendered.map((chip) => chip.textContent)).toEqual(['Главное', 'Разборы', 'Истории']);
    expect(rendered.map((chip) => chip.getAttribute('href'))).toEqual(['/', '/razbory', '/istorii']);
  });

  it('active-value marks EXACTLY the href-matching chip (semantic-only current: aria-current)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.activeValue = '/razbory';
    });
    const current = chips(el).filter((chip) => chip.getAttribute('aria-current') === 'page');
    expect(current.map((chip) => chip.textContent)).toEqual(['Разборы']);
  });

  it('an active-value matching NOTHING marks no chip (graceful unknown)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.activeValue = '/nowhere';
    });
    expect(chips(el).some((chip) => chip.hasAttribute('aria-current'))).toBe(false);
  });

  it('active-value: attribute writes update the render (attribute→property path), never reflect back', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('active-value', '/istorii');
    await elementUpdated(el);
    expect(
      chips(el).filter((chip) => chip.getAttribute('aria-current') === 'page').map((c) => c.textContent),
    ).toEqual(['Истории']);
    expect(el.hasAttribute('active-value'), 'value data never reflects').toBe(true); // set by the test itself
    el.activeValue = '/';
    await elementUpdated(el);
    expect(el.getAttribute('active-value'), 'the property write does NOT reflect').toBe('/istorii');
  });

  it('null-write guards: attribute REMOVAL and null property both render clean (no crash, no current)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('active-value', '/razbory');
    await elementUpdated(el);
    expect(chips(el).some((chip) => chip.hasAttribute('aria-current'))).toBe(true);

    // The host carries the attribute here (attribute-sourced value); Lit maps
    // its REMOVAL to a null property write (probe-pinned behavior).
    el.removeAttribute('active-value');
    await elementUpdated(el);
    expect(chips(el).some((chip) => chip.hasAttribute('aria-current'))).toBe(false);

    el.activeValue = null; // the direct null write, same clean render
    await elementUpdated(el);
    expect(chips(el).length).toBe(3);
  });

  it('items clamp: duplicate + empty hrefs drop with a dev warn (first occurrence wins)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const el = await mount((el) => {
      el.items = [
        { label: 'A', href: '/a' },
        { label: 'A-dup', href: '/a' },
        { label: 'empty', href: '' },
        { label: 'B', href: '/b' },
      ];
    });
    expect(chips(el).map((chip) => chip.getAttribute('href'))).toEqual(['/a', '/b']);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('items is property-only: an items ATTRIBUTE is inert (object data never attributes)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('items', '/razbory');
    await elementUpdated(el);
    expect(chips(el).length).toBe(3);
  });
});

describe('tj-header — CTA', () => {
  it('default label is the reference copy «Написать» and the href passes through verbatim', async () => {
    const el = await mount((el) => {
      el.ctaHref = 'https://journal.example.com/write';
    });
    const cta = el.shadowRoot?.querySelector('a.bar__cta') as HTMLAnchorElement;
    expect(cta.textContent).toContain('Написать');
    expect(cta.getAttribute('href')).toBe('https://journal.example.com/write');
  });

  it('the 16.1 href rule: EMPTY/absent cta-href renders an inert anchor (no href attribute)', async () => {
    const absent = await mount();
    expect((absent.shadowRoot?.querySelector('a.bar__cta') as HTMLAnchorElement).getAttribute('href')).toBeNull();

    const cleared = await mount((el) => {
      el.ctaHref = '/write';
    });
    cleared.ctaHref = '';
    await elementUpdated(cleared);
    expect((cleared.shadowRoot?.querySelector('a.bar__cta') as HTMLAnchorElement).getAttribute('href')).toBeNull();
  });

  it('cta-label overrides the copy; a null write renders an empty label without crashing', async () => {
    const el = await mount((el) => {
      el.ctaHref = '/w';
      el.ctaLabel = 'Подписаться';
    });
    expect((el.shadowRoot?.querySelector('a.bar__cta') as HTMLAnchorElement).textContent).toContain('Подписаться');
    el.ctaLabel = null;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('a.bar__cta')).not.toBeNull();
  });
});

describe('tj-header — theme control (stateless cycle)', () => {
  it('the control is a type=button icon button named «Переключить тему оформления»', async () => {
    const el = await mount();
    const button = themeButton(el);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Переключить тему оформления');
    expect(button.querySelector('svg'), 'decorative fallback glyph present').not.toBeNull();
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cycles auto→light→dark→auto writing/removing the document-root attribute, read FRESH each click', async () => {
    const el = await mount();
    const button = themeButton(el);
    expect(document.documentElement.hasAttribute(TJ_THEME_ATTRIBUTE)).toBe(false); // auto

    button.click();
    expect(document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE)).toBe('light');
    button.click();
    expect(document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE)).toBe('dark');
    button.click();
    expect(document.documentElement.hasAttribute(TJ_THEME_ATTRIBUTE)).toBe(false); // auto = REMOVAL
  });

  it('respects OUT-OF-BAND writes (stateless: nothing cached) — the cycle resumes from reality', async () => {
    const el = await mount();
    document.documentElement.setAttribute(TJ_THEME_ATTRIBUTE, 'light'); // consumer/SSR wrote it
    themeButton(el).click();
    expect(document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE)).toBe('dark');

    document.documentElement.setAttribute(TJ_THEME_ATTRIBUTE, 'dark'); // even a foreign value
    themeButton(el).click();
    expect(document.documentElement.hasAttribute(TJ_THEME_ATTRIBUTE)).toBe(false); // → auto removal
  });

  it('dispatches theme-change composed+bubbles with the resulting mode as detail', async () => {
    const el = await mount();
    const heard: string[] = [];
    const onDocument = (event: Event): void => {
      if (event instanceof TjThemeChangeEvent) heard.push(event.detail);
    };
    document.addEventListener(TjThemeChangeEvent.eventName, onDocument);
    try {
      themeButton(el).click();
      themeButton(el).click();
      themeButton(el).click();
    } finally {
      document.removeEventListener(TjThemeChangeEvent.eventName, onDocument);
    }
    // Receipt at DOCUMENT level proves composed crossing of the shadow
    // boundary + bubbling to the root.
    expect(heard).toEqual(['light', 'dark', 'auto']);
  });

  it('the event class shape: eventName constant + CustomEvent identity (§9 grammar)', () => {
    expect(TjThemeChangeEvent.eventName).toBe('theme-change');
    const event = new TjThemeChangeEvent('dark');
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe('theme-change');
    expect(event.detail).toBe('dark');
  });

  it('announces each resulting mode via the internal polite region (RU copy)', async () => {
    const el = await mount();
    const button = themeButton(el);
    expect(announcement(el), 'silent before any activation').toBe('');
    expect(el.shadowRoot?.querySelector('.visually-hidden')?.getAttribute('aria-live')).toBe('polite');

    button.click();
    await elementUpdated(el);
    expect(announcement(el)).toBe('Тема оформления: светлая');
    button.click();
    await elementUpdated(el);
    expect(announcement(el)).toBe('Тема оформления: тёмная');
    button.click();
    await elementUpdated(el);
    expect(announcement(el)).toBe('Тема оформления: системная');
  });

  it('theme-icon slot: slotted art replaces the fallback glyph; unslotting restores it (graceful both ways)', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('button.theme svg.theme__glyph')).not.toBeNull();

    const icon = document.createElement('span');
    icon.slot = 'theme-icon';
    el.appendChild(icon);
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0)); // slotchange queue
    expect(el.shadowRoot?.querySelector('button.theme svg.theme__glyph'), 'glyph yields to the slot').toBeNull();

    icon.remove();
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.shadowRoot?.querySelector('button.theme svg.theme__glyph'), 'glyph returns').not.toBeNull();
  });
});

describe('tj-header — scroll observer', () => {
  it('flips data-scrolled ABOVE the threshold and clears it back at rest', async () => {
    const el = await mount();
    expect(el.hasAttribute('data-scrolled')).toBe(false);

    vi.stubGlobal('scrollY', TJ_HEADER_SCROLL_THRESHOLD_PX + 1);
    window.dispatchEvent(new Event('scroll'));
    expect(el.hasAttribute('data-scrolled')).toBe(true);

    vi.stubGlobal('scrollY', TJ_HEADER_SCROLL_THRESHOLD_PX);
    window.dispatchEvent(new Event('scroll'));
    expect(el.hasAttribute('data-scrolled')).toBe(false);
  });

  it('a header mounted MID-SCROLL compresses immediately (connect reflects the current position)', async () => {
    vi.stubGlobal('scrollY', 400);
    const el = new TjHeader();
    document.body.appendChild(el);
    expect(el.hasAttribute('data-scrolled'), 'set synchronously at connect').toBe(true);
    await elementUpdated(el);
  });

  it('detaching stops the observer (no post-dispatch flips, no leak)', async () => {
    const el = await mount();
    el.remove();
    vi.stubGlobal('scrollY', 999);
    window.dispatchEvent(new Event('scroll'));
    expect(el.hasAttribute('data-scrolled')).toBe(false);
  });
});

describe('tj-header — twin innerHTML invariance (AD-3 v5)', () => {
  it('identical shadow markup under a dark vs light ancestor — zero theme branches', async () => {
    const light = await mount((el) => {
      el.items = ITEMS;
    });
    const darkAncestor = document.createElement('div');
    darkAncestor.setAttribute(TJ_THEME_ATTRIBUTE, 'dark');
    document.body.appendChild(darkAncestor);
    const dark = new TjHeader();
    dark.items = ITEMS;
    dark.activeValue = '/razbory';
    light.activeValue = '/razbory';
    darkAncestor.appendChild(dark);
    await elementUpdated(dark);
    await elementUpdated(light);
    expect(dark.shadowRoot?.innerHTML).toBe(light.shadowRoot?.innerHTML);
  });
});

describe('tj-header styles (css.ts pins)', () => {
  const cssText = headerStyles.cssText;

  it('sticky chrome: top 0 + the nav z token (the sanctioned non-overlay z consumption)', () => {
    expect(cssText).toContain('position: sticky');
    expect(cssText).toContain('top: 0');
    expect(cssText).toContain('z-index: var(--tj-z-nav)');
    // The STRONGER pin (the zero-hardcoded net reads test sources too, so the
    // assertion phrases itself without a z literal): EXACTLY ONE z
    // declaration in the sheet, token-fed.
    const zDeclarations = cssText
      .split('\n')
      .filter((line) => line.includes('z-index'))
      .map((line) => line.trim());
    expect(zDeclarations, 'the one sanctioned z declaration, token-fed').toEqual([
      'z-index: var(--tj-z-nav);',
    ]);
  });

  it('the compress: h72 token base → 56px on data-scrolled, over the fast duration + standard curve', () => {
    expect(cssText).toContain('display: grid');
    expect(cssText).toContain('grid-template-rows: var(--tj-space-header-h)');
    expect(cssText).toContain(':host([data-scrolled]) .bar');
    expect(cssText).toContain('grid-template-rows: 56px');
    expect(cssText).toContain(
      'transition: grid-template-rows var(--tj-motion-duration-fast) var(--tj-motion-curve-standard)',
    );
    // The animation channel is the GRID ROW, never a layout box metric —
    // the design-detector law (CI gates it; px↔px rows interpolate
    // everywhere). The needle is joined at runtime so this guard's own
    // source never trips the detector's pattern.
    const layoutBoxTransition = ['transition:', 'height'].join(' ');
    expect(cssText).not.toContain(layoutBoxTransition);
  });

  it('reduced-motion belt collapses the compress transition', () => {
    expect(cssText).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('page-token ground + NO divider (the reference bar blends into the page) + container-bound inner row', () => {
    expect(cssText).toContain('background: var(--tj-color-page)');
    expect(cssText, 'the capture shows no separating line — the authored hairline was removed').not.toContain(
      'border-bottom',
    );
    expect(cssText).toContain('max-width: var(--tj-space-container)');
  });

  it('chips are WHITE CARD PILLS in the full nav-label species; current marking is SEMANTIC-ONLY', () => {
    expect(cssText).toContain('background: var(--tj-color-card)');
    expect(cssText).toContain('border-radius: var(--tj-radius-chip)');
    // The species pair rides the BASE (probe9 census: every row 17/700) —
    // no [aria-current] visual rule exists at all.
    expect(cssText).toContain('font-size: var(--tj-text-nav-label-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-nav-label-weight)');
    expect(cssText, 'no weight delta may exist for current (the reference marks nothing)').not.toContain(
      ".chip[aria-current='page']",
    );
    expect(cssText).not.toContain('text-decoration: underline');
  });

  it('the CTA: 44 floor with the fully-rounded 36px capture pill (4px inset, 15px inline, cta tokens)', () => {
    expect(cssText).toContain('.bar__cta::before');
    expect(cssText).toContain('inset-block: 4px');
    expect(cssText).toContain('padding-inline: 15px');
    expect(cssText).toContain('border-radius: var(--tj-radius-full)');
    expect(cssText).toContain('background: var(--tj-color-cta-fill)');
    expect(cssText).toContain('color: var(--tj-color-cta-ink)');
  });

  it('NO hover state anywhere (unprobed — nothing invented)', () => {
    expect(cssText).not.toContain(':hover');
  });

  it('focus rings on every interactive (2px token ring, offset 2px)', () => {
    expect(cssText).toContain('.chip:focus-visible');
    expect(cssText).toContain('.theme:focus-visible');
    expect(cssText).toContain('.bar__cta:focus-visible');
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
  });

  it('consumes ТЖ tokens only — zero --tk-* reads (FR-17 family isolation)', () => {
    expect(cssText).not.toContain('--tk-');
  });

  it('carries no theme branches (dark rides the token layer alone)', () => {
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });
});
