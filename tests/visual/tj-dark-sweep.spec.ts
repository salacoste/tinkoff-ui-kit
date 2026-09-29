import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * ТЖ DARK SWEEP ENGINE (spec 17.2) — the 5.4 mold duplicated-and-adapted in
 * EXTRACTION-VERIFICATION mode. The direction of authority is INVERTED
 * versus the bank sweep: the bank engine enforced AUTHORED rules (yellow
 * keeps ink, shadow collapse); the ТЖ dark values are the REFERENCE'S OWN
 * (the 15.2 dark-home pixel census), so this engine verifies EXTRACTION
 * FIDELITY — invariants pin the extraction pairs READ FROM THE TOKEN SHEET
 * AT RUNTIME (never hardcoded literals), and a forced-invariant failure is
 * DESIGN.md re-open evidence with measured values, never a silent retune.
 *
 * For every one of the 45 built ТЖ story ids, the story loads in BOTH
 * themes and the COMPUTED paint of every element (document + shadow trees
 * + pseudos) is compared theme-to-theme:
 *
 * - STRUCTURE PARITY — the deep element fingerprint sequence must be
 *   IDENTICAL across themes (a branch = a render-level theme fork).
 * - AA TEXT PAIRS (dark) — slot-aware alpha-chain compositing against the
 *   effective background: ≥4.5:1 text, ≥3:1 large (≥24px, or ≥18.66px at
 *   ≥700), placeholders ≥3 (the restricted ruling). NO restricted
 *   exemptions at DOM level: the 16.6 axe-collision ruling keeps the
 *   restricted inks (--tj-color-engage / ink-reference-meta /
 *   ink-reference-time / light gold-ink on dark grounds) OUT of kit
 *   stories entirely — component CSS consumes none (verified by census);
 *   every DOM AA failure here is a REAL finding.
 * - LIGHT-ONLY LEFTOVERS — a color that does NOT change in dark is legal
 *   ONLY in the ТЖ legal-invariant set, derived from the token sheet's own
 *   theme-invariant declarations (tokens.css closing comment): the purple
 *   field family (--tj-color-badge-purple / --tj-color-chip-fill — the
 *   16.2/16.3 theme-invariant chips, twin-pinned in unit tests and pinned
 *   here at computed-paint level) and the gold accents (--tj-color-gold /
 *   --tj-color-gold-ink — sheet-declared invariants; census: no component
 *   CSS consumer, so their legality is currently theoretical), plus
 *   transparent. chip-ink WHITE text survives unchanged only ON purple
 *   grounds (own or nearest unchanged-purple ancestor — the Tier-B mold).
 *   Deliberately OUTSIDE the legal set (the sheet's own closing table):
 *   ink-200 RIDES the cta-fill flip (it changes in dark — a leftover of it
 *   would be a real finding); ink-reference-time has NO dark override (the
 *   recorded 15.2/17.2 ruling: unbound, never renders in kit stories under
 *   the restricted contract — re-opens only with a dark-article capture, so
 *   its unchanged value never reaches a rendered record).
 *   BANK-FAMILY SUBTREES (paths under a tk-* host — the ad-slot-recipe
 *   composition story) are EXEMPT from the ТЖ leftover/invariant/shadow
 *   legs: those surfaces follow the BANK's own dark contract, verified by
 *   the bank dark sweep (spec 8.2); re-deriving its invariant table here
 *   would be an unmanaged copy of a frozen engine's logic. Structure
 *   parity, border presence and AA stay universal.
 * - FORCED INVARIANTS (extraction fidelity) — the purple family stays
 *   EXACT in dark; the link pair FLIPS with the sheet's own values
 *   (light token → dark token, runtime-read: the spec pins the FLIP, the
 *   sheet owns the literals); the CTA fill flips per its token. Failure
 *   message carries the DESIGN.md-re-open wording with measured values.
 * - SHADOWS / BORDERS — ТЖ is FLAT (15.2: the census measured `none`
 *   everywhere; the single overlay shadow is the only elevation). Every
 *   non-none shadow must be theme-consistent (IDENTICAL computed string
 *   across themes — the sheet keeps the overlay as-is in dark) AND
 *   overlay-only: its geometry must equal the runtime-read
 *   --tj-shadow-overlay geometry. Borders keep their width with a
 *   non-transparent resolved color; an unchanged border color is legal
 *   only in the invariant set (dividers remap by design).
 * - NATIVE-DARK PARITY (the dual-emit proof) — with colorScheme emulated
 *   dark and `data-tj-theme` stripped POST-settle (the 16.6 walkthrough
 *   lesson: the docs boot runtime writes data-tj-theme=light on every
 *   render — stripping before settle races the boot write), the full
 *   computed-color fingerprint must EQUAL the explicit-dark run's. The
 *   bank layer is set to data-theme=dark alongside the strip so the only
 *   difference between the two runs is the ТЖ mechanism itself (attribute
 *   block vs prefers-color-scheme auto leg); divergence = the 15.2
 *   dual-emit generator bug (fix the MECHANISM, not values).
 *
 * Functional only: no baselines. The per-story ledger citing these legs is
 * orchestrator-authored at `.playwright-cli/verify/tj-dark-sweep/ledger.md`
 * after the scoped 6007 validation.
 */

interface TjDarkTarget {
  component: string;
  story: string;
}

/** All 45 built ТЖ story ids — same registry as the 17.1 TSWEEP matrix. */
const TJSWEEP: readonly TjDarkTarget[] = [
  { component: 'tj-prose', story: 'tj-prose--playground' },
  { component: 'tj-prose', story: 'tj-prose--species' },
  { component: 'tj-prose', story: 'tj-prose--composition' },
  { component: 'tj-prose', story: 'tj-prose--accessibility' },
  { component: 'tj-link', story: 'tj-link--playground' },
  { component: 'tj-link', story: 'tj-link--species' },
  { component: 'tj-link', story: 'tj-link--anchor-contract' },
  { component: 'tj-link', story: 'tj-link--accessibility' },
  { component: 'tj-cta', story: 'tj-cta--playground' },
  { component: 'tj-cta', story: 'tj-cta--anatomy' },
  { component: 'tj-cta', story: 'tj-cta--anchor-contract' },
  { component: 'tj-cta', story: 'tj-cta--accessibility' },
  { component: 'tj-rubric-header', story: 'tj-rubric-header--playground' },
  { component: 'tj-rubric-header', story: 'tj-rubric-header--anatomy' },
  { component: 'tj-rubric-header', story: 'tj-rubric-header--accessibility' },
  { component: 'tj-news-card', story: 'tj-news-card--playground' },
  { component: 'tj-news-card', story: 'tj-news-card--anatomy' },
  { component: 'tj-news-card', story: 'tj-news-card--skeleton' },
  { component: 'tj-news-card', story: 'tj-news-card--accessibility' },
  { component: 'tj-tag-chip', story: 'tj-tag-chip--playground' },
  { component: 'tj-tag-chip', story: 'tj-tag-chip--anchor-contract' },
  { component: 'tj-tag-chip', story: 'tj-tag-chip--pro-hero-pattern' },
  { component: 'tj-tag-chip', story: 'tj-tag-chip--accessibility' },
  { component: 'tj-composer', story: 'tj-composer--playground' },
  { component: 'tj-composer', story: 'tj-composer--anatomy' },
  { component: 'tj-composer', story: 'tj-composer--accessibility' },
  { component: 'tj-post-card', story: 'tj-post-card--playground' },
  { component: 'tj-post-card', story: 'tj-post-card--anatomy' },
  { component: 'tj-post-card', story: 'tj-post-card--community-pattern' },
  { component: 'tj-post-card', story: 'tj-post-card--accessibility' },
  { component: 'tj-header', story: 'tj-header--playground' },
  { component: 'tj-header', story: 'tj-header--anatomy' },
  { component: 'tj-header', story: 'tj-header--theme-contract' },
  { component: 'tj-header', story: 'tj-header--accessibility' },
  { component: 'tj-rail', story: 'tj-rail--playground' },
  { component: 'tj-rail', story: 'tj-rail--anatomy' },
  { component: 'tj-rail', story: 'tj-rail--chrome-composition' },
  { component: 'tj-rail', story: 'tj-rail--drawer' },
  { component: 'tj-rail', story: 'tj-rail--accessibility' },
  { component: 'tj-article-page', story: 'tj-article-page--page-composition' },
  { component: 'tj-article-page', story: 'tj-article-page--anatomy' },
  { component: 'tj-article-page', story: 'tj-article-page--accessibility' },
  { component: 'tj-ad-slot-recipe', story: 'tj-ad-slot-recipe--recipe' },
  { component: 'tj-ad-slot-recipe', story: 'tj-ad-slot-recipe--accessibility' },
  { component: 'tj-getting-started', story: 'tj-getting-started--page' },
];

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

interface PseudoPaint {
  renders: boolean;
  /** Absolute + inset-0 full coverage: the pseudo is a FILL behind content. */
  fullCover: boolean;
  /** Positioned absolute — paints above the element's own bg, below content. */
  absolute: boolean;
  bg: string;
  borderTopColor: string;
  borderTopWidth: string;
  shadow: string;
}

export interface PaintRecord {
  /** Stable structural fingerprint — identical across themes unless the DOM branches. */
  path: string;
  /** Index of the parent record (-1 at walk roots) — the compositing chain. */
  parentIndex: number;
  visible: boolean;
  hasText: boolean;
  fontSize: string;
  fontWeight: string;
  color: string;
  bg: string;
  borderTopColor: string;
  borderTopWidth: string;
  shadow: string;
  before: PseudoPaint | null;
  after: PseudoPaint | null;
  placeholder: boolean;
  placeholderColor: string;
  disabled: boolean;
}

/**
 * The deep paint collector (the mold verbatim): walks the story canvas, the
 * toast stack and the overlay root, recursing into every shadow tree; per
 * element it reads the theme-relevant computed channels plus both box
 * pseudos. The ТЖ overlay helper appends its scrim/sheet straight to <body>
 * (no dedicated root) and every collected story renders the drawer CLOSED,
 * so no extra roots exist to walk. Passed as a REAL function (Playwright
 * 1.63 no longer CALLS string arrows in evaluate).
 */
function collectPaint(): PaintRecord[] {
  const records: PaintRecord[] = [];
  const els: Element[] = [];
  const readPseudo = (el: Element, pseudo: '::before' | '::after'): PseudoPaint | null => {
    const style = getComputedStyle(el, pseudo);
    const renders = style.content !== 'none' && style.content !== 'normal';
    if (!renders) return null;
    const fullCover =
      style.position === 'absolute' &&
      style.top === '0px' &&
      style.bottom === '0px' &&
      style.left === '0px' &&
      style.right === '0px';
    return {
      renders,
      fullCover,
      absolute: style.position === 'absolute',
      bg: style.backgroundColor,
      borderTopColor: style.borderTopColor,
      borderTopWidth: style.borderTopWidth,
      shadow: style.boxShadow,
    };
  };
  const walk = (node: Element | ShadowRoot, prefix: string, parentIndex: number): void => {
    // Fingerprint: tag + variant-bearing host chain + id/classes + stable
    // ordinal among same-signature siblings (theme-independent).
    const groups = new Map<string, number>();
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();
      const variant = child.getAttribute('variant');
      const id = child.id ? `#${child.id}` : '';
      const cls = (child.getAttribute('class') ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .map((c) => `.${c}`)
        .join('');
      const signature = `${tag}${variant ? `[variant=${variant}]` : ''}${id}${cls}`;
      const ordinal = groups.get(signature) ?? 0;
      groups.set(signature, ordinal + 1);
      const path = `${prefix}${signature}#${ordinal}`;
      const style = getComputedStyle(child);
      const inert = style.color === '' && style.backgroundColor === '';
      let hasText = false;
      for (const node of Array.from(child.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0) {
          hasText = true;
          break;
        }
      }
      const placeholder =
        child instanceof HTMLInputElement &&
        child.hasAttribute('placeholder') &&
        child.type !== 'hidden';
      els.push(child);
      records.push({
        path,
        parentIndex,
        visible:
          !inert &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          child.getClientRects().length > 0,
        hasText,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        bg: style.backgroundColor,
        borderTopColor: style.borderTopColor,
        borderTopWidth: style.borderTopWidth,
        shadow: style.boxShadow,
        before: readPseudo(child, '::before'),
        after: readPseudo(child, '::after'),
        placeholder,
        placeholderColor: placeholder
          ? getComputedStyle(child, '::placeholder').color
          : '',
        disabled:
          (child instanceof HTMLInputElement && child.disabled) ||
          child.getAttribute('aria-disabled') === 'true',
      });
      // Capture the child's OWN record index BEFORE any recursion: the
      // shadow walk must hang off the HOST record, not off whatever light
      // descendant was pushed last (the mold's parent-cycle fix).
      const recordIndex = records.length - 1;
      walk(child, path, recordIndex);
      if (child.shadowRoot) {
        walk(child.shadowRoot, `${path}::shadow(`, recordIndex);
      }
    }
  };
  const roots = [
    '#storybook-root',
    '#tk-toast-stack',
    '#tk-overlay-root',
  ].flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  for (const root of roots) {
    walk(root, `${root.id}|`, -1);
  }
  // SLOT-AWARE PARENTS: an element assigned to a slot composites against the
  // SLOT's position in the shadow tree (the flat tree), not its light-DOM
  // position under the host.
  const indexOf = new Map<Element, number>();
  els.forEach((el, index) => indexOf.set(el, index));
  els.forEach((el, index) => {
    const slot = el.assignedSlot;
    if (slot) {
      const slotIndex = indexOf.get(slot);
      if (slotIndex !== undefined) records[index].parentIndex = slotIndex;
    }
  });
  return records;
}

// ---------------------------------------------------------------------------
// Node-side color math — mirroring tests/contrast.test.ts (WCAG 2.1)
// ---------------------------------------------------------------------------

type Rgba = readonly [number, number, number, number];

function parseColor(value: string): Rgba {
  const match = /rgba?\(([^)]+)\)/.exec(value);
  if (match === null) {
    // Chromium serializes color-mix() srgb results as `color(srgb r g b / a)`
    // (the skeleton-bone / scrim family) with 0–1 float channels — without
    // this branch they parsed transparent (the lens-172 MINOR).
    const fn =
      /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/.exec(value);
    if (fn === null) return [0, 0, 0, 0]; // transparent / currentColor-resolved edge
    return [
      Number.parseFloat(fn[1]) * 255,
      Number.parseFloat(fn[2]) * 255,
      Number.parseFloat(fn[3]) * 255,
      fn[4] !== undefined ? Number.parseFloat(fn[4]) : 1,
    ];
  }
  const parts = match[1].split(',').map((part) => Number.parseFloat(part));
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
}

