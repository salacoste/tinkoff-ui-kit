// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkBreadcrumb, type TkBreadcrumbItem } from './breadcrumb.js';

/**
 * tk-breadcrumb unit tests (spec 24.9): the nav landmark semantics (the
 * pagination-mold label with its default), the ol/li structure, the
 * aria-current terminal (the LAST stop is plain text — never a link to
 * itself), the href passthrough for non-last stops, the §2 degrades
 * (non-array items render nothing; an href-less middle stop degrades to
 * plain text, never a dead anchor), and the structural CSS pins (hook
 * layer, link-token consumption, hidden guard). STATELESS by design: no
 * event-map entry — pinned against the React registry.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkBreadcrumb): Promise<unknown> => el.updateComplete;

const mount = async (props: Partial<TkBreadcrumb> = {}): Promise<TkBreadcrumb> => {
  const el = new TkBreadcrumb();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const TRAIL: TkBreadcrumbItem[] = [
  { label: 'Инвестиции', href: '/invest' },
  { label: 'Документы', href: '/invest/docs' },
  { label: 'Раскрытие информации' },
];

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3). */
const sheetCss = (): string =>
  TkBreadcrumb.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-breadcrumb', () => {
  it('registers as tk-breadcrumb exposing TkBreadcrumb', async () => {
    await customElements.whenDefined('tk-breadcrumb');
    expect(customElements.get('tk-breadcrumb')).toBe(TkBreadcrumb);
  });

  it('renders the nav landmark with the default label; the attr overrides', async () => {
    const el = await mount({ items: TRAIL });
    const nav = el.shadowRoot?.querySelector('nav.breadcrumb');
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute('aria-label')).toBe('Хлебные крошки');

    el.label = 'Путь по разделу';
    await elementUpdated(el);
    expect(nav?.getAttribute('aria-label')).toBe('Путь по разделу');
  });

  it('paints ol/li with one li per stop — the list semantics the trail owes', async () => {
    const el = await mount({ items: TRAIL });
    const items = el.shadowRoot?.querySelectorAll('ol.breadcrumb__list > li.breadcrumb__item');
    expect(items?.length).toBe(3);
  });

  it('terminates in aria-current="page" plain text — the last stop is NEVER a link to itself', async () => {
    const el = await mount({ items: TRAIL });
    const last = el.shadowRoot?.querySelectorAll('li.breadcrumb__item')[2];
    expect(last?.querySelector('a')).toBeNull();
    const current = last?.querySelector('span.breadcrumb__current');
    expect(current?.getAttribute('aria-current')).toBe('page');
    expect(current?.textContent?.trim()).toBe('Раскрытие информации');
  });

  it('renders non-last stops as native anchors with the href passed through untouched', async () => {
    const el = await mount({ items: TRAIL });
    const links = [...(el.shadowRoot?.querySelectorAll('a.breadcrumb__link') ?? [])];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/invest', '/invest/docs']);
    expect(links.map((a) => a.textContent?.trim())).toEqual(['Инвестиции', 'Документы']);
  });

  it('drops the terminal href even when one is supplied — current is current', async () => {
    const el = await mount({
      items: [
        { label: 'Инвестиции', href: '/invest' },
        { label: 'Сейчас здесь', href: '/should-not-render' },
      ],
    });
    const last = el.shadowRoot?.querySelectorAll('li.breadcrumb__item')[1];
    expect(last?.querySelector('a')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('a.breadcrumb__link').length).toBe(1);
  });

  it('degrades: a non-last stop without href renders plain text, never a dead anchor', async () => {
    const el = await mount({
      items: [{ label: 'Средний без ссылки' }, { label: 'Текущая' }],
    });
    const middle = el.shadowRoot?.querySelectorAll('li.breadcrumb__item')[0];
    expect(middle?.querySelector('a')).toBeNull();
    // Not current either — no aria-current on a non-terminal stop.
    expect(middle?.querySelector('.breadcrumb__current')?.getAttribute('aria-current')).toBeNull();
  });

  it('renders NOTHING for a non-array or empty items — no empty nav landmark', async () => {
    const empty = await mount({ items: [] });
    expect(empty.shadowRoot?.querySelector('nav')).toBeNull();
    const notArray = await mount({ items: undefined });
    expect(notArray.shadowRoot?.querySelector('nav')).toBeNull();
  });

  it('paints the decorative chevrons BETWEEN stops only — aria-hidden dividers', async () => {
    const el = await mount({ items: TRAIL });
    const separators = el.shadowRoot?.querySelectorAll('.breadcrumb__separator');
    expect(separators?.length).toBe(2);
    // The terminal stop carries no chevron.
    const last = el.shadowRoot?.querySelectorAll('li.breadcrumb__item')[2];
    expect(last?.querySelector('.breadcrumb__separator')).toBeNull();
    for (const separator of separators ?? []) {
      expect(separator.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('ships the measured surfaces: hook layer with token defaults, link-token anchors, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6, consumed WITH token defaults).
    expect(css).toContain('gap: var(--tk-breadcrumb-gap, var(--tk-space-8))');
    expect(css).toContain('color: var(--tk-breadcrumb-separator, var(--tk-color-text-secondary))');
    expect(css).toContain('color: var(--tk-breadcrumb-color, var(--tk-color-text-primary))');
    // The links consume the LINK token (the «ссылки — токен link» pin).
    expect(css).toContain('color: var(--tk-color-link)');
    // The tk-link affordance recipe: transparent rest underline fading in.
    expect(css).toContain('text-decoration-color: transparent');
    expect(css).toContain('text-decoration-color: currentColor');
    // The quiet nav-line register.
    expect(css).toContain('font-size: var(--tk-text-body-s-size)');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no keyframed motion of its own; the underline fade rides
    // the MOTION TOKENS only (collapses to 0s under reduced motion).
    expect(css).not.toContain('animation');
    expect(css).not.toMatch(/transition:[^;]*[0-9]+m?s/);
  });

  it('is STATELESS: the source dispatches nothing — no events, therefore no event-map entry (by design)', async () => {
    const source = await import('./breadcrumb.js');
    expect(source.TkBreadcrumb).toBeDefined();
    // The stateless pin (the display-component mold): a passive trail
    // dispatches no kit events — grep the class source for the dispatcher.
    const classSource = String(source.TkBreadcrumb.prototype.constructor);
    expect(classSource).not.toContain('dispatchEvent');
  });
});
