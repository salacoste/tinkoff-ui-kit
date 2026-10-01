# Gap report 7 — invest promo/utility pages (7 pages, chunk 2)

Source: inv-gap2-promo agent, 2026-10-01. Inputs: /tmp/inv-caps PNG + census (promo-halal, promo-new-placements-stocks, moneybox, gift, open-api, reviews, mgm). Image budget (2) spent on mgm + promo-new-placements-stocks (image-verified); rest census+roster only.

Kit roster verified: 30 tk-* in `packages/components/src/index.ts:10-37` + 10 tj-*; patterns in `packages/components/src/showcase/` (invest-landing, business-landing, homepage, stocks-catalog) + `packages/docs/src/v2/`.

## Per-page classification

**promo-halal** (/invest/promo/halal/) — mostly COVERED — census 7 h2/13 h3, 2 tabs, 17 img: standard promo-landing mold (`showcase/invest-landing.stories.ts` + `business-landing.stories.ts`: hero, feature-card grids, tk-tabs, tk-stepper, CTA banners). Gap: video embed block (videos:1) — NEW-PATTERN (S).

**promo-new-placements-stocks** («Размещения IPO») — NEW-PATTERN (image-verified, richest page):
- «Как проходит размещение» — vertical 4-step timeline (numbered connected nodes) — NEW-PATTERN; stepper/stepper.ts is horizontal numbered cards only, no vertical/timeline mode.
- «Результаты прошлых размещений» — result cards: logo, name, «Цена размещения», pos/neg percent chips («+39,9 %» / «−6,9 %») — VARIANT of feature-card + badge gap: badge/badge.ts:45 variants incentive|stat|neutral|attention — no positive/negative financial tones.
- Big-number stat tiles («12 лет», «> 150 компаний», bordered row) — NEW-PATTERN; docs/v2 data-surfaces covers admin tiles, not marketing stat tiles.
- «Календарь размещений» month-grouped placement cards (ticker, «12–16 ₽» price range) — NEW-PATTERN (placement card).
- Logo cloud of past placements — NEW-PATTERN (minor).
- FAQ accordion «Частые вопросы» — NEW-COMPONENT; details:0 (JS accordion); grep: no accordion/FAQ component in either kit.
- Yellow disclaimer banner — COVERED (promo-card charcoal/yellow).

**moneybox** («Копите и инвестируйте с каждой покупки») — COVERED — census 4 tabs/2 tablists, 6 h2: round-up explainer = stepper + tabs + feature/promo-card composition, invest-landing mold. Minor VARIANT (census-only): round-up illustration row.

**gift** («Вам подарили долю в компании») — VARIANT + NEW-PATTERN — short page (3228px, 2 h2, inputs:2): claim steps COVERED (stepper); gift-certificate card — NEW-PATTERN; promo-code entry (input + CTA) — NEW-PATTERN small. No countdown evidence — not claimed.

**open-api** («T-Bank Invest API») — NEW-COMPONENT — census 5 h2/7 h3, tables:0 (endpoint lists NOT tables → cards/code), 8 img. API-docs chrome: code blocks + endpoint/method cards — nothing in kit; `--tk-font-mono` exists but docs-site-only (commit 6119d37). Census-inferred, not image-verified.

**reviews** («Оставьте отзыв… и получите бонус») — VARIANT + NEW — census 4 tabs/2 tablists, 21 buttons, 13 img: platform tabs + platform cards with store ratings + reward showcase. store-badges covers store links, not rating cards. Star-rating display — NEW-COMPONENT (S); tj-post-card has avatar/meta, no rating. Census-inferred.

**mgm** (referral, no h1 — hero title is a styled div) — image-verified:
- Hero «Приводите друзей» + 100 ₽/friend — COVERED.
- «Как это работает» 3 numbered cards — COVERED (tk-stepper exact match).
- Reward tiers «За 1 друга 100 ₽ / За 5 +100 / За 15 +900 / За 30 +2 400 ₽» — NEW-PATTERN (tiered reward cards).
- Share-link widget: readonly link pill (tinvest.io/…) + copy icon-button — NEW-PATTERN; qr-block covers QR-share, not link-copy (input+button+toast composable but unbuilt).
- «Где найти свою ссылку» app-path mini-cards — VARIANT of feature-card (minor).
- Social share icon-button row — VARIANT of tk-button (icon-only circular).

## Ranked NEW-element shortlist
1. FAQ accordion / expansion panel — S — image-verified on IPO (details:0 = JS accordion); no accordion anywhere in tk-*/tj-*; repeats on halal/moneybox/reviews likely. Highest reuse/effort ratio.
2. Vertical timeline (tk-stepper orientation="vertical" or new tk-timeline) — M — verified «Как проходит размещение»; stepper.ts horizontal only.
3. tk-code-block + endpoint/method card — M — open-api; tables:0 proves card/code rendering; --tk-font-mono docs-site-only. Census-inferred.
4. tk-rating (star display) — S — reviews platform cards. Census-inferred.
5. Share/copy-link widget + social icon row — S — mgm image-verified; gift promo-code entry same anatomy.
6. Stat tiles (big-number block) — S — IPO verified; marketing stat tiles not covered by data-surfaces.
7. Badge pos/neg financial tones + result card — S — extends badge.ts:45 union with positive/negative; unlocks IPO result cards + market surfaces.
8. Reward-tiers block — S/M — mgm verified.
9. Placement/IPO calendar card (month group + ticker + price range) — M — IPO verified; invest-niche.
10. Gift-certificate card — M — gift; census-inferred.
11. Video embed block — S — halal (videos:1).
12. Logo cloud of past placements — S — IPO verified; minor.

Explicitly COVERED: hero/CTA banners, numbered how-it-works steps (tk-stepper exact on mgm), tabbed sections (tk-tabs), feature grids (feature-card/promo-card incl. tints), yellow disclaimer banners, mgm hero+steps, moneybox body, halal body minus video.

Caveats: image budget 2/2 (mgm + IPO); open-api code-blocks, reviews star ratings, gift certificate/promo-code = census+roster inferences — flag as unverified in the gap-map until a maintainer lens pass. No countdown widget evidence on any of the 7 (do not add to gap-map). mgm has no h1 by design.
