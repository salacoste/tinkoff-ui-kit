# pillkit-react

React 19 adapters for [pillkit](https://github.com/salacoste/tinkoff-ui-kit) —
wrappers for the `tk-*` custom elements of `pillkit-components`, generated from
its Custom Elements Manifest (`@lit/react`). Event handlers receive the
unwrapped `detail` payload instead of the raw `CustomEvent`. Regenerate with
`pnpm gen` from the repository root.

> **Unofficial study project.** pillkit is an independent, unofficial
> recreation of a design language for study purposes. It is not affiliated
> with, endorsed by, or connected to any company, and no trademarks are used
> in its naming. See the repository README for the full disclaimer.

## Install

Distributed via the [GitHub repository](https://github.com/salacoste/tinkoff-ui-kit)
only — the packages are not published to npm. Follow the workspace-link recipe
in the repository README («Быстрый старт»): clone the repo (pin the release
tag, e.g. `--branch v1.0.0`), add its `packages/*` to your
`pnpm-workspace.yaml`, build, then:

```bash
pnpm add -w pillkit-react pillkit-components pillkit-tokens --workspace
pnpm add -w react@^19 react-dom@^19
```

Peer dependency: React 19.x.

## Usage

```tsx
import 'pillkit-tokens/tokens.css';
import 'pillkit-components'; // registers the tk-* elements
import { Button } from 'pillkit-react';

export function App() {
  return <Button variant="primary">Продолжить</Button>;
}
```

## License

[MIT](https://github.com/salacoste/tinkoff-ui-kit/blob/main/LICENSE) © 2026
salacoste.
