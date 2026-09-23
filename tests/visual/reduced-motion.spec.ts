import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl, readStoryIds, THEMES } from './stories';

/**
 * REDUCED-MOTION ZERO-ANIMATION GUARD (spec 5.1–5.3, check 6 of the a11y
 * sweep — `.playwright-cli/verify/a11y-sweep/METHOD.md`).
 *
 * PLACEMENT DECISION (recorded per the spec's Implementation Notes): the
 * guard lives in the Playwright visual lane (tests/visual/*.spec.ts), NOT
 * the vitest `pnpm test` lane — it needs the built-docs webServer the
 * playwright.config.ts pins, and `pnpm test:visual` is already a CI gate
 * (ci.yml), so CI runs it with zero workflow edits. Any *.spec.ts under
 * tests/visual is auto-collected (config testMatch).
 *
 * Every discovered story (the same index the visual suite reads) × BOTH
 * themes runs under `prefers-reduced-motion: reduce` emulation and must
 * settle to ZERO animations:
 *
 * - `document.getAnimations()` is empty (CSS animations AND transitions,
 *   including pseudo-element and shadow-tree animations — they all share
 *   the document timeline). Infinite animators that ignore reduce — the
 *   ProgressBar indeterminate sweep, button spinners, skeleton shimmers —
 *   PERSIST in that list and fail the guard. They are findings to FIX,
 *   never filter (the spec's explicit nuance).
 * - A COMPUTED-STYLE sweep backs the timeline read: every element in every
 *   root under the story canvas (#storybook-root) must be MOTIONLESS under
 *   reduce — `animation-name: none`, or an animation whose duration
 *   collapsed to 0s via the token layer (instant, never on the timeline —
 *   the tooltip css header's documented ruling); and every
 *   `transition-duration` must have collapsed to 0s (the token layer
 *   re-declares ALL --tk-motion-duration-* to 0ms under the media query —
 *   a non-zero duration means a token bypass or a hard-coded duration).
 *   This catches animators that never started (display:none subtrees) which
 *   the timeline alone cannot see. Inert unprojected nodes (all longhands
 *   resolve '') are skipped — nothing can animate there.
 *
 * The context already pins reducedMotion: 'reduce' (the capture env);
 * emulateMedia restates it per-page so the spec is correct even if that
 * pin ever changes.
 *
 * SETTLE-WINDOW RESIDUAL (known bound): a LATE-MOUNTING animator — an
 * element inserted AFTER the 300ms settle window — escapes the timeline
 * read, and is caught by the computed-style half only once it is in the
 * DOM the sweep walks. CI runs the suite once per push, so the residual
 * case is a story that mounts animated content on a timer beyond 300ms;
 * no such story exists (all mounts are first-paint), and any that appears
 * with a >0s duration fails the computed half the moment it renders.
 */

/** Settle wait — same contract as visual.spec.ts (children or error display). */
async function waitForStorySettled(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root');
      return (
        (root?.childElementCount ?? 0) > 0 ||
        document.body.classList.contains('sb-show-errordisplay')
      );
    },
    undefined,
    { timeout: 15_000 },
  );
}

interface MotionSweep {
  liveAnimations: string[];
  animatingElements: string[];
  transitioningElements: string[];
}

/**
 * The deep motion sweep: every element of every KIT-PAINTED surface — the
 * story canvas (#storybook-root; the viewMode=story iframe renders ONLY the
 * story there), the toast stacking host and the overlay root
 * (#tk-toast-stack / #tk-overlay-root — self-enqueueing and
 * controller-mounted surfaces live on <body>, OUTSIDE the canvas), and
 * same-origin iframe previews (the navbar mobile story nests iframes) —
 * plus every shadow tree under each, read in ONE evaluate (serialization
 * keeps only offenders). Storybook's own hidden template chrome outside
 * these roots (div.sb-loader, sb-previewBlock_icon — probed: display:block
 * but never rendered, zero client rects) carries decorative sb-* animations
 * that can never run; the kit surfaces are the guard's scope.
 */
