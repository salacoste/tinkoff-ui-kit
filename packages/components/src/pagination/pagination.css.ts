import { css } from 'lit';

/**
 * tk-pagination styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.pagination` (active-fill yellow-100,
 * active-text ink-300, radius full, more-link-color blue-100) + the vision
 * extraction of pattern-table-stocks.png's bottom third (2026-09-24,
 * recorded in .playwright-cli/verify/pagination/NOTES.md): the numbers row
 * CENTERED, inactive numbers as link-blue text with no fill ~16px, the
 * active page a ~32px yellow circle with dark 700-weight text, thin
 * angle-bracket chevrons flanking the row, the ellipsis styled as a number
 * slot, and — its own row above with a wide gap — the full-width
 * «Показать еще» bar on a light muted fill with a centered blue label.
 *
 * The link color consumes the SEMANTIC alias `--tk-color-link` (blue-100's
 * dark-remapped name — the spec's «blue-100 link-blue» text, dark-correct by
 * construction). The load-more label consumes `--tk-color-link-on-tint`: the
 * token layer's AA ruling — blue-100 measures under 4.5:1 on the muted fill
 * (the link-on-tint precedent, tokens.css).
 *
 * Per-component custom properties (`--tk-pagination-*`, CONVENTIONS §6),
 * each consumed WITH its token default:
 * - `--tk-pagination-active-fill`  active page pill fill (default yellow-100)
 * - `--tk-pagination-active-text`  active page text     (default ink-300)
 * - `--tk-pagination-radius`       active pill radius   (default radius-full)
 * - `--tk-pagination-page-text`    inactive page/step text (default link)
 * - `--tk-pagination-more-fill`    load-more bar fill   (default surface-muted)
 * - `--tk-pagination-more-text`    load-more label      (default link-on-tint)
 * - `--tk-pagination-more-radius`  load-more bar radius (default radius-md)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule:
 * - the 44px load-more bar height (probe-measured y308–351, see
 *   .playwright-cli/verify/pagination/NOTES.md; the spec's ~44–52 range
 *   taken at the measured lower bound — the field language's sibling);
 * - the 44px number/step button boxes with the 32px visual pill INSIDE (the
 *   §8 floor met by padding the hit area — the capture's visual glyph is a
 *   probe-measured 32px circle);
 * - the active page's font-weight 700 (capture-measured; the token layer's
 *   bold step is 500 — the reference's own weight is the spec's letter);
 * - the chevrons' 16px box / 1.5px stroke (icon metrics, no token);
 * - the bar→numbers gap var(--tk-space-16) (probe-measured 19px
 *   bar-bottom→pill-top; the 44px number boxes center the 32px pill 6px in,
 *   so the 16px row gap renders ~22px visual — the token step nearest the
 *   measured 19).
 */

export const paginationStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .pagination {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--tk-space-16);
  }

  /* --- The «Показать еще» bar: its OWN row above the numbers, full-width,
     muted fill, centered link-blue label. A button — the whole bar is the
     target (44px ≥ the §8 floor). The hover step is surface-field (the
     select menu's own perceptible hover/active neighbor). --- */
  .load-more {
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    margin: 0;
    padding: 0 var(--tk-space-16);
    border: none;
    border-radius: var(--tk-pagination-more-radius, var(--tk-radius-md));
    background: var(--tk-pagination-more-fill, var(--tk-color-surface-muted));
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    font-weight: var(--tk-text-body-l-weight);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-pagination-more-text, var(--tk-color-link-on-tint));
    text-align: center;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    transition: background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .load-more:hover {
    background: var(--tk-color-surface-field);
  }

  /* --- The numbers row: centered list; every interactive box ≥44×44. --- */
  .pages {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--tk-space-4);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* The number button is the FULL 44px hit area; the visual language (text
     alone, or the 32px active pill) paints on the inner box. */
  .page,
  .step {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-pagination-page-text, var(--tk-color-link));
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .page__pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 var(--tk-space-4);
    border-radius: var(--tk-pagination-radius, var(--tk-radius-full));
    font-size: var(--tk-text-body-m-size);
    line-height: var(--tk-text-body-m-leading);
    transition: background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* The ACTIVE page: yellow-100 pill + ink-300 text + weight 700
     (capture-measured — see the module header's structural flag). */
  .page--active .page__pill {
    background: var(--tk-pagination-active-fill, var(--tk-color-yellow-100));
    color: var(--tk-pagination-active-text, var(--tk-color-ink-300));
    font-weight: 700;
  }

  /* The active page is FOCUSABLE-BUT-CURRENT (the recorded pick): it stays a
     real focusable button for the post-change focus landing; activating it
     is a no-op, so the cursor reads default. */
  .page--active {
    cursor: default;
  }

  /* Prev/next chevrons at the boundaries: aria-disabled (kept focusable —
     the kit pattern) + text-muted; boundary presses emit nothing (guarded
     in pagination.ts). */
  .step[aria-disabled='true'] {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  /* The ellipsis slot: a text-secondary non-interactive spacer matching the
     row's rhythm (aria-hidden in the template — it carries no information
     beyond the visual gap). */
  .ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-secondary);
    user-select: none;
  }

  /* Unified focus ring (§8): 2px token ring, offset 2px, never removed — on
     the pressed box itself (numbers, chevrons, the bar). */
  .page:focus-visible,
  .step:focus-visible,
  .load-more:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }
`;
