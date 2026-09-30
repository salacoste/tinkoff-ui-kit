// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TkMenuDivider, TkMenuItem, TkMenuPopover } from './index.js';

/**
 * tk-menu-popover unit tests (spec 19.1): the APG-menu I/O matrix — anchor
 * wiring (haspopup/expanded, NO controls), routing of light children into
 * the generated panel, open/close over the overlay controller (dropdown
 * layer + positionFloating alignment:'end'), roving focus (arrows wrap,
 * disabled skipped, Home/End), activation (click/Enter/Space → select +
 * close + focus return), Escape, outside press, focus loss, Tab semantics,
 * the open-change §9 channel (never at mount, after mount/position), quiet
 * teardown, late-children routing (MutationObserver), and the auxiliary
 * row elements' own reflection rules.
 *
 * happy-dom runs the controller's container fallback path (no popover API —
 * the select.test.ts stub-boundary note): while OPEN the panel lives in
 * #tk-overlay-root (document tree — real focus on rows is
 * document.activeElement), while closed it is re-homed into the host's
 * shadow root.
 */

const elementUpdated = (el: TkMenuPopover): Promise<unknown> => el.updateComplete;

/** Step past MutationObserver microtask delivery + Lit's scheduled update. */
const settle = async (el: TkMenuPopover): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await elementUpdated(el);
};

/** Fictional console rows (ПД law: never transcribed capture values). */
const COMMANDS = ['Открыть карточку', 'Повторить платёж', 'Отменить', 'Удалить'];

const mount = async (options: { open?: boolean; label?: string } = {}): Promise<TkMenuPopover> => {
  const el = new TkMenuPopover();
  const anchor = document.createElement('button');
  anchor.type = 'button';
  anchor.textContent = 'Действия';
  anchor.setAttribute('slot', 'anchor');
  el.appendChild(anchor);
  COMMANDS.forEach((label, index) => {
    const item = new TkMenuItem();
    item.textContent = label;
    if (index === 2) item.disabled = true;
    if (index === 3) item.variant = 'destructive';
    el.appendChild(item);
    if (index === 1) el.appendChild(new TkMenuDivider()); // group rule before «Отменить»
  });
  if (options.label) el.label = options.label;
  if (options.open) el.setAttribute('open', '');
  document.body.appendChild(el);
  await elementUpdated(el);
  await new Promise((resolve) => setTimeout(resolve, 0)); // observer pass
  await elementUpdated(el);
  return el;
};

/** The panel: shadow-tree child while closed, overlay-container child while open. */
const panel = (el: TkMenuPopover): HTMLElement => {
  const mine = el.shadowRoot?.querySelector<HTMLElement>('[role="menu"]');
  if (mine) return mine;
  const overlay = document.getElementById('tk-overlay-root');
  const found = overlay?.querySelector<HTMLElement>('[role="menu"]') ?? null;
  expect(found, 'menu panel exists (shadow tree or overlay container)').not.toBeNull();
  return found as HTMLElement;
};

const anchor = (el: TkMenuPopover): HTMLButtonElement => {
  const slotted = el.querySelector<HTMLButtonElement>('[slot="anchor"]');
  expect(slotted, 'anchor slotted').toBeInstanceOf(HTMLButtonElement);
  return slotted as HTMLButtonElement;
};

const items = (el: TkMenuPopover): TkMenuItem[] =>
  Array.from(panel(el).querySelectorAll<TkMenuItem>('tk-menu-item'));

const enabled = (el: TkMenuPopover): TkMenuItem[] => items(el).filter((item) => !item.disabled);

/** Key press on a node (bubbles — the panel's delegated listener hears it). */
const press = (node: Element, key: string, init: KeyboardEventInit = {}): boolean =>
  node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));

const outsidePointerDown = (target: Element): void => {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
};

const collectOpenStates = (el: TkMenuPopover): boolean[] => {
  const states: boolean[] = [];
  el.addEventListener('open-change', (event: Event) => {
    states.push((event as CustomEvent<{ value: boolean }>).detail.value);
  });
  return states;
};

