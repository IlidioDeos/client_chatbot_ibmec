import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    };
  }>;
  product_stats: Array<{
    product: {
      name: string;
      price: number;
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
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/purchases/report`);
      if (!response.ok) throw new Error('Erro ao carregar relatório');
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!report) return <div className="text-center py-8">Nenhum dado disponível</div>;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard Administrativo</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total de Vendas</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {report.summary.total_purchases}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Receita Total</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(report.summary.total_revenue)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ticket Médio</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatCurrency(report.summary.average_purchase)}
          </p>
        </div>
      </div>

      {/* Gráfico de Vendas por Dia */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Vendas por Dia</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.daily_stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  formatDistanceToNow(new Date(date), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(date) =>
                  new Date(date).toLocaleDateString('pt-BR')
                }
              />
              <Legend />
              <Bar
                dataKey="total_revenue"
                name="Receita"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="total_purchases"
                name="Vendas"
                fill="#818cf8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">
          Desempenho por Produto
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Produto
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  Preço
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  Vendas
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  Receita
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.product_stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stat.product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(stat.product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {stat.total_purchases}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(stat.total_revenue)}
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