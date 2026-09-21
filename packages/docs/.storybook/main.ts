import type { StorybookConfig } from '@storybook/web-components-vite';

/**
 * Storybook 10 config (spec 1.5) — web-components-vite framework, a11y addon,
 * stories under ../src. Web-components renderer only: no React-wrapper usage
 * in stories until the wrappers exist (Story 1.7).
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
