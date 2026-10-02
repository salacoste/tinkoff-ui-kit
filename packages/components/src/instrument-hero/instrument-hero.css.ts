import { css } from 'lit';

/**
 * tk-instrument-hero styles — tokens only (FR-1), zero theme branches
 * (AD-3). The four gradient families ride the 22.5 invest identity stop
 * tokens (minted theme-invariant — the charcoal mold; the AC's «inline
 * gradients» letter was corrected at execution: the FR-1 zero-hardcoded
 * guard bans gradient literals in component sheets AND stories, so the
 * identity fills ride the token layer like every kit identity color
 * before them — warm-cream, deltas, tint-brown).
 *
 * PIXEL TABLE (spec 22.5 — the five-hero anatomy pass: contact-sheet
 * vision lens + pixel arbitration on .playwright-cli/captures-v4/invest/
 * {stock-sber, bond-ru000a0jxts9, etf-tven, future-aez6,
 * currency-usd000utstom}.png, all probes at native 1x):
 *
 * | capture | measurement | kit decision |
 * |---|---|---|
 * | card radius | corner-arc scan converges at y≈17–24px (all five cards) | `--tk-radius-xl` 24px — byte-fit, no deviation |
 * | card padding | name ink starts x=27, y=28 (left/top); star right edge ≈26 from the rim | `--tk-space-24` (measured 27–28 → nearest step, +3px recorded) |
 * | card height | 180–250px content-driven (USD 180 … future 250) | min-height 188px capture literal (the sber/USD midpoint), hook-carried |
 * | name | ink band 28–51 → ≈26–27px weight 700 white | heading-4 28px (+1px recorded) + weight 700 literal (the live bold; the register's heading-4 is 500 — deviation recorded, the data-table bold precedent) |
 * | ticker | ~12–13px at ~50% white beside the name (superscript) | body-s 13px, FULL white — the live 50% alpha is raised to 100% (AA-max discipline, the kv-list gray-label precedent; deviation recorded) |
 * | metric label | 13px ink band y=115–120 at ~85% white | body-s, full text color (the same 85%→100% raise, recorded) |
 * | metric value | ink band y=140–152 → 15–16px semibold | body-m bold 500 register (−0.5px recorded) |
 * | logo roundel | solid disc, vertical extent 44–137px, horizontal 400–497 → 94–98px, right gap ≈46px, vertically centered | 96px capture literal (probe 94–98), inset `--tk-space-48` (Δ2), absolute right + top 50% |
 * | star (action) | outline ~19–20px, top-right inside the padding | consumer slot button — the atom places, never owns (favorite state is portfolio data) |
 * | stock gradient | #2E970A left → #257A08 right, horizontal | `invest-stock-a/b` tokens, 90deg |
 * | bond gradient | #009E4D TL → #00813E BR, diagonal | `invest-bond-a/b` tokens, 135deg |
 * | dark gradient | #0E0E0E → #3B3B3B (future; the etf card runs the same stops with a steeper vertical tilt — one family approximates both, recorded) | `invest-dark-a/b` tokens, 90deg |
 * | light gradient | #EEF0F2 left → #D1D3D5 right (edge-extrapolated) | `invest-light-a/b` tokens, 90deg; text flips to ink-300 (11.06:1 → 8.42:1 ✓) |
 *
 * AA HONESTY (pinned in the token layer, TOKENS.md): white text on the
 * green families reads 3.785:1 (stock-a) / 3.500:1 (bond-a) — body-s
 * sizes RECORDED-FAILING; the live identity gradient is immutable, the
 * hero ships it as-measured, and the 28px/700 name clears AA-large on
 * both stops. The kit raises the live 85%/50% alphas to full white
 * before pinning (the AA-max discipline — kv-list's gray label). A
 * consumer overriding the fill via `--tk-instrument-hero-bg` owns their
 * own AA. Text polarity is THEME-INVARIANT by design: `--tk-color-white`
 * and `--tk-color-ink-300` are scale tokens that never re-declare in
 * the dark layer — the light-tone card stays ink-read in dark theme
 * (a `text-primary` default would flip white-on-gray and vanish).
 *
 * `--tk-instrument-hero-*` HOOKS (CONVENTIONS §6), each consumed WITH
 * its measured/token default — the override contract the AC froze:
 * - `--tk-instrument-hero-bg` card fill (tone default; a set value replaces the gradient wholesale)
 * - `--tk-instrument-hero-radius` card radius (radius-xl)
 * - `--tk-instrument-hero-padding` content inset (space-24)
 * - `--tk-instrument-hero-min-height` card floor (188px capture literal)
 * - `--tk-instrument-hero-logo-size` the logo disc diameter (96px capture literal)
 * - `--tk-instrument-hero-logo-inset` logo offset from the right edge (space-48)
 * - `--tk-instrument-hero-gap` name↔ticker↔action spacing (space-8)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 700 name weight (live bold — headings 1–2 carry 700, no
 * 28px/700 slot exists), the 188px min-height and 96px logo diameter
 * (capture literals — no tokens exist for card metrics), and the 135deg
 * bond diagonal (an angle, not a scale value).
 */

