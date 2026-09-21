# Token extraction — tbank.ru live computed styles (2026-09-21)

Source: playwright-cli eval on tbank.ru (`:root` CSS custom properties, 1112 total vars).
The Reference Site ships its own token vocabulary; the kit mirrors names/values where sensible.

## Color scales
- **Yellow:** #FFDD2D (primary) → #FCC521 (hover) → #FAB619 (active)
- **Black:** #909090 / #666666 / #333333 / #000000
- **Gray:** #F5F5F6 / #E7E8EA / #CBCFD3 / #959BA4 / #79818C / #616871
- **LightBlue:** #ECF1F7 / #E4EBF3 / #DDE4ED (textfield / secondary surfaces)
- **Blue:** #1771E6 / #1464CC / #0953B3
- **Green:** #39B54A / #2CA53A / #168821
- **Red:** #E01F19 / #D3120E / #C40B08
- White: #FFFFFF

## Semantic aliases (site)
--color-primary #FFDD2D · --color-card-secondary #F5F5F6 · --color-border #E7E8EA ·
--color-textfield #ECF1F7 · --color-textfield-placeholder #79818C · --color-text-inverse #FFFFFF

## Radius & elevation
- --border-radius-s: 4px · --border-radius-l: 8px
- Shadow system (semantic): default `0 4px 24px rgba(0,0,0,.12)`, default-hover `0 12px 36px rgba(0,0,0,.2)`,
  modal `0 18px 30px rgba(51,51,51,.52)`, popover/dropdown (3-layer), tooltip `0 6px 15px rgba(0,0,0,.2)`,
  sidebar `4px 0 24px rgba(0,0,0,.12)`
- Note: vision inventory shows pill controls (fully rounded) + 24–32px card radii in marketing
  components — marketing layer uses larger radii than the 4/8px app-layer vars above.

## Typography (proprietary fonts — cannot bundle, OQ-2)
- Families: `dsHeading` / `dsText` with fallback stack (-apple-system, BlinkMacSystemFont,
  Segoe UI, Helvetica Neue, sans-serif)
- Heading scale h1–h6: weight 700 (h1–h2), 500 (h3–h6); lh computed via ratio vars
- Text scale: xl / l / m / s / xs, weights 400 + 500 (bold); xs letter-spacing 0.4px

## Motion
- Curves: expressive standard `cubic-bezier(0.4,0.1,0.2,1)`, expressive entrance `cubic-bezier(0.35,1.3,0.25,1)`,
  expressive exit `cubic-bezier(0.4,0,1,1)`; productive standard `cubic-bezier(0.2,0,0.4,9.0→0.9)`,
  productive entrance `cubic-bezier(0,0,0.4,0.9)`, productive exit `cubic-bezier(0.2,0,1,1)`
- Durations: fastest 75ms / fast 150ms / moderate 300ms / slow 500ms / slowest 700ms

## On-dark tokens (site-native dark-surface layer — OQ-1 evidence)
- `--tui-background-neutral-1..6-on-dark`: #FFFFFF1A → #FFFFFF26 → #FFFFFF33 → #FFFFFF4D → #FFFFFF80
  (each with hover/pressed steps)
- Text inverse: #FFFFFF (01), #FFFFFFB3 (02), #FFFFFF80 (03); also rgba(255,255,255,.72) secondary
- `--tui-background-primary-on-dark: #FFFFFF`, accent-on-dark #fff
- Interpretation: the site already has a white-alpha layering vocabulary for dark surfaces
  (used on dark banners/cards); a full-page dark theme is not expressed on the site.
