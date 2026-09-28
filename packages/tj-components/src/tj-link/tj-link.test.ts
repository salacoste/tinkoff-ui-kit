// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { linkStyles } from './tj-link.css.js';
import { TjLink } from './tj-link.js';

/**
 * tj-link unit tests (spec 16.1): the stateless chrome link — native anchor
 * identity, the href inert-content rule (EMPTY is NOT a live href), the
 * 10.4 rel contract (bank dual-tag mold verbatim), target passthrough, and
 * the species pins at the css.ts level (quiet underline, ink-stable hover,
 * focus ring, tokens only).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TjLink): Promise<unknown> => el.updateComplete;

const mount = async (label = 'Читать дальше'): Promise<TjLink> => {
  const el = new TjLink();
  el.textContent = label;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const innerAnchor = (el: TjLink): HTMLAnchorElement => {
  const anchor = el.shadowRoot?.querySelector('a.link');
  expect(anchor, 'inner native <a> renders').toBeInstanceOf(HTMLAnchorElement);
  return anchor as HTMLAnchorElement;
};

describe('tj-link', () => {
  it('registers as tj-link exposing TjLink', async () => {
    await customElements.whenDefined('tj-link');
    expect(customElements.get('tj-link')).toBe(TjLink);
  });

  it('renders a native anchor with the default slot as the label (semantics by construction)', async () => {
    const el = await mount();
    const anchor = innerAnchor(el);
    const defaultSlot = anchor.querySelector('slot:not([name])');
    expect(defaultSlot, 'default slot inside the anchor').not.toBeNull();
    const projected = (defaultSlot?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('Читать дальше');
  });

  it('href rule: non-empty passes through verbatim; nothing reflects on the host', async () => {
    const el = await mount();
    el.href = 'https://example.com/post';
    await elementUpdated(el);
    expect(innerAnchor(el).getAttribute('href')).toBe('https://example.com/post');
    // String DATA — never reflects (CONVENTIONS §2).
    expect(el.getAttributeNames().sort()).toEqual([]);
  });

  it('href rule: EMPTY and absent render NO href attribute (inert content, not focusable)', async () => {
    // Absent.
    const absent = await mount();
    expect(innerAnchor(absent).getAttribute('href')).toBeNull();
    expect(absent.getAttribute('href')).toBeNull();

    // Empty string via property — the 16.1 rule: '' is NOT a live href.
    const empty = await mount();
    empty.href = '';
    await elementUpdated(empty);
    expect(
      innerAnchor(empty).getAttribute('href'),
      "href='' renders an inert anchor — no dangling href=\"\"",
    ).toBeNull();

    // Cleared back from a live href: the attribute disappears again.
    empty.href = '#anchor';
    await elementUpdated(empty);
    expect(innerAnchor(empty).getAttribute('href')).toBe('#anchor');
    empty.href = '';
    await elementUpdated(empty);
    expect(innerAnchor(empty).getAttribute('href')).toBeNull();
  });

  it('target passes through verbatim; empty target renders no attribute', async () => {
    const el = await mount();
    el.href = 'https://example.com';
    el.target = '_blank';
    await elementUpdated(el);
    expect(innerAnchor(el).getAttribute('target')).toBe('_blank');

    el.target = '';
    await elementUpdated(el);
    expect(innerAnchor(el).getAttribute('target')).toBeNull();
  });

  it('rel contract (1/3): target="_blank" with no consumer rel mints "noopener noreferrer"', async () => {
    const el = await mount();
    el.href = 'https://example.com';
    el.target = '_blank';
    await elementUpdated(el);
    expect(innerAnchor(el).getAttribute('rel')).toBe('noopener noreferrer');

    // '' rel reads as unset → the _blank default applies.
    const emptyRel = await mount();
    emptyRel.href = 'https://example.com';
    emptyRel.target = '_blank';
    emptyRel.rel = '';
    await elementUpdated(emptyRel);
    expect(innerAnchor(emptyRel).getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('rel contract (2/3): a consumer rel wins VERBATIM, even with target="_blank"', async () => {
    const el = await mount();
    el.href = 'https://example.com';
    el.target = '_blank';
    el.rel = 'next';
    await elementUpdated(el);
    const rel = innerAnchor(el).getAttribute('rel');
    expect(rel).toBe('next');
    expect(rel).not.toContain('noopener');
  });

  it('rel contract (3/3): no _blank → NO rel attribute at all (blanket rel never)', async () => {
    const noTarget = await mount();
    noTarget.href = '#section';
    await elementUpdated(noTarget);
    expect(innerAnchor(noTarget).getAttribute('rel')).toBeNull();

    const selfTarget = await mount();
    selfTarget.href = '#section';
    selfTarget.target = '_self';
    await elementUpdated(selfTarget);
    expect(innerAnchor(selfTarget).getAttribute('target')).toBe('_self');
    expect(innerAnchor(selfTarget).getAttribute('rel')).toBeNull();
  });

  it('v1 BASE surface: no variant/disabled machinery on the element (freeze pin)', async () => {
    const el = await mount();
    expect('variant' in el).toBe(false);
    expect('disabled' in el).toBe(false);
  });
});

describe('tj-link styles (css.ts pins)', () => {
  const cssText = linkStyles.cssText;

  it('enforces [hidden] (the :host display above out-ranks the UA rule)', () => {
    expect(cssText).toContain(':host([hidden])');
  });

  it('ink consumes the interactive pair token; underline EXISTS but paints transparent at rest', () => {
    expect(cssText).toContain('color: var(--tj-color-link)');
    expect(cssText).toContain('text-decoration: underline');
    expect(cssText).toContain('text-decoration-color: transparent');
  });

  it('measured underline geometry (probe10): 1px thickness, 0.1em offset, position under', () => {
    expect(cssText).toContain('text-decoration-thickness: 1px');
    expect(cssText).toContain('text-underline-offset: 0.1em');
    expect(cssText).toContain('text-underline-position: under');
  });

  it('hover reveals at 70% alpha via color-mix; ink stays put (ink-stable hover)', () => {
    expect(cssText).toContain('.link:hover');
    expect(cssText).toContain('color-mix(in srgb, var(--tj-color-link-body) 70%, transparent)');
    // The hover block declares the decoration only — no standalone color.
    const hoverStart = cssText.indexOf('.link:hover');
    const hoverBlock = cssText.slice(hoverStart, cssText.indexOf('}', hoverStart));
    expect(hoverBlock).not.toMatch(/(?:^|\s)color\s*:/);
  });

  it('motion is the micro duration + standard curve tokens', () => {
    expect(cssText).toContain(
      'transition: text-decoration-color var(--tj-motion-duration-micro) var(--tj-motion-curve-standard)',
    );
  });

  it('focus-ring improvement layer present (2px token ring, offset 2px)', () => {
    expect(cssText).toContain('.link:focus-visible');
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
  });

  it('consumes ТЖ tokens only — zero --tk-* reads (FR-17 family isolation)', () => {
    expect(cssText).not.toContain('--tk-');
  });

  it('carries no theme branches (AD-3: the token layer themes, never the sheet)', () => {
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });
});
