// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { kvListItemStyles, kvListStyles } from './kv-list.css.js';
import { TkKvList } from './kv-list.js';
import { TkKvListItem } from './kv-list-item.js';
import './kv-list.js';
import './kv-list-item.js';

/**
 * tk-kv-list unit tests (spec 22.4): the atom's render anatomy (label
 * prop/slot, value slot, role semantics), the hint wiring (button →
 * tk-tooltip → aria-describedby), the stateless no-channel contract, and
 * the structural pins (divider/hook layer, the measured typography, the
 * hint roundel) asserted against the cssText / DOM the way the accordion
 * and data-table suites pin their sheets.
 */

const elementUpdated = (el: TkKvList | TkKvListItem | (Element & { updateComplete: Promise<unknown> })): Promise<unknown> =>
  (el as { updateComplete: Promise<unknown> }).updateComplete;

describe('tk-kv-list', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-kv-list / tk-kv-list-item exposing TkKvList / TkKvListItem', async () => {
    await customElements.whenDefined('tk-kv-list');
    await customElements.whenDefined('tk-kv-list-item');
    expect(customElements.get('tk-kv-list')).toBe(TkKvList);
    expect(customElements.get('tk-kv-list-item')).toBe(TkKvListItem);
  });

  it('container asserts role="list" (the AC4 ruling — dl cannot cross the slot boundary); bare slot flow, no wrapper semantics', async () => {
    const el = await mountList(`
      <tk-kv-list-item label="Купон" hint="x"><span slot="value">Фиксированный</span></tk-kv-list-item>
    `);
    expect(el.getAttribute('role')).toBe('list');
    const slot = el.shadowRoot?.querySelector('.list slot');
    expect(slot, 'the rows arrive through the default slot (the accordion mold)').toBeInstanceOf(HTMLSlotElement);
    // The live block's heading is consumer-side — the atom renders no heading node.
    expect(el.shadowRoot?.querySelector('h1,h2,h3,h4,summary')).toBeNull();
  });

  it('divider: the container paints hairlines BETWEEN slotted rows only (structural pin)', async () => {
    const cssText = strip(kvListStyles.cssText);
    expect(cssText).toMatch(
      /::slotted\(tk-kv-list-item:not\(:last-child\)\)\s*\{[^}]*border-bottom:\s*1px solid var\(--tk-kv-list-divider,\s*var\(--tk-color-border-table\)\)/,
    );
    // No divider around the block (the accordion «between, not around»).
    expect(cssText).not.toMatch(/::slotted\(tk-kv-list-item\)/);
  });
});

