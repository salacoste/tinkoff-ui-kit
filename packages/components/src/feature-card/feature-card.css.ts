import { css } from 'lit';

/**
 * tk-feature-card styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.card-feature` (radius xxl, min-height
 * 320) + EXPERIENCE.md Component Patterns (FeatureCard row: as PromoCard,
 * 2-up scale; editorial variant supports background art bleed right) + the
 * 2.0 capture notes § FeatureCard (feature-card-platinum.png 552×432,
 * feature-card-tj-banner.png 432×401):
 *
 * - SCALE (DESIGN frozen): min-height 320px, radius-xxl — the 2-up banner
 *  register (the capture's per-card radius readings ranged 16–28, flagged;
 *  the DESIGN xxl ruling covers the family).
 * - HEADING (probe): ~28–30px 700 → heading-4 (28px; kit weight discipline
 *   caps card headings at 500 per DESIGN Typography).
 * - BODY (probe): #FFFFFF ~16px on the slate banners → body-m, white on
 *  editorial (charcoal pairing), text-secondary on pastels.
 * - CTA (probe): white pill, dark text — the consumer's slotted tk-button
 *   secondary; START-aligned (the editorial banner register — promo-card
 *   owns the centered CTA) and pinned bottom via margin-top:auto.
 * - EDITORIAL BLEED (the spec's grid pick, noted over absolute): the
 *  variant flips the card to a two-column grid — body padded in column 1,
 *  art in column 2 STRETCHED to the right edge (card padding collapses;
 *  align-self:stretch fills the column's full height and the zone's flex
 *  justify/align flex-end anchors the ART low-right; border-radius +
 *  overflow clip crop the bleed past the content zone). Without slotted
 *  art the grid stays SINGLE-COLUMN (the data-has-art pick, below).
 * - FLAT (DESIGN Elevation): tinted surfaces carry NO shadow.
 *
 * Per-component custom properties (`--tk-feature-card-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-feature-card-fill`     card fill          (default: per-variant tint; charcoal on editorial)
 * - `--tk-feature-card-text`     heading color      (default text-primary; white on editorial)
 * - `--tk-feature-card-text-muted` description color (default text-secondary; white on editorial)
 * - `--tk-feature-card-radius`   card radius        (default radius-xxl)
 * - `--tk-feature-card-padding`  body padding       (default space-32)
 * - `--tk-feature-card-padding-mobile` <768px padding (default space-24 — the responsive matrix's one-step drop)
 * - `--tk-feature-card-min-height` card min-height  (default 320px)
 * - `--tk-feature-card-cta-fill` editorial CTA pill fill (default white)
 *   and `--tk-feature-card-cta-text` its label (default ink-300) — a PAIR,
 *   the footer-pill precedent. EDITORIAL CTA DELIVERY (review finding 1):
 *   the composed tk-button secondary paints its pill from
 *   --tk-color-surface-base (button.css.ts) — the token the dark layer
 *   remaps to #1A1A1A, near-invisible on the THEME-INVARIANT charcoal. The
 *   editorial rule re-scopes surface-base/text-primary to the hook pair
 *   INSIDE the actions zone only: slotted content inherits custom
 *   properties through the FLAT TREE (slot → .card__actions → .card →
 *   host), so the pill stays white with ink text in BOTH themes and stays
 *   themable through the hooks.
 *
 * ART ZONE (review finding 2): the zone is COLLAPSED (display:none, no
 * margin) unless the host carries `data-has-art` — the element toggles
 * that attribute from the art slot's slotchange (the attribute pick over
 * :has(); :empty cannot work — the slot element is always a child). On the
 * editorial variant the grid also waits for it: no slotted art → the
 * banner stays a SINGLE column (no empty 0.95fr track).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 320px min-height (DESIGN.md `card-feature` literal — carried
 * by the `--tk-feature-card-min-height` hook), the 767px breakpoint (the
 * navbar's mobile flip), the editorial grid ratio (1.05fr/0.95fr — a
 * layout proportion, not a scale value), and the skeleton block
 * widths/heights (60% heading, 90% lines, space-48 CTA — placeholder
 * proportions).
 */
