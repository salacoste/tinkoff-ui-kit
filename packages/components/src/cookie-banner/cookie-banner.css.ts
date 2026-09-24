import { css } from 'lit';

/**
 * tk-cookie-banner styles — TWO sheets, the select/modal two-sheet mold: the
 * mounted CARD is a generated child of tk-cookie-banner's shadow tree with
 * its OWN shadow root, so its styles never leak document-level (CONVENTIONS
 * §6) and travel with it when the controller's fallback path reparents it
 * into the overlay container.
 *
 * - `cookieBannerStyles` — adopted into the tk-cookie-banner host's shadow
 *   root: nothing visible (the host is a state holder; `display: contents`
 *   keeps the element layout-neutral wherever consumers drop it).
 * - `cookieBannerSurfaceStyles` — adopted into the CARD's own shadow root.
 *   `:host` rules are author-origin and reset the popover UA sheet on the
 *   popover mounting path (the select panel / modal surface precedent), and
 *   `[hidden]` is enforced explicitly — the UA hidden rule loses to :host's
 *   display:flex without it (the 6.2 computed-display lesson).
 *
 * PLACEMENT (AD-12 split): the controller owns MOUNTING and z-order (the
 * modal layer token); a viewport-anchored surface's GEOMETRY is the
 * component's own sheet — the exact split tk-modal makes for its centered
 * frame (`position: fixed; inset: 0`), here fixed BOTTOM-LEFT with a 16px
 * gap. No positioning JS, no z values (FR-1).
 *
 * Tokens only (FR-1), zero theme branches (AD-3). Anatomy: the live-captured
 * 212x126 card (202x118 card interior measured at 1x, corner chord
 * probe-verified r=16, see .playwright-cli/verify/cookie-banner/NOTES.md):
 * compact white surface-base card, width fit-content capped at the measured
 * 212px reference width, radius-lg (chord-verified), shadow-default (the
 * floating-card register), body-s 13px text-secondary
 * message, accept = 32px visual stadium pill in surface-field inside a 44px
 * hit box (§8), text-primary 600 label.
 *
 * MOTION: NONE, deliberately (the frozen spec: the reference shows no motion;
 * no transition, no entrance animation — the one kit surface whose every
 * state change is instant; recorded in NOTES.md/cookie-banner).
 *
 * Per-component custom properties (`--tk-cookie-banner-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-cookie-banner-fill`         card fill        (default surface-base)
 * - `--tk-cookie-banner-radius`       card radius      (default radius-lg)
 * - `--tk-cookie-banner-max-width`    message cap      (default 212px — the measured
 *   reference card width; the spec's ~320 estimate trued down, see NOTES.md)
 * - `--tk-cookie-banner-text`         message ink      (default text-secondary)
 * - `--tk-cookie-banner-gap`          message→accept gap (default space-12)
 * - `--tk-cookie-banner-accept-fill`  accept pill fill (default surface-field)
 * - `--tk-cookie-banner-accept-text`  accept label ink (default text-primary)
 * - `--tk-cookie-banner-link`         slotted link ink (default text-secondary)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule (lengths sit outside FR-1's letter by the guard's own documented
 * scope, and none is a token step):
 * - card padding var(--tk-space-16) (crop-measured L≈13/T≈18/B≈6 — the
 *   reference's own inset is ragged; the token step is the flagged pick);
 * - min-width 180px (the spec's flagged literal: the reference card runs
 *   ≈202px; the floor keeps the empty-slot card from collapsing to the pill);
 * - max-width 212px (lengths allowed by the guard's scope; the MEASURED
 *   reference width — the spec's "~320px flagged" estimate trued down by the
 *   standing measured-over-estimate rule, the pagination bar-height
 *   precedent: with 320 the reference copy rendered 320×2 lines, not the
 *   reference's own 202×3);
 * - the 44px accept hit box with the 32px visual pill inside (§8 floor met
 *   by padding the hit area — the navbar drawer-link / pagination page-box
 *   pattern; the pill height is PROBE-MEASURED 32px, not the spec's ~24
 *   estimate — trued in this story, see NOTES.md);
 * - accept label font-weight 600 (capture-measured; the token layer's bold
 *   step is 500 — the reference's own weight is the spec's letter, the
 *   pagination 700 precedent).
 */

/** The host sheet — the host renders nothing of its own. */
export const cookieBannerStyles = css`
  :host {
    display: contents;
  }
`;

/** The CARD sheet, adopted into the card's own shadow root. */
export const cookieBannerSurfaceStyles = css`
  :host {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--tk-cookie-banner-gap, var(--tk-space-12));
    /* Viewport-anchored bottom-left placement (see the file header): fixed
       like tk-modal's centring frame, the geometry this surface owns. The
       16px gap is the FLAGGED house judgment (standard T-Bank placement; the
       live viewport capture did not settle in time to pin it — NOTES.md). */
    position: fixed;
    inset: auto;
    left: var(--tk-space-16);
    bottom: var(--tk-space-16);
    width: fit-content;
    min-width: 180px;
    max-width: var(--tk-cookie-banner-max-width, 212px);
    margin: 0;
    border: none;
    padding: var(--tk-space-16);
    overflow: visible;
    background: var(--tk-cookie-banner-fill, var(--tk-color-surface-base));
    color: var(--tk-cookie-banner-text, var(--tk-color-text-secondary));
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    border-radius: var(--tk-cookie-banner-radius, var(--tk-radius-lg));
    box-shadow: var(--tk-shadow-default);
  }

  /* :host display:flex beats the UA [hidden] rule — enforce closedness (the
     6.2 computed-display pin, asserted by the visual spec). */
  :host([hidden]) {
    display: none;
  }

  /* The message area: the DEFAULT slot's light text nodes inherit the host's
     text-secondary body-s from the SLOT chain; only the slotted ANCHORS need
     explicit rules (::slotted reaches slotted elements only). The pseudo
     lives INSIDE the parens — ::slotted(a:hover), the select sheet's
     ::slotted([role='option']:hover) convention. At rest NO underline (the
     reference link sits plain); underline on hover only (the frozen ruling),
     plus on keyboard focus — the tk-link exception language: the underline
     IS the link register's focus affordance (an ADDITION over the frozen
     "hover only" text for §8 hover-never-the-only-path parity, recorded as
     a story-7.2 judgment). */
  .banner__message {
    min-width: 0;
  }

  ::slotted(a) {
    color: var(--tk-cookie-banner-link, var(--tk-color-text-secondary));
    text-decoration: none;
  }

  ::slotted(a:hover),
  ::slotted(a:focus-visible) {
    text-decoration: underline;
  }

  /* The accept button: the FULL 44px hit box (§8 floor) with the visual
     language painted on the inner pill — the navbar drawer-link / pagination
     page-box pattern. NO hover restyle and NO transition: the frozen
     no-motion ruling (the reference shows a flat affirmative pill). */
  .banner__accept {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-family: var(--tk-font-body);
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .banner__accept-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 var(--tk-space-12);
    border-radius: var(--tk-radius-full);
    background: var(--tk-cookie-banner-accept-fill, var(--tk-color-surface-field));
    color: var(--tk-cookie-banner-accept-text, var(--tk-color-text-primary));
    font-size: var(--tk-text-body-s-size);
    font-weight: 600;
    line-height: var(--tk-text-body-s-leading);
  }

  /* Unified focus ring (§8): 2px token ring, offset 2px, never removed — on
     the hit box itself (the pagination load-more precedent). */
  .banner__accept:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }
`;
