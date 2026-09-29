import { css } from 'lit';

/**
 * tj-rail styles — tokens only, zero theme branches (AD-3 v5 on the ТЖ
 * instance): every color/motion value consumes an inherited `var(--tj-*)`
 * custom property (never adopted into the shadow root — the cascade trap).
 * Light/dark re-theme through the token layer alone.
 *
 * Visual spec: spec 16.5 — the w290 section rail (nav>ul>li>a rows, optional
 * decorative icon tiles) + the burger breakpoint and the full-height sheet.
 * The reference's rail sat behind the cross-origin wall: every structural
 * number below is flagged for the maintainer's side-by-side.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 40px icon-tile box (the probe measured 30px tiles — the spec's 40px
 *   touch-scaled box wins; the 30px VISUAL survives as the slotted-icon
 *   size inside it),
 * - the 44px row/burger hit floors (the family's a11y constant),
 * - the 1199px burger breakpoint (a media query, the spec's explicit pick —
 *   container queries deferred),
 * - the burger's 40×40 visual chip (inset 2px = (44−40)/2, the
 *   compact-inset mold at this family's chip size; chip fill/radius are
 *   AUTHORED picks — unprobed),
 * - the sheet's 86vw mobile clamp (the token carries the 290 anchor itself).
 *
 * NO z-index in this sheet anywhere: the overlay helper owns stacking
 * (AD-12) — it sets var(--tj-z-drawer) inline on the sheet at mount.
 * No backticks in css comments — they would terminate the css literal.
 */
export const railStyles = css`
  :host {
    display: block;
    width: var(--tj-space-rail-sidebar);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .rail {
    font-family: var(--tj-font-ui);
  }

  .rail__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--tj-space-4);
  }

  /* One row = the anchor itself (nav>ul>li>a): tile + label inside it. The
     tile is aria-hidden — the row's accessible name is the label alone.
     min-height 44 = the family's hit floor. The FULL nav-label species rides
     the base (17/700, the probe9 census ×11/11 — every reference row is the
     same weight); current marking is SEMANTIC-ONLY (aria-current, zero visual
     delta — the 2026-09-28 reference capture shows NO visual distinction, and
     unprobed marking is not invented). */
  .row {
    display: flex;
    align-items: center;
    gap: var(--tj-space-12);
    min-height: 44px; /* FLAG: the 44px interactive floor */
    text-decoration: none;
    color: var(--tj-color-ink-100);
    font-family: var(--tj-font-ui);
    font-size: var(--tj-text-nav-label-size);
    font-weight: var(--tj-text-nav-label-weight);
  }

  .row__label {
    white-space: nowrap;
  }

  .row:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* The decorative icon tile: 40×40 box (spec) with the icon-tile radius;
     the slotted art centers at the probed 30px visual. Renders ONLY while
     the slot carries an element — empty tiles collapse (label-only rows are
     the designed default, no 40px holes). */
  .tile {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 40px; /* FLAG: 40px touch-scaled tile (probe: 30px visual) */
    height: 40px; /* FLAG: same box */
    border-radius: var(--tj-radius-icon-tile);
  }

  .tile ::slotted(img),
  .tile ::slotted(svg) {
    display: block;
    width: 30px; /* FLAG: the probed 30px visual inside the 40px box */
    height: 30px; /* FLAG: same */
  }

  .tile--empty {
    display: none;
  }

  /* The burger: 44×44 invisible button (display none at ≥1200 — the rail
     list is the chrome), the 40×40 visual chip painted by ::before at the
     inset (compact-inset mold). NO hover state — unprobed, nothing invented. */
  .burger {
    box-sizing: border-box;
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px; /* FLAG: the family's 44px interactive floor */
    height: 44px; /* FLAG: same floor */
    padding: 0;
    border: none;
    background: transparent;
    color: var(--tj-color-ink-100);
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  .burger::before {
    content: '';
    position: absolute;
    inset-block: 2px; /* FLAG: (44−40)/2 — the chip inset */
    inset-inline: 2px; /* FLAG: same — a 40×40 chip */
    border-radius: var(--tj-radius-control-sm); /* FLAG: authored chip radius */
    background: var(--tj-color-card); /* FLAG: authored chip fill — quiet card on page */
  }

  .burger svg {
    position: relative; /* the glyph paints above the chip */
    display: block;
  }

  .burger:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring);
    outline-offset: 2px;
  }

  /* The sheet: full-height left sheet, w290 (token) with the mobile clamp,
     card ground, overlay shadow, panel radius on the INNER vertical edge
     only (the left edge runs flush into the viewport). Stacking is the
     helper's (z set inline at mount — none declared here, AD-12).
     border/height re-assert the popover-UA base ([popover] paints border:
     solid + height: fit-content — the bank navbar.css mold's own two
     symptoms): author origin beats UA, so the drawer keeps its edge-flush
     geometry on the PRIMARY (top-layer) path, which happy-dom never paints. */
  .sheet {
    box-sizing: border-box;
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    width: min(var(--tj-space-rail-sidebar), 86vw); /* FLAG: the 86vw mobile clamp */
    height: auto; /* stretch: top+bottom pinned + auto height = full height (UA fit-content would clip) */
    margin: 0; /* belt under the popover-UA margin reset */
    border: none; /* the UA [popover] border paints a stray dark outline (bank 3.10) */
    overflow-y: auto;
    padding: var(--tj-space-16) var(--tj-space-24);
    background: var(--tj-color-card);
    box-shadow: var(--tj-shadow-overlay);
    border-start-end-radius: var(--tj-radius-panel); /* FLAG: inner edge only */
    border-end-end-radius: var(--tj-radius-panel); /* FLAG: same edge, bottom corner */
  }

  /* The template drives [hidden]; enforce it against future display tweaks. */
  .sheet[hidden] {
    display: none;
  }

  .sheet__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--tj-space-4);
  }

  /* The burger breakpoint: below 1200 the rail list collapses into the
     burger; the host column collapses with it. The sheet mechanics are NOT
     gated here — programmatic open works at ANY viewport (the spec). */
  @media (max-width: 1199px) {
    :host {
      width: auto;
    }

    .rail__list {
      display: none;
    }

    .burger {
      display: inline-flex;
    }
  }
`;
