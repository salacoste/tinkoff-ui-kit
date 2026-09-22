// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  computeFloatingPosition,
  enqueueToast,
  lockBodyScroll,
  mountOverlay,
  OVERLAY_CONTAINER_ID,
  positionFloating,
  TK_TOAST_MAX_VISIBLE,
  TOAST_STACK_ID,
  trapFocus,
  type TkOverlayLayer,
} from './index.js';

/**
 * Overlay controller unit suite (spec 2.2 + review patches): every I/O &
 * edge-case matrix row, cleanup/leak checks, the SSR no-op rows, and the
 * review-added coverage — shadow-aware focus trapping, lazy trap arming,
 * listener-leak proof, loud failures on garbage inputs, stranded-container
 * recovery, MutationObserver-driven toast host lifecycle, rAF-coalesced
 * repositioning, detached-anchor auto-release.
 *
 * happy-dom boundaries (spec Implementation Notes — asserted, not assumed):
 * happy-dom ships NO popover/top-layer API (`showPopover` undefined), no
 * layout engine (`getBoundingClientRect` → zeros, `clientWidth` → 0), and no
 * composed-event propagation across shadow boundaries (browsers DO deliver
 * shadow-internal keydowns to light ancestors). Each stubbed boundary is
 * asserted first — a future happy-dom that tightens these gaps fails the
 * gap tests loudly instead of testing nothing.
 */

// --- helpers -------------------------------------------------------------

/** Synthetic DOMRect — the only geometry source in this suite. */
const rect = (top: number, left: number, width: number, height: number): DOMRect =>
  ({
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as unknown as DOMRect;

const stubRect = (element: Element, value: DOMRect): void => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(value);
};

/** window.innerWidth/innerHeight are readonly in the DOM lib but settable here. */
const setViewport = (width: number, height: number): void => {
  (window as unknown as { innerWidth: number; innerHeight: number }).innerWidth = width;
  (window as unknown as { innerWidth: number; innerHeight: number }).innerHeight = height;
};

/** Synthetic Tab keydown; returns false when the trap preventDefault-ed it. */
const pressTab = (element: Element, shift = false): boolean =>
  element.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true }),
  );

/** MutationObserver callbacks are microtask-async — flush them. */
const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

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

describe('happy-dom stub boundary (spec 2.2 Implementation Notes)', () => {
  it('provides NO native popover/top-layer API — popover tests below stub it', () => {
    const probe = document.createElement('div');
    expect(
      typeof probe.showPopover,
      'happy-dom gained popover support: replace the showPopover stubs below with the real API (or assert real promotion) instead of silently double-stubbing',
    ).not.toBe('function');
    expect(typeof probe.appendToTopLayer).not.toBe('function');
  });

  it('has NO layout engine — geometry tests stub rects and viewport', () => {
    const probe = document.createElement('div');
    document.body.appendChild(probe);
    expect(probe.getBoundingClientRect().width).toBe(0);
    expect(document.documentElement.clientWidth).toBe(0);
  });

  it('does NOT propagate composed keydown across shadow boundaries (dispatch emulation note)', () => {
    const container = document.createElement('div');
    const host = document.createElement('div');
    container.appendChild(host);
    document.body.appendChild(container);
    const shadow = host.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    shadow.appendChild(button);
    let heard = false;
    container.addEventListener('keydown', () => {
      heard = true;
    });
    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(
      heard,
      'happy-dom started delivering shadow-internal keydowns to light ancestors (real browsers do): the shadow-trap tests may dispatch on the shadow element itself instead of the host',
    ).toBe(false);
  });
});

// --- mounting + z-order (controller.ts) -----------------------------------

