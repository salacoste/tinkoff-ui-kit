# SM-6 self-test — fresh consumer renders Button (Story 5.7 proof)

**Date:** 2026-09-23 · **Runner:** autonomous story 5.7 (publish prep) ·
**Session:** `PLAYWRIGHT_CLI_SESSION=tinkoff-ui`

## Setup (fresh consumer OUTSIDE the repo)

- Workspace root: `mktemp -d /tmp/sm6-self-test.XXXXXX` →
  `/tmp/sm6-self-test.dRuDaB` (cleaned up after the run; app sources kept in
  `consumer-app/` here as the verbatim copy).
- Kit checkout: `git clone <repo> tinkoff-ui-kit` inside the tmp dir at **HEAD
  `f0b2e6f`** (Story 5.6 commit). Deviation from the README's `https://`
  clone, recorded here: cloning the same repository from the local path
  avoids depending on unpushed state; the resulting tree is byte-identical to
  a GitHub clone of `main@f0b2e6f`. Everything downstream follows the README
  recipe line-by-line.

## Recipe as executed (identical to root README «Быстрый старт»)

```bash
git clone https://github.com/salacoste/tinkoff-ui-kit   # ← local-path clone, see above
mkdir my-app && cd my-app
pnpm init
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - .
  - ../tinkoff-ui-kit/packages/*
EOF
cd ../tinkoff-ui-kit && pnpm install && pnpm build && cd ../my-app
pnpm add -w pillkit-components pillkit-react pillkit-tokens --workspace
pnpm add -w react@19.3.0 react-dom@19.3.0
pnpm add -w -D vite
# index.html + main.ts exactly as the README shows them
pnpm exec vite
```

## FINDING (fixed in the same story)

The recipe originally documented `pnpm add …` WITHOUT `-w`. On pnpm 12.5.1
(and 11.x — the consumer ran 11.20.0) this fails hard:

```
ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the
workspace root … make it explicit with -w
```

my-app is simultaneously the workspace root and the app (yaml lists `.`), so
every `pnpm add` needs `-w`. **README and the getting-started story were both
corrected to the `-w` form in this story** — README recipe and tested recipe
are identical again. This failure is exactly what SM-6 exists to catch: the
5.5-documented recipe had never been executed verbatim until now.

## Build + link results

- Kit: `pnpm install` (1.4s, lockfile-frozen) → `pnpm build` — all four
  packages green (tokens/components/react/docs, Storybook build included).
- Consumer links: `pillkit-{components,react,tokens} 0.0.0 <- ../tinkoff-ui-kit/packages/*`.
- Dev server: vite 8.3.0, HTTP 200.

## Rendering evidence (this directory)

- `render-both-buttons.png` — screenshot of http://localhost:5199: both
  buttons visible, primary yellow pill + secondary outline.
- `snapshot.yml` — accessibility snapshot: `button "Как элемент"` (custom
  element, ref e3) and `button "Через React-обёртку"` (React wrapper,
  ref e7).
- `console.log` — the only error is a `favicon.ico` 404 (inert); the warning
  is Lit's dev-mode notice (dev server, expected). No kit errors.

## DOM assertions (playwright-cli eval)

| Assertion | Result |
|---|---|
| `document.querySelectorAll('tk-button')` | **2** (element + wrapper's) |
| `customElements.get('tk-button')` | defined (`import 'pillkit-components'` registers) |
| React wrapper mounted into `#root` | `#root tk-button` present |
| `variant` reflection | `primary` / `secondary` on the two elements |
| Token sheet applied at document level | `--tk-color-surface-base` = `#fff` |
| Primary pill (token-driven, `::before`) | `rgb(255, 221, 45)` = #FFDD2D |
| Dark flip (`data-theme="dark"`) | surface → `#1a1a1a`, pill stays #FFDD2D |
| Geometry | first button 273×48 (card scale = 48px height, ≥44px target) |

Accessible names come from slotted labels (the inner `<button>` textContent is
empty by design — the label projects through the slot; names confirmed in the
snapshot).

## Verdict

**PASS.** A fresh consumer following the root README quickstart verbatim
renders `tk-button` (a) as a custom element and (b) via the React wrapper,
themed by the kit's tokens in both themes. The one recipe defect found
(missing `-w`) was fixed in README + getting-started before this note was
finalized.
