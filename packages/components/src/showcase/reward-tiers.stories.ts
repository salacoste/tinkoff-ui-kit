import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/button.js';
import { showToast } from '../toast/show.js';

/**
 * The referral reward tiers + share/copy-link widget (spec 24.11, pattern
 * wave 24b): gap-7's mgm page — «Приводите друзей» tiered reward tiles
 * (image-verified: «За N друзей» + a sum) and the share-link widget (a
 * readonly pill with the link + a copy icon-button + a row of round
 * share buttons). QR-share already rides the kit (tk-qr-block); LINK
 * copying did not — this story assembles it.
 *
 * THE COPY CONTRACT: the copy press is a REAL navigator.clipboard write
 * (demo — nothing leaves the page); a missing clipboard API degrades to
 * a fallback toast, never a throw. The link rides the field as its VALUE
 * (screen-reader-readable); the icon is decorative — the accessible name
 * lives on the very button pressed.
 *
 * WHY NATIVE CONTROLS IN CONSUMER CLOTHES (the pulse-feed «Нравится»
 * precedent): the copy button and the round share buttons are ICON-ONLY
 * controls — their accessible name needs aria-label ON the element the
 * reader activates, and tk-button's shadow button does not carry the
 * host attribute over; tk-input's readonly exists only THROUGH disabled
 * (grayed paint + aria-disabled — the wrong register for a copy field).
 * The atomic icon-only VARIANT and the readonly prop are Epic 25 notes;
 * the story pins the recipe, not the atoms.
 *
 * DATA (the PD gate): the sums, the referral link and the share targets
 * are FICTIONAL. Story-canvas styling consumes var(--tk-*) tokens only
 * (FR-1).
 */

type RewardTiersArgs = Record<string, never>;

const NBSP = '\u00A0';

/** The demo referral link — fictional host, fictional code. */
const DEMO_LINK = 'https://demo.example/pillkit-ref-DEMO42';

/** The copy press — a real clipboard write with a graceful fallback. */
const copyLink = async (): Promise<void> => {
  try {
    if (!navigator.clipboard) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(DEMO_LINK);
    showToast({ message: 'Ссылка скопирована' });
  } catch {
    showToast({ message: 'Не удалось скопировать — буфер недоступен' });
  }
};

const canvasStyles = html`
  <style>
    .rw-canvas {
      min-height: 100vh;
      box-sizing: border-box;
      padding: var(--tk-space-32) var(--tk-space-24) var(--tk-space-64);
      background: var(--tk-color-surface-base);
      font-family: var(--tk-font-body);
      color: var(--tk-color-text-primary);
    }
    .rw-note {
      margin: 0 0 var(--tk-space-24);
      max-width: var(--tk-space-container);
      font-size: var(--tk-text-body-s-size);
      line-height: var(--tk-text-body-s-leading);
      color: var(--tk-color-text-secondary);
    }
    .rw-layout {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-24);
    }
    .rw-title {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-3-size);
      font-weight: var(--tk-text-heading-3-weight);
      line-height: var(--tk-text-heading-3-leading);
    }
    .rw-sub {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    /* THE TIER TILES (the stat-tiles 24.4 mold): bordered tiles, label +
       sum in the heading register; NO dark tile here (this page's tiles
       are all light-bordered). */
    .rw-tiers {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--tk-space-16);
    }
    .rw-tier {
      display: flex;
      flex-direction: column;
      gap: var(--tk-space-8);
      margin: 0;
      padding: var(--tk-space-24) var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-lg);
    }
    .rw-tier__label {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-secondary);
    }
    .rw-tier__sum {
      margin: 0;
      font-family: var(--tk-font-heading);
      font-size: var(--tk-text-heading-4-size);
      font-weight: var(--tk-text-heading-4-weight);
      line-height: var(--tk-text-heading-4-leading);
    }
    /* THE COPY-LINE: a readonly field + the copy icon-button — one row. */
    .rw-copy {
      display: flex;
      gap: var(--tk-space-8);
    }
    .rw-field {
      flex: 1;
      min-width: 0;
      box-sizing: border-box;
      height: 48px;
      padding: 0 var(--tk-space-16);
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-md);
      background: var(--tk-color-surface-muted);
      font-family: var(--tk-font-body);
      font-size: var(--tk-text-body-m-size);
      line-height: var(--tk-text-body-m-leading);
      color: var(--tk-color-text-primary);
    }
    .rw-field:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    .rw-copy__btn {
      flex: none;
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--tk-radius-md);
      /* The kit's primary pairing (theme-invariant): yellow fill, ink
         text — the copy affordance reads as the page's primary action. */
      background: var(--tk-color-yellow-100);
      color: var(--tk-color-text-on-primary);
      cursor: pointer;
    }
    .rw-copy__btn:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    /* THE SHARE ROW: round icon buttons — consumer CSS; the atomic
       icon-only VARIANT is an Epic 25 note. */
    .rw-share {
      display: flex;
      gap: var(--tk-space-12);
    }
    .rw-share__btn {
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--tk-color-border-default);
      border-radius: var(--tk-radius-full);
      background: transparent;
      color: var(--tk-color-text-secondary);
      cursor: pointer;
    }
    .rw-share__btn:hover {
      color: var(--tk-color-text-primary);
      border-color: var(--tk-color-border-strong);
    }
    .rw-share__btn:focus-visible {
      outline: 2px solid var(--tk-color-border-strong);
      outline-offset: 2px;
    }
    .rw-lead {
      margin: 0;
      font-size: var(--tk-text-body-m-size);
      font-weight: 700;
      line-height: var(--tk-text-body-m-leading);
    }
  </style>
`;

