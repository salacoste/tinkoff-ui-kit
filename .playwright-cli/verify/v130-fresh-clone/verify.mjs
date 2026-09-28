import { chromium } from 'playwright';
const out = '/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/.playwright-cli/verify/v130-fresh-clone';
const browser = await chromium.launch();
const errors = [];
for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 900, height: 240 } });
  page.on('console', m => { if (m.type() === 'error') errors.push(`${theme}: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`${theme}: PAGEERROR ${e.message}`));
  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
  if (theme === 'dark') {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(400);
  }
  await page.waitForSelector('tk-badge');
  const info = await page.evaluate(() => {
    const badges = [...document.querySelectorAll('tk-badge')];
    return badges.map(b => {
      const r = b.getBoundingClientRect();
      return { text: b.textContent.trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
  });
  console.log(theme.toUpperCase(), JSON.stringify(info));
  await page.screenshot({ path: `${out}/badge-${theme}.png` });
  await page.close();
}
await browser.close();
console.log('CONSOLE-ERRORS:', errors.length ? JSON.stringify(errors) : 'none');
