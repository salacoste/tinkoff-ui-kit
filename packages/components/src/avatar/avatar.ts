import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { avatarStyles } from './avatar.css.js';

/**
 * tk-avatar — the kit's round identity disc (spec 26.3, form-control
 * completeness wave; grounded thrice: tj byline 20, tj news 45 — the
 * 20.1 measurement — and the admin-feed circles).
 *
 * Three display states, derived — never stored (the tk-rating
 * stateless-display ruling):
 * - IMAGE: `src` set and decoded — cover-cropped, `loading=lazy` +
 *   `decoding=async` (the tk-figure enforcement, an internal img);
 *   a decode failure falls back to INITIALS.
 * - INITIALS: no `src` (or a failed one) with a `name` — the first
 *   letters of the first two whitespace words, uppercased
 *   («Мария Оганова» → «МО»; a single word → its first letter).
 * - PLACEHOLDER: neither — a flat token disc with no content
 *   (the tj-composer placeholder register).
 *
 * A11y (AC3): a NAMED disc self-asserts `role="img"` +
 * `aria-label={name}` at connect (the React-19 law: constructor-time
 * attributes never survive the element's upgrade — the tk-rating
 * idiom). An UNNAMED disc is the consumer's contract verbatim: they
 * name it with a host aria-label (untouched by the atom) or hide it
 * with the reflected `aria-hidden` property — the admin-feed repeat
 * pattern (the first row announces, the repeats are decorative). A
 * blind role=img without a name would be an axe violation, so the
 * role rides the name, not the tag.
 *
 * STATELESS (the tk-rating mold): nothing dispatches — the event-map
 * no-entry case; no keyboard contract exists on purpose (a display
 * atom must not hold a focus stop).
 *
 * @tag tk-avatar
 * @attr {string} src - Image URL; unset (or a decode failure) falls back to initials/placeholder.
 * @attr {string} name - Person name: the initials source AND the accessible label of the disc.
 * @attr {string} size - Disc size (px string, default 45) — host inline custom property; the `--tk-avatar-size` hook is the same channel.
 * @attr {string} aria-hidden - Decorative mode (reflected): the disc leaves the accessibility tree — for repeats in rows.
 */
export class TkAvatar extends LitElement {
  static override readonly styles = [avatarStyles];

  /** Image URL — the IMAGE state when set, empty string reads as unset. */
  @property({ type: String })
  src?: string;

  /** Person name — the initials source and the accessible label. */
  @property({ type: String })
  name?: string;

  /**
   * Disc size — a px string applied as the host inline custom property
   * `--tk-avatar-size` (the skeleton-geometry mold: clearing removes the
   * override, the CSS default 45 returns). One channel with the hook —
   * the box and the initials glyph cannot drift apart.
   */
  @property({ type: String })
  size?: string;

  /** Decorative mode (AC3) — reflected, a plain pass-through to hide repeats. */
  @property({ attribute: 'aria-hidden', reflect: true })
  ariaHidden: string | null = null;

  /**
   * Decode-failure latch: set by the img error event, reset by a new src.
   * A private field + explicit requestUpdate (the kit mold — no @state
   * fields anywhere in the tree; keeps the field out of the CEM surface).
   */
  #imageFailed = false;

  /** Whether the identity attributes currently on the host are OURS. */
  #identityOwned = false;

  /** The trimmed name, or null when the disc is unnamed (placeholder state). */
  get #displayName(): string | null {
    const trimmed = (this.name ?? '').trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  /**
   * Initials (AC2): first letters of the first two whitespace-separated
   * words, uppercased; unnamed discs render none.
   */
  get #initials(): string {
    const named = this.#displayName;
    if (named === null) return '';
    return named
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Identity at CONNECT time (§10 construction safety + the React-19
    // law): re-asserted on every connect, idempotent (tk-rating idiom).
    this.#syncIdentity();
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('name')) {
      this.#syncIdentity();
    }
    if (changed.has('size')) {
      this.#applyGeometry();
    }
    if (changed.has('src')) {
      // A new URL deserves a fresh decode attempt (the failure latch is
      // about THIS src, not the element).
      this.#imageFailed = false;
    }
  }

  #applyGeometry(): void {
    if (this.size === undefined || this.size === '') {
      this.style.removeProperty('--tk-avatar-size');
    } else {
      this.style.setProperty('--tk-avatar-size', this.size);
    }
  }

  /**
   * The identity stamp: a named disc self-asserts role=img + the name as
   * its accessible label; a cleared name withdraws EXACTLY what we set —
   * a consumer-supplied host label is never touched (unnamed discs are
   * the consumer's contract: name it or hide it).
   */
  #syncIdentity(): void {
    const named = this.#displayName;
    if (named !== null) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', named);
      this.#identityOwned = true;
      return;
    }
    if (!this.#identityOwned) return;
    this.removeAttribute('role');
    this.removeAttribute('aria-label');
    this.#identityOwned = false;
  }

  #handleImageError(): void {
    this.#imageFailed = true;
    this.requestUpdate();
  }

  override render() {
    const hasImage = this.src !== undefined && this.src !== '' && !this.#imageFailed;
    return html`
      <span class="circle">
        ${hasImage
          ? html`<img
              src=${this.src}
              alt=""
              loading="lazy"
              decoding="async"
              @error=${this.#handleImageError}
            />`
          : this.#initials !== ''
            ? html`<span class="initials">${this.#initials}</span>`
            : nothing}
      </span>
      <span class="overlay" aria-hidden="true"><slot></slot></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-avatar': TkAvatar;
  }
}

if (!customElements.get('tk-avatar')) {
  customElements.define('tk-avatar', TkAvatar);
}
