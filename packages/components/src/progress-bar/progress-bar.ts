import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { progressBarStyles } from './progress-bar.css.js';

/**
 * Zero-state copy (EXPERIENCE State Patterns: «Empty | ProgressBar … →
 * Zero-state copy slot; never blank»). The default text inside the `empty`
 * slot; consumers project their own copy through `<* slot="empty">` — the
 * tk-thumbnail-picker same-slot-same-role precedent.
 */
const DEFAULT_EMPTY_COPY = 'Ещё ничего не заполнено';

/**
 * Narration template (the announce prop): a localization-ready constant in
 * the reference's own phrasing register («Уже заполнено N%»). The percent is
 * the rounded integer the value cell shows.
 */
const announceText = (percent: number): string => `Заполнено ${percent}%`;

/**
 * tk-progress-bar — determinate default, safe indeterminate (Story 2.7), the
 * form's «Уже заполнено N%» completion feedback.
 *
 * STATELESS DISPLAY COMPONENT (the spec's ruling): `value` is an INPUT, not
 * state — there is no value-change channel, no controlled/uncontrolled pair,
 * and NOTHING ever dispatches (the completeness guard's no-entry case, like
 * tk-button). Display-side math CLAMPS into [min, max] on render without
 * mutating the prop: `value` 150 with `max` 100 renders 100% while the
 * property keeps 150 (the I/O matrix's «prop untouched» row).
 *
 * MATH (all display-side, rounded to integer percent — the matrix's «33%»
 * row; the sub-percent remainder is invisible at the 4px track height):
 * width% = round((clamp(value) − min) / (max − min) × 100). Non-finite or
 * absent `value` (attribute `value="abc"` → NaN, undefined) reads as `min`.
 * DEGENERATE `min >= max` (min>max and the empty range min===max): 0% fill,
 * NO aria-valuenow/valuemin/valuemax — exposing a reversed min/max pair to
 * AT would be malformed; the picked treatment from the spec's «pick + test».
 *
 * SEMANTICS: the shadow `.track` div carries `role="progressbar"` with
 * `aria-valuenow/min/max` when determinate and well-formed; indeterminate is
 * the aria-busy presentation with NO aria-valuenow (unknown progress). The
 * accessible name comes from the header's label span via aria-labelledby —
 * the SPAN pattern (the 2.4/2.5 ratified lesson: never a clickable
 * `<label for>`), or from the empty-state copy span when the zero state
 * renders. A bare bar (no label, no slots, non-zero fill) is unnamed by
 * design — consumers name it through the label prop/slot.
 *
 * EMPTY STATE (EXPERIENCE: «Zero-state copy slot; never blank» — the exact
 * trigger, per the spec's note-the-rule instruction): renders when
 * DETERMINATE AND the CLAMPED value equals min EXACTLY (the frozen rule's
 * «value === min» — absent value reads as min; a value of 0.4 over 0–100 is
 * real progress and renders the bare bar even though its percent rounds to
 * 0) AND there is no label CONTENT (neither slotted real content nor the
 * `label` prop) AND the `value` slot carries no real content. Then the
 * header shows the `empty` slot (default copy above) INSTEAD of the
 * label/% pair; the 4px track still renders at 0% below it.
 *
 * ANNOUNCE (optional, off by default — EXPERIENCE names ProgressBar the one
 * sanctioned optional aria-live user): `announce` renders a visually-hidden
 * `aria-live="polite"` span and narrates SETTLED values only — one rAF
 * coalescing window (a burst of value updates narrates once, the last
 * value) plus a last-announced tracker that skips no-change renders. No
 * timers beyond the single rAF settle. Indeterminate and degenerate bars
 * never narrate (nothing to settle).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; the one imperative
 * step (writing the live region's text) runs in `updated()` after the region
 * exists, never at construction.
 *
 * @tag tk-progress-bar
 * @attr {string} label - Visible label text left of the percentage; used only when the `label` slot is empty.
 * @attr {number} value - Current value (display-clamped into [min, max]; never reflected, never mutated).
 * @attr {number} min - Range floor (default 0; non-numeric reads as 0).
 * @attr {number} max - Range ceiling (default 100; non-numeric reads as 100).
 * @attr {boolean} indeterminate - Unknown-progress presentation: 33% fill slide loop (static under reduced motion); no aria-valuenow.
 * @attr {boolean} announce - Optional polite narration of settled values via a visually-hidden aria-live span (off by default).
 * @slot label - Label text (left cell); wins over the `label` prop when it carries real content.
 * @slot value - Percentage cell (right); falls back to the computed «N%» when empty.
 * @slot empty - Zero-state copy shown instead of the label/% pair at zero progress with no label/% content.
 */
