// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { railStyles } from './tj-rail.css.js';
import { TjRail, TjOpenChangeEvent, type TjRailItem } from './tj-rail.js';

/**
 * tj-rail unit tests (spec 16.5 + the patch round): the section rail + burger
 * sheet — nav>ul>li>a structure, value-addressed current-value
 * (semantic-only: aria-current, zero visual delta — the reference capture
 * marks nothing), the per-item icon-{value} tile presence tracking, and the
 * FULL drawer channel round-trip (open reflected + open-change from every
 * source, the STAMPED-ATTRIBUTE open mounting from first paint without
 * dispatching, helper-owned mount/lock/trap mechanics, Esc/scrim/link
 * closes, focus restore, race guard, quiet teardown).
 *
 * happy-dom provides NO popover API (mountSheet runs its fixed fallback) and
 * NO layout engine (no media queries apply — which is exactly how the
 * programmatic-open-at-any-viewport ruling is observable here).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TjRail): Promise<unknown> => el.updateComplete;

/** Let Lit's render + the sheet's post-await mount both settle. */
const settled = async (el: TjRail): Promise<void> => {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const ITEMS: TjRailItem[] = [
  { label: 'Главное', href: '/main', value: 'main' },
  { label: 'Без значения', href: '/plain' },
  { label: 'Разборы', href: '/razbory', value: 'razbory' },
];

const mount = async (setup?: (el: TjRail) => void): Promise<TjRail> => {
  const el = new TjRail();
  if (setup) setup(el);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/**
 * The sheet node — in the shadow root while closed (and after re-home), on
 * <body> while open (the fixed fallback reparents it; happy-dom has no
 * popover API).
 */
const sheet = (el: TjRail): HTMLElement =>
  (el.shadowRoot?.querySelector('.sheet') ??
    document.querySelector('body > .sheet')) as HTMLElement;

const rows = (el: TjRail, scope: '.rail__list' | '.sheet__list' = '.rail__list') => {
  const root = scope === '.rail__list' ? el.shadowRoot : sheet(el);
  return Array.from(root?.querySelectorAll(`${scope} a.row`) ?? []);
};

const burger = (el: TjRail): HTMLButtonElement =>
  el.shadowRoot?.querySelector('button.burger') as HTMLButtonElement;

const scrim = (): HTMLElement | null => document.querySelector('.tj-sheet-scrim');

const heard: Array<{ value: boolean }> = [];
const heardDetails = (el: TjRail): void => {
  el.addEventListener(TjOpenChangeEvent.eventName, (event: Event) => {
    if (event instanceof TjOpenChangeEvent) heard.push(event.detail);
  });
};

afterEach(() => {
  heard.length = 0;
  document.body.innerHTML = '';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
});

describe('tj-rail — registration + structure', () => {
  it('registers as tj-rail exposing TjRail', async () => {
    await customElements.whenDefined('tj-rail');
    expect(customElements.get('tj-rail')).toBe(TjRail);
  });

  it('renders nav > ul > li > a with the landmark name and one row per item', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    const nav = el.shadowRoot?.querySelector('nav.rail');
    expect(nav?.getAttribute('aria-label')).toBe('Разделы');
    expect(nav?.querySelector('ul.rail__list li.rail__item a.row')).toBeTruthy();
    expect(rows(el).map((row) => row.textContent)).toEqual(['Главное', 'Без значения', 'Разборы']);
    expect(rows(el).map((row) => row.getAttribute('href'))).toEqual(['/main', '/plain', '/razbory']);
  });

  it('current-value marks EXACTLY the value-matching row; value-less rows never match', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.currentValue = 'razbory';
    });
    expect(
      rows(el)
        .filter((row) => row.getAttribute('aria-current') === 'page')
        .map((row) => row.textContent),
    ).toEqual(['Разборы']);

    el.currentValue = '/plain'; // href is NOT a value — matches nothing
    await elementUpdated(el);
    expect(rows(el).some((row) => row.hasAttribute('aria-current'))).toBe(false);
  });

  it('an unknown current-value marks nothing (graceful)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.currentValue = 'nowhere';
    });
    expect(rows(el).some((row) => row.hasAttribute('aria-current'))).toBe(false);
  });

  it('current-value: attribute writes update the render; removal renders clean (null-write guard)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('current-value', 'main');
    await elementUpdated(el);
    expect(rows(el).some((row) => row.getAttribute('aria-current') === 'page')).toBe(true);

    el.removeAttribute('current-value'); // Lit maps removal → null property write
    await elementUpdated(el);
    expect(rows(el).some((row) => row.hasAttribute('aria-current'))).toBe(false);
  });

  it('current-value never reflects (value data, §2)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.currentValue = 'main';
    await elementUpdated(el);
    expect(el.hasAttribute('current-value')).toBe(false);
  });

  it('items clamp: duplicate values drop, empty-string value normalizes away (dev warn)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const el = await mount((el) => {
      el.items = [
        { label: 'A', href: '/a', value: 'a' },
        { label: 'A-dup', href: '/a2', value: 'a' },
        { label: 'Empty', href: '/e', value: '' },
      ];
    });
    const rendered = rows(el);
    expect(rendered.map((row) => row.textContent)).toEqual(['A', 'Empty']);
    expect(rendered[1]?.getAttribute('aria-current')).toBeNull(); // '' can never be addressed
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('items is property-only: an items ATTRIBUTE is inert', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('items', 'main');
    await elementUpdated(el);
    expect(rows(el).length).toBe(3);
  });
});

