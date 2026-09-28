// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { proseStyles } from './tj-prose.css.js';
import { TjProse } from './tj-prose.js';

/**
 * tj-prose unit tests (spec 16.1): the stateless reading CONTAINER — slot
 * structure (lead + default), and the ::slotted species contract pinned at
 * the css.ts level (happy-dom runs no layout engine; typography is asserted
 * as RULES, not pixels — the real rendering lives in the visual harness).
 *
 * Pinned: the column CAP token, the two-family cascade (Charter flow +
 * grotesque H2/pull-quote interruptions), the 25px rhythm flag, the probe10
 * link species, the focus-ring improvement layer, and the tokens-only rule
 * (zero --tk-* reads — FR-17's family isolation in styles).
 */

/** Await the element's next render (Lit's updateComplete). */
const elementUpdated = (el: TjProse): Promise<unknown> => el.updateComplete;

const mount = async (children?: (el: TjProse) => void): Promise<TjProse> => {
  const el = new TjProse();
  children?.(el);
  document.body.appendChild(el);
  await elementUpdated(el);
  return el;
};

/** The slotted div from the BYO test (unknown species — must stay untouched). */
const asideEl = (el: TjProse): HTMLElement =>
  (el.shadowRoot?.querySelector('slot:not([name])')?.assignedElements()[0] ??
    document.createElement('div')) as HTMLElement;

describe('tj-prose', () => {
  it('registers as tj-prose exposing TjProse', async () => {
    await customElements.whenDefined('tj-prose');
    expect(customElements.get('tj-prose')).toBe(TjProse);
  });

  it('renders the named lead slot BEFORE the default slot (standfirst opens the column)', async () => {
    const el = await mount();
    const leadSlot = el.shadowRoot?.querySelector('slot[name="lead"]');
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(leadSlot, 'named lead slot renders').not.toBeNull();
    expect(defaultSlot, 'default slot renders').not.toBeNull();
    const shadowHtml = el.shadowRoot?.innerHTML ?? '';
    expect(shadowHtml.indexOf('slot name="lead"')).toBeLessThan(shadowHtml.indexOf('<slot>'));
  });

  it('projects slotted flow: the lead paragraph rides the named slot, body flow the default', async () => {
    const el = await mount((host) => {
      const lead = document.createElement('p');
      lead.setAttribute('slot', 'lead');
      lead.textContent = 'Лид';
      host.appendChild(lead);
      const body = document.createElement('p');
      body.textContent = 'Абзац';
      host.appendChild(body);
    });
    const leadSlot = el.shadowRoot?.querySelector('slot[name="lead"]');
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(
      (leadSlot?.assignedElements() ?? []).map((node) => node.textContent).join(''),
    ).toContain('Лид');
    expect(
      (defaultSlot?.assignedElements() ?? []).map((node) => node.textContent).join(''),
    ).toContain('Абзац');
  });

  it('unknown slotted tags render UNSTYLED — inert passthrough, the BYO content contract', async () => {
    const el = await mount((host) => {
      const aside = document.createElement('div');
      aside.textContent = 'Свой блок';
      host.appendChild(aside);
    });
    await elementUpdated(el);
    // Renders (assigned to the default slot), no crash, no inline restyling —
    // anything beyond the known species is the consumer's own stylesheet.
    const defaultSlot = el.shadowRoot?.querySelector('slot:not([name])');
    expect(defaultSlot?.assignedElements().length).toBe(1);
    expect(asideEl(el).getAttribute('style')).toBeNull();
  });

  it('hosts no properties: the element surface is slots only (stateless container)', async () => {
    const el = await mount();
    expect(el.getAttributeNames().sort()).toEqual([]);
  });
});