describe('tk-menu-popover', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers the family tags exposing their classes', async () => {
    await customElements.whenDefined('tk-menu-popover');
    await customElements.whenDefined('tk-menu-item');
    await customElements.whenDefined('tk-menu-divider');
    expect(customElements.get('tk-menu-popover')).toBe(TkMenuPopover);
    expect(customElements.get('tk-menu-item')).toBe(TkMenuItem);
    expect(customElements.get('tk-menu-divider')).toBe(TkMenuDivider);
  });

  it('wires the slotted anchor: haspopup + expanded, NO aria-controls (the shadow-idref lesson)', async () => {
    const el = await mount();
    const button = anchor(el);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBeNull();
  });

  it('routes light children into the panel: rows are panel children in authored order, divider included', async () => {
    const el = await mount();
    const rows = items(el);
    expect(rows).toHaveLength(COMMANDS.length);
    expect(rows.map((row) => row.textContent?.trim())).toEqual(COMMANDS);
    expect(rows[0]?.parentElement).toBe(panel(el));
    expect(panel(el).querySelector('tk-menu-divider')).toBeInstanceOf(TkMenuDivider);
    // The anchor is NOT routed — it stays the host's light child.
    expect(anchor(el).parentElement).toBe(el);
    // role wiring on the routed elements.
    expect(rows[0]?.getAttribute('role')).toBe('menuitem');
    expect(panel(el).querySelector('tk-menu-divider')?.getAttribute('role')).toBe('separator');
  });

  it('the panel is a named role=menu, hidden while closed, labeled «Меню» by default / by label', async () => {
    const el = await mount();
    const menu = panel(el);
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(menu.getAttribute('aria-label')).toBe('Меню');
    expect(menu.getAttribute('aria-labelledby')).toBeNull();

    el.label = 'Действия с платежом';
    await elementUpdated(el);
    expect(menu.getAttribute('aria-label')).toBe('Действия с платежом');
  });

  it('rows are all tabIndex -1 while closed (the anchor is the tab stop)', async () => {
    const el = await mount();
    for (const row of items(el)) expect(row.tabIndex).toBe(-1);
  });

  // --- open/close over the controller --------------------------------------

  it('anchor click opens: panel mounts controller-side (dropdown layer, fixed), aria-expanded flips', async () => {
    const el = await mount();
    const states = collectOpenStates(el);
    anchor(el).click();
    await elementUpdated(el);

    expect(el.open).toBe(true);
    expect(el.hasAttribute('open')).toBe(true); // reflection
    expect(states).toEqual([true]);
    const menu = panel(el);
    expect(menu.hasAttribute('hidden')).toBe(false);
    expect(menu.parentElement?.id).toBe('tk-overlay-root');
    expect(menu.style.zIndex).toBe('var(--tk-z-dropdown)');
    expect(menu.style.position).toBe('fixed');
    expect(anchor(el).getAttribute('aria-expanded')).toBe('true');

    anchor(el).click();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(states).toEqual([true, false]);
    expect(panel(el).hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot?.contains(panel(el)), 're-homed into the shadow tree').toBe(true);
    expect(anchor(el).getAttribute('aria-expanded')).toBe('false');
  });

  it('declarative open mounts silently: no open-change at first paint, panel visible + positioned', async () => {
    const el = await mount({ open: true });
    const states = collectOpenStates(el); // mounted already — nothing more may fire
    expect(el.open).toBe(true);
    expect(panel(el).hasAttribute('hidden')).toBe(false);
    expect(panel(el).style.position).toBe('fixed');
    anchor(el).click();
    await elementUpdated(el);
    expect(states).toEqual([false]);
  });

  it('open-change fires AFTER the mount/position work and mirrors flips (composed, bubbles)', async () => {
    const el = await mount();
    const seen: boolean[] = [];
    const composedHeard: boolean[] = [];
    const hiddenAt: boolean[] = [];
    el.parentElement?.addEventListener('open-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: boolean }>).detail.value);
      hiddenAt.push(panel(el).hasAttribute('hidden'));
    });
    anchor(el).click();
    await elementUpdated(el);
    anchor(el).click();
    await elementUpdated(el);
    expect(seen).toEqual([true, false]);
    expect(composedHeard).toEqual([true, true]);
    expect(hiddenAt).toEqual([false, true]); // visible already at open-event time
  });

  // --- roving focus -----------------------------------------------------------

  it('ArrowDown on the anchor opens at the first enabled row with REAL focus (roving tabindex)', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    const first = enabled(el)[0];
    expect(el.open).toBe(true);
    expect(first?.tabIndex).toBe(0);
    expect(items(el).filter((row) => row.tabIndex === 0)).toHaveLength(1);
    // Real focus: the panel lives in the overlay container while open.
    expect(document.activeElement).toBe(first);
  });

  it('ArrowUp on the anchor opens at the last enabled row', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowUp');
    await elementUpdated(el);
    const last = enabled(el).at(-1);
    expect(el.open).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it('arrows step real focus with wrap, disabled rows skipped; Home/End jump', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown'); // → 0
    await elementUpdated(el);
    // Enabled rows in authored order: 0 «Открыть», 1 «Повторить», 2 «Удалить»
    // («Отменить» is disabled, the divider carries no focus).
    const rows = enabled(el);
    expect(rows).toHaveLength(3);

    press(document.activeElement as Element, 'ArrowDown'); // 0 → 1
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[1]);

    press(document.activeElement as Element, 'ArrowDown'); // 1 → 2 («Отменить» skipped)
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[2]);

    press(document.activeElement as Element, 'ArrowDown'); // 2 → wrap 0
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[0]);

    press(document.activeElement as Element, 'ArrowUp'); // 0 → wrap 2
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[2]);

    press(document.activeElement as Element, 'Home'); // → 0
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[0]);

    press(document.activeElement as Element, 'End'); // → 2
    await elementUpdated(el);
    expect(document.activeElement).toBe(rows[2]);
  });

  it('arrow keydowns are cancelled (no page scroll under the menu)', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    expect(press(document.activeElement as Element, 'ArrowDown')).toBe(false);
    expect(press(document.activeElement as Element, 'Home')).toBe(false);
  });

  // --- activation --------------------------------------------------------------

  it('Enter on a row dispatches select with the ROW ELEMENT, closes, focus returns to the anchor', async () => {
    const el = await mount();
    const selected: Element[] = [];
    el.addEventListener('select', (event: Event) => {
      selected.push((event as CustomEvent<{ value: TkMenuItem }>).detail.value);
    });
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    press(document.activeElement as Element, 'Enter');
    await elementUpdated(el);

    expect(selected).toEqual([enabled(el)[0]]);
    expect(el.open).toBe(false);
    expect(document.activeElement).toBe(anchor(el));
    // Closed: rows all -1 again.
    for (const row of items(el)) expect(row.tabIndex).toBe(-1);
  });

  it('Space on a row activates too (and is cancelled — no scroll)', async () => {
    const el = await mount();
    const selected: Element[] = [];
    el.addEventListener('select', (event: Event) => {
      selected.push((event as CustomEvent<{ value: TkMenuItem }>).detail.value);
    });
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    press(document.activeElement as Element, 'ArrowDown');
    await elementUpdated(el);
    expect(press(document.activeElement as Element, ' ')).toBe(false);
    await elementUpdated(el);
    expect(selected.map((row) => row.textContent?.trim())).toEqual(['Повторить платёж']);
    expect(el.open).toBe(false);
  });

  it('clicking a row activates it; panel pointerdown never moves focus', async () => {
    const el = await mount();
    const selected: Element[] = [];
    el.addEventListener('select', (event: Event) => {
      selected.push((event as CustomEvent<{ value: TkMenuItem }>).detail.value);
    });
    anchor(el).click();
    await elementUpdated(el);
    const row = enabled(el)[1] as TkMenuItem;
    row.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    row.click();
    await elementUpdated(el);

    expect(selected.map((item) => item.textContent?.trim())).toEqual(['Повторить платёж']);
    expect(el.open).toBe(false);
    expect(document.activeElement).toBe(anchor(el));
  });

  it('disabled rows never activate: click selects nothing and keeps the menu open', async () => {
    const el = await mount();
    const selected: Element[] = [];
    el.addEventListener('select', (event: Event) => {
      selected.push((event as CustomEvent<{ value: TkMenuItem }>).detail.value);
    });
    anchor(el).click();
    await elementUpdated(el);
    (items(el)[2] as TkMenuItem).click();
    await elementUpdated(el);
    expect(selected).toEqual([]);
    expect(el.open).toBe(true);
  });

  // --- close paths --------------------------------------------------------------

  it('Escape from a row closes and restores focus to the anchor', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    press(document.activeElement as Element, 'Escape');
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(document.activeElement).toBe(anchor(el));
  });

  it('Escape on the anchor closes an open menu', async () => {
    const el = await mount();
    anchor(el).click();
    await elementUpdated(el);
    press(anchor(el), 'Escape');
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  it('outside pointerdown closes and returns focus to the anchor; presses inside do not close', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);

    outsidePointerDown(el); // host boundary (shadow presses retarget here)
    outsidePointerDown(panel(el));
    expect(el.open).toBe(true);

    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    outsidePointerDown(outsider);
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0)); // returnFocus rides updateComplete
    expect(el.open).toBe(false);
    expect(document.activeElement).toBe(anchor(el));
    // ...and it STAYS there (no late focus move after the close settles).
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.activeElement).toBe(anchor(el));
  });

  it('focus leaving the whole component closes (natural tab order — no forced return)', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    const focusSpy = vi.spyOn(anchor(el), 'focus');

    const elsewhere = document.createElement('input');
    document.body.appendChild(elsewhere);
    // The row lives in the overlay container (document tree) while open —
    // its focusout is heard by the panel's delegated listener.
    const event = new Event('focusout', { bubbles: true, composed: true });
    Object.defineProperty(event, 'relatedTarget', { value: elsewhere });
    (document.activeElement as Element).dispatchEvent(event);
    await elementUpdated(el);

    expect(el.open).toBe(false);
    expect(focusSpy, 'focus follows natural tab order — never forced back').not.toHaveBeenCalled();
  });

  it('Tab from a row closes; Shift+Tab from the first row stays open (anchor focus)', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown'); // first row focused
    await elementUpdated(el);

    press(document.activeElement as Element, 'Tab', { shiftKey: true });
    await elementUpdated(el);
    expect(el.open, 'Shift+Tab to the anchor keeps the menu open (select precedent)').toBe(true);

    press(document.activeElement as Element, 'Tab');
    await elementUpdated(el);
    expect(el.open, 'forward Tab closes with natural order').toBe(false);
  });

  it('IME composition keydowns are inert (isComposing / keyCode 229)', async () => {
    const el = await mount();
    const composing = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    Object.defineProperty(composing, 'isComposing', { value: true });
    anchor(el).dispatchEvent(composing);
    const legacy = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    Object.defineProperty(legacy, 'keyCode', { value: 229 });
    anchor(el).dispatchEvent(legacy);
    await elementUpdated(el);
    expect(el.open).toBe(false);
  });

  // --- late children / teardown ----------------------------------------------------

  it('children authored later are routed into the open panel (MutationObserver)', async () => {
    const el = await mount();
    const extra = new TkMenuItem();
    extra.textContent = 'Показать реквизиты';
    el.appendChild(extra);
    await settle(el);
    expect(items(el).map((row) => row.textContent?.trim())).toContain('Показать реквизиты');
  });

  it('detaching the element tears the menu down quietly (no events, controller released)', async () => {
    const el = await mount();
    press(anchor(el), 'ArrowDown');
    await elementUpdated(el);
    const states = collectOpenStates(el);
    const menu = panel(el);
    el.remove();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(states).toEqual([]); // quiet teardown dispatches nothing
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
  });

  it('panel ids are unique across instances', async () => {
    const a = await mount();
    a.open = true;
    await elementUpdated(a);
    const idA = panel(a).id;
    a.open = false;
    await elementUpdated(a); // re-homed into a's shadow tree — one open at a time

    const b = await mount();
    b.open = true;
    await elementUpdated(b);
    expect(panel(b).id).not.toBe(idA);
  });

  it('re-anchor: removing the anchor and slotting a new one rewires (observer pass)', async () => {
    const el = await mount();
    const first = anchor(el);
    first.remove();
    const replacement = document.createElement('button');
    replacement.type = 'button';
    replacement.textContent = 'Ещё';
    replacement.setAttribute('slot', 'anchor');
    el.appendChild(replacement);
    await settle(el);
    expect(el.querySelector('[slot="anchor"]')).toBe(replacement);
    // Host-delegated wiring: the CURRENT anchor carries the aria pair (the
    // detached node leaves the DOM with its stale attributes — harmless).
    expect(replacement.getAttribute('aria-haspopup')).toBe('menu');
    expect(replacement.getAttribute('aria-expanded')).toBe('false');
    replacement.click();
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(replacement.getAttribute('aria-expanded')).toBe('true');
  });
});

