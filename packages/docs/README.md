# pillkit-docs

Storybook 10 docs surface for tinkoff-ui-kit — theme-toggle skeleton with the
unofficial-study disclaimer (Story 1.5). Web-components renderer only; the
component stories composed here ship with the components package (Story 1.7).

## Scripts

- `pnpm --filter pillkit-docs dev` — Storybook dev server on port **6006**
- `pnpm --filter pillkit-docs build` — static build to `dist/` + typecheck

Both scripts build `pillkit-tokens` first (`predev`/`prebuild`): the preview
imports `pillkit-tokens/tokens.css`, which resolves to the tokens package's
`dist/index.css` — a gitignored build artifact that does not exist on a fresh
clone until that build runs.

## Layout

- `.storybook/main.ts` — framework, addons, stories globs (docs `src/` +
  `../../components/src/` — component stories travel with their code; the
  Button pilot landed in Story 1.7)
- `.storybook/preview.ts` — theme toolbar globalType (flips `data-theme` on the
  preview `<html>`), document-level tokens.css import, disclaimer banner
  decorator (suppressed on the getting-started story, which has its own inline
  box)
- `src/getting-started.stories.ts` — docs index: install, theming recipe,
  CONVENTIONS.md pointer, disclaimer

The `@internal` token-swatch demo (spec 1.5) was removed at Story 1.7 per its
contract — real component stories carry the theming demos now (its baselines
and harness allowlist entries went in the same change, per the baseline
removal rule).
