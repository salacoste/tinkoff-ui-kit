// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkSpinner } from './spinner.js';

/**
 * tk-spinner unit tests (spec 27.1): the size channel (union clamp + the
 * host inline `--tk-spinner-size` custom property, the tk-avatar mold),
 * the two-mode semantics (named: role=status + aria-label=self-asserted at
 * connect, the React-19 law; decorative `label=''`: aria-hidden host —
 * the rating aria-hidden points mold, withdrawn exactly on flip), the arc
 * geometry (r from the size channel, the 75/25 three-quarter dash, the
 * svg decorative in both modes), the stateless ruling and the structural
 * CSS pins (hook layer with currentColor default, the 0.9s rotation,
 * reduced-motion collapse, the hidden guard).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkSpinner): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkSpinner> => {
  const el = new TkSpinner();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkSpinner.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-spinner', () => {
  it('registers as tk-spinner exposing TkSpinner, sizes pinned', async () => {
    await customElements.whenDefined('tk-spinner');
    expect(customElements.get('tk-spinner')).toBe(TkSpinner);
    expect(TkSpinner.sizes).toEqual(['16', '20', '24', '32']);
  });

  it('defaults: size 20 reflected + written to the host inline channel, label «Загрузка»', async () => {
    const el = await mount();
    expect(el.size).toBe('20');
    expect(el.getAttribute('size')).toBe('20');
    expect(el.style.getPropertyValue('--tk-spinner-size')).toBe('20px');
    expect(el.label).toBe('Загрузка');
  });

  it('applies size as the host inline custom property — one channel with the hook (the avatar mold)', async () => {
    const el = await mount({ size: '32' });
    expect(el.style.getPropertyValue('--tk-spinner-size')).toBe('32px');

    el.size = '16';
    await elementUpdated(el);
    expect(el.style.getPropertyValue('--tk-spinner-size')).toBe('16px');
    expect(el.getAttribute('size')).toBe('16');
  });

  it('clamps invalid size to the union default and corrects the reflected attribute (CONVENTIONS §2)', async () => {
    const el = await mount();
    el.size = '48' as TkSpinner['size'];
    await elementUpdated(el);
    expect(el.size, 'clamps to the union default').toBe('20');
    expect(el.getAttribute('size'), 'reflected attribute corrected').toBe('20');
    expect(el.style.getPropertyValue('--tk-spinner-size')).toBe('20px');

    el.setAttribute('size', 'bogus');
    await elementUpdated(el);
    expect(el.size, 'attribute path clamps too').toBe('20');
  });

  it('stamps role=status + aria-label=label at connect (the React-19 law) and recomputes on rename', async () => {
    const el = await mount({ label: 'Обновляем курс' });
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-label')).toBe('Обновляем курс');

    // Idempotent across reconnects (the Flow-B mold).
    el.remove();
    document.body.appendChild(el);
    expect(el.getAttribute('role')).toBe('status');

    el.label = 'Загружаем список';
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('Загружаем список');

    // A whitespace-only label is the decorative mode too (the avatar trim).
    el.label = '   ';
    await elementUpdated(el);
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('decorative mode (label=\'\'): aria-hidden host, role/aria-label withdrawn exactly', async () => {
    const el = await mount({ label: '' });
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);

    // Flipping back withdraws exactly the hidden stamp.
    el.label = 'Ждём ответ банка';
    await elementUpdated(el);
    expect(el.hasAttribute('aria-hidden')).toBe(false);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-label')).toBe('Ждём ответ банка');
  });

  it('renders the three-quarter arc from the size channel: viewBox, r=(size−4)/2, 75/25 dash', async () => {
    const el = await mount({ size: '20' });
    const svg = el.shadowRoot?.querySelector('svg.spinner');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20');
    const arc = svg?.querySelector('circle.spinner__arc');
    expect(arc?.getAttribute('cx')).toBe('10');
    expect(arc?.getAttribute('cy')).toBe('10');
    expect(arc?.getAttribute('r')).toBe('8'); // (20 − 2·2) / 2
    expect(arc?.getAttribute('pathLength')).toBe('100');
    expect(arc?.getAttribute('stroke-dasharray')).toBe('75 25'); // ¾ circle, 25% gap

    const small = await mount({ size: '16' });
    expect(small.shadowRoot?.querySelector('svg.spinner')?.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(small.shadowRoot?.querySelector('circle')?.getAttribute('r')).toBe('6');

    const big = await mount({ size: '32' });
    expect(big.shadowRoot?.querySelector('circle')?.getAttribute('r')).toBe('14');
  });

  it('hides the arc svg in BOTH modes (the name is text, never the glyph)', async () => {
    const named = await mount({ label: 'Обновляем курс' });
    expect(named.shadowRoot?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');

    const decorative = await mount({ label: '' });
    expect(decorative.shadowRoot?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('is STATELESS: no tabindex, nothing dispatchable (the tk-rating mold)', async () => {
    const el = await mount({ label: 'Обновляем курс' });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1); // not focusable
    expect(el.shadowRoot?.querySelector('button, a, input, [role]')).toBeNull();
  });

  it('ships the ruled surface: hook layer with currentColor, 0.9s linear rotation, reduced-motion collapse, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): every hook consumed WITH its default.
    expect(css).toContain('width: var(--tk-spinner-size, 20px)');
    expect(css).toContain('height: var(--tk-spinner-size, 20px)');
    expect(css).toContain('stroke: var(--tk-spinner-color, currentColor)');
    expect(css).toContain('stroke-width: var(--tk-spinner-stroke, 2px)');
    // The AC motion: a steady linear turn on the duration hook.
    expect(css).toContain(
      'animation: tk-spinner-rotate var(--tk-spinner-duration, 0.9s) linear infinite',
    );
    expect(css).toContain('@keyframes tk-spinner-rotate');
    // The round cap of the full-radius progress family; no fill ever.
    expect(css).toContain('stroke-linecap: round');
    expect(css).toContain('fill: none');
    // Reduced motion collapses to the static arc (the skeleton mold).
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation: none');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // An inline row riding the text flow (the button/breadcrumb context).
    expect(css).toContain('display: inline-flex');
    // FLAT law: no transitions of its own.
    expect(css).not.toContain('transition');
  });
});
