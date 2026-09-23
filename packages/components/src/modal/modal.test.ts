// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkModal, TK_MODAL_EXIT_MAX_MS } from './modal.js';

/**
 * tk-modal unit tests (spec 4.1): the modal rows of the I/O & edge-case
 * matrix — open (controller mount + scroll lock + focus trap + post-mount
 * open-change), close (Esc / scrim click / open=false: exit anim → release +
 * lock + focus restore + open-change(false)), destructive (a dismiss never
 * fires the action), nesting (one level: inner traps LIFO, both locks held,
 * inner close restores into the outer), a11y (role/name/aria-modal, the
 * no-heading fallback), the rapid double-toggle race (single mount), and
 * disconnect-during-open / disconnect-mid-exit (no leaked mount/lock) — plus
 * the zero-bespoke-mechanics structural pin.
 *
 * happy-dom boundaries (the molds' rule): no popover API (the controller
 * falls back to the overlay container — asserted via its DOM effects), no
 * animation engine (exit waits resolve via the TK_MODAL_EXIT_MAX_MS bound —
 * fake timers), no layout. The reduced-motion close path is exercised by
 * stubbing matchMedia.
 */

const elementUpdated = (el: TkModal): Promise<unknown> => el.updateComplete;

let warnSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  warnSpy.mockRestore();
});

/** Reduced-motion stub: the JS close path skips the animation wait when it matches. */
const stubReducedMotion = (matches: boolean): void => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion') ? matches : false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
        onchange: null,
      }) as unknown as MediaQueryList,
  );
};

type MountOptions = {
  props?: Partial<InstanceType<typeof TkModal>>;
  attributes?: Record<string, string>;
  body?: string;
  actions?: string;
};

const mount = async ({ props, attributes, body, actions }: MountOptions = {}): Promise<TkModal> => {
  const el = new TkModal();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (body ?? actions) {
    if (body) el.innerHTML = body;
    if (actions) {
      const holder = document.createElement('div');
      holder.innerHTML = actions;
      for (const child of Array.from(holder.children)) {
        child.setAttribute('slot', 'actions');
        el.appendChild(child);
      }
    }
  }
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

/**
 * The generated surface (scrim + panel): in tk-modal's shadow tree while
 * closed, REPARENTED into the controller's overlay container while open on
 * the fallback path (happy-dom has no popover API) — the navbar drawerPanel
 * two-tree lookup mold. Single-modal in every suite test that calls it.
 */
const surfaceOf = (el: TkModal): HTMLDivElement => {
  const own = el.shadowRoot?.querySelector('div');
  if (own instanceof HTMLDivElement) return own;
  const moved = document.querySelector('#tk-overlay-root > div');
  expect(moved, 'the generated surface exists (shadow tree or overlay container)').toBeInstanceOf(
    HTMLDivElement,
  );
  return moved as HTMLDivElement;
};

const panelOf = (el: TkModal): HTMLElement => {
  const panel = surfaceOf(el).shadowRoot?.querySelector('.panel');
  expect(panel, 'the panel renders inside the surface').not.toBeNull();
  return panel as HTMLElement;
};

const scrimOf = (el: TkModal): HTMLElement => {
  const scrim = surfaceOf(el).shadowRoot?.querySelector('.scrim');
  expect(scrim, 'the scrim renders inside the surface').not.toBeNull();
  return scrim as HTMLElement;
};

const pressEscape = (): void => {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  );
};

const pressTabOn = (target: Element, shift = false): boolean =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true }),
  );

/** Drive a close to completion under fake timers (happy-dom fires no animationend). */
const advanceExit = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(TK_MODAL_EXIT_MAX_MS + 20);
};

const collectOpenStates = (el: TkModal): boolean[] => {
  const states: boolean[] = [];
  el.addEventListener('open-change', (event: Event) => {
    states.push((event as CustomEvent<{ value: boolean }>).detail.value);
  });
  return states;
};

