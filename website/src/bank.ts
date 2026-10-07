/**
 * Bank showcase entry — bank tokens (+ bundled Daytona faces) + components.
 * Plain ESM only; see main.ts for the parser note.
 */
import 'pillkit-tokens/tokens.css';
import 'pillkit-tokens/daytona.css';
import 'pillkit-components';
import './styles/site.css';

/**
 * Bank showcase wiring (shared by bank.html and ru/bank.html).
 *
 * Only the data-driven props plain attributes cannot carry live here:
 * the item arrays for tk-tabs / tk-data-table / tk-breadcrumb, the modal
 * open channel, toast triggers and the range-slider formatter. Copy lives
 * in the markup: bilingual copy rides the lang attribute, per-trigger copy
 * rides data attributes. Ids are identical on the EN and RU pages.
 */

const byId = (id) => document.getElementById(id);

const RU = document.documentElement.lang === 'ru';

/* Fictional demo amounts, grouped by locale with a rouble suffix. */
const formatAmount = (value) => `${value.toLocaleString(RU ? 'ru-RU' : 'en-US')} ₽`;

/* --- tk-tabs: the product switcher (accounts demo) --- */

const cardsTabs = byId('bank-tabs-cards');
if (cardsTabs) {
  cardsTabs.tabs = RU
    ? [
        { value: 'debit', label: 'Дебетовая' },
        { value: 'credit', label: 'Кредитная' },
        { value: 'deposit', label: 'Вклад' },
      ]
    : [
        { value: 'debit', label: 'Debit' },
        { value: 'credit', label: 'Credit' },
        { value: 'deposit', label: 'Deposit' },
      ];
  cardsTabs.defaultValue = 'debit';
}

/* --- tk-breadcrumb: dashboard trail --- */

const crumbs = byId('bank-breadcrumb');
if (crumbs) {
  crumbs.items = RU
    ? [
        { label: 'Главная', href: '/tinkoff-ui-kit/ru/' },
        { label: 'Платежи' },
        { label: 'История операций' },
      ]
    : [
        { label: 'Home', href: '/tinkoff-ui-kit/' },
        { label: 'Payments' },
        { label: 'Operation history' },
      ];
}

/* --- tk-data-table: recent operations (fictional counterparties) --- */

const opsTable = byId('bank-table-ops');
if (opsTable) {
  opsTable.caption = RU ? 'Последние операции' : 'Recent operations';
  opsTable.columns = [
    { key: 'payee', header: RU ? 'Получатель' : 'Payee', width: '1.6fr' },
    { key: 'when', header: RU ? 'Когда' : 'When', width: '120px' },
    { key: 'amount', header: RU ? 'Сумма' : 'Amount', align: 'end' },
  ];
  opsTable.rows = RU
    ? [
        {
          payee: { primary: 'Городские сети', secondary: 'Коммунальные платежи · автосписание' },
          when: { primary: '4 окт', secondary: '12:40' },
          amount: { primary: '−2 400 ₽', delta: 'negative' },
        },
        {
          payee: { primary: 'Анна Королёва', secondary: 'Перевод по номеру телефона' },
          when: { primary: '3 окт', secondary: '18:05' },
          amount: { primary: '−5 600 ₽', delta: 'negative' },
        },
        {
          payee: { primary: 'ООО «Меридиан»', secondary: 'Зарплата' },
          when: { primary: '1 окт', secondary: '09:00' },
          amount: { primary: '+84 000 ₽', delta: 'positive' },
        },
        {
          payee: { primary: 'Кэшбэк за сентябрь', secondary: 'Начисление по категориям' },
          when: { primary: '1 окт', secondary: '06:12' },
          amount: { primary: '+312 ₽', delta: 'positive' },
        },
      ]
    : [
        {
          payee: { primary: 'City Power & Water', secondary: 'Utilities · auto-pay' },
          when: { primary: 'Oct 4', secondary: '12:40' },
          amount: { primary: '−2 400 ₽', delta: 'negative' },
        },
        {
          payee: { primary: 'Anna Koroleva', secondary: 'Transfer by phone number' },
          when: { primary: 'Oct 3', secondary: '18:05' },
          amount: { primary: '−5 600 ₽', delta: 'negative' },
        },
        {
          payee: { primary: 'Meridian Labs LLC', secondary: 'Salary' },
          when: { primary: 'Oct 1', secondary: '09:00' },
          amount: { primary: '+84 000 ₽', delta: 'positive' },
        },
        {
          payee: { primary: 'September cashback', secondary: 'Category round-up credit' },
          when: { primary: 'Oct 1', secondary: '06:12' },
          amount: { primary: '+312 ₽', delta: 'positive' },
        },
      ];
}

/* --- tk-range-slider: spending-limit calculator --- */

const limitSlider = byId('bank-slider-limit');
const limitReadout = byId('bank-slider-readout');
if (limitSlider) {
  limitSlider.valueFormatter = formatAmount;
  limitSlider.addEventListener('value-change', (event) => {
    if (limitReadout) limitReadout.textContent = formatAmount(event.detail.value);
  });
}

/* --- tk-modal: open channel via data-modal-open / data-modal-close --- */

document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const modal = byId(trigger.getAttribute('data-modal-open'));
    if (modal) modal.open = true;
  });
});

document.querySelectorAll('[data-modal-close]').forEach((control) => {
  control.addEventListener('click', () => {
    const modal = control.closest('tk-modal');
    if (modal) modal.open = false;
  });
});

/* --- tk-toast: trigger helper (mirrors the kit's showToast pattern) --- */

const showToast = (options) => {
  const toast = document.createElement('tk-toast');
  if (options.variant) toast.setAttribute('variant', options.variant);
  toast.setAttribute('duration', String(options.duration));
  toast.append(options.message);
  if (options.actionLabel) {
    const action = document.createElement('button');
    action.type = 'button';
    action.textContent = options.actionLabel;
    action.setAttribute('slot', 'action');
    toast.append(action);
  }
  document.body.appendChild(toast);
  return { dismiss: () => toast.dismiss() };
};

document.querySelectorAll('[data-toast]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    showToast({
      message: trigger.getAttribute('data-toast'),
      variant: trigger.getAttribute('data-toast-variant') || undefined,
      duration: Number(trigger.getAttribute('data-toast-duration') || '5000'),
      actionLabel: trigger.getAttribute('data-toast-action') || undefined,
    });
  });
});
