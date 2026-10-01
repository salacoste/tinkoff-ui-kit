import { css } from 'lit';

/**
 * tj-composer styles (spec 16.4 + the 2026-10-01 live-fidelity audit) —
 * tokens ONLY; every structural non-token value carries its FLAG inline
 * (flag-don't-invent).
 *
 * Height is DERIVED, never declared: padding-block 24 × 2 + avatar 50 = 98
 * (live rect 760×98, audit 2026-10-01). Radius rides the CARD family token
 * (--tj-radius-card = 25 — live br25; the old r20 FLAG is closed by the
 * audit, no `--tj-radius-composer` token was ever minted). Padding-inline
 * 29 and avatar 50 are measured off-scale literals, FLAGged per the
 * prose-literal law.
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
    /* Height composes from parts: padding-block 24×2 + avatar 50 = 98
       (live rect 760×98, audit 2026-10-01 — derived, not declared). */
    padding: var(--tj-space-24) 29px; /* FLAG: inline 29 — measured live (audit 2026-10-01), off-scale literal; no token may be minted for it (prose-literal law) */
    background: var(--tj-color-card);
    border: none;
    border-radius: var(--tj-radius-card); /* live br25 (audit 2026-10-01) = the card family — the r20 FLAG is closed */
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
    width: 50px; /* FLAG: avatar 50 — measured live 50×50 (audit 2026-10-01), off-scale literal; the reference's stroke-only placeholder is consumer art, not kit chrome */
    height: 50px;
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
