import { css } from 'lit';

/**
 * tk-breadcrumb styles — tokens only (FR-1), zero theme branches (AD-3).
 *
 * Grounding (spec 24.9, gap-8): the invest inner pages open with the
 * «Инвестиции / Раскрытие информации» crumb trail — zero implementations
 * repo-wide until this atom. The trail is a quiet nav line: links in the
 * link token, the CURRENT page in plain text (never a link to itself),
 * decorative chevrons between the stops.
 *
 * The hook layer (CONVENTIONS §6, consumed WITH token defaults):
 * - --tk-breadcrumb-gap       the rhythm between stops AND between a
 *                             chevron and its stop (default space-8)
 * - --tk-breadcrumb-separator the chevron color (default text-secondary)
 * - --tk-breadcrumb-color     the current (non-link) stop's color
 *                             (default text-primary)
 *
 * The link affordance is tk-link's own recipe transplanted onto the trail
 * anchors: --tk-color-link always, NO rest underline, the line painted in
 * a transparent decoration color that fades in on hover/focus-visible on
 * the motion tokens (collapsing to 0s under prefers-reduced-motion) —
 * never a popped-in line. Register: body-s, the quiet nav line.
 *
 * No backticks in css comments — they would terminate the css literal.
 */
export const breadcrumbStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--tk-font-body);
  }

  /* :host display above out-ranks the UA [hidden] rule — enforce hidden. */
  :host([hidden]) {
    display: none;
  }

  .breadcrumb__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--tk-breadcrumb-gap, var(--tk-space-8));
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .breadcrumb__item {
    display: flex;
    align-items: center;
    gap: var(--tk-breadcrumb-gap, var(--tk-space-8));
  }

  /* The decorative chevron between stops — currentColor so the separator
     hook drives it; aria-hidden in the template (a divider, not content). */
  .breadcrumb__separator {
    display: inline-flex;
    color: var(--tk-breadcrumb-separator, var(--tk-color-text-secondary));
  }

  .breadcrumb__separator svg {
    display: block;
  }

  /* The trail's links — tk-link's recipe (the capture pin): --tk-color-link
     always, rest = NO visible underline, the line painted transparent and
     faded in on hover/focus-visible on the motion tokens. */
  .breadcrumb__link {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-color-link);
    text-decoration: underline;
    text-decoration-color: transparent;
    transition:
      text-decoration-color var(--tk-motion-duration-fast) var(--tk-motion-curve-productive-standard);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .breadcrumb__link:hover,
  .breadcrumb__link:focus-visible {
    text-decoration-color: currentColor;
  }

  /* The current stop — plain text, NEVER a link to itself. */
  .breadcrumb__current {
    font-size: var(--tk-text-body-s-size);
    font-weight: var(--tk-text-body-s-weight);
    line-height: var(--tk-text-body-s-leading);
    color: var(--tk-breadcrumb-color, var(--tk-color-text-primary));
  }
`;
