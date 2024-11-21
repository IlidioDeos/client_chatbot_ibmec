import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getProducts = () => api.get('/products');
export const getPurchases = (customerId: string) => api.get(`/purchases/customer/${customerId}`);
export const createPurchase = (data: { productId: string; customerId: string; quantity?: number }) =>
  api.post('/purchases', data);
export const getSalesReport = () => api.get('/purchases/report');

export default api;