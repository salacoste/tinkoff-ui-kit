import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { showToast } from 'pillkit-components';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Carousel, Spinner, Toast } from 'pillkit-react';

// --- raw toast triggers (the imperative helper, CONVENTIONS §9) ---
document.querySelector('#toast-auto')!.addEventListener('click', () => {
  const handle = showToast({ message: 'Портфель обновлён', duration: 600 });
  window.__toastHandle = handle;
});
document.querySelector('#toast-sticky')!.addEventListener('click', () => {
  showToast({ message: 'Липкое уведомление — Esc закроет', duration: 0 });
});

// --- raw carousel readout: the page-change subscription (spec 27.4) ---
const car1 = document.querySelector('#car1')!;
car1.addEventListener('page-change', (event) => {
  const detail = (event as CustomEvent<{ page: number }>).detail;
  document.querySelector('#car-readout')!.textContent = `page-change → { page: ${detail.page} }`;
});

// --- react wrappers: unwrapped event payloads land in the props ---
createRoot(document.getElementById('root')!).render(
  createElement(
    'div',
    null,
    createElement('h3', null, 'Spinner (React)'),
    createElement(Spinner, { label: 'Загрузка (React)' }),
    createElement('h3', null, 'Carousel (React) — onPageChange'),
    createElement(
      Carousel,
      {
        label: 'Рейл React',
        onPageChange: (payload: unknown) => {
          (window as any).__reactPage = {
            raw: payload,
            isEvent: payload instanceof CustomEvent,
            page: (payload as { page: number })?.page,
          };
        },
      },
      ...[1, 2, 3, 4, 5, 6].map((n) =>
        createElement('div', { className: 'car-card', key: n }, String(n)),
      ),
    ),
    createElement('h3', null, 'Toast (React) — onHide, duration 600'),
    createElement(
      Toast,
      {
        duration: 600,
        onHide: (payload: unknown) => {
          (window as any).__reactHide = {
            raw: payload,
            isEvent: payload instanceof CustomEvent,
            reason: (payload as { reason: string })?.reason,
          };
        },
      },
      'Заявка исполнена (React)',
    ),
    createElement('h3', null, 'Button (React) — sanity'),
    createElement(Button, { variant: 'primary' }, 'Готово'),
  ),
);
