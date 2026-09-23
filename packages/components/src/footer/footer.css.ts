import { css } from 'lit';

/**
 * tk-footer styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Visual spec: DESIGN.md `components.footer` / `footer-pill-link` (ink-300
 * bg, white text, radius-full) + EXPERIENCE.md Footer row + the 3.5 PIXEL
 * PROBE of `.playwright-cli/captures/footer.png` (1280×1910), recorded in
 * .playwright-cli/verify/footer/NOTES.md:
 *
 * - GROUP HEADERS (probe): the reference paints 12px uppercase ≈#8A8A8E at
 *   ~0.05em tracking (≈ the caps-s slot: 12px / 500 / +1px). The color FAILS
 *   AA (≈3.2:1) — the kit's semantic override is text-secondary (5.64:1),
 *   the same AA-override ruling DESIGN.md's contrast table applies to
 *   failing reference pairs (deviation 2 in NOTES).
 * - COLUMN LINKS (probe): ~15px regular gray, ~31px pitch, no underline —
 *   body-m at text-secondary with the space-8 row gap (30.5px pitch); hover
 *   steps ONE token to text-primary at 150ms (the State Patterns step);
 *   focus shows the unified ring.
 * - COLUMNS (probe): 6 columns, 40–60px gaps, ~88px container gutters —
 *   auto-fill minmax(160px, 1fr) at the space-40 gap inside the container
 *   width (the 1200px container rhythm is the CONSUMER's layout; the
 *   footer's own grid collapses responsively by the same minmax).
 * - PILLS (probe + DESIGN): the reference's #2C2C2E-on-black strip pills
 *   become the frozen `footer-pill-link` spec — SELF-FILLED ink-300 pills,
 *   white text, radius-full, readable on any surface (the dark strip is a
 *   page-level surface, not the component's — the surface ruling in
 *   footer.ts). 36px reference height grows to the 44px interactive-target
 *   floor (deviation 3); hover darkens one token step (ink-300 → ink-400).
 * - PHONE (probe): white bold ~18px on the dark strip — body-l-bold
 *   (17px/500) in text-primary on the footer surface.
 * - LEGAL (probe): ~13px gray fine print with inline links — body-xs at
 *   text-secondary; the links themselves are composed tk-link `legal`.
 * - TOP DIVIDER (probe): 1px ~#E6E6E6 rule — border-default above the
 *   bottom zone (the reference draws it above the whole directory; the
 *   consumer's page grid owns that edge, the footer owns its internal one).
 *
 * Per-component custom properties (`--tk-footer-*`, CONVENTIONS §6), each
 * consumed WITH its token default:
 * - `--tk-footer-header`        caps header color   (default text-secondary — AA override)
 * - `--tk-footer-link`          column link color   (default text-secondary)
 * - `--tk-footer-link-hover`    hovered link color  (default text-primary — a
 *   DEDICATED hook: ink-surface consumers override BOTH link hooks together,
 *   the tk-tabs text-hover precedent)
 * - `--tk-footer-pill-fill`     pill fill           (default ink-300)
 * - `--tk-footer-pill-fill-hover` hovered pill fill (default ink-400 — PAIRS
 *   with --tk-footer-pill-fill: override both together on custom surfaces)
 * - `--tk-footer-pill-text`     pill text           (default white)
 * - `--tk-footer-column-gap`    directory grid gap  (default space-40)
 * - `--tk-footer-padding`       zone block padding  (default space-32)
 *
 * Known structural (non-token) values, flagged per the flag-don't-invent
 * rule: the 160px column minmax floor (keeps ~6 columns per 1200px row and
 * collapses responsibly), and the 44px pill min-height (the ≥44px
 * interactive-target floor).
 */
export const footerStyles = css`
  :host {
    display: block;
  }

  .footer {
    font-family: var(--tk-font-body);
    color: var(--tk-color-text-primary);
  }

  /* --- The directory: columns ARE LISTS -------------------------------------- */
  .directory {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--tk-footer-column-gap, var(--tk-space-40));
    align-items: start;
  }

  .column {
    min-width: 0;
  }

  /* caps-s UPPERCASE — the transform applied at render (the token carries no case). */
  .column__header {
    margin: 0 0 var(--tk-space-16);
    font-family: var(--tk-font-body);
    font-size: var(--tk-text-caps-s-size);
    font-weight: var(--tk-text-caps-s-weight);
    letter-spacing: var(--tk-text-caps-s-tracking);
    text-transform: uppercase;
    color: var(--tk-footer-header, var(--tk-color-text-secondary));
  }

  .column__list {
    display: flex;
    flex-direction: column;
    gap: var(--tk-space-8);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .column__link {
    font-size: var(--tk-text-body-m-size);
    font-weight: var(--tk-text-body-m-weight);
    line-height: var(--tk-text-body-m-leading);
    color: var(--tk-footer-link, var(--tk-color-text-secondary));
    text-decoration: none;
    transition: color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .column__link:hover {
    color: var(--tk-footer-link-hover, var(--tk-color-text-primary));
  }

  .column__link:focus-visible,
  .pill:focus-visible {
    outline: 2px solid var(--tk-color-focus-ring);
    outline-offset: 2px;
  }

  /* --- The bottom zone: pills + phone + legal --------------------------------- */
  .bottom {
    display: flex;
    flex-direction: column;
    gap: var(--tk-space-24);
    margin-top: var(--tk-footer-padding, var(--tk-space-32));
    padding-top: var(--tk-footer-padding, var(--tk-space-32));
    border-top: 1px solid var(--tk-color-border-default);
  }

  .bottom__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--tk-space-24);
  }

  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--tk-space-8);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* The frozen footer-pill-link spec: SELF-FILLED ink pill, white text,
     radius-full — the reference's dark-strip pill lifted onto any surface.
     Hover darkens one token step (ink-300 → ink-400) at the 150ms token,
     through the PAIRED hover hook — never a bare token past a custom fill. */
  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding-inline: var(--tk-space-16);
    border-radius: var(--tk-radius-full);
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-footer-pill-text, var(--tk-color-white));
    text-decoration: none;
    background: var(--tk-footer-pill-fill, var(--tk-color-ink-300));
    transition: background var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
  }

  .pill:hover {
    background: var(--tk-footer-pill-fill-hover, var(--tk-color-ink-400));
  }

  /* The bold contact block (probe: white bold ~18px → body-l-bold 500 — the
     bold slots carry no leading of their own; the body-l leading serves). */
  .phone {
    margin: 0;
    margin-inline-start: auto;
    font-size: var(--tk-text-body-l-bold-size);
    font-weight: var(--tk-text-body-l-bold-weight);
    line-height: var(--tk-text-body-l-leading);
    color: var(--tk-color-text-primary);
  }

  /* The legal fine-print slot: body-xs gray; inline links inside are the
     consumer's tk-link legal instances (composed, not reimplemented). */
  .legal {
    font-size: var(--tk-text-body-xs-size);
    font-weight: var(--tk-text-body-xs-weight);
    line-height: var(--tk-text-body-xs-leading);
    letter-spacing: var(--tk-text-body-xs-tracking);
    color: var(--tk-color-text-secondary);
  }
`;
