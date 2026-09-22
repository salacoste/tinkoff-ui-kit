import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Story auto-discovery for the visual harness (spec 1.6).
 *
 * The suite does NOT glob story source files — it reads the story index the
 * Storybook 10 static build emits (packages/docs/dist/index.json), so whatever
 * Storybook builds is exactly what gets tested and new stories are picked up
 * with zero harness edits.
 *
 * Emitted shape (noted per the spec's implementation note): JSON `{ "v": 5,
 * "entries": Record<id, { type, subtype, id, name, title, importPath, tags,
 * exportName }> }`. Only entries with `type: "story"` become tests.
 */

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

export const DOCS_DIST_DIR = join(REPO_ROOT, 'packages', 'docs', 'dist');

/** Both themes every story is captured and audited in (spec: theme parity). */
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

interface StoryIndexEntry {
  type?: string;
  id?: string;
}

interface StoryIndexFile {
  v?: number;
  entries?: Record<string, StoryIndexEntry>;
}

/**
 * Story ids from the built index, sorted for stable test order. Missing,
 * unparseable, or story-less index is a LOUD failure with build guidance —
 * never a silent zero-test pass.
 */
export function readStoryIds(distDir: string = DOCS_DIST_DIR): string[] {
  const indexPath = join(distDir, 'index.json');
  let raw: string;
  try {
    raw = readFileSync(indexPath, 'utf8');
  } catch {
    throw new Error(
      `Visual harness: story index not found at ${indexPath}. The suite tests the BUILT docs bundle — build it first: pnpm --filter pillkit-docs build (or just run pnpm test:visual, which builds it).`,
    );
  }
  let index: StoryIndexFile;
  try {
    index = JSON.parse(raw) as StoryIndexFile;
  } catch (error) {
    throw new Error(
      `Visual harness: story index at ${indexPath} is not valid JSON: ${(error as Error).message}`,
    );
  }
  // Format pin: without this, a future Storybook format change surfaces as the
  // misleading "contains no stories" (entries parsed under the wrong shape).
  if (index.v !== 5) {
    throw new Error(
      `Visual harness: story index at ${indexPath} has format v=${String(index.v)}, expected v=5 — adapt the reader (tests/visual/stories.ts) to the emitted shape and update the shape note in tests/visual/README.md.`,
    );
  }
  const ids = Object.values(index.entries ?? {})
    .filter((entry) => entry.type === 'story' && typeof entry.id === 'string')
    .map((entry) => entry.id as string)
    .sort();
  if (ids.length === 0) {
    throw new Error(
      `Visual harness: story index at ${indexPath} contains no stories — check packages/docs/src/*.stories.ts and rebuild the docs bundle.`,
    );
  }
  return ids;
}

/**
 * Per-theme story URL on the static docs server. Light is the bare story URL
 * (initialGlobals defaults the theme to light); dark appends the same
 * `globals=theme:dark` URL param the docs toolbar persists (mechanism proven
 * live in 1.5's static-build pass: it flips data-theme on the preview <html>).
 */
export function buildStoryUrl(id: string, theme: Theme): string {
  const params = new URLSearchParams({ id, viewMode: 'story' });
  if (theme === 'dark') params.set('globals', 'theme:dark');
  return `/iframe.html?${params.toString()}`;
}
