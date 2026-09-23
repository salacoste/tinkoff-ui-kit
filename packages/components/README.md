# pillkit-components

Lit custom elements core for [pillkit](https://github.com/salacoste/tinkoff-ui-kit)
— 19 `tk-*` components (forms, navigation, cards, overlays) rendered via Shadow
DOM and themed entirely through `--tk-*` custom properties from
`pillkit-tokens` (zero component-level theme branches). Includes the shared
overlay controller (mounting, scroll-lock, positioning, stacking, focus-trap)
behind modal / select / tooltip / toast.

> **Unofficial study project.** pillkit is an independent, unofficial
> recreation of a design language for study purposes. It is not affiliated
> with, endorsed by, or connected to any company, and no trademarks are used
> in its naming. See the repository README for the full disclaimer.

## Install

```bash
pnpm add pillkit-components pillkit-tokens
```

## Usage

```ts
import 'pillkit-tokens/tokens.css'; // once, at the document level
import 'pillkit-components';        // registers all tk-* elements
```

```html
<tk-button variant="primary" size="card">Продолжить</tk-button>
```

The component API contract — props, events, controlled/uncontrolled modes,
slots and the theming grammar — is documented in
[CONVENTIONS.md](./CONVENTIONS.md); per-component API tables are generated
from the shipped [custom-elements.json](./custom-elements.json). Framework
adapters live in `pillkit-react` (generated from the manifest, `pnpm gen`).

## License

[MIT](https://github.com/salacoste/tinkoff-ui-kit/blob/main/LICENSE) © 2026
salacoste. (Fonts and other separately licensed assets live in
`pillkit-tokens`, not in this package.)