const isLocked = (): boolean =>
  document.documentElement.style.overflow === 'hidden' && document.body.style.overflow === 'hidden';

describe('tk-modal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('registers as tk-modal exposing TkModal', async () => {
    await customElements.whenDefined('tk-modal');
    expect(customElements.get('tk-modal')).toBe(TkModal);
  });

  it('the mount-time open-change guard: NO event on first paint, closed OR open-attr (listener attached BEFORE connect)', async () => {
    // The guard's own regression, made loud (fix-round finding: attaching
    // the listener after mount is vacuous — the event has already fired or
    // not, and removing the wasOpen check would pass silently). Lit lists
    // every reactive property in the FIRST update's change map with an
    // undefined old value, so a bare old!==new dispatch would fire a
    // spurious open-change on first paint in BOTH shapes.
    const closed = new TkModal();
    const closedStates = collectOpenStates(closed);
    document.body.appendChild(closed);
    await elementUpdated(closed);
    expect(closedStates).toEqual([]);

    const opened = new TkModal();
    opened.setAttribute('open', '');
    opened.setAttribute('heading', 'Диалог');
    const openedStates = collectOpenStates(opened);
    document.body.appendChild(opened);
    await elementUpdated(opened);
    expect(openedStates, 'the declarative open mounts but never dispatches').toEqual([]);
  });

  // --- Matrix row: modal open (uncontrolled) ---------------------------------

  it('open attr mounts controller-side: modal layer z token, scroll locked, focus trapped in the panel, open-change silent at first paint', async () => {
    const el = await mount({
      attributes: { open: '', heading: 'Подтверждение' },
      body: '<p>Перевести 10 000 ₽?</p>',
      actions: '<button type="button">Перевести</button>',
    });
    const surface = surfaceOf(el);
    const panel = panelOf(el);

    // Controller integration (container fallback path — happy-dom has no
    // popover API): reparented into the overlay container, z only via the
    // modal layer token.
    expect(surface.hidden).toBe(false);
    expect(surface.parentElement?.id).toBe('tk-overlay-root');
    expect(surface.style.zIndex).toBe('var(--tk-z-modal)');
    // Scroll lock (refcounted controller): html + body overflow hidden.
    expect(isLocked()).toBe(true);
    // Focus trapped: initial focus = FIRST focusable (light DOM order: the
    // action button; the body paragraph is not focusable).
    const action = el.querySelector('button');
    expect(document.activeElement).toBe(action);
    // No open-change for the declarative first-paint open (flip-only guard).
    const states = collectOpenStates(el);
    expect(states).toEqual([]);
    // Heading names the dialog; the idref resolves INSIDE the surface's tree.
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(surface.shadowRoot?.getElementById(labelledBy ?? '')?.textContent).toContain(
      'Подтверждение',
    );
  });

  it('Tab cycles within the modal (trap): wrap at both edges, never escapes the host', async () => {
    const el = await mount({
      attributes: { open: '' },
      body: '<p>Текст</p>',
      actions: '<button type="button">A</button><button type="button">B</button>',
    });
    const [first, second] = Array.from(el.querySelectorAll('button'));
    expect(document.activeElement).toBe(first);
    // Forward Tab from the LAST focusable wraps to the first (focus is moved
    // onto it first — happy-dom moves no focus on bare keydowns).
    second.focus();
    expect(pressTabOn(second)).toBe(false); // intercepted
    expect(document.activeElement).toBe(first);
    // Shift+Tab from the first wraps to the last.
    first.focus();
    expect(pressTabOn(first, true)).toBe(false);
    expect(document.activeElement).toBe(second);
  });

  it('zero focusables: the panel itself (tabindex=-1) takes initial focus; the trap still arms', async () => {
    const el = await mount({ attributes: { open: '' }, body: '<p>Только текст</p>' });
    const panel = panelOf(el);
    // The panel lives in the surface's shadow tree: document.activeElement
    // stops at the shadow HOST — descend one root (the walkthrough mold).
    expect(document.activeElement).toBe(surfaceOf(el));
    expect(surfaceOf(el).shadowRoot?.activeElement).toBe(panel);
    expect(panel.getAttribute('tabindex')).toBe('-1');
    // Tab is not intercepted while empty (the trap module's lazy-arming rule).
    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    expect(pressTabOn(panel)).toBe(true);
  });

  // --- Matrix row: modal close --------------------------------------------------

  it('Esc dismisses: exit anim awaited, mount + lock released, focus restored to the opener, open-change(false) post-release', async () => {
    vi.useFakeTimers();
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.textContent = 'Открыть';
    document.body.appendChild(opener);
    opener.focus();

    const el = await mount({ props: { heading: 'Диалог' }, body: '<p>Тело</p>' });
    const states = collectOpenStates(el);
    el.open = true;
    await elementUpdated(el);
    expect(states).toEqual([true]);
    const surface = surfaceOf(el);

    pressEscape();
    await elementUpdated(el);
    // Mid-exit (happy-dom fires no animationend): the mount is STILL held,
    // data-closing applied — the exit must complete before release.
    expect(el.open).toBe(false);
    expect(surface.hasAttribute('data-closing')).toBe(true);
    expect(surface.parentElement?.id).toBe('tk-overlay-root');
    expect(isLocked()).toBe(true);

    await advanceExit();
    await elementUpdated(el);
    expect(surface.hasAttribute('hidden')).toBe(true);
    expect(surface.hasAttribute('data-closing')).toBe(false);
    expect(el.shadowRoot?.contains(surface), 're-homed into the shadow tree').toBe(true);
    expect(isLocked()).toBe(false);
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
    expect(document.activeElement).toBe(opener); // restore-to-trigger (the trap's pre-trap capture)
    expect(states).toEqual([true, false]);
  });

  it('scrim click dismisses; clicks inside the panel NEVER do', async () => {
    vi.useFakeTimers();
    const el = await mount({
      attributes: { open: '', heading: 'Заголовок' },
      body: '<p>Тело</p>',
      actions: '<button type="button">ОК</button>',
    });
    // A click on the panel body retargets to panel content — no dismiss.
    panelOf(el).dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    await elementUpdated(el);
    expect(el.open).toBe(true);
    // The scrim itself dismisses.
    const scrim = scrimOf(el);
    scrim.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    await elementUpdated(el);
    expect(el.open).toBe(false);
    await advanceExit();
    expect(surfaceOf(el).hasAttribute('hidden')).toBe(true);
  });

  it('destructive pattern: a dismiss (Esc/scrim) never fires the explicit action button', async () => {
    vi.useFakeTimers();
    let fired = 0;
    const el = await mount({
      attributes: { open: '', heading: 'Удалить карту?' },
      body: '<p>Действие необратимо.</p>',
      actions: '<button type="button">Удалить</button>',
    });
    const action = el.querySelector('button') as HTMLButtonElement;
    action.addEventListener('click', () => {
      fired += 1;
    });
    pressEscape();
    await advanceExit();
    expect(el.open).toBe(false);
    expect(fired).toBe(0); // the dismiss NEVER fires the action
    // The action fires only from its own explicit press.
    action.click();
    expect(fired).toBe(1);
  });

  it('open=false programmatically releases too (the frozen §9 declarative surface)', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    el.open = false;
    await elementUpdated(el);
    await advanceExit();
    expect(surfaceOf(el).hasAttribute('hidden')).toBe(true);
    expect(isLocked()).toBe(false);
  });

  it('reduced motion: no animation wait — the release is immediate', async () => {
    stubReducedMotion(true);
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    el.open = false;
    await elementUpdated(el);
    expect(surfaceOf(el).hasAttribute('hidden')).toBe(true);
    expect(isLocked()).toBe(false);
  });

  // --- Matrix row: nesting (one level) ------------------------------------------

  it('nesting: the inner modal traps within its own panel (LIFO), both scroll-locks held, inner close restores into the outer', async () => {
    const outer = await mount({
      attributes: { open: '', heading: 'Внешний' },
      actions: '<button type="button">Внешняя кнопка</button>',
    });
    const outerButton = outer.querySelector('button') as HTMLButtonElement;
    expect(document.activeElement).toBe(outerButton);

    // The inner modal lives in the OUTER's light DOM (the real nesting shape).
    const inner = new TkModal();
    inner.heading = 'Внутренний';
    const innerButton = document.createElement('button');
    innerButton.type = 'button';
    innerButton.textContent = 'Внутренняя кнопка';
    innerButton.setAttribute('slot', 'actions');
    inner.appendChild(innerButton);
    outer.appendChild(inner);
    inner.open = true;
    await elementUpdated(inner);

    // Initial focus landed inside the inner modal.
    expect(document.activeElement).toBe(innerButton);
    // LIFO: the INNER trap cycles — a Tab on the inner button is intercepted
    // by the innermost trap only, focus stays in the inner modal.
    expect(pressTabOn(innerButton, true)).toBe(false);
    expect(document.activeElement).toBe(innerButton); // single focusable → wraps to itself
    // Both locks held (refcounted): closing the inner keeps the outer locked.
    vi.useFakeTimers();
    inner.open = false;
    await elementUpdated(inner);
    await advanceExit();
    expect(isLocked()).toBe(true);
    // Inner close restored focus INTO the outer modal (the trap's pre-trap
    // capture was the outer's button).
    expect(document.activeElement).toBe(outerButton);
    // The outer still answers Esc.
    pressEscape();
    await elementUpdated(outer);
    await advanceExit();
    expect(outer.open).toBe(false);
    expect(isLocked()).toBe(false);
  });

  it('Esc answers only the NEWEST open modal (the sibling case)', async () => {
    vi.useFakeTimers();
    const first = await mount({ attributes: { open: '' }, body: '<p>Первый</p>' });
    const second = await mount({ attributes: { open: '' }, body: '<p>Второй</p>' });
    pressEscape();
    await elementUpdated(second);
    await advanceExit();
    expect(second.open).toBe(false);
    expect(first.open).toBe(true); // the older modal ignores the Esc
    pressEscape();
    await elementUpdated(first);
    await advanceExit();
    expect(first.open).toBe(false);
  });

  // --- Matrix row: a11y -----------------------------------------------------------

  it('heading missing: the panel falls back to the default accessible name; aria wiring stays single-tree', async () => {
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело без заголовка</p>' });
    const panel = panelOf(el);
    expect(panel.getAttribute('aria-labelledby')).toBeNull();
    expect(panel.getAttribute('aria-label')).toBe('Диалог');
    expect(panel.getAttribute('aria-modal')).toBe('true');
  });

  it('heading is live: changing it while open re-names the dialog in place', async () => {
    const el = await mount({ attributes: { open: '', heading: 'Старый' }, body: '<p>Тело</p>' });
    el.heading = 'Новый заголовок';
    await elementUpdated(el);
    const panel = panelOf(el);
    const labelledBy = panel.getAttribute('aria-labelledby') ?? '';
    expect(surfaceOf(el).shadowRoot?.getElementById(labelledBy)?.textContent).toContain(
      'Новый заголовок',
    );
  });

  it('open-change is composed, bubbles, and carries detail { value }', async () => {
    vi.useFakeTimers();
    const el = await mount({ body: '<p>Тело</p>' });
    const seen: boolean[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('open-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    el.open = true;
    await elementUpdated(el);
    el.open = false;
    await elementUpdated(el);
    await advanceExit();
    expect(seen).toEqual([true, false]);
    expect(composedHeard).toEqual([true, true]);
  });

  it('the open attribute reflects', async () => {
    const el = await mount({ body: '<p>Тело</p>' });
    el.open = true;
    await elementUpdated(el);
    expect(el.hasAttribute('open')).toBe(true);
  });

  // --- Races (the 3.4 lesson) --------------------------------------------------

  it('rapid double-toggle: close-then-reopen during the exit yields ONE live mount, lock held, no spurious open-change(false)', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    const states = collectOpenStates(el);
    const surface = surfaceOf(el);
    el.open = false; // exit begins
    await elementUpdated(el);
    el.open = true; // re-open MID-EXIT (before the animation bound)
    await elementUpdated(el);
    expect(states).toEqual([true]); // no false dispatched — the close aborted
    expect(surface.hidden).toBe(false);
    expect(surface.hasAttribute('data-closing')).toBe(false);
    expect(isLocked()).toBe(true);
    expect(surface.parentElement?.id).toBe('tk-overlay-root'); // still the ONE mount
    // Settle: nothing leaks when it eventually closes.
    el.open = false;
    await elementUpdated(el);
    await advanceExit();
    expect(surface.hasAttribute('hidden')).toBe(true);
    expect(isLocked()).toBe(false);
    expect(states).toEqual([true, false]);
  });

  it('disconnect during open: quiet teardown — no leaked mount, lock, listener, or dispatch', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    const states = collectOpenStates(el);
    const surface = surfaceOf(el);
    el.remove();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(surface.hasAttribute('hidden')).toBe(true);
    expect(isLocked()).toBe(false);
    expect(document.getElementById('tk-overlay-root')).toBeNull();
    // The document Esc listener left with the element: a stray Esc mutates nothing.
    pressEscape();
    expect(states).toEqual([]);
  });

  it('disconnect DURING the exit animation: no leaked mount/lock (the stale coroutine aborts)', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    el.open = false; // exit mid-flight…
    await elementUpdated(el);
    expect(surfaceOf(el).hasAttribute('data-closing')).toBe(true);
    el.remove(); // …and torn out of the tree before the bound
    await elementUpdated(el);
    expect(isLocked()).toBe(false);
    await advanceExit(); // the coroutine wakes to an invalidated generation
    expect(document.getElementById('tk-overlay-root')).toBeNull();
    expect(document.body.contains(surfaceOf(el))).toBe(false);
  });

  it('a connected tk-toast outranks the modal on Esc (the toast layer eats the keypress)', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { open: '' }, body: '<p>Тело</p>' });
    // Any connected tk-toast (the queue relocates them into the shared host).
    const toast = document.createElement('tk-toast');
    document.body.appendChild(toast);
    await Promise.resolve();
    pressEscape();
    await elementUpdated(el);
    expect(el.open).toBe(true); // the modal skipped the Esc
    toast.remove();
    pressEscape();
    await elementUpdated(el);
    expect(el.open).toBe(false); // with the toast gone, the modal answers
    await advanceExit();
  });

  // --- The acceptance's structural pin -------------------------------------------

  it('ZERO-BESPOKE PIN: modal.ts has no z/scroll-lock/trap code of its own and consumes the controller capabilities', () => {
    // happy-dom rewrites import.meta.url to a non-file scheme — resolve from
    // the package cwd (vitest runs with cwd = packages/components).
    const source = readFileSync(resolve(process.cwd(), 'src/modal/modal.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');

    // The controller capabilities ARE consumed (positioning is the
    // controller's but a centered dialog anchors to nothing — no
    // positionFloating here by design)…
    for (const capability of ['mountOverlay', 'lockBodyScroll', 'trapFocus']) {
      expect(source, `${capability} imported`).toMatch(new RegExp(`\\b${capability}\\b`));
    }
    // …and none of the mechanics is reimplemented: no z writes, no scroll
    // style writes, no Tab-cycle trap logic (Esc keydown is the modal's own
    // sanctioned dismiss, not a trap).
    expect(source).not.toMatch(/zIndex/);
    expect(source).not.toMatch(/z-index/);
    expect(source).not.toMatch(/style\.overflow/);
    expect(source).not.toMatch(/documentElement\.style/);
    expect(source).not.toMatch(/body\.style/);
    expect(source).not.toMatch(/===\s*'Tab'/);
    expect(source).not.toMatch(/keydown.*Tab/s);
  });
});
