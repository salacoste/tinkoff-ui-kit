// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { showToast } from './show.js';
import { TkToast, TK_TOAST_DEFAULT_DURATION_MS, TK_TOAST_EXIT_MAX_MS } from './toast.js';

/**
 * tk-toast unit tests (spec 4.3): the toast rows of the I/O & edge-case
 * matrix — auto-dismiss (default 5s; duration 0 sticky), pause on
 * hover/focus + resume on leave/blur, stack overflow (4th arrives → oldest
 * collapses, max 3 visible), variant (destructive → role=alert + error
 * icon), Esc (newest dismissed, focus never moves), action click (native
 * consumer handler; the toast STAYS) — plus the self-enqueue ruling (the
 * element relocates into #tk-toast-stack on connect), the imperative
 * showToast parity (same element, slots, dismiss handle), never-takes-focus
 * structural pins, and the zero-bespoke-mechanics structural pin.
 *
 * happy-dom boundaries (the molds' rule): no popover API (the stack host
 * mounts through the controller's container fallback), no animation engine
 * (exit waits resolve via the TK_TOAST_EXIT_MAX_MS bound — fake timers).
 */

/** Reduced-motion stub: the JS exit path removes immediately when it matches. */
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
  props?: Partial<InstanceType<typeof TkToast>>;
  attributes?: Record<string, string>;
  message?: string;
  action?: string;
};

const mount = async ({ props, attributes, message, action }: MountOptions = {}): Promise<TkToast> => {
  const el = new TkToast();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (message !== undefined) el.append(message);
  if (action !== undefined) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action;
    button.setAttribute('slot', 'action');
    el.append(button);
  }
  // Declarative usage: appended ANYWHERE — self-enqueue relocates it.
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await el.updateComplete;
  return el;
};

const elementUpdated = (el: TkToast): Promise<unknown> => el.updateComplete;

const stackHost = (): HTMLElement | null => document.getElementById('tk-toast-stack');

const stackToasts = (): TkToast[] => Array.from(stackHost()?.querySelectorAll('tk-toast') ?? []);

/** Drive an exit to completion under fake timers (happy-dom fires no animationend). */
const advanceExit = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(TK_TOAST_EXIT_MAX_MS + 20);
};

const pressEscape = (): void => {
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  );
};

