import { LitElement, html } from 'lit';

import { proseStyles } from './tj-prose.css.js';

/**
 * tj-prose — the ТЖ reading column (Story 16.1, the first ТЖ components).
 *
 * A typographic CONTAINER, not a styled paragraph: the consumer slots an
 * article's flow content and the element's shadow sheet applies the
 * two-family reading cascade via `::slotted` rules (Charter for the lead
 * and body flow; the grotesque interrupts exactly twice — in-article H2 and
 * pull-quote; the spec's Intent §1). The column is a CAP, not a grid
 * column: `max-width: var(--tj-space-column-reading-body)` on the host.
 *
 * Rhythm ownership: the reference site carries the 25px paragraph gap on
 * wrapper elements, so this container owns it deliberately (the one
 * MEASURED prose gap, probe10). H2 / pull-quote / lead VERTICAL spacing is
 * unmeasured on the reference — their UA margins are neutralized here and
 * the CONSUMER composes the band (the composition story demonstrates; the
 * pick is flagged for the baseline review).
 *
 * Known slotted species: `p` (body, Charter 21/30), `p[slot=lead]` (the
 * standfirst, Charter 27/35), `h2` (Graphik 38/700/45), `blockquote` (the
 * pull-quote, Graphik 35/400/50), `a` (the probe10 link species:
 * transparent underline at rest, 70%-alpha reveal on hover, ink-stable —
 * TOP-LEVEL SLOT ANCHORS ONLY, see the link contract below). Unknown slotted
 * tags render UNSTYLED — inert passthrough, the BYO content contract: bring
 * your own styles for anything beyond the species above.
 *
 * LINK CONTRACT (the two-surface species, the 16.1 review formulation):
 * `::slotted` selectors cannot reach DESCENDANTS of slotted nodes (CSS
 * Scoping has no descendant combinator off ::slotted), so the sheet's
 * `::slotted(a)` rule styles only anchors assigned DIRECTLY to a slot.
 * Links nested inside the flow — an anchor within a paragraph, the normal
 * editorial case — get nothing from this element and MUST be marked up as
 * `<tj-link>`, whose shadow anchor carries the same probe10 species from
 * the same token source (--tj-color-link-body + the measured geometry).
 * One contract, two surfaces — not drift.
 *
 * RU hyphenation: `hyphens: auto` on the host; `lang="ru"` is the consumer's
 * document-level duty (hyphenation dictionaries are selected by document
 * language, not by the element — documented in the story).
 *
 * STATELESS display surface: no properties, no channel, nothing dispatches
 * (the event-map no-entry ruling, packages/tj-react/src/event-map.ts).
 * SSR-compat (AD-10): rendered via Lit templates only.
 *
 * @tag tj-prose
 * @slot lead - The standfirst paragraph (`p[slot=lead]`, Charter 27/35).
 * @slot - Article flow: p, h2, blockquote, a (the known species above).
 */
export class TjProse extends LitElement {
  static override readonly styles = [proseStyles];

  override render() {
    return html`
      <slot name="lead"></slot>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-prose': TjProse;
  }
}

if (!customElements.get('tj-prose')) {
  customElements.define('tj-prose', TjProse);
}
