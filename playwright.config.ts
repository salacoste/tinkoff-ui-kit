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
 *   overrides both --tk-font-* slots to locally-served Inter (see inter.css)
 *
 * The webServer mounts the BUILT docs bundle (packages/docs/dist) plus the
 * @fontsource/inter files on one fixed port via tests/visual/serve.mjs — zero
 * network fetches during capture. `pnpm test:visual` builds docs first.
 *
 * Baselines live in the Playwright default per-spec snapshots directory under
 * tests/visual/ (single baselines root). Baseline workflow: tests/visual/README.md.
 */
const PORT = 6007;

export default defineConfig({
  testDir: 'tests/visual',
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
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
