// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkCheckbox } from './checkbox.js';
import { checkboxStyles } from './checkbox.css.js';

/**
 * tk-checkbox unit tests (spec 2.4): the seven I/O matrix rows — Space
 * toggle, label-click toggle, controlled strictness + release seeding
 * (booleans), indeterminate mixed wiring, disabled inertness, form
 * participation (wiring — the FormData entry rides the host's
 * formAssociated/ElementInternals mirror, proven live in
 * tests/visual/checkbox.spec.ts), null label — plus the announce wiring
 * (aria-checked=mixed technique), attribute reflection rules, enum/null
 * clamping guards, and the §4 release/resume transitions.
 *
 * Keyboard split (the tk-input precedent): happy-dom runs no native key
 * activation, so «Space toggles» is pinned STRUCTURALLY — the native
 * checkbox input is the focusable control, the element attaches NO keydown
 * interception (the platform owns Space), and the change pipeline the
 * browser fires after Space is exercised directly. The live walkthrough half
 * lives in the story's keyboard checklist.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkCheckbox): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: Lit dev-mode may warn on attribute misses. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkCheckbox>>;
  attributes?: Record<string, string>;
  labelContent?: string;
};

const mount = async ({ props, attributes, labelContent }: MountOptions = {}): Promise<TkCheckbox> => {
  const el = new TkCheckbox();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (labelContent !== undefined) el.textContent = labelContent;
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const control = (el: TkCheckbox): HTMLInputElement => {
  const input = el.shadowRoot?.querySelector('input');
  expect(input, 'inner native checkbox renders').toBeInstanceOf(HTMLInputElement);
  return input as HTMLInputElement;
};

/**
 * Simulate the browser's post-Space/post-click commit: flip the native
 * checkedness and run the change pipeline (exactly what the UA fires).
 */
const toggle = (el: TkCheckbox, to?: boolean): void => {
  const input = control(el);
  input.checked = to ?? !input.checked;
  input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
};

/** Capture checked-change events (detail shape, composed, bubbles). */
const collectValues = (el: TkCheckbox): boolean[] => {
  const values: boolean[] = [];
  el.addEventListener('checked-change', (event: Event) => {
    const custom = event as CustomEvent<{ value: boolean }>;
    values.push(custom.detail.value);
  });
  return values;
};

