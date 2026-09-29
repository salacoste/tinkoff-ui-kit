// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, render, type TemplateResult } from 'lit';

import { TjPostCard } from './tj-post-card.js';
import { postCardStyles } from './tj-post-card.css.js';

// The tj-rubric-header macrotask settle (hard rule): happy-dom queues the
// slotchange event inconsistently for the FIRST assignment, so a settle
// crosses one macrotask before the final updateComplete read.
const elementUpdated = async (el: TjPostCard) => {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
};

const mount = (markup: TemplateResult) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(markup, host);
  const el = host.querySelector('tj-post-card') as TjPostCard;
  return { el, teardown: () => host.remove() };
};

const anchorOf = (el: TjPostCard) =>
  el.shadowRoot?.querySelector('a.card') as HTMLAnchorElement;

const fullCard = html`
  <img slot="avatar" src="avatar.png" alt="Аватар автора" />
  <span slot="byline">Ирина Сомова</span>
  <time slot="date" datetime="2026-09-29T11:20">29 сентября</time>
  <h2 slot="title">
    Как мы выстроили процесс ревью в распределённой команде из двадцати человек
  </h2>
  <span slot="count">42</span>
`;

describe('tj-post-card registration', () => {
  it('defines on the custom-elements registry exactly once', () => {
    expect(customElements.get('tj-post-card')).toBe(TjPostCard);
    // The 16.1 registration idiom — the guard makes double-import safe.
    expect(() => {
      if (!customElements.get('tj-post-card')) {
        customElements.define('tj-post-card', TjPostCard);
      }
    }).not.toThrow();
  });

  it('exposes its tag on HTMLElementTagNameMap', () => {
    const el = document.createElement('tj-post-card');
    expect(el).toBeInstanceOf(TjPostCard);
  });
});

describe('tj-post-card anchor contract (the 16.1 tj-link mold verbatim)', () => {
  it('renders ONE anchor wrapping the whole cell (the row-as-link mold)', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    const anchors = el.shadowRoot?.querySelectorAll('a');
    expect(anchors?.length).toBe(1);
    expect(el.shadowRoot?.querySelectorAll('h1,h2,h3').length).toBe(0); // the heading is slotted
    teardown();
  });

  it('renders NO href attribute when href is empty or absent (inert anchor)', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    const anchor = anchorOf(el);
    expect(anchor.hasAttribute('href')).toBe(false);
    el.href = '/posts/1';
    await elementUpdated(el);
    expect(anchor.getAttribute('href')).toBe('/posts/1');
    el.href = '';
    await elementUpdated(el);
    expect(anchor.hasAttribute('href')).toBe(false);
    teardown();
  });

  it('passes target through verbatim', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="/p/1" target="_blank">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('target')).toBe('_blank');
    teardown();
  });

  it('mints noopener noreferrer exactly when target=_blank and the consumer rel is unset', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="/p/1" target="_blank">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('rel')).toBe('noopener noreferrer');
    teardown();
  });

  it('keeps the consumer rel verbatim (wins over the _blank mint)', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="/p/1" target="_blank" rel="nofollow">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('rel')).toBe('nofollow');
    teardown();
  });

  it('mints NO rel for non-_blank targets', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="/p/1" target="_self">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    expect(anchorOf(el).hasAttribute('rel')).toBe(false);
    teardown();
  });
});

