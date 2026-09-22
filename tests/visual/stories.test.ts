import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildStoryUrl, readStoryIds } from './stories';

/**
 * Unit tests for the visual-harness discovery helpers (spec 1.6, Code Map:
 * happy-dom-free pure logic — the theme-URL builder and the loud-failure
 * reader). The happy-path reader runs against the real built index under the
 * same build-before-test assumption as tests/import-boundaries.test.ts
 * (pnpm build precedes pnpm test).
 */

/** Scratch index for the error-path cases — mkdtemp dirs live in the OS tmp tree. */
const indexIn = (dir: string, json: string): string => {
  const path = join(dir, 'index.json');
  writeFileSync(path, json);
  return path;
};

describe('visual harness story discovery (spec 1.6)', () => {
  it('light URL is the bare story URL — no globals param', () => {
    expect(buildStoryUrl('components-button--playground', 'light')).toBe(
      '/iframe.html?id=components-button--playground&viewMode=story',
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
    // Post-1.7 reality: Button stories are composed in (from components/src),
    // and the tokens demo is gone — story AND baseline removal traveled
    // together (baseline-removal rule).
    expect(ids).toContain('getting-started--page');
    expect(ids).toContain('components-button--playground');
    expect(ids.filter((id) => id.startsWith('tokens--'))).toEqual([]);
  });

  it('missing index fails loudly with build guidance', () => {
    const missing = join(mkdtempSync(join(tmpdir(), 'tk-visual-')), 'index.json');
    expect(() => readStoryIds(join(missing, '..'))).toThrow(/build it first/);
  });

  it('unparseable index fails loudly', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-visual-'));
    indexIn(dir, 'not json at all{');
    expect(() => readStoryIds(dir)).toThrow(/not valid JSON/);
  });

  it('unexpected index format version fails with adapt-the-reader guidance', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tk-visual-'));
    indexIn(dir, '{"v":6,"entries":{"a--b":{"type":"story","id":"a--b"}}}');
    expect(() => readStoryIds(dir)).toThrow(/v=6.*adapt the reader/us);
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
