import { css } from 'lit';

/**
 * tk-navbar styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.navbar` (72px height, yellow-100 active
 * indicator) + EXPERIENCE.md Navbar row + the 3.4 PIXEL PROBE of
 * `.playwright-cli/captures/navbar-desktop.png` (1280×64) and
 * `navbar-mobile.png` (360×56 CSS at DPR3), recorded in
 * .playwright-cli/verify/navbar/NOTES.md:
 *
 * - HEIGHT (probe vs DESIGN): the captures measure 64px desktop / 56px
 *   mobile; DESIGN.md freezes 72px and «DESIGN and EXPERIENCE win on
 *   conflict with any capture» — 72px it is (deviation 1 in NOTES). The
 *   mobile 56px has no DESIGN counterpart and ships as the probed value.
 * - BAR: surface-base fill, transparent hairline at rest; past the 10px
 *   threshold the host's `data-scrolled` attribute fades IN shadow-default
 *   + the border-default hairline over the 150ms motion token (instant
 *   under reduced motion — the token layer collapses durations).
 * - LINKS: body-m regular, text-secondary; hover steps to text-primary
 *   (150ms — the State Patterns text step); ACTIVE = 700-weight ink text +
 *   the 4px yellow-100 underline pinned to the bar's bottom edge (sitting
 *   on the border — the spec's noted offset), the AA redundancy pair.
 *   700 comes from a heading weight token (the scale's only 700s — «bold =
 *   500, headings 700/500 only»; DESIGN's own AA table pairs the Navbar
 *   underline with 700-weight ink).
 * - BURGER (<768px, media query per the spec's pick — container queries
 *   deferred): 44px round surface-muted target (reference: 40px #F2F3F5 —
 *   the 44px a11y floor wins), three-bar inline SVG glyph.
 * - DRAWER: full-width bottom sheet anchored by positionFloating on the
 *   bar's bottom edge — surface-base, radius-lg TOP corners (the sheet
 *   hangs from the bar), shadow-popover, internal scroll under the bar
 *   height cap. Entrance = productive-entrance curve (AD-9 overlay
 *   mapping); explicit `animation: none` under reduced motion (the token
 *   layer already collapsed the duration — the belt kills any final-
 *   keyframe flash, the tabs precedent).
 *
 * Per-component custom properties (`--tk-navbar-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-navbar-fill`           bar fill          (default surface-base)
 * - `--tk-navbar-height`         bar height        (default 72px — DESIGN)
 * - `--tk-navbar-height-mobile`  bar height <768px (default 56px — probe)
 * - `--tk-navbar-link`           inactive text     (default text-secondary)
 * - `--tk-navbar-link-hover`     hovered text      (default text-primary)
 * - `--tk-navbar-link-active`    active text       (default text-primary)
 * - `--tk-navbar-underline`      active indicator  (default yellow-100)
 * - `--tk-navbar-burger-fill`    burger chip fill  (default surface-muted)
 * - `--tk-navbar-drawer-fill`    drawer fill       (default surface-base)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 4px indicator weight (spec-fixed), the 44px burger box (the
 * ≥44px interactive-target floor), and the underline's inline inset reusing
 * the link's own padding token (the indicator spans the padded hit box).
 *
 * Z vocabulary: exactly ONE consumption — the sticky bar's `--tk-z-nav`
 * (a scale token; the drawer's z is the overlay controller's, never ours).
 */
