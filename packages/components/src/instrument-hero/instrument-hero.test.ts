// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { instrumentHeroStyles } from './instrument-hero.css.js';
import { TK_INSTRUMENT_HERO_TONES, TkInstrumentHero, type TkInstrumentHeroTone } from './instrument-hero.js';
import './instrument-hero.js';

/**
 * tk-instrument-hero unit tests (spec 22.5): the render anatomy (name
 * prop/slot override, ticker, tone reflection), the metric
 * slot-presence contract, the stateless no-channel law, and the
 * structural pins (the four token gradients, radius/padding/typography
 * mapping, the hook layer) asserted against the cssText / DOM the way
 * the kv-list and data-table suites pin their sheets.
 */

const elementUpdated = (el: Element & { updateComplete: Promise<unknown> }): Promise<unknown> => el.updateComplete;

const mount = async (markup = '', props: Partial<InstanceType<typeof TkInstrumentHero>> = {}): Promise<TkInstrumentHero> => {
  const host = document.createElement('div');
  host.innerHTML = `<tk-instrument-hero>${markup}</tk-instrument-hero>`;
  const el = host.firstElementChild as TkInstrumentHero;
  document.body.appendChild(el);
  Object.assign(el, props);
  await elementUpdated(el);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  return el;
};

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = (): string => instrumentHeroStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-instrument-hero', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-instrument-hero exposing TkInstrumentHero', async () => {
    await customElements.whenDefined('tk-instrument-hero');
    expect(customElements.get('tk-instrument-hero')).toBe(TkInstrumentHero);
  });

  it('renders the name prop and the ticker; the name SLOT overrides the prop (the heading-semantics channel)', async () => {
    const el = await mount('', { name: 'Сбербанк', ticker: 'SBER' });
    const nameSlot = el.shadowRoot?.querySelector('.hero__name slot[name="name"]');
    expect(nameSlot, 'the name renders as the slot fallback').toBeInstanceOf(HTMLSlotElement);
    expect(nameSlot?.textContent).toBe('Сбербанк');
    expect(el.shadowRoot?.querySelector('.hero__ticker')?.textContent).toBe('SBER');
    // Slotted content wins: a consumer heading rides through unchanged.
    const slotted = await mount('<h2 slot="name">Облигация Х</h2>', { name: 'ПРОП-ЗАГЛУШКА' });
    const assigned = slotted.shadowRoot
      ?.querySelector<HTMLSlotElement>('.hero__name slot[name="name"]')
      ?.assignedNodes({ flatten: true }) ?? [];
    expect(assigned.some((node) => (node as Element).tagName === 'H2')).toBe(true);
    expect(assigned.some((node) => node.textContent === 'ПРОП-ЗАГЛУШКА')).toBe(false);
  });

  it('renders a DIV for the name — never a heading (AC3: the h-level is consumer document structure)', async () => {
    const el = await mount('', { name: 'Сбербанк' });
    expect(el.shadowRoot?.querySelector('h1,h2,h3,h4,h5,h6')).toBeNull();
    expect(el.shadowRoot?.querySelector('.hero__name')?.tagName).toBe('DIV');
  });

  it('omitted ticker renders no ticker node (§2 degrade)', async () => {
    const el = await mount('', { name: 'Венчурные Инвестиции 1' });
    expect(el.shadowRoot?.querySelector('.hero__ticker')).toBeNull();
  });

  it('metric block: renders label prop + value slot ONLY while the slot carries real content', async () => {
    const withMetric = await mount('<span slot="metric">15,76% на 8 месяцев</span>', { metricLabel: 'Доходность к погашению' });
    expect(withMetric.shadowRoot?.querySelector('.hero__metric')).toBeInstanceOf(Element);
    expect(withMetric.shadowRoot?.querySelector('.hero__metric-label')?.textContent).toBe('Доходность к погашению');
    const assigned = withMetric.shadowRoot
      ?.querySelector<HTMLSlotElement>('.hero__metric-value slot')?.assignedNodes({ flatten: true }) ?? [];
    expect(assigned.map((node) => node.textContent).join('')).toBe('15,76% на 8 месяцев');

    // No metric markup → no metric block at all (the etf/currency anatomy
    // — an empty flex item would fake the card rhythm; the empty-state
    // mold; a slotted ELEMENT counts as real content by the badge rule).
    const without = await mount('', { metricLabel: 'Останется без блока' });
    expect(without.shadowRoot?.querySelector('.hero__metric')).toBeNull();

    // Label is optional: a bare value renders the block with no caption.
    const bare = await mount('<b slot="metric">Расчетный</b>');
    expect(bare.shadowRoot?.querySelector('.hero__metric')).toBeInstanceOf(Element);
    expect(bare.shadowRoot?.querySelector('.hero__metric-label')).toBeNull();
  });

  it('reflects the tone attribute and clamps nothing (the four measured families)', async () => {
    const el = await mount('', { name: 'X' });
    expect(el.getAttribute('tone')).toBe('stock'); // the default family
    expect(TK_INSTRUMENT_HERO_TONES).toEqual(['stock', 'bond', 'dark', 'light']);
    for (const tone of TK_INSTRUMENT_HERO_TONES as TkInstrumentHeroTone[]) {
      el.tone = tone;
      await elementUpdated(el);
      expect(el.getAttribute('tone')).toBe(tone);
    }
  });

  it('consumes SEMANTICS for its paint: the four token gradients, radius-xl, space-24 padding, heading-4 name, white/ink polarity (structural pin)', () => {
    const cssText = sheet();
    // Default (stock): horizontal gradient from the minted identity stops.
    expect(cssText).toMatch(
      /background:\s*var\(--tk-instrument-hero-bg,\s*linear-gradient\(\s*90deg,\s*var\(--tk-color-invest-stock-a\),\s*var\(--tk-color-invest-stock-b\)\s*\)\)/,
    );
    // Bond: the measured 135deg diagonal.
    expect(cssText).toMatch(
      /:host\(\[tone='bond'\]\)\s*\{[^}]*linear-gradient\(\s*135deg,\s*var\(--tk-color-invest-bond-a\),\s*var\(--tk-color-invest-bond-b\)\s*\)/,
    );
    // Dark: horizontal from the near-black family.
    expect(cssText).toMatch(
      /:host\(\[tone='dark'\]\)\s*\{[^}]*linear-gradient\(\s*90deg,\s*var\(--tk-color-invest-dark-a\),\s*var\(--tk-color-invest-dark-b\)\s*\)/,
    );
    // Light: horizontal light grays with the ink polarity flip.
    expect(cssText).toMatch(
      /:host\(\[tone='light'\]\)\s*\{[^}]*linear-gradient\(\s*90deg,\s*var\(--tk-color-invest-light-a\),\s*var\(--tk-color-invest-light-b\)\s*\)[^}]*color:\s*var\(--tk-color-ink-300\)/,
    );
    // The white families keep plain white text (theme-invariant tokens —
    // the card never flips with data-theme).
    expect(cssText).toMatch(/:host\s*\{[^}]*color:\s*var\(--tk-color-white\)/);
    // Card chrome: radius-xl, space-24 padding, the 188px floor.
    expect(cssText).toMatch(/border-radius:\s*var\(--tk-instrument-hero-radius,\s*var\(--tk-radius-xl\)\)/);
    expect(cssText).toMatch(/padding:\s*var\(--tk-instrument-hero-padding,\s*var\(--tk-space-24\)\)/);
    expect(cssText).toMatch(/min-height:\s*var\(--tk-instrument-hero-min-height,\s*188px\)/);
    // Name: heading-4 size with the live 700 bold.
    expect(cssText).toMatch(
      /\.hero__name\s*\{[^}]*font-size:\s*var\(--tk-text-heading-4-size\)[^}]*font-weight:\s*700/,
    );
    // Ticker + metric label ride body-s; the value rides body-m bold.
    expect(cssText).toMatch(/\.hero__ticker\s*\{[^}]*font-size:\s*var\(--tk-text-body-s-size\)/);
    expect(cssText).toMatch(/\.hero__metric-label\s*\{[^}]*font-size:\s*var\(--tk-text-body-s-size\)/);
    expect(cssText).toMatch(
      /\.hero__metric-value\s*\{[^}]*font-size:\s*var\(--tk-text-body-m-size\)[^}]*font-weight:\s*var\(--tk-text-body-m-bold-weight\)/,
    );
    // The title stops BEFORE the logo-disc corridor — long names wrap
    // over running under the disc (the review-lens round; the metric's
    // 60% cap is the same protection). Rides the existing hooks only.
    expect(cssText).toMatch(
      /\.hero__title\s*\{[^}]*max-width:\s*calc\(\s*100% - var\(--tk-instrument-hero-logo-inset,\s*var\(--tk-space-48\)\) -\s*var\(--tk-instrument-hero-logo-size,\s*96px\)\s*\)/,
    );
    // The heading channel keeps semantics, drops UA chrome: a slotted
    // h1–h6 renders at the card's measured band (margin 0, inherit).
    expect(cssText).toMatch(
      /\.hero__name ::slotted\(h1, h2, h3, h4, h5, h6\)\s*\{[^}]*margin:\s*0[^}]*font-size:\s*inherit/,
    );
    // Logo disc: the 96px capture literal, round, absolute right.
    expect(cssText).toMatch(
      /\.hero__logo\s*\{[^}]*width:\s*var\(--tk-instrument-hero-logo-size,\s*96px\)[^}]*border-radius:\s*var\(--tk-radius-full\)/,
    );
  });

  it('hook layer is exactly the seven sanctioned hooks (no scale mint rides the sheet)', () => {
    const cssText = sheet();
    const hooks = new Set([...cssText.matchAll(/--tk-instrument-hero-([a-z-]+)/g)].map((m) => `--tk-instrument-hero-${m[1]}`));
    expect(hooks).toEqual(
      new Set([
        '--tk-instrument-hero-bg',
        '--tk-instrument-hero-radius',
        '--tk-instrument-hero-padding',
        '--tk-instrument-hero-min-height',
        '--tk-instrument-hero-logo-size',
        '--tk-instrument-hero-logo-inset',
        '--tk-instrument-hero-gap',
      ]),
    );
  });

  it('STATELESS: the atom dispatches nothing (no synthetic channels over the slotted action)', async () => {
    const el = await mount('<button slot="action" type="button">star</button>', { name: 'X' });
    const heard: string[] = [];
    for (const name of ['select', 'activate', 'toggle', 'favorite-change', 'value-change', 'open-change']) {
      el.addEventListener(name, () => heard.push(name));
    }
    el.querySelector('button')?.click();
    expect(heard).toEqual([]); // the consumer's button keeps its own native click
  });

  it('logo and action slots ride their measured seats (wrapper present, content consumer-owned)', async () => {
    const el = await mount('<button slot="action" type="button">★</button><img slot="logo" alt="" src="/logos/x.svg" />');
    expect(el.shadowRoot?.querySelector('.hero__action')).toBeInstanceOf(Element);
    expect(el.shadowRoot?.querySelector('.hero__logo')).toBeInstanceOf(Element);
    const logoAssigned = el.shadowRoot
      ?.querySelector<HTMLSlotElement>('.hero__logo slot')?.assignedNodes({ flatten: true }) ?? [];
    expect(logoAssigned.some((node) => (node as Element).tagName === 'IMG')).toBe(true);
  });
});
