import React, { useState } from 'react';
import { LogIn, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, role: 'admin' | 'customer') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simples verificação para determinar o papel do usuário
    const role = email.includes('admin') ? 'admin' : 'customer';
    onLogin(email, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Card de informações */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Contas para Teste</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border border-blue-100">
              <h4 className="font-semibold text-indigo-600 mb-2">Conta Admin</h4>
              <p className="text-gray-600">Email: admin@example.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Acesso ao dashboard administrativo com métricas de vendas e visualização de dados
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-blue-100">
              <h4 className="font-semibold text-indigo-600 mb-2">Conta Cliente</h4>
              <p className="text-gray-600">Email: cliente@example.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Acesso à loja para comprar produtos e solicitar suporte
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de login */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Bem-vindo ao E-commerce
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Digite seu e-mail para continuar
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="seu@email.com"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}