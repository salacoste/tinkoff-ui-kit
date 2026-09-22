// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkButton } from './button.js';

/**
 * tk-button unit tests (spec 1.7): variant/size application, loading
 * width-freeze, disabled semantics, attribute reflection, icon slot
 * projection, and the click-interception matrix from the I/O table.
 *
 * happy-dom runs no layout engine: the width-freeze test measures
 * `offsetWidth` (identical across the loading flip) AND pins the structural
 * invariants that actually guarantee the freeze — the label node is never
 * removed, replaced, or taken out of flow (opacity 0 keeps it in the
 * accessibility tree AND occupying space).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkButton): Promise<unknown> => el.updateComplete;

const mount = async (attributes: Record<string, string> = {}): Promise<TkButton> => {
  const el = new TkButton();
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
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
    const el = await mount();
    const button = innerButton(el);
    expect(button.type).toBe('button');
  });

  it('applies the default variant and size as reflected host attributes', async () => {
    const el = await mount();
    await elementUpdated(el);
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('card');
    expect(el.getAttribute('variant')).toBe('primary');
    expect(el.getAttribute('size')).toBe('card');
  });

  it('reflects every boolean/enum prop as an attribute (CONVENTIONS §2)', async () => {
    const el = await mount();
    el.variant = 'secondary';
    el.size = 'compact';
    el.loading = true;
    el.disabled = true;
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('secondary');
    expect(el.getAttribute('size')).toBe('compact');
    expect(el.hasAttribute('loading')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    // Value props never reflect — Button has none; the inverse direction
    // (attribute drives the property) is the standard Lit attribute path:
    el.setAttribute('variant', 'inverse');
    await elementUpdated(el);
    expect(el.variant).toBe('inverse');
  });

  it('freezes width while loading and keeps the label for screen readers', async () => {
    const el = await mount();
    el.textContent = 'Continue';
    await elementUpdated(el);
    const labelBefore = label(el);
    const widthBefore = el.offsetWidth;
    // The loading flip must neither remove nor replace the label node.
    const labelNodeBefore = label(el);

    el.loading = true;
    await elementUpdated(el);

    expect(el.offsetWidth, 'offsetWidth unchanged across the loading flip').toBe(widthBefore);
    const labelAfter = label(el);
    expect(labelAfter).toBe(labelNodeBefore);
    expect(el.shadowRoot?.contains(labelBefore)).toBe(true);
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

  it('clears aria-busy when loading ends', async () => {
    const el = await mount({ loading: '' });
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-busy')).toBe('true');
    el.loading = false;
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-busy')).toBe('false');
  });

  it('announces disabled via aria-disabled and blocks activation', async () => {
    const el = await mount();
    let activated = false;
    el.addEventListener('click', () => {
      activated = true;
    });
    await elementUpdated(el);

    el.disabled = true;
    await elementUpdated(el);
    expect(innerButton(el).getAttribute('aria-disabled')).toBe('true');

    // Native .click() models a keyboard Enter activation on the focused
    // button — it must not escape the shadow root (pointer events are
    // additionally none via the host-level CSS rule).
    innerButton(el).click();
    expect(activated, 'no click event escapes a disabled tk-button').toBe(false);
  });

  it('blocks activation while loading but not at rest (I/O matrix)', async () => {
    const el = await mount();
    let activations = 0;
    el.addEventListener('click', () => {
      activations += 1;
    });
    await elementUpdated(el);

    el.loading = true;
    await elementUpdated(el);
    // A composed, bubbling, cancelable click — the exact shape a native
    // activation produces. Lit's handler intercepts it inside the shadow
    // root; the event object retains defaultPrevented after dispatch.
    const loadingClick = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const notHandled = innerButton(el).dispatchEvent(loadingClick);
    expect(activations, 'loading click does not activate').toBe(0);
    expect(loadingClick.defaultPrevented, 'the intercepted click is defaultPrevented').toBe(true);
    expect(notHandled, 'dispatchEvent reports the prevented default').toBe(false);

    el.loading = false;
    await elementUpdated(el);
    const restClick = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    innerButton(el).dispatchEvent(restClick);
    expect(activations, 'click activates at rest').toBe(1);
    expect(restClick.defaultPrevented).toBe(false);
  });

  it('records the precedence: disabled wins semantics, the spinner may still render', async () => {
    const el = await mount({ loading: '', disabled: '' });
    await elementUpdated(el);
    const button = innerButton(el);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('.button__spinner')).not.toBeNull();
    // Activation stays blocked (disabled precedence).
    let activated = false;
    el.addEventListener('click', () => {
      activated = true;
    });
    innerButton(el).click();
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
});
