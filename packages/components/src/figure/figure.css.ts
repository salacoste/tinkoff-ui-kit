import { css } from 'lit';

/**
 * tk-figure styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 24.7 = the B6+A8 fusion): the live research longreads
 * carry ALL their data-viz as sandboxed iframe embeds (gap-8: review 55 +
 * strategy 24 iframes, canvas 0, tables 0) and the terminal pages embed
 * video demos the same way (gap-5: videos=5) — one shape, a captioned
 * media block. The atom is a PASSIVE frame: it owns the ratio box, the
 * radius and the caption line; the media itself rides the slot.
 *
 * The hook layer (CONVENTIONS §6, consumed WITH token defaults):
 * - --tk-figure-ratio   aspect-ratio of the media box (default 16 / 9 —
 *   the live embed shape; override per figure, e.g. 4 / 3 for charts)
 * - --tk-figure-radius  the media box radius (default radius-lg, 16)
 * - --tk-figure-fill    the media box backdrop while the media loads /
 *   letterboxes (default surface-muted)
 * - --tk-figure-gap     media-to-caption gap (default space-12)
 * - --tk-figure-caption the caption color (default text-secondary)
 *
 * The caption is body-s on text-secondary (the kit's quiet fine-print
 * register — tk-note's text lane); no tone branches, no motion (FLAT).
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const figureStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--tk-font-body);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .figure {
    display: flex;
    flex-direction: column;
    gap: var(--tk-figure-gap, var(--tk-space-12));
    margin: 0;
  }

  /* The media box: the aspect frame the embed rides. The muted backdrop
     is the loading/letterbox state — the media covers it once painted. */
  .figure__media {
    aspect-ratio: var(--tk-figure-ratio, 16 / 9);
    display: flex;
    overflow: hidden;
    border-radius: var(--tk-figure-radius, var(--tk-radius-lg));
    background: var(--tk-figure-fill, var(--tk-color-surface-muted));
  }

  /* Slotted media fills the box; iframe chrome stripped. object-fit on
     the img keeps arbitrary art inside the frame without distortion. */
  .figure__media ::slotted(iframe),
  .figure__media ::slotted(video),
  .figure__media ::slotted(img) {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .figure__media ::slotted(img) {
    object-fit: cover;
  }

  /* The caption line: presence-molded (renders only with content) — an
     empty figcaption would fake the rhythm and double-announce. */
  .figure__caption {
    margin: 0;
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-figure-caption, var(--tk-color-text-secondary));
  }
`;