const isTransparent = (c: Rgba): boolean => c[3] === 0;
const sameColor = (a: Rgba, b: Rgba): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];

function composite(fg: Rgba, bg: Rgba): Rgba {
  const a = fg[3] + bg[3] * (1 - fg[3]);
  if (a === 0) return [0, 0, 0, 0];
  const mix = (i: number) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
  return [mix(0), mix(1), mix(2), a];
}

function luminance(c: Rgba): number {
  const linearize = (channel: number) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(c[0]) + 0.7152 * linearize(c[1]) + 0.0722 * linearize(c[2]);
}

function contrastRatio(fg: Rgba, bg: Rgba): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The effective opaque background: composite the ancestor chain (fallback:
 * the UA white paper). At every layer, the element's ABSOLUTE rendering
 * pseudos composite between its own background and its content — the ТЖ pill
 * law (the CTA/tag-chip fills ride ::before with inset geometry, so a label
 * span's real ground is the pseudo, not the transparent anchor; the run-4
 * lesson: without it the label measured against the page).
 */
function effectiveBackground(records: PaintRecord[], index: number): Rgba {
  let acc: Rgba = [255, 255, 255, 1]; // unpainted canvas renders white in both themes
  let steps = 0;
  for (let i = index; i >= 0; i = records[i].parentIndex) {
    if ((steps += 1) > records.length) {
      throw new Error(`tj dark sweep: parentIndex cycle reached from ${records[index].path}`);
    }
    const own = parseColor(records[i].bg);
    acc = composite(own, acc);
    let opaque = own[3] === 1;
    // ::before paints under ::after — composite in tree order.
    for (const pseudo of [records[i].before, records[i].after]) {
      if (pseudo === null || !pseudo.absolute) continue;
      const pseudoBg = parseColor(pseudo.bg);
      acc = composite(pseudoBg, acc);
      if (pseudoBg[3] === 1) opaque = true;
    }
    // Only an OPAQUE layer (own or pseudo) stops the chain: a transparent
    // layer over the white fallback composites to opaque white yet paints
    // nothing.
    if (opaque) return acc;
  }
  return acc;
}