export const featureCardStyles = css`
  :host {
    display: block;
  }

  .card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    min-height: var(--tk-feature-card-min-height, 320px);
    padding: var(--tk-feature-card-padding, var(--tk-space-32));
    border-radius: var(--tk-feature-card-radius, var(--tk-radius-xxl));
    background: var(--tk-feature-card-fill, var(--tk-color-tint-gray));
    color: var(--tk-feature-card-text, var(--tk-color-text-primary));
    font-family: var(--tk-font-body);
  }

  /* --- Tint auto-pairing: per-tint token consumption (no theme branches) --- */

  :host([variant='bluegray']) .card {
    background: var(--tk-feature-card-fill, var(--tk-color-tint-bluegray));
  }

  :host([variant='mint']) .card {
    background: var(--tk-feature-card-fill, var(--tk-color-tint-mint));
  }

  :host([variant='beige']) .card {
    background: var(--tk-feature-card-fill, var(--tk-color-tint-beige));
  }

  /* EDITORIAL = the charcoal register: white heading, white pairing, and the
     two-column grid with the art bleeding right — but the SECOND column only
     exists when art is slotted (data-has-art; no art → single column, review
     finding 2). Padding collapses onto the body column; the card's radius +
     overflow clip crop the bleed. */
  :host([variant='editorial']) .card {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    padding: 0;
    overflow: hidden;
    background: var(--tk-feature-card-fill, var(--tk-color-tint-charcoal));
    color: var(--tk-feature-card-text, var(--tk-color-white));
  }

  :host([variant='editorial'][data-has-art]) .card {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  }

  :host([variant='editorial']) .card__description {
    color: var(--tk-feature-card-text-muted, var(--tk-color-white));
  }

  /* Editorial CTA pair (review finding 1): the slotted tk-button secondary's
     pill is --tk-color-surface-base (dark: #1A1A1A — invisible on the
     theme-invariant charcoal) and its label is --tk-color-text-primary
     (dark: white). Re-scoped to the hook PAIR inside the actions zone —
     flat-tree inheritance carries them into the slotted button. */
  :host([variant='editorial']) .card__actions {
    --tk-color-surface-base: var(--tk-feature-card-cta-fill, var(--tk-color-white));
    --tk-color-text-primary: var(--tk-feature-card-cta-text, var(--tk-color-ink-300));
  }

  /* Stretch fills the column's full height; the zone's flex justify/align
     flex-end anchors the ART low-right against the bleed edge. The second
     rule re-zeroes the anatomy margin at higher specificity — the bleed
     stays flush to the card's bottom-right edge. */
  :host([variant='editorial']) .card__art {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 0;
    overflow: hidden;
  }

  :host([variant='editorial'][data-has-art]) .card__art {
    margin-bottom: 0;
  }

  :host([variant='editorial']) .card__art ::slotted(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :host([variant='editorial']) .card__body {
    grid-column: 1;
    grid-row: 1;
    padding: var(--tk-feature-card-padding, var(--tk-space-32));
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
    font-size: var(--tk-text-heading-4-size);
    font-weight: var(--tk-text-heading-4-weight);
    line-height: var(--tk-text-heading-4-leading);
  }

  .card__description {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-feature-card-text-muted, var(--tk-color-text-secondary));
  }

  /* The CTA zone: START-aligned (the banner register) and pinned bottom via
     margin-top:auto — the consumer's slotted tk-button secondary carries it. */
  .card__actions {
    display: flex;
    justify-content: flex-start;
    margin-top: auto;
    padding-top: var(--tk-space-24);
  }

  /* --- Skeleton (the shared card pattern): gray-200 blocks matching the
     final layout; STATIC by design (no shimmer — reduced-motion-safe). --- */

  .sk {
    background: var(--tk-color-gray-200);
  }

  .sk--heading {
    width: 60%;
    height: var(--tk-text-heading-4-size);
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
      padding: var(--tk-feature-card-padding-mobile, var(--tk-space-24));
    }

    :host([variant='editorial']) .card__body {
      padding: var(--tk-feature-card-padding-mobile, var(--tk-space-24));
    }
  }
`;
