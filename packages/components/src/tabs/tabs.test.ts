// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkTabs } from './tabs.js';
import type { TkTab } from './tabs.js';
import { tabsStyles } from './tabs.css.js';

/**
 * tk-tabs unit tests (spec 3.3): the seven I/O matrix rows — arrow cycle
 * (wrapping, automatic activation), skip-disabled (incl. all-disabled none +
 * inert), Home/End, Tab-into-panel (structural half; the live-engine half
 * lives in tests/visual/tabs.spec.ts), controlled strict/release (incl. the
 * unknown-value clamp to first), badge rendering, panel swap animation —
 * plus the §4 release/resume transitions, roving tabindex, aria wiring,
 * the duplicate-value clamp, and the NO-BAR-ANIMATION structural pin.
 *
 * Keyboard split (the tk-input/segmented-radio precedent): happy-dom runs no
 * native Tab traversal, so «Tab moves into the active panel» is pinned
 * STRUCTURALLY — the active panel is the only un-hidden one and follows the
 * bar in tree order, so natural tab order lands in it (and an empty panel
 * passes focus through: nothing focusable exists). The arrow/Home/End paths
 * ARE the element's own handlers and run fully here.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkTabs): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: the tabs clamp dev-warns, Lit dev-mode may warn. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

/** The reference switcher (tbank.ru capture tabs-switcher.png): 3 tabs. */
const CARDS: TkTab[] = [
  { value: 'debit', label: 'Дебетовая карта' },
  { value: 'credit', label: 'Кредитная карта' },
  { value: 'deposit', label: 'Вклад' },
];

const THREE = [
  { value: 'all', label: 'Все' },
  { value: 'yes', label: 'Да', disabled: true },
  { value: 'no', label: 'Нет' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkTabs>>;
  attributes?: Record<string, string>;
  slotChildren?: number;
};

const mount = async ({ props, attributes, slotChildren = 0 }: MountOptions = {}): Promise<TkTabs> => {
  const el = new TkTabs();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  for (let i = 0; i < slotChildren; i += 1) {
    const panel = document.createElement('div');
    panel.setAttribute('slot', `tab-${i}`);
    panel.textContent = `panel-${i}`;
    el.appendChild(panel);
  }
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const tabButtons = (el: TkTabs): HTMLButtonElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tab[role="tab"]') ?? []),
];

const panels = (el: TkTabs): HTMLElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLElement>('[role="tabpanel"]') ?? []),
];

/** Index of the selected tab (-1 when none). */
const selectedIndex = (el: TkTabs): number =>
  tabButtons(el).findIndex((button) => button.getAttribute('aria-selected') === 'true');

/** The element's own arrow/Home/End handler — dispatches keydown on `from`'s button. */
const keydown = (el: TkTabs, from: number, key: string): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
  tabButtons(el)[from]?.dispatchEvent(event);
  return event;
};