describe('tj-post-card title-attr mirror (clamp recovery + consumer wins)', () => {
  it('mirrors the slotted title FULL text onto the anchor title', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe(
      'Как мы выстроили процесс ревью в распределённой команде из двадцати человек',
    );
    teardown();
  });

  it('forwards a consumer host title VERBATIM and it WINS over the mirror', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="#p" title="Подсказка потребителя">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe('Подсказка потребителя');
    teardown();
  });

  it('honors title="" as deliberate suppression (verbatim, still wins)', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p" title="">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe('');
    teardown();
  });

  it('returns to the mirror when the consumer title attribute is removed', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="#p" title="Подсказка потребителя">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    el.removeAttribute('title');
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe(
      'Как мы выстроили процесс ревью в распределённой команде из двадцати человек',
    );
    teardown();
  });

  it('forwards a consumer PROPERTY title too — the React path (property writes never touch the attribute)', async () => {
    // The lens-corrected channel: @lit/react sets known props as element
    // PROPERTIES, and the Lit accessor shadows the native reflecting one —
    // so el.title = 'x' writes NO attribute. The sync must read the
    // property as the second precedence step or the PRIMARY React path
    // ships a documented-but-dead contract.
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    el.title = 'Подсказка через проп';
    await elementUpdated(el);
    expect(el.hasAttribute('title')).toBe(false); // property, NOT reflected
    expect(anchorOf(el).getAttribute('title')).toBe('Подсказка через проп');
    // Back to the mirror when the consumer clears the property.
    el.title = '';
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe(
      'Как мы выстроили процесс ревью в распределённой команде из двадцати человек',
    );
    teardown();
  });

  it('ATTRIBUTE beats PROPERTY when both are set (precedence pin)', async () => {
    const { el, teardown } = mount(
      html`<tj-post-card href="#p" title="Атрибут победил">${fullCard}</tj-post-card>`,
    );
    await elementUpdated(el);
    el.title = 'Свойство проиграло';
    await elementUpdated(el);
    expect(anchorOf(el).getAttribute('title')).toBe('Атрибут победил');
    teardown();
  });

  it('re-mirrors when a NEW heading lands in the title slot (slotchange path)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = document.createElement('tj-post-card') as TjPostCard;
    el.href = '#p';
    el.innerHTML = '<h3 slot="title">Первый заголовок</h3>';
    host.appendChild(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('a.card')?.getAttribute('title')).toBe('Первый заголовок');
    el.querySelector('h3')?.remove(); // the consumer swaps the heading wholesale
    const next = document.createElement('h3');
    next.setAttribute('slot', 'title');
    next.textContent = '  Второй заголовок с полями  ';
    el.appendChild(next);
    await elementUpdated(el);
    // The FIRST assigned element mirrors; trim is verbatim.
    expect(el.shadowRoot?.querySelector('a.card')?.getAttribute('title')).toBe(
      'Второй заголовок с полями',
    );
    host.remove();
  });
});

