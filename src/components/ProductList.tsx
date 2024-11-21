import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ShoppingCart, MessageCircle } from 'lucide-react';

interface ProductListProps {
  showPurchased: boolean;
  selectedProduct: Product | undefined;
  setSelectedProduct: (product: Product | undefined) => void;
  userEmail: string;
  onPurchaseComplete: (newBalance: number) => void;
}

export default function ProductList({
  showPurchased,
  selectedProduct,
  setSelectedProduct,
  userEmail,
  onPurchaseComplete,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, [showPurchased]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const endpoint = showPurchased
        ? `${API_URL}/api/purchases?customerId=${userEmail}`
        : `${API_URL}/api/products`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      const data = await response.json();
      setProducts(showPurchased ? data.map((p: any) => p.Product) : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/api/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerId: userEmail,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao realizar compra');
      }

      const data = await response.json();
      // Atualizar o saldo no componente pai
      if (typeof data.newBalance === 'number') {
        onPurchaseComplete(data.newBalance);
      } else {
        // Se não receber o novo saldo, buscar o saldo atualizado
        const balanceResponse = await fetch(`${API_URL}/api/customers/${userEmail}/balance`);
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          onPurchaseComplete(balanceData.balance);
        }
      }
      
      // Atualizar a lista de produtos
      await fetchProducts();
      
      alert('Compra realizada com sucesso!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao realizar compra');
    }
  };

  if (loading) return <div className="text-center">Carregando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex gap-2">
              {!showPurchased && (
                <button
                  onClick={() => handlePurchase(product)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Comprar</span>
                </button>
              )}
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Suporte</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}