describe('mountOverlay', () => {
  it('applies the layer z token, opts into interactivity, and reparents into the fallback container (every layer, zero literals)', () => {
    const layers = ['dropdown', 'popover', 'tooltip', 'modal', 'toast'] as const;
    for (const layer of layers) {
      const element = document.createElement('div');
      const handle = mountOverlay(element, layer as TkOverlayLayer);
      expect(element.style.zIndex, `layer ${layer}`).toBe(`var(--tk-z-${layer})`);
      expect(element.style.pointerEvents, `layer ${layer} opts in against the click-through host`).toBe('auto');
      expect(element.parentElement?.id).toBe(OVERLAY_CONTAINER_ID);
      handle.release();
      expect(element.style.pointerEvents, `layer ${layer} restores prior interactivity`).toBe('');
    }
  });

  it('fallback container unmounts with the last overlay; release is idempotent and restores styles', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const firstHandle = mountOverlay(first, 'modal');
    const secondHandle = mountOverlay(second, 'tooltip');
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).not.toBeNull();

    firstHandle.release();
    firstHandle.release(); // idempotent double release
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).not.toBeNull(); // second still mounted
    expect(first.parentElement).toBeNull(); // detached
    expect(first.style.zIndex).toBe(''); // snapshot restored

    secondHandle.release();
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull(); // container unmounted
  });

  it('remounting under the SAME layer returns the live handle (one mount, one release)', () => {
    const element = document.createElement('div');
    const handle = mountOverlay(element, 'dropdown');
    const again = mountOverlay(element, 'dropdown');
    expect(again).toBe(handle);
    handle.release();
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull();
  });

  it('throws on an unknown layer value (runtime garbage must be loud, not unstyled)', () => {
    const element = document.createElement('div');
    expect(() => mountOverlay(element, 'nonsense' as TkOverlayLayer)).toThrow(
      /unknown overlay layer 'nonsense'/,
    );
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull(); // nothing mounted
  });

  it('throws on remounting under a DIFFERENT layer (a silent z switch is a consumer bug)', () => {
    const element = document.createElement('div');
    const handle = mountOverlay(element, 'dropdown');
    expect(() => mountOverlay(element, 'modal')).toThrow(/already mounted as layer 'dropdown'/);
    expect(mountOverlay(element, 'dropdown')).toBe(handle); // same layer is still fine
    handle.release();
  });

  it('uses the popover path when the API is present (stubbed): manual promotion, no DOM move, interaction styles untouched, demote + attribute restore on release', () => {
    const element = document.createElement('div');
    const showPopover = vi.fn(() => undefined);
    const hidePopover = vi.fn(() => undefined);
    element.showPopover = showPopover;
    element.hidePopover = hidePopover;
    document.body.appendChild(element);

    const handle = mountOverlay(element, 'modal');
    expect(handle.strategy).toBe('popover');
    expect(showPopover).toHaveBeenCalledTimes(1);
    expect(element.getAttribute('popover')).toBe('manual'); // manual: no light-dismiss racing §9 open semantics
    expect(element.parentElement).toBe(document.body); // promoted in place — no DOM move
    expect(element.style.zIndex).toBe('var(--tk-z-modal)'); // token applied on both paths
    expect(element.style.pointerEvents).toBe(''); // popover path never touches consumer interaction styles

    // :popover-open is not implemented by the stub → release skips hidePopover
    // without throwing; force the open state to assert the demote call.
    vi.spyOn(element, 'matches').mockReturnValue(true);
    handle.release();
    expect(hidePopover).toHaveBeenCalledTimes(1);
    expect(element.hasAttribute('popover')).toBe(false); // absent before mount → absent after
    expect(element.parentElement).toBe(document.body); // untouched by release
  });

  it('falls back to the container when showPopover throws (unconnected element)', () => {
    const element = document.createElement('div');
    element.showPopover = vi.fn(() => {
      throw new DOMException('not connected', 'InvalidStateError');
    });

    const handle = mountOverlay(element, 'dropdown');
    expect(handle.strategy).toBe('container');
    expect(element.hasAttribute('popover')).toBe(false); // failed attempt rolled back
    expect(element.parentElement?.id).toBe(OVERLAY_CONTAINER_ID);
    handle.release();
  });

  it('restores a pre-existing popover attribute and prior inline styles on release', () => {
    const element = document.createElement('div');
    element.setAttribute('popover', 'auto'); // consumer-managed value
    element.style.zIndex = 'var(--tk-z-tooltip)'; // consumer-managed token
    element.showPopover = vi.fn(() => undefined);
    element.hidePopover = vi.fn(() => undefined);

    const handle = mountOverlay(element, 'modal');
    handle.release();
    expect(element.getAttribute('popover')).toBe('auto');
    expect(element.style.zIndex).toBe('var(--tk-z-tooltip)');
  });

  it('re-parents stranded surfaces when the container is externally removed', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const third = document.createElement('div');
    const firstHandle = mountOverlay(first, 'modal');
    const secondHandle = mountOverlay(second, 'tooltip');
    const oldContainer = document.getElementById(OVERLAY_CONTAINER_ID) as HTMLElement;
    oldContainer.remove(); // external teardown script removed it

    const thirdHandle = mountOverlay(third, 'dropdown');
    const freshContainer = document.getElementById(OVERLAY_CONTAINER_ID) as HTMLElement;
    expect(freshContainer).not.toBe(oldContainer);
    expect(first.parentElement, 'stranded surface recovered').toBe(freshContainer);
    expect(second.parentElement, 'stranded surface recovered').toBe(freshContainer);
    expect(third.parentElement).toBe(freshContainer);

    firstHandle.release();
    secondHandle.release();
    thirdHandle.release();
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull();
  });

  it('returns an inert handle when document exists but body does not (pre-body edge case)', () => {
    const element = document.createElement('div'); // created while the real document is live
    vi.stubGlobal('document', { body: null });
    const handle = mountOverlay(element, 'modal');
    expect(() => handle.release()).not.toThrow();
    vi.unstubAllGlobals();
    expect(element.style.zIndex).toBe(''); // the element was never touched
  });
});

// --- scroll-lock (scroll-lock.ts) — matrix row: simultaneous locks ---------

