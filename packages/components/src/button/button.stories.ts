import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './button.js';
import './index.js';

/**
 * tk-button stories (spec 1.7): default playground, every variant × size,
 * states, icon slot, theming demo, and the a11y notes with the keyboard-only
 * checklist. Composed into the docs surface by packages/docs/.storybook/main.ts.
 *
 * Story-canvas styling consumes var(--tk-*) tokens only (FR-1) — this file
 * sits inside the zero-hardcoded guard's scan root.
 */

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'inverse';
  size: 'hero' | 'card' | 'compact';
  loading: boolean;
  disabled: boolean;
};

const button = (label: string, args: Partial<ButtonArgs> = {}) => {
  const { variant, size, loading, disabled } = args;
  return html`
    <tk-button
      variant=${variant ?? 'primary'}
      size=${size ?? 'card'}
      ?loading=${loading ?? false}
      ?disabled=${disabled ?? false}
      >${label}</tk-button
    >
  `;
};

const canvasStyles = html`
  <style>
    .tkbtn-canvas {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
      padding: var(--tk-space-32) var(--tk-space-24);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .tkbtn-canvas h1 {
      margin: 0 0 var(--tk-space-4);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkbtn-canvas .tkbtn-note {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
      color: var(--tk-color-text-secondary);
    }
    .tkbtn-canvas h2 {
      margin: 0 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkbtn-canvas .tkbtn-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--tk-space-16);
    }
    .tkbtn-canvas figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--tk-space-8);
    }
    .tkbtn-canvas figcaption {
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-xs-size);
      line-height: var(--tk-text-body-xs-leading);
      letter-spacing: var(--tk-text-body-xs-tracking);
      color: var(--tk-color-text-secondary);
    }
    .tkbtn-canvas td,
    .tkbtn-canvas th {
      padding: var(--tk-space-4) var(--tk-space-12) var(--tk-space-4) 0;
      text-align: left;
      border-bottom: 1px solid var(--tk-color-border-default);
    }
    .tkbtn-canvas code {
      font-family: var(--tk-font-body);
    }
    .tkbtn-panel {
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkbtn-panel--charcoal {
      background: var(--tk-color-tint-charcoal);
      color: var(--tk-color-white);
    }
    .tkbtn-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkbtn-panel--base {
      background: var(--tk-color-surface-base);
    }
  </style>
`;

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  component: 'tk-button',
  args: {
    variant: 'primary',
    size: 'card',
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'inverse'],
      description: 'Visual variant — literal union (CONVENTIONS §2).',
    },
    size: {
      control: 'radio',
      options: ['hero', 'card', 'compact'],
      description:
        'Height scale: hero 56 / card 48 / compact 32 padded to the 44px target floor.',
    },
    loading: {
      control: 'boolean',
      description: 'In-place spinner; width frozen; clicks do not activate; aria-busy.',
    },
    disabled: {
      control: 'boolean',
      description: '40% opacity, no pointer events, aria-disabled; wins over loading.',
    },
  },
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Button</h1>
      <p class="tkbtn-note">
        Pill control in the Tinkoff register. Flip the toolbar Theme control — every
        surface below restyles through inherited <code>var(--tk-*)</code> tokens with
        zero markup changes.
      </p>
      ${button('Продолжить', args)}
    </main>
  `,
};

export const VariantsAndSizes: Story = {
  name: 'Variants × sizes',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Variants × sizes</h1>
      <p class="tkbtn-note">
        One primary per view cluster is consumer discipline (EXPERIENCE.md Button row) —
        the kit ships the variants; pages spend the yellow.
      </p>
      ${(['hero', 'card', 'compact'] as const).map(
        (size) => html`
          <section>
            <h2>size: ${size}</h2>
            <div class="tkbtn-row">
              ${button('Стать клиентом', { variant: 'primary', size })}
              ${button('Подробнее', { variant: 'secondary', size })}
              ${button('Открыть счёт', { variant: 'inverse', size })}
            </div>
          </section>
        `,
      )}
    </main>
  `,
};

