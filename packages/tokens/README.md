# pillkit-tokens

Design tokens for [pillkit](https://github.com/salacoste/tinkoff-ui-kit) — the
`--tk-*` custom-property system: a light base layer on `:root`/`:host` plus a
dark layer of semantic overrides on `[data-theme="dark"]`. Generated from a
single token source, AA-verified, and consumed by every pillkit component;
safe to override per-project.

> **Unofficial study project.** pillkit is an independent, unofficial
> recreation of a design language for study purposes. It is not affiliated
> with, endorsed by, or connected to any company, and no trademarks are used
> in its naming. See the repository README for the full disclaimer.

## Install

```bash
pnpm add pillkit-tokens
```

## Usage

```ts
// One document-level sheet — components inherit the resolved values.
// Do NOT adopt this sheet inside a shadow root (the light layer declares
// values on :host and would beat inherited dark values).
import 'pillkit-tokens/tokens.css';

// Optional bundled fonts (see License — separately licensed):
import 'pillkit-tokens/daytona.css';
```

Themes flip via `<html data-theme="dark">` — no markup or inline-style changes.

## License

Mixed-license payload — `SEE LICENSE IN [LICENSE](./LICENSE)`: the package's
own code and generated stylesheets are MIT; the bundled font binaries in
`fonts/` (DaytonaSans — renamed Neue Haas Unica W1G, © Monotype Imaging Inc.;
DaytonaPragma — renamed Pragmatica, © ParaType) are separately licensed assets
and are **not** MIT — their terms are stated in
[fonts/LICENSE-FONTS.md](./fonts/LICENSE-FONTS.md).