describe('lockBodyScroll', () => {
  const html = (): HTMLElement => document.documentElement;

  it('refcounts: two holders keep one lock; interleaved release keeps it; the last release restores', () => {
    const modalLock = lockBodyScroll();
    expect(html().style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');

    const drawerLock = lockBodyScroll(); // drawer over modal
    modalLock.release(); // first release — drawer still holds
    expect(html().style.overflow).toBe('hidden');

    const reentrantLock = lockBodyScroll(); // interleaved re-acquire
    drawerLock.release();
    expect(html().style.overflow).toBe('hidden'); // still held

    reentrantLock.release(); // the LAST holder
    expect(html().style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  it('double release is idempotent and never unlocks another holder early', () => {
    const first = lockBodyScroll();
    const second = lockBodyScroll();
    first.release();
    first.release(); // must not decrement twice
    expect(html().style.overflow).toBe('hidden'); // second still holds
    second.release();
    expect(html().style.overflow).toBe('');
  });

  it('preserves the scrollbar gutter via padding compensation (measured before hiding)', () => {
    setViewport(1024, 768);
    const restoreClientWidth = (() => {
      const target = html();
      const descriptor = Object.getOwnPropertyDescriptor(target, 'clientWidth');
      Object.defineProperty(target, 'clientWidth', { configurable: true, get: () => 1000 });
      return () => {
        delete (target as { clientWidth?: number }).clientWidth;
        if (descriptor) Object.defineProperty(target, 'clientWidth', descriptor);
      };
    })();
    const computedSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ paddingRight: '10px' } as CSSStyleDeclaration);

    const lock = lockBodyScroll();
    // scrollbar = innerWidth(1024) − clientWidth(1000) = 24, plus the 10px the
    // documentElement already carries → inline override never eats stylesheet padding.
    expect(html().style.paddingRight).toBe('34px');

    lock.release();
    expect(html().style.paddingRight).toBe(''); // snapshot restored exactly
    expect(computedSpy).toHaveBeenCalled();
    restoreClientWidth();
  });

  it('is a no-op without document/window (SSR)', () => {
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('window', undefined);
    const lock = lockBodyScroll();
    expect(() => lock.release()).not.toThrow();
  });
});

// --- positioning (positioning.ts) — matrix rows: flip + clamp --------------

describe('computeFloatingPosition (synthetic geometry)', () => {
  const viewport = { width: 1000, height: 800 };
  const floating = { width: 200, height: 100 };

  it('keeps the requested side when it fits', () => {
    const anchor = { top: 300, left: 400, width: 120, height: 40 };
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('bottom');
    expect(position.top).toBe(348); // 300 + 40 + 8
    expect(position.left).toBe(400); // edge-aligned with the anchor
  });

  it('flips bottom→top near the bottom edge', () => {
    const anchor = { top: 740, left: 400, width: 120, height: 40 }; // bottom edge 780
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('top');
    expect(position.top).toBe(632); // 740 − 8 − 100
  });

  it('flips top→bottom near the top edge', () => {
    const anchor = { top: 30, left: 400, width: 120, height: 40 };
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'top',
      offset: 8,
    });
    expect(position.placement).toBe('bottom');
    expect(position.top).toBe(78); // 30 + 40 + 8
  });

  it('flips right→left near the right edge', () => {
    const anchor = { top: 100, left: 920, width: 60, height: 40 }; // right edge 980
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'right',
      offset: 8,
    });
    expect(position.placement).toBe('left');
    expect(position.left).toBe(712); // 920 − 8 − 200
  });

  it('flips left→right near the left edge', () => {
    const anchor = { top: 100, left: 40, width: 60, height: 40 };
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'left',
      offset: 8,
    });
    expect(position.placement).toBe('right');
    expect(position.left).toBe(108); // 40 + 60 + 8
  });

  it('bottom-left corner: flips vertically AND clamps horizontally inside the viewport', () => {
    const anchor = { top: 740, left: -80, width: 120, height: 40 };
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('top');
    expect(position.top).toBe(632);
    expect(position.left).toBe(8); // −80 clamped to the viewport padding
  });

  it('bottom-right corner: flips vertically AND shifts the right overflow back inside', () => {
    const anchor = { top: 740, left: 950, width: 120, height: 40 }; // right edge 1070 > 1000
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('top');
    expect(position.left).toBe(792); // 1000 − 200 − 8
  });

  it('clamps an anchor hanging past the viewport edge (no flip needed vertically)', () => {
    const anchor = { top: 300, left: -50, width: 120, height: 40 };
    const position = computeFloatingPosition(anchor, floating, viewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('bottom'); // vertical side has room
    expect(position.left).toBe(8);
  });

  it('degenerate tiny viewport: keeps the requested side and pins best-effort (documented)', () => {
    const tinyViewport = { width: 300, height: 200 };
    const hugeFloating = { width: 500, height: 150 };
    const anchor = { top: 150, left: 100, width: 80, height: 40 };
    const position = computeFloatingPosition(anchor, hugeFloating, tinyViewport, {
      placement: 'bottom',
      offset: 8,
    });
    expect(position.placement).toBe('bottom'); // neither side fits → requested side kept
    expect(position.top).toBe(42); // 200 − 150 − 8 (max) < padding 8 (min) → min wins
    expect(position.left).toBe(8); // same degenerate pin on x
  });

  it('throws on an unknown placement (runtime garbage must be loud, not unpositioned)', () => {
    expect(() =>
      computeFloatingPosition({ top: 0, left: 0, width: 10, height: 10 }, floating, viewport, {
        placement: 'diagonal' as never,
      }),
    ).toThrow(/unknown placement 'diagonal'/);
  });
});

