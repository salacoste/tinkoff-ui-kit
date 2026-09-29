// Story 16.6 — LIVE article-pattern walkthrough driver (the 2.8 UJ mold).
// Reproduces the keyboard + axe walkthrough of the composed article pattern
// from the BUILT docs bundle:
//   pnpm --filter pillkit-docs build
//   node tests/visual/serve.mjs 6013 &
//   node .playwright-cli/verify/tj-article/walkthrough.mjs
//
// Mirrors the pinned capture env of tests/visual (README): chromium with
// --font-render-hinting=none --disable-lcd-text, 1280×800 DSF 1,
// reducedMotion reduce, colorScheme light, locally-served fonts pinned
// (tests/visual/fonts.css — the same override inject.ts applies). The ТЖ
// reading slot pins PT Serif (story 15.3), the UI slot Inter — Graphik and
// Charter themselves are licensed and never bundled (OQ-8).
//
// Legs (spec 16.6 §4): tab topology over the composed page (header chips →
// theme → CTA → rail rows → in-body link → engagement buttons), the like
// toggle (aria-pressed, emit-only), the theme cycle ×3 INCLUDING the
// native-dark auto leg (attribute absent + OS prefers dark), the reading
// skeleton (aria-busy, zero tab stops, zero layout shift), the opt-in
// scroll-back rail (hidden = outside tab order, shown = enters it), Esc
// inert outside the drawer, axe both themes, and kit renders for NOTES.
// Full VO/NVDA narration stays a maintainer-side human task (METHOD.md §SR).
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const PORT = 6013;
const STORY_ID = 'tj-article-page--page-composition';
const FONTS_CSS = readFileSync(new URL('../../../tests/visual/fonts.css', import.meta.url), 'utf8');
const AXE_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const pin = async (page) => {
  await page.addStyleTag({ content: FONTS_CSS });
  await page.evaluate(async () => {
    const loads = [
      ...[400, 700].map((w) => document.fonts.load(`${w} 16px PT Serif`)),
      ...[400, 500, 700].map((w) => document.fonts.load(`${w} 16px Inter`)),
    ];
    await Promise.all(loads);
    await document.fonts.ready;
  });
};

const openStory = async (page) => {
  const params = new URLSearchParams({ id: STORY_ID, viewMode: 'story' });
  await page.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return (root?.childElementCount ?? 0) > 0;
  });
  await page.evaluate(() => document.documentElement.removeAttribute('data-tj-theme'));
  await pin(page);
};

/**
 * Describes the REAL focus: descends document.activeElement through every
 * shadowRoot.activeElement — the composed chain, inner element first.
 */
const activeStop = (page) =>
  page.evaluate(() => {
    const describe = (node) => {
      if (!(node instanceof Element)) return '';
      const tag = node.tagName.toLowerCase();
      const extra = [
        node.getAttribute('type') ? ` type=${node.getAttribute('type')}` : '',
        node.getAttribute('aria-label') ? ` label=${node.getAttribute('aria-label')}` : '',
      ].join('');
      return tag + extra;
    };
    let el = document.activeElement;
    if (!el || el === document.body) return 'body';
    const chain = [describe(el)];
    while (el?.shadowRoot?.activeElement) {
      el = el.shadowRoot.activeElement;
      chain.push(describe(el));
    }
    return chain.join(' › ');
  });

const headerAnnouncement = (page) =>
  page.evaluate(() => {
    const host = document.querySelector('tj-header');
    return host?.shadowRoot?.querySelector('.visually-hidden')?.textContent ?? '';
  });

const canvasBg = (page) =>
  page.evaluate(() => getComputedStyle(document.querySelector('.tjart-canvas')).backgroundColor);