/** Capture value-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkTabs): string[] => {
  const values: string[] = [];
  el.addEventListener('value-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: string }>;
    values.push(custom.detail.value);
  });
  return values;
};

describe('tk-tabs', () => {
  it('registers as tk-tabs exposing TkTabs', async () => {
    await customElements.whenDefined('tk-tabs');
    expect(customElements.get('tk-tabs')).toBe(TkTabs);
  });

  it('renders the tablist/tab/tabpanel structure with full aria wiring', async () => {
    const el = await mount({ props: { tabs: CARDS }, slotChildren: 3 });
    const track = el.shadowRoot?.querySelector('[role="tablist"]');
    expect(track, 'the track carries the tablist role').not.toBeNull();
    expect(track?.classList.contains('track')).toBe(true);

    const buttons = tabButtons(el);
    expect(buttons).toHaveLength(3);
    const renderedPanels = panels(el);
    expect(renderedPanels).toHaveLength(3);
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons[i];
      expect(button.getAttribute('aria-controls')).toBe(renderedPanels[i]?.id);
      expect(button.getAttribute('aria-selected')).toBe(i === 0 ? 'true' : 'false');
      expect(button.textContent).toContain(CARDS[i]?.label);
      expect(renderedPanels[i]?.getAttribute('aria-labelledby')).toBe(button.id);
      expect(renderedPanels[i]?.querySelector('slot')?.getAttribute('name')).toBe(`tab-${i}`);
      // The bar precedes the panels in tree order (Tab: bar → active panel).
      expect(button.compareDocumentPosition(renderedPanels[i]!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
    // id wiring resolves INSIDE the shadow tree (the select lesson).
    expect(el.shadowRoot?.getElementById(buttons[0]!.id)).toBe(buttons[0]);
    expect(el.shadowRoot?.getElementById(renderedPanels[0]!.id)).toBe(renderedPanels[0]);
  });

  it('projects panel content through the per-index named slots (the consumer recipe)', async () => {
    const el = await mount({ props: { tabs: CARDS }, slotChildren: 3 });
    const renderedPanels = panels(el);
    for (let i = 0; i < renderedPanels.length; i += 1) {
      const slot = renderedPanels[i]?.querySelector('slot');
      const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
      expect(assigned.some((node) => node.textContent === `panel-${i}`), `slot tab-${i} receives panel-${i}`).toBe(
        true,
      );
    }
  });

  // --- Matrix row 1: arrow cycle + wrap + automatic activation ---------------

  it('ArrowRight/ArrowDown move focus AND selection (automatic activation); value-change emits composed', async () => {
    const el = await mount({ props: { tabs: CARDS } });
    const values = collectValues(el);
    const parentHeard: string[] = [];
    el.parentElement?.addEventListener('value-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      parentHeard.push(custom.detail.value);
      expect(custom.composed).toBe(true);
    });

    const event = keydown(el, 0, 'ArrowRight');
    expect(event.defaultPrevented, 'the element owns the arrow (UA scroll suppressed)').toBe(true);
    await elementUpdated(el);

    expect(values).toEqual(['credit']);
    expect(parentHeard).toEqual(['credit']);
    expect(selectedIndex(el)).toBe(1);
    expect(el.shadowRoot?.activeElement, 'focus moved within the bar (document.activeElement is the host in shadow DOM)').toBe(
      tabButtons(el)[1],
    );
    expect(el.value).toBeUndefined(); // uncontrolled: the channel stays free
    expect(el.activeIndex).toBe(1); // derived parity view

    // ArrowDown behaves as next too — and WRAPS from the last tab back to
    // the first, selecting it (Left/Up mirror).
    keydown(el, 2, 'ArrowDown');
    await elementUpdated(el);
    expect(values).toEqual(['credit', 'debit']);
    expect(selectedIndex(el)).toBe(0);
  });

  it('arrows WRAP at the edges (last → first, first → last)', async () => {
    const el = await mount({ props: { tabs: CARDS, defaultValue: 'deposit' } });
    const values = collectValues(el);

    keydown(el, 2, 'ArrowRight'); // last → wraps to first
    await elementUpdated(el);
    expect(values).toEqual(['debit']);
    expect(selectedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement).toBe(tabButtons(el)[0]);

    keydown(el, 0, 'ArrowLeft'); // first → wraps to last
    await elementUpdated(el);
    expect(values).toEqual(['debit', 'deposit']);
    expect(selectedIndex(el)).toBe(2);
  });

  it('single tab: arrows are inert — owned (preventDefaulted) but nothing moves or emits', async () => {
    const el = await mount({ props: { tabs: [{ value: 'solo', label: 'Соло' }] } });
    const values = collectValues(el);
    const event = keydown(el, 0, 'ArrowRight');
    expect(event.defaultPrevented).toBe(true);
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(selectedIndex(el)).toBe(0);
  });

  it('unhandled keys pass through untouched (Tab owns traversal, Space/Enter are plain)', async () => {
    const el = await mount({ props: { tabs: CARDS } });
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true, cancelable: true });
    tabButtons(el)[0]?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true, cancelable: true });
    tabButtons(el)[0]?.dispatchEvent(space);
    expect(space.defaultPrevented).toBe(false);
  });

  // --- Matrix row 2: skip disabled; all-disabled none + inert ------------------

  it('disabled tabs are skipped by arrows in BOTH directions and are not focusable', async () => {
    const el = await mount({ props: { tabs: THREE, defaultValue: 'all' } });
    const values = collectValues(el);
    expect(tabButtons(el)[1]?.disabled, 'native disabled: not focusable, not clickable').toBe(true);

    keydown(el, 0, 'ArrowRight'); // middle is disabled → lands on last
    await elementUpdated(el);
    expect(values).toEqual(['no']);
    expect(selectedIndex(el)).toBe(2);

    keydown(el, 2, 'ArrowLeft'); // back: skips the disabled middle again
    await elementUpdated(el);
    expect(values).toEqual(['no', 'all']);
    expect(selectedIndex(el)).toBe(0);
  });

  it('all-disabled tabs: NONE selected, no tab stop, arrows inert', async () => {
    const el = await mount({
      props: {
        tabs: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    });
    expect(selectedIndex(el)).toBe(-1);
    expect(el.activeIndex).toBe(-1);
    expect(tabButtons(el).map((button) => button.getAttribute('tabindex'))).toEqual(['-1', '-1']);
    expect(panels(el).every((panel) => panel.hidden), 'no panel shows without a selection').toBe(true);
    // Synthetic dispatch (disabled buttons never focus in a real engine, but
    // the handler itself must stay inert): owned, nothing emits.
    const values = collectValues(el);
    const event = keydown(el, 0, 'ArrowRight');
    expect(event.defaultPrevented).toBe(true);
    await elementUpdated(el);
    expect(values).toEqual([]);
  });

  // --- Matrix row 3: Home/End ----------------------------------------------------

  it('Home/End jump to the first/last ENABLED tab — selected AND focused', async () => {
    const el = await mount({ props: { tabs: THREE, defaultValue: 'no' } });
    const values = collectValues(el);

    keydown(el, 2, 'Home');
    await elementUpdated(el);
    expect(values).toEqual(['all']);
    expect(selectedIndex(el)).toBe(0);
    expect(el.shadowRoot?.activeElement).toBe(tabButtons(el)[0]);

    keydown(el, 0, 'End');
    await elementUpdated(el);
    expect(values).toEqual(['all', 'no']);
    expect(selectedIndex(el)).toBe(2);
    expect(el.shadowRoot?.activeElement).toBe(tabButtons(el)[2]);

    // Disabled edges: Home/End still land on ENABLED tabs.
    const disabledEdge = await mount({
      props: {
        tabs: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C', disabled: true },
          { value: 'd', label: 'D' },
        ],
        defaultValue: 'd',
      },
    });
    keydown(disabledEdge, 3, 'Home');
    await elementUpdated(disabledEdge);
    expect(selectedIndex(disabledEdge)).toBe(1); // first enabled, not index 0
    keydown(disabledEdge, 1, 'End');
    await elementUpdated(disabledEdge);
    expect(selectedIndex(disabledEdge)).toBe(3); // last enabled
  });

  // --- Matrix row 4: Tab into the active panel (structural half) ------------------

  it('only the ACTIVE panel is un-hidden — Tab order bar → active panel content, empty panel passes through', async () => {
    const el = await mount({ props: { tabs: CARDS }, slotChildren: 3 });
    expect(panels(el).map((panel) => panel.hidden)).toEqual([false, true, true]);

    keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(panels(el).map((panel) => panel.hidden)).toEqual([true, false, true]);

    // Empty panel: no projected nodes → nothing focusable inside, focus
    // passes through to whatever follows the element.
    const empty = await mount({ props: { tabs: CARDS }, slotChildren: 0 });
    expect((panels(empty)[0]?.querySelector('slot')?.assignedNodes({ flatten: true }) ?? []).length).toBe(0);
    expect(panels(empty)[0]?.hidden).toBe(false);
  });

  // --- Matrix row 5: controlled strict / release / unknown-value clamp ------------

  it('controlled selection: value-change emits, nothing mutates locally; DOM renders exactly value', async () => {
    const el = await mount({ props: { tabs: CARDS, value: 'debit' } });
    const values = collectValues(el);

    tabButtons(el)[2]?.click();
    expect(values).toEqual(['deposit']);
    expect(el.value).toBe('debit'); // strict: the channel is untouched
    expect(selectedIndex(el)).toBe(0); // …and the render keeps exactly value
    expect(panels(el).map((panel) => panel.hidden)).toEqual([false, true, true]);

    el.value = 'deposit'; // the consumer answers
    await elementUpdated(el);
    expect(selectedIndex(el)).toBe(2);
    expect(panels(el).map((panel) => panel.hidden)).toEqual([true, true, false]);
  });

  it('releasing value switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { tabs: CARDS, value: 'debit' } });
    el.value = 'credit';
    await elementUpdated(el);

    el.value = undefined; // release
    await elementUpdated(el);
    expect(selectedIndex(el)).toBe(1); // seeded from the LAST controlled value
    expect(el.value).toBeUndefined();

    const values = collectValues(el);
    keydown(el, 1, 'ArrowRight');
    await elementUpdated(el);
    expect(values).toEqual(['deposit']);
    expect(selectedIndex(el)).toBe(2);
  });

  it('a controlled value set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { tabs: CARDS, value: 'credit' } });
    el.value = undefined;
    await elementUpdated(el);

    el.value = 'debit';
    await elementUpdated(el);
    expect(selectedIndex(el)).toBe(0);

    tabButtons(el)[2]?.click(); // consumer-unanswered selection
    expect(selectedIndex(el)).toBe(0); // nothing applied locally
    expect(el.value).toBe('debit');
  });

  it('defaultValue seeds the uncontrolled state at connect; later mutations are ignored', async () => {
    const el = await mount({ props: { tabs: CARDS }, attributes: { 'default-value': 'credit' } });
    expect(selectedIndex(el)).toBe(1);
    el.defaultValue = 'deposit';
    await elementUpdated(el);
    expect(selectedIndex(el)).toBe(1); // initial-value semantics
  });

  it('value wins over defaultValue when both are set (controlled at first paint)', async () => {
    const el = await mount({
      props: { tabs: CARDS, value: 'deposit' },
      attributes: { 'default-value': 'credit' },
    });
    expect(selectedIndex(el)).toBe(2);
  });

  it('unknown/unset values CLAMP to the first enabled tab (the reference always shows an active switcher)', async () => {
    // Uncontrolled with no defaultValue: first tab active.
    const el = await mount({ props: { tabs: CARDS } });
    expect(selectedIndex(el)).toBe(0);
    expect(el.activeIndex).toBe(0);

    // Unmatched defaultValue degrades to the first enabled tab.
    const unmatchedDefault = await mount({
      props: { tabs: THREE },
      attributes: { 'default-value': 'zzz' },
    });
    expect(selectedIndex(unmatchedDefault)).toBe(0);

    // Unmatched CONTROLLED value: the render clamps to the first enabled
    // tab (CONVENTIONS §2 degrade — never a selection-less tablist).
    const unmatchedControlled = await mount({ props: { tabs: CARDS, value: 'zzz' } });
    expect(selectedIndex(unmatchedControlled)).toBe(0);
    expect(unmatchedControlled.value).toBe('zzz'); // the channel itself is untouched

    // A value pointing at a DISABLED tab degrades the same way.
    const disabledValue = await mount({ props: { tabs: THREE, value: 'yes' } });
    expect(selectedIndex(disabledValue)).toBe(0); // first enabled carries the state
  });

  it('clamps non-string channel input to its string form; null releases', async () => {
    const el = await mount({ props: { tabs: CARDS } });
    el.value = 123 as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBe('123'); // unmatched → clamps to first, no crash
    expect(selectedIndex(el)).toBe(0);

    el.value = null as unknown as string;
    await elementUpdated(el);
    expect(el.value).toBeNull();
    expect(selectedIndex(el)).toBe(0); // uncontrolled seed ('') → clamp
  });

  // --- Matrix row 6: badge rendering -----------------------------------------------

  it('a finite badge number renders a nested tk-badge (cap per Badge rules); non-finite does not', async () => {
    const el = await mount({
      props: {
        tabs: [
          { value: 'a', label: 'A', badge: 5 },
          { value: 'b', label: 'B', badge: 120 },
          { value: 'c', label: 'C', badge: Number.NaN },
          { value: 'd', label: 'D' },
        ],
      },
    });
    const badges = [
      ...(el.shadowRoot?.querySelectorAll('[role="tab"] tk-badge') ?? []),
    ] as Array<HTMLElement & { count?: number; shadowRoot?: ShadowRoot }>;
    expect(badges).toHaveLength(2); // NaN and absent render nothing
    expect(badges[0]?.count).toBe(5);
    expect(badges[0]?.shadowRoot?.querySelector('.badge__count')?.textContent).toBe('5');
    expect(badges[1]?.shadowRoot?.querySelector('.badge__count')?.textContent).toBe('99+');
    // The count joins the tab's ACCESSIBLE name — the name computation pierces
    // the nested badge's shadow root (raw textContent cannot; proven by role
    // queries in tests/visual/tabs.spec.ts).
    expect(tabButtons(el)[0]?.querySelector('tk-badge')).toBe(badges[0] ?? null);
  });

  // --- Matrix row 7: panel swap animates CONTENT ONLY (structural pin) -------------

  it('NO-BAR-ANIMATION pin: track and tabs carry no animation; only panel content animates', () => {
    // Comments are stripped first (the repo detector convention): comment
    // mentions of animation/transition are not declarations.
    const cssText = tabsStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    // Rule-block extraction: declarations guarded to the exact selectors.
    const declarationsOf = (selector: string): string => {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = cssText.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
      return match?.[1] ?? '';
    };

    const track = declarationsOf('.track');
    expect(track, 'the .track rule exists').not.toBe('');
    expect(track).not.toMatch(/\banimation\b/);
    expect(track).not.toMatch(/\btransition\b/);

    const tab = declarationsOf('.tab');
    expect(tab, 'the .tab rule exists').not.toBe('');
    expect(tab).not.toMatch(/\banimation\b/);
    const transition = tab.match(/\btransition:\s*([^;]+);/)?.[1] ?? '';
    expect(transition, 'the tab transition exists (the hover color step)').toMatch(/^color\s/);
    expect(transition, 'no swap channel ever transitions on the bar').not.toMatch(
      /background|box-shadow|transform|border/,
    );

    // The swap keyframes exist exactly once, referenced only by the visible
    // panel rule, and reduced-motion kills it explicitly.
    expect(cssText.match(/@keyframes\s+tk-tabs-panel-swap/g)).toHaveLength(1);
    const animationOccurrences = cssText.match(/\banimation:/g) ?? [];
    expect(animationOccurrences).toHaveLength(2); // the panel rule + the reduce override
    expect(declarationsOf('.panel:not([hidden])')).toMatch(/animation:\s*tk-tabs-panel-swap/);
    expect(cssText).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none/);
  });

  it('PANEL RHYTHM pin: the panel opens 24px below the track (margin-block-start --tk-space-24)', () => {
    // Same convention as the bar pin: comments stripped, declarations guarded
    // to the exact selector — the plain `.panel` rule (the `:not([hidden])`
    // sibling never matches `.panel` + whitespace/brace here).
    const cssText = tabsStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const panel = cssText.match(/\.panel\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(panel, 'the .panel rule exists').not.toBe('');
    expect(panel).toMatch(/margin-block-start:\s*var\(--tk-space-24\)/);
  });

  it('panel swap: activation flips hidden so the visible panel restarts its animation (the technique)', async () => {
    const el = await mount({ props: { tabs: CARDS }, slotChildren: 3 });
    // The rule targets .panel:not([hidden]) — the swap runs on CONTENT, and
    // the bar's static pin lives in the cssText assertion above.
    expect(panels(el)[0]?.matches('.panel:not([hidden])')).toBe(true);
    keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(panels(el)[1]?.matches('.panel:not([hidden])')).toBe(true);
    expect(panels(el)[0]?.hidden).toBe(true);
  });

  // --- Matrix extras: roving tabindex + aria wiring -----------------------------------

  it('roving tabindex: active tab 0, others -1; the stop moves with the selection; all-disabled → none', async () => {
    const el = await mount({ props: { tabs: THREE, defaultValue: 'all' } });
    expect(tabButtons(el).map((button) => button.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);

    keydown(el, 0, 'ArrowRight');
    await elementUpdated(el);
    expect(tabButtons(el).map((button) => button.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);

    // No defaultValue → the clamp picks the first ENABLED tab as the stop.
    const disabledFirst = await mount({
      props: {
        tabs: [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' },
        ],
      },
    });
    expect(disabledFirst.activeIndex).toBe(1);
    expect(tabButtons(disabledFirst).map((button) => button.getAttribute('tabindex'))).toEqual(['-1', '0']);
  });

  it('aria-selected tracks activation through clicks and controlled updates', async () => {
    const el = await mount({ props: { tabs: CARDS } });
    tabButtons(el)[1]?.click();
    await elementUpdated(el);
    expect(tabButtons(el).map((button) => button.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
    expect(el.activeIndex).toBe(1);

    el.value = 'deposit';
    await elementUpdated(el);
    expect(tabButtons(el).map((button) => button.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
    expect(el.activeIndex).toBe(2);
  });

  it('clicking the active tab is a no-op — nothing re-emits', async () => {
    const el = await mount({ props: { tabs: CARDS, defaultValue: 'credit' } });
    const values = collectValues(el);
    tabButtons(el)[1]?.click();
    await elementUpdated(el);
    expect(values).toEqual([]);
    expect(selectedIndex(el)).toBe(1);
  });

  // --- Clamps (CONVENTIONS §2) ----------------------------------------------------------

  it('duplicate tab VALUES clamp: later duplicates and value-less entries drop with a dev warn', async () => {
    const el = await mount({
      props: {
        tabs: [
          { value: 'debit', label: 'Дебетовая' },
          { value: 'debit', label: 'Дебетовая (дубль)' },
          { value: 'deposit', label: 'Вклад' },
          { value: '', label: 'Пусто' },
        ] as unknown as TkTab[],
      },
    });
    await elementUpdated(el); // the clamp schedules a follow-up update
    expect(tabButtons(el)).toHaveLength(2);
    expect(tabButtons(el).map((button) => button.textContent?.trim())).toEqual(['Дебетовая', 'Вклад']);
    expect(panels(el)).toHaveLength(2);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('null/empty tabs render an empty inert tablist — no crash, no tab stops', async () => {
    const el = await mount({ props: { tabs: null as unknown as TkTab[] } });
    expect(el.shadowRoot?.querySelector('[role="tablist"]')).not.toBeNull();
    expect(tabButtons(el)).toHaveLength(0);
    expect(el.activeIndex).toBe(-1);

    el.tabs = CARDS; // tabs arriving later render normally
    await elementUpdated(el);
    expect(tabButtons(el)).toHaveLength(3);
    expect(selectedIndex(el)).toBe(0);
  });

  it('value/defaultValue never reflect to attributes (data channels, CONVENTIONS §2)', async () => {
    const el = await mount({ props: { tabs: CARDS } });
    el.value = 'credit';
    el.defaultValue = 'deposit';
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.hasAttribute('default-value')).toBe(false);
    expect(el.hasAttribute('tabs')).toBe(false);
  });
});
