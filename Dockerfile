# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o resto dos arquivos
COPY . .

# Criar arquivo .env.production
RUN echo "VITE_API_URL=https://serverchatbotibmec-production.up.railway.app" > .env.production

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar arquivos de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]