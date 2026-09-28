import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 240 } });
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
const read = () => page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const host = document.querySelector('tk-badge');
  const inner = host && host.shadowRoot ? host.shadowRoot.querySelector('[part] , .badge, span, div') : null;
  return {
    htmlTheme: document.documentElement.getAttribute('data-theme'),
    textPrimary: cs.getPropertyValue('--tk-color-text-primary').trim(),
    bgBase: cs.getPropertyValue('--tk-color-bg-base').trim(),
    badgeFill: host ? getComputedStyle(host).getPropertyValue('--tk-badge-fill').trim() : null,
    hostBg: host ? getComputedStyle(host).backgroundColor : null,
    innerBg: inner ? getComputedStyle(inner).backgroundColor : null,
  };
});
console.log('LIGHT', JSON.stringify(await read()));
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await page.waitForTimeout(300);
console.log('DARK ', JSON.stringify(await read()));
await browser.close();