// --- tk-menu-item / tk-menu-divider (auxiliary rows) ---------------------------

describe('tk-menu-item', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects disabled as aria-disabled and clamps the variant enum (CONVENTIONS §2)', async () => {
    const item = new TkMenuItem();
    item.textContent = 'Удалить';
    document.body.appendChild(item);
    await item.updateComplete;

    expect(item.getAttribute('role')).toBe('menuitem');
    expect(item.tabIndex).toBe(-1); // roving default

    item.disabled = true;
    await item.updateComplete;
    expect(item.hasAttribute('disabled')).toBe(true);
    expect(item.getAttribute('aria-disabled')).toBe('true');

    item.variant = 'destructive';
    await item.updateComplete;
    expect(item.getAttribute('variant')).toBe('destructive');

    item.variant = 'nuclear' as 'default' | 'destructive';
    await item.updateComplete;
    expect(item.variant).toBe('default'); // garbage degrades, never throws
    expect(item.getAttribute('variant')).toBe('default');
  });

  it('an item outside a menu renders but dispatches nothing on click (mediated activation)', async () => {
    const item = new TkMenuItem();
    item.textContent = 'Одинокая строка';
    document.body.appendChild(item);
    await item.updateComplete;
    const heard: string[] = [];
    item.addEventListener('select', () => heard.push('select'));
    item.click();
    expect(heard).toEqual([]);
  });
});

describe('tk-menu-divider', () => {
  it('is role=separator by construction', async () => {
    const divider = new TkMenuDivider();
    document.body.appendChild(divider);
    await divider.updateComplete;
    expect(divider.getAttribute('role')).toBe('separator');
  });
});
