// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { html, render, type TemplateResult } from 'lit';

import { TjComposer, TjOpenComposeEvent } from './tj-composer.js';
import { composerStyles } from './tj-composer.css.js';

// The tj-rubric-header macrotask settle (hard rule): happy-dom queues the
// slotchange event inconsistently for the FIRST assignment, so a settle
// crosses one macrotask before the final updateComplete read.
const elementUpdated = async (el: TjComposer) => {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
};

const mount = (markup: TemplateResult) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(markup, host);
  const el = host.querySelector('tj-composer') as TjComposer;
  return { el, teardown: () => host.remove() };
};

const buttonOf = (el: TjComposer) =>
  el.shadowRoot?.querySelector('button.composer') as HTMLButtonElement;

describe('tj-composer registration', () => {
  it('defines on the custom-elements registry exactly once', () => {
    expect(customElements.get('tj-composer')).toBe(TjComposer);
    // The 16.1 registration idiom — the guard makes double-import safe.
    expect(() => {
      if (!customElements.get('tj-composer')) {
        customElements.define('tj-composer', TjComposer);
      }
    }).not.toThrow();
  });

  it('exposes its tag on HTMLElementTagNameMap', () => {
    const el = document.createElement('tj-composer');
    expect(el).toBeInstanceOf(TjComposer);
  });
});

describe('tj-composer button mold (a BUTTON, not an input)', () => {
  it('renders ONE real button (type=button) — Enter/Space activate by construction', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    const buttons = el.shadowRoot?.querySelectorAll('button');
    expect(buttons?.length).toBe(1);
    const button = buttonOf(el);
    expect(button.getAttribute('type')).toBe('button');
    // NO editor is ever rendered — the whole-contract ruling.
    expect(el.shadowRoot?.querySelectorAll('input,textarea').length).toBe(0);
    teardown();
  });

  it('carries the reference ghost text as the button content (the accessible name)', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    expect(el.label).toBe('Написать пост или вопрос…');
    expect(el.shadowRoot?.querySelector('.composer__label')?.textContent).toBe(
      'Написать пост или вопрос…',
    );
    teardown();
  });
});

describe('tj-composer label channel (string data — never reflects)', () => {
  it('swaps the ghost text verbatim and reflects NOTHING to the host', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    el.label = 'Спросите сообщество';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.composer__label')?.textContent).toBe(
      'Спросите сообщество',
    );
    // Property-set NEVER writes the attribute — string DATA never reflects
    // (§2). (An initial `label="…"` attribute in markup stays until upgrade
    // — that is lit-html's pre-upgrade set, not component reflection.)
    expect(el.hasAttribute('label')).toBe(false);
    teardown();
  });

  it('forwards a host aria-label to the shadow button verbatim (consumer wins)', async () => {
    const { el, teardown } = mount(
      html`<tj-composer label="" aria-label="Написать в сообщество"></tj-composer>`,
    );
    await elementUpdated(el);
    expect(buttonOf(el).getAttribute('aria-label')).toBe('Написать в сообщество');
    // Late removal re-renders — the content name (empty here) takes back over.
    el.removeAttribute('aria-label');
    await elementUpdated(el);
    expect(buttonOf(el).hasAttribute('aria-label')).toBe(false);
    teardown();
  });

  it('mints NO aria-label while the host carries none', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    expect(buttonOf(el).hasAttribute('aria-label')).toBe(false);
    teardown();
  });

  it('renders NO aria-label attribute for an EMPTY host aria-label="" (content name survives)', async () => {
    // An empty-string aria-label attribute would OVERRIDE the button's
    // content name with an empty name (accname precedence) — the guard
    // renders nothing instead, so the ghost-text name wins.
    const { el, teardown } = mount(html`<tj-composer aria-label=""></tj-composer>`);
    await elementUpdated(el);
    expect(buttonOf(el).hasAttribute('aria-label')).toBe(false);
    teardown();
  });
});

describe('tj-composer avatar slot', () => {
  it('hides the decorative wrapper with aria-hidden while slotted', async () => {
    const { el, teardown } = mount(html`
      <tj-composer>
        <img slot="avatar" src="avatar.png" alt="Аватар автора" />
      </tj-composer>
    `);
    await elementUpdated(el);
    const wrapper = el.shadowRoot?.querySelector('.composer__avatar');
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper?.querySelector("slot[name='avatar']")).toBeTruthy();
    teardown();
  });

  it('renders NO phantom circle when the slot is empty (graceful both ways)', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.composer__avatar')).toBeNull();
    expect(el.shadowRoot?.querySelector("slot[name='avatar']")?.hasAttribute('hidden')).toBe(true);
    teardown();
  });

  it('adds the wrapper on late assignment (slotchange bookkeeping)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = document.createElement('tj-composer') as TjComposer;
    host.appendChild(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.composer__avatar')).toBeNull();
    const img = document.createElement('img');
    img.setAttribute('slot', 'avatar');
    img.setAttribute('src', 'avatar.png');
    el.appendChild(img);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.composer__avatar')).toBeTruthy();
    host.remove();
  });
});