describe('tk-kv-list-item', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the label prop as the slot fallback and the value slot right-aligned (the one-line anatomy)', async () => {
    const el = await mountItem({
      attributes: { label: 'Номинал' },
      html: '<span slot="value">149 357,55868 ₽</span>',
    });
    expect(el.getAttribute('role')).toBe('listitem');
    const labelSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');
    expect(labelSlot?.assignedNodes({ flatten: true })).toHaveLength(0); // no slotted label — the fallback paints
    expect(labelSlot?.textContent).toBe('Номинал');
    const valueSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('.item__value slot[name="value"]');
    expect(valueSlot?.assignedElements({ flatten: true })[0]?.textContent).toBe('149 357,55868 ₽');
    // Structural: the value zone is the flush-right arm of a space-between row.
    const cssText = strip(kvListItemStyles.cssText);
    expect(cssText).toMatch(/\.item\s*\{[^}]*justify-content:\s*space-between/);
    expect(cssText).toMatch(/\.item__value\s*\{[^}]*text-align:\s*end/);
  });

  it('the label slot OVERRIDES the prop (slotted content wins — the fallback mold)', async () => {
    const el = await mountItem({
      attributes: { label: 'проп-лейбл', hint: 'Подсказка' },
      html: '<span slot="label">Слот-лейбл</span><span slot="value">1</span>',
    });
    await settle();
    const labelSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');
    expect(labelSlot?.assignedElements({ flatten: true })).toHaveLength(1);
    expect(labelSlot?.assignedElements({ flatten: true })[0]?.textContent).toBe('Слот-лейбл');
    // The synced slot text feeds the hint button's accessible name.
    const button = el.shadowRoot?.querySelector('.item__hint');
    expect(button?.getAttribute('aria-label')).toBe('Подсказка: Слот-лейбл');
  });

  it('hint renders the roundel BUTTON inside the kit tk-tooltip; aria-describedby is wired by the tooltip itself', async () => {
    const el = await mountItem({
      attributes: { label: 'Доходность к погашению', hint: 'Доходность с учётом цены покупки — вымышленная справка.' },
      html: '<span slot="value">14,70 %</span>',
    });
    const tooltip = el.shadowRoot?.querySelector('tk-tooltip');
    expect(tooltip, 'the hint composes the EXISTING tk-tooltip (no duplicate surface)').toBeInstanceOf(Element);
    expect((tooltip as { content: string }).content).toBe('Доходность с учётом цены покупки — вымышленная справка.');
    const button = el.shadowRoot?.querySelector('.item__hint');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Подсказка: Доходность к погашению');
    // A hint is a DESCRIPTION, not a disclosure — no aria-expanded ever.
    expect(button?.hasAttribute('aria-expanded')).toBe(false);
    // The tooltip wired describedby to its generated surface (eager, firstUpdated).
    await elementUpdated(tooltip as Element);
    const describedBy = button?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(tooltip?.shadowRoot?.getElementById(describedBy ?? '')?.getAttribute('role')).toBe('tooltip');
  });

  it('no hint (or empty string) renders NO icon, NO button, NO tab stop', async () => {
    const plain = await mountItem({
      attributes: { label: 'Дата выплаты' },
      html: '<span slot="value">23.06.2027</span>',
    });
    expect(plain.shadowRoot?.querySelector('.item__hint')).toBeNull();
    expect(plain.shadowRoot?.querySelector('tk-tooltip')).toBeNull();
    const emptyHint = await mountItem({
      attributes: { label: 'Дата выплаты', hint: '' },
      html: '<span slot="value">23.06.2027</span>',
    });
    expect(emptyHint.shadowRoot?.querySelector('.item__hint')).toBeNull();
    expect(emptyHint.shadowRoot?.querySelector('tk-tooltip')).toBeNull();
  });

  it('clicking the hint toggles the tooltip — the composed transit, the row itself dispatches nothing', async () => {
    const el = await mountItem({
      attributes: { label: 'НКД', hint: 'Справка' },
      html: '<span slot="value">195 327,05088 ₽</span>',
    });
    const tooltip = el.shadowRoot?.querySelector('tk-tooltip') as (Element & { open: boolean }) | null;
    const button = el.shadowRoot?.querySelector('.item__hint');
    expect(tooltip?.open ?? false).toBe(false);
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    await elementUpdated(tooltip as Element);
    expect(tooltip?.open, 'the tooltip owns the interaction (its click-toggle contract)').toBe(true);
    // Any open-change crossing the row ORIGINATES at the tooltip host — the
    // row is a transit point, never the author (stateless no-entry).
    const heard: Element[] = [];
    el.addEventListener('open-change', (event: Event) => {
      heard.push(event.target as Element);
    });
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    await elementUpdated(tooltip as Element);
    expect(heard.map((target) => target.tagName)).toEqual(['TK-TOOLTIP']);
    expect(tooltip?.open).toBe(false);
  });

  it('degrades on degenerate input: nullish label/hint and an empty value slot never throw (§2)', async () => {
    const el = await mountItem({ html: '' });
    expect(el.shadowRoot?.querySelector('.item__label slot')).toBeInstanceOf(HTMLSlotElement);
    expect(el.shadowRoot?.querySelector('.item__value slot[name="value"]')).toBeInstanceOf(HTMLSlotElement);
    // No hint button when the hint prop is absent entirely.
    expect(el.shadowRoot?.querySelector('.item__hint')).toBeNull();
  });

  it('structural pins: the measured row anatomy + hook layer (tokens only, NO mint)', () => {
    const cssText = strip(kvListItemStyles.cssText);
    // Row rhythm: padding-block 4 + the 24px capture-literal line box = the
    // measured 33px pitch family; rows grow instead of clipping (§2).
    expect(cssText).toMatch(/\.item\s*\{[^}]*padding:\s*var\(--tk-space-4\) 0/);
    // Label: body-m regular on the label hook (measured gray #8d8d8d → text-secondary).
    expect(cssText).toMatch(
      /\.item__label\s*\{[^}]*color:\s*var\(--tk-kv-list-label,\s*var\(--tk-color-text-secondary\)\)/,
    );
    // Value: body-m bold flush right on the value hook (measured near-black #21201f).
    expect(cssText).toMatch(
      /\.item__value\s*\{[^}]*font-weight:\s*var\(--tk-text-body-m-bold-weight\)[^}]*color:\s*var\(--tk-kv-list-value,\s*var\(--tk-color-text-primary\)\)/,
    );
    // Roundel: 16px capture literal, gray-400 through the icon hook, white glyph,
    // full radius, the measured ≈8px gap on the gap hook.
    expect(cssText).toMatch(
      /\.item__hint\s*\{[^}]*background:\s*var\(--tk-kv-list-icon,\s*var\(--tk-color-gray-400\)\)/,
    );
    expect(cssText).toMatch(/\.item__hint\s*\{[^}]*color:\s*var\(--tk-color-white\)/);
    expect(cssText).toMatch(/\.item__hint\s*\{[^}]*width:\s*16px[^}]*border-radius:\s*var\(--tk-radius-full\)/);
    expect(cssText).toMatch(/\.item__label\s*\{[^}]*gap:\s*var\(--tk-kv-list-gap,\s*var\(--tk-space-8\)\)/);
    // 44px hit area around the 16px glyph (WCAG 2.5.5 floor — the stitch trick).
    expect(cssText).toMatch(/\.item__hint::after\s*\{[^}]*inset:\s*-14px/);
    // The unified focus ring (button.css.ts).
    expect(cssText).toMatch(/\.item__hint:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--tk-color-focus-ring\)/);
    // The hook family is exactly the spec's five (divider lives in the
    // container sheet) — no new --tk-color- mints.
    const hooks = new Set(
      [...`${strip(kvListStyles.cssText)}\n${cssText}`.matchAll(/var\((--tk-kv-list-[a-z]+)/g)].map((m) => m[1]),
    );
    expect([...hooks].sort()).toEqual([
      '--tk-kv-list-divider',
      '--tk-kv-list-gap',
      '--tk-kv-list-icon',
      '--tk-kv-list-label',
      '--tk-kv-list-value',
    ]);
  });
});

// --- helpers -------------------------------------------------------------------

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const strip = (text: string): string => text.replace(/\/\*[\s\S]*?\*\//g, '');

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

interface MountItemOptions {
  attributes?: Record<string, string>;
  /** Light-DOM children set BEFORE the element connects (slotchange-safe). */
  html?: string;
}

const mountItem = async ({ attributes, html = '' }: MountItemOptions = {}): Promise<TkKvListItem> => {
  const el = document.createElement('tk-kv-list-item');
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  el.innerHTML = html;
  document.body.appendChild(el);
  await elementUpdated(el);
  await settle(); // let the child tooltip's first render + firstUpdated run
  return el;
};

const mountList = async (html: string): Promise<TkKvList> => {
  const el = document.createElement('tk-kv-list');
  el.innerHTML = html;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};
