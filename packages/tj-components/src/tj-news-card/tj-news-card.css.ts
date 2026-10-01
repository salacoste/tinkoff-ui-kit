import { css } from 'lit';

/**
 * tj-news-card styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 *
 * Visual spec: DESIGN.md `components.news-card` (card surface, card radius,
 * news-title h2/h3 ink-100, byline 15/700/20 ink-100) + the 95-card census
 * (NOTES.md: 760×270 feed cards, box-shadow NONE — FLAT, surfaces separate
 * by color, not elevation; NO hover lift: the census knows no card motion).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the bone 12% alpha inside color-mix() (the spec's named FLAG — meta-ink
 *   alpha, NEVER a bank gray import; reference skeleton behavior unprobed,
 *   so NO shimmer/animation is invented);
 * - the bone width percentages (on-scale picks mirroring the card anatomy —
 *   mark/word-bone/second-title-line/meta widths).
 *
 * On-scale picks (unmeasured, the 16.1 H2-band mold — maintainer confirms at
 * the side-by-side vs the tj-rubric-news captures): the mark 40 box
 * (space-scale read), the card inset 24, byline gap 12, the title
 * top offset 16, excerpt 12 / meta 16, the excerpt register (card-title
 * size 17/400 in the READING family — the spec's small-card register pick)
 * and its 24 leading. No backticks in css comments — they would terminate
 * the css literal.
 */
export const newsCardStyles = css`
  /* The 760-wide column family (census) — the card caps itself like
     tj-prose; the feed column around it stays consumer-owned. */
  :host {
    display: block;
    max-width: var(--tj-space-column-reading-body);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* FLAT by census (the 95-card feed survey): no shadow property, no hover
     rule anywhere in this sheet (pinned by the unit suite). The whole card
     is ONE anchor — the row-as-link mold: title + byline + counts ride a
     single tab stop. */
  .card {
    display: block;
    box-sizing: border-box;
    padding: var(--tj-space-24);
    background: var(--tj-color-card);
    border-radius: var(--tj-radius-card);
    text-decoration: none;
    color: inherit;
  }

  /* Ring on the CARD surface — the AA-surface law: focus-ring is a
     card-surface composition (3.067:1 non-text on card), NOT bare page. */
  .card:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* Byline row: squircle mark + circular avatar + author name. The mark is
     decorative (aria-hidden wrapper in the template); the avatar keeps its
     consumer alt (identification rides the author name). */
  .byline {
    display: flex;
    align-items: center;
    gap: var(--tj-space-12);
  }

  .byline__mark {
    flex: none;
    width: var(--tj-space-40);
    height: var(--tj-space-40);
    border-radius: var(--tj-radius-panel);
    overflow: hidden;
  }

  slot[name='mark']::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .byline__avatar {
    flex: none;
    width: 45px; /* FLAG: avatar 45 — live 45×45 (audit 2026-10-01), drift ahead of the frozen 2026-09-28 pack (20); the kit follows live on structural metrics. Off-scale literal, no token may be minted */
    height: 45px;
    border-radius: var(--tj-radius-badge);
    overflow: hidden;
  }

  slot[name='avatar']::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .byline__author {
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-byline-size);
    font-weight: var(--tj-text-byline-weight);
    line-height: var(--tj-text-byline-leading);
    color: var(--tj-color-ink-100);
  }

  /* Title: the slotted consumer heading keeps heading-level freedom
     (h2/h3) — the component never renders its own heading element. */
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
  }

  /* Excerpt (optional both ways — the wrapper renders only when slotted):
     the spec's small-card register pick — card-title SIZE 17/400 in the
     READING family (the article-body register at card scale). */
  .excerpt {
    display: block;
    margin-top: var(--tj-space-12);
  }

  slot[name='excerpt']::slotted(p) {
    margin: 0;
    font-family: var(--tj-font-reading);
    font-size: var(--tj-text-card-title-size);
    font-weight: var(--tj-text-card-title-weight);
    line-height: var(--tj-space-24);
    color: var(--tj-color-ink-100);
  }

  /* Meta row: timestamp + counts — time-meta 15/400 ink-300 (the AA meta
     step; the RESTRICTED reference grays never render in kit stories).
     The container carries the type; slotted time/spans INHERIT it. Counts
     are static text — NEVER live regions (nothing here dispatches). */
  .meta {
    display: block;
    margin-top: var(--tj-space-16);
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-time-meta-size);
    font-weight: var(--tj-text-time-meta-weight);
    line-height: var(--tj-text-byline-leading);
    color: var(--tj-color-ink-300);
  }

  /* Skeleton bones: meta ink at 12% alpha (the spec's named FLAG), NO
     animation (reference skeleton behavior unprobed — nothing invented).
     Shapes mirror the card anatomy: mark squircle + word bone + two title
     lines + meta line. Widths are flagged on-scale picks. */
  .card--skeleton {
    display: block;
    padding: var(--tj-space-24);
    background: var(--tj-color-card);
    border-radius: var(--tj-radius-card);
  }

  .sk {
    background: color-mix(in srgb, var(--tj-color-ink-300) 12%, transparent); /* FLAG: the 12% bone alpha (spec 16.2) */
    border-radius: var(--tj-radius-cta);
  }

  .sk-row {
    display: flex;
    align-items: center;
    gap: var(--tj-space-12);
    margin-bottom: var(--tj-space-16);
  }

  .sk--mark {
    flex: none;
    width: var(--tj-space-40);
    height: var(--tj-space-40);
    border-radius: var(--tj-radius-panel);
  }

  .sk--word {
    width: 20%; /* FLAG: bone widths (on-scale anatomy picks) */
    height: var(--tj-text-byline-leading);
  }

  .sk--title {
    width: 92%; /* FLAG: bone widths */
    height: var(--tj-text-news-title-leading);
    margin-bottom: var(--tj-space-8);
  }

  .sk--title-short {
    width: 64%; /* FLAG: bone widths */
    margin-bottom: var(--tj-space-8);
  }

  .sk--meta {
    width: 34%; /* FLAG: bone widths */
    height: var(--tj-text-byline-leading);
    margin-top: var(--tj-space-8);
  }
`;
