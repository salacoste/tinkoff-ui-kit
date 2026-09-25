// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { TK_STEPPER_DEFAULT_EMPTY_COPY, TkStepper } from './stepper.js';
import { stepperStyles } from './stepper.css.js';

/**
 * tk-stepper unit tests (spec 7.3): the stepper half of the I/O & edge-case
 * matrix — the 3-card numbered render (badge half-overlap + centered copy as
 * structural pins), automatic numbering at 5 steps (with the data shape
 * carrying NO number field), the CTA slot rhythm gate (empty / set), the
 * zero-state copy slot, and the single-column collapse — plus the §2
 * null-clamps and the heading/hidden guards.
 */

const elementUpdated = (el: TkStepper): Promise<unknown> => el.updateComplete;

/** Style sheet text with comments stripped (the cssText-pin pattern). */
const sheet = () => stepperStyles.cssText.replace(/\/\*[\s\S]*?\*\//g, '');

/** One rule's body, matched at LINE START (the promo-card ruleBody mold). */
const ruleBody = (selector: string): string =>
  sheet().match(new RegExp(`^ {2}${selector}\\s*\\{([^}]*)\\}`, 'm'))?.[1] ?? '';

const STEPS_3 = [
  { title: 'Заявка', text: 'Заполните форму за 10 минут' },
  { title: 'Проверка', text: 'Подтвердите данные компании' },
  { title: 'Счет', text: 'Получите реквизиты и начинайте работать' },
];

type MountOptions = {
  props?: Partial<InstanceType<typeof TkStepper>>;
  attributes?: Record<string, string>;
  slotChildren?: Node[];
};

const mount = async ({ props, attributes, slotChildren }: MountOptions = {}): Promise<TkStepper> => {
  const el = new TkStepper();
  for (const [name, value] of Object.entries(attributes ?? {})) el.setAttribute(name, value);
  for (const child of slotChildren ?? []) el.appendChild(child);
  document.body.appendChild(el);
  if (props) Object.assign(el, props);
  await elementUpdated(el);
  return el;
};

const cards = (el: TkStepper): Element[] => [...(el.shadowRoot?.querySelectorAll('.step') ?? [])];

const numbers = (el: TkStepper): string[] =>
  [...(el.shadowRoot?.querySelectorAll('.step__number') ?? [])].map((n) => (n.textContent ?? '').trim());

describe('tk-stepper', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as tk-stepper exposing TkStepper', async () => {
    await customElements.whenDefined('tk-stepper');
    expect(customElements.get('tk-stepper')).toBe(TkStepper);
  });

  // --- Matrix row 1: steps 3 — numbered cards, badge overlap, centered copy ---------

  it('renders an ordered 3-card row: numbered badges 1-3, title + text each, aria-hidden paint', async () => {
    const el = await mount({ props: { steps: STEPS_3 } });
    const list = el.shadowRoot?.querySelector('ol.stepper__steps');
    expect(list, 'the ordered list renders (list semantics announce «item N»)').not.toBeNull();
    expect(cards(el)).toHaveLength(3);

    const [first] = cards(el);
    expect(first?.querySelector('.step__badge')?.getAttribute('aria-hidden')).toBe('true');
    expect(first?.querySelector('.step__title')?.textContent?.trim()).toBe('Заявка');
    expect(first?.querySelector('.step__text')?.textContent?.trim()).toBe('Заполните форму за 10 минут');
    expect(numbers(el)).toEqual(['1', '2', '3']);
  });

  it('BADGE OVERLAP pin: the badge center sits EXACTLY on the card top edge, centered on the cardline', () => {
    const badge = ruleBody('.step__badge');
    expect(badge, 'the .step__badge rule exists').not.toBe('');
    expect(badge).toMatch(/position:\s*absolute/);
    expect(badge).toMatch(/top:\s*0/);
    expect(badge).toMatch(/left:\s*50%/);
    expect(badge).toMatch(/transform:\s*translate\(-50%,\s*-50%\)/); // half above, half below
  });

  it('CENTERED COPY pin: cards center their copy; the row is an auto-fit grid at the 48 token gap', () => {
    expect(ruleBody('.step')).toMatch(/text-align:\s*center/);
    const steps = ruleBody('.stepper__steps');
    expect(steps).toMatch(/grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(240px,\s*1fr\)\)/);
    expect(steps).toMatch(/gap:\s*var\(--tk-space-48\)/);
  });

  // --- Matrix row 2: automatic numbering at 5 steps -----------------------------------

  it('numbers 1..5 automatically; the data shape has NO field a number could arrive through', async () => {
    const five = Array.from({ length: 5 }, (_, index) => ({ title: `Шаг ${index}`, text: 'Текст' }));
    const el = await mount({ props: { steps: five } });
    expect(numbers(el)).toEqual(['1', '2', '3', '4', '5']);
    expect(Object.keys(el.steps[0] ?? {}).sort(), 'numbering is chrome, never data').toEqual(['text', 'title']);
  });

  // --- Matrix row 3: the CTA slot -----------------------------------------------------------------------

  it('CTA slot empty (the reference block): no data-has-cta, no CTA rhythm', async () => {
    const el = await mount({ props: { steps: STEPS_3 } });
    expect(el.shadowRoot?.querySelector('.stepper__cta')).not.toBeNull(); // the container rides the card branch
    expect(el.hasAttribute('data-has-cta')).toBe(false);
    const gate = sheet().match(/:host\(\[data-has-cta\]\) \.stepper__cta\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(gate, 'the margin is gated on the host attribute (nothing fires without content)').toMatch(
      /margin-block-start:\s*var\(--tk-space-40\)/,
    );
  });

  it('CTA slot set: slotchange toggles data-has-cta (the rhythm opens under the cards)', async () => {
    const el = await mount({ props: { steps: STEPS_3 } });
    expect(el.hasAttribute('data-has-cta')).toBe(false);
    const cta = document.createElement('button'); // assign AFTER mount: slotchange is a CHANGE event
    cta.textContent = 'Открыть счет';
    el.appendChild(cta);
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0)); // happy-dom delivers slotchange async
    expect(el.hasAttribute('data-has-cta')).toBe(true);

    cta.remove();
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.hasAttribute('data-has-cta'), 'clearing the slot closes the rhythm').toBe(false);
  });

  // --- Matrix row 4: the zero-state copy slot --------------------------------------------------------------

  it('steps=[] renders the documented zero-state copy slot (never blank §2); empty-slot content overrides', async () => {
    const el = await mount();
    const empty = el.shadowRoot?.querySelector('.stepper__empty');
    expect(empty?.textContent?.trim()).toBe(TK_STEPPER_DEFAULT_EMPTY_COPY);
    expect(el.shadowRoot?.querySelector('.stepper__steps')).toBeNull();

    const override = document.createElement('p');
    override.setAttribute('slot', 'empty');
    override.textContent = 'Скоро расскажем, как открыть счет';
    const custom = await mount({ slotChildren: [override] });
    // A slot's OWN textContent stays its fallback — assignedNodes is the
    // truth (the tk-footer/promo-card precedent).
    const slot = custom.shadowRoot?.querySelector('.stepper__empty slot');
    expect(slot?.assignedNodes({ flatten: true })).toContain(override);
  });

  it('null steps clamp to the zero state without throwing (§2)', async () => {
    const el = await mount({ props: { steps: null as unknown as TkStepper['steps'] } });
    expect(el.shadowRoot?.querySelector('.stepper__empty')).not.toBeNull();
  });

  // --- Matrix row 5: the single-column collapse ------------------------------------------------------------

  it('ONE-COLUMN pin: the auto-fit grid collapses to a single column on narrow hosts; the badge geometry is viewport-free', () => {
    // auto-fit + minmax(240px,1fr): below 2×240+48 every host renders ONE
    // column — the collapse is the grid's own arithmetic, structural here.
    expect(ruleBody('.stepper__steps')).toMatch(/repeat\(auto-fit,\s*minmax\(240px,\s*1fr\)\)/);
    // The badge is positioned against the CARD (top/left/translate), never
    // against the viewport — its geometry survives the collapse untouched.
    const badge = ruleBody('.step__badge');
    expect(badge).toMatch(/position:\s*absolute/);
    expect(badge).not.toMatch(/\d(vw|vh)\b/); // no viewport units — geometry is card-relative
  });

  // --- Props & guards ----------------------------------------------------------------------------------------

  it('heading renders as the block h2 when set, nothing when unset', async () => {
    const withHeading = await mount({ props: { steps: STEPS_3, heading: 'Откройте счет для бизнеса' } });
    const h2 = withHeading.shadowRoot?.querySelector('h2.stepper__heading');
    expect(h2?.textContent?.trim()).toBe('Откройте счет для бизнеса');
    expect(sheet()).toMatch(/font-size:\s*var\(--tk-text-heading-2-size\)/);

    const bare = await mount({ props: { steps: STEPS_3 } });
    expect(bare.shadowRoot?.querySelector('.stepper__heading')).toBeNull();
  });

  it('HIDDEN guard: the sheet sets :host display, so [hidden] is enforced explicitly', () => {
    const cssText = sheet();
    expect(cssText).toMatch(/:host\s*\{[^}]*display:\s*block/);
    expect(cssText).toMatch(/:host\(\[hidden\]\)\s*\{[^}]*display:\s*none/);
  });

  it('NO-MOTION pin: the never-list — zero transition/animation declarations anywhere in the sheet', () => {
    expect(sheet()).not.toMatch(/\btransition\b/);
    expect(sheet()).not.toMatch(/\banimation\b/);
  });

  // --- subtitle slot (story 10.2 — the presence-mold conditional wrapper) ---

  const subtitleP = (): HTMLParagraphElement => {
    const p = document.createElement('p');
    p.setAttribute('slot', 'subtitle');
    p.textContent = 'Откройте расчетный счет онлайн за 10 минут';
    return p;
  };

  it('subtitle slot empty: wrapper ABSENT, data-has-subtitle off, the bare hidden slot keeps listening', async () => {
    const el = await mount({ props: { steps: STEPS_3, heading: 'Откройте счет' } });
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).toBeNull();
    expect(el.hasAttribute('data-has-subtitle')).toBe(false);
    // The promo-card mold: the hidden unwrapped slot stays in the DOM so
    // slotchange still fires when content arrives later.
    const slot = el.shadowRoot?.querySelector('slot[name="subtitle"]');
    expect(slot).not.toBeNull();
    expect(slot?.hasAttribute('hidden')).toBe(true);
    // ADJACENCY REGRESSION (pixel-caught in the 10.2 visual round): the
    // listening slot must sit OUTSIDE the rhythm pairs — the heading's next
    // sibling is the steps row, so `.stepper__heading + .stepper__steps`
    // keeps firing exactly as pre-10.2.
    const heading = el.shadowRoot?.querySelector('.stepper__heading');
    expect(heading?.nextElementSibling?.classList.contains('stepper__steps')).toBe(true);
  });

  it('subtitle slotted statically: the wrapper renders between heading and cards with the node assigned', async () => {
    const p = subtitleP();
    const el = await mount({ props: { steps: STEPS_3, heading: 'Откройте счет' }, slotChildren: [p] });
    const wrapper = el.shadowRoot?.querySelector('p.stepper__subtitle');
    expect(wrapper, 'the wrapper renders around the slot').not.toBeNull();
    expect(wrapper?.querySelector('slot[name="subtitle"]')?.hasAttribute('hidden')).toBe(false);
    expect(wrapper?.querySelector('slot[name="subtitle"]')?.assignedNodes({ flatten: true })).toContain(p);
    expect(el.hasAttribute('data-has-subtitle')).toBe(true);
    // Document order: heading → subtitle → steps (the probed composition).
    const heading = el.shadowRoot?.querySelector('.stepper__heading');
    const steps = el.shadowRoot?.querySelector('.stepper__steps');
    expect(
      heading && wrapper ? wrapper.compareDocumentPosition(heading) : 0,
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(
      steps && wrapper ? steps.compareDocumentPosition(wrapper) : 0,
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);

    // Removing the content closes the wrapper again (slotchange both ways).
    p.remove();
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0)); // happy-dom delivers slotchange async
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).toBeNull();
    expect(el.hasAttribute('data-has-subtitle')).toBe(false);
  });

  it('subtitle arriving late: slotchange flips the wrapper in (first-paint seeding is not the only path)', async () => {
    const el = await mount({ props: { steps: STEPS_3 } });
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).toBeNull();
    const p = subtitleP();
    el.appendChild(p); // assign AFTER mount: slotchange is a CHANGE event
    await elementUpdated(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).not.toBeNull();
    expect(el.hasAttribute('data-has-subtitle')).toBe(true);
  });

  it('subtitle without heading: renders alone — no hidden coupling to the heading', async () => {
    const el = await mount({ props: { steps: STEPS_3 }, slotChildren: [subtitleP()] });
    expect(el.shadowRoot?.querySelector('.stepper__heading')).toBeNull();
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).not.toBeNull();
  });

  it('subtitle + steps=[]: the subheading renders alongside the zero state (the slot is consumer-authoritative)', async () => {
    const el = await mount({ slotChildren: [subtitleP()] }); // no steps prop → []
    expect(el.shadowRoot?.querySelector('.stepper__empty')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).not.toBeNull();
  });

  it('subtitle rhythm pins: body-m centered copy; space-32 after heading; space-48 + space-32 before cards; space-32 before the empty state', () => {
    const subtitle = ruleBody('.stepper__subtitle');
    expect(subtitle, 'the .stepper__subtitle rule exists').not.toBe('');
    expect(subtitle).toMatch(/margin:\s*0/);
    expect(subtitle).toMatch(/text-align:\s*center/);
    expect(subtitle).toMatch(/font-size:\s*var\(--tk-text-body-m-size\)/);
    expect(subtitle).toMatch(/font-weight:\s*var\(--tk-text-body-m-weight\)/);
    expect(subtitle).toMatch(/color:\s*var\(--tk-stepper-subtitle, var\(--tk-color-text-primary\)\)/);
    // Probe (a): heading→subtitle ≈34px ink → space-32.
    expect(sheet()).toMatch(
      /\.stepper__heading \+ \.stepper__subtitle\s*\{[^}]*margin-block-start:\s*var\(--tk-space-32\)/,
    );
    // Probe (a): subtitle→card-top ≈81px → margin 48 + padding 32 = 80.
    expect(sheet()).toMatch(
      /\.stepper__subtitle \+ \.stepper__steps\s*\{[^}]*margin-block-start:\s*var\(--tk-space-48\)/,
    );
    expect(sheet()).toMatch(
      /\.stepper__subtitle \+ \.stepper__steps\s*\{[^}]*padding-block-start:\s*var\(--tk-space-32\)/,
    );
    // Kit-defined composite (unprobed — the empty state has no reference pair).
    expect(sheet()).toMatch(
      /\.stepper__subtitle \+ \.stepper__empty\s*\{[^}]*margin-block-start:\s*var\(--tk-space-32\)/,
    );
  });

  it('DOM identity: without a slotted subtitle the render carries no wrapper and no data-has-subtitle (default-off)', async () => {
    const el = await mount({ props: { steps: STEPS_3, heading: 'Откройте счет' } });
    expect(el.hasAttribute('data-has-subtitle')).toBe(false);
    expect(el.shadowRoot?.querySelector('.stepper__subtitle')).toBeNull();
  });
});
