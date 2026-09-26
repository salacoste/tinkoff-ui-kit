import { html, type TemplateResult } from 'lit';

/**
 * Shared page chrome for the nine v2 component pages (spec 8.3) — the 5.5
 * docs-page anatomy (what/when/not-for, live usage, theming, a11y + SR
 * protocol, composition pointers) rendered by per-component story files in
 * this folder. API tables are NOT here: every page embeds
 * apiReferenceDoc('<tag>') — the generated CEM table (packages/components/
 * src/api-reference.ts, the 5.5 recorded choice) — so no API row is ever
 * hand-typed.
 *
 * The interactive suites (Playground/Variants/Theming/Accessibility/Api)
 * live WITH the components (packages/components/src/**, composed into this
 * Storybook by .storybook/main.ts); these pages are the adoption surface
 * that ties them together, carrying the consumer contracts verbatim.
 *
 * Content RU (OQ-4), story meta EN for baseline stability. Styling consumes
 * var(--tk-*) tokens only (FR-1).
 */

/** The shared page style block — one anatomy, nine pages. */
export const v2PageStyles = html`
  <style>
    .tkv2 {
      box-sizing: border-box;
      max-width: var(--tk-space-container);
      margin: 0 auto;
      padding: var(--tk-space-40) var(--tk-space-24) var(--tk-space-96);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      font-weight: var(--tk-text-body-m-weight);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
      /* Canvas follows the theme's base surface (the 5.4 dark-sweep rule):
         without an explicit paint the browser canvas stays WHITE in dark. */
      background: var(--tk-color-surface-base);
    }
    .tkv2 h1 {
      margin: 0 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .tkv2 h2 {
      margin: var(--tk-space-40) 0 var(--tk-space-12);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-5-size);
      font-weight: var(--tk-text-heading-5-weight);
      line-height: var(--tk-text-heading-5-leading);
    }
    .tkv2 h3 {
      margin: var(--tk-space-24) 0 var(--tk-space-8);
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-6-size);
      font-weight: var(--tk-text-heading-6-weight);
      line-height: var(--tk-text-heading-6-leading);
    }
    .tkv2 p {
      margin: 0 0 var(--tk-space-12);
      max-width: var(--tk-space-container);
    }
    .tkv2 .tkv2-note {
      color: var(--tk-color-text-secondary);
    }
    /* Page-chrome anchor ink. Deliberately scoped OUT of tk-cookie-banner:
       document rules override the banner's frozen ::slotted(a) ruling
       (text-secondary ink, underline on hover/focus), and repainting the
       slotted link broke axe link-in-text-block on this page. Slotted
       content belongs to the component, never to the page. */
    .tkv2 a:not(tk-cookie-banner a) {
      color: var(--tk-color-link);
    }
    .tkv2 ul {
      margin: 0 0 var(--tk-space-16);
      padding-left: var(--tk-space-24);
    }
    .tkv2 li {
      margin: 0 0 var(--tk-space-8);
    }
    .tkv2 pre {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      overflow-x: auto;
      color: var(--tk-color-text-primary);
      background: var(--tk-color-surface-muted);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-sm);
      /* Code surfaces render the mono chain — --tk-font-mono's first
         consumer (story 11.2); block and inline alike. */
      font-family: var(--tk-font-mono);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkv2 code {
      font-family: var(--tk-font-mono);
    }
    .tkv2 table {
      box-sizing: border-box;
      width: 100%;
      margin: 0 0 var(--tk-space-16);
      border-collapse: collapse;
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      text-align: left;
    }
    .tkv2 th,
    .tkv2 td {
      padding: var(--tk-space-8) var(--tk-space-12) var(--tk-space-8) 0;
      border-bottom: 1px solid var(--tk-color-border-default);
      vertical-align: top;
    }
    .tkv2 th {
      font-size: var(--tk-text-body-xs-size);
      font-weight: var(--tk-text-body-s-bold-weight);
      letter-spacing: var(--tk-text-caps-s-tracking);
      text-transform: uppercase;
      color: var(--tk-color-text-secondary);
    }
    /* Live-demo frame: the component in its own bordered area on the page
       surface (demos needing another surface add a tkv2-panel modifier). */
    .tkv2 .tkv2-demo {
      box-sizing: border-box;
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-24);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
    }
    .tkv2 .tkv2-stack {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .tkv2 .tkv2-panel {
      box-sizing: border-box;
      padding: var(--tk-space-24);
      border-radius: var(--tk-radius-lg);
    }
    .tkv2 .tkv2-panel--muted {
      background: var(--tk-color-surface-muted);
    }
    .tkv2 .tkv2-panel--cream {
      background: var(--tk-color-tint-cream);
    }
    /* Consumer-gotcha callout: a border-left rule is decoration — yellow is
       reserved for primary actions and active indicators (UX-DR17). */
    .tkv2 .tkv2-gotcha {
      margin: 0 0 var(--tk-space-16);
      padding: var(--tk-space-12) var(--tk-space-16);
      color: var(--tk-color-text-secondary);
      background: var(--tk-color-surface-muted);
      border-left: var(--tk-space-4) solid var(--tk-color-border-strong);
      border-radius: var(--tk-radius-xs);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
    }
    .tkv2 .tkv2-gotcha strong {
      color: var(--tk-color-text-primary);
      font-weight: var(--tk-text-body-s-bold-weight);
    }
  </style>
`;

/**
 * An usage code block (escaped text — markup shown verbatim).
 *
 * `tabindex="0"`: the mono flip (story 11.2) made long samples actually
 * overflow their box — a scrollable region must be keyboard-scrollable
 * (WCAG 2.1.1; axe `scrollable-region-focusable`, fired on the stepper
 * page sample). This is axe's canonical remediation; on non-scrolling
 * pages the tab stop on copyable code is good practice, not debt
 * (orchestrator-adjudicated in-story fix — the adjudication record lives
 * in .playwright-cli/verify/docs-11-2/NOTES.md).
 */
export const codeBlock = (code: string): TemplateResult => html`
  <pre tabindex="0"><code>${code}</code></pre>
`;