const browser = await chromium.launch({
  args: ['--font-render-hinting=none', '--disable-lcd-text'],
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();
await openStory(page);

// --- Step 0 — initial tree -------------------------------------------------------
console.log('\n=== STEP 0 — initial tree ===');
console.log(await page.locator('.tjart-layout').ariaSnapshot());
check('article landmark present with aria-busy=false', await page.evaluate(() => {
  const a = document.querySelector('#tjart-article');
  return a?.tagName === 'ARTICLE' && a.getAttribute('aria-busy') === 'false';
}));
check('backrail starts HIDDEN (opt-in OFF by default)', await page.evaluate(() => {
  const rail = document.querySelector('#tjart-backrail');
  return getComputedStyle(rail).visibility === 'hidden';
}));

// --- Step 1 — Tab topology (natural DOM order, shadow-descended) ------------------
console.log('\n=== STEP 1 — Tab walk ===');
await page.evaluate(() => document.body.focus());
const stops = [];
for (let i = 0; i < 24; i += 1) {
  await page.keyboard.press('Tab');
  const stop = await activeStop(page);
  if (stop === 'body' && stops.length > 0) break; // past the end
  stops.push(stop);
  console.log(`Tab stop ${stops.length}: ${stop}`);
}
const expected = [
  'a', // wordmark (light-DOM anchor in the slot)
  'tj-header › a',
  'tj-header › a',
  'tj-header › a', // 3 nav chips
  'tj-header › button type=button label=Переключить тему оформления', // theme control
  'tj-header › a', // Написать CTA
  'tj-rail › a',
  'tj-rail › a',
  'tj-rail › a',
  'tj-rail › a',
  'tj-rail › a', // 5 rubric rows
  'tj-link › a', // the in-body link (two-surface law)
  'button type=button', // Нравится
  'button type=button', // Комментировать
  'button type=button', // Поделиться
  'button type=button', // В закладки
  'button type=button', // demo: skeleton toggle
  'button type=button', // demo: scroll-back toggle
];
const stopsOk =
  stops.length === expected.length && stops.every((s, i) => s === expected[i]);
check(
  'Tab order: wordmark → chips ×3 → theme → CTA → rail ×5 → in-body link → engage ×4 → demo ×2 (backrail NOT tabbable while hidden)',
  stopsOk,
  stops.join(' | '),
);

// Focus rings at representative stops (2px token ring, the family law).
const ringAt = async (locator) =>
  locator.evaluate((el) => {
    const target = el.shadowRoot?.activeElement ?? el;
    const cs = getComputedStyle(target);
    return `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`;
  });
// Scoped to the HEADER nav («Навигация»): «Разборы» legitimately exists as both
// the active header chip and the current rail row («Разделы») — the article's
// rubric is current in BOTH navigations, so an unscoped role query is ambiguous.
await page.getByRole('navigation', { name: 'Навигация' }).getByRole('link', { name: 'Разборы' }).focus();
const chipRing = await page.locator('tj-header').evaluate((host) => {
  const a = host.shadowRoot?.activeElement;
  const cs = getComputedStyle(a);
  return `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`;
});
check('2px focus ring on a nav chip (token color)', /^2px solid /.test(chipRing), chipRing);
await page.getByRole('button', { name: /Нравится/ }).focus();
const engageRing = await ringAt(page.getByRole('button', { name: /Нравится/ }));
check('2px focus ring on the like button', engageRing === chipRing, engageRing);

// --- Step 2 — like toggle (aria-pressed, emit-only, label unchanged) --------------
console.log('\n=== STEP 2 — like toggle ===');
const like = page.getByRole('button', { name: /Нравится/ });
await like.focus();
await page.keyboard.press('Enter');
const liked = await like.evaluate((b) => ({
  pressed: b.getAttribute('aria-pressed'),
  label: b.querySelector('span:not(.tjart-engage__count)')?.textContent,
  count: b.querySelector('.tjart-engage__count')?.textContent,
}));
check('Enter flips aria-pressed=true, label unchanged, demo count 128→129', liked.pressed === 'true' && liked.label === 'Нравится' && liked.count === '129', JSON.stringify(liked));
await page.keyboard.press('Space');
const unliked = await like.evaluate((b) => b.getAttribute('aria-pressed'));
check('Space flips back to false (both keys activate; state is story-local only)', unliked === 'false');

// --- Step 3 — theme cycle ×3 (attribute on the document root, RU announcements) ---
console.log('\n=== STEP 3 — theme cycle ===');
const themeButton = page.getByRole('button', { name: 'Переключить тему оформления' });
await themeButton.focus();
const themeSeq = [];
for (let i = 0; i < 3; i += 1) {
  await page.keyboard.press('Enter');
  themeSeq.push(
    await page.evaluate(() => ({
      attr: document.documentElement.getAttribute('data-tj-theme'),
      bg: getComputedStyle(document.querySelector('.tjart-canvas')).backgroundColor,
      announce: document.querySelector('tj-header')?.shadowRoot?.querySelector('.visually-hidden')?.textContent ?? '',
    })),
  );
}
check(
  'cycle absent→light→dark→absent; canvas re-themes every step; RU announcements match',
  themeSeq.map((s) => s.attr ?? 'auto').join('→') === 'light→dark→auto' &&
    themeSeq[0].bg !== themeSeq[1].bg &&
    themeSeq[1].bg !== themeSeq[2].bg &&
    themeSeq[0].announce === 'Тема оформления: светлая' &&
    themeSeq[1].announce === 'Тема оформления: тёмная' &&
    themeSeq[2].announce === 'Тема оформления: системная',
  themeSeq.map((s) => `${s.attr ?? 'auto'}/${s.bg}/${s.announce}`).join(' | '),
);
check('focus stays on the theme control across the whole cycle', (await activeStop(page)).includes('label=Переключить тему оформления'));

// --- Step 4 — skeleton (aria-busy, zero tab stops in bones, zero layout shift) ----
console.log('\n=== STEP 4 — skeleton ===');
const articleBox = await page.evaluate(() => document.querySelector('#tjart-article').getBoundingClientRect().height);
await page.locator('#tjart-skeleton-toggle').click();
await page.waitForTimeout(50);
const skeleton = await page.evaluate(() => {
  const a = document.querySelector('#tjart-article');
  return {
    busy: a.getAttribute('aria-busy'),
    liveHidden: getComputedStyle(a.querySelector('.tjart-live')).display === 'none',
    bonesShown: getComputedStyle(a.querySelector('.tjart-bones')).display === 'block',
    boneColor: getComputedStyle(a.querySelector('.tjart-sk')).backgroundColor,
    height: a.getBoundingClientRect().height,
  };
});
check('skeleton: aria-busy=true, live flow hidden, bones shown, meta-ink alpha bones', skeleton.busy === 'true' && skeleton.liveHidden && skeleton.bonesShown && /110, 110, 110|0\.431373/.test(skeleton.boneColor), JSON.stringify(skeleton));
check(`no layout shift on swap (article height ${Math.round(articleBox)} vs ${Math.round(skeleton.height)})`, Math.abs(articleBox - skeleton.height) <= 1);
// In bones mode the tab walk must skip prose + engagement entirely.
// NOTE: walking "from body" after a click is unreliable — Chromium's
// sequential focus navigation STARTING POINT sticks to the last interacted
// control (the demo toggle), so Tab samples only the DOM tail. Focus the
// FIRST tab stop (the wordmark anchor) directly and record the FULL forward
// order from it.
await page.locator('a.tjart-wordmark').focus();
const boneStops = [await activeStop(page)];
for (let i = 0; i < 20; i += 1) {
  await page.keyboard.press('Tab');
  const stop = await activeStop(page);
  if (stop === 'body' && boneStops.length > 0) break;
  boneStops.push(stop);
}
// NOTE: a child INSIDE a display:none subtree keeps its OWN computed display
// in Chromium (the engage div reports 'flex'), so the ancestor .tjart-live —
// the element the skeleton actually hides — is the correct probe target.
const engageGone = await page.evaluate(
  () => getComputedStyle(document.querySelector('.tjart-live')).display === 'none',
);
const boneButtons = boneStops.filter((s) => s === 'button type=button').length; // demo toggles are story chrome and stay
check(
  'bones carry ZERO tab stops (prose link + engagement gone from the order; only the 2 demo toggles remain)',
  engageGone && !boneStops.some((s) => s.startsWith('tj-link')) && boneButtons === 2,
  boneStops.join(' | '),
);
await page.locator('#tjart-skeleton-toggle').click(); // back to live
await page.waitForTimeout(50);
check('toggle returns the live flow (aria-busy=false)', await page.evaluate(() => document.querySelector('#tjart-article').getAttribute('aria-busy')) === 'false');

// --- Step 5 — opt-in scroll-back rail (hidden = outside tab order; shown = inside) -
console.log('\n=== STEP 5 — scroll-back rail ===');
await page.locator('#tjart-sticky-toggle').click();
await page.waitForTimeout(50);
const armed = await page.evaluate(() => {
  const rail = document.querySelector('#tjart-backrail');
  return { armed: rail.classList.contains('is-armed'), stillHidden: getComputedStyle(rail).visibility === 'hidden' };
});
check('armed demo stays hidden at rest (direction-based, 120px floor)', armed.armed && armed.stillHidden, JSON.stringify(armed));
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(100);
await page.evaluate(() => window.scrollTo(0, 500)); // scroll UP
await page.waitForTimeout(250);
const shown = await page.evaluate(() => {
  const rail = document.querySelector('#tjart-backrail');
  const cs = getComputedStyle(rail);
  return { on: rail.classList.contains('is-on'), visibility: cs.visibility, transform: cs.transform };
});
check('scrolling UP shows the compact rail (visible, translated in)', shown.on && shown.visibility === 'visible' && !shown.transform.includes('110%'), JSON.stringify(shown));
// Shown rail = its four buttons join the order AFTER the demo toggles.
// Same starting-point discipline as step 4 — focus the first tab stop and
// record the full forward order, not the tail after the clicked toggle.
await page.locator('a.tjart-wordmark').focus();
const railStops = [await activeStop(page)];
for (let i = 0; i < 26; i += 1) {
  await page.keyboard.press('Tab');
  const stop = await activeStop(page);
  if (stop === 'body' && railStops.length > 0) break;
  railStops.push(stop);
}
const railButtons = railStops.filter((s) => s === 'button type=button').length;
check(
  'shown rail contributes its 4 buttons (4 engage + 2 demo + 4 rail = 10 plain-button stops)',
  railButtons === 10,
  railStops.join(' | '),
);
await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(250);
const hiddenAgain = await page.evaluate(() => getComputedStyle(document.querySelector('#tjart-backrail')).visibility === 'hidden');
check('scrolling DOWN re-hides the rail (back outside tab order)', hiddenAgain);

// --- Step 6 — Esc inert outside the drawer ----------------------------------------
console.log('\n=== STEP 6 — Esc outside the drawer ===');
await page.getByRole('button', { name: 'В закладки' }).focus();
const beforeEsc = await activeStop(page);
await page.keyboard.press('Escape');
const afterEsc = await activeStop(page);
check('Esc does nothing at 1280 (no drawer open; focus unchanged)', beforeEsc === afterEsc && beforeEsc === 'button type=button', `${beforeEsc} → ${afterEsc}`);

// --- Step 7 — native-dark auto leg (attribute ABSENT + OS prefers dark) -----------
console.log('\n=== STEP 7 — native-dark auto leg ===');
const darkContext = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'dark',
});
const darkPage = await darkContext.newPage();
const params = new URLSearchParams({ id: STORY_ID, viewMode: 'story' });
await darkPage.goto(`http://127.0.0.1:${PORT}/iframe.html?${params.toString()}`);
await darkPage.waitForFunction(() => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0);
// The docs boot runtime writes data-tj-theme='light' for deterministic story
// rendering — the same fact openStory's removeAttribute defeats. The NATIVE
// auto leg is only observable with the attribute absent (the token sheet's
// media-scoped dark block), so remove it AFTER boot, then measure.
await darkPage.evaluate(() => document.documentElement.removeAttribute('data-tj-theme'));
await pin(darkPage);
const nativeDark = await darkPage.evaluate(() => ({
  attr: document.documentElement.getAttribute('data-tj-theme'),
  bg: getComputedStyle(document.querySelector('.tjart-canvas')).backgroundColor,
}));
check('attribute absent + OS dark → the whole article renders dark (the auto leg)', nativeDark.attr === null && nativeDark.bg !== 'rgb(240, 240, 240)', JSON.stringify(nativeDark));
// The control cycles FROM the native state: first click → light.
await darkPage.getByRole('button', { name: 'Переключить тему оформления' }).click();
const cycledFromNative = await darkPage.evaluate(() => document.documentElement.getAttribute('data-tj-theme'));
check('first click from native-dark writes light (stateless read-on-click)', cycledFromNative === 'light', cycledFromNative);

// --- Step 8 — axe, both themes ----------------------------------------------------
console.log('\n=== STEP 8 — axe both themes ===');
for (const dark of [false, true]) {
  await openStory(page);
  if (dark) await page.evaluate(() => document.documentElement.setAttribute('data-tj-theme', 'dark'));
  await page.waitForTimeout(150);
  const axe = await new AxeBuilder({ page }).withTags([...AXE_WCAG_TAGS]).analyze();
  const violations = axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  check(`axe zero violations [${dark ? 'dark' : 'light'}]`, violations.length === 0, violations.join('; '));
}

// --- Step 9 — kit renders for NOTES (light + dark + skeleton) ----------------------
console.log('\n=== STEP 9 — kit renders ===');
await openStory(page);
await page.evaluate(() => document.querySelector('.tjart-layout').scrollIntoView());
await page.locator('.tjart-layout').screenshot({ path: new URL('kit-article-light.png', import.meta.url).pathname });
await page.evaluate(() => document.documentElement.setAttribute('data-tj-theme', 'dark'));
await page.waitForTimeout(150);
await page.locator('.tjart-layout').screenshot({ path: new URL('kit-article-dark.png', import.meta.url).pathname });
await page.evaluate(() => document.documentElement.removeAttribute('data-tj-theme'));
await page.locator('#tjart-skeleton-toggle').click();
await page.waitForTimeout(150);
await page.locator('#tjart-article').screenshot({ path: new URL('kit-article-skeleton.png', import.meta.url).pathname });

await darkContext.close();
await context.close();
await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n=== SUMMARY: ${results.length - failed.length}/${results.length} checks passed ===`);
for (const f of failed) console.log(`FAILED: ${f.name} — ${f.detail}`);
process.exit(failed.length > 0 ? 1 : 0);
