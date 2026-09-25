import { css } from 'lit';

/**
 * tk-service-card styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.card-service` (radius xl, padding
 * space-24) + EXPERIENCE.md Component Patterns (ServiceCard row: text link
 * is the action; icon decorative aria-hidden) + the 2.0 capture notes §
 * ServiceCard (service-card-grid.png, 1280×361):
 *
 * - RADIUS/PADDING (DESIGN frozen): radius-xl 24, padding space-24 — the
 *   capture reads ~24px radius / ~28–40px asymmetric padding; the DESIGN
 *   symmetric systematization wins (xxl belongs to the big promo/feature
 *   register — the two card registers never mix).
 * - FILL (probe): ~#F5F6F8 → tint-gray (the family default), flat — no
 *   shadow on tinted surfaces.
 * - ICON (probe): 44×44 rounded-square ~12px radius → the slot wraps a
 *   fixed track consuming radius-md (12px) at the ≥44px square; the
 *   projected art is the consumer's (kit ships no icon set).
 * - HEADING (probe): near-black ~24px 600–700 → heading-5 (24px; kit
 *   weight discipline caps card headings at 500).
 * - BODY (probe): ~#33383D 16px/24px 3 lines → body-m at text-secondary.
 * - LINK (probe): brand blue 16px, no underline — the consumer's slotted
 *   tk-link standalone; pinned BOTTOM across description lengths via
 *   margin-top:auto.
 *
 * Per-component custom properties (`--tk-service-card-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-service-card-fill`     card fill          (default: per-variant tint)
 * - `--tk-service-card-text`     heading color      (default text-primary; white on charcoal)
 * - `--tk-service-card-text-muted` description color (default text-secondary; white on charcoal)
 * - `--tk-service-card-radius`   card radius        (default radius-xl)
 * - `--tk-service-card-padding`  card padding       (default space-24)
 * - `--tk-service-card-padding-mobile` <768px padding (default space-20 — the responsive matrix's one-step drop)
 * - `--tk-service-card-icon-radius` icon tile radius (default radius-md)
 * - `--tk-service-card-link`      action link color (default the on-tint AA
 *   step link-on-tint; white on charcoal)
 *
 * LINK DELIVERY (review finding 5 — why a re-scope remains): the action is
 * a SLOTTED tk-link, and tk-link resolves --tk-color-link inside ITS OWN
 * shadow root — the only cross-boundary channel that reaches it is a
 * custom-property re-scope (slotted content inherits through the FLAT
 * TREE: slot → .card__actions → .card → host, AD-2's sanctioned
 * mechanism). The re-scope lives on the ACTIONS ZONE only (not the whole
 * card — consumer link overrides elsewhere in the card are untouched) and
 * is SOURCED from the own-grammar hook above, so consumers theme this
 * card's action link through `--tk-service-card-link` like every other
 * slot.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 767px breakpoint (the navbar's mobile flip) and the icon
 * tile's space-48 square (the ≥44px decorative floor, the capture's 44px
 * track grown to the family's 48px rhythm).
 */
export const serviceCardStyles = css`
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
    padding: var(--tk-service-card-padding, var(--tk-space-24));
    border-radius: var(--tk-service-card-radius, var(--tk-radius-xl));
    background: var(--tk-service-card-fill, var(--tk-color-tint-gray));
    color: var(--tk-service-card-text, var(--tk-color-text-primary));
    font-family: var(--tk-font-body);
  }

  /* --- Tint auto-pairing: per-tint token consumption (no theme branches) --- */

  :host([variant='bluegray']) .card {
    background: var(--tk-service-card-fill, var(--tk-color-tint-bluegray));
  }

  :host([variant='mint']) .card {
    background: var(--tk-service-card-fill, var(--tk-color-tint-mint));
  }

  :host([variant='beige']) .card {
    background: var(--tk-service-card-fill, var(--tk-color-tint-beige));
  }

  /* Charcoal pairs WHITE text (DESIGN Colors; the tint is theme-invariant);
     the action link follows through its hook — white beats the on-tint blue
     on the dark fill. */
  :host([variant='charcoal']) .card {
    background: var(--tk-service-card-fill, var(--tk-color-tint-charcoal));
    color: var(--tk-service-card-text, var(--tk-color-white));
  }

  :host([variant='charcoal']) .card__description {
    color: var(--tk-service-card-text-muted, var(--tk-color-white));
  }

  :host([variant='charcoal']) .card__actions {
    --tk-color-link: var(--tk-service-card-link, var(--tk-color-white));
  }

  /* --- Anatomy --------------------------------------------------------------- */

  /* Decorative icon tile: the CONTAINER is aria-hidden (set in the
     template) — the projected art announces nothing. */
  .card__icon {
    display: flex;
    width: var(--tk-space-48);
    height: var(--tk-space-48);
    margin-bottom: var(--tk-space-16);
    border-radius: var(--tk-service-card-icon-radius, var(--tk-radius-md));
    overflow: hidden;
  }

  .card__icon ::slotted(*) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card__heading {
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-5-size);
    font-weight: var(--tk-text-heading-5-weight);
    line-height: var(--tk-text-heading-5-leading);
  }

  .card__description {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-service-card-text-muted, var(--tk-color-text-secondary));
  }

  /* The action zone: the consumer's slotted tk-link standalone; pinned
     BOTTOM across description lengths (flex column + margin-top:auto).
     The link re-scope (see the header's LINK DELIVERY note) sources from
     the own-grammar hook — blue-100 fails 4.5:1 on the tint surfaces, so
     the AA on-tint step is the default; charcoal overrides it to white. */
  .card__actions {
    display: flex;
    margin-top: auto;
    padding-top: var(--tk-space-16);
    --tk-color-link: var(--tk-service-card-link, var(--tk-color-link-on-tint));
  }

  /* --- The EXPERIENCE responsive matrix: <768px card padding drops one
     spacing step (24 → 20) — the navbar's breakpoint value. --- */

  @media (max-width: 767px) {
    .card {
      padding: var(--tk-service-card-padding-mobile, var(--tk-space-20));
    }
  }
`;
