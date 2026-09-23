// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkServiceCard } from './service-card.js';
import { serviceCardStyles } from './service-card.css.js';

/**
 * tk-service-card unit tests (spec 3.8): the I/O matrix rows — icon
 * aria-hidden (the decorative container), link pinned bottom (structural
 * cssText pin of the flex column + margin-top:auto), and unknown-variant
 * clamping — plus prop/slot rendering, the flat tint surface, card
 * passivity, and the clamps/nulls survival row. No skeleton suite: the
 * spec rules skeletons exist only where EXPERIENCE names them (ArticleCard,
 * PromoCard) — this card is a static directory entry.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkServiceCard): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => serviceCardStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (pairing overrides precede the anatomy block). */
const ruleBody = (cssText: string, selector: string): string =>
  cssText.match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

/** The mobile media block — sliced from `@media` (robust to trailing anchors). */
const mobileBlock = (cssText: string): string => cssText.slice(cssText.indexOf('@media'));

type MountOptions = {
  props?: Partial<InstanceType<typeof TkServiceCard>>;
};

const mount = async ({ props }: MountOptions = {}): Promise<TkServiceCard> => {
  const el = new TkServiceCard();
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

describe('tk-service-card', () => {
  it('registers as tk-service-card exposing TkServiceCard', async () => {
    await customElements.whenDefined('tk-service-card');
    expect(customElements.get('tk-service-card')).toBe(TkServiceCard);
  });

  it('ICON ARIA-HIDDEN: the projected icon container announces nothing', async () => {
    const el = await mount({ props: { heading: 'РКО' } });
    const icon = el.shadowRoot?.querySelector('.card__icon');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('aria-hidden')).toBe('true', 'the component sets aria-hidden on the container');
    expect(icon?.querySelector('slot[name="icon"]')).not.toBeNull();
    const cssText = sheet();
    const iconRule = cssText.match(/\.card__icon\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(iconRule).toMatch(/width:\s*var\(--tk-space-48\)/, 'the ≥44px decorative floor');
    expect(iconRule).toMatch(/border-radius:\s*var\(--tk-service-card-icon-radius, var\(--tk-radius-md\)\)/);
  });

  it('LINK PINNED BOTTOM: flex column + margin-top:auto — the structural pin across desc lengths', () => {
    const cssText = sheet();
    const cardRule = cssText.match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).toMatch(/display:\s*flex/);
    expect(cardRule).toMatch(/flex-direction:\s*column/);
    const actions = ruleBody(cssText, '\\.card__actions');
    expect(actions).toMatch(/display:\s*flex/);
    expect(actions).toMatch(/margin-top:\s*auto/, 'the pin: the link rides the card bottom whatever the desc length');
    // AA on tints, OWN-GRAMMAR hook (review finding 5): the slotted tk-link
    // resolves --tk-color-link in its own shadow, so the ONLY delivery channel
    // is a re-scope — scoped to the ACTIONS ZONE (not the whole card) and
    // SOURCED from --tk-service-card-link (default the on-tint AA step;
    // blue-100 fails 4.5:1 on tints). Charcoal overrides the same hook to white.
    expect(actions).toMatch(
      /--tk-color-link:\s*var\(--tk-service-card-link, var\(--tk-color-link-on-tint\)\)/,
    );
    expect(cardRule).not.toMatch(/--tk-color-link/, 'the re-scope no longer swallows the whole card subtree');
    expect(cssText).toMatch(
      /:host\(\[variant='charcoal'\]\) \.card__actions\s*\{[^}]*--tk-color-link:\s*var\(--tk-service-card-link, var\(--tk-color-white\)\)/,
    );
  });

  it('PROPS RENDER: heading (h3, heading-5) and description (body-m) paint from props', async () => {
    const el = await mount({ props: { heading: 'Расчетный счет', description: 'Открытие за день' } });
    const heading = el.shadowRoot?.querySelector('.card__heading');
    expect(heading?.tagName).toBe('H3');
    expect(heading?.textContent?.trim()).toBe('Расчетный счет');
    const cssText = sheet();
    expect(ruleBody(cssText, '\\.card__heading')).toMatch(
      /font-size:\s*var\(--tk-text-heading-5-size\)/,
    );
    expect(ruleBody(cssText, '\\.card__description')).toMatch(
      /font-size:\s*var\(--tk-text-body-m-size\)/,
    );
  });

  it('SLOT OVERRIDE: slotted description replaces the prop content', async () => {
    const el = await mount({ props: { description: 'Проп' } });
    const slotted = document.createElement('span');
    slotted.setAttribute('slot', 'description');
    slotted.textContent = 'Слот';
    el.appendChild(slotted);
    await elementUpdated(el);
    // The slot projects the ASSIGNED nodes (assignedNodes is the truth — a
    // slot's own textContent stays its fallback, the tk-footer precedent).
    expect(
      el.shadowRoot?.querySelector('.card__description slot')?.assignedNodes({ flatten: true }),
    ).toContain(slotted);
    expect(el.shadowRoot?.querySelector('.card__description slot')?.getAttribute('name')).toBe('description');
  });

  it('SCALE: radius-xl + padding 24 through their hooks; flat tint surface', () => {
    const cssText = sheet();
    const cardRule = cssText.match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).toMatch(/border-radius:\s*var\(--tk-service-card-radius, var\(--tk-radius-xl\)\)/);
    expect(cardRule).toMatch(/padding:\s*var\(--tk-service-card-padding, var\(--tk-space-24\)\)/);
    expect(cssText).not.toMatch(/box-shadow/, 'tinted surfaces stay flat');
    // Tint variants consume their tokens; charcoal pairs white.
    expect(cssText).toMatch(
      /:host\(\[variant='mint'\]\) \.card\s*\{[^}]*var\(--tk-service-card-fill, var\(--tk-color-tint-mint\)\)/,
    );
    expect(cssText).toMatch(
      /:host\(\[variant='charcoal'\]\) \.card\s*\{[^}]*color:\s*var\(--tk-service-card-text, var\(--tk-color-white\)\)/,
    );
  });

  it('CARD IS PASSIVE: no click surface — no role, no tabindex, no channel events', async () => {
    const el = await mount({ props: { heading: 'Пассивная' } });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
    const card = el.shadowRoot?.querySelector('article.card');
    expect(card?.getAttribute('role')).toBeNull();
    expect(sheet().match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '').not.toMatch(/cursor/);
    const heard: string[] = [];
    for (const name of ['value-change', 'open-change', 'select', 'navigate']) {
      el.addEventListener(name, (event) => heard.push(event.type));
    }
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(heard).toEqual([]);
  });

  it('CLAMPS: unknown variant degrades to gray with the reflected attribute corrected', async () => {
    const el = await mount({ props: { variant: 'crimson' as TkServiceCard['variant'] } });
    expect(el.variant).toBe('gray');
    expect(el.getAttribute('variant')).toBe('gray');
    el.variant = 'beige';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('beige');
    el.remove();
  });

  it('NULLS survive: null heading/description render the shell without crashing', async () => {
    const el = await mount({
      props: { heading: null as unknown as string, description: null as unknown as string },
    });
    expect(el.shadowRoot?.querySelector('article.card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('.card__icon')).not.toBeNull();
    el.heading = 'Позднее';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Позднее');
  });

  it('NO SKELETON: the spec rules skeletons exist only where EXPERIENCE names them', async () => {
    const el = await mount();
    const skeleton = (el as unknown as { skeleton?: boolean }).skeleton;
    expect(skeleton).toBeUndefined();
    expect(el.shadowRoot?.querySelector('.sk')).toBeNull();
  });

  it('RESPONSIVE: <768px padding drops one spacing step (24 → 20)', () => {
    const mobile = mobileBlock(sheet());
    expect(mobile).toMatch(/@media \(max-width: 767px\)/);
    expect(mobile).toMatch(/padding:\s*var\(--tk-service-card-padding-mobile, var\(--tk-space-20\)\)/);
  });
});
