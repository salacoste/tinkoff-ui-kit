import { expect, test, type Page } from 'playwright/test';

import { buildStoryUrl } from './stories';

/**
 * DARK SWEEP ENGINE (spec 5.4 — SM-5's verified half). For every one of the
 * 19 components' canonical stories, the story is loaded in BOTH themes and
 * the COMPUTED paint of every element (document + shadow trees + pseudos,
 * canvas + the toast stack + the overlay root) is compared theme-to-theme:
 *
 * - STRUCTURE PARITY — the deep element fingerprint sequence must be
 *   IDENTICAL across themes: a story whose DOM differs under
 *   `data-theme="dark"` is a render-level theme branch, however it got
 *   there.
 * - AA TEXT PAIRS (dark) — every visible text-bearing element's resolved
 *   color is ratio-checked against its EFFECTIVE background (alpha chain
 *   composited through ancestors and shadow hosts): ≥4.5:1, ≥3:1 for large
 *   text (≥24px, or ≥18.66px at ≥700). Placeholders carry the restricted
 *   ruling (non-essential; DESIGN.md Colors) and are held to ≥3:1.
 * - LIGHT-ONLY LEFTOVERS — the lightblue-200 bug class: a background /
 *   border / text color that does NOT change in dark is only legal for the
 *   theme-invariant families (yellow, green, ink, white-text) and the
 *   documented Tier-B pattern (a white pill that sits on an invariant
 *   charcoal card, re-scoped by the 3.7 review fix). Anything else keeping
 *   its light value in dark is a finding.
 * - INVARIANT HOLDS — the forced direction: yellow/green/ink fills (incl.
 *   the charcoal tint, footer pills, tooltip) must stay EXACTLY in dark;
 *   the ONE sanctioned flip is the inverse button (fill rides the
 *   text-primary semantic, ink→white in dark — DESIGN.md Components).
 * - SHADOW COLLAPSE (UX-DR2) — in dark every box-shadow layer must be
 *   `none` or a PURE RING (zero offset, zero blur): elevation collapses to
 *   tonal steps; hairlines/rings via inset box-shadow (segmented track,
 *   thumbnail borders) and the ink selection ring survive by design.
 * - BORDERS PRESENT — an element with a border in light keeps the same
 *   border width in dark with a non-transparent resolved color (the
 *   white-alpha dark hairlines are the intended replacement).
 * - YELLOW KEEPS INK — any surface painted a yellow-family fill in dark
 *   carries ink (#333) text.
 *
 * Functional only: no baselines. Placement follows the a11y-sweep decision
 * (built-docs webServer lane; `pnpm test:visual` is the CI gate). The
 * per-component ledger citing these legs lives at
 * `.playwright-cli/verify/dark-sweep/ledger.md`.
 */

interface SweepTarget {
  component: string;
  story: string;
}

