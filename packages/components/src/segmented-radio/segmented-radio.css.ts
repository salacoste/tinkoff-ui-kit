import { css } from 'lit';

/**
 * tk-segmented-radio styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.segmentedRadio` («Pill track,
 * {rounded.full}; selected segment solid fill + dot indicator») + the 2.5
 * PIXEL PROBE of `.playwright-cli/captures/segmented-radio-citizenship.png`
 * (536×113, recorded in .playwright-cli/verify/segmented-radio/NOTES.md),
 * which resolved the two flagged ambiguities:
 *
 * - TRACK VS PILLS: the reference control is TWO SEPARATE white stadium
 *   pills (258×56 each, 20px apart). DESIGN.md freezes the ONE pill track
 *   shape for the kit and DESIGN wins over captures — so the track is one
 *   continuous radius-full bar, and the probe's white+hairline reading
 *   feeds the SELECTED SEGMENT surface instead.
 * - SELECTED FILL (the «gray fill vs white+border» ambiguity): the probe
 *   pins BOTH reference pills to WHITE fill (#FFFFFF, pure rows inside the
 *   border ring) with an identical 1px #E1E3E4 hairline on each — not a gray
 *   fill, not an accent. Nearest token pair: surface-base + border-default.
 *   Mapped into the frozen track architecture: tinted track (surface-field,
 *   the field language) + selected segment = surface-base SOLID fill with an
 *   inset border-default hairline — «selected segment solid fill» per DESIGN.
 * - DOT: yellow-100 Ø24 with an ink-300 Ø12 center dot, right-aligned with
 *   a 16px inset, vertically centered (probe bboxes). Unselected ghost
 *   circle: Ø24 flat #EEF1F5 ≈ surface-field — inside the tinted track the
 *   surface-base ghost is the analogous «empty radio well» (it is also the
 *   selected-segment fill family, so the ghost reads as where the pill
 *   lands); documented as the probe-derived judgment call.
 * - HEIGHT: 56px outer (probe: border rows y=56..111) — the spec's
 *   «44-48px» vision reading corrected by pixels; the 4px track inset
 *   yields a 48px segment surface.
 *
 * Per-component custom properties (`--tk-segmented-radio-*`, CONVENTIONS §6;
 * same-slot-same-role vs `--tk-input-*`/`--tk-select-*` — the field-surface
 * role is `fill`, mirroring `--tk-input-fill`/`--tk-select-fill`), each
 * consumed WITH its token default:
 * - `--tk-segmented-radio-fill`         track fill         (default surface-field)
 * - `--tk-segmented-radio-segment-fill` selected fill      (default surface-base)
 * - `--tk-segmented-radio-dot-fill`     selected dot fill  (default yellow-100)
 * - `--tk-segmented-radio-dot-center`   dot center         (default ink-300)
 * - `--tk-segmented-radio-dot-idle`     ghost circle fill  (default surface-base)
 * - `--tk-segmented-radio-text`         segment text       (default text-primary)
 * - `--tk-segmented-radio-radius`       track/segment radius (default radius-full)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent rule:
 * - the 56px track height (capture-measured; the Input literal's sibling);
 * - the 4px track inset (derives the 48px segment pill ≥44px target floor);
 * - the Ø24 dot / Ø12 center (capture-measured icon metrics);
 * - the 16px segment inline padding (capture-measured text/dot inset).
 */
