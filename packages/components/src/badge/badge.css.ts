import { css } from 'lit';

/**
 * tk-badge styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.badge-chip` (pill `{rounded.full}`,
 * `{typography.body-xs}`) + the 2.0 capture notes § Badge/Chip
 * (badge-chip-incentive.png, 46×45 with the badge ~44×22 inside: stadium
 * pill, ~8–9px horizontal text padding) + EXPERIENCE.md Badge/Chip row
 * (static or dynamic count; count > 99 renders «99+»; never interactive
 * alone — NO cursor/hover affordance exists in this sheet by design).
 *
 * VARIANTS (theme-invariant pairs — the raw scale tokens carry no dark
 * remaps, so the badge paints identically on a dark canvas, the same
 * ruling as the progress-bar bar):
 * - incentive: green-100 fill + INK text — the AA pairing frozen at Story
 *   2.1 (tk-input's slotted chip): white on green-100 is 2.66:1 (fails AA
 *   at 12px), ink #333 is 4.74:1 (passes). The token consumed is
 *   text-on-primary — the yellow-keeps-ink invariant, reused for the same
 *   class of saturated brand fill; do not copy onto other fills blindly.
 * - stat: ink-300 fill + white text — 12.635:1, the button-inverse pair.
 * - neutral (13.3, admin pack): gray-100 fill + gray-600 text ≈5.17:1 ✓ —
 *   the console's light status pill («Ожидает подписи», h28 in the pack)
 *   and the gray tab-count digit. The pack's pill is taller than the
 *   marketing badge; geometry stays the kit's (the pill grows with
 *   content, min-height 22px) — a recorded delta, not a code axis.
 * - attention (13.3, admin pack): red-300 fill + white text 6.179:1 ✓ —
 *   the pack's raw `#E5372B` count pill maps onto the red scale per the
 *   AA-override discipline (white on #E5372B = 4.3:1 FAILS at body-xs;
 *   ink on it = 3:1 fails worse) — the delta-discipline precedent, no
 *   new red token.
 *
 * `--tk-badge-*` HOOKS (13.3, CONVENTIONS §6 — minted here; the family had
 * ZERO custom properties before): every variant consumes the SAME pair —
 * `--tk-badge-fill` / `--tk-badge-text` — each with its own pairing as the
 * fallback. This is how the EXISTING TkTab.badge count slot goes gray with
 * zero tabs code: custom properties INHERIT through shadow boundaries, so
 * `tk-tabs { --tk-badge-fill: …; --tk-badge-text: … }` re-tints the nested
 * count chip.
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 22px min-height (the capture's probed badge height; body-xs at
 *   leading 1.45 is a ~17.4px line box, so the min-height carries the pill
 *   to the reference's 22px — content taller than that still grows);
 * - the 1px hairline is absent by design (the reference chip is a flat
 *   saturated fill).
 * Bold weight consumes the body-s bold step: body-xs carries no bold token
 * of its own (the tk-input slotted-chip precedent, sized to the same
 * reference chip).
 */
export const badgeStyles = css`
  :host {
    display: inline-flex;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .badge {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding-inline: var(--tk-space-8);
    border-radius: var(--tk-radius-full);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    line-height: var(--tk-text-body-xs-leading);
    letter-spacing: var(--tk-text-body-xs-tracking);
    white-space: nowrap;
  }

  /* display:flex on the cells outranks the UA's [hidden] — restate it. The
     label cell (with its slot) stays in the DOM, hidden never absent, so
     slotchange fires in every state; hidden subtrees are unrendered and out
     of the accessibility tree — a count badge announces ONLY the count. */
  .badge__count[hidden],
  .badge__label[hidden] {
    display: none;
  }

  /* --- Variants: flat saturated fills, text pairs per the header notes.
     Each consumes the shared --tk-badge-fill/--tk-badge-text hooks with its
     own AA pair as the fallback (per-INSTANCE override; see header). --- */

  :host([variant='incentive']) .badge {
    background: var(--tk-badge-fill, var(--tk-color-green-100));
    /* INK-on-saturated-brand-fill (the 2.1 AA pairing) — see the header. */
    color: var(--tk-badge-text, var(--tk-color-text-on-primary));
  }

  :host([variant='stat']) .badge {
    background: var(--tk-badge-fill, var(--tk-color-ink-300));
    color: var(--tk-badge-text, var(--tk-color-white));
  }

  :host([variant='neutral']) .badge {
    background: var(--tk-badge-fill, var(--tk-color-gray-100));
    color: var(--tk-badge-text, var(--tk-color-gray-600));
  }

  :host([variant='attention']) .badge {
    background: var(--tk-badge-fill, var(--tk-color-red-300));
    color: var(--tk-badge-text, var(--tk-color-white));
  }
`;
