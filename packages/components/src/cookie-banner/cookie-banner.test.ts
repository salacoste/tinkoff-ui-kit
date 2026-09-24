// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  TkCookieBanner,
  TK_COOKIE_BANNER_DEFAULT_ACCEPT_LABEL,
  TK_COOKIE_BANNER_DEFAULT_LABEL,
} from './cookie-banner.js';
import { cookieBannerSurfaceStyles } from './cookie-banner.css.js';

/**
 * tk-cookie-banner unit tests (spec 7.2): the ten rows of the I/O &
 * edge-case matrix, each asserted honestly —
 *
 * | Matrix row | Test |
 * |---|---|
 * | Open | «opens on the modal layer…», «open-change guard» |
 * | Accept | «accept emits consent-choice once…» |
 * | Esc | «Esc is PREVENTED, not answered…» |
 * | Outside click | «outside press mutates nothing» + the structural no-listener pin |
 * | Keyboard flow | «Tab flows NATURALLY» + the structural no-trap pin |
 * | Slotted link | «the slotted link projects…» + the sheet's ::slotted(a) pins |
 * | Empty slot | «the empty slot still renders the card» |
 * | Long message | «the width is capped…» (sheet pin; layout measured in the visual spec) |
 * | Close | «open=false releases…», focus restore |
 * | Disconnect | «disconnect during open: quiet teardown…» |
 *
 * …plus the §9 first-paint change-guard (listener BEFORE connect — the
 * vacuous-class trap caught 3× in this repo), the event shape, reflection,
 * the aria contract (role=dialog, NO aria-modal), live label props, the
 * rapid double-toggle, and the zero-bespoke/storage structural pins (the
 * Never list made mechanical).
 *
 * happy-dom boundaries (the molds' rule): no popover API (the controller
 * falls back to the overlay container — asserted via its DOM effects), no
 * layout (placement/width asserted by tests/visual/cookie-banner.spec.ts in
 * a real browser), no real Tab traversal (asserted structurally + by the
 * non-interception dispatch).
 */

const elementUpdated = (el: TkCookieBanner): Promise<unknown> => el.updateComplete;

type MountOptions = {
  props?: Partial<InstanceType<typeof TkCookieBanner>>;
  attributes?: Record<string, string>;
  message?: string;
};

const mount = async ({ props, attributes, message }: MountOptions = {}): Promise<TkCookieBanner> => {
  const el = new TkCookieBanner();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  if (message) el.innerHTML = message;
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

/**
 * The generated card: in tk-cookie-banner's shadow tree while closed,
 * REPARENTED into the controller's overlay container while open on the
 * fallback path (happy-dom has no popover API) — the modal surfaceOf mold.
 * Single-banner in every suite test that calls it.
 */
const cardOf = (el: TkCookieBanner): HTMLDivElement => {
  const own = el.shadowRoot?.querySelector('div');
  if (own instanceof HTMLDivElement) return own;
  const moved = document.querySelector('#tk-overlay-root > div');
  expect(moved, 'the generated card exists (shadow tree or overlay container)').toBeInstanceOf(
    HTMLDivElement,
  );
  return moved as HTMLDivElement;
};

const acceptButtonOf = (el: TkCookieBanner): HTMLButtonElement => {
  const button = cardOf(el).shadowRoot?.querySelector('button.banner__accept');
  expect(button, 'the accept button renders inside the card').not.toBeNull();
  return button as HTMLButtonElement;
};

/** Document-level activeElement is the card host while focus is inside its shadow root. */
const deepActiveInsideCard = (el: TkCookieBanner): HTMLElement | null => {
  const card = cardOf(el);
  if (document.activeElement !== card) return null;
  return card.shadowRoot?.activeElement instanceof HTMLElement
    ? card.shadowRoot.activeElement
    : null;
};

const pressEscape = (): boolean =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
  );

const dispatchTabOn = (target: Element): boolean =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
  );

const collectOpenStates = (el: TkCookieBanner): boolean[] => {
  const states: boolean[] = [];
  el.addEventListener('open-change', (event: Event) => {
    states.push((event as CustomEvent<{ value: boolean }>).detail.value);
  });
  return states;
};

