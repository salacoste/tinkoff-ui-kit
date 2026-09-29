import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl, THEMES } from './stories';

/**
 * ТЖ A11Y SWEEP MATRIX (spec 17.1) — the 5.1/11.1 method duplicated-and-
 * adapted onto the ТЖ family registry. The bank engine
 * (tests/visual/a11y-sweep.spec.ts) stays BYTE-IDENTICAL; every divergence
 * here is a family fact, not a refactor:
 *
 * - CHECK 1 (walks, BOTH themes): a REAL Tab walk over EVERY ТЖ story id
 *   (the 68-row TSWEEP registry below = the built docs index exactly; 45
 *   through 17.2, +23 docs rows at 17.3). Stop
 *   counts are DERIVED FROM STORY SOURCE (the 5.1 "measured, not assumed"
 *   law) with the derivation named inline per row; a changed interactive
 *   surface set must update the registry deliberately. Shift+Tab must
 *   revisit the same per-element ordinal set.
 * - CHECK 2 (unified ring, BOTH themes): every KIT stop (tj-* family) is
 *   self-ring 2px / solid / offset 2px with the color resolved AT RUNTIME
 *   from the live document per SURFACE FAMILY (the 16.3 surface-AA law):
 *   tk-* hosts → --tk-color-focus-ring (the ad-slot boundary story only);
 *   a tj stop whose OWN background is the purple field family
 *   (--tj-color-chip-fill / --tj-color-badge-purple) → --tj-color-chip-ink
 *   (the 16.2/16.3 twin-pinned chip contract); every other tj stop →
 *   --tj-color-focus-ring (light #8A8AE5 / dark #828BBB — resolved, never
 *   hardcoded). Story-chrome stops are GEOMETRY-ONLY (2px/solid/offset-2px
 *   + non-transparent): pattern pages legitimately mix token worlds
 *   (the ad-slot toggle rings with the BANK border token), so the family
 *   token assertion belongs to kit surfaces only. ALL ТЖ rings are
 *   SELF-CARRIED — the bank mold's sibling / .field / ringAncestor carrier
 *   topology is DROPPED (no ТЖ pattern licenses any of them).
 *   NO underline exceptions: probe10 ruled ТЖ links GET 2px rings (the
 *   reference names --outline-focus but under-applies it; the kit ring IS
 *   the improvement layer) — the exception array ships EMPTY (mold parity).
 * - CHECK 3 (deep names, light scan): every visible interactive element in
 *   every root (document + shadow trees) has a non-empty accessible name
 *   via the mold's resolveName chain (aria-labelledby → aria-label → alt →
 *   title → label[for] → closest label → slot-assigned text → textContent).
 * - CHECK 5 (geometry, light scan): clickable box ≥44×44; the §9
 *   inline-prose exemption is the display-computed boundary (an anchor
 *   with display: inline — wordmarks and in-sentence links ride it); the
 *   two RECORDED sub-floor chip surfaces ride `subFloorExempt` with their
 *   extraction derivations (see the registry comments).
 * - PATTERN ROWS (`assertAllStops`): article-page--page-composition,
 *   tag-chip--pro-hero-pattern, post-card--community-pattern and
 *   ad-slot-recipe--recipe — recipe markup is deliberate surface, so
 *   story-chrome stops (wordmark, hero CTA, engage buttons, demo toggles)
 *   get ring/name assertions too, and the TOTAL stop count is pinned
 *   (`totalStops`). The 17.3 docs pages (token-reference, theming-guide,
 *   api, patterns Page rows) deliberately do NOT ride assertAllStops:
 *   their chrome is text + inline ?path anchors (the chrome-composition
 *   precedent — kit-only counts, chrome names-only).
 * - SR STATE PINS: the stateful surfaces' computed role/state at DOM
 *   level (composer fake-input = button; rail drawer open reflection +
 *   aria-expanded + Esc; header theme control cycle + RU announcements;
 *   the 16.1 inert/rel anchor rules across every anchor-contract story;
 *   the article-page like-toggle aria-pressed flip). Live VoiceOver stays
 *   maintainer-side (METHOD.md §SR boundary) — the v1.4.0 runsheet draft
 *   rides the story report.
 *
 * Theme loop: ring tokens are theme-dependent, so walks run in BOTH themes
 * (explicit `globals=theme:dark` — the preview determinism law; the OS
 * preference appears ONLY in the 17.2 native-dark parity leg). Names and
 * geometry are theme-independent (light only).
 *
 * Functional only: no baselines, no screenshots. Placement follows the
 * bank sweep (built-docs webServer lane; `pnpm test:visual` is the CI
 * gate — the executor never runs it; the orchestrator validates scoped).
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

interface TjSweepTarget {
  component: string;
  story: string;
  /** EXACT distinct tj-kit Tab stops (source-derived; order is not pinned) —
   * a story adding/removing an interactive surface must update this
   * deliberately (the 5.1 deliberate-update contract). */
  stops: number;
  /** KIT interactive surfaces the light deep scan must find (>= floor). */
  minKitSurfaces: number;
  /** Pattern rows: story-chrome stops are asserted too (ring geometry +
   * name on EVERY stop) and `totalStops` pins the full walk length. */
  assertAllStops?: boolean;
  /** PATTERN rows only: the EXACT total (kit + chrome) forward-walk length. */
  totalStops?: number;
  /** FR-21 boundary story (ad-slot-recipe): tk-* hosts count as kit stops
   * too — the one sanctioned both-families composition point. */
  countBankHosts?: boolean;
  /** Recorded sub-44×44 kit surfaces, grammar 'hostTag .class' (the two
   * extraction-licensed chip heights — derivations in the registry). */
  subFloorExempt?: string[];
}

/**
 * TSWEEP — all 68 built ТЖ story ids (docs dist index, sorted). Stop
 * derivations cite the story source's interactive set; skeleton/anatomy
 * inert hosts render NO href attribute (the 16.1 rule) hence no stop.
 */
