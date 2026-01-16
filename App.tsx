

import React, { useState, useCallback, useEffect } from 'react';
import Modal from './components/VehicleInfoCard';
import RequestForm from './components/PlateInput';
import { submitRequest, getMockTickets } from './services/geminiService';
import type { Service, Ticket, User, TicketCategory, TicketStatus } from './types';
import Chatbot from './components/Chatbot'; // Import the new Chatbot component
import {
  LaptopIcon,
  WifiIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  WhatsappIcon,
  ArrowRightIcon,
  UserCircleIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  QrCodeIcon,
  PixQrCodePlaceholder,
  HomeIcon,
  CloudIcon,
  TicketIcon,
  UsersIcon,
  ArchiveBoxIcon, // Import the new icon
} from './components/icons';

// Mock users for demonstration
const INITIAL_USERS: User[] = [
  { id: 1, email: 'admin@cardozo.ti', role: 'admin', password: 'admin' },
  { id: 2, email: 'cliente@email.com', role: 'user', password: '1234' },
];

const services: Service[] = [
  { icon: WrenchScrewdriverIcon, title: 'Manutenção Preventiva e Corretiva', description: 'Diagnóstico completo, reparo de hardware, otimização de sistema e remoção de vírus.' },
  { icon: WifiIcon, title: 'Configuração de Redes', description: 'Instalação e configuração de redes Wi-Fi e cabeadas, garantindo segurança e performance.' },
  { icon: LaptopIcon, title: 'Suporte Remoto', description: 'Solução de problemas de software e configurações de forma rápida e segura.' },
  { icon: ShieldCheckIcon, title: 'Segurança e Backup', description: 'Implementação de rotinas de backup e soluções de segurança para proteger seus dados.' },
];

// #################################################################
// # HEADER COMPONENT
// #################################################################
const Header: React.FC<{
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onOpenModal: () => void;
  whatsappUrl: string;
}> = ({ currentUser, onLogout, onNavigate, onOpenModal, whatsappUrl }) => (
  <header className="w-full p-4 sm:p-6 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30 border-b border-slate-800/50">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => onNavigate('home')}>
        Cardozo<span className="text-sky-500">TI</span>
      </h1>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <span className="hidden sm:inline text-slate-400">Olá, {currentUser.role}!</span>
            <button
              onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin_dashboard' : 'user_dashboard')}
              className="hidden sm:inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors" aria-label="Sair">
              <LogoutIcon className="w-6 h-6" />
            </button>
          </>
        ) : (
          <>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
             <button
              onClick={() => onNavigate('login')}
              className="text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={onOpenModal}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              Criar Requisição
            </button>
          </>
        )}
      </div>
    </div>
  </header>
);

// #################################################################
// # PAGES & DASHBOARDS
// #################################################################