// ---------------------------------------------------------------------------
// The extraction pair — EVERY value read from the live token sheet at
// runtime (the spec pins the FLIP, the sheet owns the literals; a hex in
// this engine would pre-empt exactly the drift it exists to catch)
// ---------------------------------------------------------------------------

interface TjSheetSnapshot {
  /** Theme-invariant purple field family (badge-purple + chip-fill). */
  purple: Rgba[];
  /** Theme-invariant gold accents (gold + gold-ink). */
  gold: Rgba[];
  /** The link species pair THIS theme resolves to. */
  link: Rgba;
  /** The CTA fill THIS theme resolves to. */
  ctaFill: Rgba;
  /** The chip ink THIS theme resolves to (theme-invariant white). */
  chipInk: Rgba;
  /** --tj-color-page THIS theme resolves to (the native-leg self-check). */
  page: Rgba;
  /** The overlay shadow's [x, y, blur] geometry (parsed from the token). */
  overlayGeometry: Rgba;
}

async function readTjSheet(page: Page): Promise<TjSheetSnapshot> {
  const raw = await page.evaluate(() => {
    const read = (name: string): string => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      // Both 3- and 6-digit hex normalize to Chromium's rgb() serialization —
      // the sheet declares --tj-color-chip-ink as #fff (parseColor would read
      // a bare '#fff' as transparent and silently corrupt every chip-ink pin).
      const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(value);
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
      return value;
    };
    return {
      badgePurple: read('--tj-color-badge-purple'),
      chipFill: read('--tj-color-chip-fill'),
      gold: read('--tj-color-gold'),
      goldInk: read('--tj-color-gold-ink'),
      link: read('--tj-color-link'),
      ctaFill: read('--tj-color-cta-fill'),
      chipInk: read('--tj-color-chip-ink'),
      page: read('--tj-color-page'),
      overlay: read('--tj-shadow-overlay'),
    };
  });
  // Overlay geometry: numeric tokens OUTSIDE the color function; a bare 0 is
  // legal box-shadow syntax for the x offset (the authored token uses it).
  const overlayNumbers = raw.overlay
    .replace(/rgba?\([^)]*\)/g, ' ')
    .match(/-?[\d.]+(?:px)?/g)
    ?.map((token) => Number.parseFloat(token)) ?? [0, 2, 8];
  return {
    purple: [parseColor(raw.badgePurple), parseColor(raw.chipFill)],
    gold: [parseColor(raw.gold), parseColor(raw.goldInk)],
    link: parseColor(raw.link),
    ctaFill: parseColor(raw.ctaFill),
    chipInk: parseColor(raw.chipInk),
    page: parseColor(raw.page),
    overlayGeometry: [overlayNumbers[0] ?? 0, overlayNumbers[1] ?? 0, overlayNumbers[2] ?? 0, 1],
  };
}

