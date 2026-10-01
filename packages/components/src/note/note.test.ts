// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkNote } from './note.js';

/**
 * tk-note unit tests (spec 21.4): the tone classes, the label/icon
 * projection machinery (no default icon — the measurement override),
 * the collapsible disclosure tail with its accordion-item contract
 * (aria-expanded button, no aria-controls, open/open-change §9 channel
 * silent on first render and teardown), and the structural CSS pins
 * (hook layer with token defaults, the 3-line clamp, the two tone
 * surfaces, the hidden guard).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkNote): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkNote> => {
  const el = new TkNote();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkNote.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-note', () => {
  it('registers as tk-note exposing TkNote', async () => {
    await customElements.whenDefined('tk-note');
    expect(customElements.get('tk-note')).toBe(TkNote);
  });

  it('renders the neutral card tone by default and the info tone on demand', async () => {
    const neutral = await mount();
    expect(neutral.tone).toBe('neutral');
    expect(neutral.shadowRoot?.querySelector('.note--neutral')).not.toBeNull();
    expect(neutral.shadowRoot?.querySelector('.note--info')).toBeNull();
    // The tone reflects to the host attribute (theming/diagnostics hook).
    expect(neutral.getAttribute('tone')).toBe('neutral');

    const info = await mount({ tone: 'info', label: 'Информация' });
    expect(info.shadowRoot?.querySelector('.note--info')).not.toBeNull();
    expect(info.shadowRoot?.querySelector('.note--neutral')).toBeNull();
    expect(info.getAttribute('tone')).toBe('info');
  });

  it('renders the info label line only when the property is non-empty', async () => {
    const el = await mount({ tone: 'info' });
    expect(el.shadowRoot?.querySelector('.note__label')).toBeNull();

    el.label = 'Информация';
    await elementUpdated(el);
    const label = el.shadowRoot?.querySelector('.note__label');
    expect(label?.textContent).toBe('Информация');

    el.label = '';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.note__label')).toBeNull();
  });

  it('paints NO default icon: the wrapper exists only while the icon slot carries content', async () => {
    const el = await mount();
    // Measurement override (AC1): none of the groundings paints an icon —
    // no wrapper, and the hidden projection keeps the slot addressable so
    // a LATER assignment can light it (the empty-state description mold).
    expect(el.shadowRoot?.querySelector('.note__icon')).toBeNull();

    const glyph = document.createElement('svg');
    glyph.slot = 'icon';
    el.appendChild(glyph);
    await elementUpdated(el);
    const wrapper = el.shadowRoot?.querySelector('.note__icon');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper?.querySelector('slot')?.assignedNodes({ flatten: true })).toContain(glyph);

    glyph.remove();
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.note__icon')).toBeNull();
  });

  it('ships the collapsible tail with the accordion-item contract: aria-expanded button, NO aria-controls, clamped text while closed', async () => {
    const el = await mount({ collapsible: true });
    const toggle = el.shadowRoot?.querySelector<HTMLButtonElement>('button.note__toggle');
    expect(toggle).not.toBeNull();
    expect(toggle?.type).toBe('button');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    // The panel is a shadow child — not addressable from light DOM, so no
    // aria-controls by contract (the tk-accordion-item / tk-select precedent).
    expect(el.shadowRoot?.querySelector('[aria-controls]')).toBeNull();
    // Closed = the 3-line clamp; the text itself stays projected (SRs read
    // the WHOLE fine print — clipping is visual only).
    expect(el.shadowRoot?.querySelector('.note__text--clamped')).not.toBeNull();
    expect(toggle?.textContent?.trim()).toBe('Показать');

    toggle?.click();
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(el.getAttribute('open')).toBe(''); // reflects
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(el.shadowRoot?.querySelector('.note__text--clamped')).toBeNull();
    expect(toggle?.textContent?.trim()).toBe('Скрыть');

    toggle?.click();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(el.shadowRoot?.querySelector('.note__text--clamped')).not.toBeNull();
  });

  it('fires open-change on every flip but stays silent at initial mount (the §9 channel)', async () => {
    const events: Array<{ value: boolean }> = [];
    // Pre-mount assignment (the accordion-item idiom): the value rides the
    // FIRST render pass — whatever set open before mount, nothing fires.
    const el = new TkNote();
    Object.assign(el, { collapsible: true, open: true });
    document.body.appendChild(el);
    await elementUpdated(el);
    el.addEventListener('open-change', (event: Event) => {
      events.push((event as CustomEvent<{ value: boolean }>).detail);
    });
    expect(events).toEqual([]);

    el.open = false;
    await elementUpdated(el);
    expect(events).toEqual([{ value: false }]);

    el.shadowRoot?.querySelector<HTMLButtonElement>('button.note__toggle')?.click();
    await elementUpdated(el);
    expect(events).toEqual([{ value: false }, { value: true }]);
    // Composed + bubbles (CONVENTIONS §3): the event crosses the shadow
    // boundary onto the host's tree.
    const last = events.at(-1);
    expect(last).toEqual({ value: true });
  });

  it('ships the measured surfaces: hook layer with token defaults, body-s fine print, 3-line clamp, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): consumed WITH the token defaults.
    expect(css).toContain('border-radius: var(--tk-note-radius, var(--tk-radius-lg))');
    expect(css).toContain('background: var(--tk-note-fill, var(--tk-color-surface-base))');
    expect(css).toContain('color: var(--tk-note-text, var(--tk-color-text-secondary))');
    expect(css).toContain('gap: var(--tk-note-gap, var(--tk-space-8))');
    // The neutral card's geometry: space-24 padding, radius-lg default.
    expect(css).toContain('padding: var(--tk-space-24)');
    // Fine print = body-s; the info label = body-m on the frozen link color.
    expect(css).toContain('font-size: var(--tk-text-body-s-size)');
    expect(css).toContain('font-size: var(--tk-text-body-m-size)');
    expect(css).toContain('color: var(--tk-color-link)');
    // The kit-legible clamp (AC2: 2–3 lines frozen at 3).
    expect(css).toContain('-webkit-line-clamp: 3');
    expect(css).toContain('overflow: hidden');
    // The info tone paints NO box (the currency grounding).
    expect(css).toContain('background: transparent');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no motion of its own.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });
});
