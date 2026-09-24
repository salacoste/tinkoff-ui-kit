import { expect, test, type Page } from 'playwright/test';

import { pinDeterministicFonts } from './inject';
import { buildStoryUrl, THEMES } from './stories';

/**
 * tk-data-table KEYBOARD-COVERAGE visual spec (spec 6.4) — the
 * filter-chips.spec.ts mold (a real-interaction page-level clip capture)
 * carrying the assertions only a real layout engine can make. The resting
 * pixels of every story are already covered by the visual.spec.ts story
 * baselines; what they cannot prove is the SANCTIONED APG keyboard layer
 * the reference lacks (FR-12's improvement axis), so this spec drives the
 * interactive keyboard story with REAL keys and asserts the roving
 * contract in chromium:
 *
 * - ONE Tab stop inside the table (entering takes a Tab; the NEXT Tab is
 *   already outside; Shift+Tab re-enters on the same row);
 * - ArrowUp/Down move row-to-row CLAMPED at the ends (no wrap) and SKIP
 *   inert rows (the keyboard story's row 1 has no href);
 * - Home/End jump first/last focusable row;
 * - Space is preventDefaulted + click() by the component (anchors ignore
 *   Space natively) — the stand's activation log is the proof;
 * - Enter synthesizes the anchor's native click (the stand preventDefaults
 *   navigation and logs the same href evidence);
 * - the §8 unified focus ring paints around the WHOLE row (2px, offset 2px,
 *   the live theme token) under KEYBOARD focus — a real MOUSE click on a
 *   row must NOT ring (the :has(:focus-visible) pick).
 *
 * The focused-row region gets its own baseline set (both themes) — the
 * whole-row ring is a designed state the story baselines never show.
 *
 * Same pinned webServer/capture config as the visual suite; same stale-dist
 * rule (build docs first — pnpm test:visual does).
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

/** The story stand's activation log (newest first, one line per activation). */
const activationLog = (page: Page): Promise<string> =>
  page.locator('#tkd-log-keyboard').textContent();