describe('tk-toast', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('registers as tk-toast exposing TkToast; the default duration is 5000', async () => {
    await customElements.whenDefined('tk-toast');
    expect(customElements.get('tk-toast')).toBe(TkToast);
    expect(TK_TOAST_DEFAULT_DURATION_MS).toBe(5000);
  });

  // --- Self-enqueue (the recorded ruling) ------------------------------------

  it('SELF-ENQUEUES on connect: any mount location relocates into the shared bottom-right stack', async () => {
    const holder = document.createElement('div');
    document.body.appendChild(holder);
    const el = new TkToast();
    el.append('Сообщение');
    holder.appendChild(el); // declarative: appended in an arbitrary corner
    await elementUpdated(el);
    const host = stackHost();
    expect(host, 'the shared stacking host exists').not.toBeNull();
    expect(el.parentElement).toBe(host); // relocated
    // The host is mounted through the controller (fallback container path):
    // z only via the toast layer token.
    expect(host?.style.zIndex).toBe('var(--tk-z-toast)');
    // The toast opts back into interaction (the host is pass-through).
    expect(getComputedStyle(el).pointerEvents).not.toBe('none');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('the stack tears down when the last toast leaves (queue MutationObserver)', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { duration: 0 }, message: 'Сообщение' });
    expect(stackHost()).not.toBeNull();
    el.remove();
    await vi.advanceTimersByTimeAsync(0); // MutationObserver microtask
    expect(stackHost()).toBeNull();
    expect(document.getElementById('tk-overlay-root')).toBeNull();
  });

  // --- Matrix row: auto-dismiss -------------------------------------------------

  it('auto-dismisses after the default 5000ms: exit, then self-removal (queue prunes)', async () => {
    vi.useFakeTimers();
    const el = await mount({ message: 'Сообщение' });
    await vi.advanceTimersByTimeAsync(TK_TOAST_DEFAULT_DURATION_MS - 1);
    expect(el.isConnected, 'still visible inside the window').toBe(true);
    expect(el.hasAttribute('data-exiting')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    // Mid-exit (no animationend in happy-dom — the bound decides).
    expect(el.isConnected).toBe(true);
    expect(el.hasAttribute('data-exiting')).toBe(true);
    await advanceExit();
    expect(el.isConnected).toBe(false);
    expect(stackHost()).toBeNull(); // last toast → host torn down
  });

  it('duration 0 = sticky: no timer ever fires', async () => {
    vi.useFakeTimers();
    const el = await mount({ attributes: { duration: '0' }, message: 'Сообщение' });
    await vi.advanceTimersByTimeAsync(60_000);
    expect(el.isConnected).toBe(true);
  });

  it('duration clamps: negative → sticky, non-finite → the 5000 default', async () => {
    vi.useFakeTimers();
    const negative = await mount({ props: { duration: -100 }, message: 'A' });
    await vi.advanceTimersByTimeAsync(60_000);
    expect(negative.isConnected, 'negative → sticky').toBe(true);
    const nan = await mount({ props: { duration: Number.NaN }, message: 'B' });
    await vi.advanceTimersByTimeAsync(TK_TOAST_DEFAULT_DURATION_MS - 1);
    expect(nan.isConnected).toBe(true);
    await advanceExit();
    expect(nan.isConnected, 'NaN → the default window dismissed it').toBe(false);
  });

  it('reduced motion: dismiss removes immediately (no animation wait)', async () => {
    stubReducedMotion(true);
    const el = await mount({ message: 'Сообщение' });
    el.dismiss();
    expect(el.isConnected).toBe(false);
  });

  // --- Matrix row: pause ----------------------------------------------------------

  it('pointerenter pauses the timer; pointerleave resumes the REMAINDER', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { duration: 5000 }, message: 'Сообщение' });
    await vi.advanceTimersByTimeAsync(3000);
    el.dispatchEvent(new Event('pointerenter'));
    await vi.advanceTimersByTimeAsync(10_000); // paused — far past the window
    expect(el.isConnected, 'hover-paused survives past 5s').toBe(true);
    el.dispatchEvent(new Event('pointerleave'));
    await vi.advanceTimersByTimeAsync(1800); // ~2s of the remainder
    expect(el.isConnected).toBe(true);
    await vi.advanceTimersByTimeAsync(1500); // remainder exhausted
    expect(el.hasAttribute('data-exiting') || !el.isConnected).toBe(true);
  });

  it('focusin/focusout pause and resume identically (hover is never the only path)', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { duration: 5000 }, message: 'Сообщение' });
    await vi.advanceTimersByTimeAsync(1000);
    el.dispatchEvent(new Event('focusin'));
    await vi.advanceTimersByTimeAsync(10_000);
    expect(el.isConnected).toBe(true);
    el.dispatchEvent(new Event('focusout'));
    await vi.advanceTimersByTimeAsync(4000 + TK_TOAST_EXIT_MAX_MS + 50);
    expect(el.isConnected, 'resumed remainder elapsed → removed').toBe(false);
  });

  it('sticky toasts ignore pause/resume entirely', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { duration: 0 }, message: 'Сообщение' });
    el.dispatchEvent(new Event('pointerenter'));
    el.dispatchEvent(new Event('pointerleave'));
    el.dispatchEvent(new Event('focusin'));
    el.dispatchEvent(new Event('focusout'));
    await vi.advanceTimersByTimeAsync(60_000);
    expect(el.isConnected).toBe(true);
  });

  // --- Matrix row: stack overflow -------------------------------------------------

  it('the 4th toast collapses the OLDEST (max 3 visible, exit-then-remove)', async () => {
    vi.useFakeTimers();
    const first = await mount({ props: { duration: 0 }, message: 'Первый' });
    const second = await mount({ props: { duration: 0 }, message: 'Второй' });
    const third = await mount({ props: { duration: 0 }, message: 'Третий' });
    expect(stackToasts()).toHaveLength(3);
    const fourth = await mount({ props: { duration: 0 }, message: 'Четвёртый' });
    // The collapsing toast stays in the host WHILE its exit animates (the
    // queue's documented lifecycle) — the LIVE count is the non-exiting set.
    const live = () => stackToasts().filter((toast) => !toast.hasAttribute('data-exiting'));
    expect(live()).toHaveLength(3);
    expect(first.hasAttribute('data-exiting'), 'the oldest collapses').toBe(true);
    expect(second.isConnected).toBe(true);
    expect(third.isConnected).toBe(true);
    expect(fourth.isConnected).toBe(true);
    await advanceExit();
    expect(first.isConnected).toBe(false);
    expect(live(), 'still exactly three visible').toHaveLength(3);
  });

  // --- Matrix row: variant ----------------------------------------------------------

  it('default: aria-live polite + the success check icon (aria-hidden)', async () => {
    const el = await mount({ message: 'Готово' });
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('role')).toBeNull();
    const icon = el.shadowRoot?.querySelector('.toast__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.classList.contains('toast__icon--default')).toBe(true);
    expect(el.getAttribute('variant')).toBe('default'); // enum reflects
  });

  it('destructive: role=alert (assertive by implication) + the error glyph; invalid clamps', async () => {
    const el = await mount({ props: { variant: 'destructive' }, message: 'Ошибка' });
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBeNull(); // never both
    expect(el.shadowRoot?.querySelector('.toast__icon--destructive')).not.toBeNull();

    const bad = await mount({ attributes: { variant: 'fatal' }, message: 'X' });
    await elementUpdated(bad);
    expect(bad.variant).toBe('default');
    expect(bad.getAttribute('variant')).toBe('default'); // reflected attribute corrected
    expect(bad.getAttribute('aria-live')).toBe('polite');
  });

  // --- Matrix row: Esc ---------------------------------------------------------------

  it('Esc dismisses the NEWEST toast; focus NEVER moves', async () => {
    vi.useFakeTimers();
    const keeper = document.createElement('button');
    document.body.appendChild(keeper);
    keeper.focus();
    const older = await mount({ props: { duration: 0 }, message: 'Старый' });
    const newer = await mount({ props: { duration: 0 }, message: 'Новый' });
    pressEscape();
    expect(newer.hasAttribute('data-exiting'), 'the newest is exiting').toBe(true);
    expect(older.isConnected && !older.hasAttribute('data-exiting')).toBe(true);
    expect(document.activeElement).toBe(keeper); // focus never stolen
    await advanceExit();
    expect(newer.isConnected).toBe(false);
    expect(older.isConnected).toBe(true);
    pressEscape(); // now the older one is the newest
    await advanceExit();
    expect(older.isConnected).toBe(false);
    expect(document.activeElement).toBe(keeper);
  });

  // --- Matrix row: action -------------------------------------------------------------

  it('action click fires the consumer handler natively; the toast STAYS until duration/dismiss', async () => {
    vi.useFakeTimers();
    const clicks: string[] = [];
    const el = new TkToast();
    el.duration = 0;
    el.append('Копия ссылки создана');
    const action = document.createElement('button');
    action.type = 'button';
    action.textContent = 'Открыть';
    action.setAttribute('slot', 'action');
    action.addEventListener('click', () => clicks.push('action'));
    el.append(action);
    document.body.appendChild(el);
    await elementUpdated(el);

    action.click();
    expect(clicks).toEqual(['action']); // native click serves the action
    expect(el.isConnected, 'the toast STAYS after the action').toBe(true);
    el.dismiss();
    await advanceExit();
    expect(el.isConnected).toBe(false);
  });

  it('dismiss() is idempotent (double dismiss removes once, no errors)', async () => {
    vi.useFakeTimers();
    const el = await mount({ props: { duration: 0 }, message: 'Сообщение' });
    el.dismiss();
    el.dismiss();
    await advanceExit();
    expect(el.isConnected).toBe(false);
  });

  // --- Never-takes-focus structural pins ------------------------------------------

  it('NEVER takes focus: no tabindex anywhere, no focus() call in the source', async () => {
    const el = await mount({ message: 'Сообщение', action: 'Действие' });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.shadowRoot?.querySelector('[tabindex]')).toBeNull();
    pressEscape();
    // Source pin (the acceptance's structural rule, comments stripped — the
    // class doc MENTIONS the ruling).
    const source = readFileSync(resolve(process.cwd(), 'src/toast/toast.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');
    expect(source).not.toMatch(/\.focus\(/);
    expect(source).not.toMatch(/tabindex/);
  });

  // --- The imperative helper (same element, slots, handle) --------------------------

  it('showToast builds the SAME element: message + action slotted, props set, dismiss handle live', async () => {
    vi.useFakeTimers();
    const clicks: string[] = [];
    const handle = showToast({
      message: 'Заявка отправлена',
      variant: 'destructive',
      duration: 0,
      action: { label: 'Отменить', onClick: () => clicks.push('x') },
    });
    const el = stackToasts()[0];
    expect(el, 'the toast self-enqueued into the shared stack').toBeInstanceOf(TkToast);
    expect(el.variant).toBe('destructive');
    expect(el.duration).toBe(0);
    // Slots carry the content — the declarative form, built imperatively.
    expect(el.textContent).toContain('Заявка отправлена');
    const action = el.querySelector('button[slot="action"]');
    expect(action?.textContent).toBe('Отменить');
    action?.click();
    expect(clicks).toEqual(['x']);
    handle.dismiss();
    await advanceExit();
    expect(el.isConnected).toBe(false);
    expect(stackHost()).toBeNull();
  });

  it('showToast with a pre-built action element slots it as-is', async () => {
    const custom = document.createElement('button');
    custom.type = 'button';
    custom.textContent = 'Своё действие';
    const handle = showToast({ message: 'Готово', duration: 0, action: custom });
    const el = stackToasts()[0];
    expect(el.querySelector('button[slot="action"]')).toBe(custom);
    handle.dismiss();
  });

  it('showToast defaults: variant default, duration 5000', async () => {
    vi.useFakeTimers();
    const handle = showToast({ message: 'Без опций' });
    const el = stackToasts()[0];
    expect(el.variant).toBe('default');
    expect(el.duration).toBe(TK_TOAST_DEFAULT_DURATION_MS);
    handle.dismiss();
    await advanceExit();
  });

  // --- The acceptance's structural pin -------------------------------------------

  it('ZERO-BESPOKE PIN: toast.ts consumes enqueueToast and implements no stacking/z/scroll of its own', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/toast/toast.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');

    expect(source, 'enqueueToast consumed (self-enqueue ruling)').toMatch(/\benqueueToast\b/);
    expect(source).not.toMatch(/zIndex/);
    expect(source).not.toMatch(/z-index/);
    expect(source).not.toMatch(/style\.overflow/);
    expect(source).not.toMatch(/documentElement\.style/);
    expect(source).not.toMatch(/body\.style/);
    expect(source).not.toMatch(/mountOverlay/); // stacking is the queue's, never the element's
  });
});
