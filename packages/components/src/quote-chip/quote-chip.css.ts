import { css } from 'lit';

/**
 * tk-quote-chip styles — tokens only (FR-1), zero theme branches (AD-3 —
 * the delta tokens themselves carry the dark remaps).
 *
 * GROUNDING TABLE (the 22.1 pixel pass — the hub ticker band of
 * research.png, page y=129–200, 71px strip on the page's #F5F5F5 band
 * ≈ surface-muted #F5F5F6; probe grid in the story-11.x tooling notes):
 * - chip anatomy: roundel ~24px (chip 1: x=123–149), roundel→text gap 6px
 *   (149→155), two-line stack — price ~13–14px semibold graphite
 *   (58,58,58)/(49,49,50), delta ~11px green (17,168,54)=#11A836 /
 *   red (244,56,56)=#F43838; chip content width ≈72px (24+6+42);
 * - band pitch 136px, inter-chip gap ≈64px (136−72) — the band's own
 *   decorative white stem glyph rides the 136 pitch; it is page chrome,
 *   OUT OF SCOPE (spec AC7 out-of-scope list);
 * - REFUTED (lens proposes — pixels decide): «white stadium pills» —
 *   interior probes (30,50)=(245,246,247) EQUAL the between-chips probes
 *   (228,50)=(245,246,247): the hub chip is BARE content, no fill. The
 *   pill default therefore paints nothing; the fill hook exists for the
 *   consumer's tinted contexts (gap-2's field note «small light pill» —
 *   its tint was never located: the strict beige/blue CC hunts over
 *   stock-sber-news.png returned zero pill-sized components, so no tint
 *   is minted or guessed);
 * - DELTA DEVIATION (recorded, not copied): the reference's raw
 *   #11A836/#F43838 are NOT taken — the kit consumes
 *   --tk-color-delta-positive/negative (light #168821/#C40B08, AA
 *   overrides sanctioned on surface-base only — the tokens' own ruling:
 *   green-300 fails surface-muted at 4.210:1; consumers putting pills on
 *   tinted bands own that leg, as the token comments state);
 * - box (gap-2 field note: «light-gray rounded box: logo, price, green
 *   delta»): the live box was NOT pixel-located either (candidate zones
 *   in stock-sber-news.png resolved to photos), so its geometry is a
 *   kit derivation flagged here — surface-base fill + 1px hairline keeps
 *   the delta pair on its sanctioned base surface (a gray FILL would
 *   break the AA sanction leg), radius-md 12px;
 * - overflow: «light-blue pill» (gap-2 #3) → lightblue-100 #ECF1F7, the
 *   scale's own step (live value not captured; nearest token, no mint);
 * - inline `$TOKEN`: the reference's in-body instrument links are the
 *   link-blue family — --tk-color-link consumed, never a scale step
 *   (the tk-link ruling).
 *
 * Per-component hooks (`--tk-quote-chip-*`, CONVENTIONS §6), each
 * consumed WITH its token/measure default:
 * - `--tk-quote-chip-fill`       pill/box fill (default none / surface-base)
 * - `--tk-quote-chip-radius`     container radius (default radius-full; box radius-md)
 * - `--tk-quote-chip-gap`        roundel→text gap (default 6px — the measured step)
 * - `--tk-quote-chip-text`       price text (default text-primary)
 * - `--tk-quote-chip-delta-size` delta font-size (default body-xs — measured ~11px)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule:
 * - the 24px roundel box and the 6px roundel→text gap (band-measured;
 *   the scale's 4/8 steps straddle the measurement — kept verbatim);
 * - the letter roundel's gray-100/gray-600 pair (borrowed from the badge
 *   neutral pair, ≈5.17:1 — the only kit-approved light gray text pair).
 */
