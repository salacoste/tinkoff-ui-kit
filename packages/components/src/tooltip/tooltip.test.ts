// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TkTooltip, TK_TOOLTIP_DELAY_MS } from './tooltip.js';

/**
 * tk-tooltip unit tests (spec 4.2): the tooltip rows of the I/O & edge-case
 * matrix — show (hover AND focus after 300ms; leave/blur before the delay
 * cancels), dismiss (Esc / pointerleave / blur — immediate, timer
 * cancelled), touch parity (click toggles), viewport-edge flip (via
 * getBoundingClientRect stubs at each edge, the overlays-suite mold),
 * focusables-impossible-by-construction (prop-only content; the surface
 * never focusable), describedby wiring (set on the slotted trigger, restored
 * on disconnect), the icon-only-trigger dev-warn, the placement clamp, the
 * open-change event (flip-only, composed), disconnect teardown, and the
 * zero-bespoke-mechanics structural pin.
 *
 * happy-dom boundaries (the molds' rule): no popover API (controller falls
 * back to the overlay container — asserted via its DOM effects), no layout
 * engine (geometry is stubbed per test), no animation engine.
 */

const elementUpdated = (el: TkTooltip): Promise<unknown> => el.updateComplete;

let warnSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// --- geometry stubs (the overlays-suite mold) --------------------------------

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

const setViewport = (width: number, height: number): void => {
  (window as unknown as { innerWidth: number; innerHeight: number }).innerWidth = width;
  (window as unknown as { innerWidth: number; innerHeight: number }).innerHeight = height;
};

// --- mount helpers ---------------------------------------------------------------

type MountOptions = {
  props?: Partial<InstanceType<typeof TkTooltip>>;
  attributes?: Record<string, string>;
  trigger?: string;
};

const mount = async ({ props, attributes, trigger }: MountOptions = {}): Promise<TkTooltip> => {
  const el = new TkTooltip();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (trigger !== undefined) el.innerHTML = trigger;
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  // firstUpdated created the surface; slotchange wired the trigger.
  return el;
};

const triggerOf = (el: TkTooltip): HTMLElement => {
  const trigger = el.querySelector('button, a, span, div');
  expect(trigger, 'the slotted trigger renders').not.toBeNull();
  return trigger as HTMLElement;
};

/** The generated surface — shadow tree while closed, overlay container while open. */
const surfaceOf = (el: TkTooltip): HTMLDivElement => {
  const inTree = el.shadowRoot?.querySelector('[role="tooltip"]');
  if (inTree instanceof HTMLDivElement) return inTree;
  const moved = document.querySelector('#tk-overlay-root > [role="tooltip"]');
  expect(moved, 'the surface exists (shadow tree or overlay container)').toBeInstanceOf(
    HTMLDivElement,
  );
  return moved as HTMLDivElement;
};

const pointerOver = (el: TkTooltip): void => {
  el.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
};

