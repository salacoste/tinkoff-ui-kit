import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'pillkit-react';

createRoot(document.getElementById('root')!).render(
  createElement(Button, { variant: 'secondary' }, 'Через React-обёртку'),
);