describe('tj-prose styles (css.ts pins)', () => {
  const cssText = proseStyles.cssText;

  it('caps the column with the reading-body token (a CAP, not a grid column)', () => {
    expect(cssText).toContain('max-width: var(--tj-space-column-reading-body)');
  });

  it('sets the reading register on :host with the RU hyphenation contract', () => {
    expect(cssText).toContain('hyphens: auto');
    expect(cssText).toContain('font-family: var(--tj-font-reading)');
    expect(cssText).toContain('color: var(--tj-color-ink-100)');
  });

  it('enforces [hidden] (the :host display above out-ranks the UA rule)', () => {
    expect(cssText).toContain(':host([hidden])');
  });

  it('body flow: Charter article-body tokens + the measured 25px rhythm', () => {
    expect(cssText).toContain('::slotted(p)');
    expect(cssText).toContain('var(--tj-text-article-body-size)');
    expect(cssText).toContain('var(--tj-text-article-body-leading)');
    // The ONE measured prose gap (probe10) — flag-don't-invent, 25px rides
    // the sheet because the token scale has no 25 step.
    expect(cssText).toContain('margin: 0 0 25px');
  });

  it('lead: Charter 27/35 via the lead-scoped slot selector (no generic-p pollution)', () => {
    expect(cssText).toContain("slot[name='lead']::slotted(p)");
    expect(cssText).toContain('var(--tj-text-article-lead-size)');
    expect(cssText).toContain('var(--tj-text-article-lead-leading)');
  });

  it('H2 interruption: grotesque article-h2 tokens, ink-100, UA margins neutralized', () => {
    expect(cssText).toContain('::slotted(h2)');
    expect(cssText).toContain('var(--tj-text-article-h2-size)');
    expect(cssText).toContain('var(--tj-text-article-h2-weight)');
    expect(cssText).toContain('font-family: var(--tj-font-ui)');
  });

  it('pull-quote interruption: grotesque pull-quote tokens', () => {
    expect(cssText).toContain('::slotted(blockquote)');
    expect(cssText).toContain('var(--tj-text-pull-quote-size)');
    expect(cssText).toContain('var(--tj-text-pull-quote-leading)');
  });

  it('in-body link species: link ink, transparent underline at rest, 70% hover reveal, ink-stable', () => {
    expect(cssText).toContain('::slotted(a)');
    expect(cssText).toContain('color: var(--tj-color-link-body)');
    expect(cssText).toContain('text-decoration-color: transparent');
    expect(cssText).toContain('text-decoration-thickness: 1px');
    expect(cssText).toContain('text-underline-offset: 0.1em');
    expect(cssText).toContain('text-underline-position: under');
    expect(cssText).toContain('::slotted(a:hover)');
    expect(cssText).toContain(
      'color-mix(in srgb, var(--tj-color-link-body) 70%, transparent)',
    );
    // Ink-stable hover: the hover rule touches the decoration ONLY — no
    // standalone color declaration on ::slotted(a:hover) (word-bounded, so
    // text-decoration-color does not trip the pin).
    const hoverStart = cssText.indexOf('::slotted(a:hover)');
    const hoverBlock = cssText.slice(hoverStart, cssText.indexOf('}', hoverStart));
    expect(hoverBlock).not.toMatch(/(?:^|\s)color\s*:/);
    expect(cssText).toContain('transition: text-decoration-color var(--tj-motion-duration-micro)');
  });

  it('focus-ring improvement layer present (2px token ring, offset 2px)', () => {
    expect(cssText).toContain('::slotted(a:focus-visible)');
    expect(cssText).toContain('outline: 2px solid var(--tj-color-focus-ring)');
    expect(cssText).toContain('outline-offset: 2px');
  });

  it('consumes ТЖ tokens only — zero --tk-* reads (FR-17 family isolation)', () => {
    expect(cssText).not.toContain('--tk-');
  });

  it('carries no theme branches (AD-3: the token layer themes, never the sheet)', () => {
    expect(cssText).not.toContain('data-tj-theme');
    expect(cssText).not.toContain('prefers-color-scheme');
  });
});

/**
 * The TWO-SURFACE LINK CONTRACT (16.1 review patch — the MAJOR): CSS Scoping
 * has no descendant combinator off ::slotted, so ::slotted(a) reaches ONLY
 * top-level slot anchors; an anchor nested inside a slotted paragraph gets
 * NOTHING from the sheet (UA-blue links — the empirical finding the patch
 * fixes). The contract: nested in-flow links are <tj-link> markup. Pinned
 * here at the documentation level (grep, the repo's accepted mold for
 * contract-doc assertions) AND at the story level: the stories must never
 * regress to raw nested anchors.
 */
describe('tj-prose two-surface link contract (16.1 review patch)', () => {
  const sourceOf = (name: string): string =>
    readFileSync(new URL(name, import.meta.url), 'utf8');

  it('the element JSDoc documents the ::slotted descendant limit and prescribes tj-link', () => {
    const source = sourceOf('tj-prose.ts');
    expect(source).toMatch(/cannot reach DESCENDANTS of slotted nodes/);
    expect(source).toMatch(/TOP-LEVEL SLOT ANCHORS ONLY/);
    expect(source).toContain('<tj-link>');
    expect(source).toMatch(/two surfaces/);
  });

  it('the stylesheet comments carry the same contract at the rule site', () => {
    const source = sourceOf('tj-prose.css.ts');
    expect(source).toMatch(/NO descendant combinator off/);
    expect(source).toMatch(/TOP-LEVEL SLOT ANCHORS ONLY/);
    expect(source).toContain('tj-link');
  });

  it('the stories never regress to raw nested anchors — in-paragraph links are tj-link', () => {
    const source = sourceOf('tj-prose.stories.ts');
    // Exactly ONE raw anchor is legitimate: the TOP-LEVEL slot anchor in the
    // Species story demonstrating the ::slotted(a) surface (round-2 NIT —
    // the species must actually render, get baseline + axe coverage). Zero
    // would mean that surface lost its demo; two or more would mean raw
    // anchors crept back into the flow (the round-1 MAJOR — a nested anchor
    // renders UA-blue, unreachable by ::slotted). count === 1 pins BOTH
    // directions honestly; the demo anchor sits OUTSIDE any paragraph as a
    // direct slot child.
    expect(source.match(/<a href/g)?.length ?? 0).toBe(1);
    expect(source.match(/<tj-link href/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it('the ::slotted(a) rule itself stays — top-level slot anchors are legitimate', () => {
    expect(proseStyles.cssText).toContain('::slotted(a)');
  });
});