export const instrumentHeroStyles = css`
  :host {
    display: flex; /* column card — the body row stretches to the floored height */
    flex-direction: column;
    position: relative;
    box-sizing: border-box;
    min-height: var(--tk-instrument-hero-min-height, 188px);
    padding: var(--tk-instrument-hero-padding, var(--tk-space-24));
    border-radius: var(--tk-instrument-hero-radius, var(--tk-radius-xl));
    background: var(--tk-instrument-hero-bg, linear-gradient(
      90deg,
      var(--tk-color-invest-stock-a),
      var(--tk-color-invest-stock-b)
    ));
    color: var(--tk-color-white);
    font-family: var(--tk-font-body);
    overflow: hidden; /* the logo disc and gradient corners clip to the radius */
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* Tone fills — the four measured families (token-bearing gradients,
     FR-1-clean). Text polarity rides the same rules: white on the
     stock/bond/dark gradients, ink-300 on the light one (theme-invariant
     scale tokens — the card reads identically in dark theme). */
  :host([tone='bond']) {
    background: var(--tk-instrument-hero-bg, linear-gradient(
      135deg,
      var(--tk-color-invest-bond-a),
      var(--tk-color-invest-bond-b)
    ));
  }

  :host([tone='dark']) {
    background: var(--tk-instrument-hero-bg, linear-gradient(
      90deg,
      var(--tk-color-invest-dark-a),
      var(--tk-color-invest-dark-b)
    ));
  }

  :host([tone='light']) {
    background: var(--tk-instrument-hero-bg, linear-gradient(
      90deg,
      var(--tk-color-invest-light-a),
      var(--tk-color-invest-light-b)
    ));
    color: var(--tk-color-ink-300);
  }

  /* The card body: name block pinned top, metric pinned bottom (the
     auto margin), the logo disc riding the right edge. The host's flex
     column stretches this row to the card floor. */
  .hero {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    gap: var(--tk-instrument-hero-gap, var(--tk-space-8));
  }

  .hero__head {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--tk-instrument-hero-gap, var(--tk-space-8));
  }

  /* The title row: name + ticker side by side (the live superscript —
     the ticker aligns to the top of the name line), wrapping for the
     long future-page names. The max-width stops text BEFORE the logo
     disc's corridor — the metric's 60% cap is the same protection; the
     review-lens round caught the first draft letting a long name run
     under the disc (inset + size reserve ≈24px clear at any width). */
  .hero__title {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--tk-instrument-hero-gap, var(--tk-space-8));
    max-width: calc(
      100% - var(--tk-instrument-hero-logo-inset, var(--tk-space-48)) -
        var(--tk-instrument-hero-logo-size, 96px)
    );
    min-width: 0; /* long names wrap, never push the action out */
  }

  /* A DIV, deliberately not a heading — the h-level is the consumer's
     document structure (the name slot override carries it; the live
     empty-h1 bug is the recorded negative). */
  .hero__name {
    font-size: var(--tk-text-heading-4-size);
    font-weight: 700; /* the live bold — structural, header notes */
    line-height: var(--tk-text-heading-4-leading);
    color: inherit;
  }

  /* The heading channel rides THROUGH, typography stays the card's: a
     slotted h1–h6 keeps its document semantics but drops the UA chrome
     (margin-block, the 1.5em sizing) that would break the measured 28px
     band — the bond story slots a real h2 and the first mint carried
     its ~42px UA size plus ~35px margins straight into the card. */
  .hero__name ::slotted(h1, h2, h3, h4, h5, h6) {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  .hero__ticker {
    align-self: flex-start; /* the superscript seat beside the name */
    margin-top: 4px; /* optically centers the 13px ticker against the 28px name cap */
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: 1.45;
    color: inherit;
  }

  .hero__action {
    flex: none;
    margin-left: auto;
  }

  /* The metric block: label over value, bottom-left. Rendered only while
     the metric slot carries real content (the empty-state slot-presence
     mold — an empty flex item would fake the card rhythm). */
  .hero__metric {
    margin-top: auto; /* pins the metric to the card floor */
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 60%; /* keeps the value clear of the logo disc */
  }

  .hero__metric-label {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: 1.45;
    color: inherit;
  }

  .hero__metric-value {
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: 24px; /* capture literal — the data-table leading family */
    color: inherit;
  }

  /* The logo disc: right edge, vertically centered (the live seat).
     The slot content paints the disc — a brand asset, an emblem, a flag
     (consumer property, PD keeps the kit neutral); the wrapper clips it
     round and sizes it. */
  .hero__logo {
    position: absolute;
    top: 50%;
    right: var(--tk-instrument-hero-logo-inset, var(--tk-space-48));
    width: var(--tk-instrument-hero-logo-size, 96px);
    height: var(--tk-instrument-hero-logo-size, 96px);
    transform: translateY(-50%);
    border-radius: var(--tk-radius-full);
    overflow: hidden;
  }

  .hero__logo ::slotted(img),
  .hero__logo ::slotted(svg) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
