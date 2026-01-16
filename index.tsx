import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { worker } from './mocks/browser';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Inicia o service worker e então renderiza a aplicação
worker.start({
  onUnhandledRequest: 'bypass',
}).then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
