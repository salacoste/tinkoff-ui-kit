// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkFeatureCard } from './feature-card.js';
import { featureCardStyles } from './feature-card.css.js';

/**
 * tk-feature-card unit tests (spec 3.7): the I/O matrix rows — editorial
 * variant wiring (the grid bleed + white pairing), the 2-up scale heights
 * (min-height 320), CTA-not-card passivity, unknown-variant clamping, and
 * the skeleton state — plus prop/slot rendering and the clamps/nulls
 * survival row.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkFeatureCard): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => featureCardStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (pairing overrides precede the anatomy block). */
const ruleBody = (cssText: string, selector: string): string =>
  cssText.match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

/** The mobile media block — sliced from `@media` (robust to trailing anchors). */
const mobileBlock = (cssText: string): string => cssText.slice(cssText.indexOf('@media'));

type MountOptions = {
  props?: Partial<InstanceType<typeof TkFeatureCard>>;
};

const mount = async ({ props }: MountOptions = {}): Promise<TkFeatureCard> => {
  const el = new TkFeatureCard();
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

describe('tk-feature-card', () => {
  it('registers as tk-feature-card exposing TkFeatureCard', async () => {
    await customElements.whenDefined('tk-feature-card');
    expect(customElements.get('tk-feature-card')).toBe(TkFeatureCard);
  });

  it('PROPS RENDER: heading (h3, heading-4) and description (body-m) paint from props', async () => {
    const el = await mount({ props: { heading: 'Т-Ж — журнал', description: 'Истории каждый день' } });
    const heading = el.shadowRoot?.querySelector('.card__heading');
    expect(heading?.tagName).toBe('H3');
    expect(heading?.textContent?.trim()).toBe('Т-Ж — журнал');
    const cssText = sheet();
    const headingRule = ruleBody(cssText, '\\.card__heading');
    expect(headingRule).toMatch(/font-size:\s*var\(--tk-text-heading-4-size\)/);
    expect(ruleBody(cssText, '\\.card__description')).toMatch(
      /font-size:\s*var\(--tk-text-body-m-size\)/,
    );
  });

  it('EDITORIAL WIRING: the variant flips the card to the bleed grid with the WHITE pairing', async () => {
    const el = await mount({ props: { variant: 'editorial', heading: 'Платинум' } });
    expect(el.getAttribute('variant')).toBe('editorial');
    const cssText = sheet();
    const editorial = cssText.match(/:host\(\[variant='editorial'\]\) \.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(editorial).toMatch(/display:\s*grid/, 'the bleed approach is the grid pick');
    expect(editorial).toMatch(
      /grid-template-columns:\s*minmax\(0, 1fr\)/,
      'SINGLE column until art is slotted (review finding 2 — no empty 0.95fr track)',
    );
    expect(editorial).toMatch(/padding:\s*0/, 'card padding collapses onto the body column');
    expect(editorial).toMatch(/overflow:\s*hidden/, 'the radius clip crops the bleed');
    expect(editorial).toMatch(
      /background:\s*var\(--tk-feature-card-fill, var\(--tk-color-tint-charcoal\)\)/,
      'editorial consumes the charcoal tint',
    );
    expect(editorial).toMatch(/color:\s*var\(--tk-feature-card-text, var\(--tk-color-white\)\)/, 'white pairing');
    expect(cssText).toMatch(
      /:host\(\[variant='editorial'\]\) \.card__description\s*\{[^}]*color:\s*var\(--tk-feature-card-text-muted, var\(--tk-color-white\)\)/,
    );
    // The bleed grid OPENS with slotted art: the two-column template rides
    // the data-has-art attribute.
    expect(cssText).toMatch(
      /:host\(\[variant='editorial'\]\[data-has-art\]\) \.card\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.05fr\) minmax\(0, 0\.95fr\)/,
    );
    // The art column bleeds right: column 2, stretched to the edge, overflow-clipped.
    const art = cssText.match(/:host\(\[variant='editorial'\]\) \.card__art\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(art).toMatch(/grid-column:\s*2/);
    expect(art).toMatch(/align-self:\s*stretch/);
    expect(art).toMatch(/overflow:\s*hidden/);
    const body = cssText.match(/:host\(\[variant='editorial'\]\) \.card__body\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(body).toMatch(/grid-column:\s*1/);
    expect(body).toMatch(/padding:\s*var\(--tk-feature-card-padding, var\(--tk-space-32\)\)/);
  });

  it('EDITORIAL CTA pair stays white-with-ink in BOTH themes (review finding 1): the hook-pair re-scope inside the actions zone', () => {
    const cssText = sheet();
    const cta = cssText.match(/:host\(\[variant='editorial'\]\) \.card__actions\s*\{([^}]*)\}/)?.[1] ?? '';
    // The slotted tk-button secondary paints its pill from --tk-color-surface-base
    // (button.css.ts) — the token the dark layer remaps to #1A1A1A,
    // near-invisible on the theme-invariant charcoal. Re-scoped to the hook.
    expect(cta).toMatch(/--tk-color-surface-base:\s*var\(--tk-feature-card-cta-fill, var\(--tk-color-white\)\)/);
    expect(cta).toMatch(/--tk-color-text-primary:\s*var\(--tk-feature-card-cta-text, var\(--tk-color-ink-300\)\)/);
    // Scoped to the actions zone ONLY.
    expect(cssText.match(/--tk-color-surface-base:/g)).toHaveLength(1);
    expect(cssText.match(/--tk-color-text-primary:/g)).toHaveLength(1);
  });

  it('ART ZONE COLLAPSES without slotted art (review finding 2): attribute-driven, single-column editorial', async () => {
    const el = await mount({ props: { variant: 'editorial', heading: 'Т-Ж' } });
    expect(el.hasAttribute('data-has-art')).toBe(false);
    const cssText = sheet();
    // Base zone: display:none, NO margin — the heading sits at the padding
    // register on the plain (non-editorial) variants too.
    const baseArt = ruleBody(cssText, '\\.card__art');
    expect(baseArt).toMatch(/display:\s*none/);
    expect(baseArt).not.toMatch(/margin/);
    const expanded = cssText.match(/:host\(\[data-has-art\]\) \.card__art\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(expanded).toMatch(/display:\s*flex/);
    expect(expanded).toMatch(/margin-bottom:\s*var\(--tk-space-24\)/);

    // Slotted art flips the attribute; on editorial the bleed grid opens.
    const art = document.createElement('div');
    art.setAttribute('slot', 'art');
    el.appendChild(art);
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(true);
    art.remove();
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(false);
    el.remove();
  });

  it('HEIGHTS: the 2-up scale carries min-height 320 through its hook', () => {
    const cardRule = sheet().match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).toMatch(/min-height:\s*var\(--tk-feature-card-min-height, 320px\)/);
    expect(cardRule).toMatch(/height:\s*100%/, 'the card fills the stretched 2-up grid cell');
  });

  it('TINT VARIANTS: pastels consume their tint tokens at the dark pairing', () => {
    const cssText = sheet();
    for (const variant of ['bluegray', 'mint', 'beige'] as const) {
      expect(cssText).toMatch(
        new RegExp(`:host\\(\\[variant='${variant}'\\]\\) \\.card\\s*\\{[^}]*var\\(--tk-feature-card-fill, var\\(--tk-color-tint-${variant}\\)\\)`),
      );
    }
    expect(cssText).toMatch(/\.card\s*\{[^}]*color:\s*var\(--tk-feature-card-text, var\(--tk-color-text-primary\)\)/);
    expect(cssText).not.toMatch(/box-shadow/, 'tinted surfaces stay flat');
  });

  it('CARD IS PASSIVE: no click surface — no role, no tabindex, no pointer cursor', async () => {
    const el = await mount({ props: { heading: 'Пассивная' } });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
    const card = el.shadowRoot?.querySelector('article.card');
    expect(card?.getAttribute('role')).toBeNull();
    expect(card?.hasAttribute('tabindex')).toBe(false);
    const cardRule = sheet().match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).not.toMatch(/cursor/);
    const heard: string[] = [];
    for (const name of ['value-change', 'open-change', 'select', 'navigate']) {
      el.addEventListener(name, (event) => heard.push(event.type));
    }
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(heard).toEqual([]);
  });

  it('CTA ZONE pins bottom-start (the banner register)', () => {
    const actions = ruleBody(sheet(), '\\.card__actions');
    expect(actions).toMatch(/display:\s*flex/);
    expect(actions).toMatch(/justify-content:\s*flex-start/);
    expect(actions).toMatch(/margin-top:\s*auto/);
  });

  it('LAZY ENFORCEMENT: slotted art imgs get loading=lazy decoding=async', async () => {
    const el = await mount();
    const img = document.createElement('img');
    img.setAttribute('slot', 'art');
    img.src = 'art.png';
    el.appendChild(img);
    await elementUpdated(el);
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    el.remove();
  });

  it('CLAMPS: unknown variant degrades to gray with the reflected attribute corrected', async () => {
    const el = await mount({ props: { variant: 'neon' as TkFeatureCard['variant'] } });
    expect(el.variant).toBe('gray');
    expect(el.getAttribute('variant')).toBe('gray');
    el.variant = 'editorial';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('editorial');
    el.remove();
  });

  it('NULLS survive: null heading/description render the shell without crashing', async () => {
    const el = await mount({
      props: { heading: null as unknown as string, description: null as unknown as string },
    });
    expect(el.shadowRoot?.querySelector('article.card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    el.description = 'Позднее';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__description')?.textContent?.trim()).toBe('Позднее');
  });

  it('SKELETON: gray-200 blocks replace content; static under the skeleton attribute', async () => {
    const el = await mount({ props: { heading: 'Содержимое', skeleton: true } });
    expect(el.hasAttribute('skeleton')).toBe(true);
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('slot[name="actions"]')).toBeNull();
    expect(el.shadowRoot?.querySelector('article.card')?.getAttribute('aria-busy')).toBe('true');
    const blocks = [...(el.shadowRoot?.querySelectorAll<HTMLElement>('.sk') ?? [])];
    expect(blocks.map((block) => block.className)).toEqual([
      'sk sk--heading',
      'sk sk--line',
      'sk sk--line',
      'sk sk--cta',
    ]);
    for (const block of blocks) {
      expect(block.getAttribute('aria-hidden')).toBe('true');
    }
    const cssText = sheet();
    expect(cssText).toMatch(/\.sk\s*\{[^}]*background:\s*var\(--tk-color-gray-200\)/);
    expect(cssText).not.toMatch(/@keyframes|animation:/, 'static skeleton (reduced-motion-safe)');
    el.skeleton = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Содержимое');
  });

  it('RESPONSIVE: <768px padding drops one spacing step (body column on editorial too)', () => {
    const mobile = mobileBlock(sheet());
    expect(mobile).toMatch(/@media \(max-width: 767px\)/);
    expect(mobile).toMatch(/padding:\s*var\(--tk-feature-card-padding-mobile, var\(--tk-space-24\)\)/);
    expect(mobile).toMatch(
      /:host\(\[variant='editorial'\]\) \.card__body\s*\{[^}]*var\(--tk-feature-card-padding-mobile, var\(--tk-space-24\)\)/,
    );
  });
});
