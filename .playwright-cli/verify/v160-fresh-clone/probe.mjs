// Flow-B v1.6.0 release gate probe — runs against the PREVIEW (prod) server.
// Usage: node /tmp/v160/probe.mjs <baseUrl> <outDir>
import { chromium } from '/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const OUT = process.argv[3] ?? '/tmp/v160/shots';
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const leg = (id, pass, detail) => {
  results.push({ id, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${id}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(`${m.type()}: ${m.text()}`);
});
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });

// ── Leg 1: raw hero — element upgraded, anatomy, tone reflection ──
const heroRaw = page.locator('#hero-raw');
await heroRaw.waitFor({ state: 'visible', timeout: 10000 });
const heroUp = await heroRaw.evaluate((el) => el.shadowRoot !== null && el.shadowRoot.children.length > 0);
leg('1-raw-hero-upgraded', heroUp, heroUp ? 'shadow tree rendered' : 'no shadow content');

const toneAttr = await heroRaw.getAttribute('tone');
leg('2-tone-reflected', toneAttr === 'stock', `host tone="${toneAttr}"`);

const heroText = await heroRaw.evaluate((el) => {
  const name = el.shadowRoot.querySelector('.hero__name')?.textContent?.trim();
  const ticker = el.shadowRoot.querySelector('.hero__ticker')?.textContent?.trim();
  const metricLabel = el.shadowRoot.querySelector('.hero__metric-label')?.textContent?.trim();
  const metricValue = (el.shadowRoot.querySelector('slot[name="metric"]')?.assignedNodes({ flatten: true }) ?? []).map((n) => n.textContent ?? '').join('').trim();
  return { name, ticker, metricLabel, metricValue };
});
leg('3-hero-anatomy', heroText.name === 'Северсталь' && heroText.ticker === 'CHMF', JSON.stringify({ name: heroText.name, ticker: heroText.ticker }));
leg('4-hero-metric-block', /Изменение за день/.test(heroText.metricLabel ?? '') && /1,24%/.test(heroText.metricValue ?? ''), JSON.stringify({ label: heroText.metricLabel, value: heroText.metricValue }));

const starVisible = await page.locator('#hero-star').isVisible();
leg('5-hero-action-slot', starVisible, 'slotted star button visible');

// ── Leg 2: slotted h2 override (heading semantics AC3) ──
const slottedH2 = await page.locator('#hero-slotted-h2').isVisible();
const slottedAssigned = await page.locator('#hero-slotted-h2').evaluate((el) => {
  const slot = el.closest('tk-instrument-hero')?.shadowRoot?.querySelector('slot[name="name"]');
  return slot ? slot.assignedNodes().includes(el) : false;
});
leg('6-hero-slotted-h2', slottedH2 && slottedAssigned, `visible=${slottedH2} assigned=${slottedAssigned}`);

// ── Leg 3: metric slot-presence rule (no slot → no block) ──
const noMetricHero = page.locator('#raw-heroes tk-instrument-hero').nth(1);
const metricBlockGone = await noMetricHero.evaluate((el) => el.shadowRoot.querySelector('.hero__metric, .hero__metric-block') === null);
leg('7-hero-metric-optional', metricBlockGone, metricBlockGone ? 'second hero renders no metric block' : 'metric block leaked');

// ── Leg 4: invest identity stops resolve (FR-1 gradient via tokens) ──
const gradient = await heroRaw.evaluate((el) => {
  const bg = getComputedStyle(el).backgroundImage; // the identity fill rides :host
  const stopA = getComputedStyle(el).getPropertyValue('--tk-color-invest-stock-a').trim();
  return { bg, stopA };
});
leg('8-hero-gradient-tokens', gradient.bg.includes('linear-gradient') && gradient.stopA !== '', `bg=${gradient.bg.slice(0, 60)}… stop-a=${gradient.stopA}`);

