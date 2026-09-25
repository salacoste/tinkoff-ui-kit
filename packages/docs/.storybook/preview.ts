/// <reference types="vite/client" />
import type { Decorator, Preview } from '@storybook/web-components-vite';
import { html } from 'lit';

// Inter — the kit's open fallback — bundled into the docs so the site renders
// it without consumer setup. Latin + cyrillic subsets at
// the weights the type scale uses (docs copy is Russian — latin alone would
// leave Cyrillic glyphs on the system stack). The visual harness pins its own
// locally-served fonts (tests/visual/inject.ts) and stays deterministic.
import '@fontsource/inter/latin-400.css';

// Local licensed fonts (gitignored, never published): picked up automatically
// when packages/docs/src/local-fonts/local-fonts.css exists. See that folder's README.
import.meta.glob('../src/local-fonts/local-fonts.css', { eager: true });
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/cyrillic-400.css';
import '@fontsource/inter/cyrillic-500.css';
import '@fontsource/inter/cyrillic-700.css';
import 'pillkit-tokens/tokens.css';
// Daytona — the kit's bundled licensed renames (DaytonaSans = Neue Haas Unica
// W1G under the maintainer's Monotype license; separately licensed, NOT MIT —
// packages/tokens/fonts/LICENSE-FONTS.md). Docs render DaytonaSans by default;
// Inter above stays as the open fallback.
import 'pillkit-tokens/daytona.css';

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
 *
 * CANVAS BACKGROUND — DECISION (spec 8.3, closing the deferred-work entry
 * «single canvas-background rule in preview.ts vs the N per-story paints»;
 * revisit condition was "the next docs-story work that touches canvas
 * painting" — 8.3's nine v2 pages + registers surface execute it):
 * KEEP THE PER-STORY COPIES. No preview-level rule lands. Rationale:
 * (1) each story's own root paint (background: var(--tk-color-surface-base))
 * is EXPLICIT INTENT at the point of use, carries its dark-sweep rationale
 * comment, and doubles as the story-level FR-1 token-only proof; a central
 * rule would sever the paint from that documentation. (2) A preview rule is
 * LAYOUT-COUPLED: fullscreen stories paint #storybook-root's subtree while
 * padded stories wrap it in sb-main-padded chrome — one selector cannot
 * cover both without pinning Storybook internals that may rename across
 * upgrades. (3) With N explicit copies already baselined, a central rule
 * would ADD a second painter of the same surface (same token, harmless
 * pixels — but two sources of one intent is the AD-4 anti-shape). (4) Zero
 * baseline churn: the copies stay exactly what the visual suite pins. The
 * copies are mechanical and grep-able (canvas/surface-base per story file).
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
      <strong>Неофициальный учебный проект.</strong> pillkit — независимое
      воссоздание дизайна Т-Банка (экс-Тинькофф) в учебных целях. Не
      аффилирован с Т-Банком и не одобрен им; товарные знаки Т-Банка не
      используются.
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
