import type { Ticket } from "../types";

// Em uma aplicação real, estes dados viriam de um banco de dados.
const mockTickets: Ticket[] = [
  { id: 1, userEmail: 'cliente@email.com', name: 'João Silva', contact: 'joao@email.com', category: 'manutencao', description: 'Meu notebook não liga.', status: 'aberto', createdAt: '2024-07-28', serviceType: 'presencial', address: 'Rua das Flores, 123, São Paulo - SP' },
  { id: 2, userEmail: 'outrocliente@email.com', name: 'Maria Oliveira', contact: '5511987654321', category: 'redes', description: 'A internet está muito lenta no escritório.', status: 'aberto', createdAt: '2024-07-27', serviceType: 'remoto' },
  { id: 3, userEmail: 'cliente@email.com', name: 'João Silva', contact: 'joao@email.com', category: 'software', description: 'Preciso de ajuda para instalar o Office.', status: 'fechado', createdAt: '2024-07-26', serviceType: 'remoto' },
  { id: 4, userEmail: 'terceiro@email.com', name: 'Carlos Pereira', contact: 'carlos@email.com', category: 'remoto', description: 'O computador está com muitos pop-ups.', status: 'aberto', createdAt: '2024-07-28', serviceType: 'remoto' },
  { id: 5, userEmail: 'cliente@email.com', name: 'João Silva', contact: 'joao@email.com', category: 'manutencao', description: 'A tela está piscando.', status: 'aberto', createdAt: '2024-07-29', serviceType: 'presencial', address: 'Av. Paulista, 1000, São Paulo - SP' },
];


/**
 * Simulates fetching tickets from a backend server.
 */
export const getMockTickets = async (): Promise<Ticket[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTickets;
}


/**
 * Simulates submitting a support request to a backend server.
 * In a real application, this would be an HTTP POST request.
 * @param request The support request data.
 * @returns A promise that resolves when the request is "sent".
 */
export const submitRequest = async (request: Omit<Ticket, 'id' | 'status' | 'createdAt'>): Promise<Ticket> => {
  console.log("Submitting request:", request);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newTicket: Ticket = {
    ...request,
    id: Math.max(...mockTickets.map(t => t.id)) + 1,
    status: 'aberto',
    createdAt: new Date().toISOString().split('T')[0],
  };

  mockTickets.push(newTicket);

  return newTicket;
};