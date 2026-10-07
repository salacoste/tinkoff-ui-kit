/**
 * Landing entry — bank-family tokens (+ bundled Daytona faces, same import
 * set as the showcase entries) + full component registration.
 *
 * Plain ESM only (no TypeScript-only syntax): the lint hook parses website
 * sources with the base parser and the root typecheck does not include them.
 * Component modules come prebuilt from the workspace packages.
 */
import 'pillkit-tokens/tokens.css';
import 'pillkit-tokens/daytona.css';
import 'pillkit-components';
import './styles/site.css';

/**
 * Landing wiring (shared by index.html and ru/index.html). Only the data
 * plain attributes cannot carry live here: the item arrays for tk-tabs /
 * tk-breadcrumb, tk-chart points, the range-slider formatter and the toast
 * triggers. Same mold as the showcase entries — ids are identical on the EN
 * and RU pages, copy rides the lang attribute / data attributes.
 */
const byId = (id) => document.getElementById(id);

const RU = document.documentElement.lang === 'ru';

/* --- tk-tabs: the navigation demo --- */

const navTabs = byId('landing-nav-tabs');
if (navTabs) {
  navTabs.tabs = RU
    ? [
        { value: 'day', label: 'День' },
        { value: 'week', label: 'Неделя' },
        { value: 'month', label: 'Месяц' },
      ]
    : [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ];
  navTabs.defaultValue = 'day';
}

/* --- tk-breadcrumb: the trail demo --- */

const crumbs = byId('landing-breadcrumb');
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

/* --- tk-range-slider: formatter feeds the readout and aria-valuetext --- */

const slider = byId('landing-slider');
if (slider) {
  slider.valueFormatter = (value) => `${value.toLocaleString(RU ? 'ru-RU' : 'en-US')} ₽`;
}

/* --- tk-chart: the growth demo (fictional series) --- */

const chart = byId('landing-chart');
if (chart) {
  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  chart.points = [101.2, 102.1, 101.8, 103.4, 104.0, 103.6, 105.2].map((value, i) => ({
    value,
    label: hours[i % hours.length],
  }));
}

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
