# Build stage
FROM node:18-alpine as builder

# Definir variáveis de ambiente para o npm
ENV NODE_ENV=production

WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instalar dependências com flags específicas para produção
RUN npm ci --only=production

# Copiar o resto dos arquivos
COPY . .

# Criar arquivo .env.production
RUN echo "VITE_API_URL=https://serverchatbotibmec-production.up.railway.app" > .env.production

# Build da aplicação
RUN npm run build

# Production stage com Nginx
FROM nginx:alpine

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]