export class TkProgressBar extends LitElement {
  static override readonly styles = [progressBarStyles];

  /** Visible label text — the `label` slot's fallback (slot content wins). */
  @property({ type: String })
  label?: string;

  /**
   * Current value — an INPUT, not state (the stateless ruling): display
   * clamps into [min, max], the prop itself is never corrected and nothing
   * emits. Number data never reflects (CONVENTIONS §2); a non-numeric
   * attribute (`value="abc"`) arrives as NaN and reads as `min`.
   */
  @property({ type: Number })
  value?: number;

  /** Range floor. Display-side only; non-finite reads as 0. */
  @property({ type: Number })
  min = 0;

  /** Range ceiling. Display-side only; non-finite reads as 100. */
  @property({ type: Number })
  max = 100;

  /** Unknown-progress presentation (reduced-motion-safe: static 33% fill). */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Optional polite narration of settled values (off by default). */
  @property({ type: Boolean, reflect: true })
  announce = false;

  /** Whether the `label` slot carries REAL content (element or non-empty text). */
  #labelSlotted = false;

  /** Whether the `value` slot carries REAL content (element or non-empty text). */
  #valueSlotted = false;

  /** Whether the `empty` slot carries projected content (suppresses the default copy). */
  #emptySlotted = false;

  /** Last percent ever written to the live region — the no-change skip. */
  #lastAnnouncedPercent: number | null = null;