describe('tj-post-card slots', () => {
  it('hides the mini avatar wrapper (decorative) while slotted', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    const wrapper = el.shadowRoot?.querySelector('.meta__avatar');
    expect(wrapper?.getAttribute('aria-hidden')).toBe('true');
    expect(wrapper?.querySelector("slot[name='avatar']")).toBeTruthy();
    teardown();
  });

  it('renders NO phantom circle when the avatar slot is empty (graceful both ways)', async () => {
    const { el, teardown } = mount(html`
      <tj-post-card href="#p">
        <span slot="byline">Ирина Сомова</span>
        <h2 slot="title">Заголовок без аватара</h2>
      </tj-post-card>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.meta__avatar')).toBeNull();
    expect(el.shadowRoot?.querySelector("slot[name='avatar']")?.hasAttribute('hidden')).toBe(true);
    teardown();
  });

  it('renders the decorative bubble + count line while slotted (icon aria-hidden)', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    const icon = el.shadowRoot?.querySelector('.count__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.getAttribute('focusable')).toBe('false');
    expect(el.shadowRoot?.querySelector('.count')?.querySelector("slot[name='count']")).toBeTruthy();
    teardown();
  });

  it('renders NO orphan bubble when the count slot is empty', async () => {
    const { el, teardown } = mount(html`
      <tj-post-card href="#p">
        <span slot="byline">Ирина Сомова</span>
        <h2 slot="title">Пост без счётчика комментариев</h2>
      </tj-post-card>
    `);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.count')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('svg').length).toBe(0);
    expect(el.shadowRoot?.querySelector("slot[name='count']")?.hasAttribute('hidden')).toBe(true);
    teardown();
  });

  it('adds the count line on late assignment (slotchange bookkeeping)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const el = document.createElement('tj-post-card') as TjPostCard;
    el.href = '#p';
    el.innerHTML = '<h2 slot="title">Поздний счётчик</h2>';
    host.appendChild(el);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.count')).toBeNull();
    const span = document.createElement('span');
    span.setAttribute('slot', 'count');
    span.textContent = '7';
    el.appendChild(span);
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.count')).toBeTruthy();
    host.remove();
  });
});

describe('tj-post-card freeze pins (spec 16.4 — no invented states)', () => {
  it('exposes ONLY the anchor trio + the title channel (no like/bookmark/skeleton API)', () => {
    const el = new TjPostCard();
    expect('href' in el).toBe(true);
    expect('title' in el).toBe(true);
    expect('variant' in el).toBe(false);
    expect('skeleton' in el).toBe(false);
    expect('likes' in el).toBe(false);
    expect('bookmarks' in el).toBe(false);
  });

  it('ships NO event machinery in its module surface (the no-entry ruling — stateless mold)', async () => {
    const { el, teardown } = mount(html`<tj-post-card href="#p">${fullCard}</tj-post-card>`);
    await elementUpdated(el);
    expect(el.hasAttribute('open')).toBe(false);
    teardown();
  });

  it('exports ONLY the element class (no event classes ride along)', async () => {
    const mod = (await import('./tj-post-card.js')) as Record<string, unknown>;
    expect(Object.keys(mod).sort()).toEqual(['TjPostCard']);
  });
});

describe('tj-post-card css.ts pins', () => {
  const cssText = postCardStyles.cssText;

  it('is TRANSPARENT — no own surface on the cell (the composition ruling)', () => {
    expect(cssText).not.toContain('background:');
    expect(cssText).not.toContain('border:');
    expect(cssText).not.toContain('box-shadow:');
    expect(cssText).not.toContain('max-width:');
    // The .card block carries layout only — no padding declaration (the
    // prose may NAME padding; only declarations fail — declaration form).
    expect(cssText).not.toContain('padding:');
  });

  it('types the species: news-title title, byline author, time-meta date/count', () => {
    expect(cssText).toContain('font-size: var(--tj-text-news-title-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-news-title-weight)');
    expect(cssText).toContain('line-height: var(--tj-text-news-title-leading)');
    expect(cssText).toContain('font-size: var(--tj-text-byline-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-byline-weight)');
    expect(cssText).toContain('font-size: var(--tj-text-time-meta-size)');
    expect(cssText).toContain('font-weight: var(--tj-text-time-meta-weight)');
    expect(cssText).toContain('color: var(--tj-color-ink-100)');
    expect(cssText).toContain('color: var(--tj-color-ink-300)');
  });

  it('carries the FLAGGED 20px meta avatar (structural)', () => {
    expect(cssText).toContain('width: 20px');
    expect(cssText).toContain('height: 20px');
    expect(cssText).toContain('border-radius: var(--tj-radius-badge)');
  });

  it('carries the FLAGGED clamp quartet on the slotted heading (EXPERIENCE contract)', () => {
    expect(cssText).toContain('display: -webkit-box');
    expect(cssText).toContain('-webkit-box-orient: vertical');
    expect(cssText).toContain('-webkit-line-clamp: 2');
    expect(cssText).toContain('overflow: hidden');
    // The quartet rides THE SLOTTED HEADING rule — moving it to the .title
    // wrapper (where it would clamp the slot box, not the heading flow)
    // must fail: extract the ::slotted(h2,h3) rule and pin all four INSIDE.
    // Non-empty parens: cssText keeps comments (the 16.3 lens lesson).
    const titleRule = cssText.match(/slot\[name='title'\]::slotted\(h[23]\)[^{}]*\{[^}]*\}/);
    expect(titleRule).toBeTruthy();
    for (const decl of [
      'display: -webkit-box',
      '-webkit-box-orient: vertical',
      '-webkit-line-clamp: 2',
      'overflow: hidden',
    ]) {
      expect(titleRule?.[0]).toContain(decl);
    }
  });

  it('styles ONLY the two known slotted species — the ::slotted selector set is exact', () => {
    // The 16.3 rubric-header count-pin mold: additions AND removals fail.
    // Exactly three non-empty-paren ::slotted occurrences: avatar img +
    // title h2 + title h3 (one RULE, two selector STRINGS — the regex
    // counts occurrences, and h2/h3 are separate strings).
    expect((cssText.match(/::slotted\([^)]+\)/g) ?? []).length).toBe(3);
    expect(cssText).toContain("slot[name='avatar']::slotted(img)");
    expect(cssText).toContain("slot[name='title']::slotted(h2)");
    expect(cssText).toContain("slot[name='title']::slotted(h3)");
  });

  it('focus ring = the shipped tj ring mold verbatim', () => {
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
  });

  it('has NO hover art, motion, or live-region machinery (nothing invented)', () => {
    expect(cssText).not.toContain(':hover');
    expect(cssText).not.toContain('transition:');
    expect(cssText).not.toContain('animation:');
    expect(cssText).not.toContain('@keyframes');
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
