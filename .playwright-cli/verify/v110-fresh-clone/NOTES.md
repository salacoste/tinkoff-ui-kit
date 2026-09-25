# v1.1.0 fresh-clone release gate (RELEASE.md §8.4) — executed 2026-09-25

Consumer: `git clone --depth 1 --branch v1.1.0` → e09fd3c; pnpm-workspace link
(my-app + `../tinkoff-ui-kit/packages/*`); kit `pnpm install && pnpm build`;
my-app on vite ^8.3.0 (current patch), react/react-dom 19.3.0. App: the §8.4
recipe verbatim (index.html + main.tsx, `DataTable` via the React wrapper).

## Result — GATE PASSED (with two recipe amendments, below)

| §8.4 check | Evidence |
|---|---|
| Clone by tag | e09fd3c |
| Workspace link | pillkit-{tokens,components,react} resolve via ../tinkoff-ui-kit/packages/* |
| Kit build | pnpm build green |
| Consumer bundle | vite build: index 0.31 kB, css 5.52 kB, js 494.55 kB |
| DataTable mounts via React wrapper | tk-data-table in DOM, **0 console errors** |
| Two-line cells | «Сбербанк / SBER», «ЛУКОЙЛ / LKOH» |
| Delta colors | light: +1,2% rgb(22,136,33), −0,8% rgb(196,11,8); dark green rgb(57,181,74) |
| Row = link | a[href="#sber"], a[href="#lkoh"]; Enter → location.hash |
| APG keyboard | ArrowDown: [0,-1]→[-1,0]; Home: →[0,-1]; End (focus in table): →[-1,0] |
| Dark theme | `<html data-theme="dark">`: .row__link #333→#fff, delta → dark pair |
| Screenshots | render-light.png, render-dark.png |

## Amendment 1 — vite.config.ts dedupe (REQUIRED on the current vite patch)

Without `resolve.dedupe: ['react','react-dom']` the app does not mount: vite's
optimizer pre-bundles @lit/react (found under the kit's
packages/react/node_modules) against the KIT's local react copy while
react-dom pairs with my-app's copy — the wrapper's hooks read the wrong
copy's internals:

```
TypeError: Cannot read properties of null (reading 'useRef')
  at exports.useRef (react.js?v=f5502223)
  at DataTable (@lit_react.js?v=1965f34c)
  at renderWithHooks (react-dom_client.js?v=104870ff)
(+ console: «Invalid hook call … 3. You might have more than one copy of React»)
```

Affects dev AND `vite build`. SM-6 (v1.0.0, 2026-09-23) passed the SAME mold
with NO config — vite ^8.3.0 patch drift, not a kit defect: packages/react
layout (peer+dep react, devDep react-dom) is identical across both tags and
the wrapper tests are green in CI. Fix = recipe documentation: README
quick-start and RELEASE.md §8.4 now carry the 3-line config.

## Amendment 2 — dark theme attribute goes on `<html>`

tokens.css dark overrides match `html[data-theme="dark"]` / `:host(...)` —
setting data-theme on an arbitrary wrapper div does NOT flip tokens
(verified: identical computed-color maps before/after). The README already
documented `<html data-theme="dark">`; the §8.4 recipe text now says the same.

## Transcript highlights

1. Run 1 — script bug (my-app created INSIDE the clone, not a sibling):
   ERR_PNPM_WORKSPACE_PACKAGE_NOT_FOUND; exit 0 was `tail`'s, not the gate's.
   Fixed to the verbatim recipe.
2. Run 2 — `vite build` OK; static serve → dual-React crash (build mode).
3. Run 3 — dev server per recipe → same crash (dev mode, trace above).
4. Run 4 — + vite.config.ts dedupe → mounts clean; full checklist green.
5. End-key first miss had focus on body (key went to the page — page-side,
   not a component issue); re-tested with focus inside the table: works.