describe('tk-checkbox', () => {
  it('registers as tk-checkbox exposing TkCheckbox', async () => {
    await customElements.whenDefined('tk-checkbox');
    expect(customElements.get('tk-checkbox')).toBe(TkCheckbox);
  });

  it('renders a native checkbox input inside a wrapping <label> (click + naming surface)', async () => {
    const el = await mount({ props: { label: 'Соглашаюсь' } });
    const input = control(el);
    expect(input.type).toBe('checkbox');
    const label = el.shadowRoot?.querySelector('label');
    expect(label, 'the label wraps the control').not.toBeNull();
    expect(label?.contains(input)).toBe(true);
    // The label text node carries the prop text via the slot fallback.
    expect(label?.textContent).toContain('Соглашаюсь');
    // The visual box is a decorative sibling of the input.
    expect(el.shadowRoot?.querySelector('.box')?.getAttribute('aria-hidden')).toBe('true');
  });

  // --- Matrix row 1: Space toggle ------------------------------------------

  it('Space path: the native input is the focusable control and NO keydown interception exists (the platform owns Space)', async () => {
    const el = await mount({ props: { label: 'Согласен' } });
    const input = control(el);
    // Space reaches the native checkbox unmodified: no listener cancels it
    // (a cancelable keydown that stays uncancelled = the platform's to act on).
    const keydown = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    input.dispatchEvent(keydown);
    expect(keydown.defaultPrevented).toBe(false);
    expect(el.getAttribute('tabindex')).toBeNull();
    // The change event the UA fires after Space runs the full pipeline:
    const values = collectValues(el);
    toggle(el, true);
    expect(values).toEqual([true]);
    expect(input.checked).toBe(true);
  });

  it('uncontrolled toggle: internal state updates and checked-change emits (composed, bubbles, detail { value: boolean })', async () => {
    const el = await mount({ props: { label: 'Согласен' } });
    const values = collectValues(el);
    // Composed + bubbles: a listener on the PARENT proves the event crosses
    // both the shadow and the host boundary.
    const parentHeard: boolean[] = [];
    el.parentElement?.addEventListener('checked-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: boolean }>;
      parentHeard.push(custom.detail.value);
      expect(custom.composed).toBe(true);
    });

    toggle(el, true);
    toggle(el, false);

    expect(values).toEqual([true, false]);
    expect(parentHeard).toEqual([true, false]);
    // Uncontrolled: the property channel stays free — the state lives
    // inside, surfaced through the event.
    expect(el.checked).toBeUndefined();
    expect(control(el).checked).toBe(false);
  });

  // --- Matrix row 2: label click --------------------------------------------

  it('label click toggles through the native label→input binding (structure pinned, pipeline exercised)', async () => {
    const el = await mount({ props: { label: 'Соглашаюсь получать рекламу' } });
    const input = control(el);
    const label = el.shadowRoot?.querySelector('label');
    // The binding that makes a label click toggle: the input is a DESCENDANT
    // of the label (implicit association — no for/id pair to drift).
    expect(label?.contains(input)).toBe(true);
    // The pipeline the UA runs on the label-activated toggle:
    const values = collectValues(el);
    toggle(el, true);
    expect(values).toEqual([true]);
    expect(input.checked).toBe(true);
  });

  it('slotted label content wins over the label prop (slot fallback precedence)', async () => {
    const el = await mount({ props: { label: 'prop text' }, labelContent: 'slotted text' });
    const slot = el.shadowRoot?.querySelector('slot');
    const slotted = slot?.assignedNodes({ flatten: true }) ?? [];
    // Projection: the slotted nodes ARE assigned to the default slot.
    expect(slotted.map((node) => node.textContent ?? '').join('')).toContain('slotted text');
    expect(slotted.length).toBeGreaterThan(0);
    // While real content is assigned, the prop text is REMOVED from the
    // shadow label (presence rule — no double rendering). Slotted content
    // itself never enters shadow textContent: it stays light DOM.
    const labelText = el.shadowRoot?.querySelector('label')?.textContent ?? '';
    expect(labelText).not.toContain('prop text');
    // The light DOM carries the slotted content.
    expect(el.textContent).toBe('slotted text');
  });

  it('an EMPTY slotted text node does not suppress the label prop (the ${cond ? html : ""} template shape)', async () => {
    const el = await mount({ props: { label: 'prop text' } });
    el.appendChild(document.createTextNode('')); // assigned, but not content
    await elementUpdated(el);
    // Empty assignment ≠ present content: the prop text still renders.
    expect(el.shadowRoot?.querySelector('label')?.textContent).toContain('prop text');
    // Real content arriving later takes over…
    el.appendChild(document.createTextNode('late slotted'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('label')?.textContent).not.toContain('prop text');
    expect(el.textContent).toContain('late slotted');
  });

  // --- Matrix row 3: controlled strictness + release (booleans) --------------

  it('controlled toggle: checked-change emits, nothing mutates locally; the next update re-renders exactly checked', async () => {
    const el = await mount({ props: { checked: false } });
    const values = collectValues(el);

    toggle(el, true);
    expect(values).toEqual([true]);
    // Strict: the channel is untouched by toggling.
    expect(el.checked).toBe(false);
    // Native-feeling: the live box stays flipped UNTIL an update runs…
    expect(control(el).checked).toBe(true);
    // …and any update the element runs reverts it to exactly `checked`
    // (the Design Notes contract — this is what "renders exactly checked" means).
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).checked).toBe(false);
  });

  it('controlled checked updates render immediately (consumer drives the box)', async () => {
    const el = await mount({ props: { checked: false } });
    el.checked = true;
    await elementUpdated(el);
    expect(control(el).checked).toBe(true);
  });

  it('releasing checked switches to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ props: { checked: false } });
    el.checked = true;
    await elementUpdated(el);

    el.checked = undefined; // release
    await elementUpdated(el);
    // Seeded from the LAST controlled value — not the first, not blank.
    expect(control(el).checked).toBe(true);
    expect(el.checked).toBeUndefined();

    const values = collectValues(el);
    toggle(el, false);
    expect(values).toEqual([false]);
    expect(control(el).checked).toBe(false);
  });

  it('a controlled checked set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { checked: false } });
    el.checked = undefined;
    await elementUpdated(el);
    toggle(el, true);
    expect(control(el).checked).toBe(true);

    el.checked = false;
    await elementUpdated(el);
    expect(control(el).checked).toBe(false);
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).checked).toBe(false);
  });

  it('defaultChecked seeds the uncontrolled state at connect', async () => {
    const el = await mount({ attributes: { 'default-checked': '' } });
    expect(control(el).checked).toBe(true);
    const values = collectValues(el);
    toggle(el, false);
    expect(values).toEqual([false]);
  });

  it('defaultChecked mutated after connect is ignored (initial-value semantics)', async () => {
    const el = await mount({ attributes: { 'default-checked': '' } });
    toggle(el, false);

    el.defaultChecked = true;
    await elementUpdated(el);
    // The internal state continues from the toggle — the late mutation
    // never re-seeds.
    expect(control(el).checked).toBe(false);
  });

  it('checked wins over defaultChecked when both are set (controlled at first paint)', async () => {
    const el = await mount({ props: { checked: false }, attributes: { 'default-checked': '' } });
    expect(control(el).checked).toBe(false);
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).checked).toBe(false);
  });

  // --- Matrix row 4: indeterminate (mixed) ------------------------------------

  it('indeterminate: mixed visual wiring + aria-checked="mixed" on the native input; never enters the value channel', async () => {
    const el = await mount({ props: { indeterminate: true } });
    const input = control(el);
    // The APG fix for unannounced native indeterminate: the explicit state.
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    // The native indeterminate channel feeds the :indeterminate visual.
    expect(input.indeterminate).toBe(true);
    // The prop reflects (a styling/state hook, CONVENTIONS §2).
    expect(el.hasAttribute('indeterminate')).toBe(true);
  });

  it('aria-checked stays native (absent) when not indeterminate — checked/unchecked announce natively', async () => {
    const el = await mount({ props: { checked: true } });
    expect(control(el).getAttribute('aria-checked')).toBeNull();
    el.checked = false;
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-checked')).toBeNull();
  });

  it('checked wins over indeterminate for both the announcement and the visual', async () => {
    const el = await mount({ props: { checked: true, indeterminate: true } });
    const input = control(el);
    expect(input.getAttribute('aria-checked')).toBeNull();
    // The JS sync clears the mixed channel under checked.
    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(true);
  });

  it('toggling from the mixed state lands on checked=true (APG false→true) and the prop is never auto-cleared', async () => {
    const el = await mount({ props: { indeterminate: true } });
    const values = collectValues(el);
    // The browser clears the NATIVE indeterminate on activation; the element
    // treats that as the plain false→true toggle. The uncontrolled commit
    // requests its own update, so the stale explicit aria-checked clears.
    toggle(el, true);
    await elementUpdated(el);
    expect(values).toEqual([true]);
    expect(control(el).checked).toBe(true);
    // The PROP is consumer-owned — the component never clears it.
    expect(el.indeterminate).toBe(true);
    // While checked, the mixed announcement is suppressed (checked announces)…
    expect(control(el).getAttribute('aria-checked')).toBeNull();
    // …and returning to unchecked restores the mixed wiring on the next sync.
    toggle(el, false);
    await elementUpdated(el);
    expect(control(el).getAttribute('aria-checked')).toBe('mixed');
    expect(control(el).indeterminate).toBe(true);
    expect(values).toEqual([true, false]);
  });

  it('a browser-side native indeterminate clear is restored on the next element update while the prop holds', async () => {
    const el = await mount({ props: { indeterminate: true } });
    const input = control(el);
    input.indeterminate = false; // what the UA does on activation
    toggle(el, true); // user toggle WITHOUT the element seeing a prop change
    await elementUpdated(el);
    // Prop still true, but checked is now true internally → sync clears mixed.
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(false);
    // Back to unchecked: the sync re-arms the mixed channel from the prop.
    toggle(el, false);
    await elementUpdated(el);
    expect(input.indeterminate).toBe(true);
  });

  it('controlled mixed window: a Space drops the stale mixed override so the announcement follows the checked visuals (review regression)', async () => {
    // A lagging consumer holds checked=false + indeterminate: the rendered
    // input carries the explicit aria-checked="mixed".
    const el = await mount({ props: { checked: false, indeterminate: true } });
    const input = control(el);
    expect(input.getAttribute('aria-checked')).toBe('mixed');

    const values = collectValues(el);
    toggle(el, true); // Space: native flips (and the UA clears indeterminate)
    expect(values).toEqual([true]);
    // Strict: the channel keeps the consumer value; the native box stays
    // flipped (checked VISUALS)…
    expect(el.checked).toBe(false);
    expect(input.checked).toBe(true);
    // …so the explicit mixed override is DROPPED against the live state —
    // the native checked=true announces, matching what is on screen.
    expect(input.getAttribute('aria-checked')).toBeNull();

    // The consumer answers checked=true → render keeps it absent.
    el.checked = true;
    await elementUpdated(el);
    expect(input.getAttribute('aria-checked')).toBeNull();

    // The consumer REJECTS (checked stays false → re-rendered): the native
    // box reverts and the mixed announcement returns with it.
    el.checked = false;
    await elementUpdated(el);
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
  });

  // --- Matrix row 5: disabled ---------------------------------------------------

  it('disabled: aria-disabled, toggle inert by any means, nothing emits', async () => {
    const el = await mount({ props: { disabled: true } });
    const input = control(el);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(el.hasAttribute('disabled')).toBe(true);

    const values = collectValues(el);
    // Keyboard path: aria-disabled keeps the input focusable, Space flips the
    // native box — the guard reverts it and nothing emits.
    toggle(el, true);
    expect(values).toEqual([]);
    expect(input.checked).toBe(false);
    // State channels untouched.
    el.requestUpdate();
    await elementUpdated(el);
    expect(control(el).checked).toBe(false);
  });

  it('disabled + indeterminate + Space: the mixed VISUAL survives the inert activation (review regression)', async () => {
    const el = await mount({ props: { disabled: true, indeterminate: true } });
    const input = control(el);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    expect(input.indeterminate).toBe(true);

    const values = collectValues(el);
    // UA activation clears the NATIVE indeterminate (and flips checked) —
    // the guard must restore BOTH channels, or the dash visual drops while
    // the stale aria-checked="mixed" attribute keeps announcing mixed.
    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(values).toEqual([]);
    expect(input.checked).toBe(false);
    expect(input.indeterminate, 'mixed channel restored with the checked revert').toBe(true);
    expect(input.getAttribute('aria-checked')).toBe('mixed');
  });

  // --- Matrix row 6: form participation -------------------------------------------
  //
  // ENV SPLIT (probed 2026-09-22, BOTH spec assumptions corrected — see the
  // Spec Change Log): (1) happy-dom's FormData(form)/form.elements do NOT
  // enumerate controls inside SHADOW ROOTS and it ships no ElementInternals;
  // (2) Chromium does NOT submit the shadow input either — the form-owner
  // walk stops at the shadow root (live probe: form.elements === 0 with the
  // input checked). The working mechanism is the host's formAssociated +
  // ElementInternals mirror (setFormValue in checkbox.ts), feature-guarded
  // to a no-op here. The row's live proof therefore lives in
  // tests/visual/checkbox.spec.ts (chromium, real label-click pipeline) —
  // the same structural/functional split tk-input used for focus-theft.
  // Here the WIRING is pinned: the native control carries the host's
  // name/value pass-through inside the form's composed tree.

  it('form wiring: the native listed control sits in the form\'s composed tree with name/value/checkedness', async () => {
    const form = document.createElement('form');
    document.body.appendChild(form);
    const el = new TkCheckbox();
    el.setAttribute('name', 'consent');
    el.setAttribute('value', 'granted');
    form.appendChild(el);
    await elementUpdated(el);

    const input = control(el);
    // The pass-through lands on the native control: name and value for
    // direct-DOM consumers; checkedness is the interaction surface (the
    // SUBMISSION entry itself rides the host's ElementInternals mirror —
    // this env cannot execute it; see the env-split note above).
    expect(input.getAttribute('name')).toBe('consent');
    expect(input.getAttribute('value')).toBe('granted');
    expect(input.checked).toBe(false);
    // The host's reflected name is what the ElementInternals entry is keyed
    // by in real engines.
    expect(el.getAttribute('name')).toBe('consent');

    toggle(el, true);
    expect(input.checked).toBe(true);
    // The composed tree holds the control: the listed input lives in the
    // HOST's shadow tree, and the host sits inside the form's tree
    // (Node.contains itself never crosses shadow borders, so the chain is
    // asserted link by link).
    expect(input.getRootNode()).toBe(el.shadowRoot);
    expect((input.getRootNode() as ShadowRoot).host).toBe(el);
    expect(form.contains(el)).toBe(true);

    form.remove();
  });

  it('value stays unset on the control when the prop is unset (native "on" default applies at submission time)', async () => {
    const el = await mount({ props: { name: 'agree' } });
    const input = control(el);
    expect(input.getAttribute('name')).toBe('agree');
    expect(input.getAttribute('value')).toBeNull();
    // No value attribute → the browser submits the native default "on"
    // (proven live in tests/visual/checkbox.spec.ts).
  });

  it('passes name and value through to the native input as attributes', async () => {
    const el = await mount({ props: { name: 'consent', value: 'granted' } });
    const input = control(el);
    expect(input.getAttribute('name')).toBe('consent');
    expect(input.getAttribute('value')).toBe('granted');
  });

  // --- Matrix row 7: null label ------------------------------------------------------

  it('null label (React conditional props): renders the slot or a bare box, no crash', async () => {
    const el = await mount({ props: { label: null as unknown as string } });
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('label')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('input')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.text')?.textContent?.trim()).toBe('');
    // A bare box toggles fine.
    const values = collectValues(el);
    toggle(el, true);
    expect(values).toEqual([true]);
  });

  it('ariaLabel forwards to the native input — the bare-box naming path', async () => {
    const el = await mount({ props: { label: '', ariaLabel: 'Согласен' } });
    expect(control(el).getAttribute('aria-label')).toBe('Согласен');
    const plain = await mount({ props: { label: 'Подпись' } });
    expect(control(plain).getAttribute('aria-label')).toBeNull();
  });

  // --- Reflection + clamp guards (CONVENTIONS §2) -----------------------------------

  it('reflects boolean state hooks and never reflects the value channel (CONVENTIONS §2)', async () => {
    const el = await mount();
    el.indeterminate = true;
    el.disabled = true;
    await elementUpdated(el);
    expect(el.hasAttribute('indeterminate')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    el.checked = true;
    el.defaultChecked = true;
    await elementUpdated(el);
    expect(el.hasAttribute('checked')).toBe(false);
    expect(el.hasAttribute('default-checked')).toBe(false);
  });

  it('clamps non-boolean channel inputs to their boolean form (raw non-booleans never stored)', async () => {
    const el = await mount();
    el.checked = 'yes' as unknown as boolean;
    await elementUpdated(el);
    expect(el.checked).toBe(true);
    expect(control(el).checked).toBe(true);

    el.checked = 0 as unknown as boolean;
    await elementUpdated(el);
    expect(el.checked).toBe(false);
    expect(control(el).checked).toBe(false);

    el.indeterminate = 'mixed' as unknown as boolean;
    await elementUpdated(el);
    expect(el.indeterminate).toBe(true);
    expect(control(el).indeterminate).toBe(true);

    // null still releases (seeded from the last controlled value).
    el.checked = null as unknown as boolean;
    await elementUpdated(el);
    expect(el.checked).toBeNull();
    expect(control(el).checked).toBe(false);
  });

  it('ids: no cross-instance aria chains exist to collide (the label association is structural)', async () => {
    const a = await mount({ props: { label: 'A' } });
    const b = await mount({ props: { label: 'B' } });
    const inputA = control(a);
    const inputB = control(b);
    // Implicit label wrapping needs no ids — the two instances cannot cross.
    expect(inputA.closest('label')?.textContent).toContain('A');
    expect(inputB.closest('label')?.textContent).toContain('B');
    expect(inputA.getAttribute('aria-labelledby')).toBeNull();
    expect(inputB.getAttribute('aria-labelledby')).toBeNull();
  });

  // --- error channel (story 10.2 — the tk-input mold, NO internal validation) ---

  it('error set: the message renders as a SIBLING AFTER the label with the full aria wiring', async () => {
    const el = await mount({ props: { label: 'Согласен с условиями', error: 'Подтвердите согласие' } });
    const input = control(el);
    const label = el.shadowRoot?.querySelector('label');
    const error = el.shadowRoot?.querySelector('.error');
    expect(error, 'the error line renders').not.toBeNull();
    expect(error?.textContent).toContain('Подтвердите согласие');
    expect(error?.tagName).toBe('P');
    // SIBLING, never inside: error text joining the label would join the
    // accessible name (the input mold's placement rule).
    expect(label?.contains(error as Node)).toBe(false);
    expect(
      error && label ? error.compareDocumentPosition(label) : 0,
      'the error FOLLOWS the label in document order',
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    // Wiring rides the native input ONLY while a message shows.
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(describedBy).toBe(error?.getAttribute('id'));
    expect(el.shadowRoot?.getElementById(describedBy ?? '')).toBe(error);
    // The icon is decorative — the text carries the content (the input pin).
    expect(el.shadowRoot?.querySelector('.error__icon')?.getAttribute('aria-hidden')).toBe('true');

    // Clearing the prop removes the node AND both aria hooks.
    el.error = undefined;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.error')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('error pins: the line is the tk-input mold verbatim (error-on-field, 16px icon, space-8 top rhythm)', () => {
    const cssText = checkboxStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const error = cssText.match(/^ {2}\.error\s*\{([^}]*)\}/m)?.[1] ?? '';
    expect(error, 'the .error rule exists').not.toBe('');
    expect(error).toMatch(/color:\s*var\(--tk-color-error-on-field\)/);
    expect(error).toMatch(/margin:\s*var\(--tk-space-8\) 0 0/);
    const icon = cssText.match(/^ {2}\.error__icon\s*\{([^}]*)\}/m)?.[1] ?? '';
    expect(icon).toMatch(/width:\s*16px/);
    expect(icon).toMatch(/height:\s*16px/);
  });

  it('error ids are per-instance: two erroring checkboxes never cross their described-by chains', async () => {
    const a = await mount({ props: { error: 'Ошибка A' } });
    const b = await mount({ props: { error: 'Ошибка B' } });
    const describedA = control(a).getAttribute('aria-describedby');
    const describedB = control(b).getAttribute('aria-describedby');
    expect(describedA).not.toBe(describedB);
    expect(a.shadowRoot?.getElementById(describedB ?? '')).toBeNull();
    expect(b.shadowRoot?.getElementById(describedA ?? '')).toBeNull();
  });

  it("error='' / null / undefined all mean no error — no node, no aria hooks, NO id minted anywhere (DOM identity)", async () => {
    for (const error of ['', null, undefined]) {
      const el = await mount({ props: { label: 'Согласен', error: error as string | undefined } });
      await elementUpdated(el);
      expect(el.shadowRoot?.querySelector('.error')).toBeNull();
      expect(control(el).getAttribute('aria-invalid')).toBeNull();
      expect(control(el).getAttribute('aria-describedby')).toBeNull();
      // The uid is lazily minted on FIRST USE: with no message ever shown the
      // shadow tree carries NO id at all — the pre-10.2 shape.
      expect(el.shadowRoot?.querySelectorAll('[id]')).toHaveLength(0);
    }
  });

  it('error + slotted label: the error text never joins the label content (name stays the consumer copy)', async () => {
    const el = await mount({
      props: { error: 'Подтвердите согласие, чтобы продолжить' },
      labelContent: 'Согласен с условиями',
    });
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.textContent).not.toContain('Подтвердите согласие');
    expect(el.shadowRoot?.querySelector('.error')?.textContent).toContain('Подтвердите согласие');
    expect(label?.contains(el.shadowRoot?.querySelector('.error') as Node)).toBe(false);
    // The toggle pipeline is untouched by the error state (no validation
    // exists — checking still works while the message shows).
    const values = collectValues(el);
    toggle(el, true);
    expect(values).toEqual([true]);
  });

  it('the error prop never reflects as a host attribute (CONVENTIONS §2 property-only surface)', async () => {
    const el = await mount({ props: { error: 'Проверьте' } });
    expect(el.hasAttribute('error')).toBe(false);
  });
});
