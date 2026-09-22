import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { describe, expect, it } from 'vitest';

import { EVENT_MAP } from '../packages/react/src/event-map.js';

/**
 * EVENT_MAP ↔ component-sources completeness (Story 2.1 review): registry
 * completeness was manual-only (CONVENTIONS §3 PR-checklist item 3) — a kit
 * custom event could ship with no React entry and every gate stayed green.
 * This test makes the checklist item mechanical and loud:
 *
 * 1. Every `new CustomEvent('…')` dispatch in component sources whose event
 *    name matches the kit grammar (`/-change$|^(open|close|dismiss|select)$/`,
 *    CONVENTIONS §3) MUST have a matching EVENT_MAP entry for that component's
 *    tag: `<event-name>` → React prop `on<EventName>` (e.g. `value-change` →
 *    `onValueChange`) mapping back to the event name.
 * 2. Every registry tag must be a REAL manifest element (no stale entries for
 *    removed components).
 *
 * Derived from the committed manifest + component sources — the same inputs
 * `pnpm gen` consumes, so a new component/event fails HERE until the registry
 * entry lands and wrappers are regenerated.
 */

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const COMPONENTS_SRC = join(REPO_ROOT, 'packages', 'components', 'src');
const MANIFEST_PATH = join(REPO_ROOT, 'packages', 'components', 'custom-elements.json');

/** Kit event-name grammar (CONVENTIONS §3): `<prop>-change` or bare occurrence verbs. */
const KIT_EVENT_NAME = /-change$|^(open|close|dismiss|select)$/;

/** `new CustomEvent<…>('event-name'` — captures the dispatched event name literal. */
const CUSTOM_EVENT_DISPATCH = /new CustomEvent(?:<[^>]*>)?\(\s*'([^']+)'/g;

/** 'value-change' → 'onValueChange'; 'open' → 'onOpen'. */
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

/** Kit custom-event dispatches in component sources, attributed to their component directory's tag. */
function collectDispatches(): Dispatch[] {
  const dispatches: Dispatch[] = [];
  for (const file of walkComponentSources(COMPONENTS_SRC)) {
    const tag = `tk-${basename(dirname(file))}`;
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(CUSTOM_EVENT_DISPATCH)) {
      const eventName = match[1];
      if (KIT_EVENT_NAME.test(eventName)) {
        dispatches.push({ tag, eventName, file });
      }
    }
  }
  return dispatches;
}

const manifestTags = readManifestTags();
const dispatches = collectDispatches();

describe('EVENT_MAP ↔ component sources completeness (Story 2.1 review)', () => {
  it('finds kit custom-event dispatches and manifest tags (vacuous-scan guards)', () => {
    expect(manifestTags.size, 'manifest must list at least one element').toBeGreaterThan(0);
    expect(manifestTags).toContain('tk-button');
    expect(manifestTags).toContain('tk-input');
    expect(dispatches.length, 'at least tk-input value-change must be found').toBeGreaterThan(0);
  });

  it('every kit custom-event dispatch has a matching EVENT_MAP entry for its tag', () => {
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
          `${file}: dispatches kit event '${eventName}' but EVENT_MAP['${tag}'].${reactProp} is ${String(registered)} — add the registry entry in packages/react/src/event-map.ts and run pnpm gen`,
        );
      }
    }
    expect(missing).toEqual([]);
  });

  it('every registry tag is a real manifest element (no stale entries)', () => {
    const stale = Object.keys(EVENT_MAP).filter((tag) => !manifestTags.has(tag));
    expect(
      stale,
      'EVENT_MAP entries must reference tags the manifest actually defines — remove entries for deleted components (CONVENTIONS §3)',
    ).toEqual([]);
  });
});
