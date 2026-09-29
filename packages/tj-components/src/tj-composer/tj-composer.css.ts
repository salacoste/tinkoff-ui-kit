import { css } from 'lit';

/**
 * tj-composer styles (spec 16.4) — tokens ONLY; every structural non-token
 * value carries its FLAG inline (flag-don't-invent).
 *
 * Height is DERIVED on-scale, never declared: padding-block 24 × 2 + avatar
 * 40 = 88 (the vision band 88–96 brackets it — no height FLAG, it composes
 * from scale parts). Radius is the one structural FLAG (probe-measured r20;
 * no card-family token carries 20 — `--tj-radius-chip` is pill geometry, not
 * a card radius; a `--tj-radius-composer` token is a maintainer ratification
 * candidate, NOT minted here — no new tokens this story).
 */
export const composerStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  .composer {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    align-items: center;
    gap: var(--tj-space-24); /* avatar → ghost-text gap (scale value) */
    /* Height composes from scale parts: padding-block 24×2 + avatar 40 = 88
       (the vision band 88–96 brackets it — derived, not declared). */
    padding: var(--tj-space-24) var(--tj-space-32);
    background: var(--tj-color-card);
    border: none;
    border-radius: 20px; /* FLAG: probe-measured r20 — no card-family token carries 20 (chip=20 is pill geometry, NOT a card radius); --tj-radius-composer is a ratification candidate, not minted here */
    font-family: var(--tj-font-ui);
    text-align: left;
    cursor: pointer; /* the single native affordance touch — a button that opens, no hover art (unprobed) */
    -webkit-tap-highlight-color: transparent; /* the 16.1 tap-no-flash idiom */
  }

  .composer:focus-visible {
    outline: 2px solid var(--tj-color-focus-ring); /* the 16.1/16.3 tj ring mold verbatim */
    outline-offset: 2px;
  }

  /* The avatar is decorative HERE (identification rides the button's ghost
     text name — the 16.3 mark ruling generalized to the user's own avatar):
     the wrapper is aria-hidden in the template so slotted alt text cannot
     pollute the button's accessible name. Absent slot → no phantom circle
     (the wrapper is only rendered while the slot has content). */
  .composer__avatar {
    flex: none;
  }

  .composer__avatar ::slotted(img) {
    display: block;
    width: var(--tj-space-40); /* avatar 40 — scale value (the reference's stroke-only placeholder is consumer art, not kit chrome) */
    height: var(--tj-space-40);
    border-radius: var(--tj-radius-badge); /* round — the news-card avatar idiom */
    object-fit: cover;
  }

  .composer__label {
    /* Ghost text = card-title species 17/400 (one-species-one-leading);
       ink-300 on the white card = the AA meta step (the AA-surface law).
       No card-title-leading token exists — 24 is the on-scale pick (the
       news-card excerpt precedent). */
    margin: 0;
    font-size: var(--tj-text-card-title-size);
    font-weight: var(--tj-text-card-title-weight);
    line-height: var(--tj-space-24); /* FLAG: pick — no card-title-leading token; scale value */
    color: var(--tj-color-ink-300);
  }
`;
