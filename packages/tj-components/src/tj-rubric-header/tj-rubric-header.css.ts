import { css } from 'lit';

/**
 * tj-rubric-header styles — tokens only, zero theme branches (AD-3 v5 on the
 * ТЖ instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 *
 * Visual spec: DESIGN.md `components.rubric-header` (card surface, panel
 * radius, rubric-h1 h1, card-title subtitle) + the capture ground
 * (.playwright-cli/captures-v3/tj/tj-rubric-news-viewport-2026-09-28.png —
 * cover top-corners rounded / bottom straight cut, the mark left-aligned and
 * roughly half over the cover boundary, everything left-aligned).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the mark 100×100 box (spec 16.2: the squircle art size) and its -50px
 *   overlap margin (HALF the mark over the cover boundary — the spec's named
 *   structural FLAG, unmeasured);
 * - the bone-free zone: this component has NO skeleton — nothing else here.
 *
 * On-scale spacing picks (unmeasured, the 16.1 H2-band mold — maintainer
 * confirms at the side-by-side vs the tj-rubric-news captures): the flow
 * inset 16/24/24, the subtitle top offset 8, the mark inline offset 24,
 * the subtitle leading 24 (the card-title species pick — the SAME leading
 * the news-card excerpt carries; one species, one leading).
 * No backticks in css comments — they would terminate the css literal.
 */
export const rubricHeaderStyles = css`
  /* Layout surface: a CARD with panel radius. The cover clips ITSELF
     (top-corners-only radius) so the host needs no overflow clipping —
     the half-overlapping mark must paint OUTSIDE the flow box, and a
     host-level clip would cut it. */
  :host {
    display: block;
    background: var(--tj-color-card);
    border-radius: var(--tj-radius-panel);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Cover: an empty slot renders a zero-height invisible box — graceful. */
  .cover {
    /* FLAG: line-height 0 — kills the inline baseline gap under the slotted
       img (structural box math, NOT a text leading pick). */
    line-height: 0;
  }

  slot[name='cover']::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Top-corners-only clip: the panel radius cuts the cover where it meets
       the card edge; the bottom edge runs a STRAIGHT cut into the card body
       (tj-rubric-news viewport capture). */
    border-radius: var(--tj-radius-panel) var(--tj-radius-panel) 0 0;
  }

  /* The squircle mark: decorative wrapper (aria-hidden in the template).
     100×100 = the spec's named FLAG size; panel radius keeps the squircle
     family. Default flow margin keeps the empty-cover case graceful. */
  .mark {
    width: 100px; /* FLAG: 100×100 mark box (spec 16.2, unmeasured) */
    height: 100px; /* FLAG: same box — one flag pair */
    margin-block-start: var(--tj-space-24);
    margin-inline-start: var(--tj-space-24);
    border-radius: var(--tj-radius-panel);
    overflow: hidden;
  }

  /* The overlap: half the mark over the cover boundary — -50px pulls the
     100px box up its own half. Applied ONLY when cover content exists
     (the template conditions the class); without cover art the mark sits
     in normal flow (graceful, no negative-margin hole). */
  .mark--overlap {
    margin-block-start: -50px; /* FLAG: the 50/50 overlap (spec 16.2) */
  }

  slot[name='mark']::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* The consumer heading + subtitle flow. The component NEVER renders its
     own heading element — ::slotted() styles the consumer's h1/p (the
     no-heading-invention rule, spec 16.2). */
  .flow {
    padding: var(--tj-space-16) var(--tj-space-24) var(--tj-space-24);
  }

  ::slotted(h1) {
    margin: 0;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-rubric-h1-size);
    font-weight: var(--tj-text-rubric-h1-weight);
    line-height: var(--tj-text-rubric-h1-leading);
    color: var(--tj-color-ink-100);
  }

  /* Subtitle: card-title 17/400 is the ON-SCALE pick (species unmeasured —
     DESIGN.md rubric-header note, flagged for the side-by-side). ink-300 =
     the AA meta step (the capture subtitle is gray). */
  ::slotted(p) {
    margin: var(--tj-space-8) 0 0;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-card-title-size);
    font-weight: var(--tj-text-card-title-weight);
    /* Same leading pick as the news-card excerpt — ONE card-title species,
       ONE leading (otherwise the species leads differently per context). */
    line-height: var(--tj-space-24); /* FLAG: the card-title leading pick */
    color: var(--tj-color-ink-300);
  }
`;
