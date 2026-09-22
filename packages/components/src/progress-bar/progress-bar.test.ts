// @vitest-environment happy-dom
import { afterAll, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';

import { TkProgressBar } from './progress-bar.js';

/**
 * tk-progress-bar unit tests (spec 2.7): the eight I/O matrix rows —
 * determinate render math (width %), clamping both ends (prop untouched),
 * min>max degenerate (0% + no valuenow — the picked treatment), NaN/string
 * value → min, indeterminate (no valuenow, aria-busy), announce (polite
 * narration on settle), empty-state copy slot (the exact trigger), custom
 * min/max fraction — plus the aria-labelledby wiring, the reflection rules
 * (stateless display: booleans reflect, number data never), the stateless
 * no-dispatch contract, and form participation N/A (display only).
 *
 * RENDER-MATH SPLIT: happy-dom runs no layout engine, so width assertions
 * pin the fill's COMPUTED inline width string (the input to layout), the
 * same structural pin tk-button used for its width-freeze; the pixel truth
 * (the 4px track geometry, the swept indeterminate fill) lives in the
 * Playwright visual harness + the probe NOTES.
 *
 * REDUCED-MOTION SPLIT: happy-dom cannot compute shadow-root cascade
 * animations, so the static fallback is pinned structurally here (the
 * stylesheet ships the reduce rule; the indeterminate width comes from CSS,
 * never inline) — the rendered proof is the visual suite, whose pinned env
 * runs reducedMotion: 'reduce' (playwright.config.ts).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkProgressBar): Promise<unknown> => el.updateComplete;

/** Fire the faked rAF settle window (one frame at 16ms). */
const settleAnnouncement = (): void => {
  vi.advanceTimersByTime(16);
};

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
});

afterAll(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.clearAllTimers();
});

type MountOptions = {
  props?: Partial<InstanceType<typeof TkProgressBar>>;
  attributes?: Record<string, string>;
  slotContent?: string;
};

