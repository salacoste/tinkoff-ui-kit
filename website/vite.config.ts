import { defineConfig } from 'vite';

/**
 * pillkit website — static marketing surface for GitHub Pages.
 *
 * The repo is served as a GitHub Pages PROJECT site, so every URL lives under
 * /tinkoff-ui-kit/ (base below). EN pages sit at the root, RU backups under
 * /ru/. The Storybook docs build is deployed by the same workflow into the
 * /storybook/ subpath (see .github/workflows/pages.yml) — link to it with
 * root-absolute '/tinkoff-ui-kit/storybook/' URLs.
 *
 * Component entry points resolve to the built workspace packages under
 * packages/<family>/dist — run a workspace build (`pnpm build` at the repo
 * root) before `pnpm --filter pillkit-website build` on a fresh checkout.
 *
 * NOTE: keep this file (and everything under website/src) free of
 * TypeScript-only syntax — the lint hook parses these files with the base
 * parser, and the root typecheck does not include them.
 */
function resolveHtml(relative) {
  return new URL(relative, import.meta.url).pathname;
}

const pages = {
  index: resolveHtml('index.html'),
  bank: resolveHtml('bank.html'),
  invest: resolveHtml('invest.html'),
  tj: resolveHtml('tj.html'),
  admin: resolveHtml('admin.html'),
  'ru-index': resolveHtml('ru/index.html'),
  'ru-bank': resolveHtml('ru/bank.html'),
  'ru-invest': resolveHtml('ru/invest.html'),
  'ru-tj': resolveHtml('ru/tj.html'),
  'ru-admin': resolveHtml('ru/admin.html'),
};

export default defineConfig({
  base: '/tinkoff-ui-kit/',
  build: {
    rollupOptions: {
      input: pages,
    },
  },
});
