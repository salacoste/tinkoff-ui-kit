import { css } from 'lit';

/**
 * tk-promo-card styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.card-promo` (radius xxl, tint bg,
 * padding space-32) + EXPERIENCE.md Component Patterns (PromoCard row:
 * tint variant sets pairing; CTA carries the action) + the 2.0 capture
 * notes § PromoCard (promo-card-grid.png, 1280×961):
 *
 * - RADIUS/PADDING: radius-xxl 24 (Story 5.6 corrected — pixel-probe of the
 *   archived captures measures 22–24; the 32 vision estimate overruled),
 *   padding space-32 — the DESIGN xxl register is the systematized ruling
 *   for the card family.
 * - TINTS (probe, computed): pastel surfaces incl. the Story 3.6-closed
 *   mint #D0F4F2 / beige #F1EBD6 — consumed via the tint tokens, never
 *   literals.
 * - PAIRING: dark heading/body on pastels (capture ~#191C23/#3E434E →
 *   text-primary/text-secondary), WHITE on charcoal — implemented as
 *   per-tint TOKEN CONSUMPTION (the same rules restyle under the dark
 *   layer's tint overrides; no component theme branches).
 * - HEADING (probe): ~24px 600–700 → heading-5 (24px; kit weight discipline
 *   caps card headings at 500 per DESIGN Typography).
 * - BODY (probe): ~16px → body-m (15px — the kit's card-description slot,
 *   the article-card capture reads 15px exactly).
 * - CTA (probe): white pill bottom-CENTER — the consumer's slotted tk-button
 *   secondary (composed, not reimplemented); the actions zone pins it via
 *   margin-top:auto. The heading/description CENTER to match (the reference's
 *   promo register centers card text — recorded from the side-by-side vision
 *   pass, .playwright-cli/verify/promo-card/NOTES.md deviation 1).
 * - FLAT (DESIGN Elevation): tinted surfaces carry NO shadow — this sheet
 *   declares none.
 *
 * Per-component custom properties (`--tk-promo-card-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-promo-card-fill`     card fill          (default: per-variant tint)
 * - `--tk-promo-card-text`     heading color      (default text-primary; white on charcoal)
 * - `--tk-promo-card-text-muted` description color (default text-secondary; white on charcoal)
 * - `--tk-promo-card-radius`   card radius        (default radius-xxl)
 * - `--tk-promo-card-padding`  card padding       (default space-32)
 * - `--tk-promo-card-padding-mobile` <768px padding (default space-24 — the
 *   EXPERIENCE responsive matrix's «card paddings drop one spacing step»;
 *   separate hook so a desktop override survives the breakpoint, the
 *   tk-navbar height-mobile precedent)
 * - `--tk-promo-card-cta-fill` charcoal CTA pill fill (default white) and
 *   `--tk-promo-card-cta-text` its label (default ink-300) — a PAIR, the
 *   footer-pill precedent. CHARCOAL CTA DELIVERY (review finding 1): the
 *   composed tk-button secondary paints its pill from `--tk-color-surface-base`
 *   (button.css.ts) — the token the DARK layer remaps to #1A1A1A, which is
 *   near-invisible on the THEME-INVARIANT charcoal. The charcoal rule
 *   re-scopes surface-base/text-primary to the hook pair INSIDE the actions
 *   zone only: slotted content inherits custom properties through the FLAT
 *   TREE (slot → .card__actions → .card → host), so the pill stays white
 *   with ink text in BOTH themes and stays themable through the hooks.
 *
 * ART ZONE (review finding 2): the zone is COLLAPSED (display:none, no
 * margin) unless the host carries `data-has-art` — the element toggles that
 * attribute from the art slot's slotchange (the reviewer's attribute pick
 * over :has(); :empty cannot work — the slot element is always a child).
 * No slotted art → the heading sits at the padding register directly.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 767px breakpoint (the navbar's mobile flip), the skeleton
 * block widths/aspect (60% heading, 90% lines, 4/3 art, 40% CTA — layout
 * proportions of the placeholder, not scale values) and the CTA block's
 * space-48 height (the tk-button `card` size the skeleton mirrors).
 */
