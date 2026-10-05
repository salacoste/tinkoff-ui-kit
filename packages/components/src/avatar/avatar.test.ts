// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkAvatar } from './avatar.js';

/**
 * tk-avatar unit tests (spec 26.3): the three derived states (image /
 * initials / placeholder — never stored, the tk-rating stateless ruling),
 * the initials math («Мария Оганова» → «МО», clip to 2, uppercase), the
 * identity stamp (role=img + aria-label=name at connect, the React-19
 * law; a cleared name withdraws exactly what we set), the decode-failure
 * fallback latch, the size geometry channel (host inline custom
 * property, the skeleton mold) and the structural CSS pins (hook layer
 * with token defaults, cover crop, the hidden guard, no motion).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkAvatar): Promise<unknown> => el.updateComplete;

type AvatarProps = { src?: string; name?: string; size?: string; ariaHidden?: string };

const mount = async (props: AvatarProps = {}): Promise<TkAvatar> => {
  const el = new TkAvatar();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3:
 *  cssText keeps comments, and rulings are worded IN them). */
const sheetCss = (): string =>
  TkAvatar.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-avatar', () => {
  it('registers as tk-avatar exposing TkAvatar', async () => {
    await customElements.whenDefined('tk-avatar');
    expect(customElements.get('tk-avatar')).toBe(TkAvatar);
  });

  it('renders the IMAGE state: internal img, cover-cropped, lazy + async decoding (the tk-figure mold)', async () => {
    const el = await mount({ src: 'https://example.test/pic.png', name: 'Мария Оганова' });
    const img = el.shadowRoot?.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('https://example.test/pic.png');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
    expect(img?.getAttribute('alt')).toBe(''); // the host role=img owns the name
    expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
  });

  it('renders the INITIALS state: «Мария Оганова» → «МО», single word → one letter, clip at two words', async () => {
    const two = await mount({ name: 'Мария Оганова' });
    expect(two.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('МО');
    expect(two.shadowRoot?.querySelector('img')).toBeNull();

    const one = await mount({ name: 'Вероника' });
    expect(one.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('В');

    // Three words take the FIRST two only — the clip is positional, not greedy.
    const three = await mount({ name: 'Анна Павловна Ковалёва' });
    expect(three.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('АП');

    // Lowercase input still uppercases; extra whitespace collapses.
    const messy = await mount({ name: '  иван   петров ' });
    expect(messy.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('ИП');
  });

  it('renders the PLACEHOLDER state: a flat disc with neither img nor initials', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('img')).toBeNull();
    expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
    expect(el.shadowRoot?.querySelector('.circle')).not.toBeNull();
  });

  it('stamps role=img + aria-label=name at connect (the React-19 law) and recomputes on rename', async () => {
    const el = await mount({ name: 'Мария Оганова' });
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Мария Оганова');

    el.name = 'Иван Петров';
    await elementUpdated(el);
    expect(el.getAttribute('aria-label')).toBe('Иван Петров');
  });

  it('withdraws exactly its own identity when the name clears — a consumer host label is never touched', async () => {
    const el = await mount({ name: 'Мария Оганова' });
    el.name = '';
    await elementUpdated(el);
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);

    // The unnamed disc is the consumer's contract: their own host label
    // passes through untouched (named-or-hidden, AC3).
    const consumer = await mount();
    consumer.setAttribute('aria-label', 'Аватар автора');
    consumer.name = '';
    await elementUpdated(consumer);
    expect(consumer.getAttribute('aria-label')).toBe('Аватар автора');
    expect(consumer.hasAttribute('role')).toBe(false);
  });

  it('falls back from a failed decode to initials, and a NEW src resets the latch', async () => {
    const el = await mount({ src: '/broken.png', name: 'Мария Оганова' });
    expect(el.shadowRoot?.querySelector('img')).not.toBeNull();

    el.shadowRoot?.querySelector('img')?.dispatchEvent(new Event('error'));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('img')).toBeNull();
    expect(el.shadowRoot?.querySelector('.initials')?.textContent?.trim()).toBe('МО');

    // src change → fresh decode attempt (the latch is per-src, not per-element).
    el.src = '/fresh.png';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('img')?.getAttribute('src')).toBe('/fresh.png');
    expect(el.shadowRoot?.querySelector('.initials')).toBeNull();
  });

  it('applies size as the host inline custom property — one channel with the hook (the skeleton mold)', async () => {
    const el = await mount({ size: '20px' });
    expect(el.style.getPropertyValue('--tk-avatar-size')).toBe('20px');

    el.size = '';
    await elementUpdated(el);
    expect(el.style.getPropertyValue('--tk-avatar-size')).toBe(''); // override gone, 45 default returns
  });

  it('reflects the decorative aria-hidden property (the admin-feed repeat pattern)', async () => {
    const el = await mount({ name: 'Мария Оганова', ariaHidden: 'true' });
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('wraps the consumer slot in a decorative overlay (status dots are consumer content, AC4)', async () => {
    const el = await mount({ name: 'Мария Оганова' });
    const overlay = el.shadowRoot?.querySelector('.overlay');
    expect(overlay?.getAttribute('aria-hidden')).toBe('true');
    expect(overlay?.querySelector('slot')).not.toBeNull();
  });

  it('is STATELESS: no tabindex, nothing dispatchable (the tk-rating mold)', async () => {
    const el = await mount({ name: 'Мария Оганова', src: 'https://example.test/pic.png' });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.tabIndex).toBe(-1); // not focusable
    expect(el.shadowRoot?.querySelector('button')).toBeNull();
  });

  it('ships the measured surface: hook layer with token defaults, 50% disc, cover crop, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6): size feeds box AND glyph — one channel;
    // the 45px default is the news measurement (spec 20.1).
    expect(css).toContain('width: var(--tk-avatar-size, 45px)');
    expect(css).toContain('height: var(--tk-avatar-size, 45px)');
    expect(css).toContain('font-size: calc(var(--tk-avatar-size, 45px) * 0.4)');
    expect(css).toContain('background: var(--tk-avatar-bg, var(--tk-color-surface-muted))');
    expect(css).toContain('color: var(--tk-avatar-fg, var(--tk-color-text-secondary))');
    // The round register (AC4): a full disc, the image clipped by it.
    expect(css).toContain('border-radius: 50%');
    expect(css).toContain('object-fit: cover');
    expect(css).toContain('overflow: hidden');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT law: no motion of its own.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });
});
