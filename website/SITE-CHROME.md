# Site chrome contract — canonical markup for every page

Single source for the shared header/footer ALL website pages carry verbatim
(EN pages use the EN block, RU pages the RU block). dev-landing authors the
matching CSS in `src/styles/site.css`; showcase pages only LINK it and may add
page-scoped `<style>` blocks of their own. Do not rename these classes.

URL map (root-absolute, base `/tinkoff-ui-kit/` is baked at build time):

| Target | URL |
|---|---|
| Landing EN | `/tinkoff-ui-kit/` |
| Landing RU | `/tinkoff-ui-kit/ru/` |
| Bank showcase | `/tinkoff-ui-kit/bank.html` (RU: `/tinkoff-ui-kit/ru/bank.html`) |
| Invest showcase | `/tinkoff-ui-kit/invest.html` (RU: `/tinkoff-ui-kit/ru/invest.html`) |
| Admin showcase | `/tinkoff-ui-kit/admin.html` (RU: `/tinkoff-ui-kit/ru/admin.html`) |
| T-Journal showcase | `/tinkoff-ui-kit/tj.html` (RU: `/tinkoff-ui-kit/ru/tj.html`) |
| Storybook docs | `/tinkoff-ui-kit/storybook/` |
| Repository | `https://github.com/salacoste/tinkoff-ui-kit` |

The active page's nav link gets `aria-current="page"`.

## Header + footer — EN pages

```html
<header class="site-header">
  <div class="site-container site-header__row">
    <a class="site-logo" href="/tinkoff-ui-kit/">pillkit</a>
    <nav class="site-nav" aria-label="Primary">
      <a href="/tinkoff-ui-kit/bank.html">Bank</a>
      <a href="/tinkoff-ui-kit/invest.html">Invest</a>
      <a href="/tinkoff-ui-kit/admin.html">Admin</a>
      <a href="/tinkoff-ui-kit/tj.html">T-Journal</a>
      <a href="/tinkoff-ui-kit/storybook/">Docs</a>
    </nav>
    <div class="site-header__actions">
      <button class="site-theme-toggle" type="button" aria-label="Toggle dark theme"
        onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? '' : 'dark'">◐</button>
      <a class="site-gh" href="https://github.com/salacoste/tinkoff-ui-kit">GitHub</a>
      <a class="site-lang" href="/tinkoff-ui-kit/ru/" lang="ru" hreflang="ru">Русская версия</a>
    </div>
  </div>
</header>
```

```html
<footer class="site-footer">
  <div class="site-container">
    <p class="site-footer__disclaimer">pillkit is an unofficial, independent study
    project recreating a banking-grade design language for educational purposes. It is
    not affiliated with, endorsed by, or connected to T-Bank / TCS Holding; no T-Bank
    trademarks are used in the published output.</p>
    <p class="site-footer__meta">Code &amp; docs — MIT (fonts separately licensed) ·
    <a href="https://github.com/salacoste/tinkoff-ui-kit">GitHub</a> ·
    <a href="/tinkoff-ui-kit/storybook/">Storybook docs</a> ·
    <a href="https://github.com/salacoste/tinkoff-ui-kit/releases">Releases</a></p>
  </div>
</footer>
```

## Header + footer — RU pages

```html
<header class="site-header">
  <div class="site-container site-header__row">
    <a class="site-logo" href="/tinkoff-ui-kit/ru/">pillkit</a>
    <nav class="site-nav" aria-label="Основная навигация">
      <a href="/tinkoff-ui-kit/ru/bank.html">Банк</a>
      <a href="/tinkoff-ui-kit/ru/invest.html">Инвестиции</a>
      <a href="/tinkoff-ui-kit/ru/admin.html">Админ</a>
      <a href="/tinkoff-ui-kit/ru/tj.html">ТЖ</a>
      <a href="/tinkoff-ui-kit/storybook/">Документация</a>
    </nav>
    <div class="site-header__actions">
      <button class="site-theme-toggle" type="button" aria-label="Переключить тёмную тему"
        onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? '' : 'dark'">◐</button>
      <a class="site-gh" href="https://github.com/salacoste/tinkoff-ui-kit">GitHub</a>
      <a class="site-lang" href="/tinkoff-ui-kit/" lang="en" hreflang="en">English version</a>
    </div>
  </div>
</header>
```

```html
<footer class="site-footer">
  <div class="site-container">
    <p class="site-footer__disclaimer">Неофициальный учебный проект. pillkit (tinkoff-ui-kit) —
    независимое воссоздание дизайн-языка Тинькофф (Т-Банка) исключительно в учебных целях.
    Проект не аффилирован с Т-Банком / ТКС Холдинг, не одобрен ими и никак с ними не связан;
    товарные знаки Т-Банка в публикуемом результате не используются.</p>
    <p class="site-footer__meta">Код и документация — MIT (шрифты лицензируются отдельно) ·
    <a href="https://github.com/salacoste/tinkoff-ui-kit">GitHub</a> ·
    <a href="/tinkoff-ui-kit/storybook/">Storybook-документация</a> ·
    <a href="https://github.com/salacoste/tinkoff-ui-kit/releases">Релизы</a></p>
  </div>
</footer>
```

## Shared CSS class contract (authored in `src/styles/site.css` by dev-landing)

- `.site-container` — page-width wrapper (max-width + gutters)
- `.site-header`, `.site-header__row`, `.site-logo`, `.site-nav`, `.site-header__actions`,
  `.site-theme-toggle`, `.site-gh`, `.site-lang`
- `.site-footer`, `.site-footer__disclaimer`, `.site-footer__meta`
- `.section`, `.section__title`, `.section__lead` — content sections
- `.demo-grid`, `.demo-card`, `.demo-card__title`, `.demo-card__hint` — component demo frames
- `.code-details > summary/pre/code` — collapsible code snippets
- `.site-theme-toggle` flips `data-theme` on `<html>`: kit tokens + site chrome re-theme together
- T-Journal demo sections additionally carry their own `data-tj-theme` toggle (tj tokens are a
  separate namespace) — page-scoped, styled by the page's own `<style>` block
