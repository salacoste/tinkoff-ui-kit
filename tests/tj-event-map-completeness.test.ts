import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';

import { EVENT_MAP } from '../packages/tj-react/src/event-map.js';

/**
 * ТЖ EVENT_MAP ↔ component-sources completeness (Story 16.4): the bank's
 * tests/event-map-completeness.test.ts mechanization MIRRORED for the ТЖ
 * family — a kit custom event could ship with no registry entry and every
 * gate stayed green; this test makes the checklist item mechanical and loud.
 *
 * 1. Every kit-grammar event DISPATCH in ТЖ component sources — BOTH
 *    idioms this family allows: the bank `new CustomEvent('name', …)` mold
 *    AND the ТЖ event-class mold `new TjX…Event()` (16.4 opens it:
 *    TjOpenComposeEvent carries `static readonly eventName = 'open-compose'`)
 *    — MUST have a matching EVENT_MAP entry for that component's tag:
 *    `<event-name>` → React prop `on<EventName>` (e.g. `value-change` →
 *    `onValueChange`, `open-compose` → `onOpenCompose`) mapping back to the
 *    event name.
 * 2. Every registry tag must be a REAL manifest element (no stale entries
 *    for removed components).
 *
 * Derived from the committed manifest + component sources — the same inputs
 * `pnpm gen` consumes, so a new component/event fails HERE until the registry
 * entry lands and wrappers are regenerated. The test grows mechanically with
 * future entries (the spec 16.4 wording).
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const COMPONENTS_SRC = join(REPO_ROOT, 'packages', 'tj-components', 'src');
const MANIFEST_PATH = join(REPO_ROOT, 'packages', 'tj-components', 'custom-elements.json');

/**
 * Kit event-name grammar (CONVENTIONS §3/§9, the bank net + the ТЖ verb):
 * `<prop>-change` or bare occurrence verbs. `open-compose` (16.4, the first
 * ТЖ entry) is added so the tj-composer entry is DEMANDED by the net, not
 * hand-guarded only — future verbs append to the alternation.
 */
const KIT_EVENT_NAME = /-change$|^(open|close|dismiss|select|load-more|consent-choice|open-compose)$/;

/** `new CustomEvent<…>('event-name'` — the bank dispatch idiom, name literal. */
const CUSTOM_EVENT_DISPATCH = /new CustomEvent(?:<[^>]*>)?\(\s*'([^']+)'/g;

/** `new TjX…Event(` — the ТЖ event-class dispatch idiom (constructor arg). */
const CLASS_EVENT_DISPATCH = /new\s+(Tj[A-Za-z0-9]*Event)\s*\(/g;

/** `class TjX…Event extends CustomEvent<…> { … static readonly eventName = 'name'` — class → name resolution. */
const CLASS_EVENT_NAME =
  /class\s+(Tj[A-Za-z0-9]*Event)\s+extends\s+CustomEvent[\s\S]{0,800}?static\s+(?:readonly\s+)?eventName\s*=\s*'([^']+)'/g;

/** 'value-change' → 'onValueChange'; 'open-compose' → 'onOpenCompose'. */
const reactPropFor = (eventName: string): string =>
  `on${eventName
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')}`;

/** Manifest tags: the custom-element definitions `pnpm gen` generates wrappers for. */
function readManifestTags(): Set<string> {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as {
    modules?: { exports?: { kind?: string; name?: unknown }[] }[];
  };
  const tags = new Set<string>();
  for (const module of manifest.modules ?? []) {
    for (const exportEntry of module.exports ?? []) {
      if (exportEntry.kind === 'custom-element-definition' && typeof exportEntry.name === 'string') {
        tags.add(exportEntry.name);
      }
    }
  }
  return tags;
}

function* walkComponentSources(dir: string): Generator<string> {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    let stats;
    try {
      stats = statSync(full);
    } catch {
      continue;
    }
    if (stats.isDirectory()) {
      yield* walkComponentSources(full);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.stories.ts')) {
      yield full;
    }
  }
}

