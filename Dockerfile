# Build stage
FROM node:18-alpine as builder

# Definir variáveis de ambiente para o npm
ENV NODE_ENV=production
ENV VITE_API_URL=https://serverchatbotibmec-production.up.railway.app

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Verificar se os arquivos necessários existem
RUN ls -la

# Build da aplicação com log detalhado
RUN npm run build || (echo "Build failed" && exit 1)

# Production stage
FROM nginx:alpine

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar se a pasta dist foi criada
COPY --from=builder /app/dist /usr/share/nginx/html

# Verificar se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]