export const States: Story = {
  name: 'States',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>States</h1>
      <p class="tkbtn-note">
        Loading freezes the button width (the label stays for screen readers behind the
        spinner, <code>aria-busy</code> announces the state) and clicks do not activate.
        Disabled is 40% opacity with no pointer events and <code>aria-disabled</code>.
        Precedence: <code>disabled</code> + <code>loading</code> together render disabled
        semantics; the spinner may still show.
      </p>
      <div class="tkbtn-row">
        <figure>${button('Rest', {})}<figcaption>rest</figcaption></figure>
        <figure>${button('Loading', { loading: true })}<figcaption>loading</figcaption></figure>
        <figure>${button('Disabled', { disabled: true })}<figcaption>disabled</figcaption></figure>
        <figure>
          ${button('Both', { loading: true, disabled: true })}
          <figcaption>loading + disabled (disabled wins)</figcaption>
        </figure>
      </div>
    </main>
  `,
};

export const Interaction: Story = {
  name: 'Interaction (hover / press / focus)',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Interaction</h1>
      <p class="tkbtn-note">
        Hover steps the primary fill one token (yellow-100 → yellow-200) at 150ms;
        press steps again (yellow-300) at 75ms — a color step, never a scale. The focus
        ring is the unified 2px <code>--tk-color-focus-ring</code> outline, offset 2px,
        and is never removed. All durations come from
        <code>--tk-motion-*</code> tokens and collapse to 0ms under
        <code>prefers-reduced-motion</code>. These states are transient — hover, press
        and Tab through the buttons below.
      </p>
      <div class="tkbtn-row">
        ${button('Hover me', { variant: 'primary', size: 'hero' })}
        ${button('Press me', { variant: 'primary', size: 'hero' })}
        ${button('Tab to me', { variant: 'secondary', size: 'hero' })}
        ${button('Me too', { variant: 'inverse', size: 'hero' })}
      </div>
    </main>
  `,
};

export const WithIcon: Story = {
  name: 'Icon slot',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Icon slot</h1>
      <p class="tkbtn-note">
        The optional <code>slot="icon"</code> renders LEFT of the label; the default
        slot is the label (CONVENTIONS §5). Decorative icons should carry
        <code>aria-hidden</code> — the label alone names the button.
      </p>
      <div class="tkbtn-row">
        <tk-button variant="primary" size="hero">
          <svg
            slot="icon"
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          Стать клиентом
        </tk-button>
        <tk-button variant="secondary" size="card">
          <svg
            slot="icon"
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          Подробнее
        </tk-button>
        <tk-button variant="inverse" size="compact">
          <svg
            slot="icon"
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12l7 7 7-7" />
          </svg>
          Скачать
        </tk-button>
      </div>
    </main>
  `,
};

export const Theming: Story = {
  name: 'Theming',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Theming</h1>
      <p class="tkbtn-note">
        Buttons theme by inheritance only — flip the toolbar Theme control
        (<code>data-theme="dark"</code> on the preview root). Primary keeps ink text on
        yellow in both themes; secondary and inverse re-resolve through surface/ink
        semantic tokens (secondary lifts onto the dark surface with its hairline, inverse
        inverts to a light pill); shadows collapse to <code>none</code> in dark per the
        token layer.
      </p>
      <section class="tkbtn-panel tkbtn-panel--base">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Secondary', { variant: 'secondary', size: 'card' })}
          ${button('Inverse', { variant: 'inverse', size: 'card' })}
        </div>
      </section>
      <section class="tkbtn-panel tkbtn-panel--muted">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Secondary', { variant: 'secondary', size: 'card' })}
        </div>
      </section>
      <section class="tkbtn-panel tkbtn-panel--charcoal">
        <div class="tkbtn-row">
          ${button('Primary', { variant: 'primary', size: 'card' })}
          ${button('Inverse', { variant: 'inverse', size: 'card' })}
        </div>
      </section>
    </main>
  `,
};

export const Accessibility: Story = {
  name: 'Accessibility',
  render: () => html`
    ${canvasStyles}
    <main class="tkbtn-canvas">
      <h1>Accessibility</h1>
      <p class="tkbtn-note">
        <code>tk-button</code> renders a native <code>&lt;button&gt;</code> — role, name
        and Space/Enter activation come by construction. States are announced
        (<code>aria-disabled</code>, <code>aria-busy</code>); the loading label is kept
        for screen readers behind the spinner. The compact 32px button pads its effective
        target to the 44px floor (EXPERIENCE.md A11y Floor) — hover is never the only
        path; every action has touch and keyboard parity.
      </p>
      <h2>Keyboard-only checklist</h2>
      <table>
        <thead>
          <tr><th>Key</th><th>Expected</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Tab</code> / <code>Shift+Tab</code></td>
            <td>
              Moves focus to / away from the button; the 2px focus ring
              (<code>--tk-color-focus-ring</code>, offset 2px) is visible whenever the
              button is keyboard-focused and is never removed.
            </td>
          </tr>
          <tr>
            <td><code>Enter</code></td>
            <td>Activates the button (native activation); no activation while loading or disabled.</td>
          </tr>
          <tr>
            <td><code>Space</code></td>
            <td>Activates the button (native activation); no activation while loading or disabled.</td>
          </tr>
          <tr>
            <td>Screen reader</td>
            <td>
              Announces the label, and <code>disabled</code> / <code>busy</code> states
              when set — the accessible name never disappears during loading.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tkbtn-row">
        ${button('Keyboard target', { variant: 'primary', size: 'hero' })}
        ${button('Compact 44px floor', { variant: 'secondary', size: 'compact' })}
      </div>
    </main>
  `,
};
