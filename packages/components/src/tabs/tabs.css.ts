import { css } from 'lit';

/**
 * tk-tabs styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.tabs` + `tabs` token block («Text tabs;
 * active = white pill + `default` shadow inside invisible track»;
 * `active-radius: {rounded.full}`, `active-shadow: default`) + EXPERIENCE.md
 * Tabs/State Patterns rows + the 3.3 PIXEL PROBE of
 * `.playwright-cli/captures/tabs-switcher.png` (374×44, recorded in
 * .playwright-cli/verify/tabs/NOTES.md), which resolved the flagged metrics:
 *
 * - TRACK (probe): the reference paints a GRAY track (#F2F4F7) spanning the
 *   full 44px control height, x≈2..372. DESIGN.md freezes the INVISIBLE track
 *   for the kit (the page surface shows through; the pill + shadow carry the
 *   state) and DESIGN wins over captures — the same ruling as segmented-radio's
 *   frozen one-pill track. The probe's METRICS survive: track height 44px,
 *   pill 40px tall with a 2px block inset, pill horizontal padding ~15px
 *   (→ --tk-space-16).
 * - PILL SHAPE (probe): the reference pill is a rounded rect r≈6–8px; DESIGN's
 *   `{rounded.full}` capsule wins (the system's signature pill register —
 *   radius registers never mix within one component).
 * - ACTIVE PILL: surface-base fill + shadow-default + the 1px border-default
 *   hairline — the tk-button secondary treatment verbatim («surface-base
 *   lifts, shadow collapses to none, hairline keeps the pill edge visible on a
 *   dark canvas»): light shows the white pill + shadow, dark shows the tonal
 *   pill edge. State never rides the pill alone: the 500-weight active text is
 *   the redundancy (the yellow-redundancy rule — here applied to the pill).
 * - TEXT (spec): active = text-primary + body-m-bold (500); inactive =
 *   text-secondary at body-m regular. PROBE NOTE: the reference's inactive
 *   glyphs measure ≈#303131 (the SAME ink as active — the 2.0 vision note's
 *   «#8C8F94» is refuted by pixels); the kit keeps the spec's text-secondary
 *   for the inactive/hover hierarchy and records the delta in NOTES.md.
 * - HOVER (spec pick): inactive text steps to text-primary at the 150ms State
 *   Pattern duration — a TEXT-ONLY transition (see the bar-animation pin).
 *
 * THE BAR-ANIMATION PIN (acceptance): panel swaps animate CONTENT ONLY — the
 * track and the tab bar carry NO animation and no transition except the tab's
 * text-color hover step; the pill SNAPS between tabs (no background/transform
 * motion on any bar element). Pinned structurally in tabs.test.ts against
 * this sheet's cssText.
 *
 * PANEL SWAP TECHNIQUE (spec Design Notes): every tab's panel is a DISTINCT
 * element; activation toggles `hidden`; the panel carries the 24px
 * track→panel rhythm (margin-block-start --tk-space-24, so content never
 * starts flush under the 44px track). A CSS animation on
 * `.panel:not([hidden])` therefore RESTARTS on every activation — an element
 * going display:none → block starts its animations fresh, no keyed re-render
 * or imperative class juggling needed. Curve/duration per AD-9's «tab swaps
 * → expressive standard» mapping: duration-moderate on
 * curve-expressive-standard. Reduced-motion: the token layer already
 * collapses the duration to 0ms; the explicit `animation: none` media query
 * below is the spec's demanded second belt (a 0ms animation can still flash
 * its final keyframe in some engines).
 *
 * Per-component custom properties (`--tk-tabs-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-tabs-pill-fill`   active pill fill  (default surface-base)
 * - `--tk-tabs-text`        inactive text     (default text-secondary)
 * - `--tk-tabs-text-hover`  hovered inactive  (default text-primary — a
 *   DEDICATED hook, deliberately not --tk-tabs-text-active: tint consumers
 *   overriding the text hooks to white would get a text-primary hover that
 *   is 1:1 invisible on the tint; override BOTH text hooks together)
 * - `--tk-tabs-text-active` active text       (default text-primary)
 * - `--tk-tabs-radius`      pill radius       (default radius-full)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the 44px track height (capture-measured; the tab button box = the ≥44px
 *   interactive target, EXPERIENCE A11y floor);
 * - the 2px pill block inset (44px box − 40px probed visual pill);
 * - the 4px swap translate (--tk-space-4 reused as the motion step);
 * - the 1px pill hairline (the button-secondary hairline weight).
 *
 * OVERFLOW EXPECTATION: the track never scrolls; tabs shrink (flex 0 1 auto)
 * and the constrained labels ellipsize (the accessible names keep the full
 * strings). A scrollable strip is a consumer-surface decision (overflow-x on
 * the ancestor), not the track's.
 */
