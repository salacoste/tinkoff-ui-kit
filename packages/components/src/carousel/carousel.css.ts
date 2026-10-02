import { css } from 'lit';

/**
 * tk-carousel styles (spec 21.6, invest foundation wave).
 *
 * MEASURED TABLE (captures-v4/invest, deterministic ImageMagick
 * connected-component scans, 2026-10-02 — the grounding lens's claims
 * were re-verified pixel-by-pixel and its «white chevron circles» were
 * RETRACTED as hallucination):
 *
 * | fact | value | source |
 * |---|---|---|
 * | card gap | 41px recommendations + education (both rails, both gaps, zero spread); 45px stock-sber | CC scan of card interiors (x-run deltas) |
 * | dot diameter | 8px | 8×8 CC blob, byte-exact |
 * | dot pitch | 16px center-to-center = 8 dot + 8 gap | probe at y5286–5294 |
 * | dots offset | 16px below the rail bottom (card bottom y5270 → dot band y5286) | stock-sber |
 * | dot active | #FFDD2D = `--tk-color-yellow-100` BYTE-IDENTICAL | probe core pixel |
 * | dot inactive | live #E0E2E4 → kit gray-200 #E7E8EA (3-unit deviation, NO token minted) | probe core pixel |
 * | chevrons | NOT PAINTED in any static frame — threshold-corrected scan (≥253 on the #F6F7F8 rails finds zero 16–48px white circles; the white pages carry zero isolated gray glyphs outside text rows). The live site reveals them on hover/focus; the atom ships the reveal contract with the kit's 44px A11y floor + `--tk-shadow-dropdown` (the spec's «существующий dropdown-токен») | scan + spec ruling |
 * | scrollbar | hidden on every grounded rail (zero frames carry one) | scans |
 *
 * Card WIDTH and the rail's edge peek stay CONSUMER-side (the measured
 * references — 248px rec/edu, 230px sber — live in the stories); the
 * atom owns only the chrome above.
 *
 * The scroll is NATIVE (overflow-x + scroll-snap on the rail) — the
 * transform-track architecture is out of scope by the spec's own law,
 * and this sheet pins zero `transform` anywhere.
 */
export const carouselStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden
     (the 8.1 kit-wide sweep). */
  :host([hidden]) {
    display: none;
  }

  .carousel {
    position: relative;
  }

  /* The frame positions the chevrons over the RAIL only — the dots row
     below must not drag the vertical center down. */
  .carousel__frame {
    position: relative;
  }

  /* Native scroll-snap scroller. The SLOT is the flex row: slotted
     cards are the slot's flat-tree children, so gap + flex live ON it
     (the filter-chips .row mold, moved one level down for light-DOM
     cards). Scrollbars hidden — the grounded rails carry none (the
     chevrons/dots are the navigation). */
  .carousel__rail {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .carousel__rail::-webkit-scrollbar {
    display: none;
  }

  .carousel__rail > slot {
    display: flex;
    gap: var(--tk-carousel-gap, 41px);
  }

  .carousel__rail ::slotted(*) {
    flex: none;
    scroll-snap-align: start;
  }

  /* The circular white chevron — revealed on rail hover/focus (the
     measured contract: statics paint none). opacity, NOT display, so
     the buttons stay in the TAB ORDER for keyboard users and reveal on
     their own :focus-visible. 44px = the kit's A11y floor (the
     menu-popover rows law); the shadow is the dropdown token the spec
     names. */
  .carousel__chev {
    position: absolute;
    inset-block: 0;
    margin-block: auto;
    margin-inline: 0;
    padding: 0;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: var(--tk-carousel-chevron-radius, var(--tk-radius-full));
    background: var(--tk-carousel-chevron-fill, var(--tk-color-surface-base));
    color: var(--tk-carousel-chevron-color, var(--tk-color-text-secondary));
    box-shadow: var(--tk-carousel-chevron-shadow, var(--tk-shadow-dropdown));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .carousel__chev--prev {
    inset-inline-start: var(--tk-carousel-chevron-inset, 0px);
  }

  .carousel__chev--next {
    inset-inline-end: var(--tk-carousel-chevron-inset, 0px);
  }

  .carousel__frame:hover .carousel__chev,
  .carousel__frame:focus-within .carousel__chev,
  .carousel__chev:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* Revealed-but-disabled edge state: present but dimmed — never a hard
     disappearance inside an active hover. */
  .carousel__frame:hover .carousel__chev:disabled,
  .carousel__frame:focus-within .carousel__chev:disabled {
    opacity: 0.35;
  }

  .carousel__chev:disabled {
    cursor: default;
  }

  /* Dot pagination — DECORATIVE by the spec's ruling (aria-hidden,
     non-interactive): the chevrons + native scroll are the navigation.
     Active = the existing yellow (byte-identical to the live probe);
     inactive = gray-200 with the recorded 3-unit deviation. */
  .carousel__dots {
    display: flex;
    gap: var(--tk-carousel-dot-gap, var(--tk-space-8));
    margin-block-start: var(--tk-carousel-dot-offset, var(--tk-space-16));
  }

  .carousel__dot {
    flex: none;
    width: var(--tk-carousel-dot-size, 8px);
    height: var(--tk-carousel-dot-size, 8px);
    border-radius: var(--tk-radius-full);
    background: var(--tk-carousel-dot, var(--tk-color-gray-200));
  }

  .carousel__dot--active {
    background: var(--tk-carousel-dot-active, var(--tk-color-yellow-100));
  }
`;
