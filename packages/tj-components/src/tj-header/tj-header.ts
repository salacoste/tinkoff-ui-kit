import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { headerStyles } from './tj-header.css.js';

/** The document-root theme attribute the whole ТЖ family themes through (OQ-9). */
export const TJ_THEME_ATTRIBUTE = 'data-tj-theme';

/** The three modes of the ТЖ theme cycle (auto = the OS preference, pure CSS). */
export type TjThemeMode = 'auto' | 'light' | 'dark';

/** RU polite announcements per resulting mode (the spec's copy verbatim). */
const THEME_ANNOUNCEMENT: Readonly<Record<TjThemeMode, string>> = {
  auto: 'Тема оформления: системная',
  light: 'Тема оформления: светлая',
  dark: 'Тема оформления: тёмная',
};

/** The cycle order (State Patterns·Theme — read-on-click, stateless). */
const NEXT_MODE: Readonly<Record<TjThemeMode, TjThemeMode>> = {
  auto: 'light',
  light: 'dark',
  dark: 'auto',
};

/**
 * The `theme-change` occurrence (§9 grammar, the TjOpenComposeEvent class
 * mold): the theme control was activated and the resulting mode is now in
 * force on the document root. `detail` is the resulting mode STRING
 * ('auto' | 'light' | 'dark') — the spec's explicit 16.5 ruling, NOT a
 * `{ value }` payload: the state lives on `document.documentElement`, not on
 * the element, so this is not a `<prop>-change` value channel and the React
 * unwrap contract hands handlers the event itself.
 */
export class TjThemeChangeEvent extends CustomEvent<TjThemeMode> {
  static readonly eventName = 'theme-change' as const;

