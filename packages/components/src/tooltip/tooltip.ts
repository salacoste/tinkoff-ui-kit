import { LitElement, html, render } from 'lit';
import { property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

import { mountOverlay, positionFloating } from '../overlays/index.js';
import type { TkOverlayHandle, TkPlacement, TkPositioningHandle } from '../overlays/index.js';
import { tooltipStyles, tooltipSurfaceStyles } from './tooltip.css.js';

/** Payload of `open-change` (CONVENTIONS §9 frozen overlay contract). */
export interface TkTooltipOpenChangeDetail {
  value: boolean;
}

/** Typed shape of the tk-tooltip `open-change` event (CONVENTIONS §7). */
export type TkTooltipOpenChangeEvent = CustomEvent<TkTooltipOpenChangeDetail>;

/** The placement union — same shape as the controller's TkPlacement. */
export type TkTooltipPlacement = TkPlacement;

/**
 * Show delay after pointerenter/focusin — a JS timing constant documented
 * from EXPERIENCE.md («Hover + focus show (delay 300ms)»): a DELAY, not a
 * motion value — the token layer cannot feed JS timers (the select
 * typeahead's TK_SELECT_TYPEAHEAD_RESET_MS precedent).
 */
export const TK_TOOLTIP_DELAY_MS = 300;

/** Gap between the trigger's box and the pill (px) — the 8 spacing step. */
const TOOLTIP_OFFSET_PX = 8;

/** Triggers already dev-warned about a missing accessible name (once each). */
const unnamedWarned = new WeakSet<Element>();

/**
 * tk-tooltip — the derived info pill (Story 4.2), positioned by the 2.2
 * controller (mountOverlay 'tooltip' layer + positionFloating with the
 * controller's all-four-edge flip; zero bespoke positioning/z code — pinned
 * structurally by the unit suite).
 *
 * OPEN CHANNEL — the tk-select mold verbatim (the frozen §9 overlay-surface
 * state): `open` attribute/property (reflects) + `open-change`
 * `detail: { value: boolean }` composed/bubbles, flip-only post-mount (the
 * 2.3 first-update guard — no mount-time open-change(false)).
 *
 * CONTENT IS PROP-ONLY BY DESIGN: the pill text is the `content` prop — the
 * surface is non-focusable BY CONSTRUCTION (nothing slot-projects into it,
 * so no consumer can ever put a control there), and the surface itself is
 * role="tooltip" with no tabindex, never in the tab order.
 *
 * TRIGGER: the default slot (a single element — more than one dev-warns).
 * The component wires aria-describedby from the slotted trigger to the
 * surface's id (the APG pattern: the description is announced on focus,
 * polite by nature) — set while the trigger is assigned, restored to the
 * trigger's prior value on unwire/disconnect. The surface is created EAGERLY
 * (firstUpdated) so the idref resolves from the first paint — the select
 * aria-controls precedent (axe validates idrefs even while the target is
 * hidden).
 *
 * BEHAVIOR (EXPERIENCE row): open on pointerenter AND focusin after
 * TK_TOOLTIP_DELAY_MS; close on pointerleave / focusout / Esc — immediate,
 * cancelling any pending timer; click/tap TOGGLES (touch parity — hover is
 * never the only path).
 *
 * ICON-ONLY TRIGGER GUARD (warn, never block): opening for a trigger with
 * no accessible-name heuristic (no text, no aria-label/labelledby/title)
 * dev-warns once — the story demonstrates the correct recipe.
 *
 * SSR-compat (AD-10): no imperative DOM at construction; the surface is
 * generated on first update, client-side.
 *
 * @tag tk-tooltip
 * @attr {boolean} open - Tooltip open state (frozen §9 overlay contract); reflects, flips via interaction too.
 * @attr {string} content - Tooltip text (prop-only by design — the surface is non-focusable by construction).
 * @attr {'top'|'bottom'|'left'|'right'} placement - Requested side; the controller flips near viewport edges. Invalid values clamp to 'top'. Default 'top'.
 * @slot - The TRIGGER (a single element); aria-describedby is wired from it to the pill.
 * @fires open-change - `{ value: boolean }` — the frozen §9 overlay-surface state event; composed, bubbles.
 */
export class TkTooltip extends LitElement {
  static override readonly styles = [tooltipStyles];

  /** Requested side — invalid values clamp to 'top' (CONVENTIONS §2). */
  @property({ type: String, reflect: true })
  placement: TkTooltipPlacement = 'top';

  /** Tooltip text — prop-only by design (see the class doc). */
  @property({ type: String })
  content = '';

  /** Open state — the frozen §9 overlay-surface property (reflects; `open-change` fires on every flip). */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** The generated pill surface, hidden while closed. */
  #surface: HTMLDivElement | null = null;

  #overlayHandle: TkOverlayHandle | null = null;
  #positionHandle: TkPositioningHandle | null = null;

  /** The pending 300ms show timer (cancelled by every close signal). */
  #showTimer: number | null = null;

  /** The currently-wired trigger and its prior aria-describedby value. */
  #trigger: HTMLElement | null = null;
  #priorDescribedBy: string | null = null;

  #uniqueId?: string;
  static #nextId = 0;

  get #id(): string {
    this.#uniqueId ??= `tk-tooltip-${++TkTooltip.#nextId}`;
    return this.#uniqueId;
  }

  // --- trigger wiring -----------------------------------------------------------

  /**
   * The default slot IS the trigger. Slots see only the host's light DOM —
   * these listeners live on the HOST, where events from the slotted trigger
   * (light DOM) and from the surface's tree both arrive (composed).
   */
  readonly #handleSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    this.#warnIfMultiple(assigned);
    const next = (assigned[0] as HTMLElement | undefined) ?? null;
    if (next === this.#trigger) return;
    this.#unwireTrigger();
    this.#trigger = next;
    if (next) {
      this.#priorDescribedBy = next.getAttribute('aria-describedby');
      next.setAttribute('aria-describedby', `${this.#id}-tooltip`);
    }
  };

  #unwireTrigger(): void {
    const trigger = this.#trigger;
    if (!trigger) return;
    // Restore the consumer's own wiring (an empty prior value removes ours).
    if (this.#priorDescribedBy === null) trigger.removeAttribute('aria-describedby');
    else trigger.setAttribute('aria-describedby', this.#priorDescribedBy);
    this.#trigger = null;
    this.#priorDescribedBy = null;
  }

  /**
   * The wired trigger — or the live slot's first assigned element when
   * slotchange has not fired yet (a declarative `open` at first paint races
   * the slotchange microtask; the mount must not be refused for it).
   */
  #resolveTrigger(): HTMLElement | null {
    if (this.#trigger) return this.#trigger;
    const assigned = this.renderRoot.querySelector('slot')?.assignedElements({ flatten: true }) ?? [];
    this.#warnIfMultiple(assigned);
    const first = (assigned[0] as HTMLElement | undefined) ?? null;
    if (first) {
      this.#priorDescribedBy = first.getAttribute('aria-describedby');
      first.setAttribute('aria-describedby', `${this.#id}-tooltip`);
      this.#trigger = first;
    }
    return first;
  }

  #warnIfMultiple(assigned: Element[]): void {
    if (assigned.length > 1) {
      console.warn(
        'tk-tooltip: more than one slotted element — the first is the trigger, the rest are ignored',
      );
    }
  }

  // --- timers ---------------------------------------------------------------------

  #clearShowTimer(): void {
    if (this.#showTimer === null) return;
    window.clearTimeout(this.#showTimer);
    this.#showTimer = null;
  }

  #scheduleOpen(): void {
    if (this.open || this.#showTimer !== null) return;
    this.#warnIfUnnamedTrigger(this.#resolveTrigger());
    this.#showTimer = window.setTimeout(() => {
      this.#showTimer = null;
      this.#setOpen(true);
    }, TK_TOOLTIP_DELAY_MS);
  }

  /** Warn-once heuristic for icon-only triggers with no accessible name (never blocks). */
  #warnIfUnnamedTrigger(trigger: HTMLElement | null): void {
    if (!trigger || unnamedWarned.has(trigger)) return;
    const named =
      (trigger.textContent ?? '').trim().length > 0 ||
      trigger.hasAttribute('aria-label') ||
      trigger.hasAttribute('aria-labelledby') ||
      trigger.hasAttribute('title');
    if (!named) {
      unnamedWarned.add(trigger);
      console.warn(
        'tk-tooltip: the slotted trigger exposes no accessible name — icon-only triggers need aria-label (or aria-labelledby/title); see the Icon trigger story for the recipe',
      );
    }
  }

  #setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next; // mount/unmount + the open-change dispatch ride updated()
  }

  // --- interaction handlers (host-level — the trigger is slotted light DOM) ------

  readonly #handlePointerOver = (): void => {
    this.#scheduleOpen();
  };

  readonly #handlePointerOut = (event: PointerEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.#clearShowTimer();
    if (this.open) this.#setOpen(false);
  };

  readonly #handleFocusIn = (): void => {
    this.#scheduleOpen();
  };

  readonly #handleFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.#clearShowTimer();
    if (this.open) this.#setOpen(false);
  };

  /** Touch parity: click/tap toggles (hover is never the only path). */
  readonly #handleClick = (): void => {
    this.#clearShowTimer();
    this.#setOpen(!this.open);
  };

  readonly #handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if (!this.open && this.#showTimer === null) return;
    event.preventDefault();
    this.#clearShowTimer();
    this.#setOpen(false);
  };

  // --- lifecycle -------------------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('pointerover', this.#handlePointerOver);
    this.addEventListener('pointerout', this.#handlePointerOut);
    this.addEventListener('focusin', this.#handleFocusIn);
    this.addEventListener('focusout', this.#handleFocusOut);
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('keydown', this.#handleKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('pointerover', this.#handlePointerOver);
    this.removeEventListener('pointerout', this.#handlePointerOut);
    this.removeEventListener('focusin', this.#handleFocusIn);
    this.removeEventListener('focusout', this.#handleFocusOut);
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('keydown', this.#handleKeydown);
    // Quiet teardown (the select mold): no dispatch, no leaked mount.
    this.#clearShowTimer();
    this.#unwireTrigger();
    if (this.open) this.open = false;
    this.#unmountSurface();
  }

  /**
   * Enum clamp (CONVENTIONS §2): an invalid placement degrades to 'top',
   * correcting the reflected attribute — never throws.
   */
  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('placement')) {
      if (this.placement !== 'top' && this.placement !== 'bottom' && this.placement !== 'left' && this.placement !== 'right') {
        this.placement = 'top';
      }
    }
  }

  override firstUpdated(): void {
    // Eager surface creation: the trigger's aria-describedby references a
    // REAL node from the first paint (axe validates the idref while hidden —
    // the select aria-controls precedent). The trigger wires eagerly too —
    // slotchange is async and a declarative open would race it.
    this.#getSurface();
    this.#resolveTrigger();
  }

  /**
   * Surface lifecycle rides the `open` property (attribute-driven opens
   * included): mount on true, unmount on false. `content`/`placement` changes
   * while open re-render / re-position. The dispatch is flip-only and
   * POST-mount (the select mold — Lit's first-update change map never
   * produces a spurious open-change(false)).
   */
  override updated(changed: PropertyValues<this>): void {
    if (changed.has('content') && this.#surface) {
      this.#renderSurface();
    }
    if (changed.has('open')) {
      if (this.open) this.#mountSurface();
      else this.#unmountSurface();
      const wasOpen = changed.get('open');
      if (this.isConnected && wasOpen !== undefined && wasOpen !== this.open) {
        this.dispatchEvent(
          new CustomEvent<TkTooltipOpenChangeDetail>('open-change', {
            detail: { value: this.open },
            composed: true,
            bubbles: true,
          }),
        );
      }
      return;
    }
    if (changed.has('placement') && this.open) {
      // Placement is captured in positionFloating's options — re-position.
      this.#positionHandle?.release();
      this.#positionHandle = null;
      this.#position();
    }
  }

  // --- surface (generated shadow-tree child, controller-mounted) ----------------

  /** The generated pill surface: role=tooltip, own shadow root (styles + text), hidden until open. */
  #getSurface(): HTMLDivElement {
    if (this.#surface) return this.#surface;
    const surface = document.createElement('div');
    surface.setAttribute('role', 'tooltip');
    surface.id = `${this.#id}-tooltip`;
    surface.hidden = true;
    surface.attachShadow({ mode: 'open' }); // content rendered by #renderSurface
    this.renderRoot.appendChild(surface);
    this.#surface = surface;
    this.#renderSurface();
    return surface;
  }

  /** (Re)renders the surface's shadow content — the content prop is live while open. */
  #renderSurface(): void {
    const surface = this.#getSurface();
    const shadow = surface.shadowRoot;
    if (!shadow) return;
    render(
      html`<style>${tooltipSurfaceStyles.cssText}</style>${this.content ?? ''}`,
      shadow,
    );
  }

  #mountSurface(): void {
    const trigger = this.#resolveTrigger();
    if (!trigger) {
      // Nothing to anchor to (empty slot): a floating pill at the tree's edge
      // would be meaningless — refuse the mount, dev-warn.
      console.warn('tk-tooltip: no slotted trigger to anchor to — open ignored');
      return;
    }
    const surface = this.#getSurface();
    this.#renderSurface();
    surface.hidden = false;
    this.#overlayHandle = mountOverlay(surface, 'tooltip');
    this.#position();
  }

  #position(): void {
    const trigger = this.#resolveTrigger();
    if (!trigger || !this.#surface) return;
    this.#positionHandle = positionFloating(this.#surface, {
      anchor: trigger,
      placement: this.placement,
      offset: TOOLTIP_OFFSET_PX,
    });
  }

  #unmountSurface(): void {
    this.#positionHandle?.release();
    this.#positionHandle = null;
    this.#overlayHandle?.release();
    this.#overlayHandle = null;
    const surface = this.#surface;
    if (surface) {
      // Re-home into the shadow tree (the container fallback detaches it).
      if (!surface.isConnected) this.renderRoot.appendChild(surface);
      surface.hidden = true;
    }
  }

  // --- render -----------------------------------------------------------------

  override render() {
    // The host template carries only the trigger slot; the surface is
    // generated (see #getSurface) — eager, so the aria-describedby idref is
    // valid from the first paint.
    return html`<slot @slotchange=${this.#handleSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-tooltip': TkTooltip;
  }
}

if (!customElements.get('tk-tooltip')) {
  customElements.define('tk-tooltip', TkTooltip);
}