/** The 19 canonical stories — same registry as the a11y sweep (5.1–5.3). */
const SWEEP: readonly SweepTarget[] = [
  { component: 'tk-button', story: 'components-button--playground' },
  { component: 'tk-link', story: 'components-link--variants' },
  { component: 'tk-badge', story: 'components-badge--variants' },
  { component: 'tk-progress-bar', story: 'components-progressbar--playground' },
  { component: 'tk-modal', story: 'components-modal--open' },
  { component: 'tk-tooltip', story: 'components-tooltip--open' },
  { component: 'tk-toast', story: 'components-toast--stack' },
  { component: 'tk-input', story: 'components-input--playground' },
  { component: 'tk-select', story: 'components-select--open' },
  { component: 'tk-checkbox', story: 'components-checkbox--playground' },
  { component: 'tk-segmented-radio', story: 'components-segmentedradio--playground' },
  { component: 'tk-thumbnail-picker', story: 'components-thumbnailpicker--playground' },
  { component: 'tk-tabs', story: 'components-tabs--playground' },
  { component: 'tk-navbar', story: 'components-navbar--playground' },
  { component: 'tk-footer', story: 'components-footer--playground' },
  { component: 'tk-promo-card', story: 'components-promocard--playground' },
  { component: 'tk-feature-card', story: 'components-featurecard--playground' },
  { component: 'tk-service-card', story: 'components-servicecard--playground' },
  { component: 'tk-article-card', story: 'components-articlecard--playground' },
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
  /** Absolute + inset-0-style full coverage: the pseudo is a FILL behind the element's content (vs a strip indicator like the navbar underline). */
  fullCover: boolean;
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
 * The deep paint collector. Passed as a REAL function (Playwright 1.63 no
 * longer CALLS string arrows in evaluate). Walks the story canvas
 * (#storybook-root), the toast stack and the overlay root (body-level
 * hosts), recursing into every shadow tree; per element it reads the
 * theme-relevant computed channels plus both box pseudos.
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
      bg: style.backgroundColor,
      borderTopColor: style.borderTopColor,
      borderTopWidth: style.borderTopWidth,
      shadow: style.boxShadow,
    };
  };
  const walk = (node: Element | ShadowRoot, prefix: string, parentIndex: number): void => {
    // Fingerprint: tag + variant-bearing host chain + id/classes + stable
    // ordinal among same-signature siblings (same-shaped siblings stay
    // distinct, and the ordinal is theme-independent).
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
      // descendant was pushed last (that mis-hang produced parent cycles
      // wherever a host carried slotted content — footer legal lines,
      // card CTA slots, toast actions).
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
  // position under the host — without this, a slotted CTA button's effective
  // background misses the card fill painted around the slot.
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
  if (match === null) return [0, 0, 0, 0]; // transparent / currentColor-resolved edge
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

/** The effective opaque background: composite the ancestor chain (fallback: the UA white paper). */
function effectiveBackground(records: PaintRecord[], index: number): Rgba {
  let acc: Rgba = [255, 255, 255, 1]; // unpainted canvas renders white in both themes
  let steps = 0;
  for (let i = index; i >= 0; i = records[i].parentIndex) {
    if ((steps += 1) > records.length) {
      throw new Error(`dark sweep: parentIndex cycle reached from ${records[index].path}`);
    }
    const own = parseColor(records[i].bg);
    acc = composite(own, acc);
    // Only an OPAQUE own layer stops the chain: a transparent layer over the
    // white fallback composites to opaque white yet paints nothing — the
    // walk must continue to the nearest genuinely painted ancestor.
    if (own[3] === 1) return acc;
  }
  return acc;
}

// ---------------------------------------------------------------------------
// Theme-invariant families (tokens.css values; the ONLY fills/text allowed
// to survive the dark flip unchanged — DESIGN.md Colors dark rules)
// ---------------------------------------------------------------------------

const YELLOW: readonly Rgba[] = [
  [255, 221, 45, 1],
  [252, 197, 33, 1],
  [250, 182, 25, 1],
];
const GREEN: readonly Rgba[] = [
  [57, 181, 74, 1],
  [44, 165, 58, 1],
  [22, 136, 33, 1],
];
const INK: readonly Rgba[] = [
  [144, 144, 144, 1],
  [102, 102, 102, 1],
  [51, 51, 51, 1],
  [0, 0, 0, 1],
];
const WHITE: Rgba = [255, 255, 255, 1];
/** Functional-scale INDICATOR fills (progress fill, status chips): text-less elements may keep them across the flip (the R2 redundancy ruling — aria carries the state). */
const INDICATOR_FILLS: readonly Rgba[] = [
  [23, 113, 230, 1],
  [20, 100, 204, 1],
  [224, 31, 25, 1],
  [211, 18, 14, 1],
];
const FORCE_INVARIANT: readonly Rgba[] = [...YELLOW, ...GREEN, ...INK];
const inFamily = (c: Rgba, family: readonly Rgba[]): boolean =>
  family.some((member) => sameColor(c, member));

/**
 * The one sanctioned invariant-FLIP: the inverse button's fill rides the
 * text-primary semantic (ink in light → white in dark — DESIGN.md
 * Components "inverse ... adapt via surface/ink semantics"). Detected by the
 * host-variant signature in the fingerprint.
 */
const inverseButtonFill = (path: string, light: Rgba, dark: Rgba): boolean =>
  path.includes('tk-button[variant=inverse]') &&
  inFamily(light, INK) &&
  sameColor(dark, WHITE);

/** Parse computed box-shadow layers; every layer must be a pure ring in dark. */
function shadowElevationLayers(shadow: string): string[] {
  if (shadow === 'none' || shadow === '') return [];
  // Split top-level commas (rgba() commas stay inside parens).
  const layers: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of shadow) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      layers.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) layers.push(current.trim());
  return layers.filter((layer) => {
    const lengths = [...layer.matchAll(/(-?[\d.]+)px/g)].map((m) => Number.parseFloat(m[1]));
    // A ring paints with zero x/y offset and zero blur; spread may be any.
    // Offset/blur occupy the first three lengths (color comes as rgb() —
    // its inner values are px-free, so the match set is the geometry).
    const [x = 0, y = 0, blur = 0] = lengths;
    return x !== 0 || y !== 0 || blur !== 0;
  });
}

