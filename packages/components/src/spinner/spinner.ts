import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { spinnerStyles } from './spinner.css.js';

/**
 * tk-spinner — the kit's circular indeterminate loader atom (spec 27.1,
 * quality window; adopt-atom BENCHMARK #3 grounded on the kit's OWN
 * registers — the terminal 24T census gave 0 live occurrences, so no
 * reference kit is copied pixel-wise).
 *
 * An SVG arc of three quarters of a circle (a 25% gap), 2px round-cap
 * stroke, rotating a steady 0.9s linear loop. The color register is
 * `currentColor` — the arc inherits the context text color (the
 * full-radius progress family), so the atom themes through whatever text
 * surrounds it and adds NO token of its own.
 *
 * DETERMINATE loading is REFUSED here on purpose: a known-percentage
 * progress surface is tk-progress-bar's contract (its `value` channel,
 * `aria-valuenow` narration and zero-state copy) — this atom is the
 * unknown-duration companion, never a second progress meter.
 *
 * A11y (AC4): a NAMED instance (`label` non-empty, default «Загрузка»)
 * self-asserts `role="status"` + the label as its accessible name at
 * connect (the React-19 law: constructor-time attributes never survive the
 * element's upgrade — the tk-rating idiom); role=status carries the
 * aria-live polite policy, so a spinner mounted into a changing region
 * announces itself once, on its own timeline. A DECORATIVE instance
 * (`label=''`) is the rating aria-hidden points mold: the host leaves the
 * accessibility tree (`aria-hidden="true"`) — for repeats and inline
 * decoration next to visible text. The arc svg is aria-hidden in BOTH
 * modes; the name, when present, is text.
 *
 * STATELESS (the tk-rating/tk-skeleton mold): nothing dispatches — the
 * event-map no-entry case; no keyboard contract exists on purpose (a
 * loader must not hold a focus stop).
 *
 * Geometry (AC2): `size` writes the host inline custom property
 * `--tk-spinner-size` — ONE channel for the box and the arc (the tk-avatar
 * size mold); the viewBox, radius (r = (size − 2·stroke)/2 with the 2px
 * default) and the 75/25 dash split are computed from the same clamped
 * value in the template.
 *
 * @tag tk-spinner
 * @attr {16|20|24|32} size - Spinner size (default `20`) — host inline custom property `--tk-spinner-size`; the row is the kit's typical text sizes; invalid values clamp to `20`.
 * @attr {string} label - Accessible name of the loading state (default `Загрузка`); `label=''` switches to the decorative aria-hidden mode.
 */
export class TkSpinner extends LitElement {
  /** Size union (CONVENTIONS §2: literal unions, never forking booleans). */
  static readonly sizes = ['16', '20', '24', '32'] as const;

  /** Spinner size — one channel with the `--tk-spinner-size` hook. */
  @property({ reflect: true })
  size: '16' | '20' | '24' | '32' = '20';

  /** Accessible name; an empty string renders the decorative mode. */
  @property({ type: String })
  label = 'Загрузка';

  static override readonly styles = [spinnerStyles];

  /** Which semantics WE currently own on the host (withdraw exactly those). */
  #semanticsOwned: 'named' | 'decorative' | null = null;

  /** The size in force — invalid values clamp to the union default (the prop is corrected, CONVENTIONS §2). */
  get #effectiveSize(): '16' | '20' | '24' | '32' {
    return (TkSpinner.sizes as readonly string[]).includes(this.size)
      ? this.size
      : '20';
  }

  /** The trimmed label, or null in the decorative mode (the avatar name mold). */
  get #displayName(): string | null {
    const trimmed = this.label.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Semantics at CONNECT time (§10 construction safety + the React-19
    // law): re-asserted on every connect, idempotent (tk-rating idiom).
    this.#syncSemantics();
  }

  /**
   * Enum clamp + the two host-write channels: the size geometry hook and
   * the role/aria stamp (recomputed on every label change — harmless on
   * the first pass after connect asserted it).
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('size')) {
      if (!(TkSpinner.sizes as readonly string[]).includes(this.size)) {
        this.size = '20';
      }
      this.style.setProperty('--tk-spinner-size', `${this.#effectiveSize}px`);
    }
    if (changed.has('label')) {
      this.#syncSemantics();
    }
  }

  /**
   * The semantics stamp: a named instance self-asserts role=status + the
   * label as its accessible name; a decorative one hides the host. A mode
   * flip withdraws EXACTLY what we set — a consumer-supplied host attribute
   * of the other kind is never touched.
   */
  #syncSemantics(): void {
    const named = this.#displayName;
    if (named !== null) {
      if (this.#semanticsOwned === 'decorative') {
        this.removeAttribute('aria-hidden');
      }
      this.setAttribute('role', 'status');
      this.setAttribute('aria-label', named);
      this.#semanticsOwned = 'named';
      return;
    }
    if (this.#semanticsOwned === 'named') {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
    this.setAttribute('aria-hidden', 'true');
    this.#semanticsOwned = 'decorative';
  }

  override render() {
    // Arc geometry from the size channel (AC2): r = (size − 2·stroke)/2
    // with the 2px default stroke; pathLength 100 normalizes the dash, so
    // the 75/25 split is the three-quarter shape at every size. Computed
    // geometry in the template — never theming (the tk-rating clip-path
    // precedent).
    const size = Number(this.#effectiveSize);
    const radius = (size - 4) / 2;
    return html`
      <svg class="spinner" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle
          class="spinner__arc"
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          pathLength="100"
          stroke-dasharray="75 25"
        ></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-spinner': TkSpinner;
  }
}

if (!customElements.get('tk-spinner')) {
  customElements.define('tk-spinner', TkSpinner);
}
