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
  const [purchasedProducts, setPurchasedProducts] = useState<PurchaseWithProduct[]>([]);
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

      if (!data || typeof data !== 'object') {
        throw new Error('Dados inválidos recebidos do servidor');
      }

      const dataArray = Array.isArray(data) ? data : [data];
      
      if (showPurchased) {
        setPurchasedProducts(dataArray);
      } else {
        const processedProducts = dataArray.map(item => ({
          id: item.id,
          name: item.name,
          price: String(item.price),
          description: item.description || '',
          region: item.region || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setProducts(processedProducts);
      }

      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      if (showPurchased) {
        setPurchasedProducts([]);
      } else {
        setProducts([]);
      }
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
      console.log('Resposta da compra:', data);
      
      if (data.newBalance !== undefined) {
        console.log('Novo saldo:', data.newBalance);
        onPurchaseComplete(Number(data.newBalance));
      } else {
        console.warn('Novo saldo não recebido na resposta');
        const balanceResponse = await fetch(`${apiUrl}/api/customers/${encodeURIComponent(userEmail)}/balance`);
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          onPurchaseComplete(Number(balanceData.balance));
        }
      }
      
      await fetchProducts();
      alert('Compra realizada com sucesso!');
    } catch (err) {
      console.error('Erro na compra:', err);
      alert(err instanceof Error ? err.message : 'Erro ao realizar compra');
    }
  };

  const renderProductCard = (product: Product, isPurchased = false, purchase?: PurchaseWithProduct) => {
    const isSelected = selectedProduct?.id === product.id;

    return (
      <div
        key={product.id}
        className={`bg-gray-800 rounded-lg p-6 shadow-lg transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">
            R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {product.region && (
            <span className="text-sm text-gray-400">
              Região: {product.region}
            </span>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          {isPurchased ? (
            <>
              <span className="text-green-500">
                Comprado em: {new Date(purchase!.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <button
                onClick={() => setSelectedProduct(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Tirar Dúvidas
              </button>
            </>
          ) : (
            <button
              onClick={() => handlePurchase(product)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center">Carregando produtos...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showPurchased
            ? purchasedProducts.map((purchase) => 
                renderProductCard(purchase.Product, true, purchase)
              )
            : products.map((product) => renderProductCard(product))}
        </div>
      )}
    </div>
  );
}