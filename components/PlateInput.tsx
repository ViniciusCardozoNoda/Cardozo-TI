import React, { useState, useEffect } from 'react';
import type { Ticket, TicketCategory, ServiceType } from '../types';
import Loader from './Loader';

// Tabela de preços base para orçamento inicial
const PRICING_TABLE: Record<TicketCategory, { remoto?: number; presencial?: number }> = {
  manutencao: {
    remoto: 90.00,
    presencial: 120.00,
  },
  redes: {
    remoto: 120.00,
    presencial: 150.00,
  },
  software: {
    remoto: 80.00,
    presencial: 120.00,
  },
  remoto: { // Categoria "Suporte Remoto" só pode ser remota
    remoto: 80.00,
  },
  outro: {}, // Categoria "Outro" precisa de consulta
};

interface RequestFormProps {
  onSubmit: (request: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'userEmail'>) => void;
  isLoading: boolean;
  error: string | null;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    category: 'manutencao' as TicketCategory,
    description: '',
    serviceType: 'remoto' as ServiceType,
    address: '',
  });

  const [estimatedPrice, setEstimatedPrice] = useState<string>('');

  useEffect(() => {
    const { category, serviceType } = formData;
    
    if (category === 'remoto' && serviceType === 'presencial') {
      // Esta condição não deve ocorrer devido à lógica de desativação,
      // mas é uma salvaguarda.
      setEstimatedPrice('N/A');
      return;
    }

    const price = PRICING_TABLE[category]?.[serviceType];
    
    if (price !== undefined) {
      setEstimatedPrice(`R$ ${price.toFixed(2).replace('.', ',')}`);
    } else {
      setEstimatedPrice('A consultar');
    }
  }, [formData.category, formData.serviceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      // Se o usuário selecionar "Suporte Remoto", força o tipo de serviço para "remoto"
      if (name === 'category' && value === 'remoto') {
        newFormData.serviceType = 'remoto';
      }
      return newFormData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(formData);
    }
  };
  
  const isRemoteCategoryOnly = formData.category === 'remoto';
  
  if (isLoading) {
    return <Loader text="Enviando Requisição..." />;
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          required
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-slate-300 mb-1">Email ou Telefone para Contato</label>
        <input
          type="text"
          name="contact"
          id="contact"
          value={formData.contact}
          onChange={handleChange}
          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Categoria do Problema</label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
        >
          <option value="manutencao">Manutenção de Computadores</option>
          <option value="redes">Configuração de Redes</option>
          <option value="software">Instalação de Software</option>
          <option value="remoto">Suporte Remoto</option>
          <option value="outro">Outro</option>
        </select>
      </div>
       <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Atendimento</label>
        <div className="flex gap-x-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="serviceType"
              value="remoto"
              checked={formData.serviceType === 'remoto'}
              onChange={handleChange}
              className="w-4 h-4 form-radio bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-200">Remoto</span>
          </label>
          <label className={`flex items-center gap-2 transition-opacity ${isRemoteCategoryOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input
              type="radio"
              name="serviceType"
              value="presencial"
              checked={formData.serviceType === 'presencial'}
              onChange={handleChange}
              disabled={isRemoteCategoryOnly}
              className="w-4 h-4 form-radio bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
            />
            <span className="text-slate-200">Presencial</span>
          </label>
        </div>
      </div>
      
      {/* Estimativa de Orçamento */}
      <div className="bg-slate-800/60 p-4 rounded-lg border border-sky-500/30 text-center animate-fade-in">
        <h3 className="font-semibold text-sky-400 mb-1">Estimativa de Orçamento</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{estimatedPrice}</p>
        <p className="text-xs text-slate-400 mt-2">
          *Este é um valor inicial. O preço final pode variar após a análise técnica.
        </p>
      </div>

      {formData.serviceType === 'presencial' && (
        <div className="animate-fade-in">
          <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-1">Endereço Completo para Visita</label>
          <textarea
            name="address"
            id="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade - Estado, CEP 12345-678"
            required
          ></textarea>
        </div>
      )}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Descreva o Problema</label>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          required
        ></textarea>
      </div>
      {error && (
        <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>
      )}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Enviar Requisição
        </button>
      </div>
    </form>
  );
};

export default RequestForm;