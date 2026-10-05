// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';

import { TkSwitch } from './switch.js';

/**
 * tk-switch unit tests (spec 26.2): the APG switch surface (native checkbox
 * + role=switch, the ONE Enter gap closed by the keydown guard), the frozen
 * §4 state pair (strict controlled / uncontrolled seeded + release), the
 * checked-change channel (§3 payload, silent on the first render), the
 * disabled commit guard, label slot-vs-prop precedence, and the structural
 * CSS pins (hook layer, hit-area floor, motion + reduced-motion guard).
 *
 * Form participation is env-split (the tk-checkbox matrix mold): happy-dom
 * ships no ElementInternals, so the wiring pins here cover the feature-guard
 * path; the LIVE FormData row (name=value when checked, "on" default) is
 * proven in tests/visual/switch.spec.ts (chromium).
 *
 * Native-guaranteed behavior (Space activation, label-click forwarding) is
 * not re-pinned in happy-dom — the real paths ride the chromium legs; the
 * wiring AROUND the native surface (commit pipeline, revert, emit) is what
 * these units pin.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkSwitch): Promise<unknown> => el.updateComplete;

type MountProps = Partial<TkSwitch> & Record<string, unknown>;

const mount = async (props: MountProps = {}): Promise<TkSwitch> => {
  const el = new TkSwitch();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const inputOf = (el: TkSwitch): HTMLInputElement => {
  const input = el.shadowRoot?.querySelector<HTMLInputElement>('input.control__input');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
};

/** Simulates the native surface activating (what Space/Enter/label-click do). */
const nativeToggle = async (el: TkSwitch): Promise<void> => {
  const input = inputOf(el);
  input.checked = !input.checked;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await elementUpdated(el);
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3). */
const sheetCss = (): string =>
  TkSwitch.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-switch', () => {
  it('registers as tk-switch exposing TkSwitch', async () => {
    await customElements.whenDefined('tk-switch');
    expect(customElements.get('tk-switch')).toBe(TkSwitch);
  });

  it('renders the native checkbox with role=switch as the semantic surface over the painted capsule', async () => {
    const el = await mount();
    const input = inputOf(el);
    expect(input.type).toBe('checkbox');
    // The APG Switch Pattern: role=switch over the checkbox base — announced
    // semantics flip to switch/on/off while the state rides native checked.
    expect(input.getAttribute('role')).toBe('switch');
    // aria-checked is IMPLIED by the native state — never hand-set (cannot drift).
    expect(input.getAttribute('aria-checked')).toBeNull();
    // The painted layer is decorative — semantics live on the input.
    expect(el.shadowRoot?.querySelector('.track')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.shadowRoot?.querySelector('.track .knob')).not.toBeNull();
  });

  it('wraps control and text in one native label — label-click toggles for free', async () => {
    const el = await mount({ label: 'Push-уведомления' });
    const label = el.shadowRoot?.querySelector('label.root');
    expect(label).not.toBeNull();
    // The input lives INSIDE the label (the tk-checkbox naming mechanism).
    expect(label?.querySelector('input.control__input')).not.toBeNull();
    // The visible text sits in the same label — it names the input.
    expect(label?.textContent).toContain('Push-уведомления');
  });

  it('seeds uncontrolled from default-checked and commits through the native change events', async () => {
    const el = await mount({ defaultChecked: true });
    expect(inputOf(el).checked).toBe(true);

    const heard: boolean[] = [];
    el.addEventListener('checked-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    await nativeToggle(el);
    expect(heard).toEqual([false]);
    expect(inputOf(el).checked).toBe(false);
    expect(el.checked).toBeUndefined();
  });

  it('is silent on the first render — checked-change never fires during the initial upgrade', async () => {
    const el = new TkSwitch();
    const heard = vi.fn();
    el.addEventListener('checked-change', heard);
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(heard).not.toHaveBeenCalled();
  });

  it('strict-controlled: emits and applies NOTHING locally; the native box stays live until the consumer answers (§4)', async () => {
    const el = await mount({ checked: false });
    expect(inputOf(el).checked).toBe(false);

    const heard: boolean[] = [];
    el.addEventListener('checked-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    await nativeToggle(el);
    // Emitted with the unwrapped new state…
    expect(heard).toEqual([true]);
    // …the prop untouched…
    expect(el.checked).toBe(false);
    // …and the native surface keeps its live flip (caret-sanity mirror)
    // until the consumer's answer drives the next update.
    expect(inputOf(el).checked).toBe(true);

    // The consumer answers — the element renders exactly the answer.
    el.checked = true;
    await elementUpdated(el);
    expect(inputOf(el).checked).toBe(true);
    // Strict revert: the answer goes back to false — the track follows.
    el.checked = false;
    await elementUpdated(el);
    expect(inputOf(el).checked).toBe(false);
  });

  it('releases to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ checked: true });
    el.checked = undefined;
    await elementUpdated(el);
    expect(inputOf(el).checked).toBe(true);
    await nativeToggle(el);
    expect(el.checked).toBeUndefined();
    expect(inputOf(el).checked).toBe(false);
  });

  it('Enter activates through the keydown guard (the native gap); other keys pass through untouched', async () => {
    const el = await mount({ defaultChecked: false });
    const heard: boolean[] = [];
    el.addEventListener('checked-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    const input = inputOf(el);

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(enter);
    await elementUpdated(el);
    expect(enter.defaultPrevented).toBe(true);
    expect(input.checked).toBe(true);
    expect(heard).toEqual([true]);

    // A non-Enter key passes through untouched (Space stays native).
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    input.dispatchEvent(space);
    expect(space.defaultPrevented).toBe(false);
  });

  it('disabled guards the commit: native flips are reverted, nothing emits (kept focusable)', async () => {
    const el = await mount({ defaultChecked: true, disabled: true });
    const input = inputOf(el);
    expect(input.getAttribute('aria-disabled')).toBe('true');

    const heard = vi.fn();
    el.addEventListener('checked-change', heard);
    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await elementUpdated(el);
    expect(heard).not.toHaveBeenCalled();
    expect(input.checked).toBe(true);
  });

  it('label slot content wins over the label prop; neither leaves a bare switch named', async () => {
    const el = await mount({ label: 'Уведомления' });
    expect(el.shadowRoot?.querySelector('.text')?.textContent?.trim()).toBe('Уведомления');

    const slotted = document.createElement('span');
    slotted.textContent = 'Email-отчёты';
    el.appendChild(slotted);
    // slotchange arrives async (the checkbox-test mold): settle the tick
    // before awaiting the re-render it schedules.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    // Projection (the checkbox-test mold): the node IS assigned to the
    // default slot and the label PROP text is removed from the shadow cell.
    const labelSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(
      labelSlot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join(''),
    ).toContain('Email-отчёты');
    expect(el.shadowRoot?.querySelector('.text')?.textContent).not.toContain('Уведомления');

    slotted.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.text')?.textContent).toContain('Уведомления');
  });

  it('forwards the host aria-label to the native input for a bare switch', async () => {
    const bare = new TkSwitch();
    bare.setAttribute('aria-label', 'Тёмная тема');
    document.body.appendChild(bare);
    await elementUpdated(bare);
    const input = inputOf(bare);
    expect(input.getAttribute('aria-label')).toBe('Тёмная тема');
    // No label content — the visible text cell is empty, nothing double-names.
    expect(bare.shadowRoot?.querySelector('.text')?.textContent?.trim()).toBe('');
  });

  it('clamps non-boolean checked values set via JS before they enter the channel', async () => {
    const el = await mount({ checked: 'yes' as unknown as boolean });
    await elementUpdated(el);
    expect(el.checked).toBe(true);
    expect(inputOf(el).checked).toBe(true);
  });

  it('dispatches the kit event with composed+bubbles (§3) and the unwrapped boolean payload', async () => {
    const el = await mount({ defaultChecked: false });
    let seen: CustomEvent<{ value: boolean }> | undefined;
    el.addEventListener('checked-change', (event: Event) => {
      seen = event as CustomEvent<{ value: boolean }>;
    });
    await nativeToggle(el);
    expect(seen?.composed).toBe(true);
    expect(seen?.bubbles).toBe(true);
    expect(seen?.detail).toEqual({ value: true });
  });

  it('ships the ruled surfaces: hook layer with token defaults, hit-area floor, motion + reduced-motion guard, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6) — the five spec-ruled hooks, kit-register
    // defaults (AC4 ruling).
    expect(css).toContain('var(--tk-switch-width, 36px)');
    expect(css).toContain('var(--tk-switch-height, 20px)');
    expect(css).toContain('var(--tk-switch-knob, 16px)');
    expect(css).toContain('var(--tk-switch-track-on, var(--tk-color-yellow-100))');
    expect(css).toContain('var(--tk-switch-track-off, var(--tk-color-border-default))');
    // The full-radius pill track (the progress-bar/slider track family).
    expect(css).toContain('border-radius: var(--tk-radius-full)');
    // The knob rides INSIDE the track — the w−h travel keeps hook overrides
    // geometrically consistent.
    expect(css).toContain('translateX(calc(var(--tk-switch-width, 36px) - var(--tk-switch-height, 20px)))');
    // The §8 target floor: the label padding lifts the 20px capsule.
    expect(css).toContain('min-height: 44px');
    expect(css).toContain('padding: var(--tk-space-12)');
    // The unified ring on the visible track via the sibling bridge.
    expect(css).toContain('.control__input:focus-visible + .track');
    expect(css).toContain('outline: 2px solid var(--tk-color-focus-ring)');
    // Disabled mold (checkbox): 40% opacity, no pointer events.
    expect(css).toContain('opacity: 0.4');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // Motion IS the switch register (unlike the FLAT slider), but the
    // reduced-motion guard snaps it off (the skeleton mold).
    expect(css).toContain('transition: transform var(--tk-motion-duration-fast)');
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});
