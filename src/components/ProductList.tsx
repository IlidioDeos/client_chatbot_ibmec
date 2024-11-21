import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

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

  const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    
    if (window.location.hostname.includes('railway.app')) {
      return 'https://serverchatbotibmec-production.up.railway.app';
    }
    
    return 'http://localhost:3000';
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      if (!apiUrl) {
        throw new Error('API URL não configurada');
      }

      const endpoint = showPurchased
        ? `${apiUrl}/api/purchases/customer/${encodeURIComponent(userEmail)}`
        : `${apiUrl}/api/products`;
      
      console.log('Fazendo requisição para:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      let processedProducts: Product[];
      
      if (showPurchased) {
        processedProducts = data.map((purchase: any) => ({
          id: purchase.Product?.id || purchase.id,
          name: purchase.Product?.name || purchase.name,
          price: String(purchase.Product?.price || purchase.price),
          description: purchase.Product?.description || purchase.description || '',
          region: purchase.Product?.region || purchase.region,
          createdAt: purchase.Product?.createdAt || purchase.createdAt,
          updatedAt: purchase.Product?.updatedAt || purchase.updatedAt
        }));
      } else {
        processedProducts = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: String(product.price),
          description: product.description || '',
          region: product.region,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
      }
      
      console.log('Produtos processados:', processedProducts);
      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showPurchased, userEmail]);

  const handlePurchase = async (product: Product) => {
    try {
      const apiUrl = getApiUrl();
      if (!apiUrl) {
        throw new Error('API URL não configurada');
      }

      const response = await fetch(`${apiUrl}/api/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
      if (data.newBalance) {
        onPurchaseComplete(Number(data.newBalance));
      }
      
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
      {products.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          {showPurchased ? 'Você ainda não comprou nenhum produto.' : 'Nenhum produto disponível.'}
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-colors ${
              selectedProduct?.id === product.id ? 'border-indigo-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedProduct(product)}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">
                  {Number(product.price).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
                {!showPurchased && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(product);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}