import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildStoryUrl, readStoryIds } from './stories';

/**
 * Unit tests for the visual-harness discovery helpers (spec 1.6, Code Map:
 * happy-dom-free pure logic — the theme-URL builder and the loud-failure
 * reader). The happy-path reader runs against the real built index under the
 * same build-before-test assumption as tests/import-boundaries.test.ts and
 * tests/docs-preview.test.ts (pnpm build precedes pnpm test).
 */

/** Scratch index for the error-path cases — mkdtemp dirs live in the OS tmp tree. */
const indexIn = (dir: string, json: string): string => {
  const path = join(dir, 'index.json');
  writeFileSync(path, json);
  return path;
};

describe('visual harness story discovery (spec 1.6)', () => {
  it('light URL is the bare story URL — no globals param', () => {
    expect(buildStoryUrl('tokens--swatches', 'light')).toBe(
      '/iframe.html?id=tokens--swatches&viewMode=story',
    );
  });

  it('dark URL appends the toolbar-persisted theme global', () => {
    const url = buildStoryUrl('getting-started--page', 'dark');
    expect(url.startsWith('/iframe.html?')).toBe(true);
    const params = new URLSearchParams(url.slice('/iframe.html?'.length));
    expect(params.get('id')).toBe('getting-started--page');
    expect(params.get('viewMode')).toBe('story');
    expect(params.get('globals')).toBe('theme:dark');
  });

  it('URL-encodes story ids safely', () => {
    const params = new URLSearchParams(buildStoryUrl('a b--c d', 'dark').split('?')[1]);
    expect(params.get('id')).toBe('a b--c d');
  });

  it('reads story ids from a built index (build-before-test assumption)', () => {
    const ids = readStoryIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toEqual([...ids].sort());
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+--[a-z0-9-]+$/);
    // The stories that exist as of spec 1.6 — 1.7 adds Button and removes the
    // tokens demo, so this asserts membership, not the exact set.
    expect(ids).toContain('getting-started--page');
    expect(ids).toContain('tokens--swatches');
  });

  it('missing index fails loudly with build guidance', () => {
    const missing = join(mkdtempSync(join(tmpdir(), 'tk-visual-')), 'index.json');
    expect(() => readStoryIds(join(missing, '..'))).toThrow(/build it first/);
  });

  it('story-less index fails loudly (never a silent zero-test pass)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-visual-'));
    indexIn(dir, '{"v":5,"entries":{}}');
    expect(() => readStoryIds(dir)).toThrow(/contains no stories/);
  });

  it('non-story entries are filtered out', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-visual-'));
    indexIn(
      dir,
      '{"v":5,"entries":{"a--b":{"type":"story","id":"a--b"},"c--d":{"type":"docs","id":"c--d"}}}',
    );
    expect(readStoryIds(dir)).toEqual(['a--b']);
  });
});
