import * as React from 'react';
import { createComponent } from '@lit/react';

import { EVENT_MAP } from './event-map.js';

/**
 * Kit wrapper runtime — ТЖ instance (AD-1 v5, story 16.1): the one piece of
 * runtime behavior this package owns.
 *
 * DELIBERATE DUPLICATION of the bank runtime (packages/react/src/
 * kit-component.ts, frozen at bank Story 2.1 — CONVENTIONS §9 «Frozen
 * React-surface API»): importing `pillkit-react` would be a forbidden
 * tj→bank edge (FR-17 — the families are runtime-disjoint), so the ТЖ
 * family carries its own copy of the SAME frozen contract, exactly like the
 * AD-12 drawer-helper ruling duplicates the bank overlay controller's
 * contract. The unwrap semantics below are identical and frozen; a change
 * here is a §9 exception-log entry, never a silent fork.
 *
 * `@lit/react`'s `events` option attaches the consumer's handler directly to
 * the native event — the handler would receive the raw `CustomEvent`. The
 * frozen contract instead says React handlers receive the UNWRAPPED `value`
 * (every kit event carries `detail: { value }`, the inherited §3 grammar).
 * This module generates the `@lit/react` wrapper exactly as before (same
 * property/attribute handling, same event wiring) and layers a thin
 * forwardRef HOC that unwraps the payload before calling the consumer's
 * handler:
 *
 * - event with `detail` containing a `value` key → handler receives
 *   `detail.value` (string, boolean, object — the unwrapped new value);
 * - payload-less kit events → the handler receives the event itself (there
 *   is nothing to unwrap).
 *
 * The unwrap runtime must exist even while the ТЖ event registry is EMPTY
 * (16.1): the GENERATED wrappers import it — the machinery ships whole, the
 * first stateful story appends events and nothing else changes.
 *
 * No component behavior, styling, or a11y logic lives here (AD-1) — and no
 * value-clamping either: controlled-mode strictness is owned by the elements
 * (§4).
 */

/** The shape every kit custom event payload uses where a payload exists (§3). */
interface TjKitEventDetail {
  value?: unknown;
}

/** Unwrap rule: `detail.value` when the payload carries one; the event otherwise. */
const unwrapKitEventPayload = (event: Event): unknown =>
  event !== null &&
  typeof event === 'object' &&
  'detail' in event &&
  event.detail !== null &&
  typeof event.detail === 'object' &&
  'value' in (event.detail as object)
    ? (event.detail as TjKitEventDetail).value
    : event;

/** Element-side props (Lit reactive properties) — kept typed through the HOC. */
type TjKitElementProps<Element extends HTMLElement> = Partial<Omit<Element, keyof HTMLElement>>;

interface CreateTjKitComponentOptions<Element extends HTMLElement> {
  displayName: string;
  tagName: string;
  elementClass: new () => Element;
  react: typeof React;
}

/**
 * Creates a ТЖ kit React wrapper: `@lit/react`'s createComponent with the
 * ТЖ-owned event registry applied, wrapped so mapped handler props receive
 * the unwrapped payload. Used by the GENERATED wrappers only
 * (scripts/generate.mjs → scripts/wrapper-gen/core.mjs) — hand-written code
 * never calls this.
 *
 * Prop typing: element properties stay typed off the element class; handler
 * props (and anything else @lit/react routes) stay open via the index
 * signature — their runtime semantics are the unwrapped-value contract above.
 */
export function createKitComponent<Element extends HTMLElement>(
  options: CreateTjKitComponentOptions<Element>,
) {
  const events = EVENT_MAP[options.tagName] ?? {};
  const Base = createComponent({
    ...options,
    events,
  });

  const Wrapped = React.forwardRef<Element, TjKitElementProps<Element> & Record<string, unknown>>(
    (props, ref) => {
      const elementProps: Record<string, unknown> = { ...props, ref };
      for (const reactPropName of Object.keys(events)) {
        const handler = props[reactPropName];
        if (typeof handler === 'function') {
          elementProps[reactPropName] = (event: Event) =>
            (handler as (payload: unknown) => void)(unwrapKitEventPayload(event));
        }
      }
      return React.createElement(
        Base as unknown as React.ComponentType<Record<string, unknown>>,
        elementProps,
      );
    },
  );
  Wrapped.displayName = options.displayName;
  return Wrapped;
}
