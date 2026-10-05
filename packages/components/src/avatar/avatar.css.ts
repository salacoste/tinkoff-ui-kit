import { css } from 'lit';

/**
 * tk-avatar styles (spec 26.3, form-control completeness wave).
 *
 * The disc geometry hangs off ONE hook — `--tk-avatar-size` — which feeds
 * both the host box AND the initials type size, so a consumer override
 * (the `size` property writes the host inline custom property, the
 * skeleton-geometry mold) can never desynchronize the glyph from the
 * circle. The 45px default is the news measurement (spec 20.1).
 */
export const avatarStyles = css`
  :host {
    position: relative;
    display: inline-block;
    flex: none;
    width: var(--tk-avatar-size, 45px);
    height: var(--tk-avatar-size, 45px);
  }

  /* The disc: full-radius flat token fill; the initials ride the fg
     color at 0.4× the size (45px disc → 18px glyphs, the body row). */
  .circle {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--tk-avatar-bg, var(--tk-color-surface-muted));
    color: var(--tk-avatar-fg, var(--tk-color-text-secondary));
    overflow: hidden;
    font-family: var(--tk-font-body);
    font-size: calc(var(--tk-avatar-size, 45px) * 0.4);
    font-weight: 600;
    line-height: 1;
    user-select: none;
  }

  /* The image state: cover-cropped to the disc; lazy + async decoding
     enforced in the template (the tk-figure mold, an internal img). */
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Consumer overlay (status dots & co) — absolutely positioned over the
     disc, decorative by contract (the service-card icon-slot mold): the
     wrapper hides whatever the consumer floats in, no status ring of
     the atom's own (AC4 — the ring is out of scope, slotted only). */
  .overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }
`;
