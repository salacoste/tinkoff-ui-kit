// @vitest-environment happy-dom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { TkFooter } from './footer.js';
import type { TkFooterColumn, TkFooterLink } from './footer.js';
import { footerStyles } from './footer.css.js';

/**
 * tk-footer unit tests (spec 3.5): the two footer I/O matrix rows — columns
 * render as ul/li lists with caps-s headers (empty → column omitted), legal
 * slot projection at body-xs — plus the landmark wiring (the shadow <footer>
 * = implicit contentinfo), the caps-transform placement (cssText pin), the
 * pill quick-links (the frozen footer-pill-link spec), and the
 * clamps/nulls row (incl. malformed-entry survival — null/shapeless
 * entries inside quickLinks and column links must not crash render).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkFooter): Promise<unknown> => el.updateComplete;

/** Console is spied file-wide: the malformed-entry clamp dev-warns. */
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
});

/** The reference directory (tbank.ru capture footer.png): 6 columns. */
const COLUMNS: TkFooterColumn[] = [
  {
    title: 'Банк',
    links: [
      { label: 'Кредиты', href: '/loans' },
      { label: 'Ипотека', href: '/mortgage' },
      { label: 'Вклады', href: '/deposits' },
    ],
  },
  {
    title: 'Инвестиции',
    links: [
      { label: 'Брокерский счёт', href: '/broker' },
      { label: 'Портфели', href: '/portfolios' },
    ],
  },
  {
    title: 'Страхование',
    links: [{ label: 'ОСАГО', href: '/osago' }],
  },
];

const QUICK: TkFooterLink[] = [
  { label: 'О банке', href: '/about' },
  { label: 'Новости', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkFooter>>;
  legal?: boolean;
};

const mount = async ({ props, legal = true }: MountOptions = {}): Promise<TkFooter> => {
  const el = new TkFooter();
  document.body.appendChild(el);
  if (legal) {
    const paragraph = document.createElement('p');
    paragraph.textContent = '© 2006—2026, АО «Банк» — не оферта.';
    el.appendChild(paragraph);
  }
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const columnsRendered = (el: TkFooter): HTMLElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLElement>('.column') ?? []),
];

const listsRendered = (el: TkFooter): HTMLUListElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLUListElement>('.column__list') ?? []),
];

const pillsRendered = (el: TkFooter): HTMLAnchorElement[] => [
  ...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.pill') ?? []),
];