  constructor(mode: TjThemeMode) {
    super(TjThemeChangeEvent.eventName, {
      detail: mode,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * One nav chip of the `items` prop — navigation data, not a form channel
 * (the bank TkNavbarLink mold, minus `value`: the ТЖ header addresses the
 * current chip by `href`, the only stable key this shape carries).
 */
export interface TjHeaderItem {
  /** Visible chip text (also the anchor's accessible name). */
  label: string;
  /** Navigation target + the key `active-value` addresses (exact match). */
  href: string;
}

/**
 * Scroll threshold (px) at which the bar compresses — the ТЖ contract is
 * ANY scroll (>0) compresses, back to 0 restores (EXPERIENCE Header), so the
 * threshold is 0 and the comparison is strict. A JS timing constant like the
 * bank navbar's TK_NAVBAR_SCROLL_THRESHOLD_PX (the token layer cannot feed
 * JS comparisons).
 */
export const TJ_HEADER_SCROLL_THRESHOLD_PX = 0;

/** The nav landmark's accessible name (the tk-navbar DEFAULT_NAV_LABEL precedent). */
const DEFAULT_NAV_LABEL = 'Навигация';

/** The theme control's accessible name — the reference's own computed label (probe-notes). */
const THEME_BUTTON_LABEL = 'Переключить тему оформления';

/** Default CTA label (the reference copy, probe-notes «Написать»). */
const DEFAULT_CTA_LABEL = 'Написать';

/**
 * tj-header — the ТЖ sticky site chrome (Story 16.5): wordmark slot, nav
 * chips, an actions slot (CONSUMER interiors — the kit ships spacing only,
 * no icon art), the theme control, and the «Написать» CTA.
 *
 * THE NAV (the bank navbar mold translated, never imported): `items` is
 * navigation data — `active-value` is a PROP ONLY (no §4 pair, no event;
 * the consumer sets it from its router). A value matching nothing marks NO
 * chip. Current marking is SEMANTIC-ONLY: `aria-current="page"` with ZERO
 * visual delta — the 2026-09-28 reference capture shows all nav pills
 * equivalent (no weight delta, no highlight, no underline; the probe9
 * census renders the species uniform 17/700). Unprobed marking is not
 * invented (the 16.5 patch-round ruling, vision-evidenced).
 *
 * THE THEME CONTROL (the State-Patterns contract): a built-in
 * `<button type="button">` that cycles auto→light→dark→auto STATELESSLY —
 * on every click it READS `data-tj-theme` off the document root and writes
 * the next mode; auto REMOVES the attribute (the sheet's auto leg is
 * `:not([data-tj-theme="light"])` + prefers-color-scheme — no-flash by
 * construction, the selector is render-blocking CSS). NO matchMedia
 * listener: auto re-resolution is pure CSS, nothing for JS to do. The
 * control dispatches `theme-change` (the resulting mode) and announces it
 * via an internal `aria-live="polite"` region (RU copy). The decorative
 * fallback glyph (aria-hidden contrast circle) is overridable by the
 * `theme-icon` slot — ONE glyph for all modes, no per-mode art.
 *
 * THE CTA: `cta-href`/`cta-label` render the header's OWN anchor (the
 * no-cross-compose norm — the tj-cta compact-inset mold re-implemented
 * here, never composed): 44×44 invisible hit floor, a fully-rounded 36px
 * visible pill via tokens (`--tj-radius-full` +
 * `--tj-color-cta-fill`/`--tj-color-cta-ink`; dark re-resolves to
 * the inverted pill, zero branches — the 2026-09-28 capture's pill, NOT
 * the article CTA's 5px radius). Empty/unset `cta-href` → the anchor
 * renders WITHOUT the attribute — inert, no tab stop (the 16.1 mold).
 *
 * STICKY + COMPRESS: `position: sticky; top: 0; z-index: var(--tj-z-nav)`
 * (the one sanctioned non-overlay z consumption); the bar's grid row goes
 * 72px → 56px on any scroll (h72/h56 structural FLAGs) over the 150ms fast
 * token (instant under reduced motion — the token layer collapses the
 * duration, plus the belt below); the compress animates the GRID ROW, not
 * a layout box metric (the design-detector law — grid-template-rows is the
 * sanctioned height-animation channel). The internal passive scroll
 * observer flips a host
 * `data-scrolled` attribute — internal state, NOT public API. Background
 * `--tj-color-page` with NO divider — the reference bar blends into the
 * page (2026-09-28 capture; the authored hairline was removed at the patch
 * round). NO hide-on-scroll (unprobed → no invention).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the scroll listener
 * attaches on connect and is passive.
 *
 * @tag tj-header
 * @prop {TjHeaderItem[]} [items] - Nav chips ({ label, href }); href-less/duplicate-href entries clamp out with a dev warn.
 * @attr {string} [active-value] - The current chip's href (exact match) — semantic-only marking (aria-current, zero visual delta — the reference marks nothing visually); prop-only, never reflected, no event.
 * @attr {string} [cta-href] - The CTA anchor's URL; empty/unset renders an inert anchor (no href attribute).
 * @attr {string} [cta-label] - CTA label. Default «Написать».
 * @slot wordmark - The brand block; ONE accessible name rides the slot's own text (the kit wraps neutrally).
 * @slot actions - Icon-button cluster (consumer interiors; the kit ships spacing only).
 * @slot theme-icon - Overrides the theme control's decorative fallback glyph.
 * @fires theme-change - The theme control cycled; `detail` = the resulting 'auto'|'light'|'dark'.
 */
export class TjHeader extends LitElement {
  static override readonly styles = [headerStyles];

  /** Nav chips — property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  items: TjHeaderItem[] = [];

  /**
   * The current chip's href — NOT a channel (the spec's §9 exception row 3
   * translated): a plain input prop the consumer sets; the element
   * dispatches nothing. Accepted from the `active-value` attribute, never
   * reflected (value data, CONVENTIONS §2). Lit maps attribute REMOVAL to
   * a null property write — every read is null-guarded.
   */
  @property({ type: String, attribute: 'active-value' })
  activeValue?: string | null;

  /**
   * The CTA anchor's URL (string data, never reflects). Empty/absent
   * renders NO href attribute — the 16.1 inert-content rule (the news-card
   * mold): visually present, no tab stop.
   */
  @property({ type: String, attribute: 'cta-href' })
  ctaHref?: string | null;

  /** The CTA label (string data, never reflects); default the reference copy. */
  @property({ type: String, attribute: 'cta-label' })
  ctaLabel: string | null = DEFAULT_CTA_LABEL;

  /** The data-scrolled flag driven by the passive scroll listener. */
  #scrolled = false;

  /** The last theme announcement (the polite region's text; empty = silent). */
  #announcement = '';

  /** The theme-icon slot carries content (drives the fallback glyph — graceful both ways). */
  #themeIconSlotted = false;

  #handleThemeIconSlotchange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const next = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
    if (next !== this.#themeIconSlotted) {
      this.#themeIconSlotted = next;
      this.requestUpdate();
    }
  }

  // Initial-mount backstop (the tj-composer note, the news-card excerpt
  // mold): the slotchange EVENT is queued inconsistently for the FIRST
  // assignment, so every render re-syncs the tracked presence from the live
  // slot assignment. Change-guarded.
  #syncThemeIconPresence(): void {
    const slot = this.renderRoot.querySelector("slot[name='theme-icon']") as HTMLSlotElement | null;
    const next = this.#slotHasContent(slot);
    if (next !== this.#themeIconSlotted) {
      this.#themeIconSlotted = next;
      this.requestUpdate();
    }
  }

  // The bank article-card mold: an ELEMENT node counts as content — bare
  // whitespace text nodes do not (template formatting noise).
  #slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE);
  }

  /**
   * Duplicate/empty-href clamp (the tk-navbar link clamp translated to the
   * value-less ТЖ shape): `active-value` addresses chips BY href, so a
   * duplicate href is ambiguous and an empty href could never be addressed
   * (and would render an inert chip — dead chrome). Both drop with a dev
   * warn; length-guarded so the follow-up update converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('items')) {
      const raw = this.items ?? [];
      const seen = new Set<string>();
      const kept = raw.filter((item) => {
        const href = item?.href;
        if (href == null || href === '' || seen.has(href)) return false;
        seen.add(href);
        return true;
      });
      if (this.items != null && kept.length !== raw.length) {
        console.warn(
          'tj-header: duplicate or empty-href item entries dropped — item hrefs must be unique non-empty strings (first occurrence wins; active-value addresses chips by href)',
        );
        this.items = kept;
      }
    }
  }

  /**
   * The ONE scroll code in the file (the bank navbar mold): flips the host's
   * `data-scrolled` attribute at the threshold; the CSS compresses the bar
   * over the 150ms token. Toggle only on threshold cross — no rAF thrash.
   */
  readonly #onScroll = (): void => {
    if (typeof window === 'undefined') return;
    const next = (window.scrollY ?? 0) > TJ_HEADER_SCROLL_THRESHOLD_PX;
    if (next === this.#scrolled) return;
    this.#scrolled = next;
    if (next) this.setAttribute('data-scrolled', '');
    else this.removeAttribute('data-scrolled');
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.#onScroll, { passive: true });
    }
    // Reflect the CURRENT scroll position at connect (a header mounted
    // mid-scroll must not wait for the next scroll event to compress).
    this.#onScroll();
  }

