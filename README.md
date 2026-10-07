# tinkoff-ui-kit / pillkit

**Banking-grade web components for any stack.**

[![CI](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/salacoste/tinkoff-ui-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Lit](https://img.shields.io/badge/Lit-3.3.3-blue)](https://lit.dev)
[![Storybook](https://img.shields.io/badge/Storybook-10.6-blueviolet)](https://salacoste.github.io/tinkoff-ui-kit/storybook/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://salacoste.github.io/tinkoff-ui-kit/)

Read this in Russian: [`README.ru.md`](README.ru.md)

**pillkit** is a banking-grade UI kit that recreates a proven fintech design
language as standards-based web components — framework-agnostic,
accessibility-first, and themed through a two-layer token system with a real
dark mode. Two families ship side by side: 46 bank `tk-*` components and the
self-contained editorial `tj-*` family (10 components with their own `--tj-*`
tokens) — 56 components in total, plus 51 generated React wrappers, strict
TypeScript, and Storybook documentation for every component.

**[Try the live showcase](https://salacoste.github.io/tinkoff-ui-kit/)**
· **[Open the component docs](https://salacoste.github.io/tinkoff-ui-kit/storybook/)**
· **[Get started](#quick-start)**

## Why pillkit

- **Standards-based web components — any stack.** Every component is a
  Lit 3.3.3 custom element. The same `tk-*` and `tj-*` tags work in React,
  Vue, Svelte, Angular, plain HTML, or a no-build static page; there is no
  framework lock-in and nothing to port.
- **Two-layer theming with a real dark mode.** A light base of `--tk-*`
  custom properties plus semantic overrides on `[data-theme="dark"]`: dark
  mode is one attribute on `<html>` — no markup rewrites, no per-screen
  style patches.
- **Accessibility first.** An AA contrast ledger enforced by tests, axe
  audits in both themes for every component, screen-reader semantics,
  keyboard support and reduced-motion respected by default — not bolted on
  afterwards.
- **Generated React wrappers.** 51 typed wrappers are generated from the
  Custom Elements Manifest with `@lit/react`, so the React API (props,
  events, slots) can never drift from the elements underneath.
- **One shared overlay controller.** Dialogs, toasts and popovers share a
  single overlay controller: one stacking order, one focus story, no
  per-component z-index battles.
- **A 2755-leg regression suite guarding every change.** Automated visual
  regression against committed cross-platform baselines plus axe in both
  themes; CI runs lint → typecheck → build → test → the visual suite on
  every push and PR.
- **A zero-dependency editorial sub-kit.** The T-Journal family carries its
  own token set and font model and imports nothing from the bank packages —
  you can adopt it alone.

## One kit, four product languages

| Family | What it is | Live showcase |
|---|---|---|
| **Bank** | The core: 46 `tk-*` components — buttons, inputs, cards, carousel, toast, spinner — on the two-layer token system | [bank.html](https://salacoste.github.io/tinkoff-ui-kit/bank.html) |
| **Invest** | Investment-client surfaces composed from bank components and tokens | [invest.html](https://salacoste.github.io/tinkoff-ui-kit/invest.html) |
| **Admin** | Admin consoles and internal tools: dense data surfaces, including the authorized-zone patterns | [admin.html](https://salacoste.github.io/tinkoff-ui-kit/admin.html) |
| **T-Journal** | The editorial sub-kit: 10 `tj-*` components, own `--tj-*` tokens, a serif reading font, zero imports from the bank packages | [tj.html](https://salacoste.github.io/tinkoff-ui-kit/tj.html) |

Every showcase has a Russian twin under the same path with a `/ru/` prefix —
for example [`.../ru/bank.html`](https://salacoste.github.io/tinkoff-ui-kit/ru/bank.html);
the Russian landing is [`.../ru/`](https://salacoste.github.io/tinkoff-ui-kit/ru/).

## Works with your stack

- **React 18 / 19** — first-class: generated, typed wrappers from
  `pillkit-react` and `pillkit-tj-react`, with props, events and slots
  mapped the React way (the quick start below renders a button both ways on
  one page).
- **Vue, Svelte, Angular** — custom elements are native citizens in all
  three: register the modules once and use the tags in templates.
- **Vanilla JS and no-build static pages** — import an element module and
  write the tag; the published showcases are plain ESM pages with zero
  framework code.
- **Any CSS setup** — theming is plain CSS custom properties; token layers
  compose with utility frameworks, CSS modules, or whatever styling
  solution you already use.
- **SSR caveat** — web components hydrate on the client: the kit provides
  no server-side rendering of shadow trees, so plan for the element
  modules to upgrade the tags in the browser.

## Where to use it

Good fits:

- **Fintech product surfaces** — client portals, payments, onboarding
  funnels, dashboards.
- **Admin consoles and internal tools** — dense tables, forms and console
  patterns, including authorized zones.
- **Editorial and media** — long-read typography and article chrome from
  the T-Journal family.
- **Marketing landings** — token-driven theming and components that work
  on static pages.

Think twice if:

- you need **native-only mobile widgets** — this kit is web; wrap it in a
  WebView yourself or use platform kits;
- you need **the official T-Bank design system with its brand assets** —
  pillkit is an unofficial recreation and ships no T-Bank trademarks (see
  the disclaimer below).

## Quick start

> The recipe is verified verbatim: it was executed on a fresh project
> outside this repository and re-run by the release gates (v1.1.0 with the
> dedupe refinement, v1.2.0–v1.5.0 with the `devEngines` trap below).

Requirements: Node >= 20 and pnpm (arrives via the `packageManager` field +
corepack).

The kit is distributed **only through this GitHub repository**: it is an
independent study project, and the separately licensed fonts inside
`pillkit-tokens` make npm-registry distribution impractical — there will be
no publish, and `private: true` stays permanent across the packages (the
release model lives in [`RELEASE.md`](RELEASE.md)). The canonical install is
a pnpm workspace link from a checkout of the repository; pin a release tag
for reproducibility — `git clone --branch v1.9.0 …` or `git checkout v1.9.0`
in an existing checkout (tag = package version, see
[Versioning](#versioning-and-changelog)):

```bash
git clone https://github.com/salacoste/tinkoff-ui-kit
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app  # медленный реестр? добавьте --prefer-offline к pnpm install
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
```

The `pnpm init` trap (pnpm v12): `pnpm init` writes a
`devEngines.packageManager` block with a caret spec that the very next
`pnpm add` rejects — before installing the kit packages, remove the
`devEngines` block from the app's `package.json` (by key, not by
text-editing the whole file). Found by the release gates v1.2.0–v1.5.0.

For vite — three lines of dedupe (required): the workspace link hands the
bundler two physical copies of `react` (yours and the local copy from the
kit checkout), and without dedupe the React wrappers crash with "Invalid
hook call" (found by the v1.1.0 release gate on the current vite 8.3
patch):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
```

`index.html` — a button as a custom element and through the React wrapper:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <tk-button variant="primary">Как элемент</tk-button>
    <div id="root"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

`main.ts`:

```ts
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'pillkit-react';

createRoot(document.getElementById('root')!).render(
  createElement(Button, { variant: 'secondary' }, 'Через React-обёртку'),
);
```

Run `pnpm exec vite` and open http://localhost:5173 — both buttons render
and are styled by the kit's tokens. The token sheet is included once at the
document level; the dark theme is the `<html data-theme="dark">` attribute —
no markup edits, no inline styles. To update the kit: `git fetch --tags &&
git checkout vX.Y.Z` in the kit checkout, then rebuild
(`pnpm install && pnpm build`).

## Packages

| Package | Role |
|---|---|
| `pillkit-tokens` | Design tokens — layers of `--tk-*` custom properties: light base + dark overrides on `[data-theme="dark"]` |
| `pillkit-components` | The Lit custom-element core: 46 `tk-*` components and the shared overlay controller |
| `pillkit-react` | React wrappers generated from the Custom Elements Manifest (`@lit/react`) |
| `pillkit-tj-tokens` | T-Journal sub-kit tokens — `--tj-*` plus a native dark theme `[data-tj-theme="dark"]` |
| `pillkit-tj-components` | The T-Journal Lit core: editorial `tj-*` components |
| `pillkit-tj-react` | T-Journal React wrappers generated from the `pillkit-tj-components` CEM manifest |
| `pillkit-tj-fonts` | The T-Journal font carrier: XCharter, 4 woff2 styles under Bitstream Charter terms, plus the commented Graphik recipe; the single distribution point for T-Journal font bytes — the `pillkit-tj-*` code triple stays zero-fonts by test |
| `pillkit-docs` | Documentation — Storybook 10 (RU); a workspace service package, not meant for external consumption |
| `tests/` | Committed import-boundary and build-isolation guarantees for the AD-4 matrix (run as part of `pnpm test`) |
| `transitions/` | Vendored transitions.dev recipes (raw `t-*.css` + `_root.css`) — the motion source; kept in the repository and licensed separately (see [License](#license)) |

## Documentation

Full Storybook 10.6 docs are published at
[salacoste.github.io/tinkoff-ui-kit/storybook/](https://salacoste.github.io/tinkoff-ui-kit/storybook/)
— or run them locally:

```bash
pnpm install && pnpm --filter pillkit-docs dev   # Storybook (RU) на :6006
```

Inside: Getting Started (installation, theming, fonts), Token Reference
(light and dark side by side), the Theming Guide, API tables for all 56
components — 46 bank `tk-*` and 10 editorial `tj-*` — accessibility notes
and composition patterns. The component API contract — props, events,
controlled and uncontrolled modes, slots, and the theming grammar — is
specified in
[`packages/components/CONVENTIONS.md`](packages/components/CONVENTIONS.md).

Prefer to scroll a real page? Browse the
[family showcases](#one-kit-four-product-languages) or start from the
[landing](https://salacoste.github.io/tinkoff-ui-kit/).

## Fonts

The kit bundles licensed, renamed fonts as **separately licensed assets**:
**DaytonaSans** (renamed Neue Haas Unica W1G, © Monotype Imaging Inc.) and
**DaytonaPragma** (renamed Pragmatica, © ParaType, weights 400/500/700). The
fonts are distributed in the package under usage-and-rename contracts
concluded by the maintainer with Monotype and ParaType: those contracts
license **the maintainer** and **do not transfer with the package** — your
rights to the font files are defined solely by
[`LICENSE-FONTS.md`](packages/tokens/fonts/LICENSE-FONTS.md); the fonts are
**not covered by the MIT license** (the files live in
`packages/tokens/fonts/` and are loaded with a single
`import 'pillkit-tokens/daytona.css'` next to `tokens.css`; the original
copyright notices are preserved inside the font files). If your intended use
is not described in LICENSE-FONTS.md — do not redistribute the files further
and contact the maintainer. Without Daytona connected, the font slots
resolve to the open-source **Inter** (the recommended default alternative);
put your own brand font first in the slot stack.

The editorial T-Journal family has its own font model (the "split"): the
reading serif **is distributed by the kit itself** — the `pillkit-tj-fonts`
package ships **XCharter** in 4 styles (woff2, under the free Bitstream
Charter terms: use, copy, modify, sublicense, sell and redistribute with the
notice preserved; XCharter is the Charter idiom with Cyrillic, while the
original Bitstream Charter is Latin-only). The `--tj-font-reading` slot is
led by XCharter, so a single `import 'pillkit-tj-fonts/fonts.css'` next to
`pillkit-tj-tokens/tokens.css` is enough. The **Graphik** grotesque is
absent from the kit packages and will stay absent: the standard Commercial
Type EULA grants no redistribution rights for the files — license holders
use the commented `@font-face` recipe in
[`packages/tj-fonts/fonts.css`](packages/tj-fonts/fonts.css); without it the
slot resolves to Inter. Terms are in
[`packages/tj-fonts/LICENSE-FONTS.md`](packages/tj-fonts/LICENSE-FONTS.md);
the `pillkit-tj-*` code triple stays zero-fonts by test.

## Versioning and changelog

Versions are **git tags `v<X.Y.Z>` on `main`**; no registry is used — the
tag is the release marker (current: `v1.9.0`). Semantics are conventional:
breaking changes land only in majors; minors add components, tokens and
features, patches are fixes. Deprecations are announced in a minor via
[`CHANGELOG.md`](CHANGELOG.md) and `@deprecated` markers, and removal
happens no earlier than the next major. Release history —
[`CHANGELOG.md`](CHANGELOG.md).

## License

Repository code and documentation are [MIT](LICENSE) (© 2026 salacoste),
except three categories of files that are separately licensed and explicitly
excluded from MIT: the bank bundle fonts (`packages/tokens/fonts/` — terms
in [`LICENSE-FONTS.md`](packages/tokens/fonts/LICENSE-FONTS.md); the
`pillkit-tokens` package is mixed-license, `SEE LICENSE IN LICENSE`), the
T-Journal fonts (`packages/tj-fonts/fonts/` — XCharter under Bitstream
Charter terms, verbatim grant and attribution in
[`LICENSE-FONTS.md`](packages/tj-fonts/LICENSE-FONTS.md); the
`pillkit-tj-fonts` package is mixed-license), and the vendored
transitions.dev recipes (`transitions/` — upstream terms, distributed only
as part of the repository). The full scope — [LICENSE](LICENSE).

## Development

```bash
pnpm install && pnpm build && pnpm test   # зелёный baseline
pnpm lint                                 # typescript-eslint + AD-4 import boundaries
pnpm typecheck                            # TS 7 по корневым поверхностям (tests/, конфиги)
# Матрица AD-4 задана в ad4-matrix.mjs (единый источник для eslint, теста
# границ импорта и этой строки): allowed directions:
# components→tokens, react→components, tj-components→tj-tokens, tj-react→tj-components, docs→{react, components, tokens, tj-react, tj-components, tj-tokens, tj-fonts}
pnpm test:visual                          # визуальная регрессия + axe в обеих темах
```

CI runs the full chain on every push/PR: `lint` → `typecheck` → `build` →
`test` (unit + gen/tokens drift + zero-hardcoded + import boundaries +
preview + contrast) → `test:visual` (comparison mode against committed
cross-platform baselines, axe in both themes) → the impeccable design
detector over changed UI files; visual diffs are uploaded as artifacts on
failure.

pnpm 12.5.1 arrives via the `packageManager` field + corepack — a machine
with a local pnpm 11.x needs no manual upgrade. `pnpm-lock.yaml` is
intentionally a two-document YAML stream written by pnpm 12; do not "clean"
it into a single document.

### Tools

| Tool | Purpose |
|---|---|
| [BMAD Method v6](https://github.com/bmad-code-org/BMAD-METHOD) | AI-driven planning & delivery loop (PM → Architect → Dev → QA) |
| [impeccable](https://impeccable.style) | Design skills + anti-pattern detector (61 rules, hooks on every UI edit) |
| [transitions.dev](https://transitions.dev) | Copy-paste UI transitions (CSS / React) + agent skill |
| [inspo MCP](https://github.com/Nutlope/inspo) | 832 real production sites as design references for the agent |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | Browser automation: reference capture, a11y/dark-mode verification, E2E (no browser MCP by design) |

Workflows and commands — see `CLAUDE.md`.

---

**Ready to look closer?**
[Try the live showcase](https://salacoste.github.io/tinkoff-ui-kit/) ·
[Open the component docs](https://salacoste.github.io/tinkoff-ui-kit/storybook/) ·
[Get started](#quick-start) ·
[Browse the repository](https://github.com/salacoste/tinkoff-ui-kit)

> **Unofficial study project.** pillkit (tinkoff-ui-kit) is an independent
> recreation of the Tinkoff (T-Bank) design language, made strictly for study
> purposes. The project is not affiliated with T-Bank / TCS Holding, is not
> endorsed by them and is not connected to them in any way; no T-Bank
> trademarks are used in the published output, and the reference site serves
> only as a design benchmark source.
