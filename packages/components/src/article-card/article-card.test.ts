// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkArticleCard } from './article-card.js';
import { articleCardStyles } from './article-card.css.js';

/**
 * tk-article-card unit tests (spec 3.9): the I/O matrix rows — the whole-
 * card stitch (structural cssText pin of `.card__link::after` coverage on
 * the relative card), the SINGLE TAB STOP (exactly one focusable: the
 * link), the 2-line clamp, unknown-variant clamping, and the skeleton
 * state — plus prop/slot rendering and the clamps/nulls survival row.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkArticleCard): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => articleCardStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (pairing overrides precede the anatomy block). */
const ruleBody = (cssText: string, selector: string): string =>
  cssText.match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

/** The mobile media block — sliced from `@media` (robust to trailing anchors). */
const mobileBlock = (cssText: string): string => cssText.slice(cssText.indexOf('@media'));

type MountOptions = {
  props?: Partial<InstanceType<typeof TkArticleCard>>;
};

const mount = async ({ props }: MountOptions = {}): Promise<TkArticleCard> => {
  const el = new TkArticleCard();
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

describe('tk-article-card', () => {
  it('registers as tk-article-card exposing TkArticleCard', async () => {
    await customElements.whenDefined('tk-article-card');
    expect(customElements.get('tk-article-card')).toBe(TkArticleCard);
  });

  it('STITCH: .card__link::after covers the whole card on the relative card (structural pin)', () => {
    const cssText = sheet();
    const cardRule = cssText.match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).toMatch(/position:\s*relative/, 'the card is the stitching context');
    const stitch = cssText.match(/\.card__link::after\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(stitch).toMatch(/content:\s*''/);
    expect(stitch).toMatch(/position:\s*absolute/);
    expect(stitch).toMatch(/inset:\s*0/, 'full-card coverage — clicks anywhere land on the anchor');
  });

  it('SINGLE TAB STOP: exactly one focusable element in the shadow tree — the link', async () => {
    const el = await mount({
      props: { heading: 'Заголовок', description: 'Описание', href: '/article' },
    });
    const focusables = el.shadowRoot?.querySelectorAll('a, button, [tabindex], input, select, textarea');
    expect(focusables).toHaveLength(1);
    const link = focusables?.[0] as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/article');
    expect(link.textContent?.trim()).toBe('Читать', 'the reference label is the default');
    // The host adds no surface of its own.
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('LINE-CLAMP: the title clamps to 2 lines (webkit prefix + standard)', () => {
    const cssText = sheet();
    const headingRule = cssText.match(/\.card__heading\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(headingRule).toMatch(/display:\s*-webkit-box/);
    expect(headingRule).toMatch(/-webkit-box-orient:\s*vertical/);
    expect(headingRule).toMatch(/-webkit-line-clamp:\s*2/);
    expect(headingRule).toMatch(/(^|\s)line-clamp:\s*2/);
    expect(headingRule).toMatch(/overflow:\s*hidden/);
  });

  it('PROPS RENDER: heading (h3, heading-6) and description (body-m) paint from props', async () => {
    const el = await mount({ props: { heading: 'Как устроен кэшбэк', description: 'Разбираем механику' } });
    const heading = el.shadowRoot?.querySelector('.card__heading');
    expect(heading?.tagName).toBe('H3');
    expect(heading?.textContent?.trim()).toBe('Как устроен кэшбэк');
    const cssText = sheet();
    expect(ruleBody(cssText, '\\.card__heading')).toMatch(
      /font-size:\s*var\(--tk-text-heading-6-size\)/,
    );
    expect(ruleBody(cssText, '\\.card__description')).toMatch(
      /font-size:\s*var\(--tk-text-body-m-size\)/,
    );
  });

  it('LINK LABEL is overridable; the link consumes the semantic token with the underline affordance', async () => {
    const el = await mount({ props: { href: '/a', linkLabel: 'Подробнее' } });
    expect(el.shadowRoot?.querySelector('.card__link')?.textContent?.trim()).toBe('Подробнее');
    const cssText = sheet();
    const linkRule = ruleBody(cssText, '\\.card__link');
    expect(linkRule).toMatch(
      /color:\s*var\(--tk-article-card-link, var\(--tk-color-link-on-tint\)\)/,
      'the on-tint AA step — blue-100 fails 4.5:1 on the tint surfaces',
    );
    expect(linkRule).toMatch(/text-decoration:\s*underline/);
    expect(linkRule).toMatch(/text-decoration-color:\s*transparent/);
    expect(cssText).toMatch(/\.card__link:hover,\s*\.card__link:focus-visible\s*\{[^}]*currentColor/);
  });

  it('SLOT OVERRIDE: slotted heading replaces the prop content', async () => {
    const el = await mount({ props: { heading: 'Проп' } });
    const slotted = document.createElement('span');
    slotted.setAttribute('slot', 'heading');
    slotted.textContent = 'Слот';
    el.appendChild(slotted);
    await elementUpdated(el);
    // The slot projects the ASSIGNED nodes (assignedNodes is the truth — a
    // slot's own textContent stays its fallback, the tk-footer precedent).
    expect(
      el.shadowRoot?.querySelector('.card__heading slot')?.assignedNodes({ flatten: true }),
    ).toContain(slotted);
    expect(el.shadowRoot?.querySelector('.card__heading slot')?.getAttribute('name')).toBe('heading');
  });

  it('SCALE: radius-xl + padding 32 through their hooks; flat tint surface; charcoal pairs white', () => {
    const cssText = sheet();
    const cardRule = cssText.match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).toMatch(/border-radius:\s*var\(--tk-article-card-radius, var\(--tk-radius-xl\)\)/);
    expect(cardRule).toMatch(/padding:\s*var\(--tk-article-card-padding, var\(--tk-space-32\)\)/);
    expect(cssText).not.toMatch(/box-shadow/, 'tinted surfaces stay flat');
    expect(cssText).toMatch(
      /:host\(\[variant='mint'\]\) \.card\s*\{[^}]*var\(--tk-article-card-fill, var\(--tk-color-tint-mint\)\)/,
    );
    expect(cssText).toMatch(
      /:host\(\[variant='charcoal'\]\) \.card\s*\{[^}]*color:\s*var\(--tk-article-card-text, var\(--tk-color-white\)\)/,
    );
  });

  it('CLAMPS: unknown variant degrades to gray with the reflected attribute corrected', async () => {
    const el = await mount({ props: { variant: 'magenta' as TkArticleCard['variant'] } });
    expect(el.variant).toBe('gray');
    expect(el.getAttribute('variant')).toBe('gray');
    el.variant = 'bluegray';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('bluegray');
    el.remove();
  });

  it('NULLS survive: null heading/description render the shell + link without crashing', async () => {
    const el = await mount({
      props: { heading: null as unknown as string, description: null as unknown as string, href: '/x' },
    });
    expect(el.shadowRoot?.querySelector('article.card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('.card__link')).not.toBeNull();
    el.heading = 'Позднее';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Позднее');
  });

  it('SKELETON: quiet-rail blocks replace content incl. the link; static render', async () => {
    const el = await mount({ props: { heading: 'Содержимое', href: '/x', skeleton: true } });
    expect(el.hasAttribute('skeleton')).toBe(true);
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('.card__link')).toBeNull('the skeleton replaces the link too');
    expect(el.shadowRoot?.querySelector('article.card')?.getAttribute('aria-busy')).toBe('true');
    const blocks = [...(el.shadowRoot?.querySelectorAll<HTMLElement>('.sk') ?? [])];
    expect(blocks.map((block) => block.className)).toEqual([
      'sk sk--title',
      'sk sk--title',
      'sk sk--line',
      'sk sk--line',
      'sk sk--link',
    ]);
    for (const block of blocks) {
      expect(block.getAttribute('aria-hidden')).toBe('true');
    }
    const cssText = sheet();
    expect(cssText).toMatch(/\.sk\s*\{[^}]*background:\s*var\(--tk-color-border-default\)/);
    expect(cssText).not.toMatch(/@keyframes|animation:/, 'static skeleton (reduced-motion-safe)');
    el.skeleton = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Содержимое');
    expect(el.shadowRoot?.querySelector('.card__link')).not.toBeNull();
  });

  it('RESPONSIVE: <768px padding drops one spacing step', () => {
    const mobile = mobileBlock(sheet());
    expect(mobile).toMatch(/@media \(max-width: 767px\)/);
    expect(mobile).toMatch(/padding:\s*var\(--tk-article-card-padding-mobile, var\(--tk-space-24\)\)/);
  });
});