// HOME PAGE
const HomePage: React.FC<{
  onOpenModal: () => void;
  whatsappUrl: string;
}> = ({ onOpenModal, whatsappUrl }) => (
  <>
    <section className="text-center px-4 py-16 sm:py-24">
      <div className="container mx-auto">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in">
          Soluções de TI <span className="text-sky-500">rápidas e eficientes</span> para você.
        </h2>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-400 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          De manutenções complexas a suporte remoto, a Cardozo TI resolve seus problemas de tecnologia para que você possa focar no que realmente importa.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button onClick={onOpenModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
            <span>Criar Requisição de Suporte</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            <WhatsappIcon className="w-5 h-5" />
            <span>Contato Urgente</span>
          </a>
        </div>
      </div>
    </section>
    <section id="services" className="px-4 py-16 sm:py-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Nossos Serviços</h2>
          <p className="mt-2 text-slate-400">Tudo que você precisa em um só lugar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(service => (
            <div key={service.title} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-500/10 mb-4 border border-sky-500/20">
                <service.icon className="h-6 w-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

// LOGIN PAGE
const LoginPage: React.FC<{
  onLogin: (user: User) => void;
  users: User[];
}> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 space-y-6 animate-fade-in-scale">
          <h2 className="text-2xl font-bold text-center text-white">Acessar Painel</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors !mt-8">Entrar</button>
        </form>
      </div>
    </div>
  );
};

// ADMIN DASHBOARD
const AdminDashboard: React.FC<{
  currentUser: User;
  tickets: Ticket[];
  onUpdateTicketStatus: (id: number, status: 'aberto' | 'fechado') => void;
  whatsappNumber: string;
  onWhatsappChange: (number: string) => void;
  users: User[];
  onUsersChange: (users: User[]) => void;
  onUpdateUserPassword: (userId: number, newPass: string) => void;
}> = ({ currentUser, tickets, onUpdateTicketStatus, whatsappNumber, onWhatsappChange, users, onUsersChange, onUpdateUserPassword }) => {
  const [adminView, setAdminView] = useState('dashboard'); // 'dashboard', 'tickets', 'history', 'users', 'account', 'settings'
  const [localUsers, setLocalUsers] = useState(() => JSON.parse(JSON.stringify(users)));
  const [newPasswords, setNewPasswords] = useState<Record<number, string>>({});
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>('todos');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'todas'>('todas');
  
  // State for changing admin's own password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeFeedback, setPasswordChangeFeedback] = useState({ type: '', message: '' });


  useEffect(() => {
    setLocalUsers(JSON.parse(JSON.stringify(users)));
  }, [users]);
  
  const filteredTickets = tickets.filter(ticket => {
      const statusMatch = statusFilter === 'todos' || ticket.status === statusFilter;
      const categoryMatch = categoryFilter === 'todas' || ticket.category === categoryFilter;
      return statusMatch && categoryMatch;
    }).sort((a, b) => b.id - a.id); // Sort by most recent

  const handleEmailChange = (index: number, newEmail: string) => {
    const updatedUsers = [...localUsers];
    updatedUsers[index] = { ...updatedUsers[index], email: newEmail };
    setLocalUsers(updatedUsers);
  };

  const handlePasswordChange = (userId: number, newPass: string) => {
      setNewPasswords(prev => ({ ...prev, [userId]: newPass }));
  };

  const handleSaveChanges = () => {
      const finalUsers = localUsers.map((user: User) => {
          const newPassword = newPasswords[user.id];
          if (newPassword && newPassword.trim()) {
              return { ...user, password: newPassword.trim() };
          }
          return user;
      });
      onUsersChange(finalUsers);
      setNewPasswords({});
      alert('Usuários atualizados com sucesso!');
  };

  const handleAdminPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeFeedback({ type: '', message: '' });

    if (currentUser.password !== currentPassword) {
      setPasswordChangeFeedback({ type: 'error', message: 'A senha atual está incorreta.' });
      return;
    }
    if (!newPassword || newPassword !== confirmNewPassword) {
      setPasswordChangeFeedback({ type: 'error', message: 'As novas senhas não coincidem ou estão em branco.' });
      return;
    }

    onUpdateUserPassword(currentUser.id, newPassword);
    setPasswordChangeFeedback({ type: 'success', message: 'Senha alterada com sucesso!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'tickets', label: 'Chamados', icon: TicketIcon },
    { id: 'history', label: 'Histórico', icon: ArchiveBoxIcon },
    { id: 'users', label: 'Usuários', icon: UsersIcon },
    { id: 'account', label: 'Minha Conta', icon: UserCircleIcon },
    { id: 'settings', label: 'Configurações', icon: CogIcon },
  ];

  const openTickets = tickets.filter(t => t.status === 'aberto').length;
  const closedTickets = tickets.length - openTickets;

  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const Chart: React.FC<{ data: { label: string; value: number }[]; title: string }> = ({ data, title }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 h-full">
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-3 items-center gap-2 text-sm">
            <span className="text-slate-400 truncate capitalize">{label}</span>
            <div className="col-span-2 bg-slate-700 rounded-full h-4">
              <div className="bg-sky-500 h-4 rounded-full text-xs text-white text-right pr-2 flex items-center justify-end" style={{ width: `${(value / tickets.length) * 100}%` }}>
                {value > 0 ? value : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="lg:w-64">
          <nav className="flex flex-row lg:flex-col gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setAdminView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  adminView === item.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {adminView === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Chart title="Status dos Chamados" data={[{ label: 'Abertos', value: openTickets }, { label: 'Fechados', value: closedTickets }]} />
                <Chart title="Chamados por Categoria" data={Object.entries(ticketsByCategory).map(([key, value]) => ({ label: key, value: value }))} />
              </div>
            </div>
          )}

          {adminView === 'tickets' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Gerenciar Chamados em Aberto</h2>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-slate-300">ID</th>
                        <th className="p-4 text-sm font-semibold text-slate-300">Cliente</th>
                         <th className="p-4 text-sm font-semibold text-slate-300 hidden md:table-cell">Tipo</th>
                        <th className="p-4 text-sm font-semibold text-slate-300 hidden md:table-cell">Categoria</th>
                        <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-300">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.filter(t => t.status === 'aberto').map(ticket => (
                        <tr key={ticket.id} className="border-t border-slate-800">
                          <td className="p-4 text-slate-400 align-top">#{ticket.id}</td>
                          <td className="p-4 text-white font-medium align-top">
                             {ticket.name}
                            {ticket.serviceType === 'presencial' && ticket.address && (
                              <p className="text-xs text-slate-500 font-normal mt-1 max-w-xs">{ticket.address}</p>
                            )}
                          </td>
                          <td className="p-4 text-slate-400 hidden md:table-cell align-top capitalize">
                            <div className="flex items-center gap-2">
                                {ticket.serviceType === 'presencial' ? <HomeIcon className="w-4 h-4 text-sky-400 shrink-0" /> : <CloudIcon className="w-4 h-4 text-sky-400 shrink-0" />}
                                <span>{ticket.serviceType}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-400 hidden md:table-cell align-top capitalize">{ticket.category}</td>
                          <td className="p-4 text-slate-400 align-top">
                            <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap bg-amber-500/20 text-amber-400`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-4 align-top">
                            <button onClick={() => onUpdateTicketStatus(ticket.id, 'fechado')} className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-1 px-3 rounded-md transition">
                              Fechar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminView === 'history' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Histórico de Chamados</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex-1">
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-400 mb-1">Filtrar por Status</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as TicketStatus | 'todos')}
                    className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  >
                    <option value="todos">Todos</option>
                    <option value="aberto">Aberto</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>
                <div className="flex-1">
                   <label htmlFor="categoryFilter" className="block text-sm font-medium text-slate-400 mb-1">Filtrar por Categoria</label>
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value as TicketCategory | 'todas')}
                    className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  >
                    <option value="todas">Todas</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="redes">Redes</option>
                    <option value="software">Software</option>
                    <option value="remoto">Remoto</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-slate-900/50">
                       <tr>
                         <th className="p-4 text-sm font-semibold text-slate-300">ID</th>
                         <th className="p-4 text-sm font-semibold text-slate-300">Cliente</th>
                         <th className="p-4 text-sm font-semibold text-slate-300 hidden lg:table-cell">Categoria</th>
                         <th className="p-4 text-sm font-semibold text-slate-300 hidden md:table-cell">Data</th>
                         <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                         <th className="p-4 text-sm font-semibold text-slate-300">Ação</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                         <tr key={ticket.id} className="border-t border-slate-800">
                           <td className="p-4 text-slate-400">#{ticket.id}</td>
                           <td className="p-4 text-white font-medium">{ticket.name}</td>
                           <td className="p-4 text-slate-400 hidden lg:table-cell capitalize">{ticket.category}</td>
                           <td className="p-4 text-slate-400 hidden md:table-cell">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                           <td className="p-4">
                             <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${ticket.status === 'aberto' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                               {ticket.status}
                             </span>
                           </td>
                           <td className="p-4">
                              {ticket.status === 'fechado' && (
                                <button 
                                  onClick={() => onUpdateTicketStatus(ticket.id, 'aberto')} 
                                  className="bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold py-1 px-3 rounded-md transition"
                                >
                                  Reabrir
                                </button>
                              )}
                           </td>
                         </tr>
                       )) : (
                         <tr>
                          <td colSpan={6} className="text-center p-8 text-slate-500">Nenhum chamado encontrado com os filtros selecionados.</td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

           {adminView === 'users' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Gerenciar Usuários</h2>
              <div className="max-w-2xl mx-auto space-y-6">
                {localUsers.map((user: User, index: number) => (
                  <div key={user.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80">
                    <p className="text-sm font-bold text-sky-400 mb-4 uppercase">PERFIL: {user.role}</p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`email-${user.id}`} className="block text-sm font-medium text-slate-300 mb-1">Email de Acesso</label>
                        <input
                          type="email"
                          id={`email-${user.id}`}
                          value={user.email}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition disabled:opacity-50"
                          disabled={user.role === 'admin'}
                        />
                         {user.role === 'admin' && <p className="text-xs text-slate-500 mt-1">O email do administrador não pode ser alterado.</p>}
                      </div>
                      <div>
                        <label htmlFor={`password-${user.id}`} className="block text-sm font-medium text-slate-300 mb-1">Nova Senha</label>
                        <input
                          type="password"
                          id={`password-${user.id}`}
                          placeholder="Deixe em branco para não alterar"
                          value={newPasswords[user.id] || ''}
                          onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                          className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                 <div className="pt-4">
                    <button onClick={handleSaveChanges} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">
                      Salvar Alterações
                    </button>
                  </div>
              </div>
            </div>
          )}
          
          {adminView === 'account' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Minha Conta</h2>
              <div className="max-w-md mx-auto bg-slate-800/50 p-6 rounded-xl border border-slate-700/80">
                <form onSubmit={handleAdminPasswordChange} className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Alterar Minha Senha</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Senha Atual</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nova Senha</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar Nova Senha</label>
                    <input 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                      className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
                  </div>
                  {passwordChangeFeedback.message && (
                    <p className={`text-sm ${passwordChangeFeedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordChangeFeedback.message}
                    </p>
                  )}
                  <div className="pt-2">
                     <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">
                      Salvar Nova Senha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {adminView === 'settings' && (
             <div>
              <h2 className="text-3xl font-bold text-white mb-8">Configurações</h2>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80 max-w-md">
                <h3 className="text-lg font-bold text-white mb-4">Contato</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Número do WhatsApp</label>
                  <input type="text" value={whatsappNumber} onChange={e => onWhatsappChange(e.target.value)} className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" placeholder="5511999999999" />
                   <p className="text-xs text-slate-500 mt-2">Este número será usado no botão de contato do site.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// USER DASHBOARD
const UserDashboard: React.FC<{
  tickets: Ticket[];
  user: User;
}> = ({ tickets, user }) => {
  const userTickets = tickets.filter(t => t.userEmail === user.email);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const generateQrCode = () => {
    if (!paymentAmount) return;
    const amount = parseFloat(paymentAmount).toFixed(2).replace('.', ',');
    const text = `Pagamento para Cardozo TI: R$ ${amount}`;
    // Using a public API for QR code generation
    setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(text)}`);
  };
  
  const handleBackFromQr = () => {
    setQrCodeData(null);
    setPaymentAmount('');
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-white">Meu Painel</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Meus Chamados</h3>
          <div className="space-y-4">
            {userTickets.length > 0 ? userTickets.map(ticket => (
              <div key={ticket.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-white">Chamado #{ticket.id} - <span className="capitalize">{ticket.category}</span></p>
                    <span className={`px-2 py-1 text-xs rounded-full ${ticket.status === 'aberto' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                        {ticket.status}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{ticket.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-700 pt-2 mt-2">
                    {ticket.serviceType === 'presencial' ? <HomeIcon className="w-4 h-4" /> : <CloudIcon className="w-4 h-4" />}
                    <span className="capitalize">{ticket.serviceType}</span>
                    {ticket.serviceType === 'presencial' && ticket.address && (
                        <span className="text-slate-500 truncate">- {ticket.address}</span>
                    )}
                </div>
              </div>
            )) : <p className="text-slate-400">Você ainda não abriu nenhum chamado.</p>}
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80">
          <h3 className="text-xl font-bold text-white mb-4">Efetuar Pagamento</h3>
          {!qrCodeData ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Valor (R$)</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="50,00" className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition" />
              </div>
              <button onClick={generateQrCode} disabled={!paymentAmount} className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors">
                <QrCodeIcon className="w-5 h-5" />
                Gerar PIX QR Code
              </button>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <p className="text-slate-300 mb-2">Pague <span className="font-bold text-white">R$ {parseFloat(paymentAmount).toFixed(2)}</span> via PIX</p>
              <div className="flex justify-center my-4 p-4 bg-white rounded-lg">
                <img src={qrCodeData} alt="PIX QR Code" width="192" height="192" />
              </div>
              <p className="text-xs text-slate-500 mb-4">Aponte a câmera do seu celular para o QR Code para pagar.</p>
              <button onClick={handleBackFromQr} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Voltar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// #################################################################
// # MAIN APP COMPONENT
// #################################################################
const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento para um serviço de TI.')}`;

  useEffect(() => {
    getMockTickets().then(setTickets);
  }, []);
  
  const handleNavigate = (targetPage: string) => {
    window.scrollTo(0, 0);
    setPage(targetPage);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    handleNavigate(user.role === 'admin' ? 'admin_dashboard' : 'user_dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSubmitted(false);
    setError(null);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormSubmit = useCallback(async (request: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'userEmail'>) => {
    setError(null);
    setIsLoading(true);
    try {
      // In a real app, the userEmail would come from the logged-in user
      const newTicket = await submitRequest({ ...request, userEmail: currentUser?.email || 'visitante@email.com' });
      setTickets(prev => [...prev, newTicket]);
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar sua requisição. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleUpdateTicketStatus = (id: number, status: 'aberto' | 'fechado') => {
    setTickets(currentTickets =>
      currentTickets.map(ticket =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const handleUpdateUserPassword = (userId: number, newPass: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, password: newPass } : user
      )
    );
    // Also update currentUser if it's the one being changed
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPass } : null);
    }
  };
  
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} users={users} />;
      case 'admin_dashboard':
        return currentUser?.role === 'admin' ? <AdminDashboard currentUser={currentUser} tickets={tickets} onUpdateTicketStatus={handleUpdateTicketStatus} whatsappNumber={whatsappNumber} onWhatsappChange={setWhatsappNumber} users={users} onUsersChange={setUsers} onUpdateUserPassword={handleUpdateUserPassword} /> : <HomePage onOpenModal={handleOpenModal} whatsappUrl={whatsappUrl} />;
      case 'user_dashboard':
        return currentUser?.role === 'user' ? <UserDashboard tickets={tickets} user={currentUser} /> : <HomePage onOpenModal={handleOpenModal} whatsappUrl={whatsappUrl} />;
      case 'home':
      default:
        return <HomePage onOpenModal={handleOpenModal} whatsappUrl={whatsappUrl} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-40 transform hover:scale-110 transition-transform sm:hidden" aria-label="Contact on WhatsApp">
        <WhatsappIcon className="w-8 h-8" />
      </a>
      
      <Header currentUser={currentUser} onLogout={handleLogout} onNavigate={handleNavigate} onOpenModal={handleOpenModal} whatsappUrl={whatsappUrl} />
      
      <main className="flex-grow flex flex-col">{renderPage()}</main>

      <footer className="w-full text-center p-6 bg-slate-900">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Cardozo TI. Todos os direitos reservados.</p>
      </footer>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isSubmitted ? "Requisição Enviada" : "Solicitar Orçamento / Abrir Chamado"}>
        {isSubmitted ? (
          <div className="text-center">
            <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Obrigado!</h3>
            <p className="text-slate-300 mb-6">Sua requisição foi enviada com sucesso. Entraremos em contato o mais breve possível.</p>
            <button onClick={handleCloseModal} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Fechar
            </button>
          </div>
        ) : (
          <RequestForm onSubmit={handleFormSubmit} isLoading={isLoading} error={error} />
        )}
      </Modal>

      <Chatbot />
    </div>
  );
};

export default App;
