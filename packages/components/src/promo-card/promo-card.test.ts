// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkPromoCard } from './promo-card.js';
import { promoCardStyles } from './promo-card.css.js';

/**
 * tk-promo-card unit tests (spec 3.6): the I/O matrix rows — tint pairing
 * (per-tint token consumption; charcoal → white), card click passivity
 * (no card-level click surface — the CTA carries the action), art-slot
 * lazy enforcement (the slotchange technique on slotted imgs, direct and
 * nested), unknown-variant clamping, and the skeleton state — plus prop
 * rendering, slot overrides, and the clamps/nulls survival row.
 *
 * Story 10.3 adds the art-mode rows: the reflect/clamp mold on artMode,
 * the CSS-ONLY byte-stability proof (the DOM never changes with the mode),
 * the gated bleed rule set (zone geometry, actions overlay + re-scope
 * pair, skeleton mirror, <768 chain), and the data-has-art toggle under
 * bleed.
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TkPromoCard): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => promoCardStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * One rule's body, matched at LINE START so `:host([variant=…]) .card__x`
 * pairing overrides never shadow the anatomy rule they suffix (the charcoal
 * rules precede the anatomy block in the sheet).
 */
const ruleBody = (cssText: string, selector: string): string =>
  cssText.match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

/** The mobile media block — sliced from `@media` (robust to trailing anchors). */
const mobileBlock = (cssText: string): string => cssText.slice(cssText.indexOf('@media'));

type MountOptions = {
  props?: Partial<InstanceType<typeof TkPromoCard>>;
};

