import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PriceProvider } from './context/PriceContext';
import { PlayerProvider } from './context/PlayerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlayerProvider>
      <PriceProvider>
        <App />
      </PriceProvider>
    </PlayerProvider>
  </React.StrictMode>,
);