describe('tj-rail — icon tiles', () => {
  it('a value-less row renders NO tile and NO slot (nothing to address)', async () => {
    const el = await mount((el) => {
      el.items = [{ label: 'Plain', href: '/plain' }];
    });
    expect(el.shadowRoot?.querySelector('.tile')).toBeNull();
    expect(el.shadowRoot?.querySelector("slot[name^='icon-']")).toBeNull();
  });

  it('a value row renders an aria-hidden tile that stays EMPTY-classed until slotted', async () => {
    const el = await mount((el) => {
      el.items = [{ label: 'Разборы', href: '/r', value: 'razbory' }];
    });
    const tile = el.shadowRoot?.querySelector('.tile');
    expect(tile?.getAttribute('aria-hidden')).toBe('true');
    expect(tile?.classList.contains('tile--empty'), 'nothing slotted → empty tile collapses').toBe(
      true,
    );

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('slot', 'icon-razbory');
    el.appendChild(icon);
    await settled(el);
    expect(
      el.shadowRoot?.querySelector('.tile')?.classList.contains('tile--empty'),
      'slotted → tile visible',
    ).toBe(false);

    icon.remove();
    await settled(el);
    expect(el.shadowRoot?.querySelector('.tile')?.classList.contains('tile--empty')).toBe(true);
  });

  it('the icon slot rides INSIDE the row anchor, aria-hidden from the accessible name', async () => {
    const el = await mount((el) => {
      el.items = [{ label: 'Разборы', href: '/r', value: 'razbory' }];
    });
    const icon = document.createElement('span');
    icon.setAttribute('slot', 'icon-razbory');
    el.appendChild(icon);
    await settled(el);
    const anchor = el.shadowRoot?.querySelector('a.row') as HTMLAnchorElement;
    expect(anchor.querySelector('.tile')).not.toBeNull();
    expect(anchor.querySelector(".tile slot[name='icon-razbory']")).not.toBeNull();
  });
});

