import type { Decorator, Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@tk-kit/tokens/tokens.css';

/**
 * Preview runtime (spec 1.5).
 *
 * Token loading — DOCUMENT-LEVEL BY DESIGN (deferred-work entry "token-loading
 * model for shadow consumers", owned by this story): the sheet is imported here
 * so `:root`/`[data-theme="dark"]` cascade from the preview `<html>`, and kit
 * components INHERIT the resolved custom properties into their shadow roots.
 * A token sheet adopted INSIDE a shadow root would declare its light layer on
 * `:host`, which then beats the inherited dark values when the document is
 * themed dark — the cascade trap the deferred entry warns about. Consumers
 * follow the same rule: one document-level sheet, components inherit. Documented
 * for consumers in the getting-started page (src/getting-started.stories.ts).
 *
 * Disclaimer chrome — PREVIEW-DECORATOR BANNER (the spec's accepted fallback;
 * manager-head.html injection was the alternative). Chosen because the banner
 * then consumes the kit's own var(--tk-*) tokens and flips with data-theme for
 * free — guaranteed readable in BOTH themes — while manager chrome sits outside
 * the preview and would need Storybook-chrome styling independent of the kit
 * theme system. The banner is persistent chrome: the decorator wraps every
 * story EXCEPT the getting-started page, which carries its own inline
 * disclaimer box (banner suppressed by story id to avoid double rendering).
 *
 * Theme persistence: Storybook 10 does NOT persist toolbar globals across
 * manager reloads (verified live) — the state lives in the URL as
 * `globals=theme:dark`, which is the shareable/persistable form.
 */

/** Applies the toolbar theme to the preview document root — flips the token layer. */
export const withTheme: Decorator = (story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  return story(context);
};

const disclaimerStyles = html`
  <style>
    .tk-docs-disclaimer {
      position: sticky;
      top: 0;
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: var(--tk-space-8) var(--tk-space-16);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      font-weight: var(--tk-text-body-xs-weight);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tk-docs-disclaimer strong {
      font-weight: var(--tk-text-body-s-bold-weight);
      color: var(--tk-color-text-primary);
    }
  </style>
`;

/** The one story that carries its own inline disclaimer box — the banner would duplicate it there. */
const INLINE_DISCLAIMER_STORY_ID = 'getting-started--page';

/** Persistent chrome: the unofficial-study disclaimer above every story, themed by tokens. */
export const withDisclaimer: Decorator = (story, context) => {
  if (context.id === INLINE_DISCLAIMER_STORY_ID) return story(context);
  return html`
    ${disclaimerStyles}
    <aside class="tk-docs-disclaimer" role="note">
      <strong>Unofficial study project.</strong> tinkoff-ui-kit is an independent
      design-study recreation of the Tinkoff (T-Bank) design language. Not
      affiliated with, endorsed by, or sponsored by T-Bank; no T-Bank trademarks
      are used.
    </aside>
    ${story(context)}
  `;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Kit theme — flips data-theme on the preview <html>; every token-driven surface restyles.',
      toolbar: {
        icon: 'mirror',
        title: 'Theme',
        items: [
          { value: 'light', icon: 'sun', title: 'Light', right: 'default' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme, withDisclaimer],
};

export default preview;
