/**
 * Focus trap + restore primitive — the Story 1.2 review finding: Modal (E4)
 * and the Navbar drawer (E3) consume this, none implements its own.
 *
 * The primitive is the CYCLE + RESTORE: Tab/Shift-Tab wrap within the
 * container, initial focus is placed on entry, and focus returns to the
 * previously-focused element on release (LIFO under nesting — a drawer
 * trapped over a modal restores into the modal). Inert-style background
 * treatment is deliberately NOT here; Modal (4.1) decides that per §9.
 *
 * SHADOW-AWARE by necessity for a Lit kit: a component's own shadow-rendered
 * controls (Modal's close button) and slotted light-DOM content both count.
 * The focusable set is collected from the container's light DOM AND every
 * descendant open shadow root (recursively); containment is checked through
 * the composed tree (shadow-root boundaries are hopped via getRootNode().host).
 * Focus deep inside a nested shadow widget is therefore cycled in place, never
 * "pulled back" — the pull-back fires only when focus has left the container's
 * composed subtree. CLOSED shadow roots cannot be traversed from outside
 * (their content is invisible to the selector); a closed widget holding
 * internal focus is left alone rather than yanked.
 *
 * Semantics notes:
 * - Only the INNERMOST active trap cycles (a module-level trap stack), so a
 *   modal over a drawer never fights the drawer's listener. Already-consumed
 *   events are respected: a keydown with `defaultPrevented` (a consumer
 *   handler handled Tab) is never overridden.
 * - Tab from the container itself (a `tabindex="-1"` dialog container focused
 *   via `initialFocus`) wraps backward to the last focusable; forward Tab
 *   enters naturally.
 * - Zero focusables at trap time does NOT disable the trap: the listener is
 *   installed regardless (lazily-rendered modal content must trap once it
 *   arrives); only the initial-focus placement is skipped while empty. While
 *   empty, Tab is not intercepted (nothing to cycle into).
 * - Release restores only when the prior element is still connected; if the
 *   trigger was removed meanwhile, focus is left where the browser put it.
 * - Visibility filtering is selector-level only (accepted limitation,
 *   documented in the module header): no layout probing — an element that
 *   matches the focusable selector but is visually hidden still counts
 *   unless the consumer hides or removes it.
 * - SSR-safe: without a `document` the trap is an inert no-op handle.
 */

/** Where focus lands when the trap engages. */
export type TkInitialFocusTarget = HTMLElement | 'first';

export interface TkFocusTrapOptions {
  /**
   * Initial focus placement: `'first'` (default) focuses the first focusable
   * child; an explicit element (inside or outside the focusable set — e.g. a
   * `tabindex="-1"` dialog container) is focused as given. Placement is
   * skipped while the container has zero focusables (lazy content) — the
   * trap itself is already armed.
   */
  initialFocus?: TkInitialFocusTarget;
}

/** Focus-trap release handle — restores the prior focus target. Idempotent. */
export interface TkFocusTrapHandle {
  /** Removes the trap and restores focus to the pre-trap target. */
  release(): void;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface ActiveTrap {
  container: HTMLElement;
  onKeydown: (event: KeyboardEvent) => void;
}

/** LIFO trap stack — only the top of the stack cycles. */
const activeTraps: ActiveTrap[] = [];

/**
 * Collects focusables from a root's light DOM, recursing into EVERY
 * descendant open shadow root — including plain (non-focusable) hosts, whose
 * shadow content is just as tabbable. Shadow content follows its host in the
 * collected order — an approximation of composed order; exact slot order is
 * unknowable statically.
 */
function collectFocusables(root: ParentNode): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const element of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (element.matches(FOCUSABLE_SELECTOR)) found.push(element);
    if (element.shadowRoot) found.push(...collectFocusables(element.shadowRoot));
  }
  return found;
}

/** The container's focusable set: its light DOM plus its OWN shadow root. */
function focusablesOf(container: HTMLElement): HTMLElement[] {
  const found = collectFocusables(container);
  if (container.shadowRoot) found.push(...collectFocusables(container.shadowRoot));
  return found;
}

/** The deepest focused element, piercing open shadow roots via activeElement chains. */
function deepActiveElement(): HTMLElement | null {
  let node: HTMLElement | null =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  while (node !== null && node.shadowRoot && node.shadowRoot.activeElement) {
    node =
      node.shadowRoot.activeElement instanceof HTMLElement
        ? node.shadowRoot.activeElement
        : null;
  }
  return node;
}

/** Composed-tree containment: walks up through parentElement + shadow-root hosts. */
function composedContains(ancestor: Node, node: Node | null): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === ancestor) return true;
    const parent: ParentNode | null = current.parentElement;
    if (parent) {
      current = parent;
      continue;
    }
    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }
  return false;
}

/**
 * Traps Tab navigation inside `container` (light DOM and open shadow roots)
 * and remembers the pre-trap focus.
 */
export function trapFocus(
  container: HTMLElement,
  options: TkFocusTrapOptions = {},
): TkFocusTrapHandle {
  if (typeof document === 'undefined') {
    return { release: () => undefined };
  }

  const trap: ActiveTrap = {
    container,
    onKeydown: (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;
      if (event.defaultPrevented) return; // a consumer already handled this Tab
      // Nested traps: only the innermost cycles.
      if (activeTraps[activeTraps.length - 1] !== trap) return;
      const items = focusablesOf(container);
      if (items.length === 0) return;
      const first = items[0] as HTMLElement;
      const last = items[items.length - 1] as HTMLElement;
      const active = deepActiveElement();
      const inside = active !== null && composedContains(container, active);
      if (!inside) {
        // Focus escaped the composed subtree — pull it back to the end the
        // pressed direction wraps to. Focus inside a nested shadow widget is
        // `inside` (and traversed), so it is never yanked out.
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
  };

  container.addEventListener('keydown', trap.onKeydown);
  activeTraps.push(trap);

  // Initial focus placement — skipped while empty (lazy content traps later).
  const prior =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const explicit =
    options.initialFocus !== undefined && options.initialFocus !== 'first'
      ? options.initialFocus
      : undefined;
  const target = explicit ?? focusablesOf(container)[0];
  target?.focus();

  let released = false;
  return {
    release: (): void => {
      if (released) return;
      released = true;
      container.removeEventListener('keydown', trap.onKeydown);
      const index = activeTraps.indexOf(trap);
      if (index !== -1) activeTraps.splice(index, 1);
      if (prior && prior.isConnected) prior.focus();
    },
  };
}