  /** Pending rAF settle window handle — the burst coalescer. */
  #announceFrame: number | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-progress-bar-${++TkProgressBar.#nextId}`;
    return this.#uniqueId;
  }

  /** Display-side min: non-finite reads as the 0 default. */
  get #effectiveMin(): number {
    return Number.isFinite(this.min) ? this.min : 0;
  }

  /** Display-side max: non-finite reads as the 100 default. */
  get #effectiveMax(): number {
    return Number.isFinite(this.max) ? this.max : 100;
  }

  /** Degenerate range (min > max, or the empty range min === max): no meaningful fraction exists. */
  get #isDegenerate(): boolean {
    return !(this.#effectiveMax > this.#effectiveMin);
  }

  /** The value in force: clamped into [min, max]; absent/NaN reads as min. The PROP is never touched. */
  get #effectiveValue(): number {
    const min = this.#effectiveMin;
    const max = this.#effectiveMax;
    if (this.indeterminate || this.#isDegenerate) return min;
    const raw = typeof this.value === 'number' ? this.value : Number(this.value);
    const numeric = Number.isFinite(raw) ? raw : min;
    return Math.min(max, Math.max(min, numeric));
  }

  /** Rounded integer percent (0–100) — the single source for width, the «N%» fallback and the narration. */
  get #percent(): number {
    if (this.#isDegenerate) return 0;
    const ratio =
      (this.#effectiveValue - this.#effectiveMin) / (this.#effectiveMax - this.#effectiveMin);
    return Math.round(ratio * 100);
  }

  /** Whether the label cell has content: real slotted content or a non-blank `label` prop. */
  get #hasLabelContent(): boolean {
    return this.#labelSlotted || (this.label ?? '').trim().length > 0;
  }

  /**
   * The zero-state trigger (the exact rule, noted per the spec): determinate
   * AND the CLAMPED value === min EXACTLY (the frozen «value === min» letter
   * — a value of 0.4 over 0–100 is real progress and shows the bare bar even
   * though its percent ROUNDS to 0) AND no label content AND no real `value`
   * slot content. Indeterminate is excluded — unknown is not «nothing yet».
   */
  get #isEmptyState(): boolean {
    return (
      !this.indeterminate &&
      this.#effectiveValue === this.#effectiveMin &&
      !this.#hasLabelContent &&
      !this.#valueSlotted
    );
  }

  /**
   * Slot presence (the badge-slot rule, checkbox's label mirror): REAL
   * content (an element or non-empty text) counts; empty text nodes — the
   * `${cond ? html`…` : ''}` template shape — do NOT. Checked at
   * firstUpdated and on every slotchange of any named slot. A flag change
   * requests the update itself: the fallback texts and the empty-state
   * trigger all key on these flags, so presence arriving or leaving later
   * must re-render (the header's three cells stay in the DOM — hidden, never
   * absent — precisely so their slots exist for slotchange to fire in every
   * state; a conditionally-absent slot could never report content arriving).
   */
  #syncSlotPresence(event?: Event): void {
    const slot = event?.target as HTMLSlotElement | undefined;
    const targets =
      slot === undefined
        ? (this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot[name]') ?? [])
        : [slot];
    let changed = false;
    for (const target of targets) {
      const has = (target.assignedNodes({ flatten: true }) ?? []).some(
        (node: Node) =>
          node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim().length > 0,
      );
      if (target.name === 'label' && has !== this.#labelSlotted) {
        this.#labelSlotted = has;
        changed = true;
      } else if (target.name === 'value' && has !== this.#valueSlotted) {
        this.#valueSlotted = has;
        changed = true;
      } else if (target.name === 'empty' && has !== this.#emptySlotted) {
        this.#emptySlotted = has;
        changed = true;
      }
    }
    if (changed) this.requestUpdate();
  }

  override firstUpdated(): void {
    this.#syncSlotPresence();
  }

  #handleSlotChange(event: Event): void {
    this.#syncSlotPresence(event);
  }

  /**
   * Narration settle (the spec's Design Notes technique): one rAF window
   * coalesces bursts — the callback reads the percent AT FIRE TIME, so a
   * rapid run of updates narrates once, the settled value; the
   * last-announced tracker then skips no-change renders. Writing the region
   * text in `updated()` keeps the change AFTER the region exists in the DOM
   * — the aria-live contract for change-based announcements.
   */
  override updated(): void {
    this.#scheduleAnnouncement();
  }

  #scheduleAnnouncement(): void {
    if (!this.announce || this.indeterminate || this.#isDegenerate) {
      // The region is unmounted in exactly these states — invalidate the
      // tracker so a RE-MOUNTED region re-writes the current value instead
      // of staying permanently blank (the early-return below would
      // otherwise skip an unchanged value forever after a round trip).
      this.#lastAnnouncedPercent = null;
      return;
    }
    if (this.#announceFrame !== null) return; // a window is pending — it will read the latest value
    this.#announceFrame = requestAnimationFrame(() => {
      this.#announceFrame = null;
      if (!this.isConnected) return;
      const percent = this.#percent;
      if (percent === this.#lastAnnouncedPercent) return;
      const region = this.renderRoot.querySelector('.announcement');
      if (!region) return; // unmounted since scheduling — tracker advances only on a real write
      this.#lastAnnouncedPercent = percent;
      region.textContent = announceText(percent);
    });
  }

  override disconnectedCallback(): void {
    // The single settle window dies with the element — no post-unmount rAF.
    if (this.#announceFrame !== null) {
      cancelAnimationFrame(this.#announceFrame);
      this.#announceFrame = null;
    }
    super.disconnectedCallback();
  }

  override render() {
    const determinate = !this.indeterminate;
    const degenerate = this.#isDegenerate;
    const percent = this.#percent;
    const empty = this.#isEmptyState;
    const hasLabelContent = this.#hasLabelContent;

    return html`
      <div class="header" ?hidden=${!(empty || hasLabelContent || this.#valueSlotted)}>
        <span class="header__empty" id="${this.#id}-empty" ?hidden=${!empty}
          >${empty && !this.#emptySlotted ? DEFAULT_EMPTY_COPY : nothing}<slot
            name="empty"
            @slotchange=${this.#handleSlotChange}
          ></slot
        ></span>
        <span class="header__label" id="${this.#id}-label" ?hidden=${empty || !hasLabelContent}
          >${this.#labelSlotted ? nothing : this.label ?? nothing}<slot
            name="label"
            @slotchange=${this.#handleSlotChange}
          ></slot
        ></span>
        <span class="header__value" ?hidden=${empty}>
          ${determinate && !this.#valueSlotted ? html`${percent}%` : nothing}<slot
            name="value"
            @slotchange=${this.#handleSlotChange}
          ></slot>
        </span>
      </div>
      <div
        class="track"
        role="progressbar"
        aria-valuenow=${determinate && !degenerate ? this.#effectiveValue : nothing}
        aria-valuemin=${determinate && !degenerate ? this.#effectiveMin : nothing}
        aria-valuemax=${determinate && !degenerate ? this.#effectiveMax : nothing}
        aria-busy=${this.indeterminate ? 'true' : nothing}
        aria-labelledby=${empty
          ? `${this.#id}-empty`
          : hasLabelContent
            ? `${this.#id}-label`
            : nothing}
      >
        <div class="fill" style=${determinate ? `width: ${percent}%` : nothing}></div>
      </div>
      ${this.announce && determinate && !degenerate
        ? html`<span class="announcement" aria-live="polite"></span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-progress-bar': TkProgressBar;
  }
}

if (!customElements.get('tk-progress-bar')) {
  customElements.define('tk-progress-bar', TkProgressBar);
}