export const tabsStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* --- The invisible track: no background ever paints here (DESIGN). The row
     is also the animation-free zone — the structural pin's subject. --- */
  .track {
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    gap: var(--tk-space-8);
    width: 100%;
    height: 44px;
  }

  /* The tab button IS the ≥44px interactive target; the VISUAL pill paints on
     the ::before pseudo with the probed 2px block inset (44 − 40). Disabled
     tabs are native <button disabled>: not focusable, not clickable, skipped
     by arrows (the spec's pick — unlike the aria-disabled focusable pattern). */
  .tab {
    position: relative;
    display: inline-flex;
    /* SHRINK route (3.3 review finding): flex:none + nowrap spilled long tab
       strips out of narrow hosts (3 tabs / 360px host = 62px over the
       adjacent layout) with the label ellipsis structurally unable to engage.
       Tabs keep their content size while space allows and SHRINK under
       constraint — no grow: text tabs stay content-sized like the reference,
       never equal segments. min-width:0 lets the button itself shrink so the
       label's ellipsis finally engages. */
    flex: 0 1 auto;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: var(--tk-space-8);
    margin: 0;
    padding-inline: var(--tk-space-16);
    border: none;
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-tabs-text, var(--tk-color-text-secondary));
    white-space: nowrap;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    /* The ONE bar-side transition: the text-color hover step (EXPERIENCE State
       Patterns, 150ms). Background/shadow/transform are pinned motion-free —
       the pill snaps, the bar never animates a swap. */
    transition: color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .tab:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  .tab:disabled {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  /* Hover (inactive, enabled only): ONE token step at 150ms on a DEDICATED
     hook — NOT the active-text hook: tint consumers that override the text
     hooks to white would get a text-primary-defaulted hover that is 1:1
     invisible against the tint (3.3 review finding, proven live on the
     charcoal panel). The text-primary default is cross-theme-safe (dark
     remap); tint surfaces override BOTH text hooks together. */
  .tab:not([aria-selected='true']):not(:disabled):hover {
    color: var(--tk-tabs-text-hover, var(--tk-color-text-primary));
  }

  /* The visual pill — painted BELOW the label (pseudo precedes content), NO
     transition: activation moves it with zero bar motion (the pin). */
  .tab::before {
    content: '';
    position: absolute;
    inset-block: 2px;
    inset-inline: 0;
    box-sizing: border-box;
    border-radius: var(--tk-tabs-radius, var(--tk-radius-full));
  }

  /* ACTIVE: white pill + default shadow inside the invisible track (DESIGN).
     The border-default hairline is the button-secondary dark-canvas belt:
     in dark, surface-base-on-surface-base + shadow:none would leave the pill
     invisible — the hairline keeps the tonal edge (the 500-weight text stays
     the redundant state carrier either way). */
  .tab[aria-selected='true'] {
    color: var(--tk-tabs-text-active, var(--tk-color-text-primary));
    font-weight: var(--tk-text-body-m-bold-weight);
  }

  .tab[aria-selected='true']::before {
    background: var(--tk-tabs-pill-fill, var(--tk-color-surface-base));
    box-shadow: var(--tk-shadow-default);
    border: 1px solid var(--tk-color-border-default);
  }

  /* Long labels truncate visually (ellipsis); the accessible name keeps the
     full string (and the badge count with it). POSITIONED so the label
     paints ABOVE the pill pseudo (tree order among positioned boxes — the
     tk-button label mold; without it the white pill covers the active tab's
     text, caught by the 3.3 side-by-side pixel probe). */
  .tab__label {
    position: relative;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* The nested count chip rides the same paint rule: positioned, above the
     pill (the active tab's badge would vanish under it otherwise). flex:none
     keeps the chip unsquashed while the label absorbs the shrink. */
  .tab > tk-badge {
    position: relative;
    flex: none;
  }

  /* --- Panels: distinct per-tab elements; the hidden attribute toggling both
     removes an inactive panel from the tab order / a11y tree AND restarts the
     visible one's swap animation (display:none → block restarts CSS
     animations). The margin-block-start is the track→panel rhythm: panel text
     never starts flush under the 44px track. --- */
  .panel {
    display: block;
    margin-block-start: var(--tk-space-24);
  }

  .panel[hidden] {
    display: none;
  }

  /* The swap: content-only fade + 4px rise on the expressive-standard curve
     (AD-9 «tab swaps → expressive standard», moderate duration). */
  .panel:not([hidden]) {
    animation: tk-tabs-panel-swap var(--tk-motion-duration-moderate) var(--tk-motion-curve-expressive-standard);
  }

  @keyframes tk-tabs-panel-swap {
    from {
      opacity: 0;
      transform: translateY(var(--tk-space-4));
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  /* Reduced motion — explicit second belt (the token layer already collapsed
     the duration to 0ms; none kills any final-keyframe flash). */
  @media (prefers-reduced-motion: reduce) {
    .panel:not([hidden]) {
      animation: none;
    }
  }
`;
