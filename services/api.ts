import type { Ticket, User, TicketStatus } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro desconhecido na API' }));
    throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  login: async (credentials: Pick<User, 'email' | 'password'>): Promise<User> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getTickets: async (): Promise<Ticket[]> => {
    const response = await fetch('/api/tickets');
    return handleResponse(response);
  },

  createTicket: async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt'>): Promise<Ticket> => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    return handleResponse(response);
  },

  updateTicketStatus: async (id: number, status: TicketStatus): Promise<Ticket> => {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
  
  getUsers: async (): Promise<User[]> => {
    const response = await fetch('/api/users');
    return handleResponse(response);
  },

  updateUsers: async (users: User[]): Promise<User[]> => {
     const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    });
    return handleResponse(response);
  },
  
  getWhatsappNumber: async (): Promise<{ number: string }> => {
    const response = await fetch('/api/settings/whatsapp');
    return handleResponse(response);
  },

  updateWhatsappNumber: async (number: string): Promise<{ number: string }> => {
    const response = await fetch('/api/settings/whatsapp', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
    });
    return handleResponse(response);
  },
};