const mount = async ({ props, attributes, slotContent }: MountOptions = {}): Promise<TkProgressBar> => {
  const el = new TkProgressBar();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (slotContent !== undefined) el.innerHTML = slotContent;
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const track = (el: TkProgressBar): HTMLElement => {
  const node = el.shadowRoot?.querySelector('.track');
  expect(node, 'the track renders').toBeInstanceOf(HTMLElement);
  return node as HTMLElement;
};

const fill = (el: TkProgressBar): HTMLElement => {
  const node = el.shadowRoot?.querySelector('.fill');
  expect(node, 'the fill renders').toBeInstanceOf(HTMLElement);
  return node as HTMLElement;
};

describe('tk-progress-bar', () => {
  it('registers as tk-progress-bar exposing TkProgressBar', async () => {
    await customElements.whenDefined('tk-progress-bar');
    expect(customElements.get('tk-progress-bar')).toBe(TkProgressBar);
  });

  // --- Matrix row 1 + row 8: determinate render math ------------------------

  it('determinate default: value 30 renders a 30% fill width with aria-valuenow/min/max wired', async () => {
    const el = await mount({ attributes: { value: '30', label: 'Уже заполнено' } });
    expect(fill(el).style.width).toBe('30%');
    const bar = track(el);
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('30');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-busy')).toBeNull();
  });

  it('custom min/max: (40−20)/(80−20) renders 33% with aria min/max 20/80', async () => {
    const el = await mount({ attributes: { value: '40', min: '20', max: '80', label: 'Прогресс' } });
    expect(fill(el).style.width).toBe('33%');
    const bar = track(el);
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuemin')).toBe('20');
    expect(bar.getAttribute('aria-valuemax')).toBe('80');
  });

  // --- Matrix row 2: clamping (display clamps, prop untouched) ---------------

  it('clamps high values to 100% and leaves the prop untouched', async () => {
    const el = await mount({ props: { value: 150, label: 'П' } });
    expect(fill(el).style.width).toBe('100%');
    expect(track(el).getAttribute('aria-valuenow')).toBe('100');
    // Display clamps — the prop is input, never mutated.
    expect(el.value).toBe(150);
  });

  it('clamps low values to 0% and leaves the prop untouched', async () => {
    const el = await mount({ props: { value: -10, label: 'П' } });
    expect(fill(el).style.width).toBe('0%');
    expect(track(el).getAttribute('aria-valuenow')).toBe('0');
    expect(el.value).toBe(-10);
  });

  // --- Matrix row 3: degenerate range (the picked treatment) ------------------

  it('min > max: renders 0% with NO aria-valuenow/min/max (malformed pair never reaches AT)', async () => {
    const el = await mount({ props: { min: 80, max: 20, value: 50, label: 'П' } });
    expect(fill(el).style.width).toBe('0%');
    const bar = track(el);
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
    expect(bar.getAttribute('aria-valuemin')).toBeNull();
    expect(bar.getAttribute('aria-valuemax')).toBeNull();
  });

  it('min === max is the same degeneration (empty range, 0%, no valuenow)', async () => {
    const el = await mount({ props: { min: 5, max: 5, value: 5, label: 'П' } });
    expect(fill(el).style.width).toBe('0%');
    expect(track(el).getAttribute('aria-valuenow')).toBeNull();
  });

  // --- Matrix row 4: NaN / string values ---------------------------------------

  it('a non-numeric value attribute ("abc") is treated as min (0%)', async () => {
    const el = await mount({ attributes: { value: 'abc', label: 'П' } });
    expect(Number.isNaN(el.value)).toBe(true); // Lit's Number converter produced NaN…
    expect(fill(el).style.width).toBe('0%'); // …the display reads it as min
    expect(track(el).getAttribute('aria-valuenow')).toBe('0');
  });

  it('an absent value reads as min; a NaN property reads as min', async () => {
    const bare = await mount({ attributes: { label: 'П' } });
    expect(bare.value).toBeUndefined();
    expect(fill(bare).style.width).toBe('0%');
    const propPath = await mount({ props: { value: Number.NaN, label: 'П' } });
    expect(fill(propPath).style.width).toBe('0%');
  });

  it('non-finite min/max fall back to their 0/100 defaults display-side', async () => {
    const el = await mount({ props: { min: Number.NaN, max: Number.NaN, value: 50, label: 'П' } });
    const bar = track(el);
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(fill(el).style.width).toBe('50%');
  });

  // --- Matrix row 5: indeterminate ----------------------------------------------

  it('indeterminate: reflected host attribute, aria-busy, NO aria-valuenow, CSS-driven 33% fill', async () => {
    const el = await mount({ props: { indeterminate: true, label: 'Загрузка' } });
    expect(el.hasAttribute('indeterminate')).toBe(true);
    const bar = track(el);
    expect(bar.getAttribute('aria-busy')).toBe('true');
    expect(bar.getAttribute('aria-valuenow')).toBeNull();
    expect(bar.getAttribute('aria-valuemin')).toBeNull();
    expect(bar.getAttribute('aria-valuemax')).toBeNull();
    // The 33% width comes from the stylesheet (the reduced-motion static
    // fallback shape), never from an inline style that could outrank it.
    expect(fill(el).getAttribute('style')).toBeNull();
    expect(fill(el).style.width).toBe('');
  });

  it('the stylesheet ships the reduced-motion static fallback (animation: none under the media query)', () => {
    const sheet = TkProgressBar.styles
      .map((style) => (style as { cssText?: string }).cssText ?? '')
      .join('\n');
    expect(sheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(sheet).toContain('animation: none');
    // The sweep itself consumes the motion token (AD-9), never a raw duration.
    expect(sheet).toContain('var(--tk-motion-duration-slow)');
  });

  it('switching determinate → indeterminate drops valuenow and the inline width', async () => {
    const el = await mount({ props: { value: 60, label: 'П' } });
    expect(track(el).getAttribute('aria-valuenow')).toBe('60');
    el.indeterminate = true;
    await elementUpdated(el);
    expect(track(el).getAttribute('aria-valuenow')).toBeNull();
    expect(track(el).getAttribute('aria-busy')).toBe('true');
    expect(fill(el).getAttribute('style')).toBeNull();
  });

  // --- Matrix row 6: announce (polite narration on settle) ------------------------

  it('renders NO live region by default (narration is opt-in)', async () => {
    const el = await mount({ props: { value: 30, label: 'П' } });
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')).toBeNull();
  });

  it('announce: a visually-hidden polite region narrates the settled value once per change', async () => {
    const el = await mount({ props: { announce: true, value: 30, label: 'П' } });
    const region = el.shadowRoot?.querySelector('.announcement');
    expect(region, 'the live region renders').not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(el.hasAttribute('announce')).toBe(true); // reflected hook

    settleAnnouncement();
    expect(region?.textContent).toBe('Заполнено 30%');

    // A settled change narrates the new value.
    el.value = 60;
    await elementUpdated(el);
    settleAnnouncement();
    expect(region?.textContent).toBe('Заполнено 60%');

    // A no-change render does not re-announce (the last-announced tracker).
    el.requestUpdate();
    await elementUpdated(el);
    settleAnnouncement();
    expect(region?.textContent).toBe('Заполнено 60%');
  });

  it('announce coalesces a burst of updates into ONE narration of the settled value', async () => {
    const el = await mount({ props: { announce: true, value: 30, label: 'П' } });
    settleAnnouncement();
    const region = el.shadowRoot?.querySelector('.announcement');
    expect(region?.textContent).toBe('Заполнено 30%');

    // Three rapid updates inside one settle window: only the latest lands.
    el.value = 45;
    await elementUpdated(el);
    el.value = 70;
    await elementUpdated(el);
    el.value = 95;
    await elementUpdated(el);
    settleAnnouncement();
    expect(region?.textContent).toBe('Заполнено 95%');
  });

  it('indeterminate and degenerate bars never narrate', async () => {
    const el = await mount({ props: { announce: true, value: 30, label: 'П' } });
    settleAnnouncement();
    el.indeterminate = true;
    await elementUpdated(el);
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')).toBeNull(); // region unmounts
  });

  it('a pending settle window dies with the element (no post-unmount narration)', async () => {
    const el = await mount({ props: { announce: true, value: 30, label: 'П' } });
    el.value = 80;
    await elementUpdated(el); // rAF scheduled, NOT yet fired
    el.remove();
    expect(() => settleAnnouncement()).not.toThrow();
    const region = el.shadowRoot?.querySelector('.announcement');
    expect(region?.textContent ?? '').not.toContain('80');
  });

  it('a re-mounted region re-writes the UNCHANGED value (indeterminate round trip — review regression)', async () => {
    // The tracker used to survive the unmount, so the rAF early-returned
    // forever and the fresh region stayed permanently blank.
    const el = await mount({ props: { announce: true, value: 30, label: 'П' } });
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')?.textContent).toBe('Заполнено 30%');

    el.indeterminate = true; // region unmounts
    await elementUpdated(el);
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')).toBeNull();

    el.indeterminate = false; // region re-mounts, value UNCHANGED
    await elementUpdated(el);
    settleAnnouncement();
    const region = el.shadowRoot?.querySelector('.announcement');
    expect(region, 'the region re-mounted').not.toBeNull();
    expect(region?.textContent).toBe('Заполнено 30%');
  });

  it('announce off/on round trip re-populates the region the same way (review regression)', async () => {
    const el = await mount({ props: { announce: true, value: 45, label: 'П' } });
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')?.textContent).toBe('Заполнено 45%');

    el.announce = false; // region unmounts
    await elementUpdated(el);
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')).toBeNull();

    el.announce = true; // region re-mounts, value UNCHANGED
    await elementUpdated(el);
    settleAnnouncement();
    expect(el.shadowRoot?.querySelector('.announcement')?.textContent).toBe('Заполнено 45%');
  });

  // --- Matrix row 7: empty-state copy slot (the exact trigger) ---------------------

  it('zero progress with no label/% content renders the zero-state copy (never blank)', async () => {
    const el = await mount(); // bare: no value, no label, no slots
    const header = el.shadowRoot?.querySelector('.header');
    expect(header, 'the header renders to carry the copy').not.toBeNull();
    expect(header?.textContent).toContain('Ещё ничего не заполнено');
    // The copy names the bar (aria-labelledby SPAN pattern).
    const labelledby = track(el).getAttribute('aria-labelledby');
    expect(labelledby).toContain('-empty');
    expect(header?.querySelector(`[id="${labelledby}"]`)).not.toBeNull();
    expect(fill(el).style.width).toBe('0%');
  });

  it('an absent value or value === min are both zero progress (the same copy)', async () => {
    const explicit = await mount({ props: { value: 0 } });
    expect(explicit.shadowRoot?.querySelector('.header')?.textContent).toContain(
      'Ещё ничего не заполнено',
    );
  });

  it('a label suppresses the copy — the normal header renders instead (label left, N% right)', async () => {
    const el = await mount({ props: { value: 0, label: 'Уже заполнено' } });
    const header = el.shadowRoot?.querySelector('.header');
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
    expect(header?.textContent).toContain('Уже заполнено');
    expect(header?.textContent).toContain('0%');
    const labelledby = track(el).getAttribute('aria-labelledby');
    expect(labelledby).toContain('-label');
  });

  it('slotted % content suppresses the copy (the value slot counts as header content)', async () => {
    const el = await mount({ props: { value: 0 }, slotContent: '<span slot="value">старт</span>' });
    const header = el.shadowRoot?.querySelector('.header');
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
    const valueSlot = header?.querySelector('slot[name="value"]');
    expect(valueSlot?.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
  });

  it('non-zero progress renders the bare bar: header present but hidden, no copy', async () => {
    const el = await mount({ props: { value: 40 } });
    const header = el.shadowRoot?.querySelector('.header');
    expect(header, 'the header stays in the DOM (slots must exist for slotchange)').not.toBeNull();
    expect(header?.hasAttribute('hidden')).toBe(true);
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
    expect(fill(el).style.width).toBe('40%');
  });

  it('the frozen rule is EXACT value === min, not percent rounding to 0 (review regression)', async () => {
    // value 0.4 over 0–100 is real progress: the percent rounds to 0, but the
    // zero-state copy must NOT swap in (the bare bar renders instead).
    const subPixel = await mount({ props: { value: 0.4 } });
    const header = subPixel.shadowRoot?.querySelector('.header');
    expect(header?.hasAttribute('hidden')).toBe(true);
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
    expect(fill(subPixel).style.width).toBe('0%');

    // Exactly min IS the zero state.
    const zero = await mount({ props: { value: 0 } });
    expect(zero.shadowRoot?.querySelector('.header')?.textContent).toContain(
      'Ещё ничего не заполнено',
    );
  });

  it('the projected empty slot wins over the default copy', async () => {
    const el = await mount({ slotContent: '<span slot="empty">Начните заполнять заявку</span>' });
    const emptySlot = el.shadowRoot?.querySelector('slot[name="empty"]');
    expect(emptySlot?.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
    // The projected copy is the header's light-DOM text, not the shadow default.
    expect(el.textContent).toContain('Начните заполнять заявку');
    expect(el.shadowRoot?.querySelector('.header')?.textContent).not.toContain(
      'Ещё ничего не заполнено',
    );
  });

  it('an empty projected ELEMENT in the value slot counts as content (the badge-slot element rule)', async () => {
    // Named slots take only elements — the minimal "empty projection" is an
    // empty span, and the badge-slot rule counts ELEMENTS as content: it
    // suppresses the % fallback and the zero-state copy (consumer's choice).
    const el = await mount({ props: { value: 0 }, slotContent: '<span slot="value"></span>' });
    const header = el.shadowRoot?.querySelector('.header');
    expect(header?.hasAttribute('hidden')).toBe(false);
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
    // The % fallback is suppressed too — the projected (empty) cell wins.
    expect(header?.textContent).not.toContain('%');
  });

  it('indeterminate is NOT the zero state (unknown ≠ nothing yet)', async () => {
    const el = await mount({ props: { indeterminate: true } });
    const header = el.shadowRoot?.querySelector('.header');
    expect(header?.hasAttribute('hidden')).toBe(true);
    expect(header?.textContent).not.toContain('Ещё ничего не заполнено');
  });

  // --- Header composition: label slot / % fallback --------------------------------

  it('slotted label content wins over the label prop (slot fallback precedence)', async () => {
    const el = await mount({
      props: { label: 'prop text', value: 5 },
      slotContent: '<span slot="label">slotted text</span>',
    });
    const header = el.shadowRoot?.querySelector('.header');
    const labelSlot = header?.querySelector('slot[name="label"]');
    expect(labelSlot?.assignedNodes({ flatten: true }).length).toBeGreaterThan(0);
    expect(header?.textContent).not.toContain('prop text');
    // The % fallback still renders beside it.
    expect(header?.textContent).toContain('5%');
  });

  it('a bare non-zero determinate bar carries no name by design (consumers label it)', async () => {
    const el = await mount({ props: { value: 50 } });
    expect(track(el).getAttribute('aria-labelledby')).toBeNull();
  });

  // --- Stateless contract + form participation N/A ---------------------------------

  it('is stateless: a value change dispatches NOTHING (no value-change channel)', async () => {
    const el = await mount({ props: { value: 10, label: 'П' } });
    const dispatchSpy = vi.spyOn(el, 'dispatchEvent');
    el.value = 90;
    await elementUpdated(el);
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(el.value).toBe(90); // input preserved verbatim
  });

  it('form participation N/A: no formAssociated static, no name property (display only)', () => {
    expect(
      (TkProgressBar as unknown as { formAssociated?: boolean }).formAssociated,
      'display component — no ElementInternals mirror',
    ).toBeUndefined();
    const el = new TkProgressBar();
    expect((el as unknown as { name?: unknown }).name).toBeUndefined();
  });

  // --- Reflection rules (CONVENTIONS §2) ----------------------------------------------

  it('reflects the boolean hooks and never reflects the number data props', async () => {
    const el = await mount({ props: { value: 30, min: 0, max: 100 } });
    el.indeterminate = true;
    el.announce = true;
    await elementUpdated(el);
    expect(el.hasAttribute('indeterminate')).toBe(true);
    expect(el.hasAttribute('announce')).toBe(true);
    el.value = 60;
    el.min = 10;
    el.max = 90;
    await elementUpdated(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.hasAttribute('min')).toBe(false);
    expect(el.hasAttribute('max')).toBe(false);
  });

  it('ids: per-instance label ids cannot collide across instances', async () => {
    const a = await mount({ props: { label: 'A' } });
    const b = await mount({ props: { label: 'B' } });
    const idA = track(a).getAttribute('aria-labelledby');
    const idB = track(b).getAttribute('aria-labelledby');
    expect(idA).not.toBe(idB);
    expect(a.shadowRoot?.getElementById(idA ?? '')?.textContent).toContain('A');
    expect(b.shadowRoot?.getElementById(idB ?? '')?.textContent).toContain('B');
  });
});
