import { css } from 'lit';

/**
 * tj-prose styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/typography/radius/motion value consumes an
 * inherited `var(--tj-*)` custom property (never adopted into the shadow
 * root — the cascade trap; the token sheet stays a consumer-side,
 * document-level sheet).
 *
 * Visual spec: DESIGN.md `components.editorial-link` (the link species
 * values) + EXPERIENCE.md «Reading surface (article)» (the composition).
 * The TWO-FAMILY cascade (FR-20): the reading register is
 * Charter (--tj-font-reading) for the lead and body flow; the grotesque
 * (--tj-font-ui) interrupts it exactly twice — the in-article H2 and the
 * pull-quote (blockquote), the reference's own contrast play of a grotesque
 * voice inside the serif column.
 *
 * RHYTHM OWNERSHIP: the reference carries the 25px paragraph gap on wrapper
 * elements, so OUR container owns the rhythm deliberately (spec 16.1) — the
 * one MEASURED prose gap (probe10: P margin-bottom 25px on the live
 * article). H2/pull-quote/lead VERTICAL spacing is UNMEASURED on the
 * reference: this sheet neutralizes their UA margins and the CONSUMER (the
 * composition story, a product page) composes them — documented in the
 * story and pending the side-by-side baseline review.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 25px paragraph rhythm (the measured probe10 gap; the --tj-space-*
 *   scale has no 25 step and none may be minted);
 * - the 1px underline thickness and the 0.1em underline offset (probe10
 *   measured link geometry: thickness 1px, offset .1em, position under);
 * - the 70% hover alpha inside color-mix() (the reference's compose-at-use
 *   architecture — `--opacity-link-border-hover: .7` composed at the use
 *   site; no alpha tokens exist by design).
 *
 * The ::slotted(a) species and tj-link's shadow anchor are the SAME species
 * contract from ONE token source (--tj-color-link-body + the measured
 * underline geometry) — the documented two-surface contract (the 16.1
 * review's full formulation): CSS Scoping has NO descendant combinator off
 * ::slotted, so the rule below reaches ONLY top-level anchors assigned
 * directly to a slot; links nested INSIDE slotted flow (an anchor within a
 * paragraph — the normal editorial case) are unreachable from here and the
 * consumer marks them up as <tj-link>, whose shadow anchor carries the same
 * species from the same tokens. Not drift — one contract, two surfaces.
 */
export const proseStyles = css`
  /* The reading column: a CAP, not a grid column (spec 16.1) — 760px max,
     the measured body-column token. Host sets the reading register as the
     inherited default so unstyled slotted flow (lists, asides — the BYO
     content contract) still reads Charter. */
  :host {
    display: block;
    max-width: var(--tj-space-column-reading-body);
    font-family: var(--tj-font-reading);
    font-size: var(--tj-text-article-body-size);
    font-weight: var(--tj-text-article-body-weight);
    line-height: var(--tj-text-article-body-leading);
    color: var(--tj-color-ink-100);
    /* RU hyphenation contract: the browser may hyphenate long words at the
       column edge. lang="ru" (the hyphenation dictionary selector) is the
       CONSUMER's document-level duty — hyphens without a lang do nothing
       (documented in the story). No backticks in css comments — they would
       terminate the css template literal. */
    hyphens: auto;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Body flow — Charter 21/30, the measured rhythm. The 25px is the ONE
     measured prose gap (probe10); unknown slotted tags keep UA styles and
     render UNSTYLED (inert passthrough — the BYO content contract). */
  ::slotted(p) {
    margin: 0 0 25px;
    font-family: var(--tj-font-reading);
    font-size: var(--tj-text-article-body-size);
    font-weight: var(--tj-text-article-body-weight);
    line-height: var(--tj-text-article-body-leading);
  }

  /* Lead — Charter 27/35, the article's standfirst. Vertical spacing is
     composition-owned (unmeasured): the lead rides the same 25px paragraph
     rhythm unless the consumer composes otherwise. */
  slot[name='lead']::slotted(p) {
    font-family: var(--tj-font-reading);
    font-size: var(--tj-text-article-lead-size);
    font-weight: var(--tj-text-article-lead-weight);
    line-height: var(--tj-text-article-lead-leading);
  }

  /* In-article H2 — the grotesque interruption: Graphik 38/700/45, ink-100
     (probe9: Graphik heads; article-h2 tokens). UA margins neutralized —
     the vertical band is composition-owned (unmeasured on the reference). */
  ::slotted(h2) {
    margin: 0;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-article-h2-size);
    font-weight: var(--tj-text-article-h2-weight);
    line-height: var(--tj-text-article-h2-leading);
    color: var(--tj-color-ink-100);
  }

  /* Pull-quote — the second grotesque interruption inside the serif flow:
     Graphik 35/400/50. UA margins (and the UA 40px indent) neutralized —
     composition-owned, same ruling as the H2. */
  ::slotted(blockquote) {
    margin: 0;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-pull-quote-size);
    font-weight: var(--tj-text-pull-quote-weight);
    line-height: var(--tj-text-pull-quote-leading);
    color: var(--tj-color-ink-100);
  }

  /* Link species — the probe10 species, TOP-LEVEL SLOT ANCHORS ONLY: ink
     STAYS the interactive pair in both themes, the underline EXISTS but
     paints transparent at rest and reveals on hover at 70% alpha of the ink.
     Ink color does NOT shift on hover (ink-stable hover — the reference's
     restraint grammar); the underline geometry (1px / .1em / under) is
     measured, flagged above. ::slotted cannot reach descendants: an anchor
     nested inside a slotted paragraph gets NOTHING from this rule — mark it
     up as <tj-link> (the second surface of the same species contract, see
     the header). */
  ::slotted(a) {
    color: var(--tj-color-link-body);
    font-size: var(--tj-text-body-link-size);
    font-weight: var(--tj-text-body-link-weight);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.1em;
    text-underline-position: under;
    transition: text-decoration-color var(--tj-motion-duration-micro) var(--tj-motion-curve-standard);
    cursor: pointer;
  }

  ::slotted(a:hover) {
    text-decoration-color: color-mix(in srgb, var(--tj-color-link-body) 70%, transparent);
  }

  /* Focus ring — the improvement layer (probe10: the reference leaves body
     links on the UA outline). 2px token ring, offset 2px, never removed. */
  ::slotted(a:focus-visible) {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }
`;