export const segmentedRadioStyles = css`
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

  /* Group label — Input's always-visible label pattern verbatim (the spec's
     «mirroring Input's label pattern» instruction; the reference's 24px
     label→pill gap is the page's own spacing rhythm, not the field's). A
     SPAN, not a clickable <label for>: the association would concatenate the
     group text onto the tab-stop option's accessible name (see the class
     doc) — so no pointer affordance either. */
  .label {
    display: block;
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-bold-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-color-text-primary);
  }

  /* --- The pill track: one continuous radius-full bar (DESIGN.md's frozen
     shape), tinted with the field language so the WHITE selected segment
     reads as the solid fill DESIGN demands. 4px inset gives the segment
     surface its stadium breathing room (48px pill inside 56px track). --- */
  .track {
    box-sizing: border-box;
    display: flex;
    gap: var(--tk-space-4);
    width: 100%;
    height: 56px;
    padding: var(--tk-space-4);
    border-radius: var(--tk-segmented-radio-radius, var(--tk-radius-full));
    background: var(--tk-segmented-radio-fill, var(--tk-color-surface-field));
  }

  /* The native label IS the segment's hit frame: input + surface inside one
     label gives click-to-select and the accessible name (the option label)
     for free — the 2.4 pattern. */
  .segment {
    position: relative;
    flex: 1 1 0;
    display: block;
    min-width: 0;
    cursor: pointer;
  }

  /* The invisible native radio covers the whole segment (≥44×44 target:
   * 48px tall × half the track wide) — the visual surface is its sibling. */
  .segment__input {
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

  /* Segment surface — the pill visual. UNSELECTED: transparent (the tinted
     track shows through — the spec's «unselected segments = transparent
     text»). SELECTED: surface-base SOLID fill + inset border-default
     hairline (the probe's white+hairline reading; inset box-shadow so the
     hairline never shifts layout). Text left, dot right — both 16px insets
     per the probe. */
  .segment__surface {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--tk-space-8);
    height: 100%;
    padding-inline: var(--tk-space-16);
    border-radius: var(--tk-segmented-radio-radius, var(--tk-radius-full));
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-segmented-radio-text, var(--tk-color-text-primary));
    transition:
      background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard),
      box-shadow var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  /* Hover (unselected only): ONE token step at 150ms — the EXPERIENCE State
     Patterns row; the token layer collapses the duration to 0ms under
     prefers-reduced-motion. The selected segment keeps its solid fill.
     TOKEN CHOICE (theme-branch-free, AD-3 — review fix): surface-muted, the
     surface axis's own one-step neighbor of surface-field in BOTH theme
     layers (light #F5F5F6 over #ECF1F7; dark #222222 over the translucent
     #FFFFFF1A field ≈ #2E2E2E effective — a step darker). The scale-only
     alternative (lightblue-200) is defined in the LIGHT layer only: in dark
     it stays #E4EBF3 under #FFFFFF text ≈1.2:1 (fails AA), and re-basing the
     token layer is a DESIGN.md edit this story can't make. AA on the step:
     light #333 on #F5F5F6 = 12.6:1; dark #FFFFFF on #222222 = 15.7:1. */
  .segment__input:not(:checked):hover + .segment__surface {
    background: var(--tk-color-surface-muted);
  }

  /* Selected: SOLID white fill + hairline — the probe-resolved reading. */
  .segment__input:checked + .segment__surface {
    background: var(--tk-segmented-radio-segment-fill, var(--tk-color-surface-base));
    box-shadow: inset 0 0 0 1px var(--tk-color-border-default);
  }

  /* Unified focus ring — 2px token ring, offset 2px, never removed: drawn on
     the VISIBLE segment surface (the invisible input owns :focus-visible;
     the sibling selector bridges — the checkbox pattern). */
  .segment__input:focus-visible + .segment__surface {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* Long option labels truncate visually (ellipsis); the accessible name
     keeps the full string. */
  .segment__text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* --- The dot indicator (DESIGN: «+ dot indicator»): Ø24 yellow-100 with
     an ink-300 Ø12 center when selected (probe-exact); the Ø24 surface-base
     ghost circle when unselected (the reference's flat #EEF1F5 circle,
     re-based to the track's own surface family). Decorative — the checked
     state itself announces from the native radio. --- */
  .segment__dot {
    position: relative;
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: var(--tk-radius-full);
    background: var(--tk-segmented-radio-dot-idle, var(--tk-color-surface-base));
    transition: background-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .segment__input:checked + .segment__surface .segment__dot {
    background: var(--tk-segmented-radio-dot-fill, var(--tk-color-yellow-100));
  }

  .segment__input:checked + .segment__surface .segment__dot::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: var(--tk-radius-full);
    background: var(--tk-segmented-radio-dot-center, var(--tk-color-ink-300));
  }

  /* Disabled option (aria-disabled keeps it focusable — the pilot pattern):
     text-muted copy, no hover whisper, default cursor. Selectability is
     guarded in segmented-radio.ts, never by pointer tricks alone. */
  .segment__input[aria-disabled='true'] + .segment__surface {
    color: var(--tk-color-text-muted);
    cursor: default;
  }

  .segment__input[aria-disabled='true']:hover + .segment__surface {
    background: transparent;
  }
`;
