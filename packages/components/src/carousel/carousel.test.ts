// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';

import { TkCarousel } from './carousel.js';

/**
 * tk-carousel unit tests (spec 21.6): the region semantics on the host
 * (role + roledescription + the REQUIRED label), the native-scroll
 * chrome contract (page-step scrollBy, edge disables recomputed on the
 * scroll channel), the decorative dots math (pages/active from the
 * mocked rail geometry, aria-hidden, nothing clickable), and the
 * structural CSS pins (snap + hidden scrollbar, the hook layer with
 * token defaults, the no-transform/no-autoplay law).
 *
 * The rail's geometry (scrollWidth/scrollLeft/clientWidth) is MOCKED
 * via Object.defineProperty — happy-dom lays nothing out; the sync runs
 * through the real scroll-event channel.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkCarousel): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkCarousel> => {
  const el = new TkCarousel();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const railOf = (el: TkCarousel): HTMLElement => {
  const rail = el.shadowRoot?.querySelector<HTMLElement>('.carousel__rail');
  if (!rail) {
    throw new Error('rail not rendered');
  }
  return rail;
};

/** Mock the rail geometry + spy scrollBy, then push a scroll event. */
const mockGeometry = (
  el: TkCarousel,
  geometry: { scrollWidth?: number; clientWidth?: number; scrollLeft?: number },
): ReturnType<typeof vi.fn> => {
  const rail = railOf(el);
  for (const [key, value] of Object.entries({ scrollLeft: 0, ...geometry })) {
    Object.defineProperty(rail, key, { value, configurable: true });
  }
  const scrollBy = vi.fn();
  Object.defineProperty(rail, 'scrollBy', { value: scrollBy, configurable: true });
  rail.dispatchEvent(new Event('scroll'));
  return scrollBy;
};

const buttonByLabel = (el: TkCarousel, name: string): HTMLButtonElement => {
  const button = [...(el.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [])].find(
    (candidate) => candidate.getAttribute('aria-label') === name,
  );
  if (!button) {
    throw new Error(`button ${name} not rendered`);
  }
  return button;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkCarousel.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-carousel', () => {
  it('registers as tk-carousel exposing TkCarousel', async () => {
    await customElements.whenDefined('tk-carousel');
    expect(customElements.get('tk-carousel')).toBe(TkCarousel);
  });

  it('carries the region semantics on the host: role, roledescription, and the REQUIRED label', async () => {
    const el = await mount({ label: 'Похожие акции' });
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-roledescription')).toBe('карусель');
    expect(el.getAttribute('aria-label')).toBe('Похожие акции');

    el.label = 'Недавно просмотренные';
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('Недавно просмотренные');
  });

  it('renders the rail + default slot and the two named chevrons (prev disabled at the start edge)', async () => {
    const el = await mount({ label: 'Рейл' });
    expect(el.shadowRoot?.querySelector('.carousel__rail slot')).not.toBeNull();

    mockGeometry(el, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 0 });
    await elementUpdated(el);

    const prev = buttonByLabel(el, 'Назад');
    const next = buttonByLabel(el, 'Вперёд');
    expect(prev.disabled).toBe(true); // scrollLeft 0 — the start edge
    expect(next.disabled).toBe(false);
  });

  it('scrolls a PAGE per click — scrollBy with the rail clientWidth; a disabled edge button never fires', async () => {
    const el = await mount({ label: 'Рейл' });
    const scrollBy = mockGeometry(el, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 0 });
    await elementUpdated(el);

    buttonByLabel(el, 'Вперёд').click();
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy).toHaveBeenCalledWith({ left: 500, behavior: 'smooth' });

    buttonByLabel(el, 'Назад').click(); // disabled at the start edge
    expect(scrollBy).toHaveBeenCalledTimes(1);
  });

  it('disables the next chevron at the end edge (scrollLeft at the max)', async () => {
    const el = await mount({ label: 'Рейл' });
    mockGeometry(el, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 1500 });
    await elementUpdated(el);

    expect(buttonByLabel(el, 'Вперёд').disabled).toBe(true);
    expect(buttonByLabel(el, 'Назад').disabled).toBe(false);
  });

  it('paints the decorative dots: page math from the rail geometry, aria-hidden, nothing clickable', async () => {
    const el = await mount({ label: 'Рейл', dots: true });
    mockGeometry(el, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 0 });
    await elementUpdated(el);

    const dotsRow = el.shadowRoot?.querySelector('.carousel__dots');
    expect(dotsRow).not.toBeNull();
    expect(dotsRow?.getAttribute('aria-hidden')).toBe('true');
    // ceil(2000 / 500) = 4 pages
    expect(el.shadowRoot?.querySelectorAll('.carousel__dot')).toHaveLength(4);
    expect(el.shadowRoot?.querySelectorAll('.carousel__dot--active')).toHaveLength(1);
    expect(el.shadowRoot?.querySelector('.carousel__dot--active')).toBe(
      el.shadowRoot?.querySelectorAll('.carousel__dot')[0],
    );
    // Decorative ruling: no buttons, no roles, no tab stops inside.
    expect(dotsRow?.querySelector('button')).toBeNull();
    expect(dotsRow?.querySelector('[role]')).toBeNull();
    expect(dotsRow?.querySelector('[tabindex]')).toBeNull();

    // Halfway through page 2 (700/500 rounds to 1): the SECOND dot wins.
    mockGeometry(el, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 700 });
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelectorAll('.carousel__dot--active')[0]).toBe(
      el.shadowRoot?.querySelectorAll('.carousel__dot')[1],
    );
  });

  it('renders NO dots row without the dots attribute', async () => {
    const el = await mount({ label: 'Рейл' });
    expect(el.shadowRoot?.querySelector('.carousel__dots')).toBeNull();
  });

  it('ships NO live region and NO custom keyboard layer (the native rulings)', async () => {
    const el = await mount({ label: 'Рейл', dots: true });
    mockGeometry(el, { scrollWidth: 2000, clientWidth: 500 });
    await elementUpdated(el);

    expect(el.shadowRoot?.querySelector('[aria-live]')).toBeNull();
    // The keyboard is native: no host tab stop, no onkeydown contracts.
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1);
    expect(railOf(el).onkeydown).toBeNull();
  });

  it('ships the measured surface: snap scroller, hidden scrollbar, hook layer with token defaults (structural)', () => {
    const css = sheetCss();
    // Native scroll-snap — the transform track is out of scope by law.
    expect(css).toContain('scroll-snap-type: x mandatory');
    expect(css).not.toContain('transform');
    // The grounded rails carry no scrollbar.
    expect(css).toContain('scrollbar-width: none');
    // Hook layer (CONVENTIONS §6) with token defaults: the measured gap
    // (41px, both rec/edu rails) and the 8px dots on the yellow-100
    // default (byte-identical to the live probe).
    expect(css).toContain('gap: var(--tk-carousel-gap, 41px)');
    expect(css).toContain('width: var(--tk-carousel-dot-size, 8px)');
    expect(css).toContain('background: var(--tk-carousel-dot-active, var(--tk-color-yellow-100))');
    // The chevron's shadow = the existing dropdown token (the spec).
    expect(css).toContain('var(--tk-carousel-chevron-shadow, var(--tk-shadow-dropdown))');
    // The reveal contract lives in opacity — hidden chrome still tabs.
    expect(css).toContain('opacity: 0');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // No autoplay: nothing of its own animates (the dots are FLAT).
    expect(css).not.toContain('animation');
  });
});