/** Computed box-shadow geometry [x, y, blur] (color serializes first, its values are px-free). */
function shadowGeometry(shadow: string): Rgba | null {
  if (shadow === 'none' || shadow === '') return null;
  const lengths = [...shadow.matchAll(/(-?[\d.]+)px/g)].map((m) => Number.parseFloat(m[1]));
  return [lengths[0] ?? 0, lengths[1] ?? 0, lengths[2] ?? 0, 1];
}

/** Any shadow layer with a fully transparent color paints nothing. */
function shadowInvisibleLayers(shadow: string): boolean {
  if (shadow === 'none' || shadow === '') return false;
  return /transparent/.test(shadow);
}

/**
 * Bank-family surface (the FR-21 composition story): the bank dark sweep owns
 * its legs. Two shapes: (1) subtrees under a tk-* host (the promo card
 * inside the stage); (2) the ad-slot story's PAGE CHROME above `.tjad-stage`
 * — the story's own boundary comment draws the line ("The ТЖ stage: --tj-*
 * ONLY from here down"), and that chrome consumes --tk-* tokens whose flip
 * (text-primary charcoal → white) is the BANK's contract, not a ТЖ
 * extraction pair (run-4 lesson: the toggle tripped the ТЖ CTA-fill flip by
 * coincidental value).
 */
