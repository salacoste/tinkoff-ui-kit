// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkButton } from './button.js';

/**
 * tk-button unit tests (spec 1.7): variant/size application + clamping,
 * loading width-freeze, disabled semantics, attribute reflection, icon slot
 * projection, and the click-interception matrix from the I/O table.
 *
 * Story 10.4 (href mode): the anchor branch — DOM identity of the no-href
 * render (the byte-stability pin, FIRST below), anchor shape, the
 * deterministic rel contract, disabled/loading inertia on the link, and the
 * name guard on the anchor path.
 *
 * Width-freeze split: happy-dom runs no layout engine, so HERE the freeze is
 * pinned by its structural invariants (the label node is never removed,
 * replaced, or taken out of flow — opacity 0 keeps it in the accessibility
 * tree AND occupying space). The REAL pixel measurements (offsetWidth across
 * the loading flip; compact 44px element box with a 32px inner pill) live in
 * the Playwright harness: tests/visual/button.spec.ts, where layout exists.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkButton): Promise<unknown> => el.updateComplete;

/** The composed, cancelable click shape a native activation produces. */
const activationClick = () =>
  new MouseEvent('click', { bubbles: true, composed: true, cancelable: true });

/** The unnamed-label dev guard fires for every intentionally unlabeled mount below — spy it file-wide and assert it in its own test. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

const mount = async (
  attributes: Record<string, string> = {},
  label?: string,
): Promise<TkButton> => {
  const el = new TkButton();
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  if (label !== undefined) el.textContent = label;
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const innerButton = (el: TkButton): HTMLButtonElement => {
  const button = el.shadowRoot?.querySelector('button');
  expect(button, 'inner native <button> renders').toBeInstanceOf(HTMLButtonElement);
  return button as HTMLButtonElement;
};

const label = (el: TkButton): HTMLElement =>
  el.shadowRoot?.querySelector('.button__label') as HTMLElement;

describe('tk-button', () => {
  it('registers as tk-button exposing TkButton', async () => {
    await customElements.whenDefined('tk-button');
    expect(customElements.get('tk-button')).toBe(TkButton);
  });

  it('renders a native button (Space/Enter activation by construction) with type=button', async () => {
    const el = await mount({}, 'Continue');
    expect(innerButton(el).type).toBe('button');
  });

  it('applies the default variant and size as reflected host attributes', async () => {
    const el = await mount({}, 'Continue');
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('card');
    expect(el.getAttribute('variant')).toBe('primary');
    expect(el.getAttribute('size')).toBe('card');
  });

  it('clamps invalid enum values to the union defaults (CONVENTIONS §2: clamp, not throw)', async () => {
    const el = await mount({ variant: 'bogus', size: 'giant' }, 'Continue');
    await elementUpdated(el);
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('card');
    // The reflected attribute is corrected to the value in force.
    expect(el.getAttribute('variant')).toBe('primary');
    expect(el.getAttribute('size')).toBe('card');

    // Property path clamps too, and a later valid value passes through.
    el.variant = 'nope' as unknown as TkButton['variant'];
    await elementUpdated(el);
    expect(el.variant).toBe('primary');
    el.size = 'compact';
    await elementUpdated(el);
    expect(el.getAttribute('size')).toBe('compact');
  });

  it('reflects every boolean/enum prop as an attribute (CONVENTIONS §2)', async () => {
    const el = await mount({}, 'Continue');
    el.variant = 'secondary';
    el.size = 'compact';
    el.loading = true;
    el.disabled = true;
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('secondary');
    expect(el.getAttribute('size')).toBe('compact');
    expect(el.hasAttribute('loading')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    // The inverse direction (attribute drives the property) is the standard
    // Lit attribute path:
    el.setAttribute('variant', 'inverse');
    await elementUpdated(el);
    expect(el.variant).toBe('inverse');
  });

  it('freezes width while loading and keeps the label for screen readers', async () => {
    const el = await mount({}, 'Continue');
    const labelNode = label(el);
    const widthBefore = el.offsetWidth;

    el.loading = true;
    await elementUpdated(el);

    expect(el.offsetWidth, 'offsetWidth unchanged across the loading flip').toBe(widthBefore);
    // The loading flip must neither remove nor replace the label node.
    expect(label(el)).toBe(labelNode);
    expect(el.shadowRoot?.contains(labelNode)).toBe(true);
    // Spinner overlay appears; aria-busy announces the state.
    expect(el.shadowRoot?.querySelector('.button__spinner')).not.toBeNull();
    expect(innerButton(el).getAttribute('aria-busy')).toBe('true');
    // Label retained for SR: the light-DOM label stays projected into the
    // default slot (opacity 0 hides the visual, never the accessible name).
    expect(el.textContent).toContain('Continue');
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    const projected = (defaultSlot?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('Continue');
  });

  it('omits aria-busy/aria-disabled when false (no attribute noise)', async () => {
    const el = await mount({}, 'Continue');
    expect(innerButton(el).getAttribute('aria-busy')).toBeNull();
    expect(innerButton(el).getAttribute('aria-disabled')).toBeNull();

    el.loading = true;
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-busy')).toBe('true');

    el.loading = false;
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-busy')).toBeNull();
  });

  it('announces disabled via aria-disabled and blocks activation', async () => {
    const el = await mount({}, 'Continue');
    let activated = false;
    el.addEventListener('click', () => {
      activated = true;
    });
    await elementUpdated(el);

    el.disabled = true;
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-disabled')).toBe('true');

    innerButton(el).click();
    expect(activated, 'no click event escapes a disabled tk-button').toBe(false);
  });

  it('blocks activation while loading but not at rest, from BOTH dispatch paths (I/O matrix)', async () => {
    const el = await mount({}, 'Continue');
    let activations = 0;
    el.addEventListener('click', () => {
      activations += 1;
    });
    await elementUpdated(el);

    el.loading = true;
    await elementUpdated(el);

    // Path 1: native activation bubbling out of the shadow button.
    const innerClick = activationClick();
    expect(innerButton(el).dispatchEvent(innerClick)).toBe(false);
    expect(innerClick.defaultPrevented, 'inner dispatch is defaultPrevented').toBe(true);

    // Path 2: click dispatched on <tk-button> itself (el.click(), delegation).
    const hostClick = activationClick();
    expect(el.dispatchEvent(hostClick)).toBe(false);
    expect(hostClick.defaultPrevented, 'host dispatch is defaultPrevented').toBe(true);

    expect(activations, 'no activation from either path while loading').toBe(0);

    el.loading = false;
    await elementUpdated(el);
    const restClick = activationClick();
    expect(innerButton(el).dispatchEvent(restClick), 'click activates at rest').toBe(true);
    expect(restClick.defaultPrevented).toBe(false);
    expect(activations).toBe(1);
  });

  it('records the precedence: disabled wins semantics, the spinner may still render', async () => {
    const el = await mount({ loading: '', disabled: '' }, 'Continue');
    await elementUpdated(el);
    const button = innerButton(el);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('.button__spinner')).not.toBeNull();
    // Activation stays blocked (disabled precedence) from both dispatch paths.
    let activated = false;
    el.addEventListener('click', () => {
      activated = true;
    });
    innerButton(el).click();
    el.click();
    expect(activated).toBe(false);
  });

  it('projects the optional left icon slot', async () => {
    const el = await mount();
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('slot', 'icon');
    icon.setAttribute('aria-hidden', 'true');
    el.appendChild(icon);
    el.append('Label');
    await elementUpdated(el);

    const iconSlot = el.shadowRoot?.querySelector('slot[name="icon"]');
    expect(iconSlot, 'named icon slot renders').not.toBeNull();
    // The label slot stays the default (unnamed) slot — default-slot-as-label
    // is the CONVENTIONS §5 resolution.
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(defaultSlot).not.toBeNull();
    // Slot order: icon slot before the default slot (icon renders LEFT).
    const shadowHtml = el.shadowRoot?.innerHTML ?? '';
    expect(shadowHtml.indexOf('slot name="icon"')).toBeLessThan(shadowHtml.indexOf('<slot>'));
  });

  it('warns once when the default slot is empty (no accessible name)', async () => {
    warnSpy.mockClear();
    const el = await mount();
    await elementUpdated(el);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toMatch(/^tk-button: .*accessible name/);

    // Once per element: a later update does not re-warn.
    el.loading = true;
    await elementUpdated(el);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    // A labeled button never warns.
    warnSpy.mockClear();
    await mount({}, 'Continue');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  // --- Story 10.4: href mode (anchor rendering) ---------------------------------
  //
  // The byte-stability pin leads: with href unset the shadow DOM is TODAY's
  // render, byte-for-byte — the branch must be inert by construction.

  /**
   * The exact no-href shadow DOM (Lit 3 through happy-dom): the render-root
   * ChildPart marker, then the button template verbatim. Every whitespace
   * character is load-bearing — this is the byte pin.
   */
  const BUTTON_BRANCH_DOM = `<!---->
      <button class="button" type="button">
        <span class="button__spinner" aria-hidden="true"></span>
        <span class="button__label">
          <slot name="icon"></slot>
          <slot></slot>
        </span>
      </button>
    `;

  it('no-href DOM identity (FIRST, 10.4): absent/""/null/undefined href all render today\'s button DOM byte-for-byte', async () => {
    // Attribute-absent — the literal pin against the pre-story render.
    const plain = await mount({}, 'Continue');
    expect(plain.shadowRoot?.innerHTML).toBe(BUTTON_BRANCH_DOM);
    // The host attribute set is exactly the pre-story one (variant/size
    // defaults; nothing href-related is minted).
    expect(plain.getAttributeNames().sort()).toEqual(['size', 'variant']);

    // '' via attribute → the button branch (null-tolerance, the checkbox
    // `error` mold).
    const emptyAttr = await mount({ href: '' }, 'Continue');
    expect(emptyAttr.shadowRoot?.innerHTML).toBe(BUTTON_BRANCH_DOM);

    // Property round-trip: live href mode, then cleared, returns to the
    // byte-identical button render.
    for (const cleared of ['', null, undefined] as const) {
      const el = await mount({}, 'Continue');
      el.href = '#ios';
      await elementUpdated(el);
      expect(el.shadowRoot?.querySelector('a.button'), 'sanity: href mode was live').not.toBeNull();
      el.href = cleared as unknown as string | undefined;
      await elementUpdated(el);
      expect(
        el.shadowRoot?.innerHTML,
        `href cleared to ${JSON.stringify(cleared)} → the byte-identical button branch`,
      ).toBe(BUTTON_BRANCH_DOM);
    }
  });

  it('href mode renders <a class="button"> with the same inner tree; NO type/role/part; NOTHING is minted on the host (no reflect, 10.3 lesson)', async () => {
    // Property path — the host never sees an href/target/rel attribute.
    const el = await mount({}, 'Скачать для iOS');
    el.href = '#ios';
    await elementUpdated(el);

    const anchor = el.shadowRoot?.querySelector('a.button');
    expect(anchor, 'the anchor renders').toBeInstanceOf(HTMLAnchorElement);
    expect(anchor?.getAttribute('href')).toBe('#ios');
    expect(el.shadowRoot?.querySelector('button'), 'no button in href mode').toBeNull();
    // Button-only / never-minted attributes stay absent.
    expect(anchor?.getAttribute('type')).toBeNull();
    expect(anchor?.getAttribute('role'), 'native anchor semantics are correct').toBeNull();
    expect(anchor?.getAttribute('part'), 'no part exists today').toBeNull();
    // Same inner tree: spinner + label wrapper + both slots, icon LEFT of label.
    expect(el.shadowRoot?.querySelector('.button__spinner[aria-hidden="true"]')).not.toBeNull();
    const labelNode = el.shadowRoot?.querySelector('.button__label');
    expect(labelNode?.querySelector('slot[name="icon"]')).not.toBeNull();
    expect(labelNode?.querySelector('slot:not([name])')).not.toBeNull();
    const shadowHtml = el.shadowRoot?.innerHTML ?? '';
    expect(shadowHtml.indexOf('slot name="icon"')).toBeLessThan(shadowHtml.indexOf('<slot>'));
    // The accessible name is the slotted label (projection unchanged).
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    const projected = (defaultSlot?.assignedNodes() ?? [])
      .map((node) => node.textContent ?? '')
      .join('');
    expect(projected).toContain('Скачать для iOS');
    // NO reflect: the union of absent host attributes IS the byte-stability
    // guarantee — only the pre-story variant/size defaults sit on the host.
    expect(el.getAttributeNames().sort()).toEqual(['size', 'variant']);
  });

  it('rel contract (1/3): target="_blank" with no consumer rel mints the store-badges "noopener noreferrer"', async () => {
    const el = await mount({}, 'Открыть');
    el.href = 'https://example.com';
    el.target = '_blank';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('a.button')?.getAttribute('rel')).toBe(
      'noopener noreferrer',
    );
    expect(el.shadowRoot?.querySelector('a.button')?.getAttribute('target')).toBe('_blank');

    // '' rel is "unset" (same null-tolerance as href) → the default mints.
    const emptyRel = await mount({}, 'Открыть');
    emptyRel.href = 'https://example.com';
    emptyRel.target = '_blank';
    emptyRel.rel = '';
    await elementUpdated(emptyRel);
    expect(
      emptyRel.shadowRoot?.querySelector('a.button')?.getAttribute('rel'),
      "rel='' reads as unset — the _blank default applies",
    ).toBe('noopener noreferrer');
  });

  it('rel contract (2/3): a consumer rel wins VERBATIM, even with target="_blank" — never force-injects noopener', async () => {
    const el = await mount({}, 'Открыть');
    el.href = 'https://example.com';
    el.target = '_blank';
    el.rel = 'next';
    await elementUpdated(el);
    const rel = el.shadowRoot?.querySelector('a.button')?.getAttribute('rel');
    expect(rel).toBe('next');
    expect(rel).not.toContain('noopener');
  });

  it('rel contract (3/3): no _blank → NO rel attribute at all (same-tab navigation; blanket rel never)', async () => {
    // No target whatsoever.
    const noTarget = await mount({}, 'Скачать');
    noTarget.href = '#ios';
    await elementUpdated(noTarget);
    expect(noTarget.shadowRoot?.querySelector('a.button')?.getAttribute('rel')).toBeNull();
    expect(noTarget.shadowRoot?.querySelector('a.button')?.getAttribute('target')).toBeNull();

    // A target that is NOT _blank renders verbatim and still mints no rel —
    // noopener only matters when a NEW browsing context opens.
    const selfTarget = await mount({}, 'Скачать');
    selfTarget.href = '#ios';
    selfTarget.target = '_self';
    await elementUpdated(selfTarget);
    expect(selfTarget.shadowRoot?.querySelector('a.button')?.getAttribute('target')).toBe('_self');
    expect(selfTarget.shadowRoot?.querySelector('a.button')?.getAttribute('rel')).toBeNull();
  });

  it('href + disabled: aria-disabled anchor, href kept (must not lose its address), synthetic clicks prevented from BOTH dispatch paths', async () => {
    const el = await mount({}, 'Скачать');
    el.href = '#ios';
    el.disabled = true;
    await elementUpdated(el);

    const anchor = el.shadowRoot?.querySelector('a.button');
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
    expect(anchor?.getAttribute('href'), 'an href link keeps its address (right-click/copy)').toBe(
      '#ios',
    );
    expect(
      anchor?.getAttribute('tabindex'),
      'nothing mints tabindex — the link stays in the tab order (aria-disabled pattern)',
    ).toBeNull();

    // The host-level constructor listener covers the anchor exactly as it
    // covers the button: dispatch on the inner anchor (composed, bubbles).
    const innerClick = activationClick();
    expect(anchor?.dispatchEvent(innerClick)).toBe(false);
    expect(innerClick.defaultPrevented, 'no navigation from the inner dispatch').toBe(true);
    // Dispatch on <tk-button> itself (el.click(), delegation).
    const hostClick = activationClick();
    expect(el.dispatchEvent(hostClick)).toBe(false);
    expect(hostClick.defaultPrevented, 'no navigation from the host dispatch').toBe(true);

    // Rest re-enables activation (the click is no longer canceled).
    el.disabled = false;
    await elementUpdated(el);
    const restClick = activationClick();
    expect(el.dispatchEvent(restClick)).toBe(true);
    expect(restClick.defaultPrevented).toBe(false);
  });

  it('href + loading: aria-busy + spinner, clicks prevented; disabled-over-loading precedence unchanged on the anchor', async () => {
    const el = await mount({}, 'Скачать');
    el.href = '#ios';
    el.loading = true;
    await elementUpdated(el);

    const anchor = el.shadowRoot?.querySelector('a.button');
    expect(anchor?.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('.button__spinner')).not.toBeNull();
    const loadingClick = activationClick();
    expect(anchor?.dispatchEvent(loadingClick)).toBe(false);
    expect(loadingClick.defaultPrevented, 'no navigation while loading').toBe(true);

    // Precedence: disabled wins semantics; the spinner may keep rendering.
    el.disabled = true;
    await elementUpdated(el);
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
    expect(anchor?.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('.button__spinner')).not.toBeNull();
    const bothClick = activationClick();
    expect(el.dispatchEvent(bothClick)).toBe(false);
    expect(bothClick.defaultPrevented).toBe(true);
  });

  it('name guard fires identically on the anchor path: empty default slot warns once', async () => {
    warnSpy.mockClear();
    const el = await mount({ href: '#ios' });
    await elementUpdated(el);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toMatch(/^tk-button: .*accessible name/);

    // Once per element — a later anchor-branch update does not re-warn.
    el.loading = true;
    await elementUpdated(el);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    // A labeled link never warns.
    warnSpy.mockClear();
    await mount({ href: '#ios' }, 'Скачать');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