  override disconnectedCallback(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.#onScroll);
    }
    super.disconnectedCallback();
  }

  protected override updated(): void {
    this.#syncThemeIconPresence();
  }

  /**
   * Reads the mode in force RIGHT NOW off the document root — the stateless
   * heart of the contract (no cached mode, no MutationObserver: consumer
   * out-of-band writes — SSR, other controls, devtools — can never desync
   * the control because it never remembers anything).
   */
  #currentMode(): TjThemeMode {
    if (typeof document === 'undefined') return 'auto';
    const raw = document.documentElement.getAttribute(TJ_THEME_ATTRIBUTE);
    return raw === 'light' || raw === 'dark' ? raw : 'auto';
  }

  /**
   * The ONLY interactive path of the theme control: read fresh → write next
   * (auto = REMOVE the attribute — the sheet's auto leg takes over) →
   * announce → dispatch. No matchMedia, no listener, no stored state.
   */
  readonly #handleThemeActivate = (): void => {
    const next = NEXT_MODE[this.#currentMode()];
    if (typeof document !== 'undefined') {
      if (next === 'auto') document.documentElement.removeAttribute(TJ_THEME_ATTRIBUTE);
      else document.documentElement.setAttribute(TJ_THEME_ATTRIBUTE, next);
    }
    this.#announcement = THEME_ANNOUNCEMENT[next];
    this.requestUpdate();
    this.dispatchEvent(new TjThemeChangeEvent(next));
  };

  /** The 16.1 href rule: EMPTY string is NOT a live href — render no attribute. */
  #ctaHref(): string | typeof nothing {
    return this.ctaHref != null && this.ctaHref.length > 0 ? this.ctaHref : nothing;
  }

  override render() {
    const activeValue = this.activeValue;
    return html`
      <header class="bar">
        <div class="bar__inner">
          <div class="bar__wordmark">
            <slot name="wordmark"></slot>
          </div>
          <nav class="chips" aria-label="${DEFAULT_NAV_LABEL}">
            ${(this.items ?? []).map((item) => {
              const isCurrent = item.href === activeValue;
              return html`
                <a class="chip" href=${item.href} aria-current=${isCurrent ? 'page' : nothing}
                  >${item.label}</a
                >
              `;
            })}
          </nav>
          <div class="bar__actions">
            <slot name="actions"></slot>
          </div>
          <button type="button" class="theme" aria-label="${THEME_BUTTON_LABEL}"
            @click=${this.#handleThemeActivate}>
            ${this.#themeIconSlotted
              ? html`<slot name="theme-icon" @slotchange=${this.#handleThemeIconSlotchange}></slot>`
              : html`
                  <slot
                    name="theme-icon"
                    @slotchange=${this.#handleThemeIconSlotchange}
                    hidden
                  ></slot>
                  <svg
                    class="theme__glyph"
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" fill="var(--tj-color-ink-300)"></circle>
                    <path d="M12 3a9 9 0 0 1 0 18z" fill="var(--tj-color-ink-100)"></path>
                  </svg>
                `}
          </button>
          <a class="bar__cta" href=${this.#ctaHref()}>
            <span class="bar__cta-label">${this.ctaLabel}</span>
          </a>
        </div>
      </header>
      <span class="visually-hidden" aria-live="polite">${this.#announcement}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tj-header': TjHeader;
  }
}

if (!customElements.get('tj-header')) {
  customElements.define('tj-header', TjHeader);
}
