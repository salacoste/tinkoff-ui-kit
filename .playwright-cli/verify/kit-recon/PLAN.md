# Kit-recon visual reference — capture plan (spec 25.3, written BEFORE the first mint)

Determinism: viewport 1280×800, full-page screenshots, DOMContentLoaded +
settle; animations/fonts captured AS-IS (foreign docs — no font pin, no
injected styles). Names: `<kit>-<surface>-<theme>.png`.

Theme strategy (honest, no repaint): every kit first tries the standard
`prefers-color-scheme` emulation (a real media feature, not an injected
filter). The script VERIFIES the page actually went dark (computed
root/body background luminance); if not, the kit is probed for its own
docs toggle; if neither works — light-only + honest note in NOTES.md.
Foreign kits are never re-themed by us.

Surfaces per kit: (a) component gallery/index + (b) 2–3 representative
component pages; anchor Taiga gets the deeper set (input ticket-class /
dialog / table).

## self

Represented by the kit's own visual suite (2572 baselines, both themes,
per-component legs) — no external capture. Not in the yaml below.

## Plan data (consumed by recon/visual.mjs)

```yaml
kits:
  - id: taiga
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://taiga-ui.dev/" }
      - { name: button,  url: "https://taiga-ui.dev/components/button" }
      - { name: input,   url: "https://taiga-ui.dev/components/input" }
      - { name: table,   url: "https://taiga-ui.dev/components/table" }
  - id: shoelace
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://shoelace.style/" }
      - { name: button,  url: "https://shoelace.style/components/button" }
      - { name: input,   url: "https://shoelace.style/components/input" }
      - { name: dialog,  url: "https://shoelace.style/components/dialog" }
  - id: spectrum
    dark: { mode: media }
    surfaces:
      # real paths carry the components/ segment (landing anchors)
      - { name: gallery, url: "https://opensource.adobe.com/spectrum-web-components/" }
      - { name: button,  url: "https://opensource.adobe.com/spectrum-web-components/components/button/" }
      - { name: field,   url: "https://opensource.adobe.com/spectrum-web-components/components/textfield/" }
  - id: mui
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://mui.com/material-ui/all-components/" }
      - { name: button,  url: "https://mui.com/material-ui/react-button/" }
      - { name: input,   url: "https://mui.com/material-ui/react-text-field/" }
  - id: antd
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://ant.design/components/overview" }
      - { name: button,  url: "https://ant.design/components/button" }
      - { name: table,   url: "https://ant.design/components/table" }
  - id: mantine
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://mantine.dev/core/input/" }
      - { name: button,  url: "https://mantine.dev/core/button/" }
      - { name: table,   url: "https://mantine.dev/core/table/" }
  - id: shadcn
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://ui.shadcn.com/docs/components" }
      - { name: button,  url: "https://ui.shadcn.com/docs/components/button" }
      - { name: input,   url: "https://ui.shadcn.com/docs/components/input" }
  - id: carbon
    dark: { mode: media }
    surfaces:
      - { name: gallery, url: "https://carbondesignsystem.com/components/overview/" }
      - { name: button,  url: "https://carbondesignsystem.com/components/button/usage/" }
      - { name: input,   url: "https://carbondesignsystem.com/components/text-input/usage/" }
  - id: polaris
    dark: { mode: media }
    surfaces:
      # The standalone design-system site is retired: polaris.shopify.com/*
      # redirects into the shopify.dev reference hub; per-component pages no
      # longer exist. Captured: the surviving hub + the web-components guide.
      - { name: gallery, url: "https://shopify.dev/docs/api/polaris" }
      - { name: webcomponents, url: "https://shopify.dev/docs/api/polaris/using-polaris-web-components" }
  - id: radix
    dark: { mode: media }
    surfaces:
      # Primitives is headless — there IS no Button page (404 is the honest
      # proof); representative interactive primitives: dialog + accordion.
      - { name: gallery, url: "https://radix-ui.com/primitives/docs/overview/introduction" }
      - { name: accordion, url: "https://radix-ui.com/primitives/docs/components/accordion" }
      - { name: dialog,  url: "https://radix-ui.com/primitives/docs/components/dialog" }
```

## Review mold (AC4)

IM passport (dims/mean/std) per PNG; per-kit composite (4 columns ×
560px, resampleWidth — never `sips -z`, lesson 21.3); ≤2 vision reads
per kit (one downscaled composite read is the default); every honest
excess recorded in NOTES.md.
