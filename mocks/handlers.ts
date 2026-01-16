import { http, HttpResponse } from 'msw';
import type { User, Ticket, TicketStatus } from '../types';

// --- SIMULAÇÃO DE BANCO DE DADOS (usando localStorage) ---
const USERS_STORAGE_KEY = 'cardozo_ti_users_api';
const TICKETS_STORAGE_KEY = 'cardozo_ti_tickets_api';
const WHATSAPP_STORAGE_KEY = 'cardozo_ti_whatsapp_api';

const INITIAL_USERS: User[] = [
  { id: 1, email: 'admin@cardozo.ti', role: 'admin', password: 'admin' },
  { id: 2, email: 'cliente@email.com', role: 'user', password: '1234' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 1, userEmail: 'cliente@email.com', name: 'João Silva', contact: 'joao@email.com', category: 'manutencao', description: 'Meu notebook não liga.', status: 'aberto', createdAt: '2024-07-28', serviceType: 'presencial', address: 'Rua das Flores, 123, São Paulo - SP' },
  { id: 2, userEmail: 'outrocliente@email.com', name: 'Maria Oliveira', contact: '5511987654321', category: 'redes', description: 'A internet está muito lenta no escritório.', status: 'aberto', createdAt: '2024-07-27', serviceType: 'remoto' },
  { id: 3, userEmail: 'cliente@email.com', name: 'João Silva', contact: 'joao@email.com', category: 'software', description: 'Preciso de ajuda para instalar o Office.', status: 'fechado', createdAt: '2024-07-26', serviceType: 'remoto' },
];

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao ler do localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao escrever no localStorage key “${key}”:`, error);
  }
};

let users: User[] = getFromStorage(USERS_STORAGE_KEY, INITIAL_USERS);
let tickets: Ticket[] = getFromStorage(TICKETS_STORAGE_KEY, INITIAL_TICKETS);
let whatsappNumber: string = getFromStorage(WHATSAPP_STORAGE_KEY, '5511999999999');

// --- MANIPULADORES DE API (HANDLERS) ---
export const handlers = [
  // --- AUTENTICAÇÃO ---
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    await new Promise(res => setTimeout(res, 500)); // Simula latência de rede

    if (user) {
      return HttpResponse.json(user);
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
  }),

  // --- CHAMADOS (TICKETS) ---
  http.get('/api/tickets', () => {
    return HttpResponse.json(tickets);
  }),
  
  http.post('/api/tickets', async ({ request }) => {
    const newTicketData = await request.json() as any;
    const newTicket: Ticket = {
      ...newTicketData,
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      status: 'aberto',
      createdAt: new Date().toISOString().split('T')[0],
    };
    tickets = [...tickets, newTicket];
    saveToStorage(TICKETS_STORAGE_KEY, tickets);
    return HttpResponse.json(newTicket, { status: 201 });
  }),

  http.patch('/api/tickets/:id', async ({ request, params }) => {
    const { id } = params;
    const { status } = await request.json() as { status: TicketStatus };
    let updatedTicket: Ticket | undefined;
    
    tickets = tickets.map(ticket => {
      if (ticket.id === Number(id)) {
        updatedTicket = { ...ticket, status };
        return updatedTicket;
      }
      return ticket;
    });

    if (updatedTicket) {
      saveToStorage(TICKETS_STORAGE_KEY, tickets);
      return HttpResponse.json(updatedTicket);
    }
    return HttpResponse.json({ message: 'Chamado não encontrado' }, { status: 404 });
  }),
  
  // --- USUÁRIOS (Admin) ---
  http.get('/api/users', () => {
     return HttpResponse.json(users);
  }),
  
  http.put('/api/users', async ({ request }) => {
    const updatedUsers = await request.json() as User[];
    users = updatedUsers;
    saveToStorage(USERS_STORAGE_KEY, users);
    return HttpResponse.json(users);
  }),
  
  // --- CONFIGURAÇÕES (Admin) ---
  http.get('/api/settings/whatsapp', () => {
    return HttpResponse.json({ number: whatsappNumber });
  }),

  http.put('/api/settings/whatsapp', async ({ request }) => {
    const { number } = await request.json() as { number: string };
    whatsappNumber = number;
    saveToStorage(WHATSAPP_STORAGE_KEY, whatsappNumber);
    return HttpResponse.json({ number: whatsappNumber });
  }),
];