describe('positionFloating (DOM wiring)', () => {
  beforeEach(() => {
    // Auto-flushing rAF: scroll/resize repositions are frame-coalesced in the
    // implementation; these tests run each frame synchronously. The
    // coalescing itself is covered by its own test with a manual queue.
    vi.stubGlobal(
      'requestAnimationFrame',
      (callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      },
    );
    vi.stubGlobal('cancelAnimationFrame', () => undefined);
  });

  it('applies fixed coordinates, repositions on scroll and resize, stops after release (no leaked listeners)', () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));

    stubRect(anchor, rect(300, 400, 120, 40));
    const handle = positionFloating(surface, { anchor, placement: 'bottom', offset: 8 });
    cleanup.push(() => handle.release());
    expect(surface.style.position).toBe('fixed');
    expect(surface.style.top).toBe('348px');
    expect(surface.style.left).toBe('400px');
    expect(handle.placement).toBe('bottom');

    // Matrix row "Scroll during open": the anchor moved near the bottom edge;
    // a page scroll must reposition AND re-decide the flip.
    stubRect(anchor, rect(740, 400, 120, 40));
    window.dispatchEvent(new Event('scroll'));
    expect(handle.placement).toBe('top');
    expect(surface.style.top).toBe('632px');

    stubRect(anchor, rect(100, 100, 120, 40));
    window.dispatchEvent(new Event('resize'));
    expect(surface.style.top).toBe('148px');

    handle.release();
    expect(surface.style.top).toBe(''); // prior inline styles restored
    expect(surface.style.position).toBe('');

    stubRect(anchor, rect(740, 400, 120, 40));
    window.dispatchEvent(new Event('scroll'));
    expect(surface.style.top).toBe(''); // listener removed — no post-release movement
  });

  it('repositions on scrolls of nested containers too (capture-phase listener)', () => {
    setViewport(1000, 800);
    const scroller = document.createElement('div');
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    scroller.appendChild(anchor);
    document.body.append(scroller, surface);
    stubRect(surface, rect(0, 0, 200, 100));

    stubRect(anchor, rect(300, 400, 120, 40));
    const handle = positionFloating(surface, { anchor, placement: 'bottom', offset: 8 });
    cleanup.push(() => handle.release());
    expect(surface.style.top).toBe('348px');

    stubRect(anchor, rect(100, 400, 120, 40));
    scroller.dispatchEvent(new Event('scroll')); // scroll events do not bubble — capture must catch it
    expect(surface.style.top).toBe('148px');
  });

  it('coalesces a scroll/resize burst into ONE animation frame and cancels the pending frame on release', () => {
    setViewport(1000, 800);
    const pending: FrameRequestCallback[] = [];
    let nextId = 1;
    const cancelled: number[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
      pending.push(callback);
      return nextId++;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      cancelled.push(id);
    });

    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));
    stubRect(anchor, rect(300, 400, 120, 40));

    const handle = positionFloating(surface, { anchor, placement: 'bottom', offset: 8 });
    expect(surface.style.top).toBe('348px'); // the INITIAL placement stays synchronous

    stubRect(anchor, rect(100, 400, 120, 40));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(surface.style.top).toBe('348px'); // NOT yet repositioned — coalesced
    expect(pending, 'one frame for the whole burst').toHaveLength(1);

    for (const callback of pending.splice(0)) callback(0); // run the frame
    expect(surface.style.top).toBe('148px');

    window.dispatchEvent(new Event('scroll'));
    expect(pending).toHaveLength(1); // a new frame is scheduled…
    handle.release();
    expect(cancelled, 'release cancels the pending frame').toEqual([2]);
    for (const callback of pending.splice(0)) callback(0); // even if it somehow ran
    expect(surface.style.top).toBe(''); // released: reposition is inert
  });

  // --- matchAnchorWidth (Story 2.3 addition) -------------------------------

  it("matchAnchorWidth: true pins width BEFORE the floating rect is read (the clamp result proves the order), re-matches the live anchor, and restores on release", () => {
    setViewport(500, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    surface.style.width = '777px'; // prior inline width — must survive release
    // The surface rect DERIVES from the element's current inline width —
    // whatever the implementation has applied by measurement time is what
    // the geometry sees (natural width 100 before any match is applied).
    vi.spyOn(surface, 'getBoundingClientRect').mockImplementation(() =>
      rect(0, 0, Number.parseFloat(surface.style.width) || 100, 100),
    );

    // Anchor hangs past the right edge so the horizontal clamp BITES: with
    // the width applied first, floating measures 200 wide and left clamps
    // 300 → 292 (500 − 200 − 8); measuring before applying (the reorder this
    // test pins out) reads the natural 100 and leaves left at 300.
    stubRect(anchor, rect(400, 300, 200, 40)); // top 400, left 300 → right edge 500 = viewport edge
    const handle = positionFloating(surface, { anchor, placement: 'bottom', matchAnchorWidth: true });
    cleanup.push(() => handle.release());
    expect(surface.style.width, 'width pinned to the anchor').toBe('200px');
    expect(surface.style.left, 'clamp computed against the MATCHED width — order pinned').toBe('292px');
    expect(surface.style.top).toBe('440px');

    // Anchor widened (a relayout between events): the next reposition — here
    // scroll-triggered — re-matches from the LIVE rect and re-clamps.
    stubRect(anchor, rect(400, 60, 260, 40));
    window.dispatchEvent(new Event('scroll'));
    expect(surface.style.width).toBe('260px');
    expect(surface.style.left, '500 − 260 − 8 = 232 stays inside; 60 needs no clamp').toBe('60px');

    handle.release();
    expect(surface.style.width, 'prior inline width restored').toBe('777px');
    // And no post-release re-application on further events.
    window.dispatchEvent(new Event('resize'));
    expect(surface.style.width).toBe('777px');
  });

  it("matchAnchorWidth: 'min' pins only min-width — the surface may grow past the anchor", () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));

    stubRect(anchor, rect(300, 400, 120, 40));
    const handle = positionFloating(surface, { anchor, placement: 'bottom', matchAnchorWidth: 'min' });
    cleanup.push(() => handle.release());
    expect(surface.style.minWidth).toBe('120px');
    expect(surface.style.width, 'width untouched under min — growth stays consumer-CSS').toBe('');

    handle.release();
    expect(surface.style.minWidth).toBe('');
  });

  it('without matchAnchorWidth neither width nor min-width is ever touched', () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));
    stubRect(anchor, rect(300, 400, 120, 40));
    const handle = positionFloating(surface, { anchor, placement: 'bottom' });
    cleanup.push(() => handle.release());
    expect(surface.style.width).toBe('');
    expect(surface.style.minWidth).toBe('');
  });

  it('matchAnchorWidth garbage throws loudly on first application (module style)', () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));
    stubRect(anchor, rect(300, 400, 120, 40));
    expect(() =>
      positionFloating(surface, {
        anchor,
        // @ts-expect-error — runtime garbage, exactly what the guard is for
        matchAnchorWidth: 'max',
      }),
    ).toThrow(/matchAnchorWidth/);
  });

  it('auto-releases when the anchor leaves the DOM (a detached anchor would clamp to the corner)', () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(surface, rect(0, 0, 200, 100));
    stubRect(anchor, rect(300, 400, 120, 40));

    const handle = positionFloating(surface, { anchor, placement: 'bottom', offset: 8 });
    expect(surface.style.top).toBe('348px');

    anchor.remove();
    handle.reposition(); // detached anchor detected → auto-release
    expect(surface.style.top).toBe(''); // prior styles restored, surface let go
    expect(handle.placement).toBe('bottom'); // inert getter, no crash

    document.body.appendChild(anchor); // even a reconnected anchor must not revive it
    stubRect(anchor, rect(300, 400, 120, 40));
    handle.reposition();
    expect(surface.style.top).toBe(''); // post-release reposition is a no-op
  });

  it('double release is idempotent', () => {
    setViewport(1000, 800);
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    document.body.append(anchor, surface);
    stubRect(anchor, rect(300, 400, 120, 40));
    stubRect(surface, rect(0, 0, 200, 100));
    const handle = positionFloating(surface, { anchor });
    handle.release();
    expect(() => handle.release()).not.toThrow();
  });

  it('is inert without window (SSR)', () => {
    const anchor = document.createElement('div');
    const surface = document.createElement('div');
    vi.stubGlobal('window', undefined);
    const handle = positionFloating(surface, { anchor, placement: 'top' });
    expect(handle.placement).toBe('top');
    expect(() => {
      handle.reposition();
      handle.release();
    }).not.toThrow();
    expect(surface.style.top).toBe(''); // nothing was applied
  });
});