export const navbarStyles = css`
  :host {
    display: block;
  }

  /* --- The bar ------------------------------------------------------------- */
  .bar {
    height: var(--tk-navbar-height, 72px);
    background: var(--tk-navbar-fill, var(--tk-color-surface-base));
    /* Transparent at rest: the hairline appears WITH the shadow on scroll. */
    border-bottom: 1px solid transparent;
    transition:
      box-shadow var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard),
      border-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* Sticky bar: the one sanctioned non-overlay z consumption — the bar is
     in-flow (sticky), not a floating surface, and must out-paint page
     content sliding under it. The DRAWER never appears here: its stacking
     is the overlay controller's. */
  :host([sticky]) .bar {
    position: sticky;
    top: 0;
    z-index: var(--tk-z-nav);
  }

  /* Past the threshold (the passive scroll listener flips this attribute):
     shadow-default + hairline fade in over the 150ms token. */
  :host([data-scrolled]) .bar {
    box-shadow: var(--tk-shadow-default);
    border-bottom-color: var(--tk-color-border-default);
  }

  .bar__inner {
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    gap: var(--tk-space-8);
    max-width: var(--tk-space-container);
    height: 100%;
    margin-inline: auto;
    padding-inline: var(--tk-space-24);
  }

  .bar__logo {
    display: flex;
    align-items: center;
    flex: none;
    margin-inline-end: var(--tk-space-48);
  }

  .utilities {
    display: flex;
    align-items: center;
    gap: var(--tk-space-12);
    margin-inline-start: auto;
  }

  /* --- Links ---------------------------------------------------------------- */
  .links {
    display: flex;
    align-items: stretch;
    min-width: 0;
  }

  /* The anchor IS the full-height hit target (the underline sits on the bar's
     bottom edge); shrink-under-constraint like tabs — the LABEL span carries
     the ellipsis (an inline-flex anchor's own text-overflow never engages:
     its text lives in an anonymous box the overflow can't reach; the span is
     the flex child that finally shrinks, the tabs .tab__label mold). */
  .link {
    position: relative;
    display: inline-flex;
    flex: 0 1 auto;
    min-width: 0;
    align-items: center;
    padding-inline: var(--tk-space-12);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-navbar-link, var(--tk-color-text-secondary));
    text-decoration: none;
    transition: color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .link__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link:hover {
    color: var(--tk-navbar-link-hover, var(--tk-color-text-primary));
  }

  .link:focus-visible,
  .drawer__link:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* ACTIVE: the AA redundancy pair — 700-weight ink text + the 4px
     yellow-100 underline pinned to the border edge. Yellow NEVER carries
     the state alone. */
  .link[aria-current='page'] {
    color: var(--tk-navbar-link-active, var(--tk-color-text-primary));
    font-weight: var(--tk-text-heading-2-weight);
  }

  .link[aria-current='page']::after {
    content: '';
    position: absolute;
    inset-inline: var(--tk-space-12);
    bottom: 0;
    height: 4px;
    background: var(--tk-navbar-underline, var(--tk-color-yellow-100));
  }

  /* --- Burger (<768px — media query, container queries deferred) ------------- */
  .burger {
    display: none;
    flex: none;
    align-self: center;
    box-sizing: border-box;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-inline-start: var(--tk-space-8);
    border: none;
    border-radius: var(--tk-radius-full);
    background: var(--tk-navbar-burger-fill, var(--tk-color-surface-muted));
    color: var(--tk-navbar-link-active, var(--tk-color-text-primary));
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .burger:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  .burger svg {
    flex: none;
  }

  /* --- The drawer (bottom sheet; stacking/position/lock/trap are the
     controller's — this sheet only styles its own surface) ------------------- */
  .drawer {
    box-sizing: border-box;
    max-height: calc(100dvh - var(--tk-navbar-height, 72px));
    overflow-y: auto;
    padding: var(--tk-space-8) var(--tk-space-16) var(--tk-space-24);
    background: var(--tk-navbar-drawer-fill, var(--tk-color-surface-base));
    /* POPOVER UA RESET (found at the 3.10 composition; the tk-select panel
       precedent in select.css.ts): the controller mounts this sheet via the
       popover path, and UA [popover] styles it "inset: 0; margin: auto;
       border: solid" — without an author-origin reset the margin:auto
       re-centers the box between the positioner's inline top and the UA
       bottom:0 (a drawer floating ~260px below the bar at 360×800, measured
       live), and the UA border paints a stray dark outline. Author rules win
       over UA regardless of specificity. */
    border: none;
    margin: 0;
    inset: auto;
    border-radius: var(--tk-radius-lg) var(--tk-radius-lg) 0 0;
    box-shadow: var(--tk-shadow-popover);
  }

  .drawer[hidden] {
    display: none;
  }

  /* Entrance: productive-entrance curve (AD-9 overlay mapping), moderate
     duration. positionFloating owns the inline top/left; the transform
     rides on top without fighting it. */
  .drawer:not([hidden]) {
    animation: tk-navbar-drawer-in var(--tk-motion-duration-moderate)
      var(--tk-motion-curve-productive-entrance);
  }

  @keyframes tk-navbar-drawer-in {
    from {
      opacity: 0;
      transform: translateY(var(--tk-space-16));
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer:not([hidden]) {
      animation: none;
    }
  }

  .drawer__content {
    display: block;
  }

  .drawer__nav {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
  }

  /* Drawer links: the same register as bar links, one per row at the ≥44px
     target; the active treatment repeats the redundancy pair (700 weight +
     the 4px underline pinned to the row's bottom edge). */
  .drawer__link {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 44px;
    padding-inline: var(--tk-space-12);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-navbar-link, var(--tk-color-text-secondary));
    text-decoration: none;
  }

  .drawer__link[aria-current='page'] {
    color: var(--tk-navbar-link-active, var(--tk-color-text-primary));
    font-weight: var(--tk-text-heading-2-weight);
  }

  .drawer__link[aria-current='page']::after {
    content: '';
    position: absolute;
    inset-inline: var(--tk-space-12);
    bottom: 0;
    height: 4px;
    background: var(--tk-navbar-underline, var(--tk-color-yellow-100));
  }

  /* --- The breakpoint flip --------------------------------------------------- */
  @media (max-width: 767px) {
    .bar {
      height: var(--tk-navbar-height-mobile, 56px);
    }

    /* The sheet hangs from the MOBILE bar — the height cap must subtract
       the mobile token, not the desktop 72px default above. */
    .drawer {
      max-height: calc(100dvh - var(--tk-navbar-height-mobile, 56px));
    }

    .links {
      display: none;
    }

    .burger {
      display: inline-flex;
    }
  }
`;
