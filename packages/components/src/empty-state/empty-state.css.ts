import { css } from 'lit';

/**
 * tk-empty-state styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 21.3, GAP-MAP A5): the invest favorites capture
 * (captures-v4/invest/favorites.png, measured at execution 2026-10-01) —
 * a centered stack inside a consumer card: gray disc ≈46px with a glyph,
 * ~18px gap, bold heading, ~9px, supporting line, ~17px, blue TEXT LINK
 * as the action. Pixel table (capture → token, the spec's AC2):
 * - disc 46px → var(--tk-space-48) (nearest scale step);
 * - disc fill #f1f2f4 → surface-muted #F5F5F6 (kit token wins);
 * - gaps 18/9/17 → 16 (space-16) with the heading↔description pair at 8
 *   (space-8) — the two measured gap families, snapped to the scale;
 * - heading ≈18px/500 → heading-6 (20/500, nearest heading token);
 * - description ≈14px gray → body-m on text-secondary;
 * - action #3477f6 → the slotted link's own token (--tk-color-link,
   NOT re-minted — the kit's link color is frozen).
 * The SECOND spec grounding (admin 926×258 «compact empty block») did
 * not survive its pixel check — the frame shows an account ROW with an
 * open kebab, not empty-state anatomy; the probe label was optimistic.
 * One live grounding stands; the console-compact idiom stays a
 * story-level derivation (hooks, no atom mode) — AC3's «one size» rule
 * holds precisely because the second grounding collapsed.
 *
 * The atom paints NO card (the favorites card is the consumer's); the
 * rhythm rides the hook layer (CONVENTIONS §6, consumed WITH token
 * defaults): --tk-empty-state-gap, --tk-empty-state-text-gap,
 * --tk-empty-state-disc-size, --tk-empty-state-disc-fill,
 * --tk-empty-state-icon-color.
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const emptyStateStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--tk-font-body);
    text-align: center;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .es {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--tk-empty-state-gap, var(--tk-space-16));
  }

  /* The disc is DECORATIVE (aria-hidden on the container — the service
     card icon mold): an empty muted circle by default, the consumer's
     glyph via the icon slot. Size/fill are hooks; the glyph inherits
     color so a currentColor SVG picks the muted tone up. */
  .es__disc {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: var(--tk-empty-state-disc-size, var(--tk-space-48));
    height: var(--tk-empty-state-disc-size, var(--tk-space-48));
    border-radius: 50%;
    background: var(--tk-empty-state-disc-fill, var(--tk-color-surface-muted));
    color: var(--tk-empty-state-icon-color, var(--tk-color-text-secondary));
  }

  /* Heading and its supporting line sit closer to each other than to
     the frame elements — the measured 9-vs-18 gap families. */
  .es__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--tk-empty-state-text-gap, var(--tk-space-8));
  }

  .es__heading {
    margin: 0;
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-6-size);
    font-weight: var(--tk-text-heading-6-weight);
    line-height: var(--tk-text-heading-6-leading);
    color: var(--tk-color-text-primary);
  }

  .es__description {
    margin: 0;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-secondary);
  }

  /* The action zone only carries the rhythm; the slotted element (a
     tk-link per the live grounding — a button fits the same slot) owns
     its own color and interaction. */
  .es__action {
    font-size: var(--tk-text-body-m-size);
    line-height: var(--tk-text-body-m-leading);
  }
`;
