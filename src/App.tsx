import React, { useState, useEffect, useCallback } from 'react';
import ProductList from './components/ProductList';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { User, Product } from './types';
import { LogOut, Wallet } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showPurchased, setShowPurchased] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = useCallback(async () => {
    if (user && user.role === 'customer') {
      try {
        const response = await fetch(`http://localhost:3000/api/customers/${user.email}/balance`);
        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
      }
    }
  }, [user]);

  const handleLogin = async (email: string, role: 'admin' | 'customer') => {
    const newUser = {
      id: email,
      email,
      name: email.split('@')[0],
      role,
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setBalance(null);
    setShowPurchased(false);
    setSelectedProduct(undefined);
  };

  // Buscar saldo quando o usuário fizer login
  useEffect(() => {
    fetchBalance();
  }, [user, fetchBalance]);

  const handlePurchaseComplete = (newBalance: number) => {
    setBalance(newBalance);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">E-commerce System</h1>
            {user.role === 'customer' ? (
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
            {user.role === 'customer' && balance !== null && (
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <span className="text-gray-200">{user.email}</span>
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
        {user.role === 'admin' ? (
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
      {user.role === 'customer' && (
        <ChatInterface supportProduct={selectedProduct} />
      )}
    </div>
  );
}