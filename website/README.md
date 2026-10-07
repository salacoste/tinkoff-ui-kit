# pillkit-website

Static marketing surface for the pillkit UI kit, deployed to GitHub Pages.
Private package, never published to a registry — the only consumer is the
Pages deploy pipeline.

## Page map

| Page | EN | RU backup |
|---|---|---|
| Landing | `/` | `/ru/` |
| Bank showcase | `/bank.html` | `/ru/bank.html` |
| Invest showcase | `/invest.html` | `/ru/invest.html` |
| Admin showcase | `/admin.html` | `/ru/admin.html` |
| T-Journal showcase | `/tj.html` | `/ru/tj.html` |
| Storybook docs | `/storybook/` (deployed by the pipeline, not part of this vite build) | — |

Family showcases are hand-built pages demonstrating each subproject's
components in context (Bank, Invest, Admin console family, Т-Journal reading
primitives).

## Commands

Run from the repo root (pnpm only):

```sh
pnpm --filter pillkit-website dev      # vite dev server with the real base
pnpm --filter pillkit-website build    # static build → website/dist
pnpm --filter pillkit-website preview  # serve the built dist
```

Prerequisite on a fresh checkout: a workspace build first (`pnpm build` at the
repo root) — component entry points resolve to the built `packages/*/dist`.

## Base path reality

The repo is a GitHub Pages **project** site, so every URL lives under
`/tinkoff-ui-kit/`. That base is baked into the build via `base` in
`vite.config.ts`; write all internal links root-absolute
(`/tinkoff-ui-kit/bank.html`, `/tinkoff-ui-kit/storybook/`), never
`../`-relative.

The Storybook docs deploy to `/tinkoff-ui-kit/storybook/` alongside this
site. Always link them with the **trailing slash** — Storybook's build is
relative-path, so `iframe.html` and `./assets/*` resolve against the URL's
directory; without the slash the browser resolves them against
`/tinkoff-ui-kit/` and every story 404s.

## Site chrome

`SITE-CHROME.md` is the shared chrome contract: the canonical header/footer
markup every page carries verbatim (EN and RU blocks), the URL map, and the
`aria-current` nav convention. Pages link `src/styles/site.css` for the chrome
styles and may add page-scoped `<style>` blocks. Do not rename its classes.

## Deploy pipeline

`.github/workflows/pages.yml` (triggers: push to `main` touching
`website/**`, `packages/**`, the workflow file or `pnpm-lock.yaml`, plus
manual `workflow_dispatch`):

1. `pnpm install --frozen-lockfile` + `pnpm build` — full workspace build,
   ending with `website/dist` (this site) and `packages/docs/dist`.
2. A dedicated Storybook build into `packages/docs/storybook-pages` — no base
   flag needed, Storybook 10.6 emits fully relative-path output that serves
   correctly from any subpath (verified headless under
   `/tinkoff-ui-kit/storybook/`).
3. Assemble `_site/` = `website/dist` + `storybook-pages` under `/storybook`,
   upload as the Pages artifact, deploy via `actions/deploy-pages`.

Quality gates (lint, tests, visual suite) are NOT re-run here — `ci.yml`
already runs them on the same push; Pages builds and deploys only.

## Language policy

EN is the main site language; RU is a backup mirror under `/ru/` (not a
translation workflow — pages are authored in parallel). Language switch links
in the chrome cross-reference the counterpart page (`lang`/`hreflang` set).
