// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { ctaStyles } from './tj-cta.css.js';
import { TjCta } from './tj-cta.js';

/**
 * tj-cta unit tests (spec 16.1): the ANCHOR-ONLY CTA — native anchor
 * identity, the href inert-content rule, the label-span structure above the
 * ::before pill, and the compact-inset pins at the css.ts level (44×44 box,
 * 7px inset-block, radius/fill/ink tokens, NO hover state — the
 * recorded-reference-behavior freeze).
 *
 * Real pixel measurement (44px box with a 30px pill) lives in the Playwright
 * harness, where layout exists — here the structure is pinned by its rules.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TjCta): Promise<unknown> => el.updateComplete;

const mount = async (label = 'Написать'): Promise<TjCta> => {
  const el = new TjCta();
  el.textContent = label;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const innerAnchor = (el: TjCta): HTMLAnchorElement => {
  const anchor = el.shadowRoot?.querySelector('a.cta');
  expect(anchor, 'inner native <a> renders').toBeInstanceOf(HTMLAnchorElement);
  return anchor as HTMLAnchorElement;
};

describe('tj-cta', () => {
  it('registers as tj-cta exposing TjCta', async () => {
    await customElements.whenDefined('tj-cta');
    expect(customElements.get('tj-cta')).toBe(TjCta);
  });

  it('renders a native anchor wrapping the positioned label span (pill paints as ::before)', async () => {
    const el = await mount();
    const anchor = innerAnchor(el);
    const label = anchor.querySelector('.cta__label');
    expect(label, 'positioned label span (paints above the ::before pill)').not.toBeNull();
    expect(label?.querySelector('slot:not([name])'), 'default slot inside the label span').not.toBeNull();
    const projected = (label?.querySelector('slot:not([name])')?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('Написать');
  });

  it('is ANCHOR-ONLY: no button ever renders, no button-ish API exists (freeze pin)', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('button')).toBeNull();
    expect('target' in el).toBe(false);
    expect('rel' in el).toBe(false);
    expect('disabled' in el).toBe(false);
  });

  it('href rule: non-empty passes through verbatim; nothing reflects on the host', async () => {
    const el = await mount();
    el.href = 'https://journal.example.com/subscribe';
    await elementUpdated(el);
    expect(innerAnchor(el).getAttribute('href')).toBe('https://journal.example.com/subscribe');
    expect(el.getAttributeNames().sort()).toEqual([]);
  });

  it('href rule: EMPTY and absent render NO href attribute (inert content)', async () => {
    const absent = await mount();
    expect(innerAnchor(absent).getAttribute('href')).toBeNull();

    const empty = await mount();
    empty.href = '';
    await elementUpdated(empty);
    expect(innerAnchor(empty).getAttribute('href')).toBeNull();

    // Cleared back from a live href: the attribute disappears again.
    empty.href = '#subscribe';
    await elementUpdated(empty);
    expect(innerAnchor(empty).getAttribute('href')).toBe('#subscribe');
    empty.href = '';
    await elementUpdated(empty);
    expect(innerAnchor(empty).getAttribute('href')).toBeNull();
  });
});

describe('tj-cta styles (css.ts pins)', () => {
  const cssText = ctaStyles.cssText;

  it('enforces [hidden] (the :host display above out-ranks the UA rule)', () => {
    expect(cssText).toContain(':host([hidden])');
  });

  it('the invisible interactive box: 44×44 floor, structural (compact-inset mold)', () => {
    expect(cssText).toContain('height: 44px');
    expect(cssText).toContain('min-width: 44px');
  });

  it('the pill: 7px inset-block (44 − 30 = 14, split 7/7), full inline, radius token, fill token', () => {
    expect(cssText).toContain('inset-block: 7px');
    expect(cssText).toContain('inset-inline: 0');
    expect(cssText).toContain('border-radius: var(--tj-radius-cta)');
    expect(cssText).toContain('background: var(--tj-color-cta-fill)');
  });

  it('the ink rides the positioned label span with the token pair', () => {
    expect(cssText).toContain('.cta__label');
    expect(cssText).toContain('color: var(--tj-color-cta-ink)');
  });

  it('label typography: grotesque cta-label tokens (15/400/20)', () => {
    expect(cssText).toContain('font-family: var(--tj-font-ui)');
    expect(cssText).toContain('var(--tj-text-cta-label-size)');
    expect(cssText).toContain('var(--tj-text-cta-label-weight)');
    expect(cssText).toContain('var(--tj-text-cta-label-leading)');
  });

  it('NO hover state — quiet species, the recorded-reference-behavior freeze', () => {
    // The unprobed reference CTA hover is NOT invented here: no :hover
    // selector exists in the sheet at all (cursor affordance only).
    expect(cssText).not.toContain(':hover');
  });

  it('focus-ring improvement layer present around the BOX (2px token ring, offset 2px)', () => {
    expect(cssText).toContain('.cta:focus-visible');
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
  });

  it('consumes ТЖ tokens only — zero --tk-* reads (FR-17 family isolation)', () => {
    expect(cssText).not.toContain('--tk-');
  });

  it('carries no theme branches (AD-3: dark inverts the pill through tokens alone)', () => {
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });
});
