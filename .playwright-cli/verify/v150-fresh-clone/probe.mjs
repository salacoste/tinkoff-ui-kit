// v1.5.0 Flow-B fresh-consumer probe (RELEASE.md §12.4): a fresh clone by tag
// installs the BANK triple and renders tk-menu-popover — raw element + the
// MenuPopover React wrapper. Runs against the consumer's vite dev server
// (http://localhost:5199). Evidence lands next to this file.
//
// Round 2 (post-fix): the round-1 run caught the React-19 law — constructor-
// time host attributes do not survive React's element creation, so tk-menu-item
// rows arrived role-less in React compositions. Fixed in the kit (roles assert
// at connect time); this probe now pins both roles as first-class legs.

import { chromium } from 'playwright';

const URL = 'http://localhost:5199/';
const OUT = `${import.meta.dirname}/`;

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));

const rawMenu = page.getByRole('menu', { name: 'Действия с платежом' });
const reactMenu = page.getByRole('menu', { name: 'Действия с документом' });

await page.goto(URL);
await page.waitForFunction(() => customElements.whenDefined('tk-menu-popover').then(() => true));

// --- render + anchor geometry -------------------------------------------------
const rawBox = await page.locator('#raw-anchor').boundingBox();
const reactBox = await page.locator('#react-anchor').boundingBox();
check('anchors render 44×44 (raw)', rawBox?.width === 44 && rawBox?.height === 44, JSON.stringify(rawBox));
check('anchors render 44×44 (react)', reactBox?.width === 44 && reactBox?.height === 44, JSON.stringify(reactBox));
check('menus start closed', (await page.locator('div[role="menu"][aria-label="Действия с платежом"]').getAttribute('hidden')) !== null);

// --- raw leg: open by click ----------------------------------------------------
await page.click('#raw-anchor');
await rawMenu.waitFor({ state: 'visible' });
const menuName = await rawMenu.getAttribute('aria-label');
check('panel role=menu + aria-label', menuName === 'Действия с платежом', `aria-label="${menuName}"`);
const rowCount = await rawMenu.getByRole('menuitem').count();
check('3 role=menuitem rows in the panel (React-19 law regression)', rowCount === 3, `count=${rowCount}`);
const divRole = await page.locator('tk-menu-divider').first().getAttribute('role');
check('tk-menu-divider carries role=separator (React-19 law regression)', divRole === 'separator', `role=${divRole}`);

const panelBox = await rawMenu.boundingBox();
const anchorBox = await page.locator('#raw-anchor').boundingBox();
const dRight = Math.abs(panelBox.x + panelBox.width - (anchorBox.x + anchorBox.width));
const gapY = panelBox.y - (anchorBox.y + anchorBox.height);
check('panel RIGHT edge flush with trigger (alignment end)', dRight <= 1, `Δright=${dRight.toFixed(2)}px`);
check('panel below the anchor (offset ≈4px)', gapY >= 2 && gapY <= 10, `gap=${gapY.toFixed(2)}px`);
check('panel width ≥ 270px (the 280px hook floor)', panelBox.width >= 270, `width=${panelBox.width}px`);
await page.screenshot({ path: `${OUT}v150-flowb-light-open.png` });

// --- keyboard: roving + select + focus return ----------------------------------
await page.keyboard.press('ArrowDown');
let active = await page.evaluate(() => {
  const sr = document.querySelector('#raw-mp')?.shadowRoot;
  const a = sr?.activeElement;
  return { tag: a?.tagName, text: a?.textContent?.trim() };
});
check('ArrowDown focuses the first row (real focus into the shadow panel)', active.tag === 'TK-MENU-ITEM' && active.text === 'Открыть карточку', JSON.stringify(active));
await page.keyboard.press('ArrowDown');
active = await page.evaluate(() => document.querySelector('#raw-mp')?.shadowRoot?.activeElement?.textContent?.trim());
check('ArrowDown moves to the second row', active === 'Повторить платёж', active);
await page.keyboard.press('End');
active = await page.evaluate(() => document.querySelector('#raw-mp')?.shadowRoot?.activeElement?.textContent?.trim());
check('End jumps to the last row', active === 'Отменить платёж', active);

await page.keyboard.press('Enter');
await rawMenu.waitFor({ state: 'hidden' });
const rawAfter = await page.evaluate(() => window.__flowb);
check('raw select event fired (detail.text reaches the listener)', rawAfter.rawSelect.includes('Отменить платёж'), JSON.stringify(rawAfter.rawSelect));
check('raw open-change fired true then false', rawAfter.rawOpen.includes(true) && rawAfter.rawOpen.includes(false), JSON.stringify(rawAfter.rawOpen));
const focusBack = await page.evaluate(() => document.activeElement?.id);
check('focus returned to the trigger after select', focusBack === 'raw-anchor', focusBack);

// --- Esc leg --------------------------------------------------------------------
await page.click('#raw-anchor');
await rawMenu.waitFor({ state: 'visible' });
await page.keyboard.press('Escape');
await rawMenu.waitFor({ state: 'hidden' });
const escFocus = await page.evaluate(() => document.activeElement?.id);
check('Escape closes and restores focus to the trigger', escFocus === 'raw-anchor', escFocus);

// --- react wrapper leg ------------------------------------------------------------
await page.click('#react-anchor');
await reactMenu.waitFor({ state: 'visible' });
const reactRowCount = await reactMenu.locator('[role="menuitem"]').count();
check('React wrapper rows carry role=menuitem (the round-1 catch, fixed)', reactRowCount === 3, `count=${reactRowCount}`);
const reactPanel = await reactMenu.boundingBox();
const reactAnchor = await page.locator('#react-anchor').boundingBox();
const rdRight = Math.abs(reactPanel.x + reactPanel.width - (reactAnchor.x + reactAnchor.width));
check('React wrapper opens the same panel (right edge flush)', rdRight <= 1, `Δright=${rdRight.toFixed(2)}px`);
await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
await reactMenu.waitFor({ state: 'hidden' });
const reactAfter = await page.evaluate(() => window.__flowb);
check('React onSelect mapped (the UNWRAPPED row element — CONVENTIONS §3)', reactAfter.reactSelect.includes('Открыть'), JSON.stringify(reactAfter.reactSelect));
check('React onOpenChange mapped (true→false)', reactAfter.reactOpen.includes(true) && reactAfter.reactOpen.includes(false), JSON.stringify(reactAfter.reactOpen));
const reactFocus = await page.evaluate(() => document.activeElement?.id);
check('React leg: focus returned to its trigger', reactFocus === 'react-anchor', reactFocus);

// --- dark theme leg ----------------------------------------------------------------
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await page.click('#raw-anchor');
await rawMenu.waitFor({ state: 'visible' });
const darkSurface = await rawMenu.evaluate((el) => getComputedStyle(el).backgroundColor);
await page.screenshot({ path: `${OUT}v150-flowb-dark-open.png` });
check('dark theme applies to the panel (surface flips from light)', darkSurface !== 'rgb(255, 255, 255)', `panel bg=${darkSurface}`);

// --- console ------------------------------------------------------------------------
check('console clean (0 errors)', consoleErrors.length === 0, JSON.stringify(consoleErrors.slice(0, 3)));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} legs PASS`);
process.exit(failed.length ? 1 : 0);
