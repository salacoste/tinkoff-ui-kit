// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, render, type TemplateResult } from 'lit';

import { TjNewsCard } from './tj-news-card.js';
import { newsCardStyles } from './tj-news-card.css.js';

const elementUpdated = (el: TjNewsCard) => el.updateComplete;

const mount = (markup: TemplateResult) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(markup, host);
  const el = host.querySelector('tj-news-card') as TjNewsCard;
  return { el, teardown: () => host.remove() };
};

const fullCard = html`
  <img slot="mark" src="mark.png" alt="" />
  <img slot="avatar" src="avatar.png" alt="Аватар автора" />
  <span slot="byline">Марина Ветрова</span>
  <h2 slot="title">Минздрав зарегистрировал первую четырёхвалентную вакцину</h2>
  <p slot="excerpt">Четырёхвалентная схема закрывает сразу четыре серогруппы менингококка.</p>
  <span slot="meta"><time datetime="2026-09-29T09:40">29 сентября, 09:40</time></span>
`;

describe('tj-news-card registration', () => {
  it('defines on the custom-elements registry exactly once', () => {
    expect(customElements.get('tj-news-card')).toBe(TjNewsCard);
    // The 16.1 registration idiom — the guard makes double-import safe.
    expect(() => {
      if (!customElements.get('tj-news-card')) {
        customElements.define('tj-news-card', TjNewsCard);
      }
    }).not.toThrow();
  });

  it('exposes its tag on HTMLElementTagNameMap', () => {
    const el = document.createElement('tj-news-card');
    expect(el).toBeInstanceOf(TjNewsCard);
  });

  it('renders ONE anchor wrapping the whole card (the row-as-link mold)', async () => {
    const { el, teardown } = mount(html`<tj-news-card href="#card">${fullCard}</tj-news-card>`);
    await elementUpdated(el);
    const anchors = el.shadowRoot?.querySelectorAll('a');
    expect(anchors?.length).toBe(1);
    const card = el.shadowRoot?.querySelector('a.card');
    expect(card).toBeTruthy();
    // The slot containers live INSIDE the single anchor.
    expect(card?.querySelectorAll('slot').length).toBe(6);
    expect(el.shadowRoot?.querySelectorAll('h1,h2,h3').length).toBe(0);
    teardown();
  });
});

describe('tj-news-card anchor contract (the 16.1 tj-link mold verbatim)', () => {
  it('renders NO href attribute when href is empty or absent (inert anchor)', async () => {
    const { el, teardown } = mount(html`<tj-news-card href="">${fullCard}</tj-news-card>`);
    await elementUpdated(el);
    const anchor = el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;
    expect(anchor.hasAttribute('href')).toBe(false);
    el.href = '/news/1';
    await elementUpdated(el);
    expect(anchor.getAttribute('href')).toBe('/news/1');
    el.href = '';
    await elementUpdated(el);
    expect(anchor.hasAttribute('href')).toBe(false);
    teardown();
  });

  it('passes target through verbatim', async () => {
    const { el, teardown } = mount(
      html`<tj-news-card href="/n/1" target="_blank">${fullCard}</tj-news-card>`,
    );
    await elementUpdated(el);
    const anchor = el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;
    expect(anchor.getAttribute('target')).toBe('_blank');
    teardown();
  });

  it('mints noopener noreferrer exactly when target=_blank and the consumer rel is unset', async () => {
    const { el, teardown } = mount(
      html`<tj-news-card href="/n/1" target="_blank">${fullCard}</tj-news-card>`,
    );
    await elementUpdated(el);
    const anchor = el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    teardown();
  });

  it('keeps the consumer rel verbatim (wins over the _blank mint)', async () => {
    const { el, teardown } = mount(
      html`<tj-news-card href="/n/1" target="_blank" rel="nofollow">${fullCard}</tj-news-card>`,
    );
    await elementUpdated(el);
    const anchor = el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;
    expect(anchor.getAttribute('rel')).toBe('nofollow');
    teardown();
  });

  it('mints NO rel for non-_blank targets', async () => {
    const { el, teardown } = mount(
      html`<tj-news-card href="/n/1" target="_self">${fullCard}</tj-news-card>`,
    );
    await elementUpdated(el);
    const anchor = el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;
    expect(anchor.hasAttribute('rel')).toBe(false);
    teardown();
  });
});

