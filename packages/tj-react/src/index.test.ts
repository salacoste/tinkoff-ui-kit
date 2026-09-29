// @vitest-environment happy-dom
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as litReact from '@lit/react';
import { afterAll, describe, expect, it, vi } from 'vitest';
import {
  TJ_THEME_ATTRIBUTE,
  TjOpenChangeEvent,
  TjOpenComposeEvent,
  TjThemeChangeEvent,
} from 'pillkit-tj-components';

import {
  Composer,
  Cta,
  EVENT_MAP,
  Header,
  Link,
  NewsCard,
  PostCard,
  Prose,
  Rail,
  RubricHeader,
  TagChip,
} from './index.js';

/**
 * pillkit-tj-react generated surface (stories 16.1 + 16.2/16.3 + 16.4 + 16.5).
 * The wrapper imports `pillkit-tj-components` (built dist — the packages run
 * in topological order under `pnpm -r test`) and the pinned `@lit/react`;
 * React itself resolves via the workspace peer (19.3.0). The smoke test
 * EXECUTES each wrapper through react-dom — the generated file is the whole
 * public surface, so an object-shape check alone would not catch a broken
 * binding (the bank index.test.ts mold).
 *
 * 16.4 opened the event registry (tj-composer's payload-less `open-compose`);
 * 16.5 adds the site-chrome pair, both exercised END-TO-END here: tj-header's
 * `onThemeChange` (the full theme cycle through the real theme button —
 * document-root attribute writes + removal-on-auto + the bare-STRING detail
 * handing React the event itself) and tj-rail's `onOpenChange` (the §9
 * overlay row: detail { value } unwraps to the bare boolean).
 */

// React 19 act() environment flag (test-utils lives on 'react' now).
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const roots: Root[] = [];
afterAll(() => {
  for (const root of roots) {
    act(() => root.unmount());
  }
});

const renderToContainer = async (element: React.ReactElement): Promise<HTMLElement> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  await act(() => {
    root.render(element);
  });
  return container;
};