describe('tk-footer', () => {
  it('registers as tk-footer exposing TkFooter', async () => {
    await customElements.whenDefined('tk-footer');
    expect(customElements.get('tk-footer')).toBe(TkFooter);
  });

  it('LANDMARK: the shadow tree renders a native <footer> (implicit contentinfo)', async () => {
    const el = await mount({ props: { columns: COLUMNS } });
    const footer = el.shadowRoot?.querySelector('footer.footer');
    expect(footer, 'the landmark is the shadow <footer> element').not.toBeNull();
    expect(footer?.getAttribute('role')).toBeNull(); // contentinfo is implicit — no role juggling
  });

  it('COLUMNS ARE LISTS: each column renders ul/li with plain anchors carrying hrefs', async () => {
    const el = await mount({ props: { columns: COLUMNS } });
    expect(columnsRendered(el)).toHaveLength(3);
    const lists = listsRendered(el);
    expect(lists).toHaveLength(3);
    for (const list of lists) {
      expect(list.tagName).toBe('UL');
      expect([...list.children].every((item) => item.tagName === 'LI')).toBe(true);
    }
    const links = [...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.column__link') ?? [])];
    expect(links).toHaveLength(6);
    expect(links[0]?.getAttribute('href')).toBe('/loans');
    expect(links[0]?.textContent?.trim()).toBe('Кредиты');
    // The headers name their sections.
    const headers = [
      ...(el.shadowRoot?.querySelectorAll<HTMLElement>('.column__header') ?? []),
    ];
    expect(headers.map((header) => header.textContent?.trim())).toEqual([
      'Банк',
      'Инвестиции',
      'Страхование',
    ]);
  });

  it('CAPS TRANSFORM AT RENDER: the header rule uppercases via CSS, on the caps-s token triple', () => {
    const cssText = footerStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const header = cssText.match(/\.column__header\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(header).toMatch(/text-transform:\s*uppercase/);
    expect(header).toMatch(/font-size:\s*var\(--tk-text-caps-s-size\)/);
    expect(header).toMatch(/font-weight:\s*var\(--tk-text-caps-s-weight\)/);
    expect(header).toMatch(/letter-spacing:\s*var\(--tk-text-caps-s-tracking\)/);
    // The AA override: text-secondary, never the probed ≈#8A8A8E (3.2:1).
    expect(header).toMatch(/color:\s*var\(--tk-footer-header, var\(--tk-color-text-secondary\)\)/);
  });

  it('PILL QUICK-LINKS: ink-300 self-fill, white text, radius-full, ≥44px targets (the frozen footer-pill-link spec)', async () => {
    const el = await mount({ props: { columns: COLUMNS, quickLinks: QUICK } });
    const pills = pillsRendered(el);
    expect(pills).toHaveLength(3);
    expect(pills[0]?.getAttribute('href')).toBe('/about');
    expect(pills[0]?.textContent?.trim()).toBe('О банке');
    expect(
      [...(el.shadowRoot?.querySelectorAll('.pills') ?? [])].every((list) => list.tagName === 'UL'),
      'the strip is a list too',
    ).toBe(true);

    const cssText = footerStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const pill = cssText.match(/\.pill\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(pill).toMatch(/background:\s*var\(--tk-footer-pill-fill, var\(--tk-color-ink-300\)\)/);
    expect(pill).toMatch(/color:\s*var\(--tk-footer-pill-text, var\(--tk-color-white\)\)/);
    expect(pill).toMatch(/border-radius:\s*var\(--tk-radius-full\)/);
    expect(pill).toMatch(/min-height:\s*44px/, 'the interactive-target floor');
    expect(cssText.match(/\.pill:hover\s*\{([^}]*)\}/)?.[1] ?? '').toMatch(
      /background:\s*var\(--tk-footer-pill-fill-hover, var\(--tk-color-ink-400\)\)/,
      'hover darkens one token step through the PAIRED hook, never a bare token past a custom fill',
    );
  });

  it('PHONE renders as the bold block; absent phone renders nothing', async () => {
    const el = await mount({ props: { columns: COLUMNS, phone: '8 800 333-33-33' } });
    const phone = el.shadowRoot?.querySelector('.phone');
    expect(phone?.textContent?.trim()).toBe('8 800 333-33-33');
    const cssText = footerStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const phoneRule = cssText.match(/\.phone\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(phoneRule).toMatch(/font-weight:\s*var\(--tk-text-body-l-bold-weight\)/);

    const bare = await mount({ props: { columns: COLUMNS } });
    expect(bare.shadowRoot?.querySelector('.phone')).toBeNull();
  });

  it('LEGAL SLOT: the default slot projects into the body-xs fine-print zone', async () => {
    const el = await mount({ props: { columns: COLUMNS } });
    const slot = el.shadowRoot?.querySelector('.legal slot');
    expect(slot).not.toBeNull();
    expect(
      slot?.assignedNodes({ flatten: true }).some((node) =>
        node.textContent?.includes('не оферта'),
      ),
    ).toBe(true);
    const cssText = footerStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const legal = cssText.match(/\.legal\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(legal).toMatch(/font-size:\s*var\(--tk-text-body-xs-size\)/);
    expect(legal).toMatch(/color:\s*var\(--tk-color-text-secondary\)/);
  });

  // --- The matrix's clamp row ---------------------------------------------------

  it('EMPTY → column omitted: title-less or link-less columns never render', async () => {
    const el = await mount({
      props: {
        columns: [
          ...COLUMNS,
          { title: 'Пусто', links: [] },
          { title: '', links: QUICK },
          { title: 'Только заголовок', links: [] },
        ],
      },
    });
    expect(columnsRendered(el)).toHaveLength(3); // only the complete columns
    expect(
      columnsRendered(el).map((column) => column.querySelector('.column__header')?.textContent?.trim()),
    ).toEqual(['Банк', 'Инвестиции', 'Страхование']);
  });

  it('nulls clamp: null columns/quickLinks + absent phone render the landmark + bottom zone without crashing', async () => {
    const el = await mount({
      props: {
        columns: null as unknown as TkFooterColumn[],
        quickLinks: null as unknown as TkFooterLink[],
      },
    });
    expect(el.shadowRoot?.querySelector('footer.footer')).not.toBeNull();
    expect(columnsRendered(el)).toHaveLength(0);
    expect(pillsRendered(el)).toHaveLength(0);
    expect(el.shadowRoot?.querySelector('.directory')).toBeNull();
    expect(el.shadowRoot?.querySelector('.pills')).toBeNull();
    // The legal zone still projects (the bottom section renders regardless).
    expect(el.shadowRoot?.querySelector('.legal slot')).not.toBeNull();

    // Data arriving later renders normally.
    el.columns = COLUMNS;
    el.quickLinks = QUICK;
    await elementUpdated(el);
    expect(columnsRendered(el)).toHaveLength(3);
    expect(pillsRendered(el)).toHaveLength(3);
  });

  it('malformed ENTRIES survive: nulls and shapeless entries inside quickLinks/column links drop with a dev warn — no crash', async () => {
    const el = await mount({
      props: {
        columns: [
          {
            title: 'Банк',
            links: [
              null,
              undefined,
              'не объект',
              { label: 'Только метка' },
              { href: '/no-label' },
              { label: '', href: '/empty-label' },
              { label: 'Кредиты', href: '/loans' },
            ] as unknown as TkFooterLink[],
          },
          { title: 'Мусор', links: [null] as unknown as TkFooterLink[] }, // link-less after the clamp → omitted
        ] as unknown as TkFooterColumn[],
        quickLinks: [
          null,
          42,
          { label: 'О банке' },
          { label: 'Работает', href: '#ok' },
        ] as unknown as TkFooterLink[],
      },
    });
    await elementUpdated(el); // the clamp schedules a follow-up update

    // Render survived; only the usable entries painted.
    expect(
      [...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.column__link') ?? [])].map(
        (link) => link.textContent?.trim(),
      ),
    ).toEqual(['Кредиты']);
    expect(columnsRendered(el)).toHaveLength(1); // the all-malformed column is omitted
    expect(
      [...(el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('.pill') ?? [])].map(
        (link) => link.textContent?.trim(),
      ),
    ).toEqual(['Работает']);
    expect(warnSpy).toHaveBeenCalled();

    // The clamped props converge: clean data arriving later renders in full.
    el.quickLinks = QUICK;
    el.columns = COLUMNS;
    await elementUpdated(el);
    expect(columnsRendered(el)).toHaveLength(3);
    expect(pillsRendered(el)).toHaveLength(3);
  });

  it('STATELESS: no channel events exist in the sheet — the element dispatches nothing', async () => {
    const el = await mount({ props: { columns: COLUMNS, quickLinks: QUICK } });
    const heard: string[] = [];
    for (const name of ['value-change', 'open-change', 'select', 'navigate']) {
      el.addEventListener(name, (event) => heard.push(event.type));
    }
    (el.shadowRoot?.querySelector('.column__link') as HTMLAnchorElement | null)?.click();
    (el.shadowRoot?.querySelector('.pill') as HTMLAnchorElement | null)?.click();
    expect(heard).toEqual([]);
  });
});
