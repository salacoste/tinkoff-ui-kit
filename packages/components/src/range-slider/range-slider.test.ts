// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';

import { TkRangeSlider } from './range-slider.js';

/**
 * tk-range-slider unit tests (spec 26.1): the frozen §4 state pair (strict
 * controlled / uncontrolled seeded + release), the step-grid display clamp
 * (prop never mutated), the value-change channel (§3 payload, silent on the
 * first render), the PageUp/PageDown guard (the one native gap), the
 * formatter readout + aria-valuetext, degenerate ranges, and the structural
 * CSS pins (hook layer, hidden guard, FLAT — no position animation on a
 * direct-manipulation control).
 *
 * Native-guaranteed behavior (arrow/Home/End stepping, pointer drag, the
 * implicit slider role's aria-valuemin/max/now) is NOT re-pinned here —
 * happy-dom synthesizes neither native key defaults nor layout; the wiring
 * AROUND the native surface (commit pipeline, revert, emit) is what these
 * units pin, and the real-keyboard path rides the chromium legs
 * (tests/visual) + the ATU storybook probe.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkRangeSlider): Promise<unknown> => el.updateComplete;

type MountProps = Partial<TkRangeSlider> & Record<string, unknown>;

const mount = async (props: MountProps = {}): Promise<TkRangeSlider> => {
  const el = new TkRangeSlider();
  Object.assign(el, props);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

const inputOf = (el: TkRangeSlider): HTMLInputElement => {
  const input = el.shadowRoot?.querySelector<HTMLInputElement>('input.control__input');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
};

/** Simulates the native surface reporting a new value (what drag/arrows do). */
const nativeReports = async (el: TkRangeSlider, value: string): Promise<void> => {
  const input = inputOf(el);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await elementUpdated(el);
};

/** cssText of the adopted sheets with comments stripped (pin-trap AD-3). */
const sheetCss = (): string =>
  TkRangeSlider.styles
    .map((style) => (style as { cssText?: string }).cssText ?? '')
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