export const quoteChipStyles = css`
  :host {
    display: inline-flex;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .chip {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: var(--tk-quote-chip-gap, 6px);
    font-family: var(--tk-font-body);
    color: var(--tk-quote-chip-text, var(--tk-color-text-primary));
    text-decoration: none;
    white-space: nowrap;
  }

  /* A linked chip surfaces its linkness the tk-link way: underline on
     hover and keyboard focus only — never at rest. */
  a.chip:hover,
  a.chip:focus-visible {
    text-decoration: underline;
  }

  /* Unified focus ring (§8) — only the anchor form can ever focus. */
  a.chip:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
    border-radius: var(--tk-quote-chip-radius, var(--tk-radius-full));
  }

  /* --- pill (default): the hub band's bare anatomy — no fill of its own. --- */
  :host([variant='pill']) .chip {
    background: var(--tk-quote-chip-fill, transparent);
    border-radius: var(--tk-quote-chip-radius, var(--tk-radius-full));
  }

  /* --- box: the attached single-quote widget — the derivation flagged in
     the header (base fill + hairline keeps the delta pair AA-sanctioned;
     a gray fill would not). --- */
  :host([variant='box']) .chip {
    padding: var(--tk-space-8) var(--tk-space-12);
    border: 1px solid var(--tk-color-border-default);
    border-radius: var(--tk-quote-chip-radius, var(--tk-radius-md));
    background: var(--tk-quote-chip-fill, var(--tk-color-surface-base));
  }

  /* --- overflow: the «Ещё N» count pill — lightblue-100, the nearest
     scale step to the field note's «light-blue». The fill is a RAW scale
     step (no dark remap), so the text pair must be THEME-INVARIANT: ink on
     the light fill (the badge variants' rule — a themed text-primary would
     flip white in dark and fail on the same lightblue). --- */
  :host([variant='overflow']) .chip {
    padding-inline: var(--tk-space-12);
    border-radius: var(--tk-quote-chip-radius, var(--tk-radius-full));
    background: var(--tk-quote-chip-fill, var(--tk-color-lightblue-100));
    color: var(--tk-quote-chip-text, var(--tk-color-text-on-primary));
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    line-height: var(--tk-text-body-s-leading);
  }

  /* --- inline: the $TOKEN in-body form — link-blue, no fill, caps,
     inheriting the surrounding text size (links live inside sentences —
     the tk-link inline ruling). --- */
  :host([variant='inline']) .chip {
    gap: 0;
    color: var(--tk-color-link);
    font-weight: var(--tk-text-body-s-bold-weight);
  }

  .chip__token {
    text-transform: uppercase;
  }

  /* The roundel box: slotted logo sized into a 24px circle (the band's
     measured roundel); the letter fallback paints the same box. */
  .chip__logo {
    position: relative;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--tk-radius-full);
    overflow: hidden;
  }

  ::slotted([slot='logo']) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--tk-radius-full);
  }

  /* Letter roundel (empty-logo fallback, the carousel placeholder mold):
     the badge neutral pair — gray-100/gray-600, the approved light pair. */
  .chip__letter[hidden] {
    display: none;
  }

  .chip__letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: var(--tk-radius-full);
    background: var(--tk-color-gray-100);
    color: var(--tk-color-gray-600);
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    line-height: 1;
  }

  /* The two-line stack: bold price over the smaller delta (the band's
     anatomy — leading pulls the pair tight, the measured stack ≈26px). */
  .chip__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  .chip__price {
    font-size: var(--tk-text-body-s-bold-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    line-height: var(--tk-text-body-s-leading);
  }

  /* Delta tones — the DERIVED sign classes (up/down/flat); flat carries
     text-secondary so an unsigned string still reads as data, not noise. */
  .chip__delta {
    font-size: var(--tk-quote-chip-delta-size, var(--tk-text-body-xs-size));
    line-height: var(--tk-text-body-xs-leading);
    letter-spacing: var(--tk-text-body-xs-tracking);
  }

  .chip__delta--up {
    color: var(--tk-color-delta-positive);
  }

  .chip__delta--down {
    color: var(--tk-color-delta-negative);
  }

  .chip__delta--flat {
    color: var(--tk-color-text-secondary);
  }
`;