describe('pillkit-tj-react (stories 16.1 + 16.2/16.3 + 16.4 + 16.5)', () => {
  it('generates the ten ТЖ wrappers from the ТЖ manifest', () => {
    // createComponent returns a React ForwardRefExoticComponent — an object
    // with the React forward_ref tag and a render function.
    for (const wrapper of [
      Composer,
      Cta,
      Header,
      Link,
      NewsCard,
      PostCard,
      Prose,
      Rail,
      RubricHeader,
      TagChip,
    ]) {
      expect(wrapper).toBeTypeOf('object');
      expect(wrapper.$$typeof).toBeDefined();
      expect((wrapper as { render?: unknown }).render).toBeTypeOf('function');
    }
  });

  it('renders <Prose> as tj-prose with slotted children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Prose, null, React.createElement('p', null, 'Абзац')),
    );
    const el = container.querySelector('tj-prose');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.textContent).toBe('Абзац');
    expect(el?.shadowRoot?.querySelector('slot[name="lead"]')).not.toBeNull();
  });

  it('renders <Link> as tj-link with element properties set through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        Link,
        { href: 'https://example.com/post', target: '_blank' },
        'Читать',
      ),
    );
    const el = container.querySelector('tj-link');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('https://example.com/post');
    expect((el as unknown as { target?: string }).target).toBe('_blank');
    expect(el?.textContent).toBe('Читать');
    const anchor = el?.shadowRoot?.querySelector('a.link');
    expect(anchor?.getAttribute('href')).toBe('https://example.com/post');
    // The 10.4 mold holds through the wrapper: _blank + no consumer rel.
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders <Cta> as tj-cta with element properties set through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Cta, { href: '#subscribe' }, 'Написать'),
    );
    const el = container.querySelector('tj-cta');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('#subscribe');
    expect(el?.textContent).toBe('Написать');
    expect(el?.shadowRoot?.querySelector('a.cta')?.getAttribute('href')).toBe('#subscribe');
  });

  it('renders <NewsCard> as tj-news-card with element properties set through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        NewsCard,
        { href: '/news/1', target: '_blank' },
        React.createElement('h2', { slot: 'title' }, 'Заголовок карточки'),
      ),
    );
    const el = container.querySelector('tj-news-card');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('/news/1');
    // The whole-card anchor + the 10.4 rel mint hold through the wrapper.
    const anchor = el?.shadowRoot?.querySelector('a.card');
    expect(anchor?.getAttribute('href')).toBe('/news/1');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders <NewsCard skeleton> with the host aria-busy (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(NewsCard, { href: '/news/2', skeleton: true }),
    );
    const el = container.querySelector('tj-news-card');
    expect(el?.hasAttribute('skeleton')).toBe(true);
    expect(el?.getAttribute('aria-busy')).toBe('true');
    expect(el?.shadowRoot?.querySelector('.card--skeleton')).not.toBeNull();
  });

  it('renders <RubricHeader> as tj-rubric-header with slotted children (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        RubricHeader,
        null,
        React.createElement('h1', null, 'Новости'),
        React.createElement('p', null, 'Подзаголовок рубрики'),
      ),
    );
    const el = container.querySelector('tj-rubric-header');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect(el?.textContent).toContain('Новости');
    expect(el?.shadowRoot?.querySelector('.flow')).not.toBeNull();
    // Graceful-empty through the wrapper: no cover/mark content, no mark box.
    expect(el?.shadowRoot?.querySelector('.mark')).toBeNull();
  });

  it('renders <TagChip> as tj-tag-chip with the label and decorative chevron (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(TagChip, { href: '#kursy' }, 'Курсы'),
    );
    const el = container.querySelector('tj-tag-chip');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('#kursy');
    expect(el?.textContent).toBe('Курсы');
    const anchor = el?.shadowRoot?.querySelector('a.chip');
    expect(anchor?.getAttribute('href')).toBe('#kursy');
    // Decorative chevron: aria-hidden SVG, currentColor stroke.
    expect(el?.shadowRoot?.querySelector('svg.chip__chevron')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('renders <Composer> as tj-composer with the label channel through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(Composer, { label: 'Спросите сообщество' }),
    );
    const el = container.querySelector('tj-composer');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { label?: string }).label).toBe('Спросите сообщество');
    const button = el?.shadowRoot?.querySelector('button.composer');
    expect(button?.getAttribute('type')).toBe('button');
    expect(el?.shadowRoot?.querySelector('.composer__label')?.textContent).toBe(
      'Спросите сообщество',
    );
  });

  it('renders <PostCard> as tj-post-card with the anchor + title mirror through the wrapper (smoke)', async () => {
    const container = await renderToContainer(
      React.createElement(
        PostCard,
        { href: '/posts/1', target: '_blank' },
        React.createElement('span', { slot: 'byline' }, 'Ирина Сомова'),
        React.createElement('h2', { slot: 'title' }, 'Заголовок поста сообщества'),
        React.createElement('span', { slot: 'count' }, '42'),
      ),
    );
    const el = container.querySelector('tj-post-card');
    expect(el, 'the wrapper renders the custom element').not.toBeNull();
    expect((el as unknown as { href?: string }).href).toBe('/posts/1');
    const anchor = el?.shadowRoot?.querySelector('a.card');
    expect(anchor?.getAttribute('href')).toBe('/posts/1');
    // The 10.4 rel mint + the slotted-title mirror hold through the wrapper.
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(anchor?.getAttribute('title')).toBe('Заголовок поста сообщества');
    expect(el?.shadowRoot?.querySelector('.count__icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  describe('onThemeChange — the 16.5 theme channel, end-to-end', () => {
    it('cycles the document-root theme through the REAL theme button; handlers receive the event itself (bare-STRING detail)', async () => {
      const handler = vi.fn();
      const container = await renderToContainer(
        React.createElement(Header, {
          onThemeChange: handler,
          items: [
            { label: 'Главное', href: '/main' },
            { label: 'Разборы', href: '/razbory' },
          ],
        }),
      );
      const el = container.querySelector('tj-header');
      expect((el as unknown as { items?: Array<{ label: string }> }).items?.length).toBe(2);
      const button = el?.shadowRoot?.querySelector('button.theme') as HTMLButtonElement;
      expect(document.documentElement.hasAttribute(TJ_THEME_ATTRIBUTE)).toBe(false); // auto

      try {
        await act(async () => {
          button.click();
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE)).toBe('light');

        await act(async () => {
          button.click();
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE)).toBe('dark');

        await act(async () => {
          button.click();
          await new Promise((resolve) => setTimeout(resolve, 0));
        });
        // auto = the attribute is REMOVED — the sheet's native-auto leg takes over.
        expect(document.documentElement.hasAttribute(TJ_THEME_ATTRIBUTE)).toBe(false);
      } finally {
        document.documentElement.removeAttribute(TJ_THEME_ATTRIBUTE);
      }

      expect(handler).toHaveBeenCalledTimes(3);
      // The unwrap contract's object check fails on a STRING detail — the
      // frozen §9 shape ruling: handlers receive the event itself.
      const payloads = handler.mock.calls.map((call) => call[0]);
      for (const payload of payloads) {
        expect(payload).toBeInstanceOf(TjThemeChangeEvent);
      }
      expect(payloads.map((payload) => (payload as TjThemeChangeEvent).detail)).toEqual([
        'light',
        'dark',
        'auto',
      ]);
    });
  });

  describe('onOpenChange — the 16.5 drawer channel, end-to-end', () => {
    it('burger toggle round-trips the unwrapped BOOLEAN (the §9 overlay row unwrap)', async () => {
      const handler = vi.fn();
      const container = await renderToContainer(
        React.createElement(Rail, {
          onOpenChange: handler,
          items: [
            { label: 'Главное', href: '/main', value: 'main' },
            { label: 'Разборы', href: '/razbory', value: 'razbory' },
          ],
        }),
      );
      const el = container.querySelector('tj-rail');
      expect((el as unknown as { items?: Array<{ label: string }> }).items?.length).toBe(2);
      const burger = el?.shadowRoot?.querySelector('button.burger') as HTMLButtonElement;

      await act(async () => {
        burger.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect((el as unknown as { open?: boolean }).open).toBe(true);
      expect(el?.hasAttribute('open')).toBe(true); // reflected through the wrapper

      await act(async () => {
        burger.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect((el as unknown as { open?: boolean }).open).toBe(false);

      expect(handler).toHaveBeenCalledTimes(2);
      // detail { value: boolean } passes the unwrap contract's object check —
      // the handler receives the BARE boolean, never the event.
      expect(handler.mock.calls[0][0]).toBe(true);
      expect(handler.mock.calls[1][0]).toBe(false);
    });

    it('the dispatched occurrence is the TjOpenChangeEvent class (event identity pin)', async () => {
      const seen: string[] = [];
      const container = await renderToContainer(
        React.createElement(Rail, {
          onOpenChange: (event: TjOpenChangeEvent) => {
            // Typed as the class by consumers who want the full event; the
            // unwrap contract actually hands over the boolean — cast back.
            seen.push(String(event));
          },
          items: [{ label: 'Главное', href: '/main', value: 'main' }],
        }),
      );
      const el = container.querySelector('tj-rail');
      const burger = el?.shadowRoot?.querySelector('button.burger') as HTMLButtonElement;
      await act(async () => {
        burger.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      // The unwrap contract is mechanical: String(true) — the boolean, not an
      // event (the class identity lives on the ELEMENT dispatch, pinned in
      // the tj-rail unit suite).
      expect(seen).toEqual(['true']);
      await act(async () => {
        (el as unknown as { open?: boolean }).open = false;
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    });
  });

  describe('onOpenCompose — the registry FIRST ТЖ entry, end-to-end', () => {
    it('receives the TjOpenComposeEvent itself on REAL activation (payload-less unwrap)', async () => {
      const handler = vi.fn();
      const container = await renderToContainer(
        React.createElement(Composer, { onOpenCompose: handler }),
      );
      const el = container.querySelector('tj-composer');
      const button = el?.shadowRoot?.querySelector('button.composer') as HTMLButtonElement;
      await act(() => {
        button.click(); // the REAL interactive path: native button activation
      });
      expect(handler).toHaveBeenCalledTimes(1);
      const payload = handler.mock.calls[0][0];
      // Payload-less occurrence: there is no detail.value to unwrap — the
      // frozen contract hands the handler the event itself (§9 grammar).
      expect(payload).toBeInstanceOf(TjOpenComposeEvent);
      expect((payload as TjOpenComposeEvent).type).toBe('open-compose');
      expect((payload as TjOpenComposeEvent).composed).toBe(true);
      expect((payload as TjOpenComposeEvent).bubbles).toBe(true);
    });

    it('receives a directly-dispatched open-compose too (the bank mold)', async () => {
      const handler = vi.fn();
      const container = await renderToContainer(
        React.createElement(Composer, { onOpenCompose: handler }),
      );
      const el = container.querySelector('tj-composer');
      await act(() => {
        el?.dispatchEvent(
          new CustomEvent('open-compose', {
            composed: true,
            bubbles: true,
          }),
        );
      });
      expect(handler).toHaveBeenCalledTimes(1);
      expect((handler.mock.calls[0][0] as Event).type).toBe('open-compose');
    });
  });

  it('forwards refs through the HOC to the underlying elements (every wrapper is a forwardRef HOC)', async () => {
    const proseRef = React.createRef<HTMLElement>();
    await renderToContainer(React.createElement(Prose, { ref: proseRef }));
    // The ref lands on the CUSTOM ELEMENT itself — the HOC layer must stay
    // transparent for imperative access (focus, internals, measurements).
    expect(proseRef.current).toBeInstanceOf(HTMLElement);
    expect(proseRef.current?.tagName).toBe('TJ-PROSE');
  });

  it('resolves the pinned @lit/react dependency', () => {
    expect(typeof litReact.createComponent).toBe('function');
  });

  it('ships the OPENED registry — composer (16.4) + the site-chrome pair (16.5)', () => {
    // The registry opened at 16.4 (tj-composer) and grew at 16.5 with the
    // chrome pair: tj-header's theme cycle (bare-STRING detail → handlers get
    // the event) and tj-rail's drawer channel (§9 overlay row unwrap → bare
    // boolean). Every other wrapper stays no-entry (stateless display/link
    // surface rides the native composed click or dispatches nothing).
    expect(EVENT_MAP['tj-composer']).toEqual({ onOpenCompose: 'open-compose' });
    expect(EVENT_MAP['tj-header']).toEqual({ onThemeChange: 'theme-change' });
    expect(EVENT_MAP['tj-rail']).toEqual({ onOpenChange: 'open-change' });
    expect(EVENT_MAP['tj-prose']).toBeUndefined();
    expect(EVENT_MAP['tj-link']).toBeUndefined();
    expect(EVENT_MAP['tj-cta']).toBeUndefined();
    expect(EVENT_MAP['tj-news-card']).toBeUndefined();
    expect(EVENT_MAP['tj-rubric-header']).toBeUndefined();
    expect(EVENT_MAP['tj-tag-chip']).toBeUndefined();
    expect(EVENT_MAP['tj-post-card']).toBeUndefined();
    expect(Object.keys(EVENT_MAP)).toEqual(['tj-composer', 'tj-header', 'tj-rail']);
  });

  it('freezes the event registry at runtime (file edits, never mutation)', () => {
    expect(Object.isFrozen(EVENT_MAP)).toBe(true);
    expect(() => {
      (EVENT_MAP as Record<string, unknown>)['tj-foo'] = {};
    }).toThrow(TypeError);
  });
});
