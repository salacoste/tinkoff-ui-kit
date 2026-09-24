// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { TK_STORE_BADGES_DEFAULT_EMPTY_COPY, TkStoreBadges } from './store-badges.js';
import { storeBadgesStyles } from './store-badges.css.js';

/**
 * tk-store-badges unit tests (spec 7.3): the badges half of the I/O &
 * edge-case matrix — the 3-pill uniform render (icon right, labels), the
 * label-only degrade at the same size class, the external-link contract
 * (noopener + _blank), and the zero-state copy slot — plus the §2
 * null-clamps, the no-motion pin (the never-list), and the structural
 * size-class pins.
 */

const elementUpdated = (el: TkStoreBadges): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => storeBadgesStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (the promo-card ruleBody mold). */
const ruleBody = (selector: string): string =>
  sheet().match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

const BADGES_3 = [
  { href: 'https://apps.apple.com/us/app/id123456789', label: 'App Store', iconSrc: 'app-store.svg', iconAlt: 'App Store' },
  { href: 'https://www.ru-store.ru/download', label: 'RuStore' },
  { href: 'https://galaxy.store/id', label: 'Samsung Store' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkStoreBadges>>;
  attributes?: Record<string, string>;
  slotChildren?: Node[];
};

const mount = async ({ props, attributes, slotChildren }: MountOptions = {}): Promise<TkStoreBadges> => {
  const el = new TkStoreBadges();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  for (const child of slotChildren ?? []) el.appendChild(child);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const pills = (el: TkStoreBadges): HTMLAnchorElement[] =>
  [...(el.shadowRoot?.querySelectorAll('a.badge') ?? [])] as HTMLAnchorElement[];

describe('tk-store-badges', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-store-badges exposing TkStoreBadges', async () => {
    await customElements.whenDefined('tk-store-badges');
    expect(customElements.get('tk-store-badges')).toBe(TkStoreBadges);
  });

  // --- Matrix row 6: 3 badges with icons — uniform pills, icon right, labels ---------

  it('renders a 3-pill list: labels first, the icon pinned right, at the uniform size class', async () => {
    const el = await mount({ props: { badges: BADGES_3 } });
    const row = el.shadowRoot?.querySelector('ul.badges');
    expect(row?.children).toHaveLength(3);

    const [first, second, third] = pills(el);
    expect(first?.querySelector('.badge__label')?.textContent?.trim()).toBe('App Store');
    expect(second?.querySelector('.badge__label')?.textContent?.trim()).toBe('RuStore');
    expect(third?.querySelector('.badge__label')?.textContent?.trim()).toBe('Samsung Store');

    // The mark is the LAST child of the pill — label left, icon right.
    const icon = first?.querySelector('.badge__icon');
    expect(icon?.getAttribute('src')).toBe('app-store.svg');
    expect(icon?.nextElementSibling).toBeNull();
    expect(ruleBody('.badge__icon')).toMatch(/margin-inline-start:\s*auto/); // pinned to the far edge

    // The uniform size class + the probe gap/radius, as structural pins.
    const badge = ruleBody('.badge');
    expect(badge).toMatch(/min-width:\s*324px/);
    expect(badge).toMatch(/min-height:\s*80px/);
    expect(badge).toMatch(/border-radius:\s*var\(--tk-store-badges-radius,\s*var\(--tk-radius-xl\)\)/); // arc-fit ≈24
    expect(ruleBody('.badges')).toMatch(/gap:\s*var\(--tk-space-64\)/);
  });

  // --- Matrix row 7: the label-only degrade -------------------------------------------

  it('iconSrc omitted renders the label-only pill at the SAME size class', async () => {
    const el = await mount({ props: { badges: [{ href: 'https://example.com', label: 'RuStore' }] } });
    const [pill] = pills(el);
    expect(pill?.querySelector('.badge__icon')).toBeNull();
    expect(pill?.querySelector('.badge__label')?.textContent?.trim()).toBe('RuStore');
    // The size class lives on the PILL (min-width/min-height), not on the
    // icon — the shape is identical with or without the mark.
    expect(ruleBody('.badge')).toMatch(/min-width:\s*324px/);
    expect(ruleBody('.badge')).toMatch(/min-height:\s*80px/);
  });

  it('icon is DECORATIVE by default (alt=""); iconAlt overrides — accname stays the visible label alone', async () => {
    const el = await mount({
      props: {
        badges: [
          { href: 'https://example.com', label: 'RuStore', iconSrc: 'x.svg' },
          { href: 'https://example.com', label: 'App Store', iconSrc: 'y.svg', iconAlt: 'Загрузите в App Store' },
        ],
      },
    });
    // The pill's visible span already names the link; a default alt copying
    // the label would double the accname («RuStore RuStore») — lens W2.
    expect(pills(el)[0]?.querySelector('.badge__icon')?.getAttribute('alt')).toBe('');
    expect(pills(el)[1]?.querySelector('.badge__icon')?.getAttribute('alt')).toBe('Загрузите в App Store');
  });

  // --- Matrix row 8: the external-link contract -----------------------------------------

  it('every pill is an external link: href carried, target=_blank, rel=noopener noreferrer', async () => {
    const el = await mount({ props: { badges: BADGES_3 } });
    for (const pill of pills(el)) {
      expect(pill.tagName).toBe('A');
      expect(pill.getAttribute('href')).toMatch(/^https:\/\//);
      expect(pill.getAttribute('target')).toBe('_blank');
      expect(pill.getAttribute('rel')).toBe('noopener noreferrer');
    }
    // Keyboard: a native anchor — Enter activates it; nothing intercepts keys.
    const [first] = pills(el);
    expect((first as HTMLAnchorElement).tabIndex).toBe(0);
  });

  it('the pill carries the unified 2px focus ring (§8) and the 80px hit target rides the pill', () => {
    const ring = sheet().match(/\.badge:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(ring).toMatch(/outline:\s*2px solid var\(--tk-color-focus-ring\)/);
    expect(ring).toMatch(/outline-offset:\s*2px/);
    expect(ruleBody('.badge')).toMatch(/min-height:\s*80px/); // ≥ the 44px floor, whole-surface hit
  });

  // --- Matrix row 9: the zero-state copy slot ----------------------------------------------

  it('badges=[] renders the documented zero-state copy slot (never blank §2); empty-slot content overrides', async () => {
    const el = await mount();
    const empty = el.shadowRoot?.querySelector('.badges--empty');
    expect(empty?.textContent?.trim()).toBe(TK_STORE_BADGES_DEFAULT_EMPTY_COPY);
    expect(el.shadowRoot?.querySelector('ul.badges')).toBeNull();

    const override = document.createElement('p');
    override.setAttribute('slot', 'empty');
    override.textContent = 'Скоро здесь будут ссылки на магазины';
    const custom = await mount({ slotChildren: [override] });
    // A slot's OWN textContent stays its fallback — assignedNodes is the
    // truth (the tk-footer/promo-card precedent).
    const slot = custom.shadowRoot?.querySelector('.badges--empty slot');
    expect(slot?.assignedNodes({ flatten: true })).toContain(override);
  });

  it('null badges clamp to the zero state without throwing (§2)', async () => {
    const el = await mount({ props: { badges: null as unknown as TkStoreBadges['badges'] } });
    expect(el.shadowRoot?.querySelector('.badges--empty')).not.toBeNull();
  });

  it('zero-state copy is CENTERED — the empty rule overrides the ul flex row (lens W1 pin)', async () => {
    // .badges--empty rides the same ul flex row; without the justify override
    // the slotted copy sits at flex-start and text-align:center never fires
    // (display:contents children are flex items, not inline text).
    expect(ruleBody('.badges--empty')).toMatch(/justify-content:\s*center/);
  });

  // --- Guards -------------------------------------------------------------------------------------

  it('NO-MOTION pin: the never-list — zero transition/animation declarations; hover is an instant fill step', () => {
    expect(sheet()).not.toMatch(/\btransition\b/);
    expect(sheet()).not.toMatch(/\banimation\b/);
    expect(sheet().match(/\.badge:hover\s*\{([^}]*)\}/)?.[1] ?? '').toMatch(
      /background:\s*var\(--tk-store-badges-fill-hover,\s*var\(--tk-color-surface-field\)\)/,
    );
  });

  it('HIDDEN guard: the sheet sets :host display, so [hidden] is enforced explicitly', () => {
    const cssText = sheet();
    expect(cssText).toMatch(/:host\s*\{[^}]*display:\s*block/);
    expect(cssText).toMatch(/:host\(\[hidden\]\)\s*\{[^}]*display:\s*none/);
  });
});