const bankScoped = (path: string): boolean =>
  path.includes('tk-') || (path.includes('tjad-') && !path.includes('tjad-stage'));

interface PaintChannels {
  bg: string;
  borderTopColor: string;
  borderTopWidth: string;
  shadow: string;
}

function compareStory(
  component: string,
  lightRecords: PaintRecord[],
  darkRecords: PaintRecord[],
  lightSheet: TjSheetSnapshot,
  darkSheet: TjSheetSnapshot,
): string[] {
  const failures: string[] = [];
  const at = (i: number, theme: string): string =>
    `${theme} ${(theme === 'dark' ? darkRecords[i]?.path : lightRecords[i]?.path) ?? '(beyond end)'}`;

  // --- STRUCTURE PARITY -----------------------------------------------------
  if (lightRecords.length !== darkRecords.length) {
    failures.push(
      `${component}: DOM differs across themes — light walks ${lightRecords.length} elements, dark ${darkRecords.length}. First divergence: ${(() => {
        const n = Math.min(lightRecords.length, darkRecords.length);
        for (let i = 0; i < n; i += 1) {
          if (lightRecords[i].path !== darkRecords[i].path) return at(i, 'light');
        }
        return at(n, 'light');
      })()} — a render-level theme branch.`,
    );
    return failures;
  }
  for (let i = 0; i < lightRecords.length; i += 1) {
    if (lightRecords[i].path !== darkRecords[i].path) {
      failures.push(
        `${component}: element ${i} fingerprint differs across themes: ${at(i, 'light')} vs ${at(i, 'dark')} — a render-level theme branch.`,
      );
      return failures;
    }
  }

  const inPurple = (c: Rgba): boolean => lightSheet.purple.some((member) => sameColor(c, member));
  const inGold = (c: Rgba): boolean => lightSheet.gold.some((member) => sameColor(c, member));

  /** Tier-B: the record (or its nearest opaque ancestor chain) sits on an UNCHANGED purple ground. */
  const onPurpleGround = (i: number): boolean => {
    let steps = 0;
    for (let p = i; p >= 0; p = darkRecords[p].parentIndex) {
      if ((steps += 1) > darkRecords.length) return false;
      const darkBg = parseColor(darkRecords[p].bg);
      if (sameColor(parseColor(lightRecords[p].bg), darkBg) && inPurple(darkBg)) return true;
      if (darkBg[3] === 1 && parseColor(lightRecords[p].bg)[3] === 1) return false;
    }
    return false;
  };

  const checkPaint = (
    path: string,
    label: string,
    lightChannels: PaintChannels,
    darkChannels: PaintChannels,
    index: number,
  ): void => {
    // BANK-FAMILY SUBTREE: the ТЖ extraction legs do not govern bank-composed
    // surfaces (the bank's own dark sweep owns their invariants/shadows);
    // only the universal guarantees (border presence) stay.
    const bank = bankScoped(path);

    // --- BACKGROUND: leftovers + forced invariants + forced flips ------------
    // The leftover leg is ТЖ-ONLY: a bank surface's unchanged fill (charcoal,
    // yellow, white) is the BANK's own invariant table's business — the bank
    // dark sweep (spec 8.2) owns it; flagging it here would re-derive a frozen
    // engine's logic (the run-5 lesson).
    const lightBg = parseColor(lightChannels.bg);
    const darkBg = parseColor(darkChannels.bg);
    if (!bank && sameColor(lightBg, darkBg)) {
      // White-alpha VEILS on purple grounds (the 16.2/16.3 /pro/ hero blobs:
      // color-mix white 10% over the theme-invariant field) are the fill-side
      // analog of the chip-ink Tier-B rule — a tint OF the invariant, legal
      // unchanged (the color(srgb) parser extension surfaced them, run 7).
      const isWhiteVeil = (c: Rgba): boolean =>
        c[0] === 255 && c[1] === 255 && c[2] === 255 && c[3] > 0 && c[3] < 1;
      const legal =
        isTransparent(lightBg) ||
        inPurple(lightBg) ||
        inGold(lightBg) ||
        (isWhiteVeil(lightBg) && onPurpleGround(index));
      if (!legal) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} UNCHANGED in dark — not in the ТЖ legal-invariant set (purple field family / gold accents / transparent): the lightblue-200 bug class.`,
        );
      }
    } else if (!bank) {
      // FORCED EXACT — the extraction pair (failure = DESIGN.md re-open
      // evidence, values quoted; never a silent retune).
      if (inPurple(lightBg)) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} (light) → ${darkChannels.bg} (dark): the purple field family is THEME-INVARIANT (16.2/16.3 twin-pin) — extraction-fidelity failure, DESIGN.md dark rows re-open evidence.`,
        );
      }
      if (inGold(lightBg)) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} (light) → ${darkChannels.bg} (dark): gold accents are sheet-declared theme-invariants — extraction-fidelity failure, DESIGN.md re-open evidence.`,
        );
      }
      // FORCED FLIPS — the sheet's own pair values (runtime-read).
      if (sameColor(lightBg, lightSheet.ctaFill) && !sameColor(darkBg, darkSheet.ctaFill)) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} (light) → ${darkChannels.bg} (dark): the CTA fill must flip to the sheet's own dark value ${darkChannels.bg === '' ? '(unresolved)' : JSON.stringify(darkSheet.ctaFill)} — extraction-fidelity failure, DESIGN.md re-open evidence.`,
        );
      }
      if (sameColor(lightBg, lightSheet.link) && !sameColor(darkBg, darkSheet.link)) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} (light) → ${darkChannels.bg} (dark): the link pair must flip to the sheet's own dark value — extraction-fidelity failure, DESIGN.md re-open evidence.`,
        );
      }
    }

    // --- BORDER: present + remapped ----------------------------------------
    if (Number.parseFloat(lightChannels.borderTopWidth) > 0) {
      if (lightChannels.borderTopWidth !== darkChannels.borderTopWidth) {
        failures.push(
          `${component}: ${path} (${label}) border width ${lightChannels.borderTopWidth} (light) → ${darkChannels.borderTopWidth} (dark): hairline weight must survive the flip.`,
        );
      }
      if (isTransparent(parseColor(darkChannels.borderTopColor))) {
        failures.push(
          `${component}: ${path} (${label}) border ${darkChannels.borderTopColor} in dark: the hairline vanished (expected the divider remap or an invariant edge).`,
        );
      } else {
        const lightBorder = parseColor(lightChannels.borderTopColor);
        const darkBorder = parseColor(darkChannels.borderTopColor);
        if (sameColor(lightBorder, darkBorder) && !isTransparent(lightBorder) && !bank) {
          const legal = inPurple(lightBorder) || inGold(lightBorder);
          if (!legal) {
            failures.push(
              `${component}: ${path} (${label}) border color ${lightChannels.borderTopColor} UNCHANGED in dark — dividers remap by design; only the invariant set survives the flip.`,
            );
          }
        }
        if (
          !bank &&
          sameColor(lightBorder, lightSheet.link) &&
          !sameColor(darkBorder, darkSheet.link)
        ) {
          failures.push(
            `${component}: ${path} (${label}) border ${lightChannels.borderTopColor} (light) → ${darkChannels.borderTopColor} (dark): the link pair must flip to the sheet's own dark value — extraction-fidelity failure, DESIGN.md re-open evidence.`,
          );
        }
      }
    }

    // --- SHADOW: flat language — theme-consistent + overlay-only ------------
    if (!bank) {
      if (lightChannels.shadow !== darkChannels.shadow) {
        failures.push(
          `${component}: ${path} (${label}) shadow '${lightChannels.shadow}' (light) → '${darkChannels.shadow}' (dark): the overlay shadow is kept AS-IS in dark (theme-consistent) — divergence is a render-level shadow branch.`,
        );
      }
      const geometry = shadowGeometry(darkChannels.shadow);
      if (geometry !== null) {
        const [gx, gy, gblur] = geometry;
        const [ox, oy, oblur] = darkSheet.overlayGeometry;
        if (gx !== ox || gy !== oy || gblur !== oblur) {
          failures.push(
            `${component}: ${path} (${label}) paints shadow '${darkChannels.shadow}' — ТЖ is FLAT: the ONLY legal elevation is the overlay token (x=${ox}, y=${oy}, blur=${oblur}). Any other geometry is unextractioned elevation.`,
          );
        }
      }
      if (shadowInvisibleLayers(darkChannels.shadow)) {
        failures.push(
          `${component}: ${path} (${label}) shadow '${darkChannels.shadow}' has a fully transparent layer — a shadow that paints nothing.`,
        );
      }
    }
  };

  for (let i = 0; i < lightRecords.length; i += 1) {
    const lightRecord = lightRecords[i];
    const darkRecord = darkRecords[i];
    const { path } = lightRecord;

    // Inert (unprojected) nodes resolve nothing — nothing to compare.
    if (lightRecord.color === '' && darkRecord.color === '') continue;

    checkPaint(path, 'element', lightRecord, darkRecord, i);
    if (lightRecord.before && darkRecord.before) {
      checkPaint(path, '::before', lightRecord.before, darkRecord.before, i);
    }
    if (lightRecord.after && darkRecord.after) {
      checkPaint(path, '::after', lightRecord.after, darkRecord.after, i);
    }

    // --- TEXT COLOR discipline ----------------------------------------------
    // visible + hasText gates (the run-2/3 lessons): Storybook's own
    // #root-inner wrapper carries UA black with NO own text, and the story's
    // <style> element inside it HAS text (its CSS source) but paints nothing
    // (UA display:none) — a color channel only RENDERS on VISIBLE text-bearing
    // nodes, and every text-bearing descendant is its own record here. The
    // bank mold needed no gate: its legal set already includes ink-black.
    const lightColor = parseColor(lightRecord.color);
    const darkColor = parseColor(darkRecord.color);
    const bank = bankScoped(path);
    if (
      lightRecord.visible &&
      lightRecord.hasText &&
      sameColor(lightColor, darkColor) &&
      !isTransparent(lightColor) &&
      !bank
    ) {
      // chip-ink white survives ONLY on purple grounds (own or Tier-B
      // ancestor); gold text accents are sheet invariants; anything else
      // keeping its light value is a leftover.
      const legal =
        inGold(lightColor) ||
        (sameColor(lightColor, darkSheet.chipInk) && onPurpleGround(i));
      if (!legal && !lightRecord.placeholder) {
        failures.push(
          `${component}: ${path} text color ${lightRecord.color} UNCHANGED in dark — only gold accents and chip-ink on purple grounds survive the flip (inks/dividers/link must remap).`,
        );
      }
    } else if (!bank) {
      // FORCED FLIP — the link species pair (the extraction pin).
      if (sameColor(lightColor, lightSheet.link) && !sameColor(darkColor, darkSheet.link)) {
        failures.push(
          `${component}: ${path} text ${lightRecord.color} (light) → ${darkRecord.color} (dark): the link pair must flip to the sheet's own dark value — extraction-fidelity failure, DESIGN.md re-open evidence.`,
        );
      }
    }

    // --- AA pair (dark): visible text against the effective background ------
    if (darkRecord.visible && !darkRecord.disabled) {
      const bg = effectiveBackground(darkRecords, i);
      const checkPair = (fgValue: string, threshold: number, what: string): void => {
        const fg = parseColor(fgValue);
        const ratio = contrastRatio(fg, bg);
        if (ratio < threshold) {
          failures.push(
            `${component}: ${path} ${what} ${fgValue} on effective bg rgba(${bg.map((v) => Math.round(v)).join(', ')}) = ${ratio.toFixed(2)}:1 < ${threshold}:1 — illegible pair in dark (NO restricted exemptions at DOM level: every failure is a real finding).`,
          );
        }
      };
      if (darkRecord.hasText) {
        const size = Number.parseFloat(darkRecord.fontSize);
        const weight = Number.parseInt(darkRecord.fontWeight, 10) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        checkPair(darkRecord.color, large ? 3 : 4.5, 'text');
      }
      if (darkRecord.placeholder) {
        // Restricted ruling: placeholder is non-essential text — ≥3:1.
        checkPair(darkRecord.placeholderColor, 3, 'placeholder');
      }

      // --- PURPLE KEEPS CHIP-INK (the yellow-keeps-ink analog) --------------
      // Scoped to TEXT-BEARING surfaces painted a purple-field fill (own or
      // full-cover pseudo): the 16.2/16.3 authored pair is chip-ink on the
      // purple fields in BOTH themes.
      if (darkRecord.hasText && !bank) {
        const purpleFill = (paint: string): boolean =>
          darkSheet.purple.some((member) => sameColor(parseColor(paint), member));
        const behindText =
          purpleFill(darkRecord.bg) ||
          (darkRecord.before !== null && darkRecord.before.fullCover && purpleFill(darkRecord.before.bg)) ||
          (darkRecord.after !== null && darkRecord.after.fullCover && purpleFill(darkRecord.after.bg));
        if (behindText && !sameColor(parseColor(darkRecord.color), darkSheet.chipInk)) {
          failures.push(
            `${component}: ${path} paints a purple field behind text ${darkRecord.color} in dark — purple fields ALWAYS carry chip-ink text (the 16.2/16.3 authored pair).`,
          );
        }
      }
    }
  }
  return failures;
}

