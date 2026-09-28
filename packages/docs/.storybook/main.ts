import type { StorybookConfig } from '@storybook/web-components-vite';

/**
 * Storybook 10 config (spec 1.5, composed in 1.7) — web-components-vite
 * framework, a11y addon. Stories come from the docs package (../src —
 * getting started, future guides), the components package source
 * (../../components/src — every component's stories travel with its code and
 * are baselined by the visual harness from the built index), AND the ТЖ
 * components source (../../tj-components/src — spec 16.1: the reading
 * primitives' stories ride the same composed docs surface; the docs package
 * is the sole FR-17 exemption composing both families). Web-components
 * renderer: stories consume the Lit elements directly; the React wrappers
 * exist for React consumers, not for stories.
 */
const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../../components/src/**/*.stories.@(ts|tsx)',
    '../../tj-components/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
