import type { StorybookConfig } from '@storybook/web-components-vite';

/**
 * Storybook 10 config (spec 1.5, composed in 1.7) — web-components-vite
 * framework, a11y addon. Stories come from BOTH the docs package (../src —
 * getting started, future guides) AND the components package source
 * (../../components/src — every component's stories travel with its code and
 * are baselined by the visual harness from the built index). Web-components
 * renderer: stories consume the Lit elements directly; the React wrappers
 * exist for React consumers, not for stories.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../../components/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
