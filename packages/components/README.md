# @tk-kit/components

Lit custom elements core package for [tinkoff-ui-kit](../../README.md) — an unofficial
study recreation of the Tinkoff (T-Bank) design language.

Components are authored once here as Lit custom elements (Shadow DOM, themed via
`--tk-*` custom properties from `@tk-kit/tokens`); framework adapters are generated
from the Custom Elements Manifest (`custom-elements.json`, regenerated with
`pnpm gen:manifest` — run `pnpm gen` at the root to refresh manifest + React
wrappers together).

- [`tk-button`](src/button) — the pilot component (variants primary/secondary/
  inverse, sizes hero/card/compact, loading/disabled states, icon slot).

Component API contract: [CONVENTIONS.md](CONVENTIONS.md).
