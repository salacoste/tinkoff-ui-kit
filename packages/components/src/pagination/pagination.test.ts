// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TkPagination, windowedPages } from './pagination.js';

/**
 * tk-pagination unit tests (spec 6.2): the pagination half of the I/O &
 * edge-case matrix — page change (pill moves + focus on the NEWLY-ACTIVE
 * button), boundary prev (aria-disabled, no emit), the windowing algorithm
 * (parametrized table incl. the capture's own case, count ≤ 7, count = 1),
 * the load-more occurrence (page unchanged, focus stays), and the frozen §4
 * controlled strictness/release suite — plus the focusable-but-current
 * ruling and the no-wrap boundary model.
 */

const elementUpdated = (el: TkPagination): Promise<unknown> => el.updateComplete;

/** The capture's own catalog scale (active=1 renders 1 2 3 4 5 … 196). */
const STOCKS_COUNT = 196;

type MountOptions = {
  props?: Partial<InstanceType<typeof TkPagination>>;
  attributes?: Record<string, string>;
};

const mount = async ({ props, attributes }: MountOptions = {}): Promise<TkPagination> => {
  const el = new TkPagination();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const nav = (el: TkPagination): Element => {
  const node = el.shadowRoot?.querySelector('nav');
  expect(node, 'the nav landmark renders').not.toBeNull();
  return node as Element;
};

const pageButtons = (el: TkPagination): HTMLButtonElement[] =>
  [...(el.shadowRoot?.querySelectorAll('.page') ?? [])] as HTMLButtonElement[];

const activeButton = (el: TkPagination): HTMLButtonElement | undefined =>
  pageButtons(el).find((button) => button.classList.contains('page--active'));

const renderedPages = (el: TkPagination): string[] =>
  [...(el.shadowRoot?.querySelectorAll('.pages li') ?? [])].slice(1, -1).map((li) => {
    const button = li.querySelector('.page');
    return button ? (button.textContent ?? '').trim() : '…';
  });

const collectPages = (el: TkPagination): number[] => {
  const pages: number[] = [];
  el.addEventListener('page-change', (event: Event) => {
    pages.push((event as CustomEvent<{ value: number }>).detail.value);
  });
  return pages;
};

const collectLoadMore = (el: TkPagination): number[] => {
  const hits: number[] = [];
  el.addEventListener('load-more', () => hits.push(1));
  return hits;
};

describe('tk-pagination', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-pagination exposing TkPagination', async () => {
    await customElements.whenDefined('tk-pagination');
    expect(customElements.get('tk-pagination')).toBe(TkPagination);
  });

  // --- Matrix row 9 (first): the windowing algorithm, as a table ------------------

  describe('windowedPages (the capture\'s algorithm)', () => {
    it.each([
      { page: 1, count: 196, expected: [1, 2, 3, 4, 5, 'ellipsis', 196] }, // the capture's own render — the frozen block's pin
      { page: 2, count: 196, expected: [1, 2, 3, 4, 5, 'ellipsis', 196] }, // the shifted window keeps the full 1..5 lead
      { page: 3, count: 196, expected: [1, 2, 3, 4, 5, 'ellipsis', 196] }, // centered at 3 — still hugs 1, no leading ellipsis
      { page: 95, count: 196, expected: [1, 'ellipsis', 93, 94, 95, 96, 97, 'ellipsis', 196] }, // the matrix row verbatim
      { page: 195, count: 196, expected: [1, 'ellipsis', 192, 193, 194, 195, 196] }, // last − 1: the shifted window keeps a five-number tail
      { page: 196, count: 196, expected: [1, 'ellipsis', 192, 193, 194, 195, 196] }, // last
      { page: 4, count: 9, expected: [1, 2, 3, 4, 5, 6, 'ellipsis', 9] }, // window overlaps first — deduped
      { page: 1, count: 8, expected: [1, 2, 3, 4, 5, 'ellipsis', 8] }, // one past the full-row band
      { page: 1, count: 7, expected: [1, 2, 3, 4, 5, 6, 7] }, // count ≤ 7: everything, no ellipsis
      { page: 5, count: 7, expected: [1, 2, 3, 4, 5, 6, 7] },
      { page: 1, count: 2, expected: [1, 2] },
      { page: 1, count: 1, expected: [1] },
    ])('page=$page count=$count → $expected', ({ page, count, expected }) => {
      expect(windowedPages(page, count)).toEqual(expected);
    });
  });

  it('renders the nav landmark with the default name, centered row, chevrons and the active pill', async () => {
    const el = await mount({ props: { count: STOCKS_COUNT } });
    expect(nav(el).getAttribute('aria-label')).toBe('Пагинация');
    expect(nav(el).tagName).toBe('NAV');
    expect(renderedPages(el)).toEqual(['1', '2', '3', '4', '5', '…', '196']);

    const prev = el.shadowRoot?.querySelector('.step--prev');
    expect(prev?.getAttribute('aria-label')).toBe('Предыдущая страница');
    expect(prev?.getAttribute('aria-disabled'), 'page=1: prev is boundary-disabled').toBe('true');
    expect(el.shadowRoot?.querySelector('.step--next')?.getAttribute('aria-disabled')).toBeNull();

    const active = activeButton(el);
    expect(active?.textContent?.trim()).toBe('1');
    expect(active?.getAttribute('aria-current')).toBe('page'); // focusable-but-current ruling
    expect(el.shadowRoot?.querySelector('.ellipsis')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.shadowRoot?.querySelector('.load-more'), 'no bar without show-more').toBeNull();
  });

  // --- Matrix row 7: page change ----------------------------------------------------

  it('clicking «2» commits: page-change { value: 2 }, the active pill MOVES, focus lands on the new active button', async () => {
    const el = await mount({ props: { count: STOCKS_COUNT } });
    const pages = collectPages(el);
    const second = pageButtons(el)[1] as HTMLButtonElement; // «2»
    const focusSpy = vi.spyOn(second, 'focus');

    second.click();
    await elementUpdated(el);

    expect(pages).toEqual([2]);
    expect(activeButton(el)).toBe(second); // the pill moved onto «2»
    expect(second.getAttribute('aria-current')).toBe('page');
    expect(pageButtons(el)[0]?.getAttribute('aria-current')).toBeNull();
    expect(focusSpy).toHaveBeenCalled();
    expect(el.shadowRoot?.activeElement, 'focus on the NEWLY-ACTIVE button — never body').toBe(second);
    expect(el.page, 'uncontrolled: no controlled channel').toBeUndefined();
  });

  it('prev/next commit through the same landing; focus follows the newly-active number', async () => {
    const el = await mount({ props: { count: 12, defaultPage: 6 } });
    const pages = collectPages(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('6');

    const next = el.shadowRoot?.querySelector('.step--next') as HTMLButtonElement;
    next.click();
    await elementUpdated(el);
    expect(pages).toEqual([7]);
    expect(el.shadowRoot?.activeElement?.getAttribute('data-page')).toBe('7');

    const prev = el.shadowRoot?.querySelector('.step--prev') as HTMLButtonElement;
    prev.click();
    await elementUpdated(el);
    expect(pages).toEqual([7, 6]);
    expect(el.shadowRoot?.activeElement?.getAttribute('data-page')).toBe('6');
  });

  it('clicking the ACTIVE page is a no-op (focusable-but-current — nothing emits)', async () => {
    const el = await mount({ props: { count: STOCKS_COUNT } });
    const pages = collectPages(el);
    (activeButton(el) as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(pages).toEqual([]);
    expect(activeButton(el)?.textContent?.trim()).toBe('1');
  });

  // --- Matrix row 8: boundaries (wrap is FORBIDDEN) -----------------------------------

  it('page=1: prev is aria-disabled/text-muted and NEVER emits; next works', async () => {
    const el = await mount({ props: { count: 10, defaultPage: 1 } });
    const pages = collectPages(el);
    const prev = el.shadowRoot?.querySelector('.step--prev') as HTMLButtonElement;

    prev.click();
    prev.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await elementUpdated(el);
    expect(pages).toEqual([]); // no wrap, no emit
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    expect(activeButton(el)?.textContent?.trim()).toBe('1');

    (el.shadowRoot?.querySelector('.step--next') as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(pages).toEqual([2]);
  });

  it('page=count: next is boundary-disabled; prev works', async () => {
    const el = await mount({ props: { count: 10, defaultPage: 10 } });
    const pages = collectPages(el);
    const next = el.shadowRoot?.querySelector('.step--next') as HTMLButtonElement;
    expect(next.getAttribute('aria-disabled')).toBe('true');

    next.click();
    await elementUpdated(el);
    expect(pages).toEqual([]);

    (el.shadowRoot?.querySelector('.step--prev') as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(pages).toEqual([9]);
  });

  // --- Matrix row 10: the load-more bar ---------------------------------------------

  it('show-more renders the full-width bar: load-more emits, page UNCHANGED, focus stays on the bar', async () => {
    const el = await mount({ props: { count: STOCKS_COUNT, showMore: true, defaultPage: 5 } });
    const bar = el.shadowRoot?.querySelector('.load-more') as HTMLButtonElement;
    expect(bar.textContent?.trim()).toBe('Показать еще');
    expect(el.shadowRoot?.querySelector('.pages'), 'the numbers row renders below the bar').not.toBeNull();

    const pages = collectPages(el);
    const more = collectLoadMore(el);
    bar.focus();
    expect(el.shadowRoot?.activeElement).toBe(bar);
    bar.click();
    await elementUpdated(el);

    expect(more).toHaveLength(1);
    expect(pages).toEqual([]); // the page does NOT change
    expect(activeButton(el)?.textContent?.trim()).toBe('5');
    expect(el.shadowRoot?.activeElement, 'focus stays on the bar').toBe(bar);
  });

  it('more-label overrides the bar text; the occurrence crosses the shadow boundary (composed, bubbles)', async () => {
    const el = await mount({
      props: { count: 12, showMore: true, moreLabel: 'Показать ещё акции' },
    });
    const bar = el.shadowRoot?.querySelector('.load-more') as HTMLButtonElement;
    expect(bar.textContent?.trim()).toBe('Показать ещё акции');

    const seen: number[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('load-more', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push(1);
    });
    bar.click();
    await elementUpdated(el);
    expect(seen).toHaveLength(1);
    expect(composedHeard).toEqual([true]);
  });

  it('page-change crosses the shadow boundary with the unwrapped number payload', async () => {
    const el = await mount({ props: { count: 12 } });
    const seen: number[] = [];
    el.parentElement?.addEventListener('page-change', (event: Event) => {
      seen.push((event as CustomEvent<{ value: number }>).detail.value);
    });
    (pageButtons(el)[2] as HTMLButtonElement).click();
    await elementUpdated(el);
    expect(seen).toEqual([3]);
  });

  // --- Matrix row 12: count = 1 and the clamps ---------------------------------------

  it('count=1: the numbers row is hidden entirely — the nav is load-more only, or nothing at all', async () => {
    const bar = await mount({ props: { count: 1, showMore: true } });
    expect(bar.shadowRoot?.querySelector('.pages')).toBeNull();
    expect(bar.shadowRoot?.querySelector('.load-more')).not.toBeNull();

    const bare = await mount({ props: { count: 1 } });
    expect(bare.shadowRoot?.querySelector('nav'), 'no empty landmark').toBeNull();
    expect(bare.renderRoot.childNodes.length === 0 || bare.shadowRoot?.children.length === 0).toBe(true);
  });

  it('count clamps to ≥ 1 (§2); page clamps into [1, count] on BOTH channels', async () => {
    const zero = await mount({ props: { count: 0 } });
    expect(zero.count).toBe(1);
    expect(zero.shadowRoot?.querySelector('nav')).toBeNull(); // degenerate but stable

    const nan = await mount({ props: { count: Number.NaN } });
    expect(nan.count).toBe(1);

    const high = await mount({ props: { count: 10, page: 99 } });
    await elementUpdated(high);
    expect(high.page, 'the controlled channel carries the corrected page').toBe(10);
    expect(activeButton(high)?.textContent?.trim()).toBe('10');

    const low = await mount({ props: { count: 10, page: 0 } });
    await elementUpdated(low);
    expect(low.page).toBe(1);

    const seed = await mount({ attributes: { 'default-page': '99' }, props: { count: 10 } });
    expect(activeButton(seed)?.textContent?.trim()).toBe('10'); // uncontrolled seed clamps at read time

    const shrunk = await mount({ props: { count: 10, page: 8 } });
    shrunk.count = 4; // the count shrinks under a valid page
    await elementUpdated(shrunk);
    expect(shrunk.page).toBe(4);
    expect(activeButton(shrunk)?.textContent?.trim()).toBe('4');
  });

  it('non-number page values coerce to their numeric form (§2 chain)', async () => {
    const el = await mount({ props: { count: 10 } });
    el.page = '3' as unknown as number;
    await elementUpdated(el);
    expect(el.page).toBe(3);
    expect(activeButton(el)?.textContent?.trim()).toBe('3');
  });

  it('boolean props reflect; page/defaultPage never do (§2)', async () => {
    const el = await mount({ props: { count: 12, showMore: true } });
    expect(el.hasAttribute('show-more')).toBe(true);
    el.showMore = false;
    await elementUpdated(el);
    expect(el.hasAttribute('show-more')).toBe(false);
    el.page = 3;
    await elementUpdated(el);
    expect(el.hasAttribute('page')).toBe(false);
    expect(el.hasAttribute('default-page')).toBe(false);
  });

  // --- Matrix row 11: the frozen §4 suite (number mirror of tk-select's) ---------------

  it('controlled page: strict render — a press emits, nothing mutates locally', async () => {
    const el = await mount({ props: { count: 12, page: 2 } });
    const pages = collectPages(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('2');

    (pageButtons(el)[0] as HTMLButtonElement).click(); // «1»
    await elementUpdated(el);

    expect(pages).toEqual([1]);
    expect(el.page, 'strict: the channel is untouched by the press').toBe(2);
    expect(activeButton(el)?.textContent?.trim(), 'renders exactly the consumer page until it answers').toBe('2');

    el.page = 1;
    await elementUpdated(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('1');
    expect(el.shadowRoot?.activeElement?.getAttribute('data-page'), 'the pending focus lands when the consumer answers').toBe('1');
  });

  it('releasing page switches to uncontrolled seeded from the last controlled page', async () => {
    const el = await mount({ props: { count: 12, page: 2 } });
    el.page = 5;
    await elementUpdated(el);
    el.page = undefined; // release
    await elementUpdated(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('5');
    expect(el.page).toBeUndefined();

    const pages = collectPages(el);
    (pageButtons(el)[0] as HTMLButtonElement).click(); // «1»
    await elementUpdated(el);
    expect(pages).toEqual([1]);
    expect(activeButton(el)?.textContent?.trim()).toBe('1');
  });

  it('a controlled page set again after release resumes strict rendering', async () => {
    const el = await mount({ props: { count: 12, page: 2 } });
    el.page = undefined;
    await elementUpdated(el);
    el.page = 7;
    await elementUpdated(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('7');
    el.requestUpdate();
    await elementUpdated(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('7');
  });

  it('defaultPage seeds the uncontrolled state; mutated after connect it is ignored; page wins when both are set', async () => {
    const el = await mount({ attributes: { 'default-page': '4' }, props: { count: 12 } });
    expect(activeButton(el)?.textContent?.trim()).toBe('4');
    el.defaultPage = 9;
    await elementUpdated(el);
    expect(activeButton(el)?.textContent?.trim()).toBe('4');

    const both = await mount({ attributes: { 'default-page': '4' }, props: { count: 12, page: 6 } });
    expect(activeButton(both)?.textContent?.trim()).toBe('6'); // controlled at first paint
  });

  it('the nav label is overridable', async () => {
    const el = await mount({ attributes: { label: 'Страницы каталога' }, props: { count: 12 } });
    expect(nav(el).getAttribute('aria-label')).toBe('Страницы каталога');
  });
});
