// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, render, type TemplateResult } from 'lit';

import { TjTagChip } from './tj-tag-chip.js';
import { tagChipStyles } from './tj-tag-chip.css.js';

const elementUpdated = (el: TjTagChip) => el.updateComplete;

const mount = (markup: TemplateResult) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(markup, host);
  const el = host.querySelector('tj-tag-chip') as TjTagChip;
  return { el, teardown: () => host.remove() };
};

const innerChip = (el: TjTagChip) => el.shadowRoot?.querySelector('a.chip') as HTMLAnchorElement;

describe('tj-tag-chip registration', () => {
  it('defines on the custom-elements registry exactly once', () => {
    expect(customElements.get('tj-tag-chip')).toBe(TjTagChip);
    // The 16.1 registration idiom — the guard makes double-import safe.
    expect(() => {
      if (!customElements.get('tj-tag-chip')) {
        customElements.define('tj-tag-chip', TjTagChip);
      }
    }).not.toThrow();
  });

  it('exposes its tag on HTMLElementTagNameMap', () => {
    const el = document.createElement('tj-tag-chip');
    expect(el).toBeInstanceOf(TjTagChip);
  });

  it('renders ONE anchor with the label slot and the decorative chevron', async () => {
    const { el, teardown } = mount(html`<tj-tag-chip href="#chip">Курсы</tj-tag-chip>`);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelectorAll('a').length).toBe(1);
    expect(el.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
    const chevron = el.shadowRoot?.querySelector('svg.chip__chevron');
    expect(chevron?.getAttribute('aria-hidden')).toBe('true');
    expect(chevron?.getAttribute('focusable')).toBe('false');
    // currentColor — the glyph rides the chip ink, never a color of its own.
    expect(chevron?.querySelector('path')?.getAttribute('stroke')).toBe('currentColor');
    teardown();
  });
});

describe('tj-tag-chip anchor contract (the 16.1 tj-link mold verbatim)', () => {
  it('renders NO href attribute when href is empty or absent (inert chip)', async () => {
    const { el, teardown } = mount(html`<tj-tag-chip href="">Инертная</tj-tag-chip>`);
    await elementUpdated(el);
    const chip = innerChip(el);
    expect(chip.hasAttribute('href')).toBe(false);
    el.href = '/rubric/kursy';
    await elementUpdated(el);
    expect(chip.getAttribute('href')).toBe('/rubric/kursy');
    el.href = '';
    await elementUpdated(el);
    expect(chip.hasAttribute('href')).toBe(false);
    teardown();
  });

  it('passes target through verbatim', async () => {
    const { el, teardown } = mount(
      html`<tj-tag-chip href="/r/1" target="_blank">Внешняя</tj-tag-chip>`,
    );
    await elementUpdated(el);
    expect(innerChip(el).getAttribute('target')).toBe('_blank');
    teardown();
  });

  it('mints noopener noreferrer exactly when target=_blank and the consumer rel is unset', async () => {
    const { el, teardown } = mount(
      html`<tj-tag-chip href="/r/1" target="_blank">Внешняя</tj-tag-chip>`,
    );
    await elementUpdated(el);
    expect(innerChip(el).getAttribute('rel')).toBe('noopener noreferrer');
    teardown();
  });

  it('keeps the consumer rel verbatim (wins over the _blank mint)', async () => {
    const { el, teardown } = mount(
      html`<tj-tag-chip href="/r/1" target="_blank" rel="nofollow">Внешняя</tj-tag-chip>`,
    );
    await elementUpdated(el);
    expect(innerChip(el).getAttribute('rel')).toBe('nofollow');
    teardown();
  });

  it('mints NO rel for non-_blank targets', async () => {
    const { el, teardown } = mount(
      html`<tj-tag-chip href="/r/1" target="_self">Локальная</tj-tag-chip>`,
    );
    await elementUpdated(el);
    expect(innerChip(el).hasAttribute('rel')).toBe(false);
    teardown();
  });
});