describe('tj-rail — the drawer channel (open round-trip)', () => {
  it('the burger wires aria-expanded + aria-controls to the sheet dialog', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    const button = burger(el);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Разделы');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const controls = button.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(sheet(el).id).toBe(controls);
    expect(sheet(el).getAttribute('role')).toBe('dialog');
    expect(sheet(el).getAttribute('aria-modal')).toBe('true');
    expect(sheet(el).getAttribute('aria-label')).toBe('Разделы');
  });

  it('burger-label overrides the name; EMPTY falls back to the default (no nameless control)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.burgerLabel = 'Меню разделов';
    });
    expect(burger(el).getAttribute('aria-label')).toBe('Меню разделов');
    expect(sheet(el).getAttribute('aria-label')).toBe('Меню разделов');

    el.burgerLabel = '   ';
    await elementUpdated(el);
    expect(burger(el).getAttribute('aria-label')).toBe('Разделы');
  });

  it('burger toggle: open reflects on the host, aria-expanded flips, open-change fires each way', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    heardDetails(el);

    burger(el).click();
    await settled(el);
    expect(el.open).toBe(true);
    expect(el.hasAttribute('open'), 'reflected boolean').toBe(true);
    expect(burger(el).getAttribute('aria-expanded')).toBe('true');
    expect(sheet(el).hidden).toBe(false);
    expect(heard).toEqual([{ value: true }]);

    burger(el).click();
    await settled(el);
    expect(el.open).toBe(false);
    expect(el.hasAttribute('open')).toBe(false);
    expect(burger(el).getAttribute('aria-expanded')).toBe('false');
    expect(heard).toEqual([{ value: true }, { value: false }]);
  });

  it('the event class shape: eventName constant + CustomEvent identity (§9 grammar)', () => {
    expect(TjOpenChangeEvent.eventName).toBe('open-change');
    const event = new TjOpenChangeEvent(true);
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe('open-change');
    expect(event.detail).toEqual({ value: true });
  });

  it('PROGRAMMATIC open works (no burger click): helper mechanics engage — the any-viewport ruling', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.open = true;
    await settled(el);

    // happy-dom has no popover API: the fixed fallback runs — sheet on <body>,
    // z token inline, scrim present, scroll locked, trap armed.
    expect(sheet(el).parentElement).toBe(document.body);
    expect(sheet(el).style.zIndex).toBe('var(--tj-z-drawer)');
    expect(scrim()).not.toBeNull();
    expect(document.documentElement.style.overflow).toBe('hidden');

    // Trap armed: initial focus reached the first drawer link. While open the
    // sheet lives on <body> (light DOM) — happy-dom tracks the anchor
    // DIRECTLY as document.activeElement, no shadow hop.
    expect(document.activeElement).toBe(rows(el, '.sheet__list')[0]);

    el.open = false;
    await settled(el);
    expect(scrim()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('Esc closes: open-change(false), full teardown, sheet re-homed into the shadow root', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    heardDetails(el);
    el.open = true;
    await settled(el);

    const consumed = sheet(el).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(consumed).toBe(false); // preventDefault-ed
    await settled(el);
    expect(el.open).toBe(false);
    expect(heard).toEqual([{ value: true }, { value: false }]);
    expect(scrim()).toBeNull();
    // parentNode, not parentElement: a direct ShadowRoot child has a null
    // parentElement (ShadowRoot is not an Element) — the re-home target is
    // the root itself.
    expect(sheet(el).parentNode).toBe(el.shadowRoot, 're-homed after the fixed-path detach');
    expect(sheet(el).hidden).toBe(true);
  });

  it('a scrim click closes (the helper routes it back)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.open = true;
    await settled(el);
    scrim()?.click();
    await settled(el);
    expect(el.open).toBe(false);
    expect(scrim()).toBeNull();
  });

  it('a drawer LINK click closes (navigation itself stays the anchor own)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.open = true;
    await settled(el);
    rows(el, '.sheet__list')[0].click();
    await settled(el);
    expect(el.open).toBe(false);
  });

  it('close restores focus to the burger (explicit, even from programmatic open)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    burger(el).focus();
    el.open = true;
    await settled(el);
    expect(document.activeElement).not.toBe(burger(el)); // the trap moved it
    el.open = false;
    await settled(el);
    // The burger lives in the shadow root: happy-dom keeps
    // document.activeElement at the HOST and exposes the target via
    // shadowRoot.activeElement (probe-pinned).
    expect(el.shadowRoot?.activeElement).toBe(burger(el));
  });

  it('the drawer re-renders the same items + current marking (same data channel)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
      el.currentValue = 'main';
    });
    el.open = true;
    await settled(el);
    const drawerRows = rows(el, '.sheet__list');
    expect(drawerRows.map((row) => row.textContent)).toEqual(['Главное', 'Без значения', 'Разборы']);
    expect(
      drawerRows.filter((row) => row.getAttribute('aria-current') === 'page').map((r) => r.textContent),
    ).toEqual(['Главное']);
    expect(drawerRows[0]?.closest('.sheet')).not.toBeNull();
  });

  it('race guard: open→close within the mount window leaves NOTHING mounted', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.open = true;
    el.open = false; // closes before the awaited mount re-validates
    await settled(el);
    expect(el.open).toBe(false);
    expect(scrim(), 'no scrim leaked behind a closed state').toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
    expect(sheet(el).parentNode).toBe(el.shadowRoot);
  });

  it('MOUNT dispatches nothing and steals no focus (the first-update guard)', async () => {
    const events: boolean[] = [];
    const el = new TjRail();
    el.items = ITEMS;
    el.addEventListener(TjOpenChangeEvent.eventName, (event: Event) => {
      if (event instanceof TjOpenChangeEvent) events.push(event.detail.value);
    });
    document.body.appendChild(el);
    await settled(el);
    expect(events, 'Lit marks every prop changed on the FIRST update — that is initialization, not a transition').toEqual([]);
    expect(el.shadowRoot?.activeElement, 'the unmount path never runs at mount: no burger focus-steal').toBeNull();
  });

  it('a STAMPED open attribute mounts the sheet from first paint WITHOUT dispatching (lens 16.5 MAJOR)', async () => {
    const events: boolean[] = [];
    const el = new TjRail();
    el.items = ITEMS;
    el.setAttribute('open', ''); // stamped pre-connect: initialization, not a transition
    el.addEventListener(TjOpenChangeEvent.eventName, (event: Event) => {
      if (event instanceof TjOpenChangeEvent) events.push(event.detail.value);
    });
    document.body.appendChild(el);
    await settled(el);
    expect(el.hasAttribute('open'), 'reflected').toBe(true);
    expect(burger(el).getAttribute('aria-expanded')).toBe('true');
    expect(sheet(el).hidden).toBe(false);
    // The sheet IS owed from first paint — scrim, lock, trap all engaged:
    expect(scrim(), 'the stamped-open sheet mounts (the old guard skipped it)').not.toBeNull();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(sheet(el).style.zIndex).toBe('var(--tj-z-drawer)');
    // ...but initialization is not a transition: no open-change fired.
    expect(events).toEqual([]);
  });

  it('burger-label: a null write (attribute REMOVAL) falls back to the default without crashing (Lit null-write)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.setAttribute('burger-label', 'Меню разделов'); // attribute-sourced first
    await elementUpdated(el);
    expect(burger(el).getAttribute('aria-label')).toBe('Меню разделов');
    el.removeAttribute('burger-label'); // Lit maps removal → null property write
    await elementUpdated(el);
    expect(burger(el).getAttribute('aria-label'), 'null renders the default, never a crash').toBe('Разделы');
    expect(sheet(el).getAttribute('aria-label')).toBe('Разделы');
  });

  it('disconnect tears down quietly (no scrim, no lock, no throw)', async () => {
    const el = await mount((el) => {
      el.items = ITEMS;
    });
    el.open = true;
    await settled(el);
    expect(scrim()).not.toBeNull();
    el.remove();
    await settled(el);
    expect(scrim()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });
});