interface Dispatch {
  tag: string;
  eventName: string;
  file: string;
}

/**
 * Kit custom-event dispatches in ТЖ component sources, attributed to their
 * component directory's tag. The ТЖ layout names directories WITH the full
 * tag (src/tj-composer/tj-composer.ts — unlike the bank's bare input/
 * directories), so the tag IS the directory name and must carry the tj-
 * prefix.
 */
function collectDispatches(): Dispatch[] {
  const dispatches: Dispatch[] = [];
  for (const file of walkComponentSources(COMPONENTS_SRC)) {
    const tag = basename(dirname(file));
    // NO skip for non-tj- directories (the bank-mirror loudness): a
    // grammar-matching dispatch outside a component directory keeps its
    // (non-manifest) directory tag and FAILS test 2's attribution check —
    // a real dispatch in src/foo.ts ships loud, never silent-green.
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(CUSTOM_EVENT_DISPATCH)) {
      const eventName = match[1];
      if (KIT_EVENT_NAME.test(eventName)) {
        dispatches.push({ tag, eventName, file });
      }
    }
    // The event-class idiom: resolve class names → event names from the
    // same file's `static readonly eventName` declarations first.
    const classNames = new Map<string, string>();
    for (const match of text.matchAll(CLASS_EVENT_NAME)) {
      classNames.set(match[1], match[2]);
    }
    for (const match of text.matchAll(CLASS_EVENT_DISPATCH)) {
      const eventName = classNames.get(match[1]);
      if (eventName != null && KIT_EVENT_NAME.test(eventName)) {
        dispatches.push({ tag, eventName, file });
      } else if (eventName == null) {
        dispatches.push({ tag, eventName: `<unresolved ${match[1]}>`, file });
      }
    }
  }
  return dispatches;
}

const manifestTags = readManifestTags();
const dispatches = collectDispatches();

describe('ТЖ EVENT_MAP ↔ component sources completeness (Story 16.4)', () => {
  it('finds ТЖ kit custom-event dispatches and manifest tags (vacuous-scan guards)', () => {
    expect(manifestTags.size, 'manifest must list at least one element').toBeGreaterThan(0);
    expect(manifestTags).toContain('tj-composer');
    expect(manifestTags).toContain('tj-post-card');
    expect(dispatches.length, 'at least the tj-composer open-compose must be found').toBeGreaterThan(
      0,
    );
    expect(dispatches).toContainEqual(
      expect.objectContaining({ tag: 'tj-composer', eventName: 'open-compose' }),
    );
  });

  it('every ТЖ kit event dispatch (BOTH idioms) has a matching EVENT_MAP entry for its tag', () => {
    const missing: string[] = [];
    for (const { tag, eventName, file } of dispatches) {
      if (!manifestTags.has(tag)) {
        missing.push(
          `${file}: dispatches kit event '${eventName}' but its directory maps to '${tag}', absent from the manifest — a dispatch in a file outside a component directory breaks tag attribution`,
        );
        continue;
      }
      const reactProp = reactPropFor(eventName);
      const registered = EVENT_MAP[tag]?.[reactProp];
      if (registered !== eventName) {
        missing.push(
          `${file}: dispatches kit event '${eventName}' but EVENT_MAP['${tag}'].${reactProp} is ${String(registered)} — add the registry entry in packages/tj-react/src/event-map.ts and run pnpm gen`,
        );
      }
    }
    expect(missing).toEqual([]);
  });

  it('every ТЖ registry tag is a real manifest element (no stale entries)', () => {
    const stale = Object.keys(EVENT_MAP).filter((tag) => !manifestTags.has(tag));
    expect(
      stale,
      'EVENT_MAP entries must reference tags the manifest actually defines — remove entries for deleted components (CONVENTIONS §3)',
    ).toEqual([]);
  });
});
