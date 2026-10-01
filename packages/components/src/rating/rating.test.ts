// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkRating } from './rating.js';

/**
 * tk-rating unit tests (spec 21.5): the value→stars math (integer rows,
 * the 0.5-schema partial star clipped by width percentage, display-side
 * clamping that never mutates the prop), the host-carried img semantics
 * (role=img + the RU comma-decimal aria-label), the read-only ruling
 * (nothing interactive, nothing dispatchable) and the structural CSS
 * pins (hook layer with token defaults, the hidden guard, no motion).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkRating): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkRating> => {
  const el = new TkRating();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const stars = (el: TkRating): NodeListOf<HTMLElement> =>
  el.shadowRoot!.querySelectorAll('.rating__star');

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkRating.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-rating', () => {
  it('registers as tk-rating exposing TkRating', async () => {
    await customElements.whenDefined('tk-rating');
    expect(customElements.get('tk-rating')).toBe(TkRating);
  });

  it('renders exactly floor(value) stars — zero at 0, five at 5 (the live integer rows)', async () => {
    const zero = await mount({ value: 0 });
    expect(stars(zero)).toHaveLength(0);

    const three = await mount({ value: 3 });
    expect(stars(three)).toHaveLength(3);
    expect(three.shadowRoot?.querySelector('.rating__star--partial')).toBeNull();

    const five = await mount({ value: 5 });
    expect(stars(five)).toHaveLength(5);
  });

  it('renders the 0.5-schema partial star as a width-percentage clip-path on ONE extra star (no second SVG)', async () => {
    const half = await mount({ value: 0.5 });
    expect(stars(half)).toHaveLength(1);
    const partial = half.shadowRoot?.querySelector<HTMLElement>('.rating__star--partial');
    expect(partial).not.toBeNull();
    // inset(0 50% 0 0): the RIGHT half clipped away, left half visible.
    expect(partial?.getAttribute('style')).toContain('clip-path: inset(0 50');
    expect(partial?.querySelector('svg')).not.toBeNull();

    const fourHalf = await mount({ value: 4.5 });
    expect(stars(fourHalf)).toHaveLength(5);
    expect(fourHalf.shadowRoot?.querySelectorAll('.rating__star--partial')).toHaveLength(1);
  });

  it('clamps display-side into [0, 5] and never mutates the prop (the stateless ruling)', async () => {
    const over = await mount({ value: 7 });
    expect(stars(over)).toHaveLength(5);
    expect(over.value).toBe(7); // the prop keeps 7 — only pixels clamp

    const under = await mount({ value: -2 });
    expect(stars(under)).toHaveLength(0);
    expect(under.value).toBe(-2);

    const garbage = await mount({ value: Number.NaN });
    expect(stars(garbage)).toHaveLength(0);
    expect(Number.isNaN(garbage.value)).toBe(true);
  });

  it('carries role="img" with the RU aria-label that recomputes on value changes', async () => {
    const el = await mount({ value: 3 });
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Рейтинг 3 из 5');

    el.value = 4.5;
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('Рейтинг 4,5 из 5'); // comma decimal

    el.value = 0;
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('Рейтинг 0 из 5');
  });

  it('is NOT interactive: no tabindex, no buttons, nothing dispatchable (the read-only ruling)', async () => {
    const el = await mount({ value: 4 });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1); // not focusable
    expect(el.shadowRoot?.querySelector('button')).toBeNull();
    expect(el.shadowRoot?.querySelector('[role]')).toBeNull(); // children are presentational
  });

  it('ships the measured surface: hook layer with token defaults, space-4 rhythm, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): consumed WITH the token defaults — the
    // fill default is the EXISTING yellow (byte-identical #FFDD2D), and
    // the size default is the measured 16px lobes.
    expect(css).toContain('color: var(--tk-rating-fill, var(--tk-color-yellow-100))');
    expect(css).toContain('width: var(--tk-rating-size, 16px)');
    expect(css).toContain('height: var(--tk-rating-size, 16px)');
    // The measured step: 20px pitch − 16px star = 4px = space-4.
    expect(css).toContain('gap: var(--tk-space-4)');
    // An inline row riding the text flow (the bonds grounding).
    expect(css).toContain('display: inline-flex');
    // The glyph colors through the host (one hook, one place).
    expect(css).toContain('fill: currentColor');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no motion of its own.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });
});
