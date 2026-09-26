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
 * ART MODE BLEED (Story 10.3) — the reference bento's full-bleed bottom
 * art. CSS-ONLY on the existing anatomy: every rule gated behind
 * `:host([art-mode='bleed'])` (attribute absent/`top` → byte-identical
 * render; the template mints nothing). Probe evidence 2026-09-26,
 * `.playwright-cli/verify/promo-card-10-3/NOTES.md`:
 * - ZONE: flex `order: 2` renders the art BELOW the body (DOM stays
 *   art-first — no template edit); escapes the padding via negative
 *   margins tracking the SAME `--tk-promo-card-padding` chain (a consumer
 *   override propagates; <768 re-tracks the -mobile chain); clipped to the
 *   card's bottom corners (`--tk-promo-card-radius` chain, top corners 0,
 *   overflow hidden); NATURAL height — reference zones vary 208–239px
 *   across five cards (48–59% of card height), never pinned.
 * - ACTIONS OVERLAY: the reference's floating pill — absolute, inset-inline
 *   0, bottom-center. Pill bottom offset PROBED at exactly 32px (hires card
 *   528×408: pill rows 332–375, offset 407−375 = 32 = Δ 0.0; the grid's
 *   five cards agree 5/5) → `var(--tk-space-32)` — the spec's expected
 *   space-12–16 neighborhood is OVERRULED by the probe (NOTES judgment 1).
 * - CTA THEME SAFETY: the charcoal re-scope pair rides the overlay (the
 *   dark layer remaps surface-base to #1A1A1A — the pill would sink into
 *   the art; the exact 7.4 .tkb-stage finding). Charcoal + bleed declare
 *   the IDENTICAL pair — no conflict, both selectors kept (NOTES judgment 5).
 * - NO SCRIM: zero text-over-art pixels in any reference card (text bands
 *   end above the zone; art top at 42–52% of card) — positional
 *   separation, no overlay token (the epics' probe gate).
 * - SLOTTED ART: the reference mold `display:block; width:100%;
 *   height:auto` (natural height; `object-fit` stays unconsumed — no
 *   cover-crop). The spec names `::slotted(img)`; the SVG companion
 *   selector serves inline illustrations (the business showcase slots a
 *   bare `<svg>` — an img-only rule would miss it; recorded).
 * - SKELETON MIRROR: `.sk--art` gets the same order/bleed margins/bottom
 *   radius; aspect 4/3 STAYS (placeholder estimate) and `.sk--cta` KEEPS
 *   margin-top:auto — the placeholder approximates the overlay in flow
 *   (recorded, not re-derived).
 * - NO-ART DEGRADE: without slotted art the zone stays collapsed
 *   (data-has-art unchanged) and the overlay pins over the tint — recorded
 *   acceptable (the no-art row).
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

  /* --- Art mode bleed (Story 10.3) — see the header's ART MODE BLEED
     section for the probe record. Every rule gated on [art-mode='bleed'];
     placed AFTER the anatomy rules so equal-specificity bleed overrides
     (margin-block-end over top mode's space-24) win by source order. --- */

  /* The actions overlay anchors to the card. */
  :host([art-mode='bleed']) .card {
    position: relative;
  }

  /* The zone: BELOW the body (flex order — the DOM stays art-first),
     escaping the padding on negative margins that track the SAME padding
     hooks, clipped to the card's bottom corners. margin-block-end replaces
     top mode's space-24 rhythm (negative — pulls flush to the card edge). */
  :host([art-mode='bleed']) .card__art {
    order: 2;
    margin-inline: calc(-1 * var(--tk-promo-card-padding, var(--tk-space-32)));
    margin-block-end: calc(-1 * var(--tk-promo-card-padding, var(--tk-space-32)));
    overflow: hidden;
    border-radius: 0 0 var(--tk-promo-card-radius, var(--tk-radius-xxl))
      var(--tk-promo-card-radius, var(--tk-radius-xxl));
  }

  /* Slotted art: the reference mold — full width, NATURAL height
     (object-fit unconsumed). The svg companion serves the showcase's
     inline illustration (header note). */
  :host([art-mode='bleed']) .card__art ::slotted(img),
  :host([art-mode='bleed']) .card__art ::slotted(svg) {
    display: block;
    width: 100%;
    height: auto;
  }

  /* The floating pill: absolute overlay (margin-top:auto is void out of
     flow; padding-top:0 kills the top-mode rhythm). Bottom offset probed
     at exactly 32px → space-32 (header record). The re-scope pair — the
     charcoal technique verbatim — keeps the composed tk-button secondary
     WHITE over art in both themes (charcoal + bleed: identical values). */
  :host([art-mode='bleed']) .card__actions {
    position: absolute;
    inset-inline: 0;
    bottom: var(--tk-space-32);
    justify-content: center;
    margin-top: 0;
    padding-top: 0;
    --tk-color-surface-base: var(--tk-promo-card-cta-fill, var(--tk-color-white));
    --tk-color-text-primary: var(--tk-promo-card-cta-text, var(--tk-color-ink-300));
  }

  /* Skeleton mirror: the art placeholder bleeds the same way (aspect 4/3
     stays — placeholder estimate); .sk--cta KEEPS margin-top:auto above —
     the in-flow approximation of the overlay (recorded, not re-derived). */
  :host([art-mode='bleed'][skeleton]) .sk--art {
    order: 2;
    margin-inline: calc(-1 * var(--tk-promo-card-padding, var(--tk-space-32)));
    margin-block-end: calc(-1 * var(--tk-promo-card-padding, var(--tk-space-32)));
    border-radius: 0 0 var(--tk-promo-card-radius, var(--tk-radius-xxl))
      var(--tk-promo-card-radius, var(--tk-radius-xxl));
  }

  /* --- The EXPERIENCE responsive matrix: <768px card padding drops one
     spacing step (32 → 24) — the navbar's breakpoint value. The bleed
     margins re-track the -mobile chain so the zone stays flush (a desktop
     padding override survives the breakpoint — the padding-mobile hook's
     own precedent). --- */

  @media (max-width: 767px) {
    .card {
      padding: var(--tk-promo-card-padding-mobile, var(--tk-space-24));
    }

    :host([art-mode='bleed']) .card__art,
    :host([art-mode='bleed'][skeleton]) .sk--art {
      margin-inline: calc(-1 * var(--tk-promo-card-padding-mobile, var(--tk-space-24)));
      margin-block-end: calc(-1 * var(--tk-promo-card-padding-mobile, var(--tk-space-24)));
    }
  }
`;