const mount = async ({ props }: MountOptions = {}): Promise<TkPromoCard> => {
  const el = new TkPromoCard();
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

describe('tk-promo-card', () => {
  it('registers as tk-promo-card exposing TkPromoCard', async () => {
    await customElements.whenDefined('tk-promo-card');
    expect(customElements.get('tk-promo-card')).toBe(TkPromoCard);
  });

  it('PROPS RENDER: heading (h3, heading-5) and description (body-m) paint from props', async () => {
    const el = await mount({ props: { heading: 'Платинум', description: 'Премиальная карта' } });
    const heading = el.shadowRoot?.querySelector('.card__heading');
    expect(heading?.tagName).toBe('H3');
    expect(heading?.textContent?.trim()).toBe('Платинум');
    const description = el.shadowRoot?.querySelector('.card__description');
    expect(description?.tagName).toBe('P');
    expect(description?.textContent?.trim()).toBe('Премиальная карта');

    const cssText = sheet();
    const headingRule = ruleBody(cssText, '\\.card__heading');
    expect(headingRule).toMatch(/font-size:\s*var\(--tk-text-heading-5-size\)/);
    expect(headingRule).toMatch(/font-family:\s*var\(--tk-font-heading\)/);
    const descriptionRule = ruleBody(cssText, '\\.card__description');
    expect(descriptionRule).toMatch(/font-size:\s*var\(--tk-text-body-m-size\)/);
    expect(descriptionRule).toMatch(/color:\s*var\(--tk-promo-card-text-muted, var\(--tk-color-text-secondary\)\)/);
  });

  it('ABSENT PROPS render nothing: no empty heading/description elements', async () => {
    const el = await mount();
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('.card__description')).toBeNull();
    // The anatomy still renders: the passive card shell + slots.
    expect(el.shadowRoot?.querySelector('article.card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('slot[name="actions"]')).not.toBeNull();
  });

  it('SLOTS OVERRIDE PROPS: slotted heading/description replace the prop content', async () => {
    const el = await mount({ props: { heading: 'Проп', description: 'Проп-описание' } });
    const slotted = document.createElement('span');
    slotted.setAttribute('slot', 'heading');
    slotted.textContent = 'Слот';
    el.appendChild(slotted);
    await elementUpdated(el); // slotchange → requestUpdate
    const heading = el.shadowRoot?.querySelector('.card__heading');
    expect(heading).not.toBeNull();
    // The slot projects the ASSIGNED nodes (a slot's own textContent stays
    // its fallback — assignedNodes is the truth, the tk-footer precedent).
    expect(heading?.querySelector('slot')?.assignedNodes({ flatten: true })).toContain(slotted);
    expect(heading?.querySelector('slot')?.getAttribute('name')).toBe('heading');
    expect(slotted.textContent).toBe('Слот');
  });

  it('TINT PAIRING: pastel variants consume their tint tokens at text-primary; charcoal pairs white', async () => {
    const el = await mount({ props: { variant: 'mint' } });
    expect(el.getAttribute('variant')).toBe('mint');
    const cssText = sheet();
    expect(cssText).toMatch(
      /:host\(\[variant='mint'\]\) \.card\s*\{[^}]*background:\s*var\(--tk-promo-card-fill, var\(--tk-color-tint-mint\)\)/,
    );
    expect(cssText).toMatch(
      /:host\(\[variant='bluegray'\]\) \.card\s*\{[^}]*background:\s*var\(--tk-promo-card-fill, var\(--tk-color-tint-bluegray\)\)/,
    );
    expect(cssText).toMatch(
      /:host\(\[variant='beige'\]\) \.card\s*\{[^}]*background:\s*var\(--tk-promo-card-fill, var\(--tk-color-tint-beige\)\)/,
    );
    // Charcoal: white text pairing via token consumption.
    expect(cssText).toMatch(
      /:host\(\[variant='charcoal'\]\) \.card\s*\{[^}]*color:\s*var\(--tk-promo-card-text, var\(--tk-color-white\)\)/,
    );
    expect(cssText).toMatch(
      /:host\(\[variant='charcoal'\]\) \.card__description\s*\{[^}]*color:\s*var\(--tk-promo-card-text-muted, var\(--tk-color-white\)\)/,
    );
    // Pastels keep the dark pairing from the base rule — no white rules leak.
    expect(cssText).toMatch(/\.card\s*\{[^}]*color:\s*var\(--tk-promo-card-text, var\(--tk-color-text-primary\)\)/);
    // FLAT: tinted surfaces carry no shadow anywhere in the sheet.
    expect(cssText).not.toMatch(/box-shadow/);
    el.remove();
  });

  it('CARD IS PASSIVE: no click surface — no role, no tabindex, no pointer cursor', async () => {
    const el = await mount({ props: { heading: 'Пассивная' } });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
    const card = el.shadowRoot?.querySelector('article.card');
    expect(card?.getAttribute('role')).toBeNull();
    expect(card?.hasAttribute('tabindex')).toBe(false);
    // The sheet paints no pointer cursor on the card (content stays selectable).
    const cardRule = sheet().match(/\.card\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(cardRule).not.toMatch(/cursor/);
    // A card-body click bubbles as a plain DOM click — no kit interception,
    // no dispatched channel events.
    const heard: string[] = [];
    for (const name of ['value-change', 'open-change', 'select', 'navigate']) {
      el.addEventListener(name, (event) => heard.push(event.type));
    }
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(heard).toEqual([]);
  });

  it('CTA ZONE pins bottom-center: flex + margin-top auto (varying desc lengths)', () => {
    const cssText = sheet();
    const actions = ruleBody(cssText, '\\.card__actions');
    expect(actions).toMatch(/display:\s*flex/);
    expect(actions).toMatch(/justify-content:\s*center/);
    expect(actions).toMatch(/margin-top:\s*auto/);
    // The register centers its text too (the reference's promo cards center
    // heading/description — the side-by-side vision-pass finding).
    expect(ruleBody(cssText, '\\.card__heading')).toMatch(/text-align:\s*center/);
    expect(ruleBody(cssText, '\\.card__description')).toMatch(/text-align:\s*center/);
  });

  it('CHARCOAL CTA pair stays white-with-ink in BOTH themes (review finding 1): surface-base/text-primary re-scoped to the hook pair inside the actions zone', () => {
    const cssText = sheet();
    const cta = cssText.match(/:host\(\[variant='charcoal'\]\) \.card__actions\s*\{([^}]*)\}/)?.[1] ?? '';
    // The slotted tk-button secondary paints its pill from --tk-color-surface-base
    // (button.css.ts) — the token the dark layer remaps to #1A1A1A. The charcoal
    // rule re-scopes it to the dedicated hook (default white) so the pill stays
    // white on the theme-invariant charcoal in BOTH themes, still themable.
    expect(cta).toMatch(/--tk-color-surface-base:\s*var\(--tk-promo-card-cta-fill, var\(--tk-color-white\)\)/);
    // The pill LABEL pairs: the button consumes --tk-color-text-primary (dark:
    // white) — re-scoped to the cta-text hook (default ink-300, 9.41:1 on white).
    expect(cta).toMatch(/--tk-color-text-primary:\s*var\(--tk-promo-card-cta-text, var\(--tk-color-ink-300\)\)/);
    // Scoped to ACTIONS ZONES only — charcoal and the 10.3 bleed overlay
    // declare the IDENTICAL pair (2 rules, same values, no conflict); no
    // other rule re-scopes the kit-wide semantics.
    expect(cssText.match(/--tk-color-surface-base:/g)).toHaveLength(2);
    expect(cssText.match(/--tk-color-text-primary:/g)).toHaveLength(2);
  });

  it('LAZY ENFORCEMENT: slotted art imgs get loading=lazy decoding=async (slotchange technique)', async () => {
    const el = await mount({ props: { heading: 'Арт' } });
    const img = document.createElement('img');
    img.setAttribute('slot', 'art');
    img.src = 'art.png';
    el.appendChild(img);
    await elementUpdated(el); // slotchange fires on assignment
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    el.remove();
  });

  it('LAZY ENFORCEMENT reaches imgs NESTED inside slotted wrappers', async () => {
    const el = await mount();
    const wrapper = document.createElement('picture');
    wrapper.setAttribute('slot', 'art');
    const img = document.createElement('img');
    img.src = 'nested.png';
    wrapper.appendChild(img);
    el.appendChild(wrapper);
    await elementUpdated(el);
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    el.remove();
  });

  it('ART ZONE COLLAPSES without slotted art (review finding 2): no stray margin — the heading sits at the padding register', async () => {
    const el = await mount({ props: { heading: 'Без арта' } });
    const art = el.shadowRoot?.querySelector('.card__art');
    expect(art).not.toBeNull();
    expect(art?.querySelector('slot[name="art"]')).not.toBeNull();
    // No slotted art → no data-has-art attribute (the attribute pick over
    // :has() — toggled from the art slot's slotchange).
    expect(el.hasAttribute('data-has-art')).toBe(false);
    const cssText = sheet();
    // Base zone: display:none, NO margin — the empty zone reserves nothing.
    const baseArt = ruleBody(cssText, '\\.card__art');
    expect(baseArt).toMatch(/display:\s*none/);
    expect(baseArt).not.toMatch(/margin/);
    // The data-has-art rule expands it (flex + the 24px rhythm).
    const expanded = cssText.match(/:host\(\[data-has-art\]\) \.card__art\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(expanded).toMatch(/display:\s*flex/);
    expect(expanded).toMatch(/margin-bottom:\s*var\(--tk-space-24\)/);

    // Slotted art flips the attribute on (slotchange), removed art flips it off.
    const img = document.createElement('img');
    img.setAttribute('slot', 'art');
    el.appendChild(img);
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(true);
    img.remove();
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(false);
    el.remove();
  });

  it('CLAMPS: unknown variant degrades to gray with the reflected attribute corrected', async () => {
    const el = await mount({ props: { variant: 'ultraviolet' as TkPromoCard['variant'] } });
    expect(el.variant).toBe('gray');
    expect(el.getAttribute('variant')).toBe('gray');
    // The clamp converges: a later valid value renders normally.
    el.variant = 'beige';
    await elementUpdated(el);
    expect(el.getAttribute('variant')).toBe('beige');
    el.remove();
  });

  it('ART MODE (10.3): reflects on change, defaults top, clamps like variant — invalid degrades with the attribute corrected', async () => {
    const el = await mount();
    expect(el.artMode).toBe('top');
    // The reflected default mints from first update — the variant="gray"
    // precedent (identical mold). Byte-stability rides on ZERO CSS matching
    // 'top' + shadow-DOM identity (pinned in the CSS-ONLY test below).
    expect(el.getAttribute('art-mode')).toBe('top');
    el.artMode = 'bleed';
    await elementUpdated(el);
    expect(el.getAttribute('art-mode')).toBe('bleed');
    el.artMode = 'diagonal' as TkPromoCard['artMode'];
    await elementUpdated(el);
    expect(el.artMode).toBe('top');
    expect(el.getAttribute('art-mode')).toBe('top');
    // The clamp converges: a later valid value renders normally.
    el.artMode = 'bleed';
    await elementUpdated(el);
    expect(el.getAttribute('art-mode')).toBe('bleed');
    el.remove();
  });

  it('ART MODE IS CSS-ONLY (byte-stability, 10.3): the shadow DOM is identical across modes — the template mints nothing', async () => {
    const plain = await mount({ props: { heading: 'Идентичность' } });
    const top = await mount({ props: { heading: 'Идентичность', artMode: 'top' } });
    const bleed = await mount({ props: { heading: 'Идентичность', artMode: 'bleed' } });
    expect(bleed.shadowRoot?.innerHTML).toBe(plain.shadowRoot?.innerHTML);
    expect(top.shadowRoot?.innerHTML).toBe(plain.shadowRoot?.innerHTML);
    for (const el of [plain, top, bleed]) {
      // No shadow node carries an art-mode-dependent attribute or class —
      // the mode reaches CSS only through the host's reflected attribute.
      const minted = [...(el.shadowRoot?.querySelectorAll('*') ?? [])].flatMap((node) =>
        [...node.attributes].filter((attr) => /art-mode/.test(`${attr.name}=${attr.value}`)),
      );
      expect(minted).toEqual([]);
      el.remove();
    }
  });

  it('BLEED + DATA-HAS-ART (10.3): the slotchange toggle still governs the zone with art-mode set', async () => {
    const el = await mount({ props: { artMode: 'bleed', heading: 'Вылет' } });
    expect(el.hasAttribute('data-has-art')).toBe(false);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('slot', 'art');
    el.appendChild(svg);
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(true);
    svg.remove();
    await elementUpdated(el);
    expect(el.hasAttribute('data-has-art')).toBe(false);
    el.remove();
  });

  it('BLEED CSS SET (10.3): zone order/bleed/clip, slotted art mold, actions overlay + re-scope pair, skeleton mirror, <768 chain — every rule gated on [art-mode=bleed]', () => {
    const cssText = sheet();
    // GATING INVARIANT: every art-mode occurrence is the gated bleed form —
    // no unguarded bleed rule exists (byte-stability's structural pin).
    expect(cssText.match(/art-mode/g) ?? []).toHaveLength((cssText.match(/\[art-mode='bleed'\]/g) ?? []).length);

    // The overlay anchor.
    expect(ruleBody(cssText, ":host\\(\\[art-mode='bleed'\\]\\) \\.card")).toMatch(/position:\s*relative/);

    // ZONE: below the body (flex order — the DOM stays art-first), escaping
    // the padding on the SAME hooks (negative), clipped to the card's bottom
    // corners (radius chain, top corners 0).
    const zone = ruleBody(cssText, ":host\\(\\[art-mode='bleed'\\]\\) \\.card__art");
    expect(zone).toMatch(/order:\s*2/);
    expect(zone).toMatch(/margin-inline:\s*calc\(-1 \* var\(--tk-promo-card-padding, var\(--tk-space-32\)\)\)/);
    expect(zone).toMatch(/margin-block-end:\s*calc\(-1 \* var\(--tk-promo-card-padding, var\(--tk-space-32\)\)\)/);
    expect(zone).toMatch(/overflow:\s*hidden/);
    expect(zone).toMatch(/border-radius:\s*0 0 var\(--tk-promo-card-radius, var\(--tk-radius-xxl\)\)/);

    // SLOTTED ART: the reference mold — block, full width, NATURAL height
    // (object-fit stays unconsumed); the svg companion serves inline art.
    const slotted =
      cssText.match(
        /:host\(\[art-mode='bleed'\]\) \.card__art ::slotted\(img\),\s*:host\(\[art-mode='bleed'\]\) \.card__art ::slotted\(svg\) \{([^}]*)\}/,
      )?.[1] ?? '';
    expect(slotted).toMatch(/display:\s*block/);
    expect(slotted).toMatch(/width:\s*100%/);
    expect(slotted).toMatch(/height:\s*auto/);
    expect(slotted).not.toMatch(/object-fit/);

    // ACTIONS OVERLAY: absolute, full-width, pinned bottom-center. The
    // offset is the PIXEL PROBE (32px = space-32, Δ=0 — the spec's 12–16
    // neighborhood overruled; verify NOTES judgment 1).
    const overlay = ruleBody(cssText, ":host\\(\\[art-mode='bleed'\\]\\) \\.card__actions");
    expect(overlay).toMatch(/position:\s*absolute/);
    expect(overlay).toMatch(/inset-inline:\s*0/);
    expect(overlay).toMatch(/bottom:\s*var\(--tk-space-32\)/);
    expect(overlay).toMatch(/margin-top:\s*0/);
    expect(overlay).toMatch(/padding-top:\s*0/);
    // The re-scope pair rides the overlay (the charcoal technique verbatim —
    // the pill stays white over art in BOTH themes).
    expect(overlay).toMatch(/--tk-color-surface-base:\s*var\(--tk-promo-card-cta-fill, var\(--tk-color-white\)\)/);
    expect(overlay).toMatch(/--tk-color-text-primary:\s*var\(--tk-promo-card-cta-text, var\(--tk-color-ink-300\)\)/);

    // SKELETON MIRROR: the art placeholder bleeds the same way; aspect 4/3
    // stays and .sk--cta keeps its in-flow pin (recorded approximation).
    const skArt = ruleBody(cssText, ":host\\(\\[art-mode='bleed'\\]\\[skeleton\\]\\) \\.sk--art");
    expect(skArt).toMatch(/order:\s*2/);
    expect(skArt).toMatch(/margin-inline:\s*calc\(-1 \* var\(--tk-promo-card-padding, var\(--tk-space-32\)\)\)/);
    expect(skArt).toMatch(/margin-block-end:\s*calc\(-1 \* var\(--tk-promo-card-padding, var\(--tk-space-32\)\)\)/);
    expect(skArt).toMatch(/border-radius:\s*0 0 var\(--tk-promo-card-radius, var\(--tk-radius-xxl\)\)/);
    expect(ruleBody(cssText, '\\.sk--art')).toMatch(/aspect-ratio:\s*4 \/ 3/);
    expect(ruleBody(cssText, '\\.sk--cta')).toMatch(/margin-top:\s*auto/);

    // <768 CHAIN: the bleed margins re-track the padding-mobile hook so the
    // zone stays flush (a desktop padding override survives the breakpoint).
    const mobile = mobileBlock(sheet());
    expect(mobile).toMatch(
      /:host\(\[art-mode='bleed'\]\) \.card__art,\s*:host\(\[art-mode='bleed'\]\[skeleton\]\) \.sk--art \{[^}]*margin-inline:\s*calc\(-1 \* var\(--tk-promo-card-padding-mobile, var\(--tk-space-24\)\)\)/,
    );
    expect(mobile).toMatch(/margin-block-end:\s*calc\(-1 \* var\(--tk-promo-card-padding-mobile, var\(--tk-space-24\)\)\)/);
  });

  it('NULLS survive: null heading/description render the shell without crashing', async () => {
    const el = await mount({
      props: { heading: null as unknown as string, description: null as unknown as string },
    });
    expect(el.shadowRoot?.querySelector('article.card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    // Data arriving later renders normally.
    el.heading = 'Позднее';
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Позднее');
  });

  it('SKELETON: quiet-rail blocks replace content; static (no animation) under the skeleton attribute', async () => {
    const el = await mount({ props: { heading: 'Содержимое', skeleton: true } });
    expect(el.hasAttribute('skeleton')).toBe(true);
    expect(el.shadowRoot?.querySelector('.card__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('slot[name="actions"]')).toBeNull();
    const card = el.shadowRoot?.querySelector('article.card');
    expect(card?.getAttribute('aria-busy')).toBe('true');
    const blocks = [...(el.shadowRoot?.querySelectorAll<HTMLElement>('.sk') ?? [])];
    expect(blocks.map((block) => block.className)).toEqual([
      'sk sk--art',
      'sk sk--heading',
      'sk sk--line',
      'sk sk--line',
      'sk sk--cta',
    ]);
    for (const block of blocks) {
      expect(block.getAttribute('aria-hidden')).toBe('true');
    }
    const cssText = sheet();
    expect(cssText).toMatch(/\.sk\s*\{[^}]*background:\s*var\(--tk-color-border-default\)/);
    expect(cssText).not.toMatch(/@keyframes|animation:/, 'the skeleton is static by design (reduced-motion-safe)');
    // Clearing the flag restores the content anatomy.
    el.skeleton = false;
    await elementUpdated(el);
    expect(el.shadowRoot?.querySelector('.card__heading')?.textContent?.trim()).toBe('Содержимое');
  });

  it('RESPONSIVE: <768px padding drops one spacing step through the dedicated mobile hook', () => {
    const mobile = mobileBlock(sheet());
    expect(mobile).toMatch(/@media \(max-width: 767px\)/);
    expect(mobile).toMatch(
      /padding:\s*var\(--tk-promo-card-padding-mobile, var\(--tk-space-24\)\)/,
    );
  });
});