describe('tj-news-card slots', () => {
  it('projects the consumer h2/h3 title and hides the decorative mark wrapper', async () => {
    const { el, teardown } = mount(html`<tj-news-card href="#c">${fullCard}</tj-news-card>`);
    await elementUpdated(el);
    const titleSlot = el.shadowRoot?.querySelector("slot[name='title']") as HTMLSlotElement;
    const assigned = titleSlot.assignedNodes().filter((n) => n.nodeType === Node.ELEMENT_NODE);
    expect((assigned[0] as HTMLElement).tagName).toBe('H2');
    expect(el.shadowRoot?.querySelector('.byline__mark')?.getAttribute('aria-hidden')).toBe('true');
    // The avatar wrapper is NOT aria-hidden — the consumer alt rides.
    expect(el.shadowRoot?.querySelector('.byline__avatar')?.hasAttribute('aria-hidden')).toBe(false);
    // Geometry pin beside the byline aria pins: the avatar box is the measured
    // 45×45 (audit 2026-10-01, live drift ahead of the 2026-09-28 pack).
    expect(newsCardStyles.cssText).toContain('width: 45px');
    expect(newsCardStyles.cssText).toContain('height: 45px');
    teardown();
  });

  it('skips the excerpt wrapper when the optional slot is empty (graceful both ways)', async () => {
    const { el, teardown } = mount(html`
      <tj-news-card href="#c">
        <span slot="byline">Марина Ветрова</span>
        <h3 slot="title">Заголовок без лида</h3>
      </tj-news-card>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.excerpt')).toBeNull();
    expect(el.shadowRoot?.querySelector("slot[name='excerpt']")?.hasAttribute('hidden')).toBe(true);
    teardown();
  });

  it('adds the excerpt wrapper on late assignment (slotchange bookkeeping)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = document.createElement('tj-news-card') as TjNewsCard;
    el.innerHTML = '<h2 slot="title">Поздний лид</h2>';
    host.appendChild(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.excerpt')).toBeNull();
    const p = document.createElement('p');
    p.setAttribute('slot', 'excerpt');
    p.textContent = 'Лид пришёл позже.';
    el.appendChild(p);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.excerpt')).toBeTruthy();
    host.remove();
  });
});

describe('tj-news-card skeleton', () => {
  it('swaps the anchor for aria-hidden bones and marks the host aria-busy', async () => {
    const { el, teardown } = mount(html`<tj-news-card href="#c" skeleton>${fullCard}</tj-news-card>`);
    await elementUpdated(el);
    expect(el.getAttribute('aria-busy')).toBe('true');
    // NO anchor while skeleton — no empty focus stop.
    expect(el.shadowRoot?.querySelector('a')).toBeNull();
    const bones = el.shadowRoot?.querySelector('.card--skeleton');
    expect(bones?.getAttribute('aria-hidden')).toBe('true');
    expect(el.shadowRoot?.querySelectorAll('.sk').length).toBe(5);
    // No excerpt bone — the optional slot never bones.
    expect(el.shadowRoot?.querySelector('.sk--excerpt')).toBeNull();
    teardown();
  });

  it('restores the live anchor when the attribute is removed', async () => {
    const { el, teardown } = mount(html`<tj-news-card href="#c" skeleton>${fullCard}</tj-news-card>`);
    await elementUpdated(el);
    el.skeleton = false;
    await elementUpdated(el);
    expect(el.hasAttribute('aria-busy')).toBe(false);
    expect(el.hasAttribute('skeleton')).toBe(false);
    expect(el.shadowRoot?.querySelector('a.card')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.card--skeleton')).toBeNull();
    teardown();
  });
});

describe('tj-news-card freeze pins (spec 16.3 — no invented states)', () => {
  it('exposes ONLY the anchor trio + skeleton (no variant/hover API)', () => {
    const el = new TjNewsCard();
    expect('href' in el).toBe(true);
    expect('skeleton' in el).toBe(true);
    expect('variant' in el).toBe(false);
    expect('loading' in el).toBe(false);
  });
});

describe('tj-news-card css.ts pins', () => {
  const cssText = newsCardStyles.cssText;

  it('consumes the card/radius/typography tokens exactly', () => {
    expect(cssText).toContain('background: var(--tj-color-card)');
    expect(cssText).toContain('border-radius: var(--tj-radius-card)');
    expect(cssText).toContain('font-size: var(--tj-text-news-title-size)');
    expect(cssText).toContain('font-size: var(--tj-text-byline-size)');
    expect(cssText).toContain('font-size: var(--tj-text-time-meta-size)');
    expect(cssText).toContain('color: var(--tj-color-ink-300)');
  });

  it('bones at the FLAGGED 12% meta-ink alpha, with NO animation', () => {
    expect(cssText).toContain('color-mix(in srgb, var(--tj-color-ink-300) 12%, transparent)');
    // Declaration-form pins: cssText keeps comments, so the prose may NAME
    // the banned properties — only actual declarations fail.
    expect(cssText).not.toContain('animation:');
    expect(cssText).not.toContain('@keyframes');
    expect(cssText).not.toContain('transition:');
  });

  it('is FLAT — no shadow, no hover lift (the 95-card census)', () => {
    expect(cssText).not.toContain('box-shadow:');
    expect(cssText).not.toContain(':hover');
    expect(cssText).not.toContain('transform:');
  });

  it('focus ring = focus-ring token on the CARD surface (the AA-surface law)', () => {
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
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
