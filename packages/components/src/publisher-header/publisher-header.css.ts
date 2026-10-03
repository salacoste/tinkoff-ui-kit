import { css } from 'lit';

/**
 * tk-publisher-header styles — tokens only (FR-1), zero theme branches
 * (AD-3). The header composes: avatar disc + (name line + badges) over
 * meta + the consumer's action, one row.
 *
 * PIXEL TABLE (spec 23.2 — the publisher-row pass on
 * .playwright-cli/captures-v4/invest/stock-sber.png, probes at native 1x;
 * row band y1227–1270, h44 carried by the live pill):
 *
 * | element | measurement | kit decision |
 * |---|---|---|
 * | row | band y1227–1270 (h44 — the pill carries it), section bg white, pill center y1248.5 = row center | one flex row, `align-items: center`; no min-height hook (the consumer's button carries the 44) |
 * | avatar | disc x239–273 → d35, row-centered; fill = pale gray with a dark 51,51,51 person silhouette (36px) | d35 capture literal (hook); kit paints the PALE DISC placeholder + clips the slot round; the silhouette is live media — the empty placeholder stays a bare disc (zero-media ruling) |
 * | avatar→name gap | disc edge 273 → name ink 300 = 27px (glyph side-bearing ~3) | `--tk-space-24` (+3 recorded, the hero padding precedent) |
 * | name | ink band y1231–1246 (cap h16) → ≈20px bold #333-family | heading-6 20px + weight 700 literal (the hero-name precedent: the register's heading weight is 500, the live row is bold) |
 * | name line height | name cap top 1231 + meta cap top 1258 = exactly one heading-6 line box (20 × 1.35 = 27) | name and meta share ONE text block — the meta needs no gap of its own (measured 0 extra) |
 * | badges | two d18 chips x404–439 ON the name line (y1235–1247): green #36C578 glyph on pale #CDF1DD ring, blue #428BF9 on #D0E2FE; chips nearly touching (~2px) | chips are SLOT content (repeatable `badge` slot — the hero action mold: the kit owns the row/gap, the consumer owns the chip+glyph); the four measured colors ride the invest-badge token pairs minted in 23.2 |
 * | meta | ink y1258–1268 (x-height h11) gray ≈117 | body-s + text-secondary (live #777 raised to the kit semantic, the kv-list gray-label precedent; +1 recorded) |
 * | action | yellow pill 124×44 (x640–763), right edge flush with the content column's right rim | consumer slot (tk-button primary — the 22.6 ticket CTA pair), `margin-left: auto`; stateless, no follow semantics |
 *
 * `--tk-publisher-header-*` HOOKS (CONVENTIONS §6), each consumed WITH
 * its measured/token default — the full set is pinned by count in the
 * unit test:
 * - `--tk-publisher-header-avatar-size` the disc diameter (35px capture literal)
 * - `--tk-publisher-header-avatar-backdrop` the placeholder disc fill (tint-gray)
 * - `--tk-publisher-header-gap` disc↔name-block spacing (space-24)
 * - `--tk-publisher-header-badge-gap` chip↔chip spacing in the badge rail (2px capture literal)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 700 name weight (live bold — no 20px/700 register slot, the
 * hero-name precedent) and the two capture-literal dimensions (35px disc,
 * 2px chip gap — card-metric family, no tokens exist).
 */

export const publisherHeaderStyles = css`
  :host {
    display: flex; /* the one measured row */
    align-items: center;
    box-sizing: border-box;
    color: var(--tk-color-text-primary);
    font-family: var(--tk-font-body);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  /* The avatar disc: slot carrier. The kit paints the measured pale disc
     as the placeholder (an empty slot leaves a calm gray circle — no
     media minted), and clips whatever the consumer slots round. */
  .publisher-header__avatar {
    flex: none;
    width: var(--tk-publisher-header-avatar-size, 35px);
    height: var(--tk-publisher-header-avatar-size, 35px);
    border-radius: var(--tk-radius-full);
    background: var(--tk-publisher-header-avatar-backdrop, var(--tk-color-tint-gray));
    overflow: hidden;
  }

  .publisher-header__avatar ::slotted(img),
  .publisher-header__avatar ::slotted(svg) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* The text block: name line over meta. The name's heading-6 line box
     (27px) is the measured spacing engine — meta rides directly under
     it, no extra gap (the 1231→1258 cap-top delta is exactly one line
     box; adding a gap would double-count). */
  .publisher-header__body {
    display: flex;
    flex-direction: column;
    min-width: 0; /* long names wrap inside, never push the action out */
    margin-left: var(--tk-publisher-header-gap, var(--tk-space-24));
  }

  .publisher-header__name-line {
    display: flex;
    align-items: center;
    gap: var(--tk-space-4);
    min-width: 0;
  }

  /* A DIV, deliberately not a heading — the h-level is the consumer's
     document structure (the name slot override carries it, the hero
     mold). */
  .publisher-header__name {
    font-size: var(--tk-text-heading-6-size);
    font-weight: 700; /* the live bold — structural, header notes */
    line-height: var(--tk-text-heading-6-leading);
    color: inherit;
    overflow-wrap: anywhere; /* a long publisher handle wraps, no overflow */
  }

  /* The heading channel rides THROUGH, typography stays the row's (the
     hero-name slotted-heading rule: drop the UA chrome, keep the
     semantics). */
  .publisher-header__name ::slotted(h1, h2, h3, h4, h5, h6) {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  /* The badge rail: repeatable slot content (the hero action mold — the
     kit owns the row and the gap, the consumer owns each chip+glyph;
     verification glyphs are consumer media by the zero-media ruling). */
  .publisher-header__badges {
    display: flex;
    align-items: center;
    flex: none;
    gap: var(--tk-publisher-header-badge-gap, 2px);
  }

  .publisher-header__meta {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-text-secondary);
  }

  .publisher-header__meta ::slotted(*) {
    margin: 0; /* a slotted p would break the measured line rhythm */
  }

  /* The follow action: the consumer's button (tk-button primary), pinned
     to the row's right rim by the measured flush edge. Stateless — the
     kit places, never owns the subscription state. */
  .publisher-header__action {
    flex: none;
    margin-left: auto;
    padding-left: var(--tk-space-16); /* breathing room when the name runs long */
  }
`;
