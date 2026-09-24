import AxeBuilder from '@axe-core/playwright';
import type { Page } from 'playwright/test';

/**
 * Axe re-entrancy guard (deferred-work ledger, gate class; occurrences
 * 2026-09-22..24 — 5.5 / 5.7-prep / gate-1 / 7.2-merge rounds): the visual
 * suite's axe legs die with «Axe is already running» on ~7 random legs per
 * run — always stories the run never touched, isolated re-runs always green.
 *
 * TWO drivers share the preview frame's `window.axe` re-entrancy flag: this
 * harness's injected runPartial AND Storybook's own bundled axe
 * (`/assets/axe-*.js`, the a11y addon's preview-side auto-run) — the error
 * stack resolves into the SERVED bundle, not our injected source. A
 * per-process promise chain removes the harness's self-overlap; the addon's
 * co-driver is raced-out by WAITING for its run to finish and retrying.
 *
 * Each worker process imports this module fresh, so the chain serializes
 * exactly the analyze() calls that can share a page; distinct workers own
 * distinct pages and stay parallel. Visual legs never touch axe.
 */

let axeTurn: Promise<unknown> = Promise.resolve();

/** Chain one analyze() behind the previous one in this worker; a rejected
 *  leg must not wedge the chain (swallowed for the chain only — the caller
 *  still sees the real failure). */
function chained(run: () => Promise<unknown>): Promise<unknown> {
  const turn = axeTurn.then(run);
  axeTurn = turn.then(
    () => undefined,
    () => undefined,
  );
  return turn;
}

const AXE_BUSY = /Axe is already running/;
const AXE_BUSY_ATTEMPTS = 5;

/** analyze() with the chain + busy-retry (the co-driver's run window). */
export async function analyzeAxe(
  page: Page,
  tags: readonly string[],
): Promise<Awaited<ReturnType<AxeBuilder['analyze']>>> {
  for (let attempt = 0; ; attempt++) {
    try {
      return (await chained(
        () => new AxeBuilder({ page }).withTags([...tags]).analyze(),
      )) as Awaited<ReturnType<AxeBuilder['analyze']>>;
    } catch (error) {
      if (attempt >= AXE_BUSY_ATTEMPTS - 1 || !AXE_BUSY.test(String(error))) throw error;
      // Another driver holds the frame's axe — let it finish, then retry.
      await page.waitForTimeout(250 * (attempt + 1));
    }
  }
}
