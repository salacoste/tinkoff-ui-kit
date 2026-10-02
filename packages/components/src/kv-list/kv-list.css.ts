import { css } from 'lit';

/**
 * tk-kv-list + tk-kv-list-item styles — tokens only (FR-1), zero theme
 * branches (AD-3).
 *
 * PIXEL TABLE (spec 22.4, the bond «Информация о выпуске» pass — 2x
 * anatomy lens on the 1280px bond capture, .playwright-cli/captures-v4/
 * invest/bond-*.png; sibling groundings: future «Параметры фьючерса»
 * (ALL rows carry the «?») + sber «Показатели акции» (delta-toned values)):
 *
 * | capture | measurement | kit decision |
 * |---|---|---|
 * | row pitch | 33–34px (divider-to-divider) | padding-block 4 + the 24px line box + 1px divider = 33px — the data-table literal-leading family |
 * | label | ~16px regular gray #8d8d8d | body-m 400 text-secondary — 15px is the nearest scale step (1px down, recorded; no 16px token exists) |
 * | value | ~16px weight 500–600 near-black, flush right | body-m bold 500 text-primary, `text-align: end` in a flex `space-between` row |
 * | divider | 1px #e6e6e6, full row width | 1px `--tk-color-border-table` (rgba(0,16,36,.12) ≈ #e1e3e5 on white — the table sibling, near-identical) |
 * | ⓘ icon | 14–16px SOLID gray circle (~#b0b0b0), white «?» glyph, ≈8px after the label | 16px capture literal, fill `--tk-color-gray-400` (#959ba4 — the nearest gray step by channel distance, the deviation recorded), white glyph, gap `--tk-space-8` |
 * | heading | ~24px semibold above the rows | consumer-side (the pattern wrapper owns it — the 19.1 no-modes lesson) |
 *
 * DELTA VALUES stay consumer-side markup: the live «Показатели» paints
 * values green/red, which is the 22.1/22.2 delta token pair riding the
 * VALUE SLOT's content (`<span style="color: var(--tk-color-delta-positive)">`),
 * not an atom prop — the atom never guesses a tone from text (the
 * quote-chip ruling is deliberately NOT generalized: a spec list's values
 * are consumer data).
 *
 * `--tk-kv-list-*` HOOKS (CONVENTIONS §6, AC3), each consumed WITH its
 * measured/token default — NO mint:
 * - `--tk-kv-list-divider` row divider color (border-table)
 * - `--tk-kv-list-label` label color (text-secondary)
 * - `--tk-kv-list-value` value color (text-primary)
 * - `--tk-kv-list-gap` label↔icon gap (space-8 — the measured ≈8px)
 * - `--tk-kv-list-icon` the «?» roundel fill (gray-400; the glyph stays
 *   white — a light consumer tint would strand it, so the pair is fixed
 *   by design and the hook owns the circle alone)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 1px hairlines (structural across the kit — data-table,
 * accordion, menu-popover), the 24px line box (capture literal, the
 * data-table family), the 16px icon box (no icon-size token exists — the
 * rating 16px precedent), and the -14px hint hit-area expansion (44px
 * WCAG 2.5.5 floor around the 16px glyph — the stitch trick, pointer
 * only, the row rhythm untouched).
 */

export const kvListStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .list {
    display: block;
  }

  /* Divider «between, not around» (the accordion mold): every slotted row
     but the last carries the hairline. 1px is structural (header notes);
     the color rides the hook with the border-table neutral. */
  .list ::slotted(tk-kv-list-item:not(:last-child)) {
    border-bottom: 1px solid var(--tk-kv-list-divider, var(--tk-color-border-table));
  }
`;

export const kvListItemStyles = css`
  :host {
    display: block;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* One line per row (live): label left, value flush right, the measured
     33px pitch from padding + line box — rows GROW instead of clipping if
     a consumer's value wraps (§2 degrade). */
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--tk-space-16);
    padding: var(--tk-space-4) 0;
    font-family: var(--tk-font-body);
  }

  .item__label {
    display: flex;
    align-items: center;
    gap: var(--tk-kv-list-gap, var(--tk-space-8));
    min-width: 0; /* flex item discipline: long labels shrink, never push the value out */
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: 24px; /* capture literal — the data-table leading family */
    color: var(--tk-kv-list-label, var(--tk-color-text-secondary));
  }

  .item__value {
    flex: none;
    text-align: end;
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: 24px; /* capture literal — the data-table leading family */
    color: var(--tk-kv-list-value, var(--tk-color-text-primary));
  }

  /* The «?» roundel: a REAL button (tab stop, standard ring) painted as
     the measured solid gray circle with a white glyph. The glyph text is
     ignored by AT — the button's aria-label carries the name and the
     tooltip's aria-describedby carries the description. */
  .item__hint {
    flex: none;
    position: relative; /* the hit-area expansion context */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px; /* capture literal — the rating 16px precedent */
    height: 16px;
    padding: 0;
    border: 0;
    border-radius: var(--tk-radius-full);
    background: var(--tk-kv-list-icon, var(--tk-color-gray-400));
    color: var(--tk-color-white);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: 1;
    cursor: pointer;
  }

  /* 44px hit area around the 16px glyph (WCAG 2.5.5 floor) — the data-table
     stitch trick: pointer-only, paints nothing, keeps the 33px row rhythm. */
  .item__hint::after {
    content: '';
    position: absolute;
    inset: -14px;
  }

  /* The unified focus ring — 2px token ring, offset 2px (button.css.ts). */
  .item__hint:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }
`;
