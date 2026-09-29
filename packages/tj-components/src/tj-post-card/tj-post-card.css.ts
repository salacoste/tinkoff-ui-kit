import { css } from 'lit';

/**
 * tj-post-card styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color value consumes an inherited `var(--tj-*)` custom
 * property (never adopted into the shadow root — the cascade trap).
 *
 * Visual spec: EXPERIENCE.md community post cell + probe-notes §Сообщество
 * (post titles 24/700/30 = the news-title species; DESIGN.md names community
 * posts on that row) + the community viewport capture. The cell is
 * TRANSPARENT by ruling: the reference's cards are text-only cells on a
 * shared white sheet (the composition PATTERN owns the sheet — card fill +
 * panel radius); boxing the cells would break the composition. No own
 * background, radius, border, or padding — the card IS the content.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the meta avatar 20px box (vision-measured tiny circle — a structural
 *   FLAG; --tj-space-20 carries the same value but is a spacing step, not
 *   a size channel — the r20-vs-radius-chip ruling extended);
 * - the clamp quartet on the slotted heading (display -webkit-box /
 *   -webkit-box-orient vertical / -webkit-line-clamp 2 / overflow hidden —
 *   the EXPERIENCE 2-line contract verbatim; a clamp is structural CSS, no
 *   token could carry it).
 *
 * On-scale picks (the 16.1 H2-band mold — maintainer confirms at the
 * side-by-side vs the tj-community captures): meta-row gap 8, title top
 * offset 16, count top offset 12, the ghost count register (time-meta
 * 15/400 ink-300 with the byline leading — no time-meta-leading token
 * exists). No backticks in css comments — they would terminate the css
 * literal.
 */
export const postCardStyles = css`
  /* NOT the 760 column family: the grid cell sizes itself to the consumer's
     sheet — no max-width on the host. */
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* TRANSPARENT by ruling: no background, no padding, no radius, no border —
     the cell rides the composition sheet (see the pattern story). The whole
     cell is ONE anchor — the row-as-link mold translated from tj-news-card:
     byline → date → title → count ride a single tab stop, one accessible
     name from the anchor's flattened subtree (DOM order). FLAT: no shadow,
     no hover rule anywhere in this sheet (pinned by the unit suite). */
  .card {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  /* Ring on the CELL surface — the AA-surface law: the cell renders on the
     composition sheet (card fill), where focus-ring is AA (3.067:1 non-text
     on card) — the shipped 16.1/16.3 tj ring mold verbatim. */
  .card:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* Meta row: mini avatar (20px structural FLAG) + author (byline 15/700/20
     ink-100) + date (time-meta 15/400 ink-300) + consumer-side «·» joins —
     the SEPARATORS live in the consumer's slots, so an empty slot never
     leaves an orphan dot. The avatar wrapper is aria-hidden in the template
     (identification rides the author name — the 16.3 ruling generalized). */
  .meta {
    display: flex;
    align-items: center;
    gap: var(--tj-space-8);
  }

  .meta__avatar {
    flex: none;
    width: 20px; /* FLAG: vision-measured tiny circle — structural per spec 16.4; --tj-space-20 carries the same VALUE but is a spacing step, not a size channel (the r20-vs-radius-chip ruling extended) */
    height: 20px; /* FLAG: vision-measured tiny circle — structural */
    border-radius: var(--tj-radius-badge);
    overflow: hidden;
  }

  slot[name='avatar']::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .meta__author {
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-byline-size);
    font-weight: var(--tj-text-byline-weight);
    line-height: var(--tj-text-byline-leading);
    color: var(--tj-color-ink-100);
  }

  .meta__date {
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-time-meta-size);
    font-weight: var(--tj-text-time-meta-weight);
    line-height: var(--tj-text-byline-leading); /* pick — no time-meta-leading token; the byline leading is 20 */
    color: var(--tj-color-ink-300);
  }

  /* Title: the slotted consumer heading keeps heading-level freedom (h2/h3)
     — the component never renders its own heading element. news-title
     24/700/30 ink-100 (the DESIGN row already names community posts; the
     machine probe beats the vision's pixel-guess on downscaled cells). The
     clamp quartet is the EXPERIENCE 2-line contract verbatim — structural,
     FLAGGED; the full text rides the anchor's title attribute (the mirror
     in the element source), so the clamp never loses information. */
  .title {
    display: block;
    margin-top: var(--tj-space-16);
  }

  slot[name='title']::slotted(h2),
  slot[name='title']::slotted(h3) {
    margin: 0;
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-news-title-size);
    font-weight: var(--tj-text-news-title-weight);
    line-height: var(--tj-text-news-title-leading);
    color: var(--tj-color-ink-100);
    display: -webkit-box; /* FLAG: the clamp quartet (line 1 of 4) — 2-line EXPERIENCE contract */
    -webkit-box-orient: vertical; /* FLAG: the clamp quartet (2 of 4) */
    -webkit-line-clamp: 2; /* FLAG: the clamp quartet (3 of 4) */
    overflow: hidden; /* FLAG: the clamp quartet (4 of 4) */
  }

  /* Count line: the decorative speech bubble (aria-hidden, currentColor —
     the chip-chevron mold) + the number text (time-meta 15/400 ink-300;
     static text, NEVER a live region — nothing here dispatches). Own flow
     line after the clamped title: a clamp box is a block, an inline sibling
     after it cannot share its last line — no float hacks invented (the
     count-below-title micro-delta, recorded in story prose). */
  .count {
    display: inline-flex;
    align-items: center;
    gap: var(--tj-space-4);
    margin-top: var(--tj-space-12);
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-time-meta-size);
    font-weight: var(--tj-text-time-meta-weight);
    line-height: var(--tj-text-byline-leading); /* pick — no time-meta-leading token */
    color: var(--tj-color-ink-300);
  }

  .count__icon {
    flex: none;
    color: currentColor;
  }
`;
