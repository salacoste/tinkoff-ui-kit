// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { TkQrBlock } from './qr-block.js';
import { qrBlockStyles } from './qr-block.css.js';
import { TkTabs } from '../tabs/tabs.js';

/**
 * tk-qr-block unit tests (spec 7.3): the QR half of the I/O & edge-case
 * matrix — the 2-tab render (the tablist IS the composed v1 tk-tabs: copy +
 * QR tile per panel), the keyboard contract riding tk-tabs VERBATIM, the
 * no-note panel, and the auto-composed alt text — plus the compose-verbatim
 * pin (zero tk-tabs hook overrides), the title prop, the empty degrade, and
 * the guards.
 */

const elementUpdated = (el: TkQrBlock | TkTabs): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => qrBlockStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (the promo-card ruleBody mold). */
const ruleBody = (selector: string): string =>
  sheet().match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

const TABS_2 = [
  {
    label: 'Android 9.0 и выше',
    qrSrc: 'qr-android-modern.svg',
    note: 'Наведите камеру телефона на QR-код, чтобы скачать приложение',
  },
  { label: 'Android ниже 9.0', qrSrc: 'qr-android-legacy.svg' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkQrBlock>>;
  attributes?: Record<string, string>;
  slotChildren?: Node[];
};

const mount = async ({ props, attributes, slotChildren }: MountOptions = {}): Promise<TkQrBlock> => {
  const el = new TkQrBlock();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  for (const child of slotChildren ?? []) el.appendChild(child);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  const inner = tablist(el);
  if (inner) await elementUpdated(inner);
  return el;
};

const tablist = (el: TkQrBlock): TkTabs | null =>
  (el.shadowRoot?.querySelector('tk-tabs') as TkTabs | null) ?? null;

const panels = (el: TkQrBlock): Element[] =>
  [...((tablist(el)?.querySelectorAll('.panel') ?? []) as NodeListOf<Element>)];

describe('tk-qr-block', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-qr-block exposing TkQrBlock', async () => {
    await customElements.whenDefined('tk-qr-block');
    expect(customElements.get('tk-qr-block')).toBe(TkQrBlock);
  });

  // --- Matrix row 10: 2 tabs — the composed tablist with copy + QR tile each ---------

  it('renders the v1 tk-tabs ELEMENT ITSELF with index-keyed values and both labels', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    const inner = tablist(el);
    expect(inner, 'the tablist is the composed element, not a reimplementation').toBeInstanceOf(TkTabs);
    expect(inner?.tabs.map((tab) => tab.label)).toEqual(['Android 9.0 и выше', 'Android ниже 9.0']);
    expect(inner?.tabs.map((tab) => tab.value)).toEqual(['0', '1']);
    expect(inner?.shadowRoot?.querySelectorAll('[role="tab"]').length).toBe(2);
  });

  it('each tab carries a panel in tk-tabs\' named slot: note copy + the QR tile', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    expect(panels(el)).toHaveLength(2);

    const [first, second] = panels(el);
    expect(first?.getAttribute('slot')).toBe('tab-0');
    expect(first?.querySelector('.panel__note')?.textContent?.trim()).toBe(
      'Наведите камеру телефона на QR-код, чтобы скачать приложение',
    );
    expect(first?.querySelector('.panel__tile .panel__qr')?.getAttribute('src')).toBe('qr-android-modern.svg');
    expect(second?.querySelector('.panel__tile .panel__qr')?.getAttribute('src')).toBe('qr-android-legacy.svg');
    // CAPTURE-ORDER pin: the tile comes FIRST, the note UNDER it (the note is
    // the tile's caption — probe rows: tile ≈101-291, note text ≈303-323).
    const tile = first?.querySelector('.panel__tile');
    const note = first?.querySelector('.panel__note');
    expect(tile && note ? tile.compareDocumentPosition(note) : 0).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  // --- Matrix row 11: the keyboard contract rides tk-tabs VERBATIM ----------------------

  it('arrows/Home/Tab behave as the v1 tk-tabs contract: automatic activation, roving tabindex, no interception', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    const inner = tablist(el) as TkTabs;
    const buttons = [...(inner.shadowRoot?.querySelectorAll('.tab') ?? [])] as HTMLButtonElement[];

    expect(buttons.map((button) => button.getAttribute('tabindex'))).toEqual(['0', '-1']); // roving
    expect(buttons[0]?.getAttribute('aria-selected')).toBe('true');

    buttons[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    await elementUpdated(inner);
    expect(buttons[1].getAttribute('aria-selected')).toBe('true'); // automatic activation
    expect(inner.shadowRoot?.activeElement).toBe(buttons[1]);
    expect(inner.value, 'uncontrolled like the reference switcher').toBeUndefined();
  });

  it('tk-tabs\' OWN value-change crosses both boundaries composed — this class dispatches nothing of its own', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    const heard: Array<{ value: string; composed: boolean }> = [];
    el.addEventListener('value-change', (event: Event) => {
      const custom = event as CustomEvent<{ value: string }>;
      heard.push({ value: custom.detail.value, composed: custom.composed });
    });

    const inner = tablist(el) as TkTabs;
    ([...(inner.shadowRoot?.querySelectorAll('.tab') ?? [])] as HTMLButtonElement[])[1].click();
    await elementUpdated(inner);

    expect(heard).toEqual([{ value: '1', composed: true }]); // the composed element's event verbatim
  });

  it('COMPOSE-VERBATIM pin: the sheet touches only geometry — zero --tk-tabs-* hook overrides', () => {
    expect(sheet()).not.toMatch(/--tk-tabs-/);
    const geometry = ruleBody('tk-tabs');
    expect(geometry, 'the tk-tabs geometry rule exists').not.toBe('');
    expect(geometry).toMatch(/width:\s*fit-content/);
    expect(geometry).toMatch(/margin-inline:\s*auto/);
    // The panel swap motion is tk-tabs' own — this block's sheet adds none.
    expect(sheet()).not.toMatch(/\banimation\b/);
    expect(sheet()).not.toMatch(/\btransition\b/);
  });

  // --- Matrix row 12: the no-note panel ----------------------------------------------------

  it('note omitted: the panel is the QR tile only — no note line, no note rhythm', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    const [, second] = panels(el);
    expect(second?.querySelector('.panel__note')).toBeNull();
    expect(second?.querySelector('.panel__tile')).not.toBeNull();
    // The tile→note margin is adjacent-sibling gated — it never fires note-less.
    expect(sheet()).toMatch(/\.panel__tile \+ \.panel__note\s*\{/);
    // AA pin: the note ink is the secondary tier (4.99:1) — the capture's
    // ~#C5C5C5 caption core is BELOW AA and the muted tier fails it live
    // (the visual round's axe run flagged text-muted at 2.8:1).
    expect(sheet()).toMatch(/color: var\(--tk-qr-block-note, var\(--tk-color-text-secondary\)\)/);
  });

  // --- Matrix row 13: the auto-composed alt ---------------------------------------------------

  it('the QR image announces «QR-код для {label}» (auto-composed, monochrome consumer art)', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    const images = panels(el).map((panel) => panel.querySelector('.panel__qr'));
    expect(images[0]?.getAttribute('alt')).toBe('QR-код для Android 9.0 и выше');
    expect(images[1]?.getAttribute('alt')).toBe('QR-код для Android ниже 9.0');
    expect(images[0]?.getAttribute('loading')).toBe('lazy');
  });

  // --- Props, degrade & guards ------------------------------------------------------------

  it('title renders as the block h2 (heading-4 pin) when set; nothing when unset', async () => {
    const titled = await mount({ props: { tabs: TABS_2, title: 'Вариант 2. Отсканируйте QR-код' } });
    expect(titled.shadowRoot?.querySelector('h2.qr-block__title')?.textContent?.trim()).toBe(
      'Вариант 2. Отсканируйте QR-код',
    );
    expect(sheet()).toMatch(/font-size:\s*var\(--tk-text-heading-4-size\)/);

    const bare = await mount({ props: { tabs: TABS_2 } });
    expect(bare.shadowRoot?.querySelector('.qr-block__title')).toBeNull();
  });

  it('null tabs and tabs=[] clamp to the title-only degrade (a zero-tab strip is no strip)', async () => {
    for (const tabs of [[], null as unknown as TkQrBlock['tabs']]) {
      const el = await mount({ props: { title: 'Отсканируйте QR-код', tabs } });
      expect(el.shadowRoot?.querySelector('tk-tabs')).toBeNull();
      expect(el.shadowRoot?.querySelector('.qr-block__title')).not.toBeNull();
    }
  });

  it('HIDDEN guard: the sheet sets :host display, so [hidden] is enforced explicitly', () => {
    const cssText = sheet();
    expect(cssText).toMatch(/:host\s*\{[^}]*display:\s*block/);
    expect(cssText).toMatch(/:host\(\[hidden\]\)\s*\{[^}]*display:\s*none/);
  });

  // --- page-copy slot (story 10.2 — the stepper subtitle presence mold) ---

  const copyP = (): HTMLParagraphElement => {
    const p = document.createElement('p');
    p.setAttribute('slot', 'page-copy');
    p.textContent = 'Переходите по ссылкам только с этой страницы';
    return p;
  };

  it('page-copy empty: wrapper ABSENT, data-has-page-copy off, the bare hidden slot keeps listening', async () => {
    const el = await mount({ props: { tabs: TABS_2, title: 'Отсканируйте QR-код' } });
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).toBeNull();
    expect(el.hasAttribute('data-has-page-copy')).toBe(false);
    const slot = el.shadowRoot?.querySelector('slot[name="page-copy"]');
    expect(slot).not.toBeNull();
    expect(slot?.hasAttribute('hidden')).toBe(true);
    // ADJACENCY REGRESSION (pixel-caught in the 10.2 visual round): the
    // listening slot must sit OUTSIDE the rhythm pairs — the title's next
    // sibling is the tablist, so `.qr-block__title + tk-tabs` keeps firing
    // exactly as pre-10.2.
    const title = el.shadowRoot?.querySelector('.qr-block__title');
    expect(title?.nextElementSibling?.tagName.toLowerCase()).toBe('tk-tabs');
  });

  it('page-copy slotted statically: the wrapper renders between title and tablist with the node assigned', async () => {
    const p = copyP();
    const el = await mount({
      props: { tabs: TABS_2, title: 'Вариант 2. Отсканируйте QR-код' },
      slotChildren: [p],
    });
    const wrapper = el.shadowRoot?.querySelector('.qr-block__copy');
    expect(wrapper, 'the wrapper renders around the slot').not.toBeNull();
    expect(wrapper?.querySelector('slot[name="page-copy"]')?.hasAttribute('hidden')).toBe(false);
    expect(wrapper?.querySelector('slot[name="page-copy"]')?.assignedNodes({ flatten: true })).toContain(p);
    expect(el.hasAttribute('data-has-page-copy')).toBe(true);
    // Document order: title → copy → tablist (probe (b)'s composition).
    const title = el.shadowRoot?.querySelector('.qr-block__title');
    const tabs = el.shadowRoot?.querySelector('tk-tabs');
    expect(
      title && wrapper ? wrapper.compareDocumentPosition(title) : 0,
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(
      tabs && wrapper ? tabs.compareDocumentPosition(wrapper) : 0,
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);

    p.remove();
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0)); // happy-dom delivers slotchange async
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).toBeNull();
    expect(el.hasAttribute('data-has-page-copy')).toBe(false);
  });

  it('page-copy arriving late: slotchange flips the wrapper in', async () => {
    const el = await mount({ props: { tabs: TABS_2 } });
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).toBeNull();
    const p = copyP();
    el.appendChild(p);
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).not.toBeNull();
    expect(el.hasAttribute('data-has-page-copy')).toBe(true);
  });

  it('page-copy with title unset: renders alone — the copy is independent of the title', async () => {
    const el = await mount({ props: { tabs: TABS_2 }, slotChildren: [copyP()] });
    expect(el.shadowRoot?.querySelector('.qr-block__title')).toBeNull();
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).not.toBeNull();
  });

  it('page-copy + tabs=[]: renders alongside the zero-tab degrade (independent surfaces)', async () => {
    const el = await mount({ props: { title: 'Отсканируйте QR-код' }, slotChildren: [copyP()] });
    expect(el.shadowRoot?.querySelector('tk-tabs')).toBeNull();
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.qr-block__title')).not.toBeNull();
  });

  it('page-copy rhythm pins: body-m centered on WHITE with the §6 hook; space-16 after title; space-48 before the tablist', () => {
    const copy = ruleBody('\\.qr-block__copy');
    expect(copy, 'the .qr-block__copy rule exists').not.toBe('');
    expect(copy).toMatch(/margin:\s*0/);
    expect(copy).toMatch(/text-align:\s*center/);
    expect(copy).toMatch(/font-size:\s*var\(--tk-text-body-m-size\)/);
    expect(copy).toMatch(/font-weight:\s*var\(--tk-text-body-m-weight\)/);
    expect(copy).toMatch(/color:\s*var\(--tk-qr-block-copy, var\(--tk-color-text-primary\)\)/);
    // Probe (b): title→copy ≈16.5px box-corrected → space-16 (Δ0.5).
    expect(sheet()).toMatch(
      /\.qr-block__title \+ \.qr-block__copy\s*\{[^}]*margin-block-start:\s*var\(--tk-space-16\)/,
    );
    // Probe (b): copy→tabs ≈48px → space-48 (Δ0) — the adjacent-sibling rule
    // supersedes the title-only composition's space-40 once copy intervenes.
    expect(sheet()).toMatch(
      /\.qr-block__copy \+ tk-tabs\s*\{[^}]*margin-block-start:\s*var\(--tk-space-48\)/,
    );
  });

  it('DOM identity: without page-copy the render carries no wrapper and no data-has-page-copy (default-off)', async () => {
    const el = await mount({ props: { tabs: TABS_2, title: 'Отсканируйте QR-код' } });
    expect(el.hasAttribute('data-has-page-copy')).toBe(false);
    expect(el.shadowRoot?.querySelector('.qr-block__copy')).toBeNull();
  });
});
