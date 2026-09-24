import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import '../tabs/tabs.js';
import type { TkTab } from '../tabs/tabs.js';
import { qrBlockStyles } from './qr-block.css.js';

/**
 * One tab of the `tabs` prop — the frozen spec shape: a store/platform
 * label + the consumer's QR encoding + the optional security copy line.
 * The kit NEVER generates QR art — `qrSrc` is the consumer's encoding.
 */
export interface TkQrTab {
  /** Visible tab text («Android 9.0 и выше») — also the accessible tab name. */
  label: string;
  /** The consumer-hosted QR image; the alt text is auto-composed from the label. */
  qrSrc: string;
  /** Optional copy line UNDER the tile (the reference's camera-pointer note). */
  note?: string;
}

/**
 * tk-qr-block — the app-install QR section (Story 7.3): an optional centered
 * title, a two-tab platform switcher, and per-tab panels (the QR image in a
 * white rounded tile, the security copy line UNDER the tile) per the
 * invest-mobile capture (probe recorded in .playwright-cli/verify/qr-block/).
 *
 * THE TABLIST IS THE v1 tk-tabs CONTRACT COMPOSED — the `<tk-tabs>` element
 * itself renders inside this shadow root carrying its own keyboard matrix,
 * tab semantics, strict value channel and swap motion (NOT reimplemented;
 * the spec's STOP-and-report case never fired — the API expresses the
 * block). tk-qr-block adds NO value channel of its own: the block is a
 * display surface; the consumer drives selection through tk-tabs directly
 * (its `value`/`value-change` API, or uncontrolled by default — the
 * reference's plain switcher). The composed element is reachable as the
 * block's only tablist (`querySelector('tk-tabs')`), and the spec freeze
 * «no events beyond what tk-tabs itself owns» holds: `value-change` bubbles
 * out of this shadow root composed (tk-tabs' OWN event verbatim — nothing
 * here re-dispatches or maps it).
 *
 * VALUE MAPPING: this block identifies tabs by INDEX (`String(index)`) —
 * `TkQrTab` has no `value` field; the stable string key is the position,
 * which the per-index panel slots already assume (tk-tabs names panels
 * `tab-0..N`).
 *
 * STATELESS DISPLAY MOLD: no §4 channel, no events, nothing dispatches (the
 * event-map no-entry case — tk-tabs' own value-change is the composed
 * element's, not this class's). Degrades, never throws (§2):
 * null/undefined `tabs` clamps to the empty list; `tabs=[]` renders the
 * optional title and NO tablist (a tab strip with zero tabs is no strip);
 * a panel without `note` is the tile only (the matrix's no-note row).
 *
 * SSR-compat (AD-10): rendered via Lit templates only; no construction-time
 * DOM access.
 *
 * @tag tk-qr-block
 * @attr {string} title - Optional block heading (heading-4, centered; nothing rendered when unset).
 * @prop {TkQrTab[]} tabs - The platform tabs; each panel = note? + the QR tile.
 */
export class TkQrBlock extends LitElement {
  static override readonly styles = [qrBlockStyles];

  /**
   * Optional block heading — string DATA; unset ('' — the clamp) renders no
   * heading. TYPING NOTE: the name is the spec-FROZEN API and collides with
   * the native `HTMLElement.title` (typed `string`, never optional), so the
   * field is `string` defaulting to '' instead of `string | undefined` —
   * runtime optionality survives through the '' clamp below. Lit never
   * REFLECTS the property (no attribute is created — no native hover
   * tooltip from property use); a consumer who sets the ATTRIBUTE explicitly
   * gets the browser's own native-tooltip behavior on top, their call.
   */
  @property({ type: String })
  title = '';

  /** The platform tabs — array of { label, qrSrc, note? }; property-only (object data never reflects). */
  @property({ type: Array, attribute: false })
  tabs: TkQrTab[] = [];

  /** Tabs with null/undefined clamped to the empty list (null-tolerant props). */
  get #effectiveTabs(): TkQrTab[] {
    return this.tabs ?? [];
  }

  /** The v1 tab shape for the composed element — index-keyed values (see the class header). */
  #toTabs(tabs: TkQrTab[]): TkTab[] {
    return tabs.map((tab, index) => ({ value: String(index), label: tab?.label ?? '' }));
  }

  override render() {
    const tabs = this.#effectiveTabs;
    const title = (this.title ?? '').length > 0 ? this.title : undefined;

    return html`
      <div class="qr-block">
        ${title != null ? html`<h2 class="qr-block__title">${title}</h2>` : nothing}
        ${tabs.length > 0
          ? html`
              <tk-tabs .tabs=${this.#toTabs(tabs)}>
                ${tabs.map(
                  (tab, index) => html`
                    <div class="panel" slot="tab-${index}">
                      <div class="panel__tile">
                        <img
                          class="panel__qr"
                          src=${tab.qrSrc ?? nothing}
                          alt="QR-код для ${tab?.label ?? ''}"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      ${tab.note != null && tab.note.length > 0
                        ? html`<p class="panel__note">${tab.note}</p>`
                        : nothing}
                    </div>
                  `,
                )}
              </tk-tabs>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tk-qr-block': TkQrBlock;
  }
}

if (!customElements.get('tk-qr-block')) {
  customElements.define('tk-qr-block', TkQrBlock);
}
