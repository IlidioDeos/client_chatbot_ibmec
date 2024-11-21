import React, { useState, useEffect, useCallback } from 'react';
import ProductList from './components/ProductList';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { User, Product } from './types';
import { LogOut, Wallet } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [showPurchased, setShowPurchased] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [balance, setBalance] = useState<string | null>(null);

  const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    
    // Se estiver em produção (railway.app), use a URL do backend em produção
    if (window.location.hostname.includes('railway.app')) {
      return 'https://serverchatbotibmec-production.up.railway.app';
    }
    
    // Em desenvolvimento local
    return 'http://localhost:3000';
  };

  const fetchBalance = useCallback(async (userEmail: string) => {
    try {
      const apiUrl = getApiUrl();
      if (!apiUrl) {
        console.error('VITE_API_URL não está definida');
        throw new Error('API URL não configurada');
      }

      console.log('Configuração atual:', {
        apiUrl,
        isDev: import.meta.env.DEV,
        mode: import.meta.env.MODE,
        baseUrl: window.location.origin
      });
      
      const url = `${apiUrl}/api/customers/${encodeURIComponent(userEmail)}/balance`;
      console.log('Fazendo requisição para:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Saldo recebido:', data);
      setBalance(data.balance);
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    if (user?.email && user.role === 'customer') {
      fetchBalance(user.email);
    }
  }, [user?.email, fetchBalance]);

  const handleLogin = (userData: { email: string; role: string }) => {
    setUser(userData);
    if (userData.role === 'customer') {
      fetchBalance(userData.email);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBalance(null);
    setShowPurchased(false);
    setSelectedProduct(undefined);
  };

  const handlePurchaseComplete = useCallback((newBalance: number) => {
    console.log('Atualizando saldo para:', newBalance);
    setBalance(String(newBalance));
  }, []);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">E-commerce</h1>
            {user?.role === 'customer' ? (
              <>
                <button
                  onClick={() => setShowPurchased(false)}
                  className={`px-3 py-1 rounded transition-colors ${
                    !showPurchased ? 'bg-indigo-500' : 'hover:bg-indigo-500'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setShowPurchased(true)}
                  className={`px-3 py-1 rounded transition-colors ${
                    showPurchased ? 'bg-indigo-500' : 'hover:bg-indigo-500'
                  }`}
                >
                  Meus Produtos
                </button>
              </>
            ) : null}
          </div>
          
          <div className="flex items-center gap-6">
            {user?.role === 'customer' && balance !== null && (
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">
                  R$ {Number(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <span className="text-gray-200">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-gray-200 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        {!user ? (
          <Login onLogin={setUser} />
        ) : user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <ProductList
            showPurchased={showPurchased}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            userEmail={user.email}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}
      </main>
      {user?.role === 'customer' && (
        <ChatInterface supportProduct={selectedProduct} />
      )}
    </div>
  );
}