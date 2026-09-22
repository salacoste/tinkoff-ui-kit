// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkLink } from './link.js';

/**
 * tk-link unit tests (spec 3.1): variant application + clamping, attribute
 * reflection, href/target/rel pass-through onto the shadow anchor, the
 * disabled matrix (aria-disabled + inert clicks from both dispatch paths),
 * and the STRUCTURAL style wiring — hover/:focus-visible underline (none at
 * rest), the legal body-xs gray typography and the standalone body-m +
 * 44px target floor are pinned on the stylesheet text (happy-dom runs no
 * layout engine; the real-pixel half lives in the Playwright harness and
 * .playwright-cli/verify/link/).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkLink): Promise<unknown> => el.updateComplete;

/** The composed, cancelable click shape a native activation produces. */
const activationClick = () =>
  new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });

const mount = async (
  attributes: Record<string, string> = {},
  label?: string,
): Promise<TkLink> => {
  const el = new TkLink();
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  if (label !== undefined) el.textContent = label;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const anchor = (el: TkLink): HTMLAnchorElement => {
  const link = el.shadowRoot?.querySelector('a.link');
  expect(link, 'inner native <a> renders').toBeInstanceOf(HTMLAnchorElement);
  return link as HTMLAnchorElement;
};

/** The concatenated stylesheet text — the structural pin surface. */
const sheet = (): string =>
  TkLink.styles.map((style) => (style as { cssText?: string }).cssText ?? '').join('\n');

describe('tk-link', () => {
  it('registers as tk-link exposing TkLink', async () => {
    await customElements.whenDefined('tk-link');
    expect(customElements.get('tk-link')).toBe(TkLink);
  });

  it('renders a native anchor with the default slot as the label', async () => {
    const el = await mount({ href: '/deposit' }, 'Читать далее');
    const link = anchor(el);
    expect(link.tagName).toBe('A');
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(defaultSlot, 'default slot renders inside the anchor').not.toBeNull();
    const projected = (defaultSlot?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('Читать далее');
  });

  it('applies the default variant as a reflected host attribute', async () => {
    const el = await mount({}, 'Читать');
    expect(el.variant).toBe('inline');
    expect(el.getAttribute('variant')).toBe('inline');
  });

  it('renders every variant and clamps invalid values to the union default (CONVENTIONS §2)', async () => {
    const el = await mount({ variant: 'legal' }, 'Политика');
    expect(el.getAttribute('variant')).toBe('legal');

    el.setAttribute('variant', 'standalone');
    await elementUpdated(el);
    expect(el.variant).toBe('standalone');

    el.setAttribute('variant', 'bogus');
    await elementUpdated(el);
    expect(el.variant, 'attribute path clamps').toBe('inline');
    expect(el.getAttribute('variant'), 'reflected attribute corrected').toBe('inline');

    el.variant = 'nope' as unknown as TkLink['variant'];
    await elementUpdated(el);
    expect(el.variant, 'property path clamps').toBe('inline');
    expect(el.getAttribute('variant')).toBe('inline');
  });

  it('reflects the boolean disabled prop as a bare attribute', async () => {
    const el = await mount({}, 'Читать');
    expect(el.hasAttribute('disabled')).toBe(false);
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).toBe(true);
    el.disabled = false;
    await elementUpdated(el);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('passes href/target/rel through to the inner anchor (the reflected surface)', async () => {
    const el = await mount({}, 'Открыть');
    const link = anchor(el);
    expect(link.getAttribute('href')).toBeNull();
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('rel')).toBeNull();

    el.href = '/cards';
    el.target = '_blank';
    el.rel = 'noopener';
    await elementUpdated(el);
    expect(link.getAttribute('href')).toBe('/cards');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');

    // Later changes flow through; removal clears the anchor attributes.
    el.href = '/deposits';
    el.target = undefined;
    await elementUpdated(el);
    expect(link.getAttribute('href')).toBe('/deposits');
    expect(link.getAttribute('target')).toBeNull();
  });

  it('announces disabled via aria-disabled on the anchor (omitted when false)', async () => {
    const el = await mount({}, 'Читать');
    expect(anchor(el).getAttribute('aria-disabled')).toBeNull();
    el.disabled = true;
    await elementUpdated(el);
    expect(anchor(el).getAttribute('aria-disabled')).toBe('true');
    el.disabled = false;
    await elementUpdated(el);
    expect(anchor(el).getAttribute('aria-disabled')).toBeNull();
  });

  it('disabled is inert from BOTH dispatch paths (I/O matrix: no navigation, no escape)', async () => {
    const el = await mount({ href: '/cards' }, 'Открыть');
    let escaped = 0;
    el.addEventListener('click', () => {
      escaped += 1;
    });
    await elementUpdated(el);

    el.disabled = true;
    await elementUpdated(el);

    // Path 1: native activation bubbling out of the shadow anchor.
    const innerClick = activationClick();
    expect(anchor(el).dispatchEvent(innerClick)).toBe(false);
    expect(innerClick.defaultPrevented, 'inner dispatch defaultPrevented (no navigation)').toBe(
      true,
    );

    // Path 2: click dispatched on <tk-link> itself (el.click(), delegation).
    const hostClick = activationClick();
    expect(el.dispatchEvent(hostClick)).toBe(false);
    expect(hostClick.defaultPrevented, 'host dispatch defaultPrevented').toBe(true);

    expect(escaped, 'no click event escapes a disabled tk-link').toBe(0);

    el.disabled = false;
    await elementUpdated(el);
    const restClick = activationClick();
    expect(anchor(el).dispatchEvent(restClick), 'click passes at rest').toBe(true);
    expect(restClick.defaultPrevented).toBe(false);
    expect(escaped).toBe(1);
  });

  it('ships the hover/:focus-visible underline wiring and NO visible rest underline (matrix: underline appears; focus always visible)', () => {
    const css = sheet();
    // Rest: the line is painted with a TRANSPARENT decoration color —
    // visually no underline (the capture's plain word) while staying
    // animatable.
    expect(css).toContain('text-decoration-color: transparent');
    expect(css).not.toContain('text-decoration: none');
    // Hover AND keyboard focus fade the line in (the one affordance).
    expect(css).toMatch(
      /\.link:hover,\s*\.link:focus-visible\s*{\s*text-decoration-color: currentColor/,
    );
    // The fade consumes the 150ms motion token (EXPERIENCE State Patterns'
    // letter; AD-9 — collapses to 0ms under prefers-reduced-motion via the
    // token layer).
    expect(css).toContain(
      'transition:\n      text-decoration-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard)',
    );
    // Disabled clicks die at the host boundary (pointer-events none).
    expect(css).toContain(':host([disabled]) {\n    pointer-events: none');
  });

  it('ships the legal typography: body-xs, text-secondary gray, no rest underline of its own (matrix: legal variant)', () => {
    const css = sheet();
    expect(css).toContain(":host([variant='legal']) .link {");
    const legalBlock = css.slice(css.indexOf(":host([variant='legal']) .link {"));
    expect(legalBlock).toContain('var(--tk-text-body-xs-size)');
    expect(legalBlock).toContain('var(--tk-text-body-xs-weight)');
    expect(legalBlock).toContain('var(--tk-text-body-xs-leading)');
    expect(legalBlock).toContain('color: var(--tk-color-text-secondary)');
    // The legal block sets color/typography only — no rest underline rule
    // overrides the shared `text-decoration: none` at rest.
    expect(legalBlock).not.toContain('text-decoration: underline');
  });

  it('ships the standalone typography and the 44×44 interactive-target floor', () => {
    const css = sheet();
    expect(css).toContain(":host([variant='standalone']) .link {");
    const standaloneBlock = css.slice(css.indexOf(":host([variant='standalone']) .link {"));
    expect(standaloneBlock).toContain('var(--tk-text-body-m-size)');
    expect(standaloneBlock).toContain('var(--tk-text-body-m-weight)');
    // Block axis floor + inline padding so a short label («Далее») cannot
    // fall under 44px WIDE — the button-compact pairing precedent.
    expect(standaloneBlock).toContain('min-height: 44px');
    expect(standaloneBlock).toContain('padding-inline: var(--tk-space-12)');
  });

  it('consumes only the semantic link token for color (no scale steps, no theme branches)', () => {
    const css = sheet();
    expect(css).toContain('color: var(--tk-color-link)');
    expect(css).not.toContain('var(--tk-color-blue-100)');
    expect(css).not.toContain('var(--tk-color-blue-200)');
    expect(css).not.toContain('data-theme');
  });
});
