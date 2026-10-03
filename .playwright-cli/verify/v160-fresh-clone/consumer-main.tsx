import React from 'react';
import { createRoot } from 'react-dom/client';
import 'pillkit-tokens/tokens.css';
import 'pillkit-components';
import './styles.css';
import { InstrumentHero, PromoCard } from 'pillkit-react';

function App() {
  return (
    <>
      <div className="row" id="react-heroes">
        <InstrumentHero
          name="Т-Технологии"
          ticker="TCTL"
          tone="light"
          metricLabel="Изменение за день"
        >
          <span slot="metric">-0,82%</span>
          <button slot="action" aria-label="Добавить в портфель" id="react-hero-star">
            ★
          </button>
        </InstrumentHero>
        <InstrumentHero name="Тинькофф iMOEX" ticker="TMON" tone="dark" />
      </div>
      <div className="row" id="react-tickets">
        <PromoCard variant="ticket" label="Продать по цене">
          <b slot="value">23 035,00 ₽</b>
          <tk-button class="ticket-cta" slot="actions" variant="primary">
            Продать
          </tk-button>
        </PromoCard>
      </div>
    </>
  );
}

createRoot(document.getElementById('react-root')!).render(<App />);
