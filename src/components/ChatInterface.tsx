import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ChatInterfaceProps {
  supportProduct?: Product;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

export default function ChatInterface({ supportProduct }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Função para rolar para a última mensagem
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efeito para iniciar chat quando um produto é selecionado
  useEffect(() => {
    if (supportProduct) {
      setIsOpen(true);
      setMessages([]); // Limpar mensagens anteriores
      
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Olá! Gostaria de falar sobre o produto "${supportProduct.name}"`,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages([initialMessage]);
      
      // Resposta do bot com opções
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Como posso ajudar você com o ${supportProduct.name}?`,
          sender: 'bot',
          timestamp: new Date(),
          options: [
            'Problemas técnicos',
            'Informações adicionais',
            'Garantia'
          ]
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  }, [supportProduct]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    // Adicionar a seleção do usuário como mensagem
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: option,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Resposta do bot baseada na opção selecionada
    setTimeout(() => {
      let responseText = '';
      switch (option) {
        case 'Problemas técnicos':
          responseText = `Para problemas técnicos com o ${supportProduct?.name}, por favor descreva o problema específico que está enfrentando.`;
          break;
        case 'Informações adicionais':
          responseText = `Que tipo de informação adicional você gostaria de saber sobre o ${supportProduct?.name}?`;
          break;
        case 'Garantia':
          responseText = `O ${supportProduct?.name} possui garantia de 12 meses contra defeitos de fabricação. Posso ajudar com mais informações sobre a garantia?`;
          break;
        default:
          responseText = 'Como posso ajudar você?';
      }

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
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

    // Resposta genérica do bot
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Entendi sua mensagem. Como posso ajudar mais?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-gray-800 rounded-lg shadow-xl transition-all duration-300 z-50 ${
      isOpen ? 'h-[600px]' : 'h-16'
    }`}>
      <div 
        className="bg-indigo-600 p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
        onClick={toggleChat}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="text-white" />
          <h2 className="text-white font-semibold">Suporte ao Cliente</h2>
        </div>
        <button className="text-white hover:text-gray-200 transition-colors">
          {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ height: 'calc(600px - 8rem)' }}
          >
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
                {message.options && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}