const TSWEEP: readonly TjSweepTarget[] = [
  // --- tj-prose ------------------------------------------------------------------
  // playground: static typography canvas, zero interactives.
  { component: 'tj-prose', story: 'tj-prose--playground', stops: 0, minKitSurfaces: 0 },
  // species: 1 tj-link (shadow anchor) + 1 top-level slotted <a> (::slotted(a) species).
  { component: 'tj-prose', story: 'tj-prose--species', stops: 2, minKitSurfaces: 2 },
  // composition: 2 tj-link + 1 tj-cta (rubric chips + body link + subscribe CTA).
  { component: 'tj-prose', story: 'tj-prose--composition', stops: 3, minKitSurfaces: 3 },
  // accessibility: LIVE keyboard figure — 1 tj-link + 1 tj-cta (tables are text).
  { component: 'tj-prose', story: 'tj-prose--accessibility', stops: 2, minKitSurfaces: 2 },
  // --- tj-link -------------------------------------------------------------------
  // playground: 2 live links in prose.
  { component: 'tj-link', story: 'tj-link--playground', stops: 2, minKitSurfaces: 2 },
  // species: 3 links (rest / hover / focus species).
  { component: 'tj-link', story: 'tj-link--species', stops: 3, minKitSurfaces: 3 },
  // anchor-contract: 2 live (_blank, rel=next) + 1 inert href="" (NO stop).
  { component: 'tj-link', story: 'tj-link--anchor-contract', stops: 2, minKitSurfaces: 2 },
  // accessibility: tables only.
  { component: 'tj-link', story: 'tj-link--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-cta --------------------------------------------------------------------
  // playground: 1 CTA.
  { component: 'tj-cta', story: 'tj-cta--playground', stops: 1, minKitSurfaces: 1 },
  // anatomy: 2 CTAs (44-box species).
  { component: 'tj-cta', story: 'tj-cta--anatomy', stops: 2, minKitSurfaces: 2 },
  // anchor-contract: 1 live + 1 inert href="" (no stop).
  { component: 'tj-cta', story: 'tj-cta--anchor-contract', stops: 1, minKitSurfaces: 1 },
  // accessibility: tables only.
  { component: 'tj-cta', story: 'tj-cta--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-rubric-header ------------------------------------------------------------
  // all three stories: pure display surfaces (cover + heading + counters text), zero interactives.
  { component: 'tj-rubric-header', story: 'tj-rubric-header--playground', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-rubric-header', story: 'tj-rubric-header--anatomy', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-rubric-header', story: 'tj-rubric-header--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-news-card ----------------------------------------------------------------
  // playground: 2 live cards, one row-as-link anchor each.
  { component: 'tj-news-card', story: 'tj-news-card--playground', stops: 2, minKitSurfaces: 2 },
  // anatomy: 1 live (#anatomy) + 1 inert href="" (renders NO href — no stop).
  { component: 'tj-news-card', story: 'tj-news-card--anatomy', stops: 1, minKitSurfaces: 1 },
  // skeleton: skeleton host renders NO anchor (bones are aria-hidden) + 1 live
  // comparison card — the spec's "bones-only" edge row refers to the skeleton
  // HOST contributing zero; the story's live sibling is the 1.
  { component: 'tj-news-card', story: 'tj-news-card--skeleton', stops: 1, minKitSurfaces: 1 },
  // accessibility: tables only.
  { component: 'tj-news-card', story: 'tj-news-card--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-tag-chip -----------------------------------------------------------------
  // playground: 4 live chips. RECORDED sub-floor: the 40px pill is the
  // census-measured reference height (16.2 twin-pin; a 44px chip would
  // violate the extraction) — exemption recorded, not silent.
  {
    component: 'tj-tag-chip',
    story: 'tj-tag-chip--playground',
    stops: 4,
    minKitSurfaces: 4,
    subFloorExempt: ['tj-tag-chip .chip'],
  },
  // anchor-contract: 2 live (_blank, _blank+rel) + 1 inert href="" (no stop).
  {
    component: 'tj-tag-chip',
    story: 'tj-tag-chip--anchor-contract',
    stops: 2,
    minKitSurfaces: 2,
    subFloorExempt: ['tj-tag-chip .chip'],
  },
  // PATTERN: 4 live chips + the hero CTA anchor (STORY chrome — .tjpro-hero__cta
  // rides the §9 inline exemption; assertAllStops asserts chrome rings GEOMETRY
  // + non-transparent only — the exact-token law belongs to kit surfaces).
  {
    component: 'tj-tag-chip',
    story: 'tj-tag-chip--pro-hero-pattern',
    stops: 4,
    minKitSurfaces: 4,
    totalStops: 5,
    assertAllStops: true,
    subFloorExempt: ['tj-tag-chip .chip'],
  },
  // accessibility: tables only.
  { component: 'tj-tag-chip', story: 'tj-tag-chip--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-composer -----------------------------------------------------------------
  // playground: 2 hosts, each renders ONE shadow fake-input button.
  { component: 'tj-composer', story: 'tj-composer--playground', stops: 2, minKitSurfaces: 2 },
  // anatomy: 2 hosts (avatar-slotted + whitespace-label ghost) — both render buttons.
  { component: 'tj-composer', story: 'tj-composer--anatomy', stops: 2, minKitSurfaces: 2 },
  // accessibility: tables only.
  { component: 'tj-composer', story: 'tj-composer--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-post-card ----------------------------------------------------------------
  // playground: 1 live card (row-as-link).
  { component: 'tj-post-card', story: 'tj-post-card--playground', stops: 1, minKitSurfaces: 1 },
  // anatomy: 2 live (#anatomy, #clamp) + 1 inert href="" (no stop).
  { component: 'tj-post-card', story: 'tj-post-card--anatomy', stops: 2, minKitSurfaces: 2 },
  // PATTERN: 1 composer (1 button) + 3 post cards (1 anchor each) — all kit.
  {
    component: 'tj-post-card',
    story: 'tj-post-card--community-pattern',
    stops: 4,
    minKitSurfaces: 4,
    totalStops: 4,
    assertAllStops: true,
  },
  // accessibility: tables only.
  { component: 'tj-post-card', story: 'tj-post-card--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-header -------------------------------------------------------------------
  // ALL FOUR stories render the same headerBlock: wordmark slotted anchor +
  // 5 nav chips + slotted «Поиск» action button + theme button + CTA anchor
  // = 9 kit-family stops (slotted interiors count through the host).
  // RECORDED sub-floor: .chip min-height 36px is the authored capture-estimate
  // pill (tj-header.css.ts FLAG) — the WEAKEST recorded exemption, a re-measure
  // candidate for the orchestrator's triage round.
  ...(
    [
      ['tj-header--playground', 'Песочница'],
      ['tj-header--anatomy', 'Анатомия'],
      ['tj-header--theme-contract', 'Контракт темы'],
      ['tj-header--accessibility', 'Доступность'],
    ] as const
  ).map(([story]) => ({
    component: 'tj-header',
    story,
    stops: 9,
    minKitSurfaces: 9,
    subFloorExempt: ['tj-header .chip'],
  })),
  // --- tj-rail ---------------------------------------------------------------------
  // playground: 5 rows (RAIL_ITEMS); burger display:none at ≥1200; sheet hidden.
  { component: 'tj-rail', story: 'tj-rail--playground', stops: 5, minKitSurfaces: 5 },
  // anatomy: 1 rail × 5 rows.
  { component: 'tj-rail', story: 'tj-rail--anatomy', stops: 5, minKitSurfaces: 5 },
  // chrome-composition PATTERN-equivalent (not flagged assertAllStops — the
  // 16.5 pattern, verified at walk level): header 6 (wordmark + 3 chips +
  // theme + CTA — NO actions slot) + rail 5 + 2 news cards × 1 anchor = 13.
  {
    component: 'tj-rail',
    story: 'tj-rail--chrome-composition',
    stops: 13,
    minKitSurfaces: 13,
    subFloorExempt: ['tj-header .chip'],
  },
  // drawer: as-rendered CLOSED (the demo button is story chrome, the sheet is
  // hidden) — 5 rows; the OPEN-state contract rides the SR pin below.
  { component: 'tj-rail', story: 'tj-rail--drawer', stops: 5, minKitSurfaces: 5 },
  // accessibility: tables only.
  { component: 'tj-rail', story: 'tj-rail--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-article-page ---------------------------------------------------------------
  // PATTERN: kit 12 = header 6 (wordmark + 3 chips + theme + CTA) + rail 5 +
  // prose link 1; chrome 6 = 4 engage buttons + 2 demo toggles; the backrail
  // (4 buttons) is visibility-hidden until armed — zero stops by default.
  {
    component: 'tj-article-page',
    story: 'tj-article-page--page-composition',
    stops: 12,
    minKitSurfaces: 12,
    totalStops: 18,
    assertAllStops: true,
    subFloorExempt: ['tj-header .chip'],
  },
  // anatomy + accessibility: tables only.
  { component: 'tj-article-page', story: 'tj-article-page--anatomy', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-article-page', story: 'tj-article-page--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-ad-slot-recipe (FR-21 boundary story: tk-* hosts COUNT) --------------------
  // PATTERN: kit-family 6 = tj-rail 3 rows + 1 tj-link + 2 tk-promo-card CTAs;
  // chrome 1 = the .tjad-toggle (bank-chrome page, rings with the BANK border
  // token — geometry-only for chrome, exact tokens for kit families).
  {
    component: 'tj-ad-slot-recipe',
    story: 'tj-ad-slot-recipe--recipe',
    stops: 6,
    minKitSurfaces: 6,
    totalStops: 7,
    assertAllStops: true,
    countBankHosts: true,
  },
  // accessibility: tables only.
  { component: 'tj-ad-slot-recipe', story: 'tj-ad-slot-recipe--accessibility', stops: 0, minKitSurfaces: 0 },
  // --- tj-getting-started --------------------------------------------------------------
  // page (17.3 rewrite, re-derived): STILL zero kit interactives by design —
  // the expanded scaffold is text + install blocks + INLINE ?path/GitHub
  // anchors, all of it story chrome (family '' — uncounted in the walk,
  // name-checked in the scan); the live component-search demo is
  // deliberately NOT embedded (the 17.3 ruling: that page stays
  // non-interactive).
  { component: 'tj-getting-started', story: 'tj-getting-started--page', stops: 0, minKitSurfaces: 0 },
  // --- tj-token-reference (17.3) --------------------------------------------------------
  // all five stories: generated tables + non-interactive swatches/specimen
  // spans/SVG curve previews — zero interactive surfaces of ANY family.
  { component: 'tj-token-reference', story: 'tj-token-reference--colors', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-token-reference', story: 'tj-token-reference--typography', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-token-reference', story: 'tj-token-reference--surfaces', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-token-reference', story: 'tj-token-reference--motion', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-token-reference', story: 'tj-token-reference--registers', stops: 0, minKitSurfaces: 0 },
  // --- tj-theming-guide (17.3) ----------------------------------------------------------
  // switching: live demo stage = 1 tj-cta + 1 tj-link + 2 tj-tag-chip (the
  // chips ride the recorded 40px sub-floor exemption; code blocks are
  // pre[tabindex] chrome — NOT matched by the scan SELECTOR).
  {
    component: 'tj-theming-guide',
    story: 'tj-theming-guide--switching',
    stops: 4,
    minKitSurfaces: 4,
    subFloorExempt: ['tj-tag-chip .chip'],
  },
  // overrides: default CTA + link-body-overridden CTA (the purple pair
  // override ships as CODE ONLY — rendering it would mint a text-leftover
  // for the 17.2 dark sweep).
  { component: 'tj-theming-guide', story: 'tj-theming-guide--overrides', stops: 2, minKitSurfaces: 2 },
  // dark-pairing: 1 tj-cta + 1 tj-link in the pairing stage.
  { component: 'tj-theming-guide', story: 'tj-theming-guide--dark-pairing', stops: 2, minKitSurfaces: 2 },
  // --- the ten Api pages (17.3) ---------------------------------------------------------
  // api: manifest tables + the CONVENTIONS footer anchor (story chrome —
  // uncounted in the walk, name-checked in the scan). Zero kit hosts.
  ...(
    [
      'tj-prose--api',
      'tj-link--api',
      'tj-cta--api',
      'tj-rubric-header--api',
      'tj-news-card--api',
      'tj-tag-chip--api',
      'tj-composer--api',
      'tj-post-card--api',
      'tj-header--api',
      'tj-rail--api',
    ] as const
  ).map((story) => ({
    component: story.replace(/--api$/, ''),
    story,
    stops: 0,
    minKitSurfaces: 0,
  })),
  // --- TJ/Patterns pages (17.3) ---------------------------------------------------------
  // Page rows (article/rubric/community/pro): adoption maps — text + inline
  // ?path anchors, all chrome (the chrome-composition precedent: kit-only
  // counts, no assertAllStops).
  { component: 'tj-patterns-article', story: 'tj-patterns-article--page', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-patterns-rubric', story: 'tj-patterns-rubric--page', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-patterns-community', story: 'tj-patterns-community--page', stops: 0, minKitSurfaces: 0 },
  { component: 'tj-patterns-pro', story: 'tj-patterns-pro--page', stops: 0, minKitSurfaces: 0 },
  // rubric Demo: the live composition — 4 tj-news-card row-as-link anchors;
  // tj-rubric-header is a pure display surface (zero interactives).
  { component: 'tj-patterns-rubric', story: 'tj-patterns-rubric--demo', stops: 4, minKitSurfaces: 4 },
];

/**
 * The per-surface ring tokens, resolved from the live themed document root
 * (never hardcoded — light and dark resolve differently). All comparisons
 * happen in the computed `rgb(r, g, b)` serialization Chromium produces.
 */
interface RingTokens {
  tjRing: string;
  chipInk: string;
  tkRing: string;
  /** The purple field family (chip-fill + badge-purple) — surfaces painted
   * one of these ring with chip-ink (the 16.3 surface-AA law). */
  purpleField: string[];
}

function resolveRingTokens(page: Page): Promise<RingTokens> {
  return page.evaluate(() => {
    const read = (name: string): string => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      // Both 3- and 6-digit hex normalize to Chromium's rgb() serialization —
      // the sheet declares --tj-color-chip-ink as #fff (the run-2 lesson: a
      // bare '#fff' never equals the computed ring color it MATCHES).
      const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(raw);
      if (hex) {
        const digits =
          hex[1].length === 3
            ? [...hex[1]].map((c) => c + c).join('')
            : hex[1];
        const r = parseInt(digits.slice(0, 2), 16);
        const g = parseInt(digits.slice(2, 4), 16);
        const b = parseInt(digits.slice(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }
      return raw;
    };
    return {
      tjRing: read('--tj-color-focus-ring'),
      chipInk: read('--tj-color-chip-ink'),
      tkRing: read('--tk-color-focus-ring'),
      purpleField: [
        read('--tj-color-chip-fill'),
        read('--tj-color-badge-purple'),
      ].filter((value) => value.startsWith('rgb(')),
    };
  });
}

/**
 * ONE Tab stop probe (ТЖ edition): reads the DEEPEST active element, then
 * the family (tj / tk / chrome) and the self-carried ring. Passed as a real
 * function (Playwright 1.63 no longer CALLS string arrows in evaluate).
 * The boolean argument turns on tk-* host counting for the FR-21 boundary
 * story; the sibling / .field / ringAncestor carriers of the bank mold are
 * deliberately absent — every ТЖ ring is self-carried.
 */
function probeStop(countBankHosts: boolean): TjStopProbe | null {
  const deepActive = (): Element | null => {
    let node = document.activeElement;
    while (node && node.shadowRoot && node.shadowRoot.activeElement) {
      node = node.shadowRoot.activeElement;
    }
    return node instanceof Element ? node : null;
  };
  const el = deepActive();
  if (!el || el === document.body) return null;
  // A ring only satisfies the contract when it RENDERS (the mold's
  // permissive-carrier fix): a hidden or display:none carrier paints nothing.
  const readRing = (target: Element): {
    carrier: string;
    width: string;
    style: string;
    offset: string;
    color: string;
  } | null => {
    const style = getComputedStyle(target);
    const renders =
      target.getClientRects().length > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0';
    if (!renders) return null;
    return {
      carrier: target === el ? 'self' : target.tagName.toLowerCase(),
      width: style.outlineWidth,
      style: style.outlineStyle,
      offset: style.outlineOffset,
      color: style.outlineColor,
    };
  };
  // FAMILY: nearest kit-prefixed host through parentElement / shadow-host —
  // '' is story chrome. Slotted light content (wordmark anchors, action
  // buttons, promo CTAs) resolves through its light-DOM host ancestor.
  const family = (node: Element): 'tj' | 'tk' | '' => {
    let current: Element | null = node;
    while (current) {
      const tag = current.tagName.toLowerCase();
      if (tag.startsWith('tj-')) return 'tj';
      if (tag.startsWith('tk-')) return countBankHosts ? 'tk' : '';
      const root = current.getRootNode();
      current = root instanceof ShadowRoot ? root.host : current.parentElement;
    }
    return '';
  };
  const anchorStyle = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const rootNode = el.getRootNode();
  const host = rootNode instanceof ShadowRoot ? rootNode.host.tagName.toLowerCase() : '';
  // Names cross the slot boundary (the mold): a shadow element's own
  // textContent is empty when the label rides slotted light content.
  const slotText = (node: Element): string => {
    let text = node.textContent?.trim() ?? '';
    if (!text) {
      for (const slot of Array.from(node.querySelectorAll('slot'))) {
        text += slot
          .assignedNodes({ flatten: true })
          .map((assigned) => assigned.textContent?.trim() ?? '')
          .join(' ');
      }
    }
    return text.trim();
  };
  // Stable per-ELEMENT ordinal (page-persistent Map) — same-shaped stops stay
  // distinct and a revisited ordinal closes the walk cycle.
  const seen = (window as typeof window & { __tjSweepOrd?: Map<Element, number> });
  seen.__tjSweepOrd ??= new Map();
  if (!seen.__tjSweepOrd.has(el)) seen.__tjSweepOrd.set(el, seen.__tjSweepOrd.size);
  return {
    tag: el.tagName.toLowerCase(),
    classes: el.getAttribute('class') ?? '',
    host,
    role: el.getAttribute('role') ?? '',
    href: el.tagName === 'A' ? el.getAttribute('href') : null,
    name: el.getAttribute('aria-label') ?? slotText(el).slice(0, 60),
    display: anchorStyle.display,
    textDecorationLine: anchorStyle.textDecorationLine,
    textDecorationColor: anchorStyle.textDecorationColor,
    bg: anchorStyle.backgroundColor,
    family: family(el),
    width: rect.width,
    height: rect.height,
    ordinal: seen.__tjSweepOrd.get(el) ?? -1,
    rings: [readRing(el)].filter((ring): ring is NonNullable<typeof ring> => ring !== null),
  };
}

interface TjStopProbe {
  tag: string;
  classes: string;
  host: string;
  role: string;
  href: string | null;
  name: string;
  display: string;
  textDecorationLine: string;
  textDecorationColor: string;
  bg: string;
  family: 'tj' | 'tk' | '';
  width: number;
  height: number;
  ordinal: number;
  rings: Array<{ carrier: string; width: string; style: string; offset: string; color: string }>;
}

/** Distinct-stop identity: the per-element ordinal (shape+name can collide). */
const stopKey = (stop: TjStopProbe): string => `#${stop.ordinal}`;

/**
 * The §9 underline exception table — ships EMPTY by design (probe10: ТЖ
 * links GET 2px rings; the reference's underline-only focus is superseded
 * by the kit's improvement layer). Kept as a typed const for mold parity.
 */
const UNDERLINE_EXCEPTIONS: readonly string[] = [];

type RingSubject = Pick<
  TjStopProbe,
  'rings' | 'tag' | 'classes' | 'host' | 'textDecorationLine' | 'textDecorationColor'
>;

/**
 * The unified-ring contract per stop. `expectedColor` null = story chrome:
 * geometry + a non-transparent paint (pattern pages mix token worlds); a
 * kit stop demands the EXACT family-resolved token color. The underline
 * exception grammar is retained (mold parity) over an always-empty table.
 */
function ringFailures(stop: RingSubject, expectedColor: string | null): string[] {
  const failures: string[] = [];
  const geometry = (ring: { width: string; style: string; offset: string }): boolean =>
    ring.width === '2px' && ring.style === 'solid' && ring.offset === '2px';
  const qualifies = stop.rings.some(
    (ring) =>
      geometry(ring) &&
      (expectedColor !== null
        ? ring.color === expectedColor
        : ring.color !== 'rgba(0, 0, 0, 0)'),
  );
  if (qualifies) return failures;
  const isUnderlineCarrier = UNDERLINE_EXCEPTIONS.some((selector) => {
    const [hostTag, ...rest] = selector.split(' ');
    const inner = rest.join(' ');
    return stop.host === hostTag && (inner === '' || stop.classes.split(/\s+/).some((c) => `.${c}` === inner));
  });
  if (
    isUnderlineCarrier &&
    stop.textDecorationLine.includes('underline') &&
    stop.textDecorationColor !== 'rgba(0, 0, 0, 0)'
  ) {
    return failures;
  }
  failures.push(
    `no unified ring (2px solid offset 2px${expectedColor !== null ? ` ${expectedColor}` : ' (any non-transparent)'}) on <${stop.tag} class="${stop.classes}"> in ${stop.host || 'document'} — rings seen: ${JSON.stringify(stop.rings)}; underline: ${stop.textDecorationLine}/${stop.textDecorationColor}`,
  );
  return failures;
}

/** The expected ring color for one kit stop, per the 16.3 surface law. */
function expectedRingColor(stop: TjStopProbe, tokens: RingTokens): string | null {
  if (stop.family === 'tk') return tokens.tkRing;
  if (stop.family === 'tj') {
    return tokens.purpleField.includes(stop.bg) ? tokens.chipInk : tokens.tjRing;
  }
  return null;
}

async function openStory(page: Page, story: string, theme: 'light' | 'dark'): Promise<void> {
  await page.goto(buildStoryUrl(story, theme));
  await waitForStorySettled(page);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-tj-theme', 'dark');
  }
  // Normalize the walk start: release any mount-placed focus.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  });
}

for (const target of TSWEEP) {
  const isPattern = target.assertAllStops === true;

  for (const theme of THEMES) {
    test(`tj-a11y-sweep walk: ${target.component} — ${target.story} — Tab stops ringed [${theme}]`, async ({
      page,
    }) => {
      await openStory(page, target.story, theme);
      const tokens = await resolveRingTokens(page);

      // --- Forward Tab walk: collect stops until the cycle closes on a
      // REVISITED ordinal. KIT stops (family tj, plus tk on the boundary
      // story) are count- and ring-asserted; chrome stops ride along for
      // the traversal record (and are fully asserted on pattern rows).
      const forward: TjStopProbe[] = [];
      const kitStops: TjStopProbe[] = [];
      for (let press = 0; press < 80; press += 1) {
        await page.keyboard.press('Tab');
        const stop = await page.evaluate(probeStop, target.countBankHosts === true);
        if (stop === null) break;
        const key = stopKey(stop);
        if (forward.some((seenStop) => stopKey(seenStop) === key)) break; // cycle closed
        forward.push(stop);
        if (stop.family !== '') kitStops.push(stop);
      }
      expect(
        kitStops.length,
        `${target.component} (${target.story}): EXACT kit Tab stop count — the story's interactive surface set changed; re-measure and update TSWEEP deliberately`,
      ).toBe(target.stops);
      if (isPattern) {
        expect(
          forward.length,
          `${target.component} (${target.story}): PATTERN row — the TOTAL stop count (kit + deliberate story chrome) changed`,
        ).toBe(target.totalStops);
      }

      const failures = forward
        .filter((stop) => stop.family !== '' || isPattern)
        .flatMap((stop) => ringFailures(stop, expectedRingColor(stop, tokens)));
      expect(failures, failures.join('\n')).toEqual([]);

      // --- Shift+Tab walk: the reverse traversal revisits the SAME stops
      // (ordinals persist across both walks — compare the ordinal sets).
      const reverseKeys = new Set(forward.map(stopKey));
      const revisited = new Set<string>();
      for (let press = 0; press < forward.length + 2; press += 1) {
        await page.keyboard.press('Shift+Tab');
        const stop = await page.evaluate(probeStop, target.countBankHosts === true);
        if (stop === null) break;
        const key = stopKey(stop);
        if (revisited.has(key)) break;
        revisited.add(key);
        expect(
          reverseKeys.has(key),
          `Shift+Tab reached ordinal ${key} (<${stop.tag} class="${stop.classes}">) which the forward walk never visited`,
        ).toBe(true);
      }
      for (const key of reverseKeys) {
        expect(revisited.has(key), `Shift+Tab never revisited ${key}`).toBe(true);
      }
    });
  }

  test(`tj-a11y-sweep scan: ${target.component} — ${target.story} — every visible interactive element named, ≥44×44 (or ruled)`, async ({
    page,
  }) => {
    await openStory(page, target.story, 'light');
    const interactive = await page.evaluate((countBankHosts: boolean) => {
      const SELECTOR =
        'a[href], button, input, select, textarea, [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"], [role="option"], [role="menuitem"]';
      interface ScanEntry {
        host: string;
        tag: string;
        classes: string;
        name: string;
        width: number;
        height: number;
        display: string;
        family: 'tj' | 'tk' | '';
      }
      const resolveName = (el: Element): string => {
        const root = el.getRootNode();
        const byId = (el.getAttribute('aria-labelledby') ?? '')
          .split(/\s+/)
          .filter(Boolean)
          .map((id) =>
            root instanceof ShadowRoot || root instanceof Document
              ? root.getElementById?.(id)
              : null,
          )
          .map((ref) => (ref instanceof Element ? ref.textContent?.trim() ?? '' : ''))
          .join(' ')
          .trim();
        if (byId) return byId;
        const attr = (name: string): string | null => el.getAttribute(name)?.trim() || null;
        const ariaLabel = attr('aria-label');
        if (ariaLabel) return ariaLabel;
        const alt = attr('alt');
        if (alt) return alt;
        const title = attr('title');
        if (title) return title;
        if (el.id) {
          const label =
            root instanceof ShadowRoot || root instanceof Document
              ? root.querySelector?.(`label[for="${CSS.escape(el.id)}"]`)
              : null;
          if (label?.textContent?.trim()) return label.textContent.trim();
        }
        const wrapper = el.closest('label');
        if (wrapper?.textContent?.trim()) return wrapper.textContent.trim();
        // Slotted labels: the shadow element's own text is empty — the label
        // rides the assigned light content (tag-chip labels, rail rows).
        const slots = el.querySelectorAll('slot');
        for (const slot of slots) {
          const assigned = slot
            .assignedNodes({ flatten: true })
            .map((node) => node.textContent?.trim() ?? '')
            .join(' ')
            .trim();
          if (assigned) return assigned;
        }
        return el.textContent?.trim() ?? '';
      };
      const family = (node: Element): 'tj' | 'tk' | '' => {
        let current: Element | null = node;
        while (current) {
          const tag = current.tagName.toLowerCase();
          if (tag.startsWith('tj-')) return 'tj';
          if (tag.startsWith('tk-')) return countBankHosts ? 'tk' : '';
          const root = current.getRootNode();
          current = root instanceof ShadowRoot ? root.host : current.parentElement;
        }
        return '';
      };
      const results: ScanEntry[] = [];
      const walk = (rootNode: ParentNode): void => {
        for (const el of rootNode.querySelectorAll('*')) {
          if (el.closest('[aria-hidden="true"]')) continue;
          if (!el.matches(SELECTOR)) {
            if (el.shadowRoot) walk(el.shadowRoot);
            continue;
          }
          if (el instanceof HTMLInputElement && el.type === 'hidden') continue;
          const style = getComputedStyle(el);
          const visible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            el.getClientRects().length > 0;
          if (visible) {
            // The EFFECTIVE box: an input inside a wrapping <label> is
            // clickable across the whole label; a link with a whole-area
            // ::after stitch is clickable across the stitched ancestor.
            const label = el.closest('label');
            let measure = label ?? el;
            const pseudo = getComputedStyle(el, '::after');
            const stitched =
              pseudo.content !== 'none' &&
              pseudo.position === 'absolute' &&
              [pseudo.top, pseudo.right, pseudo.bottom, pseudo.left].every(
                (inset) => inset === '0px',
              );
            if (stitched) {
              for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
                if (getComputedStyle(ancestor).position !== 'static') {
                  measure = ancestor;
                  break;
                }
              }
            }
            const rect = measure.getBoundingClientRect();
            const rootNode = el.getRootNode();
            const host =
              rootNode instanceof ShadowRoot
                ? rootNode.host.tagName.toLowerCase()
                : '';
            results.push({
              host,
              tag: el.tagName.toLowerCase(),
              classes: el.getAttribute('class') ?? '',
              name: resolveName(el),
              width: rect.width,
              height: rect.height,
              display: style.display,
              family: family(el),
            });
          }
          if (el.shadowRoot) walk(el.shadowRoot);
        }
      };
      walk(document);
      return results;
    }, target.countBankHosts === true);

    const kitSurfaces = interactive.filter((el: { family: string }) => el.family !== '');
    expect(
      kitSurfaces.length,
      `${target.component}: KIT interactive surfaces found in ${target.story}`,
    ).toBeGreaterThanOrEqual(target.minKitSurfaces);

    // Recorded sub-floor kit surfaces, grammar 'hostTag .class' (the two
    // extraction-licensed chip heights — derivations in the TSWEEP registry).
    const subFloorExempt = target.subFloorExempt ?? [];
    const isSubFloorExempt = (el: { host: string; classes: string }): boolean =>
      subFloorExempt.some((selector) => {
        const [hostTag, ...rest] = selector.split(' ');
        const inner = rest.join(' ');
        return el.host === hostTag && el.classes.split(/\s+/).some((c) => `.${c}` === inner);
      });

    const failures: string[] = [];
    for (const el of interactive) {
      // Names: EVERY visible interactive element (story chrome included — a
      // nameless demo trigger is an axe failure in the visual suite too).
      if (!el.name) {
        failures.push(`nameless interactive <${el.tag} class="${el.classes}"> in ${el.host || 'document'}`);
      }
      // Geometry: the ≥44×44 floor is the kit's contract; §9 exempts anchors
      // flowing inline in prose; the recorded chip exemptions ride above.
      const textTarget = el.tag === 'a' && el.display === 'inline';
      const exempt = textTarget || isSubFloorExempt(el);
      if (el.family !== '' && !exempt && (el.width < 44 || el.height < 44)) {
        failures.push(
          `<${el.tag} class="${el.classes}"> in ${el.host || 'document'} is ${el.width}×${el.height}px (floor 44×44; inline-prose anchors and the recorded chip exemptions are the only ruled exceptions)`,
        );
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
}

// --- SR state pins (spec 17.1) — computed role/state at DOM level ---------------
//
// Live VoiceOver stays maintainer-side (METHOD.md §SR boundary); these pins
// mechanize the STATE half of the SR contract so the v1.4.0 runsheet's
// expected announcements rest on verified DOM truth.

test.describe('tj-a11y-sweep SR state pins', () => {
  test('tj-composer: the fake-input is a <button type="button">, ghost-named when unlabeled; host aria-label forwards and WINS', async ({
    page,
  }) => {
    await openStory(page, 'tj-composer--playground', 'light');
    const state = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('main tj-composer'));
      const read = (host: Element) => {
        const button = host.shadowRoot?.querySelector('.composer');
        return {
          hostLabelAttr: host.getAttribute('aria-label') ?? '',
          childTag: button?.tagName.toLowerCase() ?? '(none)',
          childType: button?.getAttribute('type') ?? '',
          childIsInput: button instanceof HTMLInputElement,
          childAriaLabel: button?.getAttribute('aria-label') ?? '',
          childText: button?.textContent?.trim() ?? '',
          childLabelSpan:
            button?.querySelector('.composer__label')?.textContent?.trim() ?? '',
        };
      };
      return { total: hosts.length, rows: hosts.map(read) };
    });
    // The 16.4 load-bearing ruling: button-not-input — a real button carries
    // role/name/activation natively; an input would smuggle in text-cursor
    // semantics the fake composer does not have.
    expect(state.total).toBe(2);
    for (const row of state.rows) {
      expect(row.childTag).toBe('button');
      expect(row.childIsInput).toBe(false);
      expect(row.childType).toBe('button');
    }
    // Both playground hosts carry labels; the label renders as the span text
    // and (without a host aria-label) the button name is that text.
    expect(state.rows[0]?.childLabelSpan).toBe('Написать пост или вопрос…');
    expect(state.rows[1]?.childLabelSpan).toBe('Спросите сообщество');

    // The @property({attribute:'aria-label'}) forward: setting the host's
    // aria-label re-renders the shadow button with the SAME aria-label —
    // and the attribute-sourced name outranks the label text.
    const forwarded = await page.evaluate(async () => {
      const host = document.querySelector('main tj-composer') as
        | (HTMLElement & { updateComplete: Promise<unknown> })
        | null;
      if (!host) return null;
      host.setAttribute('aria-label', 'Открыть редактор поста');
      await host.updateComplete;
      const button = host.shadowRoot?.querySelector('.composer');
      return {
        hostAttr: host.getAttribute('aria-label'),
        buttonAriaLabel: button?.getAttribute('aria-label') ?? '',
        buttonText: button?.textContent?.trim() ?? '',
      };
    });
    expect(forwarded, 'the playground still renders its composer').not.toBeNull();
    expect(forwarded?.hostAttr).toBe('Открыть редактор поста');
    expect(forwarded?.buttonAriaLabel).toBe('Открыть редактор поста');

    // Anatomy: pins the FIRST host only (the ghost-fallback row — the second
    // host's whitespace-only light content — is covered by the walk legs
    // where its stop is ringed and named); the avatar tile is DECORATIVE
    // chrome (aria-hidden) and contributes nothing to the name.
    await openStory(page, 'tj-composer--anatomy', 'light');
    const anatomyState = await page.evaluate(() => {
      const host = document.querySelector('main tj-composer');
      const button = host?.shadowRoot?.querySelector('.composer');
      return {
        childTag: button?.tagName.toLowerCase() ?? '(none)',
        childAriaLabel: button?.getAttribute('aria-label') ?? '',
        childText: button?.textContent?.trim() ?? '',
        decorHidden: Array.from(
          host?.shadowRoot?.querySelectorAll('[aria-hidden="true"]') ?? [],
        ).length,
      };
    });
    expect(anatomyState.childTag).toBe('button');
    expect(anatomyState.decorHidden, 'the avatar tile is aria-hidden decoration').toBeGreaterThan(0);
  });

  test('tj-rail drawer: reflected `open`, burger aria-expanded/aria-controls, dialog semantics; programmatic open at 1280; Esc closes', async ({
    page,
  }) => {
    // 1280×800 (the pinned viewport): the burger itself is display:none —
    // the story's OWN point is that the sheet mechanics are NOT gated on
    // the burger's media query (programmatic open works at any width).
    await openStory(page, 'tj-rail--drawer', 'light');
    const closed = await page.evaluate(() => {
      const rail = document.querySelector('#tjrl-drawer-demo') as
        | (HTMLElement & { open: boolean })
        | null;
      const root = rail?.shadowRoot;
      const burger = root?.querySelector('.burger');
      const sheet = root?.querySelector('.sheet');
      return {
        hasRail: rail !== null,
        openProp: rail?.open ?? null,
        openAttr: rail?.hasAttribute('open') ?? false,
        burgerTag: burger?.tagName.toLowerCase() ?? '(none)',
        burgerLabel: burger?.getAttribute('aria-label') ?? '',
        burgerExpanded: burger?.getAttribute('aria-expanded') ?? '',
        burgerControls: burger?.getAttribute('aria-controls') ?? '',
        burgerDisplay: burger ? getComputedStyle(burger).display : '',
        sheetId: sheet?.id ?? '',
        sheetRole: sheet?.getAttribute('role') ?? '',
        sheetModal: sheet?.getAttribute('aria-modal') ?? '',
        sheetLabel: sheet?.getAttribute('aria-label') ?? '',
        sheetHidden: sheet instanceof HTMLElement ? sheet.hidden : true,
        sheetLinks: sheet?.querySelectorAll('a.row').length ?? 0,
      };
    });
    expect(closed.hasRail).toBe(true);
    expect(closed.openProp).toBe(false);
    expect(closed.openAttr).toBe(false);
    expect(closed.burgerTag).toBe('button');
    expect(closed.burgerLabel).toBe('Разделы');
    expect(closed.burgerExpanded).toBe('false');
    expect(closed.burgerControls, 'aria-controls resolves at the sheet id').toBe(closed.sheetId);
    expect(closed.burgerDisplay).toBe('none'); // ≥1200px: invisible, mechanics ungated
    expect(closed.sheetRole).toBe('dialog');
    expect(closed.sheetModal).toBe('true');
    expect(closed.sheetLabel).toBe('Разделы');
    expect(closed.sheetHidden).toBe(true);
    expect(closed.sheetLinks).toBe(5);

    // Programmatic open (the story's demo button writes rail.open = true).
    await page.click('.tjrl-demo-button');
    const opened = await page.evaluate(() => {
      const rail = document.querySelector('#tjrl-drawer-demo') as
        | (HTMLElement & { open: boolean })
        | null;
      const sheet = rail?.shadowRoot?.querySelector('.sheet');
      let node = document.activeElement as Element | null;
      const chain: string[] = [];
      while (node) {
        chain.push(
          `${node.tagName.toLowerCase()}${node.className && typeof node.className === 'string' ? `.${node.className.split(/\s+/)[0]}` : ''}`,
        );
        node = node.shadowRoot?.activeElement ?? null;
      }
      return {
        openProp: rail?.open ?? false,
        openAttr: rail?.hasAttribute('open') ?? false,
        burgerExpanded: rail?.shadowRoot?.querySelector('.burger')?.getAttribute('aria-expanded') ?? '',
        sheetHidden: sheet instanceof HTMLElement ? sheet.hidden : true,
        sheetInTree: sheet?.isConnected ?? false,
        activeChain: chain.join(' > '),
      };
    });
    expect(opened.openProp).toBe(true);
    expect(opened.openAttr, 'open is a REFLECTED boolean channel').toBe(true);
    expect(opened.burgerExpanded).toBe('true');
    expect(opened.sheetHidden).toBe(false);
    expect(
      opened.activeChain,
      'the trap placed focus inside the sheet (first row link)',
    ).toContain('.row');

    // Esc closes: open false, aria-expanded false, sheet hidden again. At
    // 1280 the restore target (burger) is display:none — focus falls to body.
    await page.keyboard.press('Escape');
    const afterEsc = await page.evaluate(() => {
      const rail = document.querySelector('#tjrl-drawer-demo') as
        | (HTMLElement & { open: boolean })
        | null;
      const sheet = rail?.shadowRoot?.querySelector('.sheet');
      const active = document.activeElement;
      return {
        openProp: rail?.open ?? true,
        burgerExpanded: rail?.shadowRoot?.querySelector('.burger')?.getAttribute('aria-expanded') ?? '',
        sheetHidden: sheet instanceof HTMLElement ? sheet.hidden : false,
        // The LIFO truth: the trap restores the PRE-TRAP focus target — for a
        // PROGRAMMATIC open (rail.open = true from the demo click) that is the
        // demo button, NOT the display:none burger.
        focusOnInvoker:
          active instanceof HTMLElement && active.classList.contains('tjrl-demo-button'),
        focusOnBody: active === document.body,
        scrollLocked: document.documentElement.style.overflow !== '',
      };
    });
    expect(afterEsc.openProp).toBe(false);
    expect(afterEsc.burgerExpanded).toBe('false');
    expect(afterEsc.sheetHidden).toBe(true);
    expect(
      afterEsc.focusOnInvoker,
      'Esc restores the PRE-TRAP focus (LIFO): programmatic open came from the demo click — focus returns to the demo button, not the burger (the unit-pinned LIFO restore is the belt)',
    ).toBe(true);
  });

  test('tj-header theme control: stateless cycle light → dark → auto → light with RU announcements + theme-change detail strings', async ({
    page,
  }) => {
    await openStory(page, 'tj-header--theme-contract', 'light');
    const baseline = await page.evaluate(() => {
      const host = document.querySelector('main tj-header');
      const button = host?.shadowRoot?.querySelector('button.theme');
      const live = host?.shadowRoot?.querySelector('.visually-hidden[aria-live="polite"]');
      return {
        buttonTag: button?.tagName.toLowerCase() ?? '(none)',
        buttonType: button?.getAttribute('type') ?? '',
        buttonAriaLabel: button?.getAttribute('aria-label') ?? '',
        glyphHidden:
          button?.querySelector('.theme__glyph')?.getAttribute('aria-hidden') === 'true',
        livePresent: live !== null,
        liveText: live?.textContent?.trim() ?? '',
        rootAttr: document.documentElement.getAttribute('data-tj-theme'),
      };
    });
    expect(baseline.buttonTag).toBe('button');
    expect(baseline.buttonType).toBe('button');
    expect(baseline.buttonAriaLabel).toBe('Переключить тему оформления');
    expect(baseline.glyphHidden).toBe(true);
    expect(baseline.livePresent).toBe(true);
    expect(baseline.liveText, 'silent until the first activation').toBe('');
    // The light URL pins data-tj-theme="light" (preview boot write).
    expect(baseline.rootAttr).toBe('light');

    // The stateless cycle: each click reads the document root FRESH. A
    // window-scoped listener captures the composed theme-change events.
    await page.evaluate(() => {
      const log = window as typeof window & { __tjThemeEvents?: string[] };
      log.__tjThemeEvents = [];
      document.addEventListener('theme-change', (event) => {
        log.__tjThemeEvents?.push(String((event as CustomEvent<string>).detail));
      });
    });
    const cycle = async (): Promise<Array<{ attr: string | null; announce: string }>> => {
      const steps: Array<{ attr: string | null; announce: string }> = [];
      for (let click = 0; click < 3; click += 1) {
        await page.click('tj-header button.theme');
        steps.push(
          await page.evaluate(() => {
            const host = document.querySelector('main tj-header');
            const live = host?.shadowRoot?.querySelector('.visually-hidden[aria-live="polite"]');
            return {
              attr: document.documentElement.getAttribute('data-tj-theme'),
              announce: live?.textContent?.trim() ?? '',
            };
          }),
        );
      }
      return steps;
    };
    const steps = await cycle();
    // light → dark → auto → light (auto REMOVES the attribute; the OS
    // preference is pinned light by the harness config, so rendering stays
    // deterministic — only the ATTRIBUTE state is under test here).
    expect(steps[0]).toEqual({ attr: 'dark', announce: 'Тема оформления: тёмная' });
    expect(steps[1]).toEqual({ attr: null, announce: 'Тема оформления: системная' });
    expect(steps[2]).toEqual({ attr: 'light', announce: 'Тема оформления: светлая' });
    const events = await page.evaluate(
      () => (window as typeof window & { __tjThemeEvents?: string[] }).__tjThemeEvents ?? [],
    );
    expect(events, 'theme-change detail is the resulting mode STRING').toEqual([
      'dark',
      'auto',
      'light',
    ]);
  });

  test('ТЖ anchor contracts: inert empty href renders NO attribute; _blank gains noopener noreferrer; consumer rel wins verbatim', async ({
    page,
  }) => {
    // The 16.1 href rule + the rel rule, across every anchor-contract story
    // that demonstrates them (link, cta, tag-chip, news-card, post-card).
    type AnchorRow = { host: string; href: string | null; rel: string | null; target: string | null };

    const readStory = async (story: string): Promise<AnchorRow[]> => {
      await openStory(page, story, 'light');
      return page.evaluate(() => {
        const rows: Array<{ host: string; href: string | null; rel: string | null; target: string | null }> = [];
        for (const host of Array.from(document.querySelectorAll('tj-link, tj-cta, tj-tag-chip, tj-news-card, tj-post-card'))) {
          const anchor = host.shadowRoot?.querySelector('a');
          if (!anchor) continue;
          rows.push({
            host: host.tagName.toLowerCase(),
            href: anchor.getAttribute('href'),
            rel: anchor.getAttribute('rel'),
            target: anchor.getAttribute('target'),
          });
        }
        return rows;
      });
    };

    const links = await readStory('tj-link--anchor-contract');
    // href="" → the anchor renders WITHOUT the href attribute (inert content,
    // no tab stop); _blank without rel gets exactly noopener noreferrer; a
    // consumer rel is preserved verbatim.
    const linkInert = links.find((row) => row.href === null);
    expect(linkInert, 'the inert tj-link renders no href attribute').toBeDefined();
    const linkBlank = links.find((row) => row.target === '_blank' && row.rel === 'noopener noreferrer');
    expect(linkBlank, '_blank without rel gains noopener noreferrer').toBeDefined();
    const linkNext = links.find((row) => row.rel === 'next');
    expect(linkNext, 'rel="next" rides verbatim (no noopener appended)').toBeDefined();

    const ctas = await readStory('tj-cta--anchor-contract');
    expect(ctas.filter((row) => row.href !== null).length).toBe(1);
    expect(ctas.find((row) => row.href === null), 'the inert tj-cta renders no href').toBeDefined();

    const chips = await readStory('tj-tag-chip--anchor-contract');
    expect(chips.filter((row) => row.href !== null).length).toBe(2);
    expect(
      chips.find((row) => row.target === '_blank' && row.rel === 'noopener noreferrer'),
      'the chip _blank/no-rel row gains noopener noreferrer',
    ).toBeDefined();
    expect(
      chips.find((row) => row.rel === 'nofollow'),
      'the chip consumer rel rides verbatim',
    ).toBeDefined();

    const news = await readStory('tj-news-card--anatomy');
    expect(news.filter((row) => row.href !== null).length).toBe(1);
    expect(news.find((row) => row.href === null), 'the inert news card renders no href').toBeDefined();

    const posts = await readStory('tj-post-card--anatomy');
    expect(posts.filter((row) => row.href !== null).length).toBe(2);
    expect(posts.find((row) => row.href === null), 'the inert post card renders no href').toBeDefined();
  });

  test('article-page like-toggle: aria-pressed flips, the count re-derives from data-base-count, the label stays static, siblings stay stateless', async ({
    page,
  }) => {
    await openStory(page, 'tj-article-page--page-composition', 'light');
    const read = (): Promise<{
      pressed: string | null;
      label: string;
      count: string;
      siblingsWithPressed: number;
    }> =>
      page.evaluate(() => {
        // Scoped to the MAIN engage bar: the opt-in backrail clones the same
        // button classes (incl. its own aria-pressed like) — a page-wide
        // query would count two toggles (the run-2 lesson).
        const buttons = Array.from(
          document.querySelectorAll('.tjart-engage .tjart-engage__btn'),
        ) as HTMLButtonElement[];
        const like = buttons.find((button) => button.hasAttribute('aria-pressed'));
        return {
          pressed: like?.getAttribute('aria-pressed') ?? null,
          label: like?.querySelector('span')?.textContent?.trim() ?? '',
          count: like?.querySelector('.tjart-engage__count')?.textContent?.trim() ?? '',
          siblingsWithPressed: buttons.filter((button) => button.hasAttribute('aria-pressed')).length,
        };
      });
    const before = await read();
    expect(before.pressed).toBe('false');
    expect(before.label).toBe('Нравится');
    expect(before.count).toBe('128');
    expect(before.siblingsWithPressed, 'exactly ONE toggle in the engage bar').toBe(1);

    await page.click('.tjart-engage .tjart-engage__btn[aria-pressed]');
    const liked = await read();
    expect(liked.pressed).toBe('true');
    expect(liked.count, 'the count re-derives from data-base-count (128 + 1)').toBe('129');
    expect(liked.label, 'the accessible label is static — the count is not part of it').toBe(
      'Нравится',
    );

    await page.click('.tjart-engage .tjart-engage__btn[aria-pressed]');
    const unliked = await read();
    expect(unliked.pressed).toBe('false');
    expect(unliked.count).toBe('128');
  });
});
