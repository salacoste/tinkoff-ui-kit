// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { TkButton, TkComboboxSearch, TkCookieBanner, TkDataTable, TkFilterChips, TkPagination, TkQrBlock, TkStepper, TkStoreBadges } from './index.js';

/**
 * Package entry: every component's public surface is reachable from
 * `pillkit-components` (the React wrapper generator imports elements from
 * the package root, so a component missing here breaks `pnpm gen`).
 *
 * The per-component pin is a NAMED list (never a magic count): adding a
 * component extends this suite deliberately.
 */
describe('pillkit-components entry', () => {
  it('re-exports the button element and registers tk-button', async () => {
    expect(TkButton).toBeDefined();
    await customElements.whenDefined('tk-button');
    expect(customElements.get('tk-button')).toBe(TkButton);
  });

  it('re-exports the v2 catalog controls (Stories 6.2–6.4) and registers their tags', async () => {
    const pinned: Array<[string, unknown]> = [
      ['tk-filter-chips', TkFilterChips],
      ['tk-pagination', TkPagination],
      ['tk-combobox-search', TkComboboxSearch],
      ['tk-cookie-banner', TkCookieBanner],
      ['tk-data-table', TkDataTable],
    ];
    for (const [tag, klass] of pinned) {
      expect(klass, `${tag} class re-exported`).toBeDefined();
      await customElements.whenDefined(tag);
      expect(customElements.get(tag)).toBe(klass);
    }
  });

  it('re-exports the marketing display trio (Story 7.3) and registers their tags', async () => {
    const pinned: Array<[string, unknown]> = [
      ['tk-stepper', TkStepper],
      ['tk-store-badges', TkStoreBadges],
      ['tk-qr-block', TkQrBlock],
    ];
    for (const [tag, klass] of pinned) {
      expect(klass, `${tag} class re-exported`).toBeDefined();
      await customElements.whenDefined(tag);
      expect(customElements.get(tag)).toBe(klass);
    }
  });
});
