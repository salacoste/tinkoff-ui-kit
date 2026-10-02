// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkQuoteChip } from './quote-chip.js';
import { quoteChipStyles } from './quote-chip.css.js';

/**
 * tk-quote-chip unit tests (spec 22.1): the four forms, the sign→tone
 * derivation (the no-direction-prop ruling), the anchor-vs-span channel,
 * the logo slot's letter fallback, and the css pins (delta tokens, hooks,
 * no raw reference colors). Pixel geometry (24px roundel, 6px gap) lives
 * in the visual harness and the css.ts grounding table.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkQuoteChip): Promise<unknown> => el.updateComplete;

const mount = async (props: Record<string, unknown> = {}): Promise<TkQuoteChip> => {
  const el = new TkQuoteChip();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const chip = (el: TkQuoteChip): Element | null => el.shadowRoot?.querySelector('.chip') ?? null;

describe('tk-quote-chip', () => {
  it('registers as tk-quote-chip exposing TkQuoteChip', async () => {
    await customElements.whenDefined('tk-quote-chip');
    expect(customElements.get('tk-quote-chip')).toBe(TkQuoteChip);
  });

  it('defaults to the pill variant as a reflected host attribute and clamps invalid values (CONVENTIONS §2)', async () => {
    const el = await mount({ ticker: 'SBER' });
    expect(el.variant).toBe('pill');
    expect(el.getAttribute('variant')).toBe('pill');

    for (const variant of ['inline', 'box', 'overflow'] as const) {
      el.variant = variant;
      await elementUpdated(el);
      expect(el.getAttribute('variant')).toBe(variant);
    }

    el.variant = 'bogus' as unknown as TkQuoteChip['variant'];
    await elementUpdated(el);
    expect(el.variant, 'clamps to the union default').toBe('pill');
    expect(el.getAttribute('variant'), 'reflected attribute corrected').toBe('pill');

    el.setAttribute('variant', 'nope');
    await elementUpdated(el);
    expect(el.variant, 'attribute path clamps too').toBe('pill');
  });

  // --- the anchor channel (AC4: href → real <a>, absent → display span) ---

  it('renders a real anchor with the href pass-through when href is set', async () => {
    const el = await mount({ ticker: 'SBER', price: '275,79 ₽', href: '/invest/SBER' });
    const root = chip(el);
    expect(root?.tagName).toBe('A');
    expect(root?.getAttribute('href')).toBe('/invest/SBER');
    expect(el.hasAttribute('tabindex'), 'the host adds no extra tab stop').toBe(false);
  });

  it('renders a display-only span without href — no tabindex, no role, no focus stop', async () => {
    const el = await mount({ ticker: 'SBER', price: '275,79 ₽' });
    const root = chip(el);
    expect(root?.tagName).toBe('SPAN');
    expect(root?.hasAttribute('href')).toBe(false);
    const interactive = el.shadowRoot?.querySelector('[tabindex], [role], button, input');
    expect(interactive, 'no interactive surface exists in the shadow root').toBeNull();
  });

  it('surfaces name as the link title tooltip (never rendered inline)', async () => {
    const el = await mount({ ticker: 'SBER', name: 'Сбербанк', price: '275,79 ₽' });
    expect(chip(el)?.getAttribute('title')).toBe('Сбербанк');
    expect(el.shadowRoot?.textContent).not.toContain('Сбербанк');

    el.name = undefined;
    await elementUpdated(el);
    expect(chip(el)?.hasAttribute('title')).toBe(false);
  });

  // --- the sign→tone derivation (the frozen no-direction-prop ruling) ------

  it('derives the tone from the delta sign: + up, − down, ASCII hyphen down', async () => {
    const el = await mount({ ticker: 'SBER', price: '1 ₽', delta: '+3,8%' });
    expect(el.shadowRoot?.querySelector('.chip__delta--up')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.chip__delta--down')).toBeNull();

    el.delta = '−0,12%'; // U+2212 MINUS SIGN — RU typography
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.chip__delta--down')).toBeTruthy();

    el.delta = '-0.12%'; // sloppy ASCII data
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.chip__delta--down')).toBeTruthy();
  });

  it('an unsigned or absent delta is neutral — the tone classes stay absent', async () => {
    const el = await mount({ ticker: 'SBER', price: '1 ₽', delta: '3,8%' });
    expect(el.shadowRoot?.querySelector('.chip__delta--flat')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.chip__delta--up')).toBeNull();

    el.delta = undefined;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.chip__delta'), 'no delta string — no delta node').toBeNull();
  });

  it('the delta string rides verbatim — the kit never parses or reformats it', async () => {
    const el = await mount({ ticker: 'SBER', price: '1 ₽', delta: '+3,8%' });
    expect(el.shadowRoot?.querySelector('.chip__delta')?.textContent).toBe('+3,8%');
  });

  // --- the logo slot and the letter fallback (the carousel mold) -----------

  it('an empty logo slot falls back to the letter roundel seeded by the ticker', async () => {
    const el = await mount({ ticker: 'sber', price: '275,79 ₽' });
    const letter = el.shadowRoot?.querySelector('.chip__letter');
    expect(letter?.textContent).toBe('S');
    expect(letter?.hasAttribute('hidden')).toBe(false);
    expect(letter?.getAttribute('aria-hidden')).toBe('true');

    const logoSlot = el.shadowRoot?.querySelector('slot[name="logo"]');
    expect(logoSlot).toBeTruthy();
  });

  it('a slotted logo hides the letter roundel (real content wins — the badge slot-presence mold)', async () => {
    const el = await mount({ ticker: 'SBER', price: '275,79 ₽' });
    el.innerHTML = '<span slot="logo">Т</span>';
    await elementUpdated(el);
    // The slotchange listener fires async through Lit's render; flush once.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.chip__letter')?.hasAttribute('hidden')).toBe(true);
  });

  it('an empty ticker degrades to an em-dash roundel (never a crash)', async () => {
    const el = await mount({ price: '275,79 ₽' });
    expect(el.shadowRoot?.querySelector('.chip__letter')?.textContent).toBe('—');
  });

  // --- the four forms --------------------------------------------------------

  it('the pill body renders price + delta; an absent price falls back to the ticker', async () => {
    const el = await mount({ ticker: 'SBER', price: '275,79 ₽', delta: '+3,8%' });
    expect(el.shadowRoot?.querySelector('.chip__price')?.textContent).toBe('275,79 ₽');

    const bare = await mount({ ticker: 'LKOH', delta: '−1,2%' });
    expect(bare.shadowRoot?.querySelector('.chip__price')?.textContent).toBe('LKOH');
  });

  it('the inline form renders only the $TOKEN text — no logo, no price, no delta', async () => {
    const el = await mount({
      variant: 'inline',
      ticker: 'sber',
      price: '275,79 ₽',
      delta: '+3,8%',
      href: '/invest/SBER',
    });
    expect(el.shadowRoot?.querySelector('.chip__token')?.textContent).toBe('$sber');
    expect(el.shadowRoot?.querySelector('.chip__logo')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chip__price')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chip__delta')).toBeNull();
  });

  it('the overflow form renders the default slot as its whole content', async () => {
    const el = await mount({ variant: 'overflow', href: '/invest' });
    el.textContent = 'Ещё 6';
    await elementUpdated(el);
    const slot = el.shadowRoot?.querySelector('.chip > slot');
    expect(slot).toBeTruthy();
    // Slotted text lives in the LIGHT dom — the shadow root stays empty.
    expect(el.textContent).toContain('Ещё 6');
  });

  // --- css pins (the sheet is the contract's visual half) -------------------

  it('pins the sheet to the kit delta tokens — never the reference raw colors', () => {
    // Built by concatenation so the pin's own source never trips FR-1.
    const rawGreen = '#' + '11A836';
    const rawRed = '#' + 'F43838';
    expect(quoteChipStyles.cssText).toContain('var(--tk-color-delta-positive)');
    expect(quoteChipStyles.cssText).toContain('var(--tk-color-delta-negative)');
    expect(quoteChipStyles.cssText, 'the raw site green is never taken').not.toContain(rawGreen);
    expect(quoteChipStyles.cssText, 'the raw site red is never taken').not.toContain(rawRed);
  });

  it('pins the --tk-quote-chip-* hooks with their measured/token defaults', () => {
    const sheet = quoteChipStyles.cssText;
    expect(sheet).toContain('--tk-quote-chip-fill');
    expect(sheet).toContain('--tk-quote-chip-radius');
    expect(sheet).toContain('--tk-quote-chip-gap, 6px');
    expect(sheet).toContain('--tk-quote-chip-text');
    expect(sheet).toContain('--tk-quote-chip-delta-size');
  });

  it('pins the inline form to the semantic link token (never a scale step)', () => {
    expect(quoteChipStyles.cssText).toContain('var(--tk-color-link)');
  });

  it('keeps the hidden guarantee: the host [hidden] rule out-ranks display', () => {
    expect(quoteChipStyles.cssText).toContain(':host([hidden])');
  });
});
