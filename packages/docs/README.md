# @tk-kit/docs

Storybook 10 docs surface for tinkoff-ui-kit — theme-toggle skeleton with the
unofficial-study disclaimer (Story 1.5). Web-components renderer only; component
stories land from Story 1.7.

## Scripts

- `pnpm --filter @tk-kit/docs dev` — Storybook dev server on port **6006**
- `pnpm --filter @tk-kit/docs build` — static build to `dist/` + typecheck

Both scripts build `@tk-kit/tokens` first (`predev`/`prebuild`): the preview
imports `@tk-kit/tokens/tokens.css`, which resolves to the tokens package's
`dist/index.css` — a gitignored build artifact that does not exist on a fresh
clone until that build runs.

## Layout

- `.storybook/main.ts` — framework, addons, stories glob
- `.storybook/preview.ts` — theme toolbar globalType (flips `data-theme` on the
  preview `<html>`), document-level tokens.css import, disclaimer banner
  decorator (suppressed on the getting-started story, which has its own inline
  box)
- `src/getting-started.stories.ts` — docs index: install, theming recipe,
  CONVENTIONS.md pointer, disclaimer
- `src/tokens-demo.stories.ts` — `@internal` token-swatch demo proving the
  theming pipeline; removed at Story 1.7
