// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkBadge } from './badge.js';

/**
 * tk-badge unit tests (spec 3.2): count capping (0/99/100/1000), variant
 * application + clamping, the no-interactive-surface guarantee (span, no
 * tabindex, no role), slot-vs-prop precedence and the count-wins ruling.
 * Real pixel measurements (22px pill height, green-100/ink pair) live in
 * the Playwright harness and .playwright-cli/verify/badge/.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkBadge): Promise<unknown> => el.updateComplete;

const mount = async (
  props: Record<string, unknown> = {},
  slotted?: string,
): Promise<TkBadge> => {
  const el = new TkBadge();
  Object.assign(el, props);
  if (slotted !== undefined) el.textContent = slotted;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const countCell = (el: TkBadge): Element | null =>
  el.shadowRoot?.querySelector('.badge__count') ?? null;

const labelCell = (el: TkBadge): Element | null =>
  el.shadowRoot?.querySelector('.badge__label') ?? null;

describe('tk-badge', () => {
  it('registers as tk-badge exposing TkBadge', async () => {
    await customElements.whenDefined('tk-badge');
    expect(customElements.get('tk-badge')).toBe(TkBadge);
  });

  it('renders a plain SPAN — never interactive: no tabindex, no role, no focus stop (I/O matrix)', async () => {
    const el = await mount({ count: 7 });
    const interactive = el.shadowRoot?.querySelector('[tabindex], [role], button, a, input');
    expect(interactive, 'no interactive surface exists in the shadow root').toBeNull();
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.hasAttribute('role')).toBe(false);
    const badge = el.shadowRoot?.querySelector('.badge');
    expect(badge?.tagName).toBe('SPAN');
    // Clicking/tapping does nothing — no affordance exists to begin with
    // (no cursor, no hover state): the badge is inert by construction.
    let clicked = false;
    el.addEventListener('click', () => {
      clicked = true;
    });
    el.click();
    expect(clicked, 'a host click passes through untouched — the badge adds no behavior').toBe(
      true,
    );
  });

  it('applies the default variant as a reflected host attribute and clamps invalid values (CONVENTIONS §2)', async () => {
    const el = await mount({ label: '+20%' });
    expect(el.variant).toBe('incentive');
    expect(el.getAttribute('variant')).toBe('incentive');

    el.variant = 'stat';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('stat');

    el.variant = 'bogus' as unknown as TkBadge['variant'];
    await elementUpdated(el);
    expect(el.variant, 'clamps to the union default').toBe('incentive');
    expect(el.getAttribute('variant'), 'reflected attribute corrected').toBe('incentive');

    el.setAttribute('variant', 'nope');
    await elementUpdated(el);
    expect(el.variant, 'attribute path clamps too').toBe('incentive');
  });

  // --- The count cap (matrix: 0 renders «0», >99 renders «99+») -------------

  it('count=0 renders a VISIBLE «0» — zero is information', async () => {
    const el = await mount({ count: 0 });
    expect(countCell(el)?.textContent).toBe('0');
    expect(countCell(el)?.hasAttribute('hidden')).toBe(false);
    expect(labelCell(el)?.hasAttribute('hidden')).toBe(true);
  });

  it('count=99 renders «99» (the cap boundary is exclusive)', async () => {
    const el = await mount({ count: 99 });
    expect(countCell(el)?.textContent).toBe('99');
  });

  it('count=100 renders «99+»', async () => {
    const el = await mount({ count: 100 });
    expect(countCell(el)?.textContent).toBe('99+');
  });

  it('count=1000 renders «99+»', async () => {
    const el = await mount({ count: 1000 });
    expect(countCell(el)?.textContent).toBe('99+');
  });

  it('a count attribute converts through Lit\'s Number converter; NaN reads as absent (label path)', async () => {
    const el = new TkBadge();
    el.setAttribute('count', '7');
    el.label = 'Метка';
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(countCell(el)?.textContent).toBe('7');

    el.setAttribute('count', 'abc');
    await elementUpdated(el);
    expect(el.count).toBeNaN();
    expect(countCell(el)?.hasAttribute('hidden'), 'non-finite count hides the count cell').toBe(
      true,
    );
    expect(labelCell(el)?.textContent).toContain('Метка');
  });

  it('count never reflects as an attribute (number data — CONVENTIONS §2)', async () => {
    const el = await mount({ count: 42 });
    expect(el.hasAttribute('count')).toBe(false);
    el.count = 100;
    await elementUpdated(el);
    expect(el.hasAttribute('count')).toBe(false);
  });

  // --- Label modes: slot wins over prop; count wins over both ----------------

  it('the label prop renders when the slot carries no real content', async () => {
    const el = await mount({ label: '+20%' });
    expect(labelCell(el)?.textContent).toContain('+20%');
    expect(countCell(el)?.hasAttribute('hidden')).toBe(true);
  });

  it('real slotted content wins over the label prop (matrix: slot wins)', async () => {
    const el = await mount({ label: 'проигрывает' }, '+20% кэшбека');
    const projected = (el.shadowRoot?.querySelector('slot:not([name])')?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('+20% кэшбека');
    expect(labelCell(el)?.textContent, 'the prop fallback is suppressed').not.toContain(
      'проигрывает',
    );
  });

  it('empty slot text does NOT suppress the label prop (template whitespace is not content)', async () => {
    const el = await mount({ label: 'Бонус' }, '   ');
    expect(labelCell(el)?.textContent).toContain('Бонус');
  });

  it('count WINS over slotted content while set; removing it restores the label cell', async () => {
    const el = await mount({ count: 120 }, '+20%');
    expect(countCell(el)?.textContent).toBe('99+');
    expect(labelCell(el)?.hasAttribute('hidden'), 'the label cell hides in count mode').toBe(true);
    // The slot stays in the (hidden) label cell so presence detection never
    // goes blind — unprojected it is not; hidden subtrees are unrendered.
    expect(el.shadowRoot?.querySelector('slot:not([name])')).not.toBeNull();

    el.count = undefined;
    await elementUpdated(el);
    expect(countCell(el)?.hasAttribute('hidden')).toBe(true);
    expect(labelCell(el)?.hasAttribute('hidden')).toBe(false);
    const projected = (el.shadowRoot?.querySelector('slot:not([name])')?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('+20%');
  });

  it('ships the pill + pairing wiring: radius-full, body-xs, the 2.1 ink-on-green pair (structural)', () => {
    const css = TkBadge.styles
      .map((style) => (style as { cssText?: string }).cssText ?? '')
      .join('\n');
    expect(css).toContain('border-radius: var(--tk-radius-full)');
    expect(css).toContain('var(--tk-text-body-xs-size)');
    expect(css).toContain('min-height: 22px');
    expect(css).toContain(":host([variant='incentive']) .badge {");
    const incentiveBlock = css.slice(css.indexOf(":host([variant='incentive']) .badge {"));
    expect(incentiveBlock).toContain('background: var(--tk-color-green-100)');
    expect(incentiveBlock).toContain('color: var(--tk-color-text-on-primary)');
    const statBlock = css.slice(css.indexOf(":host([variant='stat']) .badge {"));
    expect(statBlock).toContain('background: var(--tk-color-ink-300)');
    expect(statBlock).toContain('color: var(--tk-color-white)');
    // No interactive affordance exists in the sheet.
    expect(css).not.toContain('cursor');
    expect(css).not.toContain(':hover');
  });
});