const pointerOutTo = (el: TkTooltip, relatedTarget: Node | null): void => {
  const event = new Event('pointerout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  el.dispatchEvent(event);
};

const focusOutTo = (el: TkTooltip, relatedTarget: Node | null): void => {
  const event = new Event('focusout', { bubbles: true, composed: true });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  el.dispatchEvent(event);
};

const collectOpenStates = (el: TkTooltip): boolean[] => {
  const states: boolean[] = [];
  el.addEventListener('open-change', (event: Event) => {
    states.push((event as CustomEvent<{ value: boolean }>).detail.value);
  });
  return states;
};

describe('tk-tooltip', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('registers as tk-tooltip exposing TkTooltip', async () => {
    await customElements.whenDefined('tk-tooltip');
    expect(customElements.get('tk-tooltip')).toBe(TkTooltip);
  });

  it('the mount-time open-change guard: NO event on first paint, closed OR open-attr (listener attached BEFORE connect)', async () => {
    // The guard's own regression, made loud (fix-round finding: a listener
    // attached after mount cannot catch a first-paint dispatch). The same
    // Lit first-update change-map shape as tk-select/tk-modal.
    const closed = new TkTooltip();
    closed.innerHTML = '<button type="button">Триггер</button>';
    const closedStates = collectOpenStates(closed);
    document.body.appendChild(closed);
    await elementUpdated(closed);
    expect(closedStates).toEqual([]);

    const opened = new TkTooltip();
    opened.innerHTML = '<button type="button">Триггер</button>';
    opened.setAttribute('open', '');
    const openedStates = collectOpenStates(opened);
    document.body.appendChild(opened);
    await elementUpdated(opened);
    expect(openedStates, 'the declarative open mounts but never dispatches').toEqual([]);
  });

  it('renders the slotted trigger and the eager hidden surface with describedby wired', async () => {
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    const trigger = triggerOf(el);
    const surface = surfaceOf(el);
    // Eager creation (axe validates the idref while hidden — the select mold).
    expect(surface.getAttribute('role')).toBe('tooltip');
    expect(surface.hidden).toBe(true);
    expect(trigger.getAttribute('aria-describedby')).toBe(surface.id);
    // The surface is non-focusable by construction: no tabindex anywhere.
    expect(surface.hasAttribute('tabindex')).toBe(false);
    // Placement default reflects; content prop never reflects.
    expect(el.getAttribute('placement')).toBe('top');
    expect(el.hasAttribute('content')).toBe(false);
  });

  it('invalid placement clamps to top with the reflected attribute corrected', async () => {
    const el = await mount({
      attributes: { placement: 'sideways' },
      trigger: '<button type="button">Триггер</button>',
    });
    expect(el.placement).toBe('top');
    expect(el.getAttribute('placement')).toBe('top');
    for (const valid of ['top', 'bottom', 'left', 'right'] as const) {
      el.placement = valid;
      await elementUpdated(el);
      expect(el.getAttribute('placement')).toBe(valid);
    }
  });

  // --- Matrix row: show -----------------------------------------------------------

  it('pointerenter opens after the 300ms delay: controller-mounted, positioned, describedby live, open-change(true)', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    const states = collectOpenStates(el);
    pointerOver(el);
    expect(el.open).toBe(false); // still inside the delay window
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);

    expect(el.open).toBe(true);
    expect(states).toEqual([true]);
    const surface = surfaceOf(el);
    expect(surface.hidden).toBe(false);
    expect(surface.parentElement?.id).toBe('tk-overlay-root');
    expect(surface.style.zIndex).toBe('var(--tk-z-tooltip)');
    expect(surface.style.position).toBe('fixed'); // positionFloating inline
    expect((surface.shadowRoot?.textContent ?? '')).toContain('Подсказка');
  });

  it('focusin opens after the same delay (hover is never the only path)', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    triggerOf(el).dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);
    expect(el.open).toBe(true);
  });

  it('leaving before the delay cancels the pending open', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    pointerOver(el);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS - 100);
    pointerOutTo(el, null);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);
    expect(el.open, 'the timer was cancelled — no late open').toBe(false);
  });

  // --- Matrix row: dismiss -----------------------------------------------------------

  it('pointerleave closes immediately (mid-open), cancelling any pending timer', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    pointerOver(el);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);
    expect(el.open).toBe(true);
    pointerOutTo(el, null);
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(surfaceOf(el).hidden).toBe(true);
    // The unmounted surface re-homed into the shadow tree (next open valid).
    expect(el.shadowRoot?.contains(surfaceOf(el))).toBe(true);
  });

  it('focusout closes; pointerout to a node inside the component does NOT', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    triggerOf(el).dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);
    pointerOutTo(el, el); // relatedTarget inside — stays open
    expect(el.open).toBe(true);
    focusOutTo(el, null);
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  it('Esc closes immediately and cancels a pending timer; open-change mirrors both flips', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    const states = collectOpenStates(el);
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('open-change', (event: Event) => {
      composedHeard.push(event.composed);
    });
    pointerOver(el);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    await elementUpdated(el);
    triggerOf(el).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(states).toEqual([true, false]);
    expect(composedHeard).toEqual([true, true]);
    // Esc while a show is PENDING: the timer dies too.
    pointerOver(el);
    triggerOf(el).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS * 2);
    expect(el.open).toBe(false);
  });

  it('click/tap toggles instantly (touch parity) — no delay on the open direction', async () => {
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    triggerOf(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(true);
    triggerOf(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  it('the declarative open attribute mounts too (the frozen §9 surface, the Open-story path)', async () => {
    const el = await mount({
      attributes: { open: '' },
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    expect(el.open).toBe(true);
    expect(surfaceOf(el).hidden).toBe(false);
  });

  // --- Matrix row: viewport edges (computed-position stubs) --------------------------

  it('placement flips at every viewport edge — all four, top/bottom AND left/right (the controller’s flip, stubbed geometry)', async () => {
    setViewport(800, 600);
    // The APPLIED coordinate (style.top) is the assertion target — the rects
    // are stubs, so reading them back would only echo the stub.
    const cases = [
      // Top edge clips 'top' (4 - 8 - 32 < padding 8) → flips bottom → 24 + 8 = 32.
      { placement: 'top' as const, anchor: rect(4, 100, 100, 20), expectedTop: 32 },
      // Bottom edge clips 'bottom' (600 + 8 + 32 > 600 - 8) → flips top → 580 - 8 - 32 = 540.
      { placement: 'bottom' as const, anchor: rect(580, 100, 100, 20), expectedTop: 540 },
      // Left edge clips 'left' (4 - 8 - 120 < 8) → flips right → 104 + 8 = 112.
      { placement: 'left' as const, anchor: rect(100, 4, 100, 20), expectedLeft: 112 },
      // Right edge clips 'right' (780 + 8 + 120 > 800 - 8) → flips left → 680 - 8 - 120 = 552.
      { placement: 'right' as const, anchor: rect(100, 680, 100, 20), expectedLeft: 552 },
    ];
    for (const { placement, anchor, expectedTop, expectedLeft } of cases) {
      const el = await mount({
        attributes: { placement },
        props: { content: 'Подсказка' },
        trigger: '<button type="button">Триггер</button>',
      });
      await elementUpdated(el);
      const surface = surfaceOf(el);
      stubRect(triggerOf(el), anchor);
      stubRect(surface, rect(0, 0, 120, 32));
      el.open = true;
      await elementUpdated(el);
      if (expectedTop !== undefined) {
        expect(
          Number.parseFloat(surface.style.top),
          `${placement} near the clipping edge flips top to ${expectedTop}`,
        ).toBe(expectedTop);
      }
      if (expectedLeft !== undefined) {
        expect(
          Number.parseFloat(surface.style.left),
          `${placement} near the clipping edge flips left to ${expectedLeft}`,
        ).toBe(expectedLeft);
      }
    }
  });

  it('the requested side is kept when it fits (no gratuitous flip)', async () => {
    setViewport(1280, 800);
    const el = await mount({
      attributes: { placement: 'bottom' },
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    await elementUpdated(el);
    const surface = surfaceOf(el);
    stubRect(triggerOf(el), rect(400, 100, 100, 20)); // anchor bottom edge 420
    stubRect(surface, rect(0, 0, 120, 32));
    el.open = true;
    await elementUpdated(el);
    expect(Number.parseFloat(surface.style.top), 'bottom kept: 420 + 8 offset').toBe(428);
  });

  // --- Matrix row: focusable content impossible -----------------------------------

  it('focusables are impossible by construction: prop-only content renders no focusable anywhere', async () => {
    const el = await mount({
      props: { content: '<button>злая</button>' },
      trigger: '<button type="button">Триггер</button>',
    });
    pointerOver(el);
    await new Promise((resolve) => setTimeout(resolve, TK_TOOLTIP_DELAY_MS + 20));
    await elementUpdated(el);
    const surface = surfaceOf(el);
    expect(surface.shadowRoot?.querySelector('button, a, input, [tabindex]')).toBeNull();
    // The content string renders as TEXT, never as markup.
    expect(surface.shadowRoot?.textContent).toContain('<button>');
  });

  // --- Icon-only trigger warn ----------------------------------------------------------

  it('icon-only trigger without an accessible name dev-warns once; aria-label silences it', async () => {
    vi.useFakeTimers();
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button" aria-hidden="false"></button>',
    });
    warnSpy.mockClear();
    pointerOver(el);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain('no accessible name');
    pointerOutTo(el, null);
    await elementUpdated(el);
    warnSpy.mockClear();
    pointerOver(el); // once per trigger — the second open stays quiet
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    expect(warnSpy).not.toHaveBeenCalled();

    const named = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button" aria-label="Информация"></button>',
    });
    warnSpy.mockClear();
    pointerOver(named);
    await vi.advanceTimersByTimeAsync(TK_TOOLTIP_DELAY_MS);
    expect(warnSpy, 'a named icon trigger never warns').not.toHaveBeenCalled();
  });

  it('more than one slotted element dev-warns; the first is the trigger', async () => {
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Первый</button><span>второй</span>',
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('more than one slotted element'));
    expect(el.querySelector('button')?.getAttribute('aria-describedby')).toBe(surfaceOf(el).id);
    expect(el.querySelector('span')?.hasAttribute('aria-describedby')).toBe(false);
  });

  // --- Wiring lifecycle ------------------------------------------------------------

  it('rewiring the slot restores the old trigger’s describedby and wires the new one', async () => {
    const el = await mount({
      props: { content: 'Подсказка' },
      trigger: '<button type="button" aria-describedby="consumer-hint">Старый</button>',
    });
    const old = el.querySelector('button') as HTMLElement;
    expect(old.getAttribute('aria-describedby')).toBe(surfaceOf(el).id);
    el.innerHTML = '<button type="button">Новый</button>';
    await elementUpdated(el);
    // Drive the slot's own event explicitly — happy-dom does not reliably
    // fire slotchange on REassignment (the handler reads the live slot).
    el.shadowRoot?.querySelector('slot')?.dispatchEvent(new Event('slotchange'));
    expect(old.getAttribute('aria-describedby'), 'consumer wiring restored').toBe('consumer-hint');
    expect(el.querySelector('button')?.getAttribute('aria-describedby')).toBe(surfaceOf(el).id);
  });

  it('disconnect: quiet teardown — surface unmounted, no container residue, describedby restored', async () => {
    const el = await mount({
      attributes: { open: '' },
      props: { content: 'Подсказка' },
      trigger: '<button type="button" aria-describedby="consumer-hint">Триггер</button>',
    });
    const trigger = el.querySelector('button') as HTMLElement;
    const surface = surfaceOf(el);
    el.remove();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(surface.hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull();
    expect(trigger.getAttribute('aria-describedby')).toBe('consumer-hint');
  });

  it('no slotted trigger: open is refused with a dev-warn (nothing to anchor to)', async () => {
    const el = await mount({ props: { content: 'Подсказка' } });
    el.open = true;
    await elementUpdated(el);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no slotted trigger'));
    expect(surfaceOf(el).hidden).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull();
  });

  it('content is live while open (re-render, no remount)', async () => {
    const el = await mount({
      attributes: { open: '' },
      props: { content: 'Старая' },
      trigger: '<button type="button">Триггер</button>',
    });
    const surface = surfaceOf(el);
    el.content = 'Новая подсказка';
    await elementUpdated(el);
    expect(surface.shadowRoot?.textContent).toContain('Новая подсказка');
    expect(surface.parentElement?.id).toBe('tk-overlay-root'); // same mount
  });

  it('placement change while open re-positions through the controller', async () => {
    setViewport(1280, 800);
    const el = await mount({
      attributes: { open: '', placement: 'top' },
      props: { content: 'Подсказка' },
      trigger: '<button type="button">Триггер</button>',
    });
    await elementUpdated(el);
    const surface = surfaceOf(el);
    stubRect(triggerOf(el), rect(400, 100, 100, 20)); // anchor bottom edge 420
    stubRect(surface, rect(0, 0, 120, 32));
    el.placement = 'bottom';
    await elementUpdated(el);
    expect(Number.parseFloat(surface.style.top), 're-positioned below after the flip').toBe(428);
  });

  // --- The acceptance's structural pin -------------------------------------------

  it('ZERO-BESPOKE PIN: tooltip.ts has no z/positioning code of its own and consumes the controller capabilities', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/tooltip/tooltip.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');

    for (const capability of ['mountOverlay', 'positionFloating']) {
      expect(source, `${capability} imported`).toMatch(new RegExp(`\\b${capability}\\b`));
    }
    expect(source).not.toMatch(/zIndex/);
    expect(source).not.toMatch(/z-index/);
    expect(source).not.toMatch(/style\.overflow/);
    expect(source).not.toMatch(/documentElement\.style/);
    expect(source).not.toMatch(/body\.style/);
    expect(source).not.toMatch(/computeFloatingPosition/); // geometry stays the controller's
  });
});
