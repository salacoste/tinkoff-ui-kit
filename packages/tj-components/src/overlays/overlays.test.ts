// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountSheet, TJ_SHEET_SCRIM_CLASS } from './mount-sheet.js';
import { lockScroll, type TjScrollLockHandle } from './scroll-lock.js';
import { trapFocus, type TjFocusTrapHandle } from './focus-trap.js';

/**
 * ТЖ overlay helper unit tests (spec 16.5): the AD-12 minimal surface —
 * mountSheet (scrim + popover/fixed ladder), lockScroll (refcount +
 * scrollbar compensation), trapFocus (shadow-aware composed cycle + LIFO
 * restore). The bank mold (packages/components/src/overlays/
 * overlays.test.ts) translated to the ТЖ surface: happy-dom provides NO
 * popover/top-layer API and NO layout engine, so the popover path is
 * exercised via stubs and geometry is stubbed where asserted.
 */

/** Synthetic Tab keydown; returns false when the trap preventDefault-ed it. */
const pressTab = (element: Element, shift = false): boolean =>
  element.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true }),
  );

/** Per-test release registry — nothing leaks module state across tests. */
const cleanup: Array<() => void> = [];

afterEach(() => {
  while (cleanup.length > 0) {
    const release = cleanup.pop();
    if (release) release();
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

// --- happy-dom gap assertions (fail loudly on a tightening upgrade) -------

describe('happy-dom stub boundary (the bank 2.2 mold, ТЖ instance)', () => {
  it('provides NO native popover/top-layer API — popover tests below stub it', () => {
    const probe = document.createElement('div');
    expect(
      typeof probe.showPopover,
      'happy-dom gained popover support: replace the showPopover stubs below with the real API (or assert real promotion) instead of silently double-stubbing',
    ).not.toBe('function');
  });

  it('has NO layout engine — the lock compensation tests stub clientWidth', () => {
    expect(document.documentElement.clientWidth).toBe(0);
  });
});

// --- mountSheet -------------------------------------------------------------

describe('mountSheet', () => {
  it('mounts the scrim on <body> with fixed mechanics + the drawer z token, no literals', () => {
    const sheet = document.createElement('div');
    document.body.appendChild(sheet);
    const handle = mountSheet(sheet);
    cleanup.push(handle.release);

    expect(handle.strategy).toBe('fixed'); // happy-dom: no popover API
    const scrim = document.querySelector(`.${TJ_SHEET_SCRIM_CLASS}`) as HTMLElement | null;
    expect(scrim).not.toBeNull();
    expect(scrim?.parentElement).toBe(document.body);
    expect(scrim?.getAttribute('aria-hidden')).toBe('true');
    expect(scrim?.style.position).toBe('fixed');
    expect(scrim?.style.inset).toBe('0');
    expect(scrim?.style.zIndex).toBe('var(--tj-z-drawer)');
    // The themed 12% veil composes over the ink token (the skeleton-alpha
    // precedent) — no rgba literal, no cross-family var. happy-dom DROPS
    // inline color-mix() values (probe-pinned: the assignment parses to ''),
    // so the veil is pinned at the source level, the bank ZERO-BESPOKE
    // source-read mold.
    const moduleSource = readFileSync(
      join(process.cwd(), 'src', 'overlays', 'mount-sheet.ts'),
      'utf8',
    );
    expect(moduleSource).toContain(
      "color-mix(in srgb, var(--tj-color-ink-100) 12%, transparent)",
    );
  });

  it('fallback path: appends the sheet to <body> AFTER the scrim, fixed + z token, and restores everything on release', () => {
    const sheet = document.createElement('div');
    sheet.style.zIndex = '7';
    document.body.appendChild(sheet);
    const handle = mountSheet(sheet);

    expect(sheet.parentElement).toBe(document.body);
    expect(sheet.style.position).toBe('fixed');
    expect(sheet.style.zIndex).toBe('var(--tj-z-drawer)');
    // The scrim lands FIRST — at the equal z token, later DOM order paints
    // the sheet above the veil.
    const after = sheet.nextElementSibling === null;
    expect(after).toBe(true);
    expect(document.querySelectorAll(`.${TJ_SHEET_SCRIM_CLASS}`).length).toBe(1);

    handle.release();
    handle.release(); // idempotent
    expect(sheet.parentElement).toBeNull(); // detached, not stranded on <body>
    expect(sheet.style.zIndex).toBe('7'); // prior inline value restored
    expect(sheet.style.position).toBe('');
    expect(document.querySelector(`.${TJ_SHEET_SCRIM_CLASS}`)).toBeNull();
  });

  it('remounting the same sheet returns the live handle (one mount, one release)', () => {
    const sheet = document.createElement('div');
    document.body.appendChild(sheet);
    const first = mountSheet(sheet);
    const second = mountSheet(sheet);
    expect(second).toBe(first);
    expect(document.querySelectorAll(`.${TJ_SHEET_SCRIM_CLASS}`).length).toBe(1);
    first.release();
  });

  it('routes scrim clicks to the onScrimClick option (the helper owns the scrim)', () => {
    const sheet = document.createElement('div');
    document.body.appendChild(sheet);
    const heard = vi.fn();
    const handle = mountSheet(sheet, { onScrimClick: heard });
    const scrim = document.querySelector(`.${TJ_SHEET_SCRIM_CLASS}`) as HTMLElement;
    scrim.click();
    expect(heard).toHaveBeenCalledTimes(1);
    handle.release();
  });

  it('uses the popover path when the API is present (stubbed): manual promotion, NO DOM move, demote + attribute restore on release', () => {
    const sheet = document.createElement('div');
    sheet.id = 'stub-sheet';
    document.body.appendChild(sheet);
    const shown: string[] = [];
    const hidden: string[] = [];
    let popoverOpen = false;
    sheet.showPopover = () => {
      popoverOpen = true;
      shown.push(sheet.id);
    };
    sheet.hidePopover = () => {
      popoverOpen = false;
      hidden.push(sheet.id);
    };
    sheet.matches = ((selector: string) =>
      selector === ':popover-open' ? popoverOpen : false) as typeof sheet.matches;

    const parent = sheet.parentElement;
    const handle = mountSheet(sheet);
    cleanup.push(handle.release);

    expect(handle.strategy).toBe('popover');
    expect(shown).toEqual(['stub-sheet']);
    expect(sheet.getAttribute('popover')).toBe('manual');
    expect(sheet.parentElement).toBe(parent); // promotion is IN PLACE — shadow styles/slots stay intact

    handle.release();
    expect(hidden).toEqual(['stub-sheet']);
    expect(sheet.hasAttribute('popover')).toBe(false); // prior null restored
    expect(sheet.style.zIndex).toBe('');
  });

  it('falls back to the body append when showPopover throws (unconnected-style race)', () => {
    const sheet = document.createElement('div');
    document.body.appendChild(sheet);
    sheet.showPopover = () => {
      throw new Error('unconnected');
    };
    const handle = mountSheet(sheet);
    expect(handle.strategy).toBe('fixed');
    expect(sheet.parentElement).toBe(document.body);
    expect(sheet.hasAttribute('popover')).toBe(false); // the attempt was undone
    handle.release();
  });

  it('restores a pre-existing popover attribute on release (consumer popovers are never eaten)', () => {
    const sheet = document.createElement('div');
    sheet.setAttribute('popover', 'auto');
    document.body.appendChild(sheet);
    let open = false;
    sheet.showPopover = () => {
      open = true;
    };
    sheet.hidePopover = () => {
      open = false;
    };
    sheet.matches = ((selector: string) =>
      selector === ':popover-open' ? open : false) as typeof sheet.matches;
    const handle = mountSheet(sheet);
    handle.release();
    expect(sheet.getAttribute('popover')).toBe('auto');
  });
});

// --- lockScroll -------------------------------------------------------------

describe('lockScroll', () => {
  it('refcounts: two holders keep one lock; interleaved release keeps it; the last release restores', () => {
    const html = document.documentElement;
    const body = document.body;
    const first = lockScroll();
    const second = lockScroll();
    expect(html.style.overflow).toBe('hidden');
    expect(body.style.overflow).toBe('hidden');

    first.release();
    expect(html.style.overflow, 'one holder left: still locked').toBe('hidden');

    second.release();
    expect(html.style.overflow).toBe('');
    expect(body.style.overflow).toBe('');
  });

  it('double release is idempotent and never unlocks another holder early', () => {
    const first = lockScroll();
    const second = lockScroll();
    first.release();
    first.release(); // idempotent
    expect(document.documentElement.style.overflow).toBe('hidden');
    second.release();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('preserves the scrollbar gutter via padding compensation (measured before hiding)', () => {
    // No layout engine: stub the viewport math the way the bank suite does.
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 785,
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
    const html = document.documentElement;
    const handle = lockScroll();
    // 800 − 785 = 15px of scrollbar; composed onto the computed padding (0
    // in happy-dom) — the page does not reflow sideways while locked.
    expect(html.style.paddingRight).toBe('15px');
    handle.release();
    expect(html.style.paddingRight).toBe('');
  });

  it('is inert without a document (SSR edge — the REAL guards, stubbed globals)', () => {
    // Not a hand-made handle: the modules guard on document/window PRESENCE,
    // so the globals themselves are stubbed away and the guards run for real
    // (this rewrite caught mountSheet's SSR branch throwing ReferenceError on
    // the `document.createElement?.()` base access — fixed at the same round).
    const el = document.createElement('div'); // created while the DOM exists
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('window', undefined);
    try {
      const lock: TjScrollLockHandle = lockScroll();
      expect(() => lock.release()).not.toThrow();
      const trap: TjFocusTrapHandle = trapFocus(el);
      expect(() => trap.release()).not.toThrow();
      const sheet = mountSheet(el);
      expect(sheet.strategy).toBe('fixed');
      expect(() => sheet.release()).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

// --- trapFocus --------------------------------------------------------------

describe('trapFocus', () => {
  const mountFocusables = (): HTMLElement => {
    const container = document.createElement('div');
    const first = document.createElement('a');
    first.href = '#a';
    first.textContent = 'first';
    const middle = document.createElement('button');
    middle.textContent = 'middle';
    const last = document.createElement('a');
    last.href = '#b';
    last.textContent = 'last';
    container.append(first, middle, last);
    document.body.appendChild(container);
    return container;
  };

  it('focuses the first focusable on entry and restores the pre-trap target on release', () => {
    const outside = document.createElement('button');
    outside.textContent = 'trigger';
    document.body.appendChild(outside);
    outside.focus();
    const container = mountFocusables();
    const first = container.querySelector('a') as HTMLAnchorElement;

    const handle = trapFocus(container);
    cleanup.push(handle.release);
    expect(document.activeElement).toBe(first);

    handle.release();
    expect(document.activeElement, 'LIFO restore to the pre-trap target').toBe(outside);
  });

  it('cycles Tab forward from the last focusable back to the first', () => {
    const container = mountFocusables();
    const first = container.querySelector('a') as HTMLAnchorElement;
    const last = container.querySelectorAll('a, button')[2] as HTMLElement;
    const handle = trapFocus(container, { initialFocus: last });
    cleanup.push(handle.release);

    expect(pressTab(container), 'the wrap consumed the event').toBe(false);
    expect(document.activeElement).toBe(first);
  });

  it('cycles Shift+Tab from the first focusable back to the last', () => {
    const container = mountFocusables();
    const last = container.querySelectorAll('a, button')[2] as HTMLElement;
    const handle = trapFocus(container); // initial focus = first
    cleanup.push(handle.release);

    expect(pressTab(container, true)).toBe(false);
    expect(document.activeElement).toBe(last);
  });

  it('pulls focus back when it has ESCAPED the composed subtree (the shadow-aware catch)', () => {
    const container = mountFocusables();
    const handle = trapFocus(container);
    cleanup.push(handle.release);

    const escaped = document.createElement('button');
    escaped.textContent = 'outside';
    document.body.appendChild(escaped);
    escaped.focus();
    expect(pressTab(container)).toBe(false);
    expect(document.activeElement).toBe(container.querySelector('a'));

    escaped.remove();
  });

  it('traverses INTO open shadow roots (a shadow-hosted focusable joins the cycle)', () => {
    const container = document.createElement('div');
    const host = document.createElement('div');
    container.appendChild(host);
    document.body.appendChild(container);
    const shadowButton = document.createElement('button');
    shadowButton.textContent = 'shadow';
    host.attachShadow({ mode: 'open' }).appendChild(shadowButton);
    // One light-DOM focusable after the host, so the cycle order is
    // [shadowButton, tail] and the shadow hop is observable.
    const tail = document.createElement('a');
    tail.href = '#tail';
    container.appendChild(tail);

    const handle = trapFocus(container);
    cleanup.push(handle.release);
    // happy-dom keeps document.activeElement at the HOST and exposes the
    // shadow focus via shadowRoot.activeElement (probe-pinned); the trap's
    // own deepActiveElement pierces exactly this chain.
    expect(document.activeElement).toBe(host);
    expect(host.shadowRoot?.activeElement, 'initial focus reached INTO the shadow root').toBe(
      shadowButton,
    );

    handle.release();
  });

  it('zero focusables does NOT disable the trap — late content traps (listener armed)', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = trapFocus(container); // empty at trap time
    cleanup.push(handle.release);

    expect(document.activeElement).not.toBe(container); // placement skipped
    const late = document.createElement('a');
    late.href = '#late';
    container.appendChild(late);
    // Focus is outside the container — the armed listener pulls it back on
    // the next Tab.
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    expect(pressTab(container)).toBe(false);
    expect(document.activeElement).toBe(late);
    outside.remove();
  });

  it('only the INNERMOST trap cycles (LIFO nesting — the sheet-over-sheet case)', () => {
    const outer = mountFocusables();
    const outerHandle = trapFocus(outer);
    cleanup.push(outerHandle.release);

    const inner = mountFocusables();
    const innerHandle = trapFocus(inner);
    cleanup.push(innerHandle.release);

    // While both are armed, the OUTER listener must not fight the inner one:
    // a Tab dispatched in the outer container (not the trap top) passes
    // through unhandled by the outer trap.
    const outerLast = outer.querySelectorAll('a, button')[2] as HTMLElement;
    outerLast.focus();
    expect(pressTab(outer)).toBe(true); // NOT consumed by the outer trap
  });

  it('release is idempotent; a disconnected prior target is not yanked back', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const container = mountFocusables();
    const handle: TjFocusTrapHandle = trapFocus(container);
    handle.release();
    handle.release();
    expect(document.activeElement).toBe(trigger);

    const handleTwo = trapFocus(container);
    const firstAnchor = container.querySelector('a') as HTMLAnchorElement;
    trigger.remove(); // the pre-trap target leaves the DOM meanwhile
    handleTwo.release();
    // The disconnected trigger cannot be restored — focus stays where the
    // browser put it (the trap's initial placement), never yanked to null.
    expect(document.activeElement).toBe(firstAnchor);
  });
});