test.describe('tk-data-table keyboard contract (chromium)', () => {
  for (const theme of THEMES) {
    test(`roving: single Tab stop, arrows clamped no-wrap + inert skip, Home/End, Enter/Space activate, keyboard-only ring [${theme}]`, async ({
      page,
    }) => {
      await page.goto(buildStoryUrl('components-datatable--keyboard', theme));
      await waitForStorySettled(page);
      await pinDeterministicFonts(page);
      const table = page.locator('main #tkd-keyboard-table');
      await expect(table).toBeAttached();
      await table.evaluate(async (node) => {
        await (node as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      });

      /** Deep activeElement of the table's shadow root: { inTable, row index } */
      const deepActive = () =>
        table.evaluate((node) => {
          const anchor = (node as HTMLElement).shadowRoot?.activeElement;
          return {
            inTable: anchor != null,
            index: anchor?.getAttribute('data-index') ?? null,
          };
        });

      // The static tab-stop shape BEFORE any interaction: exactly ONE anchor
      // carries tabindex 0 and it is the FIRST row's.
      const stops = await table.evaluate((node) => {
        const anchors = Array.from((node as HTMLElement).shadowRoot?.querySelectorAll('a[data-index]') ?? []);
        return anchors.map((anchor) => ({
          index: anchor.getAttribute('data-index'),
          tabindex: anchor.getAttribute('tabindex'),
        }));
      });
      expect(stops.filter((entry) => entry.tabindex === '0')).toHaveLength(1);
      expect(stops[0]?.index).toBe('0');
      expect(stops[0]?.tabindex).toBe('0');

      // ONE Tab stop: Tab walks the document's focusables (the docs shell
      // may hold a few before the story — bound the walk) until the table
      // takes focus; the NEXT Tab must already be OUTSIDE the table, and
      // Shift+Tab re-enters on the same row.
      let entered = false;
      for (let i = 0; i < 10 && !entered; i += 1) {
        await page.keyboard.press('Tab');
        entered = (await deepActive()).inTable;
      }
      expect(entered, 'Tab reaches the table').toBe(true);
      await page.keyboard.press('Tab');
      expect((await deepActive()).inTable, 'exactly ONE Tab stop inside the table').toBe(false);
      await page.keyboard.press('Shift+Tab');
      expect((await deepActive()).inTable, 'Shift+Tab re-enters the table').toBe(true);

      // Pin the walk to row 0 whatever row the entry landed on, then prove
      // the contract deterministically.
      await page.keyboard.press('Home');
      expect((await deepActive()).index).toBe('0');

      // ArrowDown skips the INERT row (index 1 has no href) → lands on 2;
      // arrows keep stepping; ArrowUp returns.
      await page.keyboard.press('ArrowDown');
      expect((await deepActive()).index).toBe('2');
      await page.keyboard.press('ArrowDown');
      expect((await deepActive()).index).toBe('3');
      await page.keyboard.press('ArrowUp');
      expect((await deepActive()).index).toBe('2');

      // Home/End — first/last focusable row; the ends CLAMP (no wrap).
      await page.keyboard.press('End');
      expect((await deepActive()).index).toBe('5');
      await page.keyboard.press('ArrowDown');
      expect((await deepActive()).index, 'clamped at the last row — no wrap').toBe('5');
      await page.keyboard.press('Home');
      expect((await deepActive()).index).toBe('0');
      await page.keyboard.press('ArrowUp');
      expect((await deepActive()).index, 'clamped at the first row — no wrap').toBe('0');

      // The tab stop FOLLOWED the focus — still exactly one, now on the last
      // visited row (0 after Home).
      const stopsAfter = await table.evaluate((node) => {
        const anchors = Array.from((node as HTMLElement).shadowRoot?.querySelectorAll('a[data-index]') ?? []);
        return anchors.map((anchor) => ({
          index: anchor.getAttribute('data-index'),
          tabindex: anchor.getAttribute('tabindex'),
        }));
      });
      expect(stopsAfter.filter((entry) => entry.tabindex === '0')).toHaveLength(1);
      expect(stopsAfter[0]?.index).toBe('0');
      expect(stopsAfter[0]?.tabindex).toBe('0');

      // SPACE activates (the component preventDefaults + clicks; anchors
      // ignore Space natively — the log row is the proof).
      await page.keyboard.press(' ');
      await expect
        .poll(() => activationLog(page))
        .toContain('#tkd-SBER (строка 1)');

      // ENTER navigates natively — the stand preventDefaults the synthesized
      // click and logs the same href evidence.
      await page.keyboard.press('ArrowDown'); // → row 2 (Т-Технологии)
      await page.keyboard.press('Enter');
      await expect
        .poll(() => activationLog(page))
        .toContain('#tkd-TCSG (строка 3)');

      // The §8 unified ring around the WHOLE row — keyboard focus only.
      await page.keyboard.press('Home'); // ring on row 0 (keyboard focus)
      const ring = await table.evaluate((node) => {
        const root = (node as HTMLElement).shadowRoot;
        const anchor = root?.querySelector('a[data-index="0"]');
        const row = anchor?.closest('.row') as HTMLElement | null;
        if (!row) return null;
        const style = getComputedStyle(row);
        const anchorStyle = anchor ? getComputedStyle(anchor) : null;
        return {
          rowOutlineWidth: style.outlineWidth,
          rowOutlineStyle: style.outlineStyle,
          rowOutlineOffset: style.outlineOffset,
          rowOutlineColor: style.outlineColor,
          anchorOutlineStyle: anchorStyle?.outlineStyle ?? null,
        };
      });
      expect(ring, 'the focused row resolves').not.toBeNull();
      expect(ring?.rowOutlineWidth).toBe('2px');
      expect(ring?.rowOutlineStyle).toBe('solid');
      expect(ring?.rowOutlineOffset).toBe('2px');
      expect(ring?.rowOutlineColor).toMatch(/rgb\(/); // the live theme token
      // Chromium computes outline-width 'medium'→3px even under
      // outline-style:none — STYLE is the paint discriminator, never width.
      expect(ring?.anchorOutlineStyle, 'the anchor itself carries no ring').toBe('none');

      // A real MOUSE click on a row focuses its anchor (and moves the tab
      // stop via focusin) but must NOT ring — pointer focus, not keyboard
      // (the :has(:focus-visible) pick, not :focus-within).
      await page.locator('a[data-index="3"]').click();
      expect((await deepActive()).index, 'the click focused row 3 (through the whole-row stitch)').toBe('3');
      const quietRing = await table.evaluate((node) => {
        const root = (node as HTMLElement).shadowRoot;
        const anchor = root?.querySelector('a[data-index="3"]');
        const row = anchor?.closest('.row') as HTMLElement | null;
        return row ? getComputedStyle(row).outlineStyle : null;
      });
      expect(quietRing, 'mouse focus paints no keyboard ring').toBe('none');

      // Region baseline: the whole-row ring state, light + dark. Back to
      // KEYBOARD focus first (a keypress restores the keyboard modality and
      // the ring — the designed state being pinned).
      await page.keyboard.press('ArrowDown'); // keyboard focus on row 4
      expect((await deepActive()).index).toBe('4');
      const clip = await page.locator('main #tkd-keyboard-frame').evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const win = node.ownerDocument.defaultView;
        return {
          x: Math.floor(rect.left + (win?.scrollX ?? 0)),
          y: Math.floor(rect.top + (win?.scrollY ?? 0)),
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
        };
      });
      await expect(page).toHaveScreenshot({ clip });
    });
  }
});
