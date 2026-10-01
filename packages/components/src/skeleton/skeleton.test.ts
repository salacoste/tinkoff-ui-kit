// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkSkeleton } from './skeleton.js';

/**
 * tk-skeleton unit tests (spec 21.2): variant union + clamping, the
 * aria-hidden decorative stamp, the width/height host-inline-style
 * contract (set → override, clear → variant default returns) and the
 * structural CSS pins (hook layer with token defaults, the 1.4s opacity
 * pulse, reduced-motion collapse, per-variant geometry defaults, the
 * hidden guard, FLAT — no shimmer gradient, no transition).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkSkeleton): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkSkeleton> => {
  const el = new TkSkeleton();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkSkeleton.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-skeleton', () => {
  it('registers as tk-skeleton exposing TkSkeleton, variants pinned', async () => {
    await customElements.whenDefined('tk-skeleton');
    expect(customElements.get('tk-skeleton')).toBe(TkSkeleton);
    expect(TkSkeleton.variants).toEqual(['line', 'circle', 'rect']);
  });

  it('defaults to the line variant as a reflected host attribute and clamps invalid values (CONVENTIONS §2)', async () => {
    const el = await mount();
    expect(el.variant).toBe('line');
    expect(el.getAttribute('variant')).toBe('line');

    el.variant = 'circle';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('circle');

    el.variant = 'rect';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('rect');

    el.variant = 'bogus' as unknown as TkSkeleton['variant'];
    await elementUpdated(el);
    expect(el.variant, 'clamps to the union default').toBe('line');
    expect(el.getAttribute('variant'), 'reflected attribute corrected').toBe('line');

    el.setAttribute('variant', 'nope');
    await elementUpdated(el);
    expect(el.variant, 'attribute path clamps too').toBe('line');
  });

  it('is decorative by contract: aria-hidden="true" stamped on connect, no focus stop (AC3)', async () => {
    const el = await mount();
    expect(el.getAttribute('aria-hidden')).toBe('true');
    // Reconnect keeps the stamp (idempotent, the Flow-B mold).
    el.remove();
    document.body.appendChild(el);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.shadowRoot?.querySelector('[role], button, a, input, slot')).toBeNull();
  });

  it('applies width/height attributes as host inline styles and clears them back to the variant defaults (AC1)', async () => {
    const el = await mount();
    // Unset → no inline overrides: the per-variant CSS defaults govern.
    expect(el.style.getPropertyValue('width')).toBe('');
    expect(el.style.getPropertyValue('height')).toBe('');

    el.width = '200px';
    el.height = '16px';
    await elementUpdated(el);
    expect(el.style.getPropertyValue('width')).toBe('200px');
    expect(el.style.getPropertyValue('height')).toBe('16px');

    // Clearing removes the override — the variant default returns.
    el.width = undefined;
    await elementUpdated(el);
    expect(el.style.getPropertyValue('width')).toBe('');
    expect(el.style.getPropertyValue('height')).toBe('16px');

    el.height = '';
    await elementUpdated(el);
    expect(el.style.getPropertyValue('height')).toBe('');
  });

  it('ships the ruled bone: hook layer with token default, 1.4s opacity pulse, reduced-motion collapse, geometry defaults, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): consumed WITH the token default.
    expect(css).toContain('background: var(--tk-skeleton-fill, var(--tk-color-surface-muted))');
    // The AC pulse: opacity breathing loop, ~1.4s ease-in-out infinite.
    expect(css).toContain('animation: tk-skeleton-pulse 1.4s ease-in-out infinite');
    expect(css).toContain('@keyframes tk-skeleton-pulse');
    expect(css).toContain('opacity: 0.5');
    // Reduced motion collapses to a static bone (a11y law).
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation: none');
    // Per-variant geometry defaults (flagged structural literals).
    expect(css).toContain('height: 12px');
    expect(css).toContain(':host([variant=\'circle\'])');
    expect(css).toContain('width: 40px');
    expect(css).toContain('height: 40px');
    expect(css).toContain('border-radius: 50%');
    expect(css).toContain(':host([variant=\'rect\'])');
    expect(css).toContain('height: 80px');
    // Quiet radius on the line/rect defaults.
    expect(css).toContain('border-radius: var(--tk-radius-sm)');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT + unproven: no shimmer sweep, no transition anywhere.
    expect(css).not.toContain('gradient');
    expect(css).not.toContain('transition');
  });
});