/**
 * The native-dark parity compare: EVERY theme-relevant channel must be
 * byte-identical between the explicit-dark run (data-tj-theme="dark") and
 * the native run (attribute stripped + OS dark → the auto leg). Divergence
 * = the 15.2 dual-emit mechanism bug (fix the mechanism, not values).
 */
function compareNative(component: string, explicit: PaintRecord[], native: PaintRecord[]): string[] {
  const failures: string[] = [];
  if (explicit.length !== native.length) {
    failures.push(
      `${component}: NATIVE-DARK fingerprint length differs — explicit-dark walks ${explicit.length} elements, native ${native.length}: the dual-emit legs render DIFFERENT DOM.`,
    );
    return failures;
  }
  for (let i = 0; i < explicit.length; i += 1) {
    const a = explicit[i];
    const b = native[i];
    const channels: Array<[string, string, string]> = [
      ['path', a.path, b.path],
      ['fontSize', a.fontSize, b.fontSize],
      ['fontWeight', a.fontWeight, b.fontWeight],
      ['color', a.color, b.color],
      ['bg', a.bg, b.bg],
      ['borderTopColor', a.borderTopColor, b.borderTopColor],
      ['borderTopWidth', a.borderTopWidth, b.borderTopWidth],
      ['shadow', a.shadow, b.shadow],
      ['placeholderColor', a.placeholderColor, b.placeholderColor],
    ];
    if ((a.before === null) !== (b.before === null)) {
      channels.push(['::before presence', a.before ? 'present' : 'absent', b.before ? 'present' : 'absent']);
    } else if (a.before && b.before) {
      channels.push(
        ['::before bg', a.before.bg, b.before.bg],
        ['::before shadow', a.before.shadow, b.before.shadow],
      );
    }
    if ((a.after === null) !== (b.after === null)) {
      channels.push(['::after presence', a.after ? 'present' : 'absent', b.after ? 'present' : 'absent']);
    } else if (a.after && b.after) {
      channels.push(
        ['::after bg', a.after.bg, b.after.bg],
        ['::after shadow', a.after.shadow, b.after.shadow],
      );
    }
    for (const [channel, explicitValue, nativeValue] of channels) {
      if (explicitValue !== nativeValue) {
        failures.push(
          `${component}: NATIVE-DARK divergence at ${a.path} — ${channel}: explicit-dark '${explicitValue}' vs native '${nativeValue}' (the 15.2 dual-emit attribute block and prefers-color-scheme auto leg disagree — fix the MECHANISM, not values).`,
        );
      }
    }
  }
  return failures;
}

