# Visual regression harness (Story 1.6)

Playwright suite that generates its own tests from the **built docs bundle** and
locks every story's pixels in **both themes**, plus an axe a11y audit per story
per theme. This directory is the single baselines root and the process doc for
the baseline workflow (AD-8).

## Layout

| File | Role |
|------|------|
| `visual.spec.ts` | The suite — one visual test + one axe test per story × theme, generated from `index.json` |
| `button.spec.ts` | Component LAYOUT assertions only Playwright can make (loading width-freeze with real layout; compact 44px element box vs 32px pill) — same webServer, same built bundle |
| `stories.ts` / `stories.test.ts` | Story discovery + theme-URL builder, and its vitest unit tests (`*.test.ts` belongs to vitest; Playwright runs `*.spec.ts` only) |
| `inter.css` / `inject.ts` | Font determinism — both `--tk-font-*` slots overridden to locally-served Inter |
| `serve.mjs` | Zero-dep static server mounting `packages/docs/dist` at `/` and `@fontsource/inter` at `/inter` (started by `playwright.config.ts` `webServer`) |
| `run.mjs` | `test:visual` runner — portable baseline preflight: any baseline PNG present → compare mode; none → `--update-snapshots` |
| `visual.spec.ts-snapshots/` | **Committed baselines** — the initial truth, never regenerated silently |

## Running

```sh
pnpm exec playwright install chromium   # once per machine
pnpm test:visual                        # builds docs → serves dist → runs the suite
pnpm test:visual:update                 # same, but (re)writes baselines — see workflow below
```

`pnpm test:visual` detects baseline-creation mode itself (via `run.mjs`): with
no baselines on disk (fresh checkout) it runs once with `--update-snapshots`
(writes them, exits 0); with baselines present it runs in compare mode, where
any missing or drifted baseline **fails**.

**Stale-dist warning:** invoking `playwright test` directly serves whatever
currently sits in `packages/docs/dist` — after editing story sources that is a
STALE bundle, and you would baseline yesterday's pixels. Prefer
`pnpm test:visual` / `pnpm test:visual:update`, which build docs first; if you
must call Playwright directly (e.g. to target a single story), build first:

```sh
pnpm --filter @tk-kit/docs build && pnpm exec playwright test -g "tokens--swatches"
```

`test:visual` is **deliberately NOT wired into `pnpm test`** — CI runs it as
its own step (Story 1.8). It also runs only the chromium project (v1 scope).
Baseline names are **platform-neutral** (Story 1.8, closing the 1.6 defer):
`playwright.config.ts` pins `snapshotPathTemplate` without the `{platform}`
placeholder, so baselines are `<arg>-chromium.png` and the SAME committed files
compare on macOS and the Linux CI runner — the pinned capture environment
above (fixed viewport/DSF, reduced motion, locally-served Inter, animations
disabled) is what makes cross-platform pixels comparable. The `{-projectName}`
key is kept so a second browser project would get its own baselines instead of
overwriting chromium's.

## Pinned capture environment

Every run captures under identical conditions — that is what makes the 1.5%
threshold meaningful (FR-10, AD-8):

- **Viewport 1280×800, `deviceScaleFactor: 1`** — fixed raster grid.
- **`reducedMotion: 'reduce'`** — the token sheet's own `prefers-reduced-motion`
  layer collapses all `--tk-motion-duration-*` to `0s`; no transition can be
  caught mid-flight. `toHaveScreenshot` additionally passes `animations: 'disabled'`.
- **`colorScheme: 'light'`** — the kit themes itself via `data-theme` tokens,
  not the OS scheme; the OS input is pinned anyway.
- **Inter as the deterministic test font** — the kit's font slots default to a
  system stack (the reference brand font is proprietary and deliberately
  unbundled), and system stacks raster differently per machine. `inject.ts`
  injects `inter.css` after load: `@font-face`s for the exact weights the type
  scale uses (400/500/700, latin subset) served **locally** from
  `node_modules/@fontsource/inter` by `serve.mjs` (no network fetch), plus a
  `:root` / `:root[data-theme='dark']` override of `--tk-font-heading` and
  `--tk-font-body`. The suite then awaits `document.fonts.load()` for each
  weight and `document.fonts.ready` before capture.
