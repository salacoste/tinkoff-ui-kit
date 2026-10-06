import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Avatar, RangeSlider, Switch, Textarea } from 'pillkit-react';

// Raw: valueFormatter is a function prop — set via the JS property.
const slider = document.querySelector('#slider')!;
(slider as any).min = 0;
(slider as any).max = 100;
(slider as any).value = 40;
(slider as any).valueFormatter = (v: number) => `${v} %`;

// Raw: checked rides the strict §4 property channel (the attribute is not read).
(document.querySelector('#switch') as any).checked = true;

createRoot(document.getElementById('root')!).render(
  createElement(
    'div',
    null,
    createElement(RangeSlider, {
      label: 'Доля портфеля',
      min: 0,
      max: 100,
      value: 72,
      valueFormatter: (v: number) => `${v} %`,
    }),
    createElement(Switch, { label: 'Автопродажа', defaultChecked: true }),
    createElement(Avatar, { name: 'Ли Вонг' }),
    createElement(Textarea, { label: 'Заметка (React)', placeholder: 'Добавьте заметку' }),
    createElement(Button, { variant: 'positive' }, 'Купить (React)'),
    createElement(Button, { variant: 'negative' }, 'Продать (React)'),
  ),
);