describe('tk-range-slider', () => {
  it('registers as tk-range-slider exposing TkRangeSlider', async () => {
    await customElements.whenDefined('tk-range-slider');
    expect(customElements.get('tk-range-slider')).toBe(TkRangeSlider);
  });

  it('renders the native range input as the semantic surface over the painted visual', async () => {
    const el = await mount();
    const input = inputOf(el);
    expect(input.type).toBe('range');
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
    expect(input.getAttribute('step')).toBe('1');
    // The painted layer is decorative — semantics live on the input.
    expect(el.shadowRoot?.querySelector('.visual')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.shadowRoot?.querySelector('.visual .thumb')).not.toBeNull();
  });

  it('names the input through the header labelledby chain; a bare slider takes the forwarded aria-label', async () => {
    const named = await mount({ label: 'Сумма перевода' });
    const input = inputOf(named);
    const labelledBy = input.getAttribute('aria-labelledby');
    expect(labelledBy).not.toBeNull();
    const [labelId, valueId] = (labelledBy ?? '').split(' ');
    // Both chain targets exist and are the visible header cells (the tk-input
    // mold: label first, formatted value second — the announcement order).
    expect(named.shadowRoot?.getElementById(labelId)?.classList.contains('header__label')).toBe(true);
    expect(named.shadowRoot?.getElementById(valueId)?.classList.contains('header__value')).toBe(true);
    // A visible header owns the name — no aria-label rides along.
    expect(input.getAttribute('aria-label')).toBeNull();

    // Bare (header hidden): the host aria-label forwards to the input.
    const bare = new TkRangeSlider();
    bare.setAttribute('aria-label', 'Громкость уведомлений');
    document.body.appendChild(bare);
    await elementUpdated(bare);
    const bareInput = inputOf(bare);
    expect(bareInput.getAttribute('aria-label')).toBe('Громкость уведомлений');
    expect(bareInput.getAttribute('aria-labelledby')).toBeNull();
  });

  it('seeds uncontrolled from default-value and commits through the native input events', async () => {
    const el = await mount({ defaultValue: 30 });
    expect(inputOf(el).value).toBe('30');
    expect(el.shadowRoot?.querySelector('.fill')?.getAttribute('style')).toContain('width: 30%');

    const heard: number[] = [];
    el.addEventListener('value-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: number }>).detail.value);
    });
    await nativeReports(el, '70');
    expect(heard).toEqual([70]);
    expect(el.shadowRoot?.querySelector('.fill')?.getAttribute('style')).toContain('width: 70%');
    expect(el.value).toBeUndefined();
  });

  it('is silent on the first render — value-change never fires during the initial upgrade', async () => {
    const el = new TkRangeSlider();
    const heard = vi.fn();
    el.addEventListener('value-change', heard);
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(heard).not.toHaveBeenCalled();
  });

  it('strict-controlled: emits and applies NOTHING locally; the native thumb stays live until the consumer answers (§4)', async () => {
    const el = await mount({ value: 20 });
    expect(inputOf(el).value).toBe('20');

    const heard: number[] = [];
    el.addEventListener('value-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: number }>).detail.value);
    });
    await nativeReports(el, '40');
    // Emitted with the unwrapped value…
    expect(heard).toEqual([40]);
    // …the prop untouched…
    expect(el.value).toBe(20);
    // …and the native surface keeps its live position (caret-sanity mirror)
    // until the consumer's answer drives the next update.
    expect(inputOf(el).value).toBe('40');

    // The consumer answers — the element renders exactly the answer.
    el.value = 40;
    await elementUpdated(el);
    expect(inputOf(el).value).toBe('40');
    // Strict revert: the answer goes back to 20 — the thumb follows.
    el.value = 20;
    await elementUpdated(el);
    expect(inputOf(el).value).toBe('20');
  });

  it('releases to uncontrolled seeded from the last controlled value', async () => {
    const el = await mount({ value: 35 });
    el.value = undefined;
    await elementUpdated(el);
    expect(inputOf(el).value).toBe('35');
    await nativeReports(el, '60');
    expect(el.value).toBeUndefined();
    expect(el.shadowRoot?.querySelector('.fill')?.getAttribute('style')).toContain('width: 60%');
  });

  it('snaps the DISPLAY to the step grid without mutating the value prop (value 7 on a 0–10/step-5 grid renders 5)', async () => {
    const el = await mount({ min: 0, max: 10, step: 5, value: 7 });
    expect(inputOf(el).value).toBe('5');
    expect(el.shadowRoot?.querySelector('.fill')?.getAttribute('style')).toContain('width: 50%');
    // The documented rule: ties toward +∞ — 8 rounds UP to 10.
    el.value = 8;
    await elementUpdated(el);
    expect(inputOf(el).value).toBe('10');
    // The prop keeps the raw consumer number throughout.
    expect(el.value).toBe(8);
  });

  it('reads a non-finite or non-positive step as the native 1 default', async () => {
    const el = await mount({ step: 0, value: 7 });
    expect(inputOf(el).getAttribute('step')).toBe('1');
    expect(inputOf(el).value).toBe('7');
  });

  it('PageUp/PageDown jump ±10 steps through the keydown guard; other keys pass through native', async () => {
    const el = await mount({ min: 0, max: 100, step: 5, defaultValue: 0 });
    const heard: number[] = [];
    el.addEventListener('value-change', (event: Event) => {
      heard.push((event as CustomEvent<{ value: number }>).detail.value);
    });
    const input = inputOf(el);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true, cancelable: true }));
    await elementUpdated(el);
    expect(input.value).toBe('50');
    expect(heard).toEqual([50]);

    // Two PageDowns from 50 → 0 (clamped at min, never negative).
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true }));
    await elementUpdated(el);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true }));
    await elementUpdated(el);
    expect(input.value).toBe('0');
    expect(heard).toEqual([50, 0, 0]);

    // A non-Page key passes through untouched (native owns arrows/Home/End).
    const pass = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    input.dispatchEvent(pass);
    await elementUpdated(el);
    expect(pass.defaultPrevented).toBe(false);
    // Native default did not run in happy-dom — no double-commit either.
    expect(heard).toEqual([50, 0, 0]);
  });

  it('collapses a degenerate range (min ≥ max) to the endpoint with nothing to traverse', async () => {
    const el = await mount({ min: 10, max: 0, defaultValue: 4 });
    expect(inputOf(el).getAttribute('min')).toBe('10');
    expect(inputOf(el).getAttribute('max')).toBe('10');
    expect(inputOf(el).value).toBe('10');
    expect(el.shadowRoot?.querySelector('.fill')?.getAttribute('style')).toContain('width: 0%');
  });

  it('formats the readout and aria-valuetext through valueFormatter; the value slot overrides the readout cell', async () => {
    const el = await mount({
      defaultValue: 45,
      label: 'Сумма вклада',
      valueFormatter: (v: number) => `${v} 000 ₽`,
    });
    const input = inputOf(el);
    expect(input.getAttribute('aria-valuetext')).toBe('45 000 ₽');
    expect(el.shadowRoot?.querySelector('.header__value')?.textContent?.trim()).toBe('45 000 ₽');

    const custom = document.createElement('span');
    custom.slot = 'value';
    custom.textContent = 'любой текст консьюмера';
    el.appendChild(custom);
    // slotchange arrives async (the checkbox-test mold): settle the tick
    // before awaiting the re-render it schedules.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    // The slot wins the VISIBLE cell (projection: the node IS assigned to
    // the value slot, and the formatter readout is REMOVED from the shadow
    // cell — no double rendering); aria-valuetext still carries the
    // formatted value (the AT channel is not slottable by design).
    const valueSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="value"]');
    expect(valueSlot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join('')).toContain('любой текст консьюмера');
    expect(el.shadowRoot?.querySelector('.header__value')?.textContent).not.toContain('45 000 ₽');
    expect(input.getAttribute('aria-valuetext')).toBe('45 000 ₽');

    custom.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.header__value')?.textContent).toContain('45 000 ₽');
  });

  it('carries no aria-valuetext without a formatter (the native number announcement serves)', async () => {
    const el = await mount({ defaultValue: 45 });
    expect(inputOf(el).getAttribute('aria-valuetext')).toBeNull();
  });

  it('label slot content wins over the label prop; the header hides entirely without label/value content', async () => {
    const el = await mount({ label: 'Сумма' });
    expect(el.shadowRoot?.querySelector('.header')?.hasAttribute('hidden')).toBe(false);
    expect(el.shadowRoot?.querySelector('.header__label')?.textContent?.trim()).toBe('Сумма');

    const slotted = document.createElement('span');
    slotted.textContent = 'Срок вклада';
    el.appendChild(slotted);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    // Projection (the checkbox-test mold): the node IS assigned to the
    // default slot and the label PROP text is removed from the shadow cell.
    const labelSlot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(labelSlot?.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '').join('')).toContain('Срок вклада');
    expect(el.shadowRoot?.querySelector('.header__label')?.textContent).not.toContain('Сумма');

    slotted.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.header__label')?.textContent).toContain('Сумма');

    const bare = await mount();
    expect(bare.shadowRoot?.querySelector('.header')?.hasAttribute('hidden')).toBe(true);
  });

  it('disabled guards the commit: native reports are reverted, nothing emits (kept focusable)', async () => {
    const el = await mount({ defaultValue: 25, disabled: true });
    const input = inputOf(el);
    expect(input.getAttribute('aria-disabled')).toBe('true');

    const heard = vi.fn();
    el.addEventListener('value-change', heard);
    input.value = '80';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await elementUpdated(el);
    expect(heard).not.toHaveBeenCalled();
    expect(input.value).toBe('25');
  });

  it('ships the ruled surfaces: hook layer with token defaults, native-overlay row, hidden guard (structural)', () => {
    const css = sheetCss();
    // Hook layer (CONVENTIONS §6) — kit-register geometry (AC4 ruling).
    expect(css).toContain('var(--tk-range-slider-track-height, 4px)');
    expect(css).toContain('var(--tk-range-slider-thumb-size, 20px)');
    expect(css).toContain('var(--tk-range-slider-track-color, var(--tk-color-border-default))');
    expect(css).toContain('var(--tk-range-slider-fill-color, var(--tk-color-yellow-100))');
    expect(css).toContain('var(--tk-range-slider-thumb-color, var(--tk-color-yellow-100))');
    expect(css).toContain('var(--tk-range-slider-thumb-ring, var(--tk-color-ink-300))');
    // The progress-bar track mold: full pill radius.
    expect(css).toContain('border-radius: var(--tk-radius-full)');
    // The §8 target floor carries the touch area.
    expect(css).toContain('height: 44px');
    // The unified ring on the visible thumb via :has() (the input owns focus).
    expect(css).toContain('.row:has(.control__input:focus-visible) .thumb');
    expect(css).toContain('outline: 2px solid var(--tk-color-focus-ring)');
    // Disabled mold (checkbox): 40% opacity, no pointer events.
    expect(css).toContain('opacity: 0.4');
    // :host display out-ranks the UA [hidden] rule — enforce hidden.
    expect(css).toContain(':host([hidden])');
    // FLAT by design: direct manipulation — no position/color animation.
    expect(css).not.toContain('animation');
    expect(css).not.toContain('transition');
  });

  it('dispatches the kit event with composed+bubbles (§3) and the unwrapped number payload', async () => {
    const el = await mount({ defaultValue: 0 });
    let seen: CustomEvent<{ value: number }> | undefined;
    el.addEventListener('value-change', (event: Event) => {
      seen = event as CustomEvent<{ value: number }>;
    });
    await nativeReports(el, '12');
    expect(seen?.composed).toBe(true);
    expect(seen?.bubbles).toBe(true);
    expect(seen?.detail).toEqual({ value: 12 });
  });
});