describe('tj-tag-chip theme invariance (the pinned batch decision)', () => {
  it('renders IDENTICALLY under a data-tj-theme=dark ancestor (token pair carries no dark override)', async () => {
    // REAL pin: mount twins — one under a dark-theme ancestor, one without —
    // and require byte-identical shadow trees. Any future theme branch in
    // render() diverges the serializations; the css pair pin (below) and
    // the contrast suite's dark-override list hold the token side.
    const darkHost = document.createElement('div');
    darkHost.setAttribute('data-tj-theme', 'dark');
    document.body.appendChild(darkHost);
    const lightHost = document.createElement('div');
    document.body.appendChild(lightHost);
    const dark = document.createElement('tj-tag-chip') as TjTagChip;
    dark.textContent = 'Тёмный предок';
    darkHost.appendChild(dark);
    const light = document.createElement('tj-tag-chip') as TjTagChip;
    light.textContent = 'Тёмный предок';
    lightHost.appendChild(light);
    await elementUpdated(dark);
    await elementUpdated(light);
    expect(dark.shadowRoot?.innerHTML).toBe(light.shadowRoot?.innerHTML);
    darkHost.remove();
    lightHost.remove();
  });

  it('consumes ONLY the chip pair for colors (theme-invariant by construction)', () => {
    const cssText = tagChipStyles.cssText;
    expect(cssText).toContain('background: var(--tj-color-chip-fill)');
    expect(cssText).toContain('color: var(--tj-color-chip-ink)');
    // No other color token enters the sheet — the pair IS the render.
    const colorTokens = cssText.match(/var\(--tj-color-[a-z0-9-]+\)/g) ?? [];
    expect(new Set(colorTokens)).toEqual(
      new Set(['var(--tj-color-chip-fill)', 'var(--tj-color-chip-ink)']),
    );
  });
});

describe('tj-tag-chip freeze pins (spec 16.3 — no invented states)', () => {
  it('exposes ONLY the anchor trio (no active/selected/disabled)', () => {
    const el = new TjTagChip();
    expect('href' in el).toBe(true);
    expect('active' in el).toBe(false);
    expect('selected' in el).toBe(false);
    expect('disabled' in el).toBe(false);
    expect('variant' in el).toBe(false);
  });
});

describe('tj-tag-chip css.ts pins', () => {
  const cssText = tagChipStyles.cssText;

  it('pins the measured pill geometry and the flagged picks', () => {
    expect(cssText).toContain('height: 40px');
    expect(cssText).toContain('border-radius: var(--tj-radius-chip)');
    expect(cssText).toContain('font-size: var(--tj-text-nav-label-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-nav-label-weight)');
    // The lift + its motion tokens.
    expect(cssText).toContain('transform: translateY(-2px)');
    expect(cssText).toContain('var(--tj-motion-duration-fast)');
    expect(cssText).toContain('var(--tj-motion-curve-standard)');
    // The chevron gap.
    expect(cssText).toContain('margin-inline-start: var(--tj-space-8)');
  });

  it('focus ring = chip-ink, NOT focus-ring (the DESIGN ruling: the generic ring fails 3:1 on purple)', () => {
    expect(cssText).toContain('outline: 2px solid var(--tj-color-chip-ink)');
    // Declaration form: the css.ts comment NAMES the rejected token in prose
    // (cssText keeps comments) — only an actual var() consumption fails.
    expect(cssText).not.toContain('var(--tj-color-focus-ring)');
  });

  it('lifts on hover AND focus-visible together (one shared transform)', () => {
    expect(cssText).toContain('.chip:hover,');
    expect(cssText).toContain('.chip:focus-visible {');
  });

  it('has ZERO theme branches and NO own reduced-motion query (tokens own it)', () => {
    expect(cssText).not.toContain('--tk-');
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
    expect(cssText).not.toContain('prefers-reduced-motion');
  });

  it('carries the flag comments (flag-don’t-invent rule)', () => {
    expect(cssText).toContain('FLAG');
  });
});
