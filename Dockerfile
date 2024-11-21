FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários primeiro
COPY package*.json ./
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

# Instalar serve globalmente
RUN npm install -g serve

# Expor porta 3000
EXPOSE 3000

# Iniciar o servidor
CMD ["serve", "-s", "dist", "-l", "3000"]