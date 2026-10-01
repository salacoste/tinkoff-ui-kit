// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';

import { TkAccordion } from './accordion.js';
import { TkAccordionItem } from './accordion-item.js';

/**
 * tk-accordion + tk-accordion-item unit tests (spec 21.1): the APG
 * disclosure contract (real button header, aria-expanded, NO aria-controls),
 * the §9 open/open-change channel (flip-only firing, first-pass silence,
 * quiet teardown), the region panel semantics and the css structural pins.
 * Pixel truth (hairline dividers, 56px rows, chevron flip) lives in the
 * Playwright harness baselines; axe on the open state rides every story.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkAccordion | TkAccordionItem): Promise<unknown> =>
  (el as TkAccordionItem).updateComplete;

const mountItem = async (slotted = '<span slot="summary">Вопрос</span>Ответ'): Promise<TkAccordionItem> => {
  const el = new TkAccordionItem();
  el.innerHTML = slotted;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const headerButton = (el: TkAccordionItem): HTMLButtonElement | null =>
  el.shadowRoot?.querySelector('button.item__header') ?? null;

const panel = (el: TkAccordionItem): Element | null =>
  el.shadowRoot?.querySelector('.item__panel') ?? null;

describe('tk-accordion-item', () => {
  it('registers as tk-accordion-item exposing TkAccordionItem', async () => {
    await customElements.whenDefined('tk-accordion-item');
    expect(customElements.get('tk-accordion-item')).toBe(TkAccordionItem);
  });

  it('renders a real BUTTON header (type=button) — the APG disclosure trigger; NO aria-controls anywhere', async () => {
    const el = await mountItem();
    const btn = headerButton(el);
    expect(btn).not.toBeNull();
    expect(btn?.tagName).toBe('BUTTON');
    expect(btn?.getAttribute('type')).toBe('button');
    expect(btn?.getAttribute('aria-expanded')).toBe('false');
    expect(el.shadowRoot?.querySelector('[aria-controls]')).toBeNull();
    // Enter/Space/click is the native button contract — the button IS the
    // keyboard surface; no keydown duplicate is authored (see render()).
  });

  it('click toggles open: aria-expanded syncs, the attribute reflects (§9)', async () => {
    const el = await mountItem();
    headerButton(el)?.click();
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(el.getAttribute('open')).toBe('');
    expect(headerButton(el)?.getAttribute('aria-expanded')).toBe('true');

    headerButton(el)?.click();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(el.hasAttribute('open')).toBe(false);
    expect(headerButton(el)?.getAttribute('aria-expanded')).toBe('false');
  });

  it('open-change fires on every actual FLIP — composed, bubbling, { value } detail', async () => {
    const el = await mountItem();
    const seen: Array<{ value: boolean; composed: boolean; bubbles: boolean }> = [];
    el.addEventListener('open-change', (event) => {
      const e = event as CustomEvent<{ value: boolean }>;
      seen.push({ value: e.detail.value, composed: e.composed, bubbles: e.bubbles });
    });

    el.open = true;
    await elementUpdated(el);
    el.open = true; // not a flip — silent
    await elementUpdated(el);
    el.open = false;
    await elementUpdated(el);

    expect(seen).toEqual([
      { value: true, composed: true, bubbles: true },
      { value: false, composed: true, bubbles: true },
    ]);
  });

  it('open-change is SILENT at initial mount whatever set open (§9 first-pass rule)', async () => {
    const el = new TkAccordionItem();
    el.open = true; // early property assignment — before the first render pass
    const spy = vi.fn();
    el.addEventListener('open-change', spy);
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(spy).not.toHaveBeenCalled();

    // The attribute-at-upgrade path reads the same silence.
    const host = document.createElement('div');
    host.innerHTML = '<tk-accordion-item open><span slot="summary">Q</span>A</tk-accordion-item>';
    document.body.appendChild(host);
    const attrEl = host.querySelector('tk-accordion-item') as TkAccordionItem;
    const attrSpy = vi.fn();
    attrEl.addEventListener('open-change', attrSpy);
    await elementUpdated(attrEl);
    expect(attrEl.open).toBe(true);
    expect(attrSpy).not.toHaveBeenCalled();
  });

  it('tears down quietly: disconnecting an open item closes it without dispatching', async () => {
    const el = await mountItem();
    el.open = true;
    await elementUpdated(el);
    const spy = vi.fn();
    el.addEventListener('open-change', spy);
    el.remove();
    expect(el.open).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('the panel is a named region: role=region, aria-label mirrored from the summary slot, hidden while closed', async () => {
    const el = await mountItem('<span slot="summary">Как открыть брокерский счёт</span>Через несколько минут.');
    const region = panel(el);
    expect(region?.getAttribute('role')).toBe('region');
    expect(region?.getAttribute('aria-label')).toBe('Как открыть брокерский счёт');
    expect(region?.hasAttribute('hidden')).toBe(true);

    el.open = true;
    await elementUpdated(el);
    expect(panel(el)?.hasAttribute('hidden')).toBe(false);

    // The panel node stays in the DOM in every state (hidden, never absent)
    // so the default slot keeps firing slotchange (the progress-bar lesson).
    expect(el.shadowRoot?.querySelector('.item__panel slot:not([name])')).not.toBeNull();
  });

  it('an empty summary degrades to the placeholder label, never an unnamed region', async () => {
    const el = await mountItem('<span slot="summary">   </span>Ответ');
    expect(panel(el)?.getAttribute('aria-label')).toBe('Раскрываемая секция');
  });

  it('slots: summary projects into the header, the default slot into the panel', async () => {
    const el = await mountItem();
    const summarySlot = el.shadowRoot?.querySelector('slot[name="summary"]');
    const summaryAssigned = (summarySlot?.assignedNodes({ flatten: true }) ?? []).map(
      (node) => node.textContent ?? '',
    );
    expect(summaryAssigned.join('')).toContain('Вопрос');

    el.open = true;
    await elementUpdated(el);
    const bodySlot = el.shadowRoot?.querySelector('.item__panel slot:not([name])');
    const bodyAssigned = (bodySlot?.assignedNodes({ flatten: true }) ?? []).map(
      (node) => node.textContent ?? '',
    );
    expect(bodyAssigned.join('')).toContain('Ответ');
  });

  it('ships the row wiring: 44px floor, body-m bold header, hooks, chevron flip, hidden restates (structural)', () => {
    // Strip comments first: cssText keeps them, and the FLAT ruling is
    // worded IN a comment (the pin-trap lesson — substring pins hit prose).
    const css = TkAccordionItem.styles
      .map((style) => (style as { cssText?: string }).cssText ?? '')
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    expect(css).toContain('min-height: 44px');
    expect(css).toContain('font-weight: var(--tk-text-body-m-bold-weight)');
    expect(css).toContain('color: var(--tk-accordion-chevron-color, var(--tk-color-gray-400))');
    expect(css).toContain(
      'background: var(--tk-accordion-row-hover, var(--tk-color-surface-row-hover))',
    );
    expect(css).toContain('outline: 2px solid var(--tk-color-focus-ring)');
    expect(css).toContain(':host([open]) .item__chevron {');
    expect(css).toContain('.item__panel[hidden]');
    expect(css).toContain(':host([hidden])');
    // The atom stays interaction-honest: hover exists on the row only, the
    // chevron never turns a pointer/cursor of its own beyond the button.
    expect(css).not.toContain('transition');
  });
});

describe('tk-accordion', () => {
  it('registers as tk-accordion exposing TkAccordion', async () => {
    await customElements.whenDefined('tk-accordion');
    expect(customElements.get('tk-accordion')).toBe(TkAccordion);
  });

  it('renders the .accordion flow container with a default slot — no roles, no behavior of its own', async () => {
    const el = new TkAccordion();
    el.innerHTML = '<tk-accordion-item><span slot="summary">Q</span>A</tk-accordion-item>';
    document.body.appendChild(el);
    await elementUpdated(el);
    const box = el.shadowRoot?.querySelector('.accordion');
    expect(box).not.toBeNull();
    expect(el.shadowRoot?.querySelector('slot:not([name])')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('[role]')).toBeNull();
    // The container does not swallow the item's channel.
    const item = el.querySelector('tk-accordion-item') as TkAccordionItem;
    expect(item.tagName).toBe('TK-ACCORDION-ITEM');
  });

  it('paints dividers BETWEEN rows, not around (::slotted :not(:last-child)) (structural)', () => {
    const css = TkAccordion.styles
      .map((style) => (style as { cssText?: string }).cssText ?? '')
      .join('\n');
    expect(css).toContain('.accordion ::slotted(tk-accordion-item:not(:last-child))');
    expect(css).toContain(
      'border-bottom: 1px solid var(--tk-accordion-divider-color, var(--tk-color-border-default))',
    );
    expect(css).toContain(':host([hidden])');
  });
});