/** Any shadow layer (ring or not) with a fully transparent color paints nothing. */
function shadowInvisibleLayers(shadow: string): boolean {
  if (shadow === 'none' || shadow === '') return false;
  return /transparent/.test(shadow);
}

interface PaintChannels {
  bg: string;
  borderTopColor: string;
  borderTopWidth: string;
  shadow: string;
}

// Channels per record pair are compared field-by-field; pseudos ride along.
function compareStory(
  component: string,
  lightRecords: PaintRecord[],
  darkRecords: PaintRecord[],
): string[] {
  const failures: string[] = [];
  const at = (i: number, theme: string): string =>
    `${theme} ${lightRecords[i]?.path ?? darkRecords[i]?.path ?? '(beyond end)'}`;

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

  /** Tier B: nearest ancestor with an UNCHANGED forced-invariant background (the charcoal-card CTA re-scope). */
  const ancestorInvariantBg = (i: number): boolean => {
    let steps = 0;
    for (let p = darkRecords[i].parentIndex; p >= 0; p = darkRecords[p].parentIndex) {
      if ((steps += 1) > darkRecords.length) {
        throw new Error(`dark sweep: parentIndex cycle reached from ${darkRecords[i].path}`);
      }
      const lightBg = parseColor(lightRecords[p].bg);
      const darkBg = parseColor(darkRecords[p].bg);
      if (sameColor(lightBg, darkBg) && inFamily(lightBg, FORCE_INVARIANT)) return true;
      // Only opaque ancestors stop the compositing chain from reaching past the card.
      if (darkBg[3] === 1 && lightBg[3] === 1) return false;
    }
    return false;
  };

  const checkPaint = (
    path: string,
    label: string,
    lightChannels: PaintChannels,
    darkChannels: PaintChannels,
    index: number,
    hasText: boolean,
  ): void => {
    // --- BACKGROUND: light-only leftovers + invariant holds -----------------
    const lightBg = parseColor(lightChannels.bg);
    const darkBg = parseColor(darkChannels.bg);
    if (sameColor(lightBg, darkBg)) {
      const legal =
        isTransparent(lightBg) ||
        inFamily(lightBg, FORCE_INVARIANT) ||
        (inFamily(lightBg, INDICATOR_FILLS) && !hasText) ||
        (sameColor(lightBg, WHITE) && ancestorInvariantBg(index));
      if (!legal) {
        failures.push(
          `${component}: ${path} (${label}) background ${lightChannels.bg} UNCHANGED in dark — not a theme-invariant family (yellow/green/ink) nor a Tier-B white-on-charcoal pill: the lightblue-200 bug class.`,
        );
      }
    } else if (inFamily(lightBg, FORCE_INVARIANT) && !inverseButtonFill(path, lightBg, darkBg)) {
      failures.push(
        `${component}: ${path} (${label}) background ${lightChannels.bg} (light) → ${darkChannels.bg} (dark): a yellow/green/ink/charcoal fill must stay EXACTLY in dark (the only sanctioned flip is the inverse-button text-primary channel).`,
      );
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
          `${component}: ${path} (${label}) border ${darkChannels.borderTopColor} in dark: the hairline vanished (expected the white-alpha dark remap or an invariant ink edge).`,
        );
      } else {
        const lightBorder = parseColor(lightChannels.borderTopColor);
        const darkBorder = parseColor(darkChannels.borderTopColor);
        if (
          sameColor(lightBorder, darkBorder) &&
          !isTransparent(lightBorder) &&
          !inFamily(lightBorder, [...INK, WHITE]) &&
          !inFamily(lightBorder, YELLOW)
        ) {
          failures.push(
            `${component}: ${path} (${label}) border color ${lightChannels.borderTopColor} UNCHANGED in dark — a light-only border (gray hairlines must remap to white-alpha).`,
          );
        }
      }
    }

    // --- SHADOW: elevation collapses to rings (UX-DR2) ----------------------
    const elevation = shadowElevationLayers(darkChannels.shadow);
    if (elevation.length > 0) {
      failures.push(
        `${component}: ${path} (${label}) paints an ELEVATION shadow in dark: '${darkChannels.shadow}' — dark replaces elevation with tonal steps (only pure rings / none are legal).`,
      );
    }
    if (shadowInvisibleLayers(darkChannels.shadow)) {
      failures.push(
        `${component}: ${path} (${label}) shadow '${darkChannels.shadow}' has a fully transparent layer in dark — a ring that paints nothing.`,
      );
    }
  };

  for (let i = 0; i < lightRecords.length; i += 1) {
    const lightRecord = lightRecords[i];
    const darkRecord = darkRecords[i];
    const { path } = lightRecord;

    // Inert (unprojected) nodes resolve nothing — nothing to compare.
    if (lightRecord.color === '' && darkRecord.color === '') continue;

    checkPaint(path, 'element', lightRecord, darkRecord, i, lightRecord.hasText);
    if (lightRecord.before && darkRecord.before) {
      checkPaint(path, '::before', lightRecord.before, darkRecord.before, i, lightRecord.hasText);
    }
    if (lightRecord.after && darkRecord.after) {
      checkPaint(path, '::after', lightRecord.after, darkRecord.after, i, lightRecord.hasText);
    }

    // --- TEXT COLOR discipline ----------------------------------------------
    const lightColor = parseColor(lightRecord.color);
    const darkColor = parseColor(darkRecord.color);
    if (sameColor(lightColor, darkColor) && !isTransparent(lightColor)) {
      const legal =
        inFamily(lightColor, [...INK, ...GREEN, ...YELLOW]) || sameColor(lightColor, WHITE);
      if (!legal && !lightRecord.placeholder) {
        failures.push(
          `${component}: ${path} text color ${lightRecord.color} UNCHANGED in dark — only white/ink/green-on-invariant text may survive the flip (link/error/secondary/muted must remap).`,
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
            `${component}: ${path} ${what} ${fgValue} on effective bg rgba(${bg.map((v) => Math.round(v)).join(', ')}) = ${ratio.toFixed(2)}:1 < ${threshold}:1 — illegible pair in dark.`,
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
        // Restricted ruling (DESIGN.md Colors): placeholder is non-essential
        // text — held to the non-text 3:1 floor, both themes.
        checkPair(darkRecord.placeholderColor, 3, 'placeholder');
      }

      // --- YELLOW KEEPS INK ---------------------------------------------------
      // Scoped to TEXT-BEARING surfaces: a yellow strip/disc with no text is
      // an indicator or art (the DESIGN AA table's redundant-indicator
      // ruling); a yellow UNDERLINE pseudo (navbar/drawer active) is a strip,
      // not a fill — only full-cover pseudos sit behind the text.
      if (darkRecord.hasText) {
        const yellowFill = (paint: string): boolean => inFamily(parseColor(paint), YELLOW);
        const behindText =
          yellowFill(darkRecord.bg) ||
          (darkRecord.before !== null && darkRecord.before.fullCover && yellowFill(darkRecord.before.bg)) ||
          (darkRecord.after !== null && darkRecord.after.fullCover && yellowFill(darkRecord.after.bg));
        if (behindText && !inFamily(parseColor(darkRecord.color), INK)) {
          failures.push(
            `${component}: ${path} paints a yellow fill behind text ${darkRecord.color} in dark — yellow ALWAYS keeps ink text (DESIGN.md Colors).`,
          );
        }
      }
    }
  }
  return failures;
}

async function collect(page: Page, story: string, theme: 'light' | 'dark'): Promise<PaintRecord[]> {
  await page.goto(buildStoryUrl(story, theme));
  await waitForStorySettled(page);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  }
  // Release any mount-placed focus so nothing depends on interaction state.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
  });
  return page.evaluate(collectPaint);
}

for (const target of SWEEP) {
  test(`dark sweep: ${target.component} — theme-flip paint audit (structure parity / AA pairs / invariants / shadow collapse)`, async ({
    page,
  }) => {
    const light = await collect(page, target.story, 'light');
    const dark = await collect(page, target.story, 'dark');
    // Sanity: the walk found real content (a vacuous pass proves nothing).
    expect(light.length, `${target.component}: the light walk found no elements`).toBeGreaterThan(0);
    const failures = compareStory(target.component, light, dark);
    expect(failures, failures.join('\n')).toEqual([]);
  });
}
