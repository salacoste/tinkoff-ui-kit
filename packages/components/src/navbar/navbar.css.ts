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
 * MEGA-NAV ROW 2 (Story 7.1) — pixel-probed from
 * `.playwright-cli/captures-v2/invest-stocks/pattern-header-meganav.png`
 * (1280×129; full probe tables in .playwright-cli/verify/mega-nav/NOTES.md):
 * the capture's two rows are y0–63 / y65–128 — BOTH 64px. Row 1 keeps the
 * 72px DESIGN ruling VERBATIM (the 3.4 precedent above; the capture's row-1
 * active indicator is a 2px #666666 stroke under «Инвестиции» x353–428,
 * y62–63 — DESIGN's yellow-100 4px pair wins, the same DESIGN-over-capture
 * ruling, recorded in the NOTES). Row 2 ships the CAPTURE LITERAL 64px —
 * FLAGGED per flag-don't-invent: no token exists (DESIGN has no sub-nav
 * entry; the height rides the `--tk-navbar-subnav-height` hook).
 *
 * - ROW 2 LINKS: body-m, inactive text-secondary (probe: #75–#8A glyph
 *   cores), ACTIVE = 700 text-primary (probe: #333 cores — the same
 *   heading-weight source as row 1) + a 2px underline at the row's bottom
 *   edge (TRUED, story 7.1 triage: the capture DOES paint one — 2px #666666
 *   at y127–128, x150–196 under «Каталог», the row's last 2px; the frozen
 *   «no underline» rested on the initial y118–120 probes, refuted by
 *   extended scanlines + vision). Mechanism mirrors row 1's ::after
 *   (inset-inline space-12, bottom 0) at half the stroke; the stripe is
 *   gray, not yellow — token semantics text-secondary (#616871) vs the
 *   capture's #666666, delta recorded in the NOTES.
 * - DIVIDER between the rows (TRUED with it): the capture paints a 1px
 *   #DDDFE0 hairline at y64 spanning the content container x88–1191 —
 *   implemented as a 1px ::before on .subnav__inner (the container
 *   register), border-default token semantics (#E7E8EA vs #DDDFE0,
 *   recorded). Only the sub-nav row carries it — without subLinks the
 *   sheet is byte-identical v1 (no divider node exists).
 * - REGISTER: .subnav__inner mirrors .bar__inner's container math exactly
 *   (max-width container, auto margins, space-24 padding) — the sub-nav
 *   link BOXES start at the same content-box register where row 1's flow
 *   starts (probe: row-2 links from x88 == the container content edge ==
 *   the logo's left edge; row-1 link TEXT starts x124 only because the
 *   logo occupies the first slot — the spec's «row-1 LINK register» is
 *   this container register, NOT the post-logo text position).
 * - ONE STICKY UNIT: .bar wraps BOTH rows — the sticky/z, the
 *   data-scrolled shadow + hairline, and the fill all sit on .bar, so the
 *   shadow paints under the LAST row (row 2 when present, v1-identical
 *   row 1 otherwise). With subLinks the fixed 72px .bar height becomes
 *   auto (.bar--subnav) and each row carries its own explicit height.
 * - <768px: .subnav display:none — the sub-nav is DESKTOP-ONLY chrome
 *   (the mobile capture shows no sub-nav; the drawer stays v1's row-1
 *   model), and .bar--subnav .bar__inner drops to the mobile 56px token.
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
 * - `--tk-navbar-subnav-height`  row-2 height      (default 64px — CAPTURE
 *   LITERAL, flagged: no token exists)
 * - `--tk-navbar-sublink`        row-2 inactive    (default text-secondary)
 * - `--tk-navbar-sublink-hover`  row-2 hovered     (default text-primary)
 * - `--tk-navbar-sublink-active` row-2 active      (default text-primary)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 4px indicator weight (spec-fixed), the 44px burger box (the
 * ≥44px interactive-target floor), the underline's inline inset reusing
 * the link's own padding token (the indicator spans the padded hit box),
 * and the row-2 64px height (capture literal — see MEGA-NAV above).
 *
 * Z vocabulary: exactly ONE consumption — the sticky bar's `--tk-z-nav`
 * (a scale token; the drawer's z is the overlay controller's, never ours).
 */
export const navbarStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
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
  .sublink:focus-visible,
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

  /* --- Sub-nav row 2 (Story 7.1 — mega-nav) ---------------------------------- */
  /* The bar grows to its rows' own heights: row 1 keeps its DESIGN 72px via
     the explicit .bar__inner height (the v1 .bar__inner height:100% only
     resolves against the fixed 72px .bar; with the wrapper at auto the row
     must carry the height itself). Sticky/z, the scrolled shadow + hairline,
     and the fill all stay ON .bar — the shadow paints under the LAST row. */
  .bar--subnav {
    height: auto;
  }

  .bar--subnav .bar__inner {
    height: var(--tk-navbar-height, 72px);
  }

  /* 64px = the CAPTURE LITERAL (pattern-header-meganav.png row 2 spans
     y65–128; see the file header) — FLAGGED: no token exists, so the value
     rides this hook (override per instance, not per theme). */
  .subnav {
    height: var(--tk-navbar-subnav-height, 64px);
  }

  /* The row-2 REGISTER: the SAME container math as .bar__inner (max-width
     container, auto margins, space-24 inline padding) — the sub-nav link
     boxes start at the content-box register where row 1's flow starts
     (probe: row-2 links x88 == the container edge, NOT the row-1 post-logo
     text position x124). DIVIDER between the rows (TRUED, story 7.1
     triage): the reference paints a 1px hairline ON the seam spanning the
     CONTAINER register only (probe: y64, x88–1191 — nothing outside it),
     so it is a ::before on this container box, NOT a .subnav border (a
     border there would span the full bar width) and NOT on .bar (v1's
     bottom hairline must stay where it is). Token semantics:
     border-default (#E7E8EA) vs the capture's #DDDFE0 — nearest token,
     delta recorded in verify/mega-nav/NOTES.md. Without subLinks none of
     these nodes render — v1 stays byte-identical, no divider. */
  .subnav__inner {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    max-width: var(--tk-space-container);
    height: 100%;
    margin-inline: auto;
    padding-inline: var(--tk-space-24);
  }

  .subnav__inner::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: 0;
    height: 1px;
    background: var(--tk-color-border-default);
  }

  /* Plain text links — the .link mold: full-row-height hit target (≥44px),
     padding-inline for the gap rhythm (probe: ~26px between row-2 label
     ends ≈ the two space-12 paddings), the label span as the shrinking
     ellipsis child (the .link__label precedent — an inline-flex anchor's
     own text-overflow never engages). position:relative anchors the ACTIVE
     underline's ::after exactly as .link anchors row 1's. */
  .sublink {
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
    color: var(--tk-navbar-sublink, var(--tk-color-text-secondary));
    text-decoration: none;
    transition: color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .sublink__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sublink:hover {
    color: var(--tk-navbar-sublink-hover, var(--tk-color-text-primary));
  }

  /* ACTIVE (TRUED, story 7.1 triage): 700 text-primary + a 2px underline at
     the row's bottom edge — the reference DOES paint one (probe: 2px
     #666666 at y127–128, x150–196 under «Каталог» — the row's last 2px;
     the initial y118–120 probes missed it, vision + extended scanlines
     found it). The mechanism mirrors row 1's ::after verbatim
     (inset-inline space-12 = the label box, bottom 0) at HALF the stroke
     and WITHOUT a yellow: the reference stripe is gray — token semantics
     text-secondary (#616871) vs the capture's #666666, delta recorded in
     verify/mega-nav/NOTES.md. */
  .sublink[aria-current='page'] {
    color: var(--tk-navbar-sublink-active, var(--tk-color-text-primary));
    font-weight: var(--tk-text-heading-2-weight);
  }

  .sublink[aria-current='page']::after {
    content: '';
    position: absolute;
    inset-inline: var(--tk-space-12);
    bottom: 0;
    height: 2px;
    background: var(--tk-color-text-secondary);
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

    /* The sub-nav row is DESKTOP-ONLY chrome (the mobile capture shows no
       row 2; the drawer stays v1's row-1 model) — display:none also drops
       its links from the tab order and the axe/landmark surface. */
    .subnav {
      display: none;
    }

    /* The .bar--subnav .bar__inner explicit height (72px, above) would
       out-specify the mobile flip — restate it at the same (0,2,0) here so
       the mobile bar keeps its 56px probe height with the sub-nav gone. */
    .bar--subnav .bar__inner {
      height: var(--tk-navbar-height-mobile, 56px);
    }

    .burger {
      display: inline-flex;
    }
  }
`;
