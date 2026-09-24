import { css } from 'lit';

/**
 * tk-qr-block styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: the PIXEL PROBE of
 * `.playwright-cli/captures-v2/invest-mobile/pattern-qr-loaded.png`
 * (2026-09-24-25, runs.awk + threshold-trim method, recorded in
 * .playwright-cli/verify/qr-block/): the install block = centered bold
 * title, a two-tab switcher, and under the active tab a WHITE rounded tile
 * carrying the QR image with the centered note line UNDER the tile (rows:
 * tabs ≈16-58, gap ≈43, tile ≈101-291, note text ≈303-323 — the note is the
 * tile's caption, NOT an intro line above it).
 *
 * THE TABLIST IS COMPOSED, NOT STYLED: `<tk-tabs>` renders inside this
 * shadow root with ZERO `--tk-tabs-*` hook overrides — the v1 element's own
 * active treatment (white pill + shadow-default + border-default hairline;
 * probe #EEF0F3 fill / #E7E9EC hairline ≈ surface-base / border-default)
 * matches the loaded capture EXACTLY. The ONE thing hooks cannot express —
 * the capture's INACTIVE light-gray fill (#F2F4F7) on an otherwise invisible
 * track — stays unexpressed: the track is frozen invisible by the v1 DESIGN
 * ruling (tabs.css.ts header), the same ruling that recorded the identical
 * delta on v1 tabs' own capture. Delta RECORDED in NOTES.md, not worked
 * around (a gray-track override would be the forbidden reimplementation).
 * This sheet touches ONLY the composed element's geometry: fit-content +
 * auto margins center the strip (the capture centers it) without touching
 * its internals.
 *
 * Token mappings RECORDED (measured → token): title ~26-28px/700 →
 * heading-4 (28/500 — the ramp's bold step; the 700→500 delta recorded);
 * note ink core ≈#C5C5C5 (a very light caption gray, ~2.1:1 on white —
 * AA-hostile) → text-secondary #616871 (4.99:1) — the AA-over-capture
 * ruling, the SAME call the stepper's brown badge made: the capture's
 * caption tier sits under the AA floor, the kit pins the layer's
 * AA-sanctioned secondary tier (text-muted #959BA4 would also fail at
 * 2.8:1 — the visual round's axe run proved it live); note size ink span
 * 21px ⇒ ≈19-20px → body-l (17 — nearest ramp step, Δ2-3 recorded);
 * tile→note gap 12px EXACTLY → --tk-space-12; tile fill #FCFBFC →
 * surface-base (ΔE<1); tile radius ≈13-16 → radius-lg (16); tile padding
 * 16 EXACTLY → --tk-space-16; tile soft drop shadow → shadow-default.
 *
 * MOTION: none of the block's OWN — panel swaps ride tk-tabs' v1 swap
 * animation (its tokens, its reduced-motion belts); the note/tile carry no
 * transitions.
 *
 * Per-component custom properties (`--tk-qr-block-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-qr-block-title`      title color     (default text-primary)
 * - `--tk-qr-block-note`       note color      (default text-secondary)
 * - `--tk-qr-block-tile-fill`  tile fill       (default surface-base)
 * - `--tk-qr-block-tile-radius` tile radius    (default radius-lg = 16)
 * - `--tk-qr-block-tile-shadow` tile shadow    (default shadow-default)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - NONE beyond the composed tk-tabs' own (the 44px track etc. live in
 *   tabs.css.ts); the QR image renders at its natural size — the tile is
 *   sized to the image (spec Anatomy), so no dimension is pinned here.
 */
export const qrBlockStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .qr-block {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* The block title — heading-4 (the probe's ~28px bold; the ramp's bold
     step 500), centered. Rendered ONLY when the prop is set. */
  .qr-block__title {
    margin: 0;
    text-align: center;
    font-family: var(--tk-font-heading);
    font-size: var(--tk-text-heading-4-size);
    font-weight: var(--tk-text-heading-4-weight);
    line-height: var(--tk-text-heading-4-leading);
    color: var(--tk-qr-block-title, var(--tk-color-text-primary));
  }

  /* Title→tablist rhythm (the reference's own section gap). */
  .qr-block__title + tk-tabs {
    margin-block-start: var(--tk-space-40);
  }

  /* The composed tablist — GEOMETRY ONLY (see the header): fit-content +
     auto margins center the strip like the capture; every visual token is
     tk-tabs' own. */
  tk-tabs {
    box-sizing: border-box;
    width: fit-content;
    min-width: 0;
    max-width: 100%;
    margin-inline: auto;
  }

  /* Panel content lives in tk-tabs' named slots (its shadow distributes
     them); this sheet reaches the projected children normally — they are
     light-DOM content of this template. DOM ORDER = the capture's: tile
     first, then the note line UNDER it (the tile's caption). Note: body-l
     secondary ink, centered (the capture's light-gray camera-pointer line,
     AA-pinned — see the header). */
  .panel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .panel__note {
    margin: 0;
    text-align: center;
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-size);
    font-weight: var(--tk-text-body-l-weight);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-qr-block-note, var(--tk-color-text-secondary));
  }

  /* Tile→note rhythm — 12px in the capture, EXACTLY the token; the
     adjacent-sibling gate keeps the note-less panel the tile alone. */
  .panel__tile + .panel__note {
    margin-block-start: var(--tk-space-12);
  }

  /* The QR tile: white surface-base rounded card, padding 16 (probe-EXACT),
     the soft drop shadow (shadow-default). Sized to the image — no width
     pinned; max-width keeps the block responsive. */
  .panel__tile {
    box-sizing: border-box;
    max-width: 100%;
    padding: var(--tk-space-16);
    border-radius: var(--tk-qr-block-tile-radius, var(--tk-radius-lg));
    background: var(--tk-qr-block-tile-fill, var(--tk-color-surface-base));
    box-shadow: var(--tk-qr-block-tile-shadow, var(--tk-shadow-default));
  }

  .panel__qr {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;