describe('tj-composer open-compose (the event-map FIRST ТЖ entry)', () => {
  it('dispatches TjOpenComposeEvent on click — composed, bubbling, NO payload', async () => {
    const { el, teardown } = mount(
      html`<tj-composer><img slot="avatar" src="a.png" alt="" /></tj-composer>`,
    );
    await elementUpdated(el);
    const heard: Event[] = [];
    el.addEventListener('open-compose', (event) => heard.push(event));
    // bubbles: a HOST-PARENT listener must hear it too.
    const parentListener = vi.fn();
    (el.parentElement as HTMLElement).addEventListener('open-compose', parentListener);
    buttonOf(el).click();
    expect(heard.length).toBe(1);
    const event = heard[0];
    expect(event).toBeInstanceOf(TjOpenComposeEvent);
    expect(event.type).toBe('open-compose');
    expect(event.composed).toBe(true);
    expect(event.bubbles).toBe(true);
    expect((event as CustomEvent).detail).toBeNull(); // §3 bare verb — NO payload
    expect(parentListener).toHaveBeenCalledTimes(1); // bubbles out of the host
    teardown();
  });

  it('changes NOTHING on the element when activated (no editor, no state)', async () => {
    const { el, teardown } = mount(html`<tj-composer></tj-composer>`);
    await elementUpdated(el);
    const before = el.outerHTML;
    buttonOf(el).click();
    await elementUpdated(el);
    expect(el.outerHTML).toBe(before); // stateless: dispatch is the whole contract
    expect(el.hasAttribute('open')).toBe(false);
    teardown();
  });

  it('names the event class after the §4 grammar (TjX…Event, static eventName)', () => {
    expect(TjOpenComposeEvent.eventName).toBe('open-compose');
    const event = new TjOpenComposeEvent();
    expect(event.type).toBe('open-compose');
    expect(event.composed).toBe(true);
    expect(event.bubbles).toBe(true);
  });
});

describe('tj-composer freeze pins (spec 16.4 — no invented states)', () => {
  it('exposes ONLY the label channel (no variant/editor/disabled API)', () => {
    const el = new TjComposer();
    expect('label' in el).toBe(true);
    expect('variant' in el).toBe(false);
    expect('editor' in el).toBe(false);
    expect('disabled' in el).toBe(false);
    expect('value' in el).toBe(false);
  });
});

describe('tj-composer css.ts pins', () => {
  const cssText = composerStyles.cssText;

  it('consumes the card surface + scale tokens exactly (no height declaration)', () => {
    expect(cssText).toContain('background: var(--tj-color-card)');
    expect(cssText).toContain('border-radius: 20px'); // the structural FLAG
    expect(cssText).toContain('padding: var(--tj-space-24) var(--tj-space-32)');
    expect(cssText).toContain('gap: var(--tj-space-24)');
    expect(cssText).toContain('width: var(--tj-space-40)'); // avatar 40 — scale value
    expect(cssText).toContain('border-radius: var(--tj-radius-badge)'); // avatar round
    // Height DERIVES from the scale parts (24×2 + 40 = 88) — never declared
    // for the CARD. Scoped to the .composer RULE: the avatar's legit
    // height:40 and any line-height must not defeat the pin, and a slipped
    // height/min-height/max-height/block-size on the CARD fails it. (The
    // lens-hardened form — the bare not-contains missed height:96 etc.)
    const cardRule = cssText.match(/\.composer\s*\{[^}]*\}/);
    expect(cardRule).toBeTruthy();
    expect(cardRule?.[0]).toContain('padding: var(--tj-space-24) var(--tj-space-32)');
    expect(cardRule?.[0]).not.toMatch(/(?:min-|max-)?(?:height|block-size)\s*:/);
  });

  it('ghost text = card-title species on ink-300 (the AA meta step)', () => {
    expect(cssText).toContain('font-size: var(--tj-text-card-title-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-card-title-weight)');
    expect(cssText).toContain('line-height: var(--tj-space-24)');
    expect(cssText).toContain('color: var(--tj-color-ink-300)');
    expect(cssText).toContain('font-family: var(--tj-font-ui)');
  });

  it('focus ring = the shipped tj ring mold verbatim', () => {
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
  });

  it('has NO hover art, motion, or elevation (unprobed — nothing invented)', () => {
    expect(cssText).not.toContain(':hover');
    expect(cssText).not.toContain('transition:');
    expect(cssText).not.toContain('animation:');
    expect(cssText).not.toContain('@keyframes');
    expect(cssText).not.toContain('box-shadow:');
    expect(cssText).not.toContain('transform:');
  });

  it('carries the flag comments (flag-don’t-invent rule)', () => {
    expect(cssText).toContain('FLAG');
  });

  it('has ZERO theme branches (tokens re-resolve — AD-3)', () => {
    expect(cssText).not.toContain('--tk-');
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });
});
