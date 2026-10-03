// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkFigure } from './figure.js';

/**
 * tk-figure unit tests (spec 24.7): the aspect contract (the ratio hook
 * with its token default), lazy enforcement over the media slot (iframes
 * loading=lazy; imgs at ANY depth loading=lazy + decoding=async — the
 * promo-card art mold extended), the caption presence mold (prop, slot
 * override, neither → no figcaption node), and the structural CSS pins
 * (hook layer, hidden guard, FLAT). STATELESS by design: no event-map
 * entry — pinned against the React registry.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkFigure): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkFigure> => {
  const el = new TkFigure();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3). */
const sheetCss = (): string =>
  TkFigure.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-figure', () => {
  it('registers as tk-figure exposing TkFigure', async () => {
    await customElements.whenDefined('tk-figure');
    expect(customElements.get('tk-figure')).toBe(TkFigure);
  });

  it('paints the native figure frame with the media slot inside the aspect box', async () => {
    const el = await mount();
    const figure = el.shadowRoot?.querySelector('figure.figure');
    expect(figure).not.toBeNull();
    const media = el.shadowRoot?.querySelector('.figure__media slot[name="media"]');
    expect(media).not.toBeNull();
  });

  it('lazy-enforces slotted iframes (loading=lazy) — directly and at any nesting depth', async () => {
    const el = await mount();
    const direct = document.createElement('iframe');
    direct.src = 'about:blank';
    direct.slot = 'media';
    const wrapper = document.createElement('div');
    wrapper.slot = 'media';
    const nested = document.createElement('iframe');
    nested.src = 'about:blank';
    wrapper.appendChild(nested);
    el.append(direct, wrapper);
    await elementUpdated(el);
    expect(direct.getAttribute('loading')).toBe('lazy');
    expect(nested.getAttribute('loading')).toBe('lazy');
  });

  it('lazy-enforces slotted imgs (loading=lazy + decoding=async) at any nesting depth', async () => {
    const el = await mount();
    const img = document.createElement('img');
    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E';
    img.slot = 'media';
    el.appendChild(img);
    await elementUpdated(el);
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
  });

  it('leaves slotted video untouched (no loading attribute exists on video)', async () => {
    const el = await mount();
    const video = document.createElement('video');
    video.slot = 'media';
    el.appendChild(video);
    await elementUpdated(el);
    expect(video.getAttribute('loading')).toBeNull();
  });

  it('captions via the prop; the slot overrides; neither renders NO figcaption (presence mold)', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('figcaption')).toBeNull();

    el.caption = 'Динамика демо-индекса';
    await elementUpdated(el);
    const caption = el.shadowRoot?.querySelector('figcaption.figure__caption');
    expect(caption).not.toBeNull();
    expect(caption?.textContent?.trim()).toBe('Динамика демо-индекса');

    const slotted = document.createElement('span');
    slotted.slot = 'caption';
    slotted.textContent = 'Подпись из слота';
    el.appendChild(slotted);
    await elementUpdated(el);
    expect(
      el.shadowRoot?.querySelector('figcaption')?.querySelector('slot')?.assignedNodes({ flatten: true }),
    ).toContain(slotted);

    slotted.remove();
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('figcaption')?.textContent?.trim()).toBe(
      'Динамика демо-индекса',
    );
  });

  it('ships the measured surfaces: ratio hook with token default, caption register, hidden guard (structural)', () => {
    const css = sheetCss();
    // Aspect contract (AC1): the ratio hook consumed WITH its default.
    expect(css).toContain('aspect-ratio: var(--tk-figure-ratio, 16 / 9)');
    // Hook layer (CONVENTIONS §6).
    expect(css).toContain('border-radius: var(--tk-figure-radius, var(--tk-radius-lg))');
    expect(css).toContain('background: var(--tk-figure-fill, var(--tk-color-surface-muted))');
    expect(css).toContain('gap: var(--tk-figure-gap, var(--tk-space-12))');
    expect(css).toContain('color: var(--tk-figure-caption, var(--tk-color-text-secondary))');
    // The caption register: body-s fine print.
    expect(css).toContain('font-size: var(--tk-text-body-s-size)');
    // Media fills the box; iframe chrome stripped.
    expect(css).toContain('::slotted(iframe)');
    expect(css).toContain('border: 0');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no motion of its own.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });

  it('is STATELESS: the source dispatches nothing — no events, therefore no event-map entry (by design)', async () => {
    const source = await import('./figure.js');
    expect(source.TkFigure).toBeDefined();
    // The stateless pin (the display-component mold): a passive frame
    // dispatches no kit events — grep the class source for the dispatcher.
    const classSource = String(source.TkFigure.prototype.constructor);
    expect(classSource).not.toContain('dispatchEvent');
  });
});
