import { css } from 'lit';

/**
 * tk-note styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 21.4, GAP-MAP A6), measured at execution 2026-10-02
 * on captures-v4/invest (bonds-list.png right rail, native-scale reads +
 * pixel probes; the first downscaled sheet read INVERTED figure/ground —
 * the card is WHITE, the PAGE is gray, confirmed by direct probes):
 * - card fill #FFFFFF on a #F6F7F8 page → var(--tk-color-surface-base)
 *   floating on surface-muted (the STORY paints the muted page — the
 *   atom owns only the card; hook --tk-note-fill carries overrides);
 * - radius ≈16–20 → var(--tk-radius-lg) (16, nearest scale step);
 * - padding ≈24/24/24/28 → space-24 uniform (28 snapped down);
 * - fine print ~14px/1.43 #8C8C8C, ~6 lines → body-s (13/1.5) on
 *   text-secondary: the live #8C8C8C is 3.36:1 on white (AA FAIL for
 *   body text) — the kit's secondary token wins, deviation recorded;
 * - collapsed live text shows ~5 lines + a gradient fade; the kit's
 *   legible equivalent is a hard 3-line clamp with its native ellipsis
 *   (spec AC2 froze 2–3 lines; FLAT — no mask, no transition);
 * - «Показать.» link #0077FF-ish, OWN line, no underline, glyph height
 *   ~9px → var(--tk-color-link) at body-s (NOT re-minted — the kit's
 *   link color is frozen; 4.62 AA on surface-base);
 * - text↔link gap ≈8 → space-8 (hook --tk-note-gap);
 * - NO icon anywhere in the groundings (bonds/germany/currency) — the
 *   spec's ⓘ-default was measurement-overridden; icon = slot, no paint;
 * - info tone (currency-usd000utstom): NO card — a ~16px/400 blue
 *   «Информация» label line then bare 13–14px gray text on the page →
 *   body-m label on --tk-color-link + body-s text-secondary,
 *   transparent fill, zero padding.
 *
 * The hook layer (CONVENTIONS §6, consumed WITH token defaults):
 * --tk-note-fill, --tk-note-radius, --tk-note-text, --tk-note-gap.
 * Info tone deliberately paints NO box (the currency grounding) — the
 * fill/radius hooks apply to the neutral card only.
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const noteStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--tk-font-body);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .note {
    display: flex;
    flex-direction: column;
    gap: var(--tk-note-gap, var(--tk-space-8));
  }

  /* The neutral tone's quiet card: white on the consumer's muted page
     (the bonds grounding). Fill/radius/padding ride the hooks. */
  .note--neutral {
    padding: var(--tk-space-24);
    border-radius: var(--tk-note-radius, var(--tk-radius-lg));
    background: var(--tk-note-fill, var(--tk-color-surface-base));
    color: var(--tk-note-text, var(--tk-color-text-secondary));
  }

  /* The info tone paints NO card (the currency grounding): a blue label
     line above bare fine print on the page surface. */
  .note--info {
    background: transparent;
    padding: 0;
    color: var(--tk-note-text, var(--tk-color-text-secondary));
  }

  /* The icon wrapper renders ONLY while the slot carries content (the
     empty-state description mold — an empty flex item would fake the
     rhythm). Decorative: the consumer's glyph, aria-hidden container. */
  .note__icon {
    display: flex;
    color: var(--tk-note-text, var(--tk-color-text-secondary));
  }

  .note__label {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-link);
  }

  .note__text {
    margin: 0;
    /* Fine print rides the tone's color (set on the tone block above)
       — no second declaration, one source of truth. */
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
  }

  /* Collapsed = clamped fine print (spec AC2): the 3-line clamp with
     its native ellipsis — the kit-legible equivalent of the live fade.
     The clipped text stays in the accessibility tree (clipping is
     visual only), so screen readers read the WHOLE disclaimer. */
  .note__text--clamped {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  /* «Показать/Скрыть» — a BUTTON styled as the live text link: own
     line, link color, no underline (the measurement), native focus.
     Aligns left with the text column; no transition (FLAT law). */
  .note__toggle {
    align-self: flex-start;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font: inherit;
    font-size: var(--tk-text-body-s-size);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-link);
    cursor: pointer;
  }

  .note__toggle:focus-visible {
    outline: 2px solid var(--tk-color-link);
    outline-offset: 2px;
  }
`;
