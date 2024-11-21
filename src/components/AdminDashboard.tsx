import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getApiUrl } from '../utils/api';

interface PurchaseReport {
  summary: {
    total_revenue: number;
    total_purchases: number;
    average_purchase: number;
  };
  daily_stats: Array<{
    date: string;
    total_purchases: number;
    total_revenue: number;
    average_purchase: number;
    Product: {
      name: string;
      price: string;
    };
  }>;
  product_stats: Array<{
    product: {
      id: string;
      name: string;
      price: string;
    };
    total_revenue: number;
    total_purchases: number;
  }>;
}

export default function AdminDashboard() {
  const [report, setReport] = useState<PurchaseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      if (!apiUrl) {
        throw new Error('API URL não configurada');
      }

      const endpoint = `${apiUrl}/api/purchases/report`;
      console.log('Fazendo requisição para:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers));
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Resposta de erro:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Tipo de conteúdo inválido: ${contentType}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Formato de dados inválido');
      }
      
      setReport(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando relatório...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Erro ao carregar relatório: {error}
      </div>
    );
  }

  if (!report) {
    return <div className="text-center py-8">Nenhum dado disponível</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Administrativo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total de Vendas</h3>
          <p className="text-2xl">{report.summary.total_purchases}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Receita Total</h3>
          <p className="text-2xl">
            R$ {report.summary.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ticket Médio</h3>
          <p className="text-2xl">
            R$ {report.summary.average_purchase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Vendas por Produto</h3>
        <div className="overflow-x-auto">
          <BarChart
            width={600}
            height={300}
            data={report.product_stats}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product.name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_purchases" fill="#8884d8" name="Quantidade Vendida" />
            <Bar dataKey="total_revenue" fill="#82ca9d" name="Receita Total" />
          </BarChart>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Detalhes por Produto</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Produto</th>
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Vendas</th>
                <th className="px-6 py-3 text-left">Receita</th>
              </tr>
            </thead>
            <tbody>
              {report.product_stats.map((stat) => (
                <tr key={stat.product.id} className="border-t border-gray-700">
                  <td className="px-6 py-4">{stat.product.name}</td>
                  <td className="px-6 py-4">
                    R$ {Number(stat.product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">{stat.total_purchases}</td>
                  <td className="px-6 py-4">
                    R$ {stat.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}