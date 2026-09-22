import { css } from 'lit';

/**
 * tk-thumbnail-picker styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.thumbnailPicker` («Square tiles
 * {rounded.md}, selected gets 2px ink border ring») + the 2.6 PIXEL PROBE of
 * `.playwright-cli/captures/thumbnail-picker-card-design.png` (536×170,
 * recorded in .playwright-cli/verify/thumbnail-picker/NOTES.md), which
 * resolved the spec's flagged ring ambiguity:
 *
 * - RING TREATMENT (the probe reading, recorded per the acceptance
 *   criterion): the reference's selection marker is a solid #FFDD2D annulus
 *   ~3px (clean bottom rows) hugging the tile's ROUNDED OUTLINE from the
 *   OUTSIDE — artwork edge, then ring, then page — with NO gap/offset and no
 *   shadow; unselected tiles are flat artwork with no border. Mapping into
 *   the frozen architecture: DESIGN mandates the 2px INK ring and DESIGN
 *   wins over captures (the segmented-radio deviation-1 precedent), so the
 *   kit renders `box-shadow: 0 0 0 2px ink-300` — an OUTER ring hugging the
 *   radius-md outline (the probe's geometry, ink per DESIGN), no layout
 *   shift, zero offset. The reference's yellow exists only as the ring.
 * - TILE SIZE: 72px squares per DESIGN/EXPERIENCE («tiles 72px, wrap to
 *   grid») — the reference's own tiles are ~125×79 card artwork; the DESIGN
 *   square wins (documented deviation, side-by-side shows it).
 * - GRID: `repeat(auto-fill, 72px)` with a 12px gap — the probe measured
 *   12px gaps on BOTH axes in the reference (the one pixel-exact metric the
 *   kit inherits directly; --tk-space-12).
 * - FACES: `thumbnail` renders an <img> (cover); the initials fallback is
 *   the kit's own story surface on the field fill (the spec's noted
 *   initials decision). Per-tile label text is VISUALLY HIDDEN (the
 *   reference tiles carry artwork only — no captions; the accessible name
 *   still comes from the wrapping label).
 * - LABEL PLACEMENT: no visible per-tile labels (probe: the capture's 4+2
 *   grid shows artwork only); the group label above mirrors the
 *   segmented-radio field pattern.
 *
 * Per-component custom properties (`--tk-<component>-<slot>`, CONVENTIONS §6;
 * same-slot-same-role vs `--tk-input-*`/`--tk-select-*` — the field-surface
 * role is `fill`, mirroring `--tk-input-fill`), each consumed WITH its token
 * default:
 * - `--tk-thumbnail-picker-face-fill`  initials-face fill (default surface-field)
 * - `--tk-thumbnail-picker-initials`   initials text     (default text-primary)
 * - `--tk-thumbnail-picker-ring`       selected ring     (default ink-300)
 * - `--tk-thumbnail-picker-radius`     tile radius       (default radius-md)
 * - `--tk-thumbnail-picker-tile`       tile track size   (default the 72px literal)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the 72px square tile (DESIGN.md `components.thumbnailPicker` literal);
 * - the 2px ring width (DESIGN literal; probe-measured 3px — DESIGN wins);
 * - the 1px hover hairline (the checkbox/input hairline class);
 * - the sr-only text clip metrics (the standard a11y pattern, not design).
 */
