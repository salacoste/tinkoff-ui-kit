# DIGEST — live t-j.ru measurements (validator A)

Date: 2026-10-01. Viewport 1280×720. Method: playwright-cli (`PLAYWRIGHT_CLI_SESSION=tinkoff-ui`), computed styles + getBoundingClientRect, read-only. Priors from `.playwright-cli/captures-v3/tj/probe-notes.md` (2026-09-28). Cross-origin CSS wall confirmed again — cssRules blocked, computed styles are ground truth.

## Surface 1+2: https://t-j.ru/ (light / dark)

| element | metric | live value | prior | drift |
|---|---|---|---|---|
| header | height | 70 | — | — |
| header | position | sticky, bg transparent, no blur | — | — |
| nav chip «Учебник» | w×h | 126.67×40 | — | — |
| nav chip | fs/fw | 16/400 | — | — |
| nav chip | padX / br | 13/13 / 20 (pill) | — | — |
| nav chip | bg/ink (light) | #FFFFFF / #000 | — | — |
| nav chip | bg/ink (dark) | #20232A / #FFF | — | — |
| nav | chip count | **2** (Учебник, Сообщество+avatars) | 3 («Для вас» present) | **DRIFT** |
| icon btns (Поиск/Уведомл/тема) | box | 30×30, transparent | — | — |
| Авторизоваться | box | 77×30 text | — | — |
| CTA «Написать» (light) | all | w97.69 h30 br5 bg#333 ink#FFF 15/400/lh20 Graphik pad15/5 | #333/#FFF r5 h30 15/400/lh20 | MATCH |
| CTA «Написать» (dark) | all | w97.69 h30 br5 bg#F5F5F9 ink#000 | w98 #F5F5F9/#000 | MATCH (w rounding) |
| page bg | light / dark | #F0F0F0 / #12151C | same | MATCH |
| card bg | light / dark | #FFFFFF / #20232A | same | MATCH |
| card radius | border-radius | **25px** (all cards, both themes) | — | — |
| card gap | vertical between top-level cards | **20px exactly** (51/51 on news feed) | — | — |
| grid gap | card-with-thumb grid | 20px (cols 418+262) | — | — |
| card padding | outer / inner | 25px top-bot outer; 30px side inner | — | — |
| section H2 | fs/fw/lh | 21/700/25 Graphik #000 | 21/700 | MATCH |
| card H3 | fs/fw/lh/color | 17/400/20 Graphik **#000** | 17/400 meta-colored | **DRIFT** (ink) |
| meta ink (time) | color/fs | #808080 17/400 | #A6A6A6 | partial (two grays in use) |
| dividers | | 1px #E5E5E5 ×28 | #E5E5E5 | MATCH |
| sidebar «Разделы» | w×h | 290×899 | w290 h899 | MATCH |
| sidebar item | h / label | 44 / 17/400/20 | — | — |
| sidebar icon tile | | 0×0 (lazy, not rendered) | — | — |
| avatars | byline / discussion | 20×20 / 40×40 r50% | 20px | MATCH |

## Surface 3: article /semeyana-new/ (finance piece)

| element | metric | live value | prior | drift |
|---|---|---|---|---|
| H1 | fs/fw/lh | 45/700/50 Graphik #000 | 45/700/50 | MATCH |
| column | width | 764 | w764 | MATCH |
| byline/time row | fs/h | 15/400 #808080, rows h20 ×2 | 15/400 #808080 | MATCH |
| lead | fs/fw/lh | 27/400/35 Charter | 27/400/35 | MATCH |
| body | fs/fw/lh | 21/400/30 Charter #000 | 21/400/30 | MATCH |
| **paragraph margins** | mt/mb | **mt0 mb25 → visual gap 25px exactly, uniform** | — | — |
| lead spacing | mt/mb | 30/25 | — | — |
| in-body H2 | fs/fw/lh | 38/700/45 Graphik | 38/700/45 | MATCH |
| H2 spacing | computed mt/mb | 0/0 (wrapper owns spacing); visual H2→first-P = 25px | — | — |
| **body links** | color/decoration | **#1414CC rgb(20,20,204), underline solid AT REST** (fs27+17) | gold #C79637 links | **DRIFT (major)** |
| pull-quote | | none in this article | Graphik 35/400/50 | n/a |
| figures | | full-col ~715-738px tall between sections | — | — |