// ── Leg 5: raw ticket anatomy ──
const ticket = page.locator('#ticket-raw');
await ticket.waitFor({ state: 'visible' });
const ticketText = await ticket.evaluate((el) => {
  const label = el.shadowRoot.querySelector('slot[name="label"]')?.assignedNodes({ flatten: true }).map((n) => n.textContent).join('').trim();
  const value = el.shadowRoot.querySelector('slot[name="value"]')?.assignedNodes({ flatten: true }).map((n) => n.textContent).join('').trim();
  const note = el.shadowRoot.querySelector('slot[name="note"]')?.assignedNodes({ flatten: true }).map((n) => n.textContent).join('').trim();
  return { label, value, note };
});
leg('9-ticket-anatomy', ticketText.label === 'Купить по цене' && /277,65/.test(ticketText.value ?? '') && /рекомендацией/.test(ticketText.note ?? ''), JSON.stringify(ticketText));

const ctaBg = await page.locator('#ticket-raw tk-button').evaluate((el) => {
  const inner = el.shadowRoot?.querySelector('.button'); // the primary paint rides .button::before
  return inner ? getComputedStyle(inner, '::before').backgroundColor : 'no-inner';
});
leg('10-ticket-cta-pair', /rgb\(/.test(ctaBg) && ctaBg !== 'rgba(0, 0, 0, 0)', `CTA ::before bg=${ctaBg}`);

// ── Leg 6: React wrappers (CEM) — props survive element creation (React-19 law) ──
const reactHeroes = page.locator('#react-heroes tk-instrument-hero');
const rhCount = await reactHeroes.count();
const rh1 = reactHeroes.first();
const rh1Info = await rh1.evaluate((el) => ({
  tone: el.getAttribute('tone'),
  name: el.shadowRoot?.querySelector('.hero__name')?.textContent?.trim(),
  metricValue: (el.shadowRoot?.querySelector('slot[name="metric"]')?.assignedNodes({ flatten: true }) ?? []).map((n) => n.textContent ?? '').join('').trim(),
}));
leg('11-react-hero-props', rhCount === 2 && rh1Info.tone === 'light' && rh1Info.name === 'Т-Технологии' && /0,82%/.test(rh1Info.metricValue ?? ''), JSON.stringify(rh1Info));

const rh2tone = await reactHeroes.nth(1).getAttribute('tone');
leg('12-react-hero-second', rh2tone === 'dark', `tone="${rh2tone}"`);

const reactTicket = page.locator('#react-tickets tk-promo-card');
const rtInfo = await reactTicket.evaluate((el) => {
  const label = el.shadowRoot.querySelector('slot[name="label"]')?.assignedNodes({ flatten: true }).map((n) => n.textContent).join('').trim();
  const value = el.shadowRoot.querySelector('slot[name="value"]')?.assignedNodes({ flatten: true }).map((n) => n.textContent).join('').trim();
  return { variant: el.getAttribute('variant'), label, value };
});
leg('13-react-ticket', rtInfo.variant === 'ticket' && rtInfo.label === 'Продать по цене' && /23 035/.test(rtInfo.value ?? ''), JSON.stringify(rtInfo));

// ── Leg 7: console clean ──
leg('14-console-clean', consoleErrors.length === 0, consoleErrors.length ? consoleErrors.slice(0, 3).join(' | ') : 'zero errors/warnings');

// ── Screenshots: light then dark (theme remap, no composition edits) ──
await page.screenshot({ path: `${OUT}/flow-b-light.png`, fullPage: true });
const lightFill = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tk-color-surface-base').trim());
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
await page.waitForTimeout(300);
const darkFill = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tk-color-surface-base').trim());
await page.screenshot({ path: `${OUT}/flow-b-dark.png`, fullPage: true });
leg('15-dark-theme-remap', lightFill !== darkFill && darkFill !== '', `--tk-color-surface-base light="${lightFill}" dark="${darkFill}"`);

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\nTOTAL: ${results.length - failed.length}/${results.length} legs PASS`);
process.exit(failed.length ? 1 : 0);