- **Normalized font rasterization** (Story 1.8) — chromium launch args
  `--font-render-hinting=none --disable-lcd-text` (playwright.config.ts): the
  same Inter woff2 otherwise rasters differently under macOS CoreText vs Linux
  FreeType hinting/subpixel AA — measured 2–3% pixel diff on text-heavy
  stories, tripping the 1.5% threshold on CI. With hinting off and LCD text
  disabled, the committed baselines compare identically on both platforms;
  the threshold itself is unchanged.
- **Canvas-element capture** — each story is loaded as the preview canvas
  itself (`iframe.html?id=<id>&viewMode=story`, the manager chrome never
  enters the shot); dark adds `&globals=theme:dark`, the exact URL-persisted
  form of the toolbar Theme control proven in 1.5. The screenshot target is the
  iframe `<body>` (full story height, taller-than-viewport canvases are
  stitched). A story that misrenders shows Storybook's error display instead —
  `body` collapses to zero height there (all error blocks are `position:fixed`),
  so in that state the error display is the capture target.
- **Threshold** — `maxDiffPixelRatio: 0.015` (OQ-6): forgiving of sub-pixel
  antialias noise, tight enough that any real component change trips it.

### Story discovery

The suite reads `packages/docs/dist/index.json` — the Storybook 10 static story
index. Emitted shape (format-pinned: the reader rejects any `v` other than 5
with an adapt-the-reader message, so a future Storybook format change surfaces
as itself, not as "no stories"): `{ "v": 5, "entries": Record<id, { type,
subtype, id, name, title, importPath, tags, exportName }> }`; entries with
`type: "story"` become tests (sorted for stable order). Whatever Storybook
builds is what gets tested — new stories appear with **zero harness edits**. A
missing, unparseable or story-less index fails loudly with "build docs first"
guidance (also covered by `stories.test.ts`).

### Error-display refusal

A story that renders Storybook's error display (`body.sb-show-errordisplay`)
fails the suite in compare AND update modes — a broken story must never quietly
become a green error-page baseline the harness then "protects". There is NO
allowlist: the single historical exception (`tokens--groups`, the 1.6 tokens
demo's misindexed data export) was removed WITH the demo at Story 1.7, and
nothing has replaced it.

## Baseline workflow (AD-8)

**Kit-vs-kit, never site-vs-kit (OQ-2).** The reference brand font is
unbundled and `.playwright-cli/` site captures are full-page shots of
tinkoff.ru chrome — they cannot be pixel-diffed against kit renders. Baselines
are the first approved render of the KIT itself, compared against later kit
renders only. Reference fidelity for a component baseline (from 1.7, Button) is
a human side-by-side against the site capture, attached to the baseline PR.

1. **Creating / adding baselines** (new story, or first run):
   `pnpm test:visual:update`, review the written PNGs, commit them in the same
   change as the story. To re-approve a single story instead of the whole
   suite, target it by title with `-g`:
   `pnpm --filter @tk-kit/docs build && pnpm exec playwright test --update-snapshots -g "tokens--swatches"`.
   A story id in `index.json` with no baseline fails the suite naming the
   story — absence is loud, never silent.
2. **Removing a story = removing its baselines:** delete the story's baseline
   PNGs (and any harness references — allowlist/exclusion entries, membership
   test assertions) in the SAME change that removes the story — orphaned
   baselines are review blockers. DONE at Story 1.7: the tokens demo's stories
   (`tokens--groups`, `tokens--swatches`) went with their 4 baseline PNGs, the
   error-state allowlist, and the `.tksw-chip` axe exclusion (removal rule
   exercised end-to-end).
3. **Provisional rule (autonomous runs):** baselines generated while no
   maintainer is present are PROVISIONAL — the capture is archived, the
   automated drift check runs on every later change, and the maintainer
   confirms on return (formalized in Story 5.5).
4. **Human side-by-side gate at creation:** a baseline enters `main` only with
   a maintainer looking at the rendered story next to the baseline image.
5. **Intentional change = baseline re-approval in the same PR:** when a change
   deliberately alters pixels, run `pnpm test:visual:update`, commit the new
   baseline WITH the change, and call it out in the PR description. A baseline
   update traveling alone — without the code that changed the pixels — is a
   review blocker. Unintentional drift (>1.5% of the canvas) fails with a diff
   attachment; fix the code, not the baseline.

## Axe checks

Every story runs `@axe-core/playwright` in both themes with the WCAG tag filter
(`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`); zero violations passes, failures
report rule ids + node selectors. No story carries an exclusion — the single
historical one (the 1.6 demo's `.tksw-chip` color-only swatches) was removed
with the demo at Story 1.7, so every element of every story is audited in both
themes.
