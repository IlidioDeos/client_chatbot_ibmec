# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Criar arquivo .env.production
RUN echo "VITE_API_URL=https://serverchatbotibmec-production.up.railway.app" > .env.production

# Build da aplicação com configurações específicas
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build da aplicação
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta 80 (porta padrão do Railway)
EXPOSE 80

# Iniciar nginx com configuração para Railway
CMD ["nginx", "-g", "daemon off;"]