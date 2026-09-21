// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { html, render } from 'lit';

import previewExport, { withDisclaimer, withTheme } from '../packages/docs/.storybook/preview';
import { GROUPS } from '../packages/docs/src/tokens-demo.stories';

/**
 * Running verification of the docs preview runtime (spec 1.5 review): the
 * decorators previously had no execution check — deleting withTheme or
 * withDisclaimer kept every gate green. Here they are invoked directly against
 * a stub story in happy-dom. The GROUPS assertion keeps the demo's token list
 * honest: every swatch name must exist as a declaration in the built tokens
 * sheet (build-before-test assumption documented in import-boundaries.test.ts).
 */

// happy-dom rewrites import.meta.url to an http URL — process.cwd() is the
// vitest project root (repo root) and stays a real filesystem path.
const REPO_ROOT = process.cwd();

type StoryContextArg = Parameters<typeof withTheme>[1];

/** Minimal StoryContext stub — only what the decorators actually read. */
const ctx = (globals: Record<string, unknown>, id = 'tokens--swatches'): StoryContextArg =>
  ({ globals, id }) as unknown as StoryContextArg;

const stubStory = () => html`<p>stub</p>`;

const renderTo = (result: ReturnType<typeof stubStory>): HTMLElement => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(result, container);
  return container;
};

describe('docs preview runtime (spec 1.5 review)', () => {
  it('registers both decorators on the preview export', () => {
    expect(previewExport.decorators).toContain(withTheme);
    expect(previewExport.decorators).toContain(withDisclaimer);
  });

  it('withTheme flips data-theme on the document root from the toolbar global', () => {
    withTheme(stubStory, ctx({ theme: 'dark' }));
    expect(document.documentElement.dataset.theme).toBe('dark');

    withTheme(stubStory, ctx({ theme: 'light' }));
    expect(document.documentElement.dataset.theme).toBe('light');

    // Unknown/absent global falls back to light — the documented default.
    withTheme(stubStory, ctx({}));
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('withDisclaimer renders the banner with the not-affiliated text', () => {
    const container = renderTo(withDisclaimer(stubStory, ctx({ theme: 'light' })) as ReturnType<typeof stubStory>);
    expect(container.querySelector('.tk-docs-disclaimer')).not.toBeNull();
    expect(container.textContent?.replace(/\s+/g, ' ')).toContain(
      'Not affiliated with, endorsed by, or sponsored by T-Bank',
    );
    // The wrapped story content survives.
    expect(container.textContent).toContain('stub');
  });

  it('withDisclaimer suppresses the banner on the inline-disclaimer story', () => {
    const container = renderTo(
      withDisclaimer(stubStory, ctx({ theme: 'light' }, 'getting-started--page')) as ReturnType<typeof stubStory>,
    );
    expect(container.querySelector('.tk-docs-disclaimer')).toBeNull();
    expect(container.textContent).toContain('stub');
  });

  it('every tokens-demo GROUPS name is declared in the built tokens sheet', () => {
    const css = readFileSync(join(REPO_ROOT, 'packages/tokens/dist/index.css'), 'utf8');
    for (const group of GROUPS) {
      for (const token of group.tokens) {
        expect(css, `${token} (${group.heading}) is not declared — stale demo entry`).toContain(`${token}:`);
      }
    }
  });
});
