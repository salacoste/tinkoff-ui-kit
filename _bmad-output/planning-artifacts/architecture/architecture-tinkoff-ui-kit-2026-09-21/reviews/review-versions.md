---
name: review-versions
type: review
lens: version-and-reality-check (web/npm verified, not asserted)
target: ../ARCHITECTURE-SPINE.md
reviewer: finalize reviewer (read-only)
date: 2026-09-21
verdict: pass-with-minor-revisions
---

# Review — stack versions & technology reality check

Method: every version below was read live from `registry.npmjs.org` dist-tags on 2026-09-21;
framework/addon claims cross-checked against current official docs and 2026-dated sources.

## Verified correct (no action)

| Spine row | Registry latest | Result |
| --- | --- | --- |
| TypeScript 7.0.2 | 7.0.2 | match |
| Lit 3.3.3 | 3.3.3 | match |
| @lit/react 1.0.8 | 1.0.8 | match |
| React (peer) 19.3.0 | 19.3.0 | match |
| Vite 8.3.0 | 8.3.0 | match (lib mode still documented at vite.dev — no deprecation signal) |
| Storybook 10.6.0 | 10.6.0 | match; `@storybook/web-components-vite@10.6.0` and `@storybook/addon-a11y@10.6.0` both at latest → Lit/WC stories + a11y addon confirmed for SB 10 (10.3 release notes, Apr 2026, doubled down on the a11y workflow) |
| pnpm 12.5.1 | 12.5.1 | match |
| @axe-core/playwright 4.13.0 | 4.13.0 | match |

Multi-package Vite lib mode for Lit (claim 2): no red flag — library mode remains a
first-class documented feature in current Vite docs; per-package lib builds with externalized
workspace deps are standard pnpm-workspace practice. Web evidence skews 2023-era tutorials,
but nothing indicates Vite 8 changed this; lockfile at scaffold owns the final proof.

## Findings

### F1 — Vitest row is unpinned; current stable is 5.0.1 (minor)
`Vitest | latest stable at scaffold` defers a decision the seed can make now.
Registry: `latest = 5.0.1` (just released — beta.7/rc.4 were recent; the seasoned prior major
is `V4 = 4.1.11`). **Fix:** pin `5.0.1` in the Stack table, or deliberately `4.1.11` if the
scaffold should ride the mature line; state which and why in one clause.

### F2 — AD-8 hand-rolls pixelmatch that Playwright already embeds (minor)
Playwright's built-in `await expect(page).toHaveScreenshot()` compares via pixelmatch under
the hood and accepts `maxDiffPixelRatio`; the spine's "1.5% perceptual diff threshold" maps
directly to `maxDiffPixelRatio: 0.015`, with Playwright's baseline-update workflow
(`--update-snapshots`) covering AD-8's re-approval flow for free. A standalone pixelmatch
dependency (latest 7.2.0, unpinned in the spine) adds buffer plumbing without new capability.
**Fix:** prefer `toHaveScreenshot` + `maxDiffPixelRatio: 0.015`; keep pixelmatch only if a
documented need for manual buffer diffs survives review, and then pin `7.2.0`.

### F3 — Tech named without versions (minor)
- **Playwright** itself: the Stack row pins only axe. Current latest `1.63.0`
  (`@playwright/test` same). Add it.
- **@lit-labs/ssr** (AD-10): unpinned; latest `4.1.0`. Still `-labs` = experimental, so the
  spine's "experimental — verified 2026-09" characterization holds; fine to leave deferred,
  but record `4.1.0` as the checked version.
- **CEM generation**: AD-1 requires a Custom Elements Manifest but names no generator.
  Add `@custom-elements-manifest/analyzer` (`0.11.0` latest) to the stack so the `react`
  package has a concrete input at scaffold.

### F4 — transitions.dev inside shadow roots: adaptable, one real limitation (minor)
Confirmed from the vendored skill (`.claude/skills/transitions-dev/SKILL.md`, `_root.css`):
recipes are plain CSS with `t-*` class hooks and semantic custom properties — custom
properties inherit through shadow boundaries, so AD-9's plan is sound. Limitation: `_root.css`
tokens and the per-snippet dark overrides are written as `:root { … }` /
`html[data-theme="dark"] { … }` selectors, which **do not match inside a shadow-root
stylesheet** (no `html` ancestor in the shadow tree). **Fix:** never paste `_root.css` verbatim
into components — fold its motion-token scale into the AD-3 tokens package (inherited custom
properties) and re-express the snippets' dark color overrides as theme-swapped custom
properties, not html-descendant selectors. Also note ~17 recipes ship JS orchestration using
document-level `querySelector`/`getComputedStyle` — adapt selectors to shadow scope when porting.

## Verdict

**Pass with minor revisions.** Every pinned version is real, current, and mutually compatible;
the two load-bearing integration claims (SB 10 + WC/a11y; Vite 8 lib mode) check out. Apply
F1–F3 to the Stack table before scaffold; carry F4 into the AD-9 build notes.

## Sources

- npm registry dist-tags (queried 2026-09-21): typescript, lit, @lit/react, react, vite,
  storybook, @storybook/web-components-vite, @storybook/addon-a11y, pnpm, vitest, pixelmatch,
  playwright, @playwright/test, @lit-labs/ssr, @custom-elements-manifest/analyzer,
  @axe-core/playwright
- [Storybook 10.3 release notes (a11y workflow)](https://storybook.js.org)
- [Vite docs — Build Options / Library Mode](https://vite.dev)
- [Playwright docs — toHaveScreenshot (pixelmatch-based)](https://playwright.dev)
- Local: `.claude/skills/transitions-dev/SKILL.md` + `_root.css` (shadow-root selector evidence)