export const promoCardStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    padding: var(--tk-promo-card-padding, var(--tk-space-32));
    border-radius: var(--tk-promo-card-radius, var(--tk-radius-xxl));
    background: var(--tk-promo-card-fill, var(--tk-color-tint-gray));
    color: var(--tk-promo-card-text, var(--tk-color-text-primary));
    font-family: var(--tk-font-body);
  }

  /* --- Tint auto-pairing: per-tint token consumption (no theme branches) --- */

  :host([variant='bluegray']) .card {
    background: var(--tk-promo-card-fill, var(--tk-color-tint-bluegray));
  }

  :host([variant='mint']) .card {
    background: var(--tk-promo-card-fill, var(--tk-color-tint-mint));
  }

  :host([variant='beige']) .card {
    background: var(--tk-promo-card-fill, var(--tk-color-tint-beige));
  }

  /* Charcoal pairs WHITE text (DESIGN Colors: charcoal pairs white text;
     the tint itself is theme-invariant). */
  :host([variant='charcoal']) .card {
    background: var(--tk-promo-card-fill, var(--tk-color-tint-charcoal));
    color: var(--tk-promo-card-text, var(--tk-color-white));
  }

  :host([variant='charcoal']) .card__description {
    color: var(--tk-promo-card-text-muted, var(--tk-color-white));
  }

  /* Charcoal CTA pair (review finding 1): the slotted tk-button secondary's
     pill is --tk-color-surface-base (dark: #1A1A1A — invisible on the
     theme-invariant charcoal) and its label is --tk-color-text-primary
     (dark: white). Re-scoped to the hook PAIR inside the actions zone —
     flat-tree inheritance carries them into the slotted button. */
  :host([variant='charcoal']) .card__actions {
    --tk-color-surface-base: var(--tk-promo-card-cta-fill, var(--tk-color-white));
    --tk-color-text-primary: var(--tk-promo-card-cta-text, var(--tk-color-ink-300));
  }

  /* --- Anatomy --------------------------------------------------------------- */

  /* Art zone: COLLAPSED without slotted art (the data-has-art attribute the
     element toggles on slotchange — no stray 24px margin when empty). */
  .card__art {
    display: none;
  }

  :host([data-has-art]) .card__art {
    display: flex;
    margin-bottom: var(--tk-space-24);
  }

  .card__art ::slotted(img) {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .card__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .card__heading {
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-5-size);
    font-weight: var(--tk-text-heading-5-weight);
    line-height: var(--tk-text-heading-5-leading);
    text-align: center;
  }

  .card__description {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-promo-card-text-muted, var(--tk-color-text-secondary));
    text-align: center;
  }

  /* The CTA zone: the consumer's slotted tk-button secondary (white pill);
     margin-top:auto pins it BOTTOM-CENTER across varying description lengths. */
  .card__actions {
    display: flex;
    justify-content: center;
    margin-top: auto;
    padding-top: var(--tk-space-24);
  }

  /* --- Skeleton (the shared card pattern): quiet-rail blocks matching the
     final layout; STATIC by design — no shimmer exists, so the
     reduced-motion path is the same render (noted in promo-card.ts).
     Fill is the border-default semantic (5.4 dark sweep): light value
     byte-identical to gray-200 (#E7E8EA), dark remaps to the white-alpha
     tonal step — gray-200 painted near-white blocks in dark. --- */

  .sk {
    background: var(--tk-color-border-default);
  }

  .sk--art {
    aspect-ratio: 4 / 3;
    margin-bottom: var(--tk-space-24);
    border-radius: var(--tk-radius-lg);
  }

  .sk--heading {
    width: 60%;
    height: var(--tk-text-heading-5-size);
    margin-bottom: var(--tk-space-12);
    border-radius: var(--tk-radius-full);
  }

  .sk--line {
    width: 90%;
    height: var(--tk-text-body-m-size);
    margin-bottom: var(--tk-space-8);
    border-radius: var(--tk-radius-full);
  }

  .sk--cta {
    width: 40%;
    height: var(--tk-space-48);
    margin-top: auto;
    border-radius: var(--tk-radius-full);
  }

  /* --- The EXPERIENCE responsive matrix: <768px card padding drops one
     spacing step (32 → 24) — the navbar's breakpoint value. --- */

  @media (max-width: 767px) {
    .card {
      padding: var(--tk-promo-card-padding-mobile, var(--tk-space-24));
    }
  }
`;
