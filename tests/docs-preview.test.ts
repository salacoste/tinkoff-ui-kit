// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { html, render } from 'lit';

import previewExport, { withDisclaimer, withTheme } from '../packages/docs/.storybook/preview';

/**
 * Running verification of the docs preview runtime (spec 1.5 review): the
 * decorators previously had no execution check — deleting withTheme or
 * withDisclaimer kept every gate green. Here they are invoked directly against
 * a stub story in happy-dom. (The 1.5 tokens-demo GROUPS sheet check was
 * removed with the demo at Story 1.7.)
 */

type StoryContextArg = Parameters<typeof withTheme>[1];

/** Minimal StoryContext stub — only what the decorators actually read. */
const ctx = (globals: Record<string, unknown>, id = 'components-button--playground'): StoryContextArg =>
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
      'Не аффилирован с Т-Банком и не одобрен им',
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
});