// --- toast queue (toast-queue.ts) — matrix row: overflow -------------------

describe('enqueueToast', () => {
  const hostChildren = (): Element[] => {
    const hostElement = document.getElementById(TOAST_STACK_ID);
    expect(hostElement, 'stacking host exists while toasts are visible').not.toBeNull();
    return Array.from((hostElement as HTMLElement).children);
  };

  it(`caps at ${TK_TOAST_MAX_VISIBLE} visible: the 4th collapses the OLDEST; order stays stable after dismissals`, () => {
    const surfaces = [0, 1, 2, 3, 4].map(() => document.createElement('div'));
    const collapsed: HTMLElement[] = [];

    const first = enqueueToast({
      element: surfaces[0] as HTMLElement,
      onCollapse: (element) => collapsed.push(element),
    });
    cleanup.push(() => first.dismiss());
    const second = enqueueToast({ element: surfaces[1] as HTMLElement });
    cleanup.push(() => second.dismiss());
    const third = enqueueToast({ element: surfaces[2] as HTMLElement });
    cleanup.push(() => third.dismiss());

    expect(hostChildren()).toEqual(surfaces.slice(0, 3));

    const fourth = enqueueToast({ element: surfaces[3] as HTMLElement });
    cleanup.push(() => fourth.dismiss());
    expect(collapsed).toEqual([surfaces[0]]); // overflow collapsed the oldest
    // With onCollapse the instance owns the element's exit: emulate the exit
    // animation completing (the instance removes the surface itself).
    (surfaces[0] as HTMLElement).remove();
    expect(hostChildren()).toEqual(surfaces.slice(1, 4)); // order stable, no reshuffle

    second.dismiss();
    expect(hostChildren()).toEqual([surfaces[2], surfaces[3]]);
    second.dismiss(); // idempotent double dismiss
    expect(hostChildren()).toEqual([surfaces[2], surfaces[3]]);

    const fifth = enqueueToast({ element: surfaces[4] as HTMLElement });
    cleanup.push(() => fifth.dismiss());
    expect(hostChildren()).toEqual(surfaces.slice(2, 5)); // room existed — no collapse

    for (const release of [...cleanup]) release();
    cleanup.length = 0;
    expect(document.getElementById(TOAST_STACK_ID)).toBeNull(); // host torn down
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull(); // overlay container unused → gone
  });

  it('default collapse (no onCollapse) removes the element from the host immediately', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const third = document.createElement('div');
    const fourth = document.createElement('div');
    const firstHandle = enqueueToast({ element: first });
    const secondHandle = enqueueToast({ element: second });
    const thirdHandle = enqueueToast({ element: third });
    cleanup.push(() => firstHandle.dismiss(), () => secondHandle.dismiss(), () => thirdHandle.dismiss());

    const fourthHandle = enqueueToast({ element: fourth });
    cleanup.push(() => fourthHandle.dismiss());
    expect(first.parentElement).toBeNull(); // collapsed away from the host
    expect(hostChildren()).toEqual([second, third, fourth]);
    // the collapsed toast's stale handle stays a no-op
    expect(() => firstHandle.dismiss()).not.toThrow();
  });

  it('prunes entries whose instance already removed itself (auto-dismiss outside the queue)', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const firstHandle = enqueueToast({ element: first });
    const secondHandle = enqueueToast({ element: second });
    cleanup.push(() => firstHandle.dismiss(), () => secondHandle.dismiss());

    first.remove(); // the instance's own timer removed the element
    const third = document.createElement('div');
    const thirdHandle = enqueueToast({ element: third }); // re-evaluates → prunes first
    cleanup.push(() => thirdHandle.dismiss());

    expect(hostChildren()).toEqual([second, third]);
    expect(TK_TOAST_MAX_VISIBLE).toBe(3);
  });

  it('host is torn down once every instance self-removes (MutationObserver lifecycle, no queue calls)', async () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    enqueueToast({ element: first });
    enqueueToast({ element: second });
    expect(document.getElementById(TOAST_STACK_ID)).not.toBeNull();

    first.remove(); // both instances auto-dismiss their own elements
    second.remove();
    await tick(); // observer callbacks are microtask-async

    expect(document.getElementById(TOAST_STACK_ID)).toBeNull(); // host torn down
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull(); // mount released, container gone
  });

  it('a still-animating collapsed toast keeps the host mounted until its instance removes it', async () => {
    const collapsed = document.createElement('div');
    const second = document.createElement('div');
    const third = document.createElement('div');
    const fourth = document.createElement('div');
    const collapsedHandle = enqueueToast({
      element: collapsed,
      onCollapse: () => undefined, // exit animation: the element STAYS for now
    });
    const secondHandle = enqueueToast({ element: second });
    const thirdHandle = enqueueToast({ element: third });
    const fourthHandle = enqueueToast({ element: fourth }); // overflow → collapse `collapsed`

    expect(collapsed.parentElement?.id).toBe(TOAST_STACK_ID); // animating, still hosted

    secondHandle.dismiss();
    thirdHandle.dismiss();
    fourthHandle.dismiss(); // stack is now empty — but the collapsed element still animates
    await tick();
    expect(document.getElementById(TOAST_STACK_ID)).not.toBeNull(); // host kept for the animation
    expect(collapsed.isConnected).toBe(true); // not detached early

    collapsed.remove(); // exit animation finished
    await tick();
    expect(document.getElementById(TOAST_STACK_ID)).toBeNull(); // NOW torn down
    expect(() => collapsedHandle.dismiss()).not.toThrow(); // stale handle stays a no-op
  });

  it('releases the stale host mount when the host was externally disconnected', async () => {
    const first = document.createElement('div');
    enqueueToast({ element: first });
    const firstHost = document.getElementById(TOAST_STACK_ID) as HTMLElement;

    firstHost.remove(); // external removal
    const second = document.createElement('div');
    const secondHandle = enqueueToast({ element: second }); // recreates, releasing the stale mount
    cleanup.push(() => secondHandle.dismiss());

    const secondHost = document.getElementById(TOAST_STACK_ID) as HTMLElement;
    expect(secondHost).not.toBe(firstHost);
    expect(second.parentElement).toBe(secondHost);
    expect(document.querySelectorAll(`#${TOAST_STACK_ID}`)).toHaveLength(1); // no duplicate host

    second.remove(); // full teardown still works through the new mount
    await tick();
    expect(document.getElementById(TOAST_STACK_ID)).toBeNull();
    expect(document.getElementById(OVERLAY_CONTAINER_ID)).toBeNull();
  });

  it('mounts the host through the overlay controller with the toast z token', () => {
    const surface = document.createElement('div');
    const handle = enqueueToast({ element: surface });
    cleanup.push(() => handle.dismiss());
    const hostElement = document.getElementById(TOAST_STACK_ID) as HTMLElement;
    expect(hostElement.style.zIndex).toBe('var(--tk-z-toast)');
    expect(surface.parentElement).toBe(hostElement);
  });

  it('is a no-op without document (SSR)', () => {
    const surface = document.createElement('div'); // created BEFORE the stub
    vi.stubGlobal('document', undefined);
    const handle = enqueueToast({ element: surface });
    expect(() => handle.dismiss()).not.toThrow();
  });

  it('is inert without document.body (pre-body edge case)', () => {
    const surface = document.createElement('div'); // created BEFORE the stub
    vi.stubGlobal('document', { body: null });
    const handle = enqueueToast({ element: surface });
    expect(() => handle.dismiss()).not.toThrow();
  });
});

