# Impeccable kit-wide deep pass (Story 8.4, 2026-09-25)

**Standard (SM-1/FR-9, тот же что 5.6 — `../fidelity-verification/impeccable-run.md`):**
headless design detector по ВСЕМ исходникам кита с нулём блокеров; CI-контракт
`impeccable detect` — exit 0/1/2. Прогон 8.4 — на aa9780f (полное дерево:
v1 19 + v2 9 компонентов + 3 композиции + доки v1/v2).

## The run

- Engine: `.claude/skills/impeccable/scripts/impeccable` (тот же движок, что
  PostToolUse/Stop-хуки; глубокий проход Stop-хука шёл по каждому UI-редакту
  всех v2-историй).
- Scope: `packages/tokens/src packages/components/src packages/react/src
  packages/docs/src packages/docs/.storybook` — **207 файлов**
  (`*.ts *.tsx *.css *.js *.mjs *.html`), строго шире CI diff-base-скана.

```sh
find packages/tokens/src packages/components/src packages/react/src \
      packages/docs/src packages/docs/.storybook -type f \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.js' \
         -o -name '*.mjs' -o -name '*.html' \) | sort \
  | xargs .claude/skills/impeccable/scripts/impeccable detect
```

- **Result: exit 0, zero findings, zero warnings** (пустой вывод; 2026-09-25,
  дерево 8.4-prep: 27 компонентов, 27 врапперов, 3 композиции, доки v2).

## Can-fail self-check (перепроверен этой историей)

| Probe | Input | Result |
|---|---|---|
| Violation injection | temp CSS `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | **exit 2**, blocker назван (bounce-easing) |
| (v1 control) | temp CSS `color: #333` | exit 0 (5.6-запись) |

## The ONE sanctioned ignore — не изменился

`.impeccable/config.json` → `detector.ignoreValues`: bounce-easing /
`cubic-bezier(0.35, 1.3, 0.25, 1)` (value-scoped; expressive-entrance кривая
референса, DESIGN.md motion). `ignoreRules: []`, `ignoreFiles: []` — других
игноров нет. Статус ратификации: мейнтейнер ратифицировал 2026-09-23
(RELEASE.md §0 преамбулa) — в очереди больше не числится.

## Собственный глубокий проход 8.4 (классы проверок сверх детектора)

| Класс | Метод | Результат |
|---|---|---|
| TODO/FIXME/HACK/XXX в shipped-источниках и тестах | grep по всем пакетам + tests/ | **0 хитов** |
| console/debugger-остатки | grep по 5 корням источников | 3 хита `console.log` — все `console.log(event.detail.value)` в docs-сториях v2 (шаблон обработчика события в демо, v1-паттерн; не отладка); 15 рантайм-`console.warn` вне счёта осознанно — это штатный error-канал кита, не отладка — НЕ блокер |
| Мёртвый код / файлы-сироты | каждый non-test/non-story .ts в components/src проверен на ссылки | 0 сирот |
| Закомментированный код | паттерн `^\s*//\s*(const\|let\|import\|if\|for\|return)` | 0 реальных (хиты — проза-комментарии) |
| Протухшие prose-числа (урок 5.6 «radius-xxl 32») | grep «xxl…32», radius-копирайт store-badges (16→24 truing), pagination bar (52→44), qr note | все заголовки css.ts соответствуют trued-значениям; 0 протухших |
| Валидность путей доказательств | все `.playwright-cli/(verify\|captures-v2)/…` указатели в исходниках → fs-проверка | все существуют (4 ложных хита — пунктуация/brace-нотация `{,-detail}`) |
| Согласованность jsdoc-заголовков css.ts | конвенция «tokens only (FR-1)… zero theme branches (AD-3)» по 27 листам | 27/27 (два «пропуска» — регистр буквы Z, ложные) |

**Вердикт impeccable-прохода 8.4: ноль блокеров, исправлений не потребовалось.**
(Аудит был готов падать: механика каждого класса воспроизводима командами
выше; детектор доказуемо испускает блокеры — проба injection.)
