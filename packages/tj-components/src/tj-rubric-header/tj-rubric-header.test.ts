// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, render, type TemplateResult } from 'lit';

import { TjRubricHeader } from './tj-rubric-header.js';
import { rubricHeaderStyles } from './tj-rubric-header.css.js';

// Slot-tracking surfaces need the slotchange EVENT to fire after the initial
// render (happy-dom queues it) — settle across a macrotask boundary, then
// await the re-render the handler schedules.
const elementUpdated = async (el: TjRubricHeader) => {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
};

const mount = (markup: TemplateResult) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(markup, host);
  const el = host.querySelector('tj-rubric-header') as TjRubricHeader;
  return { el, teardown: () => host.remove() };
};

const cover = html`<img slot="cover" src="cover.png" alt="" />`;
const mark = html`<img slot="mark" src="mark.png" alt="" />`;

describe('tj-rubric-header registration', () => {
  it('defines on the custom-elements registry exactly once', () => {
    expect(customElements.get('tj-rubric-header')).toBe(TjRubricHeader);
    // The 16.1 registration idiom — the guard makes double-import safe.
    expect(() => {
      if (!customElements.get('tj-rubric-header')) {
        customElements.define('tj-rubric-header', TjRubricHeader);
      }
    }).not.toThrow();
  });

  it('exposes its tag on HTMLElementTagNameMap', () => {
    const el = document.createElement('tj-rubric-header');
    expect(el).toBeInstanceOf(TjRubricHeader);
  });

  it('renders its cover / mark / default slots (three slot wrappers)', async () => {
    const { el, teardown } = mount(html`
      <tj-rubric-header>
        ${cover}
        ${mark}
        <h1>Новости</h1>
        <p>Важное — каждый день</p>
      </tj-rubric-header>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelectorAll('slot').length).toBe(3);
    expect(el.shadowRoot?.querySelector("slot[name='cover']")).toBeTruthy();
    expect(el.shadowRoot?.querySelector("slot[name='mark']")).toBeTruthy();
    expect(el.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
    teardown();
  });
});

describe('tj-rubric-header composition', () => {
  it('wraps the mark in an aria-hidden box with the overlap class when cover art exists', async () => {
    const { el, teardown } = mount(html`
      <tj-rubric-header>
        ${cover}
        ${mark}
        <h1>Новости</h1>
      </tj-rubric-header>
    `);
    await elementUpdated(el);
    const markBox = el.shadowRoot?.querySelector('.mark');
    expect(markBox).toBeTruthy();
    expect(markBox?.getAttribute('aria-hidden')).toBe('true');
    expect(markBox?.classList.contains('mark--overlap')).toBe(true);
    teardown();
  });

  it('drops the overlap art when NO cover is slotted (graceful, no negative-margin hole)', async () => {
    const { el, teardown } = mount(html`
      <tj-rubric-header>
        ${mark}
        <h1>Новости</h1>
      </tj-rubric-header>
    `);
    await elementUpdated(el);
    const markBox = el.shadowRoot?.querySelector('.mark');
    expect(markBox).toBeTruthy();
    expect(markBox?.classList.contains('mark--overlap')).toBe(false);
    teardown();
  });

  it('renders NO mark box at all when the mark slot is empty (hidden catch-slot)', async () => {
    const { el, teardown } = mount(html`
      <tj-rubric-header>
        ${cover}
        <h1>Новости</h1>
      </tj-rubric-header>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.mark')).toBeNull();
    const catchSlot = el.shadowRoot?.querySelector("slot[name='mark']");
    expect(catchSlot?.hasAttribute('hidden')).toBe(true);
    teardown();
  });

  it('projects the consumer h1/p through the default slot (no own heading element)', async () => {
    const { el, teardown } = mount(html`
      <tj-rubric-header>
        ${cover}
        <h1>Новости</h1>
        <p>Важное — каждый день</p>
      </tj-rubric-header>
    `);
    await elementUpdated(el);
    // The component never renders a heading element of its own — the ONLY
    // h1 is the consumer's slotted one (the no-heading-invention rule).
    expect(el.shadowRoot?.querySelectorAll('h1,h2,h3').length).toBe(0);
    const flow = el.shadowRoot?.querySelector('.flow slot:not([name])') as HTMLSlotElement;
    const assigned = flow.assignedNodes().filter((n) => n.nodeType === Node.ELEMENT_NODE);
    expect((assigned[0] as HTMLElement).tagName).toBe('H1');
    expect((assigned[1] as HTMLElement).tagName).toBe('P');
    teardown();
  });

  it('re-evaluates slot presence on late assignment (slotchange bookkeeping)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = document.createElement('tj-rubric-header') as TjRubricHeader;
    el.innerHTML = '<h1>Новости</h1>';
    host.appendChild(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.mark')).toBeNull();
    const img = document.createElement('img');
    img.setAttribute('slot', 'mark');
    img.setAttribute('alt', '');
    el.appendChild(img);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.mark')?.getAttribute('aria-hidden')).toBe('true');
    host.remove();
  });
});

describe('tj-rubric-header freeze pins (spec 16.2 — slots only, zero API surface)', () => {
  it('has NO properties beyond the slot bookkeeping (no exposed API)', () => {
    const el = new TjRubricHeader();
    // The freeze pattern from 16.1: known property names must not appear.
    expect('href' in el).toBe(false);
    expect('skeleton' in el).toBe(false);
    expect('variant' in el).toBe(false);
  });

  it('dispatches nothing (stateless — the event-map no-entry ruling)', () => {
    const el = new TjRubricHeader();
    expect(Object.getOwnPropertyNames(Object.getPrototypeOf(el))).not.toContain('emit');
  });
});

describe('tj-rubric-header css.ts pins', () => {
  const cssText = rubricHeaderStyles.cssText;

  it('consumes only --tj-* tokens and the flagged structural values', () => {
    // Card surface + panel radius + the rubric-h1 species on the slotted h1.
    expect(cssText).toContain('background: var(--tj-color-card)');
    expect(cssText).toContain('border-radius: var(--tj-radius-panel)');
    expect(cssText).toContain('font-size: var(--tj-text-rubric-h1-size)');
    expect(cssText).toContain('font-size: var(--tj-text-card-title-size)');
    // The named FLAGs: 100×100 mark box + the -50px half-overlap.
    expect(cssText).toContain('width: 100px');
    expect(cssText).toContain('height: 100px');
    expect(cssText).toContain('margin-block-start: -50px');
  });

  it('carries the flag comments (flag-don’t-invent rule)', () => {
    expect(cssText).toContain('FLAG');
  });

  it('has ZERO theme branches (tokens re-resolve — AD-3)', () => {
    expect(cssText).not.toContain('--tk-');
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });

  it('has no focus/hover rules — a passive layout surface (no interactive of its own)', () => {
    expect(cssText).not.toContain(':hover');
    expect(cssText).not.toContain('focus');
  });

  it('styles ONLY the four known species — unknown slotted tags pass through unstyled', () => {
    // The spec I/O row (unknown tags = inert passthrough): the ::slotted
    // selector set is EXACTLY cover-img / mark-img / h1 / p — the count pin
    // makes any ADDED selector fail, the four strings make removals fail.
    // Non-empty parens: cssText KEEPS comments, and a prose mention of
    // bare ::slotted() must not count as a selector.
    expect((cssText.match(/::slotted\([^)]+\)/g) ?? []).length).toBe(4);
    expect(cssText).toContain("slot[name='cover']::slotted(img)");
    expect(cssText).toContain("slot[name='mark']::slotted(img)");
    expect(cssText).toContain('::slotted(h1)');
    expect(cssText).toContain('::slotted(p)');
  });
});
