import { defineConfig } from 'playwright/test';

/**
 * Visual regression harness config (spec 1.6) — the PINNED CAPTURE ENVIRONMENT.
 *
 * Every knob here exists to make pixels comparable across runs (spec Boundaries):
 * - viewport 1280x800 + deviceScaleFactor 1 — fixed raster grid, no HiDPI variance
 * - reducedMotion 'reduce' — motion tokens collapse to 0s (the token sheet's own
 *   prefers-reduced-motion layer), so no transition can be caught mid-flight
 * - colorScheme 'light' — the kit themes itself via `data-theme` tokens, NOT the
 *   OS scheme; pinning the OS side removes one more input
 * - font determinism — handled per-story by tests/visual/inject.ts, which
 *   overrides both --tk-font-* slots to locally-served DaytonaSans (the
 *   bundled licensed rename of Neue Haas Unica W1G; Inter the loaded fallback
 *   — see fonts.css)
 * - font rasterization — chromium launch args below (hinting off, no LCD
 *   subpixel AA) make the SAME woff2 raster identically on macOS and Linux
 *   (Story 1.8: unflagged CoreText vs FreeType differed by a measured 2–3%,
 *   tripping the 1.5% threshold on text-heavy stories)
 *
 * The webServer mounts the BUILT docs bundle (packages/docs/dist) plus the
 * DaytonaSans font files (packages/tokens/fonts) and @fontsource/inter on one
 * fixed port via tests/visual/serve.mjs — zero
 * network fetches during capture. `pnpm test:visual` builds docs first.
 *
 * Baselines live in the per-spec snapshots directory under tests/visual/
 * (single baselines root), named via `snapshotPathTemplate` WITHOUT the
 * `{platform}` placeholder (Story 1.8, closing the 1.6 defer): baselines are
 * `{arg}-{projectName}.png`, so the same committed files compare on every OS —
 * the pinned capture env (fixed viewport/DSF, reduced motion, locally served
 * DaytonaSans/Inter, animations disabled) is what makes pixels comparable
 * cross-platform. The
 * `{-projectName}` key stays so a second browser project would get its own
 * baselines instead of silently overwriting chromium's. Baseline workflow:
 * tests/visual/README.md.
 */
const PORT = 6007;

export default defineConfig({
  testDir: 'tests/visual',
  // Platform-neutral baseline names (Story 1.8): the default template appends
  // `-{platform}` (e.g. -darwin / -linux), which would fork the baseline set
  // per OS. Dropping it (keeping the {-projectName} key) makes the committed
  // baselines THE cross-platform truth; the pinned capture env above is what
  // licenses that. Renaming regenerates nothing: the PNG bytes are unchanged.
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}',
  // Pinned worker counts: 1 in CI (no raster contention on shared runners),
  // 2 locally — deliberate, reproducible parallelism for stitched captures.
  workers: process.env.CI ? 1 : 2,
  // tests/visual/ is shared by two runners: vitest owns *.test.ts (unit tests
  // for the harness helpers, root vitest.config.ts glob) and Playwright owns
  // *.spec.ts (this suite). Restrict testMatch so each file runs exactly once.
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  },
  expect: {
    // Screenshot comparisons can retry and stitch tall story canvases — give
    // them more headroom than the 5s assertion default.
    timeout: 15_000,
    // SINGLE source of truth for screenshot options — the spec calls
    // toHaveScreenshot() bare; inline call-site options would silently win on
    // drift. Threshold 0.015 (OQ-6): forgiving of sub-pixel antialias noise,
    // tight enough that any real component change trips it.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.015,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  webServer: {
    command: `node tests/visual/serve.mjs ${PORT}`,
    // Readiness probe: the story index the suite discovers from.
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    // Chromium only in v1 (spec); viewport/DSF/motion come from `use` above.
    // Launch args pin FONT RASTERIZATION (Story 1.8): macOS CoreText and Linux
    // FreeType hint/antialias the same woff2 (DaytonaSans/Inter) differently
    // enough to trip the 1.5% threshold (measured 2–3% on text-heavy stories).
    // Hinting off +
    // no LCD subpixel AA normalizes glyph rendering cross-platform WITHOUT
    // touching the threshold — the gate stays exactly as tight.
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--font-render-hinting=none', '--disable-lcd-text'],
        },
      },
    },
  ],
});
