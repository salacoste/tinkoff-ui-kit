import { css } from 'lit';

/**
 * tk-skeleton styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 21.2, GAP-MAP A4): census class-hits only — stocks 1,
 * bonds 3 («shimmer blocks near FAQ zone»), currencies 1, germany 1,
 * favorites 1. The execution live-probe (goto + immediate screenshot ×3,
 * read-only, 2026-10-01) could not catch the pre-hydration frame — the
 * page hydrates faster than transport — so the pixel truth falls back to
 * the in-repo ТЖ skeleton mold (tj-news-card .card--skeleton: neutral
 * bone fill, quiet radius, no shimmer — «reference behavior unprobed,
 * nothing invented») + the frozen AC geometry. The AC's opacity pulse
 * (1↔0.5) is the ruled shape; a gradient shimmer sweep stays OUT — it
 * was never proven on the live surface (FLAT consensus).
 *
 * The fill rides the hook layer (CONVENTIONS §6, each hook consumed WITH
 * its token default as the fallback):
 * - `--tk-skeleton-fill`  bone fill (default surface-muted — the kit's
 *   neutral muted surface, theme-remapped through the token layer).
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule — the token sheet carries no counterpart:
 * - the geometry DEFAULTS (line 100%×12, circle 40×40, rect 100%×80 —
 *   the frozen-AC literals; the mark-40 read aligns with the ТЖ bone
 *   family). Consumer `width`/`height` attributes are px strings applied
 *   as host inline styles — the documented zero-hardcoded blind spot
 *   (the MENU_OFFSET_PX precedent, 19.1);
 * - the 1.4s pulse duration (not on the motion scale; the AC's literal —
 *   a slow breathing loop, deliberately calmer than duration-slow's
 *   500ms spinner cadence);
 * - the circle's 50% radius (shape, not theming).
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const skeletonStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 12px;
    border-radius: var(--tk-radius-sm);
    background: var(--tk-skeleton-fill, var(--tk-color-surface-muted));
    animation: tk-skeleton-pulse 1.4s ease-in-out infinite;
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  :host([variant='circle']) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  :host([variant='rect']) {
    height: 80px;
  }

  /* a11y law of the kit: reduced motion collapses the pulse to a static
     bone — the harness runs visual baselines under this emulation, so the
     snapshots are deterministic frames, never a caught mid-pulse opacity. */
  @media (prefers-reduced-motion: reduce) {
    :host {
      animation: none;
    }
  }

  @keyframes tk-skeleton-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
