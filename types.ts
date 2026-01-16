import React from 'react';

export interface Service {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

export type TicketStatus = 'aberto' | 'fechado';
export type TicketCategory = 'manutencao' | 'redes' | 'software' | 'remoto' | 'outro';
export type ServiceType = 'remoto' | 'presencial';

export interface Ticket {
  id: number;
  userEmail: string;
  name: string;
  contact: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  createdAt: string;
  serviceType: ServiceType;
  address?: string;
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  password: string;
}