describe('tj-rail styles (css.ts pins)', () => {
  const cssText = railStyles.cssText;

  it('the rail column: the w290 token; rows are anchors with the nav-label species', () => {
    expect(cssText).toContain('width: var(--tj-space-rail-sidebar)');
    expect(cssText).toContain('font-size: var(--tj-text-nav-label-size)');
  });

  it('rows carry the FULL nav-label species at base; current marking is SEMANTIC-ONLY', () => {
    expect(cssText).toContain('font-size: var(--tj-text-nav-label-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-nav-label-weight)');
    expect(cssText, 'no weight delta may exist for current (the reference marks nothing)').not.toContain(
      ".row[aria-current='page']",
    );
    expect(cssText).not.toContain('text-decoration: underline');
  });

  it('the sheet re-asserts its geometry over the popover-UA base (border/height/margin resets)', () => {
    // UA [popover] paints border: solid + height: fit-content — without the
    // author-side resets the top-layer path renders a stray outline at
    // CONTENT height (the bank navbar.css mold, lens 16.5 MAJOR).
    expect(cssText).toContain('border: none');
    expect(cssText).toContain('height: auto');
    expect(cssText).toContain('margin: 0');
  });

  it('the icon tile: 40×40 box + icon-tile radius + 30px slotted visual; empty tiles collapse', () => {
    expect(cssText).toContain('width: 40px');
    expect(cssText).toContain('height: 40px');
    expect(cssText).toContain('border-radius: var(--tj-radius-icon-tile)');
    expect(cssText).toContain('width: 30px');
    expect(cssText).toContain('.tile--empty');
  });

  it('the burger: 44×44 floor, 40×40 chip via 2px insets, hidden ≥1200', () => {
    expect(cssText).toContain('width: 44px');
    expect(cssText).toContain('inset-block: 2px');
    expect(cssText).toContain('inset-inline: 2px');
    expect(cssText).toContain('@media (max-width: 1199px)');
    expect(cssText).toContain('display: none'); // pre-breakpoint burger
  });

  it('the sheet: full-height left sheet, token width + 86vw clamp, card ground, overlay shadow', () => {
    expect(cssText).toContain('position: fixed');
    expect(cssText).toContain('inset-block: 0');
    expect(cssText).toContain('width: min(var(--tj-space-rail-sidebar), 86vw)');
    expect(cssText).toContain('background: var(--tj-color-card)');
    expect(cssText).toContain('box-shadow: var(--tj-shadow-overlay)');
  });

  it('panel radius on the INNER vertical edge only (start corners stay flush)', () => {
    expect(cssText).toContain('border-start-end-radius: var(--tj-radius-panel)');
    expect(cssText).toContain('border-end-end-radius: var(--tj-radius-panel)');
    expect(cssText).not.toContain('border-start-start-radius');
    expect(cssText).not.toContain('border-end-start-radius');
  });

  it('ZERO z-index declarations — the overlay helper owns stacking (AD-12)', () => {
    expect(cssText).not.toContain('z-index');
  });

  it('NO hover state (unprobed — nothing invented)', () => {
    expect(cssText).not.toContain(':hover');
  });

  it('focus rings on row + burger (2px token ring, offset 2px)', () => {
    expect(cssText).toContain('.row:focus-visible');
    expect(cssText).toContain('.burger:focus-visible');
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
  });

  it('consumes ТЖ tokens only — zero --tk-* reads (FR-17 family isolation)', () => {
    expect(cssText).not.toContain('--tk-');
  });

  it('carries no theme branches (dark rides the token layer alone)', () => {
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toMatch(/prefers-color-scheme(?!.*reduce)/);
  });
});
