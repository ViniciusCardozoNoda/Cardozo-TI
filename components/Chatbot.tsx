import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XIcon, PaperAirplaneIcon } from './icons';
import { GoogleGenAI, Chat } from '@google/genai';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Olá! Sou o CardoBot, seu assistente virtual da Cardozo TI. Como posso ajudar?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const systemInstruction = `Você é um assistente virtual da Cardozo TI, uma empresa de soluções de informática. Seu nome é CardoBot. Seja amigável, prestativo e conciso.
Sua principal função é responder perguntas sobre os serviços e ajudar os usuários a criar requisições de suporte.

Aqui está a tabela de preços para referência. Os valores são estimativas iniciais e podem mudar após análise técnica.

Tabela de Preços (Estimativa Inicial):
- Manutenção de Computadores:
  - Atendimento Remoto: R$ 90,00
  - Atendimento Presencial: R$ 120,00
- Configuração de Redes:
  - Atendimento Remoto: R$ 120,00
  - Atendimento Presencial: R$ 150,00
- Instalação de Software:
  - Atendimento Remoto: R$ 80,00
  - Atendimento Presencial: R$ 120,00
- Suporte Remoto (categoria específica):
  - Atendimento Remoto: R$ 80,00
- Outros problemas:
  - O valor é 'A consultar'.

Se o usuário perguntar sobre preços, use esta tabela para responder. Sempre mencione que é uma estimativa inicial e o valor final pode variar.
Se você não souber a resposta, peça educadamente para o usuário criar uma requisição de suporte clicando no botão 'Criar Requisição' no topo da página.`;

  const initializeChat = () => {
    if (!chatRef.current) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction,
                },
            });
        } catch (error) {
            console.error("Failed to initialize Gemini Chat:", error);
            // Handle initialization error, maybe show a message to the user
        }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-slide-in-up');
    } else if (animationClass) { // Only run outro animation if it was opened
      setAnimationClass('animate-slide-out-down');
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleToggleChat = () => {
    if (isOpen) {
       setTimeout(() => setIsOpen(false), 300); // Wait for animation
    } else {
       initializeChat();
       setIsOpen(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = { sender: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      const response = await chatRef.current.sendMessage({ message: trimmedInput });
      const botResponse: Message = { sender: 'bot', text: response.text };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
       console.error("Error sending message to Gemini:", error);
       const errorMessage: Message = { sender: 'bot', text: 'Desculpe, estou com um problema no momento. Tente novamente mais tarde.' };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <>
      {isOpen ? (
         <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-80 sm:h-[450px] bg-slate-900 shadow-2xl rounded-none sm:rounded-xl border-t sm:border border-slate-700 flex flex-col z-50 ${animationClass}`}>
          <header className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-none sm:rounded-t-xl">
            <h3 className="text-md font-bold text-white">Assistente Virtual</h3>
            <button onClick={handleToggleChat} className="text-slate-400 hover:text-white transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-200 rounded-lg p-2.5 rounded-bl-none">
                      <div className="flex items-center justify-center gap-1.5">
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-pulse"></span>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full bg-slate-700/50 text-slate-100 px-4 py-2 rounded-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
              <button type="submit" className="bg-sky-600 text-white rounded-full p-2.5 hover:bg-sky-700 transition-colors disabled:bg-slate-600" disabled={!inputValue.trim() || isTyping}>
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
            onClick={handleToggleChat}
            className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white rounded-full p-4 shadow-lg z-40 transform hover:scale-110 transition-transform"
            aria-label="Open Chatbot"
        >
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
      )}
    </>
  );
};

export default Chatbot;