## Surface 4: /flows/news/

| element | metric | live value | prior | drift |
|---|---|---|---|---|
| h1 | | 38/700/45 «Новости» | 38/700/45 | MATCH |
| subtitle | | **17/400 #000** | 16/400 gray | **DRIFT** |
| intro block | | w760 pad 50top/30side, br 0 0 25 25 | — | — |
| feed card | w/h/br | 760 / 581-611 / **25** | — | — |
| feed card | padding | 25 top-bot outer, 30 inner sides | — | — |
| **card gap** | vertical | **20px exactly, all 51 cards** | — | — |
| news title | fs/fw/lh | 24/700/30 Graphik #000 | 24/700/30 | MATCH |
| author row | | avatar 45×45, name 15/700 h20 at +10px | avatar 20 + 14px | **DRIFT** (bigger) |
| title→first meta | | title starts y85 (25 below author row) | — | — |
| bottom byline | | 15/400 #A6A6A6 | — | — |

## Surface 5: /pro/

| element | metric | live value | prior | drift |
|---|---|---|---|---|
| h1 | | 32/700 Graphik #000 | 32/700 | MATCH |
| hero card | bg/w/h/br | #8054FF / 1260 / 600 / **30** | r≈32 | **DRIFT** (30) |
| tag-chip pills | h/br/bg | **45 / 15 / rgba(255,255,255,.15)** 16/400 | rgba(.18) | **DRIFT** (alpha, exact dims) |
| featured titles | | 55/700/55 Graphik | 55/700 | MATCH |
| section cards | | w1180 h215 pad 25/40 br 30-30-0-0 (#AC80F7, #00947D) | — | — |

## Surface 6: /community/

| element | metric | live value | prior | drift |
|---|---|---|---|---|
| h1 | | 38/700/45 | 38/700 | MATCH |
| composer card | w/h/br/pad | 760 / 98 / **25** / 24-29 | r20 | **DRIFT** (25) |
| composer ghost | | «Написать пост или вопрос» 17/400 #808080 | ghost text | MATCH-ish |
| post titles | | 24/700/30 #000 | 24/700/30 | MATCH |
| layout | | **single 760px column at 1280, no grid** | «Выбор редакции grid» | **DRIFT** (layout) |
| card gap | | 20 | — | — |

## Site drift since 2026-09-28 (live vs frozen pack)

1. **Article body links are BLUE #1414CC underlined at rest** — the gold-#C79637-links claim does not hold for article body on live (gold may still exist in home chrome census, but article links are classic blue).
2. **Header nav lost the «Для вас» chip** — 2 chips now, not 3.
3. **Card H3 ink is black #000**, not meta-gray.
4. **News author avatar is 45×45 with 15/700 name**, not 20px + 14px author.
5. **/pro/ hero radius 30 (not ~32); tag pills h45 br15 alpha .15 (not .18).**
6. **/community/ composer radius 25 (not 20)** — matches a site-wide unified card radius of 25.
7. **/flows/news/ subtitle 17/400 black** (was 16/400 gray).
8. **Community «Выбор редакции» is single-column at 1280** — the prior "grid" claim may reflect a different viewport or an older layout.

## Stable anchors (unchanged, safe to pin)

- Card radius 25, card gap 20 (site-wide, both themes).
- CTA «Написать»: 30h/br5/15/400/lh20; #333→#F5F5F9 inversion in dark.
- Page/cards/dividers: #F0F0F0→#12151C, #FFF→#20232A, 1px #E5E5E5.
- Type registers: home 21/700/25 + 17/400/20; article Charter 27/35 lead + 21/30 body + H1 45/50 + H2 38/45; rubric h1 38/45; news titles 24/700/30; /pro/ h1 32; featured 55.
- **Article paragraph rhythm: 25px uniform.**
