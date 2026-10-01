// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkEmptyState } from './empty-state.js';

/**
 * tk-empty-state unit tests (spec 21.3): the heading prop/slot override
 * machinery, the decorative disc contract (aria-hidden container, no
 * focus stop, nothing announced), the passive-action slot, and the
 * structural CSS pins (hook layer with token defaults, the disc
 * geometry/fill, the two measured gap families, the hidden guard).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkEmptyState): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkEmptyState> => {
  const el = new TkEmptyState();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkEmptyState.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-empty-state', () => {
  it('registers as tk-empty-state exposing TkEmptyState', async () => {
    await customElements.whenDefined('tk-empty-state');
    expect(customElements.get('tk-empty-state')).toBe(TkEmptyState);
  });

  it('renders the heading prop and hides the heading block when empty (the service-card mold)', async () => {
    const el = await mount({ heading: 'Здесь пока пусто' });
    const heading = el.shadowRoot?.querySelector('h3.es__heading');
    expect(heading?.textContent).toContain('Здесь пока пусто');

    el.heading = undefined;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('h3.es__heading')).toBeNull();
    // The slot itself stays projected (hidden) so a LATER assignment can
    // still light the block — the slotchange path below proves it.
    el.querySelector('span')?.remove();
  });

  it('lets the heading slot override the prop (slotchange machinery)', async () => {
    const el = await mount({ heading: 'Проп' });
    const override = document.createElement('h2');
    override.textContent = 'Слот важнее';
    override.slot = 'heading';
    el.appendChild(override);
    await elementUpdated(el);
    const heading = el.shadowRoot?.querySelector('.es__heading');
    expect(heading?.tagName).toBe('H3');
    // The slot projects the ASSIGNED node (assignedNodes is the truth — a
    // slot's textContent stays its fallback in light-DOM terms; the
    // tk-service-card/tk-footer precedent).
    expect(heading?.querySelector('slot')?.assignedNodes({ flatten: true })).toContain(override);

    override.remove();
    await elementUpdated(el);
    // Slot emptied → the PROP takes the block back (slot overrides only
    // while carrying content — the service-card semantics).
    const restored = el.shadowRoot?.querySelector('.es__heading');
    expect(restored).not.toBeNull();
    expect(restored?.querySelector('slot')?.assignedNodes({ flatten: true })).not.toContain(override);
  });

  it('renders the description wrapper ONLY while the slot carries content (no empty flex item faking the rhythm)', async () => {
    const el = await mount({ heading: 'Пусто' });
    // Nothing slotted → no wrapper: an empty .es__description would add its
    // own gap+height and fake a supporting line that does not exist.
    expect(el.shadowRoot?.querySelector('.es__description')).toBeNull();

    const line = document.createElement('span');
    line.textContent = 'Поддерживающая строка';
    line.slot = 'description';
    el.appendChild(line);
    await elementUpdated(el);
    const wrapper = el.shadowRoot?.querySelector('.es__description');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector('slot')?.assignedNodes({ flatten: true })).toContain(line);

    line.remove();
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.es__description')).toBeNull();
  });

  it('is decorative by contract: the disc is aria-hidden, no focus stop, no role invention', async () => {
    const el = await mount({ heading: 'Пусто' });
    const disc = el.shadowRoot?.querySelector('.es__disc');
    expect(disc?.getAttribute('aria-hidden')).toBe('true');
    // No invented landmark/role on the host (AC5: живое = простой блок).
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.shadowRoot?.querySelector('[role], button, a, input')).toBeNull();
    // The action slot exists and stays consumer-owned — no widget shipped.
    expect(el.shadowRoot?.querySelector('slot[name="action"]')).not.toBeNull();
  });

  it('ships the measured stack: hook layer with token defaults, disc geometry/fill, two gap families, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): consumed WITH the token defaults.
    expect(css).toContain('gap: var(--tk-empty-state-gap, var(--tk-space-16))');
    expect(css).toContain('gap: var(--tk-empty-state-text-gap, var(--tk-space-8))');
    expect(css).toContain('width: var(--tk-empty-state-disc-size, var(--tk-space-48))');
    expect(css).toContain('height: var(--tk-empty-state-disc-size, var(--tk-space-48))');
    expect(css).toContain('background: var(--tk-empty-state-disc-fill, var(--tk-color-surface-muted))');
    expect(css).toContain('color: var(--tk-empty-state-icon-color, var(--tk-color-text-secondary))');
    // The disc is a circle; the stack is a centered column.
    expect(css).toContain('border-radius: 50%');
    expect(css).toContain('align-items: center');
    // Typography: heading-6 title, body-m supporting line.
    expect(css).toContain('font-size: var(--tk-text-heading-6-size)');
    expect(css).toContain('font-size: var(--tk-text-body-m-size)');
    expect(css).toContain('color: var(--tk-color-text-secondary)');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // Passive atom: no card paint of its own (no padding/border rules
    // beyond the hidden guard), no animation, no transition.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });
});
