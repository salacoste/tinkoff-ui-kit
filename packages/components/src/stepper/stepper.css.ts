import { css } from 'lit';

/**
 * tk-stepper styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: the PIXEL PROBE of
 * `.playwright-cli/captures-v2/business/pattern-steps-open-account{,-detail}.png`
 * (2026-09-24, runs.awk method, recorded in .playwright-cli/verify/stepper/):
 * 3 WHITE cards (surface-base, probe-measured 336px wide × ~136px, radius 24 —
 * EXACTLY --tk-radius-xl, gap 48 — EXACTLY --tk-space-48) on the page cream;
 * the number = a 56×56 rounded-square badge (probe-fit radius 18 — see the
 * flag below) centered on each card's centerline with its center ON the card's
 * top edge (EXACT half-overlap), white bold numeral; title + text centered
 * under it, both lines the SAME text-primary ink at body-l (the probe refutes
 * a secondary-colored text line — title/text differ by WEIGHT only).
 *
 * THE BROWN BADGE — RESOLVED (story 9.1): the reference badge is #8D6040
 * (probe-measured). At stepper ship time (7.3) no honest-near token existed,
 * so the badge shipped on tint-cream-raised with an ink numeral (the
 * flag-don't-invent disposition, recorded in verify/stepper/NOTES.md). Story
 * 9.1 lands the measured value AS the `tint-brown` token — theme-invariant
 * (the charcoal mold) with white numeral (AA 5.413:1; on tint-cream 4.674:1)
 * — and the badge consumes it directly: the reference's white-on-brown
 * numeral is restored.
 *
 * THE HEADING REGISTER: the reference block heading («Откройте счет для
 * бизнеса», probe-measured ~44px/700 — a 30px dense cap core, refuting the
 * spec's heading-4 guess) maps to heading-2 — the marketing register's own h1
 * slot (TOKENS.md Registers: business = marketing → h1 at heading-2 44/700).
 *
 * MOTION: none — the spec's never-list («no motion on stepper/badges»); the
 * component ships zero transitions/animations (display surface; hover states
 * are absent on cards by the same ruling — «No hover elevation (display)»).
 *
 * Per-component custom properties (`--tk-stepper-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-stepper-heading`   block heading color (default text-primary)
 * - `--tk-stepper-card-fill` card fill          (default surface-base)
 * - `--tk-stepper-card-radius` card radius      (default radius-xl = 24)
 * - `--tk-stepper-badge-fill` number badge fill (default tint-brown — the
 *   measured reference value, story 9.1; theme-invariant)
 * - `--tk-stepper-badge-number` numeral color   (default white — the AA
 *   pairing on brown, 5.413:1)
 * - `--tk-stepper-badge-radius` badge radius    (default radius-lg)
 * - `--tk-stepper-title` step title color       (default text-primary)
 * - `--tk-stepper-text` step text color         (default text-primary — the
 *   probe: both lines the same ink)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the 56×56 badge box with its EXACT half-overlap (probe-measured; the
 *   overlap is computed FROM that box — translate -50% on the card top edge)
 *   and the card's 68px top padding (the badge's 28px below-card half + the
 *   40px badge→copy gap — the composite of the two flagged probe metrics);
 * - the numeral's heading-6 slot (probe-measured ~20px bold — the token ramp
 *   has no 700-weight step at 20px; the delta is recorded in NOTES.md);
 * - the 240px auto-fit column floor (the responsive 1-2-3 collapse of the
 *   reference's fixed 336px row at the standard breakpoints);
 * - the badge→copy 40px gap (probe-measured 38px badge-bottom→title-top; the
 *   token step nearest — --tk-space-40);
 * - the empty-state top rhythm (the badge zone reserves its 28px half even in
 *   the zero state so a heading + empty copy never collapses flush).
 */
export const stepperStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .stepper {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* The block heading — heading-2 (the marketing register's section scale,
     probe-measured ~44/700 centered). Rendered ONLY when the prop is set. */
  .stepper__heading {
    margin: 0;
    text-align: center;
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-2-size);
    font-weight: var(--tk-text-heading-2-weight);
    line-height: var(--tk-text-heading-2-leading);
    color: var(--tk-stepper-heading, var(--tk-color-text-primary));
  }

  /* The equal-height card row — the v1 card-grid mold: grid stretch keeps
     cards equal-height; auto-fit collapses 3→2→1 columns responsively. */
  .stepper__steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--tk-space-48);
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Heading→cards rhythm (the reference's own section gap; also keeps the
     overlap badge's top half clear when a heading is rendered above). */
  .stepper__heading + .stepper__steps {
    margin-block-start: var(--tk-space-64);
    /* The badge's above-card half (28px) needs clearance from the heading —
       the token step nearest that covers it. */
    padding-block-start: var(--tk-space-32);
  }

  /* One step card: white surface, radius 24, centered copy. The padding-top
     reserves the badge's BELOW-card half (28) + the badge→copy gap (40 total
     visual to the first text line per the probe). */
  .step {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 68px var(--tk-space-24) var(--tk-space-40);
    border-radius: var(--tk-stepper-card-radius, var(--tk-radius-xl));
    background: var(--tk-stepper-card-fill, var(--tk-color-surface-base));
    text-align: center;
  }

  /* The number badge: 56×56 rounded square, centered on the card's centerline
     with its center EXACTLY on the card's top edge (the probe's half-overlap)
     — translate(-50%, -50%) against the card top achieves it by construction.
     aria-hidden in the template: the list semantics already announce «item N»,
     the painted numeral is the visual duplicate. */
  .step__badge {
    position: absolute;
    top: 0;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    transform: translate(-50%, -50%);
    border-radius: var(--tk-stepper-badge-radius, var(--tk-radius-lg));
    background: var(--tk-stepper-badge-fill, var(--tk-color-tint-brown));
  }

  .step__number {
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-6-size);
    font-weight: var(--tk-text-heading-6-weight);
    line-height: 1;
    color: var(--tk-stepper-badge-number, var(--tk-color-white));
  }

  /* Title/text: body-l both, SAME ink (probe), weight-only distinction — the
     API's title carries the emphasis, text stays regular. */
  .step__title {
    margin: 0;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    font-weight: var(--tk-text-body-l-bold-weight);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-stepper-title, var(--tk-color-text-primary));
  }

  .step__text {
    margin: var(--tk-space-4) 0 0;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    font-weight: var(--tk-text-body-l-weight);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-stepper-text, var(--tk-color-text-primary));
  }

  /* The optional CTA row under the cards — the UNNAMED slot. The container
     carries NO rhythm until content is assigned: the data-has-cta host
     attribute (toggled by slotchange, the promo-card data-has-art mold) gates
     the margin, so the reference's CTA-less block renders exactly as
     captured. */
  .stepper__cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--tk-space-12);
  }

  :host([data-has-cta]) .stepper__cta {
    margin-block-start: var(--tk-space-40);
  }

  /* Zero state (steps=[]): the documented empty copy slot — never blank. */
  .stepper__empty {
    box-sizing: border-box;
    width: 100%;
    padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-24);
    border-radius: var(--tk-stepper-card-radius, var(--tk-radius-xl));
    background: var(--tk-stepper-card-fill, var(--tk-color-surface-base));
    text-align: center;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-secondary);
  }
`;
