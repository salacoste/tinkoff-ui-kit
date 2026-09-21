import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * Docs index / getting-started stub (spec 1.5). Skeleton content only —
 * component docs land from Story 1.7 (Button) onward. All styling consumes
 * var(--tk-*) tokens (FR-1); the unofficial disclaimer renders here — the
 * persistent banner is suppressed on this story by id (see .storybook/preview.ts).
 */

const REPO_URL = 'https://github.com/salacoste/tinkoff-ui-kit';
const CONVENTIONS_PATH = 'packages/components/CONVENTIONS.md';

const pageStyles = html`
  <style>
    .tkgs {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-base);
    }
    .tkgs h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkgs h2 {
      margin: var(--tk-space-32) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkgs p {
      margin: 0 0 var(--tk-space-12);
    }
    .tkgs a {
      color: var(--tk-color-link);
    }
    .tkgs .tkgs-disclaimer {
      margin: 0 0 var(--tk-space-24);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-tint-bluegray);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs .tkgs-disclaimer strong {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-s-bold-weight);
    }
    .tkgs pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs code {
      font-family: var(--tk-font-body);
    }
    .tkgs .tkgs-status {
      margin: var(--tk-space-32) 0 0;
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-left: var(--tk-space-4) solid var(--tk-color-yellow-100);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkgs ol {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tkgs li {
      margin: 0 0 var(--tk-space-8);
    }
  </style>
`;

const meta: Meta = {
  title: 'Getting Started',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Getting started',
  render: () => html`
    ${pageStyles}
    <main class="tkgs">
      <h1>tinkoff-ui-kit</h1>
      <p class="tkgs-disclaimer" role="note">
        <strong>Unofficial study project.</strong> tinkoff-ui-kit is an
        independent design-study recreation of the Tinkoff (T-Bank) design
        language. Not affiliated with, endorsed by, or sponsored by T-Bank; no
        T-Bank trademarks are used. A disclaimer banner is also pinned above
        every story.
      </p>

      <h2>Install</h2>
      <p>
        The packages are not published yet — <code>npm install @tk-kit/…</code>
        arrives with the first publish (Story 5.7). Until then the workable
        path is a pnpm workspace link from a checkout of this repository:
      </p>
      <pre><code>git clone ${REPO_URL}
cd my-app && pnpm init
# add the kit checkout to your pnpm workspace (pnpm-workspace.yaml):
#   packages:
#     - .
#     - ../tinkoff-ui-kit/packages/*
pnpm add @tk-kit/components @tk-kit/react @tk-kit/tokens --workspace</code></pre>
      <p>
        The link pins <code>workspace:*</code>, so the kit builds and updates
        alongside your app. Components are Lit custom elements
        (<code>tk-*</code>); the React wrappers are generated from the component
        manifest and land with the first component (Story 1.7).
      </p>

      <h2>Theming</h2>
      <ol>
        <li>
          Load the token sheet once at the <strong>document level</strong> — it
          cascades from <code>&lt;html&gt;</code>, and components inherit the
          resolved custom properties into their shadow roots:
          <pre><code>import '@tk-kit/tokens/tokens.css';</code></pre>
          Do not adopt this sheet inside a shadow root: the light layer declares
          values on <code>:host</code>, which would then beat the inherited dark
          values when the document is themed dark (the shadow-adoption trap).
        </li>
        <li>
          Switch themes by setting the attribute on the document root — zero
          markup, class, or inline-style changes inside the app:
          <pre><code>&lt;html data-theme="dark"&gt;</code></pre>
          Try it with the Theme control in the Storybook toolbar.
        </li>
        <li>
          Point the brand-font slot at your font — the reference brand font is
          proprietary and intentionally not bundled. A slot override replaces
          the whole value, so re-include a fallback stack (Inter is the
          recommended default):
          <pre><code>:root { --tk-font-heading: Inter, sans-serif; --tk-font-body: Inter, sans-serif; }</code></pre>
        </li>
      </ol>

      <h2>Component API</h2>
      <p>
        Every component follows the kit's API contract — props, events,
        controlled/uncontrolled modes, slots, and theming grammar. See
        <code>${CONVENTIONS_PATH}</code> in the
        <a href="${REPO_URL}" target="_blank" rel="noreferrer noopener"
          >kit repository</a
        >.
      </p>

      <p class="tkgs-status">
        Skeleton status (Story 1.5): this page plus a temporary token-swatch
        demo prove the theming pipeline. The first component — Button — lands in
        Story 1.7 with full stories, axe checks, and a visual baseline.
      </p>
    </main>
  `,
};
