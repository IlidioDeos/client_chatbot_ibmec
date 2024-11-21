FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build da aplicação
RUN npm run build

# Expor a porta que o Vite usa
EXPOSE 5173

# Comando para servir a aplicação em produção
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]