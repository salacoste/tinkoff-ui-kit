import { css } from 'lit';

/**
 * tk-article-card styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: EXPERIENCE.md Component Patterns (ArticleCard row: «Читать»
 * link covers whole card via ::after stitch — single tab stop) + DESIGN.md
 * Components table (Text-only: 2-line title, desc, "Читать" link) + the
 * 2.0 capture notes § ArticleCard (article-card-grid.png, 1280×285):
 *
 * - FILL/RADIUS (probe): ~#F5F5F7 neutral gray at ~16–20px radius →
 *   tint-gray at radius-lg (16px — the exact token inside the probed
 *   range; the family's smaller text-card register), flat, no shadow.
 * - TITLE (probe): ~#1C1C1E ~20px 600–700 lh 28px → heading-6 (20px/500
 *   lh 1.35 — kit weight discipline caps card headings at 500),
 *   LINE-CLAMPED to 2 lines (webkit prefix + standard, the spec's noted
 *   pair).
 * - DESCRIPTION (probe): ~#8E8E93 ~15px/21px 2–3 lines → body-m at
 *   text-secondary.
 * - LINK (probe): blue ~14–15px, no underline, no arrow → body-m at the
 *   semantic link token; the underline fades in on hover/:focus-visible
 *   (the tk-link affordance language — the underline IS the keyboard
 *   focus indicator for card links, the tk-link §9 exception precedent).
 * - STITCH (the spec's Design Notes pick): `.card__link::after {
 *   position: absolute; inset: 0 }` over the position:relative card —
 *   the pseudo belongs to the ANCHOR, so the whole card is one native
 *   click target and ONE tab stop.
 *
 * Per-component custom properties (`--tk-article-card-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-article-card-fill`     card fill          (default: per-variant tint)
 * - `--tk-article-card-text`     title color        (default text-primary; white on charcoal)
 * - `--tk-article-card-text-muted` description color (default text-secondary; white on charcoal)
 * - `--tk-article-card-link`     link color         (default the on-tint AA step link-on-tint; white on charcoal)
 * - `--tk-article-card-radius`   card radius        (default radius-lg)
 * - `--tk-article-card-padding`  card padding       (default space-32)
 * - `--tk-article-card-padding-mobile` <768px padding (default space-24 — the responsive matrix's one-step drop)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 2-line clamp count (the spec's literal), the 767px breakpoint
 * (the navbar's mobile flip), and the skeleton block widths (90% title and
 * description lines, 25% link — placeholder proportions).
 */
export const articleCardStyles = css`
  :host {
    display: block;
  }

  /* position:relative — the stitching context the link's ::after resolves against. */
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    padding: var(--tk-article-card-padding, var(--tk-space-32));
    border-radius: var(--tk-article-card-radius, var(--tk-radius-lg));
    background: var(--tk-article-card-fill, var(--tk-color-tint-gray));
    color: var(--tk-article-card-text, var(--tk-color-text-primary));
    font-family: var(--tk-font-body);
  }

  /* --- Tint auto-pairing: per-tint token consumption (no theme branches) --- */

  :host([variant='bluegray']) .card {
    background: var(--tk-article-card-fill, var(--tk-color-tint-bluegray));
  }

  :host([variant='mint']) .card {
    background: var(--tk-article-card-fill, var(--tk-color-tint-mint));
  }

  :host([variant='beige']) .card {
    background: var(--tk-article-card-fill, var(--tk-color-tint-beige));
  }

  /* Charcoal pairs WHITE text (DESIGN Colors; the tint is theme-invariant);
     the whole-card link follows the pairing — white beats the on-tint blue. */
  :host([variant='charcoal']) .card {
    background: var(--tk-article-card-fill, var(--tk-color-tint-charcoal));
    color: var(--tk-article-card-text, var(--tk-color-white));
  }

  :host([variant='charcoal']) .card__link {
    color: var(--tk-article-card-link, var(--tk-color-white));
  }

  :host([variant='charcoal']) .card__description {
    color: var(--tk-article-card-text-muted, var(--tk-color-white));
  }

  /* --- Anatomy --------------------------------------------------------------- */

  /* 2-line clamp (the spec's webkit-prefix + standard pair): the title box
     is a -webkit-box; overflow hidden crops past the second line. */
  .card__heading {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-6-size);
    font-weight: var(--tk-text-heading-6-weight);
    line-height: var(--tk-text-heading-6-leading);
  }

  .card__description {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-article-card-text-muted, var(--tk-color-text-secondary));
  }

  /* The «Читать» link: pinned bottom (margin-top:auto), the semantic link
     token, and the UNDERLINE affordance (transparent decoration painted in
     on hover/:focus-visible over the motion token — the tk-link language;
     the underline is the keyboard focus indicator, never removed). */
  .card__link {
    margin-top: auto;
    padding-top: var(--tk-space-16);
    align-self: flex-start;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    /* AA on tints (DESIGN text-link 'on-tint-color'): blue-100 = ~4.1-4.4:1
       on the tint surfaces (fails 4.5:1) — the on-tint step carries the card
       register; the dark layer remaps it to dark-link. */
    color: var(--tk-article-card-link, var(--tk-color-link-on-tint));
    text-decoration: underline;
    text-decoration-color: transparent;
    transition:
      text-decoration-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .card__link:hover,
  .card__link:focus-visible {
    text-decoration-color: currentColor;
  }

  /* THE STITCH: the pseudo covers the whole card — clicks anywhere land on
     the ANCHOR (the pseudo's origin) and navigate natively; the card is one
     click target and one tab stop. */
  .card__link::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  /* --- Skeleton (the shared card pattern): quiet-rail blocks matching the
     final layout; STATIC by design (no shimmer — reduced-motion-safe). --- */

  .sk {
    /* border-default semantic (5.4 dark sweep): light value byte-identical
       to gray-200 (#E7E8EA), dark remaps to the white-alpha tonal step —
       gray-200 painted near-white skeleton blocks in dark. */
    background: var(--tk-color-border-default);
  }

  .sk--title {
    width: 90%;
    height: var(--tk-text-heading-6-size);
    margin-bottom: var(--tk-space-8);
    border-radius: var(--tk-radius-full);
  }

  .sk--line {
    width: 90%;
    height: var(--tk-text-body-m-size);
    margin-bottom: var(--tk-space-8);
    border-radius: var(--tk-radius-full);
  }

  .sk--link {
    width: 25%;
    height: var(--tk-text-body-m-size);
    margin-top: auto;
    border-radius: var(--tk-radius-full);
  }

  /* --- The EXPERIENCE responsive matrix: <768px card padding drops one
     spacing step (32 → 24) — the navbar's breakpoint value. --- */

  @media (max-width: 767px) {
    .card {
      padding: var(--tk-article-card-padding-mobile, var(--tk-space-24));
    }
  }
`;
