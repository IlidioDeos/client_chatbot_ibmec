export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Se estiver em produção (railway.app), use a URL do backend em produção
  if (window.location.hostname.includes('railway.app')) {
    return 'https://serverchatbotibmec-production.up.railway.app';
  }
  
  // Em desenvolvimento local
  return 'http://localhost:3000';
}; 