import * as React from 'react';
import { createComponent } from '@lit/react';

import { EVENT_MAP } from './event-map.js';

/**
 * Kit wrapper runtime (AD-1, frozen at Story 2.1 — see CONVENTIONS §9
 * «Frozen React-surface API»): the one piece of behavior this package owns.
 *
 * `@lit/react`'s `events` option attaches the consumer's handler directly to
 * the native event — the handler would receive the raw `CustomEvent`. The
 * frozen contract instead says React handlers receive the UNWRAPPED `value`
 * (every kit event carries `detail: { value }`, CONVENTIONS §3). This module
 * generates the `@lit/react` wrapper exactly as before (same property/
 * attribute handling, same event wiring) and layers a thin forwardRef HOC
 * that unwraps the payload before calling the consumer's handler:
 *
 * - event with `detail` containing a `value` key → handler receives
 *   `detail.value` (string, boolean, object — the unwrapped new value);
 * - payload-less kit events → the handler receives the event itself (there
 *   is nothing to unwrap).
 *
 * No component behavior, styling, or a11y logic lives here (AD-1) — and no
 * value-clamping either: controlled-mode strictness is owned by the elements
 * (CONVENTIONS §4).
 */

/** The shape every kit custom event payload uses where a payload exists (CONVENTIONS §3). */
interface TkKitEventDetail {
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
    ? (event.detail as TkKitEventDetail).value
    : event;

/** Element-side props (Lit reactive properties) — kept typed through the HOC. */
type KitElementProps<Element extends HTMLElement> = Partial<Omit<Element, keyof HTMLElement>>;

interface CreateKitComponentOptions<Element extends HTMLElement> {
  displayName: string;
  tagName: string;
  elementClass: new () => Element;
  react: typeof React;
}

/**
 * Creates a kit React wrapper: `@lit/react`'s createComponent with the owned
 * event registry applied, wrapped so mapped handler props receive the
 * unwrapped payload. Used by the GENERATED wrappers only
 * (scripts/generate-wrappers.mjs) — hand-written code never calls this.
 *
 * Prop typing: element properties stay typed off the element class; handler
 * props (and anything else @lit/react routes) stay open via the index
 * signature — their runtime semantics are the unwrapped-value contract above.
 */
export function createKitComponent<Element extends HTMLElement>(
  options: CreateKitComponentOptions<Element>,
) {
  const events = EVENT_MAP[options.tagName] ?? {};
  const Base = createComponent({
    ...options,
    events,
  });

  const Wrapped = React.forwardRef<Element, KitElementProps<Element> & Record<string, unknown>>(
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