function sweepMotion(page: Page): Promise<MotionSweep> {
  return page.evaluate(() => {
    const describe = (el: Element): string => {
      const tag = el.tagName.toLowerCase();
      const cls = el.getAttribute('class') ?? '';
      const id = el.id ? `#${el.id}` : '';
      const rootHost = el.getRootNode();
      const host =
        rootHost instanceof ShadowRoot && rootHost.host instanceof Element
          ? `${rootHost.host.tagName.toLowerCase()}|`
          : '';
      return `${host}${tag}${id}${cls ? `.${cls.split(/\s+/).join('.')}` : ''}`;
    };
    const liveAnimations = document.getAnimations().map((animation) => {
      // KeyframeEffect carries the target; pseudo-element animators are the
      // '(pseudo)' arm (their targets are not Elements).
      const target = (animation.effect as KeyframeEffect | null)?.target;
      return `${animation.constructor.name}:${target ? describe(target) : '(pseudo)'}`;
    });
    const animatingElements: string[] = [];
    const transitioningElements: string[] = [];
    const walk = (root: ParentNode): void => {
      for (const el of root.querySelectorAll('*')) {
        const style = getComputedStyle(el);
        // Inert nodes (slotted content outside any rendered flat tree)
        // resolve EVERY longhand to '' — nothing can animate there.
        if (style.animationName === '') continue;
        // An animation that keeps its NAME but collapses to 0s under reduce
        // (the token layer) is motionless: it applies instantly and never
        // reaches the timeline. Only a NON-ZERO duration is real motion —
        // a hard-coded duration or a token the reduce layer missed.
        if (
          style.animationName !== 'none' &&
          style.animationDuration
            .split(',')
            .some((duration) => Number.parseFloat(duration) > 0)
        ) {
          animatingElements.push(`${describe(el)} (${style.animationName} ${style.animationDuration})`);
        }
        // transitionDuration serializes per-property: '0s' or '150ms, 0s'.
        if (
          style.transitionDuration !== '' &&
          style.transitionDuration
            .split(',')
            .some((duration) => Number.parseFloat(duration) > 0)
        ) {
          transitioningElements.push(describe(el));
        }
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    // The document-level sweep entry points; each walked document reports
    // which seeds it found so a MISSING seed fails loudly below (a silent
    // skip would hollow the guard).
    const seedsFound: string[] = [];
    const sweepDocument = (doc: Document, label: string): void => {
      const seeds = doc.querySelectorAll('#storybook-root, #tk-toast-stack, #tk-overlay-root');
      for (const seed of seeds) {
        seedsFound.push(`${label}${seed.id ? `#${seed.id}` : seed.tagName.toLowerCase()}`);
        walk(seed);
      }
      // Same-origin iframe previews (navbar mobile nests them): their
      // documents paint kit content the top document never reaches.
      for (const frame of doc.querySelectorAll('iframe')) {
        const nested = frame.contentDocument;
        if (nested) sweepDocument(nested, `${label}${frame.name || 'iframe'}>`);
      }
    };
    sweepDocument(document, '');
    // LOUD failure: a document with none of the seeds is a harness-shape
    // change (Storybook renamed the root, the stacks moved) — the guard
    // must never degrade into a vacuous zero-offender pass.
    if (seedsFound.length === 0) {
      throw new Error(
        'reduced-motion sweep found no walk seeds (#storybook-root / #tk-toast-stack / #tk-overlay-root) — the harness shape changed; adapt the seed list, never ship a silent empty sweep',
      );
    }
    return { liveAnimations, animatingElements, transitioningElements };
  });
}

/** Discovery — a missing/empty index is a loud failure (stories.ts mold). */
let storyIds: string[];
try {
  storyIds = readStoryIds();
} catch (error) {
  test('story index is built before the reduced-motion suite runs', () => {
    throw error;
  });
  storyIds = [];
}

for (const id of storyIds) {
  for (const theme of THEMES) {
    test(`reduced motion: zero animations — ${id} [${theme}]`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(buildStoryUrl(id, theme));
      await waitForStorySettled(page);
      // Capture-side theme assertion (visual.spec.ts's dark-URL lesson).
      if (theme === 'dark') {
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      }
      // Settle window: any entrance transition (0ms under reduce) and every
      // mount animation commits before the sweep reads the timeline. 300ms is
      // generous against 0ms tokens — an animator that appears AFTER this
      // window is a started-late animation and shows up in a re-run.
      await page.waitForTimeout(300);
      const sweep = await sweepMotion(page);
      expect(
        sweep.liveAnimations,
        `${id} [${theme}]: animations alive after settle under reduce (constructor:element)`,
      ).toEqual([]);
      expect(
        sweep.animatingElements,
        `${id} [${theme}]: elements resolving a non-none animation-name under reduce (the reduce guard is missing)`,
      ).toEqual([]);
      expect(
        sweep.transitioningElements,
        `${id} [${theme}]: elements with a non-zero transition-duration under reduce (token bypass / hard-coded duration)`,
      ).toEqual([]);
    });
  }
}