// --- focus trap (focus-trap.ts) — matrix row: focus cycle ------------------

describe('trapFocus', () => {
  const buildTrapDom = (): {
    outside: HTMLButtonElement;
    container: HTMLDivElement;
    first: HTMLButtonElement;
    middle: HTMLInputElement;
    last: HTMLButtonElement;
  } => {
    const outside = document.createElement('button');
    const container = document.createElement('div');
    const first = document.createElement('button');
    const middle = document.createElement('input');
    const last = document.createElement('button');
    container.append(first, middle, last);
    document.body.append(outside, container);
    return { outside, container, first, middle, last };
  };

  it('places initial focus, cycles Tab/Shift-Tab within, and restores the prior target on release', () => {
    const { outside, container, first, middle, last } = buildTrapDom();
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const trap = trapFocus(container);
    cleanup.push(() => trap.release());
    expect(document.activeElement).toBe(first); // initial focus placement

    last.focus(); // real Tab fires on the FOCUSED element
    expect(pressTab(last)).toBe(false); // boundary: preventDefault + wrap forward
    expect(document.activeElement).toBe(first);

    middle.focus();
    expect(pressTab(middle)).toBe(true); // middle: natural order — not intercepted
    expect(document.activeElement).toBe(middle);

    first.focus();
    expect(pressTab(first, true)).toBe(false); // boundary: preventDefault + wrap backward
    expect(document.activeElement).toBe(last);

    trap.release();
    expect(document.activeElement).toBe(outside); // restored
  });

  it('pulls focus back when it escaped the container before a Tab', () => {
    const { outside, container, first, middle } = buildTrapDom();
    const trap = trapFocus(container);
    cleanup.push(() => trap.release());
    outside.focus(); // focus escaped programmatically
    expect(pressTab(middle)).toBe(false);
    expect(document.activeElement).toBe(first); // pulled back to the leading end
  });

  it('zero focusables does NOT disable the trap: the listener is armed and lazily-arriving content cycles', () => {
    const outside = document.createElement('button');
    const container = document.createElement('div');
    document.body.append(outside, container);
    outside.focus();

    const trap = trapFocus(container); // EMPTY — the listener installs anyway
    cleanup.push(() => trap.release());
    expect(document.activeElement).toBe(outside); // placement skipped — no focus steal
    expect(pressTab(container)).toBe(true); // nothing to intercept while empty

    const first = document.createElement('button'); // async modal content arrives
    const second = document.createElement('button');
    container.append(first, second);
    second.focus();
    expect(pressTab(second)).toBe(false); // the armed trap now cycles
    expect(document.activeElement).toBe(first);

    trap.release();
    expect(document.activeElement).toBe(outside); // restore still works
  });

  it('cycles focusables that live inside a nested shadow root (shadow-aware traversal)', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const container = document.createElement('div');
    const host = document.createElement('div'); // plain host — NOT focusable itself
    container.appendChild(host);
    document.body.appendChild(container);
    const shadow = host.attachShadow({ mode: 'open' });
    const shadowFirst = document.createElement('button');
    const shadowMiddle = document.createElement('input');
    const shadowLast = document.createElement('button');
    shadow.append(shadowFirst, shadowMiddle, shadowLast);
    outside.focus();

    const trap = trapFocus(container);
    cleanup.push(() => trap.release());
    // Initial placement reaches THROUGH the shadow boundary…
    expect(host.shadowRoot?.activeElement).toBe(shadowFirst);

    // …and so does the cycle. happy-dom does not propagate shadow-internal
    // keydowns to light ancestors (asserted in the boundary suite above), so
    // the Tab is dispatched on the host — exactly the retargeted form real
    // browsers deliver to the container listener.
    shadowLast.focus();
    expect(pressTab(host)).toBe(false); // boundary at the shadow's last → wrap
    expect(host.shadowRoot?.activeElement).toBe(shadowFirst);

    shadowFirst.focus();
    expect(pressTab(host, true)).toBe(false); // Shift-Tab at the shadow's first → wrap back
    expect(host.shadowRoot?.activeElement).toBe(shadowLast);

    shadowMiddle.focus();
    expect(pressTab(host)).toBe(true); // middle of the shadow widget: NOT intercepted — no yank
    expect(host.shadowRoot?.activeElement).toBe(shadowMiddle);

    trap.release();
    expect(document.activeElement).toBe(outside); // restored across the boundary
  });

  it('respects an already-consumed Tab (a consumer handler that handled it wins)', () => {
    const { container, first, last } = buildTrapDom();
    const consumer = (event: Event): void => {
      event.preventDefault();
    };
    container.addEventListener('keydown', consumer); // registered before the trap
    const trap = trapFocus(container);
    cleanup.push(() => trap.release());
    first.focus();
    last.focus();
    expect(pressTab(last)).toBe(false); // preventDefault-ed — by the CONSUMER
    expect(document.activeElement).toBe(last); // the trap did not wrap
  });

  it('release removes the container keydown listener (leak proof)', () => {
    const { container } = buildTrapDom();
    const added: Array<[string, EventListener]> = [];
    const removed: Array<[string, EventListener]> = [];
    vi.spyOn(container, 'addEventListener').mockImplementation(
      ((type: string, listener: EventListener) => {
        added.push([type, listener]);
      }) as unknown as typeof container.addEventListener,
    );
    vi.spyOn(container, 'removeEventListener').mockImplementation(
      ((type: string, listener: EventListener) => {
        removed.push([type, listener]);
      }) as unknown as typeof container.removeEventListener,
    );

    const trap = trapFocus(container);
    expect(added).toHaveLength(1);
    expect(added[0]?.[0]).toBe('keydown');

    trap.release();
    expect(removed).toHaveLength(1);
    expect(removed[0]?.[0]).toBe('keydown');
    expect(removed[0]?.[1]).toBe(added[0]?.[1]); // the SAME handler reference — not a stray
  });

  it('explicit initialFocus wins over the first focusable', () => {
    const { container, first, middle } = buildTrapDom();
    const trap = trapFocus(container, { initialFocus: middle });
    cleanup.push(() => trap.release());
    expect(document.activeElement).toBe(middle);
    expect(document.activeElement).not.toBe(first);
  });

  it('nested traps: only the innermost cycles; release order restores LIFO', () => {
    const { outside, container } = buildTrapDom();
    const inner = document.createElement('div');
    const innerFirst = document.createElement('button');
    const innerLast = document.createElement('button');
    const outerLast = container.querySelector('button:last-of-type') as HTMLButtonElement;
    inner.append(innerFirst, innerLast);
    container.appendChild(inner);
    outside.focus();

    const outerTrap = trapFocus(container); // focuses container's first button
    const innerTrap = trapFocus(inner); // focuses innerFirst
    cleanup.push(() => innerTrap.release(), () => outerTrap.release());
    expect(document.activeElement).toBe(innerFirst);

    // The event bubbles through BOTH listeners; only the inner trap acts.
    innerLast.focus(); // Tab fires on the focused element
    expect(pressTab(innerLast)).toBe(false);
    expect(document.activeElement).toBe(innerFirst);

    innerTrap.release();
    inner.remove(); // the inner surface closes with its trap (consumer flow)
    const outerFirst = container.querySelector('button') as HTMLButtonElement;
    expect(document.activeElement).toBe(outerFirst); // restored into the outer trap

    // Inner released → the outer trap cycles again.
    outerLast.focus();
    expect(pressTab(outerLast)).toBe(false);
    expect(document.activeElement).toBe(outerFirst);
  });

  it('double release is idempotent; disabled controls are never focusable', () => {
    const { container, first } = buildTrapDom();
    const disabled = document.createElement('button');
    disabled.setAttribute('disabled', '');
    container.appendChild(disabled);
    const trap = trapFocus(container);
    trap.release();
    expect(() => trap.release()).not.toThrow();
    expect(document.activeElement).not.toBe(disabled);
    expect(document.activeElement).not.toBe(first);
  });

  it('is an inert no-op handle without document (SSR)', () => {
    const container = document.createElement('div'); // created BEFORE the stub
    vi.stubGlobal('document', undefined);
    const handle = trapFocus(container);
    expect(() => handle.release()).not.toThrow();
  });
});