describe('tk-cookie-banner', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    const container = document.getElementById('tk-overlay-root');
    container?.remove();
  });

  it('registers as tk-cookie-banner exposing TkCookieBanner', async () => {
    await customElements.whenDefined('tk-cookie-banner');
    expect(customElements.get('tk-cookie-banner')).toBe(TkCookieBanner);
  });

  // --- Matrix row: open ---------------------------------------------------------

  it('opens on the modal layer: card top-layer-mounted, named, non-modal, focused on «Хорошо»; open-change(true) POST-mount', async () => {
    const opener = document.createElement('button');
    opener.type = 'button';
    opener.textContent = 'Открыть';
    document.body.appendChild(opener);
    opener.focus();

    const el = await mount({
      message: 'Мы используем <a href="/privacy/">куки</a>, чтобы делать сайт удобным для вас',
    });
    const states = collectOpenStates(el);
    const dispatched: string[] = [];
    el.addEventListener('consent-choice', () => dispatched.push('consent-choice'));

    el.open = true;
    await elementUpdated(el);

    // Controller integration (container fallback path — happy-dom has no
    // popover API): reparented into the overlay container, z only via the
    // MODAL layer token (the scrimless ruling costs nothing here).
    const card = cardOf(el);
    expect(card.hidden).toBe(false);
    expect(card.parentElement?.id).toBe('tk-overlay-root');
    expect(card.style.zIndex).toBe('var(--tk-z-modal)');
    // The non-modal dialog contract: role=dialog, aria-modal ABSENT, named.
    expect(card.getAttribute('role')).toBe('dialog');
    expect(card.getAttribute('aria-modal')).toBeNull();
    expect(card.getAttribute('aria-label')).toBe(TK_COOKIE_BANNER_DEFAULT_LABEL);
    // Focus moved to the accept button (the natural next act).
    expect(deepActiveInsideCard(el)).toBe(acceptButtonOf(el));
    expect(acceptButtonOf(el).textContent?.trim()).toBe(TK_COOKIE_BANNER_DEFAULT_ACCEPT_LABEL);
    // Post-mount echo, exactly once; NO consent-choice on open.
    expect(states).toEqual([true]);
    expect(dispatched).toEqual([]);
  });

  it('the §9 first-paint change-guard: NO open-change on mount, closed OR open-attr (listener attached BEFORE connect)', async () => {
    // Lit lists every reactive property in the FIRST update's change map
    // with an undefined old value — the wasOpen !== undefined guard is what
    // spares a spurious open-change. Attaching the listener AFTER mount is
    // the vacuous-class trap (caught 3× in this repo): the event has already
    // fired or not by then.
    const closed = new TkCookieBanner();
    const closedStates = collectOpenStates(closed);
    document.body.appendChild(closed);
    await elementUpdated(closed);
    expect(closedStates).toEqual([]);
    // The card is LAZY (the modal surface mold — generated on first open);
    // a closed never-opened banner renders nothing at all.
    expect(closed.shadowRoot?.querySelector('div')).toBeNull();

    const opened = new TkCookieBanner();
    opened.setAttribute('open', '');
    const openedStates = collectOpenStates(opened);
    document.body.appendChild(opened);
    await elementUpdated(opened);
    expect(openedStates, 'the declarative open mounts but never dispatches').toEqual([]);
    expect(cardOf(opened).hidden).toBe(false);
  });

  // --- Matrix row: accept -------------------------------------------------------

  it('accept emits consent-choice ONCE (bare verb, no payload), changes NOTHING else; focus STAYS on the button', async () => {
    const el = await mount({ attributes: { open: '' }, message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    const choices: unknown[] = [];
    el.addEventListener('consent-choice', (event: Event) => {
      choices.push((event as CustomEvent).detail);
    });
    const accept = acceptButtonOf(el);
    expect(deepActiveInsideCard(el)).toBe(accept);

    accept.click();
    await elementUpdated(el);

    expect(choices).toEqual([null]); // once, payload-less (§3 bare verb — detail defaults to null)
    expect(el.open, 'the kit NEVER closes itself').toBe(true);
    expect(el.hasAttribute('open'), 'the reflected attr is untouched too').toBe(true);
    expect(states, 'no open-change from the accept path').toEqual([]);
    expect(deepActiveInsideCard(el), 'focus stays on the button').toBe(accept);
    expect(cardOf(el).hidden, 'the card stays mounted until the consumer flips open').toBe(false);
  });

  it('consent-choice is composed and bubbles (§3 — consumers listen anywhere)', async () => {
    const el = await mount({ attributes: { open: '' } });
    let composed = false;
    let bubbled = false;
    el.parentElement?.addEventListener('consent-choice', (event: Event) => {
      composed = event.composed;
      bubbled = true;
    });
    acceptButtonOf(el).click();
    expect(bubbled).toBe(true);
    expect(composed).toBe(true);
  });

  // --- Matrix row: Esc ------------------------------------------------------------

  it('Esc is PREVENTED, not answered: preventDefault + NO dismiss + NO open-change', async () => {
    const el = await mount({ attributes: { open: '' }, message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    const card = cardOf(el);

    const prevented = pressEscape();
    await elementUpdated(el);

    expect(prevented, 'the banner consumes the keypress (cancelable → defaultPrevented)').toBe(
      false,
    );
    expect(el.open, 'NO dismiss — consent is a positive act').toBe(true);
    expect(states, 'NO open-change').toEqual([]);
    expect(card.hidden).toBe(false);
  });

  it('Esc is left alone while closed (the listener rides the open state)', async () => {
    const el = await mount({ message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    const prevented = pressEscape();
    expect(prevented, 'a closed banner never touches the keypress').toBe(true);
    expect(el.open).toBe(false);
    expect(states).toEqual([]);
  });

  // --- Matrix row: outside click ---------------------------------------------------

  it('outside press mutates nothing: a document pointerdown outside flips no state, dispatches nothing', async () => {
    const el = await mount({ attributes: { open: '' }, message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    const choices: number[] = [];
    el.addEventListener('consent-choice', () => choices.push(1));

    const outsider = document.createElement('button');
    document.body.appendChild(outsider);
    outsider.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
    );
    outsider.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await elementUpdated(el);

    expect(el.open, 'outside press NEVER dismisses (same ruling as Esc)').toBe(true);
    expect(states).toEqual([]);
    expect(choices).toEqual([]);
    expect(cardOf(el).hidden).toBe(false);
  });

  // --- Matrix row: keyboard flow ---------------------------------------------------

  it('Tab flows NATURALLY: a Tab keydown on the button is not intercepted (no trap, non-modal)', async () => {
    const el = await mount({ attributes: { open: '' }, message: '<a href="/privacy/">куки</a>' });
    const accept = acceptButtonOf(el);
    // happy-dom moves no focus on bare keydowns — the honest assertion is
    // NON-interception: the event completes un-prevented (a trap would
    // preventDefault and cycle), and no state changes.
    expect(dispatchTabOn(accept)).toBe(true);
    expect(dispatchTabOn(accept)).toBe(true); // Shift+Tab symmetrical — same listener set
    await elementUpdated(el);
    expect(el.open).toBe(true);
    expect(deepActiveInsideCard(el)).toBe(accept);
  });

  // --- Matrix row: slotted link ------------------------------------------------------

  it('the slotted link projects through the forwarding chain and the sheet styles it (hook color, hover-only underline)', async () => {
    const el = await mount({
      attributes: { open: '' },
      message: 'Мы используем <a href="/privacy/" aria-label="Согласие на обработку данных">куки</a>, чтобы…',
    });
    const link = el.querySelector('a');
    expect(link, 'the consumer anchor stays in the host light DOM').not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/privacy/');
    // The card's message slot exists and the card renders around it.
    const messageSlot = cardOf(el).shadowRoot?.querySelector('.banner__message slot');
    expect(messageSlot, 'the message slot renders inside the card').not.toBeNull();
    // The sheet's ::slotted contract: §6 hook color, underline INSIDE the
    // pseudo parens, hover-only at rest (the select ::slotted convention;
    // computed colors are the visual spec's job — real browser).
    const sheet = cookieBannerSurfaceStyles.cssText;
    expect(sheet).toContain('::slotted(a)');
    expect(sheet).toContain('::slotted(a:hover)');
    expect(sheet).toContain('--tk-cookie-banner-link, var(--tk-color-text-secondary)');
    expect(sheet).toContain('text-decoration: none');
    expect(sheet).toContain('::slotted(a:focus-visible)');
  });

  // --- Matrix row: empty slot -------------------------------------------------------

  it('the empty slot still renders the card (label + accept) — never blank (§2)', async () => {
    const el = await mount({ attributes: { open: '' } });
    const card = cardOf(el);
    expect(card.hidden).toBe(false);
    expect(card.shadowRoot?.querySelector('.banner__message')).not.toBeNull();
    expect(acceptButtonOf(el).textContent?.trim()).toBe('Хорошо');
    expect(card.getAttribute('aria-label')).toBe(TK_COOKIE_BANNER_DEFAULT_LABEL);
  });

  // --- Matrix row: long message -------------------------------------------------------

  it('the width is capped and floored: fit-content within [180px, 212px] (sheet pin; layout measured in the visual spec)', async () => {
    const el = await mount({
      attributes: { open: '' },
      message:
        '<p>Очень длинное сообщение о согласии, которое обязано переноситься по строкам, а карта — расти вниз, не растягиваясь вширь.</p>',
    });
    const card = cardOf(el);
    expect(card.hidden).toBe(false);
    const sheet = cookieBannerSurfaceStyles.cssText;
    expect(sheet).toContain('width: fit-content');
    expect(sheet).toContain('min-width: 180px');
    expect(sheet).toContain('--tk-cookie-banner-max-width, 212px');
  });

  // --- Matrix row: close ------------------------------------------------------------

  it('open=false releases per §9: card unmounts, focus returns to the opener, open-change(false) post-release', async () => {
    const opener = document.createElement('button');
    opener.type = 'button';
    document.body.appendChild(opener);
    opener.focus();

    const el = await mount({ message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    el.open = true;
    await elementUpdated(el);
    const card = cardOf(el);
    expect(deepActiveInsideCard(el)).toBe(acceptButtonOf(el));

    el.open = false;
    await elementUpdated(el);

    expect(card.hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot?.contains(card), 're-homed into the shadow tree').toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull(); // last overlay released
    expect(document.activeElement, 'focus restored to the pre-open target').toBe(opener);
    expect(states).toEqual([true, false]);
  });

  it('a close while focus is ELSEWHERE restores nothing (non-modal pages are interactive — no yank)', async () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const el = await mount({ message: '<p>Текст</p>' });
    el.open = true;
    await elementUpdated(el);
    // The user moved on — the page behind the non-modal banner is live.
    const elsewhere = document.createElement('button');
    document.body.appendChild(elsewhere);
    elsewhere.focus();
    expect(document.activeElement).toBe(elsewhere);
    el.open = false;
    await elementUpdated(el);
    expect(document.activeElement, 'focus stays where the user put it').toBe(elsewhere);
  });

  // --- Matrix row: disconnect ---------------------------------------------------------

  it('disconnect during open: quiet teardown — no leaked mount, listener, or dispatch', async () => {
    const el = await mount({ attributes: { open: '' }, message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    const card = cardOf(el);
    el.remove();
    await elementUpdated(el);
    expect(el.open).toBe(false);
    expect(card.hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull();
    // The document Esc listener left with the element: a stray Esc after
    // disconnect is not even PREVENTED, let alone answered.
    expect(pressEscape()).toBe(true);
    expect(states).toEqual([]);
  });

  // --- Events / reflection / live props -------------------------------------------------

  it('open-change is composed, bubbles, and carries detail { value }', async () => {
    const el = await mount({ message: '<p>Текст</p>' });
    const seen: boolean[] = [];
    const composedHeard: boolean[] = [];
    el.parentElement?.addEventListener('open-change', (event: Event) => {
      composedHeard.push(event.composed);
      seen.push((event as CustomEvent<{ value: boolean }>).detail.value);
    });
    el.open = true;
    await elementUpdated(el);
    el.open = false;
    await elementUpdated(el);
    expect(seen).toEqual([true, false]);
    expect(composedHeard).toEqual([true, true]);
  });

  it('the open attribute reflects', async () => {
    const el = await mount({ message: '<p>Текст</p>' });
    el.open = true;
    await elementUpdated(el);
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('label and acceptLabel are live while open (name + pill re-render in place)', async () => {
    const el = await mount({ attributes: { open: '', 'accept-label': 'Принять' }, message: '<p>Текст</p>' });
    const card = cardOf(el);
    expect(card.getAttribute('aria-label')).toBe(TK_COOKIE_BANNER_DEFAULT_LABEL);
    el.label = 'Настройки cookie';
    el.acceptLabel = 'Хорошо, понятно';
    await elementUpdated(el);
    expect(card.getAttribute('aria-label')).toBe('Настройки cookie');
    expect(acceptButtonOf(el).textContent?.trim()).toBe('Хорошо, понятно');
  });

  it('custom props land: label names the dialog, accept-label re-labels the pill', async () => {
    const el = await mount({
      attributes: { open: '', label: 'Использование cookie', 'accept-label': 'Принять' },
      message: '<p>Текст</p>',
    });
    expect(cardOf(el).getAttribute('aria-label')).toBe('Использование cookie');
    expect(acceptButtonOf(el).textContent?.trim()).toBe('Принять');
  });

  it('rapid double-toggle in one batch: ONE live mount, no spurious open-change(false)', async () => {
    const el = await mount({ message: '<p>Текст</p>' });
    const states = collectOpenStates(el);
    el.open = true;
    await elementUpdated(el);
    el.open = false;
    el.open = true; // same-tick re-open — the close and the reopen coalesce
    await elementUpdated(el);
    expect(states).toEqual([true]); // no false dispatched mid-flip
    expect(cardOf(el).hidden).toBe(false);
    expect(cardOf(el).parentElement?.id).toBe('tk-overlay-root'); // the ONE mount
    // Settle: nothing leaks when it eventually closes.
    el.open = false;
    await elementUpdated(el);
    expect(cardOf(el).hasAttribute('hidden')).toBe(true);
    expect(document.getElementById('tk-overlay-root')).toBeNull();
    expect(states).toEqual([true, false]);
  });

  // --- The Never list, made structural -------------------------------------------------

  it('ZERO-BESPOKE PIN: modal-layer mount consumed; NO lock/trap/positioning/outside-press of its own; NO storage, NO Tab interception', () => {
    // happy-dom rewrites import.meta.url to a non-file scheme — resolve from
    // the package cwd (vitest runs with cwd = packages/components).
    const source = readFileSync(resolve(process.cwd(), 'src/cookie-banner/cookie-banner.ts'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');
    const sheet = readFileSync(
      resolve(process.cwd(), 'src/cookie-banner/cookie-banner.css.ts'),
      'utf8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]*\/\/.*$/gm, '');

    // The controller capability IS consumed (mount only — the scrimless
    // ruling: the modal's lock/trap are this surface's Never list).
    expect(source).toMatch(/\bmountOverlay\b/);
    // …and NONE of the modalities or mechanics is present ANYWHERE in the
    // component: no scroll-lock, no trap, no anchor positioning, no outside
    // press, no z writes, no Tab interception, no storage, no cookies.
    for (const banned of ['lockBodyScroll', 'trapFocus', 'positionFloating', 'pointerdown']) {
      expect(source, `${banned} must not appear in cookie-banner.ts`).not.toMatch(
        new RegExp(`\\b${banned}\\b`),
      );
    }
    for (const sourceText of [source, sheet]) {
      expect(sourceText).not.toMatch(/zIndex/);
      expect(sourceText).not.toMatch(/z-index/);
      expect(sourceText).not.toMatch(/localStorage/);
      expect(sourceText).not.toMatch(/sessionStorage/);
      expect(sourceText).not.toMatch(/\bdocument\.cookie\b/);
      expect(sourceText).not.toMatch(/===\s*'Tab'/);
      expect(sourceText).not.toMatch(/keydown.*Tab/s);
      expect(sourceText).not.toMatch(/scroll-lock/);
      expect(sourceText).not.toMatch(/aria-modal/);
    }
    // The placement is the sheet's fixed frame (the modal centered-frame
    // split) — position: fixed present, top-layer promotion NEVER hand-rolled.
    expect(sheet).toContain('position: fixed');
    expect(sheet).not.toMatch(/showPopover/);
    expect(source).not.toMatch(/showPopover/);
  });
});