async function collect(page: Page, story: string, theme: 'light' | 'dark'): Promise<PaintRecord[]> {
  await page.goto(buildStoryUrl(story, theme));
  await waitForStorySettled(page);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-tj-theme', 'dark');
  }
  // Release any mount-placed focus so nothing depends on interaction state.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  });
  return page.evaluate(collectPaint);
}

for (const target of TJSWEEP) {
  test(`tj-dark-sweep: ${target.component} — ${target.story} — theme-flip paint audit (extraction-verification) + native-dark parity`, async ({
    page,
  }) => {
    const light = await collect(page, target.story, 'light');
    const lightSheet = await readTjSheet(page);
    const dark = await collect(page, target.story, 'dark');
    const darkSheet = await readTjSheet(page);
    // Sanity: the walk found real content (a vacuous pass proves nothing).
    expect(light.length, `${target.story}: the light walk found no elements`).toBeGreaterThan(0);

    const failures = compareStory(target.story, light, dark, lightSheet, darkSheet);
    expect(failures, failures.join('\n')).toEqual([]);

    // --- NATIVE-DARK PARITY LEG (the dual-emit proof) -------------------------
    // Emulate the OS preference dark, load the LIGHT url, settle, THEN strip
    // data-tj-theme (post-settle — the boot runtime rewrites it on render)
    // and set the BANK layer to dark so the only variable left is the ТЖ
    // mechanism. The self-check proves the auto leg actually engaged before
    // any fingerprint is trusted.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(buildStoryUrl(target.story, 'light'));
    await waitForStorySettled(page);
    const selfCheck = await page.evaluate(
      () =>
        new Promise<{ attr: string | null; resolvedPage: string }>((resolve) => {
          const root = document.documentElement;
          root.removeAttribute('data-tj-theme');
          root.setAttribute('data-theme', 'dark');
          const done = (): void => {
            const raw = getComputedStyle(root).getPropertyValue('--tj-color-page').trim();
            resolve({ attr: root.getAttribute('data-tj-theme'), resolvedPage: raw });
          };
          requestAnimationFrame(() => requestAnimationFrame(done));
        }),
    );
    expect(
      selfCheck.attr,
      `${target.story}: data-tj-theme stayed stripped after two rAFs (the boot write must not re-fire post-settle)`,
    ).toBeNull();
    const normalized = (value: string): string => {
      if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        const r = parseInt(value.slice(1, 3), 16);
        const g = parseInt(value.slice(3, 5), 16);
        const b = parseInt(value.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }
      return value;
    };
    expect(
      normalized(selfCheck.resolvedPage),
      `${target.story}: with the OS dark and the attribute stripped, --tj-color-page resolves to the sheet's dark value (the auto leg engaged — otherwise this leg compares nothing)`,
    ).toBe(
      `rgb(${Math.round(darkSheet.page[0])}, ${Math.round(darkSheet.page[1])}, ${Math.round(darkSheet.page[2])})`,
    );

    const native = await page.evaluate(collectPaint);
    const nativeFailures = compareNative(target.story, dark, native);
    expect(nativeFailures, nativeFailures.join('\n')).toEqual([]);
  });
}
