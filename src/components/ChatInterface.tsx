import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface ChatInterfaceProps {
  supportProduct?: Product;
}

export default function ChatInterface({ supportProduct }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [awaitingOptionSelection, setAwaitingOptionSelection] = useState(false);

  useEffect(() => {
    if (supportProduct) {
      setIsMinimized(false);
      setInput(`Gostaria de uma ajuda sobre o produto ${supportProduct.name}`);
      setAwaitingOptionSelection(false);
    }
  }, [supportProduct]);

  useEffect(() => {
    // Mensagem inicial do bot
    setMessages([
      {
        id: '1',
        text: 'Olá! Como posso ajudar você hoje?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSupportOptions = () => {
    const options = [
      'Como usar o produto',
      'Problemas técnicos',
      'Garantia',
      'Troca ou devolução',
    ];

    const optionsMessage: ChatMessage = {
      id: Date.now().toString(),
      text: 'Por favor, selecione uma opção:',
      sender: 'bot',
      timestamp: new Date(),
      options,
    };

    setMessages(prev => [...prev, optionsMessage]);
    setAwaitingOptionSelection(true);
  };

  const handleOptionSelect = (option: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: option,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setAwaitingOptionSelection(false);

    // Simular resposta do bot baseada na opção selecionada
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Entendi que você precisa de ajuda com "${option}". Um de nossos especialistas entrará em contato em breve para te ajudar com isso.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Se a mensagem menciona um produto, mostrar opções de suporte
    if (input.toLowerCase().includes('ajuda sobre o produto')) {
      setTimeout(handleSupportOptions, 1000);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="bg-indigo-600 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-white" />
          <h2 className="text-white font-semibold">Suporte ao Cliente</h2>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <Minimize2 size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
            {message.options && (
              <div className="mt-2 space-y-2">
                {message.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !awaitingOptionSelection && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={awaitingOptionSelection}
          />
          <button
            onClick={handleSend}
            disabled={awaitingOptionSelection}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}