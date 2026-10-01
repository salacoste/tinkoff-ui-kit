import { css } from 'lit';

/**
 * tk-rating styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * PIXEL TABLE (spec 21.5, the bonds-list grounding — the ONLY real star
 * widget in the invest реке, .playwright-cli/captures-v4/invest/
 * bonds-list.png, precise RGB scan):
 * - star lobes ≈16px, step 20px → gap 4px = `--tk-space-4` exactly;
 * - fill measures EXACTLY #FFDD2D (srgb 255,221,45) = `--tk-color-yellow-100`
 *   byte-identical — the EXISTING kit yellow, nothing minted (AC3);
 * - only FILLED integer stars render — right of every cluster the row is
 *   clean page white, NO empty neutral slots (the reviews gap-7 lens pass
 *   confirmed no second widget anywhere). MEASUREMENT OVERRIDE of AC3's
 *   «пустая звезда — нейтраль» guess: no empty stars are drawn, so no
 *   empty-color hook exists — documented in the spec's execution record;
 * - values in the wild are integers 3–5; the 0.5 grid stays schema-only
 *   (AC1) and renders as a single clip-path-partialed star.
 *
 * Hook layer (`--tk-rating-*`, CONVENTIONS §6), consumed WITH defaults:
 * - `--tk-rating-fill` star fill (default yellow-100 — the measured exact)
 * - `--tk-rating-size` star box (default 16px — the measured lobes)
 *
 * Structural (non-token) flags (the flag-don't-invent rule): the 16px
 * default size (no icon-size token exists) and the partial star's inline
 * `clip-path: inset(0 N% 0 0)` — computed GEOMETRY from the value, not
 * theming (the progress-bar width ruling).
 */
export const ratingStyles = css`
  /* Read-only display: an inline row riding the text flow next to the
     instrument's name/ISIN (the bonds grounding). The host IS the flex
     row — no wrapper span. */
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--tk-space-4);
    color: var(--tk-rating-fill, var(--tk-color-yellow-100));
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .rating__star {
    flex: none;
    width: var(--tk-rating-size, 16px);
    height: var(--tk-rating-size, 16px);
  }

  .rating__star svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
