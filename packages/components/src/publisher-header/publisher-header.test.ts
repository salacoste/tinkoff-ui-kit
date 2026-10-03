// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { publisherHeaderStyles } from './publisher-header.css.js';
import { TkPublisherHeader } from './publisher-header.js';
import './publisher-header.js';

/**
 * tk-publisher-header unit tests (spec 23.2): the row anatomy (avatar
 * disc, name line with the badge rail, meta, action), the name/meta
 * prop-vs-slot contracts, the meta slot-presence rule, the stateless
 * no-channel law (event-map no-entry — the tk-footer precedent), and
 * the structural pins (the four-hook layer with measured defaults,
 * heading-6 bold name, body-s secondary meta, no motion, no theme
 * branches) asserted against cssText / DOM the way the hero suite
 * pins its sheet.
 */

const elementUpdated = (el: Element & { updateComplete: Promise<unknown> }): Promise<unknown> => el.updateComplete;

const mount = async (markup = '', props: Partial<TkPublisherHeader> = {}): Promise<TkPublisherHeader> => {
  const host = document.createElement('div');
  host.innerHTML = `<tk-publisher-header>${markup}</tk-publisher-header>`;
  const el = host.firstElementChild as TkPublisherHeader;
  document.body.appendChild(el);
  Object.assign(el, props);
  await elementUpdated(el);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return el;
};

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = (): string => publisherHeaderStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-publisher-header', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-publisher-header exposing TkPublisherHeader', async () => {
    await customElements.whenDefined('tk-publisher-header');
    expect(customElements.get('tk-publisher-header')).toBe(TkPublisherHeader);
  });

  it('renders the measured anatomy: avatar disc, name line with badge rail, meta, action slot', async () => {
    const el = await mount('', { name: 'Демо-профиль', meta: '12,3 тыс. подписчиков' });
    expect(el.shadowRoot?.querySelector('.publisher-header__avatar slot[name="avatar"]')).toBeInstanceOf(HTMLSlotElement);
    expect(el.shadowRoot?.querySelector('.publisher-header__name')).toBeInstanceOf(Element);
    expect(el.shadowRoot?.querySelector('.publisher-header__badges slot[name="badge"]')).toBeInstanceOf(HTMLSlotElement);
    expect(el.shadowRoot?.querySelector('.publisher-header__meta')?.textContent?.trim()).toBe('12,3 тыс. подписчиков');
    expect(el.shadowRoot?.querySelector('.publisher-header__action slot[name="action"]')).toBeInstanceOf(HTMLSlotElement);
  });

  it('renders the name prop as the slot fallback; the name SLOT overrides it (the heading channel)', async () => {
    const el = await mount('', { name: 'Демо-профиль' });
    const nameSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('.publisher-header__name slot[name="name"]');
    expect(nameSlot?.textContent).toBe('Демо-профиль');

    const slotted = await mount('<h3 slot="name">Обзоры демо-индекса</h3>', { name: 'ПРОП-ЗАГЛУШКА' });
    const assigned = slotted.shadowRoot
      ?.querySelector<HTMLSlotElement>('.publisher-header__name slot[name="name"]')
      ?.assignedNodes({ flatten: true }) ?? [];
    expect(assigned.some((node) => (node as Element).tagName === 'H3')).toBe(true);
    expect(assigned.some((node) => node.textContent === 'ПРОП-ЗАГЛУШКА')).toBe(false);
  });

  it('renders a DIV for the name — never a heading (the h-level is consumer document structure)', async () => {
    const el = await mount('', { name: 'Демо-профиль' });
    expect(el.shadowRoot?.querySelector('h1,h2,h3,h4,h5,h6')).toBeNull();
    expect(el.shadowRoot?.querySelector('.publisher-header__name')?.tagName).toBe('DIV');
  });

  it('meta block: renders the prop, the meta SLOT content, and NOTHING when both are empty', async () => {
    const fromProp = await mount('', { meta: '987 подписчиков' });
    expect(fromProp.shadowRoot?.querySelector('.publisher-header__meta')?.textContent?.trim()).toBe('987 подписчиков');

    // Slotted meta wins the same way the name slot does.
    const slotted = await mount('<span slot="meta">1,2 тыс. читателей</span>', { meta: 'ПРОП-ЗАГЛУШКА' });
    expect(slotted.shadowRoot?.querySelector('.publisher-header__meta')).toBeInstanceOf(Element);
    const assigned = slotted.shadowRoot
      ?.querySelector<HTMLSlotElement>('.publisher-header__meta slot[name="meta"]')
      ?.assignedNodes({ flatten: true }) ?? [];
    expect(assigned.some((node) => node.textContent === '1,2 тыс. читателей')).toBe(true);

    // No prop, no slot content → no meta node at all (the presence mold —
    // an empty line box would fake the measured row rhythm).
    const bare = await mount('');
    expect(bare.shadowRoot?.querySelector('.publisher-header__meta')).toBeNull();
  });

  it('is STATELESS: no role, no tabindex, no kit buttons, nothing dispatchable (the tk-footer no-channel law)', async () => {
    const el = await mount('<button slot="action" class="consumer">Подписаться</button>', { name: 'Демо' });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1);
    // The only button in the light DOM is the CONSUMER's action; the
    // shadow tree carries none of its own.
    expect(el.shadowRoot?.querySelector('button')).toBeNull();
    expect(el.shadowRoot?.querySelector('[role]')).toBeNull();
  });

  it('ships the measured surface: EXACTLY four --tk-publisher-header-* hooks with defaults, no orphans (structural)', () => {
    const css = sheet();
    const hooks = new Set(css.match(/--tk-publisher-header-[a-z0-9-]+/g));
    expect(hooks.size).toBe(4);
    for (const hook of hooks) expect(css).toContain(`var(${hook},`);
    expect(css).toContain('width: var(--tk-publisher-header-avatar-size, 35px)');
    expect(css).toContain('background: var(--tk-publisher-header-avatar-backdrop, var(--tk-color-tint-gray))');
    expect(css).toContain('margin-left: var(--tk-publisher-header-gap, var(--tk-space-24))');
    expect(css).toContain('gap: var(--tk-publisher-header-badge-gap, 2px)');
  });

  it('maps the measured typography: heading-6 BOLD name (700 literal), body-s secondary meta, round avatar disc', () => {
    const css = sheet();
    expect(css).toContain('font-size: var(--tk-text-heading-6-size)');
    expect(css).toContain('font-weight: 700');
    expect(css).toContain('line-height: var(--tk-text-heading-6-leading)');
    expect(css).toContain('font-size: var(--tk-text-body-s-size)');
    expect(css).toContain('color: var(--tk-color-text-secondary)');
    expect(css).toContain('border-radius: var(--tk-radius-full)');
    // A slotted heading drops its UA chrome (the hero-name rule).
    expect(css).toMatch(/::slotted\(h1, h2, h3, h4, h5, h6\)[\s\S]*?font-size: inherit/);
  });

  it('keeps the kit laws: hidden guard, zero motion, zero theme branches', () => {
    const css = sheet();
    expect(css).toContain(':host([hidden])');
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
    expect(css).not.toContain('[data-theme');
  });
});
