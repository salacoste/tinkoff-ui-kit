# probe-notes — bank vertical round 2026-09-27

Raw eval transcripts (playwright-cli `-s=bank-capture`, computed styles; the
capture PNGs are the pixel ground truth wherever computed styles ride remote
classes).

## Homepage https://www.tbank.ru/

```
pageH 9221 · 47 images · 11 lazy · all complete after warm-up scroll
hero background chain (ancestor climb from h1): rgb(255, 255, 255)   ← single-tone white
h1: 44px / 700 / rgba(0,0,0,0.8)
«Стать клиентом» header CTA: NOT PRESENT on retail homepage (business-page element)
application-flow links on the page:
  /business/account/ «Открыть счет» · /cards/debit-cards/tinkoff-black/#form «Оформить карту»
  /cards/credit-cards/tinkoff-platinum/#form · /mobile-operator/#form · /savings/deposit/#form
cookie banner: none surfaced (selector sweep [class*=cookie]/[class*=consent] empty)
```

## Form page /cards/debit-cards/tinkoff-black/#form

```
pageH 6991 · form: top≈1880 H≈844 (anchor + scrollIntoView; zero field interaction)
section/card background chain: rgb(255,255,255) on rgb(255,255,255)   ← white-on-white
h2 «Оформите Black за минуту» / «Всё о карте Black» / «Может быть полезно»: 44px / 700 / rgba(0,0,0,0.8)
submit «Продолжить»: h56 × w127 · fill rgb(255,221,45) · ink rgb(51,51,51) · r12 · 13px/400
  ↑ 56px = the kit's hero button tier — retail form submits hero-class (button-tier record data point)
inputs fio/phone_mobile/email: bare h24, transparent, borderless — chrome on remote
  wrapper classes (NOT probed further; visual truth = bank-form-section PNG)
first form button = 24×24 transparent icon control (stepper/back class), not the submit
```

## Cross-vertical deltas vs the business round (same day)

| Fact | business (tbank.ru/business) | bank (tbank.ru retail) |
|---|---|---|
| hero backdrop | beige #F1EEE8 | white |
| h1/h2 | 44/700 rgba(0,0,0,0.8) | 44/700 rgba(0,0,0,0.8) — same |
| form submit | «Открыть счет» yellow r12 | «Продолжить» yellow r12 h56 |
| cookie banner | bottom-right 212×126 | none surfaced |
