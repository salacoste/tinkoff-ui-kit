import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import '../badge/badge.js';
import { tabsStyles } from './tabs.css.js';

/**
 * One tab of the `tabs` prop — the 2.3 data shape plus the optional count the
 * reference switcher carries no badges but tk-badge exists now (the spec's
 * noted pick): a finite `badge` number renders a nested tk-badge in the tab.
 */
export interface TkTab {
  /** Stable tab value (what `value` / `value-change` carry). */
  value: string;
  /** Visible tab text (also the tab's accessible name, with the badge count). */
  label: string;
  /** Tab present but unselectable, skipped by arrows and not focusable. */
  disabled?: boolean;
  /** Optional count chip: a finite number renders a tk-badge (cap «99+»). */
  badge?: number;
}

/** Payload of `value-change` (CONVENTIONS §3): the unwrapped new string. */
export interface TkTabsChangeDetail {
  value: string;
}

/** Typed shape of the tk-tabs `value-change` event (CONVENTIONS §7). */
export type TkTabsChangeEvent = CustomEvent<TkTabsChangeDetail>;

/**
 * tk-tabs — the reference's debit/credit/deposit section switcher (Story 3.3):
 * text tabs with the active tab as a white pill + default shadow inside an
 * invisible track, full tab semantics, AUTOMATIC activation (moving focus
 * selects — the reference behavior).
 *
 * STATEFUL API — the §4 contract frozen at 2.1 (Input PR), inherited verbatim
 * with a string channel (tk-select/tk-segmented-radio's exact mirror):
 * `value` strict-controlled (renders exactly `value`; selecting emits
 * `value-change` and applies nothing locally — unlike the segmented radio
 * there is no inner native value control to keep a live window for, so the
 * unanswered selection changes nothing until the consumer answers and the
 * element re-renders exactly `value`; focus DOES follow the keypress, focus
 * is not the value channel), `defaultValue` seeds uncontrolled (later
 * changes ignored), releasing `value` goes uncontrolled seeded from the last
 * controlled value. `activeIndex` is a DERIVED read-only parity view (the
 * index of the tab the value in force resolves to; -1 when none) — the event
 * detail stays frozen-uniform `{ value }`, the index is derivable, not
 * channel state.
 *
 * SELECTION RESOLUTION (the spec's matrix picks): the tab matching the value
 * in force is active; when the value matches nothing (unset default, unknown
 * controlled value) the FIRST ENABLED tab carries the active state (the
 * clamp — the reference always shows an active switcher); when every tab is
 * disabled NO tab is selected and the arrows are inert (none + inert pick).
 * A value matching a DISABLED tab (degenerate consumer data) degrades the
 * same way — a disabled tab never carries the active state.
 *
 * PANELS (the spec's noted pattern): content projects through per-INDEX
 * named slots `tab-0`, `tab-1`, … — slot names must be static per render, so
 * the index (not the value) names them. Consumer recipe:
 * `<tk-tabs .tabs=${TABS}><div slot="tab-0">…</div><div slot="tab-1">…</div></tk-tabs>`.
 * Every panel is a DISTINCT element whose `hidden` toggles with activation:
 * inactive panels leave the tab order and the a11y tree (Tab moves from the
 * active tab into the ACTIVE panel's content, then out; an empty panel lets
 * focus pass through), and a panel going display:none → block RESTARTS its
 * CSS swap animation — the re-trigger technique (tabs.css.ts; no keyed
 * re-render, no imperative class juggling). The swap animates CONTENT ONLY:
 * the track and tab bar carry no animation (unit-pinned structurally).
 *
 * KEYBOARD (EXPERIENCE Tabs row + Interaction Primitives): tablist/tab/
 * tabpanel roles, aria-selected, aria-controls/aria-labelledby id wiring;
 * arrows CYCLE (Left/Up prev, Right/Down next, WRAPPING — the noted pick)
 * and SKIP disabled tabs with AUTOMATIC activation; Home/End jump to the
 * first/last ENABLED tab (selecting too); Tab is never intercepted (roving
 * tabindex: active tab 0, others −1); disabled tabs are native button
 * disabled — skipped by arrows, not focusable (the spec's pick).
 *
 * BADGES compose, not re-implement: a finite `badge` instantiates a nested
 * `<tk-badge>` (light-DOM child of the tab button inside THIS shadow root —
 * nested custom elements compose fine; the spec's Code Map decision). The
 * count joins the tab's accessible name; the «99+» cap is tk-badge's own.
 *
 * SSR-compat (AD-10): rendered via Lit templates only; no imperative DOM at
 * construction.
 *
 * @tag tk-tabs
 * @attr {string} default-value - Initial value for the uncontrolled mode; ignored after the first update.
 * @fires value-change - `{ value: string }` with the unwrapped newly active tab value; composed, bubbles.
 * @slot tab-{index} - Panel content for tab N (tab-0, tab-1, …); the active tab's panel is visible.
 */
export class TkTabs extends LitElement {
  static override readonly styles = [tabsStyles];

  /**
   * Controlled value channel — STRICT semantics (frozen at 2.1, string
   * mirror of tk-select): the element renders exactly this (the matching
   * tab carries the active state). Property-only (`attribute: false`);
   * non-strings set via JS clamp to their string form; null/undefined after
   * control RELEASES to uncontrolled seeded from the last controlled value.
   */
  @property({ type: String, attribute: false })
  value?: string;

  /** Initial value for the UNCONTROLLED mode; ignored after the first update. */
  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  /** The v1 data shape — array of { value, label, disabled?, badge? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  tabs: TkTab[] = [];

  /** Live uncontrolled state (the truth whenever `value` is not provided). */
  #uncontrolledValue = '';

  /** Last string ever provided through the controlled channel — the seed on release. */
  #lastControlledValue: string | undefined;

  /** Whether the controlled channel has ever supplied a value. */
  #isControlled = false;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-tabs-${++TkTabs.#nextId}`;
    return this.#uniqueId;
  }

  /** Tabs with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveTabs(): TkTab[] {
    return this.tabs ?? [];
  }

  /** The value in force: exactly `value` when controlled, the internal state otherwise. */
  get #effectiveValue(): string {
    return this.#isControlled ? (this.value ?? '') : this.#uncontrolledValue;
  }

  /**
   * DERIVED parity view (read-only, no attribute, no event): the index of
   * the tab the value in force resolves to — the matching ENABLED tab, else
   * the first enabled tab (the clamp), else -1 (none — every tab disabled).
   */
  get activeIndex(): number {
    const tabs = this.#effectiveTabs;
    if (tabs.length === 0) return -1;
    const matched = tabs.findIndex((tab) => tab.value === this.#effectiveValue);
    if (matched >= 0 && !tabs[matched]?.disabled) return matched;
    return tabs.findIndex((tab) => !tab.disabled);
  }

  /**
   * The frozen §4 state transitions (tk-select's verbatim string mirror) +
   * the 2.3 tabs clamp: duplicate tab VALUES drop with a dev warn (first
   * occurrence wins), nullish/empty-value entries drop with them — the
   * empty string could never be addressed by `value`/`defaultValue`.
   * CONVENTIONS §2 degrade-to-default spirit; the reassignment is
   * length-guarded so the follow-up update converges.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') && !this.hasUpdated) {
      this.#uncontrolledValue = this.defaultValue ?? '';
    }
    if (changed.has('value')) {
      if (this.value != null && typeof this.value !== 'string') {
        this.value = String(this.value);
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (typeof this.value === 'string') {
        this.#isControlled = true;
        this.#lastControlledValue = this.value;
      } else if (this.#isControlled) {
        this.#isControlled = false;
        this.#uncontrolledValue = this.#lastControlledValue ?? '';
      }
    }
    if (changed.has('tabs')) {
      const seen = new Set<string>();
      const deduped = (this.tabs ?? []).filter((tab) => {
        const value = tab?.value;
        if (value == null || value === '' || seen.has(value)) return false;
        seen.add(value);
        return true;
      });
      if (this.tabs != null && deduped.length !== this.tabs.length) {
        console.warn(
          'tk-tabs: duplicate or value-less tab entries dropped — tab values must be unique non-empty strings (first occurrence wins)',
        );
        this.tabs = deduped;
      }
    }
  }

  /** `detail: { value }` with the unwrapped string; composed + bubbles (CONVENTIONS §3). */
  #emitValueChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent<TkTabsChangeDetail>('value-change', {
        detail: { value },
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * The selection pipeline (arrows, Home/End and click all arrive here):
   * uncontrolled commits the internal state and re-renders; both modes emit.
   * Controlled applies nothing locally — the element keeps rendering exactly
   * `value` until the consumer answers (the frozen strict contract).
   */
  #commit(value: string): void {
    if (!this.#isControlled) {
      this.#uncontrolledValue = value;
      this.requestUpdate();
    }
    this.#emitValueChange(value);
  }

  /** Activates tab `index`: disabled tabs never activate; the active tab re-selects as a no-op. */
  #selectIndex(index: number): void {
    const tab = this.#effectiveTabs[index];
    if (!tab || tab.disabled) return;
    if (index === this.activeIndex) return;
    this.#commit(tab.value);
  }

  #tabButtons(): HTMLButtonElement[] {
    return [...(this.renderRoot.querySelectorAll<HTMLButtonElement>('.tab') ?? [])];
  }

  /** Next/previous ENABLED tab from `from`, WRAPPING (the noted pick). Null when none exists. */
  #stepEnabled(from: number, direction: 1 | -1): number | null {
    const tabs = this.#effectiveTabs;
    if (tabs.length === 0) return null;
    let index = from;
    for (let step = 0; step < tabs.length; step += 1) {
      index = (index + direction + tabs.length) % tabs.length;
      if (!tabs[index]?.disabled) return index;
    }
    return null;
  }

  /** First/last ENABLED tab (Home/End targets). Null when none exists. */
  #edgeEnabled(edge: 'first' | 'last'): number | null {
    const tabs = this.#effectiveTabs;
    const scan = edge === 'first' ? tabs : [...tabs].reverse();
    const offset = scan.findIndex((tab) => !tab.disabled);
    return offset >= 0 ? (edge === 'first' ? offset : tabs.length - 1 - offset) : null;
  }

  /** AUTOMATIC ACTIVATION: focus moves to `index` and selection follows (the reference behavior). */
  #moveTo(index: number): void {
    this.#tabButtons()[index]?.focus();
    this.#selectIndex(index);
  }

  /**
   * Keyboard matrix (EXPERIENCE Tabs row): arrows cycle (Left/Up previous,
   * Right/Down next, WRAPPING, disabled SKIPPED — automatic activation);
   * Home/End jump to the first/last ENABLED tab. Every HANDLED key is
   * preventDefaulted (the element owns these keys in every engine — UA
   * scroll on arrows/Home/End must never run); a single-tab list leaves its
   * arrows inert (the wrap target is the tab itself — nothing emits), and an
   * all-disabled list has no focusable button to key in the first place.
   * Tab/Shift-Tab pass through untouched (roving tabindex carries them).
   */
  #handleKeydown(event: KeyboardEvent, from: number): void {
    const key = event.key;
    const isArrow =
      key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowDown';
    if (!isArrow && key !== 'Home' && key !== 'End') return;

    event.preventDefault();

    if (isArrow) {
      const direction: 1 | -1 = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
      const next = this.#stepEnabled(from, direction);
      if (next === null || next === from) return; // single enabled tab: inert
      this.#moveTo(next);
      return;
    }

    const edge = this.#edgeEnabled(key === 'Home' ? 'first' : 'last');
    if (edge === null || edge === from) return;
    this.#moveTo(edge);
  }

  /** A finite number renders the count chip (absent/NaN → no badge — the badge's own absent rule). */
  #badgeCount(tab: TkTab): number | null {
    return typeof tab.badge === 'number' && Number.isFinite(tab.badge) ? tab.badge : null;
  }

  override render() {
    const tabs = this.#effectiveTabs;
    const active = this.activeIndex;

    return html`
      <div class="track" role="tablist">
        ${tabs.map((tab, index) => {
          const isActive = index === active;
          const badge = this.#badgeCount(tab);
          return html`
            <button
              type="button"
              role="tab"
              class="tab"
              id="${this.#id}-tab-${index}"
              ?disabled=${tab.disabled === true}
              aria-selected=${isActive ? 'true' : 'false'}
              aria-controls="${this.#id}-panel-${index}"
              tabindex=${isActive ? '0' : '-1'}
              @click=${() => this.#selectIndex(index)}
              @keydown=${(event: KeyboardEvent) => this.#handleKeydown(event, index)}
            >
              <span class="tab__label">${tab.label}</span>
              ${badge !== null ? html`<tk-badge count=${badge}></tk-badge>` : nothing}
            </button>
          `;
        })}
      </div>
      ${tabs.map((tab, index) => {
        const isActive = index === active;
        return html`
          <div
            class="panel"
            role="tabpanel"
            id="${this.#id}-panel-${index}"
            aria-labelledby="${this.#id}-tab-${index}"
            ?hidden=${!isActive}
          >
            <slot name="tab-${index}"></slot>
          </div>
        `;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-tabs': TkTabs;
  }
}

if (!customElements.get('tk-tabs')) {
  customElements.define('tk-tabs', TkTabs);
}