export const thumbnailPickerStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* Disabled group (EXPERIENCE State Patterns): 40% opacity, no pointer
     events at the host boundary. The inner inputs keep aria-disabled
     (focusable — the button-pilot pattern); the change guard reverts any
     keyboard flip, so nothing ever emits or commits while disabled. */
  :host([disabled]) {
    opacity: 0.4;
    pointer-events: none;
  }

  /* Group label — the segmented-radio field pattern verbatim. A SPAN, not a
     clickable <label for>: the association would concatenate the group text
     onto the tab-stop tile's accessible name (the 2.5 ratified lesson) — so
     no pointer affordance either. */
  .label {
    display: block;
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
  }

  /* --- The tile grid: auto-filled 72px tracks wrapping by container width
     (DESIGN «wrap to grid»), 12px gaps on both axes (probe-exact). --- */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--tk-thumbnail-picker-tile, 72px));
    gap: var(--tk-space-12);
  }

  /* The native label IS the tile's hit frame: input + face inside one label
     gives click-to-select and the accessible name for free (the 2.4/2.5
     pattern). 72×72 ≥ the 44×44 target floor. */
  .tile {
    position: relative;
    display: block;
    width: var(--tk-thumbnail-picker-tile, 72px);
    height: var(--tk-thumbnail-picker-tile, 72px);
    cursor: pointer;
  }

  /* The invisible native radio covers the whole tile — the visual face is
     its sibling. */
  .tile__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  /* Tile face — radius-md square (DESIGN), field fill under the initials,
     overflow-hidden so the artwork clips to the rounded outline. The
     selected ring is an OUTER box-shadow annulus (probe geometry: hugs the
     rounded outline from outside, no offset) — painted on the face, outside
     the overflow clip, no layout shift. */
  .tile__face {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: var(--tk-thumbnail-picker-radius, var(--tk-radius-md));
    background: var(--tk-thumbnail-picker-face-fill, var(--tk-color-surface-field));
    transition: box-shadow var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* Thumbnail artwork fills the face (cover), clipped by the radius. alt=""
     + aria-hidden keep it decorative — the label text names the radio. */
  .tile__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Initials fallback face (no/failed thumbnail): the label's first
     graphemes on the field fill — text-primary holds AA on surface-field in
     both themes (light ≈9.9:1; dark ≈10:1 effective). Decorative
     (aria-hidden); the full label rides the sr-only text. */
  .tile__initials {
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-l-bold-size);
    font-weight: var(--tk-text-body-l-bold-weight);
    line-height: 1;
    color: var(--tk-thumbnail-picker-initials, var(--tk-color-text-primary));
  }

  /* Per-tile label text: VISUALLY HIDDEN (probe — the reference tiles carry
     artwork only); the accessible name still comes from this text inside the
     wrapping label. The standard sr-only clip. */
  .tile__text {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  /* Hover (unselected only): ONE token step — the border-default →
     border-strong hairline class (the checkbox/input hover move), inset so
     it never shifts layout; it reads over artwork AND initials faces. The
     token layer collapses the duration to 0ms under
     prefers-reduced-motion. */
  .tile__input:not(:checked):hover + .tile__face {
    box-shadow: inset 0 0 0 1px var(--tk-color-border-strong);
  }

  /* Selected: the 2px ink ring — OUTER, hugging the rounded outline, no
     offset (probe geometry; ink per DESIGN). */
  .tile__input:checked + .tile__face {
    box-shadow: 0 0 0 2px var(--tk-thumbnail-picker-ring, var(--tk-color-ink-300));
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed: drawn on
     the VISIBLE face (the invisible input owns :focus-visible; the sibling
     selector bridges). Coexists with the selection ring. */
  .tile__input:focus-visible + .tile__face {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Disabled option (aria-disabled keeps it focusable — the pilot pattern):
     artwork dims to the State-Patterns 40%, initials take text-muted (the
     token's sanctioned disabled-text role), no hover whisper, default
     cursor. Selectability is guarded in thumbnail-picker.ts, never by
     pointer tricks alone. */
  .tile__input[aria-disabled='true'] + .tile__face {
    cursor: default;
  }

  .tile__input[aria-disabled='true'] + .tile__face .tile__initials {
    color: var(--tk-color-text-muted);
  }

  .tile__input[aria-disabled='true'] + .tile__face .tile__image {
    opacity: 0.4;
  }

  .tile__input[aria-disabled='true']:hover + .tile__face {
    box-shadow: none;
  }

  /* Zero-state copy slot (EXPERIENCE State Patterns: «never blank») — the
     documented default copy inside the empty slot, de-emphasized
     body-s secondary text on the surface. */
  .empty {
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-text-secondary);
  }
`;
