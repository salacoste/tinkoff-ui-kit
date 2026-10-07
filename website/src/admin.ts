/**
 * Admin/console showcase entry — bank tokens (+ bundled Daytona faces) + components.
 * Plain ESM only; see main.ts for the parser note.
 */
import 'pillkit-tokens/tokens.css';
import 'pillkit-tokens/daytona.css';
import 'pillkit-components';
import './styles/site.css';

/**
 * Admin/console showcase wiring (shared by admin.html and ru/admin.html).
 *
 * Console grammar demo: the data-driven props plain attributes cannot carry
 * (tk-tabs item arrays with badge counts, tk-data-table columns/rows,
 * tk-breadcrumb items), the modal open channel and toast triggers. Copy
 * lives in the markup: bilingual copy rides the lang attribute, per-trigger
 * copy rides data attributes. Ids are identical on the EN and RU pages.
 */

const byId = (id) => document.getElementById(id);

const RU = document.documentElement.lang === 'ru';

/* --- tk-tabs: console chrome with badge counts --- */

const consoleTabs = byId('admin-tabs-console');
if (consoleTabs) {
  consoleTabs.tabs = RU
    ? [
        { value: 'queue', label: 'Очередь', badge: 48 },
        { value: 'sign', label: 'На подпись', badge: 5 },
        { value: 'archive', label: 'Архив' },
      ]
    : [
        { value: 'queue', label: 'Queue', badge: 48 },
        { value: 'sign', label: 'Awaiting sign', badge: 5 },
        { value: 'archive', label: 'Archive' },
      ];
  consoleTabs.defaultValue = 'queue';
}

/* --- tk-breadcrumb: back-office trail --- */

const crumbs = byId('admin-breadcrumb');
if (crumbs) {
  crumbs.items = RU
    ? [
        { label: 'Консоль', href: '/tinkoff-ui-kit/ru/admin.html' },
        { label: 'Платежи' },
        { label: 'Реестр 6 октября' },
      ]
    : [
        { label: 'Console', href: '/tinkoff-ui-kit/admin.html' },
        { label: 'Payments' },
        { label: 'October 6 registry' },
      ];
}

/* --- tk-data-table: payments queue (fictional counterparties) --- */

const queueTable = byId('admin-table-queue');
if (queueTable) {
  queueTable.caption = RU ? 'Очередь платежей — реестр 6 октября' : 'Payment queue — October 6 registry';
  queueTable.columns = [
    { key: 'doc', header: RU ? 'Документ' : 'Document', width: '1.4fr' },
    { key: 'party', header: RU ? 'Контрагент' : 'Counterparty', width: '1.2fr' },
    { key: 'amount', header: RU ? 'Сумма' : 'Amount', align: 'end' },
    { key: 'status', header: RU ? 'Статус' : 'Status', align: 'end' },
  ];
  queueTable.rows = RU
    ? [
        {
          doc: { primary: 'Платёжное поручение 8-4471', secondary: '6 окт · 10:12' },
          party: { primary: 'ООО «Тюльпан»', secondary: 'TLP', logo: 'letter' },
          amount: { primary: '12 400 ₽' },
          status: { primary: 'На подписи' },
        },
        {
          doc: { primary: 'Платёжное поручение 8-4470', secondary: '6 окт · 09:58' },
          party: { primary: 'ООО «Роза»', secondary: 'RSE', logo: 'letter' },
          amount: { primary: '96 000 ₽' },
          status: { primary: 'На подписи' },
        },
        {
          doc: { primary: 'Возврат по билету 44-17', secondary: '5 окт · 17:31' },
          party: { primary: 'ОАО «Рельстранс»', secondary: 'RLT', logo: 'letter' },
          amount: { primary: '−18 900 ₽', delta: 'negative' },
          status: { primary: 'Исполнен' },
        },
        {
          doc: { primary: 'Входящий платёж INV-2209', secondary: '5 окт · 14:02' },
          party: { primary: 'ИП Стрельцов', secondary: 'STR', logo: 'letter' },
          amount: { primary: '+4 300 ₽', delta: 'positive' },
          status: { primary: 'Исполнен' },
        },
      ]
    : [
        {
          doc: { primary: 'Payment order 8-4471', secondary: 'Oct 6 · 10:12' },
          party: { primary: 'Tulip LLC', secondary: 'TLP', logo: 'letter' },
          amount: { primary: '12 400 ₽' },
          status: { primary: 'Awaiting signature' },
        },
        {
          doc: { primary: 'Payment order 8-4470', secondary: 'Oct 6 · 09:58' },
          party: { primary: 'Rose LLC', secondary: 'RSE', logo: 'letter' },
          amount: { primary: '96 000 ₽' },
          status: { primary: 'Awaiting signature' },
        },
        {
          doc: { primary: 'Ticket refund 44-17', secondary: 'Oct 5 · 17:31' },
          party: { primary: 'Railtrans OJSC', secondary: 'RLT', logo: 'letter' },
          amount: { primary: '−18 900 ₽', delta: 'negative' },
          status: { primary: 'Executed' },
        },
        {
          doc: { primary: 'Incoming payment INV-2209', secondary: 'Oct 5 · 14:02' },
          party: { primary: 'Streltsov Sole Prop.', secondary: 'STR', logo: 'letter' },
          amount: { primary: '+4 300 ₽', delta: 'positive' },
          status: { primary: 'Executed' },
        },
      ];
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
