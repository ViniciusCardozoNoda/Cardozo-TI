import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configura o Service Worker com os manipuladores de requisição.
export const worker = setupWorker(...handlers);
