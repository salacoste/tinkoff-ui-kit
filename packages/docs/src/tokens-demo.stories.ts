import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

/**
 * @internal — token-swatch demo proving the theming pipeline (spec 1.5):
 * every tile consumes a live var(--tk-color-*) custom property, so flipping
 * the toolbar Theme control (data-theme on the preview <html>) re-resolves
 * them with zero per-swatch changes. REMOVED AT STORY 1.7 — real component
 * stories carry theming demos from then on.
 *
 * Zero-hardcoded guard note: file lives in docs/src — every color here MUST
 * stay a var(--tk-*) reference (FR-1).
 */

export const GROUPS: ReadonlyArray<{ heading: string; tokens: readonly string[] }> = [
  {
    heading: 'Surfaces & borders',
    tokens: [
      '--tk-color-surface-base',
      '--tk-color-surface-muted',
      '--tk-color-surface-field',
      '--tk-color-border-default',
      '--tk-color-border-strong',
    ],
  },
  {
    heading: 'Text & semantics',
    tokens: [
      '--tk-color-text-primary',
      '--tk-color-text-secondary',
      '--tk-color-text-muted',
      '--tk-color-text-on-primary',
      '--tk-color-focus-ring',
      '--tk-color-link',
      '--tk-color-link-on-tint',
      '--tk-color-error',
      '--tk-color-error-on-field',
    ],
  },
  {
    heading: 'Brand scales',
    tokens: [
      '--tk-color-yellow-100',
      '--tk-color-yellow-200',
      '--tk-color-yellow-300',
      '--tk-color-ink-300',
      '--tk-color-blue-100',
      '--tk-color-green-100',
      '--tk-color-red-100',
    ],
  },
  {
    heading: 'Tints (dark-override candidates)',
    tokens: [
      '--tk-color-tint-gray',
      '--tk-color-tint-bluegray',
      '--tk-color-tint-mint',
      '--tk-color-tint-beige',
      '--tk-color-tint-charcoal',
    ],
  },
];

const swatch = (token: string) => html`
  <figure class="tksw-tile">
    <div class="tksw-chip" style=${`background: var(${token})`}></div>
    <figcaption>${token}</figcaption>
  </figure>
`;

const meta: Meta = {
  title: 'Tokens',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Swatches: Story = {
  name: 'Swatches (internal demo — removed at 1.7)',
  parameters: {
    a11y: {
      // Scope the exemption to the color-only chips: every text-bearing
      // element (headings, note, token-name labels) stays in scope, so
      // color-contrast still runs on real text in both themes.
      context: {
        exclude: ['.tksw-chip'],
      },
    },
  },
  render: () => html`
    <style>
      .tksw {
        box-sizing: border-box;
        max-width: var(--tk-space-container);
        margin: 0 auto;
        padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-96);
        font-family: var(--tk-font-body);
        background: var(--tk-color-surface-base);
        color: var(--tk-color-text-primary);
      }
      .tksw h1 {
        margin: 0 0 var(--tk-space-8);
        font-family: var(--tk-font-heading);
        font-size: var(--tk-text-heading-3-size);
        font-weight: var(--tk-text-heading-3-weight);
        line-height: var(--tk-text-heading-3-leading);
      }
      .tksw .tksw-note {
        margin: 0 0 var(--tk-space-24);
        font-size: var(--tk-text-body-m-size);
        line-height: var(--tk-text-body-m-leading);
        color: var(--tk-color-text-secondary);
      }
      .tksw section {
        margin: 0 0 var(--tk-space-24);
        padding: var(--tk-space-16);
        border: 1px solid var(--tk-color-border-default);
        border-radius: var(--tk-radius-md);
      }
      .tksw h2 {
        margin: 0 0 var(--tk-space-12);
        font-family: var(--tk-font-heading);
        font-size: var(--tk-text-heading-6-size);
        font-weight: var(--tk-text-heading-6-weight);
        line-height: var(--tk-text-heading-6-leading);
      }
      .tksw .tksw-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--tk-space-12);
      }
      .tksw-tile {
        margin: 0;
      }
      .tksw-chip {
        height: 56px;
        border: 1px solid var(--tk-color-border-strong);
        border-radius: var(--tk-radius-sm);
      }
      .tksw-tile figcaption {
        margin-top: var(--tk-space-4);
        font-family: var(--tk-font-body);
        font-size: var(--tk-text-body-xs-size);
        line-height: var(--tk-text-body-xs-leading);
        letter-spacing: var(--tk-text-body-xs-tracking);
        color: var(--tk-color-text-secondary);
        overflow-wrap: anywhere;
      }
    </style>
    <main class="tksw">
      <h1>Tokens</h1>
      <p class="tksw-note">
        Every chip renders <code>var(--tk-color-*)</code> live — flip the
        toolbar Theme control and the swatches re-resolve with the
        <code>data-theme</code> attribute on the preview root. Internal demo;
        removed at Story 1.7.
      </p>
      ${GROUPS.map(
        (group) => html`
          <section>
            <h2>${group.heading}</h2>
            <div class="tksw-grid">${group.tokens.map(swatch)}</div>
          </section>
        `,
      )}
    </main>
  `,
};