/** The copy icon — decorative; the button's aria-label names the action. */
const COPY_ICON = html`
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.5"></rect>
    <path d="M13 4H5a2 2 0 0 0-2 2v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
  </svg>
`;

/** Neutral share stubs — geometric marks, currentColor (no brand art). */
const SHARE_STUBS = [
  html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"></circle>
    <path d="M6 12l4-6 4 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
  </svg>`,
  html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" stroke-width="1.5"></rect>
    <path d="M7 13V7l6 6V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`,
  html`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
  </svg>`,
];

const meta: Meta<RewardTiersArgs> = {
  title: 'Invest/Reward tiers',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<RewardTiersArgs>;

export const ReferralPage: Story = {
  name: 'Приводите друзей',
  render: () => html`
    ${canvasStyles}
    <main class="rw-canvas">
      <p class="rw-note">
        Реферальные тиры + copy-link (спека 24.11): бордер-тайлы «За N
        друзей» с суммой в heading-регистре (молд stat-tiles 24.4, без
        тёмного тайла) и виджет шаринга — readonly-поле с демо-ссылкой +
        кнопка-копирование + ряд круглых share-кнопок. КОНТРАКТ КОПИРОВАНИЯ:
        нажатие — реальная запись в navigator.clipboard (демо, ничего не
        уходит со страницы), при недоступном буфере — фолбэк-тост; ссылка
        живёт в поле как value (читается скринридером), иконка
        декоративна, доступное имя — на самой кнопке. ПОЧЕМУ НАТИВНЫЕ
        КОНТРОЛЫ (прецедент «Нравится» 24.8): копия и шэры —
        иконочные-без-текста контролы, aria-label нужен на элементе
        активации, а теневая кнопка кита атрибут хоста не переносит;
        readonly в tk-input есть только через disabled (серая краска +
        aria-disabled — неверный регистр). Атомный icon-only VARIANT и
        readonly-проп — заметки Epic 25. Клавиатура: Tab — CTA, поле,
        копия, шэры; результат копирования объявляет тост. Обе темы — без
        правок состава. Суммы, ссылка и цели шаринга вымышленные.
      </p>
      <div class="rw-layout">
        <h1 class="rw-title">Приводите друзей (демо)</h1>
        <p class="rw-sub">
          Вымышленная программа: за каждого друга, открывшего демо-счёт, —
          демо-бонус. Тиры ниже — иллюстрация жанра, не оффер.
        </p>
        <div class="rw-tiers">
          <div class="rw-tier">
            <p class="rw-tier__label">За 1 друга</p>
            <p class="rw-tier__sum">+50${NBSP}₽</p>
          </div>
          <div class="rw-tier">
            <p class="rw-tier__label">За 5 друзей</p>
            <p class="rw-tier__sum">+150${NBSP}₽</p>
          </div>
          <div class="rw-tier">
            <p class="rw-tier__label">За 15 друзей</p>
            <p class="rw-tier__sum">+750${NBSP}₽</p>
          </div>
          <div class="rw-tier">
            <p class="rw-tier__label">За 30 друзей</p>
            <p class="rw-tier__sum">+1${NBSP}500${NBSP}₽</p>
          </div>
        </div>
        <tk-button
          variant="primary"
          size="card"
          @click=${() => showToast({ message: 'Приглашение — демо-действие без эффекта' })}
          >Пригласить друга</tk-button
        >
        <p class="rw-lead">Ваша демо-ссылка</p>
        <div class="rw-copy">
          <input class="rw-field" type="text" readonly .value=${DEMO_LINK} aria-label="Демо-ссылка для приглашения" />
          <button type="button" class="rw-copy__btn" aria-label="Скопировать демо-ссылку" @click=${copyLink}>
            ${COPY_ICON}
          </button>
        </div>
        <div class="rw-share">
          ${SHARE_STUBS.map(
            (icon, index) => html`
              <button
                type="button"
                class="rw-share__btn"
                aria-label=${`Поделиться в демо-канале ${index + 1}`}
                @click=${() => showToast({ message: 'Шэр — демо-действие без эффекта' })}
              >
                ${icon}
              </button>
            `,
          )}
        </div>
      </div>
    </main>
  `,
};
