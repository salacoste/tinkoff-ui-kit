import { css } from 'lit';

/**
 * tk-progress-bar styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.progressBar` («4px track
 * {colors.border-default} (light value = gray-200's hex), fill blue-100,
 * {rounded.full}») + the 2.0 capture notes
 * § ProgressBar (.playwright-cli/captures/progress-bar-fill.png, 568×40:
 * ~4px pill track, blue fill, text row ABOVE with the label left
 * (gray, ~13px) and the % right (near-black, semibold), ~8–10px gap, bar
 * full-width below).
 *
 * DARK THEME (post-5.4 state): the track consumes the border-default
 * SEMANTIC — its light value is byte-identical to the extracted gray-200
 * (#E7E8EA, same hex), and the dark layer remaps it to the white-alpha
 * tonal step (rgba(255,255,255,.14) on the dark base) instead of the
 * near-white rail gray-200 painted (the lightblue-200 bug class,
 * vision-confirmed on the pre-fix dark baseline — .playwright-cli/verify/
 * dark-sweep). The FILL stays blue-100 in both themes by the redundancy
 * ruling R2 (aria-valuenow carries the state; blue-100 vs dark-base =
 * 3.76:1, visible); the header text pair re-themes through
 * text-secondary/text-primary.
 *
 * Per-component custom properties (`--tk-progress-bar-*`, CONVENTIONS §6),
 * each consumed WITH its token default as the fallback:
 * - `--tk-progress-bar-track`  track fill     (default border-default — light value = gray-200's hex)
 * - `--tk-progress-bar-fill`   progress fill  (default blue-100)
 * - `--tk-progress-bar-radius` track/fill radius (default radius-full)
 * - `--tk-progress-bar-text`   label/zero-copy color (default text-secondary — see below)
 * - `--tk-progress-bar-value-text` % cell color (default text-primary; the per-tint
 *   escape hatch — light-theme text-primary fails AA on dark tints, the
 *   checkbox --tk-checkbox-text precedent)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the 4px track height (DESIGN.md `components.progressBar` literal — the
 *   pill radius at 4px gives the fully-rounded ends);
 * - the 33% indeterminate fill width and its translateX(−100%→300%) sweep
 *   (loop geometry, not theming — the spec's static-fallback shape);
 * - the sr-only announcement metrics (1px clip box — the standard
 *   visually-hidden utility shape).
 * Width is an inline `width: N%` on the fill — computed GEOMETRY, not
 * theming (the spec's Design Notes ruling); it never touches tokens.
 *
 * Text colors: the capture's label MEASURES #757575 (pixel probe —
 * .playwright-cli/verify/progress-bar/NOTES.md deviation 4; the 2.0 vision
 * reading ~#8E9094 was superseded by pixels) — the nearest AA-passing role
 * is text-secondary (#616871, 5.635:1 on white; the same AA-override move
 * tk-checkbox/tk-select documented), the % reads #333333 → text-primary
 * pixel-exact (theme-remapped, unlike the bar itself).
 */
export const progressBarStyles = css`
  :host {
    display: block;
    max-width: 100%;
  }

  /* --- Header row (the reference composition): label left, % right, one
     body-s line 8px above the track (capture: ~8–10px gap; 8 is the scale
     step). Rendered only when it carries content (label, slotted %, or the
     zero-state copy) — a bare bar is track-only. --- */
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--tk-space-16);
    margin: 0 0 var(--tk-space-8);
    font-family: var(--tk-font-body);
  }

  /* display:flex above out-ranks the UA's [hidden] — restate it for the
     header and its cells. The three cells stay in the DOM (hidden, never
     absent) so their slots exist for slotchange in every state; hidden
     subtrees are unrendered and out of the accessibility tree. */
  .header[hidden],
  .header > [hidden] {
    display: none;
  }

  .header__label,
  .header__empty {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-progress-bar-text, var(--tk-color-text-secondary));
  }

  .header__value {
    font-size: var(--tk-text-body-s-bold-size);
    font-weight: var(--tk-text-body-s-bold-weight);
    /* Bold steps carry no leading token — the base-step leading governs. */
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-progress-bar-value-text, var(--tk-color-text-primary));
  }

  /* --- Track: 4px full-width pill. overflow:hidden + the shared radius
     clip the fill to the pill ends at any width. Track fill is the
     border-default SEMANTIC (5.4 dark sweep): its light value is
     byte-identical to the extracted gray-200 (#E7E8EA — same hex), and the
     dark layer remaps it to the white-alpha tonal step instead of the
     near-white rail gray-200 painted in dark (the lightblue-200 bug class,
     vision-confirmed on the dark baseline). --- */
  .track {
    box-sizing: border-box;
    width: 100%;
    height: 4px;
    border-radius: var(--tk-progress-bar-radius, var(--tk-radius-full));
    background: var(--tk-progress-bar-track, var(--tk-color-border-default));
    overflow: hidden;
  }

  .fill {
    box-sizing: border-box;
    height: 100%;
    border-radius: var(--tk-progress-bar-radius, var(--tk-radius-full));
    background: var(--tk-progress-bar-fill, var(--tk-color-blue-100));
  }

  /* --- Indeterminate (the spec's Design Notes shape): a 33% fill sliding
     across the track — translateX of its OWN width (−100% = fully hidden
     left, 300% = left edge at the track's right end) so the sweep covers
     100% of the track. duration-slow (500ms) loops on a linear curve — the same
     infinite-loop curve ruling as the button spinner (a token curve would
     pulse per-iteration; the reference's indeterminate language is a steady
     sweep). The token layer collapses the duration to 0ms under
     prefers-reduced-motion; the explicit none below keeps a STATIC 33% fill
     instead of a 0ms loop — the reduced-motion-safe fallback the spec
     demands (static, never animating). --- */
  :host([indeterminate]) .fill {
    width: 33%;
    animation: tk-progress-bar-slide var(--tk-motion-duration-slow) linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([indeterminate]) .fill {
      animation: none;
    }
  }

  @keyframes tk-progress-bar-slide {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(300%);
    }
  }

  /* --- Announcement region (announce prop): visually hidden, never
     display:none — aria-live content must stay in the accessibility tree.
     The 1px clip box is the standard sr-only utility shape (structural,
     flagged in the header). --- */
  .announcement {
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
`;
