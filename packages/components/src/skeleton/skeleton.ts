import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { skeletonStyles } from './skeleton.css.js';

/**
 * tk-skeleton — the kit's loading placeholder bone (spec 21.2, invest
 * foundation wave; GAP-MAP A4).
 *
 * One neutral bone in three shapes: `line` (a text-line placeholder, the
 * default), `circle` (an avatar/logo place) and `rect` (a media/block
 * place). The bone paints on the HOST itself — the shadow tree stays
 * empty, there is no slottable content to read. Loading is DECORATIVE:
 * the host is stamped `aria-hidden="true"` on connect (out of the a11y
 * tree); the loading STATE is the consumer's contract — the container
 * pattern `aria-busy="true"` is documented in the catalog demo story
 * (a consumer attribute, never the atom's).
 *
 * Geometry: the `width`/`height` attributes are px strings applied as
 * host inline styles (overriding the per-variant CSS defaults: line
 * 100%×12, circle 40×40, rect 100%×80). Raw px on the instance is the
 * documented zero-hardcoded blind spot — the MENU_OFFSET_PX precedent
 * (19.1): placeholder geometry mirrors the content it stands in for, and
 * that is consumer data, not theming.
 *
 * Animation (AC ruling): an opacity pulse 1↔0.5, ~1.4s ease-in-out,
 * infinite; `prefers-reduced-motion: reduce` collapses it to a static
 * bone. NO shimmer gradient — never proven on the live surface (probe
 * ×3 missed the pre-hydration frame; the ТЖ in-repo skeleton ships
 * unanimated — nothing invented).
 *
 * STATELESS (the tk-badge mold): nothing dispatches — the event-map
 * no-entry case. No keyboard contract exists on purpose: a hidden
 * decorative element must not hold a focus stop.
 *
 * @tag tk-skeleton
 * @attr {line|circle|rect} variant - Bone shape (default `line`); invalid values clamp to `line`.
 * @attr {string} width - CSS width override (px string) — host inline style; unset keeps the variant default.
 * @attr {string} height - CSS height override (px string) — host inline style; unset keeps the variant default.
 */
export class TkSkeleton extends LitElement {
  /** Variant union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly variants = ['line', 'circle', 'rect'] as const;

  /** Bone shape. */
  @property({ reflect: true })
  variant: 'line' | 'circle' | 'rect' = 'line';

  /** Width override — a CSS string (px) applied as host inline style. */
  @property({ type: String })
  width?: string;

  /** Height override — a CSS string (px) applied as host inline style. */
  @property({ type: String })
  height?: string;

  static override readonly styles = [skeletonStyles];

  /**
   * Enum clamp — the CONVENTIONS §2 error strategy: an invalid `variant`
   * degrades to the union default (never throws), reflected attribute
   * corrected so the DOM shows the value in force. Geometry attributes
   * route to host inline styles; clearing removes the override so the
   * per-variant CSS default returns.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has('variant') &&
      !(TkSkeleton.variants as readonly string[]).includes(this.variant)
    ) {
      this.variant = 'line';
    }
    if (changed.has('width')) {
      this.#applyGeometry('width', this.width);
    }
    if (changed.has('height')) {
      this.#applyGeometry('height', this.height);
    }
  }

  #applyGeometry(prop: 'width' | 'height', value: string | undefined): void {
    if (value === undefined || value === '') {
      this.style.removeProperty(prop);
    } else {
      this.style.setProperty(prop, value);
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Decorative by contract: out of the accessibility tree. Stamped on
    // connect (idempotent), never in the constructor — the React 19 law
    // isolated at v1.5.0 Flow-B (constructor-time attributes do not
    // survive the element's upgrade; connectedCallback ones do).
    this.setAttribute('aria-hidden', 'true');
  }

  override render() {
    // The bone paints on :host; the shadow tree stays an empty marker.
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-skeleton': TkSkeleton;
  }
}

if (!customElements.get('tk-skeleton')) {
  customElements.define('tk-skeleton', TkSkeleton);
}
