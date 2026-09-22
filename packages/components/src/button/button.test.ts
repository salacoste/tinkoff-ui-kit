// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkButton } from './button.js';

/**
 * tk-button unit tests (spec 1.7): variant/size application + clamping,
 * loading width-freeze, disabled semantics, attribute reflection, icon slot
 * projection, and the click-interception matrix from the I/O table.
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
});
