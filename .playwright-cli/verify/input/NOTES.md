# Story 2.1 — tk-input provisional baseline evidence (2026-09-22)

Provisional rule (autonomous run, tests/visual/README.md §Baseline workflow 3):
kit-vs-kit baselines enforce drift from here on; the maintainer confirms or
re-takes this batch. Side-by-side source:
`.playwright-cli/captures/input-application-form.png` (Story 2.0, tbank.ru
debit-card form, «Фамилия, имя и отчество*» + «+20%» badge).

## Files

| File | What |
|---|---|
| `side-by-side-light.png` | reference (top) vs kit light render (bottom), 40px gutter |
| `side-by-side-dark.png` | reference (top) vs kit dark render (bottom) |
| `kit-input-light.png` / `kit-input-dark.png` | kit renders (Playground story, field width pinned to 536px = reference crop, value «Иванов Алексей Петрович», badge «+30%») |

Kit renders captured from the BUILT docs bundle (tests/visual/serve.mjs,
pinned capture env: 1280×800, DSF 1, hinting off — same as the visual suite).

## Capture recipe (reproduce the kit renders)

```sh
pnpm --filter pillkit-docs build          # fresh bundle, not a stale dist
node tests/visual/serve.mjs 6009 &        # built docs + fonts on the fixed port
```

Then, in playwright (chromium, `--font-render-hinting=none --disable-lcd-text`,
viewport 1280×800, DSF 1, reducedMotion reduce, colorScheme light), open
`/iframe.html?id=components-input--playground&viewMode=story` (dark adds
`&globals=theme:dark`), wait for `#storybook-root` children, and pin the FIRST
`main tk-input` to the reference composition before screenshotting the element:

```js
await el.evaluate(async (node) => {
  node.style.width = '536px';                 // = reference crop width
  const chip = document.createElement('span');
  chip.setAttribute('slot', 'badge');
  chip.textContent = '+30%';                  // spec's canonical badge
  node.appendChild(chip);
  node.value = 'Иванов Алексей Петрович';     // filled controlled value
  await node.updateComplete;
});
await page.evaluate(() => document.fonts.ready);
await el.screenshot({ path: 'kit-input-<theme>.png' });
```

Side-by-sides: `magick ( <reference> -bordercolor '#CCCCCC' -border 1 ) ( -size 40x1 xc:white ) ( <kit> -bordercolor '#CCCCCC' -border 1 ) -background white -append`.

## Ground truth — computed styles vs reference measurements

Playwright `getComputedStyle` on the built story (the authoritative
comparison; vision color readings below carry the known near-white ambiguity):

| Aspect | Reference (capture pack) | Kit (computed) | Verdict |
|---|---|---|---|
| Field fill | `--color-textfield` = #ECF1F7 (vision read ~#F0F0F2, flagged ambiguous) | `rgb(236, 241, 247)` = #ECF1F7 | exact |
| Height | ~52px (57px element bound) | 52.0px | exact |
| Radius | 10–12px (vision ±) | 12px (--tk-radius-md) | in range |
| Hairline | at most 1px ~#E6E8EB | 1px #E7E8EA (--tk-color-border-default) | exact |
| Text inset | ~16px | 16px (--tk-space-16) | exact |
| Value text | ~#333333, ~16px | #333333, 17px (--tk-text-body-l) | matches (17 ≈ 16 reading; nearest token step) |
| Badge shape/pos | pill, flush right, ~3–8px inset | pill (9999px), right-anchored, 8px inset | matches |
| Badge fill | green (vision ~#21A04A) | #39B54A (--tk-color-green-100) | same family; kit one step brighter (token scale) |
| Badge text | white (vision) | ink #333 | DELIBERATE AA deviation, see below |
| Dark field | — (site is light-only) | #FFFFFF1A over #1A1A1A canvas, white value text, #FFFFFF24 hairline | authored dark layer, per tokens |

## Vision check notes (zai analyze_image, 2026-09-22)

Light pass — flagged «missing fill / no radius / no left inset»; CLEARED by
computed styles: #ECF1F7 is 96%-luminance and reads as white against the page
(the same ambiguity the 2.0 capture notes recorded for this exact surface —
vision previously read the REFERENCE'S OWN #ECF1F7 as ~#F0F0F0 gray).
Everything the pass confirmed as matching: text size (~17–18px), row height,
badge geometry/position, typeface consistency. The «missing asterisk» flag is
the capture setup (Playground default `required=false`), covered instead in
the Variants/Accessibility stories.

Dark pass — nothing broken or unreadable: translucent field over dark canvas,
white label (500 weight, the label-above pattern) and white value text both
high-contrast, badge pill clear. Nit noted: the dark hairline (#FFFFFF24) is
subtle at this scale — that is the token layer's design (dark borders
rgba(255,255,255,.14), DESIGN.md Dark theme).

## Intentional deviations (documented, not defects)

1. **Label above the field** (reference carries the label INSIDE the field at
   rest — a floating-label pattern). The kit's EXPERIENCE.md contract mandates
   label AND placeholder both supported with the label always visible, and the
   spec pins «Input has no animation by default» — a floating label is motion.
   Static label-above is the frozen pattern; noted in the story a11y notes.
2. **Badge text ink-on-green, not white.** White on green-100 = 2.66:1, fails
   AA at 12px; ink (#333) on green-100 = 4.74:1, passes — mirroring the
   yellow-keeps-ink rule (the kit's documented AA-override axis). Theme-invariant.
3. **Badge copy «+30%»** (the spec's canonical example) vs the reference's
   «+20%» — the badge is slotted consumer content; the chip look is what ships.
4. **Value text 17px** (`--tk-text-body-l`, the nearest token step) vs the
   reference's ~16px reading — the type scale has no 16px step; 17 was chosen
   over 15 to stay on the comfortable side of the measured value.
5. **Badge fill green-100 #39B54A** vs the reference's ~#21A04A — same green
   family, one step brighter on the kit's token scale (no extracted green
   token sits at the reference's darker value; scale fidelity chosen over a
   one-off hex, per the no-new-tokens rule).
6. **State mismatch in the side-by-side**: reference captured in its
   empty/label state, kit render pinned to a FILLED controlled value so the
   value typography is what gets compared. Placeholder/required/error/disabled
   states live in the baselined Variants story.
