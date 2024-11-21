# Build stage
FROM node:18-alpine as builder

# Definir variáveis de ambiente para o npm
ENV NODE_ENV=production
ENV VITE_API_URL=https://serverchatbotibmec-production.up.railway